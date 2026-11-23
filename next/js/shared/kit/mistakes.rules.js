/*
 * The level's rule for mistakes, the same in every game (the standard's principle 6; Zafar, 19 Nov): what happens to a
 * thing the child gives a dish that can still take things. Where the level refuses mistakes, a wrong thing or a wrong
 * amount is refused with the wiggle and Nani's "no"; where it lets them be made, anything goes in, every counted thing up
 * to the most of one, while a thing that goes in once (a pour, the tea) goes in once. The game answers only whether the
 * thing is wrong now and how many of it are in; the numbers are data/kit.json levels.mistakes and mostOfOne. Pure.
 *
 *   ruling({ kit, level, wrong, n, once, items, tallyIn }) -> { said: "in" | "no" | "full", cost: [rowId] }
 *       wrong: is this thing wrong now for this dish (the game's); n: how many of it are in already (the game's);
 *       once: it goes in once (the game's settings); no: refused with Nani's "no"; full: refused, it has all it can take
 *       items: the card's rows; tallyIn: the game's tally of the dish with the thing in
 *       cost: what a pick refused with Nani's "no" costs, the card's rows it would have made wrong had it gone in (judged
 *       by the kit's one dish check), each a wrong touch for the ledger (./touches.rules.js); none for any other ruling
 *
 * Only a right first touch counts as progress, in every game (Zafar, 23 Nov; non-negotiable 3). A refused pick still
 * teaches: it plays on, Nani says "no" and nothing is marked, but it costs the rows it is about their first try, as the
 * same pick let in costs them at the look; so a child who taps both until one is accepted never wins the word. The cost
 * comes with the ruling, so no caller can say "no" and forget it.
 */
import { atLevel } from "../round.js";
import { faultsOf } from "./wrong-order.rules.js";

export function ruling({ kit, level, wrong, n, once, items, tallyIn }) {
  if (n >= (once ? 1 : kit.levels.mostOfOne)) return { said: "full", cost: [] };
  if (wrong && !atLevel(kit.levels.mistakes, level)) return { said: "no", cost: refusedCost(items, tallyIn) };
  return { said: "in", cost: [] };
}

function refusedCost(items, tally) {
  // a row given too many, a "no" row given its thing, or a row a thing nobody asked for is counted against
  const rows = faultsOf(items, tally).flatMap((f) => (f.id === null ? [f.against] : f.kind === "many" || f.kind === "extra" ? [f.id] : []));
  return [...new Set(rows.filter((id) => items.some((it) => it.id === id)))];
}
