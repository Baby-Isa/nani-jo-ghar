// run 16, fix-kit: the kit rows' own checks, red on the code before each fix and green after (build/reports/run16/fix-kit.json).
// node --test build/sandbox/run16-fixkit.test.mjs
// NJG_TREE=<dir>: test another checkout's files (the red run: a worktree of the commit before the fix)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = process.env.NJG_TREE || join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const require = createRequire(import.meta.url);
const src = (p) => readFileSync(join(ROOT, p), "utf8");

// SH-292 (Zafar, 14 Nov, chai's paani at L1: "the light is not centred on the object (there's more padding to the left than the
// right)"): a light trimmed on one side for a neighbour is trimmed on the opposite side too, so its thing sits in its middle; the
// row's rule: left and right margins within 2 px, top and bottom too; the neighbour still never lit
test("SH-292: the light sits centred on its thing when a neighbour trims one side", () => {
  const Onboard = require(join(ROOT, "js", "shared", "onboard.js"));
  const thing = { x: 200, y: 100, w: 80, h: 80 };
  const cases = [
    { name: "a neighbour close on the left", avoid: [{ x: 150, y: 100, w: 45, h: 80 }] },
    { name: "a neighbour close on the right", avoid: [{ x: 285, y: 100, w: 45, h: 80 }] },
    { name: "a neighbour close above", avoid: [{ x: 200, y: 50, w: 80, h: 46 }] },
    { name: "a neighbour close below and one on the left", avoid: [{ x: 200, y: 184, w: 80, h: 40 }, { x: 140, y: 100, w: 54, h: 80 }] },
  ];
  for (const c of cases) {
    // (the drawn light's own call, light.draw: Onboard.litBox(rects, o.avoid, { pad: o.tight, even: true }))
    const b = Onboard.litBox([thing], c.avoid, { even: true });
    const l = thing.x - b.x, r = b.x + b.w - (thing.x + thing.w), t = thing.y - b.y, bt = b.y + b.h - (thing.y + thing.h);
    assert.ok(Math.abs(l - r) <= 2, `${c.name}: left ${l} px, right ${r} px (within 2 px of each other)`);
    assert.ok(Math.abs(t - bt) <= 2, `${c.name}: top ${t} px, bottom ${bt} px (within 2 px of each other)`);
    for (const q of c.avoid) {
      const over = Math.min(b.x + b.w, q.x + q.w) - Math.max(b.x, q.x) > 0 && Math.min(b.y + b.h, q.y + q.h) - Math.max(b.y, q.y) > 0;
      assert.ok(!over, `${c.name}: the light reaches its neighbour`);
    }
  }
  // (and every light the kit draws asks for it)
  assert.match(src("js/shared/onboard.js"), /Onboard\.litBox\(rects, o\.avoid, \{[^}]*even: true/, "light.draw asks Onboard.litBox for an even light");
});
