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

import { check117stay } from "./lib/contract-s19.mjs";
test("SH-261 at full strength: contract-117 breaks on a light that goes with its step still wanted (a tap or a timer), not on the move", () => {
  const run = (tl) => { const out = []; check117stay({ flow: "cook:chai-tray@L2" }, tl, (id, t, msg) => out.push({ id, t, msg })); return out; };
  const ST2 = [c(0, "stage", { key: "cook:station1:chai" }), c(60000, "stage", { key: "cook:between1:-" })];
  const lit = (t, on) => c(t, "s19lit", { holes: on ? [[100, 100, 200, 200]] : [], things: on ? [{ kind: "pic", id: "s14-pan", box: [110, 110, 190, 190] }] : [] });
  const want = (t, key) => c(t, "want", { by: "cook", kind: "tap", key, at: "6,6" });
  const fade = [...ST2, want(900, "pan-ma"), lit(1000, true), lit(6000, false), want(20000, "x")];
  assert.match(run(fade).map((b) => b.msg).join("|"), /a fade on a timer/);
  const tap = [...ST2, want(900, "pan-ma"), lit(1000, true), c(5800, "input", { x: 400, y: 400 }), lit(6000, false), want(20000, "x")];
  assert.match(run(tap).map((b) => b.msg).join("|"), /after a tap that did not do its thing/);
  const moved = [...ST2, want(900, "pan-ma"), lit(1000, true), c(5800, "input", { x: 150, y: 150 }), want(5900, "cook-paani"), lit(6000, false)];
  assert.deepEqual(run(moved), [], "the right move: the step moved on");
  const back = [...ST2, want(900, "pan-ma"), lit(1000, true), c(5800, "input", { x: 150, y: 150 }), lit(6000, false), lit(6800, true), want(20000, "x")];
  assert.deepEqual(run(back), [], "hidden while the move is done, back after the release");
});

import { check109 } from "./lib/contract-s19.mjs";
test("contract-109: the pantry's painted shelves (rows of things) are not one shelf band", () => {
  const run = (flow) => { const out = []; check109({ flow }, [c(1000, "s19shelf", { items: [{ id: "a", foot: 500, chip: 520 }, { id: "b", foot: 380, chip: 400 }, { id: "c", foot: 500, chip: 520 }] }), c(9000, "x", {})], (id) => out.push(id)); return out; };
  assert.deepEqual(run("cook:fetch@L2"), []);
  assert.ok(run("cook:corn@L2").length >= 1, "a game's shelf band is still one line");
});

import { readFileSync } from "node:fs";
test("the Fable review of s19-clean-c (2, 3, 5), in js/cook/ui.js: a redo clears the pieces on each unit; a skewer keeps its counted kind card; piece rows fold into one row on a short panel", () => {
  const ui = readFileSync(new URL("../../js/cook/ui.js", import.meta.url), "utf8");
  const reopen = ui.slice(ui.indexOf("M.reopen = function"), ui.indexOf("M.missNext = function") > 0 ? ui.indexOf("/** The next open step went wrong") : undefined);
  assert.match(reopen, /r\.units = r\.units\.map\(\(\) => false\)[\s\S]{0,400}if \(r\.unitGot\) r\.unitGot = \[\]/, "2: unitGot cleared with the units");
  const pieces = ui.slice(ui.indexOf("const pieceOf = (r)"), ui.indexOf("SEK-03, SEK-13: each skewer's pieces"));
  assert.ok(pieces.indexOf("cardOf(r, 0)") > 0 && pieces.indexOf("cardOf(r, 0)") < pieces.indexOf("const id = pieceOf(r)"), "5: the kind card (its count written) before the piece rows");
  assert.match(ui, /if \(!mixes\.length \|\| \(r\.qty \|\| 1\) > 1\) items\.push/, "5: a mixed skewer of two keeps its kind card");
  assert.match(ui, /const pieceRows = its\.filter\(\(it\) => it\.ordered\)\.every\(\(it\) => it\.fit\)/, "3: piece rows fold on a short panel");
  assert.match(ui, /parts, ordered: true, done: unit, src: \[\], fit: true/, "3: a piece row is a fit row (whole across, never off the edge)");
});
