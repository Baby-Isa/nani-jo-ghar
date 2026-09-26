/*
 * G5 "Tell Ali" (K4, the speaking mini-game). You saw who did it (a dealt
 * card, D9.3's default). Ali stands at the line-up and asks what they were
 * like; you say one word from the closed set (the values in play: held
 * items, traces, and from L2 vadho/nindho, drafts). Ali echoes it ("The {x}
 * one? Right.", the model, never a correction) and sits down everyone who
 * doesn't fit; when one is left he points. A wrong word sits the wrong
 * people: "Nobody's left!" (or he points at the wrong one), everyone stands,
 * say it again.
 *
 * Stars (D9.2): the voice star (mic or a parent's tick only, no restart) and
 * the craft star (no wasted word, fewest words); never the ear star.
 * Zones: tell (stub of the shared mechanic) + lineup, driven by case.actOn.
 */
(function (global) {
  const Who = (global.Who = global.Who || {});
  const G = (Who.Games = Who.Games || {});
  const UI = () => Who.UI;

  G["tell-ali"] = {
    async run(ctx) {
      const { c, st, lineup, P } = ctx;
      UI().speaker("ali");
      const card = Who.Suspect.cardSVG(P, c.suspects[c.culprit]);
      ctx.expect = "start";
      await UI().card(`<h2>You saw who did it!</h2><div class="dealt-big">${card}</div><p class="en">Tell Ali what they were like.</p>`, [{ id: "who-start", label: "OK", primary: true }]);
      ctx.expect = null;
      const dealt = document.getElementById("dealt");
      dealt.innerHTML = `${card}<div>You saw this one</div>`;
      dealt.classList.remove("hidden");
      await Cook.wait(1200);
      await UI().say("ali-what");
      for (;;) {
        ctx.expect = "say";
        const heard = await Who.Tell.tell({
          choices: c.choices.map((ch) => ch.word),
          mode: ctx.speech,
          stage: ctx.stage,
          timeoutMs: ctx.level.timeoutMs,
          onAgain: () => UI().say("ali-again"),
          botPick: () => Who.Case.expectation(st).answer[0] || c.choices[0].word,
        });
        ctx.expect = null;
        ctx.words.add(heard.choice);
        const res = Who.Case.grade(st, { type: "say", word: heard.choice, via: heard.via });
        await UI().say("ali-echo", heard.choice);
        await lineup.sit(res.sat);
        if (st.done) {
          await UI().say("ali-it-was");
          await Who.Mech.accuse.caught(lineup, res.point, ctx.accuseKnobs);
          break;
        }
        if (st.phase === "reset") {
          if (res.empty) await UI().say("ali-nobody");
          else {
            await UI().say("ali-wrong");
            await Who.Mech.accuse.notMe(lineup, res.wrongPoint, ctx.accuseKnobs);
          }
          Who.Case.grade(st, { type: "reset" });
          lineup.standAll();
          await Cook.wait(700);
          await UI().say("ali-what");
          continue;
        }
        await UI().say("ali-else");
      }
    },
  };
})(window);
