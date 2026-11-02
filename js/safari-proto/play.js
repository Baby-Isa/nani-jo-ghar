/*
 * The safari games' runtime (proto-safari, 2 Nov 2026): one screen (js/safari-proto/kit.js), then the game's own scene and rules.
 * play(id, el, ctx) -> {destroy()}
 */
import { createSafari } from "./kit.js";
import { HANNAH } from "./art.js";
import snap from "./snap.js";
import hiding from "./hiding.js";

const GAMES = { snap, hiding };

export async function play(id, el, ctx) {
  const F = await createSafari(el, ctx, id, HANNAH);
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => GAMES[id](F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("safari-proto", id, e);
    });
  return F;
}
