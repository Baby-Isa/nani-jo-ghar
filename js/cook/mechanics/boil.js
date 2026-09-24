/*
 * Mechanic: boil (watch and turn it down). A ring round the pan fills like
 * a clock; bubbles grow as it nears the boil. The burner has a BIG knob
 * (the owner: it wasn't clear where to tap): tap it to light the burner
 * (needOn), and tap it again in the green to turn it down. Ignore it and
 * the pan boils over (foam everywhere; it costs the hand star), then the
 * knob turns itself down. Nani may interrupt mid-boil (Busy: it keeps
 * boiling while you help her).
 *
 * It can run on a back burner while another zone keeps you busy (the Chai
 * tray): canPost() says when it may ask for your attention, and it only
 * asks once the ring is within `quiet` of the green.
 * Params: vessel, knobAt [x, y] (design; default below-right of the pan),
 * needOn, canPost, onLit, ready (a promise: the ring starts after it), quiet.
 * Knobs (data.mechanics.boil): band, rate, rise, passMeAfterMs, overScore,
 * knobR (the knob's size), instant/instantMs (the chai machine).
 * Profiles: tray (the Chai tray's slower back-burner boil).
 */
(function (global) {
  const Cook = global.Cook;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /**
   * The burner's knob: a big dial with a pointer and a flame mark, plus
   * the flames under the pan. set("off" | "high" | "low") turns it.
   */
  function knob(z, vessel, at, r) {
    const S = z.S;
    const x = z.X(at.x);
    const y = z.Y(at.y);
    const R = z.L(r);
    const base = S.track(S.add.circle(x, y + z.L(6), R * 1.18, 0x1a1512, 0.5).setDepth(D.item - 1));
    const plate = S.track(S.add.circle(x, y, R * 1.12, 0x4a423c, 1).setStrokeStyle(z.L(5), 0x6b6158).setDepth(D.item));
    const dial = S.track(S.add.container(x, y).setDepth(D.item + 1));
    const g = S.add.graphics();
    g.fillStyle(0xe9e3d8, 1);
    g.fillCircle(0, 0, R);
    g.lineStyle(z.L(4), 0x8f8578, 1);
    g.strokeCircle(0, 0, R);
    // the grip bar and its pointer
    g.fillStyle(0xcfc6b8, 1);
    g.fillRoundedRect(-R * 0.26, -R * 0.92, R * 0.52, R * 1.84, R * 0.2);
    g.fillStyle(0xb24a3a, 1);
    g.fillTriangle(-R * 0.18, -R * 0.62, R * 0.18, -R * 0.62, 0, -R * 0.95);
    dial.add(g);
    // marks round the plate: off (a dot), high (a big flame), low (a small one)
    const marks = S.track(S.add.graphics().setDepth(D.item + 0.5));
    const flame = (fx, fy, s, col) => {
      marks.fillStyle(col, 1);
      marks.fillTriangle(fx - s * 0.5, fy + s * 0.4, fx + s * 0.5, fy + s * 0.4, fx, fy - s * 0.9);
      marks.fillCircle(fx, fy + s * 0.25, s * 0.5);
    };
    const ANG = { off: 0, high: 110, low: 200 };
    const markAt = (deg, d) => ({ x: x + Math.sin(Phaser.Math.DegToRad(deg)) * d, y: y - Math.cos(Phaser.Math.DegToRad(deg)) * d });
    const off = markAt(ANG.off, R * 1.32);
    marks.fillStyle(0xe9e3d8, 1);
    marks.fillCircle(off.x, off.y, z.L(7));
    const hi = markAt(ANG.high, R * 1.36);
    flame(hi.x, hi.y, z.L(22), 0x5aa0e8);
    const lo = markAt(ANG.low, R * 1.3);
    flame(lo.x, lo.y, z.L(12), 0x5aa0e8);
    // the flames under the pan, peeking out round its base
    const fl = S.track(S.add.graphics().setDepth(D.item - 0.5));
    let power = 0;
    let t = 0;
    const r0 = vessel.rim;
    const drawFlames = () => {
      fl.clear();
      if (power <= 0) return;
      const cx = r0.x;
      const cy = r0.y + r0.depth + r0.ry * 0.2;
      const rr = r0.rx * 1.02;
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const h = z.L(10 + power * 26) * (0.8 + 0.3 * Math.sin(t * 9 + i * 1.7));
        const fx = cx + Math.cos(a) * rr;
        const fy = cy + Math.sin(a) * r0.ry * 1.05;
        fl.fillStyle(0x3d7fd6, 0.75);
        fl.fillTriangle(fx - z.L(7), fy, fx + z.L(7), fy, fx + Math.cos(a) * h * 0.4, fy - h);
        fl.fillStyle(0xbfe0ff, 0.8);
        fl.fillTriangle(fx - z.L(3), fy, fx + z.L(3), fy, fx + Math.cos(a) * h * 0.25, fy - h * 0.55);
      }
    };
    z.tick(() => {
      t += 0.016 * Cook.speed;
      drawFlames();
    });
    // a big invisible hit area over the dial, so it's easy to tap
    const hit = S.track(S.add.circle(x, y, R * 1.35, 0xffffff, 0.001).setDepth(D.item + 2));
    hit.baseScale = 1;
    const k = {
      hit,
      dial,
      x,
      y,
      set(state, dur = 260) {
        power = { off: 0, high: 1, low: 0.35 }[state];
        S.tweens.add({ targets: dial, angle: ANG[state], duration: dur, ease: "Back.easeOut" });
        Cook.sfx.click();
      },
      parts: [base, plate, dial, marks, fl, hit],
    };
    return k;
  }

  Mech.define("boil", {
    profile: (p) => p.profile,
    async run(z, { vessel, knobAt, needOn = false, canPost, onLit, ready, quiet }, k) {
      const S = z.S;
      const at = St.pt(knobAt, { x: vessel.rim.x / z.k - z.ox / z.k + 200, y: 588 });
      const K = knob(z, vessel, at, k.knobR);
      if (needOn) {
        // light the burner: tap the knob
        await new Promise((resolve) => {
          if (z.guided) S.glow(K.hit, true);
          S.tappable(K.hit, () => {
            S.untap(K.hit);
            S.glow(K.hit, false);
            z.expect(null);
            resolve();
          });
          z.expect({ kind: "tap", x: K.x, y: K.y, key: "knob-on" });
        });
      }
      K.set("high");
      if (onLit) onLit();
      // the pan takes a moment to heat: the ring starts when `ready` resolves
      // (the Chai tray: once everyone has said how they like their chai)
      if (ready) await ready;
      if (k.instant) {
        await Cook.wait(k.instantMs);
        K.set("low");
        z.skill(100, "boil");
        return 1;
      }
      const bubbles = S.time.addEvent({
        delay: 120,
        loop: true,
        callback: () => {
          const p = vessel.surface();
          const lv = z._gauge ? z._gauge.level : 0;
          if (Math.random() > 0.35 + lv) return;
          const b = S.track(S.add.circle(p.x + (Math.random() - 0.5) * vessel.rimRx * 1.4, p.y + (Math.random() - 0.5) * vessel.rimRy, z.L(5 + Math.random() * 8 + lv * 8), 0xfff4e0, 0.9).setDepth(D.item + 1));
          S.tweens.add({ targets: b, y: b.y - z.L(10 + lv * 40), alpha: 0, scale: 1 + lv * 2, duration: 500, onComplete: () => b.destroy() });
          if (Math.random() < 0.3 + lv * 0.4) Cook.sfx.bubble();
        },
      });
      const boilLoop = Cook.sfx.boilLoop();
      S.loops.push(boilLoop);
      const base = vessel.level;
      // Nani sometimes interrupts mid-boil (Busy: it keeps boiling!)
      z.passMeAfter(k.passMeAfterMs);
      const [lo, hi] = k.band;
      // on a back burner: only ask for attention near the green, and never
      // while another zone is mid-gesture (a pour in progress)
      let held = null;
      let posted = false;
      let level = 0;
      const post = () => {
        const want = held && level >= lo - (quiet || 0) && (!canPost || canPost());
        if (want && !posted) z.expect(held);
        else if (!want && posted) z.expect(null);
        posted = !!want;
      };
      const io = quiet == null && !canPost ? z.io : {
        expect: (e) => {
          held = e;
          post();
        },
        gauge: (g) => {
          level = g.level;
          z.gauge(g);
          post();
        },
      };
      const v = await S.ring(K.hit, {
        x: vessel.rim.x,
        y: vessel.rim.y + vessel.rim.depth * 0.4,
        r: vessel.rimRx + z.L(40),
        lo,
        hi,
        rate: k.rate,
        alsoTap: [vessel],
        io,
        onLevel: (lv) => vessel.setLiquid(base + Math.min(1, lv) * k.rise),
      });
      if (posted) z.expect(null);
      bubbles.remove();
      boilLoop.stop();
      let score;
      if (v >= 1) {
        // boiled over: foam down the sides and onto the hob
        for (let i = 0; i < 14; i++) {
          const f = S.track(S.add.ellipse(vessel.rim.x + (Math.random() - 0.5) * vessel.rimRx * 2, vessel.rim.y, z.L(60), z.L(40), 0xfff6e6, 1).setDepth(D.item + 2));
          S.tweens.add({ targets: f, y: vessel.rim.y + vessel.rim.depth + Math.random() * z.L(90), x: f.x + (Math.random() - 0.5) * z.L(80), scale: 1.8, duration: 700, ease: "Bounce.easeOut" });
        }
        Cook.sfx.puff();
        z.oops();
        score = k.overScore;
      } else score = S.bandScore(v, lo, hi);
      K.set("low");
      z.skill(score, "boil");
      S.verdict(vessel.rim.x, vessel.rim.y - z.L(110), score, { bad: v >= 1 ? "boiled-over" : "too-early" });
      vessel.setLiquid(base);
      // a gentle simmer from now on
      S.time.addEvent({
        delay: 420,
        loop: true,
        callback: () => {
          if (!vessel.active) return;
          const p = vessel.surface();
          const b = S.track(S.add.circle(p.x + (Math.random() - 0.5) * vessel.rimRx, p.y, z.L(4 + Math.random() * 4), 0xfff4e0, 0.8).setDepth(D.item + 1));
          S.tweens.add({ targets: b, y: b.y - z.L(8), alpha: 0, duration: 500, onComplete: () => b.destroy() });
        },
      });
      z.progress({ boiled: v });
      await Cook.wait(400);
      return v;
    },
  });
  Cook.Boil = { knob };

  Mech.lab("boil", {
    name: "Boil",
    verb: "Light it, turn it down",
    async run(L) {
      L.card([Cook.Lang.wordLine("cook-paani")], ["boil"]);
      const z = await L.scene("watch", "hob");
      const pan = St.vessel(L.S, "pan", z.X(St.BURNER.left.x), z.Y(St.BURNER.left.y - 30), 1.35 * z.k);
      pan.setLiquid(0.5, 0x6b3a1c);
      await L.run("boil", z, { vessel: pan, needOn: true });
    },
  });
})(window);
