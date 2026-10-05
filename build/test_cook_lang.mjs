// Cook's words, in Node (node --test build/test_cook_lang.mjs), on the language engine since step 4d (js/cook/words.js):
//  - decision 21: a form agreeing with a noun of unconfirmed gender (khun, dungri ...) is the he-form, marked check (the
//    noun's id); a confirmed noun's form is never marked; the flag shows on the test site only;
//  - every order line, card row and word Cook can say builds (every recipe, levels 1-4, every customer), and English
//    shows only where the engine reports a gap (rule G9), never a Cook id.
import test from "node:test";
import assert from "node:assert/strict";
import { loadCookEngine, allOrderLines } from "./test_cook_harness.mjs";

test("decision 21: a guessed gender form is marked to check, a known one never", async () => {
  const { Cook, engine } = await loadCookEngine();
  const L = Cook.Lang;
  const lx = engine.linearizer;
  const ids = Cook.items().filter((id) => lx.lexOf(id) && lx.lexOf(id).pos === "N");
  const unknown = ids.filter((id) => !L.gender(id));
  const known = ids.filter((id) => L.gender(id));
  assert.ok(unknown.includes("cook-khun") && known.length > 0);
  const one = (id) => L.phrase([1, id]).segs.find((s) => s.w === Cook.numId(1));
  assert.equal(one("cook-khun").check, "cook-khun");
  assert.equal(one("cook-khun").t, engine.word("num.1", "he").text, "the he-form (Mum's rule)");
  for (const id of known) assert.equal(one(id).check, undefined, id);
  // a number with no forms ("ba") is never marked
  assert.equal(L.phrase([2, "cook-khun"]).segs.find((s) => s.w === Cook.numId(2)).check, undefined);
  assert.equal(L.flagGuesses(), true);
  assert.match(L.html(L.phrase([1, "cook-khun"])), /class="word to-check" title="To check/);
});

test("every order line, row and word builds from the engine; English only at the engine's gaps", async () => {
  const { Cook } = await loadCookEngine({ seed: 3 });
  const L = Cook.Lang;
  const lines = allOrderLines(Cook);
  Cook.items().forEach((id) => L.known(id) && lines.push({ kind: "word", line: L.wordLine(id) }));
  assert.ok(lines.length > 400, `${lines.length} lines`);
  const ids = /\b(?:cook|veg|spi|fru|ph|num|lnk)-[a-z0-9]+\b/;
  for (const { line, recipe, level } of lines) {
    const text = L.plain(line);
    assert.ok(!ids.test(text), `${recipe} L${level}: an id shows: ${text}`);
    const parts = line.parts || [line];
    // an English segment is the engine's placeholder for a gap it reported (or the pantry's to-record headline)
    for (const p of parts) if (p.segs && p.segs.some((s) => s.lang === "e") && p.r) assert.ok(p.r.gaps.some((g) => g.kind !== "audio" && g.kind !== "feature"), `${text}: English without a gap`);
  }
});
