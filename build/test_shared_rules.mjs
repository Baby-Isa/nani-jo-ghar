// SH-155..SH-160 (Zafar, 29 Oct, round 4): the central rules (data/rules.json) and their one reader (js/shared/rules.js), the
// word pill's flag (js/core/progress.js), and the static check that chai keeps no copy of a rule's number.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pillPick, pillShows } from "../js/core/progress.js";

const require = createRequire(import.meta.url);
const ROOT = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), "utf8");
const FILE = JSON.parse(read("data/rules.json"));
const fresh = () => {
  delete require.cache[require.resolve("../js/shared/rules.js")];
  return require("../js/shared/rules.js");
};

test("the file loads, and the reader's defaults are the file's own numbers (the file wins)", () => {
  const R = fresh();
  assert.equal(R.loaded, true);
  for (const k of Object.keys(R.DEFAULT.levels)) assert.deepEqual(R.DEFAULT.levels[k], FILE.levels[k], `levels.${k}`);
  assert.deepEqual(R.DEFAULT.words, { pill: FILE.words.pill, holdMs: FILE.words.holdMs });
  assert.equal(R.DEFAULT.showing.pointMs, FILE.showing.pointMs);
  assert.deepEqual(R.DEFAULT.advance, { rounds: FILE.advance.rounds, maxGuideHints: FILE.advance.maxGuideHints, down: FILE.advance.down, top: FILE.advance.top });
  assert.equal(JSON.parse(read("data/shared.json")).rulesFile, "data/rules.json", "data/shared.json names the file");
});

test("levels: decoys 1-4 with the lookalike at L4, no asks from L2, the card's Kutchi always, English to L1, picture to L2", () => {
  const R = fresh();
  assert.deepEqual([1, 2, 3, 4].map((l) => R.level(l).decoys), [1, 2, 3, 4]);
  assert.deepEqual([1, 2, 3, 4].map((l) => R.level(l).lookalike), [false, false, false, true]);
  assert.deepEqual([1, 2, 3, 4].map((l) => R.level(l).noAsks), [false, true, true, true]);
  assert.deepEqual([1, 2, 3, 4].map((l) => R.level(l).cardKutchi), [true, true, true, true]);
  assert.deepEqual([1, 2, 3, 4].map((l) => R.level(l).cardEnglish), [true, false, false, false]);
  assert.deepEqual([1, 2, 3, 4].map((l) => R.level(l).cardPicture), [true, true, false, false]);
  assert.equal(R.level(9).level, 4, "clamped");
  assert.equal(R.level(0).level, 1, "clamped");
});

test("the hint waits: 7, 9, 11, 13 s, and the tokens' helpMs is filled from them (moved, not copied)", () => {
  const R = fresh();
  assert.deepEqual(R.hintList(), [7000, 9000, 11000, 13000]);
  assert.equal(JSON.parse(read("data/shared.json")).helpMs, undefined, "no second table in data/shared.json");
  const T = require("../js/shared/tokens.js");
  assert.deepEqual(T.ladder.helpMs, R.hintList());
});

test("how many: 1 + (most - 1)(level - 1)/3 rounded, a game's own override wins", () => {
  const R = fresh();
  assert.deepEqual(R.counts("chai-tray"), [1, 2, 2, 3]);
  assert.deepEqual(R.counts("fetch"), [1, 3, 4, 6]);
  assert.deepEqual(R.counts("maani-line"), [1, 2, 3, 4]);
  assert.equal(R.counts("nobody"), null);
  const J = structuredClone(FILE);
  J.count.games.fetch.levels = { 1: 2 };
  R.set(J);
  assert.deepEqual(R.counts("fetch"), [2, 3, 4, 6], "the pantry's L1 override (rulebook open question 1)");
});

test("the big card's hold by the word's state, the order card's light, noLast, the first-time hold", () => {
  const R = fresh();
  assert.equal(R.wordState(null), "new");
  assert.equal(R.wordState({ right: 2 }), "learning");
  assert.equal(R.wordState({ right: 2, pillEarned: true }), "known");
  assert.deepEqual(["new", "learning", "known"].map(R.hold), [1500, 1000, 600]);
  assert.equal(R.pointMs(), 1200);
  assert.equal(R.noLast(), true);
  assert.equal(R.firstTimeHold(), true);
  assert.equal(R.pillRun(), 3);
});

test("skip zones: a tap in the play area skips; a bubble, the side panel, the cog and its menu never do", () => {
  const R = fresh();
  // a stand-in element: closest() answers for the selectors it is inside
  const el = (...inside) => ({ closest: (sel) => (sel.split(",").map((x) => x.trim()).some((x) => inside.includes(x)) ? {} : null) });
  assert.equal(R.skips(el("#stage")), true);
  assert.equal(R.zoneOf(el("#stage")), "play");
  assert.equal(R.zoneOf(el(".cv-bubble")), "bubble");
  assert.equal(R.zoneOf(el("#side")), "side");
  assert.equal(R.zoneOf(el("[data-njg-zone=cog]")), "cog");
  assert.equal(R.zoneOf(el("[data-njg-zone=menu]")), "menu");
  assert.equal(R.skips(el(".cv-bubble")), false);
  assert.equal(R.skips(null), true);
});

test("the cog's menu: the ?, home and the book, in that order", () => {
  assert.deepEqual(fresh().menu(), ["btn-help", "btn-home", "btn-book"]);
});

test("SH-160 level-up: 3 rounds in a row with the hint at most once; a worse round restarts; never down; a grown-up's pick never counts", () => {
  const R = fresh();
  let st = { level: 1, streak: 0 };
  st = R.advance(st, { level: 1, hints: 1 });
  st = R.advance(st, { level: 1, hints: 0 });
  assert.deepEqual(st, { level: 1, streak: 2 });
  st = R.advance(st, { level: 1, hints: 2 });
  assert.deepEqual(st, { level: 1, streak: 0 }, "two hints: the count starts again (in a row)");
  st = R.advance(st, { level: 1, hints: 0, grownUp: true });
  assert.deepEqual(st, { level: 1, streak: 0 }, "a grown-up's pick never counts");
  st = R.advance(st, { level: 3, hints: 0 });
  assert.deepEqual(st, { level: 1, streak: 0 }, "a round at another level never counts");
  for (let i = 0; i < 3; i++) st = R.advance(st, { level: 1, hints: 0 });
  assert.deepEqual(st, { level: 2, streak: 0 });
  assert.equal(R.startLevel(st), 2, "the next round starts at L2");
  for (let i = 0; i < 20; i++) st = R.advance(st, { level: st.level, hints: 5 });
  assert.equal(st.level, 2, "never down by itself");
  st = { level: 4, streak: 0 };
  for (let i = 0; i < 5; i++) st = R.advance(st, { level: 4, hints: 0 });
  assert.equal(st.level, 4, "top at L4");
  const J = structuredClone(FILE);
  J.advance.rounds = 2;
  R.set(J);
  assert.equal(R.advance(R.advance({ level: 1 }, { level: 1 }), { level: 1 }).level, 2, "a change in the file is the rule");
});

test("SH-159 the word pill: three right hide, a miss shows, one right hides again, a peek never counts", () => {
  let r = null;
  for (let i = 0; i < 2; i++) r = pillPick(r, { ok: true }, 3);
  assert.equal(pillShows(r), true, "two right: still written");
  r = pillPick(r, { ok: true, peek: true }, 3);
  assert.equal(pillShows(r), true, "a peek is never a right pick");
  assert.equal(r.pillRun, 2, "... nor a break");
  r = pillPick(r, { ok: true, firstTry: false }, 3);
  assert.equal(r.pillRun, 2, "a second try is never a right pick");
  r = pillPick(r, { ok: true }, 3);
  assert.equal(pillShows(r), false, "three right in a row: the speaker only");
  r = pillPick(r, { ok: false }, 3);
  assert.equal(pillShows(r), true, "a miss brings the Kutchi back");
  r = pillPick(r, { ok: true }, 3);
  assert.equal(pillShows(r), false, "one right pick hides it again");
  let q = pillPick(null, { ok: true }, 3);
  q = pillPick(q, { ok: false }, 3);
  q = pillPick(pillPick(q, { ok: true }, 3), { ok: true }, 3);
  assert.equal(pillShows(q), true, "not yet earned: a miss starts the run again");
  globalThis.Rules = fresh();
  assert.equal(pillShows(pillPick(pillPick(pillPick(null, { ok: true }), { ok: true }), { ok: true })), false, "the run from the central rules");
  delete globalThis.Rules;
});

test("a change in the file is seen by chai: the numbers chai asks for follow the rules", () => {
  const R = fresh();
  const J = structuredClone(FILE);
  J.levels.decoys = [2, 2, 3, 4];
  J.levels.hintS = [5, 9, 11, 13];
  J.levels.cardEnglish = [true, true, false, false];
  J.count.games["chai-tray"].most = 4;
  J.showing.pointMs = 900;
  R.set(J);
  // (what js/cook/stations/chai-tray.js and js/cook/ui.js ask: rulesAt(level).decoys / .hintMs, Rules.counts, Rules.pointMs, cardEnglish)
  assert.equal(R.level(1).decoys, 2);
  assert.equal(R.level(1).hintMs, 5000);
  assert.equal(R.level(2).cardEnglish, true);
  assert.deepEqual(R.counts("chai-tray"), [1, 2, 3, 4]);
  assert.equal(R.pointMs(), 900);
  const chai = read("js/cook/stations/chai-tray.js");
  for (const ask of ["rulesAt(level)", "RULES().pointMs()", "RULES().firstTimeHold()", "Cook.roundDone(\"chai\""]) assert.ok(chai.includes(ask), `chai asks the rules: ${ask}`);
  assert.ok(read("js/cook/flow.js").includes("R.counts(c.rules)"), "chai's cups: the rules' count, filled in as Cook's data loads");
  const ui = read("js/cook/ui.js");
  for (const ask of ["global.Rules.level(mission.level || 1)", "global.Rules.hold(", "zones: s14 && !!global.Rules"]) assert.ok(ui.includes(ask), `the order asks the rules: ${ask}`);
});

test("chai keeps no copy of a rule's number (its code, its data, its rows in data/cook.json)", () => {
  const code = read("js/cook/stations/chai-tray.js").split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).map((l) => l.replace(/\/\/.*$/, ""));
  const bad = [];
  code.forEach((l, i) => {
    if (/levelTable|Cook\.levelRow\(|helpMs|Tokens\.ladder/.test(l)) bad.push(`chai-tray.js:${i + 1} reads a rule elsewhere: ${l.trim()}`);
    if (/\b(7000|9000|11000|13000|1500|600)\b/.test(l) && /hint|hold|pop|light14/.test(l)) bad.push(`chai-tray.js:${i + 1} a rule's number: ${l.trim()}`);
    if (/light14\([^)]*\b1200\b/.test(l)) bad.push(`chai-tray.js:${i + 1} the order card's light by hand: ${l.trim()}`);
  });
  const cook = JSON.parse(read("data/cook.json"));
  if (cook.levelTable.stations["chai-tray"]) bad.push("data/cook.json levelTable.stations chai-tray: a copy of the level rules");
  const cups = cook.recipes.chai.slots.cups.count;
  if (cups.rules !== "chai-tray" || (cups.byLevel || []).length > 1) bad.push(`data/cook.json recipes.chai cups.count: ${JSON.stringify(cups)} (the rules' count, named)`);
  const st = JSON.stringify(JSON.parse(read("data/stations/chai-tray.json")).mechanic);
  if (/"(decoyCount|nDecoys|helpMs|hintMs|holdMs|pointMs|cups)"/.test(st)) bad.push("data/stations/chai-tray.json: a rule's number");
  const ui = read("js/cook/ui.js");
  if (/stations \|\| \{\}\)\)\["chai-tray"\]|levelTable\.stations chai-tray en/.test(ui)) bad.push("js/cook/ui.js: chai's card from the old level row");
  assert.deepEqual(bad, []);
});

test("CHAI-39: chai's 'no' items are said last (the say list, built by the engine)", () => {
  const cook = JSON.parse(read("data/cook.json"));
  const say = cook.recipes.chai.say.find((x) => x.forEach).say;
  const frames = say.map((x) => x.frame);
  const firstNo = frames.indexOf("no");
  assert.ok(firstNo > 0);
  assert.ok(frames.slice(firstNo).every((f) => f === "no"), `every 'no' after the rest: ${frames.join(", ")}`);
});
