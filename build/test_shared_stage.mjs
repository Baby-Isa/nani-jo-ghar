// Node tests for the stage (js/shared/stage.js): one coordinate service for scenes. The mapping must give exactly
// what Cook (Phaser EXPAND, bottom-anchored) and the clinic (Clinic.Stages.fitScene) give today on every screen,
// and on a 4:3 tablet let play items grow by layout.json's item scale while the safe area stays on screen.
// No browser. Run: node --test build/test_shared_stage.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const Stage = require("../js/shared/stage.js");
const Frame = require("../js/shared/frame.js");
const L = JSON.parse(readFileSync(new URL("../data/layout.json", import.meta.url)));
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg}: ${a} vs ${b}`);

// the clinic's own maths today (js/clinic/stages/common.js S.fitScene), copied as the reference
function clinicFit(W, H, room, A) {
  const need = room.need || [0, 1];
  const span = need[1] - need[0];
  if (W / H >= A) { const w = W, h = W / A; return { w, h, left: 0, top: (H - h) * (room.ay != null ? room.ay : 0.6) }; }
  if (H * A * span <= W) { const h = H, w = H * A, mid = (need[0] + need[1]) / 2; return { w, h, left: Math.min(0, Math.max(W - w, W / 2 - mid * w)), top: 0 }; }
  const w = W / span, h = w / A; return { w, h, left: -need[0] * w, top: H - h };
}
// Cook today: Phaser EXPAND on 1600x900, the design box centred across and on the bottom
function cookFit(W, H) {
  const k = Math.min(W / 1600, H / 900);
  const gw = W / k, gh = H / k;
  return { s: k, left: ((gw - 1600) / 2) * k, top: (gh - 900) * k };
}
const BOXES = [[1106, 768], [644, 390], [600, 360], [1166, 900], [1037, 800], [768, 768], [885, 820], [1024, 1024], [1500, 600]];

test("Cook's 1600x900 design box maps exactly as Phaser EXPAND does today (item scale 1)", () => {
  for (const [W, H] of BOXES) {
    const m = Stage.fit({ box: { w: W, h: H }, scene: { w: 1600, h: 900 } });
    const c = cookFit(W, H);
    near(m.s, c.s, `scale ${W}x${H}`);
    near(m.left, c.left, `left ${W}x${H}`);
    near(m.top, c.top, `top ${W}x${H}`);
  }
});

test("the clinic's rooms (1536x1024, need as the safe area, cover) map exactly as fitScene does today", () => {
  for (const room of [{ need: [0.1, 0.9] }, { need: [0, 1], ay: 0.3 }, { need: [0.25, 0.8] }, {}]) {
    for (const [W, H] of BOXES) {
      const n = room.need || [0, 1];
      const m = Stage.fit({ box: { w: W, h: H }, scene: { w: 1536, h: 1024, safe: [n[0] * 1536, null, n[1] * 1536, null], fill: "cover", anchorY: room.ay != null ? room.ay : 0.6 } });
      const c = clinicFit(W, H, room, 1.5);
      near(m.w, c.w, `w ${W}x${H} ${JSON.stringify(room)}`);
      near(m.h, c.h, `h ${W}x${H}`);
      near(m.left, c.left, `left ${W}x${H}`);
      near(m.top, c.top, `top ${W}x${H}`);
    }
  }
});

test("toScreen and toScene are inverses; view is the visible part", () => {
  const m = Stage.fit({ box: { w: 768, h: 768 }, scene: { w: 1600, h: 900, safe: [150, 0, 1450, 900] }, itemScale: 1.25 });
  for (const [x, y] of [[0, 0], [800, 450], [1600, 900], [150, 700]]) {
    const p = m.toScreen(x, y);
    const q = m.toScene(p.x, p.y);
    near(q.x, x, "x");
    near(q.y, y, "y");
  }
  near(m.toScreen(m.view.x0, m.view.y0).x, 0, "view left edge");
  near(m.toScreen(m.view.x1, m.view.y1).y, 768, "view bottom edge");
});

test("on a 4:3 tablet play items grow by the item scale, the safe area stays on screen, the picture sits on the bottom", () => {
  const ff = Frame.compute(L, 1024, 768);
  assert.equal(ff.ff, "tablet");
  assert.ok(ff.itemScale > 1, "a tablet has an item scale above 1");
  const W = 1024 - ff.sideW, H = 768;
  const plain = Stage.fit({ box: { w: W, h: H }, scene: { w: 1600, h: 900, safe: [100, 0, 1500, 900] } });
  const grown = Stage.fit({ box: { w: W, h: H }, scene: { w: 1600, h: 900, safe: [100, 0, 1500, 900] }, itemScale: ff.itemScale });
  assert.ok(grown.s > plain.s * 1.1, `items grow: ${plain.s.toFixed(3)} -> ${grown.s.toFixed(3)}`);
  assert.ok(grown.view.x0 <= 100 + 1e-6 && grown.view.x1 >= 1500 - 1e-6, "the safe area is all on screen");
  near(grown.top + grown.h, H, "the picture's bottom is the box's bottom");
  // a laptop: no change at all
  const lap = Frame.compute(L, 1366, 768);
  assert.equal(lap.itemScale, 1);
  const a = Stage.fit({ box: { w: 1366 - lap.sideW, h: 768 }, scene: { w: 1600, h: 900, safe: [100, 0, 1500, 900] }, itemScale: lap.itemScale });
  near(a.s, a.sFit, "laptop: the plain fit");
});

test("the item scale never crops into the safe area, however big", () => {
  const m = Stage.fit({ box: { w: 700, h: 900 }, scene: { w: 1600, h: 900, safe: [400, 0, 1200, 900] }, itemScale: 10 });
  assert.ok(m.view.x0 <= 400 + 1e-6 && m.view.x1 >= 1200 - 1e-6);
  near(m.s, 700 / 800, "the safe area's width fills the box");
});

test("art: @2x only when the screen needs it and the file exists; always stamped", () => {
  const seen = [];
  globalThis.njgV = (u) => (seen.push(u), `${u}?v=T`);
  try {
    assert.equal(Stage.art("assets/a/b.webp", { drawn: 1, dpr: 1 }), "assets/a/b.webp?v=T");
    assert.equal(Stage.art("assets/a/b.webp", { drawn: 1, dpr: 2 }), "assets/a/b.webp?v=T", "no @2x file: the 1x");
    Stage.has2x.add("assets/a/b.webp");
    assert.equal(Stage.art("assets/a/b.webp", { drawn: 1, dpr: 2 }), "assets/a/b@2x.webp?v=T");
    assert.equal(Stage.art("assets/a/b.webp", { drawn: 0.5, dpr: 2 }), "assets/a/b.webp?v=T", "drawn at half size on a 2x screen: 1x is enough");
    assert.equal(Stage.at2x("x/y.png"), "x/y@2x.png");
  } finally {
    delete globalThis.njgV;
    Stage.has2x.clear();
  }
});
