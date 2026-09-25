/*
 * Dress up mechanic `count` (reused from Cook's count rules: tap N times,
 * the tally is shown but never the target, and nothing ends by itself:
 * Done ends it). Cook's count.js draws in its Phaser kitchen, so the
 * greybox uses this DOM port with the same rules; it goes when the shared
 * mechanics can draw in any renderer.
 *
 *   Dress.Mech.count.tally(r, x, y, n) -> markup for the running tally
 */
(function (global) {
  const Dress = global.Dress;
  const M = (Dress.Mech = Dress.Mech || {});
  M.count = {
    tally(x, y, n) {
      if (!n) return "";
      return `<g class="tally"><circle cx="${x}" cy="${y}" r="26" fill="#fffaf1" stroke="#5b4a3c" stroke-width="3"/><text x="${x}" y="${y + 10}" text-anchor="middle" font-size="30" font-weight="800" fill="#2d2018">${n}</text></g>`;
    },
  };
})(window);
