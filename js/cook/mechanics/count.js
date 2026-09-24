/*
 * Mechanic: count in (spoons). Tap the bowl once per spoon they asked
 * for, then the tick. Kutchi: the number ("bo khun"), "no khun".
 * Knobs (data.mechanics.count): max (spoons before the bowl stops giving).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("count", {
    api: "countIn",
    async run(z, { bowl, n, into, word }, k) {
      const S = z.S;
      let count = 0;
      UI.count(0, { speak: false });
      const add = async () => {
        count++;
        UI.count(count);
        z.progress({ count });
        const col = St.heapColor(word, 0xffffff);
        const spoon = S.track(S.add.circle(bowl.x, bowl.y - z.L(30), z.L(14), col, 1).setStrokeStyle(3, 0x8f9398).setDepth(D.fx));
        const p = into.surface ? into.surface() : into;
        await S.fly(spoon, p.x + (Math.random() - 0.5) * z.L(60), p.y, { duration: 360, arc: z.L(90) });
        S.burst(p.x, p.y, col, 6, z.L(30));
        spoon.destroy();
      };
      if (z.guided) S.glow(bowl, true);
      await new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          z.expect(null);
          S.untap(bowl);
          S.glow(bowl, false);
          UI.hideDone();
          resolve();
        };
        S.tappable(bowl, () => {
          if (count >= k.max) return;
          Cook.sfx.pop();
          add();
          if (z.guided) {
            S.glow(bowl, count < n);
            UI.glowDone(count >= n);
          }
        });
        UI.done().then(finish);
        const c = S.centre(bowl);
        z.expect({ kind: "count", x: c.x, y: c.y, target: n, count: () => count, doneSel: "#done-btn" });
      });
      UI.hideCount();
      z.listen(count === n, `${count} ${word}, they asked for ${n}`);
      count === n ? Cook.markRight(Cook.numId(n)) : Cook.markMiss(Cook.numId(n));
      return count;
    },
  });

  Mech.lab("count", {
    name: "Sugar",
    verb: "Count in",
    async run(L) {
      const n = 1 + Math.floor(Math.random() * 3);
      L.card([Lang.line("and", Lang.phrase(Lang.countParts(n, "cook-khun")))], ["count"]);
      const z = await L.scene("count", "hob");
      const pan = St.vessel(L.S, "pan", z.X(St.BURNER.left.x), z.Y(St.BURNER.left.y - 30), 1.35 * z.k);
      pan.setLiquid(0.6, 0xc49468);
      const items = {};
      ["cook-khun", "spi-16", "cook-atto"].forEach((id, i) => (items[id] = L.S.ingredient(id, z.X(300 + i * 250), z.Y(St.STRIP_Y - 20), { w: z.L(170), h: z.L(128) })));
      await L.run("count", z, { bowl: items["cook-khun"], n, into: pan, word: "cook-khun" });
    },
  });
})(window);
