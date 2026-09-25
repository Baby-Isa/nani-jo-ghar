/*
 * Monsoon rush: the call engine. Pure logic, no DOM: the same file runs in
 * the browser (Monsoon.Calls) and in Node (build/leak_monsoon.mjs).
 * Design: docs/modes/monsoon-rush-design.md, the deep dive (D.1–D.5) and
 * sections 8.1–8.5; build brief task 1.
 *
 *   Calls.storm(game, level, opts)   -> a storm: its candidates and planned waves
 *   Calls.session(storm)             -> next() / record() / results, with retries
 *   Calls.timing(wave, t0, storm)    -> keyEnd, each target's reveal and land
 *   Calls.grade(wave, timing, answers, storm) -> one outcome per target
 *   Calls.stars(session)             -> ear, hand (umbrella), busy/relaxed, voice
 *   Calls.progress(session)          -> word-progress updates, with the Busy stage rule
 *   Calls.check(storm)               -> the section 8.1 constraints (tests)
 *
 * Kinds of round (D.1): "which" (K1: G1 kitchen leak, G6 cats), "count"
 * (K2: G2 drip count), "weather" (K3: G4 forecast, go / no-go), "say"
 * (K5: G3 you call it; the child is the caller, graded for the voice star).
 *
 * Rules this file enforces (the anti-spam spine, section 8.1):
 *  - only answers before a target's reveal count for the ear; after it a
 *    dive can still save the drop (craft) but it's `late`;
 *  - each target takes ONE answer; an answer that matches no target counts
 *    as `wrong` for the oldest unanswered target; extra taps are ignored
 *    (the hand holds one lid per target called);
 *  - nothing can be answered before its call starts (no camping);
 *  - stage-1 words are `taught` (the target twinkles), retries after a
 *    miss are `retry`, English-menu words are never called as targets:
 *    none of the three counts for the ear;
 *  - targets are uniform over the storm's words (a shuffled bag), never the
 *    same target twice running except a scheduled retry, and candidate
 *    positions shuffle every storm (no spatial pattern carries over).
 *
 * Code never contains Kutchi: every spoken part names a line key from
 * data/cook.json `lines` (or grammar.number) and a word id. The words come
 * from cook.json `words` plus data/monsoon.json `words` (placeholders).
 */
(function (root, factory) {
  const Calls = factory();
  if (typeof module === "object" && module.exports) module.exports = Calls;
  else {
    root.Monsoon = root.Monsoon || {};
    root.Monsoon.Calls = Calls;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const Calls = {};

  /* ------------------------------------------------------------ helpers */
  /** A small seedable RNG (mulberry32), so a storm can be replayed exactly. */
  function rng(seed) {
    // scramble the seed first (splitmix32), so storms 1, 2, 3... don't start alike
    let a = (seed >>> 0) ^ 0x9e3779b9;
    a = Math.imul(a ^ (a >>> 16), 0x85ebca6b);
    a = Math.imul(a ^ (a >>> 13), 0xc2b2ae35);
    a = (a ^ (a >>> 16)) >>> 0;
    const r = function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.pick = (arr) => arr[Math.floor(r() * arr.length)];
    r.shuffle = (arr) => {
      const a2 = arr.slice();
      for (let i = a2.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [a2[i], a2[j]] = [a2[j], a2[i]];
      }
      return a2;
    };
    r.weighted = (obj) => {
      const ks = Object.keys(obj).filter((k) => obj[k] > 0);
      const tot = ks.reduce((s, k) => s + obj[k], 0);
      let x = r() * tot;
      for (const k of ks) {
        x -= obj[k];
        if (x < 0) return k;
      }
      return ks[ks.length - 1];
    };
    return r;
  }
  Calls.rng = rng;

  /** Level settings: level 1 is complete; each later level lists only what changes (Cook's rule). */
  function levelCfg(game, level) {
    const ls = game.levels || [{}];
    const out = {};
    for (let i = 0; i < Math.min(level, ls.length); i++) Object.assign(out, ls[i]);
    return out;
  }
  Calls.levelCfg = levelCfg;

  const median = (xs) => {
    if (!xs.length) return null;
    const s = xs.slice().sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  Calls.median = median;

  /** Word stages 1–4 as the design uses them (Progress's 5 folds into 4). */
  const stageOf = (opts, id) => {
    const s = opts.stage ? opts.stage(id) : 3;
    return Math.max(1, Math.min(4, s || 1));
  };

  const norm = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFC")
      .replace(/[^\p{L}\p{M}\p{N} ]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  Calls.norm = norm;

  /* ------------------------------------------------------ words and text */
  /**
   * A spoken part: {line: key, x: wordId | number} or {num: n} or {word: id};
   * `key: true` marks the part whose end is the call's keyEnd.
   * Returns {k, en, lang: "k" | "e", words: [ids]}. k is null for a
   * placeholder (an English grey-italic line, never invented Kutchi).
   */
  Calls.text = function (part, L) {
    const words = L.words || {};
    const numId = (n) => ((L.grammar || {}).numbers || {})[n] || `num-0${n}`;
    let xId = part.x;
    if (typeof xId === "number") xId = numId(xId);
    if (part.num != null) xId = numId(part.num);
    if (part.word) xId = part.word;
    const w = xId ? words[xId] || {} : null;
    const xk = w ? w.kutchi || null : null;
    const xe = w ? w.english || xId : "";
    let tmpl;
    if (part.line === "#number" || part.num != null || part.word) tmpl = { k: (L.grammar || {}).number || "{x}!", en: "{x}!" };
    else tmpl = (L.lines || {})[part.line] || { e: part.line };
    const kT = tmpl.k || null;
    const eT = tmpl.en || tmpl.e || "{x}";
    const k = kT && (!w || xk) ? kT.replace("{x}", xk || "") : null;
    const en = eT.replace("{x}", xe);
    return { k, en, lang: k ? "k" : "e", words: xId ? [xId] : [], draft: !!(tmpl.draft || (w && w.draft)) };
  };

  /**
   * How long a part takes to say, and where its key word ends, from the
   * audio sidecar (data/monsoon-audio.json: clips keyed by the normalised
   * line text, each {dur, keyAt}). A line with no clip of its own is timed
   * as its words' clips in turn (how Cook's Lang.speak plays it); a word
   * with no clip at all is estimated from its length and flagged.
   */
  Calls.partTime = function (part, L) {
    const t = Calls.text(part, L);
    const clips = (L.audio && L.audio.clips) || {};
    const gap = (L.audio && L.audio.tokenGap) || 0.08;
    const key = t.k ? norm(t.k) : "en|" + norm(t.en);
    const c = clips[key];
    if (c) return { dur: c.dur, keyAt: c.keyAt != null ? c.keyAt : c.dur, clip: key, est: false };
    let dur = 0;
    let est = false;
    const toks = (t.k ? norm(t.k) : norm(t.en)).split(" ").filter(Boolean);
    toks.forEach((tok, i) => {
      const cc = clips[(t.k ? "" : "en|") + tok];
      if (cc) dur += cc.dur;
      else {
        dur += 0.25 + 0.07 * tok.length;
        est = true;
      }
      if (i) dur += gap;
    });
    return { dur, keyAt: dur, clip: key, est };
  };

  /* ------------------------------------------------------------ storms */
  /**
   * Build a storm. opts: {data (monsoon.json), cook (cook.json), audio
   * (monsoon-audio.json), scene (the sidecar: slots), stage(id) -> 1..4,
   * mode: "busy" | "drizzle", seed, stage1: true (allow new words),
   * bpm (override), twists: [...] (override frames)}.
   */
  Calls.storm = function (gameId, level, opts) {
    const D = opts.data;
    const game = D.games[gameId];
    if (!game) throw new Error(`no game ${gameId}`);
    const cfg = Object.assign({}, levelCfg(game, level));
    if (opts.bpm) cfg.bpm = opts.bpm;
    if (opts.frames) cfg.frames = opts.frames;
    const seed = opts.seed != null ? opts.seed : Math.floor(Math.random() * 2 ** 31);
    const R = rng(seed);
    const words = Object.assign({}, (opts.cook && opts.cook.words) || {}, D.words || {});
    const L = { words, lines: (opts.cook && opts.cook.lines) || {}, grammar: (opts.cook && opts.cook.grammar) || {}, audio: opts.audio || {} };
    const menu = new Set(D.menu_words || []);
    const maxNew = opts.stage1 === false ? 0 : D.maxNewPerStorm != null ? D.maxNewPerStorm : 3;
    const stage = {};
    const st = (id) => (stage[id] = stage[id] || stageOf(opts, id));

    const storm = {
      game: gameId,
      kind: game.kind,
      level,
      cfg,
      mode: opts.mode || "busy",
      seed,
      L,
      stage,
      minTested: game.minTested || D.minTested || 6,
      rules: {
        earPass: D.earPass != null ? D.earPass : 0.8,
        craftPass: D.craftPass != null ? D.craftPass : 0.85,
        voicePass: D.voicePass != null ? D.voicePass : 0.8,
        voiceMin: D.voiceMin || 4,
        par: D.par || { lightning: [2, 1.6, 1.2], newWordExtra: 0.5 },
        stageRule: D.stageRule || { busyLate: 0, busyWrong: 0.5, maxStagePerStorm: 1 },
        retry: D.retry || { after: [2, 4], max: 3 },
        drizzle: D.drizzle || { repeatAfter: 8, giveUpAfter: 45 },
      },
      candidates: [],
      waves: [],
      newWords: [],
      placeholder: false,
    };

    // ---- candidates: whole look-alike groups (no odd one out), or the level's own list
    let candWords = [];
    if (cfg.groups) cfg.groups.forEach((g) => candWords.push(...g));
    else if (cfg.candidates) candWords = cfg.candidates.slice();
    if (cfg.pick) candWords = R.shuffle(candWords).slice(0, R.int(cfg.pick[0], cfg.pick[1]));
    const slots = (opts.scene && opts.scene.slots) || candWords.map((_, i) => ({ id: `s${i + 1}` }));
    // positions shuffle every storm, so a place never means a word
    const slotOrder = R.shuffle(slots.map((s, i) => i)).slice(0, candWords.length);
    const fills = (opts.scene && opts.scene.fills) || {};
    storm.candidates = candWords.map((w, i) => ({ id: w, word: w, slot: slotOrder[i], feat: fills[w] || (words[w] || {}).heap || null }));
    storm.slots = slots;

    // ---- the pool of words that can be called (targets): never a menu word
    const callable = (cfg.targetsFrom || candWords).filter((w) => !menu.has(w));
    // at most maxNew stage-1 words; the rest must already be met (stage >= 2)
    const known = callable.filter((w) => st(w) >= 2);
    const fresh = callable.filter((w) => st(w) < 2);
    const pool = known.concat(R.shuffle(fresh).slice(0, maxNew));
    storm.pool = pool;
    storm.newWords = pool.filter((w) => st(w) < 2);
    if (!pool.length && game.kind !== "count") throw new Error(`${gameId}: nothing to call`);

    // ---- numbers (K2): the counts that can be called
    const numbers = [];
    if (cfg.numbers) {
      for (let n = cfg.numbers[0]; n <= cfg.numbers[1]; n++) numbers.push(n);
    }
    const numId = (n) => (L.grammar.numbers || {})[n] || `num-0${n}`;
    const numKnown = numbers.filter((n) => st(numId(n)) >= 2);
    const numFresh = numbers.filter((n) => st(numId(n)) < 2);
    let newLeft = Math.max(0, maxNew - storm.newWords.length);
    const numPool = numKnown.concat(R.shuffle(numFresh).slice(0, newLeft));
    storm.numPool = numPool;
    numPool.forEach((n) => st(numId(n)) < 2 && storm.newWords.push(numId(n)));

    // a shuffled bag keeps targets uniform across the storm (and 1,000 storms)
    const bag = (items) => {
      let b = [];
      let last = null;
      return {
        draw(avoid) {
          if (!b.length) b = R.shuffle(items);
          let i = b.findIndex((x) => x !== last && !(avoid || []).includes(x));
          if (i < 0) i = b.findIndex((x) => !(avoid || []).includes(x));
          if (i < 0) i = 0;
          const x = b.splice(i, 1)[0];
          last = x;
          return x;
        },
      };
    };
    const wordBag = bag(pool);
    const numBag = bag(numPool.length ? numPool : numbers);

    const target = (id, w, extra) => {
      const s = st(w);
      return Object.assign({ id, word: w, cand: w, stage: s, slots: { noun: w }, taught: s < 2, placeholder: !(words[w] || {}).kutchi }, extra || {});
    };

    const nWaves = cfg.waves || 8;
    let bpm = cfg.bpm || 60;
    let lastTargets = [];
    for (let i = 0; i < nWaves; i++) {
      if (i && cfg.speedUpEvery && i % cfg.speedUpEvery === 0) bpm += cfg.speedUp || 0;
      const frame = cfg.frames ? R.weighted(cfg.frames) : "single";
      const w = { i, frame, bpm, retry: false, targets: [], say: [] };
      if (game.kind === "which" || game.kind === "say") {
        const nT = frame === "double" || frame === "sequence" ? 2 : 1;
        if (pool.length < nT) throw new Error(`${gameId}: pool too small for ${frame}`);
        const a = wordBag.draw(lastTargets);
        const ids = [a];
        if (nT === 2) ids.push(wordBag.draw([a].concat(lastTargets)));
        w.targets = ids.map((x, j) => target(`t${j + 1}`, x));
        if (frame === "switch") {
          // "{x}! Nar {x}. {y}!": the first word is a lure, the second the target
          const lure = R.pick(pool.filter((x) => x !== a));
          w.lure = lure;
          w.say = [{ line: "hey" }, { line: "#number", x: lure }, { line: cfg.switchLine || "no", x: lure }, { line: "#number", x: a, key: true }];
          w.targets[0].slots.switch = cfg.switchWord || "ph-no";
        } else if (frame === "double") {
          w.say = [{ line: "hey" }, { line: "#number", x: ids[0] }, { line: "and", x: ids[1], key: true }];
        } else if (frame === "sequence") {
          w.say = [{ line: "hey" }, { line: "#number", x: ids[0] }, { line: "then", x: ids[1], key: true }];
          w.targets[1].after = 1; // its reveal comes revealGapBeats after the first
        } else {
          w.say = [{ line: "hey" }, { line: "#number", x: a, key: true }];
        }
        if (game.kind === "say") w.say = []; // the child is the caller: Nani is silent
      } else if (game.kind === "count") {
        const nT = frame === "double" && cfg.named ? 2 : 1;
        const pots = cfg.named ? [wordBag.draw(lastTargets)] : [storm.candidates[0].word];
        if (nT === 2) pots.push(wordBag.draw(pots.concat(lastTargets)));
        w.targets = pots.map((p, j) => {
          const n = numBag.draw();
          const t = target(`t${j + 1}`, p, { n });
          t.slots = cfg.named ? { noun: p, number: numId(n) } : { number: numId(n) };
          t.stage = Math.min(...Object.values(t.slots).map(st));
          t.taught = t.stage < 2;
          t.placeholder = Object.values(t.slots).some((x) => !(words[x] || {}).kutchi);
          return t;
        });
        w.say = [];
        w.targets.forEach((t, j) => {
          if (cfg.named) w.say.push(j === 0 ? { line: "hey" } : null, j === 0 ? { line: "#number", x: t.word } : { line: "and", x: t.word });
          w.say.push({ line: "#number", x: t.n, key: j === w.targets.length - 1 });
        });
        w.say = w.say.filter(Boolean);
      } else if (game.kind === "weather") {
        // K3: the weather word picks the gesture; from L2 a redundant call is a no-go
        w.state = null; // filled in play order (it depends on the previous wave)
        const a = wordBag.draw([]);
        w.targets = [target("t1", a)];
        w.say = [{ line: "#number", x: a, key: true }];
      }
      lastTargets = w.targets.map((t) => t.word);
      storm.waves.push(w);
    }

    // K3's tarp state runs through the storm: at L1 rain only comes when the
    // tarp is off and sun when it's on (no no-go yet); from L2 the weather
    // is drawn regardless of state, so a redundant call is a no-go.
    if (game.kind === "weather") {
      const G = cfg.gestures || {};
      let on = R() < 0.5;
      storm.initialTarp = on;
      storm.waves.forEach((w) => {
        const t = w.targets[0];
        const g = G[t.word] || { go: "none" };
        if (!cfg.nogo && g.needs != null && g.needs !== on) {
          // level 1: swap to a weather that can happen now (uniform among them)
          const ok = pool.filter((x) => (G[x] || {}).needs == null || (G[x] || {}).needs === on);
          const nw = R.pick(ok);
          Object.assign(t, target("t1", nw));
          w.say = [{ line: "#number", x: nw, key: true }];
        }
        const gg = G[t.word] || {};
        w.state = on;
        t.gesture = gg.needs != null && gg.needs !== on ? "none" : gg.go;
        t.nogo = t.gesture === "none";
        if (gg.sets != null && !t.nogo) on = gg.sets;
      });
    }

    storm.placeholder = storm.waves.some((w) => w.targets.some((t) => t.placeholder));
    storm.L = L;
    return storm;
  };

  /* ------------------------------------------------------------ timing */
  /**
   * When a wave's call is said starting at t0: each part's start, keyEnd
   * (the key word's real end, from the sidecar), and each target's reveal
   * (keyEnd + window beats, + beats for new words) and land (reveal + fall).
   * In Drizzle the reveal waits for the answer: reveal is Infinity here and
   * the host sets it when the child answers (or gives up).
   */
  Calls.timing = function (wave, t0, storm) {
    const cfg = storm.cfg;
    const beat = 60 / (wave.bpm || cfg.bpm || 60);
    const gap = cfg.partGap != null ? cfg.partGap : 0.15;
    let t = t0;
    let keyEnd = t0;
    const parts = wave.say.map((p) => {
      const pt = Calls.partTime(p, storm.L);
      const out = Object.assign({ at: t }, pt, { part: p });
      if (p.key) keyEnd = t + pt.keyAt;
      t += pt.dur + gap;
      return out;
    });
    if (!wave.say.length) keyEnd = t0;
    const sayEnd = wave.say.length ? t - gap : t0;
    if (!wave.say.some((p) => p.key)) keyEnd = sayEnd;
    const extraFor = (tg) => (tg.stage <= 1 ? cfg.newWordBeats || 2 : tg.stage === 2 ? cfg.learningBeats || 1 : 0);
    const drizzle = storm.mode === "drizzle";
    const reveal = {};
    const land = {};
    let base = keyEnd + ((cfg.windowBeats || 4) + Math.max(0, ...wave.targets.map(extraFor))) * beat;
    wave.targets.forEach((tg) => {
      const r = base + (tg.after ? (cfg.revealGapBeats || 1) * beat * tg.after : 0);
      reveal[tg.id] = drizzle && storm.kind !== "count" ? Infinity : r;
      land[tg.id] = reveal[tg.id] + (cfg.fall || 0.6);
    });
    const out = { t0, beat, parts, sayEnd, keyEnd, reveal, land };
    if (storm.kind === "count") {
      // K2: drops fall into the open pot(s) on the beat from a beat after the
      // call, one per drop interval, and never stop by themselves
      const every = drizzle ? cfg.drizzleDropSec || 1.6 : (cfg.dropBeats || 1) * beat;
      out.dropEvery = every;
      out.dropStart = keyEnd + beat;
      out.dropLand = (k) => out.dropStart + (k - 1) * every + (cfg.fall || 0.6);
      wave.targets.forEach((tg) => {
        // the count is lost when drop n+1 lands; that's this target's "reveal"
        reveal[tg.id] = out.dropLand(tg.n + 1);
        land[tg.id] = reveal[tg.id];
      });
    }
    const allLand = Math.max(...Object.values(land).filter(isFinite), keyEnd);
    out.end = allLand + (cfg.gapBeats != null ? cfg.gapBeats : 2) * beat;
    return out;
  };

  /* ------------------------------------------------------------ grading */
  /**
   * answers: [{t, pick}] in any order. For "which" pick is a candidate
   * (word) id; "count": the pot lidded; "weather": a gesture; "say":
   * {said, via: "voice" | "pill" | "parent"}.
   * Returns {targets: {id: {outcome, saved, rt, answer, blame, right}}, ignored: [...]}
   *   outcome: heard | wrong | late | taught | retry  (+ `voice` for "say")
   */
  Calls.grade = function (wave, T, answers, storm) {
    const kind = storm.kind;
    const out = { targets: {}, ignored: [] };
    const order = wave.targets.slice();
    const ans = answers
      .filter((a) => a && a.t != null && a.t >= T.t0 - 1e-9) // nothing before the call starts
      .filter((a) => !(kind === "say" && a.via === "voice" && !a.said)) // "didn't catch that" is not an answer
      .slice()
      .sort((a, b) => a.t - b.t);
    const first = {};
    const dives = {};
    const cap = wave.targets.length;
    let used = 0;
    const unanswered = () => order.filter((tg) => !first[tg.id]);
    const matches = (tg, a) => {
      if (kind === "which") return a.pick === tg.cand;
      if (kind === "count") return a.pick === tg.cand;
      if (kind === "weather") return a.pick === tg.gesture;
      if (kind === "say") return a.said === tg.word;
      return false;
    };
    for (const a of ans) {
      const open = unanswered();
      if (!open.length || used >= cap) {
        // the hand is empty: after a reveal a tap on the right place is a dive (craft)
        const tg = order.find((x) => a.t >= T.reveal[x.id] && a.t < T.land[x.id] + 1e-9 && matches(x, a));
        if (tg) dives[tg.id] = dives[tg.id] || a;
        else out.ignored.push(a);
        continue;
      }
      let tg;
      if (wave.frame === "sequence") tg = open[0];
      else tg = open.find((x) => matches(x, a)) || open[0];
      first[tg.id] = a;
      used++;
    }
    for (const tg of order) {
      const a = first[tg.id];
      const r = { answer: a || null, rt: null, blame: [], right: [], saved: false };
      const deciding = Object.values(tg.slots);
      if (kind === "count") {
        // count at lid time = drops landed in the pot by then
        let c = null;
        if (a && matches(tg, a)) c = Math.max(0, Math.floor((a.t - T.dropStart - (storm.cfg.fall || 0.6)) / T.dropEvery + 1e-9) + 1);
        if (a && a.t < T.dropStart + (storm.cfg.fall || 0.6)) c = matches(tg, a) ? 0 : c;
        r.count = c;
        if (a && a.t < T.reveal[tg.id] && matches(tg, a) && c === tg.n) {
          r.outcome = "heard";
          r.rt = a.t - T.dropLand(tg.n);
          r.saved = true;
          r.right = deciding;
        } else {
          r.outcome = "wrong";
          if (!a || a.t >= T.reveal[tg.id]) r.why = "overflow";
          else if (!matches(tg, a)) r.why = "pot";
          else r.why = c < tg.n ? "early" : "over";
          r.blame = r.why === "pot" ? [tg.slots.noun] : [tg.slots.number];
          // a near miss still keeps the pot dry
          r.saved = !!(a && matches(tg, a) && c != null && Math.abs(c - tg.n) <= 1);
        }
      } else if (kind === "weather") {
        if (tg.nogo) {
          if (a && a.t < T.reveal[tg.id]) {
            r.outcome = "wrong";
            r.why = "acted on a no-go";
            r.blame = [tg.word];
          } else {
            r.outcome = "heard";
            r.right = [tg.word];
            r.saved = true;
          }
        } else if (a && a.t < T.reveal[tg.id]) {
          r.outcome = matches(tg, a) ? "heard" : "wrong";
          r.rt = a.t - T.keyEnd;
          r.saved = matches(tg, a);
          if (r.outcome === "heard") r.right = [tg.word];
          else r.blame = [tg.word];
        } else {
          r.outcome = "late";
          r.blame = [tg.word];
          r.saved = !!((a && matches(tg, a) && a.t < T.land[tg.id]) || dives[tg.id]);
        }
      } else {
        // which / say
        if (a && a.t < T.reveal[tg.id]) {
          const ok = matches(tg, a);
          r.outcome = ok ? "heard" : "wrong";
          r.rt = Math.max(0, a.t - T.keyEnd);
          r.saved = ok || !!dives[tg.id];
          if (ok) r.right = deciding;
          else {
            // slot-wise blame: a switch lure blames the switch word as well
            r.blame = [tg.slots.noun];
            if (wave.lure && a.pick === wave.lure && tg.slots.switch) r.blame.push(tg.slots.switch);
            if (kind === "say") r.blame = [];
          }
        } else {
          r.outcome = "late";
          r.blame = kind === "say" ? [] : [tg.slots.noun];
          r.saved = !!((a && matches(tg, a) && a.t < T.land[tg.id] + 1e-9) || dives[tg.id]);
        }
        if (kind === "say") {
          // the voice tally: recognised as the target, or a parent's tick
          r.voice = !!(a && ((a.via === "voice" && a.said === tg.word) || (a.via === "parent" && a.ok)));
          r.via = a ? a.via : null;
          if (a && a.via === "parent" && a.ok) {
            r.outcome = a.t < T.reveal[tg.id] ? "heard" : r.outcome;
            r.saved = r.saved || a.t < T.land[tg.id];
          }
        }
      }
      r.graded = r.outcome;
      // what counts for the ear (the grade stays underneath for word progress)
      if (tg.taught) r.outcome = "taught";
      else if (wave.retry) r.outcome = "retry";
      out.targets[tg.id] = r;
    }
    return out;
  };

  /* ------------------------------------------------------------ a session */
  /**
   * Plays a storm wave by wave: the planned waves, with a missed call
   * coming back 2–4 waves later as a `retry` (it counts for the word's
   * progress, not for the ear; the design's "prompt, not recast").
   */
  Calls.session = function (storm) {
    const R = rng(storm.seed + 7);
    const queue = storm.waves.slice();
    const results = [];
    let retries = 0;
    const s = {
      storm,
      results,
      help: { replays: 0, freeReplayUsed: false, reveals: 0, translations: 0, where: 0 },
      next() {
        return queue.shift() || null;
      },
      left() {
        return queue.length;
      },
      /** record a played wave: {wave, timing, answers, grade} */
      record(wave, timing, answers, grade) {
        const rec = { wave, timing, answers, grade };
        results.push(rec);
        const missed = wave.targets.filter((tg) => {
          const r = grade.targets[tg.id];
          return !wave.retry && !tg.taught && (r.graded === "wrong" || r.graded === "late");
        });
        if (missed.length && retries < storm.rules.retry.max && storm.kind !== "say") {
          retries++;
          const back = R.int(storm.rules.retry.after[0], storm.rules.retry.after[1]) - 1;
          const rw = JSON.parse(JSON.stringify(wave));
          rw.retry = true;
          rw.retryOf = wave.i;
          rw.i = `${wave.i}r`;
          queue.splice(Math.min(back, queue.length), 0, rw);
        }
        return rec;
      },
    };
    return s;
  };

  /* ------------------------------------------------------------ stars */
  Calls.tally = function (session) {
    const storm = session.storm;
    const t = { tested: 0, heard: 0, targets: 0, saved: 0, rts: [], voiceCalls: 0, voiceOk: 0, outcomes: {} };
    for (const rec of session.results) {
      for (const tg of rec.wave.targets) {
        const r = rec.grade.targets[tg.id];
        t.targets++;
        if (r.saved) t.saved++;
        t.outcomes[r.outcome] = (t.outcomes[r.outcome] || 0) + 1;
        if (storm.kind === "say") {
          t.voiceCalls++;
          if (r.voice) t.voiceOk++;
          continue;
        }
        // a call answered after a reveal or translation ("helped") is tested, not heard
        if (r.outcome === "heard" || r.outcome === "wrong" || r.outcome === "late" || r.outcome === "helped") {
          t.tested++;
          if (r.outcome === "heard") {
            t.heard++;
            if (r.rt != null) {
              const extra = tg.stage <= 2 ? storm.rules.par.newWordExtra || 0.5 : 0;
              t.rts.push(r.rt - extra);
            }
          }
        }
      }
    }
    return t;
  };

  /**
   * The stars (section 7, D.4): ear ("Understood": ≥ earPass of ≥ minTested
   * tested calls heard), hand ("Kept dry", the umbrella: ≥ craftPass saved),
   * busy ("Quick ears": median reaction under the level's par) or relaxed
   * ("No help": no paid hints), and voice ("Called it", K5 only).
   */
  Calls.stars = function (session) {
    const storm = session.storm;
    const t = Calls.tally(session);
    const R = storm.rules;
    const stars = {};
    if (storm.kind !== "say") stars.ear = t.tested >= storm.minTested && t.heard / t.tested >= R.earPass - 1e-9;
    stars.hand = t.targets > 0 && t.saved / t.targets >= R.craftPass - 1e-9;
    if (storm.mode === "busy") {
      const par = (R.par.lightning || [2])[Math.min(storm.level, (R.par.lightning || [2]).length) - 1];
      const m = median(t.rts);
      stars.busy = storm.kind !== "say" && !!stars.ear && m != null && m < par;
    } else {
      const h = session.help;
      stars.relaxed = h.replays === 0 && h.reveals === 0 && h.translations === 0;
    }
    if (storm.kind === "say") stars.voice = t.voiceCalls >= R.voiceMin && t.voiceOk / t.voiceCalls >= R.voicePass - 1e-9;
    return { stars, tally: t, placeholder: storm.placeholder };
  };

  /* ------------------------------------------------------------ word progress */
  /**
   * The storm's word-progress updates, with D.7's rule: in Busy `late`
   * never counts against a word (speed, not meaning), a `wrong` counts
   * half, and a word moves at most one stage per storm. Drizzle misses
   * count as Cook's do. A heard call is right for every word in it; a miss
   * blames the deciding slot. Taught (stage-1) words are only "seen".
   * api: {stage(id), right(id), miss(id), seen(id)} (js/progress.js in the browser).
   */
  Calls.applyProgress = function (session, api) {
    const storm = session.storm;
    const rule = storm.rules.stageRule;
    const busy = storm.mode === "busy";
    const start = {};
    const halves = {};
    const log = [];
    const moved = (id) => Math.abs(api.stage(id) - start[id]) >= (rule.maxStagePerStorm || 1);
    const touch = (id) => {
      if (start[id] == null) start[id] = api.stage(id);
    };
    for (const rec of session.results) {
      for (const tg of rec.wave.targets) {
        const r = rec.grade.targets[tg.id];
        const ids = Object.values(tg.slots);
        ids.forEach(touch);
        if (tg.taught) {
          ids.forEach((id) => api.seen && api.seen(id));
          log.push({ ids, op: "seen" });
          continue;
        }
        if (r.graded === "heard") {
          ids.forEach((id) => {
            if (moved(id)) return;
            api.right(id);
            log.push({ id, op: "right" });
          });
          continue;
        }
        for (const id of r.blame || []) {
          touch(id);
          if (moved(id)) continue;
          if (busy && r.graded === "late") {
            log.push({ id, op: "late (not counted)" });
            continue;
          }
          if (busy && r.graded === "wrong" && (rule.busyWrong || 0.5) < 1) {
            halves[id] = (halves[id] || 0) + (rule.busyWrong || 0.5);
            if (halves[id] >= 1) {
              halves[id] -= 1;
              api.miss(id);
              log.push({ id, op: "miss" });
            } else log.push({ id, op: "half" });
            continue;
          }
          api.miss(id);
          log.push({ id, op: "miss" });
        }
      }
    }
    return log;
  };

  /* ------------------------------------------------------------ constraints */
  /** The section 8.1 constraints for one storm; returns a list of problems (empty is good). */
  Calls.check = function (storm, D) {
    const bad = [];
    const cfg = storm.cfg;
    const menu = new Set((D && D.menu_words) || []);
    const nCand = storm.candidates.length;
    if (storm.kind === "which" || storm.kind === "say") {
      if (nCand < (cfg.minCandidates || 4)) bad.push(`only ${nCand} candidates`);
    }
    let prev = [];
    const newW = new Set();
    storm.waves.forEach((w) => {
      const ids = w.targets.map((t) => t.word);
      if (!w.retry && ids.some((x) => prev.includes(x)) && storm.kind !== "weather" && !(storm.kind === "count" && !cfg.named)) bad.push(`wave ${w.i}: same target twice running`);
      w.targets.forEach((t) => {
        Object.values(t.slots).forEach((id) => menu.has(id) && bad.push(`wave ${w.i}: menu word ${id} called`));
        Object.values(t.slots).forEach((id) => storm.stage[id] < 2 && newW.add(id));
      });
      if (new Set(ids).size !== ids.length && storm.kind !== "count") bad.push(`wave ${w.i}: a target twice in one call`);
      if (!w.say.some((p) => p.key) && storm.kind !== "say") bad.push(`wave ${w.i}: no key part`);
      prev = ids;
    });
    if (newW.size > 3) bad.push(`${newW.size} stage-1 words`);
    return bad;
  };

  return Calls;
});
