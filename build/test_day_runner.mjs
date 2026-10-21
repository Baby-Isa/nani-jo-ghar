// The day runner (DAY-01; Zafar, 20 Oct: "built modularly, so it's easy to chop and change the sequence ... swapped in or out
// easily or replicated and changed for a new day"; docs/game-design/modes/a-day-at-nanis.md §1). A day is data/days.json's list of
// stages; js/day/day.js runDay plays it through one stage interface. These tests change ONLY the data (the list) and prove the
// one runner plays every change: swap, add, remove, reorder and copy need no code, and a stage that is not built yet is skipped
// with a note. They also hold the door's geometry to its rules (DOOR-01, DOOR-02): the roofline a third down and the house across
// the width at every test size, Nani's poses at one body height, her pose following her lines.
// node build/test_day_runner.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runDay, dayOf, dayView, withOverrides, stageId } from "../js/day/day.js";
import { houseFit } from "../js/day/sky.js";
import { poseBox, poseFor } from "../js/day/door.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const J = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const DAYS = J("data/days.json");
const DATA = J("data/day.json");
const clone = (x) => JSON.parse(JSON.stringify(x));

// the stage modules as the page has them (door, activity, ride, book built), each recording what it was given: the runner is the
// same in every test; only the day's list changes
function fakeStages(calls, { handoff = [] } = {}) {
  const mod = (id) => ({
    built: true,
    async start(day, log) {
      calls.push({ id, settings: clone(day.stage), weather: day.weather, logLen: log.stages.length });
      if (handoff.includes(id)) return { status: "handoff", url: `${id}.html` };
      return { status: "done", result: { id } };
    },
  });
  return { door: mod("door"), activity: mod("activity"), ride: mod("ride"), book: mod("book") };
}
const play = async (day, opts = {}) => {
  const calls = [];
  const notes = [];
  const log = await runDay(day, { stages: fakeStages(calls, opts), note: (m) => notes.push(m), from: opts.from || 0, only: !!opts.only, view: (d, s) => dayView(d, DATA, s) });
  return { calls, notes, log, order: log.stages.map((s) => `${s.stage}:${s.status}`) };
};

test("data/days.json: every day is a list of known stages whose settings name real data", () => {
  const known = Object.keys(DAYS.stages).filter((k) => !k.startsWith("_"));
  assert.ok(DAYS.days.length >= 5, "the five days moved in");
  for (const d of DAYS.days) {
    assert.ok(Array.isArray(d.stages) && d.stages.length, `day ${d.id}: a stage list`);
    for (const s of d.stages) {
      assert.ok(known.includes(stageId(s.stage)), `day ${d.id}: unknown stage ${s.stage}`);
      if (s.stage === "door") {
        assert.ok(DATA.weather[s.weather], `day ${d.id}: door weather ${s.weather}`);
        assert.ok(DATA.activities[s.lines] || DATA.trips[s.lines], `day ${d.id}: door lines ${s.lines}`);
        assert.ok(DAYS.door.skies[s.weather], `day ${d.id}: a sky for ${s.weather}`);
      }
      if (s.stage === "activity") assert.ok(DATA.activities[s.activity] && DATA.activities[s.activity].go, `day ${d.id}: activity ${s.activity}`);
      if (s.stage === "ride") assert.ok(DATA.window.rides[s.road], `day ${d.id}: road ${s.road}`);
    }
    assert.equal(d.stages[0].stage, "door", `day ${d.id} starts at the door`);
    assert.equal(d.stages[d.stages.length - 1].stage, "book", `day ${d.id} ends with the book`);
  }
  // day 2, the farm (the brief's list)
  const farm = DAYS.days.find((d) => d.id === 2).stages.map((s) => s.game || (s.stage === "stall" ? `${s.stall} stall` : s.stage));
  assert.deepEqual(farm, ["door", "pack", "ride", "meet", "feed", "eggs", "snap", "corn stall", "animals-home", "home", "book"]);
});

test("a day plays its list in order through the one interface, each stage's result in the day log", async () => {
  const { calls, order, log } = await play(dayOf(DAYS, 4));
  assert.deepEqual(calls.map((c) => c.id), ["door", "ride", "book"]);
  assert.deepEqual(order, ["door:done", "ride:done", "book:done"]);
  assert.equal(calls[0].weather, "raining");
  assert.deepEqual(log.stages[1].result, { id: "ride" });
  assert.equal(calls[2].logLen, 3, "the book sees the stages before it in the log");
  assert.ok(log.ended);
});

test("an unbuilt stage is skipped with a note, and the day plays on", async () => {
  const { calls, order, notes } = await play(dayOf(DAYS, 2));
  assert.deepEqual(calls.map((c) => c.id), ["door", "ride", "book"]);
  assert.deepEqual(order, ["door:done", "pack:skipped", "ride:done", "meet:skipped", "game:skipped", "game:skipped", "game:skipped", "stall:skipped", "game:skipped", "home:skipped", "book:done"]);
  assert.equal(notes.length, 8);
  assert.ok(notes.some((n) => /feed/.test(n)) && notes.every((n) => /not built yet/.test(n)));
  // a stage nobody has heard of is skipped the same way
  const odd = dayOf(DAYS, 1);
  odd.stages.splice(1, 0, { stage: "picnic", where: "the park" });
  const r = await play(odd);
  assert.equal(r.order[1], "picnic:skipped");
});

test("swap: change a stage's settings or swap one stage for another, no code", async () => {
  const d = dayOf(DAYS, 2);
  d.stages[0].weather = "night";
  d.stages[2] = { stage: "activity", activity: "clinic" };
  const r = await play(d, { handoff: [] });
  assert.equal(r.calls[0].weather, "night");
  assert.deepEqual(r.calls.map((c) => c.id), ["door", "activity", "book"]);
  assert.equal(r.calls[1].settings.activity, "clinic");
});

test("add, remove and reorder: the list decides", async () => {
  const add = dayOf(DAYS, 1);
  add.stages.splice(2, 0, { stage: "ride", road: "farm-road" });
  assert.deepEqual((await play(add)).calls.map((c) => c.id), ["door", "activity", "ride", "book"]);
  const rm = dayOf(DAYS, 2);
  rm.stages = rm.stages.filter((s) => s.stage !== "pack" && s.stage !== "game");
  assert.deepEqual((await play(rm)).order, ["door:done", "ride:done", "meet:skipped", "stall:skipped", "home:skipped", "book:done"]);
  const re = dayOf(DAYS, 4);
  re.stages = [re.stages[0], re.stages[2], re.stages[1]];
  assert.deepEqual((await play(re)).calls.map((c) => c.id), ["door", "book", "ride"]);
});

test("copy: a new day is a copy of a list, changed, and plays the same way", async () => {
  const days = clone(DAYS);
  const copy = clone(days.days.find((d) => d.id === 4));
  copy.id = 6;
  copy.name = "the farm in the rain";
  copy.stages[0].lines = "farm";
  days.days.push(copy);
  const d = dayOf(days, 6);
  assert.equal(d.name, "the farm in the rain");
  const r = await play(d);
  assert.deepEqual(r.calls.map((c) => c.id), ["door", "ride", "book"]);
  const v = dayView(d, DATA);
  assert.equal(v.trip, "farm");
  assert.equal(v.weather, "raining");
  // the original is untouched
  assert.equal(dayOf(days, 4).stages[0].lines, "shops");
});

test("a hand-off ends the page's run; the day picks up at the next stage", async () => {
  const d = dayOf(DAYS, 1);
  const r = await play(d, { handoff: ["activity"] });
  assert.deepEqual(r.order, ["door:done", "activity:handoff"]);
  assert.equal(r.log.ended, false);
  const back = await play(d, { from: 2 });
  assert.deepEqual(back.order, ["book:done"]);
  // one stage alone (?stage=book)
  assert.deepEqual((await play(dayOf(DAYS, 2), { from: 2, only: true })).order, ["ride:done"]);
});

test("the day view and the lab's overrides", () => {
  const farm = dayView(dayOf(DAYS, 2), DATA);
  assert.equal(farm.activity, "trip");
  assert.equal(farm.trip, "farm");
  const kitchen = dayView(dayOf(DAYS, 1), DATA);
  assert.equal(kitchen.activity, "kitchen");
  assert.equal(kitchen.trip, null);
  const lab = withOverrides(dayOf(DAYS, 1), DATA, { weather: "raining", activity: "trip", trip: "farm" });
  assert.deepEqual(lab.stages.map((s) => s.stage), ["door", "ride", "book"]);
  assert.equal(lab.stages[0].weather, "raining");
  assert.equal(lab.stages[0].lines, "farm");
  const same = withOverrides(dayOf(DAYS, 2), DATA, { weather: "cloudy" });
  assert.equal(same.stages.length, 11, "a weather alone keeps the day's list");
  assert.equal(same.stages[0].weather, "cloudy");
  const clinic = withOverrides(dayOf(DAYS, 1), DATA, { activity: "clinic" });
  assert.deepEqual(clinic.stages.map((s) => s.activity || s.lines || s.stage), ["clinic", "clinic", "book"]);
});

test("the door's house: the roofline a third down and the house across the width at every test size", () => {
  const H = DAYS.door.house;
  assert.ok(existsSync(join(ROOT, H.art)));
  // the play area at each test size (the sidebar takes about a fifth: phone 200-260 px, laptop up to 360, tablet up to 300)
  const sizes = [[800, 360, 200], [844, 390, 200], [1024, 768, 256], [1180, 820, 295], [1280, 800, 243], [1366, 768, 260], [1366, 1024, 300], [1440, 900, 274]];
  for (const [w, h, side] of sizes) {
    const g = houseFit(H, w - side, h);
    const roofY = g.top + H.roofline * g.s;
    assert.ok(Math.abs(roofY - h / 3) < 1, `${w}x${h}: roofline at ${roofY.toFixed(1)}`);
    assert.ok(g.left <= 0.5 && g.left + H.w * g.s >= w - side - 0.5, `${w}x${h}: the house covers the width`);
    assert.ok(g.top + H.h * g.s >= h - 0.5, `${w}x${h}: the house reaches the bottom`);
    // Nani at half the height, her feet at the foot of the steps, her head on screen
    assert.ok(g.foot.y - h * DAYS.door.nani.height > 0, `${w}x${h}: her head on screen`);
    assert.ok(g.foot.y < h, `${w}x${h}: her feet on screen`);
  }
});

test("Nani's poses: one body height, every picture there, her pose following her lines", () => {
  const N = DAYS.door.nani;
  for (const [k, p] of Object.entries(N.poses)) {
    assert.ok(existsSync(join(ROOT, p.art)), `pose ${k}`);
    const b = poseBox(p, 400);
    // the body (head top to feet) is 400 px for every pose
    const k2 = b.h / p.h;
    assert.ok(Math.abs((p.body[1] - p.body[0]) * k2 - 400) < 0.01, `pose ${k}: body ${(p.body[1] - p.body[0]) * k2}`);
    assert.ok(Math.abs(b.top + p.body[1] * k2) < 0.01, `pose ${k}: feet at the point`);
  }
  const P = DAYS.door.poses;
  const all = [P.idle, P.wait, ...P.day, ...Object.values(P.weather).flatMap((w) => Object.values(w))];
  for (const k of all) assert.ok(N.poses[k], `pose ${k} has a picture`);
  assert.equal(poseFor(P, "raining", "weather-sentence"), "umbrella");
  assert.equal(poseFor(P, "sunny", "weather-sentence"), "fan");
  assert.ok(["point-up", "shade-eyes"].includes(poseFor(P, "cloudy", "weather-word")));
  assert.equal(poseFor(P, "sunny", "day", 0), "wave", "wave on 'Come!'");
  assert.equal(poseFor(P, "sunny", "day", 1), "welcome", "welcome on the day's line");
  assert.equal(P.wait, "listen", "listen while she waits for Ha!");
  for (const w of Object.keys(DATA.weather)) assert.ok(DAYS.door.skies[w] && existsSync(join(ROOT, DAYS.door.skies[w].art)), `the ${w} sky`);
});
