/*
 * proto-kitchen (Zafar's rapid prototype, 1 Nov): the baking station, his turn-by-turn design.
 * Spec: build/reports/designs/prototype-notes-2026-11-01.md "Baking"; cook-baking-eggs.md, its end note (his design wins).
 *
 * One camera, side-on at the counter (the mock-up's): the mixing bowl in the middle, the containers standing in a row
 * in front (the glass jars with no marks, the bottle, the carton, the tub), each with its word card; from L3 the
 * measuring jug beside the bowl, its lines at a quarter, half, full, one and a half and two and a half (no numbers).
 *   - Nani gives ONE instruction at a time; its row appears on the card as she says it (UI.mission.reveal).
 *   - Tap what she names: it lifts over the bowl (or the jug). Each tap tips it a bit more and some goes in:
 *       "a little": one tap, it stops, "that's good";   "a lot": tap until it's a lot, "enough"; more taps don't land;
 *       "a little more": "a little", tap, "still a little more", tap, "enough";
 *       the jug: tap until the jug reaches the amount (a quarter cup a tap), "enough"; then it tips into the bowl.
 *     The row ticks the moment the amount is there (Zafar, 1 Nov: counts and amounts tick at the number).
 *   - Tap the bowl: the dough. Then the oven, the same camera: its door shut and open as two pictures, the naan its own
 *     picture, steam. Tap the oven: it opens; tap the naan: in it goes and the door shuts; its ring fills; when Nani says
 *     it's ready, tap the oven: out it comes with steam, and Nana's happy face.
 *   - The cat (Simba) peeks over the counter's edge.
 * Placeholder art: the Cook shelf's front-on containers, crops of the mock-ups (assets/cook/proto/) and simple shapes.
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
  const KEY = "baking";
  const P = "assets/cook/proto/";
  const I = "assets/cook/items/";
  // the art colours are data (data/stations/baking.json station.palette)
  const col = (k) => parseInt(String((((Cook.data.stations || {})[KEY] || {}).palette || {})[k] || "").slice(1), 16);
  const SHELF = {
    "cook-atto": I + "shelf-cook-atto-bare-f.webp",
    "cook-paani": I + "shelf-cook-paani-bare-f.webp",
    "cook-dudh": I + "shelf-cook-dudh-bare-f.webp",
    "cook-khun": I + "shelf-cook-khun-bare-f.webp",
    "spi-16": I + "shelf-loon-jar-v2-f.webp",
    "ph-dahi": I + "shelf-ph-dahi-bare-f.webp",
    "ph-ghee": I + "shelf-ph-ghee-bare-f.webp",
  };
  const POUR = { "cook-atto": "atto", "cook-paani": "paani", "cook-dudh": "dudh", "cook-khun": "khun", "spi-16": "loon", "ph-dahi": "dahi", "ph-ghee": "ghee" };
  const LIQUID = ["cook-paani", "cook-dudh"];
  const JUG_LINES = [1, 2, 4, 6, 10]; // quarter cups: a quarter, half, full, one and a half, two and a half (no numbers)
  const JUG_MAX = 10;

  Mech.combined(KEY, {
    station: KEY,
    view: "marble",
    dataFile: "data/stations/baking.json",
    zones: [],
    async run(host, p) {
      return baking(host, p);
    },
  });

  async function baking(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const level = host.level;
    const plan = p.plan || [];
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const who = p.who || "nana";
    const ids = [...new Set(plan.map((s) => s.id))];
    const pool = Object.keys(SHELF).filter((id) => !ids.includes(id));
    const decoys = Cook.shuffle(pool).slice(0, K.decoys || 1);
    const onShelf = Cook.shuffle(ids.concat(decoys));
    await St.loadArt(
      S,
      onShelf
        .map((id) => [`bk-${id}`, SHELF[id]])
        .concat([
          ["px-bake-bowl", P + "bake-bowl.webp"],
          ["px-bake-naan", P + "bake-naan.webp"],
          ["px-cat-peek", P + "cat-peek.webp"],
          ["bk-dough", "assets/cook/props/dough-ball.webp"],
        ])
        .concat(Cook.Kit.faceArt(who))
    ).catch(() => {});
    const objs = [];
    const T = (o) => (objs.push(o), S.track(o));
    const seen = (Cook.save.seenStation = Cook.save.seenStation || {});
    const fresh = (global.Onboard && global.Onboard.newPlayer && global.Onboard.newPlayer()) || !(Cook.save.coached || {})[KEY];
    const first = (k) => {
      const key = `${KEY}:first-${k}`;
      if (!fresh || seen[key]) return false;
      seen[key] = true;
      return true;
    };
    const speak = (line) => UI.voice(line).catch(() => {}); // never waited for: the child is never held for speech

    /* ---------------- the side-on counter ---------------- */
    const bg = T(S.add.graphics().setDepth(D.bg + 2));
    bg.fillStyle(col("wall"), 1).fillRect(-400, -400, 2400, 900);
    bg.lineStyle(3, col("tile"), 1);
    for (let y = -400; y < 470; y += 70) bg.lineBetween(-400, y, 2000, y);
    for (let x = -400; x < 2000; x += 140) for (let y = -400; y < 470; y += 140) bg.lineBetween(x, y, x, y + 70), bg.lineBetween(x + 70, y + 70, x + 70, y + 140);
    bg.fillStyle(col("counter"), 1).fillRect(-400, 470, 2400, 700);
    bg.fillStyle(col("counterEdge"), 1).fillRect(-400, 470, 2400, 10);
    // the cat peeks over the counter's back edge (right), breathing
    const cat = T(S.add.image(1500, 486, "px-cat-peek").setOrigin(0.5, 1).setDepth(D.bg + 3));
    cat.setScale(200 / cat.width);
    S.tweens.add({ targets: cat, y: 480, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    // the mixing bowl (centre), its contents a mound that rises
    const bowlX = 820;
    const bowlY = 520;
    const bowl = T(S.add.image(bowlX, bowlY, "px-bake-bowl").setDepth(D.item));
    bowl.setScale(380 / bowl.width);
    const mound = T(S.add.graphics().setDepth(D.item + 0.05));
    let mixAmt = 0;
    const mixCols = [];
    const drawMound = () => {
      mound.clear();
      const h = Math.min(90, 10 + mixAmt * 7);
      const c = mixCols.length ? mixCols[mixCols.length - 1] : col("atto");
      if (mixAmt > 0) mound.fillStyle(c, 1).fillEllipse(bowlX, bowlY - bowl.displayHeight * 0.3 + 6, 290, h);
    };

    // the measuring jug (L3 up): glass, with lines and no numbers
    let jug = null;
    if (K.jug) {
      const jx = 470;
      const jy = 470;
      const jw = 150;
      const jh = 230;
      const c = T(S.add.container(jx, jy).setDepth(D.item + 0.5));
      const fill = S.add.graphics();
      const g = S.add.graphics();
      g.fillStyle(col("shadow"), 0.12).fillEllipse(6, jh / 2 + 4, jw + 30, 22);
      g.fillStyle(col("glass"), 0.45).fillRoundedRect(-jw / 2, -jh / 2, jw, jh, 16);
      g.lineStyle(5, col("glassEdge"), 0.9).strokeRoundedRect(-jw / 2, -jh / 2, jw, jh, 16);
      g.lineStyle(10, col("glassEdge"), 0.9).beginPath().arc(jw / 2 + 4, -10, 46, -1.2, 1.2).strokePath();
      g.fillStyle(col("glassEdge"), 0.9).fillTriangle(-jw / 2 - 4, -jh / 2, -jw / 2 - 26, -jh / 2 - 18, -jw / 2 + 14, -jh / 2);
      const lineY = (u) => jh / 2 - 12 - (u / JUG_MAX) * (jh - 30);
      g.lineStyle(4, col("line"), 0.85);
      JUG_LINES.forEach((u) => g.lineBetween(-jw / 2 + 8, lineY(u), -jw / 2 + (u === 4 || u === 10 ? 64 : 42), lineY(u)));
      c.add([fill, g]);
      c.setSize(jw + 60, jh + 40);
      jug = { c, units: 0, fill, lineY, jw, jh, x: jx, y: jy, color: col("paani") };
      jug.draw = () => {
        fill.clear();
        if (jug.units <= 0) return;
        const top = lineY(jug.units);
        fill.fillStyle(jug.color, 0.95).fillRoundedRect(-jw / 2 + 5, top, jw - 10, jh / 2 - 6 - top, { tl: 2, tr: 2, bl: 12, br: 12 });
      };
    }

    // the containers standing in a row in front, each with its word card
    const shelf = {};
    const n = onShelf.length;
    onShelf.forEach((id, i) => {
      const x = n === 1 ? 800 : 260 + (i * 1080) / Math.max(1, n - 1);
      const img = T(S.add.image(x, 820, `bk-${id}`).setOrigin(0.5, 1).setDepth(D.item + 1));
      img.setScale(Math.min(170 / img.height, 150 / img.width));
      img.home = { x, y: 820 };
      img.wordId = id;
      shelf[id] = img;
      const chip = Cook.Kit.chip(S, id, x, 860, { word: Cook.chipWord ? Cook.chipWord(id, ctx) : true });
      objs.push(chip);
    });

    /* ---------------- pouring ---------------- */
    const stream = T(S.add.graphics().setDepth(D.item + 0.4));
    const pourOnce = async (img, into, color, liquid) => {
      // the stream from the container's lip into the target, a short fall
      const lipX = img.x + Math.cos(((img.angle - 90) * Math.PI) / 180) * img.displayHeight * 0.55;
      const lipY = img.y - img.displayHeight * 0.55 * Math.max(0.2, Math.cos((img.angle * Math.PI) / 180));
      const tx = into.x;
      const ty = into.y;
      for (let f = 0; f < 6; f++) {
        stream.clear();
        stream.fillStyle(color, liquid ? 0.85 : 1);
        if (liquid) stream.fillRect(Math.min(lipX, tx) + Math.abs(lipX - tx) * 0.5 - 7, Math.min(lipY, ty), 14, Math.abs(ty - lipY));
        else for (let k = 0; k < 14; k++) stream.fillCircle(lipX + (tx - lipX) * (k / 14) + (Math.random() - 0.5) * 12, lipY + (ty - lipY) * (k / 14), 4 + Math.random() * 3);
        await Cook.wait(55);
      }
      stream.clear();
    };

    const shelfItems = () => Object.assign({}, shelf);
    let lit = null;
    const light = (o, now = false) => {
      if (lit && lit !== o) S.glow(lit, false);
      lit = o;
      if (o) S.glow(o, true, { bounce: true, now });
    };
    const expectTap = (o, key) => {
      const c = S.centre(o);
      z.expect({ kind: "tap", x: c.x, y: c.y, key });
    };

    /** one instruction: Nani says it, its row appears; the child taps the container, then taps to tip it, to the amount */
    async function step(s, i) {
      if (UI.mission.reveal) UI.mission.reveal(`bake-${i + 1}`);
      const jugStep = s.amt === "jug" && jug;
      const amtLine = s.amt === "lot" ? Lang.line("alot") : s.amt === "jug" ? null : Lang.line("little");
      const doIt = Lang.say({ fn: "DoIt", verb: "v.put-in", obj: Lang.itemOf(jugStep ? s.parts : [s.id]) });
      const line = amtLine ? Lang.join([doIt, amtLine]) : doIt;
      speak(line);
      // which one: the shared step (the help ladder's pause, then her word and the glow; a wrong one wiggles at L1)
      const r = await S.step({
        items: shelfItems(),
        expected: s.id,
        sayLine: line,
        io: z.io,
        quiet: z.quiet,
        onWrong: (key) => z.listen(false, `took ${key} for ${s.id}`),
        onLand: (key, obj) => S.tweens.add({ targets: obj, y: obj.home.y - 30, duration: 140, yoyo: true }),
      });
      z.listen(true, `took ${s.id}`);
      if (!ctx.guided && Lang.known(s.id)) Cook.markRight(s.id);
      const img = shelf[r.key];
      const into = jugStep ? { x: jug.x, y: jug.y - jug.jh / 2 - 10 } : { x: bowlX, y: bowlY - 60 };
      // lift it over the target
      await Cook.tween(S, { targets: img, x: into.x - 150, y: into.y - 60, duration: 360, ease: "Cubic.easeOut" });
      const color = col(POUR[s.id] || "atto");
      const liquid = LIQUID.includes(s.id);
      if (jugStep) jug.color = color;
      // how many taps, and Nani's turns
      const need = s.amt === "little" ? 1 : s.amt === "more" ? 2 : s.amt === "lot" ? K.lotTaps || 4 : s.units || 4;
      let taps = 0;
      let busy = false;
      if (first("tip")) light(img, true);
      await new Promise((resolve) => {
        const tap = async () => {
          if (busy || taps >= need) return; // more taps don't land
          busy = true;
          taps++;
          S.glow(img, false);
          lit = null;
          // each tap tips it a bit more (to 115 degrees), and some goes in
          const ang = Math.min(115, 30 + taps * (85 / Math.max(1, need)));
          await Cook.tween(S, { targets: img, angle: ang, duration: 160 });
          Cook.sfx.pour ? Cook.sfx.pour() : Cook.sfx.pop();
          await pourOnce(img, jugStep ? { x: jug.x, y: jug.y } : { x: bowlX, y: bowlY - 40 }, color, liquid);
          if (jugStep) {
            jug.units = taps;
            jug.draw();
          } else {
            mixAmt += 1;
            mixCols.push(color);
            drawMound();
          }
          if (s.amt === "more" && taps === 1) speak(Lang.line("stillmore"));
          busy = false;
          if (taps >= need) return resolve();
          expectTap(img, s.id);
          S.glow(img, true, { bounce: true }); // the help ladder: lit only after the pause
          lit = img;
        };
        S.tappable(img, tap);
        expectTap(img, s.id);
        S.glow(img, true, { bounce: true });
        lit = img;
      });
      S.untap(img);
      S.glow(img, false);
      z.expect({ kind: "wait" });
      // the amount is there: the row ticks at once (Zafar, 1 Nov), then her word
      UI.mission.tickItem(s.id, 0, { close: true });
      Cook.sfx.right();
      speak(s.amt === "little" ? Lang.line("good") : Lang.line("enough"));
      await Cook.tween(S, { targets: img, angle: 0, x: img.home.x, y: img.home.y, duration: 380, ease: "Cubic.easeInOut" });
      if (jugStep) {
        // the jug tips into the bowl by itself
        await Cook.tween(S, { targets: jug.c, x: bowlX - 170, y: bowlY - 200, angle: 70, duration: 420 });
        await pourOnce({ x: jug.c.x, y: jug.c.y, angle: 70, displayHeight: jug.jh }, { x: bowlX, y: bowlY - 40 }, color, true);
        jug.units = 0;
        jug.draw();
        mixAmt += Math.max(1, Math.round((s.units || 4) / 2));
        mixCols.push(color);
        drawMound();
        await Cook.tween(S, { targets: jug.c, x: jug.x, y: jug.y, angle: 0, duration: 380 });
      }
      await Cook.wait(250);
    }

    for (let i = 0; i < plan.length; i++) await step(plan[i], i);

    // the dough: tap the bowl
    speak(Lang.line("now", Lang.phrase(["ph-naan"])));
    await new Promise((resolve) => {
      S.tappable(bowl, () => {
        S.untap(bowl);
        resolve();
      });
      expectTap(bowl, "ph-naan");
      light(bowl, first("bowl"));
    });
    S.glow(bowl, false);
    mound.clear();
    const dough = T(S.add.image(bowlX, bowlY - bowl.displayHeight * 0.36, "bk-dough").setDepth(D.item + 0.05));
    dough.setScale(170 / dough.width).setAlpha(0);
    await Cook.tween(S, { targets: dough, alpha: 1, scaleY: dough.scaleY * 1.1, duration: 300, yoyo: true });
    Cook.sfx.pop();
    await Cook.wait(400);

    /* ---------------- the oven (the same camera) ---------------- */
    await Cook.tween(S, { targets: objs.filter((o) => o && o.active && o !== bg && o !== cat), alpha: 0, duration: 300 });
    objs.filter((o) => o && o.active && o !== bg && o !== cat).forEach((o) => o.destroy());
    await oven(S, ctx, z, { who, K, T, light, expectTap, speak, first });
    if (!ctx.guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[KEY] = true;
    }
    UI.mission.closeItem([], 0, { all: true });
    await Cook.wait(600);
    z.close();
    return { baked: 1 };
  }

  /** The oven: shut and open as two pictures, the naan its own picture, steam. */
  async function oven(S, ctx, z, { who, K, T, light, expectTap, speak, first }) {
    const ox = 900;
    const oy = 130;
    const ow = 560;
    const oh = 460;
    // the oven's body (built in under the counter line), the two door pictures
    const body = T(S.add.graphics().setDepth(D.item - 1));
    body.fillStyle(col("shadow"), 0.15).fillRoundedRect(ox - ow / 2 + 8, oy + 10, ow, oh, 18);
    body.fillStyle(col("steel"), 1).fillRoundedRect(ox - ow / 2, oy, ow, oh, 18);
    body.fillStyle(col("steelDark"), 1).fillRect(ox - ow / 2 + 30, oy + 22, ow - 60, 34);
    const shut = T(S.add.container(ox, oy + 70).setDepth(D.item + 1));
    const sg = S.add.graphics();
    sg.fillStyle(col("ovenGlass"), 1).fillRoundedRect(-ow / 2 + 30, 0, ow - 60, oh - 100, 14);
    sg.fillStyle(col("ovenGlow"), 0.18).fillRoundedRect(-ow / 2 + 60, 30, ow - 120, oh - 160, 10);
    sg.fillStyle(col("steel"), 1).fillRoundedRect(-ow / 2 + 60, 14, ow - 120, 16, 8);
    shut.add(sg);
    shut.setSize(ow - 60, oh - 100);
    const open = T(S.add.container(ox, oy + 70).setDepth(D.item + 1).setVisible(false));
    const og = S.add.graphics();
    og.fillStyle(col("ovenInside"), 1).fillRoundedRect(-ow / 2 + 30, 0, ow - 60, oh - 100, 14);
    og.fillStyle(col("ovenGlow"), 0.55).fillRoundedRect(-ow / 2 + 50, 16, ow - 100, oh - 150, 10);
    og.lineStyle(4, col("rack"), 1);
    for (let x = -ow / 2 + 60; x < ow / 2 - 50; x += 28) og.lineBetween(x, oh - 190, x + 10, oh - 150);
    og.lineBetween(-ow / 2 + 50, oh - 170, ow / 2 - 50, oh - 170);
    // the door, folded down
    og.fillStyle(col("ovenGlass"), 1).fillRect(-ow / 2 + 10, oh - 100, ow - 20, 40);
    og.fillStyle(col("steel"), 1).fillRect(-ow / 2 + 40, oh - 66, ow - 80, 14);
    open.add(og);
    open.setSize(ow - 60, oh - 100);
    const hit = T(S.add.rectangle(ox, oy + oh / 2 + 20, ow - 40, oh - 60, col("white"), 0.001).setDepth(D.item + 3));
    const ring = T(S.add.graphics().setDepth(D.fx + 1));
    const steam = (x, y, k = 3) => {
      for (let i = 0; i < k; i++) {
        const s = T(S.add.circle(x + (Math.random() - 0.5) * 120, y, 14 + Math.random() * 10, col("steam"), 0.55).setDepth(D.fx + 2));
        S.tweens.add({ targets: s, y: y - 160 - Math.random() * 60, alpha: 0, scale: 2.6, duration: 1400 + i * 120, delay: i * 120, onComplete: () => s.destroy() });
      }
    };
    // the naan on its tray (the counter, left)
    const naan = T(S.add.image(330, 560, "px-bake-naan").setDepth(D.item + 2));
    naan.setScale(260 / naan.width).setAlpha(0.92);
    naan.setTint(col("dough"));
    const tapOn = (o) =>
      new Promise((resolve) => {
        S.tappable(o, () => {
          S.untap(o);
          resolve();
        });
      });
    // 1. open the oven
    expectTap(hit, null);
    light(shut, first("oven"));
    await tapOn(hit);
    S.glow(shut, false);
    shut.setVisible(false);
    open.setVisible(true);
    Cook.sfx.click();
    // 2. the naan in
    expectTap(naan, "ph-naan");
    light(naan, first("naan"));
    await tapOn(naan);
    S.glow(naan, false);
    await Cook.tween(S, { targets: naan, x: ox, y: oy + oh - 150, scale: naan.scale * 0.9, duration: 520, ease: "Cubic.easeInOut" });
    naan.setDepth(D.item + 0.5);
    await Cook.wait(200);
    open.setVisible(false);
    shut.setVisible(true);
    naan.setVisible(false);
    Cook.sfx.click();
    // 3. it bakes: the ring fills; steam from the vent
    z.expect({ kind: "wait" });
    const bakeMs = (K.bakeMs || 3600) / (Cook.speed || 1);
    const t0 = Date.now();
    await new Promise((resolve) => {
      const off = z.tick(() => {
        const p = Math.min(1, (Date.now() - t0) / bakeMs);
        const x = ox + ow / 2 - 70;
        const y = oy + 40;
        ring.clear();
        ring.lineStyle(10, col("ring"), 0.95).beginPath().arc(x, y, 34, 0, Math.PI * 2).strokePath();
        ring.lineStyle(10, col("ringBand"), 1).beginPath().arc(x, y, 34, -Math.PI / 2 + 0.8 * Math.PI * 2, (3 * Math.PI) / 2).strokePath();
        ring.lineStyle(6, p >= 0.8 ? col("ringDone") : col("ringFill"), 1).beginPath().arc(x, y, 34, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2).strokePath();
        if (Math.random() < 0.04) steam(ox, oy, 1);
        if (p >= 0.8) {
          off();
          resolve();
        }
      });
    });
    speak(Lang.line("ready"));
    // 4. take it out
    expectTap(hit, "ph-naan");
    light(shut, true);
    await tapOn(hit);
    S.glow(shut, false);
    ring.clear();
    shut.setVisible(false);
    open.setVisible(true);
    Cook.sfx.click();
    speak(Lang.line("careful"));
    naan.clearTint();
    naan.setVisible(true);
    steam(ox, oy + 120, 6);
    await Cook.wait(300);
    await Cook.tween(S, { targets: naan, x: 330, y: 560, scale: naan.scale / 0.9, duration: 560, ease: "Cubic.easeInOut" });
    steam(330, 520, 4);
    open.setVisible(false);
    shut.setVisible(true);
    UI.mission.closeItem(["ph-naan"], 0, { head: true });
    const look = await Cook.Kit.review(S, { who, ok: true, x: 330, y: 300, size: 220, side: "right" });
    await Cook.wait(400);
    await look.close();
  }

  Mech.lab(KEY, {
    name: "Baking (prototype)",
    verb: "Nani's turns: a little, a lot; then the oven",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.baking.make("nana", { level: L.level });
      const K = Mech.knobs(KEY, { level: L.level });
      d.plan = Cook.pick(K.plans || [[]]);
      L.ctx.steps = R.baking.steps(d);
      L.card(d, L.ctx.steps);
      await L.station(KEY, { plan: d.plan, who: "nana" });
    },
  });
})(window);
