// S14 tools, B2: the face boxes of a page, whichever game it is (the games' own read-only test hooks: njgTest.faces(),
// njgTest.cook.faces(), njgTest.clinic.faces(); js/cook/flow.js and js/clinic/main.js), and the geometry the overlap checks use.

/** Every face on the page in page px: [{who, kind: "head" | "circle", left, top, right, bottom, width, height}] ([] without a hook). */
export async function readFaces(page) {
  return page.evaluate(() => {
    const T = window.njgTest;
    const h = T && (T.faces ? T : T.cook && T.cook.faces ? T.cook : T.clinic && T.clinic.faces ? T.clinic : null);
    try { return h ? h.faces() : null; } catch (e) { return null; }
  }).catch(() => null);
}
export const area = (b) => Math.max(0, b.right - b.left) * Math.max(0, b.bottom - b.top);
/** px squared of a over b (each {left, top, right, bottom}). */
export const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
export const boxOf = (r) => (r ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom } : null);
/** [left, top, right, bottom] -> a box */
export const fromArr = (a) => ({ left: a[0], top: a[1], right: a[2], bottom: a[3] });
/** The faces a box sits over: [{face, px}] */
export const onFaces = (box, faces, margin = 0) => (faces || [])
  .map((f) => ({ face: f, px: overlap(box, { left: f.left - margin, top: f.top - margin, right: f.right + margin, bottom: f.bottom + margin }) }))
  .filter((x) => x.px > 0);
