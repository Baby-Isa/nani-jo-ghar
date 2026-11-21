/*
 * What a wrong order's card shows, with no page: for each thing on the person's card, and each thing that went in that
 * nobody asked for, whether it is right, missed, too few, too many or extra; and what the card plays (Zafar's design,
 * 20 Nov, the redesign spec, wrong-order-redesign.md): the card opens with what went into the pan
 * already on it, one slot for each thing, a missing thing's slot a dotted empty card; then what is wrong goes, one at a
 * time, left to right (a wrong amount crossed and falling to show the right amount behind it, a thing nobody asked for
 * crossed and falling); then the closing step, the slots of the things nobody asked for going and the cards closing the
 * gap (a missing thing's dotted card keeps its width all along); then each thing asked and missing rises into its slot,
 * left to right (Zafar, 20 Nov).
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
 *       the card opens: holds "asked" (its row's own card, right: ticked), "made" (a card of the thing as it went in,
 *       { word, meaning }: a wrong amount in its row's slot, or a thing nobody asked for, row null) or null (missing)
 *       steps, in order, the view playing each as it comes: reveals { slot, row, says } (the wrong amount falls; its row's
 *       card is behind it) | drops { slot, says } (the thing nobody asked for falls, its slot left empty) | closes { slots }
 *       (once, after every reveal and drop, where any dropped: those slots go, the cards closing the gap) | rises { slot,
 *       row, says } (its row's card rises into its dotted card); says: the person's own correction, a meaning for the
 *       language engine, natural and about that one thing, never the order again (Zafar, 20 Nov: "only two sugars", "I
 *       don't want ginger"): of a wrong amount fixOf(row, kind, word); of a thing nobody asked for, notWanted(thing) "I
 *       don't want cumin."; missed, wanted(row) "I'd like cardamom." (his "don't forget the milk" is not in the grammar
 *       yet: a line for Mum)
 *   fixOf(row, kind, word) -> what the person says of a wrong amount (kind: many | few; word: the thing as it went in):
 *       a "no" row's thing, notWanted; the other of a pair (half for whole), the row's own card's line "whole"; too many,
 *       onlyThis(row) "Only one sugar."; too few, wanted(row) "I'd like three sugars."
 *   dishCheck(items, tally) -> { right, faults, byRow, lost }   the one answer to "is this dish what was asked": right when
 *       every fault is right; byRow: each card row right, and costed by no extra (the ticks and the word ladder read it);
 *       lost: the rows whose first try was lost
 */
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
  // what is wrong goes first, left to right as it stands; then the gaps close; then what is missing rises in, left to right
  const steps = [];
  const madeOf = (s) => made.find((m) => m.word === s.made.word && !m.row);
  slots.forEach((s, slot) => s.holds === "made" && steps.push(s.row ? { do: "reveals", slot, row: s.row, says: fixOf(itemOf(s.row), faultOf(s.row).kind, s.made.word) } : { do: "drops", slot, says: notWanted(madeOf(s).meaning) }));
  const dropped = steps.filter((st) => st.do === "drops").map((st) => st.slot);
  if (dropped.length) steps.push({ do: "closes", slots: dropped });
  slots.forEach((s, slot) => s.holds === null && steps.push({ do: "rises", slot, row: s.row, says: wanted(itemOf(s.row)) }));
  return { shown, slots, steps };
}

export function dishCheck(items, tally) {
  const faults = faultsOf(items, tally);
  const byRow = Object.fromEntries(items.map((it) => [it.id, faults.some((f) => f.id === it.id && f.kind === "right") && !faults.some((f) => f.id === null && f.against === it.id)]));
  return { right: isRight(faults), faults, byRow, lost: tally.lost || [] };
}
