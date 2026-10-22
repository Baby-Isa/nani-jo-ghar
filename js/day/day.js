/*
 * A day at Nani's (Zafar, 19-20 Oct; docs/game-design/days/README.md §1): the day runner. A day is data: an ordered
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
 *   ?stages=door:sunny,cook:chai-tray:1,clinic:eye:1,ride:farm,book   (Sprint 10, lab/day.html's day builder) a day of the grown-up's own
 *                           making: the stages in this order (parseStages), saved in story.today with where it is, resumed after each
 *                           hand-off (Cook and the clinic go to lab.html / clinic.html with ?then=day.html and come back to it)
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

/**
 * LNG-18 (Zafar, 20 and 22 Oct: "it should be playing with a robotic voice if there's no recordings"): a line the engine can't
 * build yet (its grey to-record English) is still heard while testing. On the test path the device voice says its English; the
 * store build says nothing (a "missing" piece: never a computer voice, js/core/voice.js). -> a clip plan for voice.say
 */
export function unsaidPlan(en, path = "test") {
  return { clipPlan: [{ text: String(en == null ? "" : en), source: path === "test" ? "device" : "missing", tokens: [0, 0] }] };
}

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
  // a day of the builder's own (?stages=): a cook stage is the kitchen, a clinic stage is the clinic
  const act = find("activity") || (find("cook") && { activity: "kitchen" }) || (find("clinic") && { activity: "clinic" }) || null;
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

// ---------------------------------------------------------------- the builder's days (?stages=)

const COOK_ID = /^[a-z][a-z0-9-]*$/;
/** The clinic's stages other than the healing games: ?stages=clinic:pharmacy:2 plays that stage alone. */
const CLINIC_STAGES = ["waiting", "diagnosis", "pharmacy", "sendoff"];

/**
 * ?stages=door:sunny,cook:chai-tray:1,clinic:eye:1,ride:farm,book  ->  {stages: [{stage, ...settings}], notes: [what was left out]}
 *
 *   door[:weather]            the morning door (a key of data/day.json weather; sunny when left out); its line set follows the
 *                             next stage: cook -> kitchen, clinic -> clinic, ride -> that trip's
 *   cook[:station[:level]]    one Cook station at a level (lab.html?mode=cook&game=…), or cook / cook:full[:level] / cook:2: Cook's story
 *                             round, the pantry first and then the chai order
 *   clinic[:game[:level]]     one healing game (or waiting / diagnosis / pharmacy / sendoff) at a level, or clinic / clinic:full: a morning
 *   ride[:trip[:level]]       the window ride to a trip (farm, shops; farm when left out) at a level; `window` is the same
 *   book                      the evening book
 * The data is optional (the weather and trips are checked against it when it is given).
 */
export function parseStages(text, data = null) {
  const notes = [];
  const out = [];
  const weather = (data && data.weather) || null;
  const trips = (data && data.trips) || null;
  const level = (v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 4 ? n : null;
  };
  for (const raw of String(text == null ? "" : text).split(",")) {
    const tok = raw.trim();
    if (!tok) continue;
    const [name0, ...p] = tok.split(":").map((x) => x.trim());
    const name = stageId(name0.toLowerCase());
    if (name === "door") {
      let w = (p[0] || "sunny").toLowerCase();
      if (weather && !weather[w]) {
        notes.push(`${tok}: no such weather, sunny instead`);
        w = "sunny";
      }
      out.push({ stage: "door", weather: w });
    } else if (name === "cook" || name === "clinic") {
      const nums = p.filter((x) => /^\d+$/.test(x));
      const word = p.find((x) => x && !/^\d+$/.test(x)) || null;
      const lv = level(nums[0]);
      if (nums.length && lv == null) notes.push(`${tok}: level 1 to 4, 1 instead`);
      const game = word && word !== "full" ? word.toLowerCase() : null;
      if (game && !COOK_ID.test(game)) {
        notes.push(`${tok}: not a game, left out`);
        continue;
      }
      out.push({ stage: name, game, level: lv || 1 });
    } else if (name === "ride") {
      const trip = (p[0] || "farm").toLowerCase();
      if (trips && !trips[trip]) {
        notes.push(`${tok}: no such trip, left out`);
        continue;
      }
      const lv = p[1] != null && p[1] !== "" ? level(p[1]) : null;
      if (p[1] && lv == null) notes.push(`${tok}: level 1 to 4, the ride's own instead`);
      out.push(Object.assign({ stage: "ride", trip, road: trips ? trips[trip].ride : null }, lv ? { level: lv } : {}));
    } else if (name === "book") {
      out.push({ stage: "book" });
    } else if (name === "activity") {
      const a = (p[0] || "kitchen").toLowerCase();
      out.push({ stage: "activity", activity: a });
    } else notes.push(`${tok}: not a stage, left out`);
  }
  // each door says what the day is about: the lines of the next stage that is about something
  out.forEach((s, i) => {
    if (s.stage !== "door") return;
    const next = out.slice(i + 1).find((x) => ["cook", "clinic", "ride", "activity"].includes(x.stage));
    if (!next) return;
    s.lines = next.stage === "cook" ? "kitchen" : next.stage === "clinic" ? "clinic" : next.stage === "ride" ? next.trip : next.activity;
  });
  return { stages: out, notes };
}

/**
 * The builder's day for this page load: ?stages= (a fresh run from its first stage) or, only when asked (?resume=1, the page a
 * hand-off comes back to: handoffUrl's ?then=), the list story.today kept when that hand-off left the page (custom, stages), resumed
 * at the stage after it (today.next). -> {stages | null, id, from, over, notes, stale}
 * over: the hand-off was the last stage, so the day is finished. stale (LAB-07, Zafar 22 Oct: the builder "opened by itself"): a
 * builder's day saved in story.today that this load did not ask to resume; the page clears it and plays the child's own day.
 */
export function customDay({ asked = null, today = null, isToday = false, data = null, dayNo = 1, resume = false } = {}) {
  if (asked) {
    const p = parseStages(asked, data);
    return { stages: p.stages.length ? p.stages : null, id: dayNo, from: 0, over: false, notes: p.notes, stale: false };
  }
  const saved = !!(today && today.custom && Array.isArray(today.stages) && today.stages.length);
  if (resume && isToday && saved) {
    const from = Number.isInteger(today.next) ? today.next : 0;
    return { stages: today.stages, id: today.day || dayNo, from, over: from >= today.stages.length, notes: [], stale: false };
  }
  return { stages: null, id: dayNo, from: 0, over: false, notes: [], stale: saved };
}

/** What story.today becomes when a stale builder's day is cleared (LAB-07): no list, nothing to resume; the child's day starts afresh. */
export const CLEAR_CUSTOM = Object.freeze({ custom: false, stages: null, next: null, at: null });

/**
 * One page load's start (the page's boot, pure): which list it plays and from where. -> {cu, today (after a stale builder's day
 * is cleared), isToday, n (the day's number), clear (the patch to save, or null)}
 *   asked: ?stages= (or a bookend's); resume: ?resume=1; dayAsked: ?day=N; date: today's date; dayNo: the child's day (story.dayNo)
 */
export function pageStart({ today = null, asked = null, resume = false, dayAsked = null, date = todayDate(), dayNo = 1, data = null } = {}) {
  const live = (t) => !!(t && t.date === date && t.at !== "done" && t.at != null);
  const cu = customDay({ asked, today, isToday: live(today), data, dayNo, resume });
  const clear = cu.stale ? Object.assign({}, CLEAR_CUSTOM) : null;
  const t = clear ? Object.assign({}, today, clear) : today;
  const isToday = live(t);
  const n = Number(dayAsked) || (isToday && t.day) || dayNo;
  return { cu, today: t, isToday, n, clear };
}

/** A page of this app, as the host's ?then= check allows it (js/shared/host.js THEN_RE): never another site. */
const APP_PAGE = /^[\w-]+\.html(\?[\w=&%.,:-]*)?$/;

/**
 * LAB-06 (Zafar, 22 Oct: "if you toggle the day builder it just bookends with the Nani house and the Nani book"): a game the labs
 * launches with the Day builder toggle on (labs.html sends it as day.html?bookend=<its link>) -> {stages: the ?stages= text (the
 * door, the game, the book), log} or null (a page the day can't play as a stage: the labs launch it as it is).
 *   lab.html?mode=cook&game=chai-tray&level=1   -> door,cook:chai-tray:1,book      lab.html?mode=cook&level=2 -> door,cook:full:2,book
 *   lab.html?mode=clinic&game=eye&level=1       -> door,clinic:eye:1,book          clinic.html?level=1        -> door,clinic:full:1,book
 *   day.html?stage=ride&day=2&level=1           -> door,ride:farm:1,book           day.html?stage=book&log=k  -> door,book (log k)
 *   day.html?stages=door:night                  -> door:night,book                 (a list that has its own door or book keeps it)
 * A link with anything else in it (?eyetest=b, ?play=free, ?lab=1) is not bookended: its variant would be lost.
 */
export function bookendStages(href) {
  const s = String(href == null ? "" : href).trim();
  if (!APP_PAGE.test(s)) return null;
  const [page, query = ""] = s.split("?");
  const p = new URLSearchParams(query);
  const keys = [...p.keys()];
  const only = (...ok) => keys.every((k) => ok.includes(k));
  const lv = (() => {
    const n = Number(p.get("level"));
    return Number.isInteger(n) && n >= 1 && n <= 4 ? n : 1;
  })();
  const game = (p.get("game") || "").toLowerCase();
  if (game && !COOK_ID.test(game)) return null;
  const wrap = (mid, log = null) => ({ stages: `door,${mid},book`, log });
  if (page === "lab.html" && only("mode", "game", "level")) {
    const mode = p.get("mode");
    if (mode !== "cook" && mode !== "clinic") return null;
    return wrap(game ? `${mode}:${game}:${lv}` : `${mode}:full:${lv}`);
  }
  if (page === "clinic.html" && only("level")) return wrap(`clinic:full:${lv}`);
  if (page === "day.html") {
    if (p.get("stages") && only("stages")) {
      const list = p.get("stages").split(",").map((x) => x.trim()).filter(Boolean);
      if (!list.length) return null;
      if (stageId(list[0].split(":")[0]) !== "door") list.unshift("door");
      if (list[list.length - 1] !== "book") list.push("book");
      return { stages: list.join(","), log: null };
    }
    const st = stageId(p.get("stage") || "");
    if (st === "ride" && only("stage", "day", "level")) return wrap(p.get("level") ? `ride:farm:${lv}` : "ride:farm");
    if (st === "book" && only("stage", "log")) return { stages: "door,book", log: p.get("log") || null };
  }
  return null;
}

/**
 * What story.today keeps: where the day is as a stage starts (the page left mid-day, a hand-off or a closed tab, picks up here today);
 * a day of the builder's own keeps its list (custom, stages) so the page that comes back from a hand-off plays the rest of it.
 */
export function startPatch(day, data, i, entry, custom = false) {
  const v = dayView(day, data);
  return { date: todayDate(), day: day.id, weather: v.weather, activity: v.activity, trip: v.trip, next: i, at: entry.stage, custom, stages: custom ? clone(day.stages) : null };
}
/** And as a stage ends: the next stage is next (after a hand-off, the activity's); a builder's day that does not end in the book is over after its last stage (the book sets "done" itself). */
export function donePatches(day, i, entry, custom = false) {
  const out = [entry.status === "handoff" ? { next: i + 1, at: "activity" } : { next: i + 1 }];
  if (custom && i + 1 >= day.stages.length && entry.status !== "handoff") out.push({ at: "done", custom: false, stages: null });
  return out;
}

/** The ?stages= text for a list (the builder writes it): the inverse of parseStages. */
export function stagesText(stages) {
  return (stages || [])
    .map((s) => {
      if (s.stage === "door") return s.weather && s.weather !== "sunny" ? `door:${s.weather}` : s.weather ? "door:sunny" : "door";
      if (s.stage === "cook" || s.stage === "clinic") return s.game ? `${s.stage}:${s.game}:${s.level || 1}` : s.level && s.level > 1 ? `${s.stage}:full:${s.level}` : `${s.stage}:full`;
      if (s.stage === "ride") return s.trip ? `ride:${s.trip}${s.level ? `:${s.level}` : ""}` : "ride";
      if (s.stage === "activity") return `activity:${s.activity || "kitchen"}`;
      return s.stage;
    })
    .join(",");
}

/** The page a builder's hand-off comes back to: day.html, asked to resume the saved day (LAB-07: never resumed unasked). */
export const RESUME = "day.html?resume=1";

/**
 * Where a cook or clinic stage hands off to, and back: the host's page for that one game (or Cook's story round, or a clinic morning)
 * with ?then=day.html?resume=1 (encoded), which the end screen's Next follows (js/shared/host.js, js/clinic/main.js); day.html then
 * picks the day up at the stage after this one (story.today.next).
 */
export function handoffUrl(s, then = RESUME) {
  const L = Number(s.level) || 1;
  const t = then ? `&then=${encodeURIComponent(then)}` : ""; // then = null: the game alone (its end screen's All games goes back to the labs)
  if (s.stage === "cook") return s.game ? `lab.html?mode=cook&game=${s.game}&level=${L}${t}` : `lab.html?mode=cook&level=${L}${t}`;
  if (s.stage === "clinic") {
    if (!s.game) return then ? `clinic.html?then=${encodeURIComponent(then)}` : "clinic.html";
    return `clinic.html?stage=${CLINIC_STAGES.includes(s.game) ? s.game : `heal&game=${s.game}`}&level=${L}${t}`;
  }
  return null;
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
    } else if (ln.en) p = core.voice.say(unsaidPlan(ln.en, core.voice.path ? core.voice.path() : "test"), { channel: "day", queue: true });
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

  /**
   * The shared help kit (SH-19: first-time help in every game, the same kit): js/shared/onboard.js with its css, and
   * js/shared/uistore.js for "seen once per player" (a New player's reset clears it). Loaded when a stage first needs it.
   *   await api.kit() -> window.Onboard     api.helpDue(id) -> true when this player has not had that help yet
   *   api.helped(id)   it has now (once per player)
   */
  let kitP = null;
  api.kit = () =>
    (kitP =
      kitP ||
      (async () => {
        if (!window.UIStore) await import("../shared/uistore.js");
        if (!window.Onboard) await import("../shared/onboard.js");
        if (!document.querySelector("link[data-onboard-css]")) {
          const l = document.createElement("link");
          l.rel = "stylesheet";
          l.href = api.url("css/shared/onboard.css");
          l.dataset.onboardCss = "";
          document.head.appendChild(l);
        }
        return window.Onboard;
      })());
  api.helpDue = (id) => !!(window.Onboard && !window.Onboard.seen(id));
  api.helped = (id) => {
    try {
      if (window.UIStore) window.UIStore.set("onboarded", id, true);
    } catch (e) {
      /* the save is out of reach: the help shows again next time */
    }
  };

  api.today = () => core.save.get("story").today || null;
  api.setToday = (patch) => core.save.update("story", (s) => ((s.today = Object.assign({}, s.today, patch)), s));
  api.dayNo = () => Number(core.save.get("story").dayNo) || 1;
  /** Day N as the older stage code reads a day ({id, weather, activity, trip, lines}): the book's tomorrow uses it. */
  api.dayDef = (n = api.dayNo()) => dayView(dayOf(days, n), data);

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
  const handoff = (settings) => {
    // a test speed (?speed=3) goes there and comes back: the game's own, and the page the end screen's Next opens
    const back = api.speed !== 1 ? `${RESUME}&speed=${api.speed}` : RESUME;
    const to = handoffUrl(settings, back) + (api.speed !== 1 ? `&speed=${api.speed}` : "");
    api.go(to);
    const root = app.querySelector(".day-root");
    if (root) root.dataset.handoff = to;
    if (api.nonav) labNote(app, `Hand-off: ${to}`);
    return { status: "handoff", url: to };
  };
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
    // Sprint 10: a Cook game or a clinic game (or a morning) hands off to its own page with ?then=day.html and the day goes on after it
    cook: {
      built: true,
      async start(day) {
        return handoff(day.stage);
      },
    },
    clinic: {
      built: true,
      async start(day) {
        return handoff(day.stage);
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

  window.Day.skipped = [];
  // LAB-06: a game the labs launched with the Day builder toggle on (?bookend=<its link>): the door, the game, the book
  let stagesAsked = q.get("stages");
  const be = q.get("bookend");
  if (be && !stagesAsked) {
    const b = bookendStages(be);
    if (!b) {
      // a page the day can't play as a stage: it is launched as it is (only a page of this app)
      if (APP_PAGE.test(be)) api.go(be);
      return;
    }
    stagesAsked = b.stages;
    if (b.log && !q.get("log")) q.set("log", b.log);
    window.Day.bookend = b.stages;
  }
  // the day: ?day=N, or the one this child is on (or stopped in today: a hand-off, a closed tab; once its book is done, at
  // "done", the next day starts). LAB-07: a builder's day saved in story.today is resumed only when the page that comes back from
  // its hand-off asks (?resume=1); any other load clears it, so it never opens by itself, and plays the child's own day
  const ps = pageStart({ today: api.today(), asked: stagesAsked, resume: q.get("resume") === "1", dayAsked: q.get("day"), dayNo: api.dayNo(), data });
  if (ps.clear) {
    api.setToday(ps.clear);
    window.Day.cleared = true;
  }
  const { cu, today, isToday, n } = ps;
  cu.notes.forEach((m) => window.Day.skipped.push(m));
  const custom = cu.stages;
  const day = custom ? { id: cu.id, name: "custom", stages: clone(custom) } : withOverrides(dayOf(days, n), data, { weather: q.get("weather"), activity: q.get("activity"), trip: q.get("trip") });
  // a builder's day of the clinic only (no Cook stage): the evening book is the clinic's day (log=clinic), not the kitchen's
  if (custom && !q.get("log") && day.stages.some((s) => s.stage === "clinic") && !day.stages.some((s) => s.stage === "cook")) q.set("log", "clinic");
  const asked = !custom && q.get("stage") ? stageId(q.get("stage")) : null;
  let from = 0;
  let only = false;
  if (custom) {
    from = cu.from;
    if (cu.over) {
      // the last stage was the hand-off: the day is over
      api.setToday({ at: "done", custom: false, stages: null });
      window.Day.stage = "end";
      api.test.state("day/end");
      api.test.expect(() => ({ kind: "end" }));
      api.home();
      return;
    }
  } else if (asked) {
    from = day.stages.findIndex((s) => stageId(s.stage) === asked);
    only = asked !== "door";
    // a stage the day does not have (?stage=window on a kitchen day): played alone with its defaults
    if (from < 0) {
      day.stages.push({ stage: asked });
      from = day.stages.length - 1;
    }
  } else if (isToday && today.day === day.id) {
    // where today stopped: the stage after the hand-off (older saves: the book once the activity was started)
    if (Number.isInteger(today.next)) from = today.next < day.stages.length ? today.next : 0;
    else if (today.at === "activity") from = Math.max(0, day.stages.findIndex((s) => s.stage === "book"));
  }

  const log = { day: day.id, date: todayDate(), stages: [] };
  window.Day.log = log;
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
    onStage: async (entry, i) => {
      // a beat between two stages (the one before keeps its end on screen a moment: its test hook's "end" is still read)
      if (i > from) await new Promise((r) => setTimeout(r, 400));
      // the hand-off stage draws nothing: the door stays on screen and is still the stage the page shows
      if (!["activity", "cook", "clinic"].includes(entry.stage)) window.Day.stage = entry.stage === "ride" ? "window" : entry.stage;
      api.test.state(`day/${entry.stage}`);
      api.test.expect(() => ({ kind: "wait" }));
      // where the day is: a page left mid-day (a hand-off, a closed tab) picks up here today
      api.setToday(startPatch(day, data, i, entry, !!custom));
    },
    onDone: (entry, i) => {
      donePatches(day, i, entry, !!custom).forEach((p) => api.setToday(p));
      // the day log: each stage's end in the story log (a `round`: the book never makes a word of it)
      if (core.log && entry.status !== "skipped") core.log.log({ arc: "day", errand: `day${day.id}:${entry.stage}`, type: "round", what: `day-stage:${entry.stage}`, place: entry.status });
    },
  });
  window.Day.log = L;
  if (L.ended) {
    window.Day.stage = "end";
    api.test.state("day/end");
    api.test.expect(() => ({ kind: "end" }));
    // a builder's day is over after its last stage: home (the book goes home itself, but not when it shows a lab day log)
    if (custom) {
      await api.wait(1500);
      api.home();
    }
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
