/*
 * The clinic prototypes' runtime (proto-clinic, 2 Nov 2026): one screen (js/clinic/proto/kit.js), then the game's own scene and rules.
 * play(id, el, ctx) -> {destroy()}. A game module exports {opts, run(F, ctx)}: opts.sentence picks the sentence layout.
 */
import { createProto } from "./kit.js";

const LOAD = {
  where: () => import("./where.js"),
  hand: () => import("./hand.js"),
  nose: () => import("./nose.js"),
  drinks: () => import("./drinks.js"),
};

export async function play(id, el, ctx) {
  const g = (await LOAD[id]()).default;
  const F = await createProto(el, ctx, id, g.opts || {});
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => g.run(F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("clinic proto", id, e);
    });
  return F;
}
