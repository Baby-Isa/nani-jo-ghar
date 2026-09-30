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
 *  - THE SHELF (the bottom 26%): the side-on glass pots (v3/chaat/pot-*.webp, the pantry jars' look),
 *    standing on their measured bottom-centre on one shelf line, a `🔊 word` chip under each: tap the pot
 *    = use it, tap the chip = hear it. From level 3 the word hides and the speaker stays (the same chip).
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
 *    build it again. Never a red cross; only the first mistake counts (the ear star, the end review).
 * LEVELS (§14, §14a; the recipe's slots by level in data/cook.json, the decoys in
 * data.mechanics.assemble): 1 = three layers, no decoys; 2 = decoys; 3 = a "don't" row (and the words
 * hide on the chips); 4 = the person's card starts FOLDED (face + headline): remember what you heard;
 * tapping the card to peek costs a hint (the light-bulb badge).
 * ONBOARDING (first time, §14): a ghost finger shows card row 1 -> the matching pot -> the drop into
 * the bowl -> the tick; then the child does row 2.
 *
 * St.freePick (below) is the shared "tap anything, or Done" step that the fill mechanic uses too:
 * nothing is refused, so nothing gives the answer away; you're graded afterwards.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /** A number from a knob: n, or [min, max] (random). */
  const knobInt = (v) => (Array.isArray(v) ? v[0] + Math.floor(Math.random() * (v[1] - v[0] + 1)) : v);
  St.knobInt = knobInt;

  /**
   * One free pick: resolves {id, obj} when any item is tapped, or {done}
   * when Done is pressed (offered if `doneOk`). `next` is what the order
   * wants next (for the guided glow and the test only; never shown
   * otherwise). Nothing is refused.
   */
  St.freePick = (z, { items, next, doneOk, doneGlow }) =>
    new Promise((resolve) => {
      const S = z.S;
      let over = false;
      const finish = (r) => {
        if (over) return;
        over = true;
        Object.values(items).forEach((o) => {
          if (!o || !o.active) return;
          S.untap(o);
          S.glow(o, false);
        });
        UI.hideDone();
        z.expect(null);
        resolve(r);
      };
      Object.entries(items).forEach(([id, obj]) => obj && obj.active && S.tappable(obj, () => finish({ id, obj })));
      if (doneOk) UI.done({ glow: !!doneGlow }).then(() => finish({ done: true }));
      const target = next && items[next] && items[next].active ? items[next] : null;
      if (target && z.guided) S.glow(target, true);
      if (target) {
        const c = S.centre(target);
        const wrongs = Object.keys(items)
          .filter((k) => k !== next && items[k] && items[k].active)
          .map((k) => S.centre(items[k]));
        z.expect({ kind: "tap", x: c.x, y: c.y, key: next, wrongs });
      } else if (doneOk) z.expect({ kind: "click", selector: "#done-btn" });
      else z.expect({ kind: "wait" });
    });

  /** The customer speaks from the sidebar card (their face on it, never over the play area). */
  St.customerSay = async (ctx, line, opts = {}) => {
    const face = document.querySelector("#nani-card .nc-face");
    const who = ctx.order && ctx.order.who;
    if (face && who && who !== "nani") {
      face.dataset.nani = face.dataset.nani || face.getAttribute("src");
      face.src = Cook.v(Cook.facePath(who));
    }
    return UI.say(line, { badge: true }, opts).catch(() => {});
  };
  St.customerDone = () => {
    const face = document.querySelector("#nani-card .nc-face");
    UI.hideBubble();
    if (face && face.dataset.nani) face.src = face.dataset.nani;
  };

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

  /* ---------- the chaat v3 station (30 Sept, T2/T3, Q2b: fully side-on) ---------- */
  const V3 = "assets/cook/items/v3/chaat/";
  // the side-on glass bowl, as build/check_vessel_meta.py measured it (v3/chaat/meta.json "bowl-side"): the
  // rim's and the inside floor's front lines, how flat a level's ellipse is there, and the inside wall's
  // [left, right] at 41 heights of the sprite (all fractions of the sprite's width / height)
  const BOWL = { w: 1214, h: 618, cx: 0.4992, rim: 0.0599, floor: 0.8285, eryRim: 0.025, eryFloor: 0.1504, floorTop: 0.6489, floorHw: 0.304 };
  // prettier-ignore
  const BOWL_INSIDE = [[0.0346,0.9646],[0.0346,0.9646],[0.0346,0.9646],[0.0372,0.962],[0.0445,0.9539],[0.0477,0.9507],[0.0509,0.9483],[0.0549,0.9443],[0.0581,0.9411],[0.0613,0.9379],[0.0653,0.9347],[0.0685,0.9299],[0.0733,0.9259],[0.0773,0.9218],[0.0813,0.9178],[0.0854,0.913],[0.0902,0.9081],[0.095,0.9033],[0.0999,0.8985],[0.1055,0.8928],[0.1112,0.8871],[0.1177,0.8807],[0.1242,0.8742],[0.1315,0.8677],[0.1396,0.8595],[0.1469,0.8514],[0.1567,0.8425],[0.1657,0.8327],[0.1763,0.8221],[0.1885,0.8106],[0.2002,0.799],[0.2125,0.7858],[0.2273,0.7718],[0.2446,0.7545],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504],[0.2479,0.7504]];
  const GLASS = { w: BOWL.w, h: BOWL.h, rim: BOWL.rim, floor: BOWL.floor, eryRim: BOWL.eryRim, eryFloor: BOWL.eryFloor, inside: BOWL_INSIDE };
  // the side-on pots (the pantry jars' look): one canvas, standing on its measured bottom-centre (meta.json)
  const POT = { w: 356, h: 370, anchor: [0.5, 0.9514] };
  // the food inside a pot, below the jar's own highlights and above its thick base (the layers' texture)
  const POT_FOOD = { x0: 0.15, x1: 0.85, y0: 0.4, y1: 0.86 };
  const POTS = {
    "veg-01": "pot-potato",
    "ph-chana": "pot-chana",
    "veg-02": "pot-onion",
    "veg-03": "pot-tomato", // a stand-in (build/make_chaat_tomato_pot.py): no tomato on the T2 sheet
    "veg-12": "pot-chilli",
    "ph-sev": "pot-sev",
    "ph-dahi": "pot-dahi",
    "ph-amli": "pot-imli",
    "ph-lili": "pot-chutney",
    "ph-dhana": "pot-dhania",
  };
  /* the grid (design px, 1600x900), the same as chai v2's */
  const SHELF_TOP = 666; // §3: the scene is the top 74%, the shelf band the bottom 26%
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  const BASE = 818; // the shelf line: every pot stands on it
  const CHIP = { w: 128, h: 46, y: 860, hitW: 142, hitH: 80 };
  const PITCH = 150;
  const PREP_W = 132; // one slot's pot (identical for every topping)
  const GLASS_W = 760; // the side-on bowl: wide, so a layer of a long order is still a clear strip
  const GLASS_X = 800;
  // the bowl is centred in the scene above the shelf band (0..SHELF_TOP): its middle at SHELF_TOP / 2
  const GLASS_BOTTOM = Math.round(SHELF_TOP / 2 + (GLASS_W * GLASS.h) / GLASS.w / 2);
  const INK = {
    text: "#2A2522",
    kutchi: "#8C2F2F",
    card: 0xffffff,
    grey: 0xd9d2c7,
    gold: 0xc9962e,
    panel: 0xefe5d6,
    page: 0xf4ecdf,
  };
  const FONT = "Nunito, sans-serif";
  // a layer's thickness, as a share of a full one: a chutney is drizzled (thin, over the layer below)
  const THIN = {
    "ph-amli": 0.5,
    "ph-lili": 0.5,
    "ph-dahi": 0.85,
    "ph-dhana": 0.8,
    "veg-12": 0.8,
  };
  const DRIZZLE = { "ph-amli": true, "ph-lili": true };
  const RES = 1.5; // the layers' canvas, over the bowl's design size (crisp on a big screen)
  // a layer's pieces, as a share of their size in the pot (the bowl is drawn bigger than a pot: a chickpea
  // in the bowl is the size of one in the pot, measured on screen)
  const BAND_SCALE = { "veg-01": 0.62, "ph-chana": 0.62, "ph-dahi": 0.8, "ph-sev": 0.7, "ph-dhana": 0.62, "veg-02": 0.6, "veg-03": 0.6, "veg-12": 0.62 };
  const BAND_W = 1300; // a layer's flat texture: as wide as the bowl (bowl px)
  const BAND_PAD = 14; // and this much above and below the layer (for the uneven lines)
  const SPOON_W = 92; // a spoonful in flight (design px): big enough to see what is going in
  const potFood = {}; // id -> a canvas of the food in its pot (the layer's texture)

  /** The speaker icon, drawn at (x, y) about `s` px tall (chai v2's). */
  function speaker(g, x, y, s, color = 0x2a2522) {
    const k = s / 24;
    g.fillStyle(color, 1);
    g.fillRect(x - 8 * k, y - 3.5 * k, 5 * k, 7 * k);
    g.fillTriangle(x - 4 * k, y - 3.5 * k, x + 2 * k, y - 9 * k, x + 2 * k, y + 9 * k);
    g.fillTriangle(x - 4 * k, y + 3.5 * k, x + 2 * k, y - 9 * k, x - 4 * k, y - 3.5 * k);
    g.lineStyle(2.2 * k, color, 1);
    g.beginPath();
    g.arc(x + 3 * k, y, 5 * k, -0.9, 0.9);
    g.strokePath();
    g.beginPath();
    g.arc(x + 3 * k, y, 9.5 * k, -0.9, 0.9);
    g.strokePath();
  }

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
  const colourOf = (id) => ((Cook.data.words[id] || {}).layer || {}).color || "#d8c49a";

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
    // the contact shadow under the bowl's foot (the foot is the middle 44% of its width)
    const shadow = S.track(S.add.ellipse(g.x, z.Y(GLASS_BOTTOM - 6), z.L(GLASS_W * 0.56), z.L(22), 0x3a2410, 0.18).setDepth(D.item - 1));
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
      const ry = ((GLASS.floor - BOWL.floorTop) * cv.height) / 2;
      x.translate(BOWL.cx * cv.width, GLASS.floor * cv.height - ry);
      x.scale(BOWL.floorHw * cv.width * 1.04, ry * 1.1);
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
    const parts = [shadow, glass, food, hi];
    const layers = []; // {id, th (bowl px), grow, seed, wob, tex}
    const img = (id) => foodOf(S, id);
    // a full layer: thin enough that a long order (6) fills about four fifths of the glass, so three
    // layers sit in the lower half and every layer of a long order stays visible
    const full = () => ((GLASS.floor - GLASS.rim) * GLASS.h * 0.8) / Math.max(6, expected);
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
      const top = front(y1, wob1);
      const bot = front(y0, wob0).reverse();
      c.save();
      c.beginPath();
      top.concat(bot).forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      c.closePath();
      c.clip();
      const h = Math.ceil(fullH + 2 * BAND_PAD);
      if (!L.tex || Math.abs(L.tex.height - h) > 3) L.tex = bandCanvas(L.id, img(L.id), h, L.seed);
      // the texture, bent along the level's curve (a column at a time), so the food follows the glass
      const Lt = level(y1);
      const x0 = Lt.cx - BAND_W / 2;
      const step = 5;
      for (let x = 0; x < BAND_W; x += step) {
        const u = Cook.clamp((x0 + x + step / 2 - Lt.cx) / Lt.hw, -1, 1);
        const ty = y1 - Lt.ry + Lt.ry * Math.sqrt(1 - u * u) - BAND_PAD;
        c.drawImage(L.tex, x, 0, step + 0.6, L.tex.height, x0 + x, ty, step + 0.6, L.tex.height);
      }
      // the glass's curve: a soft shade at both sides, so the layer reads as round
      const L1 = level((y0 + y1) / 2);
      const gr = c.createLinearGradient(L1.cx - L1.hw, 0, L1.cx + L1.hw, 0);
      gr.addColorStop(0, "rgba(40,25,10,0.30)");
      gr.addColorStop(0.16, "rgba(40,25,10,0)");
      gr.addColorStop(0.82, "rgba(40,25,10,0)");
      gr.addColorStop(1, "rgba(40,25,10,0.36)");
      c.fillStyle = gr;
      c.fillRect(L1.cx - L1.hw - 10, y1 - Lt.ry - 12, 2 * L1.hw + 20, y0 - y1 + Lt.ry + 24);
      // a soft shadow under the layer above
      c.beginPath();
      top.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      c.strokeStyle = "rgba(40,25,10,0.22)";
      c.lineWidth = 4;
      c.stroke();
      c.restore();
    }
    function draw() {
      c.setTransform(RES * k, 0, 0, RES * k, 0, 0);
      c.clearRect(0, 0, GLASS.w, GLASS.h);
      // every layer's thickness shrinks a little if the glass would overflow
      const want = layers.reduce((a, L) => a + (DRIZZLE[L.id] ? L.th * 0.45 : L.th), 0);
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
        if (DRIZZLE[L.id]) {
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
      if (t) {
        const under = tops.length > 1 && DRIZZLE[t.id] ? tops[tops.length - 2] : null;
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
                targets: parts.slice(1),
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
            targets: parts,
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
            targets: parts.slice(1),
            angle: a,
            duration: ms,
            yoyo: true,
            ease: "Sine.easeInOut",
            onComplete: resolve,
          }),
        );
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

  /* the ghost finger (first time only): a see-through hand on the page, over everything */
  const FINGER_SVG =
    '<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><path d="M26 6c3 0 5 2 5 5v17l2-1c3-1 6 1 6 4v1l2-1c3-1 6 1 6 4l2-.5c3-.6 5 1.5 5 4.5v9c0 9-7 16-16 16h-4c-6 0-10-3-13-8l-8-13c-1.6-2.6.8-5.8 3.8-5l5.2 3V11c0-3 2-5 5-5z" fill="#fff" stroke="#2A2522" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  function ghost() {
    const el = document.createElement("div");
    el.className = "cv2-ghost";
    el.innerHTML = FINGER_SVG;
    Object.assign(el.style, {
      position: "fixed",
      left: "0px",
      top: "0px",
      width: "64px",
      height: "64px",
      zIndex: 60,
      pointerEvents: "none",
      opacity: "0",
      transition: "left .7s ease-in-out, top .7s ease-in-out, opacity .3s, transform .15s",
      filter: "drop-shadow(0 3px 6px rgba(40,25,10,.35))",
      transform: "translate(-22px, -4px)",
    });
    const ring = document.createElement("div");
    Object.assign(ring.style, {
      position: "fixed",
      width: "56px",
      height: "56px",
      marginLeft: "-28px",
      marginTop: "-28px",
      borderRadius: "50%",
      border: "4px solid #C9962E",
      zIndex: 59,
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity .25s, transform .4s",
      transform: "scale(.6)",
    });
    document.body.append(ring, el);
    const g = {
      at(x, y, instant) {
        if (instant) el.style.transition = "opacity .3s, transform .15s";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = "0.92";
        if (instant) setTimeout(() => (el.style.transition = "left .7s ease-in-out, top .7s ease-in-out, opacity .3s, transform .15s"), 30);
      },
      async tap(x, y) {
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        el.style.transform = "translate(-22px, -4px) scale(.86)";
        ring.style.opacity = "1";
        ring.style.transform = "scale(1.25)";
        await Cook.wait(260);
        el.style.transform = "translate(-22px, -4px)";
        ring.style.opacity = "0";
        ring.style.transform = "scale(.6)";
      },
      gone() {
        el.style.opacity = "0";
        ring.style.opacity = "0";
        setTimeout(() => {
          el.remove();
          ring.remove();
        }, 400);
      },
    };
    return g;
  }

  Mech.define("assemble", {
    station: "assemble",
    view: "marble",
    async run(z, { sequence, exclude = [], pool, decoyPool }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const guided = !!ctx.guided;
      const level = Math.max(z.level || 1, Cook.roundLevel(ctx));
      const flat = sequence.flat();
      const C = checker(sequence);
      const dishNo = () => ctx.dishAt || 0;
      // this station's own first-time demo replaces the generic spotlight (js/cook/coach.js)
      if (Cook.Coach) Cook.Coach.stop(true);
      if (!pool) pool = St.decoys(decoyPool, flat.concat(exclude), knobInt(k.decoys), k.decoyPick);
      const ids = Cook.shuffle([...new Set(pool.concat(flat, exclude))]);
      const who = (ctx.order && ctx.order.who) || "nana";
      await Promise.race([
        St.load(
          S,
          [["cv3-bowl", V3 + "bowl-side.webp"]].concat(
            Cook.Kit ? Cook.Kit.faceArt(who) : [],
            ids.filter((id) => POTS[id]).map((id) => [`cv3-pot-${id}`, `${V3}${POTS[id]}.webp`]),
          ),
        ),
        Cook.wait(6000),
      ]);

      /* ---------- the scene: the softened marble, the shelf band (chai v2's) ---------- */
      S.track(
        S.add
          // (drawn past the design box: the stage fill shows more worktop above and at the sides, Cook.view)
          .rectangle(z.X(-FAR), z.Y(-FAR), z.L(1600 + 2 * FAR), z.L(SHELF_TOP + FAR), INK.page, 0.5)
          .setOrigin(0)
          .setDepth(D.bg + 1),
      );
      const bandG = S.track(S.add.graphics().setDepth(D.bg + 1.2));
      bandG.fillStyle(INK.panel, 1);
      bandG.fillRect(z.X(-FAR), z.Y(SHELF_TOP), z.L(1600 + 2 * FAR), z.L(900 - SHELF_TOP + FAR));
      bandG.fillStyle(0x2a1a0a, 0.08);
      bandG.fillRect(z.X(-FAR), z.Y(SHELF_TOP), z.L(1600 + 2 * FAR), z.L(3));

      /* ---------- the glass ---------- */
      // raised into the middle of a taller stage's worktop (the stage fill)
      const bowl = glassBowl(Cook.liftZone(z), S, flat.length);

      /* ---------- the shelf: identical side-on pots (the pantry jars' look), a chip under each ---------- */
      const n = ids.length;
      const pitch = Math.min(PITCH, (1600 - 190 - 60) / Math.max(1, n));
      const width = n * pitch;
      const x0 = Math.max(30, (1600 - 190 - width) / 2); // clear of the tick, bottom right
      const plank = S.track(S.add.graphics().setDepth(D.bg + 1.3));
      plank.fillStyle(INK.grey, 1);
      plank.fillRoundedRect(z.X(x0 + 10), z.Y(BASE - 2), z.L(width - 20), z.L(10), z.L(5));
      const items = {};
      // §4, §14: the word on the chip at levels 1-2, the speaker alone from level 3 (the same chip)
      const showWord = () => level < 3;
      ids.forEach((id, i) => (items[id] = slot(id, x0 + pitch * (i + 0.5), Math.min(PREP_W, pitch - 22))));
      function slot(id, x, w) {
        const key = `cv3-pot-${id}`;
        let img;
        if (S.textures.exists(key)) {
          const sc = z.L(w) / POT.w;
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
        // the chip: `🔊 word`, or the speaker alone once the word hides (same size, same place)
        const chip = S.track(
          S.add
            .container(z.X(x), z.Y(CHIP.y))
            .setDepth(D.item + 2)
            .setScale(z.k),
        );
        const bg = S.add.graphics();
        const cw = Math.min(CHIP.w, pitch - 12);
        bg.fillStyle(0x28190a, 0.1);
        bg.fillRoundedRect(-cw / 2, -CHIP.h / 2 + 2, cw, CHIP.h, 12);
        bg.fillStyle(INK.card, 1);
        bg.fillRoundedRect(-cw / 2, -CHIP.h / 2, cw, CHIP.h, 12);
        chip.add(bg);
        const icon = S.add.graphics();
        if (showWord(id)) {
          // one line (shrunk down to ~20px), or two lines for a long name (fudino ji chutney)
          const style = (px) => ({ fontFamily: FONT, fontSize: `${px}px`, fontStyle: "800", color: INK.kutchi, align: "left", lineSpacing: -4 });
          const maxT = cw - 44;
          let t = S.add.text(0, 0, Cook.display(id), style(25)).setOrigin(0, 0.5);
          if (t.width * 0.8 > maxT && Cook.display(id).includes(" ")) {
            const words = Cook.display(id).split(" ");
            let best = null;
            for (let b = 1; b < words.length; b++) {
              const two = [words.slice(0, b).join(" "), words.slice(b).join(" ")];
              const w = Math.max(...two.map((x) => x.length));
              if (!best || w < best.w) best = { w, two };
            }
            t.destroy();
            t = S.add.text(0, 0, best.two.join("\n"), style(19)).setOrigin(0, 0.5);
          }
          if (t.width > maxT) t.setScale(Math.max(14 / 25, maxT / t.width));
          const tw = 22 + 8 + t.displayWidth;
          speaker(icon, -tw / 2 + 10, 0, 24);
          t.x = -tw / 2 + 30;
          chip.add([icon, t]);
        } else {
          speaker(icon, 1, 0, 26);
          chip.add(icon);
        }
        const hitW = Math.min(CHIP.hitW, pitch - 4);
        chip.setSize(hitW, CHIP.hitH);
        chip.setInteractive(new Phaser.Geom.Rectangle(-hitW / 2, -CHIP.hitH / 2 + 8, hitW, CHIP.hitH), Phaser.Geom.Rectangle.Contains);
        chip.on("pointerdown", (ptr, lx, ly, ev) => {
          if (ev && ev.stopPropagation) ev.stopPropagation();
          Cook.unlockAudio();
          if (Cook.onLabel) Cook.onLabel(id);
          Lang.speakWord(id);
          S.tweens.add({
            targets: chip,
            scale: z.k * 1.08,
            duration: 90,
            yoyo: true,
          });
        });
        img.chip = chip;
        return img;
      }

      /* ---------- the word pop (§4): by the glass, with the family clip ---------- */
      const pop = (text, x, y, { speakId = null, line = null, ms = 1900 } = {}) => {
        const c = S.track(
          S.add
            .container(x, y)
            .setDepth(D.fx + 3)
            .setAlpha(0)
            .setScale(z.k),
        );
        const t = S.add
          .text(0, 0, text, {
            fontFamily: FONT,
            fontSize: "36px",
            fontStyle: "800",
            color: INK.kutchi,
          })
          .setOrigin(0, 0.5);
        const w = 34 + 10 + t.width + 36;
        const g = S.add.graphics();
        g.fillStyle(0x28190a, 0.1);
        g.fillRoundedRect(-w / 2, -28 + 3, w, 56, 12);
        g.fillStyle(INK.card, 1);
        g.fillRoundedRect(-w / 2, -28, w, 56, 12);
        speaker(g, -w / 2 + 30, 0, 26);
        t.x = -w / 2 + 50;
        c.add([g, t]);
        S.tweens.add({
          targets: c,
          alpha: 1,
          y: y - z.L(18),
          duration: 180,
          ease: "Back.easeOut",
        });
        S.tweens.add({
          targets: c,
          alpha: 0,
          y: y - z.L(46),
          delay: ms,
          duration: 320,
          onComplete: () => c.destroy(),
        });
        if (UI.naniMuted && UI.naniMuted()) return Promise.resolve();
        // a clip that never ends (no audio on this device) never holds the station up
        const talk = speakId ? Lang.speakWord(speakId) : line ? Lang.speak(line) : null;
        return talk ? Promise.race([talk.catch(() => {}), Cook.wait(ms + 900)]) : Promise.resolve();
      };

      /* ---------- a topping goes in: it lifts off the shelf, drops into the glass and settles ---------- */
      const got = [];
      Cook.assembleGot = got; // (for the screenshot and test scripts: what's in the bowl, bottom first)
      const ticked = []; // the card row each layer ticked (null: none), to untick it if it's taken back
      let busy = 0;
      let building = false; // the bowl takes a layer back only while you're building (§17)
      let firstWrong = null;
      /** The first mistake is what's scored (the ear star, the end review), whenever it's found. */
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
        else if (m.expected) UI.mission.missItem(m.expected, dishNo());
      };
      /**
       * §17 (29 Sept): tap the bowl to take the top layer back, until Done. It shrinks out of the bowl and a
       * spoonful flies back to its pot; its card row goes back to "to do". A layer that was wrong when it went
       * in still counts as the first mistake (the first placement is what's scored).
       */
      async function takeBack() {
        if (!building || busy || !got.length) return;
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
          const spoon = S.track(S.add.image(p.x, p.y, `cv3-bit-${id}`).setDepth(D.fx).setDisplaySize(z.L(SPOON_W), z.L(SPOON_W * 0.62)));
          await S.fly(spoon, obj.x, obj.y - obj.displayHeight * 0.5, { duration: 380, arc: z.L(70) });
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
      async function drop(id) {
        const obj = items[id];
        busy++;
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
                .setDisplaySize(z.L(SPOON_W), z.L(SPOON_W * 0.62)),
            )
          : S.track(
              S.add
                .image(obj.x, obj.y - z.L(60), S.tex(`layer:${id}`))
                .setDepth(D.fx)
                .setScale(0.25 * z.k),
            );
        const rim = bowl.rimAt();
        // up and over the rim, then down into the glass
        await S.fly(spoon, rim.x + (Math.random() - 0.5) * z.L(24), rim.y - z.L(70), { duration: k.flyMs || 420, arc: z.L(90) });
        const p = bowl.surfaceAt();
        await new Promise((r) =>
          S.tweens.add({
            targets: spoon,
            y: p.y,
            scaleY: spoon.scaleY * 0.7,
            duration: 170,
            ease: "Quad.easeIn",
            onComplete: r,
          }),
        );
        spoon.destroy();
        got.push(id);
        // the pill ticks now (UX 11: its step has closed, right or not; the serve judges the order)
        ticked.push(UI.mission.tickItem(id, dishNo()));
        if (UI.mission.advance) UI.mission.advance(dishNo());
        S.puff(p.x, p.y, St.color(((Cook.data.words[id] || {}).layer || {}).color || "#ffffff"), z.L(34));
        const settle = bowl.add(id);
        const r = bowl.rimAt();
        pop(Cook.display(id), r.x + z.L(GLASS_W * 0.36), r.y - z.L(40), {
          speakId: id,
        });
        await settle;
        z.progress({ layer: id, n: got.length });
        busy--;
      }

      /* ---------- level 4: the card starts folded ---------- */
      if (ctx.intro) await ctx.intro;
      const unfold = foldCard(level >= 4);

      let tries = 0;
      try {
        /* ---------- first time: the ghost finger shows row 1 -> its bowl -> the drop -> the tick ---------- */
        Cook.save.coached = Cook.save.coached || {};
        if (!Cook.save.coached["assemble-v2"] && flat.length > 1 && items[C.next(got)] && !ctx.noDemo) {
          Cook.save.coached["assemble-v2"] = true;
          z.expect({ kind: "wait" });
          const first = C.next(got);
          const f = ghost();
          try {
            const row = level >= 4 ? null : document.querySelector("#mission .oc-card .oc-part:not(.no)") || document.querySelector("#mission .oc-card .oc-row:not(.no)");
            if (row && row.offsetParent) {
              const b = row.getBoundingClientRect();
              f.at(b.left + b.width * 0.35, b.top + b.height * 0.55, true);
              await Cook.wait(250);
              await f.tap(b.left + b.width * 0.35, b.top + b.height * 0.55);
              Lang.speakWord(first).catch(() => {});
              await Cook.wait(700);
            }
            const c = S.centre(items[first]);
            const sp = UI.worldToScreen(c.x, c.y);
            f.at(sp.x, sp.y, !(row && row.offsetParent));
            await Cook.wait(800);
            await f.tap(sp.x, sp.y);
            const into = drop(first);
            const r = bowl.rimAt();
            const rp = UI.worldToScreen(r.x, r.y + z.L(40));
            f.at(rp.x, rp.y);
            await into;
            await Cook.wait(250);
            const done = document.querySelector("#mission .oc-card .oc-part.done") || document.querySelector("#mission .oc-card .oc-row.done");
            if (done && done.offsetParent && level < 4) {
              const b = done.getBoundingClientRect();
              f.at(b.right - 26, b.top + b.height / 2);
              await Cook.wait(900);
            }
          } finally {
            f.gone();
          }
          Cook.writeSave();
        }

        /* ---------- the review (X10 / Q1): their big round face over the glass, no body ---------- */
        let look = null;
        const review = async (ok) => {
          const r = bowl.rimAt();
          look = await Cook.Kit.review(S, { who, ok, x: r.x, y: r.y - z.L(120), size: z.L(250), k: z.L(1), side: "right" });
        };

        /* ---------- build, serve, taste (and build again if it's not right) ---------- */
        for (;;) {
          let last = 0;
          building = true;
          for (;;) {
            const r = await St.freePick(z, {
              items,
              next: C.next(got),
              doneOk: got.length > 0,
              doneGlow: guided && got.length >= C.total,
            });
            if (r.done) break;
            if (performance.now() - last < 220) continue; // a double tap
            last = performance.now();
            z.expect({ kind: "wait" });
            await drop(r.id);
          }
          building = false;
          while (busy) await Cook.wait(60);
          z.expect({ kind: "wait" });
          tries++;
          // serve: their face comes up over the glass (no pretend eating)
          await Cook.wait(250);
          const m = C.mistake(got);
          if (!m) {
            // right: a happy face and the family's praise
            if (exclude.length) UI.mission.closeItem(exclude, dishNo());
            if (!guided && tries === 1 && !firstWrong) flat.forEach((id) => Cook.markRight(id));
            await review(true);
            // a moment to enjoy it before the end of the station
            await Cook.wait(900);
            await look.close();
            break;
          }
          // not quite: a gentle face, they say what they asked for again, the glass comes back empty
          // (only the first mistake counts: the ear star and the end review)
          firstMiss(m);
          await review(false);
          const line = orderLine(ladderOf(ctx));
          // level 4 is from memory: they say it again, but it isn't written out (the card stays folded)
          if (line && level >= 4) await Promise.race([Lang.speak(line).catch(() => {}), Cook.wait(9000)]);
          else if (line) await Promise.race([St.customerSay(ctx, line, { hide: St.hideKnown(ctx) }), Cook.wait(9000)]);
          St.customerDone();
          await Promise.all([look.close(), bowl.empty()]);
          got.length = 0;
          ticked.length = 0;
          // the card starts again (its misses stay for the review)
          const L = ladderOf(ctx);
          if (L) {
            Cook.Order.rows(L, { all: true }).forEach((r) => {
              if (r.head) return;
              r.done = false;
              r.got = 0;
            });
            L.sections.forEach((s) => (s.at = 0));
            UI.mission.refresh();
          }
        }
      } finally {
        unfold();
      }
      ctx.result.layers = got.slice();
      z.skill(tries === 1 && !firstWrong ? 100 : Math.max(55, 100 - 20 * Math.max(1, tries - 1)), "assemble");
      await Cook.wait(500);
      return got;
    },
  });

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
      });
    },
  });
})(window);
