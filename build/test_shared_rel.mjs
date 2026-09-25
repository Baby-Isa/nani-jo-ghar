// Node tests for js/shared/rel.js and data/relations.json: the Find form on
// Find it's live bazaar scene, the board form on a small Tidy-shaped board
// (every rule type in tidy-up-design.md 8.1), options, the solver, phrases,
// sidecar merging, validation and occlusion.
// Run: node --test build/test_shared_rel.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Rel = require("../js/shared/rel.js");
const REL = require("../data/relations.json");
Rel.load(REL);

test("relations.json: every relation has a placeholder word, aliases resolve", () => {
  for (const [id, r] of Object.entries(REL.relations)) {
    assert.ok(REL.words[r.word], `${id}: word ${r.word} missing`);
    assert.equal(REL.words[r.word].kutchi, null, "no invented Kutchi");
    assert.ok(["anchor", "anchor2", "unary", "leave"].includes(r.kind));
  }
  for (const [a, to] of Object.entries(REL.aliases)) if (a[0] !== "_") assert.ok(REL.relations[to], `${a} -> ${to}`);
  assert.equal(Rel.id("next-left"), "left-of");
  assert.equal(Rel.id("in"), "in");
  const words = {};
  Rel.mergeWords(words);
  assert.equal(words["ph-rel-in"].english, "in");
});

test("Find form: Find it's live bazaar scene validates and matches by anchor word", () => {
  const scene = Rel.scene(require("../data/find.json").scenes.bazaar);
  assert.deepEqual(Rel.validate(scene), []);
  const item = { id: "i1", noun: "fru-01", rel: [["in", "crate-left"], ["next-to", "i2"]] };
  assert.ok(Rel.holds(item, ["in", "crate-left"], scene));
  assert.ok(Rel.holds(item, ["in", "crate-right"], scene), "both crates are 'the crate' by word");
  assert.ok(!Rel.holds(item, ["in", "crate-right"], scene, { byWord: false }));
  assert.ok(!Rel.holds(item, ["on", "crate-left"], scene));
  assert.ok(!Rel.holds(item, ["in", "basket-stall"], scene));
  // options with no placed items: the spots tagged so
  const spots = Rel.options(scene, { where: ["in", "crate-left"] });
  assert.ok(spots.includes("cl-1") && spots.includes("cr-1"));
  // with placed items: the items the row could mean
  const s2 = Object.assign({}, scene, { items: [item, { id: "i2", noun: "fru-01", rel: [["in", "basket-stall"]] }] });
  assert.deepEqual(Rel.options(s2, { noun: "fru-01", where: ["in", "crate-left"] }).map((i) => i.id), ["i1"]);
});

// A small high-angle board: a cloth with a 3x2 grid of spots, two seats
// (Nana and Nani) behind the back row, a door on the right.
function board() {
  const spots = [];
  const ids = [["a1", "a2", "a3"], ["b1", "b2", "b3"]]; // a = back row, b = front row
  ids.forEach((row, r) =>
    row.forEach((id, c) =>
      spots.push({
        id,
        x: 500 + c * 200,
        y: 400 + r * 150,
        surface: "cloth",
        tags: [
          ...(r === 0 && c === 0 ? [{ rel: "in-front", anchor: "seat-1" }] : []),
          ...(r === 0 && c === 2 ? [{ rel: "in-front", anchor: "seat-2" }] : []),
          ...(c === 1 ? [{ rel: "middle" }] : []),
          ...(c === 2 ? [{ rel: "next-to", anchor: "door" }] : []),
        ],
        nbr: { left: row[c - 1] || null, right: row[c + 1] || null, back: r ? ids[0][c] : null, front: r ? null : ids[1][c] },
      }),
    ),
  );
  return Rel.scene({
    id: "test-room",
    camera: "H",
    surfaces: [{ id: "cloth", rect: [400, 300, 1200, 700] }],
    anchors: [
      { id: "seat-1", kind: "person-seat", word: null, rect: [420, 200, 580, 320], who: "nana" },
      { id: "seat-2", kind: "person-seat", word: null, rect: [820, 200, 980, 320], who: "nani" },
      { id: "door", kind: "object", word: "ph-door", rect: [1300, 150, 1500, 700] },
    ],
    spots,
    groups: { pots: ["ph-pot"] },
  });
}
const items = {
  "ph-cup#1": { noun: "ph-cup", colour: "red" },
  "ph-cup#2": { noun: "ph-cup", colour: "blue" },
  "ph-plate#1": { noun: "ph-plate" },
  "ph-jug#1": { noun: "ph-jug" },
  "ph-spoon#1": { noun: "ph-spoon" },
};
const st = (placements, extra) => Object.assign({ items, placements }, extra || {});

test("board form: the board validates", () => {
  assert.deepEqual(Rel.validate(board()), []);
});

test("place rule with attrs and a person anchor", () => {
  const S = board();
  const rule = { item: "ph-cup", attrs: { colour: "red" }, rel: "in-front", anchor: "@nana" };
  assert.ok(Rel.holds(st({ "ph-cup#1": "a1" }), rule, S));
  assert.ok(!Rel.holds(st({ "ph-cup#2": "a1", "ph-cup#1": "b1" }), rule, S), "the blue cup doesn't count");
  assert.ok(!Rel.holds(st({ "ph-cup#1": "a3" }), rule, S), "in front of Nani, not Nana");
  // seat swap: the board says who sits where
  assert.ok(Rel.holds(st({ "ph-cup#1": "a3" }, { who: { "seat-2": "nana", "seat-1": "nani" } }), rule, S));
});

test("unary, class, count, leave and not", () => {
  const S = board();
  assert.ok(Rel.holds(st({ "ph-jug#1": "b2" }), { item: "ph-jug", rel: "middle" }, S));
  assert.ok(!Rel.holds(st({ "ph-jug#1": "b1" }), { item: "ph-jug", rel: "middle" }, S));
  const cls = { all: { kind: "ph-cup" }, rel: "next-to", anchor: "door" };
  assert.ok(Rel.holds(st({ "ph-cup#1": "a3", "ph-cup#2": "b3" }), cls, S));
  assert.ok(!Rel.holds(st({ "ph-cup#1": "a3", "ph-cup#2": "b1" }), cls, S), "class needs every cup");
  const cnt = { n: 1, item: "ph-cup", rel: "next-to", anchor: "door" };
  assert.ok(Rel.holds(st({ "ph-cup#1": "a3", "ph-cup#2": "b1" }), cnt, S));
  assert.ok(!Rel.holds(st({ "ph-cup#1": "a3", "ph-cup#2": "b3" }), cnt, S), "count is exact: over-collecting is wrong");
  const leave = { item: "ph-spoon", rel: "stay" };
  assert.ok(Rel.holds(st({ "ph-spoon#1": "b1" }, { start: { "ph-spoon#1": "b1" } }), leave, S));
  assert.ok(!Rel.holds(st({ "ph-spoon#1": "b2" }, { start: { "ph-spoon#1": "b1" } }), leave, S));
  const not = { not: { all: {}, rel: "next-to", anchor: "door" } };
  assert.ok(Rel.holds(st({ "ph-cup#1": "a1", "ph-plate#1": "b2" }), not, S));
  assert.ok(!Rel.holds(st({ "ph-cup#1": "a1", "ph-plate#1": "b3" }), not, S), "nothing next to the door");
});

test("derived relations from the neighbour graph (a placed item as anchor)", () => {
  const S = board();
  const P = { "ph-plate#1": "b2" };
  assert.ok(Rel.holds(st(Object.assign({ "ph-cup#1": "b1" }, P)), { item: "ph-cup", rel: "next-to", anchor: "ph-plate" }, S));
  assert.ok(Rel.holds(st(Object.assign({ "ph-cup#1": "b1" }, P)), { item: "ph-cup", rel: "left-of", anchor: "ph-plate" }, S));
  assert.ok(!Rel.holds(st(Object.assign({ "ph-cup#1": "b1" }, P)), { item: "ph-cup", rel: "right-of", anchor: "ph-plate" }, S));
  assert.ok(Rel.holds(st(Object.assign({ "ph-cup#1": "a2" }, P)), { item: "ph-cup", rel: "behind", anchor: "ph-plate" }, S));
  assert.ok(Rel.holds(st({ "ph-cup#1": "b1", "ph-jug#1": "b2", "ph-plate#1": "b3" }), { item: "ph-jug", rel: "between", anchor: ["ph-plate", "ph-cup"] }, S));
  assert.ok(Rel.holds(st({ "ph-cup#1": "a1", "ph-cup#2": "a2" }), { item: "ph-cup", attrs: { colour: "blue" }, rel: "next-to", anchor: "ph-cup" }, S), "next to the other cup");
});

test("order and compare", () => {
  const S = board();
  const pots = { "ph-pot#1": { noun: "ph-pot", size: "big" }, "ph-pot#2": { noun: "ph-pot", size: "mid" }, "ph-pot#3": { noun: "ph-pot", size: "small" } };
  const ranks = { size: ["small", "mid", "big"] };
  const rule = { items: "@pots", by: "size", dir: "desc", along: "cloth", from: "door" };
  const ok = { items: pots, placements: { "ph-pot#1": "a3", "ph-pot#2": "a2", "ph-pot#3": "a1" } };
  const bad = { items: pots, placements: { "ph-pot#1": "a1", "ph-pot#2": "a2", "ph-pot#3": "a3" } };
  assert.ok(Rel.holds(ok, rule, S, { ranks }), "biggest nearest the door");
  assert.ok(!Rel.holds(bad, rule, S, { ranks }));
  const cmp = { item: "ph-cup", rel: "behind", anchor: { most: "size", item: "ph-pot" } };
  const s3 = { items: Object.assign({}, pots, items), placements: { "ph-pot#1": "b3", "ph-pot#2": "b2", "ph-cup#1": "a3" } };
  assert.ok(Rel.holds(s3, cmp, S, { ranks }), "behind the biggest pot");
  s3.placements["ph-cup#1"] = "a2";
  assert.ok(!Rel.holds(s3, cmp, S, { ranks }));
});

test("check reports the first wrong row; options respect capacity", () => {
  const S = board();
  const rules = [
    { item: "ph-jug", rel: "middle" },
    { item: "ph-cup", attrs: { colour: "red" }, rel: "in-front", anchor: "@nana" },
  ];
  const r = Rel.check(st({ "ph-jug#1": "b2", "ph-cup#1": "b1" }), rules, S);
  assert.deepEqual(r.map((x) => x.ok), [true, false]);
  assert.equal(r.firstWrong, 1);
  assert.deepEqual(Rel.options(st({}), { item: "ph-jug", rel: "middle" }, S).sort(), ["a2", "b2"]);
  assert.deepEqual(Rel.options(st({ "ph-plate#1": "a2" }), { item: "ph-jug", rel: "middle" }, S), ["b2"], "a2 is full");
  assert.deepEqual(Rel.options(st({ "ph-jug#1": "a2" }), { item: "ph-jug", rel: "middle" }, S).sort(), ["a2", "b2"], "its own spot stays open");
  assert.equal(Rel.options(st({}), { not: { item: "ph-jug", rel: "middle" } }, S).length, 4);
});

test("solve finds a layout and counts layouts", () => {
  const S = board();
  const rules = [
    { item: "ph-jug", rel: "middle" },
    { item: "ph-cup", attrs: { colour: "red" }, rel: "in-front", anchor: "@nana" },
    { item: "ph-plate", rel: "next-to", anchor: "ph-jug" },
  ];
  const one = Rel.solve(st({}), rules, S);
  assert.equal(one.length, 1);
  assert.ok(Rel.check(st(one[0]), rules, S).allOk);
  const all = Rel.solve(st({}), rules, S, { limit: 1000 });
  assert.ok(all.exhausted);
  assert.ok(all.length > 1, "several layouts are right (grade rules, not slots)");
  const impossible = Rel.solve(st({}), [{ item: "ph-jug", rel: "middle" }, { item: "ph-jug", rel: "next-to", anchor: "door" }], S);
  assert.equal(impossible.length, 0);
});

test("phrase follows the grammar: thing, anchor, relation", () => {
  const S = board();
  assert.deepEqual(Rel.phrase({ item: "ph-cup", rel: "next-to", anchor: "door" }, S), ["ph-cup", "ph-door", "ph-rel-nextto"]);
  assert.deepEqual(Rel.phrase({ item: "ph-jug", rel: "middle" }, S), ["ph-jug", "ph-rel-middle"]);
  assert.deepEqual(Rel.phrase({ item: "ph-jug", rel: "between", anchor: ["ph-cup", "ph-plate"] }, S), ["ph-jug", "ph-cup", "ph-plate", "ph-rel-between"]);
});

test("sidecars merge by id; validation catches bad data", () => {
  const base = { anchors: { shelf: { word: "ph-shelf", rect: [100, 100, 500, 200] } }, spots: [{ id: "s1", anchor: "shelf", rel: "on", x: 200, baseline: 190 }] };
  const side = { spots: [{ id: "s1", nbr: { right: "s2" } }, { id: "s2", x: 300, y: 190, tags: [{ rel: "on", anchor: "shelf" }], nbr: { left: "s1" } }], monsoon: { rooms: [] } };
  const S = Rel.scene(base, side);
  assert.equal(S.spots.s1.tags.length, 1);
  assert.equal(S.spots.s1.nbr.right, "s2");
  assert.deepEqual(S.monsoon, { rooms: [] });
  assert.deepEqual(Rel.validate(S), []);
  const bad = Rel.scene({ anchors: { a: { rect: [10, 10, 5, 5] } }, spots: [{ id: "x", x: 5, y: 5, rel: "inside", anchor: "nope", nbr: { left: "ghost" } }] });
  const probs = Rel.validate(bad).join("\n");
  for (const want of ["x1 > x0", "unknown relation", "unknown anchor", "not a spot", "safe margin"]) assert.match(probs, new RegExp(want));
});

test("visibleFraction and the safe area", () => {
  const S = Rel.scene({ occluders: [{ id: "counter", rect: [0, 500, 1600, 900], z: 5 }, { id: "pot", poly: [[0, 0], [100, 0], [100, 100], [0, 100]] }] });
  assert.ok(Math.abs(Rel.visibleFraction([100, 400, 200, 600], S) - 0.5) < 0.05);
  assert.equal(Rel.visibleFraction([300, 100, 400, 200], S), 1);
  assert.ok(Rel.visibleFraction([0, 0, 50, 50], S) < 0.01);
  assert.ok(!Rel.inSafe(20, 450, S));
  assert.ok(Rel.inSafe(800, 450, S));
  assert.ok(Rel.inSafe(20, 450, { safe: [0, 0, 1600, 900] }));
});
