/*
 * Find it, mechanic `greet` (docs/find-it-design.md D3; reused from Cook):
 * the salaam exchange at the stall (data/cook.json exchanges.salaam,
 * UI.choose). Moved out of list.js unchanged.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Find = global.Find;
  const V = Find.View;

  Find.greet = async function (round) {
    const ex = (Cook.data.exchanges || []).find((e) => e.id === "salaam");
    if (!ex) return 0;
    await Find.say("shopkeeper", Lang.line(ex.ask));
    const opts = [ex.answer].concat(ex.wrong).map((key) => ({ key, line: Lang.line(key) }));
    const r = await UI.choose(opts, ex.answer, { glowAfter: 7000 / Cook.speed });
    if (!round.alive()) throw new Cook.Abort("left");
    V.mood("happy");
    await Cook.wait(500);
    V.mood("neutral");
    return r.misses;
  };
})(window);
