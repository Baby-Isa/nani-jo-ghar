/*
 * Mechanic: assemble, the chaat station (v2: docs/design-language/ui-design-system.md §14 + §14a; the chai v2
 * grid and slots, §3, §4, §10; v3, 30 Sept: the play-test's T2, T3, T5 and Q2b). Toppings go into a clear
 * glass bowl in the order the person said.
 *
 * FULLY SIDE-ON (v3, Q2b: "keep everything side-on"):
 *  - THE BOWL (centred in the scene): the side-on glass serving bowl (assets/cook/items/v3/chaat/
 *    bowl-side.webp), placed by its MEASURED inside (build/check_vessel_meta.py: the rim, the inside
 *    floor, the inside wall at 41 heights; copied below as BOWL / BOWL_INSIDE and checked against the art).
 *    Each topping settles in as a side-on strip of the same food as in its pot (tiled from the pot
 *    picture at the bowl's scale), with a little drop and bounce; the top layer shows its surface, and its
 *    word pops by the bowl with the family clip (§4: learning happens during the action). A see-through
 *    copy of the glass lies over the food (its walls and highlights; the floor's ring cut out).
 *  - THE SHELF (the bottom 30%): the side-on glass pots (v3/chaat/pot-*.webp, the pantry jars' look),
 *    standing on their measured bottom-centre on one shelf line, a speaker chip under each: tap the pot
 *    = use it, tap the chip = hear it. The word is written until the child has used it right, then the speaker alone
 *    from the next round (Cook.chipWord; Zafar, 20 Oct, replacing s08 w6M's speaker-only chips).
 *    Decoys and the "don't" item stand there too. The tomato pot is a stand-in (see POTS).
 *  - TAKE IT BACK (UX §17): until Done, a tap on the bowl lifts the top layer back out to its pot.
 *  - NO TALLY at this station (§14a): the bowl shows what's in.
 * The card (the shared order card, §12): each layer ticks its row as it goes in (UX 11, right or not);
 * at levels 1-2 a chopped layer's row writes how many (T1, Q7: "ba bataato"). The order is judged when
 * you serve.
 * THE REVIEW (29 Sept, X10 / Q1, T5: Cook.Kit.review): Done -> their big round face comes up over the
 * bowl (no body, no pretend eating).
 *  - right: a happy face and the family's praise clip (Shabash!);
 *  - wrong: a gentle frown, they say their order again, the bowl EMPTIES and you
 *    build it again. Never a red cross; only the first mistake counts (the accuracy badge, the end review).
 * LEVELS (§14, §14a; the recipe's slots by level in data/cook.json, the decoys in
 * data.mechanics.assemble): 1 = three layers, no decoys; 2 = decoys; 3 = a "don't" row; 4 = the person's card starts FOLDED (face + headline): remember what you heard;
 * tapping the card to peek costs a hint (the light-bulb badge).
 * ONBOARDING (first time; S19, CHT-18): the kitchen kit's coach, each next topping in the dim and the lit box through the first
 * bowl (data/cook.json onboard.assemble, a staged step for each); no ghost finger of its own.
 *
 * St.freePick (js/cook/station-lib.js) is the shared "tap anything, or Done" step that the fill mechanic uses too:
 * nothing is refused, so nothing gives the answer away; you're graded afterwards.
 *
 * SPRINT 18 (s18-g-chaat; docs/design-language/standard/gaps/chaat.md): chaat is its settings file (data/stations/chaat.json:
 * the bowl's place and layers, the shelf, the pots and strips, the motions' times, flyMs by level) plus its own mechanic, the bowl
 * (the checker, the layers, the spoon in and out, the wobble, the take-back, the first-time demo). Everything else is a kit call:
 * the worktop and stone band (Cook.Kit.worktop, St.stoneBand), the word pills and the row (Shelf.P.chip, Shelf.slots,
 * Shelf.pillWant, Shelf.pillScale), the word pop (Juice.P.pop), the first-time gate, the reveal lessons and a wrong move's hint
 * (Cook.Coach.firsts, .lessons, .wrong), the review face (Cook.Kit.review), the tick and the recast (NjgServe.round), the person
 * saying their rows again (UI.personSay). The test hooks: Cook.undoAt, Cook.chaatPills, the "chaat-drop" note.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";
import { NjgServe } from "../../shared/serve.js"; // the kitchen kit's serving (Sprint 18 piece 8): the tick and the recast

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  // knobInt, freePick and the customer's say are in js/cook/station-lib.js (CK-25: samosa and daar use them without
  // this file, which now loads only with the chaat bowl)
  const knobInt = St.knobInt;

  /* ---- CHAAT_RULES: pure, no Cook, no DOM (build/leak_chaat.mjs, the chaat leak bot, reads this block by these markers) ---- */
  /** Where a list stands: the next thing it wants, and the first mistake in `got`. */
  function checker(sequence) {
    const steps = sequence.map((e) => [].concat(e));
    return {
      total: steps.reduce((a, g) => a + g.length, 0),
      /** The next id the order wants after `got` (as if `got` were right). */
      next(got) {
        let p = 0;
        for (const g of steps) {
          const placed = got.slice(p, p + g.length);
          if (placed.length < g.length) return g.find((x) => !placed.includes(x)) || g[0];
          p += g.length;
        }
        return null;
      },
      /** The first wrong place: {at, expected, got} (got undefined = missing; expected null = extra). */
      mistake(got) {
        let p = 0;
        for (const g of steps) {
          const rem = g.slice();
          for (let j = 0; j < g.length; j++) {
            const x = got[p + j];
            if (x === undefined) return { at: p + j, expected: rem[0] };
            const idx = rem.indexOf(x);
            if (idx < 0) return { at: p + j, expected: rem[0], got: x };
            rem.splice(idx, 1);
          }
          p += g.length;
        }
        return got.length > p ? { at: p, expected: null, got: got[p] } : null;
      },
      /** Is position i the first of its step (said with "ne poi"), and is it in a group? */
      place(i) {
        let p = 0;
        for (let s = 0; s < steps.length; s++) {
          if (i < p + steps[s].length) return { step: s, first: i === p, group: steps[s].length > 1 };
          p += steps[s].length;
        }
        return { step: steps.length, first: true, group: false };
      },
      /** The rest of the order from position i, as list entries. */
      rest(i, got) {
        let p = 0;
        const out = [];
        steps.forEach((g) => {
          if (p + g.length <= i) {
            p += g.length;
            return;
          }
          const placed = got.slice(p, i);
          const left = g.filter((x) => !placed.includes(x));
          out.push(left.length > 1 ? left : left[0]);
          p += g.length;
        });
        return out;
      },
    };
  }
  /**
   * CHT-14, CHT-15 (decision 9; P62, P63; Zafar, 17 Oct): what a tapped item does, judged as it is put in (was: anything went
   * in and only the serve judged it, while the card ticked only the right ones: "you put in an item. If it's not ticked, you
   * take it out"). `got`: the bowl, bottom first, always a right start of the order (a wrong thing never stays in).
   *   "in"     it is what the order wants here: it stays (its row ticks as it goes in)
   *   "bounce" it is not wanted at all (a decoy, the 'no' item, one more than asked): a pause, the glass wobbles with a
   *            warm glow and it comes back out; the bowl keeps what it had
   *   "later"  it is in the order, but later: the same wobble and it comes back out; the right ones stay in the bowl and
   *            stay ticked (Zafar, 21 Oct: replaces decision 9's "a wrong one in the sequence empties the bowl")
   * expected: what the order wanted here (its row loses its tick: a tick is the right item first go).
   */
  function judgeDrop(C, got, id) {
    const m = C.mistake(got.concat(id));
    if (!m || m.got === undefined || m.at > got.length) return { verdict: "in", expected: id };
    const later = [].concat(...C.rest(got.length, got)).includes(id);
    return { verdict: later ? "later" : "bounce", expected: C.next(got) };
  }
  /**
   * The rows a wrong try costs their tick (P63: "you get a tick if you put the right item in the right sequence on the first
   * go"; "if an item in the order gets thrown out because it was in the wrong sequence, that should take away a tick"):
   * the row the order wanted here, the 'no' row when its item was tried, and the item's own row when it was tried too soon.
   * Help never costs a tick (it goes on the bulbs, SH-49). Returns [{id, no}] (word ids; no: the 'don't' row).
   */
  function rowsMissed(j, id, exclude = []) {
    if (j.verdict === "in") return [];
    const out = [];
    if (j.expected) out.push({ id: j.expected, no: false });
    if (exclude.includes(id)) out.push({ id, no: true });
    else if (j.verdict === "later" && id !== j.expected) out.push({ id, no: false });
    return out;
  }
  /* ---- /CHAAT_RULES ---- */

  /* ---------- the chaat v3 station (30 Sept, T2/T3, Q2b: fully side-on) ---------- */
  // the side-on glass bowl, as build/check_vessel_meta.py measured it (v3/chaat/meta.json "bowl-side"): the
  // rim's and the inside floor's front lines, how flat a level's ellipse is there, and the inside wall's
  // [left, right] at 41 heights of the sprite (all fractions of the sprite's width / height)
  const BOWL = { w: 1214, h: 618, cx: 0.4992, rim: 0.0599, floor: 0.8285, eryRim: 0.025, eryFloor: 0.1504, floorTop: 0.6489, floorHw: 0.304 };
  // prettier-ignore
  const BOWL_INSIDE = [[0.0346,0.9646],[0.0346,0.9646],[0.0346,0.9646],[0.0372,0.962],[0.0445,0.9539],[0.0477,0.9507],[0.0509,0.9483],[0.0549,0.9443],[0.0581,0.9411],[0.0613,0.9379],[0.0653,0.9347],[0.0685,0.9299],[0.0733,0.9259],[0.0773,0.9218],[0.0813,0.9178],[0.0854,0.913],[0.0902,0.9081],[0.095,0.9033],[0.0999,0.8985],[0.1055,0.8928],[0.1112,0.8871],[0.1177,0.8807],[0.1242,0.8742],[0.1315,0.8677],[0.1396,0.8595],[0.1469,0.8514],[0.1567,0.8425],[0.1657,0.8327],[0.1763,0.8221],[0.1885,0.8106],[0.2002,0.799],[0.2125,0.7858],[0.2273,0.7718],[0.2446,0.7545],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504]];
  // the bowl in use: the v3 bowl above, or the art run's (useBowlArt); BOWL stays the v3 measures the check reads
  let GLASS = { w: BOWL.w, h: BOWL.h, cx: BOWL.cx, rim: BOWL.rim, floor: BOWL.floor, eryRim: BOWL.eryRim, eryFloor: BOWL.eryFloor, floorTop: BOWL.floorTop, floorHw: BOWL.floorHw, inside: BOWL_INSIDE };
  // the side-on pots (the pantry jars' look): one canvas, standing on its measured bottom-centre (meta.json)
  const POT = { w: 356, h: 370, anchor: [0.5, 0.9514] };
  /*
   * Sprint 18 (s18-g-chaat; the sprint's "Coded well" rule 1): the game's own numbers are its settings file, data/stations/chaat.json
   * (read once, before the first bowl; set() below), never constants here: the bowl's place and size and its layers' looks, the
   * shelf's line and slots, each topping's pot and strip, the motions' times and what changes by level. The shelf's word pills, the
   * worktop, the stone band and the word pop are the kits' (js/shared/shelf.js, js/cook/kitchen-kit.js, js/shared/juice.js).
   */
  const FILE = "data/stations/chaat.json";
  let SET = null;
  let loading = null;
  let V3, POTS, STRIP_DIR, STRIPS, POT_FOOD, THIN, DRIZZLE, BAND_SCALE, BAND_W, BAND_PAD, RES, GLASS_W, GLASS_X, BASE, PITCH, PREP_W, CHIP_Y, SPAN, MOTION;
  const SHELF_TOP = St.SHELF.top; // §3: the scene is the top 70%, the shelf band the bottom 30% (SH-112)
  let GLASS_BOTTOM = 0;
  // the bowl is centred in the scene above the shelf band (0..SHELF_TOP): its middle at SHELF_TOP / 2
  const placeBowl = () => (GLASS_BOTTOM = Math.round(SHELF_TOP / 2 + (GLASS_W * GLASS.h) / GLASS.w / 2));
  function set(s) {
    SET = s;
    const B = s.bowl;
    V3 = s.pots.dir;
    POTS = s.pots.files;
    STRIP_DIR = s.strips.dir;
    STRIPS = s.strips.files;
    POT_FOOD = B.potFood;
    THIN = B.thin;
    DRIZZLE = Object.fromEntries(B.drizzle.map((id) => [id, true]));
    BAND_SCALE = B.bandScale;
    BAND_W = B.band.w;
    BAND_PAD = B.band.pad;
    RES = B.res;
    GLASS_W = B.w;
    GLASS_X = B.x;
    BASE = s.shelf.base;
    PITCH = s.shelf.pitch;
    PREP_W = s.shelf.potW;
    CHIP_Y = s.shelf.chipY;
    SPAN = s.shelf.span;
    MOTION = s.motion;
    bowlUrl = `${V3}${s.pots.bowl}.webp`;
    placeBowl();
    return s;
  }
  /** The settings, once (a Promise of data/stations/chaat.json, applied). */
  const settings = () =>
    (loading =
      loading ||
      fetch(Cook.v(FILE))
        .then((r) => r.json())
        .then(set)
        .catch((e) => {
          loading = null; // (asked again at the next bowl)
          throw e;
        }));
  /** The level's row of the settings (levels[n - 1], the last for a level past them). */
  const levelSet = (level) => {
    const rows = (SET && SET.levels) || [];
    return rows[Math.min(Math.max(1, level), rows.length) - 1] || {};
  };
  /*
   * CHT-03 / T1 (S02-E): the art run's plain thin side-on bowl (art.s02 "chaat-glass", C8) once it has landed, with its
   * own measured inside (meta.bowl, the same measures as BOWL above); else the v3 bowl.
   */
  let bowlUrl = null;
  function useBowlArt() {
    const a = St.art("chaat-glass");
    const m = a && a.meta && a.meta.bowl;
    if (!m) return;
    GLASS = { w: m.w, h: m.h, cx: m.cx, rim: m.rim, floor: m.floor, eryRim: m.eryRim, eryFloor: m.eryFloor, floorTop: m.floorTop, floorHw: m.floorHw, inside: m.inside };
    placeBowl();
    bowlUrl = a.file;
  }
  const potFood = {}; // id -> a canvas of the food in its pot (the layer's texture)
  /*
   * CHT-13 (P61; Zafar, 17 Oct: "redraw the bowl so it's exactly side-on ... the artwork is just like a horizontal strip"):
   * the s08b art run's side-on strip per item (CH2, CH3: assets/s08b-cut-data.json), drawn as the layer itself, one strip
   * across the bowl at its own size (no tiling, no seams), its ragged or glossy top the layer's top. The pot photos tiled in
   * code (bandCanvas) stay only for an item with no strip. (The strips: the settings' strips.)
   */
  const stripKey = (id) => `cv3-strip-${id}`;
  // how far a strip's top (leaves, sev, a glossy edge) stands above its layer's line, as a share of the strip's height: where
  // its rows first turn solid (measured once per strip: the first row 85% as opaque as its most opaque row), so the line
  // between two layers is food on both sides and never the glass showing through a ragged edge
  const STRIP_TOP = {};
  function stripTop(id, im) {
    if (STRIP_TOP[id] != null) return STRIP_TOP[id];
    let top = 0.1;
    try {
      const w = 96;
      const h = Math.max(8, Math.round((im.height * w) / im.width));
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const x = cv.getContext("2d");
      x.drawImage(im, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data;
      const rows = Array.from({ length: h }, (_, y) => {
        let s = 0;
        for (let i = 0; i < w; i++) s += d[(y * w + i) * 4 + 3];
        return s / w;
      });
      const max = Math.max(...rows);
      const y = rows.findIndex((v) => v >= 0.85 * max);
      if (y >= 0) top = Math.min(0.3, y / h);
    } catch (e) {
      /* no pixels to read: the usual share */
    }
    return (STRIP_TOP[id] = top);
  }
  let stripScene = null; // the scene whose strips are loaded (set by the station)
  const stripOf = (id) => {
    const S = stripScene;
    const key = stripKey(id);
    return S && STRIPS[id] && S.textures.exists(key) ? S.textures.get(key).getSourceImage() : null;
  };

  /** The glass's inside half-width and centre at a height f (a fraction of the sprite's height). */
  function insideAt(f) {
    const P = GLASS.inside;
    const t = Cook.clamp(f, 0, 1) * (P.length - 1);
    const i = Math.min(P.length - 2, Math.floor(t));
    const u = t - i;
    const l = P[i][0] + (P[i + 1][0] - P[i][0]) * u;
    const r = P[i][1] + (P[i + 1][1] - P[i][1]) * u;
    return { cx: (l + r) / 2, hw: (r - l) / 2 };
  }

  /** A small seeded random (a layer keeps its own look while it settles and grows). */
  function rng(seed) {
    let t = seed >>> 0;
    return () => {
      t = (t + 0x6d2b79f5) >>> 0;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  const colourOf = (id) => ((Cook.item(id) || {}).layer || {}).color || "#d8c49a";

  /**
   * A topping's "stamps": a dozen pieces cut at random from its strip art, each with feathered edges,
   * at the size a piece has in the glass (BAND_SCALE). Scattered at random, they make a layer with no
   * visible tile or repeat. A chutney's pieces are whole-height ribbons, feathered at the ends only.
   */
  const STAMPS = {};
  function stampsOf(id, im) {
    if (STAMPS[id]) return STAMPS[id];
    const R = rng([...id].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7));
    const drizzle = !!DRIZZLE[id];
    const sc = drizzle ? 1 : BAND_SCALE[id] || 0.34;
    const out = [];
    for (let i = 0; i < 12; i++) {
      const sh = drizzle ? im.height : im.height * (0.5 + R() * 0.4);
      const sw = drizzle ? im.width * (0.3 + R() * 0.2) : Math.min(im.width * 0.45, sh * (1.2 + R() * 1.2));
      const sx = R() * (im.width - sw);
      const sy = R() * (im.height - sh);
      const w = Math.max(4, Math.ceil(sw * sc));
      const h = Math.max(4, Math.ceil(sh * sc));
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const x = cv.getContext("2d");
      x.drawImage(im, sx, sy, sw, sh, 0, 0, w, h);
      x.globalCompositeOperation = "destination-in";
      if (drizzle) {
        const gr = x.createLinearGradient(0, 0, w, 0);
        gr.addColorStop(0, "rgba(0,0,0,0)");
        gr.addColorStop(0.2, "#000");
        gr.addColorStop(0.8, "#000");
        gr.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = gr;
        x.fillRect(0, 0, w, h);
      } else {
        x.translate(w / 2, h / 2);
        x.scale(w / 2, h / 2);
        const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1);
        gr.addColorStop(0, "#000");
        gr.addColorStop(0.55, "#000");
        gr.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = gr;
        x.fillRect(-1, -1, 2, 2);
      }
      out.push(cv);
    }
    return (STAMPS[id] = out);
  }

  /** One layer's flat texture (BAND_W x h glass px): its colour, then its stamps scattered at random. */
  function bandCanvas(id, im, h, seed) {
    const cv = document.createElement("canvas");
    cv.width = BAND_W;
    cv.height = h;
    const x = cv.getContext("2d");
    const R = rng(seed);
    if (!DRIZZLE[id]) {
      x.fillStyle = colourOf(id);
      x.fillRect(0, 0, BAND_W, h);
    }
    if (!im) return cv;
    const st = stampsOf(id, im);
    const put = (s, px, py, sw, sh) => {
      x.save();
      if (R() < 0.5) {
        x.translate(px + sw, py);
        x.scale(-1, 1);
        x.drawImage(s, 0, 0, sw, sh);
      } else x.drawImage(s, px, py, sw, sh);
      x.restore();
    };
    if (DRIZZLE[id]) {
      // ribbons along the layer, overlapping, each a little higher or lower
      const inner = h - 2 * BAND_PAD;
      for (let px = -R() * 120; px < BAND_W; ) {
        const s = st[Math.floor(R() * st.length)];
        const sh = inner * (1.05 + R() * 0.2);
        const sw = (s.width * sh) / s.height;
        put(s, px, BAND_PAD + (inner - sh) / 2 + (R() - 0.5) * inner * 0.25, sw, sh);
        px += sw * (0.6 + R() * 0.15);
      }
      return cv;
    }
    // v3: the pot's food itself, tiled at the bowl's scale (mirrored at every other seam, so the pieces
    // stay crisp and there's no hard edge), then a few loose stamps over it so no two stretches match
    const sc = BAND_SCALE[id] || 0.62;
    const tw = im.width * sc;
    const th = im.height * sc;
    const ox = -R() * tw;
    const oy = -R() * th * 0.5;
    for (let ty = oy, row = 0; ty < h; ty += th, row++)
      for (let tx = ox + (row % 2) * tw * 0.37, col = 0; tx < BAND_W; tx += tw, col++) {
        x.save();
        x.translate(tx + (col % 2 ? tw : 0), ty + (row % 2 ? th : 0));
        x.scale(col % 2 ? -1 : 1, row % 2 ? -1 : 1);
        x.drawImage(im, 0, 0, tw, th);
        x.restore();
      }
    // a jittered, sparse grid of stamps, drawn in a random order
    const aw = st.reduce((a, s) => a + s.width, 0) / st.length;
    const ah = st.reduce((a, s) => a + s.height, 0) / st.length;
    const cw = Math.max(6, aw * 0.4);
    const ch = Math.max(6, ah * 0.4);
    const pts = [];
    for (let gy = -ch; gy < h + ch; gy += ch)
      for (let gx = -cw; gx < BAND_W + cw; gx += cw) {
        const s = st[Math.floor(R() * st.length)];
        const k = 0.85 + R() * 0.3;
        if (R() < 0.55) continue;
        pts.push({ s, w: s.width * k, h: s.height * k, x: gx + R() * cw, y: gy + R() * ch, o: R() });
      }
    pts.sort((a, b) => a.o - b.o);
    pts.forEach((p) => put(p.s, p.x - p.w / 2, p.y - p.h / 2, p.w, p.h));
    return cv;
  }

  /** The food in a topping's pot (its middle, below the jar's highlights), as a canvas: the layer's texture. */
  function foodOf(S, id) {
    if (potFood[id]) return potFood[id];
    // CHT-13: the item's strip, its middle (below the ragged top), is the food a spoonful is cut from
    const st = stripOf(id);
    if (st && st.width) {
      const cv = document.createElement("canvas");
      cv.width = Math.round(st.width * 0.6);
      cv.height = Math.round(st.height * 0.72);
      cv.getContext("2d").drawImage(st, st.width * 0.2, st.height * 0.2, cv.width, cv.height, 0, 0, cv.width, cv.height);
      return (potFood[id] = cv);
    }
    const key = `cv3-pot-${id}`;
    const im = S.textures.exists(key) ? S.textures.get(key).getSourceImage() : null;
    if (!im || !im.width) return null;
    const F = POT_FOOD;
    const sx = F.x0 * im.width;
    const sy = F.y0 * im.height;
    const cv = document.createElement("canvas");
    cv.width = Math.round((F.x1 - F.x0) * im.width);
    cv.height = Math.round((F.y1 - F.y0) * im.height);
    cv.getContext("2d").drawImage(im, sx, sy, cv.width, cv.height, 0, 0, cv.width, cv.height);
    return (potFood[id] = cv);
  }

  /**
   * The side-on glass bowl and its layers (v3, Q2b). Everything in the bowl's own pixels (GLASS.w x GLASS.h),
   * drawn onto one canvas texture that sits over the bowl sprite; a see-through copy of the glass lies over
   * the food, so its walls and highlights are in front of it. Each layer is a side-on strip of the food in
   * its pot, clipped to the bowl's measured INSIDE (it narrows toward the floor): its edges are the front
   * halves of its level's ellipse (flat at the rim, rounder at the floor, as the art's own rings are), the
   * line between two layers a little uneven, and its texture bent along that curve.
   */
  function glassBowl(z, S, expected = 5) {
    const k = GLASS_W / GLASS.w; // design px per bowl px
    const H = GLASS.h * k;
    const g = {
      x: z.X(GLASS_X),
      y: z.Y(GLASS_BOTTOM - H / 2),
      home: z.X(GLASS_X),
    };
    // one canvas for the layers (the last station's picture has gone by now)
    const key = "cv3-layers";
    if (S.textures.exists(key)) S.textures.remove(key);
    const tex = S.textures.createCanvas(key, Math.round(GLASS.w * RES * k), Math.round(GLASS.h * RES * k));
    const c = tex.getContext();
    // CHT-12 (P60; Zafar, 17 Oct: "the bowl has a drop shadow which doesn't make sense ... it's not floating ... let's remove
    // the drop shadow"): no shadow under the bowl (was a code ellipse under its foot)
    // CHT-14 (decision 9): the warm glow round the glass when a thing doesn't go in (amber, never red; behind the glass)
    if (!S.textures.exists("cv3-warm")) {
      const cv = document.createElement("canvas");
      cv.width = 256;
      cv.height = 128;
      const x = cv.getContext("2d");
      x.translate(128, 64);
      x.scale(128, 64);
      const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1);
      gr.addColorStop(0, "rgba(255,190,90,0.95)");
      gr.addColorStop(0.62, "rgba(255,182,72,0.7)");
      gr.addColorStop(1, "rgba(255,182,72,0)");
      x.fillStyle = gr;
      x.fillRect(-1, -1, 2, 2);
      S.textures.addCanvas("cv3-warm", cv);
    }
    const warm = S.track(S.add.image(g.x, g.y, "cv3-warm").setDisplaySize(z.L(GLASS_W * 1.25), z.L(H * 1.6)).setDepth(D.item - 0.4).setAlpha(0));
    // the glass, then the food inside it, then the glass again, see-through, over the food
    const glass = S.track(
      S.add
        .image(g.x, g.y, "cv3-bowl")
        .setDisplaySize(z.L(GLASS_W), z.L(H))
        .setDepth(D.item - 0.2),
    );
    const food = S.track(S.add.image(g.x, g.y, key).setDisplaySize(z.L(GLASS_W), z.L(H)).setDepth(D.item));
    // the see-through glass over the food: its walls and highlights, but not the floor's ring (that's
    // behind the food): the ring's ellipse is mostly cut out of the copy (the floor's measured front line,
    // back line and half-width, meta.json)
    const overKey = "cv3-bowl-over";
    if (!S.textures.exists(overKey) && S.textures.exists("cv3-bowl")) {
      const src = S.textures.get("cv3-bowl").getSourceImage();
      const cv = document.createElement("canvas");
      cv.width = src.width;
      cv.height = src.height;
      const x = cv.getContext("2d");
      x.drawImage(src, 0, 0);
      x.globalCompositeOperation = "destination-out";
      const ry = ((GLASS.floor - GLASS.floorTop) * cv.height) / 2;
      x.translate(GLASS.cx * cv.width, GLASS.floor * cv.height - ry);
      x.scale(GLASS.floorHw * cv.width * 1.04, ry * 1.1);
      const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1);
      gr.addColorStop(0, "rgba(0,0,0,0.8)");
      gr.addColorStop(0.8, "rgba(0,0,0,0.8)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = gr;
      x.fillRect(-1, -1, 2, 2);
      S.textures.addCanvas(overKey, cv);
    }
    const hi = S.track(
      S.add
        .image(g.x, g.y, S.textures.exists(overKey) ? overKey : "cv3-bowl")
        .setDisplaySize(z.L(GLASS_W), z.L(H))
        .setAlpha(0.45)
        .setDepth(D.item + 0.2),
    );
    const parts = [glass, food, hi];
    const layers = []; // {id, th (bowl px), grow, seed, wob, tex}
    const img = (id) => foodOf(S, id);
    // a full layer: thin enough that a long order (6) fills about four fifths of the glass, so three
    // layers sit in the lower half and every layer of a long order stays visible (CHT-13: with the strips, a layer of a
    // short order is as thick as four would be, so its pieces read: three layers fill three fifths)
    const full = () => ((GLASS.floor - GLASS.rim) * GLASS.h * 0.8) / Math.max(stripScene ? 4 : 6, expected);
    /** A level's surface ellipse (its front edge's lowest point is y): rounder lower in the glass. */
    const level = (y) => {
      const t = Cook.clamp((y / GLASS.h - GLASS.rim) / (GLASS.floor - GLASS.rim), 0, 1);
      const ery = GLASS.eryRim + (GLASS.eryFloor - GLASS.eryRim) * t;
      const f0 = insideAt(y / GLASS.h);
      const f = insideAt((y - ery * f0.hw * GLASS.w) / GLASS.h); // the sides sit higher, where it's wider
      return {
        cx: f.cx * GLASS.w,
        hw: f.hw * GLASS.w * 0.985,
        ry: ery * f.hw * GLASS.w,
      };
    };
    const front = (y, wob, n = 48) => {
      const L = level(y);
      return Array.from({ length: n + 1 }, (_, i) => {
        const a = Math.PI - (Math.PI * i) / n; // left to right along the front
        const x = L.cx + Math.cos(a) * L.hw;
        return { x, y: y - L.ry + Math.sin(a) * L.ry + (wob ? wob(x) : 0) };
      });
    };
    /** The uneven line where a layer lies on the one below (0 at the glass wall, where it's pressed flat). */
    const wobbleOf = (seed) => {
      const R = rng(seed * 3 + 1);
      const f1 = 0.018 + R() * 0.02;
      const f2 = 0.05 + R() * 0.05;
      const p1 = R() * 6.28;
      const p2 = R() * 6.28;
      return (x) => 4.5 * (0.65 * Math.sin(x * f1 + p1) + 0.35 * Math.sin(x * f2 + p2));
    };
    function surface(y, id, band, alpha = 1) {
      const L = level(y);
      const im = band && band.tex;
      c.save();
      c.globalAlpha = alpha;
      c.beginPath();
      c.ellipse(L.cx, y - L.ry, L.hw, L.ry, 0, 0, Math.PI * 2);
      c.clip();
      c.fillStyle = colourOf(id);
      if (!DRIZZLE[id]) c.fillRect(L.cx - L.hw, y - 2 * L.ry, 2 * L.hw, 2 * L.ry);
      if (im) {
        // the layer's own side-on strip, squashed to the surface's low angle (the tops of its pieces)
        c.drawImage(im, 0, 0, im.width, im.height, L.cx - im.width / 2, y - 2 * L.ry - L.ry * 0.1, im.width, L.ry * 2.2);
      }
      // light from the upper left, a darker back edge
      const gr = c.createLinearGradient(0, y - 2 * L.ry, 0, y);
      gr.addColorStop(0, "rgba(40,25,10,0.22)");
      gr.addColorStop(0.45, "rgba(255,255,255,0.06)");
      gr.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = gr;
      c.fillRect(L.cx - L.hw, y - 2 * L.ry, 2 * L.hw, 2 * L.ry);
      c.restore();
    }
    /** One layer seen through the glass: between its lower line (y0, wob0) and its upper line (y1, wob1). */
    function band(L, y0, wob0, y1, wob1, fullH) {
      // CHT-13: an item with its strip is that strip, one across the bowl at its own size, its top (poke) over its line
      const st = stripOf(L.id);
      const sw = st ? (GLASS.inside[0][1] - GLASS.inside[0][0]) * GLASS.w : 0;
      const sh = st ? (sw * st.height) / st.width : 0;
      const poke = st ? stripTop(L.id, st) * sh * Math.min(1, L.grow) : 0;
      const top = front(y1 - poke, wob1);
      const bot = front(y0, wob0).reverse();
      c.save();
      c.beginPath();
      top.concat(bot).forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      c.closePath();
      c.clip();
      const Lt = level(y1);
      if (st) c.drawImage(st, Lt.cx - sw / 2, y1 - poke, sw, sh);
      else {
        const h = Math.ceil(fullH + 2 * BAND_PAD);
        if (!L.tex || Math.abs(L.tex.height - h) > 3) L.tex = bandCanvas(L.id, img(L.id), h, L.seed);
        // the texture, bent along the level's curve (a column at a time), so the food follows the glass
        const x0 = Lt.cx - BAND_W / 2;
        const step = 5;
        for (let x = 0; x < BAND_W; x += step) {
          const u = Cook.clamp((x0 + x + step / 2 - Lt.cx) / Lt.hw, -1, 1);
          const ty = y1 - Lt.ry + Lt.ry * Math.sqrt(1 - u * u) - BAND_PAD;
          c.drawImage(L.tex, x, 0, step + 0.6, L.tex.height, x0 + x, ty, step + 0.6, L.tex.height);
        }
      }
      // the glass's curve: a soft shade at both sides, so the layer reads as round
      const L1 = level((y0 + y1) / 2);
      const gr = c.createLinearGradient(L1.cx - L1.hw, 0, L1.cx + L1.hw, 0);
      gr.addColorStop(0, "rgba(40,25,10,0.30)");
      gr.addColorStop(0.16, "rgba(40,25,10,0)");
      gr.addColorStop(0.82, "rgba(40,25,10,0)");
      gr.addColorStop(1, "rgba(40,25,10,0.36)");
      c.fillStyle = gr;
      // (on a strip only its food darkens: its ragged top stays clear, never a grey film over the glass)
      if (st) c.globalCompositeOperation = "source-atop";
      c.fillRect(L1.cx - L1.hw - 10, y1 - Lt.ry - 12 - poke, 2 * L1.hw + 20, y0 - y1 + Lt.ry + 24 + poke);
      c.globalCompositeOperation = "source-over";
      // a soft shadow under the layer above (a strip's own top edge carries its shadow)
      if (!st) {
        c.beginPath();
        top.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
        c.strokeStyle = "rgba(40,25,10,0.22)";
        c.lineWidth = 4;
        c.stroke();
      }
      c.restore();
    }
    function draw() {
      c.setTransform(RES * k, 0, 0, RES * k, 0, 0);
      c.clearRect(0, 0, GLASS.w, GLASS.h);
      // every layer's thickness shrinks a little if the glass would overflow
      // (a chutney with its strip is a thin layer of its own, its glossy top showing: no drizzle over the layer below)
      const drizzle = (id) => DRIZZLE[id] && !stripOf(id);
      const want = layers.reduce((a, L) => a + (drizzle(L.id) ? L.th * 0.45 : L.th), 0);
      const room = (GLASS.floor - GLASS.rim - 0.035) * GLASS.h;
      const fit = want > room ? room / want : 1;
      // the line a layer lies on: shaped by the layer that fell on it (the floor is flat)
      const wobAt = (i) => {
        const L = layers[i];
        return L ? (x) => L.wob(x) * Math.min(1, L.grow) : null;
      };
      let y = GLASS.floor * GLASS.h;
      const tops = [];
      layers.forEach((L, i) => {
        const th = L.th * fit * L.grow;
        const below = i ? wobAt(i) : null;
        const above = wobAt(i + 1);
        if (drizzle(L.id)) {
          // a chutney: drizzled over the layer below (its ribbons lie on it) and a thin layer of its own
          const own = th * 0.45;
          band(L, y + (th - own), below, y - own, above, L.th * fit);
          y -= own;
        } else {
          band(L, y, below, y - th, above, L.th * fit);
          y -= th;
        }
        tops.push({ y, id: L.id, L });
      });
      // the top: its surface (a drizzle shows the layer under it too)
      const t = tops[tops.length - 1];
      // (a strip's own top is the surface: the bowl is side-on, CHT-13)
      if (t && !stripOf(t.id)) {
        const under = tops.length > 1 && drizzle(t.id) ? tops[tops.length - 2] : null;
        if (under) surface(t.y, under.id, under.L);
        surface(t.y, t.id, t.L);
      }
      tex.refresh();
      return y;
    }
    draw();
    const bowl = {
      parts,
      get n() {
        return layers.length;
      },
      /** Where a new spoonful lands (world coords): the top surface's middle. */
      surfaceAt() {
        const y = draw();
        return {
          x: food.x - food.displayWidth / 2 + (level(y).cx * food.displayWidth) / GLASS.w,
          y: food.y - food.displayHeight / 2 + ((y - level(y).ry) * food.displayHeight) / GLASS.h,
        };
      },
      rimAt() {
        return { x: food.x, y: food.y - food.displayHeight / 2 };
      },
      /** A topping settles in: a drop and a little bounce. */
      add(id, ms = 460) {
        const seed = Math.floor(Math.random() * 1e9);
        const L = { id, th: full() * (THIN[id] || 1), grow: 0, seed, wob: wobbleOf(seed), tex: null };
        layers.push(L);
        return new Promise((resolve) =>
          S.tweens.addCounter({
            from: 0,
            to: 1,
            duration: ms,
            ease: "Back.easeOut",
            easeParams: [2.2],
            onUpdate: (tw) => {
              L.grow = Math.max(0, tw.getValue());
              draw();
            },
            onComplete: () => {
              L.grow = 1;
              draw();
              // the glass gives a tiny settle
              S.tweens.add({
                targets: parts,
                scaleY: food.scaleY * 0.985,
                duration: 90,
                yoyo: true,
              });
              resolve();
            },
          }),
        );
      },
      /** §17: the top layer comes back out (it shrinks away); returns its id. */
      async removeTop(ms = 320) {
        const L = layers[layers.length - 1];
        if (!L) return null;
        await new Promise((resolve) =>
          S.tweens.addCounter({
            from: 1,
            to: 0,
            duration: ms,
            ease: "Sine.easeIn",
            onUpdate: (tw) => {
              L.grow = tw.getValue();
              draw();
            },
            onComplete: resolve,
          }),
        );
        layers.pop();
        draw();
        return L.id;
      },
      /** The picture you tap to take the top layer back (the see-through glass over the food). */
      hit: hi,
      /** Everything out (a gentle "not quite": the glass comes back empty). */
      async empty() {
        const n = layers.length;
        if (!n) return;
        await new Promise((resolve) =>
          S.tweens.addCounter({
            from: 1,
            to: 0,
            duration: 520,
            ease: "Sine.easeIn",
            onUpdate: (tw) => {
              layers.forEach((L) => (L.grow = tw.getValue()));
              draw();
            },
            onComplete: resolve,
          }),
        );
        layers.length = 0;
        draw();
      },
      /** Slide the glass (and its shadow) to x. */
      slide(x, ms = 650) {
        return new Promise((resolve) =>
          S.tweens.add({
            targets: parts.concat(warm),
            x: `+=${x - food.x}`,
            duration: ms,
            ease: "Sine.easeInOut",
            onComplete: resolve,
          }),
        );
      },
      tilt(a, ms = 260) {
        return new Promise((resolve) =>
          S.tweens.add({
            targets: parts,
            angle: a,
            duration: ms,
            yoyo: true,
            ease: "Sine.easeInOut",
            onComplete: resolve,
          }),
        );
      },
      /** CHT-14 (decision 9): "not that one": the glass wobbles with a warm glow round it (amber, never red), about 0.6 s. */
      async notIn() {
        S.tweens.add({ targets: warm, alpha: { from: 0, to: 0.55 }, duration: 160, hold: 300, yoyo: true, ease: "Sine.easeOut" });
        await bowl.tilt(-2.5, 90);
        await bowl.tilt(2.5, 90);
        await bowl.tilt(-1.2, 70);
      },
    };
    return bowl;
  }

  /** The shared order card's dish ladder (for the recast and the rebuild). */
  const ladderOf = (ctx) => {
    const Ls = UI.mission.ladders() || [];
    return Ls[ctx.dishAt || 0] || Ls[0] || null;
  };
  const orderLine = (L) => {
    if (!L) return null;
    // 29 Sept (X1): one sentence, in card order (Cook.Order.speech)
    return Cook.Order.speech([L]);
  };

  /**
   * Level 4 (§14a): the person's card starts folded (face + headline); a tap on it opens it for a
   * moment, and that peek costs a hint (the shared order card's closed mode: UI.mission.closeCards).
   */
  function foldCard(on) {
    if (!on || !UI.mission.closeCards) return () => {};
    UI.mission.closeCards(true, { peek: true });
    return () => UI.mission.closeCards(false);
  }

  /* (chaat's own ghost finger went: CHT-18, SH-119, Zafar 8 Nov: its first time is the kitchen kit's coach, the dim and the lit box on
     each next thing, data/cook.json onboard.assemble; one finger in every game, the kit's) */

  Mech.define("assemble", {
    station: "assemble",
    view: "marble",
    // level 4 (§14a): his card starts folded, before the begin's pop-up (the closed big card there)
    closedFrom: 4,
    async run(z, { sequence: seq0, exclude = [], pool, decoyPool, qty = null }, k0) {
      const S = z.S;
      const ctx = z.ctx;
      const guided = !!ctx.guided;
      const level = Math.max(z.level || 1, Cook.roundLevel(ctx));
      // the game's settings (data/stations/chaat.json), once; its level's row over the mechanic's knobs (data.mechanics.assemble)
      await settings();
      const k = Object.assign({}, k0, levelSet(level));
      const M = MOTION;
      // CHT-06 (T3, T7): the checker counts quantities: "ba bataato" is two spoons of potato, one after the other
      // (qty: {id: n}, the same slots as the chop's), so one potato for two is wrong
      const sequence = (seq0 || []).map((e) => (!Array.isArray(e) && qty && Number(qty[e]) > 1 ? Array(Number(qty[e])).fill(e) : e));
      const flat = sequence.flat();
      const C = checker(sequence);
      const redo = St.redo(ctx);
      const steps = St.steps(ctx);
      let help = false; // decision 51: the second try has help (the next layer glows)
      const dishNo = () => ctx.dishAt || 0;
      // the kitchen kit's first-time gate (kit d, STD-D1-01; was chaat's own save key): the demo and the reveal lessons spend on it
      // (made before the coach stops: its stop marks the station's coach seen, which would leave the gate stale on the first bowl)
      const gate = Cook.Coach && Cook.Coach.firsts ? Cook.Coach.firsts("assemble", { round: new Set() }) : null;
      // CHT-18 (Zafar, 8 Nov: "there's no dark shadows or anything like that highlight box"): the kitchen kit's coach shows the first
      // bowl (St.begin started it: data/cook.json onboard.assemble, each next topping in the dim and the lit box); its own demo went
      // CK-49 (the level table): 1, 2, 3, 3 decoys (the knob), a lookalike among them at L4; the 'no' row's topping is on the
      // shelf too and counts as one (it is an ordinary decoy, never the odd one out)
      // (the S14 roll-out, CHT-17: 1, 2, 3, 4 by the central rules, Cook.levelRow on Rules.level; was the mechanic's own 1, 2, 3, 3)
      if (!pool) pool = St.tableDecoys(decoyPool, flat.concat(exclude), level, { want: flat, n: Math.max(0, Cook.levelRow(level).decoys - exclude.length), also: exclude.length, what: "toppings" });
      else St.decoyNote(pool.filter((x) => !flat.includes(x)).length, { what: "toppings" });
      const ids = Cook.shuffle([...new Set(pool.concat(flat, exclude))]);
      const who = (ctx.order && ctx.order.who) || "nana";
      useBowlArt();
      // real-time cap (St.loadArt), never Cook.wait: at test speed a game-time cap shrank and the art missed it
      await St.loadArt(
        S,
        [["cv3-bowl", bowlUrl]].concat(
          Cook.Kit ? Cook.Kit.faceArt(who) : [],
          ids.filter((id) => POTS[id]).map((id) => [`cv3-pot-${id}`, `${V3}${POTS[id]}.webp`]),
          // CHT-13: each thing on the shelf's strip (any of them may go in), only these
          ids.filter((id) => STRIPS[id]).map((id) => [stripKey(id), `${STRIP_DIR}${STRIPS[id]}.webp`]),
        ),
      );
      stripScene = S;
      // (a spoonful's picture is cut from the strip now: an older round's pot-photo spoonful goes)
      ids.forEach((id) => {
        delete potFood[id];
        if (S.textures.exists(`cv3-bit-${id}`)) S.textures.remove(`cv3-bit-${id}`);
      });

      /* ---------- the scene: the kitchen kit's worktop wash and stone band (kit a, as chai's; was chaat's own fill and band) ---------- */
      Cook.Kit.worktop(S, { top: z.Y(SHELF_TOP) });
      // (SH-248: the bottom element is the game's settings' band, data/stations/chaat.json "shelf": the pots stand side-on on it)
      St.stoneBand(S, { top: z.Y(SHELF_TOP), base: z.Y(BASE), depth: D.bg + 1.2, band: SET.band });

      /* ---------- the glass ---------- */
      // raised into the middle of a taller stage's worktop (the stage fill)
      const bowl = glassBowl(Cook.liftZone(z), S, flat.length);

      /* ---------- the shelf: identical side-on pots (the pantry jars' look), the shared kit's word pill under each ---------- */
      // Zafar, 20 Oct (replacing s08 w6M's speaker alone at every level): a pot's word is written until the child has used
      // it right, then the speaker alone from the next round (Cook.chipWord); the glass pot shows its food (the picture label)
      // (the shared kit's shelf, pieces 9-10, js/shared/shelf.js: Shelf.P.chip the pill, Shelf.slots the row, Shelf.pillWant and
      // .pillScale the pills' size: at least the floor on screen, never touching; was chaat's own chip, speaker and 14 px wrap)
      const Shelf = global.Shelf;
      const PL = Shelf.PILL;
      const wts = (() => {
        try {
          return UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1;
        } catch (e) {
          return 1;
        }
      })();
      const ppw = wts * z.k; // CSS px per design px of the shelf
      const gap = Shelf.pillGap(ppw);
      const want = Shelf.pillWant(ppw);
      const chips = {};
      ids.forEach((id) => {
        chips[id] = Shelf.P.chip(S, 0, 0, Cook.display(id), {
          word: !!Cook.chipWord(id, ctx),
          depth: D.item + 2,
          onTap: () => {
            Cook.unlockAudio();
            if (Cook.onLabel) Cook.onLabel(id);
            Lang.speakWord(id);
          },
        });
        chips[id].pillId = id;
      });
      const pillRoom = Shelf.pillRoom(ids.map((id) => chips[id].faceW(chips[id].showsWord)), want, gap);
      const lay = Shelf.slots([ids], { span: SPAN, view: SPAN, pitch: PITCH, groupGap: 0, pillRoom });
      const items = {};
      ids.forEach((id) => (items[id] = slot(id, lay.x[id], Math.min(PREP_W, lay.slotW - 22))));
      fitPills();
      /*
       * The pills' one scale for the row (SH-219: as large as the floor asks, as far as each neighbouring pair allows without touching).
       * CHT-17 (Zafar, 30 Oct: "for chaat L4, only show 'speaker buttons only' if space is an issue, otherwise follow usual rules"): a
       * word that would have to narrow to fit its room shows its speaker alone, and the row is measured again.
       */
      function fitPills() {
        const row = () => ids.map((id) => ({ x: lay.x[id], w: chips[id].faceW(chips[id].showsWord) }));
        let fit = Shelf.pillScale(row(), { want, gap, slotW: lay.slotW });
        const narrow = ids.filter((id) => chips[id].showsWord && chips[id].faceW(true) > fit.cap);
        if (narrow.length) {
          narrow.forEach((id) => chips[id].face(false, Infinity));
          fit = Shelf.pillScale(row(), { want, gap, slotW: lay.slotW });
        }
        const y = Math.min(CHIP_Y, 896 - (PL.h / 2) * fit.k);
        ids.forEach((id) => {
          const c = chips[id];
          c.k = fit.k;
          c.setPosition(z.X(lay.x[id]), z.Y(y)).setScale(z.k * fit.k);
          c.hit(lay.slotW);
        });
      }
      // (the pills' measure, read only: each shelf pill on screen in CSS px, as chai's: its card, whether it shows the word)
      Cook.chaatPills = () =>
        ids
          .map((id) => chips[id])
          .filter((c) => c && c.active)
          .map((c) => {
            const sc = Math.abs(c.scaleX || 1);
            const a = UI.worldToScreen(c.x - (c.cardW * sc) / 2, c.y - (PL.h * sc) / 2);
            const b = UI.worldToScreen(c.x + (c.cardW * sc) / 2, c.y + (PL.h * sc) / 2);
            return { id: c.pillId, word: !!c.showsWord, left: a.x, right: b.x, top: a.y, bottom: b.y };
          })
          .sort((p, q) => p.left - q.left);
      function slot(id, x, w) {
        const key = `cv3-pot-${id}`;
        let img;
        if (S.textures.exists(key)) {
          const sc = z.L(St.shelfFit(S, key, w / POT.w, BASE));
          img = S.track(
            S.add
              .image(z.X(x), z.Y(BASE), key)
              .setOrigin(POT.anchor[0], POT.anchor[1])
              .setScale(sc)
              .setDepth(D.item + 1),
          );
          img.baseScale = sc;
          img.shadow = S.contactShadow(img, {
            centerX: z.X(x),
            centerY: z.Y(BASE - 3),
            width: z.L(w * 0.72),
            height: z.L(16),
          });
        } else
          img = S.ingredient(id, z.X(x), z.Y(BASE - 56), {
            w: z.L(118),
            h: z.L(100),
            label: false,
            depth: D.item + 1,
          });
        img.wordId = id;
        img.home = { x: img.x, y: img.y };
        img.chip = chips[id];
        return img;
      }

      /* ---------- the word pop (§4): by the glass, with the family clip (the shared kit's, Juice.P.pop: piece 12) ---------- */
      const pop = (id, x, y) => {
        // never under 14px as rendered (the kitchen kit's floor: the canvas is shown smaller than its game size on a phone)
        global.Juice.P.pop(S, { x, y }, Cook.display(id), { k: Math.max(z.k, Cook.Kit.textFloor(S, 36)), depth: D.fx + 3, top: (Cook.view || {}).top || 0 });
        if (UI.naniMuted && UI.naniMuted()) return Promise.resolve();
        // a clip that never ends (no audio on this device) never holds the station up
        const talk = Lang.popWord(id);
        return talk ? Promise.race([talk.catch(() => {}), Cook.wait(M.popCapMs)]) : Promise.resolve();
      };

      /* ---------- a topping goes in: it lifts off the shelf, drops into the glass and settles ---------- */
      const got = [];
      const ticked = []; // the card row each layer ticked (null: none), to untick it if it's taken back
      let busy = 0;
      let building = false; // the bowl takes a layer back only while you're building (§17)
      let firstWrong = null;
      /** The first mistake is what's scored (the accuracy badge, the end review), whenever it's found. */
      const firstMiss = (m) => {
        if (firstWrong) return;
        const wrong = m.got;
        let why;
        if (wrong && exclude.includes(wrong)) why = `added ${wrong} (they said no)`;
        else if (wrong && m.expected) why = `${wrong} instead of ${m.expected}`;
        else if (wrong) why = `added ${wrong} at the end`;
        else why = `forgot ${m.expected}`;
        firstWrong = why;
        z.listen(false, why);
        if (m.expected) Cook.markMiss(m.expected);
        if (wrong && exclude.includes(wrong)) UI.mission.missItem(wrong, dishNo(), { no: true });
        else if (m.expected) UI.mission.missItem(m.expected, dishNo(), { did: wrong || null });
      };
      /**
       * §17 (29 Sept): tap the bowl to take the top layer back, until Done. It shrinks out of the bowl and a
       * spoonful flies back to its pot; its card row goes back to "to do". A layer that was wrong when it went
       * in still counts as the first mistake (the first placement is what's scored).
       */
      // where a tap takes the top layer back, while one can be (the test hook's `undo`: E14)
      Cook.undoAt = () => (building && !busy && got.length && bowl.hit && bowl.hit.active ? S.centre(bowl.hit) : null);
      async function takeBack() {
        if (!building || busy || !got.length) return;
        moves++;
        busy++;
        const at = got.length - 1;
        const id = got[at];
        const m = C.mistake(got);
        if (m && m.at === at && m.got !== undefined) firstMiss(m);
        Cook.sfx.pop();
        const p = bowl.surfaceAt();
        await bowl.removeTop();
        got.pop();
        const r = ticked.pop();
        const L = ladderOf(ctx);
        if (r) {
          r.got = Math.max(0, (r.got || 1) - 1);
          r.done = false;
        }
        const s = L && L.sections.find((x) => x.seq && !x.cardOf);
        if (s && s.at) s.at--;
        UI.mission.refresh();
        const obj = items[id];
        if (obj && S.textures.exists(`cv3-bit-${id}`)) {
          const spoon = S.track(S.add.image(p.x, p.y, `cv3-bit-${id}`).setDepth(D.fx).setDisplaySize(z.L(M.spoonW), z.L(M.spoonW * 0.62)));
          await S.fly(spoon, obj.x, obj.y - obj.displayHeight * 0.5, { duration: M.backMs, arc: z.L(70) });
          spoon.destroy();
        }
        // what the order wants next has changed (the guided glow, and the test's expectation)
        if (building) {
          const want = C.next(got);
          Object.entries(items).forEach(([k2, o]) => o && o.active && ctx.guided && S.glow(o, k2 === want));
          if (want && items[want]) {
            const c = S.centre(items[want]);
            const wrongs = Object.keys(items)
              .filter((k2) => k2 !== want && items[k2] && items[k2].active)
              .map((k2) => S.centre(items[k2]));
            z.expect({ kind: "tap", x: c.x, y: c.y, key: want, wrongs });
          }
        }
        busy--;
      }
      S.tappable(bowl.hit, () => takeBack());
      /** A spoonful of it lifts off the shelf, over the rim and down into the glass; resolves at the food's surface. */
      async function spoonIn(id) {
        const obj = items[id];
        Cook.sfx.pop();
        S.tweens.add({
          targets: obj,
          scale: obj.baseScale ? obj.baseScale * 1.08 : obj.scale * 1.08,
          duration: 90,
          yoyo: true,
        });
        // a spoonful: a soft-edged lump of the food in its pot (side-on, like the pot)
        const bitKey = `cv3-bit-${id}`;
        const fd = foodOf(S, id);
        if (fd && !S.textures.exists(bitKey)) {
          const s = Math.min(fd.width, fd.height) * 0.7;
          const cv = document.createElement("canvas");
          cv.width = Math.round(s);
          cv.height = Math.round(s * 0.62);
          const x = cv.getContext("2d");
          x.drawImage(fd, (fd.width - s) / 2, (fd.height - s * 0.62) / 2, s, s * 0.62, 0, 0, cv.width, cv.height);
          x.globalCompositeOperation = "destination-in";
          x.translate(cv.width / 2, cv.height / 2);
          x.scale(cv.width / 2, cv.height / 2);
          const gr = x.createRadialGradient(0, 0, 0, 0, 0, 1);
          gr.addColorStop(0, "#000");
          gr.addColorStop(0.7, "#000");
          gr.addColorStop(1, "rgba(0,0,0,0)");
          x.fillStyle = gr;
          x.fillRect(-1, -1, 2, 2);
          S.textures.addCanvas(bitKey, cv);
        }
        const spoon = S.textures.exists(bitKey)
          ? S.track(
              S.add
                .image(obj.x, obj.y - obj.displayHeight * 0.7, bitKey)
                .setDepth(D.fx)
                .setDisplaySize(z.L(M.spoonW), z.L(M.spoonW * 0.62)),
            )
          : S.track(
              S.add
                .image(obj.x, obj.y - z.L(60), S.tex(`layer:${id}`))
                .setDepth(D.fx)
                .setScale(0.25 * z.k),
            );
        const rim = bowl.rimAt();
        // up and over the rim, then down into the glass
        await S.fly(spoon, rim.x + (Math.random() - 0.5) * z.L(24), rim.y - z.L(70), { duration: k.flyMs, arc: z.L(90) });
        const p = bowl.surfaceAt();
        await new Promise((r) =>
          S.tweens.add({
            targets: spoon,
            y: p.y,
            scaleY: spoon.scaleY * 0.7,
            duration: M.dropMs,
            ease: "Quad.easeIn",
            onComplete: r,
          }),
        );
        spoon.destroy();
        return p;
      }
      async function drop(id) {
        busy++;
        const p = await spoonIn(id);
        got.push(id);
        // the pill ticks now (UX 11: its step has closed; decision 9: only a right thing goes in, CHT-14)
        ticked.push(UI.mission.tickItem(id, dishNo()));
        if (UI.mission.advance) UI.mission.advance(dishNo());
        S.puff(p.x, p.y, St.color(((Cook.item(id) || {}).layer || {}).color || "#ffffff"), z.L(34), { flat: 0.3 }); // (side-on: a flat ring)
        const settle = bowl.add(id);
        const r = bowl.rimAt();
        pop(id, r.x + z.L(GLASS_W * 0.36), r.y - z.L(58));
        await settle;
        z.progress({ layer: id, n: got.length });
        busy--;
        if (!demo) cardLight(); // (the first layer the child puts in: the demo has already shown the card)
      }
      /*
       * STD-D1-07 (the kitchen kit's card light, Cook.Coach.cardLight, kit d): after the first layer, the next layer's card on his order
       * card is glided whole into view and lit for a moment once the kitchen is still, once for a new player (the gate's "card"),
       * spent only when it is up; it gives up once the child has moved on (a tap in or a take-back). Not at L4 (his card is folded).
       */
      let demo = false; // the first-time demo is putting the first layer in
      let moves = 0; // every topping tapped in or taken back
      let cardWait = false;
      function cardLight() {
        const nx = C.next(got);
        if (!gate || !gate.fresh || gate.spent("card") || cardWait || !nx || !building || level >= 4 || !Cook.Coach.cardLight) return;
        cardWait = true;
        const m0 = moves;
        const on = () => moves !== m0;
        Cook.Coach.cardLight({
          item: () => Cook.Coach.itemCard(nx, who),
          quitIf: () => on() || !building,
          busy: () => busy > 0,
          endIf: () => busy > 0 || on(),
          step: "assemble:next",
          note: "assemble:light",
          onLit: () => {
            gate.spend("card");
            cardWait = false;
          },
        }).then((lit) => !lit && (cardWait = false));
      }
      /** A spoonful flies from the glass (world point p) back to its pot on the shelf. */
      async function spoonBack(id, p) {
        const obj = items[id];
        if (!obj || !S.textures.exists(`cv3-bit-${id}`)) return;
        const spoon = S.track(S.add.image(p.x, p.y, `cv3-bit-${id}`).setDepth(D.fx).setDisplaySize(z.L(M.spoonW), z.L(M.spoonW * 0.62)));
        await S.fly(spoon, obj.x, obj.y - obj.displayHeight * 0.5, { duration: M.backMs, arc: z.L(70) });
        spoon.destroy();
      }
      /*
       * CHT-14, CHT-15 (decision 9, softened for rule 12): a wrong thing goes in, a short pause, the glass wobbles with a warm
       * glow (never red) and it comes back out to its pot, one from later in the order too (Zafar, 21 Oct: the right ones
       * stay in the bowl and stay ticked). Nothing is said. The rows it costs lose their tick (judgeDrop, rowsMissed); the
       * card ticks nothing for it, so the bowl, not a missing tick, is what tells the child.
       */
      const missedIds = new Set();
      const markedAt = new Set();
      async function notIn(id, j) {
        busy++;
        const why = exclude.includes(id) ? `added ${id} (they said no)` : j.expected ? `${id} instead of ${j.expected}` : `added ${id} at the end`;
        if (!firstWrong) firstWrong = why;
        z.listen(false, why);
        // (the kitchen kit's wrong move, kit d: every hint waiting on its clock comes at once, STD-D2-04)
        if (Cook.Coach && Cook.Coach.wrong) Cook.Coach.wrong("chaat-drop");
        rowsMissed(j, id, exclude).forEach((x) => {
          if (!x.no) missedIds.add(x.id);
          UI.mission.missItem(x.id, dishNo(), { no: x.no, did: x.no ? null : id });
        });
        if (j.expected && !markedAt.has(got.length)) {
          markedAt.add(got.length);
          Cook.markMiss(j.expected);
        }
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("chaat-drop", { step: j.verdict, by: id }); // (a test log)
        const p = await spoonIn(id);
        await bowl.add(id, M.notInMs);
        await Cook.wait(M.notInPauseMs); // the little pause ("maybe there's a tiny little pause, and then the bowl shakes")
        if (Cook.sfx.soft) Cook.sfx.soft();
        await bowl.notIn();
        // CHT-14 (Zafar, 21 Oct): only the wrong one comes back out, whatever it was (not wanted, or wanted later); the
        // right ones stay in the bowl and stay ticked
        await bowl.removeTop(M.outMs);
        await spoonBack(id, p);
        z.progress({ wrong: id, verdict: j.verdict, n: got.length });
        busy--;
      }

      /* ---------- level 4: the card starts folded ---------- */
      if (ctx.intro) await ctx.intro;
      /*
       * CHT-07 (decision 53, T15): each instruction just before the game that needs it. The layer order waited on
       * his card (data: the list's `when: "assemble"`). S04-B (CHT-10, Z2; decision 75 (1)): it comes up in the shared
       * request pop-up, read out, at every level (L4 too: his card then folds closed), never said with no card (the
       * station's begin has usually opened it already; then there's nothing new here)
       */
      z.expect({ kind: "wait" });
      await UI.mission.request("assemble");
      // STD-D1-08 (SH-196): the reveal lessons, the dotted word then the blurred picture, once the order has landed and before the
      // first layer (the kitchen kit's Cook.Coach.lessons, kit d, as chai, chop and daar have them); before L4's card folds, so its
      // dotted word is still in view
      if (gate && Cook.Coach.lessons) await Cook.Coach.lessons({ gate, ctx, busy: () => busy > 0 });
      const unfold = foldCard(level >= 4);

      let tries = 0;
      try {
        /* ---------- the review (X10 / Q1): their big round face over the glass, no body (the kitchen kit's, Cook.Kit.review) ---------- */
        const review = (ok) => {
          const r = bowl.rimAt();
          return Cook.Kit.review(S, { who, ok, x: r.x, y: r.y - z.L(120), size: z.L(250), k: z.L(1), side: "right" });
        };

        /* ---------- build: each topping tapped in, until the bowl is complete and right (it goes by itself) or Done ---------- */
        const build = async () => {
          let last = 0;
          building = true;
          for (;;) {
            // T15, s08 w2A (SH-110): Nani calls the next layer as its step opens ("Bataato wiji chad!"), at every level (the
            // order in pieces); her box shows it only after the pause (help), its item dotted where the card dots it
            const nx = C.next(got);
            if (nx) steps.to("assemble:next", { id: `layer-${got.length}-${nx}`, line: St.addLine(nx) });
            else steps.done();
            const r = await St.freePick(z, {
              items,
              next: C.next(got),
              // SH-238: the bowl moves on by itself once its layers are in (no ✓)
              doneOk: got.length >= C.total,
              help,
            });
            if (r.done) break;
            moves++;
            if (performance.now() - last < M.doubleTapMs) continue; // a double tap
            last = performance.now();
            z.expect({ kind: "wait" });
            // CHT-14 (decision 9): judged as it goes in: right stays, wrong comes back out
            const j = judgeDrop(C, got, r.id);
            if (j.verdict === "in") await drop(r.id);
            else await notIn(r.id, j);
            // SH-105 (decision 6, P26: "it's clear and obvious when you've got the final correct answer ... remove the tick, move
            // on"): the bowl is complete and right, so nothing is left to choose: it goes to the customer by itself
            if (got.length >= C.total) break;
          }
          building = false;
          steps.done();
          while (busy) await Cook.wait(60);
          z.expect({ kind: "wait" });
          tries++;
          // serve: their face comes up over the glass (no pretend eating)
          await Cook.wait(250);
        };

        /*
         * ---------- serve, taste, and build again if it's not right: the shared kit's tick and recast (NjgServe.round, piece 8) ----------
         * decision 51, CHT-08: right, a happy face and the family's praise; not quite, a gentle face, only the wrong layer comes back out
         * (with any above it: a layer can't come out from under another), the right ones below stay, and the customer says just those
         * rows again ON HIS OWN CARD (L4 from memory: said, not written); the second try has help (the next layer glows); the third
         * wrong try shows the right way (each layer glows and goes in). Only the first mistake counts. (Was chaat's own loop.)
         */
        let miss = null;
        await NjgServe.round({
          items: ["bowl"],
          done: build,
          check: () => {
            miss = C.mistake(got);
            if (miss) firstMiss(miss);
            return { ok: !miss };
          },
          onRight: () => {
            if (exclude.length) UI.mission.closeItem(exclude, dishNo());
            // CHT-15 (P63): each thing put in right on its first go is a right (its tick); a wrong try marked its miss already
            if (!guided && tries === 1) [...new Set(flat)].forEach((id) => !missedIds.has(id) && Cook.markRight(id));
          },
          review: async (wrong) => {
            const look = await review(!wrong.length);
            // a moment to enjoy it before the end of the station
            if (!wrong.length) await Cook.wait(M.rightHoldMs);
            return [look];
          },
          recast: async () => {
            const keep = miss.got === undefined ? got.length : miss.at;
            const back = [];
            while (got.length > keep) {
              await bowl.removeTop();
              got.pop();
              const r = ticked.pop();
              if (r) {
                r.got = Math.max(0, (r.got || 1) - 1);
                r.done = false;
                if (!back.includes(r)) back.push(r);
              }
            }
            const L = ladderOf(ctx);
            const sq = L && L.sections.find((x) => x.seq && !x.cardOf);
            if (sq && sq.at) sq.at = Math.max(0, sq.at - back.length);
            UI.mission.refresh();
            // the rows still to do (the redone ones and anything after them), said again from his card (the kitchen kit's people say
            // their orders, UI.personSay: kit e); level 4 is from memory: they say it again, but it isn't written out (the card stays folded)
            const todo = L ? Cook.Order.rows(L, { all: true }).filter((r) => !r.head && !r.no && !r.done) : [];
            const line = () => orderLine(ladderOf(ctx));
            if (level < 4) await Promise.race([UI.personSay(who, { rows: todo.length ? todo : null, line, hide: St.hideKnown(ctx) }).catch(() => {}), Cook.wait(M.recastCapMs)]);
            else if (line()) await Promise.race([Lang.speak(line()).catch(() => {}), Cook.wait(M.recastCapMs)]);
          },
          redo,
          key: () => `chaat:${miss.at}`,
          showRight: async () => {
            // the right way, shown: each layer still to go glows on the shelf and goes in, in order
            for (let nx = C.next(got); nx && items[nx]; nx = C.next(got)) {
              S.glow(items[nx], true, { bounce: true });
              await Cook.wait(M.showGlowMs);
              S.glow(items[nx], false);
              await drop(nx);
            }
            while (busy) await Cook.wait(60);
            if (exclude.length) UI.mission.closeItem(exclude, dishNo());
            const look = await review(true);
            await Cook.wait(M.showHoldMs);
            await look.close();
          },
          reset: () => (help = true),
        });
      } finally {
        unfold();
      }
      ctx.result.layers = got.slice();
      z.skill(tries === 1 && !firstWrong ? 100 : Math.max(55, 100 - 20 * Math.max(1, tries - 1)), "assemble");
      await Cook.wait(M.endMs);
      return got;
    },
  });

  // the settings come with the code (it loads at the greeting with the dish's other stations, Mech.needRecipe), never on a bare bowl
  if (global.document) settings().catch(() => {});

  Mech.lab("assemble", {
    name: "Chaat bowl",
    verb: "Assemble",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.chaat.make(L.ctx.order.who || "nana", { level: L.level });
      L.card(d, ["Build"]);
      await L.station("assemble", {
        sequence: d.seq,
        exclude: d.no,
        decoyPool: Cook.data.recipes.chaat.lists.toppings,
        qty: { "veg-01": d.potatoes, "veg-02": d.onions, "veg-03": d.tomatoes },
      });
    },
  });
})(window);
