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
    return { id: ID, level: Number(level), ailment, side, cue: !L.side_heard, rows, words: wordsOf(D, words), items: D.ailments[ailment].items };
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
    const reader = strategy === "reader"; // reads the English placeholders, guesses the real Kutchi
    const fixed = /^fixed-(\d)$/.exec(strategy);
    const count = (list) => (fair ? null : fixed ? Number(fixed[1]) : strategy === "tray-order" ? 1 : pick(rng, list));
    // the side: seen on screen at levels 1-2 (the bump, the swirl); a guess at level 3 (a placeholder today)
    const side = fair || reader || P.cue ? P.side : strategy === "random" ? pick(rng, ["left", "right"]) : "left";
    P.rows.forEach((r) => {
      const w = r.want;
      const n = (list) => (fair ? w.n : count(list));
      if (r.kind === "kick") for (let i = 0; i < n(L.kicks); i++) ev.push({ row: r.id, kind: "kick", part: "body-knee", side });
      else if (r.kind === "laps") for (let i = 0; i < n(L.turns); i++) ev.push({ row: r.id, kind: "lap", part: w.part, side });
      else if (r.kind === "path") {
        const path = fair || reader ? w.path : strategy === "random" ? pick(rng, L.paths) : L.paths[0];
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
      strategies: ["fair", "reader", "random", "tray-order", "fixed-1", "fixed-2", "fixed-3", "fixed-4", "fixed-5"],
      solve(strategy) {
        return judge(P, play(DATA, P, strategy, rng));
      },
    };
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
  const ART_IDS = { hammer: ["reflex-hammer"], xray: ["xray-plate"], bandage: ["bandage", "care-bandage"], cast: ["cast", "cast-blue"], crutches: ["crutches"] };

  function run(stage, ctx, D) {
    const P = plan(D, ctx.level || 1, ctx.rng || Math.random, { side: ctx.side, ailment: ctx.ailment && (ctx.ailment.id || ctx.ailment) });
    const K = kit(stage, ctx, { P, icons: ICON, art: ART_IDS, judge, onPick: (d) => trackOn(d.useful ? d.item : "none"), onFinish: finale });
    const { sceneG, fxG } = K;

    /* the scene: the patient's legs on the bench, facing us (their left is on our right) */
    const X = { right: 420, left: 660 };
    const KY = 250;
    const SHIN = [300, 460];
    const skin = "#c89f84";
    S("rect", { x: 190, y: 130, width: 690, height: 90, rx: 14, fill: "#b98a5a" }, sceneG);
    S("rect", { x: 190, y: 214, width: 690, height: 16, fill: "#8d6540" }, sceneG);
    const legs = {};
    ["right", "left"].forEach((side) => {
      const x = X[side];
      const g = S("g", {}, sceneG);
      S("rect", { x: x - 54, y: 150, width: 108, height: 110, fill: skin }, g);
      const shin = S("g", {}, g);
      shin.style.transformBox = "view-box";
      shin.style.transformOrigin = x + "px " + KY + "px";
      S("rect", { x: x - 46, y: SHIN[0] - 30, width: 92, height: SHIN[1] - SHIN[0] + 30, rx: 32, fill: skin }, shin);
      const toe = side === "right" ? -1 : 1;
      S("ellipse", { cx: x + toe * 22, cy: SHIN[1] + 16, rx: 66, ry: 28, fill: "#e8e2d6", stroke: "#a09a90", "stroke-width": 3 }, shin);
      const layers = S("g", {}, shin);
      const knee = S("circle", { cx: x, cy: KY, r: 60, fill: skin, stroke: "#a9826a", "stroke-width": 3 }, g);
      const kneeLayers = S("g", {}, g);
      legs[side] = { g, shin, layers, knee, kneeLayers, x };
    });
    S("path", { d: "M300 36 H780 Q800 36 800 66 V200 H588 L560 168 L520 168 L492 200 H280 V66 Q280 36 300 36 Z", fill: "#5d86b8", stroke: "#3f5f87", "stroke-width": 4 }, sceneG);
    // the visible cue at levels 1-2: a bump on the sore knee, or a sore swirl on the sore leg
    if (P.cue) {
      const x = X[P.side];
      if (P.ailment === "knee-bump") S("circle", { cx: x + 8, cy: KY - 12, r: 22, fill: "#e59a8a", stroke: "#c46f62", "stroke-width": 3, "pointer-events": "none" }, legs[P.side].kneeLayers);
      else {
        const d = [];
        for (let t = 0; t < Math.PI * 4; t += 0.25) d.push((d.length ? "L" : "M") + (x + Math.cos(t) * (4 + t * 3)).toFixed(1) + " " + (385 + Math.sin(t) * (4 + t * 3) * 0.8).toFixed(1));
        S("path", { d: d.join(" "), stroke: "#e46d8f", "stroke-width": 5, fill: "none", "pointer-events": "none" }, legs[P.side].layers);
      }
    }
    // the wrap tracks (shown while the bandage or the cast is in hand)
    const tracks = [];
    ["right", "left"].forEach((side) => {
      [
        ["body-knee", KY, 82, 46],
        ["body-leg", 385, 70, 40],
      ].forEach(([part, cy, rx, ry]) => {
        const parent = part === "body-knee" ? legs[side].kneeLayers : legs[side].layers;
        const el = S("ellipse", { cx: X[side], cy, rx, ry, class: "hA-track", visibility: "hidden", "pointer-events": "none" }, parent);
        tracks.push({ part, side, cx: X[side], cy, rx, ry, el, acc: 0, laps: 0, live: false });
      });
    });
    function trackOn(item) {
      const want = item === "cast" ? ["body-leg"] : item === "bandage" ? (P.rows.some((r) => r.kind === "path") ? ["body-knee", "body-leg"] : ["body-knee"]) : [];
      tracks.forEach((t) => {
        t.live = want.includes(t.part) && (!P.cue || t.side === P.side);
        t.el.setAttribute("visibility", t.live ? "visible" : "hidden");
      });
    }
    // Kasuku, who squawks at every kick
    const kasuku = S("g", { opacity: 0 }, fxG);
    S("ellipse", { cx: 930, cy: 70, rx: 26, ry: 34, fill: "#3fae5a" }, kasuku);
    S("ellipse", { cx: 918, cy: 84, rx: 12, ry: 22, fill: "#2f8a46" }, kasuku);
    S("circle", { cx: 936, cy: 52, r: 6, fill: "#fff" }, kasuku);
    S("circle", { cx: 937, cy: 52, r: 3, fill: "#222" }, kasuku);
    S("path", { d: "M948 58 l16 7 l-16 7 z", fill: "#e5b33d" }, kasuku);

    function hit(x, y) {
      for (const side of ["right", "left"]) {
        const lx = X[side];
        if (Math.hypot(x - lx, y - KY) < 82) return { part: "body-knee", side };
        if (Math.abs(x - lx) < 80 && y > SHIN[0] - 10 && y < SHIN[1] + 60) return { part: "body-leg", side };
      }
      return null;
    }

    /* the kick: the fun */
    function kick(side) {
      const L = legs[side];
      const dir = side === "right" ? 1 : -1;
      L.shin.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${62 * dir}deg)`, offset: 0.3 }, { transform: `rotate(${-12 * dir}deg)`, offset: 0.65 }, { transform: "rotate(0deg)" }], { duration: 560, easing: "ease-out" });
      sceneG.animate([{ transform: "translateY(0)" }, { transform: "translateY(-16px)" }, { transform: "translateY(0)" }], { duration: 300 });
      K.dishes.forEach((dd, i) => dd.el && dd.el.animate && dd.el.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${i % 2 ? 7 : -7}deg)` }, { transform: `rotate(${i % 2 ? -4 : 4}deg)` }, { transform: "rotate(0deg)" }], { duration: 380 }));
      kasuku.animate([{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "translateY(0)", offset: 0.25 }, { opacity: 1, transform: "translateY(4px)", offset: 0.8 }, { opacity: 0, transform: "translateY(30px)" }], { duration: 900 });
      K.pop("SQUAWK!", 880, 150, 700);
      K.pop("BOING!", L.x - dir * 150, 470, 700);
      K.react("giggle");
    }

    /* the X-ray: a bone with a face and a kink; each tap on it is a clonk */
    let xr = null;
    function plate(side) {
      if (xr) xr.g.remove();
      const L = legs[side];
      const g = S("g", { "pointer-events": "none" }, L.layers);
      S("rect", { x: L.x - 60, y: 296, width: 120, height: 178, rx: 12, fill: "#26303a", stroke: "#8fa3b5", "stroke-width": 4, opacity: 0.95 }, g);
      const bone = S("path", { d: `M${L.x} 318 L${L.x + 18} 385 L${L.x - 4} 452`, stroke: "#eef2ff", "stroke-width": 22, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
      S("circle", { cx: L.x + 3, cy: 360, r: 4, fill: "#26303a" }, g);
      S("circle", { cx: L.x + 19, cy: 362, r: 4, fill: "#26303a" }, g);
      const mouth = S("ellipse", { cx: L.x + 12, cy: 376, rx: 5, ry: 7, fill: "#26303a" }, g);
      xr = { g, bone, mouth, side, straight: false };
      K.pop("ooh!", L.x, 290, 600);
      K.react("ouch");
    }
    function clonk() {
      const L = legs[xr.side];
      if (!xr.straight) {
        xr.straight = true;
        xr.bone.setAttribute("d", `M${L.x} 318 L${L.x} 385 L${L.x} 452`);
        xr.mouth.setAttribute("rx", 9);
        xr.mouth.setAttribute("ry", 2.5);
      }
      xr.g.animate([{ transform: "translateY(0)" }, { transform: "translateY(5px)" }, { transform: "translateY(0)" }], { duration: 160 });
      K.pop("CLONK!", L.x, 300, 600);
      K.react("ouch");
    }

    /* wrapping: laps round a track, one lap = one turn */
    const bandColour = (item) => {
      const d = K.dishOf(item);
      return (d && COLOURS[d.colour]) || D.colours[item] || "#f4f1ea";
    };
    function band(t, item, k) {
      const parent = t.part === "body-knee" ? legs[t.side].kneeLayers : legs[t.side].layers;
      const w = t.part === "body-knee" ? 126 : 98;
      const y = t.cy - 36 + ((k * 19) % 64);
      S("rect", { x: t.cx - w / 2, y, width: w, height: 24, rx: 9, fill: bandColour(item), stroke: "#00000033", "stroke-width": 2, transform: `rotate(${k % 2 ? 7 : -7} ${t.cx} ${y + 12})`, "pointer-events": "none" }, parent);
    }

    async function finale(opts) {
      trackOn("none");
      if (opts.hop) {
        const cg = S("g", {}, sceneG);
        ICON.crutches(S("g", { transform: `translate(${X.right - 100},400) scale(2.4)` }, cg));
        ICON.crutches(S("g", { transform: `translate(${X.left + 100},400) scale(2.4)` }, cg));
        K.pop("hop!", 540, 120, 900);
        await wait(300);
        await sceneG.animate([{ transform: "translate(0,0)" }, { transform: "translate(70px,-40px)" }, { transform: "translate(140px,0)" }, { transform: "translate(210px,-40px)" }, { transform: "translate(280px,0)" }, { transform: "translate(760px,-40px)" }], { duration: 1500, fill: "forwards" }).finished.catch(() => {});
      } else {
        K.pop("all better!", 540, 110, 1000);
        await sceneG.animate([{ transform: "translateY(0)" }, { transform: "translateY(-30px)" }, { transform: "translateY(0)" }, { transform: "translateY(-16px)" }, { transform: "translateY(0)" }], { duration: 900 }).finished.catch(() => {});
      }
    }

    /* the pointer on the scene */
    let drag = null;
    K.svg.addEventListener("pointerdown", (ev) => {
      if (!K.alive || K.ending) return;
      K.poke();
      const d = K.active;
      if (!d) return;
      const p = K.toSvg(ev);
      const row = d.row;
      const h = hit(p.x, p.y);
      if (!d.useful || !row) {
        if (d.item === "crutches" && h) K.finish({ hop: true });
        else if (h) K.react("giggle"); // an item that isn't for this: nothing happens on the patient
        return;
      }
      if (d.item === "bandage" || d.item === "cast") {
        const o = tracks
          .filter((t) => t.live)
          .map((t) => ({ t, d: Math.hypot((p.x - t.cx) / t.rx, (p.y - t.cy) / t.ry) }))
          .filter((o) => o.d < 2)
          .sort((a, b) => a.d - b.d)[0];
        if (!o) return K.gentle(row);
        drag = { t: o.t, prev: Math.atan2(p.y - o.t.cy, p.x - o.t.cx), id: ev.pointerId };
        try {
          K.svg.setPointerCapture(ev.pointerId);
        } catch (e) {}
      } else if (d.item === "hammer") {
        if (!h || h.part !== "body-knee") return K.gentle(row);
        K.record({ kind: "kick", part: h.part, side: h.side });
        if (P.cue && h.side !== P.side) K.gentle(row);
        kick(h.side);
        K.tally(d.item, K.stepEvents(row).length);
      } else if (d.item === "xray") {
        if (!h) return K.gentle(row);
        if (xr && h.side === xr.side) {
          K.record({ kind: "clonk" });
          clonk();
          K.tally(d.item, K.stepEvents(row, "clonk").length);
        } else {
          K.record({ kind: "plate", part: "body-leg", side: h.side, counts: false });
          plate(h.side);
          if (P.cue && h.side !== P.side) K.gentle(row);
        }
      }
    });
    K.svg.addEventListener("pointermove", (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const p = K.toSvg(ev);
      const t = drag.t;
      const a = Math.atan2(p.y - t.cy, p.x - t.cx);
      let dd = a - drag.prev;
      if (dd > Math.PI) dd -= 2 * Math.PI;
      if (dd < -Math.PI) dd += 2 * Math.PI;
      drag.prev = a;
      if (Math.hypot(p.x - t.cx, p.y - t.cy) < 12) return;
      t.acc += dd;
      const d = K.active;
      while (d && d.row && Math.abs(t.acc) >= 2 * Math.PI * (t.laps + 1)) {
        t.laps++;
        K.record({ kind: "lap", part: t.part, side: t.side });
        const k = K.stepEvents(d.row).length;
        band(t, d.item, k);
        K.tally(d.item, k);
        K.react("giggle");
        if (P.cue && t.side !== P.side) K.gentle(d.row);
      }
    });
    const up = (ev) => {
      if (drag && ev.pointerId === drag.id) drag = null;
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
        /** Screen points for tests: a dish, Done, a part, a track (centre and radii). */
        where(what, a, b) {
          if (what === "part") return a === "body-knee" ? K.toScreen(X[b], KY) : K.toScreen(X[b], 400);
          if (what === "track") {
            const t = tracks.find((t) => t.part === a && t.side === b);
            const c = K.toScreen(t.cx, t.cy);
            return { c, rx: K.toScreen(t.cx + t.rx, t.cy).x - c.x, ry: K.toScreen(t.cx, t.cy + t.ry).y - c.y };
          }
          return K.where(what, a);
        },
      },
    };
  }

  if (typeof module === "object" && module.exports) module.exports = game;
  if (root && root.Clinic && root.Clinic.Heal && root.Clinic.Heal.register) root.Clinic.Heal.register(game);
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this);
