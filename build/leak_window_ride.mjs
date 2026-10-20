#!/usr/bin/env node
// The Kutchi leak bot for the window ride (js/shared/window-ride.js; non-negotiable 6, QA LNG-02, RIDE-05): can a player who
// knows no Kutchi win the ride? Two parts:
//   1. the plan alone (fast, --rounds): each call's group of look-alikes; fair hears the word, the blind players tap everything,
//      the first or last, the middle one, at random, or wait for the glow.
//   2. the ride played (--sims rounds per level and speed): the shared model (WindowRide.model, the same rules and motion the
//      screen draws) driven at Nani's slow, normal and fast speeds held from the start (--speeds), on a phone's window and a
//      tablet's, with unasked things passing between the groups and props on the verge. The players act on what is on screen
//      when Nani asks: fair taps the named thing 1.2 s after the call (once the line is heard; a missed one when it comes
//      round); tap-all taps everything in view left to right; tap-first / tap-last / middle / random pick a thing in view;
//      look-alike picks at random among the things of the named one's family in view; wait taps the glow. A blind player
//      whose tap was wrong taps the glow next (so the ride goes on).
// A round is won when every call is tapped right first time (no help, first pass). Fair must FIND everything in every ride
// (missed things come round until found) and win every plan-level round; every blind player must win under 10% at every level
// and speed. The played rides also count the fairness rules the contracts check on screen (47, 48): no call while the named
// thing is more than two thirds hidden or has crossed half the window; a missed thing always comes round.
//   node build/leak_window_ride.mjs [--ride farm-road] [--rounds 2000] [--speeds slow,normal,fast] [--sims 150]   exit 1 on a leak
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const W = require("../js/shared/window-ride.js");

export const seeded = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** {level: {fair, blind: {strategy: winRate}, perCall: {strategy: rightRate}}} over `rounds` seeded plans per level. */
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

/** callable(thingId): can the language engine say it (as js/day/window.js asks it)? */
export async function engineCallable(ride) {
  const { createEngine, DATA_FILES } = await import("../js/core/lang/engine/index.js");
  const J = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
  const data = {};
  for (const f of DATA_FILES) data[f] = J(`data/lang/${f}.json`);
  const E = createEngine({ data, audio: J("data/family-audio.json") });
  const meaningOf = (t) => (typeof t.say === "string" ? { fn: "Item", kind: t.say } : t.say);
  return (id) => {
    const t = ride.things[id];
    try {
      return !!t && E.check(meaningOf(t)).ok;
    } catch (e) {
      return false;
    }
  };
}

/* ---------------- part 2: the ride played on the model ---------------- */
// the window's width in scene px (the opening at the shared fit) and the smallest tap box, on a phone and a tablet
export const VIEWS = { phone: { x0: 25, x1: 1575, minPx: 192 }, tablet: { x0: 157, x1: 1443, minPx: 90 } };
const REACT = 1200; // fair: the line heard, then the tap
const BLIND_REACT = 300;

const inViewThings = (m) => m.things.filter((o) => !o.got && m.share(o) >= 0.3).sort((a, b) => a.x - b.x);
export const PLAYERS = {
  fair: { onCall: (m, ev) => ({ after: REACT, pick: () => [ev.uid] }) },
  "tap-all": { onCall: (m) => ({ after: BLIND_REACT, pick: () => inViewThings(m).map((o) => o.uid) }) },
  "tap-first": { onCall: (m) => ({ after: BLIND_REACT, pick: () => inViewThings(m).slice(0, 1).map((o) => o.uid) }) },
  "tap-last": { onCall: (m) => ({ after: BLIND_REACT, pick: () => inViewThings(m).slice(-1).map((o) => o.uid) }) },
  middle: { onCall: (m) => ({ after: BLIND_REACT, pick: () => { const l = inViewThings(m); return l.length ? [l[Math.floor(l.length / 2)].uid] : []; } }) },
  random: { onCall: (m, ev, rng) => ({ after: BLIND_REACT, pick: () => { const l = inViewThings(m); return l.length ? [l[Math.floor(rng() * l.length)].uid] : []; } }) },
  "look-alike": { onCall: (m, ev, rng) => ({ after: BLIND_REACT, pick: () => { const fam = m.calls[ev.i].family; const l = inViewThings(m).filter((o) => (m.ride.things[o.id] || {}).family === fam); return l.length ? [l[Math.floor(rng() * l.length)].uid] : []; } }) },
  wait: { onCall: () => null },
};
export const BLIND_PLAYERS = Object.keys(PLAYERS).filter((k) => k !== "fair");

/** One ride played by a player at a held speed on a view: {won, found, calls, fairness: [breaks], ms} */
export function playRide(ride, plan, player, { hold = null, view = VIEWS.phone, seed = 1, maxMs = 20 * 60000, dt = 50 } = {}) {
  if (typeof W.model !== "function") throw new Error("the ride engine has no model (WindowRide.model): the ride cannot be played at its speeds");
  const rng = seeded(seed * 97 + 13);
  const m = W.model(ride, plan, { rng: seeded(seed), hold, view });
  m.ride = ride;
  const P = PLAYERS[player];
  const due = [];
  const fairness = [];
  const missedOpen = new Map();
  while (!m.done && m.t < maxMs) {
    m.step(dt);
    for (const ev of m.drain()) {
      if (ev.type === "call") {
        const th = m.things.find((o) => o.uid === ev.uid);
        const share = th ? m.share(th) : 0;
        const rel = th ? (th.x + th.w / 2 - m.view().x0) / m.view().w : 0;
        if (share < 1 / 3) fairness.push(`call ${ev.i + 1} pass ${ev.pass}: ${Math.round((1 - share) * 100)}% hidden`);
        if (rel < 0.5) fairness.push(`call ${ev.i + 1} pass ${ev.pass}: asked as it left (${Math.round(rel * 100)}% across)`);
        missedOpen.delete(ev.i);
        if (ev.glow && player !== "fair") due.push({ at: m.t + BLIND_REACT, pick: () => [ev.uid] });
        else {
          const a = P.onCall(m, ev, rng);
          if (a) due.push({ at: m.t + a.after, pick: a.pick, call: ev.i, fair: player === "fair" ? ev.uid : null });
        }
      } else if (ev.type === "glow" && player !== "fair") {
        const c = m.open();
        if (c && c.namedTh) {
          const u = c.namedTh.uid;
          due.push({ at: m.t + BLIND_REACT, pick: () => [u] });
        }
      } else if (ev.type === "pass" && ev.how === "missed") missedOpen.set(ev.i, ev.pass);
    }
    for (let k = due.length - 1; k >= 0; k--) {
      if (due[k].at > m.t) continue;
      const d = due.splice(k, 1)[0];
      // fair waits while the named thing is mostly hidden (behind a prop) and taps once it shows; it never taps a gone thing
      if (d.fair != null) {
        const th = m.things.find((o) => o.uid === d.fair);
        if (!th || th.got || !m.open() || m.open().namedTh !== th) continue;
        if (m.share(th) < 0.3) {
          due.push({ ...d, at: m.t + 100 });
          continue;
        }
      }
      for (const u of d.pick()) {
        m.tap(u);
        if (!m.open()) break;
      }
    }
  }
  for (const [i, pass] of missedOpen) fairness.push(`call ${i + 1}: missed on pass ${pass} and never came round`);
  const r = m.result();
  if (!m.done) fairness.push(`the ride did not end in ${Math.round(maxMs / 60000)} min (found ${m.found} of ${r.calls})`);
  return { won: r.won, found: r.found, calls: r.calls, right: r.right, fairness, ms: m.t };
}

/** {speed: {level: {fair: {found, won}, blind: {player: winRate}, fairness: [..], ms}}} over `sims` seeded rides each */
export function rideReport(ride, { sims = 150, speeds = ["slow", "normal", "fast"], callable, views = VIEWS } = {}) {
  const out = {};
  for (const sp of speeds) {
    out[sp] = {};
    for (const L of Object.keys(ride.levels || {})) {
      const wins = {};
      let fairFound = 0;
      let fairWon = 0;
      let ms = 0;
      let n = 0;
      const fairness = [];
      for (let s = 1; s <= sims; s++) {
        const view = Object.values(views)[s % Object.keys(views).length];
        const plan = W.plan(ride, Number(L), seeded(s * 7919 + Number(L) * 31 + sp.length), { callable });
        for (const k of Object.keys(PLAYERS)) {
          const r = playRide(ride, plan, k, { hold: sp, view, seed: s * 131 + k.length });
          if (k === "fair") {
            fairFound += r.found === r.calls ? 1 : 0;
            fairWon += r.won ? 1 : 0;
            ms += r.ms;
            n++;
          } else wins[k] = (wins[k] || 0) + (r.won ? 1 : 0);
          for (const f of r.fairness) if (fairness.length < 6) fairness.push(`${k}: ${f}`);
        }
      }
      out[sp][L] = { fair: { found: fairFound / sims, won: fairWon / sims }, blind: Object.fromEntries(BLIND_PLAYERS.map((k) => [k, (wins[k] || 0) / sims])), fairness, ms: ms / Math.max(1, n) };
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
  // the engine's sayable things, as the game decides them (js/day/window.js): a word with no Kutchi yet is never named
  const callable = await engineCallable(ride);
  let bad = 0;
  const r = leakReport(ride, { rounds: Number(arg("rounds", 2000)), callable });
  console.log(`window ride "${id}" 1. the plan: rounds won (every call right first time), per level`);
  for (const [L, x] of Object.entries(r)) {
    const blind = Object.entries(x.blind).map(([k, v]) => `${k} ${(v * 100).toFixed(1)}%`).join(", ");
    const ok = x.fair === 1 && Object.values(x.blind).every((v) => v < 0.1);
    if (!ok) bad++;
    console.log(`  L${L}: fair ${(x.fair * 100).toFixed(1)}% | blind: ${blind} ${ok ? "ok" : "FAIL"}`);
  }
  const speeds = String(arg("speeds", "slow,normal,fast")).split(",").filter(Boolean);
  let rr;
  try {
    rr = rideReport(ride, { sims: Number(arg("sims", 150)), speeds, callable });
  } catch (e) {
    console.log(`window ride "${id}" 2. the ride played: FAIL (${e.message})`);
    process.exit(1);
  }
  console.log(`window ride "${id}" 2. the ride played at each speed (phone and tablet windows, unasked things passing): fair finds everything; blind rides won`);
  for (const [sp, lv] of Object.entries(rr))
    for (const [L, x] of Object.entries(lv)) {
      const blind = Object.entries(x.blind).map(([k, v]) => `${k} ${(v * 100).toFixed(1)}%`).join(", ");
      const ok = x.fair.found === 1 && Object.values(x.blind).every((v) => v < 0.1) && !x.fairness.length;
      if (!ok) bad++;
      console.log(`  ${sp} L${L}: fair found all ${(x.fair.found * 100).toFixed(0)}% (right first time ${(x.fair.won * 100).toFixed(0)}%, ride ${(x.ms / 1000).toFixed(0)} s) | blind: ${blind}${x.fairness.length ? ` | unfair: ${x.fairness.join("; ")}` : ""} ${ok ? "ok" : "FAIL"}`);
    }
  process.exit(bad ? 1 : 0);
}
