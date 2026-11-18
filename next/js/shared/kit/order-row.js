/*
 * One order card's row of item cards on the page. Which card stands where and where the row rests are the row's rule
 * (./row.rules.js, no page), and which cards are ticked, in what order, is the scene's rules' (handed in by ticks());
 * this file only applies them: the cards slide to their new places (nothing jumps), the row glides to its rest, its
 * edges fade while there is more to swipe that way, and each card's words are spaced to their ink. The child may still
 * swipe the row; a new size puts it back at its rest.
 *
 *   const row = createRow({ stage, kit, el, items, panel })   items: Map id -> { el, id, no, atServe } in the order asked
 *   row.land(ids)  row.landAll()  row.lead(ids)  row.ticks(ids)  row.served()  row.reopen()
 */
import { rowOrder, rowRest, rowLandRest } from "./row.rules.js";
import { inkGaps } from "./word-card.js";

export function createRow({ stage, kit, el, items, panel }) {
  const O = kit.order;
  let ticked = [];
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
    const to = landing ? rowLandRest(places(), shows(), landing) : rowRest(places(), shows(), ticked, atServe);
    if (to != null) el.scrollTo({ left: to, behavior: "smooth" });
  };

  /** The cards to their places by the rule, each sliding from where it stood; then the row glides to its rest. */
  function arrange() {
    const order = rowOrder(all(), ticked).map((id) => items.get(id));
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
    stage.wait(O.rowGlideAfterMs).then(() => el.isConnected && rest());
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
  const spaced = () => all().forEach((it) => inkGaps(it.el, kit.cards.inkGap));
  el.addEventListener("scroll", fade, { passive: true });
  // a new size (a turn of the phone, a resize): the words spaced to their ink again, and the row back at its rest
  panel.watchRow(el, () => (spaced(), fade(), rest()));
  spaced();
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
    ticks(ids) {
      const now = ids.filter((id) => items.has(id));
      if (now.join() === ticked.join()) return;
      ticked = now;
      all().forEach((it) => it.el.classList.toggle("done", ticked.includes(it.id)));
      arrange();
    },
    served: () => all().forEach((it) => it.el.classList.add("done")),
    reopen() {
      all().forEach((it) => it.el.classList.remove("done"));
      ticked = [];
      arrange();
    },
  };
}
