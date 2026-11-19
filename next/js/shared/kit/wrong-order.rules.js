/*
 * What a wrong order's card shows, with no page: for each thing on the person's card, and each thing that went in that
 * nobody asked for, whether it is right, missed, too few, too many or extra; and what the card plays (Zafar's design,
 * 19 Nov): what was in the pan comes onto the card one thing at a time, a count as one card; a right thing is ticked; a
 * wrong thing is crossed and drops out, a count too many splitting, its crossed rest dropping out; each thing asked and
 * missing rises in and is ticked, a count too few topped up; so the card ends as the order as asked, all ticked.
 *
 *   faultsOf(items, tally) -> [{ id, word, kind, want, got }]
 *       items: the card's rows as the order gives them ({ id, word, no, said }); tally: the game's count of the dish,
 *       { rows: { [id]: { want, got } }, extra: [{ word, n }] }; kind: right | missed | few | many | extra; an extra
 *       with a "no" row for it is that row's (id), any other extra has none (id null)
 *   playOf(items, faults, made, thing) -> { shown, most, steps }   what the card plays, for the view only to draw:
 *       made: the dish as made, [{ row, word, n, meaning }] (the game's): each thing that went in once, a count as one card,
 *       with the row it answers (null: nobody asked for it), in the card's order; thing(word, n): the meaning of n of a
 *       thing (the game's), for a count's rest
 *       shown: the rows the card ends with, the order as asked (a row never said in the order, the water, the leaves, only
 *       when it is the fault: Zafar, 19 Nov); most: the most cards on it at once
 *       steps, in order: lands { key, row, word, meaning, right } (from the pan; right: ticked as it lands) | drops { key }
 *       | splits { key, row, over: { word, meaning } } (it becomes its row, ticked; the crossed rest drops out)
 *       | rises { row, says } (its row's card rises into its place, ticked; says: said by the person, it was wrong)
 *       | tops { key, row, add: { word, meaning } } (what was short rises onto it; it becomes its row, ticked, said)
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

export function playOf(items, faults, made, thing) {
  const faultOf = (id) => faults.find((f) => f.id === id);
  const itemOf = (id) => items.find((it) => it.id === id);
  const shown = items.filter((it) => it.said || faultOf(it.id).kind !== "right").map((it) => it.id);
  const steps = [];
  const on = []; // the cards on it now, in place: { key, row, as } (as: the row it now is, ticked; null: not yet)
  let most = 0;
  const count = (extra = 0) => (most = Math.max(most, on.length + extra));
  // what went in, one card each (a row never said, and right, is not on the card)
  made.forEach((m, i) => {
    if (m.row && !shown.includes(m.row)) return;
    const it = m.row && itemOf(m.row);
    // the same thing its row asks for (not a "no" row's, not the other of a pair such as half for full)
    const same = !!it && !it.no && it.word === m.word;
    const kind = same ? faultOf(m.row).kind : "wrong";
    const key = `made-${i}`;
    steps.push({ do: "lands", key, row: m.row, word: m.word, meaning: m.meaning, right: kind === "right" });
    on.push({ key, row: m.row, word: m.word, kind, as: kind === "right" ? m.row : null });
    count();
  });
  // what is wrong, out of the card one at a time; a count too many splits, its rest dropping out
  for (const c of on.slice()) {
    if (c.kind === "right" || c.kind === "few") continue;
    if (c.kind === "many") {
      const f = faultOf(c.row);
      steps.push({ do: "splits", key: c.key, row: c.row, over: { word: c.word, meaning: thing(c.word, f.got - f.want) } });
      count(1);
      c.as = c.row;
      continue;
    }
    steps.push({ do: "drops", key: c.key });
    on.splice(on.indexOf(c), 1);
  }
  // what was asked and is missing rises in, in the card's order; a count too few is topped up
  for (const row of shown) {
    const c = on.find((x) => x.row === row);
    if (c && c.as) continue;
    if (c) {
      const f = faultOf(row);
      steps.push({ do: "tops", key: c.key, row, add: { word: c.word, meaning: thing(c.word, f.want - f.got) } });
      count(1);
      c.as = row;
      continue;
    }
    steps.push({ do: "rises", row, says: faultOf(row).kind !== "right" });
    const at = on.findIndex((x) => shown.indexOf(x.row) > shown.indexOf(row));
    on.splice(at < 0 ? on.length : at, 0, { key: `asked-${row}`, row, as: row });
    count();
  }
  return { shown, most, steps };
}

export function dishCheck(items, tally) {
  const faults = faultsOf(items, tally);
  const byRow = Object.fromEntries(items.map((it) => [it.id, faults.some((f) => f.id === it.id && f.kind === "right") && !faults.some((f) => f.id === null && f.against === it.id)]));
  return { right: isRight(faults), faults, byRow, lost: tally.lost || [] };
}
