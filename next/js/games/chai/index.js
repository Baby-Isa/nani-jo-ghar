/* The game, as the engine sees it: its rules, and the drawing of one vessel inside the box it is given. */
import * as rules from "./rules.js";
import { drawPan } from "./mechanic.js";

export const game = { rules, draw: drawPan };
