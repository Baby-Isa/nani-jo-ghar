// The shared button kit's pure part (js/shared/buttons.js; UX-PRINCIPLES 15): the end screen's actions in the one order.
//   node --test build/test_shared_buttons.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const B = require("../js/shared/buttons.js");

test("the one order: Again, Next, the list, Home", () => {
  assert.deepEqual(B.ORDER, ["again", "next", "list", "home"]);
  const a = B.endActions({ home: true, again: true, next: "Next patient" });
  assert.deepEqual(a.map((x) => x.id), ["again", "next", "home"]);
});

test("the last action given is the primary one, and labels default", () => {
  const a = B.endActions({ again: true, list: true });
  assert.equal(a[1].primary, true);
  assert.equal(a[0].primary, false);
  assert.equal(a[0].label, "Again");
  assert.equal(a[1].icon, "grid");
  assert.equal(a[1].elId, "njg-end-list");
});

test("a label string replaces the default label", () => {
  const [n] = B.endActions({ next: "Next patient" });
  assert.equal(n.label, "Next patient");
  assert.equal(n.icon, "next");
});

test("no actions asked: none given", () => {
  assert.deepEqual(B.endActions({}), []);
});
