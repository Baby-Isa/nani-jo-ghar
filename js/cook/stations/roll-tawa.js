/*
 * Combined station (lab-only proof): Roll -> Tawa.
 *
 * Two stations side by side in the kitchen frame's play area, as maani has them: the chakla (the roll mechanic) on the left, the
 * tawa (the tawa mechanic) on its hob on the right. Each rolled maani is routed through the "rolled" channel and flies over to the
 * tawa, which cooks it while you roll the next. One set of marks: the roll zone says whether you made as many as they asked for
 * (accuracy); every roll and every flip scores a hand job (not scored).
 *
 * It proves the host; the real Maani line (dough bowls -> chakla -> tawa, big/small, two tawas) is js/cook/stations/maani-line.js.
 * Levels: data/stations/roll-tawa.json (which level each zone runs at; tawa level 2 = two tawas, on a two-burner hob).
 *
 * Sprint 20 batch 2 (the kitchen frame: docs/architecture/kitchen-frame.md): the room is laid out in the frame's play area by its
 * size chain (area.row), as maani does: the board and the hob are the two stations (equal shares unless the settings give their
 * own), the frame giving the unit, the gap and their places; the spare dough, the rolled one waiting and the plate lie on the stone
 * tray (the bottom row), in shares of it. Each mechanic still draws in its own design px: its zone maps them into its station's box
 * (the chakla's design width to the board's unit, the tawa's to the tawa's), and owns the pointer in its side of the room.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const Mech = Cook.Mech;
  const St = Cook.Stations;
  const Kit = Cook.Kit;

  const FAR = 2000; // the wash reaches past the design box (the stage fill: the frame's view), as maani's
  // the mechanics' own design sizes (their design px, at a zone's scale 1): what a station's unit is in each
  const CHAKLA_IN = 460; // the roll's chakla: tool-chakla-t (480 square) fitted to 560 x 460 (roll.js rollOne): 460 across
  const TAWA_IN = 363; // the tawa's round body: vessel-tawa-t (418 x 347) fitted to 470 x 410 (tawa.js), its body 0.386 of its width
  // the chain's largest unit: the tawa as it was (its body TAWA_IN across at scale 1), never bigger; smaller where the play area is
  const MAX_UNIT = TAWA_IN;
  const HOB_K = 0.89; // the hob's scale beside a MAX_UNIT tawa, as maani's (it scales with the tawa)
  const TRAY_Y = 0.42; // the bottom row's things lie this share of its height down from its top
  // the turner, in its tawa's units: beside the hob (right of it, below its middle), keeping room before the view's edge; or under the
  // hob's right end, on the tray
  const TURNER = { beside: 0.35, low: 0.25, keep: 0.45, under: 0.3 };

  // (the zones open on the frame's whole sheet; run() fits each to its station once the room is laid out)
  const sheetRegion = () => [Cook.Frame.sheet.x, Cook.Frame.sheet.y, Cook.Frame.sheet.w, Cook.Frame.sheet.h];
  const sheetBox = () => Object.assign({}, Cook.Frame.sheet);
  /** A sheet point in a zone's design px (its scale k, its origin at its station box's top left). */
  const inZone = (z, x, y) => [(x - z.ox) / z.k, (y - z.oy) / z.k];

  Mech.combined("roll-tawa", {
    station: "roll-tawa",
    view: "marble",
    dataFile: "data/stations/roll-tawa.json",
    zones: [
      {
        id: "roll",
        mech: "roll",
        get region() {
          return sheetRegion();
        },
        get footprint() {
          return sheetBox();
        },
        out: "rolled",
        params: (p, host) => {
          const z = host.zones.roll;
          const R = host.room;
          return { count: p.count, at: inZone(z, R.board.cx, R.board.cy - z.L(10)), spareAt: inZone(z, R.spare.x, R.spare.y), stackAt: inZone(z, R.waiting.x, R.waiting.y) };
        },
      },
      {
        id: "tawa",
        mech: "tawa",
        get region() {
          return sheetRegion();
        },
        get footprint() {
          return sheetBox();
        },
        in: "rolled",
        params: (p, host) => {
          const z = host.zones.tawa;
          const R = host.room;
          return {
            spots: R.hob.burners.map((b) => inZone(z, b.x, b.y)),
            size: 1,
            plateAt: inZone(z, R.plate.x, R.plate.y),
            spatulaAt: inZone(z, R.spatula.x, R.spatula.y),
          };
        },
      },
    ],
    run: async (host, params) => {
      await lay(host);
      return host.runAll();
    },
  });

  /** The room in the kitchen frame: the wash, the stone tray, the two stations by the size chain, the zones fitted to them. */
  async function lay(host) {
    const S = host.S;
    const K = host.knobs;
    const zr = host.zones.roll;
    const zt = host.zones.tawa;
    const n = Math.max(1, Math.min(2, Mech.knobs("tawa", { level: zt.level }).tawas || 1)); // one tawa, or two from tawa level 2
    await St.loadArt(S, Kit.art(n, []));
    // the frame's floor plan: the worktop's wash and the stone tray under the bottom row (the band named in this game's settings)
    const F = Cook.Frame.area(S, { top: St.SHELF.top, far: FAR, draw: true });
    F.stoneBand(S, { game: "roll-tawa" });
    // the two stations as shares of the play area (equal unless the settings give their own): the board one unit across, the hob
    // HOB_K / MAX_UNIT of its tawa's unit (one burner, or two)
    const shares = Object.assign({ board: 1, tawa: 1 }, K.shares || {});
    const hob1 = Kit.size(n, HOB_K / MAX_UNIT);
    const row = F.row([{ share: shares.board }, { share: shares.tawa, w: hob1.w, h: hob1.h }], { max: MAX_UNIT / Math.max(shares.board, shares.tawa) });
    const [boardBox, hobBox] = row.boxes;
    // the hob in its station's box, its flames lit (no face and no knob of its own to turn: the tawa mechanic has no heat to set)
    const hob = Kit.hob(S, { n, k: (HOB_K * hobBox.size) / MAX_UNIT, x: hobBox.x, y: hobBox.y });
    const flameR = (hobBox.size / 2) * 0.95;
    hob.burners.forEach((b, i) => Kit.burner(S, hob, i, { flameR, spread: 62 }).set("high", true));
    // each zone in its station's measure (the mechanic's design px times k), its origin at the station's top left; each owns the
    // pointer on its side of the room (split at the gap's middle), from the view's top to its foot
    const V = F.view();
    const split = boardBox.x + boardBox.w + row.gap / 2;
    Object.assign(zr, { k: boardBox.size / CHAKLA_IN, ox: boardBox.x, oy: boardBox.y });
    Object.assign(zt, { k: hobBox.size / TAWA_IN, ox: hobBox.x, oy: hobBox.y });
    zr.region = { x: V.left, y: V.top, w: split - V.left, h: V.bottom - V.top };
    zt.region = { x: split, y: V.top, w: V.right - split, h: V.bottom - V.top };
    // the bottom row's things, on the stone tray: the spare dough at the board's left edge, the rolled one waiting at its right edge
    // (a unit apart), the plate under the hob's middle
    const B = F.bottom;
    const trayY = B.y + TRAY_Y * B.h;
    // the turner rests beside the hob's right edge, low, where the view has room for it; else on the tray under the hob's right end
    const hobR = hobBox.x + hobBox.w;
    const beside = hobR + TURNER.beside * hobBox.size <= V.right - TURNER.keep * hobBox.size;
    host.room = {
      board: { cx: boardBox.cx, cy: boardBox.cy },
      hob,
      spare: { x: boardBox.x, y: trayY },
      waiting: { x: boardBox.x + boardBox.w, y: trayY },
      plate: { x: hobBox.cx, y: trayY },
      spatula: beside ? { x: hobR + TURNER.beside * hobBox.size, y: hobBox.cy + TURNER.low * hobBox.size } : { x: hobR - TURNER.under * hobBox.size, y: trayY },
    };
  }

  Mech.lab("roll-tawa", {
    name: "Roll → Tawa",
    verb: "Combined (proof)",
    async run(L) {
      const Lang = Cook.Lang;
      const n = 2 + Math.floor(Math.random() * 3);
      L.card([Lang.line(Lang.orderFrame(0), Lang.phrase(Lang.countParts(n, "cook-maani", { one: false })))], ["Roll", "Tawa"]);
      await L.station("roll-tawa", { count: n });
    },
  });
})(window);
