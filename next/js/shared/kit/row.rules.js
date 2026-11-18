/*
 * The order card's row, with no page: which card stands where, and where the row rests (Zafar, 18 Nov, the old game's
 * rule: docs/architecture.md "Fits every screen"). The order card's row (order-row.js) only applies them.
 *
 *   rowOrder(items, ticked) -> ids          items: [{ id, no }] in the order asked; ticked: ids, in the order ticked
 *     the ticked cards first, in the order they were ticked (old js/shared/order-card.js:316-326), then the cards to
 *     do in the order asked, then the "no" cards
 *   rowRest(places, width, state) -> the row's scroll, from its first card
 *     places: [{ id, left, w }] in the row's order, `left` from the first card; width: what the row shows
 *     state: { landing } while the order is said (ids, the card being said first): the place before them at the row's
 *            left, so they land whole with an empty place before them (old :402-409); the card being said always whole
 *            { done, atServe } in the kitchen (ids): the last ticked card at the left and the next card to do whole
 *            (old :500-535); the next to do is the next the child does, a card that ticks only as its dish is served
 *            coming after the rest; once only those are left the row goes as far to its end as keeps the first of
 *            them whole (Zafar, 4 Nov: "the menu card scrolls fully to the end", never cutting the next card)
 */
export function rowOrder(items, ticked) {
  const asked = items.filter((it) => !it.no);
  return [
    ...ticked.filter((id) => asked.some((it) => it.id === id)),
    ...asked.filter((it) => !ticked.includes(it.id)).map((it) => it.id),
    ...items.filter((it) => it.no).map((it) => it.id),
  ];
}

export function rowRest(places, width, state) {
  if (!places.length) return 0;
  const last = places[places.length - 1];
  const end = Math.max(0, last.left + last.w - width);
  const keep = (x) => Math.max(0, Math.min(end, x));
  if (state.landing) {
    // the place before the first of them at the left; further, if more land at once, until the last is whole too; and
    // whatever else, the card being said (the first named) whole
    const lands = places.filter((p) => state.landing.includes(p.id));
    const said = places.find((p) => p.id === state.landing[0]);
    const tail = lands[lands.length - 1];
    const to = Math.max(places[Math.max(0, places.indexOf(lands[0]) - 1)].left, tail.left + tail.w - width);
    return keep(Math.max(said.left + said.w - width, Math.min(said.left, to)));
  }
  const done = new Set(state.done);
  const serve = new Set(state.atServe);
  const lead = places.reduce((at, p, i) => (done.has(p.id) ? i : at), -1);
  const rest = places.slice(lead + 1).filter((p) => !done.has(p.id));
  const next = rest.find((p) => !serve.has(p.id)) || rest[0];
  if (!next) return keep(lead >= 0 ? places[lead].left : 0);
  const whole = (to) => (next.left + next.w > to + width ? next.left + next.w - width : to);
  if (!serve.has(next.id)) return keep(whole(lead >= 0 ? places[lead].left : 0));
  return keep(Math.min(end, next.left));
}
