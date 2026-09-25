/*
 * STUB, Dress up only: the foundation's shared "which one?" module (`pick`:
 * an attribute + noun picks one item among balanced decoys, plus the
 * blind-odds calculator) is not built yet. This file has the same call
 * shape the design brief assumes, so swapping to js/shared/pick.js later is
 * one line in dress.html and one in build/leak_dress.mjs (then delete this).
 *
 *   Pick.rng(seed)                      a seeded random() (mulberry32)
 *   Pick.choose / sample / shuffle / int / weighted (rng first)
 *   Pick.grid(kinds, colours, extra)    every kind in every colour: the
 *                                       balanced decoy set (leak rules 2-3)
 *   Pick.rules(scope, answers)          which decoy rules a scope breaks
 *   Pick.setOdds(scope, answers, opts)  the best blind strategy's chance of
 *                                       picking exactly `answers` from `scope`
 *   Pick.product(ps)                    a round's odds from its parts
 *
 * Pure: no DOM, no Cook. Runs in the browser and in Node.
 */
(function (root) {
  const Dress = (root.Dress = root.Dress || {});
  const Pick = (Dress.Pick = {});

  Pick.rng = function (seed) {
    let a = seed >>> 0 || 0x9e3779b9;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  Pick.int = (rng, [lo, hi]) => lo + Math.floor(rng() * (hi - lo + 1));
  Pick.choose = (rng, arr) => arr[Math.floor(rng() * arr.length)];
  Pick.shuffle = function (rng, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  /** k distinct items; weight(x) > 0 biases the draw (weak words first). */
  Pick.sample = function (rng, arr, k, weight) {
    const pool = arr.slice();
    const out = [];
    while (out.length < k && pool.length) {
      const ws = pool.map((x) => (weight ? Math.max(0.0001, weight(x)) : 1));
      let r = rng() * ws.reduce((s, w) => s + w, 0);
      let i = 0;
      while (i < pool.length - 1 && (r -= ws[i]) > 0) i++;
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  };
  Pick.weighted = (rng, arr, weight) => Pick.sample(rng, arr, 1, weight)[0];

  /** Every kind in every colour (and every value of each `extra` attribute). */
  Pick.grid = function (kinds, colours, extra = {}) {
    let items = [];
    kinds.forEach((kind) => colours.forEach((colour) => items.push({ kind, colour })));
    Object.keys(extra).forEach((attr) => {
      const next = [];
      items.forEach((it) => extra[attr].forEach((v) => next.push(Object.assign({}, it, { [attr]: v }))));
      items = next;
    });
    return items;
  };

  const same = (a, b, feats) => feats.every((f) => a[f] === b[f]);
  const FEATS = ["kind", "colour", "size", "motif"];

  /**
   * Leak rules 2 and 3 (design 8.4) for one scope: the asked kind shows in
   * >= 3 colours (when the palette in play has 3), the asked colour on >= 2
   * kinds (when there are 2), and every colour appears equally often (±1).
   */
  Pick.rules = function (scope, answers) {
    const out = [];
    const colours = [...new Set(scope.map((i) => i.colour).filter(Boolean))];
    const kinds = [...new Set(scope.map((i) => i.kind))];
    answers.forEach((a) => {
      const inKind = new Set(scope.filter((i) => i.kind === a.kind).map((i) => i.colour));
      if (a.colour && inKind.size < Math.min(3, colours.length)) out.push(`asked ${a.kind} in only ${inKind.size} colours`);
      const onKinds = new Set(scope.filter((i) => i.colour === a.colour).map((i) => i.kind));
      if (a.colour && onKinds.size < Math.min(2, kinds.length)) out.push(`asked ${a.colour} on only ${onKinds.size} kinds`);
    });
    const counts = colours.map((c) => scope.filter((i) => i.colour === c).length);
    if (counts.length && Math.max(...counts) - Math.min(...counts) > 1) out.push("colours not balanced");
    return out;
  };

  const choose = (n, k) => {
    if (k < 0 || k > n) return 0;
    let r = 1;
    for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
    return r;
  };
  Pick.C = choose;

  /**
   * The strongest blind prior (design 8.4 rule 11) for picking exactly the
   * set `answers` (k items, any order) from `scope`, seeing only the items.
   * Strategies: uniform over the scope; uniform over the one strictly most
   * common value of any visible feature (kind, colour, size, motif); uniform
   * over the most salient colour (opts.salience(colourId) -> number). If a
   * strategy's set S is smaller than k, it takes all of S and the rest at
   * random. Returns the best of them for THIS round (an upper bound on the
   * bot's chance, which is what the budget needs).
   */
  Pick.setOdds = function (scope, answers, opts = {}) {
    const feats = opts.features || FEATS;
    const k = answers.length;
    const n = scope.length;
    if (!k) return 1;
    const inSet = (S) => answers.every((a) => S.some((s) => same(s, a, feats)));
    const coversAll = (S) => S.every((s) => answers.some((a) => same(s, a, feats)));
    const oddsFor = (S) => {
      if (S.length >= k) return inSet(S) ? 1 / choose(S.length, k) : 0;
      return coversAll(S) ? 1 / choose(n - S.length, k - S.length) : 0;
    };
    let best = 1 / choose(n, k);
    const groups = [];
    feats.forEach((f) => {
      const by = {};
      scope.forEach((s) => s[f] != null && (by[s[f]] = (by[s[f]] || []).concat([s])));
      const sizes = Object.values(by).map((g) => g.length);
      const max = Math.max(0, ...sizes);
      if (sizes.filter((x) => x === max).length === 1 && sizes.length > 1) groups.push(Object.values(by).find((g) => g.length === max));
    });
    if (opts.salience) {
      const sal = (s) => (s.colour ? opts.salience(s.colour) : 0);
      const top = Math.max(...scope.map(sal));
      groups.push(scope.filter((s) => sal(s) === top));
    }
    groups.forEach((S) => (best = Math.max(best, oddsFor(S))));
    return best;
  };
  /** 1 / the number of values a blind guess could take (a count 1-3: 1/3). */
  Pick.rangeOdds = ([lo, hi]) => 1 / (hi - lo + 1);
  Pick.product = (ps) => ps.reduce((a, b) => a * b, 1);

  if (typeof module === "object" && module.exports) module.exports = Pick;
})(typeof globalThis !== "undefined" ? globalThis : this);
