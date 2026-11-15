// Decision 42 (Zafar, 15 Nov): the lines it changed, through Cook's bridge (js/cook/words.js) on the real engine data.
//   node --test build/core/decision42-lines.test.mjs
// (1) chop's call is one sentence joined by a comma ("Kali hakro tameto, ne hakro bataato."), its read-along parts cut from
//     that sentence, rebuilt whole when a number is hidden (L3+); (2) maani's want is khapeti at any count; (3) samosa's fill line
//     is the engine's "Bhar, chunde sathe."; (5) sekelo's English is barbecue.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createEngine } from "../../js/core/lang/engine/index.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const J = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const data = {};
for (const f of ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"]) data[f] = J(`data/lang/${f}.json`);
const win = { Cook: { data: J("data/cook.json"), langEngine: createEngine({ data, audio: J("data/family-audio.json") }), speed: 1 } };
win.window = win;
vm.createContext(win);
vm.runInContext(readFileSync(join(ROOT, "js/cook/words.js"), "utf8"), win, { filename: "js/cook/words.js" });
const C = win.Cook;
const L = C.Lang;
const t = (l) => L.plain(l);

test("(1) chop's call: one sentence with a comma, its parts cut from it, one mark", () => {
  const one = L.clauses([L.line("only", L.phrase([1, "veg-03"])), L.line("and", L.phrase([2, "veg-02"]))]);
  assert.equal(t(one), "Kali hakro tameto, ne ba dungri.");
  assert.deepEqual([...one.parts].map(t), ["Kali hakro tameto,", "ne ba dungri."]);
  assert.equal(one.en, "Only one tomato, and two onions.");
  // a "no" thing stays its own sentence after it (DAAR-36)
  const withNo = L.join([...one.parts, L.line("no", L.phrase(["veg-13"]))]);
  assert.equal(t(withNo), "Kali hakro tameto, ne ba dungri. Lasan na.");
  assert.equal(withNo.en, "Only one tomato, and two onions. No garlic.");
  // L3+: the number hidden, the sentence built again whole (LNG-03), never a part as its own sentence
  assert.equal(t(L.uncounted(withNo)), "Kali tameto, ne dungri. Lasan na.");
  assert.equal(t(L.uncounted(one.parts[1])), "ne dungri.");
  // a single line is itself
  const solo = L.line("only", L.phrase([2, "veg-02"]));
  assert.equal(L.clauses([solo]), solo);
});

test("(2) maani's want is khapeti at any count, bajr ji maani too; other she-words keep khapanti", () => {
  assert.equal(t(L.line("need", L.phrase(["cook-maani"]))), "Muke maani khapeti.");
  assert.equal(t(L.line("need", L.phrase([4, "cook-maani"]))), "Muke char maani khapeti.");
  assert.equal(t(L.line("need", L.phrase([2, "cook-bajrmaani"]))), "Muke ba bajr ji maani khapeti.");
  assert.equal(t(L.line("need", L.phrase([2, "veg-02"]))), "Muke ba dungri khapanti.");
  assert.equal(t(L.line("need", L.phrase([2, "ph-samosa"]))), "Muke ba samosa khapanta.");
});

test("(3) samosa's fill line: the engine's fill and its with, one sentence", () => {
  const fill = (id) => L.clauses([L.line("guide-fill"), L.say({ fn: "With", x: L.phrase([id]).m })]);
  assert.equal(t(fill("ph-keema")), "Bhar, chunde sathe.");
  assert.equal(t(fill("veg-01")), "Bhar, bataate sathe.");
  assert.ok(fill("ph-keema").ok, "every word is the engine's (no gap)");
  assert.equal(fill("ph-keema").en, "Fill, with mince.");
});

test("(5) sekelo's English is barbecue", () => {
  assert.equal(C.english("ph-sekelo"), "barbecue");
  assert.equal(C.display("ph-sekelo"), "sekelo");
});
