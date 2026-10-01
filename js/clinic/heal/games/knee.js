/*
 * H-knee (clinic v2, design sheets part B; CQ8): the hammer, then the
 * flash-and-tap wrap. A PROTOTYPE on the CB6b close-up with flat stand-ins.
 *
 * Why: "My knee hurts." / "Let's check it and bandage it."
 * 1. Tap the knee with the hammer N times: the leg kicks (the funny bit, kept).
 * 2. The wrap: dots by the knee flash; tap each as it flashes and the bandage
 *    wraps from the last dot to this one. Stop after N turns (the count said).
 *    L1: 2 dots (left, right) at one height, alternating, no hurry.
 *    L2: 3 dots each side at different heights, flashing in a set order.
 *    L3: faster, more turns; only the sore leg glows (D10, 1 Oct: the side is said in the diagnosis only).
 * Rows (the Kutchi decides): the kick count, the turns. Mistakes are logged
 * silently and show in the end review.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const K = {
    kicks: { 1: [1, 2, 3, 4], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5] },
    turns: { 1: [2, 3, 4], 2: [3, 4, 5], 3: [3, 4, 5] },
    flashMs: { 1: 0, 2: 1800, 3: 1100 },
  };
  const WHY = { problem: "My knee hurts.", goal: "Let's check it and bandage it." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    kick: { gesture: "tap", then: "tap" },
    wrap: { gesture: "tap", then: "tap" },
  };

  function plan(level, rng, sideIn) {
    const L = Math.max(1, Math.min(3, level));
    const side = sideIn || (rng() < 0.5 ? "left" : "right");
    const kicks = HS.pick(K.kicks[L], rng);
    const turns = HS.pick(K.turns[L], rng);
    // the flash order: sides alternate; heights random from level 2
    const order = [];
    let s = rng() < 0.5 ? "l" : "r";
    for (let i = 0; i < 12; i++) {
      order.push(L === 1 ? { s, y: 1 } : { s, y: Math.floor(rng() * 3) });
      s = s === "l" ? "r" : "l";
    }
    // words, numbers and joins from data through the seam (R5); D10 (1 Oct): sides are said and tested in the
    // diagnosis only, so the close-up's rows never name the side
    const Lg = HS.L;
    const say = (m, o) => Lg.show(m, o);
    const steps = [
      { id: "kick", kind: "kick", count: kicks, row: Object.assign({ id: "kick" }, say(Lg.join(["hammer", ",", Lg.count(kicks)]), { cap: true })) },
      { id: "wrap", kind: "wrap", count: turns, order, row: Object.assign({ id: "wrap" }, say(Lg.join([Lg.then("bandage"), ",", Lg.item("turns", { n: turns })]))) },
    ];
    const rows = [
      { id: "kick-count", options: K.kicks[L], answer: kicks },
      // 13i: the flashing stops at the last turn, so the turns are no longer decided by the word alone: a hand-skill row
      { id: "wrap-turns", options: K.turns[L], answer: turns, skill: true },
    ];
    const words = [Lg.num(kicks), Lg.num(turns), Lg.w("lnk-nepoi"), HS.ph("knee"), HS.ph("bandage")];
    return { level: L, side, steps, rows, words, flashMs: K.flashMs[L] };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng, ctx.side);
    const S = HS.make(stage, ctx, { place: "limb", game: "knee" });
    const { s } = S;
    const st = { i: 0, kicks: 0, turns: 0, oi: 0, last: null, judged: {}, over: false, busy: false, flashT: 0 };
    const cur = () => P.steps[st.i] || null;
    ctx.card.setRows(P.steps.map((x) => x.row));
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);

    // the patient sits on the bed's edge facing us: thighs on the paper strip, knees at the edge,
    // shins hanging. The patient's left knee is on OUR right.
    // D10 (1 Oct, CLN-47): the close-up shows the one sore knee, in the middle (the side is the diagnosis's test)
    const KX = { left: 400, right: 400 };
    const KY = 360;
    const legs = {};
    [P.side].forEach((side) => {
      const x = KX[side];
      const g = s("g", {}, S.layer);
      s("path", { d: `M${x - 62} 250 Q${x} 236 ${x + 62} 250 L${x + 56} ${KY} L${x - 56} ${KY}Z`, fill: "#3f6fa8" }, g); // shorts
      const glow = s("ellipse", { cx: x, cy: KY, rx: 74, ry: 64, fill: "#ffe27a", opacity: 0 }, g);
      const shin = s("g", {}, g);
      s("rect", { x: x - 44, y: KY - 10, width: 88, height: 150, rx: 40, fill: "#d9a57c", stroke: "#b9845c", "stroke-width": 3 }, shin);
      s("ellipse", { cx: x + (side === "left" ? 14 : -14), cy: KY + 146, rx: 58, ry: 26, fill: "#7a4a3a" }, shin); // shoe
      s("ellipse", { cx: x, cy: KY, rx: 50, ry: 42, fill: "#e2b08a", stroke: "#b9845c", "stroke-width": 3 }, g);
      const wrap = s("g", {}, g);
      legs[side] = { g, glow, shin, wrap, x };
    });
    const sore = legs[P.side];
    const glowOn = (on) => {
      Object.values(legs).forEach((l) => l.glow.setAttribute("opacity", 0));
      if (on) sore.glow.setAttribute("opacity", 0.55);
    };
    glowOn(true);
    const dotsG = s("g", {}, S.layer);
    const dotPos = (d) => ({ x: sore.x + (d.s === "l" ? -70 : 70), y: KY - 34 + d.y * 34 });
    const dots = [];
    const drawDots = () => {
      S.clear(dotsG);
      dots.length = 0;
      if (!cur() || cur().kind !== "wrap" || S.sel !== "bandage") return;
      const ys = P.level === 1 ? [1] : [0, 1, 2];
      ["l", "r"].forEach((sd) =>
        ys.forEach((y) => {
          const p = dotPos({ s: sd, y });
          const on = !wrapped() && active() && active().s === sd && active().y === y;
          const c = s("circle", { cx: p.x, cy: p.y, r: on ? 17 : 11, fill: on ? "#f0a030" : "#fff", stroke: "#8a5a2a", "stroke-width": 3 }, dotsG);
          if (on) c.animate([{ opacity: 1 }, { opacity: 0.45 }, { opacity: 1 }], { duration: 500, iterations: Infinity });
          dots.push({ s: sd, y, x: p.x, yy: p.y });
        })
      );
    };
    const active = () => P.steps[1].order[st.oi % P.steps[1].order.length];
    // 13i: once the last turn is wrapped, no dot flashes (the child presses ✓)
    const wrapped = () => !!cur() && cur().kind === "wrap" && st.turns >= cur().count;

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const open = () => {
      const c = cur();
      ctx.card.now(c.id);
      S.cue(c.kind, CUES[c.kind], S.toolEls[c.kind === "kick" ? "hammer" : "bandage"], c.kind === "kick" ? { x: sore.x, y: KY } : () => {
        const d = dotPos(active());
        return { x: d.x, y: d.y, r: 26 };
      });
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "kick") judge("kick-count", st.kicks === c.count, `${st.kicks} of ${c.count}`);
      if (c.kind === "wrap") judge("wrap-turns", st.turns === c.count, `${st.turns} of ${c.count}`);
      ctx.card.tick(c.id);
      S.count(null);
      st.i++;
      if (cur()) open();
      else finish();
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      clearFlash();
      drawDots();
      glowOn(false);
      ctx.card.now(null);
      S.face("happy");
      S.say("That feels better!", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    // the flash: level 1 waits for the tap; from level 2 a missed flash moves on
    const clearFlash = () => clearTimeout(st.flashT);
    const armFlash = () => {
      clearFlash();
      drawDots();
      if (!P.flashMs || st.over || wrapped()) return;
      st.flashT = setTimeout(() => {
        if (!cur() || cur().kind !== "wrap") return;
        ctx.log({ type: "extra", rowId: "wrap", detail: "missed a flash" });
        st.oi++;
        armFlash();
      }, P.flashMs * (fast() ? 3 : 1));
    };

    S.tools(
      [
        { id: "hammer", glyph: "🔨" },
        { id: "bandage", glyph: "🧻" },
      ],
      (id) => {
        if (st.over) return;
        const c = cur();
        if (id === "bandage" && c.kind === "kick") close();
        if (id === "bandage" && cur() && cur().kind === "wrap") armFlash();
        else drawDots();
      }
    );
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready) return;
      const p = S.pt(e);
      const c = cur();
      if (!c || st.over || st.busy) return;
      if (c.kind === "kick" && S.sel === "hammer") {
        const leg = Object.values(legs).find((l) => Math.hypot(p.x - l.x, p.y - KY) < 70);
        if (!leg) return;
        if (leg !== sore) {
          ctx.log({ type: "wrong", rowId: "kick", detail: "the other knee" });
          S.face("ouch", 500);
          return;
        }
        st.kicks++;
        S.count(st.kicks);
        ctx.tally("hammer", st.kicks);
        // D5 (1 Oct, SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (ctx.level === 1 && st.kicks >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 450);
        const hm = s("text", { x: leg.x + 30, y: KY - 30, "font-size": 60 }, S.fx);
        hm.textContent = "🔨";
        hm.style.transformBox = "fill-box";
        hm.style.transformOrigin = "80% 80%";
        hm.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(-25deg)" }, { transform: "rotate(0deg)" }], { duration: 300 });
        ctx.after(350, () => hm.remove());
        const dir = P.side === "left" ? -1 : 1;
        leg.shin.style.transformOrigin = `${leg.x}px ${KY}px`;
        leg.shin.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${dir * 55}deg)` }, { transform: "rotate(0deg)" }], { duration: 520, easing: "ease-out" });
        S.face("happy", 600);
        ctx.sfx("pop");
        st.busy = true;
        ctx.after(fast() ? 120 : 380, () => (st.busy = false));
        return;
      }
      if (c.kind === "wrap" && S.sel === "bandage") {
        // the nearest dot (13i bug: dots 34 apart with a 30 reach overlap, and the first one found was often
        // a neighbour, so a right tap drew no turn)
        let d = null;
        dots.forEach((q) => {
          const dd = Math.hypot(p.x - q.x, p.y - q.yy);
          if (dd < 30 && (!d || dd < d.dd)) d = Object.assign({ dd }, q);
        });
        if (!d || wrapped()) return;
        const a = active();
        if (d.s !== a.s || d.y !== a.y) {
          ctx.log({ type: "extra", rowId: "wrap", detail: "not the flashing dot" });
          return;
        }
        const from = st.last || { x: sore.x + (d.s === "l" ? 70 : -70), yy: d.yy };
        s("line", { x1: from.x, y1: from.yy, x2: d.x, y2: d.yy, stroke: "#fbfaf4", "stroke-width": 22, "stroke-linecap": "round", opacity: 0.95 }, sore.wrap);
        s("line", { x1: from.x, y1: from.yy, x2: d.x, y2: d.yy, stroke: "#d8d2c4", "stroke-width": 2, "stroke-dasharray": "4 6" }, sore.wrap);
        st.last = d;
        st.turns++;
        S.count(st.turns);
        ctx.tally("bandage", st.turns);
        // D5 (1 Oct, SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (ctx.level === 1 && st.turns >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 450);
        ctx.sfx("tap");
        st.oi++;
        armFlash();
      }
    });
    const nextBtn = ctx.button(
      "✓",
      () => {
        const c = cur();
        if (!c || st.over) return;
        if (c.kind === "kick" && st.kicks > 0) close();
        else if (c.kind === "wrap" && st.turns > 0) close();
      },
      "done"
    );
    nextBtn.setAttribute("aria-label", "Next");

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab; the card's read-along says the side at L3
        open();
      },
      destroy() {
        clearFlash();
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
          if (c.kind === "kick") {
            if (st.kicks < c.count) return S.sel !== "hammer" ? tool("hammer") : Object.assign({ do: "tap", what: "knee" }, S.client(sore.x, KY));
            return tool("bandage");
          }
          if (S.sel !== "bandage") return tool("bandage");
          if (st.turns >= c.count) return { do: "button" };
          const d = dotPos(active());
          return Object.assign({ do: "tap", what: "dot", after: 30 }, S.client(d.x, d.y));
        },
        slip() {
          // one tap too many with the hammer
          const c = cur();
          if (c && c.kind === "kick" && S.sel === "hammer" && st.kicks === c.count && !st.busy) return Object.assign({ do: "tap", what: "extra tap" }, S.client(sore.x, KY));
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
    id: "knee",
    part: "knee",
    ailments: ["knee-bump", "leg-break"],
    items: ["hammer", "bandage"],
    itemsFor: { "knee-bump": ["hammer", "bandage"], "leg-break": ["hammer", "bandage"] },
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
