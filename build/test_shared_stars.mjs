// Node tests for js/shared/stars.js and data/shared/stars.json: the merged
// rules per mode and variant, the ear star (Cook's first-miss rule,
// Monsoon's 80% over >= 6, taught / retry / menu / placeholder rows left
// out), the voice star (pills leave it open; the clinic's first-try rule),
// the per-word progress weights, and the star slots.
// Run: node --test build/test_shared_stars.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Stars = require("../js/shared/stars.js");
const DATA = require("../data/shared/stars.json");
Stars.load(DATA);
const rows = (spec) => spec.split("").map((c, i) => ({ word: `w${i}`, ok: c === "1" }));

test("data: every mode has a full star set with a voice slot and valid rules", () => {
  for (const [m, set] of Object.entries(DATA.star_sets)) {
    for (const k of ["ear", "hand", "relaxed", "busy", "voice"]) assert.ok(set[k] && set[k].icon && set[k].name, `${m}.${k}`);
    assert.ok(DATA.rules[m], `rules for ${m}`);
  }
  const cook = require("../data/cook.json").star_sets;
  for (const m of ["cook", "find"]) for (const k of ["ear", "hand", "relaxed", "busy"]) assert.deepEqual(DATA.star_sets[m][k], cook[m][k], `${m}.${k} matches cook.json`);
  for (const set of Object.values(DATA.star_sets)) for (const s of Object.values(set)) if (!["ear", "tick", "bolt", "chefhat", "magnifier"].includes(s.icon)) assert.ok(Stars.ICONS[s.icon], `icon ${s.icon}`);
});

test("rules merge defaults, mode, variant and aliases", () => {
  assert.equal(Stars.rules("cook").minTested, 1);
  assert.equal(Stars.rules("monsoon").earPass, 0.8);
  assert.equal(Stars.rules("monsoon", "forecast").minTested, 10);
  assert.equal(Stars.rules("clinic", "named-ailment").minTested, 2);
  assert.equal(Stars.rules("dress").minTested, 2, "alias dress -> dress-up");
  assert.equal(Stars.rules("nosuchmode").earPass, 1);
  assert.equal(Stars.rules({ earPass: 0.5 }).minTested, 2, "a rules object passes through with defaults");
});

test("ear: Cook's rule is the first miss loses", () => {
  assert.equal(Stars.ear(rows("111"), "cook").state, "earned");
  assert.equal(Stars.ear(rows("110"), "cook").state, "lost");
  assert.equal(Stars.ear(rows("1"), "cook").state, "earned");
});

test("ear: minTested and the taught / retry / menu / placeholder exclusions", () => {
  assert.equal(Stars.ear(rows("1"), "tidy").state, "untested", "one tested row is a teaching board");
  const r = [
    { word: "a", ok: true },
    { word: "b", ok: false, stage: 1 },
    { word: "c", ok: false, retry: true },
    { word: "cook-chai", ok: false },
    { word: "ph-cup", ok: false, placeholder: true },
    { word: "d", ok: true },
  ];
  const e = Stars.ear(r, "tidy");
  assert.equal(e.tested, 2);
  assert.equal(e.state, "earned");
  assert.equal(Stars.outcome(r[1], "tidy"), "taught");
  assert.equal(Stars.outcome(r[3], "tidy"), "menu");
  assert.equal(Stars.outcome(r[4], "tidy"), "placeholder");
});

test("ear: Monsoon's 80% over at least 6, late is not heard", () => {
  assert.equal(Stars.ear(rows("11110"), "monsoon").state, "untested");
  assert.equal(Stars.ear(rows("111110"), "monsoon").state, "earned", "5 of 6 = 83%");
  assert.equal(Stars.ear(rows("1111100"), "monsoon").state, "lost", "5 of 7 = 71%");
  const late = rows("111111").map((x, i) => (i < 2 ? Object.assign(x, { outcome: "late" }) : x));
  assert.equal(Stars.ear(late, "monsoon").state, "lost");
  assert.equal(Stars.ear(rows("1111111110"), "monsoon", "forecast").state, "earned");
  assert.equal(Stars.ear(rows("111111111"), "monsoon", "forecast").state, "untested");
});

test("voice: recognised or parent-ticked; pills leave it open; none without a moment", () => {
  assert.equal(Stars.voice([], "find").state, "none");
  assert.equal(Stars.voice([{ via: "voice", confidence: 0.8 }], "find").state, "earned");
  assert.equal(Stars.voice([{ via: "parent" }], "find").state, "earned");
  assert.equal(Stars.voice([{ via: "voice", confidence: 0.8 }, { via: "pill" }], "find").state, "open");
  assert.equal(Stars.voice([{ via: "voice", confidence: 0.3 }], "find").state, "open", "under minConfidence");
  assert.equal(Stars.voice([{ via: "voice", confidence: 0.9 }], "tidy").state, "untested", "tidy needs two said rows");
  assert.equal(Stars.voice([{ via: "voice", tries: 2 }], "find").state, "earned", "a retry that lands still counts");
  assert.equal(Stars.voice([{ via: "voice", tries: 2 }], "clinic").state, "open", "the clinic counts the first try only");
  const m = [1, 1, 1, 1, 0].map((ok) => ({ via: ok ? "voice" : "pill" }));
  assert.equal(Stars.voice(m, "monsoon").state, "earned", "4 of 5 = 80%");
});

test("progress: Busy wrongs count half in Monsoon, late never, capped at one stage", () => {
  const r = [
    { word: "dudh", ok: false },
    { word: "dudh", ok: false },
    { word: "dudh", ok: false },
    { word: "dudh", ok: false },
    { word: "dudh", ok: false },
    { word: "khun", outcome: "late" },
    { word: "loon", ok: true },
  ];
  const busy = Object.fromEntries(Stars.progress(r, "monsoon", { busy: true }).map((e) => [e.word, e]));
  assert.equal(busy.dudh.missWeight, 2, "5 x 0.5 capped at 2 (one stage)");
  assert.equal(busy.khun.missWeight, 0);
  assert.equal(busy.loon.correct, 1);
  const cook = Object.fromEntries(Stars.progress(r, "cook").map((e) => [e.word, e]));
  assert.equal(cook.dudh.missWeight, 5);
  assert.equal(cook.khun.missWeight, 1);
});

test("set: slot order, busy third star, voice only with a speaking moment; installInto keeps a mode's own", () => {
  assert.deepEqual(Stars.set("monsoon").map((s) => s.icon), ["ear", "umbrella", "tick"]);
  assert.deepEqual(Stars.set("monsoon", { busy: true, voice: true }).map((s) => s.key + ":" + s.icon), ["ear:ear", "hand:umbrella", "third:bolt", "voice:megaphone"]);
  const cd = { star_sets: { find: { hand: { icon: "eye", name: "Mine" } } } };
  Stars.installInto(cd);
  assert.equal(cd.star_sets.find.hand.name, "Mine");
  assert.equal(cd.star_sets.find.voice.icon, "mic");
  assert.ok(cd.star_sets.clinic);
});
