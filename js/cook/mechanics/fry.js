/*
 * Mechanic: fry (several at once). Drop them into the oil, then lift each
 * out when its own ring reaches green. Several cook at once, at different
 * times: juggling. The count ("fry two") is the Kutchi; there are more on
 * the tray than asked for.
 * Params: kind (a key of knobs.items: samosa, chips…), count.
 * Knobs (data.mechanics.fry): band, rate [min, max], extraOnTray, burnAt,
 * burntScore, items {kind: {art, scale}}, special.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const B = St.BURNER;

  Mech.define("fry", {
    station: "fry",
    view: "hob",
    async run(z, { kind = "samosa", count }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const kadai = St.vessel(S, "kadai", z.X(B.left.x + 190), z.Y(B.left.y - 10), 1.55 * z.k);
      kadai.setLiquid(0.8, 0xe6b84a);
      const [lo, hi] = k.band;
      const onTray = count + k.extraOnTray;
      const look = k.items[kind] || { art: `bowl:${kind}`, scale: 0.6 };
      const trayKey = S.tex(look.art);
      const tray = [];
      Array.from({ length: onTray }).forEach((_, i) => {
        const img = S.track(S.add.image(z.X(1505), z.Y(230 + i * 150), trayKey).setScale(look.scale * z.k).setDepth(D.item));
        img.baseScale = img.scale;
        tray.push(img);
      });
      const spoon = S.hand("spoon", { x: z.X(1300), y: z.Y(700), angle: -15, k: z.k });
      if (k.special) S.special(spoon);
      const sizzle = Cook.sfx.sizzleLoop();
      S.loops.push(sizzle);
      const frying = [];
      const doneOut = [];
      let dropped = 0;
      const slotPos = (i) => ({ x: kadai.rim.x + z.L([-120, 40, 180, -40][i % 4]), y: kadai.rim.y + z.L([10, -30, 20, 50][i % 4]) });
      const ringG = S.track(S.add.graphics().setDepth(D.fx + 1));
      const R = z.L(70);
      const drawRings = () => {
        ringG.clear();
        frying.forEach((f) => {
          if (f.out) return;
          const a0 = -Math.PI / 2;
          ringG.lineStyle(z.L(10), 0xfffaf1, 0.8);
          ringG.beginPath();
          ringG.arc(f.x, f.y, R, 0, Math.PI * 2);
          ringG.strokePath();
          ringG.lineStyle(z.L(10), 0x7d9a78, 1);
          ringG.beginPath();
          ringG.arc(f.x, f.y, R, a0 + lo * Math.PI * 2, a0 + hi * Math.PI * 2);
          ringG.strokePath();
          ringG.lineStyle(z.L(7), f.v > hi ? 0xb24a3a : 0xc9973a, 1);
          ringG.beginPath();
          ringG.arc(f.x, f.y, R, a0, a0 + Math.min(1, f.v) * Math.PI * 2);
          ringG.strokePath();
        });
      };
      await new Promise((resolve) => {
        let stop = null;
        tray.forEach((t) =>
          S.tappable(t, () => {
            const i = dropped++;
            S.untap(t);
            const p = slotPos(i);
            Cook.sfx.sizzle(0.6);
            S.fly(t, p.x, p.y, { duration: 320, arc: z.L(80), scale: t.baseScale * 0.9 }).then(() => {
              S.burst(p.x, p.y, [0xfff0c0, 0xe6b84a], 10, z.L(50));
              const [r0, r1] = k.rate;
              const f = { img: t, x: p.x, y: p.y, v: 0, rate: r0 + Math.random() * (r1 - r0), out: false };
              frying.push(f);
              S.tappable(t, () => lift(f));
            });
          })
        );
        const lift = (f) => {
          if (f.out) return;
          f.out = true;
          S.untap(f.img);
          const score = f.v >= 1 ? k.burntScore : S.bandScore(f.v, lo, hi);
          z.skill(score, "fry");
          S.verdict(f.x, f.y - z.L(90), score, { perfect: "golden", bad: f.v >= 1 ? "burnt" : "too-pale" });
          Cook.sfx.pop();
          S.tweens.add({ targets: spoon, x: f.x + z.L(40), y: f.y + z.L(40), duration: 100 });
          S.fly(f.img, z.X(300 + doneOut.length * 90), z.Y(St.STRIP_Y - 30), { duration: 380, arc: z.L(120) });
          doneOut.push(f);
          z.progress({ fried: doneOut.length });
          if (dropped === doneOut.length && dropped >= 1) checkDone();
        };
        const checkDone = () => {
          UI.done({ glow: ctx.guided && doneOut.length >= count }).then(() => {
            stop();
            ringG.clear();
            z.expect(null);
            resolve();
          });
        };
        let last = performance.now();
        stop = z.tick(() => {
          const now = performance.now();
          const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
          last = now;
          frying.forEach((f) => {
            if (f.out) return;
            f.v += f.rate * dt;
            f.img.setTint(Phaser.Display.Color.GetColor(255, 255 - Math.min(1, f.v) * 60, 255 - Math.min(1, f.v) * 130));
            const inB = f.v >= lo && f.v <= hi;
            if (inB !== !!f.glow) {
              f.glow = inB;
              S.glow(f.img, inB);
            }
            if (f.v >= k.burnAt) lift(f);
          });
          drawRings();
          // for the test: lift anything in the band, else drop another if needed
          const ready = frying.find((f) => !f.out && f.v >= (lo + hi) / 2);
          const next = dropped < count ? tray.find((t) => t.input && t.input.enabled) : null;
          if (ready) z.expect({ kind: "tap", x: ready.x, y: ready.y, key: "lift" });
          else if (next) z.expect({ kind: "tap", x: next.x, y: next.y, key: "drop" });
          else if (dropped === doneOut.length && dropped >= count) z.expect({ kind: "click", selector: "#done-btn" });
          else z.expect({ kind: "wait" });
        });
        if (ctx.guided) S.glow(tray[0], true);
      });
      sizzle.stop();
      ctx.result.fried = doneOut.length;
      z.listen(doneOut.length === count, `fried ${doneOut.length}, they asked for ${count}`);
      return doneOut.length;
    },
  });

  Mech.lab("fry", {
    name: "Fry",
    verb: "Lift when golden",
    async run(L) {
      L.card([Lang.line(Lang.orderFrame(0), Lang.phrase(Lang.countParts(2, "ph-samosa")))], ["Fry"]);
      await L.station("fry", { kind: "samosa", count: 2 });
    },
  });
})(window);
