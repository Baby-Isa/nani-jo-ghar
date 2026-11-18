/*
 * The light: everything dims but one gold-edged box round one thing. It is how an action is shown the first time a
 * player meets it, and how stuck help points. One look everywhere, one light at a time; it never blinks, and it
 * stays until the right move is made. A "hard" light swallows taps outside its box (the cog is above it); a soft one
 * only shows the way.
 *
 *   const light = createLight({ kit, stage })
 *   light.show(box, { hard?, from?, ms? })  box: a rectangle on the page, the thing itself, or a function giving it now (so the
 *                                     light follows its thing to a new place when the screen changes size); the margin is added here
 *   light.hide()      light.showing() -> boolean      light.box() -> the lit rectangle, margin included
 */
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
    show(boxOf, { hard = false, margin = null, from = null, ms = 0 } = {}) {
      const first = typeof boxOf === "function" ? boxOf() : boxOf;
      if (!first) return;
      again = typeof boxOf === "function" ? () => this.show(boxOf, { hard, margin }) : null;
      relight = again;
      nudge = again ? () => follow(K.followMs) : null;
      const aim = (box) => {
        const m = margin != null ? margin : Math.max(K.marginMin, Math.min(K.marginMax, Math.min(box.w, box.h) * K.marginShare));
        const x = Math.max(1, box.x - m);
        const y = Math.max(1, box.y - m);
        return { x, y, w: Math.min(innerWidth - 1, box.x + box.w + m) - x, h: Math.min(innerHeight - 1, box.y + box.h + m) - y };
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
