/*
 * Cook as a mode plug-in (step 3, R4; C4, decision 45; target-model § 6; docs/architecture/building-games.md). The one
 * game host (js/shared/host.js) runs Cook's stations as mini-games, and the shell (js/shared/mode.js, lab.html) starts
 * them for a lab, story mode and free play:
 *
 *   lab.html?mode=cook&game=chai-tray&level=2          one station alone (every Station-lab station, the recipes)
 *   lab.html?mode=cook&play=story&params=…             story mode: one recipe across its stations, the pantry first (H49, H50)
 *   lab.html?mode=cook&play=free                       free play: the open kitchen, one customer a round, Next brings the next
 *
 * C4: every stage MOUNTS Cook directly in the element the host gives it (js/cook/mount.js; screen: "own", since Cook
 * draws its own sidebar and play area), no frame: it asks Cook for one station or one order (Cook.testHook.lab,
 * .order), catches Cook's end-of-round screen through Cook.hostResults (the host scores the whole plan once:
 * Score.finish, the badges, the best, the pocket money, the story line; and shows the one end screen) and unmounts
 * Cook at destroy. Mounted with {hosted: true}, Cook scores and pays nothing itself. What Cook needs on the host's
 * page that the host page may not have (Phaser, the frame, its styles) is in each stage's `needs`.
 *
 * Node-importable (build/gen_labs.mjs reads lab()): Cook's runtime (js/cook/mount.js) is imported only when a stage
 * starts. Cook's own page (cook.html: the title, the story days, the shop; js/cook/page.js) mounts the same plug-in.
 */

/** What Cook needs on a host page (loaded by the shell before the round: mode.js loadNeeds), in cook.html's order. */
export const NEEDS = {
  scripts: [
    "js/vendor/phaser.min.js",
    "js/shared/frame.js",
    "js/shared/family-voice.js",
    "js/shared/uistore.js",
    "js/shared/sfx.js",
    "js/shared/results.js",
    "js/shared/onboard.js",
    "js/shared/fit.js",
    "js/shared/stage.js",
    "js/shared/bulb.js",
    "js/shared/tally.js",
    "js/shared/focus.js",
    "js/shared/guide.js",
    "js/shared/order-card.js",
    "js/shared/request-popup.js",
    "js/shared/buttons.js",
  ],
  // all of cook.html's, in its order (the shared ones again after css/cook.css, so they win where they did there)
  styles: [
    "css/shared/app.css",
    "css/shared/tokens.css",
    "css/shared/frame.css",
    "css/cook.css",
    "css/shared/results.css",
    "css/shared/onboard.css",
    "css/shared/guide.css",
    "css/shared/order-card.css",
    "css/shared/buttons.css",
    "css/shared/tally.css",
    "css/shared/focus.css",
    "css/cook-side-v2.css",
  ],
};

/** The Station lab's kept stations (data/cook.json lab.stations), with the gestures each declares (E13). */
const STATIONS = [
  ["fetch", "Nani's pantry", ["tap"]],
  ["chai-tray", "Chai tray", ["tap"]],
  ["maani-line", "Maani line", ["tap", "circle", "swipe"]],
  ["mishkaki-grill", "Sekelo grill", ["tap", "drag"]],
  ["daar", "Daar", ["tap", "swipe", "circle"]],
  ["chop", "Chop", ["tap", "swipe"]],
  ["tadka", "Tadka (lab only)", ["tap"]], // decision 62 (DAAR-15): in the labs, not in the first launch (data/cook.json lab.notInLaunch)
  ["stir", "Stir", ["circle"]],
  ["assemble", "Chaat bowl", ["tap"]],
  ["samosa", "Samosa", ["tap", "swipe"]],
];
/** Whole recipes, every station in turn (the Station lab's "recipe:<id>"). */
const RECIPES = [
  ["chai", "Chai"],
  ["maani", "Maani"],
  ["daal", "Daal"],
  ["chaat", "Chaat bowl"],
  ["samosa", "Samosa"],
  ["mishkaki", "Sekelo"],
];
const LEVELS = [1, 2, 3, 4];

/**
 * One Cook mini-game: Cook mounted in the host's element. run(hook, ctx) asks Cook for its round (a promise that
 * settles when Cook's own end screen would open); the caught end screen becomes this stage's result.
 */
function cookStage(id, { label, gestures = ["tap"], levels = LEVELS, run }) {
  return {
    id,
    gestures,
    levels,
    screen: "own",
    needs: NEEDS,
    adapter: { of: "cook", key: id, label },
    mount(el, ctx) {
      let stopped = false;
      let runtime = null;
      let C = null;
      return {
        async start() {
          ctx.test.state("loading");
          runtime = await import("./mount.js");
          if (stopped) return;
          const cook = await runtime.mount(el, { hosted: true, speed: ctx.params.speed });
          if (stopped) return;
          C = cook.Cook;
          // Cook's end-of-round screen: caught, not shown (the host shows the one end screen for the plan)
          let round = null;
          const R = globalThis.Results;
          C.hostResults = {
            show(o) {
              round = o;
              const p = Promise.resolve({ action: "done" });
              p.el = null;
              return p;
            },
            bestKey: (...a) => (R && R.bestKey ? R.bestKey(...a) : a.join("/")),
            current: () => null,
          };
          ctx.test.state("playing");
          const out = await run(C.testHook, ctx);
          if (stopped) return;
          if (out && out.skipped) return ctx.done({ tasks: 0 });
          const r = round || { right: 0, total: 0, hints: 0, words: [] };
          ctx.done({
            right: r.right,
            total: r.total,
            marks: r.marks,
            hints: r.hints || 0,
            timeMs: r.timeMs,
            tasks: out && out.tasks,
            // the words in the forms the order used (SH-02); Cook's own word records feed word progress already
            words: (r.words || []).map((x) => ({ id: x.id, kutchi: x.kutchi, english: x.english, right: x.right })),
          });
        },
        /** Cook's own expectation (Cook draws on this page now: its coordinates are the page's). */
        expect() {
          try {
            const e = C && C.testHook.expectation();
            return e ? Object.assign({ in: "cook" }, e) : null;
          } catch (e) {
            return null;
          }
        },
        destroy() {
          stopped = true;
          if (C) C.hostResults = null;
          if (runtime) runtime.unmount();
        },
      };
    },
  };
}

const labStage = (key, label, gestures) =>
  cookStage(key.replace(/[^a-z0-9-]/g, "-"), { label, gestures, run: (hook, ctx) => hook.lab(key, ctx.params.guided !== false, { level: ctx.level }) });

const games = {};
STATIONS.forEach(([key, label, gestures]) => (games[key] = labStage(key, label, gestures)));
RECIPES.forEach(([r, label]) => (games[`recipe-${r}`] = labStage(`recipe:${r}`, `${label} (the whole recipe)`, ["tap", "swipe", "circle", "drag"])));
// story mode's first stage: Nani's pantry list for the dish (only the first time that dish is made today: H15, H49)
games.pantry = cookStage("pantry", { label: "Nani's pantry, for the dish", gestures: ["tap"], run: (hook, ctx) => hook.order({ pantry: true, dish: ctx.params.dish || "chai", level: ctx.level }) });
// one customer's order (story: the errand's dish; free play: a dish already taught, chosen by Cook)
games.order = cookStage("order", {
  label: "A customer's order",
  gestures: ["tap", "swipe", "circle", "drag"],
  run: (hook, ctx) => hook.order({ dish: ctx.params.dish || null, who: ctx.params.who || null, free: ctx.play && ctx.play.play === "free", level: ctx.level }),
});

export default {
  id: "cook",
  data: [],
  games,
  /**
   * story: one recipe across its stations (the errand's params.dish, chai if none), the pantry first (H49, H50);
   * free: the open kitchen, one customer a round, Next brings the next (free.endless);
   * lab: one station (game) alone, or the story plan as a lab round.
   */
  plan(entry) {
    const p = entry.params || {};
    if (entry.game) return [{ game: entry.game, level: entry.level }];
    if (entry.play === "free") return { game: "open-kitchen", stages: [{ game: "order" }] };
    const dish = p.dish || "chai";
    return { game: `story-${dish}`, stages: [{ game: "pantry", params: { dish } }, { pause: "after-pantry" }, { game: "order", params: { dish } }] };
  },
  lab: () =>
    STATIONS.map(([key, label]) => ({ game: key, label: `Cook: ${label}`, note: "A Station-lab station through the one game host." }))
      .concat(RECIPES.map(([r, label]) => ({ game: `recipe-${r}`, label: `Cook: ${label}, every station`, note: "A whole recipe, every station in turn." })))
      .concat([
        { game: "order", label: "Cook: one customer", note: "One order from a family member, served, then the one end screen." },
        { game: null, label: "Cook: a story round (chai)", note: "Nani's pantry first, then the chai order: one plan, one end screen.", levels: LEVELS },
      ]),
  free: { endless: true },
  actions: ["again", "next", "home"],
  states: () => ["cook/<station>", "results"],
};
