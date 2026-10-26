/*
 * The evening book's games, planned (pure: no page, Node-testable; build/leak_book.mjs and build/test_day_book.mjs read the same
 * plan the page plays). data/day-book.json says what each place holds; the day log says what happened today. The leak rules
 * (build/reports/s09a-fable-review.md section 2, Zafar 20 Oct; S12 decision 9, Zafar 23 Oct) live here, once:
 *   find it        rounds of one ask each: the asked thing (one of today's words) among 3-4 plain picture cards, the others words
 *                  already learned and today's, shuffled together, in a random order; the first round opens on the asked word's
 *                  card (study: it is shown, then shuffled: never scored), later rounds go straight to the question
 *   name it        three choices in a random order; the right word never said first; the answer one of today's or the spaced
 *                  words, the decoys learned words; a word that was the answer on an earlier page is never on a later page (so
 *                  elimination across pages learns nothing)
 *   stick in       three photos of today's things (word cards) in a random order; one asked per page; an earlier answer never back
 *   our day        today's things in the day's order; not scored
 * The spaced words (S12 decision 9): the pool also draws on what the child met 1, 3 and 7 days ago (spacedFrom), from any place.
 *
 *   planBook({data, place, today, history, say, rng, only}) -> {place, met, back, learned, things, pages: [{game, ...}]}
 *   spacedFrom({today: "YYYY-MM-DD", days: the day log, words: the save's words}) -> {back, learned}, each {entries, words}
 *   todayThings(place, {entries, words}) -> the place's thing keys met today, in the day's order
 *   fill(meaning, thing) -> the meaning with "{x}" (the thing's Item) and "{word}" (its lexicon id) put in
 */

/** The days back the book brings a word again (Zafar, 23 Oct: 1, 3 and 7 days ago, as well as today). */
export const SPACED = [1, 3, 7];
/** Whole days from date b to date a ("YYYY-MM-DD"). */
export function dayGap(a, b) {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86400000);
}
const isoDay = (t) => {
  const d = new Date(t);
  return isNaN(d) ? null : d.toISOString().slice(0, 10);
};
/**
 * What the child met before today, from the day log (js/core/log.js: [{date, entries}]) and the save's words ({id: {last,
 * understand_stage}}): back = met exactly 1, 3 or 7 days ago (the spaced words); learned = met on any earlier day (a word whose
 * stage has moved on counts as learned too). Each {entries, words}, for todayThings.
 */
export function spacedFrom({ today, days = [], words = {}, gaps = SPACED } = {}) {
  const back = { entries: [], words: [] };
  const learned = { entries: [], words: [] };
  for (const d of days || []) {
    const n = d && d.date ? dayGap(today, d.date) : 0;
    if (n <= 0) continue;
    const es = (d.entries || []).filter((e) => e && e.type !== "round");
    learned.entries.push(...es);
    if (gaps.includes(n)) back.entries.push(...es);
  }
  for (const [id, w] of Object.entries(words || {})) {
    if (!w) continue;
    const last = w.last ? isoDay(w.last) : null;
    const n = last ? dayGap(today, last) : 0;
    if (n > 0 || Number(w.understand_stage) >= 2) learned.words.push(id);
    if (n > 0 && gaps.includes(n)) back.words.push(id);
  }
  return { back, learned };
}
/** Every place's things, this place's first: a spaced word from another day's place comes with its own picture. */
export function allThings(data, placeKey) {
  const own = data.places[placeKey].things;
  const out = Object.assign({}, own);
  const words = new Set(Object.values(own).map((t) => t.word));
  for (const [pk, p] of Object.entries(data.places)) {
    if (pk === placeKey || !p || typeof p !== "object" || !p.things) continue;
    for (const [k, t] of Object.entries(p.things)) {
      if (out[k] || words.has(t.word)) continue;
      out[k] = t;
      words.add(t.word);
    }
  }
  return out;
}

/** "{x}" -> the thing's Item meaning, "{word}" -> its lexicon id, anywhere in a meaning */
export function fill(m, thing) {
  if (m === "{x}") return { fn: "Item", kind: thing.word };
  if (m === "{word}") return thing.word;
  if (Array.isArray(m)) return m.map((x) => fill(x, thing));
  if (m && typeof m === "object") {
    const o = {};
    for (const [k, v] of Object.entries(m)) o[k] = fill(v, thing);
    return o;
  }
  return m;
}

/** a line's candidates for a thing: [{meaning | word, en, wanted}] with the thing put in */
export function linesFor(list, thing, enOf = (t) => t.en || "") {
  return (list || []).map((d) => {
    const o = Object.assign({}, d);
    if (d.meaning) o.meaning = thing ? fill(d.meaning, thing) : d.meaning;
    if (thing) o.en = String(d.en || "").replace("{en}", enOf(thing));
    return o;
  });
}

/** The place's things met today, in the day's order (the log's entries first, then the words met). */
export function todayThings(place, { entries = [], words = [] } = {}) {
  const keys = Object.keys(place.things || {});
  const byId = new Map();
  for (const k of keys) {
    const t = place.things[k];
    byId.set(t.word, k);
    for (const id of t.ids || []) byId.set(id, k);
  }
  const out = [];
  const add = (id) => {
    const k = byId.get(String(id));
    if (k && !out.includes(k)) out.push(k);
  };
  for (const e of entries) {
    if (e.type === "round") continue;
    add(e.what);
  }
  for (const w of words) add(w);
  return out;
}

export function shuffle(a, rng) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/**
 * The book's pages. data: data/day-book.json; place: its key; today: {entries, words}; history: spacedFrom(...) (none: a first
 * day); say(thing key) -> can the engine name it; only: one game (the lab's ?game=). Each page: {game, ...} (see the header).
 * things: every thing the plan may show (this place's and the spaced ones from other places), by key.
 */
export function planBook({ data, place: placeKey, today = {}, history = null, say = () => true, rng = Math.random, only = null } = {}) {
  const place = data.places[placeKey];
  if (!place) throw new Error(`book: no place "${placeKey}"`);
  const things = allThings(data, placeKey);
  const ok = (k) => !!things[k] && say(k);
  const uniq = (a) => a.filter((k, i) => a.indexOf(k) === i);
  const met = todayThings(place, today);
  const back = history ? todayThings({ things }, history.back || {}).filter((k) => ok(k) && !met.includes(k)) : [];
  const learned = history ? todayThings({ things }, history.learned || {}).filter(ok) : [];
  // today's things the engine can say; when the log holds too few (a short day), the place's own fill the rest (still this place's)
  const pool = (list, n) => {
    const own = (list || []).filter(ok);
    const first = own.filter((k) => met.includes(k));
    return first.length >= n ? first : [...first, ...own.filter((k) => !first.includes(k))];
  };
  const order = only ? (only === "nameit" || only === "photo" ? [only, only] : [only]) : data.order;
  const pages = [];
  const used = { nameit: [], photo: [] };
  for (const game of order) {
    if (game === "find") {
      const F = place.find;
      const shown = pool(F.shown, F.shown.length);
      const n = Math.max(3, Math.min(F.cards || 4, 5));
      const asks = shuffle(shown.filter((k) => met.length === 0 || met.includes(k)), rng).slice(0, F.ask || 2);
      const rounds = [];
      for (const ask of asks) {
        // the decoys: words already learned and today's, shuffled together (never only old ones beside today's: "the one I saw
        // today" is no clue), then the place's own
        const near = shuffle(uniq([...learned, ...met.filter(ok)]).filter((k) => k !== ask), rng);
        const fillers = shuffle(shown.filter((k) => k !== ask && !near.includes(k)), rng);
        const decoys = [...near, ...fillers].slice(0, n - 1);
        if (decoys.length < 2) continue;
        rounds.push({ ask, cards: shuffle([ask, ...decoys], rng), intro: !rounds.length });
      }
      if (!rounds.length) continue;
      pages.push({ game, rounds, asks: rounds.map((r) => r.ask), things: uniq(rounds.flatMap((r) => r.cards)) });
    } else if (game === "nameit") {
      const G = place[game];
      // the answer: one of today's words or the spaced words (1, 3, 7 days ago); the decoys: learned words, then the place's
      const answers = uniq([...pool(G.pool, 3).filter((k) => met.includes(k)), ...back]).filter((k) => !used[game].includes(k));
      const others = uniq([...learned, ...met.filter(ok), ...pool(G.pool, 3)]).filter((k) => !used[game].includes(k));
      const left = answers.length ? answers : others;
      if (!left.length) continue;
      const answer = left[Math.floor(rng() * left.length)];
      const decoys = shuffle(others.filter((k) => k !== answer), rng).slice(0, 2);
      if (decoys.length < 2) continue;
      used[game].push(answer);
      pages.push({ game, answer, choices: shuffle([answer, ...decoys], rng), spaced: back.includes(answer) });
    } else if (game === "photo") {
      const G = place[game];
      const left = pool(G.pool, 3).filter((k) => !used[game].includes(k));
      if (left.length < 3) continue;
      const answer = left[Math.floor(rng() * left.length)];
      const decoys = shuffle(left.filter((k) => k !== answer), rng).slice(0, 2);
      used[game].push(answer);
      pages.push({ game, answer, choices: shuffle([answer, ...decoys], rng) });
    } else if (game === "ourday") {
      const list = (place.ourday || []).filter((k) => place.things[k] && say(k));
      // the day starts at the door (the list's first thing, always); then today's things in the order they happened; then the rest
      const start = list[0];
      const todays = met.filter((k) => list.includes(k) && k !== start);
      const ordered = [start, ...todays, ...list.filter((k) => k !== start && !todays.includes(k))];
      if (ordered.length < 2) continue;
      pages.push({ game, things: ordered.slice(0, 5) });
    }
  }
  return { place: placeKey, met, back, learned, things, pages };
}

/** The words of the day's book (the end's gold cards): every thing asked or told, once, in the book's order. */
export function bookWords(plan) {
  const out = [];
  const add = (k) => k && !out.includes(k) && out.push(k);
  for (const p of plan.pages) {
    if (p.game === "find") p.asks.forEach(add);
    else if (p.game === "nameit" || p.game === "photo") add(p.answer);
    else if (p.game === "ourday") p.things.forEach(add);
  }
  return out;
}

/**
 * The book's one line at a time (DAY-02, the judge, 21 Oct): every line Nani says in the book goes through this queue, so each
 * starts only after the last has ended, and the same line asked for again while it is still waiting, being said or within `gapMs`
 * of its end is not said a second time (one line per event). say(ln, ...rest) -> the promise of that line's end.
 *   const q = sayQueue((ln, ...rest) => api.say(ln, ...rest), { now: () => Date.now(), gapMs: 1000 })
 */
export function sayQueue(sayFn, { now = () => Date.now(), gapMs = 1000 } = {}) {
  let tail = Promise.resolve();
  let last = null; // {ln, done: promise, end: ms | null}
  return function say(ln, ...rest) {
    if (!ln) return Promise.resolve();
    if (last && last.ln === ln && (last.end == null || now() - last.end < gapMs)) return last.done;
    const entry = { ln, end: null };
    entry.done = tail
      .then(() => sayFn(ln, ...rest))
      .catch(() => {})
      .then(() => {
        entry.end = now();
      });
    tail = entry.done;
    last = entry;
    return entry.done;
  };
}

/**
 * The faults in a list of said lines [{text, a (start ms), b (end ms)}] in the order they started: a line said again within 1 s of
 * its own end (twice for one event), two lines at once (one starting before the last has ended), a line with no length at all.
 */
export function voiceFaults(list, { gapMs = 1000, slackMs = 30 } = {}) {
  const out = [];
  const lastOf = new Map();
  let prev = null;
  for (const e of list) {
    if (e.b != null && e.b - e.a < 1) out.push({ kind: "zero", text: e.text, at: e.a });
    const p = lastOf.get(e.text);
    if (p && p.b != null && e.a - p.b < gapMs) out.push({ kind: "twice", text: e.text, at: e.a });
    if (prev && (prev.b == null || e.a < prev.b - slackMs)) out.push({ kind: "overlap", text: e.text, over: prev.text, at: e.a });
    lastOf.set(e.text, e);
    if (!prev || prev.b == null || (e.b != null && e.b > prev.b)) prev = e;
  }
  return out;
}
