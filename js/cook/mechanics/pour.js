/*
 * Mechanic: pour.
 *
 * Wave 6b (docs/UX-PRINCIPLES.md 12; the quality pass, Q5): where things
 * are tapped in, liquids are tapped in too. A TAP on the jug (or the pan)
 * pours ONE measure: the pouring jug slides in over the target, the liquid
 * rises to the next dashed line with the pour sound and its rising pitch,
 * and stops there by itself; the jug slides back (Cook.Pour.measure). So
 * pouring is counting, like the sugar spoons, and it's the same gesture at
 * every level. A tap can't miss the line, so a pour has no hand score (the
 * Chai tray's hand star is the knob alone). The press-and-hold pour below
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
(function (global) {
  const Cook = global.Cook;
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
        if (!jug) jug = S.track(S.add.image(0, 0, o.art).setDepth(D.hand - 1));
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
      const spout = () => {
        const a = Phaser.Math.DegToRad(jug.angle);
        const lx = -jug.displayWidth * 0.42;
        const ly = -jug.displayHeight * 0.34;
        return { x: jug.x + lx * Math.cos(a) - ly * Math.sin(a), y: jug.y + lx * Math.sin(a) + ly * Math.cos(a) };
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
        if (!jug) jug = S.track(S.add.image(0, 0, o.art).setDepth(D.hand - 1));
        jug.setScale(S.fitScale(o.art, size, size));
        const hx = r.x + r.rx * 0.55 + jug.displayWidth * 0.36;
        const hy = r.y - r.ry - jug.displayHeight * 0.18;
        jug.setPosition(hx + z.L(60), -jug.displayHeight).setAngle(0).setVisible(true);
        Cook.sfx.whoosh();
        await tween({ targets: jug, x: hx, y: hy, angle: -52, duration: o.slideMs || 240, ease: "Cubic.easeOut" });
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
              stream.clear();
              stream.lineStyle(Math.max(4, target.rim.rx / 9), col, 0.85);
              stream.lineBetween(sp.x, sp.y, p.x + target.rim.rx * 0.2, p.y);
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
      S.tappable(o.icon, pour);
      if (o.expect !== false) {
        const c = S.centre(o.icon);
        io.expect({ kind: "tap", x: c.x, y: c.y, key: o.key || "pour" });
      }
    });
  }

  /** The hand score for a pour that stopped at `v`, aiming at [lo, hi]. */
  const pourScore = (S, v, lo, hi, k, spilled) => (spilled || v > 1 ? k.spillScore : S.bandScore(v, lo, hi));

  Cook.Pour = { hold, measure, lines, surfaceAt, band, score: pourScore };

  Mech.define("pour", {
    api: "pourInto",
    profile: (p) => (p.source ? "cup" : p.liquid === "cook-paani" || !p.liquid ? "water" : "milk"),
    async run(z, p, k) {
      return p.source ? fromVessel(z, p, k) : fromJug(z, p, k);
    },
  });

  /** A jug (the icon at jugAt, which never moves) into params.vessel. */
  async function fromJug(z, { vessel, liquid = "cook-paani", color = 0x9fd3f0, from, fromLevel = false, target = [0.45, 0.62], jugAt, speak = true, icon }, k) {
    const S = z.S;
    const ctx = z.ctx;
    color = St.color(color);
    if (from != null && !fromLevel) vessel.setLiquid(from, vessel.color);
    const at = St.pt(jugAt, { x: 1300, y: St.STRIP_Y });
    const jugKey = Cook.data.words[liquid] && Cook.data.words[liquid].image ? Cook.data.words[liquid].image : "water-jug";
    let jug = icon;
    if (!jug) {
      jug = S.prop(jugKey, z.X(at.x), z.Y(at.y + 60), z.L(170), z.L(200), { depth: D.item + 1 });
      jug.label = S.label(jug, liquid);
    }
    if ((k.specialJug || []).includes(liquid)) S.special(jug);
    const [lo, hi] = band(target, k);
    const line = (lo + hi) / 2;
    const marks = lines(S, vessel, [{ at: line, strong: true }]);
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
      art: jugKey,
      color: blend,
      next: (lv) => (lv < line - 0.02 ? line : null),
      pourMs: k.pourMs,
      slideMs: k.slideMs,
      key: liquid,
    });
    const v = r.level;
    marks.destroy();
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
      const marks = lines(S, vessel, [{ at: line, strong: true }]);
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
      marks.destroy();
    }
    if (steam) S.steam(vessel.rim.x, vessel.rim.y - z.L(30), steam);
    z.progress({ poured: "cup", level: v });
    return v;
  }

  Mech.lab("pour", {
    name: "Pour",
    verb: "Tap the jug",
    async run(L) {
      L.card([Lang.wordLine("cook-paani")], ["pour"]);
      const z = await L.scene("pour", "hob");
      const pan = St.vessel(L.S, "pan", z.X(St.BURNER.left.x), z.Y(St.BURNER.left.y - 30), 1.35 * z.k);
      await L.run("pour", z, { vessel: pan, liquid: "cook-paani", target: [0.42, 0.58] });
    },
  });
})(window);
