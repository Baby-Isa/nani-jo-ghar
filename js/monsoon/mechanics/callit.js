/*
 * Mechanic: callit (G3, you call it; K5, the child is the caller). New.
 *
 * You're on the roof (the strip at the top): you can see which stain is
 * swelling. Ali is below with the lids and can't. Tap the mic and say the
 * pot's name: Ali runs to the pot the game heard and lids it; the drop
 * falls on the beat. A wrong pot plops and Ali looks up at you. Nani is
 * silent (she isn't calling, and nothing plays while the mic is open).
 *
 * The speaking moment is `say` (js/monsoon/stubs/say.js, a local copy
 * until js/shared/mechanics/say.js lands): the mic, the pills fallback,
 * the parent's tick. Recognition is js/shared/speech.js, closed-set over
 * the pots on the island (3–5 at level 1). A null ("didn't catch that")
 * never blocks: in Drizzle the drop waits and the pills appear; in Busy Ali
 * shrugs and the drop falls (decision 3). The voice star ("Called it"):
 * recognised as the target or ticked by a parent on ≥80% of ≥4 calls;
 * the pills are a fine way to play but don't count for it. G3 never
 * touches the ear star.
 *
 * Knobs (games.g3.levels): groups (the closed set), bpm, windowBeats,
 * fall, gapBeats, waves, listenMs.
 */
(function (global) {
  const M = global.Monsoon;

  M.Mech.define("callit", {
    game: "g3",
    ali: true,
    roof: true,
    build(ctx) {
      M.Say.prepare(ctx.storm.candidates.map((c) => c.id));
    },
    play(ctx, w, T) {
      const storm = ctx.storm;
      const run = ctx.run;
      const clock = ctx.clock;
      const drizzle = storm.mode === "drizzle";
      const answers = [];
      const tg = w.targets[0];
      let done = false;
      let revealed = false;
      const at = (t, fn) => clock.at(t, () => run.alive() && fn());

      return new Promise((resolve) => {
        M.UI.call(run, w);
        M.Stage.aliHome();
        const firstReveal = Math.min(...Object.values(T.reveal));
        M.Stage.swell(T.t0, firstReveal);
        M.Stage.roofSwell(tg.cand, T.t0, firstReveal);
        if (M.Lab && M.Lab.markers) M.Stage.marker(tg.cand, true);
        M.FX.creak();

        const answer = (a) => {
          if (done) return;
          const now = clock.now();
          a.t = now;
          answers.push(a);
          if (a.via === "voice" && !a.said) return; // a null: try again, or the pills
          done = true;
          sayUI.close();
          const pot = a.via === "parent" ? tg.cand : a.said;
          if (pot && M.Stage.pot(pot)) {
            M.Stage.aliTo(pot);
            at(now + 0.25, () => M.Stage.lid(pot, true));
          }
          ctx.setExpect(null);
          if (drizzle) doReveal(now + 0.05);
        };
        run.onSay = (a) => {
          // a lab bot "speaks" through the same path
          if (a.via === "pill") sayUI.pill(a.said);
          else if (a.via === "parent") answer({ via: "parent", ok: true, said: tg.word });
          else answer({ via: "voice", said: a.said });
        };
        const sayUI = M.Say.open({
          choices: storm.candidates.map((c) => c.id),
          target: tg.word,
          timeoutMs: storm.cfg.listenMs || 4000,
          drizzle,
          onAnswer: answer,
          onNull: () => {
            if (!drizzle) M.Stage.aliShrug();
          },
        });
        ctx.setExpect({ kind: "say", target: tg.word, choices: storm.candidates.map((c) => c.id), before: T.reveal[tg.id], wave: w.i });
        ctx.setTap((cand) => M.Stage.wobble(cand)); // the caller doesn't tap the pots: Ali does

        function doReveal(r) {
          if (revealed) return;
          revealed = true;
          T.reveal[tg.id] = r;
          T.land[tg.id] = r + (storm.cfg.fall || 0.8);
          T.end = T.land[tg.id] + (storm.cfg.gapBeats != null ? storm.cfg.gapBeats : 2) * T.beat;
          schedule();
        }
        function schedule() {
          at(T.reveal[tg.id], () => {
            revealed = true;
            sayUI.close();
            ctx.setExpect(null);
            M.FX.drip();
            M.Stage.drop(tg.cand, T.reveal[tg.id], T.land[tg.id], (lidded) => {
              if (!lidded) {
                M.Stage.aliLook();
                M.UI.nani(M.lineFor({ line: "oops" }).k || "");
                M.sayLine("oops");
                setTimeout(() => run.alive() && M.Stage.flash(tg.cand), 250);
              }
            });
          });
          at(T.end - 0.001, () => {
            M.Stage.swell(null);
            M.Stage.roofSwell(null);
            M.Stage.lidsOff();
            M.Stage.aliHome();
            M.Stage.marker(tg.cand, false);
            M.UI.clearCall();
            M.UI.nani("");
            sayUI.close();
            run.onSay = null;
            ctx.setTap(null);
            ctx.setExpect(null);
            resolve(answers);
          });
        }
        if (!drizzle) schedule();
        else at(T.keyEnd + ((storm.rules.drizzle || {}).giveUpAfter || 45), () => doReveal(clock.now()));
      });
    },
  });
})(window);
