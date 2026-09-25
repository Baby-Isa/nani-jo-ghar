/*
 * Mechanic: tadka (spices in order). Nani says the spices; tap them into
 * the hot oil in that order, then tip the pan into the pot (the pan
 * glows and an arrow points at the pot). Don't dawdle: once the first
 * spice is in, a heat ring fills round the pan, and if the next spice
 * (or the tip) doesn't come before it's full, the spices burn (the hand
 * star; it also stops "wait for the hint glow" from paying off).
 * Kutchi: the sequence ("ne poi"). At higher levels the order ladder
 * shows the spices as dots, then not at all: it's Nani's spoken order,
 * from memory (the Simon moment). Hearing her again costs the no-help
 * star. `order` may hold any-order groups (arrays): one shared dot.
 * Knobs (data.mechanics.tadka): shelf (the spice bowls on the counter;
 * the order's own spices are always added), autoTip (the tadka
 * upgrade), ladder ("words" | "dots" | "hidden": how the mission card
 * shows Nani's order), burnSec (seconds of heat between spices),
 * guidedBurn (x burnSec the first time), burntScore.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
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
      const spices = Cook.shuffle([...new Set(k.shelf.concat(flat))]);
      const items = St.ingredients(z, spices.concat(veg), { x0: 180, x1: 1420, dy: -20, w: 175, h: 130 });
      const sizzle = Cook.sfx.sizzleLoop();
      S.loops.push(sizzle);
      flat.forEach((id) => Cook.markSeen(id));
      // how the card shows her order: words, dots, or nothing (from memory)
      const mode = ctx.guided ? "words" : k.ladder || "words";
      if (mode !== "words" && UI.mission.conceal) UI.mission.conceal("tadka", mode);
      const hideAll = mode !== "words";
      const hide = hideAll ? () => true : St.hideKnown(ctx);
      // "Jeeru. Ne poi rai." (and then: the order matters; one group is "ne")
      await z.say(Lang.list(order, { seq: true }), { hide, onHear: () => hideAll && Cook.onHelp && Cook.onHelp("replay", { ids: flat }) });

      // the heat: a ring round the pan that fills between spices
      const burnSec = k.burnSec * (ctx.guided ? k.guidedBurn : 1);
      let heat = 0;
      let hot = false; // the clock starts with the first spice
      let burns = 0;
      const ringG = S.track(S.add.graphics().setDepth(D.fx + 1));
      const R = pan.rimRx + z.L(34);
      const cx = pan.rim.x;
      const cy = pan.rim.y;
      const drawHeat = () => {
        ringG.clear();
        if (!hot) return;
        const a0 = -Math.PI / 2;
        ringG.lineStyle(z.L(12), 0xfffaf1, 0.6).strokeCircle(cx, cy, R);
        const col = heat < 0.6 ? 0xe6b84a : heat < 0.85 ? 0xd9822b : 0xb24a3a;
        ringG.lineStyle(z.L(10), col, 1);
        ringG.beginPath();
        ringG.arc(cx, cy, R, a0, a0 + Math.min(1, heat) * Math.PI * 2);
        ringG.strokePath();
      };
      let smokeT = 0;
      let last = performance.now();
      const stopHeat = z.tick(() => {
        const now = performance.now();
        const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
        last = now;
        if (!hot) return;
        heat += dt / burnSec;
        // real cues first: wisps of smoke as it gets too hot
        smokeT -= dt;
        if (heat > 0.7 && smokeT <= 0) {
          smokeT = 0.35;
          const s = S.track(S.add.ellipse(cx + (Math.random() - 0.5) * pan.rimRx, cy - z.L(10), z.L(40), z.L(50), heat >= 1 ? 0x4a4038 : 0x8a8078, 0.5).setDepth(D.fx));
          S.tweens.add({ targets: s, y: s.y - z.L(150), scale: 2, alpha: 0, duration: 1100, onComplete: () => s.destroy() });
        }
        if (heat >= 1) {
          burns++;
          heat = 0;
          S.verdict(cx, cy - z.L(120), 0, { bad: "burnt" });
          S.burst(cx, cy, [0x3a3028, 0x6a5a48], 14, z.L(80));
          pan.setLiquid(0.6, burns > 1 ? 0x6a4a22 : 0x9a6a2a);
          Cook.sfx.soft();
          z.say(Lang.line("burning"), { ms: 900 }).catch(() => {});
        }
        drawHeat();
      });

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
          if (ctx.tickItem && flat.includes(id)) ctx.tickItem(id); // tick its row on the order ladder
          const obj = items[id];
          const col = St.heapColor(id);
          const dot = S.track(S.add.circle(obj.x, obj.y - z.L(20), z.L(20), col, 1).setDepth(D.fx));
          await S.fly(dot, pan.rim.x, pan.rim.y, { duration: 340, arc: z.L(100) });
          S.burst(pan.rim.x, pan.rim.y, [col, 0xfff0c0], 16, z.L(70));
          Cook.sfx.sizzle(0.8);
          dot.destroy();
          obj.setAlpha(0.45);
          // a fresh spice: the clock starts again
          hot = true;
          heat = 0;
          drawHeat();
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
      stopHeat();
      hot = false;
      drawHeat();
      if (pan.shadow) pan.shadow.lifted = true; // lifted off the hob
      await Cook.tween(S, { targets: pan, x: z.X(B.left.x + 220), y: z.Y(B.left.y - 140), angle: -50, duration: 420 });
      Cook.sfx.sizzle(1.4);
      S.steam(pot.rim.x, pot.rim.y - z.L(30), 6);
      pot.setLiquid(0.65, burns ? 0xa8742a : 0xe0a42c);
      sizzle.stop();
      z.skill(burns ? k.burntScore : 100, "tadka");
      await Cook.wait(500);
    },
  });

  Mech.lab("tadka", {
    name: "Tadka",
    verb: "Spices in order",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.daal.make();
      L.card(d, ["Tadka"]);
      await L.station("tadka", { order: d.tadka });
    },
  });
})(window);
