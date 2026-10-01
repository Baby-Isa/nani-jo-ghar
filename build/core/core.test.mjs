// Progress, Score, Wallet and Voice (js/core/): unit tests.
//  - progress: Cook's own word stages (js/cook/core.js, run as it is in a vm) and the core's model agree on
//    thousands of random seen/right/miss sequences; importing today's Cook words gives Cook's stages.
//  - score: the badge tiers are js/shared/results.js badges() for the same inputs.
//  - wallet: the pay formula's shape (volume, quality, difficulty, speaking), never negative, only buying spends.
//  - voice: which clip plays on the store path and on the test path.
// Run: node --test build/core/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { loadCook, seeded } from "./cook-harness.mjs";
import { meet, heard, said, importCook, fromCook, cookStageOf, support, createProgress, DEFAULT_DATA } from "../../js/core/progress.js";
import * as Score from "../../js/core/score.js";
import { payFor, mergeLegacy, createWallet } from "../../js/core/wallet.js";
import { chooseClip, clipIndex, planClips, createVoice } from "../../js/core/voice.js";
import { createSave } from "../../js/core/save.js";

const require = createRequire(import.meta.url);
const json = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), "utf8"));
const progressData = json("data/progress.json");
const economy = json("data/economy.json");
const live = JSON.parse(readFileSync(new URL("./fixtures/live-save.json", import.meta.url), "utf8"));

/* ---------------- progress ---------------- */

test("progress: data/progress.json and the built-in defaults are the same rules", () => {
  const norm = (o) => JSON.parse(JSON.stringify(o));
  for (const k of ["stages", "recallCues", "understand", "produce", "cookImport", "support"]) assert.deepEqual(norm(progressData[k]), norm(DEFAULT_DATA[k]), k);
});

test("progress: the core's understand stage = Cook's word stage on 3,000 random seen/right/miss sequences", async () => {
  const { Cook } = await loadCook({ seed: 1 });
  const rnd = seeded(42);
  // stage 5 is new (Cook stops at 4): compare while the core is at stage 4 or below
  for (let run = 0; run < 3000; run++) {
    Cook.save.words = {};
    let rec = null;
    for (let i = 0; i < 40; i++) {
      const x = rnd();
      if (x < 0.25) {
        Cook.markSeen("w");
        rec = meet(rec, progressData, 1);
      } else if (x < 0.75) {
        Cook.markRight("w");
        rec = heard(rec, { ok: true, cue: "kutchi" }, progressData, 1);
      } else {
        Cook.markMiss("w");
        rec = heard(rec, { ok: false }, progressData, 1);
      }
      if (rec.understand_stage > 4) break;
      assert.equal(rec.understand_stage, Cook.wordStage("w"), `run ${run} step ${i}`);
      // and the imported record of Cook's state is the same stage too
      assert.equal(fromCook(Cook.save.words.w, progressData).understand_stage, Cook.wordStage("w"));
    }
  }
});

test("progress: import of today's Cook words (the live save) keeps every count and Cook's stage", () => {
  const pid = JSON.parse(live.afterClinic["njg-save"]).current;
  const cookWords = JSON.parse(live.afterClinic[`njg-save:${pid}:cook`]).words;
  const words = importCook({}, cookWords, progressData);
  for (const [id, w] of Object.entries(cookWords)) {
    assert.equal(words[id].understand_stage, cookStageOf(w));
    assert.deepEqual([words[id].seen, words[id].right, words[id].miss], [w.seen, w.right, w.miss]);
  }
  // Cook keeps playing on old code: only what it added since comes over (no double counting)
  const later = JSON.parse(JSON.stringify(cookWords));
  later["cook-chai"].right += 3;
  later["cook-chai"].seen += 3;
  const again = importCook(words, later, progressData);
  assert.equal(again["cook-chai"].right, cookWords["cook-chai"].right + 3);
  assert.equal(again["cook-chai"].understand_stage, 3);
  // a word the core also wrote: Cook's later rights are added as recalls, not re-imported over it
  const mixed = Object.assign({}, words, { "cook-khun": heard(words["cook-khun"], { ok: true }, progressData) });
  const m2 = importCook(mixed, later, progressData);
  assert.equal(m2["cook-khun"].right, mixed["cook-khun"].right, "nothing new from Cook for khun");
});

test("progress: G23 up on recall only, down after two misses; picture or text help is not recall", () => {
  let r = meet(null, progressData);
  assert.equal(r.understand_stage, 2);
  for (let i = 0; i < 10; i++) r = heard(r, { ok: true, cue: "picture" }, progressData);
  assert.equal(r.understand_stage, 2, "with a picture: exposure, not recall");
  for (let i = 0; i < 4; i++) r = heard(r, { ok: true }, progressData);
  assert.equal(r.understand_stage, 3);
  r = heard(r, { ok: false }, progressData);
  assert.equal(r.understand_stage, 3, "one miss: no drop");
  r = heard(r, { ok: false }, progressData);
  assert.equal(r.understand_stage, 2, "two misses in a row: down a stage");
  // speaking
  let s = null;
  s = said(s, { ok: true, via: "pill" }, progressData);
  assert.equal(s.produce_stage, 1, "a pill is practice, not recall");
  s = said(s, { ok: true }, progressData);
  assert.equal(s.produce_stage, 2);
  s = said(s, { ok: false }, progressData);
  s = said(s, { ok: false }, progressData);
  assert.equal(s.produce_stage, 1);
});

test("progress: support() reproduces Cook's labelMode, cardHidden and hint delays by stage", async () => {
  const { Cook } = await loadCook({ seed: 1 });
  const P = createProgress({ save: null, data: progressData });
  for (const [right, seen] of [[0, 0], [1, 1], [4, 5], [9, 9]]) {
    Cook.save.words = { "cook-chai": { seen, right, miss: 0, streakMiss: 0 } };
    const s = support(fromCook(Cook.save.words["cook-chai"], progressData), progressData);
    assert.equal(s.label, Cook.labelMode("cook-chai"));
    assert.equal(s.card === "dots", Cook.cardHidden("cook-chai"));
    assert.equal(s.hintAfterMs, Cook.data.calm.hintMs[Cook.wordStage("cook-chai") - 1]);
  }
  assert.equal(support({ understand_stage: 4 }, progressData, { placeholder: true }).card, "text", "a placeholder is never dotted out");
  assert.equal(P.stage("x"), 1);
});

/* ---------------- score ---------------- */

test("score: the three badges are exactly js/shared/results.js's for the same inputs", () => {
  globalThis.self = globalThis;
  const Results = require("../../js/shared/results.js");
  const rnd = seeded(7);
  for (let i = 0; i < 5000; i++) {
    const total = Math.floor(rnd() * 12);
    const r = { right: Math.floor(rnd() * (total + 2)) - 1, total, hints: Math.floor(rnd() * 5), timeMs: rnd() < 0.1 ? undefined : Math.floor(rnd() * 200000), marks: null };
    const prev = rnd() < 0.3 ? null : Math.floor(rnd() * 200000);
    assert.deepEqual(Score.badges(r, prev), Results.badges(r, prev));
    assert.equal(Score.bestKey("cook", "chai", r.hints), Results.bestKey("cook", "chai", r.hints));
    assert.equal(Score.clock(r.timeMs), Results.clock(r.timeMs));
  }
});

test("score: finish() writes the best (same key as today), pays the wallet and feeds word progress; no stars", () => {
  const Save = createSave({});
  Save.use(Save.memoryStore());
  Save.ensurePlayer();
  Save.set("ui", { bests: { "cook/chai/L1": 43737 } });
  const wallet = createWallet({ save: Save, economy });
  const progress = createProgress({ save: Save, data: progressData });
  const S = Score.createScore({ save: Save, wallet, progress });
  const out = S.finish({ mode: "cook", game: "chai", level: 1, timeMs: 30000, right: 3, total: 3, hints: 0, rows: [{ word: "cook-chai", ok: true }, { word: "cook-dudh", ok: true }, { word: "cook-khun", ok: true }] });
  assert.equal(out.badges.time.newBest, true);
  assert.equal(Save.get("ui").bests["cook/chai/L1"], 30000);
  assert.equal(out.badges.accuracy.tier, "gold");
  assert.ok(out.pay.coins > 0);
  assert.equal(wallet.coins(), out.pay.coins);
  assert.equal(progress.get("cook-chai").right, 1);
  assert.ok(!JSON.stringify(out).includes("star"), "no stars anywhere");
});

/* ---------------- wallet ---------------- */

test("wallet: pay = volume x quality x difficulty; better play and speaking pay more; never below the minimum", () => {
  const base = { mode: "cook", level: 1, tasks: 4, right: 4, total: 4, hints: 0, timeTier: "mid" };
  const p = (o) => payFor(Object.assign({}, base, o), economy).coins;
  assert.ok(p({ tasks: 8, total: 8, right: 8 }) > p({}), "more tasks, more coins");
  assert.ok(p({ right: 2 }) < p({}), "fewer ticks, fewer coins");
  assert.ok(p({ hints: 2 }) < p({}), "hints cost a little");
  assert.ok(p({ timeTier: "gold" }) >= p({ timeTier: "plain" }), "a quick time pays more");
  assert.ok(p({ level: 3 }) > p({}), "harder levels pay more");
  assert.ok(p({ spoken: { ok: 2, total: 2 } }) > p({ spoken: { ok: 0, total: 2 } }), "correct speaking pays more");
  assert.equal(p({ spoken: { ok: 0, total: 2 } }), p({}), "speaking is a bonus only");
  assert.ok(p({ right: 0, hints: 5, timeTier: "plain", tasks: 1, total: 1 }) >= economy.pay.minCoins, "always something for helping");
});

test("wallet: coins only go up except when buying; no wages; owned once", () => {
  const W = createWallet({ economy });
  assert.equal(W.coins(), 0);
  W.earn(-5);
  W.earn(0);
  assert.equal(W.coins(), 0, "nothing ever takes coins away");
  W.earn(12);
  assert.equal(W.canBuy("knife"), true);
  assert.equal(W.buy("knife"), true);
  assert.equal(W.coins(), 12 - W.price("knife"));
  assert.equal(W.buy("knife"), false, "owned once");
  assert.equal(W.buy("machine"), false, "not affordable");
  assert.equal(W.price("mixer"), undefined, "hidden items aren't for sale");
  assert.ok(economy.shop.every((x) => !("wage" in x)), "no wages in the economy");
});

test("wallet: merging the old purses adds increases only", () => {
  let w = mergeLegacy(null, { cook: { coins: 10, owned: ["helper"] }, clinic: { coins: 3 } });
  assert.equal(w.coins, 13);
  w = mergeLegacy(w, { cook: { coins: 6 }, clinic: { coins: 3 } });
  assert.equal(w.coins, 13, "Cook's old shop or wage going down takes nothing");
  w = mergeLegacy(w, { cook: { coins: 8 }, clinic: { coins: 5 } });
  assert.equal(w.coins, 17);
  assert.deepEqual(w.owned, ["helper"]);
});

/* ---------------- voice ---------------- */

test("voice: the store path plays only OK clips; the test path may use unchecked ones; redo never plays", () => {
  const okMum = { file: "m.mp3", speaker: "mum", checked: "ok" };
  const okZ = { file: "z.mp3", speaker: "zafar", checked: "ok" };
  const unMum = { file: "mu.mp3", speaker: "mum", checked: null };
  const redo = { file: "r.mp3", speaker: "mum", checked: "redo" };
  assert.equal(chooseClip([unMum], { path: "store" }), null, "store: an unchecked clip never plays (G16)");
  assert.equal(chooseClip([unMum], { path: "test" }).file, "mu.mp3");
  assert.equal(chooseClip([unMum], { path: "test" }).source, "family-unchecked");
  assert.equal(chooseClip([redo], { path: "test" }), null, "redo never plays");
  assert.equal(chooseClip([unMum, okZ], { path: "test" }).file, "z.mp3", "OK beats unchecked");
  assert.equal(chooseClip([okZ, okMum], { path: "store" }).file, "m.mp3", "Mum first");
  assert.equal(chooseClip([okZ, okMum], { path: "store", speaker: "zafar" }).file, "z.mp3", "the asked speaker's own take");
  assert.equal(chooseClip([unMum, okZ], { path: "store", speaker: "mum" }).file, "z.mp3", "store: the asked speaker's unchecked take is skipped");
});

test("voice: the real recordings index on each path; TTS and the device voice only on the test path", () => {
  const fam = json("data/family-audio.json");
  const tts = json("data/cook-tts.json").lines;
  const idx = clipIndex(fam, { tts });
  const segs = [{ t: "Muke", lang: "k" }, { t: " ", lang: null }, { t: "chai", lang: "k", w: "cook-chai" }, { t: " khape.", lang: "k" }];
  const store = planClips(segs, idx, { path: "store" });
  const testp = planClips(segs, idx, { path: "test" });
  assert.ok(store.every((c) => c.source === "family-ok" || c.source === "missing"), JSON.stringify(store));
  assert.ok(testp.some((c) => c.source === "tts" || c.source === "family-unchecked" || c.source === "device") || testp.every((c) => c.source === "family-ok"));
  // every OK clip the store path picks is marked ok in the data
  const okFiles = new Set(fam.filter((e) => e.checked === "ok").map((e) => e.file));
  store.filter((c) => c.file).forEach((c) => assert.ok(okFiles.has(c.file)));
  // an English placeholder: never a family clip, heard only on the test path
  const en = planClips([{ t: "with", lang: "e" }], idx, { path: "store" });
  assert.equal(en[0].source, "missing");
});

test("voice: one queue per channel; a new line replaces the one playing; say() returns at once", async () => {
  const played = [];
  const player = { play: (f) => (played.push(f), new Promise((r) => setTimeout(r, 20))), stop() {}, synth: async () => true };
  const V = createVoice({ index: clipIndex([]), player, path: "test", gapMs: 0 });
  const a = V.say({ clipPlan: [{ file: "a1", source: "family-ok", tokens: [0, 0] }, { file: "a2", source: "family-ok", tokens: [1, 1] }] });
  const b = V.say({ clipPlan: [{ file: "b1", source: "family-ok", tokens: [0, 0] }] });
  const [ra, rb] = await Promise.all([a, b]);
  assert.equal(ra.done, false, "the first line was replaced");
  assert.equal(rb.done, true);
  assert.ok(!played.includes("a2"), "never overlaps: a's second clip never started");
  const words = [];
  await V.say({ clipPlan: [{ file: "c", source: "family-ok", tokens: [0, 2] }] }, { onWord: (t) => words.push(t) });
  assert.deepEqual(words, [[0, 2]], "the read-along hears each span as it starts");
  // the store path never plays a stand-in, even if a plan carries one
  const S = createVoice({ index: clipIndex([]), player, path: "store", gapMs: 0 });
  played.length = 0;
  await S.say({ clipPlan: [{ file: "t.mp3", source: "tts", tokens: [0, 0] }, { file: "u.mp3", source: "family-unchecked", tokens: [1, 1] }] });
  assert.deepEqual(played, []);
});

test("loadCore: every part wired over one save, with the real data files", async () => {
  const { loadCore } = await import("../../js/core/index.js");
  const Save = createSave({});
  const s = Save.memoryStore();
  Object.entries(live.afterClinic).forEach(([k, v]) => s.setItem(k, v));
  Save.use(s);
  const core = await loadCore({ save: Save, player: { play: async () => true, stop() {} } });
  assert.equal(core.save.init().schema, 2);
  assert.equal(core.wallet.coins(), 51, "48 from Cook + 3 from the clinic, one purse");
  assert.equal(core.progress.stage("cook-chai"), 2);
  assert.equal(core.settings.get("modelVoice"), "girl");
  assert.equal(core.unlocks.isOpen("kitchen"), true);
  assert.equal(core.play.play, "free");
  assert.equal(core.entitlements.has("anything"), true);
  const out = core.score.finish({ mode: "clinic", game: "pharmacy", level: 1, timeMs: 20000, right: 2, total: 3, hints: 1 });
  assert.equal(core.wallet.coins(), 51 + out.pay.coins);
});

test("progress follows Cook's own word records while Cook is still on old code", () => {
  const Save = createSave({});
  const s = Save.memoryStore();
  Object.entries(live.afterClinic).forEach(([k, v]) => s.setItem(k, v));
  Save.use(s);
  Save.init();
  const P = createProgress({ save: Save, data: progressData });
  assert.equal(P.stage("cook-dudh"), 2);
  // the classic Cook marks dudh right three more times
  Save.update("cook", (c) => ((c.words["cook-dudh"].right += 3), (c.words["cook-dudh"].seen += 3), c));
  assert.equal(P.stage("cook-dudh"), 3, "1 + 3 rights: Cook's stage 3, seen through the core");
  // and a brand-new Cook word appears
  Save.update("cook", (c) => ((c.words["veg-01"] = { seen: 1, right: 0, miss: 0, streakMiss: 0 }), c));
  assert.equal(P.stage("veg-01"), 2);
});

test("voice: busy() while a line plays, not after", async () => {
  const player = { play: () => new Promise((r) => setTimeout(r, 15)), stop() {} };
  const V = createVoice({ index: clipIndex([]), player, path: "test", gapMs: 0 });
  const p = V.say({ clipPlan: [{ file: "a", source: "family-ok", tokens: [0, 0] }] });
  assert.equal(V.busy(), true);
  await p;
  assert.equal(V.busy(), false);
});
