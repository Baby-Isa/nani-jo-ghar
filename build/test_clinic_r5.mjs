// Unit tests for R5 (the clinic onto the framework; the heal games' shared play rules). Node only, no browser.
// Run: node --test build/test_clinic_r5.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const L = require(join(ROOT, "js/clinic/lang.js"));
const HS = require(join(ROOT, "js/clinic/heal/scene.js"));
const rng = (s) => {
  let a = s;
  return () => ((a = (a * 16807) % 2147483647), a / 2147483647);
};

test("no Kutchi left in the clinic's code (build/check_clinic_kutchi.mjs)", () => {
  const out = execFileSync("node", [join(ROOT, "build/check_clinic_kutchi.mjs")]).toString();
  assert.match(out, /^OK: no Kutchi in js\/clinic/);
});

test("the clinic's words and joins come from the language engine (step 4e)", () => {
  const first = L.show(L.first("cook-paani"));
  assert.equal(first.kutchi, "Pela paani");
  assert.equal(first.english, "First water");
  assert.equal(first.placeholder, false);
  assert.deepEqual(first.ids, ["adv.first", "n.water"]); // the engine's ids (the clinic's are its aliases)
  assert.ok(Array.isArray(first.plan) && first.plan.length === 2); // the engine's clip plan, one clip per word
  assert.equal(L.show(L.then("cl-cloth")).kutchi, "Ne poi [cloth]");
  assert.equal(L.num(3).kutchi, "trae");
  // a describing word with a noun of unknown gender: the he-form, flagged "to check" (decision 21)
  const big = L.show(L.item("cl-wax", { size: "big" }));
  assert.equal(big.kutchi, "wadho [wax]");
  assert.equal(big.check, true);
  // a word with no Kutchi is a placeholder (G2), never invented
  const ph = L.w("cl-wipe");
  assert.equal(ph.kutchi, null);
  assert.equal(ph.placeholder, true);
});

test("every heal game's rows still say what they said (joins and numbers through the seam)", () => {
  const cut = require(join(ROOT, "js/clinic/heal/games/cut.js"));
  const p = cut.plan(3, "cut", rng(10));
  const stitch = p.steps.find((s) => s.kind === "stitch").row.kutchi;
  assert.match(stitch, /^Ne poi \[thread\]: pela (wadho|nindho), (hakro|ba|trae|char); ne poi (wadho|nindho), (hakro|ba|trae|char)$/);
  const ear = require(join(ROOT, "js/clinic/heal/games/ear.js"));
  const e = ear.plan(2, rng(4));
  assert.match(e.steps[0].rows[0].kutchi, /^pela (wadho|nindho) \[wax\]$/);
  assert.match(e.steps[0].rows[1].kutchi, /^ne poi (wadho|nindho)$/);
});

test("D10: no side in the knee, foot or eye close-ups at any level", () => {
  for (const g of ["knee", "foot", "eye"]) {
    const def = require(join(ROOT, `js/clinic/heal/games/${g}.js`));
    for (const L3 of [1, 2, 3]) {
      const p = def.plan(L3, rng(L3 + 2));
      const text = JSON.stringify(p.steps.map((s) => [s.row, s.rows]));
      assert.ok(!/left|right|dabo|jamno/i.test(text), `${g} L${L3} names a side: ${text}`);
      assert.ok(!(p.rows || []).some((r) => /side/.test(r.id)), `${g} L${L3} tests a side`);
    }
  }
});

test("CLN-49: the ear's blob aimed at is the one picked (small beside big)", () => {
  // the ear's level 2-3 blobs: big at (190, 240) r 30, small at (222, 280) r 15 (centred on EAR = (200, 250))
  const big = { key: "big", x: 190, y: 240, r: 30 };
  const small = { key: "small", x: 222, y: 280, r: 15 };
  // a touch on the small blob's centre is within the big one's reach (30 + 16) too: the small one wins
  assert.equal(HS.nearest({ x: 222, y: 280 }, [big, small], 16).key, "small");
  assert.equal(HS.nearest({ x: 224, y: 284 }, [big, small], 16).key, "small");
  assert.equal(HS.nearest({ x: 190, y: 240 }, [big, small], 16).key, "big");
  assert.equal(HS.nearest({ x: 400, y: 400 }, [big, small], 16), null);
});
