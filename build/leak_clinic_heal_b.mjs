#!/usr/bin/env node
/*
 * The leak bot for healing-game agent B's games: taste (H5), fever (H6),
 * boing (H9). The Sceptic as code (docs/modes/clinic-design.md Q6, the
 * contract's "The Kutchi decides" rule): each game's bot(level, rng) plays
 * the SAME model the browser game plays, with strategies that see only
 * what's on screen (pictures, the order of dishes and pills, which card
 * line is current, what they already tried), never the words.
 *
 * Pass: "fair" wins 100% at every level; every other strategy wins under
 * 10% at level 1 (a win = every scored row right, what the ear star needs).
 * Level 1 runs more rounds (--l1 5000) so a true 8% can't read as 10% by
 * sampling noise.
 *
 * Usage: node build/leak_clinic_heal_b.mjs [--rounds 1000] [--l1 5000] [--seed 1] [--json out.json]
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const Heal = require(path.join(ROOT, "js/clinic/heal/registry.js"));
const GAMES = ["taste", "fever", "boing"];
GAMES.forEach((id) => require(path.join(ROOT, `js/clinic/heal/games/${id}.js`)));

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const ROUNDS = Number(arg("--rounds", 1000));
const L1 = Number(arg("--l1", 5000));
const SEED = Number(arg("--seed", 1));
const JSON_OUT = arg("--json", null);

function rngFrom(seed) {
  let a = seed >>> 0 || 0x9e3779b9;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const out = { seed: SEED, rounds: ROUNDS, l1Rounds: L1, games: {} };
const fails = [];
const pct = (x) => `${(100 * x).toFixed(1)}%`.padStart(7);
for (const id of GAMES) {
  const def = Heal.get(id);
  if (!def) {
    fails.push(`${id}: not registered`);
    continue;
  }
  if (def.problems && def.problems.length) fails.push(`${id}: contract: ${def.problems.join("; ")}`);
  out.games[id] = {};
  console.log(`\n${id} (${def.part}; gestures ${def.gestures.join(", ")})`);
  for (const level of def.levels) {
    const strategies = Heal.botStrategies(id, level);
    const n = level === 1 ? L1 : ROUNDS;
    const rng = rngFrom(SEED * 1000 + level);
    const row = {};
    let rowsSeen = 0;
    let placeholderRows = 0;
    for (const s of strategies) {
      let wins = 0;
      let right = 0;
      let total = 0;
      for (let i = 0; i < n; i++) {
        const r = Heal.botRun(id, level, s, rng);
        if (r.win) wins++;
        right += r.right;
        total += r.total;
      }
      row[s] = { win: wins / n, rowShare: total ? right / total : 0 };
    }
    // how many scored rows are decided by a real Kutchi word today (the rest wait for the family's words)
    const sample = def.bot(level, rng);
    (sample.rows || []).forEach((r) => {
      rowsSeen++;
      if (r.placeholder) placeholderRows++;
    });
    out.games[id][level] = { strategies: row, rows: rowsSeen, placeholderRows };
    const line = strategies.map((s) => `${s} ${pct(row[s].win)}`).join("  ");
    console.log(`  L${level} (${n} rounds, ${rowsSeen} rows, ${placeholderRows} still English)  ${line}`);
    if (!row.fair || row.fair.win < 1) fails.push(`${id} L${level}: fair wins ${pct(row.fair ? row.fair.win : 0)}, not 100%`);
    if (level === 1)
      strategies
        .filter((s) => s !== "fair")
        .forEach((s) => {
          if (row[s].win >= 0.1) fails.push(`${id} L1: ${s} wins ${pct(row[s].win)} blind (must be under 10%)`);
        });
  }
}
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1));
console.log(fails.length ? `\nFAIL\n  ${fails.join("\n  ")}` : "\nPASS: fair 100% everywhere; every blind strategy under 10% at level 1");
process.exit(fails.length ? 1 : 0);
