// The day builder's days (Sprint 10, s10a-labs; Zafar, 21 Oct): lab/day.html writes day.html?stages=door:sunny,cook:chai-tray:1,clinic:eye:1,book.
// js/day/day.js parseStages reads it into the day's stage list, story.today keeps the list and where the day is (startPatch, donePatches),
// and a page that comes back from a hand-off (Cook, the clinic: ?then=day.html) resumes at the stage after it (customDay). Also the
// hand-off urls, and the end screen's way on (js/shared/host.js thenTarget, thenActions). No browser.
// node build/test_day_stages.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runDay, parseStages, stagesText, customDay, handoffUrl, startPatch, donePatches, dayView } from "../js/day/day.js";
import { thenTarget, thenActions } from "../js/shared/host.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = JSON.parse(readFileSync(join(ROOT, "data/day.json"), "utf8"));
const clone = (x) => JSON.parse(JSON.stringify(x));

test("parse: the builder's own example, in order, with its settings", () => {
  const { stages, notes } = parseStages("door:sunny,cook:chai-tray:1,clinic:eye:1,book", DATA);
  assert.deepEqual(notes, []);
  assert.deepEqual(stages.map((s) => s.stage), ["door", "cook", "clinic", "book"]);
  assert.deepEqual(stages[0], { stage: "door", weather: "sunny", lines: "kitchen" }, "the door follows the first thing the day is about");
  assert.deepEqual(stages[1], { stage: "cook", game: "chai-tray", level: 1 });
  assert.deepEqual(stages[2], { stage: "clinic", game: "eye", level: 1 });
  assert.deepEqual(stages[3], { stage: "book" });
});

test("parse: weather, levels, the full kitchen, a morning, the ride, a game alone", () => {
  const p = (t) => parseStages(t, DATA);
  assert.equal(p("door:raining").stages[0].weather, "raining");
  assert.equal(p("door").stages[0].weather, "sunny", "sunny when no weather is named");
  assert.deepEqual(p("cook").stages[0], { stage: "cook", game: null, level: 1 }, "cook alone is Cook's story round");
  assert.deepEqual(p("cook:full:3").stages[0], { stage: "cook", game: null, level: 3 });
  assert.deepEqual(p("cook:2").stages[0], { stage: "cook", game: null, level: 2 });
  assert.deepEqual(p("clinic:full").stages[0], { stage: "clinic", game: null, level: 1 });
  assert.deepEqual(p("clinic:tooth:4").stages[0], { stage: "clinic", game: "tooth", level: 4 });
  const ride = p("door,ride:shops,book").stages;
  assert.equal(ride[1].trip, "shops");
  assert.equal(ride[1].road, DATA.trips.shops.ride, "the ride's road is the trip's own");
  assert.equal(ride[0].lines, "shops", "a door before a ride tells that trip");
  assert.equal(p("window").stages[0].stage, "ride", "window is the ride");
  assert.deepEqual(p("cook:chai-tray:3").stages, [{ stage: "cook", game: "chai-tray", level: 3 }], "just one game");
  assert.equal(p("door,clinic:eye:2,book").stages[0].lines, "clinic");
});

test("parse: what cannot be read is left out and noted, never crashes", () => {
  const r = parseStages("door:blizzard,dance,cook:chai-tray:9,ride:moon,clinic:Bad Game,,book", DATA);
  assert.deepEqual(r.stages.map((s) => s.stage), ["door", "cook", "book"]);
  assert.equal(r.stages[0].weather, "sunny");
  assert.equal(r.stages[1].level, 1);
  assert.equal(r.notes.length, 5);
  assert.deepEqual(parseStages("", DATA).stages, []);
  assert.deepEqual(parseStages(null, DATA).stages, []);
});

test("stagesText is the inverse of parseStages", () => {
  for (const t of ["door:sunny,cook:chai-tray:1,clinic:eye:1,book", "door:night,clinic:full,book", "cook:full:2", "door:cloudy,ride:shops,book", "cook:daar:4"]) {
    const a = parseStages(t, DATA).stages;
    assert.equal(stagesText(a), t, t);
    assert.deepEqual(parseStages(stagesText(a), DATA).stages, a);
  }
});

test("hand-off: Cook and the clinic go to the host's page with ?then=day.html", () => {
  assert.equal(handoffUrl({ stage: "cook", game: "chai-tray", level: 1 }), "lab.html?mode=cook&game=chai-tray&level=1&then=day.html");
  assert.equal(handoffUrl({ stage: "cook", game: null, level: 2 }), "lab.html?mode=cook&level=2&then=day.html");
  assert.equal(handoffUrl({ stage: "clinic", game: "eye", level: 1 }), "clinic.html?stage=heal&game=eye&level=1&then=day.html");
  assert.equal(handoffUrl({ stage: "clinic", game: "pharmacy", level: 2 }), "clinic.html?stage=pharmacy&level=2&then=day.html");
  assert.equal(handoffUrl({ stage: "clinic", game: null, level: 1 }), "clinic.html?then=day.html");
  assert.equal(handoffUrl({ stage: "book" }), null);
  // and the host accepts every one of those as a page that waits
  for (const s of [{ stage: "cook", game: "chai-tray", level: 1 }, { stage: "clinic", game: "eye", level: 1 }]) {
    const then = new URL(handoffUrl(s), "http://x/").searchParams.get("then");
    assert.equal(thenTarget(`?then=${then}`), "day.html");
  }
});

// the page loop in miniature: the stage modules (cook and clinic hand off), story.today kept by startPatch / donePatches, and a second
// page load deciding where to start with customDay
async function loadOnce({ today, asked, order = [] }) {
  const store = { today: clone(today) };
  const isToday = !!(today && today.date === "2026-10-22" && today.at !== "done");
  const cu = customDay({ asked, today, isToday, data: DATA, dayNo: 3 });
  if (!cu.stages) return { cu, store, ran: [] };
  const day = { id: cu.id, name: "custom", stages: clone(cu.stages) };
  const mod = (id, hand) => ({ built: true, async start() { order.push(id); return hand ? { status: "handoff", url: id } : { status: "done" }; } });
  const stages = { door: mod("door"), ride: mod("ride"), book: mod("book"), cook: mod("cook", true), clinic: mod("clinic", true) };
  const set = (p) => (store.today = Object.assign({}, store.today, p));
  const log = await runDay(day, {
    stages, from: cu.from, view: (d, s) => dayView(d, DATA, s),
    onStage: (entry, i) => set(Object.assign(startPatch(day, DATA, i, entry, true), { date: "2026-10-22" })),
    onDone: (entry, i) => donePatches(day, i, entry, true).forEach(set),
  });
  return { cu, store, log, ran: log.stages.map((s) => `${s.stage}:${s.status}`) };
}

test("store and resume: door, Cook hand-off, then the clinic hand-off, then the book, each page load starting where the last one left the day", async () => {
  const asked = "door:sunny,cook:chai-tray:1,clinic:eye:1,book";
  // 1. day.html?stages=…: the door, then Cook hands off
  const a = await loadOnce({ today: {}, asked });
  assert.deepEqual(a.ran, ["door:done", "cook:handoff"]);
  assert.equal(a.store.today.custom, true, "the list is kept");
  assert.equal(a.store.today.stages.length, 4);
  assert.equal(a.store.today.next, 2, "the day is at the stage after the hand-off");
  assert.equal(a.store.today.at, "activity");
  assert.equal(a.store.today.activity, "kitchen");
  // 2. back from Cook: day.html with no ?stages=, resumes at the clinic stage
  const b = await loadOnce({ today: a.store.today });
  assert.equal(b.cu.from, 2);
  assert.deepEqual(b.ran, ["clinic:handoff"]);
  assert.equal(b.store.today.next, 3);
  // 3. back from the clinic: the book, and the day is over
  const c = await loadOnce({ today: b.store.today });
  assert.deepEqual(c.ran, ["book:done"]);
  assert.equal(c.store.today.at, "done", "a day not ended by the book itself is marked over");
  assert.equal(c.store.today.custom, false);
  // 4. a later plain visit is not the builder's day any more
  const d = await loadOnce({ today: c.store.today });
  assert.equal(d.cu.stages, null);
});

test("resume: a hand-off that was the last stage ends the day; a new ?stages= always starts over; another day's list is not resumed", async () => {
  const a = await loadOnce({ today: {}, asked: "cook:chai-tray:1" });
  assert.deepEqual(a.ran, ["cook:handoff"]);
  const back = customDay({ today: a.store.today, isToday: true, data: DATA });
  assert.equal(back.over, true, "nothing is left to play");
  // a fresh ?stages= wins over a list kept from earlier
  const fresh = customDay({ asked: "door,book", today: a.store.today, isToday: true, data: DATA });
  assert.equal(fresh.from, 0);
  assert.equal(fresh.stages.length, 2);
  // yesterday's list is not today's
  assert.equal(customDay({ today: a.store.today, isToday: false, data: DATA }).stages, null);
  // a day that is not the builder's is untouched
  assert.equal(customDay({ today: { date: "x", next: 1, at: "activity" }, isToday: true, data: DATA }).stages, null);
});

test("the day's view reads a builder's list: a cook stage is the kitchen, a clinic stage the clinic, the ride its trip", () => {
  const v = (t) => dayView({ id: 1, stages: parseStages(t, DATA).stages }, DATA);
  assert.equal(v("door,cook:chai-tray:1,book").activity, "kitchen");
  assert.equal(v("door,clinic:eye:1,book").activity, "clinic");
  assert.equal(v("door:night,cook,book").weather, "night");
  const t = v("door,ride:shops,book");
  assert.equal(t.activity, "trip");
  assert.equal(t.trip, "shops");
});

test("?then=: the end screen's list becomes Next; where Next exists the list goes; a bad page is refused", () => {
  assert.equal(thenTarget("?mode=cook&then=day.html"), "day.html");
  assert.equal(thenTarget("?then=https://evil.example/x"), null);
  assert.equal(thenTarget("?then=//evil.example"), null);
  assert.equal(thenTarget("?then=javascript:alert(1)"), null);
  assert.equal(thenTarget("?then=../x.html"), null);
  assert.equal(thenTarget(""), null);
  assert.equal(thenTarget("?then=cook.html%3Fapp%3D1%26first%3Dchai%26then%3Dlabs.html"), "cook.html?app=1&first=chai&then=labs.html");
  const lab = [{ id: "again", label: "Again", icon: "again" }, { id: "list", label: "All games", icon: "grid", primary: true }];
  const w = thenActions(lab, "day.html");
  assert.deepEqual(w.map((a) => a.id), ["again", "list"], "the same ids: the lab's selectors hold");
  assert.equal(w[1].label, "Next");
  assert.equal(w[1].icon, "next");
  assert.equal(w[1].primary, true);
  assert.deepEqual(thenActions(lab, null), lab, "no page waiting: unchanged");
  const morning = [{ id: "again" }, { id: "next", primary: true }, { id: "list" }];
  assert.deepEqual(thenActions(morning, "day.html").map((a) => a.id), ["again", "next"]);
  assert.equal(thenActions(null, "day.html"), null);
});
