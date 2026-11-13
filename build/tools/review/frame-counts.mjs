#!/usr/bin/env node
/**
 * Sprint 20 (the kitchen frame, build/reports/s20-plan.md P0): the two starting numbers, printed at every step.
 *  1. per game file (js/cook/stations/*.js): code lines that read the screen or the drawing sheet themselves
 *     (Cook.view, innerWidth / innerHeight, worldToScreen / screenToWorld, the sheet's 1600 or 900);
 *  2. per shared kitchen file: code lines that name a game by its station or recipe id.
 * Comment lines are skipped. The counts may only go down (step 6 makes them blocking for the games on the frame).
 * Usage: node build/tools/review/frame-counts.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../..");
const SCREEN = /Cook\.view|innerWidth|innerHeight|worldToScreen|screenToWorld|\b1600\b|\b900\b/;
const GAMES = ["chai-tray", "chai", "daal", "dal", "corn-stall", "eggs", "baking", "corn", "chop", "daar", "samosa", "maani-line", "mishkaki-grill", "roll-tawa", "fetch", "pantry", "chaat", "sekelo", "mishkaki", "maani"];
const NAMED = new RegExp(`["'\`](${GAMES.join("|")})["'\`]`);
const SHARED = ["flow.js", "serve.js", "ui.js", "station-lib.js", "stations.js", "coach.js", "kitchen-kit.js", "zone.js"];

const code = (f) =>
  fs.readFileSync(f, "utf8").split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l));
const count = (f, re) => code(f).filter((l) => re.test(l)).length;

const dir = path.join(ROOT, "js/cook/stations");
const games = Object.fromEntries(fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort().map((f) => [f.replace(/\.js$/, ""), count(path.join(dir, f), SCREEN)]));
const shared = Object.fromEntries(SHARED.filter((f) => fs.existsSync(path.join(ROOT, "js/cook", f))).map((f) => [f, count(path.join(ROOT, "js/cook", f), NAMED)]));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ games, shared }, null, 1));
} else {
  console.log("screen or sheet reads, per game file:");
  for (const [k, v] of Object.entries(games)) console.log(`  ${k.padEnd(16)} ${v}`);
  console.log("lines naming a game, per shared kitchen file:");
  for (const [k, v] of Object.entries(shared)) console.log(`  ${k.padEnd(16)} ${v}`);
}
