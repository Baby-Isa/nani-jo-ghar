/*
 * Mechanic: grill (turn it when it's charred). A ring timer; turn the
 * skewer in the green, `sides` times. Hands only.
 *
 * Several skewers at once (knob `skewers`, or params.skewers): each has
 * its own ring and its own timer, so you juggle them. In a zone with an
 * `in` channel it grills whatever skewers arrive until the channel closes.
 * Params: skewer (one sequence) or skewers (a list of sequences).
 * Knobs (data.mechanics.grill): band, rate, rateSpread, sides, skewers,
 * burntScore.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("grill", {
    station: "grill",
    view: "marble",
    async run(z, { skewer, skewers }, k) {
      const S = z.S;
      S.flat(S.tex("grill"), z.X(800), z.Y(420), z.L(900), z.L(440), { depth: D.item - 2 });
      const list = skewers || (skewer ? Array.from({ length: k.skewers }, () => skewer) : []);
      const queue = z.in || Mech.queue(list.map((seq) => ({ kind: "skewer", seq })));
      const slots = Math.max(1, z.in ? k.skewers : Math.min(k.skewers, list.length));
      const one = slots === 1;
      const smoke = S.time.addEvent({ delay: 300, loop: true, callback: () => S.steam(z.X(600 + Math.random() * 400), z.Y(380), 1) });
      let done = 0;
      // one spot per skewer on the grill; one skewer sits in the middle
      const rowY = (i) => (one ? 420 : 420 + (i - (slots - 1) / 2) * (360 / slots));
      const grillOne = async (wz, i, item) => {
        const y = rowY(i);
        const sk = S.track(S.add.image(z.X(800), z.Y(y), S.tex("skewer")).setScale(z.k * (one ? 1 : 0.8)).setDepth(D.item));
        const pieces = item.seq.map((id, j) => S.track(S.add.image(z.X(800 + (1060 - 800 - j * 110) * (one ? 1 : 0.8)), z.Y(y), S.tex(`piece:${id}`)).setScale(0.9 * z.k * (one ? 1 : 0.8)).setDepth(D.item + 1)));
        (item.sprites || []).forEach((o) => o.active && o.destroy());
        const cont = S.track(S.add.zone(z.X(800), z.Y(y), z.L(800), z.L(one ? 140 : 110)).setDepth(D.fx + 3));
        const [lo, hi] = k.band;
        const rate = k.rate * (1 + (one ? 0 : (Math.random() - 0.5) * k.rateSpread));
        for (let side = 0; side < k.sides; side++) {
          const v = await S.ring(cont, {
            x: z.X(one ? 800 : 1230),
            y: z.Y(y),
            r: z.L(one ? 220 : 60),
            lo,
            hi,
            rate,
            io: wz.io,
            onLevel: (lv) => pieces.forEach((p) => p.setTint(Phaser.Display.Color.GetColor(255, 255 - lv * 70, 255 - lv * 110))),
          });
          Cook.sfx.flip();
          const sy = sk.scaleY;
          await Cook.tween(S, { targets: [sk, ...pieces], scaleY: 0.1 * z.k, duration: 110, yoyo: true });
          pieces.forEach((p) => p.clearTint());
          const score = v >= 1 ? k.burntScore : S.bandScore(v, lo, hi);
          z.skill(score, "grill");
          S.verdict(z.X(one ? 800 : 1230), z.Y(one ? 220 : y - 60), score, { perfect: "turned", bad: v >= 1 ? "charred" : "too-early" });
          if (sk.scaleY !== sy) sk.setScale(sk.scaleX, sy);
        }
        done++;
        z.progress({ grilled: done });
        if (!one) {
          cont.destroy();
          await Cook.tween(S, { targets: [sk, ...pieces], alpha: 0, duration: 250 });
        }
      };
      await Promise.all(
        Array.from({ length: slots }, async (_, i) => {
          const wz = z.child({ id: `${z.id}.skewer${i}` });
          for (;;) {
            const item = await queue.take();
            if (!item) break;
            await grillOne(wz, i, item);
          }
          wz.close();
        })
      );
      smoke.remove();
      await Cook.wait(400);
      return done;
    },
  });

  Mech.lab("grill", {
    name: "Grill",
    verb: "Turn in time",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.mishkaki.make("nana");
      L.card(d, ["Grill"]);
      await L.station("grill", { skewer: d.seq });
    },
  });
})(window);
