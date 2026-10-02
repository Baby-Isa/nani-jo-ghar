/*
 * H-ear (clinic v3: D15c, decision 27; the 1 Oct report § 8H, P31-P39): a big ear, full of wax.
 * A PROTOTYPE close-up (the side of the head, the ear big in the middle, drawn in the patient's own colours) with
 * stand-ins; the art batch's E1 and O1/O3 swap in by file name (data/clinic/heal/ear.json art).
 *
 * Why: "My ear feels blocked." / "Let's clean it."
 * 1. The wax: the ear is FULL from the start (CLN-50: shown, never a surprise); drag each blob out to the tissue
 *    (one gesture, no tweezers pick first: P32). Taking one out makes 0, 1 or 2 more pop out of the canal (random,
 *    fewer as the ear empties, capped): the fun (KEEP-10). From level 2 the big and the small one go out in the
 *    order said (pela wadho, ne poi nindho, or the other way round); the others are middling.
 * 2. The cotton bud WIPES the wax smears the blobs left, without touching the sore pink skin (a drag-erase: P33,
 *    CLN-46): a touch on the pink makes the patient wince (a hand-skill row, never a verdict mid-round).
 * 3. N drops (counted).
 * 4. Can you hear me? (data flag `hearing.on`, D15c): the doctor whispers a word the child knows from Cook (said
 *    through the seam, a family voice, never written) and the child taps its picture for the patient.
 * Rows (the Kutchi decides): which blob first (from L2), the drops count, the whispered word; the wipe is a skill row.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const K = {
    drops: { 1: [1, 2, 3, 4], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5] },
    start: { 1: 3, 2: 4, 3: 5 }, // blobs in the ear at the start (big and small among them from L2)
    spawnCap: { 1: 3, 2: 5, 3: 7 }, // how many more can pop out in all
    smears: { 1: 3, 2: 4, 3: 5 }, // the first blobs out leave a smear each, for the bud
    sore: { 1: 1, 2: 2, 3: 3 }, // sore pink patches the bud must miss
    budR: 20, // the bud's tip, svg units
  };
  // D15c: the whispered-word check. Words the child knows from Cook (lexicon ids in data/clinic/lang.json; their
  // pictures are Cook's icons). The data file can switch it off (hearing.on) or change the words.
  const HEAR = { on: true, words: ["fru-02", "veg-02", "veg-03", "cook-paani"], choices: { 1: 3, 2: 3, 3: 4 } };
  const hearDefaults = () => {
    // Node (the leak bot): the same flag as the game, from the data file
    if (typeof require === "function" && typeof __dirname === "string" && !(root.Clinic && root.Clinic.Kit)) {
      try {
        const d = JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "..", "..", "..", "..", "data", "clinic", "heal", "ear.json"), "utf8"));
        return Object.assign({}, HEAR, d.hearing || {});
      } catch (e) {
        /* the defaults */
      }
    }
    return HEAR;
  };
  const WHY = { problem: "My ear feels blocked.", goal: "Let's clean it." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice); one gesture
  // per thing (P32): the wax is a drag, the wipe a drag, the drops a tap, the check a tap
  const CUES = {
    wax: { gesture: "drag" },
    wipe: { gesture: "tap", then: { gesture: "drag" } },
    drops: { gesture: "tap", then: "tap" },
    hear: { watch: true },
  };
  const EAR = { x: 390, y: 250 };
  const CANAL = { x: 382, y: 268 };
  const TISSUE = { x: 630, y: 392, r: 62 };
  // where blobs can sit: the bowl round the canal, the fold above it, the groove inside the rim, the lobe
  const SPOTS = [
    [372, 240], [410, 262], [352, 290], [400, 300], [330, 210], [428, 220], [446, 296], [318, 266], [372, 180], [420, 168],
    [460, 250], [300, 330], [346, 340], [452, 340], [392, 352], [298, 190],
  ];
  const R = { big: 32, small: 13, mid: [19, 23] };

  function plan(level, rng, o = {}) {
    const L = Math.max(1, Math.min(3, level));
    const H = Object.assign({}, hearDefaults(), o.hearing || {});
    const bigFirst = rng() < 0.5;
    const order = bigFirst ? ["big", "small"] : ["small", "big"];
    const drops = HS.pick(K.drops[L], rng);
    const Lg = HS.L; // words, numbers and joins from data through the seam (R5)
    const say = (m, opts) => Lg.show(m, opts);
    const waxRow = (i) => say(Lg.step(i, i === 0 ? Lg.item("cl-wax", { size: order[0] }) : Lg.item(Lg.sizeId(order[1])), { lower: true }));
    // 13j: level 1 has no size words (just take the wax out); big and small start at level 2
    const steps = [
      L === 1
        ? { id: "wax", kind: "wax", order: null, row: Object.assign({}, Lg.w("ear-wax-out"), { id: "wax" }) }
        : { id: "wax", kind: "wax", order, row: Object.assign({ id: "wax0", seq: "wax" }, waxRow(0)), rows: [Object.assign({ id: "wax0", seq: "wax" }, waxRow(0)), Object.assign({ id: "wax1", seq: "wax" }, waxRow(1))] },
      { id: "wipe", kind: "wipe", row: Object.assign({ id: "wipe" }, say(Lg.then("cl-cotton-bud"))) },
      { id: "drops", kind: "drops", count: drops, row: Object.assign({ id: "drops" }, say(Lg.join([Lg.then("cl-drops"), ",", Lg.count(drops)]))) },
    ];
    const rows = [
      ...(L === 1 ? [] : [{ id: "wax-order", options: [["big", "small"], ["small", "big"]], answer: order }]),
      { id: "wipe-gentle", options: [true, false], answer: true, skill: true },
      { id: "drops-count", options: K.drops[L], answer: drops },
    ];
    let hear = null;
    if (H.on && H.words && H.words.length >= 2) {
      const n = Math.min(H.words.length, (H.choices && H.choices[L]) || 3);
      const choices = HS.shuffle(H.words, rng).slice(0, n);
      const word = HS.pick(choices, rng);
      hear = { word, choices };
      steps.push({ id: "hear", kind: "hear", word, choices, row: Object.assign({}, Lg.w("ear-hear-q"), { id: "hear" }) });
      rows.push({ id: "hear-word", options: choices, answer: word });
    }
    const words = (L === 1 ? [] : [Lg.w("lnk-pela"), Lg.w("ph-big"), Lg.w("ph-small")]).concat([Lg.w("lnk-nepoi"), Lg.num(drops), HS.ph("ear"), HS.ph("wax")]);
    if (hear) words.push(Object.assign(Lg.w(hear.word), { id: hear.word }));
    return { level: L, steps, rows, words, hear };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng, { hearing: (ctx.data && ctx.data.hearing) || {} });
    const S = HS.make(stage, ctx, { place: "head", game: "ear" });
    const { s } = S;
    const Kit = root.Clinic && root.Clinic.Kit;
    const url = (u) => (Kit && Kit.url ? Kit.url(u) : u);
    const fast = () => !!(Kit && Kit.fast);
    const st = { i: 0, out: [], drops: 0, judged: {}, over: false, busy: false, drag: null, spawned: 0, removed: 0, wiping: false, sore: 0, soreT: 0 };
    const cur = () => P.steps[st.i] || null;
    const rowsOf = (x) => x.rows || [x.row];
    ctx.card.setRows(rowsOf(P.steps[0])); // D8: one step at a time; the wax order is a sequence (13h)

    /* ---- the side of the head, the ear big in the middle (CLN-50, P39: "a bigger ear") ---- */
    const defs = s("defs", {}, S.svg);
    const uid = Math.floor(ctx.rng() * 1e6);
    const wax = s("radialGradient", { id: `ear-wax-${uid}`, cx: 0.35, cy: 0.32, r: 0.75 }, defs);
    s("stop", { offset: "0", "stop-color": "#fbe39a" }, wax);
    s("stop", { offset: "0.45", "stop-color": "#e2ad36" }, wax);
    s("stop", { offset: "1", "stop-color": "#a8711a" }, wax);
    const skinG = s("radialGradient", { id: `ear-skin-${uid}`, cx: 0.45, cy: 0.4, r: 0.7 }, defs);
    s("stop", { offset: "0", "stop-color": S.skinLight }, skinG);
    s("stop", { offset: "0.7", "stop-color": S.skin }, skinG);
    s("stop", { offset: "1", "stop-color": S.skinDark }, skinG);
    const head = s("g", { class: "ear-head" }, S.layer);
    // the head runs off the top, right and bottom: it reads as part of the person (CLN-43)
    s("path", { d: "M150 -300 L1500 -300 L1500 800 L560 800 Q540 640 600 560 L250 560 Q150 470 150 300Z", fill: S.skin }, head);
    s("path", { d: "M560 800 Q540 640 600 560 Q700 520 1500 520 L1500 800Z", fill: S.skinDark, opacity: 0.25 }, head); // the jaw's shade
    // the hair over the top and the back of the head, and a sideburn in front of the ear
    s("path", { d: `M150 -300 L1500 -300 L1500 40 Q900 30 620 60 Q520 76 470 110 Q330 70 230 120 Q180 160 168 260 L150 300Z`, fill: S.hairCol }, head);
    s("path", { d: "M488 100 Q520 120 516 196 Q504 170 480 150Z", fill: S.hairCol }, head);
    // the ear: the rim (helix) a big "C", the fold inside, the bowl round the canal, the lobe
    const E = EAR;
    s("path", { d: `M${E.x + 60} ${E.y - 150} C${E.x - 70} ${E.y - 175} ${E.x - 150} ${E.y - 60} ${E.x - 120} ${E.y + 60} C${E.x - 100} ${E.y + 120} ${E.x - 60} ${E.y + 150} ${E.x - 30} ${E.y + 180} C${E.x} ${E.y + 215} ${E.x + 60} ${E.y + 205} ${E.x + 70} ${E.y + 150} C${E.x + 76} ${E.y + 116} ${E.x + 96} ${E.y + 92} ${E.x + 108} ${E.y + 40} C${E.x + 128} ${E.y - 50} ${E.x + 130} ${E.y - 140} ${E.x + 60} ${E.y - 150}Z`, fill: `url(#ear-skin-${uid})`, stroke: S.skinDark, "stroke-width": 5 }, head);
    s("path", { d: `M${E.x + 40} ${E.y - 120} C${E.x - 50} ${E.y - 130} ${E.x - 100} ${E.y - 40} ${E.x - 86} ${E.y + 40} C${E.x - 76} ${E.y + 100} ${E.x - 36} ${E.y + 130} ${E.x - 10} ${E.y + 150}`, fill: "none", stroke: S.skinDark, "stroke-width": 9, "stroke-linecap": "round", opacity: 0.55 }, head);
    s("ellipse", { cx: CANAL.x + 4, cy: CANAL.y - 4, rx: 74, ry: 88, fill: HS.shade(S.skin, -0.1) }, head); // the bowl
    s("ellipse", { cx: CANAL.x, cy: CANAL.y, rx: 26, ry: 34, fill: "#4a2219" }, head); // the canal
    S.closeup("ear", head);
    // the sore pink skin the bud must miss
    const soreG = s("g", { class: "ear-sore" }, S.layer);
    const sores = [];
    const SORE_SPOTS = [[350, 236], [420, 290], [338, 300], [416, 226], [380, 330]];
    HS.shuffle(SORE_SPOTS, ctx.rng)
      .slice(0, K.sore[P.level])
      .forEach(([x, y]) => {
        s("ellipse", { cx: x, cy: y, rx: 15, ry: 12, fill: "#f08a9a", opacity: 0.85 }, soreG);
        s("ellipse", { cx: x - 3, cy: y - 3, rx: 6, ry: 4, fill: "#ffc4cc", opacity: 0.8 }, soreG);
        sores.push({ x, y, r: 15 });
      });
    // the tissue beside the ear: where the wax goes
    const tissue = s("g", { class: "ear-tissue" }, S.layer);
    s("path", { d: `M${TISSUE.x - 58} ${TISSUE.y - 34} Q${TISSUE.x} ${TISSUE.y - 52} ${TISSUE.x + 58} ${TISSUE.y - 34} L${TISSUE.x + 50} ${TISSUE.y + 38} Q${TISSUE.x} ${TISSUE.y + 50} ${TISSUE.x - 50} ${TISSUE.y + 38}Z`, fill: "#fbfbf6", stroke: "#cfc6b6", "stroke-width": 3 }, tissue);
    s("path", { d: `M${TISSUE.x - 30} ${TISSUE.y - 8} Q${TISSUE.x} ${TISSUE.y + 4} ${TISSUE.x + 30} ${TISSUE.y - 8}`, fill: "none", stroke: "#e2dbcd", "stroke-width": 3 }, tissue);
    const onTissue = s("g", {}, S.layer);
    const smearG = s("g", { class: "ear-smears" }, S.layer);
    const waxG = s("g", { class: "ear-wax" }, S.layer);

    /* ---- the wax blobs ---- */
    const blobs = [];
    const freeSpot = () => {
      const taken = (x, y) => blobs.some((b) => !b.out && Math.hypot(b.x - x, b.y - y) < b.r + 26);
      const free = HS.shuffle(SPOTS, ctx.rng).filter(([x, y]) => !taken(x, y) && !sores.some((q) => Math.hypot(q.x - x, q.y - y) < 30));
      return free[0] || null;
    };
    const drawBlob = (b) => {
      if (b.el) b.el.remove();
      b.el = s("g", { class: `ear-blob ${b.size}`, "data-size": b.size }, waxG);
      s("circle", { cx: b.x, cy: b.y, r: b.r, fill: `url(#ear-wax-${uid})`, stroke: "#8a6010", "stroke-width": 2.5 }, b.el);
      s("ellipse", { cx: b.x - b.r * 0.35, cy: b.y - b.r * 0.38, rx: b.r * 0.3, ry: b.r * 0.2, fill: "#fff6d0", opacity: 0.8 }, b.el);
    };
    const addBlob = (size, at, pop) => {
      const spot = at || freeSpot();
      if (!spot) return null;
      const r = size === "big" ? R.big : size === "small" ? R.small : R.mid[0] + ctx.rng() * (R.mid[1] - R.mid[0]);
      const b = { id: blobs.length, size, x: spot[0], y: spot[1], r, out: false };
      blobs.push(b);
      drawBlob(b);
      if (pop && b.el.animate) {
        // it comes out of the canal: the child sees where more wax comes from (P38)
        b.el.animate([{ transform: `translate(${CANAL.x - b.x}px, ${CANAL.y - b.y}px) scale(.2)` }, { transform: "translate(0,0) scale(1.15)", offset: 0.7 }, { transform: "translate(0,0) scale(1)" }], { duration: fast() ? 120 : 420, easing: "ease-out" });
        b.el.style.transformBox = "fill-box";
        b.el.style.transformOrigin = "center";
      }
      return b;
    };
    // the ear full from the start (CLN-50): the big and the small one from level 2, the rest middling
    const startN = K.start[P.level];
    if (P.level >= 2) {
      addBlob("big");
      addBlob("small");
    }
    while (blobs.length < startN) addBlob("mid");
    const inEar = () => blobs.filter((b) => !b.out);
    // taking one out: 0, 1 or 2 more pop out (random; fewer as the cap nears; never a flood: E29)
    const spawnAfter = () => {
      const cap = K.spawnCap[P.level];
      const left = cap - st.spawned;
      if (left <= 0) return;
      const r = ctx.rng();
      const fill = st.spawned / cap; // fewer as the ear empties
      let k = r < 0.3 + 0.3 * fill ? 0 : r < 0.78 ? 1 : 2;
      k = Math.min(k, left);
      // the ear never stays empty while there's more to come early on: the first removal always brings one
      if (st.removed === 1 && k === 0) k = 1;
      for (let q = 0; q < k; q++) {
        ctx.after((fast() ? 60 : 260) + q * (fast() ? 60 : 240), () => {
          if (st.over || !cur() || cur().kind !== "wax") return;
          if (addBlob("mid", null, true)) {
            st.spawned++;
            ctx.sfx("pop");
            S.face("ouch", 400);
          }
        });
        st.pending = (st.pending || 0) + 1;
        ctx.after((fast() ? 80 : 300) + q * (fast() ? 60 : 240), () => (st.pending = Math.max(0, st.pending - 1)));
      }
    };

    /* ---- the smears the blobs leave, and the bud that wipes them ---- */
    const smears = [];
    const leaveSmear = (b) => {
      if (smears.length >= K.smears[P.level]) return;
      const pts = [];
      for (let q = 0; q < 6; q++) {
        const x = b.x + (ctx.rng() - 0.5) * 34;
        const y = b.y + (ctx.rng() - 0.5) * 22;
        pts.push({ x, y, el: s("ellipse", { cx: x.toFixed(1), cy: y.toFixed(1), rx: (6 + ctx.rng() * 4).toFixed(1), ry: (4 + ctx.rng() * 3).toFixed(1), fill: "#d9a42a", opacity: 0.75 }, smearG), gone: false });
      }
      smears.push({ pts });
    };
    const smearLeft = () => smears.reduce((a, q) => a + q.pts.filter((p) => !p.gone).length, 0);
    const bud = s("g", { class: "ear-bud", opacity: 0 }, S.fx);
    s("line", { x1: 0, y1: 0, x2: 120, y2: -90, stroke: "#f2f2f2", "stroke-width": 7, "stroke-linecap": "round" }, bud);
    s("line", { x1: 0, y1: 0, x2: 120, y2: -90, stroke: "#c9c9c9", "stroke-width": 1.5, "stroke-linecap": "round", opacity: 0.6 }, bud);
    const budTip = s("ellipse", { cx: 0, cy: 0, rx: 13, ry: 9, fill: "#ffffff", stroke: "#d8d2c4", "stroke-width": 2, transform: "rotate(-37)" }, bud);
    const wipeAt = (p) => {
      bud.setAttribute("transform", `translate(${p.x} ${p.y})`);
      bud.setAttribute("opacity", 1);
      let hit = 0;
      smears.forEach((q) =>
        q.pts.forEach((pt) => {
          if (pt.gone || Math.hypot(pt.x - p.x, pt.y - p.y) > K.budR) return;
          pt.gone = true;
          hit++;
          pt.el.animate([{ opacity: 0.75 }, { opacity: 0 }], { duration: 220, fill: "forwards" });
        })
      );
      if (hit) budTip.setAttribute("fill", "#f3dc8a");
      // the sore skin: a touch makes the patient wince (counted once per touch, a hand-skill row)
      const onSore = sores.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < q.r + 4);
      if (onSore && Date.now() - st.soreT > 700) {
        st.soreT = Date.now();
        st.sore++;
        S.face("wince", 700);
        ctx.log({ type: "extra", rowId: "wipe", detail: "touched the sore skin" });
      }
      const c = cur();
      if (c && c.kind === "wipe" && !smearLeft() && !st.busy) {
        st.busy = true;
        S.face("happy", 600);
        ctx.after(fast() ? 120 : 450, () => {
          st.busy = false;
          endWipe();
          if (cur() === c) close();
        });
      }
    };
    const endWipe = () => {
      st.wiping = false;
      bud.setAttribute("opacity", 0);
    };

    /* ---- steps ---- */
    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const bigOrSmall = () => blobs.find((b) => !b.out && (b.size === "big" || b.size === "small"));
    const open = () => {
      const c = cur();
      if (!c) return;
      if (st.i > 0) {
        rowsOf(c).forEach((r) => ctx.card.addRow(r));
        if (c.kind !== "hear") ctx.say(c.row);
      }
      ctx.card.now(c.kind === "wax" && c.rows ? "wax0" : c.id);
      if (c.kind === "wax") {
        const first = () => {
          const b = (c.order && blobs.find((q) => !q.out && q.size === c.order[0])) || inEar()[0];
          return b ? { x: b.x, y: b.y, r: b.r + 10 } : null;
        };
        S.cue("wax", Object.assign({ to: { x: TISSUE.x, y: TISSUE.y, r: 50 } }, CUES.wax), first);
      } else if (c.kind === "wipe") {
        if (!smears.length) return close(); // nothing left to wipe (never a dead step)
        const a = smears[0].pts[0];
        S.cue("wipe", CUES.wipe, S.toolEls.bud, { gesture: "drag", target: { x: a.x - 20, y: a.y }, to: { x: a.x + 20, y: a.y } });
      } else if (c.kind === "drops") S.cue("drops", CUES.drops, S.toolEls.drops, { x: CANAL.x, y: CANAL.y });
      else if (c.kind === "hear") startHear(c);
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "wax" && c.order) {
        const firstBS = st.out.find((k) => k === "big" || k === "small");
        judge("wax-order", firstBS === c.order[0], `first ${firstBS || "none"}`);
      }
      if (c.kind === "wipe") judge("wipe-gentle", st.sore === 0, st.sore ? `${st.sore} touches` : "gentle");
      if (c.kind === "drops") judge("drops-count", st.drops === c.count, `${st.drops} of ${c.count}`);
      if (c.kind !== "hear") ctx.card.tick(c.id);
      if (c.kind === "wax") S.used("tweezers");
      if (c.kind === "wipe") S.used("bud");
      if (c.kind === "drops") S.used("drops");
      S.count(null);
      st.i++;
      if (cur()) open();
      else finish();
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      S.face("happy");
      S.say("I can hear again!", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    /* ---- 4. can you hear me? (the whisper, then the pictures) ---- */
    let pics = null;
    const whisper = (c) => {
      const Lg = HS.L;
      const w = Lg.w(c.word);
      // the word alone, softly, in the doctor's (family) voice; never written: the task is hearing it (G22)
      ctx.say({ kutchi: w.kutchi, english: w.english, placeholder: w.placeholder }, { who: "doctor", noBubble: true, soft: true });
    };
    const startHear = (c) => {
      ctx.say(c.row);
      S.face("neutral");
      ctx.after(fast() ? 100 : 900, () => whisper(c));
      pics = S.h("div", "hs-pics", S.root);
      c.choices.forEach((id) => {
        const b = S.h("button", "hs-pic", pics);
        b.type = "button";
        b.dataset.word = id;
        b.setAttribute("aria-label", "picture");
        const im = S.h("img", null, b);
        im.alt = "";
        im.draggable = false;
        im.src = url(`assets/cook/items/icon-${id}.webp`);
        ctx.on(b, "click", (e) => {
          e.stopPropagation();
          if (st.over || cur() !== c) return;
          S.did();
          b.classList.add("picked");
          judge("hear-word", id === c.word, id);
          ctx.card.tick("hear");
          ctx.after(fast() ? 100 : 500, () => {
            if (pics) pics.remove();
            pics = null;
            close();
          });
        });
      });
      // no answer for a while: he whispers it again (a hint after hesitation, never the answer: E16)
      const again = () => {
        if (st.over || cur() !== c) return;
        whisper(c);
        ctx.after(7000, again);
      };
      ctx.after(7000, again);
    };

    /* ---- the tools: the v2 item art ---- */
    S.tools(
      [
        { id: "tweezers", img: "assets/clinic/items-v2/tweezers.webp" },
        { id: "bud", img: "assets/clinic/items-v2/cotton-buds.webp" },
        { id: "drops", img: "assets/clinic/items-v2/eye-drops.webp" },
      ],
      (id) => {
        if (st.over) return;
        const c = cur();
        // SH-40: the next tool closes a step that's done (the drops' count closes with ✓: nothing comes after it)
        if (id === "drops" && c && c.kind === "wipe" && !smearLeft()) close();
      }
    );

    /* ---- input ---- */
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready) return;
      const p = S.pt(e);
      const c = cur();
      if (!c || st.over || st.busy) return;
      if (c.kind === "wax") {
        // P32: one gesture: press on a blob and drag it out (the tweezers come with it)
        const b = HS.nearest(p, inEar(), 18);
        if (!b) return;
        if (S.sel !== "tweezers") S.pick("tweezers");
        st.drag = { b, el: s("g", { class: "ear-held" }, S.fx) };
        s("circle", { cx: 0, cy: 0, r: b.r, fill: `url(#ear-wax-${uid})`, stroke: "#8a6010", "stroke-width": 2.5 }, st.drag.el);
        s("image", { href: url("assets/clinic/items-v2/tweezers.webp"), x: -8, y: -60, width: 110, height: 52, transform: "rotate(-30)" }, st.drag.el);
        st.drag.el.setAttribute("transform", `translate(${p.x} ${p.y})`);
        b.el.setAttribute("opacity", 0.25);
        return;
      }
      if (c.kind === "wipe" && S.sel === "bud") {
        st.wiping = true;
        wipeAt(p);
        return;
      }
      if (c.kind === "drops" && S.sel === "drops" && Math.hypot(p.x - CANAL.x, p.y - CANAL.y) < 110) {
        st.drops++;
        S.count(st.drops);
        ctx.tally("drops", st.drops);
        // D5 (1 Oct, SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (ctx.level === 1 && st.drops >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 600);
        const bottle = s("image", { href: url("assets/clinic/items-v2/eye-drops.webp"), x: CANAL.x - 20, y: CANAL.y - 190, width: 46, height: 92 }, S.fx);
        const d = s("ellipse", { cx: CANAL.x, cy: CANAL.y - 90, rx: 7, ry: 10, fill: "#6bb7ea" }, S.fx);
        d.animate([{ transform: "translateY(0)" }, { transform: "translateY(90px)", opacity: 0.2 }], { duration: 420, fill: "forwards" });
        ctx.after(480, () => (d.remove(), bottle.remove()));
        S.face("ouch", 400);
        st.busy = true;
        ctx.after(fast() ? 60 : 250, () => (st.busy = false));
      }
    });
    ctx.on(S.svg, "pointermove", (e) => {
      const p = S.pt(e);
      if (st.drag) st.drag.el.setAttribute("transform", `translate(${p.x} ${p.y})`);
      else if (st.wiping) wipeAt(p);
    });
    const letGo = (e) => {
      if (st.wiping) endWipe();
      const g = st.drag;
      if (!g) return;
      st.drag = null;
      g.el.remove();
      const p = e && e.clientX != null ? S.pt(e) : { x: g.b.x, y: g.b.y };
      const b = g.b;
      if (Math.hypot(p.x - TISSUE.x, p.y - TISSUE.y) < TISSUE.r + 24) {
        // out: onto the tissue; it leaves a smear for the bud; more may pop out
        b.out = true;
        b.el.remove();
        st.removed++;
        st.out.push(b.size);
        s("circle", { cx: TISSUE.x - 34 + ctx.rng() * 68, cy: TISSUE.y - 14 + ctx.rng() * 30, r: Math.min(14, b.r * 0.6), fill: "#d9a42a", opacity: 0.85 }, onTissue);
        leaveSmear(b);
        ctx.sfx("pop");
        S.face("happy", 400);
        const c = cur();
        if (c && c.rows && (b.size === "big" || b.size === "small")) {
          const k = st.out.filter((x) => x === "big" || x === "small").length;
          ctx.card.tick(`wax${k - 1}`); // each part ticks as it's done (13c)
          if (k === 1) ctx.card.now("wax1");
        }
        spawnAfter();
        // the step ends when the ear is clear and nothing more is coming
        const check = () => {
          if (cur() !== c || st.over) return;
          if (inEar().length || st.pending) return ctx.after(150, check);
          close();
        };
        ctx.after(fast() ? 150 : 500, check);
      } else b.el.setAttribute("opacity", 1);
    };
    ctx.on(root.document || stage.ownerDocument, "pointerup", letGo);
    ctx.on(root.document || stage.ownerDocument, "pointercancel", () => letGo(null));
    // ✓: closes the counted drops (from level 2; at level 1 they close by themselves)
    const nextBtn = ctx.button(
      "✓",
      () => {
        const c = cur();
        if (!c || st.over) return;
        if (c.kind === "drops" && st.drops > 0) close();
      },
      "done"
    );
    nextBtn.setAttribute("aria-label", "Next");

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        open();
      },
      destroy() {
        if (pics) pics.remove();
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
          const at = (x, y, what) => Object.assign({ do: "tap", what }, S.client(x, y));
          if (c.kind === "wax") {
            const want = c.order && c.order.find((k) => !st.out.includes(k));
            const b = (want && blobs.find((q) => !q.out && q.size === want)) || inEar()[0];
            if (!b) return { do: "wait", ms: 120 };
            const a = S.client(b.x, b.y);
            const t = S.client(TISSUE.x, TISSUE.y);
            return { do: "drag", pts: [[a.x, a.y], [(a.x + t.x) / 2, (a.y + t.y) / 2], [t.x, t.y]], what: "wax " + b.size };
          }
          if (c.kind === "wipe") {
            if (S.sel !== "bud") return tool("bud");
            // one wipe through the smear that's left, stepping round the sore skin
            const left = [];
            smears.forEach((q) => q.pts.forEach((p) => !p.gone && left.push(p)));
            if (!left.length) return { do: "wait" };
            const sm = smears.find((q) => q.pts.some((p) => !p.gone));
            const pts = sm.pts.filter((p) => !p.gone).sort((a, b) => a.x - b.x).map((p) => {
              const q = S.client(p.x, p.y);
              return [q.x, q.y];
            });
            if (pts.length < 2) pts.push([pts[0][0] + 3, pts[0][1] + 1]);
            return { do: "drag", pts, steps: 3, what: "wipe" };
          }
          if (c.kind === "drops") {
            if (st.drops >= c.count) return { do: "button" };
            return S.sel !== "drops" ? tool("drops") : at(CANAL.x, CANAL.y, "drop");
          }
          if (c.kind === "hear") {
            const b = pics && pics.querySelector(`[data-word="${c.word}"]`);
            if (!b) return { do: "wait" };
            const r = b.getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: "picture" };
          }
          return { do: "wait" };
        },
        slip() {
          // one drop too many
          const c = cur();
          if (c && c.kind === "drops" && S.sel === "drops" && st.drops === c.count && !st.busy) return Object.assign({ do: "tap", what: "extra drop" }, S.client(CANAL.x, CANAL.y));
          return null;
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "ear",
    part: "ear",
    ailments: ["seed-in-ear"],
    items: ["torch", "tweezers", "cotton-bud", "drops"],
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
