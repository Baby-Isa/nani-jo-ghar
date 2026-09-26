/*
 * Find it, speaking moment 1: the bowl (docs/find-it-design.md D4, D9.1).
 * Nani's hands are full at the end of her list: the child tells her what
 * to put in the bowl, and she takes that thing from the bag. The closed set
 * is the bag's kinds, padded with stall things to at least 3 (at most 8).
 * A thing that isn't in the bag: Nani holds up her empty hand, puzzled
 * (the bowl wobbles), one retry, then the pills. Nothing waits on the mic.
 *
 *   await Find.bowl(round)    after Check the bag; `says` things (data)
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Find = global.Find;
  const V = Find.View;

  Find.bowl = async function (round, { says } = {}) {
    const B = Find.data.mechanics.bowl || {};
    const inBag = () => ((round.bag && round.bag.items) || []).filter((it) => !it.gone && it.el);
    const n = says || (round.knobs.bowl && round.knobs.bowl.says) || B.says || 2;
    const spot = V.bowl(true);
    UI.gist(B.goal, { key: "find-bowl" });
    const stall = [...new Set(round.items.map((x) => x.noun))];
    for (let i = 0; i < n; i++) {
      const have = [...new Set(inBag().map((x) => x.noun))];
      if (!have.length) break;
      const choices = Find.Gen.closedSet(have, stall, Find.env(round.scene), { min: B.min || 3, max: B.max || 8 });
      let took = null;
      await Find.tell(round, {
        choices,
        caption: i === 0 ? B.goal : null,
        actor: {
          act(choice) {
            const it = inBag().find((x) => x.noun === choice);
            if (!it) {
              // not in the bag: Nani looks, puzzled; the bowl wobbles
              V.bowlShake();
              Cook.sfx.soft();
              return Cook.wait(500);
            }
            took = it;
            it.gone = true;
            Cook.sfx.right();
            return V.fly(it, spot(), { into: "items", ms: 480 });
          },
          miss() {
            Find.sayLater("nani", Lang.line("oops"), { ms: 700 });
          },
        },
        accept: (choice) => have.includes(choice),
      });
      if (took) V.mood("happy");
    }
    UI.hideGist();
    await Cook.wait(300);
  };
})(window);
