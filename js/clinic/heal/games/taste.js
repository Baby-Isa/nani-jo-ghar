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
 * Levels (each adds one thing, E6; Zafar's heal ladder, 13 Oct: all new things by L2, L3 heard only, harder from L4):
 * L1 one colour + the drink (the first play is the guided round, D13); L2 "not the red ones" (*na*: pop every colour
 * but the one said), the drink with a spoon count; L3 the same, heard only (the closed card); L4 faster, more decoys. The colours are English placeholders until the recording (to record).
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
    water: { lex: "cook-paani", img: "assets/clinic/items-v2/water-jug.webp", glyph: "💧", liquid: "#b9dbef" },
    turmeric: { lex: "spi-01", img: "assets/clinic/items-v2/turmeric-bowl.webp", glyph: "🟡", tint: "#e3a21a" },
    honey: { lex: "cl-honey", img: "assets/clinic/items-v2/honey-jar.webp", glyph: "🍯", tint: "#d99a2b" },
    ginger: { lex: "veg-14", img: "assets/clinic/items-v2/ginger.webp", glyph: "🫚", tint: "#cfa968" },
    lemon: { lex: "fru-02", img: "assets/clinic/items-v2/lemon-half.webp", glyph: "🍋", tint: "#efe04a" },
  };
  const SPOON = { img: "assets/clinic/items-v2/teaspoon.webp", glyph: "🥄" };
  const BUD = { img: "assets/clinic/items-s08b/cotton-bud-clean-s08b-sm.webp", glyph: "🩹" }; // CLN-195: the clean bud (its -sm copy: the strip draws it small)
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
    each: { 1: 3, 2: 2, 3: 2, 4: 2 }, // spots of each popping colour
    upMs: { 1: 2600, 2: 2100, 3: 2100, 4: 1500 },
    maxUp: { 1: 3, 2: 4, 3: 4, 4: 4 },
    // S14 (the rulebook: the heal games count by design, numbers spoken from L1): the drink's spoons are counted at L1 too
    counts: { 1: [1, 2, 3], 2: [1, 2, 3], 3: [1, 2, 3], 4: [1, 2, 3] },
  };
  const NA = 2; // the level "not the ... ones" (na) arrives
  const WHY = { problem: "taste-why", goal: "taste-goal" }; // line keys in data/clinic/heal/taste.json (the engine says them)
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    pop: { gesture: "tap", then: "tap" },
    drink: { gesture: "tap", then: "tap" }, // the drink's moves: pour, add, stir, give (each shown as it comes)
    pour: { gesture: "tap" },
    give: { gesture: "tap" },
  };

  function plan(level, rng, data) {
    const L = Math.max(1, Math.min(4, level));
    const lv = (data && data.levels && data.levels[L]) || {};
    const Lg = HS.L;
    const colours = HS.shuffle(Object.keys(COLS), rng);
    // S14 (CLN-212; the rulebook's section 3, Zafar 29 Oct): the colours to pop (x) and the decoy spots of each other colour
    // (y) are the central rules' (data/rules.json heal-taste: 1+1, 2+2, 3+3, 3+4). From L2 the doctor names the one colour
    // NOT to pop ("not this colour" stays), so x colours to pop take x + 1 colours: the tongue has three (red, green, blue:
    // their s03 spots), so L3 and L4 pop two until a fourth colour's spot and word come (plan.gaps; the report says so)
    const want = HS.count("taste", "x", L, rng);
    const nDecoy = HS.count("taste", "y", L, rng);
    const nPop = Math.min(want, L >= NA ? colours.length - 1 : colours.length - 1);
    // from L2: the doctor names the one colour NOT to pop
    const not = L >= NA ? colours[0] : null;
    const targets = L >= NA ? colours.slice(1, 1 + nPop) : colours.slice(0, nPop);
    const decoyCols = L >= NA ? [not] : colours.filter((c) => !targets.includes(c));
    const spots = [];
    colours.forEach((c) => {
      if (!targets.includes(c) && !decoyCols.includes(c)) return;
      const n = targets.includes(c) ? lv.each || K.each[L] : nDecoy;
      for (let k = 0; k < n; k++) spots.push({ colour: c, target: targets.includes(c) });
    });
    const spotWord = (c) => Lg.item("taste-spots", { mods: [COLS[c].lex] });
    const popM = not ? Lg.join(["taste-pop", "taste-spots", ",", spotWord(not), "ph-no"]) : Lg.join(["taste-pop", spotWord(targets[0])].concat(targets.slice(1).map((c) => Lg.also(spotWord(c)))));
    const drink = HS.pick(Object.keys(DRINKS), rng);
    const counts = (lv.counts || K.counts[L]) || null;
    const n = counts ? HS.pick(counts, rng) : null;
    const steps = [
      { id: "pop", kind: "pop", targets, not, row: Object.assign({ id: "pop" }, Lg.show(popM, { cap: true })) },
      { id: "drink", kind: "drink", drink, n, row: Object.assign({ id: "drink", seq: "drink", head: true }, Lg.show(Lg.join(["cl-make", drinkName(drink, null)]), { cap: true })) },
    ];
    // CLN-54 (P47, decision 89): the recipe under the drink's name, one row per step, each a whole sentence from Mum's
    // DoIt frame (package B, b2cca43): "Paani bhari chad!", "Aadu wiji chad!" (from L2 the count: "Ba chamchi hardar
    // wiji chad!"). No stir row; honey stays the grey to-record word. Each row opens, and is said, as its step comes.
    const dk = DRINKS[drink];
    const recipe = [
      { id: "drink-pour", what: "pour", m: { fn: "DoIt", verb: "v.fill", obj: THINGS[dk.liquid].lex } },
      { id: "drink-add", what: "add", m: { fn: "DoIt", verb: "v.put-in", obj: n != null ? { fn: "Unit", n, unit: "cl-chamchi", of: THINGS[dk.add].lex } : THINGS[dk.add].lex } },
    ].map((r) => Object.assign({ id: r.id, seq: "drink", what: r.what }, Lg.show(r.m, { cap: true })));
    // the blind player's choices: which colours to pop (one of the colour sets), which drink (and how many spoons)
    // (in a fixed order: the screen shows the colours mixed over the tongue, never in the order said)
    const all = Object.keys(COLS);
    const sets = L < NA ? all.map((c) => [c]) : all.map((c) => all.filter((x) => x !== c).sort());
    const dOpts = [].concat(...Object.keys(DRINKS).map((d) => (counts ? counts.map((k) => `${d}x${k}`) : [d])));
    const rows = [
      { id: "pop", options: sets.map((x) => x.join("+")), answer: targets.slice().sort().join("+"), placeholder: true }, // the colours wait for the recording
      { id: "drink", options: dOpts, answer: counts ? `${drink}x${n}` : drink },
    ];
    const words = [Lg.w("taste-spots"), ...colours.map((c) => Lg.w(COLS[c].lex)), Lg.w(THINGS[DRINKS[drink].add].lex), Lg.w(THINGS[DRINKS[drink].liquid].lex)];
    if (not) words.push(Lg.w(Lg.noId()));
    if (n != null) words.push(Lg.w("cl-chamchi"), Lg.num(n));
    const gaps = nPop < want ? { x: `${want} colours to pop asked, ${nPop} with "not this colour" on a tongue of three colours (a fourth colour's spot and word to come)` } : null;
    return { level: L, colours, targets, not, spots, drink, n, steps, recipe, rows, words, upMs: lv.upMs || K.upMs[L], maxUp: lv.maxUp || K.maxUp[L], counts: { x: nPop, y: nDecoy }, gaps };
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
    const st = { i: 0, judged: {}, over: false, busy: false, glass: null, gave: false, wrongDab: false, gone: false, parts: {} };
    const cur = () => P.steps[st.i] || null;
    ctx.card.setRows(P.steps.map((x) => x.row).concat(P.recipe));
    // SH-10 (UX 11): each recipe row is a step of its own (not a count): it ticks as its thing goes in. The pour ticks
    // as the liquid is in; the add as its thing goes in at level 1 (no count), and from level 2 (a count: "Ba chamchi
    // ...") when its step closes, by the child's next move (the stir or the pour), never as the number is reached.
    // Progress, never a verdict (C10): any liquid, anything added; the drink's own row is the verdict, as she drinks it
    const partDone = (what) => {
      const r = P.recipe.find((x) => x.what === what);
      if (!r || st.parts[what]) return;
      st.parts[what] = true;
      ctx.card.tick(r.id);
    };
    const counted = P.n != null;
    const closeAdd = () => counted && Object.keys(st.glass.adds).length && partDone("add");
    // the recipe row the child is on: the first not yet done; once both are in, the drink itself (stir it, give it)
    const recipeNow = () => {
      const c = cur();
      if (!c || c.kind !== "drink") return;
      const r = P.recipe.find((x) => !st.parts[x.what]);
      ctx.card.now(r ? r.id : c.id);
    };

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

    /* ---------------- the cotton bud ---------------- */
    // CLN-195 (Zafar, 18 Oct: "It should be a clean cotton bud with nothing on it. Then when it ... hits the blob, the
    // cotton bud ... should have the colour of the blob"): the s08b clean bud (data art.budClean); its tip takes the
    // colour of the spot it last touched (a soft tint over the swab), never one colour baked in
    const clean = data.art && data.art.budClean && data.art.budClean.src ? data.art.budClean : null;
    const budArt = clean ? null : art("budOintment");
    const budG = s("g", { opacity: 0 }, S.fx);
    let budTip = null;
    if (clean) {
      // the bud lies across its picture, the swab to dab with at its right: that swab on the dab point, the stick
      // up and a little to the right
      const [bw, bh] = clean.size;
      const k = 150 / bw;
      const [tx, ty] = clean.tip; // the right swab's middle (shares of the picture)
      const [sw, sh] = clean.swab; // its half length and half height (shares)
      const g = s("g", { transform: `rotate(110) translate(${(-tx * bw * k).toFixed(1)} ${(-ty * bh * k).toFixed(1)})` }, budG);
      s("image", { href: url(clean.src), x: 0, y: 0, width: bw * k, height: bh * k }, g);
      budTip = s("ellipse", { cx: (tx * bw * k).toFixed(1), cy: (ty * bh * k).toFixed(1), rx: (sw * bw * k * 0.92).toFixed(1), ry: (sh * bh * k * 0.86).toFixed(1), fill: "none", opacity: 0 }, g);
      budTip.style.mixBlendMode = "multiply"; // the colour soaks into the cotton
    } else if (budArt && budArt.size) {
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
    // CLN-195 (s08 w6H; the judge: after the dab "the cotton bud's tips are still plain white" in the tool box): the bud
    // in its tile keeps the colour of the spot it last touched, a tint over its right-hand swab (the same swab the dab
    // used); a redrawn tile gets it again
    let tileCol = null;
    const tintTile = () => {
      const b = S.toolEls && S.toolEls.bud;
      if (!b || !clean) return;
      const old = b.querySelector(".ts-bud-tip");
      if (!tileCol) return old && old.remove();
      const im = b.querySelector("img");
      if (!im || !im.getBoundingClientRect) return;
      const br = b.getBoundingClientRect();
      const ir = im.getBoundingClientRect();
      if (!ir.width || !ir.height) return;
      // the picture drawn inside its box (object-fit: contain, centred)
      const ar = clean.size[0] / clean.size[1];
      const w = Math.min(ir.width, ir.height * ar);
      const h0 = w / ar;
      const x0 = ir.left - br.left - b.clientLeft + (ir.width - w) / 2;
      const y0 = ir.top - br.top - b.clientTop + (ir.height - h0) / 2;
      const [tx, ty] = clean.tip;
      const [sw, sh] = clean.swab;
      const t = old || S.h("span", "ts-bud-tip", b);
      Object.assign(t.style, {
        position: "absolute",
        left: `${(x0 + (tx - sw * 0.92) * w).toFixed(1)}px`,
        top: `${(y0 + (ty - sh * 0.86) * h0).toFixed(1)}px`,
        width: `${(2 * sw * 0.92 * w).toFixed(1)}px`,
        height: `${(2 * sh * 0.86 * h0).toFixed(1)}px`,
        borderRadius: "50%",
        background: hexOf(tileCol),
        opacity: "0.8",
        mixBlendMode: "multiply",
        pointerEvents: "none",
      });
      t.dataset.col = tileCol;
    };
    const dab = (sp) =>
      tween(fast() ? 1 : 220, (u) => {
        // the tip takes the spot's colour as it touches (half way down the dab)
        if (budTip && u >= 0.5 && budTip.dataset.col !== sp.colour) {
          budTip.dataset.col = sp.colour;
          budTip.setAttribute("fill", hexOf(sp.colour));
          budTip.setAttribute("opacity", 0.8);
          tileCol = sp.colour;
          tintTile();
        }
        budG.setAttribute("opacity", 1);
        budG.setAttribute("transform", `translate(${sp.x} ${sp.y - 6 - 30 * (1 - Math.sin(u * Math.PI))})`);
      }).then(() => {
        // CLN-195: the bud stays a moment after the dab, so its tip's new colour is seen (a next dab keeps it up)
        const n = (budG.dabN = (budG.dabN || 0) + 1);
        ctx.after(fast() ? 10 : budTip ? 700 : 160, () => budG.dabN === n && budG.setAttribute("opacity", 0));
      });
    // (Sprint 10, Zafar 21 Oct: the code-drawn sparkle where a spot pops is off; it did not match the art)

    /* ---------------- the drink: the clear glass, the pour, the spoon ---------------- */
    // CLN-196 (clinic decision 10; Zafar, 18 Oct: "a metal cup, but it's got a drop shadow, but it's sitting on the
    // surface"; "is the metal cup the right thing"; 19 Oct: "yes, the metal cup; the new cup with no drop shadow, sitting
    // on the surface"): the s08c steel cup (TC1), standing on the tray with no drop shadow. Its inside is measured on the
    // picture (data art.glass: the rim's ellipse, the inner bottom, the walls' half widths, shares of the picture). The
    // cup is opaque (art.glass.opaque), so the drink is seen only in its mouth: drawn over the cup's inside, clipped to the
    // inner edge of its rim (art.glass.lip: the rim's thickness, a share of w); a clear glass keeps it behind the picture
    const GA = (data.art && data.art.glass) || {};
    const GW = GA.size || [399, 560];
    const GL = { x: 146, y: 330, h: 150 };
    GL.w = (GL.h * GW[0]) / GW[1];
    const glassG = s("g", { class: "taste-glass", opacity: 0 }, S.layer);
    // a small wooden tray for it to stand on (a flat base)
    s("rect", { x: GL.x - 34, y: GL.y + GL.h - 12, width: GL.w + 68, height: 26, rx: 12, fill: "#b78a55", stroke: "#93683c", "stroke-width": 3 }, glassG);
    const gx = (f) => GL.x + f * GL.w;
    const gy = (f) => GL.y + f * GL.h;
    const RIM = GA.rim || [0.5, 0.105, 0.48, 0.09]; // the rim's ellipse: centre x, y, half axes (shares of w and h)
    const MOUTH = { x: gx(RIM[0]), y: gy(RIM[1]), rx: RIM[2] * GL.w, ry: RIM[3] * GL.h };
    const OPAQUE = !!GA.opaque;
    const pic = () => s("image", { href: url(GA.src || "assets/clinic/items-s08c/steel-cup-s08c.webp"), x: GL.x, y: GL.y, width: GL.w, height: GL.h }, glassG);
    if (OPAQUE) pic();
    const drinkG = s("g", { class: "taste-drink" }, glassG);
    if (OPAQUE) {
      const lip = (GA.lip || 0.012) * GL.w;
      const mouthId = `taste-mouth-${Math.random().toString(36).slice(2, 8)}`;
      const cp = s("clipPath", { id: mouthId, clipPathUnits: "userSpaceOnUse" }, s("defs", {}, glassG));
      s("ellipse", { cx: MOUTH.x, cy: MOUTH.y, rx: MOUTH.rx - lip, ry: MOUTH.ry - lip }, cp);
      drinkG.setAttribute("clip-path", `url(#${mouthId})`);
    } else pic();
    const IN = GA.inside || { full: 0.24, bottom: 0.84, top: 0.455, foot: 0.385, ratio: 0.2 }; // full and bottom surfaces (y), the inner half widths there (of w), the surface's ry over rx
    const surf = (u) => {
      const y = IN.bottom + (IN.full - IN.bottom) * u;
      const t = (y - IN.full) / (IN.bottom - IN.full);
      const rx = (IN.top + (IN.foot - IN.top) * t) * GL.w;
      return { x: MOUTH.x, y: gy(y), rx, ry: rx * IN.ratio };
    };
    const TOP = surf(1); // the full glass's surface: where the stream lands, the thing goes in and the spoon stirs
    // the drink: its body down to the inner bottom (the walls' taper, the bottom's front curve) and its surface on top
    const body = s("path", { fill: "#fff", opacity: 0 }, drinkG);
    // (the surface's thin edge line: water is seen in a clear glass by its surface)
    const liquid = s("ellipse", { cx: TOP.x, cy: TOP.y, rx: TOP.rx, ry: TOP.ry, fill: "#fff", opacity: 0, stroke: "rgba(110,150,175,.55)", "stroke-width": 1.4 }, drinkG);
    const shine = s("ellipse", { cx: TOP.x, cy: TOP.y, rx: TOP.rx * 0.7, ry: TOP.ry * 0.35, fill: "#fff", opacity: 0 }, drinkG);
    const shade = (hex, k) => {
      const n = parseInt(String(hex).replace("#", ""), 16);
      const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k));
      return `rgb(${c.join(",")})`;
    };
    const level = (u, col, op) => {
      const q = surf(Math.max(0.02, u));
      const b0 = surf(0);
      [["cx", q.x], ["cy", q.y], ["rx", q.rx], ["ry", q.ry]].forEach(([k, v]) => liquid.setAttribute(k, v.toFixed(1)));
      body.setAttribute("d", `M${(q.x - q.rx).toFixed(1)} ${q.y.toFixed(1)} L${(b0.x - b0.rx).toFixed(1)} ${b0.y.toFixed(1)} A${b0.rx.toFixed(1)} ${b0.ry.toFixed(1)} 0 0 0 ${(b0.x + b0.rx).toFixed(1)} ${b0.y.toFixed(1)} L${(q.x + q.rx).toFixed(1)} ${q.y.toFixed(1)} A${q.rx.toFixed(1)} ${q.ry.toFixed(1)} 0 0 0 ${(q.x - q.rx).toFixed(1)} ${q.y.toFixed(1)}Z`);
      shine.setAttribute("cx", q.x.toFixed(1));
      shine.setAttribute("cy", (q.y - q.ry * 0.45).toFixed(1));
      shine.setAttribute("rx", (q.rx * 0.7).toFixed(1));
      shine.setAttribute("ry", (q.ry * 0.3).toFixed(1));
      if (col) {
        liquid.setAttribute("fill", col);
        body.setAttribute("fill", shade(col, 0.9));
      }
      body.setAttribute("opacity", u > 0 && !OPAQUE ? op : 0);
      liquid.setAttribute("opacity", u > 0 ? Math.min(1, op + 0.1) : 0);
      shine.setAttribute("opacity", u > 0 ? 0.35 : 0);
    };
    const opOf = (id) => (id === "water" ? 0.5 : 0.95);
    const blob = s("ellipse", { cx: TOP.x - 6, cy: TOP.y + 3, rx: TOP.rx * 0.45, ry: TOP.ry * 0.6, fill: "#fff", opacity: 0 }, glassG);
    const glassArt = (key) => art(key);
    void glassArt;
    const toolSvg = (id) => {
      const el = S.toolEls[id];
      if (!el) return { x: 700, y: 250 };
      const r = el.getBoundingClientRect();
      return S.pt({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
    };
    // SH-117 (CLN-197, 18 Oct: "the filling animations ... take from the cook game ... the chai game"): the shared pour
    // and fill (js/shared/pour.js, Cook's chai pour): the jug comes over the glass and tips its spout over the mouth, a
    // tapered stream falls onto the drink's surface (a splash where it lands) and the level rises with it, then it
    // tips back and goes home. The spout: the jug pictures' lip, measured on the art drawn in its 100 x 120 box
    const pour = async (id) => {
      const t = THINGS[id];
      st.busy = true;
      const P = await S.pourKit();
      await P.svg(S.fx, {
        href: url(t.img),
        size: { w: 100, h: 120 },
        from: toolSvg(id),
        lip: [-44, -42],
        lipTo: { x: MOUTH.x + MOUTH.rx * 0.5, y: MOUTH.y - 34 },
        tilt: -72,
        arc: 60,
        colour: t.liquid,
        opacity: id === "water" ? 0.75 : 0.95,
        width: 13,
        // the stream lands on the drink's surface as it rises (a little right of its middle, under the spout); while the
        // surface is still down inside the opaque tumbler it ends in the mouth's opening, never over the steel front
        surface: (u) => {
          const q = surf(u);
          // (the opaque cup: never below the mouth's middle, where the cup's front would be over it)
          return { x: q.x + q.rx * 0.2, y: OPAQUE ? Math.min(q.y, MOUTH.y + MOUTH.ry * 0.55) : q.y };
        },
        // CLN-104 (S05-D3): the level rises slowly enough to see it rise (it read as one jump at 760 ms)
        onFill: (u) => u > 0 && level(u, t.liquid, opOf(id)),
        counter: tween,
        ms: { lift: 380, tip: 220, pour: 1500, untip: 180, back: 300 },
      });
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
      // CLN-144 (decision 95, contract-8): while the nudge glows, the card's next-step band steps back (one thing lit)
      if (ctx.card.hush) ctx.card.hush(false);
      if (!el) return;
      // (contract-8, S14: the spoon's glow waited only for its pause, and lit while the card still read the add row aloud: two
      // things lit for half a second, at L2 before and at L1 now the spoons are counted there; it waits for the reading too)
      const reading = () => !!(root.document && root.document.querySelector(".cl-side .oc-row.reading, .cl-side .reading"));
      const go = () => {
        if (st.over || !still()) return;
        if (reading()) {
          nudgeT = setTimeout(go, 150);
          return;
        }
        if (ctx.card.hush) ctx.card.hush(true);
        el.classList.add("pulse");
      };
      nudgeT = setTimeout(go, fast() ? 200 : 1800);
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
    const popTools = () => {
      S.tools([{ id: "bud", glyph: BUD.glyph, img: BUD.img }], (id) => id === "bud" && ctx.after(200, cueSpot));
      ctx.after(0, tintTile); // CLN-195: a redrawn tile keeps the bud's colour
    };
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
        recipeNow();
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
        closeAdd(); // a counted add put in before the liquid: the pour is the next move, it closes that step
        await pour(id);
        partDone("pour");
        recipeNow();
        if (cur() === c) S.cue("add", { gesture: "tap" }, S.toolEls[DRINKS[c.drink].add]);
        return;
      }
      if (THINGS[id]) {
        gl.adds[id] = (gl.adds[id] || 0) + 1;
        gl.stirred = false;
        if (counted) ctx.tally(id, gl.adds[id]); // (S14: the spoons are counted from L1, so the running count and the reveal from L1)
        S.uncue();
        await addIn(id);
        if (!counted) {
          partDone("add");
          recipeNow();
        }
        // TA3 (CLN-104): the next step is cued: the spoon glows after a short pause (stir it)
        nudge(S.toolEls.spoon, () => !st.glass.stirred);
        return;
      }
      if (id === "spoon") {
        if (!gl.liquid && !Object.keys(gl.adds).length) return;
        S.uncue();
        closeAdd(); // the stir is the move after the counted add: its step has closed
        recipeNow();
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
      // decision 93 (SH-44): each recipe row's own verdict for the steps page (the drink row above is the score)
      if (!st.judgedParts) {
        st.judgedParts = true;
        const dk = DRINKS[c.drink];
        const adds = Object.keys(gl.adds);
        const nAdd = gl.adds[dk.add] || 0;
        ctx.log({ type: gl.liquid === dk.liquid ? "right" : "wrong", rowId: "drink-pour", detail: { liquid: gl.liquid } });
        ctx.log({ type: adds.length === 1 && nAdd === (P.n || 1) ? "right" : "wrong", rowId: "drink-add", detail: P.n != null && adds.length === 1 && adds[0] === dk.add ? String(nAdd) : { adds: gl.adds } });
      }
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
        // the glass is empty again: its recipe rows open again for the new go (redo on the spot, decision 51)
        P.recipe.forEach((r) => ctx.card.untick(r.id));
        st.parts = {};
        recipeNow();
        ctx.after(fast() ? 50 : 900, () => cur() === c && S.cue("drink", CUES.pour, S.toolEls[DRINKS[c.drink].liquid]));
      }
    };
    const finish = () => {
      if (st.over) return;
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      S.root.classList.add("hs-healed"); // the close-up's last look before the pull-out (the evidence probes' moment)
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
    levels: [1, 2, 3, 4], // L4: faster, a third decoy (Zafar, 13 Oct)
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
