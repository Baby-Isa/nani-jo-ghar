#!/usr/bin/env node
/*
 * The blind leak bot for heal agent C's games (docs/clinic-heal-api.md):
 * eye (H12), foot (H13) and the maybe-later extras (tummy H10, hic H15,
 * hair H16) when their files exist. Every strategy each game lists plays
 * N rounds per level through Clinic.Heal.botRun (no words understood,
 * except "fair", which must win every time). Level 1 must stay under 10%
 * for every blind strategy (the design's Sceptic rule).
 *
 *   node build/leak_clinic_heal_c.mjs            # 2000 rounds each
 *   node build/leak_clinic_heal_c.mjs --n 500 --json build/reports/clinic-heal-c-leak.json
 * Exit code 1 if a level-1 blind strategy reaches 10% or "fair" misses.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const N = Number(opt("--n", 2000));
const JSON_OUT = opt("--json", path.join(ROOT, "build", "reports", "clinic-heal-c-leak.json"));
const LIMIT = 0.1;

const Heal = require(path.join(ROOT, "js/clinic/heal/registry.js"));
const GAMES = ["eye", "foot", "tummy", "hic", "hair"];
const loaded = GAMES.filter((id) => {
  const f = path.join(ROOT, "js/clinic/heal/games", `${id}.js`);
  if (!fs.existsSync(f)) return false;
  require(f);
  return Heal.has(id);
});

let seed = 20260926;
const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const out = { n: N, limit: LIMIT, games: {} };
let bad = 0;
const rows = [];
for (const id of loaded) {
  const def = Heal.get(id);
  const problems = Heal.validate(def);
  out.games[id] = { problems, levels: {} };
  if (problems.length) {
    console.log(`${id}: contract problems: ${problems.join("; ")}`);
    bad++;
  }
  for (const level of def.levels || [1, 2, 3]) {
    const strategies = Heal.botStrategies(id, level);
    const lv = (out.games[id].levels[level] = {});
    for (const s of strategies) {
      let wins = 0;
      let share = 0;
      for (let i = 0; i < N; i++) {
        const r = Heal.botRun(id, level, s, rng);
        if (r.win) wins++;
        share += r.total ? r.right / r.total : 0;
      }
      const win = wins / N;
      lv[s] = { win: +win.toFixed(4), rows: +(share / N).toFixed(3) };
      let flag = "";
      if (s === "fair" && win < 1) (flag = "  <-- fair must win 100%"), bad++;
      if (s !== "fair" && level === 1 && win >= LIMIT) (flag = "  <-- LEAK (level 1 >= 10%)"), bad++;
      rows.push(`${id.padEnd(6)} L${level}  ${s.padEnd(10)} win ${(win * 100).toFixed(2).padStart(6)}%   rows right ${((share / N) * 100).toFixed(1).padStart(5)}%${flag}`);
    }
  }
}
console.log(`Clinic heal C leak bot: ${N} blind rounds per game, level and strategy\n`);
console.log(rows.join("\n"));
fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`\n${bad ? `${bad} problem(s)` : "OK: every level 1 under 10%, fair 100%"} (${path.relative(ROOT, JSON_OUT)})`);
process.exit(bad ? 1 : 0);
