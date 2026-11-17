/*
 * The order cards in the side panel, one per person: their face, their order as one line, and a row of item cards,
 * each one of the thing in the shelf's own picture. Nothing of an order shows before it is said: a slot is a dashed
 * outline until its card lands. A card ticks the moment its thing is done, in any order; a served card folds to its
 * top line with a gold tick. The same word card is used here, in the big pop-up and in Nani's helper.
 *
 *   const cards = createCards({ stage, say, kit, round, people, picOf })
 *   cards.show(seat)  cards.open(seat)  cards.fold(seat)  cards.land(seat, ids)  cards.tick(seat, id, done, cross?)
 *   cards.served(seat)  cards.reopen(seat)  cards.slot(seat, id) -> rectangle  cards.glide(seat, id)  cards.focus(seat)
 *   cards.pop(seat, id | "dish") -> the big card: { fly() -> Promise, out() -> Promise, lesson() -> Promise, el }
 *   cards.bigPlace(heads, bubble, { again? }) -> where the big card sits for this order, in the play area's px (kept for the
 *       whole order; again: worked out afresh for a new size of the play area, and a big card showing moves there)
 */
import { lineHtml } from "./nani-box.js";
import { wordCardHtml, wirePeeks, revealLesson } from "./word-card.js";
import { atLevel } from "../round.js";

export function createCards({ stage, say, kit, round, people, picOf, onFace, onPeek, light, sounds }) {
  const host = stage.el.cards;
  host.innerHTML = "";
  const showEnglish = atLevel(kit.levels.cardEnglish, round.level);
  const O = kit.order;
  const itemWords = new Set(round.order.for.flatMap((p) => p.items.map((i) => say.entry(i.word).id)));

  const showPicture = atLevel(kit.levels.cardPicture, round.level);
  /** One word card's inside. The level hides the English; it hides the picture only of a word the child has earned. */
  const wordCard = (line, pic, word) => wordCardHtml({ file: stage.art.file, line, pic, kit, english: showEnglish, blurred: !showPicture && !!round.earned[word] });

  const seats = round.order.for.map((p, seat) => {
    const el = document.createElement("div");
    el.className = "ocard folded";
    el.hidden = true;
    const head = say.line(p.headline.meaning, { register: p.headline.register });
    el.innerHTML = `<div class="ocard-top"><button class="facebtn"><span class="face"><span class="badge"></span></span></button><div class="head">${lineHtml(head, itemWords)}</div><span class="tick"></span></div><div class="ocard-body"><div class="orow"></div></div>`;
    el.querySelector(".face").style.backgroundImage = `url(${stage.art.file(people[p.who].face)})`;
    el.querySelector(".facebtn").addEventListener("click", (ev) => (ev.stopPropagation(), onFace(seat)));
    el.querySelector(".ocard-top").addEventListener("click", () => el.classList.contains("served") && toggle(seat));
    const row = el.querySelector(".orow");
    const items = new Map();
    for (const it of p.items) {
      const line = say.line(it.meaning, { row: true });
      const c = document.createElement("div");
      c.className = `icard waiting${it.no ? " no" : ""}`;
      c.innerHTML = `${wordCard(line, picOf(it, p), it.word)}<div class="rule"></div><button class="speaker"></button><span class="tick"></span>`;
      c.querySelector(".speaker").addEventListener("click", () => say.speak(line));
      wirePeeks(c, { kit, onPeek: (what) => onPeek(it.word, what) });
      row.appendChild(c);
      items.set(it.id, { el: c, line, pic: picOf(it, p), word: it.word });
    }
    host.appendChild(el);
    return { el, body: el.querySelector(".ocard-body"), row, items, head, person: p };
  });

  /** A card opens to its row's own height: a row is as tall as its tallest item card. */
  const setOpen = (seat, open) => {
    const s = seats[seat];
    s.el.classList.toggle("folded", !open);
    s.body.style.height = open ? `${s.row.offsetHeight}px` : "0px";
  };
  const toggle = (seat) => setOpen(seat, seats[seat].el.classList.contains("folded"));

  /**
   * The big card's place: beside the side panel, at the top or the foot by how many people order, in the row card's
   * shape, as big as the play area lets it be, and smaller still until it touches no head. Kept for the whole order.
   */
  let place = null;
  function bigBox(card, heads = [], bubble = null) {
    if (place) return place;
    const play = stage.size();
    const short = document.documentElement.classList.contains("phone");
    const by = O.bigByPeople[Math.min(O.bigByPeople.length, round.order.for.length) - 1];
    const own = (short && by.short) || by;
    const w = Math.round(Math.min(O.bigW, play.h * O.bigOfH, play.w * O.bigOfW));
    const r = card.getBoundingClientRect();
    const h = own.h || (w * r.height) / r.width;
    const [x, top] = O.bigAt;
    const at = (zoom) => ({ x, y: by.place === "top" ? top : play.h - top - h * zoom, w, h, zoom });
    const o = stage.el.play.getBoundingClientRect();
    const touches = (b) => heads.some((hd) => hd.x - o.left - O.bigHeadGap < b.x + b.w * b.zoom && hd.x - o.left + hd.w + O.bigHeadGap > b.x && hd.y - o.top - O.bigHeadGap < b.y + b.h * b.zoom && hd.y - o.top + hd.h + O.bigHeadGap > b.y);
    let zoom = Math.min(own.zoom, (play.h - 2 * top) / h);
    while (zoom > O.bigMinZoom && touches(at(zoom))) zoom -= O.zoomStep;
    // and smaller until the speaker's bubble, level with it, need only move a little aside
    const aside = (b) => (bubble && bubble.y < b.y + b.h * b.zoom && bubble.y + bubble.h > b.y ? b.x + b.w * b.zoom + O.bubbleGap - bubble.x : 0);
    while (zoom > O.bigMinZoom && aside(at(zoom)) > bubble.w * O.bubbleShift) zoom -= O.zoomStep;
    place = at(zoom);
    return place;
  }

  // the big cards showing now (one, or the dish's own card beside it), placed again at a new size unless already flying
  const showing = new Set();
  function setBig(el, b) {
    // a zoomed card's own offsets are zoomed with it
    Object.assign(el.style, { left: `${b.x / b.zoom}px`, top: `${b.y / b.zoom}px`, width: `${b.w}px`, height: `${b.h}px`, zoom: b.zoom });
    el.style.setProperty("--pw", `${b.w}px`);
  }

  return {
    seats,
    show(seat) {
      seats[seat].el.hidden = false;
    },
    open: (seat) => setOpen(seat, true),
    fold: (seat) => setOpen(seat, false),
    /** A person's card comes into view in the panel. */
    focus(seat) {
      const s = seats[seat].el;
      host.scrollTo({ top: s.offsetTop - host.offsetTop, behavior: "smooth" });
    },
    land(seat, ids) {
      for (const id of ids) seats[seat].items.get(id).el.classList.remove("waiting");
    },
    /** The order is over: every card has landed and every row is back at its first card. */
    landAll() {
      seats.forEach((s) => {
        s.items.forEach((it) => it.el.classList.remove("waiting"));
        s.row.scrollTo({ left: 0, behavior: "smooth" });
      });
      host.scrollTo({ top: 0, behavior: "smooth" });
    },
    tick(seat, id, done, cross = false) {
      const it = seats[seat].items.get(id);
      if (!it) return;
      it.el.classList.toggle("done", !!done && !cross);
      it.el.classList.toggle("cross", !!cross);
    },
    /** The row glides so this card is whole in view, with the one before it at its left. */
    glide(seat, id) {
      const s = seats[seat];
      const it = id ? s.items.get(id) : null;
      const left = it ? Math.max(0, it.el.offsetLeft - s.row.offsetLeft - it.el.offsetWidth * O.glideShow) : 0;
      s.row.scrollTo({ left, behavior: "smooth" });
    },
    served(seat) {
      const s = seats[seat];
      s.items.forEach((it) => it.el.classList.add("done"));
      s.el.classList.add("served");
    },
    reopen(seat) {
      const s = seats[seat];
      s.el.classList.remove("served");
      s.items.forEach((it) => it.el.classList.remove("done", "cross"));
      setOpen(seat, true);
      s.row.scrollTo({ left: 0, behavior: "smooth" });
    },
    slot: (seat, id) => seats[seat].items.get(id).el.getBoundingClientRect(),
    lineOf: (seat, id) => seats[seat].items.get(id).line,
    headOf: (seat) => seats[seat].head,
    /** The big card that pops as a thing is said, in the row card's own shape; then it flies whole into its slot. */
    bigPlace(heads, bubble, { again = false } = {}) {
      if (again) place = null;
      const b = bigBox(seats[0].items.values().next().value.el, heads, bubble);
      if (again) showing.forEach((el) => el.style.transform || setBig(el, b));
      return { x: b.x, y: b.y, w: b.w * b.zoom, h: b.h * b.zoom };
    },
    pop(seat, id, dish = null) {
      const src = dish || seats[seat].items.get(id);
      const slotEl = dish ? seats[seat].items.values().next().value.el : src.el;
      const el = document.createElement("div");
      el.className = `pop in${src.el && src.el.classList.contains("no") ? " no" : ""}`;
      el.innerHTML = `${wordCard(src.line, src.pic, src.word)}<span class="speaker"></span>`;
      const b = bigBox(slotEl);
      setBig(el, b);
      stage.el.over.appendChild(el);
      showing.add(el);
      const gone = () => (showing.delete(el), el.remove());
      return {
        el,
        async fly() {
          const to = src.el.getBoundingClientRect();
          const from = el.getBoundingClientRect();
          el.classList.remove("in");
          el.style.transition = `transform ${O.fly}ms cubic-bezier(.65,0,.35,1)`;
          el.style.transform = `translate(${(to.left - from.left) / b.zoom}px, ${(to.top - from.top) / b.zoom}px) scale(${to.width / from.width}, ${to.height / from.height})`;
          await stage.wait(O.fly);
          gone();
        },
        async out() {
          el.classList.remove("in");
          el.classList.add("out");
          el.style.transform = "scale(.6)";
          await stage.wait(O.dishCardOut);
          gone();
        },
        /** The first-time lesson: the order waits while the child taps each hidden part open. */
        lesson: () => revealLesson(el, { kit, light, sounds }),
        remove: gone,
      };
    },
    clear() {
      host.innerHTML = "";
    },
  };
}
