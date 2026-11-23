/*
 * One order card's row of item cards on the page. Which card stands where and where the row rests are the row's rule
 * (./row.rules.js, no page), and which cards are ticked, in what order, is the scene's rules' (handed in by ticks());
 * this file only applies them: the cards slide to their new places (nothing jumps), the row glides to its rest, and its
 * edges fade while there is more to swipe that way. The child may still swipe the row; a new width puts it back at its rest.
 *
 *   const row = createRow({ kit, el, items, panel, life })   items: Map id -> { el, id, no, atServe } in the order asked
 *       life: its card's (the round's lifetime: js/shared/life.js)
 *   row.land(ids)  row.landAll()  row.lead(ids)  row.ticks(ids, placed?)  row.served()  row.reopen()
 *       placed: the cards that keep their place (the ticked, and one gone past what was asked), by which the row is ordered
 *       and rests; ids alone are ticked; without it, the ticked cards are the ones that keep their place
 */
import { rowOrder, rowRest, rowLandRest } from "./row.rules.js";

export function createRow({ kit, el, items, panel, life }) {
  const O = kit.order;
  let ticked = [];
  let placed = []; // (where the cards stand and the row rests: the ticked, and one gone past what was asked, in place)
  let landing = null; // while the order is said: the cards landing now
  const all = () => [...items.values()];
  const atServe = all().filter((it) => it.atServe).map((it) => it.id);

  // each card's place from the row's first card, in the row's own px (what its scroll is with that card at its left)
  const places = () => [...el.children].map((c) => ({ id: c.dataset.item, left: c.offsetLeft - el.firstElementChild.offsetLeft, w: c.offsetWidth }));
  // what the row shows of its cards: its width inside its own padding (a card at the row's scroll stands at its left padding)
  const shows = () => {
    const cs = getComputedStyle(el);
    return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  };
  /** The row glides to its rest: by the landing cards while the order is said, else by what is ticked. */
  const rest = () => {
    const to = landing ? rowLandRest(places(), shows(), landing) : rowRest(places(), shows(), placed, atServe);
    if (to != null) el.scrollTo({ left: to, behavior: "smooth" });
  };

  /** The cards to their places by the rule, each sliding from where it stood; then the row glides to its rest. */
  function arrange() {
    const order = rowOrder(all(), placed).map((id) => items.get(id));
    if (order.some((it, i) => el.children[i] !== it.el)) {
      const was = new Map(all().map((it) => [it, it.el.getBoundingClientRect().left]));
      order.forEach((it) => el.appendChild(it.el));
      if (el.getBoundingClientRect().width > 0)
        all().forEach((it) => {
          const dx = was.get(it) - it.el.getBoundingClientRect().left;
          if (Math.abs(dx) > 1) it.el.animate([{ transform: `translateX(${dx}px)` }, { transform: "none" }], { duration: O.rowSlideMs, easing: O.rowSlideEase });
        });
    }
    // (a card's place is where it rests, not where its slide has it now: the glide waits for the slides)
    life.wait(O.rowGlideAfterMs).then(() => el.isConnected && rest());
  }

  /**
   * The edges fade only while there is more to swipe that way: the fade's strength follows what is left that way (full once
   * rowFadeRun px are left), so it comes and goes smoothly as the row moves and is gone at either end.
   */
  const fade = () => {
    const right = el.scrollWidth - el.clientWidth - el.scrollLeft;
    el.style.setProperty("--fade-l", `${Math.max(0, Math.min(1, el.scrollLeft / O.rowFadeRun))}`);
    el.style.setProperty("--fade-r", `${Math.max(0, Math.min(1, right / O.rowFadeRun))}`);
  };
  el.addEventListener("scroll", fade, { passive: true });
  // a new width (a turn of the phone, a resize) puts the row back at its rest; a card growing or shrinking (a word peeked
  // open) moves nothing
  let width = el.clientWidth;
  panel.watchRow(el, () => {
    fade();
    if (el.clientWidth !== width) (width = el.clientWidth), rest();
  });
  fade();

  return {
    land(ids) {
      for (const id of ids) items.get(id).el.classList.remove("waiting");
    },
    /** The order is over: every card has landed, and the row rests by what is ticked. */
    landAll() {
      landing = null;
      all().forEach((it) => it.el.classList.remove("waiting"));
      rest();
    },
    /** While the order is said: the row glides so these cards land whole, the place before them at the row's left. */
    lead(ids) {
      landing = ids;
      rest();
    },
    /** The rules' ticked rows, in the order ticked: the cards tick, and slide to their places if the list changed. */
    ticks(ids, keep = ids) {
      const now = ids.filter((id) => items.has(id));
      const at = keep.filter((id) => items.has(id));
      if (now.join() === ticked.join() && at.join() === placed.join()) return;
      ticked = now;
      placed = at;
      all().forEach((it) => it.el.classList.toggle("done", ticked.includes(it.id)));
      arrange();
    },
    served: () => all().forEach((it) => it.el.classList.add("done")),
    reopen() {
      all().forEach((it) => it.el.classList.remove("done"));
      ticked = [];
      placed = [];
      arrange();
    },
  };
}
