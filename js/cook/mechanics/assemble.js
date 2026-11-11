/*
 * Mechanic: assemble, the chaat station (v2: docs/design-language/ui-design-system.md §14 + §14a; the chai v2 grid and slots, §3, §4,
 * §10). Toppings go into the serving bowl in the order the person said.
 *
 * TOP-DOWN (CHT-13; Zafar, 9 Nov: "I think maybe we go top down for chaat ... Opaque bowl looks better than the glass bowl"; the
 * design: docs/game-design/modes/cook-bottom-row.md, chaat "tray"; the layering: build/reports/s19-fable-mock-answers.md §4):
 *  - THE BOWL (in the scene above the tray): the opaque cream serving bowl seen straight down (the settings' bowl.file). Each topping
 *    is one transparent picture on the bowl's one canvas, drawn in the order added (the settings' layers: the C5-C11 tops, the
 *    chutneys as their drizzles); the base (potato, chickpeas) and sev are their F3 bowl's food, stamped: the first thing in the bowl
 *    covers its floor, anything after it lies in loose heaps, so what is beneath shows at the edges. Each new layer grows in from
 *    where its spoonful landed over the settings' fillMs (about 0.9 s), never a snap; its word pops beside the bowl with the family
 *    clip (§4: learning happens during the action).
 *  - THE TRAY (the bottom 30%): the kit's stone tray (St.stoneBand, game "chaat": band "tray"), the F3 cream bowls lying on it from
 *    above, the shared kit's word pill under each: tap the bowl = use it, tap the pill = hear it. The word is written until the child
 *    has used it right, then the speaker alone from the next round (Cook.chipWord; Zafar, 20 Oct). Decoys and the "don't" item lie
 *    there too.
 *  - TAKE IT BACK (UX §17): until Done, a tap on the bowl lifts the top layer back out to its bowl on the tray.
 *  - NO TALLY at this station (§14a): the bowl shows what's in.
 * The card (the shared order card, §12): each layer ticks its row as it goes in (UX 11, right or not);
 * at levels 1-2 a chopped layer's row writes how many (T1, Q7: "ba bataato"). The order is judged when
 * you serve.
 * THE REVIEW (29 Sept, X10 / Q1, T5: Cook.Kit.review): Done -> their big round face comes up beside the bowl (no body, no pretend
 * eating), the bowl in sight (the kit's praiseSpot, as corn's and maani's).
 *  - right: a happy face and the family's praise clip (Shabash!), said in Nani's box;
 *  - wrong: a gentle frown, they say their order again, the wrong layers come back out and you
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
 * the bowl's place and size, the layers' pictures, the tray's row, the motions' times, flyMs by level) plus its own mechanic, the
 * bowl (the checker, the layers, the spoon in and out, the wobble, the take-back). Everything else is a kit call:
 * the worktop and stone tray (Cook.Kit.worktop, St.stoneBand), the word pills and the row (Shelf.P.chip, Shelf.slots,
 * Shelf.pillWant, Shelf.pillScale), the word pop (Juice.P.pop), the first-time gate, the reveal lessons and a wrong move's hint
 * (Cook.Coach.firsts, .lessons, .wrong), the review face and its place (Cook.Kit.review, .praiseSpot), the tick and the recast
 * (NjgServe.round), the person saying their rows again (UI.personSay). The test hooks: Cook.undoAt, Cook.chaatPills, the
 * "chaat-drop" note.
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


  /* ---------- the chaat bowl from above (CHT-13; Zafar, 9 Nov: top-down, the opaque cream bowl, the bowls on the tray) ---------- */
  /*
   * Sprint 18 (s18-g-chaat; the sprint's "Coded well" rule 1): the game's own numbers are its settings file, data/stations/chaat.json
   * (read once, before the first bowl; set() below), never constants here: the serving bowl's picture, place and size and where its
   * food lies, each topping's bowl on the tray and its layer picture, the tray's row, the motions' times and what changes by level. The
   * word pills, the worktop, the stone tray and the word pop are the kits' (js/shared/shelf.js, js/cook/kitchen-kit.js, js/shared/juice.js).
   */
  const FILE = "data/stations/chaat.json";
  let SET = null;
  let loading = null;
  let BOWL, TRAY, BOWLS, LAYERS, HEAP, MOTION;
  const SHELF_TOP = St.SHELF.top; // §3: the scene is the top 70%, the tray the bottom 30% (SH-112)
  function set(s) {
    SET = s;
    BOWL = s.bowl;
    TRAY = s.tray;
    BOWLS = s.bowls;
    LAYERS = s.layers;
    HEAP = s.heap;
    MOTION = s.motion;
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

  // the textures: the serving bowl, each topping's bowl on the tray (F3), each topping's layer picture (C5-C11, the drizzles)
  const bowlKey = (id) => `ct-bowl-${id}`;
  const layerKey = (id) => `ct-layer-${id}`;
  let scene = null; // the scene whose pictures are loaded (set by the station)
  const pic = (key) => (scene && scene.textures.exists(key) ? scene.textures.get(key).getSourceImage() : null);

  /** A small seeded random (a layer keeps its own look while it grows in and if it is drawn again). */
  function rng(seed) {
    let t = seed >>> 0;
    return () => {
      t = (t + 0x6d2b79f5) >>> 0;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  /** A canvas cut round as a soft-edged disc: `im`'s circle (cx, cy, r, fractions of its width and height), opaque to `solid` of r. */
  function disc(im, cx, cy, r, solid) {
    const R = r * im.width;
    const s = Math.max(4, Math.ceil(2 * R));
    const cv = document.createElement("canvas");
    cv.width = s;
    cv.height = s;
    const x = cv.getContext("2d");
    x.drawImage(im, cx * im.width - R, cy * im.height - R, 2 * R, 2 * R, 0, 0, s, s);
    x.globalCompositeOperation = "destination-in";
    const gr = x.createRadialGradient(s / 2, s / 2, (s / 2) * solid, s / 2, s / 2, s / 2);
    gr.addColorStop(0, "#000");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr;
    x.fillRect(0, 0, s, s);
    return cv;
  }
  /**
   * The food in a topping's tray bowl, as a soft-edged disc: what the base and sev are stamped from. frac 1: all of it (its edge
   * opaque to HEAP.solid); a smaller share: a heap's worth, cut from anywhere in it (variant v), its edge softer (HEAP.heapSolid).
   */
  const FOOD = {};
  function foodOf(id, frac = 1, v = 0) {
    const key = `${id}:${frac}:${v}`;
    if (FOOD[key]) return FOOD[key];
    const im = pic(bowlKey(id));
    if (!im || !im.width) return null;
    const R = rng(v * 7919 + 13);
    const off = BOWLS.food * (1 - frac);
    const a = R() * Math.PI * 2;
    const rr = Math.sqrt(R()) * off;
    const cx = BOWLS.cx + Math.cos(a) * rr;
    const cy = BOWLS.cy + (Math.sin(a) * rr * im.width) / im.height;
    return (FOOD[key] = disc(im, cx, cy, BOWLS.food * frac, frac < 1 ? HEAP.heapSolid : HEAP.solid));
  }
  /** A spoonful of it (the middle of its tray bowl's food), a texture key, or null. */
  function spoonKey(S, id) {
    const key = `ct-bit-${id}`;
    if (S.textures.exists(key)) return key;
    const im = pic(bowlKey(id));
    if (!im || !im.width) return null;
    S.textures.addCanvas(key, disc(im, BOWLS.cx, BOWLS.cy, BOWLS.spoon, 0.6));
    return key;
  }

  /**
   * The serving bowl seen from above (CHT-13) and its layers. Everything in the bowl's food sits on one canvas the bowl's size (the
   * bowl's registered canvas, Fable's §4): each layer is its own transparent picture, made once as it goes in, and the canvas draws them
   * in the order added. A topping with a layer picture (the settings' layers) is that picture, turned and placed a little differently
   * each time (a layer said twice never looks twice the same), a soft shadow under its pieces; a topping without one (the base, sev)
   * is its tray bowl's food stamped: the first thing in the bowl covers the floor, anything after it lies in a few loose heaps, so the
   * layer beneath shows between and at the edges. A layer grows in from where its spoonful landed (alpha and size together).
   * z: the lifted zone (the scene's); returns the bowl's handle.
   */
  function serveBowl(z, S) {
    const B = BOWL;
    const src = pic("ct-serve");
    const d = z.L(B.d); // the bowl's drawn width, world px
    const h = src ? (d * src.height) / src.width : d;
    const x = z.X(B.x);
    const y = z.Y(B.y);
    // the food's circle: its centre (the opening's, measured on the picture) and radius, world px
    const fx = x + (B.cx - 0.5) * d;
    const fy = y + (B.cy - 0.5) * h;
    const R = (d / 2) * B.food;
    // one canvas the food's size (the last bowl's picture has gone by now)
    const key = "ct-layers";
    if (S.textures.exists(key)) S.textures.remove(key);
    const u = B.res; // canvas px per world px
    const N = Math.ceil(2 * R * u) + 8;
    const tex = S.textures.createCanvas(key, N, N);
    const c = tex.getContext();
    const m = N / 2;
    const R0 = R * u;
    // CHT-14 (decision 9): the warm glow round the bowl when a thing doesn't go in (amber, never red; behind the bowl)
    if (!S.textures.exists("ct-warm")) {
      const cv = document.createElement("canvas");
      cv.width = 256;
      cv.height = 256;
      const g = cv.getContext("2d");
      const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, "rgba(255,190,90,0.95)");
      gr.addColorStop(0.62, "rgba(255,182,72,0.7)");
      gr.addColorStop(1, "rgba(255,182,72,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, 256, 256);
      S.textures.addCanvas("ct-warm", cv);
    }
    const warm = S.track(S.add.image(fx, fy, "ct-warm").setDisplaySize(d * B.warm, d * B.warm).setDepth(D.item - 0.4).setAlpha(0));
    // (CHT-12: no shadow under the bowl; the bowl picture carries its own)
    const dish = S.track(S.add.image(x, y, "ct-serve").setDisplaySize(d, h).setDepth(D.item - 0.2));
    const food = S.track(S.add.image(fx, fy, key).setDisplaySize(N / u, N / u).setDepth(D.item));
    dish.setName("chaat-bowl");
    const parts = [dish, food];
    const layers = []; // {id, cv, grow, at: {x, y} (canvas px, where its spoonful landed)}

    /** One layer's own picture (N x N canvas px, the food's circle at its middle). full: it is the first thing in the bowl. */
    function layerCanvas(id, seed, full) {
      const cv = document.createElement("canvas");
      cv.width = N;
      cv.height = N;
      const g = cv.getContext("2d");
      const rnd = rng(seed);
      const L = LAYERS;
      const shade = () => {
        g.shadowColor = `rgba(40,25,10,${L.shade.a})`;
        g.shadowBlur = L.shade.blur * u;
        g.shadowOffsetX = L.shade.x * u;
        g.shadowOffsetY = L.shade.y * u;
      };
      const top = pic(layerKey(id));
      const fd = top ? null : foodOf(id);
      if (top) {
        // the topping's own picture: about the food's width, turned any way, a little off the middle
        const k = ((L.k + (rnd() - 0.5) * L.kJitter) * 2 * R0) / Math.max(top.width, top.height);
        g.save();
        g.translate(m + (rnd() - 0.5) * 2 * L.spread * R0, m + (rnd() - 0.5) * 2 * L.spread * R0);
        g.rotate(rnd() * Math.PI * 2);
        shade();
        g.drawImage(top, (-top.width * k) / 2, (-top.height * k) / 2, top.width * k, top.height * k);
        g.restore();
      } else if (fd) {
        // the base and sev (no layer picture): their bowl's food stamped, each stamp a disc of it turned any way, its pieces the
        // layer pictures' size (r: a whole bowl's food as a stamp)
        const r = HEAP.r * R0;
        const put = (im, px, py, rr) => {
          g.save();
          g.translate(px, py);
          g.rotate(rnd() * Math.PI * 2);
          g.drawImage(im, -rr, -rr, 2 * rr, 2 * rr);
          g.restore();
        };
        if (full) {
          // the first thing in: the whole floor (a close grid of stamps, in a random order)
          const sp = r * HEAP.grid;
          const pts = [];
          for (let yy = m - R0 - r, row = 0; yy <= m + R0 + r; yy += sp * 0.866, row++)
            for (let xx = m - R0 - r + (row % 2) * (sp / 2); xx <= m + R0 + r; xx += sp)
              if (Math.hypot(xx - m, yy - m) < R0 + r * 0.8) pts.push({ x: xx + (rnd() - 0.5) * r * 0.2, y: yy + (rnd() - 0.5) * r * 0.2, o: rnd() });
          pts.sort((a, b) => a.o - b.o).forEach((p) => put(fd, p.x, p.y, r));
        } else {
          // on top of something: loose heaps (a heap's worth of its food each, at the same scale), the layer beneath between them
          shade();
          for (let i = 0; i < HEAP.heaps; i++) {
            const a = rnd() * Math.PI * 2;
            const rr = Math.sqrt(rnd()) * R0 * HEAP.reach;
            const v = Math.floor(rnd() * 4);
            const hp = foodOf(id, HEAP.heap, v) || fd;
            put(hp, m + Math.cos(a) * rr, m + Math.sin(a) * rr, r * HEAP.heap * (HEAP.min + rnd() * (1 - HEAP.min) * 2));
          }
        }
      }
      // inside the bowl: the food's circle, its edge soft
      g.shadowColor = "rgba(0,0,0,0)";
      g.globalCompositeOperation = "destination-in";
      const gr = g.createRadialGradient(m, m, R0 * B.edge, m, m, R0);
      gr.addColorStop(0, "#000");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, N, N);
      return cv;
    }
    function draw() {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = 1;
      c.clearRect(0, 0, N, N);
      layers.forEach((L) => {
        const g = Cook.clamp(L.grow, 0, 1);
        if (g <= 0.002) return;
        // (grows in from where it landed: smaller there, then its full size in its place)
        const s = LAYERS.from + (1 - LAYERS.from) * g;
        const px = L.at.x + (m - L.at.x) * g;
        const py = L.at.y + (m - L.at.y) * g;
        c.globalAlpha = Math.min(1, g * 1.6);
        c.drawImage(L.cv, px - (N * s) / 2, py - (N * s) / 2, N * s, N * s);
      });
      // the bowl's inside wall shades the food's edge (on the food only)
      if (layers.length) {
        c.globalAlpha = Cook.clamp(layers[0].grow, 0, 1);
        c.globalCompositeOperation = "source-atop";
        const gr = c.createRadialGradient(m - R0 * 0.08, m - R0 * 0.1, R0 * 0.7, m, m, R0 * 1.02);
        gr.addColorStop(0, "rgba(60,35,12,0)");
        gr.addColorStop(1, `rgba(60,35,12,${B.wallShade})`);
        c.fillStyle = gr;
        c.fillRect(0, 0, N, N);
        c.globalCompositeOperation = "source-over";
        c.globalAlpha = 1;
      }
      tex.refresh();
    }
    draw();
    // (canvas px <-> world px)
    const toWorld = (p) => ({ x: food.x + (p.x - m) / u, y: food.y + (p.y - m) / u });
    let nextAt = null; // where the next spoonful lands (canvas px)
    const tween = (from, to, ms, ease, each) =>
      new Promise((resolve) => S.tweens.addCounter({ from, to, duration: ms, ease, onUpdate: (tw) => each(tw.getValue()), onComplete: resolve }));
    const bowl = {
      parts,
      dish,
      food,
      /** The bowl's circle on the stage, world px (its picture's middle and width; the food's middle and radius). */
      get box() {
        return { x: dish.x, y: dish.y, w: dish.displayWidth, h: dish.displayHeight, fx: food.x, fy: food.y, r: R };
      },
      get n() {
        return layers.length;
      },
      /** Where the next spoonful lands (world px): a point near the middle of the food, a new one each time. */
      surfaceAt() {
        const a = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(Math.random()) * R0 * LAYERS.land;
        nextAt = { x: m + Math.cos(a) * rr, y: m + Math.sin(a) * rr };
        return toWorld(nextAt);
      },
      /** The bowl's top edge (world px), for the word pop and the faces. */
      rimAt() {
        return { x: dish.x, y: dish.y - dish.displayHeight / 2 };
      },
      /** A topping goes in: its layer grows in from where it landed over the settings' fillMs (CK-83: never a snap). */
      add(id, ms = MOTION.fillMs) {
        const L = { id, cv: layerCanvas(id, Math.floor(Math.random() * 1e9), !layers.length), grow: 0, at: nextAt || { x: m, y: m } };
        nextAt = null;
        layers.push(L);
        return tween(0, 1, ms, "Sine.easeOut", (v) => {
          L.grow = Math.max(0, v);
          draw();
        }).then(() => {
          L.grow = 1;
          draw();
          // the bowl gives a tiny settle
          parts.forEach((p) => S.tweens.add({ targets: p, scaleX: p.scaleX * 1.012, scaleY: p.scaleY * 1.012, duration: 90, yoyo: true }));
        });
      },
      /** §17: the top layer comes back out (it shrinks away to where it landed); returns its id. */
      async removeTop(ms = 320) {
        const L = layers[layers.length - 1];
        if (!L) return null;
        await tween(1, 0, ms, "Sine.easeIn", (v) => {
          L.grow = v;
          draw();
        });
        layers.pop();
        draw();
        return L.id;
      },
      /** Where the top layer's spoonful goes back from (world px). */
      topAt() {
        const L = layers[layers.length - 1];
        return toWorld(L ? L.at : { x: m, y: m });
      },
      /** The picture you tap to take the top layer back (the bowl). */
      hit: dish,
      /** Everything out (a gentle "not quite": the bowl comes back empty). */
      async empty() {
        if (!layers.length) return;
        await tween(1, 0, 520, "Sine.easeIn", (v) => {
          layers.forEach((L) => (L.grow = v));
          draw();
        });
        layers.length = 0;
        draw();
      },
      /** CHT-14 (decision 9): "not that one": the bowl gives a little shake with a warm glow round it (amber, never red), about 0.6 s. */
      async notIn() {
        S.tweens.add({ targets: warm, alpha: { from: 0, to: 0.55 }, duration: 160, hold: 300, yoyo: true, ease: "Sine.easeOut" });
        const dx = z.L(MOTION.shakePx);
        for (const [to, ms] of [[-dx, 70], [dx, 90], [-dx * 0.5, 80], [0, 70]]) {
          await new Promise((resolve) =>
            S.tweens.add({
              targets: parts,
              x: (t) => (t === dish ? x : fx) + to,
              duration: ms,
              ease: "Sine.easeInOut",
              onComplete: resolve,
            }),
          );
        }
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
      // tray too and counts as one (it is an ordinary decoy, never the odd one out)
      // (the S14 roll-out, CHT-17: 1, 2, 3, 4 by the central rules, Cook.levelRow on Rules.level; was the mechanic's own 1, 2, 3, 3)
      if (!pool) pool = St.tableDecoys(decoyPool, flat.concat(exclude), level, { want: flat, n: Math.max(0, Cook.levelRow(level).decoys - exclude.length), also: exclude.length, what: "toppings" });
      else St.decoyNote(pool.filter((x) => !flat.includes(x)).length, { what: "toppings" });
      const ids = Cook.shuffle([...new Set(pool.concat(flat, exclude))]);
      const who = (ctx.order && ctx.order.who) || "nana";
      // real-time cap (St.loadArt), never Cook.wait: at test speed a game-time cap shrank and the art missed it
      // (CHT-13: the serving bowl, each topping's bowl on the tray and its layer picture, only these: decision 68)
      await St.loadArt(
        S,
        [["ct-serve", BOWL.file]].concat(
          Cook.Kit ? Cook.Kit.faceArt(who) : [],
          ids.filter((id) => BOWLS.files[id]).map((id) => [bowlKey(id), `${BOWLS.dir}${BOWLS.files[id]}.webp`]),
          ids.filter((id) => LAYERS.files[id]).map((id) => [layerKey(id), `${LAYERS.dir}${LAYERS.files[id]}.webp`]),
        ),
      );
      scene = S;

      /* ---------- the scene: the kitchen kit's worktop wash and stone tray (kit a, as daar's and maani's) ---------- */
      Cook.Kit.worktop(S, { top: z.Y(SHELF_TOP) });
      // (SH-248, CHT-13: the bottom element is the game's settings' band, data/stations/chaat.json "tray": the bowls lie on it from above)
      St.stoneBand(S, { top: z.Y(SHELF_TOP), depth: D.bg + 1.2, game: "chaat" });

      /* ---------- the serving bowl, from above ---------- */
      // raised into the middle of a taller stage's worktop (the stage fill)
      const bowl = serveBowl(Cook.liftZone(z), S);
      /*
       * SH-258 (the eye judge beside chai, 10 Nov: no face circle by the bowl until well done): the asker's face circle (the kit's badge,
       * Cook.Kit.badge) on the bowl's upper-left rim from the first frame, as chai's Nana is on the glass: the badge size (64 design px,
       * at least 30 CSS px as seen), beside the food, never over it; it stands down while their big face is up (the review)
       */
      const bowlFace = (() => {
        if (!Cook.Kit || !Cook.Kit.badge) return null;
        const b = bowl.box;
        const perPx = Math.max(0.01, (UI && UI.worldToScreen ? UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x : 1) || 1);
        const fd = Math.min(z.L(90), Math.max(z.L(64), 30 / perPx));
        const a = (225 * Math.PI) / 180; // (the rim's upper left, its middle on the rim's outer edge)
        const rr = b.w / 2;
        const f = S.track(S.add.image(b.x + Math.cos(a) * rr, b.y + Math.sin(a) * rr * (b.h / b.w), Cook.Kit.badge(S, who)).setDisplaySize(fd, fd).setDepth(D.badge));
        f.setName("chaat-bowl-face");
        bowl.dish.face = f;
        return f;
      })();

      /* ---------- the tray: the F3 cream bowls from above, the shared kit's word pill under each (as daar's) ---------- */
      // Zafar, 20 Oct (replacing s08 w6M's speaker alone at every level): a bowl's word is written until the child has used
      // it right, then the speaker alone from the next round (Cook.chipWord); the bowl shows its food (the picture label)
      // (the shared kit's shelf, pieces 9-10, js/shared/shelf.js: Shelf.P.chip the pill, Shelf.slots the row, Shelf.pillWant and
      // .pillScale the pills' size: at least the floor on screen, never touching)
      const Shelf = global.Shelf;
      const PL = Shelf.PILL;
      const wts = (() => {
        try {
          return UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1;
        } catch (e) {
          return 1;
        }
      })();
      const ppw = wts * z.k; // CSS px per design px of the tray
      const gap = Shelf.pillGap(ppw);
      // SH-255: the pills at chai's size on screen (the kit's floor, Cook.Kit.fitPills's: the shelf's want and the canvas text floor)
      const want = Math.max(Shelf.pillWant(ppw), Cook.Kit.textFloor ? Cook.Kit.textFloor(S, PL.text) / Math.max(0.01, z.k) : 1);
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
      const lay = Shelf.slots([ids], { span: TRAY.span, view: TRAY.span, pitch: TRAY.pitch, groupGap: 0, pillRoom });
      fitPills();
      const items = {};
      ids.forEach((id) => (items[id] = slot(id, lay.x[id])));
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
        const y = Math.min(TRAY.chipY, 896 - (PL.h / 2) * fit.k);
        ids.forEach((id) => {
          const c = chips[id];
          c.k = fit.k;
          c.pillTop = y - (PL.h / 2) * fit.k; // (design px: the bowl above lies clear of it)
          c.setPosition(z.X(lay.x[id]), z.Y(y)).setScale(z.k * fit.k);
          c.hit(lay.slotW);
        });
      }
      // (the pills' measure, read only: each tray pill on screen in CSS px, as chai's: its card, whether it shows the word)
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
      /** A topping's cream bowl lying on the tray (as daar's): all one size, centred over its pill, its foot the settings' gap above it. */
      function slot(id, x) {
        const key = bowlKey(id);
        let img;
        if (S.textures.exists(key)) {
          const src = S.textures.get(key).getSourceImage();
          const foot = chips[id].pillTop - TRAY.gap;
          const dd = Math.max(40, Math.min(TRAY.bowlD, lay.slotW - 22, foot - SHELF_TOP - TRAY.top));
          const sc = z.L(dd / Math.max(src.width, src.height));
          img = S.track(S.add.image(z.X(x), z.Y(foot - (src.height * dd) / Math.max(src.width, src.height) / 2), key).setScale(sc).setDepth(D.item + 1));
          img.baseScale = sc;
          img.shadow = S.contactShadow(img);
        } else
          img = S.ingredient(id, z.X(x), z.Y(chips[id].pillTop - TRAY.gap - 56), {
            w: z.L(110),
            h: z.L(100),
            label: false,
            depth: D.item + 1,
          });
        img.wordId = id;
        img.home = { x: img.x, y: img.y };
        img.chip = chips[id];
        return img;
      }

      /* ---------- the word pop (§4): beside the bowl, with the family clip (the shared kit's, Juice.P.pop: piece 12) ---------- */
      const pop = (id, x, y) => {
        // never under 14px as rendered (the kitchen kit's floor: the canvas is shown smaller than its game size on a phone)
        global.Juice.P.pop(S, { x, y }, Cook.display(id), { k: Math.max(z.k, Cook.Kit.textFloor(S, 36)), depth: D.fx + 3, top: (Cook.view || {}).top || 0 });
        if (UI.naniMuted && UI.naniMuted()) return Promise.resolve();
        // a clip that never ends (no audio on this device) never holds the station up
        const talk = Lang.popWord(id);
        return talk ? Promise.race([talk.catch(() => {}), Cook.wait(M.popCapMs)]) : Promise.resolve();
      };
      // (the word pops right of the bowl, level with its middle: clear of the asker's face at its upper left and of the settings gear)
      const popAt = () => {
        const b = bowl.box;
        return { x: b.x + b.w / 2 + z.L(M.popDx), y: b.y + z.L(M.popDy) };
      };

      /* ---------- a topping goes in: a spoonful lifts off its bowl on the tray, flies over and lands in the serving bowl ---------- */
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
      /** A spoonful flies from the serving bowl (world point p) back to its bowl on the tray. */
      async function spoonBack(id, p) {
        const obj = items[id];
        const key = spoonKey(S, id);
        if (!obj || !key) return;
        const spoon = S.track(S.add.image(p.x, p.y, key).setDepth(D.fx).setDisplaySize(z.L(M.spoonW), z.L(M.spoonW)));
        await S.fly(spoon, obj.x, obj.y, { duration: M.backMs, arc: z.L(70) });
        spoon.destroy();
      }
      /**
       * §17 (29 Sept): tap the bowl to take the top layer back, until Done. It shrinks out of the bowl and a
       * spoonful flies back to its bowl on the tray; its card row goes back to "to do". A layer that was wrong when it went
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
        const p = bowl.topAt();
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
        await spoonBack(id, p);
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
      /** A spoonful of it lifts off its bowl, flies over and drops into the serving bowl; resolves where it landed. */
      async function spoonIn(id) {
        const obj = items[id];
        Cook.sfx.pop();
        S.tweens.add({
          targets: obj,
          scale: obj.baseScale ? obj.baseScale * 1.08 : obj.scale * 1.08,
          duration: 90,
          yoyo: true,
        });
        // a spoonful: a soft-edged round of the food in its bowl, seen from above as the bowl is
        const key = spoonKey(S, id);
        const spoon = key
          ? S.track(S.add.image(obj.x, obj.y, key).setDepth(D.fx).setDisplaySize(z.L(M.spoonW), z.L(M.spoonW)))
          : S.track(S.add.image(obj.x, obj.y - z.L(60), S.tex(`layer:${id}`)).setDepth(D.fx).setScale(0.25 * z.k));
        const p = bowl.surfaceAt();
        // up and over, then down onto the food (a little smaller as it settles: the camera is above)
        await S.fly(spoon, p.x, p.y - z.L(M.dropPx), { duration: k.flyMs, arc: z.L(110) });
        await new Promise((r) =>
          S.tweens.add({
            targets: spoon,
            y: p.y,
            scaleX: spoon.scaleX * 0.8,
            scaleY: spoon.scaleY * 0.8,
            alpha: 0.6,
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
        S.puff(p.x, p.y, St.color(((Cook.item(id) || {}).layer || {}).color || "#ffffff"), z.L(34));
        const settle = bowl.add(id);
        const q = popAt();
        pop(id, q.x, q.y);
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
      /*
       * CHT-14, CHT-15 (decision 9, softened for rule 12): a wrong thing goes in, a short pause, the bowl shakes with a warm
       * glow (never red) and it comes back out to its bowl on the tray, one from later in the order too (Zafar, 21 Oct: the right
       * ones stay in the bowl and stay ticked). Nothing is said. The rows it costs lose their tick (judgeDrop, rowsMissed); the
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
        /* ---------- the review (X10 / Q1): their big round face beside the bowl, no body (the kitchen kit's, Cook.Kit.review) ---------- */
        // CK-83, SH-254 (the eye judge beside chai, 10 Nov: Shabash over the bowl's word pill; a well done face over the dish): one face
        // beside the bowl, over its rim's edge only, the bowl in sight (the kit's praiseSpot, as corn's and maani's), clear of the word
        // pop at the bowl's right; its praise on the side away from the bowl
        const review = async (ok) => {
          const b = bowl.box;
          if (bowlFace) bowlFace.setVisible(false);
          const size = z.L(M.reviewD);
          const V = Cook.view || {};
          const q = popAt();
          const avoid = [{ x: q.x - z.L(130), y: q.y - z.L(60), right: q.x + z.L(130), bottom: q.y + z.L(60) }];
          const at = Cook.Kit.praiseSpot({ x: b.x, y: b.y, w: b.w, h: b.h }, size, { avoid, view: [V.left != null ? V.left : 0, V.top != null ? V.top : 0, V.right != null ? V.right : 1600, z.Y(SHELF_TOP)] });
          const look = await Cook.Kit.review(S, { who, ok, x: at.x, y: at.y, size, k: z.L(1), side: at.side });
          const close = look.close;
          look.close = async () => {
            await close();
            if (bowlFace && bowlFace.active) bowlFace.setVisible(true);
          };
          return look;
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
          // serve: their face comes up beside the bowl (no pretend eating)
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
            // the right way, shown: each layer still to go glows on the tray and goes in, in order
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
