// The window ride (js/shared/window-ride.js): the plan's rules and the Kutchi leak bot (non-negotiable 6): over many seeded
// rounds at every level the fair player (who hears the word) wins every round, and no blind player (tap everything, the first,
// the last, the middle, at random, or wait for the glow) wins 10% or more. A planted leak (the named thing always first) must be
// caught, so the bot is known to fail when it should (red then green). Run: node --test build/test_shared_window_ride.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { leakReport } from "./leak_window_ride.mjs";

const require = createRequire(import.meta.url);
const W = require("../js/shared/window-ride.js");
const day = JSON.parse(readFileSync(new URL("../data/day.json", import.meta.url), "utf8"));
const ride = day.window.rides["farm-road"];
const seeded = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

test("the plan: look-alikes together, one named, no thing named twice running", () => {
  for (let s = 1; s <= 200; s++) {
    const p = W.plan(ride, 1 + (s % 3), seeded(s));
    assert.ok(p.calls.length >= 3);
    p.calls.forEach((c, i) => {
      assert.ok(c.group.length >= 2, "a group is at least two look-alikes");
      assert.ok(c.group.includes(c.named));
      assert.equal(new Set(c.group.map((id) => ride.things[id].family)).size, 1, "one family per group");
      assert.ok(!c.group.some((id) => ride.things[id].scenery), "scenery is never in a group");
      if (i) assert.notEqual(c.named, p.calls[i - 1].named);
    });
  }
});

test("a thing the engine can't say is never named or grouped", () => {
  const p = W.plan(ride, 3, seeded(5), { callable: (id) => id !== "dog" });
  p.calls.forEach((c) => assert.ok(!c.group.includes("dog")));
});

test("every family member is named somewhere (no picture is safe to ignore)", () => {
  const named = new Set();
  for (let s = 1; s <= 300; s++) W.plan(ride, 2, seeded(s)).calls.forEach((c) => named.add(c.named));
  Object.entries(ride.things).filter(([, t]) => !t.scenery).forEach(([id]) => assert.ok(named.has(id), `${id} is named in some round`));
});

test("judge: right first, helped after a wrong tap or the glow, missed when never tapped", () => {
  const c = { group: ["goat", "hen", "dog"], named: "hen" };
  assert.equal(W.judge(c, [{ at: "before", i: 1 }]), "right");
  assert.equal(W.judge(c, [{ at: "before", i: 0 }, { at: "before", i: 1 }]), "helped");
  assert.equal(W.judge(c, [{ at: "glow", i: 1 }]), "helped");
  assert.equal(W.judge(c, []), "missed");
});

test("the leak bot: fair wins every round, every blind strategy under 10%, at every level", () => {
  const r = leakReport(ride, { rounds: 2000 });
  for (const L of Object.keys(r)) {
    assert.equal(r[L].fair, 1, `level ${L}: fair wins`);
    for (const [k, v] of Object.entries(r[L].blind)) assert.ok(v < 0.1, `level ${L}: ${k} wins ${(v * 100).toFixed(1)}%`);
  }
});

test("red: a planted leak (the named thing always comes first) is caught", () => {
  const leaky = (rd, level, rng) => {
    const p = W.plan(rd, level, rng);
    p.calls.forEach((c) => (c.group = [c.named, ...c.group.filter((g) => g !== c.named)]));
    return p;
  };
  const r = leakReport(ride, { rounds: 300, plan: leaky });
  assert.ok(Object.values(r).some((x) => x.blind["tap-first"] >= 0.1), "the bot must catch tap-first winning");
});
