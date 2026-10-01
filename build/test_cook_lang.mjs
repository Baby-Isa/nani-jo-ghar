// R4: Cook's words, in Node (node --test build/test_cook_lang.mjs): decision 21's "to check" mark and the review forms.
//  - a form agreeing with a noun of unconfirmed gender (khun, dungri ...) is the he-form, marked check (the noun's id);
//  - a confirmed noun's form is never marked; the text of every line is unchanged (R2's seam test proves it word for word).
import test from "node:test";
import assert from "node:assert/strict";
import { loadCook } from "./core/cook-harness.mjs";

test("decision 21: a guessed gender form is marked to check, a known one never", async () => {
  const { Cook } = await loadCook();
  const L = Cook.Lang;
  const W = Cook.data.words;
  const unknown = Object.keys(W).filter((id) => W[id].gender === "unknown");
  const known = Object.keys(W).filter((id) => W[id].gender === "she" || W[id].gender === "he");
  assert.ok(unknown.includes("cook-khun") && known.length > 0);
  const one = (id) => L.phrase([1, id]).segs.find((s) => s.w === Cook.numId(1));
  assert.equal(one("cook-khun").check, "cook-khun");
  assert.equal(one("cook-khun").t, Cook.display(Cook.numId(1)), "the he-form (the word's own spelling)");
  for (const id of known) assert.equal(one(id).check, undefined, id);
  // a number with no forms ("ba") is never marked
  assert.equal(L.phrase([2, "cook-khun"]).segs.find((s) => s.w === Cook.numId(2)).check, undefined);
  // the flag shows on the test site only
  assert.equal(L.flagGuesses(), true);
  assert.match(L.html(L.phrase([1, "cook-khun"])), /class="word to-check" title="To check/);
});
