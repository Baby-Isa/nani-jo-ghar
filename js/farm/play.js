/*
 * The farm games' runtime (proto-farm, 1 Nov 2026): one screen (js/farm/kit.js), then the game's own scene and rules.
 * play(id, el, ctx) -> {destroy()}
 */
import { createFarm } from "./kit.js";
import feed from "./feed.js";
import eggs from "./eggs.js";
import homeDusk from "./home-dusk.js";
import growPick from "./grow-pick.js";

const GAMES = { feed, eggs, "home-dusk": homeDusk, "grow-pick": growPick };

export async function play(id, el, ctx) {
  const F = await createFarm(el, ctx, id);
  ctx.test.state("playing");
  Promise.resolve()
    .then(() => GAMES[id](F, ctx))
    .catch((e) => {
      if (!F.dead && !(e && e.name === "HostLeft")) console.error("farm", id, e);
    });
  return F;
}
