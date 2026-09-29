/*
 * H-ear (clinic v2, design sheets part B): wax blobs, the cotton bud, drops.
 * A PROTOTYPE on the CB6b close-up (a head close-up: the ear sits in the
 * upper half against the wall) with flat stand-ins.
 *
 * Why: "My ear feels blocked." / "Let's clean it."
 * 1. Take out the wax blobs with the tweezers in the order said
 *    (pela wadho, ne poi nindho, or the other way round).
 *    From L2 more blobs keep popping up for a few seconds: clear them before
 *    the drops (a calm whack-a-mole; not scored, only logged).
 * 2. Clean N times with the cotton bud.
 * 3. N drops.
 * Rows (the Kutchi decides): which blob first, the cleaning count, the drops count.
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
  const CUES = {
    wax: "Tap the <b>tweezers</b>, then tap the wax blobs, in the order you're told: the big one or the small one first.",
    pop: "More wax! Tap each blob as it pops up.",
    clean: "Tap the <b>cotton bud</b>, then tap inside the ear. Count the times you're told, then press ✓.",
    drops: "Tap the <b>drops</b>, then tap the ear. Count the drops you're told, then press ✓.",
  };
  const EAR = { x: 400, y: 170 };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const bigFirst = rng() < 0.5;
    const order = bigFirst ? ["big", "small"] : ["small", "big"];
    const cleans = HS.pick(K.cleans[L], rng);
    const drops = HS.pick(K.drops[L], rng);
    const kw = (x) => (x === "big" ? "wadho" : "nindho");
    const steps = [{ id: "wax", kind: "wax", order, row: { id: "wax", kutchi: `[Wax:] pela ${kw(order[0])}, ne poi ${kw(order[1])}`, english: `The wax: first the ${order[0]} one, then the ${order[1]} one` } }];
    if (K.popMs[L]) steps.push({ id: "pop", kind: "pop", ms: K.popMs[L], row: { id: "pop", kutchi: null, english: "More wax!", placeholder: true } });
    steps.push({ id: "clean", kind: "clean", count: cleans, row: { id: "clean", kutchi: `[Cotton bud], ${HS.NUM[cleans]}`, english: `The cotton bud, ${cleans} times` } });
    steps.push({ id: "drops", kind: "drops", count: drops, row: { id: "drops", kutchi: `Ne poi [drops], ${HS.NUM[drops]}`, english: `Then the drops, ${drops}` } });
    const rows = [
      { id: "wax-order", options: [["big", "small"], ["small", "big"]], answer: order },
      { id: "clean-count", options: K.cleans[L], answer: cleans },
      { id: "drops-count", options: K.drops[L], answer: drops },
    ];
    const words = [{ kutchi: "pela", english: "first" }, { kutchi: "ne poi", english: "and then" }, { kutchi: "wadho", english: "big" }, { kutchi: "nindho", english: "small" }, { kutchi: HS.NUM[cleans], english: String(cleans) }, { kutchi: HS.NUM[drops], english: String(drops) }, HS.ph("ear"), HS.ph("wax")];
    return { level: L, steps, rows, words };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "head", game: "ear" });
    const { s } = S;
    const st = { i: 0, out: [], cleans: 0, drops: 0, judged: {}, over: false, busy: false, pops: [], popping: false };
    const cur = () => P.steps[st.i] || null;
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    ctx.card.setRows(P.steps.filter((x) => x.kind !== "pop").map((x) => x.row));

    // the head from the side, the ear big in the middle, against the wall
    const head = s("g", {}, S.layer);
    s("ellipse", { cx: EAR.x - 30, cy: EAR.y + 10, rx: 250, ry: 190, fill: "#e2b08a" }, head);
    s("path", { d: `M${EAR.x - 280} ${EAR.y - 60} Q${EAR.x - 30} ${EAR.y - 260} ${EAR.x + 230} ${EAR.y - 40} Q${EAR.x + 120} ${EAR.y - 110} ${EAR.x - 30} ${EAR.y - 120} Q${EAR.x - 200} ${EAR.y - 120} ${EAR.x - 280} ${EAR.y - 60}Z`, fill: "#3b2415" }, head);
    s("path", { d: `M${EAR.x - 70} ${EAR.y - 100} C${EAR.x + 60} ${EAR.y - 150} ${EAR.x + 120} ${EAR.y - 20} ${EAR.x + 60} ${EAR.y + 60} C${EAR.x + 30} ${EAR.y + 120} ${EAR.x - 20} ${EAR.y + 140} ${EAR.x - 50} ${EAR.y + 100} C${EAR.x - 110} ${EAR.y + 20} ${EAR.x - 120} ${EAR.y - 70} ${EAR.x - 70} ${EAR.y - 100}Z`, fill: "#eab893", stroke: "#b9845c", "stroke-width": 5 }, head);
    s("ellipse", { cx: EAR.x, cy: EAR.y, rx: 44, ry: 56, fill: "#5a2e22" }, head);
    const dirt = s("ellipse", { cx: EAR.x, cy: EAR.y, rx: 44, ry: 56, fill: "#c9a24a", opacity: 0.5 }, head);
    const waxG = s("g", {}, S.layer);
    const BLOB = { big: { x: EAR.x - 10, y: EAR.y - 10, r: 30 }, small: { x: EAR.x + 22, y: EAR.y + 30, r: 15 } };
    const drawWax = () => {
      S.clear(waxG);
      if (cur() && cur().kind !== "wax") return;
      ["big", "small"].forEach((k) => {
        if (st.out.includes(k)) return;
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
      S.cue(c.kind, CUES[c.kind], c.kind === "pop" ? { x: EAR.x, y: EAR.y } : S.toolEls[TOOL_OF[c.kind]]);
      if (c.kind === "pop") startPop(c);
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "wax") judge("wax-order", st.out[0] === c.order[0], `first ${st.out[0] || "none"}`);
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

    // the calm whack-a-mole: blobs pop up round the ear for a few seconds
    const startPop = (c) => {
      st.popping = true;
      let n = 0;
      const t0 = Date.now();
      const spawn = () => {
        if (st.over || cur() !== c) return;
        if (Date.now() - t0 > c.ms) {
          st.popping = false;
          // wait for the last ones to be cleared (or fade)
          const endWhenClear = () => (st.pops.length ? ctx.after(200, endWhenClear) : cur() === c && close());
          return endWhenClear();
        }
        const a = ctx.rng() * Math.PI * 2;
        const rr = 20 + ctx.rng() * 25;
        const p = { id: n++, x: EAR.x + Math.cos(a) * rr, y: EAR.y + Math.sin(a) * rr * 1.2, r: 13 + ctx.rng() * 8 };
        p.el = s("circle", { cx: p.x, cy: p.y, r: p.r, fill: "#d9a42a", stroke: "#8a6010", "stroke-width": 3 }, popG);
        p.el.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 200 });
        p.el.style.transformBox = "fill-box";
        p.el.style.transformOrigin = "center";
        st.pops.push(p);
        // a blob not cleared slips back in after a while (no penalty: it's calm)
        ctx.after(2600, () => {
          const i = st.pops.indexOf(p);
          if (i >= 0) {
            st.pops.splice(i, 1);
            p.el.remove();
            ctx.log({ type: "extra", rowId: "pop", detail: "a blob slipped back" });
          }
        });
        ctx.after(K.popEvery[P.level] * (fast() ? 0.5 : 1), spawn);
      };
      spawn();
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
        if (c.kind === "pop") {
          const hit = st.pops.find((q) => Math.hypot(p.x - q.x, p.y - q.y) < q.r + 14);
          if (!hit) return;
          st.pops.splice(st.pops.indexOf(hit), 1);
          hit.el.remove();
          ctx.sfx("pop");
          S.face("happy", 400);
          return;
        }
        const k = ["big", "small"].find((q) => !st.out.includes(q) && Math.hypot(p.x - BLOB[q].x, p.y - BLOB[q].y) < BLOB[q].r + 16);
        if (!k) return;
        st.out.push(k);
        const fly = s("circle", { cx: BLOB[k].x, cy: BLOB[k].y, r: BLOB[k].r, fill: "#d9a42a" }, S.fx);
        fly.animate([{ transform: "translate(0,0)" }, { transform: "translate(260px,-140px)", opacity: 0 }], { duration: 500, fill: "forwards" });
        ctx.after(600, () => fly.remove());
        S.face("ouch", 500);
        ctx.sfx("pop");
        drawWax();
        if (st.out.length === 2) {
          st.busy = true;
          ctx.after(fast() ? 100 : 500, () => {
            st.busy = false;
            close();
          });
        }
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
        await S.why(WHY.problem, WHY.goal);
        await ctx.card.speak();
        S.ready = true;
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
          if (c.kind === "wax") {
            if (S.sel !== "tweezers") return tool("tweezers");
            const k = c.order.find((q) => !st.out.includes(q));
            return k ? at(BLOB[k].x, BLOB[k].y, "wax " + k) : { do: "wait" };
          }
          if (c.kind === "pop") {
            if (S.sel !== "tweezers") return tool("tweezers");
            return st.pops.length ? at(st.pops[0].x, st.pops[0].y, "pop") : { do: "wait", ms: 100 };
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
