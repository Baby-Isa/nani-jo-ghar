// Node tests for the shared order card's rules (js/shared/order-card.js, OrderCard.shape; design system 12):
// the single-item-with-a-recipe rule, one row per item, tints, the next part, folding and the pop-up.
// No browser. Run: node --test build/test_shared_order_card.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const OC = require("../js/shared/order-card.js");
const parts = (...xs) => xs.map((l) => (typeof l === "string" ? { label: l, done: false } : l));

test("one item, one of it, with a recipe: its parts straight under the headline (a single chai)", () => {
  const s = OC.shape({ headline: { html: "Muke chai khape." }, items: [{ label: "chai", count: 1, parts: parts("dudh", "ba khun", "elchi") }] });
  assert.equal(s.direct, true);
  assert.equal(s.items[0].row, false, "no item row");
  assert.equal(s.items[0].parts.length, 3);
  const unnamed = OC.shape({ items: [{ label: null, parts: parts("bataato", "chana") }, { label: null, parts: parts("lasan") }] });
  assert.ok(unnamed.items.every((it) => !it.row), "an item with no label never gets a row");
});

test("the same recipe several times is one row, parts once; different recipes are separate rows", () => {
  const same = OC.shape({ items: [{ label: "ba lakri mixed", count: 2, ordered: true, parts: parts("gos", "dungri", "gos", "tameto") }] });
  assert.equal(same.direct, false, "two of it: the row names the count");
  assert.equal(same.items.length, 1);
  assert.equal(same.items[0].row, true);
  assert.equal(same.items[0].parts.length, 4, "the parts once");
  const diff = OC.shape({
    items: [
      { label: "ba lakri gos", count: 2 },
      { label: "hakri lakri mixed", ordered: true, parts: parts("gos", "dungri", "gos", "tameto") },
      { label: "hakri lakri mixed", ordered: true, parts: parts("tameto", "gos", "dungri", "gos") },
    ],
  });
  assert.deepEqual(diff.items.map((it) => it.row), [true, true, true]);
  assert.deepEqual(diff.items.map((it) => it.tint), [false, true, false], "alternate item rows tinted");
  assert.deepEqual(diff.items.map((it) => it.parts.length), [0, 4, 4], "an item with no recipe has no parts");
});

test("maani: two kinds, no parts, one row each", () => {
  const s = OC.shape({ items: [{ label: "hakri maani", count: 1 }, { label: "ba bajr ji maani", count: 2 }] });
  assert.equal(s.direct, false);
  assert.deepEqual(s.items.map((it) => [it.row, it.parts.length]), [[true, 0], [true, 0]]);
});

test("next: the first open part of the first open ordered item, unless the host says", () => {
  const s = OC.shape({ items: [{ label: "a", ordered: true, parts: parts({ label: "gos", done: true }, "dungri", "tameto") }, { label: "b", ordered: true, parts: parts("gos") }] });
  assert.deepEqual(s.items[0].parts.map((p) => !!p.next), [false, true, false]);
  assert.equal(!!s.items[1].parts[0].next, false, "only one next on a card");
  const own = OC.shape({ items: [{ label: null, ordered: true, parts: parts("x", { label: "y", next: true }) }] });
  assert.deepEqual(own.items[0].parts.map((p) => !!p.next), [false, true], "the host's own next wins");
  const any = OC.shape({ items: [{ label: null, parts: parts("atto", "daar") }] });
  assert.ok(any.items[0].parts.every((p) => !p.next), "an any-order list has no next");
});

test("done and folding: an item row folds when done; the pop-up never folds and has no next", () => {
  const data = { items: [{ label: "hakri lakri gos", done: true }, { label: "hakri lakri mixed", ordered: true, parts: parts("gos", "dungri") }] };
  const s = OC.shape(data);
  assert.equal(s.items[0].folded, true, "a finished item row folds to one gold line");
  assert.equal(s.items[1].folded, false);
  assert.equal(s.done, false, "the person is done when every item is");
  const big = OC.shape(data, { big: true });
  assert.ok(big.items.every((it) => !it.folded), "the pop-up shows the whole tree");
  assert.ok(big.items[1].parts.every((p) => !p.next), "no next band on the pop-up");
  const all = OC.shape({ items: [{ label: null, parts: parts({ label: "dudh", done: true }, { label: "Khun na.", no: true }) }] });
  assert.equal(all.done, true, "a no-row doesn't hold a card open");
  assert.equal(OC.shape({ items: [{ label: "x", done: false, parts: parts({ label: "y", done: true }) }] }).items[0].done, false, "the host's done wins (a count row ticks when its step closes)");
});

test("an empty order: just the headline", () => {
  const s = OC.shape({ headline: { html: "Muke chai khape." }, items: [] });
  assert.equal(s.items.length, 0);
  assert.equal(s.done, false);
  assert.equal(OC.shape({ items: [{ label: null, parts: [] }] }).items.length, 0, "a nameless item with no parts is dropped");
});
