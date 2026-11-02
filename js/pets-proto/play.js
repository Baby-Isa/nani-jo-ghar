/*
 * The pet hotel games' runtime (proto-pets, 2 Nov 2026): one screen (js/pets-proto/kit.js), then the game's own scene and rules.
 * play(id, el, ctx) -> {destroy()}
 */
import { createPets } from "./kit.js";
import { HANNAH } from "./art.js";
import care from "./care.js";
import home from "./home.js";

const GAMES = { care, home };

export async function play(id, el, ctx) {
  const F = await createPets(el, ctx, id, HANNAH);
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => GAMES[id](F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("pets-proto", id, e);
    });
  return F;
}
