/*
 * Combined station: the Chai tray, v2 (docs/design/cook-design-system-v1.md §4, §5, §10; the owner's logic).
 *
 * Everything is made in the PAN; nothing is made in the glass.
 *  - THE HOB (top left): a compact top-down hob with one burner per person (level 1: 1, then 2, 3;
 *    never an unused burner). Each burner holds that person's pan; their small face badge and the
 *    burner's knob sit on the hob's front edge, in front of it. Tap a pan (or its face: you hear them
 *    again) to work on it. Pans can be cooked in any order, or all at once: the child chooses the
 *    speed and the boil-over risk.
 *  - THE SHELF (the bottom 26%): identical slots grouped by kind: liquids (water bottle, milk
 *    carton) | jars (chai leaves, sugar) | spices (small identical jars: the extras and the salt
 *    that looks like sugar). Under each object one `🔊 word` chip: tap the object = use it (into the
 *    chosen pan), tap the chip = hear it. At higher levels the word hides but the speaker stays,
 *    the same size and place. When something goes in, its word pops by the pour or spoon and the
 *    family clip plays.
 *  - HEAT, per pan (as before): tap the knob to light it (water first); a ring round the pan fills
 *    like a clock and the chai darkens and rolls; tap the knob in the green to turn it down. Ignore
 *    it and it boils over (foam, the hand star). Then the pan is ready.
 *  - THE TRAY (top right): a small square wooden tray with 4 round cut-outs, each person's face
 *    under theirs, quiet (dimmed) until a pan is ready. Tap a ready pan: it lifts, tilts and pours
 *    into its person's glass. At level 4 (half or full: adh / aako) one tap pours half, a second
 *    fills it; below that one tap fills it.
 * The focal rule (§3): the next generic step pulses (water, chai, the knob, a ready pan); what a
 * person asked for (milk or not, how many sugars, which extra) pulses only when Nani helps
 * (guided), since that pulse would be the answer. Inactive shelf things are dimmed about 10%.
 * Pills tick as each step closes (UX 11) on the person's card; every glass is judged at the tick
 * and in the end review (a wrong one is a recast: that person says again what they asked for).
 *
 * Data: the chai recipe's slots (who and what, by level) in data/cook.json; this station's own
 * settings in data/stations/chai-tray.json; the boil knobs in data.mechanics.boil (profile tray).
 * Art: assets/cook/items/chai-v2/ (build/gen_chai_v2.py, build/cut_chai_v2.py; positions in its
 * meta.json), the pantry-v2 jars; the hob, burners, knobs, flames and heat ring are the shared
 * kitchen kit's (js/cook/kitchen-kit.js).
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  const V2 = "assets/cook/items/chai-v2/";
  // what build/cut_chai_v2.py measured (kept here so the station needs no extra fetch)
  const META = {
    panTop: { w: 512, h: 492, cx: 0.408, cy: 0.5805, r: 0.3644, rIn: 0.2915 },
    panPour: { w: 512, h: 500, lipX: 0.03, lipY: 0.545 },
    glassR: 0.94,
  };
  /* ---------- the grid (design px, 1600x900; the canvas is the play area) ---------- */
  const SHELF_TOP = 666; // §3: the scene is the top 74%, the shelf band the bottom 26%
  const BASE = 818; // the shelf line: every object stands on it
  const BOX = 128; // a slot's fallback box (a word without shelf art)
  // true relative heights (Zafar, 28 Sept, late): the bottle and carton stand tall, the chai and
  // sugar jars medium, the spice jars short, all on one shelf line (the scale per group of the
  // pantry-v2 canvases: liquids | jars | spices)
  const SHELF_K = [0.425, 0.33, 0.33];
  const PITCH = 150;
  const GROUP_GAP = 44;
  const CHIP = { w: 128, h: 46, y: 860, hitW: 142, hitH: 80 }; // the tap area: as big as the band allows
  const HOB_K = 0.79; // the mock-up's hob, 15% bigger (§10)
  const TRAY_D = 392;
  const GAP = 72;
  const PAN_R = 112; // a pan's outer rim, design px
  const BADGE = 64;
  const WELLS = [[0.283, 0.279], [0.717, 0.279], [0.283, 0.697], [0.717, 0.697]]; // the tray's cut-outs
  const WELL_D = 0.33;
  const COL = { water: St.WATER, chai: 0x8a4a22, milk: 0xf6f1e7, glass: 0xc98a52 };
  const INK = { text: "#2A2522", kutchi: "#8C2F2F", card: 0xffffff, grey: 0xd9d2c7, gold: 0xc9962e, panel: 0xefe5d6, page: 0xf4ecdf };
  const FONT = "Nunito, sans-serif";
  const jarUrl = (id) => `assets/cook/items/shelf-${id}-bare-f.webp`;
  // the small-jar family for every spice slot (aadu and lasan drawn for v2 in the same jar)
  const SPICE_JAR = { "veg-14": "assets/cook/items/shelf-veg-14-jar-f.webp", "veg-13": "assets/cook/items/shelf-veg-13-jar-f.webp" };
  const ART = [
    ["v2-pan", V2 + "pan-top.webp"],
    ["v2-pan-pour", V2 + "pan-pour.webp"],
    ["v2-tray", V2 + "tray-4-cutout-t.webp"],
    ["v2-glass-empty", V2 + "glass-empty.webp"],
    ["v2-glass-half", V2 + "glass-half.webp"],
    ["v2-glass-full", V2 + "glass-full.webp"],
    ["v2-liq-milk", V2 + "liquid-milk.webp"],
    ["v2-liq-tea", V2 + "liquid-tea.webp"],
    ["v2-liq-milky", V2 + "liquid-milky.webp"],
    ["v2-liq-dark", V2 + "liquid-dark.webp"],
  ]
    .concat(...[1, 2, 3, 4].map((n) => Cook.Kit.art(n, []))) // the shared kitchen kit: hobs, knobs, flames
    .filter(([key], i, a) => a.findIndex(([k2]) => k2 === key) === i);

  Mech.combined("chai-tray", {
    station: "chai-tray",
    view: "marble",
    dataFile: "data/stations/chai-tray.json",
    // one drawing space (1:1); the hob zone posts every expectation, the tray zone reports the glasses
    zones: [
      { id: "boil", mech: "boil", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } },
      { id: "tray", mech: "pour", region: [0, 0, 1600, 900], footprint: { x: 0, y: 0, w: 1600, h: 900 } },
    ],
    run: (host, params) => station(host, params),
  });

  const nameOf = (who) => (who === "nani" ? "Nani" : (Cook.data.customers[who] || {}).name || who);
  /** A person's face badge (the kitchen kit's). */
  const roundBadge = (S, who) => Cook.Kit.badge(S, who);
  /** This dish's ladder on the mission card (or one built from the cups). */
  function ladderOf(ctx, cups) {
    const Ls = UI.mission.ladders();
    const L = Ls.find((x) => x.recipe === "chai" && x.dish === (ctx.dishAt || 0)) || Ls.find((x) => x.recipe === "chai");
    return L || Cook.Order.ladder({ recipe: "chai", cups }, 0);
  }
  const personRows = (L, who) => {
    const s = L.sections.find((x) => x.for === who);
    return s ? [].concat(...s.groups) : [];
  };
  const personLine = (L, who, rows) => Lang.join((L.head ? [L.head.line] : []).concat((rows || personRows(L, who)).map((r) => (r.no || !r.said ? r.line : r.said))));
  const hiddenRow = (r) => !r.done && !r.revealed && r.line.segs.some((s) => s.w && Cook.cardHidden(s.w) && Lang.wordHasVoice(s.w));

  /** The speaker icon (the kitchen kit's). */
  const speaker = (g, x, y, sz, color) => Cook.Kit.speaker(g, x, y, sz, color);

  async function station(host, params) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const zb = host.zones.boil;
    const zt = host.zones.tray;
    const guided = !!ctx.guided;
    const level = zb.level;
    const people = (params.cups || []).slice(0, 4);
    const n = Math.max(1, people.length);
    const kBoil = Mech.knobs("boil", { level: K.boilLevel || level, profile: "tray" });
    const kCount = Mech.knobs("count", { level });
    const halves = people.some((p) => p.amount); // level 4: half or full
    const spiceIds = (K.extras || []).concat(K.decoys || []).filter((id, i, a) => a.indexOf(id) === i).slice(0, 4);
    const shelfIds = [["cook-paani", "cook-dudh"], ["cook-chai", "cook-khun"], spiceIds];
    await Promise.race([
      St.load(
        S,
        ART.concat(
          people.map((p) => [`${p.who}-badge`, `assets/cook/characters/${p.who}-badge.webp`]),
          [].concat(...shelfIds).map((id) => [`jar-${id}`, SPICE_JAR[id] || jarUrl(id)])
        )
      ),
      Cook.wait(5000),
    ]);
    let lastPhase = null;
    const phase = (key) => {
      if (key === lastPhase) return;
      lastPhase = key;
      const text = ((Cook.data.stations["chai-tray"] || {}).phases || {})[key];
      Cook.save.seenStation = Cook.save.seenStation || {};
      const seenKey = `chai-tray:${key}`;
      if (UI.guideFor) UI.guideFor(seenKey);
      if (text && (guided || ctx.lab || !Cook.save.seenStation[seenKey])) UI.gist(text);
      Cook.save.seenStation[seenKey] = true;
    };

    /* ---------- the scene: the softened marble, the shelf band ---------- */
    // §7: soften the marble so it doesn't compete with the objects
    S.track(S.add.rectangle(0, 0, 1600, SHELF_TOP, INK.page, 0.5).setOrigin(0).setDepth(D.bg + 1));
    const band = S.track(S.add.graphics().setDepth(D.bg + 1.2));
    band.fillStyle(INK.panel, 1);
    band.fillRect(0, SHELF_TOP, 1600, 900 - SHELF_TOP);
    band.fillStyle(0x2a1a0a, 0.08);
    band.fillRect(0, SHELF_TOP, 1600, 3);
    band.fillStyle(INK.grey, 1);

    /* ---------- the hob: one burner per person ---------- */
    const hobW = Cook.Kit.HOB.w[n - 1];
    const k = Math.min(HOB_K, (1600 - 2 * 56 - GAP - TRAY_D) / hobW);
    const hobH = Cook.Kit.HOB.h * k;
    const trayD = Math.min(TRAY_D, hobH * 0.78);
    const total = hobW * k + GAP + trayD;
    const hobX = Math.max(48, (1600 - total) / 2);
    const hobY = SHELF_TOP - 56 - hobH; // low (§10), with some breathing space above the shelf
    // the shared kitchen kit's hob: one burner per person (the burner rule)
    const kHob = Cook.Kit.hob(S, { n, x: hobX, y: hobY, k });
    const hob = kHob.img;
    const burnerY = kHob.burners[0].y;
    const burners = kHob.burners.map((b) => b.x);
    const pitch = kHob.pitch;
    const panR = Math.min(PAN_R, pitch * 0.4) * (k / HOB_K);

    /* ---------- the tray: 4 cut-outs, a face under each one used ---------- */
    const trayX = hobX + hobW * k + GAP;
    const trayY = hobY + (hobH - trayD) / 2 - 8;
    const tray = S.track(S.add.image(trayX, trayY, "v2-tray").setOrigin(0).setDepth(D.item - 4));
    tray.setDisplaySize(trayD, (trayD * 754) / 768);
    tray.shadow = S.contactShadow(tray);
    const trayQuiet = S.track(S.add.rectangle(trayX, trayY, trayD, (trayD * 754) / 768, INK.page, 0.42).setOrigin(0).setDepth(D.item + 1.1));

    /* ---------- one pan per person ---------- */
    const pm = META.panTop;
    const panScale = panR / (pm.r * pm.w);
    const rIn = pm.rIn * pm.w * panScale;
    const pans = people.map((p, i) => {
      const x = burners[i];
      const y = burnerY;
      // the kit's burner: the flame ring peeking out under the pan; their face (= hear them) and the knob on the front edge
      const b = Cook.Kit.burner(S, kHob, i, { who: p.who, flameR: panR });
      const { face, knob, kOff, kOn, knobHit, flameHi, flameLo } = b;
      const img = S.track(S.add.image(x, y, "v2-pan").setOrigin(pm.cx, pm.cy).setScale(panScale).setDepth(D.item));
      img.baseScale = panScale;
      img.shadow = S.contactShadow(img, { centerX: x, centerY: y + panR * 0.08, width: panR * 2.15, height: panR * 2.15 });
      // the liquid: water drawn (see-through); the others are painted pools that cross-fade
      const water = S.track(S.add.graphics().setDepth(D.item + 0.2));
      const layers = {};
      ["tea", "milk", "milky", "dark"].forEach((key, j) => {
        layers[key] = S.track(S.add.image(x, y, `v2-liq-${key}`).setDepth(D.item + 0.3 + j * 0.02).setAlpha(0));
      });
      const bubbles = S.track(S.add.graphics().setDepth(D.item + 0.5));
      const heatRing = Cook.Kit.heatRing(S);
      const sel = S.track(S.add.graphics().setDepth(D.item - 0.5));
      const selRing = S.track(S.add.graphics().setDepth(D.item + 0.95));
      const pan = {
        i, p, who: p.who, x, y, img, water, layers, bubbles, ring: heatRing.g, heatRing, burner: b, sel, selRing, face, knob, kOff, kOn, knobHit, flameHi, flameLo,
        level: 0, has: { water: 0, leaves: 0, milk: 0 }, sugar: 0, salt: 0, extras: [],
        heat: 0, state: "cold", poured: 0, closed: false, spoonsClosed: false, look: 0,
      };
      // what Cook.Spoon aims at: a vessel with a rim and a surface
      pan.vessel = { active: true, rim: { x, y, rx: rIn, ry: rIn, depth: 0 }, rimRx: rIn, rimRy: rIn, surface: () => ({ x, y }) };
      return pan;
    });
    const wells = people.map((p, i) => {
      const [fx, fy] = WELLS[i];
      const wx = trayX + fx * trayD;
      const wy = trayY + fy * ((trayD * 754) / 768);
      const d = (WELL_D * trayD) / META.glassR;
      const glass = {};
      ["empty", "half", "full"].forEach((st) => (glass[st] = S.track(S.add.image(wx, wy, `v2-glass-${st}`).setDisplaySize(d, d).setDepth(D.item + 0.5).setAlpha(st === "empty" ? 1 : 0))));
      const face = S.track(S.add.image(wx, wy + (WELL_D * trayD) / 2 + 2, roundBadge(S, p.who)).setDisplaySize(46, 46).setDepth(D.item + 1));
      return { x: wx, y: wy, glass, face, fill: 0 };
    });
    pans.forEach((pan, i) => (pan.well = wells[i]));

    /* ---------- the shelf: identical slots, grouped, a chip under each ---------- */
    const slotsN = shelfIds.reduce((a, g) => a + g.length, 0);
    const width = slotsN * PITCH + (shelfIds.length - 1) * GROUP_GAP;
    const x0 = Math.max(40, (1600 - 190 - width) / 2); // clear of the tick, bottom right
    const shelf = {};
    let sx = x0 + PITCH / 2;
    const plank = S.track(S.add.graphics().setDepth(D.bg + 1.3));
    shelfIds.forEach((group, gi) => {
      plank.fillStyle(INK.grey, 1);
      plank.fillRoundedRect(sx - PITCH / 2 + 10, BASE - 2, group.length * PITCH - 20, 10, 5);
      group.forEach((id) => {
        shelf[id] = slot(id, sx, SHELF_K[gi]);
        sx += PITCH;
      });
      sx += GROUP_GAP;
    });
    // where a canvas's picture ends at the bottom (its transparent margin stands below the shelf line)
    function opaqueBottom(key) {
      try {
        const src = S.textures.get(key).getSourceImage();
        const cv = document.createElement("canvas");
        cv.width = src.width;
        cv.height = src.height;
        const g = cv.getContext("2d", { willReadFrequently: true });
        g.drawImage(src, 0, 0);
        const d = g.getImageData(0, 0, cv.width, cv.height).data;
        for (let y = cv.height - 1; y > 0; y--) for (let x = 0; x < cv.width; x += 2) if (d[(y * cv.width + x) * 4 + 3] > 60) return (y + 1) / cv.height;
      } catch (e) {
        /* a tainted texture: its canvas bottom */
      }
      return 1;
    }
    function slot(id, x, K) {
      const key = `jar-${id}`;
      let img;
      if (S.textures.exists(key)) {
        img = S.track(S.add.image(x, BASE, key).setOrigin(0.5, opaqueBottom(key)).setScale(K).setDepth(D.item + 1));
        img.baseScale = K;
        img.shadow = S.contactShadow(img, { centerX: x, centerY: BASE - 2, width: img.displayWidth * 0.8, height: 22 });
      } else img = S.ingredient(id, x, BASE - BOX / 2, { w: BOX, h: BOX, label: false });
      img.wordId = id;
      img.isJar = true;
      img.home = { x: img.x, y: img.y };
      // the chip: `🔊 word`, or the speaker alone once the word hides (same size, same place)
      const showWord = Cook.labelMode(id) === "text" && level < 3;
      const chip = S.track(S.add.container(x, CHIP.y).setDepth(D.item + 2));
      const bg = S.add.graphics();
      bg.fillStyle(0x28190a, 0.1);
      bg.fillRoundedRect(-CHIP.w / 2, -CHIP.h / 2 + 2, CHIP.w, CHIP.h, 12);
      bg.fillStyle(INK.card, 1);
      bg.fillRoundedRect(-CHIP.w / 2, -CHIP.h / 2, CHIP.w, CHIP.h, 12);
      chip.add(bg);
      const icon = S.add.graphics();
      if (showWord) {
        const t = S.add.text(0, 0, Cook.display(id), { fontFamily: FONT, fontSize: "25px", fontStyle: "800", color: INK.kutchi }).setOrigin(0, 0.5);
        const maxT = CHIP.w - 52;
        if (t.width > maxT) t.setScale(maxT / t.width);
        const w = 22 + 8 + t.displayWidth;
        speaker(icon, -w / 2 + 10, 0, 24);
        t.x = -w / 2 + 30;
        chip.add([icon, t]);
      } else {
        speaker(icon, 1, 0, 26);
        chip.add(icon);
      }
      chip.setSize(CHIP.hitW, CHIP.hitH);
      chip.setInteractive(new Phaser.Geom.Rectangle(-CHIP.hitW / 2, -CHIP.hitH / 2 + 8, CHIP.hitW, CHIP.hitH), Phaser.Geom.Rectangle.Contains);
      chip.on("pointerdown", (ptr, lx, ly, ev) => {
        if (ev && ev.stopPropagation) ev.stopPropagation();
        Cook.unlockAudio();
        if (Cook.onLabel) Cook.onLabel(id);
        Lang.speakWord(id);
        S.tweens.add({ targets: chip, scale: 1.08, duration: 90, yoyo: true });
      });
      img.chip = chip;
      return img;
    }

    /* ---------- state, selection, looks ---------- */
    let sel = null;
    let busy = 0; // a pour or a spoon in flight
    let talked = false;
    let finished = false;
    let glowing = null;
    let doneShown = false;
    let finishUp;
    const doneP = new Promise((r) => (finishUp = r));
    const dishNo = () => ctx.dishAt || 0;
    const [lo, hi] = kBoil.band;

    const setLook = (pan) => {
      // the water (see-through), then the painted pools: tea, milk, milky chai, darkening as it heats
      const L = pan.level;
      pan.water.clear();
      const r = rIn * (0.84 + 0.16 * Math.min(1, L));
      const vis = pan.poured >= 2 ? 0 : L > 0.01 ? 1 : 0;
      const tea = pan.has.leaves > 0;
      const milk = pan.has.milk > 0;
      const dark = tea ? Cook.clamp(pan.heat / hi, 0, 1) * (milk ? 0.85 : 0.95) : 0;
      const a = { tea: 0, milk: 0, milky: 0, dark: 0 };
      if (tea && milk) a.milky = 1;
      else if (tea) a.tea = 1;
      else if (milk) a.milk = pan.has.water ? 0.8 : 1;
      a.dark = dark;
      if (vis && pan.has.water && !tea && !milk) St.shade(pan.water, { x: pan.x, y: pan.y, rx: r, ry: r }, COL.water, pan.state === "heating" ? Math.max(0, (pan.heat - lo + 0.15) / 0.3) : 0);
      Object.entries(pan.layers).forEach(([key, im]) => {
        im.setDisplaySize(r * 2, r * 2);
        im.setAlpha(vis * a[key]);
      });
    };
    const drawSel = () =>
      pans.forEach((pan) => {
        pan.sel.clear();
        pan.selRing.clear();
        if (pan !== sel || n < 2) return;
        // the chosen pan: a warm pool of light under it, and a gold ring round its face
        for (let j = 0; j < 3; j++) {
          pan.sel.fillStyle(0xffd98a, 0.14);
          pan.sel.fillCircle(pan.x, pan.y, panR * (1.06 + j * 0.08));
        }
        pan.selRing.lineStyle(5, INK.gold, 1);
        pan.selRing.strokeCircle(pan.face.x, pan.face.y, BADGE / 2 + 4);
      });
    const select = (pan) => {
      if (sel && sel !== pan) {
        closeSpoons(sel);
        // level 4: moving on from a pan you've poured from closes it (half is the child's call)
        if (sel.poured > 0) closePan(sel);
      }
      sel = pan;
      drawSel();
      UI.hideCount();
      if (pan.sugar) UI.count(pan.sugar, { speak: false, id: "cook-khun" });
      if (pan.salt) UI.count(pan.salt, { speak: false, id: "spi-16" });
      pan.extras.forEach((id) => UI.count(1, { speak: false, id }));
      refresh();
    };
    const closeSpoons = (pan) => {
      if (!pan || pan.closed || pan.spoonsClosed || !(pan.sugar > 0)) return;
      pan.spoonsClosed = true;
      UI.mission.closeItem(["cook-khun"], dishNo(), { for: pan.who });
    };
    const closePan = (pan) => {
      closeSpoons(pan);
      if (pan.closed) return;
      pan.closed = true;
      UI.mission.closeItem([], dishNo(), { all: true, for: pan.who });
    };

    /* ---------- the word pop (§4: learning happens during the action) ---------- */
    const pop = (id, x, y, { speak = true } = {}) => {
      const c = S.track(S.add.container(x, y).setDepth(D.fx + 3).setAlpha(0));
      const t = S.add.text(0, 0, Cook.display(id), { fontFamily: FONT, fontSize: "36px", fontStyle: "800", color: INK.kutchi }).setOrigin(0, 0.5);
      const w = 34 + 10 + t.width + 36;
      const g = S.add.graphics();
      g.fillStyle(0x28190a, 0.1);
      g.fillRoundedRect(-w / 2, -28 + 3, w, 56, 12);
      g.fillStyle(INK.card, 1);
      g.fillRoundedRect(-w / 2, -28, w, 56, 12);
      speaker(g, -w / 2 + 30, 0, 26);
      t.x = -w / 2 + 50;
      c.add([g, t]);
      S.tweens.add({ targets: c, alpha: 1, y: y - 18, duration: 180, ease: "Back.easeOut" });
      S.tweens.add({ targets: c, alpha: 0, y: y - 46, delay: 1900, duration: 320, onComplete: () => c.destroy() });
      if (speak && !UI.naniMuted()) Lang.speakWord(id);
    };
    const popAt = (pan) => ({ x: Math.min(1500, pan.x + panR * 0.9), y: pan.y - panR - 58 });

    /* ---------- using the shelf: pour a bottle, or a spoonful ---------- */
    const pourInto = async (pan, obj, color, toLevel) => {
      // the bottle or carton lifts, tips over the pan (its cap is the spout) and pours
      busy++;
      obj.flying = true;
      refresh();
      const art = S.track(S.add.image(obj.x, obj.y, obj.texture.key).setOrigin(0.5, 1).setScale(obj.scaleX).setDepth(D.fx + 1));
      obj.setAlpha(0);
      if (obj.shadow) obj.shadow.setVisible(false);
      const ox = pan.x + panR * 0.55;
      const oy = pan.y - panR * 0.35;
      art.setOrigin(0.5, 0.5);
      art.y = obj.y - obj.displayHeight / 2;
      await S.fly(art, ox, oy, { duration: 380, arc: 60 });
      await new Promise((r) => S.tweens.add({ targets: art, angle: -118, duration: 220, ease: "Sine.easeOut", onComplete: r }));
      const rad = Phaser.Math.DegToRad(art.angle);
      const cy0 = -0.44 * art.displayHeight;
      const cap = { x: art.x - Math.sin(rad) * cy0, y: art.y + Math.cos(rad) * cy0 };
      const stream = S.track(S.add.graphics().setDepth(D.fx));
      const from = pan.level;
      await new Promise((r) =>
        S.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 620,
          onUpdate: (tw) => {
            const u = tw.getValue();
            stream.clear();
            stream.lineStyle(11, color, color === COL.water ? 0.55 : 0.95);
            stream.beginPath();
            stream.moveTo(cap.x, cap.y);
            stream.lineTo(pan.x + (cap.x - pan.x) * 0.15, pan.y);
            stream.strokePath();
            pan.level = from + (toLevel - from) * u;
            setLook(pan);
          },
          onComplete: r,
        })
      );
      stream.destroy();
      S.puff(pan.x, pan.y, color, 36);
      await new Promise((r) => S.tweens.add({ targets: art, angle: 0, duration: 180, onComplete: r }));
      await S.fly(art, obj.x, obj.y - obj.displayHeight / 2, { duration: 320, arc: 40 });
      art.destroy();
      obj.flying = false;
      obj.setAlpha(1);
      if (obj.shadow) obj.shadow.setVisible(true);
      busy--;
    };
    const spoonInto = async (pan, obj, id) => {
      refresh(); // the next step is known now (a spoon in flight never holds the plan up)
      await Cook.Spoon.spoon(zb, { bowl: obj, into: pan.vessel, word: id, ms: kCount.spoonMs });
    };
    const use = async (id) => {
      const pan = sel;
      const obj = shelf[id];
      if (!pan || finished || pan.poured > 0 || !obj || (busy && (id === "cook-paani" || id === "cook-dudh"))) {
        if (obj && !busy) S.wiggle(obj);
        return;
      }
      unglow();
      Cook.sfx.pop();
      const at = popAt(pan);
      if (id === "cook-paani") {
        pop(id, at.x, at.y);
        pan.has.water++;
        await pourInto(pan, obj, COL.water, Math.min(0.9, pan.level + (pan.level < 0.1 ? 0.62 : 0.12)));
      } else if (id === "cook-dudh") {
        pop(id, at.x, at.y);
        pan.has.milk++;
        if (pan.p.dudh && !pan.closed) UI.mission.tickItem("cook-dudh", dishNo(), { for: pan.who });
        await pourInto(pan, obj, COL.milk, Math.min(1, pan.level + 0.22));
      } else if (id === "cook-khun") {
        if (pan.sugar >= (K.tallyMax || 6)) return;
        pan.sugar++;
        UI.count(pan.sugar, { id: "cook-khun" });
        if (Cook.Hands) Cook.Hands.count(S, pan.sugar);
        pop(id, at.x, at.y, { speak: false });
        await spoonInto(pan, obj, id);
      } else {
        if (id === "cook-chai") pan.has.leaves++;
        else if (id === "spi-16") {
          // the salt that looks like sugar: it just goes in (UX 11); the end check finds it
          pan.salt++;
          UI.count(pan.salt, { speak: false, id });
          zb.listen(false, `added ${id}, not cook-khun, for ${nameOf(pan.who)}`);
        } else {
          if (!pan.extras.includes(id)) pan.extras.push(id);
          if (id === pan.p.extra && !pan.closed) UI.mission.tickItem(id, dishNo(), { for: pan.who });
          UI.count(1, { speak: false, id });
        }
        pop(id, at.x, at.y);
        await spoonInto(pan, obj, id);
        if (id === "cook-chai") {
          // the leaves go in: the water turns to light tea
          if (pan.level < 0.05) pan.level = 0.12;
          setLook(pan);
        }
      }
      refresh();
    };
    Object.keys(shelf).forEach((id) => {
      const o = shelf[id];
      if (id !== "cook-paani" && id !== "cook-dudh") o.handAction = "pinch";
      S.tappable(o, () => talked && !finished && use(id));
    });

    /* ---------- heat: each knob, each pan ---------- */
    const setKnob = (pan, state) => pan.burner.set(state);
    const knobTap = (pan) => {
      if (finished) return;
      if (pan.state === "cold") {
        if (!pan.has.water) {
          // nothing to heat yet: the knob won't turn, the water bottle hops
          S.wiggle(pan.knob);
          S.glow(shelf["cook-paani"], true, { bounce: true });
          S.time.delayedCall(1200, () => glowing !== shelf["cook-paani"] && S.glow(shelf["cook-paani"], false));
          return;
        }
        if (sel !== pan) select(pan);
        pan.state = "heating";
        setKnob(pan, "high");
        refresh();
      } else if (pan.state === "heating") turnDown(pan, false);
    };
    const turnDown = (pan, over) => {
      pan.state = "ready";
      pan.ring.clear();
      setKnob(pan, "low");
      if (over) {
        // boiled over: foam down the sides and onto the hob
        for (let j = 0; j < 12; j++) {
          const a = Math.random() * Math.PI * 2;
          const f = S.track(S.add.ellipse(pan.x + Math.cos(a) * panR * 0.9, pan.y + Math.sin(a) * panR * 0.9, 46, 32, 0xfff6e6, 1).setDepth(D.item + 0.6));
          S.tweens.add({ targets: f, x: f.x + Math.cos(a) * 40, y: f.y + Math.sin(a) * 30 + 20, scale: 1.6, alpha: 0.85, duration: 700, ease: "Bounce.easeOut" });
        }
        Cook.sfx.puff();
        zb.oops();
        zb.skill(kBoil.overScore, "boil");
        S.verdict(pan.x, pan.y - panR - 40, kBoil.overScore, { bad: "boiled-over" });
      } else {
        const score = S.bandScore(pan.heat, lo, hi);
        zb.skill(score, "boil");
        S.verdict(pan.x, pan.y - panR - 40, score, { bad: "too-early" });
      }
      pan.heat = Math.min(pan.heat, hi);
      setLook(pan);
      if (trayQuiet.alpha > 0) S.tweens.add({ targets: trayQuiet, alpha: 0, duration: 400 });
      refresh();
    };
    pans.forEach((pan) => {
      S.tappable(pan.knobHit, () => knobTap(pan));
      S.tappable(pan.img, () => panTap(pan));
      S.tappable(pan.face, () => {
        if (finished) return;
        if (sel !== pan) select(pan);
        hear(pan);
      });
      setLook(pan);
    });
    const drawRing = (pan) => pan.heatRing.draw(pan.x, pan.y, panR + 14, pan.heat, lo, hi);
    let last = performance.now();
    let steamT = 0;
    const stopHeat = S.addTick(() => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000) * Cook.speed;
      last = now;
      steamT += dt;
      pans.forEach((pan) => {
        if (pan.state === "heating") {
          const was = pan.heat >= lo && pan.heat <= hi;
          pan.heat += kBoil.rate * dt;
          const inBand = pan.heat >= lo && pan.heat <= hi;
          if (inBand && !was) Cook.sfx.click();
          drawRing(pan);
          setLook(pan);
          if (pan.heat >= 1) turnDown(pan, true);
        }
        // bubbles as it nears the boil, a gentle simmer once it's ready
        pan.bubbles.clear();
        const hot = pan.state === "heating" ? Cook.clamp((pan.heat - 0.3) / (lo - 0.3), 0, 1.4) : pan.state === "ready" && pan.poured < 2 ? 0.35 : 0;
        if (hot > 0 && pan.level > 0.05) {
          const t = now / 1000;
          const r = rIn * 0.9;
          for (let j = 0; j < 9; j++) {
            const u = (t * (0.7 + hot * 0.6) + j * 0.37) % 1;
            const ang = j * 2.4 + Math.floor(t * 0.9 + j * 0.37) * 1.7;
            const d = 0.2 + ((j * 0.31) % 0.65);
            const s = r * (0.04 + 0.06 * Math.min(1, hot)) * (0.5 + u);
            pan.bubbles.lineStyle(2, 0xfff4e0, (1 - u) * 0.8 * Math.min(1, hot));
            pan.bubbles.strokeCircle(pan.x + Math.cos(ang) * r * d, pan.y + Math.sin(ang) * r * d, s);
          }
          if (steamT > 0.3 && Math.random() < 0.2 + hot * 0.3) S.wisps(pan.x + (Math.random() - 0.5) * rIn, pan.y - rIn * 0.4, 1, 56);
        }
      });
      if (steamT > 0.3) steamT = 0;
      if (gaugePan && gaugePan.state === "heating") zb.gauge({ level: gaugePan.heat, lo, hi });
    });

    /* ---------- pouring: a ready pan tips into its person's glass ---------- */
    const panTap = async (pan) => {
      if (finished || busy) return;
      if (pan.state !== "ready" || pan.poured >= 2 || !talked) {
        if (sel !== pan) select(pan);
        return;
      }
      if (sel !== pan) select(pan);
      busy++;
      unglow();
      zb.expect({ kind: "wait" });
      const w = pan.well;
      const pp = META.panPour;
      const pw = panR * 2.05;
      const ps = pw / pp.w;
      // the tipped pan: its lip over the glass
      const tilt = S.track(S.add.image(pan.x, pan.y, "v2-pan-pour").setOrigin(pp.lipX, pp.lipY).setScale(ps * 0.9).setDepth(D.fx + 1).setAlpha(0));
      pan.img.setAlpha(0);
      Object.values(pan.layers).forEach((im) => im.setVisible(false));
      pan.water.setVisible(false);
      pan.bubbles.setVisible(false);
      if (pan.img.shadow) pan.img.shadow.setVisible(false);
      S.tweens.add({ targets: tilt, alpha: 1, duration: 120 });
      const lx = w.x + 4;
      const ly = w.y - 44;
      await S.fly(tilt, lx, ly, { duration: 520, arc: 70, scale: ps });
      await new Promise((r) => S.tweens.add({ targets: tilt, angle: -14, duration: 200, onComplete: r }));
      const stream = S.track(S.add.graphics().setDepth(D.fx));
      const to = halves ? pan.poured + 1 : 2;
      const from = pan.poured;
      const st = (v) => (v >= 2 ? "full" : v >= 1 ? "half" : "empty");
      await new Promise((r) =>
        S.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 700 * (to - from),
          onUpdate: (tw) => {
            const u = tw.getValue();
            stream.clear();
            stream.lineStyle(13, 0x6e3a17, 0.35);
            stream.lineBetween(tilt.x, tilt.y + 2, w.x, w.y);
            stream.lineStyle(9, COL.glass, 1);
            stream.lineBetween(tilt.x, tilt.y + 2, w.x, w.y);
            stream.fillStyle(0xe8b988, 0.9);
            stream.fillCircle(w.x, w.y, 7 + 3 * Math.sin(u * 40));
            const v = from + (to - from) * u;
            // the glass fills: empty → half → full cross-fade
            const a = Math.floor(v);
            const f = v - a;
            ["empty", "half", "full"].forEach((s2, j) => w.glass[s2].setAlpha(j === a ? 1 - f * (j < 2 ? 1 : 0) : j === a + 1 ? f : 0));
            if (v >= 2) w.glass.full.setAlpha(1);
          },
          onComplete: r,
        })
      );
      stream.destroy();
      ["empty", "half", "full"].forEach((s2) => w.glass[s2].setAlpha(s2 === st(to) ? 1 : 0));
      pan.poured = to;
      w.fill = to;
      S.wisps(w.x, w.y - 20, 2, 40);
      Cook.sfx.pop();
      await new Promise((r) => S.tweens.add({ targets: tilt, angle: 0, duration: 160, onComplete: r }));
      await S.fly(tilt, pan.x, pan.y, { duration: 420, arc: 50, scale: ps * 0.9 });
      tilt.destroy();
      pan.img.setAlpha(1);
      if (pan.img.shadow) pan.img.shadow.setVisible(true);
      Object.values(pan.layers).forEach((im) => im.setVisible(true));
      pan.water.setVisible(true);
      pan.bubbles.setVisible(true);
      pan.level = pan.poured >= 2 ? 0 : pan.level * 0.6;
      setLook(pan);
      closeSpoons(pan);
      if (pan.poured >= 2 || !halves) closePan(pan);
      if (pan.poured >= 2) setKnob(pan, "off"); // the pan's empty: the fire goes off
      busy--;
      if (!doneShown && pans.every((q) => q.poured > 0)) {
        doneShown = true;
        UI.done().then(() => finishUp());
      }
      refresh();
    };

    /* ---------- people speak ---------- */
    const L = () => ladderOf(ctx, people);
    const faceImg = () => document.querySelector("#nani-card .nc-face");
    async function personSay(pan, rows) {
      const img = faceImg();
      const prev = img ? img.getAttribute("src") : null;
      if (img) img.src = Cook.v(`assets/cook/characters/${pan.who}-badge.webp`);
      const y0 = pan.face.y;
      const bob = S.tweens.add({ targets: pan.face, y: y0 - 8, duration: 200, yoyo: true, repeat: -1 });
      try {
        const said = UI.mission.sayPerson ? await UI.mission.sayPerson(pan.who, rows) : false;
        if (!said) await UI.say(personLine(L(), pan.who, rows), { badge: true }, { hide: St.hideKnown(ctx) });
      } finally {
        bob.stop();
        if (pan.face.active) pan.face.y = y0;
        UI.hideBubble();
        if (img && prev) img.src = prev;
      }
    }
    let speaking = false;
    const hear = async (pan) => {
      if (speaking) return;
      speaking = true;
      if (!guided && personRows(L(), pan.who).some(hiddenRow) && Cook.onHelp) Cook.onHelp("replay", { ids: personRows(L(), pan.who).flatMap((r) => r.ids) });
      try {
        await personSay(pan);
      } catch (e) {
        if (!(e instanceof Cook.Abort)) throw e;
      } finally {
        speaking = false;
      }
    };

    /* ---------- what's next (the tester, Nani's glow, the focal rule) ---------- */
    const at = (o) => {
      const c = S.centre(o);
      return { x: c.x, y: c.y };
    };
    const tapOn = (o, key, extra = {}) => Object.assign({ kind: "tap" }, at(o), { key }, extra);
    const want = (pan) => {
      const p = pan.p;
      if (!pan.has.water) return "cook-paani";
      if (!pan.has.leaves) return "cook-chai";
      if (p.dudh && !pan.has.milk) return "cook-dudh";
      if (pan.sugar < (p.khun || 0)) return "cook-khun";
      if (p.extra && !pan.extras.includes(p.extra) && shelf[p.extra]) return p.extra;
      return null;
    };
    const GENERIC = new Set(["cook-paani", "cook-chai"]);
    function plan() {
      if (!talked || finished) return null;
      // 1. a heating pan near the green comes first (turn it down in time)
      const hot = pans.filter((q) => q.state === "heating").sort((a, b) => b.heat - a.heat)[0];
      if (hot && hot.heat >= lo - 0.14) return { e: { kind: "timing", x: hot.knobHit.x, y: hot.knobHit.y, key: `knob-${hot.who}` }, obj: hot.knob, gauge: hot, focal: true, phase: "knob" };
      // 2. a ready pan pours into its glass
      for (const q of pans) {
        const need = halves ? (q.p.amount === "ph-half" ? 1 : 2) : 2;
        if (q.state === "ready" && q.poured < need) return { e: tapOn(q.img, `pour-${q.who}`), obj: q.img, focal: true, phase: "pour" };
      }
      // 3. a pan still to fill: choose it, fill it, light it
      for (const q of pans) {
        if (q.state !== "cold") continue;
        const id = want(q);
        if (sel !== q) return { e: tapOn(q.img, `pan-${q.who}`), obj: q.face, focal: false, phase: id ? (q.has.water ? "cups" : "water") : "knob" };
        if (id) {
          const e = tapOn(shelf[id], id, { n: id === "cook-khun" ? q.sugar : undefined });
          if (id === "cook-khun") {
            e.wrongs = shelf["spi-16"] ? [at(shelf["spi-16"])] : [];
            if (ctx.lab && q === pans[pans.length - 1]) e.mistake = true; // the lab always tries the salt once
          }
          return { e, obj: shelf[id], focal: GENERIC.has(id), phase: id === "cook-paani" ? "water" : id === "cook-chai" ? "tea" : "cups" };
        }
        return { e: { kind: "tap", x: q.knobHit.x, y: q.knobHit.y, key: `knob-on-${q.who}` }, obj: q.knob, focal: true, phase: "knob" };
      }
      // 4. waiting on the heat
      if (hot) return { e: { kind: "timing", x: hot.knobHit.x, y: hot.knobHit.y, key: `knob-${hot.who}` }, obj: null, gauge: hot, focal: false, phase: "knob" };
      if (doneShown) return { e: { kind: "click", selector: "#done-btn" }, obj: null, phase: "pour" };
      return { e: { kind: "wait" }, obj: null, phase: "pour" };
    }
    const unglow = () => {
      if (glowing) S.glow(glowing, false);
      glowing = null;
    };
    let gaugePan = null;
    function refresh() {
      if (finished) return;
      if (busy) {
        zb.expect({ kind: "wait" }); // a pour in progress: the player waits for it
        return;
      }
      const nx = plan();
      gaugePan = nx && nx.gauge ? nx.gauge : null;
      if (gaugePan) zb.gauge({ level: gaugePan.heat, lo, hi });
      zb.expect(nx ? nx.e : null);
      if (nx && nx.phase) phase(nx.phase);
      // the focal rule: the next generic step pulses (a person's choice only when Nani helps)
      const obj = nx && nx.obj && (nx.focal || guided) ? nx.obj : null;
      if (glowing !== obj) {
        unglow();
        if (obj) S.glow(obj, true, { bounce: !!obj.isJar });
        glowing = obj;
      }
      // inactive shelf things step back about 10%
      const focusShelf = obj && obj.isJar;
      Object.values(shelf).forEach((o) => o.active && !o.glowFx && !o.flying && o.setAlpha(focusShelf && o !== obj ? 0.86 : 1));
      if (guided) UI.glowDone(!!nx && nx.e.kind === "click");
      // serving: once every pan is poured the hob steps back and the tray is the focus
      const served = pans.every((q) => q.poured > 0);
      [hob, ...pans.flatMap((q) => [q.img, q.face, q.knob])].forEach((o) => o.setAlpha(served ? 0.88 : 1));
    }

    /* ---------- the start: everyone says how they like it ---------- */
    ctx.nextStep && ctx.nextStep("Water");
    phase("water");
    select(pans[0]);
    for (const pan of pans) {
      speaking = true;
      await personSay(pan);
      speaking = false;
      await Cook.wait(K.speakGapMs || 300);
    }
    talked = true;
    refresh();
    const nudge = setInterval(() => !finished && refresh(), 250);

    /* ---------- the tick: check every glass against what its person said ---------- */
    await doneP;
    finished = true;
    clearInterval(nudge);
    stopHeat();
    unglow();
    UI.hideDone();
    UI.hideCount();
    zb.expect(null);
    [...pans.flatMap((q) => [q.img, q.face, q.knobHit]), ...Object.values(shelf)].forEach((o) => S.untap(o));
    Object.values(shelf).forEach((o) => o.chip && o.chip.disableInteractive());
    const lad = L();
    const dish = dishNo();
    const recasts = [];
    for (const pan of pans) {
      const p = pan.p;
      const name = nameOf(pan.who);
      const made = pan.has.water > 0 && pan.has.leaves > 0 && pan.poured > 0;
      const hasMilk = pan.has.milk > 0;
      const got = { chai: made, milk: hasMilk === !!p.dudh, sugar: pan.sugar === (p.khun || 0) && !pan.salt };
      got.extra = p.extra ? pan.extras.includes(p.extra) : true;
      const amount = !p.amount ? null : pan.poured >= 2 ? "ph-full" : "ph-half";
      got.amount = !p.amount || (got.chai && amount === p.amount);
      const why = [];
      if (!pan.has.water) why.push(`left out cook-paani for ${name}`);
      if (!pan.has.leaves) why.push(`left out cook-chai for ${name}`);
      if (!pan.poured) why.push(`poured no chai for ${name}`);
      if (!got.milk) why.push(p.dudh ? `left out cook-dudh for ${name}` : `added cook-dudh (they said no) for ${name}`);
      if (pan.sugar !== (p.khun || 0)) why.push(p.khun ? `${pan.sugar} cook-khun, they asked for ${p.khun} (${name})` : `added cook-khun (they said no) for ${name}`);
      else if (p.khun) ctx.listen(true, `${pan.sugar} cook-khun, they asked for ${p.khun} (${name})`);
      if (p.extra && !pan.extras.includes(p.extra)) why.push(`left out ${p.extra} for ${name}`);
      pan.extras.filter((id) => id !== p.extra).forEach((id) => why.push(`added ${id} for ${name}`));
      if (p.amount && got.chai && amount !== p.amount) why.push(`poured ${amount} for ${name}, not ${p.amount}`);
      const rows = personRows(lad, pan.who);
      const bad = [];
      rows.forEach((r) => {
        const id = r.ids[0];
        const ok = id === "cook-dudh" ? got.milk : id === "cook-khun" ? got.sugar : id === "ph-half" || id === "ph-full" ? got.amount : got.extra;
        if (ok) {
          UI.mission.tickItem(id, dish, { for: pan.who, no: r.no });
          if (!r.no && id !== "cook-khun" && ctx.did && ctx.did.length < 14) ctx.did.push({ line: Lang.wordLine(id), ok: true });
        } else {
          UI.mission.missItem(id, dish, { for: pan.who, no: r.no });
          bad.push(r);
        }
      });
      why.forEach((w) => ctx.listen(false, w));
      if (!guided) {
        (got.milk ? Cook.markRight : Cook.markMiss)("cook-dudh");
        if (p.khun) (got.sugar ? Cook.markRight : Cook.markMiss)(Cook.numId(p.khun));
        (got.sugar ? Cook.markRight : Cook.markMiss)("cook-khun");
        if (p.extra) (got.extra ? Cook.markRight : Cook.markMiss)(p.extra);
      }
      if (why.length || pan.salt) recasts.push({ pan, rows: !got.chai || !bad.length ? null : bad });
      else S.sparkle(pan.well.x, pan.well.y);
    }
    if (recasts.length) {
      await zb.oops();
      for (const { pan, rows } of recasts) {
        select(pan);
        await personSay(pan, rows || undefined);
      }
    }
    await Cook.wait(500);
    zb.close();
    zt.close();
    return {
      served: pans.filter((q) => q.poured > 0).length,
      cups: pans.map((q) => ({ who: q.who, milk: q.has.milk > 0, sugar: q.sugar, salt: q.salt, extras: q.extras, level: q.poured / 2 })),
    };
  }

  Mech.lab("chai-tray", {
    name: "Chai tray",
    verb: "Combined: pans, knobs, pour",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.chai.make("nana", { level: L.level });
      L.ctx.steps = R.chai.steps(d);
      L.card(d, L.ctx.steps);
      await L.station("chai-tray", { cups: d.cups });
    },
  });
})(window);
