// Play context, unlocks, the map, settings, paid content and content versions (decision 22): unit tests.
// Run: node --test build/core/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createSave } from "../../js/core/save.js";
import { createUnlocks, Entitlements } from "../../js/core/unlocks.js";
import { createSettings, CHILD_DEFAULTS, DEVICE_DEFAULTS, langPath } from "../../js/core/settings.js";
import { makeContext, fromQuery, toQuery } from "../../js/core/context.js";
import { checkContent } from "../../js/core/content.js";

const json = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), "utf8"));
const rules = json("data/unlocks.json");
const map = json("data/map.json");
const live = JSON.parse(readFileSync(new URL("./fixtures/live-save.json", import.meta.url), "utf8"));

function fresh(keys = {}) {
  const Save = createSave({});
  const s = Save.memoryStore();
  Object.entries(keys).forEach(([k, v]) => s.setItem(k, typeof v === "string" ? v : JSON.stringify(v)));
  Save.use(s);
  Save.init();
  return Save;
}

test("unlocks: rules from data; the kitchen open, the beach locked until its story, with the reason", () => {
  const Save = fresh();
  Save.ensurePlayer();
  const U = createUnlocks({ save: Save, rules });
  assert.equal(U.isOpen("kitchen"), true);
  assert.equal(U.why("kitchen"), null);
  assert.equal(U.isOpen("beach"), false);
  assert.deepEqual(U.why("beach"), { id: "beach", arc: "beach", chapter: 1 }, "the label: locked until the beach story");
  U.finishChapter("beach", 1);
  assert.equal(U.isOpen("beach"), true, "story mode opens it");
  assert.deepEqual(U.arc("beach"), { chapter: 1, done: false });
});

test("unlocks: per child", () => {
  const Save = fresh();
  const a = Save.addPlayer({ name: "Zayn" });
  const U = createUnlocks({ save: Save, rules });
  U.finishArc("beach");
  assert.equal(U.isOpen("beach"), true);
  Save.addPlayer({ name: "Maryam" });
  assert.equal(U.isOpen("beach"), false, "Maryam hasn't played the beach story");
  Save.select(a.id);
  assert.equal(U.isOpen("beach"), true);
});

test("unlocks: all / any / by hand / unknown ids never throw; first launch's own done flag counts", () => {
  const Save = fresh(live.afterClinic);
  const R = { rules: { both: { all: [{ after: { arc: "beach" } }, { after: { arc: "first-launch" } }] }, either: { any: [{ after: { arc: "beach" } }, { after: { arc: "first-launch" } }] } } };
  const U = createUnlocks({ save: Save, rules: R });
  assert.equal(U.arc("first-launch").done, true, "the live save's first launch is done");
  assert.equal(U.isOpen("either"), true);
  assert.deepEqual(U.why("both"), { id: "both", arc: "beach", chapter: null });
  assert.deepEqual(U.why("nope"), { id: "nope", unknown: true });
  U.open("nope", "a grown-up");
  assert.equal(U.isOpen("nope"), true);
});

test("unlocks: the map lists every place, open or locked, with its reason", () => {
  const Save = fresh();
  Save.ensurePlayer();
  const U = createUnlocks({ save: Save, rules });
  const ps = U.places(map);
  assert.deepEqual(ps.map((p) => [p.id, p.open]), [["kitchen", true], ["clinic", true], ["beach", false]]);
  assert.equal(ps[2].why.arc, "beach");
  assert.ok(map.places.every((p) => rules.rules[p.unlock || p.id]), "every place has a rule");
});

test("paid content: Entitlements.has says yes for now; a no would lock with that reason", () => {
  assert.equal(Entitlements.has("beach"), true);
  const Save = fresh();
  Save.ensurePlayer();
  const U = createUnlocks({ save: Save, rules, entitlements: { has: (a) => a !== "beach" } });
  U.finishArc("beach");
  assert.equal(U.why("beach").entitlement, "beach");
});

test("settings: defaults per child; the model voice follows the character; set, validate, reset", () => {
  const Save = fresh(live.afterClinic);
  const S = createSettings({ save: Save });
  assert.deepEqual(S.all(), { modelVoice: "girl", level: null, readAlong: true, sound: true }, "the live save's character is a girl: Mum's model voice (G17)");
  assert.equal(S.modelSpeaker(), "mum");
  S.set("modelVoice", "boy");
  assert.equal(S.modelSpeaker(), "zafar");
  S.set("level", 3);
  assert.equal(S.get("level"), 3);
  assert.throws(() => S.set("level", 7));
  assert.throws(() => S.set("colour", "red"));
  S.reset("modelVoice");
  assert.equal(S.get("modelVoice"), "girl");
  // a child with no character yet
  const T = createSettings({ save: fresh() });
  assert.equal(T.get("modelVoice"), "boy");
  assert.deepEqual(Object.keys(CHILD_DEFAULTS), ["modelVoice", "level", "readAlong", "sound"]);
  // per device: the language and room for a per-screen scale (decision 24)
  assert.equal(S.device("lang"), "kutchi");
  assert.equal(langPath(S.device("lang"), "lexicon.json"), "data/lang/kutchi/lexicon.json", "the planned data path per language");
  assert.equal(S.device("scale"), DEVICE_DEFAULTS.scale);
  S.setDevice("scale", 1.25);
  assert.equal(S.device("scale"), 1.25);
  assert.throws(() => S.setDevice("scale", 9));
});

test("play context: one object, story or free play", () => {
  assert.deepEqual(makeContext(), { play: "free", arc: null, chapter: null, errand: null, level: null, place: null });
  const c = fromQuery("?play=story&arc=birthday&chapter=1&errand=cook-1&level=2");
  assert.deepEqual(c, { play: "story", arc: "birthday", chapter: 1, errand: "cook-1", level: 2, place: null });
  assert.equal(toQuery(c), "play=story&arc=birthday&chapter=1&errand=cook-1&level=2");
  assert.deepEqual(fromQuery("?play=free&place=kitchen&arc=x"), { play: "free", arc: null, chapter: null, errand: null, level: null, place: "kitchen" }, "free play has no arc");
  assert.equal(makeContext({ level: "9000", arc: "<script>" }).level, null, "bad values are dropped");
});

test("content versions: every new data file has one; updates and rollbacks never break a save", () => {
  for (const p of ["data/economy.json", "data/progress.json", "data/unlocks.json", "data/map.json"]) assert.ok(Number.isInteger(json(p).version), `${p} has a version`);
  const Save = fresh();
  Save.ensurePlayer();
  const U = createUnlocks({ save: Save, rules });
  assert.equal(checkContent(Save, "map", map).status, "new");
  assert.equal(checkContent(Save, "map", map).status, "same");
  U.open("beach", "test");
  // map v2 renames the beach; the opened place comes along
  const v2 = Object.assign({}, map, { version: 2, renamed: { beach: "seaside" } });
  assert.equal(checkContent(Save, "map", v2).status, "updated");
  assert.equal(createUnlocks({ save: Save, rules: { rules: {} } }).isOpen("seaside"), true);
  // a rollback to v1: the save is left alone
  const before = JSON.stringify(Save.get("unlocks"));
  assert.equal(checkContent(Save, "map", map).status, "older");
  assert.equal(JSON.stringify(Save.get("unlocks")), before);
  assert.equal(Save.contentVersion("map", "map"), 2);
  assert.equal(checkContent(Save, "arc", { id: "x" }).status, "unversioned");
});

test("story log: append-only days per arc; Score.finish writes the round's line in story mode only", async () => {
  const { createLog } = await import("../../js/core/log.js");
  const { createScore } = await import("../../js/core/score.js");
  const Save = fresh();
  Save.ensurePlayer();
  let day = 1;
  const log = createLog({ save: Save, now: () => new Date(`2026-10-0${day}T10:00:00Z`) });
  log.log({ arc: "birthday", type: "made", who: "nana", what: "cook-chai", count: 2 });
  log.log({ arc: "birthday", type: "made", what: "cook-maani" });
  assert.equal(log.days().length, 1);
  assert.equal(log.days()[0].entries.length, 2);
  assert.equal(log.log({ arc: "x" }), null, "no type: nothing logged, nothing thrown");
  const S = createScore({ save: Save, log });
  S.finish({ mode: "cook", game: "chai", level: 1, right: 2, total: 2, hints: 0, play: makeContext({ play: "free" }) });
  assert.equal(log.days()[0].entries.length, 2, "free play: no story line");
  S.finish({ mode: "cook", game: "chai", level: 1, right: 2, total: 2, hints: 0, play: makeContext({ play: "story", arc: "birthday", chapter: 1, errand: "cook-1" }) });
  assert.deepEqual(log.days()[0].entries[2].type, "round");
  // retention: the current and the previous arc only
  day = 2;
  log.log({ arc: "beach", type: "saw", what: "x" });
  day = 3;
  log.log({ arc: "quilt", type: "placed", what: "y" });
  assert.deepEqual(log.days().map((d) => d.arc), ["beach", "quilt"]);
});
