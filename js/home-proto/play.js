/*
 * The home prototypes' runtime (proto-home, 2 Nov 2026): one screen (js/home-proto/kit.js), then the game's own scene and rules.
 * play(id, el, ctx) -> {destroy()}
 */
import { createHome } from "./kit.js";

const LOAD = {
  hide: () => import("./hide.js"),
  fetch: () => import("./fetch.js"),
  clean: () => import("./clean.js"),
};

export async function play(id, el, ctx) {
  const g = (await LOAD[id]()).default;
  const F = await createHome(el, ctx, id);
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => g(F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("home-proto", id, e);
    });
  return F;
}
