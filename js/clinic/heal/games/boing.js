/*
 * H-boing, the injection (clinic v2, design sheets part B; CQ13). A
 * PROTOTYPE on the CB6b close-up (the arm lies on the paper strip) with flat
 * stand-ins. The doctor holds the syringe; the child counts.
 *
 * Why: "Time for my jab." / "I'll do it; you count."
 * 1. Wipe the arm N times with the cotton (counted), then ✓.
 * 2. The doctor's syringe fills with coloured beads: each tap sends one in,
 *    counted. L1 one colour, 2-4 (the sheet says 2-3; 4 keeps a blind guess
 *    under 10%); L2 4-5; L3 the colours said ("ba [red], hakro [blue]").
 * 3. The count-down with the doctor, then BOING.
 * 4. A plaster on the spot, then an apple (not a lollipop).
 * Rows (the words decide): the wipes, the beads (count, and colours at L3).
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  const K = { wipes: { 1: [1, 2, 3, 4, 5], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5] }, beads: { 1: [2, 3, 4], 2: [4, 5] }, colours: ["red", "blue", "green"], one: "purple" };
  const WHY = { problem: "Time for my jab.", goal: "I'll do it. You count!" };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    wipe: { gesture: "tap", then: "tap" },
    beads: { gesture: "tap" },
    boing: { watch: true }, // the countdown runs by itself: the child watches (and counts along), nothing to demo
    plaster: { gesture: "tap", then: "tap" },
    apple: { gesture: "tap" },
  };

  function plan(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const wipes = HS.pick(K.wipes[L], rng);
    let beads;
    if (L < 3) beads = Array(HS.pick(K.beads[L], rng)).fill(K.one);
    else {
      const [a, b] = HS.shuffle(K.colours, rng);
      const na = 1 + Math.floor(rng() * 2);
      const nb = 1 + Math.floor(rng() * 2);
      beads = Array(na).fill(a).concat(Array(nb).fill(b));
    }
    const groups = [];
    beads.forEach((c) => (groups.length && groups[groups.length - 1].c === c ? groups[groups.length - 1].n++ : groups.push({ c, n: 1 })));
    const beadK = L < 3 ? `[Beads], ${HS.NUM[beads.length]}` : `[Beads:] ${groups.map((g) => `${HS.NUM[g.n]} [${g.c}]`).join(", ")}`;
    const steps = [
      { id: "wipe", kind: "wipe", count: wipes, row: { id: "wipe", kutchi: `[Wipe], ${HS.NUM[wipes]}`, english: `Wipe it ${wipes} times` } },
      { id: "beads", kind: "beads", beads, row: { id: "beads", kutchi: beadK, english: L < 3 ? `${beads.length} beads` : `Beads: ${groups.map((g) => `${g.n} ${g.c}`).join(", ")}` },
        // L3: the colours in order are a sequence on the card (13h): one part per colour
        rows: L < 3 ? null : groups.map((g, i) => ({ id: `beads${i}`, seq: "beads", kutchi: `${i ? "ne poi " : ""}${HS.NUM[g.n]} [${g.c}]`, english: `${i ? "then " : ""}${g.n} ${g.c}` })) },
      { id: "boing", kind: "boing", row: { id: "boing", kutchi: null, english: "Count down... BOING!", placeholder: true } },
      { id: "plaster", kind: "plaster", row: { id: "plaster", kutchi: "Pela [plaster]", english: "First the plaster" } },
      { id: "apple", kind: "apple", row: { id: "apple", kutchi: "ne poi [apple]", english: "then the apple" } },
    ];
    const rows = [{ id: "wipe-count", options: K.wipes[L], answer: wipes }];
    if (L < 3) rows.push({ id: "bead-count", options: K.beads[L], answer: beads.length });
    else rows.push({ id: "bead-colours", seq: K.colours, answer: beads, placeholder: true });
    const words = [{ kutchi: HS.NUM[wipes], english: String(wipes) }, { kutchi: "pela", english: "first" }, { kutchi: "ne poi", english: "and then" }, HS.ph("apple"), HS.ph("plaster")];
    groups.forEach((g) => words.push({ kutchi: HS.NUM[g.n], english: String(g.n) }));
    return { level: L, steps, rows, words };
  }

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng);
    const S = HS.make(stage, ctx, { place: "limb", game: "boing" });
    const { s } = S;
    const st = { i: 0, wipes: 0, beads: [], judged: {}, over: false, busy: false };
    const cur = () => P.steps[st.i] || null;
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    ctx.card.setRows([].concat(...P.steps.map((x) => x.rows || [x.row])));

    // the upper arm on the paper strip; the jab spot
    const A = { x: 420, y: 410 };
    const armG = s("g", {}, S.layer);
    s("rect", { x: 120, y: 362, width: 560, height: 100, rx: 50, fill: "#d9a57c", stroke: "#b9845c", "stroke-width": 3 }, armG);
    s("path", { d: "M120 362 L260 362 L260 462 L120 462Z", fill: "#e25a5a", opacity: 0.9 }, armG); // the short sleeve
    const spot = s("circle", { cx: A.x, cy: A.y, r: 16, fill: "none", stroke: "#2e8b7a", "stroke-width": 4, "stroke-dasharray": "5 5" }, armG);
    const shine = s("ellipse", { cx: A.x, cy: A.y, rx: 60, ry: 30, fill: "#fff", opacity: 0 }, armG);
    const markG = s("g", {}, armG);

    // the doctor's syringe (never the child's), held up top
    const SY = { x: 250, y: 120, w: 300, h: 70 };
    const syG = s("g", {}, S.layer);
    s("rect", { x: SY.x, y: SY.y, width: SY.w, height: SY.h, rx: 14, fill: "#eef6fb", stroke: "#6a8aa8", "stroke-width": 5 }, syG);
    s("rect", { x: SY.x - 70, y: SY.y + 25, width: 70, height: 20, fill: "#6a8aa8" }, syG);
    s("rect", { x: SY.x - 90, y: SY.y - 5, width: 22, height: 80, rx: 6, fill: "#6a8aa8" }, syG);
    s("line", { x1: SY.x + SY.w, y1: SY.y + 35, x2: SY.x + SY.w + 70, y2: SY.y + 35, stroke: "#8a8f98", "stroke-width": 4 }, syG);
    s("text", { x: SY.x + SY.w - 10, y: SY.y - 12, "font-size": 40 }, syG).textContent = "🧤";
    for (let k = 1; k < 6; k++) s("line", { x1: SY.x + k * 50, y1: SY.y + SY.h - 18, x2: SY.x + k * 50, y2: SY.y + SY.h, stroke: "#6a8aa8", "stroke-width": 3 }, syG);
    const beadG = s("g", {}, syG);
    const drawBeads = () => {
      S.clear(beadG);
      st.beads.forEach((c, k) => s("circle", { cx: SY.x + SY.w - 26 - k * 40, cy: SY.y + 35, r: 17, fill: HS.COLOURS[c] || c, stroke: "rgba(0,0,0,.25)", "stroke-width": 2 }, beadG));
    };
    const countG = s("g", {}, S.fx);

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const TOOL = { wipe: "cotton", beads: P.level < 3 ? "bead-" + K.one : "bead-" + P.steps[1].beads[0], plaster: "plaster", apple: "apple" };
    const open = () => {
      const c = cur();
      ctx.card.now(c.id);
      spot.setAttribute("opacity", c.kind === "plaster" ? 1 : c.kind === "wipe" ? 1 : 0);
      if (c.kind === "boing") {
        S.cue("boing", CUES.boing, { x: SY.x + SY.w / 2, y: SY.y + 35 });
        return countdown();
      }
      S.cue(c.kind, CUES[c.kind], S.toolEls[TOOL[c.kind]], c.kind === "wipe" || c.kind === "plaster" ? { x: A.x, y: A.y } : null);
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "wipe") judge("wipe-count", st.wipes === c.count, `${st.wipes} of ${c.count}`);
      if (c.kind === "beads") {
        // a bead taken back counts only if the child had gone past the count or the colour (the first go is scored)
        const slip = st.beadSlip && st.maxBeads > c.beads.length;
        if (P.level < 3) judge("bead-count", !slip && st.beads.length === c.beads.length, `${st.beads.length} of ${c.beads.length}`);
        else judge("bead-colours", !st.beadWrong && JSON.stringify(st.beads) === JSON.stringify(c.beads), st.beads.join(" "));
      }
      ctx.card.tick(c.id);
      (c.rows || []).forEach((r) => ctx.card.tick(r.id, { quiet: true }));
      S.count(null);
      S.uncue();
      st.i++;
      if (cur()) open();
      else finish();
    };
    const countdown = async () => {
      st.busy = true;
      const from = Math.min(5, Math.max(3, st.beads.length));
      for (let n = from; n >= 1; n--) {
        S.clear(countG);
        const t = s("text", { x: 400, y: 300, "font-size": 90, "text-anchor": "middle", fill: "#2e6b5f", "font-weight": 800 }, countG);
        t.textContent = String(n);
        await S.say({ kutchi: HS.cap(HS.NUM[n]), english: String(n) }, "doctor");
      }
      S.clear(countG);
      const b = s("text", { x: 400, y: 300, "font-size": 110, "text-anchor": "middle", fill: "#d8433f", "font-weight": 900 }, countG);
      b.textContent = "BOING!";
      armG.animate([{ transform: "translateY(0)" }, { transform: "translateY(-14px)" }, { transform: "translateY(8px)" }, { transform: "translateY(0)" }], { duration: 500 });
      syG.animate([{ transform: "translateY(0)" }, { transform: "translateY(120px)" }, { transform: "translateY(0)" }], { duration: 400 });
      S.face("ouch", 700);
      ctx.sfx("pop");
      ctx.after(fast() ? 100 : 900, () => {
        S.clear(countG);
        S.face("happy", 800);
        st.busy = false;
        close();
      });
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      S.face("happy");
      S.say("Crunch! Thank you!", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1500, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words: P.words }));
    };

    const beadTools = (P.level < 3 ? [K.one] : K.colours).map((c) => ({ id: "bead-" + c, colours: [c], bg: "#fff" }));
    S.tools([{ id: "cotton", glyph: "☁️" }].concat(beadTools, [{ id: "plaster", glyph: "🩹" }, { id: "apple", glyph: "🍎" }]), (id) => {
      const c = cur();
      if (st.over || st.busy || !c) return;
      if (/^bead-/.test(id)) {
        if (c.kind === "wipe" && st.wipes) close();
        if (!cur() || cur().kind !== "beads") return;
        if (st.beads.length >= 5) return;
        st.beads.push(id.slice(5));
        st.maxBeads = Math.max(st.maxBeads || 0, st.beads.length);
        const want = cur().beads;
        if (P.level >= 3 && want[st.beads.length - 1] !== id.slice(5)) st.beadWrong = true;
        drawBeads();
        S.count(st.beads.length);
        ctx.tally("beads", st.beads.length);
        ctx.sfx("pop");
        return;
      }
      if (id === "apple" && c.kind === "apple") {
        const a = s("text", { x: 90, y: 110, "font-size": 60 }, S.fx);
        a.textContent = "🍎";
        S.face("happy");
        ctx.after(300, () => close());
      }
    });
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready || st.over || st.busy) return;
      const p = S.pt(e);
      const c = cur();
      // a tap on the syringe takes the last bead back out, until ✓ (UX 17); the first go is what's scored
      if (c && c.kind === "beads" && st.beads.length && p.x >= SY.x - 20 && p.x <= SY.x + SY.w + 20 && p.y >= SY.y - 20 && p.y <= SY.y + (SY.h || 70) + 20) {
        st.beads.pop();
        st.beadSlip = true;
        drawBeads();
        S.count(st.beads.length, { silent: true });
        ctx.tally("beads", st.beads.length);
        ctx.sfx("tap");
        ctx.log({ type: "takeback", detail: "a bead" });
        return;
      }
      if (!c || Math.abs(p.y - A.y) > 70 || p.x < 120 || p.x > 680) return;
      if (c.kind === "wipe" && S.sel === "cotton") {
        st.wipes++;
        S.count(st.wipes);
        ctx.tally("cotton", st.wipes);
        shine.setAttribute("opacity", Math.min(0.6, st.wipes * 0.15));
        const w = s("text", { x: p.x - 24, y: p.y + 12, "font-size": 44 }, S.fx);
        w.textContent = "☁️";
        ctx.after(400, () => w.remove());
        S.face("happy", 400);
      } else if (c.kind === "plaster" && S.sel === "plaster" && Math.hypot(p.x - A.x, p.y - A.y) < 60) {
        s("rect", { x: A.x - 40, y: A.y - 20, width: 80, height: 40, rx: 12, fill: "#f2d2a8", stroke: "#b98a60", "stroke-width": 2 }, markG);
        s("rect", { x: A.x - 12, y: A.y - 10, width: 24, height: 20, rx: 4, fill: "#fff", opacity: 0.6 }, markG);
        spot.setAttribute("opacity", 0);
        ctx.after(250, () => close());
      }
    });
    const btn = ctx.button(
      "✓",
      () => {
        const c = cur();
        if (!S.ready || st.over || st.busy || !c) return;
        if (c.kind === "wipe" && st.wipes) close();
        else if (c.kind === "beads" && st.beads.length) close();
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
          const at = (x, y, what) => Object.assign({ do: "tap", what }, S.client(x, y));
          if (c.kind === "wipe") {
            if (st.wipes >= c.count) return { do: "button" };
            return S.sel !== "cotton" ? tool("cotton") : at(A.x, A.y, "wipe");
          }
          if (c.kind === "beads") {
            if (st.beads.length >= c.beads.length) return { do: "button" };
            return tool("bead-" + c.beads[st.beads.length]);
          }
          if (c.kind === "plaster") return S.sel !== "plaster" ? tool("plaster") : at(A.x, A.y, "plaster");
          if (c.kind === "apple") return tool("apple");
          return { do: "wait" };
        },
        slip() {
          // one bead too many
          const c = cur();
          if (!S.ready || st.busy || !c || c.kind !== "beads" || st.beads.length !== c.beads.length) return null;
          const r = S.toolEls["bead-" + c.beads[c.beads.length - 1]].getBoundingClientRect();
          return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: "extra bead" };
        },
      },
    };
  }

  function bot(level, rng) {
    const p = plan(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "boing",
    part: "arm",
    ailments: ["jab"],
    items: ["cotton", "syringe", "plaster", "apple"],
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
