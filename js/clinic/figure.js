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
  /**
   * CLN-81 (6 Oct, CL1): a person's round face for a card, a pill, a bench seat or the sticker: the finished art's head
   * for a kind that has it (data/clinic/heal-art.json patients[kind].heads, the girl now), else the stages' rough face.
   * The heal art must be loaded (Clinic.HealHost.healArt, by Run.load); the sticker's happy face is her happy head.
   */
  Clinic.Figure.face = function (kind, mood) {
    const Kit = Clinic.Kit;
    const HA = (Clinic.HealHost && Clinic.HealHost.healArt) || (Clinic.Stages && Clinic.Stages._healArt) || null;
    const spec = HA && HA.patients && HA.patients[kind];
    const heads = spec && spec.heads;
    if (!heads) return Clinic.Stages.personFace(kind, mood);
    const F = { ouch: "pain", sore: "pain", giggle: "happy", relief: "happy", scared: "sad" };
    const m = F[mood] || mood || "neutral";
    const f = document.createElement("div");
    f.className = "cl-face person art";
    const img = document.createElement("img");
    img.alt = "";
    img.src = Kit.url(heads[m] || heads.neutral);
    f.appendChild(img);
    return f;
  };

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
        const at = fig.artSpot && fig.artSpot(part, side);
        if (at) {
          const f = frame || root.parentElement || root;
          const fr = f.getBoundingClientRect();
          return { x: at.x - fr.left, y: at.y - fr.top, r: at.r };
        }
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
      partAt(cx, cy, { active, closeup = false, pad = 60, prefer = null } = {}) {
        // A2 (5 Oct): on the art (front pose), its measured tap areas (heal-art.json patients[kind].taps): the
        // smallest area holding the tap wins, else the nearest within pad; face parts only in the close-up, as below.
        // Two parts on one spot (her closed mouth is also the tooth) give `prefer` when it's one of them
        const T = fig.art && fig.art.view === "front" && fig.art.spec.taps;
        if (T) {
          const r = fig.art.base.getBoundingClientRect();
          if (!r.height) return null;
          const act = new Set((active || Object.keys(T).map((k) => k.split(".")[0])).map((p) => partId(p)));
          let best = [];
          let bd = Infinity;
          Object.entries(T).forEach(([k, [ax, ay, ar]]) => {
            const [p, sd] = k.split(".");
            const pid = partId(p);
            if (!act.has(pid)) return;
            const face = body.isFace(pid);
            if (closeup ? !(face || pid === "body-head") : face) return;
            const d = Math.hypot(cx - (r.left + ax * r.width), cy - (r.top + ay * r.height));
            const R = ar * r.height;
            // inside: rank by the area's size (smaller first); outside: by the distance past its edge, plus pad
            const score = d <= R ? R - 1e6 : d - R <= pad ? d - R : Infinity;
            if (score < bd - 1e-6) (bd = score), (best = [{ part: p, side: sd || null, key: k }]);
            else if (Math.abs(score - bd) <= 1e-6) best.push({ part: p, side: sd || null, key: k });
          });
          if (!best.length) return null;
          return best.find((b) => prefer && b.part === String(prefer).replace(/^body-/, "")) || best[0];
        }
        const [x, y] = toDesign(cx, cy);
        const act = (active || body.keys.map((k) => body.split(k).part)).map(partId);
        const h = body.hit(x, y, { active: act, closeup, pad: pad / scale });
        if (!h) return null;
        return { part: h.part.replace(/^body-/, ""), side: h.side ? h.side.replace("side-", "") : null, key: h.key };
      },
      react(m, ms) {
        mood = m || "idle";
        drawFace();
        fig.artMood(mood);
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
        // D9, CLN-95 (6 Oct): no swirl icon over the sore part ("it brings it down"): the patient's own sore look
        // (her pain face, set by the games) shows it. The sore part is still remembered for the zoom and the art.
        fig._artSwirl = on ? [part, side] : null;
        fig._sore = on ? [part, side] : null;
        if (!fig.noSwirl) return;
        if (fig.art) {
          // on the art: the same swirl as a small DOM layer at the part's anchor
          fig.artEl.querySelectorAll(".fig-art-swirl").forEach((n) => n.remove());
          fig._artSwirl = on ? [part, side] : null;
          const at = on && fig.artAnchor(part, side);
          if (!at) return;
          const w = document.createElement("div");
          w.className = "fig-art-swirl";
          w.style.left = `${at.x * 100}%`;
          w.style.top = `${at.y * 100}%`;
          w.innerHTML = '<svg viewBox="-24 -24 48 48" aria-hidden="true"><path class="fig-swirl" d="M 0 0 m -4 0 a 4 4 0 1 1 8 0 a 9 9 0 1 1 -18 0 a 14 14 0 1 1 28 0 a 19 19 0 1 1 -38 0" fill="none" stroke="#e2557a" stroke-width="5" stroke-linecap="round" opacity="0.85"/></svg>';
          fig.artEl.appendChild(w);
          return;
        }
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
        if (fig.art) fig.artFit();
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
        if (fig.art) {
          // A2 (5 Oct): on the art, the whole figure (the art and the marks over it) is scaled about the part's spot
          const a = part ? fig.artAnchor(part, side) || fig.artAnchor("head") : null;
          const box = fig.artBox;
          if (a && box) {
            const br = box.getBoundingClientRect();
            const rr = root.getBoundingClientRect();
            const k = root.style.transform ? parseFloat((/scale\(([\d.]+)\)/.exec(root.style.transform) || [0, 1])[1]) : 1;
            root.style.transformOrigin = `${((br.left - rr.left) / k + (a.x * br.width) / k) / (rr.width / k) * 100}% ${((br.top - rr.top) / k + (a.y * br.height) / k) / (rr.height / k) * 100}%`;
          }
          const to = part ? zoom : 1;
          const anim = root.animate ? root.animate([{ transform: root.style.transform || "scale(1)" }, { transform: `scale(${to})` }], { duration: ms || 1, easing: "ease-in-out" }) : null;
          root.style.transform = to === 1 ? "" : `scale(${to})`;
          return anim ? anim.finished.catch(() => {}) : Promise.resolve();
        }
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
      /**
       * The real art (pack clinic-heal-v3; data/clinic/heal-art.json, cut by build/cut_clinic_heal_v3.py): the
       * patient's wide pose drawn over the figure in place of the greybox, the face swapped by mood, and the hotspots
       * read from the art's measured anchors instead of the greybox polygons. spec = heal-art.json patients[kind];
       * o.view "front" | "side"; o.figH = the figure box's height as a share of the room (scenes-v2 exam.fig.h), so
       * the art is drawn at its own room size (art plan section 2.2). Returns false when there is no art.
       */
      useArt(spec, o = {}) {
        const view = o.view === "side" && spec && spec.side ? "side" : "front";
        const V = view === "side" ? spec.side : spec;
        if (!spec || !V || !(view === "side" ? V.file : V.front)) return false;
        const url = (p) => {
          const Kit = global.Clinic && global.Clinic.Kit;
          const two = String(p).replace(/\.webp$/, "@2x.webp"); // the zoom pushes in up to 5x: always the @2x
          return Kit && Kit.url ? Kit.url(two) : two;
        };
        if (fig.artBox) fig.artBox.remove();
        const box = document.createElement("div");
        box.className = `fig-art view-${view}`;
        const roomPx = 1024; // the room's own height in px: the art's 1x size is measured on it
        const hFrac = V.h / roomPx / (o.figH || 0.56);
        const feet = V.feet != null ? V.feet : 0.98;
        const seat = (V.anchors && V.anchors.seat) || [0.5, 0.7];
        box.style.height = `${hFrac * 100}%`;
        box.style.bottom = `${-(1 - feet) * hFrac * 100}%`;
        box.style.left = "50%";
        box.style.aspectRatio = `${V.w} / ${V.h}`;
        box.style.transform = `translateX(${-seat[0] * 100}%)`;
        // the pictures in an inner layer, so the wobble and the shiver animate it without losing the placement
        const inner = document.createElement("div");
        inner.className = "fig-art-in";
        box.appendChild(inner);
        const img = (src, cls) => {
          const i = document.createElement("img");
          i.className = cls;
          i.alt = "";
          i.draggable = false;
          i.src = url(src);
          inner.appendChild(i);
          return i;
        };
        const base = img(view === "side" ? V.file : V.front, "fig-art-base");
        const face = img(view === "side" ? V.file : V.front, "fig-art-face");
        face.hidden = true;
        root.appendChild(box);
        root.classList.add("has-art");
        fig.artEl = inner;
        fig.artBox = box;
        fig.tapAnchors = false; // the diagnosis turns it on (its tap areas); a heal game's zoom uses the anchors
        fig.art = { spec, view, V, base, face, body: "front" };
        fig.artMood(mood);
        const sw = groups.fx.querySelector(".fig-swirl");
        if (sw) {
          const [, pk, sk] = sw.dataset.key.split(":");
          fig.swirl(pk, sk || null, true);
        }
        return true;
      },
      /** Back to the greybox (a stage the art has no pose for, e.g. standing): the art layer is dropped. */
      dropArt() {
        if (!fig.artBox) return;
        fig.artBox.remove();
        root.classList.remove("has-art");
        groups.marks.removeAttribute("transform");
        root.style.transform = "";
        fig.tapAnchors = false;
        fig.art = fig.artEl = fig.artBox = null;
      },
      /** The art's face for a mood (W2-W6 on the front; W8 happy on the side); the greybox's moods map onto them. */
      artMood(m) {
        const A = fig.art;
        if (!A) return;
        const F = { ouch: "pain", sour: "pain", yuck: "pain", salty: "pain", giggle: "happy", happy: "happy", relief: "happy", sad: "sad", scared: "sad", hot: "hot", cold: "cold" };
        const f = F[m];
        const src = A.view === "side" ? (f === "happy" ? A.V.happy : null) : f && A.spec.faces && A.spec.faces[f];
        // the blanket and the bottle are whole figures with their own cosy face: only the bare front takes a face layer
        if (src && A.body === "front") {
          const Kit = global.Clinic && global.Clinic.Kit;
          const two = String(src).replace(/\.webp$/, "@2x.webp");
          const u = Kit && Kit.url ? Kit.url(two) : two;
          if (A.face.dataset.src !== u) {
            A.face.src = u;
            A.face.dataset.src = u;
          }
          A.face.hidden = false;
        } else A.face.hidden = true;
      },
      /** The whole front figure: "front" (bare), "blanket" (W9) or "bottle" (W10); false when that art isn't there. */
      artBody(name) {
        const A = fig.art;
        if (!A || A.view !== "front") return false;
        const src = name === "front" ? A.spec.front : A.spec[name];
        if (!src) return false;
        const Kit = global.Clinic && global.Clinic.Kit;
        const two = String(src).replace(/\.webp$/, "@2x.webp");
        A.base.src = Kit && Kit.url ? Kit.url(two) : two;
        A.body = name;
        fig.artMood(mood);
        return true;
      },
      /**
       * T30, CLN-85 (decision 55): a point on the figure a speech bubble can come from (her face): a tiny element at
       * the part's place on the art (or the greybox head), kept with the figure as it zooms. Voice.speakers.patient
       * takes it so her bubbles sit beside her face, never at the corner.
       */
      anchorEl(part = "mouth", side = null) {
        const host = fig.artEl || root.querySelector(".fig-head") || root;
        let a = host.querySelector(":scope > .fig-anchor");
        if (!a) {
          a = document.createElement("i");
          a.className = "fig-anchor";
          host.appendChild(a);
        }
        const at = fig.art && fig.artAnchor(part, side);
        a.style.left = at ? `${at.x * 100}%` : "50%";
        a.style.top = at ? `${at.y * 100}%` : "40%";
        return a;
      },
      /** A part's place on the art, in client px ({x, y, r}), from the measured anchors; null without art or anchor. */
      artAnchor(part, side) {
        const A = fig.art;
        if (!A || !A.V.anchors) return null;
        const p = String(part || "").replace(/^body-/, "");
        const sd = sideKey(side);
        const N = { leg: "knee", shin: "knee", thigh: "knee", arm: "forearm", elbow: "forearm", wrist: "forearm", shoulder: "upperarm", sole: "foot", toe: "foot", eye: "eyes", tooth: "mouth", throat: "mouth", tongue: "mouth", nose: "eyes", cheek: "mouth", finger: "hand", belly: "tummy", chest: "tummy", back: "tummy" };
        // A2 (5 Oct): in the diagnosis (fig.tapAnchors), the parts' spots are its tap areas, so a hint, a swirl and
        // a tap all agree (the heal games keep the zoom anchors: their match cuts are measured on them)
        const T = fig.tapAnchors && A.view === "front" && A.spec.taps;
        const t = T && ((sd && T[`${p}.${sd}`]) || T[p] || T[`${p}.left`]);
        if (t) return { x: t[0], y: t[1], q: p, r: t[2] };
        const q = N[p] || p;
        const an = A.V.anchors;
        const a = (sd && an[`${q}.${sd}`]) || an[q] || an[`${q}.left`] || null;
        return a ? { x: a[0], y: a[1], q } : null;
      },
      artSpot(part, side) {
        const a = fig.artAnchor(part, side);
        if (!a) return null;
        const r = fig.art.base.getBoundingClientRect();
        if (!r.height) return null;
        // the part's radius as a share of the figure's height (for the zoom's push-in: the part fills ~60 %)
        const R = { eyes: 0.05, ear: 0.035, mouth: 0.035, forehead: 0.05, head: 0.12, knee: 0.05, forearm: 0.05, upperarm: 0.05, foot: 0.05, hand: 0.045, tummy: 0.08, seat: 0.05 };
        return { x: r.left + a.x * r.width, y: r.top + a.y * r.height, r: (a.r || R[a.q] || 0.06) * r.height };
      },
      /**
       * With the art on, the greybox's marks layer (plasters, bandages, the fever room's worn things) is fitted onto the
       * art: the greybox head and tummy are mapped onto the art's measured head and tummy (a scale and a shift), so
       * what the games draw on the body lands on the picture. Call after layout; returns false without art.
       */
      artFit() {
        const A = fig.art;
        if (!A || A.view !== "front") {
          groups.marks.removeAttribute("transform");
          return false;
        }
        const h1 = body.spot("body-head");
        const t1 = body.spot("body-tummy");
        const ha = fig.artSpot("head");
        const ta = fig.artSpot("tummy");
        if (!h1 || !t1 || !ha || !ta) return false;
        const h2 = toDesign(ha.x, ha.y);
        const t2 = toDesign(ta.x, ta.y);
        const k = Math.abs(t2[1] - h2[1]) / Math.max(1, Math.abs(t1[1] - h1[1]));
        if (!isFinite(k) || k <= 0) return false;
        const dx = h2[0] - h1[0] * k;
        const dy = h2[1] - h1[1] * k;
        groups.marks.setAttribute("transform", `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${k.toFixed(4)})`);
        return true;
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
