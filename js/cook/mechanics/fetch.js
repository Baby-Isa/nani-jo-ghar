/*
 * Mechanic: fetch (the pantry). Tap the named items into the basket, in
 * any order, among look-alike decoys. Kutchi: the nouns and counts.
 * Every item the order could have asked for is on the shelf every time
 * (milk whether or not they want it, the "no X" item too), so what you
 * fetch comes from what they said, never from what's there. Nani may ask
 * "pass me…" here too, but only for things that aren't in this order.
 * Params: need, askLines, passMe ("always": the lab tries it every time).
 * Knobs (data.mechanics.fetch): shelf, minDecoys, lookalikes, flyMs,
 * passMe (the chance she asks, in a real order), special.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /**
   * What this dish's order could ask for but doesn't always: the options
   * in its `need` ({"if", "then"}, "$slot" picks) and the order's "no X"
   * rows. They always go on the shelf.
   */
  function optional(ctx) {
    const out = new Set();
    const dish = ctx.order && ctx.order.dishes && ctx.order.dishes[ctx.dishAt || 0];
    const def = dish && Cook.data.recipes[dish.recipe];
    const words = Cook.data.words;
    const walk = (v, opt) => {
      if (v == null) return;
      if (typeof v === "string") {
        if (v[0] === "$") {
          const slot = ((def && def.slots) || {})[v.slice(1)] || {};
          [].concat(slot.pick || [], (slot.else || {}).pick || []).forEach((x) => walk(x, true));
        } else if (opt && words[v]) out.add(v);
        return;
      }
      if (Array.isArray(v)) return v.forEach((x) => walk(x, opt));
      if (typeof v === "object") ["then", "else"].forEach((key) => walk(v[key], true));
    };
    if (def) walk(def.need, false);
    const L = (ctx.ladders || [])[ctx.dishAt || 0];
    if (L && Cook.Order) Cook.Order.rows(L, { all: true }).forEach((r) => r.no && r.ids.forEach((id) => words[id] && out.add(id)));
    return [...out];
  }
  /** Every word in the current order (pass me in the pantry never asks for one). */
  function inOrder(ctx) {
    const out = new Set();
    (ctx.ladders || []).forEach((L) => Cook.Order.rows(L, { all: true }).forEach((r) => r.ids.forEach((id) => out.add(id))));
    return out;
  }

  Mech.define("fetch", {
    station: "fetch",
    view: "pantry",
    footprint: { x: 220, y: 60, w: 1160, h: 845 },
    async run(z, { need, askLines = true, passMe }, k) {
      const S = z.S;
      const ctx = z.ctx;
      // always on the shelf: what they could have asked for (the "no X" item too)
      const always = optional(ctx).filter((id) => !need.includes(id));
      // then decoys: look-alikes of what's needed first, then others
      const decoys = [...new Set(always.concat(need.flatMap((id) => St.lookalikes(id, k.lookalikes)), Cook.shuffle(Cook.data.pantry_decoys)))]
        .filter((d) => !need.includes(d))
        .slice(0, Math.max(k.minDecoys, always.length, k.shelf - need.length));
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
      const all = Cook.shuffle(need.concat(decoys)).slice(0, usable.length);
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
      // "pass me" in the pantry: something on the shelf that isn't in this order
      const pantryPassMe = async () => {
        const force = passMe === "always";
        if (!force && (ctx.guided || ctx.lab || !ctx.maybePassMe || (ctx.interrupts || 0) >= (ctx.maxInterrupts || 0) || Math.random() > k.passMe)) return;
        const said = inOrder(ctx);
        const pick = Cook.shuffle(Object.keys(items)).find((id) => !remaining.includes(id) && !said.has(id) && !always.includes(id));
        if (!pick) return;
        ctx.interrupts = (ctx.interrupts || 0) + 1;
        await St.passMe(S, ctx, { want: pick });
        // she takes it off the shelf
        const obj = items[pick];
        if (obj && obj.active) {
          delete items[pick];
          await S.fly(obj, z.X(1560), z.Y(60), { scale: obj.scale * 0.5, duration: 420, arc: z.L(80) });
          obj.destroy();
        }
      };
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
            z.listen(false, always.includes(key) && !need.includes(key) && inOrder(ctx).has(key) ? `fetched ${key} (they said no)` : `fetched ${key}`);
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
        if (n === 1 && remaining.length) await pantryPassMe();
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
      await L.station("fetch", { need: R.chai.need(d), passMe: "always" });
    },
  });
})(window);
