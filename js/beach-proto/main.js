/*
 * The beach prototypes as a mode plug-in (proto-beach, 2 Nov 2026): the beach day's games with Masi in the labs so Zafar can give
 * feedback. Design: build/reports/designs/beach-boat.md (and its critique), the beach section of games-at-a-glance-2026-11-01.md;
 * the build rules: build/reports/proto-brief-2026-11-02.md. The boat day (the beach's second visit) follows: the ride, litter fishing.
 *
 *   lab.html?mode=beach-proto&game=shells&level=1   shells: bring Masi the shell (or the pile) she names; the crab under one
 *   lab.html?mode=beach-proto&game=castle&level=1   the sandcastle: which bucket, how full, tip it out; a shell on top
 *   lab.html?mode=beach-proto&game=stalls&level=1   the three stalls: pick the stall, make the food, pay with a stack of coins
 *   lab.html?mode=beach-proto&game=picnic&level=1   the picnic: who it's for (later how many, and where) on the cloth
 *   lab.html?mode=beach-proto&game=ride&level=1     the ride on the water: tap what Nani names as it floats past
 *   lab.html?mode=beach-proto&game=fishing&level=1  litter fishing: the thing Masi names, hooked and reeled up; Nani's hat last
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/beach-proto/play.js) is imported only when a stage starts.
 */

/** What the beach games need on a host page beyond what lab.html loads. */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/focus.js"],
  styles: ["css/beach-proto.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["shells", "Shells", "Masi wants shells for her castle: bring the big one or the small one (later a pile of two, a colour). A crab hides under one shell."],
  ["castle", "The sandcastle", "Masi says how the castle goes: which bucket, how full (a little, full, half), tip it out; then a shell on the tower she names."],
  ["stalls", "The three stalls", "Corn, cassava chips, coconut: Masi says what she wants; tap the stall, make it (the topping, the cone, the coconut's size), then pay with the right stack of coins."],
  ["picnic", "The picnic", "Set out the picnic: who each thing is for (Nani, Masi, Ali's box); later how many, and what. The crab steals the last chip."],
  ["ride", "The ride on the water", "The boat day: Masi's friend takes everyone out; tap what Nani names as it floats past (a bird, a boat, a fish); from L2 Nani calls quickly and slowly, and her hat blows off."],
  ["fishing", "Litter fishing", "The boat day: rubbish on the sea bed. Tap the thing Masi names, the hook drops; tap the reel to wind it up. Nani's hat comes up last."],
];

function beachGame(id) {
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
  id: "beach-proto",
  games: Object.fromEntries(GAMES.map(([id]) => [id, beachGame(id)])),
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => GAMES.map(([game, label, note]) => ({ game, label, note })),
  free: false,
  actions: ["again", "list", "home"],
};
