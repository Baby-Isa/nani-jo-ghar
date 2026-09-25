/*
 * Mechanic: pack (new; D.3). `place` onto a grid of cells, each with a cap
 * (the scene's spot cap, up to three things a cell) and a running tally of
 * what's in it: how many are there, never how many are wanted. It never
 * ends by itself: only Done ends it.
 * Knobs (data/tidy.json mechanics.pack): tally (show the per-cell count).
 */
(function (global) {
  const Tidy = global.Tidy;

  Tidy.Mech.define("pack", {
    run(z, p, k) {
      const H = z.host;
      const ctl = Tidy.Mech.run("place", z, p);
      const tallies = {};
      if (k.tally) {
        H.R.B.spots.forEach((s) => {
          if (!s.cell) return;
          const t = Tidy.el("div", "tally", z.el);
          t.style.left = `${s.cell[0] + s.cell[2] - 50}px`;
          t.style.top = `${s.cell[1] + 8}px`;
          tallies[s.id] = t;
        });
      }
      const show = () =>
        Object.keys(tallies).forEach((id) => {
          const n = H.at(id).length;
          tallies[id].textContent = n ? String(n) : "";
          tallies[id].style.visibility = n ? "visible" : "hidden";
        });
      show();
      H.on("drop", show);
      return ctl;
    },
  });

  Tidy.Mech.lab("pack", { name: "Pack", verb: "Counted things into cells", game: "box", level: 1 });
})(window);
