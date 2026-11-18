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
import { panelOf } from "./order-panel.js";

export function createCards({ stage, say, kit, round, people, picOf, onFace, onPeek, light, sounds }) {
  const host = stage.el.cards;
  host.innerHTML = "";
  // the list's one scroll rule lives in the panel: these cards only say what changed
  const panel = panelOf(host, { kit });
  panel.reset();
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
    el.innerHTML = `<div class="ocard-top"><button class="facebtn"><span class="face"><span class="badge"></span></span></button><div class="head">${lineHtml(head, itemWords)}</div><span class="tick"></span></div><div class="ocard-body"><div class="ocard-in"><div class="orow"></div></div></div>`;
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
    panel.track(el);
    edgeFade(row);
    return { el, body: el.querySelector(".ocard-body"), row, items, head, person: p };
  });

  /**
   * The row's edges fade only while there is more to swipe that way: the fade's strength follows what is left that way (full
   * once rowFadeRun px are left), so it comes and goes smoothly as the row moves and is gone at either end.
   */
  function edgeFade(row) {
    const set = () => {
      const left = row.scrollLeft;
      const right = row.scrollWidth - row.clientWidth - left;
      row.style.setProperty("--fade-l", `${Math.max(0, Math.min(1, left / O.rowFadeRun))}`);
      row.style.setProperty("--fade-r", `${Math.max(0, Math.min(1, right / O.rowFadeRun))}`);
    };
    row.addEventListener("scroll", set, { passive: true });
    panel.watchRow(row, set);
    set();
  }

  /** A card opens to its row's own height (a row is as tall as its tallest item card) and folds to its top line. */
  const setOpen = (seat, open) => seats[seat].el.classList.toggle("folded", !open);
  const toggle = (seat) => setOpen(seat, seats[seat].el.classList.contains("folded"));

  /**
   * The row card's shape, height over width, read with its card open for that one measure (a folded card's row has no height
   * of its own yet) in the same turn, nothing drawn between.
   */
  function shapeOf(card) {
    const body = card.closest(".ocard-body");
    const was = body ? body.style.cssText : "";
    if (body) Object.assign(body.style, { transition: "none", gridTemplateRows: "1fr" });
    const r = card.getBoundingClientRect();
    if (body) {
      // back as it was with no move drawn: the fold is laid out again before its own transition returns
      body.style.gridTemplateRows = "";
      void body.offsetHeight;
      body.style.cssText = was;
    }
    return r.width > 0 && r.height > 0 ? r.height / r.width : O.bigShape;
  }

  /**
   * The big card's place: beside the side panel, at the top or the foot by how many people order, in the row card's shape
   * (so one even scale lands it on its slot), as wide as the play area lets it be but never taller than its share of the
   * play area's height (Zafar's red box), and smaller still until it touches no head. Kept for the whole order.
   */
  let place = null;
  function bigBox(card, heads = [], bubble = null) {
    if (place) return place;
    const play = stage.size();
    const by = O.bigByPeople[Math.min(O.bigByPeople.length, round.order.for.length) - 1];
    const shape = shapeOf(card);
    // its size for this many people, then never taller than its share of the play area's height, its width from its shape
    const w0 = Math.min(O.bigW, play.w * O.bigOfW, play.h * O.bigWOfH) * by.zoom;
    const w = Math.min(w0, (play.h * O.bigMaxOfH) / shape);
    const [x, top] = O.bigAt;
    const at = (k) => ({ x, y: by.place === "top" ? top : play.h - top - w * shape * k, w: w * k, h: w * shape * k });
    const o = stage.el.play.getBoundingClientRect();
    const touches = (b) => heads.some((hd) => hd.x - o.left - O.bigHeadGap < b.x + b.w && hd.x - o.left + hd.w + O.bigHeadGap > b.x && hd.y - o.top - O.bigHeadGap < b.y + b.h && hd.y - o.top + hd.h + O.bigHeadGap > b.y);
    let k = 1;
    while (k > O.bigMinZoom && touches(at(k))) k -= O.zoomStep;
    // and smaller until the speaker's bubble, level with it, need only move a little aside
    const aside = (b) => (bubble && bubble.y < b.y + b.h && bubble.y + bubble.h > b.y ? b.x + b.w + O.bubbleGap - bubble.x : 0);
    while (k > O.bigMinZoom && aside(at(k)) > bubble.w * O.bubbleShift) k -= O.zoomStep;
    place = at(k);
    return place;
  }

  // the big cards showing now (one, or the dish's own card beside it), placed again at a new size unless already flying;
  // everything inside a big card is sized from its width (--pw), so it scales as one picture
  const showing = new Set();
  function setBig(el, b) {
    Object.assign(el.style, { left: `${b.x}px`, top: `${b.y}px`, width: `${b.w}px`, height: `${b.h}px` });
    el.style.setProperty("--pw", `${b.w}px`);
  }

  return {
    seats,
    show(seat) {
      seats[seat].el.hidden = false;
    },
    open: (seat) => setOpen(seat, true),
    fold: (seat) => setOpen(seat, false),
    /** A person's card is kept whole in the panel's view from now on (the panel's rule), whatever opens or folds round it. */
    focus: (seat) => panel.focus(seat == null ? null : seats[seat].el),
    land(seat, ids) {
      for (const id of ids) seats[seat].items.get(id).el.classList.remove("waiting");
    },
    /** The order is over: every card has landed and every row is back at its first card. */
    landAll() {
      seats.forEach((s) => {
        s.items.forEach((it) => it.el.classList.remove("waiting"));
        s.row.scrollTo({ left: 0, behavior: "smooth" });
      });
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
      return { x: b.x, y: b.y, w: b.w, h: b.h };
    },
    pop(seat, id, dish = null) {
      const src = dish || seats[seat].items.get(id);
      const slotEl = dish ? seats[seat].items.values().next().value.el : src.el;
      const el = document.createElement("div");
      el.className = `pop big in${src.el && src.el.classList.contains("no") ? " no" : ""}`;
      el.innerHTML = `${wordCard(src.line, src.pic, src.word)}<span class="speaker"></span>`;
      const b = bigBox(slotEl);
      setBig(el, b);
      stage.el.over.appendChild(el);
      showing.add(el);
      const gone = () => (showing.delete(el), el.remove());
      return {
        el,
        /**
         * The card moves and shrinks in one go into its slot: one even scale, centre to centre, nothing faded, nothing
         * stretched; on landing the slot's own card shows and the big one goes in the same frame, so nothing blinks.
         */
        async fly() {
          // its person's card is whole in the list's view first (the panel's rule, once nothing in it moves), so it lands where it is seen
          await panel.still();
          const to = src.el.getBoundingClientRect();
          const from = el.getBoundingClientRect();
          // it flies over the side panel, so it leaves the play area's layer (which clips) for the page's, in the same place
          Object.assign(el.style, { position: "fixed", left: `${from.left}px`, top: `${from.top}px` });
          document.body.appendChild(el);
          void el.offsetWidth; // (its style there is settled first, so the move below is a move, not a jump)
          const k = Math.min(to.width / from.width, to.height / from.height);
          el.classList.remove("in");
          el.style.transition = `transform ${O.fly}ms ${O.flyEase}`;
          el.style.transform = `translate(${to.left + to.width / 2 - (from.left + from.width / 2)}px, ${to.top + to.height / 2 - (from.top + from.height / 2)}px) scale(${k})`;
          // a new size of the screen mid-flight (a phone turned): its slot is somewhere else now, so it lands there at once
          let off = null;
          await Promise.race([stage.wait(O.fly), new Promise((res) => (off = stage.onResize(res)))]);
          off();
          src.el.classList.remove("waiting");
          gone();
        },
        /** The order's own card stays where it stands and fades out. */
        async out() {
          el.classList.remove("in");
          el.classList.add("out");
          await stage.wait(O.dishCardOut);
          gone();
        },
        /** The first-time lesson: the order waits while the child taps each hidden part open. */
        lesson: () => revealLesson(el, { kit, light, sounds }),
        remove: gone,
      };
    },
    clear() {
      panel.reset();
      host.innerHTML = "";
    },
  };
}
