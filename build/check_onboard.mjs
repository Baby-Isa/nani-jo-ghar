#!/usr/bin/env node
/*
 * Every phase of every Cook station has a first-time coach (29 Sept play-test, X11).
 *
 *   node build/check_onboard.mjs
 *
 * Fails (exit 1) when:
 *  - a phase listed in data/cook.json onboard._phases (station -> the keys its coach runs under) has no
 *    script in data.onboard, or a script step isn't a move the coach can show (tap, swipe, stir, roll, hold);
 *  - a station's code starts a phase (St.begin(S, ctx, "key") or St.coach(ctx, "key")) that has no script;
 *  - a station switches its coach off for good (Coach.stop(true)) without its own first-time demo in its
 *    place (the line above says "own first-time demo"): samosa did this, so its fill, fold and fry had no help.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(ROOT, "data/cook.json"), "utf8"));
const onboard = data.onboard || {};
const MOVES = ["tap", "swipe", "stir", "roll", "hold"];
const errors = [];

function scriptProblems(key) {
  const s = onboard[key];
  if (!Array.isArray(s) || !s.length) return [`no onboard script "${key}"`];
  const out = [];
  s.forEach((st, i) => {
    if (!MOVES.includes(st.do)) out.push(`"${key}" step ${i + 1}: "${st.do}" isn't a move the coach shows (${MOVES.join(", ")})`);
    if (!st.what || !String(st.what).trim()) out.push(`"${key}" step ${i + 1}: no "what"`);
  });
  return out;
}

// 1. the declared phases
const phases = onboard._phases;
if (!phases || typeof phases !== "object") errors.push("data/cook.json onboard._phases is missing");
const known = new Set();
for (const [station, keys] of Object.entries(phases || {})) {
  if (station.startsWith("_")) continue;
  if (!Array.isArray(keys) || !keys.length) {
    errors.push(`${station}: no phases listed`);
    continue;
  }
  keys.forEach((k) => {
    known.add(k);
    scriptProblems(k).forEach((p) => errors.push(`${station}: ${p}`));
  });
}

// 2. the phases the code really starts, and 3. coaches switched off for good
function jsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? jsFiles(join(dir, e.name)) : e.name.endsWith(".js") ? [join(dir, e.name)] : []));
}
const started = new Map();
for (const f of jsFiles(join(ROOT, "js/cook"))) {
  const rel = relative(ROOT, f);
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/\b(?:St\.begin|begin)\(\s*S\s*,\s*ctx\s*,\s*"([^"]+)"|\bSt\.coach\(\s*ctx\s*,\s*"([^"]+)"/g)) {
      const key = m[1] || m[2];
      if (!started.has(key)) started.set(key, `${rel}:${i + 1}`);
    }
    if (/Coach\.stop\(\s*true\s*\)/.test(line) && !/own first-time demo/.test(lines[i - 1] || "") && !/own first-time demo/.test(line)) {
      errors.push(`${rel}:${i + 1}: Coach.stop(true) switches the first-time coach off with no demo of its own in its place`);
    }
  });
}
for (const [key, where] of started) {
  scriptProblems(key).forEach((p) => errors.push(`${where}: starts phase "${key}": ${p}`));
}

const n = [...known].length;
if (errors.length) {
  console.error(`check_onboard: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log(`check_onboard: ok (${Object.keys(phases).filter((k) => !k.startsWith("_")).length} stations, ${n} phases, ${started.size} phase starts in the code, every one scripted)`);
