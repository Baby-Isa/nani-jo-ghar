/*
 * H-tooth (clinic v2; the 1 Oct play-test D15d, decision 27): brush, drill, fill, all inside ONE mouth close-up.
 *
 * Why: "My tooth hurts." / "Let's brush, fix it and fill it."
 * 1. Brush: the toothbrush rests in the open mouth. The doctor calls ONE move at a time (its row appears as it's said,
 *    D8: never the whole order up front, R5's "6 shown at once" fixed); drag the brush that way. L1 2 moves, L2 4,
 *    L3 6 (left / right are the patient's own: dabo / jamno at L3, mirrored on screen).
 * 2. Drill: the camera pushes in on the sore tooth, still in the mouth (gum above, the neighbours either side, the
 *    lip below: CLN-52, P43). The decay is jagged and scattered by level (L1 one patch, L2 two, L3 four small ones:
 *    P44). Drag the drill over it; its tip is the finger (CLN-51). Drilling the white too long chips the tooth.
 * 3. Fill: hold the big round button (it goes down while pressed); the nozzle squeezes paste into the holes and the
 *    gauge beside the tooth rises: let go in the green, with red either side. The green narrows and the fill speeds
 *    up by level (data: fill.ms, fill.zone; CLN-53, P45). Letting go below the green just pauses (press again);
 *    past it is too much.
 * Rows: the brush order (the words decide it); the drill and the fill are hand-skill rows.
 * Art swaps in by file name: data art.* (the art plan's M1 mouth, O2 decay, B1 button and nozzle) once `ready`.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  // the defaults; data/clinic/heal/tooth.json (levels, fill, drill) overrides them in the browser
  const K = {
    moves: { 1: 2, 2: 4, 3: 6 },
    decay: { 1: { n: 1, r: 52 }, 2: { n: 2, r: 38 }, 3: { n: 4, r: 25 } },
    chipAt: 16, // healthy enamel points drilled before the tooth chips
    drillMs: { 3: 16000 },
    fill: { ms: { 1: 3400, 2: 2600, 3: 2000 }, zone: { 1: [0.55, 0.86], 2: [0.62, 0.82], 3: [0.67, 0.8] }, max: 1.15 },
  };
  const WHY = { problem: "My tooth hurts.", goal: "Let's brush, fix it and fill it." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    brush: { gesture: "swipe" },
    drill: { gesture: "swipe" },
    fill: { gesture: "hold" },
  };
  const DIRS = ["up", "down", "left", "right"];
  // the direction words by id (data/clinic/lang.json): English placeholders to record; dabo / jamno at L3
  const DIR_ID = { up: "tooth-up", down: "tooth-down", left: "tooth-left", right: "tooth-right" };
  // the patient's own left is on our right
  const SCREEN = { up: [0, -1], down: [0, 1], left: [1, 0], right: [-1, 0] };
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
    const L = Math.max(1, Math.min(3, level));
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
    const dirM = (m) => (L === 3 && (m === "left" || m === "right") ? Lg.item(Lg.sideId(m)) : Lg.item(DIR_ID[m]));
    // the decay: jagged patches scattered over the crown, never overlapping
    const dk = Object.assign({}, K.decay[L], lv.decay || {});
    const patches = [];
    let guard = 0;
    while (patches.length < dk.n && guard++ < 400) {
      const cx = CROWN.x0 + dk.r + rng() * (CROWN.x1 - CROWN.x0 - 2 * dk.r);
      const cy = CROWN.y0 + dk.r + rng() * (CROWN.y1 - CROWN.y0 - 2 * dk.r);
      if (patches.some((p) => Math.hypot(p.cx - cx, p.cy - cy) < dk.r * 2.3)) continue;
      patches.push({ cx: Math.round(cx), cy: Math.round(cy), r: dk.r, pts: jag(cx, cy, dk.r, rng) });
    }
    const steps = moves.map((m, i) => ({
      id: `b${i}`,
      kind: "brush",
      move: m,
      i,
      row: Object.assign({ id: `b${i}` }, Lg.show(Lg.step(i, dirM(m), { lower: i > 0 }), { cap: i === 0 })),
    }));
    steps.push({ id: "drill", kind: "drill", patches, timer: (lv.drillMs != null ? lv.drillMs : K.drillMs[L]) || 0, row: Object.assign({ id: "drill" }, Lg.w("tooth-drill", { cap: true })) });
    steps.push({ id: "fill", kind: "fill", row: Object.assign({ id: "fill" }, Lg.w("tooth-fill", { cap: true })) });
    const rows = [
      { id: "brush-order", seq: DIRS, answer: moves, placeholder: L < 3 }, // up / down wait for the recording
      { id: "drill-care", skill: true, answer: true },
      { id: "fill-line", skill: true, answer: true },
    ];
    const words = [Lg.w("tooth-up"), Lg.w("tooth-down"), Lg.w("body-tooth"), Lg.w("tooth-brush")];
    if (L === 3) words.push(Lg.w(Lg.sideId("left")), Lg.w(Lg.sideId("right")));
    else words.push(Lg.w("tooth-left"), Lg.w("tooth-right"));
    return { level: L, moves, steps, rows, words };
  }

  function mount(stage, ctx) {
    const data = ctx.data || {};
    const P = plan(ctx.level, ctx.rng, data);
    const S = HS.make(stage, ctx, { place: "head", game: "tooth" });
    const { s } = S;
    const Kit0 = root.Clinic && root.Clinic.Kit;
    const url = (u) => (Kit0 && Kit0.url ? Kit0.url(u) : u);
    const kind = S.kind || (ctx.patient && ctx.patient.kind) || "girl";
    const art = (key) => {
      const a = data.art && data.art[key];
      return a && a.ready && a.src ? Object.assign({}, a, { src: a.src.replace("{kind}", kind) }) : null;
    };
    const FILL = Object.assign({}, K.fill, data.fill || {});
    const zone = (FILL.zone && FILL.zone[P.level]) || K.fill.zone[P.level];
    const fillMs = ((FILL.ms && FILL.ms[P.level]) || K.fill.ms[P.level]) * 1;
    const chipAt = data.chipAt || K.chipAt;
    const st = { i: 0, done: [], judged: {}, over: false, busy: false, fill: 0, holding: false, white: 0, chipped: false, cleared: new Set(), whiteSeen: new Set(), mark: 0 };
    const cur = () => P.steps[st.i] || null;
    const uid = `t${Math.floor(Math.random() * 1e9)}`;
    const fast = () => !!(Kit0 && Kit0.fast);
    ctx.card.setRows(P.steps.map((x) => x.row));
    const skin = S.skin || "#c99a74";
    const skinDark = S.skinDark || "#a77b58";

    /* ---------------- 1. the mouth, open (the M1 close-up; a drawn stand-in until the art is ready) ---------------- */
    const M = { x: 400, y: 250 };
    const mouthG = s("g", { class: "tooth-mouth" }, S.layer);
    const mouthArt = art("mouth");
    // which upper tooth is sore: one of the middle four (the zoom pushes in on it)
    const UP = [0, 1, 2, 3, 4, 5].map((k) => ({ x: M.x - 165 + k * 55, y: M.y - 112, w: 50, h: 66 }));
    const soreK = 1 + Math.floor(ctx.rng() * 4);
    const sore = UP[soreK];
    if (mouthArt) s("image", { href: url(mouthArt.src), x: mouthArt.box[0], y: mouthArt.box[1], width: mouthArt.box[2], height: mouthArt.box[3], preserveAspectRatio: "xMidYMid slice" }, mouthG);
    else {
      s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: skin }, mouthG);
      s("ellipse", { cx: M.x - 330, cy: M.y + 40, rx: 120, ry: 90, fill: HS.shade ? HS.shade(skin, 0.08) : skin, opacity: 0.6 }, mouthG);
      s("ellipse", { cx: M.x + 330, cy: M.y + 40, rx: 120, ry: 90, fill: HS.shade ? HS.shade(skin, 0.08) : skin, opacity: 0.6 }, mouthG);
      s("path", { d: `M${M.x - 70} ${M.y - 230} Q${M.x} ${M.y - 200} ${M.x + 70} ${M.y - 230}`, stroke: skinDark, "stroke-width": 8, fill: "none", "stroke-linecap": "round", opacity: 0.6 }, mouthG); // the nose's base
      s("ellipse", { cx: M.x, cy: M.y, rx: 262, ry: 176, fill: "#c4636b" }, mouthG); // the lips
      s("ellipse", { cx: M.x, cy: M.y, rx: 236, ry: 150, fill: "#4e1620" }, mouthG); // inside
      s("ellipse", { cx: M.x, cy: M.y + 70, rx: 150, ry: 62, fill: "#d9707e" }, mouthG); // the tongue
      // the gums and teeth, inside the open mouth (clipped to it)
      const clip = s("clipPath", { id: `${uid}-mouth` }, s("defs", {}, S.svg));
      s("ellipse", { cx: M.x, cy: M.y, rx: 236, ry: 150 }, clip);
      const inner = s("g", { "clip-path": `url(#${uid}-mouth)` }, mouthG);
      UP.forEach((t) => s("rect", { x: t.x, y: t.y - 14, width: t.w, height: t.h + 14, rx: 14, fill: "#fbf8ef", stroke: "#dcd3c2", "stroke-width": 2 }, inner));
      [0, 1, 2, 3, 4, 5].forEach((k) => s("rect", { x: M.x - 160 + k * 54, y: M.y + 58, width: 48, height: 64, rx: 13, fill: "#fbf8ef", stroke: "#dcd3c2", "stroke-width": 2 }, inner));
      // the gums over the teeth's roots
      s("path", { d: `M${M.x - 240} ${M.y - 160} H${M.x + 240} V${M.y - 112} Q${M.x} ${M.y - 92} ${M.x - 240} ${M.y - 112}Z`, fill: "#e8909a" }, inner);
      s("path", { d: `M${M.x - 240} ${M.y + 170} H${M.x + 240} V${M.y + 116} Q${M.x} ${M.y + 100} ${M.x - 240} ${M.y + 116}Z`, fill: "#e8909a" }, inner);
    }
    // the sore tooth's decay, small, seen from here (the drill view shows it big)
    const specks = s("g", {}, mouthG);
    const toMouth = (x, y) => [sore.x + ((x - 272) / 256) * sore.w, sore.y + ((y - 92) / 300) * sore.h];
    const drawSpecks = (filled) => {
      S.clear(specks);
      P.steps.find((x) => x.kind === "drill").patches.forEach((p) => {
        const d = p.pts.map(([x, y], i) => `${i ? "L" : "M"}${toMouth(x, y).join(" ")}`).join(" ") + "Z";
        s("path", { d, fill: filled ? "#f4f4f6" : "#5a3d2c", stroke: filled ? "#cfd3da" : "none", "stroke-width": 1 }, specks);
      });
    };
    drawSpecks(false);
    // the toothbrush (the clinic v2 art), its head on the front teeth, the handle out of the mouth
    const BR = Object.assign({ src: "assets/clinic/items-v2/toothbrush.webp", size: [374, 291], head: [62, 52], w: 300 }, data.brush || {});
    const brushG = s("g", {}, mouthG);
    const bW = BR.w;
    const bH = (BR.w * BR.size[1]) / BR.size[0];
    const hx = (BR.head[0] / BR.size[0]) * bW;
    const hy = (BR.head[1] / BR.size[1]) * bH;
    const brushImg = s("image", { href: url(BR.src), x: M.x - hx, y: M.y - 60 - hy, width: bW, height: bH }, brushG);
    void brushImg;
    const foam = s("g", {}, mouthG);

    /* ---------------- 2. the sore tooth, close (still in the mouth: gum, neighbours, lip) ---------------- */
    const toothG = s("g", { opacity: 0, class: "tooth-close" }, S.layer);
    s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: "#4e1620" }, toothG); // inside the mouth
    s("path", { d: "M-400 -300 L1200 -300 L1200 120 Q400 40 -400 120Z", fill: "#e8909a" }, toothG); // the gum
    s("path", { d: "M-400 560 Q400 470 1200 560 L1200 900 L-400 900Z", fill: "#c4636b" }, toothG); // the lower lip
    const toothPath = (x0, x1, y0, y1) => `M${x0} ${y0} Q${(x0 + x1) / 2} ${y0 - 26} ${x1} ${y0} L${x1 - 6} ${y1 - 40} Q${x1 - 14} ${y1 + 6} ${(x0 + x1) / 2} ${y1} Q${x0 + 14} ${y1 + 6} ${x0 + 6} ${y1 - 40}Z`;
    s("path", { d: toothPath(30, 252, 96, 370), fill: "#f6f2e8", stroke: "#d8cfbd", "stroke-width": 4 }, toothG); // the neighbours
    s("path", { d: toothPath(548, 770, 96, 370), fill: "#f6f2e8", stroke: "#d8cfbd", "stroke-width": 4 }, toothG);
    const TOOTH_D = toothPath(272, 528, 92, 392);
    s("path", { d: TOOTH_D, fill: "#fbf9f2", stroke: "#d8cfbd", "stroke-width": 5 }, toothG);
    s("path", { d: "M300 130 Q320 118 345 122", stroke: "#fff", "stroke-width": 10, "stroke-linecap": "round", fill: "none", opacity: 0.8 }, toothG); // a shine
    // the decay, cut away where the drill has been (a mask of drilled circles)
    const defs = s("defs", {}, S.svg);
    const mask = s("mask", { id: `${uid}-m`, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 800, height: 500 }, defs);
    s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: "#fff" }, mask);
    const holesG = s("g", {}, toothG); // the drilled holes (under the decay)
    const decayG = s("g", { mask: `url(#${uid}-m)` }, toothG);
    const scuffG = s("g", {}, toothG); // where healthy enamel was drilled
    const pasteG = s("g", {}, toothG);
    const chipEl = s("path", { d: "M470 112 L520 104 L514 160 Z", fill: "#4e1620", opacity: 0 }, toothG);
    const drillPatches = P.steps.find((x) => x.kind === "drill").patches;
    const decayArt = [1, 2, 3].map((n) => art(`decay${n}`));
    drillPatches.forEach((p, k) => {
      const d = p.pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ") + "Z";
      p.d = d;
      s("path", { d, fill: "#ead2c6", stroke: "#c9a493", "stroke-width": 3 }, holesG);
      const a = decayArt[k % 3];
      if (a) s("image", { href: url(a.src), x: p.cx - p.r * 1.2, y: p.cy - p.r * 1.2, width: p.r * 2.4, height: p.r * 2.4, "clip-path": null }, decayG);
      else {
        s("path", { d, fill: "#4a3326", stroke: "#2f1f17", "stroke-width": 3, "stroke-linejoin": "round" }, decayG);
        s("path", { d, fill: "none", stroke: "#6e4c37", "stroke-width": 9, opacity: 0.5, transform: `translate(${p.cx * 0.12} ${p.cy * 0.12}) scale(0.88)` }, decayG);
      }
      // the points the drill must reach (every 9 units inside the patch)
      p.samples = [];
      for (let y = p.cy - p.r * 1.3; y <= p.cy + p.r * 1.3; y += 9) for (let x = p.cx - p.r * 1.3; x <= p.cx + p.r * 1.3; x += 9) if (inPoly(x, y, p.pts)) p.samples.push([x, y]);
      p.left = new Set(p.samples.map((_, i) => i));
    });
    // CLN-51: the drill is its picture (assets/clinic/items-v2), placed so its tip (the bur, data: drill.tip, in the
    // picture's own pixels) sits exactly under the finger
    const DR = Object.assign({ src: "assets/clinic/items-v2/dentist-drill.webp", size: [394, 212], tip: [45, 196], w: 150 }, data.drill || {});
    const DW = DR.w;
    const DH = (DR.w * DR.size[1]) / DR.size[0];
    const tipX = (DR.tip[0] / DR.size[0]) * DW;
    const tipY = (DR.tip[1] / DR.size[1]) * DH;
    const drillEl = s("image", { href: url(DR.src), x: -1000, y: -1000, width: DW, height: DH, opacity: 0, class: "hs-drill" }, S.fx);
    drillEl.dataset.tipX = String(tipX);
    drillEl.dataset.tipY = String(tipY);
    const TIP_R = 17; // the bur's reach, svg units

    /* ---------------- 3. the fill: the nozzle, the gauge, the big button ---------------- */
    const fillG = s("g", { opacity: 0 }, S.fx);
    const G = { x: 600, y0: 120, y1: 380, w: 34 }; // the gauge: bottom = empty, top = MAX
    const gy = (f) => G.y1 - (f / FILL.max) * (G.y1 - G.y0);
    s("rect", { x: G.x - 8, y: G.y0 - 8, width: G.w + 16, height: G.y1 - G.y0 + 16, rx: 16, fill: "#fff", stroke: "#bfae94", "stroke-width": 4 }, fillG);
    s("rect", { x: G.x, y: gy(FILL.max), width: G.w, height: gy(zone[1]) - gy(FILL.max), fill: "#e0574f" }, fillG); // too much
    s("rect", { x: G.x, y: gy(zone[1]), width: G.w, height: gy(zone[0]) - gy(zone[1]), fill: "#4cae5c" }, fillG); // just right
    s("rect", { x: G.x, y: gy(zone[0]), width: G.w, height: G.y1 - gy(zone[0]), fill: "#e0574f" }, fillG); // not enough
    const level = s("rect", { x: G.x + 6, y: G.y1, width: G.w - 12, height: 0, rx: 6, fill: "#fbfbff", stroke: "#9aa3b5", "stroke-width": 2 }, fillG);
    const marker = s("path", { d: "", fill: "#2a2522" }, fillG);
    const setMarker = (f) => {
      const y = gy(Math.min(FILL.max, f));
      marker.setAttribute("d", `M${G.x - 22} ${y - 11} L${G.x - 4} ${y} L${G.x - 22} ${y + 11}Z`);
      level.setAttribute("y", y);
      level.setAttribute("height", Math.max(0, G.y1 - y));
    };
    setMarker(0);
    // the nozzle over the tooth (B1: art once ready; a drawn white-and-steel pen until then)
    const nozzleG = s("g", {}, fillG);
    const NZ = { x: 400, y: 222 }; // the tip, over the holes
    const nozArt = art("nozzle");
    const nozPasteArt = art("nozzlePaste");
    let nozImg = null;
    if (nozArt) nozImg = s("image", { href: url(nozArt.src), x: NZ.x - nozArt.tip[0], y: NZ.y - nozArt.tip[1], width: nozArt.size[0], height: nozArt.size[1] }, nozzleG);
    else {
      s("path", { d: `M${NZ.x} ${NZ.y} L${NZ.x + 16} ${NZ.y - 30} L${NZ.x + 30} ${NZ.y - 24} Z`, fill: "#9aa3ad" }, nozzleG);
      s("rect", { x: NZ.x + 12, y: NZ.y - 150, width: 44, height: 130, rx: 20, fill: "#f2f0ea", stroke: "#b9b4aa", "stroke-width": 3, transform: `rotate(28 ${NZ.x + 34} ${NZ.y - 85})` }, nozzleG);
      s("rect", { x: NZ.x + 12, y: NZ.y - 104, width: 44, height: 8, fill: "#4a8fd0", transform: `rotate(28 ${NZ.x + 34} ${NZ.y - 85})` }, nozzleG);
    }
    const ribbon = s("path", { d: "", stroke: "#fbfbff", "stroke-width": 9, "stroke-linecap": "round", fill: "none", opacity: 0 }, nozzleG);
    // the big press button (blue on a white base: neither "stop" nor "yes")
    const BTN = { x: 640, y: 440, r: 46 };
    const btnG = s("g", { class: "tooth-button" }, fillG);
    const upArt = art("buttonUp");
    const downArt = art("buttonDown");
    let btnUp = null;
    let btnDown = null;
    if (upArt && downArt) {
      btnUp = s("image", { href: url(upArt.src), x: BTN.x - 70, y: BTN.y - 70, width: 140, height: 140 }, btnG);
      btnDown = s("image", { href: url(downArt.src), x: BTN.x - 70, y: BTN.y - 70, width: 140, height: 140, opacity: 0 }, btnG);
    } else {
      s("ellipse", { cx: BTN.x, cy: BTN.y + 22, rx: BTN.r + 18, ry: 22, fill: "#e9e6df", stroke: "#b9b4aa", "stroke-width": 3 }, btnG);
      s("rect", { x: BTN.x - BTN.r - 18, y: BTN.y, width: 2 * BTN.r + 36, height: 22, fill: "#e9e6df" }, btnG);
      s("ellipse", { cx: BTN.x, cy: BTN.y, rx: BTN.r + 18, ry: 20, fill: "#f7f5f0", stroke: "#b9b4aa", "stroke-width": 3 }, btnG);
      btnUp = s("g", {}, btnG);
      s("rect", { x: BTN.x - BTN.r, y: BTN.y - 26, width: 2 * BTN.r, height: 26, fill: "#2f6fbf" }, btnUp);
      s("ellipse", { cx: BTN.x, cy: BTN.y, rx: BTN.r, ry: 16, fill: "#2f6fbf" }, btnUp);
      s("ellipse", { cx: BTN.x, cy: BTN.y - 26, rx: BTN.r, ry: 16, fill: "#4a8fe0", stroke: "#2a5fa3", "stroke-width": 2 }, btnUp);
      s("ellipse", { cx: BTN.x - 14, cy: BTN.y - 30, rx: 14, ry: 5, fill: "#fff", opacity: 0.45 }, btnUp);
    }
    const pressBtn = (down) => {
      if (btnDown) {
        btnUp.setAttribute("opacity", down ? 0 : 1);
        btnDown.setAttribute("opacity", down ? 1 : 0);
      } else btnUp.setAttribute("transform", down ? "translate(0 18)" : "");
      if (nozImg && nozArt && nozPasteArt) nozImg.setAttribute("href", url(down ? nozPasteArt.src : nozArt.src));
      ribbon.setAttribute("opacity", down ? 1 : 0);
    };
    const drawPaste = () => {
      S.clear(pasteG);
      const f = st.fill;
      if (f <= 0) return;
      drillPatches.forEach((p) => {
        const k = Math.min(f / zone[0], 1) * (f > zone[1] ? 1 + (f - zone[1]) * 1.6 : 1);
        s("path", { d: p.d, fill: "#fdfdff", stroke: f > zone[1] ? "#c8ccd6" : "none", "stroke-width": 3, transform: `translate(${p.cx * (1 - k)} ${p.cy * (1 - k)}) scale(${k})` }, pasteG);
      });
      ribbon.setAttribute("d", `M${NZ.x} ${NZ.y} Q${NZ.x - 4} ${NZ.y + 16} ${drillPatches[0].cx} ${drillPatches[0].cy}`);
    };

    /* ---------------- the camera inside the mouth: push in on the tooth, and back out ---------------- */
    const VB0 = [0, 0, 800, 500];
    // a match cut: the sore tooth lands exactly where the close-up's tooth is drawn (crown x 272-528, y 92-392)
    const zoomBox = () => {
      const k = 256 / sore.w;
      return [sore.x - 272 / k, sore.y - 92 / k, 800 / k, 500 / k];
    };
    const setVB = (b) => S.svg.setAttribute("viewBox", b.map((v) => Math.round(v * 10) / 10).join(" "));
    const camera = (from, to, ms) =>
      new Promise((res) => {
        if (fast() || !root.requestAnimationFrame) {
          setVB(to);
          return res();
        }
        const t0 = Date.now();
        const step = () => {
          const u = Math.min(1, (Date.now() - t0) / ms);
          const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          setVB(from.map((v, i) => v + (to[i] - v) * e));
          if (u < 1 && !st.gone) root.requestAnimationFrame(step);
          else res();
        };
        step();
      });
    const view = async (k) => {
      if (k === "brush") {
        mouthG.setAttribute("opacity", 1);
        toothG.setAttribute("opacity", 0);
        fillG.setAttribute("opacity", 0);
        return;
      }
      if (mouthG.getAttribute("opacity") !== "0") {
        // the push-in: the mouth view zooms on the sore tooth, then the close is there (same place, same size)
        st.busy = true;
        brushG.setAttribute("opacity", 0);
        await camera(VB0, zoomBox(), 650);
        mouthG.setAttribute("opacity", 0);
        toothG.setAttribute("opacity", 1);
        setVB(VB0);
        st.busy = false;
      }
      fillG.setAttribute("opacity", k === "fill" ? 1 : 0);
    };
    const pullOut = async () => {
      drawSpecks(true);
      setVB(zoomBox());
      mouthG.setAttribute("opacity", 1);
      toothG.setAttribute("opacity", 0);
      fillG.setAttribute("opacity", 0);
      await camera(zoomBox(), VB0, 650);
    };

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    let timer = null;
    const open = async () => {
      const c = cur();
      ctx.card.now(c.id);
      await view(c.kind);
      if (cur() !== c || st.over) return;
      if (c.kind === "brush") {
        // the guided round shows the very move asked for (D13); later the ghost only shows "drag the brush"
        const [dx, dy] = SCREEN[c.move];
        S.cue("brush", ctx.taught ? { gesture: "drag", to: { x: M.x + dx * 110, y: M.y + dy * 90 } } : CUES.brush, { x: M.x, y: M.y });
      }
      if (c.kind === "drill") {
        const p = c.patches[0];
        S.cue("drill", { gesture: "drag", to: { x: p.cx + p.r * 0.6, y: p.cy } }, { x: p.cx - p.r * 0.6, y: p.cy });
        if (c.timer) timer = S.timer(c.timer * (fast() ? 2 : 1), () => cur() === c && close());
      }
      if (c.kind === "fill") {
        drawPaste();
        S.cue("fill", CUES.fill, { x: BTN.x, y: BTN.y - 10, r: BTN.r + 10 });
      }
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "brush") {
        ctx.card.tick(c.id);
        if (c.i === P.moves.length - 1) judge("brush-order", JSON.stringify(st.done) === JSON.stringify(P.moves), st.done.join(" "));
      }
      if (c.kind === "drill") {
        if (timer) timer.stop();
        const all = c.patches.every((p) => !p.left.size);
        judge("drill-care", !st.chipped && all, `${c.patches.filter((p) => !p.left.size).length}/${c.patches.length} cleared${st.chipped ? ", chipped" : ""}`);
        drillEl.setAttribute("opacity", 0);
        ctx.card.tick(c.id);
      }
      if (c.kind === "fill") {
        judge("fill-line", st.fill >= zone[0] && st.fill <= zone[1], `filled to ${Math.round((100 * st.fill) / FILL.max)}%`);
        ctx.card.tick(c.id);
      }
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
      S.say("It doesn't hurt now!", "patient");
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    /* ---------------- the gestures ---------------- */
    let drag = null;
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      if (!c) return;
      if (c.kind === "brush" && Math.hypot(p.x - M.x, (p.y - M.y) * 1.3) < 230) drag = { from: p, fired: false };
      else if (c.kind === "drill") {
        drag = { drill: true, last: null };
        drillAt(p);
      } else if (c.kind === "fill" && Math.hypot(p.x - BTN.x, p.y - (BTN.y - 10)) < BTN.r + 26) startFill();
      if ((drag || st.holding) && S.svg.setPointerCapture) S.svg.setPointerCapture(e.pointerId);
    });
    ctx.on(S.svg, "pointermove", (e) => {
      if (!drag) return;
      const p = S.pt(e);
      if (drag.drill) return drillAt(p);
      if (drag.fired) return;
      const dx = p.x - drag.from.x;
      const dy = p.y - drag.from.y;
      if (Math.hypot(dx, dy) < 40) return;
      drag.fired = true;
      const scr = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
      brushMove(DIRS.find((d) => SCREEN[d][0] === scr[0] && SCREEN[d][1] === scr[1]));
    });
    const up = () => {
      if (drag && drag.drill) drillEl.setAttribute("opacity", 0);
      drag = null;
      if (st.holding) stopFill();
    };
    ctx.on(S.svg, "pointerup", up);
    ctx.on(S.svg, "pointercancel", up);

    const brushMove = (m) => {
      const c = cur();
      if (!c || c.kind !== "brush") return;
      st.done.push(m);
      const [dx, dy] = SCREEN[m];
      if (brushG.animate) brushG.animate([{ transform: "translate(0,0)" }, { transform: `translate(${dx * 70}px,${dy * 50}px)` }, { transform: "translate(0,0)" }], { duration: 420 });
      for (let k = 0; k < 3; k++) {
        const f = s("circle", { cx: M.x + dx * (30 + k * 25) + (ctx.rng() - 0.5) * 40, cy: M.y - 70 + dy * (20 + k * 18) + (ctx.rng() - 0.5) * 20, r: 9 + k * 3, fill: "#fff", opacity: 0.92 }, foam);
        ctx.after(1500, () => f.remove());
      }
      S.face("happy", 400);
      ctx.sfx("tap");
      // one move, one row: it closes as it's brushed (D5; the next move's line comes with its row, D8)
      st.busy = true;
      ctx.after(fast() ? 80 : 450, () => {
        st.busy = false;
        if (cur() === c) close();
      });
    };
    const drillAt = (p) => {
      const c = cur();
      if (!c || c.kind !== "drill") return;
      drillEl.setAttribute("x", p.x - tipX);
      drillEl.setAttribute("y", p.y - tipY);
      drillEl.setAttribute("opacity", 1);
      if (!S.ready || st.busy) return;
      const inTooth = p.x > 276 && p.x < 524 && p.y > 96 && p.y < 392;
      if (!inTooth) return;
      // cut away the decay under the tip
      if (!drag || !drag.last || Math.hypot(p.x - drag.last.x, p.y - drag.last.y) > 4) {
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
          if (pa.left.size && pa.left.size <= pa.samples.length * 0.12) {
            pa.left.clear();
            s("path", { d: pa.d, fill: "#000" }, mask);
          }
        }
      });
      if (onDecay) {
        if (++st.mark % 6 === 0) ctx.sfx("pop");
      } else {
        // the white: a scuff, and the tooth chips if it goes on too long
        const key = `${Math.round(p.x / 12)},${Math.round(p.y / 12)}`;
        if (!st.whiteSeen.has(key)) {
          st.whiteSeen.add(key);
          st.white++;
          s("circle", { cx: p.x, cy: p.y, r: 6, fill: "#e4ddcf" }, scuffG);
          if (st.white % 4 === 1) S.face("wince", 400);
          if (st.white >= chipAt && !st.chipped) {
            st.chipped = true;
            chipEl.setAttribute("opacity", 1);
            S.face("ouch", 900);
            S.say("Ow! A chip!", "patient");
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
    const startFill = () => {
      if (st.holding) return;
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
        if (st.fill >= FILL.max) return stopFill();
        fillT = root.requestAnimationFrame ? root.requestAnimationFrame(step) : setTimeout(step, 16);
      };
      step();
    };
    const stopFill = () => {
      if (!st.holding) return;
      st.holding = false;
      pressBtn(false);
      const c = cur();
      if (!c || c.kind !== "fill") return;
      // below the green: nothing is judged yet; press again to add more (never stuck, E29)
      if (st.fill < zone[0]) return;
      if (st.fill > zone[1]) S.say("Too much!", "patient");
      else S.face("happy", 700);
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
        state: () => ({ step: cur() && cur().id, fill: st.fill, white: st.white, chipped: st.chipped, left: drillPatches.map((p) => p.left.size) }),
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy) return { do: "wait" };
          const cl = (x, y) => S.client(x, y);
          if (c.kind === "brush") {
            const [dx, dy] = SCREEN[c.move];
            const a = cl(M.x, M.y - 40);
            const b = cl(M.x + dx * 90, M.y - 40 + dy * 90);
            return { do: "drag", pts: [[a.x, a.y], [b.x, b.y]], what: c.move };
          }
          if (c.kind === "drill") {
            // a careful path: over the decay points still left, patch by patch
            // one patch per stroke (lifting between them: no white drilled), row by row, back and forth
            const pa = c.patches.find((q) => q.left.size);
            if (!pa) return { do: "wait" };
            const rows = {};
            pa.samples.forEach(([x, y], i) => pa.left.has(i) && (rows[y] = rows[y] || []).push(x));
            const pts = [];
            Object.keys(rows)
              .map(Number)
              .sort((a, b) => a - b)
              .forEach((y, k) => (k % 2 ? rows[y].sort((a, b) => b - a) : rows[y].sort((a, b) => a - b)).forEach((x) => pts.push(cl(x, y))));
            const path = pts.slice(0, 60).map((q) => [q.x, q.y]);
            return path.length ? { do: "drag", pts: [path[0]].concat(path), steps: 2, what: "drill" } : { do: "wait" };
          }
          const t = cl(BTN.x, BTN.y - 10);
          return { do: "hold", x: t.x, y: t.y, until: "__heal.run.controller.debug.fillOk()", what: "fill" };
        },
        slip() {
          // brush the first move the wrong way
          const c = cur();
          if (!S.ready || !c || c.kind !== "brush" || st.busy || st.done.length) return null;
          const m = DIRS.find((d) => d !== c.move);
          const [dx, dy] = SCREEN[m];
          const a = S.client(M.x, M.y - 40);
          const b = S.client(M.x + dx * 90, M.y - 40 + dy * 90);
          return { do: "drag", pts: [[a.x, a.y], [b.x, b.y]], what: "slip " + m };
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "tooth",
    part: "tooth",
    ailments: ["sugar-bug", "cracked-tooth"],
    items: ["toothbrush", "drill", "paste"],
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
