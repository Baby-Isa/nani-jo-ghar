/*
 * The level's rule for mistakes, the same in every game (the standard's principle 6; Zafar, 19 Nov): what happens to a
 * thing the child gives a dish that can still take things. Where the level refuses mistakes, a wrong thing or a wrong
 * amount is refused with the wiggle and Nani's "no"; where it lets them be made, anything goes in, every counted thing up
 * to the most of one, while a thing that goes in once (a pour, the tea) goes in once. The game answers only whether the
 * thing is wrong now and how many of it are in; the numbers are data/kit.json levels.mistakes and mostOfOne. Pure.
 *
 *   ruling({ kit, level, wrong, n, once, items, tallyIn, tallyNow }) -> { said: "in" | "no" | "full", cost: [touch] }
 *       wrong: is this thing wrong now for this dish (the game's); n: how many of it are in already (the game's);
 *       once: it goes in once (the game's settings); no: refused with Nani's "no"; full: refused, it has all it can take
 *       items: the card's rows; tallyIn, tallyNow: the game's tally of the dish with the thing in, and as it is
 *       cost: what a pick refused with Nani's "no" costs, as touches (dishTouches'); none for any other ruling
 *   dishTouches is the only door: what follows is its own, kept in this file (thingCost, placesAtLook), so no caller can
 *   reach a dish's touches but through it.
 *   thingCost(items, tallyIn, tallyOut) -> [{ key, filler }]   the places one thing makes wrong, judged by the kit's one
 *       dish check: wrong with it in and not so without it; the card's rows (key: the row's word, filler: its id) given
 *       too many, a "no" row given its thing, a row a thing nobody asked for is counted against; and such a thing's own
 *       word's place (./wrong-order.rules.js strayPlace), card row or not; each a wrong touch for the ledger
 *       (./touches.rules.js). A pick refused costs it (tallyOut: the dish as it is), and so does a spoonful taken back
 *       (tallyIn: the dish before, tallyOut: after), so a wrong thing costs the same places however it leaves
 *   dishTouches({ items, tallyIn, tallyOut } | { items, faults }) -> [{ key, filler, right }]   the one call a family makes
 *       for what a dish's things touch, so none can forget a cost: a thing left out (refused: tallyIn with it, tallyOut the
 *       dish as it is) or taken out (tallyIn before, tallyOut after), thingCost's places, each wrong; the dish looked at
 *       (faults: its dishCheck's), a touch of every place, right or not (placesAtLook)
 *   placesAtLook(items, faults) -> [{ key, filler, right }]   a touch of each place at a look, for the ledger
 *       (./touches.rules.js, which alone keeps whether its first try was lost): each card row (key: its word, filler: its
 *       id), right when it is right and costed by no extra; and each thing nobody asked for, its own place, wrong
 *
 * Only a right first touch counts as progress, in every game (Zafar, 23 Nov; non-negotiable 3). A refused pick still
 * teaches: it plays on, Nani says "no" and nothing is marked, but it costs the rows it is about their first try, as the
 * same pick let in costs them at the look; so a child who taps both until one is accepted never wins the word. The cost
 * comes with the ruling, so no caller can say "no" and forget it.
 */
import { atLevel } from "../round.js";
import { faultsOf, strayPlace } from "./wrong-order.rules.js";

export function ruling({ kit, level, wrong, n, once, items, tallyIn, tallyNow }) {
  if (n >= (once ? 1 : kit.levels.mostOfOne)) return { said: "full", cost: [] };
  if (wrong && !atLevel(kit.levels.mistakes, level)) return { said: "no", cost: dishTouches({ items, tallyIn, tallyOut: tallyNow }) };
  return { said: "in", cost: [] };
}

export const dishTouches = ({ items, tallyIn, tallyOut, faults }) => (faults ? placesAtLook(items, faults) : thingCost(items, tallyIn, tallyOut).map((p) => ({ ...p, right: false })));

function thingCost(items, tallyIn, tallyOut) {
  const id = (p) => `${p.key}|${p.filler}`;
  const out = new Set((tallyOut ? wrongPlaces(items, tallyOut) : []).map(id));
  return wrongPlaces(items, tallyIn).filter((p) => !out.has(id(p)));
}

function placesAtLook(items, faults) {
  return items
    .map((it) => ({ key: it.word, filler: it.id, right: faults.some((f) => f.id === it.id && f.kind === "right") && !faults.some((f) => f.id === null && f.against === it.id) }))
    .concat(faults.filter((f) => f.id === null).map((f) => ({ ...strayPlace(f), right: false })));
}

function wrongPlaces(items, tally) {
  const faults = faultsOf(items, tally);
  // a row given too many, a "no" row given its thing, or a row a thing nobody asked for is counted against
  const rows = faults.flatMap((f) => (f.id === null ? [f.against] : f.kind === "many" || f.kind === "extra" ? [f.id] : []));
  const onCard = items.filter((it) => rows.includes(it.id)).map((it) => ({ key: it.word, filler: it.id }));
  return onCard.concat(faults.filter((f) => f.id === null).map(strayPlace));
}
