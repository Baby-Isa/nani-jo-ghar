/*
 * Mechanic: roll (and decide how many). Two hands on the pin: drag up and
 * down until the dough fills the dashed circle; overdo it and it tears.
 * Then another ball, or the tick when you've made as many as they said.
 * Kutchi: how many ("trae maani").
 *
 * In a zone with an `out` channel (the Maani line, Roll -> Tawa), each
 * rolled maani is sent on as {kind: "maani", sprite, score}; the next zone
 * can fly the sprite over and cook it.
 * Params: count, at/spareAt/stackAt (design coords, to re-lay it out).
 * Knobs (data.mechanics.roll): radius, startRadius, band, grow, maxSize,
 * tearAt, tornScore, doneAt, quietMs, maxCount, special.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("roll", {
    station: "roll",
    view: "wood",
    footprint: { x: 150, y: 180, w: 1300, h: 660 },
    async run(z, { count, at, spareAt, stackAt }, k) {
      const S = z.S;
      const ctx = z.ctx;
      at = St.pt(at, { x: 780, y: 430 });
      const sp = St.pt(spareAt, { x: 230, y: 760 });
      const sk = St.pt(stackAt, { x: 1330, y: 700 });
      const rolled = [];
      const spare = S.track(S.add.image(z.X(sp.x), z.Y(sp.y), "dough-ball").setScale(0.45 * z.k).setDepth(D.item));
      spare.baseScale = 0.45 * z.k;
      const stack = [];
      for (;;) {
        spare.setVisible(false);
        const score = await rollOne(z, k, at);
        rolled.push(score);
        z.skill(score, "roll");
        const done = S.track(S.add.image(z.X(sk.x), z.Y(sk.y) - z.L(stack.length * 10), "chapati-raw").setScale(0.36 * z.k).setDepth(D.item + stack.length));
        stack.push(done);
        UI.count(rolled.length);
        z.emit({ kind: "maani", sprite: z.out ? done : null, score, n: rolled.length });
        if (rolled.length >= k.maxCount) break;
        spare.setVisible(true);
        if (z.guided && rolled.length < count) S.glow(spare, true);
        const more = await new Promise((resolve) => {
          const finish = (v) => {
            z.expect(null);
            S.untap(spare);
            S.glow(spare, false);
            UI.hideDone();
            resolve(v);
          };
          S.tappable(spare, () => finish(true));
          UI.done({ glow: z.guided && rolled.length >= count }).then(() => finish(false));
          const c = S.centre(spare);
          z.expect({ kind: "more", x: c.x, y: c.y, target: count, count: () => rolled.length });
        });
        if (!more) break;
      }
      if (z.out) spare.setVisible(false);
      UI.hideCount();
      ctx.result.maani = rolled.length;
      z.listen(rolled.length === count, `made ${rolled.length} maani, they asked for ${count}`);
      return rolled.length;
    },
  });

  function rollOne(z, k, at) {
    const S = z.S;
    return new Promise((resolve) => {
      const cx = z.X(at.x);
      const cy = z.Y(at.y);
      const R0 = z.L(k.radius);
      const [lo, hi] = k.band;
      let r = z.L(k.startRadius);
      const chakla = S.flat(S.tex("chakla"), cx, cy + z.L(10), z.L(560), z.L(460), { depth: D.item - 2 });
      const dough = S.track(S.add.image(cx, cy, "dough-ball").setDepth(D.item + 1));
      const setR = () => {
        const key = r < z.L(90) ? "dough-ball" : "chapati-raw";
        dough.setTexture(key);
        dough.setScale((r * 2) / S.texSize(key).w);
      };
      setR();
      const guide = S.track(S.add.graphics().setDepth(D.fx));
      const drawGuide = (ok) => {
        guide.clear();
        guide.lineStyle(z.L(7), ok ? 0x4f6b4b : 0xffffff, 0.95);
        for (let a = 0; a < 360; a += 12) {
          guide.beginPath();
          guide.arc(cx, cy, R0, Phaser.Math.DegToRad(a), Phaser.Math.DegToRad(a + 6));
          guide.strokePath();
        }
      };
      drawGuide(false);
      const pin = S.hand("pin", { x: cx, y: cy + z.L(60), k: z.k });
      if (k.special) S.special(pin);
      let last = null;
      let quiet = null;
      let torn = false;
      const offs = [];
      const done = () => {
        z.expect(null);
        offs.forEach((f) => f());
        clearTimeout(quiet);
        guide.destroy();
        const score = torn ? k.tornScore : S.bandScore(r / R0, lo, hi);
        S.verdict(cx, cy - z.L(200), score, { bad: r < R0 * lo ? "too-small" : "too-thin" });
        Cook.sfx.right();
        S.tweens.add({ targets: [dough, pin, chakla], alpha: 0, duration: 250, delay: 250, onComplete: () => [dough, pin, chakla].forEach((o) => o.destroy()) });
        setTimeout(() => resolve(score), 520 / Cook.speed);
      };
      const down = (p) => {
        last = { x: p.worldX, y: p.worldY };
        clearTimeout(quiet);
      };
      const move = (p) => {
        if (!p.isDown || !last) return;
        const dy = p.worldY - last.y;
        const dx = p.worldX - last.x;
        const d = Math.hypot(dx, dy);
        if (d < 4) return;
        last = { x: p.worldX, y: p.worldY };
        pin.y = Cook.clamp(p.worldY, cy - z.L(150), cy + z.L(150));
        r = Math.min(R0 * k.maxSize, r + d * k.grow);
        if (r > R0 * k.tearAt && !torn) {
          torn = true;
          S.burst(cx, cy, [0xf3e1b8, 0xffffff], 10, z.L(80));
          z.oops();
        }
        setR();
        drawGuide(r >= R0 * lo && r <= R0 * hi);
        z.gauge({ level: r / R0, lo, hi });
        if (Math.random() < 0.12) Cook.sfx.flip();
      };
      const up = () => {
        last = null;
        clearTimeout(quiet);
        if (r >= R0 * k.doneAt) quiet = setTimeout(done, k.quietMs / Cook.speed);
      };
      offs.push(z.on("pointerdown", down), z.on("pointermove", move), z.on("pointerup", up));
      S.ghost([[cx, cy + z.L(110)], [cx, cy - z.L(110)], [cx, cy + z.L(110)]], { duration: 900, delay: z.guided ? 200 : 5000 });
      z.gauge({ level: r / R0, lo, hi });
      z.expect({ kind: "roll", x: cx, y: cy, r: R0 });
    });
  }

  Mech.lab("roll", {
    name: "Roll",
    verb: "How many?",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.maani.make();
      L.card(R.maani.lines(d, 0), ["Roll"]);
      await L.station("roll", { count: d.count });
    },
  });
})(window);
