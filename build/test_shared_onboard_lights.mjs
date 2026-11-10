// Node tests for the lights and lessons kit (Sprint 18, module map pieces 13-14; kit builder d): the pure parts of
// js/shared/onboard.js (the times, the zoom-in's box, the first-time gate, the stuck hint's clock and its rush, a hint never saying
// a word past support) and Cook's wiring in js/cook/coach.js (the gate on Cook's save, the stuck rungs' word gate, the call with
// its light, the next vessel, a wrong move), on stubs. No browser: the page parts are lab/sections/kit-lights.html.
// Run: node --test build/test_shared_onboard_lights.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Onboard = require("../js/shared/onboard.js");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("lights: the times are the standard's (values.md D1, D2)", () => {
  assert.deepEqual(Onboard.WAIT, { breath: 1000, breathMax: 3000, still: 8000, settle: 6000, nextVessel: 800, nextLit: 5000, lessonLit: 6000, lessonEnd: 900 });
  assert.equal(Onboard.ZOOM.total(), 1100);
  assert.deepEqual(Onboard.RUNGS, [0, 5000, 15000]);
});

test("the zoom-in: the whole thing first, then the box shrinks onto the part (SH-213)", () => {
  const whole = { x: 100, y: 100, w: 200, h: 120 };
  const part = { x: 150, y: 180, w: 40, h: 10 };
  assert.deepEqual(Onboard.zoomBox(whole, part, 0), { x: 96, y: 96, w: 208, h: 128 }, "the whole thing with ZOOM.pad round it");
  assert.deepEqual(Onboard.zoomBox(whole, part, 0, { pad: 4 }), whole, "less the light's own pad");
  assert.deepEqual(Onboard.zoomBox(whole, part, Onboard.ZOOM.hold - 1), { x: 96, y: 96, w: 208, h: 128 }, "held whole");
  const mid = Onboard.zoomBox(whole, part, Onboard.ZOOM.hold + Onboard.ZOOM.shrink / 2);
  assert.ok(mid.w < 208 && mid.w > 40 && mid.x > 96 && mid.x < 150, "shrinking");
  assert.equal(Onboard.zoomBox(whole, part, Onboard.ZOOM.total()), part, "the part alone");
  assert.equal(Onboard.zoomBox(whole, part, Onboard.ZOOM.hold, { reduced: true }), part, "reduced motion: no shrink");
  // a face circle over the card's top: the box's top edge stops clear of it (contract-82)
  const z = Onboard.zoomBox(whole, part, 0, { avoid: [{ x: 120, y: 80, w: 30, h: 30 }] });
  assert.equal(z.y, 111);
  assert.equal(z.y + z.h, 224, "its foot unmoved");
  assert.equal(Onboard.zoomBox(null, part, 0), part);
});

test("the first time: once per player, a shared lesson once a round for the New player (STD-D1-01)", () => {
  const seen = {};
  const g = Onboard.firsts("pan-game", { seen, fresh: true });
  assert.equal(g.key("knob"), "pan-game:s14-knob");
  assert.equal(g.key("reveal-word", true), "*:s14-reveal-word");
  assert.equal(g.due("knob"), true);
  assert.equal(g.first("knob"), true);
  assert.equal(g.first("knob"), false, "once");
  assert.equal(seen["pan-game:s14-knob"], true);
  assert.equal(Onboard.firsts("pan-game", { seen, fresh: true }).due("knob"), false, "kept in the record");
  assert.equal(Onboard.firsts("pan-game", { seen: {}, fresh: false }).due("knob"), false, "not fresh: never");
  // the lesson every game shares: spent only when lit; the New player has it again next round
  const r1 = new Set();
  const np = Onboard.firsts("pan-game", { seen, fresh: true, newPlayer: true, round: r1 });
  assert.equal(np.due("reveal-word", true), true);
  assert.equal(np.spent("reveal-word", true), false);
  np.spend("reveal-word", true);
  assert.equal(np.due("reveal-word", true), false);
  assert.equal(np.spent("reveal-word", true), true);
  assert.equal(Onboard.firsts("other-game", { seen, fresh: true, newPlayer: true, round: new Set() }).due("reveal-word", true), true, "a new round");
  assert.equal(Onboard.firsts("other-game", { seen, fresh: true, round: new Set() }).due("reveal-word", true), false, "not the New player: once ever");
  // a game's own first time stays once a visit for the New player too (its record)
  assert.equal(Onboard.firsts("pan-game", { seen, fresh: true, newPlayer: true, round: new Set() }).due("knob"), false);
});

test("stuck: the hint's clock and a wrong move's rush (STD-D2-03, STD-D2-04)", () => {
  assert.equal(Onboard.hintDue(1000, 4000, 7000, false), 11000, "from the last action");
  assert.equal(Onboard.hintDue(5000, 4000, 7000, false), 12000, "from the step's opening");
  assert.equal(Onboard.hintDue(5000, 4000, 7000, true), 0, "rushed: now");
  assert.equal(Onboard.rushRung({ glowAt: 7000, at: [0, null, null] }), "g", "the light help");
  assert.equal(Onboard.rushRung({ glowAt: 7000, at: [0, null, null], fired: { g: true } }), null, "already up");
  assert.equal(Onboard.rushRung({ at: [0, 5000, 15000] }), 1, "the box");
  assert.equal(Onboard.rushRung({ glowAt: 5000, at: [0, 12000, null], fired: { g: true } }), 1, "the light help up: the box next");
  assert.equal(Onboard.rushRung({ glowAt: 5000, at: [0, 12000, null], spot: true }), 1);
  assert.equal(Onboard.rushRung({ at: [0, 5000, 15000], fired: { 1: true } }), null);
});

test("a hint never says a word past support (STD-D2-05)", () => {
  assert.equal(Onboard.hintHides({ answer: true, stage: 1 }), false);
  assert.equal(Onboard.hintHides({ answer: true, stage: 2 }), false);
  assert.equal(Onboard.hintHides({ answer: true, stage: 3 }), true);
  assert.equal(Onboard.hintHides({ answer: true, stage: 4, study: true }), false, "study: Nani helps, a redo");
  assert.equal(Onboard.hintHides({ answer: false, stage: 4 }), false, "not the answer: the water, the tea");
  assert.equal(Onboard.hintHides({ answer: true, stage: null }), true, "no word known: no hint");
});

/* ---- Cook's wiring (js/cook/coach.js) on stubs ---- */
async function coach(stub) {
  globalThis.window = globalThis;
  globalThis.document = globalThis.document || { querySelector: () => null, querySelectorAll: () => [] };
  const { Cook } = await import("../js/cook/ns.js");
  await import("../js/cook/coach.js");
  Object.assign(Cook, { save: {}, speed: 1, UI: { s14: () => true } }, stub || {});
  return Cook;
}

test("coach: the first-time gate on Cook's save, fresh until the game's coach is seen", async () => {
  const Cook = await coach();
  globalThis.Onboard = Onboard;
  Cook.save = {};
  const g = Cook.Coach.firsts("pan-game");
  assert.equal(g.fresh, true);
  assert.equal(g.first("knob"), true);
  assert.equal(Cook.save.seenStation["pan-game:s14-knob"], true);
  Cook.save.coached = { "pan-game": true };
  assert.equal(Cook.Coach.firsts("pan-game").fresh, false, "coached: no first-time help");
  Cook.UI = { s14: () => false };
  assert.equal(Cook.Coach.firsts("other").fresh, false, "the s14 look off");
  Cook.UI = { s14: () => true };
});

test("coach: the stuck rungs keep their call, and an asked-for word past support gets none (STD-D2-05)", async () => {
  const Cook = await coach();
  const calls = [];
  globalThis.Onboard = Object.assign({}, Onboard, { stuck: (name, o) => (calls.push([name, o.id]), { done() {}, rush() {} }) });
  Cook.data = { onboard: { "pan-game": [{ step: "water" }, { step: "cups" }] } };
  Cook.save = {};
  Cook.wordStage = (id) => ({ "w-known": 4, "w-new": 1 })[id];
  assert.ok(Cook.Coach.rungs("pan-game", "water", {}), "a step with no word: as before");
  assert.equal(Cook.Coach.rungs("pan-game", "cups", { word: "w-known", answer: true }), null);
  assert.ok(Cook.Coach.rungs("pan-game", "cups", { word: "w-known", answer: true, study: true }), "study");
  assert.ok(Cook.Coach.rungs("pan-game", "cups", { word: "w-new", answer: true }), "supported");
  assert.equal(Cook.Coach.rungs("pan-game", "nope", {}), null, "a step the script lacks");
  assert.deepEqual(calls.map((c) => c[1]), ["cook/pan-game/water", "cook/pan-game/cups", "cook/pan-game/cups"]);
});

/** A fake light kit: records each light, its options and when it goes. */
function fakeLights() {
  const lit = [];
  const rushers = new Set();
  const OB = Object.assign({}, Onboard, {
    light(t, o) {
      const h = { o, t, closed: false, box: () => ({}), done: null };
      let gone;
      h.done = new Promise((r) => (gone = r));
      h.close = h.stop = () => ((h.closed = true), gone());
      if (o && o.ms != null) setTimeout(h.close, o.ms);
      lit.push(h);
      return h;
    },
    onRush: (fn) => (rushers.add(fn), () => rushers.delete(fn)),
    rush: (by) => [...rushers].forEach((fn) => fn(by)),
  });
  return { OB, lit, rushers };
}

test("coach: the call with its light: the first time, the call held until the light is up (STD-D1-06)", async () => {
  const Cook = await coach();
  const { OB, lit } = fakeLights();
  globalThis.Onboard = OB;
  let held = null;
  let said = false;
  Cook.UI = { s14: () => true, holdCalls: (p) => (held = Promise.resolve(p).then(() => (said = true))) };
  Cook.scene = null;
  const glows = [];
  const h = Cook.Coach.control({ target: () => [0, 0, 10, 10], first: true, key: "pan-game", onLight: (on, rung) => glows.push([on, rung]) });
  assert.ok(held, "the call is held");
  assert.equal(lit.length, 1, "lit at once (no breath asked)");
  assert.equal(lit[0].o.pad, 4);
  assert.equal(said, false);
  await held;
  assert.equal(said, true, "the call lets go once the light is up");
  assert.deepEqual(glows, [[true, 0]]);
  h.close();
  assert.equal(lit[0].closed, true);
});

test("coach: after the first time, the call alone, the light after the wait, at once on a wrong move (STD-D2-01, STD-D2-04)", async () => {
  const Cook = await coach();
  const { OB, lit, rushers } = fakeLights();
  globalThis.Onboard = OB;
  globalThis.NaniGuide = { lastAction: () => Date.now() - 50 };
  Cook.UI = { s14: () => true, holdCalls() {} };
  let hints = 0;
  const h = Cook.Coach.control({ target: () => [0, 0, 10, 10], first: false, hintMs: () => 60000, round: true, onHint: () => hints++ });
  await sleep(450);
  assert.equal(lit.length, 0, "no light before the level's wait");
  assert.equal(rushers.size, 1, "listening for a wrong move");
  Cook.Coach.wrong();
  await sleep(450);
  assert.equal(lit.length, 1, "a wrong move: the light at once");
  assert.equal(hints, 1);
  // (Zafar, 10 Nov, SH-249/SH-257: every light one rounded rectangle; a game's round is refused, the kit's own light drawn)
  assert.equal(lit[0].o.round, undefined);
  assert.equal(lit[0].o.pad, 4);
  assert.equal(lit[0].o.kit, true);
  h.close();
  assert.equal(rushers.size, 0, "stops listening when the step goes");
  // a timed control: the call alone, never a stuck light
  const n = Cook.Coach.control({ target: () => [0, 0, 10, 10], first: false, noHint: true, hintMs: () => 0 });
  await sleep(450);
  assert.equal(lit.length, 1);
  n.close();
  delete globalThis.NaniGuide;
});

test("coach: the next vessel's light after its delay, only if still right (STD-D1-10)", async () => {
  const Cook = await coach();
  const { OB, lit } = fakeLights();
  globalThis.Onboard = OB;
  Cook.speed = 10; // (the test speed: 800 ms -> 80 ms)
  let ok = false;
  Cook.Coach.nextLight({ target: () => [0, 0, 50, 50], ok: () => ok, who: "b" });
  await sleep(150);
  assert.equal(lit.length, 0, "the game says no: nothing");
  ok = true;
  const n = Cook.Coach.nextLight({ target: () => [0, 0, 50, 50], ok: () => ok, who: "b", quitIf: () => false });
  assert.equal(lit.length, 0, "not before its delay");
  await sleep(150);
  assert.equal(lit.length, 1);
  assert.ok(!lit[0].o.round, "a rounded rectangle, never a circle (Zafar, 10 Nov)");
  assert.equal(lit[0].o.ms, 500, "nextLit at the game's speed");
  n.stop();
  assert.equal(lit[0].closed, true);
  Cook.Coach.nextLight({ target: () => [0, 0, 50, 50], now: true });
  assert.equal(lit.length, 2, "now: a wrong move into a served vessel");
  Cook.speed = 1;
});
