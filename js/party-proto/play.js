/*
 * The birthday prototypes' runtime (proto-party, 2 Nov 2026): one screen (js/party-proto/kit.js), then the game's own scene and
 * rules. play(id, el, ctx) -> {destroy()}. A game module exports {opts, run(F, ctx)}: opts.person is the host in the box.
 */
import { createParty } from "./kit.js";

const LOAD = {
  balloon: () => import("./balloon.js"),
  how: () => import("./how.js"),
  statues: () => import("./statues.js"),
  cake: () => import("./cake.js"),
  presents: () => import("./presents.js"),
};

export async function play(id, el, ctx) {
  const g = (await LOAD[id]()).default;
  const F = await createParty(el, ctx, id, g.opts || {});
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => g.run(F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("party proto", id, e);
    });
  return F;
}
