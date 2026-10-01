/*
 * The stage (docs/architecture/target-model.md 4.1; rules J4, D15, F18; decision 24): ONE coordinate service for
 * scenes. A scene is laid out in its own background's pixels (1600x900, D15; a scene file may state its own size,
 * as the clinic's 1536x1024 rooms do), and the stage maps those pixels to the screen for DOM, SVG and Phaser alike.
 *
 * How a scene meets the play area (the box), worked out once here instead of in each mode:
 *   sFit   = the whole picture fits the box           (Cook's Phaser EXPAND today)
 *   sCover = the picture covers the box               (the clinic's rooms today)
 *   sSafe  = the scene's safe area just fits the box  (scene.safe: what must stay on screen, e.g. the clinic's `need`)
 *   s      = max(sFit, min(cap, sSafe)), cap = (fill "cover" ? sCover : sFit) x itemScale
 * itemScale is per form factor (data/layout.json `stage.itemScale`): on a 4:3 tablet the scene may grow past the
 * plain fit, cropping its sides down to the safe area, so play items use the height instead of shrinking in a
 * 16:9 strip. On a laptop (itemScale 1) nothing changes. Across: the safe area's middle in the middle, the
 * picture never pulled off an edge it could cover; down: a picture taller than the box is cropped by
 * scene.anchorY (0 = keep the top, 1 = keep the bottom), a shorter one sits on the bottom (the shelf band, the floor).
 *
 *   const m = Stage.fit({ box: {w, h}, scene: {w: 1600, h: 900, safe: [x0, y0, x1, y1], anchorY, fill}, itemScale })
 *                                         (a safe side given as null is free that way: [x0, null, x1, null] keeps only an x-range)
 *     m.s, m.left, m.top, m.w, m.h        scale (scene px -> screen px), where the picture's top-left sits, its size
 *     m.view                              the visible part, in scene px: {x0, y0, x1, y1}
 *     m.toScreen(x, y) -> {x, y, s}       a scene point in the box's px (add the box's own page offset for the page)
 *     m.toScene(x, y) -> {x, y}           and back
 *     m.size(n)                           a scene length in screen px
 *   Stage.scene(name)                     the scene spec for a mode (data/layout.json `stage.scenes`, else the 1600x900 design)
 *   Stage.itemScale()                     this screen's item scale (js/shared/frame.js, from data/layout.json)
 *   Stage.attach(el, scene, onFit)        follow el's size: m = fit(...) on every resize (and frame change); returns {now(), stop()}
 *   Stage.art(path, {drawn, dpr})         the art path at the resolution this screen needs: "x.webp" -> "x@2x.webp" when
 *                                         devicePixelRatio x drawn scale passes layout.json `stage.hiDpi` and the art has an
 *                                         @2x (Stage.has2x), stamped through njgV / Cook.v (B7)
 *   Stage.has2x                           a Set of paths that have an @2x file (filled by the caller or data; empty today)
 *
 * Plain <script>: window.Stage (and Shared.stage); module.exports in Node (tests: build/test_shared_stage.mjs).
 */
(function (root, factory) {
  const S = factory(root);
  if (typeof module === "object" && module.exports) module.exports = S;
  else {
    root.Stage = S;
    (root.Shared = root.Shared || {}).stage = S;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const S = {};
  const DESIGN = { w: 1600, h: 900 };
  const clamp = (lo, v, hi) => Math.min(hi, Math.max(lo, v));

  /** The mapping for one box and one scene (pure: no DOM). */
  S.fit = function ({ box, scene = {}, itemScale = 1 } = {}) {
    const W = Math.max(1, box.w);
    const H = Math.max(1, box.h);
    const sw = scene.w || DESIGN.w;
    const sh = scene.h || DESIGN.h;
    // the safe area; a null side is unconstrained that way (the clinic's rooms keep only an x-range, `need`)
    const safe = scene.safe || [0, 0, sw, sh];
    const [x0, y0, x1, y1] = [safe[0] != null ? safe[0] : 0, safe[1], safe[2] != null ? safe[2] : sw, safe[3]];
    const sFit = Math.min(W / sw, H / sh);
    const sCover = Math.max(W / sw, H / sh);
    const sSafe = Math.min(W / Math.max(1, x1 - x0), y0 != null && y1 != null ? H / Math.max(1, y1 - y0) : Infinity);
    const cap = (scene.fill === "cover" ? sCover : sFit) * (itemScale || 1);
    const s = Math.max(sFit, Math.min(cap, sSafe));
    const w = sw * s;
    const h = sh * s;
    // across: the safe area's middle in the box's middle, never leaving a gap the picture could cover
    const cx = ((x0 + x1) / 2) * s;
    const left = w <= W ? (W - w) / 2 : clamp(W - w, W / 2 - cx, 0);
    // down: cropped by anchorY when taller than the box, else on the bottom
    const ay = scene.anchorY != null ? scene.anchorY : 1;
    const top = h > H ? (H - h) * ay : H - h;
    const m = { s, left, top, w, h, box: { w: W, h: H }, scene: { w: sw, h: sh, safe }, sFit, sCover, sSafe };
    m.view = { x0: -left / s, y0: -top / s, x1: (W - left) / s, y1: (H - top) / s };
    m.toScreen = (x, y) => ({ x: left + x * s, y: top + y * s, s });
    m.toScene = (px, py) => ({ x: (px - left) / s, y: (py - top) / s });
    m.size = (n) => n * s;
    return m;
  };

  /** A scene spec by name from data/layout.json `stage.scenes`, else the design size. */
  S.scene = function (name) {
    const L = root.Frame && root.Frame.layout;
    const scenes = (L && L.stage && L.stage.scenes) || {};
    const d = (L && L.stage && L.stage.design) || DESIGN;
    return Object.assign({ w: d.w, h: d.h }, scenes[name] || {});
  };

  /** This screen's item scale (data/layout.json `stage.itemScale` for the form factor). */
  S.itemScale = function () {
    const now = root.Frame && root.Frame.now;
    return (now && now.itemScale) || 1;
  };

  /** Follow an element's size: onFit(m) after every change. */
  S.attach = function (el, scene, onFit) {
    let m = null;
    const go = () => {
      if (!el || !el.isConnected) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      m = S.fit({ box: { w: r.width, h: r.height }, scene: typeof scene === "function" ? scene() : scene, itemScale: S.itemScale() });
      if (onFit) onFit(m);
    };
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(go) : null;
    if (ro) ro.observe(el);
    else if (root.addEventListener) root.addEventListener("resize", go);
    const off = root.Frame && root.Frame.onChange ? root.Frame.onChange(go) : () => {};
    go();
    return {
      now: () => m,
      refit: go,
      stop() {
        if (ro) ro.disconnect();
        else if (root.removeEventListener) root.removeEventListener("resize", go);
        off();
      },
    };
  };

  /* ---------------- resolution-aware art (B7: every URL through njgV / Cook.v) ---------------- */
  S.has2x = new Set();
  const stamp = (u) => (root.njgV ? root.njgV(u) : root.Cook && root.Cook.v ? root.Cook.v(u) : u);
  /** "a/b.webp" -> "a/b@2x.webp" */
  S.at2x = (path) => String(path).replace(/(\.[a-z0-9]+)(\?.*)?$/i, "@2x$1$2");
  /**
   * The art path this screen needs. drawn: how big it's drawn relative to the file's own pixels (1 = 1:1 in CSS px).
   * Picks @2x when devicePixelRatio x drawn passes layout.json `stage.hiDpi` and Stage.has2x lists the path.
   */
  S.art = function (path, { drawn = 1, dpr } = {}) {
    const L = root.Frame && root.Frame.layout;
    const limit = (L && L.stage && L.stage.hiDpi) || 1.25;
    const ratio = (dpr != null ? dpr : root.devicePixelRatio || 1) * drawn;
    const want2x = ratio > limit && S.has2x.has(path);
    return stamp(want2x ? S.at2x(path) : path);
  };
  /** Would this art need more pixels than it has at this screen? (for the art list: ratio over hiDpi and no @2x) */
  S.needsMore = function (drawn, dpr) {
    const L = root.Frame && root.Frame.layout;
    const limit = (L && L.stage && L.stage.hiDpi) || 1.25;
    return (dpr != null ? dpr : root.devicePixelRatio || 1) * drawn > limit;
  };
  return S;
});
