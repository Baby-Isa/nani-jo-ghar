/*
 * Shared "which one?" chooser (docs/shared-api.md s2).
 *
 * The same decision sits in five modes with five renderers: an attribute +
 * a noun picks one thing among decoys (Find it M3, Dress up's rack, Snap
 * M4, Who did it's "is/has" clues, Tidy up rows with attrs, the clinic's
 * green bandage). This module is that decision, once: the decoy rule, the
 * look-alike groups, line-up balance, what is still consistent, and the
 * blind-odds calculator that says how often a player who knows no Kutchi
 * would get the round right, with the generator loop that adds a row or a
 * decoy until that is under budget (Dress up 8.4 rule 11: <= 5%).
 *
 * An item is {id, noun, <dim>: value...} (or {id, noun, attrs: {...}}).
 * A row is {noun, attrs: {colour: "red"}, count?} (flat {noun, colour}
 * works too). Dims are whatever the mode uses: colour, size, pattern,
 * shade, wears, holds...
 *
 *   WhichOne.rng(seed)                        seeded random (mulberry32)
 *   WhichOne.matches(item, row)               does this item answer the row?
 *   WhichOne.checkDecoys(items, row, opts)    {ok, problems} for the decoy rule
 *   WhichOne.build(row, opts)                 a rack/stall/line-up that passes it
 *   WhichOne.group(id, groups)  candidates(id, groups, opts)  checkGroups(groups)
 *   WhichOne.balance(items, used, opts)       every said value on >= 2 items
 *   WhichOne.distinctive(item, items, dims)   how many of its values are unique
 *   WhichOne.consistent(items, clues)         who still fits what's been said
 *   WhichOne.lucky(items, clues)              accusing now would be a guess
 *   WhichOne.blindOdds(rows, items, opts)     {p, rows: [{p, strategy, candidates}]}
 *   WhichOne.fitBudget(make, opts)            add rows/decoys until p <= budget
 *   WhichOne.estimate(trials, playOnce)       Monte Carlo rate for a leak bot
 *
 * Plain <script>: window.WhichOne (and Shared.whichone); Node: require().
 */
(function (root, factory) {
  const W = factory();
  if (typeof module === "object" && module.exports) module.exports = W;
  else {
    root.WhichOne = W;
    (root.Shared = root.Shared || {}).whichone = W;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const W = {};

  W.rng = function (seed) {
    let a = (seed == null ? Math.floor(Math.random() * 2 ** 32) : seed) >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
  W.shuffle = function (arr, rnd) {
    rnd = rnd || Math.random;
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  W.val = (item, dim) => (dim === "noun" ? item.noun : item.attrs && item.attrs[dim] !== undefined ? item.attrs[dim] : item[dim]);
  /** The asked dims of a row, as {dim: value} (row.attrs, or flat keys other than noun/count/id). */
  W.asked = function (row) {
    if (row.attrs) return Object.assign({}, row.attrs);
    const out = {};
    for (const [k, v] of Object.entries(row)) if (!["noun", "count", "id", "not", "where", "visible", "_"].includes(k) && v != null && typeof v !== "object") out[k] = v;
    return out;
  };
  W.matches = function (item, row) {
    if (row.noun != null && item.noun !== row.noun) return false;
    for (const [d, v] of Object.entries(W.asked(row))) if (W.val(item, d) !== v) return false;
    return true;
  };

  const DEFAULTS = { minValues: { _: 3, size: 2 }, minNouns: 2, balanced: true, tolerance: 1 };
  const minValuesFor = (opts, d) => {
    const mv = opts.minValues;
    if (typeof mv === "number") return mv;
    return mv && mv[d] != null ? mv[d] : mv && mv._ != null ? mv._ : 3;
  };

  /**
   * The decoy rule, checked:
   *  - the row is answered by exactly `count` items (default 1);
   *  - the asked noun appears in >= minValues values of each asked dim
   *    (3 colours; 2 sizes: size is big/small);
   *  - each asked value appears on >= minNouns different nouns;
   *  - balanced: across the items, every value of each asked dim appears
   *    the same number of times +-1 (so no colour is the odd one out).
   * opts: {minValues: n | {dim: n, _: default}, minNouns, balanced, tolerance, count}
   */
  W.checkDecoys = function (items, row, opts) {
    opts = Object.assign({}, DEFAULTS, opts || {});
    const probs = [];
    const want = row.count != null ? row.count : opts.count != null ? opts.count : 1;
    const hits = items.filter((it) => W.matches(it, row)).length;
    if (hits !== want) probs.push(`row answered by ${hits} items, wants ${want}`);
    const asked = W.asked(row);
    for (const [d, v] of Object.entries(asked)) {
      if (row.noun != null) {
        const vals = new Set(items.filter((it) => it.noun === row.noun).map((it) => W.val(it, d)).filter((x) => x != null));
        const need = minValuesFor(opts, d);
        if (vals.size < need) probs.push(`${row.noun} in ${vals.size} ${d} values, needs ${need}`);
      }
      const nouns = new Set(items.filter((it) => W.val(it, d) === v).map((it) => it.noun));
      if (nouns.size < opts.minNouns) probs.push(`${d} ${v} on ${nouns.size} nouns, needs ${opts.minNouns}`);
      if (opts.balanced) {
        const counts = {};
        for (const it of items) {
          const x = W.val(it, d);
          if (x != null) counts[x] = (counts[x] || 0) + 1;
        }
        const palette = (opts.palette && opts.palette[d]) || Object.keys(counts);
        const ns = palette.map((p) => counts[p] || 0);
        if (Math.max(...ns) - Math.min(...ns) > opts.tolerance) probs.push(`${d} unbalanced: ${palette.map((p, i) => `${p}×${ns[i]}`).join(" ")}`);
      }
    }
    return { ok: probs.length === 0, problems: probs };
  };

  /**
   * Build items for one row that pass checkDecoys.
   * opts: {values: {dim: [palette]}, nouns: [other nouns, ideally the
   * target's look-alike group], total, rng, count, plus checkDecoys opts,
   * tries (default 60)}. Dims in `values` that the row doesn't ask are
   * filled too (balanced), so they distract rather than tell.
   * Returns items with ids "w1".."wn", shuffled; throws if it can't.
   */
  W.build = function (row, opts) {
    opts = Object.assign({}, DEFAULTS, opts || {});
    const rnd = opts.rng || Math.random;
    const values = opts.values || {};
    const asked = W.asked(row);
    const want = row.count != null ? row.count : opts.count != null ? opts.count : 1;
    const nouns = [row.noun].concat((opts.nouns || []).filter((n) => n !== row.noun));
    const dims = Array.from(new Set(Object.keys(values).concat(Object.keys(asked))));
    for (let attempt = 0; attempt < (opts.tries || 60); attempt++) {
      const items = [];
      const counts = {};
      dims.forEach((d) => (counts[d] = {}));
      const add = (noun, fixed) => {
        const it = { noun };
        for (const d of dims) {
          let v = fixed && fixed[d] !== undefined ? fixed[d] : undefined;
          if (v === undefined) {
            const pal = values[d] || [asked[d]];
            const low = Math.min(...pal.map((p) => counts[d][p] || 0));
            v = pick(pal.filter((p) => (counts[d][p] || 0) === low), rnd);
          }
          it[d] = v;
          counts[d][v] = (counts[d][v] || 0) + 1;
        }
        items.push(it);
        return it;
      };
      const isTarget = (noun, fixed) => noun === row.noun && Object.entries(asked).every(([d, v]) => fixed[d] === v);
      // the target(s)
      for (let i = 0; i < want; i++) add(row.noun, asked);
      // the asked noun in other values of each asked dim
      for (const [d, v] of Object.entries(asked)) {
        const others = W.shuffle((values[d] || []).filter((x) => x !== v), rnd).slice(0, minValuesFor(opts, d) - 1);
        for (const o of others) add(row.noun, Object.assign({}, asked, { [d]: o }));
      }
      // each asked value on other nouns
      for (const [d, v] of Object.entries(asked)) {
        const on = W.shuffle(nouns.slice(1), rnd).slice(0, opts.minNouns - 1);
        for (const n of on) add(n, { [d]: v });
      }
      // fill, never making another target
      const total = Math.max(opts.total || items.length, items.length);
      let guard = 0;
      while (items.length < total && guard++ < total * 20) {
        const noun = pick(nouns, rnd);
        const probe = {};
        for (const d of dims) {
          const pal = values[d] || [asked[d]];
          const low = Math.min(...pal.map((p) => counts[d][p] || 0));
          probe[d] = pick(pal.filter((p) => (counts[d][p] || 0) === low), rnd);
        }
        if (isTarget(noun, probe)) continue;
        add(noun, probe);
      }
      const out = W.shuffle(items, rnd).map((it, i) => Object.assign({ id: `w${i + 1}` }, it));
      const chk = W.checkDecoys(out, row, Object.assign({}, opts, { palette: opts.balanced ? opts.values : undefined }));
      if (chk.ok) return out;
    }
    throw new Error(`WhichOne.build: no rack passes the decoy rule for ${JSON.stringify(row)}`);
  };

  /* ------------------------------------------------ look-alike groups */
  const groupsOf = (groups) => (Array.isArray(groups) ? groups : (groups && groups.groups) || []);
  W.group = (id, groups) => groupsOf(groups).find((g) => g.includes(id)) || null;
  /**
   * The candidates to show with `id`: its whole look-alike group (or n of
   * it, always including id), shuffled, so the target is never the odd one
   * out and every member's candidates look the same (the groups are
   * symmetric). opts: {n, rng, exclude: [ids]}.
   */
  W.candidates = function (id, groups, opts) {
    opts = opts || {};
    const g = W.group(id, groups);
    if (!g) return [id];
    let rest = g.filter((x) => x !== id && !(opts.exclude || []).includes(x));
    rest = W.shuffle(rest, opts.rng);
    if (opts.n) rest = rest.slice(0, opts.n - 1);
    return W.shuffle([id].concat(rest), opts.rng);
  };
  W.checkGroups = function (groups) {
    const seen = {};
    const probs = [];
    groupsOf(groups).forEach((g, i) => {
      if (g.length < 2) probs.push(`group ${i} has ${g.length} member`);
      for (const id of g) {
        if (seen[id] != null) probs.push(`${id} is in groups ${seen[id]} and ${i}`);
        seen[id] = i;
      }
    });
    return probs;
  };

  /* ----------------------------------------------- line-ups and clues */
  /**
   * Line-up balance (Who did it 3.2): every value in `used` ([{dim, value}]
   * or dim names, meaning every value of that dim) is shared by at least
   * opts.min (2) items. opts.except: [{dim, value}] exempt (the final clue).
   */
  W.balance = function (items, used, opts) {
    opts = Object.assign({ min: 2, except: [] }, opts || {});
    const probs = [];
    const pairs = [];
    for (const u of used || []) {
      if (typeof u === "string") new Set(items.map((it) => W.val(it, u)).filter((v) => v != null)).forEach((v) => pairs.push({ dim: u, value: v }));
      else pairs.push(u);
    }
    for (const { dim, value } of pairs) {
      if (opts.except.some((e) => e.dim === dim && e.value === value)) continue;
      const n = items.filter((it) => W.val(it, dim) === value).length;
      if (n < opts.min) probs.push(`${dim} ${value} on ${n}, needs ${opts.min}`);
    }
    return { ok: !probs.length, problems: probs };
  };
  /** How many of item's values (over dims) nobody else in items shares. */
  W.distinctive = (item, items, dims) => dims.filter((d) => W.val(item, d) != null && items.filter((o) => o !== item && W.val(o, d) === W.val(item, d)).length === 0).length;
  /** Is item no more distinctive than the line-up's median? (the culprit rule) */
  W.notStandout = function (item, items, dims) {
    const ds = items.map((it) => W.distinctive(it, items, dims)).sort((a, b) => a - b);
    const med = ds[Math.floor((ds.length - 1) / 2)];
    return W.distinctive(item, items, dims) <= med;
  };
  /**
   * A clue is a function(item) -> bool, or {dim, value, not?}, or
   * {fits(item)} (Who did it's clue objects). Returns the items that fit all.
   */
  const fits = (c, it) => (typeof c === "function" ? c(it) : typeof c.fits === "function" ? c.fits(it) : (W.val(it, c.dim) === c.value) !== !!c.not);
  W.consistent = (items, clues) => items.filter((it) => (clues || []).every((c) => fits(c, it)));
  /** Accusing now is a guess if more than one is still consistent (no ear star). */
  W.lucky = (items, clues) => W.consistent(items, clues).length > 1;

  /* ------------------------------------------------------ blind odds */
  function choose(n, k) {
    if (k < 0 || k > n) return 0;
    let r = 1;
    for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
    return r;
  }
  W.choose = choose;
  /**
   * Built-in blind strategies. Each gets (targets, candidates, k, dims) and
   * returns the chance it picks exactly the targets. "The strongest prior
   * per row": blindOdds takes the best of them.
   *  uniform  any k of the candidates
   *  odd      only candidates whose value on some dim is unique among them
   *  common   only candidates with the most common value on some dim
   */
  W.STRATEGIES = {
    uniform(targets, cands, k) {
      return targets.every((t) => cands.includes(t)) ? 1 / choose(cands.length, k) : 0;
    },
    odd(targets, cands, k, dims) {
      let best = 0;
      for (const d of dims) {
        const odd = cands.filter((c) => W.val(c, d) != null && cands.filter((o) => W.val(o, d) === W.val(c, d)).length === 1);
        if (odd.length >= k && targets.every((t) => odd.includes(t))) best = Math.max(best, 1 / choose(odd.length, k));
      }
      return best;
    },
    common(targets, cands, k, dims) {
      let best = 0;
      for (const d of dims) {
        const counts = {};
        cands.forEach((c) => (counts[W.val(c, d)] = (counts[W.val(c, d)] || 0) + 1));
        const top = Math.max(...Object.values(counts));
        const set = cands.filter((c) => counts[W.val(c, d)] === top);
        if (set.length >= k && targets.every((t) => set.includes(t))) best = Math.max(best, 1 / choose(set.length, k));
      }
      return best;
    },
  };

  /**
   * The chance a player who knows no Kutchi gets every row right (the ear
   * star), by the strongest blind prior per row, rows independent.
   * rows: [{noun, attrs, count?, visible?: ["noun", ...], candidates?}]
   *   visible: the parts of the row a non-speaker can read (an English
   *   placeholder word is readable: say so, and the bot reports it apart).
   *   candidates: the items this row could be picked from (default: every
   *   item consistent with the visible parts).
   * opts: {visible: default visible list, dims: dims the strategies look at
   *   (default: every asked dim of every row), strategies: extra
   *   {name: fn(targets, cands, k, dims)}, countKnown: true (the player
   *   knows how many to pick; false multiplies by 1/maxCount)}.
   */
  W.blindOdds = function (rows, items, opts) {
    opts = Object.assign({ visible: [], countKnown: true, maxCount: 5 }, opts || {});
    const strategies = Object.assign({}, W.STRATEGIES, opts.strategies || {});
    const allDims = opts.dims || Array.from(new Set(rows.flatMap((r) => Object.keys(W.asked(r)).concat(r.noun != null ? ["noun"] : []))));
    const out = [];
    let p = 1;
    for (const row of rows) {
      const vis = row.visible || opts.visible;
      const targets = items.filter((it) => W.matches(it, row));
      let cands = row.candidates || items;
      cands = cands.filter((it) =>
        vis.every((d) => {
          if (d === "noun") return row.noun == null || it.noun === row.noun;
          const a = W.asked(row);
          return a[d] == null || W.val(it, d) === a[d];
        }),
      );
      const k = targets.length;
      let best = 0;
      let name = null;
      if (k === 0) best = 0;
      else
        for (const [n, fn] of Object.entries(strategies)) {
          const q = fn(targets, cands, k, allDims);
          if (q > best) {
            best = q;
            name = n;
          }
        }
      if (!opts.countKnown) best /= opts.maxCount;
      out.push({ p: best, strategy: name, candidates: cands.length, targets: k });
      p *= best;
    }
    return { p, rows: out };
  };

  /**
   * The generator loop: make() a round, then while its blind odds are over
   * budget, grow it: addRow(round) and addDecoy(round) (either may be
   * missing; each returns the grown round or null when it can't) are
   * alternated, decoys first. odds(round) -> number (default: blindOdds
   * of round.rows over round.items). Returns {round, p, steps, ok}.
   */
  W.fitBudget = function (make, opts) {
    opts = Object.assign({ budget: 0.05, maxSteps: 20 }, opts || {});
    const odds = opts.odds || ((r) => W.blindOdds(r.rows, r.items, opts.blind).p);
    let round = make();
    let p = odds(round);
    let steps = 0;
    const growers = [opts.addDecoy, opts.addRow].filter(Boolean);
    while (p > opts.budget && steps < opts.maxSteps && growers.length) {
      let next = null;
      for (let i = 0; i < growers.length && !next; i++) next = growers[(steps + i) % growers.length](round);
      steps++;
      if (!next) break;
      round = next;
      p = odds(round);
    }
    return { round, p, steps, ok: p <= opts.budget };
  };

  /** Monte Carlo: the share of `trials` runs where playOnce(i) returns true (a leak bot's win rate). */
  W.estimate = function (trials, playOnce) {
    let wins = 0;
    for (let i = 0; i < trials; i++) if (playOnce(i)) wins++;
    return wins / trials;
  };

  return W;
});
