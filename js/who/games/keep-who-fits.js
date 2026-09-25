/*
 * G2 "Keep who fits" (K2, the engine room): clue by clue, tap everyone who
 * fits, then Done; the rest sit down. Graded as an exact set at Done, never
 * per tap. A wrong commit: the first wrong one shrugs, "Arre re!" and the
 * same frame about them (a recast), then the clue again; after two misses on
 * one clue the fitting ones glow (and that clue's ear is gone). When one is
 * left: "Who did it?" and the accusation. Zones: lineup + accuse (+ examine
 * at L2, when traces are in the case).
 *
 * Also the shared K2 loop that G3 "Look closer" runs at level 2.
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  const G = (Who.Games = Who.Games || {});
  const UI = () => Who.UI;

  G.runK2 = async function (ctx) {
    const { c, st, lineup } = ctx;
    for (let r = 0; r < c.clues.length; r++) {
      const cl = c.clues[r];
      const row = UI().addRow(cl, ctx.stage, ctx.rowHooks(r));
      ctx.words.add(cl.word);
      await G.sayClue(ctx, cl, Who.Case.expectation(st).answer);
      for (;;) {
        ctx.expect = "commit";
        const picks = await lineup.pickMany();
        ctx.expect = null;
        const res = Who.Case.grade(st, { type: "commit", picks, ms: lineup.elapsed() });
        lineup.clearForward();
        if (res.ok) {
          UI().rowResult(row, !st.rows[r].earLost);
          lineup.glow([], false);
          Cook.sfx.right && Cook.sfx.right();
          await lineup.sit(res.sat);
          break;
        }
        await lineup.flash(res.recast.who, "shrug", 500);
        await G.recast(ctx, cl, res.recast.who);
        if (res.shown) lineup.glow(res.shown, true);
        await G.sayClue(ctx, cl);
      }
    }
    await Who.Mech.accuse.run(ctx);
  };

  G["keep-who-fits"] = {
    async run(ctx) {
      await G.intro(ctx, "who-ate");
      await G.runK2(ctx);
    },
  };
})(window);
