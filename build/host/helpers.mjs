// Shared test helpers for build/host: the real core on a memory save, a fake voice, a self-playing fake mini-game.
import { readFileSync } from "node:fs";
import { createSave } from "../../js/core/save.js";
import { createWallet } from "../../js/core/wallet.js";
import { createScore } from "../../js/core/score.js";
import { createProgress } from "../../js/core/progress.js";
import { createLog } from "../../js/core/log.js";
import { FakeEl } from "./fake-dom.mjs";

const economy = JSON.parse(readFileSync(new URL("../../data/economy.json", import.meta.url), "utf8"));

export function makeCore({ voice } = {}) {
  const save = createSave({});
  save.init();
  save.ensurePlayer();
  const progress = createProgress({ save });
  const wallet = createWallet({ save, economy });
  const log = createLog({ save });
  return { save, progress, wallet, log, score: createScore({ save, wallet, progress, log }), voice };
}

/** A fake voice: say() plays until release(); busy() while anything plays. */
export function fakeVoice() {
  const playing = new Set();
  return {
    playing,
    say() {
      let done;
      const p = new Promise((r) => (done = r));
      const e = { done };
      playing.add(e);
      p.then(() => playing.delete(e));
      return p;
    },
    busy: () => playing.size > 0,
    stop: () => [...playing].forEach((e) => (e.done({ done: false }), playing.delete(e))),
  };
}

/** A fake mini-game that logs its lifecycle and plays itself: marks rows right, then done. */
export function fakeGame(id, { rows = ["a", "b"], wrong = [], log = [], gestures = ["tap"], levels = [1, 2, 3], extra = {} } = {}) {
  return Object.assign(
    {
      id,
      gestures,
      levels,
      mount(el, ctx) {
        log.push(`${id}:mount:L${ctx.level}`);
        const node = el.appendChild(new FakeEl("div", { className: `g-${id}` }));
        return {
          async start() {
            log.push(`${id}:start`);
            await ctx.wait(10);
            rows.forEach((r) => ctx.mark(r, !wrong.includes(r), { word: `w-${r}` }));
            ctx.done();
          },
          destroy() {
            log.push(`${id}:destroy`);
            node.remove();
          },
        };
      },
    },
    extra
  );
}

