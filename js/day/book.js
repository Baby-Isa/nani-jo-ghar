/*
 * The evening book (Zafar 19-20 Oct, docs/sprints/S09-a-day-at-nanis.md; build/reports/s09a-fable-review.md sections 2-3): Nani in
 * her armchair by the fire in the little library greets the child ("What did we do today?", the shared speech bubble beside her);
 * the camera eases to her face, turns down to the open book on her lap and zooms onto its pages: the pages picture (b2 v2, the book
 * held out to the child, her chin, dupatta and hands round it: Zafar, 20 Oct) grows from the book in her lap to fill the screen. Each
 * game (js/day/book-play.js: find it, name it, stick in the photo, our day) sits on the two pages, a page turn between them (the
 * right page lifts from its bottom corner and swings over the fold; the 64 px corner the child taps). At the end the pages shrink
 * back into the book on her lap (the room all round, never black): a new day-book flies from her lap onto the empty shelf (one
 * per day played), today's words as gold cards, goodnight, tomorrow's door by its sky as its own card. Camera moves take their
 * real time even at test speed. No player character, no stars, no scores (non-negotiable 12).
 *
 * On a phone the pages picture comes closer than the cover fit so each page is at least 330 px wide (pages at 844x390): no
 * sidebar, Nani's replay is her round face on the left page's corner, every button at least 64 px.
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
  // one stage for the whole evening (day/book/<part>): a page turn is not a stage end
  api.test.state("day/book/load");
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
  const plan = planBook({ data: D, place: placeKey, today: { entries, words: met }, say: sayable, rng: api.q.get("seed") ? api.rng : Math.random, only });
  const results = [];
  // this book's pictures, fetched now (decision 68: only the chosen book's own art, prefetched while she greets)
  for (const k of Object.keys(place.things)) if (place.things[k].art) new Image().src = url(place.things[k].art);
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
    // our day: her line for each photo of the day (the place's `told`)
    if (Array.isArray(spec) && spec[0] === "told") {
      const T = place.told || {};
      return lineOf(T[spec[1]] || T.default, key);
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
  const slotOf = (i) => ({ x: S.x + i * (S.w + S.gap), y: S.y - S.h });
  const addSpine = (i, fresh) => {
    const s = el("i", `day-spine${fresh ? " fresh" : ""}`, shelf);
    const p = slotOf(i);
    Object.assign(s.style, { left: `${p.x}px`, top: `${p.y}px`, width: `${S.w}px`, height: `${S.h}px`, background: S.colours[i % S.colours.length] });
    return s;
  };
  for (let i = 0; i < Math.min(books, S.max - 1); i++) addSpine(i, false);
  const [RW, RH] = A.roomSize;
  // the camera's moves always take their real time (also at test speed): a filmstrip of the camera must see them
  const realWait = (ms) => new Promise((r) => setTimeout(r, ms));
  let shot = C.wide;
  let camAt = { sc: 1, tx: 0, ty: 0 };
  const place3 = (v, ms = 0) => {
    shot = v;
    const vw = root.clientWidth;
    const vh = root.clientHeight;
    const base = Math.max(vw / RW, vh / RH);
    // never closer than the picture holds (ART-05: at most 1.5 screen px per source px, times the pixel ratio)
    const dpr = window.devicePixelRatio || 1;
    const sc = Math.max(base, Math.min(base * v.zoom, ((C.maxUpscale || 1.5) * (room.naturalWidth || RW)) / RW / dpr));
    let tx = vw / 2 - v.cx * sc;
    let ty = vh / 2 - v.cy * sc;
    tx = Math.min(0, Math.max(vw - RW * sc, tx));
    ty = Math.min(0, Math.max(vh - RH * sc, ty));
    camAt = { sc, tx, ty };
    cam.style.transition = ms ? `transform ${ms}ms cubic-bezier(.45,.05,.35,1)` : "none";
    cam.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
  };
  cam.style.width = `${RW}px`;
  cam.style.height = `${RH}px`;
  place3(C.wide);
  /** a point of the room picture on the screen, for the camera's current shot */
  const onScreen = (x, y) => ({ x: camAt.tx + x * camAt.sc, y: camAt.ty + y * camAt.sc });

  // Nani's line in the room: the shared speech bubble (css/shared/conversations.css: cream, the speaker chip to hear it again),
  // beside her head on the side with room, never over her face
  if (!document.querySelector('link[data-day-cv]')) {
    const lk = document.createElement("link");
    lk.rel = "stylesheet";
    lk.href = url("css/shared/conversations.css");
    lk.dataset.dayCv = "";
    document.head.appendChild(lk);
  }
  const cvLayer = el("div", "cv-layer day-cv", root);
  let roomLine = null;
  const bubble = el("div", "cv-bubble cv-say day-bubble", cvLayer);
  bubble.dataset.speaker = "nani";
  const bubbleText = el("span", "cv-text", bubble);
  const spk = el("button", "cv-spk", bubble);
  spk.type = "button";
  spk.setAttribute("aria-label", "");
  spk.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  spk.addEventListener("click", () => {
    if (!roomLine) return;
    bubble.classList.add("speaking");
    api.say(roomLine, { el: bubbleText.firstChild, who: "nani", min: false }).then(() => bubble.classList.remove("speaking"));
  });
  const H = A.head || { x: 512, y: 150, r: 95 };
  const placeBubble = (prefer = "left") => {
    const vw = root.clientWidth;
    const bw = bubble.offsetWidth;
    const bh = bubble.offsetHeight;
    const c = onScreen(H.x, H.y);
    const r = H.r * camAt.sc;
    const leftRoom = c.x - r - 16;
    const rightRoom = vw - (c.x + r) - 16;
    const side = prefer === "left" ? (leftRoom >= Math.min(bw, 200) || leftRoom >= rightRoom ? "left" : "right") : rightRoom >= Math.min(bw, 200) || rightRoom >= leftRoom ? "right" : "left";
    bubble.style.maxWidth = `${Math.max(160, (side === "left" ? leftRoom : rightRoom) - 8)}px`;
    const w = bubble.offsetWidth;
    let x = side === "left" ? c.x - r - 12 - w / 2 : c.x + r + 12 + w / 2;
    x = Math.max(w / 2 + 12, Math.min(vw - w / 2 - 12, x));
    // the shared bubble hangs above its point (translate -50%, -100%): its point is just under the line of her eyes
    const y = Math.max(bh + 24, c.y + bh / 2);
    Object.assign(bubble.style, { left: `${x}px`, top: `${y}px` });
    bubble.dataset.side = side;
  };
  const sayRoom = async (ln, prefer) => {
    roomLine = ln;
    bubbleText.innerHTML = "";
    if (!ln) {
      bubble.classList.remove("in");
      bubble.style.visibility = "hidden";
      return;
    }
    bubble.style.visibility = "";
    const r = api.render(ln, { cls: "day-inline" });
    bubbleText.appendChild(r);
    if (window.FitText) window.FitText.run(bubble);
    placeBubble(prefer);
    bubble.classList.add("in");
    bubble.classList.add("speaking");
    await api.say(ln, { el: r, who: "nani" });
    bubble.classList.remove("speaking");
  };

  // ---- the book: the pages picture (b2: the book held out to the child, her chin, dupatta and hands round it), its two pages,
  // her face on the left page's corner, the turn corner ----
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
  turnBtn.innerHTML = '<i class="day-turn-corner"></i><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg>';
  let current = null;
  face.addEventListener("click", () => {
    if (!current) return;
    face.classList.add("on");
    api.say(current, { el: headLine.firstChild && headLine.firstChild.classList.contains("day-line") ? headLine.firstChild : null, who: "nani", min: false }).then(() => face.classList.remove("on"));
  });

  // the pages picture always covers the screen (no letterbox); on a phone it comes closer so each page is at least minPageW wide
  let bookAt = { s: 1, ox: 0, oy: 0 };
  const layout = () => {
    const vw = root.clientWidth;
    const vh = root.clientHeight;
    const [px, py, pw, ph] = A.pagesBox;
    const cover = Math.max(vw / BW, vh / BH);
    let s = cover;
    if (A.pageL[2] * s < (A.minPageW || 330)) s = Math.max(cover, Math.min((vw - 16) / pw, (vh - 8) / ph, (A.minPageW || 330) / A.pageL[2]));
    let ox = vw / 2 - (px + pw / 2) * s;
    let oy = vh / 2 - (py + ph / 2) * s;
    ox = Math.min(0, Math.max(vw - BW * s, ox));
    oy = Math.min(0, Math.max(vh - BH * s, oy));
    bookAt = { s, ox, oy };
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
    if (shot && shot.onBook) camOnBook(0);
    else place3(shot);
    if (bubble.classList.contains("in")) placeBubble(bubble.dataset.side);
    if (window.FitText) window.FitText.run(book);
  };
  layout();
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => layout()) : null;
  if (ro) ro.observe(root);
  /**
   * The camera on the book in her lap, so close that the room's book lies exactly where the pages picture's book lies on screen
   * (same place, same size: A.lapBook, measured in both pictures). The cross-fade between the two pictures happens only here,
   * between two book-filling views: no box edge, no second Nani (the judge, 20 Oct). This shot is past the room picture's
   * resolution (ART-05), so it is only ever on screen while the camera moves or fades: the room is marked as zooming then
   * (the sandbox's background check waits for a push-in to settle, as it does for the clinic's).
   */
  const camOnBook = (ms = 0) => {
    const [rx, ry, rw] = A.lapBook.room;
    const [bx, by, bw] = A.lapBook.pages;
    const sc = (bw * bookAt.s) / rw;
    const tx = bookAt.ox + bx * bookAt.s - rx * sc;
    const ty = bookAt.oy + by * bookAt.s - ry * sc;
    shot = { onBook: true };
    camAt = { sc, tx, ty };
    cam.style.transition = ms ? `transform ${ms}ms cubic-bezier(.45,.05,.35,1)` : "none";
    cam.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
  };
  const zooming = (on) => root.classList.toggle("cl-zooming", !!on);

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
  // the turn itself: the right page lifts from its bottom corner and swings over the fold onto the left (its real time)
  const curl = async () => {
    window.Day.book.turning = (window.Day.book.turning || 0) + 1;
    book.classList.add("day-turning");
    const c = el("div", "day-curl", book);
    c.style.cssText = pg.r.style.cssText;
    c.style.animationDuration = `${C.turnMs}ms`;
    await realWait(C.turnMs * 0.5);
    if (g.wrap) g.wrap.remove();
    await realWait(C.turnMs * 0.5);
    c.remove();
    book.classList.remove("day-turning");
  };

  // ---------------------------------------------------------------- the evening
  // the room is up: the evening's first moment (BOOK-01 films from here)
  await new Promise((r) => (room.complete ? r() : (room.onload = room.onerror = r)));
  api.test.state("day/book/room");
  await api.wait(500);
  const direct = !!only;
  if (!direct) {
    // she greets by the fire, the camera comes to her face, turns down to the book on her lap ...
    await sayRoom(line("greet"), "left");
    window.Day.book.stage = "face";
    place3(C.face, C.toFaceMs);
    bubble.classList.remove("in");
    setTimeout(() => (bubble.style.visibility = "hidden"), 250);
    await realWait(C.toFaceMs + 150);
    window.Day.book.stage = "tilt";
    place3(C.book, C.tiltMs);
    await realWait(C.tiltMs);
    // ... and zooms in until her book fills the screen, lined up with the pages picture's book; then the two cross-fade (short:
    // her hands and dupatta differ a little between the two pictures)
    window.Day.book.stage = "onto";
    layout();
    zooming(true);
    camOnBook(C.inMs);
    await realWait(C.inMs);
    book.style.transform = "none";
    book.style.transition = `opacity ${C.fadeMs}ms ease-in-out`;
    book.classList.add("open");
    book.style.opacity = "1";
    await realWait(C.fadeMs);
    // the room behind the pages goes back to the whole room (hidden behind the pages, ready for the way out)
    place3(C.wide);
    zooming(false);
  } else {
    place3(C.wide);
    book.classList.add("open");
    book.style.opacity = "1";
    await api.wait(300);
  }
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

  // ---- the end: the same in reverse: the room's book lined up behind the pages, a short cross-fade to it, then the camera pulls
  // back out to the whole room (never black, never a box) ----
  window.Day.book.stage = "out";
  headRow.style.visibility = "hidden";
  zooming(true);
  camOnBook(0);
  root.classList.add("day-zoom-out");
  book.style.transition = `opacity ${C.fadeMs}ms ease-in-out`;
  book.style.opacity = "0";
  await realWait(C.fadeMs);
  book.classList.remove("open");
  place3(C.wide, C.outMs);
  await realWait(C.outMs);
  zooming(false);
  if (ro) ro.disconnect();
  // a day-book for today goes from her lap onto the empty shelf (one per day played) ...
  const slot = Math.min(books, S.max - 1);
  const spine = addSpine(slot, true);
  const to = slotOf(slot);
  const [lx, ly, lw, lh] = A.lapBook.room;
  spine.style.transform = `translate(${lx + lw / 2 - to.x - S.w / 2}px, ${ly + lh / 2 - to.y - S.h / 2}px) scale(1.6) rotate(-14deg)`;
  void spine.offsetWidth;
  spine.classList.add("go");
  spine.style.transform = "none";
  if (!fixture && !only && !api.q.get("stage")) core.save.update("story", (s) => ((s.dayBooks = (Number(s.dayBooks) || 0) + 1), s));
  await realWait(1500);
  spine.classList.add("landed");
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
  await sayRoom(line("goodnight"), "left");
  // tomorrow's door, by its sky: its own card, clear of the fire and the shelf
  const next = api.dayDef(((day && day.id) || 1) + 1);
  const tw = api.data.weather[next.weather] || api.data.weather.sunny;
  const prev = el("div", "day-tomorrow", cards);
  prev.dataset.weather = next.weather;
  const win = el("div", "day-tomorrow-win", prev);
  const skyBox = el("div", "day-tomorrow-sky", win);
  paintSky(skyBox, tw, { w: 400, h: 300, url });
  el("i", "day-tomorrow-door", win);
  el("i", "day-tomorrow-step", prev);
  requestAnimationFrame(() => prev.classList.add("in"));
  const tm = line("tomorrow");
  await sayRoom(tm, "left");
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
