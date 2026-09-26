/*
 * The onboarding kit (docs/UX-PRINCIPLES.md s8 and s10; docs/shared-api.md
 * s9): onboarding by showing, not telling. The first time a child meets a
 * station, each step dims everything except one thing, a ghost hand does
 * the action once, then the kit waits for the child to do it before
 * revealing the next thing. No text: an optional audio hook per step.
 *
 * A station's script is a list of steps:
 *   [{spotlight: "#pan", ghost: {from: "#jug", to: "#pan", gesture: "drag"}, wait: "pour-done"},
 *    {spotlight: ["#jug", "#pan"], ghost: {gesture: "tap"}},        // no wait: a tap in the light
 *    {spotlight: "#done", ghost: {gesture: "hold"}, wait: "done", audio: "assets/audio/...mp3"}]
 *
 *   spotlight  what stays lit: a selector, an element, [x, y, w, h] in
 *              page pixels (a canvas game), a function returning any of
 *              these, or a list of them. Touches elsewhere are blocked.
 *   ghost      {gesture, from?, to?, ms?}: "tap", "drag" (from -> to),
 *              "hold", "swipe" (from -> to, or rightwards), "circle-stir"
 *              (round the from/spotlight). from defaults to the spotlight.
 *   wait       the signal name that finishes the step: the mode calls
 *              Onboard.signal("pour-done") when the child has done it.
 *              Default "tap": any tap inside the light.
 *   audio      a URL or a function(step, i), played as the step starts.
 *   idleMs     replay the ghost if nothing happens for this long (default 7000; 0 = never).
 *
 *   await Onboard.run(stationId, script, {force, audio, idleMs, container})
 *     -> "done" | "skipped" | "seen"   ("seen": this profile already had it; nothing shown)
 *   Onboard.signal(name)        the child did the thing
 *   Onboard.fadeIn(el, key?)    UI that appears when first needed: fades in (with a
 *                               soft glow) the first time, instantly after that
 *   Onboard.await(el, key?)     hide it until fadeIn (instantly visible if already seen)
 *   Onboard.seen(stationId) / Onboard.reset(stationId?)
 *   Onboard.machine(script)     the pure state machine under run() (Node tests)
 *
 * A grown-up can skip the whole script: the small button in the top right
 * corner, held for a second (a quick tap does nothing), or Escape.
 * Once per profile per station, through js/shared/uistore.js.
 *
 * Plain <script>: window.Onboard (and Shared.onboard); Node: require().
 */
(function (root, factory) {
  const Onboard = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Onboard;
  else {
    root.Onboard = Onboard;
    (root.Shared = root.Shared || {}).onboard = Onboard;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const Onboard = {};
  const GESTURES = ["tap", "drag", "hold", "swipe", "circle-stir"];
  Onboard.GESTURES = GESTURES;
  const store = () => root.UIStore || (typeof require === "function" ? require("./uistore.js") : null);

  /* ---------------- pure ---------------- */

  /** A step with its defaults filled in. */
  Onboard.normalize = function (step) {
    const s = Object.assign({}, step);
    if (s.ghost && typeof s.ghost === "string") s.ghost = { gesture: s.ghost };
    if (s.ghost) {
      s.ghost = Object.assign({ gesture: "tap" }, s.ghost);
      if (!GESTURES.includes(s.ghost.gesture)) throw new Error(`onboard: unknown gesture "${s.ghost.gesture}"`);
    }
    s.wait = s.wait || "tap";
    return s;
  };
  /** Problems with a script (empty = fine): every step lights something and knows what it waits for. */
  Onboard.validate = function (script) {
    const out = [];
    if (!Array.isArray(script) || !script.length) return ["a script is a non-empty list of steps"];
    script.forEach((st, i) => {
      if (!st || !st.spotlight) out.push(`step ${i}: no spotlight`);
      try {
        const n = Onboard.normalize(st || {});
        if (n.ghost && n.ghost.gesture === "drag" && !n.ghost.to) out.push(`step ${i}: a drag needs ghost.to`);
      } catch (e) {
        out.push(`step ${i}: ${e.message}`);
      }
    });
    return out;
  };

  /**
   * The state machine. phase: idle -> show (the ghost plays) -> wait (the
   * child's turn) -> the next step's show ... -> done. A matching signal in
   * show or wait finishes the step (a child who acts before the ghost ends
   * is not held back). idle() in wait replays the ghost. skip() ends it.
   * Every call returns the new state {phase, index, step, replays}.
   */
  Onboard.machine = function (script) {
    const steps = script.map(Onboard.normalize);
    let phase = "idle";
    let index = -1;
    let replays = 0;
    const log = [];
    const state = () => ({ phase, index, step: steps[index] || null, replays, total: steps.length });
    const enter = (i) => {
      index = i;
      replays = 0;
      if (i >= steps.length) phase = "done";
      else phase = steps[i].ghost ? "show" : "wait";
      log.push(`${phase}:${index}`);
      return state();
    };
    const live = () => phase === "show" || phase === "wait";
    return {
      steps,
      log,
      state,
      start: () => (phase === "idle" ? enter(0) : state()),
      ghostDone() {
        if (phase === "show") {
          phase = "wait";
          log.push(`wait:${index}`);
        }
        return state();
      },
      /** true when this signal finished the step */
      signal(name) {
        if (!live() || steps[index].wait !== name) return false;
        enter(index + 1);
        return true;
      },
      tap() {
        return this.signal("tap");
      },
      idle() {
        if (phase === "wait" && steps[index].ghost) {
          phase = "show";
          replays++;
          log.push(`show:${index}`);
        }
        return state();
      },
      skip() {
        if (phase !== "done") phase = "skipped";
        log.push("skipped");
        return state();
      },
    };
  };

  Onboard.seen = (id) => {
    const S = store();
    return !!(S && S.get("onboarded", id));
  };
  Onboard.reset = (id) => {
    const S = store();
    if (!S) return;
    if (id) return S.set("onboarded", id, false);
    S.clear("onboarded");
    S.clear("seen");
  };

  // the ghost's path for a gesture: keyframes of {x, y, press, ring}
  Onboard.path = function (gesture, from, to, box) {
    const k = [];
    const a = from;
    const b = to || (gesture === "swipe" ? { x: a.x + Math.max(120, (box ? box.w : 0) * 0.6), y: a.y } : a);
    const near = { x: a.x + 46, y: a.y + 56 };
    if (gesture === "tap") {
      k.push({ o: 0, ...near, press: 0 }, { o: 0.4, ...a, press: 0 }, { o: 0.55, ...a, press: 1, ring: 1 }, { o: 0.7, ...a, press: 0 }, { o: 1, ...near, press: 0 });
    } else if (gesture === "hold") {
      k.push({ o: 0, ...near, press: 0 }, { o: 0.2, ...a, press: 0 }, { o: 0.28, ...a, press: 1, ring: 1 }, { o: 0.85, ...a, press: 1 }, { o: 1, ...near, press: 0 });
    } else if (gesture === "drag" || gesture === "swipe") {
      const fast = gesture === "swipe";
      k.push({ o: 0, ...near, press: 0 }, { o: 0.2, ...a, press: 0 }, { o: 0.3, ...a, press: 1 }, { o: fast ? 0.55 : 0.85, ...b, press: 1 }, { o: fast ? 0.7 : 0.92, ...b, press: 0 }, { o: 1, x: b.x + 30, y: b.y + 40, press: 0 });
    } else if (gesture === "circle-stir") {
      const r = Math.max(28, Math.min(box ? Math.min(box.w, box.h) * 0.28 : 50, 90));
      k.push({ o: 0, ...near, press: 0 }, { o: 0.12, x: a.x + r, y: a.y, press: 0 }, { o: 0.16, x: a.x + r, y: a.y, press: 1 });
      const N = 24; // two turns
      for (let i = 1; i <= N; i++) {
        const t = (i / N) * Math.PI * 4;
        k.push({ o: 0.16 + (0.76 * i) / N, x: a.x + r * Math.cos(t), y: a.y + r * 0.8 * Math.sin(t), press: 1 });
      }
      k.push({ o: 1, x: a.x + r + 30, y: a.y + 40, press: 0 });
    }
    return k;
  };
  /* ---------------- the overlay ---------------- */
  if (typeof document === "undefined") return Onboard;

  const reduced = () => !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const PAD = 12;
  const HAND = `<svg viewBox="0 0 64 80" aria-hidden="true"><path d="M20 6c0-3 2-5 5-5s5 2 5 5v26l2-1V24c0-3 2-5 5-5s5 2 5 5v9l2-.5V28c0-3 2-5 5-5s5 2 5 5v7c1.5-2 3-3 5-2.5 2.5.6 3.6 3 3 5.5l-2 16C58 68 50 78 37 78h-4C22 78 16 72 12 64L3 46c-1.4-2.8-.2-5.6 2.3-6.7 2.4-1 4.9 0 6.2 2.2L20 52z" fill="#fff" stroke="#2b1810" stroke-width="3" stroke-linejoin="round"/></svg>`;
  const HOTSPOT = [25, 3]; // the fingertip, in the 64x80 hand box
  const HAND_W = 64;

  function rectOf(t) {
    if (t == null) return null;
    if (typeof t === "function") return rectOf(t());
    if (Array.isArray(t) && t.length === 4 && t.every((n) => typeof n === "number")) return { x: t[0], y: t[1], w: t[2], h: t[3] };
    const el = typeof t === "string" ? document.querySelector(t) : t;
    if (!el || !el.getBoundingClientRect) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  }
  const listOf = (t) => (Array.isArray(t) && !(t.length === 4 && t.every((n) => typeof n === "number")) ? t : [t]);
  const rectsOf = (t) => listOf(t).map(rectOf).filter(Boolean);
  const centre = (r) => (r ? { x: r.x + r.w / 2, y: r.y + r.h / 2 } : null);
  const inside = (p, r) => p.x >= r.x - PAD && p.x <= r.x + r.w + PAD && p.y >= r.y - PAD && p.y <= r.y + r.h + PAD;
  const union = (rs) => {
    if (!rs.length) return null;
    const x0 = Math.min(...rs.map((r) => r.x));
    const y0 = Math.min(...rs.map((r) => r.y));
    return { x: x0, y: y0, w: Math.max(...rs.map((r) => r.x + r.w)) - x0, h: Math.max(...rs.map((r) => r.y + r.h)) - y0 };
  };

  const DUR = { tap: 1500, hold: 2200, drag: 2200, swipe: 1500, "circle-stir": 3000 };

  let active = null;
  const pending = [];
  /** The child did the thing (a mode calls this; also a "njg-onboard" DOM event with detail = name). */
  Onboard.signal = function (name) {
    if (active) active.signal(name);
    return !!active;
  };
  if (typeof document !== "undefined") document.addEventListener("njg-onboard", (e) => Onboard.signal(e.detail));
  Onboard.active = () => active;

  Onboard.run = function (id, script, opts) {
    opts = opts || {};
    if (!opts.force && Onboard.seen(id)) return Promise.resolve("seen");
    if (active) return new Promise((r) => pending.push(() => Onboard.run(id, script, opts).then(r)));
    const problems = Onboard.validate(script);
    if (problems.length) throw new Error(`onboard ${id}: ${problems.join("; ")}`);
    const m = Onboard.machine(script);
    const host = opts.container || document.body;
    const layer = document.createElement("div");
    layer.className = "njg-onboard";
    layer.innerHTML = `
      <svg class="ob-dim" aria-hidden="true"><defs><mask id="ob-mask-${id}"><rect width="100%" height="100%" fill="#fff"/><g class="ob-holes"></g></mask></defs>
        <rect width="100%" height="100%" fill="rgba(30,18,10,0.62)" mask="url(#ob-mask-${id})"/><g class="ob-rings"></g></svg>
      <div class="ob-ghost" aria-hidden="true"><span class="ob-ripple"></span>${opts.hand ? `<img alt="" src="${opts.hand.src}">` : HAND}</div>
      <button class="ob-skip" type="button" aria-label="Skip (grown-ups: hold)"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l9 7-9 7zM18 5v14"/></svg><i class="ob-hold"></i></button>`;
    host.appendChild(layer);
    requestAnimationFrame(() => layer.classList.add("on"));
    const ghost = layer.querySelector(".ob-ghost");
    // opts.hand: a picture hand instead of the drawn one ({src, w, h, hot: the fingertip [x, y], opacity})
    const hot = opts.hand ? opts.hand.hot : HOTSPOT;
    if (opts.hand) {
      const hd = opts.hand;
      Object.assign(ghost.style, { width: `${hd.w}px`, height: `${hd.h}px`, transformOrigin: `${hot[0]}px ${hot[1]}px` });
      ghost.classList.add("picture");
      const im = ghost.querySelector("img");
      Object.assign(im.style, { width: "100%", height: "100%", display: "block", position: "relative", opacity: String(hd.opacity != null ? hd.opacity : 1) });
      const rp = ghost.querySelector(".ob-ripple");
      Object.assign(rp.style, { left: `${hot[0] - 36}px`, top: `${hot[1] - 36}px`, zIndex: 1 });
    }
    const holes = layer.querySelector(".ob-holes");
    const rings = layer.querySelector(".ob-rings");
    const idleMs = (st) => (st.idleMs != null ? st.idleMs : opts.idleMs != null ? opts.idleMs : 7000);
    let lit = [];
    let raf = 0;
    let idleTimer = 0;
    let anim = null;
    let resolveRun;
    const result = new Promise((r) => (resolveRun = r));

    // keep the holes on their targets (things move, the page resizes)
    const NS = "http://www.w3.org/2000/svg";
    const draw = () => {
      const st = m.state().step;
      lit = st ? rectsOf(st.spotlight) : [];
      while (holes.childNodes.length < lit.length) {
        const r = document.createElementNS(NS, "rect");
        r.setAttribute("fill", "#000");
        holes.appendChild(r);
        const g = document.createElementNS(NS, "rect");
        g.setAttribute("class", "ob-ring");
        rings.appendChild(g);
      }
      [...holes.childNodes].forEach((h, i) => {
        const r = lit[i];
        const g = rings.childNodes[i];
        h.style.display = g.style.display = r ? "" : "none";
        if (!r) return;
        for (const el of [h, g]) {
          el.setAttribute("x", r.x - PAD);
          el.setAttribute("y", r.y - PAD);
          el.setAttribute("width", r.w + 2 * PAD);
          el.setAttribute("height", r.h + 2 * PAD);
          el.setAttribute("rx", 18);
        }
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const playAudio = (st, i) => {
      try {
        if (opts.audio) opts.audio(st, i);
        if (typeof st.audio === "function") st.audio(st, i);
        else if (typeof st.audio === "string") new Audio(st.audio).play().catch(() => {});
      } catch (e) { /* audio is optional */ }
    };
    const playGhost = () => {
      const s = m.state();
      const st = s.step;
      if (!st || !st.ghost) return;
      const spot = union(rectsOf(st.spotlight));
      const fromR = st.ghost.from ? union(rectsOf(st.ghost.from)) : spot;
      const toR = st.ghost.to ? union(rectsOf(st.ghost.to)) : null;
      if (!fromR) {
        m.ghostDone();
        return armIdle();
      }
      const keys = Onboard.path(st.ghost.gesture, centre(fromR), centre(toR), fromR);
      const dur = st.ghost.ms || DUR[st.ghost.gesture];
      const tf = (p) => `translate(${p.x - hot[0]}px, ${p.y - hot[1]}px) scale(${p.press ? 0.88 : 1})`;
      ghost.classList.add("on");
      ghost.classList.toggle("hold", st.ghost.gesture === "hold");
      if (anim) anim.cancel();
      if (reduced() || !ghost.animate) {
        // no motion: the hand appears at the start, then at the end, pressed
        const a = keys.find((k) => k.press) || keys[0];
        const b = [...keys].reverse().find((k) => k.press) || a;
        ghost.style.transform = tf(a);
        ghost.classList.add("pressed");
        setTimeout(() => (ghost.style.transform = tf(b)), 700);
        setTimeout(() => {
          ghost.classList.remove("pressed", "on");
          if (m.state().phase === "show" && m.state().index === s.index) {
            m.ghostDone();
            armIdle();
          }
        }, 1500);
        return;
      }
      const frames = keys.map((k, i) => ({ offset: k.o, transform: tf(k), opacity: i === 0 || i === keys.length - 1 ? 0 : 0.95 }));
      anim = ghost.animate(frames, { duration: dur, easing: "ease-in-out", fill: "forwards" });
      // the ripple where the finger presses
      const ripple = ghost.querySelector(".ob-ripple");
      const pressAt = keys.find((k) => k.ring);
      if (pressAt && ripple.animate) ripple.animate([{ opacity: 0, transform: "scale(0.3)" }, { opacity: 0.9, transform: "scale(0.6)", offset: pressAt.o }, { opacity: 0, transform: "scale(1.6)" }], { duration: dur, fill: "forwards" });
      anim.onfinish = () => {
        ghost.classList.remove("on");
        if (m.state().phase === "show" && m.state().index === s.index) {
          m.ghostDone();
          armIdle();
        }
      };
    };
    const armIdle = () => {
      clearTimeout(idleTimer);
      const st = m.state().step;
      if (!st || !st.ghost || !idleMs(st)) return;
      idleTimer = setTimeout(() => {
        if (m.state().phase === "wait") {
          m.idle();
          playGhost();
        }
      }, idleMs(st));
    };
    const begin = () => {
      const s = m.state();
      if (s.phase === "done" || s.phase === "skipped") return end(s.phase);
      layer.dataset.step = s.index;
      if (typeof opts.onStep === "function") opts.onStep(s.step, s.index);
      playAudio(s.step, s.index);
      if (s.phase === "show") playGhost();
      else armIdle();
    };
    const advanced = () => {
      clearTimeout(idleTimer);
      if (anim) anim.cancel();
      ghost.classList.remove("on", "pressed");
      if (root.Sfx) root.Sfx.play("pop", { volume: 0.7 });
      // a short breath between steps, so the child sees what their action did
      layer.classList.add("between");
      setTimeout(() => {
        layer.classList.remove("between");
        begin();
      }, reduced() ? 150 : 450);
    };

    // touches outside the light are blocked; a tap inside is the "tap" signal
    const skipBtn = layer.querySelector(".ob-skip");
    const pt = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      return { x: t.clientX, y: t.clientY };
    };
    const allowed = (e) => skipBtn.contains(e.target) || (!layer.classList.contains("between") && lit.some((r) => inside(pt(e), r)));
    const block = (e) => {
      if (skipBtn.contains(e.target)) return;
      if (!allowed(e)) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    const up = (e) => {
      if (skipBtn.contains(e.target) || !allowed(e)) return;
      // let the game handle the tap first
      setTimeout(() => {
        if (m.tap()) advanced();
      }, 0);
    };
    const EV = ["pointerdown", "mousedown", "touchstart", "click", "dblclick", "contextmenu"];
    EV.forEach((t) => root.addEventListener(t, block, { capture: true, passive: false }));
    root.addEventListener("pointerup", up, true);

    // the grown-up's skip: hold for a second
    let holdT = 0;
    const holdStart = (e) => {
      e.preventDefault();
      skipBtn.classList.add("holding");
      holdT = setTimeout(() => finish("skipped"), 1000);
    };
    const holdEnd = () => {
      skipBtn.classList.remove("holding");
      clearTimeout(holdT);
    };
    skipBtn.addEventListener("pointerdown", holdStart);
    ["pointerup", "pointerleave", "pointercancel"].forEach((t) => skipBtn.addEventListener(t, holdEnd));
    const key = (e) => e.key === "Escape" && finish("skipped");
    root.addEventListener("keydown", key);

    function finish(how) {
      if (how === "skipped") m.skip();
      end(how);
    }
    function end(how) {
      if (!layer.isConnected) return;
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      if (anim) anim.cancel();
      EV.forEach((t) => root.removeEventListener(t, block, { capture: true }));
      root.removeEventListener("pointerup", up, true);
      root.removeEventListener("keydown", key);
      const S = store();
      if (S) S.set("onboarded", id, true);
      layer.classList.remove("on");
      setTimeout(() => layer.remove(), reduced() ? 0 : 300);
      active = null;
      resolveRun(how);
      const next = pending.shift();
      if (next) next();
    }

    active = {
      id,
      machine: m,
      layer,
      signal(name) {
        if (m.signal(name)) advanced();
      },
      skip: () => finish("skipped"),
    };
    m.start();
    begin();
    return result;
  };

  /** Hide a piece of UI until it's first needed (visible at once if this profile has seen it). */
  Onboard.await = function (el, key) {
    if (!el) return el;
    if (key && store() && store().get("seen", key)) el.classList.remove("njg-await");
    else el.classList.add("njg-await");
    return el;
  };
  /** Show it: a gentle fade and glow the first time, instantly after that. Returns true the first time. */
  Onboard.fadeIn = function (el, key) {
    if (!el) return false;
    const S = store();
    const first = !(key && S && S.get("seen", key));
    el.classList.remove("njg-await", "hidden");
    if (el.hidden) el.hidden = false;
    if (first) {
      el.classList.remove("njg-fadein");
      void el.offsetWidth;
      el.classList.add("njg-fadein");
      el.addEventListener("animationend", () => el.classList.remove("njg-fadein"), { once: true });
      if (root.Sfx) root.Sfx.play("pop", { volume: 0.5 });
      if (key && S) S.set("seen", key, true);
    }
    return first;
  };
  return Onboard;
});
