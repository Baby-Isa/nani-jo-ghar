/*
 * Clinic heal game `eye`: H12 Drops and the chart (docs/modes/clinic-design.md,
 * the quality pass Q4; contract docs/clinic-heal-api.md).
 *
 * The close-up: the patient's face (their own colours, from the figure's
 * kind) and a picture eye chart. The patient: *[EN: My left eye]*; the
 * doctor: *Ba [EN: drops]*: tap the drops dish, tap that eye twice (each
 * drop: a blink, the iris spins, "ooh!"). Level 3: *[EN: Cover the other
 * eye]*: the pirate patch goes on THE OTHER eye (arrr!). Then the pointer
 * and the chart: the doctor names a noun the child already knows (Cook's
 * fruit and veg words), one call per row, the rows shrinking and the
 * patient squinting harder; level 3 adds *wadho/nindho* and a *nar* row.
 * The smallest row is a tiny Kasuku who squawks when tapped (ungraded).
 *
 * Gestures (every level, UX s12): tap only (tap the dish, tap the spot).
 * A row ticks when its step CLOSES (the next dish, or Done; a chart call
 * closes on the pick), never on a count. Wrong things just happen and are
 * counted in the review; level 1 keeps one gentle correction on the chart.
 *
 * Levels are data: data/clinic/heal/eye.json. `makeRound` is pure and
 * shared by mount() and bot(), so the leak bot plays exactly the game's rows.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const ID = "eye";
  const nodeData = () => {
    const fs = require("fs");
    const path = require("path");
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", "data", "clinic", "heal", `${ID}.json`), "utf8"));
  };

  /* ---------------- pure ---------------- */
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
      rows.push({ id: "side", kutchi: l.kutchi, english: l.english, who: "patient" });
    }
    const dropWord = count === 1 ? D.words.drop.english : D.words.drops.english;
    rows.push({ id: "drops", kutchi: `${num.kutchi} [${dropWord}]`, english: `${cap(num.english)} ${dropWord}`, who: "doctor" });
    words.push({ kutchi: num.kutchi.toLowerCase(), english: num.english });
    if (lv.patch) {
      const l = D.lines.patch;
      rows.push({ id: "patch", kutchi: l.kutchi, english: l.english, who: "doctor" });
    }
    // the chart: one call per row, top (biggest) to bottom
    const he = D.chart_nouns.filter((n) => n.he);
    const usedT = new Set(); // no noun is called twice in a round
    const chart = lv.chart.map((spec, i) => {
      let cells;
      let target;
      let call;
      if (spec.kind === "noun") {
        cells = shuffle(rng, D.chart_nouns)
          .slice(0, spec.n)
          .map((n) => ({ noun: n, big: true }));
        const fresh = cells.map((c, k) => k).filter((k) => !usedT.has(cells[k].noun.id));
        target = fresh.length ? pick(rng, fresh) : Math.floor(rng() * cells.length);
        usedT.add(cells[target].noun.id);
        const t = cells[target].noun;
        call = { kutchi: cap(t.kutchi) + "!", english: cap(t.english) + "!", audio: t.audio };
        words.push({ kutchi: t.kutchi, english: t.english, audio: t.audio });
      } else {
        // two he-nouns, each big and small: the size word (or "not the …") decides
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
      rows.push({ id: "call" + i, kutchi: call.kutchi, english: call.english, audio: call.audio, who: "doctor" });
      return { kind: spec.kind, cells, target };
    });
    const seen = new Set();
    const uniq = words.filter((w) => (seen.has(w.kutchi) ? false : seen.add(w.kutchi)));
    return { level: Number(level), side, count, options: lv.drops, sore: !!lv.sore_visible, patch: lv.patch ? other(side) : null, list: !!lv.list, rows, chart, words: uniq };
  }

  /** A fresh play state. */
  const newState = (R) => ({ drops: { left: 0, right: 0 }, patch: null, picks: R.chart.map(() => null) });

  /** Grade every row from what was done (pure). */
  function grade(R, st) {
    const o = other(R.side);
    const total = st.drops.left + st.drops.right;
    const hasSide = R.rows.some((r) => r.id === "side");
    return R.rows.map((row) => {
      let right = false;
      if (row.id === "side") right = st.drops[R.side] > 0 && st.drops[o] === 0;
      else if (row.id === "drops") right = hasSide ? total === R.count : st.drops[R.side] === R.count && st.drops[o] === 0;
      else if (row.id === "patch") right = st.patch === R.patch;
      else if (row.id.startsWith("call")) {
        const i = Number(row.id.slice(4));
        right = st.picks[i] === R.chart[i].target;
      }
      return { id: row.id, right };
    });
  }

  const STRATEGIES = ["fair", "random", "best", "first", "biggest"];
  /**
   * The blind bot (pure): plays a round without the words.
   *   fair     understands every word (must win 100%)
   *   random   any count 1-5, any eye, any picture
   *   best     the likeliest guess the screen allows: the sore eye when it
   *            shows (level 1), a count from the level's range, "the other
   *            one" of its own guess for the patch, any picture
   *   first    always one drop, the first eye it sees, the first picture
   *   biggest  the biggest picture on a sized row, else any; the likeliest count
   */
  function bot(level, rng, D) {
    D = D || nodeData();
    const R = makeRound(D, level, rng, null);
    const score = (st) => {
      const g = grade(R, st);
      const right = g.filter((r) => r.right).length;
      return { right, total: g.length, win: right === g.length, rows: g };
    };
    return {
      rows: R.rows,
      round: R,
      strategies: STRATEGIES,
      solve(strategy = "best") {
        const st = newState(R);
        if (strategy === "fair") {
          st.drops[R.side] = R.count;
          if (R.patch) st.patch = R.patch;
          R.chart.forEach((c, i) => (st.picks[i] = c.target));
          return score(st);
        }
        const eye = R.sore && strategy !== "random" ? R.side : strategy === "first" ? "right" : rng() < 0.5 ? "left" : "right";
        const n = strategy === "random" ? 1 + Math.floor(rng() * 5) : strategy === "first" ? 1 : pick(rng, R.options);
        st.drops[eye] = n;
        if (R.patch) st.patch = strategy === "random" ? (rng() < 0.5 ? "left" : "right") : other(eye);
        R.chart.forEach((c, i) => {
          if (strategy === "first") st.picks[i] = 0;
          else if (strategy === "biggest" && c.kind !== "noun") {
            const bigs = c.cells.map((x, k) => (x.big ? k : -1)).filter((k) => k >= 0);
            st.picks[i] = pick(rng, bigs);
          } else st.picks[i] = Math.floor(rng() * c.cells.length);
        });
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
.hc-eye{position:absolute;inset:0;z-index:5;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.hc-eye svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.hc-eye [data-heal]{cursor:pointer}
.hc-eye .hc-pulse{animation:hcEyePulse 1s ease-in-out infinite}
@keyframes hcEyePulse{0%,100%{opacity:1}50%{opacity:.4}}
.hc-eye .hc-bubble{font:800 30px/1 "Baloo 2",system-ui,sans-serif;fill:#3a2e28}
`;
  const SKIN_DEF = "#c99a74";
  const shade = (hex, k) => {
    const n = parseInt(String(hex).replace("#", ""), 16);
    if (isNaN(n)) return hex;
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
  };
  // the face, in its own box (0..580 x 0..480); the patient faces you: their left eye is on your right
  const EYE = { y: 215, x: { right: 205, left: 375 }, rx: 58, ry: 44 };
  const itemBase = (id) =>
    String(id || "")
      .replace(/^(care|tool|med)-/, "")
      .replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown|pirate|bandhani)$/, "");
  const USE = { drops: "drops", dropper: "drops", pointer: "pointer", patch: "patch", "eye-patch": "patch" };

  function mount(stage, ctx) {
    const doc = stage.ownerDocument;
    const W = root;
    const Kit = W.Clinic && W.Clinic.Kit;
    const D = ctx.data || (W.__healData && W.__healData[ID]);
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
    const level = ctx.level || 1;
    const rng = ctx.rng || Math.random;
    const R = makeRound(D, level, rng, ctx.side);
    const st = newState(R);
    const kindId = (ctx.patient && ctx.patient.kind) || "girl";
    const KIND = (W.Clinic && W.Clinic.Figure && W.Clinic.Figure.KINDS && W.Clinic.Figure.KINDS[kindId]) || {};
    const SKIN = KIND.skin || SKIN_DEF;
    const SKIN_D = shade(SKIN, 0.8);

    const css = doc.createElement("style");
    css.textContent = CSS;
    stage.appendChild(css);
    const wrap = doc.createElement("div");
    wrap.className = "hc-eye";
    stage.appendChild(wrap);
    // the close-up replaces the whole-body figure for this game (its eyes are dots at this size)
    const figLayer = stage.querySelector(".cl-patient-layer");
    if (figLayer) figLayer.style.visibility = "hidden";

    // wide (face left, chart right) or tall (face on top, chart below)
    const box = stage.getBoundingClientRect();
    const tall = box.height > box.width * 1.05;
    const VB = tall ? { w: 600, h: 1000 } : { w: 1000, h: 500 };
    const svg = S("svg", { viewBox: `0 0 ${VB.w} ${VB.h}`, preserveAspectRatio: "xMidYMid meet" }, wrap);
    const faceG = S("g", { transform: tall ? "translate(10 6)" : "translate(0 10)" }, svg);
    const chartG = S("g", { transform: tall ? "translate(100 505)" : "translate(585 18)" }, svg);
    const fxG = S("g", { "pointer-events": "none" }, svg);

    let holding = null; // "drops" | "pointer" | "patch"
    let heldDish = -1;
    let finished = false;
    let corrected = false; // level 1's one gentle correction
    let callIdx = 0;
    let called = -1;
    let lastAct = Date.now();
    const ticked = new Set();
    const used = new Set(); // the steps that have been worked
    const els = { eye: {} };

    // the patient's voice bubble comes from this face while the close-up is up
    const speakers = Kit && Kit.Voice && Kit.Voice.speakers;
    const oldSpeaker = speakers && speakers.patient;
    if (speakers) speakers.patient = () => els.head || wrap;

    const line = (id) => Object.assign({}, (D.lines || {})[id] || { english: id });
    const say = (l) => ctx.say(l, { who: l.who || "doctor" });
    const tick = (id) => {
      if (ticked.has(id)) return;
      ticked.add(id);
      ctx.card.tick(id);
    };
    const mood = (m, ms) => {
      ctx.patient && ctx.patient.react && ctx.patient.react(m, ms);
      mouth({ ouch: "ooh", giggle: "smile", happy: "smile", relief: "smile" }[m] || "idle");
      if (ms !== 0) ctx.after(ms || 900, () => !finished && mouth(holding === "pointer" && callIdx >= 2 ? "squint" : "idle"));
    };

    /* ---- the card ---- */
    const cardRow = (r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, audio: r.audio, who: r.who });
    const shown = [];
    const reveal = (id) => {
      if (shown.includes(id)) return false;
      shown.push(id);
      if (!R.list) ctx.card.addRow ? ctx.card.addRow(cardRow(R.rows.find((r) => r.id === id))) : ctx.card.setRows(R.rows.filter((r) => shown.includes(r.id)).map(cardRow));
      return true;
    };

    /* ---- drawing ---- */
    function bubble(text, x, y) {
      const g = S("g", {}, fxG);
      const w = Math.max(120, text.length * 17 + 34);
      S("rect", { x: x - w / 2, y: y - 32, width: w, height: 56, rx: 26, fill: "#fff", stroke: "#3a2e28", "stroke-width": 3 }, g);
      S("text", { x, y: y + 6, "text-anchor": "middle", class: "hc-bubble" }, g).textContent = text;
      anim(g, [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 1800 });
      ctx.after(1800, () => g.remove());
    }
    function drawFace() {
      const f = faceG;
      const hair = KIND.hairCol || "#2b1d16";
      // ears, head, hair (the patient's own: bald Nana, Ma's long hair, the girl's bunches)
      if (KIND.hair === "long") S("path", { d: "M70 200 Q60 470 150 470 L430 470 Q520 470 510 200 Z", fill: hair }, f);
      S("ellipse", { cx: 88, cy: 255, rx: 34, ry: 52, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      S("ellipse", { cx: 492, cy: 255, rx: 34, ry: 52, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      els.head = S("ellipse", { cx: 290, cy: 250, rx: 205, ry: 215, fill: SKIN, stroke: SKIN_D, "stroke-width": 5 }, f);
      if (KIND.hair === "bunches") [[70, 110], [510, 110]].forEach(([x, y]) => S("circle", { cx: x, cy: y, r: 52, fill: hair }, f));
      if (KIND.hair === "bun") S("circle", { cx: 290, cy: 30, r: 46, fill: hair }, f);
      if (KIND.hair === "bald") {
        S("path", { d: "M92 230 Q86 150 118 118 L128 230 Z M488 230 Q494 150 462 118 L452 230 Z", fill: hair }, f);
        S("path", { d: "M180 60 Q290 30 400 60", stroke: "rgba(255,255,255,.35)", "stroke-width": 16, fill: "none", "stroke-linecap": "round" }, f); // the shine
      } else if (KIND.hair !== "none") S("path", { d: "M95 205 Q110 30 290 33 Q470 30 485 205 Q440 100 290 97 Q140 100 95 205 Z", fill: hair }, f);
      if (KIND.cap) S("path", { d: "M150 78 Q290 -8 430 78 Q290 50 150 78 Z", fill: "#f4f1ea", stroke: "#cfc8b8", "stroke-width": 4 }, f); // the topi, pushed back
      if (KIND.glasses) {
        // the doctor pushed the glasses up onto the forehead (comic)
        const gl = S("g", { "pointer-events": "none" }, f);
        [218, 362].forEach((x) => S("circle", { cx: x, cy: 104, r: 36, fill: "rgba(255,255,255,.35)", stroke: "#3a3a44", "stroke-width": 6 }, gl));
        S("path", { d: "M254 104 Q290 90 326 104", stroke: "#3a3a44", "stroke-width": 6, fill: "none" }, gl);
      }
      // eyes
      ["right", "left"].forEach((side) => {
        const x = EYE.x[side];
        const g = S("g", { "data-heal": "eye-" + side }, f);
        const clipId = `hc-eye-clip-${side}-${Math.floor(Math.random() * 1e9)}`;
        S("ellipse", { cx: x, cy: EYE.y, rx: EYE.rx }, S("clipPath", { id: clipId }, g)).setAttribute("ry", EYE.ry);
        S("ellipse", { cx: x, cy: EYE.y, rx: EYE.rx + 36, ry: EYE.ry + 44, fill: "transparent" }, g); // the generous hit area
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
        const brow = S("path", { d: `M${x - 62} ${EYE.y - 72} Q${x} ${EYE.y - 100} ${x + 62} ${EYE.y - 72}`, stroke: KIND.hair === "bald" || KIND.hairCol === "#e8e6e1" ? "#bdb8ae" : "#3b2a22", "stroke-width": 11, fill: "none", "stroke-linecap": "round" }, g);
        if (sore) [[-72, -58], [76, -46], [82, 30]].forEach(([dx, dy]) => S("path", { d: `M${x + dx - 10} ${EYE.y + dy} l6 -8 l6 8 l6 -8`, stroke: "#e46d8f", "stroke-width": 3, fill: "none", "pointer-events": "none" }, g));
        els.eye[side] = { g, iris, lid, brow, x };
        ctx.on(g, "click", () => tapEye(side));
      });
      // nose, cheeks, moustache, mouth
      S("path", { d: "M290 255 Q272 317 282 323 Q296 329 306 321", stroke: SKIN_D, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, f);
      S("circle", { cx: 170, cy: 310, r: 26, fill: "#e59a8a", opacity: 0.45 }, f);
      S("circle", { cx: 410, cy: 310, r: 26, fill: "#e59a8a", opacity: 0.45 }, f);
      if (KIND.moustache) S("path", { d: "M222 350 Q290 318 358 350 Q290 336 222 350 Z", fill: KIND.hairCol || "#333", stroke: KIND.hairCol || "#333", "stroke-width": 8, "stroke-linejoin": "round" }, f);
      els.mouth = S("path", { d: "", stroke: "#6b2f2a", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, f);
      els.patch = S("g", { "pointer-events": "none", opacity: 0 }, f);
      els.dropper = S("g", { "pointer-events": "none", opacity: 0 }, f);
      const dsrc = sprite("drops-green");
      if (dsrc) S("image", { href: dsrc, x: -28, y: -104, width: 56, height: 94 }, els.dropper);
      else {
        S("rect", { x: -16, y: -60, width: 32, height: 40, rx: 8, fill: "#8fc3a9", stroke: "#4c7a64", "stroke-width": 3 }, els.dropper);
        S("rect", { x: -7, y: -22, width: 14, height: 20, rx: 4, fill: "#e8e2d8", stroke: "#8a7a66", "stroke-width": 2 }, els.dropper);
      }
      mouth("idle");
    }
    function mouth(m) {
      const d = {
        idle: "M240 380 Q290 392 340 380",
        smile: "M232 368 Q290 428 348 368",
        ooh: "M275 380 Q290 358 305 380 Q290 402 275 380",
        squint: "M250 386 Q270 376 290 386 Q310 396 330 384",
      }[m];
      els.mouth.setAttribute("d", d || "");
      els.mouth.setAttribute("fill", m === "ooh" ? "#6b2f2a" : "none");
    }
    const lids = (v, side) => (side ? [side] : ["left", "right"]).forEach((s) => (els.eye[s].lid.style.transform = `scaleY(${v})`));
    const blink = (side, times = 1) => (side ? [side] : ["left", "right"]).forEach((s) => anim(els.eye[s].lid, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: 220, iterations: times }));
    const look = (dx, dy) => ["left", "right"].forEach((s) => els.eye[s].iris.setAttribute("transform", `translate(${dx},${dy})`));
    function drawPatch(side) {
      const p = els.patch;
      while (p.firstChild) p.firstChild.remove();
      if (!side) return p.setAttribute("opacity", 0);
      const x = EYE.x[side];
      S("path", { d: `M96 ${EYE.y - 70} Q290 ${EYE.y - 112} 484 ${EYE.y - 70}`, stroke: "#222", "stroke-width": 7, fill: "none" }, p);
      const img = sprite("eye-patch-pirate");
      if (img) S("image", { href: img, x: x - 78, y: EYE.y - 56, width: 156, height: 106 }, p);
      else {
        S("ellipse", { cx: x, cy: EYE.y + 2, rx: 66, ry: 54, fill: "#1d1d1d", stroke: "#000", "stroke-width": 4 }, p);
        S("circle", { cx: x - 2, cy: EYE.y + 8, r: 10, fill: "#fff" }, p);
      }
      p.setAttribute("opacity", 1);
    }
    function drawChart() {
      const g = chartG;
      const CW = 390;
      S("rect", { x: 0, y: 0, width: CW, height: 470, rx: 16, fill: "#fffdf6", stroke: "#8a7a66", "stroke-width": 5 }, g);
      S("circle", { cx: CW / 2, cy: -6, r: 9, fill: "#b08a3a" }, g);
      els.bar = S("rect", { x: 6, y: 0, width: CW - 12, height: 10, rx: 12, fill: "#ffe98a", opacity: 0 }, g);
      els.pointer = S("g", { opacity: 0, "pointer-events": "none" }, g);
      S("line", { x1: 0, y1: 0, x2: -120, y2: 70, stroke: "#8a5a2b", "stroke-width": 9, "stroke-linecap": "round" }, els.pointer);
      S("circle", { cx: 0, cy: 0, r: 9, fill: "#d24a3a" }, els.pointer);
      let size = R.chart.length >= 5 ? 74 : 86;
      let y = 16;
      els.cells = [];
      els.rowBox = [];
      R.chart.forEach((row, i) => {
        const n = row.cells.length;
        const cw = Math.min(size * 1.25, (CW - 24) / n);
        const s = Math.min(size, cw * 0.88);
        const rowH = Math.max(s + 10, 40); // a small row still takes a child's finger
        const x0 = CW / 2 - (cw * n) / 2;
        els.rowBox.push({ y, h: rowH, x: x0 - 6, w: cw * n + 12 });
        els.cells.push(
          row.cells.map((c, j) => {
            const cx = x0 + cw * j + cw / 2;
            const cy = y + rowH / 2;
            const k = c.big ? 1 : 0.55;
            const cg = S("g", { "data-heal": `cell-${i}-${j}`, style: "transform-box:fill-box;transform-origin:center" }, g);
            S("rect", { x: cx - cw / 2, y, width: cw, height: rowH, fill: "transparent" }, cg);
            S("image", { href: url(c.noun.img), x: cx - (s * k) / 2, y: cy - (s * k) / 2, width: s * k, height: s * k, preserveAspectRatio: "xMidYMid meet" }, cg);
            ctx.on(cg, "click", (e) => {
              e.stopPropagation();
              tapCell(i, j);
            });
            return { g: cg, cx, cy };
          })
        );
        y += rowH + 8;
        size *= 0.8;
      });
      // the tiny Kasuku on the bottom line (ungraded fun)
      const kx = CW / 2;
      const ky = Math.min(y + 20, 446);
      const kg = S("g", { "data-heal": "kasuku" }, g);
      S("rect", { x: kx - 32, y: ky - 22, width: 64, height: 44, fill: "transparent" }, kg);
      const bird = S("g", { style: "transform-box:fill-box;transform-origin:50% 100%" }, kg);
      S("ellipse", { cx: kx, cy: ky, rx: 9, ry: 11, fill: "#3fa34d" }, bird);
      S("circle", { cx: kx + 3, cy: ky - 9, r: 6, fill: "#4dbb5a" }, bird);
      S("path", { d: `M${kx + 8} ${ky - 10} l6 3 l-6 3 Z`, fill: "#f0a020" }, bird);
      S("circle", { cx: kx + 4, cy: ky - 11, r: 1.6, fill: "#111" }, bird);
      S("path", { d: `M${kx - 3} ${ky + 10} l-4 8 M${kx + 3} ${ky + 10} l2 8`, stroke: "#c07a2a", "stroke-width": 2 }, bird);
      ctx.on(kg, "click", (e) => {
        e.stopPropagation();
        ctx.sfx("pop");
        say(line("squawk"));
        anim(bird, [{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-40px) rotate(-20deg)" }, { transform: "translateY(0) rotate(15deg)" }, { transform: "translateY(0) rotate(0)" }], { duration: 700 });
        lids(0.5);
        ctx.after(700, () => lids(0));
      });
    }

    /* ---- the dishes (the host's sidebar tray) ---- */
    const useOf = (i) => {
      const t = ctx.tray[i];
      return t && !t.wrong ? USE[itemBase(t.id)] || null : null;
    };
    const dishOf = (use) => ctx.tray.findIndex((t, i) => useOf(i) === use);
    function closeStep(use) {
      if (use === "drops" && st.drops.left + st.drops.right > 0) {
        if (R.rows.some((r) => r.id === "side")) tick("side");
        tick("drops");
        used.add("drops");
        if (!R.list && R.patch && reveal("patch")) say(line("patch"));
      }
      if (use === "patch" && st.patch) {
        tick("patch");
        used.add("patch");
      }
      const di = dishOf(use);
      if (di >= 0 && used.has(use) && ctx.trayUI) ctx.trayUI.used(di);
    }
    function onDish(i) {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      ctx.sfx("tap");
      const use = useOf(i);
      if (!use) {
        ctx.log({ type: "extra", detail: `tapped ${ctx.tray[i] && ctx.tray[i].id}` });
        return;
      }
      if (holding === use) return;
      if (holding) closeStep(holding);
      holding = use;
      heldDish = i;
      ctx.trayUI && ctx.trayUI.select(i);
      ctx.signal && ctx.signal("heal-eye-lift");
      els.dropper.setAttribute("opacity", use === "drops" ? 1 : 0);
      if (use === "drops") placeDropper(null);
      if (use === "pointer") {
        showBar();
        callNext();
      } else hideBar();
    }
    const placeDropper = (side) => els.dropper.setAttribute("transform", `translate(${side ? EYE.x[side] : 290} ${EYE.y - 70})`);

    /* ---- play ---- */
    function tapEye(side) {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      if (holding === "drops") {
        st.drops[side]++;
        used.add("drops-started");
        ctx.signal && ctx.signal("heal-eye-drop");
        const di = dishOf("drops");
        ctx.tally(di >= 0 ? ctx.tray[di].id : "drops", st.drops.left + st.drops.right);
        placeDropper(side);
        anim(els.dropper, [{ transform: `translate(${EYE.x[side]}px, ${EYE.y - 70}px) scale(1)` }, { transform: `translate(${EYE.x[side]}px, ${EYE.y - 70}px) scale(1.12, 0.9)` }, { transform: `translate(${EYE.x[side]}px, ${EYE.y - 70}px) scale(1)` }], { duration: 260 });
        const x = EYE.x[side];
        const drop = S("path", { d: `M${x} ${EYE.y - 70} q14 18 0 24 q-14 -6 0 -24`, fill: "#5ab0e8" }, S("g", { transform: faceG.getAttribute("transform") }, fxG));
        anim(drop, [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(50px)", opacity: 1, offset: 0.85 }, { transform: "translateY(60px)", opacity: 0 }], { duration: 340, easing: "ease-in" });
        ctx.after(330, () => {
          drop.parentNode && drop.parentNode.remove();
          ctx.sfx("pop");
          blink(side, 2);
          const iris = els.eye[side].iris;
          iris.setAttribute("style", "transform-box:fill-box;transform-origin:center");
          anim(iris, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 420 });
          mood("ouch", 600);
          if (st.drops.left + st.drops.right === 1) {
            bubble("Ooh!", tall ? 300 : 290, tall ? 470 : 470);
            say(line("blink"));
          }
        });
      } else if (holding === "patch") {
        const first = !st.patch;
        st.patch = side;
        drawPatch(side);
        ctx.sfx("pop");
        if (first) {
          mood("giggle", 1200);
          say(line("arr"));
          bubble("Arrr!", 290, 470);
        }
      } else {
        // a bare tap on an eye: a blink (every tap reacts)
        blink(side);
      }
    }
    function showBar() {
      if (callIdx >= R.chart.length) return hideBar();
      const b = els.rowBox[callIdx];
      els.bar.setAttribute("y", b.y - 3);
      els.bar.setAttribute("height", b.h + 6);
      els.bar.setAttribute("opacity", 0.8);
      els.pointer.setAttribute("opacity", 1);
      els.pointer.setAttribute("transform", `translate(${b.x - 4},${b.y + b.h / 2})`);
      look(tall ? 0 : 14, tall ? 16 : callIdx > 1 ? 4 : -2);
      if (callIdx >= 2) {
        // the smaller the row, the harder the squint (the other eye under the patch)
        lids(Math.min(0.55, 0.2 + callIdx * 0.08), R.patch ? other(R.patch) : null);
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
      if (callIdx === 0 && !R.list) say(line("chart"));
      reveal(row.id);
      ctx.card.now && ctx.card.now(row.id);
      say(row);
    }
    function tapCell(i, j) {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      if (holding !== "pointer") {
        const pd = dishOf("pointer");
        if (pd >= 0 && ctx.trayUI) ctx.trayUI.pulse(pd, true);
        return;
      }
      if (i !== callIdx) return; // the pointer is on another line
      const c = els.cells[i][j];
      const right = j === R.chart[i].target;
      if (!right && level === 1 && !corrected) {
        // level 1's gentle, one-time correction: the doctor says it again
        corrected = true;
        ctx.log({ type: "hint", rowId: "call" + i, detail: "level-1 correction" });
        anim(c.g, [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
        ctx.after(300, () => say(R.rows.find((r) => r.id === "call" + i)));
        return;
      }
      st.picks[i] = j;
      ctx.sfx("pop");
      anim(c.g, [{ transform: "scale(1)" }, { transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 380 });
      S("circle", { cx: c.cx, cy: c.cy, r: 26, fill: "none", stroke: "#d24a3a", "stroke-width": 3, opacity: 0.55, "pointer-events": "none" }, chartG);
      if (ctx.rng() < 0.5) mood("giggle", 700);
      tick("call" + i);
      callIdx++;
      if (callIdx >= R.chart.length) {
        used.add("pointer");
        const pd = dishOf("pointer");
        if (pd >= 0 && ctx.trayUI) ctx.trayUI.used(pd);
        hideBar();
        mood("happy", 900);
        ctx.interject("shabash");
        if (!nextNeed()) doneBtn.classList.add("throb");
      } else
        ctx.after(450, () => {
          if (holding === "pointer") {
            showBar();
            callNext();
          }
        });
    }
    function nextNeed() {
      if (!used.has("drops") && holding !== "drops") return "drops";
      if (R.patch && !used.has("patch") && holding !== "patch") return "patch";
      if (!used.has("pointer")) return "pointer";
      return null;
    }
    function onDone() {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      if (holding) {
        closeStep(holding);
        if (holding !== "pointer" || used.has("pointer")) {
          holding = null;
          ctx.trayUI && ctx.trayUI.select(-1);
          els.dropper.setAttribute("opacity", 0);
        }
      }
      const need = nextNeed();
      if (need) {
        // not finished yet: the free throb shows what's left (never which eye or which picture)
        const di = dishOf(need);
        if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
        return;
      }
      finish();
    }
    function finish() {
      finished = true;
      hideBar();
      const g = grade(R, st);
      g.forEach((r) => ctx.log({ type: r.right ? "right" : "wrong", rowId: r.id }));
      const right = g.filter((r) => r.right).length;
      mouth("smile");
      ctx.patient.react && ctx.patient.react("happy", 0);
      ctx.done({ right, total: g.length, hints: 0, words: R.words.map((w) => ({ kutchi: w.kutchi, english: w.english, audio: w.audio })) });
    }

    // the throbbing hint after 8 s of nothing: the row and its dish (never the eye, never the picture)
    function stopHints() {
      ctx.card.pulse(null, false);
      ctx.trayUI && ctx.trayUI.pulse(-1, false);
      svg.querySelectorAll(".hc-pulse").forEach((e) => e.classList.remove("hc-pulse"));
    }
    function throb() {
      if (finished) return;
      if (Date.now() - lastAct > 8000) {
        const r = R.rows.find((x) => !ticked.has(x.id) && (R.list || shown.includes(x.id)));
        if (r) ctx.card.pulse(r.id, true);
        const need = holding === "pointer" && !used.has("pointer") ? null : nextNeed();
        const di = need ? dishOf(need) : -1;
        if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
        else if (!need && !r) doneBtn.classList.add("throb");
      }
      ctx.after(1000, throb);
    }

    const doneBtn = ctx.button("✓", onDone, "done");
    doneBtn.setAttribute("aria-label", "Done");
    ctx.trayUI && ctx.trayUI.onTap((i) => onDish(i));
    drawFace();
    drawChart();
    ctx.on(svg, "click", () => (lastAct = Date.now()));

    return {
      async start() {
        // the card: one line at a time at level 1, one list from level 2
        if (R.list) {
          ctx.card.setRows(R.rows.map(cardRow));
        } else {
          ctx.card.setRows([]);
          R.rows.filter((r) => r.id === "drops" || r.id === "side").forEach((r) => reveal(r.id));
        }
        // idle blinking: the patient is alive
        const idle = () => {
          if (finished) return;
          if (holding !== "pointer") blink();
          ctx.after(3200 + Math.random() * 2500, idle);
        };
        ctx.after(2500, idle);
        lastAct = Date.now();
        throb();
        if (level === 1) {
          const dish = () => ctx.trayUI && ctx.trayUI.dishes()[dishOf("drops")];
          ctx.onboard([
            { spotlight: dish, ghost: { gesture: "tap" }, wait: "heal-eye-lift" },
            { spotlight: () => els.eye[R.side].g, ghost: { gesture: "tap" }, wait: "heal-eye-drop" },
          ]);
        }
        if (R.list) await ctx.card.speak();
        else {
          for (const r of R.rows.filter((x) => shown.includes(x.id))) await say(r);
        }
        lastAct = Date.now();
      },
      destroy() {
        finished = true;
        if (speakers) speakers.patient = oldSpeaker;
        if (figLayer) figLayer.style.visibility = "";
        wrap.remove();
        css.remove();
      },
      /** For the browser test: what the game wants next, in client px. */
      expect() {
        const rect = (el) => {
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, h: b.height };
        };
        return {
          round: { side: R.side, count: R.count, patch: R.patch, targets: R.chart.map((c) => c.target) },
          state: JSON.parse(JSON.stringify(st)),
          holding,
          callIdx,
          ticked: [...ticked],
          finished,
          dish: { drops: dishOf("drops"), pointer: dishOf("pointer"), patch: dishOf("patch") },
          eye: { left: rect(els.eye.left.g.querySelector("ellipse:nth-of-type(2)")), right: rect(els.eye.right.g.querySelector("ellipse:nth-of-type(2)")) },
          cells: els.cells.map((row) => row.map((c) => rect(c.g.querySelector("image")))),
          kasuku: rect(svg.querySelector('[data-heal="kasuku"]')),
          done: rect(doneBtn),
        };
      },
    };
  }

  const def = {
    id: ID,
    part: "eye",
    ailments: ["sore-eye"],
    items: ["drops-green", "pointer", "patch"],
    itemsFor: { "sore-eye": ["drops-green", "pointer", "patch"] },
    gestures: ["tap"],
    levels: [1, 2, 3],
    mount,
    bot,
    strategies: STRATEGIES,
    // pure pieces, for the leak bot and tests
    makeRound,
    grade,
    newState,
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
