/*
 * H-tooth (clinic v2; the 1 Oct play-test D15d, decision 27): brush, drill, fill, all inside ONE mouth close-up.
 *
 * Why: "My tooth hurts." / "Let's brush, fix it and fill it."
 * 1. Brush (Sprint 11, Zafar 21 Oct): a large plus-shaped track over the mouth, the brush at its centre; it moves only along
 *    the vertical and horizontal channels, and pulled to the end of one it snaps back to the centre. Each end is a clear
 *    target, a tooth-shine spot the brush head must meet. The doctor calls ONE move at a time (D8) and its direction card
 *    comes up (js/shared/word-card.js: an arrow picture and the word: dabo left, jamno right, mathe up, niche down; the
 *    engine's grey to-record placeholder where Mum hasn't said it yet). Left and right are the screen's (the child's own,
 *    as the arrows point; they were the patient's own, mirrored, before the cards). A wrong direction bumps the brush gently
 *    back and the patient says the move again. Dirt drawn in code sits on the targets: at L1-2, while the order's words
 *    are still supported (stage 1-2), only on the directions in the order; otherwise (from L3, or a child who knows the
 *    words: rule 6) on all four sides, so listening is what wins. The first time the real brush shows the way round the
 *    cross (Onboard.stuck's 0 s rung); the 5 s and 15 s rungs spotlight the cross and show it again (never the answer).
 *    No Done: each move closes as it's brushed, and the drill comes on when the order is. L1 2 moves; L2-3 4; L4 6.
 * 2. Drill: the camera pushes in on the sore tooth, still in the mouth (gum above, the neighbours either side, the
 *    lip below: CLN-52, P43). The decay is jagged and scattered by level (L1 one patch, L2-3 two, L4 four small ones:
 *    P44). Drag the drill over it; its tip is the finger (CLN-51). Drilling the white too long chips the tooth.
 * 3. Fill: hold the big round button (it goes down while pressed); the nozzle squeezes paste into the holes and the
 *    gauge under the teeth fills (CLN-129): let go in the green, with red either side. The green narrows and the fill speeds
 *    up by level (data: fill.ms, fill.zone; CLN-53, P45). Letting go below the green just pauses (press again);
 *    past it is too much.
 * Rows: the brush order (the words decide it: right only if every move went the right way first time, no arrow opened);
 *    the drill and the fill are hand-skill rows.
 * Art swaps in by file name: data art.* (the art plan's M1 mouth, O2 decay, B1 button and nozzle) once `ready`.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  // the defaults; data/clinic/heal/tooth.json (levels, fill, drill) overrides them in the browser
  const K = {
    moves: { 1: 2, 2: 4, 3: 4, 4: 6 },
    // Sprint 10 (Zafar, 21 Oct): bigger cavities, level 1 from 52 to 70 and the others scaled up the same (x1.35)
    decay: { 1: { n: 1, r: 70 }, 2: { n: 2, r: 51 }, 3: { n: 2, r: 51 }, 4: { n: 4, r: 34 } },
    chipAt: 16, // healthy enamel points drilled before the tooth chips
    drillMs: { 4: 16000 },
    fill: { ms: { 1: 3400, 2: 2600, 3: 2600, 4: 2000 }, zone: { 1: [0.55, 0.86], 2: [0.62, 0.82], 3: [0.62, 0.82], 4: [0.67, 0.8] }, max: 1.15 },
  };
  const WHY = { problem: "tooth-why", goal: "tooth-goal" }; // line keys in data/clinic/heal/tooth.json (the engine says them)
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    brush: { gesture: "swipe" },
    drill: { gesture: "swipe" },
    fill: { gesture: "hold" },
  };
  const DIRS = ["up", "down", "left", "right"];
  // the direction words by id (the engine, data/lang/lexicon.json): dabo; up, down and right still to record (mathe, niche,
  // jamno: Mum's list), the engine's grey English placeholder until then
  const DIR_ID = { up: "tooth-up", down: "tooth-down", left: "tooth-left", right: "tooth-right" };
  // Sprint 11: the screen's directions (the arrows on the cards point the way the brush goes)
  const SCREEN = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  // the dirt: only on the order's sides up to this level, while the order's words are supported (stage 1-2)
  const DIRT = { orderTo: 2 };
  const orderDirt = (level, moves) => level <= DIRT.orderTo && moves.some((m) => HS.stageOf(DIR_ID[m]) <= 2);
  // the tooth close-up's crown (svg units): decay is placed inside it
  const CROWN = { x0: 300, x1: 482, y0: 168, y1: 352 };

  /** A jagged patch: points round (cx, cy), radius r +- 35 %. */
  function jag(cx, cy, r, rng) {
    const n = 9 + Math.floor(rng() * 4);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (rng() - 0.5) * 0.4;
      const rr = r * (0.62 + rng() * 0.55);
      pts.push([Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr * 0.9)]);
    }
    return pts;
  }
  const inPoly = (x, y, pts) => {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i];
      const [xj, yj] = pts[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };

  function plan(level, rng, data) {
    const L = Math.max(1, Math.min(4, level));
    const lv = (data && data.levels && data.levels[L]) || {};
    const nMoves = lv.chain || K.moves[L];
    const moves = [];
    for (let i = 0; i < nMoves; i++) {
      let m;
      do m = HS.pick(DIRS, rng);
      while (moves.length && m === moves[moves.length - 1]);
      moves.push(m);
    }
    const Lg = HS.L;
    const dirM = (m) => Lg.item(DIR_ID[m]);
    // the decay: jagged patches scattered over the crown, never overlapping
    const dk = Object.assign({}, K.decay[L], lv.decay || {});
    const patches = [];
    let guard = 0;
    while (patches.length < dk.n && guard++ < 600) {
      const cx = CROWN.x0 + dk.r + rng() * (CROWN.x1 - CROWN.x0 - 2 * dk.r);
      const cy = CROWN.y0 + dk.r + rng() * (CROWN.y1 - CROWN.y0 - 2 * dk.r);
      // the bigger cavities fill the crown: the gap between two eases (2.3, then 1.9, then 1.5 radii) when they will not fit
      const gap = guard < 250 ? 2.3 : guard < 450 ? 1.9 : 1.5;
      if (patches.some((p) => Math.hypot(p.cx - cx, p.cy - cy) < dk.r * gap)) continue;
      patches.push({ cx: Math.round(cx), cy: Math.round(cy), r: dk.r, pts: jag(cx, cy, dk.r, rng) });
    }
    const steps = moves.map((m, i) => ({
      id: `b${i}`,
      kind: "brush",
      move: m,
      i,
      // rule 11 (CLN-184): "Pela [down]" was Kutchi round an English word: a move whose word is still to record is the
      // whole row in grey English ("First down"), never a mix; a move with its word ("pela dabo") stays Kutchi
      row: Object.assign({ id: `b${i}` }, HS.whole(Lg.show(Lg.step(i, dirM(m), { lower: i > 0 }), { cap: i === 0 }))),
    }));
    steps.forEach((x) => (x.line = x.row)); // the move's own engine line (the taught round's card shows [Brush] instead)
    steps.push({ id: "drill", kind: "drill", patches, timer: (lv.drillMs != null ? lv.drillMs : K.drillMs[L]) || 0, row: Object.assign({}, Lg.w("tooth-drill", { cap: true }), { id: "drill" }) });
    steps.push({ id: "fill", kind: "fill", row: Object.assign({}, Lg.w("tooth-fill", { cap: true }), { id: "fill" }) });
    const rows = [
      { id: "b-order", seq: DIRS, answer: moves, placeholder: moves.some((m) => !!Lg.w(DIR_ID[m]).placeholder) }, // up, down and right wait for Mum
      { id: "drill-care", skill: true, answer: true },
      { id: "fill-line", skill: true, answer: true },
    ];
    const words = [Lg.w("tooth-up"), Lg.w("tooth-down"), Lg.w("tooth-left"), Lg.w("tooth-right"), Lg.w("body-tooth"), Lg.w("tooth-brush")];
    return { level: L, moves, steps, rows, words };
  }

  function mount(stage, ctx) {
    const data = ctx.data || {};
    const P = plan(ctx.level, ctx.rng, data);
    // CLN-118 (D13, Zafar): the taught first round names no sides and no directions: the brushing is one row, [Brush]
    // (the ghost finger shows each move), ticked when the last move is done; up, down, left and right start next round
    if (ctx.taught) {
      const brush = Object.assign({}, HS.L.w("tooth-brush", { cap: true }), { id: "brush" });
      P.steps.forEach((x) => x.kind === "brush" && Object.assign(x, { rowKey: "brush", row: x.i === 0 ? brush : null }));
      const dirIds = new Set(["tooth-up", "tooth-down", "tooth-left", "tooth-right"].map((k) => HS.L.w(k).id));
      P.words = HS.taughtWords(P.words).filter((w) => !dirIds.has(w.id));
    }
    const rowOf = (c) => c.rowKey || c.id;
    const S = HS.make(stage, ctx, { place: "head", game: "tooth" });
    const { s } = S;
    const Kit0 = root.Clinic && root.Clinic.Kit;
    const url = (u) => (Kit0 && Kit0.url ? Kit0.url(u) : u);
    const kind = S.kind || (ctx.patient && ctx.patient.kind) || "girl";
    const art = (key) => {
      const a = data.art && data.art[key];
      // A1: a {kind} picture only for the kinds that have it cut (a.kinds); the @2x on dense screens (a.has2x), or
      // always where the camera pushes in on it (a.always2x: CLN-163, the one high-resolution picture)
      if (!a || !a.ready || !a.src || (a.kinds && a.src.includes("{kind}") && !a.kinds.includes(kind))) return null;
      const two = a.has2x && (a.always2x || (root.devicePixelRatio || 1) > 1.25);
      return Object.assign({}, a, { src: a.src.replace("{kind}", kind).replace(two ? /\.webp$/ : /$^/, "@2x.webp") });
    };
    const FILL = Object.assign({}, K.fill, data.fill || {});
    const zone = (FILL.zone && FILL.zone[P.level]) || K.fill.zone[P.level];
    const fillMs = ((FILL.ms && FILL.ms[P.level]) || K.fill.ms[P.level]) * 1;
    const chipAt = data.chipAt || K.chipAt;
    const st = { i: 0, done: [], tries: [], missed: [], helped: [], judged: {}, over: false, busy: false, fill: 0, holding: false, white: 0, chipped: false, mark: 0, view: "far", overs: 0 };
    const cur = () => P.steps[st.i] || null;
    const uid = `t${Math.floor(Math.random() * 1e9)}`;
    const fast = () => !!(Kit0 && Kit0.fast);
    ctx.card.setRows(P.steps.map((x) => x.row).filter(Boolean));
    const skin = S.skin || "#c99a74";
    const skinDark = S.skinDark || "#a77b58";
    const CAM = Object.assign({ far: 0.85, farY: 235, near: 1000, nearTop: 0.14, ms: 1100 }, data.view || {});

    /*
     * CLN-163 (Zafar, 18 Oct; clinic decision 7): ONE picture and ONE camera. The brushing is the mouth a little open
     * (M3); the drill and the fill happen on the wide-open mouth (M1, its @2x, with an upscaled copy of its own teeth laid
     * exactly over them: mouth-v2-teeth-hd), and the camera moves smoothly in on the sore tooth and back out (a viewBox
     * tween, in log space). The decay is drawn on that tooth, in that picture's own place, so from far it sits on the
     * tooth. The two mouths are registered on the front teeth, so the change from one to the other (as the camera starts)
     * is the mouth opening, never a jump. Without the art (a patient the art isn't cut for) the drawn mouth and the drawn
     * tooth stand in, the same way.
     *
     * Units: the svg's own (the "mouth" units: the brushing mouth, the brush, the plaque) and the drill's (the sore tooth
     * 256 wide at x 272-528, y from 92: the decay, the drill, the paste, the gauge and the button), one uniform scale
     * apart (ds, below).
     */
    const M = { x: 400, y: 250 };
    const mouthArt = art("mouth");
    const mbArt = art("mouthBrush");
    const plArt = mbArt && art("plaque");
    const artMode = !!(mouthArt && mbArt && mouthArt.teeth);
    // the drawn stand-in's upper teeth (mouth units); which tooth is sore: one of the middle four
    const UP = [0, 1, 2, 3, 4, 5].map((k) => ({ x: M.x - 165 + k * 55, y: M.y - 112, w: 50, h: 66 }));
    const soreK = 1 + Math.floor(ctx.rng() * 4);
    let sore;
    if (artMode) {
      // the art's own front teeth (data art.mouth.teeth: [x0, y0, x1, y1] in the 1x source's pixels, left to right)
      const t = mouthArt.teeth[soreK - 1];
      const k = mouthArt.box[2] / mouthArt.size[0];
      sore = { x: mouthArt.box[0] + t[0] * k, y: mouthArt.box[1] + t[1] * k, w: (t[2] - t[0]) * k, h: (t[3] - t[1]) * k };
    } else sore = Object.assign({}, UP[soreK]);
    const KD = 256 / sore.w; // drill units per mouth unit
    const DX0 = sore.x - 272 / KD;
    const DY0 = sore.y - 92 / KD;
    const TOOTH = { x0: 272, x1: 528, y0: 92, y1: 92 + sore.h * KD }; // the sore tooth, drill units
    const toD = (p) => ({ x: (p.x - DX0) * KD, y: (p.y - DY0) * KD });
    const fromD = (x, y) => ({ x: DX0 + x / KD, y: DY0 + y / KD });
    const dsT = `matrix(${(1 / KD).toFixed(6)} 0 0 ${(1 / KD).toFixed(6)} ${DX0.toFixed(3)} ${DY0.toFixed(3)})`;

    /* ---------------- 1. the brushing mouth (face1) ---------------- */
    const face1 = s("g", { class: "tooth-mouth" }, S.layer);
    const mouthG = face1; // (the brushing view's things: the brush, the plaque, the foam)
    if (!artMode) {
      s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: skin }, mouthG);
      s("ellipse", { cx: M.x - 330, cy: M.y + 40, rx: 120, ry: 90, fill: HS.shade ? HS.shade(skin, 0.08) : skin, opacity: 0.6 }, mouthG);
      s("ellipse", { cx: M.x + 330, cy: M.y + 40, rx: 120, ry: 90, fill: HS.shade ? HS.shade(skin, 0.08) : skin, opacity: 0.6 }, mouthG);
      s("path", { d: `M${M.x - 70} ${M.y - 230} Q${M.x} ${M.y - 200} ${M.x + 70} ${M.y - 230}`, stroke: skinDark, "stroke-width": 8, fill: "none", "stroke-linecap": "round", opacity: 0.6 }, mouthG); // the nose's base
      s("ellipse", { cx: M.x, cy: M.y, rx: 262, ry: 176, fill: "#c4636b" }, mouthG); // the lips
      s("ellipse", { cx: M.x, cy: M.y, rx: 236, ry: 150, fill: "#4e1620" }, mouthG); // inside
      s("ellipse", { cx: M.x, cy: M.y + 70, rx: 150, ry: 62, fill: "#d9707e" }, mouthG); // the tongue
      const clip = s("clipPath", { id: `${uid}-mouth` }, s("defs", {}, S.svg));
      s("ellipse", { cx: M.x, cy: M.y, rx: 236, ry: 150 }, clip);
      const inner = s("g", { "clip-path": `url(#${uid}-mouth)` }, mouthG);
      UP.forEach((t) => s("rect", { x: t.x, y: t.y - 14, width: t.w, height: t.h + 14, rx: 14, fill: "#fbf8ef", stroke: "#dcd3c2", "stroke-width": 2 }, inner));
      [0, 1, 2, 3, 4, 5].forEach((k) => s("rect", { x: M.x - 160 + k * 54, y: M.y + 58, width: 48, height: 64, rx: 13, fill: "#fbf8ef", stroke: "#dcd3c2", "stroke-width": 2 }, inner));
      s("path", { d: `M${M.x - 240} ${M.y - 160} H${M.x + 240} V${M.y - 112} Q${M.x} ${M.y - 92} ${M.x - 240} ${M.y - 112}Z`, fill: "#e8909a" }, inner);
      s("path", { d: `M${M.x - 240} ${M.y + 170} H${M.x + 240} V${M.y + 116} Q${M.x} ${M.y + 100} ${M.x - 240} ${M.y + 116}Z`, fill: "#e8909a" }, inner);
    }
    /*
     * S02-E (M3, M4; CLN-103, T9): the brushing has its own mouth, less open (art "mouthBrush"), and the plaque is the
     * art run's picture registered on it (art "plaque"), wiped away under the brush through a mask; the drawn plaque
     * spots stay as the record of what's been cleared (hidden).
     */
    let wipeMask = null;
    let plaqueImg = null;
    if (artMode) {
      const b = mbArt.box;
      s("image", { href: url(mbArt.src), x: b[0], y: b[1], width: b[2], height: b[3], preserveAspectRatio: "none" }, face1);
      if (plArt) {
        const defs = s("defs", {}, face1);
        const mk = s("mask", { id: `${uid}-wipe`, maskUnits: "userSpaceOnUse", x: b[0], y: b[1], width: b[2], height: b[3] }, defs);
        s("rect", { x: b[0], y: b[1], width: b[2], height: b[3], fill: "#fff" }, mk);
        wipeMask = mk;
        plaqueImg = s("image", { href: url(plArt.src), x: b[0], y: b[1], width: b[2], height: b[3], preserveAspectRatio: "none", mask: `url(#${uid}-wipe)` }, face1);
      }
    }
    // T9 (CLN-103): plaque on the teeth that clears where the brush goes (and the last of it when the brushing is done)
    const plaqueG = s("g", { class: "tooth-plaque", opacity: plaqueImg ? 0 : 1 }, mouthG);
    const plaque = [];
    for (let k = 0; k < 26; k++) {
      const x = 240 + (k / 25) * 320 + (ctx.rng() - 0.5) * 12;
      const y = (k % 2 ? 188 : 160) + (ctx.rng() - 0.5) * 8;
      plaque.push({ x, y, el: s("ellipse", { cx: x.toFixed(1), cy: y.toFixed(1), rx: (12 + ctx.rng() * 7).toFixed(1), ry: (4 + ctx.rng() * 2).toFixed(1), fill: "#d6be5a", opacity: 0.55 }, plaqueG), gone: false });
    }
    /*
     * Sprint 11 (Zafar, 21 Oct): the plus-shaped track. Its centre is where the brush head rests (TR, the mouth's units),
     * its four channels run out to a target each (END): a tooth-shine spot, with the dirt drawn on it.
     */
    const TR = Object.assign({ x: M.x, y: M.y - 60, ax: 235, ay: 150, w: 86, r: 40 }, data.track || {});
    const END = { up: { x: TR.x, y: TR.y - TR.ay }, down: { x: TR.x, y: TR.y + TR.ay }, left: { x: TR.x - TR.ax, y: TR.y }, right: { x: TR.x + TR.ax, y: TR.y } };
    const trackG = s("g", { class: "tooth-track" }, mouthG);
    const arms = [[TR.x - TR.ax - TR.w / 2, TR.y - TR.w / 2, 2 * TR.ax + TR.w, TR.w], [TR.x - TR.w / 2, TR.y - TR.ay - TR.w / 2, TR.w, 2 * TR.ay + TR.w]];
    // one see-through cross (the group's opacity: the two arms' overlap is never doubled), a soft gold edge round it
    const band = s("g", { opacity: 0.55 }, trackG);
    arms.forEach(([x, y, w, hh]) => s("rect", { x, y, width: w, height: hh, rx: TR.w / 2, fill: "none", stroke: "#f2dc9b", "stroke-width": 10 }, band));
    arms.forEach(([x, y, w, hh]) => s("rect", { x, y, width: w, height: hh, rx: TR.w / 2, fill: "#fffdf6" }, band));
    const STAR = (r) => `M0 ${-r} Q${r * 0.16} ${-r * 0.16} ${r} 0 Q${r * 0.16} ${r * 0.16} 0 ${r} Q${-r * 0.16} ${r * 0.16} ${-r} 0 Q${-r * 0.16} ${-r * 0.16} 0 ${-r}Z`;
    const target = {};
    DIRS.forEach((d) => {
      const e = END[d];
      const g = s("g", { class: "tooth-target", transform: `translate(${e.x} ${e.y})` }, trackG);
      g.dataset.dir = d;
      s("circle", { r: TR.r, fill: "#ffffff", stroke: "#8fcde3", "stroke-width": 5 }, g);
      s("path", { d: STAR(TR.r * 0.62), fill: "#bfe8f6" }, g); // the shine spot
      const dirt = s("g", { class: "tooth-dirt", opacity: 0 }, g);
      for (let k = 0; k < 7; k++) {
        const an = (k / 7) * Math.PI * 2 + ctx.rng() * 0.6;
        const rr = k ? TR.r * (0.35 + ctx.rng() * 0.38) : 0;
        s("ellipse", { cx: (Math.cos(an) * rr).toFixed(1), cy: (Math.sin(an) * rr).toFixed(1), rx: (TR.r * (0.26 + ctx.rng() * 0.14)).toFixed(1), ry: (TR.r * (0.2 + ctx.rng() * 0.1)).toFixed(1), fill: k % 2 ? "#b8913a" : "#d0ad4e", opacity: 0.92 }, dirt);
      }
      const shine = s("g", { opacity: 0 }, g);
      [[-0.9, -0.7, 0.42], [0.85, -0.55, 0.32], [0.6, 0.85, 0.36], [-0.7, 0.75, 0.28]].forEach(([x, y, k]) => s("path", { d: STAR(TR.r * k), fill: "#ffffff", stroke: "#8fcde3", "stroke-width": 2, transform: `translate(${(x * TR.r).toFixed(1)} ${(y * TR.r).toFixed(1)})` }, shine));
      target[d] = { g, dirt, shine, level: 0, step: 1 };
    });
    // the dirt (drawn in code): at L1-2, while the order's words are supported, only on the order's sides; else all four.
    // On the order's sides each right move takes its share; on all four a brushed side only fades (never bare until the
    // order is done: a clean side would tell where not to go)
    const orderOnly = orderDirt(P.level, P.moves);
    const cnt = (d) => P.moves.filter((m) => m === d).length;
    const dirtShow = (d) => target[d].dirt.setAttribute("opacity", Math.max(0, target[d].level).toFixed(2));
    DIRS.forEach((d) => {
      const t = target[d];
      t.level = orderOnly ? (cnt(d) ? 1 : 0) : 1;
      t.step = orderOnly ? 1 / Math.max(1, cnt(d)) : 1 / (cnt(d) + 2);
      dirtShow(d);
    });
    // CLN-180 (Zafar, 18 Oct; the s08b TB1 brush): the brush lies straight, its bristles at its end on the cross's centre.
    // Sprint 11: on the cross its handle lies at an angle (data brush.angle, 45 degrees down to the right), between the
    // right and the down channels, so it never covers a target
    const brushIn = art("brushInMouth");
    const BR = Object.assign({ src: "assets/clinic/items-v2/toothbrush.webp", size: [374, 291], head: [62, 52], w: 300, angle: 45 }, data.brush || {}, brushIn ? { size: brushIn.size, head: brushIn.head, w: brushIn.w } : {});
    const brushG = s("g", { class: "tooth-brush" }, mouthG);
    const bW = BR.w;
    const bH = (BR.w * BR.size[1]) / BR.size[0];
    const hx = (BR.head[0] / BR.size[0]) * bW;
    const hy = (BR.head[1] / BR.size[1]) * bH;
    s("image", { href: url(brushIn ? brushIn.src : BR.src), x: TR.x - hx, y: TR.y - hy, width: bW, height: bH, transform: `rotate(${BR.angle} ${TR.x} ${TR.y})` }, brushG);
    const at = { x: 0, y: 0 }; // the brush head's offset from the centre (mouth units)
    const setBrush = (x, y) => {
      at.x = x;
      at.y = y;
      brushG.setAttribute("transform", x || y ? `translate(${x.toFixed(1)} ${y.toFixed(1)})` : "");
    };
    const wipe = (x, y, r = 58) => wipeMask && s("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r, fill: "#000" }, wipeMask);
    const plaqueGone = (ms = 600) => plaqueImg && plaqueImg.animate && plaqueImg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, fill: "forwards" });
    const scrub = (hx2, hy2) => {
      wipe(hx2, hy2);
      plaque.forEach((q) => {
        if (q.gone || Math.hypot(q.x - hx2, q.y - hy2) > 64) return;
        q.gone = true;
        q.el.animate([{ opacity: 0.55 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
      });
    };
    const foam = s("g", {}, mouthG);

    /* ---------------- 2. the wide-open mouth and the sore tooth on it (face2) ---------------- */
    const face2 = s("g", { class: "tooth-close", opacity: 0 }, S.layer);
    if (artMode) {
      const b = mouthArt.box;
      s("image", { href: url(mouthArt.src), x: b[0], y: b[1], width: b[2], height: b[3], preserveAspectRatio: "none", class: "tooth-mouth-art" }, face2);
      // its own teeth, upscaled x2 from the @2x (build/tools/art/upscale.py's network), laid exactly over them
      const hd = mouthArt.hd;
      if (hd && hd.src) {
        const k = b[2] / mouthArt.size[0];
        s("image", { href: url(hd.src), x: b[0] + hd.crop[0] * k, y: b[1] + hd.crop[1] * k, width: (hd.crop[2] - hd.crop[0]) * k, height: (hd.crop[3] - hd.crop[1]) * k, preserveAspectRatio: "none", class: "tooth-teeth-hd" }, face2);
      }
    }
    if (artMode && mouthArt.glint) {
      // Sprint 10 (the judge: "a hard-edged pale rectangle covers the top of the tooth"): the mouth picture has a pale
      // rectangular glint baked into the sore tooth's top (in the 1x and in the upscaled teeth alike). A feathered patch
      // of the tooth's own surface from just below it (the same two pictures, shifted) covers it, so no box edge shows
      const G = mouthArt.glint; // {x, y, rx, ry, dy, blur}: the glint's ellipse and where the clean surface is, in this layer's units
      const gd = s("defs", {}, face2);
      const gf = s("filter", { id: `${uid}-gblur`, x: "-60%", y: "-60%", width: "220%", height: "220%" }, gd);
      s("feGaussianBlur", { stdDeviation: G.blur }, gf);
      const gm = s("mask", { id: `${uid}-gm`, maskUnits: "userSpaceOnUse", x: G.x - G.rx * 2, y: G.y - G.ry * 3, width: G.rx * 4, height: G.ry * 6 }, gd);
      s("ellipse", { cx: G.x, cy: G.y, rx: G.rx, ry: G.ry, fill: "#fff", filter: `url(#${uid}-gblur)` }, gm);
      const patch = s("g", { class: "tooth-glint-patch", mask: `url(#${uid}-gm)` }, face2);
      const shifted = s("g", { transform: `translate(0 ${-G.dy})` }, patch);
      [...face2.querySelectorAll(":scope > image")].forEach((im) => shifted.appendChild(im.cloneNode(true)));
    }
    const ds = s("g", { class: "tooth-drill-space", transform: dsT }, face2); // the drill's units
    const toothPath = (x0, x1, y0, y1) => `M${x0} ${y0} Q${(x0 + x1) / 2} ${y0 - 26} ${x1} ${y0} L${x1 - 6} ${y1 - 40} Q${x1 - 14} ${y1 + 6} ${(x0 + x1) / 2} ${y1} Q${x0 + 14} ${y1 + 6} ${x0 + 6} ${y1 - 40}Z`;
    if (!artMode) {
      // the drawn close tooth (the stand-in): inside the mouth, the gum, the neighbours, the lip
      s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: "#4e1620" }, ds);
      s("path", { d: "M-400 -300 L1200 -300 L1200 120 Q400 40 -400 120Z", fill: "#e8909a" }, ds);
      s("path", { d: "M-400 560 Q400 470 1200 560 L1200 900 L-400 900Z", fill: "#c4636b" }, ds);
      s("path", { d: toothPath(30, 252, 96, 370), fill: "#f6f2e8", stroke: "#d8cfbd", "stroke-width": 4 }, ds);
      s("path", { d: toothPath(548, 770, 96, 370), fill: "#f6f2e8", stroke: "#d8cfbd", "stroke-width": 4 }, ds);
      s("path", { d: toothPath(272, 528, 92, TOOTH.y1), fill: "#fbf9f2", stroke: "#d8cfbd", "stroke-width": 5 }, ds);
    }
    // the decay, cut away where the drill has been (a mask of drilled circles)
    const defs = s("defs", {}, S.svg);
    const mask = s("mask", { id: `${uid}-m`, maskUnits: "userSpaceOnUse", x: -400, y: -300, width: 1600, height: 1100 }, defs);
    s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: "#fff" }, mask);
    // the orchestrator's look (19 Oct, on CLN-181): the drilled cavity is a soft, rounded, darker hollow (never a hard
    // drawn outline), and the filling a soft-edged patch that grows from its middle to cover it
    const soft = (id, sd) => {
      const f = s("filter", { id, x: "-50%", y: "-50%", width: "200%", height: "200%", "color-interpolation-filters": "sRGB" }, defs);
      s("feGaussianBlur", { stdDeviation: sd }, f);
      return `url(#${id})`;
    };
    const SOFT_HOLE = soft(`${uid}-soft-hole`, 7);
    const SOFT_FILL = soft(`${uid}-soft-fill`, 3.5);
    // CLN-181 (the judge: the tip "at the upper-right edge of the cavity", the fill "from the edge"): a hollow's middle is
    // its jagged outline's own centre of area (mid), not the point it was scattered round: the hollow's shading, the
    // filling's growth and the nozzle's tip all use it
    const hollowMid = (p) => {
      if (p.mid) return p.mid;
      const q = p.pts || [];
      let A = 0;
      let X = 0;
      let Y = 0;
      for (let i = 0; i < q.length; i++) {
        const [x0, y0] = q[i];
        const [x1, y1] = q[(i + 1) % q.length];
        const c = x0 * y1 - x1 * y0;
        A += c;
        X += (x0 + x1) * c;
        Y += (y0 + y1) * c;
      }
      p.mid = Math.abs(A) > 1e-6 ? { x: X / (3 * A), y: Y / (3 * A) } : { x: p.cx, y: p.cy };
      return p.mid;
    };
    const about = (p, k) => `translate(${(hollowMid(p).x * (1 - k)).toFixed(2)} ${(hollowMid(p).y * (1 - k)).toFixed(2)}) scale(${k.toFixed(4)})`;
    const holesG = s("g", {}, ds); // the drilled holes (under the decay)
    const decayG = s("g", { mask: `url(#${uid}-m)` }, ds);
    const scuffG = s("g", {}, ds); // where healthy enamel was drilled
    const pasteG = s("g", {}, ds);
    const chipEl = s("path", { d: `M470 ${TOOTH.y0 + 20} L520 ${TOOTH.y0 + 12} L514 ${TOOTH.y0 + 68} Z`, fill: "#4e1620", opacity: 0 }, ds);
    const drillPatches = P.steps.find((x) => x.kind === "drill").patches;
    // the patches sit on the tooth's crown, whatever its height (the plan places them in CROWN, a tooth 300 tall)
    const fitY = (y) => TOOTH.y0 + ((y - 92) * (TOOTH.y1 - TOOTH.y0)) / 300;
    drillPatches.forEach((p) => {
      if (p.fitted) return;
      p.fitted = true;
      const k = Math.min(1, (TOOTH.y1 - TOOTH.y0) / 300);
      const cy = fitY(p.cy);
      p.pts = p.pts.map(([x, y]) => [Math.round(x), Math.round(cy + (y - p.cy) * Math.max(k, 0.82))]);
      p.cy = Math.round(cy);
    });
    const decayArt = [1, 2, 3].map((n) => art(`decay${n}`));
    drillPatches.forEach((p, k) => {
      const d = p.pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ") + "Z";
      p.d = d;
      s("path", { d, fill: "#b48a72", opacity: 0.75, filter: SOFT_HOLE, transform: about(p, 0.9) }, holesG);
      s("path", { d, fill: "#7f5a48", opacity: 0.55, filter: SOFT_HOLE, transform: about(p, 0.55) }, holesG);
      const a = decayArt[k % 3];
      if (a) {
        // A2 (5 Oct): O2's decay as the patch's texture, clipped to the patch's own outline (the drill's samples)
        const cid = `${uid}-d${k}`;
        s("path", { d }, s("clipPath", { id: cid }, decayG));
        s("image", { href: url(a.src), x: hollowMid(p).x - p.r * 1.5, y: hollowMid(p).y - p.r * 1.5, width: p.r * 3, height: p.r * 3, preserveAspectRatio: "none", "clip-path": `url(#${cid})` }, decayG);
        s("path", { d, fill: "none", stroke: "#2f1f17", "stroke-width": 5, "stroke-linejoin": "round", opacity: 0.95 }, decayG); // Sprint 10: a clear dark outline
      } else {
        s("path", { d, fill: "#4a3326", stroke: "#2f1f17", "stroke-width": 5, "stroke-linejoin": "round" }, decayG);
        s("path", { d, fill: "none", stroke: "#6e4c37", "stroke-width": 9, opacity: 0.5, transform: `translate(${p.cx * 0.12} ${p.cy * 0.12}) scale(0.88)` }, decayG);
      }
      // the points the drill must reach (every 9 units inside the patch)
      p.samples = [];
      for (let y = p.cy - p.r * 1.3; y <= p.cy + p.r * 1.3; y += 9) for (let x = p.cx - p.r * 1.3; x <= p.cx + p.r * 1.3; x += 9) if (inPoly(x, y, p.pts)) p.samples.push([x, y]);
      p.left = new Set(p.samples.map((_, i) => i));
    });
    // the drill, the nozzle, the gauge and the button: drill units, over everything (S.fx)
    const dsFx = s("g", { class: "tooth-drill-fx", transform: dsT }, S.fx);
    // CLN-51: the drill is its picture (assets/clinic/items-v2), placed so its tip (the bur, data: drill.tip, in the
    // picture's own pixels) sits exactly under the finger
    const DR = Object.assign({ src: "assets/clinic/items-v2/dentist-drill.webp", size: [394, 212], tip: [45, 196], w: 150 }, data.drill || {});
    const DW = DR.w;
    const DH = (DR.w * DR.size[1]) / DR.size[0];
    const tipX = (DR.tip[0] / DR.size[0]) * DW;
    const tipY = (DR.tip[1] / DR.size[1]) * DH;
    const drillEl = s("image", { href: url(DR.src), x: -1000, y: -1000, width: DW, height: DH, opacity: 0, class: "hs-drill" }, dsFx);
    drillEl.dataset.tipX = String(tipX);
    drillEl.dataset.tipY = String(tipY);
    const TIP_R = 23; // the bur's reach, drill units (17 before the bigger cavities of Sprint 10)

    /* ---------------- 3. the fill: the nozzle on the cavity, the gauge and the big button ---------------- */
    const fillG = s("g", { opacity: 0, class: "tooth-fill" }, dsFx);
    /*
     * CLN-183 (Zafar, 18 Oct: "the speedometer for the dial game, that looks really good ... use design elements from
     * that"): the gauge is Cook's daal speed dial, drawn small: the dark glass face, the thin gold rim, the bands round a
     * half circle (red, then green, then red), the band the needle is in lit in its own colour, the gold needle and hub.
     * CLN-182: its middle and the button's middle on one line, half way between the tooth's bottom and the screen's
     * (placeFill(), on every resize).
     */
    const GA = { w: 250, h: 170, R: 86, bw: 22, ay: 42 };
    const gaugeG = s("g", { class: "tooth-gauge" }, fillG);
    const GOLD = "#c9962e";
    const BANDS = [
      [0, zone[0], "#d0604a"],
      [zone[0], zone[1], "#8fb087"],
      [zone[1], FILL.max, "#d0604a"],
    ];
    const toA = (v) => Math.PI + (Math.max(0, Math.min(FILL.max, v)) / FILL.max) * Math.PI;
    const arc = (a, b, r) => {
      const p0 = [Math.cos(toA(a)) * r, GA.ay + Math.sin(toA(a)) * r];
      const p1 = [Math.cos(toA(b)) * r, GA.ay + Math.sin(toA(b)) * r];
      return `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
    };
    s("rect", { x: -GA.w / 2 + 3, y: -GA.h / 2 + 6, width: GA.w, height: GA.h, rx: 24, fill: "#28190a", opacity: 0.22 }, gaugeG); // its shadow
    s("rect", { x: -GA.w / 2, y: -GA.h / 2, width: GA.w, height: GA.h, rx: 24, fill: "#1d1b1a", "fill-opacity": 0.96, stroke: GOLD, "stroke-width": 4 }, gaugeG);
    s("rect", { x: -GA.w / 2 + 8, y: -GA.h / 2 + 8, width: GA.w - 16, height: GA.h - 16, rx: 18, fill: "none", stroke: "#fff", "stroke-opacity": 0.08, "stroke-width": 2 }, gaugeG);
    BANDS.forEach(([a, b, col]) => s("path", { d: arc(a + 0.004, b - 0.004, GA.R), stroke: col, "stroke-opacity": 0.72, "stroke-width": GA.bw, fill: "none" }, gaugeG));
    const litG = s("g", {}, gaugeG);
    const needle = s("g", {}, gaugeG);
    const needleSh = s("line", { x1: 0, y1: GA.ay + 2, x2: 0, y2: GA.ay + 2, stroke: "#0e0d0c", "stroke-opacity": 0.5, "stroke-width": 7, "stroke-linecap": "round" }, needle);
    const needleLn = s("line", { x1: 0, y1: GA.ay, x2: 0, y2: GA.ay, stroke: "#f0cf7a", "stroke-width": 5, "stroke-linecap": "round" }, needle);
    s("circle", { cx: 0, cy: GA.ay, r: 24, fill: "#ffa94d", opacity: 0.18 }, needle);
    s("circle", { cx: 0, cy: GA.ay, r: 12, fill: GOLD }, needle);
    s("circle", { cx: 0, cy: GA.ay, r: 5, fill: "#3a2410" }, needle);
    let litBand = -1;
    const setMarker = (f) => {
      const a = toA(Math.min(FILL.max, f));
      const r = GA.R - 4;
      [needleSh, needleLn].forEach((ln, k) => {
        ln.setAttribute("x2", (Math.cos(a) * r).toFixed(1));
        ln.setAttribute("y2", (GA.ay + (k ? 0 : 2) + Math.sin(a) * r).toFixed(1));
      });
      // the band the needle is in, lit in its own colour with a soft glow (never over the others)
      const bi = f <= 0.01 ? -1 : BANDS.findIndex(([, b]) => f < b) < 0 ? BANDS.length - 1 : BANDS.findIndex(([, b]) => f < b);
      if (bi === litBand) return;
      litBand = bi;
      S.clear(litG);
      if (bi < 0) return;
      const [a0, b0, col] = BANDS[bi];
      [[GA.bw + 18, 0.12], [GA.bw + 9, 0.22]].forEach(([w, op]) => s("path", { d: arc(a0 + 0.004, b0 - 0.004, GA.R), stroke: col, "stroke-opacity": op, "stroke-width": w, fill: "none" }, litG));
      s("path", { d: arc(a0 + 0.004, b0 - 0.004, GA.R), stroke: col, "stroke-width": GA.bw, fill: "none", class: bi === 2 ? "tooth-over" : null }, litG);
    };
    setMarker(0);
    // the nozzle (B1's art; a drawn white-and-steel pen until then): its tip on the middle of the cavity it fills
    const nozzleG = s("g", { class: "tooth-nozzle" }, fillG);
    const nozArt = art("nozzle");
    const nozPasteArt = art("nozzlePaste");
    let nozImg = null;
    if (nozArt) nozImg = s("image", { href: url(nozArt.src), x: -nozArt.tip[0], y: -nozArt.tip[1], width: nozArt.size[0], height: nozArt.size[1] }, nozzleG);
    else {
      s("path", { d: "M0 0 L16 -30 L30 -24 Z", fill: "#9aa3ad" }, nozzleG);
      s("rect", { x: 12, y: -150, width: 44, height: 130, rx: 20, fill: "#f2f0ea", stroke: "#b9b4aa", "stroke-width": 3, transform: "rotate(28 34 -85)" }, nozzleG);
    }
    const NZ = { x: 400, y: 222 };
    const putNozzle = (x, y) => {
      NZ.x = x;
      NZ.y = y;
      nozzleG.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    };
    // the big press button (blue on a white base: neither "stop" nor "yes")
    const BTN = { x: 560, y: 470, r: 46 };
    const btnG = s("g", { class: "tooth-button" }, fillG);
    const upArt = art("buttonUp");
    const downArt = art("buttonDown");
    let btnUp = null;
    let btnDown = null;
    const BW = 150;
    const BH = upArt ? (BW * 401) / 494 : 120; // the B1 button's own canvas, 494 x 401
    if (upArt && downArt) {
      btnUp = s("image", { href: url(upArt.src), x: -BW / 2, y: -BH / 2, width: BW, height: BH }, btnG);
      btnDown = s("image", { href: url(downArt.src), x: -BW / 2, y: -BH / 2, width: BW, height: BH, opacity: 0 }, btnG);
    } else {
      s("ellipse", { cx: 0, cy: 22, rx: BTN.r + 18, ry: 22, fill: "#e9e6df", stroke: "#b9b4aa", "stroke-width": 3 }, btnG);
      s("rect", { x: -BTN.r - 18, y: 0, width: 2 * BTN.r + 36, height: 22, fill: "#e9e6df" }, btnG);
      s("ellipse", { cx: 0, cy: 0, rx: BTN.r + 18, ry: 20, fill: "#f7f5f0", stroke: "#b9b4aa", "stroke-width": 3 }, btnG);
      btnUp = s("g", {}, btnG);
      s("rect", { x: -BTN.r, y: -26, width: 2 * BTN.r, height: 26, fill: "#2f6fbf" }, btnUp);
      s("ellipse", { cx: 0, cy: 0, rx: BTN.r, ry: 16, fill: "#2f6fbf" }, btnUp);
      s("ellipse", { cx: 0, cy: -26, rx: BTN.r, ry: 16, fill: "#4a8fe0", stroke: "#2a5fa3", "stroke-width": 2 }, btnUp);
    }
    const GAUGE = { x: 305, y: 470 };
    const placeFill = () => {
      // CLN-182: half way between the tooth's bottom and the screen's bottom (the near view's), both middles on it;
      // the pair centred under the tooth
      const v = view.near();
      // the screen's bottom in the near view: the svg fits its viewBox inside its own box (meet), so where the box is
      // taller than the view, more shows below (tablets), centred
      const er = S.svg.getBoundingClientRect();
      const visH = er.width > 0 && er.height > 0 ? Math.max(v[3], (v[2] * er.height) / er.width) : v[3];
      let bottom = (v[1] + v[3] / 2 + visH / 2 - DY0) * KD;
      // in the near view itself: the screen's own bottom, measured through the svg's matrix (exact on every shape)
      const m = st.view === "near" && !st.moving && S.svg.getScreenCTM ? S.svg.getScreenCTM() : null;
      const doc = S.svg.ownerDocument;
      const screenB = doc && doc.documentElement ? doc.documentElement.clientHeight : 0;
      if (m && m.d && screenB) bottom = ((screenB - m.f) / m.d - DY0) * KD;
      const mid = (TOOTH.y1 + bottom) / 2;
      const cx = (TOOTH.x0 + TOOTH.x1) / 2;
      const gap = 50;
      const total = GA.w + gap + BW;
      GAUGE.x = cx - total / 2 + GA.w / 2;
      GAUGE.y = mid;
      BTN.x = cx + total / 2 - BW / 2;
      BTN.y = mid;
      gaugeG.setAttribute("transform", `translate(${GAUGE.x.toFixed(1)} ${GAUGE.y.toFixed(1)})`);
      btnG.setAttribute("transform", `translate(${BTN.x.toFixed(1)} ${BTN.y.toFixed(1)})`);
    };
    const pressBtn = (down) => {
      if (btnDown) {
        btnUp.setAttribute("opacity", down ? 0 : 1);
        btnDown.setAttribute("opacity", down ? 1 : 0);
      } else btnUp.setAttribute("transform", down ? "translate(0 18)" : "");
      // (the orchestrator, 19 Oct; Zafar: "you don't need to show really anything coming out"): the nozzle stays the
      // plain one while pressed: its paste picture drew a squiggle from the tip, so nothing shows between tip and cavity
      void nozPasteArt;
    };
    const fillArt = art("fillingPatch");
    // CLN-181: the cavities fill one at a time, each from its middle out, the nozzle's tip on the middle of the one
    // filling (left to right); past the green every filling bulges (too much)
    const order = drillPatches.slice().sort((a, b) => a.cx - b.cx);
    const share = (f, i) => Math.max(0, Math.min(1, (f / zone[0]) * order.length - i));
    const filling = (f) => order.find((p, i) => share(f, i) < 1) || order[order.length - 1];
    const drawPaste = () => {
      S.clear(pasteG);
      const f = st.fill;
      if (f <= 0) return;
      order.forEach((p, i) => {
        const g0 = share(f, i);
        if (g0 <= 0) return;
        const k = g0 * (f > zone[1] ? 1 + (f - zone[1]) * 1.6 : 1);
        // T3 (CLN-103): the filling a shade off white (tooth-coloured), never an outline; soft-edged and a little wider
        // than the hollow, so at full it covers it
        const tf = about(p, k * 1.12);
        s("path", { d: p.d, fill: "#f3eee0", stroke: "none", filter: SOFT_FILL, transform: tf }, pasteG);
        if (fillArt) {
          const mid = `${uid}-f${p.cx | 0}-${p.cy | 0}`;
          const mk = s("mask", { id: mid, maskUnits: "userSpaceOnUse", x: -400, y: -300, width: 1600, height: 1100 }, pasteG);
          s("path", { d: p.d, fill: "#fff", filter: SOFT_FILL, transform: tf }, mk);
          const g = s("g", { mask: `url(#${mid})` }, pasteG);
          s("image", { href: url(fillArt.src), x: hollowMid(p).x - p.r * 1.5, y: hollowMid(p).y - p.r * 1.5, width: p.r * 3, height: p.r * 3, preserveAspectRatio: "none" }, g);
        }
      });
    };

    /* ---------------- the camera: one picture, one move in and out ---------------- */
    const parseVB = () => String(S.svg.getAttribute("viewBox") || "0 0 800 500").trim().split(/[\s,]+/).map(Number);
    const view = {
      fit: null,
      // the scene's own fit (js/clinic/heal/scene.js), read once per size
      base() {
        if (!view.fit) {
          S.fitView();
          view.fit = parseVB();
        }
        return view.fit;
      },
      // CLN-185: a step less zoomed in than before: the brushing view wider than the scene's fit (1 / CAM.far)
      far() {
        const b = view.base();
        const w = b[2] / CAM.far;
        const hh = b[3] / CAM.far;
        return [b[0] + b[2] / 2 - w / 2, CAM.farY - hh / 2, w, hh];
      },
      // the sore tooth about a quarter of the view's width (it was a third), near the top, room under it for the fill
      near() {
        const b = view.base();
        const w = (sore.w * CAM.near) / 256;
        const hh = (w * b[3]) / b[2];
        return [sore.x + sore.w / 2 - w / 2, sore.y - CAM.nearTop * hh, w, hh];
      },
    };
    const setVB = (b) => S.svg.setAttribute("viewBox", b.map((v) => Math.round(v * 10) / 10).join(" "));
    // one tween in log space: the size changes evenly, and the point being zoomed on stays put as it grows
    const camera = (from, to, ms, each) =>
      new Promise((res) => {
        if (fast() || !root.requestAnimationFrame) {
          setVB(to);
          if (each) each(1);
          return res();
        }
        const t0 = Date.now();
        const lw0 = Math.log(from[2]);
        const lw1 = Math.log(to[2]);
        const step = () => {
          if (st.gone) return res();
          const u = Math.min(1, (Date.now() - t0) / ms);
          const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
          const w = Math.exp(lw0 + (lw1 - lw0) * e);
          const f = Math.abs(to[2] - from[2]) > 0.01 ? (from[2] - w) / (from[2] - to[2]) : e;
          setVB([from[0] + (to[0] - from[0]) * f, from[1] + (to[1] - from[1]) * f, w, (w * from[3]) / from[2]]);
          if (each) each(e);
          if (u < 1) root.requestAnimationFrame(step);
          else res();
        };
        step();
      });
    const rest = () => setVB(st.view === "near" ? view.near() : view.far());
    ctx.on(root, "resize", () => {
      view.fit = null;
      if (!st.moving) rest();
      placeFill();
    });
    const fade = (u, a, b) => Math.max(0, Math.min(1, (u - a) / (b - a)));
    const view2 = async (k) => {
      if (k === "brush") {
        face1.setAttribute("opacity", 1);
        face2.setAttribute("opacity", 0);
        fillG.setAttribute("opacity", 0);
        return;
      }
      if (st.view === "far") {
        // the push-in: the mouth opens wide as the camera starts (the two mouths share their front teeth), then on in
        st.busy = true;
        st.moving = true;
        S.clear(foam); // the brushing's foam stays in the brushing (never into the drill's close-up)
        brushG.setAttribute("opacity", 0);
        trackG.setAttribute("opacity", 0);
        dirOff();
        await camera(view.far(), view.near(), CAM.ms, (e) => {
          face2.setAttribute("opacity", fade(e, 0, 0.4).toFixed(3));
          face1.setAttribute("opacity", (1 - fade(e, 0.25, 0.45)).toFixed(3));
        });
        face2.setAttribute("opacity", 1);
        face1.setAttribute("opacity", 0);
        st.view = "near";
        st.moving = false;
        st.busy = false;
      }
      fillG.setAttribute("opacity", k === "fill" ? 1 : 0);
    };
    const pullOut = async () => {
      // the pull-out: the camera back out over the filled tooth (the fillings in their places), and the mouth closes to
      // the brushing's at the end (CLN-103: she ends with the less open mouth, the plaque gone and the brush put away)
      fillG.setAttribute("opacity", 0);
      drillEl.setAttribute("opacity", 0);
      if (plaqueImg) plaqueImg.setAttribute("opacity", 0);
      plaqueG.setAttribute("opacity", 0);
      brushG.setAttribute("opacity", 0);
      trackG.setAttribute("opacity", 0);
      dirOff();
      st.moving = true;
      await camera(view.near(), view.far(), CAM.ms, (e) => {
        face1.setAttribute("opacity", fade(e, 0.6, 0.85).toFixed(3));
        face2.setAttribute("opacity", (1 - fade(e, 0.75, 1)).toFixed(3));
      });
      st.view = "far";
      st.moving = false;
    };
    rest();
    placeFill();

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const inM = (x, y, r) => Object.assign(fromD(x, y), r ? { r: r / KD } : {});
    let timer = null;
    const open = async () => {
      const c = cur();
      ctx.card.now(rowOf(c));
      await view2(c.kind);
      if (cur() !== c || st.over) return;
      if (c.kind === "brush") openBrush(c);
      if (c.kind === "drill") {
        const p = c.patches[0];
        // Sprint 10: the ghost starts in the cavity, where the drill rests, and drags across it
        const m0 = hollowMid(p);
        S.cue("drill", { gesture: "drag", to: inM(m0.x + p.r * 0.6, m0.y) }, inM(m0.x, m0.y));
        if (c.timer) timer = S.timer(c.timer * (fast() ? 2 : 1), () => cur() === c && close());
        parkDrill();
      }
      if (c.kind === "fill") {
        placeFill(); // the near view has landed: measured on the screen itself (CLN-182)
        const p = filling(0);
        putNozzle(hollowMid(p).x, hollowMid(p).y);
        drawPaste();
        S.cue("fill", CUES.fill, inM(BTN.x, BTN.y, BTN.r + 10));
      }
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "brush") {
        // the taught round's one [Brush] row ticks with the last move (CLN-118)
        if (!c.rowKey || c.i === P.moves.length - 1) ctx.card.tick(rowOf(c));
        // the order is right when every move went the right way first time and no card's arrow was opened (the review shows
        // it on the brush rows, D14)
        const firstTry = P.steps.filter((x) => x.kind === "brush").every((x) => !st.missed[x.i] && !st.helped[x.i]);
        if (c.i === P.moves.length - 1) judge("b-order", JSON.stringify(st.done) === JSON.stringify(P.moves) && firstTry, { moves: st.done.slice(), tries: st.tries.slice() });
      }
      if (c.kind === "drill") {
        if (timer) timer.stop();
        const all = c.patches.every((p) => !p.left.size);
        judge("drill-care", !st.chipped && all, { cleared: c.patches.filter((p) => !p.left.size).length, of: c.patches.length, chipped: st.chipped });
        drillEl.setAttribute("opacity", 0);
        ctx.card.tick(c.id);
      }
      if (c.kind === "fill") ctx.card.tick(c.id); // (judged on the first go: stopFill)
      S.uncue();
      st.i++;
      if (cur()) open();
      else finish();
    };
    const finish = async () => {
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      await pullOut();
      S.face("happy");
      S.say("tooth-better", "patient");
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    /* ---------------- the gestures ---------------- */
    let drag = null;
    const onButton = (q) => Math.hypot(q.x - BTN.x, q.y - BTN.y) < BTN.r + 30;
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      if (!c) return;
      // the brush: taken anywhere near its head (it rests on the cross's centre)
      if (c.kind === "brush") {
        // (or near the centre while a demo has it out on the cross: the child's hand takes over, the brush comes home)
        const nearHead = Math.hypot(p.x - TR.x - at.x, p.y - TR.y - at.y) < TR.w * 1.6;
        const nearHome = Math.hypot(p.x - TR.x, p.y - TR.y) < TR.w * 1.6;
        if (!st.snapping && (nearHead || nearHome)) {
          if (!nearHead || at.x || at.y) setBrush(0, 0);
          drag = { from: p, axis: null, fired: false };
        }
      } else if (c.kind === "drill") {
        drag = { drill: true, last: null };
        drillAt(toD(p));
      } else if (c.kind === "fill" && onButton(toD(p))) startFill();
      if ((drag || st.holding) && S.svg.setPointerCapture) S.svg.setPointerCapture(e.pointerId);
    });
    ctx.on(S.svg, "pointermove", (e) => {
      if (!drag) return;
      const p = S.pt(e);
      if (drag.drill) return drillAt(toD(p));
      // Sprint 11: the brush runs only in the cross's channels: the first few units of a pull choose the channel, back at
      // the centre it can turn into the other; pulled to a channel's end it has made that move
      if (cur() && cur().kind === "brush") {
        if (drag.fired) return;
        const dx = p.x - drag.from.x;
        const dy = p.y - drag.from.y;
        if (!drag.axis) {
          if (Math.hypot(dx, dy) < 10) return;
          drag.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        }
        let v = drag.axis === "x" ? dx : dy;
        const o = drag.axis === "x" ? dy : dx;
        if (Math.abs(v) < 14 && Math.abs(o) > 26) {
          drag.axis = drag.axis === "x" ? "y" : "x";
          v = o;
        }
        const A = drag.axis === "x" ? TR.ax : TR.ay;
        v = Math.max(-A, Math.min(A, v));
        setBrush(drag.axis === "x" ? v : 0, drag.axis === "y" ? v : 0);
        if (Math.abs(v) >= A * 0.92) {
          drag.fired = true;
          reach(drag.axis === "x" ? (v < 0 ? "left" : "right") : v < 0 ? "up" : "down");
        }
      }
    });
    const up = () => {
      if (drag && drag.drill) parkDrill();
      if (drag && !drag.drill && !drag.fired) snapBack(false);
      drag = null;
      if (st.holding) stopFill();
    };
    ctx.on(S.svg, "pointerup", up);
    ctx.on(S.svg, "pointercancel", up);

    /* ---------------- the brushing's moves ---------------- */
    // the brush goes back to the centre: a plain snap, or (a wrong way) a gentle bump that overshoots a little
    const snapBack = (bump) =>
      new Promise((res) => {
        const x0 = at.x;
        const y0 = at.y;
        if (!x0 && !y0) return res();
        st.snapping = true;
        const ms = fast() ? 60 : bump ? 520 : 260;
        const t0 = Date.now();
        const ease = (u) => (bump ? 1 + 2.4 * Math.pow(u - 1, 3) + 1.4 * Math.pow(u - 1, 2) : 1 - Math.pow(1 - u, 3));
        const step = () => {
          if (st.gone) return res();
          const u = Math.min(1, (Date.now() - t0) / ms);
          const k = 1 - ease(u);
          setBrush(x0 * k, y0 * k);
          if (u < 1 && root.requestAnimationFrame) return root.requestAnimationFrame(step);
          setBrush(0, 0);
          st.snapping = false;
          res();
        };
        step();
      });
    const sayMove = (c) => (c.line && !ctx.taught ? ctx.say(c.line, { who: "patient" }) : Promise.resolve());
    const reach = (d) => {
      const c = cur();
      if (!c || c.kind !== "brush" || st.over) return;
      (st.tries[c.i] = st.tries[c.i] || []).push(d);
      S.did();
      if (d !== c.move) {
        // a wrong way: the brush bumps gently back, the card gives a little shake and she says the move again
        st.missed[c.i] = true;
        ctx.log({ type: "extra", rowId: "b-order", detail: { asked: c.move, went: d } });
        snapBack(true);
        if (dirCard) {
          dirCard.classList.remove("tooth-dshake");
          void dirCard.offsetWidth;
          dirCard.classList.add("tooth-dshake");
        }
        sayMove(c);
        if (ctx.taught) demoMove(c);
        return;
      }
      st.done.push(d);
      const t = target[d];
      // the shine: the target sparkles and its dirt goes (all of it once the order is brushed)
      t.level = Math.max(0, t.level - t.step);
      dirtShow(d);
      if (t.shine.animate) t.shine.animate([{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1.1)" }, { opacity: 0, transform: "scale(1.3)" }], { duration: fast() ? 120 : 700 });
      const [dx, dy] = SCREEN[d];
      for (let k = 1; k <= 3; k++) scrub(TR.x + (dx * TR.ax * k) / 3, TR.y + (dy * TR.ay * k) / 3);
      if (c.i === P.moves.length - 1) {
        plaque.forEach((q) => !q.gone && ((q.gone = true), q.el.animate([{ opacity: 0.55 }, { opacity: 0 }], { duration: 600, fill: "forwards" })));
        plaqueGone();
        DIRS.forEach((x) => {
          target[x].level = 0;
          dirtShow(x);
        });
      }
      for (let k = 0; k < 3; k++) {
        const f = s("circle", { cx: END[d].x - dx * k * 22 + (ctx.rng() - 0.5) * 30, cy: END[d].y - dy * k * 18 + (ctx.rng() - 0.5) * 24, r: 9 + k * 3, fill: "#fff", opacity: 0.92 }, foam);
        ctx.after(1500, () => f.remove());
      }
      S.face("happy", 400);
      ctx.sfx("tap");
      if (stuck) stuck.done();
      stuck = null;
      // one move, one row: it snaps back and closes as it's brushed (D5; the next move's line comes with its row, D8)
      st.busy = true;
      snapBack(false);
      ctx.after(fast() ? 80 : 450, () => {
        st.busy = false;
        if (cur() === c) close();
      });
    };
    // the direction card (js/shared/word-card.js): an arrow and the word, top left of the play area. The arrow fades with
    // the word's support (rule 6: past stage 2 it would be the answer); opening it is free, and that move counts as shown
    const dirBox = S.h("div", "tooth-dir hidden", S.root);
    let dirCard = null;
    const ARROW = { right: 0, down: 90, left: 180, up: 270 };
    const arrowPic = (d) => (box) => {
      box.innerHTML = `<svg class="tooth-arrow" viewBox="0 0 120 90" aria-hidden="true"><g transform="rotate(${ARROW[d]} 60 45)"><path d="M24 45 H88" stroke="#2f6fbf" stroke-width="14" stroke-linecap="round" fill="none"/><path d="M66 20 L92 45 L66 70" stroke="#2f6fbf" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></svg>`;
    };
    // the card sits in a corner left of the cross (above its left arm, else below it), never over the cross or a target
    // (BRUSH-01): as wide as that corner allows; where neither corner takes the card, the same word as the shared row
    // (picture, speaker and word side by side: a short strip) goes there instead
    const crossBoxes = () => {
      const rr = S.root.getBoundingClientRect();
      const box = (x0, y0, x1, y1) => {
        const p = S.client(x0, y0);
        const q = S.client(x1, y1);
        return { left: p.x - rr.left, top: p.y - rr.top, right: q.x - rr.left, bottom: q.y - rr.top };
      };
      const pad = TR.r * 0.35; // the shine's sparkles
      return [box(TR.x - TR.ax - TR.w / 2 - pad, TR.y - TR.w / 2 - pad, TR.x + TR.ax + TR.w / 2 + pad, TR.y + TR.w / 2 + pad), box(TR.x - TR.w / 2 - pad, TR.y - TR.ay - TR.w / 2 - pad, TR.x + TR.w / 2 + pad, TR.y + TR.ay + TR.w / 2 + pad)];
    };
    const dirClear = () => {
      if (!dirCard || dirBox.classList.contains("hidden")) return true;
      const rr = S.root.getBoundingClientRect();
      const r = dirBox.getBoundingClientRect();
      const c = { left: r.left - rr.left, top: r.top - rr.top, right: r.right - rr.left, bottom: r.bottom - rr.top };
      return crossBoxes().every((b) => c.right <= b.left || c.left >= b.right || c.bottom <= b.top || c.top >= b.bottom);
    };
    let dirMode = null;
    let dirFor = null;
    function placeDir() {
      if (!dirCard || dirBox.classList.contains("hidden")) return;
      const rr = S.root.getBoundingClientRect();
      if (!rr.width) return;
      const gap = 12;
      const [hArm, vArm] = crossBoxes();
      const corners = [[0, hArm.top, vArm.left], [hArm.bottom, rr.height, vArm.left]]; // [y0, y1, x1]: above, then below the left arm
      const MINW = 140;
      const fit = (y0, y1, x1, want) => {
        let w = Math.min(want, x1 - gap * 2);
        if (w < MINW) return false;
        dirBox.style.width = `${Math.round(w)}px`;
        let h = dirBox.getBoundingClientRect().height;
        if (h > y1 - y0 - gap * 2 && dirMode === "card") {
          w -= ((h - (y1 - y0 - gap * 2)) * 4) / 3;
          if (w < MINW) return false; // too small to read its word: the other corner
          dirBox.style.width = `${Math.round(w)}px`;
          h = dirBox.getBoundingClientRect().height;
        }
        if (h > y1 - y0 - gap * 2 + 1) return false;
        Object.assign(dirBox.style, { left: `${gap}px`, top: `${Math.round(y0 + gap)}px` });
        return true;
      };
      for (const mode of ["card", "row"]) {
        if (dirMode !== mode) buildDir(mode);
        dirBox.style.width = "";
        const want = mode === "row" ? corners[0][2] - gap * 2 : dirBox.getBoundingClientRect().width || 160;
        if (corners.some(([y0, y1, x1]) => fit(y0, y1, x1, want))) return;
      }
      // (nowhere clear: the row, top left)
      Object.assign(dirBox.style, { left: `${gap}px`, top: `${gap}px` });
    }
    function buildDir(mode) {
      const c = dirFor;
      const WC = root.WordCard;
      if (!c || !WC) return;
      dirBox.innerHTML = "";
      const id = DIR_ID[c.move];
      const w = HS.L.w(id);
      const stg = HS.stageOf(id);
      const sl = WC.slots(stg, { placeholder: !!w.placeholder });
      dirCard = (mode === "row" ? WC.row : WC.card)(
        dirBox,
        { id, kutchi: w.kutchi, english: w.english, rec: !!w.placeholder, picture: arrowPic(c.move), say: () => ctx.say(w, { who: "doctor", noBubble: true }) },
        {
          stage: stg,
          progress: HS.progress() || undefined,
          slots: { picture: stg <= 2, english: sl.english, kutchiText: sl.kutchi },
          cls: "tooth-dcard",
          onReveal: (slot) => slot === "picture" && cur() === c && (st.helped[c.i] = true),
        }
      );
      dirCard.dataset.dir = c.move;
      dirBox.dataset.mode = dirMode = mode;
    }
    ctx.on(root, "resize", () => placeDir());
    function dirOff() {
      dirBox.classList.add("hidden");
      dirBox.innerHTML = "";
      dirCard = null;
    }
    const showDir = async (c) => {
      const WC = await HS.wordCardKit().catch(() => null);
      if (st.gone || cur() !== c || !WC || !WC.card) return;
      dirFor = c;
      dirMode = null;
      dirBox.classList.remove("hidden");
      buildDir("card");
      placeDir();
      // (measured again once the close-up's push-in has landed: during it the stage is scaled, BRUSH-01)
      Promise.resolve(ctx.zoomed).then(() => ctx.after(60, () => cur() === c && placeDir()));
      dirCard.classList.add("tooth-din");
      ctx.after(fast() ? 50 : 450, () => dirCard && dirCard.classList.remove("tooth-din"));
    };
    // principle 2: the real brush shows it. A first time (and the 5 s and 15 s rungs) it goes round the cross, every channel
    // to its end and back (never only the answer); the taught round shows the very move asked for
    let stuck = null;
    const headClient = () => S.client(TR.x, TR.y);
    const tour = (only) => {
      const pts = [];
      (only ? [only] : ["up", "right", "down", "left"]).forEach((d, k) => {
        if (k) pts.push(S.client(TR.x, TR.y));
        pts.push(S.client(END[d].x, END[d].y));
      });
      return pts;
    };
    const demoAt = (dx, dy) => {
      if (drag || st.snapping) return;
      const u = S.unit();
      setBrush(dx * u, dy * u);
    };
    function demoMove(c) {
      if (!root.Onboard || !root.Onboard.demo || ctx.onboardOn === false) return Promise.resolve();
      return root.Onboard.demo(headClient(), tour(c.move), { step: "tooth-brush", move: demoAt, hand: true, ms: fast() ? 200 : 1500 });
    }
    const openBrush = (c) => {
      trackG.setAttribute("opacity", 1);
      brushG.setAttribute("opacity", 1);
      setBrush(0, 0);
      // the step's name for the help log (its demo is the real brush: Onboard.stuck below), no ghost finger
      S.cue("brush", Object.assign({ watch: true }, CUES.brush), { x: TR.x, y: TR.y });
      if (!ctx.taught) showDir(c);
      if (stuck) stuck.stop();
      stuck = null;
      // CLN-133: the help waits for the close-up's push-in (ctx.zoomed): a demo during it is over before it's seen
      Promise.resolve(ctx.zoomed).then(() => {
        if (st.gone || cur() !== c || st.done.length > c.i || !root.Onboard || !root.Onboard.stuck || ctx.onboardOn === false) return;
        if (stuck) stuck.stop();
        // the rungs count from this step opening (the request pop-up and the push-in are not the child being stuck)
        if (root.NaniGuide && root.NaniGuide.poke) root.NaniGuide.poke();
        stuck = root.Onboard.stuck("tooth-brush", {
          id: "clinic/heal-tooth-brush",
          first: c.i === 0 && !ctx.taught,
          target: trackG,
          live: trackG,
          item: headClient(),
          move: demoAt,
          path: () => tour(ctx.taught ? c.move : null),
          hand: true,
          ms: fast() ? 300 : ctx.taught ? 1500 : 3800,
          line: () => (cur() === c ? sayMove(c) : null),
        });
        // the taught round (D13): every move is shown first, the very move asked for
        if (ctx.taught) ctx.after(fast() ? 50 : 400, () => cur() === c && st.done.length <= c.i && demoMove(c));
      });
    };
    // CLN-103 (decision 72, s04-r2k2): the drill rests beside the tooth, its bur by the crown's lower right, until the
    // finger takes it (its tip under the finger), and goes back
    // Sprint 10 (Zafar, 21 Oct): it rests in the middle of the first cavity instead, so a touch and a move cut at once
    const parkDrill = () => {
      const c = cur();
      if (!c || c.kind !== "drill" || st.over) return drillEl.setAttribute("opacity", 0);
      const rest = hollowMid(c.patches.find((q) => q.left.size) || c.patches[0]);
      drillEl.setAttribute("x", rest.x - tipX);
      drillEl.setAttribute("y", rest.y - tipY);
      drillEl.setAttribute("opacity", 1);
    };
    const drillAt = (p) => {
      const c = cur();
      if (!c || c.kind !== "drill") return;
      drillEl.setAttribute("x", p.x - tipX);
      drillEl.setAttribute("y", p.y - tipY);
      drillEl.setAttribute("opacity", 1);
      if (!S.ready || st.busy) return;
      const inTooth = p.x > TOOTH.x0 + 4 && p.x < TOOTH.x1 - 4 && p.y > TOOTH.y0 + 4 && p.y < TOOTH.y1;
      if (!inTooth) return;
      // cut away the decay under the tip
      if (!drag || !drag.last || Math.hypot(p.x - drag.last.x, p.y - drag.last.y) > 4) {
        // decision 72: the round bur and jagged decay of before Sprint 2 (the square-drill trial is dropped)
        s("circle", { cx: p.x, cy: p.y, r: TIP_R, fill: "#000" }, mask);
        if (drag) drag.last = p;
      }
      let onDecay = false;
      c.patches.forEach((pa) => {
        if (Math.hypot(p.x - pa.cx, p.y - pa.cy) < pa.r * 1.4 + TIP_R) {
          pa.samples.forEach(([x, y], i) => {
            if (pa.left.has(i) && Math.hypot(p.x - x, p.y - y) < TIP_R) {
              pa.left.delete(i);
              onDecay = true;
            }
          });
          if (inPoly(p.x, p.y, pa.pts)) onDecay = true;
          // the last specks go by themselves once most of a patch is gone
          if (pa.left.size && pa.left.size <= pa.samples.length * 0.12) pa.left.clear();
          if (!pa.left.size && !pa.masked) {
            pa.masked = true;
            s("path", { d: pa.d, fill: "#000", stroke: "#000", "stroke-width": 10, "stroke-linejoin": "round" }, mask); // its drawn rim too (no hard edge left)
          }
        }
      });
      if (onDecay) {
        if (++st.mark % 6 === 0) ctx.sfx("pop");
      } else {
        // the white: a scuff, and the tooth chips if it goes on too long
        const key = `${Math.round(p.x / 12)},${Math.round(p.y / 12)}`;
        if (!st.whiteSeen) st.whiteSeen = new Set();
        if (!st.whiteSeen.has(key)) {
          st.whiteSeen.add(key);
          st.white++;
          s("circle", { cx: p.x, cy: p.y, r: 6, fill: "#e4ddcf" }, scuffG);
          if (st.white % 4 === 1) S.face("wince", 400);
          // T4 (CLN-103): outside the line she says "ow" and the drill buzzes (a vibration where the device has one)
          if (Date.now() - (st.owT || 0) > 1400) {
            st.owT = Date.now();
            S.say("tooth-ow", "patient");
            try {
              if (root.navigator && root.navigator.vibrate) root.navigator.vibrate(60);
            } catch (e) {
              /* no vibration */
            }
            face2.classList.remove("buzz");
            void face2.getBoundingClientRect();
            face2.classList.add("buzz");
          }
          if (st.white >= chipAt && !st.chipped) {
            st.chipped = true;
            chipEl.setAttribute("opacity", 1);
            S.face("ouch", 900);
            S.say("tooth-chip", "patient");
          }
        }
      }
      if (c.patches.every((pa) => !pa.left.size)) {
        drag = null;
        drillEl.setAttribute("opacity", 0);
        st.busy = true;
        S.face("happy", 600);
        ctx.after(fast() ? 100 : 500, () => {
          st.busy = false;
          if (cur() === c) close();
        });
      }
    };
    let fillT = null;
    const nozzleTo = (snap) => {
      const p = filling(st.fill);
      if (snap) return putNozzle(hollowMid(p).x, hollowMid(p).y);
      putNozzle(NZ.x + (hollowMid(p).x - NZ.x) * 0.25, NZ.y + (hollowMid(p).y - NZ.y) * 0.25);
    };
    const startFill = () => {
      if (st.holding || st.smoothing) return;
      st.holding = true;
      S.did();
      pressBtn(true);
      ctx.sfx("tap");
      let t0 = Date.now();
      const step = () => {
        if (!st.holding) return;
        const now = Date.now();
        st.fill = Math.min(FILL.max, st.fill + ((now - t0) / fillMs) * 1);
        t0 = now;
        setMarker(st.fill);
        drawPaste();
        nozzleTo(false);
        if (st.fill >= FILL.max) return stopFill();
        fillT = root.requestAnimationFrame ? root.requestAnimationFrame(step) : setTimeout(step, 16);
      };
      step();
    };
    /*
     * CLN-184 (Zafar, 18 Oct; clinic decision 6: "it should let me get it wrong"): letting go past the green is too much:
     * the gauge shows red, she says so, the filling smooths back down into the holes, and he fills again. The first go
     * is the one scored (E14); the step closes when a go ends in the green. Below the green just pauses (press again).
     */
    const stopFill = () => {
      if (!st.holding) return;
      st.holding = false;
      pressBtn(false);
      const c = cur();
      if (!c || c.kind !== "fill") return;
      if (st.fill < zone[0]) return;
      const ok = st.fill <= zone[1];
      if (!("fill-line" in st.judged)) judge("fill-line", ok, { filled: Math.round((100 * st.fill) / FILL.max) });
      if (!ok) {
        st.overs++;
        ctx.log({ type: "extra", rowId: "fill-line", detail: "over" });
        S.say("tooth-toomuch", "patient");
        S.face("wince", 700);
        st.smoothing = true;
        const from = st.fill;
        const t0 = Date.now();
        const ms = fast() ? 120 : 900;
        const back = () => {
          if (st.gone) return;
          const u = Math.min(1, (Date.now() - t0) / ms);
          st.fill = from * (1 - (1 - Math.pow(1 - u, 3)));
          setMarker(st.fill);
          drawPaste();
          nozzleTo(true);
          if (u < 1) return root.requestAnimationFrame ? root.requestAnimationFrame(back) : setTimeout(back, 16);
          st.fill = 0;
          setMarker(0);
          drawPaste();
          st.smoothing = false;
        };
        ctx.after(fast() ? 60 : 650, back);
        return;
      }
      S.face("happy", 700);
      st.busy = true;
      ctx.after(fast() ? 150 : 600, () => {
        st.busy = false;
        if (cur() === c) close();
      });
    };

    S.tools([], null);
    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        open();
      },
      destroy() {
        st.gone = true;
        st.holding = false;
        if (stuck) stuck.stop();
        if (fillT && root.cancelAnimationFrame) root.cancelAnimationFrame(fillT);
        S.destroy();
      },
      debug: {
        get plan() {
          return P;
        },
        get cues() {
          return S.cueLog.slice();
        },
        zone,
        fillOk: () => st.fill >= zone[0] + (zone[1] - zone[0]) * 0.3,
        overOk: () => st.fill > zone[1] + 0.06,
        state: () => ({ step: cur() && cur().id, fill: st.fill, white: st.white, chipped: st.chipped, left: drillPatches.map((p) => p.left.size), view: st.view, moving: !!st.moving, overs: st.overs, smoothing: !!st.smoothing, judged: Object.assign({}, st.judged) }),
        /** TEST HOOK (CLN-163, CLN-181, CLN-182; read-only): client px boxes of the sore tooth, each decay patch, the gauge's face, the button and the nozzle's tip */
        layout() {
          const box = (el) => {
            const r = el.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
          };
          const a = S.client(...Object.values(fromD(TOOTH.x0, TOOTH.y0)));
          const b = S.client(...Object.values(fromD(TOOTH.x1, TOOTH.y1)));
          const tip = S.client(...Object.values(fromD(NZ.x, NZ.y)));
          return {
            tooth: { left: a.x, top: a.y, width: b.x - a.x, height: b.y - a.y },
            patches: drillPatches.map((p) => {
              const q = S.client(...Object.values(fromD(p.cx, p.cy)));
              return { cx: q.x, cy: q.y, r: p.r / KD / S.unit() };
            }),
            gauge: box(gaugeG.querySelector("rect:nth-of-type(2)")),
            button: box(btnUp),
            nozzleTip: tip,
            stage: box(S.svg),
            view: st.view,
          };
        },
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy || st.smoothing) return { do: "wait" };
          const cl = (x, y) => S.client(x, y);
          const clD = (x, y) => {
            const q = fromD(x, y);
            return S.client(q.x, q.y);
          };
          if (c.kind === "brush") {
            // from the brush head along the move's channel to its end (and a little past: the brush stops there)
            if (st.snapping) return { do: "wait" };
            const [dx, dy] = SCREEN[c.move];
            const pts = [0, 0.25, 0.5, 0.75, 1.08].map((k) => cl(TR.x + dx * TR.ax * k, TR.y + dy * TR.ay * k)).map((q) => [q.x, q.y]);
            return { do: "drag", pts, what: c.move };
          }
          if (c.kind === "drill") {
            // one patch per stroke (lifting between them: no white drilled), row by row, back and forth
            const pa = c.patches.find((q) => q.left.size);
            if (!pa) return { do: "wait" };
            const rows = {};
            pa.samples.forEach(([x, y], i) => pa.left.has(i) && (rows[y] = rows[y] || []).push(x));
            const pts = [];
            Object.keys(rows)
              .map(Number)
              .sort((a, b) => a - b)
              .forEach((y, k) => (k % 2 ? rows[y].sort((a, b) => b - a) : rows[y].sort((a, b) => a - b)).forEach((x) => pts.push(clD(x, y))));
            const path = pts.slice(0, 400).map((q) => [q.x, q.y]); // the bigger cavity (Sprint 10) is cleared by one stroke
            return path.length ? { do: "drag", pts: [path[0]].concat(path), steps: 2, what: "drill" } : { do: "wait" };
          }
          const t = clD(BTN.x, BTN.y);
          return { do: "hold", x: t.x, y: t.y, until: "__heal.run.controller.debug.fillOk()", what: "fill" };
        },
        /** the overfill (CLN-184's probe): hold past the green */
        over() {
          const c = cur();
          if (!S.ready || !c || c.kind !== "fill" || st.busy || st.smoothing || st.holding) return null;
          const t = (() => {
            const q = fromD(BTN.x, BTN.y);
            return S.client(q.x, q.y);
          })();
          return { do: "hold", x: t.x, y: t.y, until: "__heal.run.controller.debug.overOk()", what: "over" };
        },
        slip() {
          // brush the first move the wrong way
          const c = cur();
          if (!S.ready || !c || c.kind !== "brush" || st.busy || st.done.length) return null;
          if (st.snapping || (st.tries[c.i] || []).length) return null;
          const m = DIRS.find((d) => d !== c.move);
          const [dx, dy] = SCREEN[m];
          const pts = [0, 0.25, 0.5, 0.75, 1.08].map((k) => S.client(TR.x + dx * TR.ax * k, TR.y + dy * TR.ay * k)).map((q) => [q.x, q.y]);
          return { do: "drag", pts, what: "slip " + m };
        },
        /** TEST HOOK (s11-clinic; read-only): the brushing's state: the move asked, the brush head's offset, each side's dirt, the dirt's mode, the card */
        brushing() {
          const c = cur();
          return { move: c && c.kind === "brush" ? c.move : null, at: Object.assign({}, at), dirt: Object.fromEntries(DIRS.map((d) => [d, +target[d].level.toFixed(2)])), orderOnly, card: dirCard ? { dir: dirCard.dataset.dir, stage: dirCard.wc && dirCard.wc.stage, slots: dirCard.wc && dirCard.wc.slots } : null, missed: st.missed.slice(), snapping: !!st.snapping };
        },
        /** TEST HOOK (BRUSH-01; read-only): the direction card is clear of the cross and its targets; its layout (card or row) */
        dirClear: () => dirClear(),
        dirMode: () => dirMode,
        /** TEST HOOK (s11-clinic; read-only): client px of the cross's centre and its four ends */
        cross() {
          const q = (p) => S.client(p.x, p.y);
          return { centre: q(TR), ends: Object.fromEntries(DIRS.map((d) => [d, q(END[d])])) };
        },
      },
    };
  }

  /**
   * The dirt reader (Sprint 11): a blind player who brushes the dirtiest side each time (never the side just brushed:
   * the order never repeats a move), as the game draws the dirt for this save (orderDirt): the leak bot's own check
   * that the dirt doesn't give the order away past support.
   */
  function dirtRead(moves, orderOnly, rng) {
    const cnt = (d) => moves.filter((m) => m === d).length;
    const dirt = Object.fromEntries(DIRS.map((d) => [d, orderOnly ? (cnt(d) ? 1 : 0) : 1]));
    const step = Object.fromEntries(DIRS.map((d) => [d, orderOnly ? 1 / Math.max(1, cnt(d)) : 1 / (cnt(d) + 2)]));
    let prev = null;
    for (const m of moves) {
      const can = DIRS.filter((d) => d !== prev);
      const top = Math.max(...can.map((d) => dirt[d]));
      const pick = HS.pick(can.filter((d) => Math.abs(dirt[d] - top) < 1e-9), rng);
      if (pick !== m) return false;
      dirt[m] = Math.max(0, dirt[m] - step[m]);
      prev = m;
    }
    return true;
  }
  function bot(level, rng) {
    const p = plan(level, rng);
    const b = HS.bot(p.rows, rng);
    const solve = b.solve;
    return Object.assign(b, {
      plan: p,
      strategies: HS.STRATEGIES.concat(["dirt-reader"]),
      solve(strategy) {
        if (strategy !== "dirt-reader") return solve(strategy);
        const ok = dirtRead(p.moves, orderDirt(p.level, p.moves), rng);
        return { right: p.rows.filter((r) => r.skill).length + (ok ? 1 : 0), total: p.rows.length };
      },
    });
  }

  const def = {
    id: "tooth",
    part: "tooth",
    ailments: ["sugar-bug", "cracked-tooth"],
    items: ["toothbrush", "drill", "paste"],
    gestures: ["tap", "drag"],
    levels: [1, 2, 3, 4], // L4: six moves, four small patches, the timer, the narrow green (Zafar, 13 Oct)
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
