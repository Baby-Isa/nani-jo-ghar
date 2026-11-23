/*
 * The ledger of touches, the kit's, the same in every game and scene: the one record of what the child picked and whether
 * it was right first time. Only a right first touch counts as progress, in every game (Zafar, 23 Nov; non-negotiable 3):
 * every graded pick in any scene is a touch of a place, and a place stays right first only while every touch of it is
 * right. Its first wrong touch (a pick refused with Nani's "no", a wrong thing taken back, a row wrong at a look) is kept
 * for the round, and nothing later (a dish made again, a spoilt pan started anew) makes it right again. Progress, the
 * end's badges and words, and the robot read it; nothing else keeps a first try. It rides on the round. Pure.
 *
 *   entry: { who, key, filler, day, rightFirst }   key: the word or pattern; filler: what it filled (a card's row: "milk"
 *       or "no-milk" for the word milk); who: whose it was; day: the round's (several right picks, on different fillers, on
 *       more than one day: grammar-in-play 8(a) 6); rightFirst: null while asked and not yet touched
 *   asked(ledger, places) -> ledger       places a scene will grade, untouched, in the order it asks them: the ledger keeps
 *       that order, which progress reads them in (so a place touched wrong early still counts in its turn)
 *   touched(ledger, touches) -> ledger      a graded touch of each place given, { who, key, filler, day, right }, asked or
 *       not; a place is known by who, key and filler together, so a word and a pattern sharing a filler never meet
 *   rowPlaces(who, items, day) -> places  a person's card, its rows as places
 *   rightFirst(ledger, place) -> true | false | null      progressOf(ledger) -> the places touched, in order
 *   NOT_ASKED: the filler of a thing nobody asked for, its own word's place (./wrong-order.rules.js strayPlace): leaving a
 *       thing out is never a touch, so this side is only ever wrong; it costs the word, and no stage waits on it
 */

export const NOT_ASKED = "not-asked";

const same = (a, b) => a.who === b.who && a.key === b.key && a.filler === b.filler;

export const rowPlaces = (who, items, day) => items.map((it) => ({ who, key: it.word, filler: it.id, day }));

export function asked(ledger, places) {
  const fresh = places.filter((p) => !ledger.some((e) => same(e, p)));
  return fresh.length ? ledger.concat(fresh.map((p) => ({ ...p, rightFirst: null }))) : ledger;
}

export function touched(ledger, touches) {
  let out = ledger;
  for (const { right: r, ...p } of touches) {
    const right = !!r;
    const at = out.findIndex((e) => same(e, p));
    // (a wrong touch is kept; a right one counts only while none was wrong)
    if (at < 0) out = out.concat({ ...p, rightFirst: right });
    else if (out[at].rightFirst !== false && out[at].rightFirst !== right) out = out.map((e, i) => (i === at ? { ...e, rightFirst: right } : e));
  }
  return out;
}

export const rightFirst = (ledger, place) => {
  const e = (ledger || []).find((x) => same(x, place));
  return e ? e.rightFirst : null;
};

export const progressOf = (ledger) => (ledger || []).filter((e) => e.rightFirst !== null);
