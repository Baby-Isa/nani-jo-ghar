/*
 * H-taste -> the sore spots (clinic v2; the 1 Oct play-test D15e, decision 27; CLN-54, CLN-55).
 *
 * Why: "My tongue is sore." / "Let's soothe the sore spots."
 * 1. Pop: sore spots pop up and down on the tongue in three colours (whack-a-mole). The doctor says which to pop;
 *    the child dabs those with a cotton bud dipped in a soothing ointment (never a pin, decision 27) and they pop
 *    with a sparkle; the others (the decoys) stay. Dabbing a decoy does nothing to it and counts in the review.
 * 2. The drink: the doctor names one drink; the child pours its milk or water into the tumbler (the kitchen kit's
 *    pour look: the jug flies over, tips, a stream, the level rises), adds its one thing (by the spoon from level 2:
 *    "ba chamchi hardar waaro dudh"), stirs, and gives it: the patient drinks and the spots left fade away.
 *    The wrong drink: the patient pulls a face, the spots stay, and another can be made (the first given is scored).
 * Levels (each adds one thing, E6): L1 one colour + the drink (the first play is the guided round, D13); L2 two
 * colours, the drink with a spoon count; L3 "not the red ones" (*na*: pop every colour but the one said), faster
 * spots, heard only (the closed card). The colours are English placeholders until the recording (to record).
 * Rows (the words decide): the spots popped (only the colours said) and the drink given first.
 * Art swaps in by file name: data art.* (the art plan's M2 tongue, O2 spots, O3 bud) once ready.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  // the spot colours: the clinic's colour words (data/clinic.json col-*; English placeholders, to record)
  const COLS = { red: { lex: "col-red", hex: "#d8433f" }, green: { lex: "col-green", hex: "#3fa35b" }, blue: { lex: "col-blue", hex: "#3f6fd8" } };
  // the things on the counter, each by its id (an alias in the engine's data/lang/lexicon.json): no Kutchi in this file (R5, 4e)
  const THINGS = {
    milk: { lex: "cook-dudh", img: "assets/clinic/items-v2/milk-jug.webp", glyph: "🥛", liquid: "#f7f3ea" },
    water: { lex: "cook-paani", img: "assets/clinic/items-v2/water-jug.webp", glyph: "💧", liquid: "#d4e9f4" },
    turmeric: { lex: "spi-01", img: "assets/clinic/items-v2/turmeric-bowl.webp", glyph: "🟡", tint: "#e3a21a" },
    honey: { lex: "cl-honey", img: "assets/clinic/items-v2/honey-jar.webp", glyph: "🍯", tint: "#d99a2b" },
    ginger: { lex: "veg-14", img: "assets/clinic/items-v2/ginger.webp", glyph: "🫚", tint: "#cfa968" },
    lemon: { lex: "fru-02", img: "assets/clinic/items-v2/lemon-half.webp", glyph: "🍋", tint: "#efe04a" },
  };
  const SPOON = { img: "assets/clinic/items-v2/teaspoon.webp", glyph: "🥄" };
  const BUD = { img: "assets/clinic/items-v2/cotton-buds.webp", glyph: "🩹" };
  // four drinks, each a liquid poured and one thing added (four, so a blind guess at level 1 stays under 10%:
  // 1/3 for the colour x 1/4 for the drink); named with the frames the clinic already had (hardar waaro dudh,
  // aadu ne paani): "{thing} waaro {milk}", "{thing} ne {water}"
  const DRINKS = {
    "turmeric-milk": { liquid: "milk", add: "turmeric", join: "with", mixed: "#f1c242" },
    "honey-milk": { liquid: "milk", add: "honey", join: "with", mixed: "#f2dfae" },
    "ginger-water": { liquid: "water", add: "ginger", join: "and", mixed: "#e7d8a2" },
    "lemon-water": { liquid: "water", add: "lemon", join: "and", mixed: "#eef0b4" },
  };
  const drinkName = (id, n) => {
    const d = DRINKS[id];
    const Lg = HS.L;
    const head = n != null ? { fn: "Unit", n, unit: "cl-chamchi", of: THINGS[d.add].lex } : Lg.item(THINGS[d.add].lex); // "ba chamchi …": the engine's Unit
    return d.join === "with" ? Lg.join([head, "cl-waaro", THINGS[d.liquid].lex]) : Lg.join([head, Lg.also(THINGS[d.liquid].lex)]);
  };
  const K = {
    pop: { 1: 1, 2: 2, 3: 2 }, // colours to pop (L3: every colour but the one said)
    each: { 1: 3, 2: 2, 3: 2 }, // spots of each popping colour
    decoys: { 1: 2, 2: 2, 3: 3 }, // spots of each other colour
    upMs: { 1: 2600, 2: 2100, 3: 1500 },
    maxUp: { 1: 3, 2: 4, 3: 4 },
    counts: { 2: [1, 2, 3], 3: [1, 2, 3] },
  };
  const WHY = { problem: "taste-why", goal: "taste-goal" }; // line keys in data/clinic/heal/taste.json (the engine says them)
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    pop: { gesture: "tap", then: "tap" },
    drink: { gesture: "tap", then: "tap" }, // the drink's moves: pour, add, stir, give (each shown as it comes)
    pour: { gesture: "tap" },
    give: { gesture: "tap" },
  };

  function plan(level, rng, data) {
    const L = Math.max(1, Math.min(3, level));
    const lv = (data && data.levels && data.levels[L]) || {};
    const Lg = HS.L;
    const colours = HS.shuffle(Object.keys(COLS), rng);
    const nPop = lv.pop || K.pop[L];
    // L3: the doctor names the one colour NOT to pop
    const not = L === 3 ? colours[0] : null;
    const targets = L === 3 ? colours.slice(1) : colours.slice(0, nPop);
    const spots = [];
    colours.forEach((c) => {
      const n = targets.includes(c) ? lv.each || K.each[L] : lv.decoys || K.decoys[L];
      for (let k = 0; k < n; k++) spots.push({ colour: c, target: targets.includes(c) });
    });
    const spotWord = (c) => Lg.item("taste-spots", { mods: [COLS[c].lex] });
    const popM = not ? Lg.join(["taste-pop", "taste-spots", ",", spotWord(not), "ph-no"]) : Lg.join(["taste-pop", spotWord(targets[0])].concat(targets.slice(1).map((c) => Lg.also(spotWord(c)))));
    const drink = HS.pick(Object.keys(DRINKS), rng);
    const counts = (lv.counts || K.counts[L]) || null;
    const n = counts ? HS.pick(counts, rng) : null;
    const steps = [
      { id: "pop", kind: "pop", targets, not, row: Object.assign({ id: "pop" }, Lg.show(popM, { cap: true })) },
      { id: "drink", kind: "drink", drink, n, row: Object.assign({ id: "drink" }, Lg.show(Lg.join(["cl-make", drinkName(drink, n)]), { cap: true })) },
    ];
    // the blind player's choices: which colours to pop (one of the colour sets), which drink (and how many spoons)
    // (in a fixed order: the screen shows the colours mixed over the tongue, never in the order said)
    const all = Object.keys(COLS);
    const sets = L === 1 ? all.map((c) => [c]) : L === 2 ? all.flatMap((a, i) => all.slice(i + 1).map((b) => [a, b].sort())) : all.map((c) => all.filter((x) => x !== c).sort());
    const dOpts = [].concat(...Object.keys(DRINKS).map((d) => (counts ? counts.map((k) => `${d}x${k}`) : [d])));
    const rows = [
      { id: "pop", options: sets.map((x) => x.join("+")), answer: targets.slice().sort().join("+"), placeholder: true }, // the colours wait for the recording
      { id: "drink", options: dOpts, answer: counts ? `${drink}x${n}` : drink },
    ];
    const words = [Lg.w("taste-spots"), ...colours.map((c) => Lg.w(COLS[c].lex)), Lg.w(THINGS[DRINKS[drink].add].lex), Lg.w(THINGS[DRINKS[drink].liquid].lex)];
    if (not) words.push(Lg.w(Lg.noId()));
    if (n != null) words.push(Lg.w("cl-chamchi"), Lg.num(n));
    return { level: L, colours, targets, not, spots, drink, n, steps, rows, words, upMs: lv.upMs || K.upMs[L], maxUp: lv.maxUp || K.maxUp[L] };
  }

  function mount(stage, ctx) {
    const data = ctx.data || {};
    const P = plan(ctx.level, ctx.rng, data);
    const S = HS.make(stage, ctx, { place: "head", game: "taste" });
    const { s } = S;
    const Kit0 = root.Clinic && root.Clinic.Kit;
    const url = (u) => (Kit0 && Kit0.url ? Kit0.url(u) : u);
    const fast = () => !!(Kit0 && Kit0.fast);
    const kind = S.kind || (ctx.patient && ctx.patient.kind) || "girl";
    const art = (key) => {
      const a = data.art && data.art[key];
      // A1: a {kind} picture only for the kinds that have it cut (a.kinds); the @2x on dense screens (a.has2x)
      if (!a || !a.ready || !a.src || (a.kinds && a.src.includes("{kind}") && !a.kinds.includes(kind))) return null;
      const two = a.has2x && (root.devicePixelRatio || 1) > 1.25;
      return Object.assign({}, a, { src: a.src.replace("{kind}", kind).replace(two ? /\.webp$/ : /$^/, "@2x.webp") });
    };
    const hexOf = (c) => (data.colours && data.colours[c]) || COLS[c].hex;
    const st = { i: 0, judged: {}, over: false, busy: false, glass: null, gave: false, wrongDab: false, gone: false };
    const cur = () => P.steps[st.i] || null;
    ctx.card.setRows(P.steps.map((x) => x.row));

    // a small tween on the frame clock (attributes, not styles): fn(u) for u 0 -> 1
    const tween = (ms, fn) =>
      new Promise((res) => {
        if (fast() || !root.requestAnimationFrame) {
          fn(1);
          return res();
        }
        const t0 = Date.now();
        const step = () => {
          if (st.gone) return res();
          const u = Math.min(1, (Date.now() - t0) / ms);
          fn(u);
          if (u < 1) root.requestAnimationFrame(step);
          else res();
        };
        step();
      });
    const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

    /* ---------------- the mouth, the tongue out (M2; a drawn stand-in until the art is ready) ---------------- */
    const skin = S.skin || "#c99a74";
    const T = { x: 400, y: 285 }; // the tongue's middle
    const tongueArt = art("tongue");
    const mouthG = s("g", {}, S.layer);
    if (tongueArt) s("image", { href: url(tongueArt.src), x: tongueArt.box[0], y: tongueArt.box[1], width: tongueArt.box[2], height: tongueArt.box[3], preserveAspectRatio: "xMidYMid slice" }, mouthG);
    else {
      s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: skin }, mouthG);
      s("ellipse", { cx: 400, cy: 150, rx: 250, ry: 128, fill: "#c4636b" }, mouthG); // the lips
      s("ellipse", { cx: 400, cy: 150, rx: 222, ry: 102, fill: "#4e1620" }, mouthG);
      for (let k = 0; k < 6; k++) s("rect", { x: 245 + k * 53, y: 52, width: 48, height: 44, rx: 12, fill: "#fbf8ef", stroke: "#dcd3c2", "stroke-width": 2 }, mouthG);
      // the tongue, out and down over the lower lip
      s("path", { d: "M262 170 Q250 420 400 448 Q550 420 538 170 Q400 120 262 170Z", fill: "#e7838f", stroke: "#c9606e", "stroke-width": 5 }, mouthG);
      s("path", { d: "M400 175 L400 390", stroke: "#cf6a78", "stroke-width": 5, "stroke-linecap": "round" }, mouthG);
      s("path", { d: "M300 200 Q330 186 360 192", stroke: "#f6b5bd", "stroke-width": 9, "stroke-linecap": "round", fill: "none", opacity: 0.7 }, mouthG);
    }
    // the holes the spots pop out of: eight places over the tongue
    const HOLES = (data.holes || [[320, 215], [400, 210], [480, 215], [305, 290], [375, 280], [445, 290], [495, 300], [345, 360], [440, 365]]).slice();
    const holeOrder = HS.shuffle(HOLES.map((_, i) => i), ctx.rng);
    // TA4 (CLN-104): the purple holes are cleared when the tongue is fixed (they're kept to fade at the end)
    const holeEls = HOLES.map(([x, y]) => s("ellipse", { cx: x, cy: y + 6, rx: 15, ry: 6, fill: "#c9606e", opacity: 0.55 }, mouthG));
    const spotsG = s("g", {}, S.layer);
    const fxG = s("g", {}, S.fx);
    const R = 26;
    // each spot lives in one hole (spots of a level fit the holes: at most nine)
    const spots = P.spots.map((sp, k) => {
      const [x, y] = HOLES[holeOrder[k % HOLES.length]];
      const g = s("g", { transform: `translate(${x} ${y}) scale(0)` }, spotsG);
      const a = art(`spot-${sp.colour}`);
      if (a) s("image", { href: url(a.src), x: -R * 1.25, y: -R * 1.25, width: R * 2.5, height: R * 2.5 }, g);
      else {
        s("circle", { r: R, fill: hexOf(sp.colour), stroke: "rgba(0,0,0,.25)", "stroke-width": 3 }, g);
        s("ellipse", { cx: -8, cy: -9, rx: 9, ry: 6, fill: "#fff", opacity: 0.55 }, g);
      }
      return Object.assign({ x, y, g, up: 0, state: "down", until: 0 }, sp);
    });
    const setK = (sp, k) => {
      sp.up = k;
      sp.g.setAttribute("transform", `translate(${sp.x} ${sp.y - 6 * k}) scale(${Math.max(0, k)})`);
    };
    const rise = (sp, ms) => {
      sp.state = "rising";
      sp.until = Date.now() + ms;
      return tween(fast() ? 1 : 260, (u) => setK(sp, ease(u) * 1.08 - 0.08 * u)).then(() => {
        if (sp.state === "rising") sp.state = "up";
      });
    };
    const sink = (sp) => {
      if (sp.state === "popped" || sp.state === "down") return Promise.resolve();
      sp.state = "sinking";
      const from = sp.up;
      return tween(fast() ? 1 : 260, (u) => setK(sp, from * (1 - u))).then(() => {
        if (sp.state === "sinking") sp.state = "down";
      });
    };
    // the whack-a-mole clock: spots come up for a while and go down; the colours to pop keep coming back
    let lastTarget = 0;
    const tick = () => {
      if (st.over || st.gone) return;
      const c = cur();
      if (!c || c.kind !== "pop") return;
      const now = Date.now();
      spots.forEach((sp) => sp.state === "up" && now > sp.until && sink(sp));
      const upN = spots.filter((sp) => sp.state === "up" || sp.state === "rising").length;
      if (upN < P.maxUp) {
        const down = spots.filter((sp) => sp.state === "down");
        const tDown = down.filter((sp) => sp.target);
        // a colour to pop comes up at least every ~1.5 s, so nobody waits long (E29)
        const pickT = tDown.length && (now - lastTarget > 1500 || ctx.rng() < 0.5);
        const pool = pickT ? tDown : down.filter((sp) => !sp.target).length ? down.filter((sp) => !sp.target) : down;
        if (pool.length) {
          const sp = HS.pick(pool, ctx.rng);
          if (sp.target) lastTarget = now;
          rise(sp, P.upMs * (fast() ? 3 : 1) * (0.8 + ctx.rng() * 0.4));
        }
      }
      ctx.after(fast() ? 120 : 380, tick);
    };

    /* ---------------- the cotton bud (O3: dipped in the soothing ointment) ---------------- */
    const budArt = art("budOintment");
    const budG = s("g", { opacity: 0 }, S.fx);
    if (budArt && budArt.size) {
      // A2 (5 Oct): O3's bud is a horizontal picture, the ointment on its right-hand swab: that swab's centre on
      // the dab point, the stick up and a little to the right
      const [bw, bh] = budArt.size;
      const k = 150 / Math.max(1, bw - 32);
      const g = s("g", { transform: `rotate(110) translate(${-(bw - 16 - (bh - 32) / 2) * k} ${-(bh / 2) * k})` }, budG);
      s("image", { href: url(budArt.src), x: 0, y: 0, width: bw * k, height: bh * k }, g);
    } else if (budArt) s("image", { href: url(budArt.src), x: -8, y: -150, width: 60, height: 160 }, budG);
    else {
      s("rect", { x: -3, y: -150, width: 7, height: 140, rx: 3, fill: "#e9dcc4", transform: "rotate(18)" }, budG);
      s("ellipse", { cx: 0, cy: -6, rx: 13, ry: 19, fill: "#fbfbf8", stroke: "#d8d4ca", "stroke-width": 2 }, budG);
      s("ellipse", { cx: 0, cy: 4, rx: 11, ry: 9, fill: "#a8d8a8", opacity: 0.9 }, budG); // the ointment on its tip
    }
    const dab = (sp) =>
      tween(fast() ? 1 : 220, (u) => {
        budG.setAttribute("opacity", 1);
        budG.setAttribute("transform", `translate(${sp.x} ${sp.y - 6 - 30 * (1 - Math.sin(u * Math.PI))})`);
      }).then(() => ctx.after(fast() ? 10 : 160, () => budG.setAttribute("opacity", 0)));
    const sparkle = (x, y, col) => {
      const g = s("g", { transform: `translate(${x} ${y})` }, fxG);
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        s("line", { x1: Math.cos(a) * 14, y1: Math.sin(a) * 14, x2: Math.cos(a) * 30, y2: Math.sin(a) * 30, stroke: k % 2 ? "#fff6c8" : col, "stroke-width": 5, "stroke-linecap": "round" }, g);
      }
      tween(fast() ? 1 : 420, (u) => {
        g.setAttribute("transform", `translate(${x} ${y}) scale(${0.6 + u})`);
        g.setAttribute("opacity", 1 - u);
      }).then(() => g.remove());
    };

    /* ---------------- the drink: the tumbler, the pour, the spoon ---------------- */
    const GL = { x: 150, y: 330, w: 116, h: 150 }; // the tumbler (its art: 278 x 359)
    const glassG = s("g", { opacity: 0 }, S.layer);
    // a small wooden tray for it to stand on (a flat base, a contact shadow)
    s("rect", { x: GL.x - 34, y: GL.y + GL.h - 12, width: GL.w + 68, height: 26, rx: 12, fill: "#b78a55", stroke: "#93683c", "stroke-width": 3 }, glassG);
    s("ellipse", { cx: GL.x + GL.w / 2, cy: GL.y + GL.h - 4, rx: GL.w * 0.48, ry: 7, fill: "#000", opacity: 0.18 }, glassG); // contact shadow
    s("image", { href: url("assets/clinic/items-v2/tumbler.webp"), x: GL.x, y: GL.y, width: GL.w, height: GL.h }, glassG);
    const TOP = { x: GL.x + GL.w / 2, y: GL.y + GL.h * 0.14, rx: GL.w * 0.4, ry: GL.h * 0.055 };
    // TA2 (CLN-104): the drink fills the glass from the bottom up and looks like what's in it (milk white and opaque,
    // water clear and pale blue, the mixed drinks their own colour); its surface rides up with it
    const BOT = GL.y + GL.h * 0.9;
    const cid = `taste-glass-${Math.floor(ctx.rng() * 1e6)}`;
    const clip = s("clipPath", { id: cid }, s("defs", {}, S.svg));
    s("path", { d: `M${GL.x + GL.w * 0.1} ${TOP.y} L${GL.x + GL.w * 0.9} ${TOP.y} L${GL.x + GL.w * 0.84} ${BOT} Q${TOP.x} ${BOT + 8} ${GL.x + GL.w * 0.16} ${BOT}Z` }, clip);
    const body = s("rect", { x: GL.x, y: BOT, width: GL.w, height: 0, fill: "#fff", opacity: 0, "clip-path": `url(#${cid})` }, glassG);
    const liquid = s("ellipse", { cx: TOP.x, cy: TOP.y + 4, rx: TOP.rx, ry: TOP.ry, fill: "#fff", opacity: 0 }, glassG);
    const level = (u, col, op) => {
      const y = BOT - (BOT - TOP.y - 4) * u;
      body.setAttribute("y", y);
      body.setAttribute("height", Math.max(0, BOT - y + 10));
      liquid.setAttribute("cy", y);
      if (col) {
        body.setAttribute("fill", col);
        liquid.setAttribute("fill", col);
      }
      body.setAttribute("opacity", u > 0 ? op : 0);
      liquid.setAttribute("opacity", u > 0 ? Math.min(1, op + 0.15) : 0);
    };
    const opOf = (id) => (id === "water" ? 0.55 : 0.95);
    const blob = s("ellipse", { cx: TOP.x - 6, cy: TOP.y + 3, rx: TOP.rx * 0.45, ry: TOP.ry * 0.6, fill: "#fff", opacity: 0 }, glassG);
    const glassArt = (key) => art(key);
    void glassArt;
    const toolSvg = (id) => {
      const el = S.toolEls[id];
      if (!el) return { x: 700, y: 250 };
      const r = el.getBoundingClientRect();
      return S.pt({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
    };
    // the kitchen kit's pour, drawn here: the jug flies over the glass, tips, a stream runs, the level rises, it goes home
    const pour = async (id) => {
      const t = THINGS[id];
      st.busy = true;
      const from = toolSvg(id);
      const g = s("g", {}, S.fx);
      s("image", { href: url(t.img), x: -50, y: -60, width: 100, height: 120 }, g);
      const to = { x: GL.x + GL.w + 30, y: GL.y - 60 };
      await tween(380, (u) => {
        const e = ease(u);
        g.setAttribute("transform", `translate(${from.x + (to.x - from.x) * e} ${from.y + (to.y - from.y) * e - 60 * Math.sin(u * Math.PI)})`);
      });
      await tween(220, (u) => g.setAttribute("transform", `translate(${to.x} ${to.y}) rotate(${-100 * u})`));
      const stream = s("path", { d: `M${to.x - 50} ${to.y - 10} Q${TOP.x + 20} ${to.y + 10} ${TOP.x} ${TOP.y}`, stroke: t.liquid, "stroke-width": 9, fill: "none", "stroke-linecap": "round", opacity: id === "water" ? 0.75 : 0.95 }, S.fx);
      await tween(760, (u) => level(u, t.liquid, opOf(id)));
      stream.remove();
      await tween(180, (u) => g.setAttribute("transform", `translate(${to.x} ${to.y}) rotate(${-100 * (1 - u)})`));
      await tween(300, (u) => {
        const e = ease(u);
        g.setAttribute("transform", `translate(${to.x + (from.x - to.x) * e} ${to.y + (from.y - to.y) * e})`);
      });
      g.remove();
      st.busy = false;
    };
    const addIn = async (id) => {
      const t = THINGS[id];
      st.busy = true;
      const from = toolSvg(id);
      const g = s("g", {}, S.fx);
      s("image", { href: url(t.img), x: -36, y: -36, width: 72, height: 72 }, g);
      await tween(360, (u) => {
        const e = ease(u);
        g.setAttribute("transform", `translate(${from.x + (TOP.x - from.x) * e} ${from.y + (TOP.y - 30 - from.y) * e - 50 * Math.sin(u * Math.PI)}) scale(${1 - 0.5 * e})`);
      });
      blob.setAttribute("fill", t.tint);
      blob.setAttribute("opacity", 0.9);
      g.remove();
      ctx.sfx("tap");
      st.busy = false;
    };
    const stir = async () => {
      st.busy = true;
      const g = s("g", {}, S.fx);
      s("image", { href: url(SPOON.img), x: -10, y: -90, width: 40, height: 100, transform: "rotate(-70)" }, g);
      await tween(700, (u) => g.setAttribute("transform", `translate(${TOP.x + Math.cos(u * 4 * Math.PI) * TOP.rx * 0.5} ${TOP.y + Math.sin(u * 4 * Math.PI) * TOP.ry * 0.5})`));
      g.remove();
      const gl = st.glass;
      const d = Object.keys(DRINKS).find((k) => DRINKS[k].liquid === gl.liquid && Object.keys(gl.adds).length === 1 && gl.adds[DRINKS[k].add]);
      if (gl.liquid) level(1, d ? DRINKS[d].mixed : THINGS[gl.liquid].liquid, d ? 0.95 : opOf(gl.liquid));
      else level(0);
      blob.setAttribute("opacity", 0);
      gl.stirred = true;
      st.busy = false;
    };
    // a glow on the next thing after a pause (E16: a hint after hesitation); it goes when the child acts
    let nudgeT = null;
    const nudge = (el, still) => {
      clearTimeout(nudgeT);
      [S.toolEls.spoon, glassG].forEach((x) => x && x.classList.remove("pulse"));
      if (!el) return;
      nudgeT = setTimeout(() => !st.over && still() && el.classList.add("pulse"), fast() ? 200 : 1800);
    };
    const emptyGlass = () => {
      st.glass = { liquid: null, adds: {}, stirred: false, slip: false };
      level(0);
      blob.setAttribute("opacity", 0);
    };
    emptyGlass();

    const judge = (id, ok, detail) => {
      if (id in st.judged) return;
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };

    /* ---------------- the steps ---------------- */
    // the first-time help's second move: once the bud is in hand, a spot of the colour said, when one is up
    const upTarget = () => spots.find((q) => q.target && (q.state === "up" || q.state === "rising"));
    const cueSpot = () => {
      const c = cur();
      if (!c || c.kind !== "pop" || st.over) return;
      if (!upTarget()) return ctx.after(250, cueSpot);
      S.cue("pop-spot", { gesture: "tap" }, () => {
        const q = upTarget();
        return q ? { x: q.x, y: q.y - 6, r: R + 10 } : null;
      });
    };
    const popTools = () => S.tools([{ id: "bud", glyph: BUD.glyph, img: BUD.img }], (id) => id === "bud" && ctx.after(200, cueSpot));
    const drinkTools = () =>
      S.tools(
        Object.keys(THINGS)
          .map((id) => ({ id, glyph: THINGS[id].glyph, img: THINGS[id].img }))
          .concat([{ id: "spoon", glyph: SPOON.glyph, img: SPOON.img }]),
        (id) => onThing(id)
      );
    const open = () => {
      const c = cur();
      ctx.card.now(c.id);
      if (c.kind === "pop") {
        popTools();
        tick();
        S.cue("pop", { gesture: "tap" }, S.toolEls.bud);
      }
      if (c.kind === "drink") {
        drinkTools();
        glassG.setAttribute("opacity", 1);
        S.cue("drink", CUES.pour, S.toolEls[DRINKS[c.drink].liquid]);
      }
    };
    const closePop = () => {
      const c = cur();
      judge("pop", !st.wrongDab, { targets: c.targets, decoyDabbed: st.wrongDab });
      ctx.card.tick("pop");
      S.uncue();
      // the spots left (the decoys) come up and stay up for the drink to clear
      spots.forEach((sp) => sp.state !== "popped" && sp.state !== "up" && rise(sp, 1e9));
      st.i++;
      st.busy = true;
      ctx.after(fast() ? 100 : 700, () => {
        st.busy = false;
        open();
      });
    };
    const onSpot = (sp) => {
      if (st.busy) return;
      dab(sp);
      S.did();
      if (sp.target) {
        sp.state = "popped";
        ctx.sfx("pop");
        sparkle(sp.x, sp.y, hexOf(sp.colour));
        tween(fast() ? 1 : 200, (u) => setK(sp, (1 - u) * 1.15));
        S.face("happy", 500);
        if (spots.filter((q) => q.target).every((q) => q.state === "popped")) {
          st.busy = true;
          ctx.after(fast() ? 100 : 500, () => {
            st.busy = false;
            if (cur() && cur().kind === "pop") closePop();
          });
        }
      } else {
        // a colour not asked for: the ointment does nothing to it; it stays (counted in the review, never shown now)
        st.wrongDab = true;
        ctx.log({ type: "extra", rowId: "pop", detail: `dabbed ${sp.colour}` });
        ctx.sfx("tap");
      }
    };
    const onThing = async (id) => {
      const c = cur();
      if (!c || c.kind !== "drink" || st.busy || st.over) return;
      const gl = st.glass;
      if (THINGS[id] && THINGS[id].liquid) {
        if (gl.liquid) return; // one liquid per glass
        gl.liquid = id;
        gl.stirred = false;
        S.uncue();
        await pour(id);
        if (cur() === c) S.cue("add", { gesture: "tap" }, S.toolEls[DRINKS[c.drink].add]);
        return;
      }
      if (THINGS[id]) {
        gl.adds[id] = (gl.adds[id] || 0) + 1;
        gl.stirred = false;
        if (P.level >= 2) ctx.tally(id, gl.adds[id]);
        S.uncue();
        await addIn(id);
        // TA3 (CLN-104): the next step is cued: the spoon glows after a short pause (stir it)
        nudge(S.toolEls.spoon, () => !st.glass.stirred);
        return;
      }
      if (id === "spoon") {
        if (!gl.liquid && !Object.keys(gl.adds).length) return;
        S.uncue();
        await stir();
        if (cur() === c) S.cue("give", CUES.give, { x: GL.x + GL.w / 2, y: GL.y + GL.h / 2, r: GL.w * 0.6 });
        // then the glass glows: give it to her
        nudge(glassG, () => st.glass.stirred && cur() === c && !st.busy);
      }
    };
    const glassKey = () => {
      const gl = st.glass;
      const adds = Object.keys(gl.adds);
      const d = Object.keys(DRINKS).find((k) => DRINKS[k].liquid === gl.liquid && adds.length === 1 && adds[0] === DRINKS[k].add);
      return d ? (P.n != null ? `${d}x${gl.adds[DRINKS[d].add]}` : d) : `${gl.liquid || "empty"}+${adds.join("+")}`;
    };
    const give = async () => {
      const c = cur();
      nudge(null);
      const gl = st.glass;
      if (!gl.stirred) return S.cue("stir", { gesture: "tap" }, S.toolEls.spoon);
      const key = glassKey();
      const want = P.rows.find((r) => r.id === "drink").answer;
      const ok = key === want;
      judge("drink", ok, { gave: key });
      st.busy = true;
      S.uncue();
      // the tumbler goes up to the mouth and tips
      const cx = GL.x + GL.w / 2;
      const cy = GL.y + GL.h / 2;
      await tween(420, (u) => glassG.setAttribute("transform", `translate(${(400 - cx) * ease(u) * 0.55} ${(150 - cy) * ease(u) * 0.6}) rotate(${-25 * u} ${cx} ${cy})`));
      S.face("drink", 700);
      await tween(300, (u) => level(1 - u, null, 0.95));
      await tween(300, (u) => glassG.setAttribute("transform", `translate(${(400 - cx) * (1 - u) * 0.55} ${(150 - cy) * (1 - u) * 0.6}) rotate(${-25 * (1 - u)} ${cx} ${cy})`));
      emptyGlass();
      if (ok) {
        // the spots left fade away
        await tween(fast() ? 1 : 700, (u) => {
          spots.forEach((sp) => sp.state !== "popped" && sp.g.setAttribute("opacity", 1 - u));
          holeEls.forEach((hEl) => hEl.setAttribute("opacity", 0.55 * (1 - u)));
        });
        ctx.card.tick("drink");
        S.face("happy");
        st.busy = false;
        finish();
      } else {
        S.face("sour", 900);
        S.say("taste-notthat", "patient");
        st.busy = false;
        ctx.after(fast() ? 50 : 900, () => cur() === c && S.cue("drink", CUES.pour, S.toolEls[DRINKS[c.drink].liquid]));
      }
    };
    const finish = () => {
      if (st.over) return;
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      S.say("taste-better", "patient");
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    // the taps on the close-up: a spot (with the bud), or the tumbler (give)
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over) return;
      const p = S.pt(e);
      const c = cur();
      if (!c) return;
      if (c.kind === "pop") {
        if (S.sel !== "bud") return;
        const hit = HS.nearest(p, spots.filter((sp) => sp.state === "up" || sp.state === "rising").map((sp) => Object.assign({ r: R * Math.max(0.6, sp.up) }, { x: sp.x, y: sp.y - 6, sp })), 14 * S.unit());
        if (hit) onSpot(hit.sp);
        return;
      }
      if (c.kind === "drink" && p.x > GL.x - 20 && p.x < GL.x + GL.w + 20 && p.y > GL.y - 30 && p.y < GL.y + GL.h + 10 && !st.busy) {
        if (!st.glass.liquid && !Object.keys(st.glass.adds).length) return;
        give();
      }
    });

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        open();
      },
      destroy() {
        st.gone = true;
        S.destroy();
      },
      debug: {
        get plan() {
          return P;
        },
        get cues() {
          return S.cueLog.slice();
        },
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy) return { do: "wait" };
          const tool = (id) => {
            const r = S.toolEls[id].getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: id };
          };
          if (c.kind === "pop") {
            if (S.sel !== "bud") return tool("bud");
            const sp = spots.find((q) => q.target && q.state === "up");
            return sp ? Object.assign({ do: "tap", what: "pop" }, S.client(sp.x, sp.y - 6)) : { do: "wait", ms: 120 };
          }
          const d = DRINKS[c.drink];
          const gl = st.glass;
          if (!gl.liquid) return tool(d.liquid);
          if ((gl.adds[d.add] || 0) < (P.n || 1)) return tool(d.add);
          if (!gl.stirred) return tool("spoon");
          return Object.assign({ do: "tap", what: "give" }, S.client(GL.x + GL.w / 2, GL.y + GL.h / 2));
        },
        slip() {
          // dab a spot of a colour not asked for, once
          const c = cur();
          if (!S.ready || st.busy || !c || c.kind !== "pop" || st.slipped) return null;
          if (S.sel !== "bud") return null;
          const sp = spots.find((q) => !q.target && q.state === "up");
          if (!sp) return null;
          st.slipped = true;
          return Object.assign({ do: "tap", what: "dab a decoy" }, S.client(sp.x, sp.y - 6));
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "taste",
    part: "mouth",
    ailments: ["coated-tongue"],
    items: ["dudh", "limu", "honey", "paani", "spoon"],
    gestures: ["tap"],
    levels: [1, 2, 3],
    plan,
    mount,
    bot,
    why: WHY,
    cues: CUES,
    steps: (level, rng) => plan(level, rng).steps.map((x) => x.kind),
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
