/*
 * The school games' runtime (proto-school, 2 Nov 2026): one screen (js/school-proto/kit.js), then the game's own scene and rules.
 * play(id, el, ctx) -> {destroy()}
 */
import { createSchool } from "./kit.js";
import { NANI, TEACHER } from "./art.js";
import clock from "./clock.js";
import ready from "./ready.js";
import bag from "./bag.js";
import board from "./board.js";

const GAMES = { clock, ready, bag, board };
const HOST = { clock: NANI, ready: NANI, bag: NANI, board: TEACHER };

export async function play(id, el, ctx) {
  const F = await createSchool(el, ctx, id, HOST[id] || NANI);
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => GAMES[id](F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("school-proto", id, e);
    });
  return F;
}
