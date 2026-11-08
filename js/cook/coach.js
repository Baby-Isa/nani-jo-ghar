/*
 * Cook with Nani: first-time onboarding by showing, not telling (Wave 6,
 * docs/design-language/ux-principles.md 8; Wave 6b, 10: the shared kit and a script per
 * station).
 *
 * Wave 6b: each kept station has an ONBOARDING SCRIPT in data
 * (data.onboard.<station>: the moves the overlay shows, in order, and what
 * each one is), run by the shared onboarding kit (js/shared/onboard.js):
 * everything dims except the next thing to do, a ghost hand does the move
 * once (a tap, a swipe, a stir round the pot, a roll up and down), the
 * child does it, then the next thing is shown. After the script's moves the
 * overlay is gone for good at that station (once per profile, through
 * js/shared/uistore.js), and the light bulb is the help.
 *
 * The spotlight follows Cook.expect, the "what to do next" every station
 * already publishes (for the test harness and Nani's glow): a world point
 * for taps, rings and gestures, or a page selector for buttons (the tick,
 * "Go to the barbecue"). A step ends when the child has done it: the thing
 * to do changes, or a tap/gesture was made (Cook.acted). The gesture the
 * ghost shows is the script's `do` (build/test_cook.py checks each script
 * against the moves the station really asks for).
 * Safety: if there's nothing to point at for a moment (Nani talking, a
 * "pass me", a panel), the overlay steps back and the script ends, so it
 * can never trap a child.
 *
 * Without the shared kit (a page that doesn't load it) it falls back to the
 * Wave 6 overlay (#coach), which never takes a tap.
 */
import { Cook as CookNS } from "./ns.js";
import { setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame, cancelAnimationFrame } from "./life.js";

(function (global) {
  const Cook = CookNS;
  const C = (Cook.Coach = {});
  const $ = (s) => document.querySelector(s);
  let live = null;

  const calm = () => (Cook.data && Cook.data.calm) || {};
  const scripts = () => (Cook.data && Cook.data.onboard) || {};
  const OB = () => global.Onboard;
  const obId = (key) => `cook/${key}`;
  /** Has this station been shown already? */
  // (SH-120: the grown-ups' New player sees every station's first-time help in each visit, whatever the save says)
  const newPlayer = () => !!(OB() && OB().newPlayer && OB().newPlayer());
  C.seen = (key) => !newPlayer() && (!!(Cook.save.coached || {})[key] || !!(OB() && OB().seen(obId(key))));
  C.active = () => !!live;
  /** The phase being coached now (its data.onboard key), or null. */
  C.key = () => (live ? live.key : null);
  /** The script for a station (data.onboard), or null. */
  C.script = (key) => {
    const s = scripts()[key];
    return Array.isArray(s) && s.length ? s : null;
  };

  /** Where the thing to do is, on the page: {x, y, r} (a circle) plus the finger's move. */
  function target(e) {
    if (!e || e.kind === "wait" || e.intro) return null;
    const UI = Cook.UI;
    const canvas = document.querySelector("#game canvas");
    if (!canvas) return null;
    const k = UI.worldScale ? UI.worldScale() : canvas.getBoundingClientRect().width / 1600;
    if (e.kind === "click") {
      const el = e.selector && document.querySelector(e.selector);
      if (!el || !el.offsetParent) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: Math.max(b.width, b.height) / 2 + 12, move: "tap" };
    }
    if (e.x1 != null) {
      const a = UI.worldToScreen(e.x1, e.y1);
      const b = UI.worldToScreen(e.x2, e.y2);
      const r = Math.hypot(b.x - a.x, b.y - a.y) / 2 + 60 * k;
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, r, move: "swipe", dx: b.x - a.x, dy: b.y - a.y, a, b };
    }
    if (e.x == null) return null;
    const p = UI.worldToScreen(e.x, e.y);
    const size = (e.rx || e.r || 90) * k;
    const move = { hold: "hold", roll: "roll", stir: "stir", knead: "tap", timing: "tap" }[e.kind] || "tap";
    return { x: p.x, y: p.y, r: Math.max(46, size + 26 * k), move, rr: size };
  }
  C.target = target;

  /* ---------------- the shared kit (Wave 6b) ---------------- */
  // the ghost's gesture for an expectation: the kit's names
  const GESTURE = { tap: "tap", swipe: "swipe", roll: "drag", stir: "circle-stir", hold: "hold" };
  const rectAround = (t, r) => [t.x - r, t.y - r, 2 * r, 2 * r];
  /** A step's signature: it changes when the child has done the thing (never on movement alone). */
  const sig = (e) => (e ? [e.kind, e.key || "", e.selector || "", Cook.acted || 0, e.kind === "stir" && typeof e.count === "function" ? e.count() : ""].join("|") : "");

  function runKit(key, script, state) {
    const Onboard = OB();
    const cur = () => (live === state ? target(Cook.expect) : null);
    // the spotlight: the thing to do next (the whole picture for a chop swipe: the vegetables fly)
    const spot = () => {
      const t = cur();
      if (!t) return null;
      if (Cook.expect && Cook.expect.kind === "slice") {
        const c = document.querySelector("#game canvas");
        return c || null;
      }
      // the S14 roll-out (contract-53, the rulebook's light: "one lit box", chai's hugs its thing): the box is the thing's own picture
      // on screen with the one light rule's margin (SH-230, Onboard.litBox; the picture the step names, thingOf), never a circle round the point (it was 4-6 times a
      // heap or a bottle in samosa, the pantry, daar and the grill); the circle only where the step names no picture
      const box = Cook.expect && Cook.expect.x != null && Cook.UI.s14 && Cook.UI.s14() ? hugOf(thingOf(Cook.expect)) : null;
      if (!box) return rectAround(t, t.r);
      // (the box always takes in the point the step is tapped at: a thing whose tap point sits at its foot, the pantry's carton, was
      // outside its own picture's box, so the dim took the tap at the bigger sizes)
      const x0 = Math.min(box[0], t.x - 14);
      const y0 = Math.min(box[1], t.y - 14);
      return [x0, y0, Math.max(box[0] + box[2], t.x + 14) - x0, Math.max(box[1] + box[3], t.y + 14) - y0];
    };
    const steps = script.map((st, i) => ({
      spotlight: spot,
      ghost: {
        // the script's move (data.onboard: tap, swipe, stir, roll, hold)
        gesture: GESTURE[st.do] || "tap",
        from: () => {
          const t = cur();
          if (!t) return null;
          if (t.a) return rectAround(t.a, 8);
          if (t.move === "roll") return rectAround({ x: t.x, y: t.y - t.rr * 0.6 }, 8);
          return rectAround(t, Math.max(8, t.move === "stir" ? t.rr : 8));
        },
        to: () => {
          const t = cur();
          if (!t) return null;
          if (t.b) return rectAround(t.b, 8);
          if (t.move === "roll") return rectAround({ x: t.x, y: t.y + t.rr * 0.6 }, 8);
          return rectAround(t, 8);
        },
      },
      wait: "cook-next",
      note: st.what || "",
      i,
    }));
    state.kit = true;
    // SH-119 (Zafar, 22 Oct: one finger in every game): the kit's own finger, in its own cadence (no picture hand, no 6 s gap)
    // (the hand from above: a shelf thing's word chip sits under it, never under the hand; the judge, 23 Oct)
    Onboard.run(obId(key), steps, { fingerDown: true }).then(() => {
      if (live !== state) return;
      C.stop(true);
      pointCard(key);
    });
  }
  /*
   * The S14 roll-out (CHAI-37, CHAI-42; the rulebook's showing: "when the showing stops, point once at where to look next (the order
   * card, 1.2 s)"; chai's js/cook/stations/chai-tray.js is the reference): once a station's first-time showing ends, the order card
   * is lit once, after a quiet spell (nothing moving that will end: a tween in the kitchen but the people's idling, glows and
   * effects; an animation on the page but the bubbles and the help's own; the order row's glide, running or about to start) of the
   * central rules' pointAfterMoveMs, for pointMs. Skipped once the child has moved on (Cook.acted: a tap or a gesture), and a move
   * while it is lit ends it.
   */
  const pointed = new Set();
  function pointCard(key) {
    const Onboard = OB();
    const R = global.Rules;
    if (!Onboard || !Onboard.light || !R || !R.pointMs || !(Cook.UI.s14 && Cook.UI.s14()) || pointed.has(key)) return;
    pointed.add(key);
    const sp = Cook.speed || 1;
    const m0 = Cook.acted || 0;
    // (moved on: a tap or a gesture, the station over, or a pop-up waiting for its own tap, Nani's pass-me or the order's: never lit
    // over it, and its light goes if one comes)
    const moved = () => (Cook.acted || 0) !== m0 || !Cook.inStation || !!(Cook.expect && Cook.expect.kind === "click") || !!document.querySelector("#passme:not(.hidden), .njg-rq-open");
    // (STD-D1-06: the kit's one stillness look, with a station's own moves: C.mover below)
    const moving = C.mover({ walk: true, pend: false });
    let quiet = null;
    let tries = 0;
    const go = () => {
      if (moved() || ++tries > 500) return;
      if (!moving()) {
        if (quiet == null) quiet = Date.now();
      } else quiet = null;
      if (quiet == null || Date.now() - quiet < R.pointAfterMoveMs() / sp) return void setTimeout(go, 60);
      const el = document.querySelector("#mission .oc-card");
      if (!el) return;
      const h = Onboard.light(el, { look: "", pad: 4, pass: true });
      try {
        if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("rung", { step: `${obId(key)}:s14-card`, rung: 0, coach: true });
      } catch (e) {
        /* only a log */
      }
      let q = 0;
      let t = 0;
      const end = () => {
        clearInterval(q);
        clearTimeout(t);
        h.close();
      };
      q = setInterval(() => (moved() || moving()) && end(), 60);
      t = setTimeout(end, R.pointMs() / sp);
    };
    go();
  }

  /* ---------------- the lights kit (Sprint 18, module map pieces 13-14: Cook's wiring of js/shared/onboard.js) ---------------- */
  /*
   * What every kitchen game calls for its lights and lessons (no game is named here, STD-F1-02; a game passes its own things, its
   * own state as functions and its own key):
   *   C.mover(o) -> moving()          is anything on the stage still moving that will end? (STD-D1-06)
   *   C.settled(o) -> Promise<bool>   a quiet spell of the rules' pointAfterMoveMs (true), or gave up (false)
   *   C.firsts(key, o) -> gate         the first-time gate for this game (Onboard.firsts on Cook's save; STD-D1-01)
   *   C.control(o) -> handle           a control's call with its light, or the call alone and the light after the wait (STD-D1-06,
   *                                    STD-D2-01, STD-D2-04)
   *   C.wrong(by)                      a wrong move: every waiting hint comes at once (STD-D2-04; Onboard.rush)
   *   C.nextLight(o) -> handle         the next vessel's first-time light (STD-D1-10)
   *   C.cardLight(o) -> Promise<bool>  the next item's card lit for a moment after the first items (STD-D1-07)
   *   C.lessons(o) -> Promise          the reveal lessons, the dotted word then the blurred picture (STD-D1-08; Onboard.lesson)
   *   C.rungs(key, step, o)            the stuck rungs (above), with o.word: no hint says a word past support (STD-D2-05)
   * The lab: lab/sections/kit-lights.html.
   */
  const note = (what, info) => {
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note(what, info);
    } catch (e) {
      /* only a log */
    }
  };
  const speed = () => Cook.speed || 1;
  const rules = () => global.Rules || (global.Tokens && global.Tokens.rules) || null;
  const FX = /^fx-|steam|spark|boil|bubble|glow|halo|shadow/i;
  /**
   * STD-D1-06 (Zafar, 29 Oct: "start its timer after the last animation action"): is anything still moving that will end? The order
   * row's glide (running, or about to start after a redraw: _auto, _pend14 unless o.pend is false), Nani's box folding (o.helper),
   * a kitchen tween that ends (the people's idling, glows and effects left out), with o.walk a picture a game moved or faded by its
   * own code (any that moved since the last look; a tool in the hand left out), a page animation that ends (Onboard.pageMoving),
   * and the game's own moves (o.busy()). As the sandbox's contract-79 sees it. -> a function (it remembers the last look)
   */
  C.mover = function (o = {}) {
    let rowX = null;
    const seenAt = new WeakMap();
    return () => {
      if (o.busy && o.busy()) return true;
      const rows = [...document.querySelectorAll("#mission .oc-row14")];
      const xs = rows.map((r) => Math.round(r.scrollLeft)).join(",");
      const was = rowX;
      rowX = xs;
      if ((was != null && xs !== was) || rows.some((r) => r._auto || (o.pend !== false && r._pend14))) return true;
      // (Nani's box folding or unfolding moves the order list: SH-215, contract-79)
      if (o.helper && Cook.UI && Cook.UI.helperMovingUntil && Date.now() < Cook.UI.helperMovingUntil) return true;
      const S = Cook.scene;
      const chars = new Set(Object.values((S && S.chars) || {}));
      try {
        if (S && S.tweens && S.tweens.getTweens().some((tw) => tw.isPlaying() && !tw.isInfinite && (tw.targets || []).some((t) => t && t.visible !== false && !chars.has(t) && !t.glowFx && !FX.test(((t.texture && t.texture.key) || "") + (t.name || ""))))) return true;
      } catch (e) {
        /* no tween list: the rest still counts */
      }
      if (o.walk) {
        // (a disc a game fades in as it is stirred, pieces turning with a ladle: any picture that moved or faded since the last look)
        let stirred = false;
        const walk = (list) =>
          (list || []).forEach((t) => {
            if (!t || stirred) return;
            if (t.list) walk(t.list);
            if (t.type === "Graphics" || t.visible === false || chars.has(t) || t.glowFx) return;
            if (/^fx-|steam|spark|boil|bubble|glow|halo|shadow|spoon|ladle|hand/i.test(((t.texture && t.texture.key) || "") + (t.name || ""))) return;
            const now = { x: t.x, y: t.y, a: t.alpha };
            const w = seenAt.get(t);
            seenAt.set(t, now);
            if (w && (Math.abs(now.x - w.x) > 0.6 || Math.abs(now.y - w.y) > 0.6 || (Math.abs(now.a - w.a) > 0.03 && now.a > 0.02 && now.a < 0.98))) stirred = true;
          });
        try {
          walk(S && S.children && S.children.list);
        } catch (e) {
          /* no scene: the rest still counts */
        }
        if (stirred) return true;
      }
      const OBk = OB();
      return !!(OBk && OBk.pageMoving && OBk.pageMoving());
    };
  };
  /**
   * A quiet spell: nothing moving (C.mover(o), sampled every 60 ms) for the central rules' pointAfterMoveMs at the game's speed
   * (o.needMs), capped at o.maxMs (Onboard.WAIT.settle). -> Promise<true> still, <false> gave up (the cap, or o.quitIf()).
   */
  C.settled = function (o = {}) {
    const moving = o.moving || C.mover(o);
    const R = rules();
    const need = o.needMs != null ? o.needMs : (R && R.pointAfterMoveMs ? R.pointAfterMoveMs() : 500) / speed();
    const max = o.maxMs != null ? o.maxMs : (OB() && OB().WAIT ? OB().WAIT.settle : 6000);
    return new Promise((res) => {
      const t0 = Date.now();
      let quiet = null;
      const tick = () => {
        if (o.quitIf && o.quitIf()) return res(false);
        if (!moving()) quiet = quiet == null ? Date.now() : quiet;
        else quiet = null;
        if (quiet != null && Date.now() - quiet >= need) return res(true);
        if (Date.now() - t0 > max) return res(false);
        setTimeout(tick, 60);
      };
      tick();
    });
  };
  /**
   * The first-time gate for game `key` (STD-D1-01), on Cook's save (save.seenStation): fresh while the s14 look is on and this is the
   * grown-ups' New player or the game's coach not yet seen (save.coached), as the game starts (made once per round). o.round: a Set
   * the game makes each round (a lesson every game shares is once a round for the New player). -> Onboard.firsts's gate
   */
  C.firsts = function (key, o = {}) {
    const Onboard = OB();
    const s14 = !!(Cook.UI && Cook.UI.s14 && Cook.UI.s14());
    const seen = (Cook.save.seenStation = Cook.save.seenStation || {});
    const fresh = s14 && (newPlayer() || !(Cook.save.coached || {})[key]);
    if (!Onboard || !Onboard.firsts) return { scope: key, fresh: false, key: () => "", spent: () => false, due: () => false, spend() {}, first: () => false };
    return Onboard.firsts(key, { seen, fresh, round: o.round || null, newPlayer: newPlayer() });
  };
  /**
   * The one page box (Sprint 18 wave 3: samosa's, baking's, eggs', corn's and chai's own copies went): a canvas thing's box on the
   * page as the lights ask for it, a function read each frame -> [x, y, w, h] in page px, or null once the thing is gone.
   *   pad: world px out from its picture; o.bounds(thing): its own world box {x, y, right, bottom} in place of the picture's (a
   *   plate's body with its face, a strip's pastry without its canvas); o.visible: null while the thing is hidden too (chai's
   *   glow ring is lit hidden, so the default looks only at whether it is still there).
   */
  C.box = (thing, pad = 0, o = {}) => () => {
    const UI = Cook.UI;
    if (!thing || !thing.active || (o.visible && !thing.visible) || !UI || !UI.worldToScreen) return null;
    const b = o.bounds ? o.bounds(thing) : thing.getBounds();
    if (!b) return null;
    const a = UI.worldToScreen(b.x - pad, b.y - pad);
    const z = UI.worldToScreen(b.right + pad, b.bottom + pad);
    return [a.x, a.y, z.x - a.x, z.y - a.y];
  };
  /** STD-D2-04: a wrong move (any game): every hint waiting on its clock comes at once (Onboard.rush). */
  C.wrong = (by) => {
    const Onboard = OB();
    if (Onboard && Onboard.rush) Onboard.rush(by || "wrong");
  };
  /**
   * The call with its light (STD-D1-06; Zafar, 29 Oct: "it was voice, pause, dim, pause, gold outline": a control's call and its light
   * come together) for one step on a control (a knob, a glass to pour, the next vessel to pick):
   *   the first time (o.first): Nani's call is held (UI.holdCalls) until the light is on the screen, then let go two frames and a beat
   *     later (contract-78); a breath first (o.pauseMs: after the last thing went in, the stage still for that long, never more than
   *     Onboard.WAIT.breathMax in all: CHAI-52);
   *   after that: the call alone (SH-181, CHAI-56), and the same light as the stuck hint after the level's wait (o.hintMs(): the central
   *     rules' hintS) from the later of the step's opening and the last action (SH-184), at once after a wrong move (C.wrong, or
   *     handle.rush: STD-D2-04); o.noHint: no stuck light (a timed control's green is called as it opens, decision 5e).
   * o: {target (the control's page box: a function), also (another live thing under the light), round (a circle), first, pauseMs,
   *   hintMs(), current() (still this step), busy() (the game's moves in flight hold the hint), still() (the stage still; default no
   *   finite kitchen tween), onLight(on, rung) (the game's own glow on the thing), onHint() (the hint came: count it, say the call
   *   again), key (the game's key: the light's log step "<key>:s14-control"), note}.
   * -> handle {close(), rush(), lit() (the light up now, or null)}
   */
  C.control = function (o = {}) {
    const Onboard = OB();
    if (!Onboard || !Onboard.light || !o.target) return null;
    const UI = Cook.UI || {};
    const W = Onboard.WAIT || { breathMax: 3000 };
    const step = o.note != null ? String(o.note) : `${o.key || "kit"}:s14-control`;
    const h = { over: false };
    let lit = null;
    let release = null;
    let timer = 0;
    let rushed = false;
    let offRush = null;
    const cur = () => !h.over && (!o.current || o.current());
    // (a wrong move any time in the step, its breath included, brings the stuck light at once)
    offRush = Onboard.onRush ? Onboard.onRush(() => h.rush()) : null;
    const pauseMs = o.pauseMs || 0;
    if ((pauseMs || o.first) && UI.holdCalls) UI.holdCalls(new Promise((r) => (release = r)));
    const let_go = () => {
      const r = release;
      release = null;
      if (r) r();
    };
    const still =
      o.still ||
      (() => {
        try {
          const S = Cook.scene;
          return !(S && S.tweens && S.tweens.getTweens().some((tw) => tw.isPlaying() && !tw.isInfinite));
        } catch (e) {
          return true;
        }
      });
    const light = (rung) => {
      if (lit) lit.close();
      lit = Onboard.light(o.target, { look: "glow", pad: o.round ? 2 : 4, round: !!o.round, pass: true, live: [o.target].concat(o.also ? [o.also] : []) });
      note("rung", { step, rung, coach: rung === 0 });
      if (o.onLight) o.onLight(true, rung);
    };
    h.lit = () => lit;
    h.rush = () => {
      rushed = true;
    };
    h.close = () => {
      if (h.over) return;
      h.over = true;
      clearTimeout(timer);
      if (offRush) offRush();
      if (lit) lit.close();
      lit = null;
      let_go();
    };
    let quiet = null;
    const t0 = Date.now();
    const go = () => {
      if (!cur()) return let_go();
      if (still()) quiet = quiet == null ? Date.now() : quiet;
      else quiet = null;
      if (pauseMs && (quiet == null || Date.now() - quiet < pauseMs / speed()) && Date.now() - t0 < W.breathMax / speed()) return void (timer = setTimeout(go, 60));
      if (!o.first) {
        let_go();
        if (o.noHint) return;
        const opened = Date.now();
        const NG = global.NaniGuide;
        const due = () => Onboard.hintDue(opened, NG && NG.lastAction ? NG.lastAction() : opened, (o.hintMs ? o.hintMs() : 0) / speed(), rushed);
        const wait = () => {
          if (!cur()) return;
          if ((o.busy && o.busy()) || Date.now() < due()) return void (timer = setTimeout(wait, 200));
          rushed = false;
          light(1);
          if (o.onHint) o.onHint();
        };
        timer = setTimeout(wait, 200);
        return;
      }
      light(0);
      // (the call once the light's layer is showing: two frames for it to be drawn, then a beat of its fade-in)
      if (release) {
        const raf = global.requestAnimationFrame ? requestAnimationFrame : (f) => setTimeout(f, 16);
        raf(() => raf(() => (timer = setTimeout(let_go, 90))));
      }
    };
    go();
    return h;
  };
  /**
   * The next vessel (STD-D1-10; Zafar, 2 Nov: "we need an onboarding for selecting the new pan"): the first time a next one is needed,
   * a light circles its rim once the last one is served, never while another still cooks. C.nextLight(o) waits o.delayMs (at the game's
   * speed; Onboard.WAIT.nextVessel, CHAI-99), or none with o.now (a wrong move: a thing tapped into a served vessel), then asks o.ok()
   * (the game's state still right, and its first-time gate: gate.first("next-pan")) and lights o.target round (pad 2) for o.litMs
   * (WAIT.nextLit) until o.quitIf() (picked). o.who: its log name ("next-pan" note). -> {cancel() (the wait), stop() (the light too)}
   */
  C.nextLight = function (o = {}) {
    const Onboard = OB();
    const W = (Onboard && Onboard.WAIT) || { nextVessel: 800, nextLit: 5000 };
    let t = 0;
    let lit = null;
    const fire = () => {
      if (!Onboard || !Onboard.light || !o.target) return;
      if (o.ok && !o.ok()) return;
      lit = Onboard.light(o.target, { look: "glow", pad: o.pad != null ? o.pad : 2, round: o.round !== false, pass: true, ms: (o.litMs != null ? o.litMs : W.nextLit) / speed(), quitIf: o.quitIf, note: o.note });
      note("next-pan", { step: o.who != null ? String(o.who) : "", by: "light" });
    };
    if (o.now) fire();
    else t = setTimeout(fire, (o.delayMs != null ? o.delayMs : W.nextVessel) / speed());
    return {
      cancel: () => clearTimeout(t),
      stop() {
        clearTimeout(t);
        if (lit) lit.close();
      },
      lit: () => lit,
    };
  };
  /**
   * The next item's card on the order card (STD-D1-07; Zafar, 27 Oct: "so the eye is directed to where to look next"): after the
   * first items, its card in the order row is glided whole into view, then, once the kitchen is still (C.mover with the row and Nani's
   * box: the rules' pointAfterMoveMs at the game's speed, up to Onboard.WAIT.still: CHAI-77), lit for the rules' pointMs (no glow, no
   * bounce), following the card as the order card is drawn again (SH-178); the whole order card when the item has no card in the row
   * (or one cut at the row's edge); a face circle overhanging it taken into its box (contract-82).
   * o: {item() (the next item's card in the row: C.itemCard), quitIf() (moved on or the step changed: it gives up), busy() (the game's
   * moves in flight), endIf() (while lit: default busy() or quitIf()), step (its log name), note, onLit()}.
   * -> Promise<true> lit, <false> gave up
   */
  C.itemCard = function (id, who) {
    if (!id) return null;
    const card = who != null ? [...document.querySelectorAll("#mission .oc-card")].find((x) => x.dataset.who === who) : null;
    const inCard = (x) => !card || card.contains(x);
    return [...document.querySelectorAll("#mission .oc-row.oc-it14")].find((x) => (x.dataset.word === id || (x.querySelector(".wc14") || {}).dataset?.word === id) && inCard(x) && x.getBoundingClientRect().width > 0) || null;
  };
  C.cardLight = function (o = {}) {
    const Onboard = OB();
    const R = rules();
    const UI = Cook.UI || {};
    const itemOf = () => (o.item ? o.item() : null);
    const whole = (item) => {
      const row = item && item.closest(".oc-row14");
      if (!item || !row) return false;
      const a = item.getBoundingClientRect();
      const b = row.getBoundingClientRect();
      return a.left >= b.left - 1 && a.right <= b.right + 1;
    };
    const it0 = itemOf();
    if (it0 && !whole(it0) && global.OrderCard && global.OrderCard.glideTo) global.OrderCard.glideTo(it0);
    const lightOf = () => {
      const item = itemOf();
      const seen = whole(item);
      const card = seen ? item : document.querySelector("#mission .oc-card");
      if (!card) return null;
      if (UI.cardIntoView) UI.cardIntoView(seen ? card.closest(".oc-card") : card); // (its headline first: never cut at its top)
      const cb = card.getBoundingClientRect();
      const cut = [...document.querySelectorAll(".njg-face, .cv-face, .oc-face, .face-say")].filter((f) => {
        const b = f.getBoundingClientRect();
        if (!b.width) return false;
        const meets = b.right > cb.left && b.left < cb.right && b.bottom > cb.top + 1 && b.top < cb.bottom - 1;
        const inside = b.left >= cb.left - 4 && b.right <= cb.right + 4 && b.top >= cb.top - 4 && b.bottom <= cb.bottom + 4;
        return meets && !inside;
      });
      return cut.length ? [card].concat(cut) : card;
    };
    const side = C.mover({ helper: true });
    const busy = () => !!(o.busy && o.busy());
    const endIf = o.endIf || (() => busy() || !!(o.quitIf && o.quitIf()));
    const until = Date.now() + ((Onboard && Onboard.WAIT && Onboard.WAIT.still) || 8000);
    return new Promise((res) => {
      if (!Onboard || !Onboard.light) return res(false);
      let quiet = null;
      const go = () => {
        if ((o.quitIf && o.quitIf()) || Date.now() > until) return res(false);
        const still = !busy();
        if (!side() && still) quiet = quiet == null ? Date.now() : quiet;
        else quiet = null;
        if (quiet == null || Date.now() - quiet < (R ? R.pointAfterMoveMs() : 0) / speed()) return void setTimeout(go, 60);
        if (o.onLit) o.onLit();
        note("card-light", { step: o.step != null ? String(o.step) : "" });
        const first = lightOf();
        // (once lit it stays on what it lit: the item's card as the order card is drawn again, never jumping to the whole card)
        const onItem = first && first.classList && first.classList.contains("oc-row");
        const lit = Array.isArray(first) || !first ? first : () => (onItem ? itemOf() || first : document.querySelector("#mission .oc-card") || first);
        const h = Onboard.light(lit, { look: "", pad: 4, pass: true, ms: (R ? R.pointMs() : 0) / speed(), quitIf: endIf, note: o.note });
        h.done.then(() => res(true));
      };
      go();
    });
  };
  /**
   * The reveal lessons in their order (STD-D1-08, SH-196: the dotted word, then the blurred picture, each once per player in every
   * game; for the New player once a round; CHAI-102): each only if due on the gate (o.gate: C.firsts(key, {round})) and on the order
   * card at all; waits for the order to have landed first (Cook.Stations.orderLanded(o.ctx)); each lights through Onboard.lesson,
   * spent only once its box is drawn; the picture's only after the word's was ever shown. Cook's expect is "wait" while one runs (the
   * tester waits). Logged: "order-landed", "reveal-lesson" (shown <why> | none-in-view <why...>). -> Promise<{word, pic}>
   */
  C.lessons = async function (o = {}) {
    const Onboard = OB();
    const gate = o.gate;
    const out = { word: false, pic: false };
    if (!Onboard || !Onboard.lesson || !gate) return out;
    const L = Onboard.LESSON;
    const wordSel = o.wordSel || L.word;
    const picSel = o.picSel || L.pic;
    const St = Cook.Stations || {};
    if ((gate.due("reveal-word", true) || gate.due("reveal-pic", true)) && St.orderLanded) {
      const ms = await St.orderLanded(o.ctx);
      note("order-landed", { step: "reveal", by: `${ms}ms` });
    }
    const why = (x) => Onboard.lessonWhy(x);
    const mover = C.mover({ busy: o.busy });
    const prev = { e: null };
    const wait14 = { kind: "wait", dots: true };
    const lo = {
      speed: speed(),
      wait: (ms) => Cook.wait(ms),
      moving: mover,
      settle: () => C.settled({ moving: mover }),
      intoView: (card) => Cook.UI && Cook.UI.cardIntoView && Cook.UI.cardIntoView(card),
      sound: () => (Cook.sfx && Cook.sfx.reveal ? Cook.sfx.reveal() : Cook.sfx && Cook.sfx.click ? Cook.sfx.click() : null),
      hold(on) {
        if (on) {
          prev.e = Cook.expect;
          Cook.expect = wait14;
        } else if (Cook.expect === wait14) Cook.expect = prev.e || null;
      },
      note: `${gate.scope}:s14-light`,
    };
    const run = async (kind, sel, k) => {
      const ok = await Onboard.lesson(kind, sel, Object.assign({}, lo, { onLit: (x) => (gate.spend(k, true), note("reveal-lesson", { step: kind, by: `shown ${why(x)}` })) }));
      if (!ok) note("reveal-lesson", { step: kind, by: `none-in-view ${[...document.querySelectorAll(sel)].map(why).join(" ") || "-"}` });
      return ok;
    };
    if (document.querySelectorAll(wordSel).length > 0 && gate.due("reveal-word", true)) out.word = await run("word", wordSel, "reveal-word");
    // (the image after the word: a picture blurred before any word was dotted waits for the word's lesson first)
    if (document.querySelectorAll(picSel).length > 0 && gate.spent("reveal-word", true) && gate.due("reveal-pic", true)) out.pic = await run("pic", picSel, "reveal-pic");
    return out;
  };

  /*
   * Sprint 11 (docs/game-design/easy-to-play.md principles 2-3; B-cook), Sprint 12 (EASY-03, CHAI-32: no item moves by
   * itself): a station whose script's steps name a "step" (data.onboard["chai-tray"]) is helped on the REAL item, step by
   * step, by the shared kit's hint rungs (js/shared/onboard.js Onboard.stuck): the first time a step appears, the spotlight on
   * its item at once (the box, the item glowing, the finger); stuck, the station's own ladder (C.rungs's o.at, o.glowAt). The
   * station says where its live control is (C.rungs). C.start leaves such a station to it (no overlay).
   */
  C.itemDemo = (key) => {
    const s = C.script(key);
    return !!(s && s.every((st) => st.step));
  };
  /** The step's script entry (data.onboard[key] whose step is `step`), or null. */
  C.stepOf = (key, step) => (C.script(key) || []).find((st) => st.step === step) || null;
  /**
   * The rungs for one step of station `key` (Onboard.stuck): o {target (the live control: a page rect or a function giving
   * one), live, light, at, glowAt, glow(on), line, first}. The first time per profile (and not once the station's coach was
   * seen, Cook.save.coached; a New player: every visit) the spotlight comes up as the step opens. o.word, o.answer, o.study: no
   * hint for an asked-for word past support (STD-D2-05). -> handle {done(), stop(), rush()} (a wrong move: C.wrong), or null
   */
  C.rungs = function (key, step, o = {}) {
    const Onboard = OB();
    if (!Onboard || !Onboard.stuck || !C.stepOf(key, step)) return null;
    // STD-D2-05 (the leak test, non-negotiable 4): a step whose thing is the answer (o.answer: what a person asked for, o.word its
    // id) gets no hint once the word is past support, unless it is study (o.study: Nani helps, a redo)
    if (o.word != null && Onboard.hintHides && Onboard.hintHides({ answer: !!o.answer, stage: Cook.wordStage ? Cook.wordStage(o.word) : null, study: !!o.study })) return null;
    const first = newPlayer() || !(Cook.save.coached || {})[key];
    // (o.name: the step's name in the play log and the step log, e.g. Nani's stepper's own id for that step)
    return Onboard.stuck(o.name != null ? String(o.name) : `${key}:${step}`, Object.assign({ id: `${obId(key)}/${step}`, first }, o));
  };

  /*
   * EASY-08 (the judge, 23 Oct: "the flour jar never moves and has no glow"): in the box the thing itself glows and hops, as chai's
   * bottle does: the station's own glow (S.glow, with its hop: Onboard.HOP), at once, on the picture the step names (its wordId,
   * the nearest to where the step points); off when the step moves on or the coach ends.
   */
  function thingOf(e) {
    const S = Cook.scene;
    if (!S || !S.children || !e) return null;
    let best = null;
    let bd = Infinity;
    // (or, for a step not named by a word, maani's "dough", the smallest tappable picture under where it points)
    let hit = null;
    let ha = 360000;
    const look = (list) =>
      (list || []).forEach((o) => {
        if (!o || !o.active) return;
        if (e.x != null && !best && o.texture && o.input && o.input.enabled && o.visible !== false && o.getBounds) {
          const b = o.getBounds();
          const a = b.width * b.height;
          if (a > 0 && a < ha && b.contains(e.x, e.y)) [ha, hit] = [a, o];
        }
        if (e.key && o.wordId === e.key && o.visible !== false && o.getBounds) {
          const b = o.getBounds();
          const d = e.x == null ? 0 : Math.hypot(b.centerX - e.x, b.centerY - e.y);
          if (d < bd) [bd, best] = [d, o];
        }
        if (o.list) look(o.list);
      });
    look(S.children.list);
    return best || hit;
  }
  /**
   * A picture's box on screen, [x, y, w, h] in page px (null: none, or too small to be the thing). SH-230 (Zafar, 6 Nov night: "a
   * general rule that works in all cases that leaves some padding around the object"): the picture as drawn with no margin of its
   * own: the light adds the one rule's (Onboard.litBox; was 8% here, 4-10 px, and the light's 10 px more on top).
   */
  function hugOf(obj) {
    const r = obj && obj.getBounds ? C.box(obj)() : null;
    return r && r[2] > 8 && r[3] > 8 ? r : null;
  }
  function lightThing(state, obj) {
    if (state.lit === obj) return;
    const S = Cook.scene;
    if (state.lit && S && S.glow) S.glow(state.lit, false);
    state.lit = obj;
    if (!obj || !S || !S.glow) return;
    // (logged as one of the kit's rungs: this glow is the first-time help's, on its own clock, not Nani's early: contract-24)
    try {
      if (global.Lifecycle && global.Lifecycle.note) global.Lifecycle.note("rung", { step: `${obId(state.key)}`, rung: 0, coach: true });
    } catch (e) {
      /* only a log */
    }
    S.glow(obj, true, { bounce: true, now: true });
  }

  /**
   * Coach station `key` (once ever): spotlight each next thing to do, as its
   * script says (data.onboard), until C.stop() (the station ends).
   */
  C.start = function (key, { force = false } = {}) {
    C.stop();
    if (C.itemDemo(key)) return; // (the station runs its own: the real item shows each step, C.rungs)
    if (!force && C.seen(key)) return;
    const script = C.script(key);
    const useKit = !!(OB() && script);
    const box = $("#coach");
    if (!useKit && !box) return;
    const steps = useKit ? script.length : calm().coachSteps || 4;
    const state = { key, shown: 0, last: null, timer: null, started: false, lost: 0 };
    live = state;
    const tick = () => {
      if (live !== state) return;
      const e = Cook.expect;
      // Nani's "pass me", a panel, the request card or the end-of-round screen: step back
      const busy = Cook.interrupting || !$("#passme").classList.contains("hidden") || (Cook.UI.panelOpen && Cook.UI.panelOpen()) || (e && e.intro) || !!document.querySelector(".njg-results");
      const t = busy ? null : target(e);
      const s = t ? sig(e) : "";
      if (useKit) {
        if (!state.started) {
          // start once there's a first thing to point at
          if (t) {
            state.started = true;
            state.last = s;
            runKit(key, script, state);
          }
          return;
        }
        if (!t) {
          lightThing(state, null);
          // nothing to point at for a moment: the overlay steps back (it never traps a child)
          if ((state.lost += 120) > 2500) C.stop(true);
          return;
        }
        state.lost = 0;
        if (s !== state.last) {
          state.last = s;
          OB().signal("cook-next");
        }
        lightThing(state, OB().active() ? thingOf(e) : null);
        return;
      }
      if (t && s !== state.last) {
        // a new thing to do: the next spotlight (the child did the last one)
        if (state.last) state.shown++;
        state.last = s;
        if (state.shown >= steps) return C.stop(true);
      }
      draw(t);
    };
    state.timer = setInterval(tick, 120);
    tick();
  };
  /** The station ended (or the coaching is used up): the overlay goes, and this station counts as seen. */
  C.stop = function (done = true) {
    if (!live) return;
    const state = live;
    clearInterval(state.timer);
    live = null;
    if (done) {
      Cook.save.coached = Cook.save.coached || {};
      Cook.save.coached[state.key] = true;
    }
    const a = OB() && OB().active();
    if (state.kit && a && a.id === obId(state.key)) a.skip();
    lightThing(state, null);
    draw(null);
  };

  /** C4: Cook is unmounted mid-coach: the overlay goes and its listeners with it, and the station is not marked seen. */
  C.leave = function () {
    if (!live) return;
    const state = live;
    clearInterval(state.timer);
    live = null;
    const a = OB() && OB().active();
    if (state.kit && a && a.id === obId(state.key)) (a.leave || a.skip)();
    lightThing(state, null);
    draw(null);
  };

  /* ---------------- the Wave 6 fallback overlay (no shared kit) ---------------- */
  function draw(t) {
    const box = $("#coach");
    if (!box) return;
    if (!t) {
      box.classList.add("hidden");
      return;
    }
    box.classList.remove("hidden");
    const hole = box.querySelector(".co-hole");
    hole.style.left = `${t.x - t.r}px`;
    hole.style.top = `${t.y - t.r}px`;
    hole.style.width = hole.style.height = `${t.r * 2}px`;
    // (S13-A2: its own finger went: one finger in every game, the kit's .ob-finger, SH-119)
  }
})(window);
