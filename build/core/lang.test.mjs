// The language seam (js/core/lang/): every current Cook line comes out of the adapter word for word as today.
// Today's lines are made by today's code (js/cook/recipes.js, order.js, lang.js, unchanged, in a Node vm with a
// seeded Math.random): every recipe, levels 1-4, every customer, several seeds: the spoken order (with and
// without the sections said later at their station), each section said on its own, every card row's words,
// every row as the recipe says it (its frame), every fixed line, every number said aloud, every word.
// The adapter is given MEANINGS (Item, Need, Then, Without ...) wherever today's line can be expressed as one;
// a whole order goes through as today's ladder (the adapter's first gap, `order-tree`).
// Run: node --test build/core/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadCook } from "./cook-harness.mjs";
import { createLang, itemFromParts, FRAME_ROLES } from "../../js/core/lang/index.js";
import { clipIndex } from "../../js/core/voice.js";

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];
const plain = (segs) => segs.map((s) => s.t).join("");
const strip = (segs) => segs.map((s) => ({ t: s.t, lang: s.lang, ...(s.w ? { w: s.w } : {}) }));

/** today's lines and the meaning the adapter is given for each: [{what, expect: {segs}, meaning}] */
async function enumerate(seed) {
  const { Cook } = await loadCook({ seed });
  const Lang = createLang({ cook: Cook });
  const D = Cook.data;
  const fnOf = {};
  Object.keys(FRAME_ROLES).forEach((fn) => (fnOf[Lang.say({ fn, x: { fn: "Item", kind: "cook-chai" } }).frames[0]] = fn));
  const cases = [];
  const recipes = Object.keys(D.recipes).filter((id) => id[0] !== "_");
  for (const id of recipes)
    for (const level of [1, 2, 3, 4])
      for (const who of id === "pantry" ? ["nani"] : Object.keys(D.customers)) {
        const d = Cook.Recipes[id].make(who, { level });
        if (D.recipes[id].forDish || id === "pantry") d.for = d.for || "chai";
        const lad = Cook.Order.ladder(d, 0);
        const tag = `${id} L${level} ${who} seed ${seed}`;
        for (const withWhen of [false, true]) cases.push({ what: `${tag}: the order${withWhen ? " with its station sections" : ""}`, expect: Cook.Order.speech([lad], { withWhen }), meaning: { fn: "Order", ladders: [lad], withWhen } });
        lad.sections.filter((s) => s.when).forEach((s) => cases.push({ what: `${tag}: section ${s.key}`, expect: Cook.Order.sectionSpeech(lad, s.key), meaning: { fn: "Section", ladder: lad, key: s.key } }));
        Cook.Order.rows(lad, { all: true }).forEach((r, i) => {
          if (r.parts && r.parts.length && r.phrase) cases.push({ what: `${tag}: row ${i} words`, expect: r.phrase, meaning: itemFromParts(r.parts), express: true });
          const said = r.said || (r.no ? r.line : null);
          if (said && said.segs && r.parts && r.parts.length) {
            const fn = said.key ? fnOf[said.key] : "Bare";
            if (fn) cases.push({ what: `${tag}: row ${i} said (${said.key || "bare"})`, expect: said, meaning: { fn, x: itemFromParts(r.parts) }, express: true });
            else cases.push({ what: `${tag}: row ${i} said (${said.key})`, expect: said, meaning: null });
          }
        });
      }
  // every frame with a slot, filled with each kind of word (the stations' own calls: Lift, Leave, Now, StirNow ...)
  Object.entries(D.lines).forEach(([k, f]) => {
    if (!String(f.k || f.e).includes("{x}")) return;
    for (const parts of [["cook-chai"], [2, "cook-khun"], [1, "ph-big", "cook-maani"], ["ph-quickly"]].filter((p) => p.every((x) => typeof x === "number" || D.words[x])))
      cases.push({ what: `frame ${k} ${parts.join(" ")}`, expect: Cook.Lang.line(k, Cook.Lang.phrase(parts)), meaning: fnOf[k] ? { fn: fnOf[k], x: itemFromParts(parts) } : null, express: true });
  });
  Object.entries(D.lines).forEach(([k, f]) => !String(f.k || f.e).includes("{x}") && cases.push({ what: `line ${k}`, expect: Cook.Lang.line(k), meaning: { fn: "Phrase", id: k }, express: true }));
  [1, 2, 3, 4, 5].forEach((n) => cases.push({ what: `count ${n}`, expect: Cook.Lang.numLine(n), meaning: { fn: "Count", n }, express: true }));
  Object.keys(D.words).forEach((w) => cases.push({ what: `word ${w}`, expect: Cook.Lang.wordLine(w), meaning: { fn: "Word", id: w }, express: true }));
  return { Cook, Lang, cases };
}

test("every current Cook line comes out of the adapter word for word (L1-L4, every recipe, customer and seed)", async () => {
  let n = 0;
  let expressed = 0;
  const unexpressed = new Set();
  for (const seed of SEEDS) {
    const { Lang, cases } = await enumerate(seed);
    for (const c of cases) {
      if (!c.meaning) {
        unexpressed.add(c.what.replace(/ seed \d+/, "").replace(/^.*?: /, ""));
        continue;
      }
      const r = Lang.say(c.meaning);
      assert.equal(r.text, plain(c.expect.segs), c.what);
      assert.deepEqual(strip(r.segments), strip(c.expect.segs), c.what);
      assert.equal(r.en, c.expect.en, `${c.what} (English gloss)`);
      n++;
      if (c.express) expressed++;
    }
  }
  assert.ok(n > 2000, `enough lines checked (${n})`);
  assert.equal(unexpressed.size, 0, `every row's frame maps to a meaning: ${[...unexpressed].join("; ")}`);
  console.log(`# lang seam: ${n} lines word for word (${expressed} through meanings, ${n - expressed} orders/sections through ladders)`);
});

test("gaps: English placeholders are rule or lexeme gaps (ok: false); a known sentence is ok", async () => {
  const { Lang } = await enumerate(1);
  const thanks = Lang.say({ fn: "Phrase", id: "thanks" });
  assert.equal(thanks.ok, true);
  assert.equal(thanks.text, "Aabhar aanjo!");
  const times = Lang.say({ fn: "Times", x: { fn: "Item", kind: "num-02" } });
  assert.equal(times.ok, false);
  assert.ok(times.gaps.some((g) => g.kind === "rule" && g.id === "Times"));
  const nope = Lang.say({ fn: "NoSuchThing" });
  assert.equal(nope.ok, false);
  assert.equal(nope.gaps[0].kind, "rule");
  const need = Lang.say({ fn: "Need", x: { fn: "Item", kind: "cook-chai" } });
  assert.equal(need.text, "Muke chai khape.");
  assert.equal(need.ok, true);
  assert.deepEqual(Lang.rows({ fn: "Item", kind: "cook-maani", n: 2 }).map((r) => r.text), [Lang.say({ fn: "Item", kind: "cook-maani", n: 2 }).text]);
  assert.ok(Lang.GAPS.length >= 8, "the adapter's own gap list");
});

test("Lang.play hands the result to Voice.say (one queue); the clip plan comes from the recordings index", async () => {
  const { Cook } = await loadCook({ seed: 1 });
  const fam = JSON.parse(readFileSync(new URL("../../data/family-audio.json", import.meta.url), "utf8"));
  const tts = JSON.parse(readFileSync(new URL("../../data/cook-tts.json", import.meta.url), "utf8")).lines;
  const calls = [];
  const voice = { say: (r, o) => (calls.push([r, o]), Promise.resolve({ done: true })) };
  const Lang = createLang({ cook: Cook, index: clipIndex(fam, { tts }), voice, path: "store" });
  const r = Lang.say({ fn: "Phrase", id: "thanks" });
  await Lang.play(r, { channel: "main" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], r);
  assert.ok(r.clipPlan.length >= 1);
  assert.ok(r.clipPlan.every((c) => c.source === "family-ok" || c.source === "missing"), "store path: OK family clips only");
});
