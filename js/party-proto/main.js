/*
 * Someone's birthday (Zara's family) as a mode plug-in (proto-party, 2 Nov 2026): the party's lab prototypes, so Zafar can
 * play them and give feedback. The designs: build/reports/designs/party-guests.md (pass the balloon, how are you?),
 * party-gifts.md (the cake, the party presents), do-it-engine.md (musical statues), and their critiques; how each plays at
 * each level is in build/reports/proto-party-2026-11-02.md. "Snap the guests" and "Who ate the cake?" come later.
 *
 *   lab.html?mode=party-proto&game=balloon&level=1    pass the balloon (introductions; L2: whose mum, whose aunt)
 *   lab.html?mode=party-proto&game=how&level=1        how are you? (ask each guest, hear the feeling, give what helps)
 *   lab.html?mode=party-proto&game=statues&level=1    musical statues (Nani claps; when she stops, the pose she calls)
 *   lab.html?mode=party-proto&game=cake&level=1       the cake (the candles she asks for, blow, a slice for each person)
 *   lab.html?mode=party-proto&game=presents&level=1   the party presents (open a box, give the toy to whoever she names)
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/party-proto/play.js) is imported only when a stage
 * starts. The screen and its rules are js/party-proto/kit.js (the farm kit's copy); the pictures js/party-proto/art.js.
 */

/** What the party needs on a host page beyond what lab.html loads (the s14 word card, the focus; the sheets). */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/focus.js"],
  styles: ["css/party-proto.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["balloon", "Pass the balloon", "Whoever holds the balloon calls who gets it next: tap that person. L1 by name; L2 only Zara's and Yusuf's mums and aunts, who swap seats."],
  ["how", "How are you?", "Tap a guest to ask how they are, hear the answer, then give them what helps from the tea trolley. L2: the faces hide until you try, and one guest is fine."],
  ["statues", "Musical statues", "Zara and Yusuf dance while Nani claps; when she stops she calls a pose: tap its picture card. The cards shuffle at every stop."],
  ["cake", "The cake", "The candles Nani asks for (the number picks the bundle), blow them out, then a slice for whoever she names."],
  ["presents", "The party presents", "Open a plain brown box, then give the toy to the person Nani names. L2: two boxes, many toys, she names the toy and the person."],
];

function partyGame(id) {
  return {
    id,
    gestures: ["tap"],
    levels: [1, 2],
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
  id: "party-proto",
  games: Object.fromEntries(GAMES.map(([id]) => [id, partyGame(id)])),
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => GAMES.map(([game, label, note]) => ({ game, label, note, levels: [1, 2] })),
  free: false,
  actions: ["again", "list", "home"],
};
