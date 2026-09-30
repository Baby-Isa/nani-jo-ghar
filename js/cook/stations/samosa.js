/*
 * Combined station: Samosa v3, fill, fold, fry (docs/design/cook-design-system-v1.md §15; the chai v2 grid
 * §3, §4, §10; the kitchen kit §13; serve and taste §14a; the 29 Sept play-test, S1-S21 and Q2, Q3, Q9).
 *
 * THREE JOBS, one at a time, each on the whole picture:
 *  1. FILL: a flat pastry strip lies on the house board (S6). The fillings sit on the shelf band (the
 *     bottom 26%) as top-down heaps, no bowls (S2 / Q2), a `🔊 word` chip under each (tap the heap = use
 *     it, tap the chip = hear it; from level 3 the word hides and the speaker stays). Each tap drops ONE
 *     spoonful on the strip's left end and its word pops with the family clip. Nothing is refused: tap the
 *     tick when it's right (it's graded then: how many spoons of each, and nothing they said no to).
 *  2. FOLD: keep the SWIPE (Zafar: "different and should feel satisfying"). S8, S11 / Q3 (Zafar's answer):
 *     the filling sits on the flat strip, the FIRST fold hides it, and every stage is a fixed picture
 *     (assets/cook/items/v3/samosa/fold-1…6, one registered canvas). Three swipes, left to right, each
 *     wiping the next picture(s) in over the last as the finger goes (1->2, 2->3->4, 4->5->6); a soft glow
 *     shows the part that folds next; let go past the swipe's minLen and it snaps to its last picture.
 *     The finished samosa's word pops and it goes onto the plate's flat middle (S10). Make as many as they
 *     asked for (each new strip gets the same filling: an order has one filling for all its samosas),
 *     then the phase button takes them to the karahi. The count is theirs, graded there.
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
 *    them again (fill first). Only the first try counts (the ear star, the end review). At most three tries.
 * The card (the shared order card, §12): the fillings' rows count up as spoons go in and tick when the fill
 * closes (UX 11, right or not); then the card folds to face + headline, no ✓ (the phase fold, §13: "ba
 * samosa" lives only in the headline) until the plate is tasted, when it opens (and its ✓ shows).
 *
 * Levels (data/cook.json's samosa recipe slots; the fill's decoys and the fry's speed in data.mechanics):
 * 1 = one or two samosas, one decoy, words on the chips; 2 = more decoys; 3 = a "don't" filling, speaker-only
 * chips; 4 = as 3 (the fry's speed and band tighten by level in data.mechanics.fry).
 * Art: assets/cook/items/v3/samosa/ (build/cut_cook_v3.py; the numbers below are its meta.json, checked
 * by build/check_vessel_meta.py), the fry states from assets/cook/items/samosa-v2/, the kit's wide hob,
 * knob and flames (js/cook/kitchen-kit.js). Shots: build/shoot_samosa_v3.py.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const V2 = "assets/cook/items/samosa-v2/";
  const V3 = "assets/cook/items/v3/samosa/";
  // what build/cut_cook_v3.py measured (assets/cook/items/v3/samosa/meta.json; fractions of each sprite)
  const META = {
    // 29 Sept (S8, S11, Q3): six fixed fold pictures on ONE canvas, registered on the strip's right end.
    // The filling lands on the flat strip's left end (fill: centre, radius as a fraction of the width);
    // the first fold's triangle hides it. Three swipes, each wiping to the next picture(s), left to right:
    // steps (pictures, 1-based), sweep (where the wipe's edge travels, x fractions), from/to (the swipe),
    // glow (the part that folds next: x0, y0, x1, y1).
    fold: {
      w: 517,
      h: 297,
      fill: { x: 0.175, y: 0.655, r: 0.1 },
      swipes: [
        { steps: [1, 2], sweep: [0.03, 0.46], from: [0.14, 0.66], to: [0.46, 0.66], glow: [0.048, 0.43, 0.34, 0.87] },
        { steps: [2, 3, 4], sweep: [0.03, 0.62], from: [0.2, 0.66], to: [0.6, 0.66], glow: [0.05, 0.36, 0.42, 0.9] },
        { steps: [4, 5, 6], sweep: [0.1, 0.99], from: [0.3, 0.66], to: [0.9, 0.66], glow: [0.11, 0.26, 0.6, 0.94] },
      ],
      // the finished samosa (fold-6): its own middle and width on the canvas (it flies to the plate by it)
      done: { x: 0.7, y: 0.401, w: 274 },
    },
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
  const HEAP_ART = { "veg-12": "assets/cook/items/v3/daar/chop-heap-chilli.webp" };
  const heapUrl = (id) => HEAP_ART[id] || (HEAP[id] ? `${V3}fill-${HEAP[id]}.webp` : null);
  /* ---------- the grid (design px, 1600x900), chai v2's ---------- */
  const SHELF_TOP = 666;
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  const HEAP_Y = 758;
  const CHIP_Y = 860;
  const PITCH = 150;
  const HEAP_W = 128;
  // the house board (S6): board.webp is 1397 x 847
  const BOARD = { x: 720, y: 338, w: 820, h: 820 * (847 / 1397) };
  const STAGE_K = 1.42; // design px per fold-canvas px
  const PLATE = { x: 1345, y: 400, d: 340 };
  // the fry (S17, S19, Q9): the wide hob (one big burner) with the karahi ~1.4x its old size (body r 180 ->
  // 250: at 270 its rim ran over the hob's knob), and the plate right of the hob. The hob (937 x 568 at
  // k 1, its burner in the middle; its knob 0.469 h below the burner, clear of the rim) centred on bx, the
  // plate just clear of its right edge: 66 ... 1134, 1140 ... 1480.
  const FRY = { hobK: 1.14, bx: 600, r: 250, px: 1310, pd: 340, trayY: 772, trayD: 150, trayPitch: 180 };
  // a samosa in the oil (design px wide) and where they float (degrees round the middle, radius / the oil's):
  // fewer samosas, bigger and further apart
  const OIL = (n) => (n <= 3 ? { size: 180, r: 0.5, at: [-90, 30, 150] } : n <= 4 ? { size: 165, r: 0.55, at: [-135, -45, 45, 135] } : { size: 145, r: 0.62, at: [-90, 30, 150, -30, 90, 210] });
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
    const pool = p.pool || St.decoys(p.decoyPool || [], kinds.concat(kinds2, exclude), St.knobInt(kFill.decoys), kFill.decoyPick).filter((id) => heapUrl(id));
    const ids = Cook.shuffle([...new Set(pool.concat(kinds, count2 ? kinds2 : [], exclude))]);
    if (Cook.Coach) Cook.Coach.stop(false); // not "seen": the fill's own begin shows it (data.onboard.samosa)
    // the art loads while the order card is up (a slow phone mustn't meet an empty scene)
    const art = [
      ["sv3-board", V3 + "board.webp"],
      ["sv3-plate", V3 + "plate.webp"],
      ["sv3-karahi", V3 + "karahi.webp"],
      ["sv3-jharo", V3 + "jharo.webp"],
      ["sv2-thali", "assets/cook/items/vessel-thali-t.png"],
    ]
      .concat([1, 2, 3, 4, 5, 6].map((i) => [`sv3-fold-${i}`, `${V3}fold-${i}.webp`]))
      .concat([0, 1, 2, 3].map((i) => [`sv2-fry-${i}`, `${V2}fry-${i}.webp`]))
      .concat(ids.filter(heapUrl).map((id) => [`sv3-heap-${id}`, heapUrl(id)]))
      .concat(Cook.Kit ? Cook.Kit.faceArt(who) : [])
      // the wide hob (S19): one big burner, landscape; the karahi is this station's own (v3, 1.5x)
      .concat(Cook.Kit ? Cook.Kit.art(1, [], { wide: true }) : []);
    await Promise.race([St.load(S, art), Cook.wait(12000)]);

    let first = null; // the first try's verdict (only it counts)
    let result = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      /* ---------- 1 + 2: fill and fold ---------- */
      // the fill and the fold: the first time, the coach shows each move (X11: data.onboard.samosa)
      await St.begin(S, ctx, "samosa", "marble");
      if (phases.fill && !attempt) UI.gist(phases.fill);
      if (ctx.nextStep) ctx.nextStep("Fill");
      const fz = Mech.zone(S, ctx, { id: "fill", level });
      const made = await fillFold(fz, { ids, want, kinds, exclude, count, want2, kinds2, count2, level, phases, retry: attempt > 0 });
      fz.close();
      St.end();

      /* ---------- 3: fry, then serve and taste ---------- */
      // the fry: its first-time coach runs (X11: data.onboard.fry; it used to be switched off here)
      await St.begin(S, ctx, "fry", "marble");
      if (phases.fry && !attempt) UI.gist(phases.fry);
      if (ctx.nextStep) ctx.nextStep("Fry");
      const yz = Mech.zone(S, ctx, { id: "fry", level });
      const fried = await fry(yz, { n: made.n, level });
      // the verdict: the filling, the count, and nothing raw or burnt on the plate
      const countWrong = made.two ? (made.nA !== count || made.nB !== count2 ? `made ${made.nA} and ${made.nB}, they asked for ${count} and ${count2}: ph-samosa` : null) : made.n !== count ? `made ${made.n}, they asked for ${count}: ph-samosa` : null;
      const why = made.fillWrong || countWrong || fried.bad;
      if (!first) {
        first = { ok: !why, why };
        // the fill has already been heard (graded at its tick): here the count and the frying
        const later = why && why !== made.fillWrong ? why : null;
        if (later) yz.listen(false, later);
        const nOne = made.two ? made.nA : made.n;
        if (!ctx.guided && count <= 5) (nOne === count ? Cook.markRight : Cook.markMiss)(Cook.numId(count));
        if (nOne !== count) UI.mission.missItem("ph-samosa", ctx.dishAt || 0, { counted: true, block: made.two ? 1 : null });
        if (made.two && !ctx.guided && count2 <= 5) (made.nB === count2 ? Cook.markRight : Cook.markMiss)(Cook.numId(count2));
      }
      const ok = await serve(yz, { who, plate: fried.plate, ok: !why, last: attempt >= 2 });
      yz.close();
      St.end();
      result = { count: made.n, fillings: made.got, fried: fried.lifted, fillings2: made.got2 || null };
      cardFold(false);
      if (ok) break;
    }
    ctx.result.samosa = result;
    ctx.result.fillings = result && result.fillings;
    ctx.result.folded = result && result.count;
    if (ctx.closeItem) ctx.closeItem(["ph-samosa"]);
    return result;
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
    S.tweens.add({ targets: c, alpha: 1, scale: z.k, y: y - z.L(18), duration: 200, ease: "Back.easeOut" });
    S.tweens.add({ targets: c, alpha: 0, y: y - z.L(46), delay: ms, duration: 320, onComplete: () => c.destroy() });
    if (UI.naniMuted && UI.naniMuted()) return Promise.resolve();
    const talk = speakId ? Lang.speakWord(speakId) : line ? Lang.speak(line) : null;
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
    const w = Math.min(half * 1.15, cw * 0.94, (chh / aspect) * 0.94);
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

  /* ---------- 1 + 2: fill the pastry, then fold it (and more of them) ---------- */
  async function fillFold(z, { ids, want, kinds, exclude, count, want2 = {}, kinds2 = [], count2 = 0, level, phases, retry }) {
    // the scene pieces are raised into the middle of a taller stage's worktop (the stage fill); the shelf band keeps z0
    const z0 = z;
    z = Cook.liftZone(z0);
    const S = z.S;
    const ctx = z.ctx;
    const k = Mech.knobs("fold", { level });
    backdrop(z0, S);
    // the house board (S6)
    const board = S.track(S.add.image(z.X(BOARD.x), z.Y(BOARD.y), "sv3-board").setDepth(D.item - 2));
    board.setDisplaySize(z.L(BOARD.w), z.L(BOARD.h));
    board.shadow = S.contactShadow(board);
    // the plate the folded samosas wait on (right of the board; S10: on its flat middle)
    const plate = plateAt(z, S, PLATE.x, PLATE.y, PLATE.d);
    const items = shelf(z0, S, ids, level);
    const F = META.fold;
    const SW = F.w * STAGE_K;
    const SH = F.h * STAGE_K;
    // a fold-canvas point (fractions) in world px, for a strip centred at (cx, cy) design px
    const at = (cx, cy, fx, fy) => ({ x: z.X(cx - SW / 2 + fx * SW), y: z.Y(cy - SH / 2 + fy * SH) });
    const P0 = { x: BOARD.x, y: BOARD.y + 6 };

    /* the strip: its fold picture, and a canvas that wipes to the next one as the finger swipes */
    function pastry(x) {
      const img = S.track(S.add.image(z.X(x), z.Y(P0.y), "sv3-fold-1").setDepth(D.item));
      img.setScale(z.L(STAGE_K));
      img.blobs = [];
      return img;
    }
    const W = F.w;
    const H = F.h;
    const foldKey = "sv3-foldcv";
    if (S.textures.exists(foldKey)) S.textures.remove(foldKey);
    const cv = S.textures.createCanvas(foldKey, W, H);
    const fimg = S.track(S.add.image(z.X(P0.x), z.Y(P0.y), foldKey).setDepth(D.item + 0.5).setScale(z.L(STAGE_K)).setVisible(false));
    const mk = () => {
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      return c;
    };
    const offA = mk();
    const offB = mk();
    /**
     * One swipe's picture at t (0-1): the fixed fold pictures in turn, each wiping in over the last from
     * the left as the fold rolls right (a soft edge and a crease shadow on it). Before the first fold the
     * filling is drawn on the flat strip, so the first picture's triangle covers it.
     */
    function drawFold(sw, t, blobs = []) {
      const n = sw.steps.length - 1;
      const seg = Math.min(n - 1, Math.floor(t * n));
      const u = Cook.clamp(t * n - seg, 0, 1);
      const oldImg = S.textures.get(`sv3-fold-${sw.steps[seg]}`).getSourceImage();
      const newImg = S.textures.get(`sv3-fold-${sw.steps[seg + 1]}`).getSourceImage();
      const edge = (sw.sweep[0] + (sw.sweep[1] - sw.sweep[0]) * u) * W;
      const fe = 0.07 * W;
      const grad = (g) => {
        const gr = g.createLinearGradient(edge - fe, 0, edge, 0);
        gr.addColorStop(0, "rgba(0,0,0,1)");
        gr.addColorStop(1, "rgba(0,0,0,0)");
        return gr;
      };
      const a = offA.getContext("2d");
      a.globalCompositeOperation = "source-over";
      a.clearRect(0, 0, W, H);
      a.drawImage(oldImg, 0, 0);
      if (seg === 0)
        blobs.forEach((bl) => {
          const img = bl.texture.getSourceImage();
          const bx = (bl.x - fimg.x) / fimg.scaleX + W / 2;
          const by = (bl.y - fimg.y) / fimg.scaleY + H / 2;
          a.save();
          a.translate(bx, by);
          a.rotate((bl.angle * Math.PI) / 180);
          a.drawImage(img, -bl.displayWidth / fimg.scaleX / 2, -bl.displayHeight / fimg.scaleY / 2, bl.displayWidth / fimg.scaleX, bl.displayHeight / fimg.scaleY);
          a.restore();
        });
      a.globalCompositeOperation = "destination-out";
      a.fillStyle = grad(a);
      a.fillRect(0, 0, W, H);
      const b = offB.getContext("2d");
      b.globalCompositeOperation = "source-over";
      b.clearRect(0, 0, W, H);
      b.drawImage(newImg, 0, 0);
      b.globalCompositeOperation = "destination-in";
      b.fillStyle = grad(b);
      b.fillRect(0, 0, W, H);
      const c = cv.getContext();
      c.save();
      c.clearRect(0, 0, W, H);
      c.drawImage(offA, 0, 0);
      c.globalCompositeOperation = "lighter";
      c.drawImage(offB, 0, 0);
      // the crease: a soft shadow just behind the rolling edge, on the pastry only
      c.globalCompositeOperation = "source-atop";
      const sh = c.createLinearGradient(edge - fe, 0, edge + fe * 0.6, 0);
      const d = 0.2 * Math.sin(Math.PI * u);
      sh.addColorStop(0, "rgba(60,35,10,0)");
      sh.addColorStop(0.55, `rgba(60,35,10,${d})`);
      sh.addColorStop(1, "rgba(60,35,10,0)");
      c.fillStyle = sh;
      c.fillRect(0, 0, W, H);
      c.restore();
      cv.refresh();
    }

    /* a spoonful: a little heap lifts off its pile and lands on the strip's left end (the first fold covers it) */
    const fillAt = (sheet) => {
      const f = F.fill;
      return { x: sheet.x + (f.x - 0.5) * SW * z.k, y: sheet.y + (f.y - 0.5) * SH * z.k, r: f.r * SW * z.k };
    };
    async function spoon(sheet, id, { quiet = false, fast = false } = {}) {
      const obj = items[id];
      const key = S.textures.exists(`sv3-heap-${id}`) ? `sv3-heap-${id}` : S.tex(`layer:${id}`);
      const from = obj ? { x: obj.x, y: obj.y - obj.displayHeight * 0.2 } : { x: z.X(800), y: z.Y(700) };
      if (obj && !fast) S.tweens.add({ targets: obj, scale: obj.baseScale * 1.08, duration: 90, yoyo: true });
      const b = S.track(S.add.image(from.x, from.y, key).setDepth(D.fx));
      const pa = fillAt(sheet);
      // 30 Sept: ONE little mound per filling on the strip's end, side by side, so every filling that went in
      // shows (a big mound per spoon hid the ones under it: only the last showed). Another spoon of the
      // same filling grows its mound; the first fold still covers them all.
      let own = sheet.blobs.find((o) => o.wordId === id);
      const kinds = sheet.blobs.map((o) => o.wordId).concat(own ? [] : [id]);
      const spots = mounds(pa, kinds.length);
      const place = (o, sp, ms) => {
        const size = sp.size * Math.min(1.3, 1 + 0.1 * ((o.spoons || 1) - 1));
        if (!ms) return o.setPosition(sp.x, sp.y).setDisplaySize(size, size * 0.96);
        S.tweens.add({ targets: o, x: sp.x, y: sp.y, displayWidth: size, displayHeight: size * 0.96, duration: ms });
      };
      sheet.blobs.forEach((o) => o !== own && place(o, spots[kinds.indexOf(o.wordId)], fast ? 200 : 300));
      const at = spots[kinds.indexOf(id)];
      b.setDisplaySize(at.size * 0.6, at.size * 0.6);
      if (!quiet) Cook.sfx.pop();
      await S.fly(b, at.x, at.y - z.L(40), { duration: fast ? 260 : 380, arc: z.L(110) });
      await new Promise((r) => S.tweens.add({ targets: b, y: at.y, displayWidth: at.size * 0.9, displayHeight: at.size * 0.86, duration: 140, ease: "Quad.easeIn", onComplete: r }));
      if (!quiet) S.puff(at.x, at.y, St.color(((Cook.data.words[id] || {}).layer || {}).color || "#f3e3b0"), z.L(26));
      if (own) {
        // the spoonful joins its own mound, which grows a little
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
    /** Where m fillings' mounds sit on the strip's end (world px): one big, two side by side, or a ring. */
    function mounds(pa, m) {
      if (m <= 1) return [{ x: pa.x, y: pa.y, size: pa.r * 1.8 }];
      if (m === 2) return [-1, 1].map((k) => ({ x: pa.x + k * pa.r * 0.5, y: pa.y, size: pa.r * 1.25 }));
      return Array.from({ length: m }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / m;
        return { x: pa.x + Math.cos(a) * pa.r * 0.55, y: pa.y + Math.sin(a) * pa.r * 0.45, size: pa.r * (m <= 4 ? 1.1 : 0.95) };
      });
    }

    /* ---------- FILL ---------- */
    let sheet = pastry(P0.x);
    S.tweens.add({ targets: sheet, alpha: { from: 0, to: 1 }, duration: 250 });
    // 30 Sept: two different samosas in one order (count2, want2): block 1 is filled first; once its
    // samosas are made, the next strip starts EMPTY and block 2 is filled on it (then pre-filled as usual)
    const two = count2 > 0 && kinds2.length > 0;
    const bOpt = (b) => (two ? { block: b } : {});
    /** Fill one strip for one block, then grade it (how many spoons of each, nothing they said no to). */
    async function fillOne(wantB, kindsB, block) {
      const got = {};
      const order = [];
      let last = 0;
      for (;;) {
        const next = kindsB.find((id) => (got[id] || 0) < wantB[id]) || null;
        const r = await St.freePick(z, { items, next, doneOk: order.length > 0, doneGlow: ctx.guided && !next });
        if (r.done) break;
        if (performance.now() - last < 220) continue; // a double tap
        last = performance.now();
        const id = r.id;
        got[id] = (got[id] || 0) + 1;
        order.push(id);
        // a count row counts up; nothing ticks before the fill closes (a one-spoon row ticking at its
        // first spoon would give the count away, UX 11)
        if ((wantB[id] || 0) > 1) UI.mission.tickItem(id, ctx.dishAt || 0, bOpt(block));
        const into = spoon(sheet, id);
        const pa = fillAt(sheet);
        // 29 Sept (Q7): at level 1 the count is heard as you add ("ba chundo"), else the word
        const cnt = (level || z.level) <= 1 && UI.tallyLine ? UI.tallyLine(got[id], id) : null;
        pop(z, S, cnt ? Lang.plain(cnt) : Cook.display(id), pa.x, pa.y - z.L(150), cnt ? { line: cnt, ms: 1200 } : { speakId: id, ms: 1200 });
        await into;
        z.progress({ filled: id, n: got[id] });
      }
      // graded now: each filling, how many spoons, and nothing they said no to
      let fillWrong = null;
      Object.keys(got).forEach((id) => {
        if (wantB[id]) return;
        fillWrong = fillWrong || (exclude.includes(id) ? `put ${id} in (they said no)` : `put ${id} in`);
        if (!retry && exclude.includes(id)) UI.mission.missItem(id, ctx.dishAt || 0, { no: true });
      });
      kindsB.forEach((id) => {
        const g = got[id] || 0;
        const right = g === wantB[id];
        if (!right) {
          fillWrong = fillWrong || `spooned ${g}, they asked for ${wantB[id]}: ${id}${two ? ` (samosa ${block})` : ""}`;
          if (!retry) UI.mission.missItem(id, ctx.dishAt || 0, Object.assign({ counted: true }, bOpt(block)));
        }
        if (!ctx.guided && !retry) {
          (right ? Cook.markRight : Cook.markMiss)(id);
          if (wantB[id] <= 5) (right ? Cook.markRight : Cook.markMiss)(Cook.numId(wantB[id]));
        }
      });
      if (!retry) z.listen(!fillWrong, fillWrong || "filled");
      if (two) UI.mission.closeItem(kindsB, ctx.dishAt || 0, { block });
      else if (ctx.closeItem) ctx.closeItem(kindsB);
      else UI.mission.closeItem(kindsB, ctx.dishAt || 0);
      if (!fillWrong && exclude.length && (!two || block === 2)) UI.mission.closeItem(exclude, ctx.dishAt || 0, { no: true });
      return { got, order, fillWrong };
    }
    const f1 = await fillOne(want, kinds, 1);
    const got = f1.got;
    let order = f1.order;
    let fillWrong = f1.fillWrong;
    let got2 = null;
    Cook.sfx.right();
    const pa0 = fillAt(sheet);
    S.sparkle(pa0.x, pa0.y);
    // the card folds until the plate is tasted; the shelf goes quiet: folding is next
    await Cook.wait(500);
    cardFold(true);
    Object.values(items).forEach((o) => S.tweens.add({ targets: [o, o.chip], alpha: 0.35, duration: 300 }));
    if (ctx.nextStep) ctx.nextStep("Fold");
    if (phases.fold && !retry) UI.gist(phases.fold);

    /* ---------- FOLD: swipe each flap over; a soft glow shows the next swipe ---------- */
    const glowG = S.track(S.add.graphics().setDepth(D.fx - 1).setBlendMode(Phaser.BlendModes.ADD));
    let glowT = 0;
    let glowOn = null;
    const gdt = clock();
    const stopGlowTick = S.addTick(() => {
      const dt = gdt();
      glowG.clear();
      if (!glowOn) return;
      glowT += dt / 1000;
      const { poly, a, b } = glowOn;
      // the flap's edge glows (a soft gold light, breathing), and a light travels the way it folds
      const pulse = 0.5 + 0.5 * Math.sin(glowT * 4);
      const outline = () => {
        glowG.beginPath();
        poly.forEach((p, i) => (i ? glowG.lineTo(p.x, p.y) : glowG.moveTo(p.x, p.y)));
        glowG.closePath();
      };
      glowG.fillStyle(0xffffff, 0.04 + 0.06 * pulse);
      outline();
      glowG.fillPath();
      [[z.L(22), 0.1], [z.L(12), 0.2], [z.L(5), 0.55]].forEach(([w, al]) => {
        glowG.lineStyle(w, INK.glow, al * (0.6 + 0.4 * pulse));
        outline();
        glowG.strokePath();
      });
      const u = 0.15 + ((glowT * 0.6) % 1) * 0.85;
      for (let i = 0; i < 10; i++) {
        const v = u - i * 0.03;
        if (v < 0 || v > 1) continue;
        const e = Math.sin(Math.PI * v);
        glowG.fillStyle(0xffe7a8, 0.3 * e * (1 - i / 10));
        glowG.fillCircle(a.x + (b.x - a.x) * v, a.y + (b.y - a.y) * v, z.L(16 - i * 1.1));
      }
    });
    let n = 0;
    let nA = 0; // (two kinds: how many of each were made)
    let nB = 0;
    let second = false; // folding the second kind now
    const total = count + (two ? count2 : 0);
    const most = total + (k.maxExtra != null ? k.maxExtra : 3);
    const onPlate = [];
    let quit = false;
    while (n < most && !quit) {
      if (n > 0) {
        // the next strip slides in, and the same filling goes on it (the same spoons, said quietly)
        sheet = pastry(P0.x - 700);
        sheet.setAlpha(0);
        await new Promise((r) => S.tweens.add({ targets: sheet, x: z.X(P0.x), alpha: 1, duration: 380, ease: "Cubic.easeOut", onComplete: r }));
        if (two && !second && n === count) {
          // the second kind: this strip starts empty, and it's filled from the shelf (its own block on the card)
          second = true;
          cardFold(false);
          Object.values(items).forEach((o) => S.tweens.add({ targets: [o, o.chip], alpha: 1, duration: 250 }));
          if (ctx.nextStep) ctx.nextStep("Fill");
          const f2 = await fillOne(want2, kinds2, 2);
          got2 = f2.got;
          order = f2.order;
          fillWrong = fillWrong || f2.fillWrong;
          Cook.sfx.right();
          await Cook.wait(400);
          cardFold(true);
          Object.values(items).forEach((o) => S.tweens.add({ targets: [o, o.chip], alpha: 0.35, duration: 300 }));
          if (ctx.nextStep) ctx.nextStep("Fold");
        } else for (const id of order) await spoon(sheet, id, { quiet: true, fast: true });
      }
      for (let f = 0; f < F.swipes.length; f++) {
        const sw = F.swipes[f];
        const cxy = { x: (sheet.x - z.X(P0.x)) / z.k + P0.x, y: P0.y };
        const [gx0, gy0, gx1, gy1] = sw.glow;
        const poly = [at(cxy.x, cxy.y, gx0, gy0), at(cxy.x, cxy.y, gx1, gy0), at(cxy.x, cxy.y, gx1, gy1), at(cxy.x, cxy.y, gx0, gy1)];
        const from = at(cxy.x, cxy.y, sw.from[0], sw.from[1]);
        const to = at(cxy.x, cxy.y, sw.to[0], sw.to[1]);
        glowOn = { poly, a: from, b: to };
        const offerGo = n > 0 && f === 0;
        const r = await swipe(z, S, {
          onDrag: () => (glowOn = null), from, to, draw: (t) => drawFold(sw, t, f === 0 ? sheet.blobs : []), fimg, sheet, offerGo, goLabel: phases.go || "fry them", expectGo: offerGo && n >= total, glowGo: offerGo && ctx.guided && n >= total, minLen: k.minLen || 0.45 });
        glowOn = null;
        if (r === "go") {
          quit = true;
          break;
        }
        // the snap: the fold's last picture, a little pop, a click (the first fold has hidden the filling)
        if (f === 0) sheet.blobs.forEach((b) => b.destroy());
        if (f === 0) sheet.blobs = [];
        sheet.setTexture(`sv3-fold-${sw.steps[sw.steps.length - 1]}`);
        fimg.setVisible(false);
        sheet.setVisible(true);
        Cook.sfx.flip();
        setTimeout(() => Cook.sfx.click(), 60);
        const s0 = sheet.scale;
        S.tweens.add({ targets: sheet, scale: s0 * 1.05, duration: 70, yoyo: true, ease: "Quad.easeOut" });
        z.progress((f + 1) / F.swipes.length);
      }
      if (quit) {
        // the spare strip goes back
        sheet.blobs.forEach((b) => b.destroy());
        S.tweens.add({ targets: sheet, alpha: 0, x: sheet.x - z.L(200), duration: 260, onComplete: () => sheet.destroy() });
        break;
      }
      n++;
      if (second) nB++;
      else nA++;
      z.skill(100, "fold");
      S.tweens.killTweensOf(sheet);
      sheet.setScale(z.L(STAGE_K));
      // the finished samosa's own middle (fold-6 sits at the strip's right end): it flies by that
      const dn = F.done;
      sheet.setPosition(sheet.x + (dn.x - 0.5) * SW * z.k, sheet.y + (dn.y - 0.5) * SH * z.k).setOrigin(dn.x, dn.y);
      S.sparkle(sheet.x, sheet.y);
      Cook.sfx.right();
      pop(z, S, Cook.display("ph-samosa"), sheet.x, sheet.y - z.L(170), { speakId: "ph-samosa", ms: 1100 });
      // onto the plate's flat middle (S10): the plate shows how many (never a count to aim for); the ones
      // already there shuffle up to make room
      await Cook.wait(160);
      onPlate.push(sheet);
      const spots = plateSpots(onPlate.length, PLATE.x, PLATE.y, plate.flatHalf, 0.75);
      const moves = onPlate.map((o, i) => {
        const sp = spots[i];
        const sc = z.L(sp.w) / dn.w;
        if (o === sheet) return S.fly(o, z.X(sp.x), z.Y(sp.y), { scale: sc, duration: 420, arc: z.L(90) }).then(() => o.setAngle(sp.a));
        return new Promise((r) => S.tweens.add({ targets: o, x: z.X(sp.x), y: z.Y(sp.y), scale: sc, angle: sp.a, duration: 300, onComplete: r }));
      });
      await Promise.all(moves);
      if (n >= most) break;
    }
    stopGlowTick();
    glowG.destroy();
    UI.hideGo();
    UI.hideDone();
    z.expect({ kind: "wait" });
    await Cook.wait(250);
    return { n, nA, nB, two, got, got2, fillWrong, order };
  }

  /**
   * One fold by swipe: the flap follows the finger (draw(t), t 0-1 along from->to), and past halfway on
   * letting go it snaps shut. Resolves "fold", or "go" if the phase button is pressed first (offerGo).
   */
  function swipe(z, S, { onDrag, from, to, draw, fimg, sheet, offerGo, goLabel, expectGo, glowGo, minLen }) {
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
        if (!fimg.visible) {
          fimg.setPosition(sheet.x, sheet.y).setScale(sheet.scale).setVisible(true);
          sheet.setVisible(false);
          (sheet.blobs || []).forEach((b) => b.setVisible(false));
        }
        draw(t);
      };
      let nextBtn = null;
      const finish = (r) => {
        if (over) return;
        over = true;
        offs.forEach((o) => o());
        if (nextBtn) nextBtn.remove();
        UI.hideGo();
        z.expect(null);
        resolve(r);
      };
      const settle = (to1) =>
        new Promise((r) => {
          const o = { v: t };
          S.tweens.add({
            targets: o,
            v: to1,
            duration: to1 ? 150 * (1 - t) + 60 : 220,
            ease: to1 ? "Quad.easeIn" : "Back.easeOut",
            onUpdate: () => show(o.v),
            onComplete: r,
          });
        });
      offs.push(
        z.on("pointerdown", (p) => {
          start = { x: p.worldX, y: p.worldY };
        }),
        z.on("pointermove", (p) => {
          if (!start || over) return;
          const v = ((p.worldX - start.x) * dx + (p.worldY - start.y) * dy) / (len * len);
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
            fimg.setVisible(false);
            sheet.setVisible(true);
            (sheet.blobs || []).forEach((b) => b.setVisible(true));
          }
        }),
      );
      // 30 Sept: "fry them" is the shared button kit's → Next (js/shared/buttons.js, UX-PRINCIPLES 15)
      const stage = document.querySelector("#stage");
      if (offerGo && global.NjgButtons && stage) nextBtn = global.NjgButtons.next(stage, goLabel, () => finish("go"), { id: "samosa-next", glow: !!glowGo });
      else if (offerGo) UI.go(goLabel, { glow: !!glowGo }).then(() => finish("go"));
      z.expect(expectGo ? { kind: "click", selector: nextBtn ? "#samosa-next" : "#go-btn" } : { kind: "swipe", x1: from.x, y1: from.y, x2: to.x, y2: to.y });
    });
  }

  /* ---------- 3: fry in the karahi on the wide hob, lift onto the paper-lined plate ---------- */
  async function fry(z, { n, level }) {
    const z0 = z;
    z = Cook.liftZone(z0);
    const S = z.S;
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
    // hot, and the sizzle says it's ready
    const cx = at.x;
    const cy = at.y;
    await new Promise((resolve) => {
      burner.knobHit.handAction = false;
      if (z.guided) S.glow(burner.knobHit, true);
      S.tappable(burner.knobHit, () => {
        S.untap(burner.knobHit);
        S.glow(burner.knobHit, false);
        burner.set("high");
        resolve();
      });
      const c = { x: burner.knobHit.x, y: burner.knobHit.y };
      z.expect({ kind: "tap", x: c.x, y: c.y, key: "knob" });
      // the knob pulses (the focal rule): it is the next thing
      burner.knob.baseScale = 1;
      S.tweens.add({ targets: burner.knob, scale: 1.1, duration: 500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    });
    S.tweens.killTweensOf(burner.knob);
    burner.knob.setScale(1);
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);
    // shimmer on the oil: it's hot
    const shimmer = S.track(S.add.ellipse(cx, cy, oilR * 1.7, oilR * 1.7, 0xfff3c0, 0).setDepth(D.item + 0.05));
    S.tweens.add({ targets: shimmer, alpha: 0.12, duration: 700, yoyo: true, repeat: -1 });
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
        f.level += f.rate * s;
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
    await new Promise((resolveAll) => {
      const post = () => {
        const waiting = raw.filter((r) => !r.gone);
        const cur = frying.filter((f) => !f.out).sort((a, b) => b.level - a.level)[0];
        if (!waiting.length && !cur) return resolveAll();
        // the next thing pulses: a raw one while there's room, else the samosa furthest on
        if (cur && (cur.level >= lo || !waiting.length)) z.expect({ kind: "timing", x: cur.a.x, y: cur.a.y, key: "lift" });
        else if (waiting.length) z.expect({ kind: "tap", x: waiting[0].x, y: waiting[0].y, key: "samosa" });
        else z.expect({ kind: "wait" });
      };
      raw.forEach((im) => {
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
            f.out = true;
            f.ring.destroy();
            S.untap(im);
            S.untap(b);
            const L = f.level;
            const verdict = L < lo ? "light" : L > (k.burnAt || 1.15) ? "dark" : "golden";
            if (verdict !== "golden") bad = bad || (verdict === "light" ? "lifted a samosa before it was golden" : "a samosa went too dark");
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
      });
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
    burner.set("off");
    shimmer.destroy();
    if (sizzle && sizzle.stop) sizzle.stop();
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
      await L.station("samosa", { fillings: d.fillings, exclude: d.no, decoyPool: Cook.data.recipes.samosa.lists.fillings_all, count: d.count, fillings2: d.fillings2, count2: d.count2, who });
    },
  });
})(window);
