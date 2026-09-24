/*
 * Cook with Nani: recipes (Phase A).
 *
 * A recipe turns a customer's tastes into a dish with variable slots
 * (what, how many, which order, leave-it-out), says it as the order, and
 * runs a list of stations with those slots as settings. Principle: nothing
 * the player does is decided by memory of a fixed recipe; every choice
 * comes from something said in Kutchi (or its English placeholder) and it
 * changes from order to order.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const UI = Cook.UI;
  const St = Cook.Stations;
  const R = (Cook.Recipes = {});
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const taste = (who, recipe) => ((Cook.data.customers[who] || {}).tastes || {})[recipe] || {};
  const first = (i, parts) => Lang.line(i === 0 ? "need" : "and", Lang.phrase(parts));
  const seqLines = (ids) => ids.map((id) => Lang.line("and", Lang.phrase([id])));

  /* ---------------- chai ---------------- */
  R.chai = {
    make(who, { usual } = {}) {
      const t = taste(who, "chai");
      const d = { recipe: "chai" };
      if (usual && t.khun != null) Object.assign(d, { khun: t.khun, dudh: t.dudh !== false, extra: t.extra || null, cups: 1, usual: true });
      else
        Object.assign(d, {
          khun: Math.random() < 0.15 ? 0 : rand(1, 3),
          dudh: Math.random() < 0.75,
          extra: Cook.pick([null, null, "spi-10", "veg-14"]),
          cups: Math.random() < 0.25 ? 2 : 1,
        });
      return d;
    },
    lines(d, i) {
      const out = [first(i, d.cups > 1 ? [d.cups, "cook-chai"] : ["cook-chai"])];
      if (d.usual) return out;
      if (!d.dudh) out.push(Lang.line("no", Lang.phrase(["cook-dudh"])));
      out.push(d.khun ? Lang.line("and", Lang.phrase([d.khun, "cook-khun"])) : Lang.line("no", Lang.phrase(["cook-khun"])));
      if (d.extra) out.push(Lang.line("and", Lang.phrase([d.extra])));
      return out;
    },
    need(d) {
      return ["cook-chai"].concat(d.dudh ? ["cook-dudh"] : [], d.khun ? ["cook-khun"] : [], d.extra ? [d.extra] : []);
    },
    steps: (d) => ["Pantry", "Water", "Tea", "Boil"].concat(d.dudh ? ["Milk"] : [], d.extra ? ["Extra"] : [], d.khun ? ["Sugar"] : [], ["Pour"]),
    async run(S, ctx, d) {
      await St.fetch(S, ctx, { need: R.chai.need(d) });
      await ctx.maybePassMe();
      await St.begin(S, ctx, "pour", "hob");
      const pan = St.vessel(S, "pan", St.BURNER.left.x, St.BURNER.left.y - 30, 1.35);
      const machine = Cook.hasUpgrade("machine");
      if (machine) S.special(pan);
      // everything in the basket goes on the counter, plus look-alikes, so
      // the player has to know which is which
      const onCounter = [...new Set(ctx.basket.concat(["cook-khun", "spi-16", "cook-chai", "spi-02", "spi-10", "veg-14"]))].filter((id) => id !== "cook-dudh" && id !== "cook-paani");
      const items = {};
      St.row(onCounter.length, { x0: 150, x1: 1100 }).forEach((p, i) => (items[onCounter[i]] = S.ingredient(onCounter[i], p.x, p.y - 20, { w: 150, h: 115 })));
      // 1. water to the line
      await St.pourInto(S, ctx, { vessel: pan, liquid: "cook-paani", color: 0x9fd3f0, target: [0.42, 0.58], jugAt: { x: 1300, y: St.STRIP_Y } });
      ctx.nextStep("Tea");
      // 2. tea leaves (from the look-alikes)
      await St.add(S, ctx, { items, expected: "cook-chai", into: pan });
      pan.setLiquid(pan.level, 0x6b3a1c);
      // 3. boil watch
      ctx.nextStep("Boil");
      if (machine) {
        await Cook.wait(700);
        ctx.skill(100, "boil");
      } else await St.boil(S, ctx, { vessel: pan });
      // 4. milk, only if they asked
      if (d.dudh) {
        ctx.nextStep("Milk");
        await St.pourInto(S, ctx, { vessel: pan, liquid: "cook-dudh", color: 0xc49468, from: pan.level, target: [0.74, 0.9], jugAt: { x: 1470, y: St.STRIP_Y }, speak: false });
      }
      // 5. the extra
      if (d.extra) {
        ctx.nextStep("Extra");
        await St.add(S, ctx, { items, expected: d.extra, into: pan });
      }
      // 6. sugar: count the spoons they said
      if (d.khun) {
        ctx.nextStep("Sugar");
        await St.countIn(S, ctx, { bowl: items["cook-khun"], n: d.khun, into: pan, word: "cook-khun" });
      }
      // 7. pour into the cups
      ctx.nextStep("Pour");
      for (let c = 0; c < d.cups; c++) {
        const cup = St.vessel(S, "cup", 1180 + c * 170, 420, 1.2);
        if (machine) {
          await Cook.wait(500);
          cup.setLiquid(0.82, d.dudh ? 0xc49468 : 0x7a3a1a);
          ctx.skill(100, "pour");
        } else {
          const v = await S.pour(pan, {
            rate: 0.35,
            lo: 0.72,
            hi: 0.9,
            onLevel: (lv) => cup.setLiquid(lv, d.dudh ? 0xc49468 : 0x7a3a1a),
            onStart: () => cup.drawTarget(0.72, 0.9),
          });
          cup.clearTarget();
          const sc = v > 1 ? 45 : S.bandScore(v, 0.72, 0.9);
          ctx.skill(sc, "pour");
          S.verdict(cup.rim.x, cup.rim.y - 90, sc, { bad: v < 0.72 ? "Too little" : "Too much!" });
        }
        S.steam(cup.rim.x, cup.rim.y - 30, 2);
      }
      ctx.result.chai = { dudh: ctx.basket.includes("cook-dudh"), khun: d.khun, extra: d.extra, cups: d.cups };
      ctx.served.push({ recipe: "chai", key: d.dudh ? "glass-chai" : "glass-chai", count: d.cups });
      await Cook.wait(600);
    },
  };

  /* ---------------- maani ---------------- */
  R.maani = {
    make() {
      return { recipe: "maani", count: rand(1, 4) };
    },
    lines(d, i) {
      return [first(i, d.count > 1 ? [d.count, "cook-maani"] : ["cook-maani"])];
    },
    need: () => ["cook-atto"],
    steps: () => ["Knead", "Roll", "Tawa"],
    async run(S, ctx, d) {
      await St.knead(S, ctx);
      const n = await St.roll(S, ctx, { count: d.count });
      await St.flip(S, ctx, { n });
      ctx.served.push({ recipe: "maani", key: "chapati-puffed", count: n });
    },
  };

  /* ---------------- daal ---------------- */
  const TADKA = ["spi-02", "spi-05", "veg-13", "veg-12", "spi-01"];
  R.daal = {
    make() {
      const tadka = Cook.shuffle(TADKA).slice(0, rand(2, 3));
      return { recipe: "daal", tameto: Math.random() < 0.4, onions: rand(1, 2), tomatoes: rand(1, 2), tadka, laps: rand(2, 4), speed: Cook.pick([null, "slow", "quick"]) };
    },
    lines(d, i) {
      const out = [first(i, ["cook-daal"])];
      if (d.tameto) out.push(Lang.line("and", Lang.phrase(["veg-03"])));
      return out;
    },
    need: () => ["cook-daal"],
    steps: (d) => ["Chop", "Tadka", "Stir"],
    async run(S, ctx, d) {
      const targets = { "veg-02": d.onions };
      if (d.tameto) targets["veg-03"] = d.tomatoes;
      await St.chop(S, ctx, { targets, pool: ["veg-02", "veg-03", "veg-13", "veg-12", "veg-01"] });
      await ctx.maybePassMe();
      await St.tadka(S, ctx, { order: d.tadka });
      await St.stir(S, ctx, { laps: d.laps, speed: d.speed });
      ctx.served.push({ recipe: "daal", key: "pot-daal", count: 1 });
    },
  };

  /* ---------------- chaat bowl ---------------- */
  const TOPPINGS = ["ph-dahi", "ph-amli", "ph-lili", "veg-02", "ph-sev", "ph-dhana", "veg-12", "veg-03"];
  R.chaat = {
    make(who) {
      const t = taste(who, "chaat");
      const no = (t.no || []).slice();
      if (!no.length && Math.random() < 0.5) no.push(Cook.pick(["veg-02", "veg-12", "ph-lili"]));
      const opts = Cook.shuffle(TOPPINGS.filter((x) => !no.includes(x)));
      let seq = ["ph-chana", "veg-01"].concat(opts.slice(0, rand(2, 3)));
      if (t.top && !seq.includes(t.top)) seq.push(t.top);
      if (t.extra && !seq.includes(t.extra)) seq.push(t.extra);
      // chickpeas first, the rest in the customer's order
      seq = ["ph-chana"].concat(Cook.shuffle(seq.slice(1)));
      return { recipe: "chaat", seq, no, potatoes: rand(1, 2) };
    },
    lines(d, i) {
      const out = [first(i, ["ph-chaat"])];
      out.push(Lang.list(d.seq));
      d.no.forEach((x) => out.push(Lang.line("no", Lang.phrase([x]))));
      return out;
    },
    need: () => [],
    steps: () => ["Chop", "Build"],
    async run(S, ctx, d) {
      await St.chop(S, ctx, { targets: { "veg-01": d.potatoes }, pool: ["veg-01", "veg-02", "veg-03", "veg-13"] });
      await ctx.maybePassMe();
      const pool = Cook.shuffle(TOPPINGS.filter((x) => !d.seq.includes(x) && !d.no.includes(x))).slice(0, 1);
      await St.assemble(S, ctx, { sequence: d.seq, exclude: d.no, pool });
      ctx.served.push({ recipe: "chaat", key: "layer", count: 1, seq: d.seq });
    },
  };

  /* ---------------- samosa ---------------- */
  const FILLINGS = ["ph-keema", "veg-01", "veg-10", "veg-02", "veg-12", "ph-dhana"];
  R.samosa = {
    make(who) {
      const t = taste(who, "samosa");
      const no = (t.no || []).slice();
      const main = t.filling || Cook.pick(["ph-keema", "veg-01"]);
      const extras = Cook.shuffle(FILLINGS.filter((x) => x !== main && !no.includes(x) && x !== "ph-keema" && x !== "veg-01")).slice(0, 2);
      return { recipe: "samosa", count: rand(1, 2), fillings: [main].concat(extras), no };
    },
    lines(d, i) {
      const out = [first(i, d.count > 1 ? [d.count, "ph-samosa"] : ["ph-samosa"])];
      out.push(Lang.list(d.fillings));
      d.no.forEach((x) => out.push(Lang.line("no", Lang.phrase([x]))));
      return out;
    },
    need: () => ["cook-atto"],
    steps: (d) => ["Fill", "Fold", "Fry"],
    async run(S, ctx, d) {
      const pool = FILLINGS.filter((x) => !d.fillings.includes(x) && !d.no.includes(x)).slice(0, 1);
      for (let k = 0; k < d.count; k++) {
        await St.fillFold(S, ctx, { fillings: d.fillings, exclude: d.no, pool, index: k, total: d.count });
      }
      await ctx.maybePassMe();
      await St.fry(S, ctx, { kind: "samosa", count: d.count });
      ctx.served.push({ recipe: "samosa", key: "samosa", count: d.count });
    },
  };

  /* ---------------- mishkaki ---------------- */
  const SKEWER = ["ph-meat", "veg-02", "ph-pepper", "veg-03"];
  R.mishkaki = {
    make(who, { usual } = {}) {
      const t = taste(who, "mishkaki");
      let seq = t.pattern && (usual || Math.random() < 0.5) ? t.pattern.slice() : ["ph-meat"].concat(Array.from({ length: 3 }, () => Cook.pick(SKEWER)));
      return { recipe: "mishkaki", seq, chips: Math.random() < 0.6 };
    },
    lines(d, i) {
      const out = [first(i, ["ph-mishkaki"])];
      out.push(Lang.list(d.seq));
      if (d.chips) out.push(Lang.line("and", Lang.phrase(["ph-chips"])));
      return out;
    },
    need: () => [],
    steps: (d) => ["Skewer", "Grill"].concat(d.chips ? ["Chips"] : []),
    async run(S, ctx, d) {
      await St.thread(S, ctx, { sequence: d.seq, pool: SKEWER });
      await St.grill(S, ctx, { skewer: d.seq });
      if (d.chips) {
        await ctx.maybePassMe();
        await St.fry(S, ctx, { kind: "chips", count: 1 });
      }
      ctx.served.push({ recipe: "mishkaki", key: "mishkaki", count: 1, seq: d.seq });
    },
  };

  R.dishWord = (recipe) => Cook.data.recipes[recipe].name;
})(window);
