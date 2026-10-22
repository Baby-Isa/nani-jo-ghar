// New player (Zafar, 21 Oct, Sprint 10): Save.resetPlayer(id), in both saves (js/shared/save.js, the classic one the pages
// load, and js/core/save.js, the module the engine core loads). After a reset every word is unseen, the first-time help
// shows again, Cook and the clinic are back at level 1 and the day and conversations are empty; the wallet, the character
// and shell.firstDone are kept; another player is untouched.
// No browser. Run: node --test build/test_shared_reset_player.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createSave } from "../js/core/save.js";
import { createProgress } from "../js/core/progress.js";
import { readFileSync } from "node:fs";

globalThis.self = globalThis;
const require = createRequire(import.meta.url);
const Classic = require("../js/shared/save.js");
const progressData = JSON.parse(readFileSync(new URL("../data/progress.json", import.meta.url), "utf8"));

// a child who has played: words learned, help seen, Cook and the clinic past level 1, a day under way, coins in the purse
function played(Save) {
  Save.use(Save.memoryStore());
  const a = Save.addPlayer({ name: "Ali" });
  const b = Save.addPlayer({ name: "Zara" });
  Save.select(a.id);
  Save.set("words", { "cook-chai": { understand_stage: 3, seen: 9 }, "num-02": { understand_stage: 2, seen: 4 } });
  Save.set("ui", { bests: { "cook:fetch:1": 41000 }, onboarded: { "cook:fetch": true, "clinic/heal-eye": true }, seen: { bulb: 1 }, clinic: { state: { session: 4, levels: { heal: 3 } } } });
  Save.set("cook", { v: 1, day: 3, best: { 1: 3 }, words: { "cook-chai": { seen: 5, right: 4 } }, taught: { chai: true } });
  Save.set("clinic", { state: { session: 5, levels: { waiting: 3, diagnosis: 2, pharmacy: 2, heal: 3, sendoff: 2 }, album: ["girl:eye"] } });
  Save.set("story", { dayNo: 4, today: { date: "2026-10-21", next: 2, stages: [{ stage: "door" }] } });
  Save.set("conversations", { done: { greeting: 3 } });
  Save.set("wallet", { coins: 120, owned: ["helper"] });
  Save.set("character", { look: "plait" });
  Save.setFlag("firstDone", true);
  Save.set("words", { "cook-chai": { understand_stage: 3, seen: 9 } }, b.id);
  return { a, b };
}

for (const [name, make] of [["js/shared/save.js (the classic save)", () => Classic], ["js/core/save.js (the module)", () => createSave(globalThis)]]) {
  test(`${name}: resetPlayer clears the child's learning and keeps the purse, the character and firstDone`, () => {
    const Save = make();
    const { a, b } = played(Save);
    assert.equal(Save.resetPlayer(a.id), a.id);
    // every namespace the reset names is empty ({} from get; absent from the player's keys)
    for (const ns of ["words", "ui", "cook", "clinic", "story", "conversations"]) {
      assert.deepEqual(Save.get(ns, a.id), {}, `${ns} cleared`);
      assert.ok(!Save.namespaces(a.id).includes(ns), `${ns} is gone`);
    }
    // kept
    assert.equal(Save.get("wallet", a.id).coins, 120, "the wallet is kept");
    assert.deepEqual(Save.get("wallet", a.id).owned, ["helper"]);
    assert.equal(Save.get("character", a.id).look, "plait", "the character is kept");
    assert.equal(Save.flag("firstDone", a.id), true, "the first-launch story does not take over again");
    // the same player, and the other player is untouched
    assert.equal(Save.currentId(), a.id);
    assert.equal(Save.players().length, 2);
    assert.equal(Save.get("words", b.id)["cook-chai"].understand_stage, 3);
  });

  test(`${name}: resetPlayer with no id resets the current player`, () => {
    const Save = make();
    const { a } = played(Save);
    Save.resetPlayer();
    assert.deepEqual(Save.get("words", a.id), {});
    assert.equal(Save.get("wallet", a.id).coins, 120);
  });

  test(`${name}: resetPlayer on a device with nothing saved does not throw`, () => {
    const Save = make();
    Save.use(Save.memoryStore());
    Save.ensurePlayer();
    assert.doesNotThrow(() => Save.resetPlayer());
  });
}

test("after the reset every word is unseen, onboarding shows again and Cook and the clinic start at level 1", () => {
  const Save = createSave(globalThis);
  const { a } = played(Save);
  const progress = createProgress({ save: Save, data: progressData });
  assert.ok(progress.stage("cook-chai") >= 3, "before: the word is learned");
  Save.resetPlayer(a.id);
  // words: every word is back to a first meeting
  const fresh = createProgress({ save: Save, data: progressData });
  assert.deepEqual(fresh.all(), {});
  assert.equal(fresh.stage("cook-chai"), fresh.stage("a-word-never-met"), "a learned word reads like one never met");
  // onboarding: the shared kit asks UIStore, which keeps "onboarded" in the ui namespace (Onboard.seen -> get('onboarded', id))
  const ui = Save.get("ui", a.id);
  assert.ok(!(ui.onboarded && ui.onboarded["cook:fetch"]), "the first-time help of Cook comes back");
  assert.ok(!(ui.onboarded && ui.onboarded["clinic/heal-eye"]), "the first-time help of the clinic comes back");
  // levels: the clinic reads levels from clinic.state (default 1 each) and the old ui.clinic.state; Cook's from its words and days
  const st = (Save.get("clinic", a.id) || {}).state || (ui.clinic || {}).state;
  assert.equal(st, undefined, "no clinic state: Clinic.Run.state() answers its default, every stage at level 1");
  assert.deepEqual(Save.get("cook", a.id), {}, "Cook has no days, bests or taught dishes");
  assert.deepEqual(Save.get("story", a.id), {}, "the day and the arcs start again");
  assert.equal(Save.get("wallet", a.id).coins, 120, "the wallet is kept");
});

test("the classic and the module save write the same keys: a reset by one is seen by the other", () => {
  const store = Classic.memoryStore();
  Classic.use(store);
  const p = Classic.addPlayer({ name: "Ali" });
  Classic.set("words", { x: { understand_stage: 2 } });
  Classic.set("wallet", { coins: 5 });
  const core = createSave(globalThis);
  core.use(store);
  core.resetPlayer(p.id);
  Classic.use(store); // re-read the root
  assert.deepEqual(Classic.get("words", p.id), {});
  assert.equal(Classic.get("wallet", p.id).coins, 5);
});
