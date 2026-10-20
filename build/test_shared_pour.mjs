// The shared pour and fill's plain part (js/shared/pour.js, SH-117): the choreography and the stream's shape.
//   node --test build/test_shared_pour.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { NjgPour as P } from "../js/shared/pour.js";

const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;

test("the plan: lift, tip, pour (the level rises 0 -> 1 only while it pours), untip, back", () => {
  const p = P.plan({ from: { x: 0, y: 0 }, to: { x: 100, y: 50 }, tilt: -60 });
  const m = p.marks;
  assert.equal(p.at(0).phase, "lift");
  assert.equal(p.at(0).fill, 0);
  assert.equal(p.at(m.lift + 1).phase, "tip");
  assert.equal(p.at(m.tip - 1).fill, 0, "nothing fills before the pour");
  assert.ok(p.at((m.tip + m.pour) / 2).fill > 0.3 && p.at((m.tip + m.pour) / 2).fill < 0.7, "half way through the pour, about half full");
  assert.equal(p.at(m.pour + 1).fill, 1);
  assert.equal(p.at(p.total).phase, "done");
  const end = p.at(p.total);
  assert.ok(near(end.x, 0) && near(end.y, 0) && end.angle === 0, "back where it started, upright");
  // the stream runs only while the lip is down
  assert.equal(p.at(m.lift / 2).flow, 0);
  assert.equal(p.at((m.tip + m.pour) / 2).flow, 1);
  assert.equal(p.at(m.untip + 1).flow, 0);
});

test("the level never goes down, and the vessel holds still at its place while it pours", () => {
  const p = P.plan({ from: { x: 0, y: 0 }, to: { x: 100, y: 50 }, tilt: -45 });
  let last = 0;
  for (let t = 0; t <= p.total; t += 10) {
    const f = p.at(t);
    assert.ok(f.fill >= last - 1e-9, `fill went down at ${t}`);
    last = f.fill;
    if (f.phase === "pour") assert.ok(near(f.x, 100) && near(f.y, 50));
  }
});

test("tilt steps (chai's tilt pictures): the angle is one of the steps, and the step index says which", () => {
  const p = P.plan({ from: { x: 0, y: 0 }, to: { x: 0, y: 0 }, tilt: -80, steps: 4 });
  for (let t = 0; t <= p.total; t += 7) {
    const f = p.at(t);
    assert.ok([0, -20, -40, -60, -80].some((a) => near(f.angle, a)), `angle ${f.angle} at ${t}`);
    assert.ok(near(f.angle, f.step * -20));
  }
});

test("holdAt puts the lip where it is asked at full tilt", () => {
  const lip = [-40, -30];
  const want = { x: 200, y: 120 };
  const c = P.holdAt(want, lip, -52);
  const got = P.lipAt({ x: c.x, y: c.y, angle: -52 }, lip);
  assert.ok(near(got.x, want.x) && near(got.y, want.y));
});

test("the stream: from the lip to the surface, narrower where it lands, a closed outline, the splash on the surface", () => {
  const s = P.stream({ x: 0, y: 0 }, { x: 30, y: 100 }, 10, 0);
  assert.equal(s.poly.length, 26);
  assert.ok(near(s.splash.x, 30) && near(s.splash.y, 100));
  const w0 = Math.hypot(s.poly[0].x - s.poly[25].x, s.poly[0].y - s.poly[25].y);
  const w1 = Math.hypot(s.poly[12].x - s.poly[13].x, s.poly[12].y - s.poly[13].y);
  assert.ok(w1 < w0, "tapers towards the surface");
});
