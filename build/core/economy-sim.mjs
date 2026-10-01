#!/usr/bin/env node
// The pocket-money simulation (decision 10): simulated children at three skill levels play rounds, are paid by
// js/core/wallet.js's payFor() with data/economy.json, and buy the cheapest upgrade they can afford as soon as
// they can. It prints how many rounds ("games": one order or one patient, ending in the end screen) pass between
// one upgrade and the next. Target: about every 2-3 games at first, stretching to every 4-5.
//   node build/core/economy-sim.mjs [--runs 300] [--rounds 90] [--json]
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { payFor, shopItems } from "../../js/core/wallet.js";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const economy = JSON.parse(readFileSync(ROOT + "data/economy.json", "utf8"));
const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(k) ? +argv[argv.indexOf(k) + 1] : d);
const RUNS = opt("--runs", 300);
const ROUNDS = opt("--rounds", 90);

// a seeded random (mulberry32), so the table is the same every run
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// three children. acc: chance each row is right; hint: chance of each of up to 3 bulbs; best: chance of a new best;
// levelEvery: rounds before the level goes up (max 4); speak: chance a spoken reply is right (from level 2)
export const PROFILES = {
  learning: { acc: 0.65, hint: 0.35, best: 0.15, mid: 0.45, levelEvery: 14, speak: 0.5 },
  steady: { acc: 0.82, hint: 0.2, best: 0.25, mid: 0.5, levelEvery: 10, speak: 0.7 },
  strong: { acc: 0.95, hint: 0.06, best: 0.35, mid: 0.5, levelEvery: 7, speak: 0.9 },
};
// rows in a round by level (an order's rows; a patient's tested rows are similar)
const TASKS = { 1: [3, 4], 2: [3, 5], 3: [4, 6], 4: [5, 7] };

function simulate(profile, seed) {
  const r = rng(seed);
  const items = shopItems(economy).slice().sort((a, b) => a.price - b.price);
  let coins = 0;
  const owned = new Set();
  const buys = []; // round number of each purchase
  const seenLevel = new Set();
  let paid = 0;
  for (let n = 1; n <= ROUNDS; n++) {
    const level = Math.min(4, 1 + Math.floor((n - 1) / profile.levelEvery));
    const [lo, hi] = TASKS[level];
    const total = lo + Math.floor(r() * (hi - lo + 1));
    let right = 0;
    for (let i = 0; i < total; i++) if (r() < profile.acc) right++;
    let hints = 0;
    for (let i = 0; i < 3; i++) if (r() < profile.hint) hints++;
    const first = !seenLevel.has(level);
    seenLevel.add(level);
    const x = r();
    const timeTier = first || x < profile.best ? "gold" : x < profile.best + profile.mid ? "mid" : "plain";
    const spoken = level >= 2 ? { total: 1, ok: r() < profile.speak ? 1 : 0 } : { total: 0, ok: 0 };
    const pay = payFor({ mode: "cook", level, tasks: total, right, total, hints, timeTier, spoken }, economy).coins;
    coins += pay;
    paid += pay;
    // buy the cheapest thing that's affordable, as soon as it is (one a round)
    const next = items.find((it) => !owned.has(it.id));
    if (next && coins >= next.price) {
      coins -= next.price;
      owned.add(next.id);
      buys.push(n);
    }
  }
  return { buys, paid };
}

const out = {};
for (const [name, p] of Object.entries(PROFILES)) {
  const gaps = [];
  let paid = 0;
  for (let s = 0; s < RUNS; s++) {
    const { buys, paid: pd } = simulate(p, 1000 + s);
    paid += pd;
    buys.forEach((b, i) => (gaps[i] = gaps[i] || []).push(i ? b - buys[i - 1] : b));
  }
  out[name] = { perRound: +(paid / RUNS / ROUNDS).toFixed(1), gaps: gaps.map((g) => ({ n: g.length, mean: +(g.reduce((a, b) => a + b, 0) / g.length).toFixed(1) })) };
}

if (argv.includes("--json")) console.log(JSON.stringify(out, null, 1));
else {
  const items = shopItems(economy).slice().sort((a, b) => a.price - b.price);
  console.log(`Pocket money simulation: ${RUNS} children per profile, ${ROUNDS} rounds each (data/economy.json v${economy.version}).`);
  console.log(`Rounds since the previous upgrade (mean), upgrades bought cheapest first:\n`);
  console.log(`| # | upgrade | price | ${Object.keys(out).map((k) => `${k}`).join(" | ")} |`);
  console.log(`|---|---|---|${Object.keys(out).map(() => "---").join("|")}|`);
  items.forEach((it, i) => console.log(`| ${i + 1} | ${it.id} (${it.tier}) | ${it.price} | ${Object.values(out).map((o) => (o.gaps[i] ? `${o.gaps[i].mean}${o.gaps[i].n < RUNS ? ` (${Math.round((100 * o.gaps[i].n) / RUNS)}% get it)` : ""}` : "-")).join(" | ")} |`));
  console.log(`| | coins per round | | ${Object.values(out).map((o) => o.perRound).join(" | ")} |`);
}
