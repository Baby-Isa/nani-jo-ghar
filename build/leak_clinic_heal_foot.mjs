#!/usr/bin/env node
/*
 * The blind leak bot (rule C10) for the foot, the sole (js/clinic/heal/games/foot.js; D15i). The steady-hand row is a skill row (no words in it):
 * every player gets it.
 * Every strategy the game lists plays N rounds per level through Clinic.Heal.botRun with no words understood, except
 * "fair", which must win every time. Level 1 must stay under 10% for every blind strategy.
 *   node build/leak_clinic_heal_foot.mjs [--n 2000] [--json build/reports/clinic-heal-foot-leak.json]
 * Exit code 1 if a level-1 blind strategy reaches 10% or "fair" misses.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const GAME = "foot";
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const N = Number(opt("--n", 2000));
const JSON_OUT = opt("--json", path.join(ROOT, "build", "reports", `clinic-heal-${GAME}-leak.json`));
const LIMIT = 0.1;

const Heal = require(path.join(ROOT, "js/clinic/heal/registry.js"));
require(path.join(ROOT, "js/clinic/heal/games", `${GAME}.js`));
let seed = 20261002;
const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const def = Heal.get(GAME);
const problems = Heal.validate(def);
const out = { game: GAME, n: N, limit: LIMIT, problems, levels: {} };
let bad = problems.length;
if (problems.length) console.log(`${GAME}: contract problems: ${problems.join("; ")}`);
const lines = [];
for (const level of def.levels || [1, 2, 3]) {
  const lv = (out.levels[level] = {});
  for (const s of Heal.botStrategies(GAME, level)) {
    let wins = 0;
    let share = 0;
    for (let i = 0; i < N; i++) {
      const r = Heal.botRun(GAME, level, s, rng);
      if (r.win) wins++;
      share += r.total ? r.right / r.total : 0;
    }
    const win = wins / N;
    lv[s] = { win: +win.toFixed(4), rows: +(share / N).toFixed(3) };
    let flag = "";
    if (s === "fair" && win < 1) (flag = "  <-- fair must win 100%"), bad++;
    if (s !== "fair" && level === 1 && win >= LIMIT) (flag = "  <-- LEAK (level 1 >= 10%)"), bad++;
    lines.push(`${GAME} L${level}  ${s.padEnd(13)} win ${(win * 100).toFixed(2).padStart(6)}%   rows right ${((share / N) * 100).toFixed(1).padStart(5)}%${flag}`);
  }
}
console.log(`Clinic heal leak bot, ${GAME}: ${N} blind rounds per level and strategy\n`);
console.log(lines.join("\n"));
fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`\n${bad ? `${bad} problem(s)` : "OK: every level 1 under 10%, fair 100%"} (${path.relative(ROOT, JSON_OUT)})`);
process.exit(bad ? 1 : 0);
