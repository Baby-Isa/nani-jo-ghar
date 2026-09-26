/*
 * G1 "Who ate this one?" (K1, the tutorial mini-game): three things are
 * missing; one clue per thing; tap the one it names; the caught reaction;
 * next. Honest about itself: it's "pass me" with people, plus a reaction per
 * item. Zones: lineup + accuse (the tap is the accusation).
 *
 * Also the shared K1 loop that G3 "Look closer" runs at level 1.
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  const G = (Who.Games = Who.Games || {});
  const UI = () => Who.UI;

  // the value's word (holds and trace values are word ids; size is "big" -> ph-big)
  G.wordFor = (P, dim, value) => {
    const a = Who.Case.attrOf(P, dim, value);
    return a ? a.word : null;
  };

  // "Arre re!" and the same frame about the one they picked (a recast, never the answer)
  G.recast = async function (ctx, clue, who) {
    const v = ctx.c.suspects[who].attrs[clue.dim];
    await UI().say("oops");
    if (v != null && v !== clue.value) await UI().say(clue.line, G.wordFor(ctx.P, clue.dim, v));
  };

  // Nani says a clue; at word stage 1 the fitting suspects glow as she says it (taught, not tested)
  G.sayClue = async function (ctx, clue, fitting) {
    const taught = ctx.stage <= 1 && UI().P.word(clue.word).real;
    if (taught && fitting) ctx.lineup.glow(fitting, true);
    await UI().say(clue.line, clue.word, { hidden: ctx.stage >= 3 && UI().P.word(clue.word).real });
    if (taught) ctx.lineup.glow([], false);
  };

  G.intro = async function (ctx, lineKey) {
    const c = ctx.c;
    const gaps = c.kind === "K1" ? c.items.length : 3;
    const box = `<div class="crime-box">${Array.from({ length: gaps }, () => '<span class="sweet"></span>').join("")}</div>`;
    ctx.expect = "start";
    await UI().card(`<h2>${UI().lineHTML(lineKey || "who-ate")}</h2>${box}${UI().facesHTML(c)}`, [{ id: "who-start", label: "Start", primary: true }]);
    ctx.expect = null;
    UI().say(lineKey || "who-ate");
    await Cook.wait(3000); // silence: time to look at the suspects; nobody talks
  };

  G.runK1 = async function (ctx) {
    const { c, st, lineup } = ctx;
    UI().box(c.items.length);
    for (let k = 0; k < c.items.length; k++) {
      const it = c.items[k];
      UI().boxNow(k);
      await UI().say("this-one");
      const row = UI().addRow(it.clue, ctx.stage, ctx.rowHooks(k));
      ctx.words.add(it.clue.word);
      await G.sayClue(ctx, it.clue, [it.eater]);
      for (;;) {
        ctx.expect = "pick";
        const i = await lineup.pickOne();
        ctx.expect = null;
        const res = Who.Case.grade(st, { type: "pick", index: i, ms: lineup.elapsed() });
        if (res.ok) {
          UI().rowResult(row, !st.rows[k].earLost);
          lineup.glow([], false);
          await Who.Mech.accuse.caught(lineup, i, ctx.accuseKnobs);
          UI().boxDone(k);
          break;
        }
        await Who.Mech.accuse.notMe(lineup, i, ctx.accuseKnobs);
        await G.recast(ctx, it.clue, i);
        if (res.shown) lineup.glow(res.shown, true);
        await G.sayClue(ctx, it.clue);
      }
    }
  };

  G["one-each"] = {
    async run(ctx) {
      await G.intro(ctx, "who-ate");
      await G.runK1(ctx);
    },
  };
})(window);
