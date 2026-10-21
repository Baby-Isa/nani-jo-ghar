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
  // each picture once, decoded: a page shows only when all of its pictures are ready (never a late pop-in)
  const pics = new Map();
  const pic = (p) => {
    if (!p) return Promise.resolve();
    if (!pics.has(p))
      pics.set(
        p,
        new Promise((ok) => {
          const im = new Image();
          im.onload = im.onerror = () => (im.decode ? im.decode().catch(() => {}).then(ok) : ok());
          im.src = url(p);
        }),
      );
    return pics.get(p);
  };
  const picsOf = (p) => {
    const keys = [].concat(p.things ? p.things.map((t) => (typeof t === "string" ? t : t.key)) : [], p.choices || [], p.answer ? [p.answer] : []);
    const bd = p.backdrop && D.backdrops[p.backdrop];
    const list = keys.map((k) => place.things[k] && place.things[k].art).concat(bd && bd.art ? [bd.art] : []);
    return Promise.race([Promise.all(list.map(pic)), new Promise((r) => setTimeout(r, 4000))]);
  };
  for (const k of Object.keys(place.things)) pic(place.things[k].art);
  [A.room, A.pages, A.faceShot && A.faceShot.art].forEach(pic);
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
  // her face close up by the fire (A.faceShot), laid over the room picture lined up on her eyes: its place in the room's pixels
  const FS = A.faceShot || null;
  let FR = null;
  let close = null;
  if (FS) {
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = dist(...FS.eyes.room) / dist(...FS.eyes.face); // room px per close-up px
    const rm = mid(...FS.eyes.room);
    const fm = mid(...FS.eyes.face);
    FR = { k, x: rm[0] - fm[0] * k, y: rm[1] - fm[1] * k, w: FS.size[0] * k, h: FS.size[1] * k };
    close = el("img", "day-close", cam);
    close.alt = "";
    close.draggable = false;
    close.src = url(FS.art);
    Object.assign(close.style, { left: `${FR.x}px`, top: `${FR.y}px`, width: `${FR.w}px`, height: `${FR.h}px` });
    close.style.setProperty("--feather", `${(FS.feather || 0.05) * 100}%`);
  }
  // the camera's moves always take their real time (also at test speed): a filmstrip of the camera must see them
  const realWait = (ms) => new Promise((r) => setTimeout(r, ms));
  // the camera: one transform over the room picture (and the close-up laid on it); every move one ease, so the camera and the
  // pages picture moving with it stay locked together
  const EASE = "cubic-bezier(.45,.05,.35,1)";
  let shot = "wide";
  let camAt = { sc: 1, tx: 0, ty: 0 };
  const setCam = (c, ms = 0) => {
    camAt = c;
    cam.style.transition = ms ? `transform ${ms}ms ${EASE}` : "none";
    cam.style.transform = `translate(${c.tx}px, ${c.ty}px) scale(${c.sc})`;
  };
  /** a shot of the room picture: a centre in its pixels and a zoom over the cover fit */
  const wideCam = (v) => {
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
    return { sc, tx, ty };
  };
  const place3 = (v, ms = 0) => {
    shot = "wide";
    setCam(wideCam(v), ms);
  };
  /** the face shot: the close-up covering the screen inside its feathered edge (C.face: a centre in its pixels, a zoom) */
  const faceCam = () => {
    const vw = root.clientWidth;
    const vh = root.clientHeight;
    const [FW, FH] = FS.size;
    const f = FS.feather || 0.05;
    const iw = FW * (1 - 2 * f);
    const ih = FH * (1 - 2 * f);
    const z = Math.max(vw / iw, vh / ih) * ((C.face && C.face.zoom) || 1); // screen px per close-up px
    let tx = vw / 2 - C.face.cx * z;
    let ty = vh / 2 - C.face.cy * z;
    tx = Math.min(-f * FW * z, Math.max(vw - (f * FW + iw) * z, tx));
    ty = Math.min(-f * FH * z, Math.max(vh - (f * FH + ih) * z, ty));
    // room px -> screen: tx + z (room - FR.x) / FR.k
    const sc = z / FR.k;
    return { sc, tx: tx - sc * FR.x, ty: ty - sc * FR.y };
  };
  // the pages picture laid under the close-up (A.faceShot.pagesIn: its spine and top edge on the close-up's), in room px
  const P2R = FS
    ? (() => {
        const PI = FS.pagesIn;
        return { s: FR.k * PI.q, x: FR.x + FR.k * (PI.spine.face[0] - PI.q * PI.spine.pages[0]), y: FR.y + FR.k * (PI.spine.face[1] - PI.q * PI.spine.pages[1]) };
      })()
    : null;
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
    if (shot === "pages" && FS) setCam(pagesCam());
    else if (shot === "face" && FS) setCam(faceCam());
    else place3(C.wide);
    if (bubble.classList.contains("in")) placeBubble(bubble.dataset.side);
    if (window.FitText) window.FitText.run(book);
  };
  /**
   * The camera with the pages picture at rest lined up under the close-up (A.faceShot.pagesIn): the close-up's book edge runs on
   * into the pages' book, so the turn down from her face lands on the very pages the games use, over the same part of the room
   * it passed through (the judge, 20 Oct: never a dissolve to a different crop). The room is past its resolution here (ART-05)
   * and only ever on screen while the camera moves: it is marked as zooming then (the sandbox's background check waits).
   */
  function pagesCam() {
    const sc = bookAt.s / P2R.s;
    return { sc, tx: bookAt.ox - sc * P2R.x, ty: bookAt.oy - sc * P2R.y };
  }
  /** the pages picture's transform (over its place at rest) that lays it under the close-up for a camera `c` */
  const bookTo = (c) => `translate(${c.tx + c.sc * P2R.x - bookAt.ox}px, ${c.ty + c.sc * P2R.y - bookAt.oy}px) scale(${(c.sc * P2R.s) / bookAt.s})`;
  layout();
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => layout()) : null;
  if (ro) ro.observe(root);
  const zooming = (on) => root.classList.toggle("njg-zooming", !!on);

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
    const SP = D.backdrops[id];
    if (SP && SP.art && SP.size) {
      // one picture across both pages (s09b): laid over the two page frames as if the fold were not there, each page showing its
      // own part (the middle strip falls in the fold); `top` picks the band that shows
      const [lx, ly, lw, lh] = A.pageL;
      const [rx, ry, rw, rh] = A.pageR;
      const [PW, PH] = SP.size;
      const k = (rx + rw - lx) / PW; // pages px per picture px
      const y0 = ly - (SP.top || 0) * (PH * k - lh); // where the picture's top edge lies (pages px)
      const [px, py, pw, ph] = side === "l" ? [lx, ly, lw, lh] : [rx, ry, rw, rh];
      const box = el("div", "day-backdrop day-spread");
      const im = el("img", "", box);
      im.alt = "";
      im.draggable = false;
      im.src = url(SP.art);
      Object.assign(im.style, { position: "absolute", left: `${((lx - px) / pw) * 100}%`, top: `${((y0 - py) / ph) * 100}%`, width: `${((PW * k) / pw) * 100}%`, height: `${((PH * k) / ph) * 100}%`, maxWidth: "none" });
      return box;
    }
    const B = SP && SP[side];
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
  // the close-up, the pages and the first page's pictures before the camera sets off (it never lands on a half-drawn page)
  await Promise.race([Promise.all([pic(A.pages), FS && pic(FS.art), plan.pages[0] && picsOf(plan.pages[0])]), realWait(4000)]);
  api.test.state("day/book/room");
  await api.wait(500);
  const direct = !!only;
  if (!direct) {
    // she greets by the fire, the camera comes to her face, turns down to the book on her lap ...
    await sayRoom(line("greet"), "left");
    // the push-in to her face: the room grows, her close-up (lined up on her eyes) fades in over it as it comes, sharp
    window.Day.book.stage = "face";
    zooming(true);
    bubble.classList.remove("in");
    setTimeout(() => (bubble.style.visibility = "hidden"), 250);
    shot = "face";
    close.style.transition = `opacity ${C.toFaceMs * 0.42}ms ease-in-out ${C.toFaceMs * 0.55}ms`;
    close.style.opacity = "1";
    setCam(faceCam(), C.toFaceMs);
    await realWait(C.toFaceMs + 60);
    // her face, still: only the close-up is on screen (the room under it is hidden, never judged past its resolution)
    room.style.visibility = "hidden";
    zooming(false);
    await realWait(C.holdMs || 500);
    // ... and the turn down to the book: the pages picture laid under the close-up's bottom edge comes up into the screen as the
    // close-up slides up out of it, one move, landing on the pages at rest (the games' own place)
    window.Day.book.stage = "tilt";
    zooming(true);
    layout();
    book.style.transition = "none";
    book.style.transform = bookTo(camAt);
    book.style.opacity = "0";
    void book.offsetWidth;
    shot = "pages";
    book.style.transition = `transform ${C.tiltMs}ms ${EASE}, opacity ${C.tiltMs * 0.45}ms ease-in-out ${C.tiltMs * 0.15}ms`;
    book.style.transform = "none";
    book.style.opacity = "1";
    room.style.visibility = "";
    setCam(pagesCam(), C.tiltMs);
    await realWait(C.tiltMs + 40);
    book.classList.add("open");
    book.style.transition = "none";
    // the room behind the pages goes back to the whole room (hidden behind the pages, ready for the way out)
    close.style.transition = "none";
    close.style.opacity = "0";
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
    await picsOf(p);
    if (plan.pages[i + 1]) picsOf(plan.pages[i + 1]);
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
  root.classList.add("day-zoom-out");
  if (FS) {
    // the turn up to her face: under the pages the camera waits lined up, her close-up showing; the pages slide down out of the
    // screen as the close-up comes down into it ...
    layout();
    shot = "face";
    room.style.visibility = "hidden";
    setCam(pagesCam());
    close.style.transition = "none";
    close.style.opacity = "1";
    void book.offsetWidth;
    const to = faceCam();
    book.style.transition = `transform ${C.upMs}ms ${EASE}, opacity ${C.upMs * 0.45}ms ease-in-out ${C.upMs * 0.4}ms`;
    book.style.transform = bookTo(to);
    book.style.opacity = "0";
    setCam(to, C.upMs);
    await realWait(C.upMs + 40);
    book.classList.remove("open");
    book.style.transition = "none";
    book.style.transform = "none";
    // ... then the pull back to the whole room: the room under her close-up, which fades as the camera goes back
    room.style.visibility = "";
    close.style.transition = `opacity ${C.outMs * 0.5}ms ease-in-out ${C.outMs * 0.05}ms`;
    close.style.opacity = "0";
  } else {
    book.style.opacity = "0";
    book.classList.remove("open");
  }
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
