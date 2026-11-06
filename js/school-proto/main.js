/*
 * The school day prototypes as a mode plug-in (proto-school, 2 Nov 2026): the four school-day games in the labs so Zafar can give
 * feedback. Designs: build/reports/designs/wake-up-clock.md, school-day.md (and their critiques), do-it-engine.md B1 (getting
 * ready), the school section of games-at-a-glance-2026-11-01.md; the build rules: build/reports/proto-brief-2026-11-02.md.
 *
 *   lab.html?mode=school-proto&game=clock&level=1   the wake-up clock: wake each sleeper at their hour
 *   lab.html?mode=school-proto&game=ready&level=1   getting ready: Nani calls a child and a job; tap the thing
 *   lab.html?mode=school-proto&game=bag&level=1     pack the school bag: tap what Nani says; it hops in
 *   lab.html?mode=school-proto&game=board&level=1   the blackboard: the teacher's jobs (draw, colour, ring, rub out)
 *
 * Node-importable (build/gen_labs.mjs reads lab()): the games' runtime (js/school-proto/play.js) is imported only when a stage starts.
 */

/** What the school games need on a host page beyond what lab.html loads. */
export const NEEDS = {
  scripts: ["js/shared/word-card.js", "js/shared/focus.js"],
  styles: ["css/school-proto.css", "css/shared/word-tiles.css"],
};

const GAMES = [
  ["clock", "The wake-up clock", "Bedtime: Nani says when Ali, Nana and Ma wake up. The wall clock runs and pauses at each hour: wake the right sleeper, or nobody."],
  ["ready", "Getting ready", "Nani calls a child and a job (\"Ali, comb your hair\"): tap the thing; the child she named does it."],
  ["bag", "Pack the school bag", "Nani says what goes in the bag, one thing at a time: tap it and it hops in. Toys are the tricks; later how many and \"not\"."],
  ["board", "The blackboard", "The teacher's helper: draw the picture she names, colour it, ring the group, rub one out."],
];

function schoolGame(id) {
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
  id: "school-proto",
  games: Object.fromEntries(GAMES.map(([id]) => [id, schoolGame(id)])),
  plan(entry) {
    const level = entry.level || 1;
    if (entry.game) return [{ game: entry.game, level }];
    return GAMES.map(([game]) => ({ game, level }));
  },
  lab: () => GAMES.map(([game, label, note]) => ({ game, label, note })),
  free: false,
  actions: ["again", "list", "home"],
};
