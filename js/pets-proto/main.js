/*
 * The pet hotel prototypes as a mode plug-in (proto-pets, 2 Nov 2026): Hannah Mami's two pet hotel games in the labs so Zafar can
 * give feedback. Design: build/reports/designs/adoption-centre.md (and its critique), the pet hotel section of
 * games-at-a-glance-2026-11-01.md; the build rules: build/reports/proto-brief-2026-11-02.md.
 *
 *   lab.html?mode=pets-proto&game=care&level=1   look after the animals: tap the tool, then the animal she names, then the care
 *   lab.html?mode=pets-proto&game=home&level=1   going home: a family comes back; tap the pet they name
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/pets-proto/play.js) is imported only when a stage starts.
 */

/** What the pet hotel games need on a host page beyond what lab.html loads. */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/focus.js"],
  styles: ["css/pets-proto.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["care", "Look after the animals", "Hannah Mami says one care at a time (\"Feed the dog\", \"Wash the ant\"): tap the tool, then the animal, then do it: cobs in the bowl, scrub and rinse, three brush strokes, the blanket."],
  ["home", "Going home", "A family comes back for its pet (\"We've come for the dog\"): tap that animal and it goes home with them. Later: the big and the small rabbit."],
];

function petsGame(id) {
  return {
    id,
    gestures: ["tap", "drag"],
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
  id: "pets-proto",
  games: Object.fromEntries(GAMES.map(([id]) => [id, petsGame(id)])),
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => GAMES.map(([game, label, note]) => ({ game, label, note })),
  free: false,
  actions: ["again", "list", "home"],
};
