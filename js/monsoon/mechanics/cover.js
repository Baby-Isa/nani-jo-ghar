/*
 * Mechanic: cover (G1, the kitchen leak; K1 "which one"). New.
 *
 * Nani calls a pot ("Hedo! Dudh!"); every ceiling stain swells together
 * (the shared countdown); tap the pot and a lid drops onto it. At the
 * reveal the one drop falls: it plinks off a lid (saved) or plops into the
 * food ("Arre re!", then the right pot flashes, after the splash: feedback
 * on a call that's already lost, never help). The hand holds one lid per
 * pot called, lids only exist while a call is live, and they pop off after
 * the wave (no camping, no elimination). After a reveal, a tap on the
 * falling pot is a dive: it saves the drop (craft) but it's `late`.
 *
 * Level 2 doubles ("{x}! Ne {y}."), level 3 adds the sequence ("Ne poi":
 * the second drop a beat later, and the order counts) and the switch
 * ("{x}! Nar {x}. {y}!", a draft line). Drizzle: the drop waits for you;
 * after 8 s Nani says it again (the first repeat per storm is free).
 *
 * Knobs (data/monsoon.json games.g1.levels): bpm, windowBeats,
 * newWordBeats, learningBeats, fall, gapBeats, waves, frames, speedUpEvery,
 * speedUp, revealGapBeats; top level: drizzle.repeatAfter, giveUpAfter.
 */
(function (global) {
  const M = global.Monsoon;

  M.Mech.define("cover", {
    game: "g1",
    play(ctx, w, T) {
      return M.Wave.which(ctx, w, T, {
        onAnswer(a, api) {
          M.Stage.lid(a.pick, true);
        },
      });
    },
  });

  /**
   * The K1 wave, shared by cover (G1) and, later, catch (G6): a call, the
   * shared countdown, one answer per target, the reveal, the landing.
   * hooks.onAnswer(answer) draws what the answer does (a lid, open arms).
   */
  M.Wave = M.Wave || {};
  M.Wave.which = function (ctx, w, T, hooks) {
    const storm = ctx.storm;
    const run = ctx.run;
    const clock = ctx.clock;
    const drizzle = storm.mode === "drizzle";
    const answers = [];
    const n = w.targets.length;
    let lids = n;
    const timers = [];
    const at = (t, fn) => timers.push(clock.at(t, () => run.alive() && fn()));
    let revealed = false;

    return new Promise((resolve) => {
      // the call: the pill appears while it's live; Nani's voice on the audio clock
      M.UI.call(run, w);
      M.UI.hand(lids, n);
      T.parts.forEach((p) => at(p.at, () => M.say(p.part)));
      M.FX.creak();
      const firstReveal = Math.min(...Object.values(T.reveal));
      M.Stage.swell(T.t0, firstReveal);
      // a stage-1 word: its pot twinkles as she says it (taught, not tested)
      w.targets.forEach((tg) => {
        if (tg.taught) {
          const kp = T.parts.find((p) => p.part.x === tg.word) || T.parts[T.parts.length - 1];
          at(kp.at, () => M.Stage.twinkle(tg.cand, true));
          at(T.keyEnd + T.beat, () => M.Stage.twinkle(tg.cand, false));
        }
        if (M.Lab && M.Lab.markers) M.Stage.marker(tg.cand, true);
      });

      const postExpect = () => {
        const next = w.frame === "sequence" ? w.targets[n - lids] : w.targets.find((tg) => !answers.some((a) => a.pick === tg.cand));
        ctx.setExpect(lids > 0 && next ? { kind: "tap", cand: next.cand, before: T.reveal[next.id], where: M.Stage.screenOf(next.cand), wave: w.i } : null);
      };
      postExpect();

      ctx.setTap((cand) => {
        const now = clock.now();
        if (now < T.t0) return M.Stage.wobble(cand);
        // an answer while any drop is still to fall (grading decides heard / late)
        const open = drizzle ? !revealed : now < Math.max(...Object.values(T.reveal));
        if (lids > 0 && open) {
          lids--;
          answers.push({ t: now, pick: cand });
          hooks.onAnswer({ t: now, pick: cand });
          M.UI.hand(lids, n);
          postExpect();
          if (drizzle && lids === 0) doReveal(now + 0.05);
          return;
        }
        // a dive: after the reveal, on a drop that's still falling
        const falling = w.targets.find((tg) => tg.cand === cand && now >= T.reveal[tg.id] && now < T.land[tg.id]);
        if (falling && !M.Stage.pot(cand).lidded) {
          answers.push({ t: now, pick: cand });
          hooks.onAnswer({ t: now, pick: cand, dive: true });
          return;
        }
        M.Stage.wobble(cand);
      });

      function doReveal(r) {
        if (revealed) return;
        revealed = true;
        w.targets.forEach((tg) => {
          T.reveal[tg.id] = r + (tg.after ? T.beat * (storm.cfg.revealGapBeats || 1) * tg.after : 0);
          T.land[tg.id] = T.reveal[tg.id] + (storm.cfg.fall || 0.6);
        });
        T.end = Math.max(...Object.values(T.land)) + (storm.cfg.gapBeats != null ? storm.cfg.gapBeats : 2) * T.beat;
        schedule();
      }
      function schedule() {
        M.Stage.swell(T.t0, Math.min(...Object.values(T.reveal)));
        w.targets.forEach((tg) =>
          at(T.reveal[tg.id], () => {
            revealed = true;
            if (T.reveal[tg.id] >= Math.max(...Object.values(T.reveal))) ctx.setExpect(null);
            M.FX.drip();
            M.Stage.drop(tg.cand, T.reveal[tg.id], T.land[tg.id], (lidded) => {
              if (!lidded) {
                // "Arre re!", then the call again; the right pot flashes after the splash
                M.UI.nani(M.lineFor({ line: "oops" }).k || "");
                M.sayLine("oops");
                setTimeout(() => M.Stage.flash(tg.cand), 250);
                M.Stage.aliLook && M.Stage.aliLook();
              }
            });
          })
        );
        at(T.end - 0.001, finish);
      }
      function finish() {
        M.Stage.swell(null);
        M.Stage.lidsOff();
        w.targets.forEach((tg) => {
          M.Stage.twinkle(tg.cand, false);
          M.Stage.marker(tg.cand, false);
        });
        M.UI.clearCall();
        M.UI.hand(0);
        M.UI.nani("");
        ctx.setTap(null);
        ctx.setExpect(null);
        resolve(answers);
      }

      if (!drizzle) schedule();
      else {
        // Drizzle: the drop waits. Nani repeats the call after a while; a lab cap ends it
        const D = storm.rules.drizzle || {};
        const again = (k) =>
          at(T.keyEnd + (D.repeatAfter || 8) * k, () => {
            if (revealed) return;
            T.parts.forEach((p) => M.say(p.part));
            if (k < 4) again(k + 1);
          });
        again(1);
        at(T.keyEnd + (D.giveUpAfter || 45), () => doReveal(clock.now()));
      }
    });
  };
})(window);
