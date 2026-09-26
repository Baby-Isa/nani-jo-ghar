/*
 * Clinic heal game `tummy`: H10 Bubbles and burps (docs/modes/clinic-design.md;
 * contract docs/clinic-heal-api.md).
 *
 * Ali ate too many sweets at the wedding. The close-up: a round comic belly
 * (the shirt rolled up, a belly button with a face), six coloured bubbles
 * wobbling inside, and a see-through tube winding up to the patient's mouth.
 * *Trae [EN: bubbles]!*: DRAG a bubble up out of the belly into the tube; it
 * floats up on its own and at the top a big comic BURP pops, the cheeks
 * puff, the patient giggles. Six are always there, so the count matters.
 * *Ne poi dudh* (level 2+: *ne poi adh dudh*, half a glass): tap the cup
 * dish, a glass appears by the mouth and three unlabelled pitchers (paani,
 * dudh, chai: the picture is the only cue); a tap pours half a glass, two a
 * full one, a third overflows. Level 3: the hot-water bottle on the belly
 * and the order (*pela … ne poi …*), at random.
 *
 * Gestures (every level, UX s12): tap (the dish, the pitcher, the belly) +
 * drag (a bubble up into the tube). A row ticks when its step CLOSES (the
 * next dish, or Done), never on a count.
 *
 * Levels are data: data/clinic/heal/tummy.json. `makeRound` is pure and
 * shared by mount() and bot().
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const ID = "tummy";
  const nodeData = () => {
    const fs = require("fs");
    const path = require("path");
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", "data", "clinic", "heal", `${ID}.json`), "utf8"));
  };

  /* ---------------- pure ---------------- */
  const pick = (rng, a) => a[Math.floor(rng() * a.length) % a.length];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const N_BUBBLES = 6; // always six in the belly: the count is the Kutchi's
  const HALF = 1; // pours: one tap = half a glass, two = full, a third overflows
  const FULL = 2;

  function makeRound(D, level, rng) {
    const lv = D.levels[String(level)] || D.levels["1"];
    const W = D.words;
    const count = pick(rng, lv.bubbles);
    const num = D.numbers.find((n) => n.n === count);
    const dk = pick(rng, D.drinks);
    const dw = W[dk.word];
    const amount = lv.amount ? (rng() < 0.5 ? HALF : FULL) : null;
    const order = lv.bottle ? (rng() < 0.5 ? ["bottle", "drink"] : ["drink", "bottle"]) : ["drink"];
    const rows = [];
    const bw = count === 1 ? W.bubble.english : W.bubbles.english;
    rows.push({ id: "bubbles", kutchi: `${cap(num.kutchi)} [${bw}]!`, english: `${cap(num.english)} ${bw}, up and out!`, who: "doctor" });
    const dK = `${amount === HALF ? W.adh.kutchi + " " : ""}${dw.kutchi}`;
    const dE = amount === HALF ? `half a glass of ${dw.english}` : amount === FULL ? `a full glass of ${dw.english}` : dw.english;
    order.forEach((step, k) => {
      const first = k === 0 && order.length > 1;
      const link = first ? W.pela : W.nepoi;
      const enLink = first ? "First," : "And then";
      if (step === "drink") rows.push({ id: "drink", kutchi: `${link.kutchi} ${dK}`, english: `${enLink} ${dE}`, who: "doctor" });
      else rows.push({ id: "bottle", kutchi: `${link.kutchi} [${W.bottle.english}]`, english: `${enLink} ${W.bottle.english}`, who: "doctor" });
    });
    const words = [{ kutchi: num.kutchi.toLowerCase(), english: num.english, audio: num.audio }, { kutchi: dw.kutchi, english: dw.english, audio: dw.audio }];
    if (amount === HALF) words.push({ kutchi: W.adh.kutchi, english: W.adh.english });
    if (order.length > 1) words.push({ kutchi: W.pela.kutchi.toLowerCase(), english: W.pela.english });
    words.push({ kutchi: W.nepoi.kutchi.toLowerCase(), english: W.nepoi.english });
    return {
      level: Number(level),
      count,
      options: lv.bubbles.slice(),
      drink: dk.id,
      drinks: D.drinks.map((d) => d.id),
      amount,
      order,
      bottle: !!lv.bottle,
      list: !!lv.list,
      rows,
      words,
    };
  }

  /** sent: bubbles sent up the tube; pours: the drink of each tap; order: the steps in the order they were first worked. */
  const newState = () => ({ sent: 0, pours: [], drunk: false, bottle: false, order: [] });

  function grade(R, st) {
    const drinkOk = () => {
      if (!st.pours.length || !st.pours.every((d) => d === R.drink)) return false;
      if (R.amount === HALF) return st.pours.length === HALF;
      if (R.amount === FULL) return st.pours.length >= FULL; // an overflow is logged as extra, the glass is still full
      return true;
    };
    // the second of two ordered rows is right only if its step was also worked second
    const orderOk = (step) => R.order.length < 2 || R.order[0] === step || st.order[1] === step;
    return R.rows.map((row) => {
      let right = false;
      if (row.id === "bubbles") right = st.sent === R.count;
      else if (row.id === "drink") right = drinkOk() && orderOk("drink");
      else if (row.id === "bottle") right = st.bottle && orderOk("bottle");
      return { id: row.id, right };
    });
  }

  const STRATEGIES = ["fair", "random", "best", "first", "most"];
  /**
   * The blind bot (pure).
   *   fair    understands every word (must win 100%)
   *   random  0-6 bubbles, any pitcher 1-3 times, any order
   *   best    a count from the level's range, any one pitcher, half or full
   *           when the level asks for an amount (else full), any order
   *   first   the smallest count, the first pitcher, one tap, the drink first
   *   most    the biggest count, any pitcher, a full glass, any order
   */
  function bot(level, rng, D) {
    D = D || nodeData();
    const R = makeRound(D, level, rng);
    const score = (st) => {
      const g = grade(R, st);
      const right = g.filter((r) => r.right).length;
      return { right, total: g.length, win: right === g.length, rows: g };
    };
    const anyOrder = () => (R.bottle ? (rng() < 0.5 ? ["drink", "bottle"] : ["bottle", "drink"]) : ["drink"]);
    return {
      rows: R.rows,
      round: R,
      strategies: STRATEGIES,
      solve(strategy = "best") {
        const st = newState();
        st.drunk = true;
        st.bottle = R.bottle;
        if (strategy === "fair") {
          st.sent = R.count;
          st.pours = Array(R.amount === HALF ? HALF : FULL).fill(R.drink);
          st.order = R.order.slice();
          return score(st);
        }
        let kind = pick(rng, R.drinks);
        let n = FULL;
        if (strategy === "random") {
          st.sent = Math.floor(rng() * (N_BUBBLES + 1));
          n = 1 + Math.floor(rng() * 3);
          st.order = anyOrder();
        } else if (strategy === "best") {
          st.sent = pick(rng, R.options);
          n = R.amount ? (rng() < 0.5 ? HALF : FULL) : FULL;
          st.order = anyOrder();
        } else if (strategy === "first") {
          st.sent = Math.min(...R.options);
          kind = R.drinks[0];
          n = HALF;
          st.order = R.bottle ? ["drink", "bottle"] : ["drink"];
        } else {
          st.sent = Math.max(...R.options);
          st.order = anyOrder();
        }
        st.pours = Array(n).fill(kind);
        if (!R.bottle) st.order = ["drink"];
        return score(st);
      },
      fair() {
        return this.solve("fair");
      },
    };
  }

  /* ---------------- the browser game ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  const CSS = `
.hc-tummy{position:absolute;inset:0;z-index:5;user-select:none;-webkit-user-select:none;touch-action:none}
.hc-tummy svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.hc-tummy [data-heal]{cursor:pointer}
.hc-tummy [data-heal^="bubble"]{cursor:grab}
.hc-tummy .hc-pulse{animation:hcTumPulse 1s ease-in-out infinite}
@keyframes hcTumPulse{0%,100%{opacity:1}50%{opacity:.45}}
.hc-tummy .hc-bubble{font:800 30px/1 "Baloo 2",system-ui,sans-serif;fill:#3a2e28}
.hc-tummy .hc-burp{font:900 44px/1 "Baloo 2",system-ui,sans-serif;fill:#d24a3a;stroke:#fff;stroke-width:2;paint-order:stroke}
.hc-tummy .hc-jugs{transition:opacity .25s}
`;
  const SKIN_DEF = "#c99a74";
  const shade = (hex, k) => {
    const n = parseInt(String(hex).replace("#", ""), 16);
    if (isNaN(n)) return hex;
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
  };
  const BUBBLE_COL = ["#f28ab2", "#f6c945", "#7fd08a", "#79b8f0", "#f5a05a", "#b58ae0"];
  const HOME = [
    [-175, -70],
    [-60, -70],
    [60, -70],
    [175, -70],
    [-115, 20],
    [115, 20],
  ];
  const BR = 38; // a bubble's radius (the hit circle is bigger)
  // the two layouts (viewBox units): wide (landscape) and tall (iPad portrait)
  const LAYOUT = {
    wide: {
      vb: "0 0 1000 540",
      belly: { cx: 330, cy: 355, rx: 265, ry: 170 },
      face: { x: 760, y: 108, r: 80 },
      tube: "M330 232 C330 120 430 60 490 100 S 570 200 640 160 S 720 90 760 146",
      glass: { x: 905, y: 185 },
      jugs: [
        [700, 405],
        [820, 405],
        [940, 405],
      ],
    },
    tall: {
      vb: "0 0 600 1000",
      belly: { cx: 300, cy: 630, rx: 270, ry: 185 },
      face: { x: 300, y: 105, r: 80 },
      tube: "M300 502 C300 400 130 420 140 330 S 300 260 300 142",
      glass: { x: 470, y: 160 },
      jugs: [
        [120, 905],
        [300, 905],
        [480, 905],
      ],
    },
  };
  const itemBase = (id) =>
    String(id || "")
      .replace(/^(care|tool|med)-/, "")
      .replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/, "");
  const USE = { cup: "cup", glass: "cup", paani: "cup", jug: "cup", "hot-water-bottle": "bottle", bottle: "bottle" };

  function mount(stage, ctx) {
    const doc = stage.ownerDocument;
    const W = root;
    const Kit = W.Clinic && W.Clinic.Kit;
    const D = ctx.data;
    const S = (tag, attrs, parent) => {
      const e = doc.createElementNS(NS, tag);
      for (const k in attrs || {}) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    };
    const url = (u) => (Kit ? Kit.url(u) : u);
    const sprite = (id) => {
      if (!Kit || !Kit.sprite) return null;
      const a = Kit.art && Kit.art.alias;
      const s = Kit.sprite(id) || (a && a[id] && Kit.sprite(a[id]));
      return s ? url(s) : null;
    };
    const anim = (el, frames, o) => (el && el.animate ? el.animate(frames, o) : null);
    const fast = !!(Kit && Kit.fast);
    const dur = (ms) => (fast ? Math.min(ms, 280) : ms);
    const level = ctx.level || 1;
    const rng = ctx.rng || Math.random;
    const R = makeRound(D, level, rng);
    const st = newState();
    const kindId = (ctx.patient && ctx.patient.kind) || "ali";
    const KIND = (W.Clinic && W.Clinic.Figure && W.Clinic.Figure.KINDS && W.Clinic.Figure.KINDS[kindId]) || {};
    const SKIN = KIND.skin || SKIN_DEF;
    const SKIN_D = shade(SKIN, 0.8);
    const SHIRT = KIND.clothes || "#e07b39";
    const HAIR = KIND.hairCol || "#2b1d16";
    const DRINK = {};
    D.drinks.forEach((d) => (DRINK[d.id] = d));
    // the tally's picture for "bubbles" (not a pharmacy item)
    if (Kit && Kit.ITEMS && !Kit.ITEMS.bubbles) Kit.ITEMS.bubbles = { english: "bubbles", glyph: "🫧", placeholder: true };

    const css = doc.createElement("style");
    css.textContent = CSS;
    stage.appendChild(css);
    const wrap = doc.createElement("div");
    wrap.className = "hc-tummy";
    stage.appendChild(wrap);
    const figLayer = stage.querySelector(".cl-patient-layer");
    if (figLayer) figLayer.style.visibility = "hidden";
    const box = stage.getBoundingClientRect();
    const tall = box.height > box.width * 1.05;
    const L = tall ? LAYOUT.tall : LAYOUT.wide;
    const B = L.belly;
    const TOP = B.cy - B.ry;
    const SEND_Y = TOP + 20; // drag a bubble above this and it goes up the tube
    const svg = S("svg", { viewBox: L.vb, preserveAspectRatio: "xMidYMid meet" }, wrap);

    let holding = null; // "cup" | "bottle"
    let finished = false;
    let closing = false;
    let dead = false;
    let drag = null;
    let inFlight = 0;
    let burped = 0;
    let ready = false;
    let lastAct = Date.now();
    const ticked = new Set();
    const shown = [];
    const els = { bubble: [], jug: {} };

    const speakers = Kit && Kit.Voice && Kit.Voice.speakers;
    const oldSpeaker = speakers && speakers.patient;
    if (speakers) speakers.patient = () => els.head || wrap;

    const line = (id) => Object.assign({}, (D.lines || {})[id] || { english: id });
    const say = (l) => ctx.say(l, { who: l.who || "doctor" });
    const rowOf = (id) => R.rows.find((r) => r.id === id);
    const cardRow = (r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, audio: r.audio, who: r.who });
    const tick = (id) => {
      if (ticked.has(id) || !rowOf(id)) return;
      ticked.add(id);
      ctx.card.tick(id);
    };
    const reveal = (id, speak = true) => {
      if (shown.includes(id) || !rowOf(id)) return;
      shown.push(id);
      if (!R.list) ctx.card.addRow(cardRow(rowOf(id)));
      ctx.card.now && ctx.card.now(id);
      if (speak) say(rowOf(id));
    };
    const react = (m, ms) => ctx.patient && ctx.patient.react && ctx.patient.react(m, ms);
    const tween = (ms, fn, done) => {
      const t0 = Date.now();
      const raf = W.requestAnimationFrame || ((f) => setTimeout(() => f(Date.now()), 16));
      const step = () => {
        if (dead) return;
        const t = Math.min(1, (Date.now() - t0) / ms);
        fn(t);
        if (t < 1) raf(step);
        else if (done) done();
      };
      raf(step);
    };
    function bubble(text, x, y, cls) {
      const g = S("g", { "pointer-events": "none" }, els.fx);
      const w = Math.max(110, text.length * (cls ? 30 : 17) + 40);
      const h = cls ? 70 : 56;
      S("rect", { x: x - w / 2, y: y - h / 2 - 4, width: w, height: h, rx: h / 2, fill: "#fff", stroke: "#3a2e28", "stroke-width": 3 }, g);
      S("text", { x, y: y + (cls ? 12 : 6), "text-anchor": "middle", class: cls || "hc-bubble" }, g).textContent = text;
      anim(g, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1.08)", offset: 0.15 }, { opacity: 1, transform: "scale(1)", offset: 0.8 }, { opacity: 0, transform: "scale(1)" }], { duration: 1600 });
      g.style.transformBox = "fill-box";
      g.style.transformOrigin = "center";
      setTimeout(() => g.remove(), 1600);
    }
    function toSvg(e) {
      const p = svg.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    }

    /* ---- drawing ---- */
    function drawScene() {
      S("rect", { x: -300, y: -300, width: 1600, height: 1600, fill: "#f3ead9" }, svg);
      // the belly (a tap target: the hot-water bottle lies here)
      const belly = S("g", { "data-heal": "belly", style: "transform-box:fill-box;transform-origin:50% 100%" }, svg);
      els.belly = belly;
      els.bellyHit = S("ellipse", { cx: B.cx, cy: B.cy, rx: B.rx, ry: B.ry, fill: SKIN, stroke: SKIN_D, "stroke-width": 6 }, belly);
      S("path", { d: `M${B.cx - B.rx * 0.8} ${B.cy + B.ry * 0.45} Q${B.cx} ${B.cy + B.ry * 1.02} ${B.cx + B.rx * 0.8} ${B.cy + B.ry * 0.45}`, stroke: SKIN_D, "stroke-width": 5, fill: "none", opacity: 0.45 }, belly);
      S("ellipse", { cx: B.cx - B.rx * 0.45, cy: B.cy - B.ry * 0.05, rx: 30, ry: 18, fill: "#fff", opacity: 0.18 }, belly);
      // the belly button with a face
      const bx = B.cx;
      const by = B.cy + 95;
      const navel = S("g", { style: "transform-box:fill-box;transform-origin:center" }, belly);
      els.navel = navel;
      S("circle", { cx: bx - 16, cy: by - 16, r: 4.5, fill: "#3a2e28" }, navel);
      S("circle", { cx: bx + 16, cy: by - 16, r: 4.5, fill: "#3a2e28" }, navel);
      els.navelMouth = S("ellipse", { cx: bx, cy: by + 2, rx: 9, ry: 6, fill: SKIN_D, stroke: shade(SKIN, 0.6), "stroke-width": 3 }, navel);
      ctx.on(belly, "click", tapBelly);
      // the warm glow and the hot-water bottle (shown when laid on the belly)
      els.warm = S("ellipse", { cx: B.cx + 165, cy: B.cy + 108, rx: 85, ry: 55, fill: "#ffb36b", opacity: 0, "pointer-events": "none" }, svg);
      els.bottle = S("g", { opacity: 0, "pointer-events": "none" }, svg);
      const bsrc = sprite("hot-water-bottle");
      const bp = { x: B.cx + 165, y: B.cy + 110 };
      if (bsrc) S("image", { href: bsrc, x: bp.x - 44, y: bp.y - 54, width: 88, height: 108, transform: `rotate(-20 ${bp.x} ${bp.y})` }, els.bottle);
      else {
        const bg = S("g", { transform: `rotate(-20 ${bp.x} ${bp.y})` }, els.bottle);
        S("rect", { x: bp.x - 45, y: bp.y - 50, width: 90, height: 105, rx: 26, fill: "#d9534f", stroke: "#8a2e2b", "stroke-width": 4 }, bg);
        S("rect", { x: bp.x - 14, y: bp.y - 70, width: 28, height: 24, rx: 6, fill: "#555", stroke: "#333", "stroke-width": 3 }, bg);
      }
      // the bubbles
      els.bubbles = S("g", {}, svg);
      HOME.forEach(([dx, dy], i) => {
        const hx = B.cx + dx;
        const hy = B.cy + dy;
        const g = S("g", { "data-heal": "bubble-" + i, transform: `translate(${hx} ${hy})` }, els.bubbles);
        S("circle", { cx: 0, cy: 0, r: BR + 10, fill: "transparent", class: "hc-hit" }, g);
        const inner = S("g", { style: "transform-box:fill-box;transform-origin:center" }, g);
        S("circle", { cx: 0, cy: 0, r: BR, fill: BUBBLE_COL[i], "fill-opacity": 0.82, stroke: shade(BUBBLE_COL[i], 0.7), "stroke-width": 4 }, inner);
        S("ellipse", { cx: -12, cy: -14, rx: 11, ry: 7, fill: "#fff", opacity: 0.75, transform: "rotate(-30 -12 -14)" }, inner);
        S("circle", { cx: 14, cy: 12, r: 4, fill: "#fff", opacity: 0.6 }, inner);
        const wob = anim(inner, [{ transform: "scale(1, 1) translateY(0)" }, { transform: "scale(1.06, 0.94) translateY(3px)" }, { transform: "scale(0.95, 1.05) translateY(-3px)" }, { transform: "scale(1, 1) translateY(0)" }], { duration: 1300 + i * 170, iterations: Infinity, delay: i * 120 });
        const b = { g, inner, x: hx, y: hy, hx, hy, gone: false, wob };
        els.bubble.push(b);
        ctx.on(g, "pointerdown", (e) => startDrag(e, i));
      });
      // the rolled-up shirt
      const sh = S("g", { "pointer-events": "none" }, svg);
      const x0 = B.cx - B.rx - 30;
      const x1 = B.cx + B.rx + 30;
      const up = TOP - 600;
      S("path", { d: `M${x0} ${TOP + 75} C${x0 + 6} ${TOP - 40} ${x0 + 60} ${TOP - 150} ${x0 + 70} ${up} L${x1 - 70} ${up} C${x1 - 60} ${TOP - 150} ${x1 - 6} ${TOP - 40} ${x1} ${TOP + 75} Q${B.cx} ${TOP - 5} ${x0} ${TOP + 75} Z`, fill: SHIRT, stroke: shade(SHIRT, 0.7), "stroke-width": 5 }, sh);
      [-1, 1].forEach((sd) => S("path", { d: `M${B.cx + sd * (B.rx - 20)} ${TOP + 30} Q${B.cx + sd * (B.rx - 50)} ${TOP - 90} ${B.cx + sd * (B.rx - 60)} ${TOP - 260}`, stroke: shade(SHIRT, 0.86), "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, sh));
      S("path", { d: `M${x0} ${TOP + 75} Q${B.cx} ${TOP - 5} ${x1} ${TOP + 75}`, stroke: shade(SHIRT, 0.82), "stroke-width": 22, fill: "none", "stroke-linecap": "round" }, sh);
      // the see-through tube up to the mouth
      const tb = S("g", { "pointer-events": "none" }, svg);
      S("path", { d: L.tube, stroke: "#7fb3c6", "stroke-width": 62, fill: "none", "stroke-linecap": "round", opacity: 0.9 }, tb);
      S("path", { d: L.tube, stroke: "#eaf7fb", "stroke-width": 50, fill: "none", "stroke-linecap": "round", opacity: 0.92 }, tb);
      S("path", { d: L.tube, stroke: "#fff", "stroke-width": 6, fill: "none", "stroke-linecap": "round", opacity: 0.8, transform: "translate(-12 -6)" }, tb);
      els.tube = S("path", { d: L.tube, fill: "none", stroke: "none" }, tb);
      const start = els.tube.getPointAtLength ? els.tube.getPointAtLength(0) : { x: B.cx, y: TOP + 30 };
      els.tubeIn = S("ellipse", { cx: start.x, cy: start.y - 6, rx: 32, ry: 14, fill: "#cfeaf3", stroke: "#7fb3c6", "stroke-width": 4 }, tb);
      els.travel = S("g", { "pointer-events": "none" }, svg);
      drawFace();
      drawGlassAndJugs();
      els.drag = S("g", {}, svg); // the bubble being dragged, over everything
      els.fx = S("g", { "pointer-events": "none" }, svg);
    }
    function drawFace() {
      const F = L.face;
      const g = S("g", { "pointer-events": "none" }, svg);
      if (KIND.hair === "long") S("path", { d: `M${F.x - F.r * 1.05} ${F.y - 10} Q${F.x - F.r * 1.1} ${F.y + F.r * 1.1} ${F.x} ${F.y + F.r * 1.05} Q${F.x + F.r * 1.1} ${F.y + F.r * 1.1} ${F.x + F.r * 1.05} ${F.y - 10} Z`, fill: HAIR }, g);
      if (KIND.hair === "bunches") [-1, 1].forEach((s) => S("circle", { cx: F.x + s * F.r * 0.95, cy: F.y - F.r * 0.55, r: F.r * 0.32, fill: HAIR }, g));
      if (KIND.hair === "bun") S("circle", { cx: F.x, cy: F.y - F.r * 1.02, r: F.r * 0.3, fill: HAIR }, g);
      els.head = S("circle", { cx: F.x, cy: F.y, r: F.r, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, g);
      if (KIND.hair === "bald") S("path", { d: `M${F.x - F.r * 0.5} ${F.y - F.r * 0.78} Q${F.x} ${F.y - F.r * 0.98} ${F.x + F.r * 0.5} ${F.y - F.r * 0.78}`, stroke: "rgba(255,255,255,.4)", "stroke-width": 8, fill: "none", "stroke-linecap": "round" }, g);
      else if (KIND.hair !== "none") S("path", { d: `M${F.x - F.r * 0.98} ${F.y - 4} Q${F.x - F.r} ${F.y - F.r * 1.12} ${F.x} ${F.y - F.r * 1.02} Q${F.x + F.r} ${F.y - F.r * 1.12} ${F.x + F.r * 0.98} ${F.y - 4} Q${F.x + F.r * 0.7} ${F.y - F.r * 0.62} ${F.x} ${F.y - F.r * 0.6} Q${F.x - F.r * 0.7} ${F.y - F.r * 0.62} ${F.x - F.r * 0.98} ${F.y - 4} Z`, fill: HAIR }, g);
      if (KIND.cap) S("path", { d: `M${F.x - F.r * 0.7} ${F.y - F.r * 0.62} Q${F.x} ${F.y - F.r * 1.25} ${F.x + F.r * 0.7} ${F.y - F.r * 0.62} Z`, fill: "#f4f1ea", stroke: "#cfc8b8", "stroke-width": 3 }, g);
      [-1, 1].forEach((s) => {
        S("circle", { cx: F.x + s * F.r * 0.35, cy: F.y - F.r * 0.12, r: F.r * 0.1, fill: "#2b1d16" }, g);
        S("circle", { cx: F.x + s * F.r * 0.35 + 3, cy: F.y - F.r * 0.16, r: F.r * 0.035, fill: "#fff" }, g);
      });
      els.cheeks = [-1, 1].map((s) => S("circle", { cx: F.x + s * F.r * 0.55, cy: F.y + F.r * 0.25, r: F.r * 0.2, fill: "#e59a8a", opacity: 0.55, style: "transform-box:fill-box;transform-origin:center" }, g));
      if (KIND.moustache) S("path", { d: `M${F.x - F.r * 0.4} ${F.y + F.r * 0.33} Q${F.x} ${F.y + F.r * 0.12} ${F.x + F.r * 0.4} ${F.y + F.r * 0.33} Q${F.x} ${F.y + F.r * 0.24} ${F.x - F.r * 0.4} ${F.y + F.r * 0.33} Z`, fill: HAIR, stroke: HAIR, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      els.mouth = S("path", { d: "", stroke: "#6b2f2a", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, g);
      els.faceG = g;
      mouth("sad");
    }
    function mouth(m) {
      const F = L.face;
      const y = F.y + F.r * 0.48;
      const d = {
        idle: `M${F.x - 20} ${y} Q${F.x} ${y + 10} ${F.x + 20} ${y}`,
        sad: `M${F.x - 20} ${y + 6} Q${F.x} ${y - 6} ${F.x + 20} ${y + 6}`,
        smile: `M${F.x - 26} ${y - 4} Q${F.x} ${y + 24} ${F.x + 26} ${y - 4}`,
        o: `M${F.x - 14} ${y} Q${F.x} ${y - 20} ${F.x + 14} ${y} Q${F.x} ${y + 20} ${F.x - 14} ${y}`,
      }[m];
      els.mouth.setAttribute("d", d || "");
      els.mouth.setAttribute("fill", m === "o" ? "#6b2f2a" : "none");
    }
    function drawGlassAndJugs() {
      const G = L.glass;
      // the glass by the mouth (while the cup dish is up)
      els.glass = S("g", { opacity: 0, "pointer-events": "none" }, svg);
      els.glassBody = S("g", { style: "transform-box:fill-box;transform-origin:center" }, els.glass);
      const shape = `M${G.x - 38} ${G.y - 50} L${G.x + 38} ${G.y - 50} L${G.x + 30} ${G.y + 50} L${G.x - 30} ${G.y + 50} Z`;
      const clipId = `hc-tummy-glass-${Math.floor(Math.random() * 1e9)}`;
      S("path", { d: shape }, S("clipPath", { id: clipId }, els.glassBody));
      S("path", { d: shape, fill: "#cfe2ea", opacity: 0.55 }, els.glassBody);
      els.fill = S("rect", { x: G.x - 40, y: G.y + 50, width: 80, height: 0, fill: "#8fcbee", "clip-path": `url(#${clipId})` }, els.glassBody);
      els.surface = S("line", { x1: G.x - 40, x2: G.x + 40, y1: G.y + 50, y2: G.y + 50, stroke: "#8a9aa3", "stroke-width": 3, opacity: 0, "clip-path": `url(#${clipId})` }, els.glassBody);
      S("path", { d: shape, fill: "none", stroke: "#7a8c96", "stroke-width": 4, "stroke-linejoin": "round" }, els.glassBody);
      S("line", { x1: G.x - 26, y1: G.y - 40, x2: G.x - 22, y2: G.y + 38, stroke: "#fff", "stroke-width": 5, opacity: 0.8 }, els.glassBody);
      els.splash = S("g", { "pointer-events": "none" }, svg);
      // three pitchers, no labels: the picture is the only cue; the slots are shuffled
      els.jugs = S("g", { class: "hc-jugs", opacity: 0, "pointer-events": "none" }, svg);
      const ids = R.drinks.slice();
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      ids.forEach((id, k) => {
        const [x, y] = L.jugs[k];
        const d = DRINK[id];
        const g = S("g", { "data-heal": "jug-" + id }, els.jugs);
        S("rect", { x: x - 58, y: y - 82, width: 116, height: 152, rx: 20, fill: "transparent", class: "hc-hit" }, g);
        const body = S("g", { style: "transform-box:fill-box;transform-origin:50% 90%" }, S("g", { transform: `translate(${x} ${y})` }, g));
        S("ellipse", { cx: 0, cy: 64, rx: 50, ry: 9, fill: "#000", opacity: 0.12 }, body);
        S("path", { d: "M-36 -30 C-72 -30 -72 34 -38 34", stroke: d.stroke, "stroke-width": 9, fill: "none", "stroke-linecap": "round" }, body);
        const jugShape = "M-36 -50 L32 -50 L54 -64 L44 -36 L44 50 Q44 60 34 60 L-34 60 Q-44 60 -44 50 L-40 -50 Z";
        S("path", { d: jugShape, fill: d.jug, stroke: d.stroke, "stroke-width": 4, "stroke-linejoin": "round", opacity: id === "paani" ? 0.75 : 1 }, body);
        S("path", { d: "M-42 -14 L44 -14 L44 50 Q44 58 34 58 L-34 58 Q-42 58 -42 50 Z", fill: d.fill, opacity: id === "paani" ? 0.85 : 1, stroke: id === "dudh" ? "#d9d4c6" : "none", "stroke-width": 2 }, body);
        S("path", { d: "M-42 -14 Q0 -4 44 -14", stroke: id === "dudh" ? "#d9d4c6" : shade(d.fill, 0.85), "stroke-width": 3, fill: "none" }, body);
        S("line", { x1: -30, y1: -40, x2: -30, y2: 44, stroke: "#fff", "stroke-width": 5, opacity: 0.6 }, body);
        if (id === "chai")
          [-18, 4, 24].forEach((dx, j) => {
            const p = S("path", { d: `M${dx} -60 q-10 -12 0 -24 q10 -12 0 -24`, stroke: "#b8aca2", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, body);
            anim(p, [{ transform: "translateY(0)", opacity: 0.9 }, { transform: "translateY(-12px)", opacity: 0.15 }], { duration: 1400, iterations: Infinity, delay: j * 300 });
          });
        els.jug[id] = { g, body, x, y };
        ctx.on(g, "click", (e) => {
          e.stopPropagation();
          pour(id);
        });
      });
    }

    /* ---- the dishes (the host's sidebar tray) ---- */
    const useOf = (i) => {
      const t = ctx.tray[i];
      return t && !t.wrong ? USE[itemBase(t.id)] || USE[t.id] || null : null;
    };
    const dishOf = (use) => ctx.tray.findIndex((t, i) => useOf(i) === use);
    const usedDish = (use) => {
      const di = dishOf(use);
      if (di >= 0 && ctx.trayUI) ctx.trayUI.used(di);
    };
    function closeBubbles() {
      if (st.sent > 0) tick("bubbles");
      if (!R.list) reveal("drink");
    }
    function showCup(on) {
      els.jugs.setAttribute("opacity", on ? 1 : 0);
      els.jugs.setAttribute("pointer-events", on ? "auto" : "none");
      if (on) {
        els.glass.setAttribute("opacity", 1);
        anim(els.glass, [{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
      } else if (!st.pours.length || st.drunk) els.glass.setAttribute("opacity", 0);
    }
    function putDown() {
      if (!holding) return;
      const use = holding;
      holding = null;
      ctx.trayUI && ctx.trayUI.select(-1);
      if (use === "cup") {
        showCup(false);
        if (st.pours.length && !st.drunk) {
          tick("drink");
          usedDish("cup");
          drink();
        }
      }
      if (use === "bottle" && st.bottle) {
        tick("bottle");
        usedDish("bottle");
      }
    }
    function onDish(i) {
      if (finished || closing) return;
      lastAct = Date.now();
      stopHints();
      ctx.sfx("tap");
      const use = useOf(i);
      if (!use) {
        ctx.log({ type: "extra", detail: `tapped ${ctx.tray[i] && ctx.tray[i].id}` });
        return;
      }
      if (holding === use) return;
      closeBubbles();
      putDown();
      if ((use === "cup" && st.drunk) || (use === "bottle" && st.bottle)) {
        // that step is done: the dish is a tick now
        ctx.log({ type: "extra", rowId: use === "cup" ? "drink" : "bottle", detail: "the dish again" });
        return;
      }
      holding = use;
      ctx.trayUI && ctx.trayUI.select(i);
      ctx.signal && ctx.signal("heal-tummy-lift");
      if (use === "cup") showCup(true);
    }

    /* ---- the bubbles: drag one up into the tube ---- */
    const setPos = (b, x, y) => {
      b.x = x;
      b.y = y;
      b.g.setAttribute("transform", `translate(${x} ${y})`);
    };
    function startDrag(e, i) {
      if (finished || closing || drag) return;
      const b = els.bubble[i];
      if (b.gone) return;
      e.preventDefault();
      e.stopPropagation();
      lastAct = Date.now();
      stopHints();
      const p = toSvg(e);
      drag = { i, ox: b.x - p.x, oy: b.y - p.y, moved: 0, x0: p.x, y0: p.y };
      try {
        svg.setPointerCapture(e.pointerId);
      } catch (_) {
        /* synthetic pointers */
      }
      els.drag.appendChild(b.g);
    }
    function moveDrag(e) {
      if (!drag) return;
      const p = toSvg(e);
      const b = els.bubble[drag.i];
      drag.moved = Math.max(drag.moved, Math.hypot(p.x - drag.x0, p.y - drag.y0));
      const x = Math.max(B.cx - B.rx + BR, Math.min(B.cx + B.rx - BR, p.x + drag.ox));
      const y = Math.min(B.cy + B.ry - BR, p.y + drag.oy);
      setPos(b, x, y);
      if (y < SEND_Y) {
        const i = drag.i;
        drag = null;
        send(i);
      }
    }
    function endDrag() {
      if (!drag) return;
      const d = drag;
      drag = null;
      const b = els.bubble[d.i];
      if (d.moved < 6) {
        // a tap on a bubble: it wobbles and the patient giggles (every touch answers)
        anim(b.inner, [{ transform: "scale(1)" }, { transform: "scale(1.2, 0.85)" }, { transform: "scale(0.9, 1.1)" }, { transform: "scale(1)" }], { duration: 380 });
        react("giggle", 600);
      }
      // it drifts back home
      const x0 = b.x;
      const y0 = b.y;
      tween(dur(320), (t) => setPos(b, x0 + (b.hx - x0) * t, y0 + (b.hy - y0) * t), () => els.bubbles.appendChild(b.g));
    }
    function send(i) {
      const b = els.bubble[i];
      b.gone = true;
      st.sent++;
      inFlight++;
      ctx.signal && ctx.signal("heal-tummy-drag");
      ctx.sfx("whoosh");
      els.travel.appendChild(b.g);
      b.g.removeAttribute("data-heal");
      if (b.inner.getAnimations) b.inner.getAnimations().forEach((a) => a.cancel());
      else if (b.wob) b.wob.cancel();
      const len = els.tube.getTotalLength ? els.tube.getTotalLength() : 0;
      const x0 = b.x;
      const y0 = b.y;
      anim(els.navel, [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 300 });
      tween(
        dur(1300),
        (t) => {
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const p = len ? els.tube.getPointAtLength(e * len) : { x: L.face.x, y: L.face.y };
          const k = Math.min(1, t * 6); // glide from the finger into the tube
          setPos(b, x0 + (p.x - x0) * k, y0 + (p.y - y0) * k);
          b.inner.setAttribute("transform", `scale(${1 - 0.45 * k + 0.05 * Math.sin(t * 30)})`);
        },
        () => {
          b.g.remove();
          inFlight--;
          burp();
        }
      );
    }
    function burp() {
      burped++;
      ctx.tally("bubbles", burped);
      ctx.sfx("pop");
      const F = L.face;
      bubble("BURP!", tall ? F.x - 150 : F.x - 10, tall ? F.y + 20 : F.y + F.r + 60, "hc-burp");
      mouth("o");
      els.cheeks.forEach((c) => anim(c, [{ transform: "scale(1)" }, { transform: "scale(1.7)" }, { transform: "scale(1)" }], { duration: 500 }));
      anim(els.faceG, [{ transform: "translateY(0)" }, { transform: "translateY(-8px)" }, { transform: "translateY(0)" }], { duration: 360 });
      if (burped === 1) say(line("burp"));
      else if (burped === 2) say(line("giggle"));
      react("giggle", 800);
      setTimeout(() => !dead && mouth(st.drunk ? "smile" : "idle"), fast ? 200 : 700);
    }

    /* ---- the drink ---- */
    function glassColour() {
      const kinds = [...new Set(st.pours)];
      if (!kinds.length) return "#8fcbee";
      if (kinds.length > 1) return "#a8906c"; // mixed: a muddy mess (comic)
      return DRINK[kinds[0]].fill;
    }
    function drawFill() {
      const G = L.glass;
      const h = Math.min(st.pours.length, FULL) * 45;
      els.fill.setAttribute("y", G.y + 50 - h);
      els.fill.setAttribute("height", h);
      els.fill.setAttribute("fill", glassColour());
      els.surface.setAttribute("y1", G.y + 50 - h);
      els.surface.setAttribute("y2", G.y + 50 - h);
      els.surface.setAttribute("opacity", h ? 0.8 : 0);
    }
    function pour(id) {
      if (finished || closing || holding !== "cup") return;
      lastAct = Date.now();
      stopHints();
      if (!st.order.includes("drink")) st.order.push("drink");
      st.pours.push(id);
      ctx.signal && ctx.signal("heal-tummy-pour");
      ctx.sfx("whoosh");
      const j = els.jug[id];
      anim(j.body, [{ transform: "rotate(0)" }, { transform: "rotate(-28deg)" }, { transform: "rotate(0)" }], { duration: 600 });
      const G = L.glass;
      const stream = S("path", { d: `M${G.x + 6} ${G.y - 130} Q${G.x + 2} ${G.y - 80} ${G.x} ${G.y - 20}`, stroke: DRINK[id].fill, "stroke-width": 12, fill: "none", "stroke-linecap": "round", opacity: 0.9, "pointer-events": "none" }, els.splash);
      if (id === "dudh") stream.setAttribute("stroke", "#fffdf8");
      anim(stream, [{ opacity: 0 }, { opacity: 0.95, offset: 0.2 }, { opacity: 0.95, offset: 0.7 }, { opacity: 0 }], { duration: 600 });
      setTimeout(() => stream.remove(), 600);
      drawFill();
      if (st.pours.length > FULL) {
        // it overflows: a comic splash (counted as extra in the review)
        say(line("splash"));
        for (let k = 0; k < 7; k++) {
          const dx = (k - 3) * 16;
          const drop = S("circle", { cx: G.x + dx * 0.4, cy: G.y - 50, r: 7, fill: glassColour(), stroke: "#7a8c96", "stroke-width": 1 }, els.splash);
          anim(drop, [{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${dx * 2}px, ${-30 - Math.abs(dx)}px)`, opacity: 1, offset: 0.4 }, { transform: `translate(${dx * 3}px, 120px)`, opacity: 0 }], { duration: 800 });
          setTimeout(() => drop.remove(), 800);
        }
        S("ellipse", { cx: G.x, cy: G.y + 58, rx: 30 + 8 * (st.pours.length - FULL), ry: 8, fill: glassColour(), opacity: 0.6 }, els.splash);
        react("giggle", 800);
      }
    }
    function drink() {
      st.drunk = true;
      const G = L.glass;
      const F = L.face;
      els.glass.setAttribute("opacity", 1);
      const dx = F.x + F.r * 0.9 - G.x;
      const dy = F.y + F.r * 0.5 - G.y;
      anim(els.glassBody, [{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${dx}px, ${dy}px) rotate(-40deg)`, offset: 0.3 }, { transform: `translate(${dx}px, ${dy}px) rotate(-60deg)`, offset: 0.8 }, { transform: "translate(0,0) rotate(0)" }], { duration: dur(1500) });
      mouth("o");
      say(line("glug"));
      setTimeout(() => {
        if (dead) return;
        els.fill.setAttribute("height", 0);
        els.surface.setAttribute("opacity", 0);
        mouth("smile");
        react("relief", 1200);
        bubble("Ahhh!", tall ? F.x - 150 : F.x - 10, tall ? F.y + 20 : F.y + F.r + 60);
      }, dur(1100));
      setTimeout(() => !dead && els.glass.setAttribute("opacity", 0), dur(1500));
    }

    /* ---- the belly (the hot-water bottle) ---- */
    function tapBelly() {
      if (finished || closing) return;
      lastAct = Date.now();
      stopHints();
      if (holding === "bottle" && !st.bottle) {
        st.bottle = true;
        if (!st.order.includes("bottle")) st.order.push("bottle");
        ctx.signal && ctx.signal("heal-tummy-bottle");
        ctx.sfx("pop");
        els.bottle.setAttribute("opacity", 1);
        anim(els.bottle, [{ transform: "translateY(-60px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: 350 });
        els.warm.setAttribute("opacity", 0.35);
        anim(els.warm, [{ opacity: 0.15 }, { opacity: 0.45 }, { opacity: 0.15 }], { duration: 1800, iterations: Infinity });
        say(line("ahh"));
        mouth("smile");
        react("relief", 1400);
        return;
      }
      // a bare tap: the belly jiggles and the patient giggles
      anim(els.belly, [{ transform: "scale(1)" }, { transform: "scale(1.03, 0.97)" }, { transform: "scale(0.98, 1.02)" }, { transform: "scale(1)" }], { duration: 400 });
      react("giggle", 600);
    }

    /* ---- closing ---- */
    function needs() {
      const out = [];
      if (!st.sent) out.push("bubbles");
      if (!st.drunk && !(holding === "cup" && st.pours.length)) out.push("cup");
      if (R.bottle && !st.bottle) out.push("bottle");
      return out;
    }
    function pulseNeeds(list) {
      list.forEach((n) => {
        if (n === "bubbles") els.bubbles.classList.add("hc-pulse");
        else if (holding !== n) {
          const di = dishOf(n);
          if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
        }
      });
    }
    function onDone() {
      if (finished || closing) return;
      lastAct = Date.now();
      stopHints();
      const drinking = holding === "cup" && st.pours.length > 0 && !st.drunk;
      if (st.sent > 0) closeBubbles(); // Done closes the bubbles step (and, at level 1, brings the next line)
      const left = needs();
      if (left.length) {
        // not finished yet: the free throb shows what's left (never a count, never which drink;
        // at level 3 both remaining dishes, so it never gives the order away)
        pulseNeeds(left.includes("bubbles") ? ["bubbles"] : left);
        return;
      }
      putDown();
      if (drinking || inFlight) {
        closing = true;
        setTimeout(() => !dead && finish(), dur(1500));
      } else finish();
    }
    function finish() {
      if (finished) return;
      finished = true;
      const g = grade(R, st);
      g.forEach((r) => ctx.log({ type: r.right ? "right" : "wrong", rowId: r.id }));
      if (st.pours.length > FULL) ctx.log({ type: "extra", rowId: "drink", detail: `overflowed (${st.pours.length} pours)` });
      const right = g.filter((r) => r.right).length;
      mouth("smile");
      react("happy", 0);
      say(line("better"));
      ctx.done({ right, total: g.length, hints: 0, words: R.words.map((w) => ({ kutchi: w.kutchi, english: w.english, audio: w.audio })) });
    }

    // the throbbing hint after 8 s of nothing: the row and the dish (never a count or a drink; at level 3 both
    // remaining dishes, so the hint never gives the order away)
    function stopHints() {
      ctx.card.pulse(null, false);
      ctx.trayUI && ctx.trayUI.pulse(-1, false);
      svg.querySelectorAll(".hc-pulse").forEach((e) => e.classList.remove("hc-pulse"));
      doneBtn && doneBtn.classList.remove("throb");
    }
    function throb() {
      if (finished) return;
      if (Date.now() - lastAct > 8000 && !drag) {
        const r = R.rows.find((x) => !ticked.has(x.id) && (R.list || shown.includes(x.id)));
        if (r) ctx.card.pulse(r.id, true);
        const left = needs();
        if (left.length) pulseNeeds(left.includes("bubbles") ? ["bubbles"] : left);
        else doneBtn.classList.add("throb");
      }
      ctx.after(1000, throb);
    }

    const doneBtn = ctx.button("✓", onDone, "done");
    doneBtn.setAttribute("aria-label", "Done");
    ctx.trayUI && ctx.trayUI.onTap((i) => onDish(i));
    drawScene();
    ctx.on(svg, "pointermove", moveDrag);
    ctx.on(svg, "pointerup", endDrag);
    ctx.on(svg, "pointercancel", endDrag);

    const rect = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, h: b.height };
    };
    const where = (key) => {
      const g = svg.querySelector(`[data-heal="${key}"]`);
      if (!g) return null;
      if (key === "belly") return rect(els.bellyHit);
      return rect(g.querySelector(".hc-hit") || g);
    };
    /** The test player's steps (docs: build/test_clinic_heal_c.py play_generic). */
    function script(slip) {
      const ctm = svg.getScreenCTM();
      const k = ctm ? ctm.d : 1;
      const out = [];
      const n = R.count + (slip ? 1 : 0); // the slip: one bubble too many
      const P = "__heal.run.controller.peek()";
      for (let i = 0; i < n; i++) {
        const b = els.bubble[i];
        out.push({ drag: "bubble-" + i, dx: 0, dy: -Math.round((b.hy - SEND_Y + 45) * k) });
        if (i === 0) out.push({ wait: `${P}.sent >= 1`, pause: 0.7 }); // the level-1 onboarding breathes for 450 ms after the first drag
      }
      out.push({ wait: `${P}.burped >= ${n}`, pause: 0.3 }, { shot: "burps" });
      R.order.forEach((step) => {
        if (step === "drink") {
          out.push({ dish: "cup" }, { wait: `${P}.holding === "cup"`, pause: 0.4 });
          const taps = R.amount === HALF ? HALF : FULL;
          for (let t = 0; t < taps; t++) out.push({ tap: "jug-" + R.drink }, { wait: `${P}.pours >= ${t + 1}`, pause: 0.15 });
          out.push({ shot: "pour" });
        } else {
          out.push({ dish: "bottle" }, { wait: `${P}.holding === "bottle"`, pause: 0.2 }, { tap: "belly" }, { wait: `${P}.bottle`, pause: 0.3 }, { shot: "bottle" });
        }
      });
      out.push({ done: true });
      return out;
    }

    return {
      async start() {
        if (R.list) ctx.card.setRows(R.rows.map(cardRow));
        else {
          ctx.card.setRows([]);
          reveal("bubbles", false);
        }
        lastAct = Date.now();
        throb();
        anim(els.belly, [{ transform: "scale(1)" }, { transform: "scale(1.03, 0.97)" }, { transform: "scale(1)" }], { duration: 500, iterations: 2 });
        if (level === 1) {
          ctx.onboard([
            {
              spotlight: [() => els.bubble[0].g, () => els.tubeIn],
              ghost: { gesture: "drag", from: () => els.bubble[0].g, to: () => els.tubeIn },
              wait: "heal-tummy-drag",
            },
          ]);
        }
        await say(line("gurgle"));
        if (R.list) await ctx.card.speak();
        else await say(rowOf("bubbles"));
        ready = true;
        lastAct = Date.now();
      },
      destroy() {
        finished = true;
        dead = true;
        if (speakers) speakers.patient = oldSpeaker;
        if (figLayer) figLayer.style.visibility = "";
        wrap.remove();
        css.remove();
      },
      where,
      /** A small live state for the test's waits. */
      peek() {
        return { ready, sent: st.sent, burped, inFlight, holding, pours: st.pours.length, drunk: st.drunk, bottle: st.bottle, finished, ticked: [...ticked] };
      },
      /** For the browser test: what the game wants next, in client px. */
      expect() {
        const bubbles = {};
        els.bubble.forEach((b, i) => (bubbles[i] = b.gone ? null : rect(b.g.querySelector(".hc-hit"))));
        const jugs = {};
        Object.keys(els.jug).forEach((id) => (jugs[id] = rect(els.jug[id].g.querySelector(".hc-hit"))));
        return {
          round: { count: R.count, drink: R.drink, amount: R.amount, order: R.order, rows: R.rows.map((r) => r.id) },
          state: JSON.parse(JSON.stringify(st)),
          holding,
          burped,
          inFlight,
          ticked: [...ticked],
          finished,
          needs: needs(),
          dish: { cup: dishOf("cup"), bottle: dishOf("bottle") },
          bubbles,
          jugs,
          belly: rect(els.bellyHit),
          tube: rect(els.tubeIn),
          sendY: (() => {
            const ctm = svg.getScreenCTM();
            return ctm ? ctm.f + ctm.d * SEND_Y : null;
          })(),
          done: rect(doneBtn),
          script: script(false),
          slipScript: script(true),
        };
      },
    };
  }

  const def = {
    id: ID,
    part: "tummy",
    ailments: ["too-many-sweets"],
    items: ["cup", "hot-water-bottle"],
    itemsFor: { "too-many-sweets": ["cup", "hot-water-bottle"] },
    gestures: ["tap", "drag"],
    levels: [1, 2, 3],
    mount,
    bot,
    strategies: STRATEGIES,
    makeRound,
    grade,
    newState,
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
