/*
 * The kitchen frame (Sprint 20, Zafar 13 Nov: the three layers; its notes, API and decisions: docs/architecture/kitchen-frame.md).
 * The floor plan every stove game lays out in: the play area (the worktop the game furnishes) and the bottom row (the shelf or the
 * stone tray), in the drawing sheet's units, and the worktop's wash and the bottom band drawn under them. A game asks the frame for
 * its two boxes and lays its own room out inside the play area, in shares of it; it never reads the screen or the sheet itself:
 * what only the screen can answer (a size in CSS px, a tap area, a word pop kept on screen) it asks the frame too.
 * It never names a game.
 *
 *   Cook.Frame.area(S, opts) -> {play: {x, y, w, h}, bottom: {x, y, w, h}, pills, px, view(), toScreen(x, y), toSheet(sx, sy),
 *                                stoneBand(S, {game}), wash, row(stations, {max, min, room})}
 *     opts: {top, base, draw, far, depth}
 *   Cook.Frame.row(play, stations, {max, min, room})   the size chain: stations as shares of the play area (an area's row())
 *   Cook.Frame.sheet                  the drawing sheet {x, y, w, h}: a game's zone that is the whole sheet (1:1)
 *   Cook.Frame.px(), .view(), .toScreen(x, y), .toSheet(sx, sy)   the screen's answers, live (the same as an area's)
 */
import { Cook as CookNS } from "./ns.js";

(function () {
  const Cook = CookNS;
  // the frame's own lines (Sprint 20 step 1: chai's play-area lines, moved as they were; sheet units unless named)
  const SHEET_W = 1600; // the drawing sheet (the design box every station draws on)
  const SHEET_H = 900;
  const SIDE = 48; // the play area's side margins, in from the sheet's edges
  const TOP_IN = 16; // the play area's top, in from the view's top
  const BAND_GAP = 28; // the gap kept clear above the bottom row
  const PILL_CSS = 50; // the count pills' room over a game's main thing: a pill, 40 CSS px, and its gap (js/shared/tally.js)
  const ROW_SIDE = 40; // the bottom row's margins, in from the view's sides
  const Frame = {};
  Frame.sheet = Object.freeze({ x: 0, y: 0, w: SHEET_W, h: SHEET_H });
  /** Screen px per sheet unit, as drawn now (1 before the camera is set up). */
  Frame.px = () => {
    try {
      const UI = Cook.UI;
      return UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1;
    } catch (e) {
      return 1;
    }
  };
  /** The part of the sheet the screen shows now, {left, top, right, bottom} in sheet units (the sheet itself before it is fitted). */
  Frame.view = () => {
    const v = Cook.view || {};
    return { left: v.left != null ? v.left : 0, top: v.top != null ? v.top : 0, right: v.right != null ? v.right : SHEET_W, bottom: v.bottom != null ? v.bottom : SHEET_H };
  };
  /** A sheet point on the page (CSS px). */
  Frame.toScreen = (x, y) => Cook.UI.worldToScreen(x, y);
  /** A page point (CSS px) on the sheet. */
  Frame.toSheet = (sx, sy) => {
    const o = Cook.UI.worldToScreen(0, 0);
    const s1 = Cook.UI.worldToScreen(1, 0).x - o.x || 1;
    return { x: (sx - o.x) / s1, y: (sy - o.y) / s1 };
  };
  Frame.area = function (S, o = {}) {
    const St = Cook.Stations;
    const v = Cook.view || {};
    const ey = v.ey || 0;
    const viewTop = v.top != null ? v.top : -ey;
    const top = o.top != null ? o.top : St.SHELF.top;
    const px = Frame.px();
    const spanTop = viewTop + TOP_IN;
    const spanBot = top - BAND_GAP;
    const left = (v.left != null ? v.left : 0) + ROW_SIDE;
    const right = (v.right != null ? v.right : SHEET_W) - ROW_SIDE;
    const out = {
      // the worktop the game furnishes: between the side margins, from the view's top to the gap above the bottom row
      play: { x: SIDE, y: spanTop, w: SHEET_W - 2 * SIDE, h: spanBot - spanTop },
      // the bottom row: its band's top to the view's foot, between the row's margins (the shelf's slots or the tray's things)
      bottom: { x: left, y: top, w: right - left, h: (v.bottom != null ? v.bottom : SHEET_H) - top },
      // the count pills' room over the game's main thing, in sheet units (a shared spot: its size is the screen's, 50 CSS px)
      pills: PILL_CSS / px,
      // the screen's own answers, live, for the sums only the screen can answer (a size in CSS px, a tap area, a pop kept on screen)
      get px() {
        return Frame.px();
      },
      view: Frame.view,
      toScreen: Frame.toScreen,
      toSheet: Frame.toSheet,
    };
    // the bottom band under the bottom row, at the frame's top, its shelf line and depth: the game pulls it by its own key, so its
    // settings name which band it is, the shelf or the stone tray (SH-248, Zafar 10 Nov: "in their actual code, so it pulls the shared
    // element"; build/core/band.test.mjs); a game passes nothing else
    out.stoneBand = (S2, b = {}) => St.stoneBand(S2, { top, base: o.base, far: o.far, depth: o.depth != null ? o.depth : Cook.D.bg + 1.2, game: b.game || null });
    // the worktop's wash, drawn here (each game drew it by hand)
    if (o.draw && S) out.wash = Cook.Kit.worktop(S, { top, far: o.far });
    // the size chain's middle link (Sprint 20 batch 1, maani): the game's stations side by side in its play area (Frame.row)
    out.row = (stations, r = {}) => Frame.row(out.play, stations, r);
    return out;
  };
  /*
   * The size chain (Sprint 20 batch 1, maani: kitchen-frame.md "The size chain"): play area -> stations -> contents. A game names its
   * stations left to right, each by its share of the row's unit (equal to start: share 1 each) and its footprint per unit (w, h: how
   * wide and tall the station stands for one unit of its share, e.g. a board 1 x 1, a hob 1.15 x 1.63 of its tawa); the frame gives
   * the largest unit that fits the play area (min..max: a game keeps its own size as max, a small phone's floor as min), its gap
   * between stations (a share of the play area's width), and each station's box. The row is centred across the play area and down
   * it (CHAI-89, Zafar 5 Nov: centred in the worktop that shows, the room kept above it for what appears there, never nearer the play
   * area's top than TOP_KEEP unless that would push it into the bottom row's gap). Stations stand on the row's middle line.
   *   Frame.row(play, [{share, w, h}], {max, min, room}) -> {unit, gap, x, y, w, h, boxes: [{x, y, w, h, size, cx, cy}]}
   *     size: the station's own unit (share x unit), cx/cy its box's middle
   */
  const ROW_GAP = 0.1; // the gap between stations: a tenth of the play area's width
  const TOP_KEEP = 24; // the row's top kept this far below the play area's top where there is room (chai's measure: 40 below the view's top)
  Frame.ROW_GAP = ROW_GAP;
  Frame.row = function (P, stations, r = {}) {
    const list = (stations || []).map((s) => ({ share: s.share != null ? s.share : 1, w: s.w != null ? s.w : 1, h: s.h != null ? s.h : 1 }));
    const gap = list.length > 1 ? ROW_GAP * P.w : 0;
    const room = r.room || 0;
    const across = list.reduce((a, s) => a + s.share * s.w, 0) || 1;
    const down = Math.max(...list.map((s) => s.share * s.h), 0) || 1;
    // the largest unit the play area takes, across (less the gaps) and down (less the room kept above), at most max, at least min
    let unit = Math.min((P.w - gap * (list.length - 1)) / across, (P.h - room) / down);
    if (r.max != null) unit = Math.min(unit, r.max);
    if (r.min != null) unit = Math.max(unit, r.min);
    const w = across * unit + gap * (list.length - 1);
    const h = down * unit;
    const x = P.x + (P.w - w) / 2;
    // (down: centred with its room above it, kept TOP_KEEP below the top where it can be, never into the bottom row's gap)
    const y = Math.round(Math.min(Math.max(P.y + (P.h - (h + room)) / 2 + room, P.y + TOP_KEEP + room), P.y + P.h - h));
    const mid = y + h / 2;
    let at = x;
    const boxes = list.map((s) => {
      const bw = s.share * s.w * unit;
      const bh = s.share * s.h * unit;
      const b = { x: at, y: mid - bh / 2, w: bw, h: bh, size: s.share * unit, cx: at + bw / 2, cy: mid };
      at += bw + gap;
      return b;
    });
    return { unit, gap, x, y, w, h, boxes };
  };
  Cook.Frame = Frame;
})();
