/*
 * The order cards in the side panel, one per person: their face, their order as one line, and a row of item cards,
 * each one of the thing in the shelf's own picture. Nothing of an order shows before it is said: a slot is a dashed
 * outline until its card lands. A card ticks the moment its thing is done, in any order; a served card folds to its
 * top line with a gold tick. The same word card is used here, in the big pop-up and in Nani's helper. Each card's row
 * is ./order-row.js (its rule: ./row.rules.js); the big card is ./big-card.js.
 *
 *   const cards = createCards({ stage, say, kit, round, people, picOf, onFace, onPeek, light, sounds })
 *   cards.show(seat)  cards.open(seat)  cards.fold(seat)  cards.land(seat, ids)  cards.tick(seat, id, done, cross?)
 *   cards.served(seat)  cards.reopen(seat)  cards.slot(seat, id) -> rectangle  cards.focus(seat)
 *   cards.lead(seat, ids)  the order: the row glides so these cards land whole, the place before them at the left
 *   cards.pop(seat, id | null, dish?) -> the big card: { fly() -> Promise, out() -> Promise, lesson() -> Promise, el }
 *   cards.bigPlace(heads, bubble, { again? }) -> where the big card sits for this order, in the play area's px (kept for the
 *       whole order; again: worked out afresh for a new size of the play area, and a big card showing moves there)
 *   cards.askedOf(seat) -> its item cards' elements in the order asked
 */
import { lineHtml } from "./nani-box.js";
import { wordCardHtml, wirePeeks, wireSpeaker } from "./word-card.js";
import { atLevel } from "../round.js";
import { panelOf } from "./order-panel.js";
import { createRow } from "./order-row.js";
import { createBigCard } from "./big-card.js";

export function createCards({ stage, say, kit, round, people, picOf, onFace, onPeek, light, sounds }) {
  const host = stage.el.cards;
  host.innerHTML = "";
  // the list's one scroll rule lives in the panel: these cards only say what changed
  const panel = panelOf(host, { kit });
  panel.reset();
  const showEnglish = atLevel(kit.levels.cardEnglish, round.level);
  const itemWords = new Set(round.order.for.flatMap((p) => p.items.map((i) => say.entry(i.word).id)));

  const showPicture = atLevel(kit.levels.cardPicture, round.level);
  /** One word card's inside. The level hides the English; it hides the picture only of a word the child has earned. */
  const wordCard = (line, pic, word, o = {}) => wordCardHtml({ file: stage.art.file, line, pic, kit, english: showEnglish, blurred: !showPicture && !!round.earned[word], ...o });
  const big = createBigCard({ stage, kit, round, panel, wordCard, light, sounds });

  const seats = round.order.for.map((p, seat) => {
    const el = document.createElement("div");
    el.className = "ocard folded";
    el.hidden = true;
    const head = say.line(p.headline.meaning, { register: p.headline.register });
    el.innerHTML = `<div class="ocard-top"><button class="facebtn"><span class="face"><span class="badge"></span></span></button><div class="head">${lineHtml(head, itemWords)}</div><span class="tick"></span></div><div class="ocard-body"><div class="ocard-in"><div class="orow"></div></div></div>`;
    el.querySelector(".face").style.backgroundImage = `url(${stage.art.file(people[p.who].face)})`;
    el.querySelector(".facebtn").addEventListener("click", (ev) => (ev.stopPropagation(), onFace(seat)));
    el.querySelector(".ocard-top").addEventListener("click", () => el.classList.contains("served") && toggle(seat));
    const rowEl = el.querySelector(".orow");
    const items = new Map();
    for (const it of p.items) {
      const line = say.line(it.meaning, { row: true });
      const c = document.createElement("div");
      c.className = `icard waiting${it.no ? " no" : ""}`;
      c.dataset.item = it.id;
      if (it.no || it.atServe) c.dataset.serve = "1";
      c.innerHTML = `${wordCard(line, picOf(it, p), it.word)}<span class="tick"></span>`;
      wireSpeaker(c, { say, line });
      wirePeeks(c, { kit, onPeek: (what) => onPeek(it.word, what) });
      rowEl.appendChild(c);
      // a card that ticks only as the dish is served: a "no", or one the game says so of (a measure, seen only as it is poured)
      items.set(it.id, { el: c, line, pic: picOf(it, p), word: it.word, id: it.id, no: !!it.no, atServe: c.dataset.serve === "1" });
    }
    host.appendChild(el);
    panel.track(el);
    return { el, items, head, person: p, row: createRow({ stage, kit, el: rowEl, items, panel }) };
  });
  const firstCard = () => seats[0].items.values().next().value.el;

  /** A card opens to its row's own height (a row is as tall as its tallest item card) and folds to its top line. */
  const setOpen = (seat, open) => seats[seat].el.classList.toggle("folded", !open);
  const toggle = (seat) => setOpen(seat, seats[seat].el.classList.contains("folded"));

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
    tick: (seat, id, done, cross = false) => seats[seat].row.tick(id, done, cross),
    lead: (seat, ids) => seats[seat].row.lead(ids),
    served(seat) {
      seats[seat].row.served();
      seats[seat].el.classList.add("served");
    },
    reopen(seat) {
      seats[seat].el.classList.remove("served");
      setOpen(seat, true);
      seats[seat].row.reopen();
    },
    slot: (seat, id) => seats[seat].items.get(id).el.getBoundingClientRect(),
    lineOf: (seat, id) => seats[seat].items.get(id).line,
    headOf: (seat) => seats[seat].head,
    askedOf: (seat) => [...seats[seat].items.values()].map((it) => it.el),
    bigPlace(heads, bubble, { again = false } = {}) {
      const b = big.place(firstCard(), heads, bubble, { again });
      return { x: b.x, y: b.y, w: b.w, h: b.h };
    },
    /** The big card that pops as a thing is said (or the dish's own card beside it), then flies into its slot. */
    pop(seat, id, dish = null) {
      const src = dish || seats[seat].items.get(id);
      return big.pop(src, dish ? seats[seat].items.values().next().value.el : src.el);
    },
    clear() {
      panel.reset();
      host.innerHTML = "";
    },
  };
}
