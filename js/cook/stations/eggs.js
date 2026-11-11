/*
 * Eggs at breakfast (Zafar's rapid prototype, 1 Nov; Sprint 18 wave 2: a game on its settings file and the kits; Sprint 19 wave C: on
 * its new art, to chai's standard).
 * Spec: build/reports/designs/prototype-notes-2026-11-01.md "Eggs at breakfast"; cook-baking-eggs.md stage E1; its gap page
 * docs/design-language/standard/gaps/eggs.md.
 *
 * The game's own mechanic (non-negotiable 1, kept as he made it):
 *   1. Tap the bowl: an egg lifts out. Tap the pot or the pan: it goes in (whole, or cracked flat), the burner lights.
 *   2. Each egg's ring fills; in the green it glows: tap it, it lifts. Tap a plate: it lands (a boiled egg halved).
 *      Each egg ticks its own card as it lands; a plate takes the number asked, an extra egg doesn't land (Zafar, 1 Nov).
 *   3. From L3 the salt and pepper shakers (Zafar's two new words): tap one, then a plate; the row ticks.
 *   4. Tap the tray: it goes to the table (the meal's kitchen): each plate slides to its person, who swaps to their happy pose
 *      and bounces, with steam; one that isn't what they asked for stays neutral (decision 8: never a frown).
 * S19 wave C (CK-66, SH-246, SH-247, ART-67; Zafar 9-10 Nov): chai's scene, built from our pieces. Chai's two-burner hob from the
 * kitchen kit (Cook.Kit.hob) with each burner's knob below its pan (the knob rule: two pans side by side, at every level); the boiled
 * eggs in chai's own top-down pan (its handle to the left, as chai's), the fried eggs in the brushed-steel pan (his steel pick, the v4
 * cut), its handle turned by us up and to the left, between the two, clear of the pot and away from the band; chai's walnut tray on the
 * right with a cream plate (kit/plate-cream, his yes 10 Nov) for each person, their face circle in their plate's corner of the tray, as
 * chai's glasses; the bowl of eggs and the shakers (top-down pictures) on the stone tray band (tray: true, as wave B's corn); the egg
 * cracked into the pan, cooked, overdone if it is left; boiled eggs halved on the plate. Soft shadows in code (the grill kit's: one
 * light from the upper left). The hob is as big as the row allows (the tray keeps its least width).
 * Everything else is a kit call: the hob, the burners, knobs and flames, the heat ring (the kitchen kit's stove part), the shared pill
 * (Shelf.P.chip), the lights and lessons (Cook.Coach), the order card's ticks (UI.mission), the level-up count (Cook.roundDone).
 * Its settings: data/stations/eggs.json (Cook.data.settings.eggs: items, scene, assets; mechanic.levels the knobs by level).
 * The order is recipes.eggs (data/cook.json): what each person says comes from the language engine ("Muke ba tarela inda khape": the
 * count in their headline, one card per egg, CK-64).
 */
import { Cook as CookNS } from "../ns.js";
import "../grill-kit.js"; // (the kit's soft shadow: Cook.GrillKit.shadow)

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const KEY = "eggs";
  const NOTE = `${KEY}:s14-light`;

  // the settings file (data/stations/eggs.json, carried by zone.js as Cook.data.settings.eggs)
  const SET = () => ((Cook.data && Cook.data.settings) || {})[KEY] || {};
  const ITEM = (k) => (SET().items || {})[k] || {};
  const SCENE = () => SET().scene || {};
  // the pot trial (Zafar, 10 Nov: try the top-down pot in eggs; if it looks better it replaces chai's too, else neither; ART-75 redoes
  // its uneven wall under the same names and box): scene.potTrial true draws items.potTop (kit/pot-water) in place of chai's pan
  const POT = () => (SCENE().potTrial && ITEM("potTop").states ? "potTop" : "pot");
  const url = (k, state) => (state ? (ITEM(k).states || {})[state] : ITEM(k).file);
  const tex = (k, state) => `eg-${k}${state ? `-${state}` : ""}`;
  const BOILED_LOOKS = ["soft", "firm", "over"];
  // the station's own colours (station.palette: the steam, the shakers' grains); UI colours stay the tokens'
  const col = (k) => parseInt(String((((Cook.data.stations || {})[KEY] || {}).palette || {})[k] || "").slice(1), 16);
  const RULES = () => global.Rules || (global.Tokens && global.Tokens.rules) || null;
  const shade = (S, img, o) => (Cook.GrillKit && Cook.GrillKit.shadow ? Cook.GrillKit.shadow(S, img, o) : null);

  /** Only what this round shows (decision 68): the items' states it draws, the tray, this meal's kitchen, the hob. */
  function ART(K) {
    const out = [];
    const add = (k, state) => url(k, state) && out.push([tex(k, state), url(k, state)]);
    add(POT(), "water");
    add("pan");
    add("egg", "brown");
    ["cracked", "part", "cooked", "overdone"].forEach((s) => add("friedEgg", s));
    // (the boiled halves in the three looks a lift can show, E5: soft, firm, over; runny is before the green, never let out)
    BOILED_LOOKS.forEach((s) => ["a", "b"].forEach((h) => add("boiledEgg", `${s}-${h}`)));
    add("bowl");
    if (K.shakers) ["shakerSalt", "shakerPepper"].forEach((k) => add(k));
    // (the table, 10 Nov's art: the plate, the fried egg and the boiled halves seen at the table's own camera; the old side-on plate,
    // fried egg and egg cup they replace are no longer loaded)
    ["plateTable", "friedTable", "boiledTable", "cat"].forEach((k) => add(k));
    const sc = SCENE();
    const bg = (sc.bg || {})[K.meal || "breakfast"];
    if (bg) out.push([`eg-bg-${K.meal || "breakfast"}`, bg]);
    if (sc.tray) out.push(["eg-tray", sc.tray.file], ["eg-trayplate", sc.tray.plate]);
    return out.concat(Cook.Kit.art(2, []));
  }

  Mech.combined(KEY, {
    station: KEY,
    view: "marble",
    dataFile: "data/stations/eggs.json",
    // S19 (Fable's eggs flaw 1, CK-48): its view comes up only once its pictures are in (St.begin in eggs(), after St.loadArt), so the
    // play area is never empty marble while the panel already shows the order
    selfBegin: true,
    zones: [],
    async run(host, p) {
      return eggs(host, p);
    },
  });

  // an egg's card on the order (one card per egg, CK-64): fried a.fried + n.egg ("tarelo indo"), boiled ph-boiledegg
  const kindId = (fried) => (fried ? "a.fried" : "ph-boiledegg");
  const kindIds = (fried) => (fried ? ["a.fried", "n.egg"] : ["ph-boiledegg"]);

  /**
   * The places (design px): chai's hob on the left, as big as the row allows with the tray keeping its least width; the pot on the
   * left burner, the pan on the right, each handle turned by its settings' angle (CK-74: both down to the front corners), the room
   * its end needs past the hob kept clear; the tray on the right. The group is centred in the view's width (x 150-1450, the
   * narrowest play area) and in the worktop's height above the band.
   */
  function layout(band, ppw = 1) {
    const sc = SCENE();
    const hs = sc.hob || {};
    const tr = sc.tray || {};
    const H2 = Cook.Kit.HOB.sets[2];
    // (the worktop that shows: the design box's width less its margins, or the view's where the stage shows less of it; a taller
    // stage's extra worktop above the box goes into size, as chai's)
    const V = Cook.view || {};
    const m = hs.margin || [56, 24];
    const view = [Math.max(m[0], (V.left != null ? V.left : 0) + m[1]), Math.min(1600 - m[0], (V.right != null ? V.right : 1600) - m[1])];
    const top = Math.max(V.top != null ? V.top : 0, -(hs.extraMax || 320)) + (hs.top != null ? hs.top : 16);
    const bot = band.top - (hs.above != null ? hs.above : 26);
    const gap = hs.gap || 44;
    const rk = hs.rk || 0.36; // a vessel's rim radius over the burners' pitch
    const pot = ITEM(POT());
    const pan = ITEM("pan");
    const potReach = pot.reach || 2.08; // the pot's handle end from its middle, over its rim radius
    const panReach = pan.reach || 2.26;
    const panHW = (pan.handleW || 0.14) / 2; // the pan's handle's half width over its rim radius
    const trayMin = tr.min || 380;
    const W = view[1] - view[0];
    // a vessel's handle as a unit line from its burner: the pot's picture is flipped (its handle left at angle 0), the pan's handle
    // points down at angle 0; each turned by its settings' angle (CK-74, Zafar 10 Nov: 4b, both down to the front corners)
    const dirOf = (deg, flip) => {
      const a = (deg * Math.PI) / 180;
      const [bx, by] = flip ? [-1, 0] : [0, 1];
      return [bx * Math.cos(a) - by * Math.sin(a), bx * Math.sin(a) + by * Math.cos(a)];
    };
    const fit = (k) => {
      const w = H2.w * k;
      const h = H2.h * k;
      const pitch = (H2.burners[1][0] - H2.burners[0][0]) * w;
      const r = rk * pitch;
      // (with no angle in the settings, the pan's handle: up and to the left at phi above the level, its line clear of the pot's rim
      // by its half width and 12 px)
      const phi = Math.max(((hs.handleMin || 26) * Math.PI) / 180, Math.asin(Math.min(0.95, (r + panHW * r + 12) / pitch)));
      const panDeg = pan.angle != null ? pan.angle : 90 + (phi * 180) / Math.PI;
      const ends = [
        [H2.burners[0], dirOf(pot.angle || 0, !!pot.flip), potReach],
        [H2.burners[1], dirOf(panDeg, !!pan.flip), panReach],
      ].map(([bn, d, reach]) => [bn[0] * w + d[0] * reach * r, bn[1] * h + d[1] * reach * r]);
      const hw = panHW * r;
      const overL = Math.max(0, 8 + hw - Math.min(...ends.map((e) => e[0])));
      const overR = Math.max(0, Math.max(...ends.map((e) => e[0])) + hw + 8 - w);
      const above = Math.max(0, 4 + hw - Math.min(...ends.map((e) => e[1])));
      const below = Math.max(0, Math.max(...ends.map((e) => e[1])) + hw + 4 - h);
      const trayW = W - overL - w - overR - gap;
      return { k, w, h, pitch, r, overL, overR, phi, panDeg, above, below, trayW };
    };
    let L = null;
    for (let k = hs.kMax || 1; k >= 0.5; k -= 0.01) {
      L = fit(k);
      if (L.trayW >= trayMin && L.h + L.above + L.below <= bot - top) break;
    }
    const trayW = Math.min(L.trayW, tr.max || 520, ((bot - top) * 768) / 754);
    const trayH = (trayW * (tr.h || 754)) / (tr.w || 768);
    const total = L.overL + L.w + L.overR + gap + trayW;
    const x0 = view[0] + (W - total) / 2;
    const hobX = x0 + L.overL;
    const hobY = top + (bot - top - (L.h + L.above + L.below)) / 2 + L.above;
    // (the tray centred on the hob's height, but never up under the grown-ups' cog in the view's top right corner: its column's height
    // in page px, hs.cog; at 740x320 the tray's top face circle met it)
    const cogY = (V.top != null ? V.top : 0) + (hs.cog || 72) / Math.max(0.05, ppw);
    const trayY = Math.min(bot - trayH, Math.max(hobY + (L.h - trayH) / 2, cogY));
    return Object.assign(L, { hobX, hobY, trayX: hobX + L.w + L.overR + gap, trayY, trayW, trayH, angle: L.panDeg });
  }

  async function eggs(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const level = host.level;
    const guided = !!ctx.guided;
    const plates = (p.plates || []).slice(0, 4);
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const ready = K.ready || 0.72;
    const room = K.room || 6;
    const cookMs = K.cookMs || 3200;
    const overMs = K.overMs || cookMs; // (left that long after its ring is full, a fried egg browns: a look, never a verdict)
    // SH-158, the S14 roll-out (contract-77; the central rules' timed.firstTimeHold, as maani's flip and samosa's lift): a new player's
    // first egg holds in the middle of its green until it is lifted (js/cook/station-lib.js St.firstHold)
    const hold14 = St.firstHold(ctx, "eggs:lift");
    const sc = SCENE();
    await St.loadArt(S, ART(K).concat(...plates.map((q) => Cook.Kit.faceArt(q.who)))).catch(() => {});
    await St.begin(S, ctx, KEY, "marble");
    const objs = [];
    const T = (o) => (objs.push(o), S.track(o));
    const steps = St.steps(ctx);
    // the kitchen kit's worktop wash and the stone tray band (ART-69, SH-243: top-down things on the stone tray, as wave B's corn)
    const band = Object.assign({ top: 630, base: 818, chipY: 860 }, (global.Shelf && global.Shelf.BAND) || {}, sc.band || {});
    objs.push(Cook.Kit.worktop(S, { top: band.top, far: 2000 }));
    objs.push(St.stoneBand(S, { top: band.top, base: band.base, far: 2000, depth: D.bg + 1.2, game: KEY }));
    // SH-149 (contract-101): Nani's helper card and its drop-down, as in every kitchen game (eggs runs its own stage, never St.begin)
    if (St.helperWatch) St.helperWatch(ctx, KEY, { own: true });
    // the kitchen kit's first-time gate (STD-D1-01): each light once for a new player, or the first round ever here
    const gate = Cook.Coach.firsts(KEY, { round: new Set() });
    let hints = 0;
    let busy = 0; // moves in flight (the stuck hint waits for them)
    const flying = async (pr) => {
      busy++;
      try {
        return await pr;
      } finally {
        busy--;
      }
    };
    // SH-236 (contract-106): the move a light shows has begun: the lights go now
    const began = () => Cook.Coach.began && Cook.Coach.began(KEY);
    const ppw = (() => {
      try {
        return UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1;
      } catch (e) {
        return 1;
      }
    })();

    /* ---------------- the hob (chai's, the kitchen kit's) ---------------- */
    const LY = layout(band, ppw);
    const hob = Cook.Kit.hob(S, { n: 2, x: LY.hobX, y: LY.hobY, k: LY.k });
    objs.push(hob.img);
    if (hob.img.shadow) objs.push(hob.img.shadow);
    const R = LY.r; // each vessel's rim radius
    // each burner's knob below its pan on the hob's front edge (the knob rule: two pans side by side), its flames under the pan
    const burner = (i) => {
      const b = Cook.Kit.burner(S, hob, i, { flameR: R });
      [b.knob, b.knobHit, b.flameHi, b.flameLo, b.face].forEach((o) => o && objs.push(o));
      return b;
    };
    /*
     * Each vessel's round body centred on its burner (items.pot.body, items.pan.body: cx, cy its centre as fractions of the canvas, r
     * its rim radius and rIn its floor's, of the width). The pot is chai's own top-down pan (flipped, its handle to the left); the pan
     * turned by its settings' angle (CK-74), the pan by LY.angle where its settings give none.
     */
    const vessel = (k, i, fried, art = k) => {
      const b = burner(i);
      const it = ITEM(art);
      const body = it.body || { cx: 0.5, cy: 0.5, r: 0.45, rIn: 0.36 };
      const flip = !!it.flip;
      const img = T(S.add.image(b.x, b.y, fried ? tex(art) : tex(art, "water")).setDepth(D.item));
      img.setFlipX(flip).setOrigin(flip ? 1 - body.cx : body.cx, body.cy);
      img.setScale(R / (body.r * Math.max(1, img.width)));
      if (it.angle != null || fried) img.setAngle(it.angle != null ? it.angle : LY.angle);
      const sh = shade(S, img, { dx: 9, dy: 13, alpha: 0.28, blur: 9 });
      if (sh) sh.setFlipX(flip);
      // S19 (CK-63, SH-230; Zafar, 8 Nov: "it's half on the handle ... off-centered"): its light is on its round body alone, centred on
      // the burner, the handle left out (the kit's lights read thing.litBounds: Cook.Coach.box, C.parts)
      img.litBounds = () => ({ x: img.x - R, y: img.y - R, right: img.x + R, bottom: img.y + R });
      return { key: k, k, img, b, c: { x: b.x, y: b.y }, r: body.rIn * img.displayWidth, eggs: [], fried, on: false };
    };
    const vessels = { pot: vessel("pot", 0, false, POT()), pan: vessel("pan", 1, true) };
    const pot = vessels.pot.img;
    const pan = vessels.pan.img;
    // the burner lit while an egg is in (its knob turned, the flames under it): the kit's burner
    const look = (v) => {
      const on = v.eggs.length > 0;
      if (on === v.on) return;
      v.on = on;
      v.b.set(on ? "high" : "off");
    };
    const slotAt = (v, i) => {
      if (i === 0) return { x: v.c.x, y: v.c.y };
      const a = ((i - 1) / Math.max(1, room - 1)) * Math.PI * 2 - Math.PI / 2;
      return { x: v.c.x + Math.cos(a) * v.r * 0.62, y: v.c.y + Math.sin(a) * v.r * 0.62 };
    };

    /* ---------------- the band: the bowl of eggs and the shakers on the stone tray, each with its pill ---------------- */
    /*
     * S19 (Fable's eggs flaw 7: the pill under the bowl below the text and tap floors on the phone; SH-230: the pill inside the thing's
     * light): chai's own pill, the shared kit's (Shelf.P.chip, whose card size the lights and their checks read), the row's pills at one
     * scale as large as the floor asks and their neighbours allow (Shelf.pillScale on Shelf.pillWant: chai's fitPills), on the chip line;
     * each thing above its pill, the row centred under the hob
     */
    const SH = global.Shelf;
    const chipY = band.chipY;
    const pills = [];
    const things = [];
    const PILL_SLOT = 180; // (the things stand 200 apart: a pill's tap area at most its slot)
    const STEP = sc.bandStep || 200;
    const chip = (id, x) => {
      const c = SH.P.chip(S, x, chipY, Cook.display(id), {
        word: Cook.chipWord ? Cook.chipWord(id, ctx) : true,
        depth: D.item + 2,
        onTap: () => {
          if (Cook.unlockAudio) Cook.unlockAudio();
          if (Cook.onLabel) Cook.onLabel(id);
          Lang.speakWord(id);
        },
      });
      c.pillId = id;
      objs.push(c);
      pills.push(c);
      return c;
    };
    const onBand = (k, id) => {
      const img = T(S.add.image(0, 0, tex(k)).setDepth(D.item));
      img.k = k;
      img.size = (ITEM(k).drawn || {}).w || 120;
      img.setScale(img.size / Math.max(1, img.width, img.height));
      img.chip = chip(id, 0); // (its pill is part of its light: C.parts)
      img.wordId = id;
      things.push(img);
      return img;
    };
    const bowl = onBand("bowl", "n.egg");
    const shakers = {};
    if (K.shakers) {
      shakers["spi-16"] = { id: "spi-16", c: onBand("shakerSalt", "spi-16") };
      shakers["spi-11"] = { id: "spi-11", c: onBand("shakerPepper", "spi-11") };
    }
    const fitBand = () => {
      const mid = hob.x + hob.w / 2;
      things.forEach((img, i) => {
        const x = mid + (i - (things.length - 1) / 2) * STEP;
        img.x = x;
        img.chip.x = x;
      });
      const row = pills.filter((c) => c.active).sort((a, b) => a.x - b.x);
      const { k, cap } = SH.pillScale(row.map((c) => ({ x: c.x, w: c.faceW(c.showsWord) })), { want: SH.pillWant(ppw), gap: SH.pillGap(ppw), slotW: PILL_SLOT });
      const ph = ((SH.PILL || {}).h || 46) * k;
      const y = Math.min(chipY, 896 - ph / 2);
      row.forEach((c) => {
        if (c.capW !== cap) c.face(c.showsWord, cap);
        c.k = k;
        c.hit(PILL_SLOT);
        c.setScale(k).setY(y);
      });
      // (each thing above its pill, a small gap between, and never into the band's top: its hop's room above it)
      // CK-73 (Zafar, 10 Nov): on chai's shelf (band "shelf") each side-on thing stands on the shelf's line, as chai's jars do: its
      // height the settings' drawn.h, never above the band's top with its hop's room; its picture's clear foot (the cut's 16 px) below
      const onShelf = St.bandOf && St.bandOf(KEY) === "shelf";
      things.forEach((img) => {
        if (onShelf) {
          // CK-77 (the eye judge, 10 Nov: the carton a third of a pan's width, a speck on the band): its size by chai's rule for a
          // shelf thing, its size class (St.classFit: the band's room with the hop kept, the class's share, the floor on screen), as
          // chai's jars; its picture's clear foot on the shelf's line
          const foot = 16 / Math.max(1, img.height);
          const f = St.classFit ? St.classFit(S, tex(img.k), img.wordId, { base: band.base, ppw, slotW: STEP - 8 }) : null;
          if (f && f.scale) img.setScale(f.scale);
          else {
            const want = (ITEM(img.k).drawn || {}).h || 118;
            const room = band.base - (band.top + 22);
            img.setScale(Math.min(want, room / 1.12) / Math.max(1, img.height * (1 - 2 * foot)));
          }
          img.setOrigin(0.5, 1 - foot);
          img.y = band.base;
          if (!img.shadow) shade(S, img, { dx: 4, dy: 3, alpha: 0.22, blur: 4 });
          return;
        }
        const room0 = y - ph / 2 - 8 - (band.top + 22);
        const s = Math.min(img.size, room0 / 1.12);
        img.setScale(s / Math.max(1, img.width, img.height));
        img.y = y - ph / 2 - 8 - img.displayHeight / 2;
        if (!img.shadow) shade(S, img, { dx: 5, dy: 7, alpha: 0.24, blur: 5 });
      });
    };
    fitBand();
    Object.values(shakers).forEach((s) => Object.assign(s, { x: s.c.x, y: s.c.y }));
    const wanted = plates.reduce((a, q) => a + (q.n || 1), 0);

    /* ---------------- the tray: chai's walnut tray, a cream plate for each person, their face in its corner ---------------- */
    const tr = sc.tray || {};
    const trayD = LY.trayW;
    const trayH = LY.trayH;
    const tray = T(S.add.image(LY.trayX, LY.trayY, "eg-tray").setOrigin(0).setDepth(D.item - 4));
    tray.setDisplaySize(trayD, trayH);
    shade(S, tray, { dx: 8, dy: 11, alpha: 0.26, blur: 8 });
    const WELLS = tr.wells || [[0.283, 0.29], [0.717, 0.29], [0.283, 0.708], [0.717, 0.708]];
    const plateD = (tr.plate_d || 0.38) * trayD;
    const order = Cook.shuffle(plates.map((q, i) => i));
    const perPx = Math.max(0.01, ppw);
    const P0 = plates.map((q, i) => {
      const [fx, fy] = WELLS[order.indexOf(i)];
      const x = tray.x + fx * trayD;
      const y = tray.y + fy * trayH;
      const hit = T(S.add.image(x, y, "eg-trayplate").setDepth(D.item));
      hit.setScale(plateD / Math.max(1, hit.width, hit.height));
      shade(S, hit, { dx: 4, dy: 6, alpha: 0.22, blur: 5 });
      /*
       * CHAI-65 (chai's tray): each person's face in their own plate's corner of the tray, as big as the burner faces (the kit's BADGE)
       * and on a small screen at least 30 px as seen, up to 90; along the corner's diagonal, wholly inside the corner where the gap
       * allows, 4 px clear of the plate's rim; it shrinks only if even at the corner it would touch the plate. SH-183: at the badge
       * depth, full contrast, over everything on the tray.
       */
      const left = fx < 0.5;
      const top = fy < 0.5;
      const cx0 = left ? tray.x : tray.x + trayD;
      const cy0 = top ? tray.y : tray.y + trayH;
      const gx = Math.abs(x - cx0);
      const gy = Math.abs(y - cy0);
      const gR = plateD / 2;
      const clear = (k, d) => Math.hypot(gx - k, gy - k) >= gR + 4 + d / 2;
      let fd = Math.min(90, Math.max(Cook.Kit.BADGE || 64, 30 / perPx));
      let k = fd / 2 + 4;
      while (k > 0 && !clear(k, fd)) k -= 1;
      while (fd > 24 && !clear(Math.max(0, k), fd)) fd -= 2;
      k = Math.max(0, k);
      const face = T(S.add.image(left ? cx0 + k : cx0 - k, top ? cy0 + k : cy0 - k, Cook.Kit.badge(S, q.who)).setDisplaySize(fd, fd).setDepth(D.badge).setAlpha(1));
      // (SH-230: the plate's lit body is the plate with its own face circle, the light's one rule: plateBox below)
      hit.litBounds = () => plateBox(hit);
      const top0 = T(S.add.container(x, y).setDepth(D.item + 0.6));
      return { q, x, y, hit, face, top: top0, eggs: [], salt: false, pepper: false, ticked: false };
    });

    /* ---------------- an egg ---------------- */
    const sized = (o, w) => o.setScale(w / Math.max(1, o.width));
    const rawEgg = (x, y) => sized(T(S.add.image(x, y, tex("egg", "brown")).setDepth(D.fx)), vessels.pot.r * (ITEM("egg").inPot || 0.62));
    // SH-256 (the eye judge, 10 Nov: "the egg snaps from whole to fried"; the art's new egg-part, K7): cracked, then half set (egg-part),
    // then set, each look fading into the next; set a little before its ring's green, so its first-time light comes on the egg as it
    // will stay (nothing changes inside a light as it comes: contract-112); overdone if it is left past its full ring
    const hasPart = () => S.textures.exists(tex("friedEgg", "part"));
    const friedLook = (e) => (e.p >= 1 && Date.now() - e.full >= overMs / (Cook.speed || 1) ? "overdone" : e.p >= ready * 0.8 ? "cooked" : e.p >= ready * 0.35 && hasPart() ? "part" : "cracked");
    /** The egg's look fades to texture t over 0.4 s (a second picture over it, then the egg takes it); at once if it is moving or gone. */
    const toLook = (e, t) => {
      if (!S.textures.exists(t) || e.look === t) return;
      const first = !e.look;
      e.look = t;
      if (first && e.obj.texture.key === t) return;
      if (e.fade) e.fade.destroy();
      e.fade = null;
      if (e.lifted || e.out) return e.obj.setTexture(t);
      const f = T(S.add.image(e.obj.x, e.obj.y, t).setDepth(e.obj.depth + 0.01).setAlpha(0));
      f.setScale(e.obj.scaleX * (e.obj.width / Math.max(1, f.width)));
      e.fade = f;
      S.tweens.add({ targets: f, alpha: 1, duration: 400 / (Cook.speed || 1), onComplete: () => {
        if (e.fade !== f) return;
        if (e.obj.active) e.obj.setTexture(t);
        f.destroy();
        e.fade = null;
      } });
    };
    const endFade = (e) => {
      if (!e.fade) return;
      e.fade.destroy();
      e.fade = null;
      if (e.look && e.obj.active && e.obj.texture.key !== e.look) e.obj.setTexture(e.look);
    };
    // (s19-games-2, contract-114: a fried egg keeps its size from the pan to the plate within 15%, one egg on a plate or two: its size in
    // the pan is the plate's (FRIED.pan of the plate's width, one on a plate FRIED.one, two FRIED.two), never the pan's own)
    const FRIED = { pan: 0.64, one: 0.7, two: 0.58 };
    const friedW = () => Math.min(vessels.pan.r * (ITEM("friedEgg").inPan || 0.95), plateD * FRIED.pan);
    const friedEgg = (x, y, w) => sized(T(S.add.image(x, y, tex("friedEgg", "cracked")).setDepth(D.item + 0.4)), w);
    // a boiled egg on a plate: its two halves side by side (E5's boiled-<look>-a, -b), h tall
    // (s19-games-2, E5: the halves show how long it boiled, read from its ring as it was lifted: soft in the green's first half, firm
    // after it, over once it is left past its full ring as long as the fried egg takes to brown: a look, never a verdict)
    const boiledLook = (e) => (e.p >= 1 && e.full && Date.now() - e.full >= overMs / (Cook.speed || 1) ? "over" : e.p >= (ready + 1) / 2 ? "firm" : "soft");
    const halves = (x, y, h, look = "soft") => {
      const a = T(S.add.image(0, 0, tex("boiledEgg", `${look}-a`)).setDepth(D.item + 0.4));
      const b = T(S.add.image(0, 0, tex("boiledEgg", `${look}-b`)).setDepth(D.item + 0.4));
      [a, b].forEach((o) => o.setScale(h / Math.max(1, o.height)));
      const dx = (a.displayWidth + b.displayWidth) / 4 + 2;
      a.setPosition(x - dx, y);
      b.setPosition(x + dx, y);
      [a, b].forEach((o) => shade(S, o, { dx: 2, dy: 3, alpha: 0.2, blur: 3 }));
      return [a, b];
    };
    const steamPuff = (x, y, n = 3) => {
      for (let i = 0; i < n; i++) {
        const s = T(S.add.circle(x + (Math.random() - 0.5) * 30, y, 10 + Math.random() * 8, col("white"), 0.55).setDepth(D.fx + 2));
        s.fx = true; // (an effect: the lights never wait for it to end, stillStage)
        S.tweens.add({ targets: s, y: y - 90 - Math.random() * 40, alpha: 0, scale: 2.2, duration: 1300 + i * 200, delay: i * 180, onComplete: () => s.destroy() });
      }
    };

    /* ---------------- the state ---------------- */
    let held = null; // {kind: "raw"} | {kind: "cooked", egg} | {kind: "shaker", id}
    let rawHeld = null;
    const all = () => [...vessels.pot.eggs, ...vessels.pan.eggs];
    const cooking = () => all().filter((e) => !e.out);
    let finished = false;
    let finishUp = null;
    const doneP = new Promise((r) => (finishUp = r));

    const hold = (h) => {
      if (rawHeld && (!h || h.kind !== "raw")) {
        rawHeld.destroy();
        rawHeld = null;
      }
      if (held && held.kind === "shaker") S.tweens.add({ targets: shakers[held.id].c, scale: shakers[held.id].c.baseScale || shakers[held.id].c.scale, duration: 160 });
      if (held && held.kind === "cooked" && held.egg.lifted && !held.egg.out) S.tweens.add({ targets: held.egg.obj, scale: held.egg.base || 1, duration: 160 });
      held = h;
      // (picked up: it grows a little where it stands: contract-109)
      if (h && h.kind === "shaker") {
        const c = shakers[h.id].c;
        c.baseScale = c.baseScale || c.scale;
        S.tweens.add({ targets: c, scale: c.baseScale * 1.12, duration: 160 });
      }
      refresh();
    };

    const plateWants = (pl) => pl.q.n || 1;
    const plateFull = (pl) => pl.eggs.length >= plateWants(pl);
    const seasonDone = (pl) => (pl.q.salt !== "yes" || pl.salt) && (pl.q.pepper !== "yes" || pl.pepper);

    /** the next thing in the card's order (chai's rule): the first plate not finished, its eggs, then its salt and pepper; then the tray */
    function nextThing() {
      for (const pl of P0) {
        if (!plateFull(pl)) {
          const want = !!pl.q.fried;
          const key = want ? "n.egg" : "ph-boiledegg";
          if (held && held.kind === "cooked" && held.egg.fried === want) return { obj: pl.hit, key, what: "plate" };
          const readyEgg = all().find((e) => !e.out && e.fried === want && e.p >= ready);
          if (readyEgg) return { obj: readyEgg.obj, key, what: "egg" };
          const coming = all().filter((e) => !e.out && e.fried === want).length;
          const need = P0.filter((x) => !!x.q.fried === want).reduce((a, x) => a + Math.max(0, plateWants(x) - x.eggs.length), 0);
          if (coming >= need) return { obj: null, key: null, what: "wait" };
          if (held && held.kind === "raw") return { obj: want ? pan : pot, key, what: "vessel" };
          return { obj: bowl, key: "n.egg", what: "bowl" };
        }
        if (!seasonDone(pl)) {
          const id = pl.q.salt === "yes" && !pl.salt ? "spi-16" : "spi-11";
          if (held && held.kind === "shaker" && held.id === id) return { obj: pl.hit, key: id, what: "plate" };
          return { obj: shakers[id] && shakers[id].c, key: id, what: "shaker" };
        }
      }
      return { obj: tray, key: null, what: "tray" };
    }

    /* ---------------- the lights (the kitchen kit's: Cook.Coach) ---------------- */
    // a thing's box on the page, for the kit's light; a plate's is its round body with its own face (never a neighbour's face)
    const plateOf = (o) => P0.find((pl) => pl.hit === o);
    const plateBox = (o) => {
      const pl = plateOf(o);
      const r = pl ? (plateD / 2) * 0.96 : 0; // (the rim, inside the picture's edge)
      const f = pl ? pl.face.getBounds() : null;
      // (a pan or the pot: its round body alone, thing.litBounds, CK-63)
      const b = pl ? { x: Math.min(pl.x - r, f.x), y: Math.min(pl.y - r, f.y), right: Math.max(pl.x + r, f.right), bottom: Math.max(pl.y + r, f.bottom) } : typeof o.litBounds === "function" ? o.litBounds() : o.getBounds();
      // (contract-82: the box stops short of another plate's face beside it, the light's pad and a gap clear: the pad is page px,
      // Onboard.BOX_PAD, so on a phone it is more world px)
      const clear = Math.max(16, (((global.Onboard && global.Onboard.BOX_PAD) || 10) + 6) / perPx);
      if (pl)
        P0.filter((q) => q !== pl).forEach((q) => {
          const g = q.face.getBounds();
          const across = g.right > b.x && g.x < b.right;
          const beside = g.bottom > b.y && g.y < b.bottom;
          if (across && g.y > pl.y) b.bottom = Math.min(b.bottom, g.y - clear);
          else if (across && g.bottom < pl.y) b.y = Math.max(b.y, g.bottom + clear);
          else if (beside && g.x > pl.x) b.right = Math.min(b.right, g.x - clear);
          else if (beside && g.right < pl.x) b.x = Math.max(b.x, g.right + clear);
        });
      return b;
    };
    // S19 (SH-230): a thing on the band (the bowl, a shaker) is lit whole with its pill and its hop's room (the kit's parts, C.parts),
    // part by part so the light's one rule hugs their union (Onboard.litBox); anything else by its box above
    const PARTS = [0, 1, 2, 3, 4, 5];
    const lightOf = (o) => (o && o.chip ? PARTS.map((i) => () => (Cook.Coach.parts(o)[i] || null)) : Cook.Coach.box(o, 0, { bounds: plateBox }));
    // the level's wait before the stuck hint (the central rules' hintS), a child's time: the kit takes it as it is (never divided by the
    // test speed, s19-lights 9 Nov), as contract-24 and -91 read it in real time
    const hintMs = () => ((RULES() && RULES().hintMs ? RULES().hintMs(level) : 0) || 7000);
    let glowObj = null;
    const glowOn = (o) => {
      if (glowObj === o) return;
      if (glowObj && glowObj.active) S.glow(glowObj, false);
      glowObj = o;
      if (o) S.glow(o, true, { bounce: true, now: true }); // (SH-237: a thing on the band hops in its light; the kit drops the hop off the shelf)
    };
    // (a thing's glow lasts exactly as long as the kit's light round it, and never without one: contract-102)
    // (s19-games-2, contract-107: a shelf thing hops as its light comes, even before the light's handle is there; it goes with the light)
    const glowWith = (o, h) => {
      if (!Cook.Coach.onShelf(o)) return glowObj === o && glowOn(null);
      glowOn(o);
      if (h && h.done) h.done.then(() => glowObj === o && glowOn(null));
    };
    let ctl = null;
    let stuck = null;
    let ctlKey = null;
    let nextV = null;
    let ids = 0;
    const idOf = (o) => (o.eggId = o.eggId || ++ids);
    // one step at a time: the first time it comes up, its light with the call (the kit's first-time gate, Cook.Coach.control); after
    // that the call alone, and the stuck help (SH-228, chai's method: Cook.Coach.stuck, her helper card or her line again with the
    // light) after the level's wait, at once after a wrong move (Cook.Coach.wrong). The pick between the pot and the pan is the next
    // vessel: the first time, a light round the one this plate needs.
    const coach = (n) => {
      const key = !n.obj ? "wait" : `${n.what}:${idOf(n.obj)}`;
      if (key === ctlKey) return;
      ctlKey = key;
      if (ctl) ctl.close();
      ctl = null;
      if (stuck) stuck.close();
      stuck = null;
      if (nextV) nextV.stop();
      nextV = null;
      glowOn(null);
      if (!n.obj || finished) return;
      let first = false;
      const target = lightOf(n.obj);
      if (n.what === "vessel") {
        if (gate.first("next-pan"))
          nextV = Cook.Coach.nextLight({ now: true, target: Cook.Coach.box(n.obj, 0, { bounds: plateBox }), quitIf: () => finished || ctlKey !== key, who: n.obj === pot ? "pot" : "pan", note: NOTE });
      } else first = gate.first(`ctl-${n.what}`);
      const current = () => ctlKey === key && !finished;
      // (its glow lasts as long as its light, which goes as the child starts the move: contract-102, SH-236; only a thing on the band
      // glows and hops with its light, so Nani's call reading its row is the one other highlight: contract-8)
      const lightGlow = () => setTimeout(() => current() && glowWith(n.obj, ctl && ctl.lit ? ctl.lit() : null), 0);
      ctl = Cook.Coach.control({ key: KEY, target, first, noHint: true, current, busy: () => busy > 0, still: stillStage, onLight: lightGlow, note: NOTE });
      if (Cook.Coach.stuck)
        stuck = Cook.Coach.stuck({
          key: KEY,
          level,
          target,
          hintMs,
          current,
          busy: () => busy > 0,
          glow: (on) => (on ? setTimeout(() => current() && glowWith(n.obj, stuck && stuck.lit ? stuck.lit() : null), 0) : glowObj === n.obj && glowOn(null)),
          onHint: () => hints++, // (SH-160: the guide's hint came)
          note: NOTE,
        });
    };
    const wrong = () => Cook.Coach.wrong();
    // (s19-games-2, contract-78: the stage is still when nothing of the game's is in flight; the boiling pot's steam is an effect that never
    // ends while it boils, so a light never waits on it, and the call held for the light comes with it)
    function stillStage() {
      try {
        return !S.tweens.getTweens().some((tw) => tw.isPlaying() && !tw.isInfinite && !(tw.targets || []).every((t) => t && t.fx));
      } catch (e) {
        return true;
      }
    }

    // CK-76 (the eye judge, 10 Nov: "Hane indo!" through the carton, the pan and the plating; chai names each step): Nani's box names
    // each step as it opens, from the engine only (R2): an egg from the bowl "Hane indo!", into the pot or pan "Indo wiji chad!", out
    // of it when it is ready "(Tarelo) indo hane kadh.", the salt or the pepper "Loon / Mari wiji chad!"; a plate and the tray have no
    // Kutchi yet (v.serve, to record: its English in grey italic, on the recording sheet), never a line written here
    let stepWhat = null;
    let stepN = 0;
    const stepLineOf = (n) => {
      if (n.what === "bowl") return Lang.line("now", Lang.phrase(["n.egg"]));
      if (n.what === "vessel") return St.addLine("n.egg");
      if (n.what === "egg") return Lang.line("lift", Lang.phrase(n.key === "n.egg" ? ["a.fried", "n.egg"] : ["n.egg"]));
      if (n.what === "shaker" || (n.what === "plate" && /^spi-/.test(String(n.key)))) return St.addLine(n.key);
      if (n.what === "plate" || n.what === "tray") return Lang.say({ fn: "Command", verb: "v.serve" });
      return null;
    };
    const stepFor = (n) => {
      if (!n.obj) return; // (waiting for an egg to cook: the step stays as it was)
      const what = n.what === "shaker" || (n.what === "plate" && /^spi-/.test(String(n.key))) ? `season:${n.key}` : n.what === "egg" ? `egg:${idOf(n.obj)}` : `${n.what}:${n.key}`;
      if (what === stepWhat) return;
      stepWhat = what;
      const line = stepLineOf(n);
      if (line) kitHelps(steps.to("eggs:eggs", { id: `eggs-${++stepN}`, line }));
    };

    function refresh() {
      if (finished) return;
      const n = nextThing();
      coach(n);
      stepFor(n);
      if (n.obj) {
        const c = S.centre(n.obj);
        // (contract-70: lifting a cooked egg is the timed window's control, as samosa's "lift": its call is said as the green opens, never
        // held for Nani's helper card as an item's is, SH-172)
        z.expect({ kind: "tap", x: c.x, y: c.y, key: n.what === "egg" ? "lift" : n.key || undefined });
      } else z.expect({ kind: "wait" });
    }

    /* ---------------- the moves ---------------- */
    S.tappable(bowl, () => {
      began();
      if (held && held.kind === "raw") return;
      hold({ kind: "raw" });
      rawHeld = rawEgg(bowl.x, bowl.y - 30);
      S.tweens.add({ targets: rawHeld, y: bowl.y - bowl.displayHeight / 2 - 70, duration: 260, ease: "Back.easeOut" });
      Cook.sfx.pop();
      z.progress({ took: "n.egg" });
    });

    const putIn = async (v) => {
      if (!held || held.kind !== "raw" || !rawHeld) return;
      if (v.eggs.length >= room) {
        Cook.sfx.soft();
        return wrong();
      }
      const at = slotAt(v, v.eggs.length);
      const egg = { fried: v.fried, v, p: 0, out: false, at, obj: null, full: 0 };
      v.eggs.push(egg);
      const o = rawHeld;
      rawHeld = null;
      held = null;
      refresh();
      await flying(S.fly(o, at.x, at.y, { duration: 380, arc: 120 }));
      // (the tray went to the table while it flew: nothing is left to cook it in)
      if (finished) return o.active && o.destroy();
      if (v.fried) {
        // cracked into the pan (egg-cracked), it sets as its ring fills (egg-cooked), browns if it is left (egg-overdone)
        // SH-256 (the eye judge, 10 Nov: "a whole egg in its shell sits in the pan, then is a fried egg in one step"): the egg cracks
        // into it gradually: the shell sinks and fades as the egg spreads out from where it fell
        Cook.sfx.pop();
        egg.obj = friedEgg(at.x, at.y, friedW());
        const s = egg.obj.scale;
        egg.obj.setScale(s * 0.35).setAlpha(0);
        S.tweens.add({ targets: egg.obj, scale: s, alpha: 1, duration: 520, ease: "Cubic.easeOut" });
        o.setDepth(D.item + 0.5);
        S.tweens.add({ targets: o, scaleX: o.scaleX * 0.6, scaleY: o.scaleY * 0.6, y: o.y + 6, alpha: 0, duration: 360, ease: "Sine.easeIn", onComplete: () => o.destroy() });
        if (Cook.sfx.sizzle) Cook.sfx.sizzle(0.6);
      } else {
        egg.obj = o;
        o.setDepth(D.item + 0.4);
        Cook.sfx.pop();
        S.tweens.add({ targets: o, y: at.y - 6, duration: 420, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
      egg.ring = Cook.Kit.heatRing(S, { depth: D.fx + 1, width: 6 });
      look(v);
      egg.t0 = Date.now();
      // the egg itself is the tap target once it's cooked
      S.tappable(egg.obj, () => lift(egg));
      z.progress({ into: v.key });
      refresh();
    };
    S.tappable(pot, () => (began(), putIn(vessels.pot)));
    S.tappable(pan, () => (began(), putIn(vessels.pan)));

    const lift = (egg) => {
      began();
      if (egg.out) return;
      // (an egg in the pot or the pan covers its middle: with a raw egg in the hand, a tap there puts it in)
      if (held && held.kind === "raw") return putIn(egg.v);
      if (egg.p < ready) {
        S.wiggle(egg.obj);
        return wrong();
      }
      hold14.end("eggs");
      if (held && held.kind === "cooked" && held.egg === egg) return hold(null);
      endFade(egg);
      hold({ kind: "cooked", egg });
      egg.lifted = true;
      if (!egg.fried) egg.boiled = boiledLook(egg);
      egg.base = egg.obj.scale;
      // (picked up it grows a little, within SH-256's 15%, contract-114: it rests in the hand at the size it then keeps on the plate)
      S.tweens.add({ targets: egg.obj, scale: egg.base * 1.1, duration: 160 });
      Cook.sfx.pop();
    };

    // one card per egg (CK-64; SH-239: each card ticks as its egg lands): the person's next open card of this kind
    const tickEgg = (pl, fried) => {
      UI.mission.tickItem(kindId(fried), 0, { for: pl.q.who, close: true });
      if (plateFull(pl) && !pl.ticked) {
        pl.ticked = true;
        Cook.sfx.right();
      }
    };
    // where the i-th of n eggs sits on a plate, and its size
    const eggOnPlate = (pl, i, n, fried) => {
      const d = plateD;
      if (fried) return n === 1 ? { x: pl.x, y: pl.y, w: d * FRIED.one } : { x: pl.x + (i ? 1 : -1) * d * 0.2, y: pl.y + (i ? 1 : -1) * d * 0.08, w: d * FRIED.two };
      return n === 1 ? { x: pl.x, y: pl.y, h: d * 0.52 } : { x: pl.x, y: pl.y + (i ? 1 : -1) * d * 0.19, h: d * 0.36 };
    };
    const onPlate = async (pl) => {
      began();
      if (!held) return;
      if (held.kind === "shaker") {
        const id = held.id;
        const flag = id === "spi-16" ? "salt" : "pepper";
        if (pl[flag]) return hold(null);
        pl[flag] = true;
        const asked = (id === "spi-16" ? pl.q.salt : pl.q.pepper) === "yes";
        const sh0 = shakers[id].c;
        busy++;
        // (S19, contract-109: the shaker on the band stays where it lies; a copy of it goes to the plate and back)
        S.tweens.killTweensOf(sh0);
        sh0.setScale(sh0.baseScale || sh0.scale);
        const sh = T(S.add.image(sh0.x, sh0.y, sh0.texture.key).setScale(sh0.scaleX, sh0.scaleY).setDepth(D.fx));
        sh0.setAlpha(0.35);
        await Cook.tween(S, { targets: sh, x: pl.x + plateD * 0.28, y: pl.y - plateD * 0.38, duration: 280 });
        await Cook.tween(S, { targets: sh, angle: 150, duration: 160 });
        const dots = S.add.graphics();
        pl.top.add(dots);
        dots.fillStyle(id === "spi-16" ? col("steel") : col("ink"), 0.9);
        for (let i = 0; i < 14; i++) dots.fillCircle((Math.random() - 0.5) * plateD * 0.42, (Math.random() - 0.5) * plateD * 0.42, 2.4);
        S.tweens.add({ targets: sh, angle: 110, duration: 90, yoyo: true, repeat: 2 });
        await Cook.wait(360);
        z.listen(asked, asked ? `${flag} on ${pl.q.who}` : `${flag} on ${pl.q.who}, not asked`);
        if (asked) {
          UI.mission.closeItem([id], 0, { for: pl.q.who });
          if (!guided && Lang.known(id)) Cook.markRight(id);
        } else wrong();
        await Cook.tween(S, { targets: sh, x: shakers[id].x, y: shakers[id].y, angle: 0, duration: 260 });
        sh.destroy();
        sh0.setAlpha(1);
        busy--;
        held = null;
        return refresh();
      }
      if (held.kind !== "cooked") return;
      const egg = held.egg;
      // an extra egg doesn't land (Zafar, 1 Nov): it hops and stays in the hand
      if (plateFull(pl)) {
        S.tweens.add({ targets: egg.obj, y: egg.obj.y - 30, duration: 140, yoyo: true });
        Cook.sfx.soft();
        return wrong();
      }
      held = null;
      egg.out = true;
      if (egg.ring) egg.ring.destroy();
      const i = pl.eggs.length;
      const n = plateWants(pl);
      const at = eggOnPlate(pl, i, n, egg.fried);
      S.tweens.killTweensOf(egg.obj);
      endFade(egg);
      // SH-256: a fried egg grows or shrinks to its plate size as it flies, so it lands at the size it keeps (no snap on the plate)
      const flyTo = egg.fried ? { duration: 380, arc: 110, scale: at.w / Math.max(1, egg.obj.width) } : { duration: 380, arc: 110 };
      await flying(S.fly(egg.obj, at.x, at.y, flyTo));
      // a fried egg lands as it was cooked (cooked, or overdone), the same picture staying on the plate (SH-256, contract-114: no swap);
      // a boiled one is halved on the plate
      let shown;
      if (egg.fried) {
        S.untap(egg.obj);
        shown = [egg.obj.setDepth(D.item + 0.4)];
        if (Math.hypot(egg.obj.x - at.x, egg.obj.y - at.y) > 2) await flying(Cook.tween(S, { targets: egg.obj, x: at.x, y: at.y, duration: 150 }));
        sized(egg.obj, at.w);
      } else {
        // (the whole egg fades as its halves fade in where it landed: no swap in one frame, contract-114)
        const whole = egg.obj;
        S.untap(whole);
        shown = halves(at.x, at.y, at.h, egg.boiled || "soft");
        shown.forEach((o) => {
          o.setAlpha(0);
          S.tweens.add({ targets: o, alpha: 1, duration: 220 });
        });
        S.tweens.add({ targets: whole, alpha: 0, duration: 220, onComplete: () => whole.destroy() });
      }
      if (egg.fried) shade(S, shown[0], { dx: 3, dy: 4, alpha: 0.2, blur: 3 });
      pl.eggs.push({ fried: egg.fried, look: shown });
      egg.v.eggs.splice(egg.v.eggs.indexOf(egg), 1);
      look(egg.v);
      const right = egg.fried === !!pl.q.fried;
      z.listen(right, right ? `egg on ${pl.q.who}` : `${egg.fried ? "fried" : "boiled"} egg on ${pl.q.who}`);
      if (right && !guided) kindIds(egg.fried).forEach((id) => Lang.known(id) && Cook.markRight(id));
      if (right) tickEgg(pl, egg.fried);
      else wrong();
      Cook.sfx.pop();
      refresh();
    };
    P0.forEach((pl) => S.tappable(pl.hit, () => onPlate(pl)));
    Object.values(shakers).forEach((s) => {
      S.tappable(s.c, () => {
        began();
        if (held && held.kind === "shaker" && held.id === s.id) return hold(null);
        hold({ kind: "shaker", id: s.id });
        Cook.sfx.pop();
      });
    });

    // the rings: each cooking egg's fill on the kit's heat ring (its sage green from `ready`); a fried egg sets as it fills
    z.tick(() => {
      let changed = false;
      cooking().forEach((e) => {
        if (!e.obj || !e.ring) return;
        const was = e.p >= ready;
        const span = cookMs / (Cook.speed || 1);
        const raw = Math.min(1, (Date.now() - e.t0) / span);
        e.p = hold14.cap(raw, ready, 1, "eggs");
        if (e.p < raw) e.t0 = Date.now() - e.p * span; // (held: its clock waits with it, so it goes on from the middle once lifted)
        if (e.p >= 1 && !e.full) e.full = Date.now();
        if (!was && e.p >= ready) {
          changed = true;
          steamPuff(e.at.x, e.at.y - 20, 2);
        }
        if (e.fried && !e.out) {
          toLook(e, tex("friedEgg", friedLook(e)));
          if (e.fade && e.fade.active) e.fade.setPosition(e.obj.x, e.obj.y);
        }
        if (!e.lifted) e.ring.draw(e.obj.x, e.obj.y, 40, e.p, ready, 1);
      });
      if (changed) refresh();
      // steam now and then over a pot that's boiling
      if (vessels.pot.eggs.length && Math.random() < 0.02) steamPuff(vessels.pot.c.x + (Math.random() - 0.5) * 80, vessels.pot.c.y - 40, 1);
    });

    S.tappable(tray, () => {
      began();
      const n = nextThing();
      if (n.what !== "tray" || finished) {
        S.wiggle(tray);
        return wrong();
      }
      finished = true;
      finishUp();
    });

    // (a test log: the scene's places, for the evidence probes and the contract's frames)
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("eggs-scene", { step: `pans:2 plates:${P0.length} eggs:${wanted}`, by: `k:${Math.round(LY.k * 100) / 100}` });
    } catch (e) {
      /* only a log */
    }
    stepFor(nextThing()); // (her box names the first step from the start, as before: R2)
    // the kitchen kit's reveal lessons (STD-D1-08): once the order has landed, the dotted word then the blurred picture
    if (Cook.Coach.lessons) await Cook.Coach.lessons({ gate, ctx, busy: () => busy > 0 });
    refresh();
    await doneP;
    steps.done();
    if (ctl) ctl.close();
    if (stuck) stuck.close();
    if (nextV) nextV.stop();
    glowOn(null);
    z.expect(null);
    vessels.pot.b.set("off", true);
    vessels.pan.b.set("off", true);

    /* ---------------- the table: the meal in its kitchen ---------------- */
    await serve(S, ctx, z, { plates: P0, meal: K.meal || "breakfast", objs });
    if (!guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[KEY] = true;
    }
    z.close();
    // SH-160: a finished round counts towards eggs' level-up (the central rules); a grown-up's pick never moves the count
    if (Cook.roundDone && !guided) {
      const dsh = ctx.order && ctx.order.dishes ? ctx.order.dishes[ctx.dishAt || 0] : null;
      Cook.roundDone(KEY, { level: Cook.roundLevel(ctx), hints, grownUp: !!ctx.lab || !(dsh && dsh.autoLevel) });
    }
    return { served: P0.length };
  }

  /*
   * SH-228 (contract-22): where the kit's stuck help (Cook.Coach.stuck) runs a step's hesitation help, the step's own ladder in Nani's
   * stepper stays quiet, so her line is never said twice (the helper card's call, then the stepper's again: "Hane makai!" twice 1.4 s
   * apart at 1920x1080). St.steps.to passes no helpAfter to UI.step (a kit change in the report), so the opened step is marked as
   * helped with no clock: never due.
   */
  const kitHelps = (st) => {
    if (st && typeof st === "object" && "helped" in st) {
      st.helped = true;
      st.helpedAt = Infinity;
    }
    return st;
  };
  /** The table: the meal's kitchen (its window's sky by the meal); each plate slides to its person, who swaps to happy and bounces. */
  async function serve(S, ctx, z, { plates, meal, objs }) {
    await Cook.tween(S, { targets: objs.filter((o) => o && o.active), alpha: 0, duration: 300 });
    objs.forEach((o) => o && o.active && o.destroy());
    const T = (o) => S.track(o);
    const tb = SCENE().table || {};
    const sized = (o, k, f = 1) => {
      const d = ITEM(k).drawn || {};
      if (d.w) o.setScale((d.w * f) / Math.max(1, o.width));
      else if (d.h) o.setScale((d.h * f) / Math.max(1, o.height));
      return o;
    };
    // the meal's kitchen, covering the stage in proportion, its island's back edge where the people stand (scene.bgIsland)
    if (S.textures.exists(`eg-bg-${meal}`)) {
      // CK-75 (the eye judge, 10 Nov: a strip of marble above the kitchen at 740x320 and 1280x665; chai's praise fills the play area):
      // the picture covers the whole view the stage shows (Cook.view, wider or taller than the design box), its island's line kept
      // where the people stand: as large as the view's width asks, and as the room above and below the island line asks
      const V = Cook.view || {};
      const vl = V.left != null ? V.left : 0;
      const vr = V.right != null ? V.right : 1600;
      const vt = V.top != null ? V.top : 0;
      const vb = V.bottom != null ? V.bottom : 900;
      const bg = T(S.add.image((vl + vr) / 2, 0, `eg-bg-${meal}`).setOrigin(0.5, 0).setDepth(D.bg + 2));
      const isl = (SCENE().bgIsland || {}).wanted || 705;
      const f = isl / 900; // (the island line's share of the picture's height)
      const W0 = Math.max(1, bg.width);
      const H0 = Math.max(1, bg.height);
      const k = Math.max(1600 / W0, 900 / H0, (vr - vl + 4) / W0, (isl - vt + 2) / (f * H0), (vb - isl + 2) / ((1 - f) * H0));
      bg.setScale(k);
      bg.y = isl - f * H0 * k;
    }
    const cat = tb.cat || { x: 120, y: 706, h: 190 };
    const catImg = T(S.add.image(cat.x, cat.y, tex("cat")).setOrigin(0.5, 1).setDepth(D.bg + 3));
    catImg.setScale(cat.h / Math.max(1, catImg.height));
    S.tweens.add({ targets: catImg, scaleY: catImg.scaleY * 1.03, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    // the people at their places, behind the island
    const n = plates.length;
    const seats = (tb.seats || {})[String(n)] || plates.map((q, i) => 400 + (i * 800) / Math.max(1, n - 1));
    const people = plates.map((pl, i) => {
      const who = pl.q.who;
      const full = S.textures.exists(`${who}-neutral`);
      const img = T(S.add.image(seats[i], tb.standY || 708, full ? `${who}-neutral` : Cook.Kit.badge(S, who)).setOrigin(0.5, 1).setDepth(D.item - 2));
      img.setScale((full ? tb.personH || 470 : 220) / img.height);
      return { pl, img, who };
    });
    await Cook.wait(400);
    // each plate slides in to its person; they swap to happy and bounce; steam rises
    let allRight = true;
    for (const { pl, img, who } of people) {
      const x = img.x;
      const plate = T(S.add.container(x, tb.plateFrom || 1050).setDepth(D.item + 1));
      // the table's plate (10 Nov's art, ART-72's run): its camera a little higher than the table's (its ellipse about 0.40 of its width
      // against the trays' 0.2), so it is squashed to the table here (scene.table.squash), and each egg on it at the same squash
      const sq = tb.squash || 0.6;
      const squash = (o) => o.setScale(o.scaleX, o.scaleY * sq);
      const pImg = squash(sized(S.add.image(0, 0, tex("plateTable")), "plateTable"));
      plate.add(pImg);
      const ew = (ITEM("friedTable").drawn || {}).w || 150;
      pl.eggs.forEach((e, j) => {
        const dx = (j - (pl.eggs.length - 1) / 2) * ew * 0.62;
        const k = pl.eggs.length > 1 ? 0.75 : 1;
        const key = e.fried ? "friedTable" : "boiledTable";
        plate.add(squash(sized(S.add.image(dx, -pImg.displayHeight * 0.06, tex(key)), key, k)));
      });
      if (pl.salt || pl.pepper) {
        const dg = S.add.graphics();
        if (pl.salt) dg.fillStyle(col("white"), 0.95);
        for (let i = 0; i < 10 && pl.salt; i++) dg.fillCircle((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 24, 2.2);
        if (pl.pepper) dg.fillStyle(col("ink"), 0.9);
        for (let i = 0; i < 10 && pl.pepper; i++) dg.fillCircle((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 24, 2.2);
        plate.add(dg);
      }
      const py = tb.plateY || 752;
      await Cook.tween(S, { targets: plate, y: py, duration: 520, ease: "Cubic.easeOut" });
      Cook.sfx.pop();
      const kindsRight = pl.eggs.length === (pl.q.n || 1) && pl.eggs.every((e) => e.fried === !!pl.q.fried);
      const seasonRight = (pl.q.salt === "yes") === !!pl.salt && (pl.q.pepper === "yes") === !!pl.pepper;
      const ok = kindsRight && seasonRight;
      if (!ok) allRight = false;
      for (let i = 0; i < 3; i++) {
        const s = T(S.add.circle(x + (i - 1) * 30, py - 20, 12, col("white"), 0.6).setDepth(D.item + 2));
        S.tweens.add({ targets: s, y: py - 140, alpha: 0, scale: 2.4, duration: 1500, delay: i * 220, repeat: 1, onComplete: () => s.destroy() });
      }
      // the pose swap: happy when it's right, else they stay neutral (decision 8, 7 Nov: chai's progress display, never a frown)
      const mood = ok ? "happy" : "neutral";
      if (S.textures.exists(`${who}-${mood}`)) img.setTexture(`${who}-${mood}`);
      if (ok) {
        Cook.sfx.right();
        await Cook.tween(S, { targets: img, y: img.y - 26, duration: 170, yoyo: true, repeat: 1, ease: "Sine.easeOut" });
      } else Cook.sfx.soft();
      await Cook.wait(250);
    }
    UI.mission.closeItem([], 0, { all: true });
    if (St.helperWatch) St.helperWatch(ctx, null);
    if (UI.helper) UI.helper(null);
    // (SH-252: her box reads the engine's Shabash as it is said, until the end screen)
    if (allRight && Cook.praiseBox) Cook.praiseBox();
    if (allRight) await Promise.race([UI.voice(Lang.line("welldone")).catch(() => {}), Cook.wait(2400)]);
    await Cook.wait(900);
  }

  Mech.lab(KEY, {
    name: "Eggs (prototype)",
    verb: "Boil or fry, then the plates",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.eggs.make("nana", { level: L.level });
      L.ctx.steps = R.eggs.steps(d);
      L.card(d, L.ctx.steps);
      await L.station(KEY, { plates: d.plates });
    },
  });
})(window);
