/*
 * The order cards in the side panel, one per person: their face, their order as one line, and a row of item cards,
 * each one of the thing in the shelf's own picture. Nothing of an order shows before it is said: a slot is a dashed
 * outline until its card lands. A card ticks the moment its thing is done, in any order; a served card folds to its
 * top line with a gold tick. The same word card is used here, in the big pop-up and in Nani's helper. Each card's row
 * is ./order-row.js (its rule: ./row.rules.js); the big card is ./big-card.js.
 *
 *   const cards = createCards({ stage, say, kit, round, people, picOf, onFace, onPeek, light, sounds })
 *   cards.show(seat)  cards.open(seat)  cards.fold(seat)  cards.focus(seat)  cards.slot(seat, id) -> rectangle
 *   cards.land(seat, ids)  cards.landAll()  cards.ticks(seat, ids)  the rules' ticked rows, in the order ticked
 *   cards.served(seat)  cards.reopen(seat)  cards.lineOf(seat, id)  cards.headOf(seat)
 *   cards.lead(seat, ids)  the order: the row glides so these cards land whole, the place before them at the left
 *   cards.pop(seat, id | null, dish?) -> the big card: { fly() -> Promise, out() -> Promise, lesson() -> Promise, el }
 *   cards.bigPlace(heads, bubble, { again? }) -> where the big card sits for this order, in the play area's px (kept for the
 *       whole order; again: worked out afresh for a new size of the play area, and a big card showing moves there)
 *   cards.replay(seat, dish?) -> Promise   the order said again from its face; dish: { line, pic }, the dish's own card,
 *       popped again beside it while the order is said (Zafar, 13 Nov: at level 1, as it first showed)
 *   cards.copy(seat) -> { top, rows: [{ id, el, line, word, no, said, pic }] }   a copy of the card's top line (its face
 *       and order, nothing on it to press) and of its item cards, nothing ticked, in the order asked (the wrong-order card
 *       shows it); pic: the item's picture's file          cards.boxOf(seat) -> its top line's rectangle on the page
 *   cards.away(seats, top?)   these cards leave the list (orders done right while another is remade), `top` first of the
 *       rest; with none away, every card is back in the order they ordered
 */
import { lineHtml } from "./nani-box.js";
import { wordCardHtml, wirePeeks, wireSpeaker, spaceWords } from "./word-card.js";
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
  const big = createBigCard({ stage, say, kit, round, panel, wordCard, light, sounds });

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
      // a card that ticks only as the dish is served: a "no", or one the game says so of (a measure, seen only as it is poured)
      const atServe = !!(it.no || it.atServe);
      c.dataset.item = it.id;
      if (atServe) c.dataset.serve = "1";
      c.innerHTML = `${wordCard(line, picOf(it, p), it.word)}<span class="tick"></span>`;
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
    ticks: (seat, ids) => seats[seat].row.ticks(ids),
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
    async replay(seat, dish = null) {
      const card = dish ? big.pop(dish, firstCard(seats[seat])) : null;
      await say.speak(seats[seat].head);
      if (card) await card.out();
    },
    copy(seat) {
      const top = seats[seat].el.querySelector(".ocard-top").cloneNode(true);
      top.querySelector(".facebtn").replaceWith(...top.querySelector(".facebtn").childNodes);
      const asked = new Map(seats[seat].person.items.map((it) => [it.id, it]));
      const rows = [...seats[seat].items.values()].map((it) => ({ id: it.id, line: it.line, word: it.word, no: it.no, said: asked.get(it.id).said, pic: stage.art.file(it.pic), el: it.el.cloneNode(true) }));
      // (a copy is only shown: nothing on it is a button to press)
      const still = (el) => el.querySelectorAll("button").forEach((b) => b.replaceWith(Object.assign(document.createElement("span"), { className: b.className, innerHTML: b.innerHTML })));
      rows.forEach((r) => (r.el.classList.remove("done", "cross", "waiting"), still(r.el)));
      return { top, rows };
    },
    boxOf: (seat) => seats[seat].el.querySelector(".ocard-top").getBoundingClientRect(),
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
