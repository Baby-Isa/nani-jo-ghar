/*
 * What is kept for a child between rounds: the word ladder, the grammar ladder beside it, and what has been met
 * before. It is read as a round starts and written only after the round ends, so nothing changes mid-game.
 *
 *   OWN_PLAYER: the child's own player, when the game's link names none        progressKey(player): where it is kept
 *   loadProgress(player) -> { id, player: { gender }, ladder: { wordId: stage }, grammar: { row: rung }, met: {…}, words: {…}, best: {…}, earned: { wordId: true } }
 *   saveRound(progress, round)        folds a finished round in and stores it
 *   afterRound(progress, round, ladderK) -> progress     the same without storing (pure); ladderK: the kit's ladder numbers
 *   knowing(progress, settings, ladderK) -> progress     a player who already knows the game's words (settings.words)
 *   wordStage(ladder, wordId, ladderK) -> "new" | "learning" | "known"
 *   storeProgress(progress)            keeps it for the player's next round
 */
export const OWN_PLAYER = "child";
export const progressKey = (id) => `njg:${id}`;

export function loadProgress(id) {
  let stored = null;
  try {
    stored = JSON.parse(globalThis.localStorage.getItem(progressKey(id)));
  } catch (e) {
    stored = null;
  }
  return { id, player: { gender: null }, ladder: {}, grammar: {}, met: {}, words: {}, best: {}, earned: {}, ...(stored || {}) };
}

const stageOf = (w, ladderK) => Math.min(ladderK.top, 1 + Math.floor(w.right / ladderK.rightsPerStage));

/** How far along the child is with a word, as the cards and the order's pace read it. */
export function wordStage(ladder, id, ladderK) {
  const n = ladder[id] || 0;
  return n >= ladderK.knownFrom ? "known" : n >= ladderK.learningFrom ? "learning" : "new";
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
      ladder[item.word] = stageOf(w, ladderK);
    });
  }
  const key = `${round.game}:${round.level}`;
  const best = { ...progress.best };
  if (round.cookMs && (!best[key] || round.cookMs < best[key])) best[key] = round.cookMs;
  return { ...progress, words, ladder, earned, best, met: { ...progress.met, ...round.met, [`played:${round.game}`]: true } };
}

/**
 * Each of the game's words (the ids its settings name under `words`) as if picked right first time, running, often enough
 * to stand at the ladder's known stage with its shelf pill earned: support is off for it, as for a child who has learnt
 * it. The same record a child's own rounds would leave; for a made-up player only: the child's own record is refused.
 */
export function knowing(progress, settings, ladderK) {
  if (progress.id === OWN_PLAYER) throw new Error("knowing: the child's own record is never made up");
  const wordIds = Object.values(settings.words).flat();
  const right = Math.max((ladderK.knownFrom - 1) * ladderK.rightsPerStage, ladderK.pillRun);
  const words = { ...progress.words };
  const ladder = { ...progress.ladder };
  const earned = { ...progress.earned };
  for (const id of wordIds) {
    words[id] = { seen: right, right, miss: 0, run: right, won: true };
    ladder[id] = stageOf(words[id], ladderK);
    earned[id] = true;
  }
  return { ...progress, words, ladder, earned };
}

export function storeProgress(p) {
  try {
    globalThis.localStorage.setItem(progressKey(p.id), JSON.stringify({ player: p.player, ladder: p.ladder, grammar: p.grammar, met: p.met, words: p.words, best: p.best, earned: p.earned }));
  } catch (e) {
    /* a private window: the round was still played */
  }
}

export function saveRound(progress, round, ladderK) {
  const next = afterRound(progress, round, ladderK);
  Object.assign(progress, next);
  storeProgress(next);
  return next;
}
