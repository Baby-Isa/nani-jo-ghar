/*
 * Combined station: the Chai tray (Wave 3; the owner's design).
 *
 * One hob screen, two zones:
 *  - BOIL (left, the hob): the chai pan on its burner. Water in (hold the
 *    jug icon: a jug slides in and pours), tea in (among look-alikes),
 *    then tap the BIG knob to light it. The ring rises on this back burner
 *    while you do the cups; tap the knob in the green to turn it down.
 *    Ignore it and it boils over (foam, and the hand star).
 *  - TRAY (right, a tray on the worktop): a cup for each person, with
 *    their face. Each person says how they like their chai, in Kutchi:
 *    milk or no milk (dudh / no dudh), how many sugars or none (khun),
 *    and at level 3 an extra (elchi, aadu) and half or full (English
 *    placeholders). Tap a cup (or its face: you hear them again), then:
 *    hold the milk jug (the icon stays put; a jug slides in over the cup),
 *    tap the sugar bowl once per spoon (salt beside it looks the same),
 *    tap an extra. Once the chai has boiled, hold the pan to pour it into
 *    each cup, up to a dashed line. The tick when you're done.
 *
 * Learning: the milk jug and the sugar bowl are there for every cup, so
 * "no dudh" and "no khun" are real decisions; nothing shows a cup's target
 * (the spoon tally is a running count only; the fill lines are the same
 * on every cup, both half and full when half/full is possible). The ear
 * star checks each person's cup against what they said; a wrong cup is a
 * recast: that person says again what they asked for ("no dudh").
 *
 * Data: the chai recipe's slots (who and what, by level) in data/cook.json;
 * this station's own settings in data/stations/chai-tray.json; the new
 * pour, the knob boil and the spoons in js/cook/mechanics/{pour,boil,count}.js.
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;

  // the drawing (design coords; both zones map 1:1 onto the screen)
  const PAN = { x: 515, y: 330, scale: 1.35 };
  const KNOB = [712, 592];
  const LEFT_ROW = [260, 420, 580]; // the left worktop: tea shelf, then extras
  const TRAY = { x: 850, y: 112, w: 720, h: 480 };
  const CUP_Y = 432;
  const FACE_Y = 205;
  const CUP_XS = { 1: [1210], 2: [1080, 1340], 3: [990, 1210, 1430] };
  const STRIP = [910, 1110, 1310]; // the tray's own strip: milk jug, sugar, salt (shuffled; clear of the tick)
  const COL = { milk: 0xf6f1e7, chai: 0x7a3a1a, water: 0x9fd3f0, tea: 0x6b3a1c };

  Mech.combined("chai-tray", {
    station: "chai-tray",
    view: "hob",
    dataFile: "data/stations/chai-tray.json",
    zones: [
      { id: "boil", mech: "boil", region: [0, 0, 820, 900], footprint: { x: 0, y: 0, w: 820, h: 900 } },
      { id: "tray", mech: "pour", region: [820, 0, 780, 900], footprint: { x: 820, y: 0, w: 780, h: 900 }, backdrop: "bg:marble" },
    ],
    run: (host, params) => tray(host, params),
  });

  /** Textures the scene doesn't preload: the family's faces, the pouring pan. */
  function ensure(S, list) {
    const missing = list.filter(([key]) => !S.textures.exists(key));
    if (!missing.length) return Promise.resolve();
    return new Promise((resolve) => {
      missing.forEach(([key, url]) => S.load.image(key, url));
      S.load.once("complete", resolve);
      S.load.start();
    });
  }
  const nameOf = (who) => (who === "nani" ? "Nani" : (Cook.data.customers[who] || {}).name || who);

  /** This dish's ladder on the mission card (or one built from the cups, e.g. no card). */
  function ladderOf(ctx, cups) {
    const Ls = UI.mission.ladders();
    const L = Ls.find((x) => x.recipe === "chai" && x.dish === (ctx.dishAt || 0)) || Ls.find((x) => x.recipe === "chai");
    return L || Cook.Order.ladder({ recipe: "chai", cups }, 0);
  }
  const personRows = (L, who) => {
    const s = L.sections.find((x) => x.for === who);
    return s ? [].concat(...s.groups) : [];
  };
  /** What a person says: "Muke chai khape." then their rows, as the card shows them. */
  const personLine = (L, who, rows) => Lang.join((L.head ? [L.head.line] : []).concat((rows || personRows(L, who)).map((r) => (r.no || !r.said ? r.line : r.said))));
  const hiddenRow = (r) => !r.done && !r.revealed && r.line.segs.some((s) => s.w && Cook.cardHidden(s.w) && Lang.wordHasVoice(s.w));

  async function tray(host, params) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const zb = host.zones.boil;
    const zt = host.zones.tray;
    const people = (params.cups || []).slice(0, 3);
    const P = Cook.Pour;
    const guided = !!ctx.guided;
    const kMilk = Mech.knobs("pour", { level: zt.level, profile: "milk" });
    const kCup = Mech.knobs("pour", { level: zt.level, profile: "cup" });
    const kCount = Mech.knobs("count", { level: zt.level });
    await ensure(S, people.map((p) => [`${p.who}-badge`, `assets/cook/characters/${p.who}-badge.webp`]).concat([["saucepan-chai", "assets/cook/props/saucepan-chai.webp"]]));
    const phase = (key) => {
      const text = ((Cook.data.stations["chai-tray"] || {}).phases || {})[key];
      Cook.save.seenStation = Cook.save.seenStation || {};
      const seenKey = `chai-tray:${key}`;
      if (text && (guided || ctx.lab || !Cook.save.seenStation[seenKey])) UI.gist(text);
      Cook.save.seenStation[seenKey] = true;
    };

    /* ---------- the tray and the cups ---------- */
    // the hob ends in a rounded edge where the worktop starts
    [[786, 80, 36, 44], [786, 624, 36, 60]].forEach(([x, y, w, h]) => S.track(S.add.image(0, 0, Cook.Art.tex(S, "bg:marble")).setOrigin(0).setCrop(x, y, w, h).setDepth(D.bg + 1.5)));
    const edge = S.track(S.add.graphics().setDepth(D.bg + 2));
    edge.fillStyle(0x2b2622, 1);
    edge.fillRoundedRect(zb.X(740), zb.Y(90), zb.L(80), zb.L(570), zb.L(30));
    edge.lineStyle(zb.L(4), 0x4a423c, 1);
    edge.beginPath();
    edge.arc(zb.X(790), zb.Y(120), zb.L(30), -Math.PI / 2, 0);
    edge.lineTo(zb.X(820), zb.Y(630));
    edge.arc(zb.X(790), zb.Y(630), zb.L(30), 0, Math.PI / 2);
    edge.strokePath();
    const tg = S.track(S.add.graphics().setDepth(D.item - 2));
    tg.fillStyle(0x3a2410, 0.18);
    tg.fillRoundedRect(TRAY.x + 10, TRAY.y + 14, TRAY.w, TRAY.h, 40);
    tg.fillStyle(0x8a5a2e, 1);
    tg.fillRoundedRect(TRAY.x, TRAY.y, TRAY.w, TRAY.h, 40);
    tg.fillStyle(0xb57f47, 1);
    tg.fillRoundedRect(TRAY.x + 18, TRAY.y + 18, TRAY.w - 36, TRAY.h - 36, 28);
    tg.lineStyle(3, 0x6b4221, 0.35);
    for (let i = 1; i < 6; i++) tg.lineBetween(TRAY.x + 30, TRAY.y + 18 + (i * (TRAY.h - 36)) / 6, TRAY.x + TRAY.w - 30, TRAY.y + 18 + (i * (TRAY.h - 36)) / 6);
    const selG = S.track(S.add.graphics().setDepth(D.item - 1));
    const xs = CUP_XS[Math.max(1, Math.min(3, people.length))] || CUP_XS[1];
    // who sits where changes every order
    const seats = Cook.shuffle(people.map((p, i) => i));
    const cups = people.map((p, i) => {
      const x = xs[seats[i]];
      const vessel = St.vessel(S, "cup", zt.X(x), zt.Y(CUP_Y), 1.35 * zt.k);
      const face = S.flat(`${p.who}-badge`, zt.X(x), zt.Y(FACE_Y), zt.L(150), zt.L(140), { depth: D.item + 1 });
      const chip = S.track(S.add.container(zt.X(x + 78), zt.Y(CUP_Y + 100)).setDepth(D.fx + 1).setVisible(false));
      const chipBg = S.add.circle(0, 0, zt.L(24), 0xfffaf1, 1).setStrokeStyle(zt.L(3), 0x8f9398);
      const chipT = S.add.text(0, 0, "0", { fontFamily: "Nunito, sans-serif", fontSize: `${Math.round(zt.L(30))}px`, fontStyle: "bold", color: "#2d2018" }).setOrigin(0.5);
      chip.add([chipBg, chipT]);
      const bits = S.track(S.add.graphics().setDepth(D.item + 0.5));
      return { i, p, who: p.who, x, vessel, face, chip, chipT, bits, vol: { milk: 0, chai: 0 }, sugar: 0, salt: 0, extras: [], chaiPours: 0 };
    });
    cups.sort((a, b) => a.x - b.x);
    let sel = null;
    const select = (c) => {
      sel = c;
      selG.clear();
      if (!c) return;
      selG.fillStyle(0xfff3c4, 0.28);
      selG.lineStyle(zt.L(6), 0xfff3c4, 1);
      selG.fillRoundedRect(zt.X(c.x - 105), zt.Y(FACE_Y - 82), zt.L(210), zt.L(CUP_Y + 132 - FACE_Y + 82), zt.L(26));
      selG.strokeRoundedRect(zt.X(c.x - 105), zt.Y(FACE_Y - 82), zt.L(210), zt.L(CUP_Y + 132 - FACE_Y + 82), zt.L(26));
      Cook.sfx.click();
      if (c.sugar) UI.count(c.sugar, { speak: false });
      else UI.hideCount();
      refresh();
    };
    const level = (c) => c.vol.milk + c.vol.chai;
    const mixCol = (m, t) => {
      if (m + t <= 0.001) return COL.milk;
      const f = t / (m + t);
      const a = Phaser.Display.Color.ValueToColor(COL.milk);
      const b = Phaser.Display.Color.ValueToColor(COL.chai);
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(a, b, 100, Math.round(Math.min(1, f * f) * 100));
      return Phaser.Display.Color.GetColor(c.r, c.g, c.b);
    };
    const drawBits = (c) => {
      c.bits.clear();
      if (!c.extras.length && !c.salt) return;
      const p = P.surfaceAt(c.vessel, Math.max(0.12, level(c)));
      c.extras.concat(c.salt ? ["spi-16"] : []).forEach((id, j) => {
        c.bits.fillStyle(St.heapColor(id), 1);
        for (let q = 0; q < 3; q++) c.bits.fillEllipse(p.x - p.rx * 0.5 + (j * 3 + q) * p.rx * 0.16, p.y + ((q % 2) - 0.5) * p.ry * 0.5, zt.L(12), zt.L(8));
      });
    };

    /* ---------- the left worktop and the pan ---------- */
    const pan = St.vessel(S, "pan", zb.X(PAN.x), zb.Y(PAN.y), PAN.scale * zb.k);
    const waterJug = S.prop("water-jug", zb.X(110), zb.Y(St.STRIP_Y + 60), zb.L(150), zb.L(190), { depth: D.item + 1 });
    waterJug.label = S.label(waterJug, "cook-paani");
    const teaIds = Cook.shuffle(["cook-chai"].concat(K.teaDecoys || []));
    const teaShelf = {};
    teaIds.forEach((id, i) => (teaShelf[id] = S.ingredient(id, zb.X(LEFT_ROW[i]), zb.Y(St.STRIP_Y - 10), { w: zb.L(140), h: zb.L(108) })));
    const fade = (objs) =>
      objs.forEach((o) => {
        if (!o || !o.active) return;
        S.untap(o);
        if (o.label) o.label.destroy();
        if (o.shadow) o.shadow.destroy();
        S.tweens.add({ targets: o, alpha: 0, duration: 300, onComplete: () => o.destroy() });
      });

    /* ---------- the tray's strip: milk jug, sugar, its look-alikes ---------- */
    const stripIds = Cook.shuffle(["jug", "cook-khun"].concat(K.decoys || []).slice(0, STRIP.length));
    const shelf = {};
    let milkJug = null;
    stripIds.forEach((id, i) => {
      if (id === "jug") {
        milkJug = S.prop("milk-jug", zt.X(STRIP[i]), zt.Y(St.STRIP_Y + 60), zt.L(160), zt.L(170), { depth: D.item + 1 });
        milkJug.label = S.label(milkJug, "cook-dudh");
      } else shelf[id] = S.ingredient(id, zt.X(STRIP[i]), zt.Y(St.STRIP_Y - 10), { w: zt.L(150), h: zt.L(115) });
    });
    const sugar = shelf["cook-khun"];
    const decoys = Object.keys(shelf).filter((id) => id !== "cook-khun");

    /* ---------- the expectation (what to do next, for the tester and Nani's glow) ---------- */
    let finishUp;
    const doneP = new Promise((resolve) => (finishUp = resolve));
    let talked = false;
    let boiled = false;
    let pouring = false;
    let finished = false;
    let extrasShelf = {};
    let glowing = null;
    const want = (c) => ({
      milk: c.p.dudh && c.vol.milk < 0.02,
      sugar: c.sugar < (c.p.khun || 0),
      extra: c.p.extra && !c.extras.includes(c.p.extra) && extrasShelf[c.p.extra] ? c.p.extra : null,
    });
    const milkBand = (c) => {
      const base = level(c) > 0.02 ? level(c) : 0;
      const at = Math.min(0.98, base + K.lines.milk);
      return { at, lo: at - K.milkTolerance, hi: at + K.milkTolerance };
    };
    const chaiLines = () => (K.halfLine ? [K.lines.half, K.lines.full] : [K.lines.full]);
    const askedLine = (c) => (c.p.amount === "ph-half" ? K.lines.half : K.lines.full);
    const cupTap = (c, key) => {
      const o = S.centre(c.vessel);
      return { kind: "tap", x: o.x, y: o.y, key, wrongs: cups.filter((d) => d !== c).map((d) => S.centre(d.vessel)) };
    };
    function plan() {
      if (!talked || finished) return null;
      for (const c of cups) {
        const w = want(c);
        if (!w.milk && !w.sugar && !w.extra) continue;
        if (sel !== c) return { e: cupTap(c, `cup-${c.who}`), obj: c.vessel };
        if (w.milk) {
          const b = milkBand(c);
          const o = S.centre(milkJug);
          return { e: { kind: "hold", x: o.x, y: o.y, key: "cook-dudh" }, gauge: { level: level(c), lo: b.lo, hi: b.hi }, obj: milkJug };
        }
        if (w.sugar) {
          const o = S.centre(sugar);
          const e = { kind: "tap", x: o.x, y: o.y, key: "cook-khun", n: c.sugar, wrongs: decoys.map((id) => S.centre(shelf[id])) };
          if (ctx.lab && c === cups[cups.length - 1]) e.mistake = true; // the lab always tries the salt once
          return { e, obj: sugar };
        }
        const o = S.centre(extrasShelf[w.extra]);
        return { e: { kind: "tap", x: o.x, y: o.y, key: w.extra, n: c.extras.length, wrongs: Object.keys(extrasShelf).filter((id) => id !== w.extra).map((id) => S.centre(extrasShelf[id])) }, obj: extrasShelf[w.extra] };
      }
      if (!boiled) return null;
      for (const c of cups) {
        // (a cup already brimming with milk can't take chai: nothing left to do there)
        if (c.chaiPours || level(c) >= askedLine(c) - K.tolerance) continue;
        if (sel !== c) return { e: cupTap(c, `pour-${c.who}`), obj: c.vessel };
        const at = askedLine(c);
        const o = S.centre(pan);
        return { e: { kind: "hold", x: o.x, y: o.y, key: "pan" }, gauge: { level: level(c), lo: at - K.tolerance, hi: at + K.tolerance }, obj: pan };
      }
      return { e: { kind: "click", selector: "#done-btn" }, obj: null };
    }
    function refresh() {
      if (pouring) return;
      const n = plan();
      zt.expect(n ? n.e : null);
      if (n && n.gauge) zt.gauge(n.gauge);
      if (guided) {
        const obj = n && n.obj;
        if (glowing !== obj) {
          if (glowing) S.glow(glowing, false);
          if (obj) S.glow(obj, true);
          glowing = obj;
        }
        UI.glowDone(!!n && !n.obj);
      }
    }
    // mid-pour the tray keeps saying "hold" (so its gauge, not the boil's, is the one that counts)
    const holding = (obj) => {
      const o = S.centre(obj);
      zt.expect({ kind: "hold", x: o.x, y: o.y, key: obj === pan ? "pan" : "cook-dudh" });
    };
    // guided glow sits on the thing to tap; clear it before anything else glows it
    const unglow = () => {
      if (glowing) S.glow(glowing, false);
      glowing = null;
    };

    /* ---------- people speak ---------- */
    const L = () => ladderOf(ctx, people);
    const faceImg = () => document.querySelector("#nani-card .nc-face");
    async function personSay(c, rows) {
      const img = faceImg();
      const prev = img ? img.getAttribute("src") : null;
      if (img) img.src = `assets/cook/characters/${c.who}-badge.webp`;
      const bob = S.tweens.add({ targets: c.face, y: c.face.y - zt.L(8), duration: 200, yoyo: true, repeat: -1 });
      const y0 = c.face.y;
      try {
        await UI.say(personLine(L(), c.who, rows), { badge: true }, { hide: St.hideKnown(ctx) });
      } finally {
        bob.stop();
        if (c.face.active) c.face.y = y0;
        UI.hideBubble();
        if (img && prev) img.src = prev;
      }
    }
    let speaking = false;
    const hear = async (c) => {
      if (speaking) return;
      speaking = true;
      // hearing them again once their words are dots on the card is help (the no-help star)
      if (!guided && personRows(L(), c.who).some(hiddenRow) && Cook.onHelp) Cook.onHelp("replay", { ids: personRows(L(), c.who).flatMap((r) => r.ids) });
      try {
        await personSay(c);
      } catch (e) {
        if (!(e instanceof Cook.Abort)) throw e;
      } finally {
        speaking = false;
      }
    };

    /* ---------- the actions ---------- */
    const armCups = () =>
      cups.forEach((c) => {
        S.tappable(c.vessel, () => !pouring && !finished && select(c));
        S.tappable(c.face, () => {
          if (pouring || finished) return;
          if (sel !== c) select(c);
          hear(c);
        });
      });
    const spoon = (from, id) => {
      const c = sel;
      if (!c || finished) return;
      if (id === "cook-khun") {
        if (c.sugar >= K.tallyMax) return;
        c.sugar++;
        c.chipT.setText(String(c.sugar));
        c.chip.setVisible(true);
        UI.count(c.sugar);
        Cook.sfx.pop();
      } else {
        // a look-alike: salt in someone's chai
        c.salt++;
        Cook.sfx.soft();
        zt.listen(false, `added ${id}, not cook-khun, for ${nameOf(c.who)}`);
        zt.oops();
      }
      Cook.Spoon.spoon(zt, { bowl: from, into: c.vessel, word: id, ms: kCount.spoonMs }).then(() => drawBits(c));
      refresh();
    };
    const armBowls = () => {
      S.tappable(sugar, () => !pouring && spoon(sugar, "cook-khun"));
      decoys.forEach((id) => S.tappable(shelf[id], () => !pouring && spoon(shelf[id], id)));
    };
    const armExtras = () =>
      Object.entries(extrasShelf).forEach(([id, obj]) =>
        S.tappable(obj, () => {
          const c = sel;
          if (!c || pouring || finished) return;
          if (!c.extras.includes(id)) c.extras.push(id);
          Cook.sfx.pop();
          Cook.Spoon.spoon(zt, { bowl: obj, into: c.vessel, word: id, ms: kCount.spoonMs }).then(() => drawBits(c));
          refresh();
        })
      );
    // the gauge only (the plan posts the expectation)
    const gaugeIO = { expect: () => {}, gauge: (g) => zt.gauge(g) };
    const armMilk = () => {
      if (finished) return;
      let marks = null;
      let band = null;
      P.hold(zt, {
        icon: milkJug,
        vessel: () => (sel && !finished ? sel.vessel : null),
        art: "milk-jug",
        artSize: zt.L(190),
        color: (lv) => mixCol(lv - sel.vol.chai, sel.vol.chai),
        rate: kMilk.rate,
        stick: kMilk.auto ? [K.lines.milk] : [],
        stickMs: kMilk.stickMs,
        slideMs: kMilk.slideMs,
        minPour: kMilk.minPour,
        io: gaugeIO,
        expect: false,
        onStart: () => {
          pouring = true;
          unglow();
          holding(milkJug);
          band = milkBand(sel);
          marks = P.lines(S, sel.vessel, [{ at: band.at, strong: true }]);
          zt.gauge({ level: level(sel), lo: band.lo, hi: band.hi });
        },
        onLevel: (lv) => {
          sel.vol.milk = lv - sel.vol.chai;
          drawBits(sel);
          zt.gauge({ level: lv, lo: band.lo, hi: band.hi });
        },
        enough: { lo: 1.5, say: false },
        onCancel: (v) => {
          pouring = false;
          if (marks) marks.destroy();
          const c = cups.find((x) => x.vessel === v);
          if (c) c.vol.milk = Math.max(0, v.level - c.vol.chai);
          refresh();
        },
      }).then((r) => {
        pouring = false;
        if (marks) marks.destroy();
        const c = cups.find((x) => x.vessel === r.vessel);
        if (c) {
          c.vol.milk = r.level - c.vol.chai;
          const sc = P.score(S, r.level, band.lo, band.hi, kMilk, r.vessel.spilled);
          zt.skill(sc, "pour");
          S.verdict(c.vessel.rim.x, c.vessel.rim.y - zt.L(150), sc, { bad: r.level < band.lo ? "too-little" : "too-much" });
        }
        armMilk();
        refresh();
      });
    };
    const armPan = () => {
      if (finished) return;
      let marks = null;
      let c = null;
      const lines = chaiLines();
      // "Enough!" at the asked line only while that word is new (it's the answer)
      const enough = { lo: 2, say: false };
      P.hold(zt, {
        icon: pan,
        vessel: () => (sel && !finished ? sel.vessel : null),
        art: "saucepan-chai",
        artSize: zt.L(230),
        color: (lv) => mixCol(sel.vol.milk, Math.max(0, lv - sel.vol.milk)),
        rate: kCup.rate,
        stick: kCup.auto || kCup.instant ? lines : [],
        stickMs: kCup.stickMs,
        slideMs: kCup.slideMs,
        minPour: kCup.minPour,
        io: gaugeIO,
        expect: false,
        onStart: () => {
          pouring = true;
          unglow();
          holding(pan);
          c = sel;
          marks = P.lines(S, c.vessel, lines.map((at) => ({ at, strong: true })));
          const at = askedLine(c);
          enough.lo = at - K.tolerance;
          enough.say = guided || Cook.wordStage(c.p.amount || "cook-chai") <= kCup.enoughUntilStage;
          zt.gauge({ level: level(c), lo: at - K.tolerance, hi: at + K.tolerance });
        },
        onLevel: (lv) => {
          c.vol.chai = lv - c.vol.milk;
          drawBits(c);
          const at = askedLine(c);
          zt.gauge({ level: lv, lo: at - K.tolerance, hi: at + K.tolerance });
        },
        enough,
        onCancel: () => {
          pouring = false;
          if (marks) marks.destroy();
          if (c) c.vol.chai = Math.max(0, c.vessel.level - c.vol.milk);
          refresh();
        },
      }).then((r) => {
        pouring = false;
        if (marks) marks.destroy();
        c.vol.chai = r.level - c.vol.milk;
        c.chaiPours++;
        // the hand star: on a line (whichever you aimed for; the ear star checks which)
        const near = lines.reduce((a, b) => (Math.abs(b - r.level) < Math.abs(a - r.level) ? b : a));
        const sc = P.score(S, r.level, near - K.tolerance, near + K.tolerance, kCup, r.vessel.spilled);
        zt.skill(sc, "pour");
        S.verdict(c.vessel.rim.x, c.vessel.rim.y - zt.L(150), sc, { bad: r.level < near - K.tolerance ? "too-little" : "too-much" });
        S.steam(c.vessel.rim.x, c.vessel.rim.y - zt.L(30), 2);
        armPan();
        refresh();
      });
    };

    /* ---------- 1. water, 2. tea, 3. light the burner ---------- */
    ctx.nextStep && ctx.nextStep("Water");
    phase("water");
    await Mech.run("pour", zb, { vessel: pan, liquid: "cook-paani", color: COL.water, target: K.water, icon: waterJug, speak: true });
    fade([waterJug]);
    ctx.nextStep && ctx.nextStep("Tea");
    phase("tea");
    await Mech.run("add", zb, { items: teaShelf, expected: "cook-chai", into: pan });
    pan.setLiquid(pan.level, COL.tea);
    fade(Object.values(teaShelf));
    ctx.nextStep && ctx.nextStep("Boil");
    phase("knob");
    let lit;
    const litP = new Promise((r) => (lit = r));
    let allSaid;
    const saidP = new Promise((r) => (allSaid = r));
    const boilP = Mech.run("boil", zb, {
      vessel: pan,
      knobAt: KNOB,
      needOn: true,
      profile: "tray",
      level: K.boilLevel,
      quiet: 0.12,
      canPost: () => !pouring && talked,
      onLit: () => lit(),
      ready: saidP,
    }).then((v) => {
      boiled = true;
      unglow();
      ctx.nextStep && ctx.nextStep("Pour");
      phase("pour");
      armPan();
      UI.done().then(() => finishUp());
      refresh();
      return v;
    });
    await litP;

    /* ---------- 4. the cups: each person says how they like it ---------- */
    ctx.nextStep && ctx.nextStep("Cups");
    const extraIds = K.showExtras || people.some((p) => p.extra) ? Cook.shuffle((K.extras || []).slice()) : [];
    extraIds.forEach((id, i) => (extrasShelf[id] = S.ingredient(id, zb.X(LEFT_ROW[i]), zb.Y(St.STRIP_Y - 10), { w: zb.L(140), h: zb.L(108) })));
    armCups();
    armBowls();
    armExtras();
    armMilk();
    select(cups[0]);
    for (const c of cups) {
      speaking = true;
      await personSay(c);
      speaking = false;
      await Cook.wait(K.speakGapMs);
    }
    talked = true;
    allSaid();
    phase("cups");
    refresh();
    // the boil reminds you when it needs you (its knob glows in the green)
    const nudge = setInterval(() => !finished && !pouring && refresh(), 700);

    /* ---------- 5. the tick: check every cup against what its person said ---------- */
    await doneP;
    await boilP;
    finished = true;
    clearInterval(nudge);
    unglow();
    UI.hideDone();
    UI.hideCount();
    zt.expect(null);
    [...cups.flatMap((c) => [c.vessel, c.face]), milkJug, pan, sugar, ...decoys.map((id) => shelf[id]), ...Object.values(extrasShelf)].forEach((o) => S.untap(o));
    const lad = L();
    const dish = ctx.dishAt || 0;
    const recasts = [];
    for (const c of cups) {
      const p = c.p;
      const name = nameOf(c.who);
      const lv = level(c);
      const hasMilk = c.vol.milk > 0.02;
      const got = { chai: c.chaiPours > 0, milk: hasMilk === !!p.dudh, sugar: c.sugar === (p.khun || 0) && !c.salt };
      // (an extra nobody asked for is its own mistake below; it has no row of its own)
      got.extra = p.extra ? c.extras.includes(p.extra) : true;
      const amount = !p.amount ? null : Math.abs(lv - K.lines.half) < Math.abs(lv - K.lines.full) ? "ph-half" : "ph-full";
      got.amount = !p.amount || (got.chai && amount === p.amount);
      const why = [];
      if (!got.chai) why.push(`left out cook-chai for ${name}`);
      if (!got.milk) why.push(p.dudh ? `left out cook-dudh for ${name}` : `added cook-dudh (they said no) for ${name}`);
      if (c.sugar !== (p.khun || 0)) why.push(p.khun ? `${c.sugar} cook-khun, they asked for ${p.khun} (${name})` : `added cook-khun (they said no) for ${name}`);
      else if (p.khun) ctx.listen(true, `${c.sugar} cook-khun, they asked for ${p.khun} (${name})`);
      if (p.extra && !c.extras.includes(p.extra)) why.push(`left out ${p.extra} for ${name}`);
      c.extras.filter((id) => id !== p.extra).forEach((id) => why.push(`added ${id} for ${name}`));
      if (p.amount && got.chai && amount !== p.amount) why.push(`poured ${amount} for ${name}, not ${p.amount}`);
      // the card: each of their rows ticked or marked
      const rows = personRows(lad, c.who);
      const bad = [];
      rows.forEach((r) => {
        const id = r.ids[0];
        const ok = id === "cook-dudh" ? got.milk : id === "cook-khun" ? got.sugar : id === "ph-half" || id === "ph-full" ? got.amount : got.extra;
        if (ok) UI.mission.tickItem(id, dish, { for: c.who, no: r.no });
        else {
          UI.mission.missItem(id, dish, { for: c.who, no: r.no });
          bad.push(r);
        }
      });
      why.forEach((w) => ctx.listen(false, w));
      // what the words taught
      if (!guided) {
        (got.milk ? Cook.markRight : Cook.markMiss)("cook-dudh");
        if (p.khun) (got.sugar ? Cook.markRight : Cook.markMiss)(Cook.numId(p.khun));
        (got.sugar ? Cook.markRight : Cook.markMiss)("cook-khun");
        if (p.extra) (got.extra ? Cook.markRight : Cook.markMiss)(p.extra);
      }
      if (why.length || c.salt) recasts.push({ c, rows: !got.chai || !bad.length ? null : bad });
      else S.sparkle(c.face.x, c.face.y);
    }
    // a wrong cup is a recast: that person says again what they asked for
    if (recasts.length) {
      await zt.oops();
      for (const { c, rows } of recasts) {
        select(c);
        await personSay(c, rows || undefined);
      }
      selG.clear();
    }
    await Cook.wait(500);
    zb.close();
    zt.close();
    return { served: cups.filter((c) => c.chaiPours > 0).length, cups: cups.map((c) => ({ who: c.who, milk: c.vol.milk > 0.02, sugar: c.sugar, salt: c.salt, extras: c.extras, level: level(c) })) };
  }

  Mech.lab("chai-tray", {
    name: "Chai tray",
    verb: "Combined: cups, knob, pour",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.chai.make("nana", { level: L.level });
      L.ctx.steps = R.chai.steps(d);
      L.card(d, L.ctx.steps);
      await L.station("chai-tray", { cups: d.cups });
    },
  });
})(window);
