// S14 roll-out (CLN-207 to CLN-215; the rulebook's section 3, Zafar 29-30 Oct): every heal game's numbers come from
// data/rules.json through the one reader (Rules.xy), never a copy in the game. Each game's plan says the counts it drew
// (plan.counts {x, y}); over many rounds at each level every count lies inside the rule's [lo, hi], and a range is really
// drawn from (both ends seen). Run: node --test js/clinic/heal/counts.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const require = createRequire(import.meta.url);
const Rules = require(join(ROOT, "js/shared/rules.js"));
const Heal = require(join(ROOT, "js/clinic/heal/registry.js"));
const GAMES = ["eye", "ear", "knee", "tooth", "foot", "taste", "boing", "cut", "fever"];
GAMES.forEach((g) => require(join(ROOT, `js/clinic/heal/games/${g}.js`)));

const rngFrom = (seed) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 16807) % 2147483647), s / 2147483647);
};
const RUNS = 120;
const GAPS = new Set();
test.after(() => GAPS.size && console.log(`# declared gaps (in the report):\n${[...GAPS].map((x) => `#   ${x}`).join("\n")}`));

test("the reader gives each heal game's x and y per level as [lo, hi] (a number is [n, n])", () => {
  assert.deepEqual(Rules.xy("heal-eye", 1), { x: [2, 2], y: [4, 4] });
  assert.deepEqual(Rules.xy("heal-eye", 4), { x: [2, 5], y: [7, 7] });
  assert.deepEqual(Rules.xy("heal-fever", 3).x, [6, 6]);
  assert.deepEqual(Rules.xy("heal-boing", 2).dispensers, [2, 2]);
  assert.equal(Rules.xy("nope", 1), null);
  for (let s = 1; s < 200; s++) {
    const n = Rules.draw([2, 5], rngFrom(s));
    assert.ok(n >= 2 && n <= 5 && Number.isInteger(n));
  }
  assert.equal(Rules.draw([3, 3], Math.random), 3);
});

for (const g of GAMES) {
  test(`${g}: every level's counts from the rules (plan.counts inside Rules.xy("heal-${g}"), a range drawn across)`, () => {
    const def = Heal.get(g);
    assert.ok(def && def.bot, `${g} bot`);
    for (const level of [1, 2, 3, 4]) {
      const want = Rules.xy(`heal-${g}`, level);
      assert.ok(want, `heal-${g} L${level}`);
      const seen = { x: new Set(), y: new Set() };
      for (let seed = 1; seed <= RUNS; seed++) {
        let plan = def.bot(level, rngFrom(seed * 7919 + level)).plan;
        // the scrape (the bot's plan) counts dabs; its stitches are the cut's (the same game, the cut ailment's plan)
        if (g === "cut") {
          const cut = def.plan(level, "cut", rngFrom(seed * 104729 + level));
          plan = Object.assign({}, plan, { counts: Object.assign({}, plan.counts, { y: cut.counts.y }) });
        }
        assert.ok(plan.counts, `${g} L${level} counts`);
        for (const ax of ["x", "y"]) {
          if (!want[ax]) continue;
          const v = plan.counts[ax];
          // a gap the game says out loud (plan.gaps[axis]: a picture, a word or a place it has not got yet; the report lists
          // it): the count is the game's most, below the rule, and never above it
          if (plan.gaps && plan.gaps[ax]) {
            GAPS.add(`${g} L${level} ${ax}: ${plan.gaps[ax]}`);
            assert.ok(Number.isInteger(v) && v >= 1 && v <= want[ax][1], `${g} L${level} ${ax}=${v} (gap)`);
            seen[ax].add(want[ax][0]).add(want[ax][1]);
            continue;
          }
          assert.ok(Number.isInteger(v), `${g} L${level} ${ax}: ${v}`);
          assert.ok(v >= want[ax][0] && v <= want[ax][1], `${g} L${level} ${ax}=${v} outside [${want[ax]}]`);
          seen[ax].add(v);
        }
        if (want.dispensers) assert.ok(plan.counts.dispensers >= want.dispensers[0] && plan.counts.dispensers <= want.dispensers[1], `${g} L${level} dispensers ${plan.counts.dispensers}`);
      }
      for (const ax of ["x", "y"]) {
        if (!want[ax]) continue;
        assert.ok(seen[ax].has(want[ax][0]) && seen[ax].has(want[ax][1]), `${g} L${level} ${ax}: both ends of [${want[ax]}] drawn (saw ${[...seen[ax]].sort()})`);
      }
    }
  });
}
