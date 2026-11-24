/*
 * The ledger of touches, the kit's, the same in every game and scene: the one record of what the child picked and whether
 * it was right first time. Only a right first touch counts as progress, in every game (Zafar, 23 Nov; non-negotiable 3):
 * every graded pick in any scene is a touch of a place, and a place stays right first only while every touch of it is
 * right. Its first wrong touch (a pick refused with Nani's "no", a wrong thing taken back, a row wrong at a look) is kept
 * for the round, and nothing later (a dish made again, a spoilt pan started anew) makes it right again. Progress, the
 * end's badges and words, and the robot read it; nothing else keeps a first try. It rides on the round. Pure.
 *
 *   entry: { who, key, filler, day, rightFirst, at }   key: the word or pattern; filler: what it filled (a card's row:
 *       "milk" or "no-milk" for the word milk); who: whose it was; day: the round's (several right picks, on different
 *       fillers, on more than one day: grammar-in-play 8(a) 6); rightFirst: null while asked and not yet touched; at: the
 *       moment the child's play first reached it, its place in the play order (none while not yet reached)
 *   asked(ledger, places) -> ledger       places a scene will grade, untouched (in the order it asks them, the card's)
 *   played(ledger, places) -> ledger      the child's play has reached these places, not yet graded (a thing let in, by
 *       the kit's one answer to which places it reaches, ./mistakes.rules.js placesReached; every row of a dish as it is
 *       first poured, the moment nothing more can go in): each keeps the moment it was first reached, `at`, its place in
 *       the play order
 *   touched(ledger, touches) -> ledger      a graded touch of each place given, { who, key, filler, day, right }, asked or
 *       not, reaching it too where nothing had; a place is known by who, key and filler together, so a word and a pattern
 *       sharing a filler never meet
 *   rowPlaces(who, items, day) -> places  a person's card, its rows as places
 *   rightFirst(ledger, place) -> true | false | null
 *   progressOf(ledger) -> the places touched, in the order the child played them (Zafar, 24 Nov: not the seats' order),
 *       each by the moment the play first reached it; a word's run reads them so
 *   NOT_ASKED: the filler of a thing nobody asked for, its own word's place (made only by ./wrong-order.rules.js
 *       strayPlace): leaving a thing out is never a touch, so this side is only ever wrong; it costs the word, and no
 *       stage waits on it
 */

export const NOT_ASKED = "not-asked";

const same = (a, b) => a.who === b.who && a.key === b.key && a.filler === b.filler;

export const rowPlaces = (who, items, day) => items.map((it) => ({ who, key: it.word, filler: it.id, day }));

export function asked(ledger, places) {
  const fresh = places.filter((p) => !ledger.some((e) => same(e, p)));
  return fresh.length ? ledger.concat(fresh.map((p) => ({ ...p, rightFirst: null }))) : ledger;
}

// the next moment in the play order
const nextAt = (ledger) => ledger.reduce((m, e) => Math.max(m, e.at || 0), 0) + 1;

/** One place reached by play or a graded touch: its entry, made where there is none, stamped `at` the first time. */
function reach(ledger, p, grade = (e) => e) {
  const i = ledger.findIndex((e) => same(e, p));
  const e = i < 0 ? { ...p, rightFirst: null } : ledger[i];
  const next = grade(e.at ? e : { ...e, at: nextAt(ledger) });
  if (i >= 0 && next === e) return ledger;
  return i < 0 ? ledger.concat(next) : ledger.map((x, j) => (j === i ? next : x));
}

export const played = (ledger, places) => places.reduce((out, p) => reach(out, p), ledger);

export function touched(ledger, touches) {
  let out = ledger;
  // (a wrong touch is kept; a right one counts only while none was wrong)
  for (const { right: r, ...p } of touches) out = reach(out, p, (e) => (e.rightFirst === false || e.rightFirst === !!r ? e : { ...e, rightFirst: !!r }));
  return out;
}

export const rightFirst = (ledger, place) => {
  const e = (ledger || []).find((x) => same(x, place));
  return e ? e.rightFirst : null;
};

export const progressOf = (ledger) =>
  (ledger || [])
    .filter((e) => e.rightFirst !== null)
    .map((e, i) => [e, i])
    .sort(([a, i], [b, j]) => (a.at || Infinity) - (b.at || Infinity) || i - j)
    .map(([e]) => e);
