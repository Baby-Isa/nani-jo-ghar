/*
 * The page's start. It names no game: the game comes from the address (?game=, ?level=), its settings name its
 * family, and the family hands the runner its list of scenes.
 */
import { createArt } from "./shared/art.js";
import { createSay } from "./shared/say.js";
import { createStage } from "./shared/stage.js";
import { createFrame } from "./shared/frame.js";
import { createRunner } from "./shared/runner.js";
import { newRound } from "./shared/round.js";
import { loadProgress, saveRound } from "./shared/progress.js";

const ask = new URLSearchParams(location.search);
const json = (path) => fetch(path).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`could not load ${path}`))));

async function start() {
  const id = ask.get("game");
  const level = Math.max(1, Math.min(4, Number(ask.get("level")) || 1));
  if (!id || !/^[a-z-]+$/.test(id)) throw new Error("which game? add ?game= to the address");
  const [settings, kit, people, registry] = await Promise.all([json(`data/games/${id}.json`), json("data/kit.json"), json("data/people.json"), json("data/art/registry.json")]);
  const family = settings.family;
  const [familySettings, { game }, familyCode] = await Promise.all([json(`data/${family}.json`), import(`./games/${id}/index.js`), import(`./${family}/index.js`)]);

  const root = document.documentElement;
  for (const [name, value] of Object.entries(kit.look.vars)) root.style.setProperty(`--${name}`, value);
  const frame = createFrame({ kit });

  const art = createArt(registry, { build: globalThis.NJG_BUILD === "store" ? "store" : "test" });
  const say = await createSay({ voice: kit.voice });
  const stage = await createStage({ art, kit, frame, renderer: ask.get("draw") || "auto" });
  const progress = loadProgress(ask.get("player") || "child");
  // upright, the whole round waits where it is behind the turn card (pictures, moves, voice, sounds) and goes on when turned
  stage.onHold((on) => say.hold(on));
  frame.onResize(() => stage.hold(frame.upright()));
  // nothing is drawn or said before the fonts are in, the phone is on its side, and (on a phone) the first tap is made
  await frame.ready();

  let offTick = null;
  async function play() {
    const seed = Number(ask.get("seed")) || Math.floor(Math.random() * 2 ** 31);
    const round = newRound({ game: id, settings, people: people.people, level, seed, player: progress.player, ladder: progress.ladder, met: progress.met, today: new Date().toDateString(), best: progress.best, earned: progress.earned, card: game.rules.card });
    const parts = { game, settings, [family]: familySettings, kit, people: people.people, stage, say, art, round };
    let run = null;
    const scenes = await familyCode.scenesWithViews({ ...parts, send: (move) => run.send(move), tree: () => run.tree() });
    run = createRunner({
      scenes,
      round,
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
  document.body.insertAdjacentHTML("beforeend", `<pre style="position:fixed;inset:auto 8px 8px 8px;z-index:9999;background:#fff;padding:8px;white-space:pre-wrap">${String(e.message).replace(/</g, "&lt;")}</pre>`);
  throw e;
});
