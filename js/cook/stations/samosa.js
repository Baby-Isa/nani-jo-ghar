/*
 * Combined station: Samosa v2, fill, fold, fry (docs/design/cook-design-system-v1.md §15; the chai v2 grid
 * §3, §4, §10; the kitchen kit §13; serve and taste §14a).
 *
 * THREE JOBS, one at a time, each on the whole picture:
 *  1. FILL: a real top-down pastry strip lies on a wooden board. The fillings stand on the shelf band (the
 *     bottom 26%) as identical front-on prep bowls, a `🔊 word` chip under each (tap the bowl = use it, tap
 *     the chip = hear it; from level 3 the word hides and the speaker stays). Each tap drops ONE spoonful on
 *     the pastry and its word pops with the family clip. Nothing is refused: tap the tick when it's right
 *     (it's graded then: how many spoons of each, and nothing they said no to).
 *  2. FOLD: keep the SWIPE (Zafar: "different and should feel satisfying"). The flap folds over with the
 *     finger (the real pastry art, bent along its fold line), and a soft glow shows the next swipe; let go
 *     past halfway and it snaps shut (a snap, a little pop, the next fold stage). Three folds make a
 *     samosa: its word pops. Make as many as they asked for (each new strip gets the same filling), then
 *     the phase button takes them to the karahi. The count is theirs, graded there.
 *  3. FRY: the kitchen kit's hob (ONE burner: one karahi, the burner rule) with the karahi of oil on it.
 *     Tap the knob: the oil heats (the kit's heat ring). Tap a raw samosa: it slides into the oil. Each one
 *     goes raw -> light -> golden -> too dark (a small heat ring round it); tap it when golden and the
 *     slotted spoon (no hand) lifts it onto the paper-lined plate. No tally: the plate shows the count.
 * SERVE AND TASTE (§14a): the plate slides to the person, who tastes.
 *  - right: a happy face and the family's praise;
 *  - not quite: a gentle face, they say their order again, the plate comes back empty and the child makes
 *    them again (fill first). Only the first try counts (the ear star, the end review). At most three tries.
 * The card (the shared order card, §12): the fillings' rows count up as spoons go in and tick when the fill
 * closes (UX 11, right or not); then the card folds to face + headline, no ✓ (the phase fold, §13: "ba
 * samosa" lives only in the headline) until the plate is tasted, when it opens (and its ✓ shows).
 *
 * Levels (data/cook.json's samosa recipe slots; the fill's decoys and the fry's speed in data.mechanics):
 * 1 = one or two samosas, one decoy, words on the chips; 2 = more decoys; 3 = a "don't" filling, speaker-only
 * chips; 4 = as 3 (the fry's speed and band tighten by level in data.mechanics.fry).
 * Art: assets/cook/items/samosa-v2/ (build/gen_samosa_v2.py, build/cut_samosa_v2.py; its meta.json copied
 * below), the chaat v2 prep bowls, the kitchen kit's hob and knob (js/cook/kitchen-kit.js).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const V2 = "assets/cook/items/samosa-v2/";
  const CH = "assets/cook/items/chaat-v2/";
  // what build/cut_samosa_v2.py measured (the fold stages share one canvas; fractions of it)
  const META = {
    // fill: the pocket the first fold closes over, the lower-left triangle's incircle (centre, radius as a
    // fraction of the width), clear of the fold line (the flap is the upper-right triangle)
    stage: { w: 540, h: 430, fill: { x: 0.187, y: 0.684, r: 0.135 } },
    folds: [
      { flap: [[0.0519, 0.2698], [0.5185, 0.2698], [0.5185, 0.8535]], line: [[0.0519, 0.2698], [0.5185, 0.8535]] },
      { flap: [[0.037, 0.1047], [0.5185, 0.1047], [0.5185, 0.9302], [0.037, 0.9302]], line: [[0.5185, 0.1163], [0.5185, 0.907]] },
      { flap: [[0.7593, 0.3023], [0.9333, 0.3023], [0.9333, 0.8605], [0.7593, 0.8605]], line: [[0.7593, 0.3023], [0.7593, 0.8605]] },
    ],
    fry: { w: 400, h: 340 },
    prep: { w: 303, h: 293 },
  };
  /* ---------- the grid (design px, 1600x900), chai v2's ---------- */
  const SHELF_TOP = 666;
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  const BASE = 818;
  const CHIP_Y = 860;
  const PITCH = 150;
  const PREP_W = 122;
  const BOARD = { x: 720, y: 338, w: 800, h: 560 };
  const STAGE_K = 1.2; // design px per stage-canvas px
  const PLATE = { x: 1335, y: 420, d: 330 };
  // the fry: burner x (bx; the hob's burner sits hobDx right of its middle), karahi body r, plate x and d,
  // the thalis on the band. The karahi with its handles (r / 0.395 wide) + a 50 px gap + the plate is
  // one group centred on x 800: 605 - 228 = 377 ... 1053 + 170 = 1223.
  const FRY = { hobK: 0.9, hobDx: 11, bx: 605, r: 180, px: 1053, pd: 340, trayY: 772, trayD: 150, trayPitch: 180 };
  const PERSON_X = 1450;
  const INK = { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf, glow: 0xffe3a0 };
  const FONT = "Nunito, sans-serif";
  const CHAAT_PREP = ["veg-01", "veg-02", "veg-03", "veg-12", "ph-dhana", "ph-chana", "ph-sev", "ph-dahi", "ph-amli", "ph-lili"];
  const OWN_PREP = ["ph-keema", "veg-10"];
  const prepUrl = (id) => (OWN_PREP.includes(id) ? `${V2}prep-${id}.webp` : CHAAT_PREP.includes(id) ? `${CH}prep-${id}.webp` : null);
  const topUrl = (id) => (OWN_PREP.includes(id) ? `${V2}top-${id}.webp` : CHAAT_PREP.includes(id) ? `${CH}top-${id}.webp` : null);

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
    const kFill = Mech.knobs("fill", { level });
    const pool = p.pool || St.decoys(p.decoyPool || [], kinds.concat(exclude), St.knobInt(kFill.decoys), kFill.decoyPick).filter((id) => prepUrl(id));
    const ids = Cook.shuffle([...new Set(pool.concat(kinds, exclude))]);
    if (Cook.Coach) Cook.Coach.stop(true);
    // the art loads while the order card is up (a slow phone mustn't meet an empty scene)
    const art = [
      ["sv2-board", "assets/cook/items/tool-board-t.png"],
      ["sv2-plate", "assets/cook/items/plate-enamel-empty-t.webp"],
      ["sv2-paper", V2 + "plate-paper.webp"],
      ["sv2-thali", "assets/cook/items/vessel-thali-t.png"],
      ["sv2-spoon", "assets/cook/items/tool-slotted-spoon-t.webp"],
    ]
      .concat([0, 1, 2, 3].map((i) => [`sv2-stage-${i}`, `${V2}stage-${i}.webp`]))
      .concat([0, 1, 2, 3].map((i) => [`sv2-fry-${i}`, `${V2}fry-${i}.webp`]))
      .concat(ids.filter(prepUrl).map((id) => [`sv2-prep-${id}`, prepUrl(id)]))
      .concat(ids.filter(topUrl).map((id) => [`sv2-top-${id}`, topUrl(id)]))
      .concat(["neutral", "happy", "impatient"].map((m) => [`sv2-${who}-${m}`, `assets/cook/characters/${who}-${m}.webp`]))
      .concat(Cook.Kit ? Cook.Kit.art(1, ["karahi"]) : []);
    await Promise.race([St.load(S, art), Cook.wait(12000)]);

    let first = null; // the first try's verdict (only it counts)
    let result = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      /* ---------- 1 + 2: fill and fold ---------- */
      await St.begin(S, ctx, "samosa", "marble");
      if (Cook.Coach) Cook.Coach.stop(true);
      if (phases.fill && !attempt) UI.gist(phases.fill);
      if (ctx.nextStep) ctx.nextStep("Fill");
      const fz = Mech.zone(S, ctx, { id: "fill", level });
      const made = await fillFold(fz, { ids, want, kinds, exclude, count, level, phases, retry: attempt > 0 });
      fz.close();
      St.end();

      /* ---------- 3: fry, then serve and taste ---------- */
      await St.begin(S, ctx, "fry", "marble");
      if (Cook.Coach) Cook.Coach.stop(true);
      if (phases.fry && !attempt) UI.gist(phases.fry);
      if (ctx.nextStep) ctx.nextStep("Fry");
      const yz = Mech.zone(S, ctx, { id: "fry", level });
      const fried = await fry(yz, { n: made.n, level });
      // the verdict: the filling, the count, and nothing raw or burnt on the plate
      const why = made.fillWrong || (made.n !== count ? `made ${made.n}, they asked for ${count}: ph-samosa` : null) || fried.bad;
      if (!first) {
        first = { ok: !why, why };
        // the fill has already been heard (graded at its tick): here the count and the frying
        const later = why && why !== made.fillWrong ? why : null;
        if (later) yz.listen(false, later);
        if (!ctx.guided && count <= 5) (made.n === count ? Cook.markRight : Cook.markMiss)(Cook.numId(count));
        if (made.n !== count) UI.mission.missItem("ph-samosa", ctx.dishAt || 0, { counted: true });
      }
      const ok = await serve(yz, { who, plate: fried.plate, ok: !why, last: attempt >= 2 });
      yz.close();
      St.end();
      result = { count: made.n, fillings: made.got, fried: fried.lifted };
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

  /** The shelf: identical front-on prep bowls on one line, a chip under each (§4). */
  function shelf(z, S, ids, level) {
    const n = ids.length;
    const pitch = Math.min(PITCH, (1600 - 190 - 60) / Math.max(1, n));
    const width = n * pitch;
    const x0 = Math.max(30, (1600 - 190 - width) / 2); // clear of the tick, bottom right
    const plank = S.track(S.add.graphics().setDepth(D.bg + 1.3));
    plank.fillStyle(INK.grey, 1);
    plank.fillRoundedRect(z.X(x0 + 10), z.Y(BASE - 2), z.L(width - 20), z.L(10), z.L(5));
    const items = {};
    ids.forEach((id, i) => {
      const x = x0 + pitch * (i + 0.5);
      const w = Math.min(PREP_W, pitch - 22);
      const key = `sv2-prep-${id}`;
      let img;
      if (S.textures.exists(key)) {
        const sc = z.L(w) / META.prep.w;
        img = S.track(S.add.image(z.X(x), z.Y(BASE), key).setOrigin(0.5, 0.965).setScale(sc).setDepth(D.item + 1));
        img.baseScale = sc;
        img.shadow = S.contactShadow(img, { centerX: z.X(x), centerY: z.Y(BASE - 3), width: z.L(w * 0.72), height: z.L(16) });
      } else img = S.ingredient(id, z.X(x), z.Y(BASE - 56), { w: z.L(118), h: z.L(100), label: false, depth: D.item + 1 });
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

  /* ---------- 1 + 2: fill the pastry, then fold it (and more of them) ---------- */
  async function fillFold(z, { ids, want, kinds, exclude, count, level, phases, retry }) {
    // the scene pieces are raised into the middle of a taller stage's worktop (the stage fill); the shelf band keeps z0
    const z0 = z;
    z = Cook.liftZone(z0);
    const S = z.S;
    const ctx = z.ctx;
    const k = Mech.knobs("fold", { level });
    backdrop(z0, S);
    const board = S.track(S.add.image(z.X(BOARD.x), z.Y(BOARD.y), "sv2-board").setDepth(D.item - 2));
    board.setDisplaySize(z.L(BOARD.w), z.L(BOARD.h));
    board.shadow = S.contactShadow(board);
    // the plate the folded samosas wait on (right of the board)
    const plate = S.track(S.add.image(z.X(PLATE.x), z.Y(PLATE.y), "sv2-plate").setDepth(D.item - 2));
    plate.setDisplaySize(z.L(PLATE.d), z.L(PLATE.d));
    plate.shadow = S.contactShadow(plate);
    const items = shelf(z0, S, ids, level);
    const SW = META.stage.w * STAGE_K;
    const SH = META.stage.h * STAGE_K;
    // a stage-canvas point (fractions) in world px, for a pastry centred at (cx, cy) design px
    const at = (cx, cy, fx, fy) => ({ x: z.X(cx - SW / 2 + fx * SW), y: z.Y(cy - SH / 2 + fy * SH) });
    const P0 = { x: BOARD.x, y: BOARD.y + 10 };

    /* the pastry: its stage sprite, and a canvas that draws the fold in between */
    function pastry(x) {
      const img = S.track(S.add.image(z.X(x), z.Y(P0.y), "sv2-stage-0").setDepth(D.item));
      img.setScale(z.L(STAGE_K));
      img.blobs = [];
      return img;
    }
    const foldKey = "sv2-foldcv";
    if (S.textures.exists(foldKey)) S.textures.remove(foldKey);
    const cv = S.textures.createCanvas(foldKey, META.stage.w, META.stage.h);
    const fimg = S.track(S.add.image(z.X(P0.x), z.Y(P0.y), foldKey).setDepth(D.item + 0.5).setScale(z.L(STAGE_K)).setVisible(false));
    const W = META.stage.w;
    const H = META.stage.h;
    function drawFold(srcKey, f, t, blobs = []) {
      const c = cv.getContext();
      const src = S.textures.get(srcKey).getSourceImage();
      const poly = f.flap.map(([x, y]) => [x * W, y * H]);
      const [[x1, y1], [x2, y2]] = f.line.map(([x, y]) => [x * W, y * H]);
      const path = () => {
        c.beginPath();
        poly.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.closePath();
      };
      c.clearRect(0, 0, W, H);
      // the pastry without its flap
      c.save();
      c.beginPath();
      c.rect(0, 0, W, H);
      poly.slice().reverse().forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
      c.closePath();
      c.clip("evenodd");
      c.drawImage(src, 0, 0);
      c.restore();
      // the filling on the pastry (the first fold covers it)
      blobs.forEach((b) => {
        const img = b.texture.getSourceImage();
        const bx = (b.x - fimg.x) / fimg.scaleX + W / 2;
        const by = (b.y - fimg.y) / fimg.scaleY + H / 2;
        c.save();
        c.translate(bx, by);
        c.rotate((b.angle * Math.PI) / 180);
        const w = b.displayWidth / fimg.scaleX;
        const h = b.displayHeight / fimg.scaleY;
        c.drawImage(img, -w / 2, -h / 2, w, h);
        c.restore();
      });
      // the flap, bent over its line: its distance from the line scales by cos(pi t) (past half, its back)
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const s = Math.cos(Math.PI * t);
      c.save();
      // standing up, the flap's far edge comes toward the camera (up and a little left): a shear that
      // grows with the distance from the fold line, so the fold line itself stays put
      const lift = Math.sin(Math.PI * t);
      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);
      const vOf = ([x, y]) => -(x - x1) * sinA + (y - y1) * cosA;
      const vFar = poly.reduce((m, q) => (Math.abs(vOf(q)) > Math.abs(m) ? vOf(q) : m), 0) || 1;
      const [ox, oy] = [-10 * cosA - 34 * sinA, 10 * sinA - 34 * cosA]; // (-10, -34) in the line's frame
      c.translate(x1, y1);
      c.rotate(ang);
      c.transform(1, 0, (ox * lift) / vFar, (Math.abs(s) < 0.02 ? 0.02 * Math.sign(s || 1) : s) + (oy * lift) / vFar, 0, 0);
      c.rotate(-ang);
      c.translate(-x1, -y1);
      path();
      c.clip();
      c.drawImage(src, 0, 0);
      // light from the upper left: the lifted flap darkens as it stands up, its back is a touch paler
      path();
      c.fillStyle = s >= 0 ? `rgba(90,55,20,${0.28 * Math.sin(Math.PI * t)})` : `rgba(255,245,220,${0.18 * Math.sin(Math.PI * t)})`;
      c.fill();
      c.restore();
      // the shadow the standing flap throws on the pastry (down and to the right)
      if (t > 0.05 && t < 0.95) {
        c.save();
        c.globalCompositeOperation = "source-atop";
        c.translate(10 * Math.sin(Math.PI * t), 12 * Math.sin(Math.PI * t));
        c.translate(x1, y1);
        c.rotate(ang);
        c.scale(1, s * 0.5 + 0.5);
        c.rotate(-ang);
        c.translate(-x1, -y1);
        path();
        c.fillStyle = `rgba(60,35,10,${0.12 * Math.sin(Math.PI * t)})`;
        c.fill();
        c.restore();
      }
      cv.refresh();
    }

    /* a spoonful: it lifts off its bowl and drops on the pastry's filling patch */
    const fillAt = (sheet) => {
      const f = META.stage.fill;
      return { x: sheet.x + (f.x - 0.5) * SW * z.k, y: sheet.y + (f.y - 0.5) * SH * z.k, r: f.r * SW * z.k };
    };
    async function spoon(sheet, id, { quiet = false, fast = false } = {}) {
      const obj = items[id];
      const key = S.textures.exists(`sv2-top-${id}`) ? `sv2-top-${id}` : S.tex(`layer:${id}`);
      const from = obj ? { x: obj.x, y: obj.y - obj.displayHeight * 0.7 } : { x: z.X(800), y: z.Y(700) };
      if (obj && !fast) S.tweens.add({ targets: obj, scale: obj.baseScale * 1.08, duration: 90, yoyo: true });
      const b = S.track(S.add.image(from.x, from.y, key).setDepth(D.fx));
      const pa = fillAt(sheet);
      const n = sheet.blobs.length;
      // ONE mound in the pocket: each spoon lands on it (a little off-centre) and it grows, never
      // past the pocket's edge (the fold line stays clear)
      // (a later spoon is a touch smaller and sits a little off the top, so a mix of fillings shows)
      const size = n === 0 ? pa.r * 1.2 : pa.r * Math.min(1.25, 0.95 + n * 0.06);
      b.setDisplaySize(size * 0.6, size * 0.6);
      const a = n * 2.4 + Math.random() * 0.5;
      const rr = n === 0 ? 0 : 0.3;
      const tx = pa.x + Math.cos(a) * pa.r * rr;
      const ty = pa.y + Math.sin(a) * pa.r * rr;
      // the mound under it swells a touch with each spoon
      sheet.blobs.forEach((o) => S.tweens.add({ targets: o, scaleX: o.scaleX * 1.05, scaleY: o.scaleY * 1.05, duration: 160, delay: fast ? 200 : 420 }));
      if (!quiet) Cook.sfx.pop();
      await S.fly(b, tx, ty - z.L(40), { duration: fast ? 260 : 380, arc: z.L(110) });
      await new Promise((r) => S.tweens.add({ targets: b, y: ty, displayWidth: size, displayHeight: size * 0.92, duration: 140, ease: "Quad.easeIn", onComplete: r }));
      b.setDepth(D.item + 0.2 + n * 0.001);
      b.setAngle(Math.random() * 360);
      S.tweens.add({ targets: b, scaleY: b.scaleY * 0.9, duration: 80, yoyo: true });
      if (!quiet) S.puff(tx, ty, St.color(((Cook.data.words[id] || {}).layer || {}).color || "#f3e3b0"), z.L(26));
      b.wordId = id;
      sheet.blobs.push(b);
      return b;
    }

    /* ---------- FILL ---------- */
    let sheet = pastry(P0.x);
    S.tweens.add({ targets: sheet, alpha: { from: 0, to: 1 }, duration: 250 });
    const got = {};
    const order = [];
    let last = 0;
    for (;;) {
      const next = kinds.find((id) => (got[id] || 0) < want[id]) || null;
      const r = await St.freePick(z, { items, next, doneOk: order.length > 0, doneGlow: ctx.guided && !next });
      if (r.done) break;
      if (performance.now() - last < 220) continue; // a double tap
      last = performance.now();
      const id = r.id;
      got[id] = (got[id] || 0) + 1;
      order.push(id);
      // a count row counts up; nothing ticks before the fill closes (a one-spoon row ticking at its
      // first spoon would give the count away, UX 11)
      if ((want[id] || 0) > 1) UI.mission.tickItem(id, ctx.dishAt || 0);
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
      if (want[id]) return;
      fillWrong = fillWrong || (exclude.includes(id) ? `put ${id} in (they said no)` : `put ${id} in`);
      if (!retry && exclude.includes(id)) UI.mission.missItem(id, ctx.dishAt || 0, { no: true });
    });
    kinds.forEach((id) => {
      const g = got[id] || 0;
      const right = g === want[id];
      if (!right) {
        fillWrong = fillWrong || `spooned ${g}, they asked for ${want[id]}: ${id}`;
        if (!retry) UI.mission.missItem(id, ctx.dishAt || 0, { counted: true });
      }
      if (!ctx.guided && !retry) {
        (right ? Cook.markRight : Cook.markMiss)(id);
        if (want[id] <= 5) (right ? Cook.markRight : Cook.markMiss)(Cook.numId(want[id]));
      }
    });
    if (!retry) z.listen(!fillWrong, fillWrong || "filled");
    if (ctx.closeItem) ctx.closeItem(kinds);
    else UI.mission.closeItem(kinds, ctx.dishAt || 0);
    if (!fillWrong && exclude.length) UI.mission.closeItem(exclude, ctx.dishAt || 0, { no: true });
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
    const most = count + (k.maxExtra != null ? k.maxExtra : 3);
    const onPlate = [];
    let quit = false;
    while (n < most && !quit) {
      if (n > 0) {
        // the next strip slides in, and the same filling goes on it (the same spoons, said quietly)
        sheet = pastry(P0.x - 700);
        sheet.setAlpha(0);
        await new Promise((r) => S.tweens.add({ targets: sheet, x: z.X(P0.x), alpha: 1, duration: 380, ease: "Cubic.easeOut", onComplete: r }));
        for (const id of order) await spoon(sheet, id, { quiet: true, fast: true });
      }
      for (let f = 0; f < 3; f++) {
        const fd = META.folds[f];
        const src = `sv2-stage-${f}`;
        const cxy = { x: (sheet.x - z.X(P0.x)) / z.k + P0.x, y: P0.y };
        const poly = fd.flap.map(([x, y]) => at(cxy.x, cxy.y, x, y));
        const cen = poly.reduce((s, p) => ({ x: s.x + p.x / poly.length, y: s.y + p.y / poly.length }), { x: 0, y: 0 });
        const [l1, l2] = fd.line.map(([x, y]) => at(cxy.x, cxy.y, x, y));
        // the centroid's mirror over the fold line: where the flap lands
        const lx = l2.x - l1.x;
        const ly = l2.y - l1.y;
        const ll = lx * lx + ly * ly;
        const tt = ((cen.x - l1.x) * lx + (cen.y - l1.y) * ly) / ll;
        const foot = { x: l1.x + lx * tt, y: l1.y + ly * tt };
        const to = { x: 2 * foot.x - cen.x, y: 2 * foot.y - cen.y };
        glowOn = { poly, a: cen, b: to };
        const offerGo = n > 0 && f === 0;
        const r = await swipe(z, S, {
          onDrag: () => (glowOn = null), from: cen, to, draw: (t) => drawFold(src, fd, t, f === 0 ? sheet.blobs : []), fimg, sheet, offerGo, goLabel: phases.go || "fry them", expectGo: offerGo && n >= count, glowGo: offerGo && ctx.guided && n >= count, minLen: k.minLen || 0.45 });
        glowOn = null;
        if (r === "go") {
          quit = true;
          break;
        }
        // the snap: the next stage, a little pop, a click
        if (f === 0) sheet.blobs.forEach((b) => b.destroy());
        sheet.setTexture(`sv2-stage-${f + 1}`);
        fimg.setVisible(false);
        sheet.setVisible(true);
        Cook.sfx.flip();
        setTimeout(() => Cook.sfx.click(), 60);
        const s0 = sheet.scale;
        S.tweens.add({ targets: sheet, scale: s0 * 1.05, duration: 70, yoyo: true, ease: "Quad.easeOut" });
        z.progress((f + 1) / 3);
      }
      if (quit) {
        // the spare strip goes back
        sheet.blobs.forEach((b) => b.destroy());
        S.tweens.add({ targets: sheet, alpha: 0, x: sheet.x - z.L(200), duration: 260, onComplete: () => sheet.destroy() });
        break;
      }
      n++;
      z.skill(100, "fold");
      S.sparkle(sheet.x, sheet.y);
      Cook.sfx.right();
      pop(z, S, Cook.display("ph-samosa"), sheet.x, sheet.y - z.L(200), { speakId: "ph-samosa", ms: 1100 });
      // onto the plate: the plate shows how many (never a count to aim for)
      await Cook.wait(160);
      S.tweens.killTweensOf(sheet);
      sheet.setScale(z.L(STAGE_K));
      const spot = plateSpot(onPlate.length, PLATE.x, PLATE.y, 0.8);
      await S.fly(sheet, z.X(spot.x), z.Y(spot.y), { scale: sheet.scale * 0.36, duration: 420, arc: z.L(90) });
      sheet.setAngle(spot.a);
      onPlate.push(sheet);
      if (n >= most) break;
    }
    stopGlowTick();
    glowG.destroy();
    UI.hideGo();
    UI.hideDone();
    z.expect({ kind: "wait" });
    await Cook.wait(250);
    return { n, got, fillWrong, order };
  }

  /** Where the i-th samosa sits on a plate (design px, around cx, cy; k = spread). */
  function plateSpot(i, cx, cy, k = 1) {
    const S3 = [[-66, -12, -8], [66, -12, 8], [0, 58, 0], [-74, 70, -14], [74, 70, 14], [0, -82, 4]];
    const s = S3[i % S3.length];
    return { x: cx + s[0] * k, y: cy + s[1] * k, a: s[2] };
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
      const finish = (r) => {
        if (over) return;
        over = true;
        offs.forEach((o) => o());
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
      if (offerGo) UI.go(goLabel, { glow: !!glowGo }).then(() => finish("go"));
      z.expect(expectGo ? { kind: "click", selector: "#go-btn" } : { kind: "swipe", x1: from.x, y1: from.y, x2: to.x, y2: to.y });
    });
  }

  /* ---------- 3: fry in the karahi on the kit hob (one burner), lift onto the paper-lined plate ---------- */
  async function fry(z, { n, level }) {
    const z0 = z;
    z = Cook.liftZone(z0);
    const S = z.S;
    const ctx = z.ctx;
    const Kit = Cook.Kit;
    const k = Mech.knobs("fry", { level });
    const [lo, hi] = k.band || [0.62, 0.84];
    backdrop(z0, S);
    // the hob (one burner, one karahi) and the paper-lined plate, centred as one group above the shelf
    // band (the chai/maani grid); the folded samosas wait on thalis on the band
    const hob = Kit.hob(S, { n: 1, k: z.L(FRY.hobK), cx: z.X(FRY.bx - FRY.hobDx), bottom: z.Y(SHELF_TOP - 30) });
    const burner = Kit.burner(S, hob, 0, { flameR: z.L(FRY.r * 0.97) });
    const bodyR = z.L(FRY.r);
    Kit.place(S, "karahi", hob.burners[0], bodyR);
    const oilR = bodyR * Kit.VESSELS.karahi.oil;
    const ring = Kit.heatRing(S, { width: z.L(12) });
    const PY = (hob.burners[0].y - z.Y(0)) / z.k; // the plate sits on the burner's line (design px)
    const paper = S.track(S.add.image(z.X(FRY.px), z.Y(PY), "sv2-paper").setDepth(D.item - 2));
    paper.setScale(z.L(FRY.pd) / 720);
    paper.shadow = S.contactShadow(paper);
    const FS = z.L(128) / META.fry.w; // a samosa's scale (fry canvases)
    const raw = [];
    const trays = [];
    for (let i = 0; i < n; i++) {
      const x = 800 + (i - (n - 1) / 2) * FRY.trayPitch;
      const t = S.track(S.add.image(z.X(x), z0.Y(FRY.trayY), "sv2-thali").setDepth(D.item - 1));
      t.setScale(z.L(FRY.trayD) / t.width);
      t.shadow = S.contactShadow(t);
      trays.push(t);
      const im = S.track(S.add.image(z.X(x), z0.Y(FRY.trayY - 4), "sv2-fry-0").setScale(FS * 0.85).setAngle(i % 2 ? 6 : -6).setDepth(D.item + 0.1 + i * 0.01));
      im.baseScale = FS * 0.85;
      im.handAction = false;
      raw.push(im);
    }

    // 1. the knob: the oil heats (the ring fills to its "now" band)
    let heat = 0;
    const cx = hob.burners[0].x;
    const cy = hob.burners[0].y;
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
    z.expect({ kind: "wait" });
    const hotLo = 0.55;
    const hotHi = 0.8;
    await new Promise((r) => {
      const hdt = clock();
      const stop = S.addTick(() => {
        heat = Math.min(0.68, heat + (hdt() / 1000) * 0.3 * (Cook.speed || 1));
        ring.draw(cx, cy, bodyR + z.L(18), heat, hotLo, hotHi);
        if (heat >= 0.68) {
          stop();
          r();
        }
      });
    });
    burner.set("low");
    S.tweens.addCounter({ from: 1, to: 0, duration: 400, onUpdate: (t) => ring.g.setAlpha(t.getValue()), onComplete: () => ring.clear() });
    // shimmer on the oil: it's hot
    const shimmer = S.track(S.add.ellipse(cx, cy, oilR * 1.6, oilR * 1.6, 0xfff3c0, 0).setDepth(D.item + 0.05));
    S.tweens.add({ targets: shimmer, alpha: 0.12, duration: 700, yoyo: true, repeat: -1 });

    // 2. drop them in (any order, one tap each), lift each when golden
    // places in the oil: round its middle, far enough apart that the rings don't cross
    const SPOTS = [-90, 30, 150, -30, 90, 210].map((d) => [0.54 * Math.cos((d * Math.PI) / 180), 0.54 * Math.sin((d * Math.PI) / 180)]);
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
        f.ring.draw(f.a.x, f.y0 + z.L(4), z.L(54), Math.min(1.25, f.level), lo, hi);
        // a gentle bob in the oil, and bubbles
        f.a.y = f.b.y = f.y0 + Math.sin(performance.now() / 260 + f.ph) * z.L(2);
        if (Math.random() < 0.08) {
          const bx = f.a.x + (Math.random() - 0.5) * z.L(110);
          const by = f.a.y + (Math.random() - 0.5) * z.L(90);
          const bub = S.track(S.add.circle(bx, by, z.L(3 + Math.random() * 4), 0xfffbe6, 0.7).setDepth(D.item + 0.9));
          S.tweens.add({ targets: bub, scale: 1.6, alpha: 0, duration: 420, onComplete: () => bub.destroy() });
        }
      });
      const cur = frying.filter((f) => !f.out).sort((a, b) => b.level - a.level)[0];
      if (cur) z.gauge({ level: cur.level, lo, hi });
    });
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);
    const spoonImg = S.track(S.add.image(z.X(1060), z.Y(170), "sv2-spoon").setDepth(D.fx).setScale(z.L(210) / 341).setAngle(-30).setAlpha(0));
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
        S.tweens.add({ targets: im, scale: FS * 0.85 * 1.06, duration: 520, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
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
            // the slotted spoon (no hand) scoops it out onto the paper
            const L = f.level;
            const verdict = L < lo ? "light" : L > (k.burnAt || 1.15) ? "dark" : "golden";
            if (verdict !== "golden") bad = bad || (verdict === "light" ? "lifted a samosa before it was golden" : "a samosa went too dark");
            z.skill(verdict === "golden" ? 100 : verdict === "light" ? 55 : k.burntScore || 40, "fry");
            spoonImg.setPosition(im.x + z.L(40), im.y - z.L(60)).setAlpha(1);
            S.tweens.add({ targets: spoonImg, x: im.x + z.L(10), y: im.y + z.L(10), duration: 160 });
            await Cook.wait(170);
            const spot = plateSpot(lifted.length, FRY.px, PY, 0.95);
            Cook.sfx.pop();
            const moves = [im, b].map((o) => S.fly(o, z.X(spot.x), z.Y(spot.y), { scale: FS, duration: 460, arc: z.L(100) }));
            S.tweens.add({ targets: spoonImg, x: z.X(spot.x) + z.L(40), y: z.Y(spot.y) - z.L(40), duration: 460, onComplete: () => S.tweens.add({ targets: spoonImg, alpha: 0, duration: 200 }) });
            await Promise.all(moves);
            im.setAngle(spot.a);
            b.setAngle(spot.a);
            lifted.push({ im, b, verdict });
            if (verdict === "golden") S.sparkle(im.x, im.y);
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
    tick();
    z.gauge(null);
    z.expect({ kind: "wait" });
    burner.set("off");
    ring.clear();
    shimmer.destroy();
    if (sizzle && sizzle.stop) sizzle.stop();
    await Cook.wait(300);
    return { lifted: lifted.map((l) => l.verdict), bad, plate: { img: paper, items: lifted.flatMap((l) => [l.im, l.b]) } };
  }

  /* ---------- serve and taste (§14a) ---------- */
  async function serve(z, { who, plate, ok, last }) {
    const S = z.S;
    const ctx = z.ctx;
    z.expect({ kind: "wait" });
    const faceKey = (m) => (S.textures.exists(`sv2-${who}-${m}`) ? `sv2-${who}-${m}` : null);
    let person = null;
    const kN = faceKey("neutral");
    const sizeP = (im) => im.setScale((z.L(520) / im.height) * (who === "cousin" ? 0.92 : 1));
    if (kN) {
      person = S.track(S.add.image(z.X(Cook.offRight(1760)), z.Y(960), kN).setOrigin(0.5, 1).setDepth(D.bg + 1.1));
      sizeP(person);
      await new Promise((r) => S.tweens.add({ targets: person, x: z.X(PERSON_X), duration: 520, ease: "Back.easeOut", onComplete: r }));
    }
    const mood = (m) => {
      const key = person && faceKey(m);
      if (!key) return;
      person.setTexture(key);
      sizeP(person);
    };
    // the plate slides to them
    Cook.sfx.whoosh();
    const all = [plate.img].concat(plate.items);
    // toward them, onto the counter's front (design ~1195, 620)
    const dx = z.X(PERSON_X - 255) - plate.img.x;
    const dy = z.Y(620) - plate.img.y;
    const home = all.map((o) => ({ o, x: o.x, y: o.y, s: o.scaleX }));
    const cx0 = plate.img.x;
    const cy0 = plate.img.y;
    await new Promise((r) =>
      S.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 520,
        ease: "Cubic.easeInOut",
        onUpdate: (tw) => {
          const v = tw.getValue();
          const sc = 1 - 0.2 * v;
          home.forEach((h) => {
            h.o.x = cx0 + dx * v + (h.x - cx0) * sc;
            h.o.y = cy0 + dy * v + (h.y - cy0) * sc;
            h.o.setScale(h.s * sc);
          });
        },
        onComplete: r,
      }),
    );
    if (person) await new Promise((r) => S.tweens.add({ targets: person, x: person.x - z.L(26), angle: -3, duration: 260, yoyo: true, hold: 260, ease: "Sine.easeInOut", onComplete: r }));
    await Cook.wait(300);
    if (ok || last) {
      mood("happy");
      if (person) S.tweens.add({ targets: person, y: person.y - z.L(14), duration: 160, yoyo: true, repeat: 1 });
      Cook.sfx.right();
      S.sparkle(plate.img.x, plate.img.y);
      await pop(z, S, Lang.plain(Lang.line("welldone")).trim(), person ? person.x - z.L(40) : plate.img.x, z.Y(160), { line: Lang.line("welldone"), ms: 1500 });
      await Cook.wait(600);
      if (person) S.tweens.add({ targets: person, x: z.X(Cook.offRight(1800)), duration: 500, delay: 200, ease: "Sine.easeIn" });
      await Cook.wait(800);
      return true;
    }
    // not quite: a gentle face, they say their order again, the plate comes back empty
    mood("impatient");
    if (person) S.tweens.add({ targets: person, angle: { from: -2.5, to: 2.5 }, duration: 160, yoyo: true, repeat: 2, onComplete: () => person.setAngle(0) });
    Cook.sfx.soft();
    await Cook.wait(500);
    cardAgain(ctx);
    const line = orderLine(ladderOf(ctx));
    if (line) await Promise.race([St.customerSay(ctx, line, { hide: St.hideKnown(ctx) }), Cook.wait(9000)]);
    St.customerDone();
    plate.items.forEach((o) => S.tweens.add({ targets: o, alpha: 0, duration: 300 }));
    await Cook.wait(320);
    await new Promise((r) => S.tweens.add({ targets: plate.img, x: cx0, y: cy0, scale: home[0].s, duration: 460, onComplete: r }));
    mood("neutral");
    if (person) S.tweens.add({ targets: person, x: z.X(Cook.offRight(1760)), duration: 400, ease: "Sine.easeIn" });
    await Cook.wait(400);
    return false;
  }

  Mech.lab("samosa", {
    name: "Samosa",
    verb: "Fill, fold, fry",
    async run(L) {
      const R = Cook.Recipes;
      const who = (L.ctx.order && L.ctx.order.who) || "nana";
      const d = R.samosa.make(who, { level: L.level });
      L.card(d, R.samosa.steps(d));
      await L.station("samosa", { fillings: d.fillings, exclude: d.no, decoyPool: Cook.data.recipes.samosa.lists.fillings_all, count: d.count, who });
    },
  });
})(window);
