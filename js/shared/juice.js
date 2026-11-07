/*
 * The juice kit (CHAI-92, 6 Nov): the painted effects of art run s17-juice (assets/shared/juice/, cut from
 * sources/art/s17-juice/) and the recorded sounds of the sound library (assets/shared/sfx/, SOURCES.md), by name.
 * Shown first on lab/juice.html; Zafar's picks (6 Nov) are wired into chai, the word moment, the serve's stamp and the end screen
 * (build/reports/juice-chai-wired-2026-11-06.md); a canvas game draws them through the Phaser twin, Juice.P (at the foot).
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
 *   Juice.sound(name, {volume, dur}) -> {stop()}  one recorded file from assets/shared/sfx/ (<name>.mp3), played once through
 *                                              js/shared/sfx.js (Sfx.file); dur: cut it short with a fade (a short pour)
 *   Juice.less()                               true when the system asks for reduced motion (or ?motion=less): effects then
 *                                              fade in place, nothing moves, nothing loops
 *   Juice.pop(host, at, text, {hold, top, missing, u}) -> Promise   the word pop by the action (Sprint 18, module map piece 12): a
 *                                              card, the speaker and the word, rising into place and fading after hold ms; at:
 *                                              {x, y}, or a function (w, h) -> {x, y} placing it once its size is known (Juice.popAt).
 *                                              It draws only: the game says the word (its voice), never this file
 *   Juice.popAt(at, w, h, {top, left, right, edge, avoid, gap})  where a pop w x h sits centred over at {x, y: the target's
 *                                              top}: never across edge {y, clear, above} (a line it never sits on: it goes wholly
 *                                              above), above an avoid box {x0, y0, x1, y1} (or beside it, right, where the top has no
 *                                              room), inside the view (top, left, right) -> {x, y}
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
    // (onLand: the moment it lands, for its sound)
    const land = () => {
      try {
        if (o.onLand) o.onLand();
      } catch (e) {
        /* only a sound */
      }
    };
    if (Juice.less()) {
      land();
      return still(sprite(host, "td-2", x, y1 - w * 0.3, w * 0.8), 500).then(() => el.remove());
    }
    const fall = play(el, [
      { opacity: 0, transform: "translate(-50%, -50%) translate(0, 0)" },
      { opacity: 1, transform: `translate(-50%, -50%) translate(0, ${(y1 - y0) * 0.06}px)`, offset: 0.12 },
      { opacity: 1, transform: `translate(-50%, -50%) translate(0, ${y1 - y0 - w * 0.9}px)`, offset: 0.97 },
      { opacity: 0, transform: `translate(-50%, -50%) translate(0, ${y1 - y0 - w * 0.6}px)` },
    ], o.ms || 520, { easing: "cubic-bezier(.55,0,1,.45)" });
    return fall.then(() => {
      land();
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

  // ---- the word pop by the action (piece 12; §4: learning happens during the action) ----
  Juice.popAt = function (at, w, h, { top = -Infinity, left = -Infinity, right = Infinity, edge = null, avoid = null, gap = 8 } = {}) {
    let x = at.x;
    let y = at.y - h / 2;
    // (never across the edge's line: where the target reaches almost to it, the pop sits wholly above it; only ever up)
    const offEdge = (v) => (edge && v - h / 2 < edge.y + (edge.clear || 0) && v + h / 2 > edge.y - (edge.above || 0) ? edge.y - (edge.above || 0) - h / 2 : v);
    if (edge && y - h / 2 < edge.y + (edge.clear || 0)) y = edge.y - (edge.above || 0) - h / 2;
    const bb = avoid;
    const hits = (cx, cy) => bb && cx - w / 2 < bb.x1 + gap && cx + w / 2 > bb.x0 - gap && cy - h / 2 < bb.y1 + gap && cy + h / 2 > bb.y0 - gap;
    if (hits(x, y)) {
      const above = offEdge(Math.min(bb.y0 - gap - h / 2, y));
      if (above - h / 2 - 14 >= top && !hits(x, above)) y = above;
      else x = bb.x1 + gap + w / 2;
    }
    y = Math.max(top + h / 2 + 2, y);
    x = Math.max(left + w / 2, Math.min(right - w / 2, x));
    return { x, y };
  };
  const POP = { hold: 1900, rise: 14, inMs: 180, outMs: 320, min: 14 }; // (min: the word never under 14 CSS px, F2)
  Juice.POP = POP;
  Juice.pop = function (host, at, text, o) {
    if (!doc || !host) return none();
    o = o || {};
    const el = doc.createElement("div");
    el.className = "njg-wpill njg-pop";
    el.setAttribute("aria-hidden", "true");
    const spk = root.Shelf && root.Shelf.speakerSvg ? root.Shelf.speakerSvg() : "";
    el.innerHTML = `<span class="njg-wpill-spk">${spk}</span><span class="njg-wpill-w"></span>`;
    const word = el.querySelector(".njg-wpill-w");
    word.textContent = text;
    if (o.missing) word.classList.add("njg-ph");
    if (o.u) el.style.setProperty("--njg-shelf-u", o.u + "px");
    el.style.setProperty("--njg-wpill-min", POP.min + "px");
    Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", opacity: "0", pointerEvents: "none", zIndex: "6", transform: "translate(-50%, -50%)" });
    host.appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight;
    const p = typeof at === "function" ? at(w, h) : at;
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    // (no room above: no drift up, it fades where it is)
    const drift = p.y - h / 2 - POP.rise >= (o.top || 0) + 10 ? POP.rise : 0;
    const hold = o.hold == null ? POP.hold : o.hold;
    const tr = (dy) => `translate(-50%, -50%) translate(0, ${dy}px)`;
    if (Juice.less()) return still(el, hold + POP.inMs + POP.outMs);
    const all = hold + POP.outMs;
    return play(el, [
      { opacity: 0, transform: tr(POP.rise), easing: "cubic-bezier(.34,1.56,.64,1)" },
      { opacity: 1, transform: tr(0), offset: POP.inMs / all },
      { opacity: 1, transform: tr(0), offset: hold / all },
      { opacity: 0, transform: tr(-drift) },
    ], all, { easing: "linear" });
  };

  // ---- the recorded sounds: js/shared/sfx.js plays them (Sfx.file: the one place a sound is played, build/lint/static.mjs voice;
  //      moved there when Zafar's picks went into chai, 6 Nov). Juice.sound stays as the lab's name for it ----
  Juice.file = (name) => (root.Sfx && root.Sfx.fileUrl ? root.Sfx.fileUrl(name) : Juice.base + "sfx/" + name + ".mp3");
  Juice.sound = function (name, o) {
    if (Juice.muted || !doc || !root.Sfx || !root.Sfx.file) return { stop() {} };
    return root.Sfx.file(name, Object.assign({ wait: true }, o || {}));
  };

  /* ---- the Phaser twin (a canvas game: chai's hob and tray), CHAI-92 (Zafar's picks, 6 Nov): the same effects by the same names
   *      and timings, as Phaser images and tweens in place of the DOM's animations; Juice.less() makes each a fade in place.
   *   Juice.P.keys(names) -> [[key, url], ...]    the sprites to load with a station's art (texture key "fx-juice-<name>")
   *   Juice.P.sparkle(S, x, y, {w, kind, depth, add}) -> Promise     kind 1 one star; kind 2 three twinkles; add: added light
   *   Juice.P.steam(S, x, y, {w, thin, every, depth}) -> {stop()}    wisps rising on a slow loop until stopped
   *   Juice.P.puff(S, x, y, {w, depth}) -> Promise                    one full wisp rising once (a boil-over's steam)
   *   Juice.P.drop(S, x, y0, y1, {w, ms, splash: "crown" | "dots" | "none", depth, onLand}) -> Promise   the painted last drop falls
 *   Juice.P.pop(S, at, text, {k, depth, top, hold, font, weight, color, shade, card}) -> container   the word pop by the action (piece 12): the card,
 *                                              the speaker (js/shared/shelf.js Shelf.P.speaker) and the word at 36 px, k times; at
 *                                              {x, y} or (W, H) -> {x, y} (W, H: its size as drawn, k in); rises 14 px into place,
 *                                              holds, fades (no drift where the top, the view's, has no room)
   * x, y in the scene's own px. A sprite whose texture is not loaded is not drawn. Nothing takes a tap (no input on any of them).
   * Never through Cook.Stations' sparkle/steam stubs: S.verdict draws those by score.
   */
  const P = (Juice.P = {});
  // (the key starts "fx-": every "is the kitchen still?" check, the game's and the sandbox's, leaves an effect out, as it did the s11 ones)
  P.key = (name) => "fx-juice-" + name;
  // (relative to the game's root, as a station's art list is: the loader stamps the version)
  P.keys = (names) => names.map((n) => [P.key(n), "assets/shared/juice/" + n + ".webp"]);
  P.ALL = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "st-1", "st-2", "st-3", "td-1", "td-2", "td-3", "td-5", "td-6"];
  function img(S, name, x, y, w, depth) {
    const key = P.key(name);
    if (!S || !S.textures || !S.textures.exists(key)) return null;
    const im = S.add.image(x, y, key).setAlpha(0).setDepth(depth == null ? 50 : depth);
    im.setScale(w / (im.width || 1));
    im.baseScale = im.scaleX;
    if (S.track) S.track(im);
    return im;
  }
  // tween one image through steps [{props, ms, ease, delay}] in turn, destroy it at the end; resolves then
  function steps(S, im, list) {
    return new Promise((done) => {
      if (!im) return done();
      let i = 0;
      const next = () => {
        if (!im.active || !im.scene || i >= list.length) {
          if (im.active) im.destroy();
          return done();
        }
        const s = list[i++];
        S.tweens.add(Object.assign({ targets: im, duration: s.ms, ease: s.ease || "Sine.easeOut", delay: s.delay || 0, onComplete: next }, s.props));
      };
      next();
    });
  }
  // reduced motion: the picture fades in and out where it is
  const stillP = (S, im, ms) => steps(S, im, [{ props: { alpha: 1 }, ms: ms * 0.25, ease: "Linear" }, { props: { alpha: 1 }, ms: ms * 0.45 }, { props: { alpha: 0 }, ms: ms * 0.3, ease: "Linear" }]);

  P.sparkle = function (S, x, y, o) {
    o = o || {};
    const w = o.w || 80;
    const d = o.depth;
    // (add: added light, the glow brightening what is under it: the gold reads on wood and tea as on the lab's dark tiles)
    const pic = (...a) => { const im = img(...a); if (im && o.add && im.setBlendMode) im.setBlendMode(1); return im; };
    // (reduced motion: one soft star fading in place, about the size of the twinkles together, not the whole width: in added light the
    // full-size star glared over the glass)
    if (Juice.less()) return stillP(S, pic(S, "sk-3", x, y, w * 0.5, d), 700);
    if ((o.kind || 1) === 1) {
      const a = pic(S, "sk-1", x, y, w * 0.4, d);
      const b = pic(S, "sk-3", x, y, w, d);
      const k = (im, s) => (im ? im.baseScale * s : 0);
      if (a) a.setScale(k(a, 0.4));
      if (b) b.setScale(k(b, 0.2));
      return Promise.all([
        steps(S, a, [{ props: { alpha: 1, scale: k(a, 1) }, ms: 108 }, { props: { alpha: 0, scale: k(a, 1.3) }, ms: 252 }]),
        steps(S, b, [{ props: { alpha: 0, scale: k(b, 0.25) }, ms: 148 }, { props: { alpha: 1, scale: k(b, 1), angle: 12 }, ms: 246 }, { props: { alpha: 0, scale: k(b, 0.85), angle: 24 }, ms: 426 }]),
      ]);
    }
    // three small twinkles round the point, one after another
    const at = [[-0.32, -0.18, "sk-2", 0.7], [0.3, -0.34, "sk-4", 0.6], [0.12, 0.22, "sk-5", 0.55]];
    return Promise.all(at.map(([dx, dy, n, s], i) => {
      const im = pic(S, n, x + dx * w, y + dy * w, w * s, d);
      const k = im ? im.baseScale : 0;
      if (im) im.setScale(k * 0.2);
      return steps(S, im, [{ props: { alpha: 1, scale: k, angle: 10 }, ms: 234, delay: i * 150 }, { props: { alpha: 0, scale: k * 0.6, angle: 20 }, ms: 286 }]);
    }));
  };

  // one wisp: rises w px, drifts, grows and fades (2.4 s)
  function wisp(S, name, x, y, w, drift, depth) {
    const im = img(S, name, x, y, w * 0.62, depth);
    if (!im) return Promise.resolve();
    const k = im.baseScale;
    im.setScale(k * 0.8);
    return steps(S, im, [
      { props: { alpha: 0.85, x: x + drift * 0.4, y: y - w * 0.35, scale: k * 0.95 }, ms: 840, ease: "Linear" },
      { props: { alpha: 0, x: x + drift, y: y - w, scale: k * 1.15 }, ms: 1560, ease: "Linear" },
    ]);
  }
  P.steam = function (S, x, y, o) {
    o = o || {};
    const w = o.w || 100;
    const names = o.thin ? ["st-4", "st-5", "st-6"] : ["st-1", "st-2", "st-3"];
    if (!S || !S.add) return { stop() {} };
    if (Juice.less()) {
      const el = img(S, names[1], x, y - w * 0.5, w * 0.6, o.depth);
      if (el) S.tweens.add({ targets: el, alpha: 0.55, duration: 400 });
      return { stop() { if (el && el.active) S.tweens.add({ targets: el, alpha: 0, duration: 300, onComplete: () => el.destroy() }); } };
    }
    let k = 0;
    let live = true;
    let timer = null;
    const one = () => {
      if (!live || !S.sys || !S.sys.isActive()) return;
      const n = names[k++ % names.length];
      const dx = (((k * 37) % 21) - 10) / 100;
      wisp(S, n, x + dx * w, y - w * 0.3, w, (k % 2 ? 1 : -1) * w * 0.12, o.depth);
      timer = S.time.delayedCall(o.every || 800, one);
    };
    one();
    return {
      stop() {
        live = false;
        if (timer) timer.remove(false);
      },
    };
  };
  P.puff = (S, x, y, o) => {
    o = o || {};
    const w = o.w || 100;
    if (Juice.less()) return stillP(S, img(S, "st-2", x, y - w * 0.5, w * 0.6, o.depth), 900);
    return wisp(S, o.name || "st-1", x, y - w * 0.3, w, w * 0.08, o.depth);
  };

  P.pop = function (S, at, text, o) {
    o = o || {};
    const TK = root.Tokens;
    const k = o.k || 1;
    const font = o.font || (TK && TK.font ? TK.font("word") : "");
    const weight = o.weight || (TK && TK.weight ? TK.weight("drawn", "800") : "800");
    const color = o.color || (TK && TK.hex ? TK.hex("ink-kutchi") : "");
    const c0 = S.add.container(0, 0).setDepth(o.depth == null ? 50 : o.depth).setAlpha(0).setScale(k);
    const c = S.track ? S.track(c0) : c0;
    const t = S.add.text(0, 0, text, { fontFamily: font, fontSize: "36px", fontStyle: weight, color }).setOrigin(0, 0.5);
    const w = 34 + 10 + t.width + 36;
    const g = S.add.graphics();
    const ink = (n) => (TK && TK.int ? TK.int(n) : null) || 0;
    g.fillStyle(o.shade != null ? o.shade : ink("shade-rgb"), 0.1);
    g.fillRoundedRect(-w / 2, -28 + 3, w, 56, 12);
    g.fillStyle(o.card != null ? o.card : ink("card"), 1);
    g.fillRoundedRect(-w / 2, -28, w, 56, 12);
    if (root.Shelf && root.Shelf.P) root.Shelf.P.speaker(g, -w / 2 + 30, 0, 26);
    t.x = -w / 2 + 50;
    c.add([g, t]);
    const { x, y } = typeof at === "function" ? at(w * k, 59 * k) : at;
    const drift = y - (59 * k) / 2 - POP.rise >= (o.top || 0) + 10 ? POP.rise : 0;
    const hold = o.hold == null ? POP.hold : o.hold;
    c.setPosition(x, y + POP.rise);
    c.popW = w * k;
    if (Juice.less()) {
      c.setY(y);
      S.tweens.add({ targets: c, alpha: 1, duration: POP.inMs });
      S.tweens.add({ targets: c, alpha: 0, delay: hold, duration: POP.outMs, onComplete: () => c.destroy() });
      return c;
    }
    S.tweens.add({ targets: c, alpha: 1, y, duration: POP.inMs, ease: "Back.easeOut" });
    S.tweens.add({ targets: c, alpha: 0, y: y - drift, delay: hold, duration: POP.outMs, onComplete: () => c.destroy() });
    return c;
  };

  P.drop = function (S, x, y0, y1, o) {
    o = o || {};
    const w = o.w || 22;
    const d = o.depth;
    const land = () => {
      try {
        if (o.onLand) o.onLand();
      } catch (e) {
        /* only a sound */
      }
    };
    if (Juice.less()) {
      land();
      return stillP(S, img(S, "td-2", x, y1 - w * 0.3, w * 0.8, d), 500);
    }
    const im = img(S, "td-1", x, y0, w, d);
    const ms = o.ms || 520;
    const fall = steps(S, im, [
      { props: { alpha: 1, y: y0 + (y1 - y0) * 0.06 }, ms: ms * 0.12, ease: "Linear" },
      { props: { y: y1 - w * 0.6 }, ms: ms * 0.88, ease: "Quad.easeIn" },
    ]);
    return fall.then(() => {
      land();
      const splash = o.splash || "none";
      if (splash === "crown") {
        const c = img(S, "td-3", x, y1 - w * 3 * 0.18, w * 3, d);
        const dd = img(S, "td-5", x, y1 - w * 3 * 0.45, w * 1.2, d);
        if (c) c.setScale(c.baseScale * 0.6, c.baseScale * 0.15);
        return Promise.all([
          steps(S, c, [{ props: { alpha: 1, scaleX: c ? c.baseScale : 0, scaleY: c ? c.baseScale : 0 }, ms: 182 }, { props: { alpha: 0, scaleX: c ? c.baseScale * 1.1 : 0, scaleY: c ? c.baseScale * 0.6 : 0 }, ms: 338 }]),
          steps(S, dd, [{ props: { alpha: 1, y: (dd ? dd.y : 0) - w * 0.75 }, ms: 224, delay: 60, ease: "Sine.easeInOut" }, { props: { alpha: 0, y: (dd ? dd.y : 0) + w * 0.15 }, ms: 336, ease: "Sine.easeInOut" }]),
        ]);
      }
      if (splash === "dots") {
        const t = img(S, "td-6", x, y1 - w * 0.4, w * 2.2, d);
        return steps(S, t, [{ props: { alpha: 1, y: (t ? t.y : 0) - w * 0.7 }, ms: 190 }, { props: { alpha: 0, y: (t ? t.y : 0) - w * 0.2 }, ms: 230 }]);
      }
      return undefined;
    });
  };
  return Juice;
});
