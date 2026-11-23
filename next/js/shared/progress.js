/*
 * What is kept for a child between rounds: the word ladder, the grammar ladder beside it, and what has been met
 * before. It is read as a round starts and written after the round ends, so nothing the round reads changes mid-game; only
 * a first-time thing is kept as it is met (meetNow).
 *
 *   OWN_PLAYER: the child's own player, when the game's link names none        progressKey(player): where it is kept
 *   loadProgress(player) -> { id, player: { gender }, ladder: { wordId: stage }, grammar: { row: rung }, met: {…}, words: {…}, best: {…}, earned: { wordId: true } }
 *   saveRound(progress, round)        folds a finished round in and stores it
 *   afterRound(progress, round, ladderK) -> progress     the same without storing (pure); ladderK: the kit's ladder numbers;
 *       it reads the round's ledger of touches (./kit/touches.rules.js), so a pick graded in any scene counts alike
 *   knowing(progress, settings, kit) -> progress     a player who already knows the game's words (settings.words)
 *   triedOf(progress) -> { wordId: true }     the words picked right at least once
 *   wordStage({ earned, tried }, wordId) -> "new" | "learning" | "known"     (a round carries both)
 *   storeProgress(progress)            keeps it for the player's next round
 *   meetNow(progress, key)             something met for good the moment it is shown (the first-time lesson), kept at once
 *   newPlayer() -> id                  a fresh player; the last one made so is forgotten (one at a time), the child's never
 *   isNewPlayer(id) -> boolean         a player made by newPlayer, not the child's own
 *   playerName(id, words) -> who is playing, in the grown-ups' words (kit.cog.player: own, fresh)
 */
import { progressOf } from "./kit/touches.rules.js";

export const OWN_PLAYER = "child";
export const progressKey = (id) => `njg:${id}`;
// the start of every new player's name (made by the cog's "New player" or the labs page), so the last one can be found and cleared
const NEW_PLAYER = "new-";
export const isNewPlayer = (id) => String(id).startsWith(NEW_PLAYER);
export const playerName = (id, words) => (id === OWN_PLAYER ? words.own : isNewPlayer(id) ? words.fresh : String(id));
export function newPlayer() {
  try {
    Object.keys(globalThis.localStorage).filter((k) => k.startsWith(progressKey(NEW_PLAYER))).forEach((k) => globalThis.localStorage.removeItem(k));
  } catch (e) {
    /* nothing kept to clear */
  }
  return `${NEW_PLAYER}${Date.now().toString(36)}`;
}

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

/** The words the child has picked right at least once. */
export const triedOf = (progress) => Object.fromEntries(Object.entries(progress.words || {}).filter(([, w]) => w.right > 0).map(([id]) => [id, true]));

/**
 * How well the child knows a word, as the order's pace reads it (the old game's: old js/shared/rules.js:154-158): known once
 * its shelf pill is earned, learning from one right try, else new. Apart from the ladder, whose stages move only by twos.
 */
export function wordStage({ earned = {}, tried = {} }, id) {
  return earned[id] ? "known" : tried[id] ? "learning" : "new";
}

/**
 * A word's stage climbs with right first touches and never moves on a round in which it was helped: each place the round's
 * ledger holds touched, in the order it was asked.
 */
export function afterRound(progress, round, ladderK) {
  const words = { ...progress.words };
  const ladder = { ...progress.ladder };
  const earned = { ...progress.earned };
  const peeked = new Set(round.peeks || []);
  for (const { key, rightFirst } of progressOf(round.touches)) {
    const w = { seen: 0, right: 0, miss: 0, run: 0, won: false, ...(words[key] || {}) };
    w.seen += 1;
    // a peek is exposure: it neither counts nor breaks the run
    if (!peeked.has(key)) {
      if (rightFirst) [w.right, w.run] = [w.right + 1, w.run + 1];
      else [w.miss, w.run] = [w.miss + 1, 0];
    }
    // the shelf pill loses its written word after a run of right picks; a miss brings it back until the next right pick
    w.won = w.won || w.run >= ladderK.pillRun;
    earned[key] = w.won && w.run >= 1;
    words[key] = w;
    ladder[key] = stageOf(w, ladderK);
  }
  const key = `${round.game}:${round.level}`;
  const best = { ...progress.best };
  if (round.cookMs && (!best[key] || round.cookMs < best[key])) best[key] = round.cookMs;
  return { ...progress, words, ladder, earned, best, met: { ...progress.met, ...round.met, [`played:${round.game}`]: true } };
}

/**
 * Each of the game's words (the ids its settings name under `words`) as if picked right first time, running, often enough
 * to stand past support on the ladder with its shelf pill earned: support is off for it, as for a child who has learnt
 * it. The same record a child's own rounds would leave; for a made-up player only: the child's own record is refused.
 */
export function knowing(progress, settings, kit) {
  if (progress.id === OWN_PLAYER) throw new Error("knowing: the child's own record is never made up");
  const ladderK = kit.ladder;
  const wordIds = Object.values(settings.words).flat();
  const right = Math.max((kit.help.pastSupportFrom - 1) * ladderK.rightsPerStage, ladderK.pillRun);
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

/**
 * Met for good the moment it is shown, not at the round's end: a round left early would show it again. Kept apart from
 * the ladder, which still moves only between rounds.
 */
export function meetNow(progress, key) {
  progress.met = { ...progress.met, [key]: true };
  storeProgress(progress);
}

export function saveRound(progress, round, ladderK) {
  const next = afterRound(progress, round, ladderK);
  Object.assign(progress, next);
  storeProgress(next);
  return next;
}
