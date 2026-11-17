/*
 * The light: everything dims but one gold-edged box round one thing. It is how an action is shown the first time a
 * player meets it, and how stuck help points. One look everywhere, one light at a time; it never blinks, and it
 * stays until the right move is made. A "hard" light swallows taps outside its box (the cog is above it); a soft one
 * only shows the way.
 *
 *   const light = createLight({ kit, stage })
 *   light.show(box, { hard? })        box: a rectangle on the page, the thing itself, or a function giving it now (so the
 *                                     light follows its thing to a new place when the screen changes size); the margin is added here
 *   light.hide()      light.showing() -> boolean      light.box() -> the lit rectangle, margin included
 */
const followed = new WeakSet();
let relight = null; // the light showing now, placed again at a new size

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

  return {
    show(boxOf, { hard = false, margin = null } = {}) {
      const box = typeof boxOf === "function" ? boxOf() : boxOf;
      if (!box) return;
      again = typeof boxOf === "function" ? () => this.show(boxOf, { hard, margin }) : null;
      relight = again;
      const m = margin != null ? margin : Math.max(K.marginMin, Math.min(K.marginMax, Math.min(box.w, box.h) * K.marginShare));
      const W = innerWidth;
      const H = innerHeight;
      const x = Math.max(1, box.x - m);
      const y = Math.max(1, box.y - m);
      const w = Math.min(W - 1, box.x + box.w + m) - x;
      const h = Math.min(H - 1, box.y + box.h + m) - y;
      const r = Math.min(K.radius, w / 2, h / K.cornerOfHeight);
      const hole = `M${x + r},${y} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - 2 * r} a${r},${r} 0 0 1 -${r},-${r} v-${h - 2 * r} a${r},${r} 0 0 1 ${r},-${r} z`;
      dim.setAttribute("d", `M0,0 H${W} V${H} H0 z ${hole}`);
      Object.entries({ x, y, width: w, height: h, rx: r }).forEach(([k, v]) => edge.setAttribute(k, v));
      el.classList.toggle("hard", hard);
      el.classList.add("on");
      document.body.classList.add("lit");
      lit = { x, y, w, h };
    },
    hide() {
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
