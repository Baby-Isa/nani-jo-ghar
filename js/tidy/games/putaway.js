/*
 * T1 Put it away (D.2): the shopping into the kitchen (the shelves, the
 * bowl, the basket, the box) or spices into the masala dabba. One zone:
 * `place` + `check`; Simba's `paw` and Nani's "pass me" from level 2.
 * Kinds K1 (put it there), K2 (put it right), K3 (pack it), K4 (her rules).
 */
(function (global) {
  const Tidy = global.Tidy;
  Tidy.Game.define("putaway", {
    name: "Put it away",
    zones: (H) => [
      { id: "board", main: true, region: [0, 0, 1600, 900], mechs: ["place", "check", "paw", H.kn.passme && "passme"], params: { force: H.opts.paw } },
    ],
  });
})(window);
