// contract-16 and the players' names (s08 w6I): a name a grown-up typed on the who's-playing screen ("Maryam", "Zayn")
// is not written English for the child. The hook tags it (lib/contract-hook.mjs playerName: a name element holding one of
// the saved players' typed names); the check lets the tag through. node --test build/sandbox/contract-names.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyse } from "./lib/contract.mjs";
import { playerName, CONTRACT_HOOK } from "./lib/contract-hook.mjs";

const lexicon = new Set(["muke", "chai", "khape"]);
const run = (list) => analyse({ flow: "house", size: "1024x768", t0: 1000, states: [], timeline: [{ type: "c", k: "stage", key: "whos-playing", t: 1000 }, { type: "c", k: "texts", t: 1200, list }] }, { lexicon }).filter((b) => b.check === "contract-16");

test("playerName: only a typed name, only in its own element", () => {
  const typed = ["Maryam", "Zayn"];
  assert.equal(playerName("Maryam", true, typed), true);
  assert.equal(playerName(" zayn ", true, typed), true, "case and spaces do not matter");
  assert.equal(playerName("Maryam", false, typed), false, "the same word outside a name element is still judged");
  assert.equal(playerName("Pour the tea", true, typed), false, "English in a name element is not a name");
  assert.equal(playerName("Player 1", true, []), false, "the app's made-up name is never typed (Save: auto)");
  assert.equal(playerName("", true, typed), false);
});

test("the hook carries playerName and tags the who's-playing names", () => {
  assert.match(CONTRACT_HOOK, /const playerName = function playerName\(text, inNameEl, typed\)/);
  assert.match(CONTRACT_HOOK, /Save\.players\(\)/);
  assert.match(CONTRACT_HOOK, /el\.closest\("\.nm, \[data-player-name\]"\)/);
  assert.doesNotThrow(() => new Function(CONTRACT_HOOK));
});

test("contract-16: the players' typed names pass, other English still breaks", () => {
  assert.equal(run([{ t: "Maryam", name: true, sel: "span.nm" }, { t: "Zayn", name: true, sel: "span.nm" }, { t: "Muke chai khape.", sel: "div" }]).length, 0);
  const b = run([{ t: "Maryam", sel: "span.nm" }, { t: "Add a player", sel: "button" }]);
  assert.equal(b.length, 2, "untagged, a name is judged like any text");
  assert.match(b[0].measured, /"Maryam" \(span\.nm\): maryam/);
});
