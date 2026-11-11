/*
 * Baking (naan), Zafar's turn-by-turn design (1 Nov; build/reports/designs/prototype-notes-2026-11-01.md "Baking", cook-baking-eggs.md
 * end note: his design wins). Sprint 18 wave 2 (s18-g-baking): the game is its settings file (data/stations/baking.json, read as
 * Cook.data.settings.baking: the scene, the items' pictures and sizes, the lines, the word moment, its own asset list) and its own
 * mechanic below; everything else is a kit call: the order card and its flow (UI.mission), the shared step for which one (S.step),
 * the lights and lessons (Cook.Coach.firsts, .control, .wrong, .lessons), the decoys by the central rules (St.tableDecoys), the word
 * chip (Cook.Kit.chip), the review (Cook.Kit.review), the word moment (UI.wordMoment). Gap page: docs/design-language/standard/gaps/baking.md.
 *
 * The mechanic (not to touch, non-negotiable 1): one camera, side-on at the counter (his mock-up): the mixing bowl in the middle, the
 * containers standing in a row in front, each with its word chip; from L3 the measuring jug beside the bowl, its lines at a quarter,
 * half, full, one and a half and two and a half (no numbers).
 *   - Nani gives ONE instruction at a time; its row appears on the card as she says it (UI.mission.reveal).
 *   - Tap what she names: it lifts over the bowl (or the jug). Each tap tips it a bit more and some goes in:
 *       "a little": one tap, it stops, "that's good";   "a lot": tap until it's a lot, "enough"; more taps don't land;
 *       "a little more": "a little", tap, "still a little more", tap, "enough";
 *       the jug: tap until the jug reaches the amount (a quarter cup a tap), "enough"; then it tips into the bowl.
 *     The row ticks the moment the amount is there (Zafar, 1 Nov: counts and amounts tick at the number).
 *   - Tap the bowl: the dough. Then the oven: tap it, it opens; tap the naan, in it goes and the door shuts; its ring fills; when
 *     Nani says it's ready, tap the oven: out it comes with steam, and Nana's happy face.
 *   - The cat (Simba) peeks over the counter's edge (a named placeholder).
 */
import { Cook as CookNS } from "../ns.js";
import { setTimeout } from "../life.js";

(function (global) {
  const Cook = CookNS;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const D = Cook.D;
  const St = Cook.Stations;
  const Mech = Cook.Mech;
  const KEY = "baking";

  /** The game's settings (data/stations/baking.json, loaded with Cook's data: js/cook/zone.js M.stationData). */
  const SET = () => ((Cook.data || {}).settings || {})[KEY] || {};
  const ITEMS = () => SET().items || {};
  // the art colours left are the effects' and the drawn drops' (data/stations/baking.json station.palette)
  const col = (k) => {
    const pal = ((Cook.data.stations || {})[KEY] || {}).palette || {};
    return parseInt(String(pal[k] || pal.white || "").slice(1), 16) || 0;
  };
  const line = (key, role, phrase) => Lang.role(phrase ? Lang.line(key, phrase) : Lang.line(key), role);
  /** A canvas thing's page box (the kit's, Cook.Coach.box), PAD out from its picture (contract-92). */
  const PAD = 6;
  const FADE_MS = 320;

  Mech.combined(KEY, {
    station: KEY,
    view: "marble",
    dataFile: "data/stations/baking.json",
    zones: [],
    async run(host, p) {
      return baking(host, p);
    },
  });

  /** The pictures this round draws, from the settings' items (decision 68: only these, and only what this round shows). */
  function artFor(onShelf, plan, jug, who) {
    const I = ITEMS();
    const sc = SET().scene || {};
    const list = [sc.bg ? ["bk-bg", sc.bg] : null, ["bk-cat", (sc.cat || {}).file]].filter(Boolean);
    Object.entries((I.mixBowl || {}).states || {}).forEach(([k, f]) => list.push([`bk-bowl-${k}`, f]));
    Object.entries((sc.oven || {}).states || {}).forEach(([k, f]) => list.push([`bk-oven-${k}`, f]));
    // (s19-games-2, ART-73: the naan's four stages, raw, part-baked, baked and overdone, each a look of its tray)
    ["raw", "part", "golden", "over"].forEach((k) => list.push([`bk-naan-${k}`, ((I.naan || {}).states || {})[k]]));
    onShelf.forEach((id) => list.push([`bk-${id}`, ((I.containers || {}).files || {})[id]]));
    plan.forEach((s) => list.push([`bk-stream-${s.id}`, ((I.streams || {}).files || {})[s.id]]));
    if (jug) {
      const J = I.jug || {};
      list.push(["bk-jug-empty", (J.states || {}).empty]);
      // (S19: a fill drawn in the new glass jug has its own empty jug, items.jug.emptyFor; the others keep the old jug's)
      Object.entries(J.emptyFor || {}).forEach(([fill, f]) => plan.some((s) => s.amt === "jug" && (J.fillFor || {})[s.id] === fill) && list.push([`bk-jug-empty-${fill}`, f]));
      plan.filter((s) => s.amt === "jug").forEach((s) => list.push([`bk-jug-${s.id}`, (J.states || {})[(J.fillFor || {})[s.id]]]));
    }
    const seen = new Set();
    return list.filter(([k, f]) => f && !seen.has(k) && seen.add(k)).concat(Cook.Kit.faceArt(who));
  }

  async function baking(host, p) {
    const S = host.S;
    const ctx = host.ctx;
    const K = host.knobs;
    const level = host.level;
    const I = ITEMS();
    const sc = SET().scene || {};
    const CT = I.containers || {};
    const plan = p.plan || [];
    const z = Mech.zone(S, ctx, { id: KEY, level });
    const who = p.who || "nana";
    const ids = [...new Set(plan.map((s) => s.id))];
    // the decoys by the central rules (1-4 by level, one a lookalike at L4: STD-C2-03), noted for contract-37
    const decoys = St.tableDecoys(Object.keys(CT.files || {}), ids, level, { what: KEY });
    const onShelf = Cook.shuffle(ids.concat(decoys));
    const hasJug = !!K.jug;
    await St.loadArt(S, artFor(onShelf, plan, hasJug, who)).catch(() => {});
    const has = (k) => S.textures.exists(k);
    const objs = [];
    const T = (o) => (objs.push(o), S.track(o));
    const speak = (l) => UI.voice(l).catch(() => {}); // never waited for: the child is never held for speech
    // her call: Nani's helper card lets the last item go first, so no call is said while the card names another (contract-89)
    const say = (l) => {
      if (UI.helper) UI.helper(null);
      speak(l);
    };

    /* ---------------- lights: the kit's first-time gate and each control's call with its light ---------------- */
    const gate = Cook.Coach.firsts(KEY, { round: new Set() });
    const hintMs = () => (global.Rules ? global.Rules.hintMs(level) : 0);
    let busy = false;
    let ctl = null;
    let ctlObj = null;
    let stuck = null;
    const unlight = () => {
      if (stuck) stuck.close();
      stuck = null;
      if (ctl) ctl.close();
      if (ctlObj) S.glow(ctlObj, false);
      ctl = ctlObj = null;
    };
    /** The control o (a container to tip, the bowl, the oven, the naan) lit as the kit lights one: the first time with its call,
     *  after that only as the stuck hint after the level's wait from the last action (STD-D1-06, D2-01). */
    const control = (o, name, current, withLight = null) => {
      unlight();
      ctlObj = o;
      // (withLight: the step's call, said as its light comes up the first time, else at once: CHAI-40, contract-36 and -78)
      const first = gate.first(name);
      let said = false;
      const sayNow = () => {
        if (said || !withLight) return;
        said = true;
        if (!current || current()) withLight();
      };
      if (!first) sayNow();
      else setTimeout(sayNow, 3000 / (Cook.speed || 1)); // (never silent: a light that cannot come)
      ctl = Cook.Coach.control({
        key: KEY,
        note: `${KEY}:${name}`,
        target: Cook.Coach.box(o, PAD, { visible: true }),
        first,
        noHint: true,
        current,
        busy: () => busy,
        // (contract-102, SH-236: its glow lasts as long as its light, which goes as the child starts the move; contract-107: no hop, none
        // of these is on the shelf)
        onLight: () => {
          sayNow();
          S.glow(o, true, { now: true }); // (no hop: a thing tipped over the bowl, the bowl, the oven, the naan are never on the shelf)
          setTimeout(() => {
            const h = ctl && ctl.lit ? ctl.lit() : null;
            const off = () => ctlObj === o && o.active && S.glow(o, false);
            if (h && h.done) h.done.then(off);
            else off();
          }, 0);
        },
      });
      if (stuck) stuck.close();
      // SH-228 (chai's method): the stuck help after the level's wait from the last action (a child's time: the kit divides a game's
      // wait by the test speed), her helper card or her line again, with the kit's light and the thing's glow
      stuck = Cook.Coach.stuck
        ? Cook.Coach.stuck({
            key: KEY,
            level,
            target: Cook.Coach.box(o, PAD, { visible: true }),
            hintMs: () => hintMs() || 7000,
            current,
            busy: () => busy,
            // (its glow goes with its light too, however the light goes: contract-102)
            glow: (on) => {
              if (!o.active) return;
              S.glow(o, on, { now: true });
              const h = on && stuck && stuck.lit ? stuck.lit() : null;
              if (h && h.done) h.done.then(() => o.active && ctlObj === o && S.glow(o, false));
            },
            note: `${KEY}:${name}:stuck`,
          })
        : null;
    };
    const expectTap = (o, key) => {
      const c = S.centre(o);
      z.expect({ kind: "tap", x: c.x, y: c.y, key });
    };

    /*
     * ---------------- the scene: the kitchen kit's worktop and its stone shelf band (chai's) ----------------
     * CK-84, SH-255 (the eye judge beside chai, 10 Nov: the bowl sat on the khun jar, the jars floated on the cupboard doors, no shelf band;
     * Zafar, 10 Nov: every bottom bar from the shared kit): the side-on things stand on the kit's stone shelf (St.stoneBand, baking's band
     * "shelf", data/stations/baking.json), the mixing bowl stands on the marble worktop above it, never on a jar (was the settings' own
     * counter picture, scene.bg, with the jars on its cupboard doors)
     */
    const [W, H] = sc.stage || [1600, 900];
    const band = Object.assign({ top: 630, base: 818, chipY: 860 }, (global.Shelf && global.Shelf.BAND) || {});
    // (the worktop and the band stay through the oven, as chai's: marked so the move to the oven keeps them)
    [T(Cook.Kit.worktop(S, { top: band.top, far: 2000 })), T(St.stoneBand(S, { top: band.top, base: band.base, far: 2000, depth: D.bg + 1.2, game: KEY }))].forEach((o) => o && (o.band = true));
    const bg = sc.bg && has("bk-bg") ? T(S.add.image(W / 2, H / 2, "bk-bg").setDepth(D.bg + 2).setDisplaySize(W, H)) : null;
    // the cat (Simba) peeks over the shelf band's top edge (right), breathing; behind the band, so only his head shows
    const edgeY = band.top;
    const cat = has("bk-cat") ? T(S.add.image(1480, edgeY + 16, "bk-cat").setOrigin(0.5, 1).setDepth(D.bg + 1.1)) : null;
    if (cat) {
      cat.setScale(170 / cat.width);
      S.tweens.add({ targets: cat, y: edgeY + 10, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    }

    // the mixing bowl (the worktop's middle, its foot above the band): its picture follows what is in it (MB.states): empty, the flour
    // rising a quarter, a half, three quarters as it goes in (B1f), the shaggy dough once something wet is in (B1), then the dough
    const MB = I.mixBowl || {};
    const FLOUR = MB.flour || "cook-atto";
    const LIQUID_IDS = new Set(MB.wet || CT.liquid || []);
    const bowlFoot = MB.foot || band.top - 24;
    const bowlX = (MB.at || [800])[0];
    const bowl = T(S.add.image(bowlX, bowlFoot, "bk-bowl-empty").setOrigin(0.5, 1).setDepth(D.item));
    bowl.setScale(((MB.drawn || {}).w || 380) / bowl.width);
    const bowlY = bowlFoot - bowl.displayHeight / 2; // (its middle: where things pour)
    // SH-258 (the eye judge, 10 Nov: no asker's face until well done): their face circle on the bowl's rim from the first frame
    // (on the bowl its upper-right rim: the jar tips in from the left, and its light never takes the face in: contract-82)
    const faceAt = (o, side = -1) => {
      if (!Cook.Kit.badge) return null;
      const perPx = Math.max(0.01, (UI && UI.worldToScreen ? UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x : 1) || 1);
      const fd = Math.min(90, Math.max(64, 30 / perPx));
      const f = T(S.add.image(o.x + side * o.displayWidth * 0.42, o.y - o.displayHeight * (o.originY || 0.5) + fd * 0.4, Cook.Kit.badge(S, who)).setDisplaySize(fd, fd).setDepth(D.badge));
      f.setName("baking-face");
      o.face = f;
      return f;
    };
    faceAt(bowl, 1);
    let wet = false;
    const bowlState = (k) => {
      const key = `bk-bowl-${k}`;
      if (has(key) && bowl.texture.key !== key) bowl.setTexture(key);
    };
    /** The bowl after `done` of step s's taps (0-1): flour rises with the flour; anything wet makes the shaggy dough. */
    const bowlTo = (s, done) => {
      if (s && LIQUID_IDS.has(s.id) && done > 0) wet = true;
      if (wet) return bowlState("mixing");
      if (s && s.id === FLOUR && done > 0) return bowlState(done < 0.4 ? "flour1" : done < 0.75 ? "flour2" : "flour3");
    };

    // the measuring jug (L3 up), on the worktop left of the bowl: the empty picture, and the full one revealed by a rising crop up to
    // its line (never a drawn fill)
    let jug = null;
    if (hasJug) {
      const J = I.jug || {};
      const [jx, jy] = J.at || [470, 600];
      const c = T(S.add.container(jx, jy).setDepth(D.item + 0.5));
      const empty = S.add.image(0, 0, "bk-jug-empty").setOrigin(0.5, 1);
      const k = ((J.drawn || {}).w || 260) / empty.width;
      empty.setScale(k);
      const full = S.add.image(0, 0, "bk-jug-empty").setOrigin(0.5, 1).setScale(k).setVisible(false);
      c.add([empty, full]);
      c.setSize(empty.displayWidth, empty.displayHeight);
      const lines = (fill) => Object.entries(((J.lineAtFor || {})[fill]) || J.lineAt || {}).map(([u, f]) => [Number(u), f]).sort((a, b) => a[0] - b[0]);
      // a line's height from the picture's top (items.jug.lineAt, by quarter cups; a new jug's own, lineAtFor); between two, evenly
      const lineAt = (u, fill) => {
        const at = lines(fill);
        if (!at.length) return 1 - u / 10;
        if (u <= at[0][0]) return 1 - (1 - at[0][1]) * (u / at[0][0]);
        for (let i = 1; i < at.length; i++) if (u <= at[i][0]) return at[i - 1][1] + ((at[i][1] - at[i - 1][1]) * (u - at[i - 1][0])) / (at[i][0] - at[i - 1][0]);
        return at[at.length - 1][1];
      };
      jug = { c, empty, full, units: 0, x: jx, y: jy, w: empty.displayWidth, h: empty.displayHeight };
      jug.show = (id) => {
        const fill = id ? (J.fillFor || {})[id] : null;
        const ek = fill && has(`bk-jug-empty-${fill}`) ? `bk-jug-empty-${fill}` : "bk-jug-empty";
        // (s19-games-2, contract-114: the new glass jug's pictures are smaller canvases than the old jug's: each is drawn at the jug's one
        // width, so the jug keeps its size as its picture changes)
        const jw = (J.drawn || {}).w || 260;
        if (empty.texture.key !== ek) empty.setTexture(ek).setScale(jw / Math.max(1, empty.width));
        const key = `bk-jug-${id}`;
        if (id && has(key)) full.setTexture(key).setScale(jw / Math.max(1, full.width));
        const u = jug.units;
        full.setVisible(u > 0);
        if (u <= 0) return;
        const top = Math.round(full.height * lineAt(u, fill));
        full.setCrop(0, top, full.width, full.height - top);
      };
      jug.mouth = () => ({ x: c.x, y: c.y - jug.h * 0.85 });
    }

    /*
     * the containers standing on the shelf band, each with its word pill (SH-255, CK-84: chai's shelf): spread along the band under the
     * bowl, each on the shelf's line; the pills chai's size (the shared kit's pill at the scale the floor asks and its neighbours allow:
     * Shelf.pillScale on Shelf.pillWant, chai's fitPills; was a fixed small chip on the cupboard doors)
     */
    const SH = global.Shelf;
    const tall = (CT.drawn || {}).h || 150;
    const shelf = {};
    const n = onShelf.length;
    const PILL_SLOT = 200;
    const pitch = Math.min(CT.pitch || 300, 1100 / Math.max(1, n));
    const pills = [];
    onShelf.forEach((id, i) => {
      const x = bowlX + (i - (n - 1) / 2) * pitch;
      const img = T(S.add.image(x, band.base, `bk-${id}`).setOrigin(0.5, 1).setDepth(D.item + 1));
      // (s19-games-2, contract-115: each by its size class as chai's jars, St.classFit: the band's room with the hop kept, the class's
      // share, the floor on screen; its picture's clear foot on the shelf's line. Was the settings' drawn.h, 84% of chai's L)
      const ppw = Math.max(0.01, (UI && UI.worldToScreen ? UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x : 1) || 1);
      const f = St.classFit ? St.classFit(S, `bk-${id}`, id, { base: band.base, ppw, slotW: Math.min(PILL_SLOT, pitch) - 8 }) : null;
      if (f && f.scale) {
        img.setScale(f.scale);
        if (St.opaqueSpan) img.setOrigin(0.5, St.opaqueSpan(S, `bk-${id}`)[1]);
      } else img.setScale(Math.min(Math.min(tall, (band.base - band.top - 30) / 1.12) / img.height, 150 / img.width));
      img.home = { x, y: band.base };
      img.wordId = id;
      shelf[id] = img;
      const chip = Cook.Kit.chip(S, id, x, band.chipY, { word: Cook.chipWord ? Cook.chipWord(id, ctx) : true });
      chip.pillId = id;
      img.chip = chip; // (its pill is part of its light: Cook.Coach.parts)
      objs.push(chip);
      pills.push(chip);
    });
    const fitPills = () => {
      if (!SH || !SH.pillScale || !pills.length || !pills[0].faceW) return;
      const ppw = Math.max(0.01, (UI && UI.worldToScreen ? UI.worldToScreen(1, 0).x - UI.worldToScreen(0, 0).x : 1) || 1);
      const row = pills.filter((c) => c.active).sort((a, b) => a.x - b.x);
      const { k, cap } = SH.pillScale(row.map((c) => ({ x: c.x, w: c.faceW(c.showsWord) })), { want: SH.pillWant(ppw), gap: SH.pillGap(ppw), slotW: PILL_SLOT });
      const ph = ((SH.PILL || {}).h || 46) * k;
      const y = Math.min(band.chipY, 896 - ph / 2);
      row.forEach((c) => {
        if (c.capW !== cap && c.face) c.face(c.showsWord, cap);
        c.k = k;
        if (c.hit) c.hit(PILL_SLOT);
        c.setScale(k).setY(y);
      });
    };
    fitPills();

    /* ---------------- pouring: the shared stream pictures, stretched from the lip; drawn drops where none has landed ---------------- */
    const drops = T(S.add.graphics().setDepth(D.item + 0.4));
    const LIQUID = new Set(CT.liquid || []);
    const pourOnce = async (img, into, id, liquid) => {
      const lipX = img.x + Math.cos(((img.angle - 90) * Math.PI) / 180) * img.displayHeight * 0.55;
      const lipY = img.y - img.displayHeight * 0.55 * Math.max(0.2, Math.cos((img.angle * Math.PI) / 180));
      const key = `bk-stream-${id}`;
      if (has(key)) {
        const s = T(S.add.image((lipX + into.x) / 2, Math.min(lipY, into.y), key).setOrigin(0.5, 0).setDepth(D.item + 0.4));
        s.setDisplaySize(liquid ? 26 : 34, Math.max(20, Math.abs(into.y - lipY)));
        await Cook.wait(330);
        s.destroy();
        return;
      }
      const color = col((CT.pour || {})[id] || "white");
      for (let f = 0; f < 6; f++) {
        drops.clear();
        drops.fillStyle(color, 1);
        for (let k = 0; k < 14; k++) drops.fillCircle(lipX + (into.x - lipX) * (k / 14) + (Math.random() - 0.5) * 12, lipY + (into.y - lipY) * (k / 14), 4 + Math.random() * 3);
        await Cook.wait(55);
      }
      drops.clear();
    };

    /** One instruction: Nani says it, its row appears; the child taps the container, then taps to tip it, to the amount. */
    async function step(s, i) {
      if (UI.mission.reveal) UI.mission.reveal(`bake-${i + 1}`);
      // the reveal lessons (the dotted word, then the blurred picture) as the first row that shows one appears (contract-98)
      await Cook.Coach.lessons({ gate, ctx, busy: () => busy });
      const jugStep = s.amt === "jug" && jug;
      const amtLine = s.amt === "lot" ? Lang.line("alot") : s.amt === "jug" ? null : Lang.line("little");
      const doIt = Lang.say({ fn: "DoIt", verb: "v.put-in", obj: Lang.itemOf(jugStep ? s.parts : [s.id]) });
      // (her turn is the order, said row by row: its row appears as she says it, as a person's order does; the engine has no
      // "a little / a lot of X" frame, R6-136, so two engine lines side by side. s19-games-2, contract-36: it is her call of the step
      // as it opens, its row and its light with it, so it is said as a call)
      const call = Lang.role(amtLine ? Lang.join([doIt, amtLine]) : doIt, "call");
      say(call);
      // which one: the shared step (the help ladder's pause, then her word and the glow; a wrong one wiggles at L1)
      const r = await S.step({
        items: Object.assign({}, shelf),
        expected: s.id,
        sayLine: call,
        io: z.io,
        quiet: z.quiet,
        onWrong: (key) => (Cook.Coach.wrong(), z.listen(false, `took ${key} for ${s.id}`)),
        onLand: (key, obj) => S.tweens.add({ targets: obj, y: obj.home.y - 30, duration: 140, yoyo: true }),
      });
      z.listen(true, `took ${s.id}`);
      if (!ctx.guided && Lang.known(s.id)) Cook.markRight(s.id);
      const img = shelf[r.key];
      const into = jugStep ? jug.mouth() : { x: bowlX, y: bowlY - 60 };
      // lift it over the target
      busy = true;
      await Cook.tween(S, { targets: img, x: into.x - 150, y: into.y - 60, duration: 360, ease: "Cubic.easeOut" });
      busy = false;
      const liquid = LIQUID.has(s.id);
      // how many taps, and Nani's turns
      const need = s.amt === "little" ? 1 : s.amt === "more" ? 2 : s.amt === "lot" ? K.lotTaps || 4 : s.units || 4;
      let taps = 0;
      let open = true;
      const tipOf = (t) => Math.min(115, 30 + t * (85 / Math.max(1, need)));
      await new Promise((resolve) => {
        const tap = async () => {
          if (busy || taps >= need) return; // more taps don't land
          busy = true;
          taps++;
          // each tap tips it a bit more (to 115 degrees), and some goes in
          await Cook.tween(S, { targets: img, angle: tipOf(taps), duration: 160 });
          Cook.sfx.pour ? Cook.sfx.pour() : Cook.sfx.pop();
          await pourOnce(img, jugStep ? { x: jug.x, y: jug.y - jug.h * 0.3 } : { x: bowlX, y: bowlY - 40 }, s.id, liquid);
          if (jugStep) {
            jug.units = taps;
            jug.show(s.id);
          } else bowlTo(s, taps / need);
          if (s.amt === "more" && taps === 1) speak(line("stillmore", "react"));
          busy = false;
          if (taps >= need) return resolve();
          expectTap(img, s.id);
        };
        S.tappable(img, tap);
        expectTap(img, s.id);
        control(img, "tip", () => open);
      });
      open = false;
      unlight();
      S.untap(img);
      z.expect({ kind: "wait" });
      // the amount is there: the row ticks at once (Zafar, 1 Nov), then her word
      UI.mission.tickItem(s.id, 0, { close: true });
      Cook.sfx.right();
      speak(line(s.amt === "little" ? "good" : "enough", "react"));
      busy = true;
      // (it rests tipped a moment, its pour done, while the light that followed it fades: Onboard.light's 300 ms, real time)
      await new Promise((r) => setTimeout(r, FADE_MS));
      await Cook.tween(S, { targets: img, angle: 0, x: img.home.x, y: img.home.y, duration: 380, ease: "Cubic.easeInOut" });
      if (jugStep) {
        // the jug tips into the bowl by itself
        await Cook.tween(S, { targets: jug.c, x: bowlX - 170, y: bowlY - 60, angle: 70, duration: 420 });
        await pourOnce({ x: jug.c.x, y: jug.c.y, angle: 70, displayHeight: jug.h }, { x: bowlX, y: bowlY - 40 }, s.id, true);
        jug.units = 0;
        jug.show(null);
        bowlTo(s, 1);
        await Cook.tween(S, { targets: jug.c, x: jug.x, y: jug.y, angle: 0, duration: 380 });
      }
      busy = false;
      await Cook.wait(250);
    }

    for (let i = 0; i < plan.length; i++) await step(plan[i], i);

    // the dough: tap the bowl
    say(line("now", "call", Lang.phrase(["ph-naan"])));
    let bowlOpen = true;
    await new Promise((resolve) => {
      S.tappable(bowl, () => {
        S.untap(bowl);
        resolve();
      });
      // CK-84 (the eye judge, 10 Nov: the order's headline lit gold with the bowl): the bowl's tap names no word (the naan's word lit
      // the card's headline as a second gold thing); its light is the bowl's alone
      expectTap(bowl, null);
      control(bowl, "bowl", () => bowlOpen);
    });
    bowlOpen = false;
    unlight();
    z.expect({ kind: "wait" });
    bowlState("dough");
    await Cook.tween(S, { targets: bowl, scaleY: bowl.scaleY * 1.04, duration: 220, yoyo: true });
    Cook.sfx.pop();
    await Cook.wait(400);

    /* ---------------- the oven (the same camera) ---------------- */
    const keep = (o) => o && o.active && o !== bg && o !== cat && !o.band;
    await Cook.tween(S, { targets: objs.filter(keep), alpha: 0, duration: 300 });
    objs.filter(keep).forEach((o) => o.destroy());
    await oven(S, z, { who, K, T, control, unlight, expectTap, speak, say, setBusy: (b) => (busy = b), faceAt });
    if (!ctx.guided) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[KEY] = true;
    }
    UI.mission.closeItem([], 0, { all: true });
    await Cook.wait(600);
    z.close();
    return { baked: 1 };
  }

  /** The oven: its shut, baking and open pictures (one canvas: a swap changes only the door or the glow), the naan on its tray. */
  async function oven(S, z, { who, K, T, control, unlight, expectTap, speak, say, setBusy, faceAt }) {
    const O = (SET().scene || {}).oven || {};
    const N = ITEMS().naan || {};
    const [ox, oy] = O.centre || [900, 360];
    const ov = T(S.add.image(ox, oy, "bk-oven-shut").setDepth(D.item + 1));
    ov.setScale(((O.drawn || {}).w || 560) / ov.width);
    const ring = T(S.add.graphics().setDepth(D.fx + 1));
    const steam = (x, y, k = 3) => {
      for (let i = 0; i < k; i++) {
        const s = T(S.add.circle(x + (Math.random() - 0.5) * 120, y, 14 + Math.random() * 10, col("steam"), 0.55).setDepth(D.fx + 2));
        S.tweens.add({ targets: s, y: y - 160 - Math.random() * 60, alpha: 0, scale: 2.6, duration: 1400 + i * 120, delay: i * 120, onComplete: () => s.destroy() });
      }
    };
    // the naan on its tray (the worktop, left of the oven, above the band), raw (B3: the tray of raw naan, then baked)
    const [hx, hy] = N.at || [330, 640];
    const naan = T(S.add.image(hx, hy, "bk-naan-raw").setDepth(D.item + 2));
    const nk = ((N.drawn || {}).w || 260) / naan.width;
    naan.setScale(nk);
    // (SH-258: their face circle moves to the tray their naan bakes on, from its first frame)
    const face = faceAt ? faceAt(naan) : null;
    const tapOn = (o, name, withLight = null) => {
      let open = true;
      return new Promise((resolve) => {
        S.tappable(o, () => {
          S.untap(o);
          resolve();
        });
        control(o, name, () => open, withLight);
      }).then(() => {
        open = false;
        unlight();
      });
    };
    // (s19-games-2: on the rack behind the door's glass, the window's middle: O.rack its share of the oven's height from the top)
    const rackY = oy - ov.displayHeight / 2 + ov.displayHeight * (O.rack || 0.59);
    // the naan's look, faded into the next over 0.4 s (a second picture over it, then the naan takes it: no snap, contract-114)
    let lookFade = null;
    // (a tray's pictures differ by a few px: the naan keeps its drawn width as it takes the next)
    const take = (t) => {
      const dw = naan.displayWidth;
      naan.setTexture(t).setScale(dw / Math.max(1, naan.width));
    };
    const toLook = (k) => {
      const t = `bk-naan-${k}`;
      if (!S.textures.exists(t) || (lookFade ? lookFade.texture.key : naan.texture.key) === t) return;
      if (lookFade) lookFade.destroy();
      const f = T(S.add.image(naan.x, naan.y, t).setDepth(naan.depth + 0.01).setAlpha(0));
      f.setScale(naan.scaleX * (naan.width / Math.max(1, f.width)));
      lookFade = f;
      S.tweens.add({ targets: f, alpha: 1, duration: 400 / (Cook.speed || 1), onComplete: () => {
        if (lookFade !== f) return;
        if (naan.active) take(t);
        f.destroy();
        lookFade = null;
      } });
    };
    const endLook = () => {
      if (!lookFade) return;
      const t = lookFade.texture.key;
      lookFade.destroy();
      lookFade = null;
      if (naan.active) take(t);
    };
    // the door's glass over the naan while it bakes: the baking oven's own window (O.glass: its box in the picture's px), faint
    const G = O.glass || [185, 245, 470, 215];
    let glass = null;
    // (contract-36: each step's call as it opens, from the engine only, R2: "open" said as a command; the naan "put in", as the
    // shelf's things are; where a word has no recording yet the engine shows its English in grey, a gap on the recording sheet)
    const call = (l, step) => {
      if (l && l.ok !== false && (!Lang.hasVoice || Lang.hasVoice(l))) return say(Lang.role(l, "call"));
      // (the engine cannot say it yet, a recording to make: logged as the kit's step call logs a line with no voice, skip-novoice)
      try {
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("step-call", { step: `baking:${step}`, by: "skip-novoice" });
      } catch (e) {
        /* only a log */
      }
    };
    // 1. open the oven
    expectTap(ov, null);
    call(Lang.say({ fn: "Command", verb: "v.open" }), "oven");
    await tapOn(ov, "oven");
    ov.setTexture("bk-oven-open");
    Cook.sfx.click();
    // 2. the naan in
    expectTap(naan, "ph-naan");
    // ("Hane naan!", the engine's line the bowl's step says: the naan's "put in" has no voice yet)
    const naanIn = Lang.say({ fn: "DoIt", verb: "v.put-in", obj: Lang.itemOf(["ph-naan"]) });
    call(naanIn && naanIn.ok !== false && (!Lang.hasVoice || Lang.hasVoice(naanIn)) ? naanIn : line("now", "call", Lang.phrase(["ph-naan"])), "naan");
    await tapOn(naan, "naan");
    z.expect({ kind: "wait" });
    setBusy(true);
    // (SH-256, contract-114: in the oven within 15% of its size on the tray, where it rests again when it comes out)
    await Cook.tween(S, { targets: naan, x: ox, y: rackY, scale: nk * 0.88, duration: 520, ease: "Cubic.easeInOut" });
    await Cook.wait(200);
    if (face) face.setVisible(false);
    ov.setTexture("bk-oven-baking");
    // (s19-games-2: the naan stays in view through the glass, its tray on the rack, the glass's glow faint over it)
    glass = T(S.add.image(ov.x, ov.y, "bk-oven-baking").setScale(ov.scaleX).setDepth(naan.depth + 0.5).setAlpha(O.glassAlpha || 0.4));
    glass.setCrop(G[0], G[1], G[2], G[3]);
    Cook.sfx.click();
    setBusy(false);
    // 3. it bakes: the ring fills; steam from the vent
    const bakeMs = (K.bakeMs || 3600) / (Cook.speed || 1);
    const partAt = N.part || 0.4;
    const t0 = Date.now();
    const rx = ox + ov.displayWidth / 2 - 70;
    const ry = oy - ov.displayHeight / 2 + 40;
    await new Promise((resolve) => {
      const off = z.tick(() => {
        const q = Math.min(1, (Date.now() - t0) / bakeMs);
        ring.clear();
        ring.lineStyle(10, col("ring"), 0.95).beginPath().arc(rx, ry, 34, 0, Math.PI * 2).strokePath();
        ring.lineStyle(10, col("ringBand"), 1).beginPath().arc(rx, ry, 34, -Math.PI / 2 + 0.8 * Math.PI * 2, (3 * Math.PI) / 2).strokePath();
        ring.lineStyle(6, q >= 0.8 ? col("ringDone") : col("ringFill"), 1).beginPath().arc(rx, ry, 34, -Math.PI / 2, -Math.PI / 2 + q * Math.PI * 2).strokePath();
        if (Math.random() < 0.04) steam(ox, oy - ov.displayHeight / 2, 1);
        if (q >= partAt) toLook(q >= 0.8 ? "golden" : "part");
        if (q >= 0.8) {
          off();
          resolve();
        }
      });
    });
    // 4. take it out ("Tayar ai." with the oven's light: it belongs to this step, never the naan's before it, contract-36); left in
    // the oven overMs past its green, the naan browns (overdone: a look, never a verdict, as the fried egg's; ART-73)
    const overMs = (K.overMs || K.bakeMs || 3600) / (Cook.speed || 1);
    const tReady = Date.now();
    const offOver = z.tick(() => {
      if (Date.now() - tReady < overMs) return;
      offOver();
      toLook("over");
    });
    expectTap(ov, "ph-naan");
    await tapOn(ov, "oven-out", () => say(line("ready", "call")));
    offOver();
    z.expect({ kind: "wait" });
    ring.clear();
    ov.setTexture("bk-oven-open");
    if (glass) glass.destroy();
    endLook();
    Cook.sfx.click();
    speak(line("careful", "react"));
    steam(ox, rackY, 6);
    await Cook.wait(300);
    await Cook.tween(S, { targets: naan, x: hx, y: hy, scale: nk, duration: 560, ease: "Cubic.easeInOut" });
    steam(hx, hy - 40, 4);
    ov.setTexture("bk-oven-shut");
    UI.mission.closeItem(["ph-naan"], 0, { head: true });
    // SH-254: one face, beside the tray at its upper left (where the small circle was), the naan in plain view
    const size = 190;
    const look = await Cook.Kit.review(S, { who, ok: true, x: hx - naan.displayWidth * 0.42, y: hy - naan.displayHeight / 2 - size * 0.5, size, side: "right" });
    await Cook.wait(400);
    await look.close();
    if (face && face.active) face.setVisible(true);
  }

  /** The words a round asks for (its plan's parts), for the word moment's due check. */
  const askedIds = (plan) => [...new Set(plan.flatMap((s) => (s.parts || []).filter((x) => typeof x === "string")))];

  Mech.lab(KEY, {
    name: "Baking (prototype)",
    verb: "Nani's turns: a little, a lot; then the oven",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.baking.make("nana", { level: L.level });
      const K = Mech.knobs(KEY, { level: L.level });
      d.plan = Cook.pick(K.plans || [[]]);
      // the jug's amounts are a word moment (CHAI-67's system) before the order that first asks them: the kit's call with the game's
      // settings (wordMoment: its pair, its jug pictures; ART-38's art to come)
      if (UI.wordMoment && SET().wordMoment) await UI.wordMoment(askedIds(d.plan), SET().wordMoment);
      L.ctx.steps = R.baking.steps(d);
      L.card(d, L.ctx.steps);
      await L.station(KEY, { plan: d.plan, who: "nana" });
    },
  });
})(window);
