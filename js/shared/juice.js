/*
 * The juice kit (CHAI-92, 6 Nov): the painted effects of art run s17-juice (assets/shared/juice/, cut from
 * sources/art/s17-juice/) and the recorded sounds of the sound library (assets/shared/sfx/, SOURCES.md), by name.
 * Shown first on lab/juice.html; NOT wired into any game yet (the report build/reports/juice-lab-2026-11-06.md has the plan).
 *
 * Every effect is drawn by its own name here, never through Cook.Stations' sparkle/steam stubs (S.verdict draws those by score:
 * filling them would bring back a verdict picture; the second read of build/reports/sound-and-juice-chai-2026-11-06.md).
 * Nothing here is a reward and nothing says right or wrong: every glass gets its sparkle whatever went in.
 *
 *   Juice.sparkle(host, x, y, {w, kind})       a warm gold sparkle: kind 1 one star grows and fades; kind 2 three small twinkles
 *   Juice.steam(host, x, y, {w, thin, every}) -> {stop()}   wisps rising on a slow loop until stopped
 *   Juice.drop(host, x, y0, y1, {w, splash})   the painted last drop (TD cell 1) falls from y0 and lands at y1; splash: "crown"
 *                                              (a small crown at the surface), "dots" (droplets only) or "none"
 *   Juice.crown(host, x, y, {w})               the crown splash alone, with two droplets
 *   Juice.burst(host, x, y, {w, kind, behind}) a soft gold burst: kind 1 the burst; kind 2 the burst and a light sweep across;
 *                                              behind: an element the burst is put just before (so it sits under it)
 *   Juice.sound(name, {volume, dur}) -> {stop()}  one recorded file from assets/shared/sfx/ (<name>.mp3), played once; dur: cut
 *                                              it short with a fade (a short pour)
 *   Juice.less()                               true when the system asks for reduced motion (or ?motion=less): effects then
 *                                              fade in place, nothing moves, nothing loops
 *
 * x, y are px in the host's box (the host is positioned). Each one-shot returns a Promise for its end. Pointer events never
 * reach the effects (they never block a tap). Safe without a DOM (Node): every call does nothing.
 * Plain <script>: window.Juice (and Shared.juice); Node: require().
 */
(function (root, factory) {
  const Juice = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Juice;
  else {
    root.Juice = Juice;
    (root.Shared = root.Shared || {}).juice = Juice;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const doc = root && root.document;
  const Juice = { muted: false, volume: 1 };
  // where assets/shared/ is, from this script's own address (js/shared/juice.js -> assets/shared/)
  let base = "assets/shared/";
  try {
    const me = doc && (doc.currentScript || [...doc.scripts].find((s) => /js\/shared\/juice\.js/.test(s.src)));
    if (me && me.src) base = new URL("../../assets/shared/", me.src).href;
  } catch (e) {
    /* the default */
  }
  Juice.base = base;
  Juice.art = (name) => Juice.base + "juice/" + name + ".webp";
  Juice.file = (name) => Juice.base + "sfx/" + name + ".mp3";

  Juice.less = function () {
    try {
      if (/[?&]motion=less\b/.test(root.location.search)) return true;
      return !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      return false;
    }
  };
  const none = () => Promise.resolve();

  // one sprite, centred on (x, y), w px wide; its height follows the picture
  function sprite(host, name, x, y, w, extra) {
    const im = doc.createElement("img");
    im.src = Juice.art(name);
    im.alt = "";
    im.setAttribute("aria-hidden", "true");
    im.draggable = false;
    im.className = "njg-juice";
    Object.assign(im.style, { position: "absolute", left: x + "px", top: y + "px", width: w + "px", height: "auto", transform: "translate(-50%, -50%)", pointerEvents: "none", opacity: "0", zIndex: "5", willChange: "transform, opacity" }, extra || {});
    host.appendChild(im);
    return im;
  }
  // run keyframes on an element, remove it at the end; the promise resolves then
  function play(el, frames, ms, opts) {
    return new Promise((done) => {
      let a;
      try {
        a = el.animate(frames, Object.assign({ duration: ms, easing: "ease-out", fill: "forwards" }, opts || {}));
      } catch (e) {
        el.remove();
        done();
        return;
      }
      a.onfinish = () => {
        el.remove();
        done();
      };
      a.oncancel = a.onfinish;
    });
  }
  const T = (s, r) => `translate(-50%, -50%) scale(${s})` + (r ? ` rotate(${r}deg)` : "");
  // reduced motion: the picture fades in and out where it is, nothing moves
  const still = (el, ms) => play(el, [{ opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], ms, { easing: "linear" });

  Juice.sparkle = function (host, x, y, o) {
    if (!doc || !host) return none();
    o = o || {};
    const w = o.w || 80;
    if (Juice.less()) return still(sprite(host, "sk-3", x, y, w), 700);
    if ((o.kind || 1) === 1) {
      // a point of light grows into the soft star and fades, turning a little
      const a = sprite(host, "sk-1", x, y, w * 0.4);
      const b = sprite(host, "sk-3", x, y, w);
      return Promise.all([
        play(a, [{ opacity: 0, transform: T(0.4) }, { opacity: 1, transform: T(1), offset: 0.3 }, { opacity: 0, transform: T(1.3) }], 360),
        play(b, [{ opacity: 0, transform: T(0.2, 0) }, { opacity: 0, transform: T(0.25, 0), offset: 0.18 }, { opacity: 1, transform: T(1, 12), offset: 0.48 }, { opacity: 0, transform: T(0.85, 24) }], 820),
      ]);
    }
    // three small twinkles round the point, one after another
    const at = [[-0.32, -0.18, "sk-2", 0.7], [0.3, -0.34, "sk-4", 0.6], [0.12, 0.22, "sk-5", 0.55]];
    return Promise.all(at.map(([dx, dy, n, s], i) => {
      const el = sprite(host, n, x + dx * w, y + dy * w, w * s);
      return play(el, [{ opacity: 0, transform: T(0.2) }, { opacity: 1, transform: T(1, 10), offset: 0.45 }, { opacity: 0, transform: T(0.6, 20) }], 520, { delay: i * 150 });
    }));
  };

  Juice.steam = function (host, x, y, o) {
    o = o || {};
    if (!doc || !host) return { stop() {} };
    const w = o.w || 100;
    const names = o.thin ? ["st-4", "st-5", "st-6"] : ["st-1", "st-2", "st-3"];
    if (Juice.less()) {
      const el = sprite(host, names[1], x, y - w * 0.5, w * 0.6);
      el.style.opacity = "0.55";
      return { stop() { el.remove(); } };
    }
    let k = 0, timer = null, live = true;
    const one = () => {
      if (!live) return;
      const n = names[k++ % names.length];
      const dx = ((k * 37) % 21 - 10) / 100;
      const el = sprite(host, n, x + dx * w, y - w * 0.3, w * 0.62);
      const drift = (k % 2 ? 1 : -1) * w * 0.12;
      play(el, [
        { opacity: 0, transform: `translate(-50%, -50%) translate(0px, 0px) scale(0.8)` },
        { opacity: 0.85, transform: `translate(-50%, -50%) translate(${drift * 0.4}px, ${-w * 0.35}px) scale(0.95)`, offset: 0.35 },
        { opacity: 0, transform: `translate(-50%, -50%) translate(${drift}px, ${-w * 1.0}px) scale(1.15)` },
      ], 2400, { easing: "linear" });
      timer = setTimeout(one, o.every || 800);
    };
    one();
    return {
      stop() {
        live = false;
        clearTimeout(timer);
      },
    };
  };

  Juice.crown = function (host, x, y, o) {
    if (!doc || !host) return none();
    o = o || {};
    const w = o.w || 70;
    // the crown's base sits on the surface: its centre is a little above y
    const c = sprite(host, "td-3", x, y - w * 0.18, w, { transformOrigin: "50% 85%" });
    if (Juice.less()) return still(c, 500);
    const d = sprite(host, "td-5", x, y - w * 0.45, w * 0.4);
    return Promise.all([
      play(c, [{ opacity: 0, transform: "translate(-50%, -50%) scale(0.6, 0.15)" }, { opacity: 1, transform: "translate(-50%, -50%) scale(1, 1)", offset: 0.35 }, { opacity: 0, transform: "translate(-50%, -50%) scale(1.1, 0.6)" }], 520),
      play(d, [{ opacity: 0, transform: "translate(-50%, -50%) translate(0, 0)" }, { opacity: 1, transform: `translate(-50%, -50%) translate(0, ${-w * 0.25}px)`, offset: 0.4 }, { opacity: 0, transform: `translate(-50%, -50%) translate(0, ${w * 0.05}px)` }], 560, { delay: 60, easing: "ease-in-out" }),
    ]);
  };

  Juice.drop = function (host, x, y0, y1, o) {
    if (!doc || !host) return none();
    o = o || {};
    const w = o.w || 22;
    const splash = o.splash || "crown";
    const el = sprite(host, "td-1", x, y0, w);
    if (Juice.less()) return still(sprite(host, "td-2", x, y1 - w * 0.3, w * 0.8), 500).then(() => el.remove());
    const fall = play(el, [
      { opacity: 0, transform: "translate(-50%, -50%) translate(0, 0)" },
      { opacity: 1, transform: `translate(-50%, -50%) translate(0, ${(y1 - y0) * 0.06}px)`, offset: 0.12 },
      { opacity: 1, transform: `translate(-50%, -50%) translate(0, ${y1 - y0 - w * 0.9}px)`, offset: 0.97 },
      { opacity: 0, transform: `translate(-50%, -50%) translate(0, ${y1 - y0 - w * 0.6}px)` },
    ], o.ms || 520, { easing: "cubic-bezier(.55,0,1,.45)" });
    return fall.then(() => {
      if (splash === "crown") return Juice.crown(host, x, y1, { w: w * 3 });
      if (splash === "dots") {
        const d = sprite(host, "td-6", x, y1 - w * 0.4, w * 2.2);
        return play(d, [{ opacity: 0, transform: "translate(-50%, -50%) translate(0,0) scale(.6)" }, { opacity: 1, transform: `translate(-50%, -50%) translate(0, ${-w * 0.7}px) scale(1)`, offset: 0.45 }, { opacity: 0, transform: `translate(-50%, -50%) translate(0, ${-w * 0.2}px) scale(1)` }], 420);
      }
      return undefined;
    });
  };

  Juice.burst = function (host, x, y, o) {
    if (!doc || !host) return none();
    o = o || {};
    const w = o.w || 200;
    const extra = { mixBlendMode: o.blend || "normal", zIndex: o.behind ? "auto" : "5" };
    const put = (el) => {
      if (o.behind && o.behind.parentNode === host) host.insertBefore(el, o.behind);
      return el;
    };
    const b = put(sprite(host, "bu-3", x, y, w, extra));
    if (Juice.less()) return still(b, 900);
    const runs = [play(b, [{ opacity: 0, transform: T(0.35, 0) }, { opacity: 1, transform: T(1, 8), offset: 0.3 }, { opacity: 0.9, transform: T(1.05, 14), offset: 0.6 }, { opacity: 0, transform: T(1.15, 22) }], 1100)];
    if ((o.kind || 1) === 2) {
      // a light sweep: the long ray crosses the badge on the diagonal it was painted on
      const r = put(sprite(host, "bu-4", x, y, w * 0.7, extra));
      runs.push(play(r, [{ opacity: 0, transform: `translate(-50%, -50%) translate(${-w * 0.35}px, ${-w * 0.35}px)` }, { opacity: 1, transform: "translate(-50%, -50%) translate(0, 0)", offset: 0.5 }, { opacity: 0, transform: `translate(-50%, -50%) translate(${w * 0.35}px, ${w * 0.35}px)` }], 900, { delay: 250, easing: "ease-in-out" }));
    }
    return Promise.all(runs);
  };

  // ---- the recorded sounds: decoded once, played through Web Audio (silent without it). When chosen ones go into a game they
  //      move into js/shared/sfx.js (Sfx.file), the one place a sound is played (build/lint/static.mjs voice); this is the lab's ----
  let ctx = null;
  const cache = {};
  const ac = () => {
    if (ctx) return ctx;
    const AC = root && (root.AudioContext || root.webkitAudioContext);
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  };
  Juice.load = function (name) {
    const c = ac();
    if (!c || !root.fetch) return Promise.resolve(null);
    if (!cache[name]) {
      cache[name] = root.fetch(Juice.file(name)).then((r) => r.arrayBuffer()).then((b) => new Promise((ok, no) => c.decodeAudioData(b, ok, no))).catch(() => null);
    }
    return cache[name];
  };
  Juice.sound = function (name, o) {
    o = o || {};
    const handle = { stopped: false, src: null, gain: null, stop() {} };
    if (Juice.muted || (root.Sfx && root.Sfx.muted) || !doc) return handle;
    const c = ac();
    if (!c) return handle; // no Web Audio: silent (a sound is never needed to play)
    if (c.state === "suspended") c.resume().catch(() => {});
    handle.stop = () => {
      handle.stopped = true;
      try {
        if (handle.gain) {
          handle.gain.gain.setTargetAtTime(0.0001, c.currentTime, 0.04);
          handle.src.stop(c.currentTime + 0.2);
        }
      } catch (e) {
        /* already ended */
      }
    };
    Juice.load(name).then((buf) => {
      if (!buf || handle.stopped) return;
      const src = c.createBufferSource();
      src.buffer = buf;
      const g = c.createGain();
      const v = (o.volume != null ? o.volume : 1) * Juice.volume;
      g.gain.setValueAtTime(v, c.currentTime);
      src.connect(g).connect(c.destination);
      src.start();
      if (o.dur && o.dur < buf.duration) {
        g.gain.setValueAtTime(v, c.currentTime + Math.max(0, o.dur - 0.18));
        g.gain.linearRampToValueAtTime(0.0001, c.currentTime + o.dur);
        src.stop(c.currentTime + o.dur + 0.02);
      }
      handle.src = src;
      handle.gain = g;
    });
    return handle;
  };
  return Juice;
});
