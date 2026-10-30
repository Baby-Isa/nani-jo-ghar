// S14 roll-out (s14-cook; PAN-18, MAA-19, SEK-22, SAM-28, CHT-17, DAAR-36; Zafar, 29 Oct): every Cook dish's numbers by level
// come from the central rules (data/rules.json count.games, read through js/shared/rules.js), filled into the recipes as Cook's
// data loads (js/cook/recipes.js Recipes.fromRules, called from js/cook/flow.js), never a copy of them; and level 1 never has a
// "no" ask (Rules.level(1).noAsks, js/cook/recipes.js make).
//   node --test build/test_cook_rules_counts.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { loadCookEngine } from "./test_cook_harness.mjs";

const require = createRequire(import.meta.url);
const Rules = require("../js/shared/rules.js");
// (the harness fills the recipes from the rules as the game does: Recipes.fromRules, js/cook/flow.js)
const { Cook } = await loadCookEngine({ seed: 7 });
const R = Cook.Recipes;
const TRIES = 60;
const LV = [1, 2, 3, 4];
const sum = (o) => Object.values(o || {}).reduce((a, n) => a + (Number(n) || 0), 0);
/** Every order made at a level (TRIES of them), mapped. */
const each = (id, lv, f, who = "nana") => Array.from({ length: TRIES }, () => f(R[id].make(who, { level: lv })));
const only = (list) => [...new Set(list)];
const noRows = (id, d) => Cook.Order.rows(Cook.Order.ladder(d, 0), { all: true }).filter((r) => r.no || r.kind === "no").length;

test("the rules' counts: the Cook games' four numbers (Zafar, 29 Oct)", () => {
  assert.deepEqual(Rules.counts("fetch"), [3, 4, 5, 6]);
  assert.deepEqual(Rules.counts("maani-line"), [2, 3, 4, 5]);
  assert.deepEqual(Rules.counts("mishkaki-grill"), [1, 2, 3, 4]);
  assert.deepEqual(Rules.counts("samosa"), [2, 3, 4, 6]);
  assert.deepEqual(Rules.counts("chaat"), [3, 4, 5, 6]);
  assert.deepEqual(LV.map((l) => Rules.part("daar", "x", l)), [1, 2, 3, 4]);
  assert.deepEqual(LV.map((l) => Rules.part("daar", "y", l)), [2, 2, 3, 4]);
});

test("the pantry: 3, 4, 5, 6 things by level", () => {
  LV.forEach((lv, i) => assert.deepEqual(only(each("pantry", lv, (d) => [].concat(d.first || []).length + [].concat(d.rest || []).length, "nani")), [Rules.counts("fetch")[i]], `L${lv}`));
});

test("maani: 2, 3, 4, 5 rotis by level", () => {
  LV.forEach((lv, i) => assert.deepEqual(only(each("maani", lv, (d) => sum(d.maani))), [Rules.counts("maani-line")[i]], `L${lv}`));
});

test("the sekelo grill: 1, 2, 3, 4 skewers by level", () => {
  LV.forEach((lv, i) => assert.deepEqual(only(each("mishkaki", lv, (d) => sum(d.skewers))), [Rules.counts("mishkaki-grill")[i]], `L${lv}`));
});

test("samosa: 2, 3, 4, 6 samosas by level, one kind at L1-L2, two sharing the count from L3", () => {
  LV.forEach((lv, i) => {
    assert.deepEqual(only(each("samosa", lv, (d) => (Number(d.count) || 0) + (Number(d.count2) || 0))), [Rules.counts("samosa")[i]], `L${lv}`);
    assert.deepEqual(only(each("samosa", lv, (d) => (Number(d.count2) > 0 ? 2 : 1))), [lv >= 3 ? 2 : 1], `L${lv} kinds`);
  });
});

test("chaat: 3, 4, 5, 6 in the bowl by level, a layer said twice counting twice; never at L1", () => {
  const spoons = (d) => d.seq.reduce((a, id) => a + ({ "veg-01": d.potatoes, "veg-02": d.onions, "veg-03": d.tomatoes }[id] || 1), 0);
  LV.forEach((lv, i) => assert.deepEqual(only(each("chaat", lv, spoons)), [Rules.counts("chaat")[i]], `L${lv}`));
  const twice = (lv) => each("chaat", lv, (d) => d.seq.some((id) => ({ "veg-01": d.potatoes, "veg-02": d.onions, "veg-03": d.tomatoes }[id] || 1) > 1));
  assert.ok(!twice(1).some(Boolean), "L1: one spoon of each");
  assert.ok(twice(4).some(Boolean), "L4: a layer said twice now and then");
  each("chaat", 4, (d) => assert.equal(new Set(d.seq).size, d.seq.length, "each layer once in the list (its count says twice)"));
});

test("daar: chopped + added first (X+Y): 1+2, 2+2, 3+3, 4+4", () => {
  LV.forEach((lv) => {
    assert.deepEqual(only(each("daal", lv, (d) => (d.onions || 0) + (d.tomatoes || 0) + (d.chillies || 0))), [Rules.part("daar", "x", lv)], `L${lv} X`);
    assert.deepEqual(only(each("daal", lv, (d) => [].concat(d.tadka || []).flat().length)), [Rules.part("daar", "y", lv)], `L${lv} Y`);
    each("daal", lv, (d) => assert.ok((d.tomatoes || 0) <= 1, "one tomato at most (LNG-17)"));
  });
});

test("'no' asks: never at L1 (Rules.level(1).noAsks), and from L2 in samosa and chaat (were L4 and L3)", () => {
  for (const id of ["samosa", "chaat", "daal"]) assert.equal(each(id, 1, (d) => noRows(id, d)).filter(Boolean).length, 0, `${id} L1`);
  assert.ok(each("samosa", 2, (d) => noRows("samosa", d)).some(Boolean), "samosa L2 has a 'no'");
  assert.ok(each("chaat", 2, (d) => noRows("chaat", d)).some(Boolean), "chaat L2 has a 'no'");
});

test("no copy: the rolled-out recipes name their game on the rules, and their stand-ins are only the first level's", () => {
  const recs = Cook.data.recipes;
  const refs = [];
  const walk = (v, path) => {
    if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`));
    if (!v || typeof v !== "object") return;
    if (typeof v.rules === "string") refs.push([path, v.rules]);
    Object.keys(v).forEach((k) => walk(v[k], `${path}.${k}`));
  };
  for (const id of ["pantry", "maani", "mishkaki", "samosa", "chaat", "daal"]) walk({ slots: recs[id].slots, fit: recs[id].fit }, id);
  const games = only(refs.map(([, g]) => g)).sort();
  assert.deepEqual(games, ["chaat", "daar", "fetch", "maani-line", "mishkaki-grill", "samosa"]);
});
