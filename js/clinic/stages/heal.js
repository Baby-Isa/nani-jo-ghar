/*
 * Stage 4, heal: the registered healing game for the ailment
 * (docs/clinic-heal-api.md), mounted by the host on the same screen with the
 * same patient figure, the diagnosed part and side, and the tray the child
 * brought from the pharmacy (in the prescription's order). The game ends
 * itself with ctx.done(); its right/total and words join the patient's round.
 */
(function (global) {
  "use strict";
  const Clinic = global.Clinic;
  const Kit = Clinic.Kit;
  const S = Clinic.Stages;

  S.heal = {
    run: null, // the host's run, while a game is mounted (tests: S.heal.run.controller.expect())
    async run_(env, plan, patient) {
      const res = S.result("heal");
      const { screen } = env;
      if (!Clinic.Heal.has(plan.game)) {
        // never drawn by the pipeline (it filters to registered games); a lab safety net
        await S.say({ english: `(The ${plan.game} game isn't here yet.)` }, "doctor");
        return Object.assign(res, { heal: { right: 0, total: 0, words: [], skipped: true } });
      }
      screen.card.setRows([]);
      const run = await Clinic.HealHost.mount(screen, plan.game, {
        level: plan.level,
        side: plan.side,
        kind: patient.kind,
        colour: patient.colour,
        size: patient.size,
        ailment: plan.ailment,
        part: plan.part,
        tray: plan.tray.map((t) => Object.assign({}, t)),
        patient: env.fig,
        seed: Math.floor(env.rng() * 1e9),
        onboard: !!env.onboard,
      });
      S.heal.current = run;
      S.setExpect("heal", () => {
        const c = run.controller || {};
        const e = (c.expect && c.expect()) || (c.expectation && c.expectation()) || null;
        return { stage: "heal", kind: "game", game: plan.game, game_expect: e };
      });
      const out = await run.result;
      S.current = null;
      S.heal.current = null;
      await Kit.wait(Kit.fast ? 60 : 900);
      run.destroy();
      // the tray has been used: the sidebar shows it as ticks until the send-off clears it
      res.heal = out;
      (out.words || []).forEach((w) => res.words.push(w));
      return res;
    },
    /** Tests only: end the mounted game as a fair player would (its bot's fair result). */
    finish() {
      const run = S.heal.current;
      if (!run) return false;
      let b = null;
      try {
        b = Clinic.Heal.botRun(run.ctx.game.id, run.ctx.level, "fair", run.ctx.rng);
      } catch (e) {
        b = { right: 1, total: 1 }; // some games' bots read their data through Node only
      }
      run.ctx.done({ right: b ? b.right : 0, total: b ? b.total : 0, words: [], finishedByTest: true });
      return true;
    },
  };
  S.heal.run = S.heal.run_;
})(typeof self !== "undefined" ? self : this);
