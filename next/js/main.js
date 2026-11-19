/*
 * The page's start. It names no game: the game comes from the address (?game=, ?level=), its settings name its
 * family, and the family hands the runner its list of scenes. ?moment=<id> plays one word moment by itself instead
 * (js/shared/moment-page.js), for the labs page.
 */
import { createArt } from "./shared/art.js";
import { createSay } from "./shared/say.js";
import { createStage } from "./shared/stage.js";
import { createFrame, setLook } from "./shared/frame.js";
import { createRunner } from "./shared/runner.js";
import { newRound, levelsOf } from "./shared/round.js";
import { loadProgress, saveRound, newPlayer, playerName, OWN_PLAYER } from "./shared/progress.js";
import { loadJSON as json } from "./core/env.js";

const ask = new URLSearchParams(location.search);
/** Something broke: said plainly over the page, never a silent stop. */
function stopped(e) {
  const box = document.createElement("pre");
  box.className = "stopped";
  box.textContent = String(e.message);
  document.body.appendChild(box);
}

async function start() {
  const id = ask.get("game");
  const moment = ask.get("moment");
  if (!moment && (!id || !/^[a-z-]+$/.test(id))) throw new Error("which game? add ?game= to the address");
  const [kit, registry] = await Promise.all([json("data/kit.json"), json("data/art/registry.json")]);
  setLook(kit);
  const frame = createFrame({ kit });
  const art = createArt(registry, { build: globalThis.NJG_BUILD === "store" ? "store" : "test" });
  const stage = await createStage({ art, kit, frame, renderer: ask.get("draw") || "auto" });
  const say = await createSay({ voice: kit.voice, wait: stage.wait });
  // upright, the whole round waits where it is behind the turn card (pictures, moves, voice, sounds) and goes on when turned
  stage.onHold((on) => say.hold(on));
  frame.onResize(() => stage.hold(frame.upright()));
  // nothing is drawn or said before the fonts are in, the phone is on its side, and (on a phone) the first tap is made
  await frame.ready();
  if (moment) return (await import("./shared/moment-page.js")).playMoment({ id: moment, kit, stage, say, onError: stopped });

  const [settings, people] = await Promise.all([json(`data/games/${id}.json`), json("data/people.json")]);
  const family = settings.family;
  const [familySettings, { game }, familyCode] = await Promise.all([json(`data/${family}.json`), import(`./games/${id}/index.js`), import(`./${family}/index.js`)]);
  const level = Math.max(1, Math.min(levelsOf(kit), Number(ask.get("level")) || 1));
  const progress = loadProgress(ask.get("player") || OWN_PLAYER);
  // "New player" in the cog: the same link with a fresh player, started again (the plain link stays the child's)
  const player = {
    name: playerName(progress.id, kit.cog.player),
    renew() {
      const next = new URLSearchParams(location.search);
      next.set("player", newPlayer());
      location.search = next.toString();
    },
  };

  let offTick = null;
  async function play() {
    const seed = Number(ask.get("seed")) || Math.floor(Math.random() * 2 ** 31);
    const round = newRound({ game: id, settings, people: people.people, level, seed, player: progress.player, ladder: progress.ladder, met: progress.met, today: new Date().toDateString(), best: progress.best, earned: progress.earned, card: game.rules.card });
    const parts = { game, settings, [family]: familySettings, kit, people: people.people, stage, say, art, round, player };
    let run = null;
    const scenes = await familyCode.scenesWithViews({ ...parts, send: (move) => run.send(move), tree: () => run.tree() });
    run = createRunner({
      scenes,
      round,
      load: (ids) => stage.load(ids),
      onError: stopped,
      onEnd(ended) {
        saveRound(progress, ended, kit.ladder);
        if (ended.choice === "again") play();
      },
    });
    globalThis.njg = { run, stage, say, scenes, frame }; // for the checks, which play the page as a child would and read where it is
    if (offTick) offTick();
    // (behind the turn card the stage is held, so no time passes and nothing boils over)
    offTick = stage.onTick((ms) => !stage.held() && run.send({ type: "time", ms }));
    run.start();
  }
  await play();
}

start().catch((e) => {
  stopped(e);
  throw e;
});
