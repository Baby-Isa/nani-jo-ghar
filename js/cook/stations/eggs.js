/*
 * Eggs at breakfast (Zafar's rapid prototype, 1 Nov; Sprint 18 wave 2: a game on its settings file and the kits).
 * Spec: build/reports/designs/prototype-notes-2026-11-01.md "Eggs at breakfast"; cook-baking-eggs.md stage E1; its gap page
 * docs/design-language/standard/gaps/eggs.md.
 *
 * The game's own mechanic (non-negotiable 1, kept as he made it):
 *   1. Tap the bowl: an egg lifts out. Tap the pot or the pan: it goes in (whole, or cracked flat), the burner lights.
 *   2. Each egg's ring fills; in the green it glows: tap it, it lifts. Tap a plate: it lands (a boiled egg in an egg cup).
 *      A plate's row ticks the moment it has the number asked; an extra egg doesn't land (Zafar, 1 Nov).
 *   3. From L3 the salt and pepper shakers (Zafar's two new words): tap one, then a plate; the row ticks.
 *   4. Tap the tray: it goes to the table (the meal's kitchen): each plate slides to its person, who swaps to their happy pose
 *      and bounces, with steam; one that isn't what they asked for stays neutral (decision 8: never a frown).
 * Everything else is a kit call: the hob, the flames and the heat ring (the kitchen kit's stove part), the word chips
 * (Cook.Kit.chip), the lights and lessons (Cook.Coach: the first time, the call with its light, the stuck hint, the next vessel,
 * the reveal lessons), the order card's ticks (UI.mission), the level-up count (Cook.roundDone).
 * Its settings: data/stations/eggs.json (Cook.data.settings.eggs: items, scene, assets; mechanic.levels the knobs by level).
 * The order is recipes.eggs (data/cook.json): what each person says comes from the language engine.
 */
import { Cook as CookNS } from "../ns.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const KEY = "eggs";
  const NOTE = `${KEY}:s14-light`;

  // the settings file (data/stations/eggs.json, carried by zone.js as Cook.data.settings.eggs)
  const SET = () => ((Cook.data && Cook.data.settings) || {})[KEY] || {};
  const ITEM = (k) => (SET().items || {})[k] || {};
  const SCENE = () => SET().scene || {};
  const url = (k, state) => (state ? (ITEM(k).states || {})[state] : ITEM(k).file);
  const tex = (k, state) => `eg-${k}${state ? `-${state}` : ""}`;
  // the station's own colours (station.palette: the steam, the shakers' grains); UI colours stay the tokens'
  const col = (k) => parseInt(String((((Cook.data.stations || {})[KEY] || {}).palette || {})[k] || "").slice(1), 16);
  const RULES = () => global.Rules || (global.Tokens && global.Tokens.rules) || null;

  /** Only what this round shows (decision 68): the items' states it draws, the tray, this meal's kitchen, the hob. */
  function ART(K) {
    const out = [];
    const add = (k, state) => url(k, state) && out.push([tex(k, state), url(k, state)]);
    ["water", "boil"].forEach((s) => add("pot", s));
    ["dry", "oil"].forEach((s) => add("pan", s));
    add("egg", "white");
    ["raw", "setting", "done"].forEach((s) => add("friedEgg", s));
    ["six", "three"].forEach((s) => add("bowl", s));
    if (K.shakers) ["shakerSalt", "shakerPepper"].forEach((k) => add(k));
    add("eggCupTop", "egg");
    ["plate", "friedOnPlate", "cat"].forEach((k) => add(k));
    add("eggCupServed", "egg");
    const sc = SCENE();
    const bg = (sc.bg || {})[K.meal || "breakfast"];
    if (bg) out.push([`eg-bg-${K.meal || "breakfast"}`, bg]);
    if (sc.tray) out.push(["eg-tray", sc.tray.file], ["eg-trayplate", sc.tray.plate]);
    return out.concat(Cook.Kit.art(2, []));
  }
  // a picture at its drawn size (items[k].drawn: w, else h, else body = the round body's diameter, body.d of the width)
  const sized = (o, k, f = 1) => {
    const d = ITEM(k).drawn || {};
    if (d.w) o.setScale((d.w * f) / Math.max(1, o.width));
    else if (d.h) o.setScale((d.h * f) / Math.max(1, o.height));
    else if (d.body) o.setScale((d.body * f) / (((ITEM(k).body || {}).d || 1) * Math.max(1, o.width)));
    return o;
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

  async function eggs(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const level = host.level;
    const guided = !!ctx.guided;
    const plates = (p.plates || []).slice(0, 4);
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const ready = K.ready || 0.72;
    const room = K.room || 6;
    const cookMs = K.cookMs || 3200;
    const sc = SCENE();
    await St.loadArt(S, ART(K).concat(...plates.map((q) => Cook.Kit.faceArt(q.who)))).catch(() => {});
    const objs = [];
    const T = (o) => (objs.push(o), S.track(o));
    const steps = St.steps(ctx);
    // the kitchen kit's first-time gate (STD-D1-01): each light once for a new player, or the first round ever here
    const gate = Cook.Coach.firsts(KEY, { round: new Set() });
    let hints = 0;
    let busy = 0; // moves in flight (the stuck hint waits for them)
    const flying = async (pr) => {
      busy++;
      try {
        return await pr;
      } finally {
        busy--;
      }
    };

    /* ---------------- the hob scene (top-down) ---------------- */
    const hs = sc.hob || { x: 300, y: 70, k: 0.74 };
    const hob = Cook.Kit.hob(S, { n: 2, x: hs.x, y: hs.y, k: hs.k });
    objs.push(hob.img);
    const [bPot, bPan] = hob.burners;
    const flame = (b) => T(S.add.image(b.x, b.y, "kit-flame-high").setDepth(D.item - 1).setAlpha(0).setScale(0.62));
    // each vessel's round body centred on its burner (items.pot.body, items.pan.body: cx, cy its centre as fractions of the canvas)
    const vessel = (k, b, state, fried) => {
      const body = ITEM(k).body || { cx: 0.5, cy: 0.5, rIn: 0.3 };
      const img = sized(T(S.add.image(b.x, b.y, tex(k, state)).setDepth(D.item)), k);
      img.setOrigin(body.cx, body.cy);
      return { key: k, k, img, c: { x: b.x, y: b.y }, r: body.rIn * img.displayWidth, eggs: [], flame: flame(b), fried };
    };
    const vessels = { pot: vessel("pot", bPot, "water", false), pan: vessel("pan", bPan, "dry", true) };
    const pot = vessels.pot.img;
    const pan = vessels.pan.img;
    // the vessel's picture for its state: the pot's water boils and the pan has its oil once an egg is in; the burner lit
    const look = (v) => {
      const on = v.eggs.length > 0;
      if (on && v.fried) v.oiled = true;
      v.flame.setAlpha(on ? 0.95 : 0);
      v.img.setTexture(tex(v.k, v.fried ? (v.oiled ? "oil" : "dry") : on ? "boil" : "water"));
    };
    const slotAt = (v, i) => {
      if (i === 0) return { x: v.c.x, y: v.c.y };
      const a = ((i - 1) / Math.max(1, room - 1)) * Math.PI * 2 - Math.PI / 2;
      return { x: v.c.x + Math.cos(a) * v.r * 0.62, y: v.c.y + Math.sin(a) * v.r * 0.62 };
    };

    // the bowl of eggs (on the shelf band) with its word chip; its picture follows the eggs still to take
    const at = ITEM("bowl").at || [150, 520];
    const bowl = sized(T(S.add.image(at[0], at[1], tex("bowl", "six")).setDepth(D.item)), "bowl");
    const chipY = ITEM("bowl").chipY || 660;
    const chip = (id, x) => objs.push(Cook.Kit.chip(S, id, x, chipY, { word: Cook.chipWord ? Cook.chipWord(id, ctx) : true }));
    chip("n.egg", at[0]);
    const wanted = plates.reduce((a, q) => a + (q.n || 1), 0);
    let taken = 0;
    const bowlLook = () => bowl.setTexture(tex("bowl", wanted - taken > 3 ? "six" : "three"));
    bowlLook();

    // the tray: 2x2 plates, each with its person's face on the rim (the chai tray's walnut)
    const tr = sc.tray || {};
    const trayD = tr.d || 470;
    const tray = T(S.add.image(tr.x || 1090, tr.y || 90, "eg-tray").setOrigin(0).setDepth(D.item - 4));
    tray.setDisplaySize(trayD, (trayD * tray.height) / Math.max(1, tray.width));
    const WELLS = tr.wells || [[0.283, 0.29], [0.717, 0.29], [0.283, 0.708], [0.717, 0.708]];
    const fc = tr.face || { dx: -74, dy: -70, d: 64 };
    const order = Cook.shuffle(plates.map((q, i) => i));
    const P0 = plates.map((q, i) => {
      const [fx, fy] = WELLS[order.indexOf(i)];
      const x = tray.x + fx * trayD;
      const y = tray.y + fy * tray.displayHeight;
      const hit = T(S.add.image(x, y, "eg-trayplate").setDepth(D.item));
      hit.setScale((tr.plateW || 168) / Math.max(1, hit.width));
      // SH-183 (Zafar, 1 Nov: tray and plate faces at full contrast, "sit on top"): the shared badge depth, over the eggs and the plate
      const face = T(S.add.image(x + fc.dx, y + fc.dy, Cook.Kit.badge(S, q.who)).setDisplaySize(fc.d, fc.d).setDepth(D.badge).setAlpha(1));
      const top = T(S.add.container(x, y).setDepth(D.item + 0.6));
      return { q, x, y, hit, face, top, eggs: [], salt: false, pepper: false, ticked: false };
    });

    // the shakers (L3 up): salt and pepper on the shelf band, each with its word chip
    const shakers = {};
    const shaker = (id, k) => {
      const it = ITEM(k);
      const y = it.at_y || 560;
      const c = sized(T(S.add.image(it.at_x, y, tex(k)).setDepth(D.item)), k);
      shakers[id] = { id, c, x: it.at_x, y };
      chip(id, it.at_x);
    };
    if (K.shakers) {
      shaker("spi-16", "shakerSalt");
      shaker("spi-11", "shakerPepper");
    }

    /* ---------------- an egg ---------------- */
    const rawEgg = (x, y) => sized(T(S.add.image(x, y, tex("egg", "white")).setDepth(D.fx)), "egg");
    const friedLook = (e) => (e.p >= ready ? "done" : e.p >= ready * 0.45 ? "setting" : "raw");
    const friedEgg = (x, y, f = 1) => sized(T(S.add.image(x, y, tex("friedEgg", "raw")).setDepth(D.item + 0.4)), "friedEgg", f);
    const eggCup = (x, y, f = 1) => sized(T(S.add.image(x, y, tex("eggCupTop", "egg")).setDepth(D.item + 0.5)), "eggCupTop", f);
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
          const key = want ? "n.egg" : "ph-boiledegg";
          if (held && held.kind === "cooked" && held.egg.fried === want) return { obj: pl.hit, key, what: "plate" };
          const readyEgg = all().find((e) => !e.out && e.fried === want && e.p >= ready);
          if (readyEgg) return { obj: readyEgg.obj, key, what: "egg" };
          const coming = all().filter((e) => !e.out && e.fried === want).length;
          const need = P0.filter((x) => !!x.q.fried === want).reduce((a, x) => a + Math.max(0, plateWants(x) - x.eggs.length), 0);
          if (coming >= need) return { obj: null, key: null, what: "wait" };
          if (held && held.kind === "raw") return { obj: want ? pan : pot, key, what: "vessel" };
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

    /* ---------------- the lights (the kitchen kit's: Cook.Coach) ---------------- */
    // a thing's box on the page, for the kit's light; a plate's is its round body with its own face (never a neighbour's face)
    const plateOf = (o) => P0.find((pl) => pl.hit === o);
    const pageRect = (o) => () => {
      if (!o || !o.active) return null;
      const pl = plateOf(o);
      const r = pl ? ((tr.plateW || 168) / 2) * 0.94 : 0; // (the rim, inside the picture's edge)
      const f = pl ? pl.face.getBounds() : null;
      const b = pl ? { x: Math.min(pl.x - r, f.x), y: Math.min(pl.y - r, f.y), right: Math.max(pl.x + r, f.right), bottom: Math.max(pl.y + r, f.bottom) } : o.getBounds();
      // (contract-82: the box stops short of another plate's face below it or to its right, the light's pad and a gap clear)
      if (pl)
        P0.filter((q) => q !== pl).forEach((q) => {
          const g = q.face.getBounds();
          const across = g.right > b.x && g.x < b.right;
          const beside = g.bottom > b.y && g.y < b.bottom;
          if (across && g.y > pl.y) b.bottom = Math.min(b.bottom, g.y - 16);
          else if (beside && g.x > pl.x) b.right = Math.min(b.right, g.x - 16);
        });
      const a = UI.worldToScreen(b.x, b.y);
      const c = UI.worldToScreen(b.right, b.bottom);
      return [a.x, a.y, c.x - a.x, c.y - a.y];
    };
    // the level's wait before the stuck hint (the central rules' hintS)
    const hintMs = () => (RULES() && RULES().hintMs ? RULES().hintMs(level) : 0) || 7000;
    let glowObj = null;
    const glowOn = (o) => {
      if (glowObj === o) return;
      if (glowObj && glowObj.active) S.glow(glowObj, false);
      glowObj = o;
      if (o) S.glow(o, true);
    };
    let ctl = null;
    let ctlKey = null;
    let nextV = null;
    let ids = 0;
    const idOf = (o) => (o.eggId = o.eggId || ++ids);
    // one step at a time: the first time it comes up, its light with the call (the kit's first-time gate); after that the call
    // alone and the same light as the stuck hint after the level's wait, at once after a wrong move (Cook.Coach.wrong). The
    // pick between the pot and the pan is the next vessel: the first time, a light round the one this plate needs.
    const coach = (n) => {
      const key = !n.obj ? "wait" : `${n.what}:${idOf(n.obj)}`;
      if (key === ctlKey) return;
      ctlKey = key;
      if (ctl) ctl.close();
      ctl = null;
      if (nextV) nextV.stop();
      nextV = null;
      glowOn(null);
      if (!n.obj || finished) return;
      let first = false;
      if (n.what === "vessel") {
        if (gate.first("next-pan"))
          nextV = Cook.Coach.nextLight({ now: true, target: pageRect(n.obj), quitIf: () => finished || ctlKey !== key, who: n.obj === pot ? "pot" : "pan", note: NOTE });
      } else first = gate.first(`ctl-${n.what}`);
      ctl = Cook.Coach.control({
        key: KEY,
        target: pageRect(n.obj),
        first,
        hintMs,
        current: () => ctlKey === key && !finished,
        busy: () => busy > 0,
        onLight: () => glowOn(n.obj),
        onHint: () => {
          hints++; // (SH-160: the guide's hint came)
          if (UI.stepHelp) UI.stepHelp();
        },
        note: NOTE,
      });
    };
    const wrong = () => Cook.Coach.wrong();

    function refresh() {
      if (finished) return;
      const n = nextThing();
      coach(n);
      if (n.obj) {
        const c = S.centre(n.obj);
        z.expect({ kind: "tap", x: c.x, y: c.y, key: n.key || undefined });
      } else z.expect({ kind: "wait" });
    }

    /* ---------------- the moves ---------------- */
    S.tappable(bowl, () => {
      if (held && held.kind === "raw") return;
      hold({ kind: "raw" });
      taken++;
      bowlLook();
      rawHeld = rawEgg(bowl.x, bowl.y - 40);
      S.tweens.add({ targets: rawHeld, y: bowl.y - 150, duration: 260, ease: "Back.easeOut" });
      Cook.sfx.pop();
      z.progress({ took: "n.egg" });
    });

    const putIn = async (v) => {
      if (!held || held.kind !== "raw" || !rawHeld) return;
      if (v.eggs.length >= room) {
        Cook.sfx.soft();
        return wrong();
      }
      const at = slotAt(v, v.eggs.length);
      const egg = { fried: v.fried, v, p: 0, out: false, at, obj: null };
      v.eggs.push(egg);
      const o = rawHeld;
      rawHeld = null;
      held = null;
      refresh();
      await flying(S.fly(o, at.x, at.y, { duration: 380, arc: 120 }));
      // (the tray went to the table while it flew: nothing is left to cook it in)
      if (finished) return o.active && o.destroy();
      if (v.fried) {
        o.destroy();
        Cook.sfx.pop();
        egg.obj = friedEgg(at.x, at.y, 0.82);
        const s = egg.obj.scale;
        egg.obj.setScale(s * 0.4);
        S.tweens.add({ targets: egg.obj, scale: s, duration: 260, ease: "Back.easeOut" });
        if (Cook.sfx.sizzle) Cook.sfx.sizzle(0.6);
      } else {
        egg.obj = o;
        o.setDepth(D.item + 0.4);
        Cook.sfx.pop();
        S.tweens.add({ targets: o, y: at.y - 6, duration: 420, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      }
      egg.ring = Cook.Kit.heatRing(S, { depth: D.fx + 1, width: 6 });
      look(v);
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
      // (an egg in the pot or the pan covers its middle: with a raw egg in the hand, a tap there puts it in)
      if (held && held.kind === "raw") return putIn(egg.v);
      if (egg.p < ready) {
        S.wiggle(egg.obj);
        return wrong();
      }
      if (held && held.kind === "cooked" && held.egg === egg) return hold(null);
      hold({ kind: "cooked", egg });
      egg.lifted = true;
      egg.base = egg.obj.scale;
      S.tweens.add({ targets: egg.obj, scale: egg.base * 1.18, duration: 160 });
      Cook.sfx.pop();
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
        busy++;
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
          if (!guided && Lang.known(id)) Cook.markRight(id);
        } else wrong();
        await Cook.tween(S, { targets: sh, x: shakers[id].x, y: shakers[id].y, angle: 0, duration: 260 });
        busy--;
        held = null;
        return refresh();
      }
      if (held.kind !== "cooked") return;
      const egg = held.egg;
      // an extra egg doesn't land (Zafar, 1 Nov): it hops and stays in the hand
      if (plateFull(pl)) {
        S.tweens.add({ targets: egg.obj, y: egg.obj.y - 30, duration: 140, yoyo: true });
        Cook.sfx.soft();
        return wrong();
      }
      held = null;
      egg.out = true;
      if (egg.ring) egg.ring.destroy();
      const i = pl.eggs.length;
      const n = plateWants(pl);
      const dx = n === 1 ? 0 : (i - (n - 1) / 2) * 52;
      S.tweens.killTweensOf(egg.obj);
      await flying(S.fly(egg.obj, pl.x + dx, pl.y, { duration: 380, arc: 110 }));
      egg.obj.destroy();
      const k = n === 1 ? 1 : 0.65;
      const shown = egg.fried ? friedEgg(pl.x + dx, pl.y, 0.95 * k).setTexture(tex("friedEgg", "done")) : eggCup(pl.x + dx, pl.y, k);
      pl.eggs.push({ fried: egg.fried, look: shown });
      egg.v.eggs.splice(egg.v.eggs.indexOf(egg), 1);
      look(egg.v);
      const right = egg.fried === !!pl.q.fried;
      z.listen(right, right ? `egg on ${pl.q.who}` : `${egg.fried ? "fried" : "boiled"} egg on ${pl.q.who}`);
      if (right && !guided) kindIds(egg.fried).forEach((id) => Lang.known(id) && Cook.markRight(id));
      if (!right) wrong();
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

    // the rings: each cooking egg's fill on the kit's heat ring (its sage green from `ready`); a fried egg sets as it fills
    z.tick(() => {
      let changed = false;
      cooking().forEach((e) => {
        if (!e.obj || e.lifted || !e.ring) return;
        const was = e.p >= ready;
        e.p = Math.min(1, (Date.now() - e.t0) / (cookMs / (Cook.speed || 1)));
        if (!was && e.p >= ready) {
          changed = true;
          steamPuff(e.at.x, e.at.y - 20, 2);
        }
        if (e.fried) {
          const t = tex("friedEgg", friedLook(e));
          if (e.obj.texture.key !== t) e.obj.setTexture(t);
        }
        e.ring.draw(e.obj.x, e.obj.y, 40, e.p, ready, 1);
      });
      if (changed) refresh();
      // steam now and then over a pot that's boiling
      if (vessels.pot.eggs.length && Math.random() < 0.02) steamPuff(bPot.x + (Math.random() - 0.5) * 80, bPot.y - 40, 1);
    });

    S.tappable(tray, () => {
      const n = nextThing();
      if (n.what !== "tray" || finished) {
        S.wiggle(tray);
        return wrong();
      }
      finished = true;
      finishUp();
    });

    steps.to("eggs:eggs", { line: Lang.line("now", Lang.phrase(["n.egg"])) });
    // the kitchen kit's reveal lessons (STD-D1-08): once the order has landed, the dotted word then the blurred picture
    if (Cook.Coach.lessons) await Cook.Coach.lessons({ gate, ctx, busy: () => busy > 0 });
    refresh();
    await doneP;
    steps.done();
    if (ctl) ctl.close();
    if (nextV) nextV.stop();
    glowOn(null);
    z.expect(null);

    /* ---------------- the table: the meal in its kitchen ---------------- */
    await serve(S, ctx, z, { plates: P0, meal: K.meal || "breakfast", objs });
    if (!guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[KEY] = true;
    }
    z.close();
    // SH-160: a finished round counts towards eggs' level-up (the central rules); a grown-up's pick never moves the count
    if (Cook.roundDone && !guided) {
      const dsh = ctx.order && ctx.order.dishes ? ctx.order.dishes[ctx.dishAt || 0] : null;
      Cook.roundDone(KEY, { level: Cook.roundLevel(ctx), hints, grownUp: !!ctx.lab || !(dsh && dsh.autoLevel) });
    }
    return { served: P0.length };
  }

  /** The table: the meal's kitchen (its window's sky by the meal); each plate slides to its person, who swaps to happy and bounces. */
  async function serve(S, ctx, z, { plates, meal, objs }) {
    await Cook.tween(S, { targets: objs.filter((o) => o && o.active), alpha: 0, duration: 300 });
    objs.forEach((o) => o && o.active && o.destroy());
    const T = (o) => S.track(o);
    const tb = SCENE().table || {};
    // the meal's kitchen, covering the stage in proportion, its island's back edge where the people stand (scene.bgIsland)
    if (S.textures.exists(`eg-bg-${meal}`)) {
      const bg = T(S.add.image(800, 0, `eg-bg-${meal}`).setOrigin(0.5, 0).setDepth(D.bg + 2));
      const k = Math.max(1600 / Math.max(1, bg.width), 900 / Math.max(1, bg.height));
      const isl = (SCENE().bgIsland || {}).wanted || 705;
      bg.setScale(k);
      bg.y = isl - (isl / 900) * bg.height * k;
    }
    const cat = tb.cat || { x: 120, y: 706, h: 190 };
    const catImg = T(S.add.image(cat.x, cat.y, tex("cat")).setOrigin(0.5, 1).setDepth(D.bg + 3));
    catImg.setScale(cat.h / Math.max(1, catImg.height));
    S.tweens.add({ targets: catImg, scaleY: catImg.scaleY * 1.03, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    // the people at their places, behind the island
    const n = plates.length;
    const seats = (tb.seats || {})[String(n)] || plates.map((q, i) => 400 + (i * 800) / Math.max(1, n - 1));
    const people = plates.map((pl, i) => {
      const who = pl.q.who;
      const full = S.textures.exists(`${who}-neutral`);
      const img = T(S.add.image(seats[i], tb.standY || 708, full ? `${who}-neutral` : Cook.Kit.badge(S, who)).setOrigin(0.5, 1).setDepth(D.item - 2));
      img.setScale((full ? tb.personH || 470 : 220) / img.height);
      return { pl, img, who };
    });
    await Cook.wait(400);
    // each plate slides in to its person; they swap to happy and bounce; steam rises
    let allRight = true;
    for (const { pl, img, who } of people) {
      const x = img.x;
      const plate = T(S.add.container(x, tb.plateFrom || 1050).setDepth(D.item + 1));
      plate.add(sized(S.add.image(0, 0, tex("plate")), "plate"));
      const ew = (ITEM("friedOnPlate").drawn || {}).w || 120;
      pl.eggs.forEach((e, j) => {
        const dx = (j - (pl.eggs.length - 1) / 2) * ew * 0.62;
        const k = pl.eggs.length > 1 ? 0.75 : 1;
        plate.add(e.fried ? sized(S.add.image(dx, -6, tex("friedOnPlate")), "friedOnPlate", k) : sized(S.add.image(dx, 0, tex("eggCupServed", "egg")).setOrigin(0.5, 0.92), "eggCupServed", k));
      });
      if (pl.salt || pl.pepper) {
        const dg = S.add.graphics();
        if (pl.salt) dg.fillStyle(col("white"), 0.95);
        for (let i = 0; i < 10 && pl.salt; i++) dg.fillCircle((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 24, 2.2);
        if (pl.pepper) dg.fillStyle(col("ink"), 0.9);
        for (let i = 0; i < 10 && pl.pepper; i++) dg.fillCircle((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 24, 2.2);
        plate.add(dg);
      }
      const py = tb.plateY || 752;
      await Cook.tween(S, { targets: plate, y: py, duration: 520, ease: "Cubic.easeOut" });
      Cook.sfx.pop();
      const kindsRight = pl.eggs.length === (pl.q.n || 1) && pl.eggs.every((e) => e.fried === !!pl.q.fried);
      const seasonRight = (pl.q.salt === "yes") === !!pl.salt && (pl.q.pepper === "yes") === !!pl.pepper;
      const ok = kindsRight && seasonRight;
      if (!ok) allRight = false;
      for (let i = 0; i < 3; i++) {
        const s = T(S.add.circle(x + (i - 1) * 30, py - 20, 12, col("white"), 0.6).setDepth(D.item + 2));
        S.tweens.add({ targets: s, y: py - 140, alpha: 0, scale: 2.4, duration: 1500, delay: i * 220, repeat: 1, onComplete: () => s.destroy() });
      }
      // the pose swap: happy when it's right, else they stay neutral (decision 8, 7 Nov: chai's progress display, never a frown)
      const mood = ok ? "happy" : "neutral";
      if (S.textures.exists(`${who}-${mood}`)) img.setTexture(`${who}-${mood}`);
      if (ok) {
        Cook.sfx.right();
        await Cook.tween(S, { targets: img, y: img.y - 26, duration: 170, yoyo: true, repeat: 1, ease: "Sine.easeOut" });
      } else Cook.sfx.soft();
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
