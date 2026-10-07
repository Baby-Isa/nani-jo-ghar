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
 * one chop round, words on the chips; 2 = decoys, the chop's switch, a speed to stir at; 3 = speaker-only
 * chips; 4 = more decoys, and Nana's card starts folded in the cook (a peek costs a hint).
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
  const SHELF_TOP = 666;
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  // a scene piece's y: raised into the middle of a taller stage's worktop (Cook.lift, set per round)
  let LIFT = 0;
  const sy = (z, y) => z.Y(y) - z.L(LIFT);
  const BASE = 818;
  const CHIP_Y = 860;
  const PITCH = 150;
  const SLOT_W = 112;
  const INK = { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf };
  const FONT = "Nunito, sans-serif";
  // the vegetables' own art: word id -> file stem
  const VEG = { "veg-01": "bataato", "veg-02": "dungri", "veg-03": "tameto", "veg-12": "marcha", "veg-13": "lasan", "veg-14": "aadu" };
  const CHOPPED = { "veg-01": "veg-bataato-cubed-t.webp", "veg-02": "veg-dungri-chopped-t.png", "veg-03": "veg-tameto-chopped-t.png", "veg-12": "veg-marcha-chopped-t.png", "veg-13": "veg-lasan-chopped-t.webp", "veg-14": "veg-aadu-chopped-t.png" };
  // 30 Sept (R5): onion, tomato and chilli as real chopped heaps (one heap per chopped vegetable) and one piece
  // each (the piece flies off the knife and lands as its heap), in place of the flower-like v2 piles
  const HEAP5 = { "veg-02": "onion", "veg-03": "tomato", "veg-12": "chilli" };
  const pileUrl = (id) => (HEAP5[id] ? `${V3}chop-heap-${HEAP5[id]}.webp` : IT + CHOPPED[id]);
  /*
   * The v3 pot (D1 art, build/cut_cook_v3.py): nine states on one registered canvas, 430 x 348. Measured from
   * the art (assets/cook/items/v3/daar/meta.json; build/check_vessel_meta.py re-fits them): the round body's
   * centre (cx, cy: fractions of w and h) and radius r (of w), handles left out. inner: the contents' radius
   * (of w), measured on pot-oil / -daar / -tadka along 12 rays (0.33-0.34): the stir's turning layer is
   * clipped a little inside it, so the rim never turns.
   */
  const POT = { w: 430, h: 348, cx: 0.4982, cy: 0.4985, r: 0.3566, inner: 0.325 };
  // 30 Sept (R4): the -only / pairs pots (the same canvas, registered to D1's rim) so an order without onion
  // never shows onion; tadka-v2 has only the mustard and cumin (no dry chilli, no curry leaves: no order has them)
  const POTS = ["empty", "oil", "seeds", "onion", "tomato", "chilli", "daar", "tadka", "stir", "tomato-only", "chilli-only", "onion-chilli", "tomato-chilli", "tadka-v2"];
  // what the pot shows for the pictured vegetables in it so far (onion, tomato, chilli: every mix has its picture;
  // D1's "tomato" is onion + tomato and its "chilli" all three). Another vegetable (garlic, potato) changes nothing.
  const VEG_BIT = { "veg-02": 1, "veg-03": 2, "veg-12": 4 };
  const MIX_POT = ["seeds", "onion", "tomato-only", "tomato", "chilli-only", "onion-chilli", "tomato-chilli", "chilli"];
  // the served bowl on its trivet (528 x 563; its round body, trivet and all: r 0.4833 of w) and the ladle
  // (290 x 455, top-down, the handle rising: its bowl's centre and radius)
  const TRIVET = { w: 528, h: 563, cx: 0.4928, cy: 0.4987, r: 0.4833 };
  // 30 Sept (R3): ladle-v2, a deep steel dipper seen three-quarter on (its bowl: the biggest circle inside it)
  const LADLE = { w: 833, h: 1039, cx: 0.3697, cy: 0.7016, r: 0.3501 };
  // (R4 cell 6) the same bowl of plain daar, no tadka: it waits beside the pot and pours in (the tadka one is the review's)
  const TRIVET_PLAIN = { w: 489, h: 490, cx: 0.4991, cy: 0.4971, r: 0.4619 };
  // (R8) the speed dial's four flat cream icons: stopped, slow (tortoise), fast (hare), too fast (a splash)
  const DIAL_ICONS = ["stopped", "slow", "fast", "spill"];
  // DAAR-13: the margin-safe knife's edge, tip to heel, as fractions of tool-knife-t.png (345 x 296)
  const KNIFE_BLADE = [0.07, 0.08, 0.5, 0.64];
  // DAAR-11 (D6): the ladle's handle leaves its bowl about 57 degrees above the right (ladle-v2.webp); turned so it
  // always points out to the rim, hooked over it, as the ladle goes round
  const LADLE_HANDLE = (-57 * Math.PI) / 180;
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
    const spiceIds = Cook.shuffle([...new Set(flat.concat(St.decoys(K.spiceShelf || [], flat, K.spiceDecoys || 0)))]);
    const laps = p.laps || 3;
    const side = Cook.daarSide || "counter";
    if (Cook.Coach) Cook.Coach.stop(false); // not "seen": the chop's own begin shows it (data.onboard.daar)
    const vegAll = [...new Set(kinds.concat(no, pool))].filter((id) => VEG[id]);
    const art = [
      ["dv2-knife", IT + "tool-knife-t.png"], // DAAR-13: the margin-safe cut (the webp touched its canvas edge: the tip was clipped)
      ["dv3-trivet", V3 + "daar-bowl-trivet.webp"],
      ["dv3-ladle", V3 + "ladle-v2.webp"],
      ["dv3-trivet-plain", V3 + "daar-bowl-trivet-plain.webp"],
      ["dv3-vegbowl", V3 + "veg-bowl.webp"],
    ]
      .concat(POTS.map((st) => [`dv3-pot-${st}`, `${V3}pot-${st}.webp`]))
      .concat(spiceIds.map((id) => [`dv2-shelf-${id}`, shelfUrl(id)]))
      .concat(vegAll.map((id) => [`dv2-chop-${id}`, pileUrl(id)]))
      .concat(vegAll.filter((id) => HEAP5[id]).map((id) => [`dv3-piece-${id}`, `${V3}chop-piece-${HEAP5[id]}.webp`]))
      .concat(DIAL_ICONS.map((n) => [`dv3-dial-${n}`, `${V3}dial-${n}.webp`]))
      .concat(Cook.Kit ? Cook.Kit.faceArt(who) : [])
      .concat(Cook.Kit ? Cook.Kit.art(1, []) : [])
      .concat(St.artLoad(["knife", "daar-bowl", "daar-trivet"])); // S02-B: the art run's knife and split bowl/trivet, once they land
    await Promise.race([St.load(S, art), Cook.wait(12000)]);

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
        const nani = naniCard(want, no, level, kinds.filter((id) => !(id in need)));
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
    if (ctx.nextStep) ctx.nextStep("tadka");
    UI.mission.reveal("tadka");
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
    // level 4 (§14a): Nana's card starts folded (face + headline, no pips); a peek costs a hint
    const peek = K.ladder === "closed" && UI.mission.closeCards;
    if (peek) UI.mission.closeCards(true, { peek: true });
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
  function naniCard(want, no, level = 1, doneIds = []) {
    const M = UI.mission;
    // 30 Sept (Zafar, Q7): from level 3 the chop card is words only ("dungri"); how many is heard, as on the order card
    const parts = (id) => Lang.countParts(want[id], id);
    // (from level 3 the noun keeps the form its count gave it: "trae dungri" is written "dungri")
    const rows = Object.keys(want).map((id) => ({ id, label: Lang.html(level >= 3 ? Lang.phraseUncounted(parts(id)) : Lang.phrase(parts(id))), done: doneIds.includes(id) }));
    // a row is lower case with no full stop (the sidebar's rows: "dungri na")
    const noStop = (html) => String(html).replace(/\.((?:<\/[a-z0-9]+>)*)\s*$/i, "$1");
    no.forEach((id) => rows.push({ id, label: noStop(Lang.html(Lang.asRow(Lang.line("no", Lang.phrase([id]))))), done: false, no: true }));
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
    const kinds = Object.keys(want);
    const line = kinds.length
      ? Lang.join(kinds.map((id, j) => Lang.line(j === 0 ? "only" : Lang.frames().any, Lang.phrase(Lang.countParts(want[id], id)))))
      : null;
    const opts = { say: line ? () => Lang.speak(line) : null };
    M.addCard("daar-chop", data(), opts);
    M.closeCards(true);
    if (UI.guideStrip) UI.guideStrip(true);
    return {
      rows,
      // DAAR-13 (rule E11): at level 1 a row lights the moment its count is reached
      tick(id) {
        const r = rows.find((x) => x.id === id && !x.no);
        if (!r || r.done) return;
        r.done = true;
        M.addCard("daar-chop", data(), opts);
      },
      // the rows she asked for tick; her "don't" row stays neutral (nothing was added)
      tickAll() {
        rows.forEach((r) => !r.no && (r.done = true));
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
    const talk = speakId ? Lang.speakWord(speakId) : line ? Lang.speak(line) : null;
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
        const sc = z.L(w) / src.width;
        img = S.track(S.add.image(z.X(x), z.Y(BASE), key).setOrigin(0.5, 0.97).setScale(sc).setDepth(D.item + 1));
        img.baseScale = sc;
        img.shadow = S.contactShadow(img, { centerX: z.X(x), centerY: z.Y(BASE - 3), width: z.L(w * 0.8), height: z.L(16) });
      } else img = S.ingredient(id, z.X(x), z.Y(BASE - 56), { w: z.L(110), h: z.L(100), label: false, depth: D.item + 1 });
      img.wordId = id;
      const chip = Cook.Kit.chip(S, id, z.X(x), z.Y(CHIP_Y), { word: level < 3, w: Math.min(128, pitch - 12) });
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
    const cut = (await Mech.run("chop", z, { targets: want, pool, no, knifeKey, blade, onSlice, onCount: (id) => nani.tick(id), tally: false, timer: { x: 130, y: 130 } })) || {};
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
    const scale = bodyR / (POT.r * POT.w);
    const potKey = (st) => `dv3-pot-${st}`;
    const pot = S.track(S.add.image(cx, cy, potKey("oil")).setOrigin(POT.cx, POT.cy).setScale(scale).setDepth(D.item));
    pot.shadow = S.contactShadow(pot, { centerX: cx, centerY: cy + bodyR * 0.08, width: bodyR * 2.15, height: bodyR * 2.15 });
    const inR = (bodyR * POT.inner) / POT.r;
    let state = "oil";
    /** The pot's pictured contents change: the next picture fades in over the last (same canvas). */
    const setPot = (st, ms = 420) =>
      new Promise((r) => {
        if (st === state) return r();
        state = st;
        const top = S.track(S.add.image(cx, cy, potKey(st)).setOrigin(POT.cx, POT.cy).setScale(scale).setDepth(D.item + 0.05).setAlpha(0));
        S.tweens.add({
          targets: top,
          alpha: 1,
          duration: ms,
          onComplete: () => {
            pot.setTexture(potKey(st));
            top.destroy();
            r();
          },
        });
      });
    let mix = 0; // the pictured vegetables in the pot so far (VEG_BIT)
    const stage = (st) => (st === "oil" ? 0 : 1);
    /** A chopped vegetable goes in: the pot shows exactly what's in it (R4: no onion unless onion went in). */
    const addVeg = (id) => {
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
    S.steam(cx, cy - bodyR * 0.3, 2);
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
      const obj = items[id];
      const col = St.heapColor(id, 0x8a5a2a);
      S.tweens.add({ targets: obj, scale: obj.baseScale * 1.06, duration: 90, yoyo: true });
      const jar = S.track(S.add.image(obj.x, obj.y - obj.displayHeight * 0.5, obj.texture.key).setScale(obj.baseScale * 0.7).setDepth(D.fx));
      await S.fly(jar, cx + bodyR * 0.45, cy - bodyR * 0.95, { duration: 340, arc: z.L(110) });
      await Cook.tween(S, { targets: jar, angle: -75, duration: 160, ease: "Quad.easeOut" });
      Cook.sfx.sizzle(0.8);
      S.burst(cx, cy - bodyR * 0.2, [col, 0xfff0c0], 12, z.L(50));
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
          if (flat.includes(expected)) UI.mission.missItem(expected, ctx.dishAt || 0);
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
        chopped.rows.forEach((id) => (mix |= VEG_BIT[id] || 0));
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
    // the daar: its bowl on the trivet tips into the pot; the tadka comes up on top. DAAR-10 (D4): the TRIVET
    // STAYS on the counter: only the bowl lifts (the art run's split pictures, else the one picture split here)
    steps.to("daar:daar"); // T13: [Put the daar in]
    const split = splitTrivet(S, dBowl, plainKey === "dv3-trivet-plain" ? TRIVET_PLAIN : TRIVET);
    S.tweens.add({ targets: dBowl, alpha: 1, duration: 200 });
    S.tweens.add({ targets: dBowl, scale: dBowl.scale * 1.05, duration: 480, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    await tapOnce(z, S, dBowl, "daar", { glow: z.guided });
    steps.done();
    S.tweens.killTweensOf(dBowl);
    split.lift();
    const home = { x: dBowl.x, y: dBowl.y, s: dBowl.scale };
    await Cook.tween(S, { targets: dBowl, x: cx + bodyR * 1.05, y: cy - bodyR * 0.7, angle: -35, scale: home.s * 0.9, duration: 420, ease: "Quad.easeInOut" });
    const pour = Cook.sfx.pourLoop ? Cook.sfx.pourLoop() : null;
    await setPot("daar", 700);
    if (pour && pour.stop) pour.stop();
    S.tweens.add({ targets: dBowl, alpha: 0, duration: 300 });
    pop(z, S, Cook.display("cook-daal"), cx + bodyR + z.L(190), cy - z.L(150), { speakId: "cook-daal", ms: 1000 });
    await setPot("tadka-v2", 600);
    Cook.daarPhase = "daar-in";
    burner.set("low");
    if (sizzle && sizzle.stop) sizzle.stop();
    if (ctx.nextStep) ctx.nextStep("Stir");
    if (K.stirLine && !retry) UI.gist(K.stirLine);
    // T14 (DAAR-12): the stir row (the laps and the speed) shows on the card now
    UI.mission.reveal("stir");

    // 4. stir: drag the ladle round (or tap the pot: one turn); the speed dial, the laps as the Kutchi word.
    // Decision 51: the wrong number of stirs is stirred again (the laps start at nothing), with help; the third
    // wrong try is counted right for you and moves on.
    let stirred = 0;
    for (let t = 0; ; t++) {
      const st = await stir(z, S, { cx, cy, inR, scale, laps, speed, level, retry: retry || t > 0, steps });
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
    return { order, wrong, stirred, pot: { img: pot, cx, cy, bodyR } };
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
    BANDS.forEach(([a, b, col]) => {
      g.lineStyle(BW, col, 0.3);
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
            lit.lineStyle(w, 0xffa94d, a);
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
  function stir(z, S, { cx, cy, inR, scale, laps, speed, level, retry, steps }) {
    return new Promise((resolve) => {
      const ctx = z.ctx;
      const hide = St.hideKnown(ctx);
      const k = Mech.knobs("stir", { level });
      const bands = k.bands || [0.12, 0.9, 2.2];
      const [e1, e2, e3] = bands;
      const asked = k.speeds ? speed || null : null;
      const trackR = inR * 0.62;
      // the turning contents: the same pot pictures, masked to the inside of the rim
      const maskG = S.make.graphics({ add: false });
      maskG.fillStyle(0xffffff, 1);
      maskG.fillCircle(cx, cy, inR);
      const mask = maskG.createGeometryMask();
      const layer = (key, a) => {
        const im = S.track(S.add.image(cx, cy, key).setOrigin(POT.cx, POT.cy).setScale(scale).setDepth(D.item + 0.1).setAlpha(a));
        im.setMask(mask);
        return im;
      };
      const still = layer("dv3-pot-tadka-v2", 1);
      const swirl = layer("dv3-pot-stir", 0);
      // the ladle (D6): top-down, its bowl in the daar and the handle rising toward us
      const ladle = S.track(S.add.image(cx + trackR, cy, "dv3-ladle").setDepth(D.item + 0.6).setOrigin(LADLE.cx, LADLE.cy));
      ladle.setScale((inR * 0.3) / (LADLE.r * LADLE.w));
      const ringG = S.track(S.add.circle(cx + trackR, cy, z.L(44), 0xffffff, 0).setStrokeStyle(z.L(6), 0xfff3c4, 0.9).setDepth(D.fx - 1));
      S.tweens.add({ targets: ringG, scale: 1.25, alpha: 0.35, duration: 520, yoyo: true, repeat: -1 });
      const dial = speedDial(z, S, { x: 1260, y: 400, bands, max: k.dialMax || 3, asked });
      let count = 0;
      let ang = 0; // the ladle's angle
      let rot = 0; // the contents' turn
      let acc = 0; // turned since the last lap
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
        z.expect(count < laps ? { kind: "stir", x: cx, y: cy, rx: trackR, ry: trackR, target: laps, speed: asked, count: () => count } : { kind: "click", selector: "#done-btn" });
      const place = () => {
        ladle.setPosition(cx + Math.cos(ang) * trackR, cy + Math.sin(ang) * trackR);
        ladle.setRotation(ang - LADLE_HANDLE); // DAAR-11: the handle points out over the rim, wherever the ladle is
        ringG.setPosition(ladle.x, ladle.y);
        still.setRotation(rot);
        swirl.setRotation(rot);
      };
      const lap = () => {
        count++;
        Cook.sfx.bubble ? Cook.sfx.bubble() : Cook.sfx.soft();
        dial.laps(count);
        if (!(UI.naniMuted && UI.naniMuted())) Lang.speak(Lang.numLine(count)).catch(() => {});
        z.progress({ lap: count });
        post();
      };
      const turn = (da) => {
        ang += da;
        acc += Math.abs(da);
        moved += Math.abs(da);
        rot += da * 0.55;
        place();
        if (acc >= TAU * 0.92) {
          acc = 0;
          lap();
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
          // a tap on the pot (no drag): the ladle goes round once on its own
          if (start && start.moved < 0.3 && performance.now() - start.t < 400 && !over) {
            const o = { v: 0 };
            let lastV = 0;
            S.tweens.add({
              targets: o,
              v: TAU,
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
      // Nani says how many ("Trae!"), and from level 2 how fast ("Trae. Dhire dhire.")
      const said = asked && k.speedWords ? Lang.join([Lang.numLine(laps), Lang.line(k.speedWords[asked])]) : Lang.numLine(laps);
      // T13: the stir step's line is "Firai!" with the laps and the speed ("Firai! Trae! Aste thi.")
      const stepLine = Lang.join([St.guideLine("daar:stir"), said]);
      if (!steps) {
        if (!retry) z.say(said, { hide }).catch(() => {});
      } else if (Cook.roundLevel(ctx) <= 1) steps.to("daar:stir", { line: stepLine, hide, force: retry });
      else {
        z.say(said, { hide })
          .catch(() => {})
          .then(() => !over && steps.to("daar:stir", { line: stepLine, hide, quiet: true, force: retry }));
      }
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
        S.tweens.add({ targets: swirl, alpha: 0, duration: 300 });
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
        if (!S.textures.exists(tex)) return;
        const t = S.track(S.add.image(bowlImg.x, bowlImg.y, tex).setOrigin(bowlImg.originX, bowlImg.originY).setScale(bowlImg.scaleX).setDepth(bowlImg.depth - 0.01));
        if (art) t.setDisplaySize(bowlImg.displayWidth, bowlImg.displayHeight);
        if (bowlImg.shadow) bowlImg.shadow.setVisible(false);
        t.shadow = S.contactShadow(t);
        const bt = art ? St.artKey("daar-bowl") : bKey;
        if (S.textures.exists(bt)) {
          const [dw, dh] = [bowlImg.displayWidth, bowlImg.displayHeight];
          bowlImg.setTexture(bt).setDisplaySize(dw, dh);
        }
      },
    };
  }

  /* ---------- serve and taste (§14a): the bowl on its trivet (D5), their face over it ---------- */
  async function serve(z, { who, pot, ok, last }) {
    const S = z.S;
    const ctx = z.ctx;
    z.expect({ kind: "wait" });
    // a bowl of daar, ladled from the pot, on its wooden trivet beside it
    const bowl = S.track(S.add.image(z.X(1230), sy(z, 450), "dv3-trivet").setDepth(D.fx - 2).setAlpha(0));
    const bs = z.L(250) / TRIVET.w;
    bowl.setScale(bs * 0.8);
    bowl.shadow = S.contactShadow(bowl);
    await Cook.tween(S, { targets: bowl, alpha: 1, scale: bs, duration: 300, ease: "Back.easeOut" });
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
