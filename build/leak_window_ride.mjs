#!/usr/bin/env node
// The Kutchi leak bot for the window ride (js/shared/window-ride.js; non-negotiable 6, QA LNG-02): can a player who knows no
// Kutchi win the ride by tapping everything, the first or last thing, the middle one, at random, or by waiting for the glow?
// A round is won when every call is tapped right first time (no help). Fair (hears the word) must win every round; every blind
// strategy must win under 10% of rounds, at every level.
//   node build/leak_window_ride.mjs [--ride farm-road] [--rounds 2000]     exit 1 on a leak
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const W = require("../js/shared/window-ride.js");

const seeded = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** {level: {fair, blind: {strategy: winRate}, perCall: {strategy: rightRate}}} over `rounds` seeded rounds per level. */
export function leakReport(ride, { rounds = 2000, plan = W.plan, callable } = {}) {
  const out = {};
  for (const L of Object.keys(ride.levels || {})) {
    const wins = {};
    const right = {};
    const calls = {};
    for (let s = 1; s <= rounds; s++) {
      const p = plan(ride, Number(L), seeded(s * 7919 + Number(L)), { callable });
      for (const k of ["fair", ...W.BLIND]) {
        const r = W.simulate(p, k, seeded(s * 31 + k.length));
        wins[k] = (wins[k] || 0) + (r.won ? 1 : 0);
        right[k] = (right[k] || 0) + r.right;
        calls[k] = (calls[k] || 0) + r.calls;
      }
    }
    out[L] = { fair: wins.fair / rounds, blind: {}, perCall: {} };
    for (const k of W.BLIND) {
      out[L].blind[k] = wins[k] / rounds;
      out[L].perCall[k] = right[k] / Math.max(1, calls[k]);
    }
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const arg = (k, d) => {
    const i = process.argv.indexOf(`--${k}`);
    return i > 0 ? process.argv[i + 1] : d;
  };
  const day = JSON.parse(readFileSync(new URL("../data/day.json", import.meta.url), "utf8"));
  const id = arg("ride", "farm-road");
  const ride = day.window.rides[id];
  const r = leakReport(ride, { rounds: Number(arg("rounds", 2000)) });
  let bad = 0;
  console.log(`window ride "${id}": rounds won (every call right first time), per level`);
  for (const [L, x] of Object.entries(r)) {
    const blind = Object.entries(x.blind).map(([k, v]) => `${k} ${(v * 100).toFixed(1)}% (${(x.perCall[k] * 100).toFixed(0)}% of calls)`).join(", ");
    const ok = x.fair === 1 && Object.values(x.blind).every((v) => v < 0.1);
    if (!ok) bad++;
    console.log(`  L${L}: fair ${(x.fair * 100).toFixed(1)}% | blind: ${blind} ${ok ? "ok" : "FAIL"}`);
  }
  process.exit(bad ? 1 : 0);
}
