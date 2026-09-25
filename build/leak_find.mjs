#!/usr/bin/env node
/*
 * Find it: the leak bot, headless (no browser). docs/find-it-design.md D5,
 * build brief 8.2 phase 0.
 *
 * The non-speaker bot (js/find/blind.js) plays rounds built by the page's
 * own generator (js/find/gen.js) from the page's own data (data/find.json,
 * the scenes, the shared relations), seeing only what's on screen, and we
 * count how often it earns the ear star. Over 10% means something on the
 * screen gives the answer away (target 5%).
 *
 *   node build/leak_find.mjs                      # every game, levels 1-4, stages 2 and 3, 400 rounds each
 *   node build/leak_find.mjs --n 1000 --game whichone --level 1 --stage 2
 *   node build/leak_find.mjs --md build/reports/find-leak.md
 *
 * Games:
 *   list      F1 Nani's list + Check the bag: noun strategy x size strategy
 *   whichone  F2 Which one? (every row sized) + the bag
 *   where     F3 Where is it? (calls): noun strategy x copy strategy, twice:
 *             "hidden" (as if the position words were Kutchi; the pass mark)
 *             and "reader" (today: the positions are readable English
 *             placeholders, so those calls are not tested for the ear star;
 *             reported apart, never a pass mark)
 *   ali       F4 Ali's turn, played by pills alone: how often a random pill
 *             is right first time, and a check that pills never earn the voice star
 * Also: the generator's own checks (the size decoy rule, "in three places")
 * must hold in every round, and the digit rule (a row shows its count only
 * while the number word is taught).
 * Exit code 1 if anything fails.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const Rel = require(path.join(ROOT, "js/shared/rel.js"));
const Stars = require(path.join(ROOT, "js/shared/stars.js"));
const Gen = require(path.join(ROOT, "js/find/gen.js"));
const Blind = require(path.join(ROOT, "js/find/blind.js"));

const args = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return dflt;
  const v = args[i + 1];
  return v && !v.startsWith("--") ? v : true;
};
const N = Number(arg("n", 400));
const SEED = Number(arg("seed", 1));
const ONLY = arg("game", null);
const LEVEL = arg("level", null) ? Number(arg("level")) : null;
const STAGE = arg("stage", null) ? Number(arg("stage")) : null;
const MD = arg("md", null);

/* ---------------- the data, as find.html loads it ---------------- */
Rel.load(read("data/relations.json"));
Stars.load(read("data/shared/stars.json"));
const cook = read("data/cook.json");
const fd = read("data/find.json");
const W = Object.assign({}, cook.words);
const content = {};
for (const w of read("data/content.json").words) content[w.id] = w;
for (const id of fd.words.from_content) {
  const c = content[id];
  if (c && !W[id]) W[id] = { kutchi: (c.kutchi && c.kutchi.text) || null, english: c.english };
}
for (const [id, c] of Object.entries(content)) if (W[id] && c.image) W[id].picture = `assets/${c.image}`;
for (const [id, k] of Object.entries(fd.words.spelling || {})) if (id[0] !== "_" && W[id]) W[id] = Object.assign({}, W[id], { kutchi: k });
for (const [id, w] of Object.entries(fd.words.placeholders || {})) if (id[0] !== "_" && !W[id]) W[id] = w;
Rel.mergeWords(W);
const numbers = Object.assign({}, cook.grammar.numbers, fd.words.numbers);
const numId = (n) => numbers[n];
const words = (id) => W[id] || null;

// a picture's shape (PNG header), for the "salient" strategy's area
const picArea = {};
function areaOf(id) {
  if (picArea[id] != null) return picArea[id];
  let a = 1;
  try {
    const b = fs.readFileSync(path.join(ROOT, W[id].picture));
    const w = b.readUInt32BE(16);
    const h = b.readUInt32BE(20);
    a = (w * h) / Math.max(w, h) ** 2;
  } catch (e) {
    a = 1;
  }
  return (picArea[id] = a);
}

const scenes = {};
for (const [id, s] of Object.entries(fd.scenes)) scenes[id] = Object.assign({ id }, s.base ? read(s.base) : {}, s);
const groups = fd.lookalike_groups.groups;
const envFor = (scene, stage, rng) => ({
  rng,
  groups,
  clutter: fd.lookalike_groups.clutter,
  drawable: (id) => !!(W[id] && W[id].picture) && !(scene.painted || []).includes(id),
  cognate: (id) => fd.cognates.ids.includes(id),
  stage: () => stage,
  word: words,
});

/* ---------------- one round ---------------- */
function build(game, level, stage, rng) {
  const M = fd.mechanics[game];
  const k = Gen.knobs(M.levels, level);
  const scene = scenes[k.scene || "bazaar"];
  const env = envFor(scene, stage, rng);
  const r = Gen.makeRound(k, env, scene);
  r.items = Gen.items(r.units, scene, rng);
  r.items.forEach((it) => (it.area = areaOf(it.noun)));
  return { k, scene, env, r };
}
function playOne(game, level, stage, strat, rng, { hidePlaceholders = true } = {}) {
  const { k, scene, env, r } = build(game, level, stage, rng);
  const screen = Blind.screen(r, scene, { stage, numStage: stage, words, sizes: fd.sizes, numId, hidePlaceholders });
  let res;
  if (game === "where") res = Blind.playCalls(r, scene, screen, strat, rng);
  else {
    const listed = r.wants.filter((w) => !w.not);
    const bag = k.bag ? Gen.pack(listed, [...new Set(r.items.map((x) => x.noun))], k.bag.errors, env) : null;
    res = Blind.playList(r, scene, screen, strat, rng, { bag, countTaught: Gen.digitShown(stage) });
  }
  return { res, problems: r.problems, screen, r };
}

/* ---------------- the runs ---------------- */
const out = [];
const log = (s = "") => {
  console.log(s);
  out.push(s);
};
const pct = (a, b) => (b ? (100 * a) / b : 0);
const fmt = (x) => `${x.toFixed(1)}%`;
let failures = 0;
const rng = Gen.rng(SEED);

log(`# Find it leak bot (node build/leak_find.mjs --n ${N} --seed ${SEED})`);
log("");
log("The ear-star rate of a player who knows no Kutchi, per game, level and word stage (2: words as text; 3: dots). Pass: under 10% (target 5%) for the mean over strategies at levels 1-3; the worst single strategy is shown too.");
log("");

// the generator's checks and the digit rule
{
  let rounds = 0;
  const bad = {};
  for (const game of ["list", "whichone", "where", "ali"]) {
    if (!fd.mechanics[game] || (ONLY && ONLY !== game)) continue;
    for (let level = 1; level <= 4; level++) {
      for (let i = 0; i < 200; i++) {
        const { r } = build(game, level, 2, rng);
        rounds++;
        r.problems.forEach((p) => (bad[`${game} L${level}: ${p.replace(/fru-\d+|veg-\d+/g, "X")}`] = (bad[`${game} L${level}: ${p.replace(/fru-\d+|veg-\d+/g, "X")}`] || 0) + 1));
      }
    }
  }
  const digitLeak = [2, 3].some((st) => Blind.row({ noun: "fru-01", count: 2 }, scenes.bazaar, { stage: st, numStage: st, words, numId }).digit != null);
  const digitTaught = Blind.row({ noun: "fru-01", count: 2 }, scenes.bazaar, { stage: 1, numStage: 1, words, numId }).digit === 2;
  log("## Generator checks");
  log("");
  log(`${rounds} rounds built. Problems: ${Object.keys(bad).length ? "" : "none"}`);
  Object.entries(bad).forEach(([p, n]) => log(`- ${p} (${n}x)`));
  log(`Digit rule: shown at stage 1 ${digitTaught ? "yes" : "NO"}; shown at stage 2 or 3 ${digitLeak ? "YES (a leak)" : "no"}.`);
  log("");
  if (Object.keys(bad).length || digitLeak || !digitTaught) failures++;
}

const TABLES = [
  { game: "list", name: "F1 Nani's list + Check the bag", strats: Blind.NOUN.flatMap((n) => ["bigger", "any"].map((s) => ({ noun: n, size: s }))) },
  { game: "whichone", name: "F2 Which one? (+ the bag)", strats: Blind.NOUN.flatMap((n) => Blind.SIZE.map((s) => ({ noun: n, size: s }))) },
  { game: "where", name: "F3 Where is it? (calls; positions hidden, as if Kutchi)", strats: Blind.NOUN.flatMap((n) => ["visible", "nearest", "first"].map((c) => ({ noun: n, copy: c }))) },
];
const label = (s) => [s.noun, s.size, s.copy].filter(Boolean).join("/");
for (const T of TABLES) {
  if (ONLY && ONLY !== T.game) continue;
  log(`## ${T.name}`);
  log("");
  log("| Level | Stage | Rounds | Ear (mean) | Worst strategy | Pass |");
  log("|---|---|---|---|---|---|");
  for (let level = 1; level <= 4; level++) {
    if (LEVEL && level !== LEVEL) continue;
    for (const stage of [2, 3]) {
      if (STAGE && stage !== STAGE) continue;
      let ear = 0;
      let n = 0;
      let worst = { rate: -1 };
      for (const s of T.strats) {
        let e = 0;
        const per = Math.max(20, Math.round(N / 4));
        for (let i = 0; i < per; i++) if (playOne(T.game, level, stage, s, rng).res.ear) e++;
        ear += e;
        n += per;
        if (pct(e, per) > worst.rate) worst = { rate: pct(e, per), s: label(s) };
      }
      const rate = pct(ear, n);
      const pass = level > 3 || rate < 10;
      if (!pass) failures++;
      log(`| ${level} | ${stage} | ${n} | ${fmt(rate)} | ${worst.s} ${fmt(worst.rate)} | ${level > 3 ? "(L4: reported)" : pass ? (rate < 5 ? "yes" : "yes (over 5%)") : "**NO**"} |`);
    }
  }
  log("");
}

if (!ONLY || ONLY === "where") {
  log("## F3 today: the positions are readable English placeholders (reader)");
  log("");
  log("The bot reads the placeholder (\"in the crate\") and only has to guess the thing. Those calls are not tested for the ear star until the family's position words are in (stars rule placeholdersTested: false), so this is reported, not a pass mark.");
  log("");
  log("| Level | Stage | Rounds | Ear if it counted |");
  log("|---|---|---|---|");
  for (let level = 1; level <= 4; level++) {
    if (LEVEL && level !== LEVEL) continue;
    for (const stage of [2, 3]) {
      if (STAGE && stage !== STAGE) continue;
      let e = 0;
      const per = N;
      for (let i = 0; i < per; i++) if (playOne("where", level, stage, { noun: Gen.pick(Blind.NOUN, rng), copy: "reader" }, rng, { hidePlaceholders: false }).res.ear) e++;
      log(`| ${level} | ${stage} | ${per} | ${fmt(pct(e, per))} |`);
    }
  }
  log("");
}

if (!ONLY || ONLY === "ali") {
  log("## F4 Ali's turn, pills only (no voice)");
  log("");
  log("A random pill for each thing (and, from level 2, each number). The voice star is Stars.voice over the moments: pills leave it open, never earned.");
  log("");
  log("| Level | Rounds | All pills right first time | Voice star earned |");
  log("|---|---|---|---|");
  for (let level = 1; level <= 4; level++) {
    if (LEVEL && level !== LEVEL) continue;
    let all = 0;
    let voice = 0;
    for (let i = 0; i < N; i++) {
      const { k, r } = build("ali", level, 2, rng);
      const stall = [...new Set(r.items.map((x) => x.noun))];
      const asks = [];
      r.wants
        .filter((w) => !w.not)
        .forEach((w) => {
          const others = Gen.shuffle(stall.filter((x) => x !== w.noun), rng).slice(0, (k.choices || 6) - 1);
          asks.push({ choices: Gen.shuffle([w.noun].concat(others), rng), ok: (c) => c === w.noun });
          if (k.numbers) asks.push({ choices: [1, 2, 3, 4], ok: (c) => c === w.count });
          if (w.size) asks.push({ choices: Gen.SIZES, ok: (c) => c === w.size });
        });
      const p = Blind.playPills(asks, rng);
      if (p.all) all++;
      if (Stars.voice(p.moments, "find").state === "earned") voice++;
    }
    if (voice) failures++;
    log(`| ${level} | ${N} | ${fmt(pct(all, N))} | ${voice} ${voice ? "**NO**" : "(never)"} |`);
  }
  log("");
}

log(failures ? `FAIL: ${failures} check(s)` : "PASS");
if (MD) fs.writeFileSync(path.join(ROOT, MD), out.join("\n") + "\n");
process.exit(failures ? 1 : 0);
