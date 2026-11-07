// The shared kit's shelf (js/shared/shelf.js; Sprint 18, module map pieces 9 and 10): decoys by the rules file, size classes,
// slots and word pills, without Cook.
//   node --test build/test_shared_shelf.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const ROOT = new URL("../", import.meta.url);
const Rules = require("../js/shared/rules.js");
Rules.set(JSON.parse(readFileSync(new URL("data/rules.json", ROOT), "utf8")));
globalThis.Rules = Rules;
const Shelf = require("../js/shared/shelf.js");

test("the file loads without Cook and names no game (STD-F1-02)", () => {
  assert.equal(typeof Shelf.decoys, "function");
  assert.equal(globalThis.Cook, undefined);
  const src = readFileSync(new URL("js/shared/shelf.js", ROOT), "utf8");
  for (const g of ["chai", "daar", "sekelo", "maani", "chaat", "samosa", "mishkaki", "pantry", "clinic"]) assert.ok(!new RegExp(g, "i").test(src), `names ${g}`);
});

test("decoys 1, 2, 3, 4 by the rules file, one a lookalike at L4 (contract-37)", () => {
  const pool = ["a", "b", "c", "d", "e", "f", "salt"];
  const lookalikes = { sugar: ["salt"] };
  for (const lv of [1, 2, 3, 4]) {
    const notes = [];
    const out = Shelf.decoys(pool, ["sugar"], lv, { lookalikes, note: (n, o) => notes.push([n, o]) });
    assert.equal(out.length, Rules.level(lv).decoys, `L${lv}`);
    assert.equal(out.length, lv);
    assert.equal(notes[0][0], lv);
    assert.equal(notes[0][1].lookalike, lv === 4);
    if (lv === 4) assert.ok(out.includes("salt"), "L4's lookalike is among them");
    assert.equal(new Set(out).size, out.length);
  }
});

test("decoys: not, ok, n, also and a short pool's room note", () => {
  const notes = [];
  const out = Shelf.decoys(["a", "b", "x"], ["x"], 4, { ok: (id) => id !== "b", note: (n, o) => notes.push([n, o]), what: "spices", also: 1 });
  assert.deepEqual(out, ["a"]);
  assert.deepEqual(notes[0], [2, { what: "spices room:2", lookalike: false }]);
  const two = Shelf.decoys(["a", "b", "c"], [], 4, { n: 2, alsoLook: true, note: () => {} });
  assert.equal(two.length, 2);
  // a lookalike group stands in for the lookalikes list
  const g = Shelf.decoys(["p", "q", "r", "s", "t"], ["w"], 4, { groups: [["w", "t"]], note: () => {} });
  assert.ok(g.includes("t"));
});

test("the level row comes from Rules, else the rules file's own defaults", () => {
  assert.deepEqual(Shelf.levelRow(4), { level: 4, decoys: 4, lookalike: true });
  const R = globalThis.Rules;
  delete globalThis.Rules;
  assert.deepEqual(Shelf.levelRow(3), { level: 3, decoys: 3, lookalike: false });
  assert.deepEqual(Shelf.levelRow(9), { level: 4, decoys: 4, lookalike: true });
  globalThis.Rules = R;
});

// the fit as it stood in js/cook/station-lib.js before the move (6 Nov), to hold the shared one equal to it
function oldClassFit(pic, size, flag, { base, ppw = 1, slotW = Infinity, hop = true }) {
  const K = { L: 1, M: 0.91, S: 0.84 };
  const pad = 900 - (860 + 23);
  const hopOf = (h) => Math.max(6, Math.min(16, h * 0.07));
  const k = K[size];
  const room = base - (630 + pad) - 4;
  let hL = room;
  for (let n = 0; n < 4; n++) hL = room - (hop ? hopOf(hL) : 0);
  const out = { scale: 1, cls: size, flag, k, h: 0, hL, floored: false, capped: false };
  const { ph, pw } = pic;
  let s;
  if (flag === "W" && isFinite(slotW)) s = (slotW * k) / pw;
  else if (flag === "LONG") s = (hL * k) / Math.max(ph, pw);
  else s = (hL * k) / ph;
  const floor = 40 / Math.max(1e-6, ppw);
  if (ph * s < floor) { s = floor / ph; out.floored = true; }
  if (isFinite(slotW) && pw * s > slotW) { s = slotW / pw; out.capped = true; }
  out.scale = Math.max(0.05, s);
  out.h = ph * out.scale;
  return out;
}

test("classFit is the station library's fit, every class and flag", () => {
  for (const size of ["L", "M", "S"]) for (const flag of [null, "LONG", "W"]) for (const ppw of [0.2, 0.42, 1]) for (const slotW of [Infinity, 60, 150]) {
    const pic = { ph: 400, pw: 260 };
    const a = Shelf.classFit(pic, { size, flag }, { base: 818, ppw, slotW });
    const b = oldClassFit(pic, size, flag, { base: 818, ppw, slotW });
    assert.deepEqual(a, b, `${size} ${flag} ${ppw} ${slotW}`);
  }
  assert.equal(Shelf.classFit(null, "L", { base: 818 }).scale, 1, "no picture: scale 1");
  assert.equal(Shelf.classFit({ ph: 10, pw: 10 }, "Q", { base: 818 }).cls, "M", "an unknown class is M");
});

test("size classes: the word's own first, then the art's, missing = M", () => {
  const words = { a: { size: "L" }, b: {} };
  const sizes = { b: { size: "S", sizeFlag: "W" }, c: { size: "Z" } };
  assert.deepEqual(Shelf.sizeClass("a", { words, sizes }), { size: "L", flag: null, given: true });
  assert.deepEqual(Shelf.sizeClass("b", { words, sizes }), { size: "S", flag: "W", given: true });
  assert.deepEqual(Shelf.sizeClass("c", { words, sizes }), { size: "M", flag: null, given: true });
  assert.deepEqual(Shelf.sizeClass("d"), { size: "M", flag: null, given: false });
});

test("the band: its rule in design px and at any height", () => {
  assert.equal(Shelf.pad(), 17);
  assert.equal(Shelf.itemTop(), 647);
  assert.equal(Shelf.hop(10), 6);
  assert.equal(Shelf.hop(1000), 16);
  const b = Shelf.band(270);
  assert.equal(b.u, 1);
  assert.equal(b.base, 188);
  assert.equal(b.chipY, 230);
});

// the slots as the reference game's shelf laid them before the move (6 Nov)
function oldSlots(shelfIds, { spanL, spanR, VL, VR, PITCH, GROUP_GAP, PILL_ROOM }) {
  const slotsN = shelfIds.reduce((a, g) => a + g.length, 0);
  const mid = (spanL + spanR) / 2;
  const roomW = 2 * Math.min(mid - VL, VR - mid, (spanR - spanL) / 2);
  const nG = shelfIds.length - 1;
  let gapW = GROUP_GAP;
  let slotW = Math.min(Math.max(PITCH, PILL_ROOM), (roomW - nG * gapW) / slotsN);
  if (slotW < PILL_ROOM) {
    const roomMid = 2 * Math.min(mid - VL, VR - mid);
    const fit = (g) => (roomMid - nG * g) / slotsN;
    if (fit(gapW) < PILL_ROOM) gapW = Math.max(20, Math.min(GROUP_GAP, (roomMid - slotsN * PILL_ROOM) / Math.max(1, nG)));
    slotW = Math.min(PILL_ROOM, fit(gapW));
  }
  const x = {};
  let sx = mid - (slotsN * slotW + nG * gapW) / 2 + slotW / 2;
  shelfIds.forEach((g) => { g.forEach((id) => { x[id] = sx; sx += slotW; }); sx += gapW; });
  return { slotW, gapW, x };
}

test("slots: centred on the span, widening, then the gaps closing (as the reference shelf)", () => {
  const groups = [["w", "m"], ["t", "s"], ["e", "g", "c", "x", "y", "z"]];
  for (const PILL_ROOM of [100, 160, 190, 260]) for (const [spanL, spanR] of [[300, 1300], [200, 1450]]) {
    const o = oldSlots(groups, { spanL, spanR, VL: 40, VR: 1560, PITCH: 172, GROUP_GAP: 44, PILL_ROOM });
    const n = Shelf.slots(groups, { span: [spanL, spanR], view: [40, 1560], pitch: 172, groupGap: 44, pillRoom: PILL_ROOM });
    assert.equal(n.slotW, o.slotW);
    assert.equal(n.gapW, o.gapW);
    assert.deepEqual(n.x, o.x);
    assert.ok(Math.abs((n.x.w + n.x.z) / 2 - (spanL + spanR) / 2) < 1e-6, "centred");
  }
});

test("pills: the floor's scale, the room a row needs, never touching, a cap where even 1 touches", () => {
  assert.equal(Shelf.pillWant(1), 1);
  assert.equal(Shelf.pillWant(0.2), 1.5, "at most 1.5x");
  assert.ok(Math.abs(Shelf.pillWant(0.4) - 1.3) < 1e-9);
  assert.equal(Shelf.pillGap(0.2), 25);
  assert.equal(Shelf.pillGap(1), 12);
  assert.equal(Shelf.faceW(true, 80), 128);
  assert.equal(Shelf.faceW(false, 80), 62);
  assert.equal(Shelf.pillRoom([128, 62, 100], 1.2, 12), 95 * 1.2 + 12);
  const wide = Shelf.pillScale([{ x: 0, w: 100 }, { x: 300, w: 100 }], { want: 1.5, gap: 12 });
  assert.deepEqual(wide, { k: 1.5, cap: Infinity });
  const tight = Shelf.pillScale([{ x: 0, w: 100 }, { x: 130, w: 100 }], { want: 1.5, gap: 12 });
  assert.equal(tight.k, 1.18);
  const touch = Shelf.pillScale([{ x: 0, w: 100 }, { x: 90, w: 100 }], { want: 1.5, gap: 12, slotW: 90 });
  assert.deepEqual(touch, { k: 1, cap: 78 });
});
