/*
 * Cook with Nani: the recipe stations (pantry, chai, maani, daal) and
 * serving. Each takes the scene S and an order context, runs its gestures,
 * and records grades into ctx.grades:
 *   {label, score, kind: "skill" | "listen" | "order"}
 * "listen" grades are the Kutchi test (did you fetch/add/count what was
 * asked?), "order" grades are recipe memory (right step, right time),
 * "skill" grades are the hands (pour to the line, flip on time).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const D = Cook.D;
  const R = (Cook.R = {});

  const nani = (line, opts) => UI.say(line, { badge: true }, opts);
  const oops = () => nani(UI.line("oops"), { ms: 900 });

  function grade(ctx, label, score, kind = "skill") {
    ctx.grades.push({ label, score: Math.round(score), kind });
  }

  /* ---------------- pantry fetch (listening: nouns) ---------------- */
  R.pantry = async function (S, ctx, need) {
    await S.setView("pantry");
    UI.setRecipe(ctx.dishTitle, "pantry", need.length);
    const guidedAll = ctx.guided;
    const decoys = Cook.shuffle(Cook.data.pantry_decoys.filter((d) => !need.includes(d))).slice(0, Math.max(4, 11 - need.length));
    const all = Cook.shuffle(need.concat(decoys));
    const rows = [
      { y: 196, h: 120 },
      { y: 452, h: 190 },
      { y: 712, h: 190 },
    ];
    const xs = [330, 565, 800, 1035, 1270];
    const slots = [];
    rows.forEach((r, ri) => xs.forEach((x) => slots.push({ x: x + (ri === 0 ? 0 : 0), y: r.y, h: r.h })));
    // keep the middle of the bottom row clear for the basket
    const usable = slots.filter((s, i) => !(s.y === 712 && (s.x === 800)));
    const items = {};
    Cook.shuffle(usable)
      .slice(0, all.length)
      .forEach((slot, i) => {
        const id = all[i];
        const img = Cook.word(id).image;
        items[id] = S.prop(img, slot.x, slot.y, 175, slot.h);
      });

    // the basket: back, items, front rim (a carried container, bottom centre)
    const bs = S.fitScale("basket", 330, 200);
    const basket = S.track(S.add.image(800, 902, "basket").setOrigin(0.5, 1).setScale(bs).setDepth(D.front));
    const front = S.track(S.add.image(800, 902, "basket-front").setOrigin(0.5, 1).setScale(bs).setDepth(D.front + 2));
    const fastBasket = Cook.hasUpgrade("basket");
    if (fastBasket) {
      S.special(basket);
      front.setTint(0xffe2a0);
    }
    const bw = basket.displayWidth;
    const bh = basket.displayHeight;
    const spots = [
      [-0.2, 0.34], [0.12, 0.3], [-0.02, 0.4], [0.26, 0.4], [-0.3, 0.44], [0.08, 0.46], [0.3, 0.3], [-0.12, 0.28],
    ].map(([dx, dy]) => ({ x: 800 + dx * bw, y: 902 - bh + dy * bh + 40 }));

    const remaining = need.slice();
    let misses = 0;
    let n = 0;
    // Guided (first time for this recipe, or a brand-new word): Nani asks
    // for each thing using the fruit errand's frame.
    const askLine = (id, first) => (first ? UI.line("need", UI.phrase([id])) : UI.line("and", UI.phrase([id])));
    if (guidedAll) {
      await nani(UI.join(need.map((id, i) => askLine(id, i === 0))));
    }
    while (remaining.length) {
      const expected = remaining[0];
      const guided = guidedAll || Cook.wordStage(expected) === 1;
      Cook.markSeen(expected);
      const r = await S.step({
        items,
        expected,
        word: expected,
        guided,
        sayWord: () => nani(askLine(expected, n === 0)),
        allowAny: (k) => remaining.includes(k),
        onWrong: () => {
          misses++;
          if (misses === 1 || misses % 3 === 0) oops();
        },
      });
      const id = r.key;
      remaining.splice(remaining.indexOf(id), 1);
      if (!guided) Cook.markRight(id);
      const obj = items[id];
      delete items[id];
      Cook.sfx.right();
      const spot = spots[n % spots.length];
      const s = S.fitScale(obj.texture.key, 120, 105);
      await S.fly(obj, spot.x, spot.y + 60, { scale: s, depth: D.front + 1, duration: fastBasket ? 260 : 520 });
      n++;
      UI.recipeProgress(n);
      ctx.basket.push(id);
    }
    grade(ctx, "pantry", 100 - misses * 12, "listen");
    UI.hideBubble();
    await Cook.wait(350);
  };

  /* ---------------- shared stove helpers ---------------- */
  function counterRow(S, ids, extra = {}) {
    const n = ids.length;
    const x0 = 800 - ((n - 1) * 195) / 2;
    const items = {};
    Cook.shuffle(ids).forEach((id, i) => {
      const key = extra[id] || Cook.word(id).image;
      items[id] = S.prop(key, x0 + i * 195, 778, 165, 150);
    });
    if (items["cook-paani"] && Cook.hasUpgrade("jug")) S.special(items["cook-paani"]);
    return items;
  }

  /** Wait for `expected` among the counter items, with Nani's word hints. */
  async function waitFor(S, ctx, items, expected, { guided, say, allowAny } = {}) {
    const g = guided != null ? guided : ctx.guided;
    const line = say || (Cook.data.words[expected] ? UI.wordLine(expected) : null);
    if (Cook.data.words[expected]) Cook.markSeen(expected);
    const r = await S.step({
      items,
      expected,
      word: Cook.data.words[expected] ? expected : null,
      guided: g,
      sayWord: line ? () => nani(line) : null,
      allowAny,
      onWrong: (k, m) => {
        ctx.orderMisses++;
        if (m === 1) oops();
      },
    });
    if (!g && Cook.data.words[expected] && r.misses === 0) Cook.markRight(expected);
    if (r.misses) Cook.markMiss(expected);
    return r;
  }

  /* ---------------- chai ---------------- */
  R.chai = async function (S, ctx, dish) {
    await S.setView("stove");
    const machine = Cook.hasUpgrade("machine");
    const autoJug = Cook.hasUpgrade("jug");
    const want = { khun: dish.khun || 1, elchi: !!dish.elchi };
    const ids = ["cook-paani", "cook-chai", "cook-dudh", "cook-khun"].concat(ctx.basket.includes("spi-10") && want.elchi ? ["spi-10"] : []);
    UI.setRecipe(UI.phrase(["cook-chai"]).k, ctx.guided ? "Nani shows you" : "from memory", 6);
    const items = counterRow(S, ids);
    let stepN = 0;
    const next = () => UI.recipeProgress(++stepN);

    let pan;
    if (machine) {
      pan = S.prop("chai-machine", 470, 520, 300, 360, { depth: D.item });
    } else {
      pan = S.track(S.add.image(470, 330, "saucepan").setOrigin(0.36, 0.5).setScale(1.19).setDepth(D.item));
      pan.baseScale = 1.19;
    }
    const liq = machine ? { set() {}, surface: () => ({ x: 470, y: 250 }), level: 0 } : S.liquid(pan, "saucepan");
    const gx = 800;
    const gy = 590;

    // 1. water: hold the jug to pour, let go at the line
    await waitFor(S, ctx, items, "cook-paani");
    let g = S.gauge(gx, gy, 300, 0.42, 0.6, 0x7cc4e8);
    const jug = items["cook-paani"];
    const wv = await S.pour(jug, { gauge: g, rate: 0.3, auto: autoJug, lift: { x: 640, y: 250 }, onLevel: (v) => liq.set(v * 0.9, 0xbfe3f2, 0.8) });
    const s1 = S.bandScore(wv, 0.42, 0.6);
    S.gradeText(gx, gy - 340, s1);
    grade(ctx, "water", s1);
    next();
    await Cook.wait(400);
    g.destroy();

    // 2. tea leaves
    await waitFor(S, ctx, items, "cook-chai");
    Cook.sfx.pop();
    const sp = liq.surface();
    const tin = items["cook-chai"];
    const tinHome = { x: tin.x, y: tin.y };
    await S.fly(tin, sp.x + 40, sp.y - 60, { duration: 380, arc: 80 });
    S.burst(sp.x, sp.y, [0x3b2413, 0x5a3418], 14, 60);
    liq.set(Math.max(0.3, wv * 0.9), 0x6b3a1c, 0.9);
    await S.fly(tin, tinHome.x, tinHome.y, { duration: 300, arc: 40 });
    next();

    // 3. boil watch: tap the knob (or the pan) before it boils over
    const flame = S.flame(490, 390, 170);
    S.loops.push({ stop: flame.stop });
    if (machine) {
      await Cook.wait(900);
      S.steam(470, 250, 4);
      grade(ctx, "boil", 100);
    } else {
      const boil = Cook.sfx.boilLoop();
      S.loops.push(boil);
      g = S.gauge(gx, gy, 300, 0.66, 0.86, 0xb9d6e8);
      const knob = S.track(S.add.circle(712, 555, 46, 0xffffff, 0.001).setDepth(D.fx));
      if (ctx.guided) {
        UI.gist("When the foam reaches the green band, tap the knob!");
      }
      const bubbles = S.time.addEvent({
        delay: 140,
        loop: true,
        callback: () => {
          const p = liq.surface();
          const b = S.track(S.add.circle(p.x + (Math.random() - 0.5) * 220, p.y + (Math.random() - 0.5) * 60, 6 + Math.random() * 8, 0xfff2dc, 0.9).setDepth(D.item + 1));
          S.tweens.add({ targets: b, y: b.y - 20 - g.level * 60, alpha: 0, scale: 1 + g.level * 2, duration: 500, onComplete: () => b.destroy() });
          if (Math.random() < 0.4) Cook.sfx.bubble();
        },
      });
      if (ctx.guided) S.glow(knob, true);
      const bv = await S.timing(knob, { gauge: g, rate: 0.17, tapAnywhere: [pan] });
      bubbles.remove();
      boil.stop();
      S.glow(knob, false);
      UI.hideGist();
      let s3;
      if (bv >= 1) {
        // boils over: a harmless, funny foam spill
        for (let i = 0; i < 10; i++) {
          const f = S.track(S.add.ellipse(470 + (Math.random() - 0.5) * 300, 300, 60, 40, 0xfff6e6, 1).setDepth(D.item + 2));
          S.tweens.add({ targets: f, y: 430 + Math.random() * 60, scale: 1.6, duration: 700 });
        }
        oops();
        s3 = 45;
      } else {
        s3 = S.bandScore(bv, 0.66, 0.86);
        Cook.sfx.click();
      }
      S.gradeText(gx, gy - 340, s3);
      grade(ctx, "boil", s3);
      await Cook.wait(500);
      g.destroy();
    }
    next();

    // 4. milk
    await waitFor(S, ctx, items, "cook-dudh");
    g = S.gauge(gx, gy, 300, 0.76, 0.92, 0xc9a27a);
    g.set(0.5);
    const mv = await S.pour(items["cook-dudh"], {
      gauge: g,
      rate: 0.28,
      auto: autoJug,
      lift: { x: 650, y: 250 },
      onLevel: (v) => liq.set(Math.min(1, v), 0xc08a58, 0.95),
    });
    const s4 = S.bandScore(mv, 0.76, 0.92);
    S.gradeText(gx, gy - 340, s4);
    grade(ctx, "milk", s4);
    await Cook.wait(400);
    g.destroy();
    next();

    // 5. sugar (count what was asked) and elchi if ordered
    let elchiIn = false;
    const addElchi = async () => {
      elchiIn = true;
      const e = items["spi-10"];
      Cook.sfx.pop();
      const p = liq.surface();
      await S.fly(e, p.x - 30, p.y - 10, { duration: 400, scale: e.scale * 0.5 });
      S.burst(p.x, p.y, [0x9bbf6a, 0x6f8f4a], 8, 40);
      e.setVisible(false);
      if (!ctx.guided) Cook.markRight("spi-10");
    };
    // guided: Nani adds the extra things first, in order
    if (want.elchi && items["spi-10"] && ctx.guided) {
      await waitFor(S, ctx, items, "spi-10", { say: UI.line("and", UI.phrase(["spi-10"])) });
      await addElchi();
    }
    const khunSay = UI.line("and", UI.phrase([want.khun, "cook-khun"]));
    for (;;) {
      const r = await waitFor(S, ctx, items, "cook-khun", { say: khunSay, allowAny: (k) => k === "spi-10" && !elchiIn && want.elchi && !!items["spi-10"] });
      if (r.key === "spi-10") {
        await addElchi();
        continue;
      }
      break;
    }
    let count = 0;
    const sugar = items["cook-khun"];
    const glass = S.prop("glass", 1250, 622, 140, 170, { depth: D.item });
    const addSpoon = async () => {
      count++;
      Cook.sfx.pop();
      UI.count(count);
      const p = liq.surface();
      const spoon = S.track(S.add.circle(sugar.x, sugar.y - 120, 14, 0xffffff, 1).setDepth(D.fx));
      await S.fly(spoon, p.x + (Math.random() - 0.5) * 80, p.y, { duration: 380, arc: 90 });
      S.burst(p.x, p.y, 0xffffff, 6, 30);
      spoon.destroy();
    };
    await addSpoon();
    const guidedCount = ctx.guided;
    // more spoons, until the player taps the glass (or the done button)
    await new Promise((resolve) => {
      let finished = false;
      const end = () => {
        if (finished) return;
        finished = true;
        Cook.expect = null;
        S.untap(sugar);
        S.untap(glass);
        if (items["spi-10"]) S.untap(items["spi-10"]);
        UI.hideDone();
        resolve();
      };
      S.tappable(sugar, () => {
        if (count < 6) addSpoon().then(() => {
          if (guidedCount && count >= want.khun) S.glow(glass, true);
        });
      });
      if (items["spi-10"] && !elchiIn && want.elchi) S.tappable(items["spi-10"], () => addElchi());
      S.tappable(glass, end);
      if (guidedCount && count >= want.khun) S.glow(glass, true);
      if (guidedCount && count < want.khun) S.glow(sugar, true);
      UI.done().then(end);
      const gc = S.centre(glass);
      const sc = S.centre(sugar);
      Cook.expect = { kind: "count", x: sc.x, y: sc.y, target: want.khun, doneX: gc.x, doneY: gc.y, count: () => count };
    });
    S.glow(sugar, false);
    S.glow(glass, false);
    UI.hideCount();
    ctx.result.khun = count;
    ctx.result.elchi = elchiIn;
    next();

    // 6. pour into the glass
    const full = S.track(S.add.image(glass.x, glass.y, "glass-chai").setOrigin(0.5, 1).setScale(S.fitScale("glass-chai", 140, 170)).setDepth(D.item + 1));
    const fh = full.height;
    const fw = full.width;
    full.setCrop(0, fh, fw, 0);
    const setGlass = (v) => {
      const L = Cook.clamp(v, 0, 1);
      full.setCrop(0, fh * (1 - L), fw, fh * L);
    };
    if (machine) {
      Cook.sfx.pourLoop && (() => {
        const l = Cook.sfx.pourLoop();
        setTimeout(() => l.stop(), 900);
      })();
      await Cook.tween(S, { targets: { v: 0 }, v: 0.85, duration: 900, onUpdate: (tw, t) => setGlass(t.v) });
      grade(ctx, "pour", 100);
    } else {
      g = S.gauge(1480, gy, 300, 0.74, 0.92, 0xc08a58);
      if (ctx.guided) UI.gist("Hold the pan to pour. Let go at the green band.");
      const pv = await S.pour(pan, { gauge: g, rate: 0.32, auto: autoJug, lift: { x: 1150, y: 300 }, tiltTo: 35, onLevel: (v) => { setGlass(v); liq.set(Math.max(0.1, 1 - v * 0.8)); } });
      UI.hideGist();
      const s6 = S.bandScore(pv, 0.74, 0.92);
      S.gradeText(1300, 300, s6);
      grade(ctx, "pour", s6);
      await Cook.wait(400);
      g.destroy();
    }
    S.steam(glass.x, glass.y - 180, 3);
    Cook.sfx.right();
    next();
    await Cook.wait(700);
    ctx.served.push({ key: "glass-chai", recipe: "chai" });
  };

  /* ---------------- maani (chapati) ---------------- */
  R.maani = async function (S, ctx, dish) {
    const target = dish.count || 1;
    await S.setView("board");
    UI.setRecipe(UI.phrase(["cook-maani"]).k, ctx.guided ? "Nani shows you" : "from memory", 3);
    const bowl = S.prop("atto", 820, 640, 380, 280);
    if (Cook.hasUpgrade("mixer")) S.special(bowl);
    const jug = S.prop("water-jug", 1320, 800, 190, 230);
    if (Cook.hasUpgrade("jug")) S.special(jug);
    // water into the flour
    await waitFor(S, ctx, { "cook-paani": jug, "cook-atto": bowl }, "cook-paani");
    const home = { x: jug.x, y: jug.y, a: jug.angle };
    await Cook.tween(S, { targets: jug, x: 1000, y: 470, angle: -50, duration: 300 });
    const l = Cook.sfx.pourLoop();
    S.burst(840, 520, [0xbfe3f2, 0xffffff], 14, 60);
    await Cook.wait(700);
    l.stop();
    await Cook.tween(S, { targets: jug, x: home.x, y: home.y, angle: home.a, duration: 300 });

    // knead: tap or rub back and forth
    UI.hideBubble();
    if (ctx.guided) UI.gist("Knead! Tap the dough or rub it back and forth.");
    let dough = bowl;
    const need = 8;
    let strokes = 0;
    const ring = S.track(S.add.graphics().setDepth(D.fx));
    const drawRing = () => {
      ring.clear();
      ring.lineStyle(12, 0x7d9a78, 0.9);
      ring.beginPath();
      ring.arc(820, 520, 190, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * strokes) / need);
      ring.strokePath();
    };
    const knead = () => {
      strokes++;
      Cook.sfx.flip();
      if (strokes === 2) {
        dough.setTexture("dough-ball");
        dough.baseScale = S.fitScale("dough-ball", 300, 240);
        dough.setScale(dough.baseScale);
      }
      const bsc = dough.baseScale;
      S.tweens.add({ targets: dough, scaleX: bsc * 1.15, scaleY: bsc * 0.85, duration: 90, yoyo: true });
      S.burst(dough.x, dough.y - 80, [0xf4ead8, 0xffffff], 5, 50);
      drawRing();
    };
    if (Cook.hasUpgrade("mixer")) {
      UI.hideGist();
      for (let i = 0; i < need; i++) {
        knead();
        await Cook.wait(140);
      }
    } else {
      await new Promise((resolve) => {
        let lastX = null;
        let dir = 0;
        const done = () => {
          Cook.expect = null;
          S.input.off("pointermove", move);
          S.untap(dough);
          resolve();
        };
        const onStroke = () => {
          knead();
          if (strokes >= need) done();
        };
        const move = (p) => {
          if (!p.isDown) return (lastX = null);
          const c = S.centre(dough);
          if (Math.abs(p.worldX - c.x) > 320 || Math.abs(p.worldY - c.y) > 260) return;
          if (lastX == null) return (lastX = p.worldX);
          const dx = p.worldX - lastX;
          if (Math.abs(dx) > 70) {
            const d = Math.sign(dx);
            if (d !== dir) {
              dir = d;
              onStroke();
            }
            lastX = p.worldX;
          }
        };
        S.input.on("pointermove", move);
        S.tappable(dough, onStroke);
        const c = S.centre(dough);
        S.ghost([[c.x - 120, c.y], [c.x + 120, c.y], [c.x - 120, c.y]], { duration: 900, delay: ctx.guided ? 300 : 5000 });
        Cook.expect = { kind: "knead", x: c.x, y: c.y };
      });
    }
    UI.hideGist();
    ring.destroy();
    grade(ctx, "knead", 100);
    UI.recipeProgress(1);
    await Cook.wait(300);

    // roll one at a time; decide how many (the count is the Kutchi test)
    dough.setVisible(false);
    if (dough.shadow) dough.shadow.setVisible(false);
    S.tweens.add({ targets: [jug, jug.shadow].filter(Boolean), alpha: 0, duration: 250 });
    const rolled = [];
    const chakla = S.prop("chakla", 820, 800, 520, 330, { depth: D.item - 2 });
    const plateCount = S.track(S.add.text(0, 0, "", {}).setVisible(false));
    const spare = S.prop("dough-ball", 250, 800, 170, 140);
    const showSpare = (on) => {
      spare.setVisible(on);
      if (spare.shadow) spare.shadow.setVisible(on);
    };
    showSpare(false);
    const R0 = 150;
    let more = true;
    while (more) {
      const score = await rollOne(S, ctx, R0);
      rolled.push(score);
      UI.count(rolled.length);
      if (rolled.length >= 6) break;
      // another, or done?
      showSpare(true);
      if (ctx.guided) {
        if (rolled.length < target) S.glow(spare, true);
      }
      more = await new Promise((resolve) => {
        const finish = (v) => {
          Cook.expect = null;
          S.untap(spare);
          S.glow(spare, false);
          UI.hideDone();
          resolve(v);
        };
        S.tappable(spare, () => finish(true));
        UI.done({ glow: ctx.guided && rolled.length >= target }).then(() => finish(false));
        const c = S.centre(spare);
        Cook.expect = { kind: "more", x: c.x, y: c.y, target, count: () => rolled.length };
      });
      showSpare(false);
    }
    UI.hideCount();
    chakla.destroy();
    plateCount.destroy();
    ctx.result.maani = rolled.length;
    rolled.forEach((s, i) => grade(ctx, `roll ${i + 1}`, s));
    UI.recipeProgress(2);

    // tawa: flip when golden, press to puff
    await S.setView("stove");
    UI.setRecipe(UI.phrase(["cook-maani"]).k, ctx.guided ? "Nani shows you" : "from memory", 3);
    UI.recipeProgress(2);
    const tawaImg = S.prop("tawa", 1125, 470, 420, 260, { depth: D.item - 1 });
    if (Cook.hasUpgrade("tawa")) S.special(tawaImg);
    const flame = S.flame(1125, 400, 170);
    S.loops.push({ stop: flame.stop });
    const plate = S.prop("thali", 420, 800, 330, 180, { depth: D.item });
    const heavy = Cook.hasUpgrade("tawa");
    const band1 = heavy ? [0.5, 0.9] : [0.6, 0.82];
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);
    let stacked = 0;
    for (let i = 0; i < rolled.length; i++) {
      const ch = S.track(S.add.image(1125, 385, "chapati-raw").setScale(S.fitScale("chapati-raw", 300, 190)).setDepth(D.item + 1));
      ch.baseScale = ch.scale;
      if (ctx.guided && i === 0) UI.gist("Tap the maani to flip it when the bar reaches the green band.");
      let g = S.gauge(1480, 620, 300, band1[0], band1[1], 0xd9a05b);
      const v1 = await S.timing(ch, { gauge: g, rate: 0.24 * (1 + i * 0.08), onLevel: (v) => ch.setTint(Phaser.Display.Color.GetColor(255, 255 - v * 50, 255 - v * 90)) });
      Cook.sfx.flip();
      await Cook.tween(S, { targets: ch, scaleY: 0.02, duration: 110 });
      ch.setTexture("chapati-half").clearTint();
      ch.setScale(S.fitScale("chapati-half", 300, 190));
      ch.scaleY = 0.02;
      await Cook.tween(S, { targets: ch, scaleY: S.fitScale("chapati-half", 300, 190), duration: 110 });
      const a = v1 >= 1 ? 40 : S.bandScore(v1, band1[0], band1[1]);
      S.gradeText(1125, 250, a);
      g.destroy();
      if (ctx.guided && i === 0) UI.gist("Now tap it again when it's ready: it puffs up!");
      g = S.gauge(1480, 620, 300, band1[0], band1[1], 0xc07a3a);
      const v2 = await S.timing(ch, { gauge: g, rate: 0.26 * (1 + i * 0.08) });
      UI.hideGist();
      Cook.sfx.puff();
      ch.setTexture("chapati-puffed");
      const ps = S.fitScale("chapati-puffed", 300, 200);
      ch.setScale(ps * 0.8);
      await Cook.tween(S, { targets: ch, scale: ps * 1.12, duration: 220, ease: "Back.easeOut", yoyo: true });
      ch.setScale(ps);
      S.steam(1125, 300, 4);
      const b = v2 >= 1 ? 40 : S.bandScore(v2, band1[0], band1[1]);
      S.gradeText(1125, 250, b);
      grade(ctx, `tawa ${i + 1}`, (a + b) / 2);
      g.destroy();
      await Cook.wait(250);
      await S.fly(ch, 420, 700 - stacked * 12, { scale: S.fitScale("chapati-puffed", 230, 150), duration: 500 });
      stacked++;
    }
    sizzle.stop();
    UI.recipeProgress(3);
    Cook.sfx.right();
    await Cook.wait(600);
    ctx.served.push({ key: "chapati-puffed", recipe: "maani", count: rolled.length });
  };

  /** Roll one maani: drag outwards to grow it to the dashed circle. */
  function rollOne(S, ctx, R0) {
    return new Promise((resolve) => {
      const cx = 820;
      const cy = 610;
      let r = 60;
      const dough = S.track(S.add.image(cx, cy, "dough-ball").setDepth(D.item + 1));
      const setR = () => {
        if (r < 85) {
          dough.setTexture("dough-ball");
          dough.setScale((r * 2) / S.texSize("dough-ball").w);
        } else {
          dough.setTexture("chapati-raw");
          const t = S.texSize("chapati-raw");
          dough.setScale((r * 2) / t.w);
        }
      };
      setR();
      const guide = S.track(S.add.graphics().setDepth(D.fx));
      guide.lineStyle(6, 0xffffff, 0.9);
      for (let a = 0; a < 360; a += 12) {
        const a1 = Phaser.Math.DegToRad(a);
        const a2 = Phaser.Math.DegToRad(a + 6);
        guide.beginPath();
        guide.arc(cx, cy, R0, a1, a2);
        guide.strokePath();
      }
      // squash the guide into the same perspective as the chapati image
      guide.setScale(1, 0.66);
      guide.y = cy * (1 - 0.66);
      UI.hideBubble();
      const pin = S.track(S.add.image(cx + 40, cy + 90, "rolling-pin").setScale(0.69).setDepth(D.fx + 1).setAngle(-20));
      const goodPin = Cook.hasUpgrade("pin");
      if (goodPin) S.special(pin);
      if (ctx.guided) UI.gist("Roll it out: drag from the middle outwards until it fills the circle.");
      let last = null;
      let quiet = null;
      const done = () => {
        Cook.expect = null;
        S.input.off("pointermove", move);
        S.input.off("pointerdown", down);
        S.input.off("pointerup", up);
        clearTimeout(quiet);
        guide.destroy();
        pin.destroy();
        UI.hideGist();
        const score = S.bandScore(r / R0, 0.9, 1.12);
        S.gradeText(cx, cy - 170, score);
        Cook.sfx.right();
        S.tweens.add({ targets: dough, alpha: 0, duration: 250, delay: 250, onComplete: () => dough.destroy() });
        resolve(score);
      };
      const down = (p) => {
        last = { x: p.worldX, y: p.worldY };
        clearTimeout(quiet);
      };
      const move = (p) => {
        if (!p.isDown || !last) return;
        const dx = p.worldX - last.x;
        const dy = p.worldY - last.y;
        const d = Math.hypot(dx, dy);
        if (d < 4) return;
        last = { x: p.worldX, y: p.worldY };
        r = Math.min(goodPin ? R0 * 1.02 : R0 * 1.45, r + d * (goodPin ? 0.44 : 0.22));
        setR();
        pin.setPosition(p.worldX, p.worldY);
        Cook.gauge = { level: r / R0, lo: 0.9, hi: 1.12 };
        if (Math.random() < 0.15) Cook.sfx.flip();
      };
      const up = () => {
        last = null;
        clearTimeout(quiet);
        if (r >= R0 * 0.8) quiet = setTimeout(done, 700 / Cook.speed);
      };
      S.input.on("pointerdown", down);
      S.input.on("pointermove", move);
      S.input.on("pointerup", up);
      S.ghost([[cx, cy], [cx + R0 * 1.1, cy - 20]], { duration: 800, delay: ctx.guided ? 200 : 5000 });
      Cook.gauge = { level: r / R0, lo: 0.9, hi: 1.12 };
      Cook.expect = { kind: "roll", x: cx, y: cy, r: R0 };
    });
  }

  /* ---------------- chop (swipe across) ---------------- */
  async function chop(S, ctx, id, { whole, half, chopped }) {
    await S.setView("board");
    UI.hideBubble();
    const item = S.prop(whole, 820, 650, 330, 300);
    const cuts = Cook.hasUpgrade("knife") ? 2 : 4;
    const knife = S.track(S.add.image(1260, 430, Cook.hasUpgrade("knife") ? "knife-gold" : "knife").setScale(0.94).setAngle(-30).setDepth(D.fx));
    let made = 0;
    let other = null;
    const onCut = (x1, y1, x2, y2) => {
      made++;
      Cook.sfx.chop();
      Cook.sfx.whoosh();
      S.tweens.add({ targets: knife, x: { from: x1, to: x2 }, y: { from: y1, to: y2 }, duration: 160 });
      if (made === 1) {
        item.setTexture(half);
        item.setScale(S.fitScale(half, 300, 280));
        other = S.track(S.add.image(item.x + 60, item.y, half).setOrigin(0.5, 1).setScale(item.scale).setFlipX(true).setDepth(D.item));
        S.tweens.add({ targets: item, x: item.x - 70, duration: 200 });
        S.tweens.add({ targets: other, x: other.x + 90, duration: 200 });
      } else {
        S.burst(820, 560, id === "veg-03" ? [0xe23b2e, 0xff7a5c] : [0xf1d9e6, 0xffffff, 0xd9a3c1], 10, 90);
        [item, other].forEach((o) => o && S.tweens.add({ targets: o, scaleX: o.scaleX * 0.85, duration: 120 }));
      }
      if (made >= cuts) {
        if (other) other.destroy();
        item.setTexture(chopped);
        item.setScale(S.fitScale(chopped, 330, 260));
        item.x = 820;
        S.sparkle(820, 540);
        return true;
      }
      return false;
    };
    if (Cook.hasUpgrade("helper")) {
      const b = S.track(S.add.image(1330, 780, "cousin-badge").setScale(0.5).setDepth(D.top));
      S.tweens.add({ targets: b, y: 700, duration: 300, ease: "Back.easeOut" });
      for (let i = 0; i < cuts; i++) {
        await Cook.wait(260);
        onCut(820, 420, 820, 720);
      }
      b.destroy();
    } else {
      if (ctx.guided) UI.gist("Chop! Swipe across it with your finger.");
      await new Promise((resolve) => {
        let start = null;
        const down = (p) => (start = { x: p.worldX, y: p.worldY });
        const up = (p) => {
          if (!start) return;
          const x2 = p.worldX;
          const y2 = p.worldY;
          const len = Math.hypot(x2 - start.x, y2 - start.y);
          const b = item.getBounds();
          const crosses =
            len > 120 &&
            ((Math.min(start.x, x2) < b.centerX && Math.max(start.x, x2) > b.centerX) ||
              (Math.min(start.y, y2) < b.centerY && Math.max(start.y, y2) > b.centerY)) &&
            Phaser.Geom.Intersects.LineToRectangle(new Phaser.Geom.Line(start.x, start.y, x2, y2), b);
          const s = start;
          start = null;
          if (crosses && onCut(s.x, s.y, x2, y2)) {
            Cook.expect = null;
            S.input.off("pointerdown", down);
            S.input.off("pointerup", up);
            resolve();
          }
        };
        S.input.on("pointerdown", down);
        S.input.on("pointerup", up);
        const c = S.centre(item);
        S.ghost([[c.x - 240, c.y - 60], [c.x + 240, c.y + 10]], { duration: 600, delay: ctx.guided ? 200 : 5000 });
        Cook.expect = { kind: "swipe", x1: c.x - 260, y1: c.y - 40, x2: c.x + 260, y2: c.y + 20 };
      });
    }
    UI.hideGist();
    knife.destroy();
    grade(ctx, "chop", 100);
    await Cook.wait(500);
  }

  /* ---------------- daal ---------------- */
  R.daal = async function (S, ctx, dish, day) {
    UI.setRecipe(UI.phrase(["cook-daal"]).k, ctx.guided ? "Nani shows you" : "from memory", 6);
    await chop(S, ctx, "veg-02", { whole: "onion", half: "onion-half", chopped: "onion-chopped" });
    UI.recipeProgress(1);
    if (dish.tameto) {
      await chop(S, ctx, "veg-03", { whole: "tomato", half: "tomato-chopped", chopped: "tomato-chopped" });
    }
    await S.setView("stove");
    UI.recipeProgress(1);
    const tadkaList = (day && day.tadka) || ["spi-02", "spi-05"];
    const spices = ["spi-02", "spi-05", "spi-01", "veg-12", "spi-16"];
    const extra = { "veg-02": "onion-chopped", "veg-03": "tomato-chopped" };
    const ids = ["cook-daal", "cook-paani"].concat(spices, ["veg-02"], dish.tameto ? ["veg-03"] : []);
    // two rows on the counter: ingredients in front, spices behind on the right
    const items = {};
    const front = ["cook-daal", "cook-paani", "veg-02"].concat(dish.tameto ? ["veg-03"] : []);
    Cook.shuffle(front).forEach((id, i) => {
      items[id] = S.prop(extra[id] || Cook.word(id).image, 170 + i * 175, 800, 160, 140);
    });
    Cook.shuffle(spices).forEach((id, i) => {
      items[id] = S.prop(Cook.word(id).image, 880 + i * 150, 812, 138, 110);
    });
    const pot = S.track(S.add.image(470, 330, "pot").setOrigin(0.5, 0.5).setScale(1.19).setDepth(D.item));
    pot.baseScale = 1.19;
    const liq = S.liquid(pot, "pot");
    const pan = S.track(S.add.image(1125, 340, "tadka-pan").setScale(1.12).setDepth(D.item));
    pan.baseScale = 1.12;
    if (Cook.hasUpgrade("tadka")) S.special(pan);
    if (Cook.hasUpgrade("pot")) S.special(pot);
    const flameL = S.flame(490, 390, 170);
    const flameR = S.flame(1125, 400, 150);
    S.loops.push({ stop: flameL.stop }, { stop: flameR.stop });
    let stepN = 1;
    const next = () => UI.recipeProgress(++stepN);

    // 1. daal into the pot
    await waitFor(S, ctx, items, "cook-daal");
    const bowl = items["cook-daal"];
    const home = { x: bowl.x, y: bowl.y };
    await Cook.tween(S, { targets: bowl, x: 560, y: 260, angle: -40, duration: 350 });
    S.burst(470, 300, [0xf2b233, 0xe8a020], 18, 90);
    Cook.sfx.pop();
    liq.set(0.35, 0xe7b23f, 1);
    await Cook.tween(S, { targets: bowl, x: home.x, y: home.y, angle: 0, duration: 300 });
    next();

    // 2. water to the line
    await waitFor(S, ctx, items, "cook-paani");
    const g = S.gauge(800, 590, 300, 0.55, 0.75, 0x7cc4e8);
    g.set(0.35);
    const wv = await S.pour(items["cook-paani"], { gauge: g, rate: 0.28, auto: Cook.hasUpgrade("jug"), lift: { x: 640, y: 250 }, onLevel: (v) => liq.set(v, 0xd9b45a, 0.95) });
    const s2 = S.bandScore(wv, 0.55, 0.75);
    S.gradeText(800, 250, s2);
    grade(ctx, "water", s2);
    await Cook.wait(300);
    g.destroy();
    next();

    // 3. tadka: Nani says the spices once; add them in that order
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);
    const tadkaLine = UI.join(tadkaList.map((id, i) => (i === 0 ? UI.wordLine(id) : UI.line("and", UI.phrase([id])))));
    tadkaList.forEach((id) => Cook.markSeen(id));
    UI.gist(ctx.guided ? "Listen: add the spices to the hot oil in the order Nani says." : "Listen to the order!", { top: false });
    await nani(tadkaLine, { ms: Cook.readMs(tadkaLine.plain) + 800 });
    UI.hideGist();
    if (!ctx.guided) UI.hideBubble(); // from memory: the words go away
    ctx.result.tadka = [];
    const spiceColor = { "spi-02": [0x6b4a2b, 0x8a6238], "spi-05": [0x1c1512, 0x3a2a22], "spi-01": [0xf0a020, 0xffc040], "veg-12": [0x3f8a2e, 0x6fb24a], "spi-16": [0xffffff, 0xeeeeee] };
    for (let i = 0; i < tadkaList.length; i++) {
      const id = tadkaList[i];
      const r = await S.step({
        items: Object.fromEntries(spices.map((s) => [s, items[s]])),
        expected: id,
        word: id,
        guided: ctx.guided,
        sayWord: () => nani(UI.wordLine(id)),
        onWrong: (k, m) => {
          ctx.listenMisses++;
          S.burst(1125, 330, 0xfff0c0, 6, 50);
          if (m === 1) oops();
        },
      });
      if (!ctx.guided) r.misses ? Cook.markMiss(id) : Cook.markRight(id);
      ctx.result.tadka.push(r.misses);
      const sp = items[id];
      const h = { x: sp.x, y: sp.y };
      await S.fly(sp, 1080, 250, { duration: 350, arc: 100 });
      S.burst(1125, 330, spiceColor[id] || 0x996633, 16, 70);
      Cook.sfx.sizzle(0.8);
      S.fly(sp, h.x, h.y, { duration: 300, arc: 40 });
      UI.hideBubble();
    }
    next();

    // 4. onion (and tomato) into the tadka
    const veg = ["veg-02"].concat(dish.tameto ? ["veg-03"] : []);
    for (const id of veg) {
      await waitFor(S, ctx, items, id);
      const o = items[id];
      await S.fly(o, 1125, 300, { duration: 380, scale: o.scale * 0.6 });
      o.setVisible(false);
      S.burst(1125, 330, id === "veg-03" ? [0xe23b2e, 0xff7a5c] : [0xf1d9e6, 0xd9a3c1], 16, 70);
      Cook.sfx.sizzle(1);
      S.steam(1125, 280, 2);
    }
    next();

    // 5. tip the tadka into the daal
    const potItems = { tadka: pan };
    Object.entries(items).forEach(([k, v]) => {
      if (v.visible) potItems[k] = v;
    });
    if (Cook.hasUpgrade("tadka")) await Cook.wait(400);
    else await waitFor(S, ctx, potItems, "tadka", { say: null });
    await Cook.tween(S, { targets: pan, x: 650, y: 230, angle: -60, duration: 450 });
    Cook.sfx.sizzle(1.4);
    S.steam(470, 260, 6);
    S.burst(470, 300, [0xf0a020, 0x6b4a2b, 0xffffff], 20, 120);
    liq.set(liq.level, 0xe0a42c, 1);
    await Cook.tween(S, { targets: pan, x: 1125, y: 340, angle: 0, duration: 400 });
    sizzle.stop();
    next();

    // 6. stir: Nani says how many times (a number, heard)
    const laps = (day && day.stir) || 3;
    const stirLine = { kutchi: `<span class="word">${UI.esc(Cook.numWord(laps))}</span>!`, english: `${laps}!`, plain: Cook.numWord(laps), audio: laps <= 3 ? `num-0${laps}` : null };
    Cook.markSeen(`num-0${laps}`);
    if (ctx.guided) UI.gist("Stir round the pot as many times as Nani says.");
    await nani(stirLine);
    const done = await stir(S, ctx, pot, liq, laps);
    UI.hideGist();
    ctx.result.stir = done;
    ctx.result.stirWant = laps;
    const ok = done === laps;
    if (!ctx.guided) ok ? Cook.markRight(`num-0${laps}`) : Cook.markMiss(`num-0${laps}`);
    grade(ctx, "stir count", ok ? 100 : 55, "listen");
    pot.setTexture("pot-daal");
    liq.set(0);
    S.steam(470, 240, 5);
    S.sparkle(470, 280);
    Cook.sfx.right();
    next();
    await Cook.wait(800);
    ctx.served.push({ key: "pot-daal", recipe: "daal" });
    ctx.result.tameto = !!dish.tameto;
  };

  function stir(S, ctx, pot, liq, want) {
    return new Promise((resolve) => {
      const c = liq.surface();
      const cx = c.x;
      const cy = c.y;
      let prev = null;
      let acc = 0;
      let laps = 0;
      let quiet = null;
      const trail = S.track(S.add.graphics().setDepth(D.fx));
      const arrow = S.track(S.add.graphics().setDepth(D.fx));
      arrow.lineStyle(8, 0xffffff, 0.8);
      arrow.beginPath();
      arrow.arc(cx, cy, 110, 0.3, Math.PI * 1.7);
      arrow.strokePath();
      arrow.setScale(1, 0.5);
      arrow.y = cy * 0.5;
      S.tweens.add({ targets: arrow, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });
      const finish = () => {
        Cook.expect = null;
        S.input.off("pointermove", move);
        S.input.off("pointerup", up);
        trail.destroy();
        arrow.destroy();
        UI.hideCount();
        resolve(laps);
      };
      const easy = Cook.hasUpgrade("pot");
      const lap = easy ? Math.PI * 1.6 : Math.PI * 2;
      const move = (p) => {
        if (!p.isDown) return (prev = null);
        const dx = p.worldX - cx;
        const dy = (p.worldY - cy) * 2;
        if (Math.hypot(dx, dy) < (easy ? 12 : 30) || Math.hypot(dx, dy) > 420) return;
        const a = Math.atan2(dy, dx);
        clearTimeout(quiet);
        if (prev != null) {
          let d = a - prev;
          if (d > Math.PI) d -= Math.PI * 2;
          if (d < -Math.PI) d += Math.PI * 2;
          acc += Math.abs(d);
          if (acc >= lap) {
            acc -= lap;
            laps++;
            UI.count(laps);
            Cook.sfx.bubble();
            S.burst(cx, cy, [0xe0a42c, 0xf6d27a], 8, 60);
          }
        }
        prev = a;
        trail.fillStyle(0xffffff, 0.35);
        trail.fillCircle(p.worldX, p.worldY, 8);
        if (Math.random() < 0.3) S.time.delayedCall(300, () => trail.clear());
      };
      const up = () => {
        prev = null;
        clearTimeout(quiet);
        if (laps >= 1) quiet = setTimeout(finish, 900 / Cook.speed);
      };
      S.input.on("pointermove", move);
      S.input.on("pointerup", up);
      S.ghost({ circle: { x: cx, y: cy, rx: 120, ry: 50 } }, { duration: 1200, delay: ctx.guided ? 200 : 5000 });
      Cook.expect = { kind: "stir", x: cx, y: cy, rx: 150, ry: 75, target: want, count: () => laps };
    });
  }

  /* ---------------- serve: back to the island ---------------- */
  R.serveDishes = function (S, served, x) {
    const out = [];
    const n = served.length;
    served.forEach((d, i) => {
      const px = x + (i - (n - 1) / 2) * 190;
      if (d.recipe === "maani") {
        const plate = S.prop("thali", px, 712, 220, 120, { depth: Cook.D.occ + 2 });
        if (Cook.hasUpgrade("thali")) S.special(plate);
        for (let k = 0; k < d.count; k++) {
          const c = S.track(S.add.image(px, 690 - k * 10, "chapati-puffed").setScale(S.fitScale("chapati-puffed", 150, 100)).setDepth(Cook.D.occ + 3));
          out.push(c);
        }
        out.push(plate);
      } else if (d.recipe === "chai") {
        out.push(S.prop("glass-chai", px, 712, 110, 140, { depth: Cook.D.occ + 2 }));
        S.steam(px, 560, 2);
      } else {
        out.push(S.prop("pot-daal", px, 712, 190, 140, { depth: Cook.D.occ + 2 }));
        S.steam(px, 560, 3);
      }
    });
    return out;
  };
})(window);
