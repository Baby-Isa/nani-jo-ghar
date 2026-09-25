/*
 * Find it, F3: Where is it? (docs/find-it-design.md D2, D5; R2 the calls).
 *
 * Nani calls one thing at a time, and where: "santra, crate [in]". The
 * called thing is in three or more places, so only the position decides;
 * the same thing is called to two places in a round. Levels 1-2 are the
 * bazaar (in, on, in front of); level 3 is the sitting room's grey boxes
 * (under the sofa, behind the curtain: occluders hide part of each thing,
 * never more than 60%); level 4 adds the size (wadho / nindho) to each call.
 * A greybox until the family's position words exist: the calls show the
 * positions as grey English placeholders, which a non-speaker can read, so
 * the ear star says "not tested" (the shared stars rule).
 *
 * Settings: data/find.json mechanics.where.levels.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Find = global.Find;
  const V = Find.View;

  async function run(round) {
    const scene = round.scene;
    V.build(scene);
    V.onTap((x, y) => round.tap(x, y));
    const { wants, units, problems } = Find.makeWants(round.knobs, scene);
    if (problems.length) console.warn("find: round dealt with problems", problems);
    round.items = await Find.placeItems(scene, units);
    round.items.forEach((it) => V.addItem(it));
    V.openZoom();
    if (!round.alive()) throw new Cook.Abort("left");
    round.listName = "Nani's calls";
    UI.gist(Find.data.mechanics.where.goal, { key: "find-where" });
    await Find.calls(round, wants);
    UI.hideGist();
    return round.finish();
  }
  Find.Mech.define("where", { run });
  Find.Mech.lab("where", { name: "Where is it?", verb: "F3: calls (greybox)", mech: "where", opts: {} });
})(window);
