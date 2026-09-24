/*
 * Mechanic: assemble (the chaat bowl, later falooda, dabeli…). Toppings
 * in the customer's order; "no X" means leave it out. Kutchi: the
 * sequence, the likes, "no X".
 * Params: sequence (ids, or arrays of ids for any-order groups), exclude
 * (the "no" items, shown as traps), pool (exact decoys) or decoyPool
 * (knob `decoys` are picked from it).
 * Knobs (data.mechanics.assemble): decoys, decoyPick, flyMs.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("assemble", {
    station: "assemble",
    view: "marble",
    async run(z, { sequence, exclude = [], pool, decoyPool }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const flat = sequence.flat();
      if (!pool) pool = St.decoys(decoyPool, flat.concat(exclude), k.decoys, k.decoyPick);
      const bowl = St.vessel(S, "serving", z.X(800), z.Y(330), 1.45 * z.k);
      const ids = Cook.shuffle([...new Set(pool.concat(flat, exclude))]);
      const big = ids.length > 5;
      const items = St.ingredients(z, ids, Object.assign({ x0: 240, x1: 1360, maxPerRow: 5, dy: -30 }, big ? { w: 190, h: 140 } : { w: 165, h: 124 }));
      let layerN = 0;
      await St.inOrder(z, {
        items,
        series: sequence,
        onWrong: (key, m) => {
          z.listen(false, exclude.includes(key) ? `added ${key} (they said no)` : `${key} out of order`);
          if (exclude.includes(key)) z.say(Lang.line("no", Lang.phrase([key])), { ms: 1100 }).catch(() => {});
          else if (m === 1) z.oops();
        },
        onPick: async (id, r) => {
          if (!ctx.guided) r.misses ? Cook.markMiss(id) : Cook.markRight(id);
          if (ctx.tickItem) ctx.tickItem(id);
          const obj = items[id];
          const spoon = S.track(S.add.image(obj.x, obj.y - z.L(10), S.tex(`layer:${id}`)).setScale(0.35 * z.k).setDepth(D.fx));
          Cook.sfx.pop();
          const p = bowl.surface();
          await S.fly(spoon, p.x + (Math.random() - 0.5) * z.L(30), p.y - z.L(layerN * 4), { scale: (0.62 - layerN * 0.03) * z.k, duration: k.flyMs, arc: z.L(120) });
          spoon.setDepth(D.item + 1 + layerN * 0.1);
          layerN++;
          obj.setAlpha(0.5);
          z.progress({ layer: id, n: layerN });
        },
      });
      ctx.result.layers = flat.slice();
      z.skill(100, "assemble");
      S.sparkle(z.X(800), z.Y(300));
      await Cook.wait(500);
    },
  });

  Mech.lab("assemble", {
    name: "Chaat bowl",
    verb: "Assemble",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.chaat.make(Cook.pick(["nana", "ma", "cousin"]));
      L.card(d, ["Build"]);
      await L.station("assemble", { sequence: d.seq, exclude: d.no, pool: ["ph-lili"].filter((x) => !d.seq.includes(x)) });
    },
  });
})(window);
