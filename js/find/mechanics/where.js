/*
 * Find it, mechanic `where` (docs/find-it-design.md D3, R2 the calls): a
 * row with a position, on the shared relations layer. The called thing is
 * in three or more places (js/find/gen.js places them), so only the
 * position separates the copies; anchors match by WORD through Rel.holds
 * (two crates are both "the crate"). Positions are English placeholders
 * until the family's words arrive (Questions for Mum A5): such a call is
 * readable, so it is not tested for the ear star (Stars rule
 * placeholdersTested: false), and the round's ear shows "not tested".
 *
 *   await Find.calls(round, wants)
 * Nani calls one thing at a time (the first comes up big on the intro
 * card, the rest from the sidebar); the card shows only the current call;
 * a find moves on, a wrong tap is the recast and you try again; there is no
 * Done (a call ends with its find). Afterwards round.rows holds every call,
 * for the stars and the word review.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Find = global.Find;

  Find.calls = async function (round, wants) {
    round.calls = true;
    const all = [];
    for (let i = 0; i < wants.length; i++) {
      const w = Object.assign({}, wants[i], { call: true });
      round.openList([w]);
      all.push(round.rows[0]);
      round.phase = "listen";
      if (i === 0) await round.sayList();
      else {
        UI.mission.refresh();
        await Find.say("nani", Find.rowLine(round.rows[0], true));
      }
      if (!round.alive()) throw new Cook.Abort("left");
      round.beginSearch({ done: false });
      await new Promise((resolve) => (round.onFind = () => resolve()));
      round.onFind = null;
      round.endSearch();
      await Cook.wait(420);
      if (!round.alive()) throw new Cook.Abort("left");
    }
    round.rows = all;
    round.L = Find.ladder(all);
    return all;
  };
})(window);
