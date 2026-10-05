/*
 * H-fever: the room (D15f, decision 27; the 1 Oct report §8H; CLN-56, CLN-57, CLN-31).
 *
 * Played in the WIDE exam room (CB2b), no close-up: the patient sits on the bed's edge; things round the room
 * cool or warm them, each by its size (data/clinic/heal/fever.json `things`: window big, ceiling fan medium,
 * hand fan small; heater big, hot-water bottle medium, blanket small; the ice pack drawn as a spare behind a data
 * flag). Opening / closing and switching on / off undo them. A live thermometer on the wall, with a green
 * "just right" zone, moves with every change.
 *
 *   1. Take the temperature (kept from v2: "the thermometer's kind of funny"): tap the thermometer, then the patient;
 *      from then on the wall thermometer reads live.
 *   2. Exchanges: the patient's fever swings (hot, then cold, then hot...); they say how they feel; the doctor names
 *      the thing ("[open the window]"), one instruction at a time; the child taps it; the reading moves by its size.
 *      In the zone the patient says "just right!" and the next swing comes. A tap on anything always does something
 *      (CLN-57) and can be taken back by tapping it again (E14: the first tap is the one scored).
 * The Kutchi decides it (C10): when a thing is named, the NAMED thing is the answer, and every swing is sized so that
 * at least two of the things a non-speaker could pick land in the zone: the thermometer alone never singles it out.
 * Levels (E6, each adds one thing): L1 three exchanges, each named, a thing switched on; L2 + the undo verbs named
 * (close the window, switch the heater off, take the blanket off) and the swings vary; L3 + "fix it": the last
 * exchanges name nothing and the child works it out from the thermometer (two things may be needed), heard only.
 * The body's state is a stand-in until the art (W5, W6, W9, W10): hot = flushed with sweat drops, cold = shivering;
 * the blanket goes over the SHOULDERS (CLN-56), the hot-water bottle is hugged, the hand fan fans the face.
 * The art swaps in by file name (fever.json `art`; the art plan's R1, R2, R4, R5): a missing file keeps the stand-in.
 * Every word through the seam (data/clinic/lang.json fever-*): all English placeholders, flagged to record.
 */
(function (root) {
  "use strict";
  const Heal = (root.Clinic && root.Clinic.Heal) || (typeof require === "function" ? require("../registry.js") : null);
  const HS = (root.Clinic && root.Clinic.HealScene) || (typeof require === "function" ? require("../scene.js") : null);

  // the defaults (fever.json overrides them): effect sizes in reading units; the zone is -ZONE..+ZONE
  const THINGS = {
    window: { side: "cool", size: 3, fixed: true, verbs: ["fever-open", "fever-close"], word: "fever-window" },
    "ceiling-fan": { side: "cool", size: 2, fixed: true, verbs: ["fever-switch-on", "fever-switch-off"], word: "fever-ceiling-fan" },
    "hand-fan": { side: "cool", size: 1, verbs: ["fever-give", "fever-take-away"], word: "fever-hand-fan" },
    "ice-pack": { side: "cool", size: 2, verbs: ["fever-give", "fever-take-away"], word: "fever-ice-pack", spare: true },
    heater: { side: "warm", size: 3, fixed: true, verbs: ["fever-switch-on", "fever-switch-off"], word: "fever-heater" },
    bottle: { side: "warm", size: 2, verbs: ["fever-give", "fever-take-away"], word: "fever-bottle" },
    blanket: { side: "warm", size: 1, verbs: ["fever-put-on", "fever-take-off"], word: "fever-blanket" },
  };
  const K = { zone: 1, max: 6, exchanges: { 1: [3], 2: [3, 4], 3: [4] }, fixFrom: 3, fixLast: { 3: 1 }, gaps: { 1: [2], 2: [1, 2, 3], 3: [1, 2, 3] }, fixGaps: [2, 3, 4], icePack: false };
  const WHY = { problem: "I feel hot... no, cold!", goal: "Let's get you just right." };
  // first-time help: the ghost finger's move for each kind of step (13g: no words, no device voice)
  const CUES = {
    temp: { gesture: "tap", then: "tap" },
    named: { gesture: "tap" },
    fix: { gesture: "tap" },
  };
  const ROOM = { src: "assets/clinic/rooms/bg-clinic-exam-cb2b-v1.webp", need: [0.2, 0.86], ay: 0.6, aspect: 1.5, fig: { x: 0.5, bottom: 0.69, h: 0.56 }, seat: 0.535 };

  const cfgOf = (data) => {
    const d = (data && data.room) || {};
    const things = {};
    Object.keys(THINGS).forEach((id) => (things[id] = Object.assign({ id }, THINGS[id], (d.things || {})[id] || {})));
    const k = Object.assign({}, K, d.rules || {});
    Object.keys(things).forEach((id) => {
      if (things[id].spare && !(id === "ice-pack" && k.icePack)) delete things[id];
    });
    return { things, k };
  };
  /** The reading: the body's own swing plus every thing that is on. */
  const readingOf = (body, on, things) => body + Object.keys(on).reduce((a, id) => (on[id] && things[id] ? a + (things[id].side === "warm" ? 1 : -1) * things[id].size : a), 0);
  const inZone = (r, k) => Math.abs(r) <= k.zone;
  /** Every one-tap change from a state: {id, to (on/off), delta}. */
  const actionsOf = (on, things) => Object.values(things).map((t) => ({ id: t.id, to: !on[t.id], delta: (on[t.id] ? -1 : 1) * (t.side === "warm" ? 1 : -1) * t.size }));
  const actKey = (a) => `${a.to ? "on" : "off"}:${a.id}`;

  /**
   * One exchange from the state it opens on (the plan uses it for the fair path; the game calls it live, so a
   * child's own changes are always built on). Returns {hot, gap, mode, answer, options, landing, fixWith}.
   */
  function exchange(on, cfg, level, i, n, hot, rng) {
    const { things, k } = cfg;
    const L = level;
    const fix = L >= k.fixFrom && i >= n - (k.fixLast[L] || 0);
    const dir = hot ? 1 : -1; // the reading's sign once the fever swings
    const acts = actionsOf(on, things).filter((a) => Math.sign(a.delta) === -dir); // the ones that move it back
    if (fix) {
      const gap = HS.pick(k.fixGaps, rng);
      return { hot, gap, mode: "fix", answer: null, options: acts.map(actKey), fixWith: solve(on, things, dir * gap, k) };
    }
    // named: L1 only switches things on; from L2 the undo verbs too
    let named = acts.filter((a) => (L >= 2 ? true : a.to));
    if (!named.length) named = acts;
    // a gap at which the named thing lands in the zone AND at least one other blind choice does too (C10)
    const tries = [];
    named.forEach((a) =>
      k.gaps[Math.min(3, L)].forEach((g) => {
        const lands = acts.filter((b) => inZone(dir * g + b.delta, k));
        if (lands.some((b) => actKey(b) === actKey(a)) && lands.length >= 2) tries.push({ a, g, lands });
      })
    );
    // from L2 an undo is named when one is possible about half the time: it's the new verbs (E6)
    let pool = tries;
    if (L >= 2) {
      const undo = tries.filter((t) => !t.a.to);
      if (undo.length && rng() < 0.5) pool = undo;
    }
    const t = pool.length ? HS.pick(pool, rng) : { a: named[0], g: Math.abs(named[0].delta), lands: [named[0]] };
    return { hot, gap: t.g, mode: "named", answer: actKey(t.a), action: t.a, options: acts.map(actKey), landing: t.lands.map(actKey) };
  }
  /** The fewest taps from `on` that bring reading r into the zone (for the driver and the "fix it" rows). */
  function solve(on, things, r, k) {
    const acts = actionsOf(on, things);
    for (const a of acts) if (inZone(r + a.delta, k)) return [actKey(a)];
    for (let x = 0; x < acts.length; x++) for (let y = x + 1; y < acts.length; y++) if (inZone(r + acts[x].delta + acts[y].delta, k)) return [actKey(acts[x]), actKey(acts[y])];
    return [];
  }
  const applyAct = (on, key) => {
    const [to, id] = key.split(":");
    on[id] = to === "on";
  };

  const L = () => HS.L; // the seam (js/clinic/lang.js), looked up when used
  const show = (ids, o) => L().show(L().join(ids), Object.assign({ cap: true }, o || {}));
  /** The doctor's line for an exchange: the verb and the thing ("[Open] [window]"), or "[fix it]". */
  function lineOf(ex, cfg) {
    if (ex.mode === "fix") return show(["fever-fix"]);
    const [to, id] = ex.answer.split(":");
    const t = cfg.things[id];
    return show([t.verbs[to === "on" ? 0 : 1], t.word]);
  }

  function plan(level, rng, data) {
    const Lv = Math.max(1, Math.min(3, level));
    const cfg = cfgOf(data);
    const n = HS.pick(cfg.k.exchanges[Lv], rng);
    let hot = rng() < 0.5;
    const on = {};
    const ex = [];
    for (let i = 0; i < n; i++) {
      const e = exchange(on, cfg, Lv, i, n, hot, rng);
      e.id = `ex${i}`;
      e.row = Object.assign({ id: e.id }, lineOf(e, cfg));
      ex.push(e);
      (e.mode === "fix" ? e.fixWith : [e.answer]).forEach((key) => applyAct(on, key));
      hot = !hot;
    }
    const steps = [{ id: "temp", kind: "temp", row: Object.assign({ id: "temp" }, show(["fever-temp"])) }].concat(ex.map((e) => ({ id: e.id, kind: e.mode, ex: e, row: e.row })));
    // rows the words decide: each named exchange (its options: every thing a non-speaker could pick to move it back);
    // "fix it" is a hand-and-eye row (no words in it)
    const rows = ex.map((e) => (e.mode === "fix" ? { id: e.id, skill: true } : { id: e.id, options: e.options, answer: e.answer }));
    const used = new Set();
    ex.forEach((e) => e.answer && used.add(e.answer.split(":")[1]));
    const words = [L().w("fever-too-hot"), L().w("fever-too-cold"), L().w("fever-just-right")].concat([...used].map((id) => L().w(cfg.things[id].word)));
    return { level: Lv, ex, steps, rows, words, cfg };
  }

  /* ---------------- the browser: the room ---------------- */
  const CSS = [
    ".fv-room{position:absolute;inset:0;overflow:hidden;background:#efe3cc}",
    ".fv-room .cl-scene{z-index:0}",
    ".fv-thing{position:absolute;z-index:4;transform:translate(-50%,-100%);min-width:var(--njg-tap);min-height:var(--njg-tap);padding:0;margin:0;border:0;background:none;cursor:pointer;display:block;-webkit-tap-highlight-color:transparent}",
    ".fv-thing svg,.fv-thing img{display:block;width:100%;height:100%;overflow:visible;pointer-events:none}",
    ".fv-thing img{object-fit:contain}",
    ".fv-thing.pulse{animation:hs-pulse 1s ease-in-out infinite}",
    ".fv-thing.held{filter:drop-shadow(0 0 6px #2e8b7a)}",
    ".fv-thing.gone{visibility:hidden}",
    ".fv-thing.painted .fv-frame,.fv-thing.painted .fv-shut{display:none}",
    ".fv-thing .fv-open{display:none}",
    ".fv-thing.on .fv-open{display:inline}",
    ".fv-thing.on .fv-shut{display:none}",
    ".fv-thing:focus-visible{outline:4px solid #2e8b7a;outline-offset:2px;border-radius:12px}",
    ".fv-gauge{position:absolute;z-index:4;transform:translate(-50%,-100%);pointer-events:none}",
    ".fv-gauge svg{display:block;width:100%;height:100%;overflow:visible}",
    ".fv-col{transform-box:fill-box;transform-origin:50% 100%;transition:transform .6s cubic-bezier(.3,0,.2,1),fill .4s}",
    ".fv-blades{transform-box:fill-box;transform-origin:50% 50%}",
    ".fv-thing.on .fv-blades{animation:fv-spin .5s linear infinite}",
    ".fv-breeze{opacity:0}",
    ".fv-thing.on .fv-breeze{opacity:.8;animation:fv-breeze 1.2s ease-in-out infinite}",
    ".fv-glow{opacity:0;transition:opacity .4s}",
    ".fv-thing.on .fv-glow{opacity:1}",
    ".fv-waves{opacity:0}",
    ".fv-thing.on .fv-waves{opacity:.9;animation:fv-rise 1.4s ease-in-out infinite}",
    ".fv-wear{pointer-events:none}",
    ".fv-wave-fan{transform-box:fill-box;transform-origin:20% 90%;animation:fv-fan .45s ease-in-out infinite alternate}",
    ".fv-sweat{animation:fv-drip 1.6s ease-in infinite}",
    "@keyframes fv-spin{to{transform:rotate(360deg)}}",
    "@keyframes fv-breeze{0%,100%{transform:translateX(0)}50%{transform:translateX(10px)}}",
    "@keyframes fv-rise{0%{transform:translateY(6px);opacity:0}50%{opacity:.9}100%{transform:translateY(-10px);opacity:0}}",
    "@keyframes fv-fan{from{transform:rotate(-14deg)}to{transform:rotate(12deg)}}",
    "@keyframes fv-drip{0%{transform:translateY(0);opacity:0}20%{opacity:1}100%{transform:translateY(26px);opacity:0}}",
    "@media (prefers-reduced-motion: reduce){.fv-thing.on .fv-blades,.fv-thing.on .fv-breeze,.fv-thing.on .fv-waves,.fv-wave-fan,.fv-sweat{animation:none}}",
  ].join("\n");

  // stand-in drawings (no text, no emoji): each in its own 0 0 100 100 box unless said
  const NS = "http://www.w3.org/2000/svg";
  const DRAW = {
    window(s, g) {
      // a wooden casement on the wall: closed, two panes; open, the panes swing out and the breeze comes in
      const fr = s("g", { class: "fv-frame" }, g);
      s("rect", { x: 4, y: 2, width: 92, height: 96, rx: 4, fill: "#c9a46c", stroke: "#9b7a48", "stroke-width": 3 }, fr);
      s("rect", { x: 12, y: 10, width: 76, height: 80, fill: "#bfe3f5" }, fr);
      s("path", { d: "M12 70 Q30 52 50 62 Q70 72 88 56 L88 90 L12 90Z", fill: "#7fbf7a", opacity: 0.8 }, fr);
      const shut = s("g", { class: "fv-shut" }, g);
      [12, 50].forEach((x) => {
        s("rect", { x, y: 10, width: 38, height: 80, fill: "rgba(220,240,250,.55)", stroke: "#a8834f", "stroke-width": 4 }, shut);
        s("line", { x1: x, y1: 50, x2: x + 38, y2: 50, stroke: "#a8834f", "stroke-width": 3 }, shut);
      });
      const open = s("g", { class: "fv-open" }, g);
      s("rect", { x: 12, y: 10, width: 76, height: 80, fill: "#cfeefc" }, open);
      s("path", { d: "M12 10 L30 16 L30 84 L12 90Z", fill: "rgba(220,240,250,.85)", stroke: "#a8834f", "stroke-width": 4 }, open);
      s("path", { d: "M88 10 L70 16 L70 84 L88 90Z", fill: "rgba(220,240,250,.85)", stroke: "#a8834f", "stroke-width": 4 }, open);
      const br = s("g", { class: "fv-breeze", stroke: "#ffffff", "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, open);
      [30, 48, 66].forEach((y) => s("path", { d: `M24 ${y} q14 -8 28 0 t28 0` }, br));
    },
    "ceiling-fan"(s, g) {
      // the downrod from the top, the motor, the blades seen a little from below
      s("rect", { x: 47, y: -60, width: 6, height: 80, fill: "#8a8f98" }, g);
      const bl = s("g", { class: "fv-blades" }, g);
      [0, 120, 240].forEach((a) => s("ellipse", { cx: 50, cy: 30, rx: 44, ry: 7, fill: "#e8e2d4", stroke: "#a39a88", "stroke-width": 2, transform: `rotate(${a} 50 30) translate(22 0)` }, bl));
      s("ellipse", { cx: 50, cy: 30, rx: 13, ry: 9, fill: "#c9ccd2", stroke: "#8a8f98", "stroke-width": 2 }, g);
      s("ellipse", { cx: 50, cy: 39, rx: 6, ry: 4, fill: "#f6eccd" }, g);
    },
    "hand-fan"(s, g) {
      // a folding paper fan, open
      const ribs = s("g", {}, g);
      s("path", { d: "M50 92 L8 40 A60 60 0 0 1 92 40 Z", fill: "#7fc4c0", stroke: "#3d8f8a", "stroke-width": 3 }, ribs);
      for (let k = 0; k <= 6; k++) {
        const a = Math.PI * (1.1 + (k / 6) * 0.8);
        s("line", { x1: 50, y1: 92, x2: 50 + Math.cos(a) * 58, y2: 92 + Math.sin(a) * 58, stroke: "#3d8f8a", "stroke-width": 2 }, ribs);
      }
      s("circle", { cx: 50, cy: 90, r: 5, fill: "#8a5a2a" }, g);
    },
    "ice-pack"(s, g) {
      s("rect", { x: 8, y: 34, width: 84, height: 56, rx: 16, fill: "#9fd2f2", stroke: "#4f97c9", "stroke-width": 3 }, g);
      s("path", { d: "M22 50 l10 8 M40 46 l8 10 M60 50 l10 8", stroke: "#ffffff", "stroke-width": 4, "stroke-linecap": "round" }, g);
    },
    heater(s, g) {
      // an oil-filled radiator on little feet; on: an orange glow and heat rising
      const glow = s("rect", { class: "fv-glow", x: 2, y: 18, width: 96, height: 72, rx: 14, fill: "#ffb15a", opacity: 0.0 }, g);
      glow.setAttribute("style", "filter:blur(6px)");
      for (let k = 0; k < 6; k++) s("rect", { x: 10 + k * 14, y: 22, width: 12, height: 64, rx: 6, fill: "#f4f1ea", stroke: "#a8a296", "stroke-width": 2 }, g);
      s("rect", { x: 8, y: 84, width: 84, height: 6, rx: 3, fill: "#a8a296" }, g);
      s("rect", { x: 12, y: 90, width: 8, height: 8, rx: 2, fill: "#6f6a60" }, g);
      s("rect", { x: 80, y: 90, width: 8, height: 8, rx: 2, fill: "#6f6a60" }, g);
      s("circle", { class: "fv-glow", cx: 88, cy: 28, r: 4, fill: "#e8503a" }, g);
      const w = s("g", { class: "fv-waves", stroke: "#f08a2c", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, g);
      [26, 50, 74].forEach((x) => s("path", { d: `M${x} 16 q-6 -6 0 -12 t0 -12` }, w));
    },
    bottle(s, g) {
      // a hot-water bottle in a teal knitted cover, the cream neck and stopper
      s("rect", { x: 40, y: 8, width: 20, height: 18, rx: 4, fill: "#efe2c2", stroke: "#b9a77d", "stroke-width": 2 }, g);
      s("rect", { x: 14, y: 22, width: 72, height: 72, rx: 22, fill: "#2f9c94", stroke: "#1f6f69", "stroke-width": 3 }, g);
      for (let y = 34; y < 90; y += 10) s("path", { d: `M20 ${y} q6 4 12 0 t12 0 t12 0 t12 0 t12 0`, stroke: "#5cbcb3", "stroke-width": 2, fill: "none" }, g);
    },
    blanket(s, g) {
      // a folded red fleece (items-v2/blanket-red is the same blanket: used when it loads)
      s("rect", { x: 6, y: 50, width: 88, height: 40, rx: 10, fill: "#b8323a", stroke: "#82222a", "stroke-width": 3 }, g);
      s("rect", { x: 10, y: 38, width: 80, height: 18, rx: 8, fill: "#cf4048", stroke: "#82222a", "stroke-width": 3 }, g);
    },
    thermometer(s, g) {
      s("rect", { x: 40, y: 6, width: 20, height: 74, rx: 10, fill: "#ffffff", stroke: "#8a8f98", "stroke-width": 3 }, g);
      s("rect", { x: 46, y: 40, width: 8, height: 44, rx: 4, fill: "#d8433f" }, g);
      s("circle", { cx: 50, cy: 84, r: 12, fill: "#d8433f", stroke: "#8a8f98", "stroke-width": 3 }, g);
    },
  };

  function mount(stage, ctx) {
    const P = plan(ctx.level, ctx.rng, ctx.data);
    const cfg = P.cfg;
    const Kit = root.Clinic && root.Clinic.Kit;
    const fast = () => !!(Kit && Kit.fast);
    const S = HS.make(stage, ctx, { place: "room", game: "fever", rest: "neutral" });
    const doc = stage.ownerDocument;
    if (!doc.getElementById("fv-css")) {
      const st = S.h("style", null, doc.head);
      st.id = "fv-css";
      st.textContent = CSS;
    }
    // D15f: no close-up: the heal host skips the zoom for fever.json camera.wide "room" (heal-A, 2 Oct)
    S.svg.style.display = "none"; // no close-up drawing layer
    const face = S.root.querySelector(".hs-face");
    if (face) face.hidden = true; // the patient is in the room: no round face in the corner
    const s = (tag, attrs, parent) => {
      const n = doc.createElementNS(NS, tag);
      Object.entries(attrs || {}).forEach(([k, v]) => v != null && n.setAttribute(k, v));
      if (parent) parent.appendChild(n);
      return n;
    };

    /* ---- the room, exactly as the wide shot (the diagnosis's own scene) ---- */
    const V = root.Clinic && root.Clinic.Scenes;
    const room = Object.assign({}, ROOM, (V && V.rooms && V.rooms.exam) || {});
    const ec = (V && V.exam) || ROOM;
    const roomEl = S.h("div", "fv-room", null);
    S.root.insertBefore(roomEl, S.root.firstChild);
    const cap = S.h("div", "cl-scene-cap", roomEl);
    const box = S.h("div", "cl-scene", roomEl);
    const url = `url("${Kit ? Kit.url(room.src) : room.src}")`;
    box.style.backgroundImage = url;
    cap.style.backgroundImage = url;
    const fitBox = () => {
      // the shared fit when the clinic's stages are loaded; else the same cover maths here (the heal-host lab)
      const W = roomEl.clientWidth;
      const H = roomEl.clientHeight;
      if (!W || !H) return;
      const A = (V && V.aspect) || ROOM.aspect;
      const need = room.need || [0, 1];
      let w;
      let hh;
      let left;
      let top;
      if (W / H >= A) (w = W), (hh = W / A), (left = 0), (top = (H - hh) * (room.ay != null ? room.ay : 0.6));
      else if (H * A * (need[1] - need[0]) <= W) (hh = H), (w = H * A), (left = Math.min(0, Math.max(W - w, W / 2 - ((need[0] + need[1]) / 2) * w))), (top = 0);
      else (w = W / (need[1] - need[0])), (hh = w / A), (left = -need[0] * w), (top = H - hh);
      Object.assign(box.style, { width: `${w}px`, height: `${hh}px`, left: `${left}px`, top: `${top}px` });
      cap.style.display = "none";
      box.dispatchEvent(new CustomEvent("scenefit"));
    };
    const Stg = root.Clinic && root.Clinic.Stages;
    if (Stg && Stg.fitScene) Stg.fitScene(roomEl, box, cap, room, (V && V.aspect) || ROOM.aspect);
    else {
      fitBox();
      if (root.ResizeObserver) new root.ResizeObserver(fitBox).observe(roomEl);
    }
    const place = (el, x, y, h, w) => {
      el.style.left = `${x * 100}%`;
      el.style.top = `${y * 100}%`;
      if (h != null) el.style.height = `${h * 100}%`;
      if (w != null) el.style.width = `${w * 100}%`;
    };
    // the visible part of the picture (a tablet's square play area crops the sides; a phone's crops top and bottom)
    const visible = () => {
      const bw = box.offsetWidth || 1;
      const bh = box.offsetHeight || 1;
      const l = -box.offsetLeft;
      const t = -box.offsetTop;
      return { x0: Math.max(0, l / bw), x1: Math.min(1, (l + roomEl.clientWidth) / bw), y0: Math.max(0, t / bh), y1: Math.min(1, (t + roomEl.clientHeight) / bh), bw, bh };
    };

    /* ---- the patient: their own figure, seated on the bed's edge (CLN-67: the patient's kind and clothes) ---- */
    const src = ctx.patient && ctx.patient.figure;
    const bodyFile = root.Clinic && root.Clinic.HealHost && root.Clinic.HealHost.bodyFile;
    const fig = root.Clinic.Figure.make(bodyFile, { kind: (src && src.kind) || (ctx.patient && ctx.patient.kind) || "girl", colour: src && src.colour, size: src && src.size });
    const layer = S.h("div", "cl-patient-layer v2", box);
    const fw = (ec.fig.h * (620 / 900)) / 1.5;
    place(layer, ec.fig.x, ec.fig.bottom, ec.fig.h, fw);
    layer.classList.add("cl-placed");
    layer.style.zIndex = "3";
    layer.appendChild(fig.el);
    fig.pose("sit");
    // A1 (5 Oct): the patient's real art (W1, the faces W5/W6, the blanket W9 and the bottle W10) when it's cut
    const HH = root.Clinic && root.Clinic.HealHost;
    const artSpec = HH && HH.healArt && HH.healArt.patients && HH.healArt.patients[fig.kind];
    const artOn = !!(artSpec && fig.useArt && fig.useArt(artSpec, { view: "front", figH: ec.fig.h }));
    const seat = () => {
      if (ec.seat == null) return;
      layer.style.top = `${ec.fig.bottom * 100}%`;
      const q = fig.hotspot(artOn ? "seat" : "knee", "left", box);
      const H = box.clientHeight || 1;
      if (q && isFinite(q.y)) layer.style.top = `${(ec.fig.bottom + (ec.seat * H - q.y) / H) * 100}%`;
    };
    if (Kit && Kit.Voice) Kit.Voice.speakers.patient = () => fig.el.querySelector(".fig-head") || fig.el;
    // what the patient wears or holds (stand-ins on the figure's own drawing, so they move with it)
    const wear = s("g", { class: "fv-wear" }, fig.groups.marks);
    const body = fig.body;
    const sp = (part, side) => body.spot(`body-${part}`, side ? `side-${side}` : null);

    /* ---- the things round the room ---- */
    const els = {};
    const on = {};
    const AT = Object.assign(
      {
        window: { x: 0.045, y: 0.44, h: 0.38, w: 0.075 },
        "ceiling-fan": { x: 0.33, y: 0.22, h: 0.13, w: 0.17, top: true },
        "hand-fan": { x: 0.655, y: 0.455, h: 0.075, w: 0.06 },
        "ice-pack": { x: 0.745, y: 0.455, h: 0.06, w: 0.06 },
        heater: { x: 0.215, y: 0.84, h: 0.16, w: 0.11 },
        bottle: { x: 0.705, y: 0.455, h: 0.08, w: 0.05 },
        blanket: { x: 0.36, y: 0.46, h: 0.06, w: 0.075 },
        thermometer: { x: 0.305, y: 0.455, h: 0.075, w: 0.03 },
        gauge: { x: 0.8, y: 0.42, h: 0.3, w: 0.06 },
      },
      (ctx.data && ctx.data.room && ctx.data.room.at) || {}
    );
    const ART = (ctx.data && ctx.data.art) || {};
    const art = (el, id, state) => {
      // the art plan's file, when it exists: swap the stand-in for it (a missing file keeps the stand-in)
      const f = ART[`${id}${state ? "-" + state : ""}`] || ART[id];
      if (!f || !Kit) {
        // no picture for this state: the stand-in again
        el.querySelectorAll("img.fv-art").forEach((n) => n.remove());
        el.querySelectorAll("svg.fv-standin").forEach((n) => (n.style.display = ""));
        return;
      }
      const im = new root.Image();
      im.onload = () => {
        if (!el.isConnected) return;
        const old = el.querySelector("img.fv-art");
        if (old) old.remove();
        im.className = "fv-art";
        im.alt = "";
        el.querySelectorAll("svg.fv-standin").forEach((n) => (n.style.display = "none"));
        el.appendChild(im);
      };
      im.src = Kit.url(f);
    };
    const mkThing = (id) => {
      const b = S.h("button", "fv-thing", box);
      b.type = "button";
      b.dataset.thing = id;
      b.setAttribute("aria-label", "");
      const svg = s("svg", { class: "fv-standin", viewBox: "0 0 100 100", preserveAspectRatio: id === "window" ? "none" : "xMidYMax meet", "aria-hidden": "true" }, b);
      DRAW[id](s, s("g", {}, svg));
      art(b, id, "off");
      els[id] = b;
      ctx.on(b, "click", (e) => {
        e.stopPropagation();
        tapThing(id);
      });
      return b;
    };
    Object.keys(cfg.things).forEach(mkThing);
    mkThing("thermometer");
    // the wall thermometer: the reading, with its green zone (R5's gauge art swaps in; the level and zone stay code)
    const gauge = S.h("div", "fv-gauge", box);
    const gs = s("svg", { viewBox: "0 0 40 200", preserveAspectRatio: "xMidYMax meet", "aria-hidden": "true" }, gauge);
    const RANGE = cfg.k.max; // -RANGE..+RANGE
    const TUBE = { top: 10, bot: 168 };
    const yOf = (r) => TUBE.bot - ((Math.max(-RANGE, Math.min(RANGE, r)) + RANGE) / (2 * RANGE)) * (TUBE.bot - TUBE.top);
    s("rect", { x: 2, y: 0, width: 36, height: 200, rx: 18, fill: "#ffffff", stroke: "#a8a296", "stroke-width": 3 }, gs);
    s("rect", { x: 12, y: yOf(RANGE), width: 16, height: yOf(cfg.k.zone + 0.5) - yOf(RANGE), fill: "#f6c9c0" }, gs);
    s("rect", { x: 12, y: yOf(-cfg.k.zone - 0.5), width: 16, height: yOf(-RANGE) - yOf(-cfg.k.zone - 0.5), fill: "#c9def6" }, gs);
    s("rect", { x: 8, y: yOf(cfg.k.zone + 0.5), width: 24, height: yOf(-cfg.k.zone - 0.5) - yOf(cfg.k.zone + 0.5), rx: 4, fill: "#7fcf86", stroke: "#3fa35b", "stroke-width": 2 }, gs);
    const colBg = s("rect", { x: 16, y: TUBE.top, width: 8, height: TUBE.bot - TUBE.top, rx: 4, fill: "rgba(0,0,0,.06)" }, gs);
    void colBg;
    const col = s("rect", { class: "fv-col", x: 16, y: TUBE.top, width: 8, height: TUBE.bot - TUBE.top + 10, rx: 4, fill: "#c9ccd2" }, gs);
    const bulbC = s("circle", { cx: 20, cy: 182, r: 13, fill: "#c9ccd2", stroke: "#a8a296", "stroke-width": 3 }, gs);
    // R5's gauge art comes with its tube's inner box measured at the cut; until then the drawn gauge
    const showReading = (r) => {
      const c = r == null ? "#c9ccd2" : inZone(r, cfg.k) ? "#3fa35b" : r > 0 ? "#d8433f" : "#3f6fd8";
      const k = r == null ? 0.02 : (TUBE.bot + 10 - yOf(r)) / (TUBE.bot - TUBE.top + 10);
      col.style.transform = `scaleY(${k.toFixed(3)})`;
      col.style.fill = c;
      bulbC.setAttribute("fill", c);
      gauge.dataset.reading = r == null ? "" : String(r);
    };
    showReading(null);

    const layout = () => {
      seat();
      if (artOn) fig.artFit();
      const v = visible();
      const pad = 0.012;
      const put = (el, a) => {
        if (!el) return;
        const halfW = (a.w || 0.05) / 2;
        let x = Math.max(v.x0 + halfW + pad, Math.min(v.x1 - halfW - pad, a.x));
        let y = a.y;
        let h = a.h;
        if (a.top) y = Math.max(a.y, v.y0 + a.h + 0.02);
        y = Math.min(y, v.y1 - 0.01);
        // a phone crops the picture's top: a tall thing (the window) keeps its foot and loses its top, never off screen
        if (y - h < v.y0 + 0.005) {
          const hh = y - v.y0 - 0.01;
          if (hh >= a.h * 0.5) h = hh;
          else y = v.y0 + a.h + 0.01;
        }
        place(el, x, y, h, a.w);
      };
      Object.keys(els).forEach((id) => put(els[id], AT[id]));
      // the window: over the painted one when it's on screen (only its open state is drawn); a whole drawn window
      // when the screen crops the picture's left edge (a tablet), until the square room (R3)
      if (els.window) els.window.classList.toggle("painted", v.x0 <= 0.002);
      put(gauge, AT.gauge);
    };
    box.addEventListener("scenefit", layout);
    layout();
    ctx.after(50, layout);

    /* ---- the patient's body state (stand-ins until W5, W6, W9, W10) ---- */
    const drawWear = () => {
      S.clear(wear);
      // with the art: the blanket and the bottle are whole figures (W9, W10), the rest is drawn on the fitted marks layer
      let artBody = null;
      if (artOn) {
        artBody = on.blanket && artSpec.blanket ? "blanket" : on.bottle && artSpec.bottle ? "bottle" : null;
        fig.artBody(artBody || "front");
        fig.artFit();
      }
      const head = [640, 135];
      const shL = sp("shoulder", "left");
      const shR = sp("shoulder", "right");
      const tum = sp("tummy");
      if (on.blanket && artBody !== "blanket") {
        // over the SHOULDERS and down the upper arms, like a cape, open at the front; never the face (CLN-56)
        const cape = (k) => {
          const sh = k < 0 ? shR : shL; // the patient's right is on our left
          const nx = 640 + k * 34;
          const ox = sh[0] + k * 46;
          return `M${nx} 250 Q${640 + k * 80} 238 ${ox - k * 10} 262 Q${ox + k * 14} 330 ${ox + k * 6} 470 L${640 + k * 64} 478 Q${640 + k * 52} 360 ${nx} 262Z`;
        };
        s("path", { d: `M${640 - 40} 244 Q640 232 ${640 + 40} 244 L${640 + 40} 262 L${640 - 40} 262Z`, fill: "#9e2a32" }, wear);
        [-1, 1].forEach((k) => s("path", { d: cape(k), fill: "#b8323a", stroke: "#82222a", "stroke-width": 6, "stroke-linejoin": "round" }, wear));
      }
      if (on.bottle && artBody !== "bottle") {
        s("rect", { x: 640 - 18, y: tum[1] - 98, width: 36, height: 26, rx: 6, fill: "#efe2c2", stroke: "#b9a77d", "stroke-width": 4 }, wear);
        s("rect", { x: 640 - 62, y: tum[1] - 76, width: 124, height: 120, rx: 36, fill: "#2f9c94", stroke: "#1f6f69", "stroke-width": 5 }, wear);
        // the arms round it: two sleeves across the front (the hug)
        s("path", { d: `M${shR[0] + 10} ${tum[1] - 20} Q640 ${tum[1] + 30} ${shL[0] - 10} ${tum[1] - 20}`, stroke: "rgba(60,50,45,.45)", "stroke-width": 26, fill: "none", "stroke-linecap": "round" }, wear);
      }
      if (on["ice-pack"]) s("rect", { x: 640 - 60, y: 18, width: 120, height: 44, rx: 16, fill: "#9fd2f2", stroke: "#4f97c9", "stroke-width": 4 }, wear);
      if (on["hand-fan"]) {
        const hand = sp("hand", "left");
        const fg = s("g", { class: "fv-wave-fan" }, wear);
        s("path", { d: `M${hand[0] - 10} ${hand[1] - 40} L${hand[0] - 120} ${hand[1] - 230} A140 140 0 0 1 ${hand[0] + 50} ${hand[1] - 260} Z`, fill: "#7fc4c0", stroke: "#3d8f8a", "stroke-width": 5 }, fg);
      }
      if (st.measured) s("rect", { x: 640 + 8, y: 186, width: 70, height: 10, rx: 5, fill: "#ffffff", stroke: "#8a8f98", "stroke-width": 3, transform: "rotate(-14 648 190)" }, wear);
      const r = st.measured ? reading() : null;
      if (r != null && r > cfg.k.zone) [[560, 120], [722, 108]].forEach(([x, y], i) => {
        const d = s("path", { class: "fv-sweat", d: `M${x} ${y} q8 14 0 20 q-8 -6 0 -20Z`, fill: "#6bb7ea" }, wear);
        d.style.animationDelay = `${i * 0.6}s`;
      });
    };
    const feel = (r) => {
      if (r == null) return fig.react("idle", 0);
      if (inZone(r, cfg.k)) return fig.react("happy", 0);
      fig.react(r > 0 ? "hot" : "cold", 0);
      if (r < 0) fig.pose("shiver");
    };

    /* ---- the round ---- */
    const st = { i: 0, measured: false, held: false, body: 0, judged: {}, over: false, busy: false, first: null, start: null, hot: P.ex[0].hot, live: [] };
    const reading = () => readingOf(st.body, on, cfg.things);
    const cur = () => P.steps[st.i] || null;
    const lineFor = (key) => {
      const l = L().show(L().word(key));
      return Object.assign({}, l, { kutchi: l.kutchi || null });
    };
    const say = (key) => S.say(lineFor(key), "patient");
    const judge = (id, ok, detail) => {
      st.judged[id] = ok;
      ctx.log({ type: ok ? "right" : "wrong", rowId: id, detail });
    };
    let hintT = null;
    const unhint = () => {
      clearTimeout(hintT);
      Object.values(els).forEach((b) => b.classList.remove("pulse"));
    };
    const hintLater = (ms) => {
      unhint();
      const c = cur();
      // E16: after hesitation, the named thing glows; never at the top level, where the words should tell
      if (!c || P.level >= 3) return;
      hintT = setTimeout(() => {
        const k = c.kind === "temp" ? (st.held ? null : "thermometer") : c.live && c.live.answer ? c.live.answer.split(":")[1] : null;
        if (k && els[k] && !st.over) els[k].classList.add("pulse");
      }, ms);
    };
    const open = () => {
      const c = cur();
      unhint();
      if (c.kind === "temp") {
        ctx.card.now(c.id);
        S.cue("temp", CUES.temp, els.thermometer, { target: () => fig.el.querySelector(".fig-head") || fig.el });
        hintLater(fast() ? 400 : 5000);
        return;
      }
      // the fever swings: built live on what is on now (the child's own changes stay)
      const e = exchange(on, cfg, P.level, st.i - 1, P.ex.length, st.hot, ctx.rng);
      e.id = c.id;
      c.live = e;
      c.row = Object.assign({ id: c.id }, lineOf(e, cfg));
      st.body = (e.hot ? 1 : -1) * e.gap - (reading() - st.body);
      st.start = Object.assign({}, on);
      st.first = null;
      showReading(reading());
      feel(reading());
      drawWear();
      // one instruction at a time (D8): this exchange's line joins the card as it opens; the patient says how they
      // feel, then the doctor says the line (input is live throughout, E5)
      // the temperature's row has done its job: the card keeps to the exchanges (it fits the shortest phone)
      if (ctx.card.el && st.i === 1) ctx.card.setRows([c.row]);
      else ctx.card.addRow(c.row);
      ctx.card.now(c.id);
      st.busy = true;
      ctx.after(fast() ? 120 : 600, () => (st.busy = false));
      say(e.hot ? "fever-too-hot" : "fever-too-cold").then(() => {
        if (cur() === c && !st.over) ctx.say(c.row);
      });
      const target = e.mode === "fix" ? (e.fixWith[0] || "").split(":")[1] : e.answer.split(":")[1];
      S.cue(c.kind, CUES[c.kind], els[target] || els.window);
      hintLater(fast() ? 400 : 5000);
    };
    const next = () => {
      st.i++;
      if (cur()) open();
      else finish();
    };
    const closeEx = () => {
      const c = cur();
      ctx.card.tick(c.id);
      S.uncue();
      unhint();
      st.busy = true;
      st.hot = !st.hot;
      fig.react("happy", 0);
      say("fever-just-right").then(() => {});
      ctx.after(fast() ? 150 : 1300, () => {
        st.busy = false;
        next();
      });
    };
    const tapThing = (id) => {
      if (!S.ready || st.over) return;
      S.did();
      const c = cur();
      if (!c) return;
      if (id === "thermometer") {
        if (c.kind !== "temp") return;
        st.held = !st.held;
        els.thermometer.classList.toggle("held", st.held);
        ctx.sfx("tap");
        return;
      }
      if (c.kind === "temp") {
        // the thermometer's step: anything else in the room is simply there (nothing silently "wrong": it pulses)
        hintLater(0);
        return;
      }
      if (st.busy) return;
      const e = c.live;
      const key = `${on[id] ? "off" : "on"}:${id}`;
      if (st.first == null) {
        st.first = key;
        // the review says what was done instead (D14): the thing's own line, through the seam
        if (e.mode === "named") judge(c.id, key === e.answer, (() => {
          const w = lineOf({ mode: "named", answer: key }, cfg);
          return w.kutchi || w.english;
        })());
        else st.fixTaps = 0;
      }
      on[id] = !on[id];
      els[id].classList.toggle("on", !!on[id]);
      art(els[id], id, on[id] ? "on" : "off");
      const portable = !cfg.things[id].fixed;
      if (portable) els[id].classList.toggle("gone", !!on[id]); // it's on the patient now; a tap on the patient's spot takes it back
      ctx.sfx("tap");
      const r = reading();
      showReading(r);
      feel(r);
      drawWear();
      if (e.mode === "fix") st.fixTaps = (st.fixTaps || 0) + 1;
      if (inZone(r, cfg.k)) {
        if (e.mode === "fix") judge(c.id, true, `${st.fixTaps} taps`);
        closeEx();
        return;
      }
      // not yet: the patient says so (still hot, or now too cold) and the doctor's line stays; the named thing glows soon
      const crossed = Math.sign(r) !== (e.hot ? 1 : -1);
      say(r > 0 ? (crossed ? "fever-too-hot" : "fever-still-hot") : crossed ? "fever-too-cold" : "fever-still-cold");
      hintLater(fast() ? 300 : 2500);
    };
    // a tap on the patient: the thermometer goes in (the temperature step), or a thing they hold or wear comes back
    const tapPatient = (ev) => {
      if (!S.ready || st.over) return;
      const c = cur();
      if (!c) return;
      S.did();
      if (c.kind === "temp") {
        if (!st.held) return hintLater(0);
        st.held = false;
        st.measured = true;
        els.thermometer.classList.remove("held");
        els.thermometer.classList.add("gone");
        drawWear();
        ctx.sfx("tap");
        ctx.card.tick("temp");
        S.uncue();
        // the first swing: the reading rises (or falls) live, and the first named thing is said
        next();
        return;
      }
      // a portable thing on the patient: tap it again to take it back
      const worn = Object.keys(on).filter((id) => on[id] && !cfg.things[id].fixed);
      if (!worn.length) return;
      const p = ev && fig.partAt ? fig.partAt(ev.clientX, ev.clientY, { pad: 40 }) : null;
      const pick = (want) => worn.find((id) => want.includes(id));
      let id = null;
      if (p && /head|neck/.test(p.part)) id = pick(["ice-pack", "hand-fan"]);
      else if (p && /shoulder|arm|chest/.test(p.part)) id = pick(["blanket", "hand-fan"]);
      else if (p && /tummy|hand|elbow/.test(p.part)) id = pick(["bottle", "hand-fan", "blanket"]);
      if (!id) id = worn[worn.length - 1];
      tapThing(id);
    };
    ctx.on(fig.el, "click", (e) => {
      e.stopPropagation();
      tapPatient(e);
    });
    const finish = () => {
      st.over = true;
      unhint();
      S.uncue();
      ctx.card.now(null);
      fig.react("happy", 0);
      // the review's words: the things the doctor actually named (each exchange is built live)
      const named = new Set();
      P.steps.forEach((x) => x.live && x.live.answer && named.add(x.live.answer.split(":")[1]));
      const words = P.words.slice(0, 3).concat([...named].map((id) => L().w(cfg.things[id].word)));
      ctx.after(fast() ? 200 : 1200, () => ctx.done({ right: P.rows.filter((r) => st.judged[r.id]).length, total: P.rows.length, hints: 0, words }));
    };

    // the card: the first line only (one instruction at a time, D8); each exchange's line is added as it opens
    ctx.card.setRows([P.steps[0].row]);
    // the patient's own spot to tap (the figure is a DOM element; its click takes the thermometer or a worn thing)
    fig.el.style.cursor = "pointer";

    return {
      async start() {
        S.begin(WHY); // input is live at once (13i); the why beat only in the lab
        feel(null);
        open();
      },
      destroy() {
        unhint();
        fig.destroy();
        S.destroy();
      },
      debug: {
        get plan() {
          return P;
        },
        get cues() {
          return S.cueLog.slice();
        },
        get state() {
          return { i: st.i, on: Object.assign({}, on), reading: st.measured ? reading() : null, step: cur() && cur().kind, answer: cur() && cur().live ? cur().live.answer : null };
        },
        next() {
          if (!S.ready) return { do: "wait" };
          const c = cur();
          if (st.over || !c || st.busy) return { do: "wait" };
          const at = (el, what) => {
            const r = el.getBoundingClientRect();
            return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what };
          };
          if (c.kind === "temp") {
            if (!st.held) return at(els.thermometer, "thermometer");
            const hd = fig.el.querySelector(".fig-head") || fig.el;
            return at(hd, "patient");
          }
          const e = c.live;
          if (!e) return { do: "wait" };
          // take back anything changed this exchange that isn't the answer (after a slip)
          const want = e.mode === "fix" ? e.fixWith : [e.answer];
          const wantOn = {};
          want.forEach((k) => (wantOn[k.split(":")[1]] = k.split(":")[0] === "on"));
          for (const id of Object.keys(cfg.things)) {
            const target = id in wantOn ? wantOn[id] : !!st.start[id];
            if (!!on[id] !== target) {
              if (!cfg.things[id].fixed && on[id]) {
                // a worn thing is taken back on the patient
                const part = id === "blanket" ? ["shoulder", "left"] : id === "bottle" ? ["tummy"] : id === "ice-pack" ? ["head"] : ["hand", "left"];
                const q = fig.hotspot(part[0], part[1] || null, doc.documentElement);
                return { do: "tap", x: q.x, y: q.y, what: `take back ${id}` };
              }
              return at(els[id], id);
            }
          }
          return { do: "wait" };
        },
        slip() {
          // the first named exchange: a different thing first (it moves the reading too), then the driver puts it right
          const c = cur();
          if (!S.ready || st.busy || !c || c.kind !== "named" || st.first != null || !c.live) return null;
          const other = c.live.options.find((k) => k !== c.live.answer && k.startsWith("on:"));
          if (!other) return null;
          const r = els[other.split(":")[1]].getBoundingClientRect();
          return { do: "tap", x: r.left + r.width / 2, y: r.top + r.height / 2, what: `wrong ${other}` };
        },
      },
    };
  }

  function bot(level, rng) {
    let data = null;
    try {
      data = typeof require === "function" ? require("../../../../data/clinic/heal/fever.json") : null;
    } catch (e) {
      data = null;
    }
    const p = plan(level, rng, data);
    const b = HS.bot(p.rows, rng);
    // one more blind player: it reads the thermometer (hot or cold, and how far) and picks among the things that would
    // land in the zone; only the words say which of those the doctor named
    const base = b.solve;
    return Object.assign(b, {
      plan: p,
      strategies: b.strategies.concat(["reads-gauge"]),
      solve(strategy) {
        if (strategy !== "reads-gauge") return base(strategy);
        const res = p.ex.map((e) => e.mode === "fix" || HS.pick(e.landing, rng) === e.answer);
        return { right: res.filter(Boolean).length, total: res.length };
      },
    });
  }

  const def = {
    id: "fever",
    part: "head",
    ailments: ["fever"],
    items: ["thermometer"],
    gestures: ["tap"],
    levels: [1, 2, 3],
    plan,
    mount,
    bot,
    why: WHY,
    cues: CUES,
    steps: (level, rng) => plan(level, rng).steps.map((x) => x.kind),
    // pure helpers for the tests
    room: { readingOf, exchange, solve, cfgOf, inZone },
  };
  if (Heal) Heal.register(def);
  if (typeof module === "object" && module.exports) module.exports = def;
})(typeof globalThis !== "undefined" ? globalThis : this);
