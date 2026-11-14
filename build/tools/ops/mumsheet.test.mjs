import { test } from "node:test";
import assert from "node:assert/strict";
import { parseClash, clashRow, plan } from "./mumsheet.mjs";
import { addRow } from "../lang/recording-sheet.mjs";

const CLASH = `# Clash list
## 1. Spelling, gender and form: two sources say different things (3)

1. **yes** (\`phrase.yes\`): the spelling or the word. The engine uses "ha" (hand: grammar-notes prose); the other source says "haa" (data/clinic/lang.json).

### Already settled by a rule or a decision (1)

2. **salt** (\`n.salt\`): the spelling or the word. The engine uses "mitho" (hand); the other source says "loon" (data/content.json). **Settled:** Mum says mitho.

## 2. Two words for one thing (1)

1. **pot** (\`n.pot\`): Two words for the same thing (tapelo / sufuria): which one does the game use?

## 3. Status only: one source says confirmed, another draft (1)

1. **egg** (\`n.egg\`): something for Zafar.
`;

test("the clash list gives Mum only what she can settle (not the settled ones, not Zafar's own calls)", () => {
  const c = parseClash(CLASH);
  assert.deepEqual(c.map((x) => x.en), ["yes", "pot"]);
  assert.deepEqual(c[1].have, ["tapelo", "sufuria"]);
  const r = clashRow(c[0]);
  assert.equal(r.section, "G-CHK");
  assert.equal(r.en, "yes: ha or haa? (which is right for you?)");
  assert.equal(r.kutchi, undefined, "the two spellings are the question, never an answer");
});

test("mumsheet adds rows to the one sheet, never a sheet of its own; the plan is grammar first, open rows only", () => {
  const sheet = { _about: "", updated: "2026-11-14", sections: [{ id: "G-CHK", group: "Grammar", title: "Checks", about: "" }, { id: "CK-CHAI", group: "Cook", title: "Chai", about: "" }], rows: [] };
  addRow(sheet, { section: "CK-CHAI", en: "Put water in the pan.", status: "recorded", date: "2026-11-12", clip: ["a"], source: "x" });
  addRow(sheet, { section: "CK-CHAI", en: "Pour it to the line.", status: "to record", source: "x" });
  for (const c of parseClash(CLASH)) addRow(sheet, clashRow(c));
  for (const c of parseClash(CLASH)) assert.equal(addRow(sheet, clashRow(c)).added, false, "once each");
  const p = plan(sheet, { max: 1 });
  assert.deepEqual(p.map((x) => x.section.id), ["G-CHK", "CK-CHAI"]);
  assert.equal(p[0].rows.length, 1);
  assert.equal(p[0].more, 1);
  assert.deepEqual(p[1].rows.map((r) => r.en), ["Pour it to the line."]);
});
