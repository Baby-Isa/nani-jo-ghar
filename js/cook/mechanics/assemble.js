/*
 * Mechanic: assemble, the chaat station v2 (docs/design/cook-design-system-v1.md §14 + §14a; the
 * chai v2 grid and slots, §3, §4, §10). Toppings go into a clear glass bowl in the order the person said.
 *
 * ONE VIEWPOINT, FRONT-ON:
 *  - THE GLASS (centred in the scene, about 60% of the old bowl): a clear serving bowl seen from the
 *    side, a cross-section, so every layer stays visible. Each topping settles in as its own textured
 *    layer (potato cubes, chana, a dahi swirl, chutney drizzled over the layer below, sev, dhania,
 *    chilli), with a little drop and bounce; the top layer shows its surface, and its word pops by the
 *    glass with the family clip (§4: learning happens during the action).
 *  - THE SHELF (the bottom 26%): identical front-on prep bowls standing on one shelf line, a
 *    `🔊 word` chip under each: tap the bowl = use it, tap the chip = hear it. From level 3 the word
 *    hides and the speaker stays (the same chip). Decoys and the "don't" item stand there too.
 *  - NO TALLY at this station (§14a): the glass shows what's in.
 * The card (the shared order card, §12): each layer ticks its row as it goes in (UX 11, right or not);
 * the order is judged when you serve.
 * SERVE AND TASTE (§14a): Done -> the glass slides to the person, who tastes it.
 *  - right: a happy face and the family's praise clip (Shabash!);
 *  - wrong: a gentle "not quite" face, they say their order again, the glass slides back EMPTY and you
 *    build it again. Never a red cross; only the first try counts (the ear star, the end review).
 * LEVELS (§14, §14a; the recipe's slots by level in data/cook.json, the decoys in
 * data.mechanics.assemble): 1 = three layers, no decoys; 2 = decoys; 3 = a "don't" row (and the words
 * hide on the chips); 4 = the person's card starts FOLDED (face + headline): remember what you heard;
 * tapping the card to peek costs a hint (the light-bulb badge).
 * ONBOARDING (first time, §14): a ghost finger shows card row 1 -> the matching bowl -> the drop into
 * the glass -> the tick; then the child does row 2.
 * Art: assets/cook/items/chaat-v2/ (build/gen_chaat_v2.py, build/cut_chaat_v2.py; the glass's measured
 * inside in its meta.json, copied below so the station needs no extra fetch).
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
      face.src = Cook.v(`assets/cook/characters/${who}-badge.webp`);
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

  /* ---------- the chaat v2 station ---------- */
  const V2 = "assets/cook/items/chaat-v2/";
  // what build/cut_chaat_v2.py measured: the glass (its inside wall per row, as fractions of the sprite)
  const GLASS = {
    w: 890,
    h: 570,
    rim: 0.142, // the rim's centre line
    floor: 0.87, // the lowest point of the inside floor's front edge
    ery: 0.12, // a level's surface is an ellipse this flat (ry / rx): a little flatter than the rim, so the layers read
    // prettier-ignore
    inside: [[0.4344, 0.5308], [0.2242, 0.7522], [0.1332, 0.8713], [0.0771, 0.9274], [0.0456, 0.9578], [0.0276, 0.9735], [0.022, 0.9758], [0.0242, 0.9724], [0.0287, 0.9656], [0.0332, 0.9611], [0.0355, 0.9589], [0.0377, 0.9567], [0.0411, 0.9533], [0.0433, 0.9499], [0.0467, 0.9477], [0.0501, 0.9432], [0.0523, 0.9398], [0.0568, 0.9387], [0.0591, 0.9353], [0.0636, 0.9319], [0.0669, 0.9274], [0.0692, 0.9241], [0.0737, 0.9196], [0.0782, 0.9162], [0.0816, 0.9117], [0.086, 0.9072], [0.0917, 0.9027], [0.0973, 0.8971], [0.1051, 0.8904], [0.113, 0.8825], [0.1231, 0.8735], [0.1321, 0.8645], [0.149, 0.8477], [0.1681, 0.8286], [0.1894, 0.8095], [0.2085, 0.7915], [0.2265, 0.7746], [0.2456, 0.7578], [0.2793, 0.7252], [0.3366, 0.6713], [0.4917, 0.5196]],
  };
  const PREP = { w: 303, h: 293 };
  /* the grid (design px, 1600x900), the same as chai v2's */
  const SHELF_TOP = 666; // §3: the scene is the top 74%, the shelf band the bottom 26%
  const BASE = 818; // the shelf line: every bowl stands on it
  const CHIP = { w: 128, h: 46, y: 860, hitW: 142, hitH: 80 };
  const PITCH = 150;
  const PREP_W = 122; // one slot's bowl (identical for every topping)
  const GLASS_W = 440; // about 60% of the old bowl (§14)
  const GLASS_X = 800;
  const GLASS_BOTTOM = 578; // with chai v2's breathing space above the shelf
  const SERVE_X = 1050; // where the glass is tasted
  const PERSON_X = 1405;
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
  const HAS_ART = ["veg-01", "ph-chana", "ph-dahi", "ph-amli", "ph-lili", "ph-sev", "ph-dhana", "veg-12", "veg-02", "veg-03"];
  const RES = 1.5; // the layers' canvas, over the glass's design size (crisp on a big screen)

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

  /**
   * The glass bowl and its layers. Everything in the glass's own pixels (GLASS.w x GLASS.h), drawn onto
   * one canvas texture that sits just under the glass sprite (so the glass's highlights lie over the food).
   */
  function glassBowl(z, S, expected = 5) {
    const k = GLASS_W / GLASS.w; // design px per glass px
    const H = GLASS.h * k;
    const g = {
      x: z.X(GLASS_X),
      y: z.Y(GLASS_BOTTOM - H / 2),
      home: z.X(GLASS_X),
    };
    // one canvas for the layers (the last station's picture has gone by now)
    const key = "cv2-layers";
    if (S.textures.exists(key)) S.textures.remove(key);
    const tex = S.textures.createCanvas(key, Math.round(GLASS.w * RES * k), Math.round(GLASS.h * RES * k));
    const c = tex.getContext();
    const shadow = S.track(S.add.ellipse(g.x, z.Y(GLASS_BOTTOM - 4), z.L(GLASS_W * 0.78), z.L(26), 0x3a2410, 0.16).setDepth(D.item - 1));
    // the glass, then the food inside it, then the glass's highlights over the food
    const glass = S.track(
      S.add
        .image(g.x, g.y, "cv2-glass")
        .setDisplaySize(z.L(GLASS_W), z.L(H))
        .setDepth(D.item - 0.2),
    );
    const food = S.track(S.add.image(g.x, g.y, key).setDisplaySize(z.L(GLASS_W), z.L(H)).setDepth(D.item));
    const hi = S.textures.exists("cv2-glass-hi")
      ? S.track(
          S.add
            .image(g.x, g.y, "cv2-glass-hi")
            .setDisplaySize(z.L(GLASS_W), z.L(H))
            .setDepth(D.item + 0.2),
        )
      : null;
    const parts = [shadow, glass, food].concat(hi ? [hi] : []);
    const layers = []; // {id, th (glass px), grow}
    const img = (id, kind) => {
      const t = S.textures.exists(`cv2-${kind}-${id}`) ? S.textures.get(`cv2-${kind}-${id}`).getSourceImage() : null;
      return t && t.width ? t : null;
    };
    // a full layer: sized so the finished order fills about four fifths of the glass (a short order's layers are thicker)
    const full = () => ((GLASS.floor - GLASS.rim) * GLASS.h * 0.84) / Math.max(4, expected);
    /** A level's front edge (its lowest point is y): the lower half of its surface ellipse. */
    const level = (y) => {
      const f0 = insideAt(y / GLASS.h);
      const f = insideAt((y - GLASS.ery * f0.hw * GLASS.w) / GLASS.h); // the sides sit higher, where it's wider
      return {
        cx: f.cx * GLASS.w,
        hw: f.hw * GLASS.w * 0.985,
        ry: GLASS.ery * f.hw * GLASS.w,
      };
    };
    const front = (y, n = 28) => {
      const L = level(y);
      return Array.from({ length: n + 1 }, (_, i) => {
        const a = Math.PI - (Math.PI * i) / n; // left to right along the front
        return {
          x: L.cx + Math.cos(a) * L.hw,
          y: y - L.ry + Math.sin(a) * L.ry,
        };
      });
    };
    function surface(y, id, alpha = 1) {
      const L = level(y);
      const im = img(id, "top");
      c.save();
      c.globalAlpha = alpha;
      c.beginPath();
      c.ellipse(L.cx, y - L.ry, L.hw, L.ry, 0, 0, Math.PI * 2);
      c.clip();
      const col = ((Cook.data.words[id] || {}).layer || {}).color || "#d8c49a";
      c.fillStyle = col;
      if (!DRIZZLE[id]) c.fillRect(L.cx - L.hw, y - 2 * L.ry, 2 * L.hw, 2 * L.ry);
      if (im) {
        // the painted top-down art, its pile's middle, squashed to the surface's low angle
        const s = im.width * 0.78;
        c.drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, L.cx - L.hw * 1.04, y - 2 * L.ry - L.ry * 0.1, L.hw * 2.08, L.ry * 2.2);
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
    function band(y0, y1, id) {
      // the layer between two levels (y0 below, y1 above: glass px), its strip texture clipped to it
      const top = front(y1);
      const bot = front(y0).reverse();
      c.save();
      c.beginPath();
      top.concat(bot).forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      c.closePath();
      c.clip();
      const im = img(id, "band");
      const L = level(y0);
      const bx = L.cx - L.hw - 6;
      const bw = L.hw * 2 + 12;
      const bh = y0 - (y1 - level(y1).ry) + 8;
      if (!DRIZZLE[id]) {
        c.fillStyle = ((Cook.data.words[id] || {}).layer || {}).color || "#d8c49a";
        c.fillRect(bx, y1 - level(y1).ry - 4, bw, bh);
      }
      if (im) {
        const s = Math.max(bw / im.width, bh / im.height);
        const dw = im.width * s;
        c.drawImage(im, bx + (bw - dw) / 2, y1 - level(y1).ry - 4, dw, im.height * s);
      }
      // the glass's curve: a soft shade at both sides, so the layer reads as round
      const L1 = level((y0 + y1) / 2);
      const gr = c.createLinearGradient(L1.cx - L1.hw, 0, L1.cx + L1.hw, 0);
      gr.addColorStop(0, "rgba(40,25,10,0.28)");
      gr.addColorStop(0.18, "rgba(40,25,10,0)");
      gr.addColorStop(0.8, "rgba(40,25,10,0)");
      gr.addColorStop(1, "rgba(40,25,10,0.34)");
      c.fillStyle = gr;
      c.fillRect(bx, y1 - level(y1).ry - 8, bw, bh + 16);
      c.restore();
    }
    function draw() {
      c.setTransform(RES * k, 0, 0, RES * k, 0, 0);
      c.clearRect(0, 0, GLASS.w, GLASS.h);
      // every layer's thickness shrinks a little if the glass would overflow
      const want = layers.reduce((a, L) => a + (DRIZZLE[L.id] ? L.th * 0.45 : L.th), 0);
      const room = (GLASS.floor - GLASS.rim - 0.035) * GLASS.h;
      const fit = want > room ? room / want : 1;
      let y = GLASS.floor * GLASS.h;
      const tops = [];
      layers.forEach((L) => {
        const th = L.th * fit * L.grow;
        if (DRIZZLE[L.id]) {
          // a chutney: drizzled over the layer below (its ribbons lie on it) and a thin layer of its own
          const own = th * 0.45;
          band(y + (th - own), y - own, L.id);
          y -= own;
        } else {
          band(y, y - th, L.id);
          y -= th;
        }
        tops.push({ y, id: L.id });
      });
      // the top: its surface (a drizzle shows the layer under it too)
      const t = tops[tops.length - 1];
      if (t) {
        const under = tops.length > 1 && DRIZZLE[t.id] ? tops[tops.length - 2] : null;
        if (under) surface(t.y, under.id);
        surface(t.y, t.id);
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
        const L = { id, th: full() * (THIN[id] || 1), grow: 0 };
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
    const rows = Cook.Order.rows(L, { all: true }).filter((r) => !r.head);
    return Lang.join((L.head ? [L.head.line] : []).concat(rows.map((r) => (r.no || !r.said ? r.line : r.said))));
  };

  /**
   * Level 4 (§14a): the person's card starts folded (face + headline); a tap on it opens it for a
   * moment, and that peek costs a hint. The shared order card has no start-folded mode yet
   * (docs/overnight-queue.md), so this station folds it from outside: a class on the sidebar's
   * #mission (it survives the card being drawn again) and one small style rule.
   */
  function foldCard(on) {
    const m = document.querySelector("#mission");
    if (!m) return () => {};
    if (!document.querySelector("#cv2-fold-style")) {
      const st = document.createElement("style");
      st.id = "cv2-fold-style";
      st.textContent =
        "#mission.cv2-fold:not(.cv2-peek) .oc-card .oc-body{display:none}" +
        "#mission.cv2-fold:not(.cv2-peek) .oc-card{cursor:pointer}" +
        "#mission.cv2-fold.cv2-peek .oc-card{box-shadow:0 0 0 3px #C9962E,0 2px 8px rgba(40,25,10,.10)}";
      document.head.appendChild(st);
    }
    if (!on) return () => {};
    m.classList.add("cv2-fold");
    let timer = null;
    const peek = (e) => {
      const card = e.target.closest && e.target.closest(".oc-card");
      if (!card || e.target.closest(".oc-face") || m.classList.contains("cv2-peek")) return;
      e.stopPropagation();
      if (Cook.onHelp) Cook.onHelp("hint", { ids: [] });
      m.classList.add("cv2-peek");
      clearTimeout(timer);
      timer = setTimeout(() => m.classList.remove("cv2-peek"), 3500 / (Cook.speed || 1));
    };
    m.addEventListener("click", peek, true);
    return () => {
      clearTimeout(timer);
      m.removeEventListener("click", peek, true);
      m.classList.remove("cv2-fold", "cv2-peek");
    };
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
      const moods = ["neutral", "happy", "impatient"];
      await Promise.race([
        St.load(
          S,
          [
            ["cv2-glass", V2 + "glass-bowl.webp"],
            ["cv2-glass-hi", V2 + "glass-hi.webp"],
          ].concat(
            moods.map((m) => [`cv2-${who}-${m}`, `assets/cook/characters/${who}-${m}.webp`]),
            ...ids
              .filter((id) => HAS_ART.includes(id))
              .map((id) => [
                [`cv2-prep-${id}`, `${V2}prep-${id}.webp`],
                [`cv2-band-${id}`, `${V2}band-${id}.webp`],
                [`cv2-top-${id}`, `${V2}top-${id}.webp`],
              ]),
          ),
        ),
        Cook.wait(6000),
      ]);

      /* ---------- the scene: the softened marble, the shelf band (chai v2's) ---------- */
      S.track(
        S.add
          .rectangle(z.X(0), z.Y(0), z.L(1600), z.L(SHELF_TOP), INK.page, 0.5)
          .setOrigin(0)
          .setDepth(D.bg + 1),
      );
      const bandG = S.track(S.add.graphics().setDepth(D.bg + 1.2));
      bandG.fillStyle(INK.panel, 1);
      bandG.fillRect(z.X(0), z.Y(SHELF_TOP), z.L(1600), z.L(900 - SHELF_TOP));
      bandG.fillStyle(0x2a1a0a, 0.08);
      bandG.fillRect(z.X(0), z.Y(SHELF_TOP), z.L(1600), z.L(3));

      /* ---------- the glass ---------- */
      const bowl = glassBowl(z, S, flat.length);

      /* ---------- the shelf: identical prep bowls, a chip under each ---------- */
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
        const key = `cv2-prep-${id}`;
        let img;
        if (S.textures.exists(key)) {
          const sc = z.L(w) / PREP.w;
          img = S.track(
            S.add
              .image(z.X(x), z.Y(BASE), key)
              .setOrigin(0.5, 0.965)
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
      let busy = 0;
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
        const topKey = `cv2-top-${id}`;
        const spoon = S.textures.exists(topKey)
          ? S.track(
              S.add
                .image(obj.x, obj.y - obj.displayHeight * 0.7, topKey)
                .setDepth(D.fx)
                .setDisplaySize(z.L(64), z.L(64 * 0.62)),
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
        UI.mission.tickItem(id, dishNo());
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

      let person = null;
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

        /* ---------- the person, for the serve (they come in from the right) ---------- */
        const faceKey = (m) => (S.textures.exists(`cv2-${who}-${m}`) ? `cv2-${who}-${m}` : null);
        const personIn = async () => {
          const kN = faceKey("neutral");
          if (!kN) return null;
          const im = S.track(
            S.add
              .image(z.X(1760), z.Y(SHELF_TOP + 6), kN)
              .setOrigin(0.5, 1)
              .setDepth(D.bg + 1.1),
          );
          im.setScale((z.L(430) / im.height) * (who === "cousin" ? 0.92 : 1));
          im.baseScale = im.scaleX;
          await new Promise((r) =>
            S.tweens.add({
              targets: im,
              x: z.X(PERSON_X),
              duration: 520,
              ease: "Back.easeOut",
              onComplete: r,
            }),
          );
          return im;
        };
        const mood = (m) => {
          const key = person && faceKey(m);
          if (!key) return;
          person.setTexture(key);
          person.setScale((z.L(430) / person.height) * (who === "cousin" ? 0.92 : 1));
        };

        /* ---------- build, serve, taste (and build again if it's not right) ---------- */
        let firstWrong = null;
        for (;;) {
          let last = 0;
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
          while (busy) await Cook.wait(60);
          z.expect({ kind: "wait" });
          tries++;
          // serve: the glass slides to the person, who tastes it
          Cook.sfx.whoosh();
          person = person || (await personIn());
          await bowl.slide(z.X(SERVE_X));
          if (person) await new Promise((r) => S.tweens.add({ targets: person, x: person.x - z.L(26), angle: -3, duration: 260, yoyo: true, hold: 260, ease: "Sine.easeInOut", onComplete: r }));
        await bowl.tilt(-6);
          await Cook.wait(350);
          const m = C.mistake(got);
          if (!m) {
            // right: a happy face and the family's praise
            mood("happy");
            if (person)
              S.tweens.add({
                targets: person,
                y: person.y - z.L(14),
                duration: 160,
                yoyo: true,
                repeat: 1,
              });
            Cook.sfx.right();
            const rp = bowl.rimAt();
            S.sparkle(rp.x, rp.y);
            if (exclude.length) UI.mission.closeItem(exclude, dishNo());
            if (!guided && tries === 1) flat.forEach((id) => Cook.markRight(id));
            await pop(Lang.plain(Lang.line("welldone")).trim(), person ? person.x - z.L(40) : rp.x, z.Y(250), { line: Lang.line("welldone"), ms: 1900 });
            // a moment to enjoy it before the end of the station
            await Cook.wait(1400);
            break;
          }
          // not quite: a gentle face, they say what they asked for again, the glass comes back empty
          const wrong = m.got;
          let why;
          if (wrong && exclude.includes(wrong)) why = `added ${wrong} (they said no)`;
          else if (wrong && m.expected) why = `${wrong} instead of ${m.expected}`;
          else if (wrong) why = `added ${wrong} at the end`;
          else why = `forgot ${m.expected}`;
          if (!firstWrong) {
            // only the first try counts (the ear star and the end review)
            firstWrong = why;
            z.listen(false, why);
            if (m.expected) Cook.markMiss(m.expected);
            if (wrong && exclude.includes(wrong)) UI.mission.missItem(wrong, dishNo(), { no: true });
            else if (m.expected) UI.mission.missItem(m.expected, dishNo());
          }
          mood("impatient");
          if (person)
            S.tweens.add({
              targets: person,
              angle: { from: -2.5, to: 2.5 },
              duration: 160,
              yoyo: true,
              repeat: 2,
              onComplete: () => person.setAngle(0),
            });
          Cook.sfx.soft();
          await Cook.wait(500);
          const line = orderLine(ladderOf(ctx));
          // level 4 is from memory: they say it again, but it isn't written out (the card stays folded)
        if (line && level >= 4) await Promise.race([Lang.speak(line).catch(() => {}), Cook.wait(9000)]);
        else if (line) await Promise.race([St.customerSay(ctx, line, { hide: St.hideKnown(ctx) }), Cook.wait(9000)]);
          St.customerDone();
          await bowl.empty();
          got.length = 0;
          await bowl.slide(z.X(GLASS_X), 560);
          mood("neutral");
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
      z.skill(tries === 1 ? 100 : Math.max(55, 100 - 20 * (tries - 1)), "assemble");
      if (person)
        S.tweens.add({
          targets: person,
          x: z.X(1760),
          duration: 500,
          delay: 200,
          ease: "Sine.easeIn",
        });
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
