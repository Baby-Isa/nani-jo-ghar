/*
 * The big card that pops as a thing is said, in its row card's own shape, then flies whole into its slot. Its place is
 * worked out once per order: beside the side panel, at the top or the foot by how many people order, as wide as the
 * play area lets it be but never taller than its share of the play area's height (Zafar's red box), and smaller still
 * until it touches no head. Everything inside it is sized from its width (--pw), so it scales as one picture.
 *
 *   const big = createBigCard({ stage, say, kit, round, panel, wordCard, light, sounds })
 *   big.place(slotEl, heads?, bubble?, { again? }) -> { x, y, w, h }   in the play area's px (again: afresh, at a new size)
 *   big.pop(src, slotEl) -> { el, fly(), out(), lesson(), remove() }   src: { el?, line, pic, word }
 */
import { revealLesson, wireSpeaker } from "./word-card.js";

export function createBigCard({ stage, say, kit, round, panel, wordCard, light, sounds }) {
  const O = kit.order;
  let kept = null;
  // the big cards showing now (one, or the dish's own card beside it), placed again at a new size unless already flying
  const showing = new Set();
  const setBig = (el, b) => {
    Object.assign(el.style, { left: `${b.x}px`, top: `${b.y}px`, width: `${b.w}px`, height: `${b.h}px` });
    el.style.setProperty("--pw", `${b.w}px`);
  };

  /**
   * The row card's shape, height over width, read with its card open for that one measure (a folded card's row has no
   * height of its own yet) in the same turn, nothing drawn between.
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

  function place(slotEl, heads = [], bubble = null, { again = false } = {}) {
    if (again) kept = null;
    if (kept) return kept;
    const play = stage.size();
    const by = O.bigByPeople[Math.min(O.bigByPeople.length, round.order.for.length) - 1];
    const shape = shapeOf(slotEl);
    // its size for this many people, then never taller than its share of the play area's height, its width from its shape
    const w0 = Math.min(O.bigW, play.w * O.bigOfW, play.h * O.bigWOfH) * by.zoom;
    const w = Math.min(w0, (play.h * O.bigMaxOfH) / shape);
    const [x, top] = O.bigAt;
    const box = (k) => ({ x, y: by.place === "top" ? top : play.h - top - w * shape * k, w: w * k, h: w * shape * k });
    const o = stage.el.play.getBoundingClientRect();
    const touches = (b) => heads.some((hd) => hd.x - o.left - O.bigHeadGap < b.x + b.w && hd.x - o.left + hd.w + O.bigHeadGap > b.x && hd.y - o.top - O.bigHeadGap < b.y + b.h && hd.y - o.top + hd.h + O.bigHeadGap > b.y);
    let k = 1;
    while (k > O.bigMinZoom && touches(box(k))) k -= O.zoomStep;
    // and smaller until the speaker's bubble, level with it, need only move a little aside
    const aside = (b) => (bubble && bubble.y < b.y + b.h && bubble.y + bubble.h > b.y ? b.x + b.w + O.bubbleGap - bubble.x : 0);
    while (k > O.bigMinZoom && aside(box(k)) > bubble.w * O.bubbleShift) k -= O.zoomStep;
    kept = box(k);
    if (again) showing.forEach((el) => el.style.transform || setBig(el, kept));
    return kept;
  }

  function pop(src, slotEl) {
    const el = document.createElement("div");
    el.className = `pop big in${src.el && src.el.classList.contains("no") ? " no" : ""}`;
    el.innerHTML = wordCard(src.line, src.pic, src.word, { rule: false });
    // (its speaker says its word, as every word card's does)
    wireSpeaker(el, { say, line: src.line });
    setBig(el, place(slotEl));
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
  }

  return { place, pop };
}
