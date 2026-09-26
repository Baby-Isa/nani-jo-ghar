#!/usr/bin/env node
/*
 * The leak bot for the clinic's healing games knee (H1), ear (H3), tooth (H4)
 * (the Sceptic as code; no browser). docs/clinic-heal-api.md: every game
 * ships a blind bot(level, rng) -> {rows, strategies, solve(strategy)}; this
 * plays the SAME plan and judge the game uses, with players that never hear.
 *
 * A round is won ("the ear star") only when every row is right. Strategies:
 *   fair         knows the words (must be 100%)
 *   reader       reads the English placeholders (sides, directions, colours,
 *                the sock), guesses only the real Kutchi: the honest number
 *                for "is this a Kutchi test yet?"
 *   blind ones   random, tray-order (one action per dish), fixed-k (always k:
 *                also "drag until the tick", since a count never ends itself),
 *                big-first / small-first / alternate (what the screen shows)
 * Pass: every blind strategy under 10% at level 1 (the contract's rule), and
 * reported for levels 2-3. The reader is reported, flagged, not gated.
 *
 * Usage: node build/leak_clinic_heal_a.mjs [--rounds 500] [--seed 1] [--json out.json]
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const N = Number(arg("--rounds", 500));
const SEED = Number(arg("--seed", 1));
const JSON_OUT = arg("--json", null);
const GAMES = ["knee", "ear", "tooth"];

function mulberry(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const out = {};
let fail = false;
for (const id of GAMES) {
  const G = require(path.join(ROOT, "js/clinic/heal/games", id + ".js"));
  out[id] = {};
  for (const level of G.levels) {
    const wins = {};
    let strategies = null;
    for (let i = 0; i < N; i++) {
      const rng = mulberry(SEED * 100003 + level * 7919 + i);
      const b = G.bot(level, rng);
      strategies = strategies || b.strategies;
      b.strategies.forEach((s) => {
        wins[s] = (wins[s] || 0) + (b.solve(s).ear ? 1 : 0);
      });
    }
    const pct = Object.fromEntries(strategies.map((s) => [s, (100 * wins[s]) / N]));
    const blind = strategies.filter((s) => s !== "fair" && s !== "reader");
    const worst = blind.reduce((a, s) => (pct[s] > pct[a] ? s : a), blind[0]);
    out[id][level] = { pct, worst, worstPct: pct[worst] };
    const ok = pct.fair === 100 && (level !== 1 || pct[worst] < 10);
    if (!ok) fail = true;
    const fmt = (x) => x.toFixed(1).padStart(5) + "%";
    console.log(
      `${id.padEnd(6)} L${level}  fair ${fmt(pct.fair)}  worst blind ${fmt(pct[worst])} (${worst})  reader ${fmt(pct.reader)}${pct.reader >= 10 ? " [placeholder rows: not yet a Kutchi test]" : ""}  ${ok ? "ok" : "FAIL"}`
    );
    console.log("          " + blind.map((s) => `${s} ${pct[s].toFixed(1)}`).join(" · "));
  }
}
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 2));
console.log(fail ? "\nFAIL: a fair bot below 100% or a level-1 blind strategy at 10% or more" : `\nPASS: fair 100% everywhere; every level-1 blind strategy under 10% (${N} rounds each)`);
process.exit(fail ? 1 : 0);
