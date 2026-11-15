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
 *   - Tap what she names: it lifts over the jug. Each tap tips it a bit more and a quarter cup goes in, until the jug reaches
 *     her amount, "enough" (more taps don't land); then the jug tips into the bowl. CK-72 (Zafar, 11 Nov evening: "just remove a
 *     little and a lot - those non specific measurements ... go with fixed measurements (quarter, half, 3/4, full, 1 1/2 and 2 and
 *     2 1/2)"): every amount is the jug's, at every level (a cup and a half at L1, up to two and a half at L4; the plans in
 *     data/stations/baking.json); "a little", "a lot" and "a little more" left baking for another game.
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
  const FAR = 2000; // (the worktop and the band reach this far past the sheet's sides on a wide screen: the frame's far)

  Mech.combined(KEY, {
    station: KEY,
    view: "marble",
    dataFile: "data/stations/baking.json",
    zones: [],
    async run(host, p) {
      return baking(host, p);
    },
  });

  /** The step's amounts in English for a sentence still to record (the jug's units: quarter cups; the settings' amountEn). */
  const amountEn = (u) => (SET().amountEn || {})[String(u)] || null;
  /**
   * CK-72: Nani's instruction for step s, "put in <amount> <thing>", from the engine (DoIt v.put-in over the step's parts: Lang.itemOf);
   * where the engine can't say it whole (an amount still to record), the whole sentence's English as the grey to-record line.
   */
  function amountLine(s) {
    const frame = SET().amountFrame || "{amount} {thing}";
    // (CK-89: a pinch has no Kutchi yet: the whole sentence is its English in grey, never the thing's word alone with the amount left
    // out, never an invented word; a line for the recording sheet)
    if (s.amt === "pinch") {
      const amt = amountEn("pinch") || amountEn(s.units) || "";
      return Lang.toRecord(frame.replace("{amount}", amt).replace("{thing}", Cook.english(s.id)), `baking: ${frame.replace("{amount}", amt)}`);
    }
    // (the r2 judge, 13 Nov: an amount with no number, "dedh cup" or "adhi cup" with atto, is no noun phrase the engine has a rule
    // for (a Join); its frame then said the first piece and tacked the rest after the verb, "Adhi cup wiji chad! atto". Until Mum
    // gives the whole sentence it is a gap: its English in grey, a line for the recording sheet, never stitched)
    const obj = Lang.itemOf(s.parts && s.parts.length ? s.parts : [s.id]);
    const doIt = obj.fn === "Join" ? { ok: false } : Lang.say({ fn: "DoIt", verb: "v.put-in", obj });
    if (doIt.ok !== false) return doIt;
    const amt = amountEn(s.amt === "spoon" ? "spoon" : s.units) || `${s.units / 4}`;
    return Lang.toRecord(frame.replace("{amount}", amt).replace("{thing}", Cook.english(s.id)), `baking: ${frame.replace("{amount}", amt)}`);
  }
  /** Every word id a step names is the engine's (a new amount waits for its lexicon entry: its plans are skipped till then). */
  const sayable = (plan) => plan.every((s) => (s.parts || []).every((x) => typeof x !== "string" || Lang.known(x)));

  /** The pictures this round draws, from the settings' items (decision 68: only these, and only what this round shows). */
  function artFor(onShelf, plan, jug, who) {
    const I = ITEMS();
    const sc = SET().scene || {};
    const list = [sc.bg ? ["bk-bg", sc.bg] : null, ["bk-cat", (sc.cat || {}).file]].filter(Boolean);
    Object.entries((I.mixBowl || {}).states || {}).forEach(([k, f]) => list.push([`bk-bowl-${k}`, f]));
    Object.entries((sc.oven || {}).states || {}).forEach(([k, f]) => list.push([`bk-oven-${k}`, f]));
    // (s19-games-2, ART-73: the naan's four stages, raw, part-baked, baked and overdone, each a look of its tray)
    ["raw", "part", "golden", "over"].forEach((k) => list.push([`bk-naan-${k}`, ((I.naan || {}).states || {})[k]]));
    // (CK-135: the dough ball that goes from the bowl to the tray and becomes the naan)
    list.push(["bk-dough", (I.dough || {}).file]);
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
    // (CK-72: every amount is measured in the jug, at every level)
    const hasJug = K.jug !== false;
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
    // (round 3: the light frames the thing alone, its picture; the asker's face sits inside it, FACE.seat)
    const litOf = (o) => Cook.Coach.box(o, PAD, { visible: true });
    const control = (o, name, current, withLight = null, { lightOnly = false } = {}) => {
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
      // (lightOnly: a call that belongs to the light alone, the tip's "Wiji chad!": said with the first-time light, never at once after)
      if (!first) {
        if (!lightOnly) sayNow();
      } else setTimeout(sayNow, 3000 / (Cook.speed || 1)); // (never silent: a light that cannot come)
      ctl = Cook.Coach.control({
        key: KEY,
        // (s19-games-2, contract-78/-36: the oven's steam is an effect, never a move the light waits for)
        still: () => {
          try {
            return !S.tweens.getTweens().some((tw) => tw.isPlaying() && !tw.isInfinite && !(tw.targets || []).every((t) => t && t.fx));
          } catch (e) {
            return true;
          }
        },
        note: `${KEY}:${name}`,
        target: litOf(o),
        first,
        noHint: true,
        current,
        busy: () => busy,
        // (contract-102, SH-236: its glow lasts as long as its light, which goes as the child starts the move; contract-107: no hop, none
        // of these is on the shelf)
        // (round 3, decision 38, 15 Nov: "the light floods the bowl and tray in heavy orange so the dough is hard to see; chai's is the
        // kit's pale gold edge": the kit's light alone, no glow of the thing's own; none of these is on the shelf, so none hops)
        onLight: () => sayNow(),
      });
      if (stuck) stuck.close();
      // SH-228 (chai's method): the stuck help after the level's wait from the last action (a child's time: the kit divides a game's
      // wait by the test speed), her helper card or her line again, with the kit's light and the thing's glow
      stuck = Cook.Coach.stuck
        ? Cook.Coach.stuck({
            key: KEY,
            level,
            target: litOf(o),
            hintMs: () => hintMs() || 7000,
            current,
            busy: () => busy,
            // (round 3: the kit's light alone, as the first-time light: no orange glow over the thing)
            glow: () => {},
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
    /*
     * Sprint 20 batch 2 (s20-b2-baking; docs/architecture/kitchen-frame.md): the floor plan is the kitchen frame's (Cook.Frame.area): the
     * worktop's wash and the shelf band drawn by it (baking's band, its settings' "shelf", pulled by its key: SH-248), the room laid out
     * in shares of its play area (the settings' scene.room), the screen's answers (its scale, its foot) asked of it; no screen or sheet
     * number of its own
     */
    const band = Object.assign({ top: 630, base: 818, chipY: 860 }, (global.Shelf && global.Shelf.BAND) || {});
    const F = Cook.Frame.area(S, { top: band.top, base: band.base, far: FAR, draw: true });
    const P = F.play;
    const ROOM = sc.room || {};
    const across = (share, dflt) => P.x + P.w * (share != null ? share : dflt);
    // (the worktop and the band stay through the oven, as chai's: marked so the move to the oven keeps them)
    [F.wash, F.stoneBand(S, { game: KEY })].forEach((o) => o && (T(o), (o.band = true)));
    const SHEET = Cook.Frame.sheet;
    const bg = sc.bg && has("bk-bg") ? T(S.add.image(SHEET.w / 2, SHEET.h / 2, "bk-bg").setDepth(D.bg + 2).setDisplaySize(SHEET.w, SHEET.h)) : null;
    // the cat (Simba) peeks over the shelf band's top edge (right), breathing; behind the band, so only his head shows
    const edgeY = band.top;
    const cat = has("bk-cat") ? T(S.add.image(across(ROOM.cat, 0.952), edgeY + 16, "bk-cat").setOrigin(0.5, 1).setDepth(D.bg + 1.1)) : null;
    if (cat) {
      cat.setScale(170 / cat.width);
      S.tweens.add({ targets: cat, y: edgeY + 10, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    }

    // the mixing bowl (the worktop's middle, its foot above the band): its picture follows what is in it (MB.states): empty, the flour
    // rising a quarter, a half, three quarters as it goes in (B1f), the shaggy dough once something wet is in (B1), then the dough
    const MB = I.mixBowl || {};
    const FLOUR = MB.flour || "cook-atto";
    const LIQUID_IDS = new Set(MB.wet || CT.liquid || []);
    // (s19-games-2, CHAI-89, Zafar 11 Nov: the play group centred in the frame's play area, as chai's: the bowl with the room a jar tips
    // in above it, MB.pourRoom; never lower than its old place on the worktop's front, 24 above the bottom row)
    const spanTop = P.y;
    const spanBot = P.y + P.h;
    const bowlH = (() => {
      const t = has("bk-bowl-empty") ? S.textures.get("bk-bowl-empty").getSourceImage() : null;
      return t ? (t.height * ((MB.drawn || {}).w || 380)) / Math.max(1, t.width) : 200;
    })();
    const bowlFoot = MB.foot || Math.min(F.bottom.y - 24, spanBot - Math.max(0, (spanBot - spanTop - (bowlH + (MB.pourRoom || 220))) / 2));
    const bowlX = across(ROOM.bowl, 0.5);
    const bowl = T(S.add.image(bowlX, bowlFoot, "bk-bowl-empty").setOrigin(0.5, 1).setDepth(D.item));
    bowl.setScale(((MB.drawn || {}).w || 380) / bowl.width);
    // (SH-268, Zafar 12 Nov: one upper-left light everywhere: the kit's one soft shadow, down and to the right)
    Cook.Kit.shadow(S, bowl);
    const bowlY = bowlFoot - bowl.displayHeight / 2; // (its middle: where things pour)
    /** Round 3 (decision 38, 15 Nov: chai glides, baking changed in one frame): a thing takes its next picture by a short fade in place,
     *  the new picture over it at its size; -> a promise for the fade's end. A swap asked while one runs finishes that one first. */
    const swap = (img, key, ms = 300) => {
      if (!img || !img.active || !has(key)) return Promise.resolve();
      if (img.swapping) img.swapping.finish();
      if (img.texture.key === key) return Promise.resolve();
      const o = S.add.image(img.x, img.y, key).setOrigin(img.originX, img.originY).setScale(img.scaleX, img.scaleY).setAngle(img.angle).setDepth(img.depth + 0.01).setAlpha(0);
      o.fx = true; // (an effect: the lights never wait for it)
      o.shadow = img.shadow; // (the same thing in its next look: its shadow is the thing's, SH-268)
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        if (img.active) img.setTexture(key);
        o.destroy();
        img.swapping = null;
      };
      img.swapping = { finish };
      return new Promise((resolve) => {
        S.tweens.add({ targets: o, alpha: 1, duration: ms, onUpdate: () => o.setPosition(img.x, img.y).setScale(img.scaleX, img.scaleY), onComplete: () => (finish(), resolve()) });
        img.once("destroy", () => (finish(), resolve()));
      });
    };

    /*
     * SH-258, CK-133 (the eye judge standing in for Zafar, decision 38, 15 Nov: "it floats by the bowl, jumps to the oven door, then the
     * tray"): one face circle, the asker's, from the first frame, sitting just beside what it owns and riding with it: the bowl, the dough
     * as it goes to the tray, the tray, into the oven and out again. It is its thing's own part (thing.face, Cook.Coach.parts): lit whole
     * with it, so no light's edge ever crosses it (contract-82; was kept a light's margin away, so it floated). Its size: 30 CSS px at
     * least (the frame's scale).
     *   FACE.give(thing, side, ms)   the face goes to beside thing (side 1: its right, -1: its left), gliding over ms to where thing is
     *                                as it moves; then it follows it
     */
    const FACE = (() => {
      if (!Cook.Kit.badge) return null;
      const fd = Math.min(90, Math.max(64, 30 / Math.max(0.01, F.px || 1)));
      const f = T(S.add.image(0, 0, Cook.Kit.badge(S, who)).setDisplaySize(fd, fd).setDepth(D.badge));
      f.setName("baking-face");
      const me = { f, owner: null, side: 1, held: false, gap: 0 };
      // (round 3, decision 38: "the lit box swells to take in Bapa's face circle: the light frames the thing alone": the face sits in its
      // thing's own corner, inside its picture's box, as chai's faces sit on the tray's corners, so the thing's light holds it whole
      // without growing, contract-82; its upper right on the bowl, the upper left on the tray)
      me.seat = (o = me.owner, side = me.side) => {
        const b = o.getBounds();
        // (gap: moved out from the corner where something is drawn round its thing, the bake ring round the naan in the oven)
        return { x: side > 0 ? b.right - fd * 0.5 + me.gap : b.x + fd * 0.5 - me.gap, y: b.y + fd * 0.5 };
      };
      me.give = async (o, side, ms = 0) => {
        if (me.owner && me.owner.face === f) me.owner.face = null;
        me.owner = o;
        me.side = side;
        o.face = f;
        if (!ms) {
          const p = me.seat();
          f.setPosition(p.x, p.y);
          return;
        }
        me.held = true;
        const from = { x: f.x, y: f.y };
        const k = { t: 0 };
        await Cook.tween(S, {
          targets: k,
          t: 1,
          duration: ms,
          ease: "Cubic.easeInOut",
          onUpdate: () => {
            if (!f.active || !o.active) return;
            const p = me.seat();
            f.setPosition(from.x + (p.x - from.x) * k.t, from.y + (p.y - from.y) * k.t);
          },
        });
        me.held = false;
      };
      const follow = () => {
        if (!f.active || me.held || !me.owner || !me.owner.active) return;
        const p = me.seat();
        f.setPosition(p.x, p.y);
      };
      S.events.on("update", follow);
      f.once("destroy", () => S.events.off("update", follow));
      return me;
    })();
    // (on the bowl's right: the jars and the jug tip in from its left)
    if (FACE) FACE.give(bowl, 1);
    let wet = false;
    const bowlState = (k) => {
      const key = `bk-bowl-${k}`;
      if (has(key) && bowl.texture.key !== key) swap(bowl, key);
      if (k === "mixing" || k === "dough") saltGone(); // (CK-89: mixed in)
    };
    /** The bowl after `done` of step s's taps (0-1): flour rises with the flour; anything wet makes the shaggy dough. */
    const bowlTo = (s, done) => {
      if (s && LIQUID_IDS.has(s.id) && done > 0) wet = true;
      if (wet) return bowlState("mixing");
      if (s && s.id === FLOUR && done > 0) return bowlState(done < 0.4 ? "flour1" : done < 0.75 ? "flour2" : "flour3");
    };

    /*
     * CK-89 (Zafar, 12 Nov: "we'll just put a small salt pile"): the salt that went in lies in the bowl as a small pile of crystals on the
     * flour (drawn in code, as chai's sugar lies on its tea): a pinch a small one, a teaspoon a bigger one (items.saltPile); it goes into
     * the dough as something wet is mixed in (the bowl's shaggy picture).
     */
    const SP = I.saltPile || {};
    const salt = T(S.add.graphics().setDepth(D.item + 0.2));
    salt.setName("baking-salt");
    const saltIn = [];
    const drawSalt = () => {
      salt.clear();
      const at = SP.at || [0.5, 0.27];
      const bw = bowl.displayWidth;
      const top = bowl.y - bowl.displayHeight;
      // (its colours, the settings': cool white faces, grey edges, a warm shade under it)
      const C = SP.colours || {};
      const hx = (k) => parseInt(String(C[k] || "").slice(1), 16) || 0;
      saltIn.forEach((amt, i) => {
        const w = bw * (SP[amt] || (amt === "pinch" ? 0.12 : 0.22));
        const x = bowl.x - bw / 2 + bw * at[0] + (i % 2 ? 1 : -1) * i * bw * 0.08;
        const y = top + bowl.displayHeight * at[1];
        // (cool white crystals on the warm flour: the salt reads as its own heap, the light from the upper left; its shade under it)
        salt.fillStyle(hx("shade"), C.shadeA != null ? C.shadeA : 0.3).fillEllipse(x + w * 0.05, y + w * 0.03, w * 1.08, w * 0.3);
        let seed = (i + 3) * 7919;
        const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
        const n = Math.round(90 + w * 2);
        const pts = [];
        for (let c = 0; c < n; c++) {
          const u = rnd() * 2 - 1; // across the mound
          const hgt = (1 - u * u) * w * 0.36; // its height there (a low cone)
          pts.push({ u, x: x + u * w * 0.5, y: y - Math.pow(rnd(), 0.7) * hgt, sz: Math.max(1.6, w * (0.03 + rnd() * 0.03)) });
        }
        // back to front, each crystal a lit face with a grey edge on its shaded side, the shaded flank greyer
        pts.sort((p, q) => p.y - q.y).forEach((p, c) => {
          salt.fillStyle(p.u > 0.2 ? hx("edgeDark") : hx("edge"), 1).fillRect(p.x - p.sz / 2 + p.sz * 0.25, p.y - p.sz / 2 + p.sz * 0.25, p.sz, p.sz);
          salt.fillStyle(p.u > 0.35 ? hx("dim") : c % 7 === 0 ? hx("glint") : hx("face"), 1).fillRect(p.x - p.sz / 2, p.y - p.sz / 2, p.sz, p.sz);
        });
      });
    };
    const saltGone = () => {
      if (!saltIn.length || !salt.active) return;
      S.tweens.add({ targets: salt, alpha: 0, duration: 400 });
    };

    // the measuring jug (L3 up), on the worktop left of the bowl: the empty picture, and the full one revealed by a rising crop up to
    // its line (never a drawn fill)
    let jug = null;
    if (hasJug) {
      const J = I.jug || {};
      // (its base level with the bowl's foot, wherever the bowl stands: CHAI-89)
      const jx = across(ROOM.jug, 0.28);
      const jy = bowlFoot;
      const c = T(S.add.container(jx, jy).setDepth(D.item + 0.5));
      const empty = S.add.image(0, 0, "bk-jug-empty").setOrigin(0.5, 1);
      const k = ((J.drawn || {}).w || 260) / empty.width;
      empty.setScale(k);
      const full = S.add.image(0, 0, "bk-jug-empty").setOrigin(0.5, 1).setScale(k).setVisible(false);
      c.add([empty, full]);
      c.setSize(empty.displayWidth, empty.displayHeight);
      // (SH-268: the jug's soft shadow under its glass as drawn, a container's own box being its foot, not its picture; it follows the jug)
      // CK-134 (decision 38, 15 Nov: "a grey blurred block inside it even empty"): a box-sized shadow behind clear glass shows through
      // it, so the glass jug's shadow is its foot's alone, a low soft oval where it stands, hidden while it is lifted to pour
      const eb = empty.getBounds();
      const footBox = { centerX: eb.centerX, centerY: eb.bottom - eb.height * 0.03, width: eb.width * 0.86, height: eb.height * 0.1 };
      c.shadow = S.contactShadow ? S.contactShadow(c, footBox) : Cook.Kit.shadow(S, c);
      if (c.shadow) c.shadow.njgShadow = true;
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
    const FLOUR_ID = (I.mixBowl || {}).flour || "cook-atto";
    const shelf = {};
    const n = onShelf.length;
    const PILL_SLOT = 200;
    // (the row across its share of the play area, ROOM.row (x 150-1450): eight things at L4 each keep a slot their picture and pill fit
    // in, contract-111)
    const pitch = Math.min(CT.pitch || 300, (P.w * (ROOM.row || 0.864)) / Math.max(1, n));
    const pills = [];
    // CK-84, ART-52 (Zafar, 6 Nov: size classes for every item): each thing by its size class, as chai's jars (St.classFit: the band's
    // room with the hop kept, the class's share, the floor on screen; never wider than its slot), its picture's clear foot on the shelf's
    // line (the opaque bottom, St.opaqueSpan, as chai's); its tap area reaches down its slot to its pill (S.tappable, Shelf.P.reach)
    const ppwShelf = F.px || 1;
    onShelf.forEach((id, i) => {
      const x = bowlX + (i - (n - 1) / 2) * pitch;
      const key = `bk-${id}`;
      const foot = St.opaqueSpan && has(key) ? St.opaqueSpan(S, key)[1] : 1;
      const img = T(S.add.image(x, band.base, key).setOrigin(0.5, foot).setDepth(D.item + 1));
      // (s19-k3, CK-84: the three walnut-lid jars, flour, sugar and salt, told apart by their height as well as their pills: each at the
      // flour jar's class height times its share as cut, CT.heights: 1, 0.825, 0.664; a thing with no share by its own class)
      const share = (CT.heights || {})[id];
      const f = St.classFit && has(key) ? St.classFit(S, key, share != null ? FLOUR_ID : id, { base: band.base, ppw: ppwShelf, slotW: (pitch - 12) / Math.max(0.1, share || 1) }) : null;
      // (never under its own class's height: one height per size class, contract-115; flour, sugar and salt still stand at three
      // heights, L, M and S)
      const own = share != null && St.classFit && has(key) ? St.classFit(S, key, id, { base: band.base, ppw: ppwShelf, slotW: pitch - 12 }) : null;
      const sc = f && f.scale ? Math.max(f.scale * (share != null ? share : 1), own && own.scale ? own.scale : 0) : 0;
      img.setScale(sc || Math.min(Math.min(tall, (band.base - band.top - 30) / 1.12) / img.height, 150 / img.width));
      Cook.Kit.shadow(S, img); // (SH-268: on the shelf and as it is lifted and tipped)
      img.home = { x, y: band.base };
      img.wordId = id;
      shelf[id] = img;
      const chip = Cook.Kit.chip(S, id, x, band.chipY, { word: Cook.chipWord ? Cook.chipWord(id, ctx) : true });
      chip.pillId = id;
      img.chip = chip; // (its pill is part of its light: Cook.Coach.parts)
      // CK-102 (the S19 gate's eye judge, 12 Nov: "the shelf band is an empty strip for the whole bake"): the shelf's things and their
      // pills stay on the band through the oven, as the band does (the move to the oven keeps what is marked band)
      img.band = chip.band = true;
      objs.push(chip);
      pills.push(chip);
    });
    const fitPills = () => {
      if (!SH || !SH.pillScale || !pills.length || !pills[0].faceW) return;
      const ppw = Math.max(0.01, F.px || 1);
      const row = pills.filter((c) => c.active).sort((a, b) => a.x - b.x);
      const { k, cap } = SH.pillScale(row.map((c) => ({ x: c.x, w: c.faceW(c.showsWord) })), { want: SH.pillWant(ppw), gap: SH.pillGap(ppw), slotW: PILL_SLOT });
      const ph = ((SH.PILL || {}).h || 46) * k;
      // (whole above the view's foot, the frame's bottom row, 4 clear)
      const y = Math.min(band.chipY, F.bottom.y + F.bottom.h - 4 - ph / 2);
      row.forEach((c) => {
        if (c.capW !== cap && c.face) c.face(c.showsWord, cap);
        c.k = k;
        if (c.hit) c.hit(Math.min(PILL_SLOT, pitch - 4)); // (a pill's tap area never reaches past its own slot into the next thing's)
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

    /*
     * s19-clean-e (contract-111, SH-244: the item wins the taps meant for it): a jar lifted over the jug or the bowl is tipped a little more
     * at each tap, so its picture's own frame turns with it and the corners of the box it is seen in (its edges' middles, 4 px in) fell
     * outside its tap area: a tap there did nothing. While it is up, a tap anywhere in the box it is drawn in tips it (its world bounds,
     * read at each tap); it has no pill and nothing else stands there. Back in its slot its area is the shelf's again (Shelf.P.reach).
     */
    const reachWhole = (img) => {
      const inp = img && img.input;
      if (!inp || inp.njgWhole || typeof inp.hitAreaCallback !== "function") return;
      const own = inp.hitAreaCallback;
      inp.njgWhole = true;
      inp.hitAreaCallback = function (area, x, y, o) {
        if (own(area, x, y, o)) return true;
        if (!o.lifted) return false;
        try {
          const p = o.getWorldTransformMatrix().transformPoint(x - (o.displayOriginX || 0), y - (o.displayOriginY || 0));
          const b = o.getBounds();
          return p.x >= b.x && p.x <= b.right && p.y >= b.y && p.y <= b.bottom;
        } catch (e) {
          return false;
        }
      };
    };

    /** One instruction: Nani says it, its row appears; the child taps the container, then taps to tip it, to the amount. */
    async function step(s, i) {
      if (UI.mission.reveal) UI.mission.reveal(`bake-${i + 1}`);
      // the reveal lessons (the dotted word, then the blurred picture) as the first row that shows one appears (contract-98)
      await Cook.Coach.lessons({ gate, ctx, busy: () => busy });
      // (CK-89: a pinch or a teaspoon of salt goes straight into the bowl, one tip, never through the jug)
      const spoonful = s.amt === "pinch" || s.amt === "spoon";
      const jugStep = !!jug && !spoonful;
      // (her turn is the order, said row by row: its row appears as she says it, as a person's order does. s19-games-2: kept the
      // order's role, not a call: an item said as a call while her helper card is closed breaks SH-172, contract-89)
      // CK-72: the amount and the thing in one sentence from the engine ("Hakro cup atto wiji chad!", "Ba cup atto wiji chad!", "Adh
      // paani wiji chad!"); an amount still to record (a quarter, three quarters, one and a half, two and a half) makes a sentence the
      // engine can't say whole: its English in grey, never stitched from fragments (non-negotiable 2), a line for the recording sheet
      const call = Lang.role(amountLine(s), "order");
      say(call);
      // which one: the shared step (the help ladder's pause, then her word and the glow; a wrong one wiggles at L1)
      const r = await S.step({
        items: Object.assign({}, shelf),
        expected: s.id,
        // (s19-clean-e2, contract-36: her line again after the pause comes with the jar's light, so it is the step's call; the first
        // saying above stays the order, contract-89)
        sayLine: Lang.role(amountLine(s), "call"),
        io: z.io,
        quiet: z.quiet,
        onWrong: (key) => (Cook.Coach.wrong(), z.listen(false, `took ${key} for ${s.id}`)),
        onLand: (key, obj) => S.tweens.add({ targets: obj, y: obj.home.y - 30, duration: 140, yoyo: true }),
      });
      z.listen(true, `took ${s.id}`);
      if (!ctx.guided && Lang.known(s.id)) Cook.markRight(s.id);
      const img = shelf[r.key];
      const into = jugStep ? jug.mouth() : { x: bowlX, y: bowlY - 60 };
      // lift it over the target (its pill stays on the shelf: while it is up, the thing's light is the thing alone, contract-105)
      // (its pill takes no tap while its thing is up: contract-111 read a lifted jar's slot as a shelf item that took no tap; CK-136: it
      // no longer fades)
      const pill = img.chip;
      img.chip = null;
      // CK-136 (decision 38, 15 Nov: "the 'paani' pill faded while its bottle is there"): the pill stays as it is while its thing is up
      // (the thing is on screen, so its word is too); only its tap is off, so a tap in the slot never says the word for a lifted thing
      const pillShow = (on) => {
        if (!pill || !pill.active) return;
        if (pill.input) pill.input.enabled = on;
      };
      pillShow(false);
      img.lifted = true;
      busy = true;
      await Cook.tween(S, { targets: img, x: into.x - 150, y: into.y - 60, duration: 360, ease: "Cubic.easeOut" });
      busy = false;
      const liquid = LIQUID.has(s.id);
      // how many taps: a quarter cup a tap, to her amount (CK-72)
      const need = spoonful ? 1 : Math.max(1, s.units || 4);
      let taps = 0;
      let open = true;
      const tipOf = (t) => Math.min(115, 30 + t * (85 / Math.max(1, need)));
      await new Promise((resolve) => {
        const tap = async () => {
          if (busy || taps >= need) return; // more taps don't land
          // (SH-236, contract-102: the light goes as the child starts the move, and the thing's glow with it)
          if (ctlObj === img) S.glow(img, false);
          busy = true;
          taps++;
          // each tap tips it a bit more (to 115 degrees), and some goes in
          await Cook.tween(S, { targets: img, angle: tipOf(taps), duration: 160 });
          Cook.sfx.pour ? Cook.sfx.pour() : Cook.sfx.pop();
          await pourOnce(img, jugStep ? { x: jug.x, y: jug.y - jug.h * 0.3 } : { x: bowlX, y: bowlY - 40 }, s.id, liquid);
          if (jugStep) {
            jug.units = taps;
            jug.show(s.id);
          } else if (spoonful) {
            saltIn.push(s.amt);
            drawSalt();
            if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("baking-salt", { step: s.amt, by: `piles:${saltIn.length}` });
          } else bowlTo(s, taps / need);
          busy = false;
          if (taps >= need) return resolve();
          expectTap(img, s.id);
        };
        S.tappable(img, tap);
        reachWhole(img);
        expectTap(img, s.id);
        // (s19-clean-e2, contract-36: the tip is a step of its own, the lifted jar lit; Nani calls it with its light, Mum's recorded
        // "Wiji chad!" (lines.guide-add, put it in), the engine's line: the amount was said as the order as the jar was asked for)
        // (only with its first-time light: said at once on every tip it came 2 s after the amount, twice in a row, contract-22, -89)
        control(img, "tip", () => open, () => say(line("guide-add", "call")), { lightOnly: true });
      });
      open = false;
      unlight();
      S.untap(img);
      z.expect({ kind: "wait" });
      // the amount is there: the row ticks at once (Zafar, 1 Nov), then her word
      UI.mission.tickItem(s.id, 0, { close: true });
      Cook.sfx.right();
      speak(line("enough", "react"));
      busy = true;
      // (it rests tipped a moment, its pour done, while the light that followed it fades: Onboard.light's 300 ms, real time)
      await new Promise((r) => setTimeout(r, FADE_MS));
      await Cook.tween(S, { targets: img, angle: 0, x: img.home.x, y: img.home.y, duration: 380, ease: "Cubic.easeInOut" });
      img.chip = pill;
      img.lifted = false;
      pillShow(true);
      if (jugStep) {
        // the jug tips into the bowl by itself
        if (jug.c.shadow) jug.c.shadow.lifted = true;
        await Cook.tween(S, { targets: jug.c, x: bowlX - 170, y: bowlY - 60, angle: 70, duration: 420 });
        await pourOnce({ x: jug.c.x, y: jug.c.y, angle: 70, displayHeight: jug.h }, { x: bowlX, y: bowlY - 40 }, s.id, true);
        jug.units = 0;
        jug.show(null);
        // (the flour in the bowl by how much went in: two cups and more fill it to three quarters)
        bowlTo(s, Math.min(1, need / 8));
        await Cook.tween(S, { targets: jug.c, x: jug.x, y: jug.y, angle: 0, duration: 380 });
        if (jug.c.shadow) jug.c.shadow.lifted = false;
      }
      busy = false;
      await Cook.wait(250);
    }

    for (let i = 0; i < plan.length; i++) await step(plan[i], i);

    // the dough: tap the bowl (its call comes with its light the first time, contract-36 and -78; at once after that)
    let bowlOpen = true;
    await new Promise((resolve) => {
      S.tappable(bowl, () => {
        S.untap(bowl);
        resolve();
      });
      // CK-84 (the eye judge, 10 Nov: the order's headline lit gold with the bowl): the bowl's tap names no word (the naan's word lit
      // the card's headline as a second gold thing); its light is the bowl's alone
      expectTap(bowl, null);
      control(bowl, "bowl", () => bowlOpen, () => say(line("now", "call", Lang.phrase(["ph-naan"]))));
    });
    bowlOpen = false;
    unlight();
    z.expect({ kind: "wait" });
    bowlState("dough");
    await Cook.tween(S, { targets: bowl, scaleY: bowl.scaleY * 1.04, duration: 220, yoyo: true });
    Cook.sfx.pop();
    await Cook.wait(400);

    /* ---------------- the oven (the same camera, the same worktop) ---------------- */
    // SH-280, CK-135 (the eye judge, decision 38, 15 Nov: the dough visibly becomes naan, things go to the oven in place, no two-scene
    // cross-fade): oven() moves the bowl's things off and the oven in; what is left of the mixing (the salt, the drops) goes with them
    const keep = (o) => o && o.active && o !== bg && o !== cat && !o.band && o !== bowl && !(jug && o === jug.c) && !(FACE && o === FACE.f);
    const rest = objs.filter(keep);
    // (SH-158, contract-77: the bake ring's first-time hold, chai's: a new player's first ring waits in the middle of its green until the
    // child taps the oven; never a returning player's)
    const hold = St.firstHold ? St.firstHold(ctx, `${KEY}:oven`) : null;
    await oven(S, z, { F, who, K, T, control, unlight, expectTap, speak, say, setBusy: (b) => (busy = b), FACE, bowl, jug, rest, has, hold, swap });
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
  async function oven(S, z, { F: F1, who, K, T, control, unlight, expectTap, speak, say, setBusy, FACE, bowl, jug, rest, has, hold, swap }) {
    const O = (SET().scene || {}).oven || {};
    const N = ITEMS().naan || {};
    // (Sprint 20 batch 2: the oven is the round's next screen, the frame's area.next: the same bottom row, its band kept; the play area
    // read again as it lays out)
    const F = F1.next();
    const P = F.play;
    const ROOM = (SET().scene || {}).room || {};
    // (s19-games-2, CHAI-89: the oven and its tray centred down the play area, as chai's group; across at its share, ROOM.oven)
    const ox = P.x + P.w * (ROOM.oven != null ? ROOM.oven : 0.566);
    const oy = P.y + P.h / 2;
    const ov = T(S.add.image(ox, oy, "bk-oven-shut").setDepth(D.item + 1));
    // CK-101 (the S19 gate's eye judge, 12 Nov: "the oven is toy-sized", its front the mixing bowl's width and twice the tray's): the oven
    // as wide as the settings ask (drawn.w), never taller than the play area's height (O.room: its share of it). CK-136 (decision 38,
    // 15 Nov, 740x320: its light ran off the screen's top): nor so tall that its light, the kit's widest margin on the page round its
    // box, would leave the view: the room it keeps above it, the same below (centred)
    const OL = (global.Onboard && global.Onboard.LIGHT) || { max: 16, clear: 2 };
    const lightIn = (OL.max + OL.clear + 4) / Math.max(0.05, F.px || 1) + PAD;
    const above = Math.max(0, lightIn - (P.y - F.view().top));
    const roomH = Math.max(200, Math.min(P.h * (O.room || 0.96), P.h - 2 * above));
    ov.setScale(Math.min(((O.drawn || {}).w || 560) / ov.width, roomH / ov.height));
    Cook.Kit.shadow(S, ov); // (SH-268)
    // SH-275 (decision 39, Zafar's yes, 15 Nov): the bake's window is the kit's heat ring, chai's own (Cook.Kit.heatRing: its track, the
    // green band, the gold fill, the knob), round the naan on the oven's window, filling to its green; none on the pour
    const heat = Cook.Kit.heatRing(S, { depth: D.fx + 1 });
    const steam = (x, y, k = 3) => {
      for (let i = 0; i < k; i++) {
        const s = T(S.add.circle(x + (Math.random() - 0.5) * 120, y, 14 + Math.random() * 10, col("steam"), 0.55).setDepth(D.fx + 2));
        s.fx = true; // (an effect: the lights never wait for it, stillStage)
        S.tweens.add({ targets: s, y: y - 160 - Math.random() * 60, alpha: 0, scale: 2.6, duration: 1400 + i * 120, delay: i * 120, onComplete: () => s.destroy() });
      }
    };
    // the naan on its tray (the worktop, left of the oven, above the band), raw (B3: the tray of raw naan, then baked)
    const hx = P.x + P.w * (ROOM.tray != null ? ROOM.tray : 0.1875);
    const hy = oy + ((N.drawn || {}).w || 260) * (N.below != null ? N.below : 0.57);
    const naan = T(S.add.image(hx, hy, "bk-naan-raw").setDepth(D.item + 2));
    const nk = ((N.drawn || {}).w || 260) / naan.width;
    naan.setScale(nk);
    Cook.Kit.shadow(S, naan); // (SH-268)
    /*
     * CK-135, SH-280 (decision 38, 15 Nov: "the dough visibly becomes naan and things go to the oven in place, no two-scene cross-fade"),
     * on the same worktop, each thing moving, nothing faded into another scene: the jug slides away left; the dough lifts out of the bowl
     * (the bowl empty behind it) and goes to the tray's place, the face riding with it; there it flattens and spreads into the raw naan
     * on its tray; the bowl slides off right as the oven slides in from the right into its place.
     */
    const V0 = F.view();
    const homeX = ox;
    ov.setX(V0.right + ov.displayWidth / 2 + 24);
    naan.setAlpha(0);
    setBusy(true);
    (rest || []).forEach((o) => o.active && o.destroy());
    if (jug && jug.c && jug.c.active) {
      if (jug.c.shadow) jug.c.shadow.lifted = true;
      // (round 3: it fades as it slides, never vanishing in a frame)
      await Cook.tween(S, { targets: jug.c, x: V0.left - jug.w * 0.2, alpha: 0, duration: 420, ease: "Sine.easeIn" });
      jug.c.destroy();
    }
    const DG = ITEMS().dough || {};
    const ball = has("bk-dough") ? T(S.add.image(bowl.x, bowl.y - bowl.displayHeight * 0.5, "bk-dough").setDepth(D.item + 3)) : null;
    if (ball) {
      const bk = ((DG.drawn || {}).w || 170) / ball.width;
      ball.setScale(bk * 0.85).setAlpha(0);
      Cook.Kit.shadow(S, ball);
      // (round 3: the shaggy dough gathers into the ball in place, the ball coming up as the bowl's dough fades to the empty bowl, 300 ms)
      await Promise.all([swap(bowl, "bk-bowl-empty", 320), Cook.tween(S, { targets: ball, alpha: 1, duration: 320 })]);
      // out of the bowl and up, the face going to it as it lifts
      await Promise.all([
        Cook.tween(S, { targets: ball, y: bowl.y - bowl.displayHeight - ball.displayHeight * 0.4, scale: bk, duration: 380, ease: "Cubic.easeOut" }),
        FACE ? FACE.give(ball, 1, 380) : null,
      ]);
      // across to the tray's place, landing where the naan will lie
      await Cook.tween(S, { targets: ball, x: hx, y: hy, duration: 560, ease: "Sine.easeInOut" });
      // it flattens and spreads: the raw naan on its tray comes up under it as the ball goes flat and wide
      await Promise.all([
        Cook.tween(S, { targets: ball, scaleY: bk * 0.3, scaleX: bk * 1.5, alpha: 0, duration: 420, ease: "Cubic.easeIn" }),
        Cook.tween(S, { targets: naan, alpha: 1, duration: 420, delay: 80 }),
        FACE ? FACE.give(naan, -1, 420) : null,
      ]);
      ball.destroy();
    } else {
      await Promise.all([Cook.tween(S, { targets: naan, alpha: 1, duration: 300 }), FACE ? FACE.give(naan, -1, 300) : null]);
    }
    // the bowl slides off right as the oven comes in from the right
    await Promise.all([
      Cook.tween(S, { targets: bowl, x: V0.right + bowl.displayWidth, duration: 520, ease: "Cubic.easeIn" }),
      Cook.tween(S, { targets: ov, x: homeX, duration: 640, delay: 120, ease: "Cubic.easeOut" }),
    ]);
    bowl.destroy();
    setBusy(false);
    const tapOn = (o, name, withLight = null) => {
      let open = true;
      return new Promise((resolve) => {
        S.tappable(o, () => {
          S.untap(o);
          // (contract-106: the light goes as the child's press starts the move, as eggs' and corn's do: the kit's began)
          if (Cook.Coach.began) Cook.Coach.began(KEY);
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
    // (always: said and shown even with no voice of its own, as it was before s19-clean-b; the review's finding 12: Nani's "it's ready" is
    // the oven's only cue and was dropped where it had no clip and no device voice)
    const call = (l, step, always = false) => {
      // (a line the engine says with no family clip yet, "Tayar ai.": shown and said as the test build says it, and logged as the kit's
      // step call logs a line with no voice, skip-novoice: a recording to make)
      const clip = !!(l && l.ok !== false && (!Lang.planOf || Lang.planOf(l).some((c) => c.file)));
      if (!clip) {
        try {
          if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("step-call", { step: `baking:${step}`, by: "skip-novoice" });
        } catch (e) {
          /* only a log */
        }
      }
      if (l && l.ok !== false && (always || !Lang.hasVoice || Lang.hasVoice(l))) say(Lang.role(l, "call"));
    };
    // (a test log: each oven step as it opens, for the evidence probes, CK-100 to CK-102: every:life:baking-oven)
    const ovenNote = (step) => {
      try {
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("baking-oven", { step, by: `oven:${Math.round(ov.displayWidth)} tray:${Math.round(naan.displayWidth)}` });
      } catch (e) {
        /* only a log */
      }
    };
    // 1. open the oven
    ovenNote("open");
    expectTap(ov, null);
    call(Lang.say({ fn: "Command", verb: "v.open" }), "oven");
    await tapOn(ov, "oven");
    swap(ov, "bk-oven-open");
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
    // CK-100 (the S19 gate's eye judge, 12 Nov: "the tray goes into the oven, the face circle stays behind beside nothing"): their face
    // goes with the tray, to beside the oven's door at the rack's height, outside the oven (never over the naan, never in the oven's
    // lit box), and comes back with the tray
    // CK-133 (decision 38): the face rides with the tray into the oven and out (it follows the naan, FACE), kept just outside the bake
    // ring there
    const inW = naan.displayWidth * 0.88;
    const inH = naan.displayHeight * 0.88;
    const ringR = inW / 2 + 20;
    // (the face out from the tray's corner along its top until it is clear of the ring and its track, 12, with a little air)
    const ringGap = () => {
      const fd = FACE.f.displayWidth;
      const R = ringR + 12 + fd / 2 + 4;
      const cy = -inH / 2 + fd / 2;
      return Math.max(0, Math.sqrt(Math.max(0, R * R - cy * cy)) - inW / 2 + fd / 2);
    };
    await Promise.all([
      Cook.tween(S, { targets: naan, x: ox, y: rackY, scale: nk * 0.88, duration: 520, ease: "Cubic.easeInOut" }),
      // (clear of the ring's outer edge: its radius, half its track, 12, and a little air)
      FACE ? Cook.tween(S, { targets: FACE, gap: ringGap(), duration: 520, ease: "Cubic.easeInOut" }) : null,
    ]);
    await Cook.wait(200);
    await swap(ov, "bk-oven-baking");
    // (s19-games-2: the naan stays in view through the glass, its tray on the rack, the glass's glow faint over it)
    glass = T(S.add.image(ov.x, ov.y, "bk-oven-baking").setScale(ov.scaleX).setDepth(naan.depth + 0.5).setAlpha(O.glassAlpha || 0.4));
    glass.setCrop(G[0], G[1], G[2], G[3]);
    Cook.sfx.click();
    setBusy(false);
    ovenNote("baking");
    // 3. it bakes: the ring fills; steam from the vent
    const bakeMs = (K.bakeMs || 3600) / (Cook.speed || 1);
    const partAt = N.part || 0.4;
    const t0 = Date.now();
    // (the green from 0.8 of the bake: its ready; past the band's end the kit's ring turns to its over colour as the naan browns)
    const GREEN = [0.8, 1];
    const ringAt = (q) => heat.draw(naan.x, naan.y, ringR, q, GREEN[0], GREEN[1]);
    await new Promise((resolve) => {
      const off = z.tick(() => {
        const q = Math.min(1, (Date.now() - t0) / bakeMs);
        ringAt(Math.min(q, GREEN[0]));
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
    // (the ring goes on filling through the green, over its end as the naan browns)
    let browned = false;
    const offOver = z.tick(() => {
      const u = (Date.now() - tReady) / overMs;
      let v = Math.min(GREEN[1] + 0.06, GREEN[0] + (GREEN[1] - GREEN[0]) * u);
      if (hold) v = hold.cap(v, GREEN[0], GREEN[1], `${KEY}:oven`);
      ringAt(v);
      if (v < GREEN[1] || browned) return;
      browned = true;
      toLook("over");
    });
    ovenNote("ready");
    expectTap(ov, "ph-naan");
    // (contract-36: said through the step's call, so a line still to record logs its skip, as the oven's open does)
    await tapOn(ov, "oven-out", () => call(Lang.line("ready"), "oven-out", true));
    if (hold) hold.end(`${KEY}:oven`);
    offOver();
    z.expect({ kind: "wait" });
    heat.clear();
    swap(ov, "bk-oven-open");
    if (glass) glass.destroy();
    endLook();
    Cook.sfx.click();
    speak(line("careful", "react"));
    steam(ox, rackY, 6);
    await Cook.wait(300);
    await Promise.all([
      Cook.tween(S, { targets: naan, x: hx, y: hy, scale: nk, duration: 560, ease: "Cubic.easeInOut" }),
      FACE ? Cook.tween(S, { targets: FACE, gap: 0, duration: 560, ease: "Cubic.easeInOut" }) : null,
    ]);
    steam(hx, hy - 40, 4);
    swap(ov, "bk-oven-shut");
    ovenNote("out");
    UI.mission.closeItem(["ph-naan"], 0, { head: true });
    // SH-254: one face, beside the tray at its upper left (where the small circle was), the naan in plain view
    const size = 190;
    const face = FACE && FACE.f.active ? FACE.f : null;
    if (face) face.setVisible(false); // (the review's face takes its place while it shows)
    const look = await Cook.Kit.review(S, { who, ok: true, x: hx - naan.displayWidth * 0.42, y: hy - naan.displayHeight / 2 - size * 0.5, size, side: "right" });
    await Cook.wait(400);
    await look.close();
    if (face && face.active) face.setVisible(true);
    heat.destroy();
  }

  /** The words a round asks for (its plan's parts), for the word moment's due check. */
  const askedIds = (plan) => [...new Set(plan.flatMap((s) => (s.parts || []).filter((x) => typeof x === "string")))];
  /**
   * The round's word moment (CK-72, Zafar 9 Nov: the jug's amounts "each a word moment"; the review of s19-clean-b, finding 9: three
   * quarters had none, nor had a quarter, one and a half or two and a half, as nothing read the settings' ids): the settings' first
   * moment (half and a cup), then one per amount (wordMoment.moments, each over the first's vessel and stream); the first that is due
   * this round (UI.wordMomentDue: its pair asked, new to the child, its key unseen), at most one a round; null: none.
   */
  const wordMomentFor = (ids) => {
    const wm = SET().wordMoment;
    if (!wm) return null;
    const sets = [wm].concat((wm.moments || []).map((m) => Object.assign({}, wm, m, { moments: undefined })));
    return sets.find((m) => (UI.wordMomentDue ? UI.wordMomentDue(ids, m) : m === wm)) || null;
  };

  Mech.lab(KEY, {
    name: "Baking (prototype)",
    verb: "Nani's amounts by the jug; then the oven",
    async run(L) {
      const R = Cook.Recipes;
      const d = R.baking.make("nana", { level: L.level });
      const K = Mech.knobs(KEY, { level: L.level });
      // (CK-72: a plan naming an amount the engine doesn't know yet, three quarters, waits for its lexicon entry)
      const plans = (K.plans || [[]]).filter(sayable);
      d.plan = Cook.pick(plans.length ? plans : K.plans || [[]]);
      // the jug's amounts are a word moment (CHAI-67's system) before the order that first asks them: the kit's call with the game's
      // settings (wordMoment: its pair, its jug pictures, and one for each amount the jug adds; ART-38's art to come)
      const wm = UI.wordMoment ? wordMomentFor(askedIds(d.plan)) : null;
      if (wm) await UI.wordMoment(askedIds(d.plan), wm);
      L.ctx.steps = R.baking.steps(d);
      L.card(d, L.ctx.steps);
      await L.station(KEY, { plan: d.plan, who: "nana" });
    },
  });
})(window);
