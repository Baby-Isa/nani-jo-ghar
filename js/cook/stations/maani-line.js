/*
 * Combined station: the Maani line, v3 (docs/design-language/ui-design-system.md §11, §13's burner rule;
 * the 29 Sept play-test §5, M3-M9, Q14, Q15: build/reports/archive/maani-v3.md).
 *
 * A two-zone grid, everything centred, aligned on shared lines:
 *  - LEFT (prep): the chakla (rolling board, dark walnut), a faint gold ring etched on it (the size to
 *    roll to; it glows when the maani is right). The velan rolls on its own: no hands anywhere.
 *  - RIGHT (cook): the shared kitchen kit's compact hob with ONE burner and ONE tawa centred on it
 *    (maani keeps one tawa: the game is rolling the next maani while flipping the one on the tawa),
 *    the flames peeking out all round it, the heat ring on the tawa's rim, the person's face and the
 *    knob on the hob's front edge, the flat wooden turner resting on the counter beside the hob.
 *  - THE SHELF BAND (the bottom 30%): under the chakla, the dough piles (wheat, bajri: always both,
 *    straight on the band, no tray), a `🔊 word` chip under each (tap the pile = one ball flies out,
 *    tap the chip = hear it; the word written until it is used right, then the speaker alone: Cook.chipWord,
 *    Zafar, 20 Oct); under the hob, the finished-maani
 *    plates, one per kind, where each cooked maani lands.
 *
 * The flow: tap a dough pile, a ball flies out to the chakla (tap the other pile before you start
 * and it goes back: a slip is free); drag up and down, the velan rolls it out to the ring. Tap the
 * rolled maani and it slides onto the tawa (if the tawa's busy it waits on the board, so roll the
 * next one while this one cooks). On the tawa the ring fills like a clock: tap in the green and
 * the turner flips it (the spotted, half-cooked side up); tap in the green again and the turner
 * lifts it, flat and cooked, onto its plate. Too late and it's burnt (its own picture). The tick,
 * when you think you've made what they asked for; the accuracy badge checks the count of each kind (the
 * target is never shown).
 *
 * Params: order ({kind: n}; kinds "cook-maani", "cook-bajrmaani", or "ph-big+cook-maani" with
 * sizes at level 4). Returns how many were made. Knobs and levels: data/stations/maani-line.json;
 * the tawa's band and rate: data.mechanics.tawa (level 1), made about 15% quicker per level by
 * data.timing.levelSpeed. Art: the v3 set (assets/cook/items/v3/maani/: piles, balls, chakla, velan,
 * tawa, turner, the four flat maani states per kind), the kit's hob, and v2's thali (maani-v2/).
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";
import { NjgServe } from "../../shared/serve.js"; // the kitchen kit's serving (Sprint 18 piece 8): the review faces, the tick and the recast

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const Kit = Cook.Kit;

  const IT = "assets/cook/items/";
  const V3 = IT + "v3/maani/";
  const V4 = IT + "v4/";
  /* ---------- the grid (design px, 1600x900; the canvas is the play area), as chai v2 ---------- */
  const SHELF_TOP = St.SHELF.top; // §3: the scene is the top 70%, the shelf band the bottom 30% (SH-112)
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  /*
   * MAA-24 (Zafar, 9 Nov, mock 38: "slightly increase the size so that the round board is the same size as whatever the cooking thing";
   * the brief: "the board and tawa big"): chai's one-burner hob as tall as the worktop above the tray holds it (was 0.85), the tawa as
   * big as its glass holds it (was 150), and the chakla the tawa's own size across (its drawn diameter within 3% of the tawa's; it was
   * 470 beside a 300 tawa). The roll's sizes, start and the velan follow the board (ROLL_K), so a maani fills the board as before.
   */
  const HOB_K = 0.89;
  const HOB_BOTTOM = SHELF_TOP - 36; // breathing space above the tray (§10)
  const TAWA_R = 180; // the tawa's round body
  const CHAKLA_D = 2 * TAWA_R;
  const ROLL_K = CHAKLA_D / 470; // the roll's design sizes were for a 470 board
  const COL_GAP = 150; // between the chakla and the hob
  // MAA-24 (round 2: "the plates can be a bit bigger"; his yes: brushed steel for maani): the kit's round steel plate (v4/kit/plate-steel)
  const PLATE_D = 196;
  // 29 Sept (X7): the plate's top keeps the band's top gap (the gap under the chips) plus a hop (St.shelfFit's rule)
  const PLATE_Y = SHELF_TOP + (900 - 883) + 8 + PLATE_D / 2;
  const PLATE_PITCH = 232;
  const FAN = [[-17, 9], [17, 3], [-2, -15], [20, -17], [-20, -13]]; // where each maani lands on its plate: fanned, so you can count them
  // MAA-10 (M5, decision 56): a maani sits on the thali's FLAT inner area, never its curled rim. Measured on
  // maani-v2/thali.webp: the flat floor is a circle 0.42 of the picture's width across from its centre.
  const THALI_FLAT = 0.4; // (the steel plate's flat floor, measured on v4/kit/plate-steel: its rim about a tenth of its width)
  // S04 audit (MAA-10 at L4): the largest maani, stacked and fanned, still reached the curled rim. A maani on a plate is
  // a little smaller (0.25 of the plate, was 0.3) and keeps a 9% margin from the rim (the art's edge is not a perfect circle,
  // and each one sits a little askew), so the whole fanned stack stays on the flat floor
  const PLATE_MAANI = 0.25;
  const RIM_MARGIN = 0.09; // of the plate's width
  /** On its kind's plate: the maani's radius and how far its centre may sit off the plate's centre (MAA-10). */
  // SH-256 (the eye judge, 10 Nov: "the maani on the plate is under half its size on the tawa"): a plate that holds one maani has it
  // across its whole flat floor, as near its tawa size as the plate allows; several keep the fanned, countable stack
  const onPlate = (sizeF, alone = false) => {
    const pr = alone ? PLATE_D * (THALI_FLAT - 0.02) * Math.min(1, sizeF) : PLATE_D * PLATE_MAANI * sizeF;
    return { pr, room: Math.max(0, PLATE_D * (THALI_FLAT - RIM_MARGIN) - pr) };
  };
  const CHIP_Y = 860;
  const PIN_W = 484 * ROLL_K; // MAA-12 (M12): a real velan is a little wider than the board: the v3 pin about 10% longer (was 440)
  // 30 Sept (M3, M9 / Q14): the dough piles stand straight on the band (no tray), on this line just above
  // their chips; St.shelfFit sizes them so the gap above equals the gap under the chips (no hop: a pile
  // doesn't bounce, it squashes a little as a ball comes off)
  const PILE_BASE = 828;
  const PILE_K = 0.42; // at most (a pile is 590 px): shelfFit brings it down to the band's rule
  // MAA-24 (round 2: "the three dough balls are now looking better ... the dough balls need to be maybe smaller"; ART-69: top-down things
  // lie on the stone tray): the F6 three-ball heaps from above (v4/maani), one size, centred over their pills, the foot PILE_GAP above
  const PILE_W = 156; // a heap's width on the tray, design px
  const PILE_GAP = 12;
  /* ---------- the v3 art (29 Sept play-test M3-M8; assets/cook/items/v3/maani/, build/cut_cook_v3.py) ----------
   * Measured from the art (meta.json; build/check_vessel_meta.py checks these against it): each round body's
   * centre (cx, cy: fractions of the canvas) and radius (r: of the width). Placed by the body, never the box. */
  const TAWA = { w: 1221, cx: 0.3533, cy: 0.4978, r: 0.3386 }; // M8: the hi-res tawa, handle at right
  const CHAKLA = { w: 726, cx: 0.4988, cy: 0.4988, r: 0.4746 }; // M4: dark walnut (the v3 chakla, kept for build/check_vessel_meta.py)
  // S19 (s19-games-1; the kitchen-and-items run's M1, ART-62): the round walnut board exactly from above (v4/maani/board, 725 x 742:
  // a touch taller than wide), measured on the cut: its middle and its mean radius (356 across, 364.5 down), of w
  const BOARD = { w: 725, cx: 0.4993, cy: 0.4993, r: 0.4965 };
  const DISC_R = 0.44; // every maani state (raw, half, cooked, burnt) shares one canvas: the disc's radius
  const BALL_R = 0.437; // a dough ball's radius (wheat 0.437, millet 0.4347)
  // M6 / Q15: the blade's middle (the origin), its length on screen. MAA-24 (round 2: "the ... spatula, can kind of move further right, or
  // ... be smaller sized"; the brief: "the turner smaller with its handle to the bottom right"): 170 long (was 220), resting right of the
  // hob with its handle down to the right (rest: its angle there; the art's handle leaves the blade 29 degrees above the right)
  const TURNER = { ox: 0.19, oy: 0.73, len: 170, rest: 62 };
  // MAA-24 (round 2: "the handle of the pan ... position it to the bottom right"): the tawa turned so its handle points down to the right
  const TAWA_TURN = 40;
  /*
   * CHAI-89's rule (Zafar, 5 Nov; the orchestrator, 11 Nov: every game, chai's measure in js/cook/stations/chai-tray.js): the play
   * group (top0..bottom0, design px as laid out with no lift, `room` design px kept above it for what appears there) centred between
   * the view's top (16 px in) and the shelf band (28 px above it), never nearer the view's top than 40 px unless that would push
   * it into the band's gap. -> the lift in world px (a raise; Cook.liftZone's unit)
   */
  const centreLift = (z, top0, bottom0, room = 0) => {
    const v = Cook.view || {};
    const k = z.k || 1;
    const viewTop = v.top != null ? v.top : z.Y(0);
    const spanTop = viewTop + 16 * k;
    const spanBot = z.Y(St.SHELF.top - 28);
    const t = z.Y(top0) - room * k;
    const b = z.Y(bottom0);
    let lift = t - (spanTop + (spanBot - spanTop - (b - t)) / 2);
    lift = Math.min(lift, t - (viewTop + 40 * k));
    return Math.round(Math.max(lift, b - spanBot));
  };
  const ART = [
    // S19 (M1, ART-62): the run's round walnut board and its pin, both exactly from above
    ["mv-chakla", V4 + "maani/board.webp"],
    ["mv-velan", V4 + "maani/pin.webp"],
    ["mv-tawa", V3 + "tawa.webp"],
    ["mv-turner", V3 + "turner.webp"],
    ["mv-thali", V4 + "kit/plate-steel.webp"],
    ["mv-pile-maani", V4 + "maani/dough-wheat.webp"],
    ["mv-pile-bajr", V4 + "maani/dough-millet.webp"],
    ["mv-ball-maani", V3 + "dough-ball-wheat.webp"],
    ["mv-ball-bajr", V3 + "dough-ball-millet.webp"],
  ]
    .concat(
      // M5: flat states, brown spots, no puff; a burnt one of its own (no more tinting the done one)
      ["raw", "half", "cooked", "burnt"].flatMap((st) => [
        [`mv-${st}-maani`, `${V3}maani-wheat-${st}.webp`],
        [`mv-${st}-bajr`, `${V3}maani-millet-${st}.webp`],
      ])
    )
    .concat(Kit.art(1, []));

  Mech.combined("maani-line", {
    station: "maani-line",
    view: "marble",
    dataFile: "data/stations/maani-line.json",
    // one drawing space (1:1); the roll zone owns the left column's pointer (a tap on the tawa is not a roll)
    zones: [
      { id: "bowls", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } },
      { id: "roll", mech: "roll", region: [0, 0, 830, SHELF_TOP], footprint: { x: 0, y: 0, w: 830, h: SHELF_TOP } },
      { id: "tawa", mech: "tawa", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } },
    ],
    run: (host, params) => line(host, params),
  });

  async function line(host, params) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const zb = host.zones.bowls;
    const zr = host.zones.roll;
    const zt = host.zones.tawa;
    const zon = zr.child({ id: "rest" }); // "put it on the tawa" (the test plays from its expectation)
    const level = zb.level || 1;
    // (MAA-24: the roll's sizes in the board's own measure, ROLL_K)
    const kRoll0 = Mech.knobs("roll", { level: zr.level });
    const kRoll = Object.assign({}, kRoll0, { radius: kRoll0.radius * ROLL_K, startRadius: kRoll0.startRadius * ROLL_K });
    // the tawa: one, always (the burner rule); its speed from level 1's knobs, quicker per level
    const kTawa = Mech.knobs("tawa", { level: 1 });
    const kLevel = Mech.knobs("tawa", { level: zt.level });
    const speedUp = Math.pow(1 / (1 - (((Cook.data.timing || {}).levelSpeed) || 0.15)), level - 1);
    const [lo, hi] = kLevel.band || kTawa.band;
    // MAA-17 (decision 12; Zafar, 17 Oct: "add on like three quarters of a second ... across all levels for the chapati. Time
    // to flip"): each side's green lasts its old time plus K.flipAddS (0.75 s), at every level. The ring keeps one steady
    // speed, just slower: (hi - lo) / rate is the old window, so the new rate is (hi - lo) / (old window + add). Was 1.42, 1.20,
    // 0.93, 0.79 s on side 1 (L1-L4); now 2.17, 1.95, 1.68, 1.54 s (in the child's time; Cook.speed shortens both alike)
    const addS = Number(K.flipAddS) || 0;
    const slower = (rate) => (hi - lo) / ((hi - lo) / rate + addS);
    const rate1 = slower(kTawa.rate * speedUp);
    const rate2 = slower(kTawa.rate2 * speedUp);
    Cook.maaniWindow = { side1: (hi - lo) / rate1, side2: (hi - lo) / rate2, addS }; // (for the test scripts: the green's length, s)
    // SH-158, the S14 roll-out (MAA-19; the central rules' timed.firstTimeHold): a new player's first flip holds in the green
    // until the tawa is tapped (js/cook/station-lib.js St.firstHold)
    const hold14 = St.firstHold(ctx, "maani-line:flip");
    const types = Object.keys(K.doughs || { "cook-maani": {} });
    const who = (ctx.order && ctx.order.who) || null;
    await St.loadArt(S, ART.concat(Cook.Kit.faceArt(who)));
    const texOf = (t, state) => {
      const key = `mv-${state}-${t === "cook-bajrmaani" ? "bajr" : "maani"}`;
      return S.textures.exists(key) ? key : { ball: "dough-ball", raw: "chapati-raw", half: "chapati-half", cooked: "chapati-puffed", burnt: "chapati-puffed" }[state];
    };
    // how much of its canvas a picture's round body fills (the v3 art has margins): a maani r px across is its disc, not its box
    const bodyOf = (key) => (/^mv-(raw|half|cooked|burnt)-/.test(key) ? DISC_R : /^mv-ball-/.test(key) ? BALL_R : 0.5);
    const discScale = (key, r) => r / (bodyOf(key) * S.texSize(key).w);
    const sizes = K.sizes ? Object.keys(K.sizes).map((id) => ({ id, r: K.sizes[id] * ROLL_K })) : null;
    const rMax = sizes ? Math.max(...sizes.map((s) => s.r)) : kRoll.radius;
    // MAA-21 (Zafar, 9 Nov: "at the beginning, there's a hard stop around the perimeter of, or maybe just inside the perimeter of the
    // rolling board"): before big and small arrive (no sizes yet: MAA-23's lesson brings them and their rings), every roll stops hard at
    // K.rimStop of the chakla's radius, no ring drawn, never a tear (js/cook/mechanics/roll.js rimStop); ?maaniRim=<fraction> tries
    // another place (the lab page's pair: lab/sections/kit-lights.html rim-stop)
    const rimAsked = Number(new URLSearchParams((global.location && global.location.search) || "").get("maaniRim"));
    const rimStop = !sizes && (rimAsked > 0 || K.rimStop) ? (CHAKLA_D / 2) * Math.min(1, rimAsked > 0 ? rimAsked : Number(K.rimStop)) : 0;
    const keyOf = (type, size) => (size ? `${size}+${type}` : type);
    const split = (key) => {
      const parts = key.split("+");
      const type = parts.find((p) => types.includes(p)) || parts[parts.length - 1];
      return { type, size: parts.find((p) => p !== type) || null };
    };
    // what they asked for, {key: n}
    const want = {};
    Object.keys(params.order || {}).forEach((k) => {
      const { type, size } = split(k);
      if (params.order[k] > 0) want[keyOf(type, size)] = params.order[k];
    });

    /* ---------- the scene: the marble's wash, the stone band (the kitchen kit's worktop, piece 4; STD-E3-03) ---------- */
    // (drawn past the design box: the stage fill shows more worktop above and at the sides, Cook.view). No shelf ledge: the piles
    // and the plates sit on the band itself
    Kit.worktop(S, { top: SHELF_TOP, far: FAR });
    St.stoneBand(S, { top: SHELF_TOP, far: FAR, depth: D.bg + 1.2, game: "maani-line" }); // (ART-69: the stone tray: the heaps and plates lie on it)

    // two columns, centred as one block: the chakla | the hob
    const hs = Kit.size(1, HOB_K);
    const left = (1600 - (CHAKLA_D + COL_GAP + hs.w)) / 2;
    const LX = left + CHAKLA_D / 2;
    const RX = left + CHAKLA_D + COL_GAP + hs.w / 2;
    // raised into the middle of a taller stage's worktop (the stage fill)
    // (CHAI-89, the orchestrator 11 Nov: the board and the hob, one block, centred in the view above the band: chai's measure)
    const hob = Kit.hob(S, { n: 1, k: HOB_K, cx: RX, bottom: HOB_BOTTOM - centreLift(zt, HOB_BOTTOM - hs.h, HOB_BOTTOM) });
    const midY = hob.y + hob.h / 2; // the chakla sits on the hob's middle line
    const CH = { x: LX, y: midY };

    /* ---------- the chakla and its gold ring ---------- */
    // M4: the dark walnut chakla, centred by its measured round body
    const board = S.track(S.add.image(CH.x, CH.y, "mv-chakla").setOrigin(BOARD.cx, BOARD.cy).setDepth(D.item - 2));
    board.setScale(CHAKLA_D / 2 / (BOARD.r * board.width));
    board.shadow = S.contactShadow(board);
    // the velan waits along the board's front edge; it lifts off to roll (rollOne draws the rolling one)
    const restPin = S.track(S.add.image(CH.x, CH.y + CHAKLA_D / 2 - 4, "mv-velan").setDepth(D.item - 1));
    restPin.setScale((PIN_W * 0.92) / restPin.width);
    restPin.shadow = S.contactShadow(restPin);
    const pinRest = (on) => S.tweens.add({ targets: restPin, alpha: on ? 1 : 0, duration: 200 });

    /* ---------- the hob: one burner, one tawa, the face and the knob on the front edge ---------- */
    // M7: the flame ring sized to the tawa (as chai's and daar's): its tips peek out past the rim all the
    // way round (flame-high reaches 1.2 x flameR; the v2 0.74 hid it under the tawa but for the gaps)
    const burner = Kit.burner(S, hob, 0, { who, flameR: TAWA_R * 0.95, spread: 62, state: "high" });
    const TW = { x: hob.burners[0].x, y: hob.burners[0].y };
    // M8: the hi-res tawa, placed by its measured body (the handle leaves the box off-centre), as Kit.place does
    const tawa = S.track(S.add.image(TW.x, TW.y, "mv-tawa").setOrigin(TAWA.cx, TAWA.cy).setDepth(D.item - 0.5).setAngle(TAWA_TURN));
    tawa.setScale(TAWA_R / (TAWA.r * tawa.width));
    tawa.shadow = S.contactShadow(tawa, { centerX: TW.x, centerY: TW.y + TAWA_R * 0.08, width: TAWA_R * 2.15, height: TAWA_R * 2.15 });
    const ring = Kit.heatRing(S, { width: 11 });
    // the ring on the tawa's rim, inside the flames (X6: never on the flame tips), outside the maani
    const RING_R = TAWA_R - 14;
    let heat = "high";
    S.tappable(burner.knobHit, () => {
      // the knob: high (the ring runs at its pace), low (slower: more time to roll), off (MAA-11: the flame goes
      // out, nothing cooks, the sizzle stops), then high again
      heat = heat === "high" ? "low" : heat === "low" ? "off" : "high";
      burner.set(heat);
      sizzleSync();
      stepNow();
    });
    // their order said again (the shared kit's piece 18: UI.personSay reads their card along, their face taking the talk motion;
    // the whole order again where their card can't say it)
    const sayOrder = async () => {
      if (who && UI.personSay && (await UI.personSay(who, { obj: burner.face || null }))) return;
      if (UI.mission && UI.mission.replay) UI.mission.replay();
    };
    if (burner.face)
      S.tappable(burner.face, () => {
        // their face: hear what they asked for again (one at a time: never over someone speaking)
        if (!(UI.personSpeaking && UI.personSpeaking())) sayOrder().catch((e) => { if (!(e instanceof Cook.Abort)) throw e; });
        S.tweens.add({ targets: burner.face, scale: burner.face.baseScale * 1.1, duration: 100, yoyo: true });
      });
    // M6 / Q15: the flat wooden turner (the family's tool: a word like "moikyo", to confirm with Mum) rests on
    // the counter right of the hob, blade down by the hob's corner, handle up and away: placed, not floating.
    // It slides under the maani to flip it, and again to lift it off. Its origin is the blade's middle.
    const turnerHome = { x: hob.x + hob.w + 40, y: hob.y + hob.h * 0.3, angle: TURNER.rest };
    const turner = S.track(S.add.image(turnerHome.x, turnerHome.y, "mv-turner").setOrigin(TURNER.ox, TURNER.oy).setDepth(D.item + 3).setAngle(turnerHome.angle));
    turner.setScale(TURNER.len / turner.width);
    if (turner.preFX && S.renderer && S.renderer.type === Phaser.WEBGL) {
      turner.preFX.padding = 12;
      turner.preFX.addShadow(-2, 3, 0.06, 1, 0x000000, 4, 0.35);
    }

    /* ---------- the shelf band: the dough piles (chips) | the finished plates ---------- */
    const order = Cook.shuffle(types.slice());
    const rowXs = (cx, n) => order.slice(0, n).map((_, i) => cx + (i - (n - 1) / 2) * PLATE_PITCH);
    const plate = (x, y, quiet) => {
      const p = S.track(S.add.image(x, y, "mv-thali").setDepth(D.item - 1));
      p.setScale(PLATE_D / p.width);
      p.shadow = S.contactShadow(p);
      if (quiet) p.setAlpha(0.9);
      return p;
    };
    // M3 / Q14: one realistic pile of dough balls per kind, straight on the band (no tray); tap it and one
    // ball flies out. Both piles at one scale (the smaller fit), standing on PILE_BASE by their own bottom.
    const pileKey = (t) => `mv-pile-${t === "cook-bajrmaani" ? "bajr" : "maani"}`;
    const pileK = Math.min(...order.map((t) => (S.textures.exists(pileKey(t)) ? PILE_W / S.texSize(pileKey(t)).w : PILE_K)));
    const PILE_FOOT = CHIP_Y - 46 / 2 - PILE_GAP;
    const plates = order.map((type, i) => {
      const x = rowXs(LX, order.length)[i];
      const key = pileKey(type);
      const img = S.track(S.add.image(x, PILE_FOOT, key).setOrigin(0.5, 1).setScale(pileK).setDepth(D.item - 1));
      // MAA-09 (M2): no drop shadow: the heaps are seen from above, like the balls
      img.baseScale = pileK;
      img.type = type;
      // always more than anyone orders, the same in both, never shown (the pile is one picture): out of
      // balls, the pile goes (a ball put back brings it back)
      img.left = K.ballsPerBowl || 5;
      img.chip = Kit.chip(S, type, x, CHIP_Y, { word: Cook.chipWord(type, ctx), w: 188 });
      return img;
    });
    // SH-255 (the eye judge, 10 Nov: maani's pills about half chai's at 740x320): the pills at chai's size (the kit's fitPills, chai's rule)
    if (Kit.fitPills) Kit.fitPills(S, plates.map((p) => p.chip), { slotW: PLATE_PITCH - 12, y: CHIP_Y, bottom: 896 });
    const pileShow = (pl) => S.tweens.add({ targets: [pl, pl.shadow].filter(Boolean), alpha: pl.left > 0 ? 1 : 0, duration: 250 });
    const plateOf = (type) => plates.find((b) => b.type === type);
    const dones = {};
    order.forEach((type, i) => {
      const x = rowXs(RX, order.length)[i];
      const img = plate(x, PLATE_Y, true);
      // (Fable's maani flaw 1, STD-E1-05: whose plate it is, from the first frame: the asker's face on its rim, as chai's pans carry
      // theirs; the plate's light, if any, takes it in: Cook.Coach.parts reads img.face)
      if (who && Kit.badge) {
        const F = Math.round(PLATE_D * 0.3);
        // (on the rim's corner, clear of a lone maani filling the floor: SH-256, contract-113)
        img.face = S.track(S.add.image(x + PLATE_D * 0.4, PLATE_Y - PLATE_D * 0.4, Kit.badge(S, who)).setDisplaySize(F, F).setDepth(D.item + 0.5));
      }
      dones[type] = { x, y: PLATE_Y, img, n: 0 };
    });

    /* ---------- state ---------- */
    const items = []; // every rolled maani: {sprite, type, size, key, where: board | tawa | plate}
    let chakla = null; // the dough on the board: {type, plate, ball, sprite, busy, started, handle}
    let waiting = null; // a rolled maani waiting on the board for the tawa
    let onTawa = null; // the maani on the tawa: {it, side, v, burnt}
    let finished = false;
    let firstOn = true;
    let doneShown = false;
    let helping = false; // decision 51: a redo round (the right pile glows)
    let lessoning = false; // the reveal lessons are on (the piles wait)
    // (how many maani its plate holds: one alone fills its floor, SH-256)
    const plateHolds = (type) => Object.keys(want).filter((k) => k === type || k.endsWith(`+${type}`)).reduce((a, k) => a + want[k], 0);
    const count = (key, where) => items.filter((it) => it.key === key && (!where || it.where === where)).length;
    const plated = () => items.filter((it) => it.where === "plate");
    /** How many more of this dough the order needs (the plan for the test and for guided glows; never shown). */
    const leftOf = (type) =>
      Object.keys(want)
        .filter((k) => split(k).type === type)
        .reduce((a, k) => a + Math.max(0, want[k] - count(k)), 0) - (chakla && chakla.type === type ? 1 : 0);
    const nextType = () => (plates.find((b) => leftOf(b.type) > 0 && b.left > 0) || {}).type || null;
    const aimFor = (type) => {
      if (!sizes) return 0;
      let best = 0;
      let bestLeft = -Infinity;
      sizes.forEach((s, i) => {
        const l = (want[keyOf(type, s.id)] || 0) - count(keyOf(type, s.id));
        if (l > bestLeft) {
          best = i;
          bestLeft = l;
        }
      });
      return best;
    };
    const wantN = Object.values(want).reduce((a, b) => a + b, 0);
    const idle = () => !chakla && !waiting && !onTawa;
    const glowOn = (obj, on) => {
      if (!obj || !obj.active || !!obj._glowing === on) return;
      obj._glowing = on;
      S.glow(obj, on);
    };
    // (S19: the light's thing on an expectation, kept off its JSON: Cook.Coach.lit)
    const lit = (e, o) => (Cook.Coach && Cook.Coach.lit ? Cook.Coach.lit(e, o) : e);
    const centre = (obj) => {
      const c = S.centre(obj);
      return { x: c.x, y: c.y };
    };
    const step = (label) => {
      const i = (ctx.steps || []).findIndex((s) => String(s).toLowerCase() === label.toLowerCase());
      if (i >= 0 && UI.mission && UI.mission.step) {
        ctx.stepAt = i;
        UI.mission.step(i);
      }
    };
    /** The word pops by the action (§4: the shared kit's word pop, piece 12, Juice.P.pop), and the family clip plays. */
    const wordPop = (id, x, y) => {
      const k = Math.max(1, Kit.textFloor(S, 36)); // never under 14 px as rendered
      global.Juice.P.pop(S, { x, y: y - 16 }, Cook.display(id), { k, depth: D.fx + 4, top: (Cook.view || {}).top || 0 });
      Lang.popWord(id);
    };

    /*
     * S02-B (T11, decision 55): the box is the next step, in step with what glows. The tawa comes first when its
     * maani is in the green (Firai! to flip, [Take it off] on the second side); else the board: [Take a dough
     * ball] -> [Roll it round] -> [Put it on the tawa]. Waiting on the tawa with nothing else to do: empty.
     */
    const steps = St.steps(ctx);
    function stepNow() {
      if (finished) return steps.done();
      const t = onTawa;
      const hot = t && !t.busy && heat !== "off" && t.v >= lo && t.v <= hi;
      // MAA-15 (P7, Zafar 17 Oct: "I didn't hear it the second time ... she should say it the second time"): side 2's step says
      // Firai too (data/cook.json guide maani-line:off; "take it off" waits on Mum), even right after side 1's
      // (contract-70: every timed window's green is called, a second maani's first side too: it was skipped as "just said")
      if (hot) return steps.to(t.side === 1 ? "maani-line:flip" : "maani-line:off", { id: `tawa-${t.side}-${items.indexOf(t.it)}`, again: true });
      if (waiting && waiting.landed && !onTawa) return steps.to("maani-line:tawa", { id: `tawa-on-${items.indexOf(waiting)}` });
      if (chakla && !chakla.busy) return steps.to("maani-line:roll", { id: `roll-${items.length}` });
      if (!chakla && !waiting && nextType()) return steps.to("maani-line:take", { id: `take-${items.length}` });
      steps.done();
    }
    /*
     * SH-228 (the stuck help, chai's method; was MAA-13's ghost finger on the rolled maani, gone with SH-119: one finger, and a tap's
     * light has none, MAA-21): the next thing to do, the pile they need or the rolled maani for the tawa, gets the kitchen kit's stuck
     * help after the level's wait (Cook.Coach.stuck: Nani's helper card or her line, the light whole round the thing, its glow); a
     * glow of the game's own outside the light no more (contract-102, Fable's maani flaw 3)
     */
    let stuck = null;
    const stopStuck = () => {
      if (stuck) stuck.h.close();
      stuck = null;
    };
    function stuckSync(thing, key) {
      if (stuck && stuck.key === key && stuck.thing === thing) return;
      stopStuck();
      if (!thing || !Cook.Coach || !Cook.Coach.stuck || (Cook.Coach.active && Cook.Coach.active())) return;
      const me = { key, thing };
      me.h = Cook.Coach.stuck({ key: "maani-line", thing, current: () => stuck === me && !finished, busy: () => !!(chakla && chakla.busy) || !!(onTawa && onTawa.busy), glow: (on) => thing.active && S.glow(thing, on, { bounce: true, now: true }) });
      stuck = me;
    }

    /* ---------- what's next (the test plays from it; the focal rule; guided glows the answer) ---------- */
    function update() {
      if (finished) return;
      stepNow();
      // MAA-22 (Zafar, 8 Nov: "as it flew onto the pan the dough balls briefly flashed up as highlighted"): the next pile is the next
      // thing only once the maani has landed on the tawa (and the board is free)
      const flying = !!(onTawa && onTawa.flying);
      const need = !chakla && !waiting && !flying ? nextType() : null;
      // (decision 51 and SH-60's help glow on the pile and the rolled maani: the kit's stuck help now, with its light: stuckSync)
      const toTawa = waiting && waiting.landed && !onTawa ? waiting : null;
      if (need) {
        const b = plateOf(need);
        // (the light's thing: the pile whole with its pill, SH-230)
        zb.expect(lit(Object.assign({ kind: "tap", key: "dough", wrongs: plates.filter((o) => o !== b).map(centre) }, centre(b)), { thing: b }));
      } else zb.expect(null);
      zon.expect(toTawa ? lit(Object.assign({ kind: "tap", key: "tawa-on" }, centre(toTawa.sprite)), { thing: toTawa.sprite }) : null);
      stuckSync(need ? plateOf(need) : toTawa ? toTawa.sprite : null, need ? `pile-${need}` : toTawa ? `tawa-on-${items.indexOf(toTawa)}` : null);
      // quiet until they matter (§3): the finished plates, until a maani lands
      Object.values(dones).forEach((d) => d.img.setAlpha(d.n ? 1 : 0.9));
      // SH-238 (Zafar, 8 Nov: no tick button): the line ends by itself once as many maanis as they asked for are made and nothing is
      // on the go (it never says whether each is right: the review does, and a wrong one is redone)
      if (idle() && plated().length >= wantN) {
        if (!doneShown) {
          doneShown = true;
          UI.done().then(() => {
            doneShown = false;
            finish();
          });
        }
      } else if (doneShown) {
        doneShown = false;
        UI.hideDone();
      }
    }

    /** STD-D2-04: a wrong move wiggles and brings the step's hint at once (the kit's rush, and the step box's help). */
    const wrongMove = (obj) => {
      S.wiggle(obj);
      if (Cook.Coach && Cook.Coach.wrong) Cook.Coach.wrong("maani-line");
      steps.help();
    };

    /* ---------- a dough pile -> the chakla -> rolled ---------- */
    async function pick(pl) {
      if (finished || lessoning) return;
      if (waiting) return wrongMove(waiting.sprite); // the board's taken: put that one on the tawa first
      if (chakla && (chakla.busy || chakla.started)) return wrongMove(pl); // one at a time: finish this one first
      if (chakla && chakla.type === pl.type) return;
      if (pl.left <= 0) return wrongMove(pl);
      if (chakla) putBack(chakla);
      // one ball comes off the top of the pile (the art's balls are drawn at the pile's scale) and flies out
      const pc = S.centre(pl);
      // (a heap's ball is about 0.46 of its width across: the flying ball starts at that size)
      // (S19, contract-114: an item keeps its size from step to step: it comes off the heap at the size it is rolled from, so it never
      // grows a third on the way to the board; a ball put back shrinks into its heap as it lands, and goes)
      const ball = { x: pc.x + (Math.random() - 0.5) * pc.w * 0.2, y: pc.y - pc.h * 0.2, scale: discScale(texOf(pl.type, "ball"), kRoll.startRadius), small: discScale(texOf(pl.type, "ball"), pc.w * 0.23) };
      pl.left--;
      pileShow(pl);
      const sprite = S.track(S.add.image(ball.x, ball.y, texOf(pl.type, "ball")).setScale(ball.scale).setDepth(D.item + 3));
      S.tweens.add({ targets: pl, scaleY: pileK * 0.96, duration: 90, yoyo: true, onComplete: () => pl.active && pl.setScale(pileK) });
      const c = { type: pl.type, plate: pl, ball, sprite, busy: true, started: false, handle: {} };
      chakla = c;
      Cook.sfx.pop();
      wordPop(pl.type, CH.x, CH.y - CHAKLA_D / 2 - 10);
      update();
      await S.fly(sprite, CH.x, CH.y, { scale: discScale(sprite.texture.key, kRoll.startRadius), duration: 420, arc: 170 });
      c.busy = false;
      if (chakla !== c || finished) return;
      update();
      pinRest(false);
      const targets = sizes ? sizes.map((s) => ({ id: s.id, r: s.r })) : null;
      const r = await Mech.rollOne(zr, kRoll, CH, {
        dough: sprite,
        board: false,
        tex: { ball: texOf(c.type, "ball"), raw: texOf(c.type, "raw") },
        targets,
        aim: aimFor(c.type),
        quietMs: K.quietMs,
        keep: true,
        patient: true,
        handle: c.handle,
        // (S19: the light's thing is the board, whole; MAA-21: before big and small, the hard stop just inside the board's rim)
        boardThing: board,
        rimStop,
        pinTex: "mv-velan",
        pinW: PIN_W,
        body: bodyOf,
        gold: true,
        onStart: () => {
          c.started = true;
          update();
        },
      });
      pinRest(true);
      if (!r) return; // it went back to its pile
      zr.skill(r.score, "roll");
      chakla = null;
      const it = { sprite: r.sprite, type: c.type, size: r.target || null, key: keyOf(c.type, r.target), score: r.score, where: "board", landed: true };
      it.sizeF = sizes ? Math.sqrt((sizes.find((s) => s.id === it.size) || { r: rMax }).r / rMax) : 1;
      items.push(it);
      waiting = it;
      S.tappable(it.sprite, () => putOn());
      update();
    }
    /** Changed your mind before rolling: the dough goes back onto its pile (§17). */
    function putBack(c) {
      c.handle.cancel && c.handle.cancel();
      chakla = null;
      S.fly(c.sprite, c.ball.x, c.ball.y, { scale: c.ball.small || c.ball.scale, duration: 300 }).then(() => {
        c.sprite.destroy();
        c.plate.left++;
        pileShow(c.plate);
      });
    }

    /* ---------- the board -> the tawa ---------- */
    async function putOn() {
      if (finished || !waiting) return;
      if (onTawa) return wrongMove(waiting.sprite); // the tawa's busy: flip or lift that one first
      const it = waiting;
      waiting = null;
      glowOn(it.sprite, false);
      S.untap(it.sprite);
      it.where = "tawa";
      const t = { it, side: 1, v: 0, busy: true, flying: true };
      onTawa = t;
      if (firstOn) {
        firstOn = false;
        step("Tawa");
      }
      update();
      const sz = discScale(it.sprite.texture.key, TAWA_R * 0.72 * it.sizeF);
      it.sprite.setDepth(D.item + 1);
      await S.fly(it.sprite, TW.x, TW.y, { scale: sz, duration: 380, arc: 90 });
      t.flying = false;
      it.sprite.baseScale = sz;
      if (heat !== "off") Cook.sfx.sizzle(0.4);
      t.busy = false;
      sizzleSync();
      S.tappable(it.sprite, () => tawaTap());
      update(); // (landed: the next pile may be the next thing now, MAA-22)
    }
    let sizzle = null;
    // MAA-11 (M6): the sizzle plays only while something is on a lit tawa
    function sizzleSync() {
      const on = !finished && !!onTawa && heat !== "off";
      if (on && !sizzle) {
        sizzle = Cook.sfx.sizzleLoop();
        S.loops.push(sizzle);
      } else if (!on && sizzle) {
        sizzle.stop();
        sizzle = null;
      }
    }
    S.tappable(tawa, () => tawaTap());
    // the browning as the ring fills: the maani's own colour times a warm tint
    const C = Phaser.Display.Color;
    const brown = (v) => C.GetColor(255, Math.round(255 - v * 45), Math.round(255 - v * 90));

    /** The turner slides its blade under the maani's right edge (from its side of the hob), and back. */
    const turnerTo = (x, y, r) =>
      Cook.tween(S, { targets: turner, x: x + r * 0.62, y: y + r * 0.12, angle: -6, duration: 190, ease: "Sine.easeOut" });
    const turnerHomeTween = () => S.tweens.add({ targets: turner, x: turnerHome.x, y: turnerHome.y, angle: turnerHome.angle, duration: 260, ease: "Sine.easeInOut" });
    const discR = (it) => TAWA_R * 0.72 * it.sizeF;

    async function tawaTap() {
      const t = onTawa;
      if (finished || !t || t.busy) return;
      t.busy = true;
      ring.clear();
      zt.expect(null);
      const it = t.it;
      const sp = it.sprite;
      // contract-8 (decision 95, S05-G): its "ready now" glow goes when it is tapped; it used to stay on, so a cooked
      // maani kept glowing on its plate beside the ✓'s pulse (two things lit at once)
      glowOn(sp, false);
      inBand = false;
      const v = t.v;
      const burnt = v >= 1;
      if (t.side === 1) hold14.end("tawa");
      if (t.side === 1) {
        // the turner flips it: the cooked side comes up, spotted (M5), or burnt if it caught
        await turnerTo(TW.x, TW.y, discR(it));
        Cook.sfx.flip();
        S.tweens.add({ targets: turner, angle: -16, y: turner.y - 10, duration: 110, yoyo: true });
        await Cook.tween(S, { targets: sp, scaleY: 0.02, duration: 110 });
        sp.setTexture(texOf(it.type, burnt ? "burnt" : "half")).setTint(0xffffff);
        sp.baseScale = discScale(sp.texture.key, discR(it));
        sp.setScale(sp.baseScale, 0.02);
        await Cook.tween(S, { targets: sp, scaleY: sp.baseScale, duration: 110 });
        turnerHomeTween();
        t.s1 = burnt ? kTawa.burntScore : S.bandScore(v, lo, hi);
        t.burnt = burnt;
        S.verdict(TW.x, TW.y - TAWA_R - 30, t.s1, { bad: burnt ? "burnt" : "too-early" });
        t.side = 2;
        t.v = 0;
        t.busy = false;
        return;
      }
      // side two: the turner lifts it off. M5: it stays flat (the v2 puffed picture is gone); a good one
      // is the cooked picture, lifted too soon it's still the half-cooked one, too late (or burnt on the
      // first side) the burnt one. A little lift as it comes off, no puff.
      const good = v >= lo && v < 1;
      const state = t.burnt || burnt ? "burnt" : v >= lo ? "cooked" : "half";
      await turnerTo(TW.x, TW.y, discR(it));
      sp.setTexture(texOf(it.type, state)).setTint(0xffffff);
      const dz = discScale(sp.texture.key, discR(it));
      sp.setScale(dz);
      sp.baseScale = dz;
      Cook.sfx.flip();
      await Cook.tween(S, { targets: [sp], scale: dz * 1.03, duration: 150, ease: "Sine.easeOut", yoyo: true });
      S.steam(TW.x, TW.y - 60, good ? 4 : 2);
      const s2 = burnt ? kTawa.burntScore : S.bandScore(v, lo, hi);
      S.verdict(TW.x, TW.y - TAWA_R - 30, s2, { bad: burnt ? "burnt" : "too-early" });
      zt.skill((t.s1 + s2) / 2, "tawa");
      // onto its kind's plate: a fanned stack (you can count them), each one a little askew
      const d = dones[it.type] || Object.values(dones)[0];
      const j = d.n++;
      onTawa = null;
      sizzleSync();
      S.untap(sp);
      sp.setDepth(D.item + 2 + j * 0.01);
      S.tweens.add({ targets: sp, angle: Math.random() * 24 - 12, duration: 450 });
      turnerHomeTween();
      const { pr, room } = onPlate(it.sizeF, plateHolds(it.type) <= 1); // how far its centre may sit off the thali's centre
      const [f0x, f0y] = FAN[j % FAN.length];
      const fk = Math.min(1, room / Math.max(1, Math.hypot(f0x, f0y)));
      const [fx, fy] = [f0x * fk, f0y * fk];
      const fly = S.fly(sp, d.x + fx, d.y + fy, { scale: discScale(sp.texture.key, pr), duration: 450 });
      update();
      await fly;
      it.where = "plate";
      it.state = state;
      // no separate tally: the stack on its plate is the count (§14a's rule, here too)
      // its mini card on the order ticks (one card per maani asked for)
      if (ctx.tickCard) ctx.tickCard(it.key || it.type);
      update();
    }

    // the ring: it fills like a clock on the tawa; ignore it and the maani catches
    let last = performance.now();
    let inBand = false;
    zt.tick(() => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
      last = now;
      const t = onTawa;
      if (!t || t.busy || finished) return;
      const rate = (t.side === 1 ? rate1 : rate2) * (heat === "off" ? 0 : heat === "low" ? 0.6 : 1);
      t.v += rate * dt;
      if (t.side === 1) t.v = hold14.cap(t.v, lo, hi, "tawa");
      const nowIn = t.v >= lo && t.v <= hi;
      if (nowIn !== inBand) {
        inBand = nowIn;
        // (no glow of its own in the green, Fable's maani flaw 3: the kit's heat ring shows the green, Nani says "Firai!", and the
        // first time the coach's light is on it, MAA-19)
        if (nowIn) Cook.sfx.click();
        stepNow();
      }
      // the browning as the ring fills: a warm tint over the raw side, lighter over the spotted side
      t.it.sprite.setTint(brown(Math.min(1, t.v) * (t.side === 1 ? 1 : 0.5)));
      ring.draw(TW.x, TW.y, RING_R, t.v, lo, hi);
      zt.gauge({ level: t.v, lo, hi });
      // (MAA-19: the flip's moment, in the green on its first side: the coach's staged step lights it, the dim and the box round it)
      zt.expect(lit({ kind: "timing", x: TW.x, y: TW.y, key: `tawa-${t.side}`, coach: nowIn ? (t.side === 1 ? "flip" : "off") : null }, { thing: t.it.sprite }));
      if (t.v >= 1) {
        glowOn(t.it.sprite, false);
        inBand = false;
        tawaTap();
      }
    });

    plates.forEach((b) => {
      S.tappable(b, () => pick(b));
    });
    // C3 (E14, MAA-04): changing your mind before rolling sends the ball back to its pile (a tap on the other pile);
    // a rolled or cooked maani can't be unmade (the art shows it), so that's the take-back here
    const undoAt = () => {
        // (not while Nani's "pass me" or a first-time coach is up: only the thing they point at takes a tap)
        if (Cook.paused || (Cook.Coach && Cook.Coach.active())) return null;
      if (finished || !chakla || chakla.busy || chakla.started) return null;
      const other = plates.find((b) => b.type !== chakla.type && b.left > 0);
      return other ? centre(other) : null;
    };
    Cook.undoAt = undoAt;
    step("Roll");
    let finish;
    let finishing = new Promise((resolve) => (finish = resolve));
    // STD-D1-08 (SH-196, contract-98): the reveal lessons, the dotted word then the blurred picture, once the order has landed and
    // before the first pile (the kitchen kit's Cook.Coach.lessons on its first-time gate; the piles wait)
    const gate = Cook.Coach && Cook.Coach.firsts ? Cook.Coach.firsts("maani-line", { round: new Set() }) : null;
    if (gate && Cook.Coach.lessons) {
      lessoning = true;
      await Cook.Coach.lessons({ gate, ctx });
      lessoning = false;
    }
    update();

    /* ---------- the tick: check the count of each kind ----------
     * Decision 51 (CK-23, S02-F) on the kitchen kit's tick and recast (NjgServe.round): a wrong maani is redone on the spot, never
     * the whole line. Each kind the child could make is checked (its count against the order's); the right ones stay on their
     * plates; a wrong one (the other dough, the other size, one too many) is lifted off and taken away, and a missing one's row
     * opens again. The second try has help (the right pile glows); at the third wrong try for that kind the game shows the right
     * way (its pile glows, a cooked maani lands on the plate) and moves on. Only the first try is scored. */
    const serve = Cook.Kit.serve(); // (the kitchen's serve: NjgServe.for(Cook), its well done shown in Nani's box, SH-252)
    const redo = St.redo(ctx);
    let allOk = true;
    let made = {};
    let settled = false; // a redo with nothing left to make (only extras taken away): it ends without another tick
    let extrasGo = Promise.resolve();
    const tally = () => {
      made = {};
      plated().forEach((it) => (made[it.key] = (made[it.key] || 0) + 1));
    };
    const missingOf = (key) => Math.max(0, (want[key] || 0) - count(key, "plate"));
    // every kind on the line (with sizes, each size of each dough), the order's own first
    const kinds = [...new Set(Object.keys(want).concat(types.flatMap((t) => (sizes ? sizes.map((sz) => keyOf(t, sz.id)) : [t]))))];
    /** Take a wrong maani off its plate: it lifts and goes (a cooked maani can't go back into the dough). */
    const takeAway = async (it) => {
      const d = dones[it.type];
      if (d) d.n = Math.max(0, d.n - 1);
      items.splice(items.indexOf(it), 1);
      S.untap(it.sprite);
      await Cook.tween(S, { targets: it.sprite, y: it.sprite.y - 70, alpha: 0, duration: 420, ease: "Sine.easeIn" });
      it.sprite.destroy();
    };
    /** The maani past each kind's count (the last ones made of it). */
    const extras = () => kinds.flatMap((key) => plated().filter((it) => it.key === key).slice(want[key] || 0));
    /** The right way, shown (the third wrong try): its pile glows, then a cooked maani of that kind lands on its plate. */
    const showRight = async (key) => {
      const { type, size } = split(key);
      const pl = plateOf(type);
      if (pl) {
        S.glow(pl, true, { bounce: true });
        wordPop(type, CH.x, CH.y - CHAKLA_D / 2 - 10);
        await Cook.wait(900);
        S.glow(pl, false);
      }
      const d = dones[type] || Object.values(dones)[0];
      const j = d.n++;
      const it = { type, size, key, where: "plate", state: "cooked", shown: true };
      it.sizeF = sizes ? Math.sqrt((sizes.find((s) => s.id === size) || { r: rMax }).r / rMax) : 1;
      const tex = texOf(type, "cooked");
      const from = pl ? S.centre(pl) : { x: CH.x, y: CH.y };
      it.sprite = S.track(S.add.image(from.x, from.y, tex).setDepth(D.item + 2 + j * 0.01).setScale(0.05));
      items.push(it);
      const { pr, room } = onPlate(it.sizeF, plateHolds(it.type) <= 1);
      const [f0x, f0y] = FAN[j % FAN.length];
      const fk = Math.min(1, room / Math.max(1, Math.hypot(f0x, f0y)));
      await S.fly(it.sprite, d.x + f0x * fk, d.y + f0y * fk, { scale: discScale(tex, pr), duration: 520, arc: 120 });
      S.sparkle(d.x, d.y);
      if (ctx.tickCard) ctx.tickCard(key);
    };
    await serve.round({
      items: kinds,
      done: async () => {
        if (!settled) await finishing;
        finished = true;
        Cook.undoAt = null;
        UI.hideDone();
        ring.clear();
        sizzleSync();
        steps.done();
        stopStuck();
        [zb, zon, zt].forEach((z) => z.expect(null));
        plates.forEach((b) => glowOn(b, false));
        tally();
        allOk = kinds.every((key) => (made[key] || 0) === (want[key] || 0));
      },
      check: (key, round) => {
        const { type, size } = split(key);
        const w = want[key] || 0;
        const got = made[key] || 0;
        // the kind as the order says it ("ph-big+cook-maani"): the result card shows "ba wadhi maani"; only the first try is scored
        if (!round && (w || got)) {
          zb.listen(got === w, `made ${got} ${key}, they asked for ${w}`);
          if (!ctx.guided && w) {
            const mark = got === w ? Cook.markRight : Cook.markMiss;
            [Cook.numId(w), type, size].filter(Boolean).forEach((id) => mark(id));
          }
        }
        return { ok: got === w };
      },
      // the review (29 Sept, X10 / Q1): their big round face over the finished plates, happy when the counts are right, a gentle
      // frown when they're not (the card shows which); the step has closed (Done): its rows tick, count rows too (UX 11)
      review: async () => {
        if (ctx.closeItem) ctx.closeItem([], { all: true });
        if (settled || !who) return [];
        // SH-254 (the eye judge, 10 Nov: Nana's face sat across the hob's edge, his hob chip and the first plate's rim and chip): the
        // face beside the plate the maani is on, over its rim's edge only (chai's corner), standing in for that plate's own face chip
        // (one face per person, CK-07), clear of the other plate, the piles, their pills and the hob's face and knob (Kit.praiseSpot)
        const ds = Object.values(dones);
        const dd = ds.reduce((a, d) => (d.n > a.n ? d : a), ds[0]);
        const size = Math.round(PLATE_D * 0.66);
        const box = (o) => (o && o.active && o.visible !== false ? o.getBounds() : null);
        const avoid = ds
          .filter((d) => d !== dd)
          .flatMap((d) => [box(d.img), box(d.img.face)])
          .concat(plates.flatMap((p) => [box(p), box(p.chip)]))
          .concat([box(burner.face), box(burner.knob), box(hob && hob.img)])
          .filter(Boolean);
        const V = Cook.view || {};
        const at = Kit.praiseSpot({ x: dd.x, y: dd.y, w: PLATE_D, h: PLATE_D }, size, { avoid, view: [V.left != null ? V.left : 0, V.top != null ? V.top : 0, V.right != null ? V.right : 1600, 900] });
        if (dd.img.face) dd.img.face.setVisible(false);
        const look = await serve.review(S, { who, ok: allOk, x: at.x, y: at.y, size, side: at.side });
        if (dd.img.face) look.close = ((c) => async () => (await c(), dd.img.face.active && dd.img.face.setVisible(true)))(look.close);
        await Cook.wait(allOk ? 300 : 900);
        return [look];
      },
      oops: () => (zb.oops ? zb.oops() : null),
      recast: () => null, // (the order is said again once the rows have opened: again())
      // the wrong ones go, on every try
      afterReview: () => {
        if (!settled) extrasGo = Promise.all(extras().map(takeAway));
      },
      redo,
      key: (key) => `maani:${key}`,
      showRight: async (key) => {
        await extrasGo;
        for (let i = missingOf(key); i > 0; i--) await showRight(key);
      },
      reset: () => null,
      // their rows open again, they say it again, and the right pile glows (help from the second try); a kind only made too many
      // times has nothing to make again: once its extras have gone the line ends
      // (the kit doesn't wait for this: the next Done is set up at once; the extras have already left the count as they started to go)
      again: (keys) => {
        const need = keys.filter((key) => missingOf(key) > 0);
        if (!need.length) {
          settled = true;
          return;
        }
        finishing = new Promise((resolve) => (finish = resolve));
        extrasGo.then(() => {
          if (UI.mission && UI.mission.reopen) UI.mission.reopen([...new Set(need.flatMap((k) => k.split("+")))], ctx.dishAt || 0);
          sayOrder().catch((e) => {
            if (!(e instanceof Cook.Abort)) throw e;
          });
          helping = true;
          finished = false;
          doneShown = false;
          Cook.undoAt = undoAt;
          update();
        });
      },
    });
    await extrasGo;
    tally();
    Cook.undoAt = null;
    plates.forEach((b) => S.untap(b));
    ctx.result.maani = plated().length;
    ctx.result.maaniKinds = made;
    [zb, zr, zon, zt].forEach((z) => z.close());
    return plated().length;
  }

  Mech.lab("maani-line", {
    name: "Maani line",
    verb: "Plates → chakla → tawa",
    after: "roll-tawa",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.maani.make(L.ctx.order.who, { level: L.level });
      L.ctx.steps = R.maani.steps(d);
      L.card(d, L.ctx.steps);
      await L.station("maani-line", { order: d.maani });
    },
  });
})(window);
