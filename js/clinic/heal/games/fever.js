/*
 * H-fever (clinic v2, design sheets part B; G8, then the original design
 * made clear). A PROTOTYPE on the CB6b close-up (a head close-up against the
 * wall) with flat stand-ins.
 *
 * Why: "I feel hot... no, cold!" / "Let's get you just right."
 * Each exchange:
 *   1. the thermometer (it looks like one) on the forehead: the reading rises
 *      and turns red (hot) or blue (cold);
 *   2. the doctor says the fix: hot -> the cool cloth or the fan, cold -> the
 *      blanket, with a count (the words decide it);
 *   3. the patient says "[still cold] / [too hot] / [just right]", and it
 *      alternates until just right.
 * L1: 2 exchanges. L2: 3-4, with a count. L3: + the fan's speed (jaldi / aste thi).
 * (L1 carries a count too, so a blind guess stays under 10%.)
 * Hot / cold words wait for Mum (koso / nokoso?): English placeholders.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const K = { exchanges: { 1: [2], 2: [3, 4], 3: [3, 4] }, counts: { 1: [1, 2, 3, 4], 2: [2, 3, 4, 5], 3: [2, 3, 4] }, fastMs: 450 };
  const WHY = { problem: "I feel hot... no, cold!", goal: "Let's get you just right." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    temp: { gesture: "tap", then: "tap" },
    fix: { gesture: "tap", then: "tap" },
  };
  const TOOL_EN = { cloth: "the cool cloth", fan: "the fan", blanket: "the blanket" };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const n = HS.pick(K.exchanges[L], rng);
    let hot = rng() < 0.5;
    const ex = [];
    for (let i = 0; i < n; i++) {
      const tool = hot ? (rng() < 0.5 ? "cloth" : "fan") : "blanket";
      const count = HS.pick(K.counts[L], rng);
      const speed = L === 3 && tool === "fan" ? (rng() < 0.5 ? "jaldi" : "aste thi") : null;
      const after = i === n - 1 ? "just right" : hot ? "too cold" : "too hot";
      ex.push({ hot, tool, count, speed, after });
      hot = !hot;
    }
    const steps = [];
    ex.forEach((e, i) => {
      steps.push({ id: `temp${i}`, kind: "temp", ex: i });
      const kw = `${e.hot ? "[Hot!]" : "[Cold!]"} [${e.tool}] ${HS.NUM[e.count]}${e.speed ? `, ${e.speed}` : ""}`;
      steps.push({ id: `fix${i}`, kind: "fix", ex: i, row: { id: `fix${i}`, kutchi: kw, english: `${e.hot ? "Hot" : "Cold"}: ${TOOL_EN[e.tool]}, ${e.count} times${e.speed ? `, ${e.speed === "jaldi" ? "quickly" : "slowly"}` : ""}` } });
    });
    const combo = (tool, count, speed) => `${tool}x${count}${speed ? "-" + speed : ""}`;
    const rows = ex.map((e, i) => {
      const tools = e.hot ? ["cloth", "fan"] : ["blanket"];
      const opts = [];
      tools.forEach((t) => K.counts[L].forEach((c) => (L === 3 && t === "fan" ? ["jaldi", "aste thi"] : [null]).forEach((sp) => opts.push(combo(t, c, sp)))));
      return { id: `fix${i}`, options: opts, answer: combo(e.tool, e.count, e.speed) };
    });
    const words = [HS.ph("hot"), HS.ph("cold"), HS.ph("just right")].concat(ex.map((e) => ({ kutchi: HS.NUM[e.count], english: String(e.count) })));
    if (L === 3) words.push({ kutchi: "jaldi", english: "quickly" }, { kutchi: "aste thi", english: "slowly" });
    return { level: L, ex, steps, rows, words, combo };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "head", game: "fever", rest: P.ex[0].hot ? "hot" : "cold" });
    const { s } = S;
    const st = { i: 0, judged: {}, over: false, busy: false, uses: {}, taps: [], reading: null };
    const cur = () => P.steps[st.i] || null;
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    ctx.card.setRows([{ id: "temp", kutchi: null, english: "Take the temperature", placeholder: true }]);

    // the head and forehead, against the wall
    const H = { x: 380, y: 170 };
    s("circle", { cx: H.x, cy: H.y, r: 150, fill: "#e2b08a", stroke: "#b9845c", "stroke-width": 4 }, S.layer);
    s("path", { d: `M${H.x - 150} ${H.y - 10} Q${H.x - 140} ${H.y - 170} ${H.x} ${H.y - 160} Q${H.x + 140} ${H.y - 170} ${H.x + 150} ${H.y - 10} Q${H.x + 90} ${H.y - 110} ${H.x} ${H.y - 100} Q${H.x - 90} ${H.y - 110} ${H.x - 150} ${H.y - 10}Z`, fill: "#3b2415" }, S.layer);
    const flush = s("circle", { cx: H.x, cy: H.y + 20, r: 140, fill: "#f07a6a", opacity: 0 }, S.layer);
    const frost = s("circle", { cx: H.x, cy: H.y + 20, r: 140, fill: "#9cc8f0", opacity: 0 }, S.layer);
    s("circle", { cx: H.x - 50, cy: H.y + 10, r: 10, fill: "#3b2415" }, S.layer);
    s("circle", { cx: H.x + 50, cy: H.y + 10, r: 10, fill: "#3b2415" }, S.layer);
    const mouthP = s("path", { d: `M${H.x - 30} ${H.y + 70} Q${H.x} ${H.y + 80} ${H.x + 30} ${H.y + 70}`, stroke: "#5b2a1a", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, S.layer);
    const FH = { x: H.x, y: H.y - 60 }; // the forehead spot
    const blanketG = s("g", {}, S.layer);
    const shade = (hot) => {
      flush.setAttribute("opacity", hot === true ? 0.28 : 0);
      frost.setAttribute("opacity", hot === false ? 0.3 : 0);
      mouthP.setAttribute("d", hot == null ? `M${H.x - 30} ${H.y + 64} Q${H.x} ${H.y + 90} ${H.x + 30} ${H.y + 64}` : `M${H.x - 30} ${H.y + 70} Q${H.x} ${H.y + 80} ${H.x + 30} ${H.y + 70}`);
    };
    shade(P.ex[0].hot);

    // the thermometer: a glass stick, a bulb, a column that rises red or blue (to the right of the head)
    const TH = { x: 640, y: 60, h: 220 };
    const thG = s("g", {}, S.layer);
    s("rect", { x: TH.x - 16, y: TH.y, width: 32, height: TH.h, rx: 16, fill: "#fff", stroke: "#8a8f98", "stroke-width": 4 }, thG);
    for (let k = 1; k < 8; k++) s("line", { x1: TH.x + 6, y1: TH.y + k * 25, x2: TH.x + 16, y2: TH.y + k * 25, stroke: "#8a8f98", "stroke-width": 2 }, thG);
    const bulb = s("circle", { cx: TH.x, cy: TH.y + TH.h + 14, r: 26, fill: "#c9ccd2", stroke: "#8a8f98", "stroke-width": 4 }, thG);
    const col = s("rect", { x: TH.x - 7, y: TH.y + TH.h, width: 14, height: 0, rx: 7, fill: "#c9ccd2" }, thG);
    const readG = s("g", {}, S.layer);
    const read = (hot) => {
      if (col.getAnimations) col.getAnimations().forEach((a) => a.cancel());
      const c = hot ? "#d8433f" : "#3f6fd8";
      bulb.setAttribute("fill", c);
      col.setAttribute("fill", c);
      const hgt = hot ? TH.h * 0.85 : TH.h * 0.25;
      col.animate([{ height: "0px", y: `${TH.y + TH.h}px` }, { height: `${hgt}px`, y: `${TH.y + TH.h - hgt}px` }], { duration: 600, fill: "forwards" });
      col.setAttribute("height", hgt);
      col.setAttribute("y", TH.y + TH.h - hgt);
      S.clear(readG);
      s("text", { x: TH.x + 36, y: TH.y + 40, "font-size": 44 }, readG).textContent = hot ? "🔥" : "❄️";
    };
    const unread = () => {
      // a finished animation (fill: forwards) would keep the old reading showing
      if (col.getAnimations) col.getAnimations().forEach((a) => a.cancel());
      bulb.setAttribute("fill", "#c9ccd2");
      col.setAttribute("height", 0);
      S.clear(readG);
    };

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const open = () => {
      const c = cur();
      if (c.kind === "temp") {
        unread();
        S.cue("temp", CUES.temp, S.toolEls.thermo);
      } else {
        st.uses = {};
        st.taps = [];
        const e = P.ex[c.ex];
        const row = P.steps.find((x) => x.id === c.id).row;
        if (c.ex === 0) ctx.card.setRows([row]);
        else ctx.card.addRow(row);
        ctx.card.now(c.id);
        ctx.say(row);
        S.cue("fix", CUES.fix, S.toolEls[e.hot ? "fan" : "blanket"]);
      }
    };
    const next = () => {
      st.i++;
      if (cur()) open();
      else finish();
    };
    const closeFix = () => {
      const c = cur();
      const e = P.ex[c.ex];
      const used = Object.entries(st.uses).filter(([, n]) => n > 0);
      let got = "nothing";
      let speed = null;
      if (used.length === 1) {
        const [t, n] = used[0];
        if (P.level === 3 && t === "fan") {
          const gaps = st.taps.slice(1).map((x, k) => x - st.taps[k]);
          const avg = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
          speed = avg && avg < K.fastMs * (fast() ? 1 : 1) ? "jaldi" : "aste thi";
        }
        got = P.combo(t, n, speed);
      } else if (used.length > 1) got = used.map(([t, n]) => `${t}x${n}`).join("+");
      judge(c.id, got === P.combo(e.tool, e.count, e.speed), got);
      ctx.card.tick(c.id);
      S.count(null);
      S.uncue();
      // the patient says how they feel now: alternates until just right
      const line = { "too cold": "Now I'm too cold!", "too hot": "Now I'm too hot!", "just right": "Just right!" }[e.after];
      const mood = e.after === "just right" ? null : e.after === "too cold" ? false : true;
      shade(mood);
      S.face(mood == null ? "happy" : mood ? "hot" : "cold");
      if (mood === false) S.clear(blanketG);
      st.busy = true;
      S.say(line, "patient").then(() => {
        st.busy = false;
        next();
      });
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      S.markSeen();
      ctx.after(fast() ? 200 : 1200, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    S.tools(
      [
        { id: "thermo", glyph: "🌡️" },
        { id: "cloth", glyph: "🧊" },
        { id: "fan", glyph: "🪭" },
        { id: "blanket", glyph: "🛏️" },
      ],
      () => {}
    );
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      if (!c || Math.hypot(p.x - H.x, p.y - H.y) > 170) return;
      if (c.kind === "temp") {
        if (S.sel !== "thermo") return;
        const hot = P.ex[c.ex].hot;
        const t = s("text", { x: FH.x - 20, y: FH.y + 10, "font-size": 50 }, S.fx);
        t.textContent = "🌡️";
        ctx.after(700, () => t.remove());
        read(hot);
        shade(hot);
        S.face(hot ? "hot" : "cold");
        if (c.ex === 0) ctx.card.tick("temp");
        st.busy = true;
        ctx.after(fast() ? 150 : 800, () => {
          st.busy = false;
          next();
        });
        return;
      }
      const tool = S.sel;
      if (!tool || tool === "thermo") return;
      st.uses[tool] = (st.uses[tool] || 0) + 1;
      st.taps.push(Date.now());
      const n = st.uses[tool];
      S.count(n);
      ctx.tally(tool, n);
      if (tool === "blanket") {
        s("rect", { x: H.x - 170 + n * 6, y: H.y + 150 - n * 14, width: 340, height: 60, rx: 18, fill: ["#d8433f", "#3f6fd8", "#3fa35b", "#f0c43a", "#8a55c8"][(n - 1) % 5], opacity: 0.9 }, blanketG);
      } else {
        const g = s("text", { x: FH.x - 30, y: FH.y + 20, "font-size": 60 }, S.fx);
        g.textContent = tool === "fan" ? "🪭" : "🧊";
        g.animate([{ transform: "translateX(-20px)" }, { transform: "translateX(20px)" }, { transform: "translateX(0)" }], { duration: 300 });
        ctx.after(400, () => g.remove());
      }
      ctx.sfx("tap");
    });
    const btn = ctx.button(
      "✓",
      () => {
        const c = cur();
        if (!S.ready || st.over || st.busy || !c || c.kind !== "fix") return;
        if (!Object.keys(st.uses).length) return;
        closeFix();
      },
      "done"
    );
    btn.setAttribute("aria-label", "Next");

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
          const head = (after) => Object.assign({ do: "tap", what: "head", after }, S.client(FH.x, FH.y + 40));
          if (c.kind === "temp") return S.sel !== "thermo" ? tool("thermo") : head();
          const e = P.ex[c.ex];
          if (S.sel !== e.tool) return tool(e.tool);
          if ((st.uses[e.tool] || 0) < e.count) return head(e.speed === "aste thi" ? 750 : e.speed === "jaldi" ? 40 : 90);
          return { do: "button" };
        },
        slip() {
          // one use too many on the first fix
          const c = cur();
          if (!S.ready || st.busy || !c || c.kind !== "fix" || c.ex !== 0) return null;
          const e = P.ex[0];
          if (S.sel !== e.tool || (st.uses[e.tool] || 0) !== e.count) return null;
          return Object.assign({ do: "tap", what: "extra", after: e.speed === "aste thi" ? 750 : 40 }, S.client(FH.x, FH.y + 40));
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "fever",
    part: "head",
    ailments: ["fever"],
    items: ["thermometer", "cloth", "blanket", "fan"],
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
