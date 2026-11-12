// s19-clean-a: contract-118 (the wrong-order pop-up and the redo, SH-264 to SH-266), red then green on synthetic timelines, and the
// probe's registration. No browser. Run: node --test build/sandbox/contract-wo.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { WO_CHECKS, WO_HOOK, check118 } from "./lib/contract-wo.mjs";
import { CHECKS } from "./lib/contract.mjs";
import { CONTRACT_HOOK } from "./lib/contract-hook.mjs";
import { CONTRACT_ROWS } from "../tools/review/lib/regressions.mjs";

const run = (r, tl) => { const out = []; check118(r, tl, (id, t, msg) => out.push({ id, t, msg })); return out; };
const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const life = (t, what, o = {}) => c(t, "life", { what, reason: o.step || "", at: t, ...o });
const R = { flow: "cook:chai-tray@L3#serve-wrong" };
const VW = 1280, VH = 665;
const veil = [240, 0, 1280, 665];
// a wrong card open in the middle of the veil, its rows in view, the face big, the wrong one crossed at the end
const open = (t, o = {}) => c(t, "s19wo", { vw: VW, vh: VH, veil, sideFaceW: 44, panel: ["nana", "ma", "cousin"], faces: ["nana", "ma", "cousin"], card: Object.assign({ who: "ma", phase: "open", box: [560, 200, 960, 460], items: [[700, 250, 820, 330], [840, 250, 940, 330]], rows: 2, marked: 0, crossed: false, faceW: 144 }, o) });
const goodPopup = (t0) => [life(t0, "wo-open"), open(t0 + 100), open(t0 + 900, { marked: 2, crossed: true }), c(t0 + 1500, "s19wo", { vw: VW, vh: VH, veil: null, card: null, panel: ["nana", "ma", "cousin"], faces: ["nana", "ma", "cousin"] })];

test("contract-118 is registered, mapped to SH-264 to SH-266, and its probe is its own statement", () => {
  assert.ok(CHECKS["contract-118"]);
  assert.ok(WO_CHECKS["contract-118"].how.length > 200);
  assert.deepEqual(CONTRACT_ROWS["contract-118 wrong-order"], ["SH-264", "SH-265", "SH-266"]);
  assert.ok(CONTRACT_HOOK.includes(WO_HOOK));
  assert.match(CONTRACT_HOOK, /__njgWoHook/);
  assert.doesNotThrow(() => new Function(CONTRACT_HOOK));
});

test("red: a wrong order served and no pop-up (the old serve: a frown and the order said again)", () => {
  const tl = [life(1000, "probe-wrong", { step: "serve-wrong" }), c(20000, "s19wo", { vw: VW, vh: VH, card: null, panel: [], faces: [] }), c(30000, "stage", { key: "x" })];
  const b = run(R, tl);
  assert.equal(b.length, 1);
  assert.match(b[0].msg, /no wrong-order pop-up came/);
});

test("green: the pop-up's wrong card in the middle, every item in view, the face big, the wrong item crossed", () => {
  const tl = [life(1000, "probe-wrong", { step: "serve-wrong" }), ...goodPopup(5000)];
  assert.deepEqual(run(R, tl), []);
});

test("red: off the middle, an item past the screen, a small face, no cross", () => {
  const off = [life(5000, "wo-open"), open(5100, { box: [250, 10, 650, 300] }), open(5900, { marked: 2, crossed: true }), c(6500, "s19wo", { vw: VW, vh: VH, card: null })];
  assert.match(run(R, off).map((b) => b.msg).join("|"), /not in the middle/);
  const cut = [open(5100, { items: [[700, 250, 820, 330], [1200, 600, 1320, 700]] }), open(5900, { marked: 2, crossed: true }), c(6500, "s19wo", { card: null })];
  assert.match(run(R, cut).map((b) => b.msg).join("|"), /out of view/);
  const small = [open(5100, { faceW: 50 }), open(5900, { faceW: 50, marked: 2, crossed: true }), c(6500, "s19wo", { card: null })];
  assert.match(run(R, small).map((b) => b.msg).join("|"), /face big/);
  const nocross = [open(5100), open(5900, { marked: 2 }), c(6500, "s19wo", { card: null })];
  assert.match(run(R, nocross).map((b) => b.msg).join("|"), /no item marked red with a cross/);
});

test("the redo: only the wrong order's card, the one worked on first, no face of an order made right; the game's leave", () => {
  const keep = JSON.stringify({ keep: ["ma"], first: "ma" });
  const ok = [life(8000, "wo-leave", { step: "game", by: "2" }), life(8000, "wo-redo", { by: keep }), c(9000, "s19wo", { vw: VW, vh: VH, card: null, panel: ["ma"], faces: ["ma"] })];
  assert.deepEqual(run(R, ok), []);
  const stay = [life(8000, "wo-leave", { step: "none", by: "2" }), life(8000, "wo-redo", { by: keep }), c(9000, "s19wo", { vw: VW, vh: VH, card: null, panel: ["nana", "ma", "cousin"], faces: ["nana", "ma", "cousin"] })];
  const msgs = run(R, stay).map((b) => b.msg).join("|");
  assert.match(msgs, /still shows the card of nana, cousin/);
  assert.match(msgs, /first card is nana's, not ma's/);
  assert.match(msgs, /face of nana, cousin \(served right\)/);
  assert.match(msgs, /no leave/);
});

test("not a kitchen flow, or no wrong order and no pop-up: nothing", () => {
  assert.deepEqual(run({ flow: "clinic:waiting" }, [life(1000, "probe-wrong")]), []);
  assert.deepEqual(run({ flow: "cook:chai-tray" }, [c(1000, "s19wo", { card: null })]), []);
});

import { check119 } from "./lib/contract-wo.mjs";
test("contract-119 (SH-267): the dish's card flashes up as the customer says it at L1, never from L2", () => {
  const run = (flow, tl) => { const out = []; check119({ flow }, tl, (id, t, msg) => out.push({ id, t, msg })); return out; };
  const say = (t) => ({ type: "line", who: "cook", text: "Muke ba samosa khape,", t });
  const flash = (t, on) => c(t, "s19flash", { on, box: on ? [500, 100, 640, 260] : null });
  const end = c(20000, "x");
  assert.equal(run("cook:samosa", [say(1000), end]).length, 1, "red: said, no card");
  assert.deepEqual(run("cook:samosa", [say(1000), flash(1300, true), flash(1900, false), end]), [], "green: up 600 ms");
  assert.equal(run("cook:samosa", [say(1000), flash(1300, true), flash(1350, false), end]).length, 1, "a blink is not a flash");
  assert.equal(run("cook:samosa@L2", [say(1000), flash(1300, true), flash(1900, false), end]).length, 1, "never at L2");
  assert.deepEqual(run("cook:samosa@L3", [say(1000), end]), [], "L3: none, right");
});
