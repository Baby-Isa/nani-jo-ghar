/*
 * Sewing with Big Ma, the prototypes, as a mode plug-in (proto-sewing, 2 Nov 2026): the four sewing games in the labs so Zafar can
 * give feedback. Designs: build/reports/designs/sewing.md (and sewing-critique.md), the sewing section of
 * games-at-a-glance-2026-11-01.md; the build rules: build/reports/proto-brief-2026-11-02.md. The parked Dress up mode (dress.html,
 * js/dress/) is left as it is.
 *
 *   lab.html?mode=sewing-proto&game=stall&level=1   the cloth stall: Big Ma says the cloth she wants; tap the bolt
 *   lab.html?mode=sewing-proto&game=make&level=1    make: Ali says what to make; the pattern, (L2) the length, cut, sew
 *   lab.html?mode=sewing-proto&game=mend&level=1    mend: Nana's kurta has two faults or more; he says which; stitch it
 *   lab.html?mode=sewing-proto&game=fit&level=1     the fitting: tap the piece asked for, then the person; the size gags
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/sewing-proto/play.js) is imported only when a stage starts.
 */

/** What the sewing games need on a host page beyond what lab.html loads. */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/focus.js"],
  styles: ["css/sewing-proto.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["stall", "The cloth stall", "Big Ma tells the seller the cloth she wants (\"I want the red cloth\"): tap the bolt and it flops open. From L2 the big or the small piece."],
  ["make", "Make", "Ali says what to make (\"make a kurta\"): tap the pattern, then cut along the chalk and run it under the machine. From L2 the long or the short hem."],
  ["mend", "Mend", "Nana's kurta has two faults or more; he says which (\"my sleeve is torn\"): tap it and stitch along the tear, or sew the button back."],
  ["fit", "The fitting", "Ali says what he wants to try on: tap it on the rail, then tap him. The wrong size is far too long; the wrong piece lands on his head."],
];

function sewingGame(id) {
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
  id: "sewing-proto",
  games: Object.fromEntries(GAMES.map(([id]) => [id, sewingGame(id)])),
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => GAMES.map(([game, label, note]) => ({ game, label, note })),
  free: false,
  actions: ["again", "list", "home"],
};
