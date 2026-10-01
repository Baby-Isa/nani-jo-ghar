/*
 * H-foot (clinic v2, design sheets part B; CQ12). A PROTOTYPE on the CB6b
 * close-up (the foot lies on the paper strip) with flat stand-ins.
 *
 * Why: "Ow, something's in my foot!" / "Let's take the splinters out."
 * 1. Soak: the doctor says which water (paani [hot] / [cold] / [lukewarm]:
 *    the temperature words wait for the recording, koso / nokoso?) and how
 *    many jugs (the count keeps a blind guess under 10% at L1).
 * 2. Pull each splinter out along its short path without touching the
 *    edges (the buzz-wire game): a touch makes the patient wince and the
 *    splinter slides back a little.
 *    L1: 1 straight. L2: 2, gently curved. L3: 3, in the toes, in the order
 *    said (pela [big toe], ne poi ...).
 * 3. A plaster where each one was.
 * Level 3 draws both feet (13): the splinters are in both, the patient says which foot,
 * and pulling one from the other foot is the mistake (the foot-side row).
 * Rows: the soak (which water, how many jugs); the toe order and the foot at L3.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const TEMPS = ["hot", "cold", "lukewarm"];
  const K = { jugs: { 1: [1, 2, 3, 4], 2: [1, 2, 3, 4], 3: [2, 3, 4] }, splinters: { 1: 1, 2: 2, 3: 3 }, halfW: 20, slideBack: 0.3 };
  const TOES = ["big toe", "middle toe", "little toe"];
  const WHY = { problem: "Ow, something's in my foot!", goal: "Let's take the splinters out." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    soak: { gesture: "tap", then: "tap" },
    pull: { gesture: "drag" },
    plaster: { gesture: "tap", then: "tap" },
  };

  // the foot, top view, lying on the paper strip; toes up the screen. A left foot: big toe on our right.
  const FOOT = { x: 400, y: 380 };
  const TOE = { "big toe": { x: 492, y: 250 }, "middle toe": { x: 388, y: 240 }, "little toe": { x: 300, y: 282 } };
  const TOE2 = [{ x: 438, y: 238, r: 26 }, { x: 342, y: 256, r: 22 }]; // the second and fourth toes (no splinters)
  const LEN = 0.35; // the splinter's length along its path

  function paths(level, rng) {
    const out = [];
    if (level === 1) out.push({ id: "s0", pts: line({ x: 390, y: 380 }, { x: 250, y: 380 }) });
    else if (level === 2) {
      out.push({ id: "s0", pts: curve({ x: 420, y: 400 }, { x: 330, y: 340 }, { x: 250, y: 400 }) });
      out.push({ id: "s1", pts: curve({ x: 420, y: 440 }, { x: 490, y: 500 }, { x: 560, y: 430 }) });
    } else
      TOES.forEach((t, i) => {
        const p = TOE[t];
        out.push({ id: `s${i}`, toe: t, pts: curve({ x: p.x, y: p.y + 30 }, { x: p.x + (i - 1) * 25, y: p.y - 30 }, { x: p.x + (i - 1) * 40, y: p.y - 90 }) });
      });
    return out;
  }
  function line(a, b) {
    const pts = [];
    for (let k = 0; k <= 20; k++) pts.push({ x: a.x + ((b.x - a.x) * k) / 20, y: a.y + ((b.y - a.y) * k) / 20 });
    return pts;
  }
  function curve(a, c, b) {
    const pts = [];
    for (let k = 0; k <= 20; k++) {
      const t = k / 20;
      pts.push({ x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y });
    }
    return pts;
  }

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const temp = HS.pick(TEMPS, rng);
    const jugs = HS.pick(K.jugs[L], rng);
    const splinters = paths(L, rng);
    const order = L === 3 ? HS.shuffle(TOES, rng) : null;
    // D10 (1 Oct): sides are said and tested in the diagnosis only; the close-up shows the one sore foot
    // (supersedes 29 Sept 13 "both feet at level 3")
    const side = null;
    // words, numbers and joins from data through the seam (R5)
    const Lg = HS.L;
    const say = (m, o) => Lg.show(m, o);
    const steps = [{ id: "soak", kind: "soak", temp, jugs, row: Object.assign({ id: "soak" }, say(Lg.join([Lg.item("cook-paani"), temp, ",", Lg.item("cl-jugs", { n: jugs })]), { cap: true })) }];
    // the toe order (L3) is a sequence on the card (13h): pela [big toe], ne poi ...
    const pullRows = order ? order.map((t, i) => Object.assign({ id: `pull${i}`, seq: "toes" }, say(Lg.step(i, t, { lower: true })))) : null;
    steps.push({ id: "pull", kind: "pull", order, row: pullRows ? pullRows[0] : Object.assign({ id: "pull" }, say(Lg.item("cl-splinters"), { cap: true })), rows: pullRows });
    steps.push({ id: "plaster", kind: "plaster", row: { id: "plaster", kutchi: null, english: "A plaster on each spot", placeholder: true } });
    const rows = [
      { id: "soak-water", options: TEMPS, answer: temp, placeholder: true },
      { id: "soak-jugs", options: K.jugs[L], answer: jugs },
    ];
    if (order) rows.push({ id: "toe-order", seq: TOES, answer: order, placeholder: true });
    if (side) rows.push({ id: "foot-side", options: ["left", "right"], answer: side, placeholder: true });
    const words = [Lg.w("cook-paani"), Lg.num(jugs), HS.ph(temp), HS.ph("splinter")];
    if (order) words.push(Lg.w("lnk-pela"), Lg.w("lnk-nepoi"), HS.ph("big toe"), HS.ph("little toe"));
    if (side) words.push(HS.ph(`my ${side} foot`));
    return { level: L, steps, rows, words, splinters, side };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "limb", game: "foot" });
    const { s } = S;
    const st = { i: 0, jugs: 0, temp: null, judged: {}, over: false, busy: false, prog: {}, pulled: [], plasters: {}, otherOut: [] };
    P.splinters.forEach((q) => (st.prog[q.id] = LEN)); // the head starts LEN along: the splinter lies from the spot out
    const cur = () => P.steps[st.i] || null;
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    ctx.card.setRows([].concat(...P.steps.map((x) => x.rows || [x.row])));

    // level 3: both feet, smaller, side by side (a left foot has its big toe on our right; the right foot is its
    // mirror); the named one is the one to work on. The drawing below is in one foot's own units (T maps them).
    const two = !!P.side;
    const KF = 0.6;
    const place = (left) => (left ? { tx: 560 - KF * 400, ty: 400 - KF * 380, sx: KF, sy: KF } : { tx: 240 + KF * 400, ty: 400 - KF * 380, sx: -KF, sy: KF });
    const T = two ? place(P.side === "left") : { tx: 0, ty: 0, sx: 1, sy: 1 };
    const O = two ? place(P.side !== "left") : null;
    const toLocal = (p, M = T) => ({ x: (p.x - M.tx) / M.sx, y: (p.y - M.ty) / M.sy });
    const toSvg = (p, M = T) => ({ x: M.tx + M.sx * p.x, y: M.ty + M.sy * p.y });
    const tf = (M) => `translate(${M.tx} ${M.ty}) scale(${M.sx} ${M.sy})`;
    // the bowl under the foot (or both feet), then the foot
    const bowl = two ? { cx: 400, cy: 455, rx: 360, ry: 62 } : { cx: FOOT.x, cy: FOOT.y + 60, rx: 250, ry: 70 };
    const water = s("ellipse", { cx: bowl.cx, cy: bowl.cy, rx: bowl.rx, ry: bowl.ry, fill: "#bfe0f5", opacity: 0 }, S.layer);
    s("ellipse", { cx: bowl.cx, cy: bowl.cy, rx: bowl.rx, ry: bowl.ry, fill: "none", stroke: "#8a9fb0", "stroke-width": 6 }, S.layer);
    const drawFoot = (g) => {
      s("ellipse", { cx: FOOT.x + 10, cy: FOOT.y + 20, rx: 150, ry: 120, fill: "#e2b08a", stroke: "#b9845c", "stroke-width": 4 }, g);
      Object.entries(TOE).forEach(([t, p]) => s("ellipse", { cx: p.x, cy: p.y, rx: t === "big toe" ? 36 : t === "middle toe" ? 25 : 19, ry: t === "big toe" ? 42 : t === "middle toe" ? 30 : 23, fill: "#e2b08a", stroke: "#b9845c", "stroke-width": 4 }, g));
      TOE2.forEach((t) => s("ellipse", { cx: t.x, cy: t.y, rx: t.r, ry: t.r * 1.2, fill: "#e2b08a", stroke: "#b9845c", "stroke-width": 4 }, g));
    };
    // the other foot (level 3): its own splinters, the same paths mirrored; pulling one of them is the wrong foot
    let otherG = null;
    if (two) {
      otherG = s("g", { transform: tf(O) }, S.layer);
      drawFoot(otherG);
    }
    const mainG = s("g", { transform: tf(T) }, S.layer);
    drawFoot(mainG);
    const pathG = s("g", {}, mainG);
    const splG = s("g", {}, mainG);
    const plG = s("g", {}, mainG);
    const otherSplG = two ? s("g", {}, otherG) : null;
    const at = (q, t) => {
      const f = Math.max(0, Math.min(1, t)) * (q.pts.length - 1);
      const k = Math.floor(f);
      const a = q.pts[k];
      const b = q.pts[Math.min(k + 1, q.pts.length - 1)];
      return { x: a.x + (b.x - a.x) * (f - k), y: a.y + (b.y - a.y) * (f - k) };
    };
    const draw = () => {
      S.clear(pathG);
      S.clear(splG);
      const c = cur();
      if (otherSplG) {
        S.clear(otherSplG);
        P.splinters.forEach((q) => {
          if (st.otherOut.includes(q.id)) return;
          const tail = [];
          for (let k = 0; k <= 8; k++) tail.push(at(q, LEN - (k / 8) * LEN));
          s("path", { d: tail.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" "), fill: "none", stroke: "#6a3e1e", "stroke-width": 7, "stroke-linecap": "round" }, otherSplG);
          const h = at(q, LEN);
          s("circle", { cx: h.x, cy: h.y, r: 9, fill: "#8a5a2a", stroke: "#fff", "stroke-width": 2 }, otherSplG);
        });
      }
      P.splinters.forEach((q) => {
        if (st.pulled.includes(q.id)) return;
        const d = q.pts.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" ");
        if (c && c.kind === "pull") {
          s("path", { d, fill: "none", stroke: "#fff7e8", "stroke-width": K.halfW * 2, "stroke-linecap": "round", opacity: 0.75 }, pathG);
          s("path", { d, fill: "none", stroke: "#c98a5c", "stroke-width": 2, "stroke-dasharray": "3 5" }, pathG);
        }
        // the splinter: from its head (the progress point) back 50 units along the path
        const t = st.prog[q.id];
        const tail = [];
        for (let k = 0; k <= 8; k++) tail.push(at(q, t - (k / 8) * LEN));
        s("path", { d: tail.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" "), fill: "none", stroke: "#6a3e1e", "stroke-width": 7, "stroke-linecap": "round" }, splG);
        const h = at(q, t);
        s("circle", { cx: h.x, cy: h.y, r: 9, fill: "#8a5a2a", stroke: "#fff", "stroke-width": 2 }, splG);
      });
      S.clear(plG);
      P.splinters.forEach((q) => {
        const spot = q.pts[0];
        if (st.plasters[q.id]) {
          s("rect", { x: spot.x - 30, y: spot.y - 16, width: 60, height: 32, rx: 10, fill: "#f2d2a8", stroke: "#b98a60", "stroke-width": 2 }, plG);
          s("rect", { x: spot.x - 9, y: spot.y - 8, width: 18, height: 16, rx: 3, fill: "#fff", opacity: 0.6 }, plG);
        } else if (st.pulled.includes(q.id) && c && c.kind === "plaster") s("circle", { cx: spot.x, cy: spot.y, r: 18, fill: "none", stroke: "#2e8b7a", "stroke-width": 4, "stroke-dasharray": "5 4" }, plG);
        else if (st.pulled.includes(q.id)) s("circle", { cx: spot.x, cy: spot.y, r: 6, fill: "#d9546a" }, plG);
      });
    };
    draw();

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const open = () => {
      const c = cur();
      ctx.card.now(c.id);
      draw();
      if (c.kind === "soak") S.cue("soak", CUES.soak, S.toolEls["jug-" + c.temp], { x: bowl.cx, y: bowl.cy });
      if (c.kind === "pull") {
        const q = c.order ? P.splinters.find((x) => x.toe === c.order[0]) : P.splinters[0];
        S.cue("pull", Object.assign({ to: toSvg(at(q, 1)) }, CUES.pull), toSvg(at(q, st.prog[q.id])));
      }
      if (c.kind === "plaster") S.cue("plaster", CUES.plaster, S.toolEls.plaster, toSvg(P.splinters[0].pts[0]));
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "soak") {
        judge("soak-water", st.temp === c.temp, st.temp || "none");
        judge("soak-jugs", st.jugs === c.jugs, `${st.jugs} of ${c.jugs}`);
      }
      if (c.kind === "pull" && two && !("foot-side" in st.judged)) judge("foot-side", true, P.side);
      if (c.kind === "pull" && c.order) {
        const got = st.pulled.map((id) => P.splinters.find((q) => q.id === id).toe);
        judge("toe-order", JSON.stringify(got) === JSON.stringify(c.order), got.join(", "));
      }
      ctx.card.tick(c.id);
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
      S.say("It doesn't hurt any more!", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    const TCOL = { hot: "#e8503a", cold: "#3f8fd8", lukewarm: "#9a7ad0" };
    const GL = { hot: "🔥", cold: "❄️", lukewarm: "〰️" };
    S.tools(TEMPS.map((t) => ({ id: "jug-" + t, glyph: "🫗", label: GL[t], bg: TCOL[t] + "33" })).concat([{ id: "plaster", glyph: "🩹" }]), () => {});

    let drag = null;
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const w = S.pt(e);
      const p = toLocal(w);
      const c = cur();
      if (!c) return;
      if (c.kind === "soak") {
        if (!/^jug-/.test(S.sel || "")) return;
        if (two ? Math.hypot((w.x - bowl.cx) / 1.9, w.y - bowl.cy + 40) > 190 : Math.hypot((p.x - FOOT.x) / 1.6, p.y - FOOT.y - 30) > 170) return;
        const t = S.sel.slice(4);
        if (st.temp && st.temp !== t) st.temp = "mixed";
        else st.temp = t;
        st.jugs++;
        S.count(st.jugs);
        ctx.tally("jug", st.jugs);
        // D5 (1 Oct, SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (P.level === 1 && st.jugs >= c.jugs) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 600);
        water.setAttribute("fill", TCOL[t]);
        water.setAttribute("opacity", Math.min(0.55, 0.15 + st.jugs * 0.1));
        S.face(t === "hot" ? "hot" : t === "cold" ? "cold" : "happy", 600);
        st.busy = true;
        ctx.after(fast() ? 60 : 300, () => (st.busy = false));
        return;
      }
      if (c.kind === "pull") {
        const q = P.splinters.find((x) => !st.pulled.includes(x.id) && Math.hypot(p.x - at(x, st.prog[x.id]).x, p.y - at(x, st.prog[x.id]).y) < 28);
        if (!q && two) {
          // the other foot: the wrong one (the patient said which); a wince, logged, scored once
          const po = toLocal(w, O);
          const qo = P.splinters.find((x) => Math.hypot(po.x - at(x, LEN).x, po.y - at(x, LEN).y) < 34);
          if (qo) {
            if (!("foot-side" in st.judged)) judge("foot-side", false, P.side === "left" ? "right" : "left");
            else ctx.log({ type: "extra", rowId: "foot-side", detail: "the other foot again" });
            S.face("wince", 600);
            S.say(`[My ${P.side} foot!]`, "patient");
          }
          return;
        }
        if (!q) return;
        drag = q;
        S.svg.setPointerCapture && S.svg.setPointerCapture(e.pointerId);
        return;
      }
      if (c.kind === "plaster" && S.sel === "plaster") {
        const q = P.splinters.find((x) => !st.plasters[x.id] && Math.hypot(p.x - x.pts[0].x, p.y - x.pts[0].y) < 34);
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
      if (!drag) return;
      const q = drag;
      const p = toLocal(S.pt(e));
      // the nearest point on the path, near where the splinter is now
      const t0 = st.prog[q.id];
      let best = { t: t0, d: 1e9 };
      for (let t = Math.max(0, t0 - 0.1); t <= Math.min(1, t0 + 0.25); t += 0.01) {
        const a = at(q, t);
        const d = Math.hypot(p.x - a.x, p.y - a.y);
        if (d < best.d) best = { t, d };
      }
      if (best.d > K.halfW) {
        // touched the side: a wince, and it slides back a little
        drag = null;
        st.prog[q.id] = Math.max(LEN, t0 - K.slideBack);
        S.face("wince", 600);
        ctx.log({ type: "extra", rowId: "pull", detail: "touched the side" });
        draw();
        return;
      }
      if (best.t > t0) st.prog[q.id] = best.t;
      if (st.prog[q.id] >= 0.97) {
        drag = null;
        st.pulled.push(q.id);
        if (cur() && cur().rows) ctx.card.tick(`pull${st.pulled.length - 1}`);
        S.face("happy", 600);
        ctx.sfx("pop");
        const fly = s("line", { x1: at(q, 1).x, y1: at(q, 1).y, x2: at(q, 1 - LEN).x, y2: at(q, 1 - LEN).y, stroke: "#6a3e1e", "stroke-width": 7, "stroke-linecap": "round" }, mainG);
        fly.animate([{ transform: "translate(0,0)" }, { transform: "translate(120px,-160px)", opacity: 0 }], { duration: 600, fill: "forwards" });
        ctx.after(700, () => fly.remove());
        if (st.pulled.length === P.splinters.length) {
          st.busy = true;
          ctx.after(fast() ? 100 : 500, () => {
            st.busy = false;
            close();
          });
        }
      }
      draw();
    });
    const up = () => (drag = null);
    ctx.on(S.svg, "pointerup", up);
    ctx.on(S.svg, "pointercancel", up);
    const btn = ctx.button(
      "✓",
      () => {
        const c = cur();
        if (!S.ready || st.over || st.busy || !c || c.kind !== "soak" || !st.jugs) return;
        close();
      },
      "done"
    );
    btn.setAttribute("aria-label", "Next");

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        S.say(P.side ? `[My ${P.side} foot]` : "[My foot]", "patient"); // level 3: which foot is the test (13)
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
          const cl = (p0) => {
            const p = toSvg(p0);
            const q = S.client(p.x, p.y);
            return [q.x, q.y];
          };
          if (c.kind === "soak") {
            if (st.jugs >= c.jugs) return { do: "button" };
            return S.sel !== "jug-" + c.temp ? tool("jug-" + c.temp) : Object.assign({ do: "tap", what: "pour" }, S.client(bowl.cx, bowl.cy));
          }
          if (c.kind === "pull") {
            const q = c.order ? P.splinters.find((x) => x.toe === c.order[st.pulled.length]) : P.splinters.find((x) => !st.pulled.includes(x.id));
            const pts = [];
            for (let t = st.prog[q.id]; t <= 1.0001; t += 0.05) pts.push(cl(at(q, t)));
            pts.push(cl(at(q, 1)));
            return { do: "drag", pts, steps: 2, what: "pull " + q.id };
          }
          if (S.sel !== "plaster") return tool("plaster");
          const q = P.splinters.find((x) => !st.plasters[x.id]);
          const sp = toSvg(q.pts[0]);
          return Object.assign({ do: "tap", what: "plaster" }, S.client(sp.x, sp.y));
        },
        slip() {
          // one jug too many
          const c = cur();
          if (!S.ready || st.busy || !c || c.kind !== "soak" || st.jugs !== c.jugs || S.sel !== "jug-" + c.temp) return null;
          return Object.assign({ do: "tap", what: "extra jug" }, S.client(bowl.cx, bowl.cy));
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
