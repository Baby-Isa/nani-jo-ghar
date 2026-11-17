/*
 * The kitchen's play area, as plain geometry: where the hob, each vessel, its knob and face, the serving spot and the
 * bottom row's slots sit, for one to three vessels and for the screen's size. All in design px; nothing here draws.
 *
 *   layoutOf({ n, view, k, hob, vessel, spot }) -> plan
 *       view: { s, top }  the worktop view's scale and its top edge in design px
 *       k: data/kitchen.json layout       hob: { w, h, burners: [{x, y}] } of the hob picture for n burners
 *       vessel: { reach }                 spot: { wells, wellD, aspect }  (the game's settings)
 *   rowOf({ groups, plan, view, k, widthOf, sizeOf }) -> [{ id, x, group }] with slotW and the pills' scale
 */
export function layoutOf({ n, view, k, hob, vessel, spot }) {
  const P = { x: k.play.x, y: view.top + k.play.top, w: k.play.w };
  P.h = k.play.bottom - P.y;
  const room = P.w - 2 * k.rowIn - k.gap;
  const k0 = room - k.spot >= hob.w * k.hobK ? k.hobK : Math.min(k.hobK, Math.max((room - k.spot) / hob.w, room / (hob.w + hob.h * k.spotOfHob)));
  const kk = Math.max(k0, Math.min(k0 * k.grow, room / (hob.w + hob.h * k.spotOfHob), (P.h - k.hobTop) / hob.h));
  const hobW = hob.w * kk;
  const hobH = hob.h * kk;
  let spotD = Math.min(k.spot * (kk / k0), hobH * k.spotOfHob);
  const pitch = n > 1 ? (hob.burners[1].x - hob.burners[0].x) * hobW : Infinity;
  const vesselR = Math.min(Math.min(k.vesselR, pitch * k.pitchShare) * (kk / k.hobK), (pitch - k.pitchGap) / (k.rim * (vessel.reach + 1)));
  const rimR = vesselR * k.rim;
  const overL = Math.max(0, rimR * vessel.reach + k.handleGap - hob.burners[0].x * hobW);
  spotD = Math.min(spotD, Math.max(k.spot * k.spotMin, P.w - overL - hobW - k.gap));
  const total = overL + hobW + k.gap + spotD;
  const hobX = Math.max(P.x + overL, P.x + (P.w - total) / 2 + overL);
  const pillRoom = k.pillRoom / view.s;
  const hobY = Math.min(P.y + P.h - hobH, Math.max(P.y + k.hobTop, P.y + (P.h - (hobH + pillRoom)) / 2 + pillRoom));
  const spotX = hobX + hobW + k.gap;
  const spotY = hobY + (hobH - spotD) / 2 - k.spotUp;
  const frontY = hobY + k.frontStrip[n - 1] * hobH;
  const off = Math.min(k.off, pitch * k.offOfPitch);
  const flame = Math.min(rimR * k.flameOfRim, pitch * k.flameOfPitch);
  const gR = (spot.wellD * spotD) / 2;
  return {
    n,
    hob: { x: hobX, y: hobY, w: hobW, h: hobH, k: kk },
    vesselR,
    rimR,
    pitch,
    flame,
    spanL: hobX - overL,
    spanR: spotX + spotD,
    vessels: hob.burners.slice(0, n).map((b) => {
      const x = hobX + b.x * hobW;
      return { x, y: hobY + b.y * hobH, face: { x: x - off, y: frontY }, knob: { x: x + off, y: frontY } };
    }),
    spot: { x: spotX, y: spotY, w: spotD, h: spotD * spot.aspect, gR, wells: spot.wells.slice(0, n).map(([fx, fy]) => ({ x: spotX + fx * spotD, y: spotY + fy * spotD * spot.aspect })) },
  };
}

/**
 * The bottom row: the groups in one line, centred under the hob and the serving spot, each thing in its slot with its
 * word pill under it. The gaps between groups close first, then the slots narrow, so the pills never touch.
 */
export function rowOf({ groups, plan, view, k, pillW }) {
  const ids = groups.flat();
  const n = ids.length;
  const G = groups.length - 1;
  const mid = (plan.spanL + plan.spanR) / 2;
  const VL = view.left + k.margin;
  const VR = view.right - k.margin;
  const pillWant = Math.max(1, Math.min(k.pill.most, k.pill.wantPx / (k.pill.font * view.s)));
  const pillGap = Math.max(k.pill.gapMin, k.pill.gapPx / view.s);
  const widths = ids.map(pillW);
  let pair = k.pill.min;
  for (let i = 0; i + 1 < n; i++) pair = Math.max(pair, (widths[i] + widths[i + 1]) / 2);
  const pillRoom = pair * pillWant + pillGap;
  const want = Math.max(k.slot, pillRoom);
  const roomW = 2 * Math.min(mid - VL, VR - mid, (plan.spanR - plan.spanL) / 2);
  let gap = k.groupGap;
  if ((roomW - G * gap) / n < want) gap = Math.max(0, Math.min(k.groupGap, (roomW - n * want) / G));
  let slotW = Math.min(want, (roomW - G * gap) / n);
  if (slotW < pillRoom) {
    const roomMid = 2 * Math.min(mid - VL, VR - mid);
    if ((roomMid - G * gap) / n < pillRoom) gap = Math.max(0, Math.min(gap, (roomMid - n * pillRoom) / G));
    slotW = Math.min(pillRoom, (roomMid - G * gap) / n);
  }
  const width = n * slotW + G * gap;
  const slots = [];
  let x = mid - width / 2 + slotW / 2;
  groups.forEach((g, gi) => {
    g.forEach((id) => {
      slots.push({ id, x, group: gi });
      x += slotW;
    });
    x += gap;
  });
  // one scale for every pill of the row: as big as wanted, never touching a neighbour
  let scale = pillWant;
  for (let i = 0; i + 1 < n; i++) scale = Math.min(scale, (slots[i + 1].x - slots[i].x - pillGap) / ((widths[i] + widths[i + 1]) / 2));
  scale = Math.max(1, scale);
  return { slots, slotW, gap, pillScale: scale, pillY: Math.min(k.band.pillY, k.pillFloor - (k.pill.h / 2) * scale), pillGap };
}
