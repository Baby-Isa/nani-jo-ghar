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
  const Lang = Cook.Lang;
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
      // the number word moves on (or back) with what you made (audit: counts teach numbers)
      if (!z.guided && count >= 1 && count <= 5) (rolled.length === count ? Cook.markRight : Cook.markMiss)(Cook.numId(count));
      return rolled.length;
    },
  });

  /**
   * Roll one ball on the chakla: the building block (the Maani line uses it
   * too, as Mech.rollOne). Resolves with the score, or with {score, target,
   * sprite, torn} when opts.keep. opts:
   *   dough    a dough sprite already there (flown in from a bowl)
   *   board    false: the caller draws a chakla that stays
   *   tex      {ball, raw}: texture keys for this dough (millet dough is greyer)
   *   targets  [{id, r}]: several dashed circles (big and small); the
   *            nearest one to where you stop is the size you made
   *   aim      which target the test aims for (the gauge; never shown)
   *   quietMs  how long a pause ends the roll (default the knob)
   *   patient  a pause only ends the roll on (or past) a circle: stop short,
   *            or between the two, and it waits for you (to flip a maani)
   *   onStart  called once, when the pin first moves the dough
   *   handle   {} that gets cancel(): stop without a score (resolves null)
   */
  function rollOne(z, k, at, opts = {}) {
    const S = z.S;
    return new Promise((resolve) => {
      const cx = z.X(at.x);
      const cy = z.Y(at.y);
      const targets = (opts.targets || [{ id: null, r: k.radius }]).map((t) => Object.assign({}, t, { R: z.L(t.r) }));
      const aimT = targets[opts.aim || 0] || targets[0];
      const Rmax = Math.max(...targets.map((t) => t.R));
      const Rmin = Math.min(...targets.map((t) => t.R));
      const quietMs = opts.quietMs || k.quietMs;
      const [lo, hi] = k.band;
      let r = z.L(k.startRadius);
      const chakla = opts.board === false ? null : S.flat(S.tex("chakla"), cx, cy + z.L(10), z.L(560), z.L(460), { depth: D.item - 2 });
      const dough = opts.dough || S.track(S.add.image(cx, cy, "dough-ball"));
      dough.setPosition(cx, cy).setDepth(D.item + 1);
      const tex = Object.assign({ ball: "dough-ball", raw: "chapati-raw" }, opts.tex);
      const setR = () => {
        const key = r < z.L(90) ? tex.ball : tex.raw;
        if (dough.texture.key !== key) dough.setTexture(key);
        dough.setScale((r * 2) / S.texSize(key).w);
      };
      setR();
      // the target you're nearest to (by ratio: 10% short of small is nearer small)
      const nearest = () => targets.reduce((a, t) => (Math.abs(Math.log(r / t.R)) < Math.abs(Math.log(r / a.R)) ? t : a));
      const guide = S.track(S.add.graphics().setDepth(D.fx));
      const drawGuide = () => {
        guide.clear();
        const near = nearest();
        targets.forEach((t) => {
          const ok = t === near && r >= t.R * lo && r <= t.R * hi;
          guide.lineStyle(z.L(7), ok ? 0x4f6b4b : 0xffffff, 0.95);
          for (let a = 0; a < 360; a += 12) {
            guide.beginPath();
            guide.arc(cx, cy, t.R, Phaser.Math.DegToRad(a), Phaser.Math.DegToRad(a + 6));
            guide.strokePath();
          }
        });
      };
      drawGuide();
      const pin = S.hand("pin", { x: cx, y: cy + z.L(60), k: z.k });
      if (k.special) S.special(pin);
      let last = null;
      let quiet = null;
      let torn = false;
      let started = false;
      let over = false;
      let ghost = null;
      const offs = [];
      const stop = () => {
        over = true;
        z.expect(null);
        offs.forEach((f) => f());
        clearTimeout(quiet);
        if (ghost) ghost.stop();
        guide.destroy();
      };
      const done = () => {
        if (over) return;
        stop();
        const t = nearest();
        const score = torn ? k.tornScore : S.bandScore(r / t.R, lo, hi);
        S.verdict(cx, cy - z.L(200), score, { bad: r < t.R * lo ? "too-small" : "too-thin" });
        Cook.sfx.right();
        if (opts.keep) {
          S.tweens.add({ targets: pin, alpha: 0, duration: 200, onComplete: () => pin.destroy() });
          return resolve({ score, target: t.id, sprite: dough, torn });
        }
        S.tweens.add({ targets: [dough, pin, chakla].filter(Boolean), alpha: 0, duration: 250, delay: 250, onComplete: () => [dough, pin, chakla].forEach((o) => o && o.destroy()) });
        setTimeout(() => resolve(score), 520 / Cook.speed);
      };
      if (opts.handle) {
        opts.handle.cancel = () => {
          if (over) return;
          stop();
          pin.destroy();
          if (chakla) chakla.destroy();
          resolve(null);
        };
      }
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
        if (!started) {
          started = true;
          if (opts.onStart) opts.onStart();
        }
        pin.y = Cook.clamp(p.worldY, cy - z.L(150), cy + z.L(150));
        r = Math.min(Rmax * k.maxSize, r + d * k.grow);
        if (r > Rmax * k.tearAt && !torn) {
          torn = true;
          S.burst(cx, cy, [0xf3e1b8, 0xffffff], 10, z.L(80));
          z.oops();
        }
        setR();
        drawGuide();
        z.gauge({ level: r / aimT.R, lo, hi });
        if (Math.random() < 0.12) Cook.sfx.flip();
      };
      const up = () => {
        last = null;
        clearTimeout(quiet);
        const onCircle = targets.some((t) => r >= t.R * lo && r <= t.R * hi) || r >= Rmax * lo;
        if (opts.patient ? onCircle : r >= Rmin * k.doneAt) quiet = setTimeout(done, quietMs / Cook.speed);
      };
      offs.push(z.on("pointerdown", down), z.on("pointermove", move), z.on("pointerup", up));
      ghost = S.ghost([[cx, cy + z.L(110)], [cx, cy - z.L(110)], [cx, cy + z.L(110)]], { duration: 900, delay: z.guided ? 200 : 5000 });
      z.gauge({ level: r / aimT.R, lo, hi });
      z.expect({ kind: "roll", x: cx, y: cy, r: aimT.R });
    });
  }
  Mech.rollOne = rollOne;

  Mech.lab("roll", {
    name: "Roll",
    verb: "How many?",
    async run(L) {
      // the maani recipe orders two kinds now (the Maani line); the lone roll station is "how many"
      const n = 1 + Math.floor(Math.random() * 4);
      L.card([Lang.line(Lang.orderFrame(0), Lang.phrase(Lang.countParts(n, "cook-maani", { one: false })))], ["Roll"]);
      await L.station("roll", { count: n });
    },
  });
})(window);
