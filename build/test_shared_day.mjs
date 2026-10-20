// A day at Nani's (js/day/, data/day.json; Sprint 9 s09-frame): the data's rules without a browser.
//   - no Kutchi is written in data/day.json: every line is an engine meaning (non-negotiables 4 and 11), and the engine either
//     says it or reports it (the grey to-record English)
//   - the weather: only the sunny sky casts sun-shadows, only the rain falls, only the night has stars (Zafar, 19 Oct)
//   - every picture the data names exists (the agreed art drops in by changing these paths)
//   - the book's pages come from the day log and the words met today: engine words, once each, never a round's game name
// node --test build/test_shared_day.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createEngine, DATA_FILES } from "../js/core/lang/engine/index.js";
import { todaysWords } from "../js/day/book.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const J = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const day = J("data/day.json");
const data = {};
for (const f of DATA_FILES) data[f] = J(`data/lang/${f}.json`);
const E = createEngine({ data, audio: [], path: "test", phrases: false });

const lines = () => {
  const out = [];
  for (const w of Object.values(day.weather)) for (const k of ["word", "sentence"]) if (w[k]) out.push(w[k]);
  for (const a of Object.values(day.activities)) (a.lines || []).forEach((l) => out.push(l));
  for (const t of Object.values(day.trips)) (t.lines || []).forEach((l) => out.push(l));
  out.push(day.door.yes, day.book.goodnight, day.book.tomorrow);
  for (const r of Object.values(day.window.rides)) out.push(r.stopCar, r.headline);
  return out.filter(Boolean);
};

test("no Kutchi written in the data: every line is a meaning with its English", () => {
  for (const l of lines()) {
    assert.ok(l.meaning && l.meaning.fn, `a line without a meaning: ${JSON.stringify(l)}`);
    assert.ok(l.en, `a line without its English: ${JSON.stringify(l)}`);
    assert.ok(!("kutchi" in l) && !("k" in l) && !("text" in l), `a hand-written line: ${JSON.stringify(l)}`);
  }
});

test("the engine says every line or reports exactly what it can't (never a silent guess)", () => {
  for (const l of lines()) {
    const r = E.say(l.meaning);
    if (!r.ok) assert.ok(r.gaps.some((g) => ["lexeme", "form", "rule"].includes(g.kind)), `${l.en}: not ok and no gap`);
  }
  // the ones it can say today (checked by hand against the lexicon: confirmed or draft entries)
  for (const en of ["Come!", "Will you help me cook?", "Yes!", "Look!"]) {
    const l = lines().find((x) => x.en === en);
    assert.ok(l && E.say(l.meaning).ok, `${en} should be the engine's`);
  }
});

test("the weather: sun-shadows only in the sun, rain only when raining, stars only at night", () => {
  for (const [k, w] of Object.entries(day.weather)) {
    assert.ok(w.sky && (w.sky.art || (w.sky.stops && w.sky.stops.length >= 2)), `${k}: a sky`);
    assert.equal(!!w.shadow, k === "sunny", `${k}: shadow`);
    assert.equal(!!w.rain, k === "raining", `${k}: rain`);
    assert.equal(!!w.stars, k === "night", `${k}: stars`);
  }
  for (const d of day.days) {
    assert.ok(day.weather[d.weather], `day ${d.id}: weather`);
    assert.ok(day.activities[d.activity], `day ${d.id}: activity`);
    if (d.activity === "trip") assert.ok(day.trips[d.trip], `day ${d.id}: trip`);
  }
});

test("every picture the data names exists", () => {
  const arts = [];
  const walk = (x) => {
    if (!x || typeof x !== "object") return;
    for (const [k, v] of Object.entries(x)) {
      if ((k === "art" || k === "nani" || k === "naniFace") && typeof v === "string") arts.push(v);
      else if (k === "own" && v && typeof v === "object") arts.push(...Object.values(v));
      else walk(v);
    }
  };
  walk(day);
  assert.ok(arts.length >= 6);
  for (const a of arts) assert.ok(existsSync(join(ROOT, a)), `missing picture ${a}`);
});

test("the book's pages: the day log's words then the words met today, engine ids once each, no rounds", () => {
  const lexOf = (id) => E.linearizer.lexOf(id);
  const k = day.book.lab.kitchen;
  const p = todaysWords({ entries: k.entries, met: k.words, lexOf, max: 8 });
  const ids = p.map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length, "each word once");
  assert.ok(!ids.includes("chai-tray"), "a round's game is not a word");
  assert.ok(ids.includes("n.tea") && ids.includes("pn.nana"), JSON.stringify(ids));
  assert.equal(ids[0], "n.tea", "in the order they happened");
  assert.ok(todaysWords({ entries: [], met: [], lexOf }).length === 0);
  assert.ok(todaysWords({ entries: k.entries, met: k.words, lexOf, max: 2 }).length === 2);
});
