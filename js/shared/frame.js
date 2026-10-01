/*
 * The frame (docs/architecture/target-model.md 4.1; rules F2, F4, F5, F18, C2; decisions 24 and 25).
 *
 * One page grid for every mode: the sidebar on the left (about a fifth of the screen: guide box, cards,
 * nav dock) and the play area (the rest), filling the whole screen on every size and shape, 4:3 tablets
 * to 21:9 phones, with the notch's safe areas kept clear, and the one turn-your-phone card for upright
 * phones. Every size comes from ONE scale worked out from the screen, with the numbers in
 * data/layout.json:
 *
 *   form factor   phone (short side < 500), tablet (short side >= 600 and no wider than 3:2), laptop
 *   scale         clamp(min, short / refShort, max) for that form factor (laptop and phone 1; tablets 1.15-1.4)
 *   tokens        every size in layout.json `sizes` (laptop's, with the form factor's own values on top)
 *                 times the scale, then the floors (text 14 px, taps 48 px), written on <html> as --njg-<name>
 *   sidebar       --njg-side-w: clamp(min x scale, share x width, max x scale), plus the room a 16:9 picture
 *                 can't use on a wider screen
 *   html attrs    data-ff="phone|tablet|laptop", data-oc-rows="stack|pills" (the order card's rows, decision 25)
 *
 * css/shared/tokens.css carries the laptop and phone numbers as the first paint's fallback, so nothing jumps
 * while layout.json loads (build/test_shared_frame.mjs keeps them equal).
 *
 *   Frame.compute(layout, w, h)   -> {ff, scale, sideW, rows, itemScale, vars}   (pure: Node tests)
 *   Frame.formFactor(layout, w, h)
 *   Frame.start([url])            load data/layout.json, apply, follow resizes (runs by itself in a page)
 *   Frame.ready                   a promise of the applied layout ({ff, scale, ...})
 *   Frame.layout                  the loaded data/layout.json
 *   Frame.now                     the last compute() result
 *   Frame.onChange(fn)            fn(now) after every apply; returns an unsubscribe
 *   Frame.mount({app, side, play})  put a page's own grid inside the frame (classes njg-frame, njg-side, njg-play)
 *   Frame.rotateCard()            the turn-your-phone card (added to <body> once; CSS shows it when upright)
 *
 * Opt out (a lab that lays itself out): <html data-njg-frame="off">.
 * Plain <script>: window.Frame (and Shared.frame). Styles: css/shared/tokens.css, css/shared/frame.css.
 */
(function (root, factory) {
  const F = factory(root);
  if (typeof module === "object" && module.exports) module.exports = F;
  else {
    root.Frame = F;
    (root.Shared = root.Shared || {}).frame = F;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const F = {};
  // data/layout.json, found from this script's own address (so a lab page in lab/ finds it too)
  const SELF = root.document && root.document.currentScript ? root.document.currentScript.src : "";
  const URL_ = SELF ? new URL("../../data/layout.json", SELF).href.replace(/\?.*$/, "") : "data/layout.json";
  const clamp = (lo, v, hi) => Math.min(hi, Math.max(lo, v));
  const round = (v) => Math.round(v * 100) / 100;

  /** phone | tablet | laptop, from the viewport (landscape assumed; an upright screen is judged the same way). */
  F.formFactor = function (L, w, h) {
    const ffs = (L && L.formFactors) || {};
    const short = Math.min(w, h);
    const aspect = Math.max(w, h) / Math.max(1, short);
    const p = ffs.phone || { shortBelow: 500 };
    if (short < p.shortBelow) return "phone";
    const t = ffs.tablet || { shortFrom: 600, aspectUpTo: 1.5 };
    if (short >= t.shortFrom && aspect <= t.aspectUpTo + 1e-9) return "tablet";
    return "laptop";
  };

  /** Upright and narrower than layout.json `rotate.portraitBelowWidth`: the turn-your-phone card shows. */
  F.rotate = (L, w, h) => h > w && w < (((L && L.rotate) || {}).portraitBelowWidth || 600);

  /** Everything the frame sets for a w x h viewport (no DOM). */
  F.compute = function (L, w, h) {
    const ff = F.formFactor(L, w, h);
    const sc = (L.scale && L.scale[ff]) || { refShort: 768, min: 1, max: 1 };
    const short = Math.min(w, h);
    const scale = round(clamp(sc.min, short / sc.refShort, sc.max));
    const base = Object.assign({}, (L.sizes && L.sizes.laptop) || {}, (L.sizes && L.sizes[ff]) || {});
    const fl = L.floors || {};
    const text = new Set(fl.textTokens || []);
    const tap = new Set(fl.tapTokens || []);
    const fixed = new Set(fl.unscaled || []);
    const vars = {};
    for (const [k, v] of Object.entries(base)) {
      if (k.startsWith("_") || typeof v !== "number") continue;
      let px = fixed.has(k) ? v : v * scale;
      if (text.has(k)) px = Math.max(fl.text || 14, px);
      if (tap.has(k)) px = Math.max(fl.tap || 48, px);
      vars[`--njg-${k}`] = `${round(px)}px`;
    }
    const sb = (L.sidebar && L.sidebar[ff]) || { share: 0.2, min: 200, max: 360 };
    let side = clamp(sb.min * scale, sb.share * w, sb.max * scale);
    if (sb.fillAspect) side = Math.max(side, Math.min(sb.max * scale, w - h * sb.fillAspect));
    const sideW = Math.round(side);
    vars["--njg-side-w"] = `${sideW}px`;
    vars["--njg-scale"] = String(scale);
    const itemScale = ((L.stage && L.stage.itemScale) || {})[ff] || 1;
    vars["--njg-item-scale"] = String(itemScale);
    const rows = ((L.card && L.card.rows) || {})[ff] || "stack";
    const rotate = F.rotate(L, w, h);
    return { ff, scale, sideW, rows, itemScale, rotate, w, h, vars };
  };

  const listeners = [];
  F.onChange = (fn) => (listeners.push(fn), () => listeners.splice(listeners.indexOf(fn), 1));
  F.layout = null;
  F.now = null;

  /** Write one compute() result on <html>. */
  F.apply = function (L, w, h) {
    const doc = root.document;
    if (!doc || !L) return null;
    const now = F.compute(L, w, h);
    const de = doc.documentElement;
    for (const [k, v] of Object.entries(now.vars)) de.style.setProperty(k, v);
    de.dataset.ff = now.ff;
    de.dataset.ocRows = now.rows;
    if (now.rotate) de.dataset.rotate = "";
    else delete de.dataset.rotate;
    F.now = now;
    listeners.slice().forEach((fn) => {
      try {
        fn(now);
      } catch (e) {
        /* a listener's own problem */
      }
    });
    return now;
  };

  const viewport = () => {
    const vv = root.visualViewport;
    const de = root.document.documentElement;
    // the layout viewport (pinch-zoom doesn't change the frame)
    return [de.clientWidth || root.innerWidth || (vv && vv.width) || 1366, de.clientHeight || root.innerHeight || (vv && vv.height) || 768];
  };

  let started = null;
  F.start = function (url) {
    if (started) return started;
    const doc = root.document;
    const stamp = (u) => (root.njgV ? root.njgV(u) : root.Cook && root.Cook.v ? root.Cook.v(u) : u);
    started = fetch(stamp(url || URL_))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`layout ${r.status}`))))
      .then((L) => {
        F.layout = L;
        const go = () => F.apply(L, ...viewport());
        let q = 0;
        const again = () => {
          if (q) return;
          q = root.requestAnimationFrame(() => {
            q = 0;
            go();
          });
        };
        root.addEventListener("resize", again);
        root.addEventListener("orientationchange", again);
        return go();
      })
      .catch((e) => {
        // tokens.css's fallback values stay: the page still works
        if (doc && doc.documentElement) doc.documentElement.dataset.ff = doc.documentElement.dataset.ff || "laptop";
        if (root.console) root.console.warn("frame: layout.json not applied", e && e.message);
        return null;
      });
    return started;
  };
  Object.defineProperty(F, "ready", { get: () => started || F.start() });

  /** A page's own grid inside the frame: the classes the frame's CSS lays out. */
  F.mount = function ({ app, side, play } = {}) {
    if (app) app.classList.add("njg-frame");
    if (side) side.classList.add("njg-side");
    if (play) play.classList.add("njg-play");
    F.rotateCard();
    return { app, side, play };
  };

  /** The one turn-your-phone card (C2): a phone turning on its side, no words (E1). CSS shows it when upright. */
  F.rotateCard = function () {
    const doc = root.document;
    if (!doc || !doc.body) return null;
    let el = doc.getElementById("njg-rotate");
    if (el) return el;
    el = doc.createElement("div");
    el.id = "njg-rotate";
    el.className = "njg-rotate";
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", "Turn your phone sideways");
    el.innerHTML = `<div class="njg-rotate-card"><svg viewBox="0 0 96 96" aria-hidden="true"><g class="njg-rotate-phone"><rect x="30" y="14" width="36" height="68" rx="7"/><circle cx="48" cy="73" r="3"/></g><path class="njg-rotate-arrow" d="M76 34a34 34 0 0 1 2 30" /><path class="njg-rotate-head" d="M72 60l6 6 5-8"/></svg></div>`;
    doc.body.appendChild(el);
    return el;
  };

  /** The thresholds layout.json ships with, for the form factor on the first paint (before it loads; tests keep them equal). */
  F.DEFAULTS = { formFactors: { phone: { shortBelow: 500 }, tablet: { shortFrom: 600, aspectUpTo: 1.5 } }, rotate: { portraitBelowWidth: 600 } };

  // in a page: the form factor at once (CSS keys phone and tablet layouts on it), then load layout.json and the rotate card
  if (root.document && root.fetch && root.document.documentElement.dataset.njgFrame !== "off") {
    try {
      const [w, h] = viewport();
      root.document.documentElement.dataset.ff = F.formFactor(F.DEFAULTS, w, h);
      if (F.rotate(F.DEFAULTS, w, h)) root.document.documentElement.dataset.rotate = "";
    } catch (e) {
      /* no viewport yet */
    }
    F.start();
    const card = () => F.rotateCard();
    if (root.document.body) card();
    else root.document.addEventListener("DOMContentLoaded", card);
  }
  return F;
});
