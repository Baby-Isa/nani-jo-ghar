#!/usr/bin/env node
/*
 * First-time help for every mode: it SHOWS, it never tells (E2, E9; UX 8), and every kind of step has it.
 *
 *   node build/check_onboard.mjs                 every mode: Cook, the clinic, and every moved mode (js/<mode>/main.js)
 *   node build/check_onboard.mjs --mode cook     one mode (or a list: --mode cook,demo)
 *
 * Exit 1 on a problem. One check per mode, all on the same rules:
 *
 * ANY MOVED MODE (the mode interface, js/shared/mode.js; target-model § 6.2). Each mini-game:
 *  - declares its gestures (E13), and its first-time help is its `onboard` (a script for the shared kit,
 *    js/shared/onboard.js: [{spotlight, ghost: {gesture}, wait?}], or {phase: script}), run by ctx.onboard();
 *  - every step is a ghost-finger demo with a move the kit can show (Onboard.GESTURES), and no step carries
 *    child-facing English (no text, no words: E1);
 *  - every gesture the game declares is shown at least once (tap, drag, swipe, circle -> circle-stir);
 *  - a game with no help says why (`onboard: false` plus `onboardWhy`), e.g. it only watches;
 *  - an ADAPTER over today's code (`adapter.of`: "cook" or "clinic-heal") is checked by that code's own check
 *    below, which this run includes.
 *
 * COOK. Every phase of every Cook station has a first-time coach (29 Sept play-test, X11). Fails when:
 *  - a phase listed in data/cook.json onboard._phases (station -> the keys its coach runs under) has no
 *    script in data.onboard, or a script step isn't a move the coach can show (tap, swipe, stir, roll, hold);
 *  - a station's code starts a phase (St.begin(S, ctx, "key") or St.coach(ctx, "key")) that has no script;
 *  - a station switches its coach off for good (Coach.stop(true)) without its own first-time demo in its
 *    place (the line above says "own first-time demo"): samosa did this, so its fill, fold and fry had no help.
 *
 * THE CLINIC, the other way round from before (13g, UX 8; 30 Sept): the first-time help must SHOW, never
 * tell. A heal game fails when its help has child-facing English or uses the device voice, and passes when every
 * kind of step has a ghost-finger demo on the shared kit (see checkClinic). Tummy, hic and hair are left as they
 * were (CQ14) and aren't checked here yet.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const Onboard = require(join(ROOT, "js/shared/onboard.js"));
const MOVES_KIT = Onboard.GESTURES;
const TEXTY = /[A-Za-z]{3,}\s+[A-Za-z]{2,}/; // a phrase of English words

/** Cook: its stations' coach scripts (data/cook.json) and the phases its code starts. */
export function checkCook() {
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
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? jsFiles(join(dir, e.name)) : e.name.endsWith(".js") ? [join(dir, e.name)] : [],
    );
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
  return {
    errors,
    summary: `cook: ${Object.keys(phases || {}).filter((k) => !k.startsWith("_")).length} stations, ${n} phases, ${started.size} phase starts in the code, every one scripted`,
  };
}

/** The clinic: every v2 heal game's help shows (a ghost finger per kind of step), never tells. */
export function checkClinic() {
  const errors = [];
  // 4. the clinic (13g, UX 8, flipped 30 Sept): first-time help SHOWS, it never tells. A heal game fails when its help
  //    carries child-facing English (a cue that is text, or code that passes text to S.cue) or uses the device voice,
  //    and passes when every kind of step its plan can make (def.steps(level, rng) at levels 1-3, 40 seeds each) has a
  //    ghost-finger demo: def.cues[kind] = {gesture} with a move the shared kit can show (Onboard.GESTURES), shown by
  //    the code (S.cue("kind", ...) or S.cue(c.kind, CUES[c.kind], ...)). The why beat plays only when the game runs
  //    on its own (S.why returns in a full run: 13i), and the game starts with input live (S.begin: 13i).
  const HEAL_V2 = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];
  require(join(ROOT, "js/clinic/heal/registry.js"));
  require(join(ROOT, "js/clinic/heal/scene.js"));
  const sceneSrc = readFileSync(join(ROOT, "js/clinic/heal/scene.js"), "utf8");
  // the scene's S.cue: no words, no device voice
  const cueFn = (sceneSrc.match(/S\.cue = \([^]*?\n    \};/) || [""])[0];
  if (!cueFn) errors.push("heal scene: S.cue not found (js/clinic/heal/scene.js)");
  if (/Voice|speechSynthesis|\.tts\(|innerHTML|textContent/.test(cueFn))
    errors.push("heal scene: S.cue shows words or uses the voice (it must only run the ghost finger on the shared kit)");
  if (!/Onboard\.run\(/.test(cueFn)) errors.push("heal scene: S.cue doesn't run the shared onboarding kit (Onboard.run)");
  if (!/if \(!S\.standalone\) return;/.test(sceneSrc))
    errors.push("heal scene: S.why plays in a full run (it must only play when the game runs on its own: 13i)");
  let healSteps = 0;
  for (const id of HEAL_V2) {
    const f = join(ROOT, "js/clinic/heal/games", `${id}.js`);
    const def = require(f);
    const src = readFileSync(f, "utf8");
    if (!def.why || !String(def.why.goal || "").trim()) errors.push(`heal ${id}: no "why" beat (def.why.goal)`);
    if (!/S\.begin\(/.test(src)) errors.push(`heal ${id}: the game doesn't start with S.begin (input live at once, 13i)`);
    if (/speechSynthesis|SpeechSynthesisUtterance/.test(src)) errors.push(`heal ${id}: uses the device voice directly`);
    for (const m of src.matchAll(/S\.cue\(\s*[^,]+,\s*(["'`])/g))
      errors.push(`heal ${id}: S.cue is given text (${m[0].slice(0, 60)}...): the help shows, it never tells`);
    if (typeof def.steps !== "function" || !def.cues) {
      errors.push(`heal ${id}: no def.steps(level, rng) / def.cues to check`);
      continue;
    }
    const kinds = new Set();
    for (const level of [1, 2, 3]) {
      let seed = 7 + level;
      const rng = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let i = 0; i < 40; i++) def.steps(level, rng).forEach((k) => kinds.add(k));
    }
    kinds.forEach((k) => {
      healSteps++;
      const cue = def.cues[k];
      if (!cue || typeof cue !== "object") return errors.push(`heal ${id}: step "${k}" has no ghost-finger demo (def.cues.${k} = {gesture})`);
      if (cue.watch === true && Object.keys(cue).length === 1) return; // a step the child only watches (boing's countdown): nothing to do, nothing to demo
      if (!MOVES_KIT.includes(cue.gesture))
        errors.push(`heal ${id}: step "${k}": "${cue.gesture}" isn't a move the shared kit shows (${MOVES_KIT.join(", ")})`);
      const words = JSON.stringify(cue)
        .replace(/"(gesture|then|to|target)"/g, "")
        .replace(new RegExp(`"(${MOVES_KIT.join("|")})"`, "g"), "");
      if (TEXTY.test(words)) errors.push(`heal ${id}: step "${k}": the help carries English (${JSON.stringify(cue)})`);
      const shown = new RegExp(`S\\.cue\\(\\s*"${k}"`).test(src) || /S\.cue\(\s*c\.kind\s*,\s*CUES\[c\.kind\]/.test(src);
      if (!shown) errors.push(`heal ${id}: the code never shows the demo for step "${k}" (S.cue("${k}", ...))`);
    });
  }
  // the clinic's rooms: every first-time script is a ghost-finger demo on the shared kit (S.onboard(env, id, [{..., ghost}]))
  for (const f of readdirSync(join(ROOT, "js/clinic/stages")).filter((x) => x.endsWith(".js"))) {
    const src = readFileSync(join(ROOT, "js/clinic/stages", f), "utf8");
    for (const m of src.matchAll(/S\.onboard\(env,[^\n]*/g))
      if (!/ghost:\s*\{\s*gesture:/.test(m[0])) errors.push(`clinic ${f}: a first-time script without a ghost-finger demo: ${m[0].slice(0, 80)}`);
  }

  return {
    errors,
    summary: `clinic: ${HEAL_V2.length} heal games, ${healSteps} kinds of step, each with a ghost-finger demo, no child-facing English and no device voice in the help`,
  };
}

/* ---------------- any moved mode (the mode interface) ---------------- */

const KIT_MOVE = { tap: "tap", drag: "drag", swipe: "swipe", circle: "circle-stir" };
const ADAPTED = { cook: "cook", "clinic-heal": "clinic" };

/** A game's first-time scripts, as {phase: steps}. */
function scriptsOf(g) {
  if (Array.isArray(g.onboard)) return { [g.id]: g.onboard };
  if (g.onboard && typeof g.onboard === "object") return g.onboard;
  return null;
}

/** One moved mode: { errors, needs: [checks of the code its adapters wrap], summary }. */
export function checkMode(mode) {
  const errors = [];
  const needs = new Set();
  let shown = 0;
  for (const [key, g] of Object.entries(mode.games || {})) {
    const at = `${mode.id}/${key}`;
    if (!Array.isArray(g.gestures) || !g.gestures.length) errors.push(`${at}: no gestures declared (E13)`);
    if (g.adapter) {
      const of = ADAPTED[g.adapter.of];
      if (!of) errors.push(`${at}: an adapter over "${g.adapter.of}", which no check here knows`);
      else needs.add(of);
      continue;
    }
    const scripts = scriptsOf(g);
    if (!scripts) {
      if (g.onboard === false && g.onboardWhy && String(g.onboardWhy).trim()) continue;
      errors.push(`${at}: no first-time help (onboard: a ghost-finger script), and no onboardWhy saying why it needs none`);
      continue;
    }
    const moves = new Set();
    for (const [phase, steps] of Object.entries(scripts)) {
      if (!Array.isArray(steps) || !steps.length) {
        errors.push(`${at}: onboard "${phase}" is empty`);
        continue;
      }
      steps.forEach((st, i) => {
        const w = `${at}: onboard "${phase}" step ${i + 1}`;
        const gest = st && st.ghost && st.ghost.gesture;
        if (!gest) return errors.push(`${w}: no ghost-finger demo (ghost: {gesture})`);
        if (!MOVES_KIT.includes(gest)) errors.push(`${w}: "${gest}" isn't a move the shared kit shows (${MOVES_KIT.join(", ")})`);
        moves.add(gest);
        shown++;
        const rest = Object.assign({}, st, {
          spotlight: undefined,
          ghost: Object.assign({}, st.ghost, { from: undefined, to: undefined, gesture: undefined }),
        });
        if (["text", "say", "line", "english", "en"].some((k) => st[k] != null) || TEXTY.test(JSON.stringify(rest)))
          errors.push(`${w}: the help carries words (it shows, it never tells: E1, E2)`);
      });
    }
    (g.gestures || [])
      .filter((x) => x !== "voice")
      .forEach((x) => {
        const m = KIT_MOVE[x] || x;
        if (!moves.has(m)) errors.push(`${at}: declares "${x}" but its first-time help never shows it (${m})`);
      });
  }
  return {
    errors,
    needs: [...needs],
    summary: `${mode.id}: ${Object.keys(mode.games || {}).length} games, ${shown} demo steps${needs.size ? `, adapters checked as ${[...needs].join(" and ")}` : ""}`,
  };
}

/** The moved modes: js/<mode>/main.js. */
export async function movedModes() {
  const out = [];
  for (const d of readdirSync(join(ROOT, "js"), { withFileTypes: true })) {
    if (d.isDirectory() && existsSync(join(ROOT, "js", d.name, "main.js")))
      out.push((await import(pathToFileURL(join(ROOT, "js", d.name, "main.js")).href)).default);
  }
  return out;
}

const BUILT_IN = { cook: checkCook, clinic: checkClinic };

/** Every check asked for (default all), adapters pulling in the checks of the code they wrap. */
export async function run(only = null) {
  const modes = await movedModes();
  const want = new Set(only || Object.keys(BUILT_IN).concat(modes.map((m) => m.id)));
  const results = [];
  for (const m of modes) {
    if (!want.has(m.id)) continue;
    const r = checkMode(m);
    r.needs.forEach((x) => want.add(x));
    results.push(r);
  }
  const own = Object.entries(BUILT_IN)
    .filter(([id]) => want.has(id) && !modes.some((m) => m.id === id))
    .map(([, fn]) => fn());
  return own.concat(results);
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const i = process.argv.indexOf("--mode");
  const only = i > 0 ? process.argv[i + 1].split(",") : null;
  const results = await run(only);
  const errors = results.flatMap((r) => r.errors);
  if (errors.length) {
    console.error(`check_onboard: ${errors.length} problem(s)`);
    errors.forEach((e) => console.error("  - " + e));
    process.exit(1);
  }
  console.log(`check_onboard: ok (${results.map((r) => r.summary).join("; ")})`);
}
