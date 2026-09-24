/*
 * Mechanic: chop (Fruit Ninja style). Vegetables are tossed up; slice
 * only the one Nani names, as many as she says ("only bo tameto!"). Then
 * she switches mid-round ("now dungri!"): the next vegetable is the one
 * to slice, and the last one is now a decoy. Look-alikes fly too (a red
 * onion next to the tomatoes). Chopping never ends by itself when you
 * reach the number: each round runs until the vegetable has been thrown
 * a few more times than asked for, then Nani moves on. Too many or too
 * few costs the ear star (graded at the end, so nothing on screen says
 * when to stop); slicing the wrong one: "Arre re!" and the ear star.
 * Kutchi: which one, how many, and the switch.
 * Params: targets {wordId: count} (zeros are left out; the rounds come
 * in a new order each time, so daal doesn't always start with onions and
 * chaat with potatoes: only Nani's word says which is first), pool (what
 * else gets thrown), only (keep only targets in this list: the chaat
 * chops what goes in its bowl), no (vegetables they said no to), tick
 * (tick the order rows: daal).
 * Knobs (data.mechanics.chop): inAir, every, fasterPerStage, fasterMax,
 * throwSpeed, gravity, decoys (decoy kinds in the air), spare (extra
 * throws of the target per round), lookalikes {id: [ids]} (always among
 * the decoys), variants {id: {color, near, chance}} (an onion drawn red
 * when tomatoes are about), size / phoneSize (piece size, design px;
 * phoneSize on a small screen), sharp (a second target in one swipe),
 * special.
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
    async run(z, { targets = {}, pool = [], only, no = [], tick = false }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const want = {};
      Object.keys(targets).forEach((id) => {
        const n = Number(targets[id]) || 0;
        if (n > 0 && (!only || only.includes(id))) want[id] = n;
      });
      const ids = Cook.shuffle(Object.keys(want));
      if (!ids.length) return {};
      ids.forEach((id) => Cook.markSeen(id));
      const hide = St.hideKnown(ctx);
      const knife = S.hand("knife", { x: z.X(1300), y: z.Y(640), angle: -25, k: z.k });
      if (k.special) S.special(knife);
      // bigger vegetables on a small (phone) screen, so a finger can hit them
      const small = S.scale && S.scale.displaySize && S.scale.displaySize.width < 800;
      const size = small ? k.phoneSize || k.size : k.size;
      const flying = [];
      const cut = {};
      let wrong = 0;
      const texFor = (id) => {
        const w = Cook.data.words[id] || {};
        if (w.image && S.textures.exists(w.image)) return w.image;
        return S.tex(`piece:${id}`);
      };
      // a look-alike drawn from the real thing: the same onion, but red
      const variantTex = (id, color) => {
        const key = `chop-variant:${id}:${color}`;
        if (S.textures.exists(key)) return key;
        const src = S.textures.get(texFor(id)).getSourceImage();
        const c = document.createElement("canvas");
        c.width = src.width;
        c.height = src.height;
        const g = c.getContext("2d");
        g.drawImage(src, 0, 0);
        g.globalCompositeOperation = "color";
        g.fillStyle = color;
        g.fillRect(0, 0, c.width, c.height);
        g.globalCompositeOperation = "destination-in";
        g.drawImage(src, 0, 0);
        S.textures.addCanvas(key, c);
        return key;
      };
      const [v0, v1] = k.throwSpeed;
      let phase = null; // {target, bag, thrown, kinds}
      const bagFor = (target) => {
        const L = (k.lookalikes || {})[target] || [];
        const others = ids.filter((x) => x !== target);
        const rest = Cook.shuffle(pool.filter((x) => x !== target && !L.includes(x) && !others.includes(x)).concat(no.filter((x) => x !== target)));
        const decoys = [...new Set(L.concat(Cook.shuffle(others), rest))].filter((x) => x !== target && Cook.data.words[x]).slice(0, k.decoys);
        return [target].concat(decoys);
      };
      const throwOne = () => {
        if (!phase.bag.length) phase.bag = Cook.shuffle(phase.kinds.slice());
        const pick = phase.bag.shift();
        let key = texFor(pick);
        const v = (k.variants || {})[pick];
        if (v && phase.kinds.some((x) => (v.near || []).includes(x)) && Math.random() < v.chance) key = variantTex(pick, v.color);
        const img = S.track(S.add.image(z.X(220 + Math.random() * 1160), z.Y(990), key).setDepth(D.item + 2));
        img.setScale(S.fitScale(key, z.L(size), z.L(size)));
        img.wordId = pick;
        img.phase = phase;
        img.vx = (z.X(800) - img.x) * (0.25 + Math.random() * 0.3);
        // peak around the upper third of the play area
        img.vy = -z.L(v0 + Math.random() * (v1 - v0));
        img.spin = (Math.random() - 0.5) * 5;
        if (pick === phase.target) phase.thrown++;
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
      const sliceIt = (img) => {
        img.sliced = true;
        const id = img.wordId;
        const ok = phase && id === phase.target;
        if (ok) {
          cut[id] = (cut[id] || 0) + 1;
          // the running tally for this vegetable (said aloud only while the number is being learned)
          UI.count(cut[id]);
          S.burst(img.x, img.y, [0xffffff, 0xf6d27a], 10, z.L(70));
          z.progress({ cut: id, n: cut[id] });
        } else {
          wrong++;
          z.listen(false, no.includes(id) ? `sliced ${id} (they said no)` : `sliced ${id}`);
          if (wrong === 1 || wrong % 3 === 0) z.oops();
          S.burst(img.x, img.y, [0xb24a3a, 0xffd6c9], 10, z.L(60));
        }
        halves(img);
        img.destroy();
        return ok;
      };
      let prev = null;
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
        if (prev && Phaser.Math.Distance.Between(prev.x, prev.y, cur.x, cur.y) > 12) {
          const line = new Phaser.Geom.Line(prev.x, prev.y, cur.x, cur.y);
          flying.slice().forEach((img) => {
            if (!img.active || img.sliced) return;
            const c = new Phaser.Geom.Circle(img.x, img.y, img.displayWidth * 0.42);
            if (!Phaser.Geom.Intersects.LineToCircle(line, c)) return;
            Cook.sfx.chop();
            Cook.sfx.whoosh();
            const ok = sliceIt(img);
            if (k.sharp && ok) {
              // the sharp knife also catches a second one near the first
              const near = flying.find((o) => o.active && !o.sliced && o.wordId === phase.target && Phaser.Math.Distance.Between(o.x, o.y, cur.x, cur.y) < z.L(220));
              if (near) sliceIt(near);
            }
          });
        }
        prev = cur;
      };
      const offs = [z.on("pointermove", move), z.on("pointerup", () => (prev = null))];
      let throwing = false;
      let spawnT = 0;
      let last = performance.now();
      const stop = z.tick(() => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000) * Cook.speed;
        last = now;
        spawnT -= dt;
        if (throwing && spawnT <= 0 && flying.filter((f) => f.active).length < k.inAir) {
          throwOne();
          spawnT = k.every - Math.min(k.fasterMax, (Cook.wordStage(phase.target) - 1) * k.fasterPerStage);
        }
        flying.forEach((img) => {
          if (!img.active) return;
          img.vy += z.L(k.gravity) * dt;
          img.x += img.vx * dt;
          img.y += img.vy * dt;
          img.angle += img.spin;
          if (img.y > z.Y(1060) && img.vy > 0) img.destroy();
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
        // for the automated test: a wanted one near the top of its throw (slow there), sliced
        // straight down through where it's heading; and a decoy, for one deliberate mistake
        const inView = (o) => o.active && !o.sliced && o.y < z.Y(760) && o.y > z.Y(120) && Math.abs(o.vy) < z.L(520);
        const need = phase && (cut[phase.target] || 0) < want[phase.target];
        const alone = (o) => !flying.some((x) => x !== o && x.active && !x.sliced && Math.abs(x.x - o.x) < z.L(size * 0.9) && Math.abs(x.y - o.y) < z.L(size * 1.3));
        const tgt = need ? flying.find((o) => inView(o) && o.wordId === phase.target && alone(o)) : null;
        const dec = flying.find((o) => o.active && !o.sliced && o.y < z.Y(700) && o.y > z.Y(150) && phase && o.wordId !== phase.target && Math.abs(o.x - (tgt ? tgt.x : -9999)) > z.L(260));
        const ahead = (o) => o.x + o.vx * 0.06 * Cook.speed;
        z.expect(
          tgt
            ? { kind: "slice", x: tgt.x, y: tgt.y, x1: ahead(tgt), y1: tgt.y - z.L(size * 0.8), x2: ahead(tgt), y2: tgt.y + z.L(size * 0.8), wrongs: dec ? [{ x: dec.x, y: dec.y }] : [] }
            : { kind: "wait" }
        );
      });
      S.ghost([[z.X(400), z.Y(450)], [z.X(1200), z.Y(380)]], { duration: 500, delay: z.guided ? 1200 : 6000 });
      // one vegetable at a time; Nani switches when its round is over
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const kinds = bagFor(id);
        phase = { target: id, kinds, bag: [], thrown: 0 };
        const ph = Lang.phrase(Lang.countParts(want[id], id)); // "hikdo tameto": the number is always said
        UI.hideCount();
        throwing = i > 0; // the first round starts once she's said it
        await z.say(Lang.line(i === 0 ? "only" : "now", ph), { hide }).catch(() => {});
        throwing = true;
        spawnT = 0;
        const need = want[id] + k.spare;
        const p = phase;
        await new Promise((resolve) => {
          const off = z.tick(() => {
            if (p.thrown < need) return;
            if (flying.some((o) => o.active && !o.sliced && o.phase === p && o.wordId === id)) return;
            off();
            resolve();
          });
        });
      }
      throwing = false;
      z.say(Lang.line("enough"), { ms: 900 }).catch(() => {});
      await new Promise((resolve) => {
        const off = z.tick(() => {
          if (flying.some((o) => o.active && !o.sliced)) return;
          off();
          resolve();
        });
      });
      stop();
      offs.forEach((f) => f());
      z.expect(null);
      UI.hideCount();
      // graded now, not while you chop (so nothing tells you when to stop)
      ids.forEach((id) => {
        const c = cut[id] || 0;
        const ok = c === want[id];
        if (!ok) z.listen(false, `chopped ${c}, they asked for ${want[id]}: ${id}`);
        if (!ctx.guided) {
          if (ok && !wrong) Cook.markRight(id);
          else Cook.markMiss(id);
          if (want[id] <= 5) (ok ? Cook.markRight : Cook.markMiss)(Cook.numId(want[id]));
        }
        if (ok && tick && ctx.tickItem) ctx.tickItem(id);
      });
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
      let d = R.daal.make();
      for (let i = 0; i < 20 && !(d.onions && (d.tomatoes || d.chillies)); i++) d = R.daal.make(); // the lab shows a switch
      L.card(d, ["Chop"]);
      await L.station("chop", { targets: { "veg-02": d.onions, "veg-03": d.tomatoes, "veg-12": d.chillies }, pool: Cook.data.recipes.daal.lists.veg, tick: true });
    },
  });
})(window);
