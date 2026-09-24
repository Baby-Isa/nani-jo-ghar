/*
 * Mechanics: fill and fold (samosa; later dahi puri, dabeli…).
 *  fill: the fillings the customer named, in any order, onto the pastry;
 *        "no X" items are traps. Kutchi: the nouns, "no chilli".
 *  fold: swipe along each dashed line. Hands only.
 * St.fillFold(S, ctx, params) is the Phase A samosa station: fill, then
 * fold, on one view.
 * Knobs: fill {decoys, decoyPick}; fold {folds, minLen, minDot}.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("fill", {
    station: (p) => (p.index > 0 ? "fold" : "fill"),
    view: "marble",
    async run(z, { fillings, exclude = [], pool, decoyPool, index = 0, sheet }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const flat = fillings.flat();
      if (!pool) pool = St.decoys(decoyPool, flat.concat(exclude), k.decoys, k.decoyPick);
      sheet = sheet || S.track(S.add.image(z.X(800), z.Y(330), S.tex("pastry:0")).setScale(1.1 * z.k).setDepth(D.item));
      const ids = Cook.shuffle([...new Set(pool.concat(flat, exclude))]);
      const size = ids.length > 5 ? { w: 190, h: 140 } : { w: 165, h: 124 };
      const items = St.ingredients(z, ids, Object.assign({ x0: 260, x1: 1340, maxPerRow: 5, dy: -30 }, size));
      const blobs = [];
      // fillings go in in any order: one group
      await St.inOrder(z, {
        items,
        series: Array.isArray(fillings[0]) ? fillings : [flat],
        onWrong: (key, m) => {
          z.listen(false, exclude.includes(key) ? `put ${key} in (they said no)` : `put ${key} in`);
          if (exclude.includes(key)) z.say(Lang.line("no", Lang.phrase([key])), { ms: 1100 }).catch(() => {});
          else if (m === 1) z.oops();
        },
        onPick: async (id, r, n) => {
          if (!ctx.guided) Cook.markRight(id);
          if (ctx.tickItem && index === 0) ctx.tickItem(id);
          const obj = items[id];
          const blob = S.track(S.add.image(obj.x, obj.y, S.tex(`layer:${id}`)).setScale(0.3 * z.k).setDepth(D.fx));
          await S.fly(blob, z.X(800 + (n % 2 ? 20 : -20)), z.Y(360 - n * 6), { scale: 0.34 * z.k, duration: 380, arc: z.L(120) });
          blob.setDepth(D.item + 1);
          blobs.push(blob);
          obj.setAlpha(0.5);
          z.progress({ filled: id });
        },
      });
      ctx.result.fillings = flat.slice();
      return { sheet, items, blobs };
    },
  });

  // the three folds of a samosa, in design coords
  const FOLDS = [
    [[640, 470], [860, 210]],
    [[960, 470], [740, 210]],
    [[630, 430], [970, 430]],
  ];
  Mech.define("fold", {
    station: "fold",
    view: "marble",
    async run(z, { sheet, items = {}, blobs = [] }, k) {
      const S = z.S;
      sheet = sheet || S.track(S.add.image(z.X(800), z.Y(330), S.tex("pastry:0")).setScale(1.1 * z.k).setDepth(D.item));
      UI.gist(Cook.data.stations.fold.goal);
      Object.values(items).forEach((o) => {
        o.setVisible(false);
        if (o.label) o.label.setVisible(false);
      });
      const folds = FOLDS.slice(0, k.folds);
      const g = S.track(S.add.graphics().setDepth(D.fx));
      for (let f = 0; f < folds.length; f++) {
        const [[x1, y1], [x2, y2]] = folds[f].map(([x, y]) => [z.X(x), z.Y(y)]);
        g.clear();
        for (let t = 0; t < 1; t += 0.06) {
          g.lineStyle(z.L(7), 0x3a2410, 0.75);
          g.lineBetween(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, x1 + (x2 - x1) * (t + 0.03), y1 + (y2 - y1) * (t + 0.03));
        }
        g.fillStyle(0xb24a3a, 1);
        g.fillCircle(x1, y1, z.L(12));
        const gh = S.ghost([[x1, y1], [x2, y2]], { duration: 700, delay: z.guided || f === 0 ? 200 : 4000 });
        await new Promise((resolve) => {
          let start = null;
          const offs = [];
          const down = (p) => (start = { x: p.worldX, y: p.worldY });
          const up = (p) => {
            if (!start) return;
            const dx = p.worldX - start.x;
            const dy = p.worldY - start.y;
            const len = Math.hypot(dx, dy);
            const want = Math.hypot(x2 - x1, y2 - y1);
            const dot = (dx * (x2 - x1) + dy * (y2 - y1)) / (len * want || 1);
            start = null;
            if (len > want * k.minLen && dot > k.minDot) {
              offs.forEach((o) => o());
              z.expect(null);
              resolve();
            } else Cook.sfx.soft();
          };
          offs.push(z.on("pointerdown", down), z.on("pointerup", up));
          z.expect({ kind: "swipe", x1, y1, x2, y2 });
        });
        gh.stop();
        Cook.sfx.flip();
        sheet.setTexture(S.tex(`pastry:${f + 1}`));
        S.tweens.add({ targets: sheet, scaleX: 1.02 * z.k, duration: 90, yoyo: true });
        z.progress((f + 1) / folds.length);
      }
      g.destroy();
      blobs.forEach((o) => o.setVisible(false));
      S.sparkle(z.X(800), z.Y(330));
      z.skill(100, "fold");
      await Cook.wait(400);
      return sheet;
    },
  });

  /** The samosa station: fill, then fold, on one view (Phase A). */
  St.fillFold = async function (S, ctx, params = {}, opts = {}) {
    const { index = 0, total = 1 } = params;
    await St.begin(S, ctx, index === 0 ? "fill" : "fold", "marble");
    if (index > 0) UI.gist(`Samosa ${index + 1} of ${total}`);
    const z = opts.zone || Mech.zone(S, ctx, { id: "fillFold", level: opts.level || params.level || ctx.level, region: opts.region });
    const made = await Mech.run("fill", z, params);
    await Mech.run("fold", z, Object.assign({ level: params.level }, made));
    if (!opts.zone) z.close();
    St.end();
  };

  Mech.lab("fill", {
    name: "Samosa",
    verb: "Fill and fold",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.samosa.make(Cook.pick(["nana", "ma", "cousin"]));
      L.card(d, ["Fill", "Fold"]);
      await St.fillFold(L.S, L.ctx, { fillings: d.fillings, exclude: d.no, pool: ["veg-10"].filter((x) => !d.fillings.includes(x)), index: 0, total: 1, level: L.level }, { region: L.region });
    },
  });
})(window);
