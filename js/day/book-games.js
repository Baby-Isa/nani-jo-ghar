/*
 * The evening book's games, planned (pure: no page, Node-testable; build/leak_book.mjs and build/test_day_book.mjs read the same
 * plan the page plays). data/day-book.json says what each place holds; the day log says what happened today. The leak rules
 * (build/reports/s09a-fable-review.md section 2, Zafar 20 Oct) live here, once:
 *   find it        she asks for FEWER things than are shown (2 of 4), only today's words; the things are dealt to the spots at random
 *   name it        three identical speaker buttons in a random order; the right word never said first; a page's decoys are today's
 *                  words, and a word that was the answer on an earlier page is never on a later page (so elimination across pages
 *                  learns nothing)
 *   stick in       three unlabelled photos of today's things in a random order; one asked per page; an earlier answer never comes back
 *   our day        today's things in the day's order; not scored
 *
 *   planBook({data, place, today, say, rng, only}) -> {place, pages: [{game, ...}]}
 *   todayThings(place, {entries, words}) -> the place's thing keys met today, in the day's order
 *   fill(meaning, thing) -> the meaning with "{x}" (the thing's Item) and "{word}" (its lexicon id) put in
 */

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
 * The book's pages. data: data/day-book.json; place: its key; today: {entries, words}; say(thing key) -> can the engine name it;
 * only: one game (the lab's ?game=). Each page: {game, ...} (see the header).
 */
export function planBook({ data, place: placeKey, today = {}, say = () => true, rng = Math.random, only = null } = {}) {
  const place = data.places[placeKey];
  if (!place) throw new Error(`book: no place "${placeKey}"`);
  const met = todayThings(place, today);
  // today's things the engine can say; when the log holds too few (a short day), the place's own fill the rest (still this place's)
  const pool = (list, n) => {
    const own = (list || []).filter((k) => place.things[k] && say(k));
    const first = own.filter((k) => met.includes(k));
    return first.length >= n ? first : [...first, ...own.filter((k) => !first.includes(k))];
  };
  const order = only ? (only === "nameit" || only === "photo" ? [only, only] : [only]) : data.order;
  const pages = [];
  const used = { nameit: [], photo: [] };
  for (const game of order) {
    if (game === "find") {
      const F = place.find;
      const shown = pool(F.shown, F.shown.length).slice(0, F.spots.length);
      if (shown.length < 3) continue;
      const spots = shuffle(F.spots, rng);
      const ask = Math.min(F.ask || 2, shown.length - 2); // always fewer asked than shown (by two)
      const asks = shuffle(shown.filter((k) => met.length === 0 || met.includes(k)), rng).slice(0, ask);
      if (!asks.length) continue;
      pages.push({ game, backdrop: F.backdrop, things: shown.map((k, i) => ({ key: k, spot: spots[i] })), asks });
    } else if (game === "nameit" || game === "photo") {
      const G = place[game];
      const all = pool(G.pool, 3);
      const left = all.filter((k) => !used[game].includes(k));
      if (left.length < 3) continue;
      const answer = left[Math.floor(rng() * left.length)];
      const decoys = shuffle(left.filter((k) => k !== answer), rng).slice(0, 2);
      used[game].push(answer);
      pages.push({ game, answer, choices: shuffle([answer, ...decoys], rng) });
    } else if (game === "ourday") {
      const list = (place.ourday || []).filter((k) => place.things[k] && say(k));
      const ordered = [...met.filter((k) => list.includes(k)), ...list.filter((k) => !met.includes(k))];
      if (ordered.length < 2) continue;
      pages.push({ game, things: ordered.slice(0, 5) });
    }
  }
  return { place: placeKey, met, pages };
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
