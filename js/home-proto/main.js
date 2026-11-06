/*
 * A day at home, the prototypes (proto-home, 2 Nov 2026): Nani, Simba and Zazu in Nani's house, drawn as a doll's house
 * (Zafar, 1 Nov). Played in the labs so Zafar can give feedback; the older home modes (js/tidy/, js/find/) are untouched.
 * Designs: build/reports/designs/hide-and-seek.md, pick-it-up-put-it-back.md, clean-up-day.md (and their critiques); what each
 * game does at each level: build/reports/proto-home-2026-11-02.md.
 *
 *   lab.html?mode=home-proto&game=hide&level=1     hide and seek: Simba and Zazu hide in Nani's bedroom; Nani says where to look
 *   lab.html?mode=home-proto&game=fetch&level=1    pick it up and put it back: fetch Nana's things, then put back what Simba knocked down
 *   lab.html?mode=home-proto&game=clean&level=1    the clean-up: the bathroom; switch off, close, turn off, sweep, put away
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/home-proto/play.js) is imported only when a stage starts.
 * The screen and its rules are js/home-proto/kit.js (the farm kit's copy, Nani as the guide); the house js/home-proto/house.js.
 */

/** What the home prototypes need on a host page beyond what lab.html loads (the s14 word card, the focus; the sheets). */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/focus.js"],
  styles: ["css/home-proto.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["hide", "Hide and seek", "Simba and Zazu hide in Nani's bedroom. Count with Nani, then open the place she names; at the end, close the places she asks."],
  ["fetch", "Pick it up and put it back", "Nana can't find his things: tap the room, then the right one of two (on or under). Then put back what Simba knocked down."],
  ["clean", "The clean-up", "The bathroom: switch off the light, close the curtain, turn off the tap, sweep; from level 2 two of each, so on or off decides."],
];

function homeGame(id) {
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
  id: "home-proto",
  games: Object.fromEntries(GAMES.map(([id]) => [id, homeGame(id)])),
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => GAMES.map(([game, label, note]) => ({ game, label, note })),
  free: false,
  actions: ["again", "list", "home"],
};
