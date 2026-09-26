/*
 * Find it, F1: Nani's list (the bazaar hunt), with Check the bag and the
 * bowl (docs/find-it-design.md D2, D5; build brief 8.3 task 1).
 *
 * greet -> spot + count -> bag -> tell (the bowl). Nani's list is spoken in
 * Kutchi and shown as the order ladder (words fade to dots per word stage).
 * The stall is busy with look-alikes: every thing on the list has more
 * copies out than were asked for, and its look-alike group is out too, so
 * only the Kutchi says which and how many (js/find/gen.js). From level 2 a
 * row can carry a size (wadho / nindho): then every thing on the stall is
 * out in both sizes. Tap to find; press Done to hand the basket over; the
 * shopkeeper packs your bag with one mistake; then Nani's hands are full
 * and you tell her what to put in the bowl (speaking moment 1).
 *
 * Settings: data/find.json mechanics.list.levels (see its _about).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Find = global.Find;
  const V = Find.View;

  /**
   * One R1 round (shared by F1 and F2): the stall, the list, the search,
   * Done, then the bag and the bowl when asked for.
   */
  async function run(round, { bag = true, greet = false, search = true, bowl = true, goal = null } = {}) {
    const scene = round.scene;
    V.build(scene);
    V.onTap((x, y) => round.tap(x, y));
    const { wants, units, problems } = Find.makeWants(round.knobs, scene);
    if (problems.length) console.warn("find: round dealt with problems", problems);
    round.items = await Find.placeItems(scene, units);
    round.items.forEach((it) => V.addItem(it));
    V.openZoom();
    if (!round.alive()) throw new Cook.Abort("left");
    if (greet) await Find.greet(round);
    round.openList(wants);
    UI.gist(goal || Find.data.mechanics[round.mech].goal || Find.data.mechanics.list.goal, { key: `find-${round.mech}` });
    round.phase = "listen";
    await round.sayList();
    if (!round.alive()) throw new Cook.Abort("left");
    if (search) {
      round.beginSearch();
      await round.waitDone();
      round.endSearch();
      round.phase = "grade";
      await round.grade();
    }
    if (bag) await Find.checkBag(round, { fromBasket: search });
    if (bag && bowl && global.Say) await Find.bowl(round);
    UI.hideGist();
    V.bowl(false);
    return round.finish();
  }
  Find.runList = run;
  Find.Mech.define("list", { run });

  /* ---------------- the Search lab ---------------- */
  Find.Mech.lab("list", { name: "Nani's list + bag + bowl", verb: "F1: find, count, check, say", mech: "list", opts: { bag: true } });
  Find.Mech.lab("list-only", { name: "Nani's list", verb: "M1: find + count", mech: "list", opts: { bag: false } });
  Find.Mech.lab("bag", { name: "Check the bag", verb: "M5 on its own", mech: "list", opts: { bag: true, search: false, bowl: false } });
})(window);
