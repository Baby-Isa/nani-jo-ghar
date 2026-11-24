/*
 * The level's rule for mistakes, the same in every game (the standard's principle 6; Zafar, 19 Nov): what happens to a
 * thing the child gives a dish that can still take things. Where the level refuses mistakes, a wrong thing or a wrong
 * amount is refused with the wiggle and Nani's "no"; where it lets them be made, anything goes in, every counted thing up
 * to the most of one, while a thing that goes in once (a pour, the tea) goes in once. The game answers only whether the
 * thing is wrong now and how many of it are in; the numbers are data/kit.json levels.mistakes and mostOfOne. Pure.
 *
 *   ruling({ kit, level, wrong, n, once, items, tallyIn, tallyNow }) -> { said: "in" | "no" | "full", cost: [touch], reach: [place] }
 *       wrong: is this thing wrong now for this dish (the game's); n: how many of it are in already (the game's);
 *       once: it goes in once (the game's settings); no: refused with Nani's "no"; full: refused, it has all it can take
 *       items: the card's rows; tallyIn, tallyNow: the game's tally of the dish with the thing in, and as it is
 *       cost: what a pick refused with Nani's "no" costs, as touches (dishTouches'); none for any other ruling
 *       reach: the places a thing let in reaches (placesReached'), for the ledger's play order (./touches.rules.js
 *       played); none for any other ruling (a refused pick's cost reaches its own places as it is touched)
 *   placesReached(items, tallyIn, tallyOut) -> [{ key, filler }]   the kit's one answer to "which places does this thing
 *       reach", read alike for the play order and for what it costs, so the two never disagree: each card row whose count
 *       differs with the thing in (tallyIn) and without it (tallyOut), and, for a thing nobody asked for, the row it is
 *       counted against and its own word's place (./wrong-order.rules.js strayPlace, the one maker of that place)
 *   dishTouches is the only door to what a dish's things cost: what follows is its own, kept in this file (thingCost,
 *   placesAtLook), so no caller can reach a dish's touches but through it.
 *   thingCost(items, tallyIn, tallyOut) -> [{ key, filler }]   the places one thing makes wrong: of the places it reaches
 *       (placesReached), those wrong by the kit's one dish check with it in and not so without it: a card row given too
 *       many, a "no" row given its thing, a row a thing nobody asked for is counted against, and such a thing's own
 *       word's place, card row or not; each a wrong touch for the ledger (./touches.rules.js). A pick refused costs it
 *       (tallyOut: the dish as it is), and so does a spoonful taken back (tallyIn: the dish before, tallyOut: after), so a
 *       wrong thing costs the same places however it leaves
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
  if (n >= (once ? 1 : kit.levels.mostOfOne)) return { said: "full", cost: [], reach: [] };
  if (wrong && !atLevel(kit.levels.mistakes, level)) return { said: "no", cost: dishTouches({ items, tallyIn, tallyOut: tallyNow }), reach: [] };
  return { said: "in", cost: [], reach: placesReached(items, tallyIn, tallyNow) };
}

export const dishTouches = ({ items, tallyIn, tallyOut, faults }) => (faults ? placesAtLook(items, faults) : thingCost(items, tallyIn, tallyOut).map((p) => ({ ...p, right: false })));

function thingCost(items, tallyIn, tallyOut) {
  const id = (p) => `${p.key}|${p.filler}`;
  const wrongIn = new Set(wrongPlaces(items, tallyIn).map(id));
  const wrongOut = new Set(wrongPlaces(items, tallyOut).map(id));
  return placesReached(items, tallyIn, tallyOut).filter((p) => wrongIn.has(id(p)) && !wrongOut.has(id(p)));
}

export function placesReached(items, tallyIn, tallyOut) {
  const got = (t, row) => (t.rows[row] || {}).got || 0;
  const nOf = (t, word) => (t.extra.find((x) => x.word === word) || {}).n || 0;
  const rows = items.filter((it) => got(tallyIn, it.id) !== got(tallyOut, it.id)).map((it) => it.id);
  const strays = [...new Set(tallyIn.extra.concat(tallyOut.extra).map((x) => x.word))]
    .filter((word) => nOf(tallyIn, word) !== nOf(tallyOut, word))
    .map((word) => tallyIn.extra.concat(tallyOut.extra).find((x) => x.word === word));
  strays.forEach((x) => x.against && !rows.includes(x.against) && rows.push(x.against));
  const onCard = items.filter((it) => rows.includes(it.id)).map((it) => ({ key: it.word, filler: it.id }));
  return onCard.concat(strays.map(strayPlace));
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
