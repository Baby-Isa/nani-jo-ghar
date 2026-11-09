/*
 * The corn stall (Zafar's rapid prototype, 1 Nov; on the farm, day 2): a sekelo redress on one screen. Sprint 18 (s18-g-corn): the
 * game is its settings file (data/stations/corn.json, read as Cook.data.settings.corn) and its own mechanic, below; everything else
 * is a kit call. Spec: build/reports/designs/prototype-notes-2026-11-01.md "The corn stall"; its gap page:
 * docs/design-language/standard/gaps/corn.md.
 *
 * Its own mechanic (non-negotiable 1, kept as he made it):
 *   1. Tap the crate: a cob goes on the grill (as many as asked, as many as the grill holds; an extra doesn't land).
 *   2. Its ring fills; tap it to turn it, once. Its second side fills; tap it: onto the plate. The order's head ticks when the
 *      plate has the number asked (Zafar, 1 Nov).
 *   3. Tap what they asked for: it goes onto the corn, named as it goes on; its row ticks. A "no" or an unasked one lands quietly
 *      and is judged at the serve. A second tap on it takes it back (non-negotiable 7) until the plate is served.
 *   4. Tap the plate: it's theirs.
 * The kits: the order and its card (Cook.Recipes, the lab's card), the steps in Nani's box (St.steps: a step's call is said once its
 * step opens), the lights (Cook.Coach.firsts, .control, .wrong, .lessons), the heat ring (Cook.Kit.heatRing), the word cards
 * (Cook.Kit.chip), the serve (NjgServe.round: the faces, the recast, a wrong plate redone on the spot, St.redo). Hannah Mami hosts
 * the farm: Nani's box stands in until her approved sheet exists.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout } from "../life.js";
import { NjgServe } from "../../shared/serve.js"; // the shared kit's serving (Sprint 18 piece 8)

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const KEY = "corn";
  /** The game's settings (data/stations/corn.json, loaded with the data: Mech.stationData). */
  const SET = () => ((Cook.data && Cook.data.settings) || {})[KEY] || {};

  Mech.combined(KEY, {
    station: KEY,
    view: "marble",
    dataFile: "data/stations/corn.json",
    selfBegin: true, // (CK-48: its pictures load behind the order, then the view begins: never a bare worktop)
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
    const set = SET();
    const sc = set.scene || {};
    const it = set.items || {};
    const lay = sc.layout || {};
    const mo = set.motion || {};
    const pal = (set.station || {}).palette || {};
    const col = (k) => parseInt(String(pal[k] || "").slice(1), 16);
    const sp = () => Cook.speed || 1;
    const COB = (set.recipe || {}).dish || "n.corn-on-the-cob";
    const DRESS = (it.dressings || {}).files || {};
    const ids = ((set.recipe || {}).dress || Object.keys(DRESS)).filter((id) => DRESS[id]);
    const who = p.who || (set.recipe || {}).who || "cousin";
    const count = Math.max(1, p.count || 1);
    const asked = p.dress || [];
    const nos = p.no || [];
    const slots = K.slots || 3;
    const sideMs = K.sideMs || 2600;
    // S19 (CK-65; Zafar, 8 Nov: "the green zone is way too short"): the green lasts greenMs (the settings, by level: at least chai's
    // green at the same level), the cob ready to turn or lift from its start; its heat ring runs over the side and the green together
    const greenMs = K.greenMs || 4500;
    const greenLo = sideMs / (sideMs + greenMs);
    const guided = !!ctx.guided;
    const dish = ctx.dishAt || 0;
    const states = (it.cob || {}).states || {};
    const tex = { raw: "cn-raw", half: "cn-half", turned: "cn-turned", done: "cn-done" };
    // (the art the settings name, loaded behind the order; settings.assets lists the same files)
    await St.loadArt(
      S,
      ids
        .map((id) => [`cn-${id}`, DRESS[id]])
        .concat(Object.keys(tex).filter((k) => states[k]).map((k) => [tex[k], states[k]]))
        .concat([
          ["cn-table", sc.bg],
          ["cn-crate", (it.crate || {}).file],
          ["cn-grill", (sc.grill || {}).file],
          ["cn-plate", (sc.plate || {}).file],
        ])
        .filter((a) => a[1])
        .concat(Cook.Kit.faceArt(who))
    ).catch(() => {});
    await St.begin(S, ctx, KEY, "marble");
    // the stall's table (CT), never a code-drawn one
    if (S.textures.exists("cn-table")) S.setBg("cn-table");
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const T = (o) => S.track(o);
    const at = (o, d) => (o && o.at) || d;

    /* ---------------- the stall: the person's face, the crate, the grill, the plate, the tray ---------------- */
    const fa = lay.face || {};
    const faceAt = at(fa, [1310, -40]);
    const face = T(S.add.image(faceAt[0], faceAt[1], Cook.Kit.badge(S, who)).setDisplaySize(fa.size || 150, fa.size || 150).setDepth(D.item + 2));
    const crAt = at(it.crate, [230, 40]);
    const crate = T(S.add.image(crAt[0], crAt[1], "cn-crate").setDepth(D.item));
    crate.setScale((((it.crate || {}).drawn || {}).w || 380) / crate.width);
    crate.wordId = COB;
    const grAt = at(sc.grill, [760, 250]);
    const grill = T(S.add.image(grAt[0], grAt[1], "cn-grill").setDepth(D.item - 1));
    grill.setScale((((sc.grill || {}).drawn || {}).w || 640) / grill.width);
    const plAt = at(sc.plate, [1310, 250]);
    const plate = T(S.add.image(plAt[0], plAt[1], "cn-plate").setDepth(D.item - 1));
    plate.setScale((((sc.plate || {}).drawn || {}).w || 360) / plate.width);
    plate.setAngle((sc.plate || {}).angle || 0);
    // the tray of dressings (art plan Q7: a plain drawn board), each with its word card
    const tr = lay.tray || {};
    const tx0 = tr.x0 || 200;
    const tx1 = tr.x1 || 1400;
    const pad = tr.pad || 50;
    const ty = tr.y || 590;
    const th = tr.h || 200;
    const shOff = tr.shadow || [8, 10];
    const tray = T(S.add.graphics().setDepth(D.item - 2));
    tray.fillStyle(col("shadow"), 0.18).fillRoundedRect(tx0 - pad + shOff[0], ty + shOff[1], tx1 - tx0 + 2 * pad, th, tr.r || 26);
    tray.fillStyle(col("tray"), 1).fillRoundedRect(tx0 - pad, ty, tx1 - tx0 + 2 * pad, th, tr.r || 26);
    tray.lineStyle(tr.edge || 10, col("trayEdge"), 1).strokeRoundedRect(tx0 - pad, ty, tx1 - tx0 + 2 * pad, th, tr.r || 26);
    const bowls = {};
    const dw = ((it.dressings || {}).drawn || {}).w || 150;
    const chipY = (lay.chips || {}).y || 852;
    ids.forEach((id, i) => {
      const x = tx0 + (i * (tx1 - tx0)) / Math.max(1, ids.length - 1);
      const img = T(S.add.image(x, (it.dressings || {}).row_y || 690, `cn-${id}`).setDepth(D.item));
      img.setScale(dw / Math.max(img.width, img.height));
      img.wordId = id;
      bowls[id] = img;
      // (its pill is part of its light: the kit's parts, C.parts; S19, CK-61)
      img.chip = Cook.Kit.chip(S, id, x, chipY, { word: Cook.chipWord ? Cook.chipWord(id, ctx) : true, w: (lay.chips || {}).w || 200 });
    });

    /* ---------------- the cobs ---------------- */
    const ringL = lay.ring || {};
    const sm = lay.smoke || {};
    const smoke = (x, y) => {
      const r = sm.r || [10, 8];
      const s = T(S.add.circle(x + (Math.random() - 0.5) * 40, y, r[0] + Math.random() * r[1], col("smoke"), 0.45).setDepth(D.fx + 2));
      S.tweens.add({ targets: s, y: y - (sm.rise || 120), alpha: 0, scale: sm.grow || 2.2, duration: mo.smokeMs || 1300, onComplete: () => s.destroy() });
    };
    const gy = (lay.grill || {}).y || grAt[1];
    const slotX = (i) => grAt[0] + (i - (slots - 1) / 2) * ((lay.grill || {}).slotGap || 170);
    const cobLong = ((it.cob || {}).drawn || {}).long || 250;
    const cobs = [];
    const onPlate = [];
    const dressed = [];
    const drops = {}; // id -> its drops drawn on the cobs
    let made = 0;
    let plating = 0; // (cobs on their way to the plate: they count as made)
    let moving = 0; // (the game's own moves in flight: they hold the stuck hint, Cook.Coach.control's busy)
    let served = false;
    let serveNow = null;
    let serveP = null;
    const newServe = () => (serveP = new Promise((r) => (serveNow = r)));
    newServe();
    const fly = async (o) => {
      moving++;
      try {
        return await Cook.tween(S, o);
      } finally {
        moving--;
      }
    };

    /* ---------------- the steps, their calls and their lights (the kits) ---------------- */
    // the first-time gate for this round (kit (d), STD-D1-01); Nani's steps (St.steps: a step's call is said once it opens, so nothing
    // is said after a skip before the first step, contract-95); each step's light the first time with its call, after that only after
    // the level's wait from the last action (Cook.Coach.control: contract-24, STD-D2-01), at once after a wrong move (Cook.Coach.wrong)
    const gate = Cook.Coach.firsts(KEY, { round: new Set() });
    const steps = St.steps(ctx);
    const hintMs = () => (global.Rules && global.Rules.hintMs ? global.Rules.hintMs(Cook.roundLevel(ctx)) : 7000);
    let ctl = null;
    let stuck = null;
    let ctlId = null;
    let lit = null;
    let hints = 0;
    const glow = (o) => {
      if (lit && lit !== o && lit.active) S.glow(lit, false);
      lit = o;
      if (o) S.glow(o, true, { bounce: true, now: true }); // (now: with its light, never the ladder's deferred glow)
    };
    /** The next thing to do, published once: the light, the step, the helper card and the test hooks read it (STD-F3-05). */
    function nextThing() {
      if (served) return { step: null };
      const ready = cobs.find((c) => c.state === "turn" || c.state === "lift");
      if (ready && ready.state === "turn") return { step: "turn", id: ready.n, o: ready.img, key: COB, line: Lang.line("guide-firai"), again: true };
      if (ready) return { step: "lift", id: ready.n, o: ready.img, key: COB, line: Lang.line("lift", Lang.phrase([COB])), again: true };
      if (cobs.length + plating + onPlate.length < count && cobs.length < slots) return { step: "grill", o: crate, key: COB, line: Lang.line("now", Lang.phrase([COB])) };
      if (cobs.length) return { step: "wait" };
      const left = asked.find((id) => !dressed.includes(id));
      // (an item's step: said only as her helper card opens to show it, never as the step opens: SH-172, STD-D3-03)
      if (left && bowls[left]) return { step: "dress", id: left, o: bowls[left], key: left, word: left, line: St.addLine(left), noCall: "helper" };
      return { step: "serve", o: plate, key: COB, line: null };
    }
    function lead(n) {
      const id = n.o ? `${n.step}:${n.id != null ? n.id : ""}` : n.step;
      if (id === ctlId) return;
      ctlId = id;
      if (ctl) ctl.close();
      ctl = null;
      if (stuck) stuck.close();
      stuck = null;
      glow(null);
      if (!n.o) {
        // (nothing to tap while the cobs grill: the step closes, no light, no hint)
        z.expect(n.step === "wait" ? { kind: "wait" } : null);
        steps.done();
        return;
      }
      const c = S.centre(n.o);
      // (the test hooks: an unasked dressing for the mistake player, STD-F5-02)
      const wrongs = n.word ? ids.filter((x) => !asked.includes(x) && !dressed.includes(x)).map((x) => S.centre(bowls[x])) : null;
      z.expect(Object.assign({ kind: "tap", x: c.x, y: c.y, key: n.key }, wrongs && wrongs.length ? { wrongs } : {}));
      // STD-D2-05 (non-negotiable 4): an asked-for dressing past support gets no light (the light would be the answer); never lit the
      // first time either (CHAI-32: never the first ordered item)
      const OB = global.Onboard;
      const hides = !!(n.word && OB && OB.hintHides && OB.hintHides({ answer: true, stage: Cook.wordStage ? Cook.wordStage(n.word) : null, study: guided }));
      const first = n.word ? false : gate.first(n.step);
      // S19 (CK-61, SH-230): the light round the thing whole, with its pill and its hop's room (the kit's parts, part by part, so the
      // light's one rule leaves its room round their union: contract-92); was the picture's box with no room
      const target = [0, 1, 2, 3, 4, 5].map((i) => () => (n.o.active && n.o.visible ? Cook.Coach.parts(n.o)[i] || null : null));
      const current = () => ctlId === id && !served;
      // (its glow lasts as long as its light, which goes as the child starts the move: contract-102, SH-236)
      const lightGlow = () => {
        // (only a thing on the band glows and hops with its light; anything else is lit alone, so Nani's call reading its row is the
        // one other highlight: contract-8)
        if (!Cook.Coach.onShelf(n.o)) return;
        glow(n.o);
        setTimeout(() => {
          const h = ctl && ctl.lit ? ctl.lit() : null;
          const off = () => lit === n.o && glow(null);
          if (h && h.done) h.done.then(off);
          else off();
        }, 0);
      };
      ctl = Cook.Coach.control({ key: KEY, target, first, noHint: true, current, busy: () => moving > 0, onLight: lightGlow });
      // SH-228 (chai's method): the stuck help after the level's wait from the last action (a child's time: the kit divides a game's wait
      // by the test speed), at once after a wrong move: her helper card naming the thing (an item's step), else her line again, with the
      // light. Never where the light would be the answer (hides: a dressing past support, STD-D2-05)
      if (!hides && Cook.Coach.stuck)
        stuck = Cook.Coach.stuck({
          key: KEY,
          target,
          hintMs: () => hintMs() * (Cook.speed || 1),
          current,
          busy: () => moving > 0,
          // (only a thing on the band glows and hops in its light, SH-237; anything else is lit alone: contract-8)
          // (its glow goes with its light too, however the light goes: contract-102)
          // (and it comes once the light has faded in, Onboard's 300 ms and a beat, so the glow is never seen without its light)
          glow: (on) => {
            if (!Cook.Coach.onShelf(n.o)) return;
            if (!on) return void (lit === n.o && glow(null));
            const h = stuck && stuck.lit ? stuck.lit() : null;
            let gone = false;
            if (h && h.done) h.done.then(() => ((gone = true), lit === n.o && glow(null)));
            setTimeout(() => !gone && !served && ctlId === id && glow(n.o), 450);
          },
          onHint: () => hints++,
        });
      if (n.line) {
        const st = steps.to(`${KEY}:${n.step}`, { id, line: n.line, again: !!n.again, noCall: n.noCall || null });
        if (stuck) kitHelps(st);
      }
      else steps.done();
    }
    const refresh = () => lead(nextThing());
    // (the test hook: what a tap would take back now, the last dressing on, until the serve: the take-back player's)
    Cook.undoAt = () => (!served && dressed.length && bowls[dressed[dressed.length - 1]] ? S.centre(bowls[dressed[dressed.length - 1]]) : null);
    const acted = () => St.acted && St.acted();

    S.tappable(crate, () => {
      if (served || cobs.length + plating + onPlate.length >= count || cobs.length >= slots) {
        S.wiggle(crate);
        return;
      }
      const i = [...Array(slots).keys()].find((k) => !cobs.some((c) => c.slot === k));
      const img = T(S.add.image(crate.x, crate.y, tex.raw).setDepth(D.item + 0.5));
      img.setScale(cobLong / Math.max(img.width, img.height));
      img.wordId = COB;
      const c = { img, n: made++, slot: i, side: 0, p: 0, t0: 0, state: "fly", ring: Cook.Kit.heatRing(S, { depth: D.fx + 1 }) };
      cobs.push(c);
      Cook.sfx.pop();
      z.progress({ cob: i });
      refresh();
      fly({ targets: img, x: slotX(i), y: gy, duration: mo.flyMs || 420, ease: "Cubic.easeOut" }).then(() => {
        c.state = "cook";
        c.t0 = Date.now();
        if (Cook.sfx.sizzle) Cook.sfx.sizzle(0.5);
        S.tappable(img, () => tapCob(c));
        acted();
        refresh();
      });
    });

    const tapCob = async (c) => {
      if (c.state === "turn") {
        // turned once: it rolls over (a squash to 0.6 and back: its light's box fades out round it, contract-53), its ungrilled side up
        c.state = "flip";
        refresh();
        const sx = c.img.scaleX;
        await fly({ targets: c.img, scaleX: sx * (mo.flipK || 0.6), duration: mo.flipMs || 140 });
        c.img.setTexture(S.textures.exists(tex.turned) ? tex.turned : tex.half);
        await fly({ targets: c.img, scaleX: sx, duration: mo.flipMs || 140 });
        Cook.sfx.click();
        c.side = 1;
        c.p = 0;
        c.t0 = Date.now();
        c.state = "cook";
        z.skill(100, "turn");
        acted();
        return refresh();
      }
      if (c.state === "lift") {
        c.state = "off";
        S.untap(c.img);
        c.ring.destroy();
        cobs.splice(cobs.indexOf(c), 1);
        const k = onPlate.length + plating;
        const pg = lay.plate || {};
        plating++;
        refresh();
        await fly({ targets: c.img, x: plAt[0] + (k - (count - 1) / 2) * (pg.gap || 64), y: plAt[1], scale: c.img.scale * (pg.cobK || 0.85), duration: mo.flyMs || 420, ease: "Cubic.easeOut" });
        plating--;
        onPlate.push(c);
        c.img.setDepth(D.item + 0.2);
        Cook.sfx.pop();
        if (!guided && Lang.known(COB)) Cook.markRight(COB);
        // the plate has the number asked: the order's head ticks at once (Zafar, 1 Nov)
        if (onPlate.length === count) UI.mission.closeItem([COB], dish, { head: true });
        acted();
        return refresh();
      }
      S.wiggle(c.img);
    };

    z.tick(() => {
      let changed = false;
      cobs.forEach((c) => {
        // (S19, CK-65: the ring keeps filling through the green while the cob waits to be turned or lifted)
        if (c.state !== "cook" && c.state !== "turn" && c.state !== "lift") return;
        c.p = Math.min(1, (Date.now() - c.t0) / ((sideMs + greenMs) / sp()));
        // the kit's heat ring over the cob (one heat language): gold up to the sage band; ready from the green's start
        c.ring.draw(c.img.x, c.img.y - c.img.displayHeight / 2 - (ringL.dy || 46), ringL.r || 34, c.p, greenLo, 1);
        if (c.state !== "cook") return;
        if (Math.random() < (sm.chance || 0.03)) smoke(c.img.x, c.img.y - 40);
        if (c.side === 0 && c.p >= greenLo * 0.5 && c.img.texture.key === tex.raw) c.img.setTexture(tex.half);
        if (c.side === 1 && c.p >= greenLo * 0.5 && c.img.texture.key !== tex.done) c.img.setTexture(tex.done);
        if (c.p >= greenLo) {
          c.state = c.side === 0 ? "turn" : "lift";
          changed = true;
        }
      });
      if (changed) refresh();
    });

    // what goes on: named as it goes on, its row ticks; a second tap takes it back until the plate is served (non-negotiable 7)
    const dropsOn = (id) => {
      const dr = lay.drops || {};
      const liquid = (dr.liquid || []).includes(id);
      const g = T(S.add.graphics().setDepth(D.item + 0.4).setAlpha(0));
      g.fillStyle(col(id), liquid ? 0.85 : 1);
      onPlate.forEach((c) => {
        for (let k = 0; k < (dr.n || 16); k++) g.fillCircle(c.img.x + (Math.random() - 0.5) * (dr.w || 50), c.img.y + (Math.random() - 0.5) * c.img.displayHeight * (dr.h || 0.8), liquid ? dr.liquidR || 6 : dr.dryR || 3);
      });
      S.tweens.add({ targets: g, alpha: 1, duration: mo.dropInMs || 260 });
      return g;
    };
    const takeOff = (id) => {
      dressed.splice(dressed.indexOf(id), 1);
      const g = drops[id];
      delete drops[id];
      if (g) S.tweens.add({ targets: g, alpha: 0, duration: mo.dropInMs || 260, onComplete: () => g.destroy() });
      if (asked.includes(id)) UI.mission.reopen([id], dish);
    };
    Object.values(bowls).forEach((img) => {
      S.tappable(img, async () => {
        const id = img.wordId;
        if (served || !onPlate.length) {
          S.wiggle(img);
          return;
        }
        if (dressed.includes(id)) {
          // taken back: its drops go, its row opens again
          takeOff(id);
          Cook.sfx.click();
          z.progress({ off: id });
          acted();
          return refresh();
        }
        dressed.push(id);
        Lang.speakWord(id);
        const ok = asked.includes(id);
        z.listen(ok, ok ? `put ${id}` : `put ${id}, not asked`);
        if (!ok) Cook.Coach.wrong(KEY); // (a wrong move brings the stuck hint at once: STD-D2-04)
        const dot = T(S.add.circle(img.x, img.y, 22, col(id), 1).setDepth(D.fx));
        refresh();
        await fly({ targets: dot, x: plAt[0], y: plAt[1], duration: mo.dropMs || 420, ease: "Cubic.easeInOut" });
        dot.destroy();
        if (!dressed.includes(id) || drops[id]) return; // (taken back while it flew)
        drops[id] = dropsOn(id);
        Cook.sfx.pop();
        if (ok) {
          UI.mission.tickItem(id, dish, { close: true });
          if (!guided && Lang.known(id)) Cook.markRight(id);
        }
        acted();
        refresh();
      });
    });

    S.tappable(plate, () => {
      if (served || onPlate.length < count || cobs.length || plating) {
        S.wiggle(plate);
        return;
      }
      served = true;
      serveNow();
    });

    // STD-D1-08 (contract-98): the reveal lessons, the dotted word then the blurred picture, once the order has landed and before the
    // first step (kit (d)); then the first step opens and its call is said
    if (Cook.Coach.lessons) await Cook.Coach.lessons({ gate, ctx, busy: () => moving > 0 });
    refresh();

    /* ---------------- the serve: the kit's tick, faces, recast and redo (decision 51) ---------------- */
    const serve = NjgServe.for(Cook);
    const rev = lay.review || {};
    const revAt = at(rev, [1310, 60]);
    const rowsOf = (want) => {
      const L = UI.mission.ladders ? UI.mission.ladders()[dish] : null;
      return L && Cook.Order ? Cook.Order.rows(L, { all: true }).filter((r) => !r.head && r.ids.some((x) => want.includes(x))) : [];
    };
    await serve.round({
      items: [KEY],
      done: async () => {
        await serveP;
        if (ctl) ctl.close();
        ctl = null;
        if (stuck) stuck.close();
        stuck = null;
        ctlId = null;
        glow(null);
        steps.done();
        z.expect(null);
        // (the light's layer fades out over the plate for 300 ms: the face comes after it, so no box crosses it, contract-82)
        await new Promise((r) => setTimeout(r, mo.lightFadeMs || 320));
      },
      check: (item, round) => {
        const missing = asked.filter((id) => !dressed.includes(id));
        const extra = dressed.filter((id) => !asked.includes(id));
        const ok = !missing.length && !extra.length;
        if (!round) {
          missing.forEach((id) => {
            UI.mission.missItem(id, dish);
            z.listen(false, `left out ${id}`);
            if (!guided) Cook.markMiss(id);
          });
          extra.forEach((id) => z.listen(false, nos.includes(id) ? `put ${id} (they said no)` : `put ${id}, not asked`));
        }
        const bad = rowsOf(missing.concat(extra.filter((id) => nos.includes(id))));
        if (!ok && UI.mission.serveWrong) UI.mission.serveWrong(bad.length ? bad.map((r) => r.ids[0]) : missing.concat(extra), dish);
        // (what they say again: those rows; an unasked one has no row of its own, so their whole order, as the kit's recast does)
        return { ok, rows: bad.length ? bad : null };
      },
      review: async (wrong) => {
        face.setVisible(false);
        return [await serve.review(S, { who, ok: !wrong.length, x: revAt[0], y: revAt[1], size: rev.size || 230, side: "left" })];
      },
      oops: () => z.oops(),
      recast: async (item, rows) => {
        await UI.personSay(who, rows ? { rows } : {});
      },
      afterReview: () => face.setVisible(true),
      redo: St.redo(ctx),
      key: () => `${KEY}:${who}`,
      showRight: async () => {
        // the third wrong try: the right way shown (what was asked goes on, nothing else)
        dressed.filter((id) => !asked.includes(id)).forEach(takeOff);
        asked
          .filter((id) => !dressed.includes(id))
          .forEach((id) => {
            dressed.push(id);
            drops[id] = dropsOn(id);
            UI.mission.tickItem(id, dish, { close: true });
          });
        await Cook.wait(mo.endHoldMs || 500);
      },
      reset: () => dressed.slice().forEach(takeOff),
      again: () => {
        served = false;
        newServe();
        refresh();
      },
    });
    Cook.undoAt = null;
    UI.mission.closeItem([], dish, { all: true });
    await Cook.wait(mo.endHoldMs || 500);
    if (!guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[KEY] = true;
    }
    // a finished round counts towards the level-up (the central rules); a grown-up's pick never moves it
    if (Cook.roundDone && !guided) {
      const dsh = ctx.order && ctx.order.dishes ? ctx.order.dishes[dish] : null;
      Cook.roundDone(KEY, { level: Cook.roundLevel(ctx), hints, grownUp: !!ctx.lab || !(dsh && dsh.autoLevel) });
    }
    z.close();
    return { served: onPlate.length };
  }

  /*
   * SH-228 (contract-22): where the kit's stuck help (Cook.Coach.stuck) runs a step's hesitation help, the step's own ladder in Nani's
   * stepper stays quiet, so her line is never said twice (the helper card's call, then the stepper's again: "Hane makai!" twice 1.4 s
   * apart at 1920x1080). St.steps.to passes no helpAfter to UI.step (a kit change in the report), so the opened step is marked as
   * helped with no clock: never due.
   */
  const kitHelps = (st) => {
    if (st && typeof st === "object" && "helped" in st) {
      st.helped = true;
      st.helpedAt = Infinity;
    }
    return st;
  };
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
