/*
 * Find it: the scene on screen (layout contract v2). A fixed 1600x900 world
 * of plain HTML, scaled to fit #stage, with the letterbox filled by a
 * blurred copy of the background (never black bars). Drag to pan and the
 * sidebar's +/- buttons to zoom (no pinch); on a short phone the round
 * opens zoomed in (the scene's phoneZoom), because 90 px items are too
 * small for small fingers at full view.
 *
 * Depth, back to front: background, the shopkeeper, the counter front
 * (redrawn from the background so it hides his legs), the warmer dimming,
 * the items (each with a contact shadow), the carried basket (back, items,
 * front rim), anything in flight. Nothing is drawn over the stall in HTML:
 * Nani talks from the sidebar, and Done and the zoom are in the sidebar.
 *
 * A tap snaps to the nearest findable item within a padded radius (design
 * s4.3: about 130 px hit areas); a tap on scenery makes a small reaction
 * and never counts.
 */
(function (global) {
  const Cook = global.Cook;
  const Find = global.Find;
  const $ = (s) => document.querySelector(s);
  const V = (Find.View = {});
  const WW = 1600;
  const WH = 900;
  const HIT_PAD = 22; // world px added round an item's box
  const SNAP = 72; // or within this of its centre

  let st = { zoom: 1, ox: 0, oy: 0, s: 1, fit: 1, scene: null };
  V.state = () => st;
  const el = (tag, cls, parent) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  };
  let world, layers;

  /* ---------------- building a scene ---------------- */
  V.build = function (scene) {
    world = $("#world");
    world.innerHTML = "";
    st.scene = scene;
    layers = {
      bg: el("img", "w-bg", world),
      char: el("div", "w-char", world),
      occ: el("div", "w-occ", world),
      dim: el("div", "w-dim hidden", world),
      items: el("div", "w-items", world),
      basket: el("div", "w-basket", world),
      fly: el("div", "w-fly", world),
      fx: el("div", "w-fx", world),
    };
    layers.bg.src = scene.background;
    layers.bg.alt = "";
    layers.bg.draggable = false;
    $("#letterbox").style.backgroundImage = `url("${scene.background}")`;
    $("#stage").style.background = scene.letterbox || "#e9dcc4";
    // the shopkeeper stands behind the counter
    if (scene.character) {
      const c = scene.character;
      const img = el("img", "w-person", layers.char);
      img.alt = "";
      img.draggable = false;
      img.src = `assets/characters/${c.id}/${c.id}-neutral.png`;
      const w = 344 * (c.scale || 1);
      Object.assign(img.style, { left: `${c.x - w / 2}px`, top: `${c.top}px`, width: `${w}px` });
      V.person = { img, id: c.id, x: c.x, top: c.top, w, h: 700 * (c.scale || 1) };
    }
    // the counter front, redrawn over him from the background
    if (scene.occluder && scene.occluder.fromBackground) {
      const y = scene.occluder.y;
      Object.assign(layers.occ.style, { top: `${y}px`, height: `${WH - y}px`, backgroundImage: `url("${scene.background}")`, backgroundPosition: `0 ${-y}px` });
    }
    // the carried basket: back, items, front rim
    if (scene.basket) {
      const b = scene.basket;
      const h = (262 / 543) * b.w;
      const back = el("img", "wb-back", layers.basket);
      const inside = el("div", "wb-items", layers.basket);
      const front = el("img", "wb-front", layers.basket);
      [back, front].forEach((i) => {
        i.alt = "";
        i.draggable = false;
        Object.assign(i.style, { left: `${b.x - b.w / 2}px`, top: `${b.top}px`, width: `${b.w}px`, height: `${h}px` });
      });
      back.src = b.back;
      front.src = b.front;
      layers.basketItems = inside;
    }
    V.fit();
  };

  /* ---------------- items ---------------- */
  /** Draw a placed item (see Find.place). Returns its element. */
  V.addItem = function (item, { bag = false } = {}) {
    const d = el("div", bag ? "fi-item fi-bag" : "fi-item", bag ? layers.basketItems : layers.items);
    const sh = el("i", "fi-shadow", d);
    const img = el("img", "", d);
    img.alt = "";
    img.draggable = false;
    img.src = Find.picture(item.noun);
    V.size(d, item);
    d.style.zIndex = String(Math.round(item.baseline));
    if (item.tilt) d.style.setProperty("--tilt", `${item.tilt}deg`);
    item.el = d;
    void sh;
    return d;
  };
  V.size = function (d, item) {
    Object.assign(d.style, { left: `${item.x - item.w / 2}px`, top: `${item.baseline - item.h}px`, width: `${item.w}px`, height: `${item.h}px` });
  };
  /** An item's size from its picture's shape, fitted in a square of `size` (design: 90 px minimum). */
  V.measure = function (noun, size) {
    return new Promise((resolve) => {
      const i = new Image();
      i.onload = () => {
        const k = size / Math.max(i.naturalWidth, i.naturalHeight);
        resolve({ w: Math.round(i.naturalWidth * k), h: Math.round(i.naturalHeight * k) });
      };
      i.onerror = () => resolve({ w: size, h: size });
      i.src = Find.picture(noun);
    });
  };
  V.clearItems = function () {
    if (layers) layers.items.innerHTML = "";
  };
  V.clearBasket = function () {
    if (layers && layers.basketItems) layers.basketItems.innerHTML = "";
  };
  /** The i-th place inside the basket (bazaar.json basket.inside), stacking up when it's full. */
  V.basketSpot = function (i) {
    const b = st.scene.basket;
    const ins = b.inside;
    const p = ins[i % ins.length];
    const lift = Math.floor(i / ins.length) * 18;
    return { x: p.x + (Math.floor(i / ins.length) % 2 ? 22 : 0), baseline: p.baseline - lift, w: b.item.maxW, h: b.item.maxH };
  };
  /** An item flies in an arc to (x, baseline) and lands in the basket layer. */
  V.fly = function (item, to, { into = "basket", ms = 520 } = {}) {
    const from = { x: item.x, y: item.baseline - item.h / 2 };
    const d = item.el;
    const land = into === "basket" ? layers.basketItems : into === "gone" ? null : layers.items;
    const flyEl = d.cloneNode(true);
    flyEl.classList.remove("twinkle", "glow", "dimmed");
    flyEl.classList.add("flying");
    layers.fly.appendChild(flyEl);
    d.classList.add("gone");
    const k = Math.min(to.w / item.w, to.h / item.h, 1.1);
    const dx = to.x - item.x;
    const dy = to.baseline - item.baseline;
    const t = Math.max(120, ms / Cook.speed);
    const anim = flyEl.animate(
      [
        { transform: "translate(0,0) scale(1)" },
        { transform: `translate(${dx * 0.5}px, ${Math.min(dy, 0) * 0.5 - 140}px) scale(${(1 + k) / 2})`, offset: 0.45 },
        { transform: `translate(${dx}px, ${dy}px) scale(${k})` },
      ],
      { duration: t, easing: "ease-in-out", fill: "forwards" }
    );
    void from;
    return anim.finished
      .catch(() => {})
      .then(() => {
        flyEl.remove();
        if (!land) return;
        Object.assign(item, { x: to.x, baseline: to.baseline, w: Math.round(item.w * k), h: Math.round(item.h * k) });
        land.appendChild(d);
        d.classList.remove("gone");
        V.size(d, item);
        d.style.zIndex = String(Math.round(item.baseline));
      });
  };
  V.wiggle = function (item) {
    const d = item.el;
    d.classList.remove("wiggle");
    void d.offsetWidth;
    d.classList.add("wiggle");
  };
  V.twinkle = (items, on = true) => items.forEach((i) => i.el && i.el.classList.toggle("twinkle", on));
  V.glow = (items, on = true) => items.forEach((i) => i.el && i.el.classList.toggle("glow", on));
  /** Scenery reacts to a tap (Hidden Folks: everything answers), and it never counts. */
  V.ripple = function (x, y) {
    const r = el("i", "w-ripple", layers.fx);
    Object.assign(r.style, { left: `${x}px`, top: `${y}px` });
    setTimeout(() => r.remove(), 600);
  };
  V.mood = function (mood) {
    if (!V.person) return;
    V.person.img.src = `assets/characters/${V.person.id}/${V.person.id}-${mood}.png`;
  };
  V.bob = function () {
    if (!V.person) return;
    const i = V.person.img;
    i.classList.remove("bob");
    void i.offsetWidth;
    i.classList.add("bob");
  };
  /** Warmer: dim all but a band of the stall (x from a to b). */
  V.dimOutside = function (a, b, items) {
    const d = layers.dim;
    if (a == null) {
      d.classList.add("hidden");
      items.forEach((i) => i.el && i.el.classList.remove("dimmed"));
      return;
    }
    d.classList.remove("hidden");
    d.style.setProperty("--a", `${a}px`);
    d.style.setProperty("--b", `${b}px`);
    items.forEach((i) => i.el && i.el.classList.toggle("dimmed", i.x < a || i.x > b));
  };

  /* ---------------- fit, zoom and pan ---------------- */
  V.fit = function () {
    const r = $("#stage").getBoundingClientRect();
    st.fit = Math.min(r.width / WW, r.height / WH);
    V.apply();
  };
  V.apply = function (focus) {
    const r = $("#stage").getBoundingClientRect();
    const old = st.s;
    st.s = st.fit * st.zoom;
    const w = WW * st.s;
    const h = WH * st.s;
    if (focus && old) {
      // keep the point under focus (screen px in the stage) still while zooming
      const wx = (focus.x - st.ox) / old;
      const wy = (focus.y - st.oy) / old;
      st.ox = focus.x - wx * st.s;
      st.oy = focus.y - wy * st.s;
    }
    st.ox = w <= r.width ? (r.width - w) / 2 : Cook.clamp(st.ox, r.width - w, 0);
    st.oy = h <= r.height ? (r.height - h) / 2 : Cook.clamp(st.oy, r.height - h, 0);
    if (world) world.style.transform = `translate(${st.ox}px, ${st.oy}px) scale(${st.s})`;
  };
  V.zoomTo = function (z) {
    const r = $("#stage").getBoundingClientRect();
    st.zoom = Cook.clamp(z, 1, 2.25);
    V.apply({ x: r.width / 2, y: r.height / 2 });
    $("#btn-zoom-in").disabled = st.zoom >= 2.25;
    $("#btn-zoom-out").disabled = st.zoom <= 1;
  };
  V.panBy = function (dx, dy) {
    st.ox += dx;
    st.oy += dy;
    V.apply();
  };
  /** Pan so a world point is in view (used when the round opens zoomed). */
  V.centreOn = function (x, y) {
    const r = $("#stage").getBoundingClientRect();
    st.ox = r.width / 2 - x * st.s;
    st.oy = r.height / 2 - y * st.s;
    V.apply();
  };
  /** Short phones open zoomed in (the scene's phoneZoom); everything else sees the whole stall. */
  V.openZoom = function () {
    const r = $("#stage").getBoundingClientRect();
    const phone = r.height < 480;
    V.zoomTo(phone ? st.scene.phoneZoom || 1.5 : 1);
    if (phone) V.centreOn(800, 520);
  };
  V.worldToScreen = function (x, y) {
    const r = $("#stage").getBoundingClientRect();
    return { x: r.left + st.ox + x * st.s, y: r.top + st.oy + y * st.s };
  };
  V.screenToWorld = function (cx, cy) {
    const r = $("#stage").getBoundingClientRect();
    return { x: (cx - r.left - st.ox) / st.s, y: (cy - r.top - st.oy) / st.s };
  };
  /** Is this world point on screen (inside the stage, with a margin)? */
  V.inView = function (x, y, m = 20) {
    const r = $("#stage").getBoundingClientRect();
    const p = V.worldToScreen(x, y);
    return p.x >= r.left + m && p.x <= r.right - m && p.y >= r.top + m && p.y <= r.bottom - m;
  };
  // the speech bubble (shared ui.js) places itself with this
  Cook.UI.worldToStage = function (x, y) {
    const r = $("#stage").getBoundingClientRect();
    return { x: st.ox + x * st.s, y: st.oy + y * st.s, s: st.s, stage: r };
  };

  /* ---------------- input: tap (snaps to the nearest item) or drag to pan ---------------- */
  /** The findable item a tap at world (x, y) means, among `items`, or null. */
  V.hit = function (x, y, items) {
    let best = null;
    let bd = Infinity;
    items.forEach((it) => {
      if (!it.el || it.gone || it.off) return;
      const cx = it.x;
      const cy = it.baseline - it.h / 2;
      const inBox = x >= it.x - it.w / 2 - HIT_PAD && x <= it.x + it.w / 2 + HIT_PAD && y >= it.baseline - it.h - HIT_PAD && y <= it.baseline + HIT_PAD;
      const d = Math.hypot(x - cx, y - cy);
      if ((inBox || d <= SNAP) && d < bd) {
        bd = d;
        best = it;
      }
    });
    return best;
  };
  V.anchorAt = function (x, y) {
    const A = st.scene.anchors || {};
    // the smallest anchor rectangle containing the point
    let best = null;
    let area = Infinity;
    Object.entries(A).forEach(([id, a]) => {
      const [x1, y1, x2, y2] = a.rect;
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2 && (x2 - x1) * (y2 - y1) < area) {
        area = (x2 - x1) * (y2 - y1);
        best = id;
      }
    });
    return best;
  };
  let onTap = null;
  V.onTap = (fn) => (onTap = fn);
  V.init = function () {
    const g = $("#game");
    let down = null;
    g.addEventListener("pointerdown", (e) => {
      Cook.unlockAudio();
      down = { id: e.pointerId, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, pan: false };
      try {
        g.setPointerCapture(e.pointerId);
      } catch (err) {}
    });
    g.addEventListener("pointermove", (e) => {
      if (!down || e.pointerId !== down.id) return;
      if (!down.pan && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) down.pan = true;
      if (down.pan) {
        V.panBy(e.clientX - down.lx, e.clientY - down.ly);
        down.lx = e.clientX;
        down.ly = e.clientY;
      }
    });
    const up = (e) => {
      if (!down || e.pointerId !== down.id) return;
      const d = down;
      down = null;
      if (d.pan || e.type === "pointercancel") return;
      const w = V.screenToWorld(e.clientX, e.clientY);
      if (onTap) onTap(w.x, w.y);
    };
    g.addEventListener("pointerup", up);
    g.addEventListener("pointercancel", up);
    $("#btn-zoom-in").addEventListener("click", () => V.zoomTo(st.zoom + 0.5));
    $("#btn-zoom-out").addEventListener("click", () => V.zoomTo(st.zoom - 0.5));
    global.addEventListener("resize", () => setTimeout(V.fit, 50));
  };
})(window);
