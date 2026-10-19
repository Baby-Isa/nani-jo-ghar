/*
 * A day at Nani's (Zafar, 19 Oct; docs/game-design/story-and-arcs.md Part 1): the morning door, the day's activity, the evening
 * book. day.html runs it; lab/day.html shows every weather, activity and stage. This file boots the core (the one save, the voice
 * queue, the day log), the language engine (data/lang/: every line is a meaning it builds; what it can't say is the grey
 * "to record" English, decision 84) and routes to a stage:
 *
 *   day.html                      the day this child is on: the door (morning), or the book when today's activity was started
 *   ?stage=door|book|window       one stage (labs and tests)    ?day=N  ?weather=sunny|cloudy|raining|night  ?activity=kitchen|clinic|trip
 *   ?trip=farm  ?level=1..3  ?seed=N  ?speed=N (test speed)  ?nonav=1 (no hand-off: tests)  ?log=kitchen|clinic|farm (the book
 *   with a day log as that activity would leave it, in memory only: the lab)
 *
 * The child's day lives in the save's story namespace (the day log's home): story.today = {date, day, weather, activity, trip, at},
 * story.dayNo = the day the child is on. Hand-offs: the kitchen opens Cook, the clinic opens the clinic (their own entries,
 * unchanged); a trip goes on to the window ride (the place itself is a later sprint's).
 *
 * window.Day   {say(line, {who}), plain(line), handoff, stage}: the sound hook (build/sandbox/lib/sound.mjs) wraps Day.say, so
 *              each of Nani's lines is one line in the sandbox's sound log
 * window.njgTest  {state(), expect()}: "day/door", "day/book", "day/window/ride": what the stage wants next (the flows)
 */
import { loadCore } from "../core/index.js";
import { createEngine, DATA_FILES } from "../core/lang/engine/index.js";
import { loadJSON } from "../core/env.js";

const q = new URLSearchParams(location.search);
const ROOT = document.documentElement.dataset.root || "";
const SPEED = Number(q.get("speed")) || 1;
const NONAV = q.get("nonav") === "1";
const V = typeof window.njgV === "function" ? window.njgV : (u) => u;

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

function makeApi({ data, core, E }) {
  const api = {
    data,
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

  /** The day: ?day=N or the child's own; the URL may override its weather, activity and trip (the lab). */
  api.dayDef = function (n = Number(q.get("day")) || api.dayNo()) {
    const list = data.days || [];
    const d = Object.assign({}, list[(n - 1) % list.length] || list[0]);
    d.id = n;
    if (q.get("weather") && data.weather[q.get("weather")]) d.weather = q.get("weather");
    if (q.get("activity") && data.activities[q.get("activity")]) d.activity = q.get("activity");
    if (q.get("trip") && data.trips[q.get("trip")]) d.trip = q.get("trip");
    if (d.activity === "trip" && !d.trip) d.trip = Object.keys(data.trips)[0];
    return d;
  };

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

async function boot() {
  const app = document.getElementById("day-app");
  window.Day = window.Day || {};
  const load = (p) => loadJSON(p, { base: ROOT });
  const [data, core] = await Promise.all([load("data/day.json"), loadCore({ base: ROOT })]);
  const langData = {};
  const [audio] = await Promise.all([load("data/family-audio.json").catch(() => []), ...DATA_FILES.map(async (f) => (langData[f] = await load(`data/lang/${f}.json`)))]);
  const E = createEngine({ data: langData, audio: audio || [], voice: core.voice });
  const api = makeApi({ data, core, E });
  // the sound hook's seam: every line is said through window.Day.say (one line in the sandbox's sound log)
  window.Day.say = (ln, o = {}) => api.sayNow(ln, o);
  window.Day.plain = (ln) => (ln && ln.text) || "";
  api.say = (ln, o) => window.Day.say(ln, o);

  let stage = q.get("stage");
  const today = api.today();
  if (!stage) stage = today && today.date === todayDate() && today.at === "activity" ? "book" : "door";
  window.Day.stage = stage;
  const day = api.dayDef(stage === "book" && today && today.date === todayDate() && !q.get("day") ? today.day : undefined);
  if (stage === "door") {
    const { runDoor } = await import("./door.js");
    const out = await runDoor(app, api, day);
    if (out && out.next === "window") {
      app.innerHTML = "";
      const { runWindow } = await import("./window.js");
      await runWindow(app, api, day);
      app.innerHTML = "";
      const { runBook } = await import("./book.js");
      await runBook(app, api, day);
    }
  } else if (stage === "window") {
    const { runWindow } = await import("./window.js");
    await runWindow(app, api, day);
  } else {
    const { runBook } = await import("./book.js");
    await runBook(app, api, day);
  }
}

boot().catch((e) => {
  window.Day = Object.assign(window.Day || {}, { error: String((e && e.stack) || e) });
  console.error(e);
});
