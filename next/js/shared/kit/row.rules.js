/*
 * The order card's row, with no page: which card stands where, which card is next, and where the row rests (Zafar,
 * 18 Nov, the old game's rule: docs/architecture.md "Fits every screen"). The order card's row (order-row.js) only
 * applies them; the robot plays them in every round.
 *
 *   rowOrder(items, ticked) -> ids          items: [{ id, no }] in the order asked; ticked: ids, in the order ticked
 *     the ticked cards first, in the order they were ticked (old js/shared/order-card.js:316-326), then the cards to
 *     do in the order asked, then the "no" cards
 *   places: [{ id, left, w }] in the row's order, `left` from the first card; width: what the row shows
 *   rowNext(places, ticked, atServe) -> the next card to do, or null: the next the child does after the last ticked card;
 *     a card that ticks only as its dish is served (atServe: ids) comes after the rest
 *   rowRest(places, width, ticked, atServe) -> the row's scroll, in the kitchen: the last ticked card at the left and the
 *     next card to do whole (old :500-535); once only serve-time cards are left, as far to the row's end as keeps the
 *     first of them whole (Zafar, 4 Nov: "the menu card scrolls fully to the end", never cutting the next card)
 *   rowLandRest(places, width, lands) -> the row's scroll while the order is said, `lands` the cards landing now (the one
 *     being said first): the place before them at the left, so they land whole with an empty place before them (old
 *     :402-409), and the card being said always whole
 */
export function rowOrder(items, ticked) {
  const asked = items.filter((it) => !it.no);
  return [
    ...ticked.filter((id) => asked.some((it) => it.id === id)),
    ...asked.filter((it) => !ticked.includes(it.id)).map((it) => it.id),
    ...items.filter((it) => it.no).map((it) => it.id),
  ];
}

/** The furthest the row scrolls, and a scroll kept between its start and that. */
const bounds = (places, width) => {
  const last = places[places.length - 1];
  const end = Math.max(0, last.left + last.w - width);
  return (x) => Math.max(0, Math.min(end, x));
};

export function rowNext(places, ticked, atServe) {
  const lead = places.reduce((at, p, i) => (ticked.includes(p.id) ? i : at), -1);
  const rest = places.slice(lead + 1).filter((p) => !ticked.includes(p.id));
  return rest.find((p) => !atServe.includes(p.id)) || rest[0] || null;
}

export function rowRest(places, width, ticked, atServe) {
  if (!places.length) return 0;
  const keep = bounds(places, width);
  const lead = places.filter((p) => ticked.includes(p.id)).pop();
  const next = rowNext(places, ticked, atServe);
  const from = lead ? lead.left : 0;
  if (!next) return keep(from);
  if (atServe.includes(next.id)) return keep(next.left);
  return keep(next.left + next.w > from + width ? next.left + next.w - width : from);
}

export function rowLandRest(places, width, lands) {
  const on = places.filter((p) => lands.includes(p.id));
  if (!on.length) return null;
  const keep = bounds(places, width);
  const said = on.find((p) => p.id === lands[0]) || on[0];
  const tail = on[on.length - 1];
  const to = Math.max(places[Math.max(0, places.indexOf(on[0]) - 1)].left, tail.left + tail.w - width);
  return keep(Math.max(said.left + said.w - width, Math.min(said.left, to)));
}
