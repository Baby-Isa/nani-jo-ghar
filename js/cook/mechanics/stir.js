/*
 * Mechanic: stir (count and speed). A pot seen from straight above; the
 * ladle rides a fixed circular track just inside the rim, and you drag it
 * round (grab anywhere near the track: it snaps on). Laps are counted
 * aloud as you finish them (the badge shows the running tally, never the
 * target). A speed dial beside the pot always shows the same fixed bands:
 * stopped, tortoise, hare, spilling. Nothing on screen says which of
 * tortoise or hare to aim for: only Nani's word does ("slowly" / "quickly").
 * The ladle leaves a swirl whose tightness shows the speed, and the daal
 * sloshes more the faster you go (way too fast and it spills).
 *
 * Nani reacts live from her sidebar line: after you've stirred on the
 * wrong side of the dial for a while she says the word again ("slowly!"),
 * which costs the speed part of the ear star (it gives you the answer);
 * "enough!" when you go past the count (at the count itself only while
 * she's guiding, the teaching run). At level 3 she changes the speed
 * mid-stir ("now quickly!", sometimes the same speed again, so the switch
 * can't be guessed).
 *
 * Kutchi: the number, "slowly" / "quickly", "now …", "enough".
 * Params: laps, speed (null | "slow" | "quick").
 * Knobs (data.mechanics.stir): speeds (say a speed at all: false at level 1;
 * a missing speed is picked at random), switch ({sameChance}: change it
 * mid-stir), bands ([stopped|tortoise, tortoise|hare, hare|spill] in real
 * laps per second, the same for every order), dialMax, speedWords, lap
 * (fraction of a circle that counts), deadZone and reach (how near the
 * centre / how far out a drag still stirs, design px), track (track radius
 * over the daal's), smoothS (the dial's lag), okFrac (share of the judged
 * time on the asked side), correctMs (wrong side this long: Nani says it),
 * graceMs (time to react to a new speed), reactGapMs, spillMs, spillGapMs,
 * spillCost, quietMs (let go this long and you're done), ghostMs, special.
 * Speeds are real laps per second (the gesture isn't scaled by game speed).
 * Extra lines and tips: data/stations/stir.json.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const TAU = Math.PI * 2;

  // the stir station's own lines and tips (data, not code)
  Cook.onLoad.push(async (data) => {
    const extra = await fetch("data/stations/stir.json")
      .then((r) => r.json())
      .catch(() => null);
    if (!extra) return;
    Object.keys(extra.lines || {}).forEach((key) => (data.lines[key] = data.lines[key] || extra.lines[key]));
    const tips = (data.tips = data.tips || {});
    Object.keys(extra.tips || {}).forEach((star) => (tips[star] = Object.assign({}, extra.tips[star], tips[star] || {})));
  });

  /** The top-down pot as a texture (so it can be tinted "special"). */
  function potTexture(S, R) {
    const key = `stir-pot-${Math.round(R)}`;
    if (S.textures.exists(key)) return key;
    const pad = Math.round(R * 0.32);
    const size = Math.round(2 * (R + pad));
    const c = size / 2;
    const g = S.make.graphics({ x: 0, y: 0, add: false });
    // soft shadow, the two side handles, the body, the rim
    g.fillStyle(0x000000, 0.18);
    g.fillCircle(c + R * 0.04, c + R * 0.07, R * 1.02);
    [-1, 1].forEach((s) => {
      g.fillStyle(0x6f7378, 1);
      g.fillRoundedRect(c + s * R * 0.92 - (s < 0 ? R * 0.3 : 0), c - R * 0.12, R * 0.3, R * 0.24, R * 0.08);
      g.fillStyle(0x9a9ea3, 1);
      g.fillRoundedRect(c + s * R * 0.95 - (s < 0 ? R * 0.22 : 0), c - R * 0.07, R * 0.22, R * 0.14, R * 0.06);
    });
    g.fillStyle(0xb9bcc0, 1);
    g.fillCircle(c, c, R);
    g.fillStyle(0xe6e8ea, 1);
    g.fillCircle(c, c, R * 0.97);
    g.fillStyle(0x8f9398, 1);
    g.fillCircle(c, c, R * 0.9);
    g.lineStyle(R * 0.02, 0xffffff, 0.6);
    g.beginPath();
    g.arc(c, c, R * 0.935, Math.PI * 1.05, Math.PI * 1.55);
    g.strokePath();
    g.generateTexture(key, size, size);
    g.destroy();
    return key;
  }

  /** Placeholder drawings for the dial's ends: a tortoise, a hare, a splash. */
  function tortoise(g, x, y, s) {
    g.fillStyle(0x6b8f5a, 1);
    [-1, 1].forEach((dx) => [-1, 1].forEach((dy) => g.fillCircle(x + dx * 17 * s, y + dy * 11 * s, 7 * s)));
    g.fillCircle(x + 30 * s, y - 2 * s, 9 * s);
    g.fillStyle(0x3a2410, 1);
    g.fillCircle(x + 33 * s, y - 5 * s, 2 * s);
    g.fillStyle(0x8a6a3a, 1);
    g.fillEllipse(x, y, 50 * s, 34 * s);
    g.lineStyle(3 * s, 0x5b4424, 1);
    g.strokeEllipse(x, y, 50 * s, 34 * s);
    g.lineBetween(x - 10 * s, y - 15 * s, x - 10 * s, y + 15 * s);
    g.lineBetween(x + 10 * s, y - 15 * s, x + 10 * s, y + 15 * s);
  }
  function hare(g, x, y, s) {
    g.fillStyle(0xc9b49a, 1);
    g.fillEllipse(x - 4 * s, y + 4 * s, 46 * s, 28 * s);
    g.fillCircle(x + 20 * s, y - 8 * s, 12 * s);
    g.fillEllipse(x + 14 * s, y - 30 * s, 9 * s, 30 * s);
    g.fillEllipse(x + 24 * s, y - 30 * s, 9 * s, 30 * s);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(x - 27 * s, y + 2 * s, 7 * s);
    g.fillStyle(0x3a2410, 1);
    g.fillCircle(x + 24 * s, y - 10 * s, 2.2 * s);
    // speed lines
    g.lineStyle(3 * s, 0x8f7a60, 0.8);
    [-4, 6, 16].forEach((dy) => g.lineBetween(x - 56 * s, y + dy * s, x - 38 * s, y + dy * s));
  }
  function splash(g, x, y, s) {
    g.fillStyle(0xe0a42c, 1);
    g.fillEllipse(x, y + 10 * s, 44 * s, 14 * s);
    [
      [-18, -10, 6],
      [0, -22, 8],
      [18, -12, 6],
      [-8, -34, 4],
      [12, -34, 4],
    ].forEach(([dx, dy, r]) => g.fillCircle(x + dx * s, y + dy * s, r * s));
  }

  Mech.define("stir", {
    station: "stir",
    view: "hob",
    async run(z, { laps, speed }, k) {
      const S = z.S;
      const ctx = z.ctx;
      const hide = St.hideKnown(ctx);
      const [e1, e2, e3] = k.bands;
      // level 1 says only the count; later levels always ask for a speed
      let asked = k.speeds ? speed || Cook.pick(["slow", "quick"]) : null;
      const speedLine = (s) => Lang.line(k.speedWords[s]);

      /* ---------- the pot, the daal, the track, the ladle ---------- */
      const cx = z.X(k.potX);
      const cy = z.Y(k.potY);
      const R = z.L(k.potR);
      const pot = S.track(S.add.image(cx, cy, potTexture(S, R)).setDepth(D.item));
      if (k.special) S.special(pot);
      const RL = R * 0.86; // the daal's surface
      const RT = RL * k.track; // the ladle's track, just inside the rim
      const liq = S.track(S.add.graphics().setDepth(D.item + 0.3));
      const fx = S.track(S.add.graphics().setDepth(D.item + 0.5));
      const ring = S.track(S.add.circle(cx + RT, cy, z.L(48), 0xffffff, 0).setStrokeStyle(z.L(6), 0xfff3c4, 0.9).setDepth(D.hand - 1));
      S.tweens.add({ targets: ring, scale: 1.25, alpha: 0.35, duration: 520, yoyo: true, repeat: -1 });
      const ladle = S.hand("ladle", { x: cx + RT, y: cy, k: z.k });
      const shoulder = { x: cx + z.L(60), y: z.Y(1250) };

      /* ---------- the speed dial: fixed bands, no target ---------- */
      const dx0 = z.X(k.dialX);
      const dy0 = z.Y(k.dialY);
      const DR = z.L(k.dialR);
      const DW = z.L(46);
      const toA = (v) => Math.PI + Cook.clamp(v / k.dialMax, 0, 1) * Math.PI;
      const dial = S.track(S.add.graphics().setDepth(D.item));
      const needle = S.track(S.add.graphics().setDepth(D.item + 1));
      const BANDS = [
        [0, e1, 0xd8cfc0],
        [e1, e2, 0xf6ead2],
        [e2, e3, 0xf6ead2],
        [e3, k.dialMax, 0xc0503f],
      ];
      (() => {
        const g = dial;
        g.fillStyle(0x3a2410, 0.12);
        g.fillRoundedRect(dx0 - DR - DW, dy0 - DR - DW - z.L(30), 2 * (DR + DW), DR + DW + z.L(80), z.L(28));
        BANDS.forEach(([a, b, col]) => {
          g.lineStyle(DW, col, 1);
          g.beginPath();
          g.arc(dx0, dy0, DR, toA(a), toA(b));
          g.strokePath();
        });
        // dividers between the bands, and the rim
        [e1, e2, e3].forEach((v) => {
          const a = toA(v);
          g.lineStyle(z.L(5), 0x5b4424, 1);
          g.lineBetween(dx0 + Math.cos(a) * (DR - DW / 2), dy0 + Math.sin(a) * (DR - DW / 2), dx0 + Math.cos(a) * (DR + DW / 2), dy0 + Math.sin(a) * (DR + DW / 2));
        });
        g.lineStyle(z.L(4), 0x5b4424, 0.9);
        g.beginPath();
        g.arc(dx0, dy0, DR + DW / 2, Math.PI, TAU);
        g.strokePath();
        g.beginPath();
        g.arc(dx0, dy0, DR - DW / 2, Math.PI, TAU);
        g.strokePath();
        const at = (v, r) => ({ x: dx0 + Math.cos(toA(v)) * r, y: dy0 + Math.sin(toA(v)) * r });
        const s = z.k;
        let p = at((e1 + e2) / 2, DR - DW * 1.9);
        tortoise(g, p.x, p.y, s);
        p = at((e2 + e3) / 2, DR - DW * 1.9);
        hare(g, p.x, p.y + z.L(8), s);
        p = at((e3 + k.dialMax) / 2, DR + DW * 1.35);
        splash(g, p.x, p.y, s * 0.8);
      })();

      /* ---------- the order ---------- */
      const parts = [Lang.numLine(laps)];
      if (asked) parts.push(speedLine(asked));
      let current = Lang.join(parts); // what the sidebar shows between reactions
      Cook.markSeen(Cook.numId(laps));
      UI.count(0, { speak: false });

      /* ---------- the stirring state ---------- */
      let ang = 0; // the ladle's angle on the track
      let prev = null;
      let grabbing = false;
      let dir = 0; // +1 / -1 once you start
      let prog = 0; // radians round, in dir
      let back = 0; // radians the wrong way (to turn round)
      let moved = 0; // radians since the last frame
      let spd = 0; // laps per second (real), smoothed
      let phase = 0; // the swirl's turn
      let count = 0;
      let spills = 0;
      let overT = 0;
      let lastSpill = -1e9;
      let wrongT = 0;
      let graceUntil = 0;
      let lastReact = -1e9;
      let sayTok = 0;
      let finished = false;
      let started = false;
      const phases = asked ? [{ speed: asked, judged: 0, inAsked: 0, corrected: false }] : [];
      const lapA = TAU * k.lap;
      const enoughAt = z.guided ? laps : laps + 1;
      const switchLap = k.switch && asked && laps >= 2 ? 1 + Math.floor(Math.random() * (laps - 1)) : 0;
      const drops = [];

      /** Nani's live line in the sidebar; afterwards her instruction comes back. */
      const react = (line, force) => {
        const now = performance.now();
        if (finished || (!force && now - lastReact < k.reactGapMs)) return false;
        lastReact = now;
        const tok = ++sayTok;
        z.say(line, { hide })
          .then(() => {
            if (tok === sayTok && !finished) return z.say(current, { hide, silent: true, ms: 10 });
          })
          .catch(() => {});
        return true;
      };
      const later = (fn) => setTimeout(() => !finished && fn(), k.afterCountMs);

      const setExpect = () =>
        z.expect({ kind: "stir", x: cx, y: cy, rx: RT, ry: RT, target: laps, speed: asked, count: () => count });

      const place = () => {
        const x = cx + Math.cos(ang) * RT;
        const y = cy + Math.sin(ang) * RT;
        ladle.setPosition(x, y);
        ladle.setAngle((Math.atan2(-(shoulder.x - x), shoulder.y - y) * 180) / Math.PI);
        ring.setPosition(x, y);
      };
      place();

      await z.say(current, { hide });

      const result = await new Promise((resolve) => {
        let quiet = null;
        const ghost = S.ghost({ circle: { x: cx, y: cy, rx: RT, ry: RT } }, { duration: k.ghostMs, delay: z.guided ? 200 : 5000 });
        const finish = () => {
          if (finished) return;
          finished = true;
          clearTimeout(quiet);
          ghost.stop();
          z.expect(null);
          UI.hideDone();
          UI.hideCount();
          resolve({ count });
        };
        const lapDone = () => {
          count++;
          UI.count(count);
          Cook.sfx.bubble();
          S.burst(cx + Math.cos(ang) * RT, cy + Math.sin(ang) * RT, [0xe0a42c, 0xf6d27a], 8, z.L(50));
          z.progress({ laps: count });
          if (count === enoughAt) later(() => react(Lang.line("enough"), true));
          if (count === switchLap) {
            const same = Math.random() < k.switch.sameChance;
            asked = same ? asked : asked === "slow" ? "quick" : "slow";
            phases.push({ speed: asked, judged: 0, inAsked: 0, corrected: false });
            wrongT = 0;
            graceUntil = performance.now() + k.afterCountMs + k.graceMs;
            current = Lang.line("stir-now", speedLine(asked));
            later(() => react(current, true));
            setExpect();
          }
        };
        const grab = (p) => {
          const d = Math.hypot(p.worldX - cx, p.worldY - cy);
          if (d < z.L(k.deadZone) || d > z.L(k.reach)) return;
          grabbing = true;
          started = true;
          prev = Math.atan2(p.worldY - cy, p.worldX - cx);
          clearTimeout(quiet);
          UI.hideDone();
          ring.setVisible(false);
        };
        const move = (p) => {
          if (!grabbing && p.isDown) grab(p);
          if (!grabbing) return;
          if (!p.isDown) return release();
          const d = Math.hypot(p.worldX - cx, p.worldY - cy);
          if (d < z.L(k.deadZone)) return; // through the middle: wait till it's out again
          const a = Math.atan2(p.worldY - cy, p.worldX - cx);
          let da = a - prev;
          if (da > Math.PI) da -= TAU;
          if (da < -Math.PI) da += TAU;
          prev = a;
          if (Math.abs(da) > k.maxStep) return; // a jump, not a stir
          ang = a;
          place();
          moved += Math.abs(da);
          if (!dir) dir = da >= 0 ? 1 : -1;
          const fwd = da * dir;
          if (fwd >= 0) {
            prog += fwd;
            back = Math.max(0, back - fwd);
          } else {
            back -= fwd;
            if (back > Math.PI) {
              // they've turned round: stir the other way from here
              dir = -dir;
              back = 0;
              prog = count * lapA;
            }
          }
          while (prog >= (count + 1) * lapA) lapDone();
        };
        const release = () => {
          if (!grabbing) return;
          grabbing = false;
          prev = null;
          clearTimeout(quiet);
          if (count >= 1) {
            quiet = setTimeout(finish, k.quietMs / Cook.speed);
            UI.done().then(finish);
          }
        };
        z.on("pointerdown", grab);
        z.on("pointermove", move);
        z.on("pointerup", release);
        z.on("pointerupoutside", release);

        let lastT = performance.now();
        z.tick(() => {
          const now = performance.now();
          const dt = Math.min(0.25, Math.max(0.001, (now - lastT) / 1000));
          lastT = now;
          // the speed: real laps per second, smoothed so the needle glides
          const raw = moved / TAU / dt;
          moved = 0;
          spd += (raw - spd) * (1 - Math.exp(-dt / k.smoothS));
          if (!grabbing) spd *= Math.exp(-dt / k.smoothS);
          phase += dir * spd * TAU * dt * 0.7;
          // the speed side (the ear): judged while you're actually stirring
          const ph = phases[phases.length - 1];
          if (ph && grabbing && spd > e1 * 0.5 && now > graceUntil) {
            ph.judged += dt;
            const side = spd < e2 ? "slow" : "quick";
            if (side === ph.speed) {
              ph.inAsked += dt;
              wrongT = 0;
            } else if ((wrongT += dt) * 1000 >= k.correctMs) {
              wrongT = 0;
              if (react(speedLine(ph.speed))) ph.corrected = true;
            }
          }
          // way too fast: it slops over the rim (the hand)
          if (grabbing && spd > e3) {
            overT += dt;
            if (overT * 1000 >= k.spillMs && now - lastSpill > k.spillGapMs) {
              lastSpill = now;
              spills++;
              spill();
              if (spills === 1) react(Lang.line("oops"), true);
            }
          } else overT = 0;
          draw(now);
        });
        setExpect();
        Cook.stirCount = () => count;
        Cook.stirSpeed = () => spd;
      });

      /** Daal flies out over the rim where the ladle is. */
      function spill() {
        Cook.sfx.puff();
        for (let i = 0; i < 7; i++) {
          const a = ang + dir * (0.2 + Math.random() * 0.6);
          const x0 = cx + Math.cos(a) * RL;
          const y0 = cy + Math.sin(a) * RL;
          const out = z.L(60 + Math.random() * 90);
          const dot = S.track(S.add.circle(x0, y0, z.L(7 + Math.random() * 9), 0xe0a42c, 1).setDepth(D.fx));
          S.tweens.add({ targets: dot, x: x0 + Math.cos(a + dir * 0.6) * out, y: y0 + Math.sin(a + dir * 0.6) * out, duration: 380, ease: "Cubic.easeOut" });
          drops.push(dot);
        }
      }

      function draw(now) {
        const f = Cook.clamp(spd / e3, 0, 1.4);
        // the daal: bulges toward the ladle as it goes faster
        const slosh = 0.015 + 0.07 * f * f;
        liq.clear();
        liq.fillStyle(0xe0a42c, 1);
        const pts = [];
        for (let i = 0; i < 48; i++) {
          const t = (i / 48) * TAU;
          const r = RL * (1 + slosh * Math.cos(t - ang) + 0.008 * Math.sin(3 * t + now / 260));
          pts.push({ x: cx + Math.cos(t) * r, y: cy + Math.sin(t) * r });
        }
        liq.fillPoints(pts, true);
        liq.fillStyle(0xf0c25a, 0.5);
        liq.fillCircle(cx - RL * 0.25, cy - RL * 0.25, RL * 0.35);
        // the swirl: tighter the faster you go
        fx.clear();
        const tw = 0.3 + spd * 2.4;
        const alpha = Cook.clamp(0.2 + spd * 0.5, 0.2, 0.75);
        for (let arm = 0; arm < 3; arm++) {
          const seg = [];
          for (let i = 0; i <= 16; i++) {
            const r = RT * (0.12 + (0.9 * i) / 16);
            const t = phase + (arm * TAU) / 3 - (dir || 1) * tw * (1 - r / RT);
            seg.push({ x: cx + Math.cos(t) * r, y: cy + Math.sin(t) * r });
          }
          for (let i = 1; i < seg.length; i++) {
            fx.lineStyle(z.L(3 + 7 * (i / seg.length)), 0xfbe3a4, alpha * (i / seg.length));
            fx.lineBetween(seg[i - 1].x, seg[i - 1].y, seg[i].x, seg[i].y);
          }
        }
        // the track, faint, just inside the rim
        for (let t = 0; t < TAU; t += TAU / 36) {
          fx.lineStyle(z.L(5), 0xfff6dc, 0.45);
          fx.beginPath();
          fx.arc(cx, cy, RT, t, t + TAU / 72);
          fx.strokePath();
        }
        // the ladle's wake along the track: longer the faster you go
        if (dir && spd > 0.03) {
          const len = Math.min(TAU * 0.85, 0.35 + spd * 2.2);
          const n = 14;
          for (let i = 0; i < n; i++) {
            const a0 = ang - dir * (len * i) / n;
            const a1 = ang - dir * (len * (i + 1)) / n;
            fx.lineStyle(z.L(18 * (1 - i / n) + 4), 0xfff3d0, 0.7 * (1 - i / n));
            fx.beginPath();
            fx.arc(cx, cy, RT, Math.min(a0, a1), Math.max(a0, a1));
            fx.strokePath();
          }
        }
        // the dial's needle, and the band it's in lit up
        needle.clear();
        const band = BANDS.find(([a, b]) => spd < b) || BANDS[BANDS.length - 1];
        needle.lineStyle(DW + z.L(8), 0xffffff, 0.45);
        needle.beginPath();
        needle.arc(dx0, dy0, DR, toA(band[0]), toA(Math.min(band[1], k.dialMax)));
        needle.strokePath();
        needle.lineStyle(DW, band[2], 1);
        needle.beginPath();
        needle.arc(dx0, dy0, DR, toA(band[0]), toA(Math.min(band[1], k.dialMax)));
        needle.strokePath();
        const a = toA(spd);
        needle.lineStyle(z.L(11), 0xb24a3a, 1);
        needle.lineBetween(dx0, dy0, dx0 + Math.cos(a) * (DR + DW * 0.4), dy0 + Math.sin(a) * (DR + DW * 0.4));
        needle.fillStyle(0x3a2410, 1);
        needle.fillCircle(dx0, dy0, z.L(16));
      }

      /* ---------- the stars ---------- */
      const got = result.count;
      z.listen(got === laps, `stirred ${got} times, they asked for ${laps}`);
      got === laps ? Cook.markRight(Cook.numId(laps)) : Cook.markMiss(Cook.numId(laps));
      phases.forEach((ph, i) => {
        const frac = ph.judged ? ph.inAsked / ph.judged : 0;
        const ok = !ph.corrected && ph.judged > 0 && frac >= k.okFrac;
        z.listen(ok, `stir speed ${ph.speed}${i ? " after the change" : ""}${ph.corrected ? " (Nani had to say it)" : ""}`);
      });
      z.skill(Math.max(k.minScore, 100 - spills * k.spillCost), "stir");
      drops.forEach((d) => d.active && S.tweens.add({ targets: d, alpha: 0, duration: 400 }));
      S.sparkle(cx, cy);
      S.steam(cx, cy - z.L(60), 4);
      await Cook.wait(500);
      return { count: got, spills };
    },
  });

  Mech.lab("stir", {
    name: "Stir",
    verb: "Count and speed",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.daal.make();
      L.card(d, ["Stir"]);
      await L.station("stir", { laps: d.laps, speed: d.speed });
    },
  });
})(window);
