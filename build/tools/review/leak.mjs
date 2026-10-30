#!/usr/bin/env node
/*
 * One generic leak harness (C10, non-negotiable 6): the Sceptic as code. A bot that knows no Kutchi plays a game with strategies that see
 * only what is on screen (pictures, order, what it already tried), never the words. Pass: "fair" wins 100% at every level; every other
 * strategy wins under the limit (10%) at every level (Zafar, 14 Oct). A game needs only a small config in build/tools/review/leak-configs/<name>.json;
 * the old per-game scripts (build/leak_*.mjs) are thin wrappers that run this with their config.
 *
 *   node build/tools/review/leak.mjs <name|path.json> [--rounds 1000] [--l1 5000] [--seed 1] [--json out.json] [--save learned|new]
 *   node build/tools/review/leak.mjs --list
 *
 * The save (Sprint 11, rule 6; Zafar 21 Oct: "while supported, matching is study"): the bot plays a child whose words are past support
 * (every word at stage 3 or higher: no English on the card, from stage 4 no picture). "learned" is the default; a config's "save" or
 * --save new plays a brand-new child instead. The 10% limit is the same either way. Adapters get it as `save`
 * ({kind, stage(id) -> 1..5, learned}); a heal game's bot and a script read it as globalThis.NJG_LEAK_SAVE and the env NJG_LEAK_SAVE.
 *
 * Config: { "id": "clinic-heal-knee", "adapter": "heal-registry",
 *           "registry": "js/clinic/heal/registry.js", "load": ["js/clinic/heal/games/knee.js"], "games": ["knee"],
 *           "blindMax": 0.1, "accepted": { "knee": { "under": 0.3, "why": "..." } } }
 * A game with its own bot (Cook in a browser, the clinic pipeline, the modes' generators and chi-square checks) has a "script" config:
 *   { "id": "find", "adapter": "script", "script": "build/tools/review/leak-games/find.mjs", "args": ["--bot", "500"], "about": "..." }
 * leak.mjs runs that script with the flags after the config name (or "args" when none) and takes its output and exit code as the verdict.
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
if (a.has("list")) { for (const f of fs.readdirSync(CONF).filter((x) => x.endsWith(".json"))) { const c = JSON.parse(fs.readFileSync(path.join(CONF, f), "utf8")); console.log(`${f.replace(/\.json$/, "").padEnd(28)} ${c.adapter === "script" ? "script: " + c.about : c.games.join(", ")}${c.accepted ? "  (accepted: " + Object.keys(c.accepted).join(", ") + ")" : ""}`); } process.exit(0); }
const which = a.pos[0];
if (!which) die("Name a config (--list shows them): leak.mjs clinic-heal-cut");
const cfgPath = fs.existsSync(which) ? which : path.join(CONF, which.replace(/\.json$/, "") + ".json");
if (!fs.existsSync(cfgPath)) die(`No config ${which}. --list shows them.`);
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const require = createRequire(import.meta.url);

// ---- the save the bot plays (Sprint 11): a learned child by default ----
const SAVE_KIND = String(a.val("save", cfg.save || "learned"));
if (!["learned", "new"].includes(SAVE_KIND)) die(`--save is "learned" or "new", not ${SAVE_KIND}`);
export const LEARNED_STAGE = 3;
const SAVE = Object.freeze({ kind: SAVE_KIND, learned: SAVE_KIND === "learned", stage: () => (SAVE_KIND === "learned" ? LEARNED_STAGE : 1) });
globalThis.NJG_LEAK_SAVE = SAVE;
process.env.NJG_LEAK_SAVE = SAVE_KIND;

// ---- a game with its own bot: run its script, its output and exit code are the verdict ----
if (cfg.adapter === "script") {
  const { spawnSync } = await import("child_process");
  const rest = process.argv.slice(process.argv.indexOf(which) + 1).filter((x, i, all) => x !== "--save" && all[i - 1] !== "--save");
  console.log(`save: ${SAVE_KIND} (NJG_LEAK_SAVE)`);
  const r = spawnSync(process.execPath, [path.join(ROOT, cfg.script), ...(rest.length ? rest : cfg.args || [])], { stdio: "inherit", cwd: ROOT, env: process.env });
  process.exit(r.status === null ? 1 : r.status);
}

// ---- adapters ----
const ADAPTERS = {
  "heal-registry": (c) => {
    const Heal = require(path.join(ROOT, c.registry));
    (c.load || []).forEach((p) => require(path.join(ROOT, p)));
    return {
      games: c.games,
      def: (id) => Heal.get(id),
      strategies: (id, level) => Heal.botStrategies(id, level),
      // a game's bot reads the save as globalThis.NJG_LEAK_SAVE (Heal.botRun's signature is the registry's)
      run: (id, level, s, rng) => Heal.botRun(id, level, s, rng),
      rows: (id, level, rng) => (Heal.get(id).bot(level, rng).rows) || [],
    };
  },
};
const adapter = ADAPTERS[cfg.adapter || "heal-registry"] ? ADAPTERS[cfg.adapter || "heal-registry"](cfg) : (await import(path.join(ROOT, cfg.adapter))).default(cfg, require, { save: SAVE });

const ROUNDS = Number(a.val("rounds", 1000)), L1 = Number(a.val("l1", 5000)), SEED = Number(a.val("seed", 1)), JSON_OUT = a.val("json");
const BLIND = cfg.blindMax ?? 0.1, ACCEPTED = cfg.accepted || {};
function rngFrom(seed) {
  let s = seed >>> 0 || 0x9e3779b9;
  return function () { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const out = { seed: SEED, rounds: ROUNDS, l1Rounds: L1, save: SAVE_KIND, games: {} };
console.log(`save: ${SAVE_KIND}${SAVE.learned ? ` (every word past support: stage ${LEARNED_STAGE}+)` : " (a brand-new child)"}`);
const fails = [];
const pct = (x) => `${(100 * x).toFixed(1)}%`.padStart(7);
for (const id of adapter.games) {
  const def = adapter.def(id);
  if (!def) { fails.push(`${id}: not registered`); continue; }
  if (def.problems && def.problems.length) fails.push(`${id}: contract: ${def.problems.join("; ")}`);
  out.games[id] = {};
  console.log(`\n${id} (${def.part}; gestures ${(def.gestures || []).join(", ")})`);
  if (ACCEPTED[id]) console.log(`  ACCEPTED above ${100 * BLIND}%${ACCEPTED[id].byLevel ? ` at L${Object.keys(ACCEPTED[id].byLevel).join(", L")}` : ""}: ${ACCEPTED[id].why}`);
  for (const level of def.levels) {
    const strategies = adapter.strategies(id, level);
    const n = level === 1 ? L1 : ROUNDS;
    const rng = rngFrom(SEED * 1000 + level);
    const row = {};
    let rowsSeen = 0, placeholderRows = 0;
    for (const s of strategies) {
      let wins = 0, right = 0, total = 0;
      for (let i = 0; i < n; i++) { const r = adapter.run(id, level, s, rng, SAVE); if (r.win) wins++; right += r.right; total += r.total; }
      row[s] = { win: wins / n, rowShare: total ? right / total : 0 };
    }
    for (const r of adapter.rows(id, level, rng, SAVE)) { rowsSeen++; if (r.placeholder) placeholderRows++; }
    out.games[id][level] = { strategies: row, rows: rowsSeen, placeholderRows };
    console.log(`  L${level} (${n} rounds, ${rowsSeen} rows, ${placeholderRows} still English)  ${strategies.map((s) => `${s} ${pct(row[s].win)}`).join("  ")}`);
    if (!row.fair || row.fair.win < 1) fails.push(`${id} L${level}: fair wins ${pct(row.fair ? row.fair.win : 0)}, not 100%`);
    // every level, not only level 1 (Zafar, 14 Oct; checks-to-build 19)
    for (const s of strategies.filter((x) => x !== "fair")) {
      // (accepted.byLevel: a limit for one level alone, the rest keep theirs: Zafar's L1 ranges of 30 Oct, a count from 1-2 or 1-3, which a
      // blind first guess wins about a third of the time; L2-L4 keep the 10%)
      const acc = ACCEPTED[id];
      const lim = acc && acc.byLevel && acc.byLevel[level] != null ? acc.byLevel[level] : acc && acc.under != null ? acc.under : BLIND;
      if (!(row[s].win < lim)) fails.push(`${id} L${level}: ${s} wins ${pct(row[s].win)} blind (must be under ${pct(lim).trim()})`);
    }
  }
}
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1));
const except = Object.entries(ACCEPTED).map(([k, v]) => `${k} under ${v.under != null ? pct(v.under).trim() : ""}${v.byLevel ? Object.entries(v.byLevel).map(([l, u]) => ` L${l} ${pct(u).trim()}`).join("") : ""}`).join(", ");
console.log(fails.length ? `\nFAIL\n  ${fails.join("\n  ")}` : `\nPASS: fair 100% everywhere; every blind strategy under ${100 * BLIND}% at every level${except ? ` (except, as Zafar decided: ${except})` : ""}`);
process.exit(fails.length ? 1 : 0);
