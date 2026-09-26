/*
 * H2/H8 Wash, stitch, plaster: the reference healing game for
 * docs/clinic-heal-api.md (design: docs/modes/clinic-design.md Q4, Q5).
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

  const NUM = { 1: "hakro", 2: "ba", 3: "trae", 4: "char", 5: "panj" };
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
  function plan(level, ailmentId, rng, knobs) {
    const K = Object.assign({}, KNOBS, knobs || {});
    const ail = ailmentId === "cut" || ailmentId === "scrape" ? ailmentId : level >= 2 ? "cut" : "scrape";
    const L = Math.max(1, Math.min(3, level));
    const steps = [];
    const first = (w, en) => ({ kutchi: `Pela ${w}`, english: `First ${en}` });
    const then = (w, en) => ({ kutchi: `Ne poi ${w}`, english: `And then ${en}` });
    steps.push({ id: "wash", kind: "wash", item: "paani", row: Object.assign({ id: "wash" }, first("paani", "water")), tested: false });
    if (ail === "scrape") {
      const dab = { id: "dab", kind: "dab", item: "cloth", tested: L >= 2 };
      if (L >= 2) {
        dab.count = pick(K.dabCounts[L], rng);
        dab.options = K.dabCounts[L];
        dab.row = { id: "dab", kutchi: `Ne poi [cloth]. ${cap(NUM[dab.count])} [dabs]`, english: `And then the cloth. ${dab.count} dabs` };
      } else dab.row = Object.assign({ id: "dab" }, then("[cloth]", "the cloth"));
      steps.push(dab);
    } else {
      const st = { id: "stitch", kind: "stitch", item: "thread", tested: L >= 2 };
      if (L === 1) {
        st.gaps = [{ size: "one", dots: K.stitchDots[1], count: null }];
        st.row = Object.assign({ id: "stitch" }, then("[thread]", "the thread"));
      } else if (L === 2) {
        st.count = pick(K.stitchCounts[2], rng);
        st.options = K.stitchCounts[2];
        st.gaps = [{ size: "one", dots: K.stitchDots[2], count: st.count }];
        st.row = { id: "stitch", kutchi: `Ne poi [thread]. ${cap(NUM[st.count])} [stitches]`, english: `And then the thread. ${st.count} stitches` };
      } else {
        const big = pick(K.stitchCounts[3].big, rng);
        const small = pick(K.stitchCounts[3].small, rng);
        const bigFirst = rng() < 0.5;
        const a = bigFirst ? ["wadho", big, "big"] : ["nindho", small, "small"];
        const b = bigFirst ? ["nindho", small, "small"] : ["wadho", big, "big"];
        st.gaps = [
          { size: "big", dots: K.stitchDots[3].big, count: big },
          { size: "small", dots: K.stitchDots[3].small, count: small },
        ];
        st.order = bigFirst ? ["big", "small"] : ["small", "big"];
        st.bigLeft = rng() < 0.5; // where the big gap sits on screen: random, so position gives nothing away
        st.row = {
          id: "stitch",
          kutchi: `Ne poi [thread]: pela ${a[0]}, ${NUM[a[1]]}; ne poi ${b[0]}, ${NUM[b[1]]}`,
          english: `And then the thread: first the ${a[2]} one, ${a[1]}; then the ${b[2]} one, ${b[1]}`,
        };
      }
      steps.push(st);
    }
    const pl = { id: "plaster", kind: "plaster", item: "plaster", tested: L >= 2 };
    if (L >= 2) {
      pl.options = K.plasterColours[L];
      pl.colour = pick(pl.options, rng);
      pl.row = { id: "plaster", kutchi: `Ne poi [the ${pl.colour} plaster]`, english: `And then the ${pl.colour} plaster` };
    } else {
      pl.options = K.designs;
      pl.row = Object.assign({ id: "plaster" }, then("[plaster]", "the plaster"));
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
    const words = [{ kutchi: "paani", english: "water", id: "paani" }, { kutchi: "pela", english: "first" }, { kutchi: "ne poi", english: "and then" }];
    steps.forEach((s) => {
      if (s.count) words.push({ kutchi: NUM[s.count], english: String(s.count) });
      (s.gaps || []).forEach((g) => g.count && words.push({ kutchi: NUM[g.count], english: String(g.count) }));
    });
    if (L === 3 && ail === "cut") words.push({ kutchi: "wadho", english: "big" }, { kutchi: "nindho", english: "small" });
    steps.forEach((s) => s.item !== "paani" && words.push({ kutchi: null, english: s.item === "thread" ? "thread" : s.item, placeholder: true }));
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
  function bot(level, rng) {
    const p = plan(level, level >= 2 ? "cut" : "scrape", rng);
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
  function mount(stage, ctx) {
    const doc = stage.ownerDocument;
    const K = Object.assign({}, KNOBS, (ctx.data && ctx.data.knobs) || {});
    const P = plan(ctx.level, ctx.ailment && ctx.ailment.id, ctx.rng, K);
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
        if (P.upFront) await ctx.card.speak();
        else await ctx.say(rows[0]);
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

  const def = {
    id: "cut",
    part: "knee",
    ailments: ["scrape", "cut"],
    items: ["paani", "cloth", "thread", "plaster"],
    itemsFor: { scrape: ["paani", "cloth", "plaster"], cut: ["paani", "thread", "plaster"] },
    gestures: ["tap", "drag"],
    levels: [1, 2, 3],
    plan,
    mount,
    bot,
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
