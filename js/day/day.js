/*
 * A day at Nani's (Zafar, 19-20 Oct; docs/game-design/modes/a-day-at-nanis.md §1): the day runner. A day is data: an ordered
 * list of stages in data/days.json, each {stage, ...its settings}; this file plays the list in order through ONE stage
 * interface and writes each stage's result to the day log. A new day is a copy of a list with stages swapped, added, removed or
 * reordered, never code (Zafar, 20 Oct: "built modularly, so it's easy to chop and change the sequence");
 * build/test_day_runner.mjs proves it.
 *
 *   the stage interface   STAGES[id] = {built, start(day, log) -> Promise<done>}; day.stage is this stage's own settings;
 *                         done = {status: "done" | "handoff", result?, url?}: a hand-off (Cook, the clinic) leaves the page, and
 *                         the day picks up at the next stage when day.html is opened again (story.today.next)
 *   the day log           log = {day, date, stages: [{i, stage, settings, status, result?, note?}]} (window.Day.log), and each
 *                         stage's end as a `round` entry in the story log (js/core/log.js; the book reads the rest of it: the
 *                         ride's `saw` lines, Cook's and the clinic's)
 *   not built yet         a stage with no module (pack, meet, the farm games, the corn stall, home) is skipped with a lab note
 *
 *   day.html                the day this child is on, from its start, or from where it stopped today (the book after Cook)
 *   ?day=N                  that day (1-based, data/days.json days)
 *   ?stage=door             the day from its door, played on (labs, tests); ?stage=window|ride|book|activity: that stage alone
 *   ?weather= ?activity=kitchen|clinic|trip ?trip=farm|shops   the lab's overrides (the day's list rebuilt around them)
 *   ?level=1..3  ?seed=N  ?speed=N (test speed)  ?nonav=1 (no hand-off: tests)  ?log=kitchen|clinic|farm (the book with a lab day log)
 *
 * window.Day   {say(line, {who}), plain(line), handoff, stage, log, skipped}: the sound hook (build/sandbox/lib/sound.mjs) wraps Day.say
 * window.njgTest  {state(), expect()}: "day/door", "day/book/...", "day/window/ride", "day/end": what the stage wants next (the flows)
 */
const hasDOM = typeof document !== "undefined" && typeof window !== "undefined";
const q = hasDOM ? new URLSearchParams(location.search) : new URLSearchParams();
const ROOT = hasDOM ? document.documentElement.dataset.root || "" : "";
const SPEED = Number(q.get("speed")) || 1;
const NONAV = q.get("nonav") === "1";
const V = hasDOM && typeof window.njgV === "function" ? window.njgV : (u) => u;

export const todayDate = () => new Date().toISOString().slice(0, 10);

/** mulberry32: the same seed, the same ride */
export function seeded(seed) {
  let a = (Number(seed) || 1) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clone = (x) => JSON.parse(JSON.stringify(x));

// ================================================================ the runner (pure: no page; build/test_day_runner.mjs)

/** A stage id's name in the URL: the ride was "window" in the first build's labs. */
export const stageId = (s) => (s === "window" ? "ride" : s);

/** The day N (1-based, wrapping round the list) of data/days.json, as a fresh copy: {id, name, stages}. */
export function dayOf(days, n) {
  const list = (days && days.days) || [];
  if (!list.length) return { id: 1, name: "", stages: [] };
  const i = (((Number(n) || 1) - 1) % list.length + list.length) % list.length;
  const d = clone(list[i]);
  d.id = Number(n) || d.id || i + 1;
  return d;
}

/**
 * What the older stage code reads from a day (data/day.json's words): its weather, activity (kitchen | clinic | trip), trip and
 * the door's line set, from the list. `stage` is the current stage's settings.
 */
export function dayView(day, data, stage = null) {
  const find = (id) => (day.stages || []).find((s) => s.stage === id);
  const door = find("door") || {};
  const act = find("activity");
  const ride = find("ride");
  const trips = (data && data.trips) || {};
  const lines = door.lines || (act && act.activity) || "kitchen";
  let activity = act ? act.activity : ride ? "trip" : trips[lines] ? "trip" : lines;
  let trip = activity === "trip" ? (trips[lines] ? lines : Object.keys(trips).find((k) => ride && trips[k].ride === ride.road) || Object.keys(trips)[0] || null) : null;
  const book = find("book");
  if (book && book.place && !act && !ride) activity = book.place;
  return { id: day.id, name: day.name || "", weather: door.weather || "sunny", lines, activity, trip, stages: day.stages, stage };
}

/**
 * The lab's overrides (?weather, ?activity, ?trip) on a day's list: the weather goes on every door; another activity or trip
 * rebuilds the list around it (door, the activity or the ride, the book) with the day's own weather.
 */
export function withOverrides(day, data, o = {}) {
  const d = clone(day);
  const door = d.stages.find((s) => s.stage === "door");
  const weather = (o.weather && data.weather && data.weather[o.weather] ? o.weather : null) || (door && door.weather) || "sunny";
  const trips = (data && data.trips) || {};
  const acts = (data && data.activities) || {};
  if (o.activity && acts[o.activity]) {
    if (o.activity === "trip") {
      const v = dayView(d, data);
      const trip = o.trip && trips[o.trip] ? o.trip : v.trip && trips[v.trip] ? v.trip : Object.keys(trips)[0];
      const keep = v.activity === "trip" && v.trip === trip;
      if (!keep) d.stages = [{ stage: "door", weather, lines: trip }, { stage: "ride", road: trips[trip].ride }, { stage: "book" }];
    } else if (!d.stages.some((s) => s.stage === "activity" && s.activity === o.activity)) {
      d.stages = [{ stage: "door", weather, lines: o.activity }, { stage: "activity", activity: o.activity }, { stage: "book" }];
    }
  } else if (o.trip && trips[o.trip]) {
    d.stages.forEach((s) => {
      if (s.stage === "door" && trips[s.lines]) s.lines = o.trip;
      if (s.stage === "ride") s.road = trips[o.trip].ride;
    });
  }
  d.stages.forEach((s) => s.stage === "door" && (s.weather = weather));
  return d;
}

/**
 * Play a day's stages in order from `from`. stages: {id: {built, start(day, log)}}; view(day, settings): the day each stage is
 * given; note(msg, entry): a skipped stage's lab note; onStage(entry, i): before each stage (the page saves where it is).
 * Returns the log. A hand-off ends the run (the page is left); `only`: play the one stage at `from`.
 */
export async function runDay(day, { stages = {}, log = null, from = 0, only = false, view = (d, s) => Object.assign({}, d, { stage: s }), note = () => {}, onStage = () => {}, onDone = () => {} } = {}) {
  const L = log || { day: day.id, date: todayDate(), stages: [] };
  const list = day.stages || [];
  const last = only ? Math.min(list.length, from + 1) : list.length;
  for (let i = from; i < last; i++) {
    const settings = list[i];
    const id = stageId(settings.stage);
    const mod = stages[id];
    const entry = { i, stage: id, settings: clone(settings) };
    L.stages.push(entry);
    if (!mod || !mod.built || typeof mod.start !== "function") {
      entry.status = "skipped";
      entry.note = `${id}${settings.game ? ` (${settings.game})` : settings.stall ? ` (${settings.stall})` : ""}: not built yet`;
      note(entry.note, entry);
      onDone(entry, i);
      continue;
    }
    await onStage(entry, i);
    let done;
    try {
      done = (await mod.start(view(day, settings), L)) || { status: "done" };
    } catch (e) {
      done = { status: "error", error: String((e && e.message) || e) };
    }
    entry.status = done.status || "done";
    if (done.result !== undefined) entry.result = done.result;
    if (done.url) entry.url = done.url;
    if (done.error) entry.error = done.error;
    onDone(entry, i);
    if (entry.status === "handoff" || entry.status === "error") break;
  }
  L.ended = !L.stages.length || !["handoff", "error"].includes(L.stages[L.stages.length - 1].status);
  return L;
}

// ================================================================ the page

function makeApi({ data, days, core, E }) {
  const api = {
    data,
    days,
    core,
    E,
    q,
    speed: SPEED,
    nonav: NONAV,
    rng: seeded(q.get("seed") || 7),
    url: (p) => V(ROOT + p),
    wait: (ms) => new Promise((r) => setTimeout(r, ms / SPEED)),
    esc,
    gaps: [],
  };

  /**
   * A line from a data entry {meaning | word, en}: the engine's sentence, or (when it can't say it) the entry's English as the
   * grey to-record placeholder. -> {result, ok, en, text, key}
   */
  api.line = function (def) {
    if (!def) return null;
    let result = null;
    try {
      result = def.word ? E.word(def.word) : E.say(def.meaning);
    } catch (e) {
      result = null;
    }
    const ok = !!(result && result.ok);
    const en = def.en || (result && result.en) || "";
    if (!ok) api.gaps.push({ en, meaning: def.meaning || def.word, gaps: result ? result.gaps.filter((g) => g.kind !== "audio").map((g) => g.kind + ":" + (g.lex || g.what || "")) : ["engine error"] });
    return { result, ok, en, text: ok ? result.text : en, def };
  };
  /** A thing's word (a lexicon id, or a meaning) as a line */
  api.word = function (say, en) {
    return typeof say === "string" ? api.line({ word: say, en }) : api.line({ meaning: say, en });
  };

  /** The line's markup: its Kutchi (one span per segment, for the read-along) or the grey placeholder; English beneath if asked. */
  api.render = function (ln, { english = false, cls = "" } = {}) {
    const p = document.createElement("div");
    p.className = `day-line ${cls}`;
    if (ln.ok) {
      const k = document.createElement("p");
      k.className = "day-k";
      k.lang = "gu-Latn";
      k.innerHTML = ln.result.segments.map((s, i) => `<span data-seg="${i}"${s.draft ? ' data-draft=""' : ""}>${esc(s.t)}</span>`).join("");
      p.appendChild(k);
    } else {
      const k = document.createElement("p");
      k.className = "day-k to-record";
      k.dataset.rec = "";
      k.lang = "en";
      k.textContent = ln.en;
      p.appendChild(k);
    }
    // rule 5's door exception (Zafar, 19 Oct): the English written beneath Nani's line, at the door only
    if (english && ln.ok) {
      const e = document.createElement("p");
      e.className = "day-en";
      e.lang = "en";
      e.dataset.doorEn = "";
      e.textContent = ln.en;
      p.appendChild(e);
    }
    return p;
  };

  /** Say a line on the one voice queue (js/core/voice.js), the read-along underlining each piece as it is heard. */
  api.sayNow = async function (ln, { el = null, who = "nani", min = true } = {}) {
    if (!ln) return;
    const t0 = Date.now();
    const segs = el ? [...el.querySelectorAll("[data-seg]")] : [];
    if (el) el.classList.add("on");
    let p = Promise.resolve();
    if (ln.ok) {
      p = core.voice.say(ln.result, {
        channel: "day",
        queue: true,
        onWord: (tokens, it) => {
          const span = (it && it.segs) || tokens || [0, 0];
          segs.forEach((s) => s.classList.toggle("said", Number(s.dataset.seg) >= span[0] && Number(s.dataset.seg) <= span[1]));
        },
      });
    }
    await p.catch(() => {});
    // a line with no recording yet still takes its time (the read-along is never a flash), at the test speed
    if (min) {
      const words = String(ln.text || "").split(/\s+/).filter(Boolean).length;
      const left = (500 + words * 330) / SPEED - (Date.now() - t0);
      if (left > 0) await new Promise((r) => setTimeout(r, left));
    }
    segs.forEach((s) => s.classList.remove("said"));
    if (el) {
      el.classList.remove("on");
      el.classList.add("done");
    }
    void who;
  };

  api.today = () => core.save.get("story").today || null;
  api.setToday = (patch) => core.save.update("story", (s) => ((s.today = Object.assign({}, s.today, patch)), s));
  api.dayNo = () => Number(core.save.get("story").dayNo) || 1;

  /** Leave for another page of the app (or, in tests, only note where it would go). */
  api.go = function (url) {
    window.Day.handoff = url;
    if (NONAV) return;
    if (window.NjgApp && window.NjgApp.go) window.NjgApp.go(window.NjgApp.link ? window.NjgApp.link(url) : url);
    else location.href = url;
  };
  api.home = function () {
    window.Day.handoff = "home";
    if (NONAV) return;
    if (window.NjgApp && window.NjgApp.home) window.NjgApp.home();
    else location.href = `${ROOT}index.html`;
  };

  // the test hook: what the stage wants now
  let state = "day/boot";
  let expect = () => ({ kind: "wait" });
  api.test = {
    state: (s) => (state = s),
    expect: (fn) => (expect = fn),
  };
  window.njgTest = Object.assign(window.njgTest || {}, { state: () => state, expect: () => expect(), gaps: () => api.gaps.slice() });
  return api;
}

/** The stage modules: each {built, start(day, log) -> done}, drawn into the page's one box. */
function pageStages(app, api) {
  const fresh = () => (app.innerHTML = "");
  return {
    door: {
      built: true,
      async start(day) {
        fresh();
        const { runDoor } = await import("./door.js");
        return runDoor(app, api, day);
      },
    },
    activity: {
      built: true,
      async start(day) {
        const act = api.data.activities[day.stage.activity] || api.data.activities[day.activity] || api.data.activities.kitchen;
        const to = act.go;
        api.go(to);
        const root = app.querySelector(".day-root");
        if (root) root.dataset.handoff = to;
        if (api.nonav) labNote(app, `Hand-off: ${to}`);
        return { status: "handoff", url: to };
      },
    },
    ride: {
      built: true,
      async start(day) {
        fresh();
        // the ride's settings, given to the ride as its data says them (its road; its level unless the URL names one)
        const s = day.stage || {};
        let rapi = api;
        if (s.road && api.data.window.rides[s.road] && day.trip) {
          const trips = Object.assign({}, api.data.trips, { [day.trip]: Object.assign({}, api.data.trips[day.trip], { ride: s.road }) });
          const rides = Object.assign({}, api.data.window.rides);
          if (s.vehicle) rides[s.road] = Object.assign({}, rides[s.road], { vehicle: s.vehicle });
          rapi = Object.assign({}, api, { data: Object.assign({}, api.data, { trips, window: Object.assign({}, api.data.window, { rides }) }) });
        }
        if (s.level && !api.q.get("level")) {
          const q2 = new URLSearchParams(api.q);
          q2.set("level", String(s.level));
          rapi = Object.assign({}, rapi, { q: q2 });
        }
        const { runWindow } = await import("./window.js");
        const result = await runWindow(app, rapi, day);
        return { status: "done", result };
      },
    },
    book: {
      built: true,
      async start(day) {
        fresh();
        const { runBook } = await import("./book.js");
        const result = await runBook(app, api, day);
        return { status: "done", result: result === undefined ? null : result };
      },
    },
  };
}

/** A grown-ups' note on the page (labs and tests only: never a child's screen). */
function labNote(app, text) {
  const n = document.createElement("p");
  n.className = "day-lab-note";
  n.dataset.grown = "";
  n.textContent = text;
  (app.querySelector(".day-root") || app).appendChild(n);
  return n;
}

async function boot() {
  const app = document.getElementById("day-app");
  window.Day = window.Day || {};
  const { loadCore } = await import("../core/index.js");
  const { createEngine, DATA_FILES } = await import("../core/lang/engine/index.js");
  const { loadJSON } = await import("../core/env.js");
  const load = (p) => loadJSON(p, { base: ROOT });
  const [data, days, core] = await Promise.all([load("data/day.json"), load("data/days.json"), loadCore({ base: ROOT })]);
  const langData = {};
  const [audio] = await Promise.all([load("data/family-audio.json").catch(() => []), ...DATA_FILES.map(async (f) => (langData[f] = await load(`data/lang/${f}.json`)))]);
  const E = createEngine({ data: langData, audio: audio || [], voice: core.voice });
  const api = makeApi({ data, days, core, E });
  // the sound hook's seam: every line is said through window.Day.say (one line in the sandbox's sound log)
  window.Day.say = (ln, o = {}) => api.sayNow(ln, o);
  window.Day.plain = (ln) => (ln && ln.text) || "";
  api.say = (ln, o) => window.Day.say(ln, o);

  // the day: ?day=N, or the one this child is on (or stopped in today)
  const today = api.today();
  const isToday = !!(today && today.date === todayDate());
  const n = Number(q.get("day")) || (isToday && today.day) || api.dayNo();
  const day = withOverrides(dayOf(days, n), data, { weather: q.get("weather"), activity: q.get("activity"), trip: q.get("trip") });
  const asked = q.get("stage") ? stageId(q.get("stage")) : null;
  let from = 0;
  let only = false;
  if (asked) {
    from = day.stages.findIndex((s) => stageId(s.stage) === asked);
    only = asked !== "door";
    // a stage the day does not have (?stage=window on a kitchen day): played alone with its defaults
    if (from < 0) {
      day.stages.push({ stage: asked });
      from = day.stages.length - 1;
    }
  } else if (isToday && today.day === day.id) {
    // where today stopped: the stage after the hand-off (older saves: the book once the activity was started)
    if (Number.isInteger(today.next)) from = Math.min(today.next, day.stages.length - 1);
    else if (today.at === "activity") from = Math.max(0, day.stages.findIndex((s) => s.stage === "book"));
  }

  const log = { day: day.id, date: todayDate(), stages: [] };
  window.Day.log = log;
  window.Day.skipped = [];
  const stages = pageStages(app, api);
  const L = await runDay(day, {
    stages,
    log,
    from,
    only,
    view: (d, s) => dayView(d, data, s),
    note: (msg, entry) => {
      window.Day.skipped.push(msg);
      console.info(`[day] skipped: ${msg}`);
      if (api.nonav || q.get("lab") === "1") labNote(app, `Skipped: ${msg}`);
      void entry;
    },
    onStage: (entry, i) => {
      window.Day.stage = entry.stage === "ride" ? "window" : entry.stage;
      api.test.state(`day/${entry.stage}`);
      api.test.expect(() => ({ kind: "wait" }));
      // where the day is: a page left mid-day (a hand-off, a closed tab) picks up here today
      api.setToday({ date: todayDate(), day: day.id, weather: dayView(day, data).weather, activity: dayView(day, data).activity, trip: dayView(day, data).trip, next: i, at: entry.stage });
    },
    onDone: (entry, i) => {
      if (entry.status === "handoff") api.setToday({ next: i + 1, at: "activity" });
      else api.setToday({ next: i + 1 });
      // the day log: each stage's end in the story log (a `round`: the book never makes a word of it)
      if (core.log && entry.status !== "skipped") core.log.log({ arc: "day", errand: `day${day.id}:${entry.stage}`, type: "round", what: `day-stage:${entry.stage}`, place: entry.status });
    },
  });
  window.Day.log = L;
  if (L.ended) {
    window.Day.stage = "end";
    api.test.state("day/end");
    api.test.expect(() => ({ kind: "end" }));
  } else if (L.stages.length && L.stages[L.stages.length - 1].status === "handoff") {
    api.test.expect(() => ({ kind: "end" }));
  }
}

if (hasDOM && document.getElementById("day-app")) {
  boot().catch((e) => {
    window.Day = Object.assign(window.Day || {}, { error: String((e && e.stack) || e) });
    console.error(e);
  });
}
