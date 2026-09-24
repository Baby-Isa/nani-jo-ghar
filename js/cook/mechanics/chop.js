/*
 * Mechanic: chop (Fruit Ninja style). Vegetables are tossed up; slice
 * only the ones Nani named, as many as she said ("only three tomatoes").
 * Slicing the wrong one: "Arre re!". Kutchi: which ones, how many.
 * Params: targets {wordId: count}, pool (what gets thrown).
 * Knobs (data.mechanics.chop): inAir, every, fasterPerStage, fasterMax,
 * targetBias, throwSpeed, gravity, sharp (a second target in one swipe), special.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  Mech.define("chop", {
    station: "chop",
    view: "wood",
    async run(z, { targets, pool }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const want = Object.assign({}, targets);
      const ids = Object.keys(want);
      const lines = ids.map((id) => Lang.line("only", Lang.phrase(Lang.countParts(want[id], id, { one: false }))));
      ids.forEach((id) => Cook.markSeen(id));
      await z.say(Lang.join(lines), { hide: St.hideKnown(ctx) });
      const knife = S.hand("knife", { x: z.X(1300), y: z.Y(640), angle: -25, k: z.k });
      if (k.special) S.special(knife);
      const flying = [];
      const cut = {};
      let wrong = 0;
      const texFor = (id) => {
        const w = Cook.data.words[id];
        if (w.image && S.textures.exists(w.image)) return w.image;
        return S.tex(`piece:${id}`);
      };
      const [v0, v1] = k.throwSpeed;
      const throwOne = () => {
        const needed = ids.filter((id) => (cut[id] || 0) < want[id]);
        const pick = needed.length && Math.random() < k.targetBias ? Cook.pick(needed) : Cook.pick(pool);
        const key = texFor(pick);
        const img = S.track(S.add.image(z.X(200 + Math.random() * 1200), z.Y(980), key).setDepth(D.item + 2));
        img.setScale(S.fitScale(key, z.L(170), z.L(170)));
        img.wordId = pick;
        img.vx = (z.X(800) - img.x) * (0.25 + Math.random() * 0.3);
        // peak around the upper third of the play area
        img.vy = -z.L(v0 + Math.random() * (v1 - v0));
        img.spin = (Math.random() - 0.5) * 5;
        flying.push(img);
      };
      const halves = (img) => {
        const key = img.texture.key;
        const { w, h } = S.texSize(key);
        [0, 1].forEach((side) => {
          const half = S.track(S.add.image(img.x, img.y, key).setScale(img.scale).setDepth(D.item + 3).setCrop(side ? w / 2 : 0, 0, w / 2, h));
          S.tweens.add({ targets: half, x: img.x + z.L(side ? 120 : -120), y: img.y + z.L(240), angle: side ? 60 : -60, alpha: 0, duration: 700, onComplete: () => half.destroy() });
        });
      };
      await new Promise((resolve) => {
        let prev = null;
        let spawnT = 0;
        let last = performance.now();
        const doneNow = () => ids.every((id) => (cut[id] || 0) >= want[id]);
        const trail = S.track(S.add.graphics().setDepth(D.top));
        const trailPts = [];
        const move = (p) => {
          if (!p.isDown) {
            prev = null;
            return;
          }
          const cur = { x: p.worldX, y: p.worldY };
          knife.setPosition(cur.x + z.L(40), cur.y + z.L(20));
          trailPts.push({ x: cur.x, y: cur.y, t: performance.now() });
          if (prev) {
            const line = new Phaser.Geom.Line(prev.x, prev.y, cur.x, cur.y);
            flying.slice().forEach((img) => {
              if (!img.active || img.sliced) return;
              const c = new Phaser.Geom.Circle(img.x, img.y, img.displayWidth * 0.42);
              if (Phaser.Geom.Intersects.LineToCircle(line, c) && Phaser.Math.Distance.Between(prev.x, prev.y, cur.x, cur.y) > 12) {
                img.sliced = true;
                Cook.sfx.chop();
                Cook.sfx.whoosh();
                const id = img.wordId;
                const ok = ids.includes(id) && (cut[id] || 0) < want[id];
                if (ok) {
                  cut[id] = (cut[id] || 0) + 1;
                  UI.count(Object.values(cut).reduce((a, b) => a + b, 0), { speak: false });
                  Lang.speak({ segs: Lang.num(Math.min(5, cut[id])), en: "" });
                  S.burst(img.x, img.y, [0xffffff, 0xf6d27a], 10, z.L(70));
                  z.progress({ cut: id, n: cut[id] });
                } else {
                  wrong++;
                  z.listen(false, `sliced ${id}`);
                  if (wrong === 1 || wrong % 3 === 0) z.oops();
                  S.burst(img.x, img.y, [0xb24a3a, 0xffd6c9], 10, z.L(60));
                }
                halves(img);
                img.destroy();
                if (k.sharp && ok) {
                  // the sharp knife also catches a second target near the first
                  const near = flying.find((o) => o.active && !o.sliced && ids.includes(o.wordId) && (cut[o.wordId] || 0) < want[o.wordId] && Phaser.Math.Distance.Between(o.x, o.y, cur.x, cur.y) < z.L(220));
                  if (near) {
                    near.sliced = true;
                    cut[near.wordId]++;
                    halves(near);
                    near.destroy();
                  }
                }
              }
            });
          }
          prev = cur;
        };
        const up = () => (prev = null);
        const offs = [z.on("pointermove", move), z.on("pointerup", up)];
        S.ghost([[z.X(400), z.Y(450)], [z.X(1200), z.Y(380)]], { duration: 500, delay: z.guided ? 400 : 6000 });
        const stop = z.tick(() => {
          const now = performance.now();
          const dt = Math.min(0.05, (now - last) / 1000) * Cook.speed;
          last = now;
          spawnT -= dt;
          if (spawnT <= 0 && flying.filter((f) => f.active).length < k.inAir) {
            throwOne();
            spawnT = k.every - Math.min(k.fasterMax, (Cook.wordStage(ids[0]) - 1) * k.fasterPerStage);
          }
          flying.forEach((img) => {
            if (!img.active) return;
            img.vy += z.L(k.gravity) * dt;
            img.x += img.vx * dt;
            img.y += img.vy * dt;
            img.angle += img.spin;
            if (img.y > z.Y(1050) && img.vy > 0) img.destroy();
          });
          trail.clear();
          const t0 = performance.now() - 160;
          const pts = trailPts.filter((q) => q.t > t0);
          trailPts.length = 0;
          trailPts.push(...pts);
          if (pts.length > 1) {
            trail.lineStyle(z.L(10), 0xffffff, 0.8);
            trail.beginPath();
            trail.moveTo(pts[0].x, pts[0].y);
            pts.forEach((q) => trail.lineTo(q.x, q.y));
            trail.strokePath();
          }
          // for the automated test: the nearest target in flight
          const tgt = flying.find((o) => o.active && !o.sliced && ids.includes(o.wordId) && (cut[o.wordId] || 0) < want[o.wordId] && o.y < z.Y(780) && o.y > z.Y(150));
          z.expect(tgt ? { kind: "slice", x: tgt.x, y: tgt.y, x1: tgt.x - z.L(120), y1: tgt.y - z.L(40), x2: tgt.x + z.L(120), y2: tgt.y + z.L(40) } : { kind: "wait" });
          if (doneNow()) {
            stop();
            offs.forEach((f) => f());
            z.expect(null);
            resolve();
          }
        });
      });
      UI.hideCount();
      flying.forEach((o) => o.active && o.destroy());
      ids.forEach((id) => (wrong ? Cook.markMiss(id) : Cook.markRight(id)));
      ctx.result.chopped = cut;
      z.skill(100, "chop");
      S.sparkle(z.X(800), z.Y(450));
      await Cook.wait(500);
      return cut;
    },
  });

  Mech.lab("chop", {
    name: "Chop",
    verb: "Ninja slicing",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.daal.make();
      L.card(R.daal.lines(d, 0), ["Chop"]);
      await L.station("chop", { targets: d.tameto ? { "veg-02": d.onions, "veg-03": d.tomatoes } : { "veg-02": d.onions }, pool: ["veg-02", "veg-03", "veg-13", "veg-12", "veg-01"] });
    },
  });
})(window);
