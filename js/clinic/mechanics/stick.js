/*
 * Mechanic: stick (T1, the plaster). docs/modes/clinic-design.md R2.5, 12.2
 * task 3 (Cook's pour drag, score = distance). Peel the plaster off the
 * trolley and drag it onto the sore place; where you let go is where it
 * sticks. The hand star (gentle hands) from how near the spot it went.
 * Params: room, t (the treatment: part, side), obj (the plaster, maybe with
 * its colour), img (its trolley image).
 * Knobs (data.mechanics.stick): goodPx (a perfect stick within this), okPx
 * (beyond this it's a poor stick).
 */
(function (global) {
  const Cook = global.Cook;
  const Clinic = global.Clinic;

  Cook.Mech.define("stick", {
    async run(z, { room, t, obj = "care-plaster", img }, k) {
      const S = room.S;
      const to = room.where(t.part, t.side);
      const from = img ? { x: img.x, y: img.y } : { x: 1200, y: 700 };
      if (img) img.setVisible(false);
      const pl = Clinic.Overlay.image(S, obj, from.x, from.y, { w: 120, h: 96, depth: Cook.D.hand });
      z.expect({ kind: "drag", from, to });
      const at = await new Promise((resolve) => {
        let drag = false;
        S.tappable(pl, () => (drag = true));
        z.on("pointermove", (p) => {
          if (!drag) return;
          pl.setPosition(p.worldX, p.worldY);
        });
        z.on("pointerup", (p) => {
          if (!drag) return;
          drag = false;
          S.untap(pl);
          resolve({ x: p.worldX, y: p.worldY });
        });
      });
      z.expect(null);
      const d = Phaser.Math.Distance.Between(at.x, at.y, to.x, to.y);
      const score = d <= k.goodPx ? 100 : Cook.clamp(100 - ((d - k.goodPx) / (k.okPx - k.goodPx)) * 55, 20, 99);
      pl.destroy();
      const des = room.patient.toDesign(at.x, at.y);
      const [sx, sy] = Clinic.body.spot(t.part, t.side);
      room.patient.put(obj, t.part, t.side, { dx: des.x - sx, dy: des.y - sy, w: 90, h: 72 });
      Cook.sfx.pop();
      S.verdict(at.x, at.y - 60, score);
      z.skill(score, "plaster");
      return { score };
    },
  });
})(window);
