/*
 * Mechanic: stir (count and speed). Circle the ladle round the pot; laps
 * are counted aloud; a speedometer shows the green speed zone.
 * Kutchi: the number, "slowly" / "quickly".
 * Params: laps, speed (null | "slow" | "quick").
 * Knobs (data.mechanics.stir): zones {slow, quick, any} (laps per second),
 * speedWords (which line says each speed), lap (fraction of a full circle
 * that counts), deadZone, reach, okFrac, quietMs, special.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const B = St.BURNER;

  Mech.define("stir", {
    station: "stir",
    view: "hob",
    async run(z, { laps, speed }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const pot = St.vessel(S, "pot", z.X(B.left.x + 200), z.Y(B.left.y - 30), 1.35 * z.k);
      pot.setLiquid(0.72, 0xe0a42c);
      if (k.special) S.special(pot);
      const parts = [Lang.numLine(laps)];
      if (speed) parts.push(Lang.line(k.speedWords[speed]));
      Cook.markSeen(Cook.numId(laps));
      await z.say(Lang.join(parts), { hide: St.hideKnown(ctx) });
      const c = pot.surface();
      const cx = c.x;
      const cy = c.y;
      const ladle = S.hand("ladle", { x: cx + z.L(80), y: cy + z.L(40), k: z.k });
      // speedometer beside the pot
      const zone = k.zones[speed || "any"];
      const meter = S.track(S.add.graphics().setDepth(D.fx));
      const mx = z.X(1250);
      const my = z.Y(330);
      const mr = z.L(110);
      let spd = 0;
      const drawMeter = () => {
        meter.clear();
        if (!speed) return;
        const toA = (v) => Math.PI + Cook.clamp(v / 3, 0, 1) * Math.PI;
        meter.lineStyle(z.L(24), 0xfffaf1, 0.9);
        meter.beginPath();
        meter.arc(mx, my, mr, Math.PI, Math.PI * 2);
        meter.strokePath();
        meter.lineStyle(z.L(24), 0x7d9a78, 1);
        meter.beginPath();
        meter.arc(mx, my, mr, toA(zone[0]), toA(zone[1]));
        meter.strokePath();
        const a = toA(spd);
        meter.lineStyle(z.L(8), 0xb24a3a, 1);
        meter.lineBetween(mx, my, mx + Math.cos(a) * z.L(100), my + Math.sin(a) * z.L(100));
        meter.fillStyle(0x3a2410, 1);
        meter.fillCircle(mx, my, z.L(12));
      };
      drawMeter();
      const lapA = Math.PI * 2 * k.lap;
      const result = await new Promise((resolve) => {
        let prev = null;
        let acc = 0;
        let count = 0;
        let quiet = null;
        let inZone = 0;
        let total = 0;
        let lastT = performance.now();
        const offs = [];
        const finish = () => {
          z.expect(null);
          offs.forEach((f) => f());
          UI.hideCount();
          resolve({ count, zoneFrac: total ? inZone / total : 1 });
        };
        const move = (p) => {
          if (!p.isDown) return (prev = null);
          ladle.setPosition(p.worldX, p.worldY);
          const dx = p.worldX - cx;
          const dy = (p.worldY - cy) * 2;
          const dist = Math.hypot(dx, dy);
          if (dist < z.L(k.deadZone) || dist > z.L(k.reach)) return;
          const a = Math.atan2(dy, dx);
          clearTimeout(quiet);
          const now = performance.now();
          const dt = Math.max(0.001, (now - lastT) / 1000) * Cook.speed;
          lastT = now;
          if (prev != null) {
            let d = a - prev;
            if (d > Math.PI) d -= Math.PI * 2;
            if (d < -Math.PI) d += Math.PI * 2;
            acc += Math.abs(d);
            spd = spd * 0.85 + (Math.abs(d) / (Math.PI * 2) / dt) * 0.15;
            total += dt;
            if (spd >= zone[0] && spd <= zone[1]) inZone += dt;
            drawMeter();
            if (acc >= lapA) {
              acc -= lapA;
              count++;
              UI.count(count);
              Cook.sfx.bubble();
              S.burst(cx, cy, [0xe0a42c, 0xf6d27a], 8, z.L(60));
              z.progress({ laps: count });
            }
          }
          prev = a;
        };
        const up = () => {
          prev = null;
          clearTimeout(quiet);
          if (count >= 1) quiet = setTimeout(finish, k.quietMs / Cook.speed);
        };
        offs.push(z.on("pointermove", move), z.on("pointerup", up));
        S.ghost({ circle: { x: cx, y: cy, rx: z.L(150), ry: z.L(60) } }, { duration: speed === "quick" ? 700 : 1500, delay: z.guided ? 200 : 5000 });
        z.expect({ kind: "stir", x: cx, y: cy, rx: z.L(150), ry: z.L(60), target: laps, speed: speed || null, count: () => 0 });
        Cook.stirCount = () => count;
      });
      z.listen(result.count === laps, `stirred ${result.count} times, they asked for ${laps}`);
      result.count === laps ? Cook.markRight(Cook.numId(laps)) : Cook.markMiss(Cook.numId(laps));
      if (speed) {
        const ok = result.zoneFrac >= k.okFrac;
        z.listen(ok, `stir speed ${speed}`);
        z.skill(Math.round(40 + result.zoneFrac * 60), "stir speed");
      }
      S.sparkle(cx, cy);
      S.steam(cx, cy - z.L(60), 4);
      await Cook.wait(500);
      return result;
    },
  });

  Mech.lab("stir", {
    name: "Stir",
    verb: "Count and speed",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.daal.make();
      L.card(d, ["Stir"]);
      await L.station("stir", { laps: d.laps, speed: d.speed || "slow" });
    },
  });
})(window);
