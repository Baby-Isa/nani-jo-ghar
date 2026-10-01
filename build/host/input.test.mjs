// js/shared/input.js: one feel for every gesture (E5, E13, E14, F2). Run: node --test build/host/
import { test } from "node:test";
import assert from "node:assert/strict";
import { FEEL, classify, swipeDir, turnsOf, hitBox, pick, createInput, createPlacements } from "../../js/shared/input.js";
import { FakeEl, fakeDoc, pointer, stroke } from "./fake-dom.mjs";

const circlePts = (cx, cy, r, turns, n = 48, t0 = 0) => Array.from({ length: Math.round(n * turns) + 1 }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI), t0 + i * 16]);

test("classify: a still press is a tap, a quick stroke a swipe, a slow move a drag", () => {
  assert.equal(classify([{ x: 0, y: 0, t: 0 }, { x: 4, y: 3, t: 120 }]).kind, "tap");
  const s = classify([{ x: 0, y: 0, t: 0 }, { x: 60, y: 5, t: 100 }, { x: 120, y: 8, t: 200 }]);
  assert.equal(s.kind, "swipe");
  assert.equal(s.dir, "right");
  assert.equal(classify([{ x: 0, y: 0, t: 0 }, { x: 40, y: 40, t: 900 }, { x: 80, y: 90, t: 1600 }]).kind, "drag");
  // held too long without moving: not a tap
  assert.equal(classify([{ x: 0, y: 0, t: 0 }, { x: 1, y: 1, t: FEEL.tapMs + 50 }]).kind, "none");
  assert.deepEqual([swipeDir(10, 2), swipeDir(-10, 2), swipeDir(1, -9), swipeDir(1, 9)], ["right", "left", "up", "down"]);
});

test("turnsOf: one lap round the centre is one turn, either way round", () => {
  const pts = circlePts(100, 100, 50, 1).map(([x, y]) => ({ x, y }));
  assert.ok(Math.abs(Math.abs(turnsOf(pts, { x: 100, y: 100 })) - 1) < 0.01);
  assert.ok(Math.abs(Math.abs(turnsOf(pts.slice().reverse(), { x: 100, y: 100 })) - 1) < 0.01);
});

test("hit areas: a small target answers in a 48 x 48 box round its centre; a drawn box wins over a near one", () => {
  const hb = hitBox({ left: 100, top: 100, width: 20, height: 20 });
  assert.deepEqual(hb, { x: 86, y: 86, width: 48, height: 48 });
  const big = hitBox({ left: 0, top: 0, width: 80, height: 60 });
  assert.equal(big.width, 80);
  const a = { id: "a", rect: { left: 100, top: 100, width: 20, height: 20 } };
  const b = { id: "b", rect: { left: 125, top: 100, width: 20, height: 20 } };
  assert.equal(pick([a, b], 110, 110).id, "a"); // inside a's drawn box
  assert.equal(pick([a, b], 122, 110).id, "a"); // between them, nearer a's centre
  assert.equal(pick([a, b], 124, 110).id, "b");
  assert.equal(pick([a, b], 300, 300), null);
});

function setup(gestures, onAct) {
  const doc = fakeDoc();
  const root = doc.body.appendChild(new FakeEl("div", { rect: { left: 0, top: 0, width: 1000, height: 600 } }));
  const warns = [];
  const I = createInput(root, { gestures, onAct, warn: (m) => warns.push(m) });
  return { root, I, warns };
}

test("tap: a 20 px target still takes a touch 15 px from its centre; hitAreas reports it small but with a 48 px hit box", () => {
  const { root, I } = setup(["tap"]);
  const dot = root.appendChild(new FakeEl("button", { id: "dot", rect: { left: 200, top: 200, width: 20, height: 20 } }));
  const got = [];
  I.tap(dot, (a) => got.push(a));
  stroke(root, [[225, 210, 0], [225, 211, 80]]);
  assert.equal(got.length, 1);
  assert.equal(got[0].id, "dot");
  const [h] = I.hitAreas();
  assert.equal(h.small, true);
  assert.equal(h.ok, true);
  assert.equal(h.hit.width, 48);
  // a touch outside the 48 box does nothing
  stroke(root, [[260, 260, 200], [260, 260, 260]]);
  assert.equal(got.length, 1);
});

test("E13: a gesture the game didn't declare is refused", () => {
  const { root, I, warns } = setup(["tap"]);
  const el = root.appendChild(new FakeEl("div", { rect: { left: 0, top: 0, width: 100, height: 100 } }));
  assert.equal(I.swipe(el, () => {}), null);
  assert.equal(warns.length, 1);
  assert.match(warns[0], /E13/);
});

test("drag: start, move and drop, with what it was let go over", () => {
  const { root, I } = setup(["tap", "drag"]);
  const jug = root.appendChild(new FakeEl("div", { id: "jug", rect: { left: 100, top: 100, width: 80, height: 80 } }));
  const pan = root.appendChild(new FakeEl("div", { id: "pan", rect: { left: 500, top: 300, width: 120, height: 120 } }));
  const log = [];
  I.drag(jug, { start: () => log.push("start"), move: (a) => log.push(`move:${a.over || "-"}`), drop: (a) => log.push(`drop:${a.over}`) });
  I.drop(pan);
  stroke(root, [[140, 140, 0], [300, 200, 200], [560, 360, 400]]);
  assert.equal(log[0], "start");
  assert.ok(log.includes("move:pan"));
  assert.equal(log[log.length - 1], "drop:pan");
});

test("swipe: only in the asked direction", () => {
  const { root, I } = setup(["swipe"]);
  const board = root.appendChild(new FakeEl("div", { rect: { left: 0, top: 0, width: 600, height: 400 } }));
  const got = [];
  I.swipe(board, (a) => got.push(a.dir), { dir: "right" });
  stroke(root, [[100, 200, 0], [180, 205, 80], [260, 210, 160]]);
  stroke(root, [[300, 200, 300], [220, 205, 380], [140, 210, 460]]); // leftwards: ignored
  assert.deepEqual(got, ["right"]);
});

test("circle: a stir counts a turn each lap", () => {
  const { root, I } = setup(["circle"]);
  const pot = root.appendChild(new FakeEl("div", { rect: { left: 300, top: 200, width: 200, height: 200 } }));
  const turns = [];
  I.circle(pot, (a) => turns.push(a.turns));
  stroke(root, circlePts(400, 300, 70, 2.1));
  assert.deepEqual(turns, [1, 2]);
});

test("E5: input is live while a line plays: every action reports at once (onAct), nothing waits", () => {
  const acts = [];
  const { root, I } = setup(["tap"], (a) => acts.push(a.kind));
  const b = root.appendChild(new FakeEl("button", { rect: { left: 10, top: 10, width: 60, height: 60 } }));
  let speaking = true; // a line is "playing" the whole time
  const got = [];
  I.tap(b, () => got.push(speaking));
  stroke(root, [[40, 40, 0], [40, 40, 50]]);
  assert.deepEqual(got, [true]);
  assert.deepEqual(acts, ["tap"]);
  speaking = false;
});

test("off, clear and destroy stop the routing", () => {
  const { root, I } = setup(["tap"]);
  const b = root.appendChild(new FakeEl("button", { rect: { left: 10, top: 10, width: 60, height: 60 } }));
  let n = 0;
  I.tap(b, () => n++);
  I.off(b);
  stroke(root, [[40, 40, 0], [40, 40, 50]]);
  I.tap(b, () => n++);
  I.destroy();
  pointer(root, "pointerdown", 40, 40, 100);
  pointer(root, "pointerup", 40, 40, 150);
  assert.equal(n, 0);
});

test("E14 take it back until Done: the first placement scores; undo works until done()", () => {
  const P = createPlacements();
  assert.deepEqual(P.place("cup-1", "dudh"), { ok: true, first: true });
  assert.equal(P.takeBack("cup-1"), "dudh");
  assert.equal(P.at("cup-1"), null);
  assert.deepEqual(P.place("cup-1", "khun"), { ok: true, first: false });
  assert.deepEqual(P.firsts(), { "cup-1": "dudh" });
  assert.deepEqual(P.current(), { "cup-1": "khun" });
  assert.deepEqual(P.done(), { "cup-1": "khun" });
  assert.equal(P.takeBack("cup-1"), null);
  assert.equal(P.place("cup-2", "x").ok, false);
  assert.equal(P.history().length, 3);
});
