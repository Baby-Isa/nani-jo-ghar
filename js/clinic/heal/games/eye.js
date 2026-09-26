/*
 * Clinic heal game `eye`: H12 Drops and the chart (docs/modes/clinic-design.md,
 * the quality pass Q4; contract docs/clinic-heal-api.md).
 *
 * The patient: *[EN: My left eye]*; the doctor: *Ba [EN: drops]*: tap the
 * drops, tap that eye twice. Level 3: *[EN: Cover the other eye]*: the patch
 * goes on THE OTHER eye (the only reversed side in any mode). Then the
 * pointer and the picture chart: the doctor names a noun the child already
 * knows (the fruit and veg words), one call per row, the rows shrinking;
 * level 3 adds *wadho/nindho* and a *nar* row. The smallest row is a tiny
 * Kasuku who squawks when tapped (ungraded).
 *
 * Gestures: tap only (tap the dish, tap the spot). A row ticks when its step
 * closes (the next dish, or Done; a chart call closes on the pick), never
 * on a count. Wrong things just happen; they are counted in the review.
 *
 * Levels are data: data/clinic/heal/eye.json. Runs in Node for the bot.
 */
(function (root, factory) {
  const G = factory(root);
  if (typeof module === "object" && module.exports) module.exports = G;
  const reg = root && root.Clinic && root.Clinic.Heal;
  if (reg && reg.register) reg.register(G);
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const ID = "eye";
  const DATA_PATH = "data/clinic/heal/eye.json";

  /* ---------------- data (fetch in the browser, fs in Node) ---------------- */
  let DATA = null;
  let dataP = null;
  const doc = root && root.document;
  const SRC = doc && doc.currentScript ? doc.currentScript.src : null;
  const BASE = SRC ? new URL("../../../../", SRC).href : root && root.location ? new URL("/", root.location.href).href : "";
  function nodeData() {
    const fs = require("fs");
    const path = require("path");
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", DATA_PATH), "utf8"));
  }
  function load() {
    if (DATA) return Promise.resolve(DATA);
    if (!dataP) dataP = fetch(BASE + DATA_PATH).then((r) => r.json()).then((d) => (DATA = d));
    return dataP;
  }
  if (!doc && typeof require === "function") DATA = nodeData();

  /* ---------------- pure helpers ---------------- */
  const pick = (rng, a) => a[Math.floor(rng() * a.length) % a.length];
  const shuffle = (rng, a) => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  const other = (s) => (s === "left" ? "right" : "left");
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /** One round: the rows (the card) and the answers, from the level's data. */
  function makeRound(D, level, rng, side) {
    const lv = D.levels[String(level)] || D.levels["1"];
    side = side === "left" || side === "right" ? side : pick(rng, ["left", "right"]);
    const count = pick(rng, lv.drops);
    const num = D.numbers.find((n) => n.n === count);
    const rows = [];
    const words = [];
    if (lv.side) {
      const l = D.lines["side-" + side];
      rows.push({ id: "side", kutchi: l.kutchi, english: l.english, placeholder: true, who: "patient", line: "side-" + side });
    }
    const dropWord = count === 1 ? D.words.drop.english : D.words.drops.english;
    rows.push({ id: "drops", kutchi: `${num.kutchi} [EN: ${dropWord}]`, english: `${cap(num.english)} ${dropWord}`, who: "doctor" });
    words.push({ kutchi: num.kutchi.toLowerCase(), english: num.english });
    if (lv.patch) {
      const l = D.lines.patch;
      rows.push({ id: "patch", kutchi: l.kutchi, english: l.english, placeholder: true, who: "doctor", line: "patch" });
    }
    // the chart: one call per row, top (biggest) to bottom
    const he = D.chart_nouns.filter((n) => n.he);
    const usedT = new Set(); // no noun is called twice in a round
    const chart = lv.chart.map((spec, i) => {
      let cells;
      let target;
      let call;
      if (spec.kind === "noun") {
        const nouns = shuffle(rng, D.chart_nouns).slice(0, spec.n);
        cells = nouns.map((n) => ({ noun: n, big: true }));
        const fresh = cells.map((c, k) => k).filter((k) => !usedT.has(cells[k].noun.id));
        target = fresh.length ? pick(rng, fresh) : Math.floor(rng() * cells.length);
        usedT.add(cells[target].noun.id);
        const t = cells[target].noun;
        call = { kutchi: cap(t.kutchi) + "!", english: cap(t.english) + "!" };
        words.push({ kutchi: t.kutchi, english: t.english, audio: t.audio });
      } else {
        const heFresh = shuffle(rng, he.filter((n) => !usedT.has(n.id)));
        const [a, b] = heFresh.length >= 2 ? heFresh : shuffle(rng, he);
        usedT.add(a.id);
        cells = shuffle(rng, [
          { noun: a, big: true },
          { noun: a, big: false },
          { noun: b, big: true },
          { noun: b, big: false },
        ]);
        const wantBig = rng() < 0.5;
        target = cells.findIndex((c) => c.noun === a && c.big === wantBig);
        const bw = D.words.big;
        const sw = D.words.small;
        if (spec.kind === "size") {
          const w = wantBig ? bw : sw;
          call = { kutchi: `${cap(w.kutchi)} ${a.kutchi}`, english: `The ${w.english} ${a.english}` };
          words.push({ kutchi: w.kutchi, english: w.english });
        } else {
          // nar: "kelo, nar wadho" = the banana, not the big one
          const notW = wantBig ? sw : bw;
          call = { kutchi: `${cap(a.kutchi)}, ${D.words.no.kutchi} ${notW.kutchi}`, english: `The ${a.english}, not the ${notW.english} one` };
          words.push({ kutchi: D.words.no.kutchi, english: D.words.no.english });
        }
        words.push({ kutchi: a.kutchi, english: a.english, audio: a.audio });
      }
      rows.push({ id: "call" + i, kutchi: call.kutchi, english: call.english, who: "doctor" });
      return { kind: spec.kind, cells, target };
    });
    // the review's words: each once
    const seen = new Set();
    const uniq = words.filter((w) => (seen.has(w.kutchi) ? false : seen.add(w.kutchi)));
    return { level: Number(level), side, count, sore: !!lv.sore_visible, patch: lv.patch ? other(side) : null, list: !!lv.list, rows, chart, words: uniq };
  }

  /** A fresh play state. */
  const newState = (R) => ({ drops: { left: 0, right: 0 }, patch: null, picks: R.chart.map(() => null) });

  /** Grade every row from what was done (pure). */
  function grade(R, st) {
    const out = [];
    const o = other(R.side);
    const total = st.drops.left + st.drops.right;
    R.rows.forEach((row) => {
      let right = false;
      if (row.id === "side") right = st.drops[R.side] > 0 && st.drops[o] === 0;
      else if (row.id === "drops") right = R.rows.some((r) => r.id === "side") ? total === R.count : st.drops[R.side] === R.count && st.drops[o] === 0;
      else if (row.id === "patch") right = st.patch === R.patch;
      else if (row.id.startsWith("call")) {
        const i = Number(row.id.slice(4));
        right = st.picks[i] === R.chart[i].target;
      }
      out.push({ id: row.id, right });
    });
    return out;
  }

  /** The blind bot (pure): plays a round without the words. */
  function bot(level, rng) {
    const D = DATA || nodeData();
    const R = makeRound(D, level, rng, null);
    const lv = D.levels[String(level)];
    return {
      rows: R.rows,
      round: R,
      /** strategy: "random" (any count 1-5, any eye, any picture), "best" (the likeliest guess the screen allows). */
      solve(strategy = "best") {
        const st = newState(R);
        let eye;
        if (R.sore) eye = R.side; // the sore eye shows at level 1
        else eye = rng() < 0.5 ? "left" : "right";
        const n = strategy === "random" ? 1 + Math.floor(rng() * 5) : Math.min(...lv.drops); // no count is likelier than another
        st.drops[eye] = n;
        if (R.patch) st.patch = strategy === "random" ? (rng() < 0.5 ? "left" : "right") : other(eye); // "the other one" of its own guess
        R.chart.forEach((c, i) => (st.picks[i] = Math.floor(rng() * c.cells.length)));
        const g = grade(R, st);
        const right = g.filter((r) => r.right).length;
        return { right, total: g.length, win: right === g.length, rows: g };
      },
      /** A player who understands every word (the fair check). */
      fair() {
        const st = newState(R);
        st.drops[R.side] = R.count;
        if (R.patch) st.patch = R.patch;
        R.chart.forEach((c, i) => (st.picks[i] = c.target));
        const g = grade(R, st);
        const right = g.filter((r) => r.right).length;
        return { right, total: g.length, win: right === g.length };
      },
    };
  }

  /* ---------------- the browser game ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  function S(tag, attrs, parent) {
    const e = doc.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const CSS = `
.heal-c{position:absolute;inset:0;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.heal-c svg{width:100%;height:100%;display:block}
.heal-c [data-heal]{cursor:pointer}
.heal-c .hc-dish.hc-up{transform:translateY(-12px)}
.heal-c .hc-dish{transition:transform .18s ease}
.heal-c .hc-off{opacity:.35;cursor:default}
.heal-c .hc-pulse{animation:hcPulse 1s ease-in-out infinite}
.heal-c .hc-spin{animation:hcSpin .5s linear 2}
@keyframes hcPulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes hcSpin{to{transform:rotate(360deg)}}
.heal-c .hc-bubble{font:700 26px/1 system-ui,sans-serif;fill:#3a2e28}
`;
  function injectCss() {
    if (doc.getElementById("heal-c-css")) return;
    const s = doc.createElement("style");
    s.id = "heal-c-css";
    s.textContent = CSS;
    doc.head.appendChild(s);
  }
  const noop = () => {};
  const sfx = (n) => root.Sfx && root.Sfx.play && root.Sfx.play(n);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const anim = (el, frames, o) => (el && el.animate ? el.animate(frames, o) : null);
  let ART = null;
  function loadArt() {
    if (ART) return Promise.resolve(ART);
    return fetch(BASE + "data/clinic/rough-art.json")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((j) => (ART = j || {}));
  }
  function artSrc(id) {
    const a = ART && (ART.sprites || ART.items || ART);
    const v = a && a[id];
    const src = typeof v === "string" ? v : v && (v.src || v.file || v.path);
    return src ? BASE + src.replace(/^\//, "") : null;
  }

  const VB = { w: 1000, h: 560 };
  const EYE = { y: 205, x: { right: 205, left: 375 }, rx: 58, ry: 44 }; // the patient faces you: their left is on your right
  const SKIN = "#c89a7a";
  const SKIN_D = "#a97c5e";

  function mount(stage, ctx) {
    injectCss();
    ctx = ctx || {};
    const card = ctx.card || { setRows: noop, tick: noop, pulse: noop };
    const patient = ctx.patient || { react: noop };
    const say = (id, line) => (ctx.say ? ctx.say(id, line) : null);
    const log = ctx.log || noop;
    const rng = ctx.rng || Math.random;
    const level = ctx.level || 1;
    let R = null;
    let st = null;
    let holding = null;
    let dead = false;
    let finished = false;
    let corrected = false; // level 1's one gentle correction
    let callIdx = 0;
    let called = -1;
    let revealed = [];
    const ticked = new Set();
    const used = new Set();
    const timers = [];
    let idleT = null;
    const els = {};
    const wrap = doc.createElement("div");
    wrap.className = "heal-c heal-c-eye";
    stage.appendChild(wrap);
    const svg = S("svg", { viewBox: `0 0 ${VB.w} ${VB.h}`, preserveAspectRatio: "xMidYMid meet" }, wrap);

    const later = (fn, ms) => timers.push(setTimeout(() => !dead && fn(), ms));
    const lineOf = (id) => Object.assign({ id: "heal-eye-" + id }, (DATA.lines || {})[id] || {});
    const sayRow = (row) => say("heal-eye-" + row.id, { who: row.who, kutchi: row.kutchi, english: row.english, audio: row.audio });

    function setRows() {
      card.setRows(R.rows.filter((r) => !R.list ? revealed.includes(r.id) : true).map((r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, audio: r.audio, placeholder: !!r.placeholder })));
      ticked.forEach((id) => card.tick(id));
    }
    function reveal(id) {
      if (revealed.includes(id)) return;
      revealed.push(id);
      if (!R.list) setRows();
    }
    function tick(id) {
      if (ticked.has(id)) return;
      ticked.add(id);
      card.tick(id);
    }

    /* ---- drawing ---- */
    function bubble(text, x, y) {
      const g = S("g", { "pointer-events": "none" }, svg);
      const w = Math.max(120, text.length * 15 + 30);
      S("rect", { x: x - w / 2, y: y - 30, width: w, height: 52, rx: 24, fill: "#fff", stroke: "#3a2e28", "stroke-width": 3 }, g);
      const t = S("text", { x, y: y + 5, "text-anchor": "middle", class: "hc-bubble" }, g);
      t.textContent = text;
      anim(g, [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 1800 });
      later(() => g.remove(), 1800);
    }
    function drawFace() {
      const f = S("g", {}, svg);
      els.face = f;
      S("rect", { x: 0, y: 0, width: VB.w, height: VB.h, fill: "#f6efe4" }, f);
      // ears, head, hair
      S("ellipse", { cx: 88, cy: 250, rx: 34, ry: 52, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      S("ellipse", { cx: 492, cy: 250, rx: 34, ry: 52, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      S("ellipse", { cx: 290, cy: 245, rx: 205, ry: 215, fill: SKIN, stroke: SKIN_D, "stroke-width": 5 }, f);
      S("path", { d: "M95 200 Q110 25 290 28 Q470 25 485 200 Q440 95 290 92 Q140 95 95 200 Z", fill: "#3b2a22" }, f);
      // eyes
      els.eye = {};
      ["right", "left"].forEach((side) => {
        const x = EYE.x[side];
        const g = S("g", { "data-heal": "eye-" + side }, f);
        const clipId = "hc-eye-clip-" + side + "-" + Math.floor(Math.random() * 1e6);
        const cp = S("clipPath", { id: clipId }, g);
        S("ellipse", { cx: x, cy: EYE.y, rx: EYE.rx, ry: EYE.ry }, cp);
        S("ellipse", { cx: x, cy: EYE.y, rx: EYE.rx + 34, ry: EYE.ry + 40, fill: "transparent" }, g); // the generous hit area
        const sore = R.sore && side === R.side;
        S("ellipse", { cx: x, cy: EYE.y, rx: EYE.rx, ry: EYE.ry, fill: sore ? "#fbe3e6" : "#fff", stroke: sore ? "#e46d8f" : "#6d4c3d", "stroke-width": sore ? 9 : 4 }, g);
        const inner = S("g", { "clip-path": `url(#${clipId})` }, g);
        if (sore) {
          [[-40, -8, -18, -2], [30, 14, 12, 4], [-34, 18, -16, 8]].forEach(([a, b, c, d]) => S("path", { d: `M${x + a} ${EYE.y + b} Q${x + (a + c) / 2} ${EYE.y + b - 6} ${x + c} ${EYE.y + d}`, stroke: "#e07b8a", "stroke-width": 3, fill: "none" }, inner));
        }
        const iris = S("g", {}, inner);
        S("circle", { cx: x, cy: EYE.y, r: 25, fill: "#6b4a2b" }, iris);
        S("circle", { cx: x, cy: EYE.y, r: 12, fill: "#1c1410" }, iris);
        S("circle", { cx: x + 8, cy: EYE.y - 9, r: 5, fill: "#fff" }, iris);
        const lid = S("rect", { x: x - EYE.rx - 2, y: EYE.y - EYE.ry - 2, width: EYE.rx * 2 + 4, height: EYE.ry * 2 + 4, fill: SKIN, style: "transform-box:fill-box;transform-origin:50% 0%;transform:scaleY(0)" }, inner);
        S("path", { d: `M${x - 62} ${EYE.y - 72} Q${x} ${EYE.y - 100} ${x + 62} ${EYE.y - 72}`, stroke: "#3b2a22", "stroke-width": 11, fill: "none", "stroke-linecap": "round" }, g);
        if (sore) {
          // three itchy squiggles
          [[-70, -60], [74, -48], [80, 30]].forEach(([dx, dy]) => S("path", { d: `M${x + dx - 10} ${EYE.y + dy} l6 -8 l6 8 l6 -8`, stroke: "#e46d8f", "stroke-width": 3, fill: "none", "pointer-events": "none" }, g));
        }
        els.eye[side] = { g, iris, lid, x };
        g.addEventListener("click", () => tapEye(side));
      });
      // nose, mouth, cheeks
      S("path", { d: "M290 250 Q272 312 282 318 Q296 324 306 316", stroke: SKIN_D, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, f);
      S("circle", { cx: 170, cy: 305, r: 26, fill: "#e59a8a", opacity: 0.45 }, f);
      S("circle", { cx: 410, cy: 305, r: 26, fill: "#e59a8a", opacity: 0.45 }, f);
      els.mouth = S("path", { d: "", stroke: "#6b2f2a", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, f);
      els.patch = S("g", { "pointer-events": "none", opacity: 0 }, f);
      mouth("idle");
    }
    function mouth(m) {
      const d = {
        idle: "M240 372 Q290 384 340 372",
        smile: "M232 360 Q290 420 348 360",
        ooh: "M275 372 Q290 350 305 372 Q290 394 275 372",
        squint: "M250 378 Q270 368 290 378 Q310 388 330 376",
      }[m];
      els.mouth.setAttribute("d", d || "");
      els.mouth.setAttribute("fill", m === "ooh" ? "#6b2f2a" : "none");
    }
    function lids(v, side) {
      (side ? [side] : ["left", "right"]).forEach((s) => (els.eye[s].lid.style.transform = `scaleY(${v})`));
    }
    function blink(side, times = 1) {
      (side ? [side] : ["left", "right"]).forEach((s) => anim(els.eye[s].lid, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: 220, iterations: times }));
    }
    function look(dx, dy) {
      ["left", "right"].forEach((s) => els.eye[s].iris.setAttribute("transform", `translate(${dx},${dy})`));
    }
    function drawPatch(side) {
      const p = els.patch;
      while (p.firstChild) p.firstChild.remove();
      if (!side) return p.setAttribute("opacity", 0);
      const x = EYE.x[side];
      S("path", { d: `M96 ${EYE.y - 70} Q290 ${EYE.y - 110} 484 ${EYE.y - 70}`, stroke: "#222", "stroke-width": 7, fill: "none" }, p);
      const img = artSrc("care-patch");
      if (img) S("image", { href: img, x: x - 70, y: EYE.y - 58, width: 140, height: 116 }, p);
      else {
        S("ellipse", { cx: x, cy: EYE.y + 2, rx: 66, ry: 54, fill: "#1d1d1d", stroke: "#000", "stroke-width": 4 }, p);
        S("path", { d: `M${x - 18} ${EYE.y - 8} l12 -10 l12 10 l12 -10`, stroke: "#fff", "stroke-width": 4, fill: "none" }, p); // a tiny white skull-and-bones zigzag
        S("circle", { cx: x - 2, cy: EYE.y + 18, r: 9, fill: "#fff" }, p);
      }
      p.setAttribute("opacity", 1);
    }

    function drawChart() {
      const g = S("g", {}, svg);
      els.chart = g;
      const X0 = 598;
      const X1 = 975;
      S("rect", { x: X0, y: 14, width: X1 - X0, height: 452, rx: 14, fill: "#fffdf6", stroke: "#8a7a66", "stroke-width": 5 }, g);
      S("circle", { cx: (X0 + X1) / 2, cy: 8, r: 8, fill: "#b08a3a" }, g);
      els.bar = S("rect", { x: X0 + 6, y: 0, width: X1 - X0 - 12, height: 10, rx: 10, fill: "#ffe98a", opacity: 0 }, g);
      els.pointer = S("g", { opacity: 0, "pointer-events": "none" }, g);
      S("line", { x1: 0, y1: 0, x2: -120, y2: 70, stroke: "#8a5a2b", "stroke-width": 9, "stroke-linecap": "round" }, els.pointer);
      S("circle", { cx: 0, cy: 0, r: 9, fill: "#d24a3a" }, els.pointer);
      const rows = R.chart.length;
      let size = rows >= 5 ? 76 : 88;
      let y = 30;
      els.cells = [];
      els.rowBox = [];
      R.chart.forEach((row, i) => {
        const n = row.cells.length;
        const cw = Math.min(size * 1.25, (X1 - X0 - 30) / n);
        const s = Math.min(size, cw * 0.86);
        const rowH = s + 12;
        const x0 = (X0 + X1) / 2 - (cw * n) / 2;
        els.rowBox.push({ y, h: rowH, x: x0 - 6, w: cw * n + 12 });
        els.cells.push(
          row.cells.map((c, j) => {
            const cx = x0 + cw * j + cw / 2;
            const cy = y + rowH / 2;
            const k = c.big ? 1 : 0.55;
            const cg = S("g", { "data-heal": `cell-${i}-${j}` }, g);
            S("rect", { x: cx - cw / 2, y, width: cw, height: rowH, fill: "transparent" }, cg);
            const pic = S("image", { href: BASE + c.noun.img, x: cx - (s * k) / 2, y: cy - (s * k) / 2, width: s * k, height: s * k, preserveAspectRatio: "xMidYMid meet" }, cg);
            cg.addEventListener("click", () => tapCell(i, j));
            return { g: cg, pic, cx, cy };
          })
        );
        y += rowH + 6;
        size *= 0.8;
      });
      // the tiny Kasuku on the bottom line (ungraded fun)
      const ky = Math.min(y + 18, 440);
      const kg = S("g", { "data-heal": "kasuku" }, g);
      S("rect", { x: (X0 + X1) / 2 - 30, y: ky - 18, width: 60, height: 36, fill: "transparent" }, kg);
      const bird = S("g", { style: "transform-box:fill-box;transform-origin:50% 100%" }, kg);
      S("ellipse", { cx: (X0 + X1) / 2, cy: ky, rx: 9, ry: 11, fill: "#3fa34d" }, bird);
      S("circle", { cx: (X0 + X1) / 2 + 3, cy: ky - 9, r: 6, fill: "#4dbb5a" }, bird);
      S("path", { d: `M${(X0 + X1) / 2 + 8} ${ky - 10} l6 3 l-6 3 Z`, fill: "#f0a020" }, bird);
      S("circle", { cx: (X0 + X1) / 2 + 4, cy: ky - 11, r: 1.6, fill: "#111" }, bird);
      S("path", { d: `M${(X0 + X1) / 2 - 3} ${ky + 10} l-4 8 M${(X0 + X1) / 2 + 3} ${ky + 10} l2 8`, stroke: "#c07a2a", "stroke-width": 2 }, bird);
      kg.addEventListener("click", () => {
        sfx("pop");
        const l = lineOf("squawk");
        say(l.id, l);
        anim(bird, [{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-40px) rotate(-20deg)" }, { transform: "translateY(0) rotate(15deg)" }, { transform: "translateY(0) rotate(0)" }], { duration: 700 });
        bubble("Squawk!", (X0 + X1) / 2, ky - 50);
        lids(0.5);
        later(() => lids(0), 700);
      });
    }

    const icons = {
      drops(g, x, y) {
        S("rect", { x: x - 14, y: y - 6, width: 28, height: 34, rx: 8, fill: "#8fc3a9", stroke: "#4c7a64", "stroke-width": 3 }, g);
        S("rect", { x: x - 6, y: y - 22, width: 12, height: 18, rx: 4, fill: "#e8e2d8", stroke: "#8a7a66", "stroke-width": 2 }, g);
        S("path", { d: `M${x} ${y - 36} q7 9 0 12 q-7 -3 0 -12`, fill: "#5ab0e8" }, g);
      },
      pointer(g, x, y) {
        S("line", { x1: x - 24, y1: y + 24, x2: x + 22, y2: y - 22, stroke: "#8a5a2b", "stroke-width": 8, "stroke-linecap": "round" }, g);
        S("circle", { cx: x + 22, cy: y - 22, r: 7, fill: "#d24a3a" }, g);
      },
      patch(g, x, y) {
        S("path", { d: `M${x - 30} ${y - 10} L${x + 30} ${y - 16}`, stroke: "#222", "stroke-width": 4 }, g);
        S("ellipse", { cx: x, cy: y + 6, rx: 22, ry: 17, fill: "#1d1d1d" }, g);
        S("circle", { cx: x, cy: y + 8, r: 4, fill: "#fff" }, g);
      },
      unknown(g, x, y) {
        S("circle", { cx: x, cy: y, r: 20, fill: "#b9b3aa" }, g);
      },
    };
    function drawTray() {
      const g = S("g", {}, svg);
      S("rect", { x: 8, y: 478, width: 720, height: 78, rx: 16, fill: "#e4d9c8", stroke: "#b9a88f", "stroke-width": 3 }, g);
      els.dish = {};
      const tray = ctx.tray && ctx.tray.length ? ctx.tray : Object.keys(DATA.items).map((id) => ({ id }));
      tray.forEach((it, i) => {
        const x = 58 + i * 96;
        const y = 516;
        const def = DATA.items[it.id];
        const use = def && def.use;
        const usable = !!use;
        const dg = S("g", { class: "hc-dish" + (usable ? "" : " hc-off"), "data-heal": "dish-" + it.id }, g);
        S("ellipse", { cx: x, cy: y + 4, rx: 42, ry: 32, fill: "#fff", stroke: "#9c8b75", "stroke-width": 3 }, dg);
        const src = artSrc(it.id);
        if (src) S("image", { href: src, x: x - 34, y: y - 30, width: 68, height: 60 }, dg);
        else (icons[use] || icons.unknown)(dg, x, y);
        const tickMark = S("path", { d: `M${x + 18} ${y - 26} l7 8 l14 -16`, stroke: "#3f9a4f", "stroke-width": 6, fill: "none", opacity: 0, "stroke-linecap": "round" }, dg);
        if (usable) {
          els.dish[use] = { g: dg, tick: tickMark, id: it.id };
          dg.addEventListener("click", () => lift(use));
        }
      });
      // Done, on the right under the thumb
      const d = S("g", { "data-heal": "done" }, svg);
      S("rect", { x: 856, y: 480, width: 132, height: 74, rx: 22, fill: "#4f9a58", stroke: "#2f6a38", "stroke-width": 4 }, d);
      S("path", { d: "M893 516 l18 18 l36 -36", stroke: "#fff", "stroke-width": 11, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, d);
      els.done = d;
      d.addEventListener("click", finish);
    }

    /* ---- play ---- */
    function poke() {
      clearTimeout(idleT);
      [...svg.querySelectorAll(".hc-pulse")].forEach((e) => e.classList.remove("hc-pulse"));
      if (finished) return;
      idleT = setTimeout(() => !dead && hintNext(), 8000);
    }
    function nextRow() {
      return R.rows.find((r) => !ticked.has(r.id));
    }
    function hintNext() {
      const r = nextRow();
      if (!r) return els.done.classList.add("hc-pulse");
      card.pulse(r.id);
      const use = r.id === "side" || r.id === "drops" ? "drops" : r.id === "patch" ? "patch" : "pointer";
      if (holding !== use && els.dish[use]) els.dish[use].g.classList.add("hc-pulse");
      else if (use === "pointer" && els.cells[callIdx]) els.cells[callIdx].forEach((c) => c.g.classList.add("hc-pulse"));
      else if (use !== "pointer") {
        const side = use === "patch" ? R.patch : R.side;
        if (level === 1 || use === "drops") ["left", "right"].forEach((s) => els.eye[s].g.classList.add("hc-pulse")); // both: the hint never says which
        void side;
      }
    }
    function closeStep(use) {
      if (use === "drops" && st.drops.left + st.drops.right > 0) {
        if (R.rows.some((r) => r.id === "side")) tick("side");
        tick("drops");
        used.add("drops");
      }
      if (use === "patch" && st.patch) {
        tick("patch");
        used.add("patch");
      }
      if (use === "pointer" && callIdx >= R.chart.length) used.add("pointer");
      if (els.dish[use]) els.dish[use].tick.setAttribute("opacity", used.has(use) ? 1 : 0);
      if (use === "drops" && !R.list) {
        if (R.patch) reveal("patch");
      }
    }
    function lift(use) {
      if (finished) return;
      poke();
      sfx("tap");
      if (holding === use) return;
      if (holding) {
        closeStep(holding);
        els.dish[holding].g.classList.remove("hc-up");
      }
      holding = use;
      els.dish[use].g.classList.add("hc-up");
      if (root.Onboard) root.Onboard.signal("heal-eye-lift");
      if (use === "pointer") {
        showBar();
        callNext();
      } else hideBar();
    }
    function tapEye(side) {
      if (finished) return;
      poke();
      if (holding === "drops") {
        st.drops[side]++;
        if (root.Onboard) root.Onboard.signal("heal-eye-drop");
        if (ctx.tally) ctx.tally(els.dish.drops.id, st.drops.left + st.drops.right);
        const x = els.eye[side].x;
        const drop = S("path", { d: `M${x} ${EYE.y - 150} q14 18 0 24 q-14 -6 0 -24`, fill: "#5ab0e8", "pointer-events": "none" }, svg);
        anim(drop, [{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(130px)`, opacity: 1, offset: 0.85 }, { transform: `translateY(140px)`, opacity: 0 }], { duration: 380, easing: "ease-in" });
        later(() => {
          drop.remove();
          sfx("pop");
          blink(side, 2);
          const iris = els.eye[side].iris;
          iris.setAttribute("style", "transform-box:fill-box;transform-origin:center");
          anim(iris, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 420 });
          mouth("ooh");
          patient.react && patient.react("giggle");
          if (st.drops.left + st.drops.right === 1) bubble("Ooh!", 290, 450);
          later(() => mouth("idle"), 600);
        }, 360);
      } else if (holding === "patch") {
        const first = !st.patch;
        st.patch = side;
        drawPatch(side);
        sfx("pop");
        if (first) {
          mouth("smile");
          const l = lineOf("arr");
          say(l.id, l);
          bubble("Arrr!", 290, 460);
          patient.react && patient.react("giggle");
          later(() => mouth("idle"), 1200);
        }
      } else {
        // a bare tap on an eye: a blink (every tap reacts)
        blink(side);
      }
    }
    function showBar() {
      if (callIdx >= R.chart.length) return hideBar();
      const b = els.rowBox[callIdx];
      els.bar.setAttribute("y", b.y - 2);
      els.bar.setAttribute("height", b.h + 4);
      els.bar.setAttribute("opacity", 0.8);
      els.pointer.setAttribute("opacity", 1);
      els.pointer.setAttribute("transform", `translate(${b.x - 4},${b.y + b.h / 2})`);
      look(14, callIdx > 1 ? 4 : -2);
      if (callIdx >= 2) {
        lids(0.4);
        mouth("squint");
      }
    }
    function hideBar() {
      els.bar.setAttribute("opacity", 0);
      els.pointer.setAttribute("opacity", 0);
      look(0, 0);
      lids(0);
      mouth("idle");
    }
    function callNext() {
      if (callIdx >= R.chart.length || called === callIdx) return;
      called = callIdx;
      const row = R.rows.find((r) => r.id === "call" + callIdx);
      if (callIdx === 0 && !R.list) {
        const l = lineOf("chart");
        say(l.id, l);
      }
      reveal(row.id);
      later(() => sayRow(row), callIdx === 0 ? 700 : 350);
    }
    function tapCell(i, j) {
      if (finished) return;
      poke();
      if (holding !== "pointer") {
        if (els.dish.pointer) els.dish.pointer.g.classList.add("hc-pulse");
        return;
      }
      if (i !== callIdx) return; // the pointer is on another line
      const c = els.cells[i][j];
      const right = j === R.chart[i].target;
      if (!right && level === 1 && !corrected) {
        // level 1's gentle, one-time correction: the doctor says it again
        corrected = true;
        log({ type: "hint", rowId: "call" + i, detail: "level-1 correction" });
        anim(c.g, [{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 300 });
        later(() => sayRow(R.rows.find((r) => r.id === "call" + i)), 300);
        return;
      }
      st.picks[i] = j;
      sfx("pop");
      c.g.setAttribute("style", "transform-box:fill-box;transform-origin:center");
      anim(c.g, [{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 380 });
      const ring = S("ellipse", { cx: c.cx, cy: c.cy, rx: 30, ry: 30, fill: "none", stroke: "#d24a3a", "stroke-width": 3, opacity: 0.6, "pointer-events": "none" }, els.chart);
      void ring;
      tick("call" + i);
      callIdx++;
      if (callIdx >= R.chart.length) {
        used.add("pointer");
        els.dish.pointer.tick.setAttribute("opacity", 1);
        hideBar();
        mouth("smile");
        later(() => mouth("idle"), 900);
        if (ctx.interject) ctx.interject("shabash");
      } else later(() => {
        if (holding === "pointer") {
          showBar();
          callNext();
        }
      }, 450);
    }
    function finish() {
      if (finished) return;
      if (holding) {
        closeStep(holding);
        els.dish[holding] && els.dish[holding].g.classList.remove("hc-up");
      }
      holding = null;
      finished = true;
      clearTimeout(idleT);
      hideBar();
      const g = grade(R, st);
      g.forEach((r) => log({ type: r.right ? "right" : "wrong", rowId: r.id }));
      const right = g.filter((r) => r.right).length;
      mouth("smile");
      patient.react && patient.react("happy");
      if (ctx.done) ctx.done({ right, total: g.length, hints: 0, words: R.words.map((w) => ({ kutchi: w.kutchi, english: w.english, audio: w.audio })), rows: g });
    }

    async function start() {
      await Promise.all([load(), loadArt()]);
      if (dead) return;
      R = makeRound(DATA, level, rng, ctx.side);
      st = newState(R);
      drawFace();
      drawChart();
      drawTray();
      if (R.patch) drawPatch(null);
      svg.addEventListener("click", poke);
      // the card: one line at a time at level 1, one list from level 2
      if (!R.list) revealed.push(...R.rows.filter((r) => r.id === "drops" || r.id === "side").map((r) => r.id));
      setRows();
      // the patient first (their side), then the doctor
      let t = 300;
      R.rows.forEach((row) => {
        if (row.id.startsWith("call")) return;
        if (!R.list && !revealed.includes(row.id)) return;
        later(() => (row.line ? say("heal-eye-" + row.line, lineOf(row.line)) : sayRow(row)), t);
        t += 1400;
      });
      if (R.list) later(() => say("heal-eye-chart", lineOf("chart")), t);
      // idle blinking: the patient is alive
      const idle = () => {
        if (dead) return;
        if (!finished && holding !== "pointer") blink();
        later(idle, 3200 + Math.random() * 2500);
      };
      later(idle, 2500);
      poke();
      if (ctx.onboard) {
        ctx.onboard([
          { spotlight: `.heal-c-eye [data-heal="dish-${els.dish.drops ? els.dish.drops.id : "care-drops"}"]`, ghost: { gesture: "tap" }, wait: "heal-eye-lift" },
          { spotlight: [`.heal-c-eye [data-heal="eye-left"]`, `.heal-c-eye [data-heal="eye-right"]`], ghost: { gesture: "tap" }, wait: "heal-eye-drop" },
        ]);
      }
    }
    const ctl = {
      start,
      destroy() {
        dead = true;
        clearTimeout(idleT);
        timers.forEach(clearTimeout);
        wrap.remove();
      },
      /** For the lab and the browser test: the round, the state, and where a thing is on the page. */
      debug() {
        return { round: R, state: st, holding, callIdx, ticked: [...ticked], finished };
      },
      where(key) {
        const e = svg.querySelector(`[data-heal="${key}"]`);
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, h: b.height };
      },
    };
    return ctl;
  }

  return {
    id: ID,
    part: "body-eye",
    ailments: ["sore-eye"],
    items: ["care-drops", "tool-pointer", "care-patch"],
    gestures: ["tap"],
    levels: [1, 2, 3],
    mount,
    bot,
    // pure pieces, for the leak bot and tests
    makeRound,
    grade,
    newState,
    load,
  };
});
