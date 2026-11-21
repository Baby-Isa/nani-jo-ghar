/*
 * The light: everything dims but one gold-edged box round one thing. It is how an action is shown the first time a
 * player meets it, and how stuck help points. One look everywhere, one light at a time; it never blinks, and it
 * stays until the right move is made. A "hard" light swallows taps outside its box (the cog is above it); a soft one
 * only shows the way.
 *
 *   const light = createLight({ kit, stage })
 *   light.show(box, { hard?, margin?, avoid?, from?, ms? })  box: the thing's own box on the page (its ink: what is seen of it),
 *       or several boxes lit as one (a thing and its word pill), or a function giving either now (so the light follows its thing
 *       to a new place when the screen changes size); avoid: the boxes of the things near it that stay dark, or a function
 *       giving them; the light's own box is litBox's, the one rule
 *   light.hide()      light.showing() -> boolean      light.box() -> the lit rectangle, margin included
 *   light.boxFor(boxes, { margin?, avoid? }) -> the rectangle a light round them would show, shown or not
 *   litBox(box, { margin, least, avoid, clear, overlap }) -> the lit rectangle      every light's box, in the game's space and on a card alike
 */

const union = (rs) => {
  const x = Math.min(...rs.map((r) => r.x));
  const y = Math.min(...rs.map((r) => r.y));
  return { x, y, w: Math.max(...rs.map((r) => r.x + r.w)) - x, h: Math.max(...rs.map((r) => r.y + r.h)) - y };
};
/**
 * The old game's one rule for a light's box (Zafar, 6 Nov: "a general rule that works in all cases that leaves some padding
 * around the object+pill+face icon, or object+pill, or object"; old js/shared/onboard.js:278-331 litBox), with his newer word on
 * its sides (Zafar, 19 Nov: "not evenly highlighted all around - not the same padding"). Carried: what belongs to the thing,
 * given as several boxes, is lit as one; a neighbour that stays dark, on the side it lies (one off a corner, the side with the
 * most room), keeps `clear` px off the light; a neighbour that overlaps the thing a little (under `overlap`: a share of its
 * smaller side, at least so many px) takes the margin down to `least` (below); one that overlaps more cannot be kept out and is let be. His change: where old
 * trimmed one side and then its opposite, here every side shrinks together, so the thing always sits in the middle of an even light.
 * And never under `least` (Zafar, 6 Nov: "much too tight - the highlight box need some padding around the item"): where a
 * neighbour is nearer than that, the light keeps `least` and may reach over the neighbour's edge, which then simply shows lit.
 */
export function litBox(u, { margin, least = 0, avoid = [], clear = 0, overlap }) {
  const edge = Math.max(overlap.min, overlap.share * Math.min(u.w, u.h));
  let m = margin;
  for (const q of avoid) {
    // its room from the thing on the side it lies (negative: it overlaps the thing)
    const room = Math.max(u.x - (q.x + q.w), q.x - (u.x + u.w), u.y - (q.y + q.h), q.y - (u.y + u.h));
    if (room >= 0) m = Math.min(m, room - clear);
    else if (room >= -edge) m = 0;
  }
  m = Math.max(Math.min(least, margin), m);
  return { x: u.x - m, y: u.y - m, w: u.w + 2 * m, h: u.h + 2 * m };
}
const followed = new WeakSet();
let relight = null; // the light showing now, placed again at a new size
let nudge = null; // the light showing now, told that something on the page moved
// a list scrolled, a box sliding open or shut, a card moving: the light follows its thing for a moment (never every frame)
if (typeof document !== "undefined")
  for (const ev of ["scroll", "transitionrun", "transitionend", "animationstart"]) document.addEventListener(ev, () => nudge && nudge(), { capture: true, passive: true });

export function createLight({ kit, stage }) {
  const K = kit.light;
  const el = document.createElement("div");
  el.className = "light";
  el.innerHTML = `<svg width="100%" height="100%"><path class="dim" fill-rule="evenodd"></path><rect class="edge" fill="none"></rect></svg>`;
  document.body.appendChild(el);
  const dim = el.querySelector(".dim");
  const edge = el.querySelector(".edge");
  let lit = null;
  let again = null;
  let marked = "";
  // one follower per page, for whichever light shows now (a frame later: the things it lights are placed again first)
  if (stage && !followed.has(stage)) {
    followed.add(stage);
    stage.onResize(() => requestAnimationFrame(() => relight && relight()));
  }

  /** The dim with one rounded hole, and the gold edge round it. */
  function draw({ x, y, w: w0, h: h0 }) {
    // (a thing caught off the screen mid-resize lights nothing rather than a hole turned inside out)
    const [w, h] = [Math.max(0, w0), Math.max(0, h0)];
    const r = Math.max(0, Math.min(K.radius, w / 2, h / K.cornerOfHeight));
    const hole = `M${x + r},${y} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v-${h - 2 * r} a${r},${r} 0 0 1 ${r},-${r} z`;
    dim.setAttribute("d", `M0,0 H${innerWidth} V${innerHeight} H0 z ${hole}`);
    Object.entries({ x, y, width: w, height: h, rx: r }).forEach(([k, v]) => edge.setAttribute(k, v));
  }
  let moving = 0;
  let until = 0; // the light follows its thing until then
  let tick = null; // one frame of following, for the light showing now
  const follow = (ms) => {
    until = Math.max(until, performance.now() + ms);
    if (!moving && tick) moving = requestAnimationFrame(tick);
  };

  return {
    /**
     * from, ms: the light glides there from the box it lit before (one light, moving, never a blink). A box given as a
     * function is followed for a moment whenever something on the page moves (a list scrolls, Nani's helper slides open),
     * so a thing pushed along stays lit; the light stands still while the round is held (the turn card).
     */
    show(boxOf, { hard = false, margin = null, avoid = null, from = null, ms = 0 } = {}) {
      const first = typeof boxOf === "function" ? boxOf() : boxOf;
      if (!first) return;
      again = typeof boxOf === "function" ? () => this.show(boxOf, { hard, margin, avoid }) : null;
      relight = again;
      nudge = again ? () => follow(K.followMs) : null;
      const aim = (boxes) => {
        const box = Array.isArray(boxes) ? union(boxes) : boxes;
        const to = this.boxFor(boxes, { margin, avoid: typeof avoid === "function" ? avoid() : avoid });
        // (the thing and its light, for the checks: every light even round its thing; written only when they change)
        const mark = [box.x, box.y, box.w, box.h].map((v) => v.toFixed(1)).join(",") + "|" + [to.x, to.y, to.w, to.h].map((v) => v.toFixed(1)).join(",");
        if (mark !== marked) [marked, el.dataset.thing, el.dataset.lit] = [mark, ...mark.split("|")];
        return to;
      };
      cancelAnimationFrame(moving);
      moving = 0;
      const t0 = performance.now();
      let drawn = "";
      tick = (t) => {
        cancelAnimationFrame(moving); // (one frame's follow at a time, however it was asked for)
        moving = 0;
        if (!lit) return;
        if (!(stage && stage.held && stage.held())) {
          const box = typeof boxOf === "function" ? boxOf() : boxOf;
          if (!box) return;
          const to = aim(box);
          const k = from && ms > 0 ? Math.min(1, (t - t0) / ms) : 1;
          const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
          const now = k < 1 ? Object.fromEntries(Object.keys(to).map((p) => [p, from[p] + (to[p] - from[p]) * e])) : to;
          const key = Object.values(now).map((v) => v.toFixed(1)).join();
          if (key !== drawn) draw(now);
          drawn = key;
          lit = to;
        }
        if (t < until) moving = requestAnimationFrame(tick);
      };
      lit = aim(first);
      until = 0;
      follow(Math.max(ms, 0) + (again ? K.followMs : 0));
      tick(t0);
      el.classList.toggle("hard", hard);
      el.classList.add("on");
      document.body.classList.add("lit");
    },
    /**
     * The rectangle a light would show round `boxes` (one or several, lit as one), with `avoid` kept dark, on the page; the
     * one way a light's box is made, shown or not (the checks ask it for every thing that may be lit).
     */
    boxFor(boxes, { margin = null, avoid = null } = {}) {
      const box = Array.isArray(boxes) ? union(boxes) : boxes;
      const side = Math.min(box.w, box.h);
      const m = margin != null ? margin : Math.max(K.marginMin, Math.min(K.marginMax, side * K.marginShare));
      const least = Math.max(K.leastMin, Math.min(K.leastMax, side * K.leastShare));
      const b = litBox(box, { margin: m, least, avoid: avoid || [], clear: K.clear, overlap: K.overlap });
      // (at the screen's edge the light stops at the edge)
      const x = Math.max(K.edgeIn, b.x);
      const y = Math.max(K.edgeIn, b.y);
      return { x, y, w: Math.min(innerWidth - K.edgeIn, b.x + b.w) - x, h: Math.min(innerHeight - K.edgeIn, b.y + b.h) - y };
    },
    hide() {
      cancelAnimationFrame(moving);
      moving = 0;
      if (relight === again) nudge = null;
      if (relight === again) relight = null;
      again = null;
      el.classList.remove("on", "hard");
      document.body.classList.remove("lit");
      lit = null;
    },
    showing: () => !!lit,
    box: () => lit,
  };
}
