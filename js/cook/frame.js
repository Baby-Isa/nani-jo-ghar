/*
 * The kitchen frame (Sprint 20, Zafar 13 Nov: the three layers; its notes, API and decisions: docs/architecture/kitchen-frame.md).
 * The floor plan every stove game lays out in: the play area (the worktop the game furnishes) and the bottom row (the shelf or the
 * stone tray), in the drawing sheet's units, and the worktop's wash and the bottom band drawn under them. A game asks the frame for
 * its two boxes and lays its own room out inside the play area, in shares of it; it never reads the screen or the sheet itself:
 * what only the screen can answer (a size in CSS px, a tap area, a word pop kept on screen) it asks the frame too.
 * It never names a game.
 *
 *   Cook.Frame.area(S, opts) -> {play: {x, y, w, h}, bottom: {x, y, w, h}, pills, px, view(), toScreen(x, y), toSheet(sx, sy),
 *                                stoneBand(S, {game}), wash, next(o2)}
 *     opts: {top, base, draw, far, depth}
 *     next(o2): a game's next screen in the same round (corn's flavour after its grill): the area again, o2.top its bottom row's
 *               top, o2.band {ms} the band drawn anew there
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
    out.stoneBand = (S2, b = {}) => {
      out.game = b.game || null;
      out.band = St.stoneBand(S2, { top, base: o.base, far: o.far, depth: o.depth != null ? o.depth : Cook.D.bg + 1.2, game: b.game || null });
      return out.band;
    };
    // the worktop's wash, drawn here (each game drew it by hand)
    if (o.draw && S) out.wash = Cook.Kit.worktop(S, { top, far: o.far });
    /*
     * The next screen of the same round (Sprint 20 batch 1, from corn: the grill, then the flavour; any game with a second screen in
     * one round): the floor plan again for that screen, read as it lays out, with o2 over this area's options. o2.top moves the bottom
     * row's top for that screen (a taller row: corn's six bowls in two rows on a phone), so its play area is what is left above it.
     * The worktop's wash is never drawn again. o2.band ({ms}): the bottom band drawn anew at the new top, in the band this area drew
     * (its game's: the stone tray's slab alone, its wash already under it; or the stone band and its shelf), faded in over ms
     * (default 380), the old band going once the new one is in. Returns the new area, with its own next.
     */
    out.next = (o2 = {}) => {
      const n = Frame.area(S, Object.assign({}, o, o2, { draw: false }));
      n.game = out.game;
      n.band = out.band;
      const nt = n.bottom.y;
      if (o2.band && S && nt !== top) {
        const ms = o2.band.ms || 380;
        const old = out.band;
        const depth = o.depth != null ? o.depth : Cook.D.bg + 1.2;
        const SH = globalThis.Shelf;
        const tray = !!(n.game && St.bandOf && St.bandOf(n.game) === "tray" && SH && SH.P && SH.P.tray && SH.trayInk && SH.trayInk());
        n.band = tray ? SH.P.tray(S, { top: nt, view: Frame.view, depth }) : St.stoneBand(S, { top: nt, base: o2.base != null ? o2.base : o.base, far: o.far, depth, game: n.game });
        if (n.band && n.band.setAlpha) {
          n.band.setAlpha(0);
          S.tweens.add({ targets: n.band, alpha: 1, duration: ms, onComplete: () => old && old.active && old.destroy() });
        }
      }
      return n;
    };
    return out;
  };
  Cook.Frame = Frame;
})();
