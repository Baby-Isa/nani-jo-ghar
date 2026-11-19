/*
 * What a wrong order's card shows, with no page: for each thing on the person's card, and each thing that went in
 * that nobody asked for, whether it is right, missed, too few, too many or extra (Zafar, 19 Nov: Fable's design for
 * his third play). The card never changes; what was made comes up to meet it.
 *
 *   faultsOf(items, tally) -> [{ id, word, kind, want, got }]
 *       items: the card's rows as the order gives them ({ id, word, no, said }); tally: the game's count of the dish,
 *       { rows: { [id]: { want, got } }, extra: [{ word, n }] }; kind: right | missed | few | many | extra; an extra
 *       with a "no" row for it lands on that row (id), any other extra has none (id null)
 *   cardOf(items, faults) -> { rows, landings }   what the card shows, for the view only to draw:
 *       rows: the card's rows to show, a row never said in the order (the water, the leaves) only when it is the fault
 *       (Zafar, 19 Nov), each { id, fault, dots, hollow, plain }: dots, how many dots its count shows inside it (0: none);
 *       hollow: missed, so an empty hollow; plain: its picture shown plainly (a word asked for and missed or short)
 *       landings: what comes up from the pan, in order, each { id | word, kind: "lands" (a thing on its card, its n-th
 *       dot), "ticks" (a "no" kept: ticked, nothing flies), "shakes" (an extra on its "no" card), "parks" (an extra with
 *       no card) }
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

export function cardOf(items, faults) {
  const faultOf = (id) => faults.find((f) => f.id === id);
  const rows = items
    .filter((it) => it.said || faultOf(it.id).kind !== "right")
    .map((it) => {
      const f = faultOf(it.id);
      const n = it.no ? 0 : Math.max(f.want, f.got);
      return { id: it.id, fault: f, dots: n > 1 || (n === 1 && (f.kind === "few" || f.kind === "many")) ? n : 0, hollow: f.kind === "missed", plain: f.kind === "missed" || f.kind === "few" };
    });
  const landings = [];
  for (const r of rows) {
    const f = r.fault;
    if (r.fault.id && items.find((it) => it.id === r.id).no) landings.push({ id: r.id, kind: f.kind === "right" ? "ticks" : "shakes" });
    else for (let n = 0; n < Math.min(f.got, Math.max(f.want, 1)); n++) landings.push({ id: r.id, kind: "lands", n, last: n === Math.min(f.got, Math.max(f.want, 1)) - 1 });
  }
  faults.filter((f) => f.id === null).forEach((f) => landings.push({ word: f.word, kind: "parks" }));
  return { rows, landings };
}

export function dishCheck(items, tally) {
  const faults = faultsOf(items, tally);
  const byRow = Object.fromEntries(items.map((it) => [it.id, faults.some((f) => f.id === it.id && f.kind === "right") && !faults.some((f) => f.id === null && f.against === it.id)]));
  return { right: isRight(faults), faults, byRow, lost: tally.lost || [] };
}
