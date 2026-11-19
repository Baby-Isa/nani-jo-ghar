/*
 * The level's rule for mistakes, the same in every game (the standard's principle 6; Zafar, 19 Nov): what happens to a
 * thing the child gives a dish that can still take things. Where the level refuses mistakes, a wrong thing or a wrong
 * amount is refused with the wiggle and Nani's "no"; where it lets them be made, anything goes in, every counted thing up
 * to the most of one, while a thing that goes in once (a pour, the tea) goes in once. The game answers only whether the
 * thing is wrong now and how many of it are in; the numbers are data/kit.json levels.mistakes and mostOfOne. Pure.
 *
 *   ruling({ kit, level, wrong, n, once }) -> "in" | "no" | "full"
 *       wrong: is this thing wrong now for this dish (the game's); n: how many of it are in already (the game's);
 *       once: it goes in once (the game's settings); no: refused with Nani's "no"; full: refused, it has all it can take
 */
import { atLevel } from "../round.js";

export function ruling({ kit, level, wrong, n, once }) {
  if (n >= (once ? 1 : kit.levels.mostOfOne)) return "full";
  if (wrong && !atLevel(kit.levels.mistakes, level)) return "no";
  return "in";
}
