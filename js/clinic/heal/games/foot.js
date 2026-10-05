/*
 * H-foot: the sole of the foot (D15i, decision 27; the 1 Oct report §8H; CLN-64, CLN-40, CLN-47).
 *
 * Why: "Ow, something's in my foot!" / "Let's take the splinters out."
 * 1. Soak: the doctor says which water (paani [hot] / [cold] / [lukewarm]) and how many jugs; tap the jug, then
 *    the foot, that many times (L1 closes at the count, D5; from L2 the next action closes it, D7).
 * 2. The splinters, seen on the sole (toes up, the leg off the bottom): each sits in a lighter channel that runs with
 *    square turns to the edge of the foot. Drag the splinter along its channel; touching the side is an "ow": it
 *    slides back to the last turn and is a scored hand-skill mistake (the "steady" row).
 *    L1 one straight channel; L2 two, with one or two turns; L3 three, from three toes, three turns each and
 *    narrower, and the toes named for the order (pela [big toe], ne poi ...: the Kutchi decides it).
 * 3. A plaster on each spot.
 * Sides are said and tested in the diagnosis only (D10): one sore foot here. The channels are drawn in code over
 * the art plan's sole (P1, closeups/<set>/sole.webp, swapped in by file name when it exists).
 * Rows: the soak (which water, how many jugs), the toe order at L3, and the steady hand (a skill row: no words).
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const TEMPS = ["hot", "cold", "lukewarm"];
  const K = { jugs: { 1: [1, 2, 3, 4, 5], 2: [2, 3, 4, 5], 3: [2, 3, 4] }, halfW: { 1: 30, 2: 25, 3: 19 }, slackPx: 8, len: 44 };
  const TOES = ["big toe", "middle toe", "little toe"];
  const TOE_ID = { "big toe": "cl-big-toe", "middle toe": "foot-middle-toe", "little toe": "cl-little-toe" };
  const WHY = { problem: "Ow, something's in my foot!", goal: "Let's take the splinters out." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    soak: { gesture: "tap", then: "tap" },
    pull: { gesture: "drag" },
    plaster: { gesture: "tap", then: "tap" },
  };

  // the sole, toes up (svg units, viewBox 0 0 800 500); big toe on the right (mirrored at random)
  const TOE_AT = { "big toe": [502, 70, 34, 40], second: [442, 50, 24, 29], "middle toe": [386, 46, 22, 27], fourth: [336, 56, 20, 24], "little toe": [292, 78, 18, 22] };
  // the channels: polylines from the splinter's spot to past the foot's edge, square turns only
  const PATHS = {
    1: [
      [[[420, 232], [600, 232]]],
      [[[380, 322], [200, 322]]],
      [[[440, 300], [600, 300]]],
      [[[365, 205], [200, 205]]],
    ],
    2: [
      [
        [[446, 172], [446, 252], [600, 252]],
        [[384, 200], [326, 200], [326, 336], [200, 336]],
      ],
      [
        [[462, 300], [462, 384], [600, 384]],
        [[372, 176], [372, 262], [200, 262]],
      ],
      [
        [[420, 180], [480, 180], [480, 300], [600, 300]],
        [[360, 260], [360, 360], [200, 360]],
      ],
    ],
    3: [
      [
        { toe: "big toe", pts: [[502, 92], [502, 170], [450, 170], [450, 262], [600, 262]] },
        { toe: "middle toe", pts: [[386, 64], [386, 332], [450, 332], [450, 404], [600, 404]] },
        { toe: "little toe", pts: [[292, 92], [292, 162], [330, 162], [330, 282], [200, 282]] },
      ],
    ],
  };
  const mirror = (pts) => pts.map(([x, y]) => [800 - x, y]);
  const lens = (pts) => {
    const out = [0];
    for (let k = 1; k < pts.length; k++) out.push(out[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    return out;
  };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const temp = HS.pick(TEMPS, rng);
    const jugs = HS.pick(K.jugs[L], rng);
    const flip = rng() < 0.5;
    const set = HS.pick(PATHS[L], rng);
    const splinters = set.map((q, i) => {
      const raw = Array.isArray(q) ? q : q.pts;
      const pts = flip ? mirror(raw) : raw.map((p) => p.slice());
      return { id: `s${i}`, toe: q.toe || null, pts, lens: lens(pts), turns: pts.length - 2 };
    });
    const order = L === 3 ? HS.shuffle(TOES, rng) : null;
    // words, numbers and joins from data through the seam (R5)
    const Lg = HS.L;
    const say = (m, o) => Lg.show(m, o);
    const steps = [{ id: "soak", kind: "soak", temp, jugs, row: Object.assign({ id: "soak" }, say(Lg.join([Lg.item("cook-paani"), temp, ",", Lg.item("cl-jugs", { n: jugs })]), { cap: true })) }];
    // the toe order (L3) is a sequence on the card (13h): pela [big toe], ne poi ...
    const pullRows = order ? order.map((t, i) => Object.assign({ id: `pull${i}`, seq: "toes" }, say(Lg.step(i, TOE_ID[t], { lower: true })))) : null;
    steps.push({ id: "pull", kind: "pull", order, row: pullRows ? pullRows[0] : Object.assign({ id: "pull" }, say(Lg.item("cl-splinters"), { cap: true })), rows: pullRows });
    steps.push({ id: "plaster", kind: "plaster", row: Object.assign({ id: "plaster" }, say(Lg.item("cl-plaster"), { cap: true })) });
    const rows = [
      { id: "soak-water", options: TEMPS, answer: temp, placeholder: true },
      { id: "soak-jugs", options: K.jugs[L], answer: jugs },
    ];
    if (order) rows.push({ id: "toe-order", seq: TOES, answer: order, placeholder: true });
    rows.push({ id: "pull-steady", skill: true }); // the hand: no words in it, so every player can get it
    const words = [Lg.w("cook-paani"), Lg.num(jugs), HS.ph(temp), Lg.w("cl-splinters")];
    if (order) words.push(Lg.w("lnk-pela"), Lg.w("lnk-nepoi"), Lg.w("cl-big-toe"), Lg.w("foot-middle-toe"), Lg.w("cl-little-toe"));
    return { level: L, steps, rows, words, splinters, flip, halfW: K.halfW[L] };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const Kit = root.Clinic && root.Clinic.Kit;
    const fast = () => !!(Kit && Kit.fast);
    const S = HS.make(stage, ctx, { place: "limb", game: "foot" });
    const { s } = S;
    const st = { i: 0, jugs: 0, temp: null, judged: {}, over: false, busy: false, prog: {}, pulled: [], plasters: {}, touches: 0 };
    P.splinters.forEach((q) => (st.prog[q.id] = K.len)); // the head starts LEN along: the splinter lies from its spot out
    const cur = () => P.steps[st.i] || null;
    // one instruction at a time (D8): the whole job is set, the progressive card shows and says each step as it opens
    ctx.card.setRows([].concat(...P.steps.map((x) => x.rows || [x.row])));
    const ART = (ctx.data && ctx.data.art) || {};

    // the sole (P1's close-up swaps in by file name): toes up, the leg off the bottom of the picture
    const skin = S.skin || "#d9a57c";
    const sole = S.skinLight || "#e6bf9a";
    const edge = S.skinDark || "#b9845c";
    const footG = s("g", { transform: P.flip ? "translate(800 0) scale(-1 1)" : null }, S.layer);
    const outline = "M300 540 C286 440 268 340 262 250 C256 170 270 122 300 104 C344 80 470 74 520 98 C552 116 550 172 540 250 C530 340 514 440 500 540 Z";
    s("path", { d: outline, fill: skin, stroke: edge, "stroke-width": 5 }, footG);
    s("path", { d: "M318 520 C306 430 292 340 290 252 C288 186 300 146 330 128 C370 108 462 104 500 124 C524 140 522 190 514 252 C506 340 494 430 484 520 Z", fill: sole, opacity: 0.7 }, footG);
    s("path", { d: "M330 200 Q400 182 480 196 M318 380 Q400 368 492 382", stroke: edge, "stroke-width": 2, fill: "none", opacity: 0.35 }, footG);
    Object.values(TOE_AT).forEach(([x, y, rx, ry]) => s("ellipse", { cx: x, cy: y, rx, ry, fill: skin, stroke: edge, "stroke-width": 4 }, footG));
    let soleF = ART.sole && (typeof ART.sole === "string" ? ART.sole : ART.sole[S.child === false ? "adult" : "child"]);
    // A1 (5 Oct): the cut sole (P1) where its placement is measured (art.place: box in svg units for the picture as
    // drawn, big toe on the viewer's LEFT, i.e. the mirrored stand-in; the levels whose channels it fits; the kinds
    // whose cloth it matches). Elsewhere the stand-in stays.
    const AP = ART.place;
    if (AP && ((AP.levels && !AP.levels.includes(P.level)) || (AP.kinds && !AP.kinds.includes(S.kind)))) soleF = null;
    if (AP && soleF && AP.has2x && (root.devicePixelRatio || 1) > 1.25) soleF = soleF.replace(/\.webp$/, "@2x.webp");
    const box = AP ? AP.box : [150, -40, 500, 600];
    const art = soleF && Kit ? s("image", { href: Kit.url(soleF), x: box[0], y: box[1], width: box[2], height: box[3], preserveAspectRatio: "xMidYMax meet", opacity: 0, transform: AP && !P.flip ? "translate(800 0) scale(-1 1)" : null }, S.layer) : null;
    if (art) {
      S.layer.insertBefore(art, S.layer.firstChild);
      art.addEventListener("load", () => {
        art.setAttribute("opacity", 1);
        footG.setAttribute("opacity", 0);
      });
      art.addEventListener("error", () => art.remove());
    }
    const water = s("path", { d: outline, fill: "#bfe0f5", opacity: 0 }, S.layer);
    if (P.flip) water.setAttribute("transform", "translate(800 0) scale(-1 1)");
    // the channels stop at the foot's edge: clipped to the sole's outline
    const clipId = `fo-clip-${Math.floor(Math.random() * 1e9)}`;
    const defs = s("defs", {}, S.svg);
    const clip = s("clipPath", { id: clipId }, defs);
    // (a clipPath takes shapes only, no group: each carries the mirror itself)
    const flipT = P.flip ? "translate(800 0) scale(-1 1)" : null;
    s("path", { d: outline, transform: flipT }, clip);
    Object.values(TOE_AT).forEach(([x, y, rx, ry]) => s("ellipse", { cx: x, cy: y, rx, ry, transform: flipT }, clip)); // the toes' splinters sit in their channels too
    const chanG = s("g", { "clip-path": `url(#${clipId})` }, S.layer);
    const chanFill = HS.shade ? HS.shade(sole, 0.45) : "#f6e2cc";
    const splG = s("g", {}, S.layer);
    const plG = s("g", {}, S.layer);
    const fxG = s("g", {}, S.fx);

    const at = (q, t) => {
      const T = Math.max(0, Math.min(q.lens[q.lens.length - 1], t));
      let k = 1;
      while (k < q.lens.length - 1 && q.lens[k] < T) k++;
      const a = q.pts[k - 1];
      const b = q.pts[k];
      const f = (T - q.lens[k - 1]) / (q.lens[k] - q.lens[k - 1] || 1);
      return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f };
    };
    const total = (q) => q.lens[q.lens.length - 1];
    /** The nearest point on the channel to p, within a window of the path: {t, d}. */
    const near = (q, p, lo, hi) => {
      let best = { t: lo, d: 1e9 };
      for (let k = 1; k < q.pts.length; k++) {
        const a = q.pts[k - 1];
        const b = q.pts[k];
        const L0 = q.lens[k - 1];
        const seg = q.lens[k] - L0;
        let f = seg ? ((p.x - a[0]) * (b[0] - a[0]) + (p.y - a[1]) * (b[1] - a[1])) / (seg * seg) : 0;
        f = Math.max(0, Math.min(1, f));
        let t = L0 + f * seg;
        if (t < lo || t > hi) {
          t = Math.max(lo, Math.min(hi, t));
          if (t < L0 || t > q.lens[k]) continue;
        }
        const pt = at(q, t);
        const d = Math.hypot(p.x - pt.x, p.y - pt.y);
        if (d < best.d) best = { t, d };
      }
      return best;
    };
    const lastTurn = (q, t) => {
      let b = K.len;
      for (let k = 1; k < q.lens.length - 1; k++) if (q.lens[k] < t - 1) b = Math.max(b, q.lens[k]);
      return b;
    };
    const pathD = (pts) => pts.map((p, k) => `${k ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
    const draw = () => {
      S.clear(chanG);
      S.clear(splG);
      S.clear(plG);
      const c = cur();
      P.splinters.forEach((q) => {
        if (st.pulled.includes(q.id)) return;
        // the lighter channel to the edge (square turns), a darker rim so the sides read
        const d = pathD(q.pts);
        s("path", { d, fill: "none", stroke: edge, "stroke-width": P.halfW * 2 + 6, "stroke-linejoin": "miter", "stroke-linecap": "butt", opacity: c && c.kind === "pull" ? 0.6 : 0.3 }, chanG);
        s("path", { d, fill: "none", stroke: chanFill, "stroke-width": P.halfW * 2, "stroke-linejoin": "miter", "stroke-linecap": "butt", opacity: c && c.kind === "pull" ? 0.95 : 0.6 }, chanG);
        // the splinter: from its head (the progress point) back along the channel; the head is what you hold
        const t = st.prog[q.id];
        const tail = [];
        for (let k = 0; k <= 8; k++) tail.push(at(q, t - (k / 8) * K.len));
        s("path", { d: tail.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" "), fill: "none", stroke: "#6a3e1e", "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round" }, splG);
        const h = at(q, t);
        if (c && c.kind === "pull") s("circle", { class: "fo-grip", cx: h.x, cy: h.y, r: 16, fill: "#ffe27a", opacity: 0.55 }, splG);
        s("circle", { cx: h.x, cy: h.y, r: 9, fill: "#8a5a2a", stroke: "#fff", "stroke-width": 2 }, splG);
      });
      P.splinters.forEach((q) => {
        const sp = { x: q.pts[0][0], y: q.pts[0][1] };
        if (st.plasters[q.id]) {
          s("rect", { x: sp.x - 30, y: sp.y - 16, width: 60, height: 32, rx: 10, fill: "#f2d2a8", stroke: "#b98a60", "stroke-width": 2 }, plG);
          s("rect", { x: sp.x - 9, y: sp.y - 8, width: 18, height: 16, rx: 3, fill: "#fff", opacity: 0.6 }, plG);
        } else if (st.pulled.includes(q.id) && c && c.kind === "plaster") s("circle", { cx: sp.x, cy: sp.y, r: 18, fill: "none", stroke: "#2e8b7a", "stroke-width": 4, "stroke-dasharray": "5 4" }, plG);
        else if (st.pulled.includes(q.id)) s("circle", { cx: sp.x, cy: sp.y, r: 6, fill: "#d9546a" }, plG);
      });
    };
    draw();

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const nextSplinter = () => {
      const c = cur();
      return c && c.order ? P.splinters.find((x) => x.toe === c.order[st.pulled.length]) : P.splinters.find((x) => !st.pulled.includes(x.id));
    };
    const open = () => {
      const c = cur();
      ctx.card.now(c.id === "pull" && c.rows ? "pull0" : c.id);
      draw();
      if (c.kind === "soak") S.cue("soak", CUES.soak, S.toolEls["jug-" + c.temp], { x: 400, y: 300 });
      if (c.kind === "pull") {
        const q = nextSplinter();
        const e = at(q, total(q));
        const h = at(q, st.prog[q.id]);
        S.cue("pull", Object.assign({}, CUES.pull, { to: { x: e.x, y: e.y } }), { x: h.x, y: h.y });
      }
      if (c.kind === "plaster") S.cue("plaster", CUES.plaster, S.toolEls.plaster, { x: P.splinters[0].pts[0][0], y: P.splinters[0].pts[0][1] });
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "soak") {
        judge("soak-water", st.temp === c.temp, st.temp || "none");
        judge("soak-jugs", st.jugs === c.jugs, `${st.jugs} of ${c.jugs}`);
      }
      if (c.kind === "pull") {
        if (c.order) {
          const got = st.pulled.map((id) => P.splinters.find((q) => q.id === id).toe);
          judge("toe-order", JSON.stringify(got) === JSON.stringify(c.order), got.join(", "));
        }
        judge("pull-steady", st.touches === 0, `${st.touches}`);
      }
      ctx.card.tick(c.id === "pull" && c.rows ? `pull${c.rows.length - 1}` : c.id);
      S.count(null);
      S.uncue();
      st.i++;
      if (cur()) open();
      else finish();
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      S.face("happy");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    const TCOL = { hot: "#e8503a", cold: "#3f8fd8", lukewarm: "#9a7ad0" };
    const IMG = "assets/clinic/items-v2/";
    // CLN-75: steam on the hot jug, ice on the cold one, the lukewarm one plain: they read at a glance at button size
    const MARK = { hot: "steam", cold: "ice" };
    S.tools(TEMPS.map((t) => ({ id: "jug-" + t, img: `${IMG}jug-${t}.webp`, glyph: "•", bg: TCOL[t] + "26", mark: MARK[t] })).concat([{ id: "plaster", img: IMG + "plaster-skin.webp", glyph: "•" }]), () => {});

    let drag = null;
    const slack = () => K.slackPx * S.unit();
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      let c = cur();
      if (!c) return;
      // D7: from level 2 the soak closes by the next action: taking hold of a splinter (no ✓)
      if (c.kind === "soak" && st.jugs && P.level >= 2) {
        const grab = 30 + slack();
        if (P.splinters.some((x) => Math.hypot(p.x - at(x, st.prog[x.id]).x, p.y - at(x, st.prog[x.id]).y) < grab)) {
          close();
          c = cur();
        }
      }
      if (c.kind === "soak") {
        if (!/^jug-/.test(S.sel || "")) return;
        if (Math.hypot((p.x - 400) / 1.4, p.y - 300) > 260) return;
        const t = S.sel.slice(4);
        st.temp = st.temp && st.temp !== t ? "mixed" : t;
        st.jugs++;
        S.count(st.jugs);
        ctx.tally(S.sel, st.jugs);
        // D5 (SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (P.level === 1 && st.jugs >= c.jugs) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 600);
        water.setAttribute("fill", TCOL[t]);
        water.setAttribute("opacity", Math.min(0.4, 0.1 + st.jugs * 0.07));
        S.face(t === "hot" ? "hot" : t === "cold" ? "cold" : "happy", 600);
        st.busy = true;
        ctx.after(fast() ? 60 : 300, () => (st.busy = false));
        return;
      }
      if (c.kind === "pull") {
        const grab = 30 + slack();
        const q = P.splinters.find((x) => !st.pulled.includes(x.id) && Math.hypot(p.x - at(x, st.prog[x.id]).x, p.y - at(x, st.prog[x.id]).y) < grab);
        if (!q) return;
        drag = q;
        if (S.svg.setPointerCapture) try { S.svg.setPointerCapture(e.pointerId); } catch (err) { /* a synthetic pointer */ }
        return;
      }
      if (c.kind === "plaster" && S.sel === "plaster") {
        const q = P.splinters.find((x) => !st.plasters[x.id] && Math.hypot(p.x - x.pts[0][0], p.y - x.pts[0][1]) < 38);
        if (!q) return;
        st.plasters[q.id] = true;
        draw();
        ctx.sfx("pop");
        if (Object.keys(st.plasters).length === P.splinters.length) {
          st.busy = true;
          ctx.after(fast() ? 100 : 400, () => {
            st.busy = false;
            close();
          });
        }
      }
    });
    ctx.on(S.svg, "pointermove", (e) => {
      if (!drag) return;
      const q = drag;
      const p = S.pt(e);
      const t0 = st.prog[q.id];
      const best = near(q, p, Math.max(0, t0 - 60), Math.min(total(q), t0 + 90));
      if (best.d > P.halfW + slack()) {
        // touched the side: "ow", it slides back to the last turn, and the steady-hand row is lost (a scored mistake)
        drag = null;
        st.touches++;
        st.prog[q.id] = lastTurn(q, t0);
        S.face("wince", 700);
        S.say(HS.L.w("foot-ow"), "patient");
        ctx.log({ type: "extra", rowId: "pull-steady", detail: "touched the side" });
        ctx.sfx("tap");
        const h = at(q, t0);
        const ow = s("circle", { cx: h.x, cy: h.y, r: P.halfW + 6, fill: "none", stroke: "#d8433f", "stroke-width": 5, opacity: 0.8 }, fxG);
        ctx.after(450, () => ow.remove());
        draw();
        return;
      }
      if (best.t > t0) st.prog[q.id] = best.t;
      if (st.prog[q.id] >= total(q) - 4) {
        drag = null;
        st.pulled.push(q.id);
        const c = cur();
        if (c && c.rows) {
          ctx.card.tick(`pull${st.pulled.length - 1}`);
          if (st.pulled.length < c.rows.length) ctx.card.now(`pull${st.pulled.length}`);
        }
        S.face("happy", 600);
        ctx.sfx("pop");
        const e2 = at(q, total(q));
        const fly = s("line", { x1: e2.x, y1: e2.y, x2: at(q, total(q) - K.len).x, y2: at(q, total(q) - K.len).y, stroke: "#6a3e1e", "stroke-width": 8, "stroke-linecap": "round" }, fxG);
        if (fly.animate) fly.animate([{ transform: "translate(0,0)" }, { transform: "translate(60px,-140px)", opacity: 0 }], { duration: 600, fill: "forwards" });
        ctx.after(700, () => fly.remove());
        if (st.pulled.length === P.splinters.length) {
          st.busy = true;
          ctx.after(fast() ? 100 : 500, () => {
            st.busy = false;
            close();
          });
        } else {
          const nq = nextSplinter() || P.splinters.find((x) => !st.pulled.includes(x.id));
          if (nq) {
            const h = at(nq, st.prog[nq.id]);
            const en = at(nq, total(nq));
            S.cue("pull", Object.assign({}, CUES.pull, { to: { x: en.x, y: en.y } }), { x: h.x, y: h.y });
          }
        }
      }
      draw();
    });
    const up = () => (drag = null);
    ctx.on(S.svg, "pointerup", up);
    ctx.on(S.svg, "pointercancel", up);

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        open();
      },
      destroy() {
        S.destroy();
      },
      debug: {
        get plan() {
          return P;
        },
        get cues() {
          return S.cueLog.slice();
        },
        get state() {
          return { touches: st.touches, pulled: st.pulled.slice(), prog: Object.assign({}, st.prog) };
        },
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy || drag) return { do: "wait" };
          const tool = (id) => {
            const r = S.toolEls[id].getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: id };
          };
          if (c.kind === "soak") {
            if (st.jugs >= c.jugs && P.level === 1) return { do: "wait" };
            if (st.jugs < c.jugs) return S.sel !== "jug-" + c.temp ? tool("jug-" + c.temp) : Object.assign({ do: "tap", what: "pour" }, S.client(400, 300));
          }
          if (c.kind === "pull" || c.kind === "soak") {
            const q = c.kind === "soak" ? (P.steps[1].order ? P.splinters.find((x) => x.toe === P.steps[1].order[0]) : P.splinters[0]) : nextSplinter();
            if (!q) return { do: "wait" };
            const pts = [];
            for (let t = st.prog[q.id]; t < total(q); t += 12) {
              const a = at(q, t);
              const cl = S.client(a.x, a.y);
              pts.push([cl.x, cl.y]);
            }
            const e = at(q, total(q) + 2);
            const ce = S.client(e.x, e.y);
            pts.push([ce.x, ce.y]);
            return { do: "drag", pts, steps: 2, what: "pull " + q.id };
          }
          if (S.sel !== "plaster") return tool("plaster");
          const q = P.splinters.find((x) => !st.plasters[x.id]);
          return Object.assign({ do: "tap", what: "plaster" }, S.client(q.pts[0][0], q.pts[0][1]));
        },
        slip() {
          // the hand slips: the splinter is dragged out of its channel (an "ow"), then the driver pulls it properly
          const c = cur();
          if (!S.ready || st.busy || !c || c.kind !== "pull" || st.touches) return null;
          const q = nextSplinter();
          const h = at(q, st.prog[q.id]);
          const a = q.pts[0];
          const b = q.pts[1];
          const vert = Math.abs(a[0] - b[0]) < 1;
          const off = { x: h.x + (vert ? P.halfW * 3 : 0), y: h.y + (vert ? 0 : P.halfW * 3) };
          const c1 = S.client(h.x, h.y);
          const c2 = S.client((h.x + off.x) / 2, (h.y + off.y) / 2);
          const c3 = S.client(off.x, off.y);
          return { do: "drag", pts: [[c1.x, c1.y], [c2.x, c2.y], [c3.x, c3.y]], steps: 3, what: "off the channel" };
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "foot",
    part: "foot",
    ailments: ["sore-feet", "thorn"],
    items: ["paani", "loon", "tweezers", "plaster"],
    itemsFor: { "sore-feet": ["paani", "loon", "tweezers", "plaster"] },
    gestures: ["tap", "drag"],
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
