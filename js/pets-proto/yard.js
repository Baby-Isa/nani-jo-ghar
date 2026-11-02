/*
 * The pet hotel's yard (proto-pets, 2 Nov 2026): one camera, eye level, outdoors (the dog is kept outdoors: the family's ways), the
 * farm's sky, hills and fields behind a long wooden care counter. Both games draw on it. The animals stand on mats on the counter.
 *   yard(F) -> {mats: [x...], animal(kind, spec, x)}
 */
import { SCENERY } from "./art.js";

const W = typeof window !== "undefined" ? window : globalThis;
const stamp = (p) => (typeof W.njgV === "function" ? W.njgV(p) : p);

/** The yard behind the counter, and the counter. */
export function yard(F) {
  F.scene.insertAdjacentHTML(
    "beforeend",
    `<img class="pt-sky" src="${stamp(SCENERY.sky)}" alt=""><img class="pt-hills" src="${stamp(SCENERY.hills)}" alt=""><img class="pt-fields" src="${stamp(SCENERY.fields)}" alt="">`
  );
  F.put("pt-tree", { x: 0.06, y: 0.56, h: 0.5, img: SCENERY.tree });
  F.put("pt-tree", { x: 0.95, y: 0.56, h: 0.36, img: SCENERY.bush });
  F.scene.insertAdjacentHTML("beforeend", '<div class="pt-counter"></div><div class="pt-counter-edge"></div>');
}

/** Where n mats stand along the counter (shares of the play area's width). */
export const matXs = (n) => ({ 1: [0.5], 2: [0.3, 0.7], 3: [0.18, 0.5, 0.82], 4: [0.14, 0.38, 0.62, 0.86], 5: [0.12, 0.31, 0.5, 0.69, 0.88], 6: [0.1, 0.26, 0.42, 0.58, 0.74, 0.9], 7: [0.08, 0.22, 0.36, 0.5, 0.64, 0.78, 0.92] })[n];

/** An animal on its mat: a button, its picture, its kind on the dataset. y: its foot. */
export function animal(F, kind, spec, x, { y = 0.72, h = null, mat = true } = {}) {
  if (mat) F.put("pt-mat", { x, y: y + 0.03, h: 0.07, w: Math.max(0.1, (h || spec.h) * 0.62) });
  const el = F.put(`pt-animal pt-${spec.base || kind}`, { x, y, h: h || spec.h, img: spec.img, tag: "button" });
  el.setAttribute("aria-label", kind);
  el.dataset.k = kind;
  return el;
}
