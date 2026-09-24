/*
 * Mechanic: boil (watch and tap). A ring round the pan fills like a
 * clock; tap the pan (or its knob) in the green. Bubbles grow as it
 * nears the boil; too late and it boils over. Nani may interrupt mid-boil
 * (Busy: it keeps boiling while you help her).
 * Knobs (data.mechanics.boil): band, rate, rise, passMeAfterMs,
 * overScore, instant/instantMs (the chai machine).
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("boil", {
    async run(z, { vessel, knob }, k) {
      const S = z.S;
      if (k.instant) {
        await Cook.wait(k.instantMs);
        z.skill(100, "boil");
        return 1;
      }
      const bubbles = S.time.addEvent({
        delay: 120,
        loop: true,
        callback: () => {
          const p = vessel.surface();
          const lv = z._gauge ? z._gauge.level : 0;
          const b = S.track(S.add.circle(p.x + (Math.random() - 0.5) * vessel.rimRx * 1.4, p.y + (Math.random() - 0.5) * vessel.rimRy, z.L(5 + Math.random() * 8 + lv * 8), 0xfff4e0, 0.9).setDepth(D.item + 1));
          S.tweens.add({ targets: b, y: b.y - z.L(10 + lv * 40), alpha: 0, scale: 1 + lv * 2, duration: 500, onComplete: () => b.destroy() });
          if (Math.random() < 0.3 + lv * 0.4) Cook.sfx.bubble();
        },
      });
      const boilLoop = Cook.sfx.boilLoop();
      S.loops.push(boilLoop);
      const base = vessel.level;
      // Nani sometimes interrupts mid-boil (Busy: it keeps boiling!)
      z.passMeAfter(k.passMeAfterMs);
      const [lo, hi] = k.band;
      const v = await S.ring(vessel, {
        x: vessel.rim.x,
        y: vessel.rim.y + vessel.rim.depth * 0.4,
        r: vessel.rimRx + z.L(40),
        lo,
        hi,
        rate: k.rate,
        alsoTap: knob ? [knob] : [],
        io: z.io,
        onLevel: (lv) => vessel.setLiquid(base + lv * k.rise),
      });
      bubbles.remove();
      boilLoop.stop();
      let score;
      if (v >= 1) {
        for (let i = 0; i < 10; i++) {
          const f = S.track(S.add.ellipse(vessel.rim.x + (Math.random() - 0.5) * vessel.rimRx * 2, vessel.rim.y, z.L(60), z.L(40), 0xfff6e6, 1).setDepth(D.item + 2));
          S.tweens.add({ targets: f, y: vessel.rim.y + vessel.rim.depth + Math.random() * z.L(60), scale: 1.6, duration: 700 });
        }
        z.oops();
        score = k.overScore;
      } else score = S.bandScore(v, lo, hi);
      z.skill(score, "boil");
      S.verdict(vessel.rim.x, vessel.rim.y - z.L(110), score, { bad: v >= 1 ? "boiled-over" : "too-early" });
      vessel.setLiquid(base);
      z.progress({ boiled: v });
      await Cook.wait(400);
      return v;
    },
  });

  Mech.lab("boil", {
    name: "Boil",
    verb: "Watch and tap",
    async run(L) {
      L.card([Lang.wordLine("cook-paani")], ["boil"]);
      const z = await L.scene("watch", "hob");
      const pan = St.vessel(L.S, "pan", z.X(St.BURNER.left.x), z.Y(St.BURNER.left.y - 30), 1.35 * z.k);
      pan.setLiquid(0.5, 0x6b3a1c);
      await L.run("boil", z, { vessel: pan });
    },
  });
})(window);
