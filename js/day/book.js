/*
 * The evening book (Zafar 19-20 Oct, docs/sprints/S09-a-day-at-nanis.md; build/reports/s09a-fable-review.md sections 2-3): Nani in
 * her armchair by the fire in the little library greets the child ("What did we do today?"); the camera eases to her face, turns down
 * to the open book on her lap (facing the child, as if she reads to them) and zooms onto its pages, dissolving to the pages view
 * early in the tilt. Each game (js/day/book-play.js: find it, name it, stick in the photo, our day) sits on the two pages, a page
 * turn between them (a curl from the right page's bottom corner, the 64 px corner the child taps). At the end the book closes and
 * the camera pulls back out to the room: a new day-book stands on the empty shelf (one per day played), today's words as gold
 * cards, goodnight, and tomorrow's door by its sky. No player character, no stars, no scores (non-negotiable 12).
 *
 * On a phone the book is scaled to the screen's width, not the picture to its height (pages at least 320 px wide at 844x390, the
 * border may clip): no sidebar, Nani's replay is her round face on the left page's corner, every button at least 64 px.
 *
 * It reads what the modes already keep: the day log (js/core/log.js: today's entries) and the words met today (the save's words),
 * never a list of its own. data/day-book.json holds the places, the games and the lines (loaded only here, decision 68).
 *   ?log=kitchen|clinic|farm   the book after such a day, in memory only (labs, tests); ?game=find|nameit|photo|ourday one game alone
 *   (the camera skipped); ?seed=N the same book again
 *
 *   await runBook(el, api, day)
 * window.Day.book = {plan, results: [{game, key, firstTry}], stage}: the tests' read-only view (build/sandbox/flows/day.mjs)
 */
import { paintSky, shapes } from "./sky.js";
import { planBook, linesFor, bookWords } from "./book-games.js";
import { runGame } from "./book-play.js";

const todayDate = () => new Date().toISOString().slice(0, 10);

/** Today's word ids, in the order they happened: the day log's entries (what, who), then the words met today. */
export function todaysWords({ entries = [], met = [], lexOf = () => null, max = 8 } = {}) {
  const out = [];
  const seen = new Set();
  const add = (id, from) => {
    if (!id) return;
    const e = lexOf(String(id));
    if (!e || seen.has(e.id) || !/^(N|PN)$/.test(e.pos)) return;
    seen.add(e.id);
    out.push({ id: e.id, src: String(id), from });
  };
  entries.forEach((x) => {
    if (x.type === "round") return;
    add(x.what, x.type);
    add(x.who, x.type);
  });
  met.forEach((id) => add(id, "met"));
  return out.slice(0, max);
}

const el = (tag, cls, parent) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (parent) parent.appendChild(e);
  return e;
};

export async function runBook(host, api, day) {
  const { core, url, E } = api;
  api.test.state("day/book");
  api.test.expect(() => ({ kind: "wait" }));
  window.Day.stage = "book";
  const D = await fetch(url("data/day-book.json")).then((r) => r.json());
  const A = D.art;
  const C = D.camera;

  // ---- what happened today ----
  const logKey = api.q.get("log");
  const fixture = logKey && D.lab[logKey];
  const only = api.q.get("game");
  let entries = [];
  let met = [];
  let activity = (day && (day.activity === "trip" ? day.trip || "farm" : day.activity)) || "kitchen";
  if (fixture) {
    entries = fixture.entries || [];
    met = fixture.words || [];
    activity = fixture.activity || logKey;
  } else if (only && !logKey) {
    const f = D.lab[api.q.get("place") === "kitchen" ? "kitchen" : "farm"];
    entries = f.entries;
    met = f.words;
    activity = f.activity;
  } else {
    const today = todayDate();
    entries = core.log.days().filter((d) => d.date === today).flatMap((d) => d.entries || []);
    const words = core.save.get("words") || {};
    met = Object.keys(words).filter((id) => words[id] && words[id].last && new Date(words[id].last).toISOString().slice(0, 10) === today);
  }
  const placeKey = D.activityPlace[activity] || "farm";
  const place = D.places[placeKey];
  const lexOf = (id) => E.linearizer.lexOf(id);
  const wordOf = (k) => place.things[k].word;
  const sameWord = (a, b) => {
    const x = lexOf(a);
    const y = lexOf(b);
    return !!(x && y && x.id === y.id);
  };
  const sayable = (k) => {
    try {
      return !!E.check({ fn: "Item", kind: wordOf(k) }).ok;
    } catch (e) {
      return false;
    }
  };
  const plan = planBook({ data: D, place: placeKey, today: { entries, words: met }, say: sayable, rng: api.rng, only });
  const results = [];
  window.Day.book = { plan, results, stage: "room", place: placeKey };

  // ---- lines: the first candidate the engine can say, else the first one's grey placeholder (decision 84) ----
  let game = null;
  const enOf = (t) => {
    const e = lexOf(t.word) || {};
    return String(e.gloss || t.word).split(/[,(]/)[0].trim();
  };
  const lineOf = (list, key) => {
    const thing = key ? place.things[key] : null;
    const cands = linesFor(list, thing, enOf);
    let first = null;
    for (const c of cands) {
      const ln = api.line(c);
      if (!first) first = ln;
      if (ln && ln.ok) return ln;
    }
    return first;
  };
  const line = (spec, key) => {
    if (Array.isArray(spec) && spec[0] === "sentence") {
      const S = place[game].sentence;
      return lineOf(S[spec[1]] || S.default, key);
    }
    return lineOf(D.lines[spec], key);
  };

  // ---- the room: Nani by the fire, the camera over it ----
  const root = el("div", "day-root day-book-scene", host);
  const cam = el("div", "day-cam", root);
  const room = el("img", "day-room", cam);
  room.alt = "";
  room.src = url(A.room);
  const shelf = el("div", "day-shelf", cam);
  const books = Math.max(0, Number((core.save.get("story") || {}).dayBooks) || 0);
  const S = A.shelf;
  const addSpine = (i, fresh) => {
    const s = el("i", `day-spine${fresh ? " fresh" : ""}`, shelf);
    s.style.left = `${S.x + i * (S.w + S.gap)}px`;
    s.style.top = `${S.y - S.h}px`;
    s.style.width = `${S.w}px`;
    s.style.height = `${S.h - (i % 3) * 6}px`;
    s.style.marginTop = `${(i % 3) * 6}px`;
    s.style.background = S.colours[i % S.colours.length];
    return s;
  };
  for (let i = 0; i < Math.min(books, S.max - 1); i++) addSpine(i, false);
  const [RW, RH] = A.roomSize;
  let shot = C.wide;
  const place3 = (v, ms = 0) => {
    shot = v;
    const vw = root.clientWidth;
    const vh = root.clientHeight;
    const base = Math.max(vw / RW, vh / RH);
    const sc = base * v.zoom;
    let tx = vw / 2 - v.cx * sc;
    let ty = vh / 2 - v.cy * sc;
    tx = Math.min(0, Math.max(vw - RW * sc, tx));
    ty = Math.min(0, Math.max(vh - RH * sc, ty));
    cam.style.transition = ms ? `transform ${ms / api.speed}ms cubic-bezier(.45,.05,.35,1)` : "none";
    cam.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
  };
  cam.style.width = `${RW}px`;
  cam.style.height = `${RH}px`;
  place3(C.wide);

  // Nani's line in the room: one card, top left
  const roomSay = el("div", "day-lines day-roomline", root);
  const sayRoom = async (ln) => {
    roomSay.innerHTML = "";
    if (!ln) return;
    const r = api.render(ln);
    roomSay.appendChild(r);
    await api.say(ln, { el: r, who: "nani" });
  };

  // ---- the book: the pages picture, the two pages, her face on the left page's corner, the turn corner ----
  const book = el("div", "day-book", root);
  book.style.backgroundImage = `url("${url(A.pages)}")`;
  const [BW, BH] = A.pagesSize;
  const pg = { l: el("div", "day-pg-box l", book), r: el("div", "day-pg-box r", book) };
  const headRow = el("div", "day-head", book);
  const face = el("button", "day-face", headRow);
  face.type = "button";
  face.setAttribute("aria-label", "");
  const faceImg = el("img", "", face);
  faceImg.alt = "";
  faceImg.src = url(A.face);
  const headLine = el("div", "day-head-line", headRow);
  const turnBtn = el("button", "day-turn", book);
  turnBtn.type = "button";
  turnBtn.setAttribute("aria-label", "");
  turnBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg>';
  let current = null;
  face.addEventListener("click", () => {
    if (!current) return;
    face.classList.add("on");
    api.say(current, { el: headLine.firstChild && headLine.firstChild.classList.contains("day-line") ? headLine.firstChild : null, who: "nani", min: false }).then(() => face.classList.remove("on"));
  });

  const layout = () => {
    const vw = root.clientWidth;
    const vh = root.clientHeight;
    let s;
    let ox;
    let oy;
    if (vh < 500) {
      // a phone: the pages fill the screen (the book's border may clip), scaled by the pages box, not the picture
      const [px, py, pw, ph] = A.phoneBox;
      s = Math.min((vw - 16) / pw, (vh - 8) / ph);
      ox = (vw - pw * s) / 2 - px * s;
      oy = (vh - ph * s) / 2 - py * s;
    } else {
      s = Math.min((vw - 48) / BW, (vh - 48) / BH);
      ox = (vw - BW * s) / 2;
      oy = (vh - BH * s) / 2;
    }
    Object.assign(book.style, { left: `${ox}px`, top: `${oy}px`, width: `${BW * s}px`, height: `${BH * s}px` });
    for (const side of ["l", "r"]) {
      const [x, y, w, h] = side === "l" ? A.pageL : A.pageR;
      Object.assign(pg[side].style, { left: `${x * s}px`, top: `${y * s}px`, width: `${w * s}px`, height: `${h * s}px` });
      pg[side].style.setProperty("--pg-h", `${h * s}px`);
      pg[side].style.setProperty("--pg-w", `${w * s}px`);
    }
    const [lx, ly, lw] = A.pageL;
    Object.assign(headRow.style, { left: `${lx * s + 8}px`, top: `${ly * s + 8}px`, maxWidth: `${lw * s - 16}px` });
    const [rx, ry, rw, rh] = A.pageR;
    Object.assign(turnBtn.style, { left: `${(rx + rw) * s - 64}px`, top: `${(ry + rh) * s - 64}px` });
    book.style.setProperty("--s", String(s));
    place3(shot);
    if (window.FitText) window.FitText.run(book);
  };
  layout();
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => layout()) : null;
  if (ro) ro.observe(root);

  // ---- the game's context (book-play.js) ----
  const cleanups = [];
  let keepTurn = null;
  const thingEl = (key, { photo = false } = {}) => {
    const t = place.things[key];
    if (t.art) {
      const im = document.createElement("img");
      im.alt = "";
      im.draggable = false;
      im.src = url(t.art);
      im.onerror = () => im.replaceWith(shapes(D.shapes.plain, 200, 200, "day-shape"));
      return im;
    }
    const sv = shapes(D.shapes[t.shape] || D.shapes.plain, 200, 200, "day-shape");
    sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
    if (photo) sv.classList.add("on-photo");
    return sv;
  };
  const backdrop = (id, side) => {
    const B = D.backdrops[id] && D.backdrops[id][side];
    if (!B) return null;
    const box = el("div", "day-backdrop");
    if (B.art) {
      const im = el("img", "", box);
      im.alt = "";
      im.src = url(B.art);
    } else box.appendChild(shapes(B.shapes, 600, 640));
    return box;
  };
  const head = (ln) => {
    current = ln || null;
    headLine.innerHTML = "";
    if (ln) headLine.appendChild(api.render(ln));
    if (window.FitText) window.FitText.run(headRow);
  };
  let turnOn = false;
  const showTurn = (on) => {
    turnOn = !!on;
    turnBtn.classList.toggle("in", turnOn);
  };
  const g = {
    api,
    data: D,
    place,
    book,
    wordOf,
    sameWord,
    thing: thingEl,
    backdrop,
    line,
    head,
    headLine: () => (headLine.firstChild && headLine.firstChild.classList.contains("day-line") ? headLine.firstChild : null),
    say: (ln, node, o = {}) => api.say(ln, Object.assign({ el: node === undefined ? g.headLine() : node, who: "nani" }, o)),
    expect: (fn) => api.test.expect(fn),
    state: (s) => {
      window.Day.book.last = s;
      try {
        if (window.njgTest && window.njgTest.mark) window.njgTest.mark(s);
      } catch (e) {
        /* the hook is the sandbox's */
      }
    },
    record: (r) => results.push(r),
    turnOn: (on) => showTurn(on),
    keepTurnBy: (fn) => (keepTurn = fn),
    cleanup: (fn) => cleanups.push(fn),
  };

  const mount = (p) => {
    for (const side of ["l", "r"]) pg[side].innerHTML = "";
    const wrap = el("div", "day-game", book);
    book.insertBefore(wrap, headRow);
    for (const side of ["l", "r"]) {
      const d = el("div", `day-pg ${side}`, wrap);
      d.style.cssText = pg[side].style.cssText;
    }
    g.wrap = wrap;
    g.L = wrap.querySelector(".day-pg.l");
    g.R = wrap.querySelector(".day-pg.r");
    game = p.game;
    return wrap;
  };
  // keep the game's pages on the page boxes when the screen changes
  const relayGame = () => {
    if (!g.wrap) return;
    for (const side of ["l", "r"]) {
      const d = g.wrap.querySelector(`.day-pg.${side}`);
      if (d) d.style.cssText = pg[side].style.cssText;
    }
  };
  if (ro) new ResizeObserver(() => relayGame()).observe(book);

  // the page turn: the corner, tapped (or, with a placed photo, only while it is placed)
  const waitTurn = () =>
    new Promise((resolve) => {
      showTurn(true);
      api.test.expect(() => (turnOn ? { kind: "tap", sel: ".day-turn", game: "turn" } : { kind: "wait" }));
      const go = () => {
        if (!turnOn || (keepTurn && !keepTurn())) return;
        turnBtn.removeEventListener("click", go);
        showTurn(false);
        resolve();
      };
      turnBtn.addEventListener("click", go);
    });
  const curl = async () => {
    const c = el("div", "day-curl", book);
    c.style.cssText = pg.r.style.cssText;
    c.style.animationDuration = `${C.turnMs / api.speed}ms`;
    await api.wait(C.turnMs * 0.45);
    if (g.wrap) g.wrap.remove();
    await api.wait(C.turnMs * 0.55);
    c.remove();
  };

  // ---------------------------------------------------------------- the evening
  await api.wait(500);
  const direct = !!only;
  if (!direct) {
    // she greets by the fire, the camera comes to her face, then turns down to the book on her lap and zooms in
    root.classList.add("day-greet");
    await sayRoom(line("greet"));
    window.Day.book.stage = "face";
    place3(C.face, C.toFaceMs);
    await api.wait(C.toFaceMs + 200);
    window.Day.book.stage = "tilt";
    roomSay.innerHTML = "";
    place3(C.book, C.tiltMs);
    await api.wait(C.tiltMs * C.dissolveAt);
  } else place3(C.book);
  book.style.transitionDuration = `${(direct ? 300 : C.dissolveMs) / api.speed}ms`;
  root.classList.add("day-reading");
  book.classList.add("open");
  await api.wait(direct ? 300 : Math.max(C.dissolveMs, C.tiltMs * (1 - C.dissolveAt)));
  window.Day.book.stage = "pages";
  layout();

  for (let i = 0; i < plan.pages.length; i++) {
    const p = plan.pages[i];
    keepTurn = null;
    mount(p);
    api.test.state(`day/book/${p.game}`);
    window.Day.book.page = i;
    await runGame(g, p);
    await waitTurn();
    while (cleanups.length) cleanups.pop()();
    head(null);
    if (i < plan.pages.length - 1) await curl();
    else if (g.wrap) g.wrap.remove();
  }
  api.test.expect(() => ({ kind: "wait" }));
  api.test.state("day/book/end");

  // ---- the end: the book closes, the camera pulls back out to the room ----
  window.Day.book.stage = "out";
  root.classList.add("day-zoom-out");
  book.classList.remove("open");
  book.classList.add("closed");
  root.classList.remove("day-reading");
  place3(C.wide, C.outMs);
  await api.wait(C.outMs);
  if (ro) ro.disconnect();
  // a day-book on the empty shelf (one per day played) ...
  addSpine(Math.min(books, S.max - 1), true);
  if (!fixture && !only && !api.q.get("stage")) core.save.update("story", (s) => ((s.dayBooks = (Number(s.dayBooks) || 0) + 1), s));
  // ... and today's words as gold cards: progress, never a verdict
  const cards = el("div", "day-words", root);
  for (const k of bookWords(plan)) {
    const c = el("div", "day-wordcard", cards);
    const pic = el("div", "day-wordpic", c);
    pic.appendChild(thingEl(k));
    c.appendChild(api.render(api.word(wordOf(k), enOf(place.things[k]))));
  }
  requestAnimationFrame(() => cards.classList.add("in"));
  await api.wait(900);
  await sayRoom(line("goodnight"));
  // tomorrow's door, by its sky
  const next = api.dayDef(((day && day.id) || 1) + 1);
  const tw = api.data.weather[next.weather] || api.data.weather.sunny;
  const prev = el("div", "day-tomorrow", root);
  prev.dataset.weather = next.weather;
  const skyBox = el("div", "day-tomorrow-sky", prev);
  paintSky(skyBox, tw, { w: 400, h: 300, url });
  el("i", "day-tomorrow-door", prev);
  requestAnimationFrame(() => prev.classList.add("in"));
  // the room settles: a slow drift in towards her, the fire and the shelf
  root.classList.add("day-settle");
  place3(C.settle || { cx: 760, cy: 470, zoom: 1.08 }, 4000);
  const tm = line("tomorrow");
  const tl = api.render(tm);
  roomSay.appendChild(tl);
  await api.say(tm, { el: tl, who: "nani" });
  if (!fixture && !only && !api.q.get("stage")) {
    api.setToday({ at: "done" });
    core.save.update("story", (s) => ((s.dayNo = (Number(s.dayNo) || 1) + 1), s));
  }
  api.test.expect(() => ({ kind: "end" }));
  root.dataset.done = "";
  window.Day.book.stage = "end";
  await api.wait(2500);
  if (!fixture && !only && !api.q.get("stage")) api.home();
}
