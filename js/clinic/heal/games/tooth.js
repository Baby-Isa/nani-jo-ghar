/*
 * H4 Brush up, brush down: a healing game for the clinic.
 * docs/clinic-heal-api.md (the contract), docs/modes/clinic-design.md Q4 H4.
 *
 * Gestures (fixed at every level, UX s12): brush = swipe on the teeth in a
 * direction (one swipe, one stroke); tap the dish, tap the spot (the drill on
 * a tooth; the bug, one hop per tap; the paste colour, then the crack).
 *
 * The Kutchi decides every row: the direction chain (random per round), the
 * tooth by size (wadho / nindho) and the bug's hop count (level 1); longer
 * chains with left/right (level 2); the patient's own left/right, mirrored on
 * screen, and the paste colour on a cracked tooth (level 3). A step's line
 * ticks when the item is put down, whatever was done; mistakes are logged
 * silently. The bug never reaches the jar by itself: it jumps in when the
 * step closes, so the hops never show the count.
 *
 * Pure core (plan, judge, bot) runs in Node for build/leak_clinic_heal_a.mjs.
 */
(function (root) {
  "use strict";
  const ID = "tooth";
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

  /* KIT-A:BEGIN — identical in knee.js, ear.js and tooth.js (build/test_clinic_heal_a.py checks) */
  const pick = (rng, a) => a[Math.floor(rng() * a.length) % a.length];
  const shuffle = (rng, a) => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1)) % (i + 1);
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  const NUM = (n) => "num-0" + n;
  /** A card line from data: "{n} {taps}" with word ids -> {kutchi, english, parts} (placeholders as [EN: ...]). */
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
    const e = cap(run(L.e, "e"));
    const parts = [];
    k.split(/(\[EN: [^\]]*\])/).forEach((s) => {
      if (!s) return;
      const m = /^\[EN: (.*)\]$/.exec(s);
      parts.push(m ? { t: m[1], ph: true } : { t: s, ph: false });
    });
    return { kutchi: k, english: e, parts, line: lineId, voice: L.voice || "doctor" };
  }
  const wordsOf = (D, ids) => [...new Set(ids)].map((id) => ({ id, kutchi: D.words[id].kutchi, english: D.words[id].english, placeholder: !D.words[id].kutchi }));

  const NS = "http://www.w3.org/2000/svg";
  const S = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const COLOURS = { red: "#c9483b", green: "#4f9a58", blue: "#3f76b8", yellow: "#e5b33d", pink: "#e98fb0", white: "#f4f1ea", orange: "#e58a3a" };
  function kitCss() {
    if (document.getElementById("hA-css")) return;
    const st = document.createElement("style");
    st.id = "hA-css";
    st.textContent = `
.hA-root{position:absolute;inset:0;overflow:hidden;user-select:none;-webkit-user-select:none;touch-action:none;background:#f6efe4}
.hA-root svg{width:100%;height:100%;display:block;touch-action:none}
.hA-dish,.hA-done{cursor:pointer;transform-box:fill-box;transform-origin:center}
.hA-dish.lift>rect{stroke:#e2a33b;stroke-width:7}
.hA-dish.lift{transform:translateX(12px) scale(1.04)}
.hA-dish.used{opacity:.4}
.hA-dish.throb,.hA-done.throb{animation:hAthrob 1s ease-in-out infinite}
@keyframes hAthrob{50%{transform:scale(1.08)}}
.hA-track{fill:none;stroke:#e2a33b;stroke-width:5;stroke-dasharray:10 10;opacity:.9;animation:hAdash 1.2s linear infinite}
@keyframes hAdash{to{stroke-dashoffset:-40}}
.hA-pop{font:800 34px system-ui,sans-serif;fill:#3a2e28;paint-order:stroke;stroke:#fff;stroke-width:7px}
.hA-arrow{fill:#e2a33b;opacity:.95;animation:hAnudge 1s ease-in-out infinite}
@keyframes hAnudge{50%{opacity:.45}}
`;
    document.head.appendChild(st);
  }
  /** Rough placeholder art (data/clinic/rough-art.json): sprites[id] || sprites[alias[id]]; greybox when absent. */
  let ART = null;
  function loadArt(base) {
    if (ART) return Promise.resolve(ART);
    return fetch(base + "data/clinic/rough-art.json")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((j) => (ART = Object.assign({ sprites: {}, alias: {}, patients: {}, base }, j, { base })));
  }
  /** A sprite's URL for the first id that has one, or null. */
  function spriteUrl(...ids) {
    if (!ART) return null;
    for (const id of ids) {
      if (!id) continue;
      const sp = ART.sprites[id] || ART.sprites[ART.alias[id]];
      if (sp && sp.file) return /^(https?:|\/)/.test(sp.file) ? sp.file : ART.base + sp.file;
    }
    return null;
  }
  const baseOf = (id) => String(id || "").replace(/-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/, "");
  const colourOf = (id) => (/-(red|blue|green|yellow|white|black|pink|orange|purple|brown)$/.exec(String(id || "")) || [])[1] || null;
  /** An item's picture: the rough sprite if there is one (its colour first), else the greybox icon. */
  function drawItem(g, item, colour, icons, size, artIds) {
    const alt = (artIds && artIds[item]) || [];
    const url = spriteUrl(colour && item + "-" + colour, ...alt.map((a) => (colour ? [a + "-" + colour, a] : [a])).flat(), item);
    if (url) {
      S("image", { href: url, x: -size / 2, y: -size / 2, width: size, height: size, preserveAspectRatio: "xMidYMid meet" }, g);
      return;
    }
    (icons[item] || icons.other)(S("g", { transform: `scale(${size / 90})` }, g), COLOURS[colour] || colour);
  }

  /**
   * The shared frame of a heal-A game: the SVG stage (1000x600 design units),
   * the tray as a column of dishes on the left (the pharmacy's order), Done on
   * the right, the card rows, the steps (a dish in hand; it closes, and its
   * line ticks, when the next dish is picked after something was done, or on
   * Done), the silent log, the free idle throb, the finale and ctx.done.
   * spec: {P, D, icons, judge, onPick(dish), onFinish(opts) -> Promise, sideRow}
   */
  function kit(stage, ctx, spec) {
    kitCss();
    const { P, icons, judge } = spec;
    const level = P.level;
    const events = [];
    const timers = [];
    const K = { P, events, level, alive: true, ending: false, result: null, hints: 0 };
    if (getComputedStyle(stage).position === "static") stage.style.position = "relative";
    const rootEl = document.createElement("div");
    rootEl.className = "hA-root hA-" + P.id;
    stage.appendChild(rootEl);
    const svg = S("svg", { viewBox: "0 0 1000 600", preserveAspectRatio: "xMidYMid meet" }, rootEl);
    K.svg = svg;
    K.sceneG = S("g", {}, svg);
    const trayG = S("g", {}, svg);
    K.fxG = S("g", { "pointer-events": "none" }, svg);
    K.later = (fn, ms) => timers.push(setTimeout(() => K.alive && fn(), ms));
    K.toSvg = (ev) => {
      const p = svg.createSVGPoint();
      p.x = ev.clientX;
      p.y = ev.clientY;
      const m = svg.getScreenCTM();
      return m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 };
    };
    K.toScreen = (x, y) => {
      const p = svg.createSVGPoint();
      p.x = x;
      p.y = y;
      const q = p.matrixTransform(svg.getScreenCTM());
      return { x: q.x, y: q.y };
    };
    K.pop = (text, x, y, ms = 800) => {
      const t = S("text", { x, y, "text-anchor": "middle", class: "hA-pop" }, K.fxG);
      t.textContent = text;
      t.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-40px)", opacity: 0 }], { duration: ms, easing: "ease-out" });
      K.later(() => t.remove(), ms);
    };
    K.react = (mood) => {
      try {
        if (K.faceMood) K.faceMood(mood);
        if (ctx.patient && ctx.patient.react) ctx.patient.react(mood);
      } catch (e) {}
    };
    K.pose = (name) => {
      try {
        if (ctx.patient && ctx.patient.pose) ctx.patient.pose(name);
      } catch (e) {}
    };
    /** Say a row's line: the filled words (never the data's template), in its speaker's voice. */
    K.say = (row) => {
      try {
        if (!ctx.say || !row) return;
        if (typeof row === "string") return ctx.say(row);
        ctx.say({ kutchi: row.kutchi, english: row.english, who: row.voice, placeholder: row.placeholder }, { who: row.voice });
      } catch (e) {}
    };
    const safe = (fn) => {
      try {
        fn();
      } catch (e) {}
    };

    /* the tray: the child's dishes in the pharmacy's order. With the real host they are the sidebar's
       dishes (ctx.trayUI); a needed item missing from the tray is the doctor's spare, drawn on our stage. */
    const hostTray = !!(ctx.trayUI && ctx.trayUI.onTap && ctx.trayUI.dishes);
    const tray = (ctx.tray || []).map((t) => (typeof t === "string" ? { id: t } : t));
    const dishes = [];
    tray.forEach((t, i) => {
      const item = baseOf(t.id);
      dishes.push({ item, colour: t.colour || colourOf(t.id), count: t.count, useful: !t.wrong && P.items.includes(item), host: hostTray ? i : null });
    });
    P.items.forEach((id) => {
      if (!dishes.some((d) => d.item === id && d.useful)) dishes.push({ item: id, useful: true, spare: true, host: null });
    });
    const own = dishes.filter((d) => d.host == null);
    const dishH = Math.min(118, Math.floor((560 - (own.length - 1) * 8) / Math.max(3, own.length)));
    own.forEach((d, i) => {
      const gg = S("g", { transform: `translate(18,${20 + i * (dishH + 8)})` }, trayG);
      const g = S("g", { class: "hA-dish", id: "hA-dish-" + dishes.indexOf(d), "data-item": d.item }, gg);
      S("rect", { x: 0, y: 0, width: 128, height: dishH, rx: 18, fill: "#fffaf2", stroke: d.spare && hostTray ? "#e2a33b" : "#cdbfa8", "stroke-width": 3, "stroke-dasharray": d.spare && hostTray ? "8 6" : "none" }, g);
      drawItem(S("g", { transform: `translate(64,${dishH / 2})` }, g), d.item, d.colour, icons, Math.min(96, dishH - 16), spec.art);
      d.g = g;
      d.el = g;
      g.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation();
        choose(d);
      });
    });
    if (hostTray) {
      const els = ctx.trayUI.dishes();
      dishes.forEach((d) => {
        if (d.host != null) d.el = els[d.host];
      });
      ctx.trayUI.onTap((i) => {
        const d = dishes.find((x) => x.host === i);
        if (d) choose(d);
      });
      // no dishes of our own: the scene gets the room
      if (!own.length) svg.setAttribute("viewBox", "150 0 850 600");
    }
    dishes.forEach((d) => (d.row = P.rows.find((r) => r.item === d.item && d.useful) || null));
    const dishUI = (d, what, on = true) =>
      safe(() => {
        if (d.host != null) {
          if (what === "lift") ctx.trayUI.select(on ? d.host : -1);
          else if (what === "used") ctx.trayUI.used(d.host, on);
          else if (what === "throb") ctx.trayUI.pulse(d.host, on);
        } else d.g.classList.toggle(what, on);
      });
    K.dishUI = dishUI;
    K.dishes = dishes;
    K.dishOf = (item) => dishes.find((d) => d.item === item && d.useful) || dishes.find((d) => d.item === item);
    /* Done: the host's big button on the right, else our own */
    let doneEl;
    if (ctx.button) {
      doneEl = ctx.button("✓", () => K.finish(), "done");
      safe(() => doneEl.setAttribute("aria-label", "Done"));
    } else {
      doneEl = S("g", { class: "hA-done", id: "hA-done", transform: "translate(866,466)" }, svg);
      const doneIn = S("g", {}, doneEl);
      S("rect", { x: 0, y: 0, width: 120, height: 116, rx: 24, fill: "#4f9a58", stroke: "#2f6a38", "stroke-width": 4 }, doneIn);
      S("path", { d: "M30 58 L52 82 L92 36", stroke: "#fff", "stroke-width": 12, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, doneIn);
      doneEl.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation();
        K.finish();
      });
    }
    const doneThrob = (on) => safe(() => doneEl.classList.toggle("throb", on));
    K.doneEl = doneEl;

    /* the patient's face in the corner (our close-up covers the host's figure): the rough sprite per mood, else a greybox face */
    const kind = (ctx.patient && ctx.patient.kind) || "girl";
    const moods = (ART && ART.patients && ART.patients[kind]) || null;
    const face = S("g", { class: "hA-face", transform: ctx.button ? "translate(870,440)" : "translate(870,20)", "pointer-events": "none" }, svg);
    const faceIn = S("g", {}, face);
    let faceImg = null;
    let faceMouth = null;
    if (moods && spriteUrl(moods.neutral)) faceImg = S("image", { href: spriteUrl(moods.neutral), x: 0, y: 0, width: 124, height: 150, preserveAspectRatio: "xMidYMax meet" }, faceIn);
    else {
      S("circle", { cx: 62, cy: 70, r: 52, fill: "#c89f84", stroke: "#a9826a", "stroke-width": 4 }, faceIn);
      S("path", { d: "M14 60 Q20 8 62 12 Q104 8 110 60 Q84 30 62 34 Q40 30 14 60 Z", fill: "#3a2a22" }, faceIn);
      S("circle", { cx: 44, cy: 70, r: 6, fill: "#3a2e28" }, faceIn);
      S("circle", { cx: 80, cy: 70, r: 6, fill: "#3a2e28" }, faceIn);
      faceMouth = S("path", { d: "M44 96 q18 10 36 0", stroke: "#6a3a33", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, faceIn);
    }
    const MOUTH = { neutral: "M44 96 q18 10 36 0", ouch: "M50 102 q12 -14 24 0 q-12 8 -24 0", giggle: "M40 92 q22 26 44 0 z", relief: "M44 98 q18 6 36 0", happy: "M38 90 q24 30 48 0 z", wave: "M40 92 q22 26 44 0 z" };
    let faceT = null;
    K.face = face;
    K.faceMood = (mood) => {
      const m = { ouch: "ouch", giggle: "giggle", relief: "relief", happy: "happy", wave: "wave", sad: "ouch", scared: "ouch", yuck: "ouch", sour: "ouch" }[mood] || "neutral";
      if (faceImg && moods[m]) faceImg.setAttribute("href", spriteUrl(moods[m]) || spriteUrl(moods.neutral));
      if (faceMouth) faceMouth.setAttribute("d", MOUTH[m]);
      safe(() => faceIn.animate([{ transform: "translateY(0)" }, { transform: "translateY(-12px)" }, { transform: "translateY(0)" }], { duration: 260 }));
      clearTimeout(faceT);
      if (m !== "neutral" && !K.ending) faceT = setTimeout(() => K.alive && !K.ending && K.faceMood("neutral"), 1300);
    };

    /* the card */
    safe(() => ctx.card.setRows(P.rows.map((r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, parts: r.parts, voice: r.voice, placeholder: r.placeholder, line: r.line }))));
    P.rows.filter((r) => r.voice === "patient" && r.kind === "side").forEach((r) => K.later(() => K.say(r), 300));

    /* steps */
    let active = null;
    const closed = new Set();
    const ticked = new Set();
    let corrected = false;
    K.closed = closed;
    Object.defineProperty(K, "active", { get: () => active });
    K.stepEvents = (row, kind) => events.filter((e) => e.row === row.id && (!kind || e.kind === kind));
    K.record = (e) => {
      if (!active || !active.row) return null;
      const ev = Object.assign({ row: active.row.id }, e);
      events.push(ev);
      return ev;
    };
    const tick = (id) => {
      if (ticked.has(id)) return;
      ticked.add(id);
      safe(() => ctx.card.tick(id));
    };
    const sideRows = () => P.rows.filter((r) => r.kind === "side");
    function close(d) {
      if (!d || !d.row || closed.has(d.row.id)) return;
      closed.add(d.row.id);
      dishUI(d, "lift", false);
      dishUI(d, "used");
      sideRows().forEach((r) => tick(r.id));
      tick(d.row.id);
      const J = judge(P, events);
      safe(() => ctx.log({ type: J.rows[d.row.id] ? "right" : "wrong", rowId: d.row.id, detail: { did: K.stepEvents(d.row).length } }));
      if (spec.onClose) spec.onClose(d);
    }
    function choose(d) {
      K.poke();
      if (!K.alive || K.ending) return;
      if (d.row && closed.has(d.row.id)) return;
      if (d.spare === undefined && !d.useful && !d.tried) {
        d.tried = true;
        safe(() => ctx.log({ type: "extra", rowId: null, detail: { item: d.item } }));
      }
      if (active && active !== d) {
        if (active.row && K.stepEvents(active.row).length) close(active);
        else dishUI(active, "lift", false);
      }
      active = d;
      dishUI(d, "lift");
      safe(() => ctx.card.pulse(null, false));
      dishes.forEach((x) => x.throbbing && ((x.throbbing = false), dishUI(x, "throb", false)));
      if (d.row && level === 1) K.say(d.row);
      if (d.row) K.tally(d.item, K.stepEvents(d.row).filter((e) => e.counts !== false).length);
      if (spec.onPick) spec.onPick(d);
    }
    K.choose = choose;
    K.tally = (item, n) => safe(() => ctx.tally(item, n));
    /** Level 1 only: the doctor repeats the line, once a game (onboarding's gentle correction). */
    K.gentle = (row) => {
      if (level !== 1 || corrected || !row) return;
      corrected = true;
      K.say(row);
    };

    /* the idle hint: after 8 s of nothing, the next dish (or Done) throbs; free */
    let idleT = null;
    K.poke = () => {
      clearTimeout(idleT);
      doneThrob(false);
      idleT = setTimeout(() => {
        if (!K.alive || K.ending) return;
        const cur = active && active.row && !closed.has(active.row.id) ? active : null;
        const next = (spec.next && spec.next()) || dishes.find((d) => d.row && !closed.has(d.row.id) && d !== active);
        if (cur && !K.stepEvents(cur.row).length) {
          safe(() => ctx.card.pulse(cur.row.id));
        } else if (next) {
          next.throbbing = true;
          dishUI(next, "throb");
          if (next.row) safe(() => ctx.card.pulse(next.row.id));
        } else doneThrob(true);
        K.poke();
      }, 8000);
    };
    K.poke();

    /* the finale */
    K.finish = async (opts = {}) => {
      if (K.ending || !K.alive) return;
      K.ending = true;
      clearTimeout(idleT);
      if (active && active.row && K.stepEvents(active.row).length) close(active);
      const J = judge(P, events);
      P.rows.forEach((r) => {
        if (r.kind === "side") return;
        if (!closed.has(r.id)) safe(() => ctx.log({ type: "wrong", rowId: r.id, detail: { did: 0, skipped: true } }));
      });
      sideRows().forEach((r) => {
        tick(r.id);
        safe(() => ctx.log({ type: J.rows[r.id] ? "right" : "wrong", rowId: r.id, detail: {} }));
      });
      K.react("happy");
      safe(() => ctx.interject && ctx.interject("shabash"));
      if (spec.onFinish) await spec.onFinish(opts);
      if (!K.alive) return;
      const words = P.words.map((w) => ({ kutchi: w.kutchi || "[EN: " + w.english + "]", english: w.english, placeholder: w.placeholder }));
      K.result = { right: J.right, total: J.total, hints: K.hints, words, rows: J.rows };
      safe(() => ctx.done({ right: J.right, total: J.total, hints: K.hints, words }));
    };

    // onboarding (first time only, the core's kit): tap the first dish
    safe(() => ctx.onboard && dishes[0] && ctx.onboard([{ spotlight: dishes[0].el, ghost: { gesture: "tap" } }]));

    K.where = (what, a) => {
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      };
      if (what === "dish") return box(K.dishOf(a).el);
      if (what === "done") return box(doneEl);
      return null;
    };
    K.destroy = () => {
      K.alive = false;
      clearTimeout(idleT);
      timers.forEach(clearTimeout);
      rootEl.remove();
    };
    return K;
  }
  /* KIT-A:END */

  /* ---------------- the pure core ---------------- */
  // eight teeth: the top row and the bottom row, small at the sides, big in the middle
  const TEETH = ["u0", "u1", "u2", "u3", "l0", "l1", "l2", "l3"].map((id) => ({ id, size: /[12]$/.test(id) ? "big" : "small" }));
  const sizeWord = { big: "ph-big", small: "ph-small" };

  function plan(D, level, rng, opts = {}) {
    const L = D.levels[String(level)] || D.levels["1"];
    const ailment = opts.ailment && L.ailments.includes(opts.ailment) ? opts.ailment : pick(rng, L.ailments);
    const rows = [];
    const words = [];
    // the direction chain: random per round, never the same word three times running
    const chain = [];
    while (chain.length < L.chain) {
      const d = pick(rng, L.dirs);
      if (chain.length >= 2 && chain[chain.length - 1] === d && chain[chain.length - 2] === d) continue;
      chain.push(d);
    }
    const list = chain.map((d) => D.words[d].english).join(", ");
    const DD = Object.assign({}, D, { words: Object.assign({}, D.words, { _dirs: { kutchi: null, english: list } }) });
    const bv = L.brush_voice === "patient" ? "heal-tooth-brush-patient" : "heal-tooth-brush";
    rows.push(Object.assign({ id: "brush", kind: "brush", item: "toothbrush", want: { chain, screen: chain.map((d) => D.words[d].screen) }, placeholder: true }, fill(DD, bv, { what: "w-brush", dirs: "_dirs" })));
    words.push(...new Set(chain));
    // the spotted teeth: one big, one small (shuffled seats); the doctor names one by size
    const bigs = TEETH.filter((t) => t.size === "big");
    const smalls = TEETH.filter((t) => t.size === "small");
    const spots = [pick(rng, bigs).id, pick(rng, smalls).id];
    const size = pick(rng, ["big", "small"]);
    const target = spots[size === "big" ? 0 : 1];
    const n = pick(rng, L.shoo);
    rows.push(Object.assign({ id: "drill", kind: "drill", item: "drill", want: { tooth: target, n }, placeholder: false }, fill(D, "heal-tooth-drill", { size: sizeWord[size], tooth: "body-tooth", n: NUM(n), taps: "w-taps" })));
    words.push(sizeWord[size], NUM(n));
    let crack = null;
    if (ailment === "cracked-tooth") {
      crack = pick(rng, TEETH.filter((t) => !spots.includes(t.id))).id;
      const colour = pick(rng, L.colours);
      rows.push(Object.assign({ id: "fill", kind: "fill", item: "paste", want: { colour, tooth: crack }, placeholder: true }, fill(D, "heal-tooth-fill", { what: "w-fill", colour })));
      words.push(colour);
    }
    return { id: ID, level: Number(level), ailment, side: null, rows, spots, crack, colours: L.colours || [], words: wordsOf(D, words), items: D.ailments[ailment].items };
  }

  /** Grade each row from the step events: [{row, kind, dir?, tooth?, colour?}]. */
  function judge(P, events) {
    const out = {};
    P.rows.forEach((r) => {
      const ev = events.filter((e) => e.row === r.id);
      const w = r.want;
      let ok = false;
      if (r.kind === "brush") {
        const got = ev.filter((e) => e.kind === "stroke").map((e) => e.dir);
        ok = got.length === w.screen.length && got.every((d, i) => d === w.screen[i]);
      } else if (r.kind === "drill") {
        const drills = ev.filter((e) => e.kind === "drill");
        const shoo = ev.filter((e) => e.kind === "shoo");
        ok = drills.length >= 1 && drills.every((e) => e.tooth === w.tooth) && shoo.length === w.n;
      } else if (r.kind === "fill") {
        const fills = ev.filter((e) => e.kind === "fill");
        ok = fills.length >= 1 && fills.every((e) => e.colour === w.colour && e.tooth === w.tooth);
      }
      out[r.id] = ok;
    });
    const right = Object.values(out).filter(Boolean).length;
    return { rows: out, right, total: P.rows.length, ear: right === P.rows.length };
  }

  /** Events a player would make: fair, or blind (sees the teeth, the spots and the chain's length; never hears). */
  function play(D, P, strategy, rng) {
    const L = D.levels[String(P.level)];
    const ev = [];
    const fair = strategy === "fair";
    const reader = strategy === "reader"; // reads the English placeholders (directions, colours), guesses the real Kutchi
    const fixed = /^fixed-(\d)$/.exec(strategy);
    const screens = L.dirs.map((d) => D.words[d].screen);
    P.rows.forEach((r) => {
      const w = r.want;
      if (r.kind === "brush") {
        const len = w.screen.length; // the card line's length is visible
        const dirs = fair || reader ? w.screen : Array.from({ length: len }, (_, i) => (strategy === "random" ? pick(rng, screens) : strategy === "alternate" ? screens[i % 2] : screens[0]));
        dirs.forEach((d) => ev.push({ row: r.id, kind: "stroke", dir: d }));
      } else if (r.kind === "drill") {
        const tooth = fair ? w.tooth : strategy === "random" || reader ? pick(rng, P.spots) : strategy === "small-first" ? P.spots[1] : P.spots[0];
        ev.push({ row: r.id, kind: "drill", tooth });
        const n = fair ? w.n : fixed ? Number(fixed[1]) : strategy === "tray-order" ? 1 : pick(rng, L.shoo);
        for (let i = 0; i < n; i++) ev.push({ row: r.id, kind: "shoo" });
      } else if (r.kind === "fill") {
        const colour = fair || reader ? w.colour : strategy === "random" ? pick(rng, P.colours) : P.colours[0];
        ev.push({ row: r.id, kind: "fill", colour, tooth: P.crack });
      }
    });
    return ev;
  }

  function bot(level, rng) {
    const P = plan(DATA, level, rng);
    return {
      rows: P.rows.map((r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, placeholder: r.placeholder })),
      plan: P,
      strategies: ["fair", "reader", "random", "tray-order", "alternate", "small-first", "fixed-1", "fixed-2", "fixed-3", "fixed-4", "fixed-5"],
      solve(strategy) {
        return judge(P, play(DATA, P, strategy, rng));
      },
    };
  }

  /* ---------------- greybox item icons (drawn at 90 units) ---------------- */
  const ICON = {
    toothbrush(g) {
      S("rect", { x: -40, y: -6, width: 70, height: 14, rx: 7, fill: "#5aa0d8", stroke: "#2f6a98", "stroke-width": 3, transform: "rotate(-30)" }, g);
      S("rect", { x: 22, y: -22, width: 22, height: 16, rx: 3, fill: "#fff", stroke: "#9ab", "stroke-width": 2, transform: "rotate(-30)" }, g);
    },
    drill(g) {
      S("rect", { x: -34, y: -10, width: 46, height: 20, rx: 10, fill: "#b9c0c9", stroke: "#6a717b", "stroke-width": 3 }, g);
      S("path", { d: "M12 -5 L40 0 L12 5 Z", fill: "#6a717b" }, g);
      S("circle", { cx: -20, cy: 0, r: 4, fill: "#e46d8f" }, g);
    },
    paste(g) {
      S("path", { d: "M-30 -14 H22 L34 -6 V6 L22 14 H-30 Z", fill: "#fff", stroke: "#8fa3b5", "stroke-width": 3 }, g);
      [-18, -4, 10].forEach((x, i) => S("circle", { cx: x, cy: 0, r: 5, fill: ["#f7f5ee", "#f0cf5a", "#ef9fbf"][i], stroke: "#999", "stroke-width": 1 }, g));
    },
    other(g) {
      S("circle", { r: 26, fill: "#d8d2c8", stroke: "#a09a90", "stroke-width": 3 }, g);
      S("text", { "text-anchor": "middle", y: 10, "font-size": 30, fill: "#7a746a" }, g).textContent = "?";
    },
  };

  /* ---------------- the game ---------------- */
  const game = {
    id: ID,
    part: "body-tooth",
    ailments: ["sugar-bug", "cracked-tooth"],
    items: ["toothbrush", "drill", "paste"],
    gestures: ["tap", "swipe"],
    levels: [1, 2, 3],
    plan: (level, rng, opts) => plan(DATA, level, rng, opts),
    judge,
    load,
    bot,
    mount(stage, ctx) {
      let alive = true;
      let ctl = null;
      return {
        start() {
          return Promise.all([load(), loadArt(base)]).then(([D]) => {
            if (alive) ctl = run(stage, ctx, D);
          });
        },
        destroy() {
          alive = false;
          if (ctl) ctl.destroy();
        },
        get debug() {
          return ctl && ctl.debug;
        },
      };
    },
  };

  /** Rough-art sprite ids per tray item (the colour is tried first). */
  const ART_IDS = { toothbrush: ["toothbrush"], drill: ["dental-drill"], paste: ["filling"] };

  function run(stage, ctx, D) {
    const P = plan(D, ctx.level || 1, ctx.rng || Math.random, { ailment: ctx.ailment && (ctx.ailment.id || ctx.ailment) });
    const K = kit(stage, ctx, { P, icons: ICON, art: ART_IDS, judge, onPick, onClose, onFinish: finale });
    const { sceneG, fxG } = K;

    /* the mouth, wide open, close up */
    const CX = 560;
    const CY = 300;
    S("ellipse", { cx: CX, cy: CY, rx: 350, ry: 250, fill: "#c89f84" }, sceneG);
    S("ellipse", { cx: CX, cy: CY, rx: 320, ry: 215, fill: "#d9707e", stroke: "#b04e5e", "stroke-width": 10 }, sceneG);
    S("ellipse", { cx: CX, cy: CY + 10, rx: 280, ry: 170, fill: "#5a2733" }, sceneG);
    S("ellipse", { cx: CX, cy: CY + 100, rx: 150, ry: 60, fill: "#d9707e" }, sceneG); // the tongue
    const foamG = S("g", { "pointer-events": "none" }, sceneG);
    const teethG = S("g", {}, sceneG);
    const W = { big: 118, small: 84 };
    const H = { big: 104, small: 78 };
    const tooth = {};
    ["u", "l"].forEach((row) => {
      const ids = [0, 1, 2, 3].map((i) => row + i);
      const total = ids.reduce((a, id) => a + W[TEETH.find((t) => t.id === id).size] + 10, -10);
      let x = CX - total / 2;
      ids.forEach((id) => {
        const size = TEETH.find((t) => t.id === id).size;
        const w = W[size];
        const h = H[size];
        const y = row === "u" ? CY - 150 : CY + 150 - h;
        const g = S("g", { "data-tooth": id }, teethG);
        const body = S("rect", { x, y, width: w, height: h, rx: 22, fill: "#fbf8ef", stroke: "#d6cfbf", "stroke-width": 4 }, g);
        tooth[id] = { id, size, x, y, w, h, cx: x + w / 2, cy: y + h / 2, g, body };
        x += w + 10;
      });
    });
    P.spots.forEach((id) => {
      const t = tooth[id];
      t.spot = S("ellipse", { cx: t.cx + 6, cy: t.cy + 4, rx: t.w * 0.2, ry: t.h * 0.17, fill: "#8a5a2a", opacity: 0.85, "pointer-events": "none" }, t.g);
    });
    if (P.crack) {
      const t = tooth[P.crack];
      t.crackEl = S("path", { d: `M${t.cx - 16} ${t.y + 12} l12 18 l-10 14 l14 16 l-8 14`, stroke: "#6a5a4a", "stroke-width": 5, fill: "none", "stroke-linecap": "round", "pointer-events": "none" }, t.g);
    }
    // the jar the bug hops into
    const jar = S("g", { transform: "translate(900,110)", "pointer-events": "none" }, sceneG);
    S("rect", { x: -44, y: -50, width: 88, height: 100, rx: 16, fill: "#dff0f7", stroke: "#8fb3c5", "stroke-width": 4, opacity: 0.9 }, jar);
    S("rect", { x: -50, y: -62, width: 100, height: 18, rx: 6, fill: "#c9483b" }, jar);
    const JAR = [900, 120];
    // the brush, which follows the finger while a swipe is on
    const brushEl = S("g", { visibility: "hidden", "pointer-events": "none" }, fxG);
    ICON.toothbrush(S("g", { transform: "scale(1.8)" }, brushEl));
    // the paste palette (level 3, cracked tooth)
    const palette = S("g", { visibility: "hidden" }, sceneG);
    let colourPicked = null;
    const blobs = {};
    (P.colours || []).forEach((c, i) => {
      const x = CX - 130 + i * 130;
      const g = S("g", { "data-colour": c }, palette);
      S("circle", { cx: x, cy: 548, r: 44, fill: "#fff", stroke: "#cdbfa8", "stroke-width": 3 }, g);
      S("path", { d: `M${x - 26} ${556} q0 -34 26 -40 q26 6 26 40 q-26 12 -52 0z`, fill: D.words[c].hex, stroke: "#999", "stroke-width": 2 }, g);
      blobs[c] = g;
    });
    if (P.colours && P.colours.length) S("rect", { x: CX - 190, y: 496, width: 380, height: 104, rx: 20, fill: "#fffaf2", stroke: "#cdbfa8", "stroke-width": 3 }, palette).parentNode.insertBefore(palette.lastChild, palette.firstChild);

    function onPick(d) {
      palette.setAttribute("visibility", d.item === "paste" && P.crack ? "visible" : "hidden");
    }
    function inMouth(p) {
      return Math.hypot((p.x - CX) / 340, (p.y - CY) / 240) < 1.1;
    }
    function toothAt(p) {
      return Object.values(tooth).find((t) => p.x > t.x - 8 && p.x < t.x + t.w + 8 && p.y > t.y - 8 && p.y < t.y + t.h + 8) || null;
    }

    /* the brush: one swipe, one stroke; foam grows */
    function foam(a, b) {
      for (let i = 0; i < 5; i++) {
        const f = i / 4;
        const x = a.x + (b.x - a.x) * f + (Math.random() - 0.5) * 30;
        const y = a.y + (b.y - a.y) * f + (Math.random() - 0.5) * 30;
        const c = S("circle", { cx: x, cy: y, r: 10 + Math.random() * 14, fill: "#ffffff", opacity: 0.9, stroke: "#dfe8f0", "stroke-width": 2 }, foamG);
        c.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 250 });
      }
    }
    /* the bug */
    let bug = null;
    function hatch(t) {
      const g = S("g", { "pointer-events": "all", "data-bug": "1" }, fxG);
      g.style.cursor = "pointer";
      const b = S("g", {}, g);
      S("ellipse", { cx: 0, cy: 0, rx: 34, ry: 26, fill: "#6ab04c", stroke: "#3d7a2a", "stroke-width": 4 }, b);
      S("circle", { cx: -10, cy: -6, r: 5, fill: "#222" }, b);
      S("circle", { cx: 10, cy: -6, r: 5, fill: "#222" }, b);
      S("path", { d: "M-20 -20 l14 5 M20 -20 l-14 5", stroke: "#222", "stroke-width": 5, "stroke-linecap": "round" }, b); // the eyebrows
      S("path", { d: "M-8 10 q8 6 16 0", stroke: "#222", "stroke-width": 3, fill: "none" }, b);
      [-24, 0, 24].forEach((x) => S("line", { x1: x, y1: 20, x2: x * 1.3, y2: 36, stroke: "#3d7a2a", "stroke-width": 4 }, b));
      S("circle", { r: 58, fill: "transparent" }, g); // a bigger tap target
      const start = [t.cx, t.y + (t.id[0] === "u" ? t.h + 40 : -40)];
      bug = { g, b, x: start[0], y: start[1], sx: start[0], sy: start[1], k: 0 };
      g.setAttribute("transform", `translate(${bug.x},${bug.y})`);
      g.animate([{ transform: `translate(${t.cx}px,${t.cy}px) scale(0.2)` }, { transform: `translate(${bug.x}px,${bug.y - 40}px) scale(1.1)` }, { transform: `translate(${bug.x}px,${bug.y}px) scale(1)` }], { duration: 450 });
      K.pop("BZZZ!", t.cx, t.y - 10, 700);
      if (t.spot) t.spot.remove();
      K.react("ouch");
    }
    function hop() {
      bug.k++;
      // a hop towards the jar, never into it (the count must not show)
      const f = 1 - Math.pow(0.62, bug.k);
      const nx = bug.sx + (JAR[0] - 60 - bug.sx) * f + (bug.k % 2 ? 24 : -24);
      const ny = bug.sy + (JAR[1] + 110 - bug.sy) * f;
      bug.g.animate([{ transform: `translate(${bug.x}px,${bug.y}px)` }, { transform: `translate(${(bug.x + nx) / 2}px,${Math.min(bug.y, ny) - 60}px)` }, { transform: `translate(${nx}px,${ny}px)` }], { duration: 320, easing: "ease-out" });
      bug.x = nx;
      bug.y = ny;
      bug.g.setAttribute("transform", `translate(${nx},${ny})`);
      K.pop("hop!", nx, ny - 50, 500);
    }
    function onClose(d) {
      if (d.item === "drill" && bug) {
        const g = bug.g;
        g.animate([{ transform: `translate(${bug.x}px,${bug.y}px)` }, { transform: `translate(${JAR[0]}px,${JAR[1] - 90}px)` }, { transform: `translate(${JAR[0]}px,${JAR[1]}px) scale(0.6)` }], { duration: 500, fill: "forwards" });
        g.setAttribute("pointer-events", "none");
        K.pop("plop!", JAR[0], JAR[1] - 70, 700);
        bug = null;
      }
      if (d.item === "toothbrush") foamG.animate([{ opacity: 1 }, { opacity: 0.35 }], { duration: 600, fill: "forwards" });
    }

    async function finale() {
      palette.setAttribute("visibility", "hidden");
      if (bug) onClose({ item: "drill" });
      Object.values(tooth).forEach((t, i) => {
        const s = S("path", { d: `M${t.cx} ${t.cy - 20} l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6 z`, fill: "#fff6a8", "pointer-events": "none" }, fxG);
        s.animate([{ opacity: 0, transform: "scale(0.2)" }, { opacity: 1, transform: "scale(1.2)" }, { opacity: 0, transform: "scale(0.6)" }], { duration: 900, delay: i * 60 });
      });
      K.pop("twinkle!", CX, 60, 1100);
      await wait(1100);
    }

    /* the pointer */
    let swipe = null;
    K.svg.addEventListener("pointerdown", (ev) => {
      if (!K.alive || K.ending) return;
      K.poke();
      const d = K.active;
      if (!d) return;
      const p = K.toSvg(ev);
      const row = d.row;
      if (!d.useful || !row) {
        if (inMouth(p)) K.react("giggle");
        return;
      }
      if (d.item === "toothbrush") {
        if (!inMouth(p)) return;
        swipe = { a: p, id: ev.pointerId };
        brushEl.setAttribute("visibility", "visible");
        brushEl.setAttribute("transform", `translate(${p.x},${p.y})`);
        try {
          K.svg.setPointerCapture(ev.pointerId);
        } catch (e) {}
      } else if (d.item === "drill") {
        const onBug = bug && Math.hypot(p.x - bug.x, p.y - bug.y) < 64;
        if (onBug) {
          K.record({ kind: "shoo" });
          hop();
          K.tally("drill", K.stepEvents(row, "shoo").length);
          return;
        }
        const t = toothAt(p);
        if (!t) return K.gentle(row);
        K.record({ kind: "drill", tooth: t.id, counts: false });
        t.g.animate([{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 120, iterations: 3 });
        K.pop("brrr", t.cx, t.cy, 500);
        if (P.spots.includes(t.id) && !t.drilled) {
          t.drilled = true;
          if (bug) onClose({ item: "drill" });
          K.later(() => hatch(t), 380);
        }
      } else if (d.item === "paste") {
        const blob = ev.target.closest && ev.target.closest("[data-colour]");
        if (blob) {
          colourPicked = blob.getAttribute("data-colour");
          Object.entries(blobs).forEach(([c, g]) => g.firstChild.setAttribute("stroke", c === colourPicked ? "#e2a33b" : "#cdbfa8"));
          Object.entries(blobs).forEach(([c, g]) => g.firstChild.setAttribute("stroke-width", c === colourPicked ? 8 : 3));
          return;
        }
        const t = toothAt(p);
        if (!t || !colourPicked) return K.gentle(row);
        K.record({ kind: "fill", colour: colourPicked, tooth: t.id });
        const hex = D.words[colourPicked].hex;
        if (t.crackEl) t.crackEl.setAttribute("stroke", hex);
        if (t.crackEl) t.crackEl.setAttribute("stroke-width", 12);
        K.pop("✨", t.cx, t.cy - 30, 700);
        K.react("relief");
      }
    });
    K.svg.addEventListener("pointermove", (ev) => {
      if (!swipe || ev.pointerId !== swipe.id) return;
      const p = K.toSvg(ev);
      brushEl.setAttribute("transform", `translate(${p.x},${p.y})`);
    });
    const up = (ev) => {
      if (!swipe || ev.pointerId !== swipe.id) return;
      const a = swipe.a;
      swipe = null;
      brushEl.setAttribute("visibility", "hidden");
      const b = K.toSvg(ev);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      if (Math.hypot(dx, dy) < 45 || ev.type === "pointercancel") return;
      const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      const d = K.active;
      if (!d || !d.row) return;
      K.record({ kind: "stroke", dir });
      foam(a, b);
      K.tally("toothbrush", K.stepEvents(d.row, "stroke").length);
      K.react("giggle");
    };
    K.svg.addEventListener("pointerup", up);
    K.svg.addEventListener("pointercancel", up);

    return {
      destroy: K.destroy,
      debug: {
        plan: P,
        events: K.events,
        get result() {
          return K.result;
        },
        /** Screen points for tests: a dish, Done, a tooth, the bug, a colour blob, the mouth. */
        where(what, a) {
          if (what === "tooth") return K.toScreen(tooth[a].cx, tooth[a].cy);
          if (what === "bug") return bug ? K.toScreen(bug.x, bug.y) : null;
          if (what === "mouth") return K.toScreen(CX, CY);
          if (what === "blob") {
            const r = blobs[a].getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
          }
          if (what === "scale") return K.toScreen(100, 0).x - K.toScreen(0, 0).x;
          return K.where(what, a);
        },
      },
    };
  }

  if (typeof module === "object" && module.exports) module.exports = game;
  if (root && root.Clinic && root.Clinic.Heal && root.Clinic.Heal.register) root.Clinic.Heal.register(game);
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this);
