/*
 * What is kept for a child between rounds: the word ladder, the grammar ladder beside it, and what has been met
 * before. It is read as a round starts and written after the round ends, so nothing the round reads changes mid-game; only
 * a first-time thing is kept as it is met (meetNow).
 *
 *   OWN_PLAYER: the child's own player, when the game's link names none        progressKey(player): where it is kept
 *   loadProgress(player) -> { id, player: { gender }, ladder: { wordId: stage }, grammar: { row: rung }, met: {…}, words: {…}, best: {…}, earned: { wordId: true } }
 *       words: { [key]: { seen, right, miss, run, won, fillers: { [filler]: { met, right, days, lastRight } }, last } }
 *       per word or pattern: its touches, right first ones, misses, the run of right first ones, a slip stepping it back
 *       one stage's worth (its stage and its shelf pill read it), its shelf pill won; per filler it was met with, how often, how often right first and on how many
 *       days, and the last such day (grammar-in-play 8(a) 5-6: kept, not read by the stage since 24 Nov); the last day it
 *       was met, for forgetting (8(a) 7, not built); a record kept before fillers (23 Nov) loads with none yet, one kept
 *       before a filler's days with none yet
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
  const p = { id, player: { gender: null }, ladder: {}, grammar: {}, met: {}, words: {}, best: {}, earned: {}, ...(stored || {}) };
  // (a stored stage stands until its word is next met, then it is read off the run: stageOf)
  return { ...p, words: Object.fromEntries(Object.entries(p.words).map(([key, w]) => [key, wordRecord(w)])) };
}

/** A word's record in its whole shape, an older one's missing parts empty. */
function wordRecord({ days, ...w } = {}) {
  // (days were the word's, the days it was met on, until 23 Nov: they are each filler's now, the days it was right first)
  const fillers = Object.fromEntries(Object.entries(w.fillers || {}).map(([k, f]) => [k, { met: 0, right: 0, days: 0, lastRight: null, ...f }]));
  return { seen: 0, right: 0, miss: 0, run: 0, won: false, ...w, fillers, last: w.last || null };
}

/**
 * The stage a word's record earns: one ladder for both sides of a word (Zafar, 24 Nov; grammar-in-play 9(a) 32). It is
 * read off the word's run of right first tries, one stage for every ladderK.rightsPerStage of them, up to the top: a right
 * first try counts the same whichever side it was on (milk asked or not, "milk" or "no-milk"), and a wrong first try (a
 * thing put in that nobody asked for, its word's "not asked" side, included) costs one stage (stepDown). A child who
 * always does one thing is wrong each time the other side is asked, a stage lost for every right one gained, and never
 * climbs; a lucky streak is not kept. (A pattern place with many fillers, a grammar rung's, is to count the distinct
 * fillers right first instead (8(a) 5-6): none is played yet, so none is counted so.)
 */
function stageOf(w, ladderK) {
  return Math.min(ladderK.top, 1 + Math.floor(w.run / ladderK.rightsPerStage));
}

/**
 * A slip drops a word one stage, not back to the start (Zafar, 24 Nov): the run steps back one stage's worth from where
 * the ladder stands (a run past the top counts as the top's), never below stage 1. Forgetting (grammar-in-play 8(a) 7,
 * not built) is to take the same one step down for a word not met for a while.
 */
function stepDown(run, ladderK) {
  const topRun = (ladderK.top - 1) * ladderK.rightsPerStage;
  return Math.max(0, Math.min(run, topRun) - ladderK.rightsPerStage);
}

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
 * A word's stage follows its run of right first touches (stageOf), and never moves on a round in which it was helped: each
 * place the round's ledger holds touched, in the order the child played it. A round's result may lower a stored stage:
 * a wrong first try steps the run back one stage (stepDown; the builder's 23 Nov hold, "never lowered", is gone with
 * 24 Nov's one ladder: held, any lucky run would stand for good). Forgetting, 8(a) 7, is not built.
 */
export function afterRound(progress, round, ladderK) {
  const words = { ...progress.words };
  const ladder = { ...progress.ladder };
  const earned = { ...progress.earned };
  const peeked = new Set(round.peeks || []);
  for (const { key, filler, day, rightFirst } of progressOf(round.touches)) {
    const w = wordRecord(words[key]);
    w.seen += 1;
    const f = { met: 0, right: 0, days: 0, lastRight: null, ...(w.fillers[filler] || {}) };
    f.met += 1;
    if (day) w.last = day;
    // a peek is exposure: it neither counts nor breaks the run
    if (!peeked.has(key)) {
      if (rightFirst) [w.right, w.run, f.right] = [w.right + 1, w.run + 1, f.right + 1];
      else [w.miss, w.run] = [w.miss + 1, stepDown(w.run, ladderK)];
      if (rightFirst && day && f.lastRight !== day) [f.days, f.lastRight] = [f.days + 1, day];
    }
    w.fillers = { ...w.fillers, [filler]: f };
    // the shelf pill loses its written word once the run reaches pillRun (the same run as the stage, so a slip on the way
    // there steps it back too); a miss brings the word back until the next right pick, as the last first try says (a slip
    // steps the run back only one stage, so the run alone cannot say it)
    w.won = w.won || w.run >= ladderK.pillRun;
    if (!peeked.has(key)) earned[key] = w.won && !!rightFirst;
    words[key] = w;
  }
  // (once the whole round is in: the run as the round leaves it; a word peeked at keeps its stage, run untouched)
  for (const key of new Set(progressOf(round.touches).map((t) => t.key))) if (!peeked.has(key)) ladder[key] = stageOf(words[key], ladderK);
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
    words[id] = wordRecord({ seen: right, right, miss: 0, run: right, won: true });
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
