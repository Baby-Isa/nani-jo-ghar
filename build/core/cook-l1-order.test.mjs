// Sprint 12 (Zafar, 22 Oct): the order maker's level 1 rule and the recipe card's full set.
//   CK-50: "at level one there shouldn't be any no's ... it shouldn't be a rule, it should be coded in": 500 level 1 orders of
//          every recipe, for every customer (and their usual), hold no "no" row (dudh na, khun na ...); from level 2 a "no"
//          can still come (it is introduced later, CK-50's note).
//   CK-51: "all the items they require are on the recipe card": chai's card has paani and chai first on every cup's card (never
//          said: the order still says only what is asked), then the asked-for rows in their order.
// Run: node --test build/core/cook-l1-order.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCookEngine } from "../test_cook_harness.mjs";

test("CK-50: 500 level 1 orders of every recipe hold no 'no'", async () => {
  const { Cook } = await loadCookEngine({ seed: 7 });
  const D = Cook.data;
  const ids = Object.keys(D.recipes).filter((x) => x[0] !== "_");
  const who = Object.keys(D.customers);
  const bad = [];
  for (const id of ids) {
    for (let n = 0; n < 500; n++) {
      const d = Cook.Recipes[id].make(who[n % who.length], { level: 1, usual: n % 5 === 0 });
      const L = Cook.Order.ladder(d, 0);
      const nos = Cook.Order.rows(L, { all: true }).filter((r) => r.no);
      if (nos.length) bad.push(`${id} #${n}: ${nos.map((r) => Cook.Lang.plain(r.line)).join(", ")}`);
    }
  }
  assert.deepEqual(bad.slice(0, 5), [], `${bad.length} level 1 orders hold a no`);
});

test("CK-50: a 'no' still comes from level 2 (the rule is level 1's only)", async () => {
  const { Cook } = await loadCookEngine({ seed: 3 });
  let nos = 0;
  for (let n = 0; n < 200; n++) {
    const L = Cook.Order.ladder(Cook.Recipes.chai.make("nana", { level: 2 }), 0);
    nos += Cook.Order.rows(L, { all: true }).filter((r) => r.no).length;
  }
  assert.ok(nos > 0, "chai L2 orders still say dudh na / khun na sometimes");
});

test("CK-51: chai's card lists paani and chai first on every cup, never said; the order says only what is asked", async () => {
  const { Cook } = await loadCookEngine({ seed: 5 });
  for (const level of [1, 2, 3, 4]) {
    for (let n = 0; n < 40; n++) {
      const d = Cook.Recipes.chai.make("ma", { level });
      const L = Cook.Order.ladder(d, 0);
      const cups = L.sections.filter((s) => s.for);
      assert.equal(cups.length, d.cups.length, "one card per cup");
      for (const s of cups) {
        const rows = [].concat(...s.groups);
        assert.deepEqual(rows.slice(0, 2).map((r) => r.ids[0]), ["cook-paani", "cook-chai"], `L${level}: paani, then chai, at the top of ${s.for}'s card`);
        assert.ok(rows.slice(0, 2).every((r) => r.unsaid && !r.no), "the two are on the card only");
        assert.ok(rows.slice(2).every((r) => !r.unsaid), "the asked-for rows follow");
      }
      // what is said: never paani, and chai only in the headline ("Muke chai khape")
      const said = Cook.Lang.plain(Cook.Order.speech([L], { withWhen: true }));
      assert.ok(!/\bpaani\b/i.test(said), `L${level}: the order never says paani: ${said}`);
      for (const s of cups) {
        const line = Cook.Lang.plain(Cook.Order.sentence(s.head || L.head, [].concat(...s.groups), { join: Cook.Order.joinOf(L) }));
        assert.ok(!/\bpaani\b/i.test(line), `L${level}: ${s.for} never says paani: ${line}`);
      }
    }
  }
});
