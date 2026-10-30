/*
 * The central rules' one reader (SH-155; docs/game-design/rulebook.md section 1). data/rules.json holds every rule as data; a
 * game asks here and keeps no copy (build/test_shared_rules.mjs: chai). Until the file has loaded every answer is the
 * built-in default below, which is only the file's own shape (the file wins; a test checks the two agree).
 *
 *   Rules.ready                 a Promise of the rules (the page fetches data/rules.json at once; node reads it from disk)
 *   Rules.data                  the file as loaded
 *   Rules.level(lv)             {level, decoys, lookalike, noAsks, cardKutchi, cardEnglish, cardPicture, hintMs} at L1..L4
 *   Rules.hintMs(lv)            the guide's hint wait in ms        Rules.hintList()  all four, in ms (Tokens.ladder.helpMs)
 *   Rules.count(game, lv)       how many of the game's repeating thing: 1 + (most - 1)(lv - 1)/3 rounded, or its override
 *   Rules.counts(game)          [L1..L4] of the same
 *   Rules.xy(game, lv)          a game's per-level counts as [lo, hi] pairs: {x, y, ...} (the clinic's heal-* entries)
 *   Rules.draw([lo, hi], rng)   a whole number in the range      Rules.span([lo, hi])  every number in it
 *   Rules.part(game, axis, lv)  a two-count game's x or y at a level (a number, or [lo, hi])
 *   Rules.wordState(rec)        "new" | "learning" | "known" for a word (rec: {right, pillEarned} as js/core/progress.js keeps)
 *   Rules.hold(state)           the big card's hold in ms for a word state
 *   Rules.pointMs()             the order card's light after the showing
 *   Rules.counterSpot(i, n)     the counter spot of person i of n; Rules.popBelowFacesFrom() from how many people the card goes under the faces
 *   Rules.callAfterLightMs()    a step's call this long after the step opens (its light seen first)
 *   Rules.pointAfterMoveMs()    the order card's light this long after the last thing stops moving
 *   Rules.pillRun()             right picks in a row that hide a word's Kutchi
 *   Rules.firstTimeHold()       does a timed control hold in the green the first time
 *   Rules.noLast()              are "no" items said last
 *   Rules.skips(el)             a tap on el: true = it skips what is said; false = a zone that does its own thing
 *   Rules.zoneOf(el)            the zone el is in ("bubble" | "side" | "cog" | "menu") or "play"
 *   Rules.menu()                the cog menu's item ids, in order
 *   Rules.advance(st, round)    the level-up rule: st {level, streak} + a finished round {level, hints, grownUp} -> new st
 *   Rules.startLevel(st)        the level the game picks for itself from st
 *   Rules.set(json)             (tests) take a rules object, as if the file had changed
 *
 * Plain <script> (window.Rules; Shared.rules) and CommonJS (node: the file from disk at once). js/shared/tokens.js loads this
 * script itself on a page that has not, so every page that has the tokens has the rules.
 */
(function (root, factory) {
  const R = factory(root);
  if (typeof module === "object" && module.exports) module.exports = R;
  else {
    root.Rules = R;
    (root.Shared = root.Shared || {}).rules = R;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const R = {};
  R.FILE = "data/rules.json";
  // the file's own shape, used only until it has loaded (the unit test holds these equal to the file)
  const DEFAULT = {
    levels: { decoys: [1, 2, 3, 4], lookalike: [false, false, false, true], noAsks: [false, true, true, true], cardKutchi: [true, true, true, true], cardEnglish: [true, false, false, false], cardPicture: [true, true, false, false], hintS: [7, 9, 11, 13] },
    count: { games: {} },
    advance: { rounds: 3, maxGuideHints: 1, down: false, top: 4 },
    showing: { pointMs: 1200 },
    timed: { firstTimeHold: true },
    words: { pill: { rightInARow: 3 }, holdMs: { new: 1500, learning: 1000, known: 600 } },
    order: { noLast: true },
    skip: { never: { bubble: [".cv-bubble", ".njg-bubble"], side: ["#side"], cog: ["[data-njg-zone=cog]", "#side-cog"], menu: ["[data-njg-zone=menu]", "#side-menu", ".njg-gu-pop"] } },
    menu: { items: [{ id: "btn-help" }, { id: "btn-home" }, { id: "btn-book" }] },
  };
  R.DEFAULT = DEFAULT;
  R.data = DEFAULT;
  R.loaded = false;
  const sec = (k) => (R.data && R.data[k]) || DEFAULT[k];
  const lvOf = (lv) => Math.min(4, Math.max(1, Math.round(Number(lv)) || 1));
  const at = (list, lv) => (Array.isArray(list) && list.length ? list[Math.min(list.length, lvOf(lv)) - 1] : undefined);

  R.set = function (json) {
    if (json && typeof json === "object") {
      R.data = json;
      R.loaded = true;
    }
    return R;
  };

  /* ---------------- levels ---------------- */
  R.level = function (lv) {
    const L = sec("levels");
    const D = DEFAULT.levels;
    const pick = (k) => {
      const v = at(L[k], lv);
      return v === undefined ? at(D[k], lv) : v;
    };
    return {
      level: lvOf(lv),
      decoys: pick("decoys"),
      lookalike: !!pick("lookalike"),
      noAsks: !!pick("noAsks"),
      cardKutchi: pick("cardKutchi") !== false,
      cardEnglish: !!pick("cardEnglish"),
      cardPicture: !!pick("cardPicture"),
      hintMs: Math.round(pick("hintS") * 1000),
    };
  };
  R.hintMs = (lv) => R.level(lv).hintMs;
  R.hintList = () => [1, 2, 3, 4].map(R.hintMs);

  /* ---------------- how many ---------------- */
  R.count = function (game, lv) {
    const g = (sec("count").games || {})[game];
    const n = lvOf(lv);
    if (!g) return null;
    const own = g.levels && g.levels[String(n)];
    if (typeof own === "number") return own;
    const most = Math.max(1, Number(g.most) || 1);
    return Math.round(1 + ((most - 1) * (n - 1)) / 3);
  };
  R.counts = (game) => (R.count(game, 1) == null ? null : [1, 2, 3, 4].map((n) => R.count(game, n)));
  // S14 roll-out (the clinic, the rulebook's section 3): a game with two counts (x + y) and other per-level numbers; each a
  // number or a [lo, hi] pair (a random number in the range, drawn by the game with Rules.draw). Every per-level table of the
  // game's entry is answered as [lo, hi] (a number n is [n, n]); a game with only `levels` answers it as x. null: no entry.
  const span = (v) => {
    if (Array.isArray(v) && v.length) return [Math.round(Number(v[0])), Math.round(Number(v[v.length - 1]))];
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? [n, n] : null;
  };
  R.xy = function (game, lv) {
    const g = (sec("count").games || {})[game];
    if (!g) return null;
    const n = String(lvOf(lv));
    const out = {};
    for (const k of Object.keys(g)) {
      const t = g[k];
      if (k.startsWith("_") || !t || typeof t !== "object" || Array.isArray(t) || !(n in t)) continue;
      const s = span(t[n]);
      if (s) out[k === "levels" ? "x" : k] = s;
    }
    if (!out.x && R.count(game, lv) != null && g.most != null) out.x = [R.count(game, lv), R.count(game, lv)];
    return out;
  };
  /** A whole number in [lo, hi] (both ends included) from rng (a () => [0, 1) function, default Math.random). */
  R.draw = function (range, rng) {
    const s = span(range);
    if (!s) return null;
    const lo = Math.min(s[0], s[1]);
    const hi = Math.max(s[0], s[1]);
    const r = typeof rng === "function" ? rng() : Math.random();
    return lo + Math.min(hi - lo, Math.floor(r * (hi - lo + 1)));
  };
  /** Every whole number in [lo, hi] (a game's choices, such as a count row's options). */
  R.span = (range) => {
    const s = span(range);
    if (!s) return [];
    const out = [];
    for (let i = Math.min(s[0], s[1]); i <= Math.max(s[0], s[1]); i++) out.push(i);
    return out;
  };
  /** A two-count game's x or y at a level (count.games[game].x / .y; Cook's daar: chopped + added first): a number, or [lo, hi]. */
  R.part = function (game, axis, lv) {
    const g = (sec("count").games || {})[game];
    const t = g && (axis === "x" || axis === "y") ? g[axis] : null;
    const v = t ? t[String(lvOf(lv))] : null;
    return v == null ? null : Array.isArray(v) ? v.slice(0, 2).map(Number) : Number(v);
  };

  /* ---------------- words ---------------- */
  R.pillRun = () => Math.max(1, Number((sec("words").pill || {}).rightInARow) || DEFAULT.words.pill.rightInARow);
  R.wordState = function (rec) {
    const r = rec || {};
    if (r.pillEarned) return "known";
    return (Number(r.right) || 0) > 0 ? "learning" : "new";
  };
  R.hold = function (state) {
    const H = sec("words").holdMs || DEFAULT.words.holdMs;
    const v = H[state] != null ? H[state] : H.learning;
    return Number(v) || 0;
  };

  /* ---------------- the showing, timed controls, the order ---------------- */
  R.pointMs = () => Number(sec("showing").pointMs) || 0;
  R.callAfterLightMs = () => Number(sec("showing").callAfterLightMs) || 0;
  R.pointAfterMoveMs = () => Number(sec("showing").pointAfterMoveMs) || 0;
  R.lightHelpArrow = () => sec("showing").lightHelpArrow === true;
  /** The counter's spot (0 left, 1 middle, 2 right) of person i of n (the central rules' scene.counterSpots). */
  R.counterSpot = (i, n) => {
    const t = (sec("scene").counterSpots || {})[String(n)];
    return Array.isArray(t) && t[i] != null ? t[i] : n === 1 ? 1 : i;
  };
  R.popBelowFacesFrom = () => Number(sec("scene").popBelowFacesFrom) || 99;
  R.firstTimeHold = () => sec("timed").firstTimeHold !== false;
  R.noLast = () => sec("order").noLast !== false;

  /* ---------------- skipping ---------------- */
  R.zoneOf = function (el) {
    const never = sec("skip").never || {};
    if (!el || !el.closest) return "play";
    for (const zone of Object.keys(never)) {
      if (zone.startsWith("_")) continue;
      const sel = [].concat(never[zone] || []).join(", ");
      try {
        if (sel && el.closest(sel)) return zone;
      } catch (e) {
        /* a selector this page cannot read: not this zone */
      }
    }
    return "play";
  };
  R.skips = (el) => R.zoneOf(el) === "play";

  /* ---------------- the cog's menu ---------------- */
  R.menu = () => [].concat(sec("menu").items || []).map((x) => (typeof x === "string" ? x : x && x.id)).filter(Boolean);

  /* ---------------- moving up a level ---------------- */
  // st: {level, streak} (the save's, per game); round: {level, hints, grownUp}. Only a round at the stored level, picked by the
  // game, moves the count; a grown-up's pick plays at its own level and leaves the count as it was.
  R.advance = function (st, round) {
    const A = sec("advance");
    const top = Number(A.top) || 4;
    const cur = { level: lvOf((st && st.level) || 1), streak: Math.max(0, Number(st && st.streak) || 0) };
    if (!round || round.grownUp || lvOf(round.level) !== cur.level) return cur;
    const good = (Number(round.hints) || 0) <= (Number(A.maxGuideHints) || 0);
    if (!good) return { level: cur.level, streak: 0 };
    const streak = cur.streak + 1;
    if (streak >= (Number(A.rounds) || 3) && cur.level < top) return { level: cur.level + 1, streak: 0 };
    return { level: cur.level, streak: Math.min(streak, Number(A.rounds) || 3) };
  };
  R.startLevel = (st) => lvOf((st && st.level) || 1);

  /* ---------------- loading ---------------- */
  if (typeof module === "object" && module.exports && typeof require === "function") {
    try {
      R.set(JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "..", "..", R.FILE), "utf8")));
    } catch (e) {
      /* no file: the defaults */
    }
    R.ready = Promise.resolve(R);
  } else {
    const self = root.document && root.document.currentScript && root.document.currentScript.src;
    const base = self ? self.replace(/js\/shared\/rules\.js.*$/, "") : root.NJG_RULES_BASE || "";
    let url = base + R.FILE;
    if (typeof root.njgV === "function") url = root.njgV(url);
    else if (root.NJG_V) url += (url.includes("?") ? "&" : "?") + "v=" + root.NJG_V;
    R.ready =
      typeof root.fetch === "function"
        ? root
            .fetch(url)
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => R.set(j))
            .catch(() => R)
        : Promise.resolve(R);
  }
  return R;
});
