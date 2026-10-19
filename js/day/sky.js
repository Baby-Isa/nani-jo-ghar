/*
 * The day's scene: one fixed house and foreground, the sky from the horizon up swapped by the weather (Zafar, 19 Oct;
 * docs/game-design/story-and-arcs.md Part 1). Layers, back to front:
 *   sky (the weather's picture, or its gradient with sun, moon and clouds) · stars (code) · house · ground (foreground) ·
 *   sun-shadows (only when the weather says so: the sunny sky) · figures (Nani; the page's own) · rain (code, falling) · light tint
 * Every look is data (data/day.json `scene`, `weather`): an `art` path draws that picture, else the placeholder `shapes`.
 * Nothing here is text. The scene is laid out in its own 1600x900 pixels and scaled to cover the stage, kept to the bottom
 * (the ground) and the middle (the door), never stretched.
 *
 *   const s = paintScene(el, { scene, weather, url, rng })   -> {box, figs, fit(), stop(), toScreen(x, y)}
 *   paintSky(el, weather, { w, h, url })                    -> the sky alone, in a box of its own (tomorrow's door, the window)
 */
const NS = "http://www.w3.org/2000/svg";
const SVG = (tag, attrs = {}, parent = null) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
};
const div = (cls, parent) => {
  const d = document.createElement("div");
  d.className = cls;
  if (parent) parent.appendChild(d);
  return d;
};
let gradSeq = 0;

/** Placeholder shapes (scene px) into an svg of w x h. */
export function shapes(list, w, h, cls) {
  const s = SVG("svg", { viewBox: `0 0 ${w} ${h}`, width: w, height: h, "aria-hidden": "true", preserveAspectRatio: "none" });
  if (cls) s.setAttribute("class", cls);
  (list || []).forEach((p) => {
    let e = null;
    if (p.t === "rect") e = SVG("rect", { x: p.x, y: p.y, width: p.w, height: p.h, ...(p.r ? { rx: p.r } : {}) }, s);
    else if (p.t === "circle") e = SVG("circle", { cx: p.cx, cy: p.cy, r: p.r }, s);
    else if (p.t === "ellipse") e = SVG("ellipse", { cx: p.cx, cy: p.cy, rx: p.rx, ry: p.ry }, s);
    else if (p.t === "poly") e = SVG("polygon", { points: (p.pts || []).map((q) => q.join(",")).join(" ") }, s);
    if (!e) return;
    e.setAttribute("fill", p.fill || "currentColor");
    if (p.a != null) e.setAttribute("fill-opacity", p.a);
    if (p.id) e.dataset.id = p.id;
  });
  return s;
}

/** A layer: its picture if the data names one, else its shapes. */
function layer(def, w, h, cls, url) {
  const d = div(`day-layer ${cls}`);
  if (def && def.art) {
    const im = document.createElement("img");
    im.alt = "";
    im.src = url(def.art);
    im.draggable = false;
    d.appendChild(im);
  } else if (def && def.shapes) d.appendChild(shapes(def.shapes, w, h));
  return d;
}

/** A cloud of three puffs at (cx, cy), scale s. */
function cloud(svg, c) {
  const g = SVG("g", { fill: c.fill || "#ffffff", "fill-opacity": c.a == null ? 1 : c.a, class: "day-cloud" }, svg);
  const s = c.s || 1;
  [[-70, 10, 48], [0, -12, 62], [72, 8, 50], [-20, 26, 44], [40, 26, 46]].forEach(([dx, dy, r]) => SVG("circle", { cx: c.cx + dx * s, cy: c.cy + dy * s, r: r * s }, g));
}

/** The sky into an svg w x h (the gradient's stops, sun, moon, clouds), or the weather's own picture. */
export function paintSky(el, weather, { w = 1600, h = 900, url = (p) => p, above = false } = {}) {
  const sky = (weather && weather.sky) || {};
  if (sky.art) {
    const im = document.createElement("img");
    im.alt = "";
    im.className = "day-sky-art";
    im.src = url(sky.art);
    el.appendChild(im);
    return im;
  }
  const s = SVG("svg", { viewBox: `0 0 ${w} ${h}`, width: w, height: h, "aria-hidden": "true", preserveAspectRatio: "xMidYMid slice", class: "day-sky-svg" }, el);
  const id = `day-sky-${++gradSeq}`;
  const defs = SVG("defs", {}, s);
  const lg = SVG("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  (sky.stops || [["#9fc7e0", 0], ["#e8eef0", 1]]).forEach(([c, o]) => SVG("stop", { offset: o, "stop-color": c }, lg));
  SVG("rect", { x: 0, y: 0, width: w, height: h, fill: `url(#${id})` }, s);
  // the sky goes on upwards past the picture's top (a scene shrunk to keep its safe area shows it there)
  if (above) {
    const top = (sky.stops && sky.stops[0] && sky.stops[0][0]) || "#9fc7e0";
    SVG("rect", { x: -w, y: -h * 2, width: w * 3, height: h * 2 + 1, fill: top }, s);
    s.style.overflow = "visible";
  }
  const k = w / 1600;
  if (sky.sun) SVG("circle", { cx: sky.sun.cx * k, cy: sky.sun.cy * k, r: sky.sun.r * k, fill: sky.sun.fill, class: "day-sun" }, s);
  if (sky.moon) SVG("circle", { cx: sky.moon.cx * k, cy: sky.moon.cy * k, r: sky.moon.r * k, fill: sky.moon.fill, class: "day-moon" }, s);
  (sky.clouds || []).forEach((c) => cloud(s, { ...c, cx: c.cx * k, cy: c.cy * k, s: (c.s || 1) * k }));
  if (weather && weather.stars) stars(s, weather.stars, w, h * 0.62);
  return s;
}

/** A small seeded rng (the stars stay where they are between visits). */
const rngOf = (seed) => {
  let a = (seed || 1) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
function stars(svg, st, w, h) {
  const r = rngOf(st.seed || 7);
  const g = SVG("g", { fill: st.fill || "#fff8dc", class: "day-stars" }, svg);
  for (let i = 0; i < (st.n || 60); i++) SVG("circle", { cx: (r() * w).toFixed(1), cy: (r() * h).toFixed(1), r: (0.8 + r() * 2.2).toFixed(2), "fill-opacity": (0.5 + r() * 0.5).toFixed(2) }, g);
}

/** Rain drawn in code: drops falling on a canvas over the whole scene (stopped by stop()). */
function rain(box, def, W, H, speedOf) {
  const cv = document.createElement("canvas");
  cv.className = "day-layer day-rain";
  cv.width = W / 2;
  cv.height = H / 2;
  box.appendChild(cv);
  const ctx = cv.getContext("2d");
  const r = rngOf(3);
  const drops = Array.from({ length: def.drops || 120 }, () => ({ x: r() * W, y: r() * H, v: 0.7 + r() * 0.6 }));
  let raf = 0;
  let last = null;
  const draw = (now) => {
    if (last == null) last = now;
    const dt = Math.min(64, now - last) * speedOf();
    last = now;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = def.fill || "#dbe6f0";
    ctx.globalAlpha = def.a == null ? 0.6 : def.a;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const len = def.len || 24;
    const sl = def.slant || 0.15;
    drops.forEach((d) => {
      d.y += (dt * (def.speed || 900) * d.v) / 1000;
      d.x -= (dt * (def.speed || 900) * d.v * sl) / 1000;
      if (d.y > H) {
        d.y -= H + len;
        d.x = r() * W * 1.1;
      }
      if (d.x < -20) d.x += W;
      ctx.moveTo(d.x / 2, d.y / 2);
      ctx.lineTo((d.x + len * sl) / 2, (d.y - len) / 2);
    });
    ctx.stroke();
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

export function paintScene(el, { scene, weather, url = (p) => p, speed = () => 1, layers = {} } = {}) {
  const W = scene.w || 1600;
  const H = scene.h || 900;
  const stage = div("day-stage", el);
  const box = div("day-box", stage);
  box.style.width = `${W}px`;
  box.style.height = `${H}px`;
  const skyL = div("day-layer day-sky", box);
  paintSky(skyL, weather, { w: W, h: H, url, above: true });
  box.appendChild(layer(scene.house, W, H, "day-house", url));
  box.appendChild(layer(scene.foreground, W, H, "day-ground", url));
  // the sun-shadow layer: only the sunny sky shows it (Zafar, 19 Oct)
  if (weather && weather.shadow && scene.shadow) box.appendChild(layer(scene.shadow, W, H, "day-shadow", url));
  const figs = div("day-layer day-figs", box);
  const stops = [];
  if (weather && weather.rain && layers.rain !== false) stops.push(rain(box, weather.rain, W, H, speed));
  // the light: one flat tint of the weather's colour over the whole scene (a relight, never a redraw: ART-04)
  if (weather && weather.tint) {
    const t = div("day-layer day-tint", box);
    t.style.backgroundColor = weather.tint.fill;
    t.style.opacity = String(weather.tint.a || 0);
  }
  // cover the stage, kept to the ground; but never crop the scene's safe area (scene.safe: [x0, y0, x1, y1], what must stay on
  // screen: Nani, the door, the thought bubble): on a 4:3 tablet the picture shrinks to keep it, and the sky (drawn on upwards
  // past the picture's top) fills what is left above
  const safe = scene.safe || [0, 0, W, H];
  const fit = () => {
    const w0 = stage.clientWidth || 1;
    const h0 = stage.clientHeight || 1;
    let s = Math.max(w0 / W, h0 / H);
    if (w0 / s < safe[2] - safe[0]) s = w0 / (safe[2] - safe[0]);
    const cx = (safe[0] + safe[2]) / 2;
    const x = W * s <= w0 ? (w0 - W * s) / 2 : Math.min(0, Math.max(w0 - W * s, w0 / 2 - cx * s));
    box.style.transform = `translate(${x.toFixed(1)}px, ${(h0 - H * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
    fit.s = s;
    fit.x = x;
    fit.y = h0 - H * s;
  };
  fit();
  addEventListener("resize", fit);
  return {
    stage,
    box,
    figs,
    fit,
    /** a scene point -> px in the stage */
    toScreen: (x, y) => ({ x: fit.x + x * fit.s, y: fit.y + y * fit.s, s: fit.s }),
    stop() {
      stops.forEach((f) => f());
      removeEventListener("resize", fit);
    },
  };
}
