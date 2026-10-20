/*
 * Combined station: Daar v3, chop, then tadka and stir (docs/design-language/ui-design-system.md §13; the chai v2
 * grid §3, §4, §10; the kitchen kit §13; serve and taste §14a; the 29 Sept play-test §6, D1-D11, S16).
 *
 * TWO PHASES, each on the whole picture, with a phase fold between them:
 *  1. CHOP (v3, D1 / Q4: the swipe chop is back): the Fruit-Ninja chop (js/cook/mechanics/chop.js, its own
 *     levels, decoys and timer ring) on the marble, the kit's knife following the finger (no hand). Nani's
 *     chop card (a person card with her face, "Chop these", the rows with the Kutchi quantity) says what to
 *     chop; Nana's daar card folds to face + headline meanwhile. Each right slice sends its chopped pieces to
 *     the counter at the top right (D4: they wait at the side), one small pile per piece, one row per
 *     vegetable, so they can be counted. The ring running out ends the chop (graded then, as in chaat).
 *  2. COOK: the kitchen kit's hob with ONE burner and ONE pot, the v3 top-down pot (D11), whose pictured
 *     contents change after each addition (D2, D3: hot oil from the start, then seeds, onion, tomato,
 *     chilli, daar, the tadka on top; never drawn dots). Tap the knob: the oil is hot at once and the sizzle
 *     says so (S16: no heating ring). The spices in the order Nani said; then the chopped piles, one at a
 *     time (D9: their rows went back to "to do" and tick as each goes in); then the daar (D5: the photoreal
 *     bowl on its trivet). Then stir: drag the ladle (D6: top-down, the handle rising) round the pot, or
 *     tap the pot for one turn. The pictured contents turn with the ladle (D10), clipped inside the rim.
 *     The speed dial (D7 / Q10: dark glass, gold rim, the "on" knob's warm glow) shows stopped, tortoise,
 *     hare, spilling; the laps show as the Kutchi number word under it. From level 2 Nani may ask for a
 *     speed ("slowly", "quickly", the stir mechanic's words), judged by the accuracy badge only.
 *     Tap the tick when it's done.
 * THE REVIEW (§14a as changed 29 Sept, X10 / Q1: Cook.Kit.review): a bowl of daar on its trivet beside the
 *   pot, and their big round face comes up over it (no body, no pretend eating).
 *  - right: a happy face and the family's praise;
 *  - not quite: a gentle face, they say their order again, and the child cooks it again (the chop first).
 *    Only the first try counts (the accuracy badge, the end review). At most three tries.
 *
 * Levels (data/cook.json's daal recipe slots; data/stations/daar.json's levels; data.mechanics.chop's levels
 * for the chop, data.mechanics.stir's for the dial's bands and the speed words): 1 = only what's asked,
 * one chop round; 2 = decoys, the chop's switch, a speed to stir at; 3 = the item words dotted on the card;
 * 4 = more decoys, and Nana's card starts folded in the cook (a peek costs a hint).
 * The chips (every level, Zafar, 20 Oct): a word is written until the child has used it right, then the speaker alone (Cook.chipWord).
 * Art: assets/cook/items/v3/daar/ (the nine pots on one registered canvas, the trivet bowl, the ladle;
 * meta.json), the pantry v2 jars, the top-down vegetables (veg-*-whole-t / -chopped-t), tool-knife-t, and
 * the kitchen kit's hob and knob (js/cook/kitchen-kit.js). The dial's face is drawn in code.
 * 30 Sept (v3.1, build/cut_cook_v3_1.py): the pot shows only the vegetables that went in (R4's pots), the
 * plain daar waits on its trivet (R4), real chopped heaps and pieces (R5), ladle-v2 (R3), the dial's four
 * flat icons (R8), and Nani's chop card is words only from level 3.
 * Shots: build/shoot_daar_v3.py.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";
import { NjgPour } from "../../shared/pour.js"; // SH-117: the shared pour (the daar into its pot)

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const TAU = Math.PI * 2;

  const IT = "assets/cook/items/";
  const V3 = IT + "v3/daar/";
  /* ---------- the grid (design px, 1600x900), chai v2's ---------- */
  const SHELF_TOP = St.SHELF.top; // the bottom 30% (SH-112)
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  // a scene piece's y: raised into the middle of a taller stage's worktop (Cook.lift, set per round)
  let LIFT = 0;
  const sy = (z, y) => z.Y(y) - z.L(LIFT);
  const BASE = 818;
  const CHIP_Y = 860;
  // SH-112 (Zafar 20 Oct): the taller band's crates and jars a quarter bigger (St.shelfFit keeps the band's top gap)
  const PITCH = 180;
  const SLOT_W = 140;
  const INK = { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf };
  const FONT = "Nunito, sans-serif";
  // the vegetables' own art: word id -> file stem
  const VEG = { "veg-01": "bataato", "veg-02": "dungri", "veg-03": "tameto", "veg-12": "marcha", "veg-13": "lasan", "veg-14": "aadu" };
  const CHOPPED = { "veg-01": "veg-bataato-cubed-v2-t.webp", "veg-02": "veg-dungri-chopped-t.png", "veg-03": "veg-tameto-chopped-t.png", "veg-12": "veg-marcha-chopped-t.png", "veg-13": "veg-lasan-chopped-t.webp", "veg-14": "veg-aadu-chopped-t.png" };
  // 30 Sept (R5): onion, tomato and chilli as real chopped heaps (one heap per chopped vegetable) and one piece
  // each (the piece flies off the knife and lands as its heap), in place of the flower-like v2 piles
  const HEAP5 = { "veg-02": "onion", "veg-03": "tomato", "veg-12": "chilli" };
  const pileUrl = (id) => (HEAP5[id] ? `${V3}chop-heap-${HEAP5[id]}.webp` : IT + CHOPPED[id]);
  /*
   * The v3 pot (D1 art, build/cut_cook_v3.py): nine states on one registered canvas, 430 x 348. Measured from
   * the art (assets/cook/items/v3/daar/meta.json; build/check_vessel_meta.py re-fits them): the round body's
   * centre (cx, cy: fractions of w and h) and radius r (of w), handles left out. inner: the contents' radius
   * (of w), measured on pot-oil / -daar / -tadka along 12 rays (0.33-0.34): the stir's turning layer is
   * clipped a little inside it, so the rim never turns. (s08 w4A: no longer drawn; its states' contents are cut from this
   * canvas into discs, OLD_IN below, and build/check_vessel_meta.py still checks the canvas.)
   */
  const POT = { w: 430, h: 348, cx: 0.4982, cy: 0.4985, r: 0.3566, inner: 0.325 };
  /*
   * s08 w4A (DAAR-29, DAAR-31, P48, P50): the pot is DP2's, exactly top-down and empty (assets/cook/items-s08b/daar-pot-top-s08b,
   * 900 x 705, measured on the cut: the rim's outer circle centre (cx, cy) and radius r, the inside wall's radius inner, all of w),
   * and what is in it is a ROUND DISC that lies inside it and turns under a still rim (a copy of the pot with its middle cut out,
   * drawn over the disc). The discs: DP3's daal (plain, and the stirred swirl that comes up as you stir faster), and before the
   * daal goes in the oil, seeds and vegetables cut once as discs from the v3 pot pictures' contents (OLD_IN: their contents
   * circle on that canvas, measured on the cut). DP3's tadka, veg and done discs show curry leaves, a dried chilli, onion with
   * tomato and coriander that an order may not have (DAAR-16: the pot shows what went in), so they are not used: what went in
   * shows as DP1's pieces on the daal, and the tadka lies under the daal poured over it.
   */
  const POT2 = { w: 900, h: 705, cx: 0.5, cy: 0.4993, r: 0.3844, inner: 0.3467, cut: [327 / 900, 333 / 900], disc: 337 / 900 };
  /*
   * s08 w6B (DAAR-31, P50: "the bottom and left walls of the pot are more visible than the top wall"): DP2's lip is not even
   * (measured on the @2x cut along 12 rays: its bright lip begins 12 px inside the outer edge at the top, 18-25 px elsewhere,
   * and the outer edge is 340 x 346 px), so a round cut at `inner` showed a thin top and a thick bottom. The still rim is now
   * cut on an ellipse a constant 13 px inside the outer edge (cut: its x and y radii, of w), and the disc reaches past it
   * (disc: its radius, of w; under the rim's outer edge everywhere), so the metal shows one even band all round.
   */
  const OLD_IN = { cx: 213.5 / 430, cy: 175 / 348, r: 135 / 430 };
  // DP3's discs (assets/s08b-cut-data.json: [cx, cy, r] of the circle on its 419 x 420 canvas)
  const DISCS = { daar: ["dv4-disc-plain", "disc-daal-plain-s08b", [208.7, 223.4, 194.0]], stirred: ["dv4-disc-stirred", "disc-daal-stirred-s08b", [208.7, 197.0, 194.2]] };
  const S08B = "assets/cook/items-s08b/";
  // 30 Sept (R4): the -only / pairs pots (the same canvas, registered to D1's rim) so an order without onion
  // never shows onion. s08 w4A: only their contents are drawn (cut to discs), so only the states before the daar load
  const POTS = ["oil", "seeds", "onion", "tomato", "chilli", "tomato-only", "chilli-only", "onion-chilli", "tomato-chilli"];
  // what the pot shows for the pictured vegetables in it so far (onion, tomato, chilli: every mix has its picture;
  // D1's "tomato" is onion + tomato and its "chilli" all three). Another vegetable (garlic, potato) changes nothing.
  const VEG_BIT = { "veg-02": 1, "veg-03": 2, "veg-12": 4 };
  const MIX_POT = ["seeds", "onion", "tomato-only", "tomato", "chilli-only", "onion-chilli", "tomato-chilli", "chilli"];
  /*
   * DAAR-05 (s07 DP1): what went in stays pictured once the daar is poured over it, and turns with the stir: a few of
   * DP1's pieces (sources/art/s07/dp1-daar-pieces-v1.png, cut to v3/daar/dp1-*) lie on the daar, each vegetable's own,
   * never one that didn't go in. [texture, its width as a share of the contents' radius, [angle (deg), radius share]...]
   */
  const DP1 = {
    "veg-02": [["dv4-onion", 0.2, [[20, 0.55], [140, 0.62], [250, 0.4], [320, 0.7]]]],
    "veg-03": [["dv4-tomato", 0.3, [[80, 0.5], [200, 0.58], [300, 0.32]]]],
    "veg-12": [["dv4-chilli-1", 0.17, [[115, 0.3], [345, 0.45]]], ["dv4-chilli-2", 0.17, [[230, 0.68], [40, 0.25]]]],
    "veg-13": [["dv4-paste", 0.24, [[170, 0.22]]]],
    "veg-14": [["dv4-paste", 0.24, [[10, 0.12]]]],
  };
  const DP1_FILES = { "dv4-onion": "dp1-onion", "dv4-tomato": "dp1-tomato", "dv4-chilli-1": "dp1-chilli-1", "dv4-chilli-2": "dp1-chilli-2", "dv4-paste": "dp1-paste" };
  // the served bowl on its trivet (528 x 563; its round body, trivet and all: r 0.4833 of w) and the ladle
  // (290 x 455, top-down, the handle rising: its bowl's centre and radius)
  // S03-D (S8): the tadka bowl redrawn with matte daar (no beads), its own trivet circle measured on the cut
  const TRIVET = { w: 528, h: 527, cx: 0.5, cy: 0.5, r: 0.4697 };
  // S03-D (DAAR-02): ladle-v3, a real kadchi from above (a deep round bowl, a flat strap handle rising to the upper
  // right, foreshortened by build/gen_s03.py); its bowl: the biggest circle inside it, measured on the cut
  const LADLE = { w: 360, h: 389, cx: 0.2889, cy: 0.7301, r: 0.2401 };
  // (R4 cell 6) the same bowl of plain daar, no tadka: it waits beside the pot and pours in (the tadka one is the review's)
  // S03-D (C10): the s03 bowl (matte daar) on trivet-t, one canvas with daar-bowl-plain-t (build/gen_s03.py --fit)
  const TRIVET_PLAIN = { w: 489, h: 490, cx: 0.4991, cy: 0.4971, r: 0.4899 };
  // (R8) the speed dial's four flat cream icons: stopped, slow (tortoise), fast (hare), too fast (a splash)
  const DIAL_ICONS = ["stopped", "slow", "fast", "spill"];
  // DAAR-13: the margin-safe knife's edge, tip to heel, as fractions of tool-knife-t.png (345 x 296)
  const KNIFE_BLADE = [0.07, 0.08, 0.5, 0.64];
  // DAAR-11 (D6): the ladle's handle leaves its bowl about 48 degrees above the right (ladle-v3.webp); turned so it
  // always points out to the rim, hooked over it, as the ladle goes round
  const LADLE_HANDLE = (-48 * Math.PI) / 180;
  // DAAR-30: the stir's flag, at 12 o'clock (screen angles: y down, so straight up is -90 degrees)
  const FLAG_AT = -Math.PI / 2;
  /** A test log (the contract checks read it: contract-65, contract-66), never shown. */
  const stirNote = (what, step, by) => {
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note(what, { step: String(step), by });
    } catch (e) {
      /* only a log */
    }
  };
  /*
   * The pot's contents as a disc texture (s08 w4A): a square canvas with the round contents centred in it, its edge a little
   * soft. st: "daar" / "stirred" (DP3's discs, cut to their circle) or a v3 pot state (its contents circle, OLD_IN). Made once.
   */
  function discTex(S, st) {
    const key = `dv4-c-${st}`;
    if (S.textures.exists(key)) return key;
    const d = DISCS[st];
    const srcKey = d ? d[0] : `dv3-pot-${st}`;
    if (!S.textures.exists(srcKey)) return d ? "dv4-pot-top" : discTex(S, "daar");
    const img = S.textures.get(srcKey).getSourceImage();
    const [x0, y0, r] = d ? d[2] : [OLD_IN.cx * img.width, OLD_IN.cy * img.height, OLD_IN.r * img.width];
    const R = Math.round(r);
    const ct = S.textures.createCanvas(key, 2 * R, 2 * R);
    const g = ct.getContext();
    g.drawImage(img, x0 - R, y0 - R, 2 * R, 2 * R, 0, 0, 2 * R, 2 * R);
    const feather = d ? 2 : 6;
    const fade = g.createRadialGradient(R, R, R - feather, R, R, R);
    fade.addColorStop(0, "rgba(0,0,0,1)");
    fade.addColorStop(1, "rgba(0,0,0,0)");
    g.globalCompositeOperation = "destination-in";
    g.fillStyle = fade;
    g.beginPath();
    g.arc(R, R, R, 0, TAU);
    g.fill();
    g.globalCompositeOperation = "source-over";
    ct.refresh();
    return key;
  }
  /** The still rim: DP2's pot with its middle cut away (a soft edge just inside the wall), drawn over the turning disc. */
  function rimTex(S) {
    const key = "dv4-pot-rim";
    if (S.textures.exists(key)) return key;
    const img = S.textures.get("dv4-pot-top").getSourceImage();
    const w = img.width;
    const h = img.height;
    const ct = S.textures.createCanvas(key, w, h);
    const g = ct.getContext();
    g.drawImage(img, 0, 0, w, h);
    const cx = POT2.cx * w;
    const cy = POT2.cy * h;
    // DAAR-31: an even band of rim all round (POT2.cut, an ellipse a constant width inside DP2's outer edge)
    const rx = POT2.cut[0] * w;
    const ky = POT2.cut[1] / POT2.cut[0];
    g.save();
    g.translate(cx, cy);
    g.scale(1, ky);
    const cut = g.createRadialGradient(0, 0, rx - 5, 0, 0, rx + 1);
    cut.addColorStop(0, "rgba(0,0,0,1)");
    cut.addColorStop(1, "rgba(0,0,0,0)");
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = cut;
    g.beginPath();
    g.arc(0, 0, rx + 1, 0, TAU);
    g.fill();
    g.restore();
    g.globalCompositeOperation = "source-over";
    ct.refresh();
    return key;
  }
  /**
   * DAAR-30: the stir's small racing flag, standing on the rim at 12 o'clock (x, y: the pole's foot), drawn flat in the kit's
   * inks: a dark pole and a black and white chequered flag with a soft shadow. wave(): it flutters as the ladle passes it.
   */
  function stirFlag(z, S, x, y) {
    const c = S.track(S.add.container(x, y).setDepth(D.item + 0.7).setAlpha(0));
    c.setName("daar-stir-flag");
    const g = S.add.graphics();
    const L = (v) => z.L(v);
    const pole = 76;
    const fw = 56;
    const fh = 38;
    g.fillStyle(0x28190a, 0.16).fillEllipse(L(3), L(2), L(16), L(7));
    g.fillStyle(0x3a2410, 1).fillRoundedRect(-L(3.5), -L(pole), L(7), L(pole), L(3.5));
    g.fillStyle(0x3a2410, 1).fillCircle(0, -L(pole), L(4.5));
    const flagG = S.add.graphics();
    const n = 4;
    const m = 3;
    flagG.fillStyle(0x28190a, 0.14).fillRoundedRect(L(3), -L(pole) + L(5), L(fw), L(fh), L(3));
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) flagG.fillStyle((i + j) % 2 ? 0x2a2522 : 0xfffaf1, 1).fillRect(L(2) + (i * L(fw)) / n, -L(pole) + L(2) + (j * L(fh)) / m, L(fw) / n + 0.5, L(fh) / m + 0.5);
    flagG.lineStyle(L(2), 0x2a2522, 0.85).strokeRect(L(2), -L(pole) + L(2), L(fw), L(fh));
    // (an empty box named for the evidence probes' canvas:pot crop, so the flag is in the pot's frame; never drawn)
    const box = S.add.rectangle(L(fw / 2), -L(pole / 2), L(fw + 8), L(pole + 8), 0xffffff, 0).setName("daar-pot-flag");
    c.add([g, flagG, box]);
    S.tweens.add({ targets: c, alpha: 1, duration: 300 });
    return {
      wave() {
        if (!flagG.active) return;
        S.tweens.killTweensOf(flagG);
        flagG.setScale(1, 1);
        S.tweens.add({ targets: flagG, scaleX: 0.72, duration: 90, yoyo: true, repeat: 1, ease: "Sine.easeInOut" });
      },
      close() {
        S.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: () => c.active && c.destroy() });
      },
    };
  }
  /*
   * Where the chopped pieces wait (D4, Q4: "in bowls, or on the counter at the top right: try it and judge").
   * "counter": one small pile per piece, a row per vegetable, straight on the counter (chosen: it can be
   * counted, and the pile you tap is the one that goes in). "bowl": the v3 veg-bowl (its contents are
   * pictured, so it shows onion, tomato and chilli whatever was chopped). Cook.daarSide overrides (the shots).
   */
  const SIDE = { counter: { x: 1395, y: 120, row: 112 }, cook: { x: 330, y: 190, row: 128 } };
  const PILE = 96; // one piece's pile, design px
  // (R5's heaps fill their canvas, the old piles didn't: a heap is drawn a little smaller and the heaps further
  // apart, so two heaps stay two, never one big pile)
  const heapSize = (id) => (HEAP5[id] ? PILE * 0.82 : PILE);
  const PITCH_OF = (id) => (HEAP5[id] ? PILE * 0.98 : PILE * 0.78);

  const ladderOf = (ctx) => {
    const Ls = UI.mission.ladders() || [];
    return Ls[ctx.dishAt || 0] || Ls[0] || null;
  };
  const orderLine = (L) => {
    if (!L) return null;
    // what the person asked for (the tadka order is Nani's, said at the pot: not theirs to repeat)
    // 29 Sept (X1): one sentence, in card order (Cook.Order.speech leaves the `when` sections out)
    return Cook.Order.speech([L]);
  };
  const shelfUrl = (id) => `${IT}shelf-${id}-bare-f.webp`;

  Mech.combined("daar", {
    station: "daar",
    view: "marble",
    dataFile: "data/stations/daar.json",
    zones: [{ id: "daar", mech: "chop", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } }],
    run: (host, params) => station(host, params),
  });

  async function station(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    LIFT = Cook.lift();
    Object.values(host.zones).forEach((z) => z.close());
    const level = Math.max(host.level || 1, Cook.roundLevel(ctx));
    const K = Mech.knobs("daar", { level });
    const phases = (Cook.data.stations.daar || {}).phases || {};
    const who = p.who || (ctx.order && ctx.order.who) || "nana";
    const want = {};
    Object.keys(p.targets || {}).forEach((id) => Number(p.targets[id]) > 0 && (want[id] = Number(p.targets[id])));
    const kinds = Object.keys(want);
    const no = [].concat(p.no || []).filter(Boolean);
    const pool = [].concat(p.pool || []).filter((id) => VEG[id]);
    const tadka = [].concat(p.tadka || []);
    const flat = tadka.flat();
    // CK-49 (the level table): 1, 2, 3, 3 decoy spices on the tadka shelf, a lookalike among them at L4
    const spiceIds = Cook.shuffle([...new Set(flat.concat(St.tableDecoys(K.spiceShelf || [], flat, level, { want: flat, what: "spices" })))]);
    const laps = p.laps || 3;
    const side = Cook.daarSide || "counter";
    if (Cook.Coach) Cook.Coach.stop(false); // not "seen": the chop's own begin shows it (data.onboard.daar)
    const vegAll = [...new Set(kinds.concat(no, pool))].filter((id) => VEG[id]);
    // CK-49 (contract-37): the chop's decoys, the vegetables thrown that nobody asked for (its 'no' one too)
    {
      const LA = Cook.data.lookalikes || {};
      const off = vegAll.filter((id) => !kinds.includes(id));
      St.decoyNote(off.length, { what: "chop", lookalike: off.some((id) => kinds.some((w) => (LA[w] || []).includes(id))) });
    }
    const art = [
      ["dv2-knife", IT + "tool-knife-t.png"], // DAAR-13: the margin-safe cut (the webp touched its canvas edge: the tip was clipped)
      ["dv3-trivet", V3 + "daar-bowl-trivet-v2.webp"],
      ["dv3-ladle", V3 + "ladle-v3.webp"],
      ["dv3-trivet-plain", V3 + "daar-bowl-trivet-plain-v2.webp"],
      ["dv3-vegbowl", V3 + "veg-bowl.webp"],
    ]
      .concat(POTS.map((st) => [`dv3-pot-${st}`, `${V3}pot-${st}.webp`]))
      .concat([["dv4-pot-top", `${S08B}daar-pot-top-s08b.webp`]], Object.values(DISCS).map(([key, file]) => [key, `${S08B}daar-discs/${file}.webp`]))
      .concat(spiceIds.map((id) => [`dv2-shelf-${id}`, shelfUrl(id)]))
      .concat(vegAll.map((id) => [`dv2-chop-${id}`, pileUrl(id)]))
      .concat(vegAll.filter((id) => HEAP5[id]).map((id) => [`dv3-piece-${id}`, `${V3}chop-piece-${HEAP5[id]}.webp`]))
      .concat(DIAL_ICONS.map((n) => [`dv3-dial-${n}`, `${V3}dial-${n}.webp`]))
      .concat([...new Set(vegAll.flatMap((id) => (DP1[id] || []).map((d) => d[0])))].map((key) => [key, `${V3}${DP1_FILES[key]}.webp`]))
      .concat(Cook.Kit ? Cook.Kit.faceArt(who) : [])
      .concat(Cook.Kit ? Cook.Kit.art(1, []) : [])
      .concat(St.artLoad(["knife", "daar-bowl", "daar-trivet"])); // S02-B: the art run's knife and split bowl/trivet, once they land
    await St.loadArt(S, art);

    /*
     * Decision 51 (CK-23, DAAR-09): a mistake redoes only that step, never the whole game. A wrong chop count chops
     * again only the wrong vegetables (the right ones stay chopped and ticked); a wrong tadka order takes the seeds
     * out and does the tadka again; a wrong number of stirs stirs again. The second try has help (the next thing
     * glows); the third wrong try shows the right way and moves on. Only the first try is scored.
     */
    const redo = St.redo(ctx);
    const steps = St.steps(ctx);
    /* ---------- 1: chop (nothing to chop: an order can ask for no vegetables at all, then it's straight to the pot) ---------- */
    const chopped = { got: {}, wrong: null, rows: [] };
    if (kinds.length) {
      let need = Object.assign({}, want);
      for (let tries = 0; ; tries++) {
        await St.begin(S, ctx, "daar", "marble"); // the first time, the ghost finger (data.onboard.daar): two swipes
        if (ctx.nextStep) ctx.nextStep("Chop");
        if (phases.chop && !tries) UI.gist(phases.chop);
        const cz = Mech.zone(S, ctx, { id: "chop", level });
        // (her card is drawn at the order's card level, as the order card beside it: a day's order of daal and maani at L3 dots
        // both, though the daal itself is a lower level: contract-35, s08 gate's day 3)
        const nani = naniCard(want, no, level, kinds.filter((id) => !(id in need)), need, Math.max(level, UI.orderLevel ? UI.orderLevel() : level));
        const c = await chop(cz, { want: need, kinds: Object.keys(need), no, pool, level, retry: tries > 0, nani, side });
        nani.close();
        cz.close();
        St.end();
        Object.keys(need).forEach((id) => {
          if ((c.cut[id] || 0) === need[id]) {
            chopped.got[id] = need[id];
            delete need[id];
          }
        });
        if (!c.wrong) break;
        chopped.wrong = chopped.wrong || c.wrong;
        const r = redo.wrong("daar:chop");
        if (r.action === "show") {
          // the third wrong try: the right count is put out for you (the card's rows tick), and on to the pot
          Object.keys(need).forEach((id) => (chopped.got[id] = need[id]));
          if (ctx.closeItem) ctx.closeItem(Object.keys(need));
          need = {};
          break;
        }
        // only the wrong vegetables come back: their rows open again; Nani says just those again
        UI.mission.reopen(Object.keys(need), ctx.dishAt || 0);
        if (Cook.roundLevel(ctx) <= 1) Cook.oops(ctx);
      }
      chopped.rows = kinds.filter((id) => chopped.got[id]);
    }

    /* ---------- 2: tadka and stir, then serve and taste ---------- */
    await St.begin(S, ctx, "daar", "marble");
    if (Cook.Coach) Cook.Coach.stop(false);
    // the tadka and the stir get their own first-time coach (X11: data.onboard["daar-cook"])
    St.coach(ctx, "daar-cook");
    // level 4 (§14a): Nana's card starts folded (face + headline, no pips); a peek costs a hint. It folds before the
    // tadka's pop-up, so the pop-up is the shared closed big card (the order heard, never written; non-negotiable 6)
    const peek = K.ladder === "closed" && UI.mission.closeCards;
    if (peek) UI.mission.closeCards(true, { peek: true });
    // the tadka order comes up in the shared request pop-up before the tadka (S04-B, decision 75 (1))
    if (ctx.nextStep) await ctx.nextStep("tadka");
    else await UI.mission.request("tadka");
    // 29 Sept (D9, Zafar): the chopped things still have to go in, so their rows go back to "to do"
    // here and tick again as each pile goes into the pot (cook())
    const Lc = ladderOf(ctx);
    if (Lc) {
      Cook.Order.rows(Lc, { all: true }).forEach((r) => {
        if (r.head || r.no || !r.ids.some((id) => id in want)) return;
        r.done = false;
        r.got = 0;
      });
      UI.mission.refresh();
    }
    if (phases.cook) UI.gist(phases.cook);
    const kz = Mech.zone(S, ctx, { id: "cook", level });
    const cooked = await cook(kz, { spiceIds, tadka, flat, laps, speed: p.speed || null, level, K, chopped, retry: false, side, redo, steps });
    if (peek) UI.mission.closeCards(false);
    steps.done();
    const why = chopped.wrong || cooked.wrong;
    await serve(kz, { who, pot: cooked.pot, ok: true, last: true, firstOk: !why });
    kz.close();
    St.end();
    const result = { chopped: chopped.got, tadka: cooked.order, stirred: cooked.stirred };
    ctx.result.daar = result;
    ctx.result.chopped = result && result.chopped;
    if (ctx.closeItem) ctx.closeItem(["cook-daal"], { all: true });
    return result;
  }

  /* ---------- Nani's chop card (§13): the shared order card, her face, "Chop these", the quantities ---------- */
  function naniCard(want, no, level = 1, doneIds = [], need = want, cardLv = level) {
    const M = UI.mission;
    // SH-99 (every number said is written) and the level table (s08 w2A, SH-110): the chop card writes how many at every
    // level ("trae dungri"); from L3 its item words are dotted as the order card's are ("trae •••"), and at L4 it starts
    // folded (face + headline; her face replays it). Was: from level 3 words only, the number heard (decision 41)
    const parts = (id) => Lang.countParts(want[id], id);
    const dot = (w) => Cook.dotItem(w, cardLv);
    /*
     * DAAR-34 (P54, Zafar 17 Oct: "those other items should be dotted, so you can see there's three items to be chopped in total
     * but only the first one is revealed to you audibly and visually in writing"; the level table's L3: "unsaid rows dotted and
     * revealed as called"): where the chop is called in rounds (its phases) on a dotted card (L3 up), a row she has not called yet is dotted
     * whole, number too, and is written as she calls it (call(ids), the chop's onCall). One round: every row is called at once.
     */
    const rounds = Math.min(Math.max(1, (Mech.knobs("chop", { level }) || {}).phases || 1), Object.keys(need).length || 1);
    // (from L3, where the level table dots the card: an open card, L1-L2, writes every word, contract-35)
    // DAAR-34 (s08 w6J; the judge, 20 Oct: "at L4 every round the chop card shows only 'Chop these.'"): Nani's chop card has its
    // own row in the level table (data/cook.json levelTable.stations["daar-chop"]): dotted at L4 too, never folded, so the child
    // sees how many things there are to chop, the one she has called written and the rest dotted
    const cardAt = Cook.cardState(cardLv, "daar-chop");
    // (and at L4 a row she has called is written whole, "revealed to you audibly and visually in writing"; at L3 the level
    // table's dotted card keeps the item dotted until its row ticks: data levelTable.stations["daar-chop"].callWritten)
    const own = (((Cook.data && Cook.data.levelTable) || {}).stations || {})["daar-chop"] || {};
    const cw = Array.isArray(own.callWritten) ? !!own.callWritten[Math.min(own.callWritten.length, Math.max(1, cardLv)) - 1] : false;
    const staged = rounds > 1 && cardAt !== "open";
    // the rows ticked so far (DAAR-34, the judge's flaw at L3: a ticked row stayed "trae •••"): a ticked row is written whole
    const done = new Set(doneIds);
    const called = new Set(staged ? Object.keys(want).filter((id) => !(id in need)) : Object.keys(want));
    // (a row she has not called is sealed: its dots stay dots in the bulb's peek too, so the L4 peek writes only what she has
    // said, the first item, and the rest stay dotted, per the level table; the judge, 20 Oct: "the L4 peek writes all three")
    const label = (id) => {
      const unsaid = !done.has(id) && !called.has(id);
      return Lang.html(Lang.phrase(parts(id)), { hide: (w) => !done.has(id) && (!called.has(id) || (!cw && dot(w))), sealed: unsaid });
    };
    const rows = Object.keys(want).map((id) => ({ id, label: label(id), done: done.has(id) }));
    // a row is lower case with no full stop (the sidebar's rows: "dungri na")
    const noStop = (html) => String(html).replace(/\.((?:<\/[a-z0-9]+>)*)\s*$/i, "$1");
    no.forEach((id) => rows.push({ id, label: noStop(Lang.html(Lang.asRow(Lang.line("no", Lang.phrase([id]))), { hide: dot })), done: false, no: true }));
    // "Chop these": the engine's line (to record with Mum: a grey-italic placeholder until then)
    const chopHead = Lang.line("chop-these");
    // T12 (R4): one Nani card. Her step line ("Nindha nindha kap!") is the card's top strip, and her box keeps only
    // its tools while she's the asker (no second face)
    const stepLine = St.guideLine("daar:chop");
    const data = () => ({
      person: { id: "nani", face: UI.faceUrl("nani"), name: "Nani" },
      strip: { html: stepLine.ok === false ? Lang.plain(stepLine) : Lang.html(stepLine), rec: stepLine.ok === false },
      headline: { html: Lang.html(chopHead), rec: !chopHead.ok },
      // a "don't" row is the shared card's no-row style (dashed, the no-sign), never ticked here
      items: rows.map((r) => (r.no ? { label: null, parts: [{ label: r.label, done: false, no: true, key: r }] } : { label: r.label, count: 2, parts: [], done: r.done, key: r })),
    });
    // the sidebar's own calls (order-card follow-ups): Nani's card above the order's, and the phase fold
    // (only cards you can act on stay open: Nana's daar card folds to face + headline while chopping)
    // C3 (decision 41, E12): her face replays what to chop, the numbers always said (from level 3 they're not written)
    // (the replay says only what she has called so far: DAAR-34)
    const line = () => {
      const kinds = Object.keys(want).filter((id) => called.has(id));
      return kinds.length ? Lang.join(kinds.map((id, j) => Lang.line(j === 0 ? "only" : Lang.frames().any, Lang.phrase(Lang.countParts(want[id], id))))) : null;
    };
    const opts = { say: Object.keys(want).length ? () => line() && Lang.speak(line()) : null, closed: cardAt === "hidden" };
    M.addCard("daar-chop", data(), opts);
    M.closeCards(true);
    if (UI.guideStrip) UI.guideStrip(true);
    return {
      rows,
      // DAAR-34: she calls these now: their rows are written (before she says them, so every number said is written)
      call(ids) {
        const fresh = [].concat(ids || []).filter((id) => id in want && !called.has(id));
        if (!fresh.length) return;
        fresh.forEach((id) => called.add(id));
        rows.forEach((r) => !r.no && fresh.includes(r.id) && (r.label = label(r.id)));
        M.addCard("daar-chop", data(), opts);
        stirNote("chop-call", fresh.join(","), `rows:${rows.filter((r) => !r.no && !called.has(r.id)).length} dotted`);
      },
      // DAAR-13 (rule E11): at level 1 a row lights the moment its count is reached
      tick(id) {
        const r = rows.find((x) => x.id === id && !x.no);
        if (!r || r.done) return;
        r.done = true;
        done.add(id);
        r.label = label(id);
        M.addCard("daar-chop", data(), opts);
      },
      // the rows she asked for tick; her "don't" row stays neutral (nothing was added)
      tickAll() {
        rows.forEach((r) => !r.no && (r.done = true, done.add(r.id), (r.label = label(r.id))));
        M.addCard("daar-chop", data(), opts);
      },
      close() {
        M.removeCard("daar-chop");
        M.closeCards(false);
        if (UI.guideStrip) UI.guideStrip(false);
      },
    };
  }

  /* ---------- the flat pieces both phases share ---------- */
  function backdrop(z, S) {
    // (drawn past the design box: the stage fill shows more worktop above and at the sides, Cook.view)
    S.track(S.add.rectangle(z.X(-FAR), z.Y(-FAR), z.L(1600 + 2 * FAR), z.L(SHELF_TOP + FAR), INK.page, 0.5).setOrigin(0).setDepth(D.bg + 1));
    const g = S.track(S.add.graphics().setDepth(D.bg + 1.2));
    g.fillStyle(INK.panel, 1);
    g.fillRect(z.X(-FAR), z.Y(SHELF_TOP), z.L(1600 + 2 * FAR), z.L(900 - SHELF_TOP + FAR));
    g.fillStyle(0x2a1a0a, 0.08);
    g.fillRect(z.X(-FAR), z.Y(SHELF_TOP), z.L(1600 + 2 * FAR), z.L(3));
  }

  /** The word pop (§4): a flat white card with the speaker and the Kutchi word, and the family clip. */
  function pop(z, S, text, x, y, { speakId = null, line = null, ms = 1500 } = {}) {
    const c = S.track(S.add.container(x, y).setDepth(D.fx + 3).setAlpha(0).setScale(z.k * 0.8));
    const t = S.add.text(0, 0, text, { fontFamily: FONT, fontSize: "36px", fontStyle: "800", color: INK.kutchi }).setOrigin(0, 0.5);
    const w = 34 + 10 + t.width + 36;
    const g = S.add.graphics();
    g.fillStyle(0x28190a, 0.1);
    g.fillRoundedRect(-w / 2, -28 + 3, w, 56, 12);
    g.fillStyle(INK.card, 1);
    g.fillRoundedRect(-w / 2, -28, w, 56, 12);
    Cook.Kit.speaker(g, -w / 2 + 30, 0, 26);
    t.x = -w / 2 + 50;
    c.add([g, t]);
    S.tweens.add({ targets: c, alpha: 1, scale: Math.max(z.k, Cook.Kit.textFloor(S, 36)), y: y - z.L(18), duration: 200, ease: "Back.easeOut" });
    S.tweens.add({ targets: c, alpha: 0, y: y - z.L(46), delay: ms, duration: 320, onComplete: () => c.destroy() });
    if (UI.naniMuted && UI.naniMuted()) return Promise.resolve();
    const talk = speakId ? Lang.popWord(speakId) : line ? Lang.speak(line, { kind: "count" }) : null;
    return talk ? Promise.race([Promise.resolve(talk).catch(() => {}), Cook.wait(ms + 900)]) : Promise.resolve();
  }

  /**
   * The shelf: identical slots on one line (the pantry v2 crates and jars, true relative heights: the
   * crates a little taller than the jars), a chip under each (§4). left/right: the band's free span.
   */
  function shelf(z, S, ids, level, { left = 40, right = 1410 } = {}) {
    const n = ids.length;
    const pitch = Math.min(PITCH, (right - left) / Math.max(1, n));
    const width = n * pitch;
    const x0 = left + Math.max(0, (right - left - width) / 2);
    const plank = S.track(S.add.graphics().setDepth(D.bg + 1.3));
    plank.fillStyle(INK.grey, 1);
    plank.fillRoundedRect(z.X(x0 + 10), z.Y(BASE - 2), z.L(width - 20), z.L(10), z.L(5));
    const items = {};
    ids.forEach((id, i) => {
      const x = x0 + pitch * (i + 0.5);
      const crate = !!VEG[id];
      const w = Math.min(crate ? SLOT_W + 16 : SLOT_W, pitch - 18);
      const key = `dv2-shelf-${id}`;
      let img;
      if (S.textures.exists(key)) {
        const src = S.textures.get(key).getSourceImage();
        const sc = z.L(St.shelfFit(S, key, w / src.width, BASE));
        img = S.track(S.add.image(z.X(x), z.Y(BASE), key).setOrigin(0.5, 0.97).setScale(sc).setDepth(D.item + 1));
        img.baseScale = sc;
        img.shadow = S.contactShadow(img, { centerX: z.X(x), centerY: z.Y(BASE - 3), width: z.L(w * 0.8), height: z.L(16) });
      } else img = S.ingredient(id, z.X(x), z.Y(BASE - 56), { w: z.L(110), h: z.L(100), label: false, depth: D.item + 1 });
      img.wordId = id;
      const chip = Cook.Kit.chip(S, id, z.X(x), z.Y(CHIP_Y), { word: Cook.chipWord(id, z.ctx), w: Math.min(128, pitch - 12) });
      chip.setScale(z.k);
      img.chip = chip;
      items[id] = img;
    });
    return items;
  }

  /** One tap on the knife (resolves), with the test's expectation and the guided glow. */
  function tapOnce(z, S, obj, key, { glow = false, x, y } = {}) {
    return new Promise((resolve) => {
      if (glow) S.glow(obj, true);
      S.tappable(obj, () => {
        S.untap(obj);
        S.glow(obj, false);
        z.expect({ kind: "wait" });
        resolve();
      });
      z.expect({ kind: "tap", x: x != null ? x : obj.x, y: y != null ? y : obj.y, key });
    });
  }

  /* ---------- 1: the swipe chop (D1, Q4), the pieces to the side (D4) ---------- */
  async function chop(z, { want, kinds, no, pool, level, retry, nani, side }) {
    const S = z.S;
    const ctx = z.ctx;
    backdrop(z, S);
    const C = SIDE.counter;
    const rows = []; // the vegetables in the order their first piece arrived (one row each)
    const piles = {}; // id -> the pile images
    let bowl = null;
    if (side === "bowl") {
      bowl = S.track(S.add.image(z.X(C.x - 40), sy(z, C.y + 60), "dv3-vegbowl").setDepth(D.item - 1).setAlpha(0.45));
      bowl.setScale(z.L(230) / 484);
      bowl.shadow = S.contactShadow(bowl);
    }
    /** Where piece n of vegetable id sits: its row, right to left from the counter's right edge. */
    const spot = (id, n) => {
      if (!rows.includes(id)) rows.push(id);
      const r = rows.indexOf(id);
      return { x: z.X(C.x + 70 - n * (HEAP5[id] ? PILE * 0.95 : PILE * 0.72)), y: sy(z, C.y + r * C.row) };
    };
    const onSlice = ({ id, ok, x, y }) => {
      if (!ok || !S.textures.exists(`dv2-chop-${id}`)) return;
      if (!rows.includes(id)) rows.push(id);
      const list = (piles[id] = piles[id] || []);
      const n = list.length;
      // (R5) one chopped piece flies off the knife and lands as its heap
      const piece = S.textures.exists(`dv3-piece-${id}`) && !bowl;
      const img = S.track(S.add.image(x, y, piece ? `dv3-piece-${id}` : `dv2-chop-${id}`).setDepth(D.item + 1));
      const heapW = S.textures.get(`dv2-chop-${id}`).getSourceImage().width;
      const sc = z.L(heapSize(id)) / Math.max(img.width, img.height);
      img.setScale(piece ? z.L(PILE * 0.45) / img.width : sc * 1.5);
      list.push(img);
      const to = bowl ? { x: bowl.x + z.L((n % 3) * 30 - 30), y: bowl.y + z.L(Math.floor(n / 3) * 24 - 20) } : spot(id, n);
      S.fly(img, to.x, to.y, { scale: bowl ? sc * 0.5 : piece ? img.scale : sc, duration: 460, arc: z.L(90) }).then(() => {
        if (!img.active) return;
        if (piece) {
          img.setTexture(`dv2-chop-${id}`);
          img.setScale(z.L(heapSize(id)) / heapW);
        }
        img.setDepth(D.item - 0.5 + n * 0.001);
        S.puff(to.x, to.y, 0xfff6e0, z.L(22));
        if (bowl) {
          bowl.setAlpha(1);
          img.destroy();
        }
      });
      // 29 Sept (Q7): at level 1 the count is heard as the pieces arrive ("ba dungri"), else nothing said here
      const cnt = level <= 1 && UI.tallyLine ? UI.tallyLine(n + 1, id) : null;
      if (cnt) pop(z, S, Lang.plain(cnt), to.x - z.L(120), to.y + z.L(40), { line: cnt, ms: 900 });
    };
    Cook.daarPhase = "chop"; // (for build/shoot_daar_v3.py: which state is on screen)
    // the chop mechanic itself (its levels, decoys and ring); Nani says what to chop (the number always said)
    // DAAR-13 (D10): the margin-safe knife (the art run's when it lands), whose blade cuts too
    const knifeKey = St.hasArt(S, "knife") ? St.artKey("knife") : "dv2-knife";
    const blade = (St.hasArt(S, "knife") && (St.art("knife").meta || {}).blade) || KNIFE_BLADE;
    const cut = (await Mech.run("chop", z, { targets: want, pool, no, knifeKey, blade, onSlice, onCount: (id) => nani.tick(id), onCall: (ids) => nani.call(ids), tally: false, timer: { x: 130, y: 130 } })) || {};
    // graded now: each vegetable, how many (a sliced decoy falls away: it never reaches the pot)
    let wrong = null;
    kinds.forEach((id) => {
      const g = cut[id] || 0;
      if (g !== want[id]) {
        wrong = wrong || `chopped ${g}, they asked for ${want[id]}: ${id}`;
        if (!retry) UI.mission.missItem(id, ctx.dishAt || 0, { counted: true });
      }
    });
    nani.tickAll();
    Cook.daarPhase = "chopped";
    if (ctx.closeItem) ctx.closeItem(kinds);
    else UI.mission.closeItem(kinds, ctx.dishAt || 0);
    z.expect({ kind: "wait" });
    await Cook.wait(700);
    const got = {};
    kinds.forEach((id) => (cut[id] || 0) > 0 && (got[id] = cut[id]));
    return { got, cut, wrong, rows: rows.filter((id) => got[id]) };
  }

  /* ---------- 2: tadka and stir in the v3 pot on the kit hob (one burner, one pot) ---------- */
  async function cook(z, { spiceIds, tadka, flat, laps, speed, level, K, chopped, retry, side, redo, steps }) {
    const S = z.S;
    const ctx = z.ctx;
    const Kit = Cook.Kit;
    backdrop(z, S);
    // the hob: one burner (one pot), sitting on the scene's floor line, clear of the shelf
    const hob = Kit.hob(S, { n: 1, k: z.L(0.9), cx: z.X(800), bottom: sy(z, SHELF_TOP - 14) });
    const bodyR = z.L(150);
    const burner = Kit.burner(S, hob, 0, { flameR: bodyR * 0.95 }); // X6: the flames just peek out past the pot
    const cx = hob.burners[0].x;
    const cy = hob.burners[0].y;
    // the pot, placed by its measured body (never the handles' box); hot oil in it from the start (D2)
    // s08 w4A (DAAR-31): DP2's top-down pot, its contents a disc inside it under the still rim (POT2)
    const scale = bodyR / (POT2.r * POT2.w);
    const pot = S.track(S.add.image(cx, cy, "dv4-pot-top").setOrigin(POT2.cx, POT2.cy).setScale(scale).setDepth(D.item));
    pot.setName("daar-pot");
    pot.shadow = S.contactShadow(pot, { centerX: cx, centerY: cy + bodyR * 0.08, width: bodyR * 2.15, height: bodyR * 2.15 });
    const inR = (bodyR * POT2.inner) / POT2.r;
    // the disc reaches a little under the rim's soft inner edge, so no edge of it ever shows
    // DAAR-31: out to POT2.disc, past the rim's even cut and under its outer edge
    const discR = (bodyR * POT2.disc) / POT2.r;
    const discAt = (img) => img.setScale(discR / (img.width / 2));
    const contents = S.track(discAt(S.add.image(cx, cy, discTex(S, "oil")).setDepth(D.item + 0.05)));
    contents.setName("daar-pot-contents");
    const rim = S.track(S.add.image(cx, cy, rimTex(S)).setOrigin(POT2.cx, POT2.cy).setScale(scale).setDepth(D.item + 0.2));
    rim.setName("daar-pot-rim");
    let state = "oil";
    /** The pot's pictured contents change: the next disc fades in over the last (turned as the last one is). */
    const setPot = (st, ms = 420) =>
      new Promise((r) => {
        if (st === state) return r();
        state = st;
        const top = S.track(discAt(S.add.image(cx, cy, discTex(S, st))).setRotation(contents.rotation).setDepth(D.item + 0.06).setAlpha(0));
        S.tweens.add({
          targets: top,
          alpha: 1,
          duration: ms,
          onComplete: () => {
            contents.setTexture(discTex(S, st));
            discAt(contents);
            top.destroy();
            r();
          },
        });
      });
    let mix = 0; // the pictured vegetables in the pot so far (VEG_BIT)
    const stage = (st) => (st === "oil" ? 0 : 1);
    /** A chopped vegetable goes in: the pot shows exactly what's in it (R4: no onion unless onion went in). */
    const wentIn = new Set(); // DAAR-05: every chopped thing that went in (DP1's pieces after the daar)
    const addVeg = (id) => {
      if (id) wentIn.add(id);
      mix |= VEG_BIT[id] || 0;
      const want = MIX_POT[mix];
      if (want !== state) setPot(want);
    };

    // the chopped piles wait left of the hob (one row per vegetable: tap a row, it goes in); the daar right of it
    const Cc = SIDE.cook;
    const piles = {};
    const hits = {};
    let vbowl = null;
    if (side === "bowl" && chopped.rows.length) {
      vbowl = S.track(S.add.image(z.X(Cc.x), sy(z, 330), "dv3-vegbowl").setDepth(D.item));
      vbowl.setScale(z.L(230) / 484);
      vbowl.shadow = S.contactShadow(vbowl);
      hits.bowl = vbowl;
    } else {
      chopped.rows.forEach((id, r) => {
        const n = chopped.got[id];
        const y = sy(z, Cc.y + r * Cc.row);
        piles[id] = Array.from({ length: n }, (_, i) => {
          const x = z.X(Cc.x + (i - (n - 1) / 2) * PITCH_OF(id));
          const im = S.track(S.add.image(x, y, `dv2-chop-${id}`).setDepth(D.item + 0.1 + i * 0.001));
          im.setScale(z.L(heapSize(id)) / Math.max(im.width, im.height));
          return im;
        });
        const w = z.L(Math.max(1, n) * PITCH_OF(id) + 30);
        const hit = S.track(S.add.rectangle(z.X(Cc.x), y, w, z.L(PILE + 16), 0xffffff, 0.001).setDepth(D.item + 0.4));
        hit.wordId = id;
        hits[id] = hit;
      });
    }
    // (R4 cell 6) the plain daar waits; the tadka goes on in the pot
    const plainKey = S.textures.exists("dv3-trivet-plain") ? "dv3-trivet-plain" : "dv3-trivet";
    const PB = plainKey === "dv3-trivet-plain" ? TRIVET_PLAIN : TRIVET;
    // (the same bowl size as the review's: its round body, trivet and all)
    const dBowl = S.track(S.add.image(z.X(1250), sy(z, 330), plainKey).setOrigin(PB.cx, PB.cy).setDepth(D.item));
    dBowl.setScale((z.L(230) * TRIVET.r) / (PB.r * PB.w));
    dBowl.shadow = S.contactShadow(dBowl);
    const items = shelf(z, S, spiceIds, level);
    Object.values(items).forEach((o) => o.setAlpha(0.6));
    const waiting = [dBowl].concat(vbowl ? [vbowl] : [], ...Object.values(piles));
    waiting.forEach((o) => o.setAlpha(0.7));

    // 1. the knob: the oil is hot at once, and the sizzle says so (S16: no heating ring)
    burner.knob.baseScale = 1;
    S.tweens.add({ targets: burner.knob, scale: 1.1, duration: 500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    // T13: Chulo bar! (the step line; at level 1 said as it opens, from level 2 after a pause)
    steps.to("daar:fire");
    await tapOnce(z, S, burner.knobHit, "knob", { glow: z.guided });
    steps.done();
    S.tweens.killTweensOf(burner.knob);
    burner.knob.setScale(1);
    burner.set("high");
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);
    Cook.sfx.sizzle(0.6);
    S.steam(cx, cy - bodyR * 1.05, 2); // (CK-06, s08 w6M: from the far rim, up and away: never a white cloud over the oil)
    await Cook.wait(350);
    Cook.daarPhase = "hot";

    // 2. the tadka: the spices in the order Nani said (the card shows it; a wrong one goes in too, graded)
    Object.values(items).forEach((o) => S.tweens.add({ targets: o, alpha: 1, duration: 250 }));
    const hide = St.hideKnown(ctx);
    // T13: "Pela jeeru. Ne poi rai." is the tadka step's line: at level 1 the step says it; from level 2 she says the
    // order once at the start (the counting rule) and the line comes back after a pause
    const tadkaLine = flat.length ? Lang.list(tadka, { seq: true }) : null;
    const tadkaStep = (again) => {
      if (!tadkaLine) return null;
      if (Cook.roundLevel(ctx) <= 1) return steps.to("daar:tadka", { line: tadkaLine, hide, force: again });
      // (the step opens once she's said it: opening it clears the box)
      return Promise.race([z.say(tadkaLine, { hide }).catch(() => {}), Cook.wait(7000)]).then(() => steps.to("daar:tadka", { line: tadkaLine, hide, quiet: true, force: again }));
    };
    await tadkaStep(false);
    const order = [];
    let wrong = null;
    let series = [];
    tadka.forEach((e) => series.push([].concat(e)));
    let si = 0;
    let tadkaWrong = null;
    let help = false;
    // a pinch from the jar: the jar tips over the pot, the seeds land in the oil (the picture changes: D3)
    const spiceDrop = async (id) => {
      if (DP1[id]) wentIn.add(id); // (garlic in the tadka: its paste stays pictured on the daar, DAAR-05)
      const obj = items[id];
      const col = St.heapColor(id, 0x8a5a2a);
      S.tweens.add({ targets: obj, scale: obj.baseScale * 1.06, duration: 90, yoyo: true });
      const jar = S.track(S.add.image(obj.x, obj.y - obj.displayHeight * 0.5, obj.texture.key).setScale(obj.baseScale * 0.7).setDepth(D.fx));
      await S.fly(jar, cx + bodyR * 0.45, cy - bodyR * 0.95, { duration: 340, arc: z.L(110) });
      await Cook.tween(S, { targets: jar, angle: -75, duration: 160, ease: "Quad.easeOut" });
      Cook.sfx.sizzle(0.8);
      // CK-06 / DAAR-05 / CK-27 (S05-C): the one shared "it went in" puff, never a spray of white dots in the oil
      S.puff(cx, cy - bodyR * 0.2, col, z.L(50));
      if (stage(state) < 1) setPot("seeds");
      await Cook.tween(S, { targets: jar, alpha: 0, angle: 0, duration: 220 });
      jar.destroy();
    };
    while (si < series.length) {
      const group = series[si];
      const next = group[0];
      const r = await St.freePick(z, { items, next, doneOk: false, help });
      steps.poke();
      const id = r.id;
      order.push(id);
      if (group.includes(id)) {
        group.splice(group.indexOf(id), 1);
        if (!ctx.guided && !retry) Cook.markRight(id);
        if (ctx.tickItem) ctx.tickItem(id);
        else UI.mission.tickItem(id, ctx.dishAt || 0);
      } else {
        const expected = next;
        const why = flat.includes(id) ? `tadka ${id} before ${expected}` : `put ${id} in the tadka`;
        wrong = wrong || why;
        tadkaWrong = tadkaWrong || why;
        if (!retry && !help) {
          z.listen(false, why);
          // decision 93: what went in instead, for the steps page's "done"
          if (flat.includes(expected)) UI.mission.missItem(expected, ctx.dishAt || 0, { did: id });
          Cook.markMiss(expected);
        }
      }
      const drop = spiceDrop(id);
      pop(z, S, Cook.display(id), cx + bodyR + z.L(190), cy - z.L(150), { speakId: id, ms: 1000 });
      await drop;
      z.progress({ added: id });
      if (!group.length) si++;
      if (si < series.length || !tadkaWrong) continue;
      // decision 51 (DAAR-09): the tadka went in out of order: the seeds come out and it's done again, with help;
      // the third wrong try shows the right way (each spice glows and goes in, in order)
      const rd = redo.wrong("daar:tadka");
      tadkaWrong = null;
      await setPot("oil", 360);
      UI.mission.reopen(flat, ctx.dishAt || 0);
      series = [];
      tadka.forEach((e) => series.push([].concat(e)));
      si = 0;
      if (rd.action === "show") {
        for (const g of series) {
          for (const sid of g) {
            if (!items[sid]) continue;
            S.glow(items[sid], true, { bounce: true });
            await Cook.wait(380);
            S.glow(items[sid], false);
            await spiceDrop(sid);
            order.push(sid);
            if (ctx.tickItem) ctx.tickItem(sid);
            else UI.mission.tickItem(sid, ctx.dishAt || 0);
          }
        }
        break;
      }
      if (Cook.roundLevel(ctx) <= 1) Cook.oops(ctx);
      help = true;
      await tadkaStep(true);
    }
    steps.done();
    if (!wrong && !retry) z.listen(true, "tadka");
    Object.values(items).forEach((o) => S.tweens.add({ targets: [o, o.chip], alpha: 0.35, duration: 300 }));

    // 3. the chopped vegetables, one pile at a time (D9: each row ticks as it goes in), then the daar
    waiting.forEach((o) => o !== dBowl && S.tweens.add({ targets: o, alpha: 1, duration: 200 }));
    const into = async (id, imgs) => {
      Cook.sfx.whoosh();
      await Promise.all(
        imgs.map((b, i) => {
          const a = i * 2.1 + 0.4;
          const rr = 0.2 + ((i * 0.37) % 0.4);
          return S.fly(b, cx + Math.cos(a) * inR * rr, cy + Math.sin(a) * inR * rr, { scale: b.scale * 0.5, duration: 380 + i * 50, arc: z.L(90) });
        })
      );
      imgs.forEach((b) => S.tweens.add({ targets: b, alpha: 0, duration: 260, onComplete: () => b.destroy() }));
      Cook.sfx.sizzle(1);
      S.puff(cx, cy, 0xfff1c0, z.L(50));
      addVeg(id);
    };
    Cook.daarPhase = "piles";
    let left = Object.keys(hits);
    if (left.length) steps.to("daar:veg"); // T13: [Put the vegetables in]
    while (left.length) {
      const pick = {};
      left.forEach((id) => (pick[id] = hits[id]));
      Object.values(pick).forEach((h) => S.tweens.add({ targets: piles[h.wordId] || h, scale: "*=1.05", duration: 480, yoyo: true, repeat: -1, ease: "Sine.easeInOut" }));
      const r = await St.freePick(z, { items: pick, next: left[0], doneOk: false });
      left.forEach((id) => S.tweens.killTweensOf(piles[id] || hits[id]));
      left.forEach((id) => (piles[id] || []).forEach((im) => im.setScale(z.L(heapSize(id)) / Math.max(im.width, im.height))));
      if (vbowl) vbowl.setScale(z.L(230) / 484);
      left = left.filter((id) => id !== r.id);
      if (r.id === "bowl") {
        // the bowl tips in: everything in it goes at once
        await S.fly(vbowl, cx - bodyR * 0.8, cy - bodyR * 0.4, { duration: 360, arc: z.L(60) });
        await Cook.tween(S, { targets: vbowl, angle: 60, duration: 200 });
        chopped.rows.forEach((id) => {
          mix |= VEG_BIT[id] || 0;
          wentIn.add(id);
        });
        addVeg(null);
        Cook.sfx.sizzle(1);
        S.tweens.add({ targets: vbowl, alpha: 0, duration: 300 });
        if (ctx.closeItem) ctx.closeItem(chopped.rows);
        else UI.mission.closeItem(chopped.rows, ctx.dishAt || 0);
      } else {
        await into(r.id, piles[r.id] || []);
        hits[r.id].destroy();
        pop(z, S, Cook.display(r.id), cx + bodyR + z.L(190), cy - z.L(150), { speakId: r.id, ms: 900 });
        if (ctx.closeItem) ctx.closeItem([r.id]);
        else UI.mission.closeItem([r.id], ctx.dishAt || 0);
      }
      z.progress({ added: r.id });
      await Cook.wait(200);
    }
    Cook.daarPhase = "veg-in";
    // the daar: its bowl on the trivet tips into the pot, over the tadka. DAAR-10 (D4): only the bowl lifts (the art run's
    // split pictures, else the one picture split here); the mat left behind fades once it's poured (DAAR-33, decision 13)
    steps.to("daar:daar"); // T13: [Put the daar in]
    const split = splitTrivet(S, dBowl, plainKey === "dv3-trivet-plain" ? TRIVET_PLAIN : TRIVET);
    S.tweens.add({ targets: dBowl, alpha: 1, duration: 200 });
    S.tweens.add({ targets: dBowl, scale: dBowl.scale * 1.05, duration: 480, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    await tapOnce(z, S, dBowl, "daar", { glow: z.guided });
    steps.done();
    S.tweens.killTweensOf(dBowl);
    const mat = split.lift();
    // SH-117 (DAAR-28, 17 Oct: "a better animation for the daal pouring into the pot ... like the chai one"): the shared
    // pour (js/shared/pour.js): the bowl lifts to the pot's rim and tips its near edge down, a stream of daal falls into
    // the pot and the pot fills (its picture fades to the daar) while it runs, then it tips back and goes
    {
      const rim = BOWL_IN * dBowl.width * dBowl.scaleX;
      let pour = null;
      let filling = false;
      dBowl.setDepth(D.item + 0.3);
      // s08 w6B (DAAR-29): the vessel pouring the daal is part of the pot's picture while it pours (named so, the evidence
      // probes' canvas:pot crop takes it in whole and never cuts it at the crop's edge; it fades out after, alpha 0)
      dBowl.setName("daar-pour-pot");
      // (the pool: the pot's daal picture over the masala, seen only inside the growing circle; a geometry mask draws in
      // the canvas renderer too)
      const pool = S.track(discAt(S.add.image(cx, cy, discTex(S, "daar"))).setRotation(contents.rotation).setDepth(D.item + 0.07).setAlpha(0));
      const poolMask = S.make.graphics({ add: false });
      pool.setMask(poolMask.createGeometryMask());
      await NjgPour.phaser(S, {
        obj: dBowl,
        lip: [-rim, 0],
        // SH-117 (s08 w6J; the judge, 20 Oct: "no stream ... no rising fill"): the lip is held over the pot's far rim, so the
        // stream is seen falling across the masala to the middle, and the pour runs long enough to watch the daal rise
        lipTo: { x: cx + inR * 0.78, y: cy - inR * 1.02 },
        tilt: -38,
        squash: 0.14,
        colour: 0xe09a12,
        // (s08 w6G, SH-117: a stream thick enough to read as daal falling, and its pool spreading out from where it lands
        // over the masala until it fills the pot, under the rim; then the pot's own daal picture takes over)
        width: z.L(40),
        depth: D.item + 0.25,
        surface: () => ({ x: cx + inR * 0.12, y: cy + inR * 0.04 }),
        arc: z.L(50),
        away: { x: cx + bodyR * 1.3, y: cy - bodyR * 0.9 },
        fade: true,
        ms: { lift: 420, tip: 280, pour: 1900, untip: 220, back: 300 },
        onPhase: (ph) => {
          if (ph === "pour" && !pour) pour = Cook.sfx.pourLoop ? Cook.sfx.pourLoop() : null;
          if (ph === "untip" && pour && pour.stop) {
            pour.stop();
            pour = null;
          }
        },
        onFill: (u) => {
          // the pot's own daal picture, uncovered in a circle that grows from where the stream lands until it fills the pot
          if (u > 0.001 && poolMask) {
            const e = Math.min(1, u);
            // (it rises from a small pool where the stream lands: a third of the pot halfway through the pour, full at its end)
            const r = inR * (0.12 + 1.0 * Math.pow(e, 1.1));
            poolMask.clear();
            poolMask.fillStyle(0xffffff, 1);
            poolMask.fillCircle(cx + inR * 0.12 * (1 - e), cy + inR * 0.04 * (1 - e), r);
            pool.setAlpha(1);
          }
          if (u < 0.97 || filling) return;
          filling = true;
          setPot("daar", 200);
        },
      });
      if (pour && pour.stop) pour.stop();
      dBowl.setAlpha(0);
      await setPot("daar", 120);
      pool.clearMask();
      pool.destroy();
      poolMask.destroy();
    }
    // DAAR-33 (P52, decision 13; reverses DAAR-10): the mat the daar stood on fades away once it has been poured, so it
    // never peeks out under the speed dial or lies beside the served bowl's own
    if (mat) {
      const gone = [mat, mat.shadow].filter(Boolean);
      S.tweens.add({ targets: gone, alpha: 0, duration: 420, onComplete: () => gone.forEach((o) => o.active && o.destroy()) });
    }
    Cook.daarMat = () => !!(mat && mat.active && mat.alpha > 0.02); // (for the evidence probes: is the mat still on the counter?)
    pop(z, S, Cook.display("cook-daal"), cx + bodyR + z.L(190), cy - z.L(150), { speakId: "cook-daal", ms: 1000 });
    await setPot("daar", 300);
    const pieces = [];
    // DAAR-31's flaw (the judge, 20 Oct: "identical toppings in identical places at all four levels"): each round lays the
    // pieces at its own turn of DP1's spots, each a little nearer or further out, so no two pots are the same picture
    const spin = Math.random() * 360;
    // DAAR-05's flaw (s08 w6G: "no white blotches on the pot contents"): the onion is cooked golden in the oil and the
    // ginger-garlic paste is stirred into the daar's own colour, both a little sunk into it, never pale patches on top
    const COOKED = { "dv4-onion": [0xe2a85a, 0.82], "dv4-paste": [0xe8b048, 0.7] };
    [...wentIn].forEach((id) =>
      (DP1[id] || []).forEach(([key, w, spots]) => {
        if (!S.textures.exists(key)) return;
        spots.forEach(([deg, rr], i) => {
          const img = S.track(S.add.image(cx, cy, key).setDepth(D.item + 0.15).setAlpha(0));
          const cooked = COOKED[key];
          if (cooked) img.setTint(cooked[0]);
          img.setScale((inR * w * (0.9 + 0.2 * ((i * 37) % 10) / 10)) / Math.max(img.width, img.height));
          const rOut = Math.min(0.72, Math.max(0.15, rr + (Math.random() - 0.5) * 0.16));
          const piece = { img, a: ((deg + spin) * Math.PI) / 180, r: inR * rOut, turn: ((deg * 7 + spin) % 360) * (Math.PI / 180) };
          img.setPosition(cx + Math.cos(piece.a) * piece.r, cy + Math.sin(piece.a) * piece.r).setRotation(piece.turn);
          S.tweens.add({ targets: img, alpha: cooked ? cooked[1] : 0.92, duration: 400 });
          pieces.push(piece);
        });
      })
    );
    Cook.daarPhase = "daar-in";
    burner.set("low");
    if (sizzle && sizzle.stop) sizzle.stop();
    if (ctx.nextStep) ctx.nextStep("Stir");
    if (K.stirLine && !retry) UI.gist(K.stirLine);
    // T14 (DAAR-12): the stir row (the laps and the speed) shows on the card now. DAAR-26 (P9, Zafar 17 Oct: "I don't think the
    // recipe card should come up and tell you ... we should just keep Nani doing the stirring instructions"; newer than
    // decision 75 (1)'s pop-up for the stir): no pop-up; the row appears quietly (every number she says is written, SH-99) and
    // only Nani says the stir line, once and whole (stir())
    if (UI.mission.reveal) UI.mission.reveal("stir");

    // 4. stir: drag the ladle round (or tap the pot: one turn); the speed dial, the laps as the Kutchi word.
    // Decision 51: the wrong number of stirs is stirred again (the laps start at nothing), with help; the third
    // wrong try is counted right for you and moves on.
    let stirred = 0;
    for (let t = 0; ; t++) {
      const st = await stir(z, S, { cx, cy, inR, bodyR, laps, speed, level, retry: retry || t > 0, steps, pieces, contents });
      stirred = st.count;
      if (!t && !retry) {
        z.listen(stirred === laps, `stirred ${stirred} times, they asked for ${laps}`);
        if (!ctx.guided && laps <= 5) (stirred === laps ? Cook.markRight : Cook.markMiss)(Cook.numId(laps));
        if (st.speedOk != null) z.listen(st.speedOk, `stir speed ${st.asked}${st.corrected ? " (Nani had to say it)" : ""}`);
      }
      if (stirred === laps) break;
      wrong = wrong || `stirred ${stirred} times, they asked for ${laps}`;
      if (redo.wrong("daar:stir").action === "show") break;
      if (Cook.roundLevel(ctx) <= 1) Cook.oops(ctx);
    }
    steps.done();
    burner.set("off");
    return { order, wrong, stirred, pot: { img: pot, cx, cy, bodyR, inR, pieces } };
  }

  /**
   * The speed dial (D7 / Q10), drawn in the kitchen kit's style (no new art): a dark glass face like the
   * hob's, a thin gold rim, four fixed bands (stopped, tortoise, hare, spilling: data.mechanics.stir's bands,
   * the same for every order, never a target), the band you're in lit with the "on" knob's warm glow, a
   * gold needle; and under it the laps, as the Kutchi number word on a white chip (no digits, no pips).
   * x, y: its centre (design px). Returns {set(spd), laps(n), close()}.
   */
  function speedDial(z, S, { x, y, bands, max, asked = null }) {
    const W = 340;
    const H = 330;
    const R = 104;
    const BW = 28;
    const ay = 34; // the arc's centre, in the face
    // (no container: each piece is placed and scaled itself, so the needle's redraws always show)
    const ox = z.X(x);
    const oy = sy(z, y);
    const parts = [];
    const put = (o, dx = 0, dy = 0, dd = 0) => {
      S.track(o.setPosition(ox + dx * z.k, oy + dy * z.k).setScale(z.k).setDepth(D.item + 1 + dd).setAlpha(0));
      parts.push(o);
      return o;
    };
    const g = put(S.add.graphics());
    // the glass face and its gold rim (the hob's glass, the kit's gold)
    g.fillStyle(0x28190a, 0.22);
    g.fillRoundedRect(-W / 2 + 4, -H / 2 + 8, W, H, 28);
    g.fillStyle(0x1d1b1a, 0.96);
    g.fillRoundedRect(-W / 2, -H / 2, W, H, 28);
    g.lineStyle(2, 0xffffff, 0.08);
    g.strokeRoundedRect(-W / 2 + 8, -H / 2 + 8, W - 16, H - 16, 22);
    g.lineStyle(4, INK.gold, 1);
    g.strokeRoundedRect(-W / 2, -H / 2, W, H, 28);
    const [e1, e2, e3] = bands;
    const toA = (v) => Math.PI + Cook.clamp(v / max, 0, 1) * Math.PI;
    // DAAR-12 (D13): the asked speed is green, the other yellow, spilling red (nothing asked: slow green, quick yellow)
    const GREEN = 0x8fb087;
    const YELLOW = 0xe0b04a;
    const BANDS = [
      [0, e1, 0x8a8078],
      [e1, e2, asked === "quick" ? YELLOW : GREEN],
      [e2, e3, asked === "quick" ? GREEN : YELLOW],
      [e3, max, 0xd0604a],
    ];
    // (the bands clearly in their colours on the dark glass: the asked one green, the spill red, DAAR-12)
    BANDS.forEach(([a, b, col]) => {
      g.lineStyle(BW, col, 0.72);
      g.beginPath();
      g.arc(0, ay, R, toA(a) + 0.02, toA(b) - 0.02);
      g.strokePath();
    });
    // the pictures on their bands, in cream (the glass's ink)
    const at = (v, r) => ({ x: Math.cos(toA(v)) * r, y: ay + Math.sin(toA(v)) * r });
    // (R8) the four flat cream icons on their bands, each about a band's width
    // (radii kept inside the face: the band ends lie near the face's left and right edges)
    const spots = [
      [e1 / 2, R + 26],
      [(e1 + e2) / 2, R + 44],
      [(e2 + e3) / 2, R + 48],
      [(e3 + max) / 2, R + 30],
    ];
    if (DIAL_ICONS.every((n) => S.textures.exists(`dv3-dial-${n}`))) {
      DIAL_ICONS.forEach((n, i) => {
        const q = at(...spots[i]);
        const im = S.add.image(0, 0, `dv3-dial-${n}`);
        put(im, q.x, q.y, 0.01);
        im.setScale((z.k * 58) / Math.max(im.width, im.height));
      });
    }
    const ic = put(S.add.graphics(), 0, 0, 0.01);
    if (DIAL_ICONS.every((n) => S.textures.exists(`dv3-dial-${n}`))) ic.setVisible(false);
    const cream = 0xf4ecdf;
    let p = at(e1 / 2, R + 50);
    ic.fillStyle(cream, 0.9);
    ic.fillRoundedRect(p.x - 9, p.y - 10, 6, 20, 2);
    ic.fillRoundedRect(p.x + 3, p.y - 10, 6, 20, 2);
    p = at((e1 + e2) / 2, R + 46);
    tortoise(ic, p.x - 4, p.y, 0.62, cream);
    p = at((e2 + e3) / 2, R + 44);
    hare(ic, p.x, p.y + 10, 0.6, cream);
    p = at((e3 + max) / 2, R + 40);
    splash(ic, p.x + 4, p.y + 6, 0.6, cream);
    const lit = put(S.add.graphics(), 0, 0, 0.02);
    const needle = put(S.add.graphics(), 0, 0, 0.03);
    // the laps: the Kutchi word on a white chip in the face's lower half
    const cg = put(S.add.graphics(), 0, 104, 0.04);
    const ct = put(S.add.text(0, 0, "", { fontFamily: FONT, fontSize: "40px", fontStyle: "800", color: INK.kutchi }).setOrigin(0.5), 0, 104, 0.05);
    const chip = [cg, ct];
    S.tweens.add({ targets: parts.filter((o) => !chip.includes(o)), alpha: 1, duration: 300 });
    let shown = -1;
    const dial = {
      set(spd) {
        const band = BANDS.find(([, b]) => spd < b) || BANDS[BANDS.length - 1];
        lit.clear();
        if (spd > 0.02) {
          // the band you're in, lit, with the warm glow of the "on" knob
          [
            [BW + 26, 0.1],
            [BW + 14, 0.2],
          ].forEach(([w, a]) => {
            // the glow in the band's own colour (an orange glow made the green band read gold)
            lit.lineStyle(w, band[2], a);
            lit.beginPath();
            lit.arc(0, ay, R, toA(band[0]) + 0.02, toA(Math.min(band[1], max)) - 0.02);
            lit.strokePath();
          });
          lit.lineStyle(BW, band[2], 1);
          lit.beginPath();
          lit.arc(0, ay, R, toA(band[0]) + 0.02, toA(Math.min(band[1], max)) - 0.02);
          lit.strokePath();
        }
        const a = toA(spd);
        needle.clear();
        needle.lineStyle(8, 0x0e0d0c, 0.5);
        needle.lineBetween(0, ay + 2, Math.cos(a) * (R - 4), ay + 2 + Math.sin(a) * (R - 4));
        needle.lineStyle(6, 0xf0cf7a, 1);
        needle.lineBetween(0, ay, Math.cos(a) * (R - 4), ay + Math.sin(a) * (R - 4));
        const on = spd > 0.02 ? 1 : 0.4;
        needle.fillStyle(0xffa94d, 0.18 * on);
        needle.fillCircle(0, ay, 30);
        needle.fillStyle(0xffa94d, 0.32 * on);
        needle.fillCircle(0, ay, 21);
        needle.fillStyle(INK.gold, 1);
        needle.fillCircle(0, ay, 14);
        needle.fillStyle(0x3a2410, 1);
        needle.fillCircle(0, ay, 5);
      },
      laps(n) {
        // (past the numbers the words have, the last word stays: never an id on screen)
        if (n === shown || !Lang.known(Cook.numId(n))) return;
        shown = n;
        ct.setText(Lang.plain({ segs: Lang.num(n) }));
        const w = Math.max(110, ct.width + 52);
        cg.clear();
        cg.fillStyle(0xffffff, 1);
        cg.fillRoundedRect(-w / 2, -32, w, 64, 14);
        chip.forEach((o) => o.setAlpha(1));
        S.tweens.add({ targets: chip, scale: z.k * 1.14, duration: 110, yoyo: true });
      },
      close() {
        S.tweens.add({ targets: parts, alpha: 0, duration: 300 });
      },
    };
    dial.set(0);
    return dial;
  }
  /** The dial's pictures, in one ink on the dark glass (after the stir mechanic's placeholders). */
  function tortoise(g, x, y, s, col) {
    g.fillStyle(col, 0.9);
    [-1, 1].forEach((dx) => [-1, 1].forEach((dy) => g.fillCircle(x + dx * 17 * s, y + dy * 11 * s, 7 * s)));
    g.fillCircle(x + 30 * s, y - 2 * s, 9 * s);
    g.fillEllipse(x, y, 50 * s, 34 * s);
    g.lineStyle(3 * s, 0x1d1b1a, 1);
    g.strokeEllipse(x, y, 38 * s, 24 * s);
  }
  function hare(g, x, y, s, col) {
    g.fillStyle(col, 0.9);
    g.fillEllipse(x - 4 * s, y + 4 * s, 46 * s, 28 * s);
    g.fillCircle(x + 20 * s, y - 8 * s, 12 * s);
    g.fillEllipse(x + 14 * s, y - 30 * s, 9 * s, 30 * s);
    g.fillEllipse(x + 24 * s, y - 30 * s, 9 * s, 30 * s);
    g.lineStyle(3 * s, col, 0.8);
    [-2, 8].forEach((dy) => g.lineBetween(x - 52 * s, y + dy * s, x - 36 * s, y + dy * s));
  }
  function splash(g, x, y, s, col) {
    g.fillStyle(0xd0604a, 0.95);
    g.fillEllipse(x, y + 10 * s, 44 * s, 14 * s);
    [
      [-18, -10, 6],
      [0, -22, 8],
      [18, -12, 6],
      [-8, -34, 4],
      [12, -34, 4],
    ].forEach(([dx, dy, r]) => g.fillCircle(x + dx * s, y + dy * s, r * s));
  }

  /**
   * Stir `laps` times: a drag round the pot counts a lap per full turn; a tap on the pot is one turn. The
   * pictured contents turn with the ladle (D10: the tadka picture, clipped inside the rim; the swirl picture
   * comes up as you go faster). speed: null | "slow" | "quick" (said from level 2, judged by the ear only).
   */
  function stir(z, S, { cx, cy, inR, bodyR, laps, speed, level, retry, steps, pieces = [], contents }) {
    return new Promise((resolve) => {
      const ctx = z.ctx;
      const hide = St.hideKnown(ctx);
      const k = Mech.knobs("stir", { level });
      const bands = k.bands || [0.12, 0.9, 2.2];
      const [e1, e2, e3] = bands;
      const asked = k.speeds ? speed || null : null;
      const trackR = inR * 0.62;
      // the turning contents (DAAR-29, s08 w4A): the pot's daar disc itself turns about its centre under the still rim (drawn
      // over it: rimTex), and DP3's stirred swirl comes up over it as you go faster, turning a little faster
      const still = contents;
      const swirl = S.track(S.add.image(cx, cy, discTex(S, "stirred")).setDepth(D.item + 0.1).setAlpha(0));
      swirl.setScale((bodyR * POT2.disc) / POT2.r / (swirl.width / 2));
      swirl.setName("daar-pot-swirl");
      /*
       * DAAR-30 (P49, Zafar 17 Oct: "a little racing flag to mark the start and end of one revolution ... at the 12 o'clock
       * position, and every time you go past it it makes a bit of a sound, she says the number and the number changes"): a
       * small chequered flag on the rim at 12 o'clock. The ladle starts under it, and a turn counts as the ladle passes it.
       */
      const flag = stirFlag(z, S, cx, cy - bodyR + z.L(4));
      // the ladle (D6): top-down, its bowl in the daar and the handle rising toward us
      const ladle = S.track(S.add.image(cx, cy - trackR, "dv3-ladle").setDepth(D.item + 0.6).setOrigin(LADLE.cx, LADLE.cy));
      ladle.setScale((inR * 0.3) / (LADLE.r * LADLE.w));
      const ringG = S.track(S.add.circle(cx, cy - trackR, z.L(44), 0xffffff, 0).setStrokeStyle(z.L(6), 0xfff3c4, 0.9).setDepth(D.fx - 1));
      S.tweens.add({ targets: ringG, scale: 1.25, alpha: 0.35, duration: 520, yoyo: true, repeat: -1 });
      const dial = speedDial(z, S, { x: 1260, y: 400, bands, max: k.dialMax || 3, asked });
      let count = 0;
      let ang = FLAG_AT; // the ladle's angle: it starts under the flag
      let rot = 0; // the contents' turn
      let since = 0; // turned (signed) since the last lap
      let lapT = performance.now(); // when the last lap ended (or the stir began)
      let saying = null; // the last number said, while it is being said
      let prev = null;
      let over = false;
      let moved = 0;
      let spd = 0;
      let spdJ = 0;
      let start = null;
      let dragging = false;
      let wrongT = 0;
      let nudges = 0;
      let corrected = false;
      let judged = 0;
      let inAsked = 0;
      let overT = 0;
      let lastSpill = -1e9;
      let spills = 0;
      let graceUntil = 0;
      const offs = [];
      Cook.stirCount = () => count;
      Cook.stirSpeed = () => spd;
      // (for build/shoot_daar_v3.py: stir at a steady real speed, laps per second, through turn() as a drag
      // does; the headless browser's mouse is too slow to reach the hare band)
      Cook.stirDrive = (rate, ms) =>
        new Promise((done) => {
          dragging = true;
          const t0 = performance.now();
          let tl = t0;
          const step = () => {
            const now = performance.now();
            let da = TAU * rate * (Math.min(500, now - tl) / 1000);
            while (da > 0) {
              turn(Math.min(0.5, da));
              da -= 0.5;
            }
            tl = now;
            if (now - t0 < ms && !over) requestAnimationFrame(step);
            else {
              dragging = false;
              done();
            }
          };
          requestAnimationFrame(step);
        });
      const post = () =>
        // past the laps the player is steered to Done, but the step stays open: stirring on still counts, the child says
        // when it's enough (C10, NN6; contract-2, s04-fxc)
        z.expect(count < laps ? { kind: "stir", x: cx, y: cy, rx: trackR, ry: trackR, target: laps, speed: asked, count: () => count } : { kind: "click", selector: "#done-btn", open: true });
      const place = () => {
        ladle.setPosition(cx + Math.cos(ang) * trackR, cy + Math.sin(ang) * trackR);
        ladle.setRotation(ang - LADLE_HANDLE); // DAAR-11: the handle points out over the rim, wherever the ladle is
        ringG.setPosition(ladle.x, ladle.y);
        still.setRotation(rot);
        swirl.setRotation(rot * 1.7);
        // DAAR-05: what went in turns with the daar
        pieces.forEach((p) => p.img.active && p.img.setPosition(cx + Math.cos(p.a + rot) * p.r, cy + Math.sin(p.a + rot) * p.r).setRotation(p.turn + rot));
      };
      const lap = (da = 0) => {
        count++;
        const now = performance.now();
        const period = now - lapT;
        lapT = now;
        // the flag's sound as the ladle passes it, the flag flutters, and the number on the dial changes at once
        (Cook.sfx.click || Cook.sfx.bubble || Cook.sfx.soft)();
        flag.wave();
        dial.laps(count);
        // DAAR-24 retired (Zafar, 14 Oct, D12): the laps are said aloud at every level, the stir's own exception to the
        // counting rule; the line carries role "laps" so the counting check (contract-19) knows it is not counting along.
        // DAAR-27 (P10: "the counting doesn't keep up with the turns ... say it within like three quarters of one revolution"):
        // the number is said the moment the ladle passes the flag. It waits behind nothing but the number before it (the one
        // queue drops an older number still waiting); while Nani is still saying a line (her stir line, when the child starts
        // at once) the number is not said late: it is left out and the next one is said (P10: "a late number is dropped")
        const V = Cook.core && Cook.core.voice;
        const busy = !saying && !!(V && V.busy && V.busy("cook"));
        let said = "mute";
        if (!(UI.naniMuted && UI.naniMuted())) {
          if (busy) said = "quiet";
          else {
            said = "ok";
            const mine = Lang.speak(Lang.role(Lang.numLine(count), "laps"), { kind: "count" }).catch(() => {});
            saying = mine;
            mine.then(() => saying === mine && (saying = null));
          }
        }
        // (the log: the ladle's angle from the flag after the move that passed it, that move's size, the lap's time; lib/contract-daal.mjs)
        const deg = (a) => Math.round(a * (180 / Math.PI));
        const at = deg(((((ang - FLAG_AT) % TAU) + TAU + Math.PI) % TAU) - Math.PI);
        stirNote("stir-lap", count, `deg:${at} da:${deg(Math.abs(da))} ms:${Math.round(period)} ${said}`);
        z.progress({ lap: count });
        // SH-58: the laps are done: the ✓ is the only thing left, and glows (a station's first plays; level 1 only: later the glow would give the count away)
        if (count === laps && Cook.roundLevel(ctx) <= 1 && UI.doneGlows && UI.doneGlows()) UI.glowDone(true);
        post();
      };
      // which turn round the flag an angle is in (the flag's line lies between two)
      const lapOf = (a) => Math.floor((a - FLAG_AT) / TAU);
      const turn = (da) => {
        const before = ang;
        ang += da;
        since += da;
        moved += Math.abs(da);
        rot += da * 0.55;
        place();
        // DAAR-30: a lap counts as the ladle crosses the flag going the way it is going, after most of a turn (3/4) that way
        // since the last one: stirring back and forth under the flag never counts; either way round does
        if (lapOf(before) !== lapOf(ang) && Math.abs(since) >= TAU * 0.75 && Math.sign(since) === Math.sign(da)) {
          since = 0;
          lap(da);
        }
      };
      /** Daar slops over the rim where the ladle is (way too fast). */
      const spill = () => {
        Cook.sfx.puff ? Cook.sfx.puff() : Cook.sfx.soft();
        for (let i = 0; i < 6; i++) {
          const a = ang + 0.2 + Math.random() * 0.6;
          const x0 = cx + Math.cos(a) * inR;
          const y0 = cy + Math.sin(a) * inR;
          const out = z.L(50 + Math.random() * 70);
          const dot = S.track(S.add.circle(x0, y0, z.L(6 + Math.random() * 7), 0xe0a42c, 1).setDepth(D.fx));
          S.tweens.add({ targets: dot, x: x0 + Math.cos(a) * out, y: y0 + Math.sin(a) * out, alpha: 0, duration: 700, ease: "Cubic.easeOut", onComplete: () => dot.destroy() });
        }
      };
      offs.push(
        z.on("pointerdown", (p) => {
          const d = Math.hypot(p.worldX - cx, p.worldY - cy);
          if (d > inR * 1.35) return;
          prev = Math.atan2(p.worldY - cy, p.worldX - cx);
          ringG.setVisible(false);
          dragging = true;
          if (!graceUntil) graceUntil = performance.now() + 700;
          start = { t: performance.now(), moved: 0 };
        }),
        z.on("pointermove", (p) => {
          if (prev == null || over) return;
          const a = Math.atan2(p.worldY - cy, p.worldX - cx);
          let da = a - prev;
          if (da > Math.PI) da -= TAU;
          if (da < -Math.PI) da += TAU;
          prev = a;
          if (Math.abs(da) > 1.3) return; // a jump isn't a stir
          if (start) start.moved += Math.abs(da);
          turn(da);
        }),
        z.on("pointerup", () => {
          // a tap on the pot (no drag): the ladle goes round on its own, on past the flag (one lap a tap)
          if (start && start.moved < 0.3 && performance.now() - start.t < 400 && !over) {
            const o = { v: 0 };
            let lastV = 0;
            let rest = TAU - ((((ang - FLAG_AT) % TAU) + TAU) % TAU);
            if (since + rest < TAU * 0.75) rest += TAU;
            S.tweens.add({
              targets: o,
              v: rest + 0.03,
              duration: 700,
              ease: "Sine.easeInOut",
              onUpdate: () => {
                turn(o.v - lastV);
                lastV = o.v;
              },
            });
          }
          prev = null;
          start = null;
          dragging = false;
        })
      );
      let lastT = performance.now();
      const stopTick = z.tick(() => {
        const now = performance.now();
        const dt = Math.min(0.25, Math.max(0.001, (now - lastT) / 1000));
        lastT = now;
        // the speed: real laps per second, smoothed so the needle glides
        const raw = moved / TAU / dt;
        moved = 0;
        spd += (raw - spd) * (1 - Math.exp(-dt / (k.smoothS || 0.35)));
        spdJ += (raw - spdJ) * (1 - Math.exp(-dt / (k.judgeS || 0.15)));
        dial.set(spd);
        // the swirl picture comes up as you go faster
        swirl.setAlpha(Cook.clamp((spd - e1) / (e2 - e1), 0, 1) * 0.9);
        if (over) return;
        // the asked speed (the ear only): time on the asked side while stirring; Nani says it again
        if (asked && dragging && spdJ > e1 * 0.5 && now > graceUntil) {
          const right = (spdJ < e2 ? "slow" : "quick") === asked;
          judged += dt;
          if (right) {
            inAsked += dt;
            wrongT = 0;
          } else if ((wrongT += dt) * 1000 >= (k.correctMs || 1600)) {
            wrongT = 0;
            if (nudges < (k.maxNudges || 2)) {
              nudges++;
              corrected = true;
              z.say(Lang.line(k.speedWords[asked]), { hide }).catch(() => {});
            }
          }
        }
        // way too fast: it slops over the rim
        if (dragging && spd > e3) {
          overT += dt;
          if (overT * 1000 >= (k.spillMs || 250) && now - lastSpill > (k.spillGapMs || 700)) {
            lastSpill = now;
            spills++;
            spill();
            if (spills === 1) Cook.oops(ctx); // R6 (S02-A hook): no arre re
          }
        } else overT = 0;
      });
      place();
      /*
       * DAAR-26, DAAR-32 (P9, P51; decision 13): Nani says the stir line ONCE and WHOLE as the stir opens, at every level, L1
       * too: the verb, how many and how fast ("Firai! Trae! Jaldi jaldi."), never the count first and the verb seconds later.
       * It is the engine's nearest whole line, three recorded pieces, until Mum records the one sentence (DAAR-26 waits on
       * her); the step call says it (role call, the level table), and the help ladder says it again only after the pause.
       */
      const said = asked && k.speedWords ? Lang.join([Lang.numLine(laps), Lang.line(k.speedWords[asked])]) : Lang.numLine(laps);
      const stepLine = Lang.join([St.guideLine("daar:stir"), said]);
      if (steps) steps.to("daar:stir", { line: stepLine, hide, force: retry });
      else if (!retry) z.say(stepLine, { hide }).catch(() => {});
      Cook.markSeen(Cook.numId(laps));
      post();
      UI.done({ glow: false }).then(() => {
        over = true;
        offs.forEach((o) => o());
        Cook.stirCount = null;
        Cook.stirSpeed = null;
        Cook.stirDrive = null;
        z.expect({ kind: "wait" });
        S.tweens.killTweensOf(ringG);
        ringG.destroy();
        setTimeout(() => stopTick && stopTick(), 400);
        dial.close();
        S.tweens.add({ targets: ladle, alpha: 0, duration: 300 });
        flag.close();
        // (stirred, the swirl stays: the daar looks stirred; not stirred at all, it goes)
        S.tweens.add({ targets: swirl, alpha: count > 0 ? 0.9 : 0, duration: 300 });
        const speedOk = asked && judged * 1000 >= (k.minJudgeMs || 500) ? !corrected && inAsked / judged >= (k.okFrac || 0.6) : asked && corrected ? false : null;
        resolve({ count, asked, speedOk, corrected, spills });
      });
    });
  }

  /*
   * DAAR-10 (D4): the trivet stays on the counter; only the bowl tips into the pot. With the art run's two pictures
   * (art.s02 "daar-bowl", "daar-trivet") they're used as they are; until then the one picture is split here: the
   * bowl (everything inside its rim) lifts away, and the trivet left behind has its middle woven in, from its own ring.
   * Returns {lift()}: call it as the bowl starts to move (the trivet appears under it).
   */
  const BOWL_IN = 0.39; // the steel bowl's rim, as a fraction of the picture's width from its body's centre
  function splitTrivet(S, bowlImg, meta) {
    const key = bowlImg.texture.key;
    const tKey = `${key}-t1`; // (texture keys: the trivet left behind, the bowl lifted)
    const bKey = `${key}-b1`;
    const art = St.hasArt(S, "daar-bowl") && St.hasArt(S, "daar-trivet");
    try {
      if (!art && !S.textures.exists(tKey)) {
        const src = S.textures.get(key).getSourceImage();
        const w = src.width;
        const h = src.height;
        const cx = meta.cx * w;
        const cy = meta.cy * h;
        const rIn = BOWL_IN * w;
        const ring = rIn + (meta.r * w - rIn) * 0.45; // the middle of the woven ring
        const mk = () => {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          return c;
        };
        const tc = mk();
        const tg = tc.getContext("2d", { willReadFrequently: true });
        tg.drawImage(src, 0, 0);
        const d = tg.getImageData(0, 0, w, h);
        const px = d.data;
        const orig = new Uint8ClampedArray(px);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const dx = x - cx;
            const dy = y - cy;
            const rr = Math.hypot(dx, dy);
            if (rr > rIn + 2) continue;
            // the weave carries on inward: the ring's own pixel at this angle, a little darker towards the middle
            const a = Math.atan2(dy, dx);
            const sr = ring - ((rIn - rr) % (ring - rIn > 6 ? (ring - rIn) * 0.9 : 6));
            const sx = Math.round(cx + Math.cos(a) * sr);
            const sy2 = Math.round(cy + Math.sin(a) * sr);
            const si = (Math.max(0, Math.min(h - 1, sy2)) * w + Math.max(0, Math.min(w - 1, sx))) * 4;
            const di = (y * w + x) * 4;
            const k = 0.9;
            px[di] = orig[si] * k;
            px[di + 1] = orig[si + 1] * k;
            px[di + 2] = orig[si + 2] * k;
            px[di + 3] = 255;
          }
        }
        tg.putImageData(d, 0, 0);
        S.textures.addCanvas(tKey, tc);
        const bc = mk();
        const bg = bc.getContext("2d");
        bg.drawImage(src, 0, 0);
        bg.globalCompositeOperation = "destination-in";
        bg.beginPath();
        bg.arc(cx, cy, rIn + 2, 0, Math.PI * 2);
        bg.fill();
        S.textures.addCanvas(bKey, bc);
      }
    } catch (e) {
      return { lift() {} }; // a tainted or missing picture: it tips in whole, as before
    }
    return {
      lift() {
        const tex = art ? St.artKey("daar-trivet") : tKey;
        if (!S.textures.exists(tex)) return null;
        const t = S.track(S.add.image(bowlImg.x, bowlImg.y, tex).setOrigin(bowlImg.originX, bowlImg.originY).setScale(bowlImg.scaleX).setDepth(bowlImg.depth - 0.01));
        if (art) t.setDisplaySize(bowlImg.displayWidth, bowlImg.displayHeight);
        if (bowlImg.shadow) bowlImg.shadow.setVisible(false);
        t.shadow = S.contactShadow(t);
        const bt = art ? St.artKey("daar-bowl") : bKey;
        if (S.textures.exists(bt)) {
          const [dw, dh] = [bowlImg.displayWidth, bowlImg.displayHeight];
          bowlImg.setTexture(bt).setDisplaySize(dw, dh);
        }
        return t; // (DAAR-33: the mat left behind, faded away after the pour)
      },
    };
  }

  /*
   * DAAR-05 (s07 fix round): what is in the served bowl, as one container over the plain bowl (it grows with it): the
   * pot's stirred daar (pot-tadka-v2's contents, cut once to a circle with a soft edge) filling the bowl's daar circle,
   * and the pieces that went in (DP1), each where the stir left it in the pot, scaled from the pot's daar to the bowl's.
   * The plain bowl's daar circle (daar-bowl-trivet-plain-v2, measured on the cut): centre (0.499, 0.497), r 0.322 of w.
   */
  const BOWL_DAAR = { cx: 0.499, cy: 0.497, r: 0.322 };
  function bowlFill(S, bowl, pot) {
    const key = "dv3-bowl-daar";
    // s08 w4A: the pot's own stirred daar disc (DP3), as the pot showed it
    const src = discTex(S, "stirred");
    const R = Math.round(S.textures.get(src).getSourceImage().width / 2);
    if (!S.textures.exists(key)) {
      const img = S.textures.get(src).getSourceImage();
      const ct = S.textures.createCanvas(key, 2 * R, 2 * R);
      const g = ct.getContext();
      g.drawImage(img, 0, 0, 2 * R, 2 * R);
      // the edge fades into the bowl's own daar (no hard line where the two meet)
      const fade = g.createRadialGradient(R, R, R * 0.8, R, R, R);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      g.globalCompositeOperation = "destination-in";
      g.fillStyle = fade;
      g.fillRect(0, 0, 2 * R, 2 * R);
      g.globalCompositeOperation = "source-over";
      ct.refresh();
    }
    const TB = TRIVET_PLAIN;
    // the container's units are the bowl picture's px (it takes the bowl's scale)
    const dx = (BOWL_DAAR.cx - TB.cx) * TB.w;
    const dy = (BOWL_DAAR.cy - TB.cy) * TB.h;
    const rIn = BOWL_DAAR.r * TB.w;
    const box = S.track(S.add.container(bowl.x, bowl.y).setDepth(bowl.depth + 0.01).setAlpha(0).setScale(bowl.scale));
    box.add(S.add.image(dx, dy, key).setScale((rIn * 0.98) / R));
    const k = pot && pot.inR ? rIn / pot.inR : 0; // the pot's daar (world px) to the bowl's (its picture's px)
    ((pot && pot.pieces) || []).forEach((p) => {
      const im = p.img;
      if (!im || !im.active || !k) return;
      const q = S.add.image(dx + (im.x - pot.cx) * k, dy + (im.y - pot.cy) * k, im.texture.key);
      q.setScale(im.scale * k).setRotation(im.rotation).setAlpha(im.alpha || 0.95);
      if (im.isTinted) q.setTint(im.tintTopLeft);
      box.add(q);
    });
    return box;
  }

  /* ---------- serve and taste (§14a): the bowl on its trivet (D5), their face over it ---------- */
  async function serve(z, { who, pot, ok, last }) {
    const S = z.S;
    const ctx = z.ctx;
    z.expect({ kind: "wait" });
    // a bowl of daar, ladled from the pot, on its wooden trivet beside it
    // DAAR-05 (s07 fix round): the bowl shows what went in, stirred: the plain bowl with the pot's own stirred daar in
    // it (its tadka seeds) and DP1's pieces where the stir left them; never the old tadka bowl's dry chilli and curry
    // leaves, which no order puts in. (No plain bowl: the old one, as before.)
    const plain = S.textures.exists("dv3-trivet-plain") && S.textures.exists("dv4-disc-stirred");
    const TB = plain ? TRIVET_PLAIN : TRIVET;
    const bowl = S.track(S.add.image(z.X(1230), sy(z, 450), plain ? "dv3-trivet-plain" : "dv3-trivet").setDepth(D.fx - 2).setAlpha(0));
    const bs = z.L(250) / TB.w;
    bowl.setScale(bs * 0.8);
    bowl.shadow = S.contactShadow(bowl);
    const fill = plain ? bowlFill(S, bowl, pot) : null;
    await Cook.tween(S, { targets: fill ? [bowl, fill] : bowl, alpha: 1, scale: bs, duration: 300, ease: "Back.easeOut" });
    Cook.sfx.pop();
    S.steam(bowl.x, bowl.y - z.L(40), 3);
    // the review (X10 / Q1): their big round face over the bowl, no body, no pretend eating
    const look = await Cook.Kit.review(S, { who, ok: ok || last, x: bowl.x, y: bowl.y - z.L(250), size: z.L(250), k: z.L(1), side: "right" });
    if (ok || last) {
      await Cook.wait(300);
      await look.close();
      return true;
    }
    // not quite: they say their order again (the card has marked the wrong rows), the bowl goes back
    const line = orderLine(ladderOf(ctx));
    if (line) await Promise.race([St.customerSay(ctx, line, { hide: St.hideKnown(ctx) }), Cook.wait(9000)]);
    St.customerDone();
    await Promise.all([look.close(), Cook.tween(S, { targets: bowl, alpha: 0, duration: 460 })]);
    return false;
  }

  Mech.lab("daar", {
    name: "Daar",
    verb: "Chop, tadka, stir",
    async run(L) {
      const R = Cook.Recipes;
      const who = (L.ctx.order && L.ctx.order.who) || "nana";
      const d = R.daal.make(who, { level: L.level });
      // (Cook.daarForce: build/shoot_daar_v3.py --force '{"onions": 0}' shows an order with no onion)
      if (Cook.daarForce) Object.assign(d, Cook.daarForce);
      L.card(d, R.daal.steps(d));
      const run = Cook.data.recipes.daal.run.find((s) => s.do === "daar");
      const env = { d, lists: Cook.data.recipes.daal.lists || {}, vars: {} };
      const p = R._engine.res(Object.assign({}, run, { do: undefined }), env);
      await L.station("daar", Object.assign(p, { who }));
    },
  });
})(window);
