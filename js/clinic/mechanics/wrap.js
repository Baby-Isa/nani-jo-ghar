/*
 * Mechanic: wrap (T2, the bandage). docs/modes/clinic-design.md R2.5, R3.3.
 * The bandage goes round the limb on a circular track (Stir's gesture: drag
 * round; each full turn counts) around the limb's axis from the hotspot
 * data. From level 2 the doctor says how many times ("Round twice."): the
 * turns are counted as you go (the badge shows the running tally, never the
 * target); it never ends by itself: press the tick. At level 1 any number of
 * turns is fine (one treatment slot: the item).
 * Level 3 `path`: the figure-of-eight, called as a path across two parts in
 * order ("Round the foot, round the leg, round the foot"): tap each part in
 * the called order; each is a graded row.
 * Params: room, t (part, side, colour, count, path), rows (the count or
 * path rows), obj (the roll, with its colour).
 * Knobs (data.mechanics.wrap): trackR, maxTurns.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Clinic = global.Clinic;
  const V = global.ClinicVisit;
  const TAU = Math.PI * 2;

  function colourOf(obj) {
    const col = String(obj || "").split("#")[1];
    return col ? parseInt(((Cook.data.words[col] || {}).hex || "#f4f1ea").slice(1), 16) : 0xf4f1ea;
  }
  /** One turn of bandage drawn round the limb at a part (a stripe across the axis). */
  function stripe(room, part, side, n, color) {
    const [x, y] = Clinic.body.spot(part, side);
    const [ax, ay] = Clinic.body.axis(part, side);
    const g = room.S.add.graphics();
    room.patient.c.add(g);
    const off = (n - 1.5) * 14;
    const px = -ay;
    const py = ax;
    g.lineStyle(14, color, 1);
    g.lineBetween(x + ax * off - px * 48, y + ay * off - py * 48, x + ax * off + px * 48, y + ay * off + py * 48);
    g.lineStyle(2, 0x3a2410, 0.25);
    g.lineBetween(x + ax * off - px * 48, y + ay * off - py * 48 + 7, x + ax * off + px * 48, y + ay * off + py * 48 + 7);
    return g;
  }

  Cook.Mech.define("wrap", {
    async run(z, { room, t, rows = [], obj = "care-bandage" }, k) {
      const S = room.S;
      const ctx = z.ctx;
      const color = colourOf(obj);
      // the figure-of-eight (level 3): tap each part of the called path, in order
      const pathRows = rows.filter((r) => r.kind === "path");
      if (pathRows.length) {
        let n = 0;
        for (const r of pathRows) {
          let misses = 0;
          for (;;) {
            const post = room.expectPart(z, { part: r.accept[0], side: t.side });
            const h = await room.tapBody(z, { active: r.options, expectAt: post });
            const ok = V.judge(r, h.part);
            ctx.grade(r, ok);
            if (ok) break;
            misses++;
            Cook.sfx.soft();
            await room.say("doctor", r.say);
            if (misses >= 2) ctx.shown(r);
          }
          stripe(room, r.accept[0], t.side, ++n, color);
          Cook.sfx.flip();
        }
        z.expect(null);
        z.skill(100, "bandage");
        return { path: true };
      }
      const countRow = rows.find((r) => r.kind === "count");
      const c = room.where(t.part, t.side);
      const R = k.trackR * (room.patient.isCloseup() ? 2 : 1);
      const track = S.track(S.add.graphics().setDepth(Cook.D.fx));
      track.lineStyle(6, 0xffffff, 0.8);
      for (let a = 0; a < TAU; a += 0.35) track.lineBetween(c.x + Math.cos(a) * R, c.y + Math.sin(a) * R * 0.55, c.x + Math.cos(a + 0.18) * R, c.y + Math.sin(a + 0.18) * R * 0.55);
      const dot = S.track(S.add.circle(c.x + R, c.y, 18, color, 1).setStrokeStyle(4, 0x3a2410, 0.4).setDepth(Cook.D.hand));
      let laps = 0;
      let acc = 0;
      let last = null;
      let grab = false;
      UI.count(0, { speak: false });
      const ang = (p) => Math.atan2((p.worldY - c.y) / 0.55, p.worldX - c.x);
      z.on("pointerdown", (p) => {
        const d = Math.hypot(p.worldX - c.x, (p.worldY - c.y) / 0.55);
        if (Math.abs(d - R) < R * 0.9) {
          grab = true;
          last = ang(p);
        }
      });
      z.on("pointermove", (p) => {
        if (!grab || laps >= k.maxTurns) return;
        const a = ang(p);
        let da = a - last;
        if (da > Math.PI) da -= TAU;
        if (da < -Math.PI) da += TAU;
        last = a;
        acc += Math.abs(da) < 1.2 ? da : 0;
        dot.setPosition(c.x + Math.cos(a) * R, c.y + Math.sin(a) * R * 0.55);
        if (Math.abs(acc) >= TAU) {
          acc = 0;
          laps++;
          UI.count(laps);
          stripe(room, t.part, t.side, laps, color);
          Cook.sfx.flip();
          z.progress({ laps });
        }
      });
      z.on("pointerup", () => (grab = false));
      z.expect({ kind: "circle", x: c.x, y: c.y, rx: R, ry: R * 0.55, turns: countRow ? countRow.accept[0] : 2, count: () => laps, doneSel: "#done-btn" });
      await UI.done();
      z.expect(null);
      UI.hideCount();
      track.destroy();
      dot.destroy();
      if (countRow) ctx.grade(countRow, V.judge(countRow, laps));
      z.skill(laps >= 1 ? 100 : 40, "bandage");
      return { laps };
    },
  });
})(window);
