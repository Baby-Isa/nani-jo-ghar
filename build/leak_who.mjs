#!/usr/bin/env node
/*
 * Who did it?: the logic leak bot (no browser). Plays js/who/case.js with
 * every blind strategy from the design (8.4, D5) and prints how often each
 * earns the ear star (or, for Tell Ali, solves by pills: coins only, since
 * pills never earn the voice star). It also checks the generator's rules on
 * every case: one culprit at the end and none sooner, every clue removes
 * someone, no single clue names the culprit from L2, the culprit no more
 * distinctive than the median, one trace per look-alike group, and the
 * culprit's slot uniform (chi-square).
 *
 * Usage:
 *   node build/leak_who.mjs                    # 10000 rounds per game and level
 *   node build/leak_who.mjs --rounds 2000 --game g2 --level 1
 *   node build/leak_who.mjs --all-words        # include placeholder (English) clue types
 * Exit code 1 if a rule breaks or a strategy reaches its threshold
 * (10% at L1, 5% from L2).
 */
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const C = require(path.join(ROOT, "js/who/case.js"));
const W = require(path.join(ROOT, "js/who/stubs/whichone.js"));
const who = require(path.join(ROOT, "data/who.json"));
const cook = require(path.join(ROOT, "data/cook.json"));
const P = C.prepare(who, cook.words);

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const ROUNDS = Number(opt("rounds", 10000));
const ONLY_GAME = opt("game", null);
const ONLY_LEVEL = opt("level", null) ? Number(opt("level")) : null;
const REAL_ONLY = !args.includes("--all-words");

const PLAN = [
  ["g3", 1], ["g3", 2], ["g1", 1], ["g1", 2], ["g2", 1], ["g2", 2], ["g5", 1], ["g5", 2], ["g4", 1],
].filter(([g, l]) => (!ONLY_GAME || g === ONLY_GAME) && (!ONLY_LEVEL || l === ONLY_LEVEL));

/* ---------------------------------------------------------------- bot rng */
const R = C.rng(20260925);
const coin = () => R.next() < 0.5;
const subset = (arr) => arr.filter(coin);
const half = (arr) => R.shuffle(arr).slice(0, R.next() < 0.5 ? Math.floor(arr.length / 2) : Math.ceil(arr.length / 2));

function distinctOf(c) {
  return W.balance(c.suspects, c.dims.concat(["kind"])).distinct;
}

/* ------------------------------------------------------------ strategies */
// K1: the bot sees the line-up (and, after peeking, every trace), not the word
const K1 = {
  "random tap": (st, c, mem) => R.int(0, c.suspects.length - 1),
  "peek at all, then random": (st, c, mem) => R.int(0, c.suspects.length - 1), // traces seen, word unknown
  "never the same twice": (st, c, mem) => {
    const left = c.suspects.map((_, i) => i).filter((i) => !mem.caught.includes(i));
    return left.length ? R.pick(left) : R.int(0, c.suspects.length - 1);
  },
  "always the same": (st, c, mem) => (mem.fixed = mem.fixed != null ? mem.fixed : R.int(0, c.suspects.length - 1)),
  "first slot": () => 0,
  "middle slot": (st, c) => Math.floor(c.suspects.length / 2),
  "most distinctive": (st, c) => {
    const d = distinctOf(c);
    const top = Math.max(...d);
    return R.pick(d.map((v, i) => (v === top ? i : -1)).filter((i) => i >= 0));
  },
};

function playK1(c, strat) {
  const st = C.start(c);
  const mem = { caught: [] };
  let guard = 0;
  while (!st.done && guard++ < 50) {
    let pick = strat(st, c, mem);
    let res = C.grade(st, { type: "pick", index: pick });
    let tries = 0;
    while (!res.ok && tries++ < 10) {
      pick = res.shown ? res.shown[0] : R.int(0, c.suspects.length - 1);
      res = C.grade(st, { type: "pick", index: pick });
    }
    if (res.ok) mem.caught.push(res.caught);
  }
  return C.stars(st, P).ear === true;
}

// K2: the bot sees who is standing, the row count and (with the magnifier) every trace
const K2 = {
  "random subset": (st) => subset(st.standing),
  "tap all": (st) => st.standing.slice(),
  "tap none": () => [],
  "tap one": (st) => [R.pick(st.standing)],
  "tap half": (st) => half(st.standing),
  "most distinctive half": (st, c) => {
    const d = distinctOf(c);
    const s = R.shuffle(st.standing).sort((a, b) => d[b] - d[a]);
    return s.slice(0, Math.ceil(s.length / 2));
  },
  "least distinctive half": (st, c) => {
    const d = distinctOf(c);
    const s = R.shuffle(st.standing).sort((a, b) => d[a] - d[b]);
    return s.slice(0, Math.ceil(s.length / 2));
  },
  "first half by position": (st) => st.standing.slice().sort((a, b) => a - b).slice(0, Math.ceil(st.standing.length / 2)),
  "row shape (half, then one)": (st) => (st.i === 0 ? half(st.standing) : [R.pick(st.standing)]),
  "wait for the glow": () => [],
  "early accuse": "accuse",
  "odd one out accuse": "accuse-odd",
};

function playK2(c, name) {
  const strat = K2[name];
  const st = C.start(c);
  if (strat === "accuse" || strat === "accuse-odd") {
    let who = R.int(0, c.suspects.length - 1);
    if (strat === "accuse-odd") {
      const d = distinctOf(c);
      const top = Math.max(...d);
      who = R.pick(d.map((v, i) => (v === top ? i : -1)).filter((i) => i >= 0));
    }
    let res = C.grade(st, { type: "accuse", index: who });
    let guard = 0;
    while (!res.ok && guard++ < 20) res = C.grade(st, { type: "accuse", index: R.int(0, c.suspects.length - 1) });
    return C.stars(st, P).ear === true;
  }
  let guard = 0;
  while (st.phase === "commit" && guard++ < 50) {
    let res = C.grade(st, { type: "commit", picks: strat(st, c) });
    let tries = 0;
    while (!res.ok && tries++ < 10) res = C.grade(st, { type: "commit", picks: res.shown || strat(st, c) });
  }
  C.grade(st, { type: "accuse", index: st.standing[0] });
  return C.stars(st, P).ear === true;
}

// K4: no mic, no parent; the bot taps pills. Stars: the voice star is never
// possible by pills; we report how often random pills still solve the case.
function playK4(c, name) {
  const st = C.start(c);
  const said = [];
  let guard = 0;
  while (!st.done && st.phase === "say" && guard++ < 20) {
    let pool = c.choices.filter((ch) => !said.includes(ch.word));
    if (name === "random pill, never repeat" && !pool.length) break;
    if (name === "random pill") pool = c.choices;
    const ch = R.pick(pool);
    said.push(ch.word);
    C.grade(st, { type: "say", word: ch.word, via: "pill" });
  }
  const s = C.stars(st, P);
  return { solved: st.done, voice: s.voice === true };
}

function playK3(c, name) {
  const st = C.start(c);
  while (!st.done) C.grade(st, { type: "answer", yes: name === "always yes" ? true : name === "always no" ? false : coin() });
  return st.answers.every((a) => a.right);
}

/* ------------------------------------------------------------- the checks */
function checkCase(c, lv, errs) {
  const tracesInPlay = new Set(c.suspects.map((s) => s.attrs.trace).filter(Boolean));
  const groups = [...tracesInPlay].map((v) => (C.attrOf(P, "trace", v) || {}).group).filter(Boolean);
  if (new Set(groups).size !== groups.length) errs.push("two traces from one look-alike group");
  if (c.kind === "K1") {
    for (const it of c.items) {
      const f = c.suspects.map((s, i) => (C.fits(s, it.clue) ? i : -1)).filter((i) => i >= 0);
      if (f.length !== 1 || f[0] !== it.eater) errs.push("K1 clue does not name exactly its eater");
    }
    return;
  }
  const d = W.balance(c.suspects, c.dims.concat(["kind"]));
  if (c.culprit != null && d.distinct[c.culprit] > d.median) errs.push("culprit more distinctive than the median");
  if (c.kind === "K2") {
    const end = C.consistent(c, c.clues.length);
    if (end.length !== 1 || end[0] !== c.culprit) errs.push("not exactly one culprit at the end");
    for (let n = 1; n < c.clues.length; n++) if (C.consistent(c, n).length < 2) errs.push("solved before the last clue");
    for (let n = 0; n < c.clues.length; n++) if (C.consistent(c, n + 1).length === C.consistent(c, n).length) errs.push("a clue that removes nobody");
    if (lv.single_clue_solves === false)
      for (const cl of c.clues) if (c.suspects.filter((s) => C.fits(s, cl)).length < 2) errs.push("a single clue names the culprit (L2)");
    if (!c.clues.every((cl) => cl.real) && REAL_ONLY) errs.push("a placeholder clue in a Kutchi-real case");
  }
  if (c.kind === "K4") {
    if (c.minWords < 2) errs.push("one word names the culprit");
    if (c.choices.length < 3 || c.choices.length > 6) errs.push("closed set outside 3-6");
  }
  if (c.kind === "K3") {
    if (!c.questions.some((q) => q.answer) || !c.questions.some((q) => !q.answer)) errs.push("K3 round without both answers");
  }
}

// chi-square of the culprit's slot (per line-up size); critical values at p = 0.001
const CRIT = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 6: 22.46, 7: 24.32 };
function chi(counts) {
  const out = [];
  for (const [n, arr] of Object.entries(counts)) {
    const total = arr.reduce((a, b) => a + b, 0);
    const e = total / arr.length;
    const x2 = arr.reduce((a, o) => a + ((o - e) * (o - e)) / e, 0);
    out.push({ n: Number(n), total, x2: Math.round(x2 * 10) / 10, ok: x2 < CRIT[arr.length - 1] });
  }
  return out;
}

/* ------------------------------------------------------------------ run */
const pct = (k, n) => `${((100 * k) / n).toFixed(1)}%`;
let failed = false;
const report = [];
console.log(`Who did it? leak bot: ${ROUNDS} rounds per game and level${REAL_ONLY ? " (Kutchi-real clue types only)" : " (all clue types)"}\n`);

for (const [game, level] of PLAN) {
  const g = who.games[game];
  const lv = g.levels[level - 1];
  const kind = lv.kind || g.kind;
  const cases = [];
  const errs = [];
  const slotCounts = {};
  let blind = 0;
  for (let k = 0; k < ROUNDS; k++) {
    const c = C.makeCase(P, { game, level, seed: 1000 + k * 7919, realOnly: REAL_ONLY });
    const e = [];
    checkCase(c, lv, e);
    if (e.length) errs.push(`seed ${c.seed}: ${e.join("; ")}`);
    const n = c.suspects.length;
    slotCounts[n] = slotCounts[n] || new Array(n).fill(0);
    if (c.kind === "K1") c.items.forEach((it) => slotCounts[n][it.eater]++);
    else slotCounts[n][c.culprit]++;
    const b = W.blindOdds(c);
    if (b != null) blind += b;
    cases.push(c);
  }
  const threshold = level === 1 ? 0.1 : 0.05;
  const rows = [];
  const run = (name, fn, label = "ear star") => {
    let k = 0;
    for (const c of cases) if (fn(c)) k++;
    const bad = k / ROUNDS >= threshold && label === "ear star";
    if (bad) failed = true;
    rows.push({ name, rate: k / ROUNDS, label, bad });
  };
  if (kind === "K1") for (const [name, s] of Object.entries(K1)) run(name, (c) => playK1(c, s));
  if (kind === "K2") {
    for (const name of Object.keys(K2)) run(name, (c) => playK2(c, name));
    run("listener (knows every word)", (c) => {
      const st = C.start(c);
      while (st.phase === "commit") C.grade(st, { type: "commit", picks: C.expectation(st).answer });
      C.grade(st, { type: "accuse", index: st.standing[0] });
      return C.stars(st, P).ear === true;
    }, "sanity");
  }
  if (kind === "K4") {
    for (const name of ["random pill", "random pill, never repeat"]) {
      let solved = 0;
      let voice = 0;
      for (const c of cases) {
        const r = playK4(c, name);
        if (r.solved) solved++;
        if (r.voice) voice++;
      }
      if (voice) failed = true;
      rows.push({ name: `${name}: voice star`, rate: voice / ROUNDS, label: "voice star", bad: voice > 0 });
      rows.push({ name: `${name}: solved (coins only)`, rate: solved / ROUNDS, label: "solved" });
    }
  }
  if (kind === "K3") for (const name of ["random yes/no", "always yes", "always no"]) run(name, (c) => playK3(c, name), "all answers right");
  const chis = chi(slotCounts);
  if (chis.some((x) => !x.ok)) failed = true;
  if (errs.length) failed = true;
  const sizes = [...new Set(cases.map((c) => c.suspects.length))].join("/");
  const clueN = kind === "K2" ? [...new Set(cases.map((c) => c.clues.length))].sort().join("/") : kind === "K1" ? cases[0].items.length : kind === "K4" ? [...new Set(cases.map((c) => c.choices.length))].sort().join("/") : [...new Set(cases.map((c) => c.questions.length))].sort().join("/");
  console.log(`## ${game.toUpperCase()} ${g.name}, L${level} (${kind}; ${sizes} suspects; ${kind === "K1" ? "items" : kind === "K4" ? "words in the set" : kind === "K3" ? "questions" : "clues"} ${clueN})`);
  if (kind !== "K4") console.log(`  analytic blind random: ${pct(blind, ROUNDS)}`);
  for (const r of rows) console.log(`  ${r.bad ? "FAIL " : "     "}${r.name.padEnd(34)} ${pct(r.rate * ROUNDS, ROUNDS).padStart(6)}  ${r.label}`);
  console.log(`  culprit slot chi-square: ${chis.map((x) => `${x.n} slots x2=${x.x2}${x.ok ? "" : " FAIL"}`).join(", ")}`);
  console.log(`  rule checks: ${errs.length ? `FAIL (${errs.length})\n    ${errs.slice(0, 5).join("\n    ")}` : "all pass"}\n`);
  report.push({ game, level, kind, rows, chis, errors: errs.length });
}
if (args.includes("--json")) console.log(JSON.stringify(report));
console.log(failed ? "RESULT: FAIL" : "RESULT: PASS (every blind strategy under its threshold; every rule holds)");
process.exit(failed ? 1 : 0);
