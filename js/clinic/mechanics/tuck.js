/*
 * Mechanic: tuck (T13, the blanket). docs/modes/clinic-design.md R2.5.
 * Pull the blanket up from their knees to their chin (a vertical drag; the
 * hand star from how near the chin it stops). From level 2 the doctor may
 * say how many ("Two blankets."): tap the pile for each one more, then the
 * tick; the blankets stack (drawn in code). Just right (M4, `warm`) is
 * phase 2.
 * Params: room, t (count), rows (the count row), img (the trolley blanket).
 * Knobs (data.mechanics.tuck): goodFrac (a perfect tuck within this share
 * of the pull).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Clinic = global.Clinic;
  const V = global.ClinicVisit;

  Cook.Mech.define("tuck", {
    async run(z, { room, t, rows = [], img, obj = "care-blanket" }, k) {
      const S = room.S;
      const ctx = z.ctx;
      const countRow = rows.find((r) => r.kind === "count");
      const chin = room.patient.toWorld(640, 300);
      const start = room.patient.toWorld(640, 760);
      const blanket = S.track(S.add.rectangle(start.x, start.y, 520, 260, 0xc9a24a, 0.96).setStrokeStyle(6, 0x9d6f28).setOrigin(0.5, 0).setDepth(Cook.D.front));
      if (img) img.setAlpha(0.5);
      z.expect({ kind: "drag", from: { x: start.x, y: start.y + 60 }, to: { x: chin.x, y: chin.y + 60 } });
      const topY = await new Promise((resolve) => {
        let drag = null;
        blanket.setInteractive({ useHandCursor: true });
        blanket.on("pointerdown", (p) => (drag = { y0: p.worldY, b0: blanket.y }));
        z.on("pointermove", (p) => {
          if (!drag) return;
          blanket.y = Cook.clamp(drag.b0 + (p.worldY - drag.y0), chin.y - 120, start.y);
          blanket.height = Math.max(260, start.y + 260 - blanket.y);
          blanket.setSize(520, blanket.height);
        });
        z.on("pointerup", () => {
          if (!drag) return;
          drag = null;
          blanket.disableInteractive();
          resolve(blanket.y);
        });
      });
      const range = start.y - chin.y;
      const off = Math.abs(topY - chin.y) / range;
      const score = off <= k.goodFrac ? 100 : Cook.clamp(100 - (off - k.goodFrac) * 180, 20, 99);
      S.verdict(chin.x, chin.y - 40, score);
      z.skill(score, "blanket");
      room.patient.setExpr("happy");
      if (!countRow) return { score, n: 1 };
      // more blankets: tap the pile once for each, then the tick
      let n = 1;
      UI.count(n, { speak: false });
      const pile = img || Clinic.Overlay.image(S, obj, 1300, 700);
      pile.setAlpha(1);
      S.tappable(pile, () => {
        if (n >= 5) return;
        n++;
        UI.count(n);
        Cook.sfx.pop();
        S.track(S.add.rectangle(blanket.x, blanket.y + (n - 1) * 10, 530 + n * 10, 30, n % 2 ? 0x9d6f28 : 0xc9a24a).setOrigin(0.5, 0).setDepth(Cook.D.front + n));
      });
      z.expect({ kind: "count", x: pile.x, y: pile.y, target: countRow.accept[0], count: () => n, doneSel: "#done-btn" });
      await UI.done();
      S.untap(pile);
      UI.hideCount();
      z.expect(null);
      ctx.grade(countRow, V.judge(countRow, n));
      return { score, n };
    },
  });
})(window);
