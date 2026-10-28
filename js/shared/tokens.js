/*
 * The design tokens in code (S13-A1; the kit review 2, decisions 2 and 8, Zafar 26 Oct). css/shared/tokens.css holds every
 * colour and motion number as a --njg-* variable; data/shared.json holds the help, bulb and bulb-pulse ladders. Code reads
 * them here and keeps no copy of its own (build/lint/static.mjs: jscolour, bulb).
 *
 *   Tokens.css(name)    the computed --njg-<name> on <html> ("" with no page, or before the kit's sheet has loaded)
 *   Tokens.hex(name)    "#e0a63a"        a colour token, for SVG and canvas
 *   Tokens.int(name)    0xe0a63a         the same, for Phaser tints and fills
 *   Tokens.rgb(name)    "224, 166, 58"   the same, for rgba(...) in a style written from code
 *   Tokens.ms(name)     1200             a duration token ("1.2s", "1200ms") in ms
 *   Tokens.px(name)     12               a length token in px
 *   Motion              the kit's four moves, read when asked (css/shared/focus.css draws them):
 *                         Motion.glow  {ms, radius, rgb, alpha, color}   (color: Phaser's 0xRRGGBB)
 *                         Motion.pulse {ms, scale}   Motion.hop {ms}   Motion.talk {ms, tilt}
 *   Tokens.ladder       {helpMs: [L1..L4], bulbMs: [L1..L5], bulbPulseMs} from data/shared.json; until it has loaded every
 *                       field is null (the readers then wait: no help, no pulse; the page loads it at once)
 *   Tokens.ready        a Promise of the ladder
 *
 * Plain <script> (window.Tokens, window.Motion; Shared.tokens) and CommonJS (node: the ladder is read from disk at once).
 */
(function (root, factory) {
  const T = factory(root);
  if (typeof module === "object" && module.exports) module.exports = T;
  else {
    root.Tokens = T;
    root.Motion = T.Motion;
    (root.Shared = root.Shared || {}).tokens = T;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const T = {};
  const doc = () => (root.document && root.document.documentElement ? root.document : null);

  T.css = function (name) {
    const d = doc();
    if (!d || !root.getComputedStyle) return "";
    return root.getComputedStyle(d.documentElement).getPropertyValue(`--njg-${name}`).trim();
  };
  // "#rgb", "#rrggbb", "rgb(r, g, b)" or a bare "r, g, b" -> [r, g, b] (null when it is none of them)
  const rgbOf = (v) => {
    const s = String(v || "").trim();
    let m = /^#([0-9a-f]{3})$/i.exec(s);
    if (m) return m[1].split("").map((c) => parseInt(c + c, 16));
    m = /^#([0-9a-f]{6})/i.exec(s);
    if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
    m = /^(?:rgba?\()?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(s);
    return m ? [+m[1], +m[2], +m[3]] : null;
  };
  T.rgbOf = rgbOf;
  // a font role from the central type (css/shared/tokens.css "type": display, body, word), for drawn (Phaser) text
  T.font = (role, fallback) => T.css(`font-${role}`) || fallback || "";
  // the drawn games' palette (Cook's stations: text, the Kutchi word, card, grey, gold, panel, page), read once the sheet is in
  let pal = null;
  T.cookInk = () => {
    if (pal) return pal;
    const p = { text: T.hex("ink-text"), kutchi: T.hex("ink-kutchi"), grey: T.int("grey"), gold: T.int("gold"), panel: T.int("panel"), page: T.int("page") };
    if (p.text) pal = p;
    return p;
  };
  T.hex = (name) => {
    const c = rgbOf(T.css(name));
    return c ? "#" + c.map((x) => x.toString(16).padStart(2, "0")).join("") : null;
  };
  T.int = (name) => {
    const c = rgbOf(T.css(name));
    return c ? (c[0] << 16) | (c[1] << 8) | c[2] : null;
  };
  T.rgb = (name) => {
    const c = rgbOf(T.css(name));
    return c ? c.join(", ") : null;
  };
  T.ms = (name) => {
    const m = /^(-?[\d.]+)\s*(ms|s)?$/.exec(T.css(name));
    return m ? +m[1] * (m[2] === "s" ? 1000 : 1) : null;
  };
  T.px = (name) => {
    const v = parseFloat(T.css(name));
    return isNaN(v) ? null : v;
  };
  const num = (name) => {
    const v = parseFloat(T.css(name));
    return isNaN(v) ? null : v;
  };

  /* ---------------- motion: the glow, pulse, hop and talk (css/shared/tokens.css, css/shared/focus.css) ---------------- */
  const M = (T.Motion = {});
  Object.defineProperties(M, {
    glow: { enumerable: true, get: () => ({ ms: T.ms("glow-ms"), radius: T.px("glow-radius"), rgb: T.rgb("glow-rgb"), alpha: num("glow-alpha"), color: T.int("glow-rgb") }) },
    pulse: { enumerable: true, get: () => ({ ms: T.ms("pulse-ms"), scale: num("pulse-scale") }) },
    hop: { enumerable: true, get: () => ({ ms: T.ms("hop-ms") }) },
    talk: { enumerable: true, get: () => ({ ms: T.ms("talk-ms"), tilt: num("talk-tilt") }) },
  });

  /* ---------------- the ladders: data/shared.json ---------------- */
  const EMPTY = { helpMs: null, bulbMs: null, bulbPulseMs: null };
  T.ladder = Object.assign({}, EMPTY);
  const take = (j) => {
    if (j && typeof j === "object") for (const k of Object.keys(EMPTY)) if (j[k] != null) T.ladder[k] = j[k];
    return T.ladder;
  };
  T.LADDER_FILE = "data/shared.json";
  if (typeof module === "object" && module.exports && typeof require === "function") {
    // node (the unit tests): the table from disk, at once
    try {
      take(JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "..", "..", T.LADDER_FILE), "utf8")));
    } catch (e) {
      /* no table: the readers wait */
    }
    T.ready = Promise.resolve(T.ladder);
  } else {
    // the page: this script's own address finds the table (a page in lab/ too); njgV stamps it (B7)
    const self = root.document && root.document.currentScript && root.document.currentScript.src;
    const base = self ? self.replace(/js\/shared\/tokens\.js.*$/, "") : "";
    let url = base + T.LADDER_FILE;
    if (typeof root.njgV === "function") url = root.njgV(url);
    else if (root.NJG_V) url += (url.includes("?") ? "&" : "?") + "v=" + root.NJG_V;
    T.ready =
      typeof root.fetch === "function"
        ? root
            .fetch(url)
            .then((r) => (r.ok ? r.json() : null))
            .then(take)
            .catch(() => T.ladder)
        : Promise.resolve(T.ladder);
  }
  return T;
});
