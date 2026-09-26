// Node tests for the one save (js/shared/save.js): migration from every old
// per-mode localStorage key, separate players, export/import round trip,
// blocked or corrupt storage, and the adapters that read through it
// (UIStore for bests / onboarding "seen" / the clinic, speech enrolment).
// No browser. Run: node --test build/test_shared_save.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// the shared modules look for the save on `self` in a browser: give them one here
globalThis.self = globalThis;
const require = createRequire(import.meta.url);
const Save = require("../js/shared/save.js");
globalThis.Save = Save;
const UIStore = require("../js/shared/uistore.js");

// what a device had before the shell (the shapes each mode really wrote)
const OLD_COOK = {
  v: 1, mode: "busy", coins: 37, day: 3, best: { 1: 3, 2: 2 }, owned: ["helper"], slots: [], taught: { chai: true, maani: true },
  words: { "cook-chai": { seen: 5, right: 4, miss: 1, streakMiss: 0, last: 1727300000000 }, "num-02": { seen: 2, right: 1, miss: 0, streakMiss: 0 } },
  finished: false, freeRounds: 0, orders: 6, rulesSeen: true, find: { rounds: 2, best: { "bowl-01": 3 } }, snap: { rounds: 1 },
};
const OLD_UI = {
  bests: { "cook:fetch:1": 41000, "clinic:heal:1": 52000 },
  onboarded: { "cook:fetch": true },
  seen: { bulb: 1 },
  clinic: { state: { session: 4, levels: { waiting: 2, diagnosis: 1, pharmacy: 1, heal: 2, sendoff: 1 }, album: ["knee"], coins: 9 } },
};
const OLD_SPEECH = { "cook-chai": ["abc", "def"] };

function device(extra = {}) {
  const s = Save.memoryStore();
  Object.entries(extra).forEach(([k, v]) => s.setItem(k, typeof v === "string" ? v : JSON.stringify(v)));
  Save.use(s);
  return s;
}

test("migration: every old key becomes the first player's namespace; the old keys stay", () => {
  const s = device({ "njg-cook-v1": OLD_COOK, "njg-shared-ui-fallback-v1": OLD_UI, "njg-speech-enrol-v1": OLD_SPEECH });
  const r = Save.init();
  assert.equal(r.schema, Save.SCHEMA);
  assert.equal(Save.players().length, 1, "one player made from the old save");
  assert.equal(Save.current().name, "Player 1");
  assert.deepEqual(Save.get("cook"), OLD_COOK, "Cook's save (word stages, stars, coins, Find it/Snap sub-saves) intact");
  assert.deepEqual(Save.get("ui"), OLD_UI, "bests, onboarding flags and the clinic's state intact");
  assert.deepEqual(Save.get("speech"), OLD_SPEECH, "voice enrolment intact");
  assert.deepEqual(Object.keys(r.migrated).sort(), ["njg-cook-v1", "njg-shared-ui-fallback-v1", "njg-speech-enrol-v1"]);
  assert.ok(s.getItem("njg-cook-v1"), "old keys are never deleted (a way back)");
  // a later visit (fresh page: new cache on the same storage) doesn't migrate again
  Save.use(s);
  Save.init();
  assert.equal(Save.players().length, 1, "no second migration");
  assert.deepEqual(Save.get("cook"), OLD_COOK);
});

test("migration: only the keys that exist; a clean device has nobody until a player is made", () => {
  device({ "njg-shared-ui-fallback-v1": OLD_UI });
  Save.init();
  assert.equal(Save.players().length, 1);
  assert.deepEqual(Save.get("ui"), OLD_UI);
  assert.equal(Save.has("cook"), false);
  assert.deepEqual(Save.get("cook"), {}, "an empty namespace reads as {}");

  device();
  Save.init();
  assert.equal(Save.players().length, 0, "a new device: no one yet (the shell's first launch)");
  assert.equal(Save.currentId(), null);
  const p = Save.ensurePlayer();
  assert.equal(p.name, "Player 1", "a mode page opened on its own gets a player");
  assert.ok(p.auto, "marked as not named by a grown-up");
  assert.equal(Save.ensurePlayer().id, p.id, "and only one");
});

test("migration: a corrupt old key is skipped, not fatal", () => {
  device({ "njg-cook-v1": "{not json", "njg-shared-ui-fallback-v1": OLD_UI });
  Save.init();
  assert.equal(Save.players().length, 1);
  assert.equal(Save.has("cook"), false);
  assert.deepEqual(Save.get("ui"), OLD_UI);
});

test("players: each child has their own save", () => {
  device({ "njg-cook-v1": OLD_COOK });
  const zayn = Save.current();
  Save.updatePlayer(zayn.id, { name: "Zayn", colour: "#2e86c1" });
  const maryam = Save.addPlayer({ name: "Maryam", colour: "#d35486" });
  assert.equal(Save.currentId(), maryam.id, "a new player becomes the current one");
  assert.deepEqual(Save.get("cook"), {}, "Maryam starts from nothing");
  Save.set("cook", { coins: 5, words: { "cook-chai": { seen: 1, right: 1 } } });
  Save.setFlag("firstDone", true);
  Save.select(zayn.id);
  assert.equal(Save.get("cook").coins, 37, "Zayn's coins untouched");
  assert.equal(Save.flag("firstDone"), undefined, "flags are per player too");
  assert.equal(Save.get("cook", maryam.id).coins, 5, "read another player's by id");
  assert.equal(Save.current().name, "Zayn");
  assert.equal(Save.current().auto, undefined, "named by a grown-up now");
  assert.equal(Save.select("nobody"), false);
  // removing a player removes only their keys
  Save.removePlayer(maryam.id);
  assert.equal(Save.players().length, 1);
  assert.equal(Save.has("cook", maryam.id), false);
  assert.equal(Save.get("cook").coins, 37);
});

test("export and import: a round trip, and merging into another device", () => {
  device({ "njg-cook-v1": OLD_COOK, "njg-shared-ui-fallback-v1": OLD_UI, "njg-speech-enrol-v1": OLD_SPEECH });
  const a = Save.current();
  Save.updatePlayer(a.id, { name: "Zayn" });
  const b = Save.addPlayer({ name: "Maryam" });
  Save.set("cook", { coins: 12 });
  const file = Save.exportJSON();
  const parsed = JSON.parse(file);
  assert.equal(parsed.format, "nani-jo-ghar-save");
  assert.equal(parsed.root.players.length, 2);

  // a fresh device: everything comes back exactly
  device();
  const res = Save.importJSON(file);
  assert.deepEqual(res, { players: 2, added: 2, replaced: 0 });
  assert.deepEqual(Save.players().map((p) => p.name), ["Zayn", "Maryam"]);
  assert.equal(Save.currentId(), b.id, "the file's current player");
  assert.deepEqual(Save.get("cook", a.id), OLD_COOK);
  assert.deepEqual(Save.get("ui", a.id), OLD_UI);
  assert.deepEqual(Save.get("speech", a.id), OLD_SPEECH);
  assert.equal(Save.get("cook", b.id).coins, 12);
  assert.equal(Save.exportJSON().replace(/"exported": "[^"]*"/, ""), file.replace(/"exported": "[^"]*"/, ""), "export(import(x)) == x");

  // a device with its own child: kept; the same id in the file replaces its old data
  device();
  const c = Save.addPlayer({ name: "Isa" });
  Save.set("cook", { coins: 99 });
  Save.importJSON(file);
  assert.equal(Save.players().length, 3, "Isa kept, Zayn and Maryam added");
  assert.equal(Save.get("cook", c.id).coins, 99);
  Save.select(a.id);
  Save.set("find", { stale: true });
  const again = Save.importJSON(file);
  assert.equal(again.replaced, 2);
  assert.equal(Save.has("find", a.id), false, "a replaced player's old namespaces go");

  assert.throws(() => Save.importJSON("hello"), /isn't a Nani jo Ghar save/);
  assert.throws(() => Save.importJSON({ format: "other" }), /isn't a Nani jo Ghar save/);
  assert.throws(() => Save.importJSON({ format: "nani-jo-ghar-save", schema: 99, root: { players: [] } }), /newer version/);
});

test("blocked storage: the game plays from memory and says so", () => {
  const blocked = { getItem() { throw new Error("SecurityError"); }, setItem() { throw new Error("SecurityError"); }, removeItem() { throw new Error("SecurityError"); }, key: () => null, length: 0 };
  Save.use(blocked);
  Save.init();
  const p = Save.ensurePlayer();
  Save.set("cook", { coins: 3 });
  assert.equal(Save.get("cook").coins, 3, "kept for the visit");
  assert.equal(Save.persistent(), false);
  assert.equal(Save.currentId(), p.id);
});

test("storage full mid-visit: carries on in memory", () => {
  const s = device();
  Save.ensurePlayer();
  Save.set("cook", { coins: 1 });
  const setItem = s.setItem;
  s.setItem = () => { throw new Error("QuotaExceededError"); };
  assert.equal(Save.set("cook", { coins: 2 }), false, "set reports it couldn't persist");
  assert.equal(Save.get("cook").coins, 2);
  assert.equal(Save.persistent(), false);
  s.setItem = setItem;
});

test("a corrupt or missing root is rebuilt from the players' keys", () => {
  const s = device({ "njg-save": "{broken", "njg-save:pabc:cook": { coins: 8 }, "njg-save:pdef:ui": { seen: {} } });
  Save.init();
  assert.deepEqual(Save.players().map((p) => p.id), ["pabc", "pdef"]);
  assert.equal(Save.get("cook").coins, 8);
  assert.ok(JSON.parse(s.getItem("njg-save")).recovered);
});

test("UIStore (bests, onboarding flags, the clinic) reads and writes the one save", () => {
  device({ "njg-shared-ui-fallback-v1": OLD_UI });
  Save.init();
  assert.equal(UIStore.kind(), "save");
  assert.equal(UIStore.get("bests", "cook:fetch:1"), 41000, "migrated best time");
  assert.equal(UIStore.get("clinic", "state").session, 4, "migrated clinic session");
  UIStore.set("onboarded", "clinic:waiting", true);
  assert.equal(Save.get("ui").onboarded["clinic:waiting"], true);
  assert.equal(UIStore.profileId(), Save.currentId());
  const other = Save.addPlayer({ name: "Maryam" });
  assert.equal(UIStore.get("bests", "cook:fetch:1"), undefined, "the next child has their own bests");
  UIStore.set("bests", "cook:fetch:1", 30000);
  Save.select(Save.players()[0].id);
  assert.equal(UIStore.get("bests", "cook:fetch:1"), 41000);
  assert.equal(Save.get("ui", other.id).bests["cook:fetch:1"], 30000);
  // a test can still plug in its own backend
  UIStore.use(UIStore.memory({ x: { y: 1 } }));
  assert.equal(UIStore.get("x", "y"), 1);
  UIStore.use(null);
  assert.equal(UIStore.kind(), "save");
});

test("change events: the shell hears player and data changes", () => {
  device();
  const heard = [];
  const off = Save.onChange((k, w) => heard.push(k));
  Save.addPlayer({ name: "A" });
  Save.set("cook", {});
  off();
  Save.set("cook", {});
  assert.deepEqual(heard, ["player", "data"]);
});
