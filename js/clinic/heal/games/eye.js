/*
 * H-eye (clinic v2; the 1 Oct play-test D15h, decision 27; CLN-59 to CLN-63).
 *
 * Why: "I can't see well." / "Drops first, then let's test your eyes."
 * 1. Drops, in a front close-up of the eyes: only the sore eye is red (CLN-59); pick the dropper and it hangs over
 *    the sore eye; tap to drop, the count on the dropper (D6). Level 1 closes at the count (D5); from level 2 the
 *    eye chart in the corner lights up once a drop is in, and tapping it starts the test (P75: no ✓ to guess).
 * 2. The eye test, in two versions (a data flag, test.version; the lab's ?eyetest=a|b):
 *    A, the split screen: the patient close up on the left, a hand over the good eye, looking past us; the chart
 *       big on the right, a frame between them (two players on one screen);
 *    B, side by side: the patient side-on at the left, a big chart on a stand close by on the right, turned a
 *       quarter towards both of them.
 *    The patient reads the lit row aloud and the child says haa or na. The rows highlight and tick like the card's
 *    rows (the "now" band; gold when judged: CLN-61). After na the dropper hangs over the eye and pulses: one tap,
 *    then the patient reads that row again (CLN-62, the redrop Zafar liked). No hidden first step (CLN-63): sides
 *    are said only in the diagnosis (D10).
 *    L1: one picture a row, what they say also written by them; L2 heard only; L3 two or three pictures a row.
 * The help never presses haa on a row read wrong (CLN-60): its first row is shown with the right answer, unscored.
 * Rows (the words decide): the drop count, each chart row's judgement.
 * Art swaps in by file name: data art.* (the art plan's Y1-Y3 eyes, T1/T2 eye tests, C1/C2 charts) once ready.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  // the chart's pictures: words the child already knows from Cook, each by its lexicon id (HS.pic: the clinic's art
  // where it has the thing, CLN-78)
  // EY10 (CLN-107): water is Cook's blue drop on the chart (the steel jug read as milk next to the milk jug)
  const PIC = { "cook-paani": "assets/cook/items/icon-cook-paani.webp" };
  const THINGS = ["fru-02", "veg-01", "veg-02", "veg-03", "veg-12", "veg-13", "veg-14", "cook-dudh", "cook-paani"].map((lex) => ({ id: lex, lex, icon: PIC[lex] || HS.pic(lex) }));
  const BY = Object.fromEntries(THINGS.map((t) => [t.id, t]));
  const RID = (i) => `chart-${"abcdef"[i]}`; // a chart row's scored id (the review lists it under the eye-test row)
  const W = (t) => HS.L.w(t.lex);
  const word = (t) => W(t).kutchi || `[${W(t).english}]`;
  // EY12 (decision 12 of the 6 Oct report, CLN-107): a real eye chart: one big picture at the top, more and smaller
  // ones lower down; per[L][row] = the pictures in that row
  const K = { drops: { 1: [1, 2, 3], 2: [1, 2, 3], 3: [1, 2, 3] }, rows: { 1: 3, 2: 4, 3: 4 }, per: { 1: [1, 1, 2], 2: [1, 2, 2, 3], 3: [1, 2, 3, 4] }, wrongP: 0.45 };
  const WHY = { problem: "eye-why", goal: "eye-goal" }; // line keys in data/clinic/heal/eye.json (the engine says them)
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    drops: { gesture: "tap", then: "tap" },
    chart: { gesture: "tap" },
    read: { gesture: "tap" },
    redrop: { gesture: "tap" },
  };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    // D10 (1 Oct): sides are said and tested in the diagnosis only: no side row, no "cover the other eye"
    const side = null;
    const drops = HS.pick(K.drops[L], rng);
    const pool = HS.shuffle(THINGS, rng);
    let pi = 0;
    const chart = [];
    for (let r = 0; r < K.rows[L]; r++) {
      const n = K.per[L][r] || 1;
      const pics = [];
      while (pics.length < n) {
        const id = pool[pi++ % pool.length].id;
        if (!pics.includes(id)) pics.push(id);
      }
      const wrong = rng() < K.wrongP;
      let said = pics.slice();
      if (wrong) {
        if (n > 1 && rng() < 0.4) said = [pics[1], pics[0]].concat(pics.slice(2)); // read out of order
        else {
          const k = Math.floor(rng() * n);
          const other = THINGS.filter((t) => !pics.includes(t.id));
          said[k] = HS.pick(other, rng).id;
        }
      }
      chart.push({ pics, said, wrong });
    }
    const Lg = HS.L;
    const steps = [];
    steps.push({ id: "drops", kind: "drops", count: drops, side, row: Object.assign({ id: "drops" }, Lg.show(Lg.join(["cl-drops", Lg.count(drops)]), { cap: true })) });
    chart.forEach((c, i) => steps.push({ id: `read${i}`, kind: "read", row: i, rowDef: c }));
    const rows = [{ id: "drops-count", options: K.drops[L], answer: drops }];
    // each chart row's judgement: "chart-a", "chart-b" ... (the end review lists them under the card's eye-test row, D14)
    chart.forEach((c, i) => rows.push({ id: `chart-${"abcdef"[i]}`, options: [true, false], answer: !c.wrong }));
    const words = [Lg.num(drops), Lg.w(Lg.yesId()), Lg.w(Lg.noId())];
    const seen = new Set();
    chart.forEach((c) => c.pics.forEach((id) => !seen.has(id) && seen.add(id) && words.push(W(BY[id]))));
    return { level: L, side, steps, rows, chart, words };
  }

  function mount(stage, ctx) {
    const data = ctx.data || {};
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "head", game: "eye" });
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
    // the test's version: the data's flag, or the lab's ?eyetest=a|b (both prototyped, D15h)
    const version = (() => {
      let v = (data.test && data.test.version) || "A";
      try {
        const q = new URLSearchParams(root.location.search).get("eyetest");
        if (q) v = q;
      } catch (e) {
        /* no page */
      }
      return String(v).toUpperCase() === "B" ? "B" : "A";
    })();
    const st = { i: 0, drops: 0, judged: {}, ticked: {}, over: false, busy: false, awaiting: null, redrop: null, view: "drops", gone: false };
    const cur = () => P.steps[st.i] || null;
    ctx.card.setRows(P.steps.filter((x) => x.kind === "drops").map((x) => x.row).concat([Object.assign({}, HS.L.w("eye-test", { cap: true }), { id: "chart" })]));
    const skin = S.skin || "#c99a74";
    const skinDark = S.skinDark || "#a77b58";
    const hair = S.hairCol || "#2b1d16";
    const clothes = S.clothes || "#3f7fcf";
    // the sore eye: the patient's own side from the diagnosis (their right is on our left), else their right
    const soreSide = ctx.side === "left" ? "left" : "right";

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

    /* ---------------- 1. the drops: the eyes, front on (Y1/Y2/Y3; a drawn stand-in until ready) ---------------- */
    const dropsG = s("g", {}, S.layer);
    const EY = { right: { x: 255, y: 250 }, left: { x: 545, y: 250 } }; // the patient's own sides (facing us)
    // A1: with the cut eyes, where the picture puts them (art eyesSore.eyes: [right x, left x, y], measured in the cut)
    const EYA = art("eyesSore");
    if (EYA && EYA.eyes) {
      EY.right = { x: EYA.eyes[0], y: EYA.eyes[2] };
      EY.left = { x: EYA.eyes[1], y: EYA.eyes[2] };
    }
    const sore = EY[soreSide];
    // Y2 has the sore eye on the viewer's right (the patient's left): mirrored for the patient's right
    const eyesArt = art("eyesSore");
    let soreEl = null;
    let blinkEls = [];
    if (eyesArt) {
      const at = { x: eyesArt.box[0], y: eyesArt.box[1], width: eyesArt.box[2], height: eyesArt.box[3], preserveAspectRatio: "xMidYMid slice", transform: soreSide === "right" ? "translate(800 0) scale(-1 1)" : null };
      s("image", Object.assign({ href: url(eyesArt.src) }, at), dropsG);
      // A1: the clear eyes (Y1, registered to Y2) over them, coming in with each drop as the stand-in's red fades
      const clear = art("eyes");
      if (clear) soreEl = s("image", Object.assign({ href: url(clear.src), opacity: 0 }, at), dropsG);
      // the blink after a drop: Y3, both eyes closed, on the same canvas
      const shut = art("eyesClosed");
      if (shut) blinkEls.push(s("image", Object.assign({ href: url(shut.src), opacity: 0 }, at), dropsG));
    }
    else {
      s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: skin }, dropsG);
      s("path", { d: "M-400 -300 L1200 -300 L1200 40 Q400 -20 -400 40Z", fill: hair }, dropsG); // the hairline
      s("path", { d: "M400 300 Q382 400 360 452 Q400 472 440 452 Q418 400 400 300Z", fill: skinDark, opacity: 0.35 }, dropsG); // the nose
      ["right", "left"].forEach((sd) => {
        const e = EY[sd];
        const isSore = sd === soreSide;
        s("path", { d: `M${e.x - 105} ${e.y - 92} Q${e.x} ${e.y - 132} ${e.x + 105} ${e.y - 88}`, stroke: hair, "stroke-width": 16, fill: "none", "stroke-linecap": "round" }, dropsG); // the brow
        if (isSore) s("ellipse", { cx: e.x, cy: e.y, rx: 112, ry: 72, fill: "#e98f8f", opacity: 0.55 }, dropsG); // puffy pink lids
        s("ellipse", { cx: e.x, cy: e.y, rx: 92, ry: 54, fill: "#fff", stroke: "#7a4a32", "stroke-width": 4 }, dropsG);
        const red = s("ellipse", { cx: e.x, cy: e.y, rx: 90, ry: 52, fill: "#f08a8a", opacity: isSore ? 0.55 : 0 }, dropsG);
        if (isSore) soreEl = red;
        s("circle", { cx: e.x, cy: e.y, r: 34, fill: "#6a4a2a" }, dropsG);
        s("circle", { cx: e.x, cy: e.y, r: 15, fill: "#1a1010" }, dropsG);
        s("circle", { cx: e.x - 10, cy: e.y - 12, r: 7, fill: "#fff" }, dropsG);
        if (isSore) s("path", { d: `M${e.x - 92} ${e.y - 10} Q${e.x} ${e.y - 62} ${e.x + 92} ${e.y - 10} L${e.x + 92} ${e.y - 54} L${e.x - 92} ${e.y - 54}Z`, fill: skin, opacity: 0.9 }, dropsG); // the heavy lid
        blinkEls.push(s("ellipse", { cx: e.x, cy: e.y, rx: 96, ry: 58, fill: skin, opacity: 0 }, dropsG));
      });
    }
    // the dropper (the clinic v2 eye drops), hanging over the sore eye once picked
    const dropper = s("g", { opacity: 0 }, S.fx);
    // S02-E (E4): the art run's bottle held nozzle down (sheets.json drop-bottle "use-down"), else the old one turned over
    const downArt = Kit0 && Kit0.view ? Kit0.view("drop-bottle", "use-down") : null;
    s("image", { href: url(downArt || "assets/clinic/items-v2/eye-drops.webp"), x: -30, y: -128, width: 60, height: 118, transform: downArt ? null : "rotate(180 0 -69)" }, dropper);
    const ring = s("circle", { cx: 0, cy: 34, r: 40, fill: "none", stroke: "#f0b43c", "stroke-width": 6, opacity: 0 }, dropper); // round the eye
    let dropperAt = null;
    let bob = 0;
    const showDropper = (at, pulse) => {
      dropperAt = at;
      dropper.setAttribute("opacity", at ? 1 : 0);
      ring.setAttribute("opacity", 0);
      if (!at) return;
      const id = ++bob;
      const t0 = Date.now();
      const step = () => {
        if (id !== bob || st.gone || !dropperAt) return;
        const t = (Date.now() - t0) / 1000;
        dropper.setAttribute("transform", `translate(${at.x} ${at.y - 34 + Math.sin(t * 3) * 4})`);
        if (pulse) ring.setAttribute("opacity", 0.35 + 0.35 * Math.sin(t * 6));
        if (root.requestAnimationFrame && !fast()) root.requestAnimationFrame(step);
      };
      step();
    };
    const fallDrop = (at) => {
      const d = s("path", { d: "M0 -12 Q8 0 0 6 Q-8 0 0 -12Z", fill: "#7cc4f0", transform: `translate(${at.x} ${at.y - 40})` }, S.fx);
      return tween(320, (u) => d.setAttribute("transform", `translate(${at.x} ${at.y - 40 + 38 * u})`)).then(() => d.remove());
    };
    const blink = () => {
      blinkEls.forEach((b) => b.setAttribute("opacity", 1));
      ctx.after(fast() ? 30 : 220, () => blinkEls.forEach((b) => b.setAttribute("opacity", 0)));
    };
    // the mini chart in the corner: from level 2 it starts the test (lit once a drop is in)
    const MINI = { x: 640, y: 24, w: 88, h: 128 };
    const miniG = s("g", { opacity: 0 }, dropsG);
    s("rect", { x: MINI.x - 6, y: MINI.y - 6, width: MINI.w + 12, height: MINI.h + 12, rx: 12, fill: "#c8a46e" }, miniG);
    s("rect", { x: MINI.x, y: MINI.y, width: MINI.w, height: MINI.h, rx: 8, fill: "#fff" }, miniG);
    [16, 13, 10, 8].forEach((r, k) => {
      const y = MINI.y + 22 + k * 28;
      [-1, 0, 1].slice(0, 3 - (k > 1 ? 1 : 0)).forEach((j) => s("circle", { cx: MINI.x + MINI.w / 2 + j * (r * 2.2), cy: y, r: r * 0.7, fill: ["#e2b23b", "#d9534f", "#5aa05a", "#8a5a3a"][(k + j + 3) % 4] }, miniG));
    });
    const miniRing = s("rect", { x: MINI.x - 12, y: MINI.y - 12, width: MINI.w + 24, height: MINI.h + 24, rx: 16, fill: "none", stroke: "#f0b43c", "stroke-width": 6, opacity: 0 }, miniG);
    let miniOn = false;
    let testBtn = null;
    const lightMini = (on) => {
      miniOn = on;
      miniG.setAttribute("opacity", on ? 1 : 0);
      const t0 = Date.now();
      const step = () => {
        if (!miniOn || st.gone) return miniRing.setAttribute("opacity", 0);
        miniRing.setAttribute("opacity", 0.4 + 0.4 * Math.sin(((Date.now() - t0) / 1000) * 5));
        if (root.requestAnimationFrame && !fast()) root.requestAnimationFrame(step);
      };
      step();
    };

    /* ---------------- 2. the test: version A (split screen) or B (side by side) ---------------- */
    const testG = s("g", { opacity: 0 }, S.layer);
    const chartG = s("g", {}, testG);
    let CH; // the chart's board, in its own (unturned) units
    let readEye; // where the patient's open eye is (the redrop)
    let turn = null; // B: the quarter turn
    if (version === "A") {
      const a = art("testA");
      // the left panel: the patient, head and shoulders, a hand over the good eye, looking past us to our right
      const pan = s("g", {}, testG);
      s("rect", { x: -400, y: -300, width: 790, height: 1100, fill: "#e9dcc6" }, pan);
      if (a) s("image", { href: url(a.src), x: a.box[0], y: a.box[1], width: a.box[2], height: a.box[3], preserveAspectRatio: "xMidYMid slice" }, pan);
      else {
        s("path", { d: "M40 520 Q60 380 200 360 Q340 380 360 520Z", fill: clothes }, pan); // shoulders
        s("rect", { x: 175, y: 300, width: 50, height: 70, fill: skinDark }, pan); // neck
        s("ellipse", { cx: 200, cy: 205, rx: 108, ry: 124, fill: skin }, pan); // head
        s("path", { d: "M92 200 Q90 80 200 76 Q310 80 308 200 Q290 120 200 122 Q110 120 92 200Z", fill: hair }, pan);
        // the open eye (the sore one), looking to our right
        s("ellipse", { cx: 160, cy: 205, rx: 26, ry: 16, fill: "#fff", stroke: "#7a4a32", "stroke-width": 3 }, pan);
        s("circle", { cx: 172, cy: 205, r: 11, fill: "#3b2415" }, pan);
        s("path", { d: "M128 178 Q160 166 190 176", stroke: hair, "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, pan);
        // the hand over the other eye: a palm and four fingers, the thumb along the cheek
        const hand = s("g", {}, pan);
        [[214, 150, -18], [236, 146, -8], [258, 150, 4], [278, 160, 16]].forEach(([x, y, a]) => s("rect", { x: x - 11, y: y - 30, width: 22, height: 62, rx: 11, fill: skin, stroke: skinDark, "stroke-width": 3, transform: `rotate(${a} ${x} ${y + 20})` }, hand));
        s("ellipse", { cx: 248, cy: 214, rx: 44, ry: 48, fill: skin, stroke: skinDark, "stroke-width": 3 }, hand);
        s("rect", { x: 230, y: 160, width: 50, height: 40, fill: skin }, hand); // the fingers' join
        s("path", { d: "M212 236 Q200 262 214 284", stroke: skinDark, "stroke-width": 14, "stroke-linecap": "round", fill: "none", opacity: 0.25 }, hand);
        s("path", { d: "M262 262 Q290 300 300 340 L250 350 Q246 300 230 262Z", fill: skin }, hand); // the wrist
        s("path", { d: "M176 270 Q200 284 222 270", stroke: "#7a3a2a", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, pan); // a small smile
      }
      readEye = a && a.eye ? { x: a.eye[0], y: a.eye[1] } : { x: 160, y: 205 };
      // the split: a frame between the two halves
      s("rect", { x: 392, y: -300, width: 14, height: 1100, fill: "#fffaf1" }, testG);
      s("rect", { x: 406, y: -300, width: 600, height: 1100, fill: "#f4ecdf" }, testG);
      CH = { x: 450, y: 18, w: 262, h: 352 };
      testG.appendChild(chartG); // the chart over both halves' ground
    } else {
      const b = art("testB");
      const pan = s("g", {}, testG);
      s("rect", { x: -400, y: -300, width: 1600, height: 1100, fill: "#eadfcb" }, pan);
      s("rect", { x: -400, y: 430, width: 1600, height: 400, fill: "#d9c7a8" }, pan); // the floor
      if (b) s("image", { href: url(b.src), x: b.box[0], y: b.box[1], width: b.box[2], height: b.box[3], preserveAspectRatio: "xMidYMid meet" }, pan);
      else {
        // side-on, facing right, sitting up, looking at the chart
        s("path", { d: "M70 520 L80 330 Q90 290 150 286 Q215 290 222 340 L236 520Z", fill: clothes }, pan); // body
        s("rect", { x: 140, y: 236, width: 40, height: 60, fill: skinDark }, pan); // neck
        s("path", { d: "M110 160 Q112 82 190 80 Q262 84 262 160 Q264 182 276 196 Q262 206 260 222 Q256 252 222 262 Q170 270 132 248 Q106 222 110 160Z", fill: skin }, pan); // head in profile
        s("path", { d: "M106 170 Q96 72 190 70 Q262 72 266 132 Q226 104 182 112 Q160 150 150 200 Q126 210 106 170Z", fill: hair }, pan);
        s("ellipse", { cx: 160, cy: 186, rx: 14, ry: 17, fill: skinDark, opacity: 0.5 }, pan); // ear
        s("path", { d: "M222 150 Q234 146 244 150", stroke: hair, "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, pan);
        s("path", { d: "M226 166 Q238 160 248 166 Q238 172 226 166Z", fill: "#fff", stroke: "#7a4a32", "stroke-width": 2 }, pan);
        s("circle", { cx: 242, cy: 166, r: 5, fill: "#3b2415" }, pan);
        s("path", { d: "M240 226 Q252 230 258 224", stroke: "#7a3a2a", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, pan);
      }
      readEye = b && b.eye ? { x: b.eye[0], y: b.eye[1] } : { x: 238, y: 166 };
      // the chart on its stand, close by, turned a quarter towards both of them
      CH = { x: 400, y: 14, w: 262, h: 352 };
      const legs = s("g", { class: "eye-legs" }, testG);
      s("path", { d: `M${CH.x + 90} ${CH.y + CH.h - 30} L${CH.x + 60} 488 M${CH.x + CH.w - 40} ${CH.y + CH.h - 10} L${CH.x + CH.w - 6} 498 M${CH.x + CH.w / 2 + 30} ${CH.y + CH.h - 20} L${CH.x + CH.w / 2 + 40} 470`, stroke: "#a9824d", "stroke-width": 10, "stroke-linecap": "round" }, legs);
      testG.appendChild(chartG);
      // a quarter turn: the board's left edge is further away, so shorter (a perspective map of the board's own units)
      turn = { k: 0.84, x: 26 };
    }
    // EY1 (CLN-107): the chart is drawn in code, with a stylised eye (the painted charts' realistic eye was "freaky")
    const chartArt = null;
    // A2 (5 Oct): C1 / C2. The board's corners (art.*.board, shares of the picture) fix where the picture goes and
    // the board's own units (CH) take the board's shape, so the rows of pictures are never stretched
    let IMG = null; // the chart picture's box
    let CQ = null; // C2: the board's four corners on screen
    if (chartArt && chartArt.board && chartArt.size) {
      const [tl, tr, br, bl] = chartArt.board;
      const [sw, sh] = chartArt.size;
      if (version === "A") {
        const aspect = ((tr[0] - tl[0]) * sw) / ((bl[1] - tl[1]) * sh);
        const w = CH.h * aspect;
        CH = { x: CH.x + (CH.w - w) / 2, y: CH.y, w, h: CH.h };
        const IW = CH.w / (tr[0] - tl[0]);
        const IH = CH.h / (bl[1] - tl[1]);
        IMG = { x: CH.x - tl[0] * IW, y: CH.y - tl[1] * IH, w: IW, h: IH };
      } else {
        const hf = (bl[1] - tl[1] + (br[1] - tr[1])) / 2; // the board's height, a share of the picture's
        const IH = CH.h / hf;
        const IW = (IH * sw) / sh;
        const cx = (tl[0] + tr[0] + br[0] + bl[0]) / 4;
        const cy = (tl[1] + tr[1] + br[1] + bl[1]) / 4;
        IMG = { x: CH.x + CH.w / 2 - cx * IW, y: CH.y + CH.h / 2 - cy * IH, w: IW, h: IH };
        CQ = [tl, tr, br, bl].map(([x, y]) => [IMG.x + x * IW, IMG.y + y * IH]);
        const wpx = (CQ[1][0] - CQ[0][0] + (CQ[2][0] - CQ[3][0])) / 2;
        const w = (CH.h * wpx) / ((CQ[3][1] - CQ[0][1] + (CQ[2][1] - CQ[1][1])) / 2);
        CH = { x: CH.x + (CH.w - w) / 2, y: CH.y, w, h: CH.h };
        turn = null; // the corners do the turn
        testG.querySelectorAll(".eye-legs").forEach((n) => n.remove()); // C2 stands on its own easel
      }
    }
    // Q: a point on the board (its own units) to the screen; B's quarter turn maps the board onto a quad whose left
    // edge is set back and shorter, so it reads as turned (C2's art brings its own corners: art.chartTurned.quad)
    const Q = (x, y) => {
      if (CQ) {
        // a point on the board (its own units) onto C2's corners (bilinear: the board is a flat quad)
        const u = (x - CH.x) / CH.w;
        const v = (y - CH.y) / CH.h;
        const top = [CQ[0][0] + (CQ[1][0] - CQ[0][0]) * u, CQ[0][1] + (CQ[1][1] - CQ[0][1]) * u];
        const bot = [CQ[3][0] + (CQ[2][0] - CQ[3][0]) * u, CQ[3][1] + (CQ[2][1] - CQ[3][1]) * u];
        return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
      }
      if (!turn) return [x, y];
      const u = (x - (CH.x - 14)) / (CH.w + 28);
      const v = (y - (CH.y - 14)) / (CH.h + 28);
      const k = turn.k + (1 - turn.k) * u; // the height scale across the board
      const X = CH.x - 14 + turn.x + u * (CH.w + 28 - turn.x);
      const mid = CH.y + CH.h / 2;
      return [X, mid + (CH.y - 14 + v * (CH.h + 28) - mid) * k];
    };
    const kAt = (x) => {
      if (CQ) {
        const u = (x - CH.x) / CH.w;
        return ((1 - u) * (CQ[3][1] - CQ[0][1]) + u * (CQ[2][1] - CQ[1][1])) / CH.h;
      }
      return turn ? turn.k + (1 - turn.k) * ((x - (CH.x - 14)) / (CH.w + 28)) : 1;
    };
    const quad = (x, y, w, h) => [Q(x, y), Q(x + w, y), Q(x + w, y + h), Q(x, y + h)].map((q) => q.map((v) => Math.round(v * 10) / 10).join(",")).join(" ");
    // the board: a white chart in a light-wood frame, an eye at the top, rows of pictures getting smaller
    if (chartArt && IMG) s("image", { href: url(chartArt.src), x: IMG.x, y: IMG.y, width: IMG.w, height: IMG.h, preserveAspectRatio: "none" }, chartG);
    else if (chartArt) s("image", { href: url(chartArt.src), x: CH.x - 14, y: CH.y - 14, width: CH.w + 28, height: CH.h + 28, preserveAspectRatio: "none" }, chartG);
    else {
      s("polygon", { points: quad(CH.x - 14, CH.y - 14, CH.w + 28, CH.h + 28), fill: "#c8a46e", stroke: "#a9824d", "stroke-width": 3, "stroke-linejoin": "round" }, chartG);
      s("polygon", { points: quad(CH.x, CH.y, CH.w, CH.h), fill: "#fffefb", "stroke-linejoin": "round" }, chartG);
      const [ex, ey] = Q(CH.x + CH.w / 2, CH.y + 28);
      const ek = kAt(CH.x + CH.w / 2);
      s("path", { d: `M${ex - 26} ${ey} Q${ex} ${ey - 20 * ek} ${ex + 26} ${ey} Q${ex} ${ey + 20 * ek} ${ex - 26} ${ey}Z`, fill: "#fff", stroke: "#4a6f98", "stroke-width": 4 }, chartG);
      s("circle", { cx: ex, cy: ey, r: 8 * ek, fill: "#4a6f98" }, chartG);
    }
    const rowsG = s("g", {}, chartG);
    const nR = P.chart.length;
    const top = CH.y + 58;
    const SIZES = [84, 60, 44, 32].slice(0, nR); // EY12: each row clearly smaller
    const gap = (CH.h - 70 - SIZES.reduce((a, b) => a + b, 0)) / nR;
    // A2: on the art, each row sits on one of the chart's own ruled lines under the eye (the biggest at the top)
    const LINES = IMG && chartArt.lines && chartArt.lines.length > nR ? chartArt.lines : null;
    const rowBox = (i) => {
      if (LINES) {
        const y0 = CH.y + LINES[i] * CH.h;
        const y1 = CH.y + LINES[i + 1] * CH.h;
        const sz = Math.min(SIZES[i], (y1 - y0) * 0.86, (CH.w - 36) / (P.chart[i].pics.length * 1.12));
        return { y: y1 - sz - 6, h: sz + 4, sz };
      }
      // EY12: each row's pictures stand on a ruled line; the outlines are inset so they never overlap (EY3)
      let y = top;
      for (let k = 0; k < i; k++) y += SIZES[k] + gap;
      const sz = Math.min(SIZES[i], (CH.w - 36) / (P.chart[i].pics.length * 1.12));
      return { y, h: SIZES[i] + gap * 0.5, sz, line: y + SIZES[i] + 2 };
    };
    const CHECK = (x, y, r, g) => {
      const c = s("g", { transform: `translate(${x} ${y})` }, g);
      s("circle", { r, fill: "#c9962e" }, c);
      s("path", { d: `M${-r * 0.45} ${r * 0.04} L${-r * 0.14} ${r * 0.33} L${r * 0.44} ${-r * 0.28}`, fill: "none", stroke: "#fff", "stroke-width": r * 0.25, "stroke-linecap": "round", "stroke-linejoin": "round" }, c);
    };
    const drawChart = () => {
      S.clear(rowsG);
      P.chart.forEach((c, i) => {
        const b = rowBox(i);
        const now = cur() && cur().kind === "read" && cur().row === i;
        // CLN-107 (EY13): a row ticks when it's really done (judged right, and read right after a drop), never on a
        // wrong judgement
        const done = !!st.ticked[i];
        if (b.line) {
          const [x1, y1] = Q(CH.x + 14, b.line);
          const [x2, y2] = Q(CH.x + CH.w - 14, b.line);
          s("line", { x1, y1, x2, y2, stroke: "#c9bfae", "stroke-width": 2 }, rowsG);
        }
        // the card's own looks (CLN-61): "now" is the soft band, a judged row has the gold outline and check
        const ry = b.y - 1;
        const rh = b.h;
        if (now) s(turn ? "polygon" : "rect", turn ? { points: quad(CH.x + 10, ry, CH.w - 20, rh), fill: "#fff4df", stroke: "#e8c98a", "stroke-width": 3, "stroke-linejoin": "round" } : { x: CH.x + 10, y: ry, width: CH.w - 20, height: rh, rx: 10, fill: "#fff4df", stroke: "#e8c98a", "stroke-width": 3 }, rowsG);
        if (done) {
          s(turn ? "polygon" : "rect", turn ? { points: quad(CH.x + 10, ry, CH.w - 20, rh), fill: "none", stroke: "#c9962e", "stroke-width": 4, "stroke-linejoin": "round" } : { x: CH.x + 10, y: ry, width: CH.w - 20, height: rh, rx: 10, fill: "none", stroke: "#c9962e", "stroke-width": 4 }, rowsG);
          const [cx, cy] = Q(CH.x + CH.w - 12, b.y + 4);
          CHECK(cx, cy, 11, rowsG);
        }
        c.pics.forEach((id, k) => {
          const bx = CH.x + CH.w / 2 + (k - (c.pics.length - 1) / 2) * b.sz * 1.12;
          const z = b.sz * kAt(bx);
          const [px, py] = b.line ? Q(bx, b.line - b.sz / 2 - 1) : Q(bx, b.y + b.h / 2 - 2);
          s("image", { href: url(BY[id].icon), x: px - z / 2, y: py - z / 2, width: z, height: z, opacity: done || now || !cur() || cur().kind !== "read" || cur().row < i ? 1 : 0.85 }, rowsG);
        });
      });
    };
    drawChart();

    // the judging pills, under the chart: the shared answer pills (UX 15), one pill style everywhere
    const judgeBox = S.h("div", "hs-judge", S.root);
    const NB = root.NjgButtons;
    const yesNo = { yes: HS.L.w(HS.L.yesId()).kutchi, no: HS.L.w(HS.L.noId()).kutchi };
    const pills = NB ? NB.pills(judgeBox, [{ id: "yes", html: yesNo.yes }, { id: "no", html: yesNo.no }], (id) => onJudge(id === "yes")) : null;
    const mk = (id, label) => {
      if (pills) {
        const b = pills.pill(id);
        b.dataset.judge = id;
        return b;
      }
      const b = S.h("button", "hs-tool", judgeBox);
      b.type = "button";
      b.dataset.judge = id;
      b.textContent = label;
      ctx.on(b, "click", () => onJudge(id === "yes"));
      return b;
    };
    const haaBtn = mk("yes", yesNo.yes);
    const naBtn = mk("no", yesNo.no);
    // the pills sit under the chart (not across the split): their centre follows the chart's on screen
    const placeJudge = () => {
      const m = chartG.getScreenCTM && chartG.getScreenCTM();
      if (!m) return;
      const p = S.svg.createSVGPoint();
      p.x = CH.x + CH.w / 2;
      p.y = CH.y + CH.h;
      const q = p.matrixTransform(m);
      judgeBox.style.left = `${q.x - S.root.getBoundingClientRect().left}px`;
      judgeBox.style.width = "max-content"; // side by side, never stacked over the chart
    };
    const showJudge = (on) => {
      judgeBox.classList.toggle("hidden", !on);
      if (on) placeJudge();
    };
    showJudge(false);

    const judge = (id, ok, detail) => {
      if (id in st.judged) return;
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const toTest = async () => {
      // the camera pulls back from the eyes to the test (a cross-fade; the art batch makes it a cut, art plan 2.1)
      st.busy = true;
      showDropper(null);
      lightMini(false);
      S.tools([], null);
      await tween(450, (u) => {
        dropsG.setAttribute("opacity", 1 - u);
        testG.setAttribute("opacity", u);
      });
      st.view = "test";
      st.busy = false;
    };
    const readRow = async (i, again) => {
      const c = P.chart[i];
      const said = again ? c.pics : c.said;
      const line = HS.L.show(HS.L.join(said.flatMap((id, k) => (k ? [",", BY[id].lex] : [BY[id].lex]))));
      showJudge(false);
      S.face("read");
      // T32, EY5, EY7 (CLN-107): what she says is in a bubble under her mouth; at L1 her words are written in it and
      // fade in about a second; from L2 the bubble shows she's talking, the words are heard only
      mouthSay(P.level === 1 ? said.map((id) => word(BY[id]).replace(/[[\]]/g, "")).join(", ") : null);
      if (again) {
        st.busy = true;
        await ctx.say(line, { who: "patient", noBubble: true });
        S.face("neutral");
        // she read it right: the row ticks itself, then a pause before the next row (EY13)
        st.ticked[i] = true;
        drawChart();
        await new Promise((r) => ctx.after(fast() ? 80 : 900, r));
        st.busy = false;
        return advance();
      }
      // the judging pills come up as the reading starts: input never waits for the talking (13i)
      st.awaiting = { i, again, wrong: c.wrong };
      showJudge(true);
      // CLN-60: the first-time help shows the RIGHT answer for this row (never haa on a row read wrong); the row it
      // shows is taught, not scored
      if (i === 0) {
        if (S.cuesOn && !again) P.rows = P.rows.filter((r) => r.id !== RID(0));
        S.cue("read", CUES.read, c.wrong ? naBtn : haaBtn);
      }
      ctx.say(line, { who: "patient", noBubble: true }).then(() => S.face("neutral"));
    };
    // her bubble under her mouth (the eye test): the anchor below her mouth on the left panel
    const mouthAt = () => (readEye ? { x: readEye.x + (version === "A" ? 40 : 10), y: readEye.y + (version === "A" ? 92 : 70) } : null);
    const mouthSay = (text) => {
      S.root.querySelectorAll(".eye-said").forEach((n) => n.remove());
      const m = mouthAt();
      if (!m) return;
      const el = S.h("div", `eye-said${text ? "" : " talk"}`, S.root, text || "");
      if (!text) el.innerHTML = '<i></i><i></i><i></i>';
      const c = S.client(m.x, m.y);
      const rr = S.root.getBoundingClientRect();
      el.style.left = `${c.x - rr.left}px`;
      el.style.top = `${c.y - rr.top}px`;
      ctx.after(text ? (fast() ? 120 : 1200) : fast() ? 120 : 2200, () => el.classList.add("fade"));
      ctx.after(text ? (fast() ? 300 : 2000) : fast() ? 300 : 2800, () => el.remove());
    };
    // EY13: a wrong judgement: the doctor (his box, off screen) names the row with its pictures, said aloud
    const nameRow = async (i) => {
      const c = P.chart[i];
      S.root.querySelectorAll(".eye-name").forEach((n) => n.remove());
      const el = S.h("div", "eye-name", S.root);
      c.pics.forEach((id) => {
        const im = S.h("img", null, el);
        im.alt = "";
        im.src = url(BY[id].icon);
      });
      const line = HS.L.show(HS.L.join(c.pics.flatMap((id, k) => (k ? [",", BY[id].lex] : [BY[id].lex]))));
      await ctx.say(line, { who: "doctor", noBubble: true });
      ctx.after(fast() ? 100 : 1600, () => el.remove());
    };
    const onJudge = async (saysRight) => {
      if (!st.awaiting || st.busy || st.over) return;
      const { i, wrong } = st.awaiting;
      judge(RID(i), saysRight === !wrong, saysRight ? yesNo.yes : yesNo.no);
      S.uncue();
      if (saysRight === wrong) {
        // EY13, decision 59 (CLN-107): a wrong yes / no shakes red, and the doctor names the row with its pictures;
        // the child judges again (the first judgement is what's scored)
        const b = saysRight ? haaBtn : naBtn;
        b.classList.remove("nope-red");
        void b.offsetWidth;
        b.classList.add("nope-red");
        st.busy = true;
        await nameRow(i);
        b.classList.remove("nope-red");
        st.busy = false;
        return;
      }
      st.awaiting = null;
      showJudge(false);
      S.said(null);
      drawChart();
      if (!saysRight) {
        // CLN-62: the dropper hangs over the eye and pulses: one tap, then they read the row again
        st.redrop = { i };
        showDropper(readEye, true);
        S.cue("redrop", CUES.redrop, { x: readEye.x, y: readEye.y - 50, r: 50 });
        return;
      }
      // she read it right and the child said so: the row ticks, a pause, then the next row
      st.ticked[i] = true;
      drawChart();
      st.busy = true;
      ctx.after(fast() ? 80 : 700, () => {
        st.busy = false;
        advance();
      });
    };
    const advance = () => {
      st.i++;
      const c = cur();
      if (!c) return finish();
      open();
    };
    const open = async () => {
      const c = cur();
      drawChart();
      if (c.kind === "drops") {
        ctx.card.now("drops");
        return S.cue("drops", CUES.drops, () => S.toolEls.drops, { target: { x: sore.x, y: sore.y, r: 80 } });
      }
      if (c.kind === "read") {
        if (st.view !== "test") await toTest();
        if (c.row === 0) ctx.card.now("chart");
        readRow(c.row, false);
      }
    };
    const closeDrops = () => {
      const c = cur();
      if (!c || c.kind !== "drops") return;
      judge("drops-count", st.drops === c.count, `${st.drops} of ${c.count}`);
      ctx.card.tick("drops");
      S.uncue();
      advance();
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      showJudge(false);
      showDropper(null);
      ctx.card.tick("chart");
      ctx.card.now(null);
      S.face("happy");
      S.say("eye-better", "patient");
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    S.tools([{ id: "drops", glyph: "💧", img: "assets/clinic/items-v2/eye-drops.webp" }], (id) => {
      if (id === "drops" && cur() && cur().kind === "drops") showDropper(sore, false);
    });
    // S02-G (gate s02-gate): the dropper hanging over the eye is the drop's target too (its picture is x -30..30,
    // y -128..-10 under the hang point at sore.y - 34, plus the bob and a finger's slack). At 4:3 the tool shelf sits
    // on the sore eye's outer edge, and a touch there snaps to the shelf's button, so the dropper is the sure tap
    const DROPPER_TAP = { y: sore.y - 34 - 69 };
    const onDropper = (p) => Math.abs(p.x - sore.x) <= 60 && p.y >= sore.y - 34 - 150 && p.y <= sore.y;
    const dropIn = async (at) => {
      await fallDrop(at);
      S.face("wince", 400);
      blink();
    };
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      if (!c) return;
      if (st.redrop) {
        if (Math.hypot(p.x - readEye.x, p.y - (readEye.y - 40)) > 90) return;
        const i = st.redrop.i;
        st.redrop = null;
        S.uncue();
        st.busy = true;
        dropIn(readEye).then(() => {
          showDropper(null);
          st.busy = false;
          readRow(i, true);
        });
        return;
      }
      if (c.kind !== "drops") return;

      if (S.sel !== "drops") return;
      if (Math.hypot(p.x - sore.x, (p.y - sore.y) * 1.3) > 140 && !onDropper(p)) return;
      st.drops++;
      ctx.tally("drops", st.drops);
      if (ctx.level >= 3) S.count(st.drops);
      dropIn(sore);
      if (soreEl && eyesArt) soreEl.setAttribute("opacity", Math.min(1, 0.34 * st.drops));
      else if (soreEl) soreEl.setAttribute("opacity", Math.max(0.08, 0.55 - 0.18 * st.drops));
      // D5 (1 Oct, SH-38): at level 1 the row turns gold at the count and the step closes by itself
      if (P.level === 1 && st.drops >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), closeDrops, 900);
      // EY6 (CLN-107): from level 2, once a drop is in, a "to the eye test" button comes up bottom right like every
      // other stage's (a picture of the chart, no words), never a flashing chart in the corner
      if (P.level >= 2 && !testBtn) {
        testBtn = ctx.button("", () => {
          if (st.busy || st.over || !cur() || cur().kind !== "drops") return;
          S.did();
          testBtn.remove();
          closeDrops();
        }, "throb eye-btn");
        testBtn.dataset.go = "eye test";
        const t = testBtn.querySelector(".njg-next-t") || testBtn;
        t.textContent = "";
        t.insertAdjacentHTML("beforeend", '<svg class="eye-btn-chart" viewBox="0 0 40 52" aria-hidden="true"><rect x="2" y="2" width="36" height="48" rx="5" fill="#fffefb" stroke="#a9824d" stroke-width="3"/><path d="M12 12 Q20 6 28 12 Q20 18 12 12Z" fill="#fff" stroke="#4a6f98" stroke-width="2"/><circle cx="20" cy="12" r="2.6" fill="#4a6f98"/><circle cx="20" cy="25" r="4" fill="#e2b23b"/><circle cx="14" cy="35" r="3" fill="#d9534f"/><circle cx="26" cy="35" r="3" fill="#5aa05a"/><circle cx="11" cy="43" r="2" fill="#8a5a3a"/><circle cx="20" cy="43" r="2" fill="#e2b23b"/><circle cx="29" cy="43" r="2" fill="#5aa05a"/></svg>');
        S.cue("chart", CUES.chart, testBtn);
      }
      st.busy = true;
      ctx.after(fast() ? 60 : 250, () => (st.busy = false));
    });

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        open();
      },
      destroy() {
        st.gone = true;
        bob++;
        miniOn = false;
        S.destroy();
      },
      debug: {
        get plan() {
          return P;
        },
        get cues() {
          return S.cueLog.slice();
        },
        version,
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy) return { do: "wait" };
          const tool = (id) => {
            const r = S.toolEls[id].getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: id };
          };
          if (st.redrop) return Object.assign({ do: "tap", what: "redrop" }, S.client(readEye.x, readEye.y - 30));
          if (c.kind === "drops") {
            if (st.drops >= c.count) {
              if (P.level < 2 || !testBtn) return { do: "wait" };
              const r = testBtn.getBoundingClientRect();
              return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: "eyetest" };
            }
            return S.sel !== "drops" ? tool("drops") : Object.assign({ do: "tap", what: "drop" }, S.client(sore.x, DROPPER_TAP.y));
          }
          if (st.awaiting) {
            const b = (st.awaiting.wrong ? naBtn : haaBtn).getBoundingClientRect();
            return { do: "tap", x: b.left + b.width / 2, y: b.top + b.height / 2, what: st.awaiting.wrong ? "no" : "yes" };
          }
          return { do: "wait" };
        },
        slip() {
          // judge the first chart row the wrong way
          if (!st.awaiting || st.awaiting.i !== 0 || st.busy) return null;
          const b = (st.awaiting.wrong ? haaBtn : naBtn).getBoundingClientRect();
          return { do: "tap", x: b.left + b.width / 2, y: b.top + b.height / 2, what: "misjudge" };
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "eye",
    part: "eye",
    ailments: ["sore-eye"],
    items: ["drops-green", "pointer", "patch"],
    itemsFor: { "sore-eye": ["drops-green", "pointer", "patch"] },
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
