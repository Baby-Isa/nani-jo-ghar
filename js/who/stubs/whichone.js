/*
 * STUB (Who did it?): the shared "which one?" attribute-and-decoy module.
 *
 * The foundation session owns the real one (js/shared/, the deep dive's
 * `whichone`, shared with Find it M3, Dress up D1, Snap M4 and Tidy up).
 * Until it lands, js/who/case.js calls this local copy with the same
 * signature; swapping is one line in case.js (the require/global below).
 *
 *   balance(suspects, dims) -> { counts, distinct[], median }
 *     counts["dim.value"]: how many suspects carry that value;
 *     distinct[i]: how many of suspect i's values are unique in the line-up
 *     (its "distinctiveness": the odd-one-out leak); median of distinct.
 *   blindOdds(case) -> the chance a blind random tapper earns the ear star
 *     (K1: (1/n)^items; K2: product over clues of 1/2^standing; K3: 1/2^q).
 *
 * A suspect is { attrs: { dim: value } }. Pure; no DOM.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.Who = root.Who || {};
    root.Who.whichone = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function balance(suspects, dims) {
    const counts = {};
    for (const s of suspects)
      for (const d of dims) {
        const v = s.attrs[d];
        if (v == null) continue;
        counts[`${d}.${v}`] = (counts[`${d}.${v}`] || 0) + 1;
      }
    const distinct = suspects.map((s) => dims.filter((d) => s.attrs[d] != null && counts[`${d}.${s.attrs[d]}`] === 1).length);
    const sorted = distinct.slice().sort((a, b) => a - b);
    const m = sorted.length;
    const median = m % 2 ? sorted[(m - 1) / 2] : (sorted[m / 2 - 1] + sorted[m / 2]) / 2;
    return { counts, distinct, median };
  }

  function blindOdds(c) {
    if (c.kind === "K1") return Math.pow(1 / c.suspects.length, c.items.length);
    if (c.kind === "K3") return Math.pow(0.5, c.questions.length);
    if (c.kind === "K2") {
      let p = 1;
      let standing = c.suspects.map((_, i) => i);
      for (const cl of c.clues) {
        p *= 1 / Math.pow(2, standing.length);
        standing = standing.filter((i) => c.suspects[i].attrs[cl.dim] === cl.value);
      }
      return p;
    }
    return null;
  }

  return { balance, blindOdds, stub: true };
});
