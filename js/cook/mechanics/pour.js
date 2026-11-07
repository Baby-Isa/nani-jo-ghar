/*
 * Mechanic: pour.
 *
 * Wave 6b (docs/design-language/ux-principles.md 12; the quality pass, Q5): where things
 * are tapped in, liquids are tapped in too. A TAP on the jug (or the pan)
 * pours ONE measure: the pouring jug slides in over the target, the liquid
 * rises to the next dashed line with the pour sound and its rising pitch,
 * and stops there by itself; the jug slides back (Cook.Pour.measure). So
 * pouring is counting, like the sugar spoons, and it's the same gesture at
 * every level. A tap can't miss the line, so a pour has no hand score (the
 * Chai tray's hand job (not scored) is the knob alone). The press-and-hold pour below
 * (Cook.Pour.hold) stays for any mode that still wants it.
 *
 * Wave 3 (the owner's jug design, the hold):
 * The jug, jar or pan you press is an ICON that never moves. Press and
 * hold it: a pouring copy slides in from above over the target (a pan, a
 * cup), tilts and pours while you hold; let go and it slides back up. The
 * liquid rises inside the target past dashed fill lines, and the pouring
 * sound rises in pitch. Nani says "Enough!" at the line while the word is
 * new (enoughUntilStage).
 *
 * Two forms, the same gesture:
 *  - from a jug (params.liquid): water, milk… into params.vessel;
 *  - from a vessel (params.source) into params.vessel: the chai pan into
 *    a cup (the Chai tray uses Cook.Pour.hold directly, cup by cup).
 * Kutchi: which liquid (water/milk), "no dudh"; half/full at the Chai tray.
 * Knobs (data.mechanics.pour): rate (vessels per second), bandScale,
 * enoughUntilStage, spillScore, auto (the special jug: sticks at each
 * line for stickMs), slideMs (the jug sliding in), minPour (less is a tap,
 * not a pour), instant (the chai machine pours for you).
 * Profiles: water, milk, cup.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "../life.js";
import { NjgPour } from "../../shared/pour.js";
import "./pan.js"; // the kitchen kit's pan (Cook.Kit.pan): the pour pieces below move and show it

(function (global) {
  const Cook = CookNS;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const band = (target, k) => {
    const [lo, hi] = target;
    if (!k.bandScale || k.bandScale === 1) return [lo, hi];
    const c = (lo + hi) / 2;
    const h = ((hi - lo) / 2) * k.bandScale;
    return [c - h, c + h];
  };

  /** Where a vessel's surface sits at level L (the same shape St.vessel draws). */
  function surfaceAt(vessel, L) {
    const r = vessel.rim;
    const k = Cook.clamp(L, 0, 1.05);
    const s = 0.78 + 0.22 * k;
    return { x: r.x, y: r.y + r.depth * (1 - k) * 0.85, rx: r.rx * s * 0.96, ry: r.ry * s * 0.9 };
  }

  /**
   * The pour stream (28 Sept, s8): a short tapered stream from the spout that falls in a
   * curve onto the surface, with a light core and a small splash ring where it lands.
   * SH-117: its shape is the shared pour's (js/shared/pour.js NjgPour.stream), the one every game draws.
   */
  function drawStream(g, sp, p, col, w, t) {
    g.clear();
    const s = NjgPour.stream(sp, p, w, t);
    g.fillStyle(col, 0.9);
    g.fillPoints(s.poly, true);
    g.lineStyle(Math.max(1, w * 0.18), 0xffffff, 0.35);
    g.strokePoints(s.core, false);
    // the splash where it lands
    g.lineStyle(Math.max(1, w * 0.2), 0xffffff, 0.45);
    g.strokeEllipse(s.splash.x, s.splash.y, s.splash.rx * 2, s.splash.ry * 2);
    g.fillStyle(col, 0.9);
    g.fillEllipse(s.pool.x, s.pool.y, s.pool.rx * 2, s.pool.ry * 2);
  }

  /**
   * Dashed fill lines drawn inside a vessel: [{at, strong}]. The same
   * lines on every cup, so where they sit never answers the order.
   */
  function lines(S, vessel, list) {
    const g = S.track(S.add.graphics().setDepth(D.item + 0.6));
    const draw = () => {
      g.clear();
      list.forEach(({ at, strong }) => {
        const p = surfaceAt(vessel, at);
        const w = Math.max(3, vessel.rim.rx / 16);
        for (let t = 0; t < Math.PI * 2; t += 0.3) {
          // the near half of the ring bolder, like a line on the glass
          const near = Math.sin(t + 0.08) > 0;
          g.lineStyle(w, strong ? 0x2f5a2b : 0x4f6b4b, near ? 0.95 : 0.55);
          g.lineBetween(p.x + Math.cos(t) * p.rx, p.y + Math.sin(t) * p.ry, p.x + Math.cos(t + 0.16) * p.rx, p.y + Math.sin(t + 0.16) * p.ry);
        }
      });
    };
    draw();
    return { g, clear: () => g.clear(), destroy: () => g.destroy(), redraw: draw };
  }

  /**
   * Hold `icon` to pour into `vessel` (or vessel() at the moment you
   * press). The icon stays put; `art` (a texture key) slides in from above,
   * tilts and pours while held. Resolves {level, poured, vessel} when a
   * pour ends; a tap too short to pour keeps waiting.
   * opts: z, icon, vessel, art, artSize, color (number or fn(level) ->
   * number), rate, lo/hi (the gauge band for the tester), stick (levels the
   * special jug sticks at), stickMs, slideMs, minPour, maxLevel, io,
   * onStart(vessel), onLevel(level, vessel), onCancel(vessel) (a tap too
   * short to pour), enough {lo, say} (Nani's
   * "Enough!"), expect (post the hold expectation; default true).
   */
  function hold(z, o) {
    const S = z.S;
    const io = o.io || z.io;
    return new Promise((resolve) => {
      let state = "idle"; // idle | in | pour | out
      let target = null;
      let level = 0;
      let from = 0;
      let jug = null;
      let loop = null;
      let stuckAt = null;
      let stuckMs = 0;
      let saidEnough = false;
      let done = false;
      const stream = S.track(S.add.graphics().setDepth(D.fx));
      const spout = () => {
        // the pouring lip: top-left of the art, turned with it
        const a = Phaser.Math.DegToRad(jug.angle);
        const lx = -jug.displayWidth * 0.42;
        const ly = -jug.displayHeight * 0.34;
        return { x: jug.x + lx * Math.cos(a) - ly * Math.sin(a), y: jug.y + lx * Math.sin(a) + ly * Math.cos(a) };
      };
      const colorAt = (lv) => St.color(typeof o.color === "function" ? o.color(lv, target) : o.color);
      const start = () => {
        if (state !== "idle" || done) return;
        target = typeof o.vessel === "function" ? o.vessel() : o.vessel;
        if (!target) return;
        from = level = target.level || 0;
        stuckAt = null;
        state = "in";
        if (o.onStart) o.onStart(target);
        const r = target.rim;
        const size = o.artSize || Math.max(z.L(170), r.rx * 2.6);
        if (!jug) {
          jug = S.track(S.add.image(0, 0, o.art).setDepth(D.hand - 1));
          // the player's hand hooks the jug's handle while it pours (js/cook/hands.js)
          if (Cook.Hands) Cook.Hands.attach(S, jug, "pour", { at: [0.4, 0.02], k: z.k * 0.8, turn: 0.12 });
        }
        jug.setScale(S.fitScale(o.art, size, size));
        const hx = r.x + r.rx * 0.55 + jug.displayWidth * 0.36;
        const hy = r.y - r.ry - jug.displayHeight * 0.18;
        jug.setPosition(hx + z.L(60), -jug.displayHeight).setAngle(0).setVisible(true);
        Cook.sfx.whoosh();
        S.tweens.add({
          targets: jug,
          x: hx,
          y: hy,
          angle: -52,
          duration: o.slideMs,
          ease: "Cubic.easeOut",
          onComplete: () => {
            if (state !== "in") return;
            state = "pour";
            loop = Cook.sfx.pourLoop();
          },
        });
      };
      const away = () => {
        stream.clear();
        if (loop) loop.stop();
        loop = null;
        if (!jug) return;
        S.tweens.killTweensOf(jug);
        S.tweens.add({
          targets: jug,
          x: jug.x + z.L(80),
          y: -jug.displayHeight,
          angle: 0,
          duration: o.slideMs,
          ease: "Cubic.easeIn",
          onComplete: () => jug && jug.setVisible(false),
        });
      };
      const stop = () => {
        if (state !== "in" && state !== "pour") return;
        state = "idle";
        away();
        if (level - from < o.minPour) {
          // a tap, not a pour: keep waiting
          if (target) target.setLiquid(from > 0.01 ? from : 0);
          level = from;
          if (o.onCancel) o.onCancel(target);
          return;
        }
        finish();
      };
      const finish = () => {
        done = true;
        off();
        S.input.off("pointerup", stop);
        S.untap(o.icon);
        S.glow(o.icon, false);
        if (o.expect !== false) io.expect(null);
        setTimeout(() => stream.destroy(), 400);
        resolve({ level, poured: level - from, vessel: target });
      };
      o.icon.handAction = false; // the hand is on the jug instead
      S.tappable(o.icon, start);
      S.input.on("pointerup", stop);
      let last = performance.now();
      const off = z.tick(() => {
        const now = performance.now();
        const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
        last = now;
        if (state !== "pour") return;
        // the special jug sticks at each line for a moment
        if (stuckAt != null) {
          stuckMs += dt * 1000;
          if (stuckMs < o.stickMs) return;
        }
        const next = Math.min(o.maxLevel || 1.08, level + o.rate * dt);
        const line = (o.stick || []).find((s) => level < s && next >= s && s !== stuckAt);
        level = line != null ? line : next;
        if (line != null) {
          stuckAt = line;
          stuckMs = 0;
          Cook.sfx.click();
        }
        const col = colorAt(level);
        target.setLiquid(level, col);
        if (loop && loop.pitch) loop.pitch(level);
        const p = surfaceAt(target, level);
        const sp = spout();
        stream.clear();
        stream.lineStyle(Math.max(4, target.rim.rx / 9), col, 0.85);
        stream.lineBetween(sp.x, sp.y, p.x + target.rim.rx * 0.2, p.y);
        if (o.onLevel) o.onLevel(level, target);
        if (o.lo != null) io.gauge({ level, lo: o.lo, hi: o.hi });
        if (o.enough && !saidEnough && level >= o.enough.lo) {
          saidEnough = true;
          if (o.enough.say) z.say(Lang.line("enough"), { ms: 900 }).catch(() => {});
        }
        if (level > 1.0 && !target.spilled) {
          target.spilled = true;
          S.burst(target.rim.x + target.rim.rx, target.rim.y, [col, 0xffffff], 14, z.L(60));
        }
        if (level >= (o.maxLevel || 1.08)) {
          state = "idle";
          away();
          finish();
        }
      });
      if (o.expect !== false) {
        const c = S.centre(o.icon);
        io.gauge({ level: (typeof o.vessel === "function" ? (o.vessel() || {}).level : o.vessel.level) || 0, lo: o.lo, hi: o.hi });
        io.expect({ kind: "hold", x: c.x, y: c.y });
      }
    });
  }

  /**
   * Wave 6b: tap `icon` to pour ONE measure into `vessel` (or vessel() at
   * the tap): the jug `art` slides in from above, the liquid rises from
   * where it is to next(level, vessel) (the next dashed line; null: nothing
   * to pour, the tap does nothing), then the jug slides away. Resolves
   * {level, poured, vessel} when that pour is done (tap again for another
   * measure: call measure() again).
   * opts: z, icon, vessel, art, artSize, color (number or fn(level) -> number),
   * next(level, vessel) -> level | null, pourMs (one measure's pour), slideMs,
   * io, expect (post the tap expectation; default true), key, onStart(vessel),
   * onLevel(level, vessel).
   */
  function measure(z, o) {
    const S = z.S;
    const io = o.io || z.io;
    return new Promise((resolve) => {
      let busy = false;
      let jug = null;
      const stream = S.track(S.add.graphics().setDepth(D.fx));
      const colorAt = (lv, target) => St.color(typeof o.color === "function" ? o.color(lv, target) : o.color);
      // the pouring lip, as a fraction of the art from its centre (o.spout; default: a jug's
      // lip, top left), turned with it
      const lip = o.spout || [-0.42, -0.34];
      const tilt = o.tilt != null ? o.tilt : -52;
      const offAt = (deg) => {
        const a = Phaser.Math.DegToRad(deg);
        const lx = jug.displayWidth * lip[0];
        const ly = jug.displayHeight * lip[1];
        return { x: lx * Math.cos(a) - ly * Math.sin(a), y: lx * Math.sin(a) + ly * Math.cos(a) };
      };
      const spout = () => {
        const d = offAt(jug.angle);
        return { x: jug.x + d.x, y: jug.y + d.y };
      };
      const tween = (cfg) => new Promise((r) => S.tweens.add(Object.assign({}, cfg, { onComplete: r })));
      const pour = async () => {
        if (busy) return;
        const target = typeof o.vessel === "function" ? o.vessel() : o.vessel;
        if (!target) return;
        const from = target.level || 0;
        const to = o.next ? o.next(from, target) : null;
        if (to == null || to <= from + 0.005) {
          // nothing more to pour here: the jug just bobs (never a "wrong")
          S.tweens.add({ targets: o.icon, y: o.icon.y - z.L(10), duration: 90, yoyo: true });
          return;
        }
        busy = true;
        if (o.expect !== false) io.expect({ kind: "wait" });
        if (o.onStart) o.onStart(target);
        const r = target.rim;
        const size = o.artSize || Math.max(z.L(170), r.rx * 2.6);
        if (!jug) {
          jug = S.track(S.add.image(0, 0, o.art).setDepth(D.hand - 1));
          // the player's hand hooks the jug's handle while it pours (js/cook/hands.js)
          if (Cook.Hands) Cook.Hands.attach(S, jug, "pour", { at: [0.4, 0.02], k: z.k * 0.8, turn: 0.12 });
        }
        jug.setScale(S.fitScale(o.art, size, size));
        let hx = r.x + r.rx * 0.55 + jug.displayWidth * 0.36;
        let hy = r.y - r.ry - jug.displayHeight * 0.18;
        if (o.spout) {
          // a bottle or carton: its spout held just above the rim, a little in from the right
          const d = offAt(tilt);
          hx = r.x + r.rx * 0.35 - d.x;
          hy = r.y - r.ry * 0.9 - z.L(50) - d.y;
        }
        jug.setPosition(hx + z.L(60), -jug.displayHeight).setAngle(0).setVisible(true);
        Cook.sfx.whoosh();
        await tween({ targets: jug, x: hx, y: hy, angle: tilt, duration: o.slideMs || 240, ease: "Cubic.easeOut" });
        const loop = Cook.sfx.pourLoop();
        const ms = o.pourMs || 650;
        await new Promise((done) => {
          S.tweens.addCounter({
            from: 0,
            to: 1,
            duration: ms,
            ease: "Sine.easeInOut",
            onUpdate: (tw) => {
              const lv = from + (to - from) * tw.getValue();
              const col = colorAt(lv, target);
              target.setLiquid(lv, col);
              if (loop && loop.pitch) loop.pitch(lv);
              const p = surfaceAt(target, lv);
              const sp = spout();
              drawStream(stream, sp, { x: p.x + target.rim.rx * 0.2, y: p.y }, col, Math.max(6, target.rim.rx / 7), tw.getValue() * ms / 1000);
              if (o.onLevel) o.onLevel(lv, target);
            },
            onComplete: done,
          });
        });
        stream.clear();
        if (loop) loop.stop();
        Cook.sfx.click();
        S.tweens.add({ targets: jug, x: jug.x + z.L(80), y: -jug.displayHeight, angle: 0, duration: o.slideMs || 240, ease: "Cubic.easeIn", onComplete: () => jug && jug.setVisible(false) });
        S.untap(o.icon);
        S.glow(o.icon, false);
        if (o.expect !== false) io.expect(null);
        setTimeout(() => stream.destroy(), 400);
        resolve({ level: to, poured: to - from, vessel: target });
      };
      o.icon.handAction = false; // the hand is on the jug instead
      S.tappable(o.icon, pour);
      if (o.expect !== false) {
        const c = S.centre(o.icon);
        io.expect({ kind: "tap", x: c.x, y: c.y, key: o.key || "pour" });
      }
    });
  }

  /** The hand score for a pour that stopped at `v`, aiming at [lo, hi]. */
  const pourScore = (S, v, lo, hi, k, spilled) => (spilled || v > 1 ? k.spillScore : S.bandScore(v, lo, hi));

  Cook.Pour = { hold, measure, lines, surfaceAt, band, score: pourScore, stream: drawStream };

  /* =====================================================================================================================
   * The kitchen kit's pouring (Sprint 18, the module map's pieces 6 and 7; docs/architecture/module-map.md), from the reference
   * game's signed-off pour (7 Nov). A game calls these with its kit pan (Cook.Kit.pan, ./pan.js) and its own numbers from its
   * settings file; no game is named here (STD-F1-02). Each that is a child's move calls St.acted() at its end (SH-184: a pour,
   * a spoonful or a take-back is a right move: the hint's wait runs again from there).
   *
   *   Mech.pour(S, o)            a bottle or carton from the shelf pours into a pan (piece 6). o: pan (a kit pan: its level and
   *                              look), from (the shelf thing: it hides while a copy flies), level (the pan's level after), look
   *                              (the look before it went in: it cross-fades to what the pan's lookOf says), settle (the pan gives a
   *                              little as it lands: water), ms {fly, arc, tip, tilt, sound, fill, untip, back, backArc, settle}
   *                              (defaults: the reference game's 380, 60, 220, -118, 170, 620, 180, 320, 40, 0.06), onLevel(level),
   *                              onEnd() (before St.acted)
   *   Mech.pour.spoon(z, o)      a spoonful from a jar into a pan (Cook.Spoon, ./count.js): o.pan, o.from, o.word, o.ms, o.onEnd
   *   Mech.pour.toGlass(S, o)    a ready pan carried over its glass, emptying as the glass fills (piece 7; NjgPour.plan, frameOf,
   *                              holdOver). o: pan, well {x, y, r, glass: {empty, half, full}} (its resting glasses), from, to
   *                              (0 empty, 1 half, 2 full), frames {pan: [n measures], glass: [n]} (each {key, w, h, cx, cy, r}:
   *                              the emptying and filling pictures), look (the pan's full look as it lifts), ms {lift, pour,
   *                              back} (pour: each half glass), lift, gap, arc, over (the depth it passes over the faces at),
   *                              shadow (the contact shadow's texture key), sound() -> {pitch(u), stop()} (the pour's loop),
   *                              hook(info | null) (a test hook: the plan's total, marks and frames now), onDone(to) (the game's
   *                              state, before the pan settles back). -> {glass, look} (the resting glass now shown). The game
   *                              then shows the pan again (pan.unhide()) once its own state says what the pan holds
   *   Mech.pour.takeBack(S, o)   CK-TB-01's tap zones over the count badge's chips (the DOM badge never takes a tap): sync() puts
   *                              one 48 px zone over each chip o.can(id) allows and clears the rest, at(id) its centre, clear().
   *                              o.onTap(id), o.depth, o.chips (the selector)
   *   Mech.pour.unspoon(z, o)    a spoonful lifted back out of the pan to its jar: o.pan, o.to (the jar), o.word, o.ms
   *   Mech.pour.byRim(im, m, R)  a picture placed by its own measured rim (m {w, h, cx, cy, r}): its rim's centre on the image's
   *                              place, its rim's radius R (or the last R it was given)
   * ===================================================================================================================== */
  const Kit = () => Cook.Kit || {};
  const acted = () => St && St.acted && St.acted();
  const SHELF_MS = { fly: 380, arc: 60, tip: 220, tilt: -118, sound: 170, fill: 620, untip: 180, back: 320, backArc: 40, settle: 0.06 };
  const tweenP = (S, cfg) => new Promise((r) => S.tweens.add(Object.assign({}, cfg, { onComplete: r })));
  const trk = (S, o) => (S.track ? S.track(o) : o);

  /** Piece 6: a bottle or carton lifts from the shelf, tips over the pan (its cap the spout) and pours; the pan's look changes. */
  async function shelfPour(S, o) {
    const pan = o.pan;
    const obj = o.from;
    const ms = Object.assign({}, SHELF_MS, o.ms || {});
    const land = Kit().pan.land;
    obj.flying = true;
    const art = trk(S, S.add.image(obj.x, obj.y, obj.texture.key).setOrigin(0.5, 1).setScale(obj.scaleX).setDepth(D.fx + 1));
    obj.setAlpha(0);
    if (obj.shadow) obj.shadow.setVisible(false);
    // (CHAI-19: it tips in from the pan's right, level with the rim's middle, under the word's bubble over the pan)
    art.setOrigin(0.5, 0.5);
    art.y = obj.y - obj.displayHeight / 2;
    await S.fly(art, pan.x + pan.panR * 0.55, pan.y + pan.panR * 0.05, { duration: ms.fly, arc: ms.arc });
    // (the short pour: the first 0.9 s of a real pour as it reaches its tip; never over a family voice line, js/shared/sfx.js)
    S.time.delayedCall(ms.sound, () => Cook.sfx.pourShort && Cook.sfx.pourShort());
    await tweenP(S, { targets: art, angle: ms.tilt, duration: ms.tip, ease: "Sine.easeOut" });
    // CHAI-64 (Zafar, 1 Nov: "I don't think we need to draw milk going in, because the colour of the tea changes"): no drawn
    // stream; the pan's own picture changes over the pour
    const from = pan.level || 0;
    const to = o.level;
    pan.fading = true;
    await new Promise((r) =>
      S.tweens.addCounter({
        from: 0,
        to: 1,
        duration: ms.fill,
        onUpdate: (tw) => {
          const u = tw.getValue();
          pan.level = from + (to - from) * u;
          if (o.onLevel) o.onLevel(pan.level);
          pan.show({ from: o.look, u });
        },
        onComplete: r,
      })
    );
    pan.fading = false;
    pan.show();
    // ART-31 (decision 2a): no painted splash; the pan gives its small settle
    if (o.settle) land(S, [pan.img, pan.mix, pan.disc, pan.mixDisc].filter((im) => im && im.visible), { k: 0.03, top: true, ms: 260 });
    await tweenP(S, { targets: art, angle: 0, duration: ms.untip });
    await S.fly(art, obj.x, obj.y - obj.displayHeight / 2, { duration: ms.back, arc: ms.backArc });
    art.destroy();
    obj.flying = false;
    obj.setAlpha(1);
    if (obj.shadow) obj.shadow.setVisible(true);
    // (back on the shelf: it settles, and is heard set down: CHAI-92, settle A, a glass set on a wooden table)
    land(S, obj, { k: ms.settle });
    if (Cook.sfx.settle) Cook.sfx.settle();
    if (o.onEnd) o.onEnd();
    acted();
  }

  /** Piece 6: a spoonful from a jar into a pan (the shared spoon); the hint's wait runs again from its landing. */
  async function spoon(z, o) {
    try {
      await Cook.Spoon.spoon(z, { bowl: o.from, into: o.pan.vessel, word: o.word, ms: o.ms });
    } finally {
      if (o.onEnd) o.onEnd();
      acted();
    }
  }

  /** Piece 7, the take-back: a spoonful lifted back out of the pan, to its jar (the game calls St.acted when its count is right). */
  function unspoon(z, o) {
    const c = z.S.centre(o.to);
    return Cook.Spoon.spoon(z, { bowl: o.pan.img, into: { x: c.x, y: c.y }, word: o.word, ms: o.ms });
  }

  /** A picture by its own measured rim: the rim's centre on its place, the rim's radius R (or the last R it was given). */
  function byRim(im, m, R) {
    im.glassR = R || im.glassR;
    return m ? im.setOrigin(m.cx / m.w, m.cy / m.h).setScale(im.glassR / m.r) : im;
  }

  /**
   * Piece 7 (CHAI-34, Zafar 29 Oct: "just having the pans move above the glasses and empty and the glasses fill up"): the pan
   * lifts off its burner and holds just above its glass; its emptying pictures play in step with the glass's filling ones, each
   * placed by its own measured rim so neither rim's centre moves; then it goes home (empty after a full pour). No tipping, no
   * drawn stream. The game first takes the flames off and its count away; the pan's other layers hide while it is away.
   */
  async function toGlass(S, o) {
    const pan = o.pan;
    const set = pan.set;
    const w = o.well;
    const P = Object.assign({ lift: 520, pour: 700, back: 420 }, o.ms || {});
    const from = o.from;
    const to = o.to;
    const FP = o.frames.pan;
    const FG = o.frames.glass;
    const n = FP.length;
    const s8 = pan.scale;
    const look = Kit().pan.look;
    const body = look(pan.img, set, o.look);
    const kFrom = NjgPour.frameOf(from, n);
    const kTo = NjgPour.frameOf(to, n);
    // the emptying pan: one picture, its rim's centre on the pan's place, drawn the pan's rim size times z
    const fr = trk(S, S.add.image(pan.x, pan.y, FP[kFrom - 1].key)).setFlipX(!!set.mirror).setVisible(false);
    const frame = (k, z) => {
      const m = FP[k - 1];
      if (fr.texture.key !== m.key) fr.setTexture(m.key);
      fr.setOrigin(set.mirror ? 1 - m.cx / m.w : m.cx / m.w, m.cy / m.h).setScale((set.rim * z) / m.r);
      return m;
    };
    // the filling glass: one picture over the well's resting glasses, its rim on the well's
    const gf = byRim(trk(S, S.add.image(w.x, w.y, FG[kFrom - 1].key)), FG[kFrom - 1], w.r).setDepth(D.item + 0.6).setVisible(false);
    // its shadow on the worktop, dropping away as it lifts (the contact shadow's own picture)
    const lsh = trk(S, S.add.image(pan.x, pan.y, o.shadow || S.tex("shadow")).setDepth(D.fx + 0.5).setAlpha(0));
    pan.hide();
    // SH-183 amended (Zafar, 1 Nov night): while it pours, the pan and its shadow pass over the faces
    const over = o.over != null ? o.over : D.badge;
    body.setDepth(over + 0.5);
    fr.setDepth(over + 0.51);
    lsh.setDepth(over + 0.4);
    const v = Cook.view || {};
    const box = { l: (v.left || 0) + 12, t: (v.top || 0) + 12, r: (v.right || 1600) - 12, b: (v.bottom || 900) - 12 };
    const { at: hold, z: zs } = NjgPour.holdOver({ well: w, rim: set.rim, scale: s8, lift: o.lift, gap: o.gap, meta: FP[0], mirror: !!set.mirror, box });
    const plan = NjgPour.plan({ from: { x: pan.x, y: pan.y }, to: hold, tilt: 1, arc: o.arc == null ? 24 : o.arc, ms: { lift: P.lift, tip: 0, pour: P.pour * (to - from), untip: 0, back: P.back } });
    const M = plan.marks;
    const st = (x) => (x >= 2 ? "full" : x >= 1 ? "half" : "empty");
    const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
    const emptied = to >= 2;
    const draw = (f) => {
      if (!body.active) return;
      const t = f.t;
      // up: 0 on the burner, 1 lifted over the glasses (the lift and the way home)
      const up = f.phase === "lift" ? ease(Math.min(1, t / M.lift)) : f.phase === "back" || f.phase === "done" ? 1 - ease(Math.min(1, (t - M.untip) / P.back)) : 1;
      const z = s8 + (zs - s8) * up;
      // the frame: in step with the glass, from where this pour starts to where it stops
      const home = f.phase === "back" || f.phase === "done";
      const k = f.phase === "lift" ? kFrom : home ? kTo : Math.round(kFrom + (kTo - kFrom) * f.fill);
      // the hob's pan as it lifts fades into the first frame; going home, the last frame into the hob's pan
      let frameA = 1;
      if (f.phase === "lift") frameA = Math.min(1, Math.max(0, (t / M.lift - 0.2) / 0.4));
      else if (home) frameA = Math.min(1, Math.max(0, 1 - ((t - M.untip) / P.back - 0.4) / 0.4));
      if (emptied && home && body.texture.key !== set.looks.empty.key) look(body, set, "empty");
      frame(k, z);
      fr.setVisible(frameA > 0).setAlpha(frameA).setPosition(f.x, f.y);
      body.setVisible(frameA < 1).setAlpha(1).setPosition(f.x, f.y).setScale(z);
      // the shadow: under it on the burner, falling away down and right as it rises
      const sw = set.rim * z * 2.1;
      lsh.setPosition(f.x + up * 26, f.y + up * 34).setDisplaySize(sw, sw).setAlpha(0.55 - 0.25 * up);
      // the glass: its own frame, in step with the pan's (the resting glasses under it, hidden while it shows)
      const g = FG[k - 1];
      if (gf.texture.key !== g.key) byRim(gf.setTexture(g.key), g);
      // (as the pan comes over, the resting glass gives way to the first frame: the same glass, so nothing jumps)
      const gA = f.phase === "lift" ? frameA : 1;
      gf.setVisible(true).setAlpha(gA);
      ["empty", "half", "full"].forEach((s2) => w.glass[s2] && w.glass[s2].setAlpha(s2 === st(from) ? 1 - gA : 0));
    };
    if (o.hook) o.hook({ total: plan.total, marks: M, frames: () => ({ pan: fr.texture.key, glass: gf.texture.key, at: { x: fr.x, y: fr.y }, glassAt: { x: gf.x, y: gf.y } }) });
    // the pour's sound while it runs (CHAI-87: a real pour into a glass, at its own level)
    let loop = null;
    const sound = (f) => {
      if (f.phase === "pour" && !loop && o.sound) loop = o.sound() || { pitch() {}, stop() {} };
      if (loop) loop.pitch(f.fill * 0.6);
      if (loop && f.phase === "back") loop = (loop.stop(), null);
    };
    try {
      await new Promise((r) =>
        S.tweens.addCounter({
          from: 0,
          to: 1,
          duration: plan.total,
          onUpdate: (tw) => {
            const f = plan.at(tw.getValue() * plan.total);
            draw(f);
            sound(f);
          },
          onComplete: r,
        })
      );
    } finally {
      if (loop) loop.stop();
    }
    draw(plan.at(plan.total));
    if (o.hook) o.hook(null);
    lsh.destroy();
    fr.destroy();
    gf.destroy();
    ["empty", "half", "full"].forEach((s2) => w.glass[s2] && w.glass[s2].setAlpha(s2 === st(to) ? 1 : 0));
    if (o.onDone) o.onDone(to);
    body.setVisible(true).setPosition(pan.x, pan.y).setAngle(set.turn || 0).setScale(s8).setDepth(pan.depth);
    const land = Kit().pan.land;
    land(S, body, { k: 0.04, top: true }); // (it sets down on the burner: a small settle)
    land(S, w.glass[st(to)], { k: 0.05, top: true }); // (the glass, full: a small settle)
    return { glass: w.glass[st(to)], look: st(to) };
  }

  /** CK-TB-01's tap zones over the count badge's chips (the DOM badge never takes a tap: the tap falls through to the canvas). */
  function takeBack(S, o) {
    const sel = o.chips || "#count-badge .njg-tally-chip[data-tally], #count-badge .tl[data-k]";
    const zones = new Map();
    const UI = Cook.UI;
    const toWorld = (sx, sy) => {
      const a = UI.worldToScreen(0, 0);
      const s1 = UI.worldToScreen(1, 0).x - a.x || 1;
      return { x: (sx - a.x) / s1, y: (sy - a.y) / s1 };
    };
    const chips = () =>
      [...document.querySelectorAll(sel)]
        .map((el) => ({ id: el.dataset.tally || el.dataset.k, r: el.getBoundingClientRect() }))
        .filter((c) => c.r.width > 0 && c.r.height > 0);
    const api = {
      sync() {
        const live = new Set();
        chips().forEach(({ id, r }) => {
          if (!o.can(id)) return;
          const a = toWorld(r.left, r.top);
          const b = toWorld(r.right, r.bottom);
          // (at least the 48 px tap target, LAY-04, centred on the chip)
          const min = toWorld(48, 0).x - toWorld(0, 0).x;
          const w = Math.max(b.x - a.x, min);
          const h = Math.max(b.y - a.y, min);
          const cx = (a.x + b.x) / 2;
          const cy = (a.y + b.y) / 2;
          let z = zones.get(id);
          if (!z) {
            z = trk(S, S.add.zone(cx, cy, w, h)).setDepth(o.depth != null ? o.depth : D.fx + 6);
            z.chipId = id;
            S.tappable(z, () => o.onTap(id));
            zones.set(id, z);
          } else if (Math.abs(z.x - cx) > 1 || Math.abs(z.y - cy) > 1 || Math.abs(z.width - w) > 1 || Math.abs(z.height - h) > 1) {
            z.setPosition(cx, cy).setSize(w, h);
            if (z.input && z.input.hitArea) z.input.hitArea.setTo(0, 0, w, h);
          }
          live.add(id);
        });
        zones.forEach((z, id) => {
          if (live.has(id)) return;
          S.untap(z);
          z.destroy();
          zones.delete(id);
        });
        return api;
      },
      at(id) {
        const z = zones.get(id);
        return z && z.active && o.can(id) ? { x: z.x, y: z.y } : null;
      },
      clear() {
        zones.forEach((z) => {
          S.untap(z);
          z.destroy();
        });
        zones.clear();
      },
    };
    return api;
  }

  Object.assign(shelfPour, { spoon, unspoon, toGlass, takeBack, byRim, MS: SHELF_MS });
  Cook.Pour.toGlass = toGlass;
  Cook.Pour.byRim = byRim;
  Mech.pour = shelfPour;

  Mech.define("pour", {
    api: "pourInto",
    profile: (p) => (p.source ? "cup" : p.liquid === "cook-paani" || !p.liquid ? "water" : "milk"),
    async run(z, p, k) {
      return p.source ? fromVessel(z, p, k) : fromJug(z, p, k);
    },
  });

  /** A jug (the icon at jugAt, which never moves) into params.vessel. */
  async function fromJug(z, { vessel, liquid = "cook-paani", color = 0x9fd3f0, from, fromLevel = false, target = [0.45, 0.62], jugAt, speak = true, icon, art, spout, tilt, artSize }, k) {
    const S = z.S;
    const ctx = z.ctx;
    color = St.color(color);
    if (from != null && !fromLevel) vessel.setLiquid(from, vessel.color);
    const at = St.pt(jugAt, { x: 1300, y: St.STRIP_Y });
    const jugKey = Cook.item(liquid) && Cook.item(liquid).image ? Cook.item(liquid).image : "water-jug";
    let jug = icon;
    if (!jug) {
      jug = S.prop(jugKey, z.X(at.x), z.Y(at.y + 60), z.L(170), z.L(200), { depth: D.item + 1 });
      jug.label = S.label(jug, liquid);
    }
    if ((k.specialJug || []).includes(liquid)) S.special(jug);
    const [lo, hi] = band(target, k);
    const line = (lo + hi) / 2;
    // 28 Sept (s8): no fill line: a tap pours one measure, and nothing fills to a line any more
    if (speak) z.say(Lang.wordLine(liquid), { hide: St.hideKnown(ctx) }).catch(() => {});
    // pouring onto something already in the pan (milk into chai) blends the colours
    const base = vessel.level || 0;
    const baseCol = Phaser.Display.Color.ValueToColor(vessel.color);
    const newCol = Phaser.Display.Color.ValueToColor(color);
    const blend = (lv) => {
      if (base <= 0.05) return color;
      const m = Phaser.Display.Color.Interpolate.ColorWithColor(baseCol, newCol, 100, Math.round(Cook.clamp((lv - base) / Math.max(0.05, lv), 0, 1) * 100));
      return Phaser.Display.Color.GetColor(m.r, m.g, m.b);
    };
    // Wave 6b: a tap pours one measure, up to the line (no hold, no "too much!": a tap can't miss)
    const r = await measure(z, {
      icon: jug,
      vessel,
      art: art || jugKey,
      spout,
      tilt,
      artSize,
      color: blend,
      next: (lv) => (lv < line - 0.02 ? line : null),
      pourMs: k.pourMs,
      slideMs: k.slideMs,
      key: liquid,
    });
    const v = r.level;
    z.progress({ poured: liquid, level: v });
    await Cook.wait(450);
    return v;
  }

  /**
   * From a vessel (the chai pan) into another (a cup): press and hold the
   * source, which stays on its burner; a pouring pan slides in over the cup.
   */
  async function fromVessel(z, { source, vessel, color = 0xc49468, target = [0.72, 0.9], steam = 0, art }, k) {
    const S = z.S;
    color = St.color(color);
    const [lo, hi] = band(target, k);
    let v;
    if (k.instant) {
      // the chai machine pours for you
      await Cook.wait(k.instantMs);
      v = (lo + hi) / 2;
      vessel.setLiquid(v, color);
      z.skill(100, "pour");
    } else {
      // Wave 6b: a tap pours one measure, to the line
      const line = (lo + hi) / 2;
      const r = await measure(z, {
        icon: source,
        vessel,
        art: art || (S.textures.exists("saucepan-chai") ? "saucepan-chai" : source.texture.key),
        color,
        next: (lv) => (lv < line - 0.02 ? line : null),
        pourMs: k.pourMs,
        slideMs: k.slideMs,
        key: "pan",
      });
      v = r.level;
    }
    if (steam) S.steam(vessel.rim.x, vessel.rim.y - z.L(30), steam);
    z.progress({ poured: "cup", level: v });
    return v;
  }

  /*
   * A kit lab section (lab/sections/kk-pan-pour.html, lab/sections/kit-serve.html: Sprint 18, every kit piece in every state,
   * STD-F5-03): the section page holds cook.html in a frame and gives its showcase as njgKitLab(L, Cook); this entry runs it on
   * the lab's own scene in place of the jug. Never on a page that isn't framed by such a section.
   */
  const kitLab = () => {
    try {
      const P = global.parent;
      return P && P !== global && typeof P.njgKitLab === "function" ? P.njgKitLab : null;
    } catch (e) {
      return null;
    }
  };
  Mech.lab("pour", {
    name: "Pour",
    verb: "Tap the jug",
    async run(L) {
      const host = kitLab();
      if (host) return host(L, Cook);
      L.card([Lang.wordLine("cook-paani")], ["pour"]);
      const z = await L.scene("pour", "hob");
      const pan = St.vessel(L.S, "pan", z.X(St.BURNER.left.x), z.Y(St.BURNER.left.y - 30), 1.35 * z.k);
      await L.run("pour", z, { vessel: pan, liquid: "cook-paani", target: [0.42, 0.58] });
    },
  });
})(window);
