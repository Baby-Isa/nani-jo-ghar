// The kitchen kit's pan (Sprint 18, piece 5; js/cook/mechanics/pan.js) on a stand-in scene: with the reference game's set (its
// values, for data/stations/<game>.json kit.pan) each look shows the reference's pictures by the reference's registration, the next
// look fades in over the last, a look still loading shows the nearest one in (CHAI-91), and the pictures to load are every look's.
//   node --test build/test_shared_kitpan.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { KitPan } from "../js/cook/mechanics/pan.js";

const SET = {
  looks: {
    empty: { key: "s14-pan-empty", file: "e.webp", w: 514, h: 405, cx: 203.8, cy: 241.0 },
    water: { key: "s14-pan-water", file: "w.webp", w: 514, h: 405, cx: 184.8, cy: 241.0 },
    leaves: { key: "s14-pan-leaves", file: "l.webp", w: 496, h: 405, cx: 181.1, cy: 240.5 },
    milk: { key: "s14-pan-milk", file: "m.webp", w: 514, h: 405, cx: 204.1, cy: 164.5 },
    boil: { key: "s14-pan-boil", file: "b.webp", w: 514, h: 405, cx: 186.4, cy: 164.0 },
    black: { key: "s14-pan-black", file: "k.webp", w: 496, h: 405, cx: 179.1, cy: 164.5 },
  },
  rim: 158, inner: 140, turn: 0, mirror: true, bodyDy: 0, handle: [-14, 14], rimOfPan: 0.92,
  near: { boil: ["milk", "leaves", "water"], black: ["leaves", "water"], milk: ["leaves", "water"], leaves: ["water"], water: [] },
  stages: { empty: ["empty"], water: ["water"], leaves: ["leaves"], tea: ["black"], milky: ["milk"], spiced: ["milk"], "boil-tea": ["black", "boil-tea"], "boil-milky": ["boil"], foam: ["boil", "foam"] },
  disc: { prefix: "v3-pan-", w: 405, cx: 0.3754, cy: 0.6146, rIn: 0.3037, files: { "boil-tea": "bt.webp", foam: "f.webp" } },
  ring: { colour: "#ffe2a6", width: 9 },
};

// a stand-in Phaser scene: enough of images, graphics, masks, textures and tweens for the pan
function scene(have) {
  const listeners = {};
  const textures = {
    exists: (k) => have.has(k),
    get: () => ({ getSourceImage: () => ({ width: 100 }) }),
    once: (ev, fn) => (listeners[ev] = fn),
    add: (k) => (have.add(k), listeners[`addtexture-${k}`] && listeners[`addtexture-${k}`]()),
  };
  const chain = (o) =>
    new Proxy(o, {
      get(t, p) {
        if (p in t) return t[p];
        if (typeof p === "string" && /^(set|fill|line|stroke|clear|generate|destroy|add)/.test(p)) return (...a) => (t.calls.push([p, ...a]), chain(t));
        return undefined;
      },
    });
  const img = (x, y, key) => {
    const o = { x, y, active: true, visible: true, alpha: 1, calls: [], texture: { key }, scaleX: 1, scaleY: 1 };
    o.scene = S;
    o.setTexture = (k) => ((o.texture = { key: k }), p);
    o.setOrigin = (a, b) => ((o.origin = [a, b]), p);
    o.setFlipX = (f) => ((o.flipX = f), p);
    o.setVisible = (v) => ((o.visible = v), p);
    o.setAlpha = (a) => ((o.alpha = a), p);
    o.setScale = (s) => ((o.scaleX = o.scaleY = s), p);
    const p = chain(o);
    return p;
  };
  const gfx = () => chain({ calls: [], active: true, createGeometryMask: () => ({}) });
  const S = {
    textures,
    add: { image: img, graphics: gfx, container: () => chain({ calls: [], active: true, list: [] }) },
    make: { graphics: gfx },
    tweens: { addCounter: (c) => (c.onUpdate({ getValue: () => 1 }), c.onComplete()) },
  };
  return S;
}

const ALL = new Set(Object.values(SET.looks).map((t) => t.key).concat("v3-pan-boil-tea", "v3-pan-foam"));

test("stage and art: each look's pictures, and every picture to load once", () => {
  assert.deepEqual(KitPan.stage(SET, "foam"), ["boil", "foam"]);
  assert.deepEqual(KitPan.stage(SET, "tea"), ["black", null]);
  assert.deepEqual(KitPan.stage(SET, "nothing"), ["empty", null]);
  const keys = KitPan.art(SET).map(([k]) => k);
  assert.deepEqual(keys.sort(), [...ALL].sort());
});

test("every look of the reference set: the pan picture by its own rim centre, mirrored; the contents picture where it has one", () => {
  for (const name of Object.keys(SET.stages)) {
    let want = [name, null, 0];
    const p = KitPan(scene(new Set(ALL)), { at: { x: 400, y: 300 }, rimR: 100, set: SET, lookOf: () => want });
    p.show();
    const [k8, kd] = SET.stages[name];
    const t = SET.looks[k8];
    assert.equal(p.img.texture.key, t.key, name);
    assert.equal(p.img.flipX, true);
    assert.deepEqual(p.img.origin, [1 - t.cx / t.w, t.cy / t.h], `${name}: the registration point, from the other side (mirrored)`);
    assert.equal(p.disc.visible, !!kd, `${name}: its contents picture`);
    if (kd) assert.equal(p.disc.texture.key, `v3-pan-${kd}`);
    assert.equal(p.mix.alpha, 0);
    assert.equal(p.shown, name);
  }
});

test("the next look fades in over the last (lookOf's third value), and shown is the one past halfway", () => {
  const p = KitPan(scene(new Set(ALL)), { at: { x: 0, y: 0 }, rimR: 100, set: SET, lookOf: () => ["milky", "boil-milky", 0.3] });
  p.show();
  assert.equal(p.img.texture.key, "s14-pan-milk");
  assert.equal(p.mix.texture.key, "s14-pan-boil");
  assert.equal(p.mix.alpha, 0.3);
  assert.equal(p.shown, "milky");
  p.show({ from: "water", u: 0.4 });
  assert.equal(p.img.texture.key, "s14-pan-water", "something going in: the last look under the new one");
  assert.equal(p.mix.texture.key, "s14-pan-milk");
  assert.equal(p.mix.alpha, 0.4);
});

test("a look still loading shows the nearest look in (CHAI-91), and takes its own the moment it arrives", () => {
  const have = new Set(ALL);
  have.delete("s14-pan-boil");
  have.delete("s14-pan-milk");
  const S = scene(have);
  const p = KitPan(S, { at: { x: 0, y: 0 }, rimR: 100, set: SET, lookOf: () => ["boil-milky", null, 0] });
  p.show();
  assert.equal(p.img.texture.key, "s14-pan-leaves", "boil -> milk (not in) -> leaves");
  S.textures.add("s14-pan-boil");
  assert.equal(p.img.texture.key, "s14-pan-boil");
});

test("sizes: the rim from the outer size by the set's share, the contents radius from the rim", () => {
  const p = KitPan(scene(new Set(ALL)), { at: { x: 0, y: 0 }, panR: 100, set: SET });
  assert.ok(Math.abs(p.rimR - 92) < 1e-9);
  assert.ok(Math.abs(p.rIn - (140 * 92) / 158) < 1e-9);
  assert.equal(p.vessel.rim.rx, p.rIn);
});
