// Node tests for Sprint 19's shared first-time light (s19-lights): the pure parts of js/shared/onboard.js (a gesture's point, the roll's
// path, the press test, the machine's jump) and Cook's wiring in js/cook/coach.js on stubs (a script step's moment, the shelf test, the
// hop rule, the lit thing's parts, the stuck help). The page parts (one light at a time, gone on the press, the one finger) are
// build/test_lights_s19_page.mjs (a browser).
// Run: node --test build/test_shared_lights_s19.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Onboard = require("../js/shared/onboard.js");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("the roll's path: pressed in the middle, up, down, up, home; the pin can ride it (MAA-20)", () => {
  assert.ok(Onboard.GESTURES.includes("roll"));
  const k = Onboard.path("roll", { x: 100, y: 50 }, { x: 100, y: 150 });
  const pressed = k.filter((f) => f.press);
  assert.deepEqual(pressed.map((f) => f.y), [100, 50, 150, 50, 100], "middle, top, bottom, top, middle");
  assert.equal(k[0].o, 0);
  assert.equal(k[k.length - 1].o, 1);
  for (let i = 1; i < k.length; i++) assert.ok(k[i].o >= k[i - 1].o);
  // no `to`: a third of the box each way
  const n = Onboard.path("roll", { x: 0, y: 0 }, null, { w: 100, h: 300 }).filter((f) => f.press).map((f) => f.y);
  assert.deepEqual(n, [0, -90, 90, -90, 0]);
  assert.match(Onboard.validate([{ spotlight: "#a", ghost: { gesture: "roll" } }])[0], /roll needs ghost.to/);
});

test("a gesture's point: eased between keys, pressed only while it presses (SH-119)", () => {
  const k = Onboard.path("drag", { x: 0, y: 0 }, { x: 100, y: 0 });
  assert.deepEqual(Onboard.pathAt(k, 0), { x: k[0].x, y: k[0].y, press: 0 });
  const mid = Onboard.pathAt(k, (0.3 + 0.85) / 2);
  assert.equal(mid.press, 1, "pressed on the way");
  assert.ok(mid.x > 0 && mid.x < 100);
  assert.equal(Onboard.pathAt(k, 0.3).x, 0, "pressed at from");
  assert.equal(Onboard.pathAt(k, 0.85).x, 100, "at to");
  assert.equal(Onboard.pathAt(k, 1).press, 0, "lifted at the end");
  assert.equal(Onboard.pathAt([], 0.5), null);
});

test("the press that starts the move is one inside the drawn box (SH-236)", () => {
  const b = { x: 10, y: 10, w: 20, h: 20 };
  assert.equal(Onboard.pressIn({ x: 15, y: 15 }, b), true);
  assert.equal(Onboard.pressIn({ x: 9, y: 15 }, b), false);
  assert.equal(Onboard.pressIn({ x: 9, y: 15 }, b, 2), true);
  assert.equal(Onboard.pressIn(null, b), false);
  assert.equal(Onboard.MOVE.back, 2000);
  assert.deepEqual(Onboard.FINGER_LOOKS, ["hand", "circle"]);
  assert.equal(Onboard.fingerLook, "hand", "the hand until Zafar picks (MAA-20)");
});

test("a target's box: a list of rects, or a function giving one, is the box round them all (S19: a finger's start on a thing's parts)", () => {
  assert.deepEqual(Onboard.rectOf([10, 20, 30, 40]), { x: 10, y: 20, w: 30, h: 40 });
  const parts = () => [[10, 20, 30, 40], [0, 50, 20, 30]];
  assert.deepEqual(Onboard.rectOf(parts), { x: 0, y: 20, w: 40, h: 60 });
  assert.deepEqual(Onboard.rectOf([[5, 5, 10, 10], null]), { x: 5, y: 5, w: 10, h: 10 });
  assert.equal(Onboard.rectOf(() => null), null);
  assert.equal(Onboard.rectOf([]), null);
});

test("the machine jumps on to a later step, never back (S19: a step's moment)", () => {
  const m = Onboard.machine([{ spotlight: "#a", wait: "x" }, { spotlight: "#b", wait: "x" }, { spotlight: "#c", wait: "x" }]);
  m.start();
  assert.equal(m.jump(0), false, "not back");
  assert.equal(m.jump(2), true);
  assert.equal(m.state().index, 2);
  assert.equal(m.jump(1), false);
  assert.equal(m.jump(3), true, "past the last: done");
  assert.equal(m.state().phase, "done");
  assert.equal(m.jump(4), false);
});

/* ---- Cook's wiring (js/cook/coach.js) on stubs ---- */
async function coach(stub) {
  globalThis.window = globalThis;
  globalThis.document = globalThis.document || { querySelector: () => null, querySelectorAll: () => [] };
  const { Cook } = await import("../js/cook/ns.js");
  await import("../js/cook/coach.js");
  Object.assign(Cook, { save: {}, speed: 1, UI: { s14: () => true, worldToScreen: (x, y) => ({ x, y }) } }, stub || {});
  return Cook;
}
/** A picture on a 1600x900 canvas drawn 1:1 (world px = page px). */
const pic = (x, y, w, h, extra) => Object.assign({ active: true, visible: true, x: x + w / 2, y: y + h / 2, displayHeight: h, getBounds: () => ({ x, y, right: x + w, bottom: y + h, width: w, height: h }) }, extra || {});
const canvasDoc = () => ({ querySelector: (s) => (s === "#game canvas" ? { getBoundingClientRect: () => ({ left: 0, top: 0, width: 1600, height: 900, right: 1600, bottom: 900 }) } : null), querySelectorAll: () => [] });

test("coach: a script step's moment (`when`) and a step for each (`each`) (MAA-19, SAM-30, CHT-18)", async () => {
  const Cook = await coach();
  const M = Cook.Coach.matches;
  assert.equal(M(undefined, { kind: "tap" }), true, "no when: any step (the old scripts)");
  assert.equal(M("roll", { kind: "roll" }), true);
  assert.equal(M("flip", { kind: "timing", coach: "flip" }), true, "the expectation's coach tag");
  assert.equal(M("roll", { kind: "tap" }), false);
  assert.equal(M({ kind: "tap", key: "^dough" }, { kind: "tap", key: "dough-2" }), true);
  assert.equal(M({ kind: "tap", key: "^dough" }, { kind: "tap", key: "maani-1" }), false);
  assert.equal(M([{ kind: "hold" }, "timing"], { kind: "timing" }), true, "a list: any");
  assert.equal(M("roll", null), false);
});

test("coach: a shelf thing is one whose foot is in the bottom band; it says so itself if it likes (SH-237)", async () => {
  globalThis.document = canvasDoc();
  const Cook = await coach();
  const C = Cook.Coach;
  assert.equal(C.onShelf(pic(100, 700, 80, 118)), true, "a jar standing on the shelf's base (818)");
  assert.equal(C.onShelf(pic(600, 300, 300, 200)), false, "a board in the play area");
  assert.equal(C.onShelf(pic(600, 300, 300, 200, { onShelf: true })), true, "its own word");
  // a thing hopping is judged where it rests
  assert.equal(C.onShelf(pic(100, 580, 80, 60, { y: 610, glowFx: { y: 670 } })), true, "mid-hop, resting in the band");
  delete globalThis.document;
});

test("coach: the scene's glow hops only shelf things (SH-237)", async () => {
  globalThis.document = canvasDoc();
  const Cook = await coach();
  const calls = [];
  const S = { glow(obj, on, o) { calls.push([obj.name, on, o && o.bounce]); } };
  Cook.Coach.hopRule(S);
  const g1 = S.glow;
  Cook.Coach.hopRule(S);
  assert.equal(S.glow, g1, "wrapped once");
  S.glow(pic(100, 700, 80, 118, { name: "jar" }), true, { bounce: true, now: true });
  S.glow(pic(600, 300, 300, 200, { name: "board" }), true, { bounce: true });
  S.glow(pic(600, 300, 300, 200, { name: "board" }), false);
  S.glow(pic(600, 300, 300, 200, { name: "pan" }), true, { now: true });
  assert.deepEqual(calls, [["jar", true, true], ["board", true, false], ["board", false, undefined], ["pan", true, undefined]]);
  delete globalThis.document;
});

test("coach: the lit thing's parts: its picture where it rests (with its hop's room on the shelf), its pill, its face (SH-230)", async () => {
  globalThis.document = canvasDoc();
  const Cook = await coach();
  const C = Cook.Coach;
  // a board in play: its picture alone
  assert.deepEqual(C.parts(pic(600, 300, 300, 200)), [[600, 300, 300, 200]]);
  // its own body (a pan without its handle)
  assert.deepEqual(C.parts(pic(600, 300, 400, 200, { litBounds: () => ({ x: 600, y: 300, right: 800, bottom: 500 }) })), [[600, 300, 200, 200]]);
  // a jar on the shelf, its pill under it, mid-hop: where it rests, its hop's room above, the pill
  const jar = pic(100, 690, 80, 118, { y: 749, glowFx: { y: 759 }, chip: { active: true, x: 140, y: 860, cardW: 90, cardH: 46, scaleX: 1, scaleY: 1 } });
  const p = C.parts(jar);
  assert.deepEqual(p[0], [100, 700, 80, 118], "where it rests");
  assert.deepEqual(p[1].map(Math.round), [100, 688, 80, 12], "its hop's room: a tenth of its height (at least 8)");
  assert.deepEqual(p[2], [95, 837, 90, 46], "its pill");
  // a plate's face circle
  const face = { active: true, visible: true, getBounds: () => ({ x: 900, y: 280, right: 960, bottom: 340 }) };
  assert.deepEqual(C.parts(pic(800, 300, 200, 120, { face }))[1], [900, 280, 60, 60]);
  assert.deepEqual(C.parts(null), []);
  const f = C.thingBox(pic(600, 300, 300, 200));
  assert.deepEqual(f(), [[600, 300, 300, 200]]);
  assert.equal(C.thingBox({ active: false, getBounds: () => null })(), null);
  delete globalThis.document;
});

test("coach: the stuck help, chai's method, any game: after the level's wait, the helper card or Nani's line, with its light (SH-228)", async () => {
  const lit = [];
  const OB = Object.assign({}, Onboard, {
    light(t, o) {
      const h = { o, t, closed: false };
      h.close = () => (h.closed = true);
      lit.push(h);
      return h;
    },
    onRush: () => () => {},
  });
  globalThis.Onboard = OB;
  let last = Date.now();
  globalThis.NaniGuide = { lastAction: () => last };
  let helperOpened = 0;
  let lines = 0;
  let named = true;
  const Cook = await coach({ UI: { s14: () => true, helperOpen: (on) => (on && named ? (helperOpened++, true) : false), stepHelp: () => lines++ } });
  const hints = [];
  const glows = [];
  const h = Cook.Coach.stuck({ hintMs: () => 300, target: () => [0, 0, 10, 10], onHint: (by) => hints.push(by), glow: (on) => glows.push(on) });
  await sleep(150);
  assert.equal(hints.length, 0, "not before the wait");
  await sleep(450);
  assert.deepEqual(hints, ["helper"], "the helper card, her box naming the thing");
  assert.equal(helperOpened, 1);
  assert.equal(lit.length, 1);
  assert.equal(lit[0].o.pass, true, "its light never holds the child");
  assert.deepEqual(glows, [true]);
  await sleep(500);
  assert.equal(hints.length, 1, "once, until the child does something");
  // an action: the light goes, the clock again from it
  last = Date.now();
  named = false;
  await sleep(250);
  assert.equal(lit[0].closed, true);
  await sleep(400);
  assert.deepEqual(hints, ["helper", "line"], "her line again when her box names nothing");
  assert.equal(lines, 1);
  h.close();
  assert.equal(lit[1].closed, true);
  // waiting: false holds it (the game's own moves, the pop-up)
  let waiting = false;
  const w = Cook.Coach.stuck({ hintMs: () => 100, waiting: () => waiting, onHint: (by) => hints.push(by) });
  last = Date.now();
  await sleep(400);
  assert.equal(hints.length, 2);
  waiting = true;
  await sleep(300);
  assert.equal(hints.length, 3);
  w.close();
  delete globalThis.NaniGuide;
});

test("coach: the stuck help given a thing lights the thing's parts, a list from one function (SH-228, SH-230)", async () => {
  globalThis.document = canvasDoc();
  const lit = [];
  globalThis.Onboard = Object.assign({}, Onboard, { light: (t, o) => (lit.push({ t, o }), { close() {} }), onRush: () => () => {} });
  globalThis.NaniGuide = { lastAction: () => Date.now() - 10000 };
  const Cook = await coach({ UI: { s14: () => true, worldToScreen: (x, y) => ({ x, y }), helperOpen: () => true } });
  const jar = pic(100, 700, 80, 118, { chip: { active: true, x: 140, y: 860, cardW: 90, cardH: 46 } });
  const h = Cook.Coach.stuck({ hintMs: () => 0, thing: jar });
  await sleep(300);
  h.close();
  assert.equal(lit.length, 1);
  const parts = lit[0].t();
  assert.ok(Array.isArray(parts) && parts.length === 3, "its picture, its hop's room, its pill");
  assert.deepEqual(parts[2], [95, 837, 90, 46]);
  delete globalThis.NaniGuide;
  delete globalThis.document;
});

test("the light's room: a neighbour reaching a few px into the thing takes that side's margin away (SH-230, chaat's pills)", () => {
  const thing = [{ x: 888, y: 521, w: 97, h: 134 }];
  const b = Onboard.litBox(thing, [{ x: 744, y: 521, w: 146, h: 134 }]);
  assert.equal(b.sides.l, 0, "no margin on the neighbour's side");
  assert.ok(b.sides.r > 8, "the rule's margin elsewhere");
  // one clear of it: trimmed to stay 2 px short, as before
  const c = Onboard.litBox(thing, [{ x: 744, y: 521, w: 136, h: 134 }]);
  assert.equal(c.sides.l, 6);
});
