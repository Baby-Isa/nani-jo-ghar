/*
 * The corn stall (Zafar's rapid prototype, 1 Nov; on the farm, day 2). Sprint 18 (s18-g-corn): the game is its settings file
 * (data/stations/corn.json, read as Cook.data.settings.corn) and its own mechanic, below; everything else is a kit call.
 *
 * Sprint 19, wave B (CK-67; Zafar, 9 Nov: "make it the same as Sekelo ... the same two tray setup ... Cooked and uncooked, same barbecue,
 * same grill"; his yes to two screens: "first grill them all and then flavour them on the next screen ... then you can flavour different
 * corns differently"): two screens on the one grill kit (js/cook/grill-kit.js, which sekelo, fish and steak use next; corn's own parts
 * stay here).
 *   Screen 1, the grill (sekelo's option 3 exactly): the raw cobs lie two by two on the stone band; the grill big on the left, the cooked
 *     tray on its right. Tap a cob: it grows as it goes up onto the grill, turns upright and rests on its rims. Its heat ring fills;
 *     on the green tap it to turn it (cob-turned); on the green again tap it: it shrinks into the tray (cob-done). As many as asked (one
 *     a person); an extra stays on the band (a wiggle).
 *   Screen 2, the flavour: each cob on its person's cream plate with their face circle; the six dressing bowls on the band with their
 *     word pills. One person at a time, left to right: tap what they asked for and it goes on their cob (drawn on it in code), named as
 *     it goes on, their row ticks; a "no" or an unasked one goes on quietly and is judged when they get it; a second tap takes it back
 *     (non-negotiable 7) until they have it. Tap their plate: it's theirs (their face, right or a gentle no; a wrong one is redone on
 *     the spot, decision 51); then the next person.
 * Its own mechanic as he made it (non-negotiable 1): grill, turn once, take off, what goes on, give it to them.
 * The kits: the order and its card (Cook.Recipes, the lab's card), the steps in Nani's box (St.steps), the lights (Cook.Coach.firsts,
 * .control, .stuck, .wrong, .lessons, .began), the heat ring (Cook.Kit.heatRing), the word pills (Shelf.P.chip, chai's; the shared shelf's
 * slots and pill rule), the band (the kitchen kit's stone band), the serve (NjgServe.round, .review). Hannah Mami hosts the farm: Nani's
 * box stands in until her approved sheet exists.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout } from "../life.js";
import { NjgServe } from "../../shared/serve.js"; // the shared kit's serving (Sprint 18 piece 8)
import "../grill-kit.js"; // the one grill kit (S19 wave B): Cook.GrillKit

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const KEY = "corn";
  const FAR = 2000;
  /** The game's settings (data/stations/corn.json, loaded with the data: Mech.stationData). */
  const SET = () => ((Cook.data && Cook.data.settings) || {})[KEY] || {};
  /** The shared shelf's band lines (its top, the shelf line, the pill line: js/shared/shelf.js Shelf.BAND, the kit's St.SHELF). */
  const BAND = () => St.SHELF;

  Mech.combined(KEY, {
    station: KEY,
    view: "marble",
    dataFile: "data/stations/corn.json",
    selfBegin: true, // (CK-48: its pictures load behind the order, then the view begins: never a bare worktop)
    zones: [],
    async run(host, p) {
      return corn(host, p);
    },
  });

  /** S19 wave B: the settings' order is the recipe (one plate per person, each their own mix), registered once its data is in. */
  function register() {
    const o = SET().order;
    const R = Cook.Recipes;
    if (!o || !R || !R.add || register.done) return;
    register.done = true;
    R.add(KEY, JSON.parse(JSON.stringify(o)));
  }

  /**
   * A thing's word pill on the band: the shared kit's pill as chai's shelf has it (Shelf.P.chip: its own face's width, the row's rule
   * fits it, SH-219; its card's size kept, so the light and its checks take the pill as part of the thing).
   */
  function pill(S, id, x, y, ctx) {
    const chip = global.Shelf.P.chip(S, x, y, Cook.display(id), {
      word: Cook.chipWord ? Cook.chipWord(id, ctx) : true,
      depth: D.item + 2,
      shade: (Cook.Kit && Cook.Kit.INK && Cook.Kit.INK.shade) || undefined,
      onTap: () => {
        Cook.unlockAudio();
        if (Cook.onLabel) Cook.onLabel(id);
        Lang.speakWord(id);
      },
    });
    chip.pillId = id;
    return chip;
  }

  /**
   * Zafar, 11 Nov (corn's grill screen "looks really bad"; the A2 mock's two-tray set-up): the grill and the cooked tray beside it are
   * ONE tidy rectangle, the tray (the kit's deep tray, never an oval) exactly the grill's height. The rectangle is as big as the worktop
   * that shows allows, with padding, and centred in it as chai's play group is (CHAI-89: between the view's top and the shelf, the heat
   * rings' room above it kept; across, on the view's middle).
   * CK-117 (Zafar, 15 Nov, decision 37, his yes to the mock-ups: "shorter and fatter and chopped at the ends ... rotate them to stand
   * vertically and have 4 in a row ... then they don't have to change orientation when they go onto the barbecue or when they go onto
   * the tray or the plate"): the cob is the chopped cob, standing upright everywhere (one rotation the whole way). Its sizes come from
   * the room each place gives, never a per-size number: on the band four stand in a row, as tall as the band allows (R, the frame's
   * bottom row); on the grill it stands on the coal bed a little bigger, as big as its place across the bed and the rims allow, and
   * never more than BAND_K over its band size, so it grows with no snap (SH-256, contract-114: within 15% from rest to rest); in the
   * cooked tray it grows by as much again where the well allows (so on its plate it can fill the plate, Zafar's mock-up), standing side
   * by side (two by two when there are more than two, never one over another). thick: the cob's width over its length. P: the kitchen frame's play area (Cook.Frame.area). -> L (grill, tray,
   * band, ring), each place's cob length its own: L.band.len, L.grill.cob, L.tray.len.
   */
  const BAND_K = 1.13; // (a cob at most this much over its size at its last place: contract-114's 15%, with room to spare)
  const BAND_FILL = 0.84; // (a standing cob's length, of the stone tray's inner height: the rest its margin above and below)
  function rectLayout({ thick, count, P, R, ringRoom = 92, gap = 36, deep = false }) {
    const G = Cook.GrillKit.ART.grill;
    const TI = Cook.GrillKit.ART.tray.inner; // (its well's inset, of its own width and height: turned upright they swap)
    // (ART-80: the deep tray stands as it is drawn, its rims cut to any shape at its width's scale (GK.deepTex): its well inside them)
    const DP = Cook.GrillKit.DEEP;
    // (the rectangle and the band's cobs fitted ROW_IN inside the play area's sides, as chai's hob row; its height the play area's)
    const ROW_IN = 8;
    const vl = P.x + ROW_IN;
    const vr = P.x + P.w - ROW_IN;
    const spanTop = P.y;
    const spanBot = P.y + P.h;
    const across = (len) => thick * len; // a cob's width
    // the band: four standing in a row, as tall as the band allows (its height less a margin above and below), evenly spaced across
    // it (each in the middle of its quarter), never wider than a quarter
    const blen = Math.min(R.h * BAND_FILL, (R.w * 0.9) / 4 / (thick * 1.6));
    const bstep = R.w / 4;
    const bmid = R.x + R.w / 2;
    const by = R.y + R.h / 2;
    // the tray: side by side, in rows of two when there are more than two
    const cols = Math.max(1, Math.min(2, Math.max(2, count)));
    const rows = count > 2 ? 2 : 1;
    // (for a grill gh tall: the cob's length on the grill and in the tray, the tray's width, the grill's)
    const sizes = (gh) => {
      const gw = (gh * G.w) / G.h;
      const rims = (G.near - G.far) * gh;
      const place = ((G.bed[1] - G.bed[0]) * gw) / 4; // (each of the bed's four places, across)
      const glen = Math.min(rims * 0.9, blen * BAND_K, (place * 0.8) / thick);
      if (deep) {
        // (the tray's width sets its rims: its well inside them, a few per cent clear)
        const well = (tw) => gh - 2 * 2 * DP.far * tw;
        let tlen = glen * BAND_K;
        let tw = 0;
        for (let i = 0; i < 6; i++) {
          const cw0 = across(tlen);
          tw = (cols * cw0 + (cols + 1) * cw0 * 0.25) / (1 - 2 * DP.inX);
          tlen = Math.min(glen * BAND_K, (well(tw) / rows) * 0.94);
        }
        return { glen, tlen, cw: across(tlen), tw, gw };
      }
      const tlen = Math.min(glen * BAND_K, ((gh * (1 - 2 * TI[0])) / rows) * 0.94);
      const cw = across(tlen);
      const tw = (cols * cw + (cols + 1) * cw * 0.25) / (1 - 2 * TI[1]);
      return { glen, tlen, cw, tw, gw };
    };
    // as big as the height and the width allow
    let gh = spanBot - spanTop - ringRoom;
    for (let i = 0; i < 40; i++) {
      const z = sizes(gh);
      if (z.gw + gap + z.tw <= vr - vl) break;
      gh *= 0.98;
    }
    const z = sizes(gh);
    const total = z.gw + gap + z.tw;
    const left = (vl + vr) / 2 - total / 2;
    const gy = spanTop + (spanBot - spanTop - (gh + ringRoom)) / 2 + ringRoom + gh / 2;
    const gx = left + z.gw / 2;
    const far = gy - gh / 2 + G.far * gh;
    const near = gy - gh / 2 + G.near * gh;
    const bed0 = gx - z.gw / 2 + G.bed[0] * z.gw;
    const bed1 = gx - z.gw / 2 + G.bed[1] * z.gw;
    const grill = {
      x: gx,
      y: gy,
      w: z.gw,
      h: gh,
      far,
      near,
      len: near - far,
      cob: z.glen, // (a cob standing on the bed, its length)
      at: (i, m = 4) => ({ x: bed0 + ((bed1 - bed0) / Math.max(1, m)) * (i + 0.5), y: (far + near) / 2 }),
    };
    const tx = left + z.gw + gap + z.tw / 2;
    const step = z.cw * 1.25;
    const vstep = z.tlen * 1.06;
    const tray = {
      x: tx,
      y: gy,
      w: z.tw,
      h: gh,
      len: z.tlen,
      up: true,
      deep,
      // (standing side by side, centred in the well; two by two when there are more than two, a row's middle a cob's length apart)
      at: (i) => {
        const inRow = rows > 1 ? Math.min(cols, count - Math.floor(i / cols) * cols) : count;
        const c = i % cols;
        const r = Math.floor(i / cols);
        return { x: tx + (c - (inRow - 1) / 2) * step, y: gy + (rows > 1 ? (r - 0.5) * vstep : 0) };
      },
    };
    return {
      grill,
      tray,
      band: { len: blen, at: (i) => ({ x: bmid + (i - 1.5) * bstep, y: by }) },
      // (the kit's heat ring just above a standing cob's top end)
      ring: (p) => ({ x: p.x, y: p.y - z.glen / 2 - 34 - 10, r: 34 }),
    };
  }
  /** The grill and its tray, the tray turned upright to the grill's height, each with the kit's soft shadow. */
  function buildRect(S, L) {
    const GK = Cook.GrillKit;
    const out = {};
    const depth = D.item - 1;
    if (S.textures.exists(GK.ART.grill.key)) {
      const g = S.track(S.add.image(L.grill.x, L.grill.y, GK.ART.grill.key).setDepth(depth));
      g.setScale(L.grill.h / g.height);
      GK.shadow(S, g, { dx: 12, dy: 16, alpha: 0.3, blur: 12 });
      out.grill = g;
    }
    const dk = L.tray.deep && GK.deepTex ? GK.deepTex(S, L.tray.w / L.tray.h) : null;
    if (dk) {
      // (ART-80: the mock's deep tray at this shape, standing as drawn: its lit rim stays on the light's side)
      const t = S.track(S.add.image(L.tray.x, L.tray.y, dk).setDepth(depth));
      t.setDisplaySize(L.tray.w, L.tray.h);
      GK.shadow(S, t, { dx: 8, dy: 11, alpha: 0.26, blur: 8 });
      out.tray = t;
    } else if (S.textures.exists(GK.ART.tray.key)) {
      // (turned a quarter: its long side up the grill's height; its own width across)
      const t = S.track(S.add.image(L.tray.x, L.tray.y, GK.ART.tray.key).setDepth(depth).setAngle(90));
      t.setDisplaySize(L.tray.h, L.tray.w);
      GK.shadow(S, t, { dx: 8, dy: 11, alpha: 0.26, blur: 8 });
      out.tray = t;
    }
    return out;
  }

  async function corn(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const level = host.level;
    const set = SET();
    const sc = set.scene || {};
    const it = set.items || {};
    const lay = sc.layout || {};
    const mo = set.motion || {};
    const pal = (set.station || {}).palette || {};
    const col = (k) => (pal[k] ? parseInt(String(pal[k]).slice(1), 16) : global.Tokens && global.Tokens.int ? global.Tokens.int("grey") : 0);
    const sp = () => Cook.speed || 1;
    const GK = Cook.GrillKit;
    const B = BAND();
    const COB = (set.recipe || {}).dish || "n.corn-on-the-cob";
    const DRESS = (it.dressings || {}).files || {};
    const ids = ((set.recipe || {}).dress || Object.keys(DRESS)).filter((id) => DRESS[id]);
    // the people and what each asked for (the order's plates); an old caller's one person (count, dress, no) still works
    const people = (p.plates && p.plates.length ? p.plates : [{ who: p.who || (set.recipe || {}).who || "cousin", dress: p.dress || [], no: p.no || [] }]).map((q) => ({
      who: q.who,
      asked: [].concat(q.dress || []).filter((id) => DRESS[id]),
      nos: [].concat(q.no || []),
      dressed: [],
      drops: {},
      served: false,
      cob: null,
    }));
    const count = people.length;
    const sideMs = K.sideMs || 2600;
    // S19 (CK-65; Zafar, 8 Nov: "the green zone is way too short"): the green lasts greenMs (the settings, by level: at least chai's
    // green at the same level), the cob ready to turn or lift from its start; its heat ring runs over the side and the green together
    const greenMs = K.greenMs || 4500;
    const greenLo = sideMs / (sideMs + greenMs);
    // SH-158, the S14 roll-out (contract-77; the central rules' timed.firstTimeHold, as maani's flip): a new player's first cob holds in
    // the middle of its green until it is turned (js/cook/station-lib.js St.firstHold)
    const hold14 = St.firstHold(ctx, "corn:turn");
    const guided = !!ctx.guided;
    const dish = ctx.dishAt || 0;
    const states = (it.cob || {}).states || {};
    // (CK-80: the cob's four stages, K4's art: raw, turned once, done, and over if it is left on the grill past its green: a look,
    // never a verdict, as eggs' overdone)
    const tex = { raw: "cn4-raw", turned: "cn4-turned", done: "cn4-done", over: "cn4-over" };
    const thick = (it.cob || {}).thick || 0.18;
    // (ART-80: the cooked tray, the mock's deep one or the flat steel one: the settings' scene.layout.grill.tray)
    const deepTray = ((lay.grill || {}).tray || "steel") === "deep";
    // (the art the settings name, loaded behind the order; settings.assets lists the same files)
    await St.loadArt(
      S,
      ids
        .map((id) => [`cn4-${id}`, DRESS[id]])
        .concat(Object.keys(tex).filter((k) => states[k]).map((k) => [tex[k], states[k]]))
        .concat([["cn4-plate", (sc.plate || {}).file]])
        .concat(GK.art(["grill", deepTray ? "deep" : "tray"]))
        .filter((a) => a[1])
        .concat(...[...new Set(people.map((q) => q.who))].map((w) => Cook.Kit.faceArt(w)))
    ).catch(() => {});
    await St.begin(S, ctx, KEY, "marble");
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const T = (o) => S.track(o);
    /* ---------------- the frame: the play area, the stone tray, the worktop ---------------- */
    // (Sprint 20 batch 1: the kitchen frame's, js/cook/frame.js; corn lays its room out in the play area it returns, a screen at a time:
    // screen 2 asks the frame again with F.next, docs/architecture/kitchen-frame.md) the marble's wash above the band, the stone band
    // along the bottom in the band corn's settings name (the tray: every thing on it is top-down, ART-69, SH-243, SH-248)
    let F = Cook.Frame.area(S, { top: B.top, base: B.base, far: FAR, draw: true });
    let band = F.stoneBand(S, { game: KEY });
    // the stone tray's drawn inner edge (its slab, Shelf.trayBox, less its lip and bevel), design px; the frame's bottom row where no
    // slab is drawn. What stands on the band stands inside it (CK-104, CK-117: measured from the tray, never the screen)
    const slab = (b, R) => {
      const t = b && b.trayBox;
      if (!t) return { x: R.x, y: R.y, w: R.w, h: R.h };
      const sx = Math.max(t.lip, t.r * 0.4);
      const top = Math.max(t.lip, t.h * 0.035);
      const foot = Math.max(t.lip, t.h * 0.045);
      return { x: t.x + sx, y: t.y + top, w: t.w - 2 * sx, h: t.h - top - foot };
    };

    /* ---------------- screen 1: the grill (the grill kit's option 3) ---------------- */
    const gl = lay.grill || {};
    const deep = deepTray && S.textures.exists(GK.ART.deep.key);
    const P1 = F.play;
    const L = rectLayout({ thick, count, P: P1, R: slab(band, F.bottom), ringRoom: gl.ringRoom, gap: gl.gap, deep });
    const kit = buildRect(S, L);
    // (a test log: which screen is up, for the evidence probes' moments, "life:corn-screen")
    const screenNote = (step) => {
      try {
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("corn-screen", { step, by: `people:${count}` });
      } catch (e) {
        /* only a log */
      }
    };
    screenNote("grill");
    // CK-80 (the eye judge, 10 Nov: "nothing shows whose cob this is until the plate scene"; chai has Nana's circle on the hob and the
    // glass from the first frame): whose cobs these are, from the first frame, as chai's glasses: each person's face circle at the
    // cooked tray's upper left, over its rim's edge only, in a row along its top; they go as the cobs go to their own plates
    const trayFaces = [...new Set(people.map((q) => q.who))].map((w, i) => {
      // (CK-80: the kit's badge size, as daar's katori and chai's hob: at least 30 CSS px as seen, at most 90 design px; it was a
      // speck at 740x320 and 1280x665)
      const perPx = Math.max(0.01, F.px); // (the screen's scale, the frame's)
      const fs = Math.min(90, Math.max(64, 30 / perPx));
      // (on the tray's top-left rim, its middle just above the rim, so a cob lying across the tray stays clear of it: contract-113)
      const img = T(S.add.image(L.tray.x - L.tray.w / 2 + fs * 0.3 + i * (fs + 8), L.tray.y - L.tray.h / 2 - fs * 0.2, Cook.Kit.badge(S, w)).setDisplaySize(fs, fs).setDepth(D.item + 2));
      img.setName("corn-tray-face");
      return img;
    });
    const places = Math.min(4, K.slots || 3);
    // (s19-games-2, contract-114: a raw cob on the band is within 15% of its length on the grill, where it goes next: rectLayout)
    const bandLen = L.band.len;
    const raw = [0, 1, 2, 3].map((i) => {
      const at = L.band.at(i);
      const img = T(S.add.image(at.x, at.y, tex.raw).setDepth(D.item));
      GK.lay(img, { x: at.x, y: at.y, len: bandLen, up: true }); // (CK-117: standing, as it stands everywhere)
      // (no word of its own on the band: a cob is the dish, not a word, so it has no pill, opt3s; the shelf line's rule, contract-109,
      // is for the band's words standing in a row with their pills, which the six bowls of screen 2 are)
      GK.shadow(S, img, { dx: 6, dy: 8, alpha: 0.26, blur: 5 });
      return img;
    });
    const sm = lay.smoke || {};
    const smoke = (x, y) => {
      const r = sm.r || [10, 8];
      const s = T(S.add.circle(x + (Math.random() - 0.5) * 30, y, r[0] + Math.random() * r[1], col("smoke"), 0.45).setDepth(D.fx + 2));
      s.fx = true; // (an effect: the lights never wait for it, stillStage)
      S.tweens.add({ targets: s, y: y - (sm.rise || 120), alpha: 0, scale: sm.grow || 2.2, duration: mo.smokeMs || 1300, onComplete: () => s.destroy() });
    };
    // SH-256 (the eye judge, 10 Nov: the cob landed on the tray at a third of its grill size, lost in the tray, then grew on the plate):
    // with one or two cobs the tray holds them lengthwise across its whole width, one above the other, as near their grill length as
    // the tray allows; three or four keep the kit's two by two. The plate then keeps that length (cobLen below)
    // (Zafar, 11 Nov: on the tray beside the grill a cob rests upright as it lay on the grill, the same size: L.tray.len, L.tray.at)
    const trayLen = L.tray.len;
    // (CK-117: a cob standing on a plate dd across, as long as the plate holds it: its corners within plates.cob of the plate's width)
    const plateCob = (dd) => (dd * (pl.cob || 0.9)) / Math.sqrt(1 + thick * thick);
    /*
     * CK-118: how far in over a plate's upper corner the well-done face may come, as the box (a share of the plate) the kit's spot is
     * measured on (Cook.Kit.praiseSpot: its circle at that box's upper corner): the smallest box whose face stays FACE_CLEAR of a cob
     * standing on the plate, its length share of the plate, and covers at most FACE_PLATE of the round plate (contract-113 lets a face
     * over a dish cover 15% of it), on a plate of 1. 1 (the plate's own square, as before) where nothing smaller will do.
     */
    const FACE_CLEAR = 0.025;
    const FACE_PLATE = 0.1;
    const faceIn = (share) => {
      const rs = (lay.review || {}).size || 0.55;
      const r = rs / 2;
      const cl = share / 2;
      const cw = (share * thick) / 2;
      // (the share of the plate's disc, radius 0.5, that the face's circle covers: a grid over the face)
      const covers = (fx, fy) => {
        let both = 0;
        const N = 40;
        for (let i = 0; i < N; i++)
          for (let j = 0; j < N; j++) {
            const x = fx - r + ((i + 0.5) * 2 * r) / N;
            const y = fy - r + ((j + 0.5) * 2 * r) / N;
            if ((x - fx) ** 2 + (y - fy) ** 2 <= r * r && x * x + y * y <= 0.25) both++;
          }
        return (both * ((2 * r) / N) ** 2) / (Math.PI * 0.25);
      };
      const ok = (k) => {
        const p = Cook.Kit.praiseSpot ? Cook.Kit.praiseSpot({ x: 0, y: 0, w: k, h: k }, rs) : null;
        if (!p) return false;
        // (clear of the cob's box, its middle on the plate's)
        const dx = Math.max(0, Math.abs(p.x) - cw);
        const dy = Math.max(0, Math.abs(p.y) - cl);
        return Math.hypot(dx, dy) >= r + FACE_CLEAR && covers(p.x, p.y) <= FACE_PLATE;
      };
      for (let k = 0.3; k < 1; k += 0.02) if (ok(k)) return k;
      return 1;
    };
    const trayAt = (k) => L.tray.at(k);
    const cobs = []; // on the grill
    const inTray = []; // done, lying in the tray
    let made = 0;
    let lifting = 0; // (cobs on their way to the tray: they count as made)
    let moving = 0; // (the game's own moves in flight: they hold the stuck hint, Cook.Coach.control's busy)
    let screen = 1;
    let active = 0; // (screen 2: whose cob the dressings go on, left to right)
    let serveNow = null;
    let dropping = 0; // (dressings flying to the cob: the next step waits for them to land, contract-117)
    const fly = async (fn) => {
      moving++;
      try {
        return await fn();
      } finally {
        moving--;
      }
    };
    const onBand = () => raw.filter((o) => o.active && o.onBand !== false);

    /* ---------------- the steps, their calls and their lights (the kits) ---------------- */
    // the first-time gate for this round (kit (d), STD-D1-01); Nani's steps (St.steps: a step's call is said once it opens, so nothing
    // is said after a skip before the first step, contract-95); each step's light the first time with its call, after that only after
    // the level's wait from the last action (Cook.Coach.control: contract-24, STD-D2-01), at once after a wrong move (Cook.Coach.wrong)
    const gate = Cook.Coach.firsts(KEY, { round: new Set() });
    const steps = St.steps(ctx);
    const hintMs = () => (global.Rules && global.Rules.hintMs ? global.Rules.hintMs(Cook.roundLevel(ctx)) : 7000);
    let ctl = null;
    let stuck = null;
    let ctlId = null;
    let lit = null;
    let hints = 0;
    const glow = (o) => {
      if (lit && lit !== o && lit.active) S.glow(lit, false);
      lit = o;
      if (o) S.glow(o, true, { bounce: true, now: true }); // (now: with its light, never the ladder's deferred glow)
    };
    const bowls = {};
    const plates = [];
    /** The next thing to do, published once: the light, the step, the helper card and the test hooks read it (STD-F3-05). */
    function nextThing() {
      if (screen === 1) {
        const ready = cobs.find((c) => c.state === "turn" || c.state === "lift");
        // (the turn and the lift are the timed window's controls, as maani's flip and samosa's lift: their calls are said as the green opens,
        // never held for Nani's helper card as an item's are, SH-172; contract-70)
        if (ready && ready.state === "turn") return { step: "turn", id: ready.n, o: ready.img, key: "turn", line: Lang.line("guide-firai"), again: true };
        if (ready) return { step: "lift", id: ready.n, o: ready.img, key: "lift", line: Lang.line("lift", Lang.phrase([COB])), again: true };
        const next = onBand()[0];
        if (next && cobs.length + lifting + inTray.length < count && cobs.length < places) return { step: "grill", o: next, key: COB, line: Lang.line("now", Lang.phrase([COB])) };
        return { step: "wait" };
      }
      if (screen !== 2) return { step: screen === 3 ? null : "wait" };
      const q = people[active];
      if (!q || q.served) return { step: null };
      // (CK-90, contract-117 at the S19 gate: the serve's light opened while the pepper still flew, a tap on the lit cob was
      // swallowed mid-flight and the light was lost; the next step waits, unlit, until what is flying lands)
      if (dropping) return { step: "wait" };
      const left = q.asked.find((id) => !q.dressed.includes(id));
      // (an item's step: said only as her helper card opens to show it, never as the step opens: SH-172, STD-D3-03)
      if (left && bowls[left]) return { step: "dress", id: `${active}:${left}`, o: bowls[left], key: left, word: left, line: St.addLine(left), noCall: "helper" };
      // (contract-36: the serve is a step with its call, as eggs' plate: the engine's "serve" command; no Kutchi recorded yet, so the kit logs
      // it skip-novoice and shows its English in grey, a gap on the recording sheet)
      return { step: "serve", id: active, o: plates[active], key: COB, line: Lang.say({ fn: "Command", verb: "v.serve" }) };
    }
    function lead(n) {
      const id = n.o ? `${n.step}:${n.id != null ? n.id : ""}` : n.step;
      if (id === ctlId) return;
      ctlId = id;
      if (ctl) ctl.close();
      ctl = null;
      if (stuck) stuck.close();
      stuck = null;
      glow(null);
      if (!n.o) {
        // (nothing to tap while the cobs grill: the step closes, no light, no hint)
        z.expect(n.step === "wait" ? { kind: "wait" } : null);
        steps.done();
        return;
      }
      const c = S.centre(n.o);
      // (the test hooks: an unasked dressing for the mistake player, STD-F5-02)
      const q = people[active];
      const wrongs = n.word && q ? ids.filter((x) => !q.asked.includes(x) && !q.dressed.includes(x) && bowls[x]).map((x) => S.centre(bowls[x])) : null;
      z.expect(Object.assign({ kind: "tap", x: c.x, y: c.y, key: n.key }, wrongs && wrongs.length ? { wrongs } : {}));
      // STD-D2-05 (non-negotiable 4): an asked-for dressing past support gets no light (the light would be the answer); never lit the
      // first time either (CHAI-32: never the first ordered item)
      const OB = global.Onboard;
      const hides = !!(n.word && OB && OB.hintHides && OB.hintHides({ answer: true, stage: Cook.wordStage ? Cook.wordStage(n.word) : null, study: guided }));
      const first = n.word ? false : gate.first(n.step);
      // S19 (CK-61, SH-230): the light round the thing whole, with its pill, its face circle and its hop's room (the kit's parts, part
      // by part, so the light's one rule leaves its room round their union: contract-92)
      const target = [0, 1, 2, 3, 4, 5].map((i) => () => (n.o.active && n.o.visible ? Cook.Coach.parts(n.o)[i] || null : null));
      const current = () => ctlId === id && screen < 3;
      // (its glow lasts as long as its light, which goes as the child starts the move: contract-102, SH-236)
      const lightGlow = () => {
        // (only a thing on the band glows and hops with its light; anything else is lit alone, so Nani's call reading its row is the
        // one other highlight: contract-8)
        if (!Cook.Coach.onShelf(n.o)) return;
        glow(n.o);
        setTimeout(() => {
          const h = ctl && ctl.lit ? ctl.lit() : null;
          const off = () => lit === n.o && glow(null);
          if (h && h.done) h.done.then(off);
          else off();
        }, 0);
      };
      // (s19-games-2, contract-78: the grill's smoke is an effect that never ends while a cob grills; the light waits only for the game's
      // own moves, so the call held for it comes with it)
      const stillStage = () => {
        try {
          return !S.tweens.getTweens().some((tw) => tw.isPlaying() && !tw.isInfinite && !(tw.targets || []).every((t) => t && t.fx));
        } catch (e) {
          return true;
        }
      };
      ctl = Cook.Coach.control({ key: KEY, target, first, noHint: true, current, busy: () => moving > 0, still: stillStage, onLight: lightGlow });
      // SH-228 (chai's method): the stuck help after the level's wait from the last action, at once after a wrong move: her helper card
      // naming the thing (an item's step), else her line again, with the light. Never where the light would be the answer
      if (!hides && Cook.Coach.stuck)
        stuck = Cook.Coach.stuck({
          key: KEY,
          target,
          hintMs,
          current,
          busy: () => moving > 0,
          // (only a thing on the band glows and hops in its light, SH-237; anything else is lit alone: contract-8; its glow goes with
          // its light, however the light goes: contract-102)
          glow: (on) => {
            if (!Cook.Coach.onShelf(n.o)) return;
            glow(on ? n.o : null);
            const h = on && stuck && stuck.lit ? stuck.lit() : null;
            if (h && h.done) h.done.then(() => lit === n.o && glow(null));
          },
          onHint: () => hints++,
        });
      if (n.line) {
        const st = steps.to(`${KEY}:${n.step}`, { id, line: n.line, again: !!n.again, noCall: n.noCall || null });
        if (stuck) kitHelps(st);
      } else steps.done();
    }
    const refresh = () => lead(nextThing());
    const acted = () => St.acted && St.acted();
    // (SH-236: the light goes the moment the child starts a move)
    const began = () => Cook.Coach.began && Cook.Coach.began(KEY);

    // a raw cob on the band, tapped: it goes up onto the grill (as many as asked, as many places as the grill has)
    raw.forEach((img) =>
      S.tappable(img, () => {
        // (CK-90, contract-117 at corn L4: a tap the game turns down keeps its light; it goes only as the move begins)
        if (screen !== 1 || img.onBand === false || cobs.length + lifting + inTray.length >= count || cobs.length >= places) {
          S.wiggle(img);
          return;
        }
        began();
        img.onBand = false;
        S.untap(img);
        // (s19-clean-e, contract-102: its glow went with its light only when the step changed; the next cob's step has the same name, so
        // the cob flew to the grill still glowing, with no light: its glow goes as it leaves the band)
        if (lit === img) glow(null);
        const used = cobs.map((c) => c.slot);
        // (the places fill from the grill's middle out)
        const slot = [1, 2, 0, 3].find((k) => !used.includes(k));
        const at = L.grill.at(slot, 4);
        const c = { img, n: made++, slot, at, side: 0, p: 0, t0: 0, state: "fly", ring: Cook.Kit.heatRing(S, { depth: D.fx + 1 }) };
        cobs.push(c);
        img.setDepth(D.item + 0.5);
        Cook.sfx.pop();
        z.progress({ cob: slot });
        refresh();
        fly(() => GK.move(S, img, { x: at.x, y: at.y, len: L.grill.cob, up: true, ms: mo.bandMs || 520 })).then(() => {
          c.state = "cook";
          c.t0 = Date.now();
          if (Cook.sfx.sizzle) Cook.sfx.sizzle(0.5);
          S.tappable(img, () => tapCob(c));
          acted();
          refresh();
        });
      })
    );

    const tapCob = async (c) => {
      // (CK-90: a cob tapped before it is ready shakes and the lit step keeps its light; it goes only as a turn or a lift begins)
      if (c.state !== "turn" && c.state !== "lift") return S.wiggle(c.img);
      began();
      hold14.end("corn");
      if (c.state === "turn") {
        // turned once: it rolls over where it lies (its light's box fades out round it, contract-53), the grilled side under
        c.state = "flip";
        refresh();
        await fly(() => GK.roll(S, c.img, tex.turned, { ms: mo.flipMs || 140, k: mo.flipK || 0.6 }));
        Cook.sfx.click();
        c.side = 1;
        c.p = 0;
        c.t0 = Date.now();
        c.state = "cook";
        z.skill(100, "turn");
        acted();
        return refresh();
      }
      if (c.state === "lift") {
        c.state = "off";
        S.untap(c.img);
        c.ring.destroy();
        cobs.splice(cobs.indexOf(c), 1);
        const k = inTray.length + lifting;
        lifting++;
        refresh();
        const at = trayAt(k);
        if (c.img.texture.key !== tex.over && S.textures.exists(tex.done)) c.img.setTexture(tex.done);
        await fly(() => GK.move(S, c.img, { x: at.x, y: at.y, len: trayLen, up: true, ms: mo.trayMs || 460 }));
        lifting--;
        inTray.push(c);
        c.img.setDepth(D.item + 0.2);
        Cook.sfx.pop();
        if (!guided && Lang.known(COB)) Cook.markRight(COB);
        acted();
        // all made: the order's head ticks at once (Zafar, 1 Nov), then the flavour
        if (inTray.length === count) {
          UI.mission.closeItem([COB], dish, { head: true });
          return toPlates();
        }
        return refresh();
      }
      S.wiggle(c.img);
    };

    z.tick(() => {
      let changed = false;
      cobs.forEach((c) => {
        // (S19, CK-65: the ring keeps filling through the green while the cob waits to be turned or lifted)
        if (c.state !== "cook" && c.state !== "turn" && c.state !== "lift") return;
        const span = (sideMs + greenMs) / sp();
        const raw = Math.min(1, (Date.now() - c.t0) / span);
        c.p = hold14.cap(raw, greenLo, 1, "corn");
        if (c.p < raw) c.t0 = Date.now() - c.p * span; // (held: its clock waits with it)
        // the kit's heat ring over the cob's top end (one heat language): gold up to the sage band; ready from the green's start
        const r = L.ring(c.at);
        c.ring.draw(r.x, r.y, (lay.ring || {}).r || r.r, c.p, greenLo, 1);
        // (CK-80: left past its green on its second side, the cob is over: the fourth stage)
        if (c.state === "lift" && c.side === 1 && c.p >= 1 && c.img.texture.key !== tex.over && S.textures.exists(tex.over)) c.img.setTexture(tex.over);
        if (c.state !== "cook") return;
        if (Math.random() < (sm.chance || 0.03)) smoke(c.img.x, c.at.y - L.grill.cob * 0.2);
        if (c.side === 1 && c.p >= greenLo * 0.5 && c.img.texture.key !== tex.done && S.textures.exists(tex.done)) c.img.setTexture(tex.done);
        if (c.p >= greenLo) {
          c.state = c.side === 0 ? "turn" : "lift";
          changed = true;
        }
      });
      if (changed) refresh();
    });

    /* ---------------- screen 2: the flavour (each cob on its person's plate, the dressings on the band) ---------------- */
    const pl = lay.plates || {};
    const bw = lay.bowls || {};
    const dressStyle = lay.dress || {};
    /** Each dressing drawn on a cob in code (the art plan's question 3), in the cob's own frame, so it lies along it on the plate. */
    const dropsOn = (q, id) => {
      const cob = q.cob;
      const g = T(S.add.graphics().setDepth(cob.depth + 0.1 + Object.keys(q.drops).length * 0.01).setAlpha(0));
      g.setPosition(cob.x, cob.y).setRotation(cob.rotation);
      const len = cob.displayWidth;
      const th = cob.displayHeight;
      const st = dressStyle[id] || { kind: "specks", n: 30 };
      // (the kernels: CK-117, the chopped cob is kernels end to end, its cut ends rounded: its length less its rounded ends, about two
      // thirds of its thickness across. In the cob's own frame, so on the standing cob it runs up its length)
      const x0 = -len * 0.42;
      const x1 = len * 0.42;
      const hy = th * 0.3;
      let seed = (id.length * 131 + people.indexOf(q) * 977 + id.charCodeAt(id.length - 1)) >>> 0;
      const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
      const along = () => x0 + (x1 - x0) * rnd();
      const across = (x) => (rnd() * 2 - 1) * hy * (1 - Math.pow((x - (x0 + x1) / 2) / ((x1 - x0) / 2), 6) * 0.5);
      const c = col(id);
      const n = st.n || 30;
      if (st.kind === "drizzle") {
        // a chutney: a ribbon zig-zagging along the cob, its sheen a thinner lighter line
        const pts = [];
        for (let i = 0; i <= n * 2; i++) pts.push({ x: x0 + ((x1 - x0) * i) / (n * 2), y: (i % 2 ? 1 : -1) * hy * 0.75 });
        g.lineStyle(Math.max(3, th * 0.13), c, 0.95);
        g.strokePoints(pts, false);
        g.lineStyle(Math.max(1, th * 0.04), global.Tokens && global.Tokens.int ? global.Tokens.int("white") : col("spi-16"), 0.25);
        g.strokePoints(
          pts.map((pt) => ({ x: pt.x - th * 0.02, y: pt.y - th * 0.03 })),
          false
        );
      } else if (st.kind === "squeeze") {
        // lemon: its juice, glossy streaks along the kernels, and the squeezed wedge resting on the cob's tip end
        for (let i = 0; i < n; i++) {
          const x = along();
          g.fillStyle(col("lemonShine"), 0.8);
          g.fillEllipse(x, across(x) * 0.7, th * (0.4 + rnd() * 0.3), th * (0.08 + rnd() * 0.05));
        }
        // (the wedge inside the cob's outline: its flat side across the cob, at the top end of the standing cob)
        const r = th * 0.4;
        const wx = x1 - r * 0.9;
        const wy = -th * 0.05;
        g.fillStyle(col("lemonRind"), 1);
        g.slice(wx, wy, r, 0, Math.PI, false).fillPath();
        g.fillStyle(c, 1);
        g.slice(wx, wy, r * 0.84, 0, Math.PI, false).fillPath();
        g.lineStyle(Math.max(1, th * 0.03), col("lemonShine"), 0.9);
        for (let k = 1; k < 5; k++) {
          const a = (Math.PI * k) / 5;
          g.lineBetween(wx, wy, wx + Math.cos(a) * r * 0.8, wy + Math.sin(a) * r * 0.8);
        }
      } else if (st.kind === "crystals") {
        // salt: small white crystals with a grey edge
        for (let i = 0; i < n; i++) {
          const x = along();
          const y = across(x);
          const s = Math.max(2, th * (0.04 + rnd() * 0.03));
          g.fillStyle(col("saltEdge"), 0.9);
          g.fillRect(x - s / 2 + 0.6, y - s / 2 + 0.6, s, s);
          g.fillStyle(c, 1);
          g.fillRect(x - s / 2, y - s / 2, s, s);
        }
      } else {
        // a powder (chilli) or specks (pepper): fine dots all along, a powder denser and finer
        // (CK-103: a dressing's own speck size, st.r, over the cob's thickness: the pepper's specks big enough to see land on the cob)
        const r0 = st.r || (st.kind === "powder" ? 0.018 : 0.026);
        for (let i = 0; i < n; i++) {
          const x = along();
          g.fillStyle(c, st.kind === "powder" ? 0.85 : 0.95);
          g.fillCircle(x, across(x), Math.max(1.2, th * (r0 + rnd() * 0.014)));
        }
      }
      S.tweens.add({ targets: g, alpha: 1, duration: mo.dropInMs || 260 });
      return g;
    };
    const takeOff = (q, id) => {
      q.dressed.splice(q.dressed.indexOf(id), 1);
      const g = q.drops[id];
      delete q.drops[id];
      if (g) S.tweens.add({ targets: g, alpha: 0, duration: mo.dropInMs || 260, onComplete: () => g.destroy() });
      if (q.asked.includes(id)) UI.mission.reopen([id], dish, { for: q.who });
    };
    // (the test hook: what a tap would take back now, the active person's last dressing on, until they have it: the take-back player's)
    Cook.undoAt = () => {
      const q = people[active];
      return screen === 2 && q && !q.served && q.dressed.length && bowls[q.dressed[q.dressed.length - 1]] ? S.centre(bowls[q.dressed[q.dressed.length - 1]]) : null;
    };
    /** Who is dressed now: their plate and face full, the rest waiting a little dimmer (CMP-10: inactive things dim). */
    const showActive = () =>
      people.forEach((q, i) => {
        const a = q.served || i === active ? 1 : pl.dim || 0.62;
        [plates[i], q.face, q.cob].concat(Object.values(q.drops)).forEach((o) => o && o.active && S.tweens.add({ targets: o, alpha: a, duration: 220 }));
      });

    async function toPlates() {
      screen = 1.5;
      refresh();
      await fly(async () => {
        await Cook.wait(mo.endHoldMs || 400);
        // the grill, the tray and the cobs left on the band go; the cooked cobs stay, to go to their plates
        // (SH-256: the tray stays under its cobs until they have gone to their plates, so no cob hangs in the air while the scene changes)
        const away = [kit.grill].concat(onBand(), trayFaces).filter((o) => o && o.active);
        await Cook.tween(S, { targets: away, alpha: 0, duration: mo.screenMs || 380 });
        away.forEach((o) => o.destroy());
        // the six bowls on the band, each with its word pill (the shared shelf's pill, chai's floor): one row, or on a phone where the
        // pills at their floor can't share one row, two rows of three on a taller tray
        const lb = layBowls();
        // the plates, one a person, across this screen's play area (the frame's, above its bottom row); each one's face circle at its
        // upper left. (Sprint 20: was the sheet's x 150-1450 and its y 16; now the play area less its sides' share, plates.side)
        const P2 = F.play;
        const n = count;
        const side = P2.w * (pl.side != null ? pl.side : 0.068);
        const view = [P2.x + side, P2.x + P2.w - side];
        // (the plates above the bowls, their light's margin clear of the first row: contract-92)
        const room = lb.clear - lb.room - P2.y;
        // SH-254 (contract-113): with two or more plates, the well-done face beside a plate takes the kit's first spot, over the plate's
        // upper corner (Cook.Kit.praiseSpot, measured here on a plate of 1, so its share of the plate is the kit's): the plates leave
        // that room above them, and between them, so it never falls back onto a cob or a plate (at 740x320 the plates filled the play
        // area's height once it was the frame's, and the face lay on the cobs' tips). One plate keeps its whole room.
        // CK-118 (Zafar, 15 Nov, decision 36: "having them chopped like this and vertical means they'll take up a lot more space on the
        // plate, so wouldn't need to shrink too much"): the standing cob leaves the plate's upper corners bare, so the face comes in over
        // the corner (faceIn: the kit's spot measured on a box faceIn of the plate) as far as stays clear of the cob and covers little of
        // the plate, and the plates grow back by the room it gives
        const rs = (lay.review || {}).size || 0.55;
        const across = (g) => (view[1] - view[0] - (n - 1) * g) / n;
        // (the cob's share of a plate d across: as long as the plate holds it, never more than BAND_K over its tray size; the face's
        // room depends on it and the plate's size on the face's room: a few rounds settle both)
        const cobShare = (dd) => Math.min(plateCob(dd), trayLen * BAND_K) / dd;
        let kIn = 1;
        let ka = 0;
        let d = 0;
        let gap = pl.gap || 70;
        for (let i = 0; i < 5; i++) {
          kIn = n > 1 ? faceIn(cobShare(d || pl.d || 400)) : 1;
          const sp = n > 1 && Cook.Kit.praiseSpot ? Cook.Kit.praiseSpot({ x: 0, y: 0, w: kIn, h: kIn }, rs) : null;
          ka = sp ? Math.max(0, -sp.y + rs / 2 - 0.5) : 0;
          d = Math.min(pl.d || 400, across(pl.gap || 70), room / (1 + ka));
          gap = Math.max(pl.gap || 70, ka * d + 8);
          d = Math.min(d, across(gap));
        }
        const y = P2.y + ka * d + d / 2 + (room - d * (1 + ka)) / 2;
        const x0 = (view[0] + view[1]) / 2 - ((n - 1) * (d + gap)) / 2;
        people.forEach((q, i) => {
          const x = x0 + i * (d + gap);
          const plate = T(S.add.image(x, y, "cn4-plate").setDepth(D.item - 1).setAlpha(0));
          plate.setScale(d / Math.max(plate.width, plate.height));
          plate.wordId = COB;
          GK.shadow(S, plate, { dx: 8, dy: 11, alpha: 0.24, blur: 8 });
          const fs = d * (pl.face || 0.3);
          // (inside the plate's own square, so the light round the plate and its face is centred on the plate: contract-105)
          const fo = d / 2 - fs / 2;
          const face = T(S.add.image(x - fo, y - fo, Cook.Kit.badge(S, q.who)).setDisplaySize(fs, fs).setDepth(D.item + 2).setAlpha(0));
          plate.face = face; // (the light hugs the plate and its face circle: Cook.Coach.parts)
          q.face = face;
          q.at = { x, y, d, k: kIn };
          plates.push(plate);
          S.tweens.add({ targets: [plate, face], alpha: 1, duration: mo.screenMs || 380 });
        });
        // each person's cob from the tray to their plate, growing as it goes
        await Promise.all(
          people.map((q, i) => {
            const c = inTray[i];
            q.cob = c.img;
            c.img.setDepth(D.item + 0.3);
            // CK-117, CK-118 (Zafar, 15 Nov, decision 37: the plates "with an upright cob filling the plate, nothing past the rim"): it
            // stands upright on its plate as it stood on the band, the grill and the tray (one rotation the whole way), as big as the
            // plate holds it (its corners inside the plate's rim: plates.cob of the plate), and never more than 14% over its tray size,
            // so it grows with no snap (SH-256, contract-114)
            const len = Math.min(plateCob(d), trayLen * BAND_K);
            return GK.move(S, c.img, { x: q.at.x, y: q.at.y, len, up: true, ms: mo.plateMs || 520 });
          })
        );
        if (kit.tray && kit.tray.active) {
          await Cook.tween(S, { targets: kit.tray, alpha: 0, duration: mo.screenMs || 380 });
          kit.tray.destroy();
        }
      });
      screen = 2;
      active = 0;
      screenNote("flavour");
      if (ctx.nextStep) ctx.nextStep("Dress");
      showActive();
      acted();
      refresh();
    }
    /*
     * The six dressing bowls and their word pills (S19 wave B fix round; SH-219, chai's pill rule): every pill at least the floor
     * (Shelf.pillWant: the word at the platforms' smallest readable size on screen), never narrowed, never touching, and a light's
     * margin apart (the kit's Onboard.marginOf on the bowl's size), so a bowl's light, round its pill too, stops short of the next
     * (contract-92). Each slot is as wide as its own pill or its bowl, whichever is wider, laid side by side about the view's middle.
     * Where the six can't share one row at the floor (a phone: 740x320), they go in two rows of three on a taller stone tray, which
     * takes the band's place for this screen. Returns {top (the band's), clear (the first row's top), room (a light's margin)}, design px.
     */
    function layBowls() {
      const Sh = global.Shelf;
      const ppw = F.px || 1; // (the screen's scale, the frame's: the pills' floor is in CSS px)
      // (the floor: the shared shelf's pill rule, and the kitchen kit's canvas text floor, 14 CSS px on the canvas's own scale, TXT-05)
      const want = Math.max(1, Sh.pillWant(ppw), Cook.Kit && Cook.Kit.textFloor ? Cook.Kit.textFloor(S, (Sh.PILL || {}).text || 25) : 1);
      const PH = (Sh.PILL || {}).h || 46;
      const OL = (global.Onboard && global.Onboard.LIGHT) || { share: 0.12, min: 8, max: 16, clear: 2 };
      const room = (sz) => Math.max(Sh.pillGap(ppw), (Math.max(OL.min, Math.min(OL.max, OL.share * sz * ppw)) + OL.clear + 4) / ppw);
      // (the bowls' row is the frame's bottom row: they stand inside its stone tray's inner edge, a pill gap clear all round)
      const R = F.bottom;
      const mid = R.x + R.w / 2;
      const Vw = F.view();
      const m = Sh.pillGap(ppw);
      // (the slab for a top: Shelf.trayBox, the kit's stone tray; its inner edge as slab() reads it)
      const innerAt = (t) => slab({ trayBox: Sh.trayBox({ left: Vw.left, right: Vw.right, top: t, bottom: Vw.bottom }) }, R);
      const in0 = innerAt(R.y);
      // the bowls and pills first (their pills' own widths and drawn heights are measured), placed below
      ids.forEach((id) => {
        const img = T(S.add.image(mid, B.base, `cn4-${id}`).setDepth(D.item).setAlpha(0));
        img.wordId = id;
        img.chip = pill(S, id, mid, B.chipY, ctx); // (its pill is part of its light: the kit's parts, C.parts; S19, CK-61)
        img.chip.setAlpha(0);
        bowls[id] = img;
      });
      const pw = (id) => bowls[id].chip.faceW(bowls[id].chip.showsWord) * want;
      const slotOf = (id, sz) => Math.max(pw(id), sz + 14);
      // (a pill's drawn height at the floor's scale: its face, not its nominal box, PILL.h, which is taller than what is drawn)
      const pillD = Math.max(
        ...ids.map((id) => {
          const c = bowls[id].chip;
          c.setScale(want);
          const bb = c.getBounds();
          return bb && bb.height > 1 ? bb.height : PH * want;
        })
      );
      // (a row at its narrowest: its slots a pill gap apart, never closer: the shared shelf's pill rule)
      const rowMin = (row, sz) => row.reduce((a, id) => a + slotOf(id, sz), 0) + Sh.pillGap(ppw) * (row.length - 1);
      const fitsOne = (sz) => rowMin(ids, sz) <= in0.w - 2 * m && sz + 6 + pillD <= in0.h - 2 * m;
      let size = bw.size || 150;
      while (size > 120 && !fitsOne(size)) size -= 10;
      const two = !fitsOne(size);
      const rows = two ? [ids.slice(0, Math.ceil(ids.length / 2)), ids.slice(Math.ceil(ids.length / 2))] : [ids];
      if (two) size = Math.max(size, Math.min(bw.size || 150, 48 / ppw));
      const gapRows = room(size);
      /*
       * CK-104 (Zafar, 15 Nov: "the two rows don't fit properly and don't line up nicely. All the pills and all the bowls need to be
       * fitting well within the stone tray and be aligned properly ... The pills go over the edge. The spacing between the two rows is
       * too big"): the bowls and their pills stand inside the stone tray's drawn inner edge (its slab, less its lip and bevel), a pill
       * gap clear all round, centred in it. One row where the six fit so (as before, on one shelf line and one pill line, contract-109);
       * else two rows of three, lined up column by column (each column's bowl and pill on one vertical line, as wide as its wider
       * slot), a light's margin between the rows (never more than a pill's drawn height), the tray as tall as the two rows need, so the
       * play area above it is the plates'
       */
      const rowD = size + 6 + pillD;
      // (between the rows: a lit bowl's hop and its light's pad, Coach.parts and Onboard.LIGHT, so the light round a second-row bowl
      // stops short of the pill above it (contract-92); a pill's drawn height at most where the light allows it, CK-104)
      const hop = Math.max(8, Math.min(48, size * ((global.Onboard && global.Onboard.HOP) || 0.1)));
      const pad = (Math.max(OL.min, Math.min(OL.max, OL.share * size * ppw)) + OL.clear + 2) / ppw;
      const gapD = Math.max(Math.min(gapRows, pillD), hop + pad);
      const block = rows.length * rowD + (rows.length - 1) * gapD;
      let top = R.y;
      if (two) {
        // (the top that gives the slab's inner edge room for the block and a pill gap above and below it)
        top = Vw.bottom - block - 2 * m;
        for (let i = 0; i < 4; i++) top -= block + 2 * m - innerAt(top).h;
      }
      const inn = innerAt(top);
      const cols = rows[0].map((id, c) => Math.max(...rows.map((r) => (r[c] ? slotOf(r[c], size) : 0))));
      const sum = cols.reduce((a, w) => a + w, 0);
      // (the slots a light's margin apart where the tray has the room, never under a pill gap)
      const gapC = Math.max(Sh.pillGap(ppw), Math.min(room(size), (inn.w - 2 * m - sum) / Math.max(1, cols.length - 1)));
      const W = sum + gapC * (cols.length - 1);
      let y0 = inn.y + (inn.h - block) / 2; // (the first row's bowls' top)
      // (contract-112: a bowl's light, round its pill, stays whole on the screen: where the bottom row's light would reach the screen's
      // foot with the row away from it, the row stands that much higher, as far as the tray's inner edge allows)
      const lightPad = (OL.max + OL.clear + 4 + 6) / ppw;
      const below = Vw.bottom - (y0 + block);
      if (below * ppw > 18 && below < lightPad) y0 -= Math.min(lightPad - below, Math.max(0, y0 - (inn.y + m)));
      let x = inn.x + inn.w / 2 - W / 2;
      const cx = cols.map((w) => {
        const c = x + w / 2;
        x += w + gapC;
        return c;
      });
      const pos = {}; // (id -> {x, foot, chip, w})
      rows.forEach((row, ri) =>
        row.forEach((id, c) => {
          const foot = y0 + ri * (rowD + gapD) + size;
          pos[id] = { x: cx[c], foot, chip: foot + 6 + pillD / 2, w: cols[c] + gapC };
        })
      );
      ids.forEach((id) => {
        const at = pos[id];
        const img = bowls[id];
        img.setPosition(at.x, at.foot - size / 2);
        img.setScale(size / Math.max(img.width, img.height));
        GK.shadow(S, img, { dx: 5, dy: 7, alpha: 0.24, blur: 5 });
        const c = img.chip;
        c.k = want;
        c.setScale(want).setPosition(at.x, at.chip);
        if (c.hit) c.hit(at.w - 2);
        S.tweens.add({ targets: [img, c], alpha: 1, duration: mo.screenMs || 380 });
        S.tappable(img, () => tapBowl(img));
      });
      const firstTop = Math.min(...ids.map((id) => pos[id].foot)) - size;
      // this screen's floor plan, the frame's (its option for a game's next screen, F.next): where the two rows need a taller tray,
      // the bottom row's top moves up to them and the band is drawn anew there, faded in over the first screen's; the play area left
      // above it is the plates'
      F = F.next(two ? { top, band: { ms: mo.screenMs || 380 } } : {});
      if (two && F.band) band = F.band;
      // (the first row's top, and the widest light margin's room above it, for the plates)
      return { top, clear: firstTop, room: (OL.max + OL.clear + 4) / ppw };
    }

    // what goes on: named as it goes on, their row ticks; a second tap takes it back until they have it (non-negotiable 7)
    const tapBowl = async (img) => {
      const id = img.wordId;
      const q = people[active];
      if (screen !== 2 || !q || q.served) {
        S.wiggle(img);
        return;
      }
      began();
      if (q.dressed.includes(id)) {
        // taken back: its dressing goes, its row opens again
        takeOff(q, id);
        Cook.sfx.click();
        z.progress({ off: id });
        acted();
        return refresh();
      }
      q.dressed.push(id);
      Lang.speakWord(id);
      const ok = q.asked.includes(id);
      z.listen(ok, ok ? `put ${id}` : `put ${id}, not asked`);
      if (!ok) Cook.Coach.wrong(KEY); // (a wrong move brings the stuck hint at once: STD-D2-04)
      // CK-103 (the S19 gate's eye judge, 12 Nov: "a plain black speck crosses the screen"): what flies to the cob is the bowl's own
      // picture, a small copy of it, never a plain dot (a dot only where the picture is missing)
      const fw = Math.max(40, Math.min(img.displayWidth * 0.6, 90));
      const dot = S.textures.exists(img.texture.key)
        ? T(S.add.image(img.x, img.y, img.texture.key).setDepth(D.fx).setScale(fw / Math.max(1, img.width)))
        : T(S.add.circle(img.x, img.y, 20, col(id), 1).setDepth(D.fx));
      dropping++;
      refresh();
      try {
        await fly(() => Cook.tween(S, { targets: dot, x: q.cob.x, y: q.cob.y, scale: dot.scale * 0.6, duration: mo.dropMs || 420, ease: "Cubic.easeInOut" }));
      } finally {
        dropping--;
      }
      dot.destroy();
      if (!q.dressed.includes(id) || q.drops[id] || q.served) return refresh(); // (taken back while it flew: the step it left opens again)
      q.drops[id] = dropsOn(q, id);
      Cook.sfx.pop();
      if (ok) {
        UI.mission.tickItem(id, dish, { close: true, for: q.who });
        if (!guided && Lang.known(id)) Cook.markRight(id);
      }
      acted();
      refresh();
    };

    const servePlate = (i) => {
      const q = people[i];
      if (screen !== 2 || i !== active || !q || q.served || !serveNow) {
        // (a round plate shakes side to side, never turned: a turned square picture grows its box into the band, contract-109)
        const pt = plates[i] || plates[0];
        if (pt && !S.tweens.isTweening(pt)) S.tweens.add({ targets: pt, x: pt.x + 8, duration: 60, yoyo: true, repeat: 2 });
        return;
      }
      began();
      const go = serveNow;
      serveNow = null;
      go();
    };

    // STD-D1-08 (contract-98): the reveal lessons, the dotted word then the blurred picture, once the order has landed and before the
    // first step (kit (d)); then the first step opens and its call is said
    if (Cook.Coach.lessons) await Cook.Coach.lessons({ gate, ctx, busy: () => moving > 0 });
    refresh();
    // (screen 2 begins when the last cob is in the tray: toPlates)
    await new Promise((resolve) => {
      let off = null;
      off = z.tick(() => {
        if (screen !== 2) return;
        if (off) off();
        resolve();
      });
    });
    plates.forEach((plate, i) => S.tappable(plate, () => servePlate(i)));

    /* ---------------- the serve, one person at a time: the kit's tick, faces, recast and redo (decision 51) ---------------- */
    const serve = Cook.Kit.serve(); // (the kitchen's serve: NjgServe.for(Cook), its well done shown in Nani's box, SH-252)
    const rev = lay.review || {};
    const rowsOf = (q, want) => {
      const Ld = UI.mission.ladders ? UI.mission.ladders()[dish] : null;
      return Ld && Cook.Order ? Cook.Order.rows(Ld, { all: true }).filter((r) => !r.head && (!r.for || r.for === q.who) && r.ids.some((x) => want.includes(x))) : [];
    };
    for (let i = 0; i < people.length; i++) {
      const q = people[i];
      active = i;
      ctlId = null;
      // (the order panel keeps this person's card open and in view: the station is on them, as chai's pan in hand; contract-99)
      if (UI.mission.focus) UI.mission.focus(q.who);
      showActive();
      refresh();
      await serve.round({
        items: [q.who],
        done: async () => {
          await new Promise((r) => (serveNow = r));
          if (ctl) ctl.close();
          ctl = null;
          if (stuck) stuck.close();
          stuck = null;
          ctlId = null;
          glow(null);
          steps.done();
          z.expect(null);
          // (the light's layer fades out over the plate for 300 ms: the face comes after it, so no box crosses it, contract-82)
          await new Promise((r) => setTimeout(r, mo.lightFadeMs || 320));
        },
        check: (item, round) => {
          const missing = q.asked.filter((id) => !q.dressed.includes(id));
          const extra = q.dressed.filter((id) => !q.asked.includes(id));
          const ok = !missing.length && !extra.length;
          if (!round) {
            missing.forEach((id) => {
              UI.mission.missItem(id, dish, { for: q.who });
              z.listen(false, `left out ${id}`);
              if (!guided) Cook.markMiss(id);
            });
            extra.forEach((id) => z.listen(false, q.nos.includes(id) ? `put ${id} (they said no)` : `put ${id}, not asked`));
          }
          const bad = rowsOf(q, missing.concat(extra.filter((id) => q.nos.includes(id))));
          if (!ok && UI.mission.serveWrong) UI.mission.serveWrong(bad.length ? bad.map((r) => r.ids[0]) : missing.concat(extra), dish, { for: q.who });
          // (what they say again: those rows; an unasked one has no row of its own, so their whole order, as the kit's recast does)
          return { ok, rows: bad.length ? bad : null };
        },
        review: async (wrong) => {
          q.face.setVisible(false);
          const size = q.at.d * (rev.size || 0.55);
          // (contract-108: well done once the whole card is ticked: only the last person's right plate says the praise, when every
          // plate before it was right too; the rest are their faces alone)
          const last = i === people.length - 1;
          const praise = last && !wrong.length && people.every((x, j) => j >= i || x.right);
          q.right = !wrong.length;
          // SH-254 (the eye judge, 10 Nov: Nana's face sat on the plate over the cob): the face beside the plate, over its rim's edge
          // only, clear of the cob, the other plates and their faces (the kit's praiseSpot, chai's corner first)
          const cobB = q.cob && q.cob.active ? q.cob.getBounds() : null;
          const avoid = plates.filter((p) => p !== plates[i]).map((p) => p.getBounds()).concat(people.filter((x) => x !== q && x.face).map((x) => x.face.getBounds()));
          if (cobB) avoid.push({ x: cobB.x, y: cobB.y, right: cobB.right, bottom: cobB.bottom });
          // (kept on what the screen shows, above this screen's bottom row: the frame's view and row)
          const V = F.view();
          const at = Cook.Kit.praiseSpot({ x: q.at.x, y: q.at.y, w: q.at.d * q.at.k, h: q.at.d * q.at.k }, size, { avoid, view: [V.left, V.top, V.right, F.bottom.y] });
          return [await serve.review(S, { who: q.who, ok: !wrong.length, x: at.x, y: at.y, size, side: at.side, line: praise ? undefined : false })];
        },
        oops: () => z.oops(),
        recast: async (item, rows) => {
          await UI.personSay(q.who, rows ? { rows } : {});
        },
        afterReview: () => q.face.setVisible(true),
        redo: St.redo(ctx),
        key: () => `${KEY}:${q.who}`,
        showRight: async () => {
          // the third wrong try: the right way shown (what was asked goes on, nothing else)
          q.dressed.filter((id) => !q.asked.includes(id)).forEach((id) => takeOff(q, id));
          q.asked
            .filter((id) => !q.dressed.includes(id))
            .forEach((id) => {
              q.dressed.push(id);
              q.drops[id] = dropsOn(q, id);
              UI.mission.tickItem(id, dish, { close: true, for: q.who });
            });
          await Cook.wait(mo.endHoldMs || 500);
        },
        reset: () => q.dressed.slice().forEach((id) => takeOff(q, id)),
        again: () => {
          ctlId = null;
          refresh();
        },
      });
      q.served = true;
      // (the next person is the one in progress before this card folds, so the panel moves once, straight to their card: contract-99)
      if (UI.mission.focus && people[i + 1]) UI.mission.focus(people[i + 1].who);
      UI.mission.closeItem([], dish, { all: true, for: q.who });
      Cook.sfx.pop();
      await Cook.wait(mo.endHoldMs || 500);
    }
    screen = 3;
    active = people.length;
    if (UI.mission.focus) UI.mission.focus(null);
    // (the round is over: nothing here takes a tap any more, as the kitchen comes back: contract-109 read a plate mid-transition)
    plates.forEach((o) => o && o.active && S.untap(o));
    Object.values(bowls).forEach((o) => o && o.active && S.untap(o));
    refresh();
    Cook.undoAt = null;
    UI.mission.closeItem([], dish, { all: true });
    await Cook.wait(mo.endHoldMs || 500);
    if (!guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[KEY] = true;
    }
    // a finished round counts towards the level-up (the central rules); a grown-up's pick never moves it
    if (Cook.roundDone && !guided) {
      const dsh = ctx.order && ctx.order.dishes ? ctx.order.dishes[dish] : null;
      Cook.roundDone(KEY, { level: Cook.roundLevel(ctx), hints, grownUp: !!ctx.lab || !(dsh && dsh.autoLevel) });
    }
    z.close();
    return { served: people.length };
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
  Mech.lab(KEY, {
    name: "Corn stall (prototype)",
    verb: "Grill, turn once, then what goes on",
    async run(L) {
      register();
      const R = Cook.Recipes;
      const d = R.corn.make("nana", { level: L.level });
      L.ctx.steps = R.corn.steps(d);
      L.card(d, L.ctx.steps);
      await L.station(KEY, { plates: d.plates, count: d.count, dress: d.dress, no: d.no, who: "nana" });
    },
  });
})(window);
