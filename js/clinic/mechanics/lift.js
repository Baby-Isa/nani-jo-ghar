/*
 * Mechanic: lift (T12: the cool cloth, the ice pack, the hot-water bottle).
 * docs/modes/clinic-design.md R2.5. It goes onto the sore place; a ring
 * fills round it (Cook's S.ring, "tap when it's green"); lift it off on the
 * green. The hand star from the timing. The Kutchi is in which item (the
 * care row, before this) and, from level 2, hot or cold.
 * Params: room, t (part, side), obj, img (its trolley image).
 * Knobs (data.mechanics.lift): band [lo, hi], rate.
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = global.Clinic;

  Cook.Mech.define("lift", {
    async run(z, { room, t, obj, img }, k) {
      const S = room.S;
      const to = room.where(t.part, t.side);
      const pack = Clinic.Overlay.image(S, obj, img ? img.x : 1200, img ? img.y : 700, { w: 120, h: 96, depth: Cook.D.hand });
      if (img) img.setVisible(false);
      await S.fly(pack, to.x, to.y, { duration: 420 });
      const [lo, hi] = k.band;
      const v = await S.ring(pack, { x: to.x, y: to.y, r: 90, lo, hi, rate: k.rate, io: z.io });
      const score = S.bandScore(v, lo, hi);
      S.verdict(to.x, to.y - 110, score);
      await S.fly(pack, to.x + 160, to.y - 120, { duration: 300 });
      pack.destroy();
      z.skill(score, "lift");
      return { score };
    },
  });
})(window);
