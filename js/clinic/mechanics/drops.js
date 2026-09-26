/*
 * Mechanic: drops (T11, level 3). docs/modes/clinic-design.md R2.5, R3.2.
 * The patient said which eye or ear (their own side, "my left eye": the
 * where row, before this); the doctor says how many ("Two drops."). The
 * dropper sits over the place; squeeze once per drop (Cook's counted tap);
 * the badge shows the running tally, never the target; it never ends by
 * itself: press the tick.
 * Params: room, t (part, side), rows (the count row).
 * Knobs (data.mechanics.drops): max, goodPx.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Clinic = global.Clinic;
  const V = global.ClinicVisit;

  Cook.Mech.define("drops", {
    async run(z, { room, t, rows = [] }, k) {
      const S = room.S;
      const ctx = z.ctx;
      const countRow = rows.find((r) => r.kind === "count");
      if (Clinic.body.isFace(t.part) && !room.patient.isCloseup()) await room.patient.closeup(true);
      const to = room.where(t.part, t.side);
      const dr = Clinic.Overlay.image(S, "care-drops", to.x, to.y - 90, { w: 110, h: 110, depth: Cook.D.hand });
      let n = 0;
      UI.count(0, { speak: false });
      S.tappable(dr, async () => {
        if (n >= k.max) return;
        n++;
        UI.count(n);
        const drop = S.track(S.add.circle(to.x, to.y - 30, 9, 0x8fc3e9, 1).setDepth(Cook.D.fx));
        Cook.sfx.bubble();
        await Cook.tween(S, { targets: drop, y: to.y, alpha: 0.2, duration: 260 });
        drop.destroy();
        z.progress({ drops: n });
      });
      z.expect({ kind: "count", x: dr.x, y: dr.y, target: countRow ? countRow.accept[0] : 1, count: () => n, doneSel: "#done-btn" });
      await UI.done();
      S.untap(dr);
      dr.destroy();
      UI.hideCount();
      z.expect(null);
      if (countRow) ctx.grade(countRow, V.judge(countRow, n));
      z.skill(n >= 1 ? 100 : 40, "drops");
      if (room.patient.isCloseup()) await room.patient.closeup(false);
      return { n };
    },
  });
})(window);
