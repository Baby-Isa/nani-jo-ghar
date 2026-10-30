// S14 roll-out: the clinic's morning level-up reads the central rules (ClinicPipeline.levelUp through Rules.advance): up one
// level after 3 finished rounds in a row at a stage's level with the guide's hint at most once each, never down, the stage's
// own most as its cap; the count is kept between mornings. Run: node --test js/clinic/levelup.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const require = createRequire(import.meta.url);
globalThis.Rules = require(join(ROOT, "js/shared/rules.js"));
const P = require(join(ROOT, "js/clinic/pipeline.js"));

const round = (hints) => ({ heal: { hints } });

test("three rounds in a row with at most one hint each: up one level; the count resets", () => {
  const keep = {};
  let lv = P.levelUp({ heal: 1 }, [round(0), round(1)], keep);
  assert.equal(lv.heal, 1);
  assert.deepEqual(keep.heal, { level: 1, streak: 2 });
  lv = P.levelUp(lv, [round(0)], keep);
  assert.equal(lv.heal, 2);
  assert.deepEqual(keep.heal, { level: 2, streak: 0 });
});

test("a round with two hints starts the count again; never down", () => {
  const keep = {};
  let lv = P.levelUp({ heal: 2 }, [round(0), round(0), round(2)], keep);
  assert.equal(lv.heal, 2);
  assert.equal(keep.heal.streak, 0);
  lv = P.levelUp(lv, [round(5), round(5), round(5), round(5)], keep);
  assert.equal(lv.heal, 2);
});

test("the stage's own most caps it (the heal games' 4, the other stages' 3)", () => {
  const keep = {};
  const lv = P.levelUp({ heal: 4, diagnosis: 3 }, [{ heal: { hints: 0 }, diagnosis: { hints: 0 } }, { heal: { hints: 0 }, diagnosis: { hints: 0 } }, { heal: { hints: 0 }, diagnosis: { hints: 0 } }], keep);
  assert.equal(lv.heal, 4);
  assert.equal(lv.diagnosis, 3);
});

test("a stage not played that morning keeps its count", () => {
  const keep = { pharmacy: { level: 1, streak: 2 } };
  const lv = P.levelUp({ pharmacy: 1, heal: 1 }, [round(0)], keep);
  assert.equal(lv.pharmacy, 1);
  assert.deepEqual(keep.pharmacy, { level: 1, streak: 2 });
});
