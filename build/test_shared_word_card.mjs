// Sprint 11, Step 0: the word card's stages (js/shared/word-card.js), progress's card slots and free reveals (js/core/progress.js),
// the play log's fold (js/shared/onboard.js PlayLog) and the move-on hook (js/shared/buttons.js).
//   node --test build/test_shared_word_card.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { support, reveal, heard, createProgress, DEFAULT_DATA } from "../js/core/progress.js";

const require = createRequire(import.meta.url);
const W = require("../js/shared/word-card.js");
const Onboard = require("../js/shared/onboard.js");
const B = require("../js/shared/buttons.js");
const data = JSON.parse(readFileSync(new URL("../data/progress.json", import.meta.url), "utf8"));
const PL = Onboard.playLog;

test("the fade order (Zafar, 21 Oct): 1-2 all shown, 3 English blank, 4 the picture too, 5 the Kutchi text too; the speaker always", () => {
  const want = { 1: [1, 1, 1], 2: [1, 1, 1], 3: [1, 0, 1], 4: [0, 0, 1], 5: [0, 0, 0] };
  for (const [st, [pic, en, k]] of Object.entries(want)) {
    const s = W.slots(Number(st));
    assert.deepEqual([s.picture, s.english, s.kutchi].map(Number), [pic, en, k], `stage ${st}`);
    assert.equal(s.speaker, true);
  }
  assert.equal(W.slots(0).stage, 1, "below 1 is a new word");
  assert.equal(W.slots(9).stage, 5);
});

test("the card's table is data/progress.json's (one table: the card never fades on its own rules)", () => {
  for (const st of [1, 2, 3, 4, 5]) {
    const s = support({ understand_stage: st }, data);
    const c = W.slots(st);
    assert.deepEqual([s.picture, s.english, s.kutchiText], [c.picture, c.english, c.kutchi], `stage ${st}`);
    assert.deepEqual(DEFAULT_DATA.support[st].english, data.support[st].english);
  }
});

test("a word still to record keeps its grey placeholder: never blanked, at any stage", () => {
  assert.equal(W.slots(5, { placeholder: true }).kutchi, true);
  assert.equal(support({ understand_stage: 5 }, data, { placeholder: true }).kutchiText, true);
});

test("a reveal is logged as its cue and never advances the word (principle 7)", () => {
  let r = { understand_stage: 3, u_streak: 4 };
  r = reveal(r, "english", data, 1000);
  r = reveal(r, "picture", data, 2000);
  r = reveal(r, "nonsense", data, 3000);
  assert.equal(r.understand_stage, 3);
  assert.equal(r.u_streak, 4);
  assert.deepEqual(r.cues, { english: 2, picture: 1 });
  assert.deepEqual(r.lastCue, { cue: "english", at: 3000 });
  // an answer given with the picture's help is exposure, not recall
  const h = heard({ understand_stage: 3, u_streak: 4 }, { ok: true, cue: "picture" }, data);
  assert.equal(h.understand_stage, 3);
  assert.equal(h.u_streak, 4);
  const k = heard({ understand_stage: 3, u_streak: 4 }, { ok: true, cue: "kutchi" }, data);
  assert.equal(k.understand_stage, 4, "the Kutchi alone still counts");
});

test("progress.reveal through the service writes the save's words", () => {
  const store = {};
  const save = { get: (ns) => store[ns] || {}, set: (ns, v) => (store[ns] = v), update: (ns, fn) => (store[ns] = fn(store[ns] || {})), has: () => false };
  const P = createProgress({ save, data });
  P.reveal("cook-chai", "picture");
  assert.equal(P.get("cook-chai").cues.picture, 1);
  assert.equal(P.stage("cook-chai"), 1);
  assert.equal(P.support("cook-chai").english, true);
});

test("the play log: a stage folds into steps with first act, dead taps, acts and helps", () => {
  const E = (what, t, x) => Object.assign({ what, t, reason: "" }, x);
  const entries = [
    E("stage-start", 1000, { reason: "cook/chai-tray" }),
    E("step-open", 1000, { step: "water" }),
    E("demo", 1100, { step: "water" }),
    E("act", 3000),
    E("step-close", 3500, { step: "water" }),
    E("step-open", 3500, { step: "tea" }),
    E("rung", 8600, { step: "tea", rung: 5 }),
    E("demo", 8600, { step: "tea" }),
    E("act", 10000),
    E("stage-end", 11000, { reason: "cook/chai-tray" }),
  ];
  const taps = [{ t: 1500, live: false }, { t: 3000, live: false }, { t: 6000, live: false }, { t: 7000, live: false }, { t: 10000, live: true }];
  const r = PL.fold(entries, taps, { level: 1 });
  assert.equal(r.mode, "cook");
  assert.equal(r.game, "chai-tray");
  assert.equal(r.ms, 10000);
  assert.deepEqual(r.steps.map((s) => s.step), ["water", "tea"]);
  const [w, t] = r.steps;
  assert.equal(w.firstActMs, 2000);
  assert.equal(w.taps, 1, "the tap at 1.5 s did nothing; the one at 3 s was the act");
  assert.equal(w.acts, 1);
  assert.equal(w.helps, 1);
  assert.equal(t.firstActMs, 6500);
  assert.equal(t.taps, 2);
  assert.equal(t.helps, 2);
  assert.deepEqual(PL.flags(w), []);
  assert.deepEqual(PL.flags(t), ["slow", "dead-taps"]);
  // every row carries the brief's fields
  for (const k of ["mode", "game", "step", "firstActMs", "taps", "acts", "helps"]) assert.ok(k in t, k);
});

test("the play log: names from a host stage or a page's own, the last 50 kept", () => {
  assert.deepEqual(PL.names("clinic/eye"), { mode: "clinic", game: "eye" });
  assert.deepEqual(PL.names("cook:station", { game: "chai" }), { mode: "cook", game: "chai" });
  let list = [];
  for (let i = 0; i < 60; i++) list = PL.append(list, { i });
  assert.equal(list.length, 50);
  assert.equal(list[0].i, 10);
  const one = PL.fold([{ what: "stage-start", t: 0, reason: "day:door" }, { what: "stage-end", t: 9000, reason: "day:door" }], [], {});
  assert.equal(one.steps.length, 1);
  assert.equal(one.steps[0].firstActMs, null);
  assert.deepEqual(PL.flags(one.steps[0]), ["slow"], "nothing done in 9 s is a slow step");
});

test("the move-on hook: no Next, no Done; it goes on by itself after its beat", async () => {
  assert.equal(B.BEAT_MS, 1000);
  assert.equal(B.speed(), 1);
  let done = 0;
  const t0 = Date.now();
  await B.moveOn(() => done++, { ms: 40 });
  assert.equal(done, 1);
  assert.ok(Date.now() - t0 >= 35);
  // it waits for what is under way (capped)
  let said = false;
  await B.moveOn(() => done++, { ms: 0, ready: new Promise((r) => setTimeout(() => ((said = true), r()), 30)) });
  assert.ok(said);
  await B.moveOn(() => done++, { ms: 0, ready: new Promise(() => {}), cap: 20 });
  assert.equal(done, 3);
});

test("EASY-08: the stuck spotlight hugs each live control's box; close neighbours shrink the pad, never get lit", () => {
  const [a] = Onboard.hugShapes([{ x: 100, y: 100, w: 80, h: 40 }]);
  assert.deepEqual([a.x, a.y, a.w, a.h, a.pad], [94, 94, 92, 52, 6], "a small, even pad");
  assert.ok(a.r <= 12);
  // two pills 4 px apart: each lit box stops 2 px short of the other
  const [p, q] = Onboard.hugShapes([{ x: 0, y: 0, w: 100, h: 40 }, { x: 104, y: 0, w: 100, h: 40 }]);
  assert.equal(p.pad, 2);
  assert.ok(p.x + p.w <= q.x);
  // a neighbour to keep dark (the card above the pills), 6 px away: the pad is 3, the light never reaches it
  const [r] = Onboard.hugShapes([{ x: 0, y: 50, w: 100, h: 40 }], [{ x: 0, y: 0, w: 100, h: 44 }]);
  assert.equal(r.pad, 3);
  assert.ok(r.y >= 44);
});

test("EASY-08 (Zafar, 22 Oct): one rounded box round a group given together; the box has no glow of its own", () => {
  // three controls in a row (haa, na, the mic): ONE box round all three, padded evenly
  const row = [{ x: 0, y: 0, w: 100, h: 40 }, { x: 104, y: 0, w: 100, h: 40 }, { x: 208, y: 0, w: 40, h: 40 }];
  const b = Onboard.groupBox(row);
  const P = Onboard.BOX_PAD;
  assert.deepEqual([b.x, b.y, b.w, b.h, b.pad], [-P, -P, 248 + 2 * P, 40 + 2 * P, P]);
  assert.ok(b.r > 0 && b.r <= 12, "rounded corners");
  // one thing alone: its own box; a neighbour to keep dark 8 px above: the pad shrinks to half the gap, never lighting it
  const one = Onboard.groupBox([{ x: 0, y: 50, w: 60, h: 80 }], [{ x: 0, y: 0, w: 60, h: 42 }]);
  assert.equal(one.pad, 4);
  assert.ok(one.y >= 42);
  assert.equal(Onboard.groupBox([]), null);
  // the outer glow round the box is gone (Zafar: "the rectangle itself doesn't need a glow")
  assert.equal(Onboard.glowShapes, undefined);
});

test("SH-118: one dim for every game, a little darker than 0.62", () => {
  assert.ok(Onboard.DIM >= 0.7 && Onboard.DIM <= 0.75);
  assert.equal(Onboard.dimFill(), "rgba(30,18,10," + Onboard.DIM + ")");
});

test("SH-119: the one finger's cadence: tap, lift off, wait half a second, again; no long gaps", () => {
  const T = Onboard.fingerMs();
  const k = Onboard.fingerKeys();
  assert.equal(k[0].o, 0);
  assert.equal(k[k.length - 1].o, 1);
  const press = k.find((f) => f.press);
  const lifted = k[k.length - 2];
  assert.ok(press && press.x === 0 && press.y === 0, "it presses on the point");
  assert.ok(lifted.x > 0 && lifted.y > 0 && !lifted.press, "it lifts off");
  assert.equal(Math.round((1 - lifted.o) * T), Onboard.FINGER.gap, "it waits lifted for the gap");
  assert.equal(Onboard.FINGER.gap, 500);
  assert.ok(T <= 1500, "one tap every " + T + " ms");
});
