/*
 * One scoring model for every mode (target-model § 3.5; rule H5; decisions 1-3): the three end-of-round
 * badges (time, accuracy, hints) with a personal best per mode, game and level. No stars of any kind.
 * The tiers are exactly js/shared/results.js's (build/core/score.test.mjs compares them input for input).
 *
 * Pure:
 *   bestKey(mode, game, level)   "cook/chai/L2" (the same key Results uses, so the stored bests carry over)
 *   seconds(ms)  clock(ms)  judgeTime(timeMs, prevMs)  accuracyTier(right, total)  hintTier(hints)
 *   badges(round, prevBestMs) -> { time, accuracy, hints }
 * With the save:
 *   const S = createScore({ save, wallet, progress, economy })
 *   S.best(mode, game, level)              the stored best (ms) or undefined
 *   S.finish(round) -> { badges, best, pay, words }   writes the best (ui.bests), the coins (wallet), the word
 *                                                     evidence (words) and, in story mode, the story log line
 *                                                     (story) in one step (R4/R5 wire this)
 *
 * A round (filled in by the framework's tally; js/core/types.js has the full shape):
 *   { mode, game, level, timeMs, right, total, marks?, hints,
 *     rows?: [{ word, ok, cue?, firstTry? }], spoken?: [{ word, ok, via? }], tasks?, play? }
 */

export const bestKey = (mode, game, level) => `${mode || "?"}/${game || "-"}/L${level == null ? 1 : level}`;
export const seconds = (ms) => Math.max(0, Math.round((ms || 0) / 1000));
export function clock(ms) {
  const s = seconds(ms);
  if (s < 100) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

/** This round's time against the stored best: gold for a new best (or the first time, quietly), mid within ~25%, else plain. */
export function judgeTime(timeMs, prevMs) {
  const has = prevMs != null && isFinite(prevMs);
  const first = !has;
  const newBest = has && seconds(timeMs) < seconds(prevMs);
  const bestMs = has ? Math.min(prevMs, timeMs) : timeMs;
  const tier = first || newBest ? "gold" : timeMs <= prevMs * 1.25 ? "mid" : "plain";
  return { seconds: seconds(timeMs), timeMs, prevMs: has ? prevMs : null, bestMs, first, newBest, changed: bestMs !== prevMs, tier };
}
/** gold = all right; mid = at least 60% right; plain below; none = nothing was asked. */
export function accuracyTier(right, total) {
  if (!total) return "none";
  if (right >= total) return "gold";
  return right / total >= 0.6 ? "mid" : "plain";
}
/** 0 hints gold, 1 mid, 2 or more plain. */
export const hintTier = (hints) => (!hints ? "gold" : hints === 1 ? "mid" : "plain");

export function badges(r, prevBestMs) {
  const right = Math.max(0, Math.min(r.right || 0, r.total || 0));
  return {
    time: r.timeMs == null ? null : judgeTime(r.timeMs, prevBestMs),
    accuracy: { right, total: r.total || 0, wrong: (r.total || 0) - right, tier: accuracyTier(right, r.total || 0), marks: r.marks || null },
    hints: { count: r.hints || 0, tier: hintTier(r.hints || 0) },
  };
}

/** The scoring service. `wallet`, `progress` and `log` are optional (a round can be judged without paying). */
export function createScore({ save, wallet, progress, log } = {}) {
  const ui = () => (save ? save.get("ui") : {});
  const S = {
    best: (mode, game, level) => (ui().bests || {})[bestKey(mode, game, level)],
    badges,
    finish(round) {
      const key = bestKey(round.mode, round.game, round.level);
      const prev = S.best(round.mode, round.game, round.level);
      const b = badges(round, prev);
      if (save && b.time && b.time.changed) save.update("ui", (d) => ((d.bests = Object.assign({}, d.bests, { [key]: b.time.bestMs })), d));
      let words = 0;
      if (progress) {
        (round.rows || []).forEach((x) => {
          if (!x || !x.word) return;
          progress.heard(x.word, { ok: !!x.ok, cue: x.cue || "kutchi", firstTry: x.firstTry });
          words++;
        });
        (round.spoken || []).forEach((x) => x && x.word && progress.said(x.word, { ok: !!x.ok, via: x.via || "speech" }));
      }
      const spoken = round.spoken || [];
      const pay = wallet
        ? wallet.pay({
            mode: round.mode,
            game: round.game,
            level: round.level,
            tasks: round.tasks != null ? round.tasks : round.total,
            right: b.accuracy.right,
            total: b.accuracy.total,
            hints: b.hints.count,
            timeTier: b.time ? b.time.tier : null,
            spoken: { ok: spoken.filter((x) => x && x.ok).length, total: spoken.length },
          })
        : null;
      // the round's line in the story log (story mode only: free play has no story to tell)
      const play = round.play || {};
      if (log && play.play === "story" && play.arc) log.log({ arc: play.arc, chapter: play.chapter, errand: play.errand, type: "round", what: round.game, count: b.accuracy.right });
      return { key, badges: b, best: b.time ? { ms: b.time.bestMs, newBest: b.time.newBest, first: b.time.first } : null, pay, words };
    },
  };
  return S;
}

export default createScore;
