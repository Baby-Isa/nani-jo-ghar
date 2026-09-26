/*
 * STUB (Snap-local until the foundation's shared "which one?" attribute-and-
 * decoy module arrives; docs/modes/snap-design.md D3 and s12). Phase 1 uses
 * this local size-class picker with the same rules, deleted at integration:
 *   - the asked noun is in >= 3 sizes in the scene (big, mid, small);
 *   - the asked attribute is balanced: big and small are asked equally;
 *   - the middle size is the decoy and is never asked;
 *   - blind odds: a bot that can see sizes but not hear picks the right size
 *     half the time, so a K2 row alone is <= 1/2 before the hand-in.
 *
 *   WhichOne.sizes          all size classes a noun hangs in
 *   WhichOne.askable        the ones a row may name
 *   WhichOne.order(rng)     the askable sizes in a fair random order
 */
(function (root, factory) {
  const W = factory();
  if (typeof module === "object" && module.exports) module.exports = W;
  else {
    root.Snap = root.Snap || {};
    root.Snap.WhichOneStub = W;
  }
})(typeof self !== "undefined" ? self : this, function () {
  const W = {};
  W.sizes = ["big", "mid", "small"];
  W.askable = ["big", "small"];
  W.decoys = ["mid"];
  W.order = (rng) => rng.shuffle(W.askable);
  W.blindOdds = () => 1 / W.askable.length;
  return W;
});
