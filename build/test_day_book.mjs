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
import { planBook, todayThings, fill, bookWords, sayQueue, voiceFaults, spacedFrom } from "../js/day/book-games.js";

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
  for (const [k, list] of Object.entries(D.lines).filter(([k]) => !k.startsWith("_"))) {
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
  assert.ok(said.includes("where") && said.includes("whatsThis"), `said: ${said}`);
  // the gaps are Mum's to record (build/reports/s09-book.md); the book shows them grey, never invents them
  assert.deepEqual(gaps.sort(), ["found", "goodnight", "greet", "tomorrow"]);
});

test("every picture the book names exists", () => {
  const paths = [D.art.room, D.art.pages, D.art.face];
  for (const p of Object.values(D.places)) if (p.things) for (const t of Object.values(p.things)) if (t.art) paths.push(t.art);
  for (const p of paths) assert.ok(existsSync(join(ROOT, p)), p);
});

test("find it (BOOK-12): rounds of one ask among 3-4 cards, only today's words asked, the asked card in every slot; only the first round has the intro card", () => {
  const slots = new Map();
  for (let s = 1; s <= 300; s++) {
    const log = D.lab.farm;
    const plan = planBook({ data: D, place: "farm", today: { entries: log.entries, words: log.words }, say: sayable("farm"), rng: rngOf(s) });
    const f = plan.pages.find((p) => p.game === "find");
    assert.ok(f, "a farm book has find it");
    assert.equal(f.rounds.length, 2);
    f.rounds.forEach((r, i) => {
      assert.ok(r.cards.length >= 3 && r.cards.length <= 5, `${r.cards.length} cards`);
      assert.equal(new Set(r.cards).size, r.cards.length);
      assert.ok(r.cards.includes(r.ask));
      assert.ok(plan.met.includes(r.ask), `${r.ask} was not met today`);
      assert.equal(r.intro, i === 0);
      slots.set(r.cards.indexOf(r.ask), (slots.get(r.cards.indexOf(r.ask)) || 0) + 1);
    });
  }
  assert.equal(slots.size, 4, "the asked card lands in every slot over the books");
});

test("spaced words (S12 decision 9): a save spanning 8 days brings back what was met 1, 3 and 7 days ago, never 2, 4, 5 or 6", () => {
  // eight days of play, one thing a day (today: day 0); each day's thing is in the day log and in the save's words
  const today = "2026-10-26";
  const dayOf = (n) => new Date(Date.parse(`${today}T12:00:00Z`) - n * 86400000).toISOString().slice(0, 10);
  const byDay = { 0: "goat", 1: "maani", 2: "milk", 3: "sugar", 4: "hen", 5: "dog", 6: "bird", 7: "chai" };
  const days = Object.entries(byDay).map(([n, k]) => ({ date: dayOf(Number(n)), entries: [{ type: "saw", what: D.places.farm.things[k] ? D.places.farm.things[k].word : D.places.kitchen.things[k].word }] }));
  const words = {};
  for (const [n, k] of Object.entries(byDay)) {
    const t = D.places.farm.things[k] || D.places.kitchen.things[k];
    words[t.word] = { last: Date.parse(`${dayOf(Number(n))}T12:00:00Z`), understand_stage: 1, seen: 1 };
  }
  const history = spacedFrom({ today, days, words });
  const sayAll = (k) => !!(D.places.farm.things[k] || D.places.kitchen.things[k]);
  const plan = planBook({ data: D, place: "farm", today: { entries: days[0].entries, words: [] }, history, say: sayAll, rng: rngOf(1) });
  assert.deepEqual(plan.met, ["goat"]);
  assert.deepEqual([...plan.back].sort(), ["chai", "maani", "sugar"].sort(), "1, 3 and 7 days ago come back");
  for (const k of ["milk", "hen", "dog", "bird"]) assert.ok(!plan.back.includes(k), `${k} (2, 4, 5 or 6 days ago) is not due`);
  assert.ok(plan.things.maani && plan.things.chai, "a spaced word from another place brings its picture");
  // over many books the spaced words are asked in name it, and every name-it answer is today's or spaced
  const asked = new Set();
  for (let s = 1; s <= 200; s++) {
    const p = planBook({ data: D, place: "farm", today: { entries: days[0].entries, words: [] }, history, say: sayAll, rng: rngOf(s) });
    for (const pg of p.pages.filter((x) => x.game === "nameit")) {
      assert.ok(["goat", "chai", "maani", "sugar"].includes(pg.answer), `name it asked ${pg.answer}`);
      asked.add(pg.answer);
    }
    // find it's decoys are words already learned (or today's), before the place's own
    for (const r of p.pages.find((x) => x.game === "find").rounds) for (const k of r.cards) if (k !== r.ask) assert.ok(p.learned.includes(k) || k === "goat", `${k} is not learned`);
  }
  for (const k of ["chai", "maani", "sugar"]) assert.ok(asked.has(k), `${k} was never asked`);
  // the save alone (no day log) gives the same
  const h2 = spacedFrom({ today, days: [], words });
  assert.deepEqual(planBook({ data: D, place: "farm", today: { entries: days[0].entries }, history: h2, say: sayAll, rng: rngOf(2) }).back.sort(), ["chai", "maani", "sugar"].sort());
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

// ---- one line at a time (DAY-02, the judge, 21 Oct: lines said twice, a found line over the question still playing) ----
test("voiceFaults: catches a line said twice within 1 s, two lines at once and a line with no length", () => {
  const judge = [
    { text: "Murgi kida ai?", a: 23560, b: 24060 },
    { text: "There's the chicken!", a: 23680, b: 24170 },
    { text: "kutro", a: 28020, b: 28020 },
    { text: "Then we saw a big chicken.", a: 31430, b: 32260 },
    { text: "Then we saw a big chicken.", a: 31940, b: 32770 },
  ];
  const kinds = voiceFaults(judge).map((f) => f.kind);
  assert.ok(kinds.includes("overlap") && kinds.includes("zero") && kinds.includes("twice"), kinds.join(","));
  assert.deepEqual(voiceFaults([{ text: "a", a: 0, b: 500 }, { text: "b", a: 520, b: 900 }, { text: "a", a: 2000, b: 2400 }]), []);
});

test("sayQueue: each line starts after the last ended; the same line again within 1 s of its end, or while queued, is said once", async () => {
  let clock = 0;
  const said = [];
  const fake = (ln) => {
    const e = { text: ln.text, a: clock };
    said.push(e);
    return new Promise((r) => setTimeout(() => ((clock += 500), (e.b = clock), r()), 5));
  };
  const say = sayQueue(fake, { now: () => clock, gapMs: 1000 });
  const ask = { text: "Murgi kida ai?" };
  const found = { text: "There's the chicken!" };
  const photo = { text: "Then we saw a big chicken." };
  // the question, a tap while it plays (the found line), a photo line said at the page's start and again as it is placed
  await Promise.all([say(ask), say(found), say(photo), say(photo)]);
  assert.deepEqual(said.map((e) => e.text), ["Murgi kida ai?", "There's the chicken!", "Then we saw a big chicken."]);
  assert.deepEqual(voiceFaults(said), []);
  clock += 2000; // a while later the same line is a new event: said again
  await say(photo);
  assert.equal(said.length, 4);
  // red: the same events said at once, without the queue, are faults
  const raw = [ask, found, photo, photo].map((ln, i) => ({ text: ln.text, a: i * 100, b: i * 100 + 500 }));
  assert.ok(voiceFaults(raw).length >= 2);
});
