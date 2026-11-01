/*
 * proto-kitchen (Zafar's rapid prototype, 1 Nov): the farm's corn stall, a sekelo redress on one screen.
 * Spec: build/reports/designs/prototype-notes-2026-11-01.md "The corn stall".
 *
 * One camera, top-down at the stall's table (the mock-up's): the box of raw cobs (left) and the cooked plate (right)
 * either side of the grill, the chutneys and dressings on a tray below, each with its word card.
 *   1. Tap the box: a cob goes on the grill (as many as asked; an extra doesn't land).
 *   2. Its ring fills; it glows ("Firai!"): tap it to turn it, once. Its second side fills; it glows ("Makai hane kadh."):
 *      tap it, it goes onto the plate. The order's head ticks when the plate has the number asked.
 *   3. Tap what they asked for: it goes onto the corn, named as it goes on; its row ticks. A "no" or an unasked one lands
 *      quietly and is judged at the end.
 *   4. Tap the plate: it's theirs; their happy face (or a gentle frown).
 * The order is recipes.corn (data/cook.json). Hannah Mami hosts the farm: Nani's guide box stands in until her lines exist.
 * Placeholder art: crops of the corn-stall mock-up (assets/cook/proto/), the sekelo grill and plate.
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
  const KEY = "corn";
  const P = "assets/cook/proto/";
  const COB = "n.corn-on-the-cob";
  const col = (k) => parseInt(String((((Cook.data.stations || {})[KEY] || {}).palette || {})[k] || "").slice(1), 16);
  const DRESS = { "fru-02": "corn-lemon", "spi-16": "corn-salt", "spi-04": "corn-chilli", "ph-lili": "corn-chutney-green", "ph-amli": "corn-chutney-red", "spi-11": "corn-pepper" };
  const LIQUID = ["ph-lili", "ph-amli", "fru-02"];

  Mech.combined(KEY, {
    station: KEY,
    view: "marble",
    dataFile: "data/stations/corn.json",
    zones: [],
    async run(host, p) {
      return corn(host, p);
    },
  });

  async function corn(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const level = host.level;
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const who = p.who || "cousin";
    const count = Math.max(1, p.count || 1);
    const asked = p.dress || [];
    const nos = p.no || [];
    const slots = K.slots || 3;
    const sideMs = K.sideMs || 2600;
    await St.loadArt(
      S,
      Object.keys(DRESS)
        .map((id) => [`cn-${id}`, `${P}${DRESS[id]}.webp`])
        .concat([
          ["cn-box", P + "corn-box.webp"],
          ["cn-raw", P + "corn-cob-raw.webp"],
          ["cn-half", P + "corn-cob-half.webp"],
          ["cn-done", P + "corn-cob-done.webp"],
          ["cn-grill", "assets/cook/items/v3/sekelo/grill.webp"],
          ["cn-plate", "assets/cook/items/v3/sekelo/plate-plain-t.webp"],
        ])
        .concat(Cook.Kit.faceArt(who))
    ).catch(() => {});
    const T = (o) => S.track(o);
    const seen = (Cook.save.seenStation = Cook.save.seenStation || {});
    const fresh = (global.Onboard && global.Onboard.newPlayer && global.Onboard.newPlayer()) || !(Cook.save.coached || {})[KEY];
    const first = (k) => {
      const key = `${KEY}:first-${k}`;
      if (!fresh || seen[key]) return false;
      seen[key] = true;
      return true;
    };
    const speak = (line) => UI.voice(line).catch(() => {});

    /* ---------------- the stall's table (top-down) ---------------- */
    const bg = T(S.add.graphics().setDepth(D.bg + 2));
    bg.fillStyle(col("table"), 1).fillRect(-400, -400, 2400, 1700);
    bg.lineStyle(3, col("tableGrain"), 0.35);
    for (let y = -380; y < 1300; y += 58) bg.lineBetween(-400, y, 2000, y + 10);
    // the person at the stall, top right (their face: the order is theirs)
    const face = T(S.add.image(1310, -40, Cook.Kit.badge(S, who)).setDisplaySize(150, 150).setDepth(D.item + 2));
    const box = T(S.add.image(230, 40, "cn-box").setDepth(D.item));
    box.setScale(380 / box.width);
    const grill = T(S.add.image(760, 250, "cn-grill").setDepth(D.item - 1));
    grill.setScale(640 / grill.width);
    const plate = T(S.add.image(1310, 250, "cn-plate").setDepth(D.item - 1));
    plate.setScale(360 / plate.width);
    plate.setAngle(90);
    // the tray of dressings, each with its word card
    const tray = T(S.add.graphics().setDepth(D.item - 2));
    const ids = Object.keys(DRESS);
    const tx0 = 200;
    const tx1 = 1400;
    tray.fillStyle(col("shadow"), 0.18).fillRoundedRect(tx0 - 50 + 8, 590 + 10, tx1 - tx0 + 100, 200, 26);
    tray.fillStyle(col("tray"), 1).fillRoundedRect(tx0 - 50, 590, tx1 - tx0 + 100, 200, 26);
    tray.lineStyle(10, col("trayEdge"), 1).strokeRoundedRect(tx0 - 50, 590, tx1 - tx0 + 100, 200, 26);
    const bowls = {};
    ids.forEach((id, i) => {
      const x = tx0 + (i * (tx1 - tx0)) / (ids.length - 1);
      const img = T(S.add.image(x, 690, `cn-${id}`).setDepth(D.item));
      img.setScale(150 / Math.max(img.width, img.height));
      img.wordId = id;
      bowls[id] = img;
      Cook.Kit.chip(S, id, x, 852, { word: Cook.chipWord ? Cook.chipWord(id, ctx) : true, w: 200 });
    });

    /* ---------------- the cobs ---------------- */
    const ring = T(S.add.graphics().setDepth(D.fx + 1));
    const smoke = (x, y, k = 2) => {
      for (let i = 0; i < k; i++) {
        const s = T(S.add.circle(x + (Math.random() - 0.5) * 40, y, 10 + Math.random() * 8, col("smoke"), 0.45).setDepth(D.fx + 2));
        S.tweens.add({ targets: s, y: y - 120, alpha: 0, scale: 2.2, duration: 1300, delay: i * 140, onComplete: () => s.destroy() });
      }
    };
    const slotX = (i) => 760 + (i - (slots - 1) / 2) * 170;
    const cobs = [];
    const onPlate = [];
    const dressed = [];
    let lit = null;
    let done = false;
    let finish = null;
    const doneP = new Promise((r) => (finish = r));
    const light = (o, now = false) => {
      if (lit && lit !== o) S.glow(lit, false);
      lit = o;
      if (o) S.glow(o, true, { bounce: true, now });
    };
    const expectTap = (o, key) => {
      const c = S.centre(o);
      z.expect({ kind: "tap", x: c.x, y: c.y, key });
    };
    const total = () => cobs.length + onPlate.length;
    function nextThing() {
      const ready = cobs.find((c) => c.state === "turn" || c.state === "lift");
      if (ready) return { o: ready.img, key: COB };
      if (total() < count && cobs.length < slots) return { o: box, key: COB };
      if (cobs.length) return { o: null };
      const left = asked.find((id) => !dressed.includes(id));
      if (left) return { o: bowls[left], key: left };
      return { o: plate, key: COB };
    }
    function refresh() {
      if (done) return;
      const n = nextThing();
      if (n.o) {
        light(n.o);
        expectTap(n.o, n.key);
      } else {
        light(null);
        z.expect({ kind: "wait" });
      }
    }

    S.tappable(box, () => {
      if (total() >= count || cobs.length >= slots) {
        S.wiggle(box);
        return;
      }
      const i = [...Array(slots).keys()].find((k) => !cobs.some((c) => c.slot === k));
      const img = T(S.add.image(box.x, box.y, "cn-raw").setDepth(D.item + 0.5));
      img.setScale(220 / img.height);
      const c = { img, slot: i, side: 0, p: 0, t0: 0, state: "fly" };
      cobs.push(c);
      Cook.sfx.pop();
      Cook.tween(S, { targets: img, x: slotX(i), y: 250, duration: 420, ease: "Cubic.easeOut" }).then(() => {
        c.state = "cook";
        c.t0 = Date.now();
        if (Cook.sfx.sizzle) Cook.sfx.sizzle(0.5);
        S.tappable(img, () => tapCob(c));
        refresh();
      });
      z.progress({ cob: i });
      refresh();
    });

    const tapCob = async (c) => {
      if (c.state === "turn") {
        // turn it once: it rolls over (a squash and back), its other side now on the fire
        c.state = "flip";
        S.glow(c.img, false);
        await Cook.tween(S, { targets: c.img, scaleX: 0.02, duration: 140 });
        c.img.setTexture("cn-half");
        await Cook.tween(S, { targets: c.img, scaleX: c.img.scaleY, duration: 140 });
        Cook.sfx.click();
        c.side = 1;
        c.p = 0;
        c.t0 = Date.now();
        c.state = "cook";
        z.skill(100, "turn");
        return refresh();
      }
      if (c.state === "lift") {
        c.state = "off";
        S.glow(c.img, false);
        S.untap(c.img);
        cobs.splice(cobs.indexOf(c), 1);
        const k = onPlate.length;
        await Cook.tween(S, { targets: c.img, x: 1310 + (k - (count - 1) / 2) * 64, y: 250, scale: c.img.scale * 0.85, duration: 420, ease: "Cubic.easeOut" });
        onPlate.push(c);
        c.img.setDepth(D.item + 0.2);
        Cook.sfx.pop();
        if (!ctx.guided && Lang.known(COB)) Cook.markRight(COB);
        // the plate has the number asked: the order's head ticks at once (Zafar, 1 Nov)
        if (onPlate.length === count) UI.mission.closeItem([COB], 0, { head: true });
        return refresh();
      }
      S.wiggle(c.img);
    };

    z.tick(() => {
      ring.clear();
      let changed = false;
      cobs.forEach((c) => {
        if (c.state !== "cook") return;
        c.p = Math.min(1, (Date.now() - c.t0) / (sideMs / (Cook.speed || 1)));
        const x = c.img.x;
        const y = c.img.y - c.img.displayHeight / 2 - 30;
        ring.lineStyle(9, col("ring"), 0.95).beginPath().arc(x, y, 24, 0, Math.PI * 2).strokePath();
        ring.lineStyle(5, c.p >= 1 ? col("ringDone") : col("ringFill"), 1).beginPath().arc(x, y, 24, -Math.PI / 2, -Math.PI / 2 + c.p * Math.PI * 2).strokePath();
        if (Math.random() < 0.03) smoke(x, c.img.y - 40, 1);
        if (c.side === 0 && c.p >= 0.5 && c.img.texture.key === "cn-raw") c.img.setTexture("cn-half");
        if (c.side === 1 && c.p >= 0.5 && c.img.texture.key === "cn-half") c.img.setTexture("cn-done");
        if (c.p >= 1) {
          c.state = c.side === 0 ? "turn" : "lift";
          changed = true;
          speak(c.side === 0 ? Lang.line("guide-firai") : Lang.line("lift", Lang.phrase([COB])));
          if (first(c.state)) light(c.img, true);
        }
      });
      if (changed) refresh();
    });

    // what goes on: named as it goes on; its row ticks
    Object.values(bowls).forEach((img) => {
      S.tappable(img, async () => {
        const id = img.wordId;
        if (!onPlate.length || dressed.includes(id)) {
          S.wiggle(img);
          return;
        }
        dressed.push(id);
        Lang.speakWord(id);
        const ok = asked.includes(id);
        z.listen(ok, ok ? `put ${id}` : `put ${id}, not asked`);
        const dot = T(S.add.circle(img.x, img.y, 22, col(id), 1).setDepth(D.fx));
        await Cook.tween(S, { targets: dot, x: 1310, y: 250, duration: 420, ease: "Cubic.easeInOut" });
        dot.destroy();
        // the dressing on each cob: drops or a drizzle in its colour
        onPlate.forEach((c) => {
          const g = T(S.add.graphics().setDepth(D.item + 0.4));
          g.fillStyle(col(id), LIQUID.includes(id) ? 0.85 : 1);
          for (let k = 0; k < 16; k++) g.fillCircle(c.img.x + (Math.random() - 0.5) * 50, c.img.y + (Math.random() - 0.5) * c.img.displayHeight * 0.8, LIQUID.includes(id) ? 6 : 3);
        });
        Cook.sfx.pop();
        if (ok) {
          UI.mission.tickItem(id, 0, { close: true });
          if (!ctx.guided && Lang.known(id)) Cook.markRight(id);
        }
        refresh();
      });
    });

    S.tappable(plate, () => {
      if (onPlate.length < count || cobs.length) {
        S.wiggle(plate);
        return;
      }
      done = true;
      finish();
    });

    speak(Lang.line("now", Lang.phrase([COB])));
    if (first("box")) light(box, true);
    refresh();
    await doneP;
    light(null);
    z.expect(null);
    // served: their face over the plate
    const right = asked.every((id) => dressed.includes(id)) && !dressed.some((id) => nos.includes(id) || !asked.includes(id));
    UI.mission.closeItem([], 0, { all: true });
    face.setVisible(false);
    const look = await Cook.Kit.review(S, { who, ok: right, x: 1310, y: 60, size: 230, side: "left" });
    await Cook.wait(500);
    await look.close();
    if (!ctx.guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[KEY] = true;
    }
    z.close();
    return { served: onPlate.length };
  }

  Mech.lab(KEY, {
    name: "Corn stall (prototype)",
    verb: "Grill, turn once, then what goes on",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.corn.make("nana", { level: L.level });
      L.ctx.steps = R.corn.steps(d);
      L.card(d, L.ctx.steps);
      await L.station(KEY, { count: d.count, dress: d.dress, no: d.no, who: "nana" });
    },
  });
})(window);
