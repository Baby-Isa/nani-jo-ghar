// S13-V task 5: one save module. Every live page (index, first, labs, day, Cook, the clinic, lab) and build/host/helpers.mjs now
// load js/core/save.js; the classic js/shared/save.js stays only for the parked games' pages. A save written by today's code (the
// classic save the house, first launch and labs wrote until now, with every key: progress, words, coins, settings, the shell's
// flags, the character, the story, the clinic, and the labs' New player keys) is read by the one save and everything is found,
// with no storage key changed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createSave } from "../../js/core/save.js";

const require = createRequire(import.meta.url);
const ROOT = new URL("../../", import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), "utf8");

// today's code, writing a whole save (the classic module, as index.html, first.html and labs.html loaded it)
function todaysSave() {
  delete require.cache[require.resolve("../../js/shared/save.js")];
  const Classic = require("../../js/shared/save.js");
  const store = Classic.memoryStore();
  Classic.use(store);
  Classic.init();
  const me = Classic.addPlayer({ name: "Hannah", colour: "#c33" });
  Classic.set("character", { skin: 2, hair: "long", top: "kurta" });
  Classic.setFlag("firstDone", true);
  // Cook's progress: coins, days, stars, the words it has taught
  Classic.set("cook", { v: 1, coins: 42, day: 4, best: { 1: 3, 2: 2 }, owned: ["helper"], taught: { chai: true }, words: { "cook-chai": { seen: 6, right: 5, miss: 1, streakMiss: 0 } } });
  // the word stages (core/progress)
  Classic.set("words", { "n.tea": { understand_stage: 4, say_stage: 2 }, "n.milk": { understand_stage: 2 } });
  Classic.set("ui", { bests: { "cook:fetch:1": 41000 }, onboarded: { "cook:fetch": true }, clinic: { state: { session: 3, coins: 7, album: ["knee"] } } });
  Classic.set("story", { log: [{ day: 1, arc: "eid" }] });
  Classic.set("conversations", { met: { nani: 3 } });
  Classic.setSetting("storyHelp", "k");
  Classic.setSetting("sound", false);
  const other = Classic.addPlayer({ name: "New player" });
  Classic.select(me.id);
  // the labs' New player toggle (localStorage beside the save, never in it)
  store.setItem("njg-labs-new-player", "1");
  store.setItem("njg-labs-own-player", me.id);
  store.setItem("njg-labs-new-player-id", other.id);
  const keys = {};
  for (let i = 0; i < store.length; i++) keys[store.key(i)] = store.getItem(store.key(i));
  return { keys, me, other };
}

test("a save written by today's code: the one save finds every key (progress, words, coins, settings, newPlayer) and changes none", () => {
  const { keys, me, other } = todaysSave();
  const Save = createSave({});
  const s = Save.memoryStore();
  Object.entries(keys).forEach(([k, v]) => s.setItem(k, v));
  Save.use(s);
  const r = Save.init();
  assert.equal(r.current, me.id, "the same player is current");
  assert.deepEqual(Save.players().map((p) => p.name), ["Hannah", "New player"]);
  assert.equal(Save.current().colour, "#c33");
  assert.equal(Save.flag("firstDone"), true, "the house never sends her to first launch again");
  assert.deepEqual(Save.get("character"), { skin: 2, hair: "long", top: "kurta" });
  const cook = Save.get("cook");
  assert.equal(cook.coins, 42);
  assert.equal(cook.day, 4);
  assert.deepEqual(cook.best, { 1: 3, 2: 2 });
  assert.equal(Save.get("words")["n.tea"].understand_stage, 4, "word progress kept");
  assert.equal(Save.get("words")["n.milk"].understand_stage, 2);
  assert.equal(Save.get("ui").clinic.state.session, 3);
  assert.equal(Save.get("ui").bests["cook:fetch:1"], 41000);
  assert.deepEqual(Save.get("story"), { log: [{ day: 1, arc: "eid" }] });
  assert.deepEqual(Save.get("conversations"), { met: { nani: 3 } });
  assert.equal(Save.setting("storyHelp"), "k");
  assert.equal(Save.setting("sound"), false);
  // coins: one purse holding Cook's and the clinic's (the 1 -> 2 step), the old keys untouched
  assert.equal(Save.get("wallet").coins, 42 + 7);
  // the labs' New player keys and every namespace key are byte for byte what today's code wrote
  for (const [k, v] of Object.entries(keys)) if (k !== "njg-save") assert.equal(s.getItem(k), v, `${k} unchanged`);
  assert.equal(s.getItem("njg-labs-new-player-id"), other.id);
  // no key renamed: the root keeps its name, players and current; only the schema and the new fields are added
  const root0 = JSON.parse(keys["njg-save"]), root1 = JSON.parse(s.getItem("njg-save"));
  assert.deepEqual(root1.players, root0.players);
  assert.equal(root1.current, root0.current);
});

test("every live page and the host's helpers load the one save (js/core/save.js); the classic save only on the parked games' pages", () => {
  for (const page of ["index.html", "first.html", "labs.html", "day.html", "cook.html", "clinic.html", "lab.html"]) {
    const html = read(page);
    assert.ok(!/js\/shared\/save\.js/.test(html.replace(/<!--[\s\S]*?-->/g, "")), `${page} loads no classic save`);
    assert.ok(/js\/core\/save\.js/.test(html), `${page} loads js/core/save.js`);
  }
  assert.match(read("build/host/helpers.mjs"), /from "\.\.\/\.\.\/js\/core\/save\.js"/);
  // on a page that defers its classic scripts after the save module, none of them runs before it
  for (const page of ["index.html", "first.html"]) {
    const tags = read(page).match(/<script\b[^>]*>/g).filter((t) => /src=/.test(t));
    const at = tags.findIndex((t) => /js\/core\/save\.js/.test(t));
    tags.slice(at + 1).forEach((t) => assert.ok(/type="module"|\bdefer\b/.test(t), `${page}: ${t} runs after the save`));
  }
});
