/*
 * STUB (Snap-local until the foundation's "star sets and ear/voice rules as
 * data" arrive: docs/modes/snap-design.md s12, shared pieces). Same shape as
 * the planned shared API, so the swap is one line in js/snap/adapters.js.
 *
 *   Stars.ear(rows, { minTested })   rows: [{ stage, firstRight, shown, excluded }]
 *       -> { offered, earned }  offered only with >= minTested rows at word stage 2+
 *          (stage-1 rows are taught, not tested; rows Ali spoilt are excluded)
 *   Stars.voice(said, { minSaid })   said: [{ heard, target, parent }]
 *       -> { offered, earned }  every said row recognised (heard === target) or
 *          ticked by a grown-up; a pill tap is not saying, so it never counts
 *   Stars.lens(ratings)              ratings: [{ ok }] for every print handed in
 *
 * In the browser it also adds the lens-iris icon to Cook's icon table (the
 * shared star sets will carry it); nothing in js/cook is edited.
 */
(function (root, factory) {
  const Stars = factory();
  if (typeof module === "object" && module.exports) module.exports = Stars;
  else {
    root.Snap = root.Snap || {};
    root.Snap.StarsStub = Stars;
    const UI = root.Cook && root.Cook.UI;
    if (UI && UI.ICON && !UI.ICON.lens) UI.ICON.lens = Stars.LENS_SVG;
  }
})(typeof self !== "undefined" ? self : this, function () {
  const Stars = {};
  Stars.LENS_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 3.5 14 10M20.5 12 14 14M12 20.5 10 14M3.5 12 10 10M6 6l5.2 4.4M18 6l-4.4 5.2M18 18l-5.2-4.4M6 18l4.4-5.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

  Stars.ear = function (rows, { minTested = 2 } = {}) {
    const tested = rows.filter((r) => r.stage >= 2 && !r.excluded);
    const offered = tested.length >= minTested;
    return { offered, earned: offered && tested.every((r) => r.firstRight && !r.shown), tested: tested.length };
  };
  Stars.voice = function (said, { minSaid = 2 } = {}) {
    const offered = said.length >= minSaid;
    return { offered, earned: offered && said.every((s) => s.parent || (s.heard && s.heard === s.target)) };
  };
  Stars.lens = (ratings) => ratings.length > 0 && ratings.every((r) => r.ok);
  return Stars;
});
