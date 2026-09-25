/*
 * Mechanic: chop (Fruit Ninja style). Vegetables are tossed up in volume;
 * slice only the ones Nani names, as many of each as she says ("only bo
 * dungri. Ne hikdo tameto."), before the timer ring on the board runs
 * out. Decoys fly as often as each wanted vegetable (look-alikes among
 * them: a red onion next to the tomatoes), so what flies never tells you
 * what to cut.
 *
 * Level 1: one timed round with every vegetable the order names at once.
 * Levels 2-3 (`phases`): the round is split and Nani switches mid-round
 * ("now be marcha!"): the next vegetables are the ones to slice, and the
 * last ones are now decoys; throws get faster.
 *
 * Chopping never ends by itself when you reach a number: the round runs
 * until the ring is empty (each wanted vegetable is thrown a few more
 * times than asked for). Too many or too few costs the ear star (graded at
 * the end, so nothing on screen says when to stop); slicing the wrong one:
 * "Arre re!" and the ear star. Kutchi: which ones, how many, and the switch.
 *
 * Params: targets {wordId: count} (zeros are left out), pool (what else
 * gets thrown), only (keep only targets in this list: the chaat chops what
 * goes in its bowl), no (vegetables they said no to), tick (tick the order
 * rows: daal).
 * Knobs (data.mechanics.chop): phases (1 = all at once; 2+ = that many
 * rounds with a switch between them, at most one per vegetable), every
 * (seconds between throws), fasterPerStage / fasterMax (throws come this
 * fraction sooner per word stage of the vegetables, up to fasterMax),
 * throwSpeed, gravity, decoys (at least this many decoy kinds in the air),
 * spare (extra throws of each wanted vegetable per round), lookalikes
 * {id: [ids]} (always among the decoys), variants {id: {color, near,
 * chance}} (an onion drawn red when tomatoes are about), size / phoneSize
 * (piece size, design px; phoneSize on a small screen), sharp (a second
 * wanted one in one swipe), timer {x, y, r, warn} (the countdown ring on
 * the board, design px; warn: the last seconds, in amber), special.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /** Split the wanted vegetables into n rounds, in the order given (n <= ids). */
  const splitRounds = (ids, n) => {
    const out = [];
    const per = Math.ceil(ids.length / n);
    for (let i = 0; i < ids.length; i += per) out.push(ids.slice(i, i + per));
    return out;
  };

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
      // said in a new order every time (nothing about the order is a cue)
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
      // how long a throw is in the air (up and back below the board), in game seconds
      const flight = (2 * v1) / k.gravity + 0.3;

      /* ---------- the rounds: what flies, how often, how long ---------- */
      const rounds = splitRounds(ids, Math.max(1, Math.min(k.phases || 1, ids.length))).map((tg, i) => {
        // decoys: look-alikes first, then the other vegetables (earlier rounds' ones too), the pool, the "no"s
        const L = [...new Set(tg.flatMap((t) => (k.lookalikes || {})[t] || []))];
        const others = ids.filter((x) => !tg.includes(x));
        const rest = Cook.shuffle(pool.filter((x) => !L.includes(x) && !others.includes(x)).concat(no));
        const nDecoys = Math.max(k.decoys, tg.length);
        const decoys = [...new Set(L.concat(Cook.shuffle(others), rest))].filter((x) => !tg.includes(x) && Cook.data.words[x]).slice(0, nDecoys);
        const kinds = tg.concat(decoys);
        // every kind once per cycle, so a wanted one never flies more often than a decoy
        const cycles = Math.max(...tg.map((t) => want[t])) + k.spare;
        const bag = [];
        for (let c = 0; c < cycles; c++) bag.push(...Cook.shuffle(kinds.slice()));
        const stage = Math.min(...tg.map((t) => Cook.wordStage(t)));
        const every = k.every * (1 - Math.min(k.fasterMax, (stage - 1) * k.fasterPerStage));
        return { i, targets: tg, kinds, bag, every, secs: bag.length * every + flight };
      });
      const total = rounds.reduce((a, r) => a + r.secs, 0);
      let phase = null; // the round being thrown: {targets, kinds, bag, every, secs}

      /* ---------- the countdown ring (on the board, never over the throws) ---------- */
      const T = Object.assign({ x: 1490, y: 118, r: 70, warn: 3 }, k.timer || {});
      const ring = S.track(S.add.graphics().setDepth(D.item + 1));
      let left = total; // seconds left on the ring
      let lastTick = Math.ceil(left);
      const drawRing = () => {
        const x = z.X(T.x);
        const y = z.Y(T.y);
        const r = z.L(T.r);
        const f = Math.max(0, left / total);
        const warn = left <= T.warn;
        ring.clear();
        ring.fillStyle(0x2a1a10, 0.18).fillCircle(x + z.L(4), y + z.L(6), r + z.L(8));
        ring.fillStyle(0xfff6e4, 1).fillCircle(x, y, r + z.L(8));
        ring.lineStyle(z.L(4), 0x7a5230, 1).strokeCircle(x, y, r + z.L(8));
        if (f > 0) {
          ring.fillStyle(warn ? 0xe0772e : 0x4f9a3a, 1);
          ring.slice(x, y, r, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-90 + 360 * f), false).fillPath();
        }
        // the knob on top, like a kitchen timer
        ring.fillStyle(0x7a5230, 1).fillRoundedRect(x - z.L(14), y - r - z.L(26), z.L(28), z.L(16), z.L(5));
      };
      drawRing();
      const ringScale = (s) => ring.setScale(s).setPosition(z.X(T.x) * (1 - s), z.Y(T.y) * (1 - s));

      /* ---------- throwing ---------- */
      const throwOne = () => {
        const pick = phase.bag.shift();
        let key = texFor(pick);
        const v = (k.variants || {})[pick];
        if (v && phase.kinds.some((x) => (v.near || []).includes(x)) && Math.random() < v.chance) key = variantTex(pick, v.color);
        const img = S.track(S.add.image(z.X(220 + Math.random() * 1120), z.Y(990), key).setDepth(D.item + 2));
        img.setScale(S.fitScale(key, z.L(size), z.L(size)));
        img.wordId = pick;
        img.phase = phase;
        img.vx = (z.X(760) - img.x) * (0.25 + Math.random() * 0.3);
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
      const sliceIt = (img) => {
        img.sliced = true;
        const id = img.wordId;
        // what counts is what Nani is asking for now (after a switch, the last ones are decoys)
        const ok = !!phase && phase.targets.includes(id);
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
              // the sharp knife also catches a second wanted one near the first
              const near = flying.find((o) => o.active && !o.sliced && phase.targets.includes(o.wordId) && Phaser.Math.Distance.Between(o.x, o.y, cur.x, cur.y) < z.L(220));
              if (near) sliceIt(near);
            }
          });
        }
        prev = cur;
      };
      const offs = [z.on("pointermove", move), z.on("pointerup", () => (prev = null))];
      let running = false; // the ring runs and vegetables fly (not while Nani gives the first order)
      let spawnT = 0;
      let roundT = 0;
      let last = performance.now();
      const stop = z.tick(() => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000) * Cook.speed;
        last = now;
        if (running && phase) {
          roundT += dt;
          left = Math.max(0, left - dt);
          spawnT -= dt;
          if (spawnT <= 0 && phase.bag.length) {
            throwOne();
            spawnT += phase.every;
          }
          drawRing();
          const sec = Math.ceil(left);
          if (sec < lastTick) {
            lastTick = sec;
            if (sec < T.warn && sec >= 0) {
              Cook.sfx.pop();
              ringScale(1.12);
              S.tweens.add({ targets: { s: 1.12 }, s: 1, duration: 250, onUpdate: (tw, o) => ringScale(o.s) });
            }
          }
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
        const needs = (id) => phase && phase.targets.includes(id) && (cut[id] || 0) < want[id];
        const alone = (o) => !flying.some((x) => x !== o && x.active && !x.sliced && Math.abs(x.x - o.x) < z.L(size * 0.9) && Math.abs(x.y - o.y) < z.L(size * 1.3));
        const tgt = flying.find((o) => inView(o) && needs(o.wordId) && alone(o));
        const dec = flying.find((o) => o.active && !o.sliced && o.y < z.Y(700) && o.y > z.Y(150) && phase && !phase.targets.includes(o.wordId) && Math.abs(o.x - (tgt ? tgt.x : -9999)) > z.L(260));
        const ahead = (o) => o.x + o.vx * 0.06 * Cook.speed;
        z.expect(
          tgt
            ? { kind: "slice", x: tgt.x, y: tgt.y, x1: ahead(tgt), y1: tgt.y - z.L(size * 0.8), x2: ahead(tgt), y2: tgt.y + z.L(size * 0.8), wrongs: dec ? [{ x: dec.x, y: dec.y }] : [] }
            : { kind: "wait" }
        );
      });
      S.ghost([[z.X(400), z.Y(450)], [z.X(1200), z.Y(380)]], { duration: 500, delay: z.guided ? 1200 : 6000 });
      // "only bo dungri. Ne hikdo tameto.": the number is always said
      const orderLine = (tg, first) =>
        Lang.join(tg.map((id, j) => Lang.line(j === 0 ? (first ? "only" : "now") : Lang.frames().any, Lang.phrase(Lang.countParts(want[id], id)))));
      for (const r of rounds) {
        phase = r;
        roundT = 0;
        UI.hideCount();
        if (r.i === 0) {
          // the ring starts once she's said it; after that, the switch comes while things fly
          await z.say(orderLine(r.targets, true), { hide }).catch(() => {});
          running = true;
          spawnT = 0;
        } else {
          z.say(orderLine(r.targets, false), { hide }).catch(() => {});
        }
        // the round lasts its share of the ring: its throws, then the air clears
        await new Promise((resolve) => {
          const off = z.tick(() => {
            if (roundT < r.secs || r.bag.length) return;
            if (r.i === rounds.length - 1 && flying.some((o) => o.active && !o.sliced)) return;
            off();
            resolve();
          });
        });
      }
      running = false;
      left = 0;
      drawRing();
      z.say(Lang.line("enough"), { ms: 900 }).catch(() => {});
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
      // a daal order at the lab's level with at least two vegetables (level 1: all at once; 2-3: a switch)
      let d = R.daal.make("nana", { level: L.level });
      const many = (o) => [o.onions, o.tomatoes, o.chillies].filter(Boolean).length >= 2;
      for (let i = 0; i < 30 && !many(d); i++) d = R.daal.make("nana", { level: L.level });
      L.card(d, ["Chop"]);
      await L.station("chop", { targets: { "veg-02": d.onions, "veg-03": d.tomatoes, "veg-12": d.chillies }, no: d.onions ? [] : ["veg-02"], pool: Cook.data.recipes.daal.lists.veg, tick: true });
    },
  });
})(window);
