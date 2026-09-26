/*
 * H3 The seed in the ear: a healing game for the clinic.
 * docs/clinic-heal-api.md (the contract), docs/modes/clinic-design.md Q4 H3.
 *
 * Gestures (fixed at every level, UX s12): tap the dish, tap the spot (the
 * torch on the ear opens the cave; the cotton bud, one swirl per tap; the
 * drops, one drop per tap); pluck = drag a thing out along its arrow.
 *
 * The Kutchi decides every row: the order the things come out (pela ... ne
 * poi ..., by wadho / nindho), the cleaning count and the drops count (level
 * 1); a third thing in the order (level 2); the side and the drops count in
 * the patient's own voice (level 3). A step's line ticks when the item is put
 * down, whatever the count; mistakes are logged silently.
 *
 * Pure core (plan, judge, bot) runs in Node for build/leak_clinic_heal_a.mjs.
 */
(function (root) {
  "use strict";
  const ID = "ear";
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
    const side = opts.side === "left" || opts.side === "right" ? opts.side : pick(rng, ["left", "right"]);
    const rows = [];
    const words = [];
    if (L.side_heard) {
      rows.push(Object.assign({ id: "side", kind: "side", want: { side }, placeholder: true }, fill(D, "heal-ear-side", { side: "side-" + side, part: "body-ear" })));
      words.push("side-" + side);
    }
    // the things in the cave, where they sit (shuffled), and the order they're called in
    const things = L.things.slice();
    const order = shuffle(rng, things);
    const seats = shuffle(rng, [0, 1, 2, 3, 4].slice(0, Math.max(things.length + 1, 3))).slice(0, things.length);
    const place = {};
    things.forEach((t, i) => (place[t] = seats[i]));
    const tw = (t) => D.things[t].word;
    const pl = order.length === 2 ? fill(D, "heal-ear-pluck2", { pela: "lnk-pela", nepoi: "lnk-nepoi", a: tw(order[0]), b: tw(order[1]) }) : fill(D, "heal-ear-pluck3", { pela: "lnk-pela", nepoi: "lnk-nepoi", a: tw(order[0]), b: tw(order[1]), c: tw(order[2]) });
    rows.push(Object.assign({ id: "pluck", kind: "pluck", item: "tweezers", want: { order }, placeholder: false }, pl));
    words.push("lnk-pela", "lnk-nepoi", ...order.map(tw));
    const c = pick(rng, L.clean);
    rows.push(Object.assign({ id: "clean", kind: "count", item: "cotton-bud", want: { n: c, kind: "scrub" }, placeholder: false }, fill(D, "heal-ear-clean", { what: "w-clean", n: NUM(c), times: "w-times" })));
    words.push(NUM(c));
    const dn = pick(rng, L.drops);
    const byPatient = L.drops_voice === "patient";
    rows.push(Object.assign({ id: "drops", kind: "count", item: "drops", want: { n: dn, kind: "drop" }, placeholder: false }, fill(D, byPatient ? "heal-ear-drops-patient" : "heal-ear-drops", { n: NUM(dn), drops: byPatient ? "w-drops-please" : "w-drops" })));
    words.push(NUM(dn));
    return { id: ID, level: Number(level), ailment: "seed-in-ear", side, cue: !L.side_heard, rows, things, place, words: wordsOf(D, words), items: D.ailments["seed-in-ear"].items };
  }

  /** Grade each row from the step events: [{row, kind, side?, thing?}]. */
  function judge(P, events) {
    const out = {};
    P.rows.forEach((r) => {
      const ev = events.filter((e) => e.row === r.id);
      const w = r.want;
      let ok = false;
      if (r.kind === "side") {
        const looks = events.filter((e) => e.kind === "look");
        ok = looks.length > 0 && looks.every((e) => e.side === w.side);
      } else if (r.kind === "pluck") {
        const got = ev.filter((e) => e.kind === "pluck").map((e) => e.thing);
        ok = got.length === w.order.length && got.every((t, i) => t === w.order[i]);
      } else if (r.kind === "count") {
        ok = ev.filter((e) => e.kind === w.kind).length === w.n && ev.every((e) => e.kind === w.kind);
      }
      out[r.id] = ok;
    });
    const right = Object.values(out).filter(Boolean).length;
    return { rows: out, right, total: P.rows.length, ear: right === P.rows.length };
  }

  /** Events a player would make: fair, or blind (sees the cave: positions and sizes; never hears). */
  function play(D, P, strategy, rng) {
    const L = D.levels[String(P.level)];
    const ev = [];
    const fair = strategy === "fair";
    const reader = strategy === "reader"; // reads the English placeholders, guesses the real Kutchi
    const fixed = /^fixed-(\d)$/.exec(strategy);
    const side = fair || reader || P.cue ? P.side : strategy === "random" ? pick(rng, ["left", "right"]) : "left";
    const readOrder = (order) => {
      // placeholder things (the sock) stay where they're read; the Kutchi-named ones are shuffled
      const ph = (t) => !D.words[D.things[t].word].kutchi;
      const guess = shuffle(rng, order.filter((t) => !ph(t)));
      return order.map((t) => (ph(t) ? t : guess.shift()));
    };
    ev.push({ row: null, kind: "look", side });
    const byPos = P.things.slice().sort((a, b) => P.place[a] - P.place[b]);
    const bySize = P.things.slice().sort((a, b) => D.things[b].size - D.things[a].size);
    P.rows.forEach((r) => {
      const w = r.want;
      if (r.kind === "pluck") {
        const order = fair ? w.order : reader ? readOrder(w.order) : strategy === "random" ? shuffle(rng, P.things) : strategy === "big-first" ? bySize : strategy === "small-first" ? bySize.slice().reverse() : byPos;
        order.forEach((t) => ev.push({ row: r.id, kind: "pluck", thing: t }));
      } else if (r.kind === "count") {
        const list = r.id === "clean" ? L.clean : L.drops;
        const n = fair ? w.n : fixed ? Number(fixed[1]) : strategy === "tray-order" ? 1 : pick(rng, list);
        for (let i = 0; i < n; i++) ev.push({ row: r.id, kind: w.kind });
      }
    });
    return ev;
  }

  function bot(level, rng) {
    const P = plan(DATA, level, rng);
    return {
      rows: P.rows.map((r) => ({ id: r.id, kutchi: r.kutchi, english: r.english, placeholder: r.placeholder })),
      plan: P,
      strategies: ["fair", "reader", "random", "tray-order", "big-first", "small-first", "fixed-1", "fixed-2", "fixed-3", "fixed-4", "fixed-5"],
      solve(strategy) {
        return judge(P, play(DATA, P, strategy, rng));
      },
    };
  }

  /* ---------------- greybox item icons (drawn at 90 units) ---------------- */
  const ICON = {
    torch(g) {
      S("rect", { x: -34, y: -12, width: 50, height: 24, rx: 6, fill: "#5d86b8", stroke: "#3f5f87", "stroke-width": 3 }, g);
      S("path", { d: "M16 -18 L36 -26 L36 26 L16 18 Z", fill: "#8fa9c9", stroke: "#3f5f87", "stroke-width": 3 }, g);
      S("ellipse", { cx: 36, cy: 0, rx: 5, ry: 24, fill: "#fff3a8" }, g);
    },
    tweezers(g) {
      S("path", { d: "M-6 -36 L-3 34 M6 -36 L3 34", stroke: "#8a8f99", "stroke-width": 7, "stroke-linecap": "round", fill: "none" }, g);
      S("path", { d: "M-6 -36 Q0 -44 6 -36", stroke: "#8a8f99", "stroke-width": 7, fill: "none" }, g);
    },
    "cotton-bud"(g) {
      S("line", { x1: -26, y1: 26, x2: 26, y2: -26, stroke: "#e9d8f0", "stroke-width": 6, "stroke-linecap": "round" }, g);
      S("ellipse", { cx: -28, cy: 28, rx: 11, ry: 9, fill: "#fff", stroke: "#cfc6b8", "stroke-width": 2, transform: "rotate(-45 -28 28)" }, g);
      S("ellipse", { cx: 28, cy: -28, rx: 11, ry: 9, fill: "#fff", stroke: "#cfc6b8", "stroke-width": 2, transform: "rotate(-45 28 -28)" }, g);
    },
    drops(g, c) {
      S("rect", { x: -16, y: -8, width: 32, height: 42, rx: 8, fill: c || "#4f9a58", stroke: "#2f5f38", "stroke-width": 3 }, g);
      S("rect", { x: -7, y: -30, width: 14, height: 24, rx: 5, fill: "#f4f1ea", stroke: "#a09a90", "stroke-width": 2 }, g);
      S("path", { d: "M0 -44 q7 9 0 12 q-7 -3 0 -12z", fill: "#7fc4e8" }, g);
    },
    other(g) {
      S("circle", { r: 26, fill: "#d8d2c8", stroke: "#a09a90", "stroke-width": 3 }, g);
      S("text", { "text-anchor": "middle", y: 10, "font-size": 30, fill: "#7a746a" }, g).textContent = "?";
    },
  };

  /* ---------------- the game ---------------- */
  const game = {
    id: ID,
    part: "body-ear",
    ailments: ["seed-in-ear"],
    items: ["torch", "tweezers", "cotton-bud", "drops"],
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
  const ART_IDS = { torch: ["torch"], tweezers: ["tweezers"], "cotton-bud": ["cotton-bud"], drops: ["drops", "drops-green"] };

  function run(stage, ctx, D) {
    const P = plan(D, ctx.level || 1, ctx.rng || Math.random, { side: ctx.side });
    const K = kit(stage, ctx, { P, icons: ICON, art: ART_IDS, judge, onPick, onFinish: finale, next: () => (view === "face" ? K.dishOf("torch") : null) });
    const { sceneG, fxG } = K;
    const skin = "#c89f84";

    /* view 1: the face, facing us (their left ear is on our right) */
    const face = S("g", {}, sceneG);
    const HX = 560;
    const HY = 290;
    const EAR = { right: HX - 196, left: HX + 196 };
    ["right", "left"].forEach((s) => {
      S("ellipse", { cx: EAR[s], cy: HY + 10, rx: 44, ry: 66, fill: skin, stroke: "#a9826a", "stroke-width": 4 }, face);
      S("path", { d: `M${EAR[s] + (s === "right" ? 14 : -14)} ${HY - 26} q${s === "right" ? -30 : 30} 30 0 70`, stroke: "#a9826a", "stroke-width": 5, fill: "none" }, face);
    });
    S("ellipse", { cx: HX, cy: HY, rx: 176, ry: 200, fill: skin, stroke: "#a9826a", "stroke-width": 4 }, face);
    S("path", { d: `M${HX - 176} ${HY - 40} Q${HX - 170} ${HY - 230} ${HX} ${HY - 210} Q${HX + 170} ${HY - 230} ${HX + 176} ${HY - 40} Q${HX + 90} ${HY - 150} ${HX} ${HY - 140} Q${HX - 90} ${HY - 150} ${HX - 176} ${HY - 40} Z`, fill: "#3a2a22" }, face);
    const eyes = S("g", {}, face);
    [-62, 62].forEach((dx) => S("circle", { cx: HX + dx, cy: HY - 10, r: 11, fill: "#3a2e28" }, eyes));
    S("path", { d: `M${HX - 8} ${HY + 20} q8 24 16 0`, stroke: "#a9826a", "stroke-width": 4, fill: "none" }, face);
    const mouth = S("path", { d: `M${HX - 44} ${HY + 84} q44 30 88 0`, stroke: "#6a3a33", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, face);
    if (P.cue) {
      const glow = S("ellipse", { cx: EAR[P.side], cy: HY + 10, rx: 50, ry: 72, fill: "#e46d8f", opacity: 0.35, "pointer-events": "none" }, face);
      glow.animate([{ opacity: 0.2 }, { opacity: 0.5 }, { opacity: 0.2 }], { duration: 1600, iterations: Infinity });
    }

    /* view 2: the cave (the ear, close up) */
    const CX = 560;
    const CY = 300;
    const cave = S("g", { visibility: "hidden" }, sceneG);
    S("ellipse", { cx: CX, cy: CY, rx: 320, ry: 270, fill: skin, stroke: "#a9826a", "stroke-width": 6 }, cave);
    const hole = S("ellipse", { cx: CX, cy: CY, rx: 230, ry: 190, fill: "#7a3b45", stroke: "#5a2733", "stroke-width": 6 }, cave);
    S("ellipse", { cx: CX + 30, cy: CY + 20, rx: 150, ry: 120, fill: "#5a2733", opacity: 0.6 }, cave);
    const beam = S("path", { d: `M${CX - 420} ${CY - 320} L${CX - 60} ${CY - 170} L${CX + 120} ${CY + 170} Z`, fill: "#fff3a8", opacity: 0, "pointer-events": "none" }, cave);
    const scrubG = S("g", { "pointer-events": "none" }, cave);
    const thingG = S("g", {}, cave);
    const dish = S("g", { transform: "translate(880,110)", "pointer-events": "none" }, cave);
    S("path", { d: "M-70 -10 Q-80 30 -40 38 Q0 30 40 38 Q80 30 70 -10 Z", fill: "#c5cbd3", stroke: "#8a8f99", "stroke-width": 4 }, dish);
    const SEATS = [
      [CX - 110, CY - 70],
      [CX + 100, CY - 60],
      [CX - 20, CY + 90],
      [CX + 130, CY + 90],
      [CX - 140, CY + 60],
    ];
    const T = {};
    P.things.forEach((id) => {
      const th = D.things[id];
      const [x, y] = SEATS[P.place[id]];
      const g = S("g", { "data-thing": id }, thingG);
      g.style.cursor = "grab";
      const r = 44 * th.size;
      if (th.kind === "sock") {
        S("path", { d: `M${-r * 0.5} ${-r} h${r} v${r * 1.1} q0 ${r * 0.6} ${r * 0.6} ${r * 0.6} v${r * 0.5} h${-r * 1.2} q${-r * 0.9} 0 ${-r * 0.9} ${-r * 0.8} z`, fill: "#e58a3a", stroke: "#a85a1a", "stroke-width": 4 }, g);
        S("rect", { x: -r * 0.5, y: -r, width: r, height: r * 0.35, fill: "#fff", opacity: 0.8 }, g);
      } else {
        S("ellipse", { cx: 0, cy: 0, rx: r * 0.72, ry: r, fill: "#f0dfae", stroke: "#b89a5a", "stroke-width": 4, transform: "rotate(20)" }, g);
        S("path", { d: `M${-r * 0.2} ${-r * 0.5} q${r * 0.2} ${r * 0.5} 0 ${r}`, stroke: "#d8c28a", "stroke-width": 3, fill: "none" }, g);
      }
      // a face: everything in this ear has one
      S("circle", { cx: -r * 0.22, cy: -r * 0.1, r: 3.5 + r * 0.04, fill: "#3a2e28" }, g);
      S("circle", { cx: r * 0.22, cy: -r * 0.1, r: 3.5 + r * 0.04, fill: "#3a2e28" }, g);
      S("path", { d: `M${-r * 0.2} ${r * 0.25} q${r * 0.2} ${r * 0.18} ${r * 0.4} 0`, stroke: "#3a2e28", "stroke-width": 3, fill: "none" }, g);
      // the arrow: out of the cave, away from its middle
      let dx = x - CX;
      let dy = y - CY;
      const m = Math.hypot(dx, dy) || 1;
      dx /= m;
      dy /= m;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      const arrow = S("g", { class: "hA-arrow", visibility: "hidden", "pointer-events": "none", transform: `rotate(${ang})` }, g);
      S("path", { d: `M${r + 10} -9 h44 v-14 l30 23 l-30 23 v-14 h-44 z`, fill: "#e2a33b", stroke: "#fff", "stroke-width": 3 }, arrow);
      g.setAttribute("transform", `translate(${x},${y})`);
      T[id] = { id, g, x, y, dx, dy, arrow, out: false, noise: th.noise };
    });
    let view = "face";
    let lookSide = null;
    function openCave(side) {
      lookSide = side;
      view = "cave";
      beam.setAttribute("opacity", 0);
      face.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
      K.later(() => {
        face.setAttribute("visibility", "hidden");
        cave.setAttribute("visibility", "visible");
        cave.animate([{ opacity: 0, transform: "scale(0.6)" }, { opacity: 1, transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
        beam.animate([{ opacity: 0 }, { opacity: 0.35 }], { duration: 400, fill: "forwards" });
        arrowsOn(K.active && K.active.item === "tweezers");
      }, 300);
    }
    cave.style.transformBox = "view-box";
    cave.style.transformOrigin = CX + "px " + CY + "px";
    function arrowsOn(on) {
      Object.values(T).forEach((t) => t.arrow.setAttribute("visibility", on && !t.out ? "visible" : "hidden"));
    }
    function onPick(d) {
      arrowsOn(view === "cave" && d.item === "tweezers");
    }
    function inCave(p) {
      return Math.hypot((p.x - CX) / 320, (p.y - CY) / 270) < 1.05;
    }
    function hitEar(p) {
      for (const s of ["right", "left"]) if (Math.hypot((p.x - EAR[s]) / 70, (p.y - HY - 10) / 95) < 1) return s;
      return null;
    }
    function scrub(p) {
      const d = [];
      for (let t = 0; t < Math.PI * 3; t += 0.3) d.push((d.length ? "L" : "M") + (p.x + Math.cos(t) * (6 + t * 5)).toFixed(1) + " " + (p.y + Math.sin(t) * (6 + t * 5)).toFixed(1));
      const sw = S("path", { d: d.join(" "), stroke: "#fff", "stroke-width": 7, fill: "none", opacity: 0.9, "stroke-linecap": "round" }, scrubG);
      sw.animate([{ opacity: 0.9 }, { opacity: 0.25 }], { duration: 900, fill: "forwards" });
      K.pop("scrub", p.x, p.y - 30, 500);
      hole.setAttribute("fill", "#8a4b55");
    }
    function drop(p) {
      const dcol = COLOURS[(K.dishOf("drops") || {}).colour] || "#7fc4e8";
      const dr = S("path", { d: `M${p.x} ${p.y - 30} q10 14 0 18 q-10 -4 0 -18z`, fill: dcol, stroke: "#fff", "stroke-width": 2 }, fxG);
      dr.animate([{ transform: "translateY(-160px)", opacity: 1 }, { transform: "translateY(0)", opacity: 1 }, { transform: "translateY(10px)", opacity: 0 }], { duration: 600, easing: "ease-in" });
      K.later(() => dr.remove(), 600);
      K.later(() => K.pop("plip", p.x, p.y, 500), 420);
      K.react("giggle");
    }
    async function pluck(t) {
      t.out = true;
      t.arrow.setAttribute("visibility", "hidden");
      K.pop(t.noise, t.x + t.dx * 120, t.y + t.dy * 120 - 20, 700);
      K.pop("that tickles!", CX, 60, 1000);
      K.react("giggle");
      const n = Object.values(T).filter((x) => x.out).length;
      const tx = 880 + (n - 2) * 34;
      const a = t.g.animate([{ transform: `translate(${t.x + t.dx * 90}px,${t.y + t.dy * 90}px)` }, { transform: `translate(${(t.x + tx) / 2}px,20px) scale(0.8)` }, { transform: `translate(${tx}px,96px) scale(0.55)` }], { duration: 650, easing: "ease-in-out", fill: "forwards" });
      await a.finished.catch(() => {});
    }

    async function finale() {
      arrowsOn(false);
      if (view === "cave") {
        await cave.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" }).finished.catch(() => {});
        cave.setAttribute("visibility", "hidden");
        face.setAttribute("visibility", "visible");
        face.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" });
      }
      mouth.setAttribute("d", `M${HX - 50} ${HY + 76} q50 44 100 0`);
      face.style.transformBox = "view-box";
      face.style.transformOrigin = HX + "px " + HY + "px";
      K.pop("♪ I can hear! ♪", HX, 60, 1400);
      await face.animate([{ transform: "rotate(0)" }, { transform: "rotate(-9deg)" }, { transform: "rotate(9deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(0)" }], { duration: 900 }).finished.catch(() => {});
    }

    /* the pointer */
    let drag = null;
    K.svg.addEventListener("pointerdown", (ev) => {
      if (!K.alive || K.ending) return;
      K.poke();
      const d = K.active;
      if (!d) return;
      const p = K.toSvg(ev);
      const row = d.row;
      if (d.item === "torch") {
        if (view !== "face") return;
        const s = hitEar(p);
        if (!s) return K.gentle(P.rows.find((r) => r.kind === "pluck"));
        K.events.push({ row: null, kind: "look", side: s });
        const b = S("path", { d: `M${s === "right" ? 60 : 1000} 40 L${EAR[s] - 30} ${HY - 10} L${EAR[s] + 30} ${HY + 40} Z`, fill: "#fff3a8", opacity: 0.6, "pointer-events": "none" }, fxG);
        K.later(() => b.remove(), 500);
        if (P.cue && s !== P.side) K.gentle(P.rows.find((r) => r.kind === "pluck"));
        openCave(s);
        K.dishUI(d, "lift", false);
        K.dishUI(d, "used");
        return;
      }
      if (!d.useful || !row) {
        if (view === "cave" ? inCave(p) : hitEar(p)) K.react("giggle");
        return;
      }
      if (view !== "cave") return K.gentle(row); // the cave isn't open yet: the torch first
      if (d.item === "tweezers") {
        const el = ev.target.closest && ev.target.closest("[data-thing]");
        const t = el && T[el.getAttribute("data-thing")];
        if (!t || t.out) return;
        drag = { t, sx: p.x, sy: p.y, id: ev.pointerId };
        try {
          K.svg.setPointerCapture(ev.pointerId);
        } catch (e) {}
      } else if (d.item === "cotton-bud") {
        if (!inCave(p)) return K.gentle(row);
        K.record({ kind: "scrub" });
        scrub(p);
        K.tally(d.item, K.stepEvents(row).length);
      } else if (d.item === "drops") {
        if (!inCave(p)) return K.gentle(row);
        K.record({ kind: "drop" });
        drop(p);
        K.tally(d.item, K.stepEvents(row).length);
      }
    });
    K.svg.addEventListener("pointermove", (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const p = K.toSvg(ev);
      const t = drag.t;
      const along = Math.max(0, (p.x - drag.sx) * t.dx + (p.y - drag.sy) * t.dy);
      t.g.setAttribute("transform", `translate(${t.x + t.dx * along},${t.y + t.dy * along})`);
      if (along > 110) {
        drag = null;
        K.record({ kind: "pluck", thing: t.id });
        K.tally("tweezers", K.stepEvents(K.active.row).length);
        pluck(t);
      }
    });
    const up = (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const t = drag.t;
      drag = null;
      t.g.setAttribute("transform", `translate(${t.x},${t.y})`);
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
        get view() {
          return view;
        },
        /** Screen points for tests: a dish, Done, an ear, the cave, a thing and its arrow's end. */
        where(what, a) {
          if (what === "ear") return K.toScreen(EAR[a], HY + 10);
          if (what === "cave") return K.toScreen(CX - 40 + (a || 0) * 30, CY + 10);
          if (what === "thing") {
            const t = T[a];
            return { from: K.toScreen(t.x, t.y), to: K.toScreen(t.x + t.dx * 150, t.y + t.dy * 150) };
          }
          return K.where(what, a);
        },
      },
    };
  }

  if (typeof module === "object" && module.exports) module.exports = game;
  if (root && root.Clinic && root.Clinic.Heal && root.Clinic.Heal.register) root.Clinic.Heal.register(game);
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this);
