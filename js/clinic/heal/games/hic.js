/*
 * Clinic heal game `hic`: H15 Mouth: hic! (docs/modes/clinic-design.md,
 * "H15 Mouth: hic!", built on the quality pass rules Q1; contract
 * docs/clinic-heal-api.md).
 *
 * Ali laughed so much he has hiccups. The close-up: the patient's face and
 * shoulders (their own colours, from the figure's kind); every 2.5-4 s a
 * HIC!: the patient hops, a "hic!" bubble pops and the eyes cross for a
 * moment (ungraded comedy, until the end).
 *   *Trae [sips of] paani*: tap the cup dish (a glass appears by the mouth),
 *   then each tap on the glass is one sip (glug; the level drops).
 *   *[Hold your breath!] [Count to] char*: each tap on the puffed cheeks is
 *   one count; the cheeks swell and the patient says the number just tapped
 *   (a tally of what YOU did, never the target).
 *   The scare: tap the shoulder: *[Boo!]*, the patient jumps, the hiccups
 *   stop, silence, a big laugh (ungraded; it is also Done once every row
 *   has been worked).
 * Level 2: the glass starts empty: *Pela adh paani* (the paani dish, one tap
 * on the glass = half) or *Pela paani* (two taps = full); *ne poi {num}
 * [sips]* (a sip from an empty glass is a comic slurp and doesn't count).
 * Level 3: the drink and the count come as *Pela ... ne poi ...* in a random
 * order; the row that says *ne poi* is right only if its step came second.
 *
 * Gestures (every level, UX s12): tap only (tap the dish, tap the spot).
 * A row ticks when its step CLOSES (the next dish, the cheeks, the shoulder
 * or Done), never on a count.
 *
 * Levels are data: data/clinic/heal/hic.json. `makeRound` is pure and shared
 * by mount() and bot(), so the leak bot plays exactly the game's rows.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const ID = "hic";
  const nodeData = () => {
    const fs = require("fs");
    const path = require("path");
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", "data", "clinic", "heal", `${ID}.json`), "utf8"));
  };

  /* ---------------- pure ---------------- */
  const pick = (rng, a) => a[Math.floor(rng() * a.length) % a.length];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const low = (s) => s.charAt(0).toLowerCase() + s.slice(1);

  /** One round: the rows (the card) and the answers, from the level's data. */
  function makeRound(D, level, rng) {
    const lv = D.levels[String(level)] || D.levels["1"];
    const Wd = D.words;
    const sips = pick(rng, lv.sips);
    const hold = pick(rng, lv.hold);
    const fill = lv.fill ? (pick(rng, lv.fill) === "half" ? 1 : 2) : 0; // jug taps: 1 = adh (half), 2 = full
    const first = lv.order ? (rng() < 0.5 ? "drink" : "hold") : "drink";
    const numOf = (n) => D.numbers.find((x) => x.n === n);
    const sN = numOf(sips);
    const hN = numOf(hold);
    const sipW = sips === 1 ? Wd.sip.english : Wd.sips.english;
    const holdK = `[${Wd.hold.english}] [${Wd.count.english}] ${low(hN.kutchi)}`;
    const holdE = `${Wd.hold.english} ${Wd.count.english} ${hN.english}`;
    const pela = Wd.pela;
    const nepoi = Wd.nepoi;
    const fillK = (lead) => `${lead}${fill === 1 ? `${lead ? Wd.adh.kutchi : cap(Wd.adh.kutchi)} ${Wd.paani.kutchi}` : lead ? Wd.paani.kutchi : cap(Wd.paani.kutchi)}`;
    const fillE = fill === 1 ? "half a glass of water" : "a full glass of water";
    const rows = [];
    const words = [];
    if (!lv.fill) {
      // level 1: a full glass is already there
      rows.push({ id: "sips", kutchi: `${sN.kutchi} [${sipW} of] ${Wd.paani.kutchi}`, english: `${cap(sN.english)} ${sipW} of water`, who: "doctor", nepoi: false });
      rows.push({ id: "hold", kutchi: holdK, english: holdE, who: "doctor", nepoi: false });
    } else if (!lv.order) {
      rows.push({ id: "fill", kutchi: fillK(pela.kutchi + " "), english: `First, ${fillE}`, who: "doctor", nepoi: false });
      rows.push({ id: "sips", kutchi: `${nepoi.kutchi} ${low(sN.kutchi)} [${sipW}]`, english: `And then ${sN.english} ${sipW}`, who: "doctor", nepoi: false });
      rows.push({ id: "hold", kutchi: holdK, english: holdE, who: "doctor", nepoi: false });
    } else if (first === "drink") {
      rows.push({ id: "fill", kutchi: fillK(pela.kutchi + " "), english: `First, ${fillE}`, who: "doctor", nepoi: false });
      rows.push({ id: "sips", kutchi: `${sN.kutchi} [${sipW}]`, english: `${cap(sN.english)} ${sipW}`, who: "doctor", nepoi: false });
      rows.push({ id: "hold", kutchi: `${nepoi.kutchi} [${low(Wd.hold.english)}] [${low(Wd.count.english)}] ${low(hN.kutchi)}`, english: `And then ${low(holdE)}`, who: "doctor", nepoi: true });
    } else {
      rows.push({ id: "hold", kutchi: `${pela.kutchi} [${low(Wd.hold.english)}] [${low(Wd.count.english)}] ${low(hN.kutchi)}`, english: `First, ${low(holdE)}`, who: "doctor", nepoi: false });
      rows.push({ id: "fill", kutchi: fillK(nepoi.kutchi + " "), english: `And then ${fillE}`, who: "doctor", nepoi: true });
      rows.push({ id: "sips", kutchi: `${sN.kutchi} [${sipW}]`, english: `${cap(sN.english)} ${sipW}`, who: "doctor", nepoi: false });
    }
    words.push({ kutchi: low(sN.kutchi), english: sN.english });
    if (hN !== sN) words.push({ kutchi: low(hN.kutchi), english: hN.english });
    words.push({ kutchi: Wd.paani.kutchi, english: Wd.paani.english, audio: Wd.paani.audio });
    if (fill === 1) words.push({ kutchi: Wd.adh.kutchi, english: Wd.adh.english });
    if (lv.fill) words.push({ kutchi: low(pela.kutchi), english: pela.english }, { kutchi: low(nepoi.kutchi), english: nepoi.english });
    return {
      level: Number(level),
      sips,
      hold,
      fill,
      first: lv.order ? first : null,
      order: !!lv.order,
      full: !lv.fill, // level 1: the glass starts full
      options: { sips: lv.sips, hold: lv.hold, fill: lv.fill ? [1, 2] : null },
      list: !!lv.list,
      units: (D.glass && D.glass.units) || 8,
      half: (D.glass && D.glass.half) || 4,
      rows,
      words,
    };
  }

  /** A fresh play state. `drinkAt`/`holdAt`: the move number that started each step (the order). */
  const newState = () => ({ pours: 0, sips: 0, holds: 0, slurps: 0, drinkAt: null, holdAt: null, moves: 0 });

  /** Grade every row from what was done (pure). */
  function grade(R, st) {
    const second = (mine, theirs) => mine != null && theirs != null && mine > theirs;
    return R.rows.map((row) => {
      let right = false;
      if (row.id === "fill") right = st.pours === R.fill && (!row.nepoi || second(st.drinkAt, st.holdAt));
      else if (row.id === "sips") right = st.sips === R.sips && (!row.nepoi || second(st.drinkAt, st.holdAt));
      else if (row.id === "hold") right = st.holds === R.hold && (!row.nepoi || second(st.holdAt, st.drinkAt));
      return { id: row.id, right };
    });
  }

  const STRATEGIES = ["fair", "random", "best", "first", "max"];
  /**
   * The blind bot (pure): plays a round without the words.
   *   fair    understands every word (must win 100%)
   *   random  0-3 jug taps, 0-6 sips, 0-6 counts, any order
   *   best    the likeliest guess the screen allows: a count from the level's
   *           range for each row, one or two jug taps, either order
   *   first   one of everything, the drink first (the order the tray shows)
   *   max     the biggest option of each range, the drink first
   */
  function bot(level, rng, D) {
    D = D || nodeData();
    const R = makeRound(D, level, rng);
    const score = (st) => {
      const g = grade(R, st);
      const right = g.filter((r) => r.right).length;
      return { right, total: g.length, win: right === g.length, rows: g };
    };
    const play = (st, pours, sips, holds, drinkFirst) => {
      const drink = () => {
        if (pours || sips) st.drinkAt = ++st.moves;
        st.pours = pours;
        // an empty glass slurps: only what the glass holds counts
        const inGlass = R.full ? R.units : Math.min(R.units, pours * R.half);
        st.sips = Math.min(sips, inGlass);
      };
      const count = () => {
        if (holds) st.holdAt = ++st.moves;
        st.holds = holds;
      };
      if (drinkFirst) drink(), count();
      else count(), drink();
      return score(st);
    };
    return {
      rows: R.rows,
      round: R,
      strategies: STRATEGIES,
      solve(strategy = "best") {
        const st = newState();
        const O = R.options;
        if (strategy === "fair") return play(st, R.fill, R.sips, R.hold, R.first !== "hold");
        if (strategy === "random") return play(st, O.fill ? Math.floor(rng() * 4) : 0, Math.floor(rng() * 7), Math.floor(rng() * 7), rng() < 0.5);
        if (strategy === "first") return play(st, O.fill ? 1 : 0, 1, 1, true);
        if (strategy === "max") return play(st, O.fill ? 2 : 0, Math.max(...O.sips), Math.max(...O.hold), true);
        return play(st, O.fill ? pick(rng, O.fill) : 0, pick(rng, O.sips), pick(rng, O.hold), R.order ? rng() < 0.5 : true);
      },
      fair() {
        return this.solve("fair");
      },
    };
  }

  /* ---------------- the browser game ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  const CSS = `
.hc-hic{position:absolute;inset:0;z-index:5;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.hc-hic svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.hc-hic [data-heal]{cursor:pointer}
.hc-hic .hc-pulse{animation:hcHicPulse 1s ease-in-out infinite}
@keyframes hcHicPulse{0%,100%{opacity:1}50%{opacity:.4}}
.hc-hic .hc-bubble{font:800 30px/1 "Baloo 2",system-ui,sans-serif;fill:#3a2e28}
.hc-hic .hc-puff{transition:transform .25s cubic-bezier(.5,1.8,.5,1);transform-box:fill-box;transform-origin:center}
.hc-hic .hc-water{transition:y .3s,height .3s}
`;
  const SKIN_DEF = "#c99a74";
  const shade = (hex, k) => {
    const n = parseInt(String(hex).replace("#", ""), 16);
    if (isNaN(n)) return hex;
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
  };
  // the face, in its own box (0..580 x 0..640, shoulders at the bottom); the patient faces you
  const EYE = { y: 212, x: [205, 375], rx: 40, ry: 34 };
  const CHEEK = { y: 318, x: [168, 412] };
  const itemBase = (id) =>
    String(id || "")
      .replace(/^(care|tool|med)-/, "")
      .replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown|water)$/, "");
  const USE = { cup: "cup", glass: "cup", paani: "paani", jug: "paani" };

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
    let units = R.full ? R.units : 0; // what's in the glass
    const kindId = (ctx.patient && ctx.patient.kind) || "ali";
    const KIND = (W.Clinic && W.Clinic.Figure && W.Clinic.Figure.KINDS && W.Clinic.Figure.KINDS[kindId]) || {};
    const SKIN = KIND.skin || SKIN_DEF;
    const SKIN_D = shade(SKIN, 0.8);
    const CLOTHES = KIND.clothes || "#e07b39";

    const css = doc.createElement("style");
    css.textContent = CSS;
    stage.appendChild(css);
    const wrap = doc.createElement("div");
    wrap.className = "hc-hic";
    stage.appendChild(wrap);
    // the close-up replaces the whole-body figure for this game
    const figLayer = stage.querySelector(".cl-patient-layer");
    if (figLayer) figLayer.style.visibility = "hidden";

    // wide (the glass beside the face) or tall (the glass in front of the shoulder)
    const box = stage.getBoundingClientRect();
    const tall = box.height > box.width * 1.05;
    const VB = tall ? { w: 600, h: 730 } : { w: 1000, h: 520 };
    const FT = tall ? { x: 55, y: 30, s: 0.85 } : { x: 195, y: 8, s: 0.84 }; // the face box's place
    const GL = tall ? { x: 140, y: 600 } : { x: 790, y: 330 }; // the glass's centre (world)
    const toW = (x, y) => [FT.x + x * FT.s, FT.y + y * FT.s];
    const svg = S("svg", { viewBox: `0 0 ${VB.w} ${VB.h}`, preserveAspectRatio: "xMidYMid meet" }, wrap);
    const faceOuter = S("g", { transform: `translate(${FT.x} ${FT.y}) scale(${FT.s})` }, svg);
    const hop = S("g", { "pointer-events": "none", style: "transform-box:view-box" }, faceOuter);
    const hits = S("g", {}, faceOuter);
    const glassG = S("g", { "pointer-events": "none", opacity: 0 }, svg);
    const jugG = S("g", { "pointer-events": "none", opacity: 0 }, svg);
    const glassHitG = S("g", { "data-heal": "glass", style: "display:none" }, svg);
    const fxG = S("g", { "pointer-events": "none" }, svg);

    let holding = null; // "cup" | "paani"
    let holdOpen = false; // the cheeks are puffed (the count is going)
    let finished = false;
    let scaring = false;
    let hicOn = false; // the hiccups are running
    let lastHic = 0;
    let lastAct = Date.now();
    let glassShown = false;
    const ticked = new Set();
    const shown = [];
    const said = new Set();
    const els = {};

    // the patient's voice bubble comes from this face while the close-up is up
    const speakers = Kit && Kit.Voice && Kit.Voice.speakers;
    const oldSpeaker = speakers && speakers.patient;
    if (speakers) speakers.patient = () => els.head || wrap;

    const line = (id) => Object.assign({}, (D.lines || {})[id] || { english: id });
    const say = (l) => ctx.say(l, { who: l.who || "doctor" });
    const sayOnce = (id) => {
      if (said.has(id)) return;
      said.add(id);
      say(line(id));
    };
    const rowOf = (id) => R.rows.find((r) => r.id === id);
    const cardRow = (r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, audio: r.audio, who: r.who });
    const tick = (id) => {
      if (ticked.has(id) || !rowOf(id)) return;
      ticked.add(id);
      ctx.card.tick(id);
    };
    const reveal = (id, speak = true) => {
      if (shown.includes(id)) return;
      shown.push(id);
      if (!R.list) ctx.card.addRow ? ctx.card.addRow(cardRow(rowOf(id))) : ctx.card.setRows(R.rows.filter((r) => shown.includes(r.id)).map(cardRow));
      ctx.card.now && ctx.card.now(id);
      if (speak) say(rowOf(id));
    };
    const isShown = (id) => R.list || shown.includes(id);

    /* ---- drawing ---- */
    const slots = {};
    function bubble(text, x, y, big, slot) {
      if (slot && slots[slot]) slots[slot].remove(); // one bubble per spot: a new count replaces the last
      const g = S("g", {}, fxG);
      if (slot) slots[slot] = g;
      const w = Math.max(110, text.length * (big ? 24 : 17) + 34);
      const hgt = big ? 76 : 56;
      S("rect", { x: x - w / 2, y: y - hgt / 2 - 4, width: w, height: hgt, rx: hgt / 2, fill: "#fff", stroke: "#3a2e28", "stroke-width": 3 }, g);
      const t = S("text", { x, y: y + (big ? 12 : 6), "text-anchor": "middle", class: "hc-bubble" }, g);
      if (big) t.setAttribute("style", "font-size:44px");
      t.textContent = text;
      anim(g, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)", offset: 0.15 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 1500 });
      ctx.after(1500, () => g.remove());
    }
    function drawFace() {
      const f = hop;
      const hair = KIND.hairCol || "#2b1d16";
      // the shoulders and the neck (the shirt is the patient's own colour)
      S("path", { d: "M-10 660 L-10 575 Q0 495 120 482 L460 482 Q580 495 590 575 L590 660 Z", fill: CLOTHES, stroke: shade(CLOTHES, 0.75), "stroke-width": 5 }, f);
      S("rect", { x: 235, y: 420, width: 110, height: 80, rx: 30, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      S("path", { d: "M228 486 Q290 530 352 486", stroke: shade(CLOTHES, 0.7), "stroke-width": 7, fill: "none" }, f);
      els.shoulderMark = S("ellipse", { cx: 490, cy: 540, rx: 80, ry: 44, fill: "#ffe98a", opacity: 0 }, f);
      if (KIND.hair === "long") S("path", { d: "M70 200 Q60 470 150 470 L430 470 Q520 470 510 200 Z", fill: hair }, f);
      S("ellipse", { cx: 88, cy: 255, rx: 34, ry: 52, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      S("ellipse", { cx: 492, cy: 255, rx: 34, ry: 52, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, f);
      els.head = S("ellipse", { cx: 290, cy: 250, rx: 205, ry: 215, fill: SKIN, stroke: SKIN_D, "stroke-width": 5 }, f);
      if (KIND.hair === "bunches") [[70, 110], [510, 110]].forEach(([x, y]) => S("circle", { cx: x, cy: y, r: 52, fill: hair }, f));
      if (KIND.hair === "bun") S("circle", { cx: 290, cy: 30, r: 46, fill: hair }, f);
      if (KIND.hair === "bald") {
        S("path", { d: "M92 230 Q86 150 118 118 L128 230 Z M488 230 Q494 150 462 118 L452 230 Z", fill: hair }, f);
        S("path", { d: "M180 60 Q290 30 400 60", stroke: "rgba(255,255,255,.35)", "stroke-width": 16, fill: "none", "stroke-linecap": "round" }, f);
      } else if (KIND.hair !== "none") S("path", { d: "M95 205 Q110 30 290 33 Q470 30 485 205 Q440 100 290 97 Q140 100 95 205 Z", fill: hair }, f);
      if (KIND.cap) S("path", { d: "M150 78 Q290 -8 430 78 Q290 50 150 78 Z", fill: "#f4f1ea", stroke: "#cfc8b8", "stroke-width": 4 }, f);
      // eyes (they cross on every hic)
      els.pupils = [];
      els.lids = [];
      EYE.x.forEach((x) => {
        S("ellipse", { cx: x, cy: EYE.y, rx: EYE.rx, ry: EYE.ry, fill: "#fff", stroke: "#6d4c3d", "stroke-width": 4 }, f);
        const p = S("g", {}, f);
        S("circle", { cx: x, cy: EYE.y, r: 17, fill: "#6b4a2b" }, p);
        S("circle", { cx: x, cy: EYE.y, r: 8, fill: "#1c1410" }, p);
        S("circle", { cx: x + 5, cy: EYE.y - 6, r: 4, fill: "#fff" }, p);
        els.pupils.push(p);
        const brow = KIND.hair === "bald" || KIND.hairCol === "#e8e6e1" ? "#bdb8ae" : "#3b2a22";
        S("path", { d: `M${x - 48} ${EYE.y - 52} Q${x} ${EYE.y - 78} ${x + 48} ${EYE.y - 52}`, stroke: brow, "stroke-width": 10, fill: "none", "stroke-linecap": "round" }, f);
      });
      if (KIND.glasses) {
        const gl = S("g", {}, f);
        [218, 362].forEach((x) => S("circle", { cx: x, cy: 104, r: 36, fill: "rgba(255,255,255,.35)", stroke: "#3a3a44", "stroke-width": 6 }, gl));
        S("path", { d: "M254 104 Q290 90 326 104", stroke: "#3a3a44", "stroke-width": 6, fill: "none" }, gl);
      }
      // the cheeks: they puff up with every count
      els.cheeks = S("g", {}, f);
      els.puffs = CHEEK.x.map((x) => {
        const g = S("g", { class: "hc-puff" }, els.cheeks);
        S("circle", { cx: x, cy: CHEEK.y, r: 44, fill: SKIN, stroke: SKIN_D, "stroke-width": 3, opacity: 0, class: "hc-bulge" }, g);
        S("circle", { cx: x, cy: CHEEK.y, r: 28, fill: "#e59a8a", opacity: 0.5 }, g);
        return g;
      });
      // nose, moustache, mouth
      S("path", { d: "M290 250 Q272 310 282 316 Q296 322 306 314", stroke: SKIN_D, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, f);
      if (KIND.moustache) S("path", { d: "M222 350 Q290 318 358 350 Q290 336 222 350 Z", fill: KIND.hairCol || "#333", stroke: KIND.hairCol || "#333", "stroke-width": 8, "stroke-linejoin": "round" }, f);
      els.mouth = S("path", { d: "", stroke: "#6b2f2a", "stroke-width": 7, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, f);
      mouth("smile");
      // the targets: fixed (they don't hop with the face), generous
      els.cheeksHit = S("ellipse", { cx: 290, cy: 335, rx: 205, ry: 82, fill: "transparent" }, S("g", { "data-heal": "cheeks" }, hits));
      ctx.on(els.cheeksHit.parentNode, "click", tapCheeks);
      els.shoulderHit = S("rect", { x: 395, y: 482, width: 190, height: 140, rx: 30, fill: "transparent" }, S("g", { "data-heal": "shoulder" }, hits));
      ctx.on(els.shoulderHit.parentNode, "click", tapShoulder);
    }
    function mouth(m) {
      const d = {
        smile: "M240 378 Q290 412 340 378",
        o: "M272 382 Q290 356 308 382 Q290 408 272 382",
        puff: "M262 386 Q290 380 318 386",
        laugh: "M226 366 Q290 452 354 366 Z",
        slurp: "M262 386 Q290 372 318 386 Q290 400 262 386",
        eek: "M258 370 Q290 346 322 370 Q322 420 290 420 Q258 420 258 370 Z",
      }[m];
      els.mouth.setAttribute("d", d || "");
      els.mouth.setAttribute("fill", m === "o" || m === "laugh" || m === "eek" ? "#6b2f2a" : "none");
    }
    const restMouth = () => !finished && !scaring && mouth(holdOpen ? "puff" : "smile");
    const lookPupils = (mode) =>
      els.pupils.forEach((p, i) => {
        const dx = mode === "cross" ? (i === 0 ? 14 : -14) : 0;
        const dy = mode === "cross" ? 4 : mode === "up" ? -10 : 0;
        p.setAttribute("transform", `translate(${dx},${dy})`);
      });
    function puff() {
      const n = holdOpen ? Math.min(st.holds, 7) : 0;
      els.puffs.forEach((g) => {
        g.style.transform = `scale(${1 + n * 0.09})`;
        g.querySelector(".hc-bulge").setAttribute("opacity", n ? 1 : 0);
      });
    }
    function drawGlass() {
      // a clear glass, drawn (its water level shows every sip)
      const { x, y } = GL;
      const gw = 92;
      const gh = 150;
      els.glassTilt = S("g", { style: `transform-box:view-box;transform-origin:${x}px ${y + gh / 2}px` }, glassG);
      const g = els.glassTilt;
      const clipId = `hc-hic-glass-${Math.floor(Math.random() * 1e9)}`;
      const shape = `M${x - gw / 2} ${y - gh / 2} L${x + gw / 2} ${y - gh / 2} L${x + gw / 2 - 12} ${y + gh / 2} L${x - gw / 2 + 12} ${y + gh / 2} Z`;
      S("path", { d: shape }, S("clipPath", { id: clipId }, g));
      S("path", { d: shape, fill: "rgba(230,244,250,.55)" }, g);
      const inner = S("g", { "clip-path": `url(#${clipId})` }, g);
      els.water = S("rect", { x: x - gw / 2, y: y + gh / 2, width: gw, height: 0, fill: "#5aa8d8", opacity: 0.8, class: "hc-water" }, inner);
      els.glassGeom = { top: y - gh / 2 + 10, bottom: y + gh / 2, gw, gh };
      S("path", { d: shape, fill: "none", stroke: "#6d8c9a", "stroke-width": 5, "stroke-linejoin": "round" }, g);
      S("line", { x1: x - gw / 2 + 14, y1: y - gh / 2 + 16, x2: x - gw / 2 + 22, y2: y + gh / 2 - 16, stroke: "rgba(255,255,255,.8)", "stroke-width": 6, "stroke-linecap": "round" }, g);
      // the half line (a faint band)
      const hy = y + gh / 2 - (gh - 10) * (R.half / R.units);
      S("line", { x1: x - gw / 2 + 8, y1: hy, x2: x + gw / 2 - 8, y2: hy, stroke: "#6d8c9a", "stroke-width": 2, "stroke-dasharray": "6 6", opacity: 0.6 }, g);
      // the hit area: fixed and generous
      els.glassHit = S("rect", { x: x - gw / 2 - 30, y: y - gh / 2 - 30, width: gw + 60, height: gh + 60, rx: 24, fill: "transparent" }, glassHitG);
      ctx.on(glassHitG, "click", tapGlass);
      // the jug (shown while the paani dish is up), above and to the side of the glass
      const jsrc = sprite("jug-water");
      const jx = tall ? x + 140 : x + 110;
      const jy = y - gh / 2 - (tall ? 55 : 70);
      els.jugTilt = S("g", { style: `transform-box:view-box;transform-origin:${jx}px ${jy}px` }, jugG);
      if (jsrc) S("image", { href: jsrc, x: jx - 55, y: jy - 55, width: 110, height: 112 }, els.jugTilt);
      else S("path", { d: `M${jx - 34} ${jy - 44} L${jx + 30} ${jy - 44} L${jx + 36} ${jy + 46} L${jx - 40} ${jy + 46} Z`, fill: "#8fc6e6", stroke: "#5a4a3a", "stroke-width": 4 }, els.jugTilt);
      els.jugAt = { x: jx, y: jy };
      level_();
    }
    function level_() {
      const G = els.glassGeom;
      const h = (G.bottom - G.top) * (Math.max(0, units) / R.units);
      els.water.setAttribute("y", G.bottom - h);
      els.water.setAttribute("height", h);
    }
    function showGlass() {
      if (glassShown) return;
      glassShown = true;
      glassG.setAttribute("opacity", 1);
      glassHitG.style.display = "";
      anim(glassG, [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300 });
    }
    function splash(x, y) {
      for (let i = 0; i < 7; i++) {
        const d = S("circle", { cx: x, cy: y, r: 6 + Math.random() * 5, fill: "#5aa8d8", opacity: 0.9 }, fxG);
        const dx = (Math.random() - 0.5) * 160;
        const dy = -40 - Math.random() * 70;
        anim(d, [{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${dx}px,${dy}px)`, opacity: 1, offset: 0.5 }, { transform: `translate(${dx * 1.3}px,${dy + 90}px)`, opacity: 0 }], { duration: 700, easing: "ease-out" });
        ctx.after(720, () => d.remove());
      }
    }

    /* ---- the hiccups (ungraded comedy, all game long) ---- */
    function hic() {
      if (finished || scaring || !hicOn) return;
      lastHic = Date.now();
      ctx.sfx("pop");
      anim(hop, [{ transform: "translateY(0)" }, { transform: "translateY(-26px)" }, { transform: "translateY(0)" }, { transform: "translateY(-6px)" }, { transform: "translateY(0)" }], { duration: 380, easing: "ease-out" });
      lookPupils("cross");
      mouth("o");
      ctx.after(420, () => {
        lookPupils();
        restMouth();
      });
      const [bx, by] = toW(500, 60);
      bubble("hic!", bx, by, false, "hic");
      if (holding === "cup" && glassShown && Date.now() - lastSip < 500) splash(GL.x, GL.y - 70);
    }
    function hicLoop() {
      if (finished) return;
      hic();
      ctx.after(2500 + Math.random() * 1500, hicLoop);
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
    function closeStep(use) {
      let done = false;
      if (use === "paani" && st.pours) (done = true), tick("fill");
      if (use === "cup" && st.sips) {
        done = true;
        tick("sips");
        if (!R.list) reveal("hold");
      }
      if (done) {
        const di = dishOf(use);
        if (di >= 0 && ctx.trayUI) ctx.trayUI.used(di);
      }
    }
    function closeHold() {
      if (!holdOpen) return;
      holdOpen = false;
      tick("hold");
      // the breath comes out: whoosh
      ctx.sfx("whoosh");
      const [bx, by] = toW(290, 420);
      bubble("pfff!", bx + 90, by, false, "glug");
      puff();
      restMouth();
    }
    function putDown() {
      if (!holding) return;
      closeStep(holding);
      holding = null;
      ctx.trayUI && ctx.trayUI.select(-1);
      jugG.setAttribute("opacity", 0);
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
      closeHold();
      holding = use;
      ctx.trayUI && ctx.trayUI.select(i);
      ctx.signal && ctx.signal("heal-hic-lift");
      showGlass();
      jugG.setAttribute("opacity", use === "paani" ? 1 : 0);
    }

    /* ---- play ---- */
    let lastSip = 0;
    function tapGlass() {
      if (finished || scaring) return;
      lastAct = Date.now();
      stopHints();
      if (holding === "cup") {
        ctx.signal && ctx.signal("heal-hic-sip");
        if (units > 0) {
          units--;
          st.sips++;
          if (st.drinkAt == null) st.drinkAt = ++st.moves;
          lastSip = Date.now();
          ctx.tally(trayId("cup"), st.sips);
          ctx.sfx("pop");
          level_();
          anim(els.glassTilt, [{ transform: "rotate(0)" }, { transform: `rotate(${tall ? 0 : -18}deg) translateY(-10px)` }, { transform: "rotate(0)" }], { duration: 360 });
          mouth("o");
          ctx.after(360, restMouth);
          const [bx, by] = toW(430, 430);
          bubble("glug!", tall ? bx : bx + 60, tall ? by + 40 : by, false, "glug");
          // a hiccup right on a sip: splash (comic)
          if (Date.now() - lastHic < 500) splash(GL.x, GL.y - 70);
        } else {
          st.slurps++;
          ctx.log({ type: "extra", rowId: "sips", detail: "slurped an empty glass" });
          mouth("slurp");
          ctx.after(600, restMouth);
          bubble("slurrrp!", GL.x, GL.y - 110, false, "glug");
          sayOnce("slurp");
        }
      } else if (holding === "paani") {
        const over = units >= R.units;
        st.pours++;
        if (R.full) ctx.log({ type: "extra", detail: "topped up the glass" });
        else if (st.drinkAt == null) st.drinkAt = ++st.moves;
        units = Math.min(R.units, units + R.half);
        ctx.tally(trayId("paani"), st.pours);
        ctx.sfx("whoosh");
        anim(els.jugTilt, [{ transform: "rotate(0)" }, { transform: "rotate(-35deg)" }, { transform: "rotate(-35deg)", offset: 0.7 }, { transform: "rotate(0)" }], { duration: 650 });
        const J = els.jugAt;
        const stream = S("path", { d: `M${J.x - 50} ${J.y - 10} Q${GL.x + 10} ${J.y - 10} ${GL.x} ${GL.y}`, stroke: "#5aa8d8", "stroke-width": 12, fill: "none", "stroke-linecap": "round", opacity: 0 }, fxG);
        anim(stream, [{ opacity: 0 }, { opacity: 0.85, offset: 0.3 }, { opacity: 0.85, offset: 0.7 }, { opacity: 0 }], { duration: 650 });
        ctx.after(650, () => stream.remove());
        ctx.after(250, level_);
        if (over) {
          ctx.after(300, () => splash(GL.x, GL.y - 75));
          sayOnce("splash");
        }
      } else {
        // a bare tap: the glass wobbles (every tap answers)
        anim(els.glassTilt, [{ transform: "rotate(0)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(6deg)" }, { transform: "rotate(0)" }], { duration: 300 });
      }
    }
    function tapCheeks() {
      if (finished || scaring) return;
      lastAct = Date.now();
      stopHints();
      if (!isShown("hold")) {
        // level 1, before the count is asked for: putting the glass down asks for it
        if (holding && st.sips) putDown();
        else {
          anim(els.cheeks, [{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 260 });
          mouth("o");
          ctx.after(300, restMouth);
        }
        return;
      }
      putDown();
      holdOpen = true;
      st.holds++;
      if (st.holdAt == null) st.holdAt = ++st.moves;
      ctx.sfx("pop");
      puff();
      mouth("puff");
      // the patient counts what you tapped (a tally, never the target)
      const num = D.numbers.find((x) => x.n === st.holds);
      const l = num ? { kutchi: low(num.kutchi), english: num.english, who: "patient" } : line("mmph");
      say(l);
      const [bx, by] = toW(60, 330);
      bubble(num ? low(num.kutchi) + "!" : "mmph!", bx, by, false, "count");
    }
    function allWorked() {
      return !nextNeed() && isShown("hold");
    }
    function tapShoulder() {
      if (finished || scaring) return;
      lastAct = Date.now();
      stopHints();
      putDown();
      closeHold();
      scaring = true;
      const complete = allWorked();
      ctx.sfx("whoosh");
      say(line("boo"));
      const [bx, by] = toW(290, 20);
      if (slots.hic) slots.hic.remove();
      bubble("BOO!", bx, by + 20, true, "hic");
      anim(hop, [{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-70px) scale(1.04)" }, { transform: "translateY(0) scale(1)" }, { transform: "translateY(-14px)" }, { transform: "translateY(0)" }], { duration: 650, easing: "ease-out" });
      mouth("eek");
      lookPupils("up");
      ctx.after(500, () => say(line("eek")));
      // silence, then a big laugh
      ctx.after(1500, () => {
        lookPupils();
        mouth("laugh");
        say(line("laugh"));
        const [lx, ly] = toW(290, 20);
        bubble("ha ha ha!", lx, ly + 20, false, "hic");
      });
      if (complete) {
        hicOn = false;
        ctx.after(2300, finish);
      } else {
        // not done yet: the hiccups come back (comic)
        ctx.after(3200, () => {
          scaring = false;
          sayOnce("back");
          restMouth();
          hic();
          nudge();
        });
      }
    }
    function nextNeed() {
      if (R.fill && !st.pours && dishOf("paani") >= 0) return "paani";
      if (!st.sips && dishOf("cup") >= 0) return "cup";
      if (!st.holds) return "cheeks";
      return null;
    }
    function nudge() {
      const need = nextNeed();
      if (need === "cheeks") els.cheeks.classList.add("hc-pulse");
      else if (need && holding !== need) {
        const di = dishOf(need);
        if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
      }
      return need;
    }
    function onDone() {
      if (finished || scaring) return;
      lastAct = Date.now();
      stopHints();
      putDown();
      closeHold();
      if (nudge()) return; // not finished: the free throb shows what's left (never how many)
      finish();
    }
    function finish() {
      if (finished) return;
      putDown();
      closeHold();
      finished = true;
      hicOn = false;
      const g = grade(R, st);
      g.forEach((r) => ctx.log({ type: r.right ? "right" : "wrong", rowId: r.id }));
      const right = g.filter((r) => r.right).length;
      mouth("smile");
      lookPupils();
      ctx.patient && ctx.patient.react && ctx.patient.react("happy", 0);
      ctx.done({ right, total: g.length, hints: 0, words: R.words.map((w) => ({ kutchi: w.kutchi, english: w.english, audio: w.audio })) });
    }

    // the throbbing hint after 8 s of nothing: the row and its dish (never how many)
    function stopHints() {
      ctx.card.pulse(null, false);
      ctx.trayUI && ctx.trayUI.pulse(-1, false);
      svg.querySelectorAll(".hc-pulse").forEach((e) => e.classList.remove("hc-pulse"));
      if (els.shoulderMark) els.shoulderMark.setAttribute("opacity", 0);
      doneBtn.classList.remove("throb");
    }
    function throb() {
      if (finished) return;
      if (Date.now() - lastAct > 8000 && !scaring) {
        const r = R.rows.find((x) => !ticked.has(x.id) && isShown(x.id));
        if (r) ctx.card.pulse(r.id, true);
        const need = nextNeed();
        if (need) {
          if (!(holding && need === holding)) nudge();
        } else {
          // everything's worked: Done throbs, and so does the shoulder (the scare)
          doneBtn.classList.add("throb");
          els.shoulderMark.setAttribute("opacity", 0.35);
          els.shoulderMark.classList.add("hc-pulse");
        }
      }
      ctx.after(1000, throb);
    }

    const doneBtn = ctx.button("✓", onDone, "done");
    doneBtn.setAttribute("aria-label", "Done");
    ctx.trayUI && ctx.trayUI.onTap((i) => onDish(i));
    drawFace();
    drawGlass();
    ctx.on(svg, "click", () => (lastAct = Date.now()));

    const rect = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, h: b.height };
    };
    const HITS = { glass: () => els.glassHit, cheeks: () => els.cheeksHit, shoulder: () => els.shoulderHit };

    return {
      async start() {
        // the card: one line at a time at level 1, one list from level 2
        if (R.list) ctx.card.setRows(R.rows.map(cardRow));
        else {
          ctx.card.setRows([]);
          reveal("sips", false);
        }
        hicOn = true;
        ctx.after(1200, hicLoop);
        lastAct = Date.now();
        throb();
        if (level === 1) {
          const dish = () => ctx.trayUI && ctx.trayUI.dishes()[dishOf("cup")];
          ctx.onboard([
            { spotlight: dish, ghost: { gesture: "tap" }, wait: "heal-hic-lift" },
            { spotlight: () => els.glassHit, ghost: { gesture: "tap" }, wait: "heal-hic-sip" },
          ]);
        }
        if (R.list) await ctx.card.speak();
        else await say(rowOf("sips"));
        lastAct = Date.now();
      },
      destroy() {
        finished = true;
        if (speakers) speakers.patient = oldSpeaker;
        if (figLayer) figLayer.style.visibility = "";
        wrap.remove();
        css.remove();
      },
      /** For the browser test: the client-px centre of a [data-heal] target. */
      where(key) {
        const f = HITS[key];
        return rect(f ? f() : svg.querySelector(`[data-heal="${key}"]`));
      },
      /** For the browser test: what the game wants next, in client px, and a fair and a one-slip script. */
      expect() {
        const rep = (step, n) => Array.from({ length: Math.max(0, n) }, () => Object.assign({}, step));
        const X = "__heal.run.controller.expect()";
        const build = (slip) => {
          const holds = R.hold + (slip ? 1 : 0);
          const drink = [];
          if (R.fill) drink.push({ dish: "paani" }, ...rep({ tap: "glass" }, R.fill), { shot: "fill" });
          drink.push({ dish: "cup" }, ...rep({ tap: "glass" }, R.sips), { shot: "sips" });
          const count = [...rep({ tap: "cheeks" }, holds), { shot: "hold" }];
          if (!R.list) {
            // level 1: Done puts the glass down and asks for the count
            return [...drink, { done: true }, { wait: `${X}.shown.includes('hold')`, pause: 0.4 }, ...count, { tap: "shoulder" }, { shot: "boo" }];
          }
          const body = R.first === "hold" ? [...count, ...drink] : [...drink, ...count];
          return [{ wait: `${X}.ready`, pause: 0.2 }, ...body, { tap: "shoulder" }, { shot: "boo" }];
        };
        return {
          round: { sips: R.sips, hold: R.hold, fill: R.fill, first: R.first, rows: R.rows.map((r) => r.id) },
          state: JSON.parse(JSON.stringify(st)),
          units,
          holding,
          holdOpen,
          shown: R.list ? R.rows.map((r) => r.id) : shown.slice(),
          ticked: [...ticked],
          ready: true,
          finished,
          need: nextNeed(),
          dish: { cup: dishOf("cup"), paani: dishOf("paani") },
          glass: glassShown ? rect(els.glassHit) : null,
          cheeks: rect(els.cheeksHit),
          shoulder: rect(els.shoulderHit),
          done: rect(doneBtn),
          script: build(false),
          slipScript: build(true),
        };
      },
    };
  }

  const def = {
    id: ID,
    part: "mouth",
    ailments: ["hiccups"],
    items: ["cup", "paani"],
    itemsFor: { hiccups: ["cup", "paani"] },
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
