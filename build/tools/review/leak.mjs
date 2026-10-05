#!/usr/bin/env node
/*
 * One generic leak harness (C10, non-negotiable 6): the Sceptic as code. A bot that knows no Kutchi plays a game with strategies that see
 * only what is on screen (pictures, order, what it already tried), never the words. Pass: "fair" wins 100% at every level; every other
 * strategy wins under the limit (10%) at level 1. A game needs only a small config in build/tools/review/leak-configs/<name>.json;
 * the old per-game scripts (build/leak_*.mjs) stay as they are.
 *
 *   node build/tools/review/leak.mjs <name|path.json> [--rounds 1000] [--l1 5000] [--seed 1] [--json out.json]
 *   node build/tools/review/leak.mjs --list
 *
 * Config: { "id": "clinic-heal-knee", "adapter": "heal-registry",
 *           "registry": "js/clinic/heal/registry.js", "load": ["js/clinic/heal/games/knee.js"], "games": ["knee"],
 *           "blindMax": 0.1, "accepted": { "knee": { "under": 0.3, "why": "..." } } }
 * Adapters (the small contract a game's bot has to give): "heal-registry" is built in. Another game names its own module:
 *   "adapter": "path/to/adapter.mjs" exporting default (config, require) => { games, def(id) -> {levels, problems?, part?, gestures?},
 *   strategies(id, level), run(id, level, strategy, rng) -> {win, right, total}, rows(id, level, rng) -> [{placeholder?}] }.
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { args, help, ROOT, TOOLS, die } from "./lib/common.mjs";

const HELP = fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0].replace(/^[\s\S]*?\/\*\n?/, "").replace(/^ \* ?/gm, "");
const a = args(); help(HELP, a);
const CONF = path.join(TOOLS, "leak-configs");
if (a.has("list")) { for (const f of fs.readdirSync(CONF).filter((x) => x.endsWith(".json"))) { const c = JSON.parse(fs.readFileSync(path.join(CONF, f), "utf8")); console.log(`${f.replace(/\.json$/, "").padEnd(28)} ${c.games.join(", ")}${c.accepted ? "  (accepted: " + Object.keys(c.accepted).join(", ") + ")" : ""}`); } process.exit(0); }
const which = a.pos[0];
if (!which) die("Name a config (--list shows them): leak.mjs clinic-heal-cut");
const cfgPath = fs.existsSync(which) ? which : path.join(CONF, which.replace(/\.json$/, "") + ".json");
if (!fs.existsSync(cfgPath)) die(`No config ${which}. --list shows them.`);
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const require = createRequire(import.meta.url);

// ---- adapters ----
const ADAPTERS = {
  "heal-registry": (c) => {
    const Heal = require(path.join(ROOT, c.registry));
    (c.load || []).forEach((p) => require(path.join(ROOT, p)));
    return {
      games: c.games,
      def: (id) => Heal.get(id),
      strategies: (id, level) => Heal.botStrategies(id, level),
      run: (id, level, s, rng) => Heal.botRun(id, level, s, rng),
      rows: (id, level, rng) => (Heal.get(id).bot(level, rng).rows) || [],
    };
  },
};
const adapter = ADAPTERS[cfg.adapter || "heal-registry"] ? ADAPTERS[cfg.adapter || "heal-registry"](cfg) : (await import(path.join(ROOT, cfg.adapter))).default(cfg, require);

const ROUNDS = Number(a.val("rounds", 1000)), L1 = Number(a.val("l1", 5000)), SEED = Number(a.val("seed", 1)), JSON_OUT = a.val("json");
const BLIND = cfg.blindMax ?? 0.1, ACCEPTED = cfg.accepted || {};
function rngFrom(seed) {
  let s = seed >>> 0 || 0x9e3779b9;
  return function () { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const out = { seed: SEED, rounds: ROUNDS, l1Rounds: L1, games: {} };
const fails = [];
const pct = (x) => `${(100 * x).toFixed(1)}%`.padStart(7);
for (const id of adapter.games) {
  const def = adapter.def(id);
  if (!def) { fails.push(`${id}: not registered`); continue; }
  if (def.problems && def.problems.length) fails.push(`${id}: contract: ${def.problems.join("; ")}`);
  out.games[id] = {};
  console.log(`\n${id} (${def.part}; gestures ${(def.gestures || []).join(", ")})`);
  if (ACCEPTED[id]) console.log(`  ACCEPTED above ${100 * BLIND}% at level 1: ${ACCEPTED[id].why}`);
  for (const level of def.levels) {
    const strategies = adapter.strategies(id, level);
    const n = level === 1 ? L1 : ROUNDS;
    const rng = rngFrom(SEED * 1000 + level);
    const row = {};
    let rowsSeen = 0, placeholderRows = 0;
    for (const s of strategies) {
      let wins = 0, right = 0, total = 0;
      for (let i = 0; i < n; i++) { const r = adapter.run(id, level, s, rng); if (r.win) wins++; right += r.right; total += r.total; }
      row[s] = { win: wins / n, rowShare: total ? right / total : 0 };
    }
    for (const r of adapter.rows(id, level, rng)) { rowsSeen++; if (r.placeholder) placeholderRows++; }
    out.games[id][level] = { strategies: row, rows: rowsSeen, placeholderRows };
    console.log(`  L${level} (${n} rounds, ${rowsSeen} rows, ${placeholderRows} still English)  ${strategies.map((s) => `${s} ${pct(row[s].win)}`).join("  ")}`);
    if (!row.fair || row.fair.win < 1) fails.push(`${id} L${level}: fair wins ${pct(row.fair ? row.fair.win : 0)}, not 100%`);
    if (level === 1) for (const s of strategies.filter((x) => x !== "fair")) {
      const lim = ACCEPTED[id] ? ACCEPTED[id].under : BLIND;
      if (!(row[s].win < lim)) fails.push(`${id} L1: ${s} wins ${pct(row[s].win)} blind (must be under ${pct(lim).trim()})`);
    }
  }
}
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1));
const except = Object.entries(ACCEPTED).map(([k, v]) => `${k} under ${pct(v.under).trim()}`).join(", ");
console.log(fails.length ? `\nFAIL\n  ${fails.join("\n  ")}` : `\nPASS: fair 100% everywhere; every blind strategy under ${100 * BLIND}% at level 1${except ? ` (except, as Zafar decided: ${except})` : ""}`);
process.exit(fails.length ? 1 : 0);
