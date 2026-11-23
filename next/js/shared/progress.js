/*
 * What is kept for a child between rounds: the word ladder, the grammar ladder beside it, and what has been met
 * before. It is read as a round starts and written after the round ends, so nothing the round reads changes mid-game; only
 * a first-time thing is kept as it is met (meetNow).
 *
 *   OWN_PLAYER: the child's own player, when the game's link names none        progressKey(player): where it is kept
 *   loadProgress(player) -> { id, player: { gender }, ladder: { wordId: stage }, grammar: { row: rung }, met: {…}, words: {…}, best: {…}, earned: { wordId: true } }
 *       words: { [key]: { seen, right, miss, run, won, fillers: { [filler]: { met, right, days, lastRight } }, last } }
 *       per word or pattern: its touches, right first ones, misses, the run of right ones, its shelf pill won; per filler it
 *       was met with, how often, how often right first and on how many days, and the last such day (grammar-in-play 8(a)
 *       5-6); the last day it was met, for forgetting (8(a) 7, not built); a record kept before fillers (23 Nov) loads with
 *       none yet, one kept before a filler's days with none yet
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
import { progressOf, NOT_ASKED } from "./kit/touches.rules.js";

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
  return { ...p, words: winnableSides(Object.fromEntries(Object.entries(p.words).map(([key, w]) => [key, wordRecord(w)]))) };
}

/**
 * Each word's sides that today's filing can still win, the rest dropped (a record's own rights and misses kept, and the
 * stored ladder never lowered). Until 23 Nov a thing nobody asked for was filed under the row it was counted against, or
 * under its own word where there was none (the lookalike spi-16 as "sugar" or "no-sugar"): such a side is only ever wrong,
 * so it would hold the word at stage 1 for good, in this game or a later one that asks it. It is now its word's NOT_ASKED
 * side, which the stage does not read. A side so filed is known by its shape: never won, and named after the word itself
 * or under a row another word has won (sugar's; the asked spice's). (A spice or an amount shares its row with the others of
 * its kind: if it was asked there and never won, that side goes too; it is the word's only side, so its stage, read off its
 * own rights instead, is still 1 until it is won.)
 */
function winnableSides(words) {
  const wonBy = new Map(); // a filler: the words right first under it
  for (const [key, w] of Object.entries(words))
    for (const [filler, f] of Object.entries(w.fillers)) if (f.right > 0) wonBy.set(filler, [...(wonBy.get(filler) || []), key]);
  // (a side named after its own word goes only while never won, the old stray's shape: a game whose row is named as its
  // word keeps every side the child has won there)
  const lost = (key, filler, f) => f.right === 0 && (filler === key || (wonBy.get(filler) || []).some((other) => other !== key));
  return Object.fromEntries(Object.entries(words).map(([key, w]) => [key, { ...w, fillers: Object.fromEntries(Object.entries(w.fillers).filter(([filler, f]) => !lost(key, filler, f))) }]));
}

/** A word's record in its whole shape, an older one's missing parts empty. */
function wordRecord({ days, ...w } = {}) {
  // (days were the word's, the days it was met on, until 23 Nov: they are each filler's now, the days it was right first)
  const fillers = Object.fromEntries(Object.entries(w.fillers || {}).map(([k, f]) => [k, { met: 0, right: 0, days: 0, lastRight: null, ...f }]));
  return { seen: 0, right: 0, miss: 0, run: 0, won: false, ...w, fillers, last: w.last || null };
}

/**
 * The stage a word's record earns, read off its weakest side (8(a) 6: a two-way pick is a coin toss): over every filler it
 * was met with (milk asked and not asked, "milk" and "no-milk"), the fewest right first touches set it, so always doing one
 * thing never climbs a word the other side of which was met, and one right on that side releases one right's worth, not
 * every right banked on the other. A stage from ladderK.daysFrom up needs every side right first on ladderK.days different
 * days (the ladder's table has no days for its lower stages). A thing put in that nobody asked for is its word's "not
 * asked" side (NOT_ASKED): it costs the word, but leaving a thing out is never a touch, so that side has no right to win
 * and the stage does not read it. (Every side suits a two-sided word. A pattern place with many fillers, a grammar
 * rung's, is to count the distinct fillers right first instead (8(a) 5-6): none is played yet, so none is counted so.)
 */
function stageOf(w, ladderK) {
  const sides = Object.entries(w.fillers).filter(([filler]) => filler !== NOT_ASKED).map(([, f]) => f);
  // (a record with no sides kept, a made-up player's or one kept before fillers: its rights alone)
  const weakest = sides.length ? Math.min(...sides.map((f) => f.right)) : w.right;
  const stage = Math.min(ladderK.top, 1 + Math.floor(weakest / ladderK.rightsPerStage));
  const days = sides.length ? Math.min(...sides.map((f) => f.days)) : ladderK.days;
  return stage >= ladderK.daysFrom && days < ladderK.days ? ladderK.daysFrom - 1 : stage;
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
 * A word's stage climbs with right first touches on its weakest side (stageOf), and never moves on a round in which it was
 * helped: each place the round's ledger holds touched, in the order it was asked. A round's result never lowers a stored
 * stage (the builder's, 23 Nov; Zafar to decide: hold, or drop to the weakest side when a new side is met); forgetting,
 * 8(a) 7, is not built.
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
      else [w.miss, w.run] = [w.miss + 1, 0];
      if (rightFirst && day && f.lastRight !== day) [f.days, f.lastRight] = [f.days + 1, day];
    }
    w.fillers = { ...w.fillers, [filler]: f };
    // the shelf pill loses its written word after a run of right picks; a miss brings it back until the next right pick
    w.won = w.won || w.run >= ladderK.pillRun;
    earned[key] = w.won && w.run >= 1;
    words[key] = w;
  }
  // (once the whole round is in, so a side met later in the round holds a stage a touch before it would have moved)
  for (const key of new Set(progressOf(round.touches).map((t) => t.key))) {
    ladder[key] = Math.max(ladder[key] || 1, stageOf(words[key], ladderK));
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
