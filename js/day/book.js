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
import { planBook, linesFor, bookWords, sayQueue, spacedFrom, allThings } from "./book-games.js";
import { runGame } from "./book-play.js";
import { testVoiced, unsaidPlan } from "./day.js";

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
  // every line the book says, one at a time: each starts after the last has ended, and one event says its line once (DAY-02)
  // (each line's start and end on the page's clock in window.Day.book.voice: the tests' read-only view, the day-book flow's check)
  const bookSay = sayQueue((ln, o) => {
    const e = { text: String(ln.text || ln.en || ""), a: performance.now(), b: null };
    const B = window.Day.book;
    if (B) (B.voice = B.voice || []).push(e);
    return Promise.resolve(api.say(ln, o)).finally(() => (e.b = performance.now()));
  });
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
  let history = null;
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
    // the spaced words (S12 decision 9, Zafar 23 Oct): what the child met 1, 3 and 7 days ago comes back in today's book
    history = spacedFrom({ today, days: core.log.days(), words });
  }
  const placeKey = D.activityPlace[activity] || "farm";
  // the place's things, and every other place's (a spaced word from another day's place brings its own picture)
  const place = Object.assign({}, D.places[placeKey], { things: allThings(D, placeKey) });
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
  const plan = planBook({ data: D, place: placeKey, today: { entries, words: met }, history, say: sayable, rng: api.q.get("seed") ? api.rng : Math.random, only });
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
  for (const k of plan.pages.flatMap((p) => [].concat(p.things || [], p.choices || [], p.answer || []))) if (place.things[k]) pic(place.things[k].art);
  [A.room, A.pages, A.faceShot && A.faceShot.art, ...((A.turn && A.turn.frames) || [])].forEach(pic);
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
  // BOOK-10: the evening opens on the book: the room is only the way out (shown as the pages go back down)
  room.style.visibility = "hidden";
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
    // its soft edge (a share of each side): two crossed fades, the mask's alpha only
    const fe = `${(FS.feather || 0.05) * 100}%`;
    const fade = (dir) => `linear-gradient(to ${dir}, transparent 0, black ${fe}, black calc(100% - ${fe}), transparent 100%)`;
    close.style.webkitMaskImage = `${fade("right")}, ${fade("bottom")}`;
    close.style.webkitMaskComposite = "source-in";
    close.style.maskImage = `${fade("right")}, ${fade("bottom")}`;
    close.style.maskComposite = "intersect";
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
    bookSay(roomLine, { el: bubbleText.firstChild, who: "nani" }).then(() => bubble.classList.remove("speaking"));
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
    await bookSay(ln, { el: r, who: "nani" });
    bubble.classList.remove("speaking");
  };

  // ---- the book: the pages picture (b2: the book held out to the child, her chin, dupatta and hands round it), its two pages,
  // her face on the left page's corner, the turn corner ----
  const book = el("div", "day-book", root);
  book.style.backgroundImage = `url("${url(A.pages)}")`;
  const [BW, BH] = A.pagesSize;
  const pg = { l: el("div", "day-pg-box l", book), r: el("div", "day-pg-box r", book) };
  const headRow = el("div", "day-head", book);
  headRow.style.visibility = "hidden"; // (her face shows only with a line: never the circle alone)
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
    bookSay(current, { el: headLine.firstChild && headLine.firstChild.classList.contains("day-line") ? headLine.firstChild : null, who: "nani" }).then(() => face.classList.remove("on"));
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
  /** while the pages come up under her close-up (or go back down), their top edge is soft: no hard line across her chin. The
   * soft band lies above the screen once the pages are at rest (never a jump when it goes) */
  const softTop = (on) => {
    const f = on ? Math.max(12, Math.min(80 * bookAt.s, -bookAt.oy)) : 0;
    const m = on ? `linear-gradient(to bottom, transparent 0, black ${f.toFixed(1)}px)` : "";
    book.style.webkitMaskImage = m;
    book.style.maskImage = m;
  };

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
  // her face and her card show together and only with a line on a page that is showing: never the circle alone, never a blank card
  let headHeld = true;
  const showHead = () => {
    if (headHeld || !current) return;
    const ln = current;
    // (with its words already drawn: two frames after the line is laid out)
    requestAnimationFrame(() => requestAnimationFrame(() => current === ln && !headHeld && (headRow.style.visibility = "")));
  };
  const head = (ln) => {
    current = ln || null;
    headLine.innerHTML = "";
    if (ln) headLine.appendChild(api.render(ln));
    if (window.FitText) window.FitText.run(headRow);
    headRow.style.visibility = "hidden";
    showHead();
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
    // (a page built before it shows speaks only once it shows: g.go)
    go: Promise.resolve(),
    say: (ln, node, o = {}) => g.go.then(() => bookSay(ln, Object.assign({ el: node === undefined ? g.headLine() : node, who: "nani" }, o))),
    // a speaker the child taps (BOOK-13, F8: "when I click the sound icon, nothing plays"): said at once, cutting her line short
    // (never queued behind it), and again on every tap (never dropped as a repeat)
    // (js/core/voice.js's interjection, over: true: the line playing pauses, the word plays, the line carries on; never a stop,
    // which would leave a paused line's promise waiting for ever and the book's one queue with it)
    sayNow: (ln, node) => {
      if (!ln) return Promise.resolve();
      const vpath = core.voice.path ? core.voice.path() : "test";
      const res = ln.ok ? testVoiced(ln.result, vpath) : ln.en ? unsaidPlan(ln.en, vpath) : null;
      if (!res) return Promise.resolve();
      const B = window.Day.book;
      if (B) (B.now = B.now || []).push({ text: String(ln.text || ln.en || ""), a: performance.now() });
      if (node) node.classList.add("on");
      return Promise.resolve(core.voice.say(res, { over: true }))
        .catch(() => {})
        .finally(() => node && node.classList.remove("on"));
    },
    wordLn: (k) => api.word(wordOf(k), enOf(place.things[k])),
    /** the word's progress stage (1-5; data/progress.json support): its card's slots fade by it */
    stageOf: (k) => {
      try {
        return Math.max(1, Math.min(5, Number(core.progress && core.progress.stage ? core.progress.stage(wordOf(k)) : 1) || 1));
      } catch (e) {
        return 1;
      }
    },
    progress: core.progress,
    url,
    kit: () => api.kit(),
    helpDue: (id) => api.helpDue(id),
    helped: (id) => api.helped(id),
    // (the tests act only once the page shows: a hidden page takes no touch)
    expect: (fn) => api.test.expect(() => (g.hidden ? { kind: "wait" } : fn())),
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
  // the turn itself (its real time). ART-27 (Zafar, 22 Oct F7: "maybe we can get ChatGPT to show the page in various stages of
  // turning"): the art run's four pictures of the book, pg1-pg4 (the right page lifting at 25 degrees, standing at 70, over the
  // fold at 120, landing at 160), each registered on the pages picture and laid over it at A.turn.box, shown in that order with
  // a short cross-fade; the old page's game lifts away with the first, the new one shows as the last settles. Without them, the
  // coded curl (the right page lifts from its bottom corner and swings over the fold)
  const T = A.turn && A.turn.frames && A.turn.frames.length ? A.turn : null;
  const curl = async () => {
    window.Day.book.turning = (window.Day.book.turning || 0) + 1;
    book.classList.add("day-turning");
    if (T) {
      const [bx, by, bw, bh] = T.box;
      const s = bookAt.s;
      const layer = el("div", "day-turnart", book);
      Object.assign(layer.style, { left: `${bx * s}px`, top: `${by * s}px`, width: `${bw * s}px`, height: `${bh * s}px` });
      // soft at its sides and foot (the pictures' box edges never show as a seam): two crossed fades, the mask's alpha only
      const across = "linear-gradient(to right, transparent 0, black 2.5%, black 97.5%, transparent 100%)";
      const down = "linear-gradient(to bottom, black 0, black 95%, transparent 100%)";
      layer.style.webkitMaskImage = `${across}, ${down}`;
      layer.style.webkitMaskComposite = "source-in";
      layer.style.maskImage = `${across}, ${down}`;
      layer.style.maskComposite = "intersect";
      const ims = T.frames.map((f) => {
        const im = el("img", "", layer);
        im.alt = "";
        im.draggable = false;
        im.src = url(f);
        return im;
      });
      await Promise.race([Promise.all(ims.map((im) => (im.decode ? im.decode().catch(() => {}) : null))), realWait(800)]);
      const step = (T.ms || C.turnMs) / (ims.length + 1);
      const fade = Math.round(step * 0.45);
      layer.style.setProperty("--fade", `${fade}ms`);
      // the old page's game goes with the lifting page
      if (g.wrap) {
        g.wrap.style.transition = `opacity ${fade}ms ease-in`;
        g.wrap.style.opacity = "0";
      }
      for (let i = 0; i < ims.length; i++) {
        ims[i].classList.add("on");
        window.Day.book.turnFrame = i + 1;
        await realWait(step);
        if (i > 0) ims[i - 1].classList.remove("on");
      }
      if (g.wrap) g.wrap.remove();
      ims[ims.length - 1].classList.remove("on");
      window.Day.book.turnFrame = 0;
      await realWait(fade);
      layer.remove();
    } else {
      const c = el("div", "day-curl", book);
      c.style.cssText = pg.r.style.cssText;
      c.style.animationDuration = `${C.turnMs}ms`;
      await realWait(C.turnMs * 0.5);
      if (g.wrap) g.wrap.remove();
      await realWait(C.turnMs * 0.5);
      c.remove();
    }
    book.classList.remove("day-turning");
  };

  /**
   * A page built and drawn before it shows: its pictures fetched, the game's page made (hidden; her lines held until it shows),
   * every <img> on it decoded in place. reveal() shows it, her face and card with it, and lets her speak.
   */
  let first = null;
  const prep = async (p) => {
    await picsOf(p);
    mount(p);
    g.hidden = true;
    headHeld = true;
    headRow.style.visibility = "hidden";
    g.wrap.style.visibility = "hidden";
    let release = null;
    g.go = new Promise((r) => (release = r));
    const run = runGame(g, p);
    await Promise.race([Promise.all([...g.wrap.querySelectorAll("img")].map((im) => (im.decode ? im.decode().catch(() => {}) : null))), realWait(2500)]);
    await new Promise((r) => requestAnimationFrame(() => r()));
    return { p, run, release, wrap: g.wrap };
  };
  const reveal = (pg, i) => {
    pg.wrap.style.visibility = "";
    api.test.state(`day/book/${pg.p.game}`);
    window.Day.book.page = i;
    g.hidden = false;
    headHeld = false;
    showHead();
    pg.release();
  };

  // ---------------------------------------------------------------- the evening
  // the room is up: the evening's first moment (BOOK-01 films from here)
  await new Promise((r) => (room.complete ? r() : (room.onload = room.onerror = r)));
  // (the close-up, the pages and the first page's pictures load while she greets: the camera waits for them before it sets off)
  // (and the italic face her grey to-record lines use: a face still loading draws its text invisible, a blank card)
  const italic = document.fonts && document.fonts.load ? document.fonts.load('italic 700 20px "Nunito"').catch(() => {}) : null;
  const ready = Promise.race([Promise.all([pic(A.pages), FS && pic(FS.art), plan.pages[0] && picsOf(plan.pages[0]), italic]), realWait(4000)]);
  api.test.state("day/book/room");
  await api.wait(500);
  const direct = !!only;
  // BOOK-10 (Zafar, 22 Oct F1: "Zooming into her face, and then it scrolls down to the book. Why would we do that? Why didn't you
  // zoom into the book to start with?"): the evening opens on the book: the pages (the book she holds out to the child) come up
  // as soon as they are drawn, and she greets from her face on the page; the room, her fire and the shelf are the way out
  await ready;
  room.style.visibility = "hidden";
  place3(C.wide);
  shot = "pages";
  layout();
  book.style.transition = `opacity ${direct ? 0 : 450}ms ease-in-out`;
  book.classList.add("open");
  book.style.opacity = "1";
  window.Day.book.stage = "open";
  api.test.state("day/book/open");
  if (!direct) {
    await realWait(480);
    // her greeting on the page, beside her face (the same card her games' lines use; her face replays it)
    const greet = line("greet");
    headHeld = false;
    head(greet);
    await bookSay(greet, { el: headLine.firstChild && headLine.firstChild.classList.contains("day-line") ? headLine.firstChild : null, who: "nani" });
    await api.wait(250);
  } else await api.wait(300);
  book.style.transition = "none";
  window.Day.book.stage = "pages";
  layout();

  for (let i = 0; i < plan.pages.length; i++) {
    const p = plan.pages[i];
    keepTurn = null;
    // the first page was built and drawn before the camera turned down to it; it shows as the camera lands
    const pg0 = i === 0 && first ? first : await prep(p);
    if (plan.pages[i + 1]) picsOf(plan.pages[i + 1]);
    reveal(pg0, i);
    const run = pg0.run;
    await run;
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
    softTop(true);
    book.style.transition = `transform ${C.upMs}ms ${EASE}, opacity ${C.upMs * 0.45}ms ease-in-out ${C.upMs * 0.4}ms`;
    book.style.transform = bookTo(to);
    book.style.opacity = "0";
    setCam(to, C.upMs);
    await realWait(C.upMs + 40);
    book.classList.remove("open");
    book.style.transition = "none";
    book.style.transform = "none";
    softTop(false);
    // ... then the pull back to the whole room: the room under her close-up, which fades as the camera goes back
    room.style.visibility = "";
    close.style.transition = `opacity ${C.outMs * 0.5}ms ease-in-out ${C.outMs * 0.05}ms`;
    close.style.opacity = "0";
  } else {
    room.style.visibility = "";
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
