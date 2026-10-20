import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGapList, interpretGap, usedBy, parseDoctorList, parseKbTable, parseOpenQuestions, buildSheet, SHEET } from "./recordings.mjs";

const GAP = `# Gap list
## Cook

### Sentences and frames the engine cannot say yet (1)

1. Please say these the way you would at home: "I'd like two samosas with mince." Ask: L17, L22.
   - Needed by: cook line "with {x}" (cook.line.with), with cook-dudh.

### Words with no Kutchi yet (English placeholders in the game today) (1)

1. How do you say "turner"? Please say it in a short sentence, e.g. "bring me the turner". Ask: new.
   - Needed by: Cook word "turner" (ph-turner).

### We know the word but have no recording of it (1)

1. Please record: "hakro"
   - Needed by: Cook word "water" (cook-paani); Cook word "milk" (cook-dudh); Cook word "sugar" (cook-khun) … (39 lines).

## The clinic

### Is it a he-word or a she-word? (the engine used the he-form, Mum's rule, and flags it) (1)

1. One foot, two foots. (Or: "I'd like some foot, please", said politely.) Ask: new.
   - Needed by: Clinic word "foot" (body-foot); Clinic word "foot" (body-foot), more than one.

## Recorded but not yet ticked OK

- hakro
- paani
`;

test("the gap list parses into kinds, English, ask ids and how often", () => {
  const g = parseGapList(GAP);
  assert.equal(g.cook.length, 3);
  assert.equal(g.clinic.length, 1);
  assert.equal(g.awaiting, 2);
  const rule = interpretGap(g.cook[0]);
  assert.equal(rule.en, "I'd like two samosas with mince.");
  assert.deepEqual(rule.ask, ["L17", "L22"]);
  assert.equal(interpretGap(g.cook[1]).en, "turner");
  assert.equal(interpretGap(g.cook[2]).spelling, "hakro");
  assert.equal(interpretGap(g.clinic[0]).en, "foot");
  const u = usedBy(g.cook[2].needed);
  assert.equal(u.count, 39, "the '(39 lines)' tail is the count");
  assert.deepEqual(u.where.slice(0, 2), ["Cook: water", "Cook: milk"]);
  assert.equal(usedBy(g.clinic[0].needed).count, 2);
});

test("the doctor's list keeps rows with an empty Kutchi column", () => {
  const d = parseDoctorList(["## A. Said", "### The room", "| ID | English | Kutchi | Where |", "|---|---|---|---|", "| A1 | Who's next? | | the call, every visit |", "| A2 | Bring in the girl. | *chokri* = girl | the call |", "## D. Q", "| D1 | Why? | | x |"].join("\n"));
  assert.equal(d.rows.length, 2);
  assert.equal(d.rows[0].guide, "");
  assert.equal(d.rows[0].where, "the call, every visit");
  assert.equal(d.dCount, 1);
});

test("the grammar table lists only what is open; the README's next-round notes are read", () => {
  const kb = parseKbTable(["| 4 | Articles | Known: none | — | — |", "| 13 | Present tense | Unknown | P2 | C97 |", "| 3 | Oblique | **Known for one thing** (5 Oct) | P2 | Q2 |"].join("\n"));
  assert.deepEqual(kb.map((k) => k.n), [13, 3]);
  assert.deepEqual(parseOpenQuestions("## x\n\n## For the next round\n\n- one\n\n**For the next recording session (Zafar, 20 Oct):** two"), ["one", "For the next recording session (Zafar, 20 Oct): two"]);
});

test("the sheet has the seven sections in order and the ride's candidate line", () => {
  const { text, counts } = buildSheet();
  const heads = [...text.matchAll(/^## (\d)\. (.+)$/gm)].map((m) => `${m[1]} ${m[2]}`);
  assert.deepEqual(heads.map((h) => h.split(" ")[0]), ["1", "2", "3", "4", "5", "6", "7"]);
  assert.match(heads[0], /Grammar first/);
  assert.match(heads[3], /the door/);
  assert.match(heads[4], /the ride/);
  assert.match(heads[5], /evening book/);
  assert.match(text, /cow, tree, flower, bus, bicycle, tractor, camel, horse, sheep, buffalo, boat, sun, moon, star, cloud, road, field, shop/);
  assert.ok(counts.grammar > 0 && counts.cook > 0 && counts.clinic > 0 && counts.door > 0);
  assert.equal(SHEET, "docs/language/recording-sheet.md");
});
