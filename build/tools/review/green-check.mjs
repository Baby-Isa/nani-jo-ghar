#!/usr/bin/env node
/*
 * CK-65 (Zafar, 8 Nov: "the green zone is way too short"): corn's green window (data/stations/corn.json mechanic.levels[].greenMs,
 * carried down the levels) is at least chai's green at every level (chai's heat band over its boil rate at half speed, from
 * data/stations/chai-tray.json mechanic.levels[].heat or data/cook.json mechanics.boil.levels with the tray profile). Prints both per
 * level; exit 1 if corn is shorter anywhere. Written by s19-games (8 Nov), so its evidence spec can run as a script under build/.
 *   node build/tools/review/green-check.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/common.mjs";

const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const c = read("data/stations/corn.json").mechanic.levels;
const t = read("data/stations/chai-tray.json").mechanic.levels;
const b = read("data/cook.json").mechanics.boil.levels;
let C = {}, T = {}, B = {}, ok = true;
for (let i = 0; i < 4; i++) {
  Object.assign(C, c[i] || {});
  Object.assign(T, t[i] || {});
  Object.assign(B, b[i] || {}, (b[i] && b[i].profiles && b[i].profiles.tray) || {});
  const h = T.heat || { band: B.band, rate: B.rate };
  const g = ((h.band[1] - h.band[0]) / (h.rate * 0.5)) * 1000;
  console.log(`L${i + 1} chai ${Math.round(g)} ms, corn ${C.greenMs} ms${C.greenMs >= g ? "" : "  SHORTER"}`);
  if (!(C.greenMs >= g)) ok = false;
}
process.exit(ok ? 0 : 1);
