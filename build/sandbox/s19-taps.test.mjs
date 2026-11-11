// s19-taps: contract-117 (SH-261: a first-time light stays through a miss in its box and a tap elsewhere, goes on the right move) and
// contract-111 as SH-244 was told again (the item wins its picture's edges, its pill's upper part and its word; only the speaker says
// the word), each red then green on a synthetic timeline; the shared pill's speaker area (Shelf.P.spkArea, P.spkBox) on stand-ins.
// No browser. Run: node --test build/sandbox/s19-taps.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { S19_CHECKS, check111, check117, check106 } from "./lib/contract-s19.mjs";
import { CHECKS } from "./lib/contract.mjs";
import { DRIVERS } from "./drivers/catalog.mjs";
import { resolveFlow } from "./flows/index.mjs";

const require = createRequire(import.meta.url);
const Shelf = require("../../js/shared/shelf.js");
const run = (fn, ...a) => { const out = []; fn(...a, (id, t, msg) => out.push({ id, t, msg })); return out; };
const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const R = { flow: "cook:chai-tray#miss-light" };
const BOX = [315, 228, 381, 319];
const probe = (t, step, x, y) => c(t, "life", { what: "probe-tap", step, by: `${x},${y}|${BOX.join(",")}`, at: t });

test("contract-117 is registered, and the miss-light driver plays on every Cook station", () => {
  assert.ok(CHECKS["contract-117"]);
  assert.match(S19_CHECKS["contract-117"].how, /SH-261/);
  assert.deepEqual(DRIVERS["miss-light"].kinds, ["cook"]);
  for (const f of ["cook:chai-tray#miss-light", "cook:eggs#miss-light", "cook:maani-line#miss-light", "cook:fetch#miss-light"]) assert.ok(resolveFlow(f), f);
});

test("contract-117: the light gone after a miss in its box is a break; standing through both misses passes", () => {
  // before (the 11 Nov code): the press in the box hid it, back 2.4 s later
  const red = run(check117, R, [c(900, "s19lit", { holes: [BOX] }), probe(1000, "miss-in", 318, 231), c(1065, "input", { x: 318, y: 231 }), c(1125, "s19lit", { holes: [] }), c(3400, "s19lit", { holes: [BOX] })]);
  assert.equal(red.length, 1);
  assert.match(red[0].msg, /went after a tap inside its box that missed the thing/);
  const green = run(check117, R, [c(900, "s19lit", { holes: [BOX] }), probe(1000, "miss-in", 318, 231), c(1065, "input", { x: 318, y: 231 }), probe(3000, "miss-out", 678, 40), c(3060, "input", { x: 678, y: 40 }), c(6000, "input", { x: 350, y: 270 }), c(6100, "s19lit", { holes: [] })]);
  assert.deepEqual(green, []);
});

test("contract-117: a tap elsewhere that takes the light is a break; the right move that leaves it up is a break too", () => {
  const out = run(check117, R, [c(900, "s19lit", { holes: [BOX] }), probe(1000, "miss-in", 318, 231), probe(3000, "miss-out", 678, 40), c(3100, "s19lit", { holes: [] })]);
  assert.match(out[0].msg, /elsewhere, outside it/);
  const stays = run(check117, R, [c(900, "s19lit", { holes: [BOX] }), probe(1000, "miss-in", 318, 231), probe(3000, "miss-out", 678, 40), c(6000, "input", { x: 350, y: 270 }), c(9000, "s19lit", { holes: [[0, 0, 10, 10]] })]);
  assert.equal(stays.length, 1);
  assert.match(stays[0].msg, /still stood 2000 ms after the right move/);
});

test("contract-106 does not judge the driver's own misses (they are not the move a light shows)", () => {
  const tl = [c(900, "s19lit", { holes: [BOX] }), probe(1000, "miss-in", 318, 231), c(1065, "input", { x: 318, y: 231 }), c(5000, "s19lit", { holes: [] })];
  assert.deepEqual(run(check106, R, tl), []);
  // the same press, no probe: a press in the box that did not take the light is still judged
  assert.equal(run(check106, R, tl.filter((e) => e.k !== "life")).length, 1);
});

const ST = [c(0, "stage", { key: "cook:station1:marble" }), c(60000, "stage", { key: "cook:between1:-" })];
const at = (e) => [ST[0], e, ST[1]];
const it = (o) => ({ id: "cook-paani", edges: [{ who: "item" }, { who: "item" }, { who: "item" }], foot: { who: "item" }, gap: { who: "item" }, upper: { who: "item" }, word: { who: "item" }, spk: { who: "pill" }, ...o });
test("contract-111 (SH-244 told again): the pill's word or upper part saying the word is a break; picking the item passes", () => {
  const red = run(check111, R, at(c(1000, "s19tap", { items: [it({ upper: { x: 358, y: 299, who: "pill" }, word: { x: 358, y: 307, who: "pill" } })] })));
  assert.equal(red.length, 1);
  assert.match(red[0].msg, /pill's upper part .* it says the word; a tap on its pill's word/);
  assert.deepEqual(run(check111, R, at(c(1000, "s19tap", { items: [it()] }))), []);
});

test("contract-111: a picture edge picking a neighbour, or the speaker not saying the word, is a break", () => {
  const edge = run(check111, R, at(c(1000, "s19tap", { items: [it({ edges: [{ who: "item" }, { x: 380, y: 260, who: "word", id: "cook-dudh" }, { who: "item" }] })] })));
  assert.match(edge[0].msg, /picture's right edge .* picks word cook-dudh/);
  const spk = run(check111, R, at(c(1000, "s19tap", { items: [it({ spk: { x: 340, y: 307, who: "item" } })] })));
  assert.match(spk[0].msg, /speaker .* picks item: the speaker says the word/);
  // the pantry: a thing with no pill is judged by its edges alone
  assert.deepEqual(run(check111, R, at(c(1000, "s19tap", { items: [{ id: "cook-chai", edges: [{ who: "item" }, { who: "item" }, { who: "item" }] }] }))), []);
});

test("the pill's speaker area (Shelf.P.spkArea): the icon, a margin at its sides and foot, from just over its top; never the card's upper part", () => {
  const chip = { x: 400, y: 860, cardW: 128, cardH: 46, scaleX: 1.5, scaleY: 1.5, active: true, visible: true, spk: { x: -40, y: -9.5, w: 20.5, h: 19 } };
  const a = Shelf.P.spkArea(chip);
  const m = Shelf.PILL.margin;
  assert.equal(a.x, -40 - m);
  assert.equal(a.y, -11.5);
  assert.equal(a.y + a.h, 23 + m, "down to the card's foot and the margin under it");
  assert.ok(a.x + a.w < 0, "the word's side of the card is not the speaker's");
  const b = Shelf.P.spkBox(chip);
  assert.equal(b.left, 400 + a.x * 1.5);
  assert.equal(b.top, 860 + a.y * 1.5);
  assert.ok(b.top > 860 - 23 * 1.5, "the card's upper part is above it");
  assert.equal(Shelf.P.spkBox(Object.assign({}, chip, { active: false })), null);
});
