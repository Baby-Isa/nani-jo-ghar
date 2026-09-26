/*
 * The clinic: a person drawn in the DOM (an inline SVG), the greybox
 * patient every stage and every healing game shares. Built on the same
 * hotspot polygons as before (data/patients/grey-adult.json through
 * js/clinic/body.js): sides are the PATIENT'S own (they face you, so their
 * left is on the right of your screen), nothing on the body is labelled,
 * and no part stands out (the knee is drawn as part of the leg).
 *
 *   const fig = Clinic.Figure.make(bodyFile, {kind: "girl", colour: "red", size: "big"});
 *   parent.appendChild(fig.el);
 *   fig.hotspot("knee", "left", frameEl) -> {x, y, r}   (px, relative to frameEl)
 *   fig.partAt(clientX, clientY, {active, closeup}) -> {part, side} | null
 *   fig.react("ouch" | "giggle" | "relief" | "happy" | "sad" | "scared" | ...)
 *   fig.pose("sit" | "stand" | "kick" | "wave" | "shake" | "nod" | "hop" | "jump")
 *   fig.swirl(part, side, on) · fig.mark(part, side, kind, {colour}) · fig.focus(part, side, zoom)
 *
 * Kinds (P2): girl, boy, old-man, old-woman, baby, auntie, uncle, and the
 * family on top (nana, nani, ma, ali, bigma, cousin). Rough art replaces
 * the drawing when data/clinic/rough-art.json names a sprite for the kind.
 */
(function (global) {
  "use strict";
  const Clinic = (global.Clinic = global.Clinic || {});
  const NS = "http://www.w3.org/2000/svg";
  const VB = [330, 10, 620, 900]; // x, y, w, h: the seated figure with room for hair and a cap

  const KINDS = {
    girl: { scale: 0.74, hair: "bunches", hairCol: "#2b1d16", clothes: "#d9577a", legs: "#d9577a", skirt: true },
    boy: { scale: 0.74, hair: "short", hairCol: "#2b1d16", clothes: "#3f7fcf", legs: "#34495e" },
    "old-man": { scale: 1, hair: "bald", hairCol: "#e8e6e1", clothes: "#e9e3d3", legs: "#e9e3d3", moustache: true, cap: true, skin: "#b8845f" },
    "old-woman": { scale: 0.95, hair: "bun", hairCol: "#e8e6e1", clothes: "#6a8f5b", legs: "#6a8f5b", dupatta: "#e8d9b5", skin: "#c0906b" },
    baby: { scale: 0.46, hair: "tuft", hairCol: "#2b1d16", clothes: "#f3d36b", legs: "#f3d36b" },
    auntie: { scale: 0.96, hair: "long", hairCol: "#2b1d16", clothes: "#8e5bb5", legs: "#8e5bb5", dupatta: "#f0c24a" },
    uncle: { scale: 1, hair: "short", hairCol: "#2b1d16", clothes: "#5b8fa8", legs: "#3b3b46", moustache: true },
    nana: { scale: 1, hair: "bald", hairCol: "#e8e6e1", clothes: "#f2efe6", legs: "#f2efe6", moustache: true, cap: true, glasses: true, skin: "#b8845f" },
    nani: { scale: 0.95, hair: "bun", hairCol: "#d8d6d1", clothes: "#b74a4a", legs: "#b74a4a", dupatta: "#f2efe6", glasses: true, skin: "#c0906b" },
    ma: { scale: 0.96, hair: "long", hairCol: "#2b1d16", clothes: "#2e8b7a", legs: "#2e8b7a", dupatta: "#e2b04a" },
    ali: { scale: 0.76, hair: "short", hairCol: "#1e1510", clothes: "#e07b39", legs: "#34495e" },
    bigma: { scale: 1, hair: "bun", hairCol: "#8a8a8a", clothes: "#7a4f9a", legs: "#7a4f9a", dupatta: "#f0e6d0", skin: "#c0906b" },
    cousin: { scale: 0.84, hair: "short", hairCol: "#2b1d16", clothes: "#4caf7a", legs: "#34495e" },
    grey: { scale: 1, hair: "none", clothes: "#9aa0a8", legs: "#9aa0a8", skin: "#aab0b8" },
  };
  const COLOURS = {
    red: "#d23b3b", blue: "#3b6fd2", green: "#3fa35b", yellow: "#f0c43a", white: "#f4f1ea", black: "#33333b",
    pink: "#e77fb0", orange: "#e8872f", purple: "#8e5bb5", brown: "#8a5a3a", grey: "#9aa0a8",
  };
  Clinic.Figure = { KINDS, COLOURS, VB };

  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => v != null && n.setAttribute(k, v));
    if (parent) parent.appendChild(n);
    return n;
  };
  const pts = (poly) => poly.map((p) => p.join(",")).join(" ");
  const sideKey = (side) => (side ? String(side).replace(/^side-/, "") : null);
  const partId = (p) => (!p ? p : String(p).startsWith("body-") ? p : `body-${p}`);

  Clinic.Figure.make = function (bodyFile, opts = {}) {
    const body = global.ClinicBody.build(bodyFile);
    const kindId = opts.kind || "grey";
    const K = Object.assign({}, KINDS[kindId] || KINDS.grey);
    if (opts.colour) K.clothes = COLOURS[opts.colour] || opts.colour;
    const skin = opts.skin || K.skin || "#c99a74";
    let scale = K.scale * (opts.size === "big" ? 1.08 : opts.size === "small" ? 0.88 : 1);
    const P = body.polys;

    const root = document.createElement("div");
    root.className = `cl-fig kind-${kindId}`;
    root.dataset.kind = kindId;
    if (opts.colour) root.dataset.colour = opts.colour;
    const svg = el("svg", { viewBox: VB.join(" "), preserveAspectRatio: "xMidYMax meet", class: "cl-fig-svg", "aria-hidden": "true" });
    root.appendChild(svg);
    // the spritesheet art, when the rough art exists for this kind
    const art = opts.art || null;
    // the wobble animates an outer group; the scale lives on the inner one (a CSS transform-origin on
    // an element with a transform attribute would move the whole figure)
    const wob = el("g", { class: "fig-wob" }, svg);
    const g = el("g", { class: "fig-root", transform: `translate(640 898) scale(${scale}) translate(-640 -898)` }, wob);
    const groups = {
      legR: el("g", { class: "fig-leg fig-leg-right" }, g),
      legL: el("g", { class: "fig-leg fig-leg-left" }, g),
      core: el("g", { class: "fig-core" }, g),
      armR: el("g", { class: "fig-arm fig-arm-right" }, g),
      armL: el("g", { class: "fig-arm fig-arm-left" }, g),
      head: el("g", { class: "fig-head" }, g),
      marks: el("g", { class: "fig-marks" }, g),
      fx: el("g", { class: "fig-fx" }, g),
    };
    // pivots for the CSS animations (the hip for a kick, the shoulder for a wave, the neck for a nod)
    const hip = body.spot("body-leg", "side-left");
    groups.legL.style.transformOrigin = `${hip[0]}px ${hip[1] - 90}px`;
    const hipR = body.spot("body-leg", "side-right");
    groups.legR.style.transformOrigin = `${hipR[0]}px ${hipR[1] - 90}px`;
    const sh = body.spot("body-shoulder", "side-left");
    groups.armL.style.transformOrigin = `${sh[0]}px ${sh[1]}px`;
    const shR = body.spot("body-shoulder", "side-right");
    groups.armR.style.transformOrigin = `${shR[0]}px ${shR[1]}px`;
    groups.head.style.transformOrigin = "640px 235px";

    const fill = (k) => {
      const p = body.split(k).part;
      if (/head|neck|hand|finger|foot|toe/.test(p)) return skin;
      if (/leg|knee/.test(p)) return K.legs || K.clothes;
      return K.clothes;
    };
    const where = (k) => {
      const { part, side } = body.split(k);
      const s = side === "side-left" ? "L" : "R";
      if (/leg|knee|foot|toe/.test(part)) return groups[`leg${s}`];
      if (/shoulder|arm|elbow|hand|finger/.test(part)) return groups[`arm${s}`];
      if (/head|eye|ear|nose|mouth|tooth|throat/.test(part)) return groups.head;
      return groups.core;
    };
    // big parts first, so the small ones (the knee) sit on top in the same colour: no part stands out
    const order = body.keys.slice().sort((a, b) => global.ClinicBody.area(P[b]) - global.ClinicBody.area(P[a]));
    order.forEach((k) => {
      if (/body-(eye|nose|mouth|tooth|throat|ear)/.test(k)) return;
      el("polygon", { points: pts(P[k]), fill: fill(k), stroke: "rgba(60,50,45,.35)", "stroke-width": 3, "stroke-linejoin": "round", "data-k": k }, where(k));
    });
    if (K.skirt) {
      const l = body.spot("body-knee", "side-left");
      const r = body.spot("body-knee", "side-right");
      el("path", { d: `M ${r[0] - 40} 560 L ${l[0] + 40} 560 L ${l[0] + 50} ${l[1] - 60} L ${r[0] - 50} ${r[1] - 60} Z`, fill: K.clothes, stroke: "rgba(60,50,45,.35)", "stroke-width": 3 }, groups.core);
    }
    if (K.dupatta) el("path", { d: "M 548 150 Q 520 330 560 470 L 600 470 Q 580 300 600 200 Z", fill: K.dupatta, opacity: 0.9 }, groups.core);
    // ears (tappable in the close-up; drawn as part of the head)
    ["left", "right"].forEach((s) => P[`body-ear.${s}`] && el("polygon", { points: pts(P[`body-ear.${s}`]), fill: skin, stroke: "rgba(60,50,45,.35)", "stroke-width": 2 }, groups.head));
    // hair
    const hc = K.hairCol || "#2b1d16";
    const hair = el("g", { class: "fig-hair" }, groups.head);
    if (K.hair === "short") el("path", { d: "M 552 130 Q 556 40 640 36 Q 724 40 728 130 Q 700 80 640 78 Q 580 80 552 130 Z", fill: hc }, hair);
    if (K.hair === "bunches") {
      el("path", { d: "M 550 140 Q 552 38 640 34 Q 728 38 730 140 Q 700 78 640 76 Q 580 78 550 140 Z", fill: hc }, hair);
      el("circle", { cx: 540, cy: 110, r: 30, fill: hc }, hair);
      el("circle", { cx: 740, cy: 110, r: 30, fill: hc }, hair);
    }
    if (K.hair === "long") el("path", { d: "M 548 250 Q 530 40 640 34 Q 750 40 732 250 L 712 250 Q 720 90 640 78 Q 560 90 568 250 Z", fill: hc }, hair);
    if (K.hair === "bun") {
      el("path", { d: "M 550 130 Q 554 40 640 36 Q 726 40 730 130 Q 700 82 640 80 Q 580 82 550 130 Z", fill: hc }, hair);
      el("circle", { cx: 640, cy: 30, r: 26, fill: hc }, hair);
    }
    if (K.hair === "bald") el("path", { d: "M 552 150 Q 548 110 566 96 L 572 150 Z M 728 150 Q 732 110 714 96 L 708 150 Z", fill: hc }, hair);
    if (K.hair === "tuft") el("path", { d: "M 630 40 Q 640 10 652 40 Q 646 30 640 44 Z", fill: hc, stroke: hc, "stroke-width": 6 }, hair);
    if (K.cap) el("path", { d: "M 566 70 Q 640 10 714 70 L 714 84 L 566 84 Z", fill: "#f4f1ea", stroke: "#cfc8b8", "stroke-width": 3 }, hair);
    // the face
    const face = el("g", { class: "fig-face" }, groups.head);
    const eyeL = body.spot("body-eye", "side-left");
    const eyeR = body.spot("body-eye", "side-right");
    const mouth = body.spot("body-mouth");
    const nose = body.spot("body-nose");
    let mood = "idle";
    const drawFace = () => {
      while (face.firstChild) face.removeChild(face.firstChild);
      const ink = "#3a2e28";
      const shut = ["giggle", "happy", "relief", "sleepy"].includes(mood);
      [eyeL, eyeR].forEach(([x, y]) => {
        if (shut) el("path", { d: `M ${x - 11} ${y + 3} Q ${x} ${y - 9} ${x + 11} ${y + 3}`, fill: "none", stroke: ink, "stroke-width": 5, "stroke-linecap": "round" }, face);
        else if (mood === "ouch" || mood === "sour") el("path", { d: `M ${x - 11} ${y - 5} L ${x + 9} ${y} L ${x - 11} ${y + 5}`, fill: "none", stroke: ink, "stroke-width": 5, "stroke-linecap": "round" }, face);
        else el("circle", { cx: x, cy: y, r: mood === "scared" ? 10 : 7, fill: mood === "scared" ? "#fff" : ink, stroke: ink, "stroke-width": 3 }, face);
        if (mood === "scared") el("circle", { cx: x, cy: y, r: 4, fill: ink }, face);
        if (mood === "sad") el("path", { d: `M ${x - 12} ${y - 16} L ${x + 10} ${y - 20}`, stroke: ink, "stroke-width": 4, "stroke-linecap": "round" }, face);
      });
      if (K.glasses) [eyeL, eyeR].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 17, fill: "none", stroke: "#3a3a44", "stroke-width": 3 }, face));
      el("path", { d: `M ${nose[0]} ${nose[1] - 16} L ${nose[0] - 7} ${nose[1] + 8} L ${nose[0] + 3} ${nose[1] + 8}`, fill: "none", stroke: "rgba(90,60,50,.6)", "stroke-width": 3, "stroke-linecap": "round" }, face);
      if (K.moustache) el("path", { d: `M ${mouth[0] - 30} ${mouth[1] - 10} Q ${mouth[0]} ${mouth[1] - 26} ${mouth[0] + 30} ${mouth[1] - 10} Q ${mouth[0]} ${mouth[1] - 14} ${mouth[0] - 30} ${mouth[1] - 10} Z`, fill: K.hairCol || "#333" }, face);
      const [mx, my] = mouth;
      const m = { stroke: "#5a3a33", "stroke-width": 5, fill: "none", "stroke-linecap": "round" };
      if (mood === "happy" || mood === "giggle") el("path", Object.assign({}, m, { d: `M ${mx - 22} ${my - 6} Q ${mx} ${my + 22} ${mx + 22} ${my - 6} Z`, fill: "#7a2e2e" }), face);
      else if (mood === "relief") el("path", Object.assign({}, m, { d: `M ${mx - 18} ${my - 2} Q ${mx} ${my + 12} ${mx + 18} ${my - 2}` }), face);
      else if (mood === "ouch" || mood === "ahh" || mood === "scared") el("ellipse", { cx: mx, cy: my + 2, rx: mood === "ahh" ? 20 : 12, ry: mood === "ahh" ? 18 : 12, fill: "#5a2a2a" }, face);
      else if (mood === "sad") el("path", Object.assign({}, m, { d: `M ${mx - 18} ${my + 8} Q ${mx} ${my - 8} ${mx + 18} ${my + 8}` }), face);
      else if (mood === "sour") el("path", Object.assign({}, m, { d: `M ${mx - 8} ${my} Q ${mx} ${my - 8} ${mx + 8} ${my} Q ${mx} ${my + 8} ${mx - 8} ${my}` }), face);
      else if (mood === "yuck" || mood === "salty") el("path", Object.assign({}, m, { d: `M ${mx - 20} ${my} L ${mx - 8} ${my - 6} L ${mx + 4} ${my + 4} L ${mx + 20} ${my - 4}` }), face);
      else el("path", Object.assign({}, m, { d: `M ${mx - 16} ${my} L ${mx + 16} ${my}` }), face);
      if (mood === "hot") [eyeL, eyeR].forEach(([x, y]) => el("ellipse", { cx: x + (x < 640 ? -16 : 16), cy: y + 34, rx: 16, ry: 9, fill: "#e8676a", opacity: 0.6 }, face));
      if (mood === "cold") el("path", { d: `M ${mx - 16} ${my + 16} l 6 -6 l 6 6 l 6 -6 l 6 6 l 6 -6`, stroke: "#6aa6d8", "stroke-width": 3, fill: "none" }, face);
    };
    drawFace();

    const toClient = (x, y) => {
      const m = g.getScreenCTM();
      if (!m) return { x: 0, y: 0 };
      const p = svg.createSVGPoint();
      p.x = x;
      p.y = y;
      const q = p.matrixTransform(m);
      return { x: q.x, y: q.y, scale: Math.hypot(m.a, m.b) };
    };
    const toDesign = (cx, cy) => {
      const m = g.getScreenCTM();
      if (!m) return [0, 0];
      const p = svg.createSVGPoint();
      p.x = cx;
      p.y = cy;
      const q = p.matrixTransform(m.inverse());
      return [q.x, q.y];
    };
    let focusTo = null;
    let animBox = VB.slice();
    const setBox = (b) => {
      animBox = b;
      svg.setAttribute("viewBox", b.map((v) => Math.round(v * 10) / 10).join(" "));
    };

    const fig = {
      el: root,
      svg,
      body,
      kind: kindId,
      colour: opts.colour || null,
      size: opts.size || null,
      art,
      /** Where a part is: {x, y, r} in px relative to `frame` (default: the figure's parent). r ~ the part's radius. */
      hotspot(part, side, frame) {
        const pid = partId(part);
        const s = sideKey(side);
        const [dx, dy] = body.spot(pid, s ? `side-${s}` : null);
        const c = toClient(dx, dy);
        const k = body.keyOf(pid, s ? `side-${s}` : null);
        const a = k ? global.ClinicBody.area(P[k]) : 3000;
        const f = frame || root.parentElement || root;
        const fr = f.getBoundingClientRect();
        return { x: c.x - fr.left, y: c.y - fr.top, r: Math.sqrt(a / Math.PI) * (c.scale || 1) };
      },
      /** The part under a client point: {part (no "body-"), side ("left"/"right"/null), key} or null. */
      partAt(cx, cy, { active, closeup = false, pad = 60 } = {}) {
        const [x, y] = toDesign(cx, cy);
        const act = (active || body.keys.map((k) => body.split(k).part)).map(partId);
        const h = body.hit(x, y, { active: act, closeup, pad: pad / scale });
        if (!h) return null;
        return { part: h.part.replace(/^body-/, ""), side: h.side ? h.side.replace("side-", "") : null, key: h.key };
      },
      react(m, ms) {
        mood = m || "idle";
        drawFace();
        root.dataset.mood = mood;
        root.classList.remove("react");
        void root.offsetWidth;
        root.classList.add("react");
        clearTimeout(fig._rt);
        if (ms !== 0 && ["ouch", "giggle", "sour", "salty", "yuck"].includes(mood)) fig._rt = setTimeout(() => fig.react("idle", 0), ms || 1400);
      },
      mood: () => mood,
      pose(name) {
        const one = ["kick", "kick-left", "kick-right", "wave", "shake", "nod", "hop", "jump", "jerk", "shiver"];
        root.classList.remove(...one.map((n) => `pose-${n}`));
        if (name === "stand" || name === "sit") {
          root.classList.toggle("standing", name === "stand");
          return;
        }
        void root.offsetWidth;
        root.classList.add(`pose-${name}`);
        clearTimeout(fig._pt);
        fig._pt = setTimeout(() => root.classList.remove(`pose-${name}`), 1200);
      },
      swirl(part, side, on = true) {
        const key = `swirl:${partId(part)}:${sideKey(side) || ""}`;
        groups.fx.querySelectorAll(`[data-key^="swirl:${partId(part)}:"]`).forEach((n) => (!on || n.dataset.key === key) && n.remove());
        if (!on) return;
        const [x, y] = body.spot(partId(part), side ? `side-${sideKey(side)}` : null);
        const s = el("g", { class: "fig-swirl", "data-key": key, transform: `translate(${x} ${y})` }, groups.fx);
        el("path", { d: "M 0 0 m -4 0 a 4 4 0 1 1 8 0 a 9 9 0 1 1 -18 0 a 14 14 0 1 1 28 0 a 19 19 0 1 1 -38 0", fill: "none", stroke: "#e2557a", "stroke-width": 5, "stroke-linecap": "round", opacity: 0.85 }, s);
      },
      /** A visible state on the body (a plaster, a bandage, a cast, a patch): returns the SVG node. */
      mark(part, side, kind, o = {}) {
        const pid = partId(part);
        const s = side ? `side-${sideKey(side)}` : null;
        const [x, y] = body.spot(pid, s);
        const col = COLOURS[o.colour] || o.colour;
        const gg = el("g", { class: `fig-mark mark-${kind}`, transform: `translate(${x} ${y}) rotate(${o.rotate || 0})` }, groups.marks);
        if (kind === "plaster") {
          el("rect", { x: -34, y: -13, width: 68, height: 26, rx: 12, fill: col || "#f2c9a0", stroke: "#b88a64", "stroke-width": 2 }, gg);
          el("rect", { x: -10, y: -9, width: 20, height: 18, rx: 4, fill: "#fbe6d3" }, gg);
        } else if (kind === "bandage" || kind === "cast") {
          for (let i = 0; i < (o.turns || 3); i++) el("rect", { x: -44, y: -30 + i * 16, width: 88, height: 18, rx: 8, fill: col || (kind === "cast" ? "#f4f1ea" : "#f7f3ea"), stroke: "rgba(0,0,0,.2)", "stroke-width": 2 }, gg);
        } else if (kind === "patch") {
          el("ellipse", { cx: 0, cy: 0, rx: 26, ry: 20, fill: col || "#222" }, gg);
          el("line", { x1: -26, y1: -4, x2: -90, y2: -40, stroke: "#222", "stroke-width": 3 }, gg);
          el("line", { x1: 26, y1: -4, x2: 90, y2: -40, stroke: "#222", "stroke-width": 3 }, gg);
        } else if (kind === "cloth") {
          el("rect", { x: -60, y: -16, width: 120, height: 32, rx: 8, fill: col || "#bfe3f5", opacity: 0.95 }, gg);
        } else if (kind === "blanket") {
          el("rect", { x: -150, y: -60, width: 300, height: 240, rx: 30, fill: col || "#e0a14a", stroke: "rgba(0,0,0,.15)", "stroke-width": 4 }, gg);
        } else {
          el("circle", { cx: 0, cy: 0, r: o.r || 14, fill: col || "#7fb3e0", opacity: 0.9 }, gg);
        }
        return gg;
      },
      clearMarks() {
        while (groups.marks.firstChild) groups.marks.removeChild(groups.marks.firstChild);
      },
      /** Zoom onto a part (the close-up): zoom 1 = the whole figure. Animated. focus(null) goes back. */
      focus(part, side, zoom = 2.6, ms = 450) {
        let to;
        if (!part) to = VB.slice();
        else {
          const [x, y] = body.spot(partId(part), side ? `side-${sideKey(side)}` : null);
          const c = { x: 640 + (x - 640) * scale, y: 898 + (y - 898) * scale };
          const w = VB[2] / zoom;
          const h = VB[3] / zoom;
          to = [c.x - w / 2, c.y - h / 2, w, h];
        }
        const from = animBox.slice();
        const t0 = performance.now();
        cancelAnimationFrame(focusTo);
        return new Promise((res) => {
          const step = (t) => {
            const k = ms ? Math.min(1, (t - t0) / ms) : 1;
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            setBox(from.map((v, i) => v + (to[i] - v) * e));
            if (k < 1) focusTo = requestAnimationFrame(step);
            else res();
          };
          focusTo = requestAnimationFrame(step);
        });
      },
      setScale(s) {
        scale = s;
        g.setAttribute("transform", `translate(640 898) scale(${s}) translate(-640 -898)`);
      },
      groups,
      destroy() {
        clearTimeout(fig._rt);
        clearTimeout(fig._pt);
        cancelAnimationFrame(focusTo);
        root.remove();
      },
    };
    return fig;
  };
})(typeof self !== "undefined" ? self : this);
