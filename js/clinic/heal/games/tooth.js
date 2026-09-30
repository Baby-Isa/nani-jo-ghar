/*
 * H-tooth (clinic v2, design sheets part B; CQ9): brush, drill, fill.
 * A PROTOTYPE on the CB6b close-up (a head close-up: the mouth sits in the
 * upper half against the wall) with flat stand-ins. No green bug.
 *
 * Why: "My tooth hurts." / "Let's brush, fix it and fill it."
 * 1. Brush: a toothbrush fixed across the mouth. Drag its head in the called
 *    order ("Just Dance"), one move per drag. L1 2 moves, L2 4, L3 6.
 *    Left / right are always the patient's own side (patient faces us, so
 *    their left is on our right): English placeholders at L1-2, dabo / jamno at L3.
 *    (L1-2 use all four moves too, so a blind guess stays under 10%.)
 * 2. Drill the dark decay and leave the white: too much white and the tooth
 *    chips. L3 adds a gentle timer.
 * 3. Fill: press and hold the doctor's tube; it fills; stop at the line.
 * Rows: the brush order (the words decide it); the drill and the fill are
 * hand-skill rows (scored, but a blind player can do them too).
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const K = {
    moves: { 1: 2, 2: 4, 3: 6 },
    chipAt: 7, // white cells drilled before the tooth chips
    drillMs: { 3: 14000 },
    fillMs: 2600, // empty to full while held
    line: 0.7,
    tol: 0.09,
  };
  const WHY = { problem: "My tooth hurts.", goal: "Let's brush, fix it and fill it." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    brush: { gesture: "swipe" },
    drill: { gesture: "swipe" },
    fill: { gesture: "hold" },
  };
  const DIRS = ["up", "down", "left", "right"];
  const DIR_K = { left: "dabo", right: "jamno" };
  // the patient's own left is on our right
  const SCREEN = { up: [0, -1], down: [0, 1], left: [1, 0], right: [-1, 0] };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const moves = [];
    for (let i = 0; i < K.moves[L]; i++) {
      let m;
      do m = HS.pick(DIRS, rng);
      while (moves.length && m === moves[moves.length - 1]);
      moves.push(m);
    }
    const word = (m) => (L === 3 && DIR_K[m] ? DIR_K[m] : `[${m}]`);
    // the decay: a blob of cells on the tooth (6 x 5 grid)
    const decay = [];
    const cx = 1 + Math.floor(rng() * 3);
    const cy = 1 + Math.floor(rng() * 2);
    for (let y = 0; y < 5; y++) for (let x = 0; x < 6; x++) if (Math.hypot(x - cx - 0.5, (y - cy - 0.5) * 1.2) < 2.0) decay.push(`${x},${y}`);
    const steps = [
      { id: "brush", kind: "brush", moves, row: { id: "brush", kutchi: `[Brush:] ${moves.map(word).join(", ")}`, english: `Brush: ${moves.join(", ")}` } },
      { id: "drill", kind: "drill", decay, timer: K.drillMs[L] || 0, row: { id: "drill", kutchi: null, english: "Drill the bad bits", placeholder: true } },
      { id: "fill", kind: "fill", row: { id: "fill", kutchi: null, english: "Fill it to the line", placeholder: true } },
    ];
    const rows = [
      { id: "brush-order", seq: DIRS, answer: moves, placeholder: L < 3 }, // up / down wait for the recording
      { id: "drill-care", skill: true, answer: true },
      { id: "fill-line", skill: true, answer: true },
    ];
    const words = [HS.ph("up"), HS.ph("down"), HS.ph("tooth"), HS.ph("brush")];
    if (L === 3) words.push({ kutchi: "dabo", english: "left" }, { kutchi: "jamno", english: "right" });
    return { level: L, steps, rows, words };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "head", game: "tooth" });
    const { s } = S;
    const st = { i: 0, done: [], judged: {}, over: false, busy: false, cleared: new Set(), white: 0, chipped: false, fill: 0, holding: false };
    const cur = () => P.steps[st.i] || null;
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    ctx.card.setRows(P.steps.map((x) => x.row));

    /* ---- 1. the mouth and the fixed brush ---- */
    const M = { x: 400, y: 170 };
    const mouthG = s("g", {}, S.layer);
    s("ellipse", { cx: M.x, cy: M.y, rx: 230, ry: 130, fill: "#c9555a" }, mouthG);
    s("ellipse", { cx: M.x, cy: M.y, rx: 200, ry: 100, fill: "#6a1f2a" }, mouthG);
    for (let k = 0; k < 7; k++) {
      s("rect", { x: M.x - 175 + k * 50, y: M.y - 98, width: 46, height: 50, rx: 10, fill: "#fbfaf4", stroke: "#d8d2c4", "stroke-width": 2 }, mouthG);
      s("rect", { x: M.x - 175 + k * 50, y: M.y + 48, width: 46, height: 50, rx: 10, fill: "#fbfaf4", stroke: "#d8d2c4", "stroke-width": 2 }, mouthG);
    }
    s("ellipse", { cx: M.x, cy: M.y + 30, rx: 120, ry: 40, fill: "#e0707a" }, mouthG);
    const brushG = s("g", {}, mouthG);
    s("rect", { x: M.x + 30, y: M.y - 9, width: 300, height: 18, rx: 9, fill: "#4aa3c8" }, brushG); // handle, off to the side
    const head = s("g", {}, brushG);
    s("rect", { x: M.x - 40, y: M.y - 22, width: 80, height: 44, rx: 12, fill: "#4aa3c8" }, head);
    for (let k = 0; k < 6; k++) s("rect", { x: M.x - 34 + k * 12, y: M.y - 34, width: 8, height: 16, rx: 3, fill: "#fff" }, head);
    const foam = s("g", {}, mouthG);
    const arrowG = s("g", {}, S.fx);

    /* ---- 2. the tooth close-up and 3. the tube ---- */
    const T = { x: 400, y: 150, w: 240, h: 200 };
    const cellW = T.w / 6;
    const cellH = T.h / 5;
    const toothG = s("g", { opacity: 0 }, S.layer);
    s("path", { d: `M${T.x - 140} ${T.y - 110} Q${T.x} ${T.y - 150} ${T.x + 140} ${T.y - 110} L${T.x + 130} ${T.y + 110} Q${T.x + 100} ${T.y + 200} ${T.x + 50} ${T.y + 130} Q${T.x} ${T.y + 100} ${T.x - 50} ${T.y + 130} Q${T.x - 100} ${T.y + 200} ${T.x - 130} ${T.y + 110}Z`, fill: "#fbfaf4", stroke: "#cfc8b8", "stroke-width": 5 }, toothG);
    const cellsG = s("g", {}, toothG);
    const cellEl = {};
    const cellXY = (key) => {
      const [x, y] = key.split(",").map(Number);
      return { x: T.x - T.w / 2 + (x + 0.5) * cellW, y: T.y - T.h / 2 + (y + 0.5) * cellH };
    };
    const drawCells = () => {
      S.clear(cellsG);
      P.steps[1].decay.forEach((k) => {
        const p = cellXY(k);
        cellEl[k] = s("rect", { x: p.x - cellW / 2, y: p.y - cellH / 2, width: cellW + 1, height: cellH + 1, rx: 8, fill: st.cleared.has(k) ? "#f2c9c0" : "#4a3528" }, cellsG);
      });
    };
    const chipEl = s("path", { d: `M${T.x + 100} ${T.y - 118} L${T.x + 140} ${T.y - 110} L${T.x + 136} ${T.y - 60} Z`, fill: "#6a1f2a", opacity: 0 }, toothG);
    const drillEl = s("text", { x: -100, y: -100, "font-size": 46, opacity: 0 }, S.fx);
    drillEl.textContent = "🪛";
    // the fill: the hole's cup, the line, the rising paste, the doctor's tube
    const fillG = s("g", { opacity: 0 }, S.layer);
    const hole = { x: T.x - 60, y: T.y - 70, w: 120, h: 120 };
    s("rect", { x: hole.x, y: hole.y, width: hole.w, height: hole.h, rx: 16, fill: "#f2c9c0", stroke: "#b98a80", "stroke-width": 3 }, fillG);
    const paste = s("rect", { x: hole.x + 4, y: hole.y + hole.h, width: hole.w - 8, height: 0, rx: 12, fill: "#b8c6d8" }, fillG);
    const lineY = hole.y + hole.h * (1 - K.line);
    s("line", { x1: hole.x - 20, y1: lineY, x2: hole.x + hole.w + 20, y2: lineY, stroke: "#2e8b7a", "stroke-width": 5, "stroke-dasharray": "10 6" }, fillG);
    const tube = s("g", {}, fillG);
    s("rect", { x: T.x + 120, y: T.y - 170, width: 70, height: 150, rx: 16, fill: "#8fb3d9", stroke: "#4a6f98", "stroke-width": 4 }, tube);
    s("path", { d: `M${T.x + 140} ${T.y - 20} L${T.x + 170} ${T.y - 20} L${T.x + 150} ${T.y + 10}Z`, fill: "#4a6f98" }, tube);
    s("text", { x: T.x + 128, y: T.y - 80, "font-size": 30 }, tube).textContent = "🧪";
    const TUBE = { x: T.x + 155, y: T.y - 95, r: 80 };

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    let timer = null;
    const view = (k) => {
      mouthG.setAttribute("opacity", k === "brush" ? 1 : 0);
      toothG.setAttribute("opacity", k === "drill" || k === "fill" ? 1 : 0);
      cellsG.setAttribute("opacity", k === "drill" ? 1 : 0);
      fillG.setAttribute("opacity", k === "fill" ? 1 : 0);
    };
    const open = () => {
      const c = cur();
      view(c.kind);
      ctx.card.now(c.id);
      if (c.kind === "brush") S.cue("brush", CUES.brush, { x: M.x, y: M.y });
      if (c.kind === "drill") {
        drawCells();
        S.cue("drill", CUES.drill, cellXY(c.decay[0]));
        if (c.timer) timer = S.timer(c.timer * (fast() ? 2 : 1), () => cur() === c && close());
      }
      if (c.kind === "fill") S.cue("fill", CUES.fill, { x: TUBE.x, y: TUBE.y });
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "brush") judge("brush-order", JSON.stringify(st.done) === JSON.stringify(c.moves), st.done.join(" "));
      if (c.kind === "drill") {
        if (timer) timer.stop();
        judge("drill-care", !st.chipped && st.cleared.size === c.decay.length, `${st.cleared.size}/${c.decay.length} cleared, ${st.white} white${st.chipped ? ", chipped" : ""}`);
      }
      if (c.kind === "fill") judge("fill-line", Math.abs(st.fill - K.line) <= K.tol, `filled to ${Math.round(st.fill * 100)}%`);
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
      S.say("It doesn't hurt now!", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    /* ---- the gestures ---- */
    let drag = null;
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      if (!c) return;
      if (c.kind === "brush" && Math.hypot(p.x - M.x, p.y - M.y) < 80) drag = { from: p, fired: false };
      else if (c.kind === "drill") {
        drag = { drill: true };
        drillAt(p);
      } else if (c.kind === "fill" && Math.hypot(p.x - TUBE.x, p.y - TUBE.y) < TUBE.r) startFill();
      if (drag || st.holding) S.svg.setPointerCapture && S.svg.setPointerCapture(e.pointerId);
    });
    ctx.on(S.svg, "pointermove", (e) => {
      if (!drag) return;
      const p = S.pt(e);
      if (drag.drill) return drillAt(p);
      if (drag.fired) return;
      const dx = p.x - drag.from.x;
      const dy = p.y - drag.from.y;
      if (Math.hypot(dx, dy) < 45) return;
      drag.fired = true;
      const scr = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
      const m = DIRS.find((d) => SCREEN[d][0] === scr[0] && SCREEN[d][1] === scr[1]);
      brushMove(m);
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
      st.done.push(m);
      const [dx, dy] = SCREEN[m];
      head.animate([{ transform: "translate(0,0)" }, { transform: `translate(${dx * 60}px,${dy * 45}px)` }, { transform: "translate(0,0)" }], { duration: 420 });
      const f = s("circle", { cx: M.x + dx * 60 + (ctx.rng() - 0.5) * 30, cy: M.y + dy * 45, r: 10, fill: "#fff", opacity: 0.9 }, foam);
      ctx.after(1500, () => f.remove());
      S.count(st.done.length);
      ctx.tally("brush", st.done.length);
      S.face("happy", 400);
      ctx.sfx("tap");
      if (st.done.length >= c.moves.length) {
        st.busy = true;
        ctx.after(fast() ? 100 : 600, () => {
          st.busy = false;
          close();
        });
      }
    };
    const drillAt = (p) => {
      const c = cur();
      drillEl.setAttribute("x", p.x - 10);
      drillEl.setAttribute("y", p.y + 10);
      drillEl.setAttribute("opacity", 1);
      const gx = Math.floor((p.x - (T.x - T.w / 2)) / cellW);
      const gy = Math.floor((p.y - (T.y - T.h / 2)) / cellH);
      if (gx < 0 || gy < 0 || gx > 5 || gy > 4) return;
      const key = `${gx},${gy}`;
      if (c.decay.includes(key)) {
        if (!st.cleared.has(key)) {
          st.cleared.add(key);
          cellEl[key] && cellEl[key].setAttribute("fill", "#f2c9c0");
          ctx.sfx("pop");
          if (st.cleared.size === c.decay.length) {
            drag = null;
            drillEl.setAttribute("opacity", 0);
            st.busy = true;
            S.face("happy", 600);
            ctx.after(fast() ? 100 : 500, () => {
              st.busy = false;
              if (cur() === c) close();
            });
          }
        }
      } else {
        const wk = `w${key}`;
        if (!st[wk]) {
          st[wk] = true;
          st.white++;
          S.face("wince", 400);
          if (st.white >= K.chipAt && !st.chipped) {
            st.chipped = true;
            chipEl.setAttribute("opacity", 1);
            S.face("ouch", 900);
            S.say("Ow! A chip!", "patient");
          }
        }
      }
    };
    let fillT = null;
    const startFill = () => {
      st.holding = true;
      const t0 = Date.now();
      const f0 = st.fill;
      const step = () => {
        if (!st.holding) return;
        st.fill = Math.min(1.1, f0 + (Date.now() - t0) / K.fillMs);
        const hgt = Math.min(1, st.fill) * hole.h;
        paste.setAttribute("y", hole.y + hole.h - hgt);
        paste.setAttribute("height", hgt);
        if (st.fill >= 1.1) return stopFill();
        fillT = root.requestAnimationFrame ? root.requestAnimationFrame(step) : setTimeout(step, 16);
      };
      step();
    };
    const stopFill = () => {
      st.holding = false;
      if (st.fill > 1) S.say("Too much!", "patient");
      const c = cur();
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
        fillOk: () => st.fill >= K.line,
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy) return { do: "wait" };
          const cl = (x, y) => S.client(x, y);
          if (c.kind === "brush") {
            const m = c.moves[st.done.length];
            const [dx, dy] = SCREEN[m];
            const a = cl(M.x, M.y);
            const b = cl(M.x + dx * 80, M.y + dy * 80);
            return { do: "drag", pts: [[a.x, a.y], [b.x, b.y]], what: m };
          }
          if (c.kind === "drill") {
            // a careful path: cell to cell over the decay only
            const pts = c.decay.filter((k) => !st.cleared.has(k)).map((k) => {
              const p = cellXY(k);
              const q = cl(p.x, p.y);
              return [q.x, q.y];
            });
            return pts.length ? { do: "drag", pts: [pts[0]].concat(pts), steps: 2, what: "drill" } : { do: "wait" };
          }
          const t = cl(TUBE.x, TUBE.y);
          return { do: "hold", x: t.x, y: t.y, until: "__heal.run.controller.debug.fillOk()" };
        },
        slip() {
          // brush one move the wrong way
          const c = cur();
          if (!S.ready || !c || c.kind !== "brush" || st.busy || st.done.length) return null;
          const m = DIRS.find((d) => d !== c.moves[0]);
          const [dx, dy] = SCREEN[m];
          const a = S.client(M.x, M.y);
          const b = S.client(M.x + dx * 80, M.y + dy * 80);
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
