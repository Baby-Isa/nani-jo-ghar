/*
 * Find it: the non-speaker bot, pure (docs/find-it-design.md D5, 8.2
 * phase 0). The headless twin of js/find/bot.js (which plays in the page):
 * the same idea, "the wife's test as code", on a round built by
 * js/find/gen.js, so build/leak_find.mjs can play thousands of rounds of
 * every game in Node.
 *
 * It sees only what a person who knows no Kutchi sees (Blind.screen):
 *   - the pictures on the stall, what they are in English (anyone can tell
 *     an orange from a lemon), where they are and how big they look, and
 *     the place each is in, in English (anyone can see it's in a crate);
 *   - each row as drawn: a Kutchi word as its text at stage 2, as a dot at
 *     stage 3; a placeholder word ([EN: in the crate]) as readable English;
 *     the count's digit only while the number word is taught (stage <= 1);
 *   - which row is a "no" row (it's marked).
 * It never reads the round's rows. It remembers a word's picture once a tap
 * on it has been accepted (a non-speaker can learn a sound within a round).
 *
 * Strategies:
 *   noun   salient (biggest picture), copies (most copies out), leftright,
 *          random, cognate (the row's text looks like an English name)
 *   size   bigger, smaller, odd-size (the size that thing has fewest of),
 *          any (a random copy)
 *   copy   visible (the most visible copy: biggest, nearest the front),
 *          nearest (to the last tap), first (left to right), reader (the
 *          place a readable placeholder names)
 *   pills  random (Ali's turn and the bowl, where a non-speaker can only tap)
 */
(function (root, factory) {
  const req = (p) => (typeof require === "function" ? require(p) : null);
  const Gen = (root && root.Find && root.Find.Gen) || req("./gen.js");
  const B = factory(Gen);
  if (typeof module === "object" && module.exports) module.exports = B;
  else {
    root.Find = root.Find || {};
    root.Find.Blind = B;
  }
})(typeof self !== "undefined" ? self : this, function (Gen) {
  "use strict";
  const B = {};
  B.NOUN = ["salient", "copies", "leftright", "random", "cognate"];
  B.SIZE = ["bigger", "smaller", "odd-size", "any"];
  B.COPY = ["visible", "nearest", "first", "reader"];

  /* ---------------- what's on screen ---------------- */
  /**
   * The screen for a round: items {id, pic, english, x, y, scale, area,
   * places: English place names}, rows {no, tokens: [{text, dot, ph}], digit}.
   * opts: {stage, numStage, words(id) -> {kutchi, english}, sizes: {id: scale},
   * hidePlaceholders (as if the family's words were in)}
   */
  B.screen = function (round, scene, opts) {
    const W = opts.words;
    const items = round.items.map((it) => {
      const scale = (opts.sizes || {})[it.size] || 1;
      return {
        id: it.id,
        pic: it.noun,
        english: (W(it.noun) || {}).english || "",
        x: it.x,
        y: it.baseline,
        scale,
        area: scale * scale * (it.area || 1),
        places: (it.rel || []).filter((r) => scene.anchors && scene.anchors[r[1]]).map((r) => `${Gen.Rel.id(r[0])} ${(scene.anchors[r[1]].en || Gen.anchorWord(scene, r[1]))}`),
      };
    });
    const rows = round.wants.map((w) => B.row(w, scene, opts));
    return { items, rows };
  };
  /** One row as drawn (what a non-speaker can read of it). */
  B.row = function (w, scene, opts) {
    const W = opts.words;
    const tok = (id) => {
      const x = W(id) || {};
      if (x.kutchi) return opts.stage >= 3 ? { dot: true } : { text: x.kutchi };
      if (opts.hidePlaceholders) return { dot: true, ph: true };
      return { text: x.english || id, ph: true };
    };
    const tokens = [];
    if (!w.not && w.count != null && !w.call) tokens.push(tok(opts.numId(w.count)));
    if (w.size) tokens.push(tok(w.size));
    tokens.push(tok(w.noun));
    if (w.where) {
      const a = scene.anchors[w.where[1]] || {};
      tokens.push(tok(a.word || a.en));
      tokens.push(Object.assign(tok((Gen.Rel.info(w.where[0]) || {}).word), { rel: Gen.Rel.id(w.where[0]), anchorEn: a.en }));
    }
    return { no: !!w.not, tokens, digit: !w.not && !w.call && w.count != null && Gen.digitShown(opts.numStage) ? w.count : null };
  };

  /* ---------------- choosing ---------------- */
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  /** How much a row's visible text looks like an English name (0 = the same word). */
  B.likeness = function (row, english) {
    const toks = row.tokens.filter((t) => t.text && !t.ph).map((t) => t.text.toLowerCase());
    const names = String(english).toLowerCase().split(/[^a-z]+/).filter(Boolean);
    let best = 1;
    toks.forEach((t) => names.forEach((n) => (best = Math.min(best, lev(t, n) / Math.max(t.length, n.length)))));
    return best;
  };
  B.kinds = function (items) {
    const by = new Map();
    items.forEach((x) => {
      const k = by.get(x.pic) || { pic: x.pic, english: x.english, els: [], area: 0, minX: Infinity };
      k.els.push(x);
      k.area = Math.max(k.area, x.area);
      k.minX = Math.min(k.minX, x.x);
      by.set(x.pic, k);
    });
    return [...by.values()];
  };
  /** A kind of picture for a row, by the noun strategy, among those not ruled out. */
  B.pickKind = function (row, kinds, strategy, rng, used) {
    const pool = kinds.filter((k) => !used.has(k.pic));
    if (!pool.length) return null;
    if (strategy === "cognate") {
      const c = pool.slice().sort((a, b) => B.likeness(row, a.english) - B.likeness(row, b.english))[0];
      if (c && B.likeness(row, c.english) <= 0.4) return c;
      strategy = "salient";
    }
    if (strategy === "random") return Gen.pick(pool, rng);
    const order = { salient: (a, b) => b.area - a.area, copies: (a, b) => b.els.length - a.els.length, leftright: (a, b) => a.minX - b.minX }[strategy];
    return pool.slice().sort(order)[0];
  };
  /** Which copies of a kind, by the size strategy. */
  B.pickCopies = function (kind, n, strategy, rng) {
    let els = kind.els.slice();
    if (strategy === "any") els = Gen.shuffle(els, rng);
    else if (strategy === "smaller") els.sort((a, b) => a.scale - b.scale);
    else if (strategy === "odd-size") {
      const n1 = {};
      els.forEach((e) => (n1[e.scale] = (n1[e.scale] || 0) + 1));
      els.sort((a, b) => n1[a.scale] - n1[b.scale] || b.scale - a.scale);
    } else els.sort((a, b) => b.scale - a.scale || b.area - a.area);
    return els.slice(0, n);
  };
  /** One copy for a call, by the copy strategy. */
  B.pickCopy = function (kind, row, strategy, rng, last) {
    const els = kind.els;
    if (!els.length) return null;
    if (strategy === "reader") {
      const r = row.tokens.find((t) => t.rel && !t.dot);
      if (r) {
        const m = els.filter((e) => e.places.includes(`${r.rel} ${r.anchorEn}`));
        if (m.length) return Gen.pick(m, rng);
      }
      strategy = "visible";
    }
    if (strategy === "first") return els.slice().sort((a, b) => a.x - b.x)[0];
    if (strategy === "nearest") {
      const p = last || { x: 800, y: 450 };
      return els.slice().sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
    }
    return els.slice().sort((a, b) => b.area - a.area || b.y - a.y)[0];
  };

  /* ---------------- playing: the page's rules, headless ---------------- */
  /**
   * Nani's list and Which one? (R1): pick a kind per row, tap n copies,
   * Done, then the bag. Returns {ear, reason}. The ear star goes on any
   * wrong tap, a wrong count at Done, or a wrong first tap in the bag
   * (every row is tested at stages 2 and 3), exactly as js/find/round.js.
   */
  B.playList = function (round, scene, screen, strat, rng, { bag = null, countTaught = false } = {}) {
    const kinds = B.kinds(screen.items);
    const used = new Set();
    // a "no X" row: a cognate bot avoids the thing it looks like
    if (strat.noun === "cognate")
      screen.rows.forEach((r) => {
        if (!r.no) return;
        const k = kinds.slice().sort((a, b) => B.likeness(r, a.english) - B.likeness(r, b.english))[0];
        if (k && B.likeness(r, k.english) <= 0.4) used.add(k.pic);
      });
    const rows = round.wants.map((w) => ({ want: w, got: 0 }));
    const live = new Map(round.items.map((it) => [it.id, it]));
    const picked = new Set();
    let ear = true;
    let why = null;
    const order = Gen.shuffle(screen.rows.map((r, i) => i).filter((i) => !screen.rows[i].no), rng);
    for (const i of order) {
      const r = screen.rows[i];
      const k = B.pickKind(r, kinds, strat.noun, rng, used);
      if (!k) continue;
      used.add(k.pic);
      picked.add(k.pic);
      const n = r.digit || 1 + Math.floor(rng() * 3);
      for (const el of B.pickCopies({ els: k.els.filter((e) => live.has(e.id)) }, n, strat.size, rng)) {
        const it = live.get(el.id);
        const row = rows.find((x) => !x.want.not && Gen.matches(it, x.want, scene) && x.got < x.want.count) || rows.find((x) => !x.want.not && Gen.matches(it, x.want, scene));
        if (row) {
          row.got++;
          live.delete(el.id);
        } else if (ear) {
          ear = false;
          why = "wrong thing";
        }
      }
    }
    // Done: over and under are graded (unless the count is taught: the digit shows)
    if (!countTaught && rows.some((x) => !x.want.not && x.got !== x.want.count) && ear) {
      ear = false;
      why = "count";
    }
    if (!bag) return { ear, why };
    // the bag: a kind it didn't pick itself, then one there's only one of, then anything
    const bk = new Map();
    bag.packed.forEach((noun) => bk.set(noun, (bk.get(noun) || 0) + 1));
    const bagKinds = [...bk.entries()].map(([pic, n]) => ({ pic, n }));
    const choice = bagKinds.find((k) => !picked.has(k.pic)) || bagKinds.find((k) => k.n === 1) || Gen.pick(bagKinds, rng);
    if (choice && choice.pic !== bag.wrongNoun && ear) {
      ear = false;
      why = "bag";
    }
    return { ear, why };
  };

  /**
   * Where is it? (R2): one call at a time; the first tap on each must be
   * right. The bot remembers a word's picture once accepted.
   */
  B.playCalls = function (round, scene, screen, strat, rng) {
    const live = new Map(round.items.map((it) => [it.id, it]));
    const known = new Map(); // noun heard -> picture (a non-speaker learns the sound)
    let last = null;
    for (let i = 0; i < round.wants.length; i++) {
      const w = round.wants[i];
      const r = screen.rows[i];
      const items = screen.items.filter((x) => live.has(x.id));
      const kinds = B.kinds(items);
      let k = known.has(w.noun) ? kinds.find((x) => x.pic === known.get(w.noun)) : null;
      if (!k) k = B.pickKind(r, kinds, strat.noun, rng, new Set([...known.values()]));
      if (!k) return { ear: false, why: "nothing left" };
      const el = B.pickCopy(k, r, strat.copy, rng, last);
      last = el;
      const it = live.get(el.id);
      if (!Gen.matches(it, w, scene)) return { ear: false, why: it.noun === w.noun ? "wrong place" : "wrong thing" };
      known.set(w.noun, k.pic);
      live.delete(el.id);
    }
    return { ear: true };
  };

  /**
   * A speaking moment played by pills alone: a random pill per ask. Returns
   * the number of first-try hits and the moments (via "pill": never the voice star).
   */
  B.playPills = function (asks, rng) {
    let hits = 0;
    const moments = asks.map((a) => {
      const c = Gen.pick(a.choices, rng);
      if (a.ok(c)) hits++;
      return { choice: c, via: "pill", tries: 1 };
    });
    return { hits, all: hits === asks.length, moments };
  };

  return B;
});
