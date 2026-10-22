/*
 * The skies and the morning door's scene (Zafar, 19-20 Oct; docs/sprints/S09-a-day-at-nanis.md; DOOR-01).
 *
 * The door (paintDoor): the day's sky is its own full layer (the s09b picture for the weather) behind the cut-out empty house,
 * the house scaled so its roofline sits a third of the way down the play area and covering its width (its sides cropped on
 * squarer screens, its foot running off the bottom); code draws only what moves: the rain falling, the stars twinkling, the
 * clouds drifting. Every look is data (data/days.json `door`); nothing here is text.
 *
 *   const s = paintDoor(el, { look, wkey, weather, url, speed })  -> {stage, figs, geo(), onFit(fn), stop()}
 *       look: data/days.json door; wkey: the weather's key; weather: data/day.json weather[wkey] (its rain)
 *       geo(): {W, H, s, left, top, roof, foot: {x, y}} in the play area's px (foot: the foot of the steps, where Nani stands)
 *   rain(box, def, W, H, speedOf) -> stop()       rain falling on a canvas over box (the door, the weather card)
 *   paintSky(el, weather, { w, h, url })          the sky alone, in a box of its own (the window, the book's tomorrow)
 *   shapes(list, w, h)                            placeholder shapes into an svg (no text)
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

/** Rain drawn in code: drops falling on a canvas over the whole box (W x H logical px, drawn at half size; stopped by the return). */
export function rain(box, def, W, H, speedOf = () => 1) {
  const cv = document.createElement("canvas");
  cv.className = "day-layer day-rain";
  cv.width = Math.round(W / 2);
  cv.height = Math.round(H / 2);
  box.appendChild(cv);
  const ctx = cv.getContext("2d");
  const r = rngOf(3);
  const n = Math.round((def.drops || 120) * ((W * H) / (1600 * 900)) ** 0.5);
  const drops = Array.from({ length: Math.max(12, n) }, () => ({ x: r() * W, y: r() * H, v: 0.7 + r() * 0.6 }));
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
    const len = (def.len || 24) * Math.max(0.5, H / 900);
    const sl = def.slant || 0.15;
    const sp = (def.speed || 900) * Math.max(0.4, H / 900);
    drops.forEach((d) => {
      d.y += (dt * sp * d.v) / 1000;
      d.x -= (dt * sp * d.v * sl) / 1000;
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

/** The house's place for a play area of W x H (pure: build/test_day_runner.mjs checks it): roofline at roofAt, width covered,
 *  the foot of the picture never above the bottom. */
export function houseFit(house, W, H) {
  const roof0 = H * (house.roofAt || 1 / 3);
  // DOOR-06 (Zafar, 22 Oct: "a little closer"): the camera a little closer (zoom, centred on her feet) with the foot of the steps
  // at footAt of the height, so she can be bigger with the sky still above her head; the house still covers the width and reaches
  // the bottom whatever the zoom
  const s = Math.max(W / house.w, (H - roof0) / (house.h - house.roofline)) * (house.zoom || 1);
  const left = W / 2 - house.foot.x * s;
  let top = house.footAt != null ? H * house.footAt - house.foot.y * s : roof0 - house.roofline * s;
  top = Math.max(top, H - house.h * s);
  const roof = top + house.roofline * s;
  return { W, H, s, left, top, roof, foot: { x: left + house.foot.x * s, y: top + house.foot.y * s } };
}

/** The morning door's scene into el (the play area): sky, twinkling stars, house, figures, rain. */
export function paintDoor(el, { look, wkey, weather = {}, url = (p) => p, speed = () => 1 } = {}) {
  const sk = look.skies[wkey] || look.skies.sunny;
  const stage = div("day-stage day-door-stage", el);
  stage.dataset.weather = wkey;
  // the sky: the weather's own picture, a full layer behind everything (the clouds drift where the weather says so)
  const skyL = div("day-layer day-sky", stage);
  const sky = document.createElement("img");
  sky.alt = "";
  sky.className = `day-sky-art${sk.drift ? " day-drift" : ""}`;
  sky.src = url(sk.art);
  sky.draggable = false;
  skyL.appendChild(sky);
  // the stars twinkle (code: small glints over the picture's own stars, in the top of the sky)
  if (sk.twinkle) {
    const tw = div("day-layer day-twinkle", stage);
    const r = rngOf(sk.twinkle.seed || 11);
    for (let i = 0; i < (sk.twinkle.n || 24); i++) {
      const s = document.createElement("i");
      s.style.left = `${(r() * 100).toFixed(1)}%`;
      s.style.top = `${(r() * (sk.twinkle.top || 0.33) * 100).toFixed(1)}%`;
      s.style.animationDelay = `${(r() * 2.4).toFixed(2)}s`;
      s.style.setProperty("--tw", `${(3 + r() * 3).toFixed(1)}px`);
      tw.appendChild(s);
    }
  }
  const houseL = div("day-layer day-house", stage);
  const house = document.createElement("img");
  house.alt = "";
  house.className = "day-house-art";
  house.src = url(look.house.art);
  house.draggable = false;
  if (sk.house) house.style.filter = sk.house;
  houseL.appendChild(house);
  const figs = div("day-layer day-figs", stage);
  if (sk.nani) figs.style.filter = sk.nani;
  const stops = [];
  if (weather.rain) stops.push(rain(stage, weather.rain, 1600, 900, speed));

  let g = null;
  const subs = [];
  const fit = () => {
    const W = stage.clientWidth || el.clientWidth || 1;
    const H = stage.clientHeight || el.clientHeight || 1;
    g = houseFit(look.house, W, H);
    Object.assign(house.style, { left: `${g.left.toFixed(1)}px`, top: `${g.top.toFixed(1)}px`, width: `${(look.house.w * g.s).toFixed(1)}px`, height: `${(look.house.h * g.s).toFixed(1)}px` });
    subs.forEach((f) => f(g));
  };
  fit();
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(fit) : null;
  if (ro) ro.observe(stage);
  else addEventListener("resize", fit);
  return {
    stage,
    figs,
    geo: () => g,
    onFit(fn) {
      subs.push(fn);
      if (g) fn(g);
    },
    stop() {
      stops.forEach((f) => f());
      if (ro) ro.disconnect();
      else removeEventListener("resize", fit);
    },
  };
}
