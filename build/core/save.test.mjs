// The one save at schema 2 (js/core/save.js): today's API and keys, the 1 -> 2 migration on REAL save shapes
// captured from the live pages (build/core/fixtures/live-save.json, by build/core/capture-saves.mjs), the
// pre-shell keys straight to schema 2, and the classic js/shared/save.js reading a schema-2 save unchanged.
// Run: node --test build/core/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createSave, SCHEMA } from "../../js/core/save.js";
import { createWallet } from "../../js/core/wallet.js";
import { createProgress, cookStageOf } from "../../js/core/progress.js";

const require = createRequire(import.meta.url);
const live = JSON.parse(readFileSync(new URL("./fixtures/live-save.json", import.meta.url), "utf8"));
const economy = JSON.parse(readFileSync(new URL("../../data/economy.json", import.meta.url), "utf8"));
const progressData = JSON.parse(readFileSync(new URL("../../data/progress.json", import.meta.url), "utf8"));

// the shapes each mode wrote before the shell (as in build/test_shared_save.mjs, from the real modes)
const OLD_COOK = {
  v: 1, mode: "busy", coins: 37, day: 3, best: { 1: 3, 2: 2 }, owned: ["helper"], slots: [], taught: { chai: true, maani: true },
  words: { "cook-chai": { seen: 5, right: 4, miss: 1, streakMiss: 0, last: 1727300000000 }, "num-02": { seen: 2, right: 1, miss: 0, streakMiss: 0 } },
  finished: false, freeRounds: 0, orders: 6, rulesSeen: true, find: { rounds: 2, best: { "bowl-01": 3 } }, snap: { rounds: 1 },
};
const OLD_UI = {
  bests: { "cook:fetch:1": 41000 }, onboarded: { "cook:fetch": true }, seen: { bulb: 1 },
  clinic: { state: { session: 4, levels: { waiting: 2, diagnosis: 1, pharmacy: 1, heal: 2, sendoff: 1 }, album: ["knee"], coins: 9 } },
};

function device(Save, keys) {
  const s = Save.memoryStore();
  Object.entries(keys).forEach(([k, v]) => s.setItem(k, typeof v === "string" ? v : JSON.stringify(v)));
  Save.use(s);
  return s;
}
const snapshot = (s) => {
  const o = {};
  for (let i = 0; i < s.length; i++) o[s.key(i)] = s.getItem(s.key(i));
  return o;
};

test("live save (first launch + a clinic morning, schema 1) -> schema 2: one purse, words, nothing lost", () => {
  const Save = createSave({});
  const s = device(Save, live.afterClinic);
  const before = snapshot(s);
  const r = Save.init();
  assert.equal(r.schema, 2);
  assert.equal(r.lang, "kutchi", "language is a setting, Kutchi by default");
  const pid = r.current;
  const cook = JSON.parse(before[`njg-save:${pid}:cook`]);
  const ui = JSON.parse(before[`njg-save:${pid}:ui`]);
  // every old key and namespace is byte-for-byte what it was
  Object.entries(before).forEach(([k, v]) => k !== "njg-save" && assert.equal(s.getItem(k), v, `${k} unchanged`));
  // the one purse: Cook's coins + the clinic's coins
  const w = Save.get("wallet");
  assert.equal(w.coins, cook.coins + ui.clinic.state.coins);
  assert.deepEqual(w.from, { cook: cook.coins, clinic: ui.clinic.state.coins });
  assert.deepEqual(w.owned, cook.owned);
  // word progress: every Cook word, at Cook's own stage
  const words = Save.get("words");
  assert.deepEqual(Object.keys(words).sort(), Object.keys(cook.words).sort());
  Object.entries(cook.words).forEach(([id, cw]) => {
    assert.equal(words[id].understand_stage, cookStageOf(cw), id);
    assert.equal(words[id].right, cw.right);
    assert.equal(words[id].seen, cw.seen);
  });
  assert.ok(r.migrated[`schema2:${pid}`], "the migration is recorded");
  // a second visit doesn't migrate again
  const again = createSave({});
  again.use(s);
  again.init();
  assert.deepEqual(again.get("wallet"), w);
});

test("pre-shell keys (Cook, the clinic's UI fallback, the bowl quilt) go 0 -> 1 -> 2 in one visit", () => {
  const Save = createSave({});
  const s = device(Save, { "njg-cook-v1": OLD_COOK, "njg-shared-ui-fallback-v1": OLD_UI, njg_quilt_v1: [{ fruit: "keri" }] });
  const r = Save.init();
  assert.equal(r.schema, SCHEMA);
  assert.equal(Save.players().length, 1);
  assert.deepEqual(Save.get("cook"), OLD_COOK);
  assert.deepEqual(Save.get("ui"), OLD_UI);
  assert.deepEqual(Save.get("bowl"), [{ fruit: "keri" }], "the quilt comes along, untouched");
  assert.equal(Save.get("wallet").coins, 37 + 9);
  assert.deepEqual(Save.get("wallet").owned, ["helper"]);
  assert.equal(Save.get("words")["cook-chai"].understand_stage, 3, "4 right = Cook's stage 3");
  assert.ok(s.getItem("njg-cook-v1") && s.getItem("njg_quilt_v1"), "old keys stay");
});

test("a save with nothing to merge gets no wallet or words namespace (they start when first used)", () => {
  const Save = createSave({});
  device(Save, { "njg-save": { schema: 1, current: "pa", players: [{ id: "pa", name: "A" }], migrated: {} }, "njg-save:pa:shell": { firstDone: true } });
  Save.init();
  assert.equal(Save.has("wallet"), false);
  assert.equal(Save.has("words"), false);
  assert.equal(Save.flag("firstDone"), true);
});

test("two players: each keeps their own purse and words", () => {
  const Save = createSave({});
  device(Save, {
    "njg-save": { schema: 1, current: "pa", players: [{ id: "pa", name: "A" }, { id: "pb", name: "B" }], migrated: {} },
    "njg-save:pa:cook": { coins: 5, words: { "cook-chai": { seen: 1, right: 1, miss: 0, streakMiss: 0 } } },
    "njg-save:pb:ui": { clinic: { state: { coins: 7 } } },
  });
  Save.init();
  assert.equal(Save.get("wallet", "pa").coins, 5);
  assert.equal(Save.get("wallet", "pb").coins, 7);
  assert.equal(Save.has("words", "pb"), false);
});

test("the wallet keeps up with a page still on old code (coins added to the old purses after the migration)", () => {
  const Save = createSave({});
  device(Save, live.afterClinic);
  Save.init();
  const W = createWallet({ save: Save, economy });
  const start = W.coins();
  // the classic clinic pays a patient; the classic Cook pays an order and charges the old wage
  Save.update("ui", (u) => ((u.clinic.state.coins += 2), u));
  Save.update("cook", (c) => ((c.coins += 9), c));
  assert.equal(W.coins(), start + 11);
  Save.update("cook", (c) => ((c.coins -= 5), c)); // the old daily wage: never taken from the one purse (E29)
  assert.equal(W.coins(), start + 11);
  Save.update("cook", (c) => ((c.coins += 3), c));
  assert.equal(W.coins(), start + 14, "only increases since the last merge count");
});

test("the root survives being lost: rebuilt from the players' keys, then schema 2", () => {
  const Save = createSave({});
  const keys = Object.assign({}, live.afterClinic);
  delete keys["njg-save"];
  device(Save, keys);
  const r = Save.init();
  assert.equal(r.schema, 2);
  assert.ok(r.recovered);
  assert.ok(Save.get("wallet").coins > 0);
});

test("export at schema 2, import of a schema-1 file migrates its players", () => {
  const A = createSave({});
  device(A, live.afterClinic);
  A.init();
  const out = JSON.parse(A.exportJSON());
  assert.equal(out.schema, 2);
  // a schema-1 file (as the classic save exports it)
  const pid = A.currentId();
  const file = { format: "nani-jo-ghar-save", schema: 1, root: { current: pid, players: [{ id: pid, name: "Zayn" }] }, data: { [pid]: { cook: JSON.parse(live.afterClinic[`njg-save:${pid}:cook`]), ui: JSON.parse(live.afterClinic[`njg-save:${pid}:ui`]) } } };
  const B = createSave({});
  device(B, {});
  B.init();
  B.importJSON(JSON.stringify(file));
  assert.equal(B.get("wallet", pid).coins, 48 + 3);
  assert.ok(Object.keys(B.get("words", pid)).length > 0);
  assert.throws(() => B.importJSON(JSON.stringify(Object.assign({}, file, { schema: 3 }))), /newer version/);
});

test("today's API: players, namespaces, flags, settings, blocked storage", () => {
  const Save = createSave({});
  device(Save, {});
  Save.init();
  assert.equal(Save.players().length, 0);
  const p = Save.ensurePlayer();
  assert.equal(p.name, "Player 1");
  const q = Save.addPlayer({ name: "Maryam" });
  assert.equal(Save.currentId(), q.id);
  Save.set("cook", { coins: 1 });
  Save.setFlag("firstDone", true);
  Save.select(p.id);
  assert.deepEqual(Save.get("cook"), {});
  assert.equal(Save.get("cook", q.id).coins, 1);
  assert.equal(Save.flag("firstDone"), undefined);
  Save.setSetting("storyHelp", true);
  assert.equal(Save.setting("storyHelp"), true);
  assert.deepEqual(Save.namespaces(q.id).sort(), ["cook", "shell"]);
  Save.removePlayer(q.id);
  assert.equal(Save.players().length, 1);
  // blocked storage: memory only
  const B = createSave({ get localStorage() { throw new Error("blocked"); } });
  B.init();
  B.ensurePlayer();
  B.set("x", { a: 1 });
  assert.equal(B.persistent(), false);
  assert.deepEqual(B.get("x"), { a: 1 });
});

test("language and content versions live in the root", () => {
  const Save = createSave({});
  device(Save, {});
  assert.equal(Save.lang(), "kutchi");
  Save.setLang("gujarati");
  assert.equal(Save.lang(), "gujarati");
  assert.equal(Save.contentVersion("arc", "birthday"), null);
  Save.noteContent("arc", "birthday", 2);
  assert.equal(Save.contentVersion("arc", "birthday"), 2);
});

test("the classic js/shared/save.js reads a schema-2 save without changing it (pages not yet moved keep working)", () => {
  const Save = createSave({});
  const s = device(Save, live.afterClinic);
  Save.init();
  const before = snapshot(s);
  globalThis.self = globalThis;
  const Classic = require("../../js/shared/save.js");
  Classic.use(s);
  const r = Classic.init();
  assert.equal(r.schema, 2, "the classic save leaves the schema alone");
  assert.deepEqual(snapshot(s), before, "nothing rewritten by opening the classic save");
  assert.deepEqual(Classic.get("wallet"), Save.get("wallet"));
  assert.deepEqual(Classic.get("cook"), Save.get("cook"));
  // the classic save writing the root keeps the schema-2 fields
  Classic.setSetting("storyHelp", true);
  const root = JSON.parse(s.getItem("njg-save"));
  assert.equal(root.schema, 2);
  assert.equal(root.lang, "kutchi");
  Classic.use(null);
});

test("progress over the migrated save: Cook's words, then new evidence", () => {
  const Save = createSave({});
  device(Save, live.afterClinic);
  Save.init();
  const P = createProgress({ save: Save, data: progressData });
  assert.equal(P.stage("cook-chai"), 2);
  for (let i = 0; i < 3; i++) P.heard("cook-chai", { ok: true });
  assert.equal(P.stage("cook-chai"), 3, "1 right from Cook + 3 now = Cook's stage 3");
  assert.equal(P.stage("never-seen"), 1);
});
