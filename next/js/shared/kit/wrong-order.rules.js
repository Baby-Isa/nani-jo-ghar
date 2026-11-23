/*
 * What a wrong order's card shows, with no page: for each thing on the person's card, and each thing that went in that
 * nobody asked for, whether it is right, missed, too few, too many or extra; and what the card plays (Zafar's design,
 * 20 Nov, the redesign spec, wrong-order-redesign.md): the card opens with what went into the pan
 * already on it, one slot for each thing, a missing thing's slot a dotted empty card; then one pass, left to right, every
 * card in its turn (Zafar, 21 Nov, replacing his 20 Nov order by kind): a right one kept (its tick stamped), a wrong amount
 * crossed and turning over to show the right amount on its back, a thing asked and missing rising into its slot, a thing nobody
 * asked for crossed and falling, its slot going and the cards closing the gap straight after (they stand last).
 *
 *   faultsOf(items, tally) -> [{ id, word, kind, want, got }]
 *       items: the card's rows as the order gives them ({ id, word, no, said }); tally: the game's count of the dish,
 *       { rows: { [id]: { want, got } }, extra: [{ word, n }] }; kind: right | missed | few | many | extra; an extra
 *       with a "no" row for it is that row's (id), any other extra has none (id null)
 *   playOf(items, faults, made) -> { shown, slots, steps }   what the card plays, for the view only to draw:
 *       made: the dish as made, [{ row, word, n, meaning }] (the game's): each thing that went in once, a count as one card,
 *       with the row it answers (null: nobody asked for it), in the card's order
 *       shown: the rows the card asks, in its order (a row never said in the order, the water, the leaves, only when it
 *       is the fault: Zafar, 19 Nov)
 *       slots: one for each row shown, in order, then one for each thing nobody asked for, each { row, holds, made? } as
 *       the card opens: holds "asked" (its row's own card, right), "made" (a card of the thing as it went in,
 *       { word, meaning }: a wrong amount in its row's slot, or a thing nobody asked for, row null) or null (missing)
 *       steps, one for each slot in its order, the view playing each as it comes: keeps { slot, row } (a right card
 *       confirmed, its own word said as its speaker says it) | reveals { slot, row, says } (the wrong amount turns over,
 *       its row's card on its back: Zafar, 21 Nov) | unsays { slot, row, says } (a thing in a "no" order: crossed, it fades into its "no" card
 *       behind it as the big no sign shows and shrinks into the card's own sign: Zafar, 21 Nov) | rises { slot, row, says } (its row's card rises into its dotted card) | drops { slot,
 *       says } (the thing nobody asked for falls, its slot left empty), then closes { slots } (that slot goes, the cards
 *       closing the gap); each step's saysAt, when the person speaks (Zafar, 21 Nov: "say it when it's the correct item
 *       card shows ... if there's not a correct item card ... say it when the item is getting crossed"): "shown" as the right
 *       card shows (a right card's own word, a correction), "cross" with the cross (a thing nobody asked for); a correction's says: the person's own, a meaning for the language engine, natural and about that
 *       one thing, never the order again (Zafar, 20 Nov: "only two sugars", "I don't want ginger"): of a wrong amount
 *       fixOf(row, kind, word); of a thing nobody asked for, notWanted(thing) "I don't want cumin."; missed, wanted(row)
 *       "I'd like cardamom." (his "don't forget the milk" is not in the grammar yet: a line for Mum)
 *   fixOf(row, kind, word) -> what the person says of a wrong amount (kind: many | few; word: the thing as it went in):
 *       a "no" row's thing, notWanted; the other of a pair (half for whole), the row's own card's line "whole"; too many,
 *       onlyThis(row) "Only one sugar."; too few, wanted(row) "I'd like three sugars."
 *   dishCheck(items, tally) -> { right, faults }   the one answer to "is this dish what was asked": right when every fault
 *       is right
 *   strayPlace(fault) -> { key, filler }   a thing nobody asked for, its own word's place: the word, filling its own "not
 *       asked" filler (./touches.rules.js NOT_ASKED), never the row it is counted against (an unasked spice is not the
 *       asked spice's side, the lookalike not sugar's), so putting it in costs its own word, card row or not, and the
 *       stage's gate, which needs every asked side right, never waits on a side that cannot be won (23 Nov)
 */
import { NOT_ASKED } from "./touches.rules.js";

export function faultsOf(items, tally) {
  const out = items.map((it) => {
    const { want = 0, got = 0 } = tally.rows[it.id] || {};
    const kind = it.no ? (got > 0 ? "extra" : "right") : got === 0 ? "missed" : got < want ? "few" : got > want ? "many" : "right";
    return { id: it.id, word: it.word, kind, want, got };
  });
  return out.concat(tally.extra.filter((x) => x.n > 0).map((x) => ({ id: null, word: x.word, kind: "extra", want: 0, got: x.n, against: x.against || null })));
}

export const isRight = (faults) => faults.every((f) => f.kind === "right");

export const notWanted = (thing) => {
  // (one of a thing, however many went in: "I don't want cumin")
  const { n, ...one } = thing;
  return { fn: "NotNeed", thing: one };
};
export const onlyThis = (row) => ({ fn: "Only", x: row.meaning });
export const wanted = (row) => ({ fn: "Need", who: "p1", thing: row.meaning });
export function fixOf(row, kind, word) {
  if (row.no) return notWanted(row.meaning.x);
  if (word !== row.word) return row.meaning;
  return kind === "many" ? onlyThis(row) : wanted(row);
}

export function playOf(items, faults, made) {
  const faultOf = (id) => faults.find((f) => f.id === id);
  const itemOf = (id) => items.find((it) => it.id === id);
  const shown = items.filter((it) => it.said || faultOf(it.id).kind !== "right").map((it) => it.id);
  const card = (m) => ({ word: m.word, meaning: m.meaning });
  const asked = shown.map((row) => {
    const m = made.find((x) => x.row === row);
    const it = itemOf(row);
    // right: the same thing its row asks for, as many (a "no" row is right with nothing in, and has nothing made)
    if (faultOf(row).kind === "right" && (!m || (!it.no && it.word === m.word))) return { row, holds: "asked" };
    return m ? { row, holds: "made", made: card(m) } : { row, holds: null };
  });
  const slots = asked.concat(made.filter((m) => !m.row).map((m) => ({ row: null, holds: "made", made: card(m) })));
  // one pass, left to right, every card in its turn (Zafar, 21 Nov: "fix the first card, fix the second card ... or like,
  // confirm it's correct as it goes along"): a right one kept, a wrong amount revealed, a missing one risen in, a thing nobody
  // asked for dropped and its gap closed straight after (those stand last, so the card narrows at its end)
  const steps = [];
  const madeOf = (s) => made.find((m) => m.word === s.made.word && !m.row);
  slots.forEach((s, slot) => {
    // (saysAt: the person's words as the right card shows, where there is one; with the cross where there is none: Zafar, 21 Nov)
    if (s.holds === "asked") steps.push({ do: "keeps", slot, row: s.row, saysAt: "shown" });
    else if (s.holds === null) steps.push({ do: "rises", slot, row: s.row, says: wanted(itemOf(s.row)), saysAt: "shown" });
    else if (s.row) steps.push({ do: itemOf(s.row).no ? "unsays" : "reveals", slot, row: s.row, says: fixOf(itemOf(s.row), faultOf(s.row).kind, s.made.word), saysAt: "shown" });
    else steps.push({ do: "drops", slot, says: notWanted(madeOf(s).meaning), saysAt: "cross" }, { do: "closes", slots: [slot] });
  });
  return { shown, slots, steps };
}

export function dishCheck(items, tally) {
  const faults = faultsOf(items, tally);
  return { right: isRight(faults), faults };
}

export const strayPlace = (f) => ({ key: f.word, filler: NOT_ASKED });
