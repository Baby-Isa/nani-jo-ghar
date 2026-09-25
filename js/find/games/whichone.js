/*
 * Find it, F2: Which one? (docs/find-it-design.md D2, D5; brief 8.3 task 2).
 *
 * R1 with a size on every row: wadho santra, nindho kelo (the family's
 * spelling; the draft form ships before C22-C36 confirms agreement, D9.3).
 * Every thing on the stall except the clutter is out in both sizes, the
 * same picture at two scales (data/find.json sizes); the asked thing is in
 * both sizes, each size is on two or more things, and the sizes are
 * balanced (the shared decoy rule, WhichOne.checkDecoys, in js/find/gen.js),
 * so neither "always the big one" nor the odd size out wins. A wrong size
 * is a mistake like any other: wiggle, and Nani recasts "nindho santra"
 * (what you tapped) then the row. Then the bag.
 *
 * Settings: data/find.json mechanics.whichone.levels.
 */
(function (global) {
  const Find = global.Find;
  const run = (round, opts = {}) => Find.runList(round, Object.assign({ bowl: false }, opts));
  Find.Mech.define("whichone", { run });
  Find.Mech.lab("whichone", { name: "Which one?", verb: "F2: wadho / nindho", mech: "whichone", opts: { bag: true } });
})(window);
