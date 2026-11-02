/*
 * The town and shops prototypes as a lab mode (proto-town, 2 Nov 2026): Nani's town and market games, played in the labs so
 * Zafar can give feedback. Nani is the guide. The designs: build/reports/designs/town-map.md and shops.md (and their critiques),
 * the town section of games-at-a-glance-2026-11-01.md; the brief build/reports/proto-brief-2026-11-02.md; what each game does at
 * each level: build/reports/proto-town-2026-11-02.md.
 *
 *   lab.html?mode=town-proto&game=map&level=1     the town map: who goes where (a face, then a place)
 *   lab.html?mode=town-proto&game=serve&level=1   serve at the fruit stall (the fruit onto the scale, then the customer's bag)
 *   lab.html?mode=town-proto&game=picky&level=1   Nani's picky shopping (the big one or the small one, then her basket)
 *   lab.html?mode=town-proto&game=pay&level=1     pay (count out the coins, then the seller's open hand)
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/town-proto/play.js) is imported only when a stage starts.
 */

/** What the town needs on a host page beyond what lab.html loads (the s14 word card, the bulb, the focus; the town's sheet). */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/bulb.js", "js/shared/focus.js"],
  styles: ["css/town-proto.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["map", "The town map", "Send each one where they want to go: tap a face, then a place. They walk there and come back carrying something."],
  ["serve", "Serve at the fruit stall", "Behind the counter: tap the fruit the customer asks for onto the scale, then their bag."],
  ["picky", "Nani's picky shopping", "Two of the same thing, big and small: tap the one Nani wants (it lifts), then her basket."],
  ["pay", "Pay", "The seller says the price: count out the coins onto the counter, then tap his open hand."],
];

function townGame(id) {
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
  id: "town-proto",
  data: [],
  games: Object.fromEntries(GAMES.map(([id]) => [id, townGame(id)])),
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => GAMES.map(([game, label, note]) => ({ game, label, note })),
  free: false,
  actions: ["again", "list", "home"],
};
