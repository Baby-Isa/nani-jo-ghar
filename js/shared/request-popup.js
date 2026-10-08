/*
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
 * Plain <script>: window.RequestPopup, window.VoiceStop (and Shared.requestPopup, Shared.voiceStop). Styles:
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

  root.RequestPopup = RequestPopup;
  root.VoiceStop = VoiceStop;
  root.Shared = root.Shared || {};
  root.Shared.requestPopup = RequestPopup;
  root.Shared.voiceStop = VoiceStop;
})(typeof self !== "undefined" ? self : this);
