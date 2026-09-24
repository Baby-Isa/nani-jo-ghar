/*
 * Cook with Nani: the Phaser scene and every station mini-game.
 *
 * One scene, four views (service, pantry, board, stove), each a close-up
 * background with separate transparent props on top. Every station is a
 * single-finger gesture (docs/game-modes-v2.md section 7): tap, hold to
 * pour, swipe to chop, drag out to roll, circle to stir, tap in time.
 *
 * Every station resolves a promise with its grade (0-100) so the flow can
 * stay a readable async script. Cook.expect always describes what the
 * player should do next; the end-to-end test reads it to play the game
 * through real pointer events.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const W = 1600;
  const H = 900;
  const D = { bg: 0, back: 5, char: 10, occ: 20, item: 30, item2: 32, front: 34, fx: 40, top: 50 };

  // where the liquid surface sits inside each vessel image, as fractions
  // of the image size (so re-slicing the art at another scale can't break it)
  const VESSEL = {
    saucepan: { cx: 0.346, cy: 0.43, rx: 0.293, ry: 0.15, lowY: 0.56 },
    pot: { cx: 0.503, cy: 0.345, rx: 0.33, ry: 0.15, lowY: 0.51 },
  };

  const CHARS = {
    nani: { x: 330, top: 150, scale: 0.98 },
    nana: { x: 940, top: 175, scale: 1.25 },
    ma: { x: 940, top: 195, scale: 1.14 },
    cousin: { x: 940, top: 290, scale: 1.02 },
  };

  class CookScene extends Phaser.Scene {
    constructor() {
      super("cook");
    }

    preload() {
      ["service", "pantry", "board", "stove"].forEach((b) => this.load.image(`bg-${b}`, `assets/cook/bg/${b}.jpg`));
      ["nani-neutral", "nani-talk", "nani-happy", "nani-point"].forEach((k) => this.load.image(k, `assets/cook/characters/${k}.webp`));
      ["nana", "ma", "cousin"].forEach((c) =>
        ["happy", "neutral", "impatient"].forEach((p) => this.load.image(`${c}-${p}`, `assets/cook/characters/${c}-${p}.webp`))
      );
      this.load.image("cousin-badge", "assets/cook/characters/cousin-badge.webp");
      const props = [
        "onion", "onion-half", "onion-chopped", "tomato", "tomato-chopped", "chilli", "garlic", "daal-dry", "jeeru", "rai",
        "hardar", "loon", "atto", "water-jug", "dough-ball", "chapati-raw", "chapati-half", "chapati-puffed", "rolling-pin",
        "chakla", "tawa", "pot", "pot-daal", "tadka-pan", "saucepan", "saucepan-chai", "milk-jug", "tea-tin", "sugar-jar",
        "elchi", "glass", "glass-chai", "knife", "knife-gold", "thali", "chai-machine", "basket", "basket-front",
      ];
      props.forEach((p) => this.load.image(p, `assets/cook/props/${p}.webp`));
    }

    create() {
      this.cameras.main.setBackgroundColor("#e9dcc4");
      this.bg = this.add.image(0, 0, "bg-service").setOrigin(0).setDepth(D.bg);
      this.layer = [];
      this.chars = {};
      this.loops = [];
      Cook.scene = this;
      this.tweens.timeScale = Cook.speed;
      this.time.timeScale = Cook.speed;
      this.events.on("update", () => this.tick && this.tick());
      if (Cook.onSceneReady) Cook.onSceneReady(this);
    }

    /* ---------------- view management ---------------- */
    track(obj) {
      this.layer.push(obj);
      return obj;
    }
    clearView() {
      this.loops.forEach((l) => l.stop && l.stop());
      this.loops = [];
      this.tweens.killAll();
      this.time.removeAllEvents();
      this.input.removeAllListeners();
      this.layer.forEach((o) => o && o.destroy && o.destroy());
      this.layer = [];
      this.chars = {};
      this.tick = null;
      Cook.gauge = null;
      Cook.expect = null;
    }
    async setView(name, { fast } = {}) {
      const cam = this.cameras.main;
      const dur = fast ? 120 : 220;
      if (this.viewName) {
        cam.fadeOut(dur, 233, 220, 196);
        await Cook.wait(dur + 20);
      }
      this.clearView();
      this.viewName = name;
      this.bg.setTexture(`bg-${name}`);
      UI.showBadge(name !== "service");
      UI.hideBubble();
      cam.fadeIn(dur, 233, 220, 196);
    }

    /* ---------------- building blocks ---------------- */
    texSize(key) {
      const src = this.textures.get(key).getSourceImage();
      return { w: src.width, h: src.height };
    }
    fitScale(key, maxW, maxH) {
      const { w, h } = this.texSize(key);
      return Math.min(maxW / w, maxH / h);
    }
    /** A prop standing on a surface: origin bottom-centre, contact shadow, sunk 4px. */
    prop(key, x, baseline, maxW, maxH, { depth = D.item, shadow = true } = {}) {
      const s = this.fitScale(key, maxW, maxH);
      let sh = null;
      if (shadow) {
        const { w } = this.texSize(key);
        sh = this.track(this.add.ellipse(x, baseline - 4, w * s * 0.8, Math.max(10, w * s * 0.12), 0x3a2410, 0.22).setDepth(depth - 1));
      }
      const img = this.track(this.add.image(x, baseline + 4, key).setOrigin(0.5, 1).setScale(s).setDepth(depth));
      img.baseScale = s;
      img.shadow = sh;
      return img;
    }
    centre(obj) {
      const b = obj.getBounds();
      return { x: b.centerX, y: b.centerY, w: b.width, h: b.height };
    }
    tappable(obj, fn) {
      obj.setInteractive({ useHandCursor: true });
      obj.removeAllListeners("pointerdown");
      obj.on("pointerdown", (p) => {
        Cook.unlockAudio();
        fn(p);
      });
      return obj;
    }
    untap(obj) {
      if (obj && obj.input) {
        obj.removeAllListeners("pointerdown");
        obj.disableInteractive();
      }
    }

    glow(obj, on = true) {
      if (!obj) return;
      if (obj.glowFx) {
        obj.glowFx.tween.stop();
        obj.glowFx.ring.destroy();
        obj.glowFx = null;
        obj.setScale(obj.baseScale || obj.scale);
      }
      if (!on) return;
      const c = this.centre(obj);
      const ring = this.track(
        this.add.ellipse(c.x, c.y, Math.max(90, c.w * 1.25), Math.max(90, c.h * 1.2), 0xffd27a, 0.5).setStrokeStyle(8, 0xfff3c4, 1).setDepth(obj.depth - 0.5)
      );
      const base = obj.baseScale || obj.scale;
      obj.baseScale = base;
      const tween = this.tweens.add({ targets: [ring], alpha: 0.35, scale: 1.12, duration: 480, yoyo: true, repeat: -1 });
      this.tweens.add({ targets: obj, scale: base * 1.06, duration: 520, yoyo: true, repeat: 3 });
      obj.glowFx = { ring, tween };
    }
    wiggle(obj) {
      const a = obj.angle;
      this.tweens.add({ targets: obj, angle: { from: a - 8, to: a + 8 }, duration: 70, yoyo: true, repeat: 2, onComplete: () => obj.setAngle(a) });
    }
    ripple(x, y) {
      const r = this.track(this.add.circle(x, y, 20, 0xffffff, 0).setStrokeStyle(6, 0xffffff, 0.9).setDepth(D.top));
      this.tweens.add({ targets: r, scale: 3, alpha: 0, duration: 700, repeat: 2, onComplete: () => r.destroy() });
    }
    burst(x, y, colors, n = 12, spread = 90) {
      for (let i = 0; i < n; i++) {
        const c = Array.isArray(colors) ? Cook.pick(colors) : colors;
        const dot = this.track(this.add.circle(x, y, 4 + Math.random() * 5, c, 1).setDepth(D.fx));
        const ang = Math.random() * Math.PI * 2;
        const dist = spread * (0.4 + Math.random() * 0.6);
        this.tweens.add({
          targets: dot,
          x: x + Math.cos(ang) * dist,
          y: y + Math.sin(ang) * dist * 0.7 - 20,
          alpha: 0,
          scale: 0.4,
          duration: 500 + Math.random() * 300,
          ease: "Cubic.easeOut",
          onComplete: () => dot.destroy(),
        });
      }
    }
    sparkle(x, y) {
      this.burst(x, y, [0xffe08a, 0xffffff, 0xf6c35b], 16, 120);
    }
    steam(x, y, n = 3) {
      for (let i = 0; i < n; i++) {
        const s = this.track(this.add.ellipse(x + (Math.random() - 0.5) * 60, y, 30, 40, 0xffffff, 0.5).setDepth(D.fx));
        this.tweens.add({
          targets: s,
          y: y - 120 - Math.random() * 60,
          x: s.x + (Math.random() - 0.5) * 40,
          scale: 2,
          alpha: 0,
          duration: 1200 + Math.random() * 500,
          delay: i * 180,
          onComplete: () => s.destroy(),
        });
      }
    }
    fly(obj, x, y, { scale, duration = 520, arc = 140, depth } = {}) {
      if (depth != null) obj.setDepth(depth);
      if (obj.shadow) obj.shadow.setVisible(false);
      const sx = obj.x;
      const sy = obj.y;
      const s0 = obj.scale;
      return new Promise((resolve) => {
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration,
          ease: "Sine.easeInOut",
          onUpdate: (t) => {
            const k = t.getValue();
            obj.x = sx + (x - sx) * k;
            obj.y = sy + (y - sy) * k - Math.sin(k * Math.PI) * arc;
            if (scale != null) obj.setScale(s0 + (scale - s0) * k);
          },
          onComplete: () => resolve(),
        });
      });
    }
    floatText(x, y, text, color = "#ffffff") {
      const t = this.track(
        this.add
          .text(x, y, text, { fontFamily: "Baloo 2, Nunito, sans-serif", fontSize: "54px", fontStyle: "800", color, stroke: "#3a2410", strokeThickness: 8 })
          .setOrigin(0.5)
          .setDepth(D.top)
      );
      this.tweens.add({ targets: t, y: y - 90, alpha: { from: 1, to: 0 }, duration: 1300, ease: "Cubic.easeOut", onComplete: () => t.destroy() });
    }
    gradeText(x, y, score) {
      const label = score >= 95 ? "★ 100%" : `${Math.round(score)}%`;
      this.floatText(x, y, label, score >= 88 ? "#ffe08a" : score >= 68 ? "#ffffff" : "#ffd6c9");
      if (score >= 88) this.sparkle(x, y);
    }

    /** Vertical gauge: fill level 0..1 with a target band. */
    gauge(x, y, h, lo, hi, color) {
      const g = this.track(this.add.graphics().setDepth(D.fx));
      const w = 38;
      const state = { level: 0, lo, hi, color };
      const draw = () => {
        g.clear();
        g.fillStyle(0xfffaf1, 0.95);
        g.fillRoundedRect(x - w / 2 - 6, y - h - 6, w + 12, h + 12, 16);
        g.lineStyle(3, 0x3a2410, 0.25);
        g.strokeRoundedRect(x - w / 2 - 6, y - h - 6, w + 12, h + 12, 16);
        g.fillStyle(0x7d9a78, 0.55);
        g.fillRect(x - w / 2, y - h * state.hi, w, h * (state.hi - state.lo));
        g.fillStyle(state.color, 1);
        const lv = Cook.clamp(state.level, 0, 1.05);
        g.fillRoundedRect(x - w / 2 + 5, y - h * Math.min(1, lv), w - 10, Math.max(2, h * Math.min(1, lv)), 8);
        g.lineStyle(4, 0x4f6b4b, 1);
        g.lineBetween(x - w / 2 - 8, y - h * state.hi, x + w / 2 + 8, y - h * state.hi);
        g.lineBetween(x - w / 2 - 8, y - h * state.lo, x + w / 2 + 8, y - h * state.lo);
      };
      draw();
      state.set = (v) => {
        state.level = v;
        draw();
      };
      state.destroy = () => g.destroy();
      Cook.gauge = state;
      return state;
    }
    /** Score a gauge result: 100 inside the band, falling off outside it. */
    bandScore(v, lo, hi) {
      if (v >= lo && v <= hi) return 100;
      const d = v < lo ? lo - v : v - hi;
      return Cook.clamp(100 - d * 260, 35, 99);
    }

    /* ---------------- characters (service view) ---------------- */
    addChar(who, { x, enter } = {}) {
      const c = CHARS[who];
      const key = who === "nani" ? "nani-neutral" : `${who}-neutral`;
      const { h } = this.texSize(key);
      const img = this.track(this.add.image(x != null ? x : c.x, c.top, key).setOrigin(0.5, 0).setScale(c.scale).setDepth(D.char));
      img.who = who;
      img.baseY = c.top;
      img.mood = "neutral";
      // breathing
      img.breath = this.tweens.add({ targets: img, scaleY: c.scale * 1.012, duration: 1700 + Math.random() * 400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.chars[who] = img;
      if (enter) {
        img.x = W + 260;
        this.tweens.add({ targets: img, x: c.x, duration: 900, ease: "Cubic.easeOut" });
        this.tweens.add({ targets: img, y: c.top - 14, duration: 150, yoyo: true, repeat: 2 });
      }
      return img;
    }
    occluder() {
      // the island's front, cut from the same background, hides everyone's waist
      const occ = this.track(this.add.image(0, 0, "bg-service").setOrigin(0).setCrop(0, 611, W, H - 611).setDepth(D.occ));
      return occ;
    }
    setMood(who, mood) {
      const img = this.chars[who];
      if (!img) return;
      img.mood = mood;
      const key = who === "nani" ? { neutral: "nani-neutral", happy: "nani-happy", talk: "nani-talk", point: "nani-point" }[mood] || "nani-neutral" : `${who}-${mood === "talk" ? "happy" : mood}`;
      img.setTexture(key);
    }
    /** A character speaks: talk frame + a small bob while the line plays. */
    async talk(who, line, opts = {}) {
      const img = this.chars[who];
      if (!img) return UI.say(line, { badge: true }, opts);
      const prev = img.mood;
      const base = opts.mood || "talk";
      img.setTexture(who === "nani" ? (base === "point" ? "nani-point" : "nani-talk") : `${who}-happy`);
      const bob = this.tweens.add({ targets: img, y: img.baseY - 6, angle: who === "nani" ? -1.2 : 1.2, duration: 220, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      const anchor = who === "nani" ? { x: img.x + 150, y: img.baseY + 160 } : { x: img.x + 175, y: img.baseY + 150 };
      await UI.say(line, anchor, opts);
      bob.stop();
      img.y = img.baseY;
      img.angle = 0;
      this.setMood(who, opts.after || (prev === "talk" ? "neutral" : prev));
    }
    async leaveChar(who) {
      const img = this.chars[who];
      if (!img) return;
      await Cook.tween(this, { targets: img, x: W + 300, duration: 800, ease: "Cubic.easeIn" });
      img.destroy();
      delete this.chars[who];
    }

    /* ---------------- the step engine ----------------
     * Waits for the player to press the expected item among `items`
     * ({key: obj}). Wrong items wiggle and Nani says "Arre re!". In guided
     * mode the expected item glows at once and Nani names it; otherwise
     * she names it after the word's hesitation delay, and it glows after
     * a second wait or two wrong presses. */
    step({ items, expected, word, guided, sayWord, allowAny, onWrong }) {
      return new Promise((resolve) => {
        let misses = 0;
        const target = items[expected];
        let t1 = null;
        let t2 = null;
        const cleanup = () => {
          clearTimeout(t1);
          clearTimeout(t2);
          Object.values(items).forEach((o) => {
            this.untap(o);
            this.glow(o, false);
          });
        };
        const hintWord = () => {
          if (sayWord) sayWord();
        };
        if (guided) {
          this.glow(target, true);
          hintWord();
        } else if (word) {
          const d = Cook.hintDelay(word);
          t1 = setTimeout(() => {
            if (!target.active) return;
            hintWord();
            t2 = setTimeout(() => target.active && this.glow(target, true), 4000);
          }, d);
        } else {
          t2 = setTimeout(() => target.active && this.glow(target, true), 6000);
        }
        Object.entries(items).forEach(([key, obj]) => {
          if (!obj || !obj.active) return;
          this.tappable(obj, (pointer) => {
            if (key === expected || (allowAny && allowAny(key))) {
              cleanup();
              Cook.expect = null;
              resolve({ key, misses, pointer });
            } else {
              misses++;
              this.wiggle(obj);
              Cook.sfx.soft();
              if (onWrong) onWrong(key, misses);
              if (misses >= 2) this.glow(target, true);
            }
          });
        });
        const c = this.centre(target);
        Cook.expect = { kind: "tap", x: c.x, y: c.y, key: expected, wrongs: Object.keys(items).filter((k) => k !== expected).map((k) => this.centre(items[k])) };
      });
    }

    /** Hold on `obj` to pour: level rises while held; returns the level at release. */
    pour(obj, { gauge, rate = 0.33, auto = false, onLevel, tiltTo, lift } = {}) {
      return new Promise((resolve) => {
        let pouring = false;
        let loop = null;
        const home = { x: obj.x, y: obj.y, angle: obj.angle };
        const start = () => {
          if (pouring) return;
          pouring = true;
          Cook.sfx.pop();
          loop = Cook.sfx.pourLoop();
          if (lift) this.tweens.add({ targets: obj, x: lift.x, y: lift.y, angle: tiltTo != null ? tiltTo : -55, duration: 250 });
        };
        const stop = () => {
          if (!pouring) return;
          pouring = false;
          if (loop) loop.stop();
          if (gauge.level < 0.12 && !auto) {
            // an accidental tap, not a pour: put it back and keep waiting
            return;
          }
          finish();
        };
        const finish = () => {
          Cook.expect = null;
          this.tick = null;
          this.input.off("pointerup", stop);
          this.untap(obj);
          if (lift) this.tweens.add({ targets: obj, x: home.x, y: home.y, angle: home.angle, duration: 300 });
          resolve(gauge.level);
        };
        this.tappable(obj, start);
        this.input.on("pointerup", stop);
        let last = performance.now();
        this.tick = () => {
          const now = performance.now();
          const dt = (Math.min(0.1, (now - last) / 1000)) * Cook.speed;
          last = now;
          if (!pouring) return;
          let v = gauge.level + rate * dt;
          if (auto && v >= (gauge.lo + gauge.hi) / 2) {
            v = (gauge.lo + gauge.hi) / 2;
            gauge.set(v);
            if (onLevel) onLevel(v);
            pouring = false;
            if (loop) loop.stop();
            finish();
            return;
          }
          if (v >= 1.05) v = 1.05;
          gauge.set(v);
          if (onLevel) onLevel(v);
          if (v >= 1.05) {
            pouring = false;
            if (loop) loop.stop();
            finish();
          }
        };
        const c = this.centre(obj);
        Cook.expect = { kind: "hold", x: c.x, y: c.y };
      });
    }

    /** Tap `obj` while a meter runs; returns the meter value at the tap (or 1 if it ran out). */
    timing(obj, { gauge, rate = 0.2, onLevel, tapAnywhere = [] } = {}) {
      return new Promise((resolve) => {
        let done = false;
        const hit = () => {
          if (done) return;
          done = true;
          Cook.expect = null;
          this.tick = null;
          obj.inBandGlow = false;
          this.glow(obj, false);
          [obj, ...tapAnywhere].forEach((o) => this.untap(o));
          resolve(gauge.level);
        };
        [obj, ...tapAnywhere].forEach((o) => this.tappable(o, hit));
        let last = performance.now();
        this.tick = () => {
          const now = performance.now();
          const dt = (Math.min(0.1, (now - last) / 1000)) * Cook.speed;
          last = now;
          const v = gauge.level + rate * dt;
          gauge.set(v);
          if (onLevel) onLevel(v);
          // the target pulses while it's the right moment: a cue even a
          // five-year-old can follow, and it's still a timing skill
          const inBand = v >= gauge.lo && v <= gauge.hi;
          if (inBand !== !!obj.inBandGlow) {
            obj.inBandGlow = inBand;
            this.glow(obj, inBand);
          }
          if (v >= 1) hit();
        };
        const c = this.centre(obj);
        Cook.expect = { kind: "timing", x: c.x, y: c.y };
      });
    }

    /** A see-through fingertip that shows a gesture (tap, drag, circle)
     * until the player starts. points: [[x,y], ...] or {circle: {x,y,rx,ry}}. */
    ghost(points, { duration = 1100, delay = 0 } = {}) {
      const dot = this.track(this.add.circle(0, 0, 26, 0xffffff, 0.75).setStrokeStyle(5, 0x3a2410, 0.35).setDepth(D.top).setVisible(false));
      let tw = null;
      let alive = true;
      const run = () => {
        if (!alive || !dot.active) return;
        dot.setVisible(true);
        tw = this.tweens.addCounter({
          from: 0,
          to: 1,
          duration,
          onUpdate: (t) => {
            const k = t.getValue();
            if (points.circle) {
              const c = points.circle;
              const a = k * Math.PI * 2;
              dot.setPosition(c.x + Math.cos(a) * c.rx, c.y + Math.sin(a) * c.ry);
            } else {
              const seg = Math.min(points.length - 2, Math.floor(k * (points.length - 1)));
              const f = k * (points.length - 1) - seg;
              const [x1, y1] = points[seg];
              const [x2, y2] = points[seg + 1];
              dot.setPosition(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f);
            }
            dot.setAlpha(k < 0.1 ? k * 7 : k > 0.85 ? (1 - k) * 5 : 0.75);
          },
          onComplete: () => {
            if (alive) this.time.delayedCall(350, run);
          },
        });
      };
      const t0 = this.time.delayedCall(delay, run);
      const stop = () => {
        alive = false;
        t0.remove();
        if (tw) tw.stop();
        if (dot.active) dot.destroy();
        this.input.off("pointerdown", stop);
      };
      this.input.once("pointerdown", stop);
      return { stop };
    }

    /** A "special" (upgraded) version of a prop: gold tint and a twinkle
     * now and then. Stands in for real upgrade art. */
    special(obj, on = true) {
      if (!obj || !on) return obj;
      obj.setTint(0xffe2a0, 0xffd27a, 0xffe9b8, 0xf6c35b);
      const ev = this.time.addEvent({
        delay: 1800,
        loop: true,
        callback: () => {
          if (!obj.active || !obj.visible) return;
          const b = obj.getBounds();
          this.burst(b.x + Math.random() * b.width, b.y + Math.random() * b.height * 0.6, [0xfff3c4, 0xffffff], 5, 30);
        },
      });
      obj.once("destroy", () => ev.remove());
      return obj;
    }

    /** Liquid drawn inside a vessel image. */
    liquid(vessel, kind) {
      const f = VESSEL[kind];
      const tw = vessel.width;
      const th = vessel.height;
      const v = { cx: f.cx * tw, cy: f.cy * th, rx: f.rx * tw, ry: f.ry * th, lowY: f.lowY * th };
      const g = this.track(this.add.graphics().setDepth(vessel.depth + 0.5));
      const s = vessel.scale;
      const ox = vessel.x - vessel.displayWidth * vessel.originX;
      const oy = vessel.y - vessel.displayHeight * vessel.originY;
      g.setPosition(ox, oy).setScale(s);
      const st = { level: 0, color: 0xbfe3f2, alpha: 0.85, g };
      st.draw = () => {
        g.clear();
        if (st.level <= 0.01) return;
        const L = Cook.clamp(st.level, 0, 1);
        const cy = v.lowY - (v.lowY - v.cy) * L;
        const rx = v.rx * (0.8 + 0.2 * L);
        const ry = v.ry * (0.75 + 0.25 * L);
        g.fillStyle(st.color, st.alpha);
        g.fillEllipse(v.cx, cy, rx * 2, ry * 2);
        g.fillStyle(0xffffff, 0.18);
        g.fillEllipse(v.cx - rx * 0.25, cy - ry * 0.3, rx * 0.8, ry * 0.5);
      };
      st.set = (level, color, alpha) => {
        st.level = level;
        if (color != null) st.color = color;
        if (alpha != null) st.alpha = alpha;
        st.draw();
      };
      st.surface = () => {
        const L = Cook.clamp(st.level, 0, 1);
        return { x: ox + v.cx * s, y: oy + (v.lowY - (v.lowY - v.cy) * L) * s };
      };
      return st;
    }
    flame(x, y, w = 150) {
      w = w * 1.8;
      y = y + 18;
      const g = this.track(this.add.graphics().setDepth(D.item - 1));
      let t = 0;
      const ev = this.time.addEvent({
        delay: 60,
        loop: true,
        callback: () => {
          t += 1;
          g.clear();
          for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            const r = w / 2;
            const fx = x + Math.cos(a) * r;
            const fy = y + Math.sin(a) * r * 0.42;
            const hgt = 26 + Math.sin(t * 0.9 + i * 1.7) * 9;
            g.fillStyle(0x4f7dff, 0.85);
            g.fillEllipse(fx, fy - hgt / 2, 16, hgt);
            g.fillStyle(0xffb347, 0.8);
            g.fillEllipse(fx, fy - hgt * 0.8, 8, hgt * 0.55);
          }
        },
      });
      return { g, stop: () => { ev.remove(); g.destroy(); } };
    }
  }

  Cook.CookScene = CookScene;
  Cook.D = D;
  Cook.VESSEL = VESSEL;
  Cook.CHARS = CHARS;
})(window);
