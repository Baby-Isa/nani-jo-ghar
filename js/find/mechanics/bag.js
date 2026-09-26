/*
 * Find it, mechanic `bag` (M5 Check the bag; docs/find-it-design.md D3):
 * the odd one out in what someone packed for you. The shopkeeper (or Ali)
 * packs the list into your bag and gets one thing wrong: a look-alike
 * instead of one thing, or one too many (js/find/gen.js Gen.pack). Tap the
 * wrong one; he says sorry and swaps it. The rows are dots from stage 3, so
 * you have to remember what was asked.
 *
 * Moved out of list.js unchanged (8.3 task 1), except that what gets packed
 * comes from the pure generator (so the Node leak bot packs the same way).
 *   Find.checkBag(round, {fromBasket, who, listed})
 *     who     "shopkeeper" (default) or "ali" (F4: Ali packs your bag)
 *     listed  the rows to pack (default: the round's rows, "no" rows left out)
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const Find = global.Find;
  const V = Find.View;

  async function checkBag(round, { fromBasket = true, who = "shopkeeper", listed = null } = {}) {
    const scene = round.scene;
    const P = V.person || { x: 1005, top: 200 };
    const at = { x: P.x, baseline: 560, w: 60, h: 60 };
    round.phase = "packing";
    // the stall steps back: only the bag is tappable now
    round.items.forEach((it) => {
      it.off = true;
      if (it.el) it.el.classList.add("off");
    });
    if (fromBasket && round.basket.length) {
      await Promise.all(round.basket.map((it, i) => Cook.wait(i * 60).then(() => V.fly(it, at, { into: "gone", ms: 420 }))));
    }
    V.clearBasket();
    round.basket = [];
    V.mood("happy");
    await Cook.wait(450);
    // he packs the list, and gets one thing wrong
    const rows = (listed || round.rows).filter((r) => !r.want.not);
    const P2 = Find.Gen.pack(
      rows.map((r) => r.want),
      [...new Set(round.items.map((x) => x.noun))],
      (round.knobs.bag && round.knobs.bag.errors) || ["swap"],
      Find.env(scene)
    );
    const { packed, error, wrongNoun, swapFor } = P2;
    const bag = [];
    for (let i = 0; i < packed.length; i++) {
      const spot = V.basketSpot(i);
      const sz = await V.measure(packed[i], Math.min(spot.w, spot.h));
      const it = { id: `bag${i}`, noun: packed[i], x: at.x, baseline: at.baseline, w: sz.w, h: sz.h, tilt: Find.rint(-8, 8), bag: true, rel: [["in", "bag"]] };
      V.addItem(it, { bag: true });
      bag.push(it);
      // wrong: the swapped thing; for one too many, any of that kind (taking one back fixes it)
      it.wrong = it.noun === wrongNoun;
      V.fly(it, spot, { ms: 380 });
      await Cook.wait(90);
    }
    await Cook.wait(420);
    round.bag = { items: bag, error, wrongNoun, swapFor, misses: 0 };
    if (who === "shopkeeper") await Find.say("shopkeeper", Lang.line("here"));
    // the goal waits behind the "?" (it pulses the first time you check a bag)
    UI.gist(who === "ali" ? Find.data.mechanics.bag.goalAli || Find.data.mechanics.bag.goal : Find.data.mechanics.bag.goal, { key: "find-bag" });
    round.phase = "bag";
    let misses = 0;
    await new Promise((resolve) => {
      round.onBagTap = (x, y) => {
        const it = V.hit(x, y, bag);
        if (!it) return V.ripple(x, y);
        if (it.wrong) {
          round.onBagTap = () => {};
          Cook.sfx.right();
          it.gone = true;
          V.glow([it], false);
          round.phase = "packing";
          const back = V.fly(it, at, { into: "gone", ms: 420 });
          (async () => {
            await back;
            V.mood("happy");
            if (who === "shopkeeper") await Find.say("shopkeeper", Lang.line("oops"), { ms: 900 });
            if (error === "swap" && swapFor) {
              const spot = { x: it.x, baseline: it.baseline, w: it.w, h: it.h };
              const sz = await V.measure(swapFor, Math.min(scene.basket.item.maxW, scene.basket.item.maxH));
              const fix = { id: "bagfix", noun: swapFor, x: at.x, baseline: at.baseline, w: sz.w, h: sz.h, bag: true };
              V.addItem(fix, { bag: true });
              bag.push(fix);
              await V.fly(fix, { x: spot.x, baseline: spot.baseline, w: sz.w, h: sz.h }, { ms: 380 });
            }
            resolve();
          })();
          return;
        }
        // a thing that WAS on the list: wiggle, recast (what you tapped, then the list), try again
        misses++;
        round.bag.misses = misses;
        V.wiggle(it);
        Cook.sfx.soft();
        const row = rows.find((r) => r.want.noun === it.noun) || null;
        round.earMiss(row, `bag: ${it.noun} was on the list`, "bag");
        // short (calm): what you tapped, then its own row (it WAS on the list); ↻ says the whole list
        if (who === "shopkeeper") Find.sayLater("nani", Lang.join([Lang.line("oops"), Lang.bare(Lang.phrase([it.noun]))].concat(row ? [Find.rowLine(row, true)] : [])));
        if (misses >= 2) {
          V.glow(bag.filter((b) => b.wrong && !b.gone));
          round.onHelp("shown", { ids: [wrongNoun] });
        }
      };
    });
    round.onBagTap = null;
    UI.hideGist();
    if (who === "shopkeeper") await Find.say("shopkeeper", Lang.line("bye"), { ms: 900 });
    V.mood("neutral");
    return round.bag;
  }
  Find.checkBag = checkBag;
})(window);
