/*
 * The sewing games' runtime (proto-sewing, 2 Nov 2026): one screen (js/sewing-proto/kit.js), then the game's own scene and rules.
 * play(id, el, ctx) -> {destroy()}
 */
import { createSewing } from "./kit.js";
import { BIGMA, ALI, NANA } from "./art.js";
import stall from "./stall.js";
import make from "./make.js";
import mend from "./mend.js";
import fit from "./fit.js";

const GAMES = { stall, make, mend, fit };
// whoever asks is in the helper's box: Big Ma at the stall; Ali at the table and the fitting; Nana at the mend
const HOST = { stall: BIGMA, make: ALI, mend: NANA, fit: ALI };

export async function play(id, el, ctx) {
  const F = await createSewing(el, ctx, id, HOST[id] || BIGMA);
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => GAMES[id](F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("sewing-proto", id, e);
    });
  return F;
}
