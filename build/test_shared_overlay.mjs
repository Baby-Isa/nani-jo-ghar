// Node tests for js/shared/overlay.js and data/shared/overlays.json: the
// data is consistent, layout puts each layer's pivot on its anchor, fit
// nudges apply, slots replace, mirror flips, hit-testing, and the canvas
// renderer draws greybox shapes with no images and tinted sprites with them
// (on a recording fake context).
// Run: node --test build/test_shared_overlay.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const O = require("../js/shared/overlay.js");
const DATA = require("../data/shared/overlays.json");
O.load(DATA);
const near = (a, b, eps = 0.01) => Math.abs(a - b) <= eps;

test("data: every base image exists, anchors are in 0..1, layers name real anchors", () => {
  const anchorNames = new Set();
  for (const [id, b] of Object.entries(DATA.bases)) {
    if (b.img) assert.ok(fs.existsSync(new URL("../" + b.img, import.meta.url)), `${id}: ${b.img}`);
    for (const [n, a] of Object.entries(b.anchors)) {
      assert.ok(a[0] >= 0 && a[0] <= 1 && a[1] >= 0 && a[1] <= 1, `${id}.${n}`);
      anchorNames.add(n);
    }
    for (const l of Object.keys(b.fit || {})) assert.ok(O.layerDef(l), `${id}.fit.${l}`);
  }
  for (const [id, l] of Object.entries(DATA.layers)) assert.ok(anchorNames.has(l.anchor), `${id}: anchor ${l.anchor}`);
});

test("layout: the base is fitted bottom-centred; a layer's pivot sits on its anchor", () => {
  const fig = O.figure("grey-person", ["ov-glasses-round"]);
  const rect = { x: 100, y: 50, w: 400, h: 400 };
  const list = O.layout(fig, rect);
  const base = list.find((e) => e.kind === "base");
  assert.ok(near(base.w, 300) && near(base.h, 400) && near(base.x, 150) && near(base.y, 50));
  const g = list.find((e) => e.id === "ov-glasses-round");
  const [ax, ay] = O.anchorAt(fig, rect, "eyes");
  assert.ok(near(g.x + 0.5 * g.w, ax) && near(g.y + 0.5 * g.h, ay));
  assert.ok(near(g.w, 0.42 * 300));
  assert.ok(near(ay, 50 + 0.25 * 400));
});

test("layout: fit nudges per base, z order, a dupatta behind, items by template", () => {
  const fig = O.figure("cousin-upper", ["ov-cap", "ov-dupatta", { id: "item:fru-01" }]);
  const list = O.layout(fig, { x: 0, y: 0, w: 255, h: 379 }, { itemImage: (id) => `assets/items/${id}.webp` });
  assert.ok(near(list.find((e) => e.id === "ov-cap").w, 0.64 * 255), "cousin's bigger head");
  assert.deepEqual(list.map((e) => e.id), ["ov-dupatta", "cousin-upper", "ov-cap", "item:fru-01"]);
  const item = list.find((e) => e.id === "item:fru-01");
  assert.equal(item.img, "assets/items/fru-01.webp");
  assert.equal(item.label, "fru-01");
  assert.equal(list.find((e) => e.id === "ov-cap").tint, DATA.colours.white, "default tint");
});

test("wear replaces the slot; remove by id or slot; unknown anchors are skipped, not misdrawn", () => {
  let fig = O.figure("grey-person", ["ov-scarf"]);
  fig = O.wear(fig, "ov-shawl", { tint: "green" });
  assert.deepEqual(fig.layers.map((l) => l.id), ["ov-shawl"], "one wrap at a time");
  assert.equal(O.layout(fig, { x: 0, y: 0, w: 300, h: 400 })[1].tint, DATA.colours.green);
  fig = O.wear(fig, "ov-glasses-rect");
  assert.equal(O.remove(fig, "wrap").layers.length, 1);
  assert.equal(O.remove(fig, "ov-glasses-rect").layers.length, 1);
  const list = O.layout(O.figure("grey-person", ["ov-trace", "no-such"]), { x: 0, y: 0, w: 300, h: 400 });
  assert.deepEqual(list.skipped, ["ov-trace", "no-such"], "a person has no paws");
  assert.equal(O.layout(O.figure("grey-cat", ["ov-trace"]), { x: 0, y: 0, w: 300, h: 300 }).skipped.length, 0);
});

test("mirror flips every box about the base's centre", () => {
  const rect = { x: 0, y: 0, w: 300, h: 400 };
  const a = O.layout(O.figure("ma-upper", ["ov-glasses-round"]), rect);
  const b = O.layout(O.figure("ma-upper", ["ov-glasses-round"], { mirror: true }), rect);
  const ga = a.find((e) => e.kind === "layer");
  const gb = b.find((e) => e.kind === "layer");
  const base = a.find((e) => e.kind === "base");
  const cx = base.x + base.w / 2;
  assert.ok(near(gb.x + gb.w / 2 - cx, -(ga.x + ga.w / 2 - cx)));
  assert.ok(gb.flip);
});

test("hit finds the topmost thing under a point", () => {
  const list = O.layout(O.figure("grey-person", ["ov-glasses-round"]), { x: 0, y: 0, w: 300, h: 400 });
  const g = list.find((e) => e.kind === "layer");
  assert.equal(O.hit(list, g.x + g.w / 2, g.y + g.h / 2).id, "ov-glasses-round");
  assert.equal(O.hit(list, 150, 350).kind, "base");
  assert.equal(O.hit(list, 150, 350, ["layer"]), null);
  assert.equal(O.hit(list, -5, -5), null);
});

function fakeCtx(log) {
  const ctx = new Proxy(
    {},
    {
      get(t, k) {
        if (k in t) return t[k];
        return (...a) => log.push([k, ...a]);
      },
      set(t, k, v) {
        t[k] = v;
        log.push(["set:" + String(k), v]);
        return true;
      },
    },
  );
  return ctx;
}

test("draw: greybox with no images, drawImage with them, tints go through an offscreen canvas", () => {
  const fig = O.figure("nana-upper", [{ id: "ov-scarf", tint: "red", pattern: "dots" }, "ov-glasses-round"]);
  const rect = { x: 0, y: 0, w: 370, h: 389 };
  const log = [];
  const list = O.draw(fakeCtx(log), fig, rect);
  assert.equal(list.length, 3);
  assert.equal(log.filter((c) => c[0] === "drawImage").length, 0);
  assert.ok(log.some((c) => c[0] === "arc"), "greybox shapes drawn");
  assert.ok(log.some((c) => c[0] === "set:fillStyle" && c[1] === DATA.colours.red), "greybox scarf in its tint");

  const img = { complete: true, naturalWidth: 10 };
  const off = [];
  const log2 = [];
  O.draw(fakeCtx(log2), fig, rect, {
    images: { "assets/cook/characters/nana-neutral.webp": img, x: img },
    makeCanvas: (w, h) => ({ w, h, getContext: () => fakeCtx(off) }),
  });
  const di = log2.filter((c) => c[0] === "drawImage");
  assert.equal(di.length, 1, "the base image; the layers have no art yet so stay greybox");
  assert.deepEqual(di[0].slice(2), [0, 0, 370, 389]);
  // a tinted layer with art: through the offscreen canvas
  const DATA2 = JSON.parse(JSON.stringify(DATA));
  DATA2.layers["ov-scarf"].img = "scarf.webp";
  O.load(DATA2);
  const log3 = [];
  O.draw(fakeCtx(log3), fig, rect, { images: { "scarf.webp": img }, makeCanvas: (w, h) => ({ w, h, getContext: () => fakeCtx(off) }) });
  assert.ok(off.some((c) => c[0] === "set:globalCompositeOperation" && c[1] === "multiply"));
  assert.ok(off.some((c) => c[0] === "set:globalCompositeOperation" && c[1] === "destination-in"));
  assert.ok(log3.some((c) => c[0] === "drawImage" && c[1].getContext), "the tinted canvas is drawn in");
  O.load(DATA);
});
