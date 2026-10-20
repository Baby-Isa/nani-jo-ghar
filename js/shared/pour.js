/*
 * The shared pour and fill (SH-117, 19 Oct; DAAR-28 and CLN-197 merged into it): one way, in every game, that a
 * vessel pours into another, taken from Cook's chai pour (js/cook/mechanics/pour.js measure(): the jug slides in over
 * the target, tips, a tapered stream with a light core falls in a curve onto the surface with a small splash, the
 * level rises while it runs, then it tips back and goes). Zafar, 17 Oct: "a better animation for the daal pouring into
 * the pot ... like the chai one, but remember we're redoing the tea one"; 18 Oct (taste): "the filling animations ...
 * take from the cook game ... the chai game".
 *
 * The choreography and the stream's shape are plain numbers (Node tests them); two drawers put them on screen:
 *   NjgPour.phaser(S, o)  a Phaser scene: Cook's daal (js/cook/stations/daar.js); chai's redo (CHAI-26) can adopt it:
 *                         o.frames (one texture per tilt step, Zafar's "four or five orientations of 20 degrees")
 *   NjgPour.svg(layer, o) an SVG layer: the clinic's taste glass (js/clinic/heal/games/taste.js)
 * Both resolve when the vessel has gone (or is back), after o.onFill(u) has been called with the level, 0 -> 1.
 *
 *   NjgPour.plan(o) -> {total, at(ms) -> {phase, x, y, angle, flow, fill, step, alpha}}
 *        o.from {x, y} where the vessel starts; o.to {x, y} where it holds while pouring (NjgPour.holdAt finds it from
 *        where the lip should be); o.tilt degrees at full tip (negative: the lip on its left goes down); o.steps: tip in
 *        that many equal steps (the tilt pictures), else smoothly; o.ms {lift, tip, pour, untip, back}; o.arc the lift's
 *        rise; o.away {x, y} where it goes after (default: back to from); o.fade: it fades as it goes
 *   NjgPour.holdAt(lipAt, lip, tilt) -> {x, y}  the vessel's centre that puts its lip (an offset from its centre,
 *        turned with it) at lipAt when tipped by tilt
 *   NjgPour.lipAt(frame, lip) -> {x, y}  the lip on screen in a frame
 *   NjgPour.stream(sp, p, w, t) -> {poly, core, splash, pool}  the stream from the lip sp to the surface p, w wide at
 *        the lip, t seconds into the pour (its ripple); poly the outline, core the light line down its middle
 *
 * An ES module (Cook's files import it); it also hangs on globalThis.NjgPour, and the clinic's heal scene
 * (js/clinic/heal/scene.js HS.pourKit) imports it when a game first pours.
 */
const deg = Math.PI / 180;
const clamp01 = (u) => (u < 0 ? 0 : u > 1 ? 1 : u);
const E = {
  inOut: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  out: (u) => 1 - Math.pow(1 - u, 3),
  in: (u) => u * u * u,
  sine: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
};
const MS = { lift: 380, tip: 260, pour: 1100, untip: 220, back: 320 };

/** Turn the offset (dx, dy) by `angle` degrees. */
function turn(dx, dy, angle) {
  const a = angle * deg;
  return { x: dx * Math.cos(a) - dy * Math.sin(a), y: dx * Math.sin(a) + dy * Math.cos(a) };
}

function plan(o) {
  const ms = Object.assign({}, MS, o.ms || {});
  const from = o.from;
  const to = o.to;
  const away = o.away || from;
  const tilt = o.tilt == null ? -52 : o.tilt;
  const steps = o.steps | 0;
  const arc = o.arc == null ? 40 : o.arc;
  const t1 = ms.lift;
  const t2 = t1 + ms.tip;
  const t3 = t2 + ms.pour;
  const t4 = t3 + ms.untip;
  const total = t4 + ms.back;
  // the angle as drawn: smooth, or the nearest of the tilt pictures' steps (0, tilt/n, ..., tilt)
  const shown = (a) => {
    if (!steps) return { angle: a, step: 0 };
    const k = Math.round((a / tilt) * steps);
    const s = Math.max(0, Math.min(steps, k));
    return { angle: (s / steps) * tilt, step: s };
  };
  function at(t) {
    let x = to.x;
    let y = to.y;
    let a = tilt;
    let flow = 0;
    let fill = 0;
    let alpha = 1;
    let phase;
    if (t < t1) {
      phase = "lift";
      const u = clamp01(t / ms.lift);
      const e = E.inOut(u);
      x = from.x + (to.x - from.x) * e;
      y = from.y + (to.y - from.y) * e - arc * Math.sin(Math.PI * u);
      a = tilt * 0.2 * E.out(u);
    } else if (t < t2) {
      phase = "tip";
      const u = clamp01((t - t1) / ms.tip);
      a = tilt * (0.2 + 0.8 * E.out(u));
      // the stream starts once the lip is low enough: the last 40% of the tip
      flow = clamp01((u - 0.6) / 0.4);
    } else if (t < t3) {
      phase = "pour";
      const u = clamp01((t - t2) / ms.pour);
      // it tips a little further as it empties (the chai pan's "turning towards the player")
      a = tilt * (1 + 0.15 * E.sine(u));
      flow = 1;
      fill = E.sine(u);
    } else if (t < t4) {
      phase = "untip";
      const u = clamp01((t - t3) / ms.untip);
      a = tilt * 1.15 * (1 - E.out(u));
      flow = clamp01(1 - u / 0.35);
      fill = 1;
    } else {
      phase = t < total ? "back" : "done";
      const u = clamp01((t - t4) / ms.back);
      const e = E.in(u);
      x = to.x + (away.x - to.x) * e;
      y = to.y + (away.y - to.y) * e;
      a = 0;
      fill = 1;
      if (o.fade) alpha = 1 - u;
    }
    const s = shown(a);
    return { phase, x, y, angle: s.angle, step: s.step, flow, fill, alpha, t };
  }
  return { total, at, ms, marks: { lift: t1, tip: t2, pour: t3, untip: t4 } };
}

/** The vessel's centre that puts its lip (offset from the centre, turned with it) at lipAt when tipped by `tilt`. */
function holdAt(lipAt, lip, tilt) {
  const d = turn(lip[0], lip[1], tilt);
  return { x: lipAt.x - d.x, y: lipAt.y - d.y };
}
function lipAt(f, lip) {
  const d = turn(lip[0], lip[1], f.angle);
  return { x: f.x + d.x, y: f.y + d.y };
}

/**
 * The stream (Cook's chai stream, 28 Sept s8): from the lip it falls in a curve onto the surface, tapering, with a slight
 * ripple; a soft splash ripple (its own colour, no white ring: SH-117) and a pool where it lands. Points in the caller's units.
 */
function stream(sp, p, w, t = 0) {
  const midX = (sp.x + p.x) / 2 - (p.x - sp.x) * 0.15;
  const midY = sp.y + (p.y - sp.y) * 0.35;
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const u = i / 12;
    const x = (1 - u) * (1 - u) * sp.x + 2 * (1 - u) * u * midX + u * u * p.x;
    const y = (1 - u) * (1 - u) * sp.y + 2 * (1 - u) * u * midY + u * u * p.y;
    pts.push({ x, y, w: w * (1 - 0.45 * u) * (1 + 0.08 * Math.sin(t * 30 + u * 9)) });
  }
  const side = (k) =>
    pts.map((q, i) => {
      const n = pts[Math.min(i + 1, pts.length - 1)];
      const m = pts[Math.max(i - 1, 0)];
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const l = Math.hypot(dx, dy) || 1;
      return { x: q.x + (-dy / l) * (q.w / 2) * k, y: q.y + (dx / l) * (q.w / 2) * k };
    });
  const r = w * (1.4 + 0.3 * Math.sin(t * 20));
  return {
    poly: side(1).concat(side(-1).reverse()),
    core: side(0.3),
    splash: { x: p.x, y: p.y, rx: r * 1.1, ry: r * 0.45 },
    pool: { x: p.x, y: p.y, rx: w * 0.65, ry: w * 0.25 },
  };
}

/** Play a plan: counter(ms, onUpdate(u)) -> Promise runs the clock (the scene's own, so test speeds apply). */
function play(o, draw, counter) {
  const p = plan(o);
  return Promise.resolve(counter(p.total, (u) => draw(p.at(u * p.total), p))).then(() => draw(p.at(p.total), p));
}

/* ---------------- Phaser: a picture in a scene pours ---------------- */
/**
 * NjgPour.phaser(S, o): o.obj the vessel's picture (it moves and tips; its origin is the pivot), o.lip [dx, dy] its lip
 * from the pivot in screen px at angle 0, o.to (or o.lipTo: where the lip goes), o.tilt, o.colour (0xRRGGBB), o.width
 * the stream's width at the lip, o.surface(fill) -> {x, y} where the stream lands, o.depth the stream's depth (default
 * just under the vessel), o.frames (tilt pictures, one per step: o.steps = frames.length - 1), o.squash (how much
 * the picture narrows along its lip's axis at full tip, a top-down vessel tipping: 0.14), o.onFill(u), o.onPhase(phase),
 * o.ms, o.arc, o.away, o.fade, o.fillDisc(fill) -> {x, y, rx, ry} the liquid's pool growing in the target (o.fillDepth).
 * Returns a Promise.
 */
function phaser(S, o) {
  const obj = o.obj;
  const g = S.add.graphics().setDepth(o.depth != null ? o.depth : obj.depth - 0.01);
  if (S.track) S.track(g);
  // SH-117 (s08 w6G; the judge: "no daal stream, no ripple, no yellow fill arriving"): o.fillDisc(fill) -> {x, y, rx, ry}, the
  // liquid's own pool in the target, growing from where the stream lands as the level rises (its own layer, o.fillDepth:
  // under the target's rim, over what was in it), so the fill is seen arriving, not a picture swapped in
  const gf = o.fillDisc ? S.add.graphics().setDepth(o.fillDepth != null ? o.fillDepth : g.depth - 0.02) : null;
  if (gf && S.track) S.track(gf);
  const sx = obj.scaleX;
  const sy = obj.scaleY;
  const from = { x: obj.x, y: obj.y };
  const steps = o.frames && o.frames.length > 1 ? o.frames.length - 1 : o.steps;
  const to = o.to || holdAt(o.lipTo, o.lip, o.tilt);
  const spec = Object.assign({}, o, { from, to, steps });
  let phase = null;
  const draw = (f) => {
    if (!obj.active) return;
    obj.setPosition(f.x, f.y).setAngle(f.angle).setAlpha(f.alpha);
    if (o.frames && o.frames[f.step] && obj.texture.key !== o.frames[f.step]) obj.setTexture(o.frames[f.step]);
    // a top-down vessel tipping its lip down: it narrows along the lip's axis (its own x), the lip with it
    const k = o.squash ? 1 - o.squash * Math.min(1, Math.abs(f.angle / (o.tilt || 1))) : 1;
    if (o.squash) obj.setScale(sx * k, sy);
    if (f.phase !== phase) {
      phase = f.phase;
      if (o.onPhase) o.onPhase(phase);
    }
    if (o.onFill) o.onFill(f.fill);
    g.clear();
    if (gf) {
      gf.clear();
      const d = f.fill > 0.001 ? o.fillDisc(f.fill) : null;
      if (d) {
        gf.fillStyle(o.colour, 0.97);
        gf.fillEllipse(d.x, d.y, d.rx * 2, d.ry * 2);
      }
    }
    if (f.flow <= 0.01 || !o.surface) return;
    const sp = lipAt(f, [o.lip[0] * k, o.lip[1]]);
    const p = o.surface(f.fill);
    const s = stream(sp, p, (o.width || 12) * (0.35 + 0.65 * f.flow), f.t / 1000);
    g.fillStyle(o.colour, 0.9);
    g.fillPoints(s.poly, true);
    g.lineStyle(Math.max(1, (o.width || 12) * 0.18), 0xffffff, 0.35);
    g.strokePoints(s.core, false);
    // SH-117 (s08 w4A): the splash is a soft ripple of the liquid's own colour, never a white ring (a drawn line on the daal)
    g.fillStyle(o.colour, 0.22 * f.flow);
    g.fillEllipse(s.splash.x, s.splash.y, s.splash.rx * 2, s.splash.ry * 2);
    g.fillStyle(o.colour, 0.9);
    g.fillEllipse(s.pool.x, s.pool.y, s.pool.rx * 2, s.pool.ry * 2);
  };
  const counter = (ms, fn) => new Promise((r) => S.tweens.addCounter({ from: 0, to: 1, duration: ms, onUpdate: (tw) => fn(tw.getValue()), onComplete: r }));
  return play(spec, draw, counter).then(() => {
    g.destroy();
    if (gf) gf.destroy();
    if (o.squash && obj.active) obj.setScale(sx, sy);
  });
}

/* ---------------- SVG: an image on an SVG layer pours ---------------- */
/**
 * NjgPour.svg(layer, o): o.href the vessel's picture, o.size {w, h} (drawn centred on its pivot), o.from, o.to (or
 * o.lipTo), o.lip [dx, dy] from the centre at angle 0, o.tilt, o.colour (CSS), o.opacity, o.width, o.surface(fill),
 * o.onFill(u), o.counter(ms, fn(u)) -> Promise (the game's own clock), o.ms, o.arc, o.away, o.fade.
 * Draws on `layer` (the stream under the vessel) and takes it all away at the end. Returns a Promise.
 */
function svg(layer, o) {
  const NS = "http://www.w3.org/2000/svg";
  const doc = layer.ownerDocument;
  const el = (tag, attrs, parent) => {
    const n = doc.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    parent.appendChild(n);
    return n;
  };
  const root = el("g", { class: "njg-pour" }, layer);
  const sg = el("g", { opacity: 0 }, root);
  const body = el("path", { fill: o.colour, opacity: o.opacity == null ? 0.92 : o.opacity }, sg);
  const core = el("polyline", { fill: "none", stroke: "#fff", "stroke-opacity": 0.35, "stroke-linecap": "round", "stroke-width": Math.max(1, (o.width || 9) * 0.18) }, sg);
  // SH-117 (s08 w4A): the splash a soft ripple of the liquid's own colour, no white ring
  const ring = el("ellipse", { fill: o.colour, "fill-opacity": 0.22, stroke: "none" }, sg);
  const pool = el("ellipse", { fill: o.colour, opacity: o.opacity == null ? 0.92 : o.opacity }, sg);
  const vg = el("g", {}, root);
  el("image", { href: o.href, x: -o.size.w / 2, y: -o.size.h / 2, width: o.size.w, height: o.size.h }, vg);
  const to = o.to || holdAt(o.lipTo, o.lip, o.tilt);
  const spec = Object.assign({}, o, { to });
  const f2 = (n) => n.toFixed(1);
  const draw = (f) => {
    vg.setAttribute("transform", `translate(${f2(f.x)} ${f2(f.y)}) rotate(${f2(f.angle)})`);
    vg.setAttribute("opacity", f.alpha);
    if (o.onFill) o.onFill(f.fill);
    if (f.flow <= 0.01 || !o.surface) return sg.setAttribute("opacity", 0);
    const s = stream(lipAt(f, o.lip), o.surface(f.fill), (o.width || 9) * (0.35 + 0.65 * f.flow), f.t / 1000);
    sg.setAttribute("opacity", 1);
    body.setAttribute("d", `M${s.poly.map((q) => `${f2(q.x)} ${f2(q.y)}`).join("L")}Z`);
    core.setAttribute("points", s.core.map((q) => `${f2(q.x)},${f2(q.y)}`).join(" "));
    [["cx", s.splash.x], ["cy", s.splash.y], ["rx", s.splash.rx], ["ry", s.splash.ry]].forEach(([k, v]) => ring.setAttribute(k, f2(v)));
    [["cx", s.pool.x], ["cy", s.pool.y], ["rx", s.pool.rx], ["ry", s.pool.ry]].forEach(([k, v]) => pool.setAttribute(k, f2(v)));
  };
  return play(spec, draw, o.counter).then(() => root.remove());
}

export const NjgPour = { plan, holdAt, lipAt, stream, play, phaser, svg, turn, MS };
if (typeof globalThis !== "undefined") globalThis.NjgPour = NjgPour;
export default NjgPour;
