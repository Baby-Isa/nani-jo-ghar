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
 *
 * The clinic's heal games too (clinic v2, G5): every v2 heal game (js/clinic/heal/games/<id>.js) must have
 * its "why" beat (def.why: the patient's problem and the doctor's goal) and a first-time cue with words
 * (def.cues[kind]) for every kind of step its plan can make at levels 1-3 (def.steps(level, rng), 40 seeds
 * each), and its code must show each cue (S.cue("kind", ...) or S.cue(c.kind, CUES[c.kind], ...)).
 * Tummy, hic and hair are left as they were (CQ14) and aren't checked here yet.
 */
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
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

// 4. the clinic's heal games: a why beat, and words for every step
const require = createRequire(import.meta.url);
const HEAL_V2 = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];
require(join(ROOT, "js/clinic/heal/registry.js"));
require(join(ROOT, "js/clinic/heal/scene.js"));
let healSteps = 0;
for (const id of HEAL_V2) {
  const f = join(ROOT, "js/clinic/heal/games", `${id}.js`);
  const def = require(f);
  const src = readFileSync(f, "utf8");
  if (!def.why || !String(def.why.problem || "").trim() || !String(def.why.goal || "").trim()) errors.push(`heal ${id}: no "why" beat (def.why.problem / goal)`);
  if (!/S\.why\(/.test(src)) errors.push(`heal ${id}: the code never plays its why beat (S.why)`);
  if (typeof def.steps !== "function" || !def.cues) {
    errors.push(`heal ${id}: no def.steps(level, rng) / def.cues to check`);
    continue;
  }
  const kinds = new Set();
  for (const level of [1, 2, 3]) {
    let seed = 7 + level;
    const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 40; i++) def.steps(level, rng).forEach((k) => kinds.add(k));
  }
  kinds.forEach((k) => {
    healSteps++;
    const cue = def.cues[k];
    if (!cue || !String(cue).replace(/<[^>]+>/g, "").trim()) errors.push(`heal ${id}: step "${k}" has no first-time cue with words`);
    const shown = new RegExp(`S\\.cue\\(\\s*"${k}"`).test(src) || /S\.cue\(\s*c\.kind\s*,\s*CUES\[c\.kind\]/.test(src);
    if (!shown) errors.push(`heal ${id}: the code never shows the cue for step "${k}" (S.cue("${k}", ...))`);
  });
}

const n = [...known].length;
if (errors.length) {
  console.error(`check_onboard: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log(`check_onboard: ok (${Object.keys(phases).filter((k) => !k.startsWith("_")).length} stations, ${n} phases, ${started.size} phase starts in the code, every one scripted; clinic heal: ${HEAL_V2.length} games, ${healSteps} kinds of step, each with its why beat and words)`);
