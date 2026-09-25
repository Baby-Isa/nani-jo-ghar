// Node tests for the shared UI's pure parts: the end-of-round badges
// (js/shared/results.js: tiers, best-time logic and storage, the star
// mapping), the onboarding script runner (js/shared/onboard.js: the state
// machine, validation, the ghost paths) and the per-profile store
// (js/shared/uistore.js: a profile attached through Progress wins over the
// fallback). No browser.
// Run: node --test build/test_shared_ui.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const UIStore = require("../js/shared/uistore.js");
const Results = require("../js/shared/results.js");
const Onboard = require("../js/shared/onboard.js");
const Stars = require("../js/shared/stars.js");
Stars.load(require("../data/shared/stars.json"));

test("badge tiers: accuracy and hints", () => {
  assert.equal(Results.accuracyTier(5, 5), "gold");
  assert.equal(Results.accuracyTier(4, 5), "mid");
  assert.equal(Results.accuracyTier(3, 5), "mid", "60% is middling");
  assert.equal(Results.accuracyTier(2, 5), "plain");
  assert.equal(Results.accuracyTier(0, 0), "none", "nothing asked");
  assert.equal(Results.hintTier(0), "gold");
  assert.equal(Results.hintTier(1), "mid");
  assert.equal(Results.hintTier(2), "plain");
  assert.equal(Results.hintTier(7), "plain");
  const b = Results.badges({ right: 9, total: 5, hints: 0, timeMs: 12000 }, null);
  assert.equal(b.accuracy.right, 5, "right is clamped to total");
  assert.equal(b.accuracy.wrong, 0);
  assert.equal(Results.badges({ right: 1, total: 2 }).time, null, "no time: no time badge");
});

test("time: seconds, clock and the best-time rule", () => {
  assert.equal(Results.seconds(12499), 12);
  assert.equal(Results.clock(42400), "42");
  assert.equal(Results.clock(65000), "1:05");
  const first = Results.judgeTime(40000, null);
  assert.ok(first.first && !first.newBest && first.changed && first.bestMs === 40000, "the first time is the best, quietly");
  const faster = Results.judgeTime(38000, 40000);
  assert.ok(faster.newBest && faster.tier === "gold" && faster.bestMs === 38000);
  const sameSecond = Results.judgeTime(39800, 40100);
  assert.ok(!sameSecond.newBest && sameSecond.changed && sameSecond.bestMs === 39800, "faster in ms but the same shown second: stored, no fanfare");
  const slower = Results.judgeTime(45000, 40000);
  assert.ok(!slower.newBest && !slower.changed && slower.bestMs === 40000 && slower.tier === "mid", "slower is never shamed");
});

test("bests are per profile, per mode + game + level", () => {
  UIStore.use(UIStore.memory());
  assert.equal(Results.bestKey("cook", "grill", 2), "cook/grill/L2");
  assert.equal(Results.recordTime("cook", "grill", 1, 30000).first, true);
  assert.equal(Results.recordTime("cook", "grill", 1, 25000).newBest, true);
  assert.equal(Results.recordTime("cook", "grill", 1, 26000).newBest, false);
  assert.equal(Results.best("cook", "grill", 1), 25000);
  assert.equal(Results.recordTime("cook", "grill", 2, 50000).first, true, "another level has its own best");
  assert.equal(Results.recordTime("cook", "chai", 1, 50000).first, true, "another game has its own best");
  assert.equal(Results.recordTime("snap", "grill", 1, 50000).first, true, "another mode has its own best");
  UIStore.use(null);
});

test("store: an attached profile (js/progress.js) holds it and is persisted through onChange", () => {
  const saved = [];
  const profile = { id: "p_test", words: {} };
  globalThis.Progress = { _profile: profile, _persist() { saved.push(JSON.parse(JSON.stringify(this._profile))); } };
  // uistore reads root.Progress: in Node root is module scope, so plug the same backend in by hand
  const P = globalThis.Progress;
  UIStore.use({ kind: "profile", read: () => (P._profile.shared_ui = P._profile.shared_ui || {}), write: (d) => { P._profile.shared_ui = d; P._persist(); } });
  Results.recordTime("find", "list", 1, 20000);
  assert.equal(profile.shared_ui.bests["find/list/L1"], 20000);
  assert.equal(saved.length, 1);
  UIStore.set("onboarded", "cook/chai", true);
  assert.equal(profile.shared_ui.onboarded["cook/chai"], true);
  UIStore.use(null);
  delete globalThis.Progress;
  // with no profile, the fallback works in memory even with no localStorage
  assert.equal(UIStore.kind(), "fallback");
  UIStore.set("x", "y", 1);
  assert.equal(UIStore.get("x", "y"), 1);
});

test("stars mapping: badges <-> the existing stars", () => {
  assert.deepEqual(Results.toStars({ right: 5, total: 5, hints: 0 }), { ear: true, hand: true, third: true });
  assert.deepEqual(Results.toStars({ right: 4, total: 5, hints: 1, hand: false }), { ear: false, hand: false, third: false });
  // with rows, the mode's ear rule decides (Monsoon: 80% over >= 6)
  const rows = "111110".split("").map((c, i) => ({ word: `w${i}`, ok: c === "1" }));
  assert.equal(Results.toStars({ right: 5, total: 6, rows, mode: "monsoon" }).ear, true);
  assert.equal(Results.toStars({ right: 5, total: 6, rows, mode: "cook" }).ear, false);
  // stars -> badges: tiers agree with the stars
  for (const ear of [true, false])
    for (const third of [true, false]) {
      const r = Results.fromStars({ ear, hand: true, third });
      assert.equal(Results.accuracyTier(r.right, r.total) === "gold", ear);
      assert.equal(Results.hintTier(r.hints) === "gold", third);
      assert.deepEqual(Results.toStars(r), { ear, hand: true, third });
    }
  assert.deepEqual(Results.fromStars({ ear: true, third: false }, { help: 3, total: 4 }), { right: 4, total: 4, hints: 3 });
});

const SCRIPT = [
  { spotlight: "#jug", ghost: { gesture: "tap" } },
  { spotlight: ["#jug", "#pan"], ghost: { from: "#jug", to: "#pan", gesture: "drag" }, wait: "pour-done" },
  { spotlight: "#pan", wait: "stirred" },
];

test("onboard: the script runner's state machine", () => {
  const m = Onboard.machine(SCRIPT);
  assert.equal(m.state().phase, "idle");
  assert.deepEqual([m.start().phase, m.state().index], ["show", 0]);
  assert.equal(m.signal("pour-done"), false, "the wrong signal does nothing");
  assert.equal(m.ghostDone().phase, "wait");
  assert.equal(m.idle().phase, "show", "idle replays the ghost");
  assert.equal(m.state().replays, 1);
  assert.equal(m.tap(), true, "a tap during the ghost still counts");
  assert.deepEqual([m.state().phase, m.state().index, m.state().replays], ["show", 1, 0]);
  assert.equal(m.tap(), false, "step 2 waits for pour-done, not a tap");
  m.ghostDone();
  assert.equal(m.signal("pour-done"), true);
  assert.deepEqual([m.state().phase, m.state().index], ["wait", 2], "no ghost: straight to wait");
  assert.equal(m.idle().phase, "wait", "no ghost to replay");
  assert.equal(m.signal("stirred"), true);
  assert.equal(m.state().phase, "done");
  assert.equal(m.signal("stirred"), false, "done is final");
  assert.equal(m.skip().phase, "done", "skip after done stays done");
  const s = Onboard.machine(SCRIPT);
  s.start();
  assert.equal(s.skip().phase, "skipped");
  assert.equal(s.tap(), false);
});

test("onboard: validation, defaults and ghost paths", () => {
  assert.deepEqual(Onboard.validate(SCRIPT), []);
  assert.ok(Onboard.validate([]).length);
  assert.ok(Onboard.validate([{ ghost: "tap" }])[0].includes("no spotlight"));
  assert.ok(Onboard.validate([{ spotlight: "#a", ghost: { gesture: "drag" } }])[0].includes("drag needs"));
  assert.ok(Onboard.validate([{ spotlight: "#a", ghost: { gesture: "wiggle" } }])[0].includes("unknown gesture"));
  assert.deepEqual(Onboard.normalize({ spotlight: "#a", ghost: "hold" }), { spotlight: "#a", ghost: { gesture: "hold" }, wait: "tap" });
  const a = { x: 100, y: 100 };
  const b = { x: 300, y: 120 };
  for (const g of Onboard.GESTURES) {
    const k = Onboard.path(g, a, g === "drag" ? b : null, { w: 120, h: 120 });
    assert.equal(k[0].o, 0, g);
    assert.equal(k[k.length - 1].o, 1, g);
    for (let i = 1; i < k.length; i++) assert.ok(k[i].o >= k[i - 1].o, `${g}: offsets rise`);
    assert.ok(k.some((f) => f.press), `${g}: the finger presses`);
  }
  const drag = Onboard.path("drag", a, b);
  const pressed = drag.filter((f) => f.press);
  assert.deepEqual([pressed[0].x, pressed[pressed.length - 1].x], [100, 300], "drag presses at from, releases at to");
  const stir = Onboard.path("circle-stir", a, null, { w: 200, h: 200 }).filter((f) => f.press);
  assert.ok(stir.length > 20 && stir.every((f) => Math.hypot(f.x - 100, (f.y - 100) / 0.8) < 60), "stir circles the centre");
});

test("onboard: once per profile per station", () => {
  UIStore.use(UIStore.memory());
  assert.equal(Onboard.seen("cook/chai"), false);
  UIStore.set("onboarded", "cook/chai", true);
  assert.equal(Onboard.seen("cook/chai"), true);
  Onboard.reset("cook/chai");
  assert.equal(Onboard.seen("cook/chai"), false);
  UIStore.set("onboarded", "cook/grill", true);
  Onboard.reset();
  assert.equal(Onboard.seen("cook/grill"), false);
  UIStore.use(null);
});
