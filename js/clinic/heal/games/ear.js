/*
 * H-ear (clinic v2, design sheets part B): wax blobs, the cotton bud, drops.
 * A PROTOTYPE on the CB6b close-up (a head close-up: the ear sits in the
 * upper half against the wall) with flat stand-ins.
 *
 * Why: "My ear feels blocked." / "Let's clean it."
 * 1. Take out the wax blobs with the tweezers: each is DRAGGED from the ear to the
 *    tissue beside it (13j, the same gesture at every level). Level 1 has no size
 *    words (two blobs alike, just take them out); from level 2 in the order said
 *    (pela wadho, ne poi nindho, or the other way round).
 *    From L2 more blobs keep popping up for a few seconds (up to a count) and STAY
 *    until each is dragged out (13j); the round ends when the ear is clear.
 * 2. Clean N times with the cotton bud.
 * 3. N drops.
 * Rows (the Kutchi decides): which blob first (from L2), the cleaning count, the drops count.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const K = {
    cleans: { 1: [2, 3, 4], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5] },
    drops: { 1: [1, 2, 3, 4], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5] },
    popMs: { 1: 0, 2: 5000, 3: 7000 },
    popEvery: { 2: 900, 3: 650 },
  };
  const WHY = { problem: "My ear feels blocked.", goal: "Let's clean it." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    wax: { gesture: "tap", then: { gesture: "drag" } },
    pop: { gesture: "drag" },
    clean: { gesture: "tap", then: "tap" },
    drops: { gesture: "tap", then: "tap" },
  };
  const EAR = { x: 400, y: 170 };
  // 13j: the wax is dragged out to a set place beside the ear (a tissue), the same gesture at every level
  const TISSUE = { x: 660, y: 270, r: 62 };
  const MAXPOPS = { 2: 5, 3: 7 }; // the pop-ups: how many come in all (the round ends when the ear is clear)

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const bigFirst = rng() < 0.5;
    const order = bigFirst ? ["big", "small"] : ["small", "big"];
    const cleans = HS.pick(K.cleans[L], rng);
    const drops = HS.pick(K.drops[L], rng);
    const kw = (x) => (x === "big" ? "wadho" : "nindho");
    // 13j: level 1 has no size words (just take the wax out); big and small start at level 2
    const steps = [L === 1
      ? { id: "wax", kind: "wax", order: null, row: { id: "wax", kutchi: "[The wax out]", english: "Take the wax out" } }
      : { id: "wax", kind: "wax", order, row: { id: "wax0", seq: "wax", kutchi: `pela ${kw(order[0])} [wax]`, english: `first the ${order[0]} wax` }, rows: [{ id: "wax0", seq: "wax", kutchi: `pela ${kw(order[0])} [wax]`, english: `first the ${order[0]} wax` }, { id: "wax1", seq: "wax", kutchi: `ne poi ${kw(order[1])}`, english: `then the ${order[1]} one` }] }];
    if (K.popMs[L]) steps.push({ id: "pop", kind: "pop", ms: K.popMs[L], max: MAXPOPS[L], row: { id: "pop", kutchi: null, english: "More wax!", placeholder: true } });
    steps.push({ id: "clean", kind: "clean", count: cleans, row: { id: "clean", kutchi: `[Cotton bud], ${HS.NUM[cleans]}`, english: `The cotton bud, ${cleans} times` } });
    steps.push({ id: "drops", kind: "drops", count: drops, row: { id: "drops", kutchi: `Ne poi [drops], ${HS.NUM[drops]}`, english: `Then the drops, ${drops}` } });
    const rows = [
      ...(L === 1 ? [] : [{ id: "wax-order", options: [["big", "small"], ["small", "big"]], answer: order }]),
      { id: "clean-count", options: K.cleans[L], answer: cleans },
      { id: "drops-count", options: K.drops[L], answer: drops },
    ];
    const words = (L === 1 ? [] : [{ kutchi: "pela", english: "first" }, { kutchi: "wadho", english: "big" }, { kutchi: "nindho", english: "small" }]).concat([{ kutchi: "ne poi", english: "and then" }, { kutchi: HS.NUM[cleans], english: String(cleans) }, { kutchi: HS.NUM[drops], english: String(drops) }, HS.ph("ear"), HS.ph("wax")]);
    return { level: L, steps, rows, words };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "head", game: "ear" });
    const { s } = S;
    const st = { i: 0, out: [], cleans: 0, drops: 0, judged: {}, over: false, busy: false, pops: [], popping: false, drag: null, hold: null };
    const cur = () => P.steps[st.i] || null;
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    ctx.card.setRows([].concat(...P.steps.filter((x) => x.kind !== "pop").map((x) => x.rows || [x.row]))); // the wax order is a sequence (13h)

    // the head from the side, the ear big in the middle, against the wall
    const head = s("g", {}, S.layer);
    // the side of the head: skin, the hair above and behind, the jaw below; the ear a "C" with a lobe
    s("rect", { x: EAR.x - 300, y: EAR.y - 170, width: 560, height: 340, rx: 140, fill: "#e2b08a" }, head);
    s("path", { d: `M${EAR.x - 300} ${EAR.y - 40} L${EAR.x - 300} ${EAR.y - 110} Q${EAR.x - 290} ${EAR.y - 175} ${EAR.x - 150} ${EAR.y - 175} L${EAR.x + 150} ${EAR.y - 175} Q${EAR.x + 260} ${EAR.y - 175} ${EAR.x + 260} ${EAR.y - 60} L${EAR.x + 260} ${EAR.y + 40} Q${EAR.x + 200} ${EAR.y - 120} ${EAR.x + 60} ${EAR.y - 130} L${EAR.x - 120} ${EAR.y - 130} Q${EAR.x - 230} ${EAR.y - 120} ${EAR.x - 300} ${EAR.y - 40}Z`, fill: "#3b2415" }, head);
    s("path", { d: `M${EAR.x + 30} ${EAR.y - 125} C${EAR.x + 150} ${EAR.y - 130} ${EAR.x + 160} ${EAR.y + 20} ${EAR.x + 90} ${EAR.y + 70} C${EAR.x + 60} ${EAR.y + 95} ${EAR.x + 70} ${EAR.y + 150} ${EAR.x + 20} ${EAR.y + 150} C${EAR.x - 30} ${EAR.y + 150} ${EAR.x - 40} ${EAR.y + 110} ${EAR.x - 60} ${EAR.y + 80} C${EAR.x - 100} ${EAR.y + 20} ${EAR.x - 90} ${EAR.y - 120} ${EAR.x + 30} ${EAR.y - 125}Z`, fill: "#eab893", stroke: "#b9845c", "stroke-width": 5 }, head);
    s("path", { d: `M${EAR.x + 60} ${EAR.y - 90} C${EAR.x + 120} ${EAR.y - 70} ${EAR.x + 110} ${EAR.y + 30} ${EAR.x + 60} ${EAR.y + 55}`, fill: "none", stroke: "#c98f64", "stroke-width": 8, "stroke-linecap": "round" }, head);
    s("ellipse", { cx: EAR.x, cy: EAR.y, rx: 44, ry: 56, fill: "#5a2e22" }, head);
    const dirt = s("ellipse", { cx: EAR.x, cy: EAR.y, rx: 44, ry: 56, fill: "#c9a24a", opacity: 0.5 }, head);
    const waxG = s("g", {}, S.layer);
    const BLOB = P.level === 1 ? { big: { x: EAR.x - 12, y: EAR.y - 12, r: 21 }, small: { x: EAR.x + 18, y: EAR.y + 26, r: 21 } } : { big: { x: EAR.x - 10, y: EAR.y - 10, r: 30 }, small: { x: EAR.x + 22, y: EAR.y + 30, r: 15 } };
    // the tissue beside the ear: where the wax goes
    const tissue = s("g", {}, S.layer);
    s("path", { d: `M${TISSUE.x - 58} ${TISSUE.y - 34} Q${TISSUE.x} ${TISSUE.y - 52} ${TISSUE.x + 58} ${TISSUE.y - 34} L${TISSUE.x + 50} ${TISSUE.y + 38} Q${TISSUE.x} ${TISSUE.y + 50} ${TISSUE.x - 50} ${TISSUE.y + 38}Z`, fill: "#fbfbf6", stroke: "#cfc6b6", "stroke-width": 3 }, tissue);
    s("path", { d: `M${TISSUE.x - 30} ${TISSUE.y - 8} Q${TISSUE.x} ${TISSUE.y + 4} ${TISSUE.x + 30} ${TISSUE.y - 8}`, fill: "none", stroke: "#e2dbcd", "stroke-width": 3 }, tissue);
    const onTissue = s("g", {}, S.layer);
    const drawWax = () => {
      S.clear(waxG);
      if (cur() && cur().kind !== "wax") return;
      ["big", "small"].forEach((k) => {
        if (st.out.includes(k) || st.hold === k) return;
        const b = BLOB[k];
        s("circle", { cx: b.x, cy: b.y, r: b.r, fill: "#d9a42a", stroke: "#8a6010", "stroke-width": 3 }, waxG);
        s("circle", { cx: b.x - b.r * 0.35, cy: b.y - b.r * 0.35, r: b.r * 0.28, fill: "#f6d680" }, waxG);
      });
    };
    drawWax();
    const popG = s("g", {}, S.layer);

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const TOOL_OF = { wax: "tweezers", pop: "tweezers", clean: "bud", drops: "drops" };
    const open = () => {
      const c = cur();
      if (c.kind !== "pop") ctx.card.now(c.id);
      drawWax();
      if (c.kind === "pop") startPop(c);
      if (c.kind === "wax") S.cue("wax", CUES.wax, S.toolEls.tweezers, { gesture: "drag", target: { x: BLOB.big.x, y: BLOB.big.y }, to: { x: TISSUE.x, y: TISSUE.y } });
      else if (c.kind === "pop") S.cue("pop", Object.assign({ to: { x: TISSUE.x, y: TISSUE.y } }, CUES.pop), () => (st.pops[0] ? { x: st.pops[0].x, y: st.pops[0].y } : { x: EAR.x, y: EAR.y }));
      else S.cue(c.kind, CUES[c.kind], S.toolEls[TOOL_OF[c.kind]], { x: EAR.x, y: EAR.y });
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "wax" && c.order) judge("wax-order", st.out[0] === c.order[0], `first ${st.out[0] || "none"}`);
      if (c.kind === "clean") judge("clean-count", st.cleans === c.count, `${st.cleans} of ${c.count}`);
      if (c.kind === "drops") judge("drops-count", st.drops === c.count, `${st.drops} of ${c.count}`);
      if (c.kind !== "pop") ctx.card.tick(c.id);
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

    // the calm whack-a-mole (13j): blobs keep popping up round the ear for the level's time (up to its count) and
    // STAY until the child drags each one out to the tissue; the round ends when the ear is clear
    const startPop = (c) => {
      st.popping = true;
      let n = 0;
      const t0 = Date.now();
      const spawn = () => {
        if (st.over || cur() !== c) return;
        if (Date.now() - t0 > c.ms * (fast() ? 0.5 : 1) || n >= (c.max || 6)) {
          st.popping = false;
          return endWhenClear();
        }
        const a = ctx.rng() * Math.PI * 2;
        const rr = 20 + ctx.rng() * 25;
        const p = { id: n++, x: EAR.x + Math.cos(a) * rr, y: EAR.y + Math.sin(a) * rr * 1.2, r: 13 + ctx.rng() * 8 };
        p.el = s("circle", { cx: p.x, cy: p.y, r: p.r, fill: "#d9a42a", stroke: "#8a6010", "stroke-width": 3 }, popG);
        p.el.style.transformBox = "fill-box";
        p.el.style.transformOrigin = "center";
        p.el.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 200 });
        st.pops.push(p);
        ctx.after(K.popEvery[P.level] * (fast() ? 0.5 : 1), spawn);
      };
      const endWhenClear = () => (st.pops.length || st.hold ? ctx.after(200, endWhenClear) : cur() === c && close());
      spawn();
    };
    // the drag: a blob (or a pop-up) follows the finger; let go on the tissue and it's out, anywhere else it goes back
    const grabAt = (p) => {
      const c = cur();
      if (!c || S.sel !== "tweezers") return null;
      if (c.kind === "pop") {
        const q = st.pops.find((x) => Math.hypot(p.x - x.x, p.y - x.y) < x.r + 16);
        return q ? { pop: q, x: q.x, y: q.y, r: q.r } : null;
      }
      if (c.kind !== "wax") return null;
      const k = ["big", "small"].find((q) => !st.out.includes(q) && Math.hypot(p.x - BLOB[q].x, p.y - BLOB[q].y) < BLOB[q].r + 16);
      return k ? { key: k, x: BLOB[k].x, y: BLOB[k].y, r: BLOB[k].r } : null;
    };
    const dropOut = (g) => {
      const t = s("circle", { cx: TISSUE.x - 30 + ctx.rng() * 60, cy: TISSUE.y - 12 + ctx.rng() * 26, r: Math.min(14, g.r * 0.6), fill: "#d9a42a", opacity: 0.85 }, onTissue);
      void t;
      ctx.sfx("pop");
      S.face("happy", 400);
      if (g.pop) {
        const i = st.pops.indexOf(g.pop);
        if (i >= 0) st.pops.splice(i, 1);
        g.pop.el.remove();
        return;
      }
      st.out.push(g.key);
      if (cur() && cur().rows) ctx.card.tick(`wax${st.out.length - 1}`); // each part ticks as it's done (13c)
      S.face("ouch", 500);
      drawWax();
      if (st.out.length === 2) {
        st.busy = true;
        ctx.after(fast() ? 100 : 500, () => {
          st.busy = false;
          close();
        });
      }
    };

    S.tools(
      [
        { id: "tweezers", glyph: "🥢" },
        { id: "bud", glyph: "🦯" },
        { id: "drops", glyph: "💧" },
      ],
      (id) => {
        if (st.over) return;
        const c = cur();
        const want = { tweezers: "wax", bud: "clean", drops: "drops" }[id];
        const later = P.steps.findIndex((x) => x.kind === want) > st.i;
        if (later && (c.kind === "clean" || c.kind === "drops") && (c.kind === "clean" ? st.cleans : st.drops) > 0) close();
      }
    );
    const inEar = (p) => Math.hypot(p.x - EAR.x, (p.y - EAR.y) / 1.2) < 75;
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready) return;
      const p = S.pt(e);
      const c = cur();
      if (!c || st.over || st.busy) return;
      if ((c.kind === "wax" || c.kind === "pop") && S.sel === "tweezers") {
        const g = grabAt(p);
        if (!g) return;
        st.hold = g.key || "pop";
        g.el = s("circle", { cx: g.x, cy: g.y, r: g.r, fill: "#d9a42a", stroke: "#8a6010", "stroke-width": 3 }, S.fx);
        if (g.pop) g.pop.el.setAttribute("opacity", 0);
        st.drag = g;
        drawWax();
        return;
      }
      if (!inEar(p)) return;
      if (c.kind === "clean" && S.sel === "bud") {
        st.cleans++;
        S.count(st.cleans);
        ctx.tally("bud", st.cleans);
        dirt.setAttribute("opacity", Math.max(0, 0.5 - st.cleans * 0.14));
        const b = s("text", { x: EAR.x - 10, y: EAR.y + 10, "font-size": 50 }, S.fx);
        b.textContent = "🦯";
        ctx.after(400, () => b.remove());
        S.face("happy", 500);
        return;
      }
      if (c.kind === "drops" && S.sel === "drops") {
        st.drops++;
        S.count(st.drops);
        ctx.tally("drops", st.drops);
        const d = s("ellipse", { cx: EAR.x, cy: EAR.y - 90, rx: 8, ry: 12, fill: "#6bb7ea" }, S.fx);
        d.animate([{ transform: "translateY(0)" }, { transform: "translateY(90px)", opacity: 0.2 }], { duration: 450, fill: "forwards" });
        ctx.after(500, () => d.remove());
        S.face("ouch", 400);
        st.busy = true;
        ctx.after(fast() ? 60 : 250, () => (st.busy = false));
      }
    });
    ctx.on(S.svg, "pointermove", (e) => {
      const g = st.drag;
      if (!g) return;
      const p = S.pt(e);
      g.el.setAttribute("cx", p.x);
      g.el.setAttribute("cy", p.y);
    });
    const letGo = (e) => {
      const g = st.drag;
      if (!g) return;
      st.drag = null;
      st.hold = null;
      const p = e && e.clientX != null ? S.pt(e) : { x: g.x, y: g.y };
      g.el.remove();
      if (Math.hypot(p.x - TISSUE.x, p.y - TISSUE.y) < TISSUE.r + 20) dropOut(g);
      else {
        if (g.pop) g.pop.el.setAttribute("opacity", 1);
        drawWax();
      }
    };
    ctx.on(S.svg, "pointerup", letGo);
    ctx.on(S.svg, "pointercancel", () => letGo(null));
    const nextBtn = ctx.button(
      "✓",
      () => {
        const c = cur();
        if (!c || st.over) return;
        if (c.kind === "clean" && st.cleans > 0) close();
        else if (c.kind === "drops" && st.drops > 0) close();
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
          const drag = (x, y, what) => {
            const a = S.client(x, y);
            const b = S.client(TISSUE.x, TISSUE.y);
            return { do: "drag", pts: [[a.x, a.y], [(a.x + b.x) / 2, (a.y + b.y) / 2], [b.x, b.y]], what };
          };
          if (c.kind === "wax") {
            if (S.sel !== "tweezers") return tool("tweezers");
            const k = (c.order || ["big", "small"]).find((q) => !st.out.includes(q));
            return k ? drag(BLOB[k].x, BLOB[k].y, "wax " + k) : { do: "wait" };
          }
          if (c.kind === "pop") {
            if (S.sel !== "tweezers") return tool("tweezers");
            return st.pops.length ? drag(st.pops[0].x, st.pops[0].y, "pop") : { do: "wait", ms: 100 };
          }
          const id = c.kind === "clean" ? "bud" : "drops";
          const n = c.kind === "clean" ? st.cleans : st.drops;
          if (n >= c.count) return { do: "button" };
          return S.sel !== id ? tool(id) : at(EAR.x, EAR.y, c.kind);
        },
        slip() {
          // one drop too many
          const c = cur();
          if (c && c.kind === "drops" && S.sel === "drops" && st.drops === c.count && !st.busy) return Object.assign({ do: "tap", what: "extra drop" }, S.client(EAR.x, EAR.y));
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
