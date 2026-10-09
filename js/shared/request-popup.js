/*
 * THE SHARED LIFECYCLE (Sprint 4, S04-B; decision 75, rule C19; PRC-08): what every game goes through, built once here so
 * no game can skip it. Cook (js/cook) and the clinic (js/clinic, through js/shared/host.js) call Lifecycle at every
 * stage boundary and never RequestPopup, VoiceStop or the end screen on their own:
 *
 *   await Lifecycle.request(opts)   (1) a play phase that gives an order opens with the request pop-up (below), read out,
 *                                   then folded into the sidebar
 *   await Lifecycle.advance(o)      (2) the outcome is obvious: the game moves on by itself after a short beat (no ✓,
 *                                   Next or stage button). o: {ready: Promise (capped, e.g. the line being said), ms, wait}
 *   Lifecycle.stageEnd(reason)      (3) a stage or game ended: every voice stops (the one voice layer below), every speech
 *                                   bubble goes, every onStageEnd hook runs
 *   Lifecycle.results(R, opts)      (3)+(5) the end screen: stageEnd("end"), then R.show(opts) (js/shared/results.js
 *                                   steps the badges in one, two, three)
 *   Lifecycle.bubble.place(b, head, layer, {avoid})   (4) one bubble placement for every mode: above the speaker's head,
 *                                   below it when there's no room above; sets data-njg-place and --njg-tail-x (the tail,
 *                                   css/shared/order-card.css)
 *   Lifecycle.talk                  one talk animation for every mode (ART-13, Z10): about a third of the old bob, slower.
 *                                   talk.phaser(scene, img, {dir}) -> stop()   talk.dom(el) -> stop()   talk.SPEC
 *   Lifecycle.voice                 THE ONE VOICE LAYER (SH-66): every player registers here (the core's js/core/voice.js
 *                                   channels and <audio>, the clinic's Kit.Voice, Cook's read-along), so one stop silences
 *                                   everything: voice.stop(reason) voice.gen() voice.track(audio, onCut) voice.onStop(fn)
 *   Lifecycle.onStageEnd(fn) -> off()   Lifecycle.log   (what happened when: {what, reason, t}; the contract checks read it)
 *
 * The request pop-up and the voice stop (Sprint 3, S03-A; decision 53, CLN-84, SH-64, CLN-109). One pop-up for every
 * mode: Cook's requests, the pharmacy's prescription and every heal game open with it before play starts.
 *
 *   The pop-up: the person's card at full size over the play area, read out row by row (the read-along, the host's
 *   own); a tap anywhere cuts the voice at once and folds the card into the sidebar card; after the read-out and a
 *   short beat it folds by itself. Then the game is quiet: the whole card is read ONLY here.
 *
 *   const r = await RequestPopup.open({
 *     host,          // the play area the veil covers (made by the pop-up). Or:
 *     el,            // an existing pop-up (Cook's #intro): shown (class "hidden" off) and hidden again
 *     card,          // with el: the element that flies into the sidebar (default el.firstElementChild)
 *     build(body),   // with host: draw the card into the pop-up's card box (OrderCard.card(data, {big: true}) or a
 *                    //   Kit.Card made with {big: true})
 *     read(),        // the read-out while it's up (a Promise; the host lights each row as it's said)
 *     target,        // the sidebar card it folds into (an element, or a function returning one)
 *     hold: 700,     // ms after the read-out before it folds by itself
 *     wait(ms),      // the host's timer (test speed); default setTimeout
 *     fast,          // test speed: no fly, short beats
 *     ignore(ev),    // true: this tap is not a tap-through (Cook's face = replay)
 *     onStop(),      // a tap-through: the host's own stop (its read-along token) besides VoiceStop.stop()
 *     onTap(ev),     // any tap on it (before the fold)
 *   });            // -> {skipped}: resolves once the card is in the sidebar
 *   RequestPopup.isOpen()   RequestPopup.close()  (the open one folds now, as a tap would, without the voice stop)
 *   RequestPopup.fly(cardEl, targetEl, {fast})   the fold animation alone (Promise)
 *
 *   The voice stop: one switch for every voice on the page (the clinic's Kit.Voice, Cook's player, the device voice).
 *   VoiceStop.stop(reason)   cut everything now: the generation goes up (a line already chained on a queue checks
 *                            VoiceStop.gen() before it plays and skips), every tracked clip is paused, the device
 *                            voice is cancelled, every onStop hook runs
 *   VoiceStop.gen()          the current generation (take it when a line is queued; play only if it's unchanged)
 *   VoiceStop.track(audio, onCut) -> untrack()   a playing HTMLAudioElement; stop() pauses it and calls onCut
 *   VoiceStop.onStop(fn) -> off()               a player's own stop (Cook's Web Audio source, the core's channels)
 *
 * Plain <script>: window.Lifecycle, window.RequestPopup, window.VoiceStop (and Shared.lifecycle, Shared.requestPopup,
 * Shared.voiceStop). Styles:
 * css/shared/order-card.css ("the request pop-up"), the same look as Cook's #intro.
 */
(function (root) {
  "use strict";

  /* ---------------- the voice stop ---------------- */
  let generation = 0;
  const clips = new Map(); // audio -> onCut
  const hooks = new Set();
  const VoiceStop = {
    gen: () => generation,
    track(audio, onCut) {
      if (!audio) return () => {};
      clips.set(audio, onCut || null);
      return () => clips.delete(audio);
    },
    onStop(fn) {
      hooks.add(fn);
      return () => hooks.delete(fn);
    },
    stop(reason) {
      generation++;
      VoiceStop.last = { reason: reason || "", at: Date.now(), gen: generation };
      [...clips.entries()].forEach(([a, onCut]) => {
        clips.delete(a);
        try {
          a.pause();
        } catch (e) {
          /* gone */
        }
        try {
          if (onCut) onCut();
        } catch (e) {
          /* the player's problem */
        }
      });
      try {
        if (root.speechSynthesis) root.speechSynthesis.cancel();
      } catch (e) {
        /* no device voice */
      }
      hooks.forEach((fn) => {
        try {
          fn(reason);
        } catch (e) {
          /* the player's problem */
        }
      });
    },
    last: null,
  };

  /* ---------------- the pop-up ---------------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = () => !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const resolveEl = (t) => (typeof t === "function" ? t() : t) || null;

  /** The big card shrinks into the sidebar card's place (Cook's flyIn, now everyone's). */
  async function fly(card, target, { fast = false } = {}) {
    if (!card || !target || fast || reduced() || !card.animate) return;
    const a = card.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    if (!a.width || !b.width) return;
    const s = Math.min(b.width / a.width, 1);
    const anim = card.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${s})`, opacity: 0.3 },
      ],
      { duration: 480, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" }
    );
    await new Promise((resolve) => {
      anim.onfinish = resolve;
      setTimeout(resolve, 700);
    });
  }

  let current = null;
  /**
   * No scroll inside the pop-up (non-negotiable 9, F7): a tall card on a short phone (tooth L3 at 800x360) shrinks as a
   * whole to the veil's height instead of scrolling; nothing is clipped.
   */
  function fitCard(veil, cardEl) {
    if (!veil || !cardEl) return;
    cardEl.style.zoom = "";
    cardEl.removeAttribute("data-fit");
    const cs = root.getComputedStyle ? root.getComputedStyle(veil) : null;
    const pad = cs ? parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) : 0;
    const room = veil.clientHeight - pad;
    const need = cardEl.scrollHeight;
    if (room > 0 && need > room) {
      const k = Math.max(0.5, Math.floor((room / need) * 100) / 100);
      cardEl.style.zoom = String(k);
      cardEl.style.setProperty("--rq-k", String(k));
      cardEl.setAttribute("data-fit", "");
    }
  }

  function open(opts = {}) {
    if (current) current.fold(false);
    const wait = opts.wait || ((ms) => sleep(ms));
    const fast = !!opts.fast;
    let veil;
    let cardEl;
    const made = !opts.el;
    if (made) {
      veil = document.createElement("div");
      veil.className = "njg-rq-veil";
      cardEl = document.createElement("div");
      cardEl.className = "njg-rq-card";
      veil.appendChild(cardEl);
      // the host draws into a body of its own (its card class never restyles the pop-up's shell)
      const body = document.createElement("div");
      body.className = "njg-rq-body";
      cardEl.appendChild(body);
      (opts.host || document.body).appendChild(veil);
      if (opts.build) opts.build(body);
    } else {
      veil = opts.el;
      cardEl = opts.card || veil.firstElementChild;
      veil.classList.remove("hidden");
    }
    veil.classList.add("njg-rq-open");
    fitCard(veil, cardEl);
    return new Promise((resolve) => {
      let over = false;
      const me = {
        el: veil,
        card: cardEl,
        async fold(skipped) {
          if (over) return;
          over = true;
          veil.removeEventListener("click", onTap);
          if (current === me) current = null;
          veil.classList.add("going");
          try {
            await fly(cardEl, resolveEl(opts.target), { fast });
          } catch (e) {
            /* no animation */
          }
          if (made) veil.remove();
          else {
            veil.classList.add("hidden");
            veil.classList.remove("going", "njg-rq-open");
            if (cardEl.getAnimations) cardEl.getAnimations().forEach((x) => x.cancel());
          }
          resolve({ skipped: !!skipped });
        },
      };
      current = me;
      // a tap anywhere is a tap-through: the voice stops at once, then the card folds (CLN-109, SH-64)
      const onTap = (ev) => {
        if (over) return;
        if (opts.ignore && opts.ignore(ev)) return;
        if (opts.onTap) opts.onTap(ev);
        VoiceStop.stop("request-popup");
        if (opts.onStop) opts.onStop();
        me.fold(true);
      };
      veil.addEventListener("click", onTap);
      Promise.resolve()
        .then(() => wait(fast ? 20 : opts.lead != null ? opts.lead : 300))
        .then(() => (!over && opts.read ? opts.read() : null))
        .catch(() => {})
        .then(() => (!over ? wait(fast ? 20 : opts.hold != null ? opts.hold : 700) : null))
        .catch(() => {})
        .then(() => me.fold(false));
    });
  }

  const RequestPopup = {
    open,
    fly,
    isOpen: () => !!current,
    close: () => current && current.fold(false),
  };

  /* ---------------- the lifecycle ---------------- */
  const log = [];
  const note = (what, reason) => {
    log.push({ what, reason: reason || "", t: Date.now() });
    if (log.length > 400) log.splice(0, log.length - 400);
  };
  const endHooks = new Set();
  // the speech bubbles every mode draws (Cook's #bubble, the clinic's .cl-bubble): a stage that ended takes them all
  const BUBBLES = ".cl-bubble, .njg-bubble";
  function clearBubbles() {
    if (typeof document === "undefined") return;
    document.querySelectorAll(BUBBLES).forEach((b) => b.remove());
    const cook = document.getElementById("bubble");
    if (cook) cook.classList.add("hidden");
  }

  /**
   * One bubble placement (SH-68, CLN-86, Z1): above the speaker's head, its tail pointing down at it; when there's no
   * room above, below the head, its tail pointing up. Centred on the head, then kept inside the layer with a margin;
   * a bubble that would land on another speaker (avoid) moves to the other side of the head. head: an element or a
   * rect {left, top, width, height} in page px. Returns "above" | "below" (or null: no head to place by).
   */
  function placeBubble(b, head, layer, o = {}) {
    if (!b || !head) return null;
    const M = o.margin != null ? o.margin : 8;
    const lr = layer && layer.getBoundingClientRect ? layer.getBoundingClientRect() : { left: 0, top: 0, width: root.innerWidth || 1000, height: root.innerHeight || 700 };
    const r0 = head.getBoundingClientRect ? head.getBoundingClientRect() : head;
    // nothing to place by: no box, or an element not drawn (display: none gives an empty box at the corner)
    if (!r0 || ![r0.left, r0.top, r0.width, r0.height].every(Number.isFinite) || (!r0.width && !r0.height && !r0.left && !r0.top)) return null;
    // a point (an anchor with no size) is a head of one pixel there
    let r = { left: r0.left, top: r0.top, width: Math.max(1, r0.width), height: Math.max(1, r0.height) };
    // a speaker given as a whole standing figure (taller than half again its width): its head is the top of it
    if (r.height > r.width * 1.5) {
      const hw = r.width * 0.6;
      r = { left: r.left + (r.width - hw) / 2, top: r.top, width: hw, height: hw };
    }
    b.style.transform = "none";
    b.style.left = "0px";
    b.style.top = "0px";
    const bw = b.offsetWidth;
    const bh = b.offsetHeight;
    const W = lr.width;
    const H = lr.height;
    const hx = r.left - lr.left;
    const hy = r.top - lr.top;
    const cx = hx + r.width / 2;
    const gap = o.gap != null ? o.gap : M + 6; // room for the tail
    const above = hy - gap - bh;
    const below = hy + r.height + gap;
    const fitsAbove = above >= M;
    const fitsBelow = below + bh <= H - M;
    let side = fitsAbove || !fitsBelow ? "above" : "below";
    const x = Math.max(M, Math.min(W - bw - M, cx - bw / 2));
    const yOf = (sd) => Math.max(M, Math.min(H - bh - M, sd === "above" ? above : below));
    let y = yOf(side);
    const hits = (yy) =>
      (o.avoid || []).some((el) => {
        const q = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
        if (!q || !q.width || !q.height) return false;
        const qx = q.left - lr.left;
        const qy = q.top - lr.top;
        return !(x >= qx + q.width || x + bw <= qx || yy >= qy + q.height || yy + bh <= qy);
      });
    if (hits(y)) {
      const other = side === "above" ? "below" : "above";
      if ((other === "above" ? fitsAbove : fitsBelow) && !hits(yOf(other))) {
        side = other;
        y = yOf(side);
      }
    }
    b.style.left = `${Math.round(x)}px`;
    b.style.top = `${Math.round(y)}px`;
    b.dataset.njgPlace = side;
    b.style.setProperty("--njg-tail-x", `${Math.round(Math.max(18, Math.min(bw - 30, cx - x - 9)))}px`);
    return side;
  }

  /*
   * One talk animation (ART-13, Z10: "less bobbing"). Was 6 px and 1.2 degrees every 220 ms in Cook (js/cook/stations.js,
   * flow.js); now about a third of that, and slower. The same numbers drive Phaser (Cook) and the DOM (the clinic).
   */
  const TALK = { lift: 2, tilt: 0.4, ms: 380 };
  const talk = {
    SPEC: TALK,
    /** A Phaser image talking: a small, slow bob from its baseY. Returns stop() (back to rest). */
    phaser(scene, img, o = {}) {
      if (!scene || !img || !scene.tweens) return () => {};
      const y0 = img.baseY != null ? img.baseY : img.y;
      const tw = scene.tweens.add({ targets: img, y: y0 - TALK.lift, angle: (o.dir || 1) * TALK.tilt, duration: TALK.ms, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      return () => {
        try {
          tw.stop();
        } catch (e) {
          /* gone */
        }
        if (img.active !== false) {
          img.y = y0;
          img.angle = 0;
        }
      };
    },
    /** An element talking (the clinic's figures): the same bob in CSS. Returns stop(). */
    dom(el, o = {}) {
      if (!el || !el.classList) return () => {};
      injectTalkCss();
      el.style.setProperty("--njg-talk-dir", String(o.dir || 1));
      el.classList.add("njg-talking");
      return () => el.classList.remove("njg-talking");
    },
  };
  function injectTalkCss() {
    if (typeof document === "undefined" || document.getElementById("njg-talk-css")) return;
    const st = document.createElement("style");
    st.id = "njg-talk-css";
    st.textContent = `@keyframes njg-talk{from{translate:0 0;rotate:0deg}to{translate:0 -${TALK.lift}px;rotate:calc(var(--njg-talk-dir,1) * ${TALK.tilt}deg)}}.njg-talking{animation:njg-talk ${TALK.ms}ms ease-in-out infinite alternate}@media (prefers-reduced-motion:reduce){.njg-talking{animation:none}}`;
    (document.head || document.body).appendChild(st);
  }

  const voice = {
    stop: (reason) => VoiceStop.stop(reason),
    gen: () => VoiceStop.gen(),
    track: (audio, onCut) => VoiceStop.track(audio, onCut),
    onStop: (fn) => VoiceStop.onStop(fn),
  };

  const Lifecycle = {
    log,
    voice,
    talk,
    bubble: { place: placeBubble, clear: clearBubbles },
    /** (1) The request pop-up before a play phase that gives an order (RequestPopup.open's options). */
    request(opts = {}) {
      note("request", opts.reason || "");
      return open(opts);
    },
    isOpen: () => !!current,
    close: () => current && current.fold(false),
    fly,
    /**
     * (2) The outcome is obvious: the game moves on by itself (decision 52, E36; CLN-110, SH-40). Waits for what's under
     * way (o.ready, e.g. the greeting being said; capped at o.cap ms so nothing hangs), then a short beat.
     */
    async advance(o = {}) {
      const w = o.wait || ((ms) => sleep(ms));
      note("advance", o.reason || "");
      if (o.ready) await Promise.race([Promise.resolve(o.ready).catch(() => {}), w(o.cap != null ? o.cap : 6000)]);
      await w(o.ms != null ? o.ms : 500);
    },
    /** (3) A stage or game ended: every voice stops, every bubble goes, the hooks run (the clinic's queue, Cook's read-along). */
    stageEnd(reason) {
      note("stage-end", reason || "");
      VoiceStop.stop(`stage:${reason || ""}`);
      clearBubbles();
      endHooks.forEach((fn) => {
        try {
          fn(reason);
        } catch (e) {
          /* the hook's problem */
        }
      });
    },
    onStageEnd(fn) {
      endHooks.add(fn);
      return () => endHooks.delete(fn);
    },
    /** (3)+(5) The end screen: the voice stops first, then the shared end screen (or a host's stand-in with show()). */
    results(R, opts = {}) {
      Lifecycle.stageEnd("end");
      note("results", (opts && opts.game) || "");
      return R.show(opts);
    },
  };

  root.Lifecycle = Lifecycle;
  root.RequestPopup = RequestPopup;
  root.VoiceStop = VoiceStop;
  root.Shared = root.Shared || {};
  root.Shared.lifecycle = Lifecycle;
  root.Shared.requestPopup = RequestPopup;
  root.Shared.voiceStop = VoiceStop;
})(typeof self !== "undefined" ? self : this);
