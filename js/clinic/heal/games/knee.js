/*
 * H1 The kicking knee (and the cast): a healing game for the clinic.
 * docs/clinic-heal-api.md (the contract), docs/modes/clinic-design.md Q4 H1.
 *
 * Gestures (fixed at every level, UX s12): tap the dish, tap the spot
 * (the hammer kicks, the X-ray plate goes on, the bone clonks, the crutches
 * go under); wrap = drag round the track, one lap = one turn.
 *
 * The Kutchi decides every row: the kick count and the turns (level 1), plus
 * the break's clonks (level 2), plus the side in the patient's voice and the
 * wrap path pela ... ne poi ... (level 3). A step closes when the item is put
 * down (the next dish, or Done): only then does its line tick, whatever the
 * count (a count never ends itself). Mistakes are logged silently.
 *
 * Pure core (plan, judge, bot) runs in Node for build/leak_clinic_heal_a.mjs.
 */
(function (root) {
  "use strict";
  const ID = "knee";
  let DATA = null;
  let dataP = null;
  const isNode = typeof module === "object" && module.exports && typeof window === "undefined";
  if (isNode) DATA = require("../../../../data/clinic/heal/" + ID + ".json");
  const base = (() => {
    try {
      const s = document.currentScript && document.currentScript.src;
      return s ? s.replace(/js\/clinic\/heal\/games\/[^/]+$/, "") : "";
    } catch (e) {
      return "";
    }
  })();
  function load() {
    if (DATA) return Promise.resolve(DATA);
    if (!dataP) dataP = fetch(base + "data/clinic/heal/" + ID + ".json").then((r) => r.json()).then((d) => (DATA = d));
    return dataP;
  }
  if (!isNode) load().catch(() => {});

  /* ---------------- the pure core ---------------- */
  const pick = (rng, a) => a[Math.floor(rng() * a.length) % a.length];
  const NUM = (n) => "num-0" + n;
  const OTHER = { left: "right", right: "left" };

  /** "{n} {taps}" with word ids -> {k, e, parts} (placeholders as [EN: ...]). */
  function fill(D, lineId, vars) {
    const L = D.lines[lineId];
    const w = (v, lang) => {
      const W = D.words[v];
      if (!W) return String(v);
      if (lang === "e") return W.english;
      return W.kutchi ? W.kutchi : "[EN: " + W.english + "]";
    };
    const run = (tpl, lang) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? w(vars[k], lang) : "{" + k + "}"));
    const cap = (s) => s.replace(/(^|\. )(\[EN: )?(\w)/g, (m, a, b, c) => a + (b || "") + c.toUpperCase());
    const k = cap(run(L.k, "k").replace(/\] \[EN: /g, " "));
    const e = run(L.e, "e");
    const parts = [];
    k.split(/(\[EN: [^\]]*\])/).forEach((s) => {
      if (!s) return;
      const m = /^\[EN: (.*)\]$/.exec(s);
      parts.push(m ? { t: m[1], ph: true } : { t: s, ph: false });
    });
    return { kutchi: k, english: e.charAt(0).toUpperCase() + e.slice(1), parts, line: lineId, voice: L.voice };
  }

  function plan(D, level, rng, opts = {}) {
    const L = D.levels[String(level)] || D.levels["1"];
    const ailment = opts.ailment && L.ailments.includes(opts.ailment) ? opts.ailment : pick(rng, L.ailments);
    const side = opts.side === "left" || opts.side === "right" ? opts.side : pick(rng, ["left", "right"]);
    const rows = [];
    const words = [];
    const add = (row, deciders) => {
      rows.push(row);
      deciders.forEach((d) => words.push(d));
    };
    if (L.side_heard) {
      const part = ailment === "knee-bump" ? "body-knee" : "body-leg";
      add(Object.assign({ id: "side", kind: "side", want: { side }, placeholder: true }, fill(D, "heal-knee-side", { side: "side-" + side, part })), ["side-" + side]);
    }
    if (ailment === "knee-bump") {
      const n = pick(rng, L.kicks);
      add(Object.assign({ id: "kick", kind: "kick", item: "hammer", want: { n, part: "body-knee", side } }, fill(D, "heal-knee-kick", { what: "w-tap-knee", n: NUM(n), taps: "w-taps" })), [NUM(n)]);
      if (L.paths) {
        const path = pick(rng, L.paths);
        const r = fill(D, "heal-knee-path", { what: "w-bandage", pela: "lnk-pela", nepoi: "lnk-nepoi", a: path[0], b: path[1], c: path[2] });
        add(Object.assign({ id: "wrap", kind: "path", item: "bandage", want: { path, side } }, r), ["lnk-pela", "lnk-nepoi"]);
      } else {
        const n2 = pick(rng, L.turns);
        add(Object.assign({ id: "wrap", kind: "laps", item: "bandage", want: { n: n2, part: "body-knee", side } }, fill(D, "heal-knee-wrap", { what: "w-bandage", n: NUM(n2), turns: "w-turns" })), [NUM(n2)]);
      }
    } else {
      const c = pick(rng, L.clonks);
      add(Object.assign({ id: "xray", kind: "xray", item: "xray", want: { n: c, part: "body-leg", side } }, fill(D, "heal-knee-xray", { what: "w-xray", n: NUM(c), taps: "w-taps" })), [NUM(c)]);
      const t = pick(rng, L.turns);
      add(Object.assign({ id: "cast", kind: "laps", item: "cast", want: { n: t, part: "body-leg", side } }, fill(D, "heal-knee-cast", { what: "w-cast", n: NUM(t), turns: "w-turns" })), [NUM(t)]);
    }
    rows.forEach((r) => {
      if (r.placeholder === undefined) r.placeholder = false;
    });
    const uniq = [...new Set(words)].map((id) => ({ id, kutchi: D.words[id].kutchi, english: D.words[id].english, placeholder: !D.words[id].kutchi }));
    return { id: ID, level: Number(level), ailment, side, cue: !L.side_heard, rows, words: uniq, items: D.ailments[ailment].items };
  }

  /** Grade each row from the step events: [{row, kind, part, side}]. */
  function judge(P, events) {
    const out = {};
    const of = (id) => events.filter((e) => e.row === id);
    P.rows.forEach((r) => {
      const ev = of(r.id);
      const w = r.want;
      let ok = false;
      if (r.kind === "side") {
        const sided = events.filter((e) => e.side);
        ok = sided.length > 0 && sided.every((e) => e.side === w.side);
      } else if (r.kind === "kick") {
        ok = ev.length === w.n && ev.every((e) => e.kind === "kick" && e.part === w.part && e.side === w.side);
      } else if (r.kind === "laps") {
        const laps = ev.filter((e) => e.kind === "lap");
        ok = laps.length === w.n && laps.every((e) => e.part === w.part && e.side === w.side);
      } else if (r.kind === "path") {
        const laps = ev.filter((e) => e.kind === "lap");
        ok = laps.length === w.path.length && laps.every((e, i) => e.part === w.path[i] && e.side === w.side);
      } else if (r.kind === "xray") {
        const plates = ev.filter((e) => e.kind === "plate");
        const clonks = ev.filter((e) => e.kind === "clonk");
        ok = plates.length >= 1 && plates.every((e) => e.part === w.part && e.side === w.side) && clonks.length === w.n;
      }
      out[r.id] = ok;
    });
    const right = Object.values(out).filter(Boolean).length;
    return { rows: out, right, total: P.rows.length, ear: right === P.rows.length };
  }

  /** Events a player would make: fair (knows the words) or a blind strategy. */
  function play(D, P, strategy, rng) {
    const L = D.levels[String(P.level)];
    const ev = [];
    const fair = strategy === "fair";
    const fixed = /^fixed-(\d)$/.exec(strategy);
    const count = (list) => (fair ? null : fixed ? Number(fixed[1]) : strategy === "tray-order" ? 1 : pick(rng, list));
    // the side: seen on screen at levels 1-2 (the bump, the swirl); a guess at level 3
    const side = fair || P.cue ? P.side : strategy === "random" ? pick(rng, ["left", "right"]) : "left";
    P.rows.forEach((r) => {
      const w = r.want;
      const n = (list) => (fair ? w.n : count(list));
      if (r.kind === "kick") for (let i = 0; i < n(L.kicks); i++) ev.push({ row: r.id, kind: "kick", part: "body-knee", side });
      else if (r.kind === "laps") for (let i = 0; i < n(L.turns); i++) ev.push({ row: r.id, kind: "lap", part: w.part, side });
      else if (r.kind === "path") {
        const path = fair ? w.path : strategy === "random" ? pick(rng, L.paths) : L.paths[0];
        path.forEach((p) => ev.push({ row: r.id, kind: "lap", part: p, side }));
      } else if (r.kind === "xray") {
        ev.push({ row: r.id, kind: "plate", part: "body-leg", side });
        for (let i = 0; i < n(L.clonks); i++) ev.push({ row: r.id, kind: "clonk" });
      }
    });
    return ev;
  }

  function bot(level, rng) {
    const P = plan(DATA, level, rng);
    return {
      rows: P.rows.map((r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, placeholder: r.placeholder })),
      plan: P,
      strategies: ["fair", "random", "tray-order", "fixed-1", "fixed-2", "fixed-3", "fixed-4", "fixed-5"],
      solve(strategy) {
        return judge(P, play(DATA, P, strategy, rng));
      },
    };
  }

  /* ---------------- the browser kit (SVG greybox) ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  const S = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const COLOURS = { red: "#c9483b", green: "#4f9a58", blue: "#3f76b8", yellow: "#e5b33d", pink: "#e98fb0", white: "#f4f1ea" };
  function css() {
    if (document.getElementById("hA-css")) return;
    const st = document.createElement("style");
    st.id = "hA-css";
    st.textContent = `
.hA-root{position:absolute;inset:0;overflow:hidden;user-select:none;-webkit-user-select:none;touch-action:none;background:#f6efe4}
.hA-root svg{width:100%;height:100%;display:block;touch-action:none}
.hA-dish{cursor:pointer}
.hA-dish.lift>rect{stroke:#e2a33b;stroke-width:6}
.hA-dish.lift{transform:translateX(10px)}
.hA-dish.used{opacity:.45}
.hA-dish.throb{animation:hAthrob 1s ease-in-out infinite}
@keyframes hAthrob{50%{transform:scale(1.07)}}
.hA-dish,.hA-done{transform-box:fill-box;transform-origin:center}
.hA-done{cursor:pointer}
.hA-done.throb{animation:hAthrob 1s ease-in-out infinite}
.hA-track{fill:none;stroke:#e2a33b;stroke-width:5;stroke-dasharray:10 10;opacity:.9;animation:hAdash 1.2s linear infinite}
@keyframes hAdash{to{stroke-dashoffset:-40}}
.hA-pop{font:700 34px system-ui,sans-serif;fill:#3a2e28;paint-order:stroke;stroke:#fff;stroke-width:6px}
`;
    document.head.appendChild(st);
  }
  const ICON = {
    hammer(g) {
      S("rect", { x: -8, y: -8, width: 16, height: 46, rx: 4, fill: "#a0703f" }, g);
      S("rect", { x: -26, y: -30, width: 52, height: 24, rx: 8, fill: "#e46d8f", stroke: "#8a3a52", "stroke-width": 3 }, g);
    },
    bandage(g, c) {
      S("ellipse", { cx: 0, cy: 4, rx: 30, ry: 26, fill: c || "#f4f1ea", stroke: "#b8b0a0", "stroke-width": 3 }, g);
      S("ellipse", { cx: 0, cy: 4, rx: 10, ry: 9, fill: "#d8d0c0" }, g);
      S("path", { d: "M28 8 L44 30 L34 34 Z", fill: c || "#f4f1ea", stroke: "#b8b0a0", "stroke-width": 2 }, g);
    },
    xray(g) {
      S("rect", { x: -30, y: -34, width: 60, height: 68, rx: 6, fill: "#26303a", stroke: "#8fa3b5", "stroke-width": 3 }, g);
      S("path", { d: "M-6 -24 L4 0 L-4 24", stroke: "#eef", "stroke-width": 8, fill: "none", "stroke-linecap": "round" }, g);
    },
    cast(g, c) {
      S("rect", { x: -26, y: -30, width: 52, height: 60, rx: 12, fill: c || "#3f76b8", stroke: "#1e3a5c", "stroke-width": 3 }, g);
      S("line", { x1: -26, y1: -10, x2: 26, y2: -10, stroke: "#fff", "stroke-width": 3, opacity: 0.5 }, g);
      S("line", { x1: -26, y1: 10, x2: 26, y2: 10, stroke: "#fff", "stroke-width": 3, opacity: 0.5 }, g);
    },
    crutches(g) {
      [-12, 12].forEach((dx) => {
        S("line", { x1: dx, y1: -34, x2: dx * 0.6, y2: 36, stroke: "#8a8f99", "stroke-width": 7, "stroke-linecap": "round" }, g);
        S("line", { x1: dx - 9, y1: -34, x2: dx + 9, y2: -34, stroke: "#5a5f69", "stroke-width": 7, "stroke-linecap": "round" }, g);
      });
    },
    other(g) {
      S("circle", { r: 26, fill: "#d8d2c8", stroke: "#a09a90", "stroke-width": 3 }, g);
      S("text", { "text-anchor": "middle", y: 10, "font-size": 30, fill: "#7a746a" }, g).textContent = "?";
    },
  };

  /* ---------------- the game ---------------- */
  const game = {
    id: ID,
    part: "body-knee",
    ailments: ["knee-bump", "leg-break"],
    items: ["hammer", "bandage", "xray", "cast", "crutches"],
    gestures: ["tap", "drag"],
    levels: [1, 2, 3],
    plan: (level, rng, opts) => plan(DATA, level, rng, opts),
    judge,
    load,
    bot,
    mount(stage, ctx) {
      css();
      let alive = true;
      let ctl = null;
      const controller = {
        start() {
          return load().then((D) => {
            if (!alive) return;
            ctl = run(stage, ctx, D);
          });
        },
        destroy() {
          alive = false;
          if (ctl) ctl.destroy();
          stage.querySelectorAll(".hA-root").forEach((n) => n.remove());
        },
        get debug() {
          return ctl && ctl.debug;
        },
      };
      return controller;
    },
  };

  function run(stage, ctx, D) {
    const rng = ctx.rng || Math.random;
    const P = plan(D, ctx.level || 1, rng, { side: ctx.side, ailment: ctx.ailment });
    const level = P.level;
    const events = [];
    if (getComputedStyle(stage).position === "static") stage.style.position = "relative";
    const rootEl = document.createElement("div");
    rootEl.className = "hA-root hA-" + ID;
    stage.appendChild(rootEl);
    const svg = S("svg", { viewBox: "0 0 1000 600", preserveAspectRatio: "xMidYMid meet" }, rootEl);
    const sceneG = S("g", {}, svg);
    const trayG = S("g", {}, svg);
    const fxG = S("g", { "pointer-events": "none" }, svg);
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(() => alive && fn(), ms));
    let alive = true;
    const toSvg = (ev) => {
      const p = svg.createSVGPoint();
      p.x = ev.clientX;
      p.y = ev.clientY;
      const m = svg.getScreenCTM();
      return m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 };
    };
    const pop = (text, x, y, ms = 800) => {
      const t = S("text", { x, y, "text-anchor": "middle", class: "hA-pop" }, fxG);
      t.textContent = text;
      t.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-40px)", opacity: 0 }], { duration: ms, easing: "ease-out" });
      later(() => t.remove(), ms);
    };
    const react = (mood) => {
      try {
        ctx.patient && ctx.patient.react && ctx.patient.react(mood);
      } catch (e) {}
    };
    const say = (id) => {
      try {
        ctx.say && ctx.say(id);
      } catch (e) {}
    };

    /* the scene: the patient's legs on the bench, facing us (their left is our right) */
    const X = { right: 400, left: 640 };
    const KY = 250;
    const SHIN = [300, 460];
    S("rect", { x: 170, y: 130, width: 690, height: 90, rx: 14, fill: "#b98a5a" }, sceneG);
    S("rect", { x: 170, y: 214, width: 690, height: 16, fill: "#8d6540" }, sceneG);
    const legs = {};
    const skin = "#c89f84";
    const shorts = S("path", { d: "M300 40 H740 Q760 40 760 70 V200 H570 L540 170 L500 170 L470 200 H280 V70 Q280 40 300 40 Z", fill: "#5d86b8", stroke: "#3f5f87", "stroke-width": 4 }, sceneG);
    ["right", "left"].forEach((side) => {
      const x = X[side];
      const g = S("g", {}, sceneG);
      S("rect", { x: x - 52, y: 190, width: 104, height: 70, fill: skin }, g);
      const shin = S("g", {}, g);
      shin.style.transformBox = "view-box";
      shin.style.transformOrigin = x + "px " + KY + "px";
      S("rect", { x: x - 46, y: SHIN[0] - 30, width: 92, height: SHIN[1] - SHIN[0] + 30, rx: 30, fill: skin }, shin);
      S("path", { d: `M${x - 48} ${SHIN[1] - 10} h96 q10 0 10 14 v22 h${side === "right" ? -130 : -96} q-18 0 -18 -18 z`, fill: "#e8e2d6", stroke: "#a09a90", "stroke-width": 3, transform: side === "right" ? "" : `translate(${2 * x},0) scale(-1,1)` }, shin);
      const layers = S("g", {}, shin);
      const knee = S("circle", { cx: x, cy: KY, r: 60, fill: skin, stroke: "#a9826a", "stroke-width": 3 }, g);
      const kneeLayers = S("g", {}, g);
      legs[side] = { g, shin, layers, knee, kneeLayers, x };
    });
    // the visible cue at levels 1-2: a bump (knee) or a sore swirl (leg) on the sore side
    const cueG = S("g", { "pointer-events": "none" }, sceneG);
    if (P.cue) {
      const x = X[P.side];
      if (P.ailment === "knee-bump") {
        S("circle", { cx: x + 8, cy: KY - 12, r: 22, fill: "#e59a8a", stroke: "#c46f62", "stroke-width": 3 }, cueG);
      } else {
        const d = [];
        for (let t = 0; t < Math.PI * 4; t += 0.25) d.push((d.length ? "L" : "M") + (x + Math.cos(t) * (4 + t * 3)) + " " + (385 + Math.sin(t) * (4 + t * 3) * 0.8));
        S("path", { d: d.join(" "), stroke: "#e46d8f", "stroke-width": 5, fill: "none" }, legs[P.side].layers);
      }
    }
    // tracks for the wrap (shown while the bandage or the cast is in hand)
    const tracks = [];
    ["right", "left"].forEach((side) => {
      [
        ["body-knee", KY, 80, 44],
        ["body-leg", 385, 68, 38],
      ].forEach(([part, cy, rx, ry]) => {
        const parent = part === "body-knee" ? legs[side].kneeLayers : legs[side].layers;
        const el = S("ellipse", { cx: X[side], cy, rx, ry, class: "hA-track", visibility: "hidden" }, parent);
        tracks.push({ part, side, cx: X[side], cy, rx, ry, el, acc: 0, laps: 0 });
      });
    });
    const trackOn = (item) => {
      const part = item === "cast" ? "body-leg" : item === "bandage" ? (P.rows.some((r) => r.kind === "path") ? null : "body-knee") : "none";
      tracks.forEach((t) => {
        const show = part !== "none" && (part === null || t.part === part) && (!P.cue || t.side === P.side);
        t.el.setAttribute("visibility", show ? "visible" : "hidden");
        t.live = show;
      });
    };
    // Kasuku, who squawks at every kick
    const kasuku = S("g", { transform: "translate(930,70)", opacity: 0 }, fxG);
    S("ellipse", { rx: 26, ry: 34, fill: "#3fae5a" }, kasuku);
    S("circle", { cx: 6, cy: -18, r: 5, fill: "#fff" }, kasuku);
    S("path", { d: "M18 -12 l14 6 l-14 6 z", fill: "#e5b33d" }, kasuku);

    /* the tray: the child's dishes, in the pharmacy's order, as a column on the left */
    const tray = (ctx.tray || []).map((t) => (typeof t === "string" ? { id: t } : t));
    const dishes = [];
    const needed = P.items.slice();
    tray.forEach((t) => dishes.push({ item: t.id, colour: t.colour, count: t.count, useful: needed.includes(t.id) }));
    needed.forEach((id) => {
      if (!dishes.some((d) => d.item === id)) dishes.push({ item: id, useful: true, spare: true });
    });
    const dishH = Math.min(118, Math.floor(560 / Math.max(3, dishes.length)));
    dishes.forEach((d, i) => {
      const g = S("g", { class: "hA-dish", id: "hA-dish-" + i, transform: "" }, trayG);
      const gg = S("g", { transform: `translate(20,${20 + i * (dishH + 8)})` }, trayG);
      gg.appendChild(g);
      S("rect", { x: 0, y: 0, width: 124, height: dishH, rx: 18, fill: "#fffaf2", stroke: "#cdbfa8", "stroke-width": 3 }, g);
      const ic = S("g", { transform: `translate(62,${dishH / 2}) scale(${dishH / 118})` }, g);
      (ICON[d.item] || ICON.other)(ic, COLOURS[d.colour]);
      d.g = g;
      d.i = i;
      d.row = P.rows.find((r) => r.item === d.item && d.useful) || null;
      g.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation();
        choose(d);
      });
    });
    const doneG = S("g", { class: "hA-done", id: "hA-done", transform: "translate(870,470)" }, svg);
    const doneInner = S("g", {}, doneG);
    S("rect", { x: 0, y: 0, width: 116, height: 110, rx: 22, fill: "#4f9a58", stroke: "#2f6a38", "stroke-width": 4 }, doneInner);
    S("path", { d: "M30 56 L50 78 L88 34", stroke: "#fff", "stroke-width": 12, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, doneInner);
    doneG.addEventListener("pointerdown", (ev) => {
      ev.stopPropagation();
      finish();
    });

    /* the card */
    try {
      ctx.card.setRows(P.rows.map((r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, parts: r.parts, voice: r.voice, placeholder: r.placeholder, line: r.line })));
    } catch (e) {}
    if (P.rows[0] && P.rows[0].kind === "side") later(() => say(P.rows[0].line), 300);

    /* steps: a step is a dish in hand; it closes when the next dish is picked (with something done) or Done */
    let active = null;
    const closed = new Set();
    const ticked = new Set();
    let corrected = false;
    let clonkState = null;
    const stepEvents = (row) => events.filter((e) => e.row === row.id);
    function tick(id) {
      if (ticked.has(id)) return;
      ticked.add(id);
      try {
        ctx.card.tick(id);
      } catch (e) {}
    }
    function close(d) {
      if (!d || !d.row || closed.has(d.row.id)) return;
      closed.add(d.row.id);
      d.g.classList.add("used");
      d.g.classList.remove("lift");
      const side = P.rows.find((r) => r.kind === "side");
      if (side) tick(side.id);
      tick(d.row.id);
      const J = judge(P, events);
      try {
        ctx.log({ type: J.rows[d.row.id] ? "right" : "wrong", rowId: d.row.id, detail: { did: stepEvents(d.row).length } });
      } catch (e) {}
    }
    function choose(d) {
      poke();
      if (!alive) return;
      if (d.row && closed.has(d.row.id)) return;
      if (active && active !== d) {
        if (active.row && stepEvents(active.row).length) close(active);
        else active.g.classList.remove("lift");
      }
      active = d;
      d.g.classList.add("lift");
      d.g.classList.remove("throb");
      trackOn(d.item);
      if (d.row && level === 1) say(d.row.line);
      if (d.row && d.row.kind !== "side") {
        const n = stepEvents(d.row).length;
        tally(d.item, n);
      }
      if (!d.useful) {
        try {
          ctx.log({ type: "extra", rowId: null, detail: { item: d.item } });
        } catch (e) {}
      }
    }
    const tallies = {};
    function tally(item, n) {
      tallies[item] = n;
      try {
        ctx.tally(item, n);
      } catch (e) {}
    }
    function gentle(row) {
      // level 1 only: the doctor repeats the line, once in the game (onboarding)
      if (level !== 1 || corrected || !row) return;
      corrected = true;
      say(row.line);
    }

    /* hit-testing the legs */
    function hit(x, y) {
      for (const side of ["right", "left"]) {
        const lx = X[side];
        if (Math.hypot(x - lx, y - KY) < 80) return { part: "body-knee", side };
        if (Math.abs(x - lx) < 75 && y > SHIN[0] - 10 && y < SHIN[1] + 50) return { part: "body-leg", side };
        if (Math.abs(x - lx) < 70 && y > 180 && y < KY) return { part: "body-knee", side };
      }
      return null;
    }

    /* the kick: the fun */
    function kick(side) {
      const L = legs[side];
      const dir = side === "right" ? 1 : -1;
      L.shin.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${58 * dir}deg)`, offset: 0.35 }, { transform: `rotate(${-10 * dir}deg)`, offset: 0.7 }, { transform: "rotate(0deg)" }], { duration: 520, easing: "ease-out" });
      sceneG.animate([{ transform: "translateY(0)" }, { transform: "translateY(-14px)" }, { transform: "translateY(0)" }], { duration: 300 });
      dishes.forEach((dd, i) => dd.g.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${i % 2 ? 6 : -6}deg)` }, { transform: `rotate(${i % 2 ? -4 : 4}deg)` }, { transform: "rotate(0deg)" }], { duration: 360 }));
      kasuku.animate([{ opacity: 0, transform: "translate(930px,90px)" }, { opacity: 1, transform: "translate(930px,60px)", offset: 0.3 }, { opacity: 1, transform: "translate(930px,64px)", offset: 0.8 }, { opacity: 0, transform: "translate(930px,90px)" }], { duration: 900 });
      pop("SQUAWK!", 880, 140, 700);
      pop("BOING!", L.x + dir * -110, 470, 700);
      react("giggle");
    }

    /* the X-ray: a bone with a face and a kink; each tap on it is a clonk */
    function plate(side) {
      if (clonkState) clonkState.g.remove();
      const L = legs[side];
      const g = S("g", {}, L.layers);
      S("rect", { x: L.x - 58, y: 300, width: 116, height: 170, rx: 12, fill: "#26303a", stroke: "#8fa3b5", "stroke-width": 4, opacity: 0.94 }, g);
      const bone = S("path", { d: `M${L.x} 318 L${L.x + 16} 385 L${L.x - 4} 452`, stroke: "#eef2ff", "stroke-width": 20, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
      const face = S("g", {}, g);
      S("circle", { cx: L.x + 4, cy: 360, r: 3.5, fill: "#26303a" }, face);
      S("circle", { cx: L.x + 18, cy: 362, r: 3.5, fill: "#26303a" }, face);
      const mouth = S("ellipse", { cx: L.x + 12, cy: 374, rx: 5, ry: 6, fill: "#26303a" }, face);
      clonkState = { g, bone, mouth, side, straight: false };
      react("ouch");
    }
    function clonk() {
      const c = clonkState;
      const L = legs[c.side];
      if (!c.straight) {
        c.straight = true;
        c.bone.setAttribute("d", `M${L.x} 318 L${L.x} 385 L${L.x} 452`);
        c.mouth.setAttribute("ry", 2);
        c.mouth.setAttribute("rx", 8);
      }
      c.g.animate([{ transform: "translateY(0)" }, { transform: "translateY(4px)" }, { transform: "translateY(0)" }], { duration: 160 });
      pop("CLONK!", L.x, 300, 600);
      react("ouch");
    }

    /* wrapping: laps round a track */
    const bandColour = (item) => {
      const d = dishes.find((x) => x.item === item);
      return (d && COLOURS[d.colour]) || D.colours[item] || "#f4f1ea";
    };
    function band(t, item, k) {
      const parent = t.part === "body-knee" ? legs[t.side].kneeLayers : legs[t.side].layers;
      const w = t.part === "body-knee" ? 124 : 96;
      const h = 22;
      const y = t.cy - 40 + ((k * 23) % 80);
      S("rect", { x: t.cx - w / 2, y, width: w, height: h, rx: 8, fill: bandColour(item), stroke: "#00000033", "stroke-width": 2, transform: `rotate(${k % 2 ? 6 : -6} ${t.cx} ${y + h / 2})`, "pointer-events": "none" }, parent);
    }

    /* the finale */
    let ending = false;
    async function finish(hop) {
      if (ending || !alive) return;
      ending = true;
      if (active && active.row && stepEvents(active.row).length) close(active);
      trackOn("none");
      const J = judge(P, events);
      P.rows.forEach((r) => {
        if (!closed.has(r.id) && r.kind !== "side") {
          try {
            ctx.log({ type: "wrong", rowId: r.id, detail: { did: 0, skipped: true } });
          } catch (e) {}
        }
      });
      const side = P.rows.find((r) => r.kind === "side");
      if (side) {
        tick(side.id);
        try {
          ctx.log({ type: J.rows.side ? "right" : "wrong", rowId: "side", detail: {} });
        } catch (e) {}
      }
      react("happy");
      try {
        ctx.interject && ctx.interject("shabash");
      } catch (e) {}
      if (hop) {
        // hop off on crutches, into the send-off
        const cg = S("g", {}, sceneG);
        ICON.crutches(S("g", { transform: `translate(${X.right - 90},380) scale(2.2)` }, cg));
        ICON.crutches(S("g", { transform: `translate(${X.left + 90},380) scale(2.2)` }, cg));
        await wait(300);
        await sceneG.animate([{ transform: "translate(0,0)" }, { transform: "translate(80px,-40px)" }, { transform: "translate(160px,0)" }, { transform: "translate(240px,-40px)" }, { transform: "translate(320px,0)" }, { transform: "translate(700px,-40px)" }], { duration: 1500, fill: "forwards" }).finished.catch(() => {});
      } else {
        await sceneG.animate([{ transform: "translateY(0)" }, { transform: "translateY(-30px)" }, { transform: "translateY(0)" }, { transform: "translateY(-18px)" }, { transform: "translateY(0)" }], { duration: 900 }).finished.catch(() => {});
      }
      if (!alive) return;
      const words = P.words.map((w) => ({ kutchi: w.kutchi || "[EN: " + w.english + "]", english: w.english, placeholder: w.placeholder }));
      result = { right: J.right, total: J.total, hints, words, rows: J.rows };
      try {
        ctx.done({ right: J.right, total: J.total, hints, words });
      } catch (e) {}
    }
    let result = null;

    /* the idle hint: after 8 s of nothing, the next dish throbs (free) */
    let hints = 0;
    let idleT = null;
    function poke() {
      clearTimeout(idleT);
      idleT = setTimeout(() => {
        if (!alive || ending) return;
        const next = dishes.find((d) => d.row && !closed.has(d.row.id) && d !== active);
        const cur = active && active.row && !closed.has(active.row.id) ? active : null;
        if (!cur && next) {
          next.g.classList.add("throb");
          try {
            ctx.card.pulse(next.row.id);
          } catch (e) {}
        } else if (!next && !cur) doneG.classList.add("throb");
        else if (!next && cur && stepEvents(cur.row).length) doneG.classList.add("throb");
        poke();
      }, 8000);
    }
    poke();

    /* pointer on the scene */
    let drag = null;
    svg.addEventListener("pointerdown", (ev) => {
      if (!alive || ending) return;
      poke();
      const p = toSvg(ev);
      if (!active) return;
      const item = active.item;
      const row = active.row;
      if (!active.useful || !row) {
        // an item that isn't for this ailment: it does nothing on the patient
        const h = hit(p.x, p.y);
        if (h) react("giggle");
        return;
      }
      if (item === "bandage" || item === "cast") {
        const t = tracks
          .filter((t) => t.live)
          .map((t) => ({ t, d: Math.hypot((p.x - t.cx) / t.rx, (p.y - t.cy) / t.ry) }))
          .filter((o) => o.d < 1.9)
          .sort((a, b) => a.d - b.d)[0];
        if (!t) return;
        drag = { t: t.t, prev: Math.atan2(p.y - t.t.cy, p.x - t.t.cx), id: ev.pointerId };
        try {
          svg.setPointerCapture(ev.pointerId);
        } catch (e) {}
        return;
      }
      const h = hit(p.x, p.y);
      if (item === "hammer") {
        if (!h || h.part !== "body-knee") return gentle(row);
        events.push({ row: row.id, kind: "kick", part: h.part, side: h.side });
        if (P.cue && h.side !== P.side) gentle(row);
        kick(h.side);
        tally(item, stepEvents(row).length);
      } else if (item === "xray") {
        if (clonkState && h && h.part === "body-leg" && h.side === clonkState.side) {
          events.push({ row: row.id, kind: "clonk" });
          clonk();
          tally(item, stepEvents(row).filter((e) => e.kind === "clonk").length);
        } else if (h) {
          events.push({ row: row.id, kind: "plate", part: "body-leg", side: h.side });
          plate(h.side);
          if (P.cue && h.side !== P.side) gentle(row);
        } else gentle(row);
      } else if (item === "crutches") {
        if (h) finish(true);
      }
    });
    svg.addEventListener("pointermove", (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const p = toSvg(ev);
      const t = drag.t;
      const a = Math.atan2(p.y - t.cy, p.x - t.cx);
      let d = a - drag.prev;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      drag.prev = a;
      if (Math.hypot(p.x - t.cx, p.y - t.cy) < 12) return;
      t.acc += d;
      const row = active && active.row;
      while (Math.abs(t.acc) >= 2 * Math.PI * (t.laps + 1) && row) {
        t.laps++;
        events.push({ row: row.id, kind: "lap", part: t.part, side: t.side });
        const k = stepEvents(row).length;
        band(t, active.item, k);
        tally(active.item, k);
        pop(String(k), t.cx + t.rx + 30, t.cy, 500);
        react("giggle");
        if (P.cue && t.side !== P.side) gentle(row);
      }
    });
    const up = (ev) => {
      if (drag && ev.pointerId === drag.id) drag = null;
    };
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", up);

    // onboarding (the first time only; the core's kit): the first dish, then the knee
    try {
      if (ctx.onboard) ctx.onboard([{ spotlight: dishes[0].g, ghost: { gesture: "tap" } }]);
    } catch (e) {}

    return {
      destroy() {
        alive = false;
        clearTimeout(idleT);
        timers.forEach(clearTimeout);
        rootEl.remove();
      },
      debug: {
        plan: P,
        events,
        get result() {
          return result;
        },
        /** Screen points for a test: a dish, a part, a track (to circle), Done. */
        where(what, a, b) {
          const m = svg.getScreenCTM();
          const scr = (x, y) => {
            const p = svg.createSVGPoint();
            p.x = x;
            p.y = y;
            const q = p.matrixTransform(m);
            return { x: q.x, y: q.y };
          };
          if (what === "dish") {
            const d = dishes.find((x) => x.item === a);
            const r = d.g.getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
          }
          if (what === "done") {
            const r = doneG.getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
          }
          if (what === "part") return a === "body-knee" ? scr(X[b], KY) : scr(X[b], 390);
          if (what === "track") {
            const t = tracks.find((t) => t.part === a && t.side === b);
            return { c: scr(t.cx, t.cy), r: scr(t.cx + t.rx, t.cy).x - scr(t.cx, t.cy).x, ry: scr(t.cx, t.cy + t.ry).y - scr(t.cx, t.cy).y };
          }
          return null;
        },
      },
    };
  }

  if (typeof module === "object" && module.exports) module.exports = game;
  if (root && root.Clinic && root.Clinic.Heal && root.Clinic.Heal.register) root.Clinic.Heal.register(game);
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this);
