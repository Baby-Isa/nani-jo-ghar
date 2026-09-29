/*
 * Combined station: Daar v2, chop, then tadka and stir (docs/design/cook-design-system-v1.md §13; the chai v2
 * grid §3, §4, §10; the kitchen kit §13; serve and taste §14a).
 *
 * TWO PHASES, each on the whole picture, with a phase fold between them:
 *  1. CHOP: a wooden board, a knife resting beside it (no hands), and a steel katori for the pieces. The
 *     vegetables stand on the shelf band (the bottom 26%) in the pantry v2 crates, a `🔊 word` chip under each
 *     (tap the crate = use it, tap the chip = hear it; from level 3 the word hides and the speaker stays).
 *     Nani's chop card (a person card with her face, "Chop these", and item rows with the Kutchi quantity:
 *     *ba marcha*, *hakro tameto*) says what to chop; Nana's daar card folds to face + headline meanwhile
 *     (only cards you can act on stay open). Tap a crate: one vegetable rolls onto the board. Tap the knife:
 *     it chops on its own (lift, press, step along), the halves, then the pieces, which slide into the katori,
 *     and the word pops with the family clip. Nothing is refused: tap the tick when it's right (graded then:
 *     how many of each, nothing they said no to). The rows tick as the chop closes (UX 11).
 *  2. COOK: the kitchen kit's hob with ONE burner and ONE pot (the burner rule: one burner per pot in play).
 *     Tap the knob: the oil heats (the kit's heat ring). Then the tadka: tap the spices on the shelf in the
 *     order Nani said (each drops into the oil with a sizzle and its word); the katori of chopped vegetables;
 *     the daar. Then stir: drag the ladle round the pot (or tap the pot for one turn) as many times as Nani
 *     says. The count shows only as the Kutchi number word by the pot (*ba*, *trae*): no digits, no pips.
 *     Tap the tick when it's done.
 * THE REVIEW (§14a as changed 29 Sept, X10 / Q1: Cook.Kit.review): a ladle of daar into the bowl, and
 *   their big round face comes up over it (no body, no pretend eating).
 *  - right: a happy face and the family's praise;
 *  - not quite: a gentle face, they say their order again, and the child cooks it again (the chop first).
 *    Only the first try counts (the ear star, the end review). At most three tries.
 *
 * Levels (data/cook.json's daal recipe slots; data/stations/daar.json's mechanic levels): 1 = only what's
 * asked on the shelf, words on the chips; 2 = decoy vegetables and spices; 3 = speaker-only chips; 4 = more decoys,
 * the oil heats faster, and Nana's card starts folded in the cook (a peek costs a hint; no dots, no pips).
 * Art (all existing): the pantry v2 crates and jars (assets/cook/items/shelf-*-bare-f), the top-down
 * vegetables (veg-*-whole-t / -halved-t / -chopped-t), tool-board-t, tool-knife-t, vessel-katori-t,
 * vessel-pot-t, tool-ladle-t, and the kitchen kit's hob and knob (js/cook/kitchen-kit.js).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const IT = "assets/cook/items/";
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
  const BOARD = { x: 660, y: 345, w: 640, h: 470 };
  const KNIFE = { x: 1070, y: 350, h: 330 };
  const BOWL = { x: 1320, y: 360, d: 250 };
  const INK = { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf };
  const FONT = "Nunito, sans-serif";
  // the vegetables' own art: word id -> file stem
  const VEG = { "veg-01": "bataato", "veg-02": "dungri", "veg-03": "tameto", "veg-12": "marcha", "veg-13": "lasan", "veg-14": "aadu" };
  const HALVED = ["veg-01", "veg-02", "veg-03"];
  const CHOPPED = { "veg-01": "veg-bataato-cubed-t.webp", "veg-02": "veg-dungri-chopped-t.png", "veg-03": "veg-tameto-chopped-t.png", "veg-12": "veg-marcha-chopped-t.png", "veg-13": "veg-lasan-chopped-t.webp", "veg-14": "veg-aadu-chopped-t.png" };
  // the pot and katori's round bodies (fractions of the canvas width), measured from the art
  const POT = { w: 354, cx: 0.5, cy: 0.5, r: 0.41, inner: 0.82 };
  const KATORI = { w: 193, inner: 0.78 };
  const DAAR = 0xe0a42c;
  const OIL = 0xe9c46a;
  // the daar's lentil texture: fixed spots (fractions of the radius), paler and darker than the daar
  const LENTILS = Array.from({ length: 70 }, (_, i) => {
    const a = i * 2.39996;
    const r = Math.sqrt((i + 0.5) / 70) * 0.9;
    return [Math.cos(a) * r, Math.sin(a) * r, i % 3];
  });

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
    const vegIds = Cook.shuffle([...new Set(kinds.concat(no, St.decoys(p.pool || [], kinds.concat(no), K.vegDecoys || 0)))]).filter((id) => VEG[id]);
    const tadka = [].concat(p.tadka || []);
    const flat = tadka.flat();
    const spiceIds = Cook.shuffle([...new Set(flat.concat(St.decoys(K.spiceShelf || [], flat, K.spiceDecoys || 0)))]);
    const laps = p.laps || 3;
    if (Cook.Coach) Cook.Coach.stop(false); // not "seen": the chop's own begin shows it (data.onboard.daar)
    const art = [
      ["dv2-board", IT + "tool-board-t.png"],
      ["dv2-knife", IT + "tool-knife-t.webp"],
      ["dv2-katori", IT + "vessel-katori-t.webp"],
      ["dv2-pot", IT + "vessel-pot-t.webp"],
      ["dv2-ladle", IT + "tool-ladle-t.webp"],
    ]
      .concat(vegIds.concat(spiceIds).map((id) => [`dv2-shelf-${id}`, shelfUrl(id)]))
      .concat(vegIds.concat(flat).filter((id) => VEG[id]).map((id) => [`dv2-whole-${id}`, `${IT}veg-${VEG[id]}-whole-t.webp`]))
      .concat(vegIds.filter((id) => HALVED.includes(id)).map((id) => [`dv2-half-${id}`, `${IT}veg-${VEG[id]}-halved-t.png`]))
      .concat(vegIds.map((id) => [`dv2-chop-${id}`, IT + CHOPPED[id]]))
      .concat(Cook.Kit ? Cook.Kit.faceArt(who) : [])
      .concat(Cook.Kit ? Cook.Kit.art(1, []) : []);
    await Promise.race([St.load(S, art), Cook.wait(12000)]);

    let first = null; // the first try's verdict (only it counts)
    let result = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      /* ---------- 1: chop ---------- */
      await St.begin(S, ctx, "daar", "marble"); // the first time, the ghost finger (data.onboard.daar): a crate, then the knife
      if (ctx.nextStep) ctx.nextStep("Chop");
      if (phases.chop && !attempt) UI.gist(phases.chop);
      const cz = Mech.zone(S, ctx, { id: "chop", level });
      const nani = naniCard(want, no);
      const chopped = await chop(cz, { vegIds, want, kinds, no, level, retry: attempt > 0, nani });
      nani.close();
      cz.close();
      St.end();

      /* ---------- 2: tadka and stir, then serve and taste ---------- */
      await St.begin(S, ctx, "daar", "marble");
      if (Cook.Coach) Cook.Coach.stop(false);
      // the tadka and the stir get their own first-time coach (X11: data.onboard["daar-cook"])
      if (!attempt) St.coach(ctx, "daar-cook");
      if (ctx.nextStep) ctx.nextStep("tadka");
      UI.mission.reveal("tadka");
      // 29 Sept (D9, Zafar): the chopped things still have to go in, so their rows go back to "to do"
      // here and tick again when they go into the pot (the katori tips in: cook())
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
      if (phases.cook && !attempt) UI.gist(phases.cook);
      const kz = Mech.zone(S, ctx, { id: "cook", level });
      const cooked = await cook(kz, { spiceIds, tadka, flat, laps, level, K, chopped, retry: attempt > 0 });
      if (peek) UI.mission.closeCards(false);
      const why = chopped.wrong || cooked.wrong;
      if (!first) first = { ok: !why, why };
      const ok = await serve(kz, { who, pot: cooked.pot, ok: !why, last: attempt >= 2 });
      kz.close();
      St.end();
      result = { chopped: chopped.got, tadka: cooked.order, stirred: cooked.stirred };
      if (ok) break;
      // not quite: the card starts again (its misses stay for the review)
      const L = ladderOf(ctx);
      if (L) {
        Cook.Order.rows(L, { all: true }).forEach((r) => {
          if (r.head) return;
          r.done = false;
          r.got = 0;
        });
        UI.mission.refresh();
      }
    }
    ctx.result.daar = result;
    ctx.result.chopped = result && result.chopped;
    if (ctx.closeItem) ctx.closeItem(["cook-daal"], { all: true });
    return result;
  }

  /* ---------- Nani's chop card (§13): the shared order card, her face, "Chop these", the quantities ---------- */
  function naniCard(want, no) {
    const M = UI.mission;
    const rows = Object.keys(want).map((id) => ({ id, label: Lang.html(Lang.phrase(Lang.countParts(want[id], id))), done: false }));
    // a row is lower case with no full stop (the sidebar's rows: "dungri na")
    const noStop = (html) => String(html).replace(/\.((?:<\/[a-z0-9]+>)*)\s*$/i, "$1");
    no.forEach((id) => rows.push({ id, label: noStop(Lang.html(Lang.line("no", Lang.phrase([id])))), done: false, no: true }));
    const data = () => ({
      person: { id: "nani", face: UI.faceUrl("nani"), name: "Nani" },
      // "Chop these" is an English placeholder (§13), flagged to record
      headline: { html: "Chop these", rec: true },
      // a "don't" row is the shared card's no-row style (dashed, the no-sign), never ticked here
      items: rows.map((r) => (r.no ? { label: null, parts: [{ label: r.label, done: false, no: true, key: r }] } : { label: r.label, count: 2, parts: [], done: r.done, key: r })),
    });
    // the sidebar's own calls (order-card follow-ups): Nani's card above the order's, and the phase fold
    // (only cards you can act on stay open: Nana's daar card folds to face + headline while chopping)
    M.addCard("daar-chop", data());
    M.closeCards(true);
    return {
      rows,
      // the rows she asked for tick; her "don't" row stays neutral (nothing was added)
      tickAll() {
        rows.forEach((r) => !r.no && (r.done = true));
        M.addCard("daar-chop", data());
      },
      close() {
        M.removeCard("daar-chop");
        M.closeCards(false);
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
    S.tweens.add({ targets: c, alpha: 1, scale: z.k, y: y - z.L(18), duration: 200, ease: "Back.easeOut" });
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

  /* ---------- 1: chop on the board, the pieces into the katori ---------- */
  async function chop(z, { vegIds, want, kinds, no, level, retry, nani }) {
    const S = z.S;
    const ctx = z.ctx;
    backdrop(z, S);
    const board = S.track(S.add.image(z.X(BOARD.x), sy(z, BOARD.y), "dv2-board").setDepth(D.item - 2));
    board.setDisplaySize(z.L(BOARD.w), z.L(BOARD.h));
    board.shadow = S.contactShadow(board);
    // the knife rests on the right of the board, blade up, handle toward you (no hand)
    const knife = S.track(S.add.image(z.X(KNIFE.x), sy(z, KNIFE.y), "dv2-knife").setDepth(D.item + 2).setAngle(50));
    const ks = z.L(KNIFE.h) / Math.hypot(312, 263);
    knife.setScale(ks);
    knife.baseScale = ks;
    knife.shadow = S.contactShadow(knife);
    const rest = { x: knife.x, y: knife.y };
    const katori = S.track(S.add.image(z.X(BOWL.x), sy(z, BOWL.y), "dv2-katori").setDepth(D.item - 1));
    katori.setScale(z.L(BOWL.d) / KATORI.w);
    katori.shadow = S.contactShadow(katori);
    const bowlR = (z.L(BOWL.d) / 2) * KATORI.inner;
    const items = shelf(z, S, vegIds, level);
    // Nani says it: "Kali ba dungri. Ne hakro tameto." (the number is always said)
    const hide = St.hideKnown(ctx);
    const say = Lang.join(kinds.map((id, j) => Lang.line(j === 0 ? "only" : Lang.frames().any, Lang.phrase(Lang.countParts(want[id], id)))));
    if (kinds.length && !retry) await Promise.race([z.say(say, { hide }).catch(() => {}), Cook.wait(6000)]);
    else if (kinds.length) z.say(say, { hide }).catch(() => {});

    const got = {};
    const inBowl = [];
    let last = 0;
    for (;;) {
      const next = kinds.find((id) => (got[id] || 0) < want[id]) || null;
      const r = await St.freePick(z, { items, next, doneOk: Object.keys(got).length > 0 || !kinds.length, doneGlow: ctx.guided && !next });
      if (r.done) break;
      if (performance.now() - last < 220) continue; // a double tap
      last = performance.now();
      const id = r.id;
      const crate = items[id];
      S.tweens.add({ targets: crate, scale: crate.baseScale * 1.06, duration: 90, yoyo: true });
      // one rolls out of its crate onto the board
      const veg = S.track(S.add.image(crate.x, crate.y - crate.displayHeight * 0.6, `dv2-whole-${id}`).setDepth(D.item + 1));
      const vs = z.L(id === "veg-12" ? 250 : 190) / veg.width;
      veg.setScale(vs * 0.6);
      Cook.sfx.whoosh();
      await S.fly(veg, z.X(BOARD.x - 40), sy(z, BOARD.y + 10), { scale: vs, duration: 380, arc: z.L(120) });
      Cook.sfx.soft();
      z.progress({ board: id });
      // the knife is next (the focal rule: it pulses)
      S.tweens.add({ targets: knife, scale: ks * 1.06, duration: 480, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      await tapOnce(z, S, knife, "knife", { glow: z.guided });
      S.tweens.killTweensOf(knife);
      knife.setScale(ks);
      await chopIt(z, S, { veg, id, knife, rest, vs });
      // the pieces slide into the katori (they stay there: the bowl shows what's chopped)
      got[id] = (got[id] || 0) + 1;
      const n = inBowl.length;
      // one pile per vegetable, round the bowl (five round the side, then the middle), so they can be counted
      const a = -Math.PI / 2 + n * ((Math.PI * 2) / 5);
      const rr = n < 5 ? 0.46 : 0;
      const tx = katori.x + Math.cos(a) * bowlR * rr;
      const ty = katori.y + Math.sin(a) * bowlR * rr * 0.9;
      const pile = veg;
      await S.fly(pile, tx, ty, { scale: pile.scale * 0.36, duration: 420, arc: z.L(70) });
      pile.setDepth(D.item - 0.5 + n * 0.001);
      S.puff(tx, ty, 0xfff6e0, z.L(26));
      inBowl.push(pile);
      // 29 Sept (Q7): at level 1 the count is heard as you add ("ba dungri"), else the word
      const cnt = level <= 1 && UI.tallyLine ? UI.tallyLine(got[id], id) : null;
      pop(z, S, cnt ? Lang.plain(cnt) : Cook.display(id), katori.x, katori.y - z.L(170), cnt ? { line: cnt, ms: 1100 } : { speakId: id, ms: 1100 });
      z.progress({ chopped: id, n: got[id] });
    }
    // graded now: each vegetable, how many, and nothing they said no to
    let wrong = null;
    Object.keys(got).forEach((id) => {
      if (want[id]) return;
      wrong = wrong || (no.includes(id) ? `chopped ${id} (they said no)` : `chopped ${id}`);
      if (!retry && no.includes(id)) UI.mission.missItem(id, ctx.dishAt || 0, { no: true });
    });
    kinds.forEach((id) => {
      const g = got[id] || 0;
      const right = g === want[id];
      if (!right) {
        wrong = wrong || `chopped ${g}, they asked for ${want[id]}: ${id}`;
        if (!retry) UI.mission.missItem(id, ctx.dishAt || 0, { counted: true });
      }
      if (!ctx.guided && !retry) {
        (right ? Cook.markRight : Cook.markMiss)(id);
        if (want[id] <= 5) (right ? Cook.markRight : Cook.markMiss)(Cook.numId(want[id]));
      }
    });
    if (!retry) z.listen(!wrong, wrong || "chopped");
    nani.tickAll();
    if (ctx.closeItem) ctx.closeItem(kinds);
    else UI.mission.closeItem(kinds, ctx.dishAt || 0);
    Cook.sfx.right();
    S.sparkle(katori.x, katori.y);
    Object.values(items).forEach((o) => S.tweens.add({ targets: [o, o.chip], alpha: 0.35, duration: 300 }));
    z.expect({ kind: "wait" });
    await Cook.wait(900);
    return { got, wrong, pieces: inBowl.map((p) => p.texture.key) };
  }

  /** The knife chops on its own: it lifts and presses along the vegetable, halves it, then the pieces. */
  async function chopIt(z, S, { veg, id, knife, rest, vs }) {
    const w = veg.displayWidth;
    const strokes = 4;
    const tween = (o) => new Promise((r) => S.tweens.add(Object.assign({ targets: knife, onComplete: r }, o)));
    // blade up and handle toward you, as it rests: the blade (the top half of the upright knife) crosses the vegetable
    const up = knife.displayHeight * 0.22;
    await tween({ x: veg.x - w * 0.36, y: veg.y - up - z.L(20), duration: 220, ease: "Quad.easeOut" });
    for (let i = 0; i < strokes; i++) {
      const x = veg.x - w * 0.36 + (w * 0.72 * i) / (strokes - 1);
      await tween({ x, y: veg.y - up - z.L(26), scale: knife.baseScale * 1.06, duration: 90, ease: "Quad.easeOut" });
      await tween({ y: veg.y - up, scale: knife.baseScale, duration: 70, ease: "Quad.easeIn" });
      (Cook.sfx.chop || Cook.sfx.click)();
      S.tweens.add({ targets: veg, scaleY: veg.scaleY * 0.96, duration: 50, yoyo: true });
      if (i === 1 && S.textures.exists(`dv2-half-${id}`)) veg.setTexture(`dv2-half-${id}`).setScale(vs * 0.95);
    }
    // the pieces
    const key = `dv2-chop-${id}`;
    if (S.textures.exists(key)) {
      veg.setTexture(key);
      veg.setScale(z.L(200) / veg.width);
    }
    S.puff(veg.x, veg.y, 0xfff6e0, z.L(40));
    Cook.sfx.pop();
    tween({ x: rest.x, y: rest.y, duration: 260, ease: "Quad.easeInOut" });
    await Cook.wait(260);
  }

  /* ---------- 2: tadka and stir in the pot on the kit hob (one burner, one pot) ---------- */
  async function cook(z, { spiceIds, tadka, flat, laps, level, K, chopped, retry }) {
    const S = z.S;
    const ctx = z.ctx;
    const Kit = Cook.Kit;
    backdrop(z, S);
    // the hob: one burner (one pot), sitting on the scene's floor line, clear of the shelf
    const hk = 0.9;
    const hob = Kit.hob(S, { n: 1, k: z.L(hk), cx: z.X(800), bottom: sy(z, SHELF_TOP - 14) });
    const bodyR = z.L(128);
    const burner = Kit.burner(S, hob, 0, { flameR: bodyR * 1.3 });
    const cx = hob.burners[0].x;
    const cy = hob.burners[0].y;
    const pot = S.track(S.add.image(cx, cy, "dv2-pot").setOrigin(POT.cx, POT.cy).setDepth(D.item));
    pot.setScale(bodyR / (POT.r * POT.w));
    pot.shadow = S.contactShadow(pot, { centerX: cx, centerY: cy + bodyR * 0.08, width: bodyR * 2.15, height: bodyR * 2.15 });
    const inR = bodyR * POT.inner;
    // what's in the pot: the oil, then the daar over it; the tadka's specks float on top and swirl as you stir
    const liq = S.track(S.add.graphics().setDepth(D.item + 0.1));
    const drawLiquid = (color, r, a = 0.95) => {
      liq.clear();
      liq.fillStyle(St.mix(color, 0x1a0e06, 0.25), a);
      liq.fillCircle(cx, cy, r);
      liq.fillStyle(color, a);
      liq.fillCircle(cx + r * 0.03, cy + r * 0.04, r * 0.93);
      if (color !== OIL && r > inR * 0.7) {
        LENTILS.forEach(([fx, fy, t]) => {
          liq.fillStyle(t === 0 ? 0xf6d27a : t === 1 ? 0xc7861c : 0xefc25a, 0.8);
          liq.fillCircle(cx + fx * r, cy + fy * r, z.L(t === 1 ? 2.2 : 3));
        });
      }
      liq.fillStyle(0xffffff, 0.12);
      liq.fillEllipse(cx - r * 0.3, cy - r * 0.32, r * 0.8, r * 0.34);
    };
    drawLiquid(OIL, inR * 0.55, 0.55);
    const specks = S.track(S.add.container(cx, cy).setDepth(D.item + 0.3));
    const ring = Kit.heatRing(S, { width: z.L(12) });
    // the katori of chopped vegetables waits left of the hob; the daar's bowl right of it
    const kat = S.track(S.add.image(z.X(360), sy(z, 330), "dv2-katori").setDepth(D.item));
    kat.setScale(z.L(220) / KATORI.w);
    kat.shadow = S.contactShadow(kat);
    const kR = (z.L(220) / 2) * KATORI.inner;
    const bits = chopped.pieces.map((key, i) => {
      const a = -Math.PI / 2 + i * ((Math.PI * 2) / 5);
      const rr = i < 5 ? 0.46 : 0;
      const im = S.track(S.add.image(kat.x + Math.cos(a) * kR * rr, kat.y + Math.sin(a) * kR * rr * 0.9, key).setDepth(D.item + 0.1 + i * 0.001));
      im.setScale(z.L(200 * 0.36 * (220 / BOWL.d)) / im.width);
      return im;
    });
    const dBowl = S.track(S.add.image(z.X(1240), sy(z, 330), "dv2-katori").setDepth(D.item));
    dBowl.setScale(z.L(220) / KATORI.w);
    dBowl.shadow = S.contactShadow(dBowl);
    const dG = S.track(S.add.graphics().setDepth(D.item + 0.1));
    const drawBowlDaar = (x, y) => {
      dG.clear();
      dG.fillStyle(St.mix(DAAR, 0x1a0e06, 0.25), 1);
      dG.fillCircle(x, y, kR);
      dG.fillStyle(DAAR, 1);
      dG.fillCircle(x + kR * 0.03, y + kR * 0.04, kR * 0.93);
      LENTILS.forEach(([fx, fy, t]) => {
        dG.fillStyle(t === 0 ? 0xf6d27a : t === 1 ? 0xc7861c : 0xefc25a, 0.8);
        dG.fillCircle(x + fx * kR, y + fy * kR, z.L(t === 1 ? 2 : 2.6));
      });
      dG.fillStyle(0xffffff, 0.14);
      dG.fillEllipse(x - kR * 0.3, y - kR * 0.32, kR * 0.8, kR * 0.34);
    };
    drawBowlDaar(dBowl.x, dBowl.y);
    const items = shelf(z, S, spiceIds, level);
    Object.values(items).forEach((o) => o.setAlpha(0.6));
    [kat, dBowl].concat(bits).forEach((o) => o.setAlpha(0.7));
    dG.setAlpha(0.7);

    // 1. the knob: the oil heats (the ring fills to its "now" band)
    burner.knob.baseScale = 1;
    S.tweens.add({ targets: burner.knob, scale: 1.1, duration: 500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    await tapOnce(z, S, burner.knobHit, "knob", { glow: z.guided });
    S.tweens.killTweensOf(burner.knob);
    burner.knob.setScale(1);
    burner.set("high");
    const lo = 0.55;
    const hi = 0.8;
    let heat = 0;
    const heatRate = K.heatRate || 0.32;
    await new Promise((r) => {
      const hdt = clock();
      const stop = S.addTick(() => {
        heat = Math.min(0.68, heat + (hdt() / 1000) * heatRate * (Cook.speed || 1));
        ring.draw(cx, cy, bodyR + z.L(20), heat, lo, hi);
        drawLiquid(OIL, inR * 0.55, 0.55 + heat * 0.4);
        if (heat >= 0.68) {
          stop();
          r();
        }
      });
    });
    burner.set("low");
    S.tweens.addCounter({ from: 1, to: 0, duration: 400, onUpdate: (t) => ring.g.setAlpha(t.getValue()), onComplete: () => ring.clear() });
    const shimmer = S.track(S.add.circle(cx, cy, inR * 0.5, 0xfff3c0, 0).setDepth(D.item + 0.2));
    S.tweens.add({ targets: shimmer, alpha: 0.14, duration: 700, yoyo: true, repeat: -1 });
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);

    // 2. the tadka: the spices in the order Nani said (the card shows it; a wrong one goes in too, graded)
    Object.values(items).forEach((o) => S.tweens.add({ targets: o, alpha: 1, duration: 250 }));
    const hide = St.hideKnown(ctx);
    if (flat.length && !retry) await Promise.race([z.say(Lang.list(tadka, { seq: true }), { hide }).catch(() => {}), Cook.wait(7000)]);
    const order = [];
    let wrong = null;
    const series = [];
    tadka.forEach((e) => series.push([].concat(e)));
    let si = 0;
    const spiceDrop = async (id) => {
      const obj = items[id];
      const col = St.heapColor(id, 0x8a5a2a);
      S.tweens.add({ targets: obj, scale: obj.baseScale * 1.06, duration: 90, yoyo: true });
      const dot = S.track(S.add.circle(obj.x, obj.y - obj.displayHeight * 0.8, z.L(16), col, 1).setDepth(D.fx));
      await S.fly(dot, cx, cy, { duration: 340, arc: z.L(110) });
      dot.destroy();
      Cook.sfx.sizzle(0.8);
      S.burst(cx, cy, [col, 0xfff0c0], 14, z.L(60));
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(Math.random()) * inR * 0.5;
        specks.add(S.add.circle(Math.cos(a) * rr, Math.sin(a) * rr, z.L(2.2 + Math.random() * 2.2), col, 0.95));
      }
    };
    while (si < series.length) {
      const group = series[si];
      const next = group[0];
      const r = await St.freePick(z, { items, next, doneOk: false });
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
        if (!retry) {
          z.listen(false, why);
          if (flat.includes(expected)) UI.mission.missItem(expected, ctx.dishAt || 0);
          Cook.markMiss(expected);
        }
      }
      const drop = spiceDrop(id);
      pop(z, S, Cook.display(id), cx + bodyR + z.L(190), cy - z.L(130), { speakId: id, ms: 1000 });
      await drop;
      z.progress({ added: id });
      if (!group.length) si++;
    }
    if (!wrong && !retry) z.listen(true, "tadka");
    Object.values(items).forEach((o) => S.tweens.add({ targets: [o, o.chip], alpha: 0.35, duration: 300 }));

    // 3. the chopped vegetables, then the daar
    [kat, ...bits].forEach((o) => S.tweens.add({ targets: o, alpha: 1, duration: 200 }));
    S.tweens.add({ targets: kat, scale: kat.scale * 1.05, duration: 480, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    await tapOnce(z, S, kat, "katori", { glow: z.guided });
    S.tweens.killTweensOf(kat);
    Cook.sfx.whoosh();
    await Promise.all(
      bits.map((b, i) => {
        const a = i * 2.1 + 0.4;
        const rr = 0.2 + ((i * 0.37) % 0.4);
        return S.fly(b, cx + Math.cos(a) * inR * rr, cy + Math.sin(a) * inR * rr, { scale: b.scale * 0.62, duration: 380 + i * 40, arc: z.L(90) });
      })
    );
    bits.forEach((b) => {
      specks.add(b);
      b.setPosition(b.x - cx, b.y - cy);
    });
    Cook.sfx.sizzle(1);
    S.puff(cx, cy, 0xfff1c0, z.L(60));
    // 29 Sept (D9): now they're in, their rows tick again
    const inPot = Object.keys(chopped.got || {});
    if (inPot.length) ctx.closeItem ? ctx.closeItem(inPot) : UI.mission.closeItem(inPot, ctx.dishAt || 0);
    S.tweens.add({ targets: kat, alpha: 0, duration: 300 });
    await Cook.wait(250);
    // the daar
    [dBowl, dG].forEach((o) => S.tweens.add({ targets: o, alpha: 1, duration: 200 }));
    S.tweens.add({ targets: dBowl, scale: dBowl.scale * 1.05, duration: 480, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    await tapOnce(z, S, dBowl, "daar", { glow: z.guided });
    S.tweens.killTweensOf(dBowl);
    // it tips into the pot: the level rises, the tadka floats on top
    await new Promise((r) =>
      S.tweens.add({ targets: dBowl, x: cx + bodyR * 0.9, y: cy - bodyR * 0.55, angle: -40, duration: 420, ease: "Quad.easeInOut", onUpdate: () => drawBowlDaar(dBowl.x, dBowl.y), onComplete: r })
    );
    const pour = Cook.sfx.pourLoop ? Cook.sfx.pourLoop() : null;
    dG.clear();
    await new Promise((r) =>
      S.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 900,
        onUpdate: (t) => {
          const u = t.getValue();
          liq.clear();
          drawLiquid(St.mix(OIL, DAAR, u), inR * (0.55 + 0.45 * u), 0.9 + 0.1 * u);
        },
        onComplete: r,
      })
    );
    if (pour && pour.stop) pour.stop();
    pop(z, S, Cook.display("cook-daal"), cx + bodyR + z.L(190), cy - z.L(130), { speakId: "cook-daal", ms: 1000 });
    S.tweens.add({ targets: dBowl, x: z.X(1240), y: sy(z, 330), angle: 0, alpha: 0, duration: 380 });
    shimmer.destroy();
    if (sizzle && sizzle.stop) sizzle.stop();
    if (ctx.nextStep) ctx.nextStep("Stir");
    if (K.stirLine && !retry) UI.gist(K.stirLine);

    // 4. stir: drag the ladle round (or tap the pot: one turn); the count shows as the Kutchi word only
    const stirred = await stir(z, S, { cx, cy, inR, laps, specks, retry });
    if (stirred !== laps) wrong = wrong || `stirred ${stirred} times, they asked for ${laps}`;
    if (!retry) {
      z.listen(stirred === laps, `stirred ${stirred} times, they asked for ${laps}`);
      if (!ctx.guided && laps <= 5) (stirred === laps ? Cook.markRight : Cook.markMiss)(Cook.numId(laps));
    }
    burner.set("off");
    return { order, wrong, stirred, pot: { img: pot, cx, cy, bodyR, liq, specks } };
  }

  /** Stir `laps` times: a drag round the pot counts a lap per full turn; a tap on the pot is one turn. */
  function stir(z, S, { cx, cy, inR, laps, specks, retry }) {
    return new Promise((resolve) => {
      const ctx = z.ctx;
      const hide = St.hideKnown(ctx);
      const trackR = inR * 0.62;
      const ladle = S.track(S.add.image(cx + trackR, cy, "dv2-ladle").setDepth(D.item + 0.6).setOrigin(0.3, 0.3));
      ladle.setScale(z.L(260) / 319);
      const ringG = S.track(S.add.circle(cx + trackR, cy, z.L(44), 0xffffff, 0).setStrokeStyle(z.L(6), 0xfff3c4, 0.9).setDepth(D.fx - 1));
      S.tweens.add({ targets: ringG, scale: 1.25, alpha: 0.35, duration: 520, yoyo: true, repeat: -1 });
      // the count: the Kutchi number word in a flat chip beside the pot (nothing until the first turn)
      const chip = S.track(S.add.container(cx + inR + z.L(150), cy - z.L(20)).setDepth(D.fx).setAlpha(0).setScale(z.k));
      const cg = S.add.graphics();
      const ct = S.add.text(0, 0, "", { fontFamily: FONT, fontSize: "40px", fontStyle: "800", color: INK.kutchi }).setOrigin(0.5);
      chip.add([cg, ct]);
      const showCount = (n) => {
        ct.setText(Lang.plain({ segs: Lang.num(n) }));
        const w = Math.max(96, ct.width + 48);
        cg.clear();
        cg.fillStyle(0x28190a, 0.1);
        cg.fillRoundedRect(-w / 2, -32 + 3, w, 64, 12);
        cg.fillStyle(0xffffff, 1);
        cg.fillRoundedRect(-w / 2, -32, w, 64, 12);
        chip.setAlpha(1);
        S.tweens.add({ targets: chip, scale: z.k * 1.12, duration: 110, yoyo: true });
      };
      let count = 0;
      let ang = 0; // the ladle's angle
      let acc = 0; // turned since the last lap
      let prev = null;
      let over = false;
      const offs = [];
      Cook.stirCount = () => count;
      const post = () => z.expect(count < laps ? { kind: "stir", x: cx, y: cy, rx: trackR, ry: trackR, target: laps, count: () => count } : { kind: "click", selector: "#done-btn" });
      const place = () => {
        ladle.setPosition(cx + Math.cos(ang) * trackR, cy + Math.sin(ang) * trackR);
        ladle.setAngle((ang * 180) / Math.PI + 90);
        ringG.setPosition(ladle.x, ladle.y);
        specks.setAngle(specks.angle + 0); // the swirl follows below
      };
      const lap = () => {
        count++;
        Cook.sfx.bubble ? Cook.sfx.bubble() : Cook.sfx.soft();
        showCount(count);
        if (!(UI.naniMuted && UI.naniMuted())) Lang.speak(Lang.numLine(count)).catch(() => {});
        z.progress({ lap: count });
        post();
      };
      const turn = (da) => {
        ang += da;
        acc += Math.abs(da);
        specks.rotation += da * 0.55;
        place();
        if (acc >= Math.PI * 2 * 0.92) {
          acc = 0;
          lap();
        }
      };
      offs.push(
        z.on("pointerdown", (p) => {
          const d = Math.hypot(p.worldX - cx, p.worldY - cy);
          if (d > inR * 1.35) return;
          prev = Math.atan2(p.worldY - cy, p.worldX - cx);
          ringG.setVisible(false);
          p.dv2Start = { t: performance.now(), a: prev };
          start = { t: performance.now(), moved: 0 };
        }),
        z.on("pointermove", (p) => {
          if (prev == null || over) return;
          const a = Math.atan2(p.worldY - cy, p.worldX - cx);
          let da = a - prev;
          if (da > Math.PI) da -= Math.PI * 2;
          if (da < -Math.PI) da += Math.PI * 2;
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
            S.tweens.add({ targets: o, v: Math.PI * 2, duration: 700, ease: "Sine.easeInOut", onUpdate: () => {
              turn(o.v - lastV);
              lastV = o.v;
            } });
          }
          prev = null;
          start = null;
        })
      );
      let start = null;
      place();
      // Nani says how many: "Trae!"
      if (!retry) z.say(Lang.numLine(laps), { hide }).catch(() => {});
      Cook.markSeen(Cook.numId(laps));
      post();
      UI.done({ glow: false }).then(() => {
        over = true;
        offs.forEach((o) => o());
        Cook.stirCount = null;
        z.expect({ kind: "wait" });
        S.tweens.killTweensOf(ringG);
        ringG.destroy();
        S.tweens.add({ targets: chip, alpha: 0, delay: 400, duration: 300 });
        S.tweens.add({ targets: ladle, alpha: 0, duration: 300 });
        resolve(count);
      });
    });
  }

  /* ---------- serve and taste (§14a) ---------- */
  async function serve(z, { who, pot, ok, last }) {
    const S = z.S;
    const ctx = z.ctx;
    z.expect({ kind: "wait" });
    // a bowl of daar, ladled from the pot
    const bowl = S.track(S.add.image(pot.cx, pot.cy, "dv2-katori").setDepth(D.fx - 2).setAlpha(0));
    bowl.setScale(z.L(200) / KATORI.w);
    const bR = (z.L(200) / 2) * KATORI.inner;
    const bg = S.track(S.add.graphics().setDepth(D.fx - 1.9));
    const drawB = () => {
      bg.clear();
      bg.fillStyle(St.mix(DAAR, 0x1a0e06, 0.25), bowl.alpha);
      bg.fillCircle(bowl.x, bowl.y, bR);
      bg.fillStyle(DAAR, bowl.alpha);
      bg.fillCircle(bowl.x + bR * 0.03, bowl.y + bR * 0.04, bR * 0.93);
      bg.fillStyle(0xffffff, 0.14 * bowl.alpha);
      bg.fillEllipse(bowl.x - bR * 0.3, bowl.y - bR * 0.32, bR * 0.8, bR * 0.34);
    };
    bowl.setPosition(z.X(1180), sy(z, 430));
    await new Promise((r) => S.tweens.add({ targets: bowl, alpha: 1, duration: 260, onUpdate: drawB, onComplete: r }));
    Cook.sfx.pop();
    S.puff(bowl.x, bowl.y, 0xfff1c0, z.L(40));
    // the review (X10 / Q1): their big round face over the bowl, no body, no pretend eating
    const look = await Cook.Kit.review(S, { who, ok: ok || last, x: bowl.x, y: bowl.y - z.L(215), size: z.L(250), k: z.L(1), side: "right" });
    if (ok || last) {
      await Cook.wait(300);
      await look.close();
      return true;
    }
    // not quite: they say their order again (the card has marked the wrong rows), the bowl goes back
    const line = orderLine(ladderOf(ctx));
    if (line) await Promise.race([St.customerSay(ctx, line, { hide: St.hideKnown(ctx) }), Cook.wait(9000)]);
    St.customerDone();
    await Promise.all([look.close(), new Promise((r) => S.tweens.add({ targets: bowl, alpha: 0, duration: 460, onUpdate: drawB, onComplete: r }))]);
    return false;
  }

  Mech.lab("daar", {
    name: "Daar",
    verb: "Chop, tadka, stir",
    async run(L) {
      const R = Cook.Recipes;
      const who = (L.ctx.order && L.ctx.order.who) || "nana";
      const d = R.daal.make(who, { level: L.level });
      L.card(d, R.daal.steps(d));
      const run = Cook.data.recipes.daal.run.find((s) => s.do === "daar");
      const env = { d, lists: Cook.data.recipes.daal.lists || {}, vars: {} };
      const p = R._engine.res(Object.assign({}, run, { do: undefined }), env);
      await L.station("daar", Object.assign(p, { who }));
    },
  });
})(window);
