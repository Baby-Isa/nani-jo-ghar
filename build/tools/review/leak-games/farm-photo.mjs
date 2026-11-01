#!/usr/bin/env node
/*
 * The photo shoot's Node leak bot (no browser; js/farm/photo.js, a rapid prototype). It deals real rounds from data/farm/photo.json with
 * the game's own pure parts (drawAsks, placeThings, centred, clampCam) and plays them blind, as a child who doesn't know the words:
 *   fair      aims at each asked thing in turn (must win every round: every ask has its thing, and it can be centred)
 *   animals   shoots a random thing in the scene each time (it knows it's an animal shoot, not which animal): the eliminating leak
 *   sweep     shoots at random places along the field (fishing with the camera)
 * A round "wins" when it would count towards moving up: every card right first time (Zafar, 1 Nov: a plain row never climbs).
 * Exit 1 if the fair bot ever fails, or a blind strategy wins 10% of rounds or more from L2 (L1: supported, the pictures on the
 * cards, its allowance is 1 in 4 as the older design's L1).
 *   node build/tools/review/leak-games/farm-photo.mjs [--rounds 2000]
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const { drawAsks, placeThings, centred, clampCam } = await import(pathToFileURL(join(ROOT, "js/farm/photo.js")).href);
const D = JSON.parse(readFileSync(join(ROOT, "data/farm/photo.json"), "utf8"));
const argv = process.argv.slice(2);
const N = Number(argv[argv.indexOf("--rounds") + 1]) || 2000;

let seed = 12345;
const rng = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 4294967296);

function round(lv, strategy) {
  const L = D.levels[lv];
  const asks = drawAsks(L, rng).map((w) => ({ w, done: false, miss: false }));
  const things = placeThings(D, L, rng);
  const vw = D.scene.w * L.frame;
  const vh = (vw * 3) / 4;
  const look = (x, y) => Object.assign(clampCam({ x, y }, { w: vw, h: vh }, D.scene), { w: vw, h: vh });
  let shots = 0;
  while (asks.some((a) => !a.done) && shots++ < 60) {
    const open = asks.find((a) => !a.done);
    let v;
    if (strategy === "fair") {
      const t = things.find((x) => x.word === open.w);
      v = look((t.box.x0 + t.box.x1) / 2, (t.box.y0 + t.box.y1) / 2);
    } else if (strategy === "animals") {
      const t = things[Math.floor(rng() * things.length)];
      v = look((t.box.x0 + t.box.x1) / 2, (t.box.y0 + t.box.y1) / 2);
    } else v = look(rng() * D.scene.w, (L.camY || 650) + (rng() - 0.5) * 300);
    const hit = asks.find((a) => !a.done && things.some((t) => t.word === a.w && centred(t.box, v)));
    if (hit) hit.done = true;
    else open.miss = true;
  }
  return { win: asks.every((a) => a.done && !a.miss), done: asks.every((a) => a.done) };
}

let bad = 0;
const lines = [];
for (const lv of Object.keys(D.levels)) {
  const row = [];
  for (const s of ["fair", "animals", "sweep"]) {
    let wins = 0;
    let done = 0;
    for (let i = 0; i < N; i++) {
      const r = round(lv, s);
      wins += r.win;
      done += r.done;
    }
    const pct = (100 * wins) / N;
    const cap = lv === "1" ? 25 : 10;
    const fail = s === "fair" ? wins < N : pct >= cap;
    if (fail) bad++;
    row.push(`${s} ${pct.toFixed(1)}%${s === "fair" ? "" : ` (cap ${cap}%)`}${fail ? " FAIL" : ""}`);
  }
  lines.push(`L${lv}: ${row.join(", ")}`);
}
console.log(`photo shoot leak bot, ${N} rounds a strategy and level (wins = every card right first time)\n${lines.join("\n")}`);
process.exit(bad ? 1 : 0);
