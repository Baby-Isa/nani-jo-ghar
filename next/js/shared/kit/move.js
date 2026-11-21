/*
 * The kit's one move: how a card on the page goes from one place or size to another in front of the child, so it is never
 * drawn as a cut or a cross-fade where a glide is meant (Zafar, 21 Nov: "it should expand down nicely", "It should smoothly
 * go in"). One time and one easing (kit.move: the order scene's big card flying into its slot, the way he holds up), and
 * three kinds of move:
 *
 *   const mv = createMove(kit, { now?, track? })   now() -> true: every move is at its end at once (a hurried pop-up);
 *                                                   track(animation): the caller may finish it early
 *   mv.fly(el, to, { from? }) -> Promise   el, as it stands, moves and grows or shrinks in one even scale, centre to centre,
 *       onto the rectangle `to` (from: the other way, from `to` to where it stands); a transform only, so the caller swaps
 *       it for what stands there in the same frame
 *   mv.reshape(el, change) -> Promise      a change to el's own box (its left, top, width, height: what `change()` does to
 *       it, a card losing a slot or narrowing), measured before and after and glided from the one to the other; what is
 *       inside lays out at the new size at once
 *   mv.slide(els, change, box?) -> Promise  a change among `els` (cards in or out): each that stays slides from where it
 *       stood to its new place, together; with `box` (the zoomed card they stand in, itself among els or not), the box is
 *       reshaped and each inside it moves in its px by what the box does not already move it
 *   mv.over(el, to) -> the frame that puts el over the rectangle `to`, in its own zoomed px
 *   mv.ms, mv.ease
 */
/** The zoom an element is drawn at: its own and every box's it stands in (a mark inside the zoomed wrong-order card moves in its px). */
export const zoomOf = (el) => {
  let z = 1;
  for (let at = el; at && at.nodeType === 1; at = at.parentElement) z *= parseFloat(getComputedStyle(at).zoom) || 1;
  return z;
};
const rectOf = (el) => el.getBoundingClientRect();

/** The frame that puts `el` (as it stands, with no move on it) over the rectangle `to`, in its own zoomed px. */
export function over(el, to) {
  const from = el.getBoundingClientRect();
  const z = zoomOf(el);
  if (!to.width || !from.width) return { opacity: 0 };
  const k = Math.min(to.width / from.width, to.height / from.height);
  const dx = (to.left + to.width / 2 - (from.left + from.width / 2)) / z;
  const dy = (to.top + to.height / 2 - (from.top + from.height / 2)) / z;
  return { transform: `translate(${dx}px, ${dy}px) scale(${k})` };
}

export function createMove(kit, { now = () => false, track = () => {} } = {}) {
  const M = kit.move;
  const run = (el, frames, fill = "both") => {
    const a = el.animate(frames, { duration: now() ? 0 : M.ms, easing: M.ease, fill });
    track(a);
    return a.finished.catch(() => {});
  };
  return {
    ms: M.ms,
    ease: M.ease,
    over,
    fly(el, to, { from = false } = {}) {
      const there = over(el, to);
      return run(el, from ? [there, { transform: "none" }] : [{ transform: "none" }, there]);
    },
    async reshape(el, change) {
      const was = { left: el.style.left, top: el.style.top, width: `${el.offsetWidth}px`, height: `${el.offsetHeight}px` };
      change();
      const is = { left: el.style.left, top: el.style.top, width: `${el.offsetWidth}px`, height: `${el.offsetHeight}px` };
      // (the glide holds the box only while it runs: at its end the box is its own again, at the new size)
      await run(el, [was, is], "none");
    },
    async slide(els, change, box = null) {
      const before = new Map(els.map((el) => [el, rectOf(el)]));
      const was = box ? rectOf(box) : null;
      const shaped = box ? this.reshape(box, change) : (change(), null);
      const carried = box ? [was.left - rectOf(box).left, was.top - rectOf(box).top] : [0, 0];
      const slides = els
        .filter((el) => el.isConnected && el !== box)
        .map((el) => {
          const [a, b, z] = [before.get(el), rectOf(el), zoomOf(box || el)];
          const [dx, dy] = [(a.left - b.left - (box ? carried[0] : 0)) / z, (a.top - b.top - (box ? carried[1] : 0)) / z];
          return Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 ? null : run(el, [{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }]);
        });
      await Promise.all([shaped, ...slides]);
    },
  };
}
