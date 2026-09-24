/*
 * Mechanic: fetch (the pantry). Tap the named items into the basket, in
 * any order, among look-alike decoys. Kutchi: the nouns and counts.
 * Knobs (data.mechanics.fetch): shelf, minDecoys, lookalikes, flyMs, special.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("fetch", {
    station: "fetch",
    view: "pantry",
    footprint: { x: 220, y: 60, w: 1160, h: 845 },
    async run(z, { need, askLines = true }, k) {
      const S = z.S;
      const ctx = z.ctx;
      // decoys: look-alikes of what's needed first, then others
      const decoys = [...new Set(need.flatMap((id) => St.lookalikes(id, k.lookalikes)).concat(Cook.shuffle(Cook.data.pantry_decoys)))].filter((d) => !need.includes(d)).slice(0, Math.max(k.minDecoys, k.shelf - need.length));
      const all = Cook.shuffle(need.concat(decoys));
      // the painted pantry's shelves
      const rows = [
        { y: 196, h: 118 },
        { y: 452, h: 170 },
        { y: 712, h: 170 },
      ];
      const xs = [330, 565, 800, 1035, 1270];
      const slots = [];
      rows.forEach((r) => xs.forEach((x) => slots.push({ x, y: r.y, h: r.h })));
      const usable = Cook.shuffle(slots.filter((s) => !(s.y === 712 && s.x === 800)));
      const items = {};
      all.forEach((id, i) => {
        const slot = usable[i];
        const key = Cook.Art.wordTex(S, id);
        items[id] = S.prop(key, z.X(slot.x), z.Y(slot.y), z.L(170), z.L(slot.h));
        items[id].label = S.label(items[id], id);
      });
      const bs = S.fitScale("basket", z.L(330), z.L(200));
      const bx = z.X(800);
      const by = z.Y(902);
      const basket = S.track(S.add.image(bx, by, "basket").setOrigin(0.5, 1).setScale(bs).setDepth(D.front));
      const front = S.track(S.add.image(bx, by, "basket-front").setOrigin(0.5, 1).setScale(bs).setDepth(D.front + 2));
      if (k.special) {
        S.special(basket);
        front.setTint(0xffe2a0);
      }
      const bw = basket.displayWidth;
      const bh = basket.displayHeight;
      const spots = [[-0.2, 0.34], [0.12, 0.3], [-0.02, 0.4], [0.26, 0.4], [-0.3, 0.44], [0.08, 0.46], [0.3, 0.3], [-0.12, 0.28]].map(([dx, dy]) => ({
        x: bx + dx * bw,
        y: by - bh + dy * bh + z.L(40),
      }));
      const ask = (id, first) => Lang.line(Lang.orderFrame(first ? 0 : 1), Lang.phrase([id]));
      if (ctx.guided && askLines) await z.say(Lang.join(need.map((id, i) => ask(id, i === 0))));
      const remaining = need.slice();
      let n = 0;
      while (remaining.length) {
        const expected = remaining[0];
        const guided = ctx.guided || Cook.wordStage(expected) === 1;
        Cook.markSeen(expected);
        const r = await S.step({
          items,
          expected,
          word: expected,
          guided,
          sayLine: ask(expected, n === 0),
          allowAny: (key) => remaining.includes(key),
          onWrong: (key, m) => {
            z.listen(false, `fetched ${key}`);
            if (m === 1) z.oops();
          },
          io: z.io,
        });
        const id = r.key;
        remaining.splice(remaining.indexOf(id), 1);
        if (!guided) Cook.markRight(id);
        if (ctx.tickItem) ctx.tickItem(id);
        const obj = items[id];
        delete items[id];
        Cook.sfx.right();
        const spot = spots[n % spots.length];
        z.progress({ fetched: id });
        await S.fly(obj, spot.x, spot.y + z.L(60), { scale: S.fitScale(obj.texture.key, z.L(120), z.L(105)), depth: D.front + 1, duration: k.flyMs });
        n++;
        ctx.basket.push(id);
      }
    },
  });

  Mech.lab("fetch", {
    name: "Pantry",
    verb: "Fetch",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.chai.make("nana");
      L.card(d, ["Pantry"]);
      await L.station("fetch", { need: R.chai.need(d) });
    },
  });
})(window);
