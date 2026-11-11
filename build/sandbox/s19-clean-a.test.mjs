// s19-clean-a: the check changes beside contract-118 (contract-wo.test.mjs), red then green on synthetic timelines. No browser.
// Run: node --test build/sandbox/s19-clean-a.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { check36, acceptedSize } from "./lib/contract-s19b.mjs";

const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const run = (tl, v) => { const out = []; check36({ flow: "cook:chai-tray@L3" }, tl, [], v, (id, t, msg) => out.push({ id, t, msg })); return out; };
const ST = [c(0, "stage", { key: "cook:station1:chai" }), c(60000, "stage", { key: "cook:between1:-" })];
// the order card's current card moves on from dudh to khun at 10 s (a card step, no light: a returning player)
const pads = [c(1000, "s19pad", { cards: [{ w: "dudh", done: false }, { w: "khun", done: false }] }), c(10000, "s19pad", { cards: [{ w: "dudh", done: true }, { w: "khun", done: false }] })];
const call = (t0) => ({ role: "call", text: "Khun vijo.", t0, plays: [{}] });

test("SH-172: contract-36 waits for Nani's helper card on a card step: no call while it stays closed, the call as it opens", () => {
  const closed = [c(500, "helper", { named: true, open: false })];
  assert.deepEqual(run([...ST, ...pads, ...closed], { lines: [] }), [], "her card stayed closed: the call waits for it (contract-89)");
  const opens = [...closed, c(14000, "helper", { named: true, open: true })];
  assert.equal(run([...ST, ...pads, ...opens], { lines: [] }).length, 1, "her card opened and nothing was said: a break");
  assert.deepEqual(run([...ST, ...pads, ...opens], { lines: [call(14100)] }), [], "said as her card opened");
  assert.equal(run([...ST, ...pads], { lines: [] }).length, 1, "no helper card at all: called as the step opens, as before");
});

test("SH-256: samosa's close-up fold takes its filling's heaps too (they shrink with the strip as it parks)", () => {
  assert.ok(acceptedSize("cook:samosa@L2", "sv3-heap-ph-keema"));
  assert.ok(acceptedSize("cook:samosa", "sv3-fold-strip"));
  assert.ok(!acceptedSize("cook:chop", "sv3-heap-ph-keema"));
});
