/*
 * The kitchen frame (Sprint 20, Zafar 13 Nov: the three layers; its notes, API and decisions: docs/architecture/kitchen-frame.md).
 * The floor plan every stove game lays out in: the play area (the worktop the game furnishes) and the bottom row (the shelf or the
 * stone tray), in the drawing sheet's units, and the worktop's wash and the bottom band drawn under them. A game asks the frame for
 * its two boxes and lays its own room out inside the play area, in shares of it; it never reads the screen or the sheet itself.
 * It never names a game.
 *
 *   Cook.Frame.area(S, opts) -> {play: {x, y, w, h}, bottom: {x, y, w, h}, pills, px, toScreen(x, y), stoneBand(S, {game}), wash}
 *     opts: {top, base, draw, far, depth} (kitchen-frame.md, "The frame's API")
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
  /** Screen px per sheet unit, as drawn now (1 before the camera is set up). */
  const pxPer = () => {
    try {
      const UI = Cook.UI;
      return UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1;
    } catch (e) {
      return 1;
    }
  };
  const Frame = {};
  Frame.area = function (S, o = {}) {
    const St = Cook.Stations;
    const v = Cook.view || {};
    const ey = v.ey || 0;
    const viewTop = v.top != null ? v.top : -ey;
    const top = o.top != null ? o.top : St.SHELF.top;
    const px = pxPer();
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
      // the screen's own scale, for the sums only the screen can answer (a size in CSS px, a tap area, a pop's place on screen)
      px,
      toScreen: (x, y) => Cook.UI.worldToScreen(x, y),
    };
    // the bottom band under the bottom row, at the frame's top, its shelf line and depth: the game pulls it by its own key, so its
    // settings name which band it is, the shelf or the stone tray (SH-248, Zafar 10 Nov: "in their actual code, so it pulls the shared
    // element"; build/core/band.test.mjs); a game passes nothing else
    out.stoneBand = (S2, b = {}) => St.stoneBand(S2, { top, base: o.base, far: o.far, depth: o.depth != null ? o.depth : Cook.D.bg + 1.2, game: b.game || null });
    // the worktop's wash, drawn here (each game drew it by hand)
    if (o.draw && S) out.wash = Cook.Kit.worktop(S, { top, far: o.far });
    return out;
  };
  Cook.Frame = Frame;
})();
