/*
 * H-eye (clinic v2, design sheets part B; CQ11, Zafar's design). A
 * PROTOTYPE on the CB6b close-up (a head close-up: the eyes in the upper
 * half against the wall, the chart on the wall) with flat stand-ins.
 *
 * Why: "I can't see well." / "Drops, then let's test your eyes."
 * 1. Drops: N (counted); the side from L2 (the patient's own; English
 *    placeholders until the recording); L3 "cover the other eye" first.
 * 2. The eye test: the chart's rows of pictures get smaller. The patient
 *    reads each row out and the child judges: haa (right) or na (wrong).
 *    Wrong -> another drop, then the patient reads that row again.
 *    L1: one picture per row, and what they say is also written by their mouth.
 *    L2: heard only.  L3: 2-3 pictures per row, read left to right.
 * The words: Cook's foods (limu, dungri, tameto, ...) and household things
 * (bed, table, cup, ball, key: English placeholders, to record). No is *na*.
 * Rows (the words decide): the drop count, the side (L2+), each chart row's judgement.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const THINGS = [
    { id: "limu", g: "🍋", k: "limu", e: "lemon" },
    { id: "dungri", g: "🧅", k: "dungri", e: "onion" },
    { id: "tameto", g: "🍅", k: "tameto", e: "tomato" },
    { id: "bataato", g: "🥔", k: "bataato", e: "potato" },
    { id: "marcha", g: "🌶️", k: "marcha", e: "chilli" },
    { id: "lasan", g: "🧄", k: "lasan", e: "garlic" },
    { id: "dudh", g: "🥛", k: "dudh", e: "milk" },
    { id: "bed", g: "🛏️", k: null, e: "bed" },
    { id: "table", g: "🪑", k: null, e: "chair" },
    { id: "cup", g: "☕", k: null, e: "cup" },
    { id: "ball", g: "⚽", k: null, e: "ball" },
    { id: "key", g: "🔑", k: null, e: "key" },
    { id: "spoon", g: "🥄", k: null, e: "spoon" },
  ];
  const BY = Object.fromEntries(THINGS.map((t) => [t.id, t]));
  const word = (t) => (t.k ? t.k : `[${t.e}]`);
  const K = { drops: { 1: [1, 2, 3], 2: [1, 2, 3], 3: [1, 2, 3] }, rows: { 1: 3, 2: 4, 3: 4 }, per: { 1: [1], 2: [1], 3: [2, 3] }, wrongP: 0.45 };
  const WHY = { problem: "I can't see well.", goal: "Drops first, then let's test your eyes." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    cover: { gesture: "tap", then: "tap" },
    drops: { gesture: "tap", then: "tap" },
    read: { gesture: "tap" },
    redrop: { gesture: "tap", then: "tap" },
  };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const side = L >= 2 ? (rng() < 0.5 ? "left" : "right") : null;
    const drops = HS.pick(K.drops[L], rng);
    const pool = HS.shuffle(THINGS, rng);
    let pi = 0;
    const chart = [];
    for (let r = 0; r < K.rows[L]; r++) {
      const n = HS.pick(K.per[L], rng);
      const pics = [];
      for (let k = 0; k < n; k++) pics.push(pool[pi++ % pool.length].id);
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
    const steps = [];
    if (L === 3) steps.push({ id: "cover", kind: "cover" });
    const sideW = side ? ` [${side} eye]` : "";
    steps.push({ id: "drops", kind: "drops", count: drops, side, row: { id: "drops", kutchi: `[Drops]${sideW}, ${HS.NUM[drops]}`, english: `Drops${side ? ` in the ${side} eye` : ""}, ${drops}` } });
    chart.forEach((c, i) => steps.push({ id: `read${i}`, kind: "read", row: i, rowDef: c }));
    const rows = [{ id: "drops-count", options: K.drops[L], answer: drops }];
    if (side) rows.push({ id: "drops-side", options: ["left", "right"], answer: side, placeholder: true });
    chart.forEach((c, i) => rows.push({ id: `read${i}`, options: [true, false], answer: !c.wrong }));
    const words = [{ kutchi: HS.NUM[drops], english: String(drops) }, { kutchi: "na", english: "no" }];
    chart.forEach((c) => c.pics.forEach((id) => words.push(BY[id].k ? { kutchi: BY[id].k, english: BY[id].e } : HS.ph(BY[id].e))));
    return { level: L, side, steps, rows, chart, words };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "head", game: "eye" });
    const { s } = S;
    const st = { i: 0, drops: 0, dropSide: null, covered: null, judged: {}, over: false, busy: false, awaiting: null, redrop: false };
    const cur = () => P.steps[st.i] || null;
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    ctx.card.setRows(P.steps.filter((x) => x.row && x.kind === "drops").map((x) => x.row).concat([{ id: "chart", kutchi: null, english: "The eye test", placeholder: true }]));

    // the eyes, big, on the left; the patient's left eye is on OUR right
    const EY = { right: { x: 150, y: 170 }, left: { x: 340, y: 170 } };
    s("rect", { x: 35, y: 70, width: 420, height: 210, rx: 100, fill: "#e2b08a" }, S.layer);
    const eyeEls = {};
    ["right", "left"].forEach((sd) => {
      const e = EY[sd];
      s("ellipse", { cx: e.x, cy: e.y, rx: 80, ry: 50, fill: "#fff", stroke: "#8a5a3a", "stroke-width": 4 }, S.layer);
      s("circle", { cx: e.x, cy: e.y, r: 28, fill: "#6a4a2a" }, S.layer);
      s("circle", { cx: e.x, cy: e.y, r: 12, fill: "#1a1010" }, S.layer);
      s("path", { d: `M${e.x - 85} ${e.y - 60} Q${e.x} ${e.y - 90} ${e.x + 85} ${e.y - 60}`, stroke: "#3b2415", "stroke-width": 10, fill: "none", "stroke-linecap": "round" }, S.layer);
      eyeEls[sd] = s("ellipse", { cx: e.x, cy: e.y, rx: 80, ry: 50, fill: "#f2a0a0", opacity: 0.35 }, S.layer);
    });
    const coverG = s("g", {}, S.layer);

    // the chart on the wall, right
    const CH = { x: 490, y: 10, w: 190, h: 320 }; // clear of the tool shelf on the right
    s("rect", { x: CH.x, y: CH.y, width: CH.w, height: CH.h, rx: 10, fill: "#fff", stroke: "#8a7a6c", "stroke-width": 4 }, S.layer);
    const chartG = s("g", {}, S.layer);
    const rowY = (i) => CH.y + 50 + i * (CH.h - 60) / P.chart.length;
    // shrinking rows, and never wider than the chart (2-3 pictures a row at L3)
    const size = (i) => Math.min(58 - i * 10, (CH.w - 24) / (P.chart[i].pics.length * 1.35));
    const drawChart = () => {
      S.clear(chartG);
      P.chart.forEach((c, i) => {
        const y = rowY(i);
        const now = cur() && cur().kind === "read" && cur().row === i;
        if (now) s("rect", { x: CH.x + 6, y: y - size(i) * 0.95, width: CH.w - 12, height: size(i) * 1.25, rx: 8, fill: "#fff3c8" }, chartG);
        c.pics.forEach((id, k) => {
          const t = s("text", { x: CH.x + CH.w / 2 + (k - (c.pics.length - 1) / 2) * size(i) * 1.15, y, "font-size": size(i), "text-anchor": "middle" }, chartG);
          t.textContent = BY[id].g;
        });
      });
    };
    drawChart();

    // the judging buttons, by the chart
    const judgeBox = S.h("div", null, S.root);
    judgeBox.style.cssText = "position:absolute;left:50%;bottom:12px;transform:translateX(-50%);display:flex;gap:18px;z-index:8";
    // haa / na: the shared answer pills (UX 15), one pill style everywhere
    const NB = root.NjgButtons;
    const pills = NB ? NB.pills(judgeBox, [{ id: "haa", html: "haa" }, { id: "na", html: "na" }], (id) => onJudge(id === "haa")) : null;
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
      ctx.on(b, "click", () => onJudge(id === "haa"));
      return b;
    };
    const haaBtn = mk("haa", "haa");
    const naBtn = mk("na", "na");
    const showJudge = (on) => (judgeBox.style.display = on ? "flex" : "none");
    showJudge(false);

    const judge = (id, ok, detail) => {
      if (id in st.judged) return;
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const readRow = async (i, again) => {
      const c = P.chart[i];
      const said = again ? c.pics : c.said;
      const line = { kutchi: said.map((id) => word(BY[id])).join(", "), english: said.map((id) => BY[id].e).join(", ") };
      st.busy = true;
      showJudge(false);
      S.face("read");
      if (P.level === 1) S.said(said.map((id) => word(BY[id]).replace(/[[\]]/g, "")).join(", "));
      if (again) {
        await S.say(line, "patient");
        S.face("neutral");
        st.busy = false;
        // read right after the drop: on to the next row
        S.said(null);
        return advance();
      }
      // the judging pills come up as the reading starts: input never waits for the talking (13i)
      st.busy = false;
      st.awaiting = { i, again, wrong: c.wrong };
      showJudge(true);
      if (i === 0) S.cue("read", CUES.read, haaBtn);
      S.say(line, "patient").then(() => S.face("neutral"));
    };
    const onJudge = (saysRight) => {
      if (!st.awaiting || st.busy || st.over) return;
      const { i, wrong } = st.awaiting;
      judge(`read${i}`, saysRight === !wrong, saysRight ? "haa" : "na");
      st.awaiting = null;
      showJudge(false);
      S.said(null);
      drawChart();
      if (!saysRight) {
        // another drop, then they read it again
        st.redrop = { i };
        S.cue("redrop", CUES.redrop, S.toolEls.drops);
        return;
      }
      advance();
    };
    const advance = () => {
      st.i++;
      const c = cur();
      if (!c) return finish();
      open();
    };
    const open = () => {
      const c = cur();
      drawChart();
      if (c.kind === "cover") return S.cue("cover", CUES.cover, S.toolEls.cover);
      if (c.kind === "drops") {
        ctx.card.now("drops");
        return S.cue("drops", CUES.drops, S.toolEls.drops);
      }
      if (c.kind === "read") {
        if (c.row === 0) {
          ctx.card.now("chart");
          S.uncue();
        }
        readRow(c.row, false);
      }
    };
    const closeDrops = () => {
      const c = cur();
      judge("drops-count", st.drops === c.count, `${st.drops} of ${c.count}`);
      if (c.side) judge("drops-side", st.dropSide === c.side, st.dropSide || "none");
      ctx.card.tick("drops");
      S.count(null);
      S.uncue();
      advance();
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      showJudge(false);
      ctx.card.tick("chart");
      ctx.card.now(null);
      S.face("happy");
      S.say("I can see!", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    const tools = [{ id: "drops", glyph: "💧" }];
    if (P.level === 3) tools.unshift({ id: "cover", glyph: "🥄" });
    S.tools(tools, () => {});
    const eyeAt = (p) => ["left", "right"].find((sd) => Math.hypot(p.x - EY[sd].x, (p.y - EY[sd].y) * 1.4) < 90);
    const dropIn = (sd) => {
      const e = EY[sd];
      const d = s("ellipse", { cx: e.x, cy: e.y - 90, rx: 8, ry: 12, fill: "#6bb7ea" }, S.fx);
      d.animate([{ transform: "translateY(0)" }, { transform: "translateY(90px)", opacity: 0.2 }], { duration: 400, fill: "forwards" });
      ctx.after(450, () => d.remove());
      S.face("wince", 400);
      eyeEls[sd].setAttribute("opacity", 0.1);
    };
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const sd = eyeAt(p);
      const c = cur();
      if (!sd || !c) return;
      if (c.kind === "cover" && S.sel === "cover") {
        st.covered = sd;
        s("circle", { cx: EY[sd].x, cy: EY[sd].y, r: 70, fill: "#8a8f98" }, coverG);
        st.busy = true;
        ctx.after(200, () => {
          st.busy = false;
          advance();
        });
        return;
      }
      if (S.sel !== "drops") return;
      if (st.redrop) {
        dropIn(sd);
        const i = st.redrop.i;
        st.redrop = null;
        S.uncue();
        st.busy = true;
        ctx.after(fast() ? 100 : 500, () => {
          st.busy = false;
          readRow(i, true);
        });
        return;
      }
      if (c.kind !== "drops") return;
      if (st.covered === sd) return; // the covered eye
      st.drops++;
      st.dropSide = st.dropSide || sd;
      if (st.dropSide !== sd) st.dropSide = "both";
      S.count(st.drops);
      ctx.tally("drops", st.drops);
      dropIn(sd);
      st.busy = true;
      ctx.after(fast() ? 60 : 250, () => (st.busy = false));
    });
    const btn = ctx.button(
      "✓",
      () => {
        const c = cur();
        if (!S.ready || st.over || st.busy || !c || c.kind !== "drops" || !st.drops) return;
        closeDrops();
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
          const eye = (sd, what) => Object.assign({ do: "tap", what }, S.client(EY[sd].x, EY[sd].y));
          const want = P.side || "right";
          if (st.redrop) return S.sel !== "drops" ? tool("drops") : eye(want, "redrop");
          if (c.kind === "cover") return S.sel !== "cover" ? tool("cover") : eye(want === "left" ? "right" : "left", "cover");
          if (c.kind === "drops") {
            if (st.drops >= c.count) return { do: "button" };
            return S.sel !== "drops" ? tool("drops") : eye(want, "drop");
          }
          if (st.awaiting) {
            const b = (st.awaiting.wrong ? naBtn : haaBtn).getBoundingClientRect();
            return { do: "tap", x: b.left + b.width / 2, y: b.top + b.height / 2, what: st.awaiting.wrong ? "na" : "haa" };
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
