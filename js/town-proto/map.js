/*
 * The town map: who goes where (town-map.md, after its critique and Zafar's answers of 1 Nov; games-at-a-glance §6). The bus
 * has dropped the family in town; everyone has an errand. The map is Zafar's mock-up (cut from map-8-places.webp) with the
 * face row along the bottom strip, Hannah Mami first. An order is a sentence ("Nana wants to go to the park"), so Nani's line
 * (or, at L1, the person's own) is big in the box with its key words underlined, and the shared word tiles sit under it: a tile
 * for every person in the row and every open place (L3: every thing), asked for or not. The tiles never give the answer.
 *
 *   Tap a face: it lifts (a gold ring). Tap a place: the lifted person walks there, goes in, and comes back carrying what it
 *   gives (the mangoes, the bread, a book ...). The row ticks the moment the right place is tapped (instant: Zafar, 1 Nov).
 *   A place with nobody lifted: the faces bounce ("who?"). A wrong place, or the wrong person: the place shakes, the line again,
 *   the row will tick plain (a hollow tick: progress, no verdict). A closed place (not open at this level) does nothing.
 *   Anyone can be called at any time: a face that's out on an errand stays full colour and tappable (critique 2), so the row
 *   never reads as a shortlist. Never the same place twice running.
 *
 *   L1  three places open (the market, the park, the bakery); three faces; the person says it: "I want to go to the market."
 *       (their face is lifted for them: only the place decides)
 *   L2  five places (+ the library, the clinic); four faces (+ Ma); Nani says who and where: "Nana wants to go to the clinic."
 *   L3  all eight open; the thing, not the place: "Big Ma wants a book." (book, bread, medicine, letter, mangoes)
 *   L4  the need, not drawn on any sign: "Nana feels poorly" (the clinic), "Ma wants to play" (the park), "Big Ma wants to
 *       read" (the library), "Hannah Mami. We need to cook." (the market); six places open, the fire station and the bakery
 *       answering none of them; five errands
 */
import { PEOPLE, PLACES, THINGS, MAP } from "./art.js";

const stamp = (p) => (typeof window !== "undefined" && typeof window.njgV === "function" ? window.njgV(p) : p);
const NANI = { id: "nani", name: "Nani", face: "assets/shared/faces/nani.webp" };

async function run(F) {
  const lv = F.level;
  const open = lv === 1 ? ["market", "park", "bakery"] : lv === 2 ? ["market", "park", "bakery", "library", "clinic"] : lv === 4 ? ["market", "park", "bakery", "library", "clinic", "fire-station"] : Object.keys(PLACES);
  // (L4: each need has exactly one plausible open place: town-map.md decision 35)
  const NEEDS = { clinic: "XFeelsPoorly", park: "XWantsToPlay", library: "XWantsToRead", market: "cook" };
  const cast = lv === 1 ? [PEOPLE.hannah, PEOPLE.nana, PEOPLE.bigma] : [PEOPLE.hannah, PEOPLE.nana, PEOPLE.bigma, PEOPLE.ma];
  const nErr = [3, 4, 4, 5][lv - 1];
  const wanted = Object.keys(THINGS); // (L3: the places that give a thing someone can want)

  /* ----- the errands: who and where; never the same place twice running; L1 each person once ----- */
  const errands = [];
  let lastPlace = null;
  const whos = lv === 1 ? F.shuffle(cast) : null;
  for (let i = 0; i < nErr; i++) {
    const pool = (lv === 4 ? Object.keys(NEEDS) : lv === 3 ? wanted : open).filter((p) => p !== lastPlace);
    const place = F.pick(pool);
    lastPlace = place;
    errands.push({ i, who: whos ? whos[i % whos.length] : F.pick(cast), place });
  }

  /* ----- the scene: the map, its places, the face strip ----- */
  const town = document.createElement("div");
  town.className = "tp-town";
  F.scene.appendChild(town);
  const map = document.createElement("div");
  map.className = "tp-map";
  map.innerHTML = `<img class="tp-mapimg" src="${stamp(MAP)}" alt="">`;
  town.appendChild(map);
  const strip = document.createElement("div");
  strip.className = "tp-strip";
  town.appendChild(strip);
  const placeEls = {};
  Object.entries(PLACES).forEach(([id, p]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `tp-place${open.includes(id) ? "" : " closed"}`;
    b.dataset.place = id;
    b.setAttribute("aria-label", id);
    for (const k of ["x", "y", "w", "h"]) b.style.setProperty(`--${k}`, String(p[k]));
    map.appendChild(b);
    placeEls[id] = b;
  });
  const faceEls = {};
  cast.forEach((p) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tp-face";
    b.dataset.who = p.id;
    b.setAttribute("aria-label", p.name);
    b.innerHTML = `<img src="${stamp(p.face)}" alt="">`;
    strip.appendChild(b);
    faceEls[p.id] = b;
  });

  /* ----- the rows: one errand each, one instruction at a time ----- */
  const P = (who) => ({ fn: "Item", kind: who.lex });
  const Pl = (id) => ({ fn: "Item", kind: PLACES[id].lex });
  const Th = (id) => ({ fn: "Item", kind: THINGS[id].lex, number: THINGS[id].plural ? "pl" : undefined });
  const need = (e) => (NEEDS[e.place] === "cook" ? [{ fn: "X", x: P(e.who) }, { fn: "Say", x: "phrase.we-need-to-cook" }] : { fn: NEEDS[e.place], x: P(e.who) });
  const rows = errands.map((e) =>
    F.row({
      key: `errand${e.i}`,
      line: lv === 1 ? { fn: "IWantToGoToTheX", x: Pl(e.place) } : lv === 2 ? { fn: "XWantsToGoToTheY", x: P(e.who), y: Pl(e.place) } : lv === 3 ? { fn: "XWantsY", x: P(e.who), y: Th(e.place) } : need(e),
      word: lv === 3 ? Th(e.place) : Pl(e.place),
      tiles: lv === 1 ? [e.place] : lv === 2 ? [e.who.id, e.place] : lv === 3 ? [e.who.id, `t-${e.place}`] : [e.who.id],
      picture: (box) => box.appendChild(mapPic(e.place)),
      target: () => (lifted === e.who.id ? placeEls[e.place] : faceEls[e.who.id]),
      data: e,
    })
  );

  /* ----- the word tiles: the people in the row (L2+), the open places (L1-L2) or the things (L3+) ----- */
  /** A place's own picture, cut from the map (assets/town-proto/place-ID.webp). */
  function mapPic(id) {
    const i = document.createElement("img");
    i.src = stamp(`assets/town-proto/place-${id}.webp`);
    i.alt = "";
    i.className = "tp-tile-pic";
    return i;
  }
  const img = (src) => (box) => {
    const i = document.createElement("img");
    i.src = stamp(src);
    i.alt = "";
    i.className = "tp-tile-pic";
    box.appendChild(i);
  };
  const groups = [];
  if (lv >= 2) groups.push({ label: { en: "People" }, tiles: cast.map((p) => ({ key: p.id, id: p.id, word: P(p), lex: p.lex, picture: img(p.face) })) });
  if (lv !== 3) groups.push({ label: { en: "Places" }, tiles: open.map((id) => ({ key: id, id, word: Pl(id), lex: PLACES[id].lex, picture: (box) => box.appendChild(mapPic(id)) })) });
  else groups.push({ label: { en: "Things" }, tiles: wanted.map((id) => ({ key: `t-${id}`, id: `thing-${id}`, word: Th(id), lex: THINGS[id].lex, picture: img(THINGS[id].img) })) });
  F.sentence(groups);

  /* ----- play ----- */
  let lifted = null;
  const walkers = {};
  function lift(id) {
    if (lifted && faceEls[lifted]) faceEls[lifted].classList.remove("up");
    lifted = id;
    if (id && faceEls[id]) faceEls[id].classList.add("up");
  }
  Object.entries(faceEls).forEach(([id, b]) =>
    F.on(b, "click", () => {
      F.acted();
      lift(lifted === id && lv > 1 ? null : id);
    })
  );
  Object.entries(placeEls).forEach(([id, b]) =>
    F.on(b, "click", () => {
      F.acted();
      const r = F.current();
      if (!r) return;
      if (!open.includes(id)) {
        F.jiggle(b, "tp-shake");
        return;
      }
      if (!lifted) {
        // place before face: "who?" (the faces bounce)
        Object.values(faceEls).forEach((f) => F.jiggle(f, "tp-bounce"));
        return;
      }
      const e = r.data;
      if (id !== e.place || lifted !== e.who.id) {
        F.oops(r, b);
        return;
      }
      walk(e);
      lift(null);
      // (L1: the next person speaks for themselves: their face in the box and lifted before their line)
      const next = rows[rows.indexOf(r) + 1];
      if (lv === 1 && next) {
        F.person(next.data.who);
        F.after(F.T(650), () => !F.dead && lift(next.data.who.id));
      }
      F.add(r);
    })
  );
  /** The person walks from their face to the place, goes in, and comes back carrying what it gives. */
  function walk(e) {
    const id = e.who.id;
    if (walkers[id]) walkers[id].remove();
    const sr = F.scene.getBoundingClientRect();
    const fr = faceEls[id].getBoundingClientRect();
    const pr = placeEls[e.place].getBoundingClientRect();
    const w = document.createElement("div");
    w.className = "tp-walker";
    w.innerHTML = `<img src="${stamp(e.who.face)}" alt="">`;
    const at = (r) => ({ left: `${r.left + r.width / 2 - sr.left}px`, top: `${r.top + r.height / 2 - sr.top}px` });
    Object.assign(w.style, at(fr));
    F.scene.appendChild(w);
    walkers[id] = w;
    faceEls[id].classList.add("out");
    const go = (to, ms) => w.animate([{ left: w.style.left, top: w.style.top }, to], { duration: F.T(ms), easing: "ease-in-out", fill: "forwards" }).finished.then(() => Object.assign(w.style, to));
    (async () => {
      try {
        await go(at(pr), 1300);
        w.classList.add("inside");
        await F.sleep(F.T(700));
        const th = THINGS[e.place];
        if (th && th.img) w.insertAdjacentHTML("beforeend", `<img class="tp-carry" src="${stamp(th.img)}" alt="">`);
        w.classList.remove("inside");
        await go(at(faceEls[id].getBoundingClientRect()), 1300);
      } catch (err) {
        /* left */
      }
      if (walkers[id] === w) {
        w.remove();
        delete walkers[id];
        faceEls[id].classList.remove("out");
        F.jiggle(faceEls[id], "tp-bounce");
      }
    })();
  }

  // (her opening line, then the first errand; at L1 the first person's own line, their face lifted)
  F.person(NANI);
  if (lv === 1) {
    F.setGuide("map-guide");
    await Promise.race([F.speak(F.lineOf("map-guide")), F.tapped()]);
    F.person(errands[0].who);
    lift(errands[0].who.id);
    await F.ask({});
  } else await F.ask({ guide: "map-guide" });
  F.begin();
  F.teach(lv === 1 ? "place" : "face", () => (lv === 1 ? placeEls[errands[0].place] : faceEls[errands[0].who.id]));

  await new Promise((res) => F.whenAll(res));
  F.person(NANI);
  await F.sleep(F.T(1200));
  await F.finish(async () => {
    Object.values(faceEls).forEach((f) => F.jiggle(f, "tp-bounce"));
    await F.sleep(F.T(700));
  });
}

export default { opts: {}, run };
