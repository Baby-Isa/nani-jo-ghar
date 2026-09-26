/*
 * Clinic heal game `foot`: H13 The foot bath (docs/modes/clinic-design.md,
 * the quality pass Q4; contract docs/clinic-heal-api.md).
 *
 * The patient danced all night at the wedding. *Pela [EN: hot] paani*: tap
 * the paani dish, then tap the jug the doctor named (hot, steaming; or
 * cold, with ice: they are the same jug otherwise): a tap pours. *Ne poi ba
 * chamcha loon* (level 2+): the loon dish, one tap on the tub per spoon.
 * Tap the feet: in they go (*[EN: ahh]*, or *[EN: brrr]* and a shiver).
 * Then WHICH TOE: *wadho / nindho [EN: toe]*, and at level 3 the patient's
 * own side too (*[EN: my left,] nindho*): ten toes with little faces, where
 * size and side are both needed to pick one. Every tapped toe wiggles alone
 * and the patient giggles (a reaction, never a verdict). Last, the thorn:
 * the patient names the toe; the tweezers PLUCK (drag it down and out);
 * *ne poi [EN: plaster]* on that toe.
 *
 * Gestures (every level, UX s12): tap (the dish, the jug, the tub, the toe)
 * + pluck (drag). A row ticks when its step CLOSES (the next dish, the
 * feet, Done; a toe call and a pluck close on the pick), never on a count.
 *
 * Levels are data: data/clinic/heal/foot.json. `makeRound` is pure and
 * shared by mount() and bot().
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const ID = "foot";
  const nodeData = () => {
    const fs = require("fs");
    const path = require("path");
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", "data", "clinic", "heal", `${ID}.json`), "utf8"));
  };

  /* ---------------- pure ---------------- */
  const pick = (rng, a) => a[Math.floor(rng() * a.length) % a.length];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const SIDES = ["left", "right"];
  const BIG = 0;
  const LITTLE = 4; // toes are numbered big (0) to little (4)
  const key = (side, k) => `${side}-${k}`;

  function makeRound(D, level, rng, side) {
    const lv = D.levels[String(level)] || D.levels["1"];
    const W = D.words;
    const temp = rng() < 0.5 ? "hot" : "cold";
    const rows = [];
    const words = [];
    const list = !!lv.list;
    rows.push({ id: "water", kutchi: `${list ? W.pela.kutchi + " " : ""}[${list ? W[temp].english : cap(W[temp].english)}] ${W.paani.kutchi}`, english: `${list ? "First, " : ""}${W[temp].english} water`, who: "doctor" });
    words.push({ kutchi: W.paani.kutchi, english: W.paani.english, audio: W.paani.audio });
    let salt = null;
    if (lv.salt) {
      salt = pick(rng, lv.salt);
      const num = D.numbers.find((n) => n.n === salt);
      rows.push({ id: "salt", kutchi: `${W.nepoi.kutchi} ${num.kutchi.toLowerCase()} ${num.spoon} ${W.loon.kutchi}`, english: `And then ${num.english} spoon${salt > 1 ? "s" : ""} of salt`, who: "doctor" });
      words.push({ kutchi: num.kutchi.toLowerCase(), english: num.english }, { kutchi: num.spoon, english: salt > 1 ? "spoons" : "spoon" }, { kutchi: W.loon.kutchi, english: W.loon.english, audio: W.loon.audio });
    }
    const sizeWord = (k) => (k === BIG ? W.big : W.small);
    const sideLine = (s) => D.lines["side-" + s];
    // the toe calls: by size (either foot) at levels 1-2, size x side at level 3 (in the patient's voice)
    const calls = [];
    for (let i = 0; i < lv.calls; i++) {
      // independent calls (a rule like "never the same twice" would be a pattern a blind player could use)
      const k = rng() < 0.5 ? BIG : LITTLE;
      const s = lv.side ? pick(rng, SIDES) : null;
      calls.push({ k, side: s });
      const w = sizeWord(k);
      rows.push({
        id: "call" + i,
        kutchi: `${s ? sideLine(s).kutchi + " " + w.kutchi : cap(w.kutchi)} [${W.toe.english}]${s ? "" : "!"}`,
        english: `${s ? sideLine(s).english + ", the " : "The "}${w.english} toe`,
        who: lv.side ? "patient" : "doctor",
      });
    }
    // the thorn: in one foot (a swirl shows which at levels 1-2), the toe by size (and side at 3)
    const thorn = { side: side === "left" || side === "right" ? side : pick(rng, SIDES), k: rng() < 0.5 ? BIG : LITTLE };
    const tw = sizeWord(thorn.k);
    rows.push({
      id: "thorn",
      kutchi: `[Ow!] ${lv.side ? sideLine(thorn.side).kutchi + " " + tw.kutchi : cap(tw.kutchi)} [${W.toe.english}]`,
      english: `Ow! ${lv.side ? sideLine(thorn.side).english + ", the " : "The "}${tw.english} toe (pull the thorn out)`,
      who: "patient",
    });
    rows.push({ id: "plaster", kutchi: `${W.nepoi.kutchi} [plaster]`, english: "And then a plaster", who: "doctor" });
    [W.big, W.small].forEach((w) => words.push({ kutchi: w.kutchi, english: w.english }));
    if (list) words.push({ kutchi: W.pela.kutchi.toLowerCase(), english: W.pela.english });
    words.push({ kutchi: W.nepoi.kutchi.toLowerCase(), english: W.nepoi.english });
    return { level: Number(level), temp, salt, saltOptions: lv.salt || null, calls, thorn, side: !!lv.side, swirl: !lv.side, list, rows, words };
  }

  const newState = (R) => ({ poured: [], spoons: 0, picks: R.calls.map(() => null), plucks: [], plaster: null });

  function grade(R, st) {
    const toeOk = (want, got) => !!got && got.k === want.k && (!want.side || got.side === want.side);
    return R.rows.map((row) => {
      let right = false;
      if (row.id === "water") right = st.poured.length > 0 && st.poured.every((t) => t === R.temp);
      else if (row.id === "salt") right = st.spoons === R.salt;
      else if (row.id.startsWith("call")) right = toeOk(R.calls[Number(row.id.slice(4))], st.picks[Number(row.id.slice(4))]);
      else if (row.id === "thorn") right = !!st.plucks[0] && st.plucks[0].side === R.thorn.side && st.plucks[0].k === R.thorn.k;
      else if (row.id === "plaster") right = !!st.plaster && st.plaster.side === R.thorn.side && st.plaster.k === R.thorn.k;
      return { id: row.id, right };
    });
  }

  const STRATEGIES = ["fair", "random", "best", "big-toes", "first", "alternate"];
  /**
   * The blind bot (pure).
   *   fair      understands every word (must win 100%)
   *   random    any jug, 0-5 spoons, any of the ten toes
   *   best      only the extreme toes (the words are sizes), the swirl's foot
   *             for the thorn, a count from the level's range; it sees the
   *             thorn pop out, so it plucks on and plasters the right toe
   *   big-toes  always the big toe (the most obvious one), the hot jug
   *   first     the first jug, one spoon, the screen's first toe
   *   alternate best, but the toe calls go big, little, big … (a pattern guess)
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
          st.poured.push(R.temp);
          if (R.salt) st.spoons = R.salt;
          R.calls.forEach((c, i) => (st.picks[i] = { side: c.side || "left", k: c.k }));
          st.plucks.push({ side: R.thorn.side, k: R.thorn.k });
          st.plaster = { side: R.thorn.side, k: R.thorn.k };
          return score(st);
        }
        const rnd = strategy === "random";
        st.poured.push(strategy === "big-toes" ? "hot" : strategy === "first" ? "hot" : rng() < 0.5 ? "hot" : "cold");
        if (R.salt) st.spoons = rnd ? Math.floor(rng() * 6) : strategy === "first" ? 1 : pick(rng, R.saltOptions);
        const anyToe = () => {
          if (strategy === "big-toes") return { side: pick(rng, SIDES), k: BIG };
          if (strategy === "first") return { side: "right", k: LITTLE }; // the patient's right foot is on your left; its little toe is leftmost
          return { side: pick(rng, SIDES), k: rnd ? Math.floor(rng() * 5) : rng() < 0.5 ? BIG : LITTLE };
        };
        R.calls.forEach((c, i) => (st.picks[i] = strategy === "alternate" ? { side: pick(rng, SIDES), k: i % 2 ? LITTLE : BIG } : anyToe()));
        const first = anyToe();
        if (R.swirl && !rnd) first.side = R.thorn.side;
        st.plucks.push(first);
        st.plaster = rnd ? anyToe() : { side: R.thorn.side, k: R.thorn.k };
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
.hc-foot{position:absolute;inset:0;z-index:5;user-select:none;-webkit-user-select:none;touch-action:none}
.hc-foot svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.hc-foot [data-heal]{cursor:pointer}
.hc-foot .hc-pulse{animation:hcFootPulse 1s ease-in-out infinite}
@keyframes hcFootPulse{0%,100%{opacity:1}50%{opacity:.45}}
.hc-foot .hc-bubble{font:800 30px/1 "Baloo 2",system-ui,sans-serif;fill:#3a2e28}
.hc-foot .hc-feet{transition:transform .6s cubic-bezier(.5,1.6,.5,1)}
.hc-foot .hc-jugs{transition:opacity .25s}
`;
  const SKIN_DEF = "#c99a74";
  const shade = (hex, k) => {
    const n = parseInt(String(hex).replace("#", ""), 16);
    if (isNaN(n)) return hex;
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
  };
  const FOOT_X = { right: 335, left: 635 }; // the patient faces you: their left foot is on your right
  const UP = -150; // the feet before they go in
  const TUB = { cx: 485, cy: 350, rx: 335, ry: 112 };
  const TOES = { dx: [58, 16, -20, -50, -75], dy: [104, 120, 122, 115, 101], r: [33, 25, 23, 21, 18] };
  const FOOT_Y = 280;
  const itemBase = (id) =>
    String(id || "")
      .replace(/^(care|tool|med|spi)-/, "")
      .replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown|hot|cold)$/, "");
  const USE = { paani: "paani", jug: "paani", loon: "loon", "16": "loon", salt: "loon", tweezers: "tweezers", plaster: "plaster", bandage: "plaster" };

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
    const level = ctx.level || 1;
    const rng = ctx.rng || Math.random;
    const R = makeRound(D, level, rng, ctx.side);
    const st = newState(R);
    const kindId = (ctx.patient && ctx.patient.kind) || "girl";
    const KIND = (W.Clinic && W.Clinic.Figure && W.Clinic.Figure.KINDS && W.Clinic.Figure.KINDS[kindId]) || {};
    const SKIN = KIND.skin || SKIN_DEF;
    const SKIN_D = shade(SKIN, 0.8);
    const LEGS = KIND.legs || KIND.clothes || "#4a6fa5";

    const css = doc.createElement("style");
    css.textContent = CSS;
    stage.appendChild(css);
    const wrap = doc.createElement("div");
    wrap.className = "hc-foot";
    stage.appendChild(wrap);
    const figLayer = stage.querySelector(".cl-patient-layer");
    if (figLayer) figLayer.style.visibility = "hidden";
    const box = stage.getBoundingClientRect();
    const tall = box.height > box.width * 1.05;
    const svg = S("svg", { viewBox: tall ? "130 -40 720 760" : "100 -10 870 500", preserveAspectRatio: "xMidYMid meet" }, wrap);

    let holding = null; // a use: "paani" | "loon" | "tweezers" | "plaster"
    let finished = false;
    let feetIn = false;
    let callIdx = 0;
    let thornOut = false;
    let thornSaid = false;
    let drag = null;
    let lastAct = Date.now();
    const ticked = new Set();
    const used = new Set();
    const shown = [];
    const els = { toe: {} };

    const speakers = Kit && Kit.Voice && Kit.Voice.speakers;
    const oldSpeaker = speakers && speakers.patient;
    if (speakers) speakers.patient = () => els.feetBox || wrap;

    const line = (id) => Object.assign({}, (D.lines || {})[id] || { english: id });
    const say = (l) => ctx.say(l, { who: l.who || "doctor" });
    const rowOf = (id) => R.rows.find((r) => r.id === id);
    const cardRow = (r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, audio: r.audio, who: r.who });
    const tick = (id) => {
      if (ticked.has(id)) return;
      ticked.add(id);
      ctx.card.tick(id);
    };
    const reveal = (id, speak = true) => {
      if (shown.includes(id)) return;
      shown.push(id);
      if (!R.list) ctx.card.addRow(cardRow(rowOf(id)));
      ctx.card.now && ctx.card.now(id);
      if (speak) say(rowOf(id));
    };
    const react = (m, ms) => ctx.patient && ctx.patient.react && ctx.patient.react(m, ms);
    function bubble(text, x, y) {
      const g = S("g", { "pointer-events": "none" }, svg);
      const w = Math.max(110, text.length * 17 + 34);
      S("rect", { x: x - w / 2, y: y - 32, width: w, height: 56, rx: 26, fill: "#fff", stroke: "#3a2e28", "stroke-width": 3 }, g);
      S("text", { x, y: y + 6, "text-anchor": "middle", class: "hc-bubble" }, g).textContent = text;
      anim(g, [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 1800 });
      ctx.after(1800, () => g.remove());
    }
    function toSvg(e) {
      const p = svg.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    }

    /* ---- drawing ---- */
    function drawScene() {
      S("rect", { x: -200, y: -200, width: 1400, height: 1200, fill: "#f3ead9" }, svg);
      S("rect", { x: -200, y: 330, width: 1400, height: 700, fill: "#e6d6bd" }, svg); // the floor
      // the tub's back and inside
      const tub = S("g", { "data-heal": "tub" }, svg);
      els.tub = tub;
      S("ellipse", { cx: TUB.cx, cy: TUB.cy + 18, rx: TUB.rx + 10, ry: TUB.ry + 10, fill: "#6f9fb3" }, tub);
      S("ellipse", { cx: TUB.cx, cy: TUB.cy, rx: TUB.rx, ry: TUB.ry, fill: "#cfe3ea", stroke: "#5f8fa3", "stroke-width": 8 }, tub);
      ctx.on(tub, "click", tapTub);
      // the legs and feet (one group, lowered into the tub)
      const feet = S("g", { class: "hc-feet", style: `transform:translateY(${UP}px)` }, svg);
      els.feet = feet;
      const feetHit = S("g", { "data-heal": "feet" }, feet);
      SIDES.forEach((side) => {
        const cx = FOOT_X[side];
        const s = side === "right" ? 1 : -1; // towards the middle on screen
        const fg = S("g", {}, feetHit);
        S("rect", { x: cx - 58 + s * 8, y: -300, width: 116, height: FOOT_Y + 300 - 20, rx: 40, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, fg);
        S("rect", { x: cx - 66 + s * 8, y: -300, width: 132, height: FOOT_Y - 110 + 300, rx: 18, fill: LEGS }, fg); // rolled-up trousers (or the dress)
        S("rect", { x: cx - 68 + s * 8, y: FOOT_Y - 116, width: 136, height: 26, rx: 12, fill: shade(LEGS, 0.82) }, fg);
        const sole = S("ellipse", { cx: cx + s * 4, cy: FOOT_Y + 30, rx: 92, ry: 98, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, fg);
        if (side === "left") els.feetBox = sole;
        if (R.swirl && side === R.thorn.side) {
          const src = sprite("sore-swirl");
          if (src) S("image", { href: src, x: cx + s * 4 - 46, y: FOOT_Y - 20, width: 92, height: 86, opacity: 0.85, "pointer-events": "none" }, fg);
          else {
            const sw = [];
            for (let t = 0; t < Math.PI * 4; t += 0.25) sw.push(`${cx + s * 4 + Math.cos(t) * (3 + t * 3.4)},${FOOT_Y + 24 + Math.sin(t) * (3 + t * 3.4) * 0.8}`);
            S("polyline", { points: sw.join(" "), stroke: "#e46d8f", "stroke-width": 5, fill: "none", "pointer-events": "none" }, fg);
          }
        }
        ctx.on(fg, "click", tapFeet);
      });
      // the toes (their own targets), big (0) to little (4), each with a little face
      SIDES.forEach((side) => {
        const cx = FOOT_X[side];
        const s = side === "right" ? 1 : -1;
        for (let k = 0; k < 5; k++) {
          const x = cx + s * TOES.dx[k];
          const y = FOOT_Y + TOES.dy[k];
          const r = TOES.r[k];
          const tg = S("g", { "data-heal": `toe-${side}-${k}` }, feet);
          S("circle", { cx: x, cy: y, r: r + 9, fill: "transparent" }, tg); // a generous hit area
          const toe = S("g", { style: "transform-box:fill-box;transform-origin:50% 20%" }, tg);
          S("ellipse", { cx: x, cy: y, rx: r, ry: r * 1.15, fill: SKIN, stroke: SKIN_D, "stroke-width": 3 }, toe);
          S("ellipse", { cx: x, cy: y + r * 0.45, rx: r * 0.55, ry: r * 0.4, fill: "#f0d6c4", stroke: "#d8b8a0", "stroke-width": 1.5 }, toe); // the nail
          const face = S("g", {}, toe);
          S("circle", { cx: x - r * 0.3, cy: y - r * 0.28, r: Math.max(2, r * 0.1), fill: "#3a2e28" }, face);
          S("circle", { cx: x + r * 0.3, cy: y - r * 0.28, r: Math.max(2, r * 0.1), fill: "#3a2e28" }, face);
          const mouthP = S("path", { d: `M${x - r * 0.25} ${y - r * 0.02} Q${x} ${y + r * 0.18} ${x + r * 0.25} ${y - r * 0.02}`, stroke: "#6b2f2a", "stroke-width": 2, fill: "none" }, face);
          const plaster = S("g", { opacity: 0, "pointer-events": "none" }, tg);
          const psrc = sprite("plaster");
          if (psrc) S("image", { href: psrc, x: x - r - 6, y: y - r * 0.45, width: 2 * r + 12, height: r * 1.1 }, plaster);
          else S("rect", { x: x - r - 2, y: y - r * 0.2, width: 2 * r + 4, height: r * 0.7, rx: 5, fill: "#e8b98f", stroke: "#b88a60", "stroke-width": 2 }, plaster);
          els.toe[key(side, k)] = { g: tg, toe, x, y, r, plaster, mouth: mouthP };
          ctx.on(tg, "click", (e) => {
            e.stopPropagation();
            tapToe(side, k);
          });
          ctx.on(tg, "pointerdown", (e) => startPluck(e, side, k));
        }
      });
      // the water over the feet (see-through), steam or ice, the salt
      els.water = S("ellipse", { cx: TUB.cx, cy: TUB.cy + 6, rx: TUB.rx - 12, ry: TUB.ry - 12, fill: "#5aa8d8", opacity: 0, "pointer-events": "none" }, svg);
      els.fx = S("g", { "pointer-events": "none" }, svg);
      els.salt = S("g", { "pointer-events": "none" }, svg);
      S("path", { d: `M${TUB.cx - TUB.rx} ${TUB.cy} A${TUB.rx} ${TUB.ry} 0 0 0 ${TUB.cx + TUB.rx} ${TUB.cy}`, stroke: "#5f8fa3", "stroke-width": 10, fill: "none", "pointer-events": "none" }, svg);
      els.fly = S("g", { "pointer-events": "none" }, svg);
      els.arrow = S("g", { "pointer-events": "none", opacity: 0 }, svg);
      S("line", { x1: 0, y1: 0, x2: 0, y2: 62, stroke: "#d24a3a", "stroke-width": 6, "stroke-dasharray": "8 7" }, els.arrow);
      S("path", { d: "M-12 52 L0 72 L12 52 Z", fill: "#d24a3a" }, els.arrow);
      // the two jugs (shown while the paani dish is up): the same jug, hot or cold
      els.jugs = S("g", { class: "hc-jugs", opacity: 0, "pointer-events": "none" }, svg);
      const jsrc = sprite("jug-water");
      const JX = tall ? { hot: 300, cold: 670 } : { hot: 900, cold: 900 };
      const JY = tall ? { hot: -8, cold: -8 } : { hot: 70, cold: 225 };
      // which jug sits where is shuffled, so the place gives nothing away
      const order = rng() < 0.5 ? ["hot", "cold"] : ["cold", "hot"];
      els.jug = {};
      order.forEach((t, i) => {
        const slot = i === 0 ? "hot" : "cold";
        const x = JX[slot];
        const y = JY[slot];
        const g = S("g", { "data-heal": "jug-" + t }, els.jugs);
        S("circle", { cx: x, cy: y + 40, r: 74, fill: "#fffdf6", stroke: t === "hot" ? "#e0876a" : "#7fb6d6", "stroke-width": 6 }, g);
        if (jsrc) S("image", { href: jsrc, x: x - 48, y: y - 8, width: 96, height: 98 }, g);
        else S("path", { d: `M${x - 30} ${y} L${x + 26} ${y} L${x + 32} ${y + 80} L${x - 36} ${y + 80} Z`, fill: "#8fc6e6", stroke: "#5a4a3a", "stroke-width": 4 }, g);
        if (t === "hot") [-22, 0, 22].forEach((d, j) => {
          const p = S("path", { d: `M${x + d} ${y - 6} q-10 -12 0 -24 q10 -12 0 -24`, stroke: "#b8aca2", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, g);
          anim(p, [{ transform: "translateY(0)", opacity: 0.9 }, { transform: "translateY(-14px)", opacity: 0.2 }], { duration: 1400, iterations: Infinity, delay: j * 300 });
        });
        else [[-30, 58], [18, 66], [-6, 44]].forEach(([dx, dy]) => S("rect", { x: x + dx, y: y + dy, width: 20, height: 20, rx: 4, fill: "#f2fbff", stroke: "#8fc3d9", "stroke-width": 3, opacity: 0.95 }, g));
        els.jug[t] = { g, x, y };
        ctx.on(g, "click", (e) => {
          e.stopPropagation();
          pour(t);
        });
      });
    }

    /* ---- the dishes (the host's sidebar tray) ---- */
    const useOf = (i) => {
      const t = ctx.tray[i];
      return t && !t.wrong ? USE[itemBase(t.id)] || null : null;
    };
    const dishOf = (use) => ctx.tray.findIndex((t, i) => useOf(i) === use);
    function closeStep(use) {
      let done = false;
      if (use === "paani" && st.poured.length) (done = true), tick("water");
      if (use === "loon" && st.spoons > 0) {
        done = true;
        if (R.salt) tick("salt");
      }
      if (use === "plaster" && st.plaster) (done = true), tick("plaster");
      if (use === "tweezers" && st.plucks.length) done = true;
      if (done) {
        used.add(use);
        const di = dishOf(use);
        if (di >= 0 && ctx.trayUI) ctx.trayUI.used(di);
      }
      if (use === "paani" && done && !R.list && R.salt) reveal("salt");
    }
    function putDown() {
      if (!holding) return;
      closeStep(holding);
      holding = null;
      ctx.trayUI && ctx.trayUI.select(-1);
      showJugs(false);
    }
    function showJugs(on) {
      els.jugs.setAttribute("opacity", on ? 1 : 0);
      els.jugs.setAttribute("pointer-events", on ? "auto" : "none");
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
      ctx.signal && ctx.signal("heal-foot-lift");
      if (use === "paani") showJugs(true);
      if (use === "tweezers" && feetIn) sayThorn();
    }

    /* ---- play ---- */
    function pour(t) {
      if (finished || holding !== "paani") return;
      lastAct = Date.now();
      st.poured.push(t);
      ctx.signal && ctx.signal("heal-foot-pour");
      ctx.sfx("whoosh");
      const j = els.jug[t];
      anim(j.g, [{ transform: "rotate(0)" }, { transform: "rotate(-24deg)" }, { transform: "rotate(0)" }], { duration: 800, transformOrigin: `${j.x}px ${j.y + 40}px` });
      const stream = S("path", { d: `M${TUB.cx + 150} 150 Q${TUB.cx + 120} 230 ${TUB.cx + 100} ${TUB.cy}`, stroke: t === "hot" ? "#8fc6e6" : "#5aa8d8", "stroke-width": 16, fill: "none", "stroke-linecap": "round", opacity: 0.85, "pointer-events": "none" }, svg);
      anim(stream, [{ opacity: 0 }, { opacity: 0.9, offset: 0.2 }, { opacity: 0.9, offset: 0.7 }, { opacity: 0 }], { duration: 900 });
      ctx.after(900, () => stream.remove());
      els.water.setAttribute("opacity", 0.42);
      drawTemp();
      const di = dishOf("paani");
      ctx.tally(di >= 0 ? ctx.tray[di].id : "paani", st.poured.length);
    }
    function tapTub() {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      if (holding !== "loon") return;
      st.spoons++;
      ctx.sfx("pop");
      const sp = S("g", {}, els.salt);
      const sx = TUB.cx - 170 + st.spoons * 46;
      const ssrc = sprite("salt-pot");
      const pot = ssrc ? S("image", { href: ssrc, x: sx - 20, y: TUB.cy - 150, width: 44, height: 58 }, sp) : null;
      for (let i = 0; i < 9; i++) S("rect", { x: sx - 20 + rng() * 40, y: TUB.cy - 40 + rng() * 40, width: 6, height: 6, fill: "#fff", stroke: "#cfc6b8", "stroke-width": 1 }, sp);
      anim(sp, [{ transform: "translateY(-60px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: 400 });
      if (pot) ctx.after(700, () => pot.remove());
      const di = dishOf("loon");
      ctx.tally(di >= 0 ? ctx.tray[di].id : "loon", st.spoons);
      if (feetIn) react("giggle", 700);
    }
    function drawTemp() {
      const fx = els.fx;
      while (fx.firstChild) fx.firstChild.remove();
      if (st.poured.includes("hot"))
        [-200, -60, 90, 230].forEach((dx, i) => {
          const p = S("path", { d: `M${TUB.cx + dx} ${TUB.cy - 70} q-14 -18 0 -34 q14 -16 0 -34`, stroke: "#fff", "stroke-width": 7, fill: "none", opacity: 0.8, "stroke-linecap": "round" }, fx);
          anim(p, [{ transform: "translateY(0)", opacity: 0.8 }, { transform: "translateY(-30px)", opacity: 0 }], { duration: 1600, iterations: Infinity, delay: i * 350 });
        });
      if (st.poured.includes("cold")) [[-290, -10], [-250, 30], [250, 20], [285, -15]].forEach(([dx, dy]) => S("rect", { x: TUB.cx + dx - 14, y: TUB.cy + dy - 14, width: 28, height: 28, rx: 6, fill: "#f2fbff", stroke: "#8fc3d9", "stroke-width": 3, opacity: 0.95 }, fx));
    }
    function tapFeet() {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      if (feetIn || !st.poured.length) {
        // a jiggle: the feet are waiting for the water (or already in)
        anim(els.feet, [{ transform: `translateY(${feetIn ? 0 : UP}px)` }, { transform: `translateY(${(feetIn ? 0 : UP) - 12}px)` }, { transform: `translateY(${feetIn ? 0 : UP}px)` }], { duration: 260 });
        if (feetIn) react("giggle", 600);
        return;
      }
      putDown();
      feetIn = true;
      ctx.signal && ctx.signal("heal-foot-in");
      els.feet.style.transform = "translateY(0px)";
      ctx.sfx("whoosh");
      const cold = st.poured[0] === "cold";
      ctx.after(500, () => {
        say(line(cold ? "brr" : "ahh"));
        bubble(cold ? "Brrr!" : "Ahhh...", 485, 70);
        react(cold ? "cold" : "relief", 1400);
        if (cold) anim(els.feet, [0, -6, 6, -6, 6, 0].map((d) => ({ transform: `translate(${d}px, 0)` })), { duration: 500 });
        SIDES.forEach((s) => wiggleAll(s));
      });
      ctx.after(1800, nextCall);
    }
    function wiggle(side, k) {
      const t = els.toe[key(side, k)];
      anim(t.toe, [{ transform: "rotate(0)" }, { transform: "rotate(-18deg)" }, { transform: "rotate(16deg)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(0)" }], { duration: 520 });
    }
    function wiggleAll(side) {
      for (let k = 0; k < 5; k++) ctx.after(k * 70, () => wiggle(side, k));
    }
    function nextCall() {
      if (finished) return;
      if (callIdx < R.calls.length) {
        const row = rowOf("call" + callIdx);
        if (R.list) {
          ctx.card.now && ctx.card.now(row.id);
          say(row);
        } else reveal(row.id);
      } else sayThorn();
    }
    function sayThorn() {
      if (thornSaid || callIdx < R.calls.length) return;
      thornSaid = true;
      if (R.list) {
        ctx.card.now && ctx.card.now("thorn");
        say(rowOf("thorn"));
      } else reveal("thorn");
      react("ouch", 1200);
    }
    function tapToe(side, k) {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      if (!feetIn) return tapFeet();
      if (holding === "tweezers") return; // the tweezers pluck (a drag); a tap does nothing
      if (holding === "plaster") {
        const first = !st.plaster;
        if (st.plaster) els.toe[key(st.plaster.side, st.plaster.k)].plaster.setAttribute("opacity", 0);
        st.plaster = { side, k };
        els.toe[key(side, k)].plaster.setAttribute("opacity", 1);
        ctx.sfx("pop");
        if (first) {
          react("happy", 1200);
          bubble("♥", FOOT_X[side], 150);
        }
        return;
      }
      wiggle(side, k);
      const t = els.toe[key(side, k)];
      anim(t.mouth, [{ transform: "scaleY(1)" }, { transform: "scaleY(2)" }, { transform: "scaleY(1)" }], { duration: 500 });
      if (callIdx < R.calls.length && shownOrList("call" + callIdx)) {
        if (holding) putDown();
        st.picks[callIdx] = { side, k };
        ctx.sfx("pop");
        if (ctx.rng() < 0.5) say(line("tickle"));
        react("giggle", 800);
        tick("call" + callIdx);
        callIdx++;
        ctx.after(900, nextCall);
      } else react("giggle", 600);
    }
    const shownOrList = (id) => R.list || shown.includes(id);
    function startPluck(e, side, k) {
      if (finished || holding !== "tweezers" || !feetIn) return;
      e.preventDefault();
      lastAct = Date.now();
      stopHints();
      const t = els.toe[key(side, k)];
      drag = { side, k, y0: toSvg(e).y };
      try {
        svg.setPointerCapture(e.pointerId);
      } catch (_) {
        /* synthetic pointers */
      }
      els.arrow.setAttribute("transform", `translate(${t.x},${t.y + t.r})`);
      els.arrow.setAttribute("opacity", 1);
      els.tw = S("g", { "pointer-events": "none" }, svg);
      const tsrc = sprite("tweezers");
      if (tsrc) S("image", { href: tsrc, x: t.x - 34, y: t.y - 74, width: 68, height: 64, transform: `rotate(180 ${t.x} ${t.y - 42})` }, els.tw);
      else S("path", { d: `M${t.x - 6} ${t.y - 50} L${t.x - 2} ${t.y} M${t.x + 6} ${t.y - 50} L${t.x + 2} ${t.y}`, stroke: "#8b95a0", "stroke-width": 7, "stroke-linecap": "round" }, els.tw);
    }
    function movePluck(e) {
      if (!drag) return;
      const dy = Math.max(0, toSvg(e).y - drag.y0);
      if (els.tw) els.tw.setAttribute("transform", `translate(0,${Math.min(dy, 70)})`);
      const t = els.toe[key(drag.side, drag.k)];
      t.toe.style.transform = `translateY(${Math.min(dy, 60) * 0.25}px)`;
      if (dy >= 50) {
        const d = drag;
        endPluck();
        pluck(d.side, d.k);
      }
    }
    function endPluck() {
      if (!drag) return;
      els.toe[key(drag.side, drag.k)].toe.style.transform = "";
      drag = null;
      els.arrow.setAttribute("opacity", 0);
      if (els.tw) els.tw.remove();
      els.tw = null;
    }
    function pluck(side, k) {
      if (!thornSaid) sayThorn();
      const first = !st.plucks.length;
      st.plucks.push({ side, k });
      ctx.signal && ctx.signal("heal-foot-pluck");
      const t = els.toe[key(side, k)];
      const isThorn = !thornOut && side === R.thorn.side && k === R.thorn.k;
      ctx.sfx("pop");
      const g = S("g", {}, els.fly);
      if (isThorn) {
        thornOut = true;
        const src = sprite("thorn");
        if (src) S("image", { href: src, x: t.x - 22, y: t.y + 4, width: 44, height: 44 }, g);
        else S("path", { d: `M${t.x} ${t.y + 6} l-7 30 l7 -8 l7 8 Z`, fill: "#6b4a2b", stroke: "#3a2e28", "stroke-width": 2 }, g);
        say(line("phew"));
        bubble("Phew!", 485, 70);
        react("relief", 1400);
      } else {
        S("circle", { cx: t.x, cy: t.y + 20, r: 10, fill: "#eee6da", stroke: "#b9ad9c", "stroke-width": 2 }, g); // a bit of fluff: comic, never a verdict
        say(line("tickle"));
        react("giggle", 800);
      }
      wiggle(side, k);
      anim(g, [{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: "translate(40px,-160px) rotate(200deg)", opacity: 1, offset: 0.6 }, { transform: "translate(70px,-60px) rotate(360deg)", opacity: 0 }], { duration: 1100 });
      ctx.after(1100, () => g.remove());
      if (first) {
        tick("thorn");
        used.add("tweezers");
        const di = dishOf("tweezers");
        if (di >= 0 && ctx.trayUI) ctx.trayUI.used(di);
        ctx.after(900, () => (R.list ? (ctx.card.now && ctx.card.now("plaster"), say(rowOf("plaster"))) : reveal("plaster")));
      }
    }
    function nextNeed() {
      if (!st.poured.length) return "paani";
      if (R.salt && !st.spoons) return "loon";
      if (!feetIn) return "feet";
      if (callIdx < R.calls.length) return "toe";
      if (!st.plucks.length) return "tweezers";
      if (!st.plaster) return "plaster";
      return null;
    }
    function onDone() {
      if (finished) return;
      lastAct = Date.now();
      stopHints();
      putDown();
      const need = nextNeed();
      if (need) {
        const di = dishOf(need);
        if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
        else if (need === "feet") els.feet.classList.add("hc-pulse");
        return;
      }
      finish();
    }
    function finish() {
      finished = true;
      const g = grade(R, st);
      g.forEach((r) => ctx.log({ type: r.right ? "right" : "wrong", rowId: r.id }));
      if (st.plucks.length > 1) ctx.log({ type: "extra", rowId: "thorn", detail: `${st.plucks.length - 1} more plucks` });
      const right = g.filter((r) => r.right).length;
      react("happy", 0);
      SIDES.forEach((s) => wiggleAll(s));
      ctx.done({ right, total: g.length, hints: 0, words: R.words });
    }

    // the throbbing hint after 8 s of nothing: the row and the dish (never which toe, jug or count)
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
        if (need === "feet") els.feet.classList.add("hc-pulse");
        else if (need && need !== "toe" && holding !== need) {
          const di = dishOf(need);
          if (di >= 0 && ctx.trayUI) ctx.trayUI.pulse(di, true);
        } else if (!need) doneBtn.classList.add("throb");
      }
      ctx.after(1000, throb);
    }

    const doneBtn = ctx.button("✓", onDone, "done");
    doneBtn.setAttribute("aria-label", "Done");
    ctx.trayUI && ctx.trayUI.onTap((i) => onDish(i));
    drawScene();
    ctx.on(svg, "pointermove", movePluck);
    ctx.on(svg, "pointerup", endPluck);
    ctx.on(svg, "pointercancel", endPluck);

    return {
      async start() {
        if (R.list) ctx.card.setRows(R.rows.map(cardRow));
        else {
          ctx.card.setRows([]);
          reveal("water", false);
        }
        lastAct = Date.now();
        throb();
        if (level === 1) {
          const dish = () => ctx.trayUI && ctx.trayUI.dishes()[dishOf("paani")];
          ctx.onboard([
            { spotlight: dish, ghost: { gesture: "tap" }, wait: "heal-foot-lift" },
            { spotlight: () => [els.jug.hot.g, els.jug.cold.g], ghost: { gesture: "tap" }, wait: "heal-foot-pour" },
            { spotlight: () => els.feetBox, ghost: { gesture: "tap" }, wait: "heal-foot-in" },
          ]);
        }
        if (R.list) await ctx.card.speak(R.rows.filter((r) => r.id === "water" || r.id === "salt").map((r) => r.id));
        else await say(rowOf("water"));
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
        const toes = {};
        Object.keys(els.toe).forEach((k) => (toes[k] = rect(els.toe[k].g.querySelector("ellipse"))));
        return {
          round: { temp: R.temp, salt: R.salt, calls: R.calls, thorn: R.thorn },
          state: JSON.parse(JSON.stringify(st)),
          holding,
          feetIn,
          callIdx,
          thornSaid,
          ticked: [...ticked],
          finished,
          need: nextNeed(),
          dish: { paani: dishOf("paani"), loon: dishOf("loon"), tweezers: dishOf("tweezers"), plaster: dishOf("plaster") },
          jug: { hot: rect(els.jug.hot.g.querySelector("circle")), cold: rect(els.jug.cold.g.querySelector("circle")) },
          tub: rect(els.tub.querySelector("ellipse:nth-of-type(2)")),
          feet: rect(els.feetBox),
          toes,
          done: rect(doneBtn),
        };
      },
    };
  }

  const def = {
    id: ID,
    part: "foot",
    ailments: ["sore-feet"],
    items: ["paani", "loon", "tweezers", "plaster"],
    itemsFor: { "sore-feet": ["paani", "loon", "tweezers", "plaster"] },
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
