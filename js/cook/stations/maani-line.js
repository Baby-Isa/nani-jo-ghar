/*
 * Combined station: the Maani line, v2 (docs/design/cook-design-system-v1.md §11, §13's burner rule).
 *
 * A two-zone grid, everything centred, aligned on shared lines:
 *  - LEFT (prep): the chakla (rolling board), a faint gold ring etched on it (the size to roll to;
 *    it glows when the maani is right). The velan rolls on its own: no hands anywhere.
 *  - RIGHT (cook): the shared kitchen kit's compact hob with ONE burner and ONE tawa centred on it
 *    (maani keeps one tawa: the game is rolling the next maani while flipping the one on the tawa),
 *    the heat ring centred on the tawa, the person's face and the knob on the hob's front edge.
 *  - THE SHELF BAND (the bottom 26%): under the chakla, the dough plates (wheat, bajri: always both,
 *    each with the same number of balls, more than anyone orders), a `🔊 word` chip under each
 *    (tap the plate = take a ball, tap the chip = hear it; the speaker alone from level 3); under
 *    the hob, the finished-maani plates, one per kind, where each cooked maani lands.
 *
 * The flow: tap a dough plate, the ball flies to the chakla (tap the other plate before you start
 * and it goes back: a slip is free); drag up and down, the velan rolls it out to the ring. Tap the
 * rolled maani and it slides onto the tawa (if the tawa's busy it waits on the board, so roll the
 * next one while this one cooks). On the tawa the ring fills like a clock: tap in the green and
 * the chimta flips it; tap in the green again and the chimta lifts it (a slight puff) onto its
 * plate. Too late and it catches (a darker maani). The tick, when you think you've made what
 * they asked for; the ear star checks the count of each kind (the target is never shown).
 *
 * Params: order ({kind: n}; kinds "cook-maani", "cook-bajrmaani", or "ph-big+cook-maani" with
 * sizes at level 4). Returns how many were made. Knobs and levels: data/stations/maani-line.json;
 * the tawa's band and rate: data.mechanics.tawa (level 1), made about 15% quicker per level by
 * data.timing.levelSpeed. Art: the chai v2 hob (the kit), the batch 1-3 chakla, velan, tawa,
 * dough and maani states, the thali (assets/cook/items/maani-v2/, build/cut_maani_v2.py), and the
 * chimta (build/gen_maani_v2.py, $0.05).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const Kit = Cook.Kit;

  const IT = "assets/cook/items/";
  const MV = IT + "maani-v2/";
  /* ---------- the grid (design px, 1600x900; the canvas is the play area), as chai v2 ---------- */
  const SHELF_TOP = 666; // §3: the scene is the top 74%, the shelf band the bottom 26%
  const FAR = 2000; // backgrounds reach past the design box (the stage fill: Cook.view)
  const HOB_K = 0.85; // the one-burner hob, a little bigger than chai's (it holds a tawa)
  const HOB_BOTTOM = SHELF_TOP - 40; // breathing space above the shelf (§10)
  const CHAKLA_D = 470;
  const COL_GAP = 150; // between the chakla and the hob
  const TAWA_R = 150; // the tawa's round body
  const PLATE_D = 150; // a plate on the shelf band
  // 29 Sept (X7): the plate's top keeps the band's top gap (the gap under the chips) plus a hop (St.shelfFit's rule)
  const PLATE_Y = 666 + (900 - 883) + 8 + PLATE_D / 2;
  const PLATE_PITCH = 204;
  const FAN = [[-17, 9], [17, 3], [-2, -15], [20, -17], [-20, -13]]; // where each maani lands on its plate: fanned, so you can count them
  const CHIP_Y = 860;
  const PIN_W = 540;
  const INK = { page: 0xf4ecdf, panel: 0xefe5d6, grey: 0xd9d2c7 };
  const BURNT = 0x8a6a55;
  const ART = [
    ["mv-chakla", IT + "tool-chakla-t.webp"],
    ["mv-velan", MV + "velan.webp"],
    ["mv-chimta", MV + "chimta.webp"],
    ["mv-thali", MV + "thali.webp"],
    ["mv-ball-maani", IT + "dough-ball-t.webp"],
    ["mv-ball-bajr", IT + "dough-bajr-ball-t.webp"],
    ["mv-raw-maani", IT + "maani-raw-t.webp"],
    ["mv-raw-bajr", IT + "maani-bajr-raw-t.webp"],
    ["mv-half-maani", IT + "maani-cooked-half-t.webp"],
    ["mv-half-bajr", IT + "maani-bajr-cooked-half-t.webp"],
    ["mv-done-maani", IT + "maani-cooked-puffed-t.webp"],
    ["mv-done-bajr", IT + "maani-bajr-cooked-puffed-t.webp"],
  ].concat(Kit.art(1, ["tawa"]));

  Mech.combined("maani-line", {
    station: "maani-line",
    view: "marble",
    dataFile: "data/stations/maani-line.json",
    // one drawing space (1:1); the roll zone owns the left column's pointer (a tap on the tawa is not a roll)
    zones: [
      { id: "bowls", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } },
      { id: "roll", mech: "roll", region: [0, 0, 830, 666], footprint: { x: 0, y: 0, w: 830, h: 666 } },
      { id: "tawa", mech: "tawa", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } },
    ],
    run: (host, params) => line(host, params),
  });

  /** Ball spots on a plate (fractions of its radius): up to 5, a ring round the middle. */
  function ballSpots(n) {
    const out = n >= 5 ? [[0, 0]] : [];
    const m = n - out.length;
    for (let i = 0; i < m; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / m + 0.4;
      out.push([Math.cos(a) * 0.42, Math.sin(a) * 0.42]);
    }
    return out;
  }

  async function line(host, params) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const zb = host.zones.bowls;
    const zr = host.zones.roll;
    const zt = host.zones.tawa;
    const zon = zr.child({ id: "rest" }); // "put it on the tawa" (the test plays from its expectation)
    const level = zb.level || 1;
    const kRoll = Mech.knobs("roll", { level: zr.level });
    // the tawa: one, always (the burner rule); its speed from level 1's knobs, quicker per level
    const kTawa = Mech.knobs("tawa", { level: 1 });
    const kLevel = Mech.knobs("tawa", { level: zt.level });
    const speedUp = Math.pow(1 / (1 - (((Cook.data.timing || {}).levelSpeed) || 0.15)), level - 1);
    const [lo, hi] = kLevel.band || kTawa.band;
    const rate1 = kTawa.rate * speedUp;
    const rate2 = kTawa.rate2 * speedUp;
    const types = Object.keys(K.doughs || { "cook-maani": {} });
    const who = (ctx.order && ctx.order.who) || null;
    await Promise.race([St.load(S, ART.concat(who ? [[`${who}-badge`, `assets/cook/characters/${who}-badge.webp`]] : [])), Cook.wait(5000)]);
    const texOf = (t, state) => {
      const key = `mv-${state}-${t === "cook-bajrmaani" ? "bajr" : "maani"}`;
      return S.textures.exists(key) ? key : { ball: "dough-ball", raw: "chapati-raw", half: "chapati-half", done: "chapati-puffed" }[state];
    };
    const sizes = K.sizes ? Object.keys(K.sizes).map((id) => ({ id, r: K.sizes[id] })) : null;
    const rMax = sizes ? Math.max(...sizes.map((s) => s.r)) : kRoll.radius;
    const keyOf = (type, size) => (size ? `${size}+${type}` : type);
    const split = (key) => {
      const parts = key.split("+");
      const type = parts.find((p) => types.includes(p)) || parts[parts.length - 1];
      return { type, size: parts.find((p) => p !== type) || null };
    };
    // what they asked for, {key: n}
    const want = {};
    Object.keys(params.order || {}).forEach((k) => {
      const { type, size } = split(k);
      if (params.order[k] > 0) want[keyOf(type, size)] = params.order[k];
    });

    /* ---------- the scene: the softened marble, the shelf band ---------- */
    // (drawn past the design box: the stage fill shows more worktop above and at the sides, Cook.view)
    S.track(S.add.rectangle(-FAR, -FAR, 1600 + 2 * FAR, SHELF_TOP + FAR, INK.page, 0.5).setOrigin(0).setDepth(D.bg + 1));
    const band = S.track(S.add.graphics().setDepth(D.bg + 1.2));
    band.fillStyle(INK.panel, 1);
    band.fillRect(-FAR, SHELF_TOP, 1600 + 2 * FAR, 900 - SHELF_TOP + FAR);
    band.fillStyle(0x2a1a0a, 0.08);
    band.fillRect(-FAR, SHELF_TOP, 1600 + 2 * FAR, 3);

    // two columns, centred as one block: the chakla | the hob
    const hs = Kit.size(1, HOB_K);
    const left = (1600 - (CHAKLA_D + COL_GAP + hs.w)) / 2;
    const LX = left + CHAKLA_D / 2;
    const RX = left + CHAKLA_D + COL_GAP + hs.w / 2;
    // raised into the middle of a taller stage's worktop (the stage fill)
    const hob = Kit.hob(S, { n: 1, k: HOB_K, cx: RX, bottom: HOB_BOTTOM - Cook.lift() });
    const midY = hob.y + hob.h / 2; // the chakla sits on the hob's middle line
    const CH = { x: LX, y: midY };

    /* ---------- the chakla and its gold ring ---------- */
    const board = S.track(S.add.image(CH.x, CH.y, "mv-chakla").setDepth(D.item - 2));
    board.setScale(CHAKLA_D / board.width);
    board.shadow = S.contactShadow(board);
    // the velan waits along the board's front edge; it lifts off to roll (rollOne draws the rolling one)
    const restPin = S.track(S.add.image(CH.x, CH.y + CHAKLA_D / 2 - 4, "mv-velan").setDepth(D.item - 1));
    restPin.setScale((PIN_W * 0.92) / restPin.width);
    restPin.shadow = S.contactShadow(restPin);
    const pinRest = (on) => S.tweens.add({ targets: restPin, alpha: on ? 1 : 0, duration: 200 });

    /* ---------- the hob: one burner, one tawa, the face and the knob on the front edge ---------- */
    const burner = Kit.burner(S, hob, 0, { who, flameR: TAWA_R * 0.74, spread: 62, state: "high" });
    const tawa = Kit.place(S, "tawa", hob.burners[0], TAWA_R, { depth: D.item - 0.5 });
    const TW = { x: hob.burners[0].x, y: hob.burners[0].y };
    const ring = Kit.heatRing(S, { width: 11 });
    const RING_R = TAWA_R + 18;
    let heat = "high";
    S.tappable(burner.knobHit, () => {
      // the knob: high (the ring runs at its pace) or low (slower: more time to roll)
      heat = heat === "high" ? "low" : "high";
      burner.set(heat);
    });
    if (burner.face)
      S.tappable(burner.face, () => {
        // their face: hear what they asked for again
        if (UI.mission && UI.mission.replay) UI.mission.replay();
        S.tweens.add({ targets: burner.face, scale: burner.face.baseScale * 1.1, duration: 100, yoyo: true });
      });
    // the chimta lies on the hob's right rim, ring at the front corner, tips up along the edge (clear of
    // the heat ring): placed, not floating on the counter. Its art runs ring -> tips at 45 deg, so -45 stands it up
    const chimtaHome = { x: hob.x + hob.w - 30, y: hob.y + hob.h - 40, angle: -45 };
    const chimta = S.track(S.add.image(chimtaHome.x, chimtaHome.y, "mv-chimta").setOrigin(0.1, 0.9).setDepth(D.item + 3).setAngle(chimtaHome.angle));
    chimta.setScale(190 / chimta.width);
    if (chimta.preFX && S.renderer && S.renderer.type === Phaser.WEBGL) {
      chimta.preFX.padding = 12;
      chimta.preFX.addShadow(-2, 3, 0.06, 1, 0x000000, 4, 0.35);
    }

    /* ---------- the shelf band: the dough plates (chips) | the finished plates ---------- */
    const order = Cook.shuffle(types.slice());
    const rowXs = (cx, n) => order.slice(0, n).map((_, i) => cx + (i - (n - 1) / 2) * PLATE_PITCH);
    const plate = (x, y, quiet) => {
      const p = S.track(S.add.image(x, y, "mv-thali").setDepth(D.item - 1));
      p.setScale(PLATE_D / p.width);
      p.shadow = S.contactShadow(p);
      if (quiet) p.setAlpha(0.9);
      return p;
    };
    const showWord = level < 3;
    const plates = order.map((type, i) => {
      const x = rowXs(LX, order.length)[i];
      const img = plate(x, PLATE_Y);
      img.type = type;
      img.balls = ballSpots(K.ballsPerBowl || 5).map(([fx, fy], j) => {
        const b = S.track(S.add.image(x + fx * PLATE_D * 0.5, PLATE_Y + fy * PLATE_D * 0.5, texOf(type, "ball")).setDepth(D.item + 0.2 + j * 0.001));
        b.setScale((PLATE_D * 0.36) / b.width);
        b.home = { x: b.x, y: b.y, scale: b.scale };
        return b;
      });
      img.chip = Kit.chip(S, type, x, CHIP_Y, { word: showWord, w: 188 });
      return img;
    });
    const plateOf = (type) => plates.find((b) => b.type === type);
    const dones = {};
    order.forEach((type, i) => {
      const x = rowXs(RX, order.length)[i];
      dones[type] = { x, y: PLATE_Y, img: plate(x, PLATE_Y, true), n: 0 };
    });

    /* ---------- state ---------- */
    const items = []; // every rolled maani: {sprite, type, size, key, where: board | tawa | plate}
    let chakla = null; // the dough on the board: {type, plate, ball, sprite, busy, started, handle}
    let waiting = null; // a rolled maani waiting on the board for the tawa
    let onTawa = null; // the maani on the tawa: {it, side, v, burnt}
    let finished = false;
    let firstOn = true;
    let doneShown = false;
    const count = (key, where) => items.filter((it) => it.key === key && (!where || it.where === where)).length;
    const plated = () => items.filter((it) => it.where === "plate");
    /** How many more of this dough the order needs (the plan for the test and for guided glows; never shown). */
    const leftOf = (type) =>
      Object.keys(want)
        .filter((k) => split(k).type === type)
        .reduce((a, k) => a + Math.max(0, want[k] - count(k)), 0) - (chakla && chakla.type === type ? 1 : 0);
    const nextType = () => (plates.find((b) => leftOf(b.type) > 0 && b.balls.some((x) => x.visible)) || {}).type || null;
    const aimFor = (type) => {
      if (!sizes) return 0;
      let best = 0;
      let bestLeft = -Infinity;
      sizes.forEach((s, i) => {
        const l = (want[keyOf(type, s.id)] || 0) - count(keyOf(type, s.id));
        if (l > bestLeft) {
          best = i;
          bestLeft = l;
        }
      });
      return best;
    };
    const allDone = () => Object.keys(want).every((k) => count(k, "plate") === want[k]) && plated().length === Object.values(want).reduce((a, b) => a + b, 0);
    const idle = () => !chakla && !waiting && !onTawa;
    const glowOn = (obj, on) => {
      if (!obj || !obj.active || !!obj._glowing === on) return;
      obj._glowing = on;
      S.glow(obj, on);
    };
    const centre = (obj) => {
      const c = S.centre(obj);
      return { x: c.x, y: c.y };
    };
    const step = (label) => {
      const i = (ctx.steps || []).findIndex((s) => String(s).toLowerCase() === label.toLowerCase());
      if (i >= 0 && UI.mission && UI.mission.step) {
        ctx.stepAt = i;
        UI.mission.step(i);
      }
    };
    /** The word pops by the action (§4), and the family clip plays. */
    const wordPop = (id, x, y) => {
      const pop = S.track(S.add.container(x, y).setDepth(D.fx + 4).setAlpha(0));
      const t = S.add.text(0, 0, Cook.display(id), { fontFamily: "Nunito, sans-serif", fontSize: "34px", fontStyle: "800", color: "#8C2F2F" }).setOrigin(0, 0.5);
      const w = t.width + 64;
      const bg = S.add.graphics();
      bg.fillStyle(0x28190a, 0.1);
      bg.fillRoundedRect(-w / 2, -28, w, 60, 12);
      bg.fillStyle(0xffffff, 1);
      bg.fillRoundedRect(-w / 2, -30, w, 60, 12);
      const icon = S.add.graphics();
      Kit.speaker(icon, -w / 2 + 26, 0, 26);
      t.x = -w / 2 + 48;
      pop.add([bg, icon, t]);
      S.tweens.add({ targets: pop, alpha: 1, y: y - 16, duration: 220 });
      S.tweens.add({ targets: pop, alpha: 0, delay: 1300, duration: 300, onComplete: () => pop.destroy() });
      Lang.speakWord(id);
    };

    /* ---------- what's next (the test plays from it; the focal rule; guided glows the answer) ---------- */
    function update() {
      if (finished) return;
      const need = !chakla && !waiting ? nextType() : null;
      plates.forEach((b) => glowOn(b, !!(ctx.guided && need === b.type)));
      // a rolled maani and a free tawa: that's the next thing (it pulses, whatever the level)
      if (waiting) glowOn(waiting.sprite, !onTawa && waiting.landed);
      if (need) {
        const b = plateOf(need);
        zb.expect(Object.assign({ kind: "tap", key: "dough", wrongs: plates.filter((o) => o !== b).map(centre) }, centre(b)));
      } else if (idle() && plated().length) zb.expect(Object.assign({ kind: "more", target: 1, count: 1, extra: true }, centre(plates[0])));
      else zb.expect(null);
      zon.expect(waiting && waiting.landed && !onTawa ? Object.assign({ kind: "tap", key: "tawa-on" }, centre(waiting.sprite)) : null);
      // quiet until they matter (§3): the finished plates, until a maani lands
      Object.values(dones).forEach((d) => d.img.setAlpha(d.n ? 1 : 0.9));
      // the tick: whenever nothing is on the go (it never says whether you're right)
      if (idle() && plated().length) {
        if (!doneShown) {
          doneShown = true;
          UI.done({ glow: !!(ctx.guided && allDone()) }).then(() => {
            doneShown = false;
            finish();
          });
        } else UI.glowDone(!!(ctx.guided && allDone()));
      } else if (doneShown) {
        doneShown = false;
        UI.hideDone();
      }
    }

    /* ---------- a dough plate -> the chakla -> rolled ---------- */
    async function pick(pl) {
      if (finished) return;
      if (waiting) return S.wiggle(waiting.sprite); // the board's taken: put that one on the tawa first
      if (chakla && (chakla.busy || chakla.started)) return S.wiggle(pl); // one at a time: finish this one first
      if (chakla && chakla.type === pl.type) return;
      const ball = pl.balls.filter((b) => b.visible).pop();
      if (!ball) return S.wiggle(pl);
      if (chakla) putBack(chakla);
      ball.setVisible(false);
      const sprite = S.track(S.add.image(ball.x, ball.y, texOf(pl.type, "ball")).setScale(ball.scale).setDepth(D.item + 3));
      const c = { type: pl.type, plate: pl, ball, sprite, busy: true, started: false, handle: {} };
      chakla = c;
      Cook.sfx.pop();
      wordPop(pl.type, CH.x, CH.y - CHAKLA_D / 2 - 10);
      update();
      await S.fly(sprite, CH.x, CH.y, { scale: (2 * kRoll.startRadius) / sprite.width, duration: 380 });
      c.busy = false;
      if (chakla !== c || finished) return;
      update();
      pinRest(false);
      const targets = sizes ? sizes.map((s) => ({ id: s.id, r: s.r })) : null;
      const r = await Mech.rollOne(zr, kRoll, CH, {
        dough: sprite,
        board: false,
        tex: { ball: texOf(c.type, "ball"), raw: texOf(c.type, "raw") },
        targets,
        aim: aimFor(c.type),
        quietMs: K.quietMs,
        keep: true,
        patient: true,
        handle: c.handle,
        pinTex: "mv-velan",
        pinW: PIN_W,
        gold: true,
        onStart: () => {
          c.started = true;
          update();
        },
      });
      pinRest(true);
      if (!r) return; // it went back to its plate
      zr.skill(r.score, "roll");
      chakla = null;
      const it = { sprite: r.sprite, type: c.type, size: r.target || null, key: keyOf(c.type, r.target), score: r.score, where: "board", landed: true };
      it.sizeF = sizes ? Math.sqrt((sizes.find((s) => s.id === it.size) || { r: rMax }).r / rMax) : 1;
      items.push(it);
      waiting = it;
      S.tappable(it.sprite, () => putOn());
      update();
    }
    /** Changed your mind before rolling: the dough goes back to its plate. */
    function putBack(c) {
      c.handle.cancel && c.handle.cancel();
      chakla = null;
      S.fly(c.sprite, c.ball.x, c.ball.y, { scale: c.ball.scale, duration: 300 }).then(() => {
        c.sprite.destroy();
        c.ball.setVisible(true);
      });
    }

    /* ---------- the board -> the tawa ---------- */
    async function putOn() {
      if (finished || !waiting) return;
      if (onTawa) return S.wiggle(waiting.sprite); // the tawa's busy: flip or lift that one first
      const it = waiting;
      waiting = null;
      glowOn(it.sprite, false);
      S.untap(it.sprite);
      it.where = "tawa";
      const t = { it, side: 1, v: 0, busy: true };
      onTawa = t;
      if (firstOn) {
        firstOn = false;
        step("Tawa");
      }
      update();
      const sz = (TAWA_R * 1.62 * it.sizeF) / it.sprite.width;
      it.sprite.setDepth(D.item + 1);
      await S.fly(it.sprite, TW.x, TW.y, { scale: sz, duration: 380, arc: 90 });
      it.sprite.baseScale = sz;
      Cook.sfx.sizzle(0.4);
      t.busy = false;
      if (!sizzle) {
        sizzle = Cook.sfx.sizzleLoop();
        S.loops.push(sizzle);
      }
      S.tappable(it.sprite, () => tawaTap());
      zt.passMeAfter(kTawa.passMeAfterMs);
    }
    let sizzle = null;
    S.tappable(tawa, () => tawaTap());
    // the browning as the ring fills: the maani's own colour times a warm tint
    const C = Phaser.Display.Color;
    const brown = (v) => C.GetColor(255, Math.round(255 - v * 45), Math.round(255 - v * 90));

    /** Move the chimta to the maani (tips over it) and back: the flip and the lift. */
    const chimtaTo = (x, y) => Cook.tween(S, { targets: chimta, x: x + 150, y: y + 150, angle: -60, duration: 170, ease: "Sine.easeOut" });
    const chimtaHomeTween = () => S.tweens.add({ targets: chimta, x: chimtaHome.x, y: chimtaHome.y, angle: chimtaHome.angle, duration: 240, ease: "Sine.easeInOut" });

    async function tawaTap() {
      const t = onTawa;
      if (finished || !t || t.busy) return;
      t.busy = true;
      ring.clear();
      zt.expect(null);
      const it = t.it;
      const sp = it.sprite;
      const v = t.v;
      const burnt = v >= 1;
      if (t.side === 1) {
        // the chimta flips it
        await chimtaTo(TW.x, TW.y);
        Cook.sfx.flip();
        await Cook.tween(S, { targets: sp, scaleY: 0.02, duration: 110 });
        sp.setTexture(texOf(it.type, "half")).setTint(burnt ? BURNT : 0xffffff);
        sp.setScale(sp.baseScale, 0.02);
        await Cook.tween(S, { targets: sp, scaleY: sp.baseScale, duration: 110 });
        chimtaHomeTween();
        t.s1 = burnt ? kTawa.burntScore : S.bandScore(v, lo, hi);
        t.burnt = burnt;
        S.verdict(TW.x, TW.y - RING_R - 34, t.s1, { bad: burnt ? "burnt" : "too-early" });
        t.side = 2;
        t.v = 0;
        t.busy = false;
        return;
      }
      // side two: the chimta lifts it; a good one puffs a little (a slight puff, not a ball)
      const good = v >= lo && v < 1;
      Cook.sfx.puff();
      sp.setTexture(texOf(it.type, "done")).setTint(t.burnt || burnt ? BURNT : 0xffffff);
      const dz = (TAWA_R * 1.62 * it.sizeF) / sp.width;
      sp.setScale(dz);
      await Cook.tween(S, { targets: sp, scale: dz * (good ? 1.07 : 1.02), duration: good ? 220 : 150, ease: "Sine.easeOut", yoyo: true });
      S.steam(TW.x, TW.y - 60, good ? 5 : 2);
      const s2 = burnt ? kTawa.burntScore : S.bandScore(v, lo, hi);
      S.verdict(TW.x, TW.y - RING_R - 34, s2, { perfect: "it-puffed", bad: burnt ? "burnt" : "flat" });
      zt.skill((t.s1 + s2) / 2, "tawa");
      await chimtaTo(TW.x, TW.y);
      // onto its kind's plate: a fanned stack (you can count them), each one a little askew
      const d = dones[it.type] || Object.values(dones)[0];
      const j = d.n++;
      onTawa = null;
      S.untap(sp);
      sp.setDepth(D.item + 2 + j * 0.01);
      S.tweens.add({ targets: sp, angle: Math.random() * 24 - 12, duration: 450 });
      chimtaHomeTween();
      const [fx, fy] = FAN[j % FAN.length];
      const fly = S.fly(sp, d.x + fx, d.y + fy, { scale: (PLATE_D * 0.64 * it.sizeF) / sp.width, duration: 450 });
      update();
      await fly;
      it.where = "plate";
      // no separate tally: the stack on its plate is the count (§14a's rule, here too)
      // its mini card on the order ticks (one card per maani asked for)
      if (ctx.tickCard) ctx.tickCard(it.key || it.type);
      update();
    }

    // the ring: it fills like a clock on the tawa; ignore it and the maani catches
    let last = performance.now();
    let inBand = false;
    zt.tick(() => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
      last = now;
      const t = onTawa;
      if (!t || t.busy || finished) return;
      const rate = (t.side === 1 ? rate1 : rate2) * (heat === "low" ? 0.6 : 1);
      t.v += rate * dt;
      const nowIn = t.v >= lo && t.v <= hi;
      if (nowIn !== inBand) {
        inBand = nowIn;
        glowOn(t.it.sprite, nowIn);
        if (nowIn) Cook.sfx.click();
      }
      if (t.side === 1) t.it.sprite.setTint(brown(Math.min(1, t.v)));
      ring.draw(TW.x, TW.y, RING_R, t.v, lo, hi);
      zt.gauge({ level: t.v, lo, hi });
      zt.expect({ kind: "timing", x: TW.x, y: TW.y, key: `tawa-${t.side}` });
      if (t.v >= 1) {
        glowOn(t.it.sprite, false);
        inBand = false;
        tawaTap();
      }
    });

    plates.forEach((b) => {
      S.tappable(b, () => pick(b));
      b.balls.forEach((ball) => S.tappable(ball, () => pick(b)));
    });
    step("Roll");
    let finish;
    const finishing = new Promise((resolve) => (finish = resolve));
    update();
    await finishing;

    /* ---------- the tick: check the count of each kind ---------- */
    finished = true;
    UI.hideDone();
    ring.clear();
    if (sizzle) sizzle.stop();
    [zb, zon, zt].forEach((z) => z.expect(null));
    plates.forEach((b) => {
      glowOn(b, false);
      S.untap(b);
      b.balls.forEach((ball) => S.untap(ball));
    });
    const made = {};
    plated().forEach((it) => (made[it.key] = (made[it.key] || 0) + 1));
    new Set(Object.keys(want).concat(Object.keys(made))).forEach((key) => {
      const { type, size } = split(key);
      const w = want[key] || 0;
      const got = made[key] || 0;
      // the kind as the order says it ("ph-big+cook-maani"): the result card shows "ba wadhi maani"
      zb.listen(got === w, `made ${got} ${key}, they asked for ${w}`);
      if (!ctx.guided && w) {
        const mark = got === w ? Cook.markRight : Cook.markMiss;
        [Cook.numId(w), type, size].filter(Boolean).forEach((id) => mark(id));
      }
    });
    // the step has closed (Done): its rows tick, count rows too, right or not (UX 11)
    if (ctx.closeItem) ctx.closeItem([], { all: true });
    ctx.result.maani = plated().length;
    ctx.result.maaniKinds = made;
    [zb, zr, zon, zt].forEach((z) => z.close());
    return plated().length;
  }

  Mech.lab("maani-line", {
    name: "Maani line",
    verb: "Plates → chakla → tawa",
    after: "roll-tawa",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.maani.make(L.ctx.order.who, { level: L.level });
      L.ctx.steps = R.maani.steps(d);
      L.card(d, L.ctx.steps);
      await L.station("maani-line", { order: d.maani });
    },
  });
})(window);
