/*
 * H-foot: the sole of the foot (D15i, decision 27; the 1 Oct report §8H; CLN-64, CLN-40, CLN-47).
 *
 * Why: "Ow, something's in my foot!" / "Let's take the splinters out."
 * 1. Soak: the doctor says which water (paani [hot] / [cold] / [lukewarm]) and how many jugs; pick the jug, then pour
 *    it on the foot, that many times: each press is one jug, and its water washes off only the dirt it passes over,
 *    as the scrape's wash (CLN-190; L1 closes at the count, D5; from L2 the next action closes it, D7).
 * 2. The splinters, seen on the sole (toes up, the leg off the bottom): each sits in a lighter channel that runs with
 *    square turns to the edge of the foot. Drag the splinter along its channel; touching the side is an "ow": it
 *    slides back to the last turn and is a scored hand-skill mistake (the "steady" row).
 *    L1 one straight channel; L2 three, from three toes, three turns each, the toes named for the order (pela [big
 *    toe], ne poi ...: the Kutchi decides it); L3 the same, heard only; L4 the channels narrower (Zafar, 13 Oct).
 * 3. A plaster on each spot.
 * Sides are said and tested in the diagnosis only (D10): one sore foot here. The channels are drawn in code over
 * the art plan's sole (P1, closeups/<set>/sole.webp, swapped in by file name when it exists).
 * Rows: the soak (which water, how many jugs), the toe order from L2, and the steady hand (a skill row: no words).
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const TEMPS = ["hot", "cold", "lukewarm"];
  // the water's word by id (G26): Mum's garam and thundo; lukewarm is a data entry to record
  const TEMP_ID = { hot: "feel-hot", cold: "feel-cold", lukewarm: "feel-lukewarm" };
  // Zafar (13 Oct, the heal ladder): each level adds one thing, all by level 2; level 3 only closes the card; harder
  // variety at level 4. So the toe order (the toes named, three splinters) is level 2's new thing, level 3 is level 2
  // heard only, and the narrow channels (level 3's until now) are level 4's
  const K = { jugs: { 1: [1, 2, 3, 4, 5], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5], 4: [2, 3, 4] }, halfW: { 1: 30, 2: 25, 3: 25, 4: 19 }, slackPx: 8, len: 44 };
  const ORDER = 2;
  const TOES = ["big toe", "middle toe", "little toe"];
  const TOE_ID = { "big toe": "cl-big-toe", "middle toe": "foot-middle-toe", "little toe": "cl-little-toe" };
  const WHY = { problem: "foot-why", goal: "foot-goal" }; // line keys in data/clinic/heal/foot.json (the engine says them)
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    soak: { gesture: "tap", then: { gesture: "drag" } }, // CLN-190: pick the jug, then pour it over the foot (the scrape's wash)
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
    const L = Math.max(1, Math.min(4, level));
    const temp = HS.pick(TEMPS, rng);
    const jugs = HS.pick(K.jugs[L], rng);
    const flip = rng() < 0.5;
    const set = HS.pick(L >= ORDER ? PATHS[3] : PATHS[1], rng); // the toe channels from level 2 (PATHS[2]: the two unnamed splinters, unused since)
    const splinters = set.map((q, i) => {
      const raw = Array.isArray(q) ? q : q.pts;
      const pts = flip ? mirror(raw) : raw.map((p) => p.slice());
      return { id: `s${i}`, toe: q.toe || null, pts, lens: lens(pts), turns: pts.length - 2 };
    });
    const order = L >= ORDER ? HS.shuffle(TOES, rng) : null;
    // words, numbers and joins from data through the seam (R5)
    const Lg = HS.L;
    const say = (m, o) => Lg.show(m, o);
    const steps = [{ id: "soak", kind: "soak", temp, jugs, row: Object.assign({ id: "soak", seq: "steps" }, say(Lg.join([Lg.item("cook-paani"), Lg.item(TEMP_ID[temp]), ",", Lg.item("cl-jugs", { n: jugs })]), { cap: true })) }];
    // the toe order (L3) is a sequence on the card (13h): pela [big toe], ne poi ...
    const pullRows = order ? order.map((t, i) => Object.assign({ id: `pull${i}`, seq: "steps" }, say(Lg.step(i, TOE_ID[t], { lower: true })))) : null;
    steps.push({ id: "pull", kind: "pull", order, row: pullRows ? pullRows[0] : Object.assign({ id: "pull", seq: "steps" }, say(Lg.item("cl-splinters"), { cap: true })), rows: pullRows });
    steps.push({ id: "plaster", kind: "plaster", row: Object.assign({ id: "plaster", seq: "steps" }, say(Lg.item("cl-plaster"), { cap: true })) });
    // CLN-160: the soak, the toes and the plaster are one sequence on the card (the toe order's own "toes" key made a second box at level 3)
    const rows = [
      { id: "soak-water", options: TEMPS, answer: temp, placeholder: true },
      { id: "soak-jugs", options: K.jugs[L], answer: jugs },
    ];
    if (order) rows.push({ id: "toe-order", seq: TOES, answer: order, placeholder: true });
    rows.push({ id: "pull-steady", skill: true }); // the hand: no words in it, so every player can get it
    const words = [Lg.w("cook-paani"), Lg.num(jugs), Lg.w(TEMP_ID[temp]), Lg.w("cl-splinters")];
    if (order) words.push(Lg.w("lnk-pela"), Lg.w("lnk-nepoi"), Lg.w("cl-big-toe"), Lg.w("foot-middle-toe"), Lg.w("cl-little-toe"));
    return { level: L, steps, rows, words, splinters, flip, halfW: K.halfW[L] };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    // CLN-118 (D13): the taught round is shown by the ghost finger and scores nothing; SH-99, CLN-161 (Zafar, 18 Oct: "it needed me to press the cloth twice, but it wasn't in the instructions ... all the frequencies has to be written down. And audible as well"; reverses CLN-118): the taught first round writes and says every count too, and its word review keeps the number words
    if (ctx.taught) P.words = HS.taughtWords(P.words).concat(P.words.filter((w) => w && w.n != null));
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
    const IMG = "assets/clinic/items-v2/";

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
    const splG = s("g", {}, S.layer);
    const chanG = s("g", { "clip-path": `url(#${clipId})` }, S.layer);
    // the welts' open ends stop at the photo foot's own edge (its alpha as a mask; the stand-in's outline is wider)
    if (art) {
      const fm = `${clipId}-sole`;
      const m = s("mask", { id: fm, maskUnits: "userSpaceOnUse", x: -2000, y: -2000, width: 5000, height: 5000, style: "mask-type: alpha" }, defs);
      const im = art.cloneNode();
      im.setAttribute("opacity", 1);
      m.appendChild(im);
      chanG.setAttribute("mask", `url(#${fm})`);
    }
    const chanFill = HS.shade ? HS.shade(sole, 0.45) : "#f6e2cc";
    const gripG = s("g", {}, S.layer);
    // CLN-193 (Zafar, 18 Oct: "an irritated raised red translucent channel and you see the splinter traveling inside of
    // it"; "a repeatable, very tileable visual block ... and the splinter as well"): the s08b SP1 pieces laid along each
    // path in code (data art.channel: the straight block repeated, the elbow at each turn, the closed end at the
    // splinter's spot), see-through over the splinter; the open end runs off past the foot's edge (the sole's clip)
    const CA = ART.channel && ART.channel.straight && ART.channel.corner && ART.channel.end ? ART.channel : null;
    const Wb = P.halfW * 2;
    const url = (u) => (Kit ? Kit.url(u) : u);
    const tile = CA ? (() => {
      const T = CA;
      const sb = T.straightBand; // the straight block's band: [first row, last row, first col, last col, w, h] in its px
      const ks = Wb / (sb[1] - sb[0]);
      const pid = `fo-chan-${Math.floor(Math.random() * 1e9)}`;
      const y0 = -((sb[0] + sb[1]) / 2) * ks; // the band centred on the path
      // one block's length covers the longest segment and its round ends (stretched, never repeated: no seam on a run)
      let longest = 0;
      P.splinters.forEach((q) => q.pts.forEach((pt, k) => k && (longest = Math.max(longest, Math.hypot(pt[0] - q.pts[k - 1][0], pt[1] - q.pts[k - 1][1])))));
      const kx = Math.max(ks, (longest + 4 * Wb) / (sb[3] - sb[2]));
      const pat = s("pattern", { id: pid, patternUnits: "userSpaceOnUse", x: (-Wb * 1.5).toFixed(2), y: y0.toFixed(2), width: ((sb[3] - sb[2]) * kx).toFixed(2), height: (sb[5] * ks).toFixed(2) }, defs);
      s("image", { href: url(T.straight), x: (-sb[2] * kx).toFixed(2), y: 0, width: (sb[4] * kx).toFixed(2), height: (sb[5] * ks).toFixed(2), preserveAspectRatio: "none" }, pat);
      const cb = T.cornerBox; // the elbow: [centre x, centre y, arm width, w, h] in its px (arms up and right)
      const kc = Wb / cb[2];
      const cid = `fo-elbow-${Math.floor(Math.random() * 1e9)}`;
      const cc = s("clipPath", { id: cid, clipPathUnits: "userSpaceOnUse" }, defs);
      const m = cb[2] / 2 + 12;
      s("rect", { x: 0, y: cb[1] - m, width: cb[0] + m, height: cb[4] - (cb[1] - m) }, cc);
      const eb = T.endBox; // the closed end: [cap centre x, centre y, band width, w, h] in its px (the cap at its right)
      const ke = Wb / eb[2];
      const eid = `fo-cap-${Math.floor(Math.random() * 1e9)}`;
      const ec = s("clipPath", { id: eid, clipPathUnits: "userSpaceOnUse" }, defs);
      s("rect", { x: eb[0] - 1.35 * eb[2], y: 0, width: eb[3] - (eb[0] - 1.35 * eb[2]), height: eb[4] }, ec);
      return { ks, pid, kc, cid, cb, ke, eid, eb, h: sb[5] * ks, y0 };
    })() : null;
    // each piece is turned (a quarter turn, and flipped across its own length if need be) to point the way the path goes
    // while its painted light stays from the upper left, as in every other picture (so no joint shows a lit edge meeting
    // a shaded one): orient(the piece's own directions, the ones wanted) -> {d: degrees, f: 1 or -1 (flip)}
    const LIGHT = [-1, -1];
    const turnV = (v, d, f) => {
      const r = (d * Math.PI) / 180;
      const x = v[0];
      const y = v[1] * f;
      return [Math.round(x * Math.cos(r) - y * Math.sin(r)), Math.round(x * Math.sin(r) + y * Math.cos(r))];
    };
    const same = (u, v) => u[0] === v[0] && u[1] === v[1];
    const orient = (own, want, light) => {
      let best = null;
      [0, 90, 180, 270].forEach((dd) => [1, -1].forEach((f) => {
        const got = own.map((v) => turnV(v, dd, f));
        const ok = want.length === 1 ? same(got[0], want[0]) : (same(got[0], want[0]) && same(got[1], want[1])) || (same(got[0], want[1]) && same(got[1], want[0]));
        if (!ok) return;
        const l = turnV(light, dd, f);
        const score = l[0] * LIGHT[0] + l[1] * LIGHT[1];
        if (!best || score > best.score) best = { d: dd, f, score };
      }));
      return best || { d: 0, f: 1 };
    };
    const featherId = `fo-feather-${Math.floor(Math.random() * 1e9)}`;
    if (CA) s("feGaussianBlur", { stdDeviation: (Wb * (CA.feather || 0.1)).toFixed(2) }, s("filter", { id: featherId, filterUnits: "userSpaceOnUse", x: -400, y: -400, width: 1600, height: 1400 }, defs));
    const dirOf = (A, B) => [Math.sign(Math.round(B[0] - A[0])), Math.sign(Math.round(B[1] - A[1]))];
    const layChannel = (q, g, op) => {
      const pts = q.pts;
      // the welt's own edge, feathered: a soft mask along the path (round at the turns), CA.welt of the channel's width: the
      // raised red line and a little skin either side show, never the blocks' square ends or their own skin-coloured flanks
      const mid = `fo-welt-${Math.floor(Math.random() * 1e9)}`;
      const mk = s("mask", { id: mid, maskUnits: "userSpaceOnUse", x: -400, y: -400, width: 1600, height: 1400 }, defs);
      const n = pts.length;
      const un = dirOf(pts[n - 2], pts[n - 1]);
      const ext = pts.map((p) => p.slice());
      ext[n - 1] = [pts[n - 1][0] + un[0] * Wb * 2, pts[n - 1][1] + un[1] * Wb * 2];
      s("path", { d: pathD(ext), fill: "none", stroke: "#fff", "stroke-width": (Wb * (CA.welt || 0.72)).toFixed(1), "stroke-linejoin": "round", "stroke-linecap": "round", filter: `url(#${featherId})` }, mk);
      const cg = s("g", { opacity: op, mask: `url(#${mid})` }, g);
      // one continuous welt (the orchestrator's look, 19 Oct: "no visible joins anywhere"): only the straight block, one
      // piece a segment, each under its own soft round-ended mask (as the whole path's, but for that segment alone), so
      // where two meet at a turn they fade into each other with a round outer corner; no elbow or end block is pasted
      // over them, and one block is stretched over the longest segment, so no block joins another along a run
      for (let k = 0; k < n - 1; k++) {
        const A = pts[k];
        const B = pts[k + 1];
        const u = dirOf(A, B);
        const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
        const a0 = k === 0 ? -Wb * 0.2 : 0;
        const a1 = k === n - 2 ? L + Wb * 2 : L;
        const sid = `${mid}-s${k}`;
        const sm = s("mask", { id: sid, maskUnits: "userSpaceOnUse", x: -400, y: -400, width: 1600, height: 1400 }, defs);
        s("path", { d: `M${(A[0] + u[0] * a0).toFixed(1)} ${(A[1] + u[1] * a0).toFixed(1)} L${(A[0] + u[0] * a1).toFixed(1)} ${(A[1] + u[1] * a1).toFixed(1)}`, fill: "none", stroke: "#fff", "stroke-width": (Wb * (CA.welt || 0.72) * 1.05).toFixed(1), "stroke-linecap": "round", filter: `url(#${featherId})` }, sm);
        // the straight block runs along +x, lit from its top
        const o = orient([[1, 0]], [u], [0, -1]);
        const pg = s("g", { mask: `url(#${sid})` }, cg);
        const sg = s("g", { transform: `translate(${A[0]} ${A[1]}) rotate(${o.d}) scale(1 ${o.f})` }, pg);
        s("rect", { x: (-Wb).toFixed(1), y: tile.y0.toFixed(1), width: (L + 3 * Wb).toFixed(1), height: tile.h.toFixed(1), fill: `url(#${tile.pid})` }, sg);
      }
      return cg;
    };
    // FT2 (CLN-108): the sole is dirty and the dirt hides the splinters; each jug's water washes some of it away, and the
    // last jug of the count shows them all (no water rising over the foot: no flooding)
    const dirtG = s("g", { "clip-path": `url(#${clipId})`, class: "fo-dirt" }, S.layer);
    const plG = s("g", {}, S.layer);
    const fxG = s("g", {}, S.fx);
    const dirt = [];
    {
      // I1 (s07-clinic-a): a soft bit of dust or grit (heal-v3/dirt-<n>), never a flat disc; the same four draws as the
      // disc's (its size, its squash, its colour, its opacity), so the game's other draws don't move
      const blob = (x, y, r) => {
        const w = r * (0.8 + ctx.rng() * 0.5) * 2.6;
        const hh = w * (0.7 + ctx.rng() * 0.3);
        const n = 1 + Math.floor(ctx.rng() * 8);
        const op = (0.8 + ctx.rng() * 0.2).toFixed(2);
        const href = Kit ? Kit.url(`assets/clinic/heal-v3/dirt-${n}.webp`) : `assets/clinic/heal-v3/dirt-${n}.webp`;
        dirt.push({ x, y, el: s("image", { href, x: (x - w / 2).toFixed(1), y: (y - hh / 2).toFixed(1), width: w.toFixed(1), height: hh.toFixed(1), preserveAspectRatio: "none", opacity: op, class: "fo-dirt-bit" }, dirtG) });
      };
      // thick over every splinter's spot and its channel, so it's hidden until washed
      P.splinters.forEach((q) => q.pts.forEach((pt, k) => k < 3 && [0, 1, 2, 3].forEach(() => blob(pt[0] + (ctx.rng() - 0.5) * 50, pt[1] + (ctx.rng() - 0.5) * 50, 20 + ctx.rng() * 12))));
      for (let k = 0; k < 40; k++) blob(200 + ctx.rng() * 400, 80 + ctx.rng() * 380, 8 + ctx.rng() * 14);
    }
    const washDirt = (share) => {
      const left = dirt.filter((d) => !d.gone);
      const n = share >= 1 ? left.length : Math.min(left.length, Math.ceil(dirt.length * share));
      HS.shuffle(left, ctx.rng).slice(0, n).forEach((d) => {
        d.gone = true;
        d.el.animate([{ opacity: d.el.getAttribute("opacity"), transform: "translate(0,0)" }, { opacity: 0, transform: "translate(0px, 30px)" }], { duration: fast() ? 60 : 600, fill: "forwards" });
      });
    };
    // CLN-190 (Zafar, 18 Oct: "the animation for clearing the foot is terrible ... a colored, coded jet"; "like the
    // plaster one ... you have to put the cursor over specific parts of the dirt and the water clears off those parts"):
    // the scrape's wash. The jug picked tilts over the finger and its water (clear, whatever its warmth) falls where the
    // finger is; only the dirt under it washes off, running down
    const wetG = s("g", { "clip-path": `url(#${clipId})`, class: "fo-wet-g" }, fxG); // the wash's wet path, on the sole only
    const pourJug = s("image", { width: 104, height: 108, opacity: 0, class: "fo-jug" }, fxG);
    const streamG = s("g", { opacity: 0 }, fxG);
    const streamW = s("path", { fill: "none", stroke: "rgba(170,214,240,.55)", "stroke-width": 13, "stroke-linecap": "round" }, streamG);
    const streamC = s("path", { fill: "none", stroke: "rgba(255,255,255,.75)", "stroke-width": 3.5, "stroke-linecap": "round" }, streamG);
    const WASH_R = 44; // svg units round the water's point that it washes
    const washAt = (p, temp) => {
      pourJug.setAttribute("href", Kit ? Kit.url(`${IMG}jug-${temp}.webp`) : `${IMG}jug-${temp}.webp`);
      pourJug.setAttribute("x", p.x + 16);
      pourJug.setAttribute("y", p.y - 168);
      pourJug.setAttribute("transform", `rotate(-38 ${p.x + 68} ${p.y - 114})`);
      pourJug.setAttribute("opacity", 1);
      const d = `M${p.x + 22} ${p.y - 126} Q${p.x + 5} ${p.y - 68} ${p.x} ${p.y}`;
      streamW.setAttribute("d", d);
      streamC.setAttribute("d", d);
      streamG.setAttribute("opacity", 1);
      let hit = 0;
      dirt.forEach((q) => {
        if (q.gone || Math.hypot(q.x - p.x, q.y - p.y) > WASH_R) return;
        q.gone = true;
        hit++;
        // (s08 w6I, CLN-190: the judge saw no dirt clear where the water fell): the bit runs off at its own pace in the fast
        // test mode too, so a filmstrip of the sweep shows the dirt going where the water passes
        q.el.animate([{ transform: "translate(0,0)", opacity: q.el.getAttribute("opacity") }, { transform: `translate(${(q.x - p.x) * 0.5}px, 30px)`, opacity: 0 }], { duration: 480, fill: "forwards" });
      });
      if (!st.splashT || Date.now() - st.splashT > 260) {
        st.splashT = Date.now();
        // the water meeting the sole: a soft clear ring and a few drops thrown off
        const sp = s("ellipse", { cx: p.x, cy: p.y, rx: 10, ry: 6, fill: "rgba(200,230,248,.35)", stroke: "rgba(255,255,255,.8)", "stroke-width": 2.5 }, fxG);
        sp.animate([{ rx: 10, ry: 6, opacity: 1 }, { rx: hit ? 40 : 28, ry: hit ? 22 : 15, opacity: 0 }], { duration: fast() ? 60 : 420, fill: "forwards" });
        ctx.after(fast() ? 80 : 460, () => sp.remove());
      }
      return hit;
    };
    // CLN-190 (s08 w6H; the judge: "nothing shows the wash moving over and clearing particular bits of dirt"): a quick
    // sweep washes everything on its way (every few units between two finger positions, never only where the finger
    // was sampled), and the water leaves a wet sheen along its path that dries in under a second
    const washLine = (p, temp) => {
      const a = st.washFrom;
      st.washFrom = { x: p.x, y: p.y };
      if (!a) return washAt(p, temp);
      const n = Math.max(1, Math.ceil(Math.hypot(p.x - a.x, p.y - a.y) / 16));
      let hit = 0;
      for (let k = 1; k <= n; k++) hit += washAt({ x: a.x + ((p.x - a.x) * k) / n, y: a.y + ((p.y - a.y) * k) / n }, temp);
      const wet = s("path", { d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${p.x.toFixed(1)} ${p.y.toFixed(1)}`, fill: "none", stroke: "rgba(205,232,250,.5)", "stroke-width": 26, "stroke-linecap": "round", class: "fo-wet" }, wetG);
      if (wet.animate) wet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fast() ? 80 : 900, fill: "forwards" });
      ctx.after(fast() ? 100 : 950, () => wet.remove());
      return hit;
    };
    const endPour = () => {
      st.washFrom = null;
      st.pouring = false;
      pourJug.setAttribute("opacity", 0);
      streamG.setAttribute("opacity", 0);
    };
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
    const chanEls = {};
    const draw = () => {
      if (!tile) S.clear(chanG);
      S.clear(splG);
      S.clear(plG);
      const c = cur();
      S.clear(gripG);
      P.splinters.forEach((q) => {
        // the laid channels are made once and kept (draw runs on every move of the finger): shown, dimmed or gone
        const lc = tile && (chanEls[q.id] || (chanEls[q.id] = layChannel(q, chanG, 1)));
        if (lc) lc.style.display = st.pulled.includes(q.id) ? "none" : "";
        if (st.pulled.includes(q.id)) return;
        const pulling = c && c.kind === "pull";
        if (lc) lc.setAttribute("opacity", pulling ? CA.opacity || 0.8 : (CA.opacity || 0.8) * 0.75);
        else {
          // the lighter channel to the edge (square turns), a darker rim so the sides read
          const d = pathD(q.pts);
          s("path", { d, fill: "none", stroke: edge, "stroke-width": P.halfW * 2 + 6, "stroke-linejoin": "miter", "stroke-linecap": "butt", opacity: pulling ? 0.6 : 0.3 }, chanG);
          s("path", { d, fill: "none", stroke: chanFill, "stroke-width": P.halfW * 2, "stroke-linejoin": "miter", "stroke-linecap": "butt", opacity: pulling ? 0.95 : 0.6 }, chanG);
        }
        // the splinter: from its head (the progress point) back along the channel; the head is what you hold
        const t = st.prog[q.id];
        const h = at(q, t);
        if (CA && CA.splinter) {
          // SP1's splinter, its broken end at the head (pulled out first), its point back down the channel
          const tl = at(q, t - K.len);
          const len = Math.max(8, Math.hypot(tl.x - h.x, tl.y - h.y)) * 1.25;
          const th = len / (CA.splinterAspect || 5.2);
          const ang = (Math.atan2(tl.y - h.y, tl.x - h.x) * 180) / Math.PI;
          s("image", { href: url(CA.splinter), x: (-len * 0.08).toFixed(1), y: (-th / 2).toFixed(1), width: len.toFixed(1), height: th.toFixed(1), transform: `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) rotate(${ang.toFixed(1)})`, preserveAspectRatio: "none" }, splG);
        } else {
          const tail = [];
          for (let k = 0; k <= 8; k++) tail.push(at(q, t - (k / 8) * K.len));
          s("path", { d: tail.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" "), fill: "none", stroke: "#6a3e1e", "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round" }, splG);
          s("circle", { cx: h.x, cy: h.y, r: 9, fill: "#8a5a2a", stroke: "#fff", "stroke-width": 2 }, splG);
        }
        if (pulling) s("circle", { class: "fo-grip", cx: h.x, cy: h.y, r: 16, fill: "#ffe27a", opacity: 0.5 }, gripG);
        // CLN-82 (s08 w8B, "stuck after jugs"): from level 2 the soak closes by taking hold of a splinter, so once the
        // jugs' count is reached the splinters are the next thing: the host's reveal lights them (controller.nextUp), as
        // it lights the next tool in the other games (the next row first, then this). Every splinter, never the first toe
        // alone: which toe comes first is the Kutchi's to tell (the leak test, C10)
        else if (st.nextUp && c && c.kind === "soak") s("circle", { class: "fo-grip fo-next", cx: h.x, cy: h.y, r: 22, fill: "#ffe27a", opacity: 0.6 }, gripG);
      });
      P.splinters.forEach((q) => {
        const sp = { x: q.pts[0][0], y: q.pts[0][1] };
        if (st.plasters[q.id]) {
          // CLN-191 (Zafar, 18 Oct: "It should be the photorealistic plaster that's in the item box"): the strip's own plaster
          const pw = 84;
          s("image", { href: url(IMG + "plaster-skin.webp"), x: sp.x - pw / 2, y: sp.y - pw / 4.4, width: pw, height: pw / 2.2, preserveAspectRatio: "xMidYMid meet" }, plG);
        } else if (st.pulled.includes(q.id) && c && c.kind === "plaster") s("circle", { cx: sp.x, cy: sp.y, r: 18, fill: "none", stroke: "#2e8b7a", "stroke-width": 4, "stroke-dasharray": "5 4" }, plG);
        else if (st.pulled.includes(q.id)) s("circle", { cx: sp.x, cy: sp.y, r: 6, fill: "#d9546a" }, plG);
      });
    };
    draw();
    // CLN-194: everything on the foot in one group, so a touch on the channel's edge shakes it all a little
    const shakeG = s("g", { class: "fo-shake" }, S.layer);
    [...S.layer.childNodes].filter((n) => n !== shakeG).forEach((n) => shakeG.appendChild(n));
    const flashId = `fo-flash-${Math.floor(Math.random() * 1e9)}`;
    const fl = s("radialGradient", { id: flashId }, defs);
    s("stop", { offset: 0, "stop-color": "#e2453c", "stop-opacity": 0.55 }, fl);
    s("stop", { offset: 1, "stop-color": "#e2453c", "stop-opacity": 0 }, fl);

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
      if (c.kind === "soak") S.cue("soak", CUES.soak, S.toolEls["jug-" + c.temp], { gesture: "drag", target: { x: 400, y: 190, r: 90 }, to: { x: 400, y: 400, r: 90 } });
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
        washDirt(1); // the soak is over: the last of the dirt rinses off and the splinters show
        // CLN-82 (s08 w8B): the jug is put down with the soak (the splinters are taken by the finger: its ring stayed lit)
        S.sel = null;
        Object.values(S.toolEls).forEach((b) => b.classList.remove("sel"));
        st.nextUp = false;
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
        // CLN-190: a press on a splinter the water has already washed clean takes hold of it (a press on dirt pours)
        const clean = (h) => !dirt.some((d) => !d.gone && Math.hypot(d.x - h.x, d.y - h.y) < 30);
        if (P.splinters.some((x) => Math.hypot(p.x - at(x, st.prog[x.id]).x, p.y - at(x, st.prog[x.id]).y) < grab && clean(at(x, st.prog[x.id])))) {
          close();
          c = cur();
        }
      }
      if (c.kind === "soak") {
        if (!/^jug-/.test(S.sel || "")) return;
        if (Math.hypot((p.x - 400) / 1.4, p.y - 300) > 260) return;
        const t = S.sel.slice(4);
        st.temp = st.temp && st.temp !== t ? "mixed" : t;
        // CLN-190: each press is one jug poured; its water washes what it passes over until the finger lifts
        st.jugs++;
        S.count(st.jugs);
        ctx.tally(S.sel, st.jugs, { next: "splinter", of: c.jugs }); // S02-A hook: decision 52, the next step shows at L2+
        // D5 (SH-38): at level 1 the row turns gold at the count and the step closes by itself (once that jug is poured)
        if (P.level === 1 && st.jugs >= c.jugs) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy && !st.pouring), close, 600, c.id);
        // FT2: never "until it's clean" (the count is the words', C10): the rest rinses off when the soak closes
        st.pouring = t;
        if (S.svg.setPointerCapture) try { S.svg.setPointerCapture(e.pointerId); } catch (err) { /* a synthetic pointer */ }
        st.washFrom = null;
        washLine(p, t);
        S.face(t === "hot" ? "hot" : t === "cold" ? "cold" : "happy", 600);
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
      if (st.pouring) {
        const c = cur();
        if (!c || c.kind !== "soak") return endPour();
        washLine(S.pt(e), st.pouring);
        return;
      }
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
        // CLN-194 (Zafar, 18 Oct: "the foot should vibrate a little and it should say ow ... a little red flash"): the
        // whole foot shakes a little and a soft red glow comes and goes where the channel was touched
        const h = at(q, t0);
        const ow = s("circle", { cx: h.x, cy: h.y, r: P.halfW * 2.6, fill: `url(#${flashId})`, opacity: 0 }, fxG);
        if (ow.animate) ow.animate([{ opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 0 }], { duration: fast() ? 120 : 520, fill: "forwards" });
        ctx.after(fast() ? 150 : 560, () => ow.remove());
        const still = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (shakeG.animate && !still) shakeG.animate([0, -7, 6, -4, 2, 0].map((x) => ({ transform: `translate(${x}px, 0px)` })), { duration: fast() ? 120 : 360 });
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
        const e3 = at(q, total(q) - K.len);
        // CLN-193: the splinter itself flies off (its picture), never a drawn stick
        const fl = Math.hypot(e3.x - e2.x, e3.y - e2.y) * 1.25;
        const fly = CA && CA.splinter
          ? s("image", { href: url(CA.splinter), x: 0, y: (-fl / (CA.splinterAspect || 5.2) / 2).toFixed(1), width: fl.toFixed(1), height: (fl / (CA.splinterAspect || 5.2)).toFixed(1), preserveAspectRatio: "none", transform: `translate(${e2.x.toFixed(1)} ${e2.y.toFixed(1)}) rotate(${((Math.atan2(e3.y - e2.y, e3.x - e2.x) * 180) / Math.PI).toFixed(1)})` }, s("g", {}, fxG)).parentNode
          : s("line", { x1: e2.x, y1: e2.y, x2: e3.x, y2: e3.y, stroke: "#6a3e1e", "stroke-width": 8, "stroke-linecap": "round" }, fxG);
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
    const up = () => {
      drag = null;
      if (st.pouring) endPour();
    };
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
      // CLN-82 (s08 w8B): the host's "what's next" reveal (decision 52) for a next thing that is no tool: "splinter" lights
      // the splinters and puts the jug down (its ring read as still lit: one thing lit at a time, decision 95); null: off
      nextUp(t) {
        const on = t === "splinter";
        if (on === !!st.nextUp) return;
        st.nextUp = on;
        if (on && /^jug-/.test(S.sel || "")) {
          S.sel = null;
          Object.values(S.toolEls).forEach((b) => b.classList.remove("sel"));
        }
        draw();
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
            if (st.jugs < c.jugs) {
              if (S.sel !== "jug-" + c.temp) return tool("jug-" + c.temp);
              // CLN-190: one jug is one sweep, through its share of the dirt that's left (top to bottom)
              // s08-w6c (the gate's stuck clinic:patient at 1024x768): only dirt a finger can reach; a bit under the tool
              // column (the sole runs on under it on a narrow screen) is pressed on a tool, so no jug is poured
              // s08 w6I (the gate's stuck clinic:patient at 1180x820 and 1366x1024): a bit of dirt 6 px left of the tiles was
              // "reachable" by its centre, then every press landed on the picked tile (its selection ring): a finger's width
              // all round must be the foot's, and only dirt on the sole counts (bits past its edge are clipped away: nobody
              // sees them, and the soak's close rinses them off)
              const pad = 18;
              const onSvg = (x, y) => {
                const el = root.document.elementFromPoint(x, y);
                return !!el && S.svg.contains(el);
              };
              const onSole = (d) => {
                try {
                  // the clip's shapes carry the mirror themselves: test in their own (unmirrored) units
                  const pt = new root.DOMPoint(P.flip ? 800 - d.x : d.x, d.y);
                  return [...clip.children].some((sh) => sh.isPointInFill(pt));
                } catch (e) {
                  return true;
                }
              };
              const reach = (d) => {
                const cl = S.client(d.x, d.y);
                return onSole(d) && [[0, 0], [pad, 0], [-pad, 0], [0, pad], [0, -pad]].every(([dx, dy]) => onSvg(cl.x + dx, cl.y + dy));
              };
              const left = dirt.filter((d) => !d.gone && reach(d)).sort((a, b) => a.y - b.y);
              const share = left.slice(0, Math.max(1, Math.ceil(left.length / (c.jugs - st.jugs))));
              // (the first jug starts where the first-time help lights the foot; s08 w6I, CLN-190: the first sweep began on a
              // clean spot, so its first frames showed no dirt going: it starts on the bit of dirt nearest the lit spot when
              // one is inside the help's light, and with no help on screen on the first bit of its share)
              const helpUp = !!(root.Onboard && root.Onboard.active && root.Onboard.active());
              const lit = left.filter((d) => Math.hypot(d.x - 400, d.y - 190) < 80).sort((a, b) => Math.hypot(a.x - 400, a.y - 190) - Math.hypot(b.x - 400, b.y - 190))[0];
              const start = st.jugs === 0 && helpUp ? (lit ? [lit] : reach({ x: 400, y: 190 }) ? [{ x: 400, y: 190 }] : []) : [];
              const way = start.concat(share.filter((d) => d !== lit).length ? share.filter((d) => d !== lit) : start.length ? [] : [{ x: 400, y: 300 }]);
              const pts = way.map((d) => {
                const cl = S.client(d.x, d.y);
                return [cl.x, cl.y];
              });
              if (pts.length < 2) pts.push([pts[0][0] + 4, pts[0][1] + 2]);
              return { do: "drag", pts, steps: 3, what: "pour" };
            }
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
    levels: [1, 2, 3, 4], // L4: the narrow channels (Zafar, 13 Oct: harder variety from level 4)
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
