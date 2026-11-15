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
  // the tawa's round body: vessel-tawa-t (418 x 347) fitted to 470 x 410 (tawa.js, scale 1.124), its body 297 px across, its middle at
  // (0.398, 0.552) of the picture (measured on its alpha; the handle leaves the picture's middle off the body's)
  const TAWA_IN = 334;
  const TAWA_BODY = { cx: 0.398, cy: 0.552 };
  // the chain's largest unit: the tawa as it was (its body TAWA_IN across at scale 1), never bigger; smaller where the play area is
  const MAX_UNIT = TAWA_IN;
  const HOB_K = 0.89; // the hob's scale beside a MAX_UNIT tawa, as maani's (it scales with the tawa)
  const TRAY_Y = 0.42; // the bottom row's things lie this share of its height down from its top
  // the turner, in its tawa's units: beside the hob (right of it, below its middle), keeping room before the view's edge, else over the
  // hob's right end; raised where needed so its hand and sleeve end above the stone tray (RT-04: the tawa mechanic's hand, its sleeve's
  // foot `sleeve` units below the turner's tip)
  const TURNER = { beside: 0.35, low: 0.25, keep: 0.45, over: 0.15, sleeve: 1.25, clear: 0.06, top: 0.3 };
  // RT-02 (Fable, 15 Nov: "chai's first-time light, not a bare finger"): the station's first-time script (data/stations/roll-tawa.json
  // `onboard`, the kit's coach lights each step's thing, dim and one gold box) and Nani's box one step at a time (RT-04), on maani's own
  // step keys (data/cook.json guide maani-line:*), read from what the mechanics expect next
  const PLATE_W = 300; // the tawa mechanic's plate, its design width (tawa.js: vessel:serving fitted to 300 x 200)
  const TALLY_GAP = 6;
  const COUNT_ID = "cook-maani"; // the roll's count (roll.js UI.count) // the count's pill this far above the board's top
  const STEP = { roll: "maani-line:roll", more: "maani-line:take", flip: "maani-line:flip" };

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
      const stop = watch(host);
      try {
        return await host.runAll();
      } finally {
        stop();
      }
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
    const row = F.row([{ share: shares.board }, { share: shares.tawa, w: hob1.w, h: hob1.h }], { max: MAX_UNIT / Math.max(shares.board, shares.tawa), room: F.pills });
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
    // the turner rests beside the hob's right edge, low, where the view has room for it; else over the hob's right end; raised so its
    // hand and sleeve end above the tray (RT-04)
    const u = hobBox.size;
    const hobR = hobBox.x + hobBox.w;
    const beside = hobR + TURNER.beside * u <= V.right - TURNER.keep * u;
    const turnerY = Math.max(V.top + TURNER.top * u, Math.min(hobBox.cy + TURNER.low * u, B.y - (TURNER.sleeve + TURNER.clear) * u));
    host.room = {
      board: { cx: boardBox.cx, cy: boardBox.cy },
      hob,
      spare: { x: boardBox.x, y: trayY },
      waiting: { x: boardBox.x + boardBox.w, y: trayY },
      plate: { x: hobBox.cx, y: trayY },
      spatula: { x: beside ? hobR + TURNER.beside * u : hobR - TURNER.over * u, y: turnerY },
    };
    // RT-04: the face of who it is for, beside the plate (the kit's round face, at least 30 CSS px: the frame's px), as chai's glasses
    const who = (host.ctx.order && host.ctx.order.who) || null;
    if (who) {
      await St.loadArt(S, Kit.faceArt(who));
      const d = Math.max(Kit.BADGE * zt.k, 30 / Math.max(0.05, F.px));
      const plateHalf = (PLATE_W / 2) * zt.k;
      S.track(S.add.image(hobBox.cx + plateHalf + d * 0.25 + d / 2, trayY, Kit.badge(S, who)).setDisplaySize(d, d).setDepth(Cook.D.item + 1));
    }
    // RT-01 (Fable, 15 Nov: the count's pill ran under the settings button): the tally over the board, the tool in use (SH-39), in the
    // room the row keeps above it for the pills (the frame's)
    host.tallyPt = [boardBox.cx, boardBox.y - TALLY_GAP];
  }

  /**
   * While the round plays: the tawa's body on its burner (RT-04), Nani's box one step at a time (RT-04) and a light up while the
   * child already rolls told so (SH-236, as maani's). -> stop()
   */
  function watch(host) {
    const S = host.S;
    const steps = St.steps(host.ctx);
    const zr = host.zones.roll;
    const burners = host.room.hob.burners;
    let tex = null;
    let moved = 0;
    let step = null;
    let n = 0;
    let rollLit = false;
    let tallyKey = "";
    const stopTick = S.addTick(() => {
      // RT-01: the count's pill on the board's point, placed once it holds a count (the kit's keep-inside reads an empty badge's box as
      // the page's corner and pushes it a stage-width right: js/shared/tally.js T.place) and again whenever that point moves on the page
      const UI = Cook.UI;
      if (UI && UI.tallyAt && host.tallyPt && UI.countOf && UI.countOf(COUNT_ID) > 0) {
        const at = Cook.Frame.toScreen(host.tallyPt[0], host.tallyPt[1]);
        const key = `${Math.round(at.x)},${Math.round(at.y)},${UI.countOf(COUNT_ID)}`;
        if (key !== tallyKey) {
          tallyKey = key;
          UI.tallyAt(host.tallyPt);
        }
      }
      // the tawa mechanic draws each tawa's picture centred on its spot (its burner); its round body sits off the picture's middle
      // (the handle), so the picture moves by that much: the body on the burner, the maani (drawn at the spot) on the body
      // (its key read each frame: the painted picture's once it has loaded, the drawn stand-in's before)
      tex = S.tex ? S.tex("tawa") : null;
      if (tex && !host.tawasOn) {
        S.children.list.forEach((o) => {
          if (o.__rtOn || !o.active || o.type !== "Image" || !o.texture || (o.texture.key !== tex && o.texture.key !== "tawa")) return;
          if (!burners.some((b) => Math.abs(o.x - b.x) < 1 && Math.abs(o.y - b.y) < 1)) return;
          o.__rtOn = true;
          o.x += (0.5 - TAWA_BODY.cx) * o.displayWidth;
          o.y += (0.5 - TAWA_BODY.cy) * o.displayHeight;
          if (++moved === burners.length) host.tawasOn = true;
        });
      }
      // Nani's box: the next step, from what the mechanics expect (the flip while a maani is in its green; else the roll; else the
      // next dough)
      const slots = [...((Cook.Hub && Cook.Hub.slots) || new Map()).entries()];
      const hot = slots.some(([z, e]) => e && e.kind === "timing" && z._gauge && z._gauge.level >= z._gauge.lo && z._gauge.level <= z._gauge.hi);
      const kind = hot ? "flip" : slots.some(([, e]) => e && e.kind === "roll") ? "roll" : slots.some(([, e]) => e && e.kind === "tap" && e.key === "more") ? "more" : null;
      if (kind !== step) {
        step = kind;
        if (kind) steps.to(STEP[kind], { id: `${kind}-${++n}`, again: kind === "flip" });
        else steps.done();
      }
      // SH-236 (maani's contract-112 fix): a first-time light that comes up while the child's roll is under way steps aside
      const OB = global.Onboard;
      const press = S.input && S.input.activePointer;
      const up = step === "roll" && !!(press && press.isDown && zr.owns) && !!(OB && OB.lightsShown && OB.lightsShown() > 0);
      if (up && !rollLit && Cook.Coach && Cook.Coach.began) Cook.Coach.began("roll");
      rollLit = up;
    });
    return () => {
      stopTick();
      steps.done();
      if (Cook.UI && Cook.UI.tallyAt) Cook.UI.tallyAt(null);
    };
  }

  // RT-02: the first-time script lives in this game's settings (`onboard`); the coach reads data.onboard by the station's key, so it is put
  // there once the settings have loaded (never over one the data already gives)
  const putScript = () => {
    const d = Cook.data;
    const mine = d && d.settings && d.settings["roll-tawa"] && d.settings["roll-tawa"].onboard;
    if (!mine) return false;
    d.onboard = d.onboard || {};
    if (!d.onboard["roll-tawa"]) d.onboard["roll-tawa"] = mine;
    return true;
  };
  if (!putScript() && Cook.onLoad) Cook.onLoad.push(async () => putScript());

  Mech.lab("roll-tawa", {
    name: "Roll → Tawa",
    verb: "Combined (proof)",
    async run(L) {
      putScript();
      const n = 2 + Math.floor(Math.random() * 3);
      // RT-03 (Fable, 15 Nov): the order is a maani dish of n wheat maani, so its card is the order's own (the engine says the sentence;
      // its row and the pop-out card are the item, "char maani"), as the maani line's lab has it; was the whole sentence as a plain line
      const d = { recipe: "maani", maani: { "cook-maani": n }, level: L.level };
      const R = Cook.Recipes && Cook.Recipes.maani;
      L.ctx.steps = R ? R.steps(d) : ["Roll", "Tawa"];
      L.card(d, L.ctx.steps);
      await L.station("roll-tawa", { count: n });
    },
  });
})(window);
