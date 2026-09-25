/*
 * Mechanic: stack (new; D.3). Plates and katoris set on the same thing
 * stack, up to `max`; one dropped more than `tolerance` design px off the
 * centre wobbles. The wobble costs only the Neat star (hand skill, never
 * where things are relative to the rules; 7).
 * Knobs (data/tidy.json mechanics.stack): tolerance, max.
 */
(function (global) {
  const Tidy = global.Tidy;
  const Rel = Tidy.Rel;

  Tidy.Mech.define("stack", {
    run(z, p, k) {
      const H = z.host;
      const stackable = (iid) => !!(global.Cook.data.words[H.R.items[iid].word] || {}).stack;
      const base = (iid, spot) => Rel.free(H.state(), H.R.B, spot) > 0 || H.pl[iid] === spot;
      H.accepts = (iid, spot) => {
        if (base(iid, spot)) return true;
        const there = H.at(spot).filter((j) => j !== iid);
        return stackable(iid) && there.length < k.max && there.every((j) => stackable(j) && H.R.items[j].word === H.R.items[iid].word);
      };
      H.on("drop", ({ iid, to, x, y }) => {
        const n = H.view.nodes[iid];
        n.classList.remove("wobble");
        if (!stackable(iid) || to === "tray" || x == null) return;
        const s = H.R.B.byId[to];
        const below = H.at(to).filter((j) => j !== iid);
        if (!below.length) return;
        if (Math.hypot(x - s.x, y - s.y) > k.tolerance) {
          n.classList.add("wobble");
          H.loseNeat("a stack wobbles");
          Tidy.sfx("soft");
        } else Tidy.sfx("right");
      });
      return {};
    },
  });

  Tidy.Mech.lab("stack", { name: "Stack", verb: "Plates straight or wobbly", game: "dastarkhwan", level: 1 });
})(window);
