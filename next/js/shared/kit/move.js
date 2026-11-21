/*
 * The kit's one move: how a card on the page goes from one place or size to another in front of the child, so it is never
 * drawn as a cut or a cross-fade where a glide is meant (Zafar, 21 Nov: "it should expand down nicely", "It should smoothly
 * go in"). One time and one easing (kit.move: the order scene's big card flying into its slot, the way he holds up), and
 * three kinds of move:
 *
 *   const mv = createMove(kit, { now?, track? })   now() -> true: every move is at its end at once (a hurried pop-up);
 *                                                   track(animation): the caller may finish it early
 *   mv.fly(el, to, { from?, change? }) -> Promise   el, as it stands, moves and grows or shrinks in one even scale, centre
 *       to centre, onto the rectangle `to` (from: the other way, from `to` to where it stands); a transform only, so the
 *       caller swaps it for what stands there in the same frame; change: a change to its own box made as it flies, its box
 *       gliding to the new size in the same move (Zafar, 21 Nov: the wrong-order card narrowing "as it moves in flight")
 *   mv.reshape(el | els, change, { margins?, alongside? }) -> Promise   a change to each one's own box (its left, top,
 *       width, height: what `change()` does, a card losing a slot or narrowing, its row growing shorter), measured before and
 *       after and glided from the one to the other; what is inside lays out at the new size at once (and stretches with the
 *       box); margins: elements whose margins glide with it the same way (a row's words, their room changing as it is
 *       spaced again); alongside(): a move started once the change is made, run with it (a flight: fly's change)
 *   mv.slide(els, change, box?, { also?, margins? }) -> Promise  a change among `els` (cards in or out): each that stays
 *       slides from where it stood to its new place, together; with `box` (the zoomed card they stand in, itself among els or
 *       not), the box is reshaped, and `also` and `margins` with it (the row inside, so its cards' height glides, and their
 *       words), and each inside it moves in its px by what the box does not already move it
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
    fly(el, to, { from = false, change = null } = {}) {
      // (with a change to its own box: the box glides to its new size as it flies, one move, measured at the new size; a
      // flight with a change only ever goes to `to`)
      if (change && from) throw new Error("move: a flight with a change to its box goes to `to`, never from it");
      if (change) return this.reshape(el, change, { alongside: () => run(el, [{ transform: "none" }, over(el, to)]) });
      const there = over(el, to);
      return run(el, from ? [there, { transform: "none" }] : [{ transform: "none" }, there]);
    },
    async reshape(els, change, { margins = [], alongside = () => null } = {}) {
      const list = [].concat(els);
      // (its outer size, held as border-box: a box with padding would grow by it while it glides)
      const box = (el) => ({ left: el.style.left, top: el.style.top, width: `${el.offsetWidth}px`, height: `${el.offsetHeight}px`, boxSizing: "border-box" });
      const room = (el) => ({ marginTop: getComputedStyle(el).marginTop, marginBottom: getComputedStyle(el).marginBottom });
      const [was, mWas] = [list.map(box), margins.map(room)];
      change();
      const [is, mIs] = [list.map(box), margins.map(room)];
      // (what moves alongside is measured first, at the new size, before any glide holds a box at its old one)
      const along = alongside();
      // (the glide holds each box and margin only while it runs: at its end each is its own again, at the new size)
      await Promise.all([...list.map((el, i) => run(el, [was[i], is[i]], "none")), ...margins.map((el, i) => run(el, [mWas[i], mIs[i]], "none")), along]);
    },
    async slide(els, change, box = null, { also = [], margins = [] } = {}) {
      const before = new Map(els.map((el) => [el, rectOf(el)]));
      const was = box ? rectOf(box) : null;
      const shaped = box ? this.reshape([box, ...also], change, { margins }) : (change(), null);
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
