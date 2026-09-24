/*
 * Mechanic: thread (skewer). Push the pieces onto the stick in the order
 * they said. Kutchi: the sequence (later colours, "two meat, one veg").
 * In a zone with an `out` channel, the finished skewer is sent on as
 * {kind: "skewer", seq, sprites} (Mishkaki: thread -> grill).
 * Params: sequence (ids; arrays are any-order groups), pool.
 * Knobs (data.mechanics.thread): decoys (null = all of the pool).
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("thread", {
    station: "thread",
    view: "marble",
    async run(z, { sequence, pool }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const flat = sequence.flat();
      const decoys = St.decoys(pool, flat, k.decoys);
      const sk = S.track(S.add.image(z.X(800), z.Y(330), S.tex("skewer")).setScale(z.k).setDepth(D.item));
      const ids = Cook.shuffle([...new Set(pool.filter((x) => flat.includes(x) || decoys.includes(x)).concat(flat))]);
      const items = St.ingredients(z, ids, { x0: 300, x1: 1300, dy: -30, w: 165, h: 124 });
      const on = [];
      await St.inOrder(z, {
        items,
        series: sequence,
        onWrong: (key, m, expected) => {
          z.listen(false, `${key} instead of ${expected}`);
          if (m === 1) z.oops();
        },
        onPick: async (id, r, i) => {
          if (!ctx.guided) r.misses ? Cook.markMiss(id) : Cook.markRight(id);
          if (ctx.tickItem) ctx.tickItem(i);
          const obj = items[id];
          const pc = S.track(S.add.image(obj.x, obj.y, S.tex(`piece:${id}`)).setScale(0.9 * z.k).setDepth(D.item + 1));
          Cook.sfx.pop();
          await S.fly(pc, z.X(1060 - on.length * 110), z.Y(330), { duration: 360, arc: z.L(100) });
          on.push(pc);
          z.progress({ threaded: id, n: on.length });
        },
      });
      ctx.result.skewer = flat.slice();
      z.skill(100, "thread");
      S.sparkle(z.X(800), z.Y(330));
      await Cook.wait(400);
      z.emit({ kind: "skewer", seq: flat.slice(), sprites: z.out ? [sk].concat(on) : null });
      return on.length;
    },
  });

  Mech.lab("thread", {
    name: "Skewer",
    verb: "Thread in order",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.mishkaki.make(Cook.pick(["nana", "ma", "cousin"]));
      L.card(d, ["Skewer"]);
      await L.station("thread", { sequence: d.seq, pool: ["ph-meat", "veg-02", "ph-pepper", "veg-03"] });
    },
  });
})(window);
