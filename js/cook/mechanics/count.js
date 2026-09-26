/*
 * Mechanic: count in (spoons). Tap the bowl once per spoon they asked
 * for, then the tick. The look-alike bowls beside it (salt next to sugar)
 * can be spooned in too: a spoon of the wrong one costs the ear star
 * ("Arre re!"). The badge shows the running tally only, never the target.
 * Kutchi: the number ("ba khun"), "khun na", and which bowl.
 * Cook.Spoon.spoon(z, {bowl, into, word}) is the one-spoon animation the
 * Chai tray uses cup by cup.
 * Knobs (data.mechanics.count): max (spoons before the bowl stops giving),
 * spoonMs (the spoon's flight).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /** One spoonful from `bowl` into `into` (a vessel or a point): a spoon with a heap on it. */
  async function spoon(z, { bowl, into, word, ms = 360 }) {
    const S = z.S;
    const col = St.heapColor(word, 0xffffff);
    const c = S.centre(bowl);
    const sp = S.track(S.add.container(c.x, c.y - z.L(20)).setDepth(D.fx));
    const g = S.add.graphics();
    g.fillStyle(0xb9bcc2, 1);
    g.fillRoundedRect(z.L(8), -z.L(4), z.L(56), z.L(8), z.L(4));
    g.fillEllipse(0, 0, z.L(34), z.L(24));
    g.fillStyle(col, 1);
    g.fillEllipse(0, -z.L(3), z.L(26), z.L(14));
    sp.add(g);
    const p = into.surface ? into.surface() : into;
    await S.fly(sp, p.x + (Math.random() - 0.5) * z.L(30), p.y - z.L(10), { duration: ms, arc: z.L(90) });
    S.tweens.add({ targets: sp, angle: -70, duration: 120 });
    S.burst(p.x, p.y, col, 6, z.L(30));
    await Cook.wait(130);
    sp.destroy();
  }
  Cook.Spoon = { spoon };

  Mech.define("count", {
    api: "countIn",
    async run(z, { bowl, n, into, word, items }, k) {
      const S = z.S;
      let count = 0;
      UI.count(0, { speak: false, id: word });
      const others = Object.entries(items || {}).filter(([id, obj]) => obj && obj !== bowl && id !== word);
      const add = async (from, id) => {
        const p = spoon(z, { bowl: from, into, word: id, ms: k.spoonMs });
        if (id !== word) {
          UI.countUp(id, { speak: false });
          return p;
        }
        count++;
        UI.count(count, { id: word });
        z.progress({ count });
        return p;
      };
      if (z.guided) S.glow(bowl, true);
      await new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          z.expect(null);
          [bowl, ...others.map(([, o]) => o)].forEach((o) => S.untap(o));
          S.glow(bowl, false);
          UI.hideDone();
          resolve();
        };
        const post = () => {
          const c = S.centre(bowl);
          z.expect({ kind: "count", x: c.x, y: c.y, target: n, count: () => count, doneSel: "#done-btn" });
        };
        S.tappable(bowl, () => {
          if (count >= k.max) return;
          Cook.sfx.pop();
          add(bowl, word);
          if (z.guided) {
            S.glow(bowl, count < n);
            UI.glowDone(count >= n);
          }
        });
        // the look-alikes are real choices: a spoon of salt goes in too
        others.forEach(([id, obj]) =>
          S.tappable(obj, () => {
            // level 2 up it just goes in, like any spoon (UX 11): the review says so
            if (z.quiet) Cook.sfx.pop();
            else Cook.sfx.soft();
            add(obj, id);
            z.listen(false, `added ${id}, not ${word}`);
            z.oops();
          })
        );
        UI.done().then(finish);
        post();
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
      Cook.shuffle(["cook-khun", "spi-16", "cook-atto"]).forEach((id, i) => (items[id] = L.S.ingredient(id, z.X(300 + i * 250), z.Y(St.STRIP_Y - 20), { w: z.L(170), h: z.L(128) })));
      await L.run("count", z, { bowl: items["cook-khun"], n, into: pan, word: "cook-khun", items });
    },
  });
})(window);
