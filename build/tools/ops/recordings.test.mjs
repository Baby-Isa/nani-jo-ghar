import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib.mjs";
import { parseGapList, interpretGap, usedBy, cookGame, plainCell, needs, sync } from "./recordings.mjs";
import { loadSheet } from "../lang/recording-sheet.mjs";
import "../lang/recording-sheet.test.mjs"; // the generator's own tests run here too (checks.mjs runs build/tools/ops/*.test.mjs)

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

test("the gap list parses into kinds, English, ask ids, how often and the ids that need it", () => {
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
  assert.deepEqual(u.ids, ["cook-paani", "cook-dudh", "cook-khun"]);
});

test("a Cook need goes to its game (the guide's station, the game's files, or its words); several games: every kitchen game", () => {
  assert.equal(cookGame(["cook.guide.thread"], ""), "CK-SEKELO");
  assert.equal(cookGame(["cook.guide.fetch"], ""), "CK-PANTRY");
  assert.equal(cookGame(["cook.guide.thread", "cook.guide.chop"], ""), "CK-ALL");
  assert.equal(cookGame([], "Cook word: turner"), "CK-EGGS");
  assert.equal(cookGame([], "something nobody names"), "CK-ALL");
  assert.equal(plainCell("pres.she.sg"), "now or every day, a she-word, one");
  assert.equal(plainCell("imp.polite"), "telling someone, said politely");
});

test("sync: a need is added once, recorded by a clip with the row's id, closed when the engine drops it; done rows never move back", () => {
  const sheet = { _about: "", updated: "2026-11-14", sections: [{ id: "G-NEG", group: "Grammar", title: "Negation", about: "" }, { id: "G-POL", group: "Grammar", title: "Politeness", about: "" }], rows: [] };
  const list = [
    { key: "gap:cook:lexeme:x", section: "G-NEG", en: "No milk.", status: "to record", source: "gap" },
    { key: "slot:v.boil:imp.polite", section: "G-POL", en: "\"Boil, please.\"", status: "to record", source: "lexicon" },
  ];
  let log = sync(sheet, list, [], "2026-11-14");
  assert.deepEqual(log.added, ["G-NEG-01", "G-POL-01"]);
  log = sync(sheet, list, [], "2026-11-14");
  assert.deepEqual(log.added, [], "a second run adds nothing");
  // Mum says the row's id before the line, so the clip's question id is the row's id
  log = sync(sheet, list, [{ id: "dudh-na", qid: "G-NEG-01", kutchi: "dudh na", english: "no milk", speaker: "mum", file: "x.mp3", source: "sources/audio/mum-2026-12-01/a.m4a" }], "2026-12-01");
  assert.deepEqual(log.recorded, ["G-NEG-01"]);
  assert.equal(sheet.rows[0].status, "recorded");
  assert.equal(sheet.rows[0].date, "2026-12-01");
  assert.equal(sheet.rows[0].who, "Mum");
  // the engine has the polite form now: the grammar slot is answered
  log = sync(sheet, [list[0]], [], "2026-12-02");
  assert.deepEqual(log.closed, ["G-POL-01"]);
  assert.equal(sheet.rows[1].status, "answered");
  assert.equal(sheet.rows[0].status, "recorded", "never moved back");
  // a row another tool keyed (the clash list) is left alone
  sheet.rows.push({ id: "G-NEG-02", section: "G-NEG", en: "yes: ha or haa?", status: "to record", source: "clash", keys: ["clash:phrase.yes:ha haa"] });
  sync(sheet, [list[0]], [], "2026-12-03");
  assert.equal(sheet.rows[2].status, "to record");
});

test("every need the engine has today is on the one sheet (checks.mjs runs recordings.mjs --check)", () => {
  const sheet = loadSheet();
  const keys = new Set(sheet.rows.flatMap((r) => r.keys || []));
  const list = needs();
  assert.ok(list.length > 500);
  const missing = list.filter((n) => !keys.has(n.key) && !sheet.rows.some((r) => r.en.toLowerCase() === n.en.toLowerCase()));
  assert.deepEqual(missing.map((n) => n.key).slice(0, 5), [], "run node build/tools/ops/recordings.mjs");
  const audio = JSON.parse(readFileSync(join(ROOT, "data/family-audio.json"), "utf8"));
  const before = JSON.stringify(sheet);
  const log = sync(sheet, list, audio, "2026-11-14");
  assert.equal(log.added.length, 0);
  assert.ok(JSON.stringify(sheet).length >= before.length - 10);
});
