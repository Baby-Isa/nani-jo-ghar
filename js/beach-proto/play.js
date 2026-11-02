/*
 * The beach games' runtime (proto-beach, 2 Nov 2026): one screen (js/beach-proto/kit.js, Masi in the helper's box), then the
 * game's own scene and rules. play(id, el, ctx) -> {destroy()}
 */
import { createBeach } from "./kit.js";
import { MASI, NANI } from "./art.js";
import shells from "./shells.js";
import castle from "./castle.js";
import stalls from "./stalls.js";
import picnic from "./picnic.js";
import fishing from "./fishing.js";
import ride from "./ride.js";

const GAMES = { shells, castle, stalls, picnic, ride, fishing };

export async function play(id, el, ctx) {
  const F = await createBeach(el, ctx, id, id === "ride" ? NANI : MASI); // (Nani names things on the ride: beach-boat.md §3.5)
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => GAMES[id](F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("beach-proto", id, e);
    });
  return F;
}
