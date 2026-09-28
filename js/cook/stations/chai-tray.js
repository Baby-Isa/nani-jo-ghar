/*
 * Combined station: the Chai tray (Wave 3; the owner's design).
 *
 * One screen, two zones (28 Sept, docs/cook-ui-feedback-2026-09-28.md s8): the hob
 * (about 5/8 of the width) and the round chai tray (3/8) side by side along
 * the top, level top and bottom; below them one strip of the pantry's
 * front-on jars standing on the counter edge (nothing overlaps the hob).
 *  - BOIL (the hob, painted from bg:hob): the chai pan on its burner. Water in
 *    (tap the water bottle: it tilts over the pot, a stream pours and the
 *    water rises), tea in (among look-alike jars: a puff, a stir, and it turns
 *    to light chai), then tap the knob to light it (the painted knob and flame
 *    ring). The chai steams and darkens while you do the glasses, and rolls
 *    near the boil; tap the knob in the green to turn it down. Ignore it and
 *    it boils over (foam, and the hand star).
 *  - TRAY (the real chai tray, sources/art/chatgpt-batch3/tray-chai-t-v2.png):
 *    a chai glass for each person, their small round face on the rim beside
 *    it. Each person says how they like their chai, in Kutchi:
 *    milk or no milk (dudh / no dudh), how many sugars or none (khun),
 *    which chai (plain, elchi or aadu: from level 1) and at level 4 half
 *    or full. Tap a glass (or its face: you hear them again), then:
 *    tap the milk carton (it tilts over the glass and pours one measure),
 *    tap the sugar jar once per spoon (salt beside it looks the same), tap
 *    an extra. Once the chai has boiled, tap the pan to pour into each glass:
 *    one tap to half, a second to full. No fill lines (s8). The tick when
 *    you're done.
 *
 * Wave 6b (docs/UX-PRINCIPLES.md 12): every liquid is a tap, like every
 * ingredient (Cook.Pour.measure): pouring is counting, the same gesture at
 * every level. A tap can't miss a line, so the pours have no hand score:
 * the tray's hand star is the knob alone. A cup's rows tick when that cup
 * is finished (its chai poured to the top), right or not (UX 11); the
 * cups are judged at the tick and in the end review.
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

  // the drawing (design coords; both zones map 1:1 onto the screen). 28 Sept (s8): the hob
  // and the chai tray side by side along the top, level top and bottom (the hob about 5/8 of
  // the width, the tray 3/8); below them one clean strip of front-on jars on the counter edge
  const HOB = { src: [240, 70, 1116, 668], x: 40, y: 34, h: 572 }; // the painted hob panel, cut from bg:hob
  const HK = HOB.h / HOB.src[3];
  const hobPt = (sx, sy) => ({ x: HOB.x + (sx - HOB.src[0]) * HK, y: HOB.y + (sy - HOB.src[1]) * HK });
  const BURNER = hobPt(515, 375);
  const PAN = { x: BURNER.x, y: BURNER.y - 38, scale: 1.35 * HK };
  const KNOB = [520, 500];
  const TRAY = { x: 1300, y: 322, d: 560 }; // the round chai tray (its art)
  const RIM_R = TRAY.d * 0.445; // where the face badges sit on the rim
  const GLASS_W = { 1: 176, 2: 158, 3: 140 }; // a chai glass (its art is 3:4): bigger when there are fewer
  const BADGE = 84;
  // where the glasses stand on the tray (from its centre): one; two side by side; three in a
  // triangle (two at the back, one in front). Each person's face sits on the rim beside their
  // glass, straight out from the centre (never on the top of the rim, where the tally is)
  const CUP_AT = {
    1: [[0, 20, Math.PI]],
    2: [[-92, 20], [92, 20]],
    3: [[-105, -62], [105, -62], [0, 92, 2.2]],
  };
  // the ingredient strip: seven slots along the counter edge, the jars' bases on one line
  const SLOTS = [90, 290, 490, 690, 890, 1090, 1290]; // clear of the tick, bottom right
  const JAR_BASE = 790;
  const JAR_K = 0.5; // every jar at one scale (the pantry-v2 canvases are 256 wide)
  const COL = { milk: 0xf6f1e7, chai: 0x7a3a1a, water: St.WATER, tea: 0x6b3a1c, light: 0xa8703f };
  // the pantry-v2 jars (assets/cook/items/shelf-<id>-bare-f.webp, build/cut_pantry_v2.py)
  const jarUrl = (id) => `assets/cook/items/shelf-${id}-bare-f.webp`;
  // a bottle or carton tilted over a pot or a glass: its cap is the spout
  const CAP = { spout: [0, -0.42], tilt: -115 };
  const ART = [
    ["chai-tray-top", "assets/cook/items/chai-station/tray.webp"],
    ["chai-glass", "assets/cook/items/chai-station/glass.webp"],
  ];

  Mech.combined("chai-tray", {
    station: "chai-tray",
    view: "marble",
    dataFile: "data/stations/chai-tray.json",
    zones: [
      { id: "boil", mech: "boil", region: [0, 0, 1010, 900], footprint: { x: 0, y: 0, w: 1010, h: 900 } },
      { id: "tray", mech: "pour", region: [1010, 0, 590, 900], footprint: { x: 1010, y: 0, w: 590, h: 900 } },
    ],
    run: (host, params) => tray(host, params),
  });

  /**
   * A person's small round face badge for the tray rim: their badge art on a cream disc
   * with a light ring (a canvas texture, made once).
   */
  function roundBadge(S, who) {
    const key = `${who}-badge`;
    const out = `${key}-round`;
    if (S.textures.exists(out) || !S.textures.exists(key)) return S.textures.exists(out) ? out : key;
    const src = S.textures.get(key).getSourceImage();
    const N = 192;
    const cv = S.textures.createCanvas(out, N, N);
    const g = cv.getContext();
    g.save();
    g.beginPath();
    g.arc(N / 2, N / 2, N / 2 - 6, 0, Math.PI * 2);
    g.closePath();
    const bg = g.createRadialGradient(N * 0.4, N * 0.35, 4, N / 2, N / 2, N / 2);
    bg.addColorStop(0, "#fff8ec");
    bg.addColorStop(1, "#efe2cc");
    g.fillStyle = bg;
    g.fill();
    g.clip();
    g.drawImage(src, 6, 10, N - 12, N - 12);
    g.restore();
    g.lineWidth = 7;
    g.strokeStyle = "#fffaf1";
    g.beginPath();
    g.arc(N / 2, N / 2, N / 2 - 5, 0, Math.PI * 2);
    g.stroke();
    g.lineWidth = 2;
    g.strokeStyle = "rgba(90,60,30,0.25)";
    g.beginPath();
    g.arc(N / 2, N / 2, N / 2 - 1.5, 0, Math.PI * 2);
    g.stroke();
    cv.refresh();
    return out;
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
    const jarIds = ["cook-paani", "cook-dudh", "cook-chai", "cook-khun"].concat(K.teaDecoys || [], K.decoys || [], K.extras || []);
    await Promise.race([
      Promise.all([
        St.load(S, people.map((p) => [`${p.who}-badge`, `assets/cook/characters/${p.who}-badge.webp`]).concat([["saucepan-chai", "assets/cook/props/saucepan-chai.webp"]], ART, jarIds.map((id) => [`jar-${id}`, jarUrl(id)]))),
        Cook.Art.load(S, "bg:hob"),
      ]),
      Cook.wait(4000),
    ]);
    const phase = (key) => {
      const text = ((Cook.data.stations["chai-tray"] || {}).phases || {})[key];
      Cook.save.seenStation = Cook.save.seenStation || {};
      const seenKey = `chai-tray:${key}`;
      if (UI.guideFor) UI.guideFor(seenKey); // Nani's box: what to do now, every time
      if (text && (guided || ctx.lab || !Cook.save.seenStation[seenKey])) UI.gist(text);
      Cook.save.seenStation[seenKey] = true;
    };

    /* ---------- the hob, the tray and the glasses ---------- */
    // the hob: the painted panel (bg:hob's own), turned wide and set on the marble; else a drawn one
    const hobTex = Cook.Art.tex(S, "bg:hob");
    const [sx, sy, sw, sh] = HOB.src;
    if (Cook.Art.isPainted(hobTex)) S.track(S.add.image(HOB.x - sx * HK, HOB.y - sy * HK, hobTex).setOrigin(0).setScale(HK).setCrop(sx, sy, sw, sh).setDepth(D.bg + 1.5));
    else {
      const hg = S.track(S.add.graphics().setDepth(D.bg + 1.5));
      hg.fillStyle(0x2b2622, 1);
      hg.fillRoundedRect(HOB.x, HOB.y, sw * HK, HOB.h, 26);
    }
    // the tray: the real chai tray, round, with a soft shadow
    const trayImg = S.track(S.add.image(zt.X(TRAY.x), zt.Y(TRAY.y), "chai-tray-top").setDepth(D.item - 2));
    trayImg.setDisplaySize(zt.L(TRAY.d), zt.L(TRAY.d));
    trayImg.shadow = S.contactShadow(trayImg);
    const selG = S.track(S.add.graphics().setDepth(D.item - 1));
    const nGlass = Math.max(1, Math.min(3, people.length));
    const spots = CUP_AT[nGlass];
    const gw = GLASS_W[nGlass];
    // a chai glass on the tray: the glass art over its chai, which rises inside it (no fill line)
    const glassVessel = (x, y, dz) => {
      const w = zt.L(gw);
      const h = (w * 4) / 3;
      // the glass, the chai over it, then the glass's reflections again on top (faint), so the
      // chai reads strongly but still sits inside the glass
      const img = S.track(S.add.image(x, y, "chai-glass").setDisplaySize(w, h).setDepth(D.item + 0.6 + dz));
      const front = S.track(S.add.image(x, y, "chai-glass").setDisplaySize(w, h).setDepth(D.item + 0.8 + dz).setAlpha(0.45));
      img.once("destroy", () => front.destroy());
      img.baseScale = img.scaleX;
      img.shadow = S.contactShadow(img, { centerX: x, centerY: y + h * 0.33, width: w * 0.95, height: w * 0.62 });
      const X0 = x - w / 2;
      const Y0 = y - h / 2;
      // the glass's inside, measured on its art (build/cut_chai_station.py): the chai's top at
      // full and its bottom, as fractions of the art
      const cx = X0 + 0.497 * w;
      const topY = Y0 + 0.235 * h;
      const botY = Y0 + 0.795 * h;
      const rt = 0.37 * w;
      const rb = 0.265 * w;
      const H = botY - topY;
      const liq = S.track(S.add.graphics().setDepth(D.item + 0.7 + dz));
      // the chai at a cup level (0..1; "full" is 0.8): its surface ellipse
      const surf = (L) => {
        const u = Cook.clamp(L / 0.86, 0, 1);
        const rx = rb + (rt - rb) * u;
        return { x: cx, y: botY - H * u, rx, ry: rx * (0.52 + 0.08 * u) };
      };
      const v = img;
      v.level = 0;
      v.color = COL.milk;
      v.rim = { x: cx, y: topY + H - H / 0.86, rx: rt, ry: rt * 0.6, depth: H / 0.86 / 0.85 };
      v.rimRx = rt;
      v.rimRy = rt * 0.6;
      v.setLiquid = (L, color) => {
        v.level = L;
        if (color != null) v.color = color;
        liq.clear();
        if (L <= 0.01) return;
        const p = surf(L);
        const b = surf(0.001);
        // the body of the chai, seen through the glass: a little darker than its top
        liq.fillStyle(St.mix(v.color, 0x2a160a, 0.18), 0.93);
        const pts = [{ x: p.x - p.rx, y: p.y }];
        for (let i = 0; i <= 16; i++) {
          const t = Math.PI - (i / 16) * Math.PI;
          pts.push({ x: b.x + Math.cos(t) * b.rx, y: b.y + Math.sin(t) * b.ry });
        }
        pts.push({ x: p.x + p.rx, y: p.y });
        for (let i = 0; i <= 16; i++) {
          const t = (i / 16) * Math.PI;
          pts.push({ x: p.x + Math.cos(t) * p.rx, y: p.y + Math.sin(t) * p.ry });
        }
        liq.fillPoints(pts, true);
        St.shade(liq, p, v.color);
      };
      v.surface = () => {
        const p = surf(Math.max(v.level, 0.1));
        return { x: p.x, y: p.y };
      };
      return v;
    };
    // who sits where changes every order
    const seats = Cook.shuffle(people.map((p, i) => i));
    const cups = people.map((p, i) => {
      const [dx, dy, at] = spots[seats[i]];
      const x = TRAY.x + dx;
      const y = TRAY.y + dy;
      const vessel = glassVessel(zt.X(x), zt.Y(y), dy * 0.0005);
      // their small round face on the tray's rim, beside their glass
      const ang = at != null ? at : Math.atan2(dy, dx);
      const fx = TRAY.x + Math.cos(ang) * RIM_R;
      const fy = TRAY.y + Math.sin(ang) * RIM_R;
      const face = S.track(S.add.image(zt.X(fx), zt.Y(fy), roundBadge(S, p.who)).setDisplaySize(zt.L(BADGE), zt.L(BADGE)).setDepth(D.item + 1));
      face.baseScale = face.scaleX;
      face.shadow = S.contactShadow(face);
      // their spoon count: a small bubble on their face badge (the count is theirs)
      const chip = S.track(S.add.container(zt.X(fx + BADGE * 0.4), zt.Y(fy + BADGE * 0.36)).setDepth(D.fx + 1).setVisible(false));
      const chipBg = S.add.circle(0, 0, zt.L(22), 0xfffaf1, 1).setStrokeStyle(zt.L(3), 0xc9a560);
      const chipT = S.add.text(0, 0, "0", { fontFamily: "Nunito, sans-serif", fontSize: `${Math.round(zt.L(28))}px`, fontStyle: "bold", color: "#2d2018" }).setOrigin(0.5);
      chip.add([chipBg, chipT]);
      const bits = S.track(S.add.graphics().setDepth(D.item + 0.75));
      return { i, p, who: p.who, x, y, fx, fy, vessel, face, chip, chipT, bits, vol: { milk: 0, chai: 0 }, sugar: 0, salt: 0, extras: [], chaiPours: 0 };
    });
    // left to right, the back one between (the order they speak and the tester fills)
    cups.sort((a, b) => a.x - b.x || a.y - b.y);
    let sel = null;
    const select = (c) => {
      sel = c;
      selG.clear();
      if (!c) return;
      // the chosen glass: a warm pool of light on the tray under it, and a gold ring round their face
      const gx = zt.X(c.x);
      const gy = zt.Y(c.y + gw * 0.46);
      for (let i = 0; i < 4; i++) {
        selG.fillStyle(0xffd98a, 0.12);
        selG.fillEllipse(gx, gy, zt.L(gw + 10 + i * 22), zt.L(gw * 0.47 + i * 12));
      }
      selG.lineStyle(zt.L(5), 0xf2c35b, 1);
      selG.strokeCircle(zt.X(c.fx), zt.Y(c.fy), zt.L(BADGE / 2 + 5));
      selG.lineStyle(zt.L(2), 0xfff3c4, 0.8);
      selG.strokeCircle(zt.X(c.fx), zt.Y(c.fy), zt.L(BADGE / 2 + 9));
      Cook.sfx.click();
      // the picture tally shows this cup's spoons (what you did for it)
      UI.hideCount();
      if (c.milkTaps) UI.count(c.milkTaps, { speak: false, id: "cook-dudh", icon: jugIcon() });
      if (c.sugar) UI.count(c.sugar, { speak: false, id: "cook-khun" });
      if (c.salt) UI.count(c.salt, { speak: false, id: "spi-16" });
      c.extras.forEach((id) => UI.count(1, { speak: false, id }));
      refresh();
    };
    const level = (c) => c.vol.milk + c.vol.chai;
    // the milk carton's picture for the tally
    const jugIcon = () => Cook.v(jarUrl("cook-dudh"));
    const mixCol = (m, t) => {
      if (m + t <= 0.001) return COL.milk;
      const f = t / (m + t);
      return St.mix(COL.milk, COL.chai, Math.min(1, Math.pow(f, 0.8)));
    };
    const drawBits = (c) => {
      c.bits.clear();
      if (!c.extras.length && !c.salt) return;
      const p = P.surfaceAt(c.vessel, Math.max(0.12, level(c)));
      c.extras.concat(c.salt ? ["spi-16"] : []).forEach((id, j) => {
        c.bits.fillStyle(St.heapColor(id), 1);
        for (let q = 0; q < 3; q++) c.bits.fillEllipse(p.x - p.rx * 0.5 + (j * 3 + q) * p.rx * 0.16, p.y + ((q % 2) - 0.5) * p.ry * 0.5, zt.L(10), zt.L(7));
      });
    };

    /* ---------- the ingredient strip: front-on jars standing on the counter edge ---------- */
    // every jar at one scale, base on one line, the same soft shadow; its label below it
    const jar = (id, slot, z = zb) => {
      const key = `jar-${id}`;
      const x = z.X(SLOTS[slot]);
      if (!S.textures.exists(key)) return S.ingredient(id, x, z.Y(JAR_BASE - 60), { w: z.L(140), h: z.L(108) }); // no jar art yet: its bowl
      const { w, h } = S.texSize(key);
      const img = S.prop(key, x, z.Y(JAR_BASE), z.L(w * JAR_K), z.L(h * JAR_K), { depth: D.item + 1, shadow: false });
      img.shadow = S.contactShadow(img, { centerX: x, centerY: z.Y(JAR_BASE - 4), width: z.L(w * JAR_K * 0.72), height: z.L(30) });
      img.wordId = id;
      img.isJar = true;
      img.label = S.label(img, id);
      if (img.label) img.label.y = z.Y(JAR_BASE + 34);
      img.setAlpha(0);
      S.tweens.add({ targets: img, alpha: 1, duration: 260 });
      return img;
    };
    const pan = St.vessel(S, "pan", zb.X(PAN.x), zb.Y(PAN.y), PAN.scale * zb.k);
    const waterJug = jar("cook-paani", 0);
    const teaIds = Cook.shuffle(["cook-chai"].concat(K.teaDecoys || [])).slice(0, 3);
    const teaShelf = {};
    teaIds.forEach((id, i) => (teaShelf[id] = jar(id, i + 1)));
    const fade = (objs) =>
      objs.forEach((o) => {
        if (!o || !o.active) return;
        S.untap(o);
        if (o.label) o.label.destroy();
        S.tweens.add({ targets: o, alpha: 0, y: o.y + zt.L(10), duration: 300, onComplete: () => o.destroy() });
      });

    // the glasses' jars on the right: the milk carton, sugar, its look-alikes
    const stripIds = Cook.shuffle(["cook-dudh", "cook-khun"].concat(K.decoys || []).slice(0, 3));
    const shelf = {};
    let milkJug = null;
    stripIds.forEach((id, i) => {
      const o = jar(id, 4 + i, zt);
      if (id === "cook-dudh") milkJug = o;
      else shelf[id] = o;
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
    // Wave 6b: both lines on every cup, at every level (the quality pass, Q5): a tap pours to the next one
    const chaiLines = () => [K.lines.half, K.lines.full];
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
          const o = S.centre(milkJug);
          return { e: { kind: "tap", x: o.x, y: o.y, key: "cook-dudh", wrongs: [S.centre(sugar)] }, obj: milkJug };
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
        // tap the pan until the cup is at the line they asked for (the full line unless they said half)
        if (level(c) >= askedLine(c) - 0.02) continue;
        if (sel !== c) return { e: cupTap(c, `pour-${c.who}`), obj: c.vessel };
        const o = S.centre(pan);
        return { e: { kind: "tap", x: o.x, y: o.y, key: "pan" }, obj: pan };
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
          // the pantry's highlight: a glow, and a small bounce for a jar (not a glass or the pan: their chai stays put)
          if (obj) S.glow(obj, true, { bounce: !!obj.isJar });
          glowing = obj;
        }
        UI.glowDone(!!n && !n.obj);
      }
    }
    // mid-pour the tray waits for the jug (a tap pours one measure by itself)
    const holding = () => zt.expect({ kind: "wait" });
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
      if (img) img.src = Cook.v(`assets/cook/characters/${c.who}-badge.webp`);
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
        UI.count(c.sugar, { id: "cook-khun" });
        // and the fingers count the spoons (what you've done, never the target)
        if (Cook.Hands) Cook.Hands.count(S, c.sugar);
        Cook.sfx.pop();
      } else {
        // a look-alike: salt in someone's chai (from level 2 it just goes in, like a spoon of sugar: UX 11)
        c.salt++;
        if (zt.quiet) Cook.sfx.pop();
        else Cook.sfx.soft();
        UI.countUp(id, { speak: false });
        zt.listen(false, `added ${id}, not cook-khun, for ${nameOf(c.who)}`);
        zt.oops();
      }
      Cook.Spoon.spoon(zt, { bowl: from, into: c.vessel, word: id, ms: kCount.spoonMs }).then(() => drawBits(c));
      refresh();
    };
    const armBowls = () => {
      // a pinch of it (js/cook/hands.js)
      [sugar, ...decoys.map((id) => shelf[id])].forEach((b) => b && (b.handAction = "pinch"));
      S.tappable(sugar, () => !pouring && spoon(sugar, "cook-khun"));
      decoys.forEach((id) => S.tappable(shelf[id], () => !pouring && spoon(shelf[id], id)));
    };
    const armExtras = () =>
      Object.entries(extrasShelf).forEach(([id, obj]) =>
        S.tappable(Object.assign(obj, { handAction: "pinch" }), () => {
          const c = sel;
          if (!c || pouring || finished) return;
          if (!c.extras.includes(id)) c.extras.push(id);
          UI.count(1, { speak: false, id });
          Cook.sfx.pop();
          Cook.Spoon.spoon(zt, { bowl: obj, into: c.vessel, word: id, ms: kCount.spoonMs }).then(() => drawBits(c));
          refresh();
        })
      );
    // the gauge only (the plan posts the expectation)
    const gaugeIO = { expect: () => {}, gauge: (g) => zt.gauge(g) };
    const armMilk = () => {
      if (finished) return;
      P.measure(zt, {
        icon: milkJug,
        vessel: () => (sel && !finished && !pouring ? sel.vessel : null),
        // the carton itself tilts over the glass (28 Sept, s8)
        art: S.textures.exists("jar-cook-dudh") ? "jar-cook-dudh" : "milk-jug",
        ...(S.textures.exists("jar-cook-dudh") ? CAP : {}),
        artSize: zt.L(200),
        color: (lv) => mixCol(lv - sel.vol.chai, sel.vol.chai),
        // one measure of milk: up to the milk line above what's in the cup
        next: () => milkBand(sel).at,
        pourMs: kMilk.pourMs,
        slideMs: kMilk.slideMs,
        io: gaugeIO,
        expect: false,
        onStart: (v) => {
          pouring = true;
          unglow();
          holding();
        },
        onLevel: (lv) => {
          sel.vol.milk = lv - sel.vol.chai;
          drawBits(sel);
        },
      }).then((r) => {
        pouring = false;
        const c = cups.find((x) => x.vessel === r.vessel);
        if (c) {
          c.vol.milk = r.level - c.vol.chai;
          c.milkTaps = (c.milkTaps || 0) + 1;
          if (c === sel) UI.count(c.milkTaps, { speak: false, id: "cook-dudh", icon: jugIcon() });
        }
        armMilk();
        refresh();
      });
    };
    const armPan = () => {
      if (finished) return;
      let c = null;
      const lines = chaiLines();
      P.measure(zt, {
        icon: pan,
        vessel: () => (sel && !finished && !pouring ? sel.vessel : null),
        art: "saucepan-chai",
        artSize: zt.L(230),
        color: (lv) => mixCol(sel.vol.milk, Math.max(0, lv - sel.vol.milk)),
        // one tap: up to the next dashed line (half, then full); a full cup takes no more
        next: (lv) => {
          const n = lines.find((at) => at > lv + 0.02);
          return n == null ? null : n;
        },
        pourMs: kCup.instant ? 200 : kCup.pourMs,
        slideMs: kCup.slideMs,
        io: gaugeIO,
        expect: false,
        onStart: (v) => {
          pouring = true;
          unglow();
          holding();
          c = sel;
        },
        onLevel: (lv) => {
          c.vol.chai = lv - c.vol.milk;
          drawBits(c);
        },
      }).then((r) => {
        pouring = false;
        c.vol.chai = r.level - c.vol.milk;
        c.chaiPours++;
        // hot chai steams in the glass; the pan has a little less in it
        S.wisps(c.vessel.rim.x, c.vessel.surface().y - zt.L(20), 2, zt.L(46));
        pan.setLiquid(Math.max(0.2, pan.level - 0.035), COL.tea);
        // Wave 6b (UX 11): the cup is finished once it's at the top line: its rows tick, right or
        // not (they're judged at the tick and in the end review)
        if (level(c) >= K.lines.full - 0.02 && !c.closed) {
          c.closed = true;
          UI.mission.closeItem([], ctx.dishAt || 0, { all: true, for: c.who });
        }
        armPan();
        refresh();
      });
    };

    /* ---------- 1. water, 2. tea, 3. light the burner ---------- */
    ctx.nextStep && ctx.nextStep("Water");
    phase("water");
    // the water bottle tilts over the pot and the water rises in it
    const bottle = waterJug.isJar ? Object.assign({ art: "jar-cook-paani", artSize: zb.L(210) }, CAP) : {};
    await Mech.run("pour", zb, Object.assign({ vessel: pan, liquid: "cook-paani", color: COL.water, target: K.water, icon: waterJug, speak: true }, bottle));
    fade([waterJug]);
    ctx.nextStep && ctx.nextStep("Tea");
    phase("tea");
    await Mech.run("add", zb, { items: teaShelf, expected: "cook-chai", into: pan });
    fade(Object.values(teaShelf));
    // the tea goes in: a stir, and the water turns to light chai
    St.stirIn(S, pan, { ms: 800 });
    await new Promise((done) =>
      S.tweens.addCounter({ from: 0, to: 1, duration: 900, onUpdate: (tw) => pan.setLiquid(pan.level, St.mix(COL.water, COL.light, tw.getValue())), onComplete: done })
    );
    pan.setLiquid(pan.level, COL.light);
    // hot: steam from the pot, more as it nears the boil; the chai darkens as it boils,
    // and the surface rolls near the top (the boil state)
    let hot = 0;
    const steamLoop = S.time.addEvent({
      delay: 260,
      loop: true,
      callback: () => {
        if (!pan.active || !hot) return;
        const g = boiled ? 0.5 : zb._gauge ? Math.min(1, zb._gauge.level) : 0.1;
        if (Math.random() < 0.25 + g * 0.6) S.wisps(pan.rim.x + (Math.random() - 0.5) * pan.rimRx, pan.surface().y - zb.L(10), 1, zb.L(70));
      },
    });
    const stopHeat = S.addTick(() => {
      if (!hot || !pan.active) return;
      if (boiled) {
        pan.boiling = 0.2;
        pan.setLiquid(pan.level, COL.tea);
        return;
      }
      const g = zb._gauge ? Math.min(1, zb._gauge.level) : 0;
      pan.boiling = Cook.clamp((g - 0.45) / 0.45, 0, 1);
      pan.setLiquid(pan.level, St.mix(COL.light, COL.tea, g));
    });
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
    hot = 1;

    /* ---------- 4. the cups: each person says how they like it ---------- */
    ctx.nextStep && ctx.nextStep("Cups");
    const extraIds = K.showExtras || people.some((p) => p.extra) ? Cook.shuffle((K.extras || []).slice()) : [];
    extraIds.slice(0, 3).forEach((id, i) => (extrasShelf[id] = jar(id, i)));
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
    stopHeat();
    steamLoop.remove();
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
        if (ok) {
          UI.mission.tickItem(id, dish, { for: c.who, no: r.no });
          // the result card's "you did" (sugar counts already come in through listen; a "no" done is nothing added)
          if (!r.no && id !== "cook-khun" && ctx.did && ctx.did.length < 14) ctx.did.push({ line: Lang.wordLine(id), ok: true });
        } else {
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
