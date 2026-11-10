/*
 * The corn stall (Zafar's rapid prototype, 1 Nov; on the farm, day 2). Sprint 18 (s18-g-corn): the game is its settings file
 * (data/stations/corn.json, read as Cook.data.settings.corn) and its own mechanic, below; everything else is a kit call.
 *
 * Sprint 19, wave B (CK-67; Zafar, 9 Nov: "make it the same as Sekelo ... the same two tray setup ... Cooked and uncooked, same barbecue,
 * same grill"; his yes to two screens: "first grill them all and then flavour them on the next screen ... then you can flavour different
 * corns differently"): two screens on the one grill kit (js/cook/grill-kit.js, which sekelo, fish and steak use next; corn's own parts
 * stay here).
 *   Screen 1, the grill (sekelo's option 3 exactly): the raw cobs lie two by two on the stone band; the grill big on the left, the cooked
 *     tray on its right. Tap a cob: it grows as it goes up onto the grill, turns upright and rests on its rims. Its heat ring fills;
 *     on the green tap it to turn it (cob-turned); on the green again tap it: it shrinks into the tray (cob-done). As many as asked (one
 *     a person); an extra stays on the band (a wiggle).
 *   Screen 2, the flavour: each cob on its person's cream plate with their face circle; the six dressing bowls on the band with their
 *     word pills. One person at a time, left to right: tap what they asked for and it goes on their cob (drawn on it in code), named as
 *     it goes on, their row ticks; a "no" or an unasked one goes on quietly and is judged when they get it; a second tap takes it back
 *     (non-negotiable 7) until they have it. Tap their plate: it's theirs (their face, right or a gentle no; a wrong one is redone on
 *     the spot, decision 51); then the next person.
 * Its own mechanic as he made it (non-negotiable 1): grill, turn once, take off, what goes on, give it to them.
 * The kits: the order and its card (Cook.Recipes, the lab's card), the steps in Nani's box (St.steps), the lights (Cook.Coach.firsts,
 * .control, .stuck, .wrong, .lessons, .began), the heat ring (Cook.Kit.heatRing), the word pills (Shelf.P.chip, chai's; the shared shelf's
 * slots and pill rule), the band (the kitchen kit's stone band), the serve (NjgServe.round, .review). Hannah Mami hosts the farm: Nani's
 * box stands in until her approved sheet exists.
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout } from "../life.js";
import { NjgServe } from "../../shared/serve.js"; // the shared kit's serving (Sprint 18 piece 8)
import "../grill-kit.js"; // the one grill kit (S19 wave B): Cook.GrillKit

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const KEY = "corn";
  const FAR = 2000;
  /** The game's settings (data/stations/corn.json, loaded with the data: Mech.stationData). */
  const SET = () => ((Cook.data && Cook.data.settings) || {})[KEY] || {};
  const BAND = () => (global.Shelf && global.Shelf.BAND) || { top: 630, bottom: 900, base: 818, chipY: 860, chipH: 46 };

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

  /** S19 wave B: the settings' order is the recipe (one plate per person, each their own mix), registered once its data is in. */
  function register() {
    const o = SET().order;
    const R = Cook.Recipes;
    if (!o || !R || !R.add || register.done) return;
    register.done = true;
    R.add(KEY, JSON.parse(JSON.stringify(o)));
  }

  /**
   * A thing's word pill on the band: the shared kit's pill as chai's shelf has it (Shelf.P.chip: its own face's width, the row's rule
   * fits it, SH-219; its card's size kept, so the light and its checks take the pill as part of the thing).
   */
  function pill(S, id, x, y, ctx) {
    const chip = global.Shelf.P.chip(S, x, y, Cook.display(id), {
      word: Cook.chipWord ? Cook.chipWord(id, ctx) : true,
      depth: D.item + 2,
      shade: (Cook.Kit && Cook.Kit.INK && Cook.Kit.INK.shade) || undefined,
      onTap: () => {
        Cook.unlockAudio();
        if (Cook.onLabel) Cook.onLabel(id);
        Lang.speakWord(id);
      },
    });
    chip.pillId = id;
    return chip;
  }

  /**
   * The band along the bottom (the kitchen kit's, one call): every thing on it is top-down, so it is the stone tray (ART-69, SH-243:
   * St.stoneBand's tray, the shared Shelf.P.tray, where the kit has it; the stone band before that).
   */
  function band(S, o) {
    return St.stoneBand ? St.stoneBand(S, Object.assign({}, o, { tray: true })) : null;
  }

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
    const col = (k) => (pal[k] ? parseInt(String(pal[k]).slice(1), 16) : global.Tokens && global.Tokens.int ? global.Tokens.int("grey") : 0);
    const sp = () => Cook.speed || 1;
    const GK = Cook.GrillKit;
    const B = BAND();
    const COB = (set.recipe || {}).dish || "n.corn-on-the-cob";
    const DRESS = (it.dressings || {}).files || {};
    const ids = ((set.recipe || {}).dress || Object.keys(DRESS)).filter((id) => DRESS[id]);
    // the people and what each asked for (the order's plates); an old caller's one person (count, dress, no) still works
    const people = (p.plates && p.plates.length ? p.plates : [{ who: p.who || (set.recipe || {}).who || "cousin", dress: p.dress || [], no: p.no || [] }]).map((q) => ({
      who: q.who,
      asked: [].concat(q.dress || []).filter((id) => DRESS[id]),
      nos: [].concat(q.no || []),
      dressed: [],
      drops: {},
      served: false,
      cob: null,
    }));
    const count = people.length;
    const sideMs = K.sideMs || 2600;
    // S19 (CK-65; Zafar, 8 Nov: "the green zone is way too short"): the green lasts greenMs (the settings, by level: at least chai's
    // green at the same level), the cob ready to turn or lift from its start; its heat ring runs over the side and the green together
    const greenMs = K.greenMs || 4500;
    const greenLo = sideMs / (sideMs + greenMs);
    const guided = !!ctx.guided;
    const dish = ctx.dishAt || 0;
    const states = (it.cob || {}).states || {};
    const tex = { raw: "cn4-raw", turned: "cn4-turned", done: "cn4-done" };
    const thick = (it.cob || {}).thick || 0.18;
    // (the art the settings name, loaded behind the order; settings.assets lists the same files)
    await St.loadArt(
      S,
      ids
        .map((id) => [`cn4-${id}`, DRESS[id]])
        .concat(Object.keys(tex).filter((k) => states[k]).map((k) => [tex[k], states[k]]))
        .concat([["cn4-plate", (sc.plate || {}).file]])
        .concat(GK.art())
        .filter((a) => a[1])
        .concat(...[...new Set(people.map((q) => q.who))].map((w) => Cook.Kit.faceArt(w)))
    ).catch(() => {});
    await St.begin(S, ctx, KEY, "marble");
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const T = (o) => S.track(o);
    // the kitchen family's scene: the marble's wash above the band, the stone band along the bottom
    if (Cook.Kit.worktop) Cook.Kit.worktop(S, { top: B.top, far: FAR });
    const tray = band(S, { top: B.top, base: B.base, far: FAR, depth: D.bg + 1.2 });

    /* ---------------- screen 1: the grill (the grill kit's option 3) ---------------- */
    const gl = lay.grill || {};
    const L = GK.layout({ thick, n: 4, trayW: gl.trayW, bandLen: gl.bandLen, ringRoom: gl.ringRoom });
    const kit = GK.build(S, L);
    // (a test log: which screen is up, for the evidence probes' moments, "life:corn-screen")
    const screenNote = (step) => {
      try {
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("corn-screen", { step, by: `people:${count}` });
      } catch (e) {
        /* only a log */
      }
    };
    screenNote("grill");
    const places = Math.min(4, K.slots || 3);
    const raw = [0, 1, 2, 3].map((i) => {
      const at = L.band.at(i);
      const img = T(S.add.image(at.x, at.y, tex.raw).setDepth(D.item));
      GK.lay(img, { x: at.x, y: at.y, len: L.band.len });
      // (no word of its own on the band: a cob is the dish, not a word, so it has no pill, opt3s; the shelf line's rule, contract-109,
      // is for the band's words standing in a row with their pills, which the six bowls of screen 2 are)
      GK.shadow(S, img, { dx: 6, dy: 8, alpha: 0.26, blur: 5 });
      return img;
    });
    const sm = lay.smoke || {};
    const smoke = (x, y) => {
      const r = sm.r || [10, 8];
      const s = T(S.add.circle(x + (Math.random() - 0.5) * 30, y, r[0] + Math.random() * r[1], col("smoke"), 0.45).setDepth(D.fx + 2));
      S.tweens.add({ targets: s, y: y - (sm.rise || 120), alpha: 0, scale: sm.grow || 2.2, duration: mo.smokeMs || 1300, onComplete: () => s.destroy() });
    };
    const cobs = []; // on the grill
    const inTray = []; // done, lying in the tray
    let made = 0;
    let lifting = 0; // (cobs on their way to the tray: they count as made)
    let moving = 0; // (the game's own moves in flight: they hold the stuck hint, Cook.Coach.control's busy)
    let screen = 1;
    let active = 0; // (screen 2: whose cob the dressings go on, left to right)
    let serveNow = null;
    const fly = async (fn) => {
      moving++;
      try {
        return await fn();
      } finally {
        moving--;
      }
    };
    const onBand = () => raw.filter((o) => o.active && o.onBand !== false);

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
    const bowls = {};
    const plates = [];
    /** The next thing to do, published once: the light, the step, the helper card and the test hooks read it (STD-F3-05). */
    function nextThing() {
      if (screen === 1) {
        const ready = cobs.find((c) => c.state === "turn" || c.state === "lift");
        if (ready && ready.state === "turn") return { step: "turn", id: ready.n, o: ready.img, key: COB, line: Lang.line("guide-firai"), again: true };
        if (ready) return { step: "lift", id: ready.n, o: ready.img, key: COB, line: Lang.line("lift", Lang.phrase([COB])), again: true };
        const next = onBand()[0];
        if (next && cobs.length + lifting + inTray.length < count && cobs.length < places) return { step: "grill", o: next, key: COB, line: Lang.line("now", Lang.phrase([COB])) };
        return { step: "wait" };
      }
      if (screen !== 2) return { step: screen === 3 ? null : "wait" };
      const q = people[active];
      if (!q || q.served) return { step: null };
      const left = q.asked.find((id) => !q.dressed.includes(id));
      // (an item's step: said only as her helper card opens to show it, never as the step opens: SH-172, STD-D3-03)
      if (left && bowls[left]) return { step: "dress", id: `${active}:${left}`, o: bowls[left], key: left, word: left, line: St.addLine(left), noCall: "helper" };
      return { step: "serve", id: active, o: plates[active], key: COB, line: null };
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
      const q = people[active];
      const wrongs = n.word && q ? ids.filter((x) => !q.asked.includes(x) && !q.dressed.includes(x) && bowls[x]).map((x) => S.centre(bowls[x])) : null;
      z.expect(Object.assign({ kind: "tap", x: c.x, y: c.y, key: n.key }, wrongs && wrongs.length ? { wrongs } : {}));
      // STD-D2-05 (non-negotiable 4): an asked-for dressing past support gets no light (the light would be the answer); never lit the
      // first time either (CHAI-32: never the first ordered item)
      const OB = global.Onboard;
      const hides = !!(n.word && OB && OB.hintHides && OB.hintHides({ answer: true, stage: Cook.wordStage ? Cook.wordStage(n.word) : null, study: guided }));
      const first = n.word ? false : gate.first(n.step);
      // S19 (CK-61, SH-230): the light round the thing whole, with its pill, its face circle and its hop's room (the kit's parts, part
      // by part, so the light's one rule leaves its room round their union: contract-92)
      const target = [0, 1, 2, 3, 4, 5].map((i) => () => (n.o.active && n.o.visible ? Cook.Coach.parts(n.o)[i] || null : null));
      const current = () => ctlId === id && screen < 3;
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
      // SH-228 (chai's method): the stuck help after the level's wait from the last action, at once after a wrong move: her helper card
      // naming the thing (an item's step), else her line again, with the light. Never where the light would be the answer
      if (!hides && Cook.Coach.stuck)
        stuck = Cook.Coach.stuck({
          key: KEY,
          target,
          hintMs,
          current,
          busy: () => moving > 0,
          // (only a thing on the band glows and hops in its light, SH-237; anything else is lit alone: contract-8; its glow goes with
          // its light, however the light goes: contract-102)
          glow: (on) => {
            if (!Cook.Coach.onShelf(n.o)) return;
            glow(on ? n.o : null);
            const h = on && stuck && stuck.lit ? stuck.lit() : null;
            if (h && h.done) h.done.then(() => lit === n.o && glow(null));
          },
          onHint: () => hints++,
        });
      if (n.line) {
        const st = steps.to(`${KEY}:${n.step}`, { id, line: n.line, again: !!n.again, noCall: n.noCall || null });
        if (stuck) kitHelps(st);
      } else steps.done();
    }
    const refresh = () => lead(nextThing());
    const acted = () => St.acted && St.acted();
    // (SH-236: the light goes the moment the child starts a move)
    const began = () => Cook.Coach.began && Cook.Coach.began(KEY);

    // a raw cob on the band, tapped: it goes up onto the grill (as many as asked, as many places as the grill has)
    raw.forEach((img) =>
      S.tappable(img, () => {
        began();
        if (screen !== 1 || img.onBand === false || cobs.length + lifting + inTray.length >= count || cobs.length >= places) {
          S.wiggle(img);
          return;
        }
        img.onBand = false;
        S.untap(img);
        const used = cobs.map((c) => c.slot);
        // (the places fill from the grill's middle out)
        const slot = [1, 2, 0, 3].find((k) => !used.includes(k));
        const at = L.grill.at(slot, 4);
        const c = { img, n: made++, slot, at, side: 0, p: 0, t0: 0, state: "fly", ring: Cook.Kit.heatRing(S, { depth: D.fx + 1 }) };
        cobs.push(c);
        img.setDepth(D.item + 0.5);
        Cook.sfx.pop();
        z.progress({ cob: slot });
        refresh();
        fly(() => GK.move(S, img, { x: at.x, y: at.y, len: L.grill.len, up: true, ms: mo.bandMs || 520 })).then(() => {
          c.state = "cook";
          c.t0 = Date.now();
          if (Cook.sfx.sizzle) Cook.sfx.sizzle(0.5);
          S.tappable(img, () => tapCob(c));
          acted();
          refresh();
        });
      })
    );

    const tapCob = async (c) => {
      began();
      if (c.state === "turn") {
        // turned once: it rolls over where it lies (its light's box fades out round it, contract-53), the grilled side under
        c.state = "flip";
        refresh();
        await fly(() => GK.roll(S, c.img, tex.turned, { ms: mo.flipMs || 140, k: mo.flipK || 0.6 }));
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
        const k = inTray.length + lifting;
        lifting++;
        refresh();
        const at = L.tray.at(k);
        if (S.textures.exists(tex.done)) c.img.setTexture(tex.done);
        await fly(() => GK.move(S, c.img, { x: at.x, y: at.y, len: L.tray.len, up: false, ms: mo.trayMs || 460 }));
        lifting--;
        inTray.push(c);
        c.img.setDepth(D.item + 0.2);
        Cook.sfx.pop();
        if (!guided && Lang.known(COB)) Cook.markRight(COB);
        acted();
        // all made: the order's head ticks at once (Zafar, 1 Nov), then the flavour
        if (inTray.length === count) {
          UI.mission.closeItem([COB], dish, { head: true });
          return toPlates();
        }
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
        // the kit's heat ring over the cob's top end (one heat language): gold up to the sage band; ready from the green's start
        const r = L.ring(c.at);
        c.ring.draw(r.x, r.y, (lay.ring || {}).r || r.r, c.p, greenLo, 1);
        if (c.state !== "cook") return;
        if (Math.random() < (sm.chance || 0.03)) smoke(c.img.x, c.at.y - L.grill.len * 0.2);
        if (c.side === 1 && c.p >= greenLo * 0.5 && c.img.texture.key !== tex.done && S.textures.exists(tex.done)) c.img.setTexture(tex.done);
        if (c.p >= greenLo) {
          c.state = c.side === 0 ? "turn" : "lift";
          changed = true;
        }
      });
      if (changed) refresh();
    });

    /* ---------------- screen 2: the flavour (each cob on its person's plate, the dressings on the band) ---------------- */
    const pl = lay.plates || {};
    const bw = lay.bowls || {};
    const dressStyle = lay.dress || {};
    /** Each dressing drawn on a cob in code (the art plan's question 3), in the cob's own frame, so it lies along it on the plate. */
    const dropsOn = (q, id) => {
      const cob = q.cob;
      const g = T(S.add.graphics().setDepth(cob.depth + 0.1 + Object.keys(q.drops).length * 0.01).setAlpha(0));
      g.setPosition(cob.x, cob.y).setRotation(cob.rotation);
      const len = cob.displayWidth;
      const th = cob.displayHeight;
      const st = dressStyle[id] || { kind: "specks", n: 30 };
      // (the kernels: the cob's length less its stem end, about two thirds of its thickness across)
      const x0 = -len * 0.4;
      const x1 = len * 0.46;
      const hy = th * 0.3;
      let seed = (id.length * 131 + people.indexOf(q) * 977 + id.charCodeAt(id.length - 1)) >>> 0;
      const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
      const along = () => x0 + (x1 - x0) * rnd();
      const across = (x) => (rnd() * 2 - 1) * hy * (1 - Math.pow((x - (x0 + x1) / 2) / ((x1 - x0) / 2), 6) * 0.5);
      const c = col(id);
      const n = st.n || 30;
      if (st.kind === "drizzle") {
        // a chutney: a ribbon zig-zagging along the cob, its sheen a thinner lighter line
        const pts = [];
        for (let i = 0; i <= n * 2; i++) pts.push({ x: x0 + ((x1 - x0) * i) / (n * 2), y: (i % 2 ? 1 : -1) * hy * 0.75 });
        g.lineStyle(Math.max(3, th * 0.13), c, 0.95);
        g.strokePoints(pts, false);
        g.lineStyle(Math.max(1, th * 0.04), global.Tokens && global.Tokens.int ? global.Tokens.int("white") : col("spi-16"), 0.25);
        g.strokePoints(
          pts.map((pt) => ({ x: pt.x - th * 0.02, y: pt.y - th * 0.03 })),
          false
        );
      } else if (st.kind === "squeeze") {
        // lemon: its juice, glossy streaks along the kernels, and the squeezed wedge resting on the cob's tip end
        for (let i = 0; i < n; i++) {
          const x = along();
          g.fillStyle(col("lemonShine"), 0.8);
          g.fillEllipse(x, across(x) * 0.7, th * (0.4 + rnd() * 0.3), th * (0.08 + rnd() * 0.05));
        }
        const r = th * 0.62;
        const wx = x1 - len * 0.1;
        const wy = -th * 0.15;
        g.fillStyle(col("lemonRind"), 1);
        g.slice(wx, wy, r, 0, Math.PI, false).fillPath();
        g.fillStyle(c, 1);
        g.slice(wx, wy, r * 0.84, 0, Math.PI, false).fillPath();
        g.lineStyle(Math.max(1, th * 0.03), col("lemonShine"), 0.9);
        for (let k = 1; k < 5; k++) {
          const a = (Math.PI * k) / 5;
          g.lineBetween(wx, wy, wx + Math.cos(a) * r * 0.8, wy + Math.sin(a) * r * 0.8);
        }
      } else if (st.kind === "crystals") {
        // salt: small white crystals with a grey edge
        for (let i = 0; i < n; i++) {
          const x = along();
          const y = across(x);
          const s = Math.max(2, th * (0.04 + rnd() * 0.03));
          g.fillStyle(col("saltEdge"), 0.9);
          g.fillRect(x - s / 2 + 0.6, y - s / 2 + 0.6, s, s);
          g.fillStyle(c, 1);
          g.fillRect(x - s / 2, y - s / 2, s, s);
        }
      } else {
        // a powder (chilli) or specks (pepper): fine dots all along, a powder denser and finer
        const r0 = st.kind === "powder" ? 0.018 : 0.026;
        for (let i = 0; i < n; i++) {
          const x = along();
          g.fillStyle(c, st.kind === "powder" ? 0.85 : 0.95);
          g.fillCircle(x, across(x), Math.max(1.2, th * (r0 + rnd() * 0.014)));
        }
      }
      S.tweens.add({ targets: g, alpha: 1, duration: mo.dropInMs || 260 });
      return g;
    };
    const takeOff = (q, id) => {
      q.dressed.splice(q.dressed.indexOf(id), 1);
      const g = q.drops[id];
      delete q.drops[id];
      if (g) S.tweens.add({ targets: g, alpha: 0, duration: mo.dropInMs || 260, onComplete: () => g.destroy() });
      if (q.asked.includes(id)) UI.mission.reopen([id], dish, { for: q.who });
    };
    // (the test hook: what a tap would take back now, the active person's last dressing on, until they have it: the take-back player's)
    Cook.undoAt = () => {
      const q = people[active];
      return screen === 2 && q && !q.served && q.dressed.length && bowls[q.dressed[q.dressed.length - 1]] ? S.centre(bowls[q.dressed[q.dressed.length - 1]]) : null;
    };
    /** Who is dressed now: their plate and face full, the rest waiting a little dimmer (CMP-10: inactive things dim). */
    const showActive = () =>
      people.forEach((q, i) => {
        const a = q.served || i === active ? 1 : pl.dim || 0.62;
        [plates[i], q.face, q.cob].concat(Object.values(q.drops)).forEach((o) => o && o.active && S.tweens.add({ targets: o, alpha: a, duration: 220 }));
      });

    async function toPlates() {
      screen = 1.5;
      refresh();
      await fly(async () => {
        await Cook.wait(mo.endHoldMs || 400);
        // the grill, the tray and the cobs left on the band go; the cooked cobs stay, to go to their plates
        const away = [kit.grill, kit.tray].concat(onBand()).filter((o) => o && o.active);
        await Cook.tween(S, { targets: away, alpha: 0, duration: mo.screenMs || 380 });
        away.forEach((o) => o.destroy());
        // the six bowls on the band, each with its word pill (the shared shelf's pill, chai's floor): one row, or on a phone where the
        // pills at their floor can't share one row, two rows of three on a taller tray
        const lb = layBowls();
        // the plates, one a person, across the room above the band; each one's face circle at its upper left
        const n = count;
        const view = [150, 1450];
        const gap = pl.gap || 70;
        // (the plates above the bowls, their light's margin clear of the first row: contract-92)
        const room = lb.clear - lb.room - 16;
        const d = Math.min(pl.d || 400, (view[1] - view[0] - (n - 1) * gap) / n, room);
        const y = 16 + d / 2 + (room - d) / 2;
        const x0 = (view[0] + view[1]) / 2 - ((n - 1) * (d + gap)) / 2;
        people.forEach((q, i) => {
          const x = x0 + i * (d + gap);
          const plate = T(S.add.image(x, y, "cn4-plate").setDepth(D.item - 1).setAlpha(0));
          plate.setScale(d / Math.max(plate.width, plate.height));
          plate.wordId = COB;
          GK.shadow(S, plate, { dx: 8, dy: 11, alpha: 0.24, blur: 8 });
          const fs = d * (pl.face || 0.3);
          // (inside the plate's own square, so the light round the plate and its face is centred on the plate: contract-105)
          const fo = d / 2 - fs / 2;
          const face = T(S.add.image(x - fo, y - fo, Cook.Kit.badge(S, q.who)).setDisplaySize(fs, fs).setDepth(D.item + 2).setAlpha(0));
          plate.face = face; // (the light hugs the plate and its face circle: Cook.Coach.parts)
          q.face = face;
          q.at = { x, y, d };
          plates.push(plate);
          S.tweens.add({ targets: [plate, face], alpha: 1, duration: mo.screenMs || 380 });
        });
        // each person's cob from the tray to their plate, growing as it goes
        await Promise.all(
          people.map((q, i) => {
            const c = inTray[i];
            q.cob = c.img;
            c.img.setDepth(D.item + 0.3);
            return GK.move(S, c.img, { x: q.at.x + d * 0.02, y: q.at.y + d * 0.02, len: d * (pl.cob || 0.84), ms: mo.plateMs || 520 }).then(() => Cook.tween(S, { targets: c.img, angle: pl.angle != null ? pl.angle : -10, duration: 160 }));
          })
        );
      });
      screen = 2;
      active = 0;
      screenNote("flavour");
      if (ctx.nextStep) ctx.nextStep("Dress");
      showActive();
      acted();
      refresh();
    }
    /*
     * The six dressing bowls and their word pills (S19 wave B fix round; SH-219, chai's pill rule): every pill at least the floor
     * (Shelf.pillWant: the word at the platforms' smallest readable size on screen), never narrowed, never touching, and a light's
     * margin apart (the kit's Onboard.marginOf on the bowl's size), so a bowl's light, round its pill too, stops short of the next
     * (contract-92). Each slot is as wide as its own pill or its bowl, whichever is wider, laid side by side about the view's middle.
     * Where the six can't share one row at the floor (a phone: 740x320), they go in two rows of three on a taller stone tray, which
     * takes the band's place for this screen. Returns {top (the band's), clear (the first row's top), room (a light's margin)}, design px.
     */
    function layBowls() {
      const Sh = global.Shelf;
      let ppw = 1;
      try {
        ppw = UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x || 1;
      } catch (e) {
        ppw = 1;
      }
      // (the floor: the shared shelf's pill rule, and the kitchen kit's canvas text floor, 14 CSS px on the canvas's own scale, TXT-05)
      const want = Math.max(1, Sh.pillWant(ppw), Cook.Kit && Cook.Kit.textFloor ? Cook.Kit.textFloor(S, (Sh.PILL || {}).text || 25) : 1);
      const PH = (Sh.PILL || {}).h || 46;
      const OL = (global.Onboard && global.Onboard.LIGHT) || { share: 0.12, min: 8, max: 16, clear: 2 };
      const room = (sz) => Math.max(Sh.pillGap(ppw), (Math.max(OL.min, Math.min(OL.max, OL.share * sz * ppw)) + OL.clear + 4) / ppw);
      const V = Cook.view || {};
      const vl = Math.max(V.left != null ? V.left : 0, -400);
      const vr = Math.min(V.right != null ? V.right : 1600, 2000);
      const avail = vr - vl - 2 * 30;
      const mid = (vl + vr) / 2;
      // the bowls and pills first (their pills' own widths are measured), placed below
      ids.forEach((id) => {
        const img = T(S.add.image(mid, B.base, `cn4-${id}`).setDepth(D.item).setAlpha(0));
        img.wordId = id;
        img.chip = pill(S, id, mid, B.chipY, ctx); // (its pill is part of its light: the kit's parts, C.parts; S19, CK-61)
        img.chip.setAlpha(0);
        bowls[id] = img;
      });
      const pw = (id) => bowls[id].chip.faceW(bowls[id].chip.showsWord) * want;
      const slotOf = (id, sz) => Math.max(pw(id), sz + 14);
      const rowW = (row, sz) => row.reduce((a, id) => a + slotOf(id, sz), 0) + room(sz) * (row.length - 1);
      let size = bw.size || 150;
      while (size > 120 && rowW(ids, size) > avail) size -= 10;
      const two = rowW(ids, size) > avail;
      const rows = two ? [ids.slice(0, Math.ceil(ids.length / 2)), ids.slice(Math.ceil(ids.length / 2))] : [ids];
      if (two) size = Math.max(size, Math.min(bw.size || 150, 48 / ppw));
      const pillH = PH * want;
      const gapRows = room(size);
      // (each row: the bowl, a small gap, its pill; the rows a light's margin apart; the last row's pill on the band's own pill line)
      const rowH = size + 6 + pillH;
      const lastPill = Math.min(B.chipY, 896 - pillH / 2 - 4);
      const pillYs = rows.map((r, i) => lastPill - (rows.length - 1 - i) * (rowH + gapRows));
      const top = two ? pillYs[0] - pillH / 2 - 6 - size - 18 : B.top;
      rows.forEach((row, ri) => {
        let x = mid - rowW(row, size) / 2;
        row.forEach((id) => {
          const w = slotOf(id, size);
          const cx = x + w / 2;
          x += w + room(size);
          const img = bowls[id];
          img.setPosition(cx, pillYs[ri] - pillH / 2 - 6 - size / 2);
          img.setScale(size / Math.max(img.width, img.height));
          GK.shadow(S, img, { dx: 5, dy: 7, alpha: 0.24, blur: 5 });
          const c = img.chip;
          c.k = want;
          c.setScale(want).setPosition(cx, pillYs[ri]);
          if (c.hit) c.hit(w + room(size) - 2);
          S.tweens.add({ targets: [img, c], alpha: 1, duration: mo.screenMs || 380 });
          S.tappable(img, () => tapBowl(img));
        });
      });
      if (two && Sh.P && Sh.P.tray) {
        // the taller tray for the two rows: the shared stone tray (as the kitchen kit draws it), in place of the band's
        const view = () => {
          const v = Cook.view || {};
          return { left: v.left != null ? v.left : 0, right: v.right != null ? v.right : 1600, bottom: v.bottom != null ? v.bottom : 900 };
        };
        const t2 = Sh.P.tray(S, { top, view, depth: D.bg + 1.2 });
        if (t2) {
          t2.setAlpha(0);
          S.tweens.add({ targets: t2, alpha: 1, duration: mo.screenMs || 380, onComplete: () => tray && tray.active && tray.destroy() });
        }
      }
      // (the first row's top, and the widest light margin's room above it, for the plates)
      return { top, clear: pillYs[0] - pillH / 2 - 6 - size, room: (OL.max + OL.clear + 4) / ppw };
    }

    // what goes on: named as it goes on, their row ticks; a second tap takes it back until they have it (non-negotiable 7)
    const tapBowl = async (img) => {
      began();
      const id = img.wordId;
      const q = people[active];
      if (screen !== 2 || !q || q.served) {
        S.wiggle(img);
        return;
      }
      if (q.dressed.includes(id)) {
        // taken back: its dressing goes, its row opens again
        takeOff(q, id);
        Cook.sfx.click();
        z.progress({ off: id });
        acted();
        return refresh();
      }
      q.dressed.push(id);
      Lang.speakWord(id);
      const ok = q.asked.includes(id);
      z.listen(ok, ok ? `put ${id}` : `put ${id}, not asked`);
      if (!ok) Cook.Coach.wrong(KEY); // (a wrong move brings the stuck hint at once: STD-D2-04)
      const dot = T(S.add.circle(img.x, img.y, 20, col(id), 1).setDepth(D.fx));
      refresh();
      await fly(() => Cook.tween(S, { targets: dot, x: q.cob.x, y: q.cob.y, scale: 0.6, duration: mo.dropMs || 420, ease: "Cubic.easeInOut" }));
      dot.destroy();
      if (!q.dressed.includes(id) || q.drops[id] || q.served) return; // (taken back while it flew)
      q.drops[id] = dropsOn(q, id);
      Cook.sfx.pop();
      if (ok) {
        UI.mission.tickItem(id, dish, { close: true, for: q.who });
        if (!guided && Lang.known(id)) Cook.markRight(id);
      }
      acted();
      refresh();
    };

    const servePlate = (i) => {
      began();
      const q = people[i];
      if (screen !== 2 || i !== active || !q || q.served || !serveNow) {
        // (a round plate shakes side to side, never turned: a turned square picture grows its box into the band, contract-109)
        const pt = plates[i] || plates[0];
        if (pt && !S.tweens.isTweening(pt)) S.tweens.add({ targets: pt, x: pt.x + 8, duration: 60, yoyo: true, repeat: 2 });
        return;
      }
      const go = serveNow;
      serveNow = null;
      go();
    };

    // STD-D1-08 (contract-98): the reveal lessons, the dotted word then the blurred picture, once the order has landed and before the
    // first step (kit (d)); then the first step opens and its call is said
    if (Cook.Coach.lessons) await Cook.Coach.lessons({ gate, ctx, busy: () => moving > 0 });
    refresh();
    // (screen 2 begins when the last cob is in the tray: toPlates)
    await new Promise((resolve) => {
      let off = null;
      off = z.tick(() => {
        if (screen !== 2) return;
        if (off) off();
        resolve();
      });
    });
    plates.forEach((plate, i) => S.tappable(plate, () => servePlate(i)));

    /* ---------------- the serve, one person at a time: the kit's tick, faces, recast and redo (decision 51) ---------------- */
    const serve = NjgServe.for(Cook);
    const rev = lay.review || {};
    const rowsOf = (q, want) => {
      const Ld = UI.mission.ladders ? UI.mission.ladders()[dish] : null;
      return Ld && Cook.Order ? Cook.Order.rows(Ld, { all: true }).filter((r) => !r.head && (!r.for || r.for === q.who) && r.ids.some((x) => want.includes(x))) : [];
    };
    for (let i = 0; i < people.length; i++) {
      const q = people[i];
      active = i;
      ctlId = null;
      // (the order panel keeps this person's card open and in view: the station is on them, as chai's pan in hand; contract-99)
      if (UI.mission.focus) UI.mission.focus(q.who);
      showActive();
      refresh();
      await serve.round({
        items: [q.who],
        done: async () => {
          await new Promise((r) => (serveNow = r));
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
          const missing = q.asked.filter((id) => !q.dressed.includes(id));
          const extra = q.dressed.filter((id) => !q.asked.includes(id));
          const ok = !missing.length && !extra.length;
          if (!round) {
            missing.forEach((id) => {
              UI.mission.missItem(id, dish, { for: q.who });
              z.listen(false, `left out ${id}`);
              if (!guided) Cook.markMiss(id);
            });
            extra.forEach((id) => z.listen(false, q.nos.includes(id) ? `put ${id} (they said no)` : `put ${id}, not asked`));
          }
          const bad = rowsOf(q, missing.concat(extra.filter((id) => q.nos.includes(id))));
          if (!ok && UI.mission.serveWrong) UI.mission.serveWrong(bad.length ? bad.map((r) => r.ids[0]) : missing.concat(extra), dish, { for: q.who });
          // (what they say again: those rows; an unasked one has no row of its own, so their whole order, as the kit's recast does)
          return { ok, rows: bad.length ? bad : null };
        },
        review: async (wrong) => {
          q.face.setVisible(false);
          const size = q.at.d * (rev.size || 0.55);
          // (contract-108: well done once the whole card is ticked: only the last person's right plate says the praise, when every
          // plate before it was right too; the rest are their faces alone)
          const last = i === people.length - 1;
          const praise = last && !wrong.length && people.every((x, j) => j >= i || x.right);
          q.right = !wrong.length;
          return [await serve.review(S, { who: q.who, ok: !wrong.length, x: q.at.x - q.at.d * 0.18, y: q.at.y - q.at.d * 0.2, size, side: last && people.length > 1 ? "left" : "right", line: praise ? undefined : false })];
        },
        oops: () => z.oops(),
        recast: async (item, rows) => {
          await UI.personSay(q.who, rows ? { rows } : {});
        },
        afterReview: () => q.face.setVisible(true),
        redo: St.redo(ctx),
        key: () => `${KEY}:${q.who}`,
        showRight: async () => {
          // the third wrong try: the right way shown (what was asked goes on, nothing else)
          q.dressed.filter((id) => !q.asked.includes(id)).forEach((id) => takeOff(q, id));
          q.asked
            .filter((id) => !q.dressed.includes(id))
            .forEach((id) => {
              q.dressed.push(id);
              q.drops[id] = dropsOn(q, id);
              UI.mission.tickItem(id, dish, { close: true, for: q.who });
            });
          await Cook.wait(mo.endHoldMs || 500);
        },
        reset: () => q.dressed.slice().forEach((id) => takeOff(q, id)),
        again: () => {
          ctlId = null;
          refresh();
        },
      });
      q.served = true;
      // (the next person is the one in progress before this card folds, so the panel moves once, straight to their card: contract-99)
      if (UI.mission.focus && people[i + 1]) UI.mission.focus(people[i + 1].who);
      UI.mission.closeItem([], dish, { all: true, for: q.who });
      Cook.sfx.pop();
      await Cook.wait(mo.endHoldMs || 500);
    }
    screen = 3;
    active = people.length;
    if (UI.mission.focus) UI.mission.focus(null);
    // (the round is over: nothing here takes a tap any more, as the kitchen comes back: contract-109 read a plate mid-transition)
    plates.forEach((o) => o && o.active && S.untap(o));
    Object.values(bowls).forEach((o) => o && o.active && S.untap(o));
    refresh();
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
    return { served: people.length };
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
      register();
      const R = Cook.Recipes;
      const d = R.corn.make("nana", { level: L.level });
      L.ctx.steps = R.corn.steps(d);
      L.card(d, L.ctx.steps);
      await L.station(KEY, { plates: d.plates, count: d.count, dress: d.dress, no: d.no, who: "nana" });
    },
  });
})(window);
