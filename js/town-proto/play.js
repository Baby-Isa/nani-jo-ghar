/*
 * The town prototypes' runtime (proto-town, 2 Nov 2026): one screen (js/town-proto/kit.js), then the game's own scene and rules.
 * play(id, el, ctx) -> {destroy()}. A game module exports {opts, run(F, ctx)}.
 */
import { createTown } from "./kit.js";

const LOAD = {
  map: () => import("./map.js"),
  serve: () => import("./serve.js"),
  picky: () => import("./picky.js"),
  pay: () => import("./pay.js"),
};

export async function play(id, el, ctx) {
  const g = (await LOAD[id]()).default;
  const F = await createTown(el, ctx, id, g.opts || {});
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => g.run(F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("town proto", id, e);
    });
  return F;
}
