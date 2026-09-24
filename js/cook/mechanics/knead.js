/*
 * Mechanic: knead. Tap (press) the dough until the ring is full.
 * Hands only: the fun break between listening.
 * Knobs (data.mechanics.knead): presses, auto (the mixer), special.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const Mech = Cook.Mech;

  Mech.define("knead", {
    station: "knead",
    view: "wood",
    footprint: { x: 500, y: 180, w: 600, h: 660 },
    async run(z, p, k) {
      const S = z.S;
      const c = z.P(800, 420);
      const bowl = S.flat(S.tex("vessel:serving"), c.x, c.y, z.L(520), z.L(360));
      const dough = S.track(S.add.image(z.X(800), z.Y(400), "dough-ball").setScale(0.62 * z.k).setDepth(D.item + 1).setTint(0xf4e6c8));
      dough.baseScale = 0.62 * z.k;
      const handImg = S.hand(null, { x: z.X(800), y: z.Y(560), k: z.k });
      const need = k.presses;
      let presses = 0;
      const ring = S.track(S.add.graphics().setDepth(D.fx));
      const drawRing = () => {
        ring.clear();
        ring.lineStyle(z.L(14), 0x7d9a78, 0.9);
        ring.beginPath();
        ring.arc(z.X(800), z.Y(400), z.L(200), -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * presses) / need);
        ring.strokePath();
      };
      const press = () => {
        presses++;
        Cook.sfx.flip();
        S.tweens.add({ targets: handImg, y: z.Y(470), duration: 80, yoyo: true });
        S.tweens.add({ targets: dough, scaleX: dough.baseScale * 1.22, scaleY: dough.baseScale * 0.8, duration: 90, yoyo: true });
        dough.setTint(Phaser.Display.Color.GetColor(244 - presses, 230 + presses, 200 + presses * 4));
        S.burst(z.X(800), z.Y(390), [0xf4ead8, 0xffffff], 5, z.L(50));
        drawRing();
        z.progress(presses / need);
      };
      if (k.auto) {
        S.special(bowl);
        for (let i = 0; i < need; i++) {
          press();
          await Cook.wait(140);
        }
      } else {
        S.ghost([[z.X(800), z.Y(380)], [z.X(800), z.Y(430)]], { duration: 500, delay: z.guided ? 200 : 5000 });
        await new Promise((resolve) => {
          const zone = S.track(S.add.zone(c.x, c.y, z.L(520), z.L(360)).setDepth(D.fx + 3));
          S.tappable(zone, () => {
            press();
            if (presses >= need) {
              S.untap(zone);
              z.expect(null);
              resolve();
            }
          });
          z.expect({ kind: "knead", x: c.x, y: c.y });
        });
      }
      dough.clearTint();
      S.sparkle(z.X(800), z.Y(400));
      z.skill(100, "knead");
      await Cook.wait(400);
    },
  });

  Mech.lab("knead", {
    name: "Knead",
    verb: "Press",
    async run(L) {
      L.card([Lang.wordLine("cook-maani")], ["Knead"]);
      await L.station("knead", {});
    },
  });
})(window);
