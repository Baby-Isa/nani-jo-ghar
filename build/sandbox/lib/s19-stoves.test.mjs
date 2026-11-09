// s19-stoves: contract-110 (the knob rule, SH-247) and contract-111 (an item's tap area reaching its pill, SH-244), each red then green
// on a synthetic timeline, and the shared shelf's tap areas (Shelf.P.reach, the pill's chip.hit) on stand-in Phaser objects.
// No browser. Run: node --test build/sandbox/lib/s19-stoves.test.mjs
// (here, in lib/, because the builder owns lib/ only: checks.mjs's unit step reads build/sandbox/*.test.mjs; the orchestrator moves it)
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { S19_CHECKS, S19_HOOK, check110, check111, ONE_PAN } from "./contract-s19.mjs";
import { CHECKS } from "./contract.mjs";

const require = createRequire(import.meta.url);
const Shelf = require("../../../js/shared/shelf.js");
const run = (fn, ...a) => { const out = []; fn(...a, (id, t, msg) => out.push({ id, t, msg })); return out; };
const c = (t, k, o = {}) => ({ type: "c", k, t, ...o });
const ST = [c(0, "stage", { key: "cook:station1:daar" }), c(60000, "stage", { key: "cook:between1:-" })];

test("contract-110 and -111 are registered with the S19 checks and the probe samples them", () => {
  for (const n of [110, 111]) {
    assert.ok(CHECKS[`contract-${n}`], `contract-${n} in CHECKS`);
    assert.ok(S19_CHECKS[`contract-${n}`].how.length > 80);
  }
  assert.match(S19_HOOK, /s19knob/);
  assert.match(S19_HOOK, /s19tap/);
  assert.doesNotThrow(() => new Function(S19_HOOK));
  assert.ok(ONE_PAN.test("cook:daar") && ONE_PAN.test("cook:samosa") && ONE_PAN.test("cook:maani-line") && ONE_PAN.test("lab:cook/daar"));
  assert.ok(!ONE_PAN.test("cook:chai-tray") && !ONE_PAN.test("cook:eggs"));
});

// a single pan at x 400..700 (middle 550, 300), its flames' ring r 160
const pan = { burner: { x: 550, y: 300, r: 160 }, pan: [380, 150, 720, 450] };
test("contract-110: one pan, the knob below it (the old front edge) is a break; to its left, centred on its height, passes", () => {
  const red = run(check110, { flow: "cook:daar" }, [c(1000, "s19knob", { n: 1, vw: 1280, vh: 665, panels: [[0, 0, 340, 665]], list: [{ i: 0, ...pan, knob: [530, 480, 570, 520], face: null }] })]);
  assert.equal(red.length, 1);
  assert.match(red[0].msg, /not left of the pan/);
  const green = run(check110, { flow: "cook:daar" }, [c(1000, "s19knob", { n: 1, vw: 1280, vh: 665, panels: [[0, 0, 340, 665]], list: [{ i: 0, ...pan, knob: [350, 280, 376, 320], face: null }] })]);
  assert.deepEqual(green, []);
  // the face above the knob: the pair centred on the pan's height
  const pair = run(check110, { flow: "cook:maani-line" }, [c(1000, "s19knob", { vw: 1280, vh: 665, panels: [], list: [{ i: 0, ...pan, face: [345, 255, 375, 285], knob: [345, 295, 375, 345] }] })]);
  assert.deepEqual(pair, []);
  // off its height, or under the side panel, or off the screen
  const low = run(check110, { flow: "cook:maani-line" }, [c(1000, "s19knob", { vw: 1280, vh: 665, panels: [], list: [{ i: 0, ...pan, face: [345, 355, 375, 385], knob: [345, 395, 375, 445] }] })]);
  assert.match(low[0].msg, /below the pan's middle/);
  const under = run(check110, { flow: "cook:samosa" }, [c(1000, "s19knob", { vw: 1280, vh: 665, panels: [[0, 0, 360, 665]], list: [{ i: 0, ...pan, knob: [345, 280, 375, 320], face: null }] })]);
  assert.match(under[0].msg, /under the side panel/);
});

test("contract-110: several pans (chai), each knob below its burner passes; one above it is a break", () => {
  const ok = run(check110, { flow: "cook:chai-tray" }, [c(1000, "s19knob", { vw: 1280, vh: 665, panels: [], list: [{ i: 0, burner: { x: 500, y: 200, r: 80 }, pan: null, knob: [520, 330, 560, 370] }, { i: 1, burner: { x: 800, y: 200, r: 80 }, pan: null, knob: [820, 330, 860, 370] }] })]);
  assert.deepEqual(ok, []);
  const red = run(check110, { flow: "cook:chai-tray" }, [c(1000, "s19knob", { vw: 1280, vh: 665, panels: [], list: [{ i: 0, burner: { x: 500, y: 200, r: 80 }, pan: null, knob: [380, 180, 420, 220] }] })]);
  assert.equal(red.length, 1);
  assert.match(red[0].msg, /not below its burner/);
});

test("contract-111: a tap at an item's foot that says its word is a break; one that picks the item passes", () => {
  const R = { flow: "cook:maani-line" };
  const red = run(check111, R, [...ST, c(1000, "s19tap", { items: [{ id: "maani-wheat", foot: { x: 500, y: 600, who: "pill" }, gap: { x: 500, y: 612, who: "pill" }, pill: { x: 500, y: 630, who: "pill" } }] })]);
  assert.equal(red.length, 1);
  assert.match(red[0].msg, /says the word/);
  const green = run(check111, R, [...ST, c(1000, "s19tap", { items: [{ id: "maani-wheat", foot: { x: 500, y: 600, who: "item" }, gap: { x: 500, y: 612, who: "item" }, pill: { x: 500, y: 630, who: "pill" } }] })]);
  assert.deepEqual(green, []);
  // a hit area carrying the item's own word (daar's bowls) is the item; the pill must still say the word
  const own = run(check111, R, [...ST, c(1000, "s19tap", { items: [{ id: "n.onion", foot: { who: "word", id: "n.onion" }, gap: null, pill: { who: "item" } }] })]);
  assert.match(own[0].msg, /the pill says the word/);
});

// ---- the shared shelf's tap areas on stand-ins (Phaser's own hit test calls the area's callback with the local point, display origin
// added; a plain image: world = x + (local - origin) * scale) ----
function img({ x, y, w, h, ox = 0.5, oy = 1, k = 1 }) {
  const o = { x, y, width: w, height: h, scaleX: k, scaleY: k, displayOriginX: w * ox, displayOriginY: h * oy, active: true, visible: true };
  o.getBounds = () => ({ x: x - w * ox * k, y: y - h * oy * k, width: w * k, height: h * k, right: x + w * (1 - ox) * k, bottom: y + h * (1 - oy) * k });
  o.getWorldTransformMatrix = () => ({ transformPoint: (lx, ly) => ({ x: o.x + lx * o.scaleX, y: o.y + ly * o.scaleY }) });
  o.input = { hitArea: { x: 0, y: 0, width: w, height: h }, hitAreaCallback: (a, lx, ly) => lx >= a.x && ly >= a.y && lx <= a.x + a.width && ly <= a.y + a.height, enabled: true };
  return o;
}
const local = (o, wx, wy) => [(wx - o.x) / o.scaleX + o.displayOriginX, (wy - o.y) / o.scaleY + o.displayOriginY];
const hits = (o, wx, wy) => o.input.hitAreaCallback(o.input.hitArea, ...local(o, wx, wy), o);

test("Shelf.P.reach (SH-244): an item takes taps down its slot to its pill's top, across the slot; nothing else changes", () => {
  // a jar 100 wide standing on 818, its pill (card 46 high, 1.2x) centred on 860 under it, the slot 180 wide
  const jar = img({ x: 400, y: 818, w: 100, h: 150 });
  jar.chip = { x: 400, y: 860, cardW: 128, cardH: 46, scaleX: 1.2, scaleY: 1.2, slotW: 180, active: true, visible: true };
  const pillTop = 860 - 23 * 1.2;
  assert.equal(hits(jar, 400, 826), false, "before: a tap under the picture is not the jar's");
  Shelf.P.reach(jar);
  assert.equal(hits(jar, 400, 700), true, "its own picture");
  assert.equal(hits(jar, 400, 826), true, "between its foot and the pill");
  assert.equal(hits(jar, 400, pillTop - 0.5), true, "down to the pill's top");
  assert.equal(hits(jar, 400, pillTop + 2), false, "the pill's card is the pill's");
  assert.equal(hits(jar, 400 + 88, 826), true, "across its slot");
  assert.equal(hits(jar, 400 + 92, 826), false, "never past its slot");
  // read at each tap: a pill given after, or gone, follows
  const late = img({ x: 700, y: 818, w: 100, h: 150 });
  Shelf.P.reach(late);
  assert.equal(hits(late, 700, 826), false);
  late.chip = { x: 700, y: 860, pillW: 128, pillH: 46, scaleX: 1, scaleY: 1, slotW: Infinity, active: true, visible: true };
  assert.equal(hits(late, 700, 826), true, "Kit.chip's pillW counts as its card");
  late.chip.active = false;
  assert.equal(hits(late, 700, 826), false);
  // a pill above its thing (a plate's face, a label over it) gives no reach
  const plate = img({ x: 1000, y: 818, w: 100, h: 100 });
  plate.chip = { x: 1000, y: 700, cardW: 128, cardH: 46, scaleX: 1, scaleY: 1, active: true, visible: true };
  Shelf.P.reach(plate);
  assert.equal(hits(plate, 1000, 830), false);
});

test("the pill's tap area (SH-244): its card and a small margin at its sides and foot, nothing above its card, never past its slot", () => {
  let area = null;
  const S = {
    add: {
      container: (x, y) => {
        const c = { x, y, list: [], scaleX: 1, scaleY: 1, add(a) { this.list.push(...[].concat(a)); }, remove() {}, setDepth() { return this; }, setSize(w, h) { this.w = w; this.h = h; }, on() {} };
        c.setInteractive = (r) => { area = r; c.input = { hitArea: r }; return c; };
        return c;
      },
      graphics: () => ({ fillStyle() {}, fillRoundedRect() {}, fillRect() {}, fillTriangle() {}, lineStyle() {}, beginPath() {}, arc() {}, strokePath() {} }),
      text: () => ({ width: 80, displayWidth: 80, setOrigin() { return this; }, setScale() { return this; }, destroy() {} }),
    },
  };
  globalThis.Phaser = { Geom: { Rectangle: Object.assign(function (x, y, w, h) { Object.assign(this, { x, y, width: w, height: h }); this.setTo = (a, b, c2, d) => Object.assign(this, { x: a, y: b, width: c2, height: d }); }, { Contains: () => true }) } };
  const chip = Shelf.P.chip(S, 400, 860, "jeeru", {});
  const m = Shelf.PILL.margin;
  // (Phaser reads a container's area from its top-left: the point plus half its size, chip.w x chip.h)
  const at = (px, py) => { const lx = px + chip.w / 2, ly = py + chip.h / 2; return lx >= area.x && lx <= area.x + area.width && ly >= area.y && ly <= area.y + area.height; };
  const hw = chip.cardW / 2, hh = Shelf.PILL.h / 2;
  assert.ok(at(0, 0) && at(hw - 1, 0) && at(-hw + 1, 0), "its card, both halves");
  assert.ok(at(hw + m - 1, 0) && at(-hw - m + 1, 0) && at(0, hh + m - 1), "a margin at its sides and foot");
  assert.ok(!at(0, -hh - 1) && !at(0, -hh - 30), "nothing above its card: the item's");
  assert.ok(!at(hw + m + 2, 0) && !at(0, hh + m + 2));
  chip.hit(chip.cardW + 4);
  assert.ok(area.width <= chip.cardW + 4 && area.width >= chip.cardW, "never past a narrow slot, never under its card");
  delete globalThis.Phaser;
});
