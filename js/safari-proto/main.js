/*
 * The safari prototypes as a mode plug-in (proto-safari, 2 Nov 2026): Hannah Mami's two safari games in the labs so Zafar can
 * give feedback. Design: build/reports/designs/safari.md (and its critique), the safari section of
 * games-at-a-glance-2026-11-01.md; the build rules: build/reports/proto-brief-2026-11-02.md.
 *
 *   lab.html?mode=safari-proto&game=snap&level=1     Snap from the jeep: photograph the animal Hannah Mami names
 *   lab.html?mode=safari-proto&game=hiding&level=1   Who's hiding?: find who she sees in the long grass
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/safari-proto/play.js) is imported only when a stage starts.
 */

/** What the safari games need on a host page beyond what lab.html loads. */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/bulb.js", "js/shared/focus.js"],
  styles: ["css/safari-proto.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["snap", "Snap from the jeep", "The jeep stops by the animals: Hannah Mami names one (from L2 what it's doing, from L4 big or small). Tap it, the frame goes gold, tap inside: the photo prints."],
  ["hiding", "Who's hiding?", "Animals hide in the long grass with one part showing: Hannah Mami says who (from L2 the part, from L3 what it looks like). Tap the clump; then everyone hides again."],
];

function safariGame(id) {
  return {
    id,
    gestures: ["tap"],
    levels: [1, 2, 3, 4],
    needs: NEEDS,
    mount(el, ctx) {
      let api = null;
      let stopped = false;
      return {
        async start() {
          ctx.test.state("loading");
          const m = await import("./play.js");
          if (stopped) return;
          api = await m.play(id, el, ctx);
          if (stopped && api) api.destroy();
        },
        destroy() {
          stopped = true;
          if (api) api.destroy();
          api = null;
        },
      };
    },
  };
}

export default {
  id: "safari-proto",
  games: Object.fromEntries(GAMES.map(([id]) => [id, safariGame(id)])),
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => GAMES.map(([game, label, note]) => ({ game, label, note })),
  free: false,
  actions: ["again", "list", "home"],
};
