/*
 * A word moment by itself (index.html?moment=<id>), for grown-ups from the labs page: the moment's file
 * (data/moments/<id>.json) made a scene (js/shared/scenes/word-moment.pictures.js momentScene) and played by the runner.
 * It plays once; a tap anywhere plays it again.
 *
 *   playMoment({ id, kit, stage, say, onError })
 */
import { loadJSON as json } from "../core/env.js";
import { createRunner } from "./runner.js";
import { createSounds } from "./kit/sounds.js";
import { momentScene } from "./scenes/word-moment.pictures.js";

export async function playMoment({ id, kit, stage, say, onError }) {
  if (!/^[a-z-]+$/.test(id)) throw new Error("which word moment? add ?moment= to the address");
  // (a moment's id is its file's name)
  const moment = { ...(await json(`data/moments/${id}.json`)), id };
  let run = null;
  const scene = momentScene({ moment, stage, say, kit, sounds: createSounds({ kit, say, stage }), send: (move) => run.send(move) });
  const once = () => {
    run = createRunner({ scenes: [scene], round: { seed: 1, met: {} }, load: (ids) => stage.load(ids), onError, onEnd: () => document.addEventListener("pointerdown", once, { once: true }) });
    globalThis.njg = { run, stage, say }; // (for the checks, as on the game's page)
    run.start();
  };
  once();
}
