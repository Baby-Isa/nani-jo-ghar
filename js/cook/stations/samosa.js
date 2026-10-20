/*
 * Combined station: Samosa v3, fill, fold, fry (docs/design-language/ui-design-system.md §15; the chai v2 grid
 * §3, §4, §10; the kitchen kit §13; serve and taste §14a; the 29 Sept play-test, S1-S21 and Q2, Q3, Q9).
 *
 * THREE JOBS, one at a time, each on the whole picture:
 *  1. FILL (SAM-25, decision 10, 18 Oct): six flat pastry strips lie on the big house board at every level (S6). The
 *     fillings sit on the shelf band (the bottom 26%) as top-down heaps, no bowls (S2 / Q2), a `🔊 word` chip under
 *     each (tap the heap = use it, tap the chip = hear it; from level 3 the word hides and the speaker stays). Tap
 *     any strip, then the heaps: each tap drops ONE spoonful on that strip's bottom-left corner and its word pops
 *     with the family clip; tap another strip and fill that one; a tap on a mound takes a spoon back. Nothing is
 *     refused: ONE tick when they think they're done; every strip is graded then (how many of each kind, how many
 *     spoons of each, nothing they said no to), and only then does the card tick (SAM-24).
 *  2. FOLD: keep the SWIPE (KEEP-04). SAM-21: the coded fold (Cook.Pastry, js/cook/mechanics/fill-fold.js) in the
 *     pastry texture: each filled strip comes to the middle; the bottom-left corner folds over the filling into a
 *     triangle (bottom left to top right), then the triangle rolls over left to right (top left to bottom right,
 *     and so on), an arrow on each swipe and only the moving flap lit; the end tucks under by itself. The
 *     finished samosa's word pops and it goes onto the plate's flat middle (S10); after the last one, straight on
 *     to the karahi (SAM-22: no button with nothing to decide).
 *  3. FRY: the kit's WIDE hob (one big landscape burner, S19 / Q9) with the v3 karahi of oil on it, about
 *     1.4x its old size (S17). Tap the knob: the flames come up and stay up while it's on (S21) and the
 *     oil sizzles at once: no heating ring (S16). Tap a raw samosa: it slides into the oil. Each one goes
 *     raw -> light -> golden -> too dark (a small timing ring round it); tap it when golden and the jharo
 *     slides in UNDER it and it rides on top onto the paper-lined plate (S20). No tally: the plate shows
 *     the count.
 * THE REVIEW (§14a as changed 29 Sept, X10 / Q1: Cook.Kit.review): their big round face comes up over
 *   the plate (no body, no pretend eating).
 *  - right: a happy face and the family's praise;
 *  - not quite: a frown, they say their order again, the plate comes back empty and the child makes
 *    them again (fill first). Only the first try counts (the accuracy badge, the end review). At most three tries.
 * The card (the shared order card, §12): nothing ticks while the strips are filled; every row ticks at the one tick,
 * once every samosa of its kind is made (SAM-24; UX 11); then the card folds to face + headline, no ✓ (the phase fold, §13: "ba
 * samosa" lives only in the headline) until the plate is tasted, when it opens (and its ✓ shows).
 *
 * Levels (the level table, data/cook.json levelTable, and the samosa recipe's slots): one filling, a second, two kinds,
 * then the "no" filling; the six strips, the one tick and the fold are the same at every level (the fry's speed and
 * band tighten by level in data.mechanics.fry).
 * Art: assets/cook/items/v3/samosa/ (build/cut_cook_v3.py; the numbers below are its meta.json, checked
 * by build/check_vessel_meta.py), the pastry tile (assets/cook/tiles-s08b/), the fry states from assets/cook/items/samosa-v2/, the kit's wide hob,
 * knob and flames (js/cook/kitchen-kit.js). Shots: build/shoot_samosa_v3.py.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const V2 = "assets/cook/items/samosa-v2/";
  const V3 = "assets/cook/items/v3/samosa/";
  // what build/cut_cook_v3.py measured (assets/cook/items/v3/samosa/meta.json; fractions of each sprite)
  const META = {
    // (SAM-21, 19 Oct: the six fixed fold pictures gave way to the coded fold, Cook.Pastry in js/cook/mechanics/fill-fold.js)
    // the karahi of oil (S14, S17, S19): its round body, handles left out; oil = the oil's radius / the body's
    karahi: { w: 1253, cx: 0.4975, cy: 0.4992, r: 0.3914, oil: 0.8994 },
    // the paper-lined enamel plate (S10): its rim; flat = the flat paper-lined centre's half-width / the rim r
    plate: { w: 825, cx: 0.4982, cy: 0.4994, r: 0.4826, flat: 0.6 },
    // the slotted spoon (S20): its bowl's middle and radius (x, r fractions of the width, y of the height)
    jharo: { w: 657, h: 837, bx: 0.279, by: 0.227, br: 0.25 },
    heap: { w: 419, h: 410 },
    fry: { w: 400, h: 340 },
  };
  // S2 / Q2: the fillings as top-down heaps, no bowls (samosa only)
  const HEAP = { "ph-keema": "chundo", "veg-01": "potato", "veg-10": "peas", "veg-02": "onion", "veg-12": "chilli", "ph-dhana": "dhania", "veg-carrot": "carrot", "veg-cabbage": "cabbage" };
  // 30 Sept (v3.1): S5's green chilli heap read as peas; R5's sliced chilli rings (cut for daar) take its place
  // ART-11 (s08 w6G): the potato is the landed PT1 pile (matte, starchy cubes), not the butter-yellow v3 heap
  const HEAP_ART = { "veg-12": "assets/cook/items/v3/daar/chop-heap-chilli.webp", "veg-01": "assets/cook/items-s08b/potato/potato-pile-v3.webp" };
  const heapUrl = (id) => HEAP_ART[id] || (HEAP[id] ? `${V3}fill-${HEAP[id]}.webp` : null);
  /* ---------- the grid (design px, 1600x900), chai v2's ---------- */
  const SHELF_TOP = 666;
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  const HEAP_Y = 758;
  const CHIP_Y = 860;
  const PITCH = 150;
  const HEAP_W = 128;
  // the house board (S6): board.webp is 1397 x 847
  // SAM-25 (P43: "increase the size of the chopping board"): the board takes the worktop left of the plate, for six strips
  const BOARD = { x: 640, y: 340, w: 1040, h: 1040 * (847 / 1397) };
  const PLATE = { x: 1390, y: 400, d: 320 };
  // the fry (S17, S19, Q9): the wide hob (one big burner) with the karahi ~1.4x its old size (body r 180 ->
  // 250: at 270 its rim ran over the hob's knob), and the plate right of the hob. The hob (937 x 568 at
  // k 1, its burner in the middle; its knob 0.469 h below the burner, clear of the rim) centred on bx, the
  // plate just clear of its right edge: 66 ... 1134, 1140 ... 1480.
  const FRY = { hobK: 1.14, bx: 600, r: 250, px: 1310, pd: 340, trayY: 772, trayD: 150, trayPitch: 180 };
  // a samosa in the oil (design px wide) and where they float (degrees round the middle, radius / the oil's):
  // fewer samosas, bigger and further apart
  // SAM-14 (A8, decision 56): every samosa stays inside the oil's flat surface: its spot (r, a fraction of the oil's
  // radius) plus half its size stays within 0.8 of the oil (was up to 0.94: they reached the karahi's sides)
  const OIL = (n) => (n <= 3 ? { size: 170, r: 0.42, at: [-90, 30, 150] } : n <= 4 ? { size: 150, r: 0.47, at: [-135, -45, 45, 135] } : { size: 128, r: 0.52, at: [-90, 30, 150, -30, 90, 210] });
  const INK = { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf, glow: 0xffe3a0 };
  const FONT = "Nunito, sans-serif";

  /** A frame's length in ms, for a tick (the scene's ticks get no dt). */
  const clock = () => {
    let t0 = performance.now();
    return () => {
      const t = performance.now();
      const dt = Math.min(100, t - t0);
      t0 = t;
      return dt;
    };
  };
  /** {id: n} from a tally, a list (one spoon each) or any-order groups. */
  const asTally = (f) => {
    const out = {};
    if (!f) return out;
    if (!Array.isArray(f)) {
      Object.keys(f).forEach((id) => Number(f[id]) > 0 && (out[id] = Number(f[id])));
      return out;
    }
    f.flat().forEach((id) => (out[id] = (out[id] || 0) + 1));
    return out;
  };
  const ladderOf = (ctx) => {
    const Ls = UI.mission.ladders() || [];
    return Ls[ctx.dishAt || 0] || Ls[0] || null;
  };
  const orderLine = (L) => {
    if (!L) return null;
    // 29 Sept (X1): one sentence, in card order (Cook.Order.speech)
    return Cook.Order.speech([L]);
  };

  /** The station's own pictures every round draws (the board, plate, karahi, jharo, thali, the pastry tile, the fry states). */
  const BASE_ART = () =>
    [
      ["sv3-board", V3 + "board.webp"],
      ["sv3-plate", V3 + "plate.webp"],
      ["sv3-karahi", V3 + "karahi.webp"],
      ["sv3-jharo", V3 + "jharo.webp"],
      ["sv2-thali", "assets/cook/items/vessel-thali-t.png"],
    ]
      // SAM-21: the pastry texture the coded fold is drawn in (the s08 art run's tile, seamless across)
      .concat([["sv3-pastry", "assets/cook/tiles-s08b/pastry-tile-s08b-tile.webp"]])
      .concat([0, 1, 2, 3].map((i) => [`sv2-fry-${i}`, `${V2}fry-${i}.webp`]));
  /*
   * s08 w6B (CK-48, P28: "the time it takes for you to listen to the instruction ... should be enough time to load"): this
   * file loads when samosa is chosen (CK-25: with the order, or the lab tile), before its view opens, so its own pictures
   * start loading into the game now, behind the order's card; the round's St.loadArt then finds them there. Only this
   * station's art (decision 68), each picture at its one drawn size.
   */
  function warm() {
    try {
      const S = Cook.scene;
      if (S && S.load && St.loadArt) St.loadArt(S, BASE_ART().concat(Cook.Kit ? Cook.Kit.art(1, [], { wide: true }) : [])).catch(() => {});
    } catch (e) {
      /* the round loads it as before */
    }
  }
  warm();

  Mech.combined("samosa", {
    station: "samosa",
    view: "marble",
    dataFile: "data/stations/samosa.json",
    zones: [{ id: "samosa", mech: "fill", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } }],
    run: (host, params) => station(host, params),
  });

  async function station(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    Object.values(host.zones).forEach((z) => z.close());
    const level = Math.max(host.level || 1, Cook.roundLevel(ctx));
    const phases = (Cook.data.stations.samosa || {}).phases || {};
    const who = p.who || (ctx.order && ctx.order.who) || "nana";
    const want = asTally(p.fillings);
    const kinds = Object.keys(want);
    const exclude = [].concat(p.exclude || []).filter(Boolean);
    const count = p.count || 1;
    // 30 Sept: a second kind of samosa (its own block on the card), from level 3
    const want2 = asTally(p.fillings2);
    const kinds2 = Object.keys(want2);
    const count2 = kinds2.length ? Number(p.count2) || 0 : 0;
    const kFill = Mech.knobs("fill", { level });
    // CK-49 (the level table): 1, 2, 3, 3 decoy fillings, a lookalike among them at L4; the 'no' filling (L4) is one of them
    const pool = p.pool || St.tableDecoys(p.decoyPool || [], kinds.concat(kinds2, exclude), level, { want: kinds.concat(kinds2), ok: (id) => !!heapUrl(id), n: Math.max(0, St.knobInt(kFill.decoys != null ? kFill.decoys : 1) - exclude.length), also: exclude.length, what: "fillings" });
    const ids = Cook.shuffle([...new Set(pool.concat(kinds, count2 ? kinds2 : [], exclude))]);
    if (Cook.Coach) Cook.Coach.stop(false); // not "seen": the fill's own begin shows it (data.onboard.samosa)
    // the art loads while the order card is up (a slow phone mustn't meet an empty scene; warm() has started it already)
    const art = BASE_ART()
      .concat(ids.filter(heapUrl).map((id) => [`sv3-heap-${id}`, heapUrl(id)]))
      .concat(Cook.Kit ? Cook.Kit.faceArt(who) : [])
      // the wide hob (S19): one big burner, landscape; the karahi is this station's own (v3, 1.5x)
      .concat(Cook.Kit ? Cook.Kit.art(1, [], { wide: true }) : []);
    await St.loadArt(S, art);

    /*
     * Decision 51 (CK-23, S02-B): a mistake redoes only that samosa, never the whole game. A wrong filling empties
     * that strip and it's filled again (with help); too few samosas: fold the missing one; a samosa lifted too
     * soon goes back into the oil, a burnt one is swapped for a fresh one to fry. The third wrong try shows the
     * right way. Only the first try is scored.
     */
    const redo = St.redo(ctx);
    const steps = St.steps(ctx);
    /* ---------- 1 + 2: fill and fold ---------- */
    // the fill and the fold: the first time, the coach shows each move (X11: data.onboard.samosa)
    // s08 w6B (CK-48; the probe: the combined host's St.begin (js/cook/zone.js M.host) had already set this same view and
    // key, then this station loaded its art on the bare worktop and began it AGAIN: a second fade out and in before the board
    // came, 350-1000 ms of empty marble): the host's begin is this station's begin; its art is warmed when this file loads
    // (warm() below), so the board is drawn the moment the host hands over. Only the first-time coach, which this station
    // stops above until its scene exists, starts here (as the second begin did).
    if (!Cook.inStation || S.viewName !== "marble") await St.begin(S, ctx, "samosa", "marble");
    else if (St.coach) St.coach(ctx, "samosa");
    if (phases.fill) UI.gist(phases.fill);
    if (ctx.nextStep) ctx.nextStep("Fill");
    const fz = Mech.zone(S, ctx, { id: "fill", level });
    const made = await fillFold(fz, { ids, want, kinds, exclude, count, want2, kinds2, count2, level, phases, retry: false, redo, steps });
    fz.close();
    St.end();

    /* ---------- 3: fry, then serve and taste ---------- */
    // the fry: its first-time coach runs (X11: data.onboard.fry; it used to be switched off here)
    const fryBegun = St.begin(S, ctx, "fry", "marble");
    await viewUp(S, "marble", fryBegun);
    const fryReady = fryBegun.then(() => {
      if (phases.fry) UI.gist(phases.fry);
      if (ctx.nextStep) ctx.nextStep("Fry");
    });
    const yz = Mech.zone(S, ctx, { id: "fry", level });
    const fried = await fry(yz, { n: made.n, level, redo, steps, ready: fryReady });
    // the first try's verdict (graded where it happened): the count and the frying
    const countWrong = made.countWrong || null;
    if (countWrong || fried.bad) yz.listen(false, countWrong || fried.bad);
    const nOne = made.two ? made.nA0 : made.n0;
    if (!ctx.guided && count <= 5) (nOne === count ? Cook.markRight : Cook.markMiss)(Cook.numId(count));
    if (nOne !== count) UI.mission.missItem("ph-samosa", ctx.dishAt || 0, { counted: true, block: made.two ? 1 : null });
    if (made.two && !ctx.guided && count2 <= 5) (made.nB0 === count2 ? Cook.markRight : Cook.markMiss)(Cook.numId(count2));
    steps.done();
    await serve(yz, { who, plate: fried.plate, ok: true, last: true });
    yz.close();
    St.end();
    const result = { count: made.n, fillings: made.got, fried: fried.lifted, fillings2: made.got2 || null };
    cardFold(false);
    ctx.result.samosa = result;
    ctx.result.fillings = result && result.fillings;
    ctx.result.folded = result && result.count;
    if (ctx.closeItem) ctx.closeItem(["ph-samosa"]);
    return result;
  }

  /*
   * s08 w6B (CK-48, P28; the judge: "the stage is bare marble at 2264 and 2665 ms before the board appears at 3168 ms"): the
   * station's art is loaded before St.begin (above, while the order's card is up), but St.begin's view fade comes up on the
   * empty worktop and then waits for the station's pop-up (ctx.nextStep) before the scene was drawn. Now the scene is drawn
   * the moment the new view is set (as it fades in), and only the play waits for St.begin: the game appears with its
   * worktop, never after it. Resolves once St.begin has set `view` (its fresh layer), or once St.begin has finished.
   */
  function viewUp(S, view, begun) {
    const layer0 = S.layer;
    let done = false;
    begun.then(
      () => (done = true),
      () => (done = true),
    );
    return new Promise((resolve) => {
      const check = () => (done || (S.layer !== layer0 && S.viewName === view) ? resolve() : setTimeout(check, 16));
      check();
    });
  }
  /**
   * The phase fold (design system 13): once the fill closes, the card can't be acted on until the plate is
   * tasted, so it folds to face + headline (no ✓: the samosas aren't made yet; the count is only in the
   * headline, so the filling rows alone would read as "finished" at the fold).
   */
  function cardFold(on) {
    const M = UI.mission;
    if (M && M.closeCards) M.closeCards(on);
  }
  /** Not quite: the card starts again, open (its misses stay for the review). */
  function cardAgain(ctx) {
    const L = ladderOf(ctx);
    if (L) {
      Cook.Order.rows(L, { all: true }).forEach((r) => {
        if (r.head) return;
        r.done = false;
        r.got = 0;
      });
      UI.mission.refresh();
    }
    cardFold(false);
  }

  /* ---------- the flat pieces every job shares ---------- */
  function backdrop(z, S, band = true) {
    S.track(
      S.add
        // (drawn past the design box: the stage fill shows more worktop above and at the sides, Cook.view)
        .rectangle(z.X(-FAR), z.Y(-FAR), z.L(1600 + 2 * FAR), z.L((band ? SHELF_TOP : 900) + FAR * (band ? 1 : 2)), INK.page, 0.5)
        .setOrigin(0)
        .setDepth(D.bg + 1),
    );
    if (!band) return;
    const g = S.track(S.add.graphics().setDepth(D.bg + 1.2));
    g.fillStyle(INK.panel, 1);
    g.fillRect(z.X(-FAR), z.Y(SHELF_TOP), z.L(1600 + 2 * FAR), z.L(900 - SHELF_TOP + FAR));
    g.fillStyle(0x2a1a0a, 0.08);
    g.fillRect(z.X(-FAR), z.Y(SHELF_TOP), z.L(1600 + 2 * FAR), z.L(3));
  }

  /** The word pop (§4): a flat white card with the speaker and the Kutchi word, and the family clip. */
  function pop(z, S, text, x, y, { speakId = null, line = null, ms = 1700 } = {}) {
    const c = S.track(S.add.container(x, y).setDepth(D.fx + 3).setAlpha(0).setScale(z.k * 0.8));
    const t = S.add.text(0, 0, text, { fontFamily: FONT, fontSize: "36px", fontStyle: "800", color: INK.kutchi }).setOrigin(0, 0.5);
    const w = 34 + 10 + t.width + 36;
    const g = S.add.graphics();
    g.fillStyle(0x28190a, 0.1);
    g.fillRoundedRect(-w / 2, -28 + 3, w, 56, 12);
    g.fillStyle(INK.card, 1);
    g.fillRoundedRect(-w / 2, -28, w, 56, 12);
    (Cook.Kit ? Cook.Kit.speaker : () => {})(g, -w / 2 + 30, 0, 26);
    t.x = -w / 2 + 50;
    c.add([g, t]);
    S.tweens.add({ targets: c, alpha: 1, scale: Math.max(z.k, Cook.Kit.textFloor(S, 36)), y: y - z.L(18), duration: 200, ease: "Back.easeOut" });
    S.tweens.add({ targets: c, alpha: 0, y: y - z.L(46), delay: ms, duration: 320, onComplete: () => c.destroy() });
    if (UI.naniMuted && UI.naniMuted()) return Promise.resolve();
    const talk = speakId ? Lang.popWord(speakId) : line ? Lang.speak(line, { kind: "count" }) : null;
    return talk ? Promise.race([Promise.resolve(talk).catch(() => {}), Cook.wait(ms + 900)]) : Promise.resolve();
  }

  /** The shelf: the fillings as top-down heaps on the band, no bowls (S2 / Q2), a chip under each (§4). */
  function shelf(z, S, ids, level) {
    const n = ids.length;
    const pitch = Math.min(PITCH, (1600 - 190 - 60) / Math.max(1, n));
    const width = n * pitch;
    const x0 = Math.max(30, (1600 - 190 - width) / 2); // clear of the tick, bottom right
    const items = {};
    ids.forEach((id, i) => {
      const x = x0 + pitch * (i + 0.5);
      const w = Math.min(HEAP_W, pitch - 26);
      const key = `sv3-heap-${id}`;
      let img;
      if (S.textures.exists(key)) {
        // (scaled by its own canvas: R5's chilli heap isn't on S5's 419 px one; it fills its canvas, so a little smaller)
        const own = S.textures.get(key).getSourceImage().width;
        const sc = (z.L(w) / own) * (own === META.heap.w ? 1 : 0.85);
        img = S.track(S.add.image(z.X(x), z.Y(HEAP_Y), key).setScale(sc).setDepth(D.item + 1));
        img.baseScale = sc;
        img.shadow = S.contactShadow(img, { centerX: z.X(x), centerY: z.Y(HEAP_Y + w * 0.06), width: z.L(w * 0.92), height: z.L(w * 0.86) });
      } else img = S.ingredient(id, z.X(x), z.Y(HEAP_Y), { w: z.L(118), h: z.L(100), label: false, depth: D.item + 1 });
      img.wordId = id;
      img.handAction = false; // no hands anywhere (§15)
      img.home = { x: img.x, y: img.y };
      const chip = Cook.Kit.chip(S, id, z.X(x), z.Y(CHIP_Y), { word: level < 3, w: Math.min(128, pitch - 12) });
      chip.setScale(z.k);
      img.chip = chip;
      items[id] = img;
    });
    return items;
  }

  /**
   * Where n samosas sit on a plate's flat middle (S10: never over the rim): rows of up to 2 (up to 4) or
   * 3, each cell's samosa as wide as fits. cx, cy, half: the flat middle (design px). -> [{x, y, a, w}]
   */
  function plateSpots(n, cx, cy, half, aspect = 0.8) {
    const cols = n <= 1 ? 1 : n <= 4 ? 2 : 3;
    const rows = Math.ceil(n / cols);
    const cw = (2 * half) / cols;
    const chh = (2 * half) / Math.max(rows, 1);
    // SAM-14 (M5): inside the flat middle, never over its edge (was half x 1.15: 8% too big)
    const w = Math.min(half * 0.98, cw * 0.9, (chh / aspect) * 0.9);
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols);
      const m = r < rows - 1 ? cols : n - cols * (rows - 1);
      const c = i - r * cols;
      out.push({ x: cx + (c - (m - 1) / 2) * cw, y: cy + (r - (rows - 1) / 2) * chh, a: [-6, 5, -3, 7, -5, 4][i % 6], w });
    }
    return out;
  }
  /** The plate (plate.webp) centred at (x, y) design px, d across: the image and its flat middle's half-width. */
  function plateAt(z, S, x, y, d, depth = D.item - 2) {
    const P = META.plate;
    const img = S.track(S.add.image(z.X(x), z.Y(y), "sv3-plate").setOrigin(P.cx, P.cy).setDepth(depth));
    img.setScale(z.L(d) / P.w);
    img.shadow = S.contactShadow(img, { centerX: img.x, centerY: img.y + z.L(d * 0.03), width: z.L(d * 0.96), height: z.L(d * 0.96) });
    img.flatHalf = d * P.r * P.flat; // design px
    img.home = { x, y };
    return img;
  }

  /* ---------- 1 + 2: fill the strips, one tick, then fold every filled one ---------- */
  /*
   * SAM-25 (decision 10, Zafar's yes, 18 Oct; P43): six strips on the big board at every level, the same at L1 as at L4. Tap any
   * strip and fill it from the shelf (a spoonful a tap), tap another and fill that; a tap on a mound takes a spoon back (E14);
   * ONE tick when they think they're done (the count is theirs). SAM-24 (P42): nothing on the card ticks before that tick, and
   * then every kind at once, once its samosas are all made: the tick grades every strip (decision 51: a wrong strip is emptied
   * and filled again with help, the third time it's filled for them; an extra strip is emptied; too few, they say the order
   * again), and only then the rows close. Then each filled strip comes to the middle and is folded (SAM-21: the coded fold,
   * Cook.Pastry in js/cook/mechanics/fill-fold.js), onto the plate, and straight on to the karahi (SAM-22: nothing waits for a
   * button with nothing to decide).
   */
  const STRIP_H = 290; // a strip's height at full size (design px); its length is the fold's (Cook.Pastry)
  const PPU = 300; // the fold's canvas px per strip height
  const STRIPS = 6;
  async function fillFold(z, { ids, want, kinds, exclude, count, want2 = {}, kinds2 = [], count2 = 0, level, phases, retry, redo, steps, ready = null }) {
    // the scene pieces are raised into the middle of a taller stage's worktop (the stage fill); the shelf band keeps z0
    const z0 = z;
    z = Cook.liftZone(z0);
    const S = z.S;
    const ctx = z.ctx;
    const dish = ctx.dishAt || 0;
    const k = Mech.knobs("fold", { level });
    backdrop(z0, S);
    // the house board (S6), bigger (P43: "increase the size of the chopping board")
    const board = S.track(S.add.image(z.X(BOARD.x), z.Y(BOARD.y), "sv3-board").setDepth(D.item - 2));
    board.setDisplaySize(z.L(BOARD.w), z.L(BOARD.h));
    board.shadow = S.contactShadow(board);
    // the plate the folded samosas wait on (right of the board; S10: on its flat middle)
    const plate = plateAt(z, S, PLATE.x, PLATE.y, PLATE.d);
    const items = shelf(z0, S, ids, level);
    const P0 = { x: BOARD.x, y: BOARD.y + 6 };
    const folds = Math.max(3, Math.min(4, St.knobInt(k.folds != null ? k.folds : 3)));
    const tile = S.textures.exists("sv3-pastry") ? S.textures.get("sv3-pastry").getSourceImage() : null;
    // the flat strip, drawn once in code from the pastry texture (its geometry is every fold's)
    const proto = Cook.Pastry.create({ folds, tile, ppu: PPU });
    const LU = proto.L;
    proto.draw({});
    if (S.textures.exists("sv3-fold-strip")) S.textures.remove("sv3-fold-strip");
    S.textures.addCanvas("sv3-fold-strip", proto.canvas);
    const FULL = z.L(STRIP_H / PPU); // a strip's scale at full size
    const U = (o) => o.scaleX * PPU; // world px per unit (the strip's height)
    const u2w = (o, p) => ({ x: o.x + (p[0] - LU / 2) * U(o), y: o.y + (p[1] - 0.5) * U(o) });
    const w2u = (o, x, y) => [(x - o.x) / U(o) + LU / 2, (y - o.y) / U(o) + 0.5];
    /** A flat strip (design px), q of full size. */
    function pastry(x, y, q = 1) {
      const img = S.track(S.add.image(z.X(x), z.Y(y), "sv3-fold-strip").setDepth(D.item));
      img.setScale(FULL * q);
      img.blobs = [];
      img.got = {};
      img.order = [];
      img.block = 0;
      return img;
    }
    /** Where the filling lands (world px; o: a strip, or {x, y, scaleX}): its middle and size, for the pop and the puff. */
    const fillAt = (o) => {
      const c = u2w(o, proto.fillCentre());
      return { x: c.x, y: c.y, r: 0.21 * U(o) };
    };
    /** Where m fillings' mounds sit on a strip (world px): inside the corner the first fold lays over them. */
    // (on a strip laid out on the board they're drawn a quarter bigger, so they read at its size; at full size, to be folded,
    // they fit inside where the corner lands)
    const mounds = (o, m) => proto.mounds(m).map((s) => Object.assign(u2w(o, [s.x, s.y]), { size: 2.3 * s.r * U(o) * (o.scaleX < FULL * 0.9 ? 1.25 : 1) }));
    const grow = (o) => Math.min(1.15, 1 + 0.05 * ((o.spoons || 1) - 1));

    /* a spoonful: a little heap lifts off its pile and lands on the strip's corner (the first fold covers it) */
    async function spoon(sheet, id, { quiet = false, fast = false } = {}) {
      const obj = items[id];
      const key = S.textures.exists(`sv3-heap-${id}`) ? `sv3-heap-${id}` : S.tex(`layer:${id}`);
      const from = obj ? { x: obj.x, y: obj.y - obj.displayHeight * 0.2 } : { x: z.X(800), y: z.Y(700) };
      if (obj && !fast) S.tweens.add({ targets: obj, scale: obj.baseScale * 1.08, duration: 90, yoyo: true });
      const b = S.track(S.add.image(from.x, from.y, key).setDepth(D.fx));
      // 30 Sept: ONE little mound per filling, side by side, so every filling that went in shows; another spoon of the
      // same filling grows its mound a little
      const own = sheet.blobs.find((o) => o.wordId === id);
      const kindsOn = sheet.blobs.map((o) => o.wordId).concat(own ? [] : [id]);
      const spots = mounds(sheet, kindsOn.length);
      const place = (o, sp, ms) => {
        const size = sp.size * grow(o);
        if (!ms) return o.setPosition(sp.x, sp.y).setDisplaySize(size, size * 0.96);
        S.tweens.add({ targets: o, x: sp.x, y: sp.y, displayWidth: size, displayHeight: size * 0.96, duration: ms });
      };
      sheet.blobs.forEach((o) => o !== own && place(o, spots[kindsOn.indexOf(o.wordId)], fast ? 200 : 300));
      const at = spots[kindsOn.indexOf(id)];
      b.setDisplaySize(at.size * 0.6, at.size * 0.6);
      if (!quiet) Cook.sfx.pop();
      await S.fly(b, at.x, at.y - z.L(40), { duration: fast ? 260 : 380, arc: z.L(110) });
      await new Promise((r) => S.tweens.add({ targets: b, y: at.y, displayWidth: at.size * 0.9, displayHeight: at.size * 0.86, duration: 140, ease: "Quad.easeIn", onComplete: r }));
      if (!quiet) S.puff(at.x, at.y, St.color(((Cook.item(id) || {}).layer || {}).color || "#f3e3b0"), z.L(26));
      if (own) {
        b.destroy();
        own.spoons = (own.spoons || 1) + 1;
        place(own, at, 140);
        return own;
      }
      b.setDepth(D.item + 0.2 + sheet.blobs.length * 0.001);
      b.setAngle(Math.random() * 360);
      b.wordId = id;
      b.spoons = 1;
      place(b, at, 0);
      S.tweens.add({ targets: b, scaleY: b.scaleY * 0.92, duration: 80, yoyo: true });
      sheet.blobs.push(b);
      return b;
    }
    /** C3 (E14): a spoonful taken back off a strip: its mound shrinks (or goes back to its pile); the rest close up. */
    function unspoon(sheet, b) {
      const id = b.wordId;
      b.spoons = (b.spoons || 1) - 1;
      Cook.sfx.pop();
      if (b.spoons <= 0) {
        sheet.blobs.splice(sheet.blobs.indexOf(b), 1);
        S.untap(b);
        const obj = items[id];
        const to = obj ? { x: obj.x, y: obj.y - obj.displayHeight * 0.2 } : { x: b.x, y: b.y + z.L(200) };
        S.fly(b, to.x, to.y, { duration: 320, arc: z.L(90) }).then(() => b.destroy());
      }
      const kindsOn = sheet.blobs.map((o) => o.wordId);
      const spots = mounds(sheet, kindsOn.length);
      sheet.blobs.forEach((o) => {
        const sp = spots[kindsOn.indexOf(o.wordId)];
        const size = sp.size * grow(o);
        S.tweens.add({ targets: o, x: sp.x, y: sp.y, displayWidth: size, displayHeight: size * 0.96, duration: 240 });
      });
      sheet.got[id] = Math.max(0, (sheet.got[id] || 0) - 1);
      const at = sheet.order.lastIndexOf(id);
      if (at >= 0) sheet.order.splice(at, 1);
      return id;
    }
    const emptyStrip = (x) => {
      x.blobs.slice().forEach((bl) => {
        while (bl.active && x.blobs.includes(bl)) unspoon(x, bl);
      });
      x.got = {};
      x.order = [];
      x.block = 0;
    };

    /* ---------- FILL: six strips on the board, tap any, fill it ---------- */
    const two = count2 > 0 && kinds2.length > 0;
    const bOpt = (b) => (two ? { block: b } : {});
    const wantOf = (b) => (b === 2 ? want2 : want);
    const kindsOf = (b) => (b === 2 ? kinds2 : kinds);
    const countOf = (b) => (b === 2 ? count2 : b === 1 ? count : 0);
    const blocks = two ? [1, 2] : [1];
    let lay = null;
    const SW = LU * STRIP_H;
    for (let cols = 1; cols <= STRIPS; cols++) {
      const rows = Math.ceil(STRIPS / cols);
      const q = Math.min((((BOARD.w * 0.92) / cols) * 0.9) / SW, (((BOARD.h * 0.86) / rows) * 0.86) / STRIP_H);
      if (!lay || q > lay.q) lay = { cols, rows, q };
    }
    const cw = (BOARD.w * 0.92) / lay.cols;
    const ch = (BOARD.h * 0.86) / lay.rows;
    const strips = [];
    for (let i = 0; i < STRIPS; i++) {
      const r = Math.floor(i / lay.cols);
      const m = r < lay.rows - 1 ? lay.cols : STRIPS - lay.cols * (lay.rows - 1);
      const c = i - r * lay.cols;
      const st = pastry(BOARD.x + (c - (m - 1) / 2) * cw, P0.y + (r - (lay.rows - 1) / 2) * ch, lay.q);
      st.setAlpha(0);
      st.slot = i;
      st.home = { x: st.x, y: st.y, scale: st.scale };
      S.tweens.add({ targets: st, alpha: 1, duration: 220, delay: 40 * i });
      strips.push(st);
    }
    await Cook.wait(260 + 40 * STRIPS);
    if (ready) await ready; // (CK-48: drawn as the view came up; the play starts once St.begin is done)
    let active = null;
    // (the test hook focus, flow.js: the strip's filling corner, where each spoonful lands and puffs; CK-27's filmstrip)
    Cook.focusBox = () => {
      const s = active || strips[0];
      if (!s || !s.active) return null;
      const pa = fillAt(s);
      const h = Math.max(pa.r * 2.2, z.L(110));
      return { x: pa.x - h, y: pa.y - h, w: h * 2, h: h * 2 };
    };
    const filledOf = () => strips.filter((x) => x.order.length);
    // SAM-12: a strip is the kind its base filling says (chundo or bataato: the two kinds never share a base); 0 while unclear
    const blockOf = (x) => {
      if (!two) return x.order.length ? 1 : 0;
      const b1 = (x.got[kinds[0]] || 0) > 0;
      const b2 = (x.got[kinds2[0]] || 0) > 0;
      return b2 && !b1 ? 2 : b1 && !b2 ? 1 : 0;
    };
    const madeOf = (b) => filledOf().filter((x) => blockOf(x) === b).length;
    // the kind still short of its count (the next strip is for it), else 0
    const needBlock = () => blocks.find((b) => madeOf(b) < countOf(b)) || 0;
    /** What the child would do next if they did it right: a filling for the active strip, another strip, or the tick. */
    const nextMove = () => {
      if (active) {
        const b = blockOf(active) || needBlock() || 1;
        const w = wantOf(b);
        const over = Object.keys(active.got).some((id) => active.got[id] > (w[id] || 0));
        const heap = kindsOf(b).find((id) => (active.got[id] || 0) < w[id]);
        if (heap && !over && (active.order.length || needBlock())) return { heap, block: b };
      }
      if (needBlock()) return { strip: strips.find((x) => x !== active && !x.order.length) || strips.find((x) => !x.order.length) };
      return { done: true };
    };
    let helping = false;
    let graded = false;
    let first = null; // the first tick's counts (only the first try is scored)
    let fillWrong = null;
    let gotFirst = {};
    let got2First = null;
    let lastTap = 0;
    Cook.undoAt = () => {
      // (not while Nani's "pass me" or a first-time coach is up: only the thing they point at takes a tap)
      if (Cook.paused || (Cook.Coach && Cook.Coach.active())) return null;
      const b = active && active.blobs.find((o) => o.active && o.tapReady);
      return b ? S.centre(b) : null;
    };
    /** One move: a strip, a filling, a mound (take back) or the tick. */
    const pick = () =>
      new Promise((resolve) => {
        let over = false;
        const lit = [];
        const fin = (r) => {
          if (over) return;
          over = true;
          strips.forEach((x) => {
            S.untap(x);
            x.blobs.forEach((b) => b.active && S.untap(b));
          });
          Object.values(items).forEach((o) => o && o.active && S.untap(o));
          lit.forEach((o) => o.active && S.glow(o, false));
          UI.hideDone();
          z.expect(null);
          resolve(r);
        };
        strips.forEach((x) => {
          S.tappable(x, () => fin({ strip: x }));
          x.blobs.forEach((b) => b.active && b.tapReady && S.tappable(b, () => fin({ back: b, strip: x })));
        });
        Object.entries(items).forEach(([id, o]) => o && o.active && S.tappable(o, () => fin({ id })));
        const filled = filledOf().length;
        const mv = nextMove();
        const glow = ctx.guided || helping;
        // SH-56 (decision 79): every strip filled, nothing left to choose: on by itself after a beat, no ✓
        if (filled >= STRIPS && !(active && mv.heap)) {
          z.expect({ kind: "wait" });
          Cook.wait(700).then(() => fin({ done: true }));
          return;
        }
        if (filled) UI.done({ glow: !!(glow && mv.done) }).then(() => fin({ done: true }));
        // T17 / SH-110: Nani calls the strip's first filling as soon as a strip is wanted ("Bhar! Chundo."), the same step
        // when that strip is tapped (so a strip tap never starts a call over the child's next tap), then each next filling
        const ord = filledOf().filter((x) => x !== active).length;
        const callFill = (heap) => steps.to("samosa:fill", { id: `fill-${ord}-${heap}`, line: Lang.join([St.guideLine("samosa:fill"), Lang.bare(Lang.phrase([heap]))]), role: "howto" });
        if (mv.heap) {
          const o = items[mv.heap];
          if (o && o.active) {
            if (glow) {
              S.glow(o, true);
              lit.push(o);
            }
            const c = S.centre(o);
            const wrongs = Object.keys(items)
              .filter((id) => id !== mv.heap && items[id] && items[id].active)
              .map((id) => S.centre(items[id]));
            z.expect({ kind: "tap", x: c.x, y: c.y, key: mv.heap, wrongs });
            callFill(mv.heap);
            return;
          }
        }
        const nb = mv.strip ? needBlock() : 0;
        if (nb) callFill(kindsOf(nb)[0]);
        else steps.done();
        if (mv.strip) {
          if (glow) {
            S.glow(mv.strip, true, { bounce: true });
            lit.push(mv.strip);
          }
          const c = S.centre(mv.strip);
          z.expect({ kind: "tap", x: c.x, y: c.y, key: "strip", wrongs: [] });
        } else if (filled) z.expect({ kind: "click", selector: "#done-btn", open: true }); // open: another strip or spoon still changes it (C10)
        else z.expect({ kind: "wait" });
      });
    /** The strip being filled sits a little raised (bigger, its shadow wider) so the child sees where the spoons go. */
    const lift = (x, k, ms) => {
      const sc = x.home.scale * k;
      S.tweens.add({ targets: x, scale: sc, duration: ms, ease: k > 1 ? "Back.easeOut" : "Quad.easeOut" });
      const ids = x.blobs.map((o) => o.wordId);
      const at = mounds({ x: x.x, y: x.y, scaleX: sc }, ids.length);
      x.blobs.forEach((o) => {
        const sp = at[ids.indexOf(o.wordId)];
        const size = sp.size * grow(o);
        S.tweens.add({ targets: o, x: sp.x, y: sp.y, displayWidth: size, displayHeight: size * 0.96, duration: ms });
      });
    };
    const setActive = (x) => {
      if (active === x) return;
      if (active && active.active) lift(active, 1, 140);
      active = x;
      x.setDepth(D.item + 0.05);
      lift(x, 1.05, 180);
    };
    /** The right way, shown (decision 51, the third try): a strip filled for them, its heaps glowing in turn. */
    const showFill = async (x, b) => {
      const w = wantOf(b);
      for (const id of Object.keys(w)) {
        for (let i = 0; i < w[id]; i++) {
          if (items[id]) S.glow(items[id], true, { bounce: true });
          await spoon(x, id);
          x.got[id] = (x.got[id] || 0) + 1;
          x.order.push(id);
          if (items[id]) S.glow(items[id], false);
        }
      }
      x.blobs.forEach((bl) => (bl.tapReady = true));
      x.block = b;
    };
    for (;;) {
      const r = await pick();
      if (r.strip && !r.back) {
        setActive(r.strip);
        continue;
      }
      if (r.back) {
        if (performance.now() - lastTap < 220) continue;
        lastTap = performance.now();
        setActive(r.strip);
        const id = unspoon(r.strip, r.back);
        z.progress({ unfilled: id, n: r.strip.got[id] || 0 });
        continue;
      }
      if (r.id) {
        if (performance.now() - lastTap < 220) continue; // a double tap
        lastTap = performance.now();
        if (!active) setActive(strips.find((x) => !x.order.length) || strips[0]);
        const sheet = active;
        const id = r.id;
        sheet.got[id] = (sheet.got[id] || 0) + 1;
        sheet.order.push(id);
        if (UI.naniMood) UI.naniMood("happy", 1600); // ART-10: something went in (progress, never a verdict; the card waits for the tick)
        const into = spoon(sheet, id);
        const pa = fillAt(sheet);
        // 29 Sept (Q7): at level 1 the count is heard as you add ("ba chundo"), else the word
        const cnt = (level || z.level) <= 1 && UI.tallyLine ? UI.tallyLine(sheet.got[id], id) : null;
        pop(z, S, cnt ? Lang.plain(cnt) : Cook.display(id), pa.x, pa.y - z.L(110), cnt ? { line: cnt, ms: 1200 } : { speakId: id, ms: 1200 });
        const mound = await into;
        if (mound && mound.active) mound.tapReady = true;
        z.progress({ filled: id, n: sheet.got[id] });
        continue;
      }
      if (!r.done) continue;
      /* the one tick: every strip is graded now */
      const filled = filledOf();
      filled.forEach((x) => (x.block = blockOf(x)));
      // (a strip with both bases or none: the kind still short)
      filled.filter((x) => !x.block).forEach((x) => (x.block = two && filled.filter((y) => y.block === 1).length >= count ? 2 : 1));
      const wrongOf = (x) => {
        const w = wantOf(x.block);
        const bad = Object.keys(x.got).find((id) => x.got[id] > 0 && !w[id]);
        if (bad) return exclude.includes(bad) ? `put ${bad} in (they said no)` : `put ${bad} in`;
        const off = kindsOf(x.block).find((id) => (x.got[id] || 0) !== w[id]);
        return off ? `spooned ${x.got[off] || 0}, they asked for ${w[off]}: ${off}${two ? ` (samosa ${x.block})` : ""}` : null;
      };
      if (!graded) {
        graded = true;
        const of = (b) => filled.filter((x) => x.block === b);
        first = { n: filled.length, nA: of(1).length, nB: of(2).length };
        const one = of(1).find((x) => !wrongOf(x)) || of(1)[0];
        gotFirst = one ? Object.assign({}, one.got) : {};
        if (two) {
          const two1 = of(2).find((x) => !wrongOf(x)) || of(2)[0];
          got2First = two1 ? Object.assign({}, two1.got) : {};
        }
        const wrongs = filled.map(wrongOf).filter(Boolean);
        fillWrong = wrongs[0] || null;
        if (!retry) {
          // each filling of each kind: right when every strip of that kind has it as asked
          blocks.forEach((b) => {
            const mine = of(b);
            kindsOf(b).forEach((id) => {
              const w = wantOf(b)[id];
              const right = mine.length > 0 && mine.every((x) => (x.got[id] || 0) === w);
              if (!right) UI.mission.missItem(id, dish, Object.assign({ counted: true }, bOpt(b)));
              if (!ctx.guided) {
                (right ? Cook.markRight : Cook.markMiss)(id);
                if (w <= 5) (right ? Cook.markRight : Cook.markMiss)(Cook.numId(w));
              }
            });
          });
          exclude.forEach((id) => filled.some((x) => (x.got[id] || 0) > 0) && UI.mission.missItem(id, dish, { no: true }));
          z.listen(!fillWrong, fillWrong || "filled");
        }
      }
      // decision 51, strip by strip: a wrong one is emptied and filled again (with help); the third time, filled for them
      let again = false;
      let sayOrder = false;
      for (const x of filled.filter(wrongOf)) {
        const b = x.block;
        const rd = redo.wrong(`fill-strip-${x.slot}`);
        emptyStrip(x);
        if (rd.action === "show") await showFill(x, b);
        else again = true;
      }
      if (again) await Cook.wait(360);
      // too many of a kind: the extra strips are emptied (only the first count is scored); too few: the order again
      for (const b of blocks) {
        const mine = filledOf().filter((x) => blockOf(x) === b);
        mine.slice(countOf(b)).forEach(emptyStrip);
        if (mine.length < countOf(b)) {
          const rd = redo.wrong(`strips-${b}`);
          if (rd.action === "show") {
            while (filledOf().filter((x) => blockOf(x) === b).length < countOf(b)) {
              const x = strips.find((y) => !y.order.length);
              if (!x) break;
              await showFill(x, b);
            }
          } else {
            again = true;
            sayOrder = true;
          }
        }
      }
      if (!again) break;
      helping = true;
      active = null;
      if (Cook.roundLevel(ctx) <= 1) Cook.oops(ctx);
      if (sayOrder) {
        const line = orderLine(ladderOf(ctx));
        if (line) await Promise.race([St.customerSay(ctx, line, { hide: St.hideKnown(ctx) }), Cook.wait(8000)]);
        St.customerDone();
      }
    }
    Cook.undoAt = null;
    // SAM-24: the fill closes now, for every strip at once: each kind's rows tick together, its samosas all made
    steps.done();
    blocks.forEach((b) => {
      if (two) UI.mission.closeItem(kindsOf(b), dish, { block: b });
      else if (ctx.closeItem) ctx.closeItem(kindsOf(b));
      else UI.mission.closeItem(kindsOf(b), dish);
    });
    if (exclude.length) UI.mission.closeItem(exclude, dish, { no: true });
    Cook.sfx.right();
    filledOf().forEach((x) => {
      const pa = fillAt(x);
      S.sparkle(pa.x, pa.y);
    });
    // the spare strips go; the card folds until the plate is tasted; the shelf goes quiet: folding is next
    strips.filter((x) => !x.order.length).forEach((x) => S.tweens.add({ targets: x, alpha: 0, duration: 240, onComplete: () => x.destroy() }));
    strips.forEach((x) => x.blobs.forEach((b) => b.active && S.untap(b)));
    await Cook.wait(360);
    cardFold(true);
    Object.values(items).forEach((o) => S.tweens.add({ targets: [o, o.chip], alpha: 0.35, duration: 300 }));
    if (ctx.nextStep) ctx.nextStep("Fold");
    if (phases.fold && !retry) UI.gist(phases.fold);

    /* ---------- FOLD: each filled strip in the middle, swiped over where the arrow shows ---------- */
    const toFold = filledOf().sort((a, b) => blockOf(a) - blockOf(b) || a.slot - b.slot);
    const foldKey = "sv3-foldcv";
    if (S.textures.exists(foldKey)) S.textures.remove(foldKey);
    const cv = S.textures.createCanvas(foldKey, proto.canvas.width, proto.canvas.height);
    const fimg = S.track(S.add.image(z.X(P0.x), z.Y(P0.y), foldKey).setDepth(D.item + 0.5).setScale(FULL).setVisible(false));
    const doneKey = `sv3-fold-done-${folds}`;
    let doneInfo = null;
    // the live fold: redrawn every frame while a strip is being folded (the lit flap breathes)
    let live = null;
    let glowT = 0;
    const gdt = clock();
    const stopFoldTick = S.addTick(() => {
      const dt = gdt();
      if (!live) return;
      glowT += dt / 1000;
      if (live.arrowTo != null) live.arrow += Cook.clamp(live.arrowTo - live.arrow, -dt / 220, dt / 220);
      live.P.draw({ t: live.t, glow: live.lit ? 0.5 + 0.5 * Math.sin(glowT * 4) : null, arrow: live.arrow, blobs: live.blobs }, cv.getContext());
      cv.refresh();
    });
    let n = 0;
    let nA = 0;
    let nB = 0;
    const onPlate = [];
    /*
     * SAM-25 (P43: "fold them all after you make them"; the judge, 20 Oct: "the first fold shows a single pastry with no others
     * made and waiting"): the filled strips still to fold wait in a row along the board's foot, smaller, their fillings on
     * them, while the one being folded is in the middle at full size; each comes up from that row in turn
     */
    const SW_FULL = LU * STRIP_H;
    const park = (waiting) => {
      const n = waiting.length;
      if (!n) return;
      const q = Math.min(0.36, (((BOARD.w * 0.9) / n) * 0.88) / SW_FULL);
      const pitch = Math.min((BOARD.w * 0.9) / n, SW_FULL * q * 1.12);
      const rowY = BOARD.y + BOARD.h / 2 - BOARD.h * 0.04 - (STRIP_H * q) / 2;
      waiting.forEach((y, i) => {
        const tx = z.X(BOARD.x + (i - (n - 1) / 2) * pitch);
        const ty = z.Y(rowY);
        const sc = FULL * q;
        const to = { x: tx, y: ty, scaleX: sc };
        const k = sc / (y.scaleX || sc);
        y.blobs.forEach((b) => {
          const p = u2w(to, w2u(y, b.x, b.y));
          S.tweens.add({ targets: b, x: p.x, y: p.y, displayWidth: b.displayWidth * k, displayHeight: b.displayHeight * k, alpha: 1, duration: 340, ease: "Cubic.easeInOut" });
        });
        S.tweens.add({ targets: y, x: tx, y: ty, scale: sc, alpha: 1, duration: 340, ease: "Cubic.easeInOut" });
      });
    };
    for (const x of toFold) {
      const kind = blockOf(x);
      // the others wait along the board's foot while this one comes to the middle of the board, full size, its filling with it
      park(toFold.filter((y) => y !== x && y.active && !onPlate.includes(y)));
      const tx = z.X(P0.x);
      const ty = z.Y(P0.y);
      const bk = x.blobs.map((o) => o.wordId);
      const bs = mounds({ x: tx, y: ty, scaleX: FULL }, bk.length);
      x.blobs.forEach((bl) => {
        const sp = bs[bk.indexOf(bl.wordId)];
        const size = sp.size * grow(bl);
        S.tweens.add({ targets: bl, x: sp.x, y: sp.y, displayWidth: size, displayHeight: size * 0.96, duration: 340, ease: "Cubic.easeInOut" });
      });
      await new Promise((res) => S.tweens.add({ targets: x, x: tx, y: ty, scale: FULL, duration: 340, ease: "Cubic.easeInOut", onComplete: res }));
      const P = Cook.Pastry.create({ folds, tile, ppu: PPU });
      const blobsU = x.blobs.map((b) => {
        const [ux, uy] = w2u(x, b.x, b.y);
        return { img: b.texture.getSourceImage(), x: ux, y: uy, w: b.displayWidth / U(x), h: b.displayHeight / U(x), angle: b.angle };
      });
      live = { P, t: 0, lit: false, arrow: 0, arrowTo: 1, blobs: blobsU };
      live.P.draw({ blobs: blobsU }, cv.getContext());
      cv.refresh();
      fimg.setPosition(x.x, x.y).setScale(FULL).setAlpha(1).setVisible(true);
      x.setVisible(false);
      x.blobs.forEach((b) => b.setVisible(false));
      steps.to("samosa:fold", { id: `fold-${n}` }); // T17: Samosa waar!
      for (let f = 0; f < P.N; f++) {
        const sw = P.swipe();
        const from = u2w(x, sw.from);
        const to = u2w(x, sw.to);
        live.lit = true;
        live.arrowTo = 1;
        await swipe(z, S, {
          from,
          to,
          minLen: k.minLen || 0.45,
          onDrag: () => {
            live.lit = false;
            live.arrowTo = 0;
            live.arrow = 0;
          },
          onCancel: () => {
            live.lit = true;
            live.arrowTo = 1;
          },
          draw: (t) => (live.t = t),
        });
        P.commit();
        live.t = 0;
        if (f === 0) {
          x.blobs.forEach((bl) => bl.destroy());
          x.blobs = [];
          live.blobs = [];
        }
        Cook.sfx.flip();
        setTimeout(() => Cook.sfx.click(), 60);
        S.tweens.add({ targets: fimg, scale: FULL * 1.03, duration: 70, yoyo: true, ease: "Quad.easeOut" });
        z.progress((f + 1) / P.N);
      }
      // the end of the strip tucks under by itself: nothing to decide
      live.lit = false;
      live.arrowTo = 0;
      live.arrow = 0;
      await new Promise((res) => {
        const o = { v: 0 };
        S.tweens.add({ targets: o, v: 1, duration: 220, ease: "Quad.easeIn", onUpdate: () => (live.t = o.v), onComplete: res });
      });
      P.commit();
      live.t = 0;
      P.draw({}, cv.getContext());
      cv.refresh();
      live = null;
      n++;
      if (kind === 2) nB++;
      else nA++;
      z.skill(100, "fold");
      // the finished samosa, alone (the same picture for every one: drawn once)
      const d = P.done();
      if (!doneInfo) {
        if (S.textures.exists(doneKey)) S.textures.remove(doneKey);
        S.textures.addCanvas(doneKey, d.canvas);
        doneInfo = d;
      }
      S.tweens.killTweensOf(fimg);
      const c = u2w({ x: fimg.x, y: fimg.y, scaleX: FULL }, [d.x, d.y]);
      x.setTexture(doneKey).setOrigin(0.5).setScale(FULL).setPosition(c.x, c.y).setAlpha(1).setVisible(true);
      fimg.setVisible(false);
      S.sparkle(x.x, x.y);
      Cook.sfx.right();
      pop(z, S, Cook.display("ph-samosa"), x.x, x.y - z.L(170), { speakId: "ph-samosa", ms: 1100 });
      await Cook.wait(160);
      onPlate.push(x);
      // onto the plate's flat middle (S10): the plate shows how many (never a count to aim for)
      const spots = plateSpots(onPlate.length, PLATE.x, PLATE.y, plate.flatHalf, 0.87);
      await Promise.all(
        onPlate.map((o, i) => {
          const sp = spots[i];
          const sc = z.L(sp.w) / (Cook.Pastry.TS * PPU);
          if (o === x) return S.fly(o, z.X(sp.x), z.Y(sp.y), { scale: sc, duration: 400, arc: z.L(90) }).then(() => o.setAngle(sp.a));
          return new Promise((res) => S.tweens.add({ targets: o, x: z.X(sp.x), y: z.Y(sp.y), scale: sc, angle: sp.a, duration: 280, onComplete: res }));
        }),
      );
      toFold.filter((y) => y.active && !onPlate.includes(y)).forEach((y) => S.tweens.add({ targets: [y, ...y.blobs], alpha: 1, duration: 180 }));
    }
    steps.done();
    stopFoldTick();
    UI.hideGo();
    UI.hideDone();
    z.expect({ kind: "wait" });
    await Cook.wait(200);
    const countWrong = two ? (first.nA !== count || first.nB !== count2 ? `made ${first.nA} and ${first.nB}, they asked for ${count} and ${count2}: ph-samosa` : null) : first.n !== count ? `made ${first.n}, they asked for ${count}: ph-samosa` : null;
    return { n, nA, nB, two, got: gotFirst, got2: got2First, fillWrong, countWrong, n0: first.n, nA0: first.nA, nB0: first.nB };
  }

  /**
   * One fold by swipe: the flap follows the finger (draw(t), t 0-1 along from->to); past minLen on letting go it snaps
   * over, else it settles back flat. SAM-16: a fold starts only on a drag within 25 degrees of its arrow (the folds run 30
   * degrees off the strip, so a flat swipe along it never folds); any other way does nothing and costs nothing (rule 12).
   */
  function swipe(z, S, { onDrag, onCancel, from, to, draw, minLen }) {
    return new Promise((resolve) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1;
      let start = null;
      let t = 0;
      let over = false;
      const offs = [];
      const show = (v) => {
        t = Cook.clamp(v, 0, 1);
        draw(t);
      };
      const finish = (r) => {
        if (over) return;
        over = true;
        offs.forEach((o) => o());
        z.expect(null);
        resolve(r);
      };
      const settle = (to1) =>
        new Promise((r) => {
          const o = { v: t };
          S.tweens.add({ targets: o, v: to1, duration: to1 ? 150 * (1 - t) + 60 : 220, ease: to1 ? "Quad.easeIn" : "Back.easeOut", onUpdate: () => show(Math.max(0, o.v)), onComplete: r });
        });
      offs.push(
        z.on("pointerdown", (p) => {
          start = { x: p.worldX, y: p.worldY };
        }),
        z.on("pointermove", (p) => {
          if (!start || over) return;
          const mx = p.worldX - start.x;
          const my = p.worldY - start.y;
          if (t === 0) {
            const m = Math.hypot(mx, my);
            if (m < 14 * z.k) return;
            if ((mx * dx + my * dy) / (m * len) < Math.cos((25 * Math.PI) / 180)) {
              start = null;
              return;
            }
          }
          const v = (mx * dx + my * dy) / (len * len);
          if (v > 0.02 || t > 0) {
            if (onDrag) onDrag();
            show(v);
          }
        }),
        z.on("pointerup", async () => {
          if (!start || over) return;
          start = null;
          if (t >= minLen) {
            offs.forEach((o) => o());
            await settle(1);
            finish("fold");
          } else if (t > 0) {
            Cook.sfx.soft();
            await settle(0);
            show(0);
            if (onCancel) onCancel();
          }
        }),
      );
      z.expect({ kind: "swipe", x1: from.x, y1: from.y, x2: to.x, y2: to.y });
    });
  }

  /* ---------- 3: fry in the karahi on the wide hob, lift onto the paper-lined plate ---------- */
  async function fry(z, { n, level, redo, steps, ready = null }) {
    const z0 = z;
    z = Cook.liftZone(z0);
    const S = z.S;
    const ctx = z.ctx;
    const Kit = Cook.Kit;
    const k = Mech.knobs("fry", { level });
    const [lo, hi] = k.band || [0.62, 0.84];
    backdrop(z0, S);
    // S19 / Q9: the wide hob (one big landscape burner) and the karahi 1.5x its old size, the plate to its
    // right on the burner's line; the folded samosas wait on thalis on the band
    const hob = Kit.hob(S, { wide: true, k: z.L(FRY.hobK), cx: z.X(FRY.bx), bottom: z.Y(SHELF_TOP - 16) });
    const at = hob.burners[0];
    const bodyR = z.L(FRY.r);
    // the flames peek out past the karahi's body (flame-high's ring: 1.2 x flameR)
    const burner = Kit.burner(S, hob, 0, { flameR: bodyR * 0.9 });
    // the karahi, placed by its measured round body (never the handle-inclusive box)
    const KM = META.karahi;
    const karahi = S.track(S.add.image(at.x, at.y, "sv3-karahi").setOrigin(KM.cx, KM.cy).setDepth(D.item));
    karahi.setScale(bodyR / (KM.r * KM.w));
    karahi.shadow = S.contactShadow(karahi, { centerX: at.x, centerY: at.y + bodyR * 0.08, width: bodyR * 2.15, height: bodyR * 2.15 });
    const oilR = bodyR * KM.oil;
    const PY = (at.y - z.Y(0)) / z.k; // the plate sits on the burner's line (design px)
    const plate = plateAt(z, S, FRY.px, PY, FRY.pd);
    const OL = OIL(n);
    const FS = z.L(OL.size) / META.fry.w; // a samosa's scale in the oil (fry canvases)
    const raw = [];
    const trays = [];
    for (let i = 0; i < n; i++) {
      const x = 800 + (i - (n - 1) / 2) * FRY.trayPitch;
      const t = S.track(S.add.image(z.X(x), z0.Y(FRY.trayY), "sv2-thali").setDepth(D.item - 1));
      t.setScale(z.L(FRY.trayD) / t.width);
      t.shadow = S.contactShadow(t);
      trays.push(t);
      const im = S.track(S.add.image(z.X(x), z0.Y(FRY.trayY - 4), "sv2-fry-0").setScale(z.L(128) / META.fry.w * 0.85).setAngle(i % 2 ? 6 : -6).setDepth(D.item + 0.1 + i * 0.01));
      im.baseScale = im.scale;
      im.handAction = false;
      raw.push(im);
    }

    // 1. the knob: the flames come up and STAY up while it's on (S21: "low" drew its smaller ring wholly
    // under the karahi, so the fire vanished once the oil was hot). S16 / Q9: no heating ring: the oil is
    // hot, and the sizzle says it's ready. SAM-13 (A7): the knob turns the fire OFF again (the sizzle stops,
    // nothing fries), and on again. T17: Chulo bar!, then Tar!
    const cx = at.x;
    const cy = at.y;
    if (ready) await ready; // (CK-48: drawn as the view came up; the play starts once St.begin is done)
    steps.to("samosa:fire");
    await new Promise((resolve) => {
      burner.knobHit.handAction = false;
      if (z.guided) S.glow(burner.knobHit, true);
      S.tappable(burner.knobHit, () => {
        S.untap(burner.knobHit);
        S.glow(burner.knobHit, false);
        // the pulse stops BEFORE the knob turns (30 Sept: killing the knob's tweens after set() stopped its quarter
        // turn too, so the "on" knob kept its bar flat, reading as off)
        S.tweens.killTweensOf(burner.knob);
        burner.knob.setScale(1);
        burner.set("high");
        resolve();
      });
      const c = { x: burner.knobHit.x, y: burner.knobHit.y };
      z.expect({ kind: "tap", x: c.x, y: c.y, key: "knob" });
      // the knob pulses (the focal rule): it is the next thing
      burner.knob.baseScale = 1;
      S.tweens.add({ targets: burner.knob, scale: 1.1, duration: 500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });
    let sizzle = null;
    let fireOn = false;
    // shimmer on the oil: it's hot
    const shimmer = S.track(S.add.ellipse(cx, cy, oilR * 1.7, oilR * 1.7, 0xfff3c0, 0).setDepth(D.item + 0.05));
    S.tweens.add({ targets: shimmer, alpha: 0.12, duration: 700, yoyo: true, repeat: -1 });
    let post = () => {};
    const setFire = (on) => {
      fireOn = on;
      burner.set(on ? "high" : "off");
      shimmer.setVisible(on);
      if (on && !sizzle) {
        sizzle = Cook.sfx.sizzleLoop();
        S.loops.push(sizzle);
      } else if (!on && sizzle) {
        sizzle.stop();
        sizzle = null;
      }
      post();
    };
    setFire(true);
    S.tappable(burner.knobHit, () => setFire(!fireOn));
    await Cook.wait(350);

    // 2. drop them in (any order, one tap each), lift each when golden
    // places in the oil: round its middle, far enough apart that the rings don't cross
    const SPOTS = OL.at.map((d) => [OL.r * Math.cos((d * Math.PI) / 180), OL.r * Math.sin((d * Math.PI) / 180)]);
    const frying = [];
    const lifted = [];
    let bad = null;
    let slot = 0;
    const colour = (f) => {
      // raw -> light -> golden -> too dark: two layered states cross-fade
      // golden from the band's start, still golden to its end, then darkening by burnAt
      const L = f.level;
      const burn = k.burnAt || 1.15;
      let i;
      let u;
      if (L < lo * 0.5) [i, u] = [0, L / (lo * 0.5)];
      else if (L < lo) [i, u] = [1, (L - lo * 0.5) / (lo * 0.5)];
      else [i, u] = [2, Cook.clamp((L - hi) / (burn - hi), 0, 1)];
      if (f.a.texture.key !== `sv2-fry-${i}`) f.a.setTexture(`sv2-fry-${i}`);
      if (f.b.texture.key !== `sv2-fry-${i + 1}`) f.b.setTexture(`sv2-fry-${i + 1}`);
      f.b.setAlpha(u);
    };
    const fdt = clock();
    const tick = S.addTick(() => {
      const s = (fdt() / 1000) * (Cook.speed || 1);
      frying.forEach((f) => {
        if (f.out) return;
        f.level += f.rate * s * (fireOn ? 1 : 0); // the fire off: nothing fries
        colour(f);
        f.ring.draw(f.a.x, f.y0 + z.L(4), z.L(OL.size * 0.4), Math.min(1.25, f.level), lo, hi);
        // a gentle bob in the oil, and bubbles
        f.a.y = f.b.y = f.y0 + Math.sin(performance.now() / 260 + f.ph) * z.L(2);
        if (Math.random() < 0.08) {
          const bx = f.a.x + (Math.random() - 0.5) * z.L(130);
          const by = f.a.y + (Math.random() - 0.5) * z.L(100);
          const bub = S.track(S.add.circle(bx, by, z.L(3 + Math.random() * 4), 0xfffbe6, 0.7).setDepth(D.item + 0.9));
          S.tweens.add({ targets: bub, scale: 1.6, alpha: 0, duration: 420, onComplete: () => bub.destroy() });
        }
      });
      const cur = frying.filter((f) => !f.out).sort((a, b) => b.level - a.level)[0];
      if (cur) z.gauge({ level: cur.level, lo, hi });
    });
    // S20: the jharo slides in UNDER the samosa (below it, above the oil), then the samosa rides on it
    const JM = META.jharo;
    const jharo = S.track(S.add.image(0, 0, "sv3-jharo").setOrigin(JM.bx, JM.by).setDepth(D.item + 0.06).setAlpha(0));
    jharo.setScale((z.L(OL.size) * 0.6) / (JM.br * JM.w));
    jharo.handAction = false;
    let scooping = Promise.resolve();
    // the plate's flat middle: the lifted ones shuffle up to make room (S10)
    const settle = (fast = false) =>
      Promise.all(
        plateSpots(lifted.length, FRY.px, PY, plate.flatHalf, 0.84).map((sp, i) => {
          const l = lifted[i];
          const sc = z.L(sp.w) / 370;
          return new Promise((r) => S.tweens.add({ targets: [l.im, l.b], x: z.X(sp.x), y: z.Y(sp.y), scale: sc, angle: sp.a, duration: fast ? 1 : 280, onComplete: r }));
        }),
      );
    const liftLine = Lang.hasLine("lift") ? Lang.line("lift", Lang.phrase(["ph-samosa"])) : null;
    await new Promise((resolveAll) => {
      post = () => {
        const waiting = raw.filter((r) => !r.gone);
        const cur = frying.filter((f) => !f.out).sort((a, b) => b.level - a.level)[0];
        if (!waiting.length && !cur) return resolveAll();
        // T17: the fire off -> Chulo bar!; a golden one at level 3 -> "Samosa hane kadh."; else Tar!
        if (!fireOn) {
          steps.to("samosa:fire", { id: "fire-again" });
          return z.expect({ kind: "tap", x: burner.knobHit.x, y: burner.knobHit.y, key: "knob" });
        }
        if (cur && cur.level >= lo && level >= 3 && liftLine) steps.to("samosa:lift", { id: `lift-${frying.indexOf(cur)}`, line: liftLine });
        else steps.to("samosa:fry", { id: "fry" });
        // the next thing pulses: a raw one while there's room, else the samosa furthest on
        if (cur && (cur.level >= lo || !waiting.length)) z.expect({ kind: "timing", x: cur.a.x, y: cur.a.y, key: "lift" });
        else if (waiting.length) z.expect({ kind: "tap", x: waiting[0].x, y: waiting[0].y, key: "samosa" });
        else z.expect({ kind: "wait" });
      };
      const addRaw = (im) => {
        S.tweens.add({ targets: im, scale: im.baseScale * 1.06, duration: 520, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        S.tappable(im, async () => {
          if (im.gone) return;
          im.gone = true;
          S.untap(im);
          S.tweens.killTweensOf(im);
          const [sx, sy] = SPOTS[slot++ % SPOTS.length];
          // the empty thalis leave the band (the plate slides over it at serving)
          if (raw.every((r) => r.gone)) trays.forEach((t) => S.tweens.add({ targets: [t, t.shadow].filter(Boolean), alpha: 0, duration: 500, delay: 400 }));
          const tx = cx + sx * oilR;
          const ty = cy + sy * oilR;
          Cook.sfx.whoosh();
          await S.fly(im, tx, ty, { scale: FS * 0.92, duration: 380, arc: z.L(120) });
          Cook.sfx.sizzle(0.6);
          S.puff(tx, ty, 0xfff1c0, z.L(40));
          const b = S.track(S.add.image(tx, ty, "sv2-fry-1").setScale(FS * 0.92).setAngle(im.angle).setDepth(im.depth + 0.001).setAlpha(0));
          b.handAction = false;
          const f = { a: im, b, level: 0, rate: Cook.pick([].concat(k.rate || [0.13, 0.18])) || 0.15, y0: ty, ph: Math.random() * 6, ring: Kit.heatRing(S, { width: z.L(7) }), out: false };
          if (Array.isArray(k.rate)) f.rate = k.rate[0] + Math.random() * (k.rate[1] - k.rate[0]);
          frying.push(f);
          const lift = async () => {
            if (f.out) return;
            const L = f.level;
            const verdict = L < lo ? "light" : L > (k.burnAt || 1.15) ? "dark" : "golden";
            if (verdict !== "golden") {
              if (!f.scored) bad = bad || (verdict === "light" ? "lifted a samosa before it was golden" : "a samosa went too dark");
              // decision 51: a pale one goes back into the oil to finish; a burnt one is swapped for a fresh one to fry
              // (the third wrong lift is taken as it is)
              if (redo.wrong("samosa:fry").action !== "show") {
                f.scored = true;
                if (Cook.roundLevel(ctx) <= 1) Cook.oops(ctx);
                if (verdict === "light") {
                  S.tweens.add({ targets: [im, b], y: f.y0 - z.L(18), duration: 140, yoyo: true });
                  f.help = true;
                  post();
                  return;
                }
                f.out = true;
                f.ring.destroy();
                S.untap(im);
                S.untap(b);
                S.tweens.add({ targets: [im, b], alpha: 0, duration: 360, onComplete: () => (im.destroy(), b.destroy()) });
                const tr = trays.find((t) => t.alpha < 0.5) || trays[0];
                S.tweens.add({ targets: [tr, tr.shadow].filter(Boolean), alpha: 1, duration: 300 });
                const fresh = S.track(S.add.image(tr.x, tr.y - z.L(4), "sv2-fry-0").setScale(z.L(128) / META.fry.w * 0.85).setDepth(D.item + 0.1));
                fresh.baseScale = fresh.scale;
                fresh.handAction = false;
                raw.push(fresh);
                addRaw(fresh);
                post();
                return;
              }
            }
            f.out = true;
            f.ring.destroy();
            S.untap(im);
            S.untap(b);
            z.skill(verdict === "golden" ? 100 : verdict === "light" ? 55 : k.burntScore || 40, "fry");
            // the next thing to do moves on at once (it stopped frying the moment it was tapped)
            post();
            // one jharo: a second lift waits for the first scoop to finish
            const prev = scooping;
            let done;
            scooping = new Promise((r) => (done = r));
            await prev;
            // it stops frying where it is (the bob stops), the jharo slides in under it
            const sx0 = im.x;
            const sy0 = f.y0;
            im.y = b.y = sy0;
            // (turned so its handle hangs down over the band, never off the view's right edge by the plate)
            jharo.setPosition(sx0 + z.L(60), sy0 + z.L(210)).setAngle(30).setAlpha(0);
            await new Promise((r) => S.tweens.add({ targets: jharo, x: sx0, y: sy0 + z.L(6), alpha: 1, duration: 180, ease: "Quad.easeOut", onComplete: r }));
            Cook.sfx.pop();
            // onto the plate: the samosa rides on the jharo's bowl
            lifted.push({ im, b, verdict });
            const sp = plateSpots(lifted.length, FRY.px, PY, plate.flatHalf, 0.84)[lifted.length - 1];
            const sc = z.L(sp.w) / 370;
            const dur = 440;
            const arc = z.L(110);
            await Promise.all([S.fly(im, z.X(sp.x), z.Y(sp.y), { scale: sc, duration: dur, arc }), S.fly(b, z.X(sp.x), z.Y(sp.y), { scale: sc, duration: dur, arc }), S.fly(jharo, z.X(sp.x), z.Y(sp.y) + z.L(6), { duration: dur, arc })]);
            im.setAngle(sp.a);
            b.setAngle(sp.a);
            // it tips the samosa off and goes back down to the oil's side, out of the way
            S.tweens.add({ targets: jharo, x: jharo.x + z.L(40), y: jharo.y + z.L(170), alpha: 0, duration: 260, ease: "Quad.easeIn" });
            await settle();
            if (verdict === "golden") S.sparkle(im.x, im.y);
            done();
            post();
          };
          S.tappable(im, lift);
          S.tappable(b, lift);
          post();
        });
      };
      raw.forEach(addRaw);
      post();
      // re-post as the samosas cross into golden (the lift becomes the next thing)
      const again = S.addTick(() => {
        const cur = frying.filter((f) => !f.out).sort((a, b) => b.level - a.level)[0];
        if (cur && cur.level >= lo && !cur.posted) {
          cur.posted = true;
          post();
        }
        if (raw.every((r) => r.gone) && frying.every((f) => f.out)) again();
      });
    });
    await scooping;
    tick();
    z.gauge(null);
    z.expect({ kind: "wait" });
    post = () => {};
    setFire(false);
    steps.done();
    shimmer.destroy();
    await Cook.wait(300);
    return { lifted: lifted.map((l) => l.verdict), bad, plate: { img: plate, items: lifted.flatMap((l) => [l.im, l.b]) } };
  }

  /* ---------- serve and taste (§14a) ---------- */
  async function serve(z, { who, plate, ok, last }) {
    const S = z.S;
    const ctx = z.ctx;
    z.expect({ kind: "wait" });
    // the review (X10 / Q1): their big round face over the plate, no body, no pretend eating
    // (over the plate itself, a little above its middle; Kit.review keeps it inside the view)
    const pr = (plate.img.displayWidth || z.L(FRY.pd)) / 2;
    const look = await Cook.Kit.review(S, { who, ok: ok || last, x: plate.img.x, y: plate.img.y - pr * 0.18, size: z.L(250), k: z.L(1) });
    if (ok || last) {
      await Cook.wait(300);
      await look.close();
      return true;
    }
    // not quite: the card starts again, they say their order again, the plate comes back empty
    cardAgain(ctx);
    const line = orderLine(ladderOf(ctx));
    if (line) await Promise.race([St.customerSay(ctx, line, { hide: St.hideKnown(ctx) }), Cook.wait(9000)]);
    St.customerDone();
    plate.items.forEach((o) => S.tweens.add({ targets: o, alpha: 0, duration: 300 }));
    await look.close();
    await Cook.wait(120);
    return false;
  }

  Mech.lab("samosa", {
    name: "Samosa",
    verb: "Fill, fold, fry",
    async run(L) {
      const R = Cook.Recipes;
      const who = (L.ctx.order && L.ctx.order.who) || "nana";
      let d = R.samosa.make(who, { level: L.level });
      // (Cook.samosaTwo: build/shoot_samosa_v3.py asks for an order with two kinds, from level 3)
      for (let i = 0; Cook.samosaTwo != null && L.level >= 3 && !d.count2 === !!Cook.samosaTwo && i < 40; i++) d = R.samosa.make(who, { level: L.level });
      L.card(d, R.samosa.steps(d));
      // s08 w6B (CK-48: the combined host opens the worktop before the station loads its pictures): they load while the
      // order's card is read (every filling's heap the round can offer, this station's own art only)
      const heaps = [...new Set([].concat(Object.keys(d.fillings || {}), Object.keys(d.fillings2 || {}), Cook.data.recipes.samosa.lists.fillings_all || []))].filter(heapUrl);
      const kit = Cook.Kit ? Cook.Kit.faceArt(who).concat(Cook.Kit.art(1, [], { wide: true })) : [];
      await St.loadArt(L.S, BASE_ART().concat(heaps.map((id) => [`sv3-heap-${id}`, heapUrl(id)]), kit)).catch(() => {});
      await L.station("samosa", { fillings: d.fillings, exclude: d.no, decoyPool: Cook.data.recipes.samosa.lists.fillings_all, count: d.count, fillings2: d.fillings2, count2: d.count2, who });
    },
  });
})(window);
