// The count pills' plain part (js/shared/tally.js; Sprint 18, module map piece 11): what a pill reads, and kept on screen.
//   node --test build/test_shared_tally.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const T = createRequire(import.meta.url)("../js/shared/tally.js");

test("a count pill reads the number's word at L1-L2, dots from L3, the picture alone at 0 (SH-39, DAAR-12)", () => {
  const word = (n) => ["", "hakri", "ba", "trae", "char"][n];
  assert.equal(T.label(0, { level: 1, word }), "");
  assert.equal(T.label(3, { level: 1, word }), "trae");
  assert.equal(T.label(4, { level: 2, word }), "char");
  assert.equal(T.label(2, { level: 3, word }), "●●");
  assert.equal(T.label(4, { level: 4 }), "●●●●");
  assert.equal(T.label(0, { level: 4 }), "");
  assert.equal(T.label(30, { level: 4 }).length, 12, "at most 12 dots");
  assert.equal(T.label(2, { level: 1 }), "2", "no word given: the digit, as before");
  assert.equal(T.label(11, { level: 1, word }), "11", "past ten: the digit");
});

test("kept inside its box, never cut (CHAI-20, SH-39)", () => {
  const box = { left: 0, top: 0, right: 200, bottom: 100 };
  assert.deepEqual(T.keep({ left: 50, right: 90, top: 20, bottom: 40 }, box), { dx: 0, dy: 0 });
  assert.deepEqual(T.keep({ left: -10, right: 30, top: -4, bottom: 16 }, box), { dx: 18, dy: 12 });
  assert.deepEqual(T.keep({ left: 180, right: 230, top: 90, bottom: 120 }, box), { dx: -38, dy: -28 });
  assert.deepEqual(T.keep({ left: -50, right: 260, top: 0, bottom: 10 }, box, 8).dx, 58, "wider than the box: its left edge in");
});
