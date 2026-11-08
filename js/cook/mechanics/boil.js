/*
 * Mechanic: boil (watch and turn it down). A ring round the pan fills like
 * a clock; bubbles grow as it nears the boil. The burner has a BIG knob
 * (the owner: it wasn't clear where to tap): tap it to light the burner
 * (needOn), and tap it again in the green to turn it down. Ignore it and
 * the pan boils over (foam everywhere; it costs a hand job (not scored)), then the
 * knob turns itself down. Nani may interrupt mid-boil (Busy: it keeps
 * boiling while you help her).
 *
 * It can run on a back burner while another zone keeps you busy (a
 * combined station): canPost() says when it may ask for your attention, and it only
 * asks once the ring is within `quiet` of the green.
 * Params: vessel, knobAt [x, y] (design; default below-right of the pan),
 * needOn, canPost, onLit, ready (a promise: the ring starts after it), quiet.
 * Knobs (data.mechanics.boil): band, rate, rise, passMeAfterMs, overScore,
 * knobR (the knob's size), instant/instantMs (the brass machine upgrade).
 * Profiles: tray (the slower back-burner boil of a stove with a pan per person).
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  /**
   * The burner's knob: a big dial with a pointer and a flame mark, plus
   * the flames under the pan. set("off" | "high" | "low") turns it.
   */
  // the painted hob parts (sources/art/chatgpt-batch3/sheet-hob-parts-t-v1.png, cut by
  // build/cut_chai_station.py): the knob off and on, and the flame ring high and low
  const ART = [
    ["hob-knob-off", "assets/cook/items/chai-station/knob-off.webp"],
    ["hob-knob-on", "assets/cook/items/chai-station/knob-on.webp"],
    ["hob-flame-high", "assets/cook/items/chai-station/flame-high.webp"],
    ["hob-flame-low", "assets/cook/items/chai-station/flame-low.webp"],
  ];
  function knob(z, vessel, at, r) {
    const S = z.S;
    if (ART.every(([key]) => S.textures.exists(key))) return paintedKnob(z, vessel, at, r);
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

  /**
   * The painted knob (28 Sept, s8): the metal-ringed knob turns from off (grip upright) to
   * high and low, its amber ring lights when it's on, and the painted flame ring burns
   * under the pan (the big ring on high, the small one on low), flickering.
   */
  function paintedKnob(z, vessel, at, r) {
    const S = z.S;
    const x = z.X(at.x);
    const y = z.Y(at.y);
    const R = z.L(r);
    const size = R * 2.5;
    const base = S.track(S.add.image(x + R * 0.08, y + R * 0.14, S.tex("shadow")).setDisplaySize(size * 1.02, size * 0.98).setDepth(D.item - 1));
    const dial = S.track(S.add.container(x, y).setDepth(D.item + 1));
    const off = S.add.image(0, 0, "hob-knob-off").setDisplaySize(size, size);
    // the "on" art has its grip across: turned back a quarter so both grips line up
    const on = S.add.image(0, 0, "hob-knob-on").setDisplaySize(size, size).setAngle(-90).setAlpha(0);
    dial.add([off, on]);
    // small marks round the knob: off (a dot), high (a big flame), low (a small one)
    const marks = S.track(S.add.graphics().setDepth(D.item + 0.5));
    const ANG = { off: 0, high: 90, low: 180 };
    const markAt = (deg, d) => ({ x: x + Math.sin(Phaser.Math.DegToRad(deg)) * d, y: y - Math.cos(Phaser.Math.DegToRad(deg)) * d });
    const flameMark = (p, s) => {
      marks.fillStyle(0x5aa0e8, 0.95);
      marks.fillTriangle(p.x - s * 0.45, p.y + s * 0.35, p.x + s * 0.45, p.y + s * 0.35, p.x, p.y - s * 0.85);
      marks.fillCircle(p.x, p.y + s * 0.22, s * 0.45);
    };
    const o = markAt(ANG.off, size * 0.62);
    marks.fillStyle(0xf3ede2, 0.95);
    marks.fillCircle(o.x, o.y, z.L(6));
    flameMark(markAt(ANG.high, size * 0.64), z.L(18));
    flameMark(markAt(ANG.low, size * 0.62), z.L(11));
    // the flames under the pan, round its base
    const r0 = vessel.rim;
    const fx = r0.x;
    const fy = r0.y + r0.depth + r0.ry * 0.1;
    const ring = (key) => S.track(S.add.image(fx, fy, key).setDepth(D.item - 0.5).setAlpha(0));
    const hi = ring("hob-flame-high");
    const lo = ring("hob-flame-low");
    let power = 0;
    let t = 0;
    z.tick(() => {
      t += 0.016 * Cook.speed;
      const f = 1 + 0.025 * Math.sin(t * 17) + 0.015 * Math.sin(t * 29);
      hi.setScale((r0.rx * 3 / hi.width) * f, (r0.ry * 3 / hi.height) * f);
      lo.setScale((r0.rx * 3 / lo.width) * f, (r0.ry * 3 / lo.height) * f);
    });
    const hit = S.track(S.add.circle(x, y, R * 1.35, 0xffffff, 0.001).setDepth(D.item + 2));
    hit.baseScale = 1;
    return {
      hit,
      dial,
      x,
      y,
      set(state, dur = 260) {
        power = { off: 0, high: 1, low: 0.35 }[state];
        S.tweens.add({ targets: dial, angle: ANG[state], duration: dur, ease: "Back.easeOut" });
        S.tweens.add({ targets: on, alpha: power > 0 ? 1 : 0, duration: dur });
        S.tweens.add({ targets: hi, alpha: state === "high" ? 0.95 : 0, duration: dur * 1.4 });
        S.tweens.add({ targets: lo, alpha: state === "low" ? 0.95 : 0, duration: dur * 1.4 });
        Cook.sfx.click();
      },
      parts: [base, dial, marks, hi, lo, hit],
    };
  }

  Mech.define("boil", {
    profile: (p) => p.profile,
    async run(z, { vessel, knobAt, needOn = false, canPost, onLit, ready, quiet }, k) {
      const S = z.S;
      await St.loadArt(S, ART);
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
      // (a combined station: once everyone has said what they want)
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
  Cook.Boil = { knob, ART };

  /* =====================================================================================================================
   * THE KITCHEN KIT'S HEAT AND BOIL (Sprint 18, module map pieces 1 and 3; docs/architecture/module-map.md): one pan's heat
   * on a stove, for every game that cooks with heat. The game says what goes in the pan; the kit owns the knob's taps, the
   * heat's clock, the green window, too early, the boil-over and starting again, the first-time hold, the boil's steam and
   * the hob's simmer loop. Its window and times are the game's (its json), never the kit's.
   *
   *   const b = Mech.boil(S, pan, opts)
   *     S     the station's scene (Cook.CookScene: add, tweens, time, addTick, tappable, wiggle)
   *     pan   {x, y, r}: the pan's contents centre and rim radius, station px (the ring, the steam and the boil-over sit by
   *           it); the game's own fields on it are left alone
   *     opts  band [lo, hi]   the green window, heat 0..1                                     (the game's json)
   *           rate            heat a second up to the green; in it and past it rate x greenRate (the game's json)
   *           greenRate 0.5   CHAI-10: twice as fast to the green, half speed in it, so the turn-down keeps its time
   *           leadS 2         CHAI-63: the boil (bubbling, steam) starts this long before the green at every level
   *           id              whose pan (the test notes and logs: who)
   *           burner          a Cook.Kit.burner: the kit turns it (high, low, off) and wiggles its knob
   *           ring            a Cook.Kit.heatRing (else one is made at ringDepth); ringR: its radius (default pan.r)
   *           tap true        the kit takes the knob's taps (S.tappable(burner.knobHit)); false: the game calls b.tap()
   *           can()           false: a tap does nothing (the round over, the order not said yet)
   *           canLight()      false: a cold knob won't turn (nothing in the pan yet): the knob shakes, on.cantLight
   *           has()           false: an empty pan (no steam, no simmer)
   *           notNow "not-now"  the line a too-early tap says (data/cook.json lines: Mum's "not now"), null for none
   *           overResetMs 1100  a boiled-over pan starts again this long after
   *           steam {at, when}  the boil's painted steam (Juice.P.steam) from boilAt while heating, and the boil-over's two
   *                           puffs (Juice.P.puff): at() -> {x, y, w, depth} (default over the pan), when() -> bool; false: none
   *           puff {r}        the boil-over puffs' size (the contents' radius; default pan.r x 0.93)
   *           bind            true: pan.state and pan.heat read and write b's (a game that keeps reading its pan's state)
   *           on              the game's part, each (b, ...): light (before it lights), early, green (it enters the green),
   *                           down (b, score: turned down in the green), over, again (it starts again), cantLight,
   *                           tick (b, dt: each frame it heats), changed (b, what: after every step: light, down, over, again)
   *     b     {pan, id, state: "cold" | "heating" | "ready" | "over", heat, lo, hi, boilAt, phase(), tap(), light(), down(),
   *            over(), reset(), stop()}
   *
   *   Mech.boil.stove(S, opts)    the hob's shared part, one per scene (made by the first Mech.boil if the game didn't):
   *           log             the prefix of the test notes (Lifecycle `<log>-boil`, `<log>-down`, `<log>-simmer`): the game's
   *           hold            SH-158: the first time a child meets the boil the heat holds in the green (holdAt of the way
   *                           in, 0.5) until the knob is tapped (notes timed-hold start / end); onHoldEnd() when it ends
   *           sound true      the simmer loop by the hottest pan on the heat (simmerDb: CHAI-95), stopped at done()
   *           done()          true: the round is over (the loop stops)
   *           clock()         ms now (performance.now; a test passes its own)
   *     -> {boilLog, simmerLog, pans, hold, stop() (the loop and steam off), end() (gone with the view: the scene's clearView)}
   *   Mech.boil.settings({level, profile, heat})   the window and times: data.mechanics.boil at level (its profile) under the
   *                                                game's own `heat` (its json): {band, rate, ...}
   *   Mech.boil.times({band, rate, greenRate, leadS})  {toBoil, toGreen, green, toOver, boilAt} in seconds (the lab's readout)
   *   Mech.boil.simmerDb(heat, boilAt, hi)          the loop's level in dB: -24 rising evenly to -2.5 at boilAt, held through
   *                                                the green, up to 0 dB at a boil-over
   *   Mech.boil.art(), Mech.boil.sounds            what to load (the steam wisps) and preload (knob, flame, green, simmer)
   * ===================================================================================================================== */
  const J = () => (global.Juice && global.Juice.P) || null;
  const note = (what, step, by) => {
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note(what, { step: String(step), by: String(by) });
    } catch (e) {
      /* only a log */
    }
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const BOIL_DEFAULTS = { greenRate: 0.5, leadS: 2, overResetMs: 1100, notNow: "not-now", holdAt: 0.5, notNowGapMs: 1500 };
  // CHAI-95: the simmer's level by heat in decibels from the file's own level (0 dB): even in decibels from -24 dB at the first
  // heat to 75% (-2.5 dB) as the bubbling starts (boilAt), held through the green, then up to 0 dB at a boil-over (heat 1)
  const SIMMER_DB = { from: -24, held: 20 * Math.log10(0.75), top: 0 };
  const simmerDb = (h, boilAt, hi) => {
    const S0 = SIMMER_DB;
    if (h <= boilAt) return S0.from + (S0.held - S0.from) * clamp(h / Math.max(0.01, boilAt), 0, 1);
    if (h <= hi) return S0.held;
    return S0.held + (S0.top - S0.held) * clamp((h - hi) / Math.max(0.01, 1 - hi), 0, 1);
  };
  const boilAtOf = (lo, rate, leadS = BOIL_DEFAULTS.leadS) => Math.max(0.3, lo - rate * leadS);
  /** one step of the heat's clock: rate a second up to the green, rate x greenRate in it and past it (CHAI-10) */
  const step = (heat, dt, { lo, rate, greenRate = BOIL_DEFAULTS.greenRate }) => heat + rate * (heat >= lo ? greenRate : 1) * dt;
  function times({ band, rate, greenRate = BOIL_DEFAULTS.greenRate, leadS = BOIL_DEFAULTS.leadS }) {
    const [lo, hi] = band;
    const boilAt = boilAtOf(lo, rate, leadS);
    const slow = rate * greenRate;
    return { boilAt, toBoil: boilAt / rate, toGreen: lo / rate, green: (hi - lo) / slow, toOver: lo / rate + (1 - lo) / slow };
  }

  /** The hob's shared part: one clock for every pan on the heat, the first-time hold, the simmer loop. */
  function stove(S, opts) {
    if (S.__boilStove && !S.__boilStove.dead) {
      if (opts) Object.assign(S.__boilStove.o, opts);
      return S.__boilStove;
    }
    const o = Object.assign({ log: "boil", hold: false, holdAt: BOIL_DEFAULTS.holdAt, sound: true, done: () => false, clock: () => performance.now() }, opts || {});
    const st = { o, pans: [], boilLog: [], simmerLog: [], hold: { on: !!o.hold, since: null }, loop: null, binAt: null };
    S.__boilStove = st;
    st.note = (what, step, by) => note(`${st.o.log}-${what}`, step, by);
    st.holdOn = () => st.hold.on;
    st.endHold = (b) => {
      if (!st.hold.on) return;
      st.hold.on = false;
      if (st.hold.since) note("timed-hold", "end", `${b.id} ${b.heat.toFixed(3)} ${Date.now() - st.hold.since}ms`);
      st.hold.since = null;
      if (st.o.onHoldEnd) st.o.onHoldEnd(b);
    };
    const sound = () => {
      const o2 = st.o;
      const hot = st.pans.reduce((m, b) => (b.state === "heating" && b.has() && (!m || b.heat > m.heat) ? b : m), null);
      if (hot && o2.sound && !o2.done()) {
        const db = simmerDb(hot.heat, hot.boilAt, hot.hi);
        const k = Math.pow(10, db / 20);
        if (!st.loop || st.loop.none) st.loop = Cook.sfx.simmerLoop(k);
        else st.loop.pitch(k);
        simmerNote(hot, db, k);
      } else if (st.loop) st.loop = (st.loop.stop(), null);
    };
    // (the log, CHAI-95's check: the loop's level by heat, a line each 0.05 of heat and at the bubbling, the green's start and end)
    const simmerNote = (b, db, k) => {
      const h = b.heat;
      const mark = b.phase();
      const bin = `${b.id}:${mark}:${Math.floor(h / 0.05)}`;
      if (bin === st.binAt) return;
      st.binAt = bin;
      const row = { who: b.id, heat: Math.round(h * 1000) / 1000, db: Math.round(db * 10) / 10, level: Math.round(k * 1000) / 1000, mark, boilAt: Math.round(b.boilAt * 1000) / 1000, lo: b.lo, hi: b.hi };
      st.simmerLog.push(row);
      st.note("simmer", `${row.db} dB`, `${b.id} heat ${row.heat} level ${row.level} ${mark}`);
    };
    let last = o.clock();
    st.tick = () => {
      const now = st.o.clock();
      const dt = Math.min(0.1, (now - last) / 1000) * (Cook.speed || 1);
      last = now;
      st.pans.slice().forEach((b) => b.tick(dt));
      sound();
    };
    st.stopTick = S.addTick ? S.addTick(st.tick) : null;
    /** silent: the loop and the steam stop (the round's end; the pans keep their state) */
    st.stop = () => {
      if (st.loop) st.loop = (st.loop.stop(), null);
      st.pans.forEach((b) => b.steamOff());
    };
    /** gone with the view (the scene's clearView, or the scene shut down): nothing ticks, rings on or starts again */
    st.end = () => {
      st.stop();
      st.dead = true;
      st.pans.slice().forEach((b) => b.stop());
      if (st.stopTick) st.stopTick();
      if (S.__boilStove === st) S.__boilStove = null;
    };
    // (a station left mid-boil: the loop never rings on; the next station's pans get a stove of their own)
    if (S.loops) S.loops.push({ stop: st.end });
    if (S.events && S.events.once) ["shutdown", "destroy"].forEach((ev) => S.events.once(ev, st.end));
    return st;
  }

  function boil(S, pan, opts = {}) {
    const st = stove(S);
    const o = Object.assign({}, BOIL_DEFAULTS, opts);
    const on = o.on || {};
    const call = (name, ...a) => (on[name] ? on[name](b, ...a) : undefined);
    const [lo, hi] = o.band;
    const burner = o.burner || null;
    const ring = o.ring || (Cook.Kit && Cook.Kit.heatRing ? Cook.Kit.heatRing(S, o.ringDepth != null ? { depth: o.ringDepth } : {}) : null);
    const has = o.has || (() => true);
    const can = o.can || (() => true);
    const steamAt = () => (o.steam && o.steam.at ? o.steam.at(b) : { x: pan.x, y: pan.y - pan.r * 0.64, w: pan.r * 2.4, depth: D.fx - 2 });
    const steamWhen = () => !o.steam || !o.steam.when || o.steam.when(b);
    const puffR = (o.puff && o.puff.r) || pan.r * 0.93;
    let steamFx = null;
    let noAt = 0;
    const logBoil = (what) => {
      st.boilLog.push({ who: b.id, what, heat: Math.round(b.heat * 1000) / 1000, lo, hi });
      st.note("boil", what, `${b.id} ${b.heat.toFixed(3)}`);
    };
    const knobObj = () => (burner ? burner.knob : null);
    const b = {
      pan,
      id: o.id != null ? o.id : st.pans.length,
      state: "cold",
      heat: 0,
      lo,
      hi,
      rate: o.rate,
      boilAt: boilAtOf(lo, o.rate, o.leadS),
      opts: o,
      ring,
      has,
      /** where the heat is: cold | rising | bubbling | green | past-green | ready | over */
      phase() {
        if (b.state !== "heating") return b.state;
        const h = b.heat;
        return h >= hi ? "past-green" : h >= lo ? "green" : h >= b.boilAt ? "bubbling" : "rising";
      },
      drawRing() {
        if (ring) ring.draw(pan.x, pan.y, o.ringR || pan.r, b.heat, lo, hi);
      },
      /** the knob's tap: light it, too early, turn it down in the green, or boil it over past the green */
      tap() {
        if (!can()) return;
        if (b.state === "cold") {
          if (o.canLight && !o.canLight(b)) {
            if (knobObj() && S.wiggle) S.wiggle(knobObj());
            call("cantLight");
            return;
          }
          b.light();
        } else if (b.state === "heating") {
          // CHAI-57 (decision 5): before the green the knob shakes, Nani says "not now" and the heat runs on, nothing marked;
          // in the green it turns down; past it, it boils over and that pot starts again
          if (b.heat < lo) {
            if (knobObj() && S.wiggle) S.wiggle(knobObj());
            logBoil("early");
            const now = Date.now();
            if (o.notNow && !(now - noAt < o.notNowGapMs) && !(Cook.UI && Cook.UI.naniMuted && Cook.UI.naniMuted())) {
              noAt = now;
              const line = Cook.Lang && Cook.Lang.line ? Cook.Lang.line(o.notNow) : null; // (G26: the engine's line, never the data's)
              if (line && Cook.UI && Cook.UI.voice) Cook.UI.voice(line, { ms: 900 }).catch(() => {});
            }
            call("early");
            return;
          }
          // (SH-158: the tap ends the first-time hold, for good)
          st.endHold(b);
          if (b.heat > hi) return b.over();
          b.down();
        }
      },
      light() {
        call("light");
        b.state = "heating";
        if (burner) burner.set("high");
        call("changed", "light");
      },
      /** turned down (over: the heat ran out with no tap: it boils over instead) */
      down(over = false) {
        st.note("down", b.heat.toFixed(3), `${lo}/${hi}/${b.id}`); // (contract-70)
        if (over) return b.over();
        b.state = "ready";
        if (ring) ring.clear();
        if (burner) burner.set("low");
        logBoil("green");
        const score = S.bandScore ? S.bandScore(b.heat, lo, hi) : 100;
        call("down", score);
        b.heat = Math.min(b.heat, hi);
        b.steamOff();
        call("changed", "down");
        return score;
      },
      /** CHAI-57 (decision 5c): boiled over: the steam puffs, the fire off, then the pan starts again (no verdict, no mark) */
      over() {
        if (b.state === "over") return;
        logBoil("over");
        b.state = "over";
        b.heat = 1;
        if (ring) ring.clear();
        if (burner) burner.set("off");
        b.steamOff();
        const P = o.steam !== false && J();
        if (P) {
          P.puff(S, pan.x - puffR * 0.5, pan.y - puffR * 0.9, { w: puffR * 0.7 * 1.4, depth: D.fx + 2 });
          P.puff(S, pan.x, pan.y - puffR * 1.1, { w: puffR * 0.8 * 1.4, depth: D.fx + 2 });
        }
        Cook.sfx.puff();
        call("over");
        call("changed", "over");
        b.againAt = Cook.wait(o.overResetMs).then(() => {
          if (b.stopped || b.state !== "over" || !can()) return;
          b.state = "cold";
          b.heat = 0;
          call("again");
          logBoil("again");
          call("changed", "again");
        });
      },
      /** back to cold, the knob off (a game's own restart) */
      reset() {
        b.state = "cold";
        b.heat = 0;
        if (ring) ring.clear();
        if (burner) burner.set("off", true);
        b.steamOff();
      },
      steamOff() {
        if (steamFx) steamFx = (steamFx.stop(), null);
      },
      /** one frame of heat (the stove's clock calls it) */
      tick(dt) {
        if (b.stopped) return;
        if (b.state === "heating") {
          const was = b.heat >= lo && b.heat <= hi;
          b.heat = step(b.heat, dt, { lo, rate: o.rate, greenRate: o.greenRate });
          // (SH-158: the first time, the heat waits in the middle of the green until the knob is tapped)
          const holdAt = lo + (hi - lo) * st.o.holdAt;
          if (st.hold.on && b.heat > holdAt) {
            b.heat = holdAt;
            if (!st.hold.since) {
              st.hold.since = Date.now();
              note("timed-hold", "start", `${b.id} ${b.heat.toFixed(3)}`);
            }
          }
          const inBand = b.heat >= lo && b.heat <= hi;
          if (inBand && !was) {
            Cook.sfx.green(); // (CHAI-92, Zafar's pick green A: a kitchen oven's ding, so the moment to turn it down is heard)
            call("green");
          }
          b.drawRing();
          call("tick", dt);
          if (b.heat >= 1) b.down(true);
        }
        // CHAI-63, CHAI-92: the painted steam from the boil's start (boilAt) until the pan leaves the heat
        const steaming = o.steam !== false && b.state === "heating" && b.heat >= b.boilAt && has() && steamWhen();
        if (steaming && !steamFx && J()) {
          const at = steamAt();
          steamFx = J().steam(S, at.x, at.y, { w: at.w, depth: at.depth });
        } else if (!steaming && steamFx) b.steamOff();
      },
      /** off the stove for good (the round's end): no more ticks, steam or taps */
      stop() {
        b.stopped = true;
        b.steamOff();
        const i = st.pans.indexOf(b);
        if (i >= 0) st.pans.splice(i, 1);
      },
    };
    // bind: the pan's own state and heat are the kit's (a game reading or resetting pan.state / pan.heat reaches b)
    if (o.bind) ["state", "heat"].forEach((k) => Object.defineProperty(pan, k, { get: () => b[k], set: (v) => (b[k] = v), configurable: true, enumerable: true }));
    st.pans.push(b);
    if (burner && o.tap !== false && S.tappable) S.tappable(burner.knobHit, () => b.tap());
    return b;
  }
  boil.stove = stove;
  boil.step = step;
  boil.times = times;
  boil.simmerDb = simmerDb;
  boil.boilAt = boilAtOf;
  boil.SIMMER_DB = SIMMER_DB;
  boil.DEFAULTS = BOIL_DEFAULTS;
  /** the window and times: data.mechanics.boil at `level` (and its profile), the game's own heat over it (its json) */
  boil.settings = ({ level = 1, profile, heat } = {}) => Object.assign(Mech.knobs("boil", { level, profile }), heat || {});
  boil.art = () => (J() ? J().keys(["st-1", "st-2", "st-3"]) : []);
  boil.sounds = ["knob", "flame", "green", "simmer"];
  Mech.boil = boil;

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
