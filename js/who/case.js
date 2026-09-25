/*
 * Who did it?: the case engine. Generator, solver and grader; pure JS, no
 * DOM, deterministic from a seed. The browser (js/who/flow.js) and the Node
 * leak bot (build/leak_who.mjs) run this same file.
 *
 * A case is { suspects, truth, clues }; the solver gives the set still
 * consistent after each clue. The four kinds (D1) differ only in who says
 * the facts and who acts on them:
 *   K1 one each      one clue per missing thing; tap the one it names
 *   K2 keep who fits clue by clue, commit the exact set who fits; accuse
 *   K3 Nani guesses  Nani asks (askNext), the child answers yes/no
 *   K4 Tell Ali      the child says a word, Ali acts on it (actOn)
 *
 * API
 *   prepare(who, cookWords)            -> P (the data with a word lexicon)
 *   makeCase(P, {game, level, seed, pool, realOnly}) -> case
 *   start(case, {stage})               -> state      (stage(wordId) -> 1..5)
 *   expectation(state)                 -> what the game wants next (tests)
 *   grade(state, action)               -> result     (mutates state)
 *   consistent(case, n)                -> indices still possible after n clues
 *   askNext(state)                     -> Nani's next halving question (K3)
 *   actOn(state, word)                 -> what Ali does with a heard word (K4)
 *   stars(state, P)                    -> { ear, craft, tick, voice, coins }
 *
 * Leak rules this enforces (design 3.2, 12.4): culprit uniform; line-up
 * shuffled; every clued value shared by at least two when it is said
 * (except the last clue, and from L2 even the last is shared in the whole
 * line-up: no single clue names the culprit); every L1-2 clue removes
 * someone; the culprit is no more distinctive than the median; one trace
 * per look-alike group; K1 eaters drawn with replacement (so elimination
 * across items gives nothing); every clue row flagged real/draft; K3
 * rounds always hold a yes and a no.
 */
(function (root, factory) {
  const whichone = typeof module === "object" && module.exports ? require("./stubs/whichone.js") : root.Who.whichone;
  const api = factory(whichone);
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.Who = root.Who || {};
    root.Who.Case = api;
  }
})(typeof self !== "undefined" ? self : this, function (whichone) {
  "use strict";

  /* ------------------------------------------------------------ seeded rng */
  function rng(seed) {
    let a = seed >>> 0 || 1;
    const next = () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
    const pick = (arr) => arr[Math.floor(next() * arr.length)];
    const shuffle = (arr) => {
      const b = arr.slice();
      for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
      }
      return b;
    };
    return { next, int, pick, shuffle };
  }
  const range = (r) => (Array.isArray(r) ? r : [r, r]);

  /* --------------------------------------------------------------- prepare */
  function prepare(who, cookWords) {
    const words = {};
    const own = who.words || {};
    const lookup = (id) => {
      if (words[id]) return words[id];
      const w = (cookWords && cookWords[id]) || own[id] || null;
      const kutchi = w && w.kutchi ? (typeof w.kutchi === "string" ? w.kutchi : w.kutchi.text) : null;
      return (words[id] = { id, kutchi, english: (w && w.english) || id, draft: !!(w && w.draft), real: !!kutchi });
    };
    const byDim = {};
    for (const [key, a] of Object.entries(who.attributes)) {
      if (key.startsWith("_")) continue;
      (byDim[a.dim] = byDim[a.dim] || []).push(Object.assign({ key }, a, { w: lookup(a.word) }));
    }
    const typeOf = {};
    for (const [t, ct] of Object.entries(who.clue_types)) {
      if (t.startsWith("_") || ct.phase) continue;
      for (const d of ct.dims) typeOf[d] = t;
    }
    const people = Object.keys(who.people).filter((k) => !k.startsWith("_"));
    return { who, word: lookup, byDim, typeOf, people };
  }

  // the values a dim may take in this case (realOnly drops placeholder words)
  function valuesFor(P, dim, realOnly) {
    return (P.byDim[dim] || []).filter((a) => !realOnly || a.w.real);
  }
  function attrOf(P, dim, value) {
    return (P.byDim[dim] || []).find((a) => a.value === value);
  }

  function clueFor(P, dim, value) {
    const a = attrOf(P, dim, value);
    const type = P.typeOf[dim];
    const ct = P.who.clue_types[type];
    return { type, dim, value, word: a.word, line: ct.line, real: a.w.real, draft: a.w.draft, examine: !!ct.needs_examine };
  }

  const fits = (s, clue) => s.attrs[clue.dim] === clue.value;

  /* ------------------------------------------------------------ generator */
  function rollSuspect(P, id, r) {
    const p = P.who.people[id];
    const attrs = Object.assign({ kind: p.kind, gender: p.gender }, p.fixed || {});
    for (const [d, opts] of Object.entries(p.variable || {})) attrs[d] = r.pick(opts);
    if (!("wears" in attrs)) attrs.wears = null;
    return { id, attrs };
  }

  // values for a dealt dim (holds, trace): k distinct ones, one per look-alike group
  function dealValues(P, dim, k, r, realOnly) {
    const out = [];
    const groups = new Set();
    for (const a of r.shuffle(valuesFor(P, dim, realOnly))) {
      if (a.group && groups.has(a.group)) continue;
      out.push(a.value);
      if (a.group) groups.add(a.group);
      if (out.length === k) break;
    }
    return out.length === k ? out : null;
  }

  const DEALT = ["holds", "trace"];

  function lineup(P, lv, r, opts) {
    const [lo, hi] = range(lv.suspects);
    let n = r.int(lo, hi);
    const pool = opts.pool || P.people;
    if (n > pool.length) n = pool.length;
    const ids = r.shuffle(pool).slice(0, n);
    return ids.map((id) => rollSuspect(P, id, r));
  }

  // every value of a dealt dim sits on at least two suspects (so it can be clued)
  function dealShared(P, suspects, dim, r, realOnly) {
    const n = suspects.length;
    const k = n >= 5 ? r.int(2, 3) : 2;
    const vals = dealValues(P, dim, k, r, realOnly);
    if (!vals) return false;
    const bag = vals.concat(vals); // two of each first
    while (bag.length < n) bag.push(r.pick(vals));
    const dealt = r.shuffle(bag).slice(0, n);
    suspects.forEach((s, i) => (s.attrs[dim] = dealt[i]));
    return true;
  }

  // a word means one thing in a line-up: tameto in a hand and tameto on the
  // paws would make "tameto" ambiguous (and Ali couldn't act on it)
  function wordsClash(P, suspects, dims) {
    const seen = {};
    for (const d of dims)
      for (const s of suspects) {
        const v = s.attrs[d];
        if (v == null) continue;
        const a = attrOf(P, d, v);
        if (!a) continue;
        if (seen[a.word] && seen[a.word] !== d) return true;
        seen[a.word] = d;
      }
    return false;
  }

  function dimsInPlay(P, lv, realOnly) {
    return lv.dims.filter((d) => valuesFor(P, d, realOnly).length > 0);
  }

  // distinctiveness over what can be seen or clued (plus kind: the odd cat out)
  function balanceOK(suspects, dims, culprit) {
    const b = whichone.balance(suspects, dims.concat(["kind"]));
    return b.distinct[culprit] <= b.median;
  }

  function makeK1(P, lv, r, opts, dims) {
    const suspects = lineup(P, lv, r, opts);
    const dim = dims[0];
    const vals = dealValues(P, dim, suspects.length, r, opts.realOnly);
    if (!vals) return null;
    suspects.forEach((s, i) => (s.attrs[dim] = vals[i]));
    const items = [];
    for (let k = 0; k < lv.items; k++) {
      const eater = r.int(0, suspects.length - 1); // with replacement: no elimination across items
      items.push({ eater, clue: clueFor(P, dim, suspects[eater].attrs[dim]) });
    }
    return { suspects, items, dims: [dim] };
  }

  // all ordered clue chains of length len from the culprit's values that pass the rules
  function chains(P, suspects, culprit, dims, len, lv) {
    const cands = dims.filter((d) => suspects[culprit].attrs[d] != null).map((d) => clueFor(P, d, suspects[culprit].attrs[d]));
    const out = [];
    const all = suspects.map((_, i) => i);
    const strict = lv.single_clue_solves === false;
    const walk = (chain, standing, used) => {
      if (chain.length === len) {
        if (standing.length === 1 && (!lv.must || chain.some((c) => c.dim === lv.must))) out.push(chain.slice());
        return;
      }
      const last = chain.length === len - 1;
      for (let k = 0; k < cands.length; k++) {
        if (used & (1 << k)) continue;
        const cl = cands[k];
        const next = standing.filter((i) => fits(suspects[i], cl));
        if (next.length === standing.length) continue; // every clue removes someone
        if (!last && next.length < 2) continue; // nothing solved early
        if (strict && all.filter((i) => fits(suspects[i], cl)).length < 2) continue; // no single clue names the culprit
        if (!strict && !last && next.length < 2) continue;
        chain.push(cl);
        walk(chain, next, used | (1 << k));
        chain.pop();
      }
    };
    walk([], all, 0);
    return out;
  }

  function makeK2(P, lv, r, opts, dims) {
    const suspects = lineup(P, lv, r, opts);
    for (const d of DEALT) if (dims.includes(d) && !dealShared(P, suspects, d, r, opts.realOnly)) return null;
    if (wordsClash(P, suspects, dims)) return null;
    const culprit = r.int(0, suspects.length - 1);
    if (!balanceOK(suspects, dims, culprit)) return null;
    const [lo, hi] = range(lv.clues);
    const len = r.int(lo, Math.min(hi, dims.length));
    const found = chains(P, suspects, culprit, dims, len, lv);
    if (!found.length) return null;
    return { suspects, culprit, clues: r.pick(found), dims };
  }

  // the fewest words that leave only the culprit (K4 craft par)
  function minWords(suspects, culprit, choices) {
    const own = choices.filter((c) => suspects[culprit].attrs[c.dim] === c.value);
    for (let size = 1; size <= own.length; size++) {
      const combos = [];
      const rec = (start, acc) => {
        if (acc.length === size) return combos.push(acc.slice());
        for (let k = start; k < own.length; k++) rec(k + 1, acc.concat([own[k]]));
      };
      rec(0, []);
      for (const combo of combos) {
        const left = suspects.filter((s) => combo.every((c) => s.attrs[c.dim] === c.value));
        if (left.length === 1) return size;
      }
    }
    return Infinity;
  }

  function makeK4(P, lv, r, opts, dims) {
    const suspects = lineup(P, lv, r, opts);
    for (const d of DEALT) if (dims.includes(d) && !dealShared(P, suspects, d, r, opts.realOnly)) return null;
    if (wordsClash(P, suspects, dims)) return null;
    const culprit = r.int(0, suspects.length - 1);
    if (!balanceOK(suspects, dims, culprit)) return null;
    const seen = new Set();
    const choices = [];
    for (const d of dims)
      for (const s of suspects) {
        const v = s.attrs[d];
        if (v == null || seen.has(`${d}.${v}`)) continue;
        seen.add(`${d}.${v}`);
        choices.push(Object.assign(clueFor(P, d, v), { dim: d, value: v }));
      }
    const [wlo, whi] = range(lv.words || [3, 6]);
    if (choices.length < wlo || choices.length > whi) return null;
    const need = minWords(suspects, culprit, choices);
    if (!isFinite(need) || need < (lv.min_words || 1)) return null;
    return { suspects, culprit, choices: r.shuffle(choices), minWords: need, dims };
  }

  function makeK3(P, lv, r, opts, dims) {
    const suspects = lineup(P, lv, r, opts);
    for (const d of DEALT) if (dims.includes(d) && !dealShared(P, suspects, d, r, opts.realOnly)) return null;
    if (wordsClash(P, suspects, dims)) return null;
    const culprit = r.int(0, suspects.length - 1); // the dealt card
    if (!balanceOK(suspects, dims, culprit)) return null;
    const st = { c: { suspects, dims, kind: "K3" }, cands: suspects.map((_, i) => i), r, halve: lv.nani === "halve" };
    const questions = [];
    for (let q = 0; q < range(lv.questions)[1]; q++) {
      const ask = askNext(st);
      if (!ask) break;
      const yes = fits(suspects[culprit], ask);
      questions.push(Object.assign(clueFor(P, ask.dim, ask.value), { answer: yes }));
      st.cands = st.cands.filter((i) => fits(suspects[i], ask) === yes);
    }
    const [qlo] = range(lv.questions);
    if (questions.length < qlo || st.cands.length !== 1) return null;
    if (!questions.some((q) => q.answer) || !questions.some((q) => !q.answer)) return null; // always-yes never wins
    return { suspects, culprit, questions, dims };
  }

  function makeCase(P, opts) {
    opts = Object.assign({ level: 1, seed: 1, realOnly: true }, opts);
    const g = P.who.games[opts.game];
    if (!g) throw new Error(`no game ${opts.game}`);
    const lv = g.levels[Math.min(opts.level, g.levels.length) - 1];
    const kind = lv.kind || g.kind;
    const dims = dimsInPlay(P, lv, opts.realOnly);
    const r = rng(opts.seed);
    const make = { K1: makeK1, K2: makeK2, K3: makeK3, K4: makeK4 }[kind];
    for (let attempt = 0; attempt < 5000; attempt++) {
      const c = make(P, lv, r, opts, dims);
      if (!c) continue;
      c.suspects.forEach((s, i) => (s.slot = i));
      return Object.assign(c, {
        game: opts.game,
        level: opts.level,
        kind,
        seed: opts.seed,
        realOnly: opts.realOnly,
        examine: !!lv.examine,
        listener: g.listener || null,
        truth: c.culprit != null ? c.culprit : null,
      });
    }
    throw new Error(`could not build a case for ${opts.game} L${opts.level} seed ${opts.seed}`);
  }

  /* --------------------------------------------------------------- solver */
  function consistent(c, n) {
    let standing = c.suspects.map((_, i) => i);
    for (const cl of c.clues.slice(0, n)) standing = standing.filter((i) => fits(c.suspects[i], cl));
    return standing;
  }

  // K3: Nani's next question. She asks anything that splits her candidates
  // (a grandmother thinking aloud); with halve (G6, the player's craft) only
  // the questions that best halve them
  function askNext(st) {
    const { suspects, dims } = st.c;
    if (st.cands.length <= 1) return null;
    let best = [];
    let bestScore = Infinity;
    for (const d of dims) {
      const vals = new Set(st.cands.map((i) => suspects[i].attrs[d]).filter((v) => v != null));
      for (const v of vals) {
        const yes = st.cands.filter((i) => suspects[i].attrs[d] === v).length;
        const no = st.cands.length - yes;
        if (!yes || !no) continue;
        const score = st.halve ? Math.abs(yes - no) : 0;
        if (score < bestScore) (best = [[d, v]]), (bestScore = score);
        else if (score === bestScore) best.push([d, v]);
      }
    }
    if (!best.length) return null;
    const [d, v] = st.r ? st.r.pick(best) : best[0];
    return { dim: d, value: v, type: "ask" };
  }

  // K4: Ali hears a word and sits down everyone standing who doesn't fit it
  function actOn(st, word) {
    const c = st.c;
    const ch = c.choices.find((x) => x.word === word);
    if (!ch) return { heard: null };
    const sat = st.standing.filter((i) => !fits(c.suspects[i], ch));
    const standing = st.standing.filter((i) => fits(c.suspects[i], ch));
    return { heard: ch, sat, standing, empty: standing.length === 0, point: standing.length === 1 ? standing[0] : null };
  }

  /* ---------------------------------------------------------------- state */
  function start(c, opts) {
    opts = opts || {};
    const stage = opts.stage || (() => 2);
    const rows = (c.kind === "K1" ? c.items.map((it) => it.clue) : c.clues || []).map((cl) => ({
      clue: cl,
      taught: stage(cl.word) <= 1, // stage-1 words glow: taught, not tested
      misses: 0,
      firstTry: null,
      earLost: false,
      ms: null,
    }));
    return {
      c,
      i: 0,
      standing: c.suspects.map((_, i) => i),
      rows,
      phase: c.kind === "K4" ? "say" : c.kind === "K3" ? "answer" : c.kind === "K1" ? "pick" : "commit",
      accused: null,
      lucky: false,
      wrongAccuse: 0,
      tick: true,
      replays: 0,
      words: [],
      resets: 0,
      cands: c.suspects.map((_, i) => i),
      answers: [],
      done: false,
    };
  }

  function expectation(st) {
    const c = st.c;
    if (st.done) return { action: "none" };
    if (st.phase === "pick") return { action: "pick", answer: c.items[st.i].eater, clue: c.items[st.i].clue, item: st.i };
    if (st.phase === "commit") {
      const cl = c.clues[st.i];
      return { action: "commit", answer: st.standing.filter((i) => fits(c.suspects[i], cl)), clue: cl, row: st.i };
    }
    if (st.phase === "accuse") return { action: "accuse", answer: c.culprit };
    if (st.phase === "say") {
      const left = c.choices.filter((ch) => fits(c.suspects[c.culprit], ch) && st.standing.some((i) => !fits(c.suspects[i], ch)));
      return { action: "say", answer: left.map((ch) => ch.word), culprit: c.culprit };
    }
    if (st.phase === "answer") {
      const q = c.questions[st.answers.length];
      return { action: "answer", answer: q ? q.answer : null, question: q };
    }
    return { action: "none" };
  }

  const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

  function miss(row) {
    row.misses++;
    if (row.firstTry === null) row.firstTry = false;
    row.earLost = true;
  }
  function hit(row, ms) {
    if (row.firstTry === null) row.firstTry = true;
    if (row.ms === null) row.ms = ms == null ? null : ms;
  }

  function grade(st, a) {
    const c = st.c;
    if (st.done) return { ok: false, why: "done" };
    if (a.type === "help") return help(st, a);

    if (a.type === "pick" && st.phase === "pick") {
      const it = c.items[st.i];
      const row = st.rows[st.i];
      if (a.index !== it.eater) {
        miss(row);
        return { ok: false, recast: { who: a.index, fact: c.suspects[a.index].attrs[it.clue.dim] }, shown: row.misses >= 2 ? [it.eater] : null };
      }
      hit(row, a.ms);
      st.i++;
      if (st.i >= c.items.length) st.done = true;
      return { ok: true, caught: it.eater, done: st.done };
    }

    if (a.type === "commit" && st.phase === "commit") {
      const cl = c.clues[st.i];
      const row = st.rows[st.i];
      const want = st.standing.filter((i) => fits(c.suspects[i], cl));
      const picks = (a.picks || []).filter((i) => st.standing.includes(i));
      if (!sameSet(picks, want)) {
        miss(row);
        const wrongIn = picks.find((i) => !want.includes(i));
        const wrongOut = want.find((i) => !picks.includes(i));
        const who = wrongIn != null ? wrongIn : wrongOut;
        return { ok: false, recast: { who, fits: want.includes(who), fact: c.suspects[who].attrs[cl.dim] }, shown: row.misses >= 2 ? want : null };
      }
      hit(row, a.ms);
      const sat = st.standing.filter((i) => !want.includes(i));
      st.standing = want;
      st.i++;
      if (st.i >= c.clues.length) st.phase = "accuse";
      return { ok: true, sat, standing: want.slice(), next: st.phase };
    }

    if (a.type === "accuse" && (st.phase === "accuse" || st.phase === "commit")) {
      const cons = st.phase === "accuse" ? st.standing : consistent(c, st.i);
      if (cons.length > 1) st.lucky = true; // a lucky guess never earns the ear
      if (a.index !== c.culprit) {
        st.wrongAccuse++;
        return { ok: false, notMe: a.index, fact: null };
      }
      st.accused = a.index;
      st.phase = "done";
      st.done = true;
      return { ok: true, caught: a.index, lucky: st.lucky, done: true };
    }

    if (a.type === "say" && st.phase === "say") {
      const res = actOn(st, a.word);
      if (!res.heard) return { ok: false, why: "not in the set" };
      st.words.push({ word: a.word, via: a.via || "pill", removed: res.sat.length });
      st.standing = res.standing;
      if (res.point != null) {
        if (res.point === c.culprit) {
          st.done = true;
          st.phase = "done";
          return Object.assign(res, { ok: true, done: true });
        }
        st.phase = "reset";
        return Object.assign(res, { ok: false, wrongPoint: res.point });
      }
      if (res.empty) {
        st.phase = "reset";
        return Object.assign(res, { ok: false });
      }
      return Object.assign(res, { ok: true });
    }
    if (a.type === "reset" && st.phase === "reset") {
      st.resets++;
      st.standing = c.suspects.map((_, i) => i);
      st.phase = "say";
      return { ok: true };
    }

    if (a.type === "answer" && st.phase === "answer") {
      const q = c.questions[st.answers.length];
      const right = !!a.yes === q.answer;
      st.answers.push({ yes: !!a.yes, right, via: a.via || "tap" });
      st.cands = st.cands.filter((i) => fits(c.suspects[i], q) === !!a.yes);
      if (st.answers.length >= c.questions.length) {
        st.done = true;
        st.phase = "done";
        return { ok: right, guess: st.cands.length === 1 ? st.cands[0] : null, done: true };
      }
      return { ok: right };
    }
    return { ok: false, why: `unexpected ${a.type} in ${st.phase}` };
  }

  // hint ladder (design 6.2): 1 replay (free once), 2 slow replay, 3 describe a
  // suspect (free at stage 1-2), 4 reveal, 5 translate, 6 shown
  function help(st, a) {
    const row = st.rows[st.i];
    const rung = a.rung;
    if (rung === 1) {
      st.replays++;
      if (st.replays > 1) st.tick = false;
    } else if (rung === 3) {
      if ((a.stage || 2) >= 3) {
        st.tick = false;
        if (row && a.dim === row.clue.dim) row.earLost = true;
      }
    } else {
      st.tick = false;
      if (rung >= 4 && row) row.earLost = true;
    }
    return { ok: true, rung };
  }

  /* ---------------------------------------------------------------- stars */
  function stars(st, P, opts) {
    opts = opts || {};
    const c = st.c;
    const rules = (P.who.star_set && P.who.star_set.rules) || { minTested: 2 };
    const coinsT = P.who.coins || {};
    const out = { ear: null, craft: false, tick: st.tick, voice: null, coins: coinsT.helping || 5, tested: 0 };
    if (c.kind === "K4") {
      out.ear = "untested"; // D9.2: Tell Ali earns voice + craft, never the ear
      const voiced = st.words.length > 0 && st.words.every((w) => w.via === "voice" || w.via === "parent");
      out.voice = st.done && st.resets === 0 && voiced;
      out.craft = st.done && st.resets === 0 && st.words.every((w) => w.removed > 0) && st.words.length <= c.minWords;
    } else {
      const tested = st.rows.filter((r) => r.clue.real && !r.taught);
      out.tested = tested.length;
      if (tested.length < rules.minTested) out.ear = "untested";
      else {
        const allRight = tested.every((r) => r.firstTry && !r.earLost);
        const accuseOK = c.kind === "K1" || c.kind === "K3" || (!st.lucky && st.wrongAccuse === 0);
        out.ear = allRight && accuseOK;
      }
      const par = opts.parMs || null;
      out.craft = !!par && st.rows.every((r) => r.firstTry && r.ms != null && r.ms <= par);
    }
    if (out.ear === true) out.coins += coinsT.ear || 0;
    if (out.craft) out.coins += coinsT.craft || 0;
    if (out.tick) out.coins += coinsT.tick || 0;
    if (out.voice) out.coins += coinsT.voice || 0;
    return out;
  }

  return { rng, prepare, wordsClash, makeCase, start, expectation, grade, consistent, askNext, actOn, stars, fits, valuesFor, attrOf, minWords };
});
