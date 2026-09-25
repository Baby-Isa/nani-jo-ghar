// Node tests for js/shared/whichone.js: the decoy rule, rack building,
// look-alike groups (on Find it's and Cook's live data), line-up balance,
// consistency and the lucky-guess rule, and the blind-odds calculator
// checked against a Monte Carlo blind bot.
// Run: node --test build/test_shared_whichone.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const W = require("../js/shared/whichone.js");
const COLOURS = ["red", "green", "blue", "white"];

test("matches and asked accept attrs or flat rows", () => {
  const it = { noun: "kurta", attrs: { colour: "red" } };
  assert.ok(W.matches(it, { noun: "kurta", attrs: { colour: "red" } }));
  assert.ok(W.matches({ noun: "kurta", colour: "red" }, { noun: "kurta", colour: "red" }));
  assert.ok(!W.matches(it, { noun: "kurta", colour: "blue" }));
  assert.deepEqual(W.asked({ noun: "x", size: "big", count: 2 }), { size: "big" });
});

test("checkDecoys names each broken rule", () => {
  const row = { noun: "kurta", attrs: { colour: "red" } };
  const bad = [
    { noun: "kurta", colour: "red" },
    { noun: "kurta", colour: "blue" },
    { noun: "topi", colour: "blue" },
  ];
  const r = W.checkDecoys(bad, row);
  assert.ok(!r.ok);
  const all = r.problems.join("\n");
  assert.match(all, /kurta in 2 colour values, needs 3/);
  assert.match(all, /colour red on 1 nouns, needs 2/);
  const good = [
    { noun: "kurta", colour: "red" },
    { noun: "kurta", colour: "blue" },
    { noun: "kurta", colour: "green" },
    { noun: "topi", colour: "red" },
    { noun: "topi", colour: "green" },
    { noun: "topi", colour: "blue" },
  ];
  assert.deepEqual(W.checkDecoys(good, row).problems, []);
  assert.match(W.checkDecoys(good.concat([{ noun: "kurta", colour: "red" }]), row).problems.join(), /answered by 2/);
  // size needs only two values (big / small)
  assert.ok(W.checkDecoys([{ noun: "a", size: "big" }, { noun: "a", size: "small" }, { noun: "b", size: "big" }, { noun: "b", size: "small" }], { noun: "a", size: "big" }).ok);
});

test("build makes racks that pass, for many seeds, and is seeded", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = W.rng(seed);
    const row = { noun: "kurta", attrs: { colour: COLOURS[seed % 4] } };
    const items = W.build(row, { values: { colour: COLOURS }, nouns: ["topi", "shawl"], total: 8, rng });
    assert.equal(items.length, 8);
    assert.ok(W.checkDecoys(items, row, { palette: { colour: COLOURS } }).ok, `seed ${seed}`);
    assert.equal(items.filter((i) => W.matches(i, row)).length, 1);
  }
  const a = W.build({ noun: "kurta", colour: "red" }, { values: { colour: COLOURS }, nouns: ["topi"], total: 8, rng: W.rng(7) });
  const b = W.build({ noun: "kurta", colour: "red" }, { values: { colour: COLOURS }, nouns: ["topi"], total: 8, rng: W.rng(7) });
  assert.deepEqual(a, b);
  // two asked dims at once (colour + size) and a count of two
  const row2 = { noun: "limu", attrs: { size: "big" }, count: 2 };
  const it2 = W.build(row2, { values: { size: ["big", "small"] }, nouns: ["santra"], total: 8, rng: W.rng(3) });
  assert.ok(W.checkDecoys(it2, row2).ok);
});

test("look-alike groups: Find it's and Cook's live groups are clean; candidates keep the target's group", () => {
  const find = require("../data/find.json").lookalike_groups;
  const cook = require("../data/cook.json").lookalike_groups;
  assert.deepEqual(W.checkGroups(find), []);
  assert.deepEqual(W.checkGroups(cook), []);
  const c = W.candidates("fru-13", find, { rng: W.rng(1) });
  assert.deepEqual(c.slice().sort(), W.group("fru-13", find).slice().sort());
  const c3 = W.candidates("fru-13", find, { n: 3, rng: W.rng(2) });
  assert.equal(c3.length, 3);
  assert.ok(c3.includes("fru-13"));
  assert.deepEqual(W.candidates("nothing", find), ["nothing"]);
  assert.match(W.checkGroups([["a", "b"], ["b", "c"], ["d"]]).join(), /b is in groups 0 and 1.*group 2 has 1/);
});

test("line-up balance, distinctiveness, consistency and the lucky guess", () => {
  const cats = [
    { id: "simba", size: "big", shade: "dark", holds: "kelo" },
    { id: "zazu", size: "small", shade: "dark", holds: null },
    { id: "kasuku", size: "small", shade: "light", holds: "kelo" },
    { id: "ali", size: "big", shade: "light", holds: null },
  ];
  assert.ok(W.balance(cats, ["size", "shade"]).ok);
  assert.ok(!W.balance(cats, [{ dim: "holds", value: "limu" }]).ok);
  assert.ok(W.balance(cats, [{ dim: "holds", value: "limu" }], { except: [{ dim: "holds", value: "limu" }] }).ok);
  assert.equal(W.distinctive(cats[0], cats, ["size", "shade"]), 0);
  assert.ok(W.notStandout(cats[0], cats, ["size", "shade"]));
  const clues = [{ dim: "size", value: "small" }];
  assert.deepEqual(W.consistent(cats, clues).map((c) => c.id), ["zazu", "kasuku"]);
  assert.ok(W.lucky(cats, clues), "two still fit: accusing is a guess");
  assert.ok(!W.lucky(cats, clues.concat([{ dim: "shade", value: "light" }])));
  assert.ok(!W.lucky(cats, [(c) => c.id === "ali"]));
  assert.deepEqual(W.consistent(cats, [{ fits: (c) => c.holds === "kelo" }, { dim: "size", value: "big", not: true }]).map((c) => c.id), ["kasuku"]);
});

test("blind odds: uniform, odd one out and common value, rows multiply", () => {
  const items = [
    { id: 1, noun: "k", colour: "red" },
    { id: 2, noun: "k", colour: "blue" },
    { id: 3, noun: "k", colour: "green" },
    { id: 4, noun: "t", colour: "red" },
  ];
  // nothing readable: 4 candidates; red is the most common colour (items 1
  // and 4), so "pick a red one" beats "pick any": 1/2
  const r1 = W.blindOdds([{ noun: "k", colour: "red" }], items);
  assert.equal(r1.rows[0].candidates, 4);
  assert.equal(r1.rows[0].strategy, "common");
  assert.ok(Math.abs(r1.p - 1 / 2) < 1e-9);
  // with the noun readable (an English placeholder) the candidates are the
  // three kurtas, one of each colour: 1/3
  const r2 = W.blindOdds([{ noun: "k", colour: "red", visible: ["noun"] }], items);
  assert.ok(Math.abs(r2.p - 1 / 3) < 1e-9);
  // an odd-one-out target is caught by the "odd" prior
  const odd = [{ id: 1, noun: "k", colour: "red" }, { id: 2, noun: "k", colour: "blue" }, { id: 3, noun: "k", colour: "blue" }, { id: 4, noun: "k", colour: "blue" }];
  const r3 = W.blindOdds([{ noun: "k", colour: "red" }], odd);
  assert.equal(r3.rows[0].strategy, "odd");
  assert.equal(r3.p, 1);
  // two rows multiply
  const both = W.blindOdds([{ noun: "k", colour: "red", visible: ["noun"] }, { noun: "k", colour: "blue", visible: ["noun"] }], items);
  assert.ok(Math.abs(both.p - 1 / 9) < 1e-9);
});

test("blind odds agree with a Monte Carlo blind bot on built racks", () => {
  const rng = W.rng(11);
  let predicted = 0;
  let wins = 0;
  const N = 3000;
  for (let i = 0; i < N; i++) {
    const row = { noun: "kurta", attrs: { colour: COLOURS[i % 4] } };
    const items = W.build(row, { values: { colour: COLOURS }, nouns: ["topi", "shawl"], total: 8, rng });
    predicted += W.blindOdds([row], items, { strategies: { odd: () => 0, common: () => 0 } }).p;
    if (W.matches(items[Math.floor(rng() * items.length)], row)) wins++;
  }
  assert.ok(Math.abs(wins / N - predicted / N) < 0.02, `bot ${wins / N} vs predicted ${predicted / N}`);
});

test("fitBudget grows a round until it is under 5%", () => {
  const rng = W.rng(5);
  const makeRound = (rows, total) => {
    const items = W.build(rows[0], { values: { colour: COLOURS }, nouns: ["topi", "shawl"], total, rng });
    return { rows, items, total };
  };
  const res = W.fitBudget(() => makeRound([{ noun: "kurta", colour: "red" }], 6), {
    budget: 0.05,
    addDecoy: (r) => (r.total < 12 ? makeRound(r.rows, r.total + 2) : null),
    addRow: (r) => {
      if (r.rows.length > 2) return null;
      // a second row: any item whose noun + colour is unique on the rack
      const extra = r.items
        .map((i) => ({ noun: i.noun, colour: i.colour }))
        .find((q) => r.items.filter((i) => W.matches(i, q)).length === 1 && !r.rows.some((x) => x.noun === q.noun && x.colour === q.colour));
      return extra ? { rows: r.rows.concat([extra]), items: r.items, total: r.total } : null;
    },
  });
  assert.ok(res.ok, `p=${res.p}`);
  assert.ok(res.steps > 0);
  assert.ok(W.blindOdds(res.round.rows, res.round.items).p <= 0.05);
  assert.equal(W.estimate(10, (i) => i < 3), 0.3);
});
