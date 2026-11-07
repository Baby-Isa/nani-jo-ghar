// The kitchen kit's carry (Sprint 18, piece 7: a pan into its glass): js/shared/pour.js NjgPour.frameOf and holdOver, against the
// reference game's own lines (js/cook/stations/chai-tray.js at 34641d3, its pour: frameOf, extent, inView, spots), so the kit gives
// the same frames and the same place over the glass for every glass and screen.
//   node --test build/test_shared_kitpour.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { NjgPour as P } from "../js/shared/pour.js";

// the reference: chai's own lines, copied as they are
const refFrameOf = (x) => Math.max(1, Math.min(6, 1 + Math.round(x * 2.5)));
function refHold({ well: w, rim, s8, mirror, m, box }) {
  const POUR = { lift: 1.07, gap: 0.12 };
  const extent = (c, z) => {
    const k = (rim * z) / m.r;
    const l = mirror ? c.x - (m.w - m.cx) * k : c.x - m.cx * k;
    return { l, r: l + m.w * k, t: c.y - m.cy * k, b: c.y + (m.h - m.cy) * k };
  };
  const inView = (c, z) => {
    const e = extent(c, z);
    return e.l >= box.l && e.r <= box.r && e.t >= box.t && e.b <= box.b;
  };
  const spots = (z) => {
    const d = w.r + rim * z * (1 + POUR.gap);
    return [{ x: w.x, y: w.y - d }, { x: w.x - d, y: w.y }, { x: w.x, y: w.y + d }];
  };
  const zLift = s8 * POUR.lift;
  let zs = zLift;
  let hold = spots(zs).find((c) => inView(c, zs));
  for (let i = 0; !hold && i < 8; i++) {
    zs = zLift * (1 - 0.05 * (i + 1));
    hold = spots(zs).find((c) => inView(c, zs));
  }
  if (!hold) hold = spots(zs)[0];
  return { hold, zs };
}

test("frameOf: the reference game's six frames (empty 1, half 4, full 6) for every fill", () => {
  for (let x = -0.5; x <= 2.5; x += 0.05) assert.equal(P.frameOf(x), refFrameOf(x), `x ${x}`);
  assert.equal(P.frameOf(0), 1);
  assert.equal(P.frameOf(1), 4, "the half glass is the fill's frame 4");
  assert.equal(P.frameOf(2), 6);
  // another count: the half on the middle frame, the full on the last
  assert.equal(P.frameOf(2, 9), 9);
  assert.equal(P.frameOf(1, 9), 5);
});

test("holdOver: the same place and size as the reference, over a grid of glasses, pan sizes and views", () => {
  const m = { w: 494, h: 328, cx: 179.4, cy: 164.0, r: 159.0 }; // pe-milky-1
  let tried = 0;
  for (const mirror of [true, false])
    for (const s8 of [0.35, 0.5, 0.62])
      for (const wx of [700, 1100, 1450])
        for (const wy of [120, 260, 420])
          for (const top of [-160, 0, 90]) {
            const box = { l: 12, t: top + 12, r: 1588, b: 888 };
            const well = { x: wx, y: wy, r: 60 };
            const ref = refHold({ well, rim: 158, s8, mirror, m, box });
            const got = P.holdOver({ well, rim: 158, scale: s8, meta: m, mirror, box, lift: 1.07, gap: 0.12 });
            assert.deepEqual(got.at, ref.hold, `${mirror} ${s8} ${wx} ${wy} ${top}`);
            assert.equal(got.z, ref.zs);
            tried++;
          }
  assert.equal(tried, 162);
});

test("holdOver: above the glass where it fits, else left, else below; smaller only where none fits", () => {
  const m = { w: 100, h: 100, cx: 50, cy: 50, r: 50 };
  const well = { x: 500, y: 500, r: 40 };
  const big = { l: 0, t: 0, r: 1000, b: 1000 };
  const a = P.holdOver({ well, rim: 50, scale: 1, meta: m, box: big, lift: 1, gap: 0 });
  assert.deepEqual(a.at, { x: 500, y: 410 }, "above");
  const noTop = { l: 0, t: 420, r: 1000, b: 1000 };
  assert.deepEqual(P.holdOver({ well, rim: 50, scale: 1, meta: m, box: noTop, lift: 1, gap: 0 }).at, { x: 410, y: 500 }, "left");
  const tight = { l: 380, t: 380, r: 620, b: 620 };
  const t = P.holdOver({ well, rim: 50, scale: 1, meta: m, box: tight, lift: 1, gap: 0 });
  assert.ok(t.z < 1 && t.z >= 0.6 - 1e-9, "drawn smaller where nothing fits at its size");
});
