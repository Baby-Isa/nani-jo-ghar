// The mode agents' stubs (Dress up js/dress/stubs/pick.js, Who did it
// js/who/stubs/whichone.js, Snap js/snap/stubs/stars.js) call shapes the
// shared modules must answer, so each swap is one line. These tests pin
// those shapes.
// Run: node --test build/test_shared_compat.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const W = require("../js/shared/whichone.js");
const Stars = require("../js/shared/stars.js");
Stars.load(require("../data/shared/stars.json"));

test("Dress up: WhichOne.Pick has the stub's API and answers", () => {
  const P = W.Pick;
  for (const f of ["rng", "int", "choose", "shuffle", "sample", "weighted", "grid", "rules", "setOdds", "rangeOdds", "product", "C"]) assert.equal(typeof P[f], "function", f);
  const rng = P.rng(3);
  assert.ok(P.int(rng, [1, 3]) >= 1);
  assert.equal(P.sample(rng, [1, 2, 3, 4], 2).length, 2);
  const g = P.grid(["kurta", "topi"], ["red", "green", "blue"]);
  assert.equal(g.length, 6);
  assert.deepEqual(P.rules(g, [{ kind: "kurta", colour: "red" }]), []);
  assert.match(P.rules(g.slice(0, 4), [{ kind: "topi", colour: "red" }]).join(), /only 1 colours|not balanced/);
  // uniform over 6 items, one answer: 1/6; two answers: 1/15
  assert.ok(Math.abs(P.setOdds(g, [{ kind: "kurta", colour: "red" }]) - 1 / 6) < 1e-9);
  assert.ok(Math.abs(P.setOdds(g, [{ kind: "kurta", colour: "red" }, { kind: "topi", colour: "blue" }]) - 1 / 15) < 1e-9);
  // a strictly most common colour is a prior: 3 reds of 7, answer red -> 1/3
  const skew = g.concat([{ kind: "topi", colour: "red" }]);
  assert.ok(Math.abs(P.setOdds(skew, [{ kind: "kurta", colour: "red" }]) - 1 / 3) < 1e-9);
  // salience: the brightest colour
  assert.ok(Math.abs(P.setOdds(g, [{ kind: "kurta", colour: "red" }], { salience: (c) => (c === "red" ? 1 : 0) }) - 1 / 2) < 1e-9);
  assert.equal(P.rangeOdds([1, 3]), 1 / 3);
  assert.equal(P.product([0.5, 0.5]), 0.25);
  assert.equal(P.C(5, 2), 10);
});

test("Who did it: balance(suspects, dims) gives counts, distinct and median too", () => {
  const s = [
    { attrs: { size: "big", shade: "dark" } },
    { attrs: { size: "small", shade: "dark" } },
    { attrs: { size: "small", shade: "light" } },
  ];
  const b = W.balance(s, ["size", "shade"]);
  assert.equal(b.counts["size.small"], 2);
  assert.deepEqual(b.distinct, [1, 0, 1]);
  assert.equal(b.median, 1);
  assert.equal(b.ok, false, "size big and shade light are on one suspect each");
});

test("Snap: Stars.ear / voice take the stub's row shapes and options and return offered/earned", () => {
  const rows = [
    { stage: 2, firstRight: true },
    { stage: 3, firstRight: true },
    { stage: 1, firstRight: false },
    { stage: 2, firstRight: false, excluded: true },
  ];
  const e = Stars.ear(rows, { minTested: 2 });
  assert.deepEqual([e.offered, e.earned, e.tested], [true, true, 2]);
  assert.equal(Stars.ear(rows.concat([{ stage: 2, firstRight: true, shown: true }]), { minTested: 2 }).earned, false, "a shown answer is not heard");
  assert.equal(Stars.ear(rows.slice(0, 1), { minTested: 2 }).offered, false);
  const v = Stars.voice([{ heard: "a", target: "a" }, { parent: true }], { minSaid: 2 });
  assert.deepEqual([v.offered, v.earned], [true, true]);
  assert.equal(Stars.voice([{ heard: "a", target: "a" }, { heard: null, target: "b" }], { minSaid: 2 }).earned, false);
  assert.equal(Stars.voice([{ heard: "a", target: "a" }], { minSaid: 2 }).offered, false);
});

test("Tidy up: Rel.Tidy has the stub's API and its dialect (compiled board, typed rows, any-neighbour next-to)", () => {
  const Rel = require("../js/shared/rel.js");
  const T = Rel.Tidy;
  for (const f of ["item", "matches", "where", "at", "free", "neighbours", "tagged", "satisfies", "holds", "options"]) assert.equal(typeof T[f], "function", f);
  const spots = [
    { id: "a", cap: 1, tags: [{ rel: "in", anchor: "bowl" }], nbr: { right: "b", front: "c" } },
    { id: "b", cap: 2, tags: [{ rel: "middle" }], nbr: { left: "a" } },
    { id: "c", cap: 1, tags: [], nbr: { back: "a" } },
  ];
  const B = { spots, byId: Object.fromEntries(spots.map((s) => [s.id, s])) };
  const items = { "limu#1": { word: "limu", attrs: {} }, "limu#2": { word: "limu", attrs: {} }, "cup#1": { word: "cup", attrs: { colour: "red" } } };
  const st = { items, placements: { "limu#1": "a", "limu#2": "b", "cup#1": "c" }, start: { "cup#1": "c" } };
  assert.ok(T.holds(st, { type: "place", item: "limu", rel: "in", anchor: "bowl" }, B));
  assert.ok(T.holds(st, { type: "count", n: 1, item: "limu", rel: "middle", anchor: null }, B));
  assert.ok(T.holds(st, { type: "leave", item: "cup" }, B));
  assert.ok(T.holds(st, { type: "place", item: "cup", attrs: { colour: "red" }, rel: "next-to", anchor: { item: "limu" } }, B), "front/back count as next to in Tidy's dialect");
  assert.ok(!T.holds(st, { type: "not", rule: { all: { item: "limu" }, rel: "in", anchor: "bowl" } }, B));
  assert.ok(T.holds(st, { type: "order", items: ["limu", "cup"], along: ["b", "a", "c"], dir: "asc" }, B), "limu at 1, cup at 2");
  assert.ok(!T.holds(st, { type: "order", items: ["limu", "cup"], along: ["b", "a", "c"], dir: "desc" }, B));
  assert.deepEqual(T.options({ items, placements: {} }, { type: "place", item: "limu", rel: "in", anchor: "bowl" }, B), ["a"]);
  assert.equal(T.free(st, B, "b"), 1);
  assert.deepEqual(T.item({}, "fru-04.red#2"), { word: "fru-04", attrs: { colour: "red" } });
});

test("Tidy up: Rel.Tidy agrees with Tidy's own stub on random boards", async () => {
  const fs = await import("node:fs");
  const stubPath = "/tmp/claude-0/tidy-rel-stub.js";
  if (!fs.existsSync(stubPath)) return; // the stub lives on Tidy's branch; the parity check runs when it's been fetched
  const Stub = require(stubPath);
  const T = require("../js/shared/rel.js").Tidy;
  const W = require("../js/shared/whichone.js");
  const rng = W.rng(9);
  const ids = ["s1", "s2", "s3", "s4", "s5", "s6"];
  const spots = ids.map((id, i) => ({ id, cap: 1 + (i % 2), tags: [{ rel: i < 3 ? "in" : "on", anchor: i < 3 ? "bowl" : "shelf" }].concat(i === 1 ? [{ rel: "middle" }] : []), nbr: { left: ids[i - 1] || null, right: ids[i + 1] || null } }));
  const B = { spots, byId: Object.fromEntries(spots.map((s) => [s.id, s])) };
  const words = ["limu", "santra", "kelo"];
  const rules = [
    { type: "place", item: "limu", rel: "in", anchor: "bowl" },
    { type: "count", n: 2, item: "santra", rel: "on", anchor: "shelf" },
    { type: "class", all: { item: "kelo" }, rel: "in", anchor: "bowl" },
    { type: "not", rule: { all: { item: "limu" }, rel: "on", anchor: "shelf" } },
    { type: "place", item: "kelo", rel: "next-to", anchor: { item: "limu" } },
    { type: "count", n: 1, item: "limu", rel: "middle", anchor: null },
  ];
  for (let t = 0; t < 300; t++) {
    const items = {};
    const placements = {};
    for (let k = 0; k < 5; k++) {
      const iid = `${words[Math.floor(rng() * 3)]}#${k}`;
      items[iid] = { word: iid.split("#")[0], attrs: {} };
      placements[iid] = rng() < 0.2 ? "tray" : ids[Math.floor(rng() * ids.length)];
    }
    const st = { items, placements };
    for (const r of rules) {
      assert.equal(T.holds(st, r, B), Stub.holds(st, r, B), `holds ${JSON.stringify(r)} ${JSON.stringify(placements)}`);
      assert.deepEqual(T.options(st, r, B), Stub.options(st, r, B));
    }
  }
});
