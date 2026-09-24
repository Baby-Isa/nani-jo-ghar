/*
 * Cook with Nani: the station library (Phase A).
 *
 * Each station is one single-finger mini-game, a "verb" that recipes
 * reuse with different settings (docs/cook-with-nani-phase-a-design.md s8).
 * Rule: every station has at least one setting that only the Kutchi tells
 * you (what, how many, which order, how, or leave-it-out).
 *
 * A station is async (S, ctx, params). It reports into ctx:
 *   ctx.listen(ok)       — did you do what the words said? (the ear star)
 *   ctx.skill(score)     — hands: pour to the line, flip on time (the hand star)
 *   ctx.result[...]      — what you actually made, for the customer
 * and it may call ctx.passMe() at a safe moment (Nani interrupts).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const S$ = (Cook.Stations = {});

  // hob burners (bg:hob) and the worktop strip below the hob
  const BURNER = { left: { x: 515, y: 375 }, right: { x: 1085, y: 375 } };
  const STRIP_Y = 790;

  const nani = (line, opts = {}) => UI.say(line, { badge: true }, opts);
  const oops = () => nani(Lang.line("oops"), { ms: 900 }).catch(() => {});
  const hideKnown = (ctx) => (id) => !ctx.guided && Cook.cardHidden(id);

  /** Start a station: its view, its goal line (first time or guided), its step on the mission card. */
  async function begin(S, ctx, key, view) {
    await S.setView(view);
    const st = Cook.data.stations[key];
    Cook.save.seenStation = Cook.save.seenStation || {};
    if (ctx.guided || ctx.lab || !Cook.save.seenStation[key]) UI.gist(st.goal);
    else UI.hideGist();
    Cook.save.seenStation[key] = true;
    if (ctx.nextStep) ctx.nextStep(key);
  }
  function end() {
    UI.hideGist();
    UI.hideCount();
    UI.hideDone();
  }
  function row(n, { y = STRIP_Y, x0 = 160, x1 = 1440 } = {}) {
    if (n === 1) return [{ x: (x0 + x1) / 2, y }];
    return Array.from({ length: n }, (_, i) => ({ x: x0 + ((x1 - x0) * i) / (n - 1), y }));
  }
  function lookalikes(id, n = 2) {
    const L = (Cook.data.lookalikes || {})[id] || [];
    const pool = L.concat(Cook.shuffle(Object.keys(Cook.data.words).filter((w) => w !== id && !w.startsWith("num-") && (Cook.data.words[w].heap || Cook.data.words[w].image))));
    return [...new Set(pool)].filter((w) => w !== id).slice(0, n);
  }
  S$.lookalikes = lookalikes;

  /* ================= Fetch (pantry) ================= */
  S$.fetch = async function (S, ctx, { need, askLines = true }) {
    await begin(S, ctx, "fetch", "pantry");
    // decoys: look-alikes of what's needed first, then others
    const decoys = [...new Set(need.flatMap((id) => lookalikes(id, 2)).concat(Cook.shuffle(Cook.data.pantry_decoys)))].filter((d) => !need.includes(d)).slice(0, Math.max(5, 11 - need.length));
    const all = Cook.shuffle(need.concat(decoys));
    const rows = [
      { y: 196, h: 118 },
      { y: 452, h: 170 },
      { y: 712, h: 170 },
    ];
    const xs = [330, 565, 800, 1035, 1270];
    const slots = [];
    rows.forEach((r) => xs.forEach((x) => slots.push({ x, y: r.y, h: r.h })));
    const usable = Cook.shuffle(slots.filter((s) => !(s.y === 712 && s.x === 800)));
    const items = {};
    all.forEach((id, i) => {
      const slot = usable[i];
      const key = Cook.Art.wordTex(S, id);
      items[id] = S.prop(key, slot.x, slot.y, 170, slot.h);
      items[id].label = S.label(items[id], id);
    });
    const bs = S.fitScale("basket", 330, 200);
    const basket = S.track(S.add.image(800, 902, "basket").setOrigin(0.5, 1).setScale(bs).setDepth(D.front));
    const front = S.track(S.add.image(800, 902, "basket-front").setOrigin(0.5, 1).setScale(bs).setDepth(D.front + 2));
    const fast = Cook.hasUpgrade("basket");
    if (fast) {
      S.special(basket);
      front.setTint(0xffe2a0);
    }
    const bw = basket.displayWidth;
    const bh = basket.displayHeight;
    const spots = [[-0.2, 0.34], [0.12, 0.3], [-0.02, 0.4], [0.26, 0.4], [-0.3, 0.44], [0.08, 0.46], [0.3, 0.3], [-0.12, 0.28]].map(([dx, dy]) => ({
      x: 800 + dx * bw,
      y: 902 - bh + dy * bh + 40,
    }));
    const ask = (id, first) => Lang.line(first ? "need" : "and", Lang.phrase([id]));
    if (ctx.guided && askLines) await nani(Lang.join(need.map((id, i) => ask(id, i === 0))));
    const remaining = need.slice();
    let n = 0;
    while (remaining.length) {
      const expected = remaining[0];
      const guided = ctx.guided || Cook.wordStage(expected) === 1;
      Cook.markSeen(expected);
      const r = await S.step({
        items,
        expected,
        word: expected,
        guided,
        sayLine: ask(expected, n === 0),
        allowAny: (k) => remaining.includes(k),
        onWrong: (k, m) => {
          ctx.listen(false, `fetched ${k}`);
          if (m === 1) oops();
        },
      });
      const id = r.key;
      remaining.splice(remaining.indexOf(id), 1);
      if (!guided) Cook.markRight(id);
      if (ctx.tickItem) ctx.tickItem(id);
      const obj = items[id];
      delete items[id];
      Cook.sfx.right();
      const spot = spots[n % spots.length];
      await S.fly(obj, spot.x, spot.y + 60, { scale: S.fitScale(obj.texture.key, 120, 105), depth: D.front + 1, duration: fast ? 260 : 520 });
      n++;
      ctx.basket.push(id);
    }
    end();
  };

  /* ================= Pass me (Nani interrupts) ================= */
  S$.passMe = async function (S, ctx, { want } = {}) {
    if (!want) {
      // anything the player has met (spaced review), weakest first
      const met = Object.keys(Cook.save.words).filter((id) => Cook.data.words[id] && !id.startsWith("num-") && (Cook.data.words[id].heap || Cook.data.words[id].image));
      const pool = met.length >= 3 ? met : Object.keys(Cook.data.words).filter((id) => Cook.data.words[id].heap);
      pool.sort((a, b) => Cook.wordStage(a) - Cook.wordStage(b) + (Math.random() - 0.5));
      want = pool[0];
    }
    const options = [want].concat(lookalikes(want, 2));
    const prevExpect = Cook.expect;
    const relaxed = Cook.save.mode !== "busy";
    if (relaxed) Cook.paused = true;
    Cook.sfx.pop();
    Cook.markSeen(want);
    const r = await UI.passMe(want, options, { hide: hideKnown(ctx) });
    Cook.paused = false;
    if (r.misses) Cook.markMiss(want);
    else Cook.markRight(want);
    ctx.listen(r.misses === 0, `pass me ${want}`);
    ctx.result.passMe = (ctx.result.passMe || 0) + 1;
    Cook.expect = prevExpect;
  };

  /* ================= Pour (to the dashed line) ================= */
  /**
   * A vessel with a dashed fill line and a green band inside it. Hold the
   * jug to pour; the liquid rises inside the vessel and the sound rises in
   * pitch; Nani says "Enough!" as it reaches the band (while you're new).
   */
  S$.pourInto = async function (S, ctx, { vessel, liquid = "cook-paani", color = 0x9fd3f0, from = 0, target = [0.45, 0.62], jugAt = { x: 1300, y: STRIP_Y }, speak = true }) {
    const jugKey = Cook.data.words[liquid] && Cook.data.words[liquid].image ? Cook.data.words[liquid].image : "water-jug";
    const jug = S.prop(jugKey, jugAt.x, jugAt.y + 60, 170, 200, { depth: D.item + 1 });
    if (Cook.hasUpgrade("jug") && liquid === "cook-paani") S.special(jug);
    jug.label = S.label(jug, liquid);
    const home = { x: jug.x, y: jug.y, a: jug.angle };
    const [lo, hi] = target;
    vessel.drawTarget(lo, hi);
    let saidEnough = false;
    const stream = S.track(S.add.graphics().setDepth(D.fx));
    const surf = () => vessel.surface();
    if (speak) nani(Lang.wordLine(liquid), { hide: hideKnown(ctx) }).catch(() => {});
    const v = await S.pour(jug, {
      rate: 0.3,
      auto: Cook.hasUpgrade("jug"),
      lo,
      hi,
      onStart: () => S.tweens.add({ targets: jug, x: vessel.x + vessel.rimRx * 0.9, y: vessel.y - vessel.rimRy - 40, angle: -60, duration: 220 }),
      onStop: () => {
        stream.clear();
        S.tweens.add({ targets: jug, x: home.x, y: home.y, angle: home.a, duration: 260 });
      },
      onLevel: (lv) => {
        const L = from + (1 - from) * Math.min(1.08, lv);
        vessel.setLiquid(L, color);
        const p = surf();
        stream.clear();
        stream.lineStyle(10, color, 0.8);
        stream.lineBetween(jug.getBounds().left + 10, jug.getBounds().top + 20, p.x + 20, p.y);
        if (!saidEnough && lv >= lo && (ctx.guided || Cook.wordStage(liquid) <= 2)) {
          saidEnough = true;
          nani(Lang.line("enough"), { ms: 900 }).catch(() => {});
        }
        if (L > 1.0 && !vessel.spilled) {
          vessel.spilled = true;
          S.burst(vessel.x + vessel.rimRx, vessel.y, [color, 0xffffff], 14, 60);
        }
      },
    });
    const score = vessel.spilled ? 45 : S.bandScore(v, lo, hi);
    ctx.skill(score, "pour");
    S.verdict(vessel.x, vessel.y - vessel.rimRy - 90, score, { bad: v < lo ? "Too little" : "Too much!" });
    vessel.clearTarget();
    await Cook.wait(450);
    return v;
  };

  /**
   * A drawn vessel (pan, pot, kadai, cup, serving bowl, tadka pan) with a
   * liquid surface that rises inside it, and target rings.
   */
  S$.vessel = function (S, kind, x, y, scale = 1) {
    const info = Cook.Art.vesselInfo(kind);
    const key = S.tex(`vessel:${kind}`);
    const img = S.track(S.add.image(x, y, key).setScale(scale).setDepth(D.item));
    const [cx, cy, rx, ry] = info.rim;
    const ox = x - (info.w / 2) * scale;
    const oy = y - (info.h / 2) * scale;
    const rim = { x: ox + cx * scale, y: oy + cy * scale, rx: rx * scale, ry: ry * scale, depth: info.depth * scale };
    const liq = S.track(S.add.graphics().setDepth(D.item + 0.4));
    const tgt = S.track(S.add.graphics().setDepth(D.item + 0.6));
    const v = img;
    v.rimRx = rim.rx;
    v.rimRy = rim.ry;
    v.level = 0;
    v.color = 0x9fd3f0;
    const at = (L) => {
      // the surface: lower and a little narrower when shallow
      const k = Cook.clamp(L, 0, 1.05);
      const yy = rim.y + rim.depth * (1 - k) * 0.85;
      const s = 0.78 + 0.22 * k;
      return { x: rim.x, y: yy, rx: rim.rx * s * 0.96, ry: rim.ry * s * 0.9 };
    };
    v.setLiquid = (L, color) => {
      v.level = L;
      if (color != null) v.color = color;
      liq.clear();
      if (L <= 0.01) return;
      const p = at(L);
      liq.fillStyle(v.color, 0.95);
      liq.fillEllipse(p.x, p.y, p.rx * 2, p.ry * 2);
      liq.fillStyle(0xffffff, 0.22);
      liq.fillEllipse(p.x - p.rx * 0.3, p.y - p.ry * 0.3, p.rx * 0.7, p.ry * 0.4);
    };
    v.surface = () => {
      const p = at(Math.max(v.level, 0.1));
      return { x: p.x, y: p.y };
    };
    v.drawTarget = (lo, hi) => {
      tgt.clear();
      const a = at(lo);
      const b = at(hi);
      // green band between the two levels, dashed edges
      tgt.fillStyle(0x7d9a78, 0.22);
      tgt.fillEllipse(b.x, (a.y + b.y) / 2, b.rx * 2, (b.ry + a.y - b.y) * 2);
      [a, b].forEach((p) => {
        for (let t = 0; t < Math.PI * 2; t += 0.22) {
          tgt.lineStyle(5, 0x4f6b4b, 0.95);
          const x1 = p.x + Math.cos(t) * p.rx;
          const y1 = p.y + Math.sin(t) * p.ry;
          const x2 = p.x + Math.cos(t + 0.12) * p.rx;
          const y2 = p.y + Math.sin(t + 0.12) * p.ry;
          tgt.lineBetween(x1, y1, x2, y2);
        }
      });
    };
    v.clearTarget = () => tgt.clear();
    v.liqGraphics = liq;
    v.rim = rim;
    return v;
  };

  /* ================= Add (pick the named thing) ================= */
  S$.add = async function (S, ctx, { items, expected, into, say, allowAny }) {
    const r = await S.step({
      items,
      expected,
      word: expected,
      guided: ctx.guided,
      sayLine: say || Lang.wordLine(expected),
      allowAny,
      onWrong: (k, m) => {
        ctx.listen(false, `added ${k}`);
        if (m === 1) oops();
      },
    });
    const obj = items[r.key];
    const blob = S.track(S.add.circle(obj.x, obj.y - 20, 16, 0xffffff, 0.001).setDepth(D.fx));
    const spec = (Cook.data.words[r.key] || {}).heap;
    const col = spec ? Phaser.Display.Color.HexStringToColor(spec.color).color : 0x996633;
    const dot = S.track(S.add.circle(obj.x, obj.y - 20, 18, col, 1).setDepth(D.fx));
    Cook.sfx.pop();
    const p = into.surface ? into.surface() : into;
    await S.fly(dot, p.x, p.y, { duration: 380, arc: 110 });
    S.burst(p.x, p.y, col, 10, 50);
    dot.destroy();
    blob.destroy();
    if (!ctx.guided && Cook.data.words[r.key]) Cook.markRight(r.key);
    return r.key;
  };

  /* ================= Watch and tap (boil) ================= */
  S$.boil = async function (S, ctx, { vessel, knob }) {
    const burner = vessel.burnerFlame || null;
    const bubbles = S.time.addEvent({
      delay: 120,
      loop: true,
      callback: () => {
        const p = vessel.surface();
        const lv = Cook.gauge ? Cook.gauge.level : 0;
        const b = S.track(S.add.circle(p.x + (Math.random() - 0.5) * vessel.rimRx * 1.4, p.y + (Math.random() - 0.5) * vessel.rimRy, 5 + Math.random() * 8 + lv * 8, 0xfff4e0, 0.9).setDepth(D.item + 1));
        S.tweens.add({ targets: b, y: b.y - 10 - lv * 40, alpha: 0, scale: 1 + lv * 2, duration: 500, onComplete: () => b.destroy() });
        if (Math.random() < 0.3 + lv * 0.4) Cook.sfx.bubble();
      },
    });
    const boilLoop = Cook.sfx.boilLoop();
    S.loops.push(boilLoop);
    const base = vessel.level;
    // Nani sometimes interrupts mid-boil (Busy: it keeps boiling!)
    if (ctx.maybePassMe) setTimeout(() => ctx.maybePassMe(), 1400 / Cook.speed);
    const v = await S.ring(vessel, { x: vessel.rim.x, y: vessel.rim.y + vessel.rim.depth * 0.4, r: vessel.rimRx + 40, lo: 0.66, hi: 0.86, rate: 0.17, alsoTap: knob ? [knob] : [], onLevel: (lv) => vessel.setLiquid(base + lv * 0.18) });
    bubbles.remove();
    boilLoop.stop();
    let score;
    if (v >= 1) {
      for (let i = 0; i < 10; i++) {
        const f = S.track(S.add.ellipse(vessel.rim.x + (Math.random() - 0.5) * vessel.rimRx * 2, vessel.rim.y, 60, 40, 0xfff6e6, 1).setDepth(D.item + 2));
        S.tweens.add({ targets: f, y: vessel.rim.y + vessel.rim.depth + Math.random() * 60, scale: 1.6, duration: 700 });
      }
      oops();
      score = 40;
    } else score = S.bandScore(v, 0.66, 0.86);
    ctx.skill(score, "boil");
    S.verdict(vessel.rim.x, vessel.rim.y - 110, score, { bad: v >= 1 ? "Boiled over!" : "Too early" });
    vessel.setLiquid(base);
    await Cook.wait(400);
  };

  /* ================= Count in (spoons) ================= */
  S$.countIn = async function (S, ctx, { bowl, n, into, word }) {
    let count = 0;
    UI.count(0, { speak: false });
    const add = async () => {
      count++;
      UI.count(count);
      const spec = (Cook.data.words[word] || {}).heap;
      const col = spec ? Phaser.Display.Color.HexStringToColor(spec.color).color : 0xffffff;
      const spoon = S.track(S.add.circle(bowl.x, bowl.y - 30, 14, col, 1).setStrokeStyle(3, 0x8f9398).setDepth(D.fx));
      const p = into.surface ? into.surface() : into;
      await S.fly(spoon, p.x + (Math.random() - 0.5) * 60, p.y, { duration: 360, arc: 90 });
      S.burst(p.x, p.y, col, 6, 30);
      spoon.destroy();
    };
    if (ctx.guided) S.glow(bowl, true);
    await new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        Cook.expect = null;
        S.untap(bowl);
        S.glow(bowl, false);
        UI.hideDone();
        resolve();
      };
      S.tappable(bowl, () => {
        if (count >= 6) return;
        Cook.sfx.pop();
        add();
        if (ctx.guided) {
          S.glow(bowl, count < n);
          UI.glowDone(count >= n);
        }
      });
      UI.done().then(finish);
      const c = S.centre(bowl);
      Cook.expect = { kind: "count", x: c.x, y: c.y, target: n, count: () => count, doneSel: "#done-btn" };
    });
    UI.hideCount();
    ctx.listen(count === n, `count ${word} ${count}/${n}`);
    count === n ? Cook.markRight(`num-0${n}`) : Cook.markMiss(`num-0${n}`);
    return count;
  };

  /* ================= Knead ================= */
  S$.knead = async function (S, ctx) {
    await begin(S, ctx, "knead", "wood");
    const bowl = S.flat(S.tex("vessel:serving"), 800, 420, 520, 360);
    const dough = S.track(S.add.image(800, 400, "dough-ball").setScale(0.62).setDepth(D.item + 1).setTint(0xf4e6c8));
    dough.baseScale = 0.62;
    const handImg = S.hand(null, { x: 800, y: 560 });
    const need = 8;
    let presses = 0;
    const ring = S.track(S.add.graphics().setDepth(D.fx));
    const drawRing = () => {
      ring.clear();
      ring.lineStyle(14, 0x7d9a78, 0.9);
      ring.beginPath();
      ring.arc(800, 400, 200, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * presses) / need);
      ring.strokePath();
    };
    const press = () => {
      presses++;
      Cook.sfx.flip();
      S.tweens.add({ targets: handImg, y: 470, duration: 80, yoyo: true });
      S.tweens.add({ targets: dough, scaleX: dough.baseScale * 1.22, scaleY: dough.baseScale * 0.8, duration: 90, yoyo: true });
      dough.setTint(Phaser.Display.Color.GetColor(244 - presses, 230 + presses, 200 + presses * 4));
      S.burst(800, 390, [0xf4ead8, 0xffffff], 5, 50);
      drawRing();
    };
    if (Cook.hasUpgrade("mixer")) {
      S.special(bowl);
      for (let i = 0; i < need; i++) {
        press();
        await Cook.wait(140);
      }
    } else {
      S.ghost([[800, 380], [800, 430]], { duration: 500, delay: ctx.guided ? 200 : 5000 });
      await new Promise((resolve) => {
        const zone = S.track(S.add.zone(800, 420, 520, 360).setDepth(D.fx + 3));
        S.tappable(zone, () => {
          press();
          if (presses >= need) {
            S.untap(zone);
            Cook.expect = null;
            resolve();
          }
        });
        Cook.expect = { kind: "knead", x: 800, y: 420 };
      });
    }
    dough.clearTint();
    S.sparkle(800, 400);
    ctx.skill(100, "knead");
    await Cook.wait(400);
    end();
  };

  /* ================= Roll (and decide how many) ================= */
  S$.roll = async function (S, ctx, { count }) {
    await begin(S, ctx, "roll", "wood");
    const rolled = [];
    const spare = S.track(S.add.image(230, 760, "dough-ball").setScale(0.45).setDepth(D.item));
    spare.baseScale = 0.45;
    const stack = [];
    for (;;) {
      spare.setVisible(false);
      const score = await rollOne(S, ctx);
      rolled.push(score);
      ctx.skill(score, "roll");
      const done = S.track(S.add.image(1330, 700 - stack.length * 10, "chapati-raw").setScale(0.36).setDepth(D.item + stack.length));
      stack.push(done);
      UI.count(rolled.length);
      if (rolled.length >= 6) break;
      spare.setVisible(true);
      if (ctx.guided && rolled.length < count) S.glow(spare, true);
      const more = await new Promise((resolve) => {
        const finish = (v) => {
          Cook.expect = null;
          S.untap(spare);
          S.glow(spare, false);
          UI.hideDone();
          resolve(v);
        };
        S.tappable(spare, () => finish(true));
        UI.done({ glow: ctx.guided && rolled.length >= count }).then(() => finish(false));
        const c = S.centre(spare);
        Cook.expect = { kind: "more", x: c.x, y: c.y, target: count, count: () => rolled.length };
      });
      if (!more) break;
    }
    UI.hideCount();
    ctx.result.maani = rolled.length;
    ctx.listen(rolled.length === count, `maani ${rolled.length}/${count}`);
    end();
    return rolled.length;
  };
  function rollOne(S, ctx) {
    return new Promise((resolve) => {
      const cx = 780;
      const cy = 430;
      const R0 = 170;
      let r = 60;
      const chakla = S.flat(S.tex("chakla"), cx, cy + 10, 560, 460, { depth: D.item - 2 });
      const dough = S.track(S.add.image(cx, cy, "dough-ball").setDepth(D.item + 1));
      const setR = () => {
        const key = r < 90 ? "dough-ball" : "chapati-raw";
        dough.setTexture(key);
        dough.setScale((r * 2) / S.texSize(key).w);
      };
      setR();
      const guide = S.track(S.add.graphics().setDepth(D.fx));
      const drawGuide = (ok) => {
        guide.clear();
        guide.lineStyle(7, ok ? 0x4f6b4b : 0xffffff, 0.95);
        for (let a = 0; a < 360; a += 12) {
          guide.beginPath();
          guide.arc(cx, cy, R0, Phaser.Math.DegToRad(a), Phaser.Math.DegToRad(a + 6));
          guide.strokePath();
        }
      };
      drawGuide(false);
      const good = Cook.hasUpgrade("pin");
      const pin = S.hand("pin", { x: cx, y: cy + 60 });
      if (good) S.special(pin);
      let last = null;
      let quiet = null;
      let torn = false;
      const done = () => {
        Cook.expect = null;
        S.input.off("pointermove", move);
        S.input.off("pointerdown", down);
        S.input.off("pointerup", up);
        clearTimeout(quiet);
        guide.destroy();
        const score = torn ? 45 : S.bandScore(r / R0, 0.92, 1.1);
        S.verdict(cx, cy - 200, score, { bad: r < R0 * 0.92 ? "Too small" : "Too thin!" });
        Cook.sfx.right();
        S.tweens.add({ targets: [dough, pin, chakla], alpha: 0, duration: 250, delay: 250, onComplete: () => [dough, pin, chakla].forEach((o) => o.destroy()) });
        setTimeout(() => resolve(score), 520 / Cook.speed);
      };
      const down = (p) => {
        last = { x: p.worldX, y: p.worldY };
        clearTimeout(quiet);
      };
      const move = (p) => {
        if (!p.isDown || !last) return;
        const dy = p.worldY - last.y;
        const dx = p.worldX - last.x;
        const d = Math.hypot(dx, dy);
        if (d < 4) return;
        last = { x: p.worldX, y: p.worldY };
        pin.y = Cook.clamp(p.worldY, cy - 150, cy + 150);
        r = Math.min(good ? R0 * 1.02 : R0 * 1.45, r + d * (good ? 0.3 : 0.15));
        if (r > R0 * 1.3 && !torn) {
          torn = true;
          S.burst(cx, cy, [0xf3e1b8, 0xffffff], 10, 80);
          oops();
        }
        setR();
        drawGuide(r >= R0 * 0.92 && r <= R0 * 1.1);
        Cook.gauge = { level: r / R0, lo: 0.92, hi: 1.1 };
        if (Math.random() < 0.12) Cook.sfx.flip();
      };
      const up = () => {
        last = null;
        clearTimeout(quiet);
        if (r >= R0 * 0.8) quiet = setTimeout(done, 700 / Cook.speed);
      };
      S.input.on("pointerdown", down);
      S.input.on("pointermove", move);
      S.input.on("pointerup", up);
      S.ghost([[cx, cy + 110], [cx, cy - 110], [cx, cy + 110]], { duration: 900, delay: ctx.guided ? 200 : 5000 });
      Cook.gauge = { level: r / R0, lo: 0.92, hi: 1.1 };
      Cook.expect = { kind: "roll", x: cx, y: cy, r: R0 };
    });
  }

  /* ================= Flip (tawa) ================= */
  S$.flip = async function (S, ctx, { n }) {
    await begin(S, ctx, "flip", "hob");
    const tw = S.flat(S.tex("tawa"), BURNER.right.x, BURNER.right.y, 470, 410, { depth: D.item - 1 });
    if (Cook.hasUpgrade("tawa")) S.special(tw);
    const plate = S.flat(S.tex("vessel:serving"), 360, STRIP_Y - 20, 300, 200);
    const spat = S.hand("spatula", { x: 1300, y: 640, angle: -20 });
    const heavy = Cook.hasUpgrade("tawa");
    const band = heavy ? [0.5, 0.9] : [0.6, 0.82];
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);
    for (let i = 0; i < n; i++) {
      const ch = S.track(S.add.image(BURNER.right.x, BURNER.right.y, "chapati-raw").setScale(0.7).setDepth(D.item + 1));
      ch.baseScale = 0.7;
      if (i === 0 && ctx.maybePassMe) setTimeout(() => ctx.maybePassMe(), 1500 / Cook.speed);
      const v1 = await S.ring(ch, { r: 180, lo: band[0], hi: band[1], rate: 0.24 * (1 + i * 0.08), onLevel: (v) => ch.setTint(Phaser.Display.Color.GetColor(255, 255 - v * 45, 255 - v * 90)) });
      // the spatula slides under and flips it
      await Cook.tween(S, { targets: spat, x: BURNER.right.x + 40, y: BURNER.right.y + 30, duration: 120 });
      Cook.sfx.flip();
      await Cook.tween(S, { targets: ch, scaleY: 0.02, duration: 110 });
      ch.setTexture("chapati-half").clearTint();
      ch.setScale(0.7, 0.02);
      await Cook.tween(S, { targets: ch, scaleY: 0.7, duration: 110 });
      S.tweens.add({ targets: spat, x: 1300, y: 640, duration: 200 });
      const a = v1 >= 1 ? 40 : S.bandScore(v1, band[0], band[1]);
      S.verdict(BURNER.right.x, BURNER.right.y - 230, a, { bad: v1 >= 1 ? "Burnt!" : "Too early" });
      const v2 = await S.ring(ch, { r: 180, lo: band[0], hi: band[1], rate: 0.26 * (1 + i * 0.08) });
      Cook.sfx.puff();
      ch.setTexture("chapati-puffed");
      ch.setScale(0.56);
      await Cook.tween(S, { targets: ch, scale: 0.66, duration: 220, ease: "Back.easeOut", yoyo: true });
      S.steam(BURNER.right.x, BURNER.right.y - 80, 4);
      const b = v2 >= 1 ? 40 : S.bandScore(v2, band[0], band[1]);
      S.verdict(BURNER.right.x, BURNER.right.y - 230, b, { perfect: "It puffed!", bad: v2 >= 1 ? "Burnt!" : "Flat" });
      ctx.skill((a + b) / 2, "tawa");
      await S.fly(ch, 360, STRIP_Y - 40 - i * 8, { scale: 0.42, duration: 450 });
    }
    sizzle.stop();
    end();
  };

  /* ================= Chop (Fruit Ninja style) ================= */
  /**
   * Vegetables are tossed up; slice only the ones Nani named, as many as
   * she said ("only three tomatoes"). Slicing the wrong one: "Arre re!".
   */
  S$.chop = async function (S, ctx, { targets, pool }) {
    await begin(S, ctx, "chop", "wood");
    const want = Object.assign({}, targets);
    const ids = Object.keys(want);
    const lines = ids.map((id) => Lang.line("only", Lang.phrase(want[id] > 1 ? [want[id], id] : [id])));
    ids.forEach((id) => Cook.markSeen(id));
    await nani(Lang.join(lines), { hide: hideKnown(ctx) });
    const sharp = Cook.hasUpgrade("knife");
    const knife = S.hand("knife", { x: 1300, y: 640, angle: -25 });
    if (sharp) S.special(knife);
    const flying = [];
    const cut = {};
    let wrong = 0;
    const texFor = (id) => {
      const w = Cook.data.words[id];
      if (w.image && S.textures.exists(w.image)) return w.image;
      return S.tex(`piece:${id}`);
    };
    const throwOne = () => {
      const needed = ids.filter((id) => (cut[id] || 0) < want[id]);
      const pick = needed.length && Math.random() < 0.55 ? Cook.pick(needed) : Cook.pick(pool);
      const key = texFor(pick);
      const img = S.track(S.add.image(200 + Math.random() * 1200, 980, key).setDepth(D.item + 2));
      img.setScale(S.fitScale(key, 170, 170));
      img.wordId = pick;
      img.vx = (800 - img.x) * (0.25 + Math.random() * 0.3);
      img.vy = -(1050 + Math.random() * 180);
      img.spin = (Math.random() - 0.5) * 5;
      flying.push(img);
    };
    const halves = (img) => {
      const key = img.texture.key;
      const { w, h } = S.texSize(key);
      [0, 1].forEach((side) => {
        const half = S.track(S.add.image(img.x, img.y, key).setScale(img.scale).setDepth(D.item + 3).setCrop(side ? w / 2 : 0, 0, w / 2, h));
        S.tweens.add({ targets: half, x: img.x + (side ? 120 : -120), y: img.y + 240, angle: side ? 60 : -60, alpha: 0, duration: 700, onComplete: () => half.destroy() });
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
        knife.setPosition(cur.x + 40, cur.y + 20);
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
                Lang.speak(Lang.num(Math.min(5, cut[id])) ? { segs: Lang.num(Math.min(5, cut[id])), en: "" } : null);
                S.burst(img.x, img.y, [0xffffff, 0xf6d27a], 10, 70);
              } else {
                wrong++;
                ctx.listen(false, `sliced ${id}`);
                if (wrong === 1 || wrong % 3 === 0) oops();
                S.burst(img.x, img.y, [0xb24a3a, 0xffd6c9], 10, 60);
              }
              halves(img);
              img.destroy();
              if (sharp && ok) {
                // the sharp knife also catches a second target near the first
                const near = flying.find((o) => o.active && !o.sliced && ids.includes(o.wordId) && (cut[o.wordId] || 0) < want[o.wordId] && Phaser.Math.Distance.Between(o.x, o.y, cur.x, cur.y) < 220);
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
      S.input.on("pointermove", move);
      S.input.on("pointerup", up);
      S.ghost([[400, 450], [1200, 380]], { duration: 500, delay: ctx.guided ? 400 : 6000 });
      S.tick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000) * Cook.speed;
        last = now;
        spawnT -= dt;
        if (spawnT <= 0 && flying.filter((f) => f.active).length < 3) {
          throwOne();
          spawnT = 1.1 - Math.min(0.5, (Cook.wordStage(ids[0]) - 1) * 0.12);
        }
        flying.forEach((img) => {
          if (!img.active) return;
          img.vy += 1250 * dt;
          img.x += img.vx * dt;
          img.y += img.vy * dt;
          img.angle += img.spin;
          if (img.y > 1050 && img.vy > 0) img.destroy();
        });
        trail.clear();
        const t0 = performance.now() - 160;
        const pts = trailPts.filter((q) => q.t > t0);
        trailPts.length = 0;
        trailPts.push(...pts);
        if (pts.length > 1) {
          trail.lineStyle(10, 0xffffff, 0.8);
          trail.beginPath();
          trail.moveTo(pts[0].x, pts[0].y);
          pts.forEach((q) => trail.lineTo(q.x, q.y));
          trail.strokePath();
        }
        // for the automated test: the nearest target in flight
        const tgt = flying.find((o) => o.active && !o.sliced && ids.includes(o.wordId) && (cut[o.wordId] || 0) < want[o.wordId] && o.y < 780 && o.y > 150);
        Cook.expect = tgt ? { kind: "slice", x: tgt.x, y: tgt.y, x1: tgt.x - 120, y1: tgt.y - 40, x2: tgt.x + 120, y2: tgt.y + 40 } : { kind: "wait" };
        if (doneNow()) {
          S.tick = null;
          S.input.off("pointermove", move);
          S.input.off("pointerup", up);
          Cook.expect = null;
          resolve();
        }
      };
    });
    UI.hideCount();
    flying.forEach((o) => o.active && o.destroy());
    ids.forEach((id) => (wrong ? Cook.markMiss(id) : Cook.markRight(id)));
    ctx.result.chopped = cut;
    ctx.skill(100, "chop");
    S.sparkle(800, 450);
    await Cook.wait(500);
    end();
  };

  /* ================= Tadka (spices in order) ================= */
  S$.tadka = async function (S, ctx, { order, veg = [] }) {
    await begin(S, ctx, "tadka", "hob");
    const pan = S$.vessel(S, "tadka", BURNER.right.x, BURNER.right.y - 20, 1.3);
    pan.setLiquid(0.6, 0xe8b24a);
    const pot = S$.vessel(S, "pot", BURNER.left.x, BURNER.left.y - 40, 1.0);
    pot.setLiquid(0.6, 0xe7b23f);
    const spices = Cook.shuffle(["spi-02", "spi-05", "spi-01", "veg-12", "spi-16", "veg-13"].filter((x, i, a) => a.indexOf(x) === i));
    const items = {};
    row(spices.length + veg.length, { x0: 180, x1: 1420 }).forEach((p, i) => {
      const id = i < spices.length ? spices[i] : veg[i - spices.length];
      items[id] = S.ingredient(id, p.x, p.y - 20, { w: 175, h: 130 });
    });
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);
    order.forEach((id) => Cook.markSeen(id));
    const line = Lang.list(order);
    await nani(line, { hide: hideKnown(ctx) });
    const colorOf = (id) => {
      const h = (Cook.data.words[id] || {}).heap;
      return h ? Phaser.Display.Color.HexStringToColor(h.color).color : 0x996633;
    };
    for (const id of order.concat(veg)) {
      const r = await S.step({
        items,
        expected: id,
        word: id,
        guided: ctx.guided,
        sayLine: Lang.wordLine(id),
        onWrong: (k, m) => {
          ctx.listen(false, `tadka ${k} before ${id}`);
          S.burst(pan.rim.x, pan.rim.y, 0xfff0c0, 6, 50);
          if (m === 1) oops();
        },
      });
      if (!ctx.guided) r.misses ? Cook.markMiss(id) : Cook.markRight(id);
      const obj = items[id];
      const dot = S.track(S.add.circle(obj.x, obj.y - 20, 20, colorOf(id), 1).setDepth(D.fx));
      await S.fly(dot, pan.rim.x, pan.rim.y, { duration: 340, arc: 100 });
      S.burst(pan.rim.x, pan.rim.y, [colorOf(id), 0xfff0c0], 16, 70);
      Cook.sfx.sizzle(0.8);
      dot.destroy();
      obj.setAlpha(0.45);
    }
    // tip it into the pot
    if (!Cook.hasUpgrade("tadka")) {
      await S.step({ items: { tadka: pan }, expected: "tadka", guided: ctx.guided, sayLine: null });
    } else S.special(pan);
    await Cook.tween(S, { targets: pan, x: BURNER.left.x + 220, y: BURNER.left.y - 140, angle: -50, duration: 420 });
    Cook.sfx.sizzle(1.4);
    S.steam(pot.rim.x, pot.rim.y - 30, 6);
    pot.setLiquid(0.65, 0xe0a42c);
    sizzle.stop();
    ctx.skill(100, "tadka");
    await Cook.wait(500);
    end();
  };

  /* ================= Stir (count and speed) ================= */
  S$.stir = async function (S, ctx, { laps, speed }) {
    await begin(S, ctx, "stir", "hob");
    const pot = S$.vessel(S, "pot", BURNER.left.x + 200, BURNER.left.y - 30, 1.35);
    pot.setLiquid(0.72, 0xe0a42c);
    if (Cook.hasUpgrade("pot")) S.special(pot);
    const parts = [Lang.numLine(laps)];
    if (speed) parts.push(Lang.line(speed === "slow" ? "slowly" : "quickly"));
    Cook.markSeen(`num-0${laps}`);
    await nani(Lang.join(parts), { hide: hideKnown(ctx) });
    const c = pot.surface();
    const cx = c.x;
    const cy = c.y;
    const ladle = S.hand("ladle", { x: cx + 80, y: cy + 40 });
    // speedometer beside the pot
    const zone = speed === "slow" ? [0.25, 0.75] : speed === "quick" ? [1.2, 2.6] : [0.2, 3];
    const meter = S.track(S.add.graphics().setDepth(D.fx));
    const mx = 1250;
    const my = 330;
    let spd = 0;
    const drawMeter = () => {
      meter.clear();
      if (!speed) return;
      const toA = (v) => Math.PI + Cook.clamp(v / 3, 0, 1) * Math.PI;
      meter.lineStyle(24, 0xfffaf1, 0.9);
      meter.beginPath();
      meter.arc(mx, my, 110, Math.PI, Math.PI * 2);
      meter.strokePath();
      meter.lineStyle(24, 0x7d9a78, 1);
      meter.beginPath();
      meter.arc(mx, my, 110, toA(zone[0]), toA(zone[1]));
      meter.strokePath();
      const a = toA(spd);
      meter.lineStyle(8, 0xb24a3a, 1);
      meter.lineBetween(mx, my, mx + Math.cos(a) * 100, my + Math.sin(a) * 100);
      meter.fillStyle(0x3a2410, 1);
      meter.fillCircle(mx, my, 12);
    };
    drawMeter();
    const easy = Cook.hasUpgrade("pot");
    const lapA = easy ? Math.PI * 1.6 : Math.PI * 2;
    const result = await new Promise((resolve) => {
      let prev = null;
      let acc = 0;
      let count = 0;
      let quiet = null;
      let inZone = 0;
      let total = 0;
      let lastT = performance.now();
      const finish = () => {
        Cook.expect = null;
        S.input.off("pointermove", move);
        S.input.off("pointerup", up);
        UI.hideCount();
        resolve({ count, zoneFrac: total ? inZone / total : 1 });
      };
      const move = (p) => {
        if (!p.isDown) return (prev = null);
        ladle.setPosition(p.worldX, p.worldY);
        const dx = p.worldX - cx;
        const dy = (p.worldY - cy) * 2;
        const dist = Math.hypot(dx, dy);
        if (dist < (easy ? 12 : 30) || dist > 480) return;
        const a = Math.atan2(dy, dx);
        clearTimeout(quiet);
        const now = performance.now();
        const dt = Math.max(0.001, (now - lastT) / 1000) * Cook.speed;
        lastT = now;
        if (prev != null) {
          let d = a - prev;
          if (d > Math.PI) d -= Math.PI * 2;
          if (d < -Math.PI) d += Math.PI * 2;
          acc += Math.abs(d);
          spd = spd * 0.85 + (Math.abs(d) / (Math.PI * 2) / dt) * 0.15;
          total += dt;
          if (spd >= zone[0] && spd <= zone[1]) inZone += dt;
          drawMeter();
          if (acc >= lapA) {
            acc -= lapA;
            count++;
            UI.count(count);
            Cook.sfx.bubble();
            S.burst(cx, cy, [0xe0a42c, 0xf6d27a], 8, 60);
          }
        }
        prev = a;
      };
      const up = () => {
        prev = null;
        clearTimeout(quiet);
        if (count >= 1) quiet = setTimeout(finish, 900 / Cook.speed);
      };
      S.input.on("pointermove", move);
      S.input.on("pointerup", up);
      S.ghost({ circle: { x: cx, y: cy, rx: 150, ry: 60 } }, { duration: speed === "quick" ? 700 : 1500, delay: ctx.guided ? 200 : 5000 });
      Cook.expect = { kind: "stir", x: cx, y: cy, rx: 150, ry: 60, target: laps, speed: speed || null, count: () => 0 };
      Cook.stirCount = () => count;
    });
    ctx.listen(result.count === laps, `stir ${result.count}/${laps}`);
    result.count === laps ? Cook.markRight(`num-0${laps}`) : Cook.markMiss(`num-0${laps}`);
    if (speed) {
      const ok = result.zoneFrac >= 0.5;
      ctx.listen(ok, `stir speed ${speed}`);
      ctx.skill(Math.round(40 + result.zoneFrac * 60), "stir speed");
    }
    S.sparkle(cx, cy);
    S.steam(cx, cy - 60, 4);
    await Cook.wait(500);
    end();
  };

  /* ================= Assemble (chaat bowl) ================= */
  S$.assemble = async function (S, ctx, { sequence, exclude = [], pool }) {
    await begin(S, ctx, "assemble", "marble");
    const bowl = S$.vessel(S, "serving", 800, 330, 1.45);
    const ids = Cook.shuffle([...new Set(pool.concat(sequence, exclude))]);
    const items = {};
    const pts = ids.length > 6 ? row(ids.length, { x0: 130, x1: 1470 }) : row(ids.length, { x0: 240, x1: 1360 });
    ids.forEach((id, i) => (items[id] = S.ingredient(id, pts[i].x, pts[i].y - 30, { w: 165, h: 124 })));
    const fast = Cook.hasUpgrade("bigspoon");
    let layerN = 0;
    for (let i = 0; i < sequence.length; i++) {
      const id = sequence[i];
      Cook.markSeen(id);
      const r = await S.step({
        items,
        expected: id,
        word: id,
        guided: ctx.guided,
        sayLine: Lang.wordLine(id),
        onWrong: (k, m) => {
          ctx.listen(false, exclude.includes(k) ? `added ${k} (they said no)` : `${k} out of order`);
          if (exclude.includes(k)) nani(Lang.line("no", Lang.phrase([k])), { ms: 1100 }).catch(() => {});
          else if (m === 1) oops();
        },
      });
      if (!ctx.guided) r.misses ? Cook.markMiss(id) : Cook.markRight(id);
      if (ctx.tickItem) ctx.tickItem(id);
      const obj = items[id];
      const spoon = S.track(S.add.image(obj.x, obj.y - 10, S.tex(`layer:${id}`)).setScale(0.35).setDepth(D.fx));
      Cook.sfx.pop();
      const p = bowl.surface();
      await S.fly(spoon, p.x + (Math.random() - 0.5) * 30, p.y - layerN * 4, { scale: 0.62 - layerN * 0.03, duration: fast ? 220 : 420, arc: 120 });
      spoon.setDepth(D.item + 1 + layerN * 0.1);
      layerN++;
      obj.setAlpha(0.5);
    }
    ctx.result.layers = sequence.slice();
    ctx.skill(100, "assemble");
    S.sparkle(800, 300);
    await Cook.wait(500);
    end();
  };

  /* ================= Fill and fold (samosa) ================= */
  S$.fillFold = async function (S, ctx, { fillings, exclude = [], pool, index = 0, total = 1 }) {
    await begin(S, ctx, index === 0 ? "fill" : "fold", "marble");
    if (index > 0) UI.gist(`Samosa ${index + 1} of ${total}`);
    const sheet = S.track(S.add.image(800, 330, S.tex("pastry:0")).setScale(1.1).setDepth(D.item));
    const ids = Cook.shuffle([...new Set(pool.concat(fillings, exclude))]);
    const items = {};
    row(ids.length, { x0: 260, x1: 1340 }).forEach((p, i) => (items[ids[i]] = S.ingredient(ids[i], p.x, p.y - 30, { w: 165, h: 124 })));
    const remaining = fillings.slice();
    let n = 0;
    while (remaining.length) {
      const expected = remaining[0];
      Cook.markSeen(expected);
      const r = await S.step({
        items,
        expected,
        word: expected,
        guided: ctx.guided,
        sayLine: Lang.wordLine(expected),
        allowAny: (k) => remaining.includes(k),
        onWrong: (k, m) => {
          ctx.listen(false, exclude.includes(k) ? `put ${k} in (they said no)` : `put ${k} in`);
          if (exclude.includes(k)) nani(Lang.line("no", Lang.phrase([k])), { ms: 1100 }).catch(() => {});
          else if (m === 1) oops();
        },
      });
      remaining.splice(remaining.indexOf(r.key), 1);
      if (!ctx.guided) Cook.markRight(r.key);
      if (ctx.tickItem && index === 0) ctx.tickItem(r.key);
      const obj = items[r.key];
      const blob = S.track(S.add.image(obj.x, obj.y, S.tex(`layer:${r.key}`)).setScale(0.3).setDepth(D.fx));
      await S.fly(blob, 800 + (n % 2 ? 20 : -20), 360 - n * 6, { scale: 0.34, duration: 380, arc: 120 });
      blob.setDepth(D.item + 1);
      n++;
      obj.setAlpha(0.5);
    }
    // fold along the dashed lines: three swipes
    UI.gist(Cook.data.stations.fold.goal);
    Object.values(items).forEach((o) => {
      o.setVisible(false);
      if (o.label) o.label.setVisible(false);
    });
    const folds = [
      [[640, 470], [860, 210]],
      [[960, 470], [740, 210]],
      [[630, 430], [970, 430]],
    ];
    const g = S.track(S.add.graphics().setDepth(D.fx));
    for (let f = 0; f < folds.length; f++) {
      const [[x1, y1], [x2, y2]] = folds[f];
      g.clear();
      for (let t = 0; t < 1; t += 0.06) {
        g.lineStyle(7, 0x3a2410, 0.75);
        g.lineBetween(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, x1 + (x2 - x1) * (t + 0.03), y1 + (y2 - y1) * (t + 0.03));
      }
      g.fillStyle(0xb24a3a, 1);
      g.fillCircle(x1, y1, 12);
      const gh = S.ghost([[x1, y1], [x2, y2]], { duration: 700, delay: ctx.guided || f === 0 ? 200 : 4000 });
      await new Promise((resolve) => {
        let start = null;
        const down = (p) => (start = { x: p.worldX, y: p.worldY });
        const up = (p) => {
          if (!start) return;
          const dx = p.worldX - start.x;
          const dy = p.worldY - start.y;
          const len = Math.hypot(dx, dy);
          const want = Math.hypot(x2 - x1, y2 - y1);
          const dot = (dx * (x2 - x1) + dy * (y2 - y1)) / (len * want || 1);
          start = null;
          if (len > want * 0.45 && dot > 0.6) {
            S.input.off("pointerdown", down);
            S.input.off("pointerup", up);
            Cook.expect = null;
            resolve();
          } else Cook.sfx.soft();
        };
        S.input.on("pointerdown", down);
        S.input.on("pointerup", up);
        Cook.expect = { kind: "swipe", x1, y1, x2, y2 };
      });
      gh.stop();
      Cook.sfx.flip();
      sheet.setTexture(S.tex(`pastry:${f + 1}`));
      S.tweens.add({ targets: sheet, scaleX: 1.02, duration: 90, yoyo: true });
    }
    g.destroy();
    S.children.list.filter((o) => o.depth === D.item + 1 && o.texture && o.texture.key.startsWith("layer:")).forEach((o) => o.setVisible(false));
    S.sparkle(800, 330);
    ctx.skill(100, "fold");
    ctx.result.fillings = fillings.slice();
    await Cook.wait(400);
    end();
  };

  /* ================= Fry (several at once) ================= */
  /**
   * Drop them into the oil, then lift each out when its own ring reaches
   * green. Several cook at once, at different times: juggling. The count
   * ("fry two") is the Kutchi; there are more on the tray than asked for.
   */
  S$.fry = async function (S, ctx, { kind = "samosa", count }) {
    await begin(S, ctx, "fry", "hob");
    const kadai = S$.vessel(S, "kadai", BURNER.left.x + 190, BURNER.left.y - 10, 1.55);
    kadai.setLiquid(0.8, 0xe6b84a);
    const wide = Cook.hasUpgrade("slotted");
    const band = wide ? [0.5, 0.92] : [0.62, 0.84];
    const onTray = count + 1;
    const trayKey = kind === "samosa" ? S.tex("pastry:3") : S.tex("bowl:ph-chips");
    const tray = [];
    Array.from({ length: onTray }).forEach((_, i) => {
      const img = S.track(S.add.image(1505, 230 + i * 150, trayKey).setScale(kind === "samosa" ? 0.36 : 0.6).setDepth(D.item));
      img.baseScale = img.scale;
      tray.push(img);
    });
    const spoon = S.hand("spoon", { x: 1300, y: 700, angle: -15 });
    if (wide) S.special(spoon);
    const sizzle = Cook.sfx.sizzleLoop();
    S.loops.push(sizzle);
    const frying = [];
    const doneOut = [];
    let dropped = 0;
    const slotPos = (i) => ({ x: kadai.rim.x + [-120, 40, 180, -40][i % 4], y: kadai.rim.y + [10, -30, 20, 50][i % 4] });
    const ringG = S.track(S.add.graphics().setDepth(D.fx + 1));
    const drawRings = () => {
      ringG.clear();
      frying.forEach((f) => {
        if (f.out) return;
        const a0 = -Math.PI / 2;
        ringG.lineStyle(10, 0xfffaf1, 0.8);
        ringG.beginPath();
        ringG.arc(f.x, f.y, 70, 0, Math.PI * 2);
        ringG.strokePath();
        ringG.lineStyle(10, 0x7d9a78, 1);
        ringG.beginPath();
        ringG.arc(f.x, f.y, 70, a0 + band[0] * Math.PI * 2, a0 + band[1] * Math.PI * 2);
        ringG.strokePath();
        ringG.lineStyle(7, f.v > band[1] ? 0xb24a3a : 0xc9973a, 1);
        ringG.beginPath();
        ringG.arc(f.x, f.y, 70, a0, a0 + Math.min(1, f.v) * Math.PI * 2);
        ringG.strokePath();
      });
    };
    await new Promise((resolve) => {
      tray.forEach((t) =>
        S.tappable(t, () => {
          const i = dropped++;
          S.untap(t);
          const p = slotPos(i);
          Cook.sfx.sizzle(0.6);
          S.fly(t, p.x, p.y, { duration: 320, arc: 80, scale: t.baseScale * 0.9 }).then(() => {
            S.burst(p.x, p.y, [0xfff0c0, 0xe6b84a], 10, 50);
            const f = { img: t, x: p.x, y: p.y, v: 0, rate: 0.13 + Math.random() * 0.05, out: false };
            frying.push(f);
            S.tappable(t, () => lift(f));
          });
        })
      );
      const lift = (f) => {
        if (f.out) return;
        f.out = true;
        S.untap(f.img);
        const score = f.v >= 1 ? 40 : S.bandScore(f.v, band[0], band[1]);
        ctx.skill(score, "fry");
        S.verdict(f.x, f.y - 90, score, { perfect: "Golden!", bad: f.v >= 1 ? "Burnt!" : "Too pale" });
        Cook.sfx.pop();
        S.tweens.add({ targets: spoon, x: f.x + 40, y: f.y + 40, duration: 100 });
        S.fly(f.img, 300 + doneOut.length * 90, STRIP_Y - 30, { duration: 380, arc: 120 });
        doneOut.push(f);
        if (dropped === doneOut.length && dropped >= 1) checkDone();
      };
      const checkDone = () => {
        UI.done({ glow: ctx.guided && doneOut.length >= count }).then(() => {
          S.tick = null;
          ringG.clear();
          Cook.expect = null;
          resolve();
        });
      };
      let last = performance.now();
      S.tick = () => {
        const now = performance.now();
        const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
        last = now;
        frying.forEach((f) => {
          if (f.out) return;
          f.v += f.rate * dt;
          f.img.setTint(Phaser.Display.Color.GetColor(255, 255 - Math.min(1, f.v) * 60, 255 - Math.min(1, f.v) * 130));
          const inB = f.v >= band[0] && f.v <= band[1];
          if (inB !== !!f.glow) {
            f.glow = inB;
            S.glow(f.img, inB);
          }
          if (f.v >= 1.15) lift(f);
        });
        drawRings();
        // for the test: lift anything in the band, else drop another if needed
        const ready = frying.find((f) => !f.out && f.v >= (band[0] + band[1]) / 2);
        const next = dropped < count ? tray.find((t) => t.input && t.input.enabled) : null;
        if (ready) Cook.expect = { kind: "tap", x: ready.x, y: ready.y, key: "lift" };
        else if (next) Cook.expect = { kind: "tap", x: next.x, y: next.y, key: "drop" };
        else if (dropped === doneOut.length && dropped >= count) Cook.expect = { kind: "click", selector: "#done-btn" };
        else Cook.expect = { kind: "wait" };
      };
      if (ctx.guided) S.glow(tray[0], true);
    });
    sizzle.stop();
    ctx.result.fried = doneOut.length;
    ctx.listen(doneOut.length === count, `fried ${doneOut.length}/${count}`);
    end();
  };

  /* ================= Thread (skewer) ================= */
  S$.thread = async function (S, ctx, { sequence, pool }) {
    await begin(S, ctx, "thread", "marble");
    const sk = S.track(S.add.image(800, 330, S.tex("skewer")).setDepth(D.item));
    const ids = Cook.shuffle([...new Set(pool.concat(sequence))]);
    const items = {};
    row(ids.length, { x0: 300, x1: 1300 }).forEach((p, i) => (items[ids[i]] = S.ingredient(ids[i], p.x, p.y - 30, { w: 165, h: 124 })));
    const on = [];
    for (let i = 0; i < sequence.length; i++) {
      const id = sequence[i];
      Cook.markSeen(id);
      const r = await S.step({
        items,
        expected: id,
        word: id,
        guided: ctx.guided,
        sayLine: Lang.wordLine(id),
        onWrong: (k, m) => {
          ctx.listen(false, `${k} instead of ${id}`);
          if (m === 1) oops();
        },
      });
      if (!ctx.guided) r.misses ? Cook.markMiss(id) : Cook.markRight(id);
      if (ctx.tickItem) ctx.tickItem(i);
      const obj = items[id];
      const pc = S.track(S.add.image(obj.x, obj.y, S.tex(`piece:${id}`)).setScale(0.9).setDepth(D.item + 1));
      Cook.sfx.pop();
      await S.fly(pc, 1060 - on.length * 110, 330, { duration: 360, arc: 100 });
      on.push(pc);
    }
    ctx.result.skewer = sequence.slice();
    ctx.skill(100, "thread");
    S.sparkle(800, 330);
    await Cook.wait(400);
    end();
    return on.length;
  };

  /* ================= Grill (turn it when it's charred) ================= */
  S$.grill = async function (S, ctx, { skewer }) {
    await begin(S, ctx, "grill", "marble");
    S.flat(S.tex("grill"), 800, 420, 900, 440, { depth: D.item - 2 });
    const sk = S.track(S.add.image(800, 420, S.tex("skewer")).setDepth(D.item));
    const pieces = skewer.map((id, i) => S.track(S.add.image(1060 - i * 110, 420, S.tex(`piece:${id}`)).setScale(0.9).setDepth(D.item + 1)));
    const cont = S.track(S.add.zone(800, 420, 800, 140).setDepth(D.fx + 3));
    const smoke = S.time.addEvent({ delay: 300, loop: true, callback: () => S.steam(600 + Math.random() * 400, 380, 1) });
    for (let side = 0; side < 2; side++) {
      const v = await S.ring(cont, { x: 800, y: 420, r: 220, lo: 0.62, hi: 0.84, rate: 0.22, onLevel: (lv) => pieces.forEach((p) => p.setTint(Phaser.Display.Color.GetColor(255, 255 - lv * 70, 255 - lv * 110))) });
      Cook.sfx.flip();
      await Cook.tween(S, { targets: [sk, ...pieces], scaleY: 0.1, duration: 110, yoyo: true });
      pieces.forEach((p) => p.clearTint());
      const score = v >= 1 ? 40 : S.bandScore(v, 0.62, 0.84);
      ctx.skill(score, "grill");
      S.verdict(800, 220, score, { perfect: "Turned!", bad: v >= 1 ? "Charred!" : "Too early" });
    }
    smoke.remove();
    await Cook.wait(400);
    end();
  };

  S$.BURNER = BURNER;
  S$.STRIP_Y = STRIP_Y;
  S$.begin = begin;
  S$.end = end;
  S$.row = row;
})(window);
