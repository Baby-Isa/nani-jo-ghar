// S08 wave 1B (the card and what is said): Node tests, no browser. Run: node --test build/test_shared_w1b_card.mjs
//   SH-99   every number Cook says in an order is written on its card (every recipe, level, customer), the clinic's rows carry their counts
//           and boing its colours, in the taught round too; SH-98 one bulb picture; CLN-160 one sequence per heal card; SH-114 a replay says
//           what is left; SH-103 the review's halves are weighted.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { loadCookEngine, ROOT } from "./test_cook_harness.mjs";

const require = createRequire(import.meta.url);
const rng = (s) => {
  let a = s;
  return () => ((a = (a * 16807) % 2147483647), a / 2147483647);
};

test("SH-98 (SH-100): the card's small bulb is the one photo (assets/ui/results/icon-bulb.webp), never a flat drawing", () => {
  const OC = require("../js/shared/order-card.js");
  assert.match(OC.bulbImg(), /^<img [^>]*src="[^"]*assets\/ui\/results\/icon-bulb\.webp/);
  assert.equal(/<svg/.test(OC.bulbImg()), false);
  assert.equal(OC.BULB, undefined, "the flat drawing is gone");
});

test("SH-99: every number Cook says in an order is written on its card, at every level (numbers heard three times, as after a few plays: the old L3 drop)", async () => {
  const { Cook } = await loadCookEngine({ seed: 5 });
  for (let n = 1; n <= 12; n++) for (let i = 0; i < 3; i++) Cook.markSeen(Cook.numId(n));
  const Lang = Cook.Lang;
  const D = Cook.data;
  const numberWords = new Set();
  for (let n = 1; n <= 12; n++) {
    const w = Lang.plain(Lang.phrase([n])).toLowerCase().trim();
    if (/^[a-z']+$/.test(w)) numberWords.add(w);
  }
  assert.ok(numberWords.has("trae") && numberWords.has("ba"), `the number words: ${[...numberWords]}`);
  const split = (t) => String(t || "").toLowerCase().match(/[a-z']+/g) || [];
  const bad = [];
  let withNumber = 0;
  for (const id of Object.keys(D.recipes).filter((x) => x[0] !== "_" && x !== "pantry"))
    for (const level of [1, 2, 3, 4])
      for (const who of Object.keys(D.customers)) {
        const d = Cook.Recipes[id].make(who, { level });
        const L = Cook.Order.ladder(d, 0);
        // what is said at the pop-up: the order's own speech; what is written: every row and headline of the card
        const said = split(Lang.plain(Cook.Order.speech([L])));
        const written = new Set(Cook.Order.rows(L, { all: true }).flatMap((r) => split(Lang.plain(r.cardLine || r.line))));
        const nums = said.filter((w) => numberWords.has(w));
        if (nums.length) withNumber++;
        for (const w of nums) if (!written.has(w)) bad.push(`${id} L${level} ${who}: says "${w}", the card does not write it`);
      }
  assert.ok(withNumber > 20, `${withNumber} orders say a number`);
  assert.deepEqual([...new Set(bad)].slice(0, 12), []);
});

test("SAM-23: samosa's title has no number in either language; its blocks' rows say how many (\"ba samosa\", \"trae samosa\")", async () => {
  const { Cook } = await loadCookEngine({ seed: 9 });
  const Lang = Cook.Lang;
  let counted = 0;
  for (const who of Object.keys(Cook.data.customers)) for (const level of [1, 2, 3, 4]) {
    const L = Cook.Order.ladder(Cook.Recipes.samosa.make(who, { level }), 0);
    assert.equal(L.head.uncountedTitle, true);
    const title = L.head.cardLine || L.head.line;
    assert.doesNotMatch(Lang.plain(title).toLowerCase(), /\b(hakro|ba|trae|char|panj)\b/);
    assert.doesNotMatch(String(title.en || "").toLowerCase(), /\b(one|two|three|four|five|\d)\b/, `English title: ${title.en}`);
    for (const s of L.sections.filter((x) => x.block && x.head && (x.head.parts || []).some((n) => typeof n === "number" && n > 1))) {
      counted++;
      assert.match(Lang.plain(s.head.cardLine || s.head.line).toLowerCase(), /\b(ba|trae|char|panj)\b/, "a block's row writes its count");
      assert.match(String((s.head.cardLine || s.head.line).en || "").toLowerCase(), /\b(two|three|four|five)\b/, "and its English says it");
    }
  }
  assert.ok(counted > 0, "some block says more than one");
});

test("SH-99, CLN-169, CLN-171: boing writes the drops' colour and the plaster's colour at every level; counts stay in the taught round", () => {
  const boing = require("../js/clinic/heal/games/boing.js");
  for (const level of [1, 2, 3]) {
    const p = boing.plan(level, rng(7 + level));
    const drops = p.steps.find((s) => s.id === "drops").row;
    assert.match(drops.english, /\b(red|yellow|blue|green)\b/i, `L${level} drops row: ${drops.english}`);
    assert.match(drops.english, /\b(one|two|three|four|five|\d)\b/i, `L${level} drops row carries its count: ${drops.english}`);
    const plaster = p.steps.find((s) => s.id === "plaster");
    assert.match(plaster.row.english, /\b(blue|yellow)\b/i, `L${level} plaster row: ${plaster.row.english}`);
    assert.ok(plaster.colour === "blue" || plaster.colour === "yellow");
    assert.ok(p.rows.some((r) => r.id === "plaster-colour") && p.rows.some((r) => r.id === "drop-colours"));
  }
});

test("CLN-161: no heal game's taught round strips a count from its rows (cut, ear, eye, foot, knee, boing)", () => {
  for (const g of ["cut", "ear", "eye", "foot", "knee", "boing"]) {
    const src = readFileSync(`${ROOT}js/clinic/heal/games/${g}.js`, "utf8");
    const blocks = src.match(/if \(ctx\.taught\)[^\n]*(\n(?!\s*\/\/)[^\n]*){0,6}/g) || [];
    for (const b of blocks) assert.equal(/\.row = /.test(b), false, `${g}.js: a taught round still rewrites a row:\n${b}`);
  }
});

test("CLN-160: every heal card is one sequence: all of a game's rows share one seq key (ear and foot at level 3 were two boxes)", () => {
  const ear = require("../js/clinic/heal/games/ear.js");
  const foot = require("../js/clinic/heal/games/foot.js");
  const keys = (p) => [...new Set([].concat(...p.steps.map((s) => s.rows || (s.row ? [s.row] : []))).map((r) => r.seq || "__all"))];
  for (const level of [1, 2, 3, 4]) assert.deepEqual(keys(ear.plan(level, rng(3))), ["steps"], `ear L${level}`);
  for (const level of [1, 2, 3]) assert.deepEqual(keys(foot.plan(level, rng(5))), ["steps"], `foot L${level}`);
});

test("SH-114, SH-102: a replay of the clinic card says the steps not yet done, and the whole card while none is (or all are) done", async () => {
  const K = require("../js/clinic/kit.js").Clinic.Kit;
  const said = [];
  K.Voice.say = async (r) => void said.push(r.id || r.kutchi);
  const card = (done) => ({ titleText: { kutchi: "HEAD", id: "__head" }, rows: [{ id: "wax0" }, { id: "wax1" }, { id: "wipe" }, { id: "drops" }], st: { done: new Set(done), reading: null }, progressive: false, shown: 3, who: "doctor", el: { ownerDocument: { querySelectorAll: () => [] } }, headEl: null });
  const run = async (done, only) => (said.splice(0), await K.Card.prototype.speak.call(card(done), only), said.slice());
  assert.deepEqual(await run([]), ["__head", "wax0", "wax1", "wipe", "drops"]);
  assert.deepEqual(await run(["wax0", "wax1"]), ["wipe", "drops"], "ear L3 after two steps: only what's left");
  assert.deepEqual(await run(["wax0", "wax1", "wipe", "drops"]), ["__head", "wax0", "wax1", "wipe", "drops"], "all done: all of it");
  assert.deepEqual(await run(["wax0"], ["wipe"]), ["wipe"], "an `only` list is said as asked (a step opening)");
  assert.equal(K.peekMs(3), 7000);
  for (const l of [1, 2, 3, 4]) assert.equal(K.peekMs(l), 7000);
});

test("SH-101: Cook's peek time is data by level (calm.peekMs: 7 s at level 3, the same 3.5 s added to the others)", () => {
  const calm = JSON.parse(readFileSync(`${ROOT}data/cook.json`, "utf8")).calm;
  for (const l of ["1", "2", "3", "4"]) assert.equal(calm.peekMs[l], 7000);
});

test("SH-103: the review's halves are weighted: right words 4, wrong words 1 to 3 (divider at 1/5 with none wrong)", () => {
  const src = readFileSync(`${ROOT}js/shared/results.js`, "utf8");
  assert.match(src, /col\("rs-words-bad", bad, Math\.max\(1, Math\.min\(bad\.length, 3\)\)\) \+ col\("rs-words-ok", ok, 4\)/);
  assert.match(readFileSync(`${ROOT}css/shared/results.css`, "utf8"), /\.rs-words-col \{\n  flex: var\(--rs-w, 1\) 1 0;/);
});
