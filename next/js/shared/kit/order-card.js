/*
 * The order cards in the side panel, one per person: their face, their order as one line, and a row of item cards,
 * each one of the thing in the shelf's own picture. Nothing of an order shows before it is said: a slot is a dashed
 * outline until its card lands. A card ticks the moment its thing is done, in any order; a served card folds to its
 * top line with a gold tick, which gives one pop at the well done. The same word card is used here, in the big pop-up and in Nani's helper. Each card's row
 * is ./order-row.js (its rule: ./row.rules.js); the big card is ./big-card.js; the card lifted for the wrong-order pop-up
 * is ./order-card.lift.js, made by the same two builders as the panel's (shell, itemCard).
 *
 *   const cards = createCards({ stage, say, kit, round, people, picOf, onFace, onPeek, light, sounds })
 *   cards.show(seat)  cards.open(seat)  cards.fold(seat)  cards.focus(seat)  cards.slot(seat, id) -> rectangle
 *   cards.land(seat, ids)  cards.landAll()  cards.ticks(seat, ids, placed?)  the rules' ticked rows, in the order ticked, and the
 *       rows that keep their place in the row (ticked, or gone past what was asked: unticked, the row not sliding back)
 *   cards.served(seat)  cards.reopen(seat)  cards.lineOf(seat, id)  cards.headOf(seat)
 *   cards.cheer(seat)   a served card's tick gives one pop (the well done)
 *   cards.lead(seat, ids)  the order: the row glides so these cards land whole, the place before them at the left
 *   cards.pop(seat, id | null, dish?) -> the big card: { fly() -> Promise, out() -> Promise, lesson() -> Promise, el }
 *   cards.bigPlace(heads, bubble, { again? }) -> where the big card sits for this order, in the play area's px (kept for the
 *       whole order; again: worked out afresh for a new size of the play area, and a big card showing moves there)
 *   cards.replay(seat, dish?) -> Promise   the order said again from its face; dish: { line, pic }, the dish's own card,
 *       popped again beside it while the order is said (Zafar, 13 Nov: at level 1, as it first showed)
 *   cards.lift(seat, slots, host, { english })   cards.line(seat, host)   the card, or its folded line, lifted out of the panel
 *       for the wrong-order pop-up (./order-card.lift.js), built by this card's own builders
 *   cards.still() -> Promise   the panel's list at rest (nothing opening, folding or gliding)
 *   cards.lineIn(seat, meaning) -> Line   a line in this person's own way of speaking (their order's register)
 *   cards.make(seat, { word, meaning }) -> { el, line }   an item card for a thing as it was made (a count, an amount, a
 *       thing nobody asked for), in this person's cards' own look, its picture whole and its English written (the lifted
 *       card shows it, every help open), nothing on it to press          cards.boxOf(seat) -> the card's rectangle in the panel
 *   cards.widthOf(seat) -> the card's width in its own px (a lifted card narrows to it before it goes home)
 *   cards.away(seats, top?)   these cards leave the list (orders done right while another is remade), `top` first of the
 *       rest; with none away, every card is back in the order they ordered
 */
import { lineHtml } from "./nani-box.js";
import { wordCardHtml, wirePeeks, wireSpeaker, spaceWords } from "./word-card.js";
import { atLevel, pictureHidden } from "../round.js";
import { panelOf } from "./order-panel.js";
import { createRow } from "./order-row.js";
import { createBigCard } from "./big-card.js";
import { createLift } from "./order-card.lift.js";

// (a card only shown: nothing on it is a button to press, but its speaker where it keeps one)
const still = (el, keep = "") => el.querySelectorAll(`button${keep ? `:not(${keep})` : ""}`).forEach((b) => b.replaceWith(Object.assign(document.createElement("span"), { className: b.className, innerHTML: b.innerHTML })));

export function createCards({ stage, say, kit, round, people, picOf, onFace, onPeek, light, sounds }) {
  const host = stage.el.cards;
  host.innerHTML = "";
  // the list's one scroll rule lives in the panel: these cards only say what changed
  const panel = panelOf(host, { kit });
  panel.reset();
  const showEnglish = atLevel(kit.levels.cardEnglish, round.level);
  const itemWords = new Set(round.order.for.flatMap((p) => p.items.map((i) => say.entry(i.word).id)));

  /** One word card's inside. The level hides the English; it hides the picture only of a word the child has earned. */
  const wordCard = (line, pic, word, o = {}) => wordCardHtml({ file: stage.art.file, line, pic, kit, english: showEnglish, blurred: pictureHidden(kit, round, word), ...o });
  const big = createBigCard({ stage, say, kit, round, panel, wordCard, light, sounds });

  const heads = round.order.for.map((p) => say.line(p.headline.meaning, { register: p.headline.register }));
  /** The one order card: the person's face, their order as one line, and its row, empty (the panel's and the lifted). */
  const shell = (seat) => {
    const el = document.createElement("div");
    el.className = "ocard";
    el.innerHTML = `<div class="ocard-top"><button class="facebtn"><span class="face"><span class="badge"></span></span></button><div class="head">${lineHtml(heads[seat], itemWords)}</div><span class="tick"></span></div><div class="ocard-body"><div class="ocard-in"><div class="orow"></div></div></div>`;
    el.querySelector(".face").style.backgroundImage = `url(${stage.art.file(people[round.order.for[seat].who].face)})`;
    return el;
  };
  /** The one item card: a thing's word card with its tick; whole: every help open (its picture whole, its English written). */
  const itemCard = (it, person, line, { whole = false } = {}) => {
    const c = document.createElement("div");
    c.className = `icard${it.no ? " no" : ""}`;
    c.innerHTML = `${wordCard(line, picOf(it, person), it.word, whole ? { english: true, blurred: false } : {})}<span class="tick"></span>`;
    return c;
  };

  const seats = round.order.for.map((p, seat) => {
    const el = shell(seat);
    el.classList.add("folded");
    el.hidden = true;
    const head = heads[seat];
    el.querySelector(".facebtn").addEventListener("click", (ev) => (ev.stopPropagation(), onFace(seat)));
    el.querySelector(".ocard-top").addEventListener("click", () => el.classList.contains("served") && toggle(seat));
    const rowEl = el.querySelector(".orow");
    const items = new Map();
    for (const it of p.items) {
      const line = say.line(it.meaning, { row: true });
      const c = itemCard(it, p, line);
      c.classList.add("waiting");
      // a card that ticks only as the dish is served: a "no", or one the game says so of (a measure, seen only as it is poured)
      const atServe = !!(it.no || it.atServe);
      c.dataset.item = it.id;
      if (atServe) c.dataset.serve = "1";
      wireSpeaker(c, { say, line });
      wirePeeks(c, { kit, onPeek: (what) => onPeek(it.word, what) });
      rowEl.appendChild(c);
      items.set(it.id, { el: c, line, pic: picOf(it, p), word: it.word, id: it.id, no: !!it.no, atServe });
    }
    host.appendChild(el);
    spaceWords([...items.values()].map((it) => it.el), kit);
    panel.track(el);
    return { el, items, head, person: p, row: createRow({ stage, kit, el: rowEl, items, panel }) };
  });
  const firstCard = (s) => s.items.values().next().value.el;

  /** A card opens to its row's own height (a row is as tall as its tallest item card) and folds to its top line. */
  const setOpen = (seat, open) => seats[seat].el.classList.toggle("folded", !open);
  const toggle = (seat) => setOpen(seat, seats[seat].el.classList.contains("folded"));
  /** A card of a thing as it was made, every help open whatever the level: it shows what went wrong. */
  const make = (seat, { word, meaning }) => {
    const line = say.line(meaning, { row: true });
    const el = itemCard({ word }, seats[seat].person, line, { whole: true });
    still(el);
    return { el, line };
  };
  const { lift, line } = createLift({ say, kit, seats, shell, itemCard, make, still });

  return {
    seats,
    show(seat) {
      seats[seat].el.hidden = false;
    },
    open: (seat) => setOpen(seat, true),
    fold: (seat) => setOpen(seat, false),
    /** A person's card is kept whole in the panel's view from now on (the panel's rule), whatever opens or folds round it. */
    focus: (seat) => panel.focus(seat == null ? null : seats[seat].el),
    land: (seat, ids) => seats[seat].row.land(ids),
    landAll: () => seats.forEach((s) => s.row.landAll()),
    ticks: (seat, ids, placed) => seats[seat].row.ticks(ids, placed),
    lead: (seat, ids) => seats[seat].row.lead(ids),
    served(seat) {
      seats[seat].row.served();
      seats[seat].el.classList.add("served");
    },
    cheer: (seat) => seats[seat].el.classList.add("cheered"),
    reopen(seat) {
      seats[seat].el.classList.remove("served", "cheered");
      setOpen(seat, true);
      seats[seat].row.reopen();
    },
    slot: (seat, id) => seats[seat].items.get(id).el.getBoundingClientRect(),
    lineOf: (seat, id) => seats[seat].items.get(id).line,
    headOf: (seat) => seats[seat].head,
    async replay(seat, dish = null) {
      const card = dish ? big.pop(dish, firstCard(seats[seat])) : null;
      await say.speak(seats[seat].head);
      if (card) await card.out();
    },
    lift,
    line,
    still: () => panel.still(),
    lineIn: (seat, meaning) => say.line(meaning, { register: seats[seat].person.headline.register }),
    make,
    boxOf: (seat) => seats[seat].el.getBoundingClientRect(),
    widthOf: (seat) => seats[seat].el.offsetWidth,
    away(list, top = null) {
      seats.forEach((s, i) => ((s.el.hidden = list.includes(i)), host.appendChild(s.el)));
      if (top != null) (host.prepend(seats[top].el), panel.focus(seats[top].el));
    },
    bigPlace: (heads, bubble, { again = false } = {}) => big.place(firstCard(seats[0]), heads, bubble, { again }),
    /** The big card that pops as a thing is said (or the dish's own card beside it, in the person's first slot), then flies into its slot. */
    pop(seat, id, dish = null) {
      const src = dish || seats[seat].items.get(id);
      return big.pop(src, dish ? firstCard(seats[seat]) : src.el);
    },
    clear() {
      panel.reset();
      host.innerHTML = "";
    },
  };
}
