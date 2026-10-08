/*
 * Mechanic: chop (Fruit Ninja style). Vegetables are tossed up in volume;
 * slice only the ones Nani names, as many of each as she says ("Kali ba
 * dungri. Ne hakro tameto."), before the timer ring on the board runs
 * out. Decoys fly as often as each wanted vegetable (look-alikes among
 * them: a red onion next to the tomatoes), so what flies never tells you
 * what to cut.
 *
 * Level 1: one timed round with every vegetable the order names at once.
 * Levels 2-3 (`phases`): the round is split and Nani switches mid-round
 * ("Hane ba marcha!"): the next vegetables are the ones to slice, and the
 * last ones are now decoys; throws get faster.
 *
 * Chopping never ends by itself when you reach a number: the round runs
 * until the ring is empty (each wanted vegetable is thrown a few more
 * times than asked for). Too many or too few costs the accuracy badge (graded at
 * the end, so nothing on screen says when to stop); slicing the wrong one:
 * "Arre re!" and the accuracy badge. Kutchi: which ones, how many, and the switch.
 *
 * Params: targets {wordId: count} (zeros are left out), pool (what else
 * gets thrown), only (keep only targets in this list: the chaat chops what
 * goes in its bowl), no (vegetables they said no to), tick (tick the order
 * rows: daal). Daar's options (29 Sept, D1 / Q4; all default off, so chaat's chop is unchanged):
 * knifeKey (a texture: the kitchen kit's knife follows the finger instead of the hand, the no-hands
 * rule), onSlice({id, ok, x, y, key, scale}) (called on every slice: daar sends the pieces to the
 * side), tally (false: no picture tally, Q7), timer ({x, y, r, warn}: moves the countdown ring).
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
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";

(function (global) {
  const Cook = CookNS;
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
    async run(z, { targets = {}, pool = [], only, no = [], tick = false, knifeKey = null, blade = null, onSlice = null, onCount = null, tally = true, timer = null }, k) {
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
      // S04-B (DAAR-13, ART-17, Z8): the new knife (the art run's, no hand) is the mechanic's own default, wherever it's
      // run (the Chop tile too, not only daar); the old hand-and-knife only if that art can't load
      if (!knifeKey) {
        const kit = St.art("knife");
        if (kit) await Promise.race([St.load(S, [[St.artKey("knife"), kit.file]]), Cook.wait(4000)]);
        if (St.hasArt(S, "knife")) {
          knifeKey = St.artKey("knife");
          blade = blade || (kit.meta || {}).blade || null;
        }
      }
      let knife;
      if (knifeKey && S.textures.exists(knifeKey)) {
        // the kit's knife on its own (no hand): blade up, it follows the finger
        // DAAR-13 (D10): a smaller knife (was 260 px), the margin-safe cut so its tip is never clipped
        knife = S.track(S.add.image(z.X(1300), z.Y(640), knifeKey).setDepth(D.hand).setAngle(35));
        knife.setScale(z.L(k.knifePx || 190) / Math.max(knife.width, knife.height));
      } else knife = S.hand("knife", { x: z.X(1300), y: z.Y(640), angle: -25, k: z.k });
      if (k.special) S.special(knife);
      // bigger vegetables on a small (phone) screen, so a finger can hit them
      const small = S.scale && S.scale.displaySize && S.scale.displaySize.width < 800;
      const size = small ? k.phoneSize || k.size : k.size;
      const flying = [];
      let lastX = null;
      const cut = {};
      const sliced = {};
      let wrong = 0;
      const texFor = (id) => {
        const w = Cook.item(id) || {};
        const painted = Cook.Art.sprite(S, `${id}.whole`); // data.art.sprites (loaded by the station)
        if (painted) return painted;
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
      // DAAR-13 (D1): slower at level 1 (k.slow < 1): the throws keep their height (speed x a, gravity x a^2) but
      // take 1/a as long in the air, and come further apart
      const slow = k.slow || 1;
      const [v0, v1] = k.throwSpeed.map((v) => v * slow);
      const gravity = k.gravity * slow * slow;
      // how long a throw is in the air (up and back below the board), in game seconds
      const flight = (2 * v1) / gravity + 0.3;

      /* ---------- the rounds: what flies, how often, how long ---------- */
      const rounds = splitRounds(ids, Math.max(1, Math.min(k.phases || 1, ids.length))).map((tg, i) => {
        // decoys: look-alikes first, then the other vegetables (earlier rounds' ones too), the pool, the "no"s
        const L = [...new Set(tg.flatMap((t) => (k.lookalikes || {})[t] || []))];
        const others = ids.filter((x) => !tg.includes(x));
        const rest = Cook.shuffle(pool.filter((x) => !L.includes(x) && !others.includes(x)).concat(no));
        const nDecoys = Math.max(k.decoys, tg.length);
        const decoys = [...new Set(L.concat(Cook.shuffle(others), rest))].filter((x) => !tg.includes(x) && Cook.item(x)).slice(0, nDecoys);
        const kinds = tg.concat(decoys);
        // every kind once per cycle, so a wanted one never flies more often than a decoy
        const cycles = Math.max(...tg.map((t) => want[t])) + k.spare;
        const bag = [];
        for (let c = 0; c < cycles; c++) bag.push(...Cook.shuffle(kinds.slice()));
        const stage = Math.min(...tg.map((t) => Cook.wordStage(t)));
        const every = (k.every / slow) * (1 - Math.min(k.fasterMax, (stage - 1) * k.fasterPerStage));
        return { i, targets: tg, kinds, bag, every, secs: bag.length * every + flight };
      });
      const total = rounds.reduce((a, r) => a + r.secs, 0);
      let phase = null; // the round being thrown: {targets, kinds, bag, every, secs}

      /* ---------- the countdown ring (on the board, never over the throws) ---------- */
      const T = Object.assign({ x: 118, y: 124, r: 70, warn: 3 }, k.timer || {}, timer || {});
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
        // DAAR-13 (D1): spread wider across the board (each throw away from the last one)
        let x0 = 180 + Math.random() * 1200;
        if (lastX != null && Math.abs(x0 - lastX) < 300) x0 = lastX < 780 ? Math.min(1380, lastX + 300 + Math.random() * 300) : Math.max(180, lastX - 300 - Math.random() * 300);
        lastX = x0;
        const img = S.track(S.add.image(z.X(x0), z.Y(990), key).setDepth(D.item + 2));
        img.setScale(S.fitScale(key, z.L(size), z.L(size)));
        img.wordId = pick;
        img.phase = phase;
        img.vx = (z.X(760) - img.x) * (0.15 + Math.random() * 0.2) * slow;
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
        // the picture tally (top right): every slice you made, by kind; what you did, never the target
        sliced[id] = (sliced[id] || 0) + 1;
        if (tally) UI.count(sliced[id], { id, state: "whole", speak: ok });
        if (onSlice) onSlice({ id, ok: !!phase && phase.targets.includes(id), x: img.x, y: img.y, key: img.texture.key, scale: img.scale });
        if (ok) {
          cut[id] = (cut[id] || 0) + 1;
          // DAAR-13, rule E11: at level 1 the row lights the moment the count is reached
          if (cut[id] === want[id] && Cook.roundLevel(ctx) <= 1) {
            if (onCount) onCount(id);
            else if (tick && ctx.closeItem) ctx.closeItem([id]);
          }
          S.burst(img.x, img.y, [0xffffff, 0xf6d27a], 10, z.L(70));
          z.progress({ cut: id, n: cut[id] });
        } else {
          wrong++;
          z.listen(false, no.includes(id) ? `sliced ${id} (they said no)` : `sliced ${id}`);
          // level 1: one gentle "Arre re!" and a red burst; from level 2 the halves just fall grey (UX 11)
          if (z.quiet) S.burst(img.x, img.y, [0xd8d2c8, 0xb8b0a4], 10, z.L(60));
          else {
            z.oops();
            S.burst(img.x, img.y, [0xb24a3a, 0xffd6c9], 10, z.L(60));
          }
        }
        halves(img);
        img.destroy();
        return ok;
      };
      let prev = null;
      // DAAR-13 (D10): anything the blade passes through is cut too, not only the finger's line. blade: the edge's
      // two ends as fractions of the knife picture [tipX, tipY, heelX, heelY]
      const BL = blade || null;
      const bladeAt = () => {
        if (!BL || !knife.displayWidth) return null;
        const w = knife.displayWidth;
        const h = knife.displayHeight;
        const c = Math.cos(knife.rotation);
        const sn = Math.sin(knife.rotation);
        const at = (fx, fy) => {
          const lx = (fx - knife.originX) * w;
          const ly = (fy - knife.originY) * h;
          return { x: knife.x + lx * c - ly * sn, y: knife.y + lx * sn + ly * c };
        };
        return [at(BL[0], BL[1]), at(BL[2], BL[3])];
      };
      let prevBlade = null;
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
        const bl = bladeAt();
        if (prev && Phaser.Math.Distance.Between(prev.x, prev.y, cur.x, cur.y) > 12) {
          const lines = [new Phaser.Geom.Line(prev.x, prev.y, cur.x, cur.y)];
          if (bl) {
            lines.push(new Phaser.Geom.Line(bl[0].x, bl[0].y, bl[1].x, bl[1].y));
            if (prevBlade) lines.push(new Phaser.Geom.Line(prevBlade[0].x, prevBlade[0].y, bl[0].x, bl[0].y), new Phaser.Geom.Line(prevBlade[1].x, prevBlade[1].y, bl[1].x, bl[1].y));
          }
          flying.slice().forEach((img) => {
            if (!img.active || img.sliced) return;
            const c = new Phaser.Geom.Circle(img.x, img.y, img.displayWidth * 0.42);
            if (!lines.some((line) => Phaser.Geom.Intersects.LineToCircle(line, c))) return;
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
        prevBlade = bl;
      };
      // a swipe starts where the finger goes down
      const offs = [z.on("pointerdown", (p) => ((prev = { x: p.worldX, y: p.worldY }), (prevBlade = null), stopDemo())), z.on("pointermove", move), z.on("pointerup", () => ((prev = null), (prevBlade = null)))];
      let running = false; // the ring runs and vegetables fly (not while Nani gives the first order)
      let spawnT = 0;
      let roundT = 0;
      let last = performance.now();
      let gameRate = Cook.speed;
      const stop = z.tick(() => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000) * Cook.speed;
        // game seconds per real second (slow frames are capped), for the test's aim below
        if (now > last) gameRate += ((dt * 1000) / (now - last) - gameRate) * 0.2;
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
          img.vy += z.L(gravity) * dt;
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
        // aimed where each one will be when the swipe lands (the tester says how long its swipes take)
        const lead = (global.__cookSwipeLead || 0.25) * gameRate;
        const at = (o) => ({ x: o.x + o.vx * lead, y: o.y + o.vy * lead + 0.5 * z.L(gravity) * lead * lead, vy: o.vy + z.L(gravity) * lead });
        const inView = (o) => {
          const p = at(o);
          return o.active && !o.sliced && p.y < z.Y(760) && p.y > z.Y(120) && Math.abs(p.vy) < z.L(700);
        };
        const needs = (id) => phase && phase.targets.includes(id) && (cut[id] || 0) < want[id];
        // nothing it shouldn't cut next to it (another wanted kind that still needs cutting is fine)
        const alone = (o) => {
          const p = at(o);
          return !flying.some((x) => {
            if (x === o || !x.active || x.sliced || (x.wordId !== o.wordId && needs(x.wordId))) return false;
            const q = at(x);
            return Math.abs(q.x - p.x) < z.L(size * 0.9) && Math.abs(q.y - p.y) < z.L(size * 1.3);
          });
        };
        const tgt = flying.find((o) => inView(o) && needs(o.wordId) && alone(o));
        const dec = flying.find((o) => o.active && !o.sliced && at(o).y < z.Y(700) && at(o).y > z.Y(150) && phase && !phase.targets.includes(o.wordId) && Math.abs(o.x - (tgt ? tgt.x : -9999)) > z.L(260));
        const aim = tgt && at(tgt);
        const decAt = dec && at(dec);
        z.expect(
          tgt
            ? { kind: "slice", x: aim.x, y: aim.y, x1: aim.x, y1: aim.y - z.L(size * 0.8), x2: aim.x, y2: aim.y + z.L(size * 0.8), wrongs: dec ? [{ x: decAt.x, y: decAt.y }] : [] }
            : { kind: "wait" }
        );
      });
      // DAAR-13 (D1): the ghost finger DRAGS THE KNIFE left and right across the board (the knife goes with it) until
      // the first touch; without a knife picture, the ghost alone as before
      const stopDemo = knifeKey && knife.texture && knife.texture.key === knifeKey ? demoKnife() : S.ghost([[z.X(400), z.Y(450)], [z.X(1200), z.Y(380)]], { duration: 500, delay: z.guided ? 1200 : 6000 }).stop;
      function demoKnife() {
        const a = { x: z.X(420), y: z.Y(440) };
        const b = { x: z.X(1180), y: z.Y(400) };
        const home = { x: knife.x, y: knife.y };
        const nh = Cook.Hands && Cook.Hands.ghost ? Cook.Hands.ghost(S) : null;
        const dot = nh ? null : S.track(S.add.circle(0, 0, 26, 0xffffff, 0.75).setStrokeStyle(5, 0x3a2410, 0.35).setDepth(D.top));
        let tw = null;
        let alive = true;
        const go = () => {
          if (!alive) return;
          tw = S.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1400 / slow,
            onUpdate: (t) => {
              const u = t.getValue();
              const f = u < 0.5 ? u * 2 : 2 - u * 2; // across and back
              const x = a.x + (b.x - a.x) * f;
              const y = a.y + (b.y - a.y) * f + Math.sin(f * Math.PI) * z.L(-40);
              const al = u < 0.08 ? u / 0.08 : u > 0.92 ? (1 - u) / 0.08 : 1;
              knife.setPosition(x + z.L(40), y + z.L(20));
              if (nh) nh.at(x, y, al);
              if (dot) dot.setPosition(x, y).setAlpha(0.75 * al);
            },
            onComplete: () => alive && S.time.delayedCall(500, go),
          });
        };
        const t0 = S.time.delayedCall(z.guided ? 1200 : 4000, go);
        return () => {
          if (!alive) return;
          alive = false;
          t0.remove();
          if (tw) tw.stop();
          if (nh) nh.stop();
          if (dot && dot.active) dot.destroy();
          if (!prev) knife.setPosition(home.x, home.y);
        };
      }
      // "Kali ba dungri. Ne hakro tameto.": the number is always said
      const orderLine = (tg, first) =>
        Lang.join(tg.map((id, j) => Lang.line(j === 0 ? (first ? "only" : "now") : Lang.frames().any, Lang.phrase(Lang.countParts(want[id], id)))));
      for (const r of rounds) {
        phase = r;
        roundT = 0;
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
      stopDemo();
      left = 0;
      drawRing();
      // the ring's own "time's up" (not a verdict on the count)
      z.say(Lang.line("enough"), { ms: 900, caption: true }).catch(() => {});
      stop();
      offs.forEach((f) => f());
      z.expect(null);
      if (tally) UI.hideCount();
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
      });
      // the step has closed (the ring ran out): its rows tick, count rows too, right or not (UX 11)
      if (tick && ctx.closeItem) ctx.closeItem(ids);
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
