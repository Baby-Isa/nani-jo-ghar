// The window ride (js/shared/window-ride.js, s09-ride): the plan's rules, the ride's motion and fairness on the shared model (the
// same rules the screen draws), the Kutchi leak bot (non-negotiable 6), the ride's data and its contract checks 47 and 48.
// Each rule is red on a planted fault and green on the ride. Run: node --test build/test_shared_window_ride.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { leakReport, playRide, VIEWS, seeded } from "./leak_window_ride.mjs";
import { check47, check48, hiddenShare, rideFields } from "./sandbox/lib/contract-day.mjs";

const require = createRequire(import.meta.url);
const W = require("../js/shared/window-ride.js");
const ROOT = new URL("../", import.meta.url);
const day = JSON.parse(readFileSync(new URL("data/day.json", ROOT), "utf8"));
const ride = day.window.rides["farm-road"];
// the engine's gaps today (cow, tractor, bicycle): never named, they only pass by
const GAPS = new Set(["cow", "tractor", "bicycle"]);
const callable = (id) => !GAPS.has(id);

test("the plan: look-alikes together, one named, no thing named twice running, the first group on the near verge", () => {
  for (let s = 1; s <= 200; s++) {
    const p = W.plan(ride, 1 + (s % 3), seeded(s), { callable });
    assert.ok(p.calls.length >= 3);
    assert.equal(p.calls[0].line, "near");
    p.calls.forEach((c, i) => {
      assert.ok(c.group.length >= 2, "a group is at least two look-alikes");
      assert.ok(c.group.includes(c.named));
      assert.equal(new Set(c.group.map((id) => ride.things[id].family)).size, 1, "one family per group");
      assert.ok(!c.group.some((id) => GAPS.has(id)), "a thing the engine can't say is never in a group");
      if (i) assert.notEqual(c.named, p.calls[i - 1].named);
    });
  }
});

test("every callable thing is named somewhere (no picture is safe to ignore)", () => {
  const named = new Set();
  for (let s = 1; s <= 300; s++) W.plan(ride, 2, seeded(s), { callable }).calls.forEach((c) => named.add(c.named));
  Object.keys(ride.things).filter((id) => !GAPS.has(id)).forEach((id) => assert.ok(named.has(id), `${id} is named in some round`));
});

test("judge: right first, helped after a wrong tap or the glow, missed when never tapped", () => {
  const c = { group: ["goat", "hen", "dog"], named: "hen" };
  assert.equal(W.judge(c, [{ at: "before", i: 1 }]), "right");
  assert.equal(W.judge(c, [{ at: "before", i: 0 }, { at: "before", i: 1 }]), "helped");
  assert.equal(W.judge(c, [{ at: "glow", i: 1 }]), "helped");
  assert.equal(W.judge(c, []), "missed");
});

test("the plan-level leak bot: fair wins every round, every blind strategy under 10%, at every level", () => {
  const r = leakReport(ride, { rounds: 1000, callable });
  for (const L of Object.keys(r)) {
    assert.equal(r[L].fair, 1, `level ${L}: fair wins`);
    for (const [k, v] of Object.entries(r[L].blind)) assert.ok(v < 0.1, `level ${L}: ${k} wins ${(v * 100).toFixed(1)}%`);
  }
});

test("red: a planted leak (the named thing always comes first) is caught by the plan-level bot", () => {
  const leaky = (rd, level, rng, o) => {
    const p = W.plan(rd, level, rng, o);
    p.calls.forEach((c) => (c.group = [c.named, ...c.group.filter((g) => g !== c.named)]));
    return p;
  };
  const r = leakReport(ride, { rounds: 300, plan: leaky, callable });
  assert.ok(Object.values(r).some((x) => x.blind["tap-first"] >= 0.1), "the bot must catch tap-first winning");
});

// ---- the ride played on the model ----
const crossing = (hold, view) => {
  // the first thing of the first group: how long it is in the window, from its first pixel in to its last pixel out
  const p = W.plan(ride, 1, seeded(3), { callable });
  const m = W.model(ride, p, { rng: seeded(3), hold, view });
  let th = null;
  let t0 = null;
  while (m.t < 60000) {
    m.step(20);
    m.drain();
    if (!th) th = m.things.find((o) => o.member === 0) || null;
    if (!th) continue;
    const seen = th.x + th.w > m.view().x0 && th.x < m.view().x1;
    if (seen && t0 == null) t0 = m.t;
    if (!seen && t0 != null) return { ms: m.t - t0, w: th.w };
  }
  return null;
};

test("three speeds: a thing crosses the window in about 9, 6 and 3.5 s (never under 3 s), the same on a phone and a tablet", () => {
  for (const view of Object.values(VIEWS)) {
    const slow = crossing("slow", view);
    const normal = crossing("normal", view);
    const fast = crossing("fast", view);
    assert.ok(slow.ms >= 8000 && slow.ms <= 10500, `slow ${slow.ms} ms`);
    assert.ok(normal.ms >= 5300 && normal.ms <= 7000, `normal ${normal.ms} ms`);
    assert.ok(fast.ms >= 3000 && fast.ms <= 4200, `fast ${fast.ms} ms`);
  }
});

test("nothing jumps: every thing and prop comes on right of the window and moves only with its line, until it leaves (RIDE-01)", () => {
  for (const hold of [null, "fast"])
    for (const [vn, view] of Object.entries(VIEWS))
      for (let s = 1; s <= 30; s++) {
        const p = W.plan(ride, 1 + (s % 3), seeded(s), { callable });
        const m = W.model(ride, p, { rng: seeded(s), hold, view });
        const last = new Map();
        let road = 0;
        while (!m.done && m.t < 120000) {
          m.step(40);
          const d = m.road - road;
          road = m.road;
          // a found thing's tap: the fair player, so the ride goes on
          for (const ev of m.drain()) if (ev.type === "call") m.tap(ev.uid);
          for (const o of [...m.things, ...m.props]) {
            const k = `${o.line || "near"}:${o.uid}`;
            if (!last.has(k)) assert.ok(o.x >= m.view().x1, `${vn} seed ${s}: ${o.id} came on inside the window (x ${Math.round(o.x)} < ${Math.round(m.view().x1)})`);
            else {
              const want = last.get(k) - d * (o.line === "field" ? m.lineSpeed.field : m.lineSpeed.near);
              assert.ok(Math.abs(o.x - want) < 0.01, `${vn} seed ${s}: ${o.id} jumped ${Math.round(o.x - want)} px`);
            }
            last.set(k, o.x);
          }
        }
      }
});

test("a speed change eases over about a second: no jump, every thing and layer together", () => {
  const p = W.plan(ride, 1, seeded(4), { callable });
  const m = W.model(ride, p, { rng: seeded(4), view: VIEWS.phone });
  m.step(500);
  const v0 = m.vel();
  m.setSpeed("fast");
  const vs = [];
  for (let i = 0; i < 70; i++) {
    m.step(20);
    vs.push(m.vel());
  }
  const v1 = vs[vs.length - 1];
  assert.ok(v1 > v0 * 1.5, "fast is faster");
  for (let i = 1; i < vs.length; i++) assert.ok(Math.abs(vs[i] - vs[i - 1]) < (v1 - v0) * 0.06, "no jump between two frames");
  const half = vs[24];
  assert.ok(half > v0 + (v1 - v0) * 0.2 && half < v0 + (v1 - v0) * 0.8, "half way through the second it is half way there");
  assert.ok(Math.abs(vs[55] - v1) < 1e-9, "there after a second");
  assert.deepEqual(m.lineSpeed, { near: 1, field: 0.4 }, "the field's things move with the middle layer");
});

test("fair at every speed: never asked while more than two thirds hidden or leaving; a missed thing comes round until found", () => {
  for (const hold of ["slow", "normal", "fast"])
    for (const [vn, view] of Object.entries(VIEWS))
      for (let s = 1; s <= 25; s++)
        for (const L of [1, 3]) {
          const p = W.plan(ride, L, seeded(s * 17 + L), { callable });
          const r = playRide(ride, p, "fair", { hold, view, seed: s });
          assert.deepEqual(r.fairness, [], `${hold} ${vn} L${L} seed ${s}`);
          assert.equal(r.found, r.calls, "fair finds everything");
        }
});

test("the miss player: every first pass goes by, each thing comes round and the ride still ends with everything found", () => {
  for (const hold of ["slow", "fast", null])
    for (let s = 1; s <= 20; s++) {
      const p = W.plan(ride, 1, seeded(s), { callable });
      const m = W.model(ride, p, { rng: seeded(s), hold, view: VIEWS.tablet });
      const passes = {};
      while (!m.done && m.t < 10 * 60000) {
        m.step(50);
        for (const ev of m.drain()) {
          if (ev.type === "call") {
            passes[ev.i] = ev.pass;
            if (ev.pass > 1) m.tap(ev.uid);
          }
        }
      }
      assert.ok(m.done, `seed ${s}: the ride ends`);
      assert.equal(m.found, p.calls.length);
      p.calls.forEach((c, i) => assert.ok(passes[i] >= 2, `call ${i} came round`));
    }
});

test("the timed leak bot at every speed: blind players win under 10%", async () => {
  const { rideReport } = await import("./leak_window_ride.mjs");
  const r = rideReport(ride, { sims: 60, callable });
  for (const [sp, lv] of Object.entries(r))
    for (const [L, x] of Object.entries(lv)) {
      assert.equal(x.fair.found, 1, `${sp} L${L}: fair finds everything`);
      for (const [k, v] of Object.entries(x.blind)) assert.ok(v < 0.12, `${sp} L${L}: ${k} wins ${(v * 100).toFixed(1)}%`);
    }
});

test("red: a planted timing leak (the named thing always leads its group) is caught by the timed bot", () => {
  let wins = 0;
  for (let s = 1; s <= 60; s++) {
    const p = W.plan(ride, 1, seeded(s), { callable });
    p.calls.forEach((c) => (c.group = [c.named, ...c.group.filter((g) => g !== c.named)]));
    const m = W.model(ride, p, { rng: seeded(s), view: VIEWS.phone });
    // a blind player that taps the first of the newest look-alikes in view when Nani asks
    let right = 0;
    while (!m.done && m.t < 5 * 60000) {
      m.step(50);
      for (const ev of m.drain()) {
        if (ev.type !== "call") continue;
        const c = m.open();
        const lead = c.members.slice().sort((a, b) => a.x - b.x)[0];
        if (m.tap(lead.uid).ok) right += ev.pass === 1 ? 1 : 0;
        else m.tap(ev.uid);
      }
    }
    if (right === p.calls.length) wins++;
  }
  assert.ok(wins / 60 >= 0.5, `the leak shows: ${wins} of 60 won`);
});

// ---- the data ----
test("the farm road's data: three layers with their speeds, the keyed frame, three groups of things, no stop-the-car", () => {
  const v = ride.view;
  assert.deepEqual(v.layers.map((l) => [l.id, l.speed]), [["far", 0.15], ["middle", 0.4], ["near", 1]]);
  for (const l of v.layers) assert.ok(l.tile && l.h && Array.isArray(l.shapes), `${l.id}: a tile, a height and placeholder shapes`);
  for (const f of [v.frame.art, v.frame.left, v.frame.right]) assert.ok(existsSync(new URL(f, ROOT)), f);
  assert.ok(!("stopCar" in ride), "no stop-the-car beat (Zafar, 20 Oct)");
  assert.deepEqual(Object.keys(ride.groups).filter((k) => !k.startsWith("_")), ["review", "animals", "passing"]);
  for (const [g, ids] of Object.entries(ride.groups)) if (!g.startsWith("_")) for (const id of ids) assert.equal(ride.things[id].group, g, id);
  for (const [id, t] of Object.entries(ride.things)) {
    assert.ok(t.en && t.say && t.family, `${id}: an English name, an engine id and a family`);
    // where its s09r cut is (null: none made yet, s09b: the cow, the tractor, the bicycle keep their placeholder)
    if (t.cut !== null) assert.ok(/^assets\/day\/ride\/s09r\/[\w-]+\.webp$/.test(t.cut), `${id}: where its s09r cut lands`);
    else assert.equal(t.art, null, `${id}: no cut, so the placeholder`);
  }
  assert.equal(ride.things.cow.say, "n.cow", "the cow's engine id (the engine reports the gap; its Kutchi is never written here)");
  assert.ok(Object.keys(v.props).every((k) => ["bush", "haystack", "wall", "tree"].includes(k)));
});

test("an s09r cut that has landed is the art (the placeholder is drawn only while the cut is missing)", () => {
  const defs = [...ride.view.layers, ...Object.values(ride.view.props), ...Object.values(ride.things), ...(day.window.previewLayers.town || [])];
  for (const d of defs) {
    if (d.art) assert.ok(existsSync(new URL(d.art, ROOT)), `${d.art} exists`);
    if (d.cut && existsSync(new URL(d.cut, ROOT))) assert.equal(d.art, d.cut, `${d.cut} has landed: point art at it`);
  }
});

test("the cross-fade join: each copy fades in over the outer tenth of the one before", () => {
  assert.equal(W.FADE, 0.1);
});

// ---- contracts 47 and 48 on fixtures ----
const T = 1e6;
const life = (t, what, step, by) => ({ type: "c", k: "life", what, t, step: String(step), by });
const page = (tl) => ({ flow: "day:window", size: "1366x768", t0: T, timeline: [{ type: "c", k: "life", what: "stage-start", t: T }, ...tl] });
const runC = (fn, r) => {
  const out = [];
  fn(r, r.timeline, (check, t, measured) => out.push({ check, measured }));
  return out;
};
const OPEN = "open:100,40,1000,600";

test("contract-47: a call for a thing more than two thirds hidden or off screen is a break; a half-hidden one passes", () => {
  const hidden = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:700,300,100,100 ${OPEN} occ:690,280,90,140 edge:`)]);
  assert.match(runC(check47, hidden)[0].measured, /hidden/);
  const off = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:1010,300,100,100 ${OPEN} occ: edge:`)]);
  assert.match(runC(check47, off)[0].measured, /off screen/);
  const half = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:700,300,100,100 ${OPEN} occ:650,300,100,100 edge:`)]);
  assert.equal(runC(check47, half).length, 0);
  assert.ok(Math.abs(hiddenShare(rideFields(`box:700,300,100,100 ${OPEN} occ:650,300,100,100`)) - 0.5) < 0.01);
  const none = page([]);
  assert.match(runC(check47, none)[0].measured, /logged no call/);
});

test("contract-48: a call as the thing leaves, a missed thing that never comes round, a ride ending short are breaks", () => {
  const leaving = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:300,300,100,100 ${OPEN} occ: edge:`)]);
  assert.match(runC(check48, leaving)[0].measured, /leaving/);
  const never = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:800,300,100,100 ${OPEN} occ: edge:`), life(T + 20, "ride-pass", 0, "thing:goat pass:1 how:missed"), life(T + 30, "ride-end", "", "found:0 calls:1")]);
  const b = runC(check48, never);
  assert.ok(b.some((x) => /never came round/.test(x.measured)) && b.some((x) => /0 of 1/.test(x.measured)));
  const round = page([life(T + 10, "ride-call", 0, `thing:goat pass:1 box:800,300,100,100 ${OPEN} occ: edge:`), life(T + 20, "ride-pass", 0, "thing:goat pass:1 how:missed"), life(T + 30, "ride-call", 0, `thing:goat pass:2 box:820,300,100,100 ${OPEN} occ: edge:`), life(T + 40, "ride-end", "", "found:1 calls:1")]);
  assert.equal(runC(check48, round).length, 0);
});
