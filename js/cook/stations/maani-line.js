/*
 * Combined station: the Maani line, v3 (docs/design/cook-design-system-v1.md §11, §13's burner rule;
 * the 29 Sept play-test §5, M3-M9, Q14, Q15: build/reports/maani-v3.md).
 *
 * A two-zone grid, everything centred, aligned on shared lines:
 *  - LEFT (prep): the chakla (rolling board, dark walnut), a faint gold ring etched on it (the size to
 *    roll to; it glows when the maani is right). The velan rolls on its own: no hands anywhere.
 *  - RIGHT (cook): the shared kitchen kit's compact hob with ONE burner and ONE tawa centred on it
 *    (maani keeps one tawa: the game is rolling the next maani while flipping the one on the tawa),
 *    the flames peeking out all round it, the heat ring on the tawa's rim, the person's face and the
 *    knob on the hob's front edge, the flat wooden turner resting on the counter beside the hob.
 *  - THE SHELF BAND (the bottom 26%): under the chakla, the dough piles (wheat, bajri: always both,
 *    straight on the band, no tray), a `🔊 word` chip under each (tap the pile = one ball flies out,
 *    tap the chip = hear it; the speaker alone from level 3); under the hob, the finished-maani
 *    plates, one per kind, where each cooked maani lands.
 *
 * The flow: tap a dough pile, a ball flies out to the chakla (tap the other pile before you start
 * and it goes back: a slip is free); drag up and down, the velan rolls it out to the ring. Tap the
 * rolled maani and it slides onto the tawa (if the tawa's busy it waits on the board, so roll the
 * next one while this one cooks). On the tawa the ring fills like a clock: tap in the green and
 * the turner flips it (the spotted, half-cooked side up); tap in the green again and the turner
 * lifts it, flat and cooked, onto its plate. Too late and it's burnt (its own picture). The tick,
 * when you think you've made what they asked for; the ear star checks the count of each kind (the
 * target is never shown).
 *
 * Params: order ({kind: n}; kinds "cook-maani", "cook-bajrmaani", or "ph-big+cook-maani" with
 * sizes at level 4). Returns how many were made. Knobs and levels: data/stations/maani-line.json;
 * the tawa's band and rate: data.mechanics.tawa (level 1), made about 15% quicker per level by
 * data.timing.levelSpeed. Art: the v3 set (assets/cook/items/v3/maani/: piles, balls, chakla, velan,
 * tawa, turner, the four flat maani states per kind), the kit's hob, and v2's thali (maani-v2/).
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
  const V3 = IT + "v3/maani/";
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
  const PIN_W = 440; // the v3 velan is a thicker pin: shorter, so it sits on the board and not over its edges
  // 30 Sept (M3, M9 / Q14): the dough piles stand straight on the band (no tray), on this line just above
  // their chips; St.shelfFit sizes them so the gap above equals the gap under the chips (no hop: a pile
  // doesn't bounce, it squashes a little as a ball comes off)
  const PILE_BASE = 828;
  const PILE_K = 0.32; // at most (a pile is 590 px): shelfFit brings it down to the band's rule
  /* ---------- the v3 art (29 Sept play-test M3-M8; assets/cook/items/v3/maani/, build/cut_cook_v3.py) ----------
   * Measured from the art (meta.json; build/check_vessel_meta.py checks these against it): each round body's
   * centre (cx, cy: fractions of the canvas) and radius (r: of the width). Placed by the body, never the box. */
  const TAWA = { w: 1221, cx: 0.3533, cy: 0.4978, r: 0.3386 }; // M8: the hi-res tawa, handle at right
  const CHAKLA = { w: 726, cx: 0.4988, cy: 0.4988, r: 0.4746 }; // M4: dark walnut
  const DISC_R = 0.44; // every maani state (raw, half, cooked, burnt) shares one canvas: the disc's radius
  const BALL_R = 0.437; // a dough ball's radius (wheat 0.437, millet 0.4347)
  const TURNER = { ox: 0.19, oy: 0.73, len: 220 }; // M6 / Q15: the blade's middle (the origin), its length on screen
  const INK = { page: 0xf4ecdf, panel: 0xefe5d6, grey: 0xd9d2c7 };
  const ART = [
    ["mv-chakla", V3 + "chakla.webp"],
    ["mv-velan", V3 + "velan.webp"],
    ["mv-tawa", V3 + "tawa.webp"],
    ["mv-turner", V3 + "turner.webp"],
    ["mv-thali", MV + "thali.webp"],
    ["mv-pile-maani", V3 + "dough-pile-wheat.webp"],
    ["mv-pile-bajr", V3 + "dough-pile-millet.webp"],
    ["mv-ball-maani", V3 + "dough-ball-wheat.webp"],
    ["mv-ball-bajr", V3 + "dough-ball-millet.webp"],
  ]
    .concat(
      // M5: flat states, brown spots, no puff; a burnt one of its own (no more tinting the done one)
      ["raw", "half", "cooked", "burnt"].flatMap((st) => [
        [`mv-${st}-maani`, `${V3}maani-wheat-${st}.webp`],
        [`mv-${st}-bajr`, `${V3}maani-millet-${st}.webp`],
      ])
    )
    .concat(Kit.art(1, []));

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
    await Promise.race([St.load(S, ART.concat(Cook.Kit.faceArt(who))), Cook.wait(5000)]);
    const texOf = (t, state) => {
      const key = `mv-${state}-${t === "cook-bajrmaani" ? "bajr" : "maani"}`;
      return S.textures.exists(key) ? key : { ball: "dough-ball", raw: "chapati-raw", half: "chapati-half", cooked: "chapati-puffed", burnt: "chapati-puffed" }[state];
    };
    // how much of its canvas a picture's round body fills (the v3 art has margins): a maani r px across is its disc, not its box
    const bodyOf = (key) => (/^mv-(raw|half|cooked|burnt)-/.test(key) ? DISC_R : /^mv-ball-/.test(key) ? BALL_R : 0.5);
    const discScale = (key, r) => r / (bodyOf(key) * S.texSize(key).w);
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
    // M4: the dark walnut chakla, centred by its measured round body
    const board = S.track(S.add.image(CH.x, CH.y, "mv-chakla").setOrigin(CHAKLA.cx, CHAKLA.cy).setDepth(D.item - 2));
    board.setScale(CHAKLA_D / 2 / (CHAKLA.r * board.width));
    board.shadow = S.contactShadow(board);
    // the velan waits along the board's front edge; it lifts off to roll (rollOne draws the rolling one)
    const restPin = S.track(S.add.image(CH.x, CH.y + CHAKLA_D / 2 - 4, "mv-velan").setDepth(D.item - 1));
    restPin.setScale((PIN_W * 0.92) / restPin.width);
    restPin.shadow = S.contactShadow(restPin);
    const pinRest = (on) => S.tweens.add({ targets: restPin, alpha: on ? 1 : 0, duration: 200 });

    /* ---------- the hob: one burner, one tawa, the face and the knob on the front edge ---------- */
    // M7: the flame ring sized to the tawa (as chai's and daar's): its tips peek out past the rim all the
    // way round (flame-high reaches 1.2 x flameR; the v2 0.74 hid it under the tawa but for the gaps)
    const burner = Kit.burner(S, hob, 0, { who, flameR: TAWA_R * 0.95, spread: 62, state: "high" });
    const TW = { x: hob.burners[0].x, y: hob.burners[0].y };
    // M8: the hi-res tawa, placed by its measured body (the handle leaves the box off-centre), as Kit.place does
    const tawa = S.track(S.add.image(TW.x, TW.y, "mv-tawa").setOrigin(TAWA.cx, TAWA.cy).setDepth(D.item - 0.5));
    tawa.setScale(TAWA_R / (TAWA.r * tawa.width));
    tawa.shadow = S.contactShadow(tawa, { centerX: TW.x, centerY: TW.y + TAWA_R * 0.08, width: TAWA_R * 2.15, height: TAWA_R * 2.15 });
    const ring = Kit.heatRing(S, { width: 11 });
    // the ring on the tawa's rim, inside the flames (X6: never on the flame tips), outside the maani
    const RING_R = TAWA_R - 14;
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
    // M6 / Q15: the flat wooden turner (the family's tool: a word like "moikyo", to confirm with Mum) rests on
    // the counter right of the hob, blade down by the hob's corner, handle up and away: placed, not floating.
    // It slides under the maani to flip it, and again to lift it off. Its origin is the blade's middle.
    const turnerHome = { x: hob.x + hob.w + 62, y: hob.y + hob.h - 120, angle: 0 };
    const turner = S.track(S.add.image(turnerHome.x, turnerHome.y, "mv-turner").setOrigin(TURNER.ox, TURNER.oy).setDepth(D.item + 3));
    turner.setScale(TURNER.len / turner.width);
    if (turner.preFX && S.renderer && S.renderer.type === Phaser.WEBGL) {
      turner.preFX.padding = 12;
      turner.preFX.addShadow(-2, 3, 0.06, 1, 0x000000, 4, 0.35);
    }

    /* ---------- the shelf band: the dough piles (chips) | the finished plates ---------- */
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
    // M3 / Q14: one realistic pile of dough balls per kind, straight on the band (no tray); tap it and one
    // ball flies out. Both piles at one scale (the smaller fit), standing on PILE_BASE by their own bottom.
    const pileKey = (t) => `mv-pile-${t === "cook-bajrmaani" ? "bajr" : "maani"}`;
    const pileK = Math.min(...order.map((t) => (S.textures.exists(pileKey(t)) ? St.shelfFit(S, pileKey(t), PILE_K, PILE_BASE, { hop: false }) : PILE_K)));
    const plates = order.map((type, i) => {
      const x = rowXs(LX, order.length)[i];
      const key = pileKey(type);
      const bottom = S.textures.exists(key) ? St.opaqueSpan(S, key)[1] : 1;
      const img = S.track(S.add.image(x, PILE_BASE, key).setOrigin(0.5, bottom).setScale(pileK).setDepth(D.item - 1));
      img.baseScale = pileK;
      img.shadow = S.contactShadow(img, { centerX: x, centerY: PILE_BASE - 6, width: img.displayWidth * 0.86, height: 24 });
      img.type = type;
      // always more than anyone orders, the same in both, never shown (the pile is one picture): out of
      // balls, the pile goes (a ball put back brings it back)
      img.left = K.ballsPerBowl || 5;
      img.chip = Kit.chip(S, type, x, CHIP_Y, { word: showWord, w: 188 });
      return img;
    });
    const pileShow = (pl) => S.tweens.add({ targets: [pl, pl.shadow].filter(Boolean), alpha: pl.left > 0 ? 1 : 0, duration: 250 });
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
    const nextType = () => (plates.find((b) => leftOf(b.type) > 0 && b.left > 0) || {}).type || null;
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

    /* ---------- a dough pile -> the chakla -> rolled ---------- */
    async function pick(pl) {
      if (finished) return;
      if (waiting) return S.wiggle(waiting.sprite); // the board's taken: put that one on the tawa first
      if (chakla && (chakla.busy || chakla.started)) return S.wiggle(pl); // one at a time: finish this one first
      if (chakla && chakla.type === pl.type) return;
      if (pl.left <= 0) return S.wiggle(pl);
      if (chakla) putBack(chakla);
      // one ball comes off the top of the pile (the art's balls are drawn at the pile's scale) and flies out
      const pc = S.centre(pl);
      const ball = { x: pc.x + (Math.random() - 0.5) * pc.w * 0.2, y: pc.y - pc.h * 0.2, scale: pileK };
      pl.left--;
      pileShow(pl);
      const sprite = S.track(S.add.image(ball.x, ball.y, texOf(pl.type, "ball")).setScale(ball.scale).setDepth(D.item + 3));
      S.tweens.add({ targets: pl, scaleY: pileK * 0.96, duration: 90, yoyo: true, onComplete: () => pl.active && pl.setScale(pileK) });
      const c = { type: pl.type, plate: pl, ball, sprite, busy: true, started: false, handle: {} };
      chakla = c;
      Cook.sfx.pop();
      wordPop(pl.type, CH.x, CH.y - CHAKLA_D / 2 - 10);
      update();
      await S.fly(sprite, CH.x, CH.y, { scale: discScale(sprite.texture.key, kRoll.startRadius), duration: 420, arc: 170 });
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
        body: bodyOf,
        gold: true,
        onStart: () => {
          c.started = true;
          update();
        },
      });
      pinRest(true);
      if (!r) return; // it went back to its pile
      zr.skill(r.score, "roll");
      chakla = null;
      const it = { sprite: r.sprite, type: c.type, size: r.target || null, key: keyOf(c.type, r.target), score: r.score, where: "board", landed: true };
      it.sizeF = sizes ? Math.sqrt((sizes.find((s) => s.id === it.size) || { r: rMax }).r / rMax) : 1;
      items.push(it);
      waiting = it;
      S.tappable(it.sprite, () => putOn());
      update();
    }
    /** Changed your mind before rolling: the dough goes back onto its pile (§17). */
    function putBack(c) {
      c.handle.cancel && c.handle.cancel();
      chakla = null;
      S.fly(c.sprite, c.ball.x, c.ball.y, { scale: c.ball.scale, duration: 300 }).then(() => {
        c.sprite.destroy();
        c.plate.left++;
        pileShow(c.plate);
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
      const sz = discScale(it.sprite.texture.key, TAWA_R * 0.72 * it.sizeF);
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

    /** The turner slides its blade under the maani's right edge (from its side of the hob), and back. */
    const turnerTo = (x, y, r) =>
      Cook.tween(S, { targets: turner, x: x + r * 0.62, y: y + r * 0.12, angle: -6, duration: 190, ease: "Sine.easeOut" });
    const turnerHomeTween = () => S.tweens.add({ targets: turner, x: turnerHome.x, y: turnerHome.y, angle: turnerHome.angle, duration: 260, ease: "Sine.easeInOut" });
    const discR = (it) => TAWA_R * 0.72 * it.sizeF;

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
        // the turner flips it: the cooked side comes up, spotted (M5), or burnt if it caught
        await turnerTo(TW.x, TW.y, discR(it));
        Cook.sfx.flip();
        S.tweens.add({ targets: turner, angle: -16, y: turner.y - 10, duration: 110, yoyo: true });
        await Cook.tween(S, { targets: sp, scaleY: 0.02, duration: 110 });
        sp.setTexture(texOf(it.type, burnt ? "burnt" : "half")).setTint(0xffffff);
        sp.baseScale = discScale(sp.texture.key, discR(it));
        sp.setScale(sp.baseScale, 0.02);
        await Cook.tween(S, { targets: sp, scaleY: sp.baseScale, duration: 110 });
        turnerHomeTween();
        t.s1 = burnt ? kTawa.burntScore : S.bandScore(v, lo, hi);
        t.burnt = burnt;
        S.verdict(TW.x, TW.y - TAWA_R - 30, t.s1, { bad: burnt ? "burnt" : "too-early" });
        t.side = 2;
        t.v = 0;
        t.busy = false;
        return;
      }
      // side two: the turner lifts it off. M5: it stays flat (the v2 puffed picture is gone); a good one
      // is the cooked picture, lifted too soon it's still the half-cooked one, too late (or burnt on the
      // first side) the burnt one. A little lift as it comes off, no puff.
      const good = v >= lo && v < 1;
      const state = t.burnt || burnt ? "burnt" : v >= lo ? "cooked" : "half";
      await turnerTo(TW.x, TW.y, discR(it));
      sp.setTexture(texOf(it.type, state)).setTint(0xffffff);
      const dz = discScale(sp.texture.key, discR(it));
      sp.setScale(dz);
      sp.baseScale = dz;
      Cook.sfx.flip();
      await Cook.tween(S, { targets: [sp], scale: dz * 1.03, duration: 150, ease: "Sine.easeOut", yoyo: true });
      S.steam(TW.x, TW.y - 60, good ? 4 : 2);
      const s2 = burnt ? kTawa.burntScore : S.bandScore(v, lo, hi);
      S.verdict(TW.x, TW.y - TAWA_R - 30, s2, { bad: burnt ? "burnt" : "too-early" });
      zt.skill((t.s1 + s2) / 2, "tawa");
      // onto its kind's plate: a fanned stack (you can count them), each one a little askew
      const d = dones[it.type] || Object.values(dones)[0];
      const j = d.n++;
      onTawa = null;
      S.untap(sp);
      sp.setDepth(D.item + 2 + j * 0.01);
      S.tweens.add({ targets: sp, angle: Math.random() * 24 - 12, duration: 450 });
      turnerHomeTween();
      const [fx, fy] = FAN[j % FAN.length];
      const fly = S.fly(sp, d.x + fx, d.y + fy, { scale: discScale(sp.texture.key, PLATE_D * 0.3 * it.sizeF), duration: 450 });
      update();
      await fly;
      it.where = "plate";
      it.state = state;
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
      // the browning as the ring fills: a warm tint over the raw side, lighter over the spotted side
      t.it.sprite.setTint(brown(Math.min(1, t.v) * (t.side === 1 ? 1 : 0.5)));
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
    });
    const made = {};
    plated().forEach((it) => (made[it.key] = (made[it.key] || 0) + 1));
    let allOk = true;
    new Set(Object.keys(want).concat(Object.keys(made))).forEach((key) => {
      const { type, size } = split(key);
      const w = want[key] || 0;
      const got = made[key] || 0;
      if (got !== w) allOk = false;
      // the kind as the order says it ("ph-big+cook-maani"): the result card shows "ba wadhi maani"
      zb.listen(got === w, `made ${got} ${key}, they asked for ${w}`);
      if (!ctx.guided && w) {
        const mark = got === w ? Cook.markRight : Cook.markMiss;
        [Cook.numId(w), type, size].filter(Boolean).forEach((id) => mark(id));
      }
    });
    // the step has closed (Done): its rows tick, count rows too, right or not (UX 11)
    if (ctx.closeItem) ctx.closeItem([], { all: true });
    // the review (29 Sept, X10 / Q1: Cook.Kit.review): their big round face over the finished plates,
    // happy when the counts are right, a gentle frown when they're not (the card shows which)
    if (who && Cook.Kit.review) {
      const ds = Object.values(dones);
      const fx = ds.reduce((a, d) => a + d.x, 0) / ds.length;
      const look = await Cook.Kit.review(S, { who, ok: allOk, x: fx, y: PLATE_Y - PLATE_D * 0.5 - 70, size: 230 });
      await Cook.wait(allOk ? 300 : 900);
      await look.close();
    }
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
