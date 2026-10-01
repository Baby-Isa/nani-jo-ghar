/*
 * One feel for every gesture (target-model § 4.3). Every mode's mini-games get their taps, drags, swipes and
 * circles from here, so a tap is the same tap everywhere and a child learns each gesture once.
 *
 * The three guarantees the rulebook asks for:
 *   - LIVE INPUT while speech plays (E5): nothing here ever waits for a voice. Every recognised action calls
 *     onAct(action) first, so the host can let the child go ahead (it cuts the line short; the face replays it).
 *   - TAKE IT BACK UNTIL DONE (E14, E15): createPlacements() records what was put where; undo is one call, and
 *     only the FIRST placement in each slot is scored. After done() nothing moves.
 *   - HIT AREAS OF AT LEAST 48 PX (F2, E23): a target smaller than 48x48 on screen still answers a touch
 *     anywhere in a 48x48 box round its centre; hitAreas() reports every target's drawn box and its hit box
 *     to the test hook (window.njgTest.hitAreas), so the lint can check them.
 *
 * A game declares its gestures once (E13: the same kind of action keeps the same gesture at every level);
 * registering a gesture it didn't declare is refused with a warning.
 *
 *   const I = createInput(el, { gestures: ["tap", "drag"], onAct(a) {} })
 *   I.tap(target, (a) => …, { id })                         a press and release that hardly moved
 *   I.drag(target, { start(a), move(a), drop(a) }, { id })  a press that moves; drop(a) says what it was let go over (a.over)
 *   I.swipe(target, (a) => …, { dir: "right" | "left" | "up" | "down" | null, id })   a quick stroke
 *   I.circle(target, (a) => …, { id })                     round and round (a stir): called once per turn (a.turns)
 *   I.drop(target, { id })                                  a place a drag can be let go over (a.over = its id)
 *   I.off(target)  I.clear()  I.hitAreas()  I.destroy()
 *
 *   const P = createPlacements()
 *   P.place(slot, item) -> { ok, first }   P.takeBack(slot) -> item | null   P.at(slot)   P.firsts()   P.done()
 *
 * Pure (Node-testable): FEEL, classify(points), swipeDir(dx, dy), turnsOf(points, centre), hitBox(rect), pick(targets, x, y).
 * ES module; no globals.
 */

/** The one feel: every threshold, in CSS pixels and milliseconds. */
export const FEEL = Object.freeze({
  minHit: 48, //       F2: the smallest hit area
  tapSlop: 12, //      a press that moves less than this is a tap
  tapMs: 900, //       ... and is let go within this
  dragStart: 10, //    a drag starts once the finger has moved this far
  swipeMin: 48, //     a swipe travels at least this far
  swipeMs: 700, //     ... within this
  swipeAxis: 1.6, //   ... mostly along one axis (main / cross)
  circleTurn: 0.85, // a stir counts a turn every 0.85 of a full circle (a child's circles aren't closed)
});

export const GESTURES = ["tap", "drag", "swipe", "circle"];

/* ---------------- pure ---------------- */

/** "left" | "right" | "up" | "down" for a stroke (screen y grows downwards). */
export function swipeDir(dx, dy) {
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "right" : "left";
  return dy >= 0 ? "down" : "up";
}

/** How many turns a path makes round a centre (signed: + clockwise on screen). */
export function turnsOf(points, centre) {
  if (!points || points.length < 2) return 0;
  const c = centre || {
    x: points.reduce((s, p) => s + p.x, 0) / points.length,
    y: points.reduce((s, p) => s + p.y, 0) / points.length,
  };
  let sum = 0;
  let prev = Math.atan2(points[0].y - c.y, points[0].x - c.x);
  for (let i = 1; i < points.length; i++) {
    const a = Math.atan2(points[i].y - c.y, points[i].x - c.x);
    let d = a - prev;
    if (d > Math.PI) d -= 2 * Math.PI;
    if (d < -Math.PI) d += 2 * Math.PI;
    sum += d;
    prev = a;
  }
  return sum / (2 * Math.PI);
}

/** What a finished stroke was: {kind: "tap" | "swipe" | "drag" | "none", dx, dy, dist, ms, dir?}. */
export function classify(points, feel = FEEL) {
  if (!points || !points.length) return { kind: "none", dx: 0, dy: 0, dist: 0, ms: 0 };
  const a = points[0];
  const b = points[points.length - 1];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const ms = (b.t || 0) - (a.t || 0);
  const far = points.reduce((m, p) => Math.max(m, Math.hypot(p.x - a.x, p.y - a.y)), 0);
  if (far < feel.tapSlop && ms <= feel.tapMs) return { kind: "tap", dx, dy, dist, ms };
  const main = Math.max(Math.abs(dx), Math.abs(dy));
  const cross = Math.min(Math.abs(dx), Math.abs(dy));
  if (dist >= feel.swipeMin && ms <= feel.swipeMs && main >= feel.swipeAxis * cross) return { kind: "swipe", dx, dy, dist, ms, dir: swipeDir(dx, dy) };
  if (far >= feel.dragStart) return { kind: "drag", dx, dy, dist, ms };
  return { kind: "none", dx, dy, dist, ms };
}

/** A drawn box grown to at least min x min round its centre (the hit box). */
export function hitBox(r, min = FEEL.minHit) {
  const w = Math.max(r.width, min);
  const h = Math.max(r.height, min);
  return { x: r.left + r.width / 2 - w / 2, y: r.top + r.height / 2 - h / 2, width: w, height: h };
}

const inside = (b, x, y) => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;

/**
 * Which target a touch at (x, y) is for: one whose drawn box holds the point wins (the last registered on top);
 * else the nearest centre among those whose 48 px hit box holds it. targets: [{rect, ...}].
 */
export function pick(targets, x, y, min = FEEL.minHit) {
  let best = null;
  for (let i = targets.length - 1; i >= 0; i--) {
    const t = targets[i];
    const r = t.rect;
    if (!r || r.width <= 0 || r.height <= 0) continue;
    if (x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height) return t;
  }
  let bestD = Infinity;
  for (let i = targets.length - 1; i >= 0; i--) {
    const t = targets[i];
    const r = t.rect;
    if (!r || r.width <= 0 || r.height <= 0) continue;
    if (!inside(hitBox(r, min), x, y)) continue;
    const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
    if (d < bestD) (bestD = d), (best = t);
  }
  return best;
}

/* ---------------- take it back until Done (E14) ---------------- */

export function createPlacements() {
  const now = new Map();
  const first = new Map();
  const history = [];
  let locked = false;
  return {
    /** Put item in slot. The first placement in a slot is the one that's scored. */
    place(slot, item) {
      if (locked) return { ok: false, first: false };
      const isFirst = !first.has(slot);
      if (isFirst) first.set(slot, item);
      now.set(slot, item);
      history.push({ do: "place", slot, item });
      return { ok: true, first: isFirst };
    },
    /** Take it back (tap to undo). Returns what was there, or null. Never after done(). */
    takeBack(slot) {
      if (locked || !now.has(slot)) return null;
      const item = now.get(slot);
      now.delete(slot);
      history.push({ do: "takeBack", slot, item });
      return item;
    },
    at: (slot) => (now.has(slot) ? now.get(slot) : null),
    current: () => Object.fromEntries(now),
    firsts: () => Object.fromEntries(first),
    history: () => history.slice(),
    done() {
      locked = true;
      return Object.fromEntries(now);
    },
    get locked() {
      return locked;
    },
  };
}

/* ---------------- the DOM side ---------------- */

const pointOf = (e) => ({ x: e.clientX, y: e.clientY, t: e.timeStamp || Date.now() });

/**
 * Listen on one element (the play area) and route every touch to the registered target it is for.
 * opts: { gestures: the game's declared gestures (default all), onAct(action), feel, warn }
 */
export function createInput(root, opts = {}) {
  const feel = Object.assign({}, FEEL, opts.feel);
  const declared = new Set(opts.gestures && opts.gestures.length ? opts.gestures : GESTURES);
  const warn = opts.warn || ((m) => typeof console !== "undefined" && console.warn(m));
  const targets = []; // {el, kind, fn, o, id}
  let seq = 0;
  let live = null; // the touch in progress
  let dead = false;

  const rectOf = (el) => {
    try {
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top, width: r.width, height: r.height };
    } catch (e) {
      return null;
    }
  };
  const shown = (el) => el && el.isConnected !== false && !(el.hidden === true);

  function add(kind, el, fn, o = {}) {
    if (kind !== "drop" && !declared.has(kind)) {
      warn(`input: "${kind}" isn't one of this game's gestures (${[...declared].join(", ")}); E13: declare a game's gestures once`);
      return null;
    }
    const t = { el, kind, fn, o, id: o.id || (el && el.id) || `${kind}-${++seq}` };
    targets.push(t);
    return t;
  }
  const act = (a) => {
    try {
      if (opts.onAct) opts.onAct(a);
    } catch (e) {
      /* the host's bookkeeping never blocks a touch */
    }
  };
  const candidates = (kinds) => targets.filter((t) => kinds.includes(t.kind) && shown(t.el)).map((t) => Object.assign({ rect: rectOf(t.el) }, t));
  const dropAt = (x, y) => {
    const t = pick(candidates(["drop"]), x, y, feel.minHit);
    return t ? t.id : null;
  };

  function down(e) {
    if (dead || (e.button != null && e.button > 0)) return;
    const p = pointOf(e);
    const t = pick(candidates(["tap", "drag", "swipe", "circle"]), p.x, p.y, feel.minHit);
    if (!t) return;
    live = { t, pts: [p], dragging: false, turns: 0, centre: null };
    if (t.kind === "circle") {
      const r = t.rect;
      live.centre = t.o.centre || { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    if (root.setPointerCapture && e.pointerId != null) {
      try {
        root.setPointerCapture(e.pointerId);
      } catch (err) {
        /* not every pointer can be captured */
      }
    }
  }
  function move(e) {
    if (!live || dead) return;
    const p = pointOf(e);
    live.pts.push(p);
    const { t } = live;
    const a0 = live.pts[0];
    if (t.kind === "drag") {
      if (!live.dragging && Math.hypot(p.x - a0.x, p.y - a0.y) >= feel.dragStart) {
        live.dragging = true;
        const a = { kind: "drag", phase: "start", id: t.id, x: a0.x, y: a0.y };
        act(a);
        t.fn.start && t.fn.start(a);
      }
      if (live.dragging && t.fn.move) t.fn.move({ kind: "drag", phase: "move", id: t.id, x: p.x, y: p.y, dx: p.x - a0.x, dy: p.y - a0.y, over: dropAt(p.x, p.y) });
    } else if (t.kind === "circle") {
      const turns = Math.abs(turnsOf(live.pts, live.centre));
      while (turns - live.turns >= feel.circleTurn) {
        live.turns += feel.circleTurn;
        const a = { kind: "circle", id: t.id, turns: Math.round(live.turns / feel.circleTurn), x: p.x, y: p.y };
        act(a);
        t.fn(a);
      }
    }
  }
  function up(e) {
    if (!live || dead) return;
    const p = pointOf(e);
    if (e.type !== "pointercancel") live.pts.push(p);
    const { t, pts } = live;
    live = null;
    if (e.type === "pointercancel") return;
    const c = classify(pts, feel);
    if (t.kind === "tap" && c.kind === "tap") {
      const a = { kind: "tap", id: t.id, x: p.x, y: p.y };
      act(a);
      t.fn(a);
    } else if (t.kind === "swipe" && (c.kind === "swipe" || (c.kind === "drag" && c.dist >= feel.swipeMin))) {
      const dir = swipeDir(c.dx, c.dy);
      if (t.o.dir && t.o.dir !== dir) return;
      const a = { kind: "swipe", id: t.id, dir, dist: c.dist, x: p.x, y: p.y };
      act(a);
      t.fn(a);
    } else if (t.kind === "drag") {
      if (c.kind === "tap" && t.o.tapToo) {
        const a = { kind: "tap", id: t.id, x: p.x, y: p.y };
        act(a);
        if (t.fn.tap) t.fn.tap(a);
        return;
      }
      if (!pts.some((q) => Math.hypot(q.x - pts[0].x, q.y - pts[0].y) >= feel.dragStart)) return;
      const a = { kind: "drag", phase: "drop", id: t.id, x: p.x, y: p.y, dx: p.x - pts[0].x, dy: p.y - pts[0].y, over: dropAt(p.x, p.y) };
      act(a);
      t.fn.drop && t.fn.drop(a);
    }
  }
  const evs = [
    ["pointerdown", down],
    ["pointermove", move],
    ["pointerup", up],
    ["pointercancel", up],
  ];
  evs.forEach(([type, fn]) => root.addEventListener(type, fn));

  return {
    feel,
    gestures: [...declared],
    tap: (el, fn, o) => add("tap", el, fn, o),
    drag: (el, fns, o) => add("drag", el, fns || {}, o),
    swipe: (el, fn, o) => add("swipe", el, fn, o),
    circle: (el, fn, o) => add("circle", el, fn, o),
    drop: (el, o) => add("drop", el, null, o),
    off(el) {
      for (let i = targets.length - 1; i >= 0; i--) if (targets[i].el === el) targets.splice(i, 1);
    },
    clear() {
      targets.length = 0;
      live = null;
    },
    /** Every target on screen: its drawn box, its hit box (at least 48x48) and whether the drawn box is under 48. */
    hitAreas() {
      return targets
        .filter((t) => shown(t.el))
        .map((t) => {
          const r = rectOf(t.el);
          if (!r || r.width <= 0 || r.height <= 0) return null;
          const hb = hitBox(r, feel.minHit);
          return { id: t.id, kind: t.kind, box: { x: r.left, y: r.top, width: r.width, height: r.height }, hit: hb, small: r.width < feel.minHit || r.height < feel.minHit, ok: hb.width >= feel.minHit && hb.height >= feel.minHit };
        })
        .filter(Boolean);
    },
    get count() {
      return targets.length;
    },
    destroy() {
      dead = true;
      evs.forEach(([type, fn]) => root.removeEventListener(type, fn));
      targets.length = 0;
      live = null;
    },
  };
}

export default createInput;
