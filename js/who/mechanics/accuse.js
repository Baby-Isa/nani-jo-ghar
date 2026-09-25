/*
 * Mechanic `accuse` (new): point at one (hand C4). The engine applies the
 * lucky-guess rule (accusing while more than one is still possible never
 * earns the ear); the caught or not-me reaction plays only after the
 * accusation, never before (leak rule 3.2).
 *
 * Settings (mechanics.accuse.levels): luckyGuessRule, notMeMs, caughtMs.
 *   caught(lineup, i)  the culprit's hop, "Caught you!"
 *   notMe(lineup, i)   the huff, "Not me!"
 *   run(ctx)           ask "Who did it?", wait for a tap, grade, react; loops until caught
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  Who.Mech = Who.Mech || {};

  const pointAt = async (lineup, i) => {
    const c = lineup.center(i);
    const hand = document.createElement("div");
    hand.className = "pointer-hand";
    hand.textContent = "\u{1F449}";
    hand.style.left = `${c.x - 110}px`;
    hand.style.top = `${c.y - 40}px`;
    document.getElementById("world").appendChild(hand);
    setTimeout(() => hand.remove(), 900 / (Cook.speed || 1));
  };

  Who.Mech.accuse = {
    async caught(lineup, i, k) {
      pointAt(lineup, i);
      Who.UI.bubble(lineup.items[i].x, Math.max(20, lineup.items[i].top - 70), Who.UI.lineHTML("caught"), 1400 / (Cook.speed || 1));
      Cook.sfx.right && Cook.sfx.right();
      await lineup.flash(i, "caught", (k && k.caughtMs) || 1200);
    },
    async notMe(lineup, i, k) {
      pointAt(lineup, i);
      Who.UI.bubble(lineup.items[i].x, Math.max(20, lineup.items[i].top - 70), Who.UI.lineHTML("not-me"), 1300 / (Cook.speed || 1));
      Cook.sfx.soft && Cook.sfx.soft();
      await lineup.flash(i, "notme", (k && k.notMeMs) || 1000);
    },
    async run(ctx) {
      const { st, lineup, P } = ctx;
      const k = Who.Mech.levelKnobs(P, "accuse", ctx.c.level);
      await Who.UI.say("who-did");
      ctx.expect = "accuse";
      for (;;) {
        const i = await lineup.pickOne();
        const res = Who.Case.grade(st, { type: "accuse", index: i });
        ctx.expect = null;
        if (res.ok) {
          await Who.Mech.accuse.caught(lineup, i, k);
          return res;
        }
        await Who.Mech.accuse.notMe(lineup, i, k);
        ctx.expect = "accuse";
      }
    },
  };
})(window);
