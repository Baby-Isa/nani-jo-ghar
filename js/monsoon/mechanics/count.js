/*
 * Mechanic: count (G2, drip count; K2 "how many"). Reused from Cook.
 *
 * Cook's count (js/cook/mechanics/count.js) is one spoon per tap, then
 * Done, with the tally shown and never the target, and it never ends by
 * itself. That file is bound to Cook's Phaser zone host, so Monsoon keeps
 * its rules and knobs here with a drop as the unit and the lid as Done;
 * when the shared mechanics move to js/shared/mechanics/ this becomes a
 * one-line swap.
 *
 * Level 1: one open pot. "Trae!": three drops plink in, then tap the pot to
 * lid it. Lidding early, or a fourth drop landing, is `wrong` and blames
 * the number word. Level 2: every pot is open and the drops fall into all
 * of them together (the shared countdown); "{x}! {n}!" says which pot and
 * how many. Level 3: two pots, two numbers ("{x}! {n}! Ne {y}. {m}!").
 * Drizzle drops fall slower (drizzleDropSec); they never wait, because
 * counting what falls is the game.
 *
 * Knobs (games.g2.levels): numbers, named, bpm, dropBeats, drizzleDropSec,
 * fall, gapBeats, waves, frames.
 */
(function (global) {
  const M = global.Monsoon;

  M.Mech.define("count", {
    game: "g2",
    // level 1 shows only the one open pot, in the middle of the island
    single: (storm) => (storm.cfg.named ? null : storm.candidates[0].id),
    play(ctx, w, T) {
      const storm = ctx.storm;
      const run = ctx.run;
      const clock = ctx.clock;
      const answers = [];
      const n = w.targets.length;
      let lids = n;
      const open = storm.cfg.named ? storm.candidates.map((c) => c.id) : [w.targets[0].cand];
      const fall = storm.cfg.fall || 0.6;
      const lastReveal = Math.max(...Object.values(T.reveal));
      let landed = 0;
      const at = (t, fn) => clock.at(t, () => run.alive() && fn());

      return new Promise((resolve) => {
        M.UI.call(run, w);
        M.UI.hand(lids, n);
        M.UI.count(0);
        T.parts.forEach((p) => at(p.at, () => M.say(p.part)));
        M.FX.creak();
        // the stains swell until the first drop, then drip on the beat
        M.Stage.swell(T.t0, T.dropStart);
        w.targets.forEach((tg) => M.Lab && M.Lab.markers && M.Stage.marker(tg.cand, true));

        const postExpect = () => {
          // the next pot due: the smallest count still open
          const next = w.targets.filter((tg) => !answers.some((a) => a.pick === tg.cand)).sort((a, b) => a.n - b.n)[0];
          ctx.setExpect(lids > 0 && next ? { kind: "count", cand: next.cand, n: next.n, lidAfter: T.dropLand(next.n), before: T.dropLand(next.n + 1), where: M.Stage.screenOf(next.cand), wave: w.i } : null);
        };
        postExpect();

        // drops fall on the beat into every open, unlidded pot; they never stop by themselves
        const dropAt = (k) => {
          const t = T.dropStart + (k - 1) * T.dropEvery;
          if (t > lastReveal + 0.01) return;
          at(t, () => {
            if (lids === 0) return;
            M.FX.drip();
            open.forEach((cand) => {
              const p = M.Stage.pot(cand);
              if (p && !p.lidded) M.Stage.drop(cand, t, t + fall, () => {});
            });
            at(t + fall, () => {
              landed = k;
              if (lids > 0) M.UI.count(landed);
            });
            dropAt(k + 1);
          });
        };
        dropAt(1);

        ctx.setTap((cand) => {
          const now = clock.now();
          if (now < T.t0 || lids === 0 || !open.includes(cand) || M.Stage.pot(cand).lidded) return M.Stage.wobble(cand);
          lids--;
          answers.push({ t: now, pick: cand });
          M.Stage.lid(cand, true);
          M.UI.hand(lids, n);
          postExpect();
        });

        at(T.end - 0.001, () => {
          M.Stage.swell(null);
          M.Stage.lidsOff();
          w.targets.forEach((tg) => M.Stage.marker(tg.cand, false));
          M.UI.clearCall();
          M.UI.count(null);
          M.UI.hand(0);
          ctx.setTap(null);
          ctx.setExpect(null);
          resolve(answers);
        });
      });
    },
  });
})(window);
