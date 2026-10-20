// The evening book's games without a browser (s09-book; js/day/book-games.js, data/day-book.json):
//   - no Kutchi in data/day-book.json: every line is an engine meaning; the ones the engine can't say yet are listed (to record)
//   - every picture it names exists
//   - find it asks for fewer things than it shows (two fewer), only today's words, the things dealt to the spots at random
//   - name it and stick in the photo: three choices, the answer among them, an earlier answer never back on a later page
//   - our day: the day's things in the day's order, at most five (three left, two right)
//   - a farm day's lab log gives every game (the door, the ride's finds, the photos)
// node --test build/test_day_book.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createEngine, DATA_FILES } from "../js/core/lang/engine/index.js";
import { planBook, todayThings, fill, bookWords } from "../js/day/book-games.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const J = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const D = J("data/day-book.json");
const lang = {};
for (const f of DATA_FILES) lang[f] = J(`data/lang/${f}.json`);
const E = createEngine({ data: lang, audio: [], path: "test", phrases: false });
const rngOf = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const sayable = (place) => (k) => !!E.check({ fn: "Item", kind: D.places[place].things[k].word }).ok;

test("no Kutchi is written in the book's data: lines are meanings, things are lexicon ids", () => {
  const txt = JSON.stringify(D);
  for (const w of ["bakri", "murgi", "kutro", "kida", "chai khape", "ne poi", "huda", "saware"]) assert.ok(!txt.toLowerCase().includes(`"${w}`) && !txt.toLowerCase().includes(` ${w} `), `"${w}" written in data/day-book.json`);
  for (const [pk, p] of Object.entries(D.places)) {
    if (pk.startsWith("_")) continue;
    for (const [k, t] of Object.entries(p.things)) assert.ok(E.linearizer.lexOf(t.word), `${pk}.${k}: ${t.word} is not in the lexicon`);
  }
});

test("every line the book uses is said by the engine or is a listed gap (the first candidate the engine can say wins)", () => {
  const thing = D.places.farm.things.goat;
  const said = [];
  const gaps = [];
  for (const [k, list] of Object.entries(D.lines)) {
    let ok = false;
    for (const c of list) {
      const m = c.meaning ? fill(c.meaning, thing) : null;
      try {
        const r = c.word ? E.word(c.word) : E.say(m);
        if (r.ok) ok = true;
      } catch (e) {
        /* a candidate the engine can't build: a gap */
      }
      if (ok) break;
    }
    (ok ? said : gaps).push(k);
  }
  assert.ok(said.includes("where") && said.includes("whatsThis") && said.includes("thenOf") && said.includes("found"), `said: ${said}`);
  // the gaps are Mum's to record (build/reports/s09-book.md); the book shows them grey, never invents them
  assert.deepEqual(gaps.sort(), ["goodnight", "greet"].sort());
});

test("every picture the book names exists", () => {
  const paths = [D.art.room, D.art.pages, D.art.face];
  for (const p of Object.values(D.places)) if (p.things) for (const t of Object.values(p.things)) if (t.art) paths.push(t.art);
  for (const p of paths) assert.ok(existsSync(join(ROOT, p)), p);
});

test("find it: fewer asked than shown (by two), only today's words, things dealt to the spots at random", () => {
  const spots = new Map();
  for (let s = 1; s <= 300; s++) {
    const log = D.lab.farm;
    const plan = planBook({ data: D, place: "farm", today: { entries: log.entries, words: log.words }, say: sayable("farm"), rng: rngOf(s) });
    const f = plan.pages.find((p) => p.game === "find");
    assert.ok(f, "a farm book has find it");
    assert.ok(f.asks.length <= f.things.length - 2, `asks ${f.asks.length} of ${f.things.length}`);
    for (const a of f.asks) assert.ok(plan.met.includes(a), `${a} was not met today`);
    const goat = f.things.find((t) => t.key === "goat");
    const k = `${goat.spot.page}${goat.spot.x}`;
    spots.set(k, (spots.get(k) || 0) + 1);
  }
  assert.equal(spots.size, 4, "the goat stands in every spot over the books");
});

test("name it and stick in the photo: three choices with the answer, no earlier answer back", () => {
  for (const day of ["farm", "kitchen"]) {
    const log = D.lab[day];
    const place = D.activityPlace[log.activity];
    for (let s = 1; s <= 200; s++) {
      const plan = planBook({ data: D, place, today: { entries: log.entries, words: log.words }, say: sayable(place), rng: rngOf(s) });
      for (const g of ["nameit", "photo"]) {
        const pages = plan.pages.filter((p) => p.game === g);
        assert.equal(pages.length, 2, `${day}: two ${g} pages`);
        const past = [];
        for (const p of pages) {
          assert.equal(p.choices.length, 3);
          assert.equal(new Set(p.choices).size, 3);
          assert.ok(p.choices.includes(p.answer));
          for (const k of past) assert.ok(!p.choices.includes(k), `${day} ${g}: ${k} came back`);
          past.push(p.answer);
        }
      }
    }
  }
});

test("our day: the day's things in the day's order, at most five; the end's words cover the book", () => {
  const log = D.lab.farm;
  const plan = planBook({ data: D, place: "farm", today: { entries: log.entries, words: log.words }, say: sayable("farm"), rng: rngOf(3) });
  const o = plan.pages.find((p) => p.game === "ourday");
  assert.deepEqual(o.things, ["door", "car", "goat", "hen", "dog"]);
  assert.deepEqual(todayThings(D.places.farm, log), ["door", "car", "goat", "hen", "dog", "bird"]);
  const w = bookWords(plan);
  for (const k of o.things) assert.ok(w.includes(k));
  assert.deepEqual(plan.pages.map((p) => p.game), D.order);
});

test("one game alone (the lab's ?game=): name it and stick in the photo give two pages, the others one", () => {
  for (const g of ["find", "nameit", "photo", "ourday"]) {
    const log = D.lab.farm;
    const plan = planBook({ data: D, place: "farm", today: { entries: log.entries, words: log.words }, say: sayable("farm"), rng: rngOf(5), only: g });
    assert.deepEqual(plan.pages.map((p) => p.game), g === "nameit" || g === "photo" ? [g, g] : [g]);
  }
});
