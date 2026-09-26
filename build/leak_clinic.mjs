/*
 * The clinic's leak bot for the pipeline (docs/modes/clinic-design.md P12,
 * Q6; docs/clinic-heal-api.md). No browser: it plays the same rows the
 * stages play (js/clinic/pipeline.js) and every registered healing game's
 * own bot (Clinic.Heal.botRun), with strategies that never hear the words.
 *
 *   node build/leak_clinic.mjs [--rounds 500] [--seed 1] [--json out.json]
 *
 * Reports, per stage x level x strategy, the share of rounds won (every
 * tested row right: what the Accuracy badge's gold and the ear star need),
 * per healing game x level x strategy the same, and the whole patient at
 * each level (blind = random everywhere; the design's target is under 1% at
 * level 1). "fair" must be 100%. Taught rows (D1, E1 at level 1) don't count.
 * The phase-1 visit bot is build/leak_clinic_phase1.mjs.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = require(path.join(ROOT, "js/clinic/pipeline.js"));
const Heal = require(path.join(ROOT, "js/clinic/heal/registry.js"));
Heal.loadAll(path.join(ROOT, "js/clinic/heal/games"));

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const N = +arg("--rounds", 500);
const SEED = +arg("--seed", 1);
const data = P.prepare(JSON.parse(fs.readFileSync(path.join(ROOT, "data/clinic/pipeline.json"), "utf8")), JSON.parse(fs.readFileSync(path.join(ROOT, "data/clinic.json"), "utf8")));
const games = Heal.ids();
const pct = (w, n) => `${((100 * w) / n).toFixed(1)}%`;
const out = { rounds: N, seed: SEED, games, stages: {}, heal: {}, patient: {}, first: null };
let problems = 0;

console.log(`Clinic pipeline leak bot: ${N} rounds per cell, seed ${SEED}. Registered healing games: ${games.join(", ")}`);
console.log("Won = every tested row right. Taught-only rounds (D1 and E1 at level 1) count as not won.\n");

// ---- the stages ----
const VARIANTS = {
  waiting: { 1: ["W1"], 2: ["W2", "W3"], 3: ["W4", "W2", "W3"] },
  diagnosis: { 1: ["D2"], 2: ["D1b", "D2", "D3"], 3: ["D2", "D3"] },
  pharmacy: { 1: [null], 2: [null], 3: [null] },
  sendoff: { 1: ["E1"], 2: ["E2", "E3"], 3: ["E2", "E3", "E4"] },
};
for (const stage of ["waiting", "diagnosis", "pharmacy", "sendoff"]) {
  out.stages[stage] = {};
  console.log(`== ${stage}`);
  for (const L of [1, 2, 3]) {
    for (const v of VARIANTS[stage][L]) {
      const cell = {};
      for (const strat of P.bot.STRATEGIES[stage]) {
        const rng = P.rng(SEED * 7919 + L * 31 + strat.length);
        let won = 0;
        let taught = 0;
        for (let i = 0; i < N; i++) {
          const levels = { waiting: L, diagnosis: L, pharmacy: L, heal: L, sendoff: L };
          const plan = P.patient(data, { rng, levels, variants: v ? { [stage]: v } : {}, games });
          const r = P.bot[stage](plan.stages[stage], strat, rng);
          if (r.taught) taught++;
          else if (r.win) won++;
        }
        cell[strat] = won / N;
        if (strat === "fair" && taught < N && won + taught !== N) {
          problems++;
          console.log(`  !! fair lost a round: ${stage} L${L} ${v}`);
        }
      }
      out.stages[stage][`L${L}${v ? " " + v : ""}`] = cell;
      console.log(`  L${L}${v ? " " + v : ""}: ${Object.entries(cell).map(([k, x]) => `${k} ${pct(x, 1)}`).join(" · ")}`);
    }
  }
}

// ---- the healing games ----
const NH = N * 4; // the healing games' cells: four times the rounds (a game near 10% needs the tighter estimate)
console.log(`\n== heal (each game's own bot, via Clinic.Heal.botRun; ${NH} rounds per cell)`);
for (const id of games) {
  out.heal[id] = {};
  for (const L of [1, 2, 3]) {
    const strs = Heal.botStrategies(id, L);
    const cell = {};
    for (const s of strs) {
      const rng = P.rng(SEED * 104729 + L * 17 + s.length);
      let won = 0;
      let taught = 0;
      for (let i = 0; i < NH; i++) {
        const r = Heal.botRun(id, L, s, rng);
        if (!r || r.total === 0) taught++;
        else if (r.win) won++;
      }
      cell[s] = taught === NH ? "taught" : won / NH;
    }
    out.heal[id][`L${L}`] = cell;
    // "reader" reads the English placeholders (every word is English until the family records it): reported, not a blind leak
    const blind = Object.entries(cell).filter(([k, x]) => k !== "fair" && k !== "reader" && typeof x === "number");
    const worst = blind.reduce((m, [k, x]) => (x > m[1] ? [k, x] : m), ["-", 0]);
    if (L === 1 && worst[1] >= 0.1) {
      problems++;
      console.log(`  !! ${id} L1 blind ${worst[0]} ${pct(worst[1], 1)} (the contract wants under 10%)`);
    }
    console.log(`  ${id} L${L}: ${Object.entries(cell).map(([k, x]) => `${k} ${typeof x === "number" ? pct(x, 1) : x}`).join(" · ")}`);
  }
}

// ---- the whole patient ----
const NP = N * 10; // the whole patient is rarer: ten times the rounds
console.log(`\n== the whole patient (every stage + the heal game; blind = random everywhere; ${NP} patients)`);
for (const L of [1, 2, 3]) {
  const cell = {};
  for (const s of ["fair", "blind"]) {
    const rng = P.rng(SEED * 15485863 + L);
    let won = 0;
    for (let i = 0; i < NP; i++) {
      const plan = P.patient(data, { rng, levels: { waiting: L, diagnosis: L, pharmacy: L, heal: L, sendoff: L }, games });
      const r = P.bot.patient(plan, s, rng, Heal);
      if (r.win) won++;
    }
    cell[s] = won / NP;
  }
  out.patient[`L${L}`] = cell;
  console.log(`  L${L}: fair ${pct(cell.fair, 1)} · blind ${(100 * cell.blind).toFixed(2)}%`);
  if (L === 1 && cell.blind >= 0.01) {
    problems++;
    console.log("  !! the level-1 patient is winnable blind 1% or more");
  }
}
// the first-ever session (one patient: W1 bench of 2, D1 taught, one item, H2 scrape, E1 taught)
{
  const rng = P.rng(SEED * 3 + 1);
  let won = 0;
  for (let i = 0; i < N; i++) {
    const m = P.morning(data, { session: 1, rng, games });
    if (P.bot.patient(m.patients[0], "blind", rng, Heal).win) won++;
  }
  out.first = won / N;
  console.log(`  first-ever session (1 patient): blind ${pct(won, N)}`);
}

const j = arg("--json", null);
if (j) fs.writeFileSync(j, JSON.stringify(out, null, 1));
console.log(problems ? `\n${problems} problem(s).` : "\nNo problems.");
process.exit(problems ? 1 : 0);
