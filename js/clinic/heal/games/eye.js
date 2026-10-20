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
 *    L1: one picture a row, what they say also written by them; L2 heard only, up to three pictures a row; L3 the same
 *    with the card closed; L4 up to four pictures a row (Zafar's heal ladder, 13 Oct).
 * The help never presses haa on a row read wrong (CLN-60): its first row is shown with the right answer, unscored.
 * Rows (the words decide): the drop count, each chart row's judgement.
 * Art swaps in by file name: data art.* (the art plan's Y1-Y3 eyes, T1/T2 eye tests, C1/C2 charts) once ready.
 */
(function (root) {
  "use strict";
  let eyeUid = 0; // s08-w6c: ids for the wall picture's fade mask
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  // the chart's pictures: words the child already knows from Cook, each by its lexicon id (HS.pic: the clinic's art
  // where it has the thing, CLN-78)
  // EY10 (CLN-107): water is Cook's blue drop on the chart (the steel jug read as milk next to the milk jug)
  // CLN-189 (clinic decision 9; Zafar, 18 Oct: "she's saying ... limu, which is lemon ... I'm pressing no, because an
  // orange"): limu is the whole yellow lemon (s08b LM1), never the golden half that reads as an orange
  const PIC = { "cook-paani": "assets/cook/items/icon-cook-paani.webp", "fru-02": "assets/clinic/items-s08b/lemon-whole-s08b.webp" };
  const THINGS = ["fru-02", "veg-01", "veg-02", "veg-03", "veg-12", "veg-13", "veg-14", "cook-dudh", "cook-paani"].map((lex) => ({ id: lex, lex, icon: PIC[lex] || HS.pic(lex) }));
  const BY = Object.fromEntries(THINGS.map((t) => [t.id, t]));
  const RID = (i) => `chart-${"abcdef"[i]}`; // a chart row's scored id (the review lists it under the eye-test row)
  const W = (t) => HS.L.w(t.lex);
  const word = (t) => W(t).kutchi || `[${W(t).english}]`;
  // EY12 (decision 12 of the 6 Oct report, CLN-107): a real eye chart: one big picture at the top, more and smaller
  // ones lower down; per[L][row] = the pictures in that row
  // Zafar's heal ladder (13 Oct): all new things by L2, L3 heard only (the closed card), harder variety from L4: the
  // four-picture row (L3's until now) is L4's
  // CLN-188 (clinic decision 8; Zafar, 18 Oct: "one, two, then three, then four"; the layout research, 19 Oct): ONE
  // chart at every level, rows 1-2-3-4 (Snellen's top four), and the level chooses how many rows are read (read: L1-L3 the
  // first three, L4 all four; L1 is not two rows: with two a blind player wins 10.4%, over the leak test's 10%). CLN-187 (clinic decision 8; Zafar, 18 Oct: "by level 2, start picking drops.
  // A certain number of drops in the left eye and a certain number of drops in the right eye"): from bothFrom a count
  // for each eye
  const K = { drops: { 1: [1, 2, 3], 2: [1, 2, 3], 3: [1, 2, 3], 4: [1, 2, 3] }, per: [1, 2, 3, 4], read: { 1: 3, 2: 3, 3: 3, 4: 4 }, bothFrom: 2, wrongP: 0.45 };
  // the chart's rows as shares of the board's white face (H its height, W its width; research-layout-2026-10-19 task 2):
  // each row 0.8x the one above (the logMAR step), its middle at y, the pictures 1.5 of their size apart, centred
  const ROWS = { size: [0.2, 0.16, 0.128, 0.102], y: [0.19, 0.45, 0.66, 0.82], pitch: 1.5, tick: 0.955 };
  const WHY = { problem: "eye-why", goal: "eye-goal" }; // line keys in data/clinic/heal/eye.json (the engine says them)
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    drops: { gesture: "tap", then: "tap" },
    chart: { gesture: "tap" },
    read: { gesture: "tap" },
    redrop: { gesture: "tap" },
  };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(4, level));
    // D10 (1 Oct): sides are said and tested in the diagnosis only: no side row, no "cover the other eye"
    const side = null;
    const drops = HS.pick(K.drops[L], rng);
    // CLN-187: from level 2 a count for each eye (the patient's own right and left); level 1 the sore eye alone
    const both = L >= K.bothFrom ? { right: drops, left: HS.pick(K.drops[L], rng) } : null;
    const pool = HS.shuffle(THINGS, rng);
    let pi = 0;
    const chart = [];
    for (let r = 0; r < K.per.length; r++) {
      const n = K.per[r] || 1;
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
    const read = Math.min(chart.length, K.read[L] || chart.length);
    // each eye's row: its side on the eye noun, then the drops and their count, built by the engine (grey English where
    // a word is still to record)
    const eyeRow = (sd, n) => Object.assign({ id: `drops-${sd}`, side: sd }, Lg.show(Lg.join([Lg.item("body-eye", { mods: [Lg.sideId(sd)] }), ",", "cl-drops", Lg.count(n)]), { cap: true }));
    const cardRows = both ? [eyeRow("right", both.right), eyeRow("left", both.left)] : [Object.assign({ id: "drops" }, Lg.show(Lg.join(["cl-drops", Lg.count(drops)]), { cap: true }))];
    // CLN-187 (s08-w6c; the judge: at L3 "Jamni akh, chando" with no number and no left-eye card): from level 3 the card
    // is closed and its strip shows one step's line, so the drops step's strip is both eyes' counts in one engine line
    const eyeParts = (sd, n) => [Lg.item("body-eye", { mods: [Lg.sideId(sd)] }), ",", "cl-drops", Lg.count(n)];
    const strip = both && L >= 3 ? Object.assign({ id: "drops-both" }, Lg.show(Lg.join(eyeParts("right", both.right).concat([","], eyeParts("left", both.left))), { cap: true })) : null;
    steps.push({ id: "drops", kind: "drops", count: both ? both.right + both.left : drops, both, side, row: cardRows[0], cardRows, strip });
    chart.slice(0, read).forEach((c, i) => steps.push({ id: `read${i}`, kind: "read", row: i, rowDef: c }));
    const rows = both ? [{ id: "drops-right", options: K.drops[L], answer: both.right }, { id: "drops-left", options: K.drops[L], answer: both.left }] : [{ id: "drops-count", options: K.drops[L], answer: drops }];
    // each chart row's judgement: "chart-a", "chart-b" ... (the end review lists them under the card's eye-test row, D14)
    chart.slice(0, read).forEach((c, i) => rows.push({ id: `chart-${"abcdef"[i]}`, options: [true, false], answer: !c.wrong }));
    const words = (both ? [Lg.num(both.right), Lg.num(both.left), Lg.w(Lg.sideId("right")), Lg.w(Lg.sideId("left"))].filter((w, k, a) => a.findIndex((x) => x.kutchi === w.kutchi && x.english === w.english) === k) : [Lg.num(drops)]).concat([Lg.w(Lg.yesId()), Lg.w(Lg.noId())]);
    const seen = new Set();
    chart.slice(0, read).forEach((c) => c.pics.forEach((id) => !seen.has(id) && seen.add(id) && words.push(W(BY[id]))));
    return { level: L, side, steps, rows, chart, read, both, words };
  }

  function mount(stage, ctx) {
    const data = ctx.data || {};
    const P = plan(ctx.level, ctx.rng);
    // CLN-118 (D13): the taught round is shown by the ghost finger and scores nothing; SH-99, CLN-161 (Zafar, 18 Oct: "it needed me to press the cloth twice, but it wasn't in the instructions ... all the frequencies has to be written down. And audible as well"; reverses CLN-118): the taught first round writes and says every count too, and its word review keeps the number words
    if (ctx.taught) P.words = HS.taughtWords(P.words).concat(P.words.filter((w) => w && w.n != null));
    // S03 (review flaw 5): on a tablet (4:3, 1180x820) the close-up's crop cut the sore eye at the screen's edge: a
    // wider safe area there keeps both eyes whole (and the tool shelf goes down to the cheek, below)
    const tablet = (root.innerWidth || 0) / Math.max(1, root.innerHeight || 0) < 1.5;
    const SAFE = tablet ? [50, 790] : [80, 720];
    const S = HS.make(stage, ctx, Object.assign({ place: "head", game: "eye" }, tablet ? { safe: SAFE } : {}));
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
        const qs = new URLSearchParams(root.location.search);
        const q = qs.get("eyeLayout") || qs.get("eyetest"); // decision 83: ?eyeLayout=A|B (or the older ?eyetest=a|b) to compare
        if (q) v = q;
      } catch (e) {
        /* no page */
      }
      return String(v).toUpperCase() === "B" ? "B" : "A";
    })();
    const st = { i: 0, drops: 0, n: { right: 0, left: 0 }, nowEye: "right", judged: {}, ticked: {}, over: false, busy: false, awaiting: null, redrop: null, view: "drops", gone: false };
    const cur = () => P.steps[st.i] || null;
    ctx.card.setRows(P.steps.filter((x) => x.kind === "drops").flatMap((x) => x.cardRows || [x.row]).concat([Object.assign({}, HS.L.w("eye-test", { cap: true }), { id: "chart" })]));
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
    // S02-G (gate s02-gate): the dropper hanging over the eye is the drop's target too (its picture is x -30..30,
    // y -128..-10 under the hang point at sore.y - 34, plus the bob and a finger's slack). At 4:3 the tool shelf sits
    // on the sore eye's outer edge, and a touch there snaps to the shelf's button, so the dropper is the sure tap
    const DROPPER_TAP = { y: sore.y - 34 - 60 };
    // the hanging dropper over an eye is that eye's tap too (CLN-187: from level 2 either eye takes drops)
    const onDropper = (p, e = sore) => Math.abs(p.x - e.x) <= 60 && p.y >= e.y - 34 - 150 && p.y <= e.y;
    const eyeSides = P.both ? ["right", "left"] : [soreSide];
    const eyeAt = (p) => {
      let best = null;
      eyeSides.forEach((sd) => {
        const e = EY[sd];
        const d = Math.hypot(p.x - e.x, (p.y - e.y) * 1.3);
        if ((d <= 140 || onDropper(p, e)) && (!best || d < best.d)) best = { sd, d };
      });
      return best ? best.sd : null;
    };
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
    // CLN-186 (Zafar, 18 Oct: "the drops need to be more realistic, photorealistic drops, and the bottle ... isn't cut out
    // nicely"): the re-cut bottle (sheets-v3, SH-115) held nozzle down, cut off just under its nozzle (its painted drop
    // hidden), so the photo drop (s08b DP3) hangs there, falls and splashes (data art.drop)
    const DA = data.art && data.art.drop && data.art.drop.bottle ? data.art.drop : null;
    const downArt = DA ? DA.bottle : Kit0 && Kit0.view ? Kit0.view("drop-bottle", "use-down") : null;
    const NOZ = DA ? DA.nozzle || 0.818 : 1; // the nozzle's end, a share of the bottle picture's height
    const BH = 118;
    if (DA) {
      const cid = `eye-noz-${Math.round(Math.random() * 1e9)}`;
      const cp = s("clipPath", { id: cid, clipPathUnits: "userSpaceOnUse" }, s("defs", {}, dropper));
      s("rect", { x: -40, y: -10 - NOZ * BH - 2, width: 80, height: NOZ * BH + 2 }, cp);
      s("image", { href: url(downArt), x: -30, y: -10 - NOZ * BH, width: 60, height: BH, "clip-path": `url(#${cid})` }, dropper);
    } else s("image", { href: url(downArt || "assets/clinic/items-v2/eye-drops.webp"), x: -30, y: -128, width: 60, height: 118, transform: downArt ? null : "rotate(180 0 -69)" }, dropper);
    const DROP = DA && DA.falling ? { w: DA.w || 11, h: (DA.w || 11) / (DA.aspect || 0.604) } : null;
    const hangDrop = DROP ? s("image", { href: url(DA.falling), x: -DROP.w / 2, y: -11, width: DROP.w, height: DROP.h }, dropper) : null;
    const ring = s("circle", { cx: 0, cy: 34, r: 40, fill: "none", stroke: "#f0b43c", "stroke-width": 6, opacity: 0 }, dropper); // round the eye
    let dropperAt = null;
    let bob = 0;
    // where the bottle hangs: `lift` units above the eye at scale `k` (the ring stays centred on the eye). The drops'
    // close-up hangs it high over a big eye; the eye test's redrop (CLN-62) hangs it smaller, its nozzle just over the
    // open eye, never up on the forehead
    const HANG = { drops: { lift: 34, k: 1 }, redrop: { lift: 16, k: 0.78 } };
    const tipOf = (h) => h.lift * h.k + 10 * h.k; // the nozzle's height over the eye
    const showDropper = (at, pulse, hang = HANG.drops) => {
      dropperAt = at;
      dropper.setAttribute("opacity", at ? 1 : 0);
      ring.setAttribute("opacity", 0);
      if (!at) return;
      ring.setAttribute("cy", hang.lift);
      const id = ++bob;
      const t0 = Date.now();
      const step = () => {
        if (id !== bob || st.gone || !dropperAt) return;
        const t = (Date.now() - t0) / 1000;
        dropper.setAttribute("transform", `translate(${at.x} ${at.y - hang.lift * hang.k + Math.sin(t * 3) * 4 * hang.k}) scale(${hang.k})`);
        if (pulse) ring.setAttribute("opacity", 0.35 + 0.35 * Math.sin(t * 6));
        if (root.requestAnimationFrame && !fast()) root.requestAnimationFrame(step);
      };
      step();
    };
    const fallDrop = (at, hang = HANG.drops) => {
      const top = Math.max(18, tipOf(hang) - 4);
      if (DROP) {
        // CLN-186: the photo drop leaves the nozzle (the hanging one goes), falls onto the eye and splashes a little;
        // a new drop forms at the nozzle after
        const k = hang.k;
        const w = DROP.w * k;
        const h = DROP.h * k;
        if (hangDrop) hangDrop.setAttribute("opacity", 0);
        const d = s("image", { href: url(DA.falling), x: at.x - w / 2, y: at.y - top, width: w, height: h }, S.fx);
        return tween(300, (u) => d.setAttribute("y", (at.y - top + (top - h * 0.7) * u * u).toFixed(1))).then(() => {
          d.remove();
          if (DA.splash) {
            const sw = (DA.splashW || 46) * k;
            const sh = sw / (DA.splashAspect || 2.02);
            const sp = s("image", { href: url(DA.splash), x: at.x - sw / 2, y: at.y - sh * 0.75, width: sw, height: sh, opacity: 0.85 }, S.fx);
            tween(260, (u) => sp.setAttribute("opacity", (0.85 * (1 - u)).toFixed(2))).then(() => sp.remove());
          }
          if (hangDrop) tween(300, (u) => hangDrop.setAttribute("opacity", u.toFixed(2)));
        });
      }
      const d = s("path", { d: "M0 -12 Q8 0 0 6 Q-8 0 0 -12Z", fill: "#7cc4f0", transform: `translate(${at.x} ${at.y - top})` }, S.fx);
      return tween(320, (u) => d.setAttribute("transform", `translate(${at.x} ${at.y - top + (top - 2) * u})`)).then(() => d.remove());
    };
    // CLN-187: each eye's own running count, the shared count badge beside the eye's outer corner (from level 2)
    const eyeCounts = [];
    const countEye = (sd, bump = true) => {
      let b = S.root.querySelector(`.eye-count[data-eye="${sd}"]`);
      if (!b) {
        b = S.h("span", "hs-count eye-count", S.root);
        b.dataset.eye = sd;
        b.setAttribute("aria-hidden", "true");
        eyeCounts.push(b);
      }
      const n = st.n[sd];
      b.classList.toggle("dots", P.level >= 3);
      b.textContent = P.level >= 3 ? "•".repeat(Math.min(n, 9)) : Kit0 && Kit0.num ? Kit0.num(n) : String(n);
      const e = EY[sd];
      // the patient's right eye is on our left: its badge on its outer (left) side, the other's on the right
      const c = S.client(e.x + (e.x < 400 ? -118 : 118), e.y - 70);
      const rr = S.root.getBoundingClientRect();
      Object.assign(b.style, { left: `${c.x - rr.left}px`, top: `${c.y - rr.top}px`, translate: "-50% -50%" }); // (translate: the bump animates transform)
      if (!bump) return;
      b.classList.remove("bump");
      void b.offsetWidth;
      b.classList.add("bump");
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
    const WALL = data.art && data.art.wall && data.art.wall.src && data.art.wall.box && data.art.wall.board ? data.art.wall : null;
    if (version === "A") {
      const a = art("testA");
      // CLN-188 (s08-w6c; the judge: the board "fills only about a third of the screen ... the girl photo takes the larger
      // left part"): where the split falls (data test.split, close-up units; it was 392, the middle): her panel narrower,
      // the wall and its board wider
      const SPLIT = (data.test && data.test.split) || 392;
      // the left panel: the patient, head and shoulders, a hand over the good eye, looking past us to our right
      const pan = s("g", {}, testG);
      s("rect", { x: -400, y: -300, width: SPLIT + 400, height: 1100, fill: "#e9dcc6" }, pan);
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
      s("rect", { x: SPLIT, y: -300, width: 14, height: 1100, fill: "#fffaf1" }, testG);
      // CLN-188 (Zafar, 18 Oct: "an eye test board sitting on an optician's wall ... code draw everything that goes onto
      // the board"; "we want it to take up most of the screen"): the s08b EC1 wall with its blank board fills the right
      // panel edge to edge (art.wall.box, the close-up's units; its own wall and skirting colours round it on a tall
      // screen); the board's white face (art.wall.board, shares of the picture) is the chart's own units (CH)
      if (WALL) {
        // CLN-188 (s08 w6H; the judge: the board "fills only about a third of the play width"): the board is widened
        // without stretching its frame (art.wall.stretch: [a, b, f], a nine-slice of the picture: its middle share a..b,
        // the plain board face and the wall above and below it, drawn f times as wide; the frame's sides keep their
        // drawn size), so the wall's real picture takes most of the play width
        const [sa, sb, sf] = WALL.stretch || [0.5, 0.5, 1];
        const w0 = WALL.box[2];
        const wb = [WALL.box[0], WALL.box[1], w0 * (sa + (1 - sb) + (sb - sa) * sf), WALL.box[3]];
        // a share of the picture's width -> its x in the widened picture
        const xs = (u) => wb[0] + w0 * (u <= sa ? u : u >= sb ? u - (sb - sa) + (sb - sa) * sf : sa + (u - sa) * sf);
        s("rect", { x: SPLIT + 14, y: -300, width: 1000, height: 1100, fill: WALL.fill || "#a9b4b8" }, testG);
        s("rect", { x: SPLIT + 14, y: wb[1] + wb[3] - 2, width: 1000, height: 700, fill: WALL.floor || "#c3b6a6" }, testG);
        // s08-w6c (CLN-188): the picture's sides fade into the wall's colour round it (its lit left edge left a seam)
        const fadeId = `eye-wallfade-${(eyeUid = (eyeUid || 0) + 1)}`;
        const gr = s("linearGradient", { id: `${fadeId}-g`, x1: 0, x2: 1, y1: 0, y2: 0 }, testG);
        [[0, 0], [0.12, 1], [0.88, 1], [1, 0]].forEach(([o, a]) => s("stop", { offset: o, "stop-color": "#fff", "stop-opacity": a }, gr));
        const mk = s("mask", { id: fadeId, maskUnits: "userSpaceOnUse", x: wb[0], y: wb[1], width: wb[2], height: wb[3] }, testG);
        s("rect", { x: wb[0], y: wb[1], width: wb[2], height: wb[3], fill: `url(#${fadeId}-g)` }, mk);
        // and its top (the ceiling light's bright band) into the wall above it on a tall screen
        const gv = s("linearGradient", { id: `${fadeId}-v`, x1: 0, x2: 0, y1: 0, y2: 1 }, testG);
        [[0, 0], [0.1, 1], [1, 1]].forEach(([o, a]) => s("stop", { offset: o, "stop-color": "#fff", "stop-opacity": a }, gv));
        const mv = s("mask", { id: `${fadeId}-m`, maskUnits: "userSpaceOnUse", x: wb[0], y: wb[1], width: wb[2], height: wb[3] }, testG);
        s("rect", { x: wb[0], y: wb[1], width: wb[2], height: wb[3], fill: `url(#${fadeId}-v)` }, mv);
        // the wall never reaches over her panel (the widened picture may start left of the split)
        const clipId = `${fadeId}-c`;
        const cp = s("clipPath", { id: clipId }, testG);
        s("rect", { x: SPLIT + 14, y: -300, width: 1000, height: 1100 }, cp);
        const wallG = s("g", { mask: `url(#${fadeId}-m)`, "clip-path": `url(#${clipId})` }, testG);
        const fadeG = s("g", { mask: `url(#${fadeId})` }, wallG);
        // the three slices: each a window (a nested svg) on its share of the one picture. The middle is drawn first and a
        // little past both joins (pad, a share of the picture), the sides over it: no seam line where they meet
        const pad = 0.01;
        [[sa - pad, sb + pad, true], [0, sa], [sb, 1]].forEach(([u0, u1, middle]) => {
          if (u1 <= u0 || (middle && sb <= sa)) return;
          const x0 = middle ? xs(sa) - pad * w0 * sf : xs(u0);
          const x1 = middle ? xs(sb) + pad * w0 * sf : xs(u1);
          const win = s("svg", { x: x0, y: wb[1], width: x1 - x0, height: wb[3], viewBox: `${u0 * 1000} 0 ${(u1 - u0) * 1000} 1000`, preserveAspectRatio: "none", overflow: "hidden" }, fadeG);
          s("image", { href: url(WALL.src), x: 0, y: 0, width: 1000, height: 1000, preserveAspectRatio: "none" }, win);
        });
        const bd = WALL.board;
        CH = { x: xs(bd[0]), y: wb[1] + bd[1] * wb[3], w: xs(bd[2]) - xs(bd[0]), h: (bd[3] - bd[1]) * wb[3] };
      } else {
        s("rect", { x: SPLIT + 14, y: -300, width: 1000, height: 1100, fill: "#f4ecdf" }, testG);
        CH = { x: 450, y: 18, w: 262, h: 352 };
      }
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
    // the board: on the wall picture (A) the board is the picture's own; else (B, ?eyeLayout=B) a white board in a light-wood
    // frame drawn here. CLN-188 (Zafar, 18 Oct: "take out those lines"; "take away the eye icon"): nothing on the board but
    // the pictures, no eye, no ruled lines, no row outlines
    if (chartArt && IMG) s("image", { href: url(chartArt.src), x: IMG.x, y: IMG.y, width: IMG.w, height: IMG.h, preserveAspectRatio: "none" }, chartG);
    else if (chartArt) s("image", { href: url(chartArt.src), x: CH.x - 14, y: CH.y - 14, width: CH.w + 28, height: CH.h + 28, preserveAspectRatio: "none" }, chartG);
    else if (!(WALL && version === "A")) {
      s("polygon", { points: quad(CH.x - 14, CH.y - 14, CH.w + 28, CH.h + 28), fill: "#c8a46e", stroke: "#a9824d", "stroke-width": 3, "stroke-linejoin": "round" }, chartG);
      s("polygon", { points: quad(CH.x, CH.y, CH.w, CH.h), fill: "#fffefb", "stroke-linejoin": "round" }, chartG);
    }
    const rowsG = s("g", {}, chartG);
    // CLN-188 (the layout research, 19 Oct): rows 1-2-3-4, each 0.8x the one above, its middle at ROWS.y of the board's
    // height, the pictures 1.5 of their size apart and centred: a triangle that tightens as it shrinks
    const rowBox = (i) => {
      const sz = ROWS.size[i] * CH.h;
      const cy = CH.y + ROWS.y[i] * CH.h;
      return { y: cy - sz / 2, h: sz, sz, cy };
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
        // the row being read: a soft pale-amber band, fill only (the card's "now"), the row's height and a little
        const bh = b.sz + 0.03 * CH.h;
        const bx = CH.x + 0.05 * CH.w;
        const bw = 0.9 * CH.w;
        if (now) s(turn ? "polygon" : "rect", turn ? { points: quad(bx, b.cy - bh / 2, bw, bh), fill: "#fdeccb" } : { x: bx, y: b.cy - bh / 2, width: bw, height: bh, rx: Math.min(14, bh / 3), fill: "#fdeccb" }, rowsG);
        // judged: the gold tick in the side margin, level with the row (never over the pictures, no outline)
        if (done) {
          const [cx, cy] = Q(CH.x + ROWS.tick * CH.w, b.cy);
          CHECK(cx, cy, Math.max(8, 0.032 * CH.w), rowsG);
        }
        c.pics.forEach((id, k) => {
          // a wider board spreads its rows across it (CLN-188): the pitch grows with the board's width for its height
          const px0 = CH.x + CH.w / 2 + (k - (c.pics.length - 1) / 2) * b.sz * ROWS.pitch * Math.max(1, CH.w / CH.h / 0.66);
          const z = b.sz * kAt(px0);
          const [px, py] = Q(px0, b.cy);
          const im = s("image", { href: url(BY[id].icon), x: px - z / 2, y: py - z / 2, width: z, height: z, opacity: done || now || !cur() || cur().kind !== "read" || cur().row < i ? 1 : 0.85 }, rowsG);
          im.dataset.lex = BY[id].lex;
        });
      });
    };
    drawChart();

    // the judging pills, under the chart: the shared answer pills (UX 15), one pill style everywhere
    const judgeBox = S.h("div", "hs-judge", S.root);
    const NB = root.NjgButtons;
    const yesNo = { yes: HS.L.w(HS.L.yesId()).kutchi, no: HS.L.w(HS.L.noId()).kutchi };
    // CLN-152 (contract-21): the shared pills wire their own taps: each one is handed to the game, logged as an act
    const pills = NB ? NB.pills(judgeBox, [{ id: "yes", html: yesNo.yes }, { id: "no", html: yesNo.no }], (id) => (ctx.act && ctx.act(), onJudge(id === "yes"))) : null;
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
      if (!on) return;
      // a new row to judge: the pills are live at once, even on the pill just pressed for the row before (contract-21)
      if (pills && pills.fresh) pills.fresh();
      placeJudge();
    };
    showJudge(false);

    const judge = (id, ok, detail) => {
      if (id in st.judged) return;
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    // s08 w6N fix (the eye test stuck on 4:3-3:2 tablets): the tablet's close-up crop starts at x 50, and since CLN-188
    // moved her picture left her open eye (x 33) sat off the play area, under the side card: the redrop could not be
    // tapped. The test's view takes in her whole open eye where the close-up's would cut it (the board a little smaller
    // there, still most of the play area); the close-up's own crop comes back with the close-up
    const vbOf = () => (S.svg.getAttribute("viewBox") || "0 0 800 500").split(/[\s,]+/).map(Number);
    const camera = (safe) => {
      const a = vbOf();
      S.setSafe(safe);
      const b = vbOf();
      S.svg.setAttribute("viewBox", a.join(" "));
      return (u) => S.svg.setAttribute("viewBox", a.map((v, k) => (v + (b[k] - v) * u).toFixed(1)).join(" "));
    };
    // (only the tablet crops to its safe area: phones and laptops show the whole drawing and its margins already)
    const testSafe = () => (tablet && readEye && readEye.x - 48 < SAFE[0] ? [readEye.x - 48, SAFE[1]] : null);
    const toTest = async () => {
      // the camera pulls back from the eyes to the test (a cross-fade; the art batch makes it a cut, art plan 2.1)
      st.busy = true;
      showDropper(null);
      lightMini(false);
      S.tools([], null);
      const wide = testSafe();
      const cam = wide ? camera(wide) : null;
      await tween(450, (u) => {
        dropsG.setAttribute("opacity", 1 - u);
        testG.setAttribute("opacity", u);
        if (cam) cam(u);
      });
      if (cam) cam(1);
      st.view = "test";
      st.busy = false;
    };
    // CLN-107: a line of hers starts only once the one before it is said (a quick judgement opens the next row while
    // she still reads this one: its words would otherwise be heard under the next line)
    const after = (prev, fn) => Promise.resolve(prev).catch(() => {}).then(() => (st.gone ? null : fn()));
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
        await (st.reading = after(st.reading, () => ctx.say(line, { who: "patient", noBubble: true })));
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
        // CLN-107 (the judge: at L1 the wrong pill never turned red): both pills are live under the help's light; the
        // ghost taps the right one, a tap on the other shakes red as at L2-L3
        S.cue("read", Object.assign({}, CUES.read, { also: [c.wrong ? haaBtn : naBtn] }), c.wrong ? naBtn : haaBtn);
      }
      // CLN-107: her reading is kept, so the next line (the doctor naming the row, her "I can see!") starts only when
      // her words are said: a line plays only its own words' clips, never under another line
      st.reading = after(st.reading, () => ctx.say(line, { who: "patient", noBubble: true })).then(() => S.face("neutral"));
    };
    // her bubble under her mouth (the eye test): the anchor below her mouth on the left panel
    const mouthAt = () => (readEye ? { x: readEye.x + (version === "A" ? 40 : 10), y: readEye.y + (version === "A" ? 92 : 70) } : null);
    const mouthSay = (text) => {
      S.root.querySelectorAll(".eye-said").forEach((n) => n.remove());
      const m = mouthAt();
      if (!m) return;
      const el = S.h("div", `eye-said${text ? "" : " talk"}`, S.root, text || "");
      if (!text) {
        el.innerHTML = '<i></i><i></i><i></i>';
        // ART-18 (contract-14): the talking dots move by the one shared talk animation (Lifecycle.talk), each a beat apart
        const T = root.Lifecycle && root.Lifecycle.talk;
        if (T) el.querySelectorAll("i").forEach((d) => T.dom(d));
      }
      const c = S.client(m.x, m.y);
      const rr = S.root.getBoundingClientRect();
      el.style.left = `${c.x - rr.left}px`;
      el.style.top = `${c.y - rr.top}px`;
      ctx.after(text ? (fast() ? 120 : 1200) : fast() ? 120 : 2200, () => el.classList.add("fade"));
      ctx.after(text ? (fast() ? 300 : 2000) : fast() ? 300 : 2800, () => el.remove());
    };
    // EY13: a wrong judgement: the doctor (his box, off screen) names the row with its pictures, said aloud
    // CLN-107 (the judge: at the misread "no doctor bubble naming the row in pictures"): his bubble stays up until the
    // row is judged again or read again after the drop (unName), never gone a beat after his line; his line waits for
    // her reading to end (her clips never play under his words)
    const unName = () => S.root.querySelectorAll(".eye-name").forEach((n) => n.remove());
    const nameRow = async (i) => {
      const c = P.chart[i];
      unName();
      const el = S.h("div", "eye-name", S.root);
      el.dataset.row = String(i);
      // his own face at the bubble's start: it is the doctor (off screen) naming the row, by his card in the sidebar
      if (Kit0 && Kit0.doctorFace) {
        const f = S.h("img", "eye-name-face", el);
        f.alt = "";
        f.src = Kit0.doctorFace("neutral");
      }
      c.pics.forEach((id) => {
        const im = S.h("img", null, el);
        im.alt = "";
        im.src = url(BY[id].icon);
      });
      const line = HS.L.show(HS.L.join(c.pics.flatMap((id, k) => (k ? [",", BY[id].lex] : [BY[id].lex]))));
      // his line joins her lines' chain: after her reading, and her re-read after it
      await (st.reading = after(st.reading, () => ctx.say(line, { who: "doctor", noBubble: true })));
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
        // his bubble with the row's pictures is up at once and his line follows her reading; the child never waits
        // for it (rule 12): the pills stay live, or (a misread) the dropper comes as soon as the shake is seen
        nameRow(i);
        ctx.after(fast() ? 200 : 600, () => b.classList.remove("nope-red"));
        if (!wrong) return;
        st.busy = true;
        await new Promise((r) => ctx.after(fast() ? 120 : 550, r));
        st.busy = false;
        if (st.over || st.gone) return;
        // CLN-107 (EY13: "a misread gets a drop and a right re-read before the tick"): she misread and the child said
        // haa: the doctor names the row (his bubble stays up), and the dropper comes for her eye, as after a na
        {
          st.awaiting = null;
          showJudge(false);
          S.said(null);
          drawChart();
          st.redrop = { i };
          showDropper(readEye, true, HANG.redrop);
          S.cue("redrop", CUES.redrop, { x: readEye.x, y: readEye.y - tipOf(HANG.redrop) / 2, r: 52 });
        }
        return;
      }
      unName(); // judged right this time: the doctor's naming bubble goes
      st.awaiting = null;
      showJudge(false);
      S.said(null);
      drawChart();
      if (!saysRight) {
        // CLN-62: the dropper hangs over the eye and pulses: one tap, then they read the row again
        st.redrop = { i };
        showDropper(readEye, true, HANG.redrop);
        S.cue("redrop", CUES.redrop, { x: readEye.x, y: readEye.y - tipOf(HANG.redrop) / 2, r: 52 });
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
      unName();
      st.i++;
      const c = cur();
      if (!c) return finish();
      open();
    };
    // EY6 (CLN-107): from level 2 a "to the eye test" button bottom right like every other stage's (a picture of the
    // chart, no words), never a flashing chart in the corner. CLN-107 (the judge: no button in the close-up): it is
    // there from the moment the drops' close-up opens, so the way on is seen; it goes on once a drop is in
    const makeTestBtn = () => {
      if (testBtn) return testBtn;
      testBtn = ctx.button("", () => {
        if (st.busy || st.over || !cur() || cur().kind !== "drops" || st.drops < 1) return;
        S.did();
        testBtn.remove();
        closeDrops();
      }, "eye-btn"); // CLN-143 (decision 95): no glow: the card's row is the one thing lit (the ✓'s rule, SH-40)
      testBtn.dataset.go = "eye test";
      const t = testBtn.querySelector(".njg-next-t") || testBtn;
      t.textContent = "";
      t.insertAdjacentHTML("beforeend", '<svg class="eye-btn-chart" viewBox="0 0 40 52" aria-hidden="true"><rect x="2" y="2" width="36" height="48" rx="5" fill="#fffefb" stroke="#a9824d" stroke-width="3"/><circle cx="20" cy="12" r="4.6" fill="#e2b23b"/><circle cx="14.5" cy="23.5" r="3.7" fill="#d9534f"/><circle cx="25.5" cy="23.5" r="3.7" fill="#5aa05a"/><circle cx="11" cy="33.5" r="3" fill="#8a5a3a"/><circle cx="20" cy="33.5" r="3" fill="#e2b23b"/><circle cx="29" cy="33.5" r="3" fill="#d9534f"/><circle cx="9.5" cy="42" r="2.4" fill="#5aa05a"/><circle cx="16.5" cy="42" r="2.4" fill="#8a5a3a"/><circle cx="23.5" cy="42" r="2.4" fill="#e2b23b"/><circle cx="30.5" cy="42" r="2.4" fill="#d9534f"/></svg>');
      return testBtn;
    };
    const open = async () => {
      const c = cur();
      drawChart();
      if (c.kind === "drops") {
        if (P.level >= 2) makeTestBtn();
        ctx.card.now(c.both ? "drops-right" : "drops", c.strip ? { strip: c.strip } : {});
        const te = c.both ? EY.right : sore; // CLN-187: from level 2 the first row's eye (the patient's right)
        return S.cue("drops", CUES.drops, () => S.toolEls.drops, { target: { x: te.x, y: te.y - 55, r: 110 } }); // S02-G: the dropper and the eye
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
      if (c.both) {
        // CLN-187: each eye's count is its own row (recorded for the review)
        ["right", "left"].forEach((sd) => {
          judge(`drops-${sd}`, st.n[sd] === c.both[sd], `${st.n[sd]} of ${c.both[sd]}`);
          ctx.card.tick(`drops-${sd}`);
        });
        eyeCounts.forEach((b) => b.remove());
      } else {
        judge("drops-count", st.drops === c.count, `${st.drops} of ${c.count}`);
        ctx.card.tick("drops");
      }
      S.uncue();
      advance();
    };
    const finish = async () => {
      st.over = true;
      S.uncue();
      showJudge(false);
      showDropper(null);
      ctx.card.tick("chart");
      ctx.card.now(null);
      // CLN-62 (P88: "then the game just ended… weird"): after the last row she looks up from the chart, both eyes open
      // and clear, happy, and says "I can see!"; only then the pull-out and the end screen
      S.root.querySelectorAll(".eye-said, .eye-name").forEach((n) => n.remove());
      // CLN-107 (the voice log: "I can see!" over mum/dungri-rc.mp3): her last row's reading ends before she says it
      await Promise.resolve(st.reading).catch(() => {});
      if (st.gone) return;
      if (soreEl) soreEl.setAttribute("opacity", eyesArt ? 1 : 0);
      const cam = camera(null); // the close-up's own crop again
      await tween(450, (u) => {
        testG.setAttribute("opacity", 1 - u);
        dropsG.setAttribute("opacity", u);
        cam(u);
      });
      cam(1);
      st.view = "drops";
      S.face("happy");
      blink();
      const said = S.say("eye-better", "patient");
      await Promise.race([Promise.resolve(said).catch(() => {}), new Promise((r) => ctx.after(fast() ? 1200 : 4000, r))]);
      await new Promise((r) => ctx.after(900, r));
      if (st.gone) return;
      ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words });
    };

    // CLN-186: the re-cut bottle in the strip too (data art.drop.tool)
    S.tools([{ id: "drops", glyph: "💧", img: (DA && DA.tool) || "assets/clinic/items-v2/eye-drops.webp" }], (id) => {
      if (id === "drops" && cur() && cur().kind === "drops") showDropper(sore, false);
    });
    // S03 (review flaw 5) moved the tablet's shelf, then centred on the right over the sore eye, down to the cheek. The
    // shared shelf now hangs under her face circle (SH-112), clear of both eyes, and the cheek's corner is the "to the
    // eye test" button's from the close-up's start (CLN-107): there it hid the dropper at L2+ (the s08 w6N tablet
    // stall). The shelf keeps its shared place on every screen
    const dropIn = async (at, hang) => {
      await fallDrop(at, hang);
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
        dropIn(readEye, HANG.redrop).then(() => {
          showDropper(null);
          st.busy = false;
          readRow(i, true);
        });
        return;
      }
      if (c.kind !== "drops") return;

      if (S.sel !== "drops") return;
      const sd = eyeAt(p);
      if (!sd) return;
      const eye = EY[sd];
      st.drops++;
      st.n[sd]++;
      if (c.both) {
        // CLN-187: the dropper goes to the eye tapped; each eye keeps its own count beside it (the count's shared look:
        // its word at L2, dots from L3), and the card's lit row follows the eye still short of its count
        if (dropperAt !== eye) showDropper(eye, false);
        const short = ["right", "left"].find((x) => st.n[x] < c.both[x]);
        if (short && short !== st.nowEye) ctx.card.now(`drops-${(st.nowEye = short)}`, c.strip ? { strip: c.strip } : {});
        // (a new lit row clears the host's counts: both eyes' are drawn again after it)
        ["right", "left"].forEach((x) => (x === sd || st.n[x] > 0) && countEye(x, x === sd));
      } else {
        ctx.tally("drops", st.drops);
        if (ctx.level >= 3) S.count(st.drops);
      }
      dropIn(eye);
      const k = st.n[soreSide];
      if (sd === soreSide && soreEl && eyesArt) soreEl.setAttribute("opacity", Math.min(1, 0.34 * k));
      else if (sd === soreSide && soreEl) soreEl.setAttribute("opacity", Math.max(0.08, 0.55 - 0.18 * k));
      // D5 (1 Oct, SH-38): at level 1 the row turns gold at the count and the step closes by itself
      if (P.level === 1 && st.drops >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), closeDrops, 900, "drops");
      // EY6 (CLN-107): from level 2, once a drop is in, a "to the eye test" button comes up bottom right like every
      // other stage's (a picture of the chart, no words), never a flashing chart in the corner
      if (P.level >= 2 && !st.testCued) {
        makeTestBtn();
        st.testCued = true;
        if (!c.both) S.cue("chart", CUES.chart, testBtn);
      }
      // CLN-187: with a count for each eye, the first-time help points at the eye test only once both eyes have theirs
      if (c.both && testBtn && !st.chartCued && ["right", "left"].every((x) => st.n[x] >= c.both[x])) {
        st.chartCued = true;
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
        /** the "I can see" moment is on screen (CLN-62: the sandbox shoots it) */
        get seeing() {
          return st.over && st.view === "drops";
        },
        /** the redrop is up: the dropper over her open eye (CLN-62) */
        get redrop() {
          return !!st.redrop;
        },
        /** TEST HOOK (CLN-62; read-only): the hanging dropper's bottle, client px ({left, top, width, height}), or null */
        dropper() {
          if (!dropperAt || dropper.getAttribute("opacity") === "0") return null;
          const r = (dropper.querySelector("image") || dropper).getBoundingClientRect();
          return r.width > 0 ? { left: r.left, top: r.top, width: r.width, height: r.height } : null;
        },
        /** TEST HOOK (CLN-62; read-only): the sore eye, client px: the close-up's sore eye, or her open eye in the eye test */
        soreEye() {
          const e = st.view === "test" ? readEye : sore;
          if (!e) return null;
          const h = st.view === "test" ? { rx: 30, ry: 20 } : { rx: 92, ry: 54 }; // the eye's half size, svg units
          const a = S.client(e.x - h.rx, e.y - h.ry);
          const b = S.client(e.x + h.rx, e.y + h.ry);
          return { left: a.x, top: a.y, width: b.x - a.x, height: b.y - a.y };
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
          if (c.kind === "drops" && c.both) {
            // CLN-187: each eye to its own count (the patient's right first), then the eye test
            const sd = ["right", "left"].find((x) => st.n[x] < c.both[x]);
            if (sd) return S.sel !== "drops" ? tool("drops") : Object.assign({ do: "tap", what: `drop ${sd}` }, S.client(EY[sd].x, EY[sd].y - 34 - 60));
            if (!testBtn) return { do: "wait" };
            const r = testBtn.getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: "eyetest" };
          }
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
    levels: [1, 2, 3, 4], // L4: up to four pictures a row (Zafar, 13 Oct)
    plan,
    mount,
    bot,
    why: WHY,
    cues: CUES,
    steps: (level, rng) => plan(level, rng).steps.map((x) => x.kind),
    // CLN-189: the chart's pictures by word (the colour check reads them: build/test_shared_heal_chart.mjs)
    chartPictures: THINGS.map((t) => ({ lex: t.lex, icon: t.icon })),
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
