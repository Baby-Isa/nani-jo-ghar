/*
 * H-knee (clinic v2, design sheets part B; CQ8): the hammer, then the
 * flash-and-tap wrap. A PROTOTYPE on the CB6b close-up with flat stand-ins.
 *
 * Why: "My knee hurts." / "Let's check it and bandage it."
 * 1. Tap the knee with the hammer N times: the leg kicks (the funny bit, kept).
 * 2. The wrap: one dot by the knee lights and WAITS for the tap (CLN-48, D15b: nothing moves on by itself); tap
 *    it and the bandage wraps from the last dot to this one, and the next dot lights somewhere new. The speed is
 *    the child's own (the time badge rewards it). Stop after N turns (the count said).
 *    L1: 2 dots (behind, in front) at one height, alternating.
 *    L2: 3 dots each side at different heights, in a set order.
 *    L3: more turns, heard only (the closed card). One knee, side-on (D10, D2: the side is the diagnosis's test).
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
  };
  const WHY = { problem: "knee-why", goal: "knee-goal" }; // line keys in data/clinic/heal/knee.json (the engine says them)
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
      { id: "wrap", kind: "wrap", count: turns, order, row: Object.assign({ id: "wrap" }, say(Lg.join([Lg.then("cl-bandage"), ",", Lg.item("turns", { n: turns })]))) },
    ];
    const rows = [
      { id: "kick-count", options: K.kicks[L], answer: kicks },
      // 13i: the flashing stops at the last turn, so the turns are no longer decided by the word alone: a hand-skill row
      { id: "wrap-turns", options: K.turns[L], answer: turns, skill: true },
    ];
    const words = [Lg.num(kicks), Lg.num(turns), Lg.w("lnk-nepoi"), Lg.w("body-knee"), Lg.w("cl-bandage")];
    return { level: L, side, steps, rows, words };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng, ctx.side);
    const S = HS.make(stage, ctx, { place: "limb", game: "knee" });
    const { s } = S;
    const st = { i: 0, kicks: 0, turns: 0, oi: 0, last: null, judged: {}, over: false, busy: false, flashT: 0 };
    const cur = () => P.steps[st.i] || null;
    ctx.card.setRows(P.steps.map((x) => x.row));
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);

    // D2, D10 (1 Oct, CLN-47): the one sore knee, side-on (the patient faces right, on the bed's end): the thigh in
    // from the left edge, the knee a little right of centre, the shin hanging out of the bottom, so the kick reads.
    // Stand-in art in the patient's own skin and clothes (CLN-67); the art batch's K1/K2 swap in by file name.
    const KX = 440;
    const KY = 250;
    const defs = s("defs", {}, S.svg);
    const gid = `knee-skin-${Math.floor(ctx.rng() * 1e6)}`;
    const grad = s("linearGradient", { id: gid, x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    s("stop", { offset: "0", "stop-color": S.skinDark }, grad);
    s("stop", { offset: "0.45", "stop-color": S.skin }, grad);
    s("stop", { offset: "1", "stop-color": S.skinLight }, grad);
    const legs = {};
    const g = s("g", { class: "knee-leg" }, S.layer);
    const glow = s("ellipse", { cx: KX, cy: KY, rx: 96, ry: 92, fill: "#ffe27a", opacity: 0 }, g);
    // the shin and foot (the kick turns this about the knee)
    const body = s("g", { class: "knee-body" }, g); // the stand-in drawing (the art swaps in for it: S.closeup)
    const shin = s("g", { class: "knee-shin" }, body);
    s("path", { d: `M${KX - 52} ${KY + 10} Q${KX - 46} ${KY + 200} ${KX - 36} ${KY + 330} L${KX + 34} ${KY + 330} Q${KX + 44} ${KY + 190} ${KX + 50} ${KY + 4}Z`, fill: `url(#${gid})`, stroke: S.skinDark, "stroke-width": 3 }, shin);
    s("path", { d: `M${KX - 40} ${KY + 300} L${KX - 40} ${KY + 360} L${KX + 120} ${KY + 360} Q${KX + 130} ${KY + 318} ${KX + 40} ${KY + 296}Z`, fill: "#7a4a3a" }, shin); // the shoe
    // the thigh on the bed, from the left edge, and the rolled trouser leg
    s("path", { d: `M-700 ${KY - 70} L${KX - 10} ${KY - 62} Q${KX + 62} ${KY - 56} ${KX + 58} ${KY + 8} Q${KX + 50} ${KY + 64} ${KX - 20} ${KY + 60} L-700 ${KY + 64}Z`, fill: `url(#${gid})`, stroke: S.skinDark, "stroke-width": 3 }, body);
    s("path", { d: `M-700 ${KY - 76} L${KX - 150} ${KY - 70} Q${KX - 128} ${KY} ${KX - 150} ${KY + 68} L-700 ${KY + 72}Z`, fill: S.legs }, body);
    s("path", { d: `M${KX - 168} ${KY - 74} Q${KX - 142} ${KY} ${KX - 168} ${KY + 72} L${KX - 124} ${KY + 68} Q${KX - 102} ${KY} ${KX - 124} ${KY - 70}Z`, fill: HS.shade(S.legs, -0.15) }, body);
    // the kneecap
    s("ellipse", { cx: KX + 30, cy: KY - 4, rx: 30, ry: 36, fill: S.skinLight, opacity: 0.55 }, body);
    const wrap = s("g", {}, g);
    const art = S.closeup("knee", body);
    if (art) g.insertBefore(art, wrap);
    // A1 (5 Oct): the cut knee (K1) is drawn at the art plan's size (the knee about half the height), bigger than the
    // stand-in: KS scales the things drawn round the knee (the glow, the wrap's dots and turns, the hammer) to match
    const KA = art ? ctx.data.art.knee : null;
    const KS = (KA && KA.scale) || 1;
    glow.setAttribute("rx", 96 * KS);
    glow.setAttribute("ry", 92 * KS);
    // until the kicked picture (K2) is cut, the kick swings the shin of K1 itself: the picture split at the knee
    let artShin = null;
    const kickArt = art && ctx.data.art["knee-kick"];
    // the kicked picture loads now, so the first kick never flashes empty
    if (art && kickArt && kickArt.on && root.Image) new root.Image().src = art.getAttribute("href").replace(/knee(@2x)?\.webp/, (m, two) => `knee-kick${two || ""}.webp`);
    if (art && !(kickArt && kickArt.on) && KA.split) {
      const [x, y, w, hh] = KA.box;
      const cy = KA.split;
      const defs2 = s("defs", {}, S.svg);
      const top = s("clipPath", { id: `${gid}-top` }, defs2);
      s("rect", { x: x - 10, y: y - 10, width: w + 20, height: cy - y + 10 }, top);
      const bot = s("clipPath", { id: `${gid}-bot` }, defs2);
      s("rect", { x: x - 10, y: cy, width: w + 20, height: y + hh - cy + 400 }, bot);
      art.setAttribute("clip-path", `url(#${gid}-top)`);
      artShin = s("g", { class: "knee-art-shin" }, g);
      g.insertBefore(artShin, wrap);
      const im = art.cloneNode();
      im.removeAttribute("clip-path");
      im.setAttribute("clip-path", `url(#${gid}-bot)`);
      artShin.appendChild(im);
    }
    legs[P.side] = { g, glow, shin: artShin || shin, wrap, x: KX };
    const sore = legs[P.side];
    const glowOn = (on) => sore.glow.setAttribute("opacity", on ? 0.5 : 0);
    glowOn(true);
    const dotsG = s("g", {}, S.layer);
    const dotPos = (d) => ({ x: sore.x + (d.s === "l" ? -78 : 92) * KS, y: KY + (-40 + d.y * 40) * KS });
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
      S.say("knee-better", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    // CLN-48 (D15b): the lit dot waits for the tap at every level; nothing moves on by itself
    const clearFlash = () => {};
    const armFlash = () => drawDots();

    S.tools(
      [
        { id: "hammer", img: "assets/clinic/items-v2/reflex-hammer.webp" },
        { id: "bandage", img: "assets/clinic/items-v2/bandage-roll.webp" },
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
        const leg = Object.values(legs).find((l) => Math.hypot(p.x - l.x - 20, p.y - KY) < 90 * KS);
        if (!leg) return;
        if (leg !== sore) {
          ctx.log({ type: "wrong", rowId: "kick", detail: "the other knee" });
          S.face("ouch", 500);
          return;
        }
        st.kicks++;
        S.count(st.kicks);
        ctx.tally("hammer", st.kicks, { next: true }); // SH-40: the bandage (the next action) closes this step
        // D5 (1 Oct, SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (ctx.level === 1 && st.kicks >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 450);
        const hm = s("image", { href: (root.Clinic.Kit ? root.Clinic.Kit.url : (u) => u)("assets/clinic/items-v2/reflex-hammer.webp"), x: KX + 40 * KS, y: KY + 10 * KS, width: 150 * KS, height: 100 * KS }, S.fx);
        hm.style.transformBox = "fill-box";
        hm.style.transformOrigin = "100% 50%";
        hm.animate([{ transform: "rotate(-25deg)" }, { transform: "rotate(10deg)" }, { transform: "rotate(-15deg)" }], { duration: 300 });
        ctx.after(350, () => hm.remove());
        // the kick: the shin swings forward (to the right) about the knee
        leg.shin.style.transformOrigin = `${KX}px ${KY}px`;
        leg.shin.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(-55deg)" }, { transform: "rotate(0deg)" }], { duration: 520, easing: "ease-out" });
        // with the art: the kicked picture for a moment (K2, registered to K1)
        const kick = art && ctx.data.art["knee-kick"];
        if (kick && kick.on) {
          // the same picture's kicked twin (the @2x where the plain one is the @2x)
          const plain = art.getAttribute("href");
          art.setAttribute("href", plain.replace(/knee(@2x)?\.webp/, (m, two) => `knee-kick${two || ""}.webp`));
          ctx.after(420, () => art.setAttribute("href", plain));
        }
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
        const from = st.last || { x: sore.x + (d.s === "l" ? 70 : -70) * KS, yy: d.yy };
        s("line", { x1: from.x, y1: from.yy, x2: d.x, y2: d.yy, stroke: "#fbfaf4", "stroke-width": 22 * KS, "stroke-linecap": "round", opacity: 0.95 }, sore.wrap);
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
