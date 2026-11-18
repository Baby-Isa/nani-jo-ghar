/*
 * One order card's row of item cards on the page. Which card stands where and where the row rests are the row's rule
 * (./row.rules.js, no page); this file only applies it: the cards slide to their new places (nothing jumps), the row
 * glides to its rest, and its edges fade while there is more to swipe that way. The child may still swipe the row.
 *
 *   const row = createRow({ stage, kit, el, items, panel })   items: Map id -> { el, id, no, atServe } in the order asked
 *   row.land(ids)  row.landAll()  row.lead(ids)  row.tick(id, done, cross?)  row.served()  row.reopen()
 */
import { rowOrder, rowRest } from "./row.rules.js";

export function createRow({ stage, kit, el, items, panel }) {
  const O = kit.order;
  let ticked = [];
  const all = () => [...items.values()];
  const done = (it) => it.el.classList.contains("done");

  // each card's place from the row's first card, in the row's own px (what its scroll is with that card at its left)
  const places = () => [...el.children].map((c) => ({ id: c.dataset.item, left: c.offsetLeft - el.firstElementChild.offsetLeft, w: c.offsetWidth }));
  // what the row shows of its cards: its width inside its own padding (a card at the row's scroll stands at its left padding)
  const shows = () => {
    const cs = getComputedStyle(el);
    return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  };
  const glide = (state) => el.scrollTo({ left: rowRest(places(), shows(), state), behavior: "smooth" });
  const kitchen = () => ({ done: all().filter(done).map((it) => it.id), atServe: all().filter((it) => it.atServe).map((it) => it.id) });

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
    stage.wait(O.rowGlideAfterMs).then(() => el.isConnected && glide(kitchen()));
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
  panel.watchRow(el, fade);
  fade();

  return {
    land(ids) {
      for (const id of ids) items.get(id).el.classList.remove("waiting");
    },
    /** The order is over: every card has landed, and the row rests by the rule. */
    landAll() {
      all().forEach((it) => it.el.classList.remove("waiting"));
      glide(kitchen());
    },
    /** While the order is said: the row glides so these cards land whole, the place before them at the row's left. */
    lead: (ids) => glide({ landing: ids }),
    tick(id, on, cross = false) {
      const it = items.get(id);
      if (!it) return;
      const now = !!on && !cross;
      it.el.classList.toggle("cross", !!cross);
      if (now === done(it)) return;
      it.el.classList.toggle("done", now);
      ticked = now ? ticked.concat(id) : ticked.filter((x) => x !== id);
      arrange();
    },
    served: () => all().forEach((it) => it.el.classList.add("done")),
    reopen() {
      all().forEach((it) => it.el.classList.remove("done", "cross"));
      ticked = [];
      arrange();
    },
  };
}
