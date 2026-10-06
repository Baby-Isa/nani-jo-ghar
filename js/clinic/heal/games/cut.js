/*
 * H2/H8 Wash, stitch, plaster: the reference healing game for
 * docs/architecture/clinic-heal-api.md (design: docs/archive/clinic/clinic-design-v1.md Q4, Q5).
 *
 * The scrape (level 1, the first-ever healing game): Pela paani, ne poi
 * [cloth], ne poi [plaster], said one at a time, the tray in that order.
 * The cut (from level 2): the list said up front; Trae [stitches] with the
 * thread (drag the needle dot to dot); the plaster in the colour said.
 * Level 3: two gaps, stitched in the called size order (pela wadho, ne poi
 * nindho, or the other way round), a count on each.
 *
 * Gestures (fixed at every level, UX s12): tap the dish, tap the spot; and
 * the one working gesture, stitch = drag dot to dot.
 * Rows tick when a step CLOSES (the next dish or Done), never on a count.
 * No mid-round verdicts: a wrong count or colour just happens and shows in
 * the end review. The dish throbs after 8 s of nothing (free: the tray's
 * order was the pharmacy's row, so it gives no Kutchi away here).
 *
 * `plan(level, ailment, rng)` is pure and shared by mount() and bot(), so
 * the leak bot plays exactly the game's rows.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);

  // words, numbers and joins from data through the seam (js/clinic/lang.js, R5): no Kutchi in this file
  const LG = () => root.ClinicLang || (typeof require === "function" ? require("../../lang.js") : null);
  const say = (m, o) => LG().show(m, o);
  const num = (n) => LG().num(n);
  const KNOBS = {
    zoom: 2.2,
    throbMs: 8000,
    dabCounts: { 2: [1, 2, 3, 4], 3: [1, 2, 3, 4] },
    stitchCounts: { 2: [2, 3, 4, 5], 3: { big: [2, 3, 4], small: [1, 2] } },
    stitchDots: { 1: 3, 2: 6, 3: { big: 5, small: 3 } },
    plasterColours: { 2: ["red", "blue", "green"], 3: ["red", "blue", "green", "yellow"] },
    designs: ["cat", "star", "spots"],
  };
  const pick = (a, rng) => a[Math.floor(rng() * a.length)];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /** The rows of one round. Pure. */
  function planCut(level, ailmentId, rng, knobs) {
    const K = Object.assign({}, KNOBS, knobs || {});
    const ail = ailmentId === "cut" || ailmentId === "scrape" ? ailmentId : level >= 2 ? "cut" : "scrape";
    const L = Math.max(1, Math.min(3, level));
    const steps = [];
    const Lg = LG();
    const then = (x) => say(Lg.then(x));
    steps.push({ id: "wash", kind: "wash", item: "paani", row: Object.assign({ id: "wash" }, say(Lg.first("cook-paani"))), tested: false });
    if (ail === "scrape") {
      const dab = { id: "dab", kind: "dab", item: "cloth", tested: L >= 2 };
      if (L >= 2) {
        dab.count = pick(K.dabCounts[L], rng);
        dab.options = K.dabCounts[L];
        dab.row = Object.assign({ id: "dab" }, say(Lg.join([Lg.then("cl-cloth"), ".", Lg.item("cl-dabs", { n: dab.count })])));
      } else dab.row = Object.assign({ id: "dab" }, then("cl-cloth"));
      steps.push(dab);
    } else {
      const st = { id: "stitch", kind: "stitch", item: "thread", tested: L >= 2 };
      if (L === 1) {
        st.gaps = [{ size: "one", dots: K.stitchDots[1], count: null }];
        st.row = Object.assign({ id: "stitch" }, then("cl-thread"));
      } else if (L === 2) {
        st.count = pick(K.stitchCounts[2], rng);
        st.options = K.stitchCounts[2];
        st.gaps = [{ size: "one", dots: K.stitchDots[2], count: st.count }];
        st.row = Object.assign({ id: "stitch" }, say(Lg.join([Lg.then("cl-thread"), ".", Lg.item("cl-stitches", { n: st.count })])));
      } else {
        const big = pick(K.stitchCounts[3].big, rng);
        const small = pick(K.stitchCounts[3].small, rng);
        const bigFirst = rng() < 0.5;
        const a = bigFirst ? ["big", big] : ["small", small];
        const b = bigFirst ? ["small", small] : ["big", big];
        st.gaps = [
          { size: "big", dots: K.stitchDots[3].big, count: big },
          { size: "small", dots: K.stitchDots[3].small, count: small },
        ];
        st.order = bigFirst ? ["big", "small"] : ["small", "big"];
        st.bigLeft = rng() < 0.5; // where the big gap sits on screen: random, so position gives nothing away
        const sized = ([size, n], i) => [Lg.step(i, Lg.item(Lg.sizeId(size)), { lower: true }), ",", Lg.count(n)];
        st.row = Object.assign({ id: "stitch" }, say(Lg.join([Lg.then("cl-thread"), ":", ...sized(a, 0), ";", ...sized(b, 1)])));
      }
      steps.push(st);
    }
    const pl = { id: "plaster", kind: "plaster", item: "plaster", tested: L >= 2 };
    if (L >= 2) {
      pl.options = K.plasterColours[L];
      pl.colour = pick(pl.options, rng);
      pl.row = Object.assign({ id: "plaster" }, then([pl.colour, "cl-plaster"]));
    } else {
      pl.options = K.designs;
      pl.row = Object.assign({ id: "plaster" }, then("cl-plaster"));
    }
    steps.push(pl);
    // the ear rows (what the review counts from level 2)
    const rows = [];
    steps.forEach((s) => {
      if (!s.tested) return;
      if (s.kind === "dab") rows.push({ id: "dab-count", kind: "count", step: s.id, answer: s.count, options: s.options });
      if (s.kind === "stitch" && s.order) {
        rows.push({ id: "stitch-order", kind: "order", step: s.id, answer: s.order[0], options: ["big", "small"] });
        s.gaps.forEach((g) => rows.push({ id: `stitch-${g.size}`, kind: "count", step: s.id, answer: g.count, options: K.stitchCounts[3][g.size] }));
      } else if (s.kind === "stitch") rows.push({ id: "stitch-count", kind: "count", step: s.id, answer: s.count, options: s.options });
      if (s.kind === "plaster") rows.push({ id: "plaster-colour", kind: "colour", step: s.id, answer: s.colour, options: s.options });
    });
    const words = [Object.assign(Lg.w("cook-paani"), { id: "paani" }), Lg.w("lnk-pela"), Lg.w("lnk-nepoi")];
    steps.forEach((s) => {
      if (s.count) words.push(num(s.count));
      (s.gaps || []).forEach((g) => g.count && words.push(num(g.count)));
    });
    if (L === 3 && ail === "cut") words.push(Lg.w("ph-big"), Lg.w("ph-small"));
    steps.forEach((s) => s.item !== "paani" && words.push(Lg.w(Lg.lex(s.item, ["clinic.item.", "cl-", ""]) || s.item)));
    const seen = new Set();
    return {
      level: L,
      ailment: ail,
      steps,
      rows,
      upFront: L >= 2,
      words: words.filter((w) => (seen.has(w.kutchi || w.english) ? false : seen.add(w.kutchi || w.english))),
    };
  }

  /** The blind bot (Node): the strategies of quality pass Q6 that apply here. */
  function botCut(level, rng) {
    const p = planCut(level, level >= 2 ? "cut" : "scrape", rng);
    const strategies = ["fair", "random", "tray-order", "max", "most-common", "first-option"];
    return {
      rows: p.rows,
      plan: p,
      strategies,
      solve(strategy) {
        const res = p.rows.map((r) => {
          if (strategy === "fair") return true;
          let guess;
          if (strategy === "max") guess = r.kind === "count" ? Math.max(...r.options) : r.options[r.options.length - 1];
          else if (strategy === "most-common") guess = r.kind === "count" ? r.options[Math.floor((r.options.length - 1) / 2)] : r.options[0];
          else if (strategy === "first-option") guess = r.options[0];
          else guess = pick(r.options, rng); // random, tray-order (the tray gives no count, size or colour)
          return guess === r.answer;
        });
        return { right: res.filter(Boolean).length, total: res.length };
      },
    };
  }

  /* ---------------- the browser game ---------------- */
  function mountCut(stage, ctx) {
    const doc = stage.ownerDocument;
    const K = Object.assign({}, KNOBS, (ctx.data && ctx.data.knobs) || {});
    const P = planCut(ctx.level, ctx.ailment && ctx.ailment.id, ctx.rng, K);
    const part = (ctx.ailment && ctx.ailment.part) || (P.ailment === "cut" ? "arm" : "knee");
    const side = ctx.side || (part === "tooth" ? null : "left");
    const h = (tag, cls, parent, text) => {
      const n = doc.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      if (parent) parent.appendChild(n);
      return n;
    };
    const NS = "http://www.w3.org/2000/svg";
    const s = (tag, attrs, parent) => {
      const n = doc.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
      if (parent) parent.appendChild(n);
      return n;
    };

    // style (scoped to the game's own layer)
    const css = h("style", null, stage);
    css.textContent = `
      .cut-layer{position:absolute;inset:0;z-index:5;touch-action:none}
      .cut-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
      .cut-pour{position:absolute;font-size:56px;transform-origin:70% 80%;animation:cut-tilt 1s ease-in-out;pointer-events:none}
      @keyframes cut-tilt{40%,70%{transform:rotate(-55deg)}}
      .cut-drop{position:absolute;width:10px;height:14px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:#6bb7ea;animation:cut-fall .7s ease-in forwards;pointer-events:none}
      @keyframes cut-fall{to{transform:translateY(90px);opacity:0}}
      .cut-dab{position:absolute;font-size:48px;animation:cut-dab .5s;pointer-events:none}
      @keyframes cut-dab{50%{transform:translateY(12px) scale(.9)}}
      .cut-choices{position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px;z-index:8}
      .cut-choice{width:clamp(64px,9vw,104px);height:clamp(44px,6vw,64px);border-radius:16px;border:4px solid #d8c6a8;background:#fff;display:grid;place-items:center;font-size:28px;cursor:pointer}
      .cut-choice.sel{border-color:#2e8b7a;box-shadow:0 0 0 5px rgba(46,139,122,.35)}
      .cut-carry{position:absolute;pointer-events:none;z-index:9;font-size:40px;transform:translate(-50%,-50%)}
    `;
    const layer = h("div", "cut-layer", stage);
    const svg = s("svg", { class: "cut-svg" }, layer);
    const wound = s("g", { class: "cut-wound" }, svg);
    const ring = s("circle", { fill: "none", stroke: "#b9b2a8", "stroke-width": 5, "stroke-dasharray": "10 8", opacity: 0.8 }, svg);
    const threads = s("g", {}, svg);
    const dotsG = s("g", {}, svg);

    const state = {
      i: 0, // the open step
      sel: null, // the selected dish index
      done: {},
      washes: 0,
      dabs: 0,
      gaps: [], // [{size, dots:[{x,y}], made}]
      stitchOrder: [],
      plaster: null, // the chosen design/colour, carried
      wrong: 0,
      judged: {},
      lastAct: Date.now(),
    };
    const steps = P.steps;
    const cur = () => steps[state.i] || null;
    const trayIndex = (base) => ctx.tray.findIndex((t) => !t.wrong && String(t.id).replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/, "") === base && !state.done[`dish${ctx.tray.indexOf(t)}`]);

    // the card: one line at a time at level 1, the whole list up front from level 2
    const rows = steps.map((st) => st.row);
    ctx.card.setRows(P.upFront ? rows : [rows[0]]);
    ctx.card.now && ctx.card.now(rows[0].id);

    let geo = null; // the wound's geometry in stage px
    const layout = () => {
      const hs = ctx.patient.hotspot(part, side);
      const L = Math.max(110, Math.min(260, hs.r * 2.4));
      geo = { x: hs.x, y: hs.y, r: hs.r, L };
      draw();
    };
    const draw = () => {
      if (!geo) return;
      const { x, y, L } = geo;
      while (wound.firstChild) wound.removeChild(wound.firstChild);
      ring.setAttribute("cx", x);
      ring.setAttribute("cy", y);
      ring.setAttribute("r", L * 0.62);
      if (state.washes) ring.setAttribute("stroke", "#3fa35b"), ring.setAttribute("stroke-dasharray", "none");
      if (P.ailment === "scrape") {
        for (let k = 0; k < 4; k++) s("line", { x1: x - L * 0.3, y1: y - 18 + k * 12, x2: x + L * 0.3, y2: y - 26 + k * 12, stroke: "#e58aa0", "stroke-width": 6, "stroke-linecap": "round", opacity: state.dabs ? 0.35 : 0.85 }, wound);
      }
      // the cut: one zig-zag per gap, dots alternating above and below
      while (dotsG.firstChild) dotsG.removeChild(dotsG.firstChild);
      while (threads.firstChild) threads.removeChild(threads.firstChild);
      if (P.ailment === "cut") {
        const st = steps.find((q) => q.kind === "stitch");
        const gaps = st.gaps;
        const n = gaps.length;
        state.gaps = gaps.map((g, gi) => {
          const prev = state.gaps[gi] || { made: 0 };
          const slot = n === 1 ? 0 : st.bigLeft === (g.size === "big") ? -1 : 1;
          const gl = n === 1 ? L : g.size === "big" ? L * 0.62 : L * 0.4;
          const cx = x + slot * L * 0.36;
          const dots = [];
          for (let d = 0; d < g.dots; d++) {
            const t = g.dots === 1 ? 0.5 : d / (g.dots - 1);
            dots.push({ x: cx - gl / 2 + t * gl, y: y + (d % 2 ? 16 : -16) });
          }
          return { size: g.size, dots, made: prev.made, el: null };
        });
        state.gaps.forEach((g) => {
          s("polyline", { points: g.dots.map((d) => `${d.x},${(d.y + y) / 2 + (d.y > y ? 2 : -2)}`).join(" "), fill: "none", stroke: "#e2557a", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }, wound);
          g.dots.forEach((d, di) => s("circle", { cx: d.x, cy: d.y, r: di === g.made && state.sel != null && selKind() === "stitch" ? 11 : 8, fill: di <= g.made && g.made ? "#3a2e28" : "#fff", stroke: "#3a2e28", "stroke-width": 3, class: "cut-dot" }, dotsG));
          for (let k = 0; k < g.made; k++) s("line", { x1: g.dots[k].x, y1: g.dots[k].y, x2: g.dots[k + 1].x, y2: g.dots[k + 1].y, stroke: threadColour(), "stroke-width": 6, "stroke-linecap": "round" }, threads);
          if (g.bow) s("text", { x: g.dots[g.made].x + 6, y: g.dots[g.made].y - 8, "font-size": 30 }, threads).textContent = "🎀";
        });
      }
    };
    const threadColour = () => {
      const t = ctx.tray.find((q) => /^thread/.test(q.id));
      const c = t && (t.colour || (/-(\w+)$/.exec(t.id) || [])[1]);
      return { red: "#d23b3b", blue: "#3b6fd2", green: "#3fa35b", yellow: "#e2b31a", white: "#aaa", black: "#333" }[c] || "#6a4a9a";
    };
    const selKind = () => {
      if (state.sel == null) return null;
      const t = ctx.tray[state.sel];
      if (!t || t.wrong) return "none";
      const base = String(t.id).replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/, "");
      return { paani: "wash", cloth: "dab", thread: "stitch", plaster: "plaster" }[base] || "none";
    };

    // ---- closing a step: judge it, tick it, open the next ----
    const judge = (id, ok, detail) => {
      state.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const closeStep = (why) => {
      const st = cur();
      if (!st) return;
      if (st.kind === "dab" && st.tested) judge("dab-count", state.dabs === st.count, `${state.dabs} of ${st.count}`);
      if (st.kind === "stitch" && st.tested) {
        if (st.order) {
          judge("stitch-order", state.stitchOrder[0] === st.order[0], `first ${state.stitchOrder[0] || "none"}`);
          st.gaps.forEach((g) => {
            const made = (state.gaps.find((q) => q.size === g.size) || {}).made || 0;
            judge(`stitch-${g.size}`, made === g.count, `${made} of ${g.count}`);
          });
        } else {
          const made = state.gaps[0] ? state.gaps[0].made : 0;
          judge("stitch-count", made === st.count, `${made} of ${st.count}`);
        }
        state.gaps.forEach((g) => g.made && (g.bow = true));
        if (state.gaps.some((g) => g.made)) ctx.say("bow");
        draw();
      }
      ctx.card.tick(st.id);
      const di = trayIndex(st.item);
      if (di >= 0) {
        state.done[`dish${di}`] = true;
        ctx.trayUI && ctx.trayUI.used(di);
      }
      state.i++;
      state.lastAct = Date.now();
      ctx.card.pulse(null, false);
      ctx.trayUI && ctx.trayUI.pulse(-1, false);
      const nx = cur();
      if (nx) {
        if (!P.upFront) {
          ctx.card.addRow ? ctx.card.addRow(nx.row) : ctx.card.setRows(rows.slice(0, state.i + 1));
          ctx.say(nx.row);
        }
        ctx.card.now && ctx.card.now(nx.id);
      } else finish();
      if (why !== "dish") setSel(null);
    };
    const finish = () => {
      setSel(null);
      ctx.card.now && ctx.card.now(null);
      ctx.patient.react("happy", 0);
      ctx.say("look");
      doneBtn.classList.add("throb");
    };

    // ---- the dishes ----
    const setSel = (i) => {
      state.sel = i;
      ctx.trayUI && ctx.trayUI.select(i == null ? -1 : i);
      choices.classList.toggle("hidden", selKind() !== "plaster" || state.plaster != null);
      carry.textContent = "";
      draw();
    };
    const onDish = (i) => {
      state.lastAct = Date.now();
      const st = cur();
      if (!st) return;
      const t = ctx.tray[i];
      if (!t) return;
      if (state.done[`dish${i}`]) return; // a used dish is a tick
      // tapping the next dish closes an open counted step (UX s11: the tick confirms the step)
      if ((st.kind === "stitch" || (st.kind === "dab" && st.tested)) && st.started && selKind() !== null && i !== state.sel) closeStep("dish");
      setSel(i);
      ctx.sfx("tap");
      ctx.signal && ctx.signal("cut-dish");
    };
    if (ctx.trayUI) ctx.trayUI.onTap((i) => onDish(i));

    // the plaster: three choices (designs at level 1, colours from level 2)
    const choices = h("div", "cut-choices hidden", layer);
    const GLYPH = { cat: "🐱", star: "⭐", spots: "🔴" };
    const COL = { red: "#d23b3b", blue: "#3b6fd2", green: "#3fa35b", yellow: "#f0c43a" };
    const plasterStep = steps.find((q) => q.kind === "plaster");
    const opts = ctx.level >= 2 ? plasterStep.options.slice() : K.designs.slice();
    for (let k = opts.length - 1; k > 0; k--) {
      const j = Math.floor(ctx.rng() * (k + 1));
      [opts[k], opts[j]] = [opts[j], opts[k]];
    }
    opts.forEach((o) => {
      const b = h("button", "cut-choice", choices);
      b.type = "button";
      b.dataset.choice = o;
      if (COL[o]) {
        b.style.background = COL[o];
        b.textContent = "🩹";
      } else b.textContent = GLYPH[o] || "🩹";
      ctx.on(b, "click", (e) => {
        e.stopPropagation();
        state.plaster = o;
        choices.querySelectorAll(".cut-choice").forEach((c) => c.classList.toggle("sel", c === b));
        carry.textContent = b.textContent;
        ctx.sfx("tap");
      });
    });
    const carry = h("div", "cut-carry", layer);

    // ---- taps and drags on the patient ----
    const pt = (e) => {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const nearWound = (p) => geo && Math.hypot(p.x - geo.x, p.y - geo.y) < Math.max(geo.L * 0.75, 60);
    let drag = null;
    const act = (kind, p) => {
      const st = cur();
      state.lastAct = Date.now();
      if (kind === "wash") {
        const jug = h("div", "cut-pour", layer, "🫗");
        jug.style.left = `${geo.x - 20}px`;
        jug.style.top = `${geo.y - geo.L * 0.9}px`;
        for (let k = 0; k < 6; k++) {
          const d = h("div", "cut-drop", layer);
          d.style.left = `${geo.x - 20 + ctx.rng() * 40}px`;
          d.style.top = `${geo.y - geo.L * 0.5}px`;
          d.style.animationDelay = `${0.25 + k * 0.08}s`;
          ctx.after(1400, () => d.remove());
        }
        ctx.after(1100, () => jug.remove());
        state.washes++;
        ctx.patient.react("ouch", 900);
        ctx.after(250, () => ctx.say("cold"));
        draw();
        if (st && st.kind === "wash") ctx.after(700, () => cur() === st && closeStep());
        else ctx.log({ type: "extra", rowId: st && st.id, detail: "water again" });
        return;
      }
      if (kind === "dab") {
        const c = h("div", "cut-dab", layer, "🧽");
        c.style.left = `${geo.x - 24}px`;
        c.style.top = `${geo.y - 40}px`;
        ctx.after(600, () => c.remove());
        state.dabs++;
        ctx.patient.react("giggle", 700);
        draw();
        if (st && st.kind === "dab") {
          st.started = true;
          if (st.tested) ctx.tally("cloth", state.dabs);
          else ctx.after(500, () => cur() === st && closeStep());
        } else ctx.log({ type: "extra", rowId: st && st.id, detail: "dab out of turn" });
        return;
      }
      if (kind === "plaster") {
        if (state.plaster == null) return; // choose one first
        ctx.patient.mark(part, side, "plaster", { colour: COL[state.plaster] || (state.plaster === "cat" ? "#f6d6b0" : state.plaster === "star" ? "#fff0a8" : "#f2c9d6"), rotate: -8 });
        ctx.patient.swirl(part, side, false);
        svg.style.opacity = "0.25";
        if (st && st.kind === "plaster") {
          if (st.tested) judge("plaster-colour", state.plaster === st.colour, state.plaster);
          ctx.patient.react("happy", 0);
          ctx.after(400, () => cur() === st && closeStep());
        } else {
          state.wrong++;
          ctx.log({ type: "wrong", rowId: st && st.id, detail: "plaster before the step" });
          // the plaster is on: the steps before it close as they were
          while (cur() && cur().kind !== "plaster") closeStep();
          if (cur()) closeStep();
        }
        state.plaster = null;
        carry.textContent = "";
      }
    };
    ctx.on(layer, "pointerdown", (e) => {
      const p = pt(e);
      const kind = selKind();
      state.lastAct = Date.now();
      if (kind === "stitch") {
        // start a drag at the needle's dot of any gap
        const g = state.gaps.find((q) => q.made < q.dots.length - 1 && Math.hypot(p.x - q.dots[q.made].x, p.y - q.dots[q.made].y) < 40);
        if (g) {
          drag = g;
          layer.setPointerCapture && layer.setPointerCapture(e.pointerId);
        }
        return;
      }
      if (!kind || kind === "none") {
        if (nearWound(p)) ctx.patient.react("giggle", 600);
        return;
      }
      if (!nearWound(p)) return;
      act(kind, p);
    });
    ctx.on(layer, "pointermove", (e) => {
      const p = pt(e);
      if (selKind() === "plaster" && state.plaster) {
        carry.style.left = `${p.x}px`;
        carry.style.top = `${p.y}px`;
      }
      if (!drag) return;
      const g = drag;
      const nx = g.dots[g.made + 1];
      if (nx && Math.hypot(p.x - nx.x, p.y - nx.y) < 34) {
        g.made++;
        const st = cur();
        if (st && st.kind === "stitch") {
          st.started = true;
          if (!state.stitchOrder.includes(g.size)) state.stitchOrder.push(g.size);
          const total = state.gaps.reduce((a, q) => a + q.made, 0);
          ctx.tally("thread", total);
        }
        ctx.patient.react("ouch", 500);
        if (ctx.rng() < 0.4) ctx.say("oop");
        ctx.sfx("pop");
        ctx.signal && ctx.signal("cut-stitch");
        draw();
      }
    });
    const endDrag = () => (drag = null);
    ctx.on(layer, "pointerup", endDrag);
    ctx.on(layer, "pointercancel", endDrag);

    // ---- Done (closes an open counted step; ends the game after the last one) ----
    const doneBtn = ctx.button ? ctx.button("✓", () => onDone(), "done") : h("button", "cl-go", stage, "✓");
    if (!ctx.button) ctx.on(doneBtn, "click", () => onDone());
    doneBtn.setAttribute("aria-label", "Done");
    const onDone = () => {
      state.lastAct = Date.now();
      const st = cur();
      if (st && (st.kind === "stitch" || st.kind === "dab") && st.started) return closeStep();
      if (st) return; // nothing to close yet
      const tested = P.rows;
      const right = tested.filter((r) => state.judged[r.id]).length;
      const result = P.level === 1 ? { right: state.wrong ? 0 : 1, total: 1, taught: true } : { right, total: tested.length };
      ctx.done(Object.assign(result, { hints: 0, words: P.words }));
    };

    // the throbbing hint: the next dish (and its line) after 8 s of nothing
    const throb = () => {
      const st = cur();
      if (st && Date.now() - state.lastAct > K.throbMs && state.sel == null) {
        const di = trayIndex(st.item);
        if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
        ctx.card.pulse(st.id, true);
      }
      ctx.after(1000, throb);
    };

    const onResize = () => layout();
    return {
      async start() {
        ctx.patient.swirl(part, side, false);
        await ctx.patient.focus(part, side, K.zoom, 500);
        layout();
        ctx.on(root, "resize", onResize);
        if (P.upFront) ctx.card.speak(); // input never waits for the talking (13i)
        else ctx.say(rows[0]);
        state.lastAct = Date.now();
        throb();
        if (ctx.level === 1) {
          const dish = () => ctx.trayUI && ctx.trayUI.dishes()[trayIndex("paani")];
          const spot = () => {
            const r = stage.getBoundingClientRect();
            return [r.left + geo.x - 70, r.top + geo.y - 70, 140, 140];
          };
          ctx.onboard([
            { spotlight: dish, ghost: { gesture: "tap" }, wait: "cut-dish" },
            { spotlight: spot, ghost: { gesture: "tap" } },
          ]);
        }
      },
      destroy() {
        ctx.patient.focus(null, null, 1, 0);
        layer.remove();
        css.remove();
      },
      // for tests: what the game wants next, in stage px
      expect() {
        const st = cur();
        if (!st) return { action: "done" };
        const di = trayIndex(st.item);
        return { step: st.id, kind: st.kind, dish: di, selected: state.sel, wound: geo, gaps: state.gaps.map((g) => ({ size: g.size, made: g.made, dots: g.dots })), plan: P };
      },
    };
  }

  /* ================= v3: the scrape (D15a, decision 27; the 1 Oct report § 8H) =================
   * 1. Wash it clean (a reveal): pick the jug, then sweep its water over the scrape; the dirt washes away where the
   *    water passes. The step closes when it's clean (a skill: no words decide it).
   * 2. Ne poi the cloth, dabbed N times (counted; kept: "select it and then tap each time, that's probably fine").
   *    The cloth dries the water the wash left.
   * 3. The plasters, in the colours and order said: DRAG each from the shelf onto a red patch so it covers the red
   *    (a corner left showing makes the patient wince; drag it again to fix it, tap it to take it off until ✓).
   *    L1 one plaster (it settles on when it's nearly right); L2 two in order, one colour each; L3 two in order, each
   *    two colours (CLN-45: never more than two things to hold in one step).
   * Rows (the Kutchi decides): the dab count; the plasters' colours and order (colours: English placeholders, to
   * record). The cut (the stitches) above is unchanged.
   */
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);
  const SCRAPE = {
    dabs: { 1: [2, 3, 4], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5] },
    colours: ["red", "blue", "green", "yellow"],
    // CLN-45 (1 Oct, P14/P17): at most two things to hold per step at L3, and L2 -> L3 adds one thing: two plasters
    // at L2 and L3 (one colour each at L2, two at L3), each plaster's row said as it opens (D8)
    plasters: { 1: 1, 2: 2, 3: 2 },
    washRadius: { 1: 46, 2: 40, 3: 36 }, // svg units round the water's point that it washes
    washDone: 0.85, // the share of the dirt washed when the rest rinses off by itself
    full: 0.97, // a patch this covered counts as covered
    settle: { 1: 0.45, 2: 0, 3: 0 }, // L1: a plaster this near settles on straight (a help, never a judgement)
    plaster: { w: 156, h: 78 }, // the plaster on the close-up, svg units (the art is 2:1)
    patch: { rx: 40, ry: 18 },
  };
  const ART = "assets/clinic/items-v2/";
  // the two-colour plasters the v2 art has (either way round)
  const PAIRS = ["blue-green", "red-blue", "red-green", "red-yellow", "yellow-blue", "yellow-green"];
  const plasterFile = (o) => {
    if (o.length === 1) return `${ART}plaster-${o[0]}.webp`;
    const a = `${o[0]}-${o[1]}`;
    const b = `${o[1]}-${o[0]}`;
    return `${ART}plaster-${PAIRS.includes(a) ? a : PAIRS.includes(b) ? b : o[0]}.webp`;
  };
  const WHY = { problem: "cut-why", goal: "cut-goal" }; // line keys in data/clinic/heal/cut.json (the engine says them)
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice); the wash and the
  // plasters are drags, shown as drags (one gesture per thing, P32)
  const CUES = {
    wash: { gesture: "tap", then: { gesture: "drag" } },
    dab: { gesture: "tap", then: "tap" },
    plaster: { gesture: "drag" },
  };
  function planScrape(level, rng) {
    const L = Math.max(1, Math.min(3, level));
    const dab = HS.pick(SCRAPE.dabs[L], rng);
    const n = SCRAPE.plasters[L];
    let options;
    if (L < 3) options = SCRAPE.colours.map((c) => [c]);
    else {
      options = [];
      SCRAPE.colours.forEach((a, i) => SCRAPE.colours.slice(i + 1).forEach((b) => options.push([a, b])));
    }
    const seq = HS.shuffle(options, rng).slice(0, n);
    // 13h: the plasters' order is a sequence on the shared card: one part per plaster (pela ..., ne poi ...),
    // the next one in the grey band, each ticking as it goes on. The colours are the clinic's colour words (col-*:
    // Mum's laal and lilo; yellow and blue still to record); a two-colour plaster joins them with the engine's "and"
    const Lg = LG();
    const col = (c) => `col-${c}`;
    const name = (o) => (o.length === 2 ? [col(o[0]), Lg.also(col(o[1]))] : [col(o[0])]);
    const plasterRows = seq.map((o, i) => Object.assign({ id: `plaster${i}` }, say(n > 1 || i > 0 ? Lg.step(i, [...name(o), "cl-plaster"], { lower: true }) : Lg.join([...name(o), "cl-plaster"]))));
    const steps = [
      { id: "wash", kind: "wash", row: Object.assign({ id: "wash", seq: "steps" }, say(Lg.first("cook-paani"))) },
      { id: "dab", kind: "dab", count: dab, row: Object.assign({ id: "dab", seq: "steps" }, say(Lg.join([Lg.then("cl-cloth"), ",", Lg.item("cl-dabs", { n: dab })]))) },
      { id: "plaster", kind: "plaster", seq, options, row: plasterRows[0], rows: plasterRows },
    ];
    const key = (o) => o.slice().sort().join("+");
    // every sequence of n different plasters a blind player could lay
    const seqs = [];
    const build = (pre) => {
      if (pre.length === n) return seqs.push(pre.map(key));
      options.forEach((o) => !pre.includes(o) && build(pre.concat([o])));
    };
    build([]);
    const rows = [
      { id: "dab-count", options: SCRAPE.dabs[L], answer: dab },
      // still English while a colour said has no Kutchi yet (yellow, blue: to record)
      { id: "plasters", options: seqs, answer: seq.map(key), placeholder: seq.some((o) => o.some((c) => !Lg.w(col(c)).kutchi)) },
    ];
    const words = [Lg.w("cook-paani"), Lg.w("lnk-pela"), Lg.w("lnk-nepoi"), num(dab), Lg.w("cl-plaster")];
    return { level: L, ailment: "scrape", steps, rows, words, upFront: false, key };
  }

  function mountScrape(stage, ctx) {
    const P = planScrape(ctx.level, ctx.rng);
    // the forearm is long and thin in the 800 x 500 drawing: push in on the scrape so it fills more of the screen
    const S = HS.make(stage, ctx, { place: "limb", game: "cut", zoom: 1.35, focus: [330, 335], safe: [120, 540] });
    const { s } = S;
    const doc = stage.ownerDocument;
    const n = P.steps[2].seq.length;
    const st = { i: 0, dabs: 0, over: false, busy: false, judged: {}, firstSeq: [], carry: null, washing: false };
    const cur = () => P.steps[st.i] || null;
    const rowsOf = (x) => x.rows || [x.row];
    ctx.card.ordered(false); // two sequences: the steps, then the plasters (13h)
    ctx.card.setRows(rowsOf(P.steps[0]));
    const fast = () => !!(root.Clinic && root.Clinic.Kit && root.Clinic.Kit.fast);
    const Kit = root.Clinic && root.Clinic.Kit;
    const url = (u) => (Kit && Kit.url ? Kit.url(u) : u);

    /* ---- the close-up: the patient's own forearm (or leg) from the left edge, the scrape in the middle ----
     * Stand-in art, drawn in the patient's own skin and clothes (CLN-67); the art batch's F2/K3 swap in by file name
     * (data/clinic/heal/cut.json art). The limb runs off the left edge, so it reads as part of the person (CLN-43). */
    const legPart = /knee|leg/.test(String(ctx.part || ""));
    const defs = s("defs", {}, S.svg);
    const gid = `cut-skin-${Math.floor(ctx.rng() * 1e6)}`;
    const grad = s("linearGradient", { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    s("stop", { offset: "0", "stop-color": S.skinLight }, grad);
    s("stop", { offset: "0.55", "stop-color": S.skin }, grad);
    s("stop", { offset: "1", "stop-color": S.skinDark }, grad);
    const limb = s("g", { class: "cut-limb" }, S.layer);
    const Y = 350; // the limb's middle line
    // the forearm's outline for a wrist at x W (the drawing's own wrist is at 600)
    const armD = (W) => `M-700 ${Y - 60} L${W - 40} ${Y - 46} Q${W} ${Y - 44} ${W + 18} ${Y - 40} L${W + 18} ${Y + 40} Q${W} ${Y + 46} ${W - 40} ${Y + 50} L-700 ${Y + 64}Z`;
    let armPath = null;
    let handG = null;
    s("ellipse", { cx: 330, cy: Y + 78, rx: 470, ry: 22, fill: "rgba(60,40,30,.16)" }, limb); // contact shadow on the bed
    if (legPart) {
      // the leg, stretched out: the thigh from the left edge, the knee, the shin, the foot up at the right
      s("path", { d: `M-700 ${Y - 74} L520 ${Y - 62} Q600 ${Y - 58} 640 ${Y - 30} L650 ${Y + 52} Q560 ${Y + 66} 500 ${Y + 64} L-700 ${Y + 74}Z`, fill: `url(#${gid})`, stroke: S.skinDark, "stroke-width": 3 }, limb);
      s("path", { d: `M630 ${Y - 40} Q700 ${Y - 120} 742 ${Y - 96} Q760 ${Y - 40} 690 ${Y + 46} L640 ${Y + 54}Z`, fill: `url(#${gid})`, stroke: S.skinDark, "stroke-width": 3 }, limb);
      s("path", { d: `M-700 ${Y - 80} L60 ${Y - 74} Q80 ${Y} 60 ${Y + 74} L-700 ${Y + 80}Z`, fill: S.legs }, limb); // the rolled trouser leg
      s("path", { d: `M40 ${Y - 78} Q70 ${Y} 40 ${Y + 78} L84 ${Y + 74} Q108 ${Y} 84 ${Y - 74}Z`, fill: HS.shade(S.legs, -0.15) }, limb);
    } else {
      // the forearm held out, palm down: the sleeve at the left edge, the wrist, the hand
      armPath = s("path", { d: armD(600), fill: `url(#${gid})`, stroke: S.skinDark, "stroke-width": 3 }, limb);
      // the hand, palm down: a soft mitten of fingers, the thumb tucked above (stand-in). CLN-74: its own group, so it
      // moves (and foreshortens) to end left of the tool column on every screen
      handG = s("g", { class: "cut-hand" }, limb);
      s("path", { d: `M600 ${Y - 44} Q640 ${Y - 58} 690 ${Y - 50} L770 ${Y - 44} Q800 ${Y - 40} 800 ${Y - 10} Q800 ${Y + 22} 770 ${Y + 30} L690 ${Y + 40} Q640 ${Y + 52} 600 ${Y + 44}Z`, fill: `url(#${gid})`, stroke: S.skinDark, "stroke-width": 3, "stroke-linejoin": "round" }, handG);
      [-22, -2, 18].forEach((dy) => s("path", { d: `M716 ${Y + dy} Q750 ${Y + dy - 2} 784 ${Y + dy + 2}`, fill: "none", stroke: S.skinDark, "stroke-width": 2.5, "stroke-linecap": "round", opacity: 0.6 }, handG));
      s("path", { d: `M650 ${Y - 52} Q690 ${Y - 82} 728 ${Y - 70} Q738 ${Y - 58} 722 ${Y - 50} Q690 ${Y - 46} 668 ${Y - 44}Z`, fill: `url(#${gid})`, stroke: S.skinDark, "stroke-width": 3, "stroke-linejoin": "round" }, handG); // the thumb
      s("path", { d: `M-700 ${Y - 70} L40 ${Y - 66} Q62 ${Y} 40 ${Y + 70} L-700 ${Y + 74}Z`, fill: S.clothes }, limb); // the sleeve
      s("path", { d: `M24 ${Y - 74} Q54 ${Y} 24 ${Y + 74} L72 ${Y + 70} Q96 ${Y} 72 ${Y - 70}Z`, fill: HS.shade(S.clothes, -0.15) }, limb); // its rolled cuff
    }

    const limbArt = S.closeup(legPart ? "knee-graze" : "forearm-graze", limb);

    // the scrape: one red patch per plaster, each a soft irregular graze with scratch lines
    const patches = [];
    const patchG = s("g", { class: "cut-patches" }, S.layer);
    // CLN-74: the scrape sits a little left of the old middle, so the wrist and hand have room before the tool column
    const PX = n === 1 ? [310] : [235, 385];
    PX.forEach((x, k) => {
      const y = Y + (k % 2 ? 6 : -6);
      const R = SCRAPE.patch;
      const pts = [];
      for (let a = 0; a < 12; a++) {
        const t = (a / 12) * Math.PI * 2;
        const j = 0.82 + ctx.rng() * 0.18;
        pts.push([x + Math.cos(t) * R.rx * j, y + Math.sin(t) * R.ry * j]);
      }
      const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L") + "Z";
      const g = s("g", {}, patchG);
      s("path", { d, fill: "#e06a6a", stroke: "#c84a50", "stroke-width": 2, "stroke-linejoin": "round" }, g);
      for (let q = 0; q < 4; q++) s("line", { x1: x - R.rx * 0.6, y1: y - 8 + q * 5, x2: x + R.rx * 0.6, y2: y - 11 + q * 5, stroke: "#b8384a", "stroke-width": 2.5, "stroke-linecap": "round", opacity: 0.7 }, g);
      patches.push({ k, x, y, rx: R.rx, ry: R.ry, g, cover: null, full: false, firstAt: null });
    });
    // the dirt: specks over and round the patches, washed away where the water goes (a reveal)
    const dirtG = s("g", { class: "cut-dirt" }, S.layer);
    const specks = [];
    patches.forEach((p) => {
      for (let q = 0; q < 16; q++) {
        const a = ctx.rng() * Math.PI * 2;
        const r = Math.sqrt(ctx.rng());
        const x = p.x + Math.cos(a) * (p.rx + 18) * r;
        const y = p.y + Math.sin(a) * (p.ry + 12) * r;
        const el = s("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: (3 + ctx.rng() * 4).toFixed(1), fill: ctx.rng() < 0.5 ? "#7a5a3a" : "#8f6c48" }, dirtG);
        specks.push({ x, y, el, gone: false });
      }
    });
    // the water the wash leaves (the cloth dabs it dry)
    const wetG = s("g", { class: "cut-wet", opacity: 0 }, S.layer);
    patches.forEach((p) => [-1, 0, 1].forEach((d) => s("ellipse", { cx: p.x + d * 26, cy: p.y - 20 + Math.abs(d) * 8, rx: 6, ry: 8, fill: "#bfe2f6", stroke: "#8cc4e8", "stroke-width": 1.5 }, wetG)));
    const plasterG = s("g", { class: "cut-plasters" }, S.layer);

    /* ---- the tools: the v2 item art ---- */
    const tools = [{ id: "paani", img: ART + "water-jug.webp" }, { id: "cloth", img: ART + "cloth-blue.webp" }];
    const optByTool = {};
    HS.shuffle(P.steps[2].options, ctx.rng).forEach((o) => {
      const id = "pl-" + P.key(o);
      optByTool[id] = o;
      tools.push({ id, img: plasterFile(o) });
    });
    const stepOfTool = (id) => (id === "paani" ? "wash" : id === "cloth" ? "dab" : "plaster");

    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    const patchTarget = () => {
      const p = patches.find((q) => !q.full) || patches[0];
      return { x: p.x, y: p.y, r: 46 };
    };
    const open = () => {
      const c = cur();
      if (!c) return;
      if (st.i > 0) {
        rowsOf(c).forEach((r) => ctx.card.addRow(r));
        ctx.say(c.row);
      }
      // D8: the plaster step opens its first plaster's row (the next one opens as each goes on)
      ctx.card.now(c.kind === "plaster" ? "plaster0" : c.id);
      if (c.kind === "wash") {
        const a = specks.reduce((m, q) => (q.x < m.x ? q : m), specks[0]);
        const b = specks.reduce((m, q) => (q.x > m.x ? q : m), specks[0]);
        S.cue("wash", CUES.wash, S.toolEls.paani, { gesture: "drag", target: { x: a.x, y: Y, r: 56 }, to: { x: b.x, y: Y, r: 56 } });
      } else if (c.kind === "dab") S.cue("dab", CUES.dab, S.toolEls.cloth, { x: patches[0].x, y: patches[0].y });
      else S.cue("plaster", Object.assign({ to: patchTarget }, CUES.plaster), S.toolEls["pl-" + P.key(c.seq[0])]);
    };
    const close = () => {
      const c = cur();
      if (!c) return;
      if (c.kind === "dab") judge("dab-count", st.dabs === c.count, `${st.dabs} of ${c.count}`);
      if (c.kind !== "plaster") ctx.card.tick(c.id);
      S.count(null);
      S.used(c.kind === "wash" ? "paani" : c.kind === "dab" ? "cloth" : "");
      st.i++;
      if (cur()) open();
      else finish();
    };
    const finish = () => {
      st.over = true;
      S.uncue();
      ctx.card.now(null);
      S.face("happy");
      // the first plaster put on each patch, in the order they went on, is what's scored (a plaster taken back still
      // counts: UX 17)
      const first = st.firstSeq.slice(0, n);
      const okP = JSON.stringify(first) === JSON.stringify(P.steps[2].seq.map(P.key));
      // D14: logged against the first plaster's row, so the end review can show which step it was
      st.judged.plasters = okP;
      ctx.log({ type: okP ? "right" : "wrong", rowId: "plaster0-order", detail: first.join(" ") });
      S.say("look", "patient");
      S.markSeen();
      ctx.after(fast() ? 200 : 1600, () => {
        const right = P.rows.filter((r) => st.judged[r.id]).length;
        ctx.done({ right, total: P.rows.length, hints: 0, words: P.words });
      });
    };

    S.tools(tools, (id) => {
      if (st.over) return;
      const c = cur();
      const want = stepOfTool(id);
      // SH-40: picking a later step's tool closes the open counted step (no ✓ where a next action exists)
      if (c && want !== c.kind && c.kind === "dab" && P.steps.findIndex((x) => x.kind === want) > st.i) close();
    });

    /* ---- CLN-74 (2 Oct): the hand ends left of the tool column on every screen ----
     * The wrist moves in (never onto the last plaster) and the hand foreshortens (down to 35 % long); where even that
     * can't clear the column (a short phone), the view slides right just enough (the sleeve still at the left edge). */
    // A1 (5 Oct): with the cut arm (F1), the same rule moves the picture: it slides left until the fingertips clear
    // the column, never so far that the wrist reaches the last plaster; past that the view slides, as above
    const fa = limbArt && !legPart ? ctx.data.art["forearm-graze"] : null;
    // A2 (5 Oct): the slide is always from the game's own view, never added again on each re-layout (a tablet, where
    // the hand can't clear the column, re-laid out until the graze left the screen and the round could not end)
    const vb0 = S.svg.getAttribute("viewBox").split(/\s+/).map(Number);
    const slideView = (over) => {
      if (vb0.length !== 4) return;
      // never so far that the first patch leaves the screen (a 4:3 tablet crops the close-up's sides): the round
      // needs it; there the fingertips may reach under the tool column instead
      let cap = Infinity;
      const m = over > 0 && S.svg.getScreenCTM();
      if (m) {
        const q = S.svg.createSVGPoint();
        q.x = Math.max(stage.getBoundingClientRect().left, S.svg.getBoundingClientRect().left);
        q.y = 0;
        cap = Math.max(0, patches[0].x - 70 - q.matrixTransform(m.inverse()).x);
      }
      S.svg.setAttribute("viewBox", `${(vb0[0] + Math.min(cap, Math.max(0, over))).toFixed(1)} ${vb0[1]} ${vb0[2]} ${vb0[3]}`);
    };
    const placeArt = () => {
      if (!fa || !fa.tip || !S.shelf) return;
      const sr = S.shelf.getBoundingClientRect();
      const m = S.svg.getScreenCTM();
      if (!sr.width || !m) return;
      const p = S.svg.createSVGPoint();
      p.x = sr.left;
      p.y = sr.top + sr.height / 2;
      const E = p.matrixTransform(m.inverse()).x - 14;
      const [x0, , w] = fa.box;
      const k = w / fa.size[0];
      const last = patches[patches.length - 1];
      const lo = last.x + 50 - fa.wrist * k; // the leftmost the picture may go (the wrist past the last plaster)
      const X = Math.max(lo, Math.min(x0, E - fa.tip * k));
      limbArt.setAttribute("x", X.toFixed(1));
      slideView(X + fa.tip * k - E);
    };
    const placeHand = () => {
      slideView(0); // measure in the game's own view
      placeArt();
      if (limbArt || !handG || !armPath || !S.shelf) return;
      const sr = S.shelf.getBoundingClientRect();
      const m = S.svg.getScreenCTM();
      if (!sr.width || !m) return;
      const toSvgX = (cx) => {
        const p = S.svg.createSVGPoint();
        p.x = cx;
        p.y = sr.top + sr.height / 2;
        return p.matrixTransform(m.inverse()).x;
      };
      const E = toSvgX(sr.left) - 14; // where the fingertips may reach
      const last = patches[patches.length - 1];
      const wMin = last.x + 78; // clear of the last plaster
      const k = Math.max(0.35, Math.min(1, (E - wMin) / 200));
      const W = Math.max(wMin, Math.min(600, E - 200 * k));
      slideView(W + 200 * k - E); // still under the column: slide the view by that much
      armPath.setAttribute("d", armD(W));
      handG.setAttribute("transform", `translate(${W.toFixed(1)} 0) scale(${k.toFixed(3)} 1) translate(-600 0)`);
    };
    placeHand();
    ctx.on(root, "resize", placeHand);
    if (root.requestAnimationFrame) root.requestAnimationFrame(placeHand);

    /* ---- 1. the wash: the jug's water swept over the scrape ---- */
    const jug = s("image", { href: url(ART + "water-jug.webp"), width: 110, height: 114, opacity: 0, class: "cut-jug" }, S.fx);
    const stream = s("path", { fill: "none", stroke: "#8cc8ee", "stroke-width": 10, "stroke-linecap": "round", opacity: 0 }, S.fx);
    const washedShare = () => specks.filter((q) => q.gone).length / specks.length;
    const washAt = (p) => {
      // the jug tilts above and to the right of the point; its stream lands on the point
      jug.setAttribute("x", p.x + 18);
      jug.setAttribute("y", p.y - 170);
      jug.setAttribute("transform", `rotate(-38 ${p.x + 73} ${p.y - 113})`);
      jug.setAttribute("opacity", 1);
      stream.setAttribute("d", `M${p.x + 24} ${p.y - 128} Q${p.x + 6} ${p.y - 70} ${p.x} ${p.y}`);
      stream.setAttribute("opacity", 0.85);
      const R = SCRAPE.washRadius[P.level];
      let hit = 0;
      specks.forEach((q) => {
        if (q.gone || Math.hypot(q.x - p.x, q.y - p.y) > R) return;
        q.gone = true;
        hit++;
        q.el.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${(q.x - p.x) * 0.6}px, 26px)`, opacity: 0 }], { duration: 420, fill: "forwards" });
      });
      if (hit) {
        wetG.setAttribute("opacity", Math.min(1, washedShare() * 1.4));
        if (!st.splashT || Date.now() - st.splashT > 300) {
          st.splashT = Date.now();
          const sp = s("circle", { cx: p.x, cy: p.y, r: 10, fill: "none", stroke: "#bfe2f6", "stroke-width": 4 }, S.fx);
          sp.animate([{ r: 10, opacity: 1 }, { r: 34, opacity: 0 }], { duration: 380, fill: "forwards" });
          ctx.after(420, () => sp.remove());
        }
      }
      if (washedShare() >= SCRAPE.washDone && cur() && cur().kind === "wash" && !st.busy) {
        st.busy = true;
        specks.forEach((q) => !q.gone && ((q.gone = true), q.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" })));
        wetG.setAttribute("opacity", 1);
        S.face("ouch", 900);
        S.say("cold", "patient");
        ctx.sfx("pop");
        ctx.after(fast() ? 150 : 600, () => {
          st.busy = false;
          endWash();
          if (cur() && cur().kind === "wash") close();
        });
      }
    };
    const endWash = () => {
      st.washing = false;
      jug.setAttribute("opacity", 0);
      stream.setAttribute("opacity", 0);
    };

    /* ---- 3. the plasters: dragged from the shelf (or a laid one dragged again) ---- */
    const PW = SCRAPE.plaster.w;
    const PH = SCRAPE.plaster.h;
    // how much of a patch a plaster at (x, y) covers: the share of the patch's points under the plaster's pad
    const coverage = (p, x, y) => {
      let tot = 0;
      let inn = 0;
      for (let i = -4; i <= 4; i++)
        for (let j = -3; j <= 3; j++) {
          const px = p.x + (i / 4) * p.rx;
          const py = p.y + (j / 3) * p.ry;
          if ((i / 4) ** 2 + (j / 3) ** 2 > 1) continue;
          tot++;
          if (Math.abs(px - x) <= PW / 2 - 6 && Math.abs(py - y) <= PH / 2 - 4) inn++;
        }
      return tot ? inn / tot : 0;
    };
    const drawPlaster = (pl) => {
      if (pl.el) pl.el.remove();
      pl.el = s("image", { href: url(plasterFile(pl.opt)), x: pl.x - PW / 2, y: pl.y - PH / 2, width: PW, height: PH, class: "cut-plaster", "data-plaster": P.key(pl.opt) }, plasterG);
    };
    const laid = () => patches.filter((p) => p.cover);
    const fullN = () => patches.filter((p) => p.full).length;
    const refresh = () => {
      // the rows tick as the plasters go on properly; the next plaster's row is the current one (D8)
      const m = fullN();
      for (let k = 0; k < n; k++) (k < m ? ctx.card.tick : ctx.card.untick)(`plaster${k}`);
      if (m < n) ctx.card.now(`plaster${m}`);
      // D7: the ✓ shows once every patch is covered (it commits them; until then a plaster can come off again)
      if (ctx.ready) ctx.ready(m >= n);
    };
    const drop = (opt, p) => {
      // the patch it lands on: the uncovered one it covers most
      let best = null;
      let bestC = 0;
      patches.forEach((q) => {
        if (q.cover) return;
        const c = coverage(q, p.x, p.y);
        if (c > bestC) (bestC = c), (best = q);
      });
      if (!best || bestC < 0.3) return false; // off the scrape: back to the shelf, nothing lost
      const pl = { opt, x: p.x, y: p.y };
      // L1: a plaster that's nearly right settles on straight (the drag is the skill from L2)
      if (SCRAPE.settle[P.level] && bestC >= SCRAPE.settle[P.level]) (pl.x = best.x), (pl.y = best.y);
      best.cover = pl;
      pl.patch = best;
      best.full = coverage(best, pl.x, pl.y) >= SCRAPE.full;
      if (best.firstAt == null) {
        best.firstAt = Date.now();
        st.firstSeq.push(P.key(opt));
      }
      drawPlaster(pl);
      ctx.sfx("pop");
      if (best.full) S.face("happy", 600);
      else {
        S.face("wince", 800); // a red corner still shows: drag it again to cover it
        ctx.log({ type: "extra", rowId: `plaster${fullN()}`, detail: "a corner of red showing" });
      }
      refresh();
      return true;
    };
    const lift = (pl) => {
      pl.patch.cover = null;
      pl.patch.full = false;
      if (pl.el) pl.el.remove();
      pl.el = null;
      refresh();
    };
    const plasterAt = (p) => laid().map((q) => q.cover).find((pl) => Math.abs(p.x - pl.x) < PW / 2 && Math.abs(p.y - pl.y) < PH / 2) || null;
    // the plaster in the hand: an svg picture that follows the finger
    const held = s("image", { width: PW, height: PH, opacity: 0, class: "cut-held" }, S.fx);
    const holdAt = (p) => {
      held.setAttribute("x", p.x - PW / 2);
      held.setAttribute("y", p.y - PH / 2);
    };
    const startCarry = (opt, e, from) => {
      if (cur() && cur().kind === "dab") close(); // SH-40: the plaster is the next action: it closes the dab step
      const c = cur();
      if (!c || c.kind !== "plaster") return;
      st.carry = { opt, from, x0: e.clientX, y0: e.clientY, moved: false };
      held.setAttribute("href", url(plasterFile(opt)));
      holdAt(S.pt(e));
      held.setAttribute("opacity", from === "laid" ? 0.95 : 0);
      S.did();
    };
    const endCarry = (e) => {
      const k = st.carry;
      st.carry = null;
      held.setAttribute("opacity", 0);
      if (!k) return;
      const p = e && e.clientX != null ? S.pt(e) : null;
      if (!k.moved) {
        // a tap: on the shelf it picks the plaster (tap, then tap where it goes); on a laid one it takes it off
        if (k.from === "laid") {
          ctx.sfx("tap");
          ctx.log({ type: "takeback", detail: P.key(k.opt) });
          S.face("ouch", 400);
        }
        return;
      }
      if (!p || !drop(k.opt, p)) ctx.sfx("tap");
    };
    Object.keys(optByTool).forEach((id) => {
      const b = S.toolEls[id];
      ctx.on(b, "pointerdown", (e) => {
        if (!S.ready || st.over) return;
        startCarry(optByTool[id], e, "shelf");
      });
    });
    ctx.on(doc, "pointermove", (e) => {
      const k = st.carry;
      if (!k) return;
      if (!k.moved && Math.hypot(e.clientX - k.x0, e.clientY - k.y0) > 10) {
        k.moved = true;
        held.setAttribute("opacity", 0.95);
      }
      if (k.moved) holdAt(S.pt(e));
    });
    ctx.on(doc, "pointerup", (e) => {
      if (st.carry) endCarry(e);
      if (st.washing) endWash();
    });
    ctx.on(doc, "pointercancel", () => {
      if (st.carry) endCarry(null);
      if (st.washing) endWash();
    });

    /* ---- taps and sweeps on the close-up ---- */
    const onScrape = (p) => Math.abs(p.x - 335) < 260 && Math.abs(p.y - Y) < 90;
    ctx.on(S.svg, "pointerdown", (e) => {
      if (!S.ready) return;
      const p = S.pt(e);
      const c = cur();
      if (!c || st.over || st.busy || st.carry) return;
      // a laid plaster: drag it to straighten it, or tap it to take it off (until ✓: UX 17)
      if (c.kind === "plaster") {
        const pl = plasterAt(p);
        if (pl) {
          lift(pl);
          startCarry(pl.opt, e, "laid");
          return;
        }
        // tap, then tap: a plaster picked on the shelf goes on where the child taps (no snapping: it still has to cover)
        if (optByTool[S.sel] && onScrape(p)) drop(optByTool[S.sel], p);
        return;
      }
      if (!S.sel || !onScrape(p)) return;
      if (S.sel === "paani" && c.kind === "wash") {
        st.washing = true;
        washAt(p);
        return;
      }
      if (S.sel === "cloth" && c.kind === "dab") {
        st.dabs++;
        const m = s("image", { href: url(ART + "cloth-blue.webp"), x: p.x - 50, y: p.y - 40, width: 100, height: 74 }, S.fx);
        m.animate([{ transform: "translateY(-14px)" }, { transform: "translateY(0)" }, { transform: "translateY(-10px)", opacity: 0 }], { duration: 450, fill: "forwards" });
        ctx.after(480, () => m.remove());
        wetG.setAttribute("opacity", Math.max(0, 1 - st.dabs * 0.3));
        S.face("happy", 500);
        S.count(st.dabs);
        // SH-40: the next action (a plaster) closes this step from level 2: no ✓
        ctx.tally("cloth", st.dabs, { next: "pl-", of: c.count }); // S02-A hook: decision 52, the next step shows at L2+
        // D5 (1 Oct, SH-38): at level 1 the row turns gold at the count and the step closes by itself
        if (ctx.level === 1 && st.dabs >= c.count) S.when(() => (cur() !== c || st.over ? "stop" : !st.busy), close, 450);
      }
    });
    ctx.on(S.svg, "pointermove", (e) => {
      if (!st.washing) return;
      const c = cur();
      if (!c || c.kind !== "wash") return endWash();
      washAt(S.pt(e));
    });
    // ✓ commits the plasters (the last step: nothing else can close it)
    const nextBtn = ctx.button("✓", () => {
      const c = cur();
      if (c && c.kind === "plaster" && fullN() >= n) close();
    }, "done");
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
          const tool = (id) => {
            const r = S.toolEls[id].getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: id };
          };
          const at = (x, y) => Object.assign({ do: "tap" }, S.client(x, y));
          if (st.over || !c || st.busy) return { do: "wait" };
          if (c.kind === "wash") {
            if (S.sel !== "paani") return tool("paani");
            // one sweep through the dirt that's left, left to right
            const left = specks.filter((q) => !q.gone).sort((a, b) => a.x - b.x);
            if (!left.length) return { do: "wait" };
            const pts = left.filter((q, i) => i % 2 === 0 || i === left.length - 1).map((q) => {
              const p = S.client(q.x, q.y);
              return [p.x, p.y];
            });
            if (pts.length < 2) pts.push([pts[0][0] + 4, pts[0][1] + 2]);
            return { do: "drag", pts, steps: 4, what: "wash" };
          }
          if (c.kind === "dab") {
            if (st.dabs < c.count) return S.sel !== "cloth" ? tool("cloth") : at(patches[0].x, patches[0].y);
            // the next action: the first plaster, dragged on
          }
          const m = fullN();
          if (m >= n) return { do: "button" };
          const want = "pl-" + P.key(P.steps[2].seq[m]);
          const pt = patches.find((q) => !q.cover) || patches.find((q) => !q.full);
          if (pt.cover) {
            // straighten a plaster with red showing: drag it onto its patch
            const a = S.client(pt.cover.x, pt.cover.y);
            const b = S.client(pt.x, pt.y);
            return { do: "drag", pts: [[a.x, a.y], [(a.x + b.x) / 2, (a.y + b.y) / 2], [b.x, b.y]], what: "straighten" };
          }
          const r = S.toolEls[want].getBoundingClientRect();
          const a = [r.left + r.width / 2, r.top + r.height / 2];
          const b = S.client(pt.x, pt.y);
          return { do: "drag", pts: [a, [(a[0] + b.x) / 2, (a[1] + b.y) / 2 - 20], [b.x, b.y]], steps: 6, what: want };
        },
        slip() {
          // one dab too many
          const c = cur();
          if (c && c.kind === "dab" && S.sel === "cloth" && st.dabs === c.count) return Object.assign({ do: "tap", what: "extra dab" }, S.client(patches[0].x, patches[0].y));
          return null;
        },
      },
      expect() {
        return this.debug.next();
      },
    };
  }

  function plan(level, ailmentId, rng, knobs) {
    return ailmentId === "cut" ? planCut(level, ailmentId, rng, knobs) : planScrape(level, rng);
  }
  function mount(stage, ctx) {
    return ctx.ailment && ctx.ailment.id === "cut" ? mountCut(stage, ctx) : mountScrape(stage, ctx);
  }
  function bot(level, rng) {
    const p = planScrape(level, rng);
    return Object.assign(HS.bot(p.rows, rng), { plan: p });
  }

  const def = {
    id: "cut",
    part: "knee",
    ailments: ["cut", "scrape"], // the scrape is the default at every level; the cut only when asked
    items: ["paani", "cloth", "thread", "plaster"],
    itemsFor: { scrape: ["paani", "cloth", "plaster"], cut: ["paani", "thread", "plaster"] },
    gestures: ["tap", "drag"],
    levels: [1, 2, 3],
    plan,
    mount,
    bot,
    why: WHY,
    cues: CUES,
    steps: (level, rng) => planScrape(level, rng).steps.map((x) => x.kind),
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
