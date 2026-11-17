/*
 * What is kept for a child between rounds: the word ladder, the grammar ladder beside it, and what has been met
 * before. It is read as a round starts and written only after the round ends, so nothing changes mid-game.
 *
 *   loadProgress(player) -> { id, player: { gender }, ladder: { wordId: stage }, grammar: { row: rung }, met: {…}, words: {…}, best: {…}, earned: { wordId: true } }
 *   saveRound(progress, round)        folds a finished round in and stores it
 *   afterRound(progress, round, ladderK) -> progress     the same without storing (pure); ladderK: the kit's ladder numbers
 */
const KEY = (id) => `njg:${id}`;

export function loadProgress(id) {
  let stored = null;
  try {
    stored = JSON.parse(globalThis.localStorage.getItem(KEY(id)));
  } catch (e) {
    stored = null;
  }
  return { id, player: { gender: null }, ladder: {}, grammar: {}, met: {}, words: {}, best: {}, earned: {}, ...(stored || {}) };
}

/** A word's stage climbs with right first tries and never moves on a round in which it was helped. */
export function afterRound(progress, round, ladderK) {
  const words = { ...progress.words };
  const ladder = { ...progress.ladder };
  const earned = { ...progress.earned };
  const peeked = new Set(round.peeks || []);
  for (const [i, person] of round.order.for.entries()) {
    const dish = round.dishes[i];
    person.items.forEach((item, n) => {
      const w = { seen: 0, right: 0, miss: 0, run: 0, won: false, ...(words[item.word] || {}) };
      w.seen += 1;
      // a peek is exposure: it neither counts nor breaks the run
      if (!peeked.has(item.word)) {
        if (dish.rowsRight[n]) [w.right, w.run] = [w.right + 1, w.run + 1];
        else [w.miss, w.run] = [w.miss + 1, 0];
      }
      // the shelf pill loses its written word after a run of right picks; a miss brings it back until the next right pick
      w.won = w.won || w.run >= ladderK.pillRun;
      earned[item.word] = w.won && w.run >= 1;
      words[item.word] = w;
      ladder[item.word] = Math.min(ladderK.top, 1 + Math.floor(w.right / ladderK.rightsPerStage));
    });
  }
  const key = `${round.game}:${round.level}`;
  const best = { ...progress.best };
  if (round.cookMs && (!best[key] || round.cookMs < best[key])) best[key] = round.cookMs;
  return { ...progress, words, ladder, earned, best, met: { ...progress.met, ...round.met, [`played:${round.game}`]: true } };
}

export function saveRound(progress, round, ladderK) {
  const next = afterRound(progress, round, ladderK);
  Object.assign(progress, next);
  try {
    globalThis.localStorage.setItem(KEY(progress.id), JSON.stringify({ player: next.player, ladder: next.ladder, grammar: next.grammar, met: next.met, words: next.words, best: next.best, earned: next.earned }));
  } catch (e) {
    /* a private window: the round was still played */
  }
  return next;
}
