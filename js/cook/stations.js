/*
 * Cook with Nani: the Phaser scene and the helpers every station shares
 * (Phase A). The stations themselves live in station-lib.js.
 *
 * Views: "service" (the family at the island) and "pantry" use painted
 * backgrounds; every cooking station uses a top-down worktop ("marble",
 * "hob", "wood") drawn in code, so tools can rotate and hands can come up
 * from the bottom of the screen.
 *
 * Shared helpers: props with contact shadows, item labels that fade by
 * word stage, glow and wiggle, the step engine (wait for the right item,
 * with hints), hold-to-pour, a ring timer that sits on the food ("tap when
 * it's green"), first-person hands, a fingertip demo, particles, and a
 * pause that "pass me" uses in Relaxed mode. Cook.expect always says what
 * the player should do next, for the end-to-end test.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const W = 1600;
  const H = 900;
  const D = { bg: 0, back: 5, char: 10, occ: 20, item: 30, item2: 32, front: 34, fx: 40, hand: 45, top: 50 };

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
      ["service", "pantry"].forEach((b) => this.load.image(`bg-${b}`, `assets/cook/bg/${b}.jpg`));
      ["nani-neutral", "nani-talk", "nani-happy", "nani-point"].forEach((k) => this.load.image(k, `assets/cook/characters/${k}.webp`));
      ["nana", "ma", "cousin"].forEach((c) =>
        ["happy", "neutral", "impatient"].forEach((p) => this.load.image(`${c}-${p}`, `assets/cook/characters/${c}-${p}.webp`))
      );
      this.load.image("cousin-badge", "assets/cook/characters/cousin-badge.webp");
      const props = [
        "onion", "onion-half", "onion-chopped", "tomato", "tomato-chopped", "chilli", "garlic", "daal-dry", "jeeru", "rai",
        "hardar", "loon", "atto", "water-jug", "dough-ball", "chapati-raw", "chapati-half", "chapati-puffed", "rolling-pin",
        "tawa", "pot", "pot-daal", "tadka-pan", "saucepan", "milk-jug", "tea-tin", "sugar-jar", "elchi", "glass", "glass-chai",
        "knife", "knife-gold", "thali", "chai-machine", "basket", "basket-front",
      ];
      props.forEach((p) => this.load.image(p, `assets/cook/props/${p}.webp`));
    }

    create() {
      this.cameras.main.setBackgroundColor("#e9dcc4");
      this.bg = this.add.image(0, 0, "bg-service").setOrigin(0).setDepth(D.bg);
      this.layer = [];
      this.chars = {};
      this.loops = [];
      this.tweens.timeScale = Cook.speed;
      this.time.timeScale = Cook.speed;
      Cook.scene = this;
      this.events.on("update", () => {
        if (Cook.paused) {
          this.lastTick = performance.now();
          return;
        }
        if (this.tick) this.tick();
      });
      if (Cook.onSceneReady) Cook.onSceneReady(this);
    }

    /* ---------------- views ---------------- */
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
      Cook.paused = false;
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
      if (name === "service" || name === "pantry") this.bg.setTexture(`bg-${name}`);
      else this.bg.setTexture(Cook.Art.tex(this, `bg:${name}`));
      UI.hideBubble();
      cam.fadeIn(dur, 233, 220, 196);
    }
    tex(key) {
      return Cook.Art.tex(this, key);
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
    /** A prop standing on a surface: origin bottom-centre, contact shadow. */
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
    /** A top-down thing (bowl, vessel, board) centred at x, y, fitted in a box. */
    flat(key, x, y, maxW, maxH, { depth = D.item } = {}) {
      const s = this.fitScale(key, maxW, maxH);
      const img = this.track(this.add.image(x, y, key).setScale(s).setDepth(depth));
      img.baseScale = s;
      return img;
    }
    /** An ingredient as a heaped bowl (or its photo), with a stage label. */
    ingredient(id, x, y, { w = 170, h = 128, label = true, depth = D.item } = {}) {
      const key = Cook.Art.wordTex(this, id);
      const img = this.flat(key, x, y, w, h, { depth });
      img.wordId = id;
      if (label) img.label = this.label(img, id);
      return img;
    }
    centre(obj) {
      const b = obj.getBounds();
      return { x: b.centerX, y: b.centerY, w: b.width, h: b.height };
    }

    /**
     * A small label under an item, faded by how well the player knows the
     * word: text + speaker (new), speaker only (learning), nothing (known).
     */
    label(obj, id, { mode } = {}) {
      mode = mode || Cook.labelMode(id);
      if (mode === "none") return null;
      const c = this.centre(obj);
      const ph = Cook.isPlaceholder(id);
      const text = mode === "text" ? Cook.display(id) : "";
      const cont = this.track(this.add.container(c.x, c.y + c.h / 2 + 4).setDepth(D.fx + 2));
      const t = text
        ? this.add
            .text(0, 0, text, { fontFamily: ph ? "Nunito, sans-serif" : '"Baloo 2", Nunito, sans-serif', fontSize: "34px", fontStyle: ph ? "italic bold" : "bold", color: ph ? "#6b5a4c" : "#2d2018" })
            .setOrigin(0, 0.5)
        : null;
      const iconW = 30;
      const w = (t ? t.width + 14 : 0) + iconW + 18;
      const bg = this.add.graphics();
      bg.fillStyle(0xfffaf1, 0.86);
      bg.fillRoundedRect(-w / 2, -24, w, 48, 24);
      bg.lineStyle(2, 0x3a2410, 0.12);
      bg.strokeRoundedRect(-w / 2, -24, w, 48, 24);
      const sp = this.add.graphics();
      const sx = -w / 2 + 12;
      sp.fillStyle(0x2d2018, 0.85);
      sp.fillRect(sx, -6, 7, 12);
      sp.fillTriangle(sx + 6, -6, sx + 16, -13, sx + 16, 13);
      sp.fillTriangle(sx + 6, 6, sx + 16, -13, sx + 16, 13);
      sp.lineStyle(2.5, 0x2d2018, 0.85);
      sp.beginPath();
      sp.arc(sx + 18, 0, 7, -0.9, 0.9);
      sp.strokePath();
      cont.add([bg, sp]);
      if (t) {
        t.x = sx + iconW + 2;
        cont.add(t);
      }
      cont.setSize(w, 42);
      cont.setInteractive(new Phaser.Geom.Rectangle(-w / 2, -21, w, 42), Phaser.Geom.Rectangle.Contains);
      cont.on("pointerdown", (p, lx, ly, ev) => {
        if (ev && ev.stopPropagation) ev.stopPropagation();
        Cook.unlockAudio();
        Lang.speakWord(id);
        this.tweens.add({ targets: cont, scale: 1.12, duration: 90, yoyo: true });
      });
      obj.once("destroy", () => cont.destroy());
      return cont;
    }

    tappable(obj, fn) {
      obj.setInteractive({ useHandCursor: true });
      obj.removeAllListeners("pointerdown");
      obj.on("pointerdown", (p) => {
        Cook.unlockAudio();
        if (Cook.paused) return;
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
        if (obj.active) obj.setScale(obj.baseScale || obj.scale);
      }
      if (!on || !obj.active) return;
      const c = this.centre(obj);
      const ring = this.track(
        this.add.ellipse(c.x, c.y, Math.max(90, c.w * 1.2), Math.max(80, c.h * 1.2), 0xffd27a, 0.45).setStrokeStyle(8, 0xfff3c4, 1).setDepth(obj.depth - 0.5)
      );
      const base = obj.baseScale || obj.scale;
      obj.baseScale = base;
      const tween = this.tweens.add({ targets: [ring], alpha: 0.3, scale: 1.12, duration: 480, yoyo: true, repeat: -1 });
      obj.glowFx = { ring, tween };
    }
    wiggle(obj) {
      const a = obj.angle;
      this.tweens.add({ targets: obj, angle: { from: a - 8, to: a + 8 }, duration: 70, yoyo: true, repeat: 2, onComplete: () => obj.active && obj.setAngle(a) });
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
        this.tweens.add({ targets: s, y: y - 120 - Math.random() * 60, x: s.x + (Math.random() - 0.5) * 40, scale: 2, alpha: 0, duration: 1200 + Math.random() * 500, delay: i * 180, onComplete: () => s.destroy() });
      }
    }
    fly(obj, x, y, { scale, duration = 520, arc = 140, depth } = {}) {
      if (depth != null) obj.setDepth(depth);
      if (obj.shadow) obj.shadow.setVisible(false);
      if (obj.label) obj.label.setVisible(false);
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
    floatText(x, y, text, color = "#ffffff", size = 54) {
      const t = this.track(
        this.add
          .text(x, y, text, { fontFamily: '"Baloo 2", Nunito, sans-serif', fontSize: `${size}px`, fontStyle: "bold", color, stroke: "#3a2410", strokeThickness: 8 })
          .setOrigin(0.5)
          .setDepth(D.top)
      );
      this.tweens.add({ targets: t, y: y - 90, alpha: { from: 1, to: 0 }, duration: 1300, ease: "Cubic.easeOut", onComplete: () => t.destroy() });
    }
    /** A result word over the action: "Perfect!", "Too much", "Too early". */
    verdict(x, y, score, words = {}) {
      const w = score >= 95 ? words.perfect || "Perfect!" : score >= 70 ? words.good || "Good!" : words.bad || "Oops";
      this.floatText(x, y, w, score >= 95 ? "#ffe08a" : score >= 70 ? "#ffffff" : "#ffd6c9", 50);
      if (score >= 95) this.sparkle(x, y);
    }
    bandScore(v, lo, hi) {
      if (v >= lo && v <= hi) return 100;
      const d = v < lo ? lo - v : v - hi;
      return Cook.clamp(100 - d * 260, 35, 99);
    }

    /* ---------------- first-person hands ---------------- */
    /** A hand from the bottom of the screen holding a tool; call .moveTo(x, y). */
    hand(tool, { x = 800, y = 700, angle = 0 } = {}) {
      const key = tool === "pin" ? this.tex("pin") : this.tex(`hand:${tool || ""}`);
      const img = this.track(this.add.image(x, y, key).setDepth(D.hand));
      if (tool === "pin") img.setOrigin(0.5, 0.58).setScale(0.85);
      else img.setOrigin(0.5, 0.06).setScale(0.8);
      img.setAngle(angle);
      img.moveTo = (tx, ty, dur = 90) => this.tweens.add({ targets: img, x: tx, y: ty, duration: dur, ease: "Sine.easeOut" });
      return img;
    }

    /* ---------------- characters (service view) ---------------- */
    addChar(who, { x, enter } = {}) {
      const c = CHARS[who];
      const key = who === "nani" ? "nani-neutral" : `${who}-neutral`;
      const img = this.track(this.add.image(x != null ? x : c.x, c.top, key).setOrigin(0.5, 0).setScale(c.scale).setDepth(D.char));
      img.who = who;
      img.baseY = c.top;
      img.mood = "neutral";
      this.tweens.add({ targets: img, scaleY: c.scale * 1.012, duration: 1700 + Math.random() * 400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.chars[who] = img;
      if (enter) {
        img.x = W + 260;
        this.tweens.add({ targets: img, x: c.x, duration: 900, ease: "Cubic.easeOut" });
        this.tweens.add({ targets: img, y: c.top - 14, duration: 150, yoyo: true, repeat: 2 });
      }
      return img;
    }
    occluder() {
      return this.track(this.add.image(0, 0, "bg-service").setOrigin(0).setCrop(0, 611, W, H - 611).setDepth(D.occ));
    }
    setMood(who, mood) {
      const img = this.chars[who];
      if (!img) return;
      img.mood = mood;
      const key =
        who === "nani"
          ? { neutral: "nani-neutral", happy: "nani-happy", talk: "nani-talk", point: "nani-point" }[mood] || "nani-neutral"
          : `${who}-${mood === "talk" ? "happy" : mood}`;
      img.setTexture(key);
    }
    async talk(who, line, opts = {}) {
      const img = this.chars[who];
      if (!img) return UI.say(line, { badge: true }, opts);
      const prev = img.mood;
      img.setTexture(who === "nani" ? (opts.mood === "point" ? "nani-point" : "nani-talk") : `${who}-happy`);
      const bob = this.tweens.add({ targets: img, y: img.baseY - 6, angle: who === "nani" ? -1.2 : 1.2, duration: 220, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      const anchor = who === "nani" ? { x: img.x + 150, y: img.baseY + 160 } : { x: img.x + 175, y: img.baseY + 150 };
      try {
        await UI.say(line, anchor, opts);
      } finally {
        bob.stop();
        if (img.active) {
          img.y = img.baseY;
          img.angle = 0;
          this.setMood(who, opts.after || (prev === "talk" ? "neutral" : prev));
        }
      }
    }
    async leaveChar(who) {
      const img = this.chars[who];
      if (!img) return;
      await Cook.tween(this, { targets: img, x: W + 300, duration: 800, ease: "Cubic.easeIn" });
      img.destroy();
      delete this.chars[who];
    }

    /* ---------------- the step engine ---------------- */
    /**
     * Wait for the player to tap `expected` among `items` ({key: obj}).
     * Wrong items wiggle ("Arre re!" on the first). Guided: the item glows
     * and Nani names it at once. Otherwise Nani names it after the word's
     * hesitation delay, and it glows a little later; each counts as help.
     */
    step({ items, expected, word, guided, sayLine, allowAny, onWrong }) {
      return new Promise((resolve) => {
        let misses = 0;
        const target = items[expected];
        const timers = [];
        const cleanup = () => {
          timers.forEach(clearTimeout);
          Object.values(items).forEach((o) => {
            this.untap(o);
            this.glow(o, false);
          });
        };
        const hint = () => sayLine && UI.say(sayLine, { badge: true }).catch(() => {});
        if (guided) {
          this.glow(target, true);
          hint();
        } else {
          const d = word ? Cook.hintDelay(word) : 6000;
          timers.push(
            setTimeout(() => {
              if (!target.active) return;
              if (Cook.onHelp) Cook.onHelp("hint");
              hint();
              timers.push(setTimeout(() => target.active && this.glow(target, true), 4000));
            }, d)
          );
        }
        Object.entries(items).forEach(([key, obj]) => {
          if (!obj || !obj.active) return;
          this.tappable(obj, () => {
            if (key === expected || (allowAny && allowAny(key))) {
              cleanup();
              Cook.expect = null;
              resolve({ key, misses });
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
        Cook.expect = {
          kind: "tap",
          x: c.x,
          y: c.y,
          key: expected,
          wrongs: Object.keys(items)
            .filter((k) => k !== expected && items[k] && items[k].active)
            .map((k) => this.centre(items[k])),
        };
      });
    }

    /** Hold on `obj` to pour; `onLevel(v)` as it rises; resolves with the level at release. */
    pour(obj, { rate = 0.3, auto = false, lo, hi, onLevel, onStart, onStop } = {}) {
      return new Promise((resolve) => {
        let pouring = false;
        let level = 0;
        let loop = null;
        const start = () => {
          if (pouring) return;
          pouring = true;
          loop = Cook.sfx.pourLoop();
          if (onStart) onStart();
        };
        const stop = () => {
          if (!pouring) return;
          pouring = false;
          if (loop) loop.stop();
          if (onStop) onStop();
          if (level < 0.1 && !auto) return; // a tap, not a pour: keep waiting
          finish();
        };
        const finish = () => {
          Cook.expect = null;
          this.tick = null;
          this.input.off("pointerup", stop);
          this.untap(obj);
          resolve(level);
        };
        this.tappable(obj, start);
        this.input.on("pointerup", stop);
        let last = performance.now();
        this.tick = () => {
          const now = performance.now();
          const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
          last = now;
          if (!pouring) return;
          level = Math.min(1.08, level + rate * dt);
          if (loop && loop.pitch) loop.pitch(level);
          if (auto && level >= (lo + hi) / 2) {
            level = (lo + hi) / 2;
            onLevel && onLevel(level);
            pouring = false;
            loop && loop.stop();
            onStop && onStop();
            return finish();
          }
          onLevel && onLevel(level);
          Cook.gauge = { level, lo, hi };
          if (level >= 1.08) {
            pouring = false;
            loop && loop.stop();
            onStop && onStop();
            finish();
          }
        };
        Cook.gauge = { level: 0, lo, hi };
        const c = this.centre(obj);
        Cook.expect = { kind: "hold", x: c.x, y: c.y };
      });
    }

    /**
     * A ring timer on the food: it fills like a clock; the green arc is
     * "now". Tap `target` (or any of `alsoTap`) to stop it. Returns the
     * fraction at the tap (1 if it ran out). While it's in the green, the
     * food pulses. Real cues (bubbles, colour) come from onLevel.
     */
    ring(target, { x, y, r = 120, lo = 0.62, hi = 0.82, rate = 0.22, onLevel, alsoTap = [] } = {}) {
      return new Promise((resolve) => {
        const c = this.centre(target);
        x = x != null ? x : c.x;
        y = y != null ? y : c.y;
        const g = this.track(this.add.graphics().setDepth(D.fx + 1));
        let v = 0;
        let done = false;
        const a0 = -Math.PI / 2;
        const draw = () => {
          g.clear();
          g.lineStyle(16, 0xfffaf1, 0.75);
          g.beginPath();
          g.arc(x, y, r, 0, Math.PI * 2);
          g.strokePath();
          g.lineStyle(16, 0x7d9a78, 0.95);
          g.beginPath();
          g.arc(x, y, r, a0 + lo * Math.PI * 2, a0 + hi * Math.PI * 2);
          g.strokePath();
          g.lineStyle(10, v > hi ? 0xb24a3a : 0xc9973a, 1);
          g.beginPath();
          g.arc(x, y, r, a0, a0 + Math.min(1, v) * Math.PI * 2);
          g.strokePath();
          const ex = x + Math.cos(a0 + v * Math.PI * 2) * r;
          const ey = y + Math.sin(a0 + v * Math.PI * 2) * r;
          g.fillStyle(0xffffff, 1);
          g.fillCircle(ex, ey, 11);
          g.lineStyle(4, 0x3a2410, 0.6);
          g.strokeCircle(ex, ey, 11);
        };
        const hit = () => {
          if (done) return;
          done = true;
          Cook.expect = null;
          this.tick = null;
          [target, ...alsoTap].forEach((o) => this.untap(o));
          this.glow(target, false);
          g.destroy();
          resolve(v);
        };
        [target, ...alsoTap].forEach((o) => this.tappable(o, hit));
        let last = performance.now();
        let inBand = false;
        this.tick = () => {
          const now = performance.now();
          const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
          last = now;
          v += rate * dt;
          const nowIn = v >= lo && v <= hi;
          if (nowIn !== inBand) {
            inBand = nowIn;
            this.glow(target, nowIn);
            if (nowIn) Cook.sfx.click();
          }
          onLevel && onLevel(v);
          Cook.gauge = { level: v, lo, hi };
          draw();
          if (v >= 1) hit();
        };
        draw();
        Cook.gauge = { level: 0, lo, hi };
        Cook.expect = { kind: "timing", x: c.x, y: c.y };
      });
    }

    /** A see-through fingertip that demonstrates a gesture until the player starts. */
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
  }

  Cook.CookScene = CookScene;
  Cook.D = D;
  Cook.CHARS = CHARS;
})(window);
