// The box reader's pure parts (Sprint 20 P4): the exact comparison, the pixel comparison, the stand's arm, and the stand itself
// never arming outside the harness or in a store build.   node --test build/sandbox/lib/boxes.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { diffRead, diffPage, moveOf, pixelDiff, pixelRegion, armScript, STAND_FILE, MOMENTS, GAMES } from "./boxes.mjs";

const read = (boxes, texts = {}) => ({ boxes, texts, info: {} });

test("identical reads have no difference; any change, however small, is one", () => {
  const a = read({ tray: [100, 50, 300, 250], side: [0, 0, 345.59, 665] });
  assert.deepEqual(diffRead(a, structuredClone(a)), []);
  const b = read({ tray: [104, 50, 304, 250], side: [0, 0, 345.59, 665] });
  const d = diffRead(a, b);
  assert.equal(d.length, 1);
  assert.equal(d[0].name, "tray");
  assert.equal(d[0].by, "left +4, right +4");
  const c = read({ tray: [100, 50, 300, 250], side: [0, 0, 345.6, 665] });
  assert.equal(diffRead(a, c)[0].by, "right +0.01");
});

test("a box that comes or goes is a difference", () => {
  const a = read({ tray: [1, 2, 3, 4] });
  const b = read({ tray: [1, 2, 3, 4], "light-1": [5, 6, 7, 8] });
  assert.deepEqual(diffRead(a, b).map((x) => [x.name, x.by]), [["light-1", "new"]]);
  assert.deepEqual(diffRead(b, a).map((x) => [x.name, x.by]), [["light-1", "gone"]]);
});

test("a word that is cut, changed or moved is a difference", () => {
  const t = { box: [10, 10, 60, 30], cut: false, text: "paani" };
  const a = read({}, { "nani/ng-line#1": t });
  assert.deepEqual(diffRead(a, read({}, { "nani/ng-line#1": { ...t, cut: true } })).map((x) => [x.kind, x.by]), [["cut", "now cut"]]);
  assert.deepEqual(diffRead(a, read({}, { "nani/ng-line#1": { ...t, text: "dudh" } })).map((x) => x.kind), ["words"]);
  assert.deepEqual(diffRead(a, read({}, { "nani/ng-line#1": { ...t, box: [10, 10, 30, 30] } })).map((x) => x.by), ["right -30"]);
});

test("a page's moments: a moment missing on either side is reported, differences carry their moment", () => {
  const p = (ms) => ({ moments: Object.fromEntries(ms.map(([m, b]) => [m, { read: read(b) }])) });
  const ref = p([["order", { side: [0, 0, 1, 1] }], ["end", { side: [0, 0, 1, 1] }]]);
  const cur = p([["order", { side: [0, 0, 1, 2] }]]);
  const r = diffPage(ref, cur);
  assert.deepEqual(r.missing, [{ moment: "end", in: "run" }]);
  assert.equal(r.diffs[0].moment, "order");
  assert.equal(moveOf([0, 0, 1, 1], [0, 0, 1, 1]), "same");
});

test("pixels: counted inside the region only", () => {
  const img = (w, h, f) => { const data = new Uint8Array(w * h * 4); for (let i = 0; i < w * h; i++) data[i * 4] = f(i % w, Math.floor(i / w)); return { w, h, data }; };
  const a = img(10, 10, () => 0);
  const b = img(10, 10, (x, y) => (x === 8 && y === 8 ? 255 : 0));
  assert.deepEqual(pixelDiff(a, b), { n: 1, box: [8, 8, 9, 9] });
  assert.deepEqual(pixelDiff(a, b, [0, 0, 5, 5]), { n: 0 });
  assert.equal(pixelDiff(a, img(9, 10, () => 0)).n, -1);
  assert.deepEqual(pixelRegion(read({ "card-1": [10, 20, 30, 40], pop: [25, 5, 60, 30] }), "order"), [10, 5, 60, 40]);
  assert.equal(pixelRegion(read({}), "end"), null);
});

test("the arm names the six moments, each with its condition or its note", () => {
  assert.deepEqual(MOMENTS, ["order", "light", "mid", "serve", "praise", "end"]);
  const s = armScript("chai-tray", { seed: 7 });
  for (const m of MOMENTS) assert.match(s, new RegExp(`name: "${m}"`));
  assert.match(s, /note: "dom"/);
  assert.match(s, /note: "serve-trays"/);
  assert.throws(() => armScript("nope"));
  // the arm is a script the page can run (its functions parse)
  assert.doesNotThrow(() => new vm.Script(s));
  assert.ok(GAMES["chai-tray"].main.tray);
});

// the stand in a bare window: it must do nothing unless armed, and nothing in a store build
const standIn = (win) => {
  const ctx = vm.createContext({ window: win, Math: Object.create(Math), Date: { now: () => 1 }, performance: { now: () => 1 }, Object, Array, Map, Function, isFinite, JSON });
  ctx.window.setTimeout = () => 1; ctx.window.clearTimeout = () => {}; ctx.window.setInterval = () => 1;
  ctx.window.requestAnimationFrame = () => 1; ctx.window.cancelAnimationFrame = () => {}; ctx.window.addEventListener = () => {};
  vm.runInContext(readFileSync(STAND_FILE, "utf8"), ctx);
  return ctx;
};
test("the stand-still switch does nothing outside the harness or in a store build", () => {
  assert.equal(standIn({}).window.njgStand, undefined);
  assert.equal(standIn({ NJG_BUILD: "store", __njgStandArm: { seed: 7, moments: [] } }).window.njgStand, undefined);
  const armed = standIn({ __njgStandArm: { seed: 7, moments: [] } });
  assert.equal(typeof armed.window.njgStand.go, "function");
});

test("the stand's dice: the same seed draws the same numbers, and reseed starts them again", () => {
  const draw = () => { const c = standIn({ __njgStandArm: { seed: 7, moments: [] } }); return [c.Math.random(), c.Math.random(), c.Math.random()]; };
  const one = draw();
  assert.deepEqual(draw(), one);
  const c = standIn({ __njgStandArm: { seed: 7, moments: [] } });
  const x = c.Math.random();
  c.window.njgStand.reseed();
  assert.equal(c.Math.random(), x);
});
