/*
 * proto-kitchen (Zafar's rapid prototype, 1 Nov): the eggs station, eggs at breakfast.
 * Spec: build/reports/designs/prototype-notes-2026-11-01.md "Eggs at breakfast"; cook-baking-eggs.md stage E1.
 *
 * One camera, top-down at the hob: the bowl of eggs, the pot (boil) and the pan (fry) on a two-burner hob, room for
 * several eggs in each, and the dark walnut tray (the chai tray's) with one plate per person, their face on the rim.
 *   1. Tap the bowl: an egg lifts out. Tap the pot or the pan: it goes in (whole, or cracked flat), the burner lights.
 *   2. Each egg's ring fills; in the green it glows: tap it, it lifts. Tap a plate: it lands (a boiled egg in an egg cup).
 *      A plate's row ticks the moment it has the number asked; an extra egg doesn't land (Zafar, 1 Nov).
 *   3. From L3 the salt and pepper shakers (Zafar's two new words): tap one, then a plate; the row ticks.
 *   4. Tap the tray: it goes to the table (the window's sky shows the meal): each plate slides to its person, who
 *      swaps to their happy pose and bounces, with steam; the boiled or fried and the owner are judged there.
 * The order is recipes.eggs (data/cook.json): what each person says comes from the language engine.
 * Every placeholder picture: assets/cook/proto/ (crops of Zafar's mock-ups) and simple shapes.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const P = "assets/cook/proto/";
  const KEY = "eggs";
  const ART = () =>
    [
      ["px-egg-pan", P + "egg-pan.webp"],
      ["px-egg-bowl", P + "egg-bowl.webp"],
      ["px-cat-sit", P + "cat-sit.webp"],
      ["px-pot", "assets/cook/items-s14/chai-pan/pan-water-s14.webp"],
      ["v2-tray", "assets/cook/items/chai-v2/tray-4-cutout-t.webp"],
    ].concat(Cook.Kit.art(2, []));
  // the station's art colours are data (data/stations/eggs.json station.palette; UI colours stay the tokens')
  const col = (k) => parseInt(String((((Cook.data.stations || {})[KEY] || {}).palette || {})[k] || "").slice(1), 16);
  const EGG = { w: col("eggWhite"), shell: col("shell"), yolk: col("yolk"), ink: col("ink") };
  const SKY = {
    breakfast: { top: col("morningTop"), bottom: col("morningBottom"), sun: col("sun"), light: 0 },
    lunch: { top: col("noonTop"), bottom: col("noonBottom"), sun: col("noonSun"), light: 0 },
    dinner: { top: col("nightTop"), bottom: col("nightBottom"), sun: col("moon"), light: 0.35, moon: true },
  };

  Mech.combined(KEY, {
    station: KEY,
    view: "marble",
    dataFile: "data/stations/eggs.json",
    zones: [],
    async run(host, p) {
      return eggs(host, p);
    },
  });

  // the row on the card for one person's eggs (fried: a.fried + n.egg; boiled: ph-boiledegg)
  const kindIds = (fried) => (fried ? ["a.fried", "n.egg"] : ["ph-boiledegg"]);
  const nameOf = (who) => (Cook.data.customers[who] || {}).name || who;

  async function eggs(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const level = host.level;
    const plates = (p.plates || []).slice(0, 4);
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const ready = K.ready || 0.72;
    const room = K.room || 6;
    const cookMs = K.cookMs || 3200;
    await St.loadArt(S, ART().concat(...plates.map((q) => Cook.Kit.faceArt(q.who)))).catch(() => {});
    const objs = [];
    const T = (o) => (objs.push(o), S.track(o));
    const steps = St.steps(ctx);
    // first-time lights (chai's rule): only for a new player, or the first round ever here
    const seen = (Cook.save.seenStation = Cook.save.seenStation || {});
    const fresh = (global.Onboard && global.Onboard.newPlayer && global.Onboard.newPlayer()) || !(Cook.save.coached || {})[KEY];
    const first = (k) => {
      const key = `${KEY}:first-${k}`;
      if (!fresh || seen[key]) return false;
      seen[key] = true;
      return true;
    };

    /* ---------------- the hob scene (top-down) ---------------- */
    const k = 0.74;
    const hob = Cook.Kit.hob(S, { n: 2, x: 300, y: 70, k });
    objs.push(hob.img);
    const [bPot, bPan] = hob.burners;
    const flame = (b) => {
      const f = T(S.add.image(b.x, b.y, "kit-flame-high").setDepth(D.item - 1).setAlpha(0).setScale(0.62));
      return f;
    };
    const flamePot = flame(bPot);
    const flamePan = flame(bPan);
    const R = 150; // a vessel's drawn size (radius-ish)
    const pot = T(S.add.image(bPot.x, bPot.y, "px-pot").setDepth(D.item));
    pot.setScale((R * 2.5) / Math.max(1, pot.width));
    // the s14 pan-water picture's body sits left of its canvas centre (handle to the right): its body centred on the burner
    pot.x = bPot.x + pot.displayWidth * 0.12;
    const pan = T(S.add.image(bPan.x, bPan.y, "px-egg-pan").setDepth(D.item));
    pan.setScale((R * 2) / Math.max(1, pan.width));
    const vessels = {
      pot: { key: "pot", img: pot, c: { x: bPot.x, y: bPot.y }, r: R * 0.62, eggs: [], flame: flamePot, fried: false },
      pan: { key: "pan", img: pan, c: { x: bPan.x, y: bPan.y }, r: R * 0.6, eggs: [], flame: flamePan, fried: true },
    };
    const slotAt = (v, i) => {
      if (i === 0) return { x: v.c.x, y: v.c.y };
      const a = ((i - 1) / Math.max(1, room - 1)) * Math.PI * 2 - Math.PI / 2;
      return { x: v.c.x + Math.cos(a) * v.r * 0.62, y: v.c.y + Math.sin(a) * v.r * 0.62 };
    };

    // the bowl of eggs (bottom left, on the shelf band) with its word card
    const bowl = T(S.add.image(150, 520, "px-egg-bowl").setDepth(D.item));
    bowl.setScale(230 / bowl.width);
    const chip = (id, x, y) => {
      const c = Cook.Kit.chip(S, id, x, y, { word: Cook.chipWord ? Cook.chipWord(id, ctx) : true });
      objs.push(c);
      return c;
    };
    chip("n.egg", 150, 660);

    // the tray: 2x2 plates, each with its person's face on the rim (the chai tray's walnut)
    const trayD = 470;
    const trayX = 1090;
    const trayY = 90;
    const tray = T(S.add.image(trayX, trayY, "v2-tray").setOrigin(0).setDepth(D.item - 4));
    tray.setDisplaySize(trayD, (trayD * 754) / 768);
    const WELLS = [[0.283, 0.29], [0.717, 0.29], [0.283, 0.708], [0.717, 0.708]];
    // the simple-shape placeholders, made once as textures (so the shared glow and taps work on them as on painted art)
    const tex = (key, w, h, draw) => {
      if (S.textures.exists(key)) return key;
      const g = S.make.graphics({ add: false });
      draw(g, w / 2, h / 2);
      g.generateTexture(key, w, h);
      g.destroy();
      return key;
    };
    tex("px-plate", 184, 184, (g, x, y) => {
      g.fillStyle(col("shadow"), 0.16).fillCircle(x + 3, y + 5, 86);
      g.fillStyle(col("white"), 1).fillCircle(x, y, 84);
      g.lineStyle(3, col("plateRim"), 1).strokeCircle(x, y, 62);
    });
    tex("px-egg-raw", 60, 74, (g, x, y) => {
      g.fillStyle(col("shadow"), 0.18).fillEllipse(x + 3, y + 5, 50, 64);
      g.fillStyle(EGG.shell, 1).fillEllipse(x, y, 48, 62);
      g.fillStyle(col("white"), 0.6).fillEllipse(x - 9, y - 12, 12, 18);
    });
    tex("px-egg-fried", 120, 120, (g, x, y) => {
      g.fillStyle(EGG.w, 1);
      [[0, 0, 44], [-22, 8, 26], [20, -10, 28], [10, 20, 24], [-16, -18, 22]].forEach(([dx, dy, r]) => g.fillCircle(x + dx, y + dy, r));
      g.fillStyle(EGG.yolk, 1).fillCircle(x + 2, y, 17);
      g.fillStyle(col("white"), 0.5).fillCircle(x - 4, y - 6, 5);
    });
    tex("px-eggcup", 84, 84, (g, x, y) => {
      g.fillStyle(col("shadow"), 0.16).fillCircle(x + 3, y + 4, 38);
      g.fillStyle(col("white"), 1).fillCircle(x, y, 36);
      g.lineStyle(3, col("cupRim"), 1).strokeCircle(x, y, 35);
      g.fillStyle(EGG.shell, 1).fillCircle(x, y, 24);
      g.fillStyle(col("white"), 0.6).fillCircle(x - 7, y - 7, 7);
    });
    const shakerTex = (key, body) =>
      tex(key, 84, 140, (g, x, y) => {
        g.fillStyle(col("shadow"), 0.15).fillEllipse(x + 4, y + 62, 70, 16);
        g.fillStyle(body, 1).fillRoundedRect(x - 28, y - 30, 56, 92, 16);
        g.lineStyle(2, col("ink"), 0.25).strokeRoundedRect(x - 28, y - 30, 56, 92, 16);
        g.fillStyle(col("white"), 0.35).fillRoundedRect(x - 20, y - 22, 10, 70, 5);
        g.fillStyle(col("steel"), 1).fillRoundedRect(x - 30, y - 60, 60, 34, 12);
        g.fillStyle(col("ink"), 0.55);
        [-12, 0, 12].forEach((dx) => g.fillCircle(x + dx, y - 47, 3));
      });
    shakerTex("px-shaker-salt", col("salt"));
    shakerTex("px-shaker-pepper", col("pepper"));
    const order = Cook.shuffle(plates.map((q, i) => i));
    const P0 = plates.map((q, i) => {
      const [fx, fy] = WELLS[order.indexOf(i)];
      const x = trayX + fx * trayD;
      const y = trayY + fy * tray.displayHeight;
      const hit = T(S.add.image(x, y, "px-plate").setDepth(D.item));
      const face = T(S.add.image(x - 74, y - 70, Cook.Kit.badge(S, q.who)).setDisplaySize(64, 64).setDepth(D.item + 1));
      const top = T(S.add.container(x, y).setDepth(D.item + 0.6));
      return { q, x, y, hit, face, top, eggs: [], salt: false, pepper: false, done: false, ticked: false };
    });

    // the shakers (L3 up): salt and pepper on the shelf band, each with its word card
    const shakers = {};
    const shaker = (id, x, key) => {
      const c = T(S.add.image(x, 560, key).setDepth(D.item));
      shakers[id] = { id, c, x, y: 560 };
      chip(id, x, 660);
    };
    if (K.shakers) {
      shaker("spi-16", 340, "px-shaker-salt");
      shaker("spi-11", 470, "px-shaker-pepper");
    }

    /* ---------------- drawing an egg ---------------- */
    const rawEgg = (x, y, s = 1) => T(S.add.image(x, y, "px-egg-raw").setScale(s).setDepth(D.fx));
    const friedEgg = (x, y, s = 1) => T(S.add.image(x, y, "px-egg-fried").setScale(s).setDepth(D.item + 0.4));
    const eggCup = (x, y, s = 1) => T(S.add.image(x, y, "px-eggcup").setScale(s).setDepth(D.item + 0.5));
    const ringG = T(S.add.graphics().setDepth(D.fx + 1));
    const steamPuff = (x, y, n = 3) => {
      for (let i = 0; i < n; i++) {
        const s = T(S.add.circle(x + (Math.random() - 0.5) * 30, y, 10 + Math.random() * 8, col("white"), 0.55).setDepth(D.fx + 2));
        S.tweens.add({ targets: s, y: y - 90 - Math.random() * 40, alpha: 0, scale: 2.2, duration: 1300 + i * 200, delay: i * 180, onComplete: () => s.destroy() });
      }
    };

    /* ---------------- the state ---------------- */
    let held = null; // {kind: "raw"} | {kind: "cooked", egg} | {kind: "shaker", id}
    let rawHeld = null;
    const all = () => [...vessels.pot.eggs, ...vessels.pan.eggs];
    const cooking = () => all().filter((e) => !e.out);
    let finished = false;
    let finishUp = null;
    const doneP = new Promise((r) => (finishUp = r));

    const hold = (h) => {
      if (rawHeld && (!h || h.kind !== "raw")) {
        rawHeld.destroy();
        rawHeld = null;
      }
      if (held && held.kind === "shaker") S.tweens.add({ targets: shakers[held.id].c, y: shakers[held.id].y, angle: 0, duration: 160 });
      if (held && held.kind === "cooked" && held.egg.lifted && !held.egg.out) S.tweens.add({ targets: held.egg.obj, scale: held.egg.base || 1, duration: 160 });
      held = h;
      if (h && h.kind === "shaker") S.tweens.add({ targets: shakers[h.id].c, y: shakers[h.id].y - 26, angle: -12, duration: 160 });
      refresh();
    };

    const plateWants = (pl) => pl.q.n || 1;
    const plateFull = (pl) => pl.eggs.length >= plateWants(pl);
    const seasonDone = (pl) => (pl.q.salt !== "yes" || pl.salt) && (pl.q.pepper !== "yes" || pl.pepper);

    /** the next thing in the card's order (chai's rule): the first plate not finished, its eggs, then its salt and pepper; then the tray */
    function nextThing() {
      for (const pl of P0) {
        if (!plateFull(pl)) {
          const want = !!pl.q.fried;
          if (held && held.kind === "cooked" && held.egg.fried === want) return { obj: pl.hit, key: kindIds(want).slice(-1)[0] === "n.egg" ? "n.egg" : "ph-boiledegg", what: "plate" };
          const readyEgg = all().find((e) => !e.out && e.fried === want && e.p >= ready);
          if (readyEgg) return { obj: readyEgg.obj, key: want ? "n.egg" : "ph-boiledegg", what: "egg" };
          const coming = all().filter((e) => !e.out && e.fried === want).length;
          const need = P0.filter((x) => !!x.q.fried === want).reduce((a, x) => a + Math.max(0, plateWants(x) - x.eggs.length), 0);
          if (coming >= need) return { obj: null, key: null, what: "wait" };
          if (held && held.kind === "raw") return { obj: want ? pan : pot, key: want ? "n.egg" : "ph-boiledegg", what: "vessel" };
          return { obj: bowl, key: "n.egg", what: "bowl" };
        }
        if (!seasonDone(pl)) {
          const id = pl.q.salt === "yes" && !pl.salt ? "spi-16" : "spi-11";
          if (held && held.kind === "shaker" && held.id === id) return { obj: pl.hit, key: id, what: "plate" };
          return { obj: shakers[id] && shakers[id].c, key: id, what: "shaker" };
        }
      }
      return { obj: tray, key: null, what: "tray" };
    }
    let lit = null;
    function refresh() {
      if (finished) return;
      const n = nextThing();
      if (lit && lit !== n.obj) S.glow(lit, false);
      lit = n.obj;
      if (n.obj) {
        S.glow(n.obj, true, { bounce: n.what !== "plate" });
        const c = S.centre(n.obj);
        z.expect({ kind: "tap", x: c.x, y: c.y, key: n.key || undefined });
      } else z.expect({ kind: "wait" });
    }

    /* ---------------- the moves ---------------- */
    S.tappable(bowl, () => {
      if (held && held.kind === "raw") return;
      hold({ kind: "raw" });
      rawHeld = rawEgg(bowl.x, bowl.y - 40);
      S.tweens.add({ targets: rawHeld, y: bowl.y - 150, duration: 260, ease: "Back.easeOut" });
      Cook.sfx.pop();
      if (first("vessel")) {
        S.glow(pot, true, { now: true });
        S.glow(pan, true, { now: true });
      }
      z.progress({ took: "n.egg" });
    });

    const putIn = async (v) => {
      if (!held || held.kind !== "raw" || !rawHeld) return;
      if (v.eggs.length >= room) {
        Cook.sfx.soft();
        return;
      }
      const at = slotAt(v, v.eggs.length);
      const egg = { fried: v.fried, v, p: 0, out: false, at, obj: null };
      v.eggs.push(egg);
      const o = rawHeld;
      rawHeld = null;
      held = null;
      S.glow(pot, false);
      S.glow(pan, false);
      await S.fly(o, at.x, at.y, { duration: 380, arc: 120 });
      if (v.fried) {
        o.destroy();
        Cook.sfx.pop();
        egg.obj = friedEgg(at.x, at.y, 0.82);
        egg.obj.setScale(0.35);
        S.tweens.add({ targets: egg.obj, scale: 0.82, duration: 260, ease: "Back.easeOut" });
        if (Cook.sfx.sizzle) Cook.sfx.sizzle(0.6);
      } else {
        egg.obj = o;
        o.setDepth(D.item + 0.4);
        Cook.sfx.pop();
        S.tweens.add({ targets: o, y: at.y - 6, duration: 420, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
      v.flame.setAlpha(0.95);
      egg.t0 = Date.now();
      // the egg itself is the tap target once it's cooked
      S.tappable(egg.obj, () => lift(egg));
      z.progress({ into: v.key });
      refresh();
    };
    S.tappable(pot, () => putIn(vessels.pot));
    S.tappable(pan, () => putIn(vessels.pan));

    const lift = (egg) => {
      if (egg.out) return;
      if (egg.p < ready) {
        S.wiggle(egg.obj);
        return;
      }
      if (held && held.kind === "cooked" && held.egg === egg) return hold(null);
      hold({ kind: "cooked", egg });
      egg.lifted = true;
      egg.base = egg.obj.scale;
      S.tweens.add({ targets: egg.obj, scale: egg.base * 1.18, duration: 160 });
      Cook.sfx.pop();
      if (first("plate")) P0.forEach((pl) => S.glow(pl.hit, true, { now: true }));
    };

    const tickPlate = (pl) => {
      if (pl.ticked || !plateFull(pl)) return;
      pl.ticked = true;
      UI.mission.closeItem(kindIds(!!pl.q.fried), 0, { for: pl.q.who });
      Cook.sfx.right();
    };
    const onPlate = async (pl) => {
      if (!held) return;
      if (held.kind === "shaker") {
        const id = held.id;
        const flag = id === "spi-16" ? "salt" : "pepper";
        if (pl[flag]) return hold(null);
        pl[flag] = true;
        const asked = (id === "spi-16" ? pl.q.salt : pl.q.pepper) === "yes";
        const sh = shakers[id].c;
        await Cook.tween(S, { targets: sh, x: pl.x + 40, y: pl.y - 70, duration: 280 });
        await Cook.tween(S, { targets: sh, angle: 150, duration: 160 });
        const dots = S.add.graphics();
        pl.top.add(dots);
        dots.fillStyle(id === "spi-16" ? col("steel") : col("ink"), 0.9);
        for (let i = 0; i < 14; i++) dots.fillCircle((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 70, 2.4);
        S.tweens.add({ targets: sh, angle: 110, duration: 90, yoyo: true, repeat: 2 });
        await Cook.wait(360);
        z.listen(asked, asked ? `${flag} on ${pl.q.who}` : `${flag} on ${pl.q.who}, not asked`);
        if (asked) {
          UI.mission.closeItem([id], 0, { for: pl.q.who });
          if (!ctx.guided && Lang.known(id)) Cook.markRight(id);
        }
        await Cook.tween(S, { targets: sh, x: shakers[id].x, y: shakers[id].y, angle: 0, duration: 260 });
        held = null;
        return refresh();
      }
      if (held.kind !== "cooked") return;
      const egg = held.egg;
      // an extra egg doesn't land (Zafar, 1 Nov): it hops and stays in the hand
      if (plateFull(pl)) {
        S.tweens.add({ targets: egg.obj, y: egg.obj.y - 30, duration: 140, yoyo: true });
        Cook.sfx.soft();
        return;
      }
      held = null;
      egg.out = true;
      const i = pl.eggs.length;
      const n = plateWants(pl);
      const dx = n === 1 ? 0 : (i - (n - 1) / 2) * 52;
      S.tweens.killTweensOf(egg.obj);
      await S.fly(egg.obj, pl.x + dx, pl.y, { duration: 380, arc: 110 });
      egg.obj.destroy();
      const look = egg.fried ? friedEgg(pl.x + dx, pl.y, n === 1 ? 0.95 : 0.6) : eggCup(pl.x + dx, pl.y, n === 1 ? 1 : 0.7);
      pl.eggs.push({ fried: egg.fried, look });
      egg.v.eggs.splice(egg.v.eggs.indexOf(egg), 1);
      if (!egg.v.eggs.length) egg.v.flame.setAlpha(0);
      const right = egg.fried === !!pl.q.fried;
      z.listen(right, right ? `egg on ${pl.q.who}` : `${egg.fried ? "fried" : "boiled"} egg on ${pl.q.who}`);
      if (right && !ctx.guided) kindIds(egg.fried).forEach((id) => Lang.known(id) && Cook.markRight(id));
      Cook.sfx.pop();
      tickPlate(pl);
      refresh();
    };
    P0.forEach((pl) => S.tappable(pl.hit, () => onPlate(pl)));
    Object.values(shakers).forEach((s) => {
      S.tappable(s.c, () => {
        if (held && held.kind === "shaker" && held.id === s.id) return hold(null);
        hold({ kind: "shaker", id: s.id });
        Cook.sfx.pop();
      });
    });

    // the rings: each cooking egg's fill (the green past `ready`)
    z.tick(() => {
      ringG.clear();
      let changed = false;
      cooking().forEach((e) => {
        if (!e.obj || e.lifted) return;
        const was = e.p >= ready;
        e.p = Math.min(1, (Date.now() - e.t0) / (cookMs / (Cook.speed || 1)));
        if (!was && e.p >= ready) {
          changed = true;
          steamPuff(e.at.x, e.at.y - 20, 2);
        }
        const r = 40;
        const { x, y } = e.obj;
        ringG.lineStyle(9, col("track"), 0.95).beginPath().arc(x, y, r, 0, Math.PI * 2).strokePath();
        ringG.lineStyle(9, col("sage"), 1).beginPath().arc(x, y, r, -Math.PI / 2 + ready * Math.PI * 2, (3 * Math.PI) / 2).strokePath();
        ringG.lineStyle(5, e.p >= ready ? col("ringDone") : col("gold"), 1).beginPath().arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + e.p * Math.PI * 2).strokePath();
      });
      if (changed) refresh();
      // steam now and then over a pot that's boiling
      if (vessels.pot.eggs.length && Math.random() < 0.02) steamPuff(bPot.x + (Math.random() - 0.5) * 80, bPot.y - 40, 1);
    });

    S.tappable(tray, () => {
      const n = nextThing();
      if (n.what !== "tray" || finished) {
        S.wiggle(tray);
        return;
      }
      finished = true;
      finishUp();
    });

    steps.to("eggs:eggs", { line: Lang.line("now", Lang.phrase(["n.egg"])) });
    if (first("bowl")) S.glow(bowl, true, { bounce: true, now: true });
    refresh();
    await doneP;
    steps.done();
    S.glow(lit, false);
    z.expect(null);

    /* ---------------- the table: the meal in its setting ---------------- */
    await serve(S, ctx, z, { plates: P0, meal: K.meal || "breakfast", objs });
    if (!ctx.guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[KEY] = true;
    }
    z.close();
    return { served: P0.length };
  }

  /** The table scene: a big window shows the time of day; each plate slides to its person, who swaps to happy and bounces. */
  async function serve(S, ctx, z, { plates, meal, objs }) {
    const sky = SKY[meal] || SKY.breakfast;
    await Cook.tween(S, { targets: objs.filter((o) => o && o.active), alpha: 0, duration: 300 });
    objs.forEach((o) => o && o.active && o.destroy());
    const T = (o) => S.track(o);
    const g = T(S.add.graphics().setDepth(D.bg + 2));
    // the wall, the window (its sky by the meal), the sill with the cat
    g.fillStyle(col("wall"), 1).fillRect(-400, -400, 2400, 1700);
    const wx = 70;
    const wy = -60;
    const ww = 560;
    const wh = 420;
    for (let i = 0; i < 24; i++) {
      const t = i / 23;
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(Phaser.Display.Color.ValueToColor(sky.top), Phaser.Display.Color.ValueToColor(sky.bottom), 100, t * 100);
      g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1).fillRect(wx, wy + (wh * i) / 24, ww, wh / 24 + 1);
    }
    g.fillStyle(sky.sun, 1).fillCircle(wx + ww * (sky.moon ? 0.72 : 0.3), wy + wh * (meal === "lunch" ? 0.22 : 0.35), sky.moon ? 34 : 46);
    if (sky.moon) {
      g.fillStyle(sky.top, 1).fillCircle(wx + ww * 0.72 + 16, wy + wh * 0.35 - 8, 30);
      g.fillStyle(col("white"), 0.9);
      for (let i = 0; i < 14; i++) g.fillCircle(wx + 20 + Math.random() * (ww - 40), wy + 20 + Math.random() * (wh * 0.6), 2);
    }
    g.fillStyle(meal === "dinner" ? col("nightGrass") : col("grass"), 1).fillRect(wx, wy + wh * 0.82, ww, wh * 0.18);
    g.lineStyle(18, col("white"), 1).strokeRect(wx, wy, ww, wh);
    g.lineStyle(10, col("white"), 1).lineBetween(wx + ww / 2, wy, wx + ww / 2, wy + wh).lineBetween(wx, wy + wh / 2, wx + ww, wy + wh / 2);
    g.fillStyle(col("sill"), 1).fillRect(wx - 30, wy + wh, ww + 230, 22);
    if (sky.light) g.fillStyle(col("nightShade"), sky.light).fillRect(-400, -400, 2400, 1700);
    const cat = T(S.add.image(wx + ww + 95, wy + wh + 4, "px-cat-sit").setOrigin(0.5, 1).setDepth(D.bg + 3));
    cat.setScale(190 / cat.height);
    S.tweens.add({ targets: cat, scaleY: cat.scaleY * 1.03, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    // the people at their places, behind the table
    const n = plates.length;
    const seatX = (i) => (n === 1 ? 1120 : n === 2 ? 960 + i * 340 : 880 + i * 270);
    const people = plates.map((pl, i) => {
      const who = pl.q.who;
      const key = S.textures.exists(`${who}-neutral`) ? `${who}-neutral` : Cook.Kit.badge(S, who);
      const img = T(S.add.image(seatX(i), 500, key).setOrigin(0.5, 1).setDepth(D.item - 2));
      const h = S.textures.exists(`${who}-neutral`) ? 470 : 220;
      img.setScale(h / img.height);
      img.base = img.scaleY;
      return { pl, img, who };
    });
    // the table (a plain wood top; a cloth at dinner)
    const tg = T(S.add.graphics().setDepth(D.item));
    tg.fillStyle(col("shadow"), 0.18).fillRoundedRect(700, 470, 1300, 600, 40);
    tg.fillStyle(meal === "dinner" ? col("cloth") : col("wood"), 1).fillRoundedRect(680, 450, 1300, 600, 40);
    if (meal === "dinner") {
      tg.lineStyle(6, col("gold"), 0.7).strokeRoundedRect(700, 466, 1260, 560, 32);
    } else {
      tg.lineStyle(2, col("woodGrain"), 0.35);
      for (let y = 500; y < 1000; y += 46) tg.lineBetween(700, y, 1960, y + 6);
    }
    await Cook.wait(400);
    // each plate slides in to its person; they swap to happy, bounce; steam rises
    let allRight = true;
    for (const { pl, img, who } of people) {
      const x = img.x;
      const plate = T(S.add.container(x, 1050).setDepth(D.item + 1));
      const pg = S.add.graphics();
      pg.fillStyle(col("shadow"), 0.16).fillEllipse(4, 8, 230, 96);
      pg.fillStyle(col("white"), 1).fillEllipse(0, 0, 220, 90);
      pg.lineStyle(3, col("plateRim"), 1).strokeEllipse(0, 0, 160, 62);
      plate.add(pg);
      pl.eggs.forEach((e, j) => {
        const dx = (j - (pl.eggs.length - 1) / 2) * 64;
        const eg = S.add.graphics();
        if (e.fried) {
          eg.fillStyle(EGG.w, 1).fillEllipse(dx, -4, 84, 40).fillStyle(EGG.yolk, 1).fillEllipse(dx + 2, -6, 26, 14);
        } else {
          // the egg cup, side-on, the egg standing in it
          eg.fillStyle(EGG.shell, 1).fillEllipse(dx, -62, 54, 70);
          eg.fillStyle(col("white"), 0.6).fillEllipse(dx - 10, -76, 12, 20);
          eg.fillStyle(col("white"), 1).fillRoundedRect(dx - 32, -44, 64, 40, 12).fillRect(dx - 12, -6, 24, 8).fillEllipse(dx, 4, 52, 14);
          eg.lineStyle(2, col("cupRim"), 1).strokeRoundedRect(dx - 32, -44, 64, 40, 12);
        }
        plate.add(eg);
      });
      if (pl.salt || pl.pepper) {
        const dg = S.add.graphics();
        if (pl.salt) dg.fillStyle(col("white"), 0.95);
        for (let i = 0; i < 10 && pl.salt; i++) dg.fillCircle((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 24, 2.2);
        if (pl.pepper) dg.fillStyle(col("ink"), 0.9);
        for (let i = 0; i < 10 && pl.pepper; i++) dg.fillCircle((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 24, 2.2);
        plate.add(dg);
      }
      await Cook.tween(S, { targets: plate, y: 545, duration: 520, ease: "Cubic.easeOut" });
      Cook.sfx.pop();
      const kindsRight = pl.eggs.length === (pl.q.n || 1) && pl.eggs.every((e) => e.fried === !!pl.q.fried);
      const seasonRight = (pl.q.salt === "yes") === !!pl.salt && (pl.q.pepper === "yes") === !!pl.pepper;
      const ok = kindsRight && seasonRight;
      if (!ok) allRight = false;
      for (let i = 0; i < 3; i++) {
        const s = T(S.add.circle(x + (i - 1) * 30, 540, 12, col("white"), 0.6).setDepth(D.item + 2));
        S.tweens.add({ targets: s, y: 420, alpha: 0, scale: 2.4, duration: 1500, delay: i * 220, repeat: 1, onComplete: () => s.destroy() });
      }
      // the pose swap and a small bounce (a gentle frown when it isn't what they asked for)
      const mood = ok ? "happy" : S.textures.exists(`${who}-frown`) ? "frown" : "neutral";
      if (S.textures.exists(`${who}-${mood}`)) img.setTexture(`${who}-${mood}`);
      if (ok) {
        Cook.sfx.right();
        await Cook.tween(S, { targets: img, y: img.y - 26, duration: 170, yoyo: true, repeat: 1, ease: "Sine.easeOut" });
      } else {
        Cook.sfx.soft();
        await Cook.tween(S, { targets: img, angle: { from: -3, to: 3 }, duration: 160, yoyo: true, repeat: 1 });
        img.setAngle(0);
      }
      await Cook.wait(250);
    }
    UI.mission.closeItem([], 0, { all: true });
    if (allRight) await Promise.race([UI.voice(Lang.line("welldone")).catch(() => {}), Cook.wait(2400)]);
    await Cook.wait(900);
  }

  Mech.lab(KEY, {
    name: "Eggs (prototype)",
    verb: "Boil or fry, then the plates",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.eggs.make("nana", { level: L.level });
      L.ctx.steps = R.eggs.steps(d);
      L.card(d, L.ctx.steps);
      await L.station(KEY, { plates: d.plates });
    },
  });
})(window);
