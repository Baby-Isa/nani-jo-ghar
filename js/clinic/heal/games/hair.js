/*
 * Clinic heal game `hair`: H16 The beetles (docs/modes/clinic-design.md,
 * H16 and decision 1; contract docs/clinic-heal-api.md).
 *
 * The close-up: the patient's head from the front with a big mop of hair
 * (their own hair colour; a bald patient gets Ali's hair), and nine tiny
 * round beetles with big eyebrows peeking out of it, three red, three
 * green, three blue (colour words are placeholders). They are beetles,
 * never "lice". The rows:
 *   [Comb it] trae [times]          tap the comb dish, swipe the hair: one
 *                                   swipe = one stroke; every beetle jumps
 *                                   and waggles its eyebrows
 *   Ba [red ones]                   tap the jar dish, tap beetles: each one
 *                                   waves and hops into the jar (boing)
 *   Ne poi hakro [green one]        level 2+: the second colour, caught after
 *                                   the first colour's beetles
 *   Ne poi [shampoo], char [rubs]   level 3: tap the head, foam grows
 *
 * Gestures (every level, UX s12): tap (the dish, a beetle, the head) +
 * swipe (the comb stroke: pointer down on the hair, move 60 CSS px). A row
 * ticks when its step CLOSES (the next dish, or Done; the first catch row
 * also closes when a beetle of another colour follows it), never on a count.
 *
 * Levels are data: data/clinic/heal/hair.json. `makeRound` is pure and
 * shared by mount() and bot(), so the leak bot plays exactly the game's rows.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const ID = "hair";
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
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const COLOURS = ["red", "green", "blue"];
  const PER_COLOUR = 3;

  /** One round: the rows (the card), the answers and the beetles' places, from the level's data. */
  function makeRound(D, level, rng) {
    const lv = D.levels[String(level)] || D.levels["1"];
    const W = D.words;
    const num = (n) => D.numbers.find((x) => x.n === n);
    const rows = [];
    const words = [];
    const addNum = (nm) => words.push({ kutchi: nm.kutchi.toLowerCase(), english: nm.english });
    const comb = pick(rng, lv.comb);
    const cn = num(comb);
    rows.push({ id: "comb", kutchi: `[${W.comb.english}] ${cn.kutchi.toLowerCase()} [${W.times.english}]`, english: `${W.comb.english} ${cn.english} times`, who: "doctor", use: "comb" });
    addNum(cn);
    const cols = shuffle(rng, COLOURS);
    const catches = lv.catches.map((range, i) => {
      const n = pick(rng, range);
      const colour = cols[i];
      const nm = num(n);
      const noun = `${D.colours[colour].english} ${n === 1 ? W.one.english : W.ones.english}`;
      const lead = i === 0 ? nm.kutchi : `${W.nepoi.kutchi} ${nm.kutchi.toLowerCase()}`;
      rows.push({ id: "catch" + i, kutchi: `${lead} [${noun}]`, english: `${i === 0 ? cap(nm.english) : "And then " + nm.english} ${noun}`, who: "doctor", use: "jar" });
      addNum(nm);
      return { n, colour };
    });
    let shampoo = null;
    if (lv.shampoo) {
      shampoo = pick(rng, lv.shampoo);
      const nm = num(shampoo);
      const r = shampoo === 1 ? W.rub.english : W.rubs.english;
      rows.push({ id: "shampoo", kutchi: `${W.nepoi.kutchi} [${W.shampoo.english}], ${nm.kutchi.toLowerCase()} [${r}]`, english: `And then ${W.shampoo.english}, ${nm.english} ${r}`, who: "doctor", use: "shampoo" });
      addNum(nm);
    }
    if (catches.length > 1 || shampoo) words.push({ kutchi: W.nepoi.kutchi.toLowerCase(), english: W.nepoi.english });
    // nine beetles, three of each colour, in shuffled places in the hair
    const beetles = shuffle(rng, [].concat(...COLOURS.map((c) => Array(PER_COLOUR).fill(c)))).map((colour, slot) => ({ colour, slot }));
    const seen = new Set();
    const uniq = words.filter((w) => (seen.has(w.kutchi) ? false : seen.add(w.kutchi)));
    return {
      level: Number(level),
      comb,
      combOptions: lv.comb,
      catches,
      catchOptions: lv.catches,
      shampoo,
      shampooOptions: lv.shampoo || null,
      list: !!lv.list,
      beetles,
      rows,
      words: uniq,
    };
  }

  /** A fresh play state: strokes, the colours caught in order, rubs. */
  const newState = () => ({ strokes: 0, catches: [], rubs: 0 });

  /** The catches split into the rows' runs: the first run ends at the first beetle of another colour. */
  function runs(R, catches) {
    if (R.catches.length < 2) return [catches.slice()];
    const first = catches[0];
    const k = catches.findIndex((c) => c !== first);
    return k < 0 ? [catches.slice(), []] : [catches.slice(0, k), catches.slice(k)];
  }

  /** Grade every row from what was done (pure). */
  function grade(R, st) {
    const rs = runs(R, st.catches);
    return R.rows.map((row) => {
      let right = false;
      if (row.id === "comb") right = st.strokes === R.comb;
      else if (row.id.startsWith("catch")) {
        const i = Number(row.id.slice(5));
        const want = R.catches[i];
        const got = rs[i] || [];
        right = got.length === want.n && got.every((c) => c === want.colour);
      } else if (row.id === "shampoo") right = st.rubs === R.shampoo;
      return { id: row.id, right };
    });
  }

  const STRATEGIES = ["fair", "random", "best", "first", "all-of-one", "catch-all"];
  /**
   * The blind bot (pure): plays a round without the words.
   *   fair        understands every word (must win 100%)
   *   random      1-6 strokes, 0-3 beetles of any colour per row, 1-6 rubs
   *   best        counts from the level's ranges, a colour per row (a
   *               different one for the second row)
   *   first       one stroke, one red beetle (then one green), one rub
   *   all-of-one  best's comb, but all three beetles of one colour per row
   *   catch-all   best's comb, every beetle in the hair
   */
  function bot(level, rng, D) {
    D = D || nodeData();
    const R = makeRound(D, level, rng);
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
        const st = newState();
        if (strategy === "fair") {
          st.strokes = R.comb;
          R.catches.forEach((c) => {
            for (let k = 0; k < c.n; k++) st.catches.push(c.colour);
          });
          if (R.shampoo) st.rubs = R.shampoo;
          return score(st);
        }
        const rnd = strategy === "random";
        st.strokes = rnd ? 1 + Math.floor(rng() * 6) : strategy === "first" ? 1 : pick(rng, R.combOptions);
        if (strategy === "catch-all") COLOURS.forEach((c) => st.catches.push(c, c, c));
        else {
          const cols = shuffle(rng, COLOURS);
          R.catchOptions.forEach((range, i) => {
            const colour = strategy === "first" ? COLOURS[i] : rnd ? pick(rng, COLOURS) : cols[i];
            const n = rnd ? Math.floor(rng() * 4) : strategy === "first" ? 1 : strategy === "all-of-one" ? PER_COLOUR : pick(rng, range);
            for (let k = 0; k < n; k++) st.catches.push(colour);
          });
        }
        if (R.shampoo) st.rubs = rnd ? 1 + Math.floor(rng() * 6) : strategy === "first" ? 1 : pick(rng, R.shampooOptions);
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
.hc-hair{position:absolute;inset:0;z-index:5;user-select:none;-webkit-user-select:none;touch-action:none}
.hc-hair svg{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
.hc-hair [data-heal]{cursor:pointer}
.hc-hair .hc-pulse{animation:hcHairPulse 1s ease-in-out infinite}
@keyframes hcHairPulse{0%,100%{opacity:1}50%{opacity:.45}}
.hc-hair .hc-bubble{font:800 30px/1 "Baloo 2",system-ui,sans-serif;fill:#3a2e28}
`;
  const SKIN_DEF = "#c99a74";
  const ALI_HAIR = "#1e1510"; // a bald patient borrows Ali's hair for the game
  const BEETLE = { red: "#d8403a", green: "#3fa35b", blue: "#3b73d6" };
  const shade = (hex, k) => {
    const n = parseInt(String(hex).replace("#", ""), 16);
    if (isNaN(n)) return hex;
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
  };
  // the head, in its own box (0..600 x 0..540); nine places in the mop, far enough apart for a finger
  const SLOTS = [
    [175, 92],
    [300, 62],
    [425, 92],
    [92, 188],
    [240, 162],
    [360, 162],
    [508, 188],
    [80, 290],
    [520, 290],
  ];
  const HIT = 50; // a beetle's transparent hit circle (head units)
  const FACE = { cx: 300, cy: 345, rx: 162, ry: 172 };
  const itemBase = (id) =>
    String(id || "")
      .replace(/^(care|tool|med)-/, "")
      .replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/, "");
  const USE = { comb: "comb", "bug-jar": "jar", jar: "jar", shampoo: "shampoo", soap: "shampoo" };

  // the placeholder items this game carries (greybox glyphs until there's art); never overrides the core's
  const Kit0 = root.Clinic && root.Clinic.Kit;
  if (Kit0 && Kit0.ITEMS) {
    if (!Kit0.ITEMS.shampoo) Kit0.ITEMS.shampoo = { kutchi: null, english: "shampoo", glyph: "🧴", placeholder: true };
    if (!Kit0.ITEMS["bug-jar"]) Kit0.ITEMS["bug-jar"] = { kutchi: null, english: "the jar", glyph: "🫙", placeholder: true };
  }

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
    const R = makeRound(D, level, rng);
    const st = newState();
    const kindId = (ctx.patient && ctx.patient.kind) || "girl";
    const KIND = (W.Clinic && W.Clinic.Figure && W.Clinic.Figure.KINDS && W.Clinic.Figure.KINDS[kindId]) || {};
    const SKIN = KIND.skin || SKIN_DEF;
    const SKIN_D = shade(SKIN, 0.8);
    const bald = !KIND.hair || KIND.hair === "bald" || KIND.hair === "none";
    const HAIR = bald ? ALI_HAIR : KIND.hairCol || ALI_HAIR;
    const light = parseInt(HAIR.slice(1, 3), 16) > 160;
    const HAIR_D = light ? shade(HAIR, 0.78) : shade(HAIR, 1.9);

    const css = doc.createElement("style");
    css.textContent = CSS;
    stage.appendChild(css);
    const wrap = doc.createElement("div");
    wrap.className = "hc-hair";
    stage.appendChild(wrap);
    // the close-up replaces the whole-body figure for this game (beetles are specks at that size)
    const figLayer = stage.querySelector(".cl-patient-layer");
    if (figLayer) figLayer.style.visibility = "hidden";

    // wide (head left, jar right) or tall (head on top, jar below)
    const box = stage.getBoundingClientRect();
    const tall = box.height > box.width * 1.05;
    const VB = tall ? { w: 600, h: 900 } : { w: 1000, h: 500 };
    const HEAD = tall ? { x: 0, y: 30, s: 1 } : { x: 90, y: 6, s: 0.91 };
    const JAR = tall ? { x: 300, y: 740, w: 170, h: 200 } : { x: 820, y: 300, w: 170, h: 200 };
    const svg = S("svg", { viewBox: `0 0 ${VB.w} ${VB.h}`, preserveAspectRatio: "xMidYMid meet" }, wrap);
    const headG = S("g", { transform: `translate(${HEAD.x} ${HEAD.y}) scale(${HEAD.s})` }, svg);
    const jarG = S("g", {}, svg);
    const fxG = S("g", { "pointer-events": "none" }, svg);
    const toView = (x, y) => ({ x: HEAD.x + x * HEAD.s, y: HEAD.y + y * HEAD.s });

    let holding = null; // "comb" | "jar" | "shampoo"
    let finished = false;
    let swipe = null;
    let lastAct = Date.now();
    let doneTries = 0;
    const ticked = new Set();
    const used = new Set();
    const shown = [];
    const els = { beetles: [] };

    // the patient's voice bubble comes from this head while the close-up is up
    const speakers = Kit && Kit.Voice && Kit.Voice.speakers;
    const oldSpeaker = speakers && speakers.patient;
    if (speakers) speakers.patient = () => els.face || wrap;

    const line = (id) => Object.assign({}, (D.lines || {})[id] || { english: id });
    const say = (l) => ctx.say(l, { who: l.who || "doctor" });
    const rowOf = (id) => R.rows.find((r) => r.id === id);
    const cardRow = (r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, audio: r.audio, who: r.who });
    const tick = (id) => {
      if (ticked.has(id) || !rowOf(id)) return;
      ticked.add(id);
      ctx.card.tick(id);
    };
    /** Level 1: a row appears (and is read) when its step comes up. */
    const reveal = (id, speak = true) => {
      if (shown.includes(id) || !rowOf(id)) return;
      shown.push(id);
      if (!R.list) ctx.card.addRow ? ctx.card.addRow(cardRow(rowOf(id))) : ctx.card.setRows(R.rows.filter((r) => shown.includes(r.id)).map(cardRow));
      ctx.card.now && ctx.card.now(id);
      if (speak) say(rowOf(id));
    };
    const shownOrList = (id) => R.list || shown.includes(id);
    const mood = (m, ms) => {
      ctx.patient && ctx.patient.react && ctx.patient.react(m, ms);
      mouth({ ouch: "ooh", giggle: "grin", happy: "smile", relief: "smile" }[m] || "idle");
      if (ms !== 0) ctx.after(ms || 900, () => !finished && mouth("idle"));
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
    /** A beetle's picture at (x, y): round shell, a head, big googly eyes, BIG eyebrows, little legs. */
    function beetleArt(parent, x, y, colour, k = 1) {
      const g = S("g", { style: "transform-box:fill-box;transform-origin:50% 90%" }, parent);
      const c = BEETLE[colour];
      // a pale outline under the legs, the head and the brows: they read on dark hair too
      const OUT = "rgba(255,248,236,.85)";
      [[OUT, 7], ["#2a211c", 3.5]].forEach(([col, w]) => {
        const legs = S("g", { stroke: col, "stroke-width": w * k, "stroke-linecap": "round", fill: "none" }, g);
        [-1, 1].forEach((s) => [-8, 2, 12].forEach((dy, i) => S("path", { d: `M${x + s * 16 * k} ${y + dy * k} l${s * (11 + (i === 1 ? 3 : 0)) * k} ${(i - 1) * 5 * k + 3 * k}` }, legs)));
      });
      S("ellipse", { cx: x, cy: y + 4 * k, rx: 21 * k, ry: 19 * k, fill: c, stroke: shade(c, 0.6), "stroke-width": 3 * k }, g);
      S("path", { d: `M${x} ${y - 12 * k} L${x} ${y + 22 * k}`, stroke: shade(c, 0.55), "stroke-width": 2.5 * k }, g);
      [[-9, 8], [9, 12], [-6, -2]].forEach(([dx, dy]) => S("circle", { cx: x + dx * k, cy: y + dy * k, r: 3 * k, fill: shade(c, 0.65) }, g));
      S("ellipse", { cx: x, cy: y - 16 * k, rx: 14 * k, ry: 10 * k, fill: "#2a211c", stroke: OUT, "stroke-width": 2.5 * k }, g);
      const eyes = S("g", {}, g);
      [-7, 7].forEach((dx) => {
        S("circle", { cx: x + dx * k, cy: y - 20 * k, r: 6.5 * k, fill: "#fff", stroke: "#2a211c", "stroke-width": 1.5 * k }, eyes);
        S("circle", { cx: x + dx * k + 1.5 * k, cy: y - 21 * k, r: 2.8 * k, fill: "#111" }, eyes);
      });
      const brows = S("g", { style: "transform-box:fill-box;transform-origin:50% 100%" }, g);
      [[OUT, 9], ["#1a1411", 5]].forEach(([col, w]) => [-1, 1].forEach((s) => S("path", { d: `M${x + s * 2 * k} ${y - 29 * k} Q${x + s * 9 * k} ${y - 36 * k} ${x + s * 16 * k} ${y - 30 * k}`, stroke: col, "stroke-width": w * k, "stroke-linecap": "round", fill: "none" }, brows)));
      return { g, brows };
    }
    function drawHead() {
      const f = headG;
      // long hair falls behind the face (Ma, the aunties)
      if (KIND.hair === "long") S("path", { d: "M70 250 Q40 520 150 540 L450 540 Q560 520 530 250 Z", fill: HAIR }, f);
      if (KIND.hair === "bunches") [[46, 320], [554, 320]].forEach(([x, y]) => {
        S("circle", { cx: x, cy: y, r: 48, fill: HAIR }, f);
        S("circle", { cx: x + (x < 300 ? 26 : -26), cy: y - 34, r: 12, fill: "#e46d8f" }, f);
      });
      // ears, the face (tapped for the shampoo: data-heal="head")
      S("ellipse", { cx: 142, cy: 360, rx: 30, ry: 46, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      S("ellipse", { cx: 458, cy: 360, rx: 30, ry: 46, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      const face = S("g", { "data-heal": "head" }, f);
      els.face = S("ellipse", { cx: FACE.cx, cy: FACE.cy, rx: FACE.rx, ry: FACE.ry, fill: SKIN, stroke: SKIN_D, "stroke-width": 5 }, face);
      // eyes looking UP at the beetles (comic)
      els.pupils = [];
      [240, 360].forEach((x) => {
        S("ellipse", { cx: x, cy: 350, rx: 30, ry: 26, fill: "#fff", stroke: "#6d4c3d", "stroke-width": 3 }, face);
        const p = S("g", {}, face);
        S("circle", { cx: x, cy: 338, r: 13, fill: "#3a2718" }, p);
        S("circle", { cx: x + 4, cy: 334, r: 4, fill: "#fff" }, p);
        els.pupils.push(p);
        S("path", { d: `M${x - 32} 306 Q${x} 290 ${x + 32} 306`, stroke: light || bald ? "#6a5a50" : shade(HAIR, 1), "stroke-width": 9, fill: "none", "stroke-linecap": "round" }, face);
      });
      if (KIND.glasses) {
        [240, 360].forEach((x) => S("circle", { cx: x, cy: 350, r: 40, fill: "rgba(255,255,255,.18)", stroke: "#3a3a44", "stroke-width": 6 }, face));
        S("path", { d: "M280 348 Q300 338 320 348", stroke: "#3a3a44", "stroke-width": 6, fill: "none" }, face);
      }
      S("path", { d: "M300 365 Q284 412 294 418 Q306 424 314 416", stroke: SKIN_D, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, face);
      S("circle", { cx: 200, cy: 408, r: 22, fill: "#e59a8a", opacity: 0.45 }, face);
      S("circle", { cx: 400, cy: 408, r: 22, fill: "#e59a8a", opacity: 0.45 }, face);
      if (KIND.moustache) S("path", { d: "M244 440 Q300 414 356 440 Q300 428 244 440 Z", fill: KIND.hairCol || "#333", stroke: KIND.hairCol || "#333", "stroke-width": 8, "stroke-linejoin": "round" }, face);
      els.mouth = S("path", { d: "", stroke: "#6b2f2a", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, face);
      // the mop (swiped with the comb; the beetles live in it)
      const hair = S("g", { "data-heal": "hair" }, f);
      els.hair = hair;
      const mop = S("g", {}, hair);
      els.mop = mop;
      S("path", { d: "M70 350 Q30 190 120 110 Q180 22 300 22 Q420 22 480 110 Q570 190 530 350 Q515 260 450 222 Q300 178 150 222 Q85 260 70 350 Z", fill: HAIR }, mop);
      [[112, 160, 62], [172, 82, 66], [262, 44, 66], [350, 44, 66], [432, 82, 66], [490, 160, 62], [78, 250, 48], [522, 250, 48], [72, 318, 34], [528, 318, 34]].forEach(([x, y, r]) => S("circle", { cx: x, cy: y, r, fill: HAIR }, mop));
      // curls for texture
      [[150, 130], [230, 90], [320, 110], [400, 80], [450, 150], [110, 230], [490, 230], [300, 170], [190, 190], [410, 195]].forEach(([x, y]) => S("path", { d: `M${x - 16} ${y} q8 -16 16 0 q8 16 16 0`, stroke: HAIR_D, "stroke-width": 5, fill: "none", "stroke-linecap": "round", opacity: 0.7 }, mop));
      S("path", { d: "M70 350 Q30 190 120 110 Q180 22 300 22 Q420 22 480 110 Q570 190 530 350", fill: "none", stroke: "transparent", "stroke-width": 30 }, mop); // a little more mop to grab
      // the beetles (inside the hair's group: a swipe that starts on one still combs)
      R.beetles.forEach((b, i) => {
        const [x, y] = SLOTS[b.slot];
        const g = S("g", { "data-heal": "beetle-" + i }, hair);
        S("circle", { cx: x, cy: y - 4, r: HIT, fill: "transparent" }, g);
        const art = beetleArt(g, x, y, b.colour);
        // a tuft of hair in front: they peek out
        S("path", { d: `M${x - 30} ${y + 26} q10 -16 20 -4 q10 -14 20 0 q10 -14 20 4 l0 10 l-60 0 Z`, fill: HAIR }, g);
        const e = { g, art, x, y, colour: b.colour, caught: false, i };
        els.beetles.push(e);
        ctx.on(g, "click", (ev) => {
          if (holding === "jar") {
            ev.stopPropagation();
            catchBeetle(i);
          } else if (!holding) {
            ev.stopPropagation();
            waggle(e);
          }
        });
      });
      // the foam (grows with the rubs)
      els.foam = S("g", { "pointer-events": "none" }, f);
      // the comb, while it's held
      els.comb = S("g", { "pointer-events": "none", opacity: 0 }, svg);
      S("rect", { x: -80, y: -16, width: 160, height: 24, rx: 10, fill: "#e0a84a", stroke: "#9a6a24", "stroke-width": 3 }, els.comb);
      for (let t = -72; t <= 72; t += 9) S("rect", { x: t - 2.5, y: 6, width: 5, height: 30, rx: 2, fill: "#e0a84a", stroke: "#9a6a24", "stroke-width": 1.2 }, els.comb);
      ctx.on(face, "click", () => tapHead("face"));
      ctx.on(hair, "click", () => tapHead("hair"));
      ctx.on(hair, "pointerdown", startSwipe);
      mouth("idle");
    }
    function drawJar() {
      const g = S("g", { "data-heal": "jar" }, jarG);
      els.jar = g;
      const src = sprite("bug-jar");
      const x0 = JAR.x - JAR.w / 2;
      const y0 = JAR.y - JAR.h / 2;
      if (src) S("image", { href: src, x: x0, y: y0, width: JAR.w, height: JAR.h, preserveAspectRatio: "xMidYMid meet" }, g);
      else {
        S("rect", { x: x0 + 10, y: y0 + 30, width: JAR.w - 20, height: JAR.h - 36, rx: 28, fill: "rgba(210,235,245,.7)", stroke: "#7fa8b8", "stroke-width": 5 }, g);
        S("rect", { x: x0 + 22, y: y0 + 8, width: JAR.w - 44, height: 30, rx: 8, fill: "#c9873e", stroke: "#8a5a2b", "stroke-width": 4 }, g);
      }
      els.inJar = S("g", { "pointer-events": "none" }, jarG);
    }
    function jarSpot(n) {
      // three to a row, from the bottom of the jar up
      const col = n % 3;
      const row = Math.floor(n / 3);
      return { x: JAR.x - 42 + col * 42 + (row % 2 ? 14 : 0), y: JAR.y + JAR.h / 2 - 40 - row * 32 };
    }
    function mouth(m) {
      const d = {
        idle: "M262 460 Q300 470 338 460",
        smile: "M252 450 Q300 498 348 450",
        grin: "M248 448 Q300 506 352 448 Z",
        ooh: "M286 462 Q300 440 314 462 Q300 484 286 462",
      }[m];
      els.mouth.setAttribute("d", d || "");
      els.mouth.setAttribute("fill", m === "ooh" || m === "grin" ? "#6b2f2a" : "none");
    }
    const lookAt = (dx, dy) => els.pupils.forEach((p) => p.setAttribute("transform", `translate(${dx},${dy})`));
    function waggle(e, delay = 0) {
      anim(e.art.brows, [{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-7px) rotate(-12deg)" }, { transform: "translateY(0) rotate(0)" }, { transform: "translateY(-7px) rotate(12deg)" }, { transform: "translateY(0) rotate(0)" }], { duration: 520, delay });
    }
    function jump(e, delay = 0) {
      anim(e.art.g, [{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-26px) scale(1.08,.95)", offset: 0.4 }, { transform: "translateY(0) scale(1.1,.85)", offset: 0.8 }, { transform: "translateY(0) scale(1)" }], { duration: 480, delay });
      waggle(e, delay + 120);
    }

    /* ---- the dishes (the host's sidebar tray) ---- */
    const useOf = (i) => {
      const t = ctx.tray[i];
      return t && !t.wrong ? USE[itemBase(t.id)] || null : null;
    };
    const dishOf = (use) => ctx.tray.findIndex((t, i) => useOf(i) === use);
    const trayId = (use) => {
      const di = dishOf(use);
      return di >= 0 ? ctx.tray[di].id : use;
    };
    const rowsOf = (use) => R.rows.filter((r) => r.use === use).map((r) => r.id);
    function closeStep(use) {
      if (use === "comb" && st.strokes > 0) tick("comb");
      if (use === "jar" && st.catches.length) {
        tick("catch0");
        if (R.catches.length > 1 && runs(R, st.catches)[1].length) tick("catch1");
      }
      if (use === "shampoo" && st.rubs > 0) tick("shampoo");
      if (rowsOf(use).every((id) => ticked.has(id))) {
        used.add(use);
        const di = dishOf(use);
        if (di >= 0 && ctx.trayUI) ctx.trayUI.used(di);
      }
      // level 1: the next line comes when a step closes
      if (!R.list && used.has(use)) {
        const next = R.rows.find((r) => !shown.includes(r.id));
        if (next) reveal(next.id);
      }
    }
    function putDown() {
      if (!holding) return;
      closeStep(holding);
      holding = null;
      ctx.trayUI && ctx.trayUI.select(-1);
      els.comb.setAttribute("opacity", 0);
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
      putDown();
      holding = use;
      ctx.trayUI && ctx.trayUI.select(i);
      ctx.signal && ctx.signal("heal-hair-lift");
      // level 1: taking a dish early still shows its line (never which colour or how many beyond the line)
      if (!R.list) {
        const want = rowsOf(use)[0];
        R.rows.slice(0, R.rows.findIndex((r) => r.id === want) + 1).forEach((r) => reveal(r.id, r.id === want));
      } else if (ctx.card.now) ctx.card.now(rowsOf(use).find((id) => !ticked.has(id)) || rowsOf(use)[0]);
      if (use === "comb") {
        const p = toView(300, 20);
        els.comb.setAttribute("transform", `translate(${p.x} ${p.y})`);
        els.comb.setAttribute("opacity", 1);
      }
    }

    /* ---- play ---- */
    function toSvg(e) {
      const p = svg.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    }
    function startSwipe(e) {
      if (finished || holding !== "comb") return;
      e.preventDefault();
      lastAct = Date.now();
      stopHints();
      swipe = { x: e.clientX, y: e.clientY, done: false, p: toSvg(e) };
      try {
        svg.setPointerCapture(e.pointerId);
      } catch (_) {
        /* synthetic pointers */
      }
      els.comb.setAttribute("transform", `translate(${swipe.p.x} ${swipe.p.y - 20})`);
    }
    function moveSwipe(e) {
      if (!swipe) return;
      const p = toSvg(e);
      if (!swipe.done) els.comb.setAttribute("transform", `translate(${swipe.p.x + (p.x - swipe.p.x) * 0.5} ${p.y - 20})`);
      if (!swipe.done && Math.hypot(e.clientX - swipe.x, e.clientY - swipe.y) >= 60) {
        swipe.done = true;
        stroke(swipe.p, p);
      }
    }
    function endSwipe() {
      swipe = null;
    }
    function stroke(a, b) {
      st.strokes++;
      ctx.signal && ctx.signal("heal-hair-comb");
      ctx.sfx("whoosh");
      ctx.tally(trayId("comb"), st.strokes);
      // the comb slides on through the mop
      const top = toView(300, 30).y;
      const bot = toView(300, 215).y; // down to the hairline, never over the eyes
      const x = Math.max(toView(110, 0).x, Math.min(toView(490, 0).x, a.x));
      const down = b.y >= a.y;
      anim(els.comb, [{ transform: `translate(${x}px, ${down ? top : bot}px)` }, { transform: `translate(${x}px, ${down ? bot : top}px)`, offset: 0.7 }, { transform: `translate(${x}px, ${top}px)` }], { duration: 600, easing: "ease-in-out" });
      els.comb.setAttribute("transform", `translate(${x} ${top})`); // parked on top of the mop between strokes
      els.beetles.forEach((e, k) => !e.caught && jump(e, 40 + k * 35));
      anim(els.mop, [{ transform: "translateY(0)" }, { transform: "translateY(4px)" }, { transform: "translateY(0)" }], { duration: 400 });
      lookAt(0, -6);
      ctx.after(700, () => !finished && lookAt(0, 0));
      if (st.strokes === 1) {
        mood("giggle", 900);
        say(line("tickle"));
      } else if (ctx.rng() < 0.4) mood("giggle", 700);
    }
    function catchBeetle(i) {
      if (finished) return;
      const e = els.beetles[i];
      if (e.caught) return;
      lastAct = Date.now();
      stopHints();
      e.caught = true;
      const firstColour = st.catches[0];
      st.catches.push(e.colour);
      ctx.signal && ctx.signal("heal-hair-catch");
      ctx.tally(trayId("jar"), st.catches.length);
      // a colour change closes the first catch row (the step moved on; never a verdict)
      if (R.catches.length > 1 && firstColour && e.colour !== firstColour) tick("catch0");
      // the beetle leaves the hair at once (nothing flies over a finger's target); a copy waves and hops
      e.g.remove();
      const from = toView(e.x, e.y);
      const to = jarSpot(st.catches.length - 1);
      const fly = S("g", {}, fxG);
      const art = beetleArt(fly, 0, 0, e.colour, HEAD.s);
      fly.setAttribute("transform", `translate(${from.x} ${from.y})`);
      anim(art.brows, [{ transform: "rotate(0)" }, { transform: "translateY(-6px) rotate(-14deg)" }, { transform: "rotate(0)" }, { transform: "translateY(-6px) rotate(14deg)" }, { transform: "rotate(0)" }], { duration: 380 });
      const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 120 };
      anim(
        fly,
        [
          { transform: `translate(${from.x}px, ${from.y}px) scale(1)`, offset: 0 },
          { transform: `translate(${from.x}px, ${from.y}px) scale(1)`, offset: 0.35 },
          { transform: `translate(${mid.x}px, ${mid.y}px) scale(.8) rotate(-180deg)`, offset: 0.7 },
          { transform: `translate(${to.x}px, ${to.y}px) scale(.45) rotate(-360deg)`, offset: 1 },
        ],
        { duration: 900, easing: "ease-in-out", fill: "forwards" }
      );
      ctx.after(900, () => {
        fly.remove();
        beetleArt(els.inJar, to.x, to.y, e.colour, 0.45);
        anim(els.jar, [{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }, { transform: "translateY(0)" }], { duration: 240 });
      });
      ctx.sfx("pop");
      if (st.catches.length === 1) {
        bubble("Boing!", from.x, Math.max(40, from.y - 60));
        say(line("boing"));
      } else if (ctx.rng() < 0.3) say(line("wave"));
      mood("giggle", 700);
    }
    function tapHead(where) {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      if (holding === "shampoo") {
        st.rubs++;
        ctx.signal && ctx.signal("heal-hair-rub");
        ctx.tally(trayId("shampoo"), st.rubs);
        ctx.sfx("pop");
        for (let k = 0; k < 5; k++) {
          const x = 120 + ctx.rng() * 360;
          const y = 40 + ctx.rng() * 200;
          const b = S("circle", { cx: x, cy: y, r: 12 + ctx.rng() * 18, fill: "#fff", stroke: "#bfe3f2", "stroke-width": 3, opacity: 0.95 }, els.foam);
          anim(b, [{ transform: "scale(0)", transformOrigin: `${x}px ${y}px` }, { transform: "scale(1)", transformOrigin: `${x}px ${y}px` }], { duration: 260 });
        }
        const up = S("circle", { cx: 300 + (ctx.rng() - 0.5) * 300, cy: 40, r: 14, fill: "rgba(255,255,255,.7)", stroke: "#9fd3ea", "stroke-width": 3 }, els.foam);
        anim(up, [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-90px)", opacity: 0 }], { duration: 900, fill: "forwards" });
        ctx.after(900, () => up.remove());
        mood("giggle", 800);
        if (st.rubs === 1) {
          bubble("Hee hee!", toView(300, 0).x, toView(300, 520).y);
          say(line("bubbles"));
        }
      } else if (holding !== "comb" && where === "face") {
        mood("giggle", 500); // every tap answers
      }
    }
    function nextNeed() {
      for (const use of ["comb", "jar", "shampoo"]) if (rowsOf(use).length && !used.has(use)) return use;
      return null;
    }
    function onDone() {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      putDown();
      const need = nextNeed();
      if (need && doneTries < 1) {
        // not finished yet: the free throb shows what's left (never which beetles or how many)
        doneTries++;
        const di = dishOf(need);
        if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
        return;
      }
      finish();
    }
    function finish() {
      finished = true;
      els.comb.setAttribute("opacity", 0);
      const g = grade(R, st);
      g.forEach((r) => ctx.log({ type: r.right ? "right" : "wrong", rowId: r.id }));
      const want = R.catches.reduce((a, c) => a + c.n, 0);
      if (st.catches.length > want) ctx.log({ type: "extra", rowId: "catch0", detail: `${st.catches.length - want} more beetles` });
      const right = g.filter((r) => r.right).length;
      mouth("smile");
      ctx.patient.react && ctx.patient.react("happy", 0);
      els.beetles.forEach((e, k) => !e.caught && jump(e, k * 60));
      ctx.done({ right, total: g.length, hints: 0, words: R.words.map((w) => ({ kutchi: w.kutchi, english: w.english, audio: w.audio })) });
    }

    // the throbbing hint after 8 s of nothing: the row and its dish (never a beetle, never a count)
    function stopHints() {
      ctx.card.pulse(null, false);
      ctx.trayUI && ctx.trayUI.pulse(-1, false);
      svg.querySelectorAll(".hc-pulse").forEach((e) => e.classList.remove("hc-pulse"));
    }
    function throb() {
      if (finished) return;
      if (Date.now() - lastAct > 8000) {
        const r = R.rows.find((x) => !ticked.has(x.id) && shownOrList(x.id));
        if (r) ctx.card.pulse(r.id, true);
        const need = nextNeed();
        const di = need && holding !== need ? dishOf(need) : -1;
        if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
        else if (need === "comb" && holding === "comb") els.mop.classList.add("hc-pulse");
        else if (!need) doneBtn.classList.add("throb");
      }
      ctx.after(1000, throb);
    }

    const doneBtn = ctx.button("✓", onDone, "done");
    doneBtn.setAttribute("aria-label", "Done");
    ctx.trayUI && ctx.trayUI.onTap((i) => onDish(i));
    drawHead();
    drawJar();
    ctx.on(svg, "pointermove", moveSwipe);
    ctx.on(svg, "pointerup", endSwipe);
    ctx.on(svg, "pointercancel", endSwipe);
    ctx.on(svg, "click", () => (lastAct = Date.now()));

    /** Client-px centre and size of a [data-heal] thing (the hair: a spot high in the mop, for a comb stroke). */
    function where(key) {
      const rect = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, h: b.height };
      };
      if (key === "hair") {
        const r = rect(els.mop);
        const m = svg.getScreenCTM();
        const p = svg.createSVGPoint();
        const v = toView(300, 118); // between the beetles, high in the mop
        p.x = v.x;
        p.y = v.y;
        const c = p.matrixTransform(m);
        return { x: c.x, y: c.y, w: r.w, h: r.h };
      }
      if (key === "head") return rect(els.face);
      const m = /^beetle-(\d+)$/.exec(key);
      if (m) {
        const e = els.beetles[Number(m[1])];
        return e && !e.caught ? rect(e.g.querySelector("circle")) : null;
      }
      return rect(wrap.querySelector(`[data-heal="${key}"]`));
    }
    /** A play script for the generic browser player: fair, or with one slip (one stroke too many). */
    function script(slip) {
      const s = [];
      const hair = where("hair");
      const dy = Math.max(80, Math.min(hair.h * 0.45, 160));
      s.push({ dish: "comb" });
      for (let k = 0; k < R.comb + (slip ? 1 : 0); k++) {
        s.push({ drag: "hair", dx: 0, dy });
        s.push({ wait: "true", pause: k === 0 ? 0.7 : 0.25 }); // the first-time overlay takes a breath after the first stroke
      }
      s.push({ wait: `__heal.run.controller.expect().state.strokes === ${R.comb + (slip ? 1 : 0)}` });
      s.push({ shot: "comb" });
      s.push({ dish: "jar" });
      const taken = new Set();
      R.catches.forEach((c) => {
        for (let k = 0; k < c.n; k++) {
          const j = R.beetles.findIndex((b, bi) => b.colour === c.colour && !taken.has(bi));
          taken.add(j);
          s.push({ tap: "beetle-" + j });
        }
      });
      s.push({ wait: `__heal.run.controller.expect().state.catches.length === ${taken.size}`, pause: 1.0 });
      s.push({ shot: "jar" });
      if (R.shampoo) {
        s.push({ dish: "shampoo" });
        for (let k = 0; k < R.shampoo; k++) s.push({ tap: "head" });
        s.push({ shot: "foam" });
      }
      s.push({ done: true });
      return s;
    }

    return {
      async start() {
        // the card: one line at a time at level 1, one list from level 2
        if (R.list) ctx.card.setRows(R.rows.map(cardRow));
        else {
          ctx.card.setRows([]);
          reveal("comb", false);
        }
        // idle: the beetles fidget, the patient glances up
        const idle = () => {
          if (finished) return;
          const left = els.beetles.filter((e) => !e.caught);
          if (left.length && !swipe) waggle(pick(ctx.rng, left));
          ctx.after(1800 + ctx.rng() * 2200, idle);
        };
        ctx.after(1500, idle);
        lastAct = Date.now();
        throb();
        if (level === 1) {
          const dish = () => ctx.trayUI && ctx.trayUI.dishes()[dishOf("comb")];
          const hairRect = (f) => () => {
            const r = where("hair");
            return r ? [r.x - 30, r.y - 30 + f * Math.min(r.h * 0.45, 160), 60, 60] : null;
          };
          ctx.onboard([
            { spotlight: dish, ghost: { gesture: "tap" }, wait: "heal-hair-lift" },
            { spotlight: () => els.mop, ghost: { gesture: "swipe", from: hairRect(0), to: hairRect(1) }, wait: "heal-hair-comb" },
          ]);
        }
        await say(line("itchy"));
        if (R.list) await ctx.card.speak();
        else await say(rowOf("comb"));
        lastAct = Date.now();
      },
      destroy() {
        finished = true;
        if (speakers) speakers.patient = oldSpeaker;
        if (figLayer) figLayer.style.visibility = "";
        wrap.remove();
        css.remove();
      },
      where,
      /** For the browser test: what the game wants next, in client px, and a play script. */
      expect() {
        const beetles = els.beetles.map((e) => (e.caught ? null : where("beetle-" + e.i)));
        return {
          round: { comb: R.comb, catches: R.catches, shampoo: R.shampoo, beetles: R.beetles.map((b) => b.colour) },
          state: JSON.parse(JSON.stringify(st)),
          holding,
          ticked: [...ticked],
          finished,
          need: nextNeed(),
          dish: { comb: dishOf("comb"), jar: dishOf("jar"), shampoo: dishOf("shampoo") },
          hair: where("hair"),
          head: where("head"),
          jar: where("jar"),
          beetles,
          done: (() => {
            const b = doneBtn.getBoundingClientRect();
            return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, h: b.height };
          })(),
          script: script(false),
          slipScript: script(true),
        };
      },
    };
  }

  const def = {
    id: ID,
    part: "head",
    ailments: ["beetles"],
    items: ["comb", "bug-jar", "shampoo"],
    itemsFor: { beetles: ["comb", "bug-jar", "shampoo"] },
    gestures: ["tap", "swipe"],
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
