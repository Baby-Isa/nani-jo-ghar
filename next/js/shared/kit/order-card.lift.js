/*
 * An order card lifted out of the side panel for the wrong-order pop-up (./wrong-order.js): built by the order card's own
 * builders, the same card and item cards as in the panel, open, grown by one zoom where it stands. Its place in the panel
 * is kept, the panel's card unseen there, until the lifted one lands again.
 *
 *   const { lift, line } = createLift({ say, kit, seats, shell, itemCard, make, still })     (./order-card.js gives them)
 *   lift(seat, slots, host, { english }) -> { el, k, slots: [{ el, own, made, line, outline }], land() }
 *       the card, put in `host` (the pop-up places and grows it; k is the panel's own scale, the zoom that draws it at the
 *       panel's size), its row in slots, one for each of the rules' slots (./wrong-order.rules.js playOf), the ones nobody
 *       asked for after a wider gap; in each, own: its row's own card (unmarked: the pop-up stamps each card's mark in its
 *       turn; behind what was made, unseen where it is missing), made: a card of the thing as it went in, on top (line: its word), outline: the
 *       kit's dotted empty card where a thing is missing (Zafar, 20 Nov: shown from the opening). Every help is open on it,
 *       whatever the level: each picture whole, each word written, and its English written out where `english`, else none
 *       (Zafar, 20 Nov: "unblur everything for the pop up wrong card, because we should give all the assistance
 *       necessary"). Its item cards are fitted as one row, as the panel's are. Its speakers work; nothing else on it is a
 *       button. land(): the panel's card shows again and the lifted one goes.
 *   line(seat, host) -> { el, land() }   the card's folded line, as served (the pop-up shows its tick only once it marks
 *       it: Zafar, 21 Nov), nothing on it to press, in
 *       `host` (the pop-up's stack); land() as the card's
 */
import { wireSpeaker, spaceWords } from "./word-card.js";

export function createLift({ say, kit, seats, shell, itemCard, make, still }) {
  /** Out of the panel into `into`: the panel's card unseen in its place, its size (its own --p) kept. */
  const takeOut = (seat, el, into) => {
    const home = seats[seat].el;
    el.style.setProperty("--p", getComputedStyle(home).getPropertyValue("--p"));
    still(el.querySelector(".ocard-top"));
    home.style.visibility = "hidden";
    into.append(el);
    return () => (el.remove(), (home.style.visibility = ""));
  };

  function lift(seat, slots, into, { english = true } = {}) {
    const s = seats[seat];
    const el = shell(seat);
    el.classList.add("lifted");
    el.classList.toggle("no-english", !english);
    // (its item cards the panel's own width and padding, measured there, for its row is not the panel's row)
    const first = s.items.values().next().value.el;
    el.style.setProperty("--wo-iw", `${first.offsetWidth}px`);
    el.style.setProperty("--wo-pad", getComputedStyle(first).paddingLeft);
    const row = el.querySelector(".orow");
    const own = (id) => {
      const it = s.items.get(id);
      const c = itemCard(it, s.person, it.line, { whole: true });
      still(c, ".speaker");
      wireSpeaker(c, { say, line: it.line });
      return c;
    };
    const out = slots.map((sl, i) => {
      const slot = document.createElement("div");
      slot.className = `slot${!sl.row && (i === 0 || slots[i - 1].row) ? " extra" : ""}`;
      const at = { el: slot, own: null, made: null, line: null, outline: null };
      if (sl.holds === null) {
        at.outline = Object.assign(document.createElement("div"), { className: "icard waiting" });
        slot.append(at.outline);
      }
      if (sl.row) {
        at.own = own(sl.row);
        at.own.classList.toggle("unseen", sl.holds === null);
        slot.append(at.own);
      }
      if (sl.holds === "made") {
        const m = make(seat, sl.made);
        [at.made, at.line] = [m.el, m.line];
        slot.append(m.el);
      }
      row.append(slot);
      return at;
    });
    const land = takeOut(seat, el, into);
    // (one row, as the panel's: one size for every Kutchi word and one for every English, the row's smallest)
    spaceWords(out.flatMap((at) => [at.own, at.made]).filter(Boolean), kit);
    return { el, k: first.getBoundingClientRect().width / first.offsetWidth || 1, slots: out, land };
  }

  function line(seat, into) {
    const el = shell(seat);
    el.classList.add("folded", "served", "wo-line");
    el.style.width = `${seats[seat].el.offsetWidth}px`;
    return { el, land: takeOut(seat, el, into) };
  }

  return { lift, line };
}
