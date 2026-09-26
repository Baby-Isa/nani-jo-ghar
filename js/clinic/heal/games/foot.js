/*
 * Clinic heal game `foot`: H13 The foot bath (docs/modes/clinic-design.md,
 * the quality pass Q4; contract docs/clinic-heal-api.md).
 *
 * *Pela [EN: hot] paani*: tap the jug the doctor names (hot or cold, the two
 * look it), tap the tub. *Ne poi ba chamcha loon* (level 2+): the spoon,
 * one tap per spoon. Tap the feet: in they go (*[EN: ahh]*, or *[EN: brrr]*).
 * Then WHICH TOE: *wadho / nindho [EN: toe]*, and at level 3 the patient's
 * own side too (*[EN: my left,] nindho*): ten near-identical targets where
 * size and side are both needed to pick one. Every tapped toe wiggles alone
 * and the patient giggles (a reaction, never a verdict). Last, the thorn:
 * the patient names the toe; tap the tweezers and PLUCK (drag it out along
 * the arrow); *ne poi [EN: plaster]* on that toe.
 *
 * Gestures: tap (the dish, the spot) + pluck (drag), both from level 1.
 * A row ticks when its step closes (the next dish, the feet, Done; a toe
 * call and a pluck close on the pick), never on a count.
 *
 * Levels are data: data/clinic/heal/foot.json. Runs in Node for the bot.
 */
(function (root, factory) {
  const G = factory(root);
  if (typeof module === "object" && module.exports) module.exports = G;
  const reg = root && root.Clinic && root.Clinic.Heal;
  if (reg && reg.register) reg.register(G);
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const ID = "foot";
  const DATA_PATH = "data/clinic/heal/foot.json";

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
    rows.push({ id: "water", kutchi: `${list ? W.pela.kutchi + " " : ""}[EN: ${list ? W[temp].english : cap(W[temp].english)}] ${W.paani.kutchi}`, english: `${list ? "First, " : ""}${W[temp].english} water`, who: "doctor", audio: null });
    words.push({ kutchi: W.paani.kutchi, english: W.paani.english, audio: W.paani.audio });
    let salt = null;
    if (lv.salt) {
      salt = pick(rng, lv.salt);
      const num = D.numbers.find((n) => n.n === salt);
      rows.push({ id: "salt", kutchi: `${W.nepoi.kutchi} ${num.kutchi.toLowerCase()} ${num.spoon} ${W.loon.kutchi}`, english: `Then ${num.english} spoon${salt > 1 ? "s" : ""} of salt`, who: "doctor" });
      words.push({ kutchi: num.kutchi.toLowerCase(), english: num.english }, { kutchi: num.spoon, english: salt > 1 ? "tablespoons" : "tablespoon" }, { kutchi: W.loon.kutchi, english: W.loon.english, audio: W.loon.audio });
    }
    const sizeWord = (k) => (k === BIG ? W.big : W.small);
    const sideLine = (s) => D.lines["side-" + s];
    // the toe calls: by size (either foot at levels 1-2), size x side at level 3 (in the patient's voice)
    const calls = [];
    for (let i = 0; i < lv.calls; i++) {
      let k;
      let s = null;
      do {
        k = rng() < 0.5 ? BIG : LITTLE;
        s = lv.side ? pick(rng, SIDES) : null;
      } while (calls.length && calls[calls.length - 1].k === k && calls[calls.length - 1].side === s); // never the same call twice running
      calls.push({ k, side: s });
      const w = sizeWord(k);
      const who = lv.side ? "patient" : "doctor";
      rows.push({
        id: "call" + i,
        kutchi: `${s ? sideLine(s).kutchi + " " + w.kutchi : cap(w.kutchi)} [EN: ${W.toe.english}]${s ? "" : "!"}`,
        english: `${s ? sideLine(s).english + ", the " : "The "}${w.english} toe`,
        who,
      });
    }
    // the thorn: in one foot (a swirl shows which at levels 1-2), the toe by size (and side at 3)
    const thorn = { side: side === "left" || side === "right" ? side : pick(rng, SIDES), k: rng() < 0.5 ? BIG : LITTLE };
    const tw = sizeWord(thorn.k);
    rows.push({
      id: "thorn",
      kutchi: `[EN: Ow!] ${lv.side ? sideLine(thorn.side).kutchi + " " + tw.kutchi : cap(tw.kutchi)} [EN: ${W.toe.english}]`,
      english: `Ow! ${lv.side ? sideLine(thorn.side).english + ", the " : "The "}${tw.english} toe (pull the thorn out)`,
      who: "patient",
    });
    rows.push({ id: "plaster", kutchi: `${W.nepoi.kutchi} [EN: plaster]`, english: "And then a plaster", who: "doctor", placeholder: true });
    [W.big, W.small].forEach((w) => words.push({ kutchi: w.kutchi, english: w.english }));
    return { level: Number(level), temp, salt, calls, thorn, side: !!lv.side, swirl: !lv.side, list, rows, words };
  }

  const newState = (R) => ({ poured: [], spoons: 0, picks: R.calls.map(() => null), plucks: [], plaster: null });

  function grade(R, st) {
    const out = [];
    const toeOk = (want, got) => !!got && got.k === want.k && (!want.side || got.side === want.side);
    R.rows.forEach((row) => {
      let right = false;
      if (row.id === "water") right = st.poured.length > 0 && st.poured.every((t) => t === R.temp);
      else if (row.id === "salt") right = st.spoons === R.salt;
      else if (row.id.startsWith("call")) {
        const i = Number(row.id.slice(4));
        right = toeOk(R.calls[i], st.picks[i]);
      } else if (row.id === "thorn") right = !!st.plucks[0] && st.plucks[0].side === R.thorn.side && st.plucks[0].k === R.thorn.k;
      else if (row.id === "plaster") right = !!st.plaster && st.plaster.side === R.thorn.side && st.plaster.k === R.thorn.k;
      out.push({ id: row.id, right });
    });
    return out;
  }

  function bot(level, rng) {
    const D = DATA || nodeData();
    const R = makeRound(D, level, rng, null);
    const lv = D.levels[String(level)];
    const score = (st) => {
      const g = grade(R, st);
      const right = g.filter((r) => r.right).length;
      return { right, total: g.length, win: right === g.length, rows: g };
    };
    return {
      rows: R.rows,
      round: R,
      /** "random": any jug, any spoons 0-5, any of the ten toes. "best": extremes only, the swirl's foot, the least count, plucks until the thorn shows. */
      solve(strategy = "best") {
        const st = newState(R);
        const best = strategy !== "random";
        st.poured.push(rng() < 0.5 ? "hot" : "cold");
        if (R.salt) st.spoons = best ? Math.min(...lv.salt) : Math.floor(rng() * 6);
        const anyToe = () => ({ side: pick(rng, SIDES), k: best ? (rng() < 0.5 ? BIG : LITTLE) : Math.floor(rng() * 5) });
        R.calls.forEach((c, i) => (st.picks[i] = anyToe()));
        const first = R.swirl && best ? { side: R.thorn.side, k: rng() < 0.5 ? BIG : LITTLE } : anyToe();
        st.plucks.push(first);
        // it sees the thorn pop out, so it plucks on until it does, then plasters that toe
        st.plaster = best ? { side: R.thorn.side, k: R.thorn.k } : anyToe();
        return score(st);
      },
      fair() {
        const st = newState(R);
        st.poured.push(R.temp);
        if (R.salt) st.spoons = R.salt;
        R.calls.forEach((c, i) => (st.picks[i] = { side: c.side || "left", k: c.k }));
        st.plucks.push({ side: R.thorn.side, k: R.thorn.k });
        st.plaster = { side: R.thorn.side, k: R.thorn.k };
        return score(st);
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
.heal-c{position:absolute;inset:0;user-select:none;-webkit-user-select:none;touch-action:none}
.heal-c svg{width:100%;height:100%;display:block}
.heal-c [data-heal]{cursor:pointer}
.heal-c .hc-dish.hc-up{transform:translateY(-12px)}
.heal-c .hc-dish{transition:transform .18s ease}
.heal-c .hc-off{opacity:.35;cursor:default}
.heal-c .hc-pulse{animation:hcPulse 1s ease-in-out infinite}
@keyframes hcPulse{0%,100%{opacity:1}50%{opacity:.35}}
.heal-c .hc-bubble{font:700 26px/1 system-ui,sans-serif;fill:#3a2e28}
.heal-c .hc-feet{transition:transform .6s cubic-bezier(.5,1.6,.5,1)}
`;
  function injectCss() {
    let s = doc.getElementById("heal-c-foot-css");
    if (s) return;
    s = doc.createElement("style");
    s.id = "heal-c-foot-css";
    s.textContent = CSS;
    doc.head.appendChild(s);
  }
  const noop = () => {};
  const sfx = (n) => root.Sfx && root.Sfx.play && root.Sfx.play(n);
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
  const SKIN = "#c89a7a";
  const SKIN_D = "#a97c5e";
  const FOOT_X = { right: 335, left: 635 }; // the patient faces you: their left foot is on your right
  const UP = -150; // the feet before they go in
  const TUB = { cx: 485, cy: 350, rx: 335, ry: 112 };
  const TOES = { dx: [56, 16, -18, -47, -71], dy: [104, 118, 120, 113, 100], r: [31, 23, 21, 19, 16] };
  const FOOT_Y = 280;

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
    let holding = null; // an item id
    let dead = false;
    let finished = false;
    let feetIn = false;
    let callIdx = 0;
    let thornOut = false;
    let thornSaid = false;
    let drag = null;
    const revealed = [];
    const ticked = new Set();
    const timers = [];
    let idleT = null;
    const els = { dish: {}, toe: {} };
    const wrap = doc.createElement("div");
    wrap.className = "heal-c heal-c-foot";
    stage.appendChild(wrap);
    const svg = S("svg", { viewBox: `0 0 ${VB.w} ${VB.h}`, preserveAspectRatio: "xMidYMid meet" }, wrap);
    const later = (fn, ms) => timers.push(setTimeout(() => !dead && fn(), ms));
    const lineOf = (id) => Object.assign({ id: "heal-foot-" + id }, (DATA.lines || {})[id] || {});
    const sayLine = (id) => say("heal-foot-" + id, lineOf(id));
    const sayRow = (row) => say("heal-foot-" + row.id, { who: row.who, kutchi: row.kutchi, english: row.english, audio: row.audio });
    const def = (id) => (DATA.items || {})[id] || {};
    const useOf = (id) => def(id).use;

    function setRows() {
      card.setRows(R.rows.filter((r) => (R.list ? true : revealed.includes(r.id))).map((r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, audio: r.audio, placeholder: !!r.placeholder })));
      ticked.forEach((id) => card.tick(id));
    }
    function reveal(id, speak = true) {
      if (revealed.includes(id)) return;
      revealed.push(id);
      if (!R.list) setRows();
      const row = R.rows.find((r) => r.id === id);
      if (speak && row) sayRow(row);
    }
    function tick(id) {
      if (ticked.has(id)) return;
      ticked.add(id);
      card.tick(id);
    }
    function bubble(text, x, y) {
      const g = S("g", { "pointer-events": "none" }, svg);
      const w = Math.max(110, text.length * 15 + 30);
      S("rect", { x: x - w / 2, y: y - 30, width: w, height: 52, rx: 24, fill: "#fff", stroke: "#3a2e28", "stroke-width": 3 }, g);
      const t = S("text", { x, y: y + 5, "text-anchor": "middle", class: "hc-bubble" }, g);
      t.textContent = text;
      anim(g, [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 1800 });
      later(() => g.remove(), 1800);
    }
    function toSvg(e) {
      const p = svg.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    }

    /* ---- drawing ---- */
    function drawScene() {
      S("rect", { x: 0, y: 0, width: VB.w, height: VB.h, fill: "#f3ead9" }, svg);
      S("rect", { x: 0, y: 330, width: VB.w, height: 230, fill: "#e6d6bd" }, svg); // the floor
      // the tub's back and inside
      const tub = S("g", { "data-heal": "tub" }, svg);
      els.tub = tub;
      S("ellipse", { cx: TUB.cx, cy: TUB.cy + 18, rx: TUB.rx + 10, ry: TUB.ry + 10, fill: "#6f9fb3" }, tub);
      S("ellipse", { cx: TUB.cx, cy: TUB.cy, rx: TUB.rx, ry: TUB.ry, fill: "#cfe3ea", stroke: "#5f8fa3", "stroke-width": 8 }, tub);
      tub.addEventListener("click", tapTub);
      // the legs and feet (one group, lowered into the tub)
      const feet = S("g", { class: "hc-feet", style: `transform:translateY(${UP}px)` }, svg);
      els.feet = feet;
      const feetHit = S("g", { "data-heal": "feet" }, feet);
      SIDES.forEach((side) => {
        const cx = FOOT_X[side];
        const s = side === "right" ? 1 : -1; // inner direction on screen
        const fg = S("g", {}, feetHit);
        S("rect", { x: cx - 58 + s * 8, y: -200, width: 116, height: FOOT_Y + 40 + 200 - 60, rx: 40, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, fg);
        S("rect", { x: cx - 66 + s * 8, y: -200, width: 132, height: FOOT_Y - 110 + 200, rx: 18, fill: "#4a6fa5" }, fg); // rolled-up trousers
        S("rect", { x: cx - 68 + s * 8, y: FOOT_Y - 116, width: 136, height: 26, rx: 12, fill: "#3d5d8c" }, fg);
        S("ellipse", { cx: cx + s * 4, cy: FOOT_Y + 30, rx: 90, ry: 96, fill: SKIN, stroke: SKIN_D, "stroke-width": 4 }, fg);
        if (R.swirl && side === R.thorn.side) {
          const sw = [];
          for (let t = 0; t < Math.PI * 4; t += 0.25) sw.push(`${cx + s * 4 + Math.cos(t) * (3 + t * 3.4)},${FOOT_Y + 24 + Math.sin(t) * (3 + t * 3.4) * 0.8}`);
          S("polyline", { points: sw.join(" "), stroke: "#e46d8f", "stroke-width": 5, fill: "none", "pointer-events": "none" }, fg);
        }
        fg.addEventListener("click", tapFeet);
      });
      // the toes (their own targets), big (0) to little (4)
      SIDES.forEach((side) => {
        const cx = FOOT_X[side];
        const s = side === "right" ? 1 : -1;
        for (let k = 0; k < 5; k++) {
          const x = cx + s * TOES.dx[k];
          const y = FOOT_Y + TOES.dy[k];
          const r = TOES.r[k];
          const tg = S("g", { "data-heal": `toe-${side}-${k}` }, feet);
          S("circle", { cx: x, cy: y, r: r + 8, fill: "transparent" }, tg); // a generous hit area
          const toe = S("g", { style: `transform-box:fill-box;transform-origin:50% 20%` }, tg);
          S("ellipse", { cx: x, cy: y, rx: r, ry: r * 1.15, fill: SKIN, stroke: SKIN_D, "stroke-width": 3 }, toe);
          S("ellipse", { cx: x, cy: y + r * 0.45, rx: r * 0.55, ry: r * 0.4, fill: "#f0d6c4", stroke: "#d8b8a0", "stroke-width": 1.5 }, toe); // the nail
          // a tiny face on every toe
          S("circle", { cx: x - r * 0.3, cy: y - r * 0.28, r: Math.max(2, r * 0.1), fill: "#3a2e28" }, toe);
          S("circle", { cx: x + r * 0.3, cy: y - r * 0.28, r: Math.max(2, r * 0.1), fill: "#3a2e28" }, toe);
          S("path", { d: `M${x - r * 0.25} ${y - r * 0.02} Q${x} ${y + r * 0.18} ${x + r * 0.25} ${y - r * 0.02}`, stroke: "#6b2f2a", "stroke-width": 2, fill: "none" }, toe);
          const plaster = S("rect", { x: x - r - 2, y: y - r * 0.2, width: 2 * r + 4, height: r * 0.7, rx: 5, fill: "#e8b98f", stroke: "#b88a60", "stroke-width": 2, opacity: 0, "pointer-events": "none" }, tg);
          els.toe[key(side, k)] = { g: tg, toe, x, y, r, plaster };
          tg.addEventListener("click", (e) => {
            e.stopPropagation();
            tapToe(side, k);
          });
          tg.addEventListener("pointerdown", (e) => startPluck(e, side, k));
        }
      });
      // the water over the feet (drawn in front, see-through), steam or ice
      els.water = S("ellipse", { cx: TUB.cx, cy: TUB.cy + 6, rx: TUB.rx - 12, ry: TUB.ry - 12, fill: "#5aa8d8", opacity: 0, "pointer-events": "none" }, svg);
      els.fx = S("g", { "pointer-events": "none" }, svg);
      els.salt = S("g", { "pointer-events": "none" }, svg);
      // the tub's front lip
      S("path", { d: `M${TUB.cx - TUB.rx} ${TUB.cy} A${TUB.rx} ${TUB.ry} 0 0 0 ${TUB.cx + TUB.rx} ${TUB.cy}`, stroke: "#5f8fa3", "stroke-width": 10, fill: "none", "pointer-events": "none" }, svg);
      // the thorn layer (things plucked fly from here)
      els.fly = S("g", { "pointer-events": "none" }, svg);
      els.arrow = S("g", { "pointer-events": "none", opacity: 0 }, svg);
      S("line", { x1: 0, y1: 0, x2: 0, y2: 62, stroke: "#d24a3a", "stroke-width": 6, "stroke-dasharray": "8 7" }, els.arrow);
      S("path", { d: "M-12 52 L0 72 L12 52 Z", fill: "#d24a3a" }, els.arrow);
    }
    const icons = {
      jug(g, x, y, temp) {
        S("path", { d: `M${x - 20} ${y - 22} L${x + 18} ${y - 22} L${x + 22} ${y + 26} L${x - 24} ${y + 26} Z`, fill: temp === "hot" ? "#d9674f" : "#6aa8d8", stroke: "#5a4a3a", "stroke-width": 3 }, g);
        S("path", { d: `M${x + 20} ${y - 12} q16 6 2 22`, stroke: "#5a4a3a", "stroke-width": 4, fill: "none" }, g);
        S("path", { d: `M${x - 20} ${y - 22} l-9 -6`, stroke: "#5a4a3a", "stroke-width": 4 }, g);
        if (temp === "hot") [-10, 2, 14].forEach((d) => S("path", { d: `M${x + d} ${y - 28} q-7 -8 0 -14 q7 -6 0 -12`, stroke: "#9a8f86", "stroke-width": 3, fill: "none" }, g));
        else [[-6, -30], [8, -34]].forEach(([dx, dy]) => S("rect", { x: x + dx, y: y + dy, width: 12, height: 12, rx: 3, fill: "#eaf6fb", stroke: "#8fc3d9", "stroke-width": 2 }, g));
      },
      salt(g, x, y) {
        S("ellipse", { cx: x - 8, cy: y + 2, rx: 20, ry: 13, fill: "#d8d0c4", stroke: "#8a7a66", "stroke-width": 3 }, g);
        S("line", { x1: x + 8, y1: y - 2, x2: x + 32, y2: y - 22, stroke: "#8a7a66", "stroke-width": 6, "stroke-linecap": "round" }, g);
        [[-14, -2], [-6, -4], [0, 0], [-10, 4]].forEach(([dx, dy]) => S("rect", { x: x + dx - 8, y: y + dy - 2, width: 5, height: 5, fill: "#fff" }, g));
      },
      tweezers(g, x, y) {
        S("path", { d: `M${x - 6} ${y - 28} L${x - 2} ${y + 26} M${x + 6} ${y - 28} L${x + 2} ${y + 26}`, stroke: "#8b95a0", "stroke-width": 7, "stroke-linecap": "round" }, g);
      },
      plaster(g, x, y) {
        S("rect", { x: x - 30, y: y - 11, width: 60, height: 22, rx: 10, fill: "#e8b98f", stroke: "#b88a60", "stroke-width": 3, transform: `rotate(-20 ${x} ${y})` }, g);
        S("rect", { x: x - 9, y: y - 8, width: 18, height: 16, rx: 3, fill: "#f6dcc4", transform: `rotate(-20 ${x} ${y})` }, g);
      },
      unknown(g, x, y) {
        S("circle", { cx: x, cy: y, r: 20, fill: "#b9b3aa" }, g);
      },
    };
    function drawTray() {
      const tray = ctx.tray && ctx.tray.length ? ctx.tray : Object.keys(DATA.items).map((id) => ({ id }));
      const g = S("g", {}, svg);
      S("rect", { x: 8, y: 478, width: Math.max(300, 26 + tray.length * 96), height: 78, rx: 16, fill: "#e4d9c8", stroke: "#b9a88f", "stroke-width": 3 }, g);
      tray.forEach((it, i) => {
        const x = 58 + i * 96;
        const y = 516;
        const d = def(it.id);
        const usable = !!d.use;
        const dg = S("g", { class: "hc-dish" + (usable ? "" : " hc-off"), "data-heal": "dish-" + it.id }, g);
        S("ellipse", { cx: x, cy: y + 4, rx: 42, ry: 32, fill: "#fff", stroke: "#9c8b75", "stroke-width": 3 }, dg);
        const src = artSrc(it.id);
        if (src) S("image", { href: src, x: x - 34, y: y - 30, width: 68, height: 60 }, dg);
        else (icons[d.use] || icons.unknown)(dg, x, y, d.temp);
        const tickMark = S("path", { d: `M${x + 18} ${y - 26} l7 8 l14 -16`, stroke: "#3f9a4f", "stroke-width": 6, fill: "none", opacity: 0, "stroke-linecap": "round" }, dg);
        if (usable) {
          els.dish[it.id] = { g: dg, tick: tickMark, id: it.id };
          dg.addEventListener("click", () => lift(it.id));
        }
      });
      const d = S("g", { "data-heal": "done" }, svg);
      S("rect", { x: 856, y: 480, width: 132, height: 74, rx: 22, fill: "#4f9a58", stroke: "#2f6a38", "stroke-width": 4 }, d);
      S("path", { d: "M893 516 l18 18 l36 -36", stroke: "#fff", "stroke-width": 11, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, d);
      els.done = d;
      d.addEventListener("click", finish);
    }
    const dishOf = (use) => Object.keys(els.dish).filter((id) => useOf(id) === use);

    /* ---- play ---- */
    function poke() {
      clearTimeout(idleT);
      [...svg.querySelectorAll(".hc-pulse")].forEach((e) => e.classList.remove("hc-pulse"));
      if (finished) return;
      idleT = setTimeout(() => !dead && hintNext(), 8000);
    }
    function hintNext() {
      const r = R.rows.find((x) => !ticked.has(x.id));
      if (!r) return els.done.classList.add("hc-pulse");
      card.pulse(r.id);
      const on = (ids) => ids.forEach((id) => els.dish[id] && els.dish[id].g.classList.add("hc-pulse"));
      if (r.id === "water") {
        if (st.poured.length && !holding) els.feet.classList.add("hc-pulse");
        else on(dishOf("jug")); // both jugs: the hint never says which
      } else if (r.id === "salt") on(dishOf("salt"));
      else if (!feetIn) els.feet.classList.add("hc-pulse");
      else if (r.id === "thorn") on(dishOf("tweezers"));
      else if (r.id === "plaster") on(dishOf("plaster"));
    }
    function closeStep(id) {
      const use = useOf(id);
      let done = false;
      if (use === "jug" && st.poured.length) (done = true), tick("water");
      if (use === "salt" && st.spoons > 0 && R.salt) (done = true), tick("salt");
      if (use === "plaster" && st.plaster) (done = true), tick("plaster");
      if (use === "tweezers" && st.plucks.length) done = true;
      if (done && els.dish[id]) els.dish[id].tick.setAttribute("opacity", 1);
      if (use === "jug" && done && !R.list && R.salt) reveal("salt");
    }
    function putDown() {
      if (!holding) return;
      closeStep(holding);
      els.dish[holding] && els.dish[holding].g.classList.remove("hc-up");
      holding = null;
    }
    function lift(id) {
      if (finished) return;
      poke();
      sfx("tap");
      if (holding === id) return;
      putDown();
      holding = id;
      els.dish[id].g.classList.add("hc-up");
      if (root.Onboard) root.Onboard.signal("heal-foot-lift");
      if (useOf(id) === "tweezers" && feetIn) sayThorn();
    }
    function tapTub() {
      if (finished) return;
      poke();
      const d = holding && def(holding);
      if (!d) return;
      if (d.use === "jug") {
        st.poured.push(d.temp);
        if (root.Onboard) root.Onboard.signal("heal-foot-pour");
        sfx("whoosh");
        const stream = S("path", { d: `M${TUB.cx + 180} 120 Q${TUB.cx + 150} 200 ${TUB.cx + 140} ${TUB.cy}`, stroke: d.temp === "hot" ? "#8fc6e6" : "#5aa8d8", "stroke-width": 16, fill: "none", "stroke-linecap": "round", opacity: 0.85, "pointer-events": "none" }, svg);
        anim(stream, [{ opacity: 0 }, { opacity: 0.9, offset: 0.2 }, { opacity: 0.9, offset: 0.7 }, { opacity: 0 }], { duration: 900 });
        later(() => stream.remove(), 900);
        els.water.setAttribute("opacity", 0.42);
        anim(els.water, [{ transform: "scaleY(0.2)", transformOrigin: "50% 100%" }, { transform: "scaleY(1)", transformOrigin: "50% 100%" }], { duration: 700 });
        drawTemp();
        if (ctx.tally) ctx.tally(holding, st.poured.filter((t) => t === d.temp).length);
      } else if (d.use === "salt") {
        st.spoons++;
        sfx("pop");
        const sp = S("g", {}, els.salt);
        for (let i = 0; i < 9; i++) S("rect", { x: TUB.cx - 150 + rng() * 60 + st.spoons * 40, y: TUB.cy - 40 + rng() * 40, width: 5, height: 5, fill: "#fff" }, sp);
        anim(sp, [{ transform: "translateY(-80px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: 400 });
        if (ctx.tally) ctx.tally(holding, st.spoons);
      }
    }
    function drawTemp() {
      const fx = els.fx;
      while (fx.firstChild) fx.firstChild.remove();
      const hot = st.poured.includes("hot");
      const cold = st.poured.includes("cold");
      if (hot) {
        [-200, -60, 90, 230].forEach((dx, i) => {
          const p = S("path", { d: `M${TUB.cx + dx} ${TUB.cy - 70} q-14 -18 0 -34 q14 -16 0 -34`, stroke: "#fff", "stroke-width": 7, fill: "none", opacity: 0.8, "stroke-linecap": "round" }, fx);
          anim(p, [{ transform: "translateY(0)", opacity: 0.8 }, { transform: "translateY(-30px)", opacity: 0 }], { duration: 1600, iterations: Infinity, delay: i * 350 });
        });
      }
      if (cold) {
        [[-290, -10], [-250, 30], [250, 20], [285, -15]].forEach(([dx, dy]) => S("rect", { x: TUB.cx + dx - 14, y: TUB.cy + dy - 14, width: 28, height: 28, rx: 6, fill: "#f2fbff", stroke: "#8fc3d9", "stroke-width": 3, opacity: 0.95 }, fx));
      }
    }
    function tapFeet() {
      if (finished) return;
      poke();
      if (feetIn || !st.poured.length) {
        anim(els.feet, [{ transform: `translateY(${feetIn ? 0 : UP}px)` }, { transform: `translateY(${(feetIn ? 0 : UP) - 10}px)` }, { transform: `translateY(${feetIn ? 0 : UP}px)` }], { duration: 250 });
        return;
      }
      putDown();
      feetIn = true;
      if (root.Onboard) root.Onboard.signal("heal-foot-in");
      els.feet.style.transform = "translateY(0px)";
      sfx("whoosh");
      const cold = st.poured[0] === "cold";
      later(() => {
        sayLine(cold ? "brr" : "ahh");
        bubble(cold ? "Brrr!" : "Ahhh...", 485, 70);
        patient.react && patient.react(cold ? "ouch" : "relief");
        SIDES.forEach((s) => wiggleAll(s));
      }, 500);
      later(nextCall, 1700);
    }
    function wiggle(side, k) {
      const t = els.toe[key(side, k)];
      anim(t.toe, [{ transform: "rotate(0)" }, { transform: "rotate(-18deg)" }, { transform: "rotate(16deg)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(0)" }], { duration: 520 });
    }
    function wiggleAll(side) {
      for (let k = 0; k < 5; k++) later(() => wiggle(side, k), k * 70);
    }
    function nextCall() {
      if (callIdx < R.calls.length) {
        const row = R.rows.find((r) => r.id === "call" + callIdx);
        if (R.list) sayRow(row);
        else reveal(row.id);
      } else sayThorn();
    }
    function sayThorn() {
      if (thornSaid) return;
      thornSaid = true;
      reveal("thorn", false);
      sayRow(R.rows.find((r) => r.id === "thorn"));
      patient.react && patient.react("ouch");
    }
    function tapToe(side, k) {
      if (finished) return;
      poke();
      const use = holding && useOf(holding);
      if (use === "tweezers") return; // the tweezers pluck (a drag), a tap does nothing
      if (use === "plaster") {
        const first = !st.plaster;
        if (st.plaster) els.toe[key(st.plaster.side, st.plaster.k)].plaster.setAttribute("opacity", 0);
        st.plaster = { side, k };
        els.toe[key(side, k)].plaster.setAttribute("opacity", 1);
        sfx("pop");
        if (first) {
          patient.react && patient.react("happy");
          bubble("♥", FOOT_X[side], 150);
        }
        return;
      }
      wiggle(side, k);
      if (feetIn && callIdx < R.calls.length) {
        putDown();
        st.picks[callIdx] = { side, k };
        sfx("pop");
        sayLine("tickle");
        patient.react && patient.react("giggle");
        tick("call" + callIdx);
        callIdx++;
        later(nextCall, 900);
      } else patient.react && patient.react("giggle");
    }
    function startPluck(e, side, k) {
      if (finished || !holding || useOf(holding) !== "tweezers" || !feetIn) return;
      e.preventDefault();
      poke();
      const t = els.toe[key(side, k)];
      drag = { side, k, y0: toSvg(e).y, id: e.pointerId };
      try {
        svg.setPointerCapture(e.pointerId);
      } catch (_) {
        /* synthetic pointers */
      }
      els.arrow.setAttribute("transform", `translate(${t.x},${t.y + t.r})`);
      els.arrow.setAttribute("opacity", 1);
      els.tw = S("g", { "pointer-events": "none" }, svg);
      S("path", { d: `M${t.x - 6} ${t.y - 50} L${t.x - 2} ${t.y} M${t.x + 6} ${t.y - 50} L${t.x + 2} ${t.y}`, stroke: "#8b95a0", "stroke-width": 7, "stroke-linecap": "round" }, els.tw);
    }
    function movePluck(e) {
      if (!drag) return;
      const dy = Math.max(0, toSvg(e).y - drag.y0);
      if (els.tw) els.tw.setAttribute("transform", `translate(0,${Math.min(dy, 70)})`);
      const t = els.toe[key(drag.side, drag.k)];
      t.toe.style.transform = `translateY(${Math.min(dy, 60) * 0.25}px)`;
      if (dy >= 55) {
        const d = drag;
        endPluck();
        pluck(d.side, d.k);
      }
    }
    function endPluck() {
      if (!drag) return;
      const t = els.toe[key(drag.side, drag.k)];
      t.toe.style.transform = "";
      drag = null;
      els.arrow.setAttribute("opacity", 0);
      if (els.tw) els.tw.remove();
      els.tw = null;
    }
    function pluck(side, k) {
      const first = !st.plucks.length;
      st.plucks.push({ side, k });
      if (root.Onboard) root.Onboard.signal("heal-foot-pluck");
      const t = els.toe[key(side, k)];
      const isThorn = !thornOut && side === R.thorn.side && k === R.thorn.k;
      sfx("pop");
      const g = S("g", {}, els.fly);
      if (isThorn) {
        thornOut = true;
        S("path", { d: `M${t.x} ${t.y + 6} l-7 30 l7 -8 l7 8 Z`, fill: "#6b4a2b", stroke: "#3a2e28", "stroke-width": 2 }, g);
        sayLine("phew");
        bubble("Phew!", 485, 70);
        patient.react && patient.react("relief");
      } else {
        S("circle", { cx: t.x, cy: t.y + 20, r: 9, fill: "#eee6da", stroke: "#b9ad9c", "stroke-width": 2 }, g); // a bit of fluff
        sayLine("tickle");
        patient.react && patient.react("giggle");
      }
      wiggle(side, k);
      anim(g, [{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: "translate(40px,-160px) rotate(200deg)", opacity: 1, offset: 0.6 }, { transform: "translate(70px,-60px) rotate(360deg)", opacity: 0 }], { duration: 1100 });
      later(() => g.remove(), 1100);
      if (first) {
        tick("thorn");
        later(() => reveal("plaster"), 900);
      }
    }
    function finish() {
      if (finished) return;
      putDown();
      finished = true;
      clearTimeout(idleT);
      const g = grade(R, st);
      g.forEach((r) => log({ type: r.right ? "right" : "wrong", rowId: r.id }));
      if (st.plucks.length > 1) log({ type: "extra", rowId: "thorn", detail: `${st.plucks.length - 1} more plucks` });
      const right = g.filter((r) => r.right).length;
      patient.react && patient.react("happy");
      SIDES.forEach((s) => wiggleAll(s));
      if (ctx.done) ctx.done({ right, total: g.length, hints: 0, words: R.words, rows: g });
    }

    async function start() {
      await Promise.all([load(), loadArt()]);
      if (dead) return;
      R = makeRound(DATA, level, rng, ctx.side);
      st = newState(R);
      drawScene();
      drawTray();
      svg.addEventListener("pointermove", movePluck);
      svg.addEventListener("pointerup", endPluck);
      svg.addEventListener("pointercancel", endPluck);
      svg.addEventListener("click", poke);
      if (!R.list) revealed.push("water");
      setRows();
      let t = 300;
      R.rows.forEach((row) => {
        if (!(row.id === "water" || (R.list && row.id === "salt"))) return;
        later(() => sayRow(row), t);
        t += 1500;
      });
      poke();
      if (ctx.onboard) {
        const jugs = dishOf("jug").map((id) => `.heal-c-foot [data-heal="dish-${id}"]`);
        ctx.onboard([
          { spotlight: jugs, ghost: { gesture: "tap" }, wait: "heal-foot-lift" },
          { spotlight: `.heal-c-foot [data-heal="tub"]`, ghost: { gesture: "tap" }, wait: "heal-foot-pour" },
          { spotlight: `.heal-c-foot [data-heal="feet"]`, ghost: { gesture: "tap" }, wait: "heal-foot-in" },
        ]);
      }
    }
    return {
      start,
      destroy() {
        dead = true;
        clearTimeout(idleT);
        timers.forEach(clearTimeout);
        wrap.remove();
      },
      debug() {
        return { round: R, state: st, holding, feetIn, callIdx, thornOut, ticked: [...ticked], finished };
      },
      where(k) {
        const e = svg.querySelector(`[data-heal="${k}"]`);
        if (!e) return null;
        const b = (k === "feet" ? e.querySelector("ellipse") : e).getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, h: b.height };
      },
    };
  }

  return {
    id: ID,
    part: "body-foot",
    ailments: ["sore-feet", "thorn"],
    items: ["jug-hot", "jug-cold", "spi-16", "tool-tweezers", "care-plaster"],
    gestures: ["tap", "drag"],
    levels: [1, 2, 3],
    mount,
    bot,
    makeRound,
    grade,
    newState,
    load,
  };
});
