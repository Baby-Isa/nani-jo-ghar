/*
 * Mechanic: tadka (spices in order). Nani says the spices; tap them into
 * the hot oil in that order, then tip the pan into the pot.
 * Kutchi: the sequence. `order` may hold any-order groups (arrays), which
 * the order ladder shows as a shared dot.
 * Knobs (data.mechanics.tadka): shelf (the spice bowls on the counter),
 * autoTip (the tadka upgrade), ladder (how the order ladder shows it,
 * for the mission card: "words" | "dots" | "hidden").
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const B = St.BURNER;

  Mech.define("tadka", {
    station: "tadka",
    view: "hob",
    async run(z, { order, veg = [] }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const flat = order.flat();
      const pan = St.vessel(S, "tadka", z.X(B.right.x), z.Y(B.right.y - 20), 1.3 * z.k);
      pan.setLiquid(0.6, 0xe8b24a);
      const pot = St.vessel(S, "pot", z.X(B.left.x), z.Y(B.left.y - 40), 1.0 * z.k);
      pot.setLiquid(0.6, 0xe7b23f);
      const spices = Cook.shuffle(k.shelf.filter((x, i, a) => a.indexOf(x) === i));
      const items = St.ingredients(z, spices.concat(veg), { x0: 180, x1: 1420, dy: -20, w: 175, h: 130 });
      const sizzle = Cook.sfx.sizzleLoop();
      S.loops.push(sizzle);
      flat.forEach((id) => Cook.markSeen(id));
      await z.say(Lang.list(flat), { hide: St.hideKnown(ctx) });
      await St.inOrder(z, {
        items,
        series: order.concat(veg),
        markSeen: false,
        onWrong: (key, m, expected) => {
          z.listen(false, `tadka ${key} before ${expected}`);
          S.burst(pan.rim.x, pan.rim.y, 0xfff0c0, 6, z.L(50));
          if (m === 1) z.oops();
        },
        onPick: async (id, r) => {
          if (!ctx.guided) r.misses ? Cook.markMiss(id) : Cook.markRight(id);
          const obj = items[id];
          const col = St.heapColor(id);
          const dot = S.track(S.add.circle(obj.x, obj.y - z.L(20), z.L(20), col, 1).setDepth(D.fx));
          await S.fly(dot, pan.rim.x, pan.rim.y, { duration: 340, arc: z.L(100) });
          S.burst(pan.rim.x, pan.rim.y, [col, 0xfff0c0], 16, z.L(70));
          Cook.sfx.sizzle(0.8);
          dot.destroy();
          obj.setAlpha(0.45);
          z.progress({ added: id });
        },
      });
      // tip it into the pot: once all the spices are in, the pan itself is
      // the cue (docs s7, "the cue is always on the object") — a pulsing
      // highlight on the pan and a flashing arrow pointing at the pot, so
      // it's obvious you now tap the pan to pour it in.
      if (!k.autoTip) {
        S.glow(pan, true);
        const arrow = S.track(S.add.graphics().setDepth(D.fx + 2));
        const ax = pan.rim.x + (pot.rim.x - pan.rim.x) * 0.25;
        const ay = pan.rim.y - pan.rimRy - z.L(34);
        const bx = pan.rim.x + (pot.rim.x - pan.rim.x) * 0.85;
        const by = pot.rim.y - pot.rimRy - z.L(34);
        const ang = Math.atan2(by - ay, bx - ax);
        arrow.lineStyle(z.L(9), 0xffd27a, 1).lineBetween(ax, ay, bx, by);
        const hx = bx - Math.cos(ang) * z.L(26);
        const hy = by - Math.sin(ang) * z.L(26);
        const px = Math.cos(ang + Math.PI / 2) * z.L(16);
        const py = Math.sin(ang + Math.PI / 2) * z.L(16);
        arrow.fillStyle(0xffd27a, 1).fillTriangle(bx, by, hx + px, hy + py, hx - px, hy - py);
        const arrowFlash = S.tweens.add({ targets: arrow, alpha: 0.2, duration: 420, yoyo: true, repeat: -1 });
        await S.step({ items: { tadka: pan }, expected: "tadka", guided: ctx.guided, sayLine: null, io: z.io });
        arrowFlash.stop();
        arrow.destroy();
        S.glow(pan, false);
      } else S.special(pan);
      await Cook.tween(S, { targets: pan, x: z.X(B.left.x + 220), y: z.Y(B.left.y - 140), angle: -50, duration: 420 });
      Cook.sfx.sizzle(1.4);
      S.steam(pot.rim.x, pot.rim.y - z.L(30), 6);
      pot.setLiquid(0.65, 0xe0a42c);
      sizzle.stop();
      z.skill(100, "tadka");
      await Cook.wait(500);
    },
  });

  Mech.lab("tadka", {
    name: "Tadka",
    verb: "Spices in order",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.daal.make();
      L.card(R.daal.lines(d, 0), ["Tadka"]);
      await L.station("tadka", { order: d.tadka });
    },
  });
})(window);
