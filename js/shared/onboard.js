/*
 * The onboarding kit (docs/design-language/ux-principles.md s8 and s10; docs/architecture/shared-api.md
 * s9): onboarding by showing, not telling. One look in every game (Sprint 12; Zafar, 22 Oct: EASY-08, SH-118, SH-119):
 * everything dims (Onboard.DIM) except ONE rounded box with a plain gold edge round the thing to do (or round a group given
 * together), the thing itself glows and bounces, and the kit's one finger taps it in one cadence (tap, lift off, half a
 * second, again) until the child does it. No item ever moves to its target by itself (EASY-03). No text: an optional audio
 * hook per step.
 *
 * A station's script is a list of steps:
 *   [{spotlight: "#pan", ghost: {from: "#jug", to: "#pan", gesture: "drag"}, wait: "pour-done"},
 *    {spotlight: ["#jug", "#pan"], ghost: {gesture: "tap"}},        // no wait: a tap in the light
 *    {spotlight: "#done", ghost: {gesture: "hold"}, wait: "done", audio: "assets/audio/...mp3"}]
 *
 *   spotlight  what stays lit: a selector, an element, [x, y, w, h] in
 *              page pixels (a canvas game), a function returning any of
 *              these, or a list of them (one box round all). Touches elsewhere are blocked.
 *   ghost      {gesture, from?, to?, ms?}: "tap" (the finger, tapping until the step is done), "drag" (from -> to),
 *              "hold", "swipe" (from -> to, or rightwards), "circle-stir"
 *              (round the from/spotlight). from defaults to the spotlight.
 *   wait       the signal name that finishes the step: the mode calls
 *              Onboard.signal("pour-done") when the child has done it.
 *              Default "tap": any tap inside the light.
 *   audio      a URL or a function(step, i), played as the step starts.
 *   idleMs     0: a gesture is shown once; else it plays again after the finger's half-second wait (SH-119).
 *
 *   await Onboard.run(stationId, script, {force, audio, idleMs, container, light})
 *     -> "done" | "skipped" | "seen"   ("seen": this profile already had it; nothing shown)
 *   Onboard.signal(name)        the child did the thing
 *   Onboard.spot(target, o) / Onboard.stuck(step, o) / Onboard.demo(item, path, o)   the stuck help (below)
 *   Onboard.finger(at, o)       the one finger alone (a game's own help, the conversations): -> {el, stop()}
 *   Onboard.newPlayer()         the grown-ups' New player is on (SH-120: first-time help at once, every visit)
 *   Onboard.fadeIn(el, key?)    UI that appears when first needed: fades in (with a
 *                               soft glow) the first time, instantly after that
 *   Onboard.await(el, key?)     hide it until fadeIn (instantly visible if already seen)
 *   Onboard.seen(stationId) / Onboard.reset(stationId?)
 *   Onboard.machine(script)     the pure state machine under run() (Node tests); Onboard.groupBox, fingerKeys (pure)
 *
 * A grown-up can skip the whole script from the mode's ? menu (G7 / CQ15, 29 Sept:
 * the corner button read as "next chapter"): Onboard.skipButton(parent) draws the
 * hold-to-skip row there (held for a second; a quick tap does nothing), shown only
 * while a script runs; or Escape. Anything marked [data-ob-pass] (the ? button and
 * its menu) stays usable under the dimming. opts.skipButton: the old corner button.
 * Once per profile per station, through js/shared/uistore.js. Styles: css/shared/onboard.css.
 *
 * Plain <script>: window.Onboard (and Shared.onboard); Node: require().
 */
(function (root, factory) {
  const Onboard = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Onboard;
  else {
    root.Onboard = Onboard;
    (root.Shared = root.Shared || {}).onboard = Onboard;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const Onboard = {};
  // ("roll": the pressed finger up and down along from -> to and back, the rolling pin under it: MAA-20, s19-lights)
  const GESTURES = ["tap", "drag", "hold", "swipe", "circle-stir", "roll"];
  Onboard.GESTURES = GESTURES;
  const store = () => root.UIStore || (typeof require === "function" ? require("./uistore.js") : null);

  /* ---------------- pure ---------------- */

  /** A step with its defaults filled in. */
  Onboard.normalize = function (step) {
    const s = Object.assign({}, step);
    if (s.ghost && typeof s.ghost === "string") s.ghost = { gesture: s.ghost };
    if (s.ghost) {
      s.ghost = Object.assign({ gesture: "tap" }, s.ghost);
      if (!GESTURES.includes(s.ghost.gesture)) throw new Error(`onboard: unknown gesture "${s.ghost.gesture}"`);
    }
    s.wait = s.wait || "tap";
    return s;
  };
  /** Problems with a script (empty = fine): every step lights something and knows what it waits for. */
  Onboard.validate = function (script) {
    const out = [];
    if (!Array.isArray(script) || !script.length) return ["a script is a non-empty list of steps"];
    script.forEach((st, i) => {
      if (!st || !st.spotlight) out.push(`step ${i}: no spotlight`);
      try {
        const n = Onboard.normalize(st || {});
        if (n.ghost && (n.ghost.gesture === "drag" || n.ghost.gesture === "roll") && !n.ghost.to) out.push(`step ${i}: a ${n.ghost.gesture} needs ghost.to`);
      } catch (e) {
        out.push(`step ${i}: ${e.message}`);
      }
    });
    return out;
  };

  /**
   * The state machine. phase: idle -> show (the ghost plays) -> wait (the
   * child's turn) -> the next step's show ... -> done. A matching signal in
   * show or wait finishes the step (a child who acts before the ghost ends
   * is not held back). idle() in wait replays the ghost. skip() ends it.
   * Every call returns the new state {phase, index, step, replays}.
   */
  Onboard.machine = function (script) {
    const steps = script.map(Onboard.normalize);
    let phase = "idle";
    let index = -1;
    let replays = 0;
    const log = [];
    const state = () => ({ phase, index, step: steps[index] || null, replays, total: steps.length });
    const enter = (i) => {
      index = i;
      replays = 0;
      if (i >= steps.length) phase = "done";
      else phase = steps[i].ghost ? "show" : "wait";
      log.push(`${phase}:${index}`);
      return state();
    };
    const live = () => phase === "show" || phase === "wait";
    return {
      steps,
      log,
      state,
      start: () => (phase === "idle" ? enter(0) : state()),
      ghostDone() {
        if (phase === "show") {
          phase = "wait";
          log.push(`wait:${index}`);
        }
        return state();
      },
      /** true when this signal finished the step */
      signal(name) {
        if (!live() || steps[index].wait !== name) return false;
        enter(index + 1);
        return true;
      },
      tap() {
        return this.signal("tap");
      },
      /** S19: on to step i (a later one: the steps between were not this child's to do now); true when it moved. */
      jump(i) {
        if (!live() || !(i > index) || i > steps.length) return false;
        enter(i);
        return true;
      },
      idle() {
        if (phase === "wait" && steps[index].ghost) {
          phase = "show";
          replays++;
          log.push(`show:${index}`);
        }
        return state();
      },
      skip() {
        if (phase !== "done") phase = "skipped";
        log.push("skipped");
        return state();
      },
    };
  };

  Onboard.seen = (id) => {
    const S = store();
    return !!(S && S.get("onboarded", id));
  };
  Onboard.reset = (id) => {
    const S = store();
    if (!S) return;
    if (id) return S.set("onboarded", id, false);
    S.clear("onboarded");
    S.clear("seen");
  };

  // the ghost's path for a gesture: keyframes of {x, y, press, ring}
  Onboard.path = function (gesture, from, to, box) {
    const k = [];
    const a = from;
    const b = to || (gesture === "swipe" ? { x: a.x + Math.max(120, (box ? box.w : 0) * 0.6), y: a.y } : a);
    const near = { x: a.x + 46, y: a.y + 56 };
    if (gesture === "tap") {
      k.push({ o: 0, ...near, press: 0 }, { o: 0.4, ...a, press: 0 }, { o: 0.55, ...a, press: 1, ring: 1 }, { o: 0.7, ...a, press: 0 }, { o: 1, ...near, press: 0 });
    } else if (gesture === "hold") {
      k.push({ o: 0, ...near, press: 0 }, { o: 0.2, ...a, press: 0 }, { o: 0.28, ...a, press: 1, ring: 1 }, { o: 0.85, ...a, press: 1 }, { o: 1, ...near, press: 0 });
    } else if (gesture === "drag" || gesture === "swipe") {
      const fast = gesture === "swipe";
      k.push({ o: 0, ...near, press: 0 }, { o: 0.2, ...a, press: 0 }, { o: 0.3, ...a, press: 1 }, { o: fast ? 0.55 : 0.85, ...b, press: 1 }, { o: fast ? 0.7 : 0.92, ...b, press: 0 }, { o: 1, x: b.x + 30, y: b.y + 40, press: 0 });
    } else if (gesture === "circle-stir") {
      const r = Math.max(28, Math.min(box ? Math.min(box.w, box.h) * 0.28 : 50, 90));
      k.push({ o: 0, ...near, press: 0 }, { o: 0.12, x: a.x + r, y: a.y, press: 0 }, { o: 0.16, x: a.x + r, y: a.y, press: 1 });
      const N = 24; // two turns
      for (let i = 1; i <= N; i++) {
        const t = (i / N) * Math.PI * 4;
        k.push({ o: 0.16 + (0.76 * i) / N, x: a.x + r * Math.cos(t), y: a.y + r * 0.8 * Math.sin(t), press: 1 });
      }
      k.push({ o: 1, x: a.x + r + 30, y: a.y + 40, press: 0 });
    } else if (gesture === "roll") {
      // MAA-20 (Zafar, 8 Nov: "the rolling pin to go up and down and the finger dragging it up and down"): pressed in the middle,
      // up to `from`, down to `to`, back up, to the middle, lifted; the pin rides under it (the step's carry). No `to`: a third of
      // the box's height each way.
      const top = to ? a : { x: a.x, y: a.y - Math.max(30, (box ? box.h : 120) * 0.3) };
      const bot = to || { x: a.x, y: a.y + Math.max(30, (box ? box.h : 120) * 0.3) };
      const m = { x: (top.x + bot.x) / 2, y: (top.y + bot.y) / 2 };
      const n2 = { x: m.x + 46, y: m.y + 56 };
      k.push({ o: 0, ...n2, press: 0 }, { o: 0.12, ...m, press: 0 }, { o: 0.16, ...m, press: 1, ring: 1 }, { o: 0.34, ...top, press: 1 }, { o: 0.62, ...bot, press: 1 }, { o: 0.84, ...top, press: 1 }, { o: 0.92, ...m, press: 1 }, { o: 0.96, ...m, press: 0 }, { o: 1, ...n2, press: 0 });
    }
    return k;
  };
  /*
   * ONE LOOK FOR HELP IN EVERY GAME (Sprint 12; Zafar, 22 Oct: EASY-08, SH-118, SH-119). Onboard.run (a script) and
   * Onboard.spot (the stuck spotlight) draw the same thing:
   *   the dim       Onboard.DIM over everything (one token: a little darker than the old 0.62, SH-118);
   *   the box       ONE rounded rectangle with a plain gold edge (no glow of its own, no pulse) round the target, or round all
   *                 of the targets given together (a group: the eye test's haa, na and the mic), by one rule (Onboard.litBox, SH-230);
   *   the item      inside the box the item itself glows (its own soft radiating glow) and bounces: an HTML control by the
   *                 class ob-lit (css/shared/onboard.css), a canvas thing by its game (o.light / o.move) or the kit's soft ring;
   *   the finger    the kit's one drawn hand (Onboard.finger), tapping in one cadence: in, press, lift off, wait half a second,
   *                 again, for as long as the help is up (Onboard.FINGER).
   */
  let dim = 0.72;
  // (the s14 look's lighter dim, DIM14, while Onboard.look is "s14": the one dimFill below reads it)
  Object.defineProperty(Onboard, "DIM", { enumerable: true, get: () => (Onboard.look === "s14" ? Onboard.DIM14 : dim), set: (v) => (dim = v) });
  /** The lit thing's hop, a share of its own height (the judge, 23 Oct: a clear hop up and back, not a dip): every game. */
  Onboard.HOP = 0.1;
  Onboard.dimFill = () => `rgba(30,18,10,${Onboard.DIM})`;
  /*
   * Sprint 14 (the light rule, Zafar 28 Oct: "the ripple target went ... doesn't look good"; lab/cards.html spot): the kit's s14
   * look, on for chai (Onboard.look = "s14", set by the game while it plays): a thing to tap is always lit, a soft gold glow that
   * breathes, in a lit rounded box that takes in its word pill, everything else dimmed (lighter: DIM14); an ingredient also
   * bounces, a control (a knob, a glass, the arrow) only glows; no finger, no target. Every other game keeps the finger.
   *   Onboard.light(target, {look: "bob" | "glow" | "", pad, live, pass}) -> {close(), box()}   a DOM thing lit alone (the arrow,
   *        the order card for a moment, the first dots): "" lights it with no glow and no bounce (the order card, CHAI-37); pass: the
   *        dim blocks no tap (the child is never held)
   */
  Onboard.look = null;
  Onboard.DIM14 = 0.45;
  /**
   * EASY-08 (Sprint 11): the light hugs the control's own box: a rounded rect with a small, even pad, never an oval that spills
   * over its neighbours. When two lit things, or a thing and a neighbour to keep dark (avoid), are close, the pad shrinks to
   * half the gap between them (down to 0) rather than light the neighbour. (SH-230: the drawn light's box is Onboard.litBox now;
   * this stays the tap area round each live control, Onboard.spot's liveRects, and groupBox's.)
   * rects, avoid: [{x, y, w, h}]; -> [{x, y, w, h, r, pad}] in the same order.
   */
  Onboard.HUG_PAD = 6;
  Onboard.hugShapes = function (rects, avoid, pad) {
    pad = pad == null ? Onboard.HUG_PAD : pad;
    const gap = (a, b) => {
      const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w));
      const dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
      return Math.max(dx, dy);
    };
    const all = (rects || []).filter(Boolean);
    return all.map((r, i) => {
      let p = pad;
      all.forEach((q, j) => j !== i && (p = Math.min(p, gap(r, q) / 2)));
      (avoid || []).filter(Boolean).forEach((q) => (p = Math.min(p, gap(r, q) / 2)));
      p = Math.max(0, p);
      const w = r.w + 2 * p;
      const h = r.h + 2 * p;
      // (Zafar, 3 Nov: a thin box "can't have such rounded corners because it looks almost circular ... a long, thin rectangle with
      // slightly rounded corners": the corner scales with the box, at most a quarter of its height, so a thin strip stays a strip)
      return { x: r.x - p, y: r.y - p, w, h, r: Math.min(12, w / 2, h / 4), pad: p };
    });
  };
  /** The smallest box holding every rect, or null. */
  Onboard.unionOf = function (rs) {
    rs = (rs || []).filter(Boolean);
    if (!rs.length) return null;
    const x0 = Math.min(...rs.map((r) => r.x));
    const y0 = Math.min(...rs.map((r) => r.y));
    return { x: x0, y: y0, w: Math.max(...rs.map((r) => r.x + r.w)) - x0, h: Math.max(...rs.map((r) => r.y + r.h)) - y0 };
  };
  /**
   * EASY-08 (Zafar, 22 Oct: "one rectangle encompassing all three buttons"): the box for a target or a group of targets given
   * together: ONE rounded rect round all of them, padded by Onboard.BOX_PAD (less where a neighbour to keep dark is close).
   * rects, avoid: [{x, y, w, h}] -> {x, y, w, h, r, pad} or null.
   */
  Onboard.BOX_PAD = 10;
  Onboard.groupBox = function (rects, avoid, pad) {
    const u = Onboard.unionOf(rects);
    if (!u) return null;
    return Onboard.hugShapes([u], avoid, pad == null ? Onboard.BOX_PAD : pad)[0];
  };
  /*
   * SH-230 (Zafar, 6 Nov night: "There should be a general rule that works in all cases that leaves some padding around the
   * object+pill+face icon, or object+pill, or object"): the ONE rule for every game's lit box (light.draw below; was groupBox's even
   * pad, trimmed to half the gap to a neighbour, down to 0). The box is the union of what belongs to the thing (its picture, its word
   * pill, its face icon: whichever it has, given together as rects) plus a margin of LIGHT.share of the union's smaller side, LIGHT.min
   * to LIGHT.max px. On a side where that margin would touch a neighbouring item (avoid), that side alone shrinks, only as far as
   * keeps LIGHT.clear px clear of it (a neighbour off a corner trims the side with the most room); at the screen's edge the box stops
   * at the edge (light.draw). o.pad: a caller's own fixed margin, only for a shape that is not a thing (a pan's rim circle, CHAI-68; a
   * part of a card, SH-213).
   * rects, avoid: [{x, y, w, h}] -> {x, y, w, h, r, pad (the rule's margin), sides: {l, t, r, b} (each side's margin)} or null.
   */
  Onboard.LIGHT = { share: 0.12, min: 8, max: 16, clear: 2 };
  Onboard.marginOf = (u) => (u ? Math.max(Onboard.LIGHT.min, Math.min(Onboard.LIGHT.max, Onboard.LIGHT.share * Math.min(u.w, u.h))) : 0);
  Onboard.litBox = function (rects, avoid, o) {
    o = o || {};
    const u = Onboard.unionOf(rects);
    if (!u) return null;
    const m = o.pad != null ? o.pad : Onboard.marginOf(u);
    const c = Onboard.LIGHT.clear;
    const s = { l: m, t: m, r: m, b: m };
    // each neighbour's room from the thing on each side (>= 0 where it lies wholly that way)
    const gaps = (avoid || []).filter(Boolean).map((q) => ({ l: u.x - (q.x + q.w), r: q.x - (u.x + u.w), t: u.y - (q.y + q.h), b: q.y - (u.y + u.h) }));
    // (S19, chaat 8 Nov run: a neighbour's pill reaching a few px into the thing's own pill: that side takes no margin, so the box
    // covers it by no more than it already overlaps; one that overlaps the thing more can't be kept out by the margin)
    const edge = Math.max(4, 0.25 * Math.min(u.w, u.h));
    gaps.forEach((g) => {
      const best = Math.max(g.l, g.r, g.t, g.b);
      if (best >= 0 || best < -edge) return;
      const side = ["l", "r", "t", "b"].find((k) => g[k] === best);
      s[side] = 0;
    });
    const near = gaps
      .filter((g) => Math.max(g.l, g.r, g.t, g.b) >= 0)
      .sort((g, k) => Math.max(g.l, g.r, g.t, g.b) - Math.max(k.l, k.r, k.t, k.b));
    near.forEach((g) => {
      // already clear of the box as it stands (by `clear` px on some side): nothing to trim
      if (g.l >= s.l + c || g.r >= s.r + c || g.t >= s.t + c || g.b >= s.b + c) return;
      // the side that separates them with the most room gives the least
      const side = ["l", "r", "t", "b"].filter((k) => g[k] >= 0).sort((a, b) => g[b] - g[a])[0];
      s[side] = Math.max(0, Math.min(s[side], g[side] - c));
    });
    const x = u.x - s.l;
    const y = u.y - s.t;
    const w = u.w + s.l + s.r;
    const h = u.h + s.t + s.b;
    return { x, y, w, h, r: Math.min(12, w / 2, h / 4), pad: m, sides: s };
  };
  /**
   * SH-119 (Zafar, 22 Oct: "click, move off, wait half a second, click ... right now the gaps are too long"): the finger's one
   * cadence, every game. ms: in (from lifted onto the point), press (down and held), up (lifts off), gap (waits, lifted).
   */
  Onboard.FINGER = { in: 220, press: 200, up: 280, gap: 500 };
  Onboard.FINGER_LIFT = { x: 26, y: 34 }; // where the fingertip waits, lifted off (down and right of the point)
  /**
   * One cycle of the finger as keyframes: {o (0..1), x, y (offsets from the point), press (0|1), ring (the ripple)}. o.down: the
   * hand comes from above (it lifts up and right), so it never covers a label under the thing.
   */
  Onboard.fingerKeys = function (o) {
    const F = Onboard.FINGER;
    const T = F.in + F.press + F.up + F.gap;
    const F0 = Onboard.FINGER_LIFT;
    const from = (o && o.from) || (o && o.down ? "above" : "below");
    // it lifts away the way the hand lies: up for a hand from above, right for a hand on the right ...
    const L = { above: { x: F0.x, y: -F0.y }, below: F0, right: { x: F0.y, y: -8 }, left: { x: -F0.y, y: -8 } }[from] || F0;
    const at = (ms) => +(ms / T).toFixed(4);
    return [
      { o: 0, x: L.x, y: L.y, press: 0 },
      { o: at(F.in), x: 0, y: 0, press: 0 },
      { o: at(F.in + F.press * 0.35), x: 0, y: 0, press: 1, ring: 1 },
      { o: at(F.in + F.press), x: 0, y: 0, press: 1 },
      { o: at(F.in + F.press + F.up), x: L.x, y: L.y, press: 0 },
      { o: 1, x: L.x, y: L.y, press: 0 },
    ];
  };
  Onboard.fingerMs = () => Onboard.FINGER.in + Onboard.FINGER.press + Onboard.FINGER.up + Onboard.FINGER.gap;
  /*
   * Sprint 19 (s19-lights; Zafar's play, 8 Nov: docs/feedback/kitchen-play-2026-11-08.md P4-P9):
   *   SH-236  the light goes the moment the child starts the move it shows (a drag begun, a hold started, a stir begun, a tap landed):
   *           as SH-261 has it (below), a drag or a hold begun in its box, or a game's Onboard.began(by) for a press in its box; a tap's
   *           light goes with its result. MOVE.back: a light whose move ended with its step still open (the child let go half-way) is
   *           lit again this long after the release.
   *   SH-119  one finger: the kit's Onboard.finger is the only one drawn, a script's drag and a game's demo (Onboard.gesture) included.
   *   MAA-20  the finger's look, Zafar's pick on the lab page: "hand" (the kit's drawn hand, the default until he picks) or "circle"
   *           (a pulsing circle). Onboard.fingerLook sets it for every finger; a finger's own o.look for one (the lab's pair).
   *   one light at a time (Fable, maani f8, f11): of the lights up, only the newest that has a thing to light shows (Onboard.raise).
   */
  Onboard.MOVE = { back: 2000, slop: 12, hold: 400, recent: 1000 };
  /*
   * SH-261 (Zafar, 11 Nov, his 3.5-year-old: "they tapped in the box but not on the water ... the onboarding light went away, but the
   * water didn't pour. And then they were stuck ... the onboarding light needs to stay there until they've done the correct action ... a
   * tap that results in the water pouring"): every light, in every game, stays until its owner closes it on the action's own result
   * (the step moves on: the water pours, the pan goes on, the item lands). A press inside its box is not the move: a tap there that
   * misses, a wrong tap, a tap anywhere else leave it up and its ladder running. It hides only while the child is doing the move it
   * shows (SH-236): a drag begun in its box (past MOVE.slop px), a press held on its thing (MOVE.hold ms), or the game's own
   * Onboard.began(by) for a press in its box; let go with the step still open, it comes back MOVE.back ms later, once the game's own
   * moves are still (Onboard.busy, a function a game's kit may set: Cook's coach).
   */
  Onboard.busy = null;
  const busyNow = () => {
    try {
      return typeof Onboard.busy === "function" && !!Onboard.busy();
    } catch (e) {
      return false;
    }
  };
  Onboard.fingerLook = "hand";
  Onboard.FINGER_LOOKS = ["hand", "circle"];
  /** A gesture's point at t (0..1) on its keyframes (Onboard.path's {o, x, y, press}), eased between two: -> {x, y, press}. */
  Onboard.pathAt = function (keys, t) {
    if (!keys || !keys.length) return null;
    if (t <= keys[0].o) return { x: keys[0].x, y: keys[0].y, press: keys[0].press ? 1 : 0 };
    for (let i = 1; i < keys.length; i++) {
      const a = keys[i - 1];
      const b = keys[i];
      if (t > b.o) continue;
      const k = b.o === a.o ? 1 : (t - a.o) / (b.o - a.o);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      // (pressed between two pressed keys; a press or a lift lands on its key)
      return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, press: a.press && b.press ? 1 : k >= 1 ? (b.press ? 1 : 0) : a.press && !b.press ? 1 : 0 };
    }
    const z = keys[keys.length - 1];
    return { x: z.x, y: z.y, press: z.press ? 1 : 0 };
  };
  /** Is page point p inside box b ({x, y, w, h}), give or take pad px? */
  Onboard.pressIn = (p, b, pad) => !!(p && b && p.x >= b.x - (pad || 0) && p.x <= b.x + b.w + (pad || 0) && p.y >= b.y - (pad || 0) && p.y <= b.y + b.h + (pad || 0));

  /* ---------------- the lights and lessons kit (Sprint 18, module map pieces 13-14; pure parts) ---------------- */
  /*
   * The lights every game shares (docs/architecture/module-map.md pieces 13-14; the standard's D1 and D2): one set of times
   * (values.md D1, "to tokenise"), the zoom-in's box, the first-time gate, the stuck hint's clock and its rush, and the rule that
   * a hint never says a word past support. The page parts (Onboard.light's timed form, Onboard.stuck's rush, Onboard.lesson) are
   * under the overlay below; Cook's kitchen wiring (the stage's stillness, the call with its light, the next vessel, the order
   * card's light, the lessons in order) is js/cook/coach.js. No game is named here (STD-F1-02): a game passes its things and numbers.
   *   breath       a control's light waits this long after the stage is still (CHAI-52: "add a second extra"), never more than
   *                breathMax in all
   *   still        the order card's light waits up to this long for a still kitchen (CHAI-77: a child's pace), then gives up
   *   settle       a lesson's stillness wait gives up after this long
   *   nextVessel   the next vessel's light, this long after the last one's pour ends (CHAI-99: "half a second longer"); nextLit:
   *                how long it stays up if the child does nothing
   *   lessonLit    a lesson's light, the longest it stays up; lessonEnd: it ends this long after the tap is shown (SH-196)
   */
  Onboard.WAIT = { breath: 1000, breathMax: 3000, still: 8000, settle: 6000, nextVessel: 800, nextLit: 5000, lessonLit: 6000, lessonEnd: 900 };
  /**
   * SH-213, the zoom-in light (Zafar, 5 Nov: "initially the whole item card is highlighted, and then it quickly zooms in ... just to
   * draw your eye to the item card and then to the part of the item card that you need to focus on ... a generalizable principle"):
   * every game, a light on a small part of a thing (a card's hidden word, its blurred picture, a knob's mark) is given
   * {zoomFrom: <the whole thing>}: the whole thing is lit for `hold` ms, then the box shrinks onto the part over `shrink` ms (eased).
   * Reduced motion: the whole thing, then the part, no shrink. Onboard.ZOOM.total() is how long before the part alone is lit.
   */
  Onboard.ZOOM = { hold: 650, shrink: 450, pad: 4, total() { return this.hold + this.shrink; } };
  /**
   * The zoom-in's box `t` ms after it began (pure; Onboard.spot draws it every frame): from the whole thing `from` (ZOOM.pad round it,
   * less the light's own o.pad, which the light adds on top) to the part `to`, eased out. o: {pad, avoid: [{x, y, w, h}] (a face
   * circle overhanging the whole thing: the box's nearer edge is trimmed clear of it, contract-82), reduced}.
   */
  Onboard.zoomBox = function (from, to, t, o) {
    o = o || {};
    if (!from || !to) return to || null;
    const Z = Onboard.ZOOM;
    const pad = o.pad || 0;
    const u = t < Z.hold ? 0 : o.reduced ? 1 : Math.min(1, (t - Z.hold) / Z.shrink);
    if (u >= 1) return to;
    const e = 1 - Math.pow(1 - u, 3);
    const g = (a, b) => a + (b - a) * e;
    const fx = { x: from.x - Z.pad + pad, y: from.y - Z.pad + pad, w: from.w + 2 * (Z.pad - pad), h: from.h + 2 * (Z.pad - pad) };
    const pd = pad + 1;
    (o.avoid || []).forEach((q) => {
      if (!q || q.x > fx.x + fx.w || q.x + q.w < fx.x || q.y > fx.y + fx.h || q.y + q.h < fx.y) return;
      if (q.y + q.h / 2 < fx.y + fx.h / 2) {
        const y1 = Math.max(fx.y, q.y + q.h + pd);
        fx.h -= y1 - fx.y;
        fx.y = y1;
      } else fx.h = Math.min(fx.h, q.y - pd - fx.y);
    });
    return { x: g(fx.x, to.x), y: g(fx.y, to.y), w: g(fx.w, to.w), h: g(fx.h, to.h) };
  };
  /**
   * The first time (STD-D1-01: an action is lit only the first time it comes up for this player). A gate over a plain record of what
   * was shown (a game's save: Cook's save.seenStation), for one game `scope`:
   *   due(k, all)    is k's first-time help still to come? (all: a lesson every game shares, key "*:<tag>k"; for the New player once
   *                  a round, given `round`, a Set the game makes each round: Zafar, 4 Nov evening; else once a visit, or once ever)
   *   spend(k, all)  it was shown (spent only once its light is drawn: CHAI-102)
   *   first(k, all)  due, and spent now: true once
   *   spent(k, all)  was it ever shown?
   * o: {seen (the record), fresh (this player still has first-time help here: the New player, or the game's coach not yet seen),
   * round, newPlayer, tag (default "s14-")}.
   */
  Onboard.firsts = function (scope, o) {
    o = o || {};
    const seen = o.seen || {};
    const tag = o.tag == null ? "s14-" : o.tag;
    const key = (k, all) => `${all ? "*" : scope}:${tag}${k}`;
    const byRound = (all) => !!(all && o.round && o.newPlayer);
    const g = {
      scope,
      fresh: !!o.fresh,
      key,
      spent: (k, all) => !!seen[key(k, all)],
      due: (k, all) => !!o.fresh && !(byRound(all) ? o.round.has(key(k, all)) : seen[key(k, all)]),
      spend(k, all) {
        seen[key(k, all)] = true;
        if (all && o.round) o.round.add(key(k, all));
      },
      first(k, all) {
        if (!g.due(k, all)) return false;
        g.spend(k, all);
        return true;
      },
    };
    return g;
  };
  /** The stuck hint's rungs (ms): the first time at once, the box at 5 s idle, the guide's line at 15 s (values.md D2). */
  Onboard.RUNGS = [0, 5000, 15000];
  /**
   * STD-D2-04 (Zafar, 3 Nov: "that's an incorrect move, which again should have triggered the stuck mechanism"; every game, 7 Nov):
   * a wrong move brings the stuck hint at once. hintDue (pure): the hint's time, `wait` after the later of the step's opening and the
   * last action (SH-184: "times itself from the last correct action"), or now when rushed. rushRung: which rung a rush brings: the
   * light help (glowAt) if it is not up, else the box (at[1]) if not yet shown, else none (the help is up already).
   */
  Onboard.hintDue = (opened, lastAction, wait, rushed) => (rushed ? 0 : Math.max(opened || 0, lastAction || 0) + (wait || 0));
  Onboard.rushRung = function (o) {
    o = o || {};
    const at = o.at || Onboard.RUNGS;
    const fired = o.fired || {};
    if (o.glowAt != null && !fired.g && !o.spot) return "g";
    if (at[1] != null && !fired[1]) return 1;
    return null;
  };
  /**
   * STD-D2-05 (the leak test, non-negotiable 4; Zafar, 7 Nov: yes): once a word is past support, no hint says it. A hint whose
   * thing is the answer (what a person asked for) comes only while the word is still supported (its stage at most SUPPORTED_TOP), or
   * while it is study (Nani helps, a redo). o: {answer, stage, study} -> true: the hint must not come.
   */
  Onboard.SUPPORTED_TOP = 2;
  Onboard.hintHides = (o) => !!(o && o.answer && !o.study && !(o.stage != null && Number(o.stage) <= Onboard.SUPPORTED_TOP));

  /* ---------------- the play log (Sprint 11; pure part) ---------------- */
  /*
   * The play log (easy-to-play.md principle 11): each stage's events folded into one round
   *   {mode, game, level, at, ms, steps: [{mode, game, step, firstActMs, taps, allTaps, acts, helps}]}
   * taps = taps that did nothing (no live control under them, and no act the game logged for them); acts = the inputs the
   * game took (Lifecycle "act" notes); helps = every help shown in the step (a ghost, a demo, a hint rung, Nani's help line,
   * a reveal on the word card). firstActMs = from the step opening to its first act (null: none). Steps are cut by
   * "step-open" (Onboard.stuck, PlayLog.step) and "step-close" (the order card's tick, the heal host) notes.
   */
  const PL = {};
  PL.KEY = "playlog"; // the save namespace (below)
  PL.MAX = 50;
  PL.SLOW_MS = 5000;
  PL.DEAD = 2;
  PL.HELPS = ["ghost", "demo", "rung", "help", "reveal"];
  PL.ACT_WINDOW = 250;
  /** The mode and game a stage reason names ("clinic/eye", "cook:station"), with meta's names first. */
  PL.names = function (reason, meta) {
    const m = Object.assign({}, meta);
    const r = String(reason || "");
    const sl = r.split("/");
    const co = r.split(":");
    const mode = m.mode || (sl.length > 1 ? sl[0] : co[0]) || "?";
    const game = m.game || (sl.length > 1 ? sl.slice(1).join("/") : co.slice(1).join(":")) || r || "?";
    return { mode, game };
  };
  /**
   * Fold one stage: entries (Lifecycle.log entries from its stage-start to its stage-end, in order: {what, t, reason, step?}),
   * taps ([{t, live}] in that time). meta: {mode, game, level, step}. -> the round.
   */
  PL.fold = function (entries, taps, meta) {
    entries = (entries || []).filter((e) => e && typeof e.t === "number");
    taps = (taps || []).filter((x) => x && typeof x.t === "number");
    meta = meta || {};
    const start = entries.find((e) => e.what === "stage-start");
    const end = [...entries].reverse().find((e) => e.what === "stage-end");
    const t0 = start ? start.t : entries.length ? entries[0].t : taps.length ? taps[0].t : 0;
    const t1 = end ? end.t : Math.max(t0, ...entries.map((e) => e.t), ...taps.map((x) => x.t));
    const { mode, game } = PL.names((start && start.reason) || (end && end.reason), meta);
    // the steps' windows
    const cuts = [];
    let cur = { step: meta.step || null, from: t0, named: !!meta.step };
    entries.forEach((e) => {
      if (e.what === "step-open") {
        const name = e.step != null ? String(e.step) : e.reason;
        const fresh = !entries.some((x) => x.t >= cur.from && x.t < e.t && x.what === "act") && !taps.some((x) => x.t >= cur.from && x.t < e.t);
        if (fresh) {
          cur.step = name;
          cur.named = true;
          return;
        }
        cuts.push(Object.assign(cur, { to: e.t }));
        cur = { step: name, from: e.t, named: true };
      } else if (e.what === "step-close") {
        const name = e.step != null ? String(e.step) : e.reason;
        if (!cur.named) cur.step = name;
        cuts.push(Object.assign(cur, { to: e.t }));
        cur = { step: null, from: e.t, named: false };
      }
    });
    cuts.push(Object.assign(cur, { to: t1 }));
    const acts = entries.filter((e) => e.what === "act");
    const steps = cuts
      .map((c, i) => {
        const inW = (t, last) => t >= c.from && (last ? t <= c.to : t < c.to);
        const last = i === cuts.length - 1;
        const a = acts.filter((e) => inW(e.t, last));
        const tp = taps.filter((x) => inW(x.t, last));
        const dead = tp.filter((x) => !x.live && !acts.some((e) => e.t >= x.t && e.t <= x.t + PL.ACT_WINDOW)).length;
        const helps = entries.filter((e) => inW(e.t, last) && PL.HELPS.includes(e.what)).length;
        return { mode, game, step: c.step || (cuts.length > 1 ? `${game} #${i + 1}` : game), firstActMs: a.length ? a[0].t - c.from : null, taps: dead, allTaps: tp.length, acts: a.length, helps, ms: Math.max(0, c.to - c.from) };
      })
      // a step that closed as the stage ended (nothing in it, a moment long) is not a step
      .filter((s, i, all) => !(i === all.length - 1 && all.length > 1 && !s.acts && !s.allTaps && !s.helps && s.ms < 400));
    return { mode, game, level: meta.level != null ? meta.level : null, at: t0, ms: Math.max(0, t1 - t0), steps };
  };
  /** Is this step worth a look? (over 5 s to its first act, or 2+ taps that did nothing) */
  PL.flags = function (s) {
    const out = [];
    if (s && (s.firstActMs == null ? s.ms > PL.SLOW_MS : s.firstActMs > PL.SLOW_MS)) out.push("slow");
    if (s && s.taps >= PL.DEAD) out.push("dead-taps");
    return out;
  };
  /** The log with a round added (the last MAX kept). */
  PL.append = (list, round) => (Array.isArray(list) ? list : []).concat([round]).slice(-PL.MAX);
  Onboard.playLog = PL;

  /* ---------------- the overlay ---------------- */
  if (typeof document === "undefined") return Onboard;

  const reduced = () => !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const PAD = 12;
  // SH-119: the kit's one finger, every game (Cook's coach and the clinic draw this one; Onboard.HAND for a game's own markup)
  const HAND = `<svg viewBox="0 0 64 80" aria-hidden="true"><path d="M20 6c0-3 2-5 5-5s5 2 5 5v26l2-1V24c0-3 2-5 5-5s5 2 5 5v9l2-.5V28c0-3 2-5 5-5s5 2 5 5v7c1.5-2 3-3 5-2.5 2.5.6 3.6 3 3 5.5l-2 16C58 68 50 78 37 78h-4C22 78 16 72 12 64L3 46c-1.4-2.8-.2-5.6 2.3-6.7 2.4-1 4.9 0 6.2 2.2L20 52z" fill="#fff" stroke="#2b1810" stroke-width="3" stroke-linejoin="round"/></svg>`;
  const HOTSPOT = [25, 3]; // the fingertip, in the 64x80 hand box
  const HAND_W = 64;
  Onboard.HAND = HAND;
  Onboard.HOTSPOT = HOTSPOT;

  function rectOf(t) {
    if (t == null) return null;
    if (typeof t === "function") return rectOf(t());
    if (Array.isArray(t) && t.length === 4 && t.every((n) => typeof n === "number")) return { x: t[0], y: t[1], w: t[2], h: t[3] };
    // (S19: a list of rects or things, e.g. a function giving a thing's parts, Cook.Coach.thingBox: one box round them all, so a
    // finger's start or a light's size reads the whole thing)
    if (Array.isArray(t)) return Onboard.unionOf(t.map(rectOf));
    if (t && typeof t === "object" && typeof t.x === "number" && typeof t.w === "number" && !t.getBoundingClientRect) return { x: t.x, y: t.y, w: t.w, h: t.h };
    const el = typeof t === "string" ? document.querySelector(t) : t;
    if (!el || !el.getBoundingClientRect) return null;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return null; // (hidden: nothing to light)
    // a lit control bounces (ob-lit: the CSS translate property): its box, and the light round it, stay where it rests
    let dx = 0;
    let dy = 0;
    if (el.classList && el.classList.contains("ob-lit") && root.getComputedStyle) {
      const tr = String(root.getComputedStyle(el).translate || "");
      // (the bounce is `translate: 0 -10%`: the computed value keeps the percentage, of the control's own size)
      const m = /^(-?[\d.]+)(px|%)(?:\s+(-?[\d.]+)(px|%))?/.exec(tr);
      if (m) {
        dx = m[2] === "%" ? (+m[1] / 100) * r.width : +m[1] || 0;
        dy = m[3] == null ? 0 : m[4] === "%" ? (+m[3] / 100) * r.height : +m[3] || 0;
      }
    }
    return { x: r.left - dx, y: r.top - dy, w: r.width, h: r.height };
  }
  Onboard.rectOf = rectOf;
  // (S19: a target is one thing, a list, or a function giving either, read each frame: a function giving a list of rects, a thing's
  // parts, Cook.Coach.thingBox, is the list; lists inside lists are flattened)
  const isBox = (t) => Array.isArray(t) && t.length === 4 && t.every((n) => typeof n === "number");
  const listOf = (t) => {
    const out = [];
    const add = (x, depth) => {
      if (depth > 4) return;
      if (typeof x === "function") {
        const v = x();
        if (Array.isArray(v) && !isBox(v)) v.forEach((y) => add(y, depth + 1));
        else out.push(v);
      } else if (Array.isArray(x) && !isBox(x)) x.forEach((y) => add(y, depth + 1));
      else out.push(x);
    };
    add(t, 0);
    return out;
  };
  const rectsOf = (t) => listOf(t).map(rectOf).filter(Boolean);
  const centre = (r) => (r ? { x: r.x + r.w / 2, y: r.y + r.h / 2 } : null);
  const inside = (p, r) => p.x >= r.x - PAD && p.x <= r.x + r.w + PAD && p.y >= r.y - PAD && p.y <= r.y + r.h + PAD;
  const union = Onboard.unionOf;
  const isPoint = (p) => !!p && typeof p === "object" && typeof p.x === "number" && typeof p.y === "number" && p.w == null && !p.getBoundingClientRect;
  /** The HTML controls among the targets (they glow and bounce themselves: class ob-lit); the rest are canvas things. */
  const htmlOf = (t) => {
    const v = typeof t === "function" ? t() : t;
    const el = typeof v === "string" ? document.querySelector(v) : v;
    return el && root.HTMLElement && el instanceof root.HTMLElement ? el : null;
  };
  /** The targets split: {els: HTML controls, rects: every lit box, canvas: the boxes of the things that aren't HTML}. */
  const split = (t) => {
    const els = [];
    const rects = [];
    const canvas = [];
    listOf(t).forEach((x) => {
      const r = rectOf(x);
      if (!r) return;
      rects.push(r);
      const el = htmlOf(x);
      if (el) els.push(el);
      else canvas.push(r);
    });
    return { els, rects, canvas };
  };
  /** The page's idle-clock log: one help moment (a rung, a demo) */
  const LCnote = (what, info) => {
    try {
      if (root.Lifecycle && root.Lifecycle.note) root.Lifecycle.note(what, info);
    } catch (e) {
      /* only a log */
    }
  };
  const LCghost = (step, info) => {
    // TEST HOOK (s04-hooks; only logged): each time the finger starts, in Lifecycle.log, so a probe counts plays (SH-46, CLN-101)
    try {
      if (root.Lifecycle && root.Lifecycle.ghost) root.Lifecycle.ghost(step, info);
    } catch (e) {
      /* only a log */
    }
  };

  /*
   * S19: ONE LIGHT AT A TIME (Fable, maani f8 and f11: "the tawa's ring and the next pile, the disc and the tawa, never together").
   * Every light layer (a script's, each spot's and light's) joins the stack as it is made, and a script's again as each step begins
   * (Onboard.raise); each frame a layer draws its box only if it is the newest layer that wants one (a thing to light, or a move in
   * hand: a script's step while the child does it holds the light dark). A buried light draws nothing, blocks nothing, its finger and
   * its game's glow are off; it comes back when the light over it goes.
   */
  const stack = [];
  const stackIn = (layer) => {
    const i = stack.indexOf(layer);
    if (i >= 0) stack.splice(i, 1);
    stack.push(layer);
  };
  const stackOut = (layer) => {
    const i = stack.indexOf(layer);
    if (i >= 0) stack.splice(i, 1);
  };
  const onTop = (layer) => {
    for (let i = stack.length - 1; i >= 0; i--) {
      const l = stack[i];
      if (!l.isConnected) {
        stack.splice(i, 1);
        continue;
      }
      if (l.__want) return l === layer;
    }
    return true;
  };
  /** (s19-taps) A light went or stepped aside: the light now on top draws at once, never a frame with none (a blink of the dim). */
  const redrawTop = () => {
    for (let i = stack.length - 1; i >= 0; i--) {
      const l = stack[i];
      if (!l.isConnected || !l.__want) continue;
      try {
        if (l.__redraw) l.__redraw();
      } catch (e) {
        /* its own */
      }
      return;
    }
  };
  /** A light layer to the top of the stack (the newest light wins). */
  Onboard.raise = (layer) => layer && stackIn(layer);
  /** TEST HOOK (read-only): how many light boxes are drawn now (one at most). */
  Onboard.lightsShown = () => [...document.querySelectorAll(".njg-onboard.on")].filter((l) => !l.classList.contains("ob-empty") && !l.classList.contains("ob-buried")).length;
  /*
   * S19, SH-236 (SH-261): the press that may start the move. One listener for the page (capture, before the game's own): a press
   * inside a light's drawn box tells that light, which hides once the move is under way (a drag, a hold: MOVE) and never on a tap; its
   * release lets it count down to MOVE.back.
   */
  const pressHooks = new Set();
  let pressOn = false;
  // (SH-261: the page's press now: down, where and when it went down; read by Onboard.began and each light's own press)
  const pressNow = { down: false, x: 0, y: 0, t: 0 };
  const pressWatch = () => {
    if (pressOn) return;
    pressOn = true;
    const each = (k) => (e) => {
      const p = { x: e.clientX, y: e.clientY };
      if (k === "down") Object.assign(pressNow, { down: true, x: p.x, y: p.y, t: Date.now() });
      else if (k === "up") pressNow.down = false;
      else if (!pressNow.down) return;
      [...pressHooks].forEach((h) => {
        try {
          if (h[k]) h[k](p, e);
        } catch (x) {
          /* its own */
        }
      });
    };
    root.addEventListener("pointerdown", each("down"), true);
    root.addEventListener("pointermove", each("move"), true);
    root.addEventListener("pointerup", each("up"), true);
    root.addEventListener("pointercancel", each("up"), true);
  };
  /** SH-261: a tap the light keeps from the page (in the dark round it) is still the child doing something: the shared idle clock
   * hears it (SH-60: the help's wait restarts on every action), as it would any tap; the light stays and its ladder runs on. */
  const seenTap = () => {
    try {
      const G = root.NaniGuide;
      if (G && G.poke) G.poke();
      else ownClock.t = Date.now();
    } catch (e) {
      /* only a clock */
    }
  };
  /** SH-261: was the page's last press inside box b ({x, y, w, h}) and recent (or still down)? No press lately: true (a game's own
   * Onboard.began with no press, its move started by itself). */
  const pressedIn = (b) => {
    if (!pressNow.t || (!pressNow.down && Date.now() - pressNow.t > Onboard.MOVE.recent)) return true;
    return !!b && Onboard.pressIn(pressNow, b);
  };
  /** SH-261: a press that may start a light's move: a drag past MOVE.slop from where it went down, or held MOVE.hold ms on the thing. */
  const moveStart = (p, on) => ({ x: p.x, y: p.y, t: Date.now(), on: !!on });
  const moved = (st, p) => !!st && Math.hypot(p.x - st.x, p.y - st.y) > Onboard.MOVE.slop;
  const held = (st) => !!st && st.on && pressNow.down && Date.now() - st.t >= Onboard.MOVE.hold;
  // (the styles the S19 pieces add to css/shared/onboard.css's: the buried light, the circle finger; injected once, so every page that
  // loads this file has them)
  let styled = false;
  const style = () => {
    if (styled || !document.head) return;
    styled = true;
    const s = document.createElement("style");
    s.dataset.from = "onboard.js";
    s.textContent = [
      ".njg-onboard.on.ob-buried, .njg-onboard.on.ob-moving { opacity: 0; }",
      ".njg-onboard.ob-buried .ob-finger, .njg-onboard.ob-moving .ob-finger { display: none !important; }",
      ".ob-finger.ob-circle { width: var(--njg-tap, 48px); height: var(--njg-tap, 48px); filter: none; }",
      ".ob-finger.ob-circle .ob-finger-in { transform-origin: 50% 50%; }",
      ".ob-finger.ob-circle .ob-dot { position: absolute; inset: 18%; border-radius: 50%; background: rgba(var(--njg-gold-hi-rgb), 0.85); border: 3px solid var(--njg-focus); box-shadow: 0 0 0 0 rgba(var(--njg-focus-rgb), 0.7); }",
      ".ob-finger.ob-circle .ob-dot { animation: ob-circle-pulse 1.2s ease-out infinite; }",
      ".ob-finger.ob-circle .ob-finger-in.pressed .ob-dot { inset: 24%; background: rgba(var(--njg-gold-hi-rgb), 1); }",
      ".ob-finger.ob-circle .ob-finger-in .ob-ripple { left: 0; top: 0; width: 100%; height: 100%; }",
      "@keyframes ob-circle-pulse { 0% { box-shadow: 0 0 0 0 rgba(var(--njg-focus-rgb), 0.75); } 70% { box-shadow: 0 0 0 14px rgba(var(--njg-focus-rgb), 0); } 100% { box-shadow: 0 0 0 0 rgba(var(--njg-focus-rgb), 0); } }",
      "@media (prefers-reduced-motion: reduce) { .ob-finger.ob-circle .ob-dot { animation: none; } }",
    ].join("\n");
    document.head.appendChild(s);
  };
  /** SH-236 (any game): the child has started the move a light shows (a mechanic calls this as its drag, hold or stir begins, or a
   * tap lands): every light the press was in hides now (not one made with o.stay) until the move ends, its owner closing it on the
   * move's result (SH-261), and a game's demo (Onboard.gesture) stops. */
  const liveGestures = new Set();
  Onboard.began = function (by) {
    // (SH-261: only a light whose box the press was in hides, until the move ends; its owner closes it on the move's result. A wrong
    // tap somewhere else that a game reports as a move leaves it up)
    [...liveSpots].forEach((sp) => {
      if (!sp.stay && sp.away) sp.away(by);
    });
    [...liveGestures].forEach((g) => g.stop());
    if (active && active.move && active.pressedIn && active.pressedIn()) {
      active.move(true, pressNow.down);
      // (the press already lifted, a quick tap the game took on its next frame: the release's clock starts now)
      if (!pressNow.down) active.move(false);
    }
    return true;
  };
  /** The move ended (the child let go) with its step still open: the script's light may come back after MOVE.back. */
  Onboard.ended = function () {
    if (active && active.move) active.move(false);
  };

  /**
   * SH-120 (Zafar, 22 Oct: "if new player is toggled on, as soon as I load into the game, it should do the walkthrough"): the
   * grown-ups' New player (labs.html: the profile it resets at every launch carries the shell flag "newPlayer"). On, every
   * first-time help shows at once the first time its step comes up in this visit, whatever the save says it has seen.
   */
  const shownNow = new Set();
  Onboard.newPlayer = function () {
    try {
      return !!(root.Save && typeof root.Save.flag === "function" && root.Save.flag("newPlayer") === true);
    } catch (e) {
      return false;
    }
  };
  /** Has this profile had the first-time help `id`? (New player: only if it came up in this visit) */
  const hadFirst = (id) => (Onboard.newPlayer() ? shownNow.has(id) : Onboard.seen(id));
  const markFirst = (id) => {
    shownNow.add(id);
    const S = store();
    if (S) S.set("onboarded", id, true);
  };

  /**
   * SH-119: the one finger. The kit's drawn hand, its fingertip on `at` (a page point {x, y}, an element or selector, a box
   * [x, y, w, h], or a function giving any of them: it follows it every frame), tapping in Onboard.FINGER's cadence for as long
   * as it is up. o: {container (default the page: fixed, over the dim), step (its name in the log), down (the hand comes from
   * above, pointing down: for a thing with its word label under it, so the hand never covers the label), hold (pressed, no
   * taps: the finger of a drag or a swipe, `at` moving along the move; `at` giving null hides it)}. -> {el, stop()}
   * Wave 2's games (the conversations' emoji finger) switch to this one.
   * S13-F (contract-44: one finger at a time): the newest finger up is the one drawn; one made while another is up hides that
   * one (its owner still holds it) until the newer one stops, so a help handing over to the next never shows two hands.
   */
  const liveFingers = [];
  Onboard.finger = function (at, o) {
    o = o || {};
    style();
    const host = o.container || document.body;
    const el = document.createElement("div");
    el.className = "ob-finger";
    el.setAttribute("aria-hidden", "true");
    // (MAA-20: the look, Zafar's pick: the kit's hand, or a pulsing circle centred on the point; o.look for one finger, the lab's pair)
    const circle = (o.look || Onboard.fingerLook) === "circle";
    el.innerHTML = circle ? `<div class="ob-finger-in"><span class="ob-ripple"></span><span class="ob-dot"></span></div>` : `<div class="ob-finger-in"><span class="ob-ripple"></span>${HAND}</div>`;
    if (circle) el.classList.add("ob-circle");
    if (!o.container) el.classList.add("page");
    // where the hand lies (o.from): above (pointing down), below (pointing up), right or left of the point (pointing across)
    const from = circle ? "below" : o.from || (o.down ? "above" : "below");
    const hotY = from === "above" ? 80 - HOTSPOT[1] : HOTSPOT[1];
    if (from === "above") el.classList.add("down");
    if (from === "left" || from === "right") el.classList.add(`from-${from}`);
    host.appendChild(el);
    const inner = el.firstChild;
    const ripple = inner.querySelector(".ob-ripple");
    const pointOf = () => {
      const v = typeof at === "function" ? at() : at;
      if (isPoint(v)) return v;
      return centre(union(rectsOf(v)));
    };
    let raf = 0;
    let stopped = false;
    // (o.beside: the lab's MAA-20 pair only, two looks shown together for Zafar's pick: outside the one-finger rule)
    if (!o.beside) {
      liveFingers.push(el);
      liveFingers.forEach((f) => f !== el && (f.style.display = "none"));
    }
    const place = () => {
      if (stopped) return;
      // (only the newest finger up is drawn: S13-F, contract-44; one whose layer went without its stop() no longer counts)
      for (let i = liveFingers.length - 1; i >= 0; i--) if (!liveFingers[i].isConnected) liveFingers.splice(i, 1);
      // (o.hidden(): its light is buried under a newer one, or the child is doing the move: S19)
      const p = (o.beside || liveFingers[liveFingers.length - 1] === el) && !(o.hidden && o.hidden()) ? pointOf() : null;
      el.style.display = p ? "" : "none";
      if (p && circle) {
        // (the circle's middle on the point)
        el.style.transform = `translate(${(p.x - (el.offsetWidth || 48) / 2).toFixed(1)}px, ${(p.y - (el.offsetHeight || 48) / 2).toFixed(1)}px)`;
      } else if (p) {
        // the fingertip (HOTSPOT in the 64x80 hand) on the point, at whatever size the page draws the hand
        const k = (el.offsetWidth || HAND_W) / HAND_W;
        el.style.transform = `translate(${(p.x - HOTSPOT[0] * k).toFixed(1)}px, ${(p.y - hotY * k).toFixed(1)}px)`;
      }
      raf = requestAnimationFrame(place);
    };
    place();
    const anims = [];
    if (reduced() || !inner.animate || o.hold) inner.classList.add("pressed");
    else {
      const T = Onboard.fingerMs();
      const keys = Onboard.fingerKeys({ from });
      // (the circle stays on its point and pulses with the same cadence: smaller as it presses)
      const frames = keys.map((kf) => ({ offset: kf.o, transform: circle ? `scale(${kf.press ? 0.78 : 1})` : `translate(${kf.x}px, ${kf.y}px) scale(${kf.press ? 0.88 : 1})` }));
      anims.push(inner.animate(frames, { duration: T, iterations: Infinity, easing: "ease-in-out" }));
      const ring = keys.find((kf) => kf.ring);
      const lift = keys[keys.length - 2].o;
      anims.push(ripple.animate([{ offset: 0, opacity: 0, transform: "scale(0.3)" }, { offset: Math.max(0.01, ring.o - 0.02), opacity: 0, transform: "scale(0.3)" }, { offset: ring.o, opacity: 0.9, transform: "scale(0.6)" }, { offset: lift, opacity: 0, transform: "scale(1.6)" }, { offset: 1, opacity: 0, transform: "scale(1.6)" }], { duration: T, iterations: Infinity }));
    }
    if (o.step != null) LCghost(String(o.step), { gesture: o.hold ? "path" : "tap", finger: true });
    return {
      el,
      stop() {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(raf);
        anims.forEach((a) => a.cancel());
        el.remove();
        const i = liveFingers.indexOf(el);
        if (i >= 0) liveFingers.splice(i, 1);
      },
    };
  };

  /*
   * The light (EASY-08, one look): the dim with ONE rounded hole round the target(s) (Onboard.litBox, SH-230), the plain gold box on
   * its edge, and the kit's soft ring round each canvas thing inside it (an HTML control glows itself: ob-lit).
   */
  const NS = "http://www.w3.org/2000/svg";
  const lightSvg = (sid) =>
    `<svg class="ob-dim" aria-hidden="true"><defs><filter id="ob-feather-${sid}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.5"/></filter><filter id="ob-soft-${sid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter><mask id="ob-mask-${sid}"><rect width="100%" height="100%" fill="#fff"/><rect class="ob-hole" fill="#000" filter="url(#ob-feather-${sid})"/></mask></defs><rect class="ob-shade" width="100%" height="100%" fill="${Onboard.dimFill()}" mask="url(#ob-mask-${sid})"/><g class="ob-glows" filter="url(#ob-soft-${sid})"></g><rect class="ob-box"/></svg>`;
  function lightOf(layer) {
    const hole = layer.querySelector(".ob-hole");
    const box = layer.querySelector(".ob-box");
    const glows = layer.querySelector(".ob-glows");
    const put = (el, b) => {
      el.setAttribute("x", b.x.toFixed(1));
      el.setAttribute("y", b.y.toFixed(1));
      el.setAttribute("width", b.w.toFixed(1));
      el.setAttribute("height", b.h.toFixed(1));
      el.setAttribute("rx", b.r.toFixed(1));
      el.setAttribute("ry", b.r.toFixed(1));
    };
    let litEls = [];
    // the thing itself glows and hops, never its tile (the judge, 23 Oct: the clinic's tool tile hopped with a glow of its own):
    // a control holding a picture lights the picture; a control that is its own thing (a pill, a word) lights itself
    const litOf = (e) => {
      const im = e.querySelector && e.querySelector("img");
      if (!im) return e;
      const a = im.getBoundingClientRect();
      const b = e.getBoundingClientRect();
      return a.width * a.height >= 0.2 * b.width * b.height ? im : e;
    };
    const lit = (targets) => {
      // (the s14 light: a control only glows, ob-lit-glow; "" lights nothing more than the box)
      if (layer.dataset.look === "") targets = [];
      const glowOnly = layer.dataset.look === "glow";
      const els = targets.map(litOf);
      els.forEach((e) => e.classList.toggle("ob-lit-glow", glowOnly));
      litEls.filter((e) => !els.includes(e)).forEach((e) => e.classList.remove("ob-lit-glow"));
      litEls.filter((e) => !els.includes(e)).forEach((e) => e.classList.remove("ob-lit"));
      els.forEach((e) => e.classList.add("ob-lit"));
      litEls = els.slice();
    };
    return {
      /** rects: the targets' boxes (one thing's parts, or a group given together); o: {avoid, tight (a fixed margin for a shape that
       *  is not a thing: Onboard.litBox's pad), rings: the canvas things' boxes to ring, els: the HTML controls}. -> the box */
      draw(rects, o) {
        o = o || {};
        // (S19, one light at a time: this layer wants the light while it has a thing to light, or holds it dark while the child does
        // the move; it draws only as the newest that wants one, Onboard.raise)
        layer.__want = rects.length > 0 || !!layer.__hold;
        // (and while the grown-ups' "?" pop-up is open over the play area, the light steps back as the coach does for a panel: its
        // white action button read as a second lit box, contract-112 at help-open in eggs and corn; it comes back as the pop-up shuts)
        const grownUps = !!document.querySelector(".njg-gu-pop:not(.hidden)");
        const buried = layer.__want && (!onTop(layer) || grownUps);
        layer.classList.toggle("ob-buried", buried);
        layer.__buried = buried;
        if (buried) rects = [];
        let b = rects.length ? Onboard.litBox(rects, o.avoid, { pad: o.tight }) : null;
        // (o.round, CHAI-68's circle, removed: every light is one rounded rectangle, a pan's included, Zafar 10 Nov)
        // the box is always whole on the screen (S12 W2-A, the judge: the pantry jar's box touched the top edge at 915x412). SH-230
        // (Zafar, 6 Nov night): at the screen's edge it stops at the edge: 1 px in (was 3), so 3 of its ring's 4 px still show; a
        // shelf pill on the play area's foot at 740x320 had its box's foot 1 px over the pill, short of the edge
        if (b) {
          const m = 1;
          // (SH-257: a variant's bounds, the play area beside the side panel: its box stops at them as at the screen's edge)
          const wi = o.within && o.within.w > 0 ? o.within : null;
          const W = Math.min(root.innerWidth || 1e4, wi ? wi.x + wi.w : 1e4);
          const H = Math.min(root.innerHeight || 1e4, wi ? wi.y + wi.h : 1e4);
          const x = Math.max(m, wi ? wi.x + m : 0, b.x);
          const y = Math.max(m, wi ? wi.y + m : 0, b.y);
          const w = Math.min(b.x + b.w, W - m) - x;
          const h = Math.min(b.y + b.h, H - m) - y;
          // (a target wholly off the screen, mid-move: no box until it is back)
          b = w > 0 && h > 0 ? Object.assign({}, b, { x, y, w, h }) : null;
        }
        [hole, box].forEach((el) => {
          el.style.display = b ? "" : "none";
          if (b) put(el, b);
        });
        const rs = b ? o.rings || [] : [];
        while (glows.childNodes.length < rs.length) {
          const g = document.createElementNS(NS, "rect");
          g.setAttribute("class", "ob-item-glow");
          glows.appendChild(g);
        }
        [...glows.childNodes].forEach((g, i) => {
          const r = rs[i];
          g.style.display = r ? "" : "none";
          if (!r) return;
          // the item's own soft glow: a warm ring just round it, rounded like a thing (a circle round a jar, a pill round a long one)
          const w = r.w + 4;
          const h = r.h + 4;
          put(g, { x: r.x - 2, y: r.y - 2, w, h, r: Math.min(w, h) / 2 });
        });
        lit(b ? o.els || [] : []);
        // (the sandbox's probe reads the drawn box: contract-53, one thing in the light; SH-138)
        try { layer.dataset.holes = JSON.stringify(b ? [{ x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h) }] : []); } catch (e) { /* none */ }
        // CHAI-36 (Zafar, 27 Oct: "the whole screen's gone dark but nothing's highlighted ... way too early"): no dim without its
        // lit thing, in every game: while the step's target is not on screen yet, the layer stays clear (and blocks nothing)
        layer.classList.toggle("ob-empty", !b);
        return b;
      },
      clear() {
        lit([]);
      },
    };
  }
  // a canvas thing bounces by its game's own hook (o.move(dx, dy, t): the sprite moves itself), as the item glows
  const BOUNCE = { ms: 900 };
  // the finger's tip by a thing, never over it (the judge, 23 Oct): from above, just over its top, clear of its hop; from below,
  // at its base
  const tipOf = (r, from) => {
    if (!r) return null;
    if (from === true || from === "above") return { x: r.x + r.w / 2, y: r.y - r.h * Onboard.HOP };
    if (from === "right") return { x: r.x + r.w + 2, y: r.y + r.h / 2 };
    if (from === "left") return { x: r.x - 2, y: r.y + r.h / 2 };
    return { x: r.x + r.w / 2, y: r.y + r.h * 0.96 };
  };
  /*
   * Where the hand lies by a thing (the judge, 23 Oct: never over the thing nor a neighbour): the first of above, right, left,
   * below whose hand (and its lift) stays on screen and over nothing that can be tapped but the thing itself (for an HTML thing:
   * what is under the hand, sampled; a canvas thing: above if there is room, else right).
   */
  const footOf = (from, t) => {
    const m = 6;
    if (from === "above") return { x: t.x - 25 - m, y: t.y - 77 - 34, w: 64 + 2 * m, h: 77 + 34 };
    if (from === "right") return { x: t.x + m, y: t.y - 39 - 8, w: 77 + 34, h: 64 + 8 };
    if (from === "left") return { x: t.x - 77 - 34 - m, y: t.y - 39 - 8, w: 77 + 34, h: 64 + 8 };
    return { x: t.x - 25 - m, y: t.y + m, w: 64 + 2 * m, h: 77 + 34 };
  };
  const TAPPABLE = "button, img, a[href], input, select, [role='button'], .wc";
  Onboard.fingerFrom = function (target, prefer) {
    const order = ["above", "right", "left", "below"];
    const r = union(rectsOf(target));
    if (!r) return prefer && prefer !== "auto" ? prefer : "above";
    const els = listOf(target).map(htmlOf).filter(Boolean);
    const W = root.innerWidth || 1e4;
    const H = root.innerHeight || 1e4;
    const fits = (f) => {
      const a = footOf(f, tipOf(r, f));
      if (a.x < 0 || a.y < 0 || a.x + a.w > W || a.y + a.h > H) return false;
      if (!els.length || !document.elementFromPoint) return true;
      for (let i = 0; i <= 3; i++)
        for (let j = 0; j <= 3; j++) {
          const hit = document.elementFromPoint(a.x + (a.w * i) / 3, a.y + (a.h * j) / 3);
          const t = hit && hit.closest && hit.closest(TAPPABLE);
          if (t && !els.some((e) => e.contains(t) || t.contains(e))) return false;
        }
      return true;
    };
    // a game's preferred side when the hand fits there (S12 W2-A, the judge: the pantry's finger from above went off the top of a
    // phone), else the first side that fits
    const onScreen = (f) => {
      const a = footOf(f, tipOf(r, f));
      return a.x >= 0 && a.y >= 0 && a.x + a.w <= W && a.y + a.h <= H;
    };
    if (prefer && prefer !== "auto" && onScreen(prefer)) return prefer;
    // SH-130 (S13-A2): first-time help always has its finger. When no side is clear of every other control, the hand lies on the
    // first side where it is at least wholly on the screen (was: "auto", read as below, off the bottom of a laptop's eye test)
    return order.find(fits) || (prefer && prefer !== "auto" ? prefer : null) || order.find(onScreen) || "above";
  };
  const bouncer = (move, height) => {
    if (typeof move !== "function" || reduced()) return { tick() {}, stop() {} };
    const t0 = performance.now();
    let on = true;
    return {
      tick() {
        if (!on) return;
        const t = ((performance.now() - t0) % BOUNCE.ms) / BOUNCE.ms;
        try {
          const px = Math.max(6, (typeof height === "function" ? height() || 60 : 60) * Onboard.HOP);
          move(0, -px * Math.abs(Math.sin(Math.PI * t)), Math.min(0.99, t));
        } catch (e) {
          /* the game's own drawing */
        }
      },
      stop() {
        if (!on) return;
        on = false;
        try {
          move(0, 0, 1);
        } catch (e) {
          /* the game's own drawing */
        }
      },
    };
  };

  const DUR = { tap: 1500, hold: 2200, drag: 2200, swipe: 1500, "circle-stir": 3000 };

  const SKIP_HTML = `<button class="ob-skip" type="button" aria-label="Skip (grown-ups: hold)"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l9 7-9 7zM18 5v14"/></svg><i class="ob-hold"></i></button>`;
  let active = null;
  const pending = [];
  /**
   * The grown-ups' skip for a mode's ? menu: a row "Skip the help (grown-ups: hold)" that
   * ends the running script when held for a second. Returns the element (null if no script runs).
   */
  Onboard.skipButton = function (parent) {
    if (!active || typeof document === "undefined") return null;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ob-skip-row";
    b.setAttribute("data-ob-pass", "");
    b.innerHTML = `<span class="ob-skip-ic"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l9 7-9 7zM18 5v14"/></svg><i class="ob-hold"></i></span><span>Skip the help <small>grown-ups: hold</small></span>`;
    let t = 0;
    const start = (e) => {
      e.preventDefault();
      b.classList.add("holding");
      t = setTimeout(() => {
        b.classList.remove("holding");
        if (active) active.skip();
        b.dispatchEvent(new CustomEvent("skipped", { bubbles: true }));
      }, 1000);
    };
    const stop = () => {
      b.classList.remove("holding");
      clearTimeout(t);
    };
    b.addEventListener("pointerdown", start);
    ["pointerup", "pointerleave", "pointercancel"].forEach((k) => b.addEventListener(k, stop));
    if (parent) parent.appendChild(b);
    return b;
  };
  /** The child did the thing (a mode calls this; also a "njg-onboard" DOM event with detail = name). */
  Onboard.signal = function (name) {
    if (active) active.signal(name);
    return !!active;
  };
  if (typeof document !== "undefined") document.addEventListener("njg-onboard", (e) => Onboard.signal(e.detail));
  Onboard.active = () => active;

  Onboard.run = function (id, script, opts) {
    opts = opts || {};
    if (!opts.force && hadFirst(id)) return Promise.resolve("seen");
    if (active) return new Promise((r) => pending.push(() => Onboard.run(id, script, opts).then(r)));
    const problems = Onboard.validate(script);
    if (problems.length) throw new Error(`onboard ${id}: ${problems.join("; ")}`);
    shownNow.add(id);
    const m = Onboard.machine(script);
    const host = opts.container || document.body;
    const layer = document.createElement("div");
    // (the s14 look: the lit box's soft warm fill, as Onboard.spot's: every Cook station's first-time showing runs here, S14 roll-out)
    layer.className = `njg-onboard${Onboard.look === "s14" ? " ob-s14" : ""}`;
    const sid = `ob${String(id).replace(/[^\w-]/g, "-")}`;
    // (opts.hand, a picture hand, is gone: one finger in every game, SH-119)
    layer.innerHTML = `${lightSvg(sid)}<div class="ob-ghost" aria-hidden="true"><span class="ob-ripple"></span>${HAND}</div>${opts.skipButton ? SKIP_HTML : ""}`;
    host.appendChild(layer);
    style();
    pressWatch();
    stackIn(layer);
    requestAnimationFrame(() => layer.classList.add("on"));
    const ghost = layer.querySelector(".ob-ghost");
    const hot = HOTSPOT;
    const light = lightOf(layer);
    const gap = (st) => (st.idleMs === 0 || opts.idleMs === 0 ? 0 : Onboard.FINGER.gap);
    let lit = [];
    let raf = 0;
    let betweenT = 0;
    let idleTimer = 0;
    let anim = null;
    let finger = null;
    let resolveRun;
    const result = new Promise((r) => (resolveRun = r));
    // S19, SH-236: the child started the step's move (a drag or hold begun in its box, or the game's Onboard.began; SH-261: never a tap):
    // no light, no finger, no dim, nothing blocked, until the step moves on, or MOVE.back after the release with the step still open
    let moving = false;
    let pressing = false;
    let backAt = 0;
    let shownBox = null;
    let wasBuried = false;
    const hiddenNow = () => moving || !!layer.__buried;

    // keep the light on its targets (things move, the page resizes)
    const draw = () => {
      if (moving && !pressing && backAt && Date.now() >= backAt && !busyNow()) back();
      // (SH-261: a press held on the step's thing is its hold begun)
      if (!moving && held(startAt)) {
        startAt = null;
        move(true, true, false);
      }
      const st = m.state().step;
      layer.__hold = moving;
      const sp = st && !moving ? split(st.spotlight) : { els: [], rects: [], canvas: [] };
      lit = sp.rects;
      // (no ring round a canvas thing: Zafar disliked a round glow in the square box; the thing glows by its game)
      // (S19, SH-230: st.avoid, the neighbours the box keeps clear of: Onboard.litBox's one rule)
      shownBox = light.draw(sp.rects, { rings: [], els: sp.els, avoid: st && st.avoid && !moving ? rectsOf(st.avoid) : null });
      // (buried under a newer light: its finger stops; back on top: it plays again)
      const buried = !!layer.__buried;
      if (buried !== wasBuried) {
        wasBuried = buried;
        if (buried) hideGhost();
        else replay();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    // (s19-taps: drawn now, not at the next frame, as a spot's)
    layer.__redraw = () => {
      if (!layer.isConnected) return;
      cancelAnimationFrame(raf);
      draw();
    };

    const playAudio = (st, i) => {
      try {
        if (opts.audio) opts.audio(st, i);
        if (typeof st.audio === "function") st.audio(st, i);
        else if (typeof st.audio === "string" && root.NjgVoice) root.NjgVoice.clip(st.audio); // S13-V: the one voice
      } catch (e) { /* audio is optional */ }
    };
    const stopFinger = () => {
      if (finger) finger.stop();
      finger = null;
    };
    // S19, SH-119 (opts.oneFinger: Cook's coach): a drag, roll, swipe, hold or stir is the kit's one finger (Onboard.finger) moving
    // along the gesture, pressed while it presses, never a second hand; the step's ghost.carry(dx, dy, t, press) moves the game's own
    // thing with it (MAA-20: the rolling pin under the finger), dx, dy in page px from the gesture's first press, and home (0, 0) after
    let pathRaf = 0;
    let pathT = [];
    let pathCarry = null;
    const stopPath = () => {
      cancelAnimationFrame(pathRaf);
      pathRaf = 0;
      pathT.forEach(clearTimeout);
      pathT = [];
      const c = pathCarry;
      pathCarry = null;
      if (c) {
        try {
          c(0, 0, 1, 0);
        } catch (e) {
          /* the game's own drawing */
        }
      }
    };
    const playPath = (keys, dur, carry, done) => {
      stopPath();
      stopFinger();
      let pt = null;
      finger = Onboard.finger(() => pt, { container: layer, hold: true, hidden: hiddenNow });
      const inner = finger.el.firstChild;
      pathCarry = typeof carry === "function" ? carry : null;
      const a = keys.find((k) => k.press) || keys[0];
      if (reduced()) {
        // no motion: the finger pressed at the start, then at the end
        const b = [...keys].reverse().find((k) => k.press) || a;
        pt = { x: a.x, y: a.y };
        pathT.push(setTimeout(() => (pt = { x: b.x, y: b.y }), 700));
        pathT.push(
          setTimeout(() => {
            stopPath();
            stopFinger();
            done();
          }, 1500)
        );
        return;
      }
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const k = Onboard.pathAt(keys, t);
        // (a move's finger shows only while it presses: it comes down where the move starts and goes as it lifts; never a resting hand,
        // which reads as a tap's finger, SH-141/SH-233, contract-44)
        pt = k.press ? { x: k.x, y: k.y } : null;
        if (inner) inner.classList.toggle("pressed", !!k.press);
        if (pathCarry) {
          try {
            pathCarry(k.press ? k.x - a.x : 0, k.press ? k.y - a.y : 0, t, k.press);
          } catch (e) {
            /* the game's own drawing */
          }
        }
        if (t < 1) return void (pathRaf = requestAnimationFrame(tick));
        pathRaf = 0;
        stopPath();
        stopFinger();
        done();
      };
      pathRaf = requestAnimationFrame(tick);
    };
    // (S19: the step's finger and its demo stop: the child is doing the move, or a newer light is up)
    const hideGhost = () => {
      clearTimeout(idleTimer);
      if (anim) anim.cancel();
      anim = null;
      stopPath();
      stopFinger();
      ghost.classList.remove("on", "pressed");
    };
    // (... and play again once the step's light is back)
    const replay = () => {
      const s = m.state();
      if (!s.step || !s.step.ghost || layer.__buried || moving) return;
      if (s.phase === "wait") m.idle();
      if (m.state().phase === "show") playGhost();
    };
    const back = () => {
      moving = false;
      pressing = false;
      backAt = 0;
      layer.classList.remove("ob-moving");
      replay();
    };
    const move = (on, press, now = true) => {
      if (on) {
        const was = moving;
        if (!moving) {
          moving = true;
          hideGhost();
        }
        pressing = !!press;
        backAt = 0;
        layer.classList.add("ob-moving");
        if (!was && now) layer.__redraw();
      } else if (moving) {
        pressing = false;
        backAt = Date.now() + Onboard.MOVE.back;
      }
    };
    const playGhost = () => {
      const s = m.state();
      const st = s.step;
      if (!st || !st.ghost || hiddenNow()) return;
      const spot = union(rectsOf(st.spotlight));
      const fromR = st.ghost.from ? union(rectsOf(st.ghost.from)) : spot;
      const toR = st.ghost.to ? union(rectsOf(st.ghost.to)) : null;
      // (S19: nothing lit, no finger: a step waiting for its moment shows no move)
      if (!fromR || !spot) {
        m.ghostDone();
        return armIdle();
      }
      const box = (r) => (r ? { left: r.x, top: r.y, width: r.w, height: r.h } : null);
      LCghost(`${id}#${s.index}`, { id, index: s.index, gesture: st.ghost.gesture, replay: s.replays, from: box(fromR), to: box(toR) });
      if (st.ghost.gesture === "tap") {
        // SH-119: a tap is the one finger, tapping in its cadence until the step is done (no gap, no replay)
        const from = Onboard.fingerFrom(st.spotlight, st.ghost.down || opts.fingerDown ? "above" : "auto");
        if (!finger && Onboard.look !== "s14") finger = Onboard.finger(() => tipOf(union(rectsOf(st.spotlight)), from), { container: layer, from, hidden: hiddenNow });
        setTimeout(() => {
          if (m.state().phase === "show" && m.state().index === s.index) m.ghostDone();
        }, Onboard.fingerMs());
        return;
      }
      const keys = Onboard.path(st.ghost.gesture, centre(fromR), centre(toR), fromR);
      const dur = st.ghost.ms || DUR[st.ghost.gesture];
      if (opts.oneFinger || st.ghost.gesture === "roll") {
        // (S19, SH-119: the one finger along the move, the game's thing riding under it: st.ghost.carry)
        playPath(keys, dur, st.ghost.carry, () => {
          if (m.state().phase === "show" && m.state().index === s.index) {
            m.ghostDone();
            armIdle();
          }
        });
        return;
      }
      const tf = (p) => `translate(${p.x - hot[0]}px, ${p.y - hot[1]}px) scale(${p.press ? 0.88 : 1})`;
      ghost.classList.add("on");
      ghost.classList.toggle("hold", st.ghost.gesture === "hold");
      if (anim) anim.cancel();
      if (reduced() || !ghost.animate) {
        // no motion: the hand appears at the start, then at the end, pressed
        const a = keys.find((k) => k.press) || keys[0];
        const b = [...keys].reverse().find((k) => k.press) || a;
        ghost.style.transform = tf(a);
        ghost.classList.add("pressed");
        setTimeout(() => (ghost.style.transform = tf(b)), 700);
        setTimeout(() => {
          ghost.classList.remove("pressed", "on");
          if (m.state().phase === "show" && m.state().index === s.index) {
            m.ghostDone();
            armIdle();
          }
        }, 1500);
        return;
      }
      const frames = keys.map((k, i) => ({ offset: k.o, transform: tf(k), opacity: i === 0 || i === keys.length - 1 ? 0 : 0.95 }));
      anim = ghost.animate(frames, { duration: dur, easing: "ease-in-out", fill: "forwards" });
      // the ripple where the finger presses
      const ripple = ghost.querySelector(".ob-ripple");
      const pressAt = keys.find((k) => k.ring);
      if (pressAt && ripple.animate) ripple.animate([{ opacity: 0, transform: "scale(0.3)" }, { opacity: 0.9, transform: "scale(0.6)", offset: pressAt.o }, { opacity: 0, transform: "scale(1.6)" }], { duration: dur, fill: "forwards" });
      anim.onfinish = () => {
        ghost.classList.remove("on");
        if (m.state().phase === "show" && m.state().index === s.index) {
          m.ghostDone();
          armIdle();
        }
      };
    };
    // SH-119: a gesture plays again after the finger's half-second wait while the step waits (no long gaps)
    const armIdle = () => {
      clearTimeout(idleTimer);
      const st = m.state().step;
      if (!st || !st.ghost || st.ghost.gesture === "tap" || !gap(st)) return;
      idleTimer = setTimeout(() => {
        if (m.state().phase === "wait") {
          m.idle();
          playGhost();
        }
      }, gap(st));
    };
    const begin = () => {
      const s = m.state();
      if (s.phase === "done" || s.phase === "skipped") return end(s.phase);
      stackIn(layer); // (S19: each step's light is the newest)
      layer.dataset.step = s.index;
      if (typeof opts.onStep === "function") opts.onStep(s.step, s.index);
      playAudio(s.step, s.index);
      if (s.phase === "show") playGhost();
      else armIdle();
    };
    const advanced = () => {
      hideGhost();
      // (S19: the step moved on: the next one is lit after the breath, whatever the last move was doing)
      moving = false;
      pressing = false;
      backAt = 0;
      layer.classList.remove("ob-moving");
      if (root.Sfx) root.Sfx.play("pop", { volume: 0.7 });
      // a short breath between steps, so the child sees what their action did
      layer.classList.add("between");
      betweenT = setTimeout(() => {
        layer.classList.remove("between");
        begin();
      }, reduced() ? 150 : 450);
    };

    // touches outside the light are blocked; a tap inside is the "tap" signal
    const skipBtn = layer.querySelector(".ob-skip") || document.createElement("i");
    const pass = (e) => !!(e.target && e.target.closest && e.target.closest("[data-ob-pass]"));
    const pt = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      return { x: t.clientX, y: t.clientY };
    };
    // (C4, 4d's daar smoke timeout: the light is where its target is NOW, not where the last frame drew it. A press that
    // came right after the game's next target appeared, before the next frame, was judged against the old light and
    // blocked, while its release, a frame later, counted as the coach's tap: the coach moved on and the game never got it)
    const litNow = () => {
      const st = m.state().step;
      return st ? rectsOf(st.spotlight) : lit;
    };
    const onLight = (e) => litNow().some((r) => inside(pt(e), r));
    // (SH-261: the "tap" signal is a tap on the step's thing itself, an HTML control's own element or a canvas thing's own box, never
    // one in the light's margin that missed it: that leaves the step lit)
    const onThing = (e) => {
      const st = m.state().step;
      if (!st) return false;
      const sp = split(st.spotlight);
      if (sp.els.some((el) => el.contains(e.target))) return true;
      const q = pt(e);
      return sp.canvas.some((r) => Onboard.pressIn(q, r));
    };
    const allowed = (e) => skipBtn.contains(e.target) || (!layer.classList.contains("between") && onThing(e));
    // (C4: a script whose steps are all done blocks nothing while its layer fades: the breath after the last step
    // swallowed the next press, daar's stir)
    const over = () => ["done", "skipped"].includes(m.state().phase);
    const block = (e) => {
      if (skipBtn.contains(e.target) || pass(e) || over()) return;
      // (S19: nothing lit, no dim: nothing blocked, CHAI-36's rule; the child mid-move, or a newer light over this one, the same)
      if (moving || !shownBox) return;
      // (C4: the breath between steps never swallows a press on the lit thing: the game gets it (E5, input is live);
      // only the coach's own step count waits for the breath to end, in up())
      if (!onLight(e)) {
        if (e.type === "pointerdown") seenTap();
        e.stopPropagation();
        e.preventDefault();
      }
    };
    const up = (e) => {
      if (skipBtn.contains(e.target) || pass(e) || !allowed(e)) return;
      // let the game handle the tap first
      setTimeout(() => {
        if (m.tap()) advanced();
      }, 0);
    };
    const EV = ["pointerdown", "mousedown", "touchstart", "click", "dblclick", "contextmenu"];
    EV.forEach((t) => root.addEventListener(t, block, { capture: true, passive: false }));
    root.addEventListener("pointerup", up, true);
    // (S19, SH-236, as SH-261 has it: a press inside the drawn box may start the step's move; the light goes once it does (a drag past
    // MOVE.slop, a press held MOVE.hold on its thing, or the game's Onboard.began), never on a tap: a tap that does the thing moves the
    // step on, one that misses leaves it lit. The release starts MOVE.back)
    let startAt = null;
    const press = {
      down(p, e) {
        startAt = null;
        if (over() || !shownBox || layer.__buried || moving || skipBtn.contains(e.target) || pass(e)) return;
        if (!Onboard.pressIn(p, shownBox)) return;
        const st = m.state().step;
        const onIt = !!st && rectsOf(st.spotlight).some((r) => Onboard.pressIn(p, r));
        // (a step whose move is a drag, a roll, a stir, a swipe or a hold: a press on its thing is that move begun, SH-236's 300 ms)
        if (onIt && st.ghost && st.ghost.gesture && st.ghost.gesture !== "tap") return move(true, true);
        startAt = moveStart(p, onIt);
      },
      move(p) {
        if (startAt && moved(startAt, p)) {
          startAt = null;
          move(true, true);
        }
      },
      up() {
        startAt = null;
        if (pressing) move(false);
      },
    };
    pressHooks.add(press);

    // the grown-up's skip: hold for a second
    let holdT = 0;
    const holdStart = (e) => {
      e.preventDefault();
      skipBtn.classList.add("holding");
      holdT = setTimeout(() => finish("skipped"), 1000);
    };
    const holdEnd = () => {
      skipBtn.classList.remove("holding");
      clearTimeout(holdT);
    };
    skipBtn.addEventListener("pointerdown", holdStart);
    ["pointerup", "pointerleave", "pointercancel"].forEach((t) => skipBtn.addEventListener(t, holdEnd));
    const key = (e) => e.key === "Escape" && finish("skipped");
    root.addEventListener("keydown", key);

    function finish(how) {
      if (how === "skipped") m.skip();
      end(how);
    }
    let ended = false;
    function end(how) {
      // once only: a script skipped during its between-steps pause would end again from that pause's timer, and
      // that second end cleared `active` for the NEXT script, orphaning its overlay (it kept blocking taps: 30 Sept)
      if (ended || !layer.isConnected) return;
      ended = true;
      clearTimeout(betweenT);
      cancelAnimationFrame(raf);
      hideGhost();
      pressHooks.delete(press);
      stackOut(layer);
      redrawTop();
      light.clear();
      EV.forEach((t) => root.removeEventListener(t, block, { capture: true }));
      root.removeEventListener("pointerup", up, true);
      root.removeEventListener("keydown", key);
      const S = store();
      // (C4: a script cut short because its game was unmounted, "left", isn't seen: it shows again next time)
      if (S && how !== "left") S.set("onboarded", id, true);
      if (how === "left") shownNow.delete(id);
      layer.classList.remove("on");
      setTimeout(() => layer.remove(), reduced() ? 0 : 300);
      if (active && active.layer === layer) active = null;
      resolveRun(how);
      const next = pending.shift();
      if (next) next();
    }

    active = {
      id,
      machine: m,
      layer,
      signal(name) {
        if (m.signal(name)) advanced();
      },
      skip: () => finish("skipped"),
      // C4: the game this script belongs to was unmounted (the child left): the overlay and its listeners go, unseen
      leave: () => end("left"),
      // S19: the step's move started (on) or ended (off): Onboard.began / Onboard.ended
      move,
      /** SH-261: was the page's last press in this step's drawn box (Onboard.began hides only the light the move began in)? */
      pressedIn: () => !!shownBox && !layer.__buried && pressedIn(shownBox),
      /** S19: is the step's light off now (the child doing the move, or a newer light over it)? */
      hidden: () => hiddenNow() || !shownBox,
      /** S19: on to step i, later in the script (a step whose moment came without the ones before it: Cook's coach, `when`). */
      jump(i) {
        if (m.jump(i)) advanced();
      },
    };
    m.start();
    begin();
    return result;
  };

  /** Hide a piece of UI until it's first needed (visible at once if this profile has seen it). */
  Onboard.await = function (el, key) {
    if (!el) return el;
    if (key && store() && store().get("seen", key)) el.classList.remove("njg-await");
    else el.classList.add("njg-await");
    return el;
  };
  /** Show it: a gentle fade and glow the first time, instantly after that. Returns true the first time. */
  Onboard.fadeIn = function (el, key) {
    if (!el) return false;
    const S = store();
    const first = !(key && S && S.get("seen", key));
    el.classList.remove("njg-await", "hidden");
    if (el.hidden) el.hidden = false;
    if (first) {
      el.classList.remove("njg-fadein");
      void el.offsetWidth;
      el.classList.add("njg-fadein");
      el.addEventListener("animationend", () => el.classList.remove("njg-fadein"), { once: true });
      if (root.Sfx) root.Sfx.play("pop", { volume: 0.5 });
      if (key && S) S.set("seen", key, true);
    }
    return first;
  };

  /* ---------------- the item shows itself, and the hint rungs ---------------- */
  /*
   * Zafar, 23 Oct: the demo STAYS where the child's own move is a drag or a brush (the toothbrush): there the real item shows the
   * move and comes home (moveDemo, Sprint 11's: path = page points, an element or selector, or {dx, dy}; o.move(dx, dy, t) for a
   * canvas sprite; o.hand: the kit's finger rides along). Only a tap item loses it (Onboard.demo below: it glows in place).
   */
  /** A path's points as offsets from `from` (page px): [{x, y}], an element or selector (its middle), {dx, dy}, or a function. */
  function offsets(path, from) {
    if (typeof path === "function") path = path();
    if (path == null) return [];
    if (!Array.isArray(path) && typeof path === "object" && ("dx" in path || "dy" in path)) return [{ x: path.dx || 0, y: path.dy || 0 }];
    const pts = (Array.isArray(path) && !(path.length === 4 && path.every((n) => typeof n === "number")) ? path : [path])
      .map((p) => (p && typeof p.x === "number" && typeof p.y === "number" && !p.getBoundingClientRect ? p : centre(rectOf(p))))
      .filter(Boolean);
    return pts.map((p) => ({ x: p.x - from.x, y: p.y - from.y }));
  }
  /**
   * The real item shows the action, then goes back to where it was (principle 2: 2-3 year olds copy the thing, not an
   * arrow). item: an element (it moves itself, by the CSS translate property, so its own transform is untouched), or a
   * scene point {x, y} with o.move(dx, dy, t) (a canvas game moves its own sprite each frame; t 0..1 through the path).
   * path: page points, an element or selector to go to (and back), or {dx, dy}. o.ms: the whole demo (default 1600);
   * o.step: its name in the log; o.hand: the ghost finger rides along. Resolves when the item is home.
   */
  const moveDemo = function (item, path, o) {
    o = o || {};
    const isEl = item && (typeof item === "string" || item.nodeType === 1);
    const elx = isEl ? (typeof item === "string" ? document.querySelector(item) : item) : null;
    const from = elx ? centre(rectOf(elx)) : item && typeof item.x === "number" ? { x: item.x, y: item.y } : null;
    if (!from) return Promise.resolve(false);
    const pts = offsets(path, from);
    if (!pts.length) pts.push({ x: 0, y: -Math.max(24, (elx ? rectOf(elx).h : 60) * 0.3) });
    if (!o.quiet) LCnote("demo", { step: o.step != null ? String(o.step) : "", gesture: "item" }); // (a rung logs its own: one help)
    const ms = o.ms || 600 + 500 * pts.length;
    // a leg out to each point, a short hold at the last, and home
    const keys = [{ x: 0, y: 0, o: 0 }];
    pts.forEach((p, i) => keys.push({ x: p.x, y: p.y, o: (0.12 + (0.55 * (i + 1)) / pts.length) }));
    keys.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y, o: 0.78 }, { x: 0, y: 0, o: 1 });
    const at = (t) => {
      for (let i = 1; i < keys.length; i++) {
        if (t <= keys[i].o) {
          const a = keys[i - 1];
          const b = keys[i];
          const k = b.o === a.o ? 1 : (t - a.o) / (b.o - a.o);
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
        }
      }
      return { x: 0, y: 0 };
    };
    let hand = null;
    if (o.hand) {
      hand = document.createElement("div");
      hand.className = "ob-demo-hand";
      hand.setAttribute("aria-hidden", "true");
      hand.innerHTML = HAND;
      Object.assign(hand.style, { position: "fixed", left: "0", top: "0", width: `${HAND_W}px`, height: "80px", zIndex: "960", pointerEvents: "none", opacity: "0.9" });
      document.body.appendChild(hand);
    }
    const placeHand = (d) => hand && (hand.style.transform = `translate(${from.x + d.x - HOTSPOT[0]}px, ${from.y + d.y - HOTSPOT[1]}px)`);
    if (reduced()) {
      // no motion: the item lifts where it is for a moment (a glow), and the hand, if any, sits on it
      if (elx) Object.assign(elx.style, { outline: "4px solid var(--njg-focus)", outlineOffset: "4px" });
      placeHand({ x: 0, y: 0 });
      return new Promise((r) =>
        setTimeout(() => {
          if (elx) Object.assign(elx.style, { outline: "", outlineOffset: "" });
          if (hand) hand.remove();
          r(true);
        }, 900)
      );
    }
    return new Promise((resolve) => {
      const t0 = performance.now();
      if (elx) elx.classList.add("ob-demo");
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / ms);
        const d = at(t);
        const lift = t > 0.06 && t < 0.94 ? 1.06 : 1;
        if (elx) {
          elx.style.translate = `${d.x.toFixed(1)}px ${d.y.toFixed(1)}px`;
          elx.style.scale = String(lift);
        } else if (o.move) {
          try {
            o.move(d.x, d.y, t);
          } catch (e) {
            /* the game's own drawing */
          }
        }
        placeHand(d);
        if (t < 1) return requestAnimationFrame(tick);
        if (elx) {
          elx.style.translate = "";
          elx.style.scale = "";
          elx.classList.remove("ob-demo");
        } else if (o.move) o.move(0, 0, 1);
        if (hand) hand.remove();
        resolve(true);
      };
      requestAnimationFrame(tick);
    });
  };
  /**
   * EASY-03 (Zafar, 22 Oct: "the user clicks on the item, they don't drag it ... take that out, that whole show it"): the real
   * item never moves to its target by itself in any game. Onboard.demo is the item showing where it is: it glows and bounces
   * in place for o.ms (an HTML element by class ob-lit; a canvas thing by o.move(dx, dy, t), its game moving its own sprite a
   * little up and back), with the kit's finger tapping on it when o.hand. `path` is no longer used (kept in the signature for
   * the games that pass one). o.step: its name in the log. Resolves when it is done.
   */
  /** Is this the demo of a drag or a brush? o.drag says so; else a canvas thing that moves itself (o.move: the toothbrush). */
  const dragMove = (item, o) => (o.drag != null ? !!o.drag : typeof o.move === "function" && !(item && root.HTMLElement && item instanceof root.HTMLElement));
  Onboard.demo = function (item, path, o) {
    o = o || {};
    if (dragMove(item, o)) return moveDemo(item, path, o);
    const isEl = item && (typeof item === "string" || item.nodeType === 1);
    const elx = isEl ? (typeof item === "string" ? document.querySelector(item) : item) : null;
    const from = elx ? centre(rectOf(elx)) : isPoint(item) ? { x: item.x, y: item.y } : null;
    if (!from) return Promise.resolve(false);
    if (!o.quiet) LCnote("demo", { step: o.step != null ? String(o.step) : "", gesture: "item" }); // (a rung logs its own: one help)
    const ms = o.ms || 1600;
    const html = elx && root.HTMLElement && elx instanceof root.HTMLElement;
    if (html) elx.classList.add("ob-lit");
    const b = html ? null : bouncer(o.move, () => (elx ? rectOf(elx) || {} : {}).h);
    const f = o.hand ? Onboard.finger(elx || from, { step: o.step }) : null;
    return new Promise((resolve) => {
      const t0 = performance.now();
      const tick = (now) => {
        b && b.tick();
        if (now - t0 < ms) return requestAnimationFrame(tick);
        if (html) elx.classList.remove("ob-lit");
        if (b) b.stop();
        if (f) f.stop();
        resolve(true);
      };
      requestAnimationFrame(tick);
    });
  };

  /**
   * S19, SH-119 (Zafar, 8 Nov, maani's roll: "there seems to be two of them overlapping"; no game draws its own ghost, Cook's S.ghost in
   * the roll, the stir, the knead and the fold): the kit's demo of a move for a game's first time outside a script. The one finger
   * (Onboard.finger, in Onboard.fingerLook) along the move, pressed while it presses, the game's thing riding under it (o.carry), then
   * lifted, the finger's half-second wait, again; until the child presses anywhere (unless o.keepOnPress) or Onboard.began.
   *   at      () -> {from: {x, y}, to: {x, y}} in page px, or {x, y, r} (a stir round a point); null: not yet (looked at again)
   *   o       {gesture ("drag" default, "roll", "swipe", "circle-stir", "hold"), ms (one play; the kit's own by gesture), delay (before
   *           the first), carry(dx, dy, t, press) (page px from the first press; home (0, 0) after each play), step (its log name),
   *           once (one play), keepOnPress, look (the finger's own look: the lab's pair)}
   * Logged as the kit's ghost (Lifecycle ghost, no `at`: contract-102 tells it from a game's). -> {stop()}
   */
  Onboard.gesture = function (at, o) {
    o = o || {};
    style();
    pressWatch();
    const gesture = GESTURES.includes(o.gesture) && o.gesture !== "tap" ? o.gesture : "drag";
    const dur = o.ms || DUR[gesture] || 1500;
    const carry = typeof o.carry === "function" ? o.carry : null;
    let finger = null;
    let raf = 0;
    let timer = 0;
    let stopped = false;
    let pt = null;
    const home = () => {
      if (!carry) return;
      try {
        carry(0, 0, 1, 0);
      } catch (e) {
        /* the game's own drawing */
      }
    };
    const press = { down: () => !o.keepOnPress && g.stop() };
    const g = {
      stop() {
        if (stopped) return;
        stopped = true;
        clearTimeout(timer);
        cancelAnimationFrame(raf);
        if (finger) finger.stop();
        finger = null;
        home();
        liveGestures.delete(g);
        pressHooks.delete(press);
      },
    };
    const play = () => {
      if (stopped) return;
      const v = typeof at === "function" ? at() : at;
      if (!v) return void (timer = setTimeout(play, 200));
      const from = v.from || v;
      const box = v.r ? { w: v.r / 0.28, h: v.r / 0.28 } : v.box || null;
      const keys = Onboard.path(gesture, { x: from.x, y: from.y }, v.to || null, box);
      LCghost(o.step != null ? String(o.step) : "kit-gesture", { gesture, kit: true });
      if (!finger) finger = Onboard.finger(() => pt, { hold: true, look: o.look, beside: !!o.beside });
      const inner = finger.el.firstChild;
      const a = keys.find((k) => k.press) || keys[0];
      const t0 = performance.now();
      const tick = (now) => {
        if (stopped) return;
        const t = Math.min(1, (now - t0) / dur);
        // (reduced motion: the finger pressed where the move starts, still)
        const k = reduced() ? Object.assign({}, a, { press: 1 }) : Onboard.pathAt(keys, t);
        // (shown only while it presses, as a script's move: playPath)
        pt = k.press ? { x: k.x, y: k.y } : null;
        if (inner) inner.classList.toggle("pressed", !!k.press);
        if (carry && !reduced()) {
          try {
            carry(k.press ? k.x - a.x : 0, k.press ? k.y - a.y : 0, t, k.press);
          } catch (e) {
            /* the game's own drawing */
          }
        }
        if (t < 1) return void (raf = requestAnimationFrame(tick));
        pt = null;
        home();
        if (o.once) return g.stop();
        timer = setTimeout(play, Onboard.FINGER.gap);
      };
      raf = requestAnimationFrame(tick);
    };
    liveGestures.add(g);
    pressHooks.add(press);
    timer = setTimeout(play, o.delay || 0);
    return g;
  };

  /**
   * The spotlight (the same light as Onboard.run's, EASY-08): the Onboard.DIM dim with ONE rounded hole round `target` (one
   * thing, or several given together: a group in one box), its plain gold edge, the item(s) inside glowing and bouncing, and
   * the kit's finger tapping on o.item (a page point) or the first target (o.finger === false: no finger). o.avoid: neighbours
   * the box keeps out; o.light: false (the game glows its canvas thing itself) or a function(on); o.move(dx, dy, t): a canvas
   * thing's own bounce. Everything but the live controls (o.live, default the targets) is inert: a touch elsewhere is stopped
   * before the page gets it. [data-ob-pass] (the ? and its menu) stays usable. -> {close(), layer}
   */
  Onboard.spot = function (target, o) {
    o = o || {};
    const sid = `sp${Math.random().toString(36).slice(2, 8)}`;
    const layer = document.createElement("div");
    layer.className = `njg-onboard njg-spot${Onboard.look === "s14" ? " ob-s14" : ""}`;
    if (o.look != null) layer.dataset.look = o.look;
    layer.innerHTML = lightSvg(sid);
    (o.container || document.body).appendChild(layer);
    style();
    pressWatch();
    stackIn(layer); // (S19: the newest light is the one shown)
    requestAnimationFrame(() => layer.classList.add("on"));
    const light = lightOf(layer);
    const bounce = bouncer(o.move, () => (rectsOf(target)[0] || {}).h);
    let lightOn = false;
    // (the game's own glow on its thing: on while this light shows, off while a newer light buries it, S19)
    const gameLight = (on) => {
      if (typeof o.light !== "function" || lightOn === on) return;
      lightOn = on;
      o.light(on);
    };
    gameLight(true);
    let raf = 0;
    let shown = null;
    // (SH-261: away while the child does the move it shows; back MOVE.back after the release, the game's moves still, unless closed)
    let away = false;
    let awayPress = false;
    let awayBack = 0;
    let start = null;
    const zoom = o.zoomFrom ? { t0: Date.now() } : null;
    const draw = () => {
      if (away && !awayPress && awayBack && Date.now() >= awayBack && !busyNow()) away = false;
      // (a press held on the thing is a hold begun: SH-236)
      if (!away && held(start)) goAway(true, false);
      layer.__hold = away;
      layer.classList.toggle("ob-moving", away);
      const sp = away ? { els: [], rects: [], canvas: [] } : split(target);
      // (o.box: the box drawn round what shows of the thing, the thing itself still lit and tapped whole: the reveal lesson's dots,
      // four 4 px dots in a 24 px tap area whose box ran over the word above; the judge, 4 Nov)
      let ob = typeof o.box === "function" ? o.box() : null;
      // (o.zoomFrom, SH-213, Zafar 5 Nov: "initially the whole item card is highlighted, and then it quickly zooms in, i.e. the
      // highlighted box quickly shrinks just to the size of the highlighted box required"): a small part of a thing is lit by first
      // lighting the whole thing it sits on, then the box shrinks onto the part (Onboard.ZOOM), so the eye goes to the thing, then
      // to the part)
      if (zoom) {
        const to = ob || Onboard.unionOf(sp.rects);
        const fr = rectOf(o.zoomFrom);
        // (contract-82, the review of 5 Nov at 740x320: the whole card's box cut the person's face circle that overlaps the card's top:
        // a shape to avoid trims the box's nearer edge clear of it, never crosses it: Onboard.zoomBox)
        if (to && fr) ob = Onboard.zoomBox(fr, to, Date.now() - zoom.t0, { pad: o.pad, avoid: o.avoid ? rectsOf(o.avoid) : null, reduced: reduced() });
      }
      // (SH-230: every thing's box by the one rule, Onboard.litBox; a caller's own pad only for a pan's rim circle, CHAI-68, or a part
      // of a card drawn by o.box, SH-213: shapes that are not a thing with a picture and a pill)
      // (SH-257: a named variant's own margin, the swipe's, Onboard.VARIANTS; and its bounds, o.within: never over the side panel)
      const tight = o.variant || ob ? o.pad : null;
      const within = typeof o.within === "function" ? o.within() : o.within || null;
      shown = light.draw(ob && !away ? [ob] : sp.rects, { avoid: o.avoid ? rectsOf(o.avoid) : null, tight, rings: [], els: sp.els, within });
      gameLight(!layer.__buried && !away);
      if (!sp.els.length && !layer.__buried && !away) bounce.tick();
      raf = requestAnimationFrame(draw);
    };
    // (s19-taps: drawn now, not at the next frame: it steps aside the moment the move starts, it shows the moment the light over it goes)
    layer.__redraw = () => {
      if (closed) return;
      cancelAnimationFrame(raf);
      draw();
    };
    draw();
    const firstRect = () => rectsOf(target)[0] || null;
    // (a game that names the finger's point, o.item, keeps its hand as it was: from above with fingerDown, else below)
    const from = o.item ? (o.fingerDown ? "above" : "below") : Onboard.fingerFrom(target, o.fingerFrom || (o.fingerDown ? "above" : "auto"));
    // (the s14 look: no finger, no target; the lit thing itself shows what to tap)
    const finger = o.finger === false || Onboard.look === "s14" ? null : Onboard.finger(() => (isPoint(o.item) ? o.item : (typeof o.item === "function" && o.item()) || tipOf(firstRect(), from)), { container: layer, step: o.step, from, hold: o.finger === "hold", hidden: () => !!layer.__buried || away });
    // a tap counts on each live control's own box (its pad included): never on the gap between two of a group
    const liveRects = () => Onboard.hugShapes(rectsOf(o.live || target), o.avoid ? rectsOf(o.avoid) : null, o.pad == null ? Onboard.BOX_PAD : o.pad);
    const pt = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      return { x: t.clientX, y: t.clientY };
    };
    const on = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
    // a press in the dark is stopped whole: its release too (a host's tap reads the pointerup, js/shared/input.js), but only
    // that press's: a drag that started on the live control (the toothbrush) may end anywhere
    const dark = new Set();
    const block = (e) => {
      if (e.type === "pointerup" || e.type === "pointercancel" || e.type === "touchend") {
        const id = e.pointerId != null ? e.pointerId : "t";
        if (!dark.has(id)) return;
        dark.delete(id);
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (e.target && e.target.closest && e.target.closest("[data-ob-pass]")) return;
      if (o.pass) return; // (Onboard.light's pass: the light shows the way, every tap still goes through: never a wait)
      if (!shown || away) return; // (no lit thing yet: no dim, so nothing is in the dark; CHAI-36; nor while the child does the move)
      if (liveRects().some((r) => on(pt(e), r))) return;
      // (SH-261: the lit hole is not the dark: a tap in it that misses the thing still reaches the page, the child's tap seen as an
      // action, and the light stays)
      if (Onboard.pressIn(pt(e), shown)) return;
      if (e.type === "pointerdown") {
        dark.add(e.pointerId != null ? e.pointerId : "t");
        seenTap();
      }
      if (e.type === "touchstart") dark.add("t");
      e.stopPropagation();
      e.preventDefault();
    };
    const EV = ["pointerdown", "mousedown", "touchstart", "click", "dblclick", "contextmenu", "pointerup", "pointercancel", "touchend"];
    EV.forEach((t) => root.addEventListener(t, block, { capture: true, passive: false }));
    let closed = false;
    // SH-261 (was SH-236's "a press inside the drawn box closes it"): a press inside the drawn box may start the move it shows; the light
    // only hides once it does (a drag past MOVE.slop, a press held MOVE.hold on the thing), never on a tap: a tap that does the thing
    // closes it by its result (its owner's close()), one that misses leaves it up. o.stay: it never hides; o.onPress(e) returning false:
    // that press is not this light's move (Onboard.light's tapped control, whose click does it)
    function goAway(pressing, now = true) {
      if (closed || o.stay) return;
      away = true;
      awayPress = !!pressing;
      awayBack = pressing ? 0 : Date.now() + Onboard.MOVE.back;
      start = null;
      if (now) layer.__redraw();
    }
    const thingRects = () => rectsOf(o.live || target);
    const press = {
      down(p, e) {
        start = null;
        if (closed || o.stay || !shown || layer.__buried || away || !Onboard.pressIn(p, shown)) return;
        if (e && e.target && e.target.closest && e.target.closest("[data-ob-pass]")) return;
        if (typeof o.onPress === "function" && o.onPress(e) === false) return;
        const onIt = thingRects().some((r) => Onboard.pressIn(p, r));
        // (a light whose move is a drag, o.drag (Onboard.stuck's drag step): a press on its thing is that move begun, SH-236)
        if (onIt && o.drag) return goAway(true);
        start = moveStart(p, onIt);
      },
      move(p) {
        if (start && moved(start, p)) goAway(true);
      },
      up() {
        start = null;
        if (away && awayPress) {
          awayPress = false;
          awayBack = Date.now() + Onboard.MOVE.back;
        }
      },
    };
    pressHooks.add(press);
    const handle = {
      layer,
      stay: !!o.stay,
      box: () => shown,
      /** SH-236, SH-261 (Onboard.began): the game says the child started a move; this light hides if the press was in its box. */
      away() {
        // (a light buried under a newer one on the same thing hides too, by its thing's box: else it came back as the newer one went,
        // chai's water under its hint, contract-106)
        const u = layer.__buried ? Onboard.unionOf(rectsOf(target)) : null;
        const P = Onboard.BOX_PAD;
        const b = shown || (u ? { x: u.x - P, y: u.y - P, w: u.w + 2 * P, h: u.h + 2 * P } : null);
        if (closed || o.stay || away || !b || !pressedIn(b)) return;
        goAway(pressNow.down);
      },
      /** Is it hidden now, the child doing its move? */
      isAway: () => away,
      close() {
        if (closed) return;
        closed = true;
        liveSpots.delete(handle);
        pressHooks.delete(press);
        stackOut(layer);
        cancelAnimationFrame(raf);
        redrawTop();
        if (finger) finger.stop();
        bounce.stop();
        light.clear();
        gameLight(false);
        EV.forEach((t) => root.removeEventListener(t, block, { capture: true }));
        layer.classList.remove("on");
        setTimeout(() => layer.remove(), reduced() ? 0 : 300);
      },
    };
    liveSpots.add(handle);
    return handle;
  };

  /**
   * Everything still lit or counting stops (the cook mount test, 4 Nov: an unmount mid-step left a step's rung clock running, its
   * spotlight's layer on <body> and the layer's page listeners): Cook's UI.reset calls this as the screen goes
   */
  const liveSpots = new Set();
  const liveStuck = new Set();
  Onboard.stopAll = function () {
    [...liveStuck].forEach((h) => { try { h.stop(); } catch (e) { /* its own */ } });
    [...liveSpots].forEach((sp) => { try { sp.close(); } catch (e) { /* its own */ } });
    [...liveGestures].forEach((g) => g.stop());
  };

  /**
   * SH-257 (Zafar, 10 Nov: "stricter on enforcing shared elements use and exceptions can and should be added as improved and expanded
   * rules/definitions and variations in the shared elements"): the light's named variants, each with the games it is agreed for. The
   * light is one rounded rectangle hugging one thing by the one rule (STD-E2-08); a game may only ask for another shape, margin or
   * region by a variant's name ({variant, game}) when that game is on its list. Anything else it passes (shape, round, pad, region,
   * within, or a variant it is not on the list for) is refused: a console warning, a line in Onboard.refused, and the light drawn as
   * the kit's own, unchanged. The kitchen kit's own coach (js/cook/coach.js, a shared piece) marks its calls {kit: true}.
   *   swipe (STD-E2-08a; chop's knife cut, the variant chop's own game owns, so it is the same wherever chop runs: alone, in daar, in
   *     chaat, in any recipe; Zafar 10 Nov, SH-259): one rounded rectangle round the knife, the item and the
   *     path between them (the target: their page boxes), its own margin (pad), stopping at the play area (within: never over the
   *     side panel)
   */
  Onboard.VARIANTS = { swipe: ["chop"] };
  Onboard.ASKS = ["shape", "round", "pad", "region", "within"];
  Onboard.refused = [];
  /** A light's options with what the game may not ask for taken out (and said): -> the options the light uses. */
  Onboard.lightAsk = function (o, game) {
    o = Object.assign({}, o || {});
    const by = game || o.game || null;
    const list = o.variant != null ? Onboard.VARIANTS[o.variant] : null;
    const ok = !!(list && by && list.includes(by));
    const asked = Onboard.ASKS.filter((k) => o[k] != null && o[k] !== false);
    const bad = o.variant != null && !ok ? ["variant"].concat(asked) : ok || o.kit ? [] : asked;
    if (bad.length) {
      const why = `${by || "a game"} asked the light for ${bad.map((k) => (k === "variant" ? `variant ${o.variant}` : k)).join(", ")}: not a named variant for it (Onboard.VARIANTS)`;
      if (Onboard.refused.length < 50) Onboard.refused.push(why);
      try {
        if (root.console && root.console.warn) root.console.warn(`Onboard.light: ${why}; the kit's own light instead (SH-257)`);
      } catch (e) {
        /* no console */
      }
      bad.forEach((k) => delete o[k === "variant" ? "variant" : k]);
    }
    if (!ok) delete o.variant;
    return o;
  };

  /**
   * The light (the s14 look's one lit thing; module map piece 13): Onboard.light(target, o) -> handle {close(), stop(), box(), layer,
   * done}. o (the look): {look: "glow" | "bob" | "" (the order card: no glow, no bounce), pad, round (a circle: a pan's rim), live,
   * pass (the dim blocks no tap: the child is never held), box (a function giving the box drawn round a part), zoomFrom (the whole
   * thing first, SH-213), avoid, container}. And its timing, so a game never wraps it (each game wrapped it its own way before):
   *   ms       it goes by itself after ms (a game passes its own speed's share)
   *   onTap    the lit thing (an element, or a function giving one) tapped: onTap(), and the light goes
   *   quitIf   asked every 60 ms: true, and the light goes (the child has moved on)
   *   note     a step name: the light is logged as a first-time rung (Lifecycle "rung", rung 0, coach), as the checks count it
   * handle.done resolves once the light has gone, whichever way. A null target lights nothing (handle.done resolved).
   */
  Onboard.light = function (target, o) {
    o = Onboard.lightAsk(o || {});
    if (target == null) return { layer: null, box: () => null, close() {}, stop() {}, done: Promise.resolve() };
    // (S19, SH-236, SH-261: it hides while the child does its move, as every light, unless o.stay; a lit control with o.onTap goes on
    // its click, so the tap still reaches onTap; o.onPress(e) is told first, and false keeps it)
    const tapEl = o.onTap ? htmlOf(target) : null;
    const onPress = (e) => {
      if (typeof o.onPress === "function" && o.onPress(e) === false) return false;
      if (tapEl && e && e.target && tapEl.contains(e.target)) return false;
      return true;
    };
    const h = Onboard.spot(target, { look: o.look == null ? "glow" : o.look, pad: o.pad == null ? 6 : o.pad, live: o.live || target, finger: false, container: o.container, pass: !!o.pass, box: o.box, avoid: o.avoid, zoomFrom: o.zoomFrom, stay: !!o.stay, onPress, variant: o.variant, within: o.within });
    if (o.note != null) LCnote("rung", { step: String(o.note), rung: 0, coach: true });
    let gone;
    h.done = new Promise((r) => (gone = r));
    let t = 0;
    let q = 0;
    const at = o.onTap ? htmlOf(target) : null;
    const tap = () => {
      try {
        o.onTap();
      } catch (e) {
        /* the game's own */
      }
      h.close();
    };
    if (at) at.addEventListener("click", tap, true);
    const shut = h.close;
    h.close = function () {
      clearTimeout(t);
      clearInterval(q);
      if (at) at.removeEventListener("click", tap, true);
      shut.call(h);
      gone();
    };
    h.stop = h.close;
    if (typeof o.quitIf === "function")
      q = setInterval(() => {
        let quit = false;
        try {
          quit = !!o.quitIf();
        } catch (e) {
          quit = false;
        }
        if (quit) h.close();
      }, 60);
    if (o.ms != null) t = setTimeout(() => h.close(), o.ms);
    return h;
  };
  /**
   * Is anything on the page still moving that will end (STD-D1-06: a light comes a breath after the last move ends)? A running,
   * finite page animation, the overlay's own, the bubbles', the request card's and the helper's left out (STILL_SKIP, plus skip).
   */
  Onboard.STILL_SKIP = ".cv-bubble, .ng-say, .cv-replies, .ra, .njg-onboard, .njg-rq-card, .njg-rq-veil, .njg-gu-pop, .cv-layer";
  Onboard.pageMoving = function (skip) {
    const sk = skip ? `${Onboard.STILL_SKIP}, ${skip}` : Onboard.STILL_SKIP;
    return !!(document.getAnimations && document.getAnimations().some((a) => {
      if (a.playState !== "running" || !a.effect || !a.effect.getComputedTiming) return false;
      const tm = a.effect.getComputedTiming();
      const el = a.effect.target;
      return tm.iterations !== Infinity && tm.endTime < 1e7 && el && el.closest && !el.closest(sk);
    }));
  };
  // (the zoom-in's times, Onboard.ZOOM, and its box, Onboard.zoomBox: the pure part above)

  /** Ms since the child last did anything: the shared idle clock (NaniGuide), else this file's own. */
  const ownClock = { t: Date.now(), on: false };
  const idleMs = () => {
    const G = root.NaniGuide;
    if (G && G.idleMs && G.watch) {
      G.watch();
      return G.idleMs();
    }
    if (!ownClock.on) {
      ownClock.on = true;
      ["pointerdown", "keydown", "touchstart"].forEach((ev) => document.addEventListener(ev, () => (ownClock.t = Date.now()), true));
    }
    return Date.now() - ownClock.t;
  };
  // (Onboard.RUNGS: the pure part above)
  /**
   * The hint rungs for one step (principle 3), on the shared idle clock:
   *   at[0]   the first time this step appears for this child (once per profile per o.id, default "stuck/<step>"; a New player:
   *           once per visit): the spotlight on the real item at once (EASY-03: no demo; the box, the item glowing, the finger);
   *   glowAt  (optional; CHAI-32) idle this long: o.glow(true), the game's own light help (its call-out card, the item glowing
   *           and bouncing): no dim, no box;
   *   at[1]   idle this long: the spotlight (o.glow(false) first: never the call-out and the heavy dim together);
   *   at[2]   idle this long: the guide's line (o.line()). null leaves a rung out.
   * After an action the clock runs again and so can the rungs (the spotlight and the call-out go). It never does the step.
   * STD-D2-04 (every game, Zafar 7 Nov): a wrong move brings the hint at once: rush() (or Onboard.rush(), every live step's) brings
   * the next rung now (Onboard.rushRung: the light help, else the box), whatever the clock says; the wrong tap's own press and lift
   * (within RUSH_GRACE of the rush) don't count as the action that would take that help away again.
   *   o: {target (the live control), item (the finger's point), live, avoid, pad, light, move, line, glow, glowAt, at, first, id}
   *   -> {done(), stop(), rush(by), rung}   done() when the step is complete (the spotlight goes); the stage's end stops it too
   */
  Onboard.stuck = function (step, o) {
    o = o || {};
    const name = String(step);
    const id = o.id || `stuck/${name}`;
    const AT = o.at || Onboard.RUNGS;
    LCnote("step-open", { step: name });
    const opened = Date.now();
    if (root.PlayLog && root.PlayLog.step) root.PlayLog.step(name, { noted: true });
    let spot = null;
    let poll = 0;
    let fired = {};
    let lastAct = null;
    let off = null;
    let glowing = false;
    let rushed = null;
    let rushT = 0;
    const h = { rung: 0 };
    h.rush = (by) => {
      if (h.over) return;
      rushed = by || "wrong";
      rushT = Date.now();
    };
    // Zafar, 23 Oct: a drag or a brush (a canvas thing that moves itself along a path: the toothbrush) keeps its demo: the item
    // shows the move at each rung, and the light never bounces it or taps it (only a tap item glows in its box)
    const drag = o.drag != null ? !!o.drag : typeof o.move === "function" && o.path != null && !split(o.target).els.length;
    let busy = false;
    const demo = () => {
      if (!drag || busy || h.over) return;
      busy = true;
      const pt = o.item || centre(rectsOf(o.target)[0] || null);
      moveDemo(pt, o.path, { step: name, move: o.move, hand: o.hand, ms: o.ms, quiet: true }).finally(() => (busy = false));
    };
    const glow = (on) => {
      if (glowing === on || typeof o.glow !== "function") return;
      glowing = on;
      try {
        o.glow(on);
      } catch (e) {
        /* the game's own help */
      }
    };
    const openSpot = () => {
      glow(false);
      if (!spot && o.target) spot = Onboard.spot(o.target, { live: o.live, avoid: o.avoid, pad: o.pad, item: o.item, light: o.light, move: drag ? null : o.move, finger: drag ? "hold" : undefined, fingerDown: o.fingerDown, fingerFrom: o.fingerFrom, step: name, drag }); // (SH-130, S13-A2: a drag's box has its finger too, pressed on the thing to move)
    };
    const closeSpot = () => {
      if (spot) spot.close();
      spot = null;
    };
    const end = () => {
      if (h.over) return;
      h.over = true;
      liveStuck.delete(h);
      clearInterval(poll);
      closeSpot();
      glow(false);
      if (off) off();
    };
    h.done = end;
    h.stop = end;
    // the first time: the spotlight on the real item as the step opens
    const first = o.first !== false && AT[0] != null && !hadFirst(id);
    if (first) {
      markFirst(id);
      setTimeout(() => {
        if (h.over) return;
        h.rung = 0;
        LCnote("rung", { step: name, rung: 0 });
        // (a drag's first time: the item shows the move; a tap's: the box at once)
        if (drag) demo();
        else openSpot();
      }, AT[0] || 0);
    }
    poll = setInterval(() => {
      if (h.over) return;
      const G = root.NaniGuide;
      const la = G && G.lastAction ? G.lastAction() : ownClock.t;
      if (la !== lastAct) {
        // the child did something: the rungs start again from now, and the light help goes (not the wrong move that rushed it: its own
        // press and lift land just around the rush). SH-261: the box stays until the step is done (h.done(), the action's own result):
        // a tap that missed, or one elsewhere, never takes it away; it hides only while the child does its move (Onboard.spot)
        if (lastAct != null && !(rushT && Math.abs(la - rushT) < Onboard.RUSH_GRACE)) {
          fired = {};
          glow(false);
        }
        lastAct = la;
      }
      // (the rungs count from the child's last action or the step opening, whichever is later: a step that opens after a long
      // read-out is not a child who has been stuck all that time)
      const idle = Math.min(idleMs(), Date.now() - opened);
      if (rushed) {
        const by = rushed;
        rushed = null;
        const r = Onboard.rushRung({ glowAt: o.glowAt, at: AT, fired, spot: !!spot });
        if (r === "g") {
          fired.g = true;
          h.rung = Math.round(o.glowAt / 1000);
          LCnote("rung", { step: name, rung: h.rung, light: true, by });
          glow(true);
        } else if (r === 1) {
          fired[1] = true;
          h.rung = Math.round(AT[1] / 1000);
          LCnote("rung", { step: name, rung: h.rung, by });
          openSpot();
          demo();
        }
      }
      if (o.glowAt != null && idle >= o.glowAt && !fired.g && !spot) {
        fired.g = true;
        h.rung = Math.round(o.glowAt / 1000);
        LCnote("rung", { step: name, rung: h.rung, light: true });
        glow(true);
      }
      if (AT[1] != null && idle >= AT[1] && !fired[1]) {
        fired[1] = true;
        h.rung = Math.round(AT[1] / 1000);
        LCnote("rung", { step: name, rung: h.rung });
        openSpot();
        demo();
      }
      if (AT[2] != null && idle >= AT[2] && !fired[2]) {
        fired[2] = true;
        h.rung = Math.round(AT[2] / 1000);
        LCnote("rung", { step: name, rung: h.rung });
        demo();
        try {
          if (o.line) o.line(name);
        } catch (e) {
          /* the guide's line is the game's */
        }
      }
    }, 200);
    if (root.Lifecycle && root.Lifecycle.onStageEnd) off = root.Lifecycle.onStageEnd(end);
    liveStuck.add(h);
    return h;
  };
  Onboard.RUSH_GRACE = 700;
  /**
   * STD-D2-04: a wrong move, in any game: every live step's stuck hint comes at once (Onboard.stuck's rush), and so does every other
   * hint waiting on a clock that asked to hear of it (Onboard.onRush(fn) -> off(): Cook's control light, js/cook/coach.js).
   */
  const rushers = new Set();
  Onboard.onRush = (fn) => {
    if (typeof fn !== "function") return () => {};
    rushers.add(fn);
    return () => rushers.delete(fn);
  };
  Onboard.rush = function (by) {
    [...liveStuck].forEach((h) => h.rush && h.rush(by));
    [...rushers].forEach((fn) => {
      try {
        fn(by || "wrong");
      } catch (e) {
        /* its own */
      }
    });
  };
  /* ---------------- the reveal lessons (module map piece 14) ---------------- */
  /*
   * SH-196, STD-D1-08 (Zafar, 2 Nov: "teach the blur of the word, and then the image, both when they first happen"): the reveal is
   * taught when it first happens by showing its tap on a card in view, never as help. Onboard.lesson(kind, sel, o) lights one hidden
   * thing on the order card (kind "word": a dotted word, the Kutchi or the English, one lesson; "pic": a blurred picture's eye), zooms
   * from its item card onto it (SH-213), shows the tap once in place (the card's own demo: the word shows, then the dots come back),
   * and lets go a beat after. -> Promise<true> once its box was drawn (o.onLit(el) is called then: the game spends its first time
   * and logs it); false: nothing was in view, nothing lit, nothing spent (CHAI-102).
   * Only a thing the child can see (Onboard.inView: inside an open card, inside the order list's view, on top at its middle); a card
   * just out of the list's view is brought in (o.intoView), a row cut at its edge glided to it (OrderCard.glideTo); the stage still
   * first (o.settle, o.moving: contract-79). A card redrawn under the lesson (the order's end redraws every card) is followed: the
   * same thing on the new card (its person's card, its place among that card's), else picked again (twice at most).
   * o: {settle() -> Promise (the stage still), moving() (default Onboard.pageMoving), intoView(card), wait(ms) (the game's own
   * speed; default real time), speed (1), sound() (the tap's click), hold(on) (the game's "wait" while it runs), onLit(el), note
   * (the light's log step), list ("#mission"), pickMs (4000)}.
   */
  const LIST = "#mission";
  const ROWS = `${LIST} .oc-row14`;
  Onboard.LESSON = {
    list: LIST,
    word: `${ROWS} .wc14-hide-en .wc14-en-dots, ${ROWS} .wc14-hide-k .wc14-k-dots, ${ROWS} .wc14-k .dots`,
    pic: `${ROWS} .wc14-hide-pic .wc14-eye`,
  };
  const visible = (x) => !!(x && x.offsetParent && root.getComputedStyle && getComputedStyle(x).display !== "none" && getComputedStyle(x).visibility !== "hidden");
  /** Can the child see x on the order card? (open card, inside the list's view, what shows at its middle; cut at the row's edge is fine) */
  Onboard.inView = function (x, list) {
    if (!visible(x) || x.closest(".oc-card.folded")) return false;
    const L = document.querySelector(list || LIST);
    const r = x.getBoundingClientRect();
    const m = L ? L.getBoundingClientRect() : null;
    if (!m || r.width <= 1 || r.height <= 1 || r.top < m.top - 1 || r.bottom > m.bottom + 1) return false;
    const row = x.closest(".oc-row14");
    const rr = row ? row.getBoundingClientRect() : m;
    const mid = r.left + r.width / 2;
    const cx = Math.max(rr.left + 2, Math.min(rr.right - 2, mid));
    const hit = mid >= rr.left && mid <= rr.right ? document.elementFromPoint(cx, r.top + r.height / 2) : null;
    return !hit ? mid < rr.left || mid > rr.right : hit === x || x.contains(hit) || hit.contains(x) || !!(hit.closest && hit.closest(".wc14") === x.closest(".wc14"));
  };
  /** The first thing matching sel the child can see, waited for up to ms while the cards settle (a card brought into view meanwhile). */
  Onboard.pickShown = async function (sel, o) {
    o = o || {};
    const ms = o.ms == null ? 4000 : o.ms;
    const t0 = Date.now();
    for (;;) {
      const all = [...document.querySelectorAll(sel)].filter(visible);
      const ok = all.find((x) => Onboard.inView(x, o.list));
      if (ok) return ok;
      const open = all.find((x) => !x.closest(".oc-card.folded"));
      if (open && o.intoView) o.intoView(open.closest(".oc-card"));
      if (Date.now() - t0 > ms) return null;
      await new Promise((r) => setTimeout(r, 120));
    }
  };
  /** Why a thing was taken or not, for the play log (the labs' "Record a play"): "<who>:ok|folded|hidden|out@x,y". */
  Onboard.lessonWhy = function (x, list) {
    const c = x.closest(".oc-card");
    const r = x.getBoundingClientRect();
    return `${(c && c.dataset.who) || "?"}:${x.closest(".oc-card.folded") ? "folded" : !visible(x) ? "hidden" : Onboard.inView(x, list) ? "ok" : `out@${Math.round(r.left)},${Math.round(r.top)}`}`;
  };
  Onboard.lesson = async function (kind, sel, o) {
    o = o || {};
    sel = sel || Onboard.LESSON[kind === "pic" ? "pic" : "word"];
    const sp = o.speed || 1;
    const real = (ms) => new Promise((r) => setTimeout(r, ms));
    const wait = o.wait || ((ms) => real(ms / sp));
    const moving = o.moving || (() => Onboard.pageMoving());
    const settle =
      o.settle ||
      (async () => {
        const t0 = Date.now();
        let quiet = null;
        while (Date.now() - t0 < Onboard.WAIT.settle) {
          if (!moving()) quiet = quiet == null ? Date.now() : quiet;
          else quiet = null;
          if (quiet != null && Date.now() - quiet >= 500 / sp) return;
          await real(60);
        }
      });
    const pick = (ms) => Onboard.pickShown(sel, { ms, list: o.list, intoView: o.intoView });
    const first = await pick(o.pickMs);
    if (!first) return false;
    // the thing, followed onto a card redrawn under the lesson (CHAI-102)
    let el = first;
    let key = null;
    const keep = (x) => {
      el = x;
      const c = x.closest(".oc-card");
      key = { who: c && c.dataset.who, i: c ? [...c.querySelectorAll(sel)].indexOf(x) : -1 };
    };
    const live = () => {
      if (el && el.isConnected) return el;
      const c = key && [...document.querySelectorAll(`${o.list || LIST} .oc-card`)].find((q) => q.dataset.who === key.who);
      const x = c && key.i >= 0 ? c.querySelectorAll(sel)[key.i] : null;
      if (x) {
        if (el && el.classList.contains("ob-dots-now")) x.classList.add("ob-dots-now");
        el = x;
      }
      return el;
    };
    keep(first);
    for (let go = 0; ; go++) {
      const row = live().closest(".oc-row");
      // (Zafar, 4 Nov: "the whole screen is fully lit for a few seconds" before it: the row is glided, and waited for, only when its
      // card is not already whole in view)
      const rowBox = row && row.closest(".oc-row14");
      const cut = !!(row && rowBox && (() => { const a = row.getBoundingClientRect(), b = rowBox.getBoundingClientRect(); return a.left < b.left - 1 || a.right > b.right + 1; })());
      if (cut && root.OrderCard && root.OrderCard.glideTo) {
        root.OrderCard.glideTo(row);
        await wait(400);
      }
      // (contract-79: the cards have landed and the row has stopped, looked at again as it lights: a slide can begin in that frame)
      for (let k = 0; k < 4; k++) {
        await settle();
        if (!moving()) break;
      }
      // (contract-79, 4 Nov: lit 7 ms after the row's scroll ended: a beat of real time once still, and again if a slide began in it)
      for (let k = 0; k < 3; k++) {
        await real(170);
        if (!moving()) break;
        await settle();
      }
      if (live().isConnected && visible(el)) break;
      const again = go < 2 ? await pick(1500) : null;
      if (!again) return false;
      keep(again);
    }
    el.classList.add("ob-dots-now");
    if (o.hold) o.hold(true);
    // (the judge, 3-4 Nov: the box hugs the dots and stops short of the word above them; the whole tap area is still lit and tapped)
    const hug = () => {
      const e = live();
      const above = e.closest(".wc14") && e.closest(".wc14").querySelector(".wc14-k");
      const ks = [...e.children].map((k) => k.getBoundingClientRect()).filter((q) => q.width && q.height);
      if (!ks.length) return null;
      const x0 = Math.min(...ks.map((q) => q.left)), x1 = Math.max(...ks.map((q) => q.right));
      let y0 = Math.min(...ks.map((q) => q.top)) - 3;
      const y1 = Math.max(...ks.map((q) => q.bottom)) + 3;
      const w = above && above !== e && !above.contains(e) ? above.getBoundingClientRect() : null;
      if (w && w.bottom > y0 - 3 && w.top < y0) y0 = Math.min(y1 - 6, w.bottom + 3);
      return { x: x0 - 4, y: y0, w: x1 - x0 + 8, h: y1 - y0 };
    };
    // (Zafar, 4 Nov: while the word shows in the dots' place the box is on the word)
    const peek = () => {
      const c = live().closest(".wc14");
      const pk = c && [...c.querySelectorAll(".wc14-peek")].find((x) => x.getBoundingClientRect().width > 0);
      if (!pk) return null;
      const q = pk.getBoundingClientRect();
      return { x: q.left - 4, y: q.top - 2, w: q.width + 8, h: q.height + 4 };
    };
    // (Zafar, 4 Nov evening: "the highlight box for the blurred words should be the biggest size it's going to be": the word's own
    // text, measured while hidden, joins the dots' box from the start)
    const wordBox = () => {
      const e = live();
      const c = e.closest(".wc14");
      const t = c && (e.classList.contains("wc14-en-dots") ? c.querySelector(".wc14-en") : e.classList.contains("wc14-k-dots") ? c.querySelector(".wc14-k") : null);
      if (!t || !t.textContent.trim() || !document.createRange) return null;
      const rg = document.createRange();
      rg.selectNodeContents(t);
      const q = rg.getBoundingClientRect();
      return q.width && q.height ? { x: q.left - 4, y: q.top - 2, w: q.width + 8, h: q.height + 4 } : null;
    };
    let lastBox = null;
    const boxNow = () => {
      const b = Onboard.unionOf([hug() || peek(), wordBox()]) || lastBox;
      if (b) lastBox = b;
      return b;
    };
    let over = false;
    // (SH-213: the whole item card first, then the box shrinks onto the hidden word, or onto the blurred picture itself)
    const isEye = el.classList.contains("wc14-eye");
    const whole = () => live().closest(".wc14");
    const picEl = isEye ? () => live().closest(".wc14-pic") : null;
    const picBox = () => {
      const p = picEl && picEl();
      const q = p && p.getBoundingClientRect();
      if (q && q.width) lastBox = { x: q.left, y: q.top, w: q.width, h: q.height };
      return lastBox;
    };
    const zoomMs = Onboard.ZOOM.total();
    // (avoid the face circle, never its 48 px tap area: the tap area reached into the first card at 740x320 and pushed the light off the
    // card's top, contract-105 on every kitchen game, 10 Nov)
    const lit = Onboard.light(live, { look: "glow", pad: isEye ? 2 : 0, pass: true, ms: (Onboard.WAIT.lessonLit + zoomMs) / sp, onTap: () => {}, quitIf: () => over, note: o.note, box: isEye ? (picEl && picEl() ? picBox : undefined) : boxNow, zoomFrom: whole() ? whole : undefined, avoid: [...document.querySelectorAll(`${o.list || LIST} .oc-face`)].map((f) => f.querySelector(".njg-face") || f) });
    const end = () => {
      live().classList.remove("ob-dots-now");
      if (o.hold) o.hold(false);
    };
    // (CHAI-102: a box drawn, looked at for up to 0.6 s: a thing mid-move has none until it is back; else no lesson, nothing spent)
    const drawn = () => !!(lit.box && lit.box());
    for (let t0 = Date.now(); !drawn() && Date.now() - t0 < 600; ) await real(60);
    if (!drawn()) {
      lit.stop();
      await lit.done;
      end();
      return false;
    }
    if (o.onLit) o.onLit(live());
    // (Zafar, 3 Nov: "it highlights it as dotted, plays a clicking sound, and it changes to English": the lesson shows the tap once,
    // in place, then the dots come back for the child's own tap; a demonstration, never counted as their help)
    const rowNow = live().closest(".oc-row");
    const card = rowNow && rowNow.wc;
    const slot = el.classList.contains("wc14-eye") ? "picture" : el.classList.contains("wc14-en-dots") ? "english" : "text";
    if (card && card.demo) {
      // (the zoom-in first; then the part alone a beat before the tap is shown: 0.5 s after a zoom, Zafar 5 Nov, else 1.1 s)
      if (zoomMs) await real(zoomMs);
      await wait(zoomMs ? 500 : 1100);
      if (o.sound) o.sound();
      await card.demo(slot, 1600 / sp);
      await wait(Onboard.WAIT.lessonEnd);
      over = true;
    }
    await lit.done;
    end();
    // (its light has faded before play comes in: the kit's fade is 300 ms of real time, never the test speed's)
    await real(340);
    return true;
  };
  /* ---------------- the play log (Sprint 11): the runtime ---------------- */
  // one recorder per page (a mode that loads this file again, Cook's needs list, keeps the first one and its taps)
  if (root.PlayLog && root.PlayLog.__live) {
    Onboard.playLog = root.PlayLog;
    return Onboard;
  }
  const PlayLog = Object.assign(Object.create(PL), { __live: true });
  let meta = {};
  const taps = [];
  const liveControl = (t) => {
    const c = t && t.closest && t.closest("button, [role='button'], a[href], input, select, label");
    if (!c || c.disabled || c.getAttribute("aria-disabled") === "true") return false;
    return !c.closest(".hidden, [hidden], [inert]");
  };
  // every trusted tap, before anything can stop it (a spotlight's block is registered later on the same target)
  root.addEventListener(
    "pointerdown",
    (e) => {
      if (!e.isTrusted && !PlayLog.untrusted) return;
      taps.push({ t: Date.now(), live: liveControl(e.target) });
      if (taps.length > 600) taps.splice(0, taps.length - 600);
      hook();
    },
    true
  );
  // stored through the one save (privacy rule: storage only in the save modules): each player's own "playlog" namespace,
  // {rounds: [...]} (the last 50); a New player's reset (Save.resetPlayer) keeps it. With no save on the page: this visit only.
  const mem = { rounds: [] };
  const S = () => (root.Save && typeof root.Save.get === "function" ? root.Save : null);
  const mine = () => {
    try {
      const v = S() ? S().get(PL.NS).rounds : mem.rounds;
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  };
  PL.NS = "playlog";
  /** Every player's rounds on this device, oldest first, each with its player's name. */
  PlayLog.read = function () {
    try {
      const sv = S();
      if (!sv) return mem.rounds.slice();
      return sv
        .players()
        .flatMap((pl) => ((sv.get(PL.NS, pl.id) || {}).rounds || []).map((r) => Object.assign({ player: pl.name }, r)))
        .sort((x, y) => (x.at || 0) - (y.at || 0));
    } catch (e) {
      return [];
    }
  };
  /** The current player's rounds replaced (append: the fold; clear: every player's). */
  PlayLog.write = function (list) {
    try {
      if (S()) S().set(PL.NS, { rounds: list });
      else mem.rounds = list;
      return true;
    } catch (e) {
      return false;
    }
  };
  PlayLog.clear = function () {
    try {
      const sv = S();
      if (sv) sv.players().forEach((pl) => sv.set(PL.NS, { rounds: [] }, pl.id));
      mem.rounds = [];
    } catch (e) {
      /* nothing to clear */
    }
  };
  /** Name the stage now running (the host: {mode, game, level}); cleared at its end. */
  PlayLog.meta = (m) => (hook(), (meta = Object.assign({}, meta, m || {})));
  /** A step opens by name (Onboard.stuck does it; a game may too): it is logged as a "step-open" note. */
  PlayLog.step = function (name, o) {
    if (!(o && o.noted)) LCnote("step-open", { step: String(name) });
  };
  /** Fold the stage that just ended into the log (the Lifecycle stage-end hook). Never throws. */
  PlayLog.stageEnd = function () {
    try {
      const L = root.Lifecycle;
      const log = (L && L.log) || [];
      let e = log.length - 1;
      while (e >= 0 && log[e].what !== "stage-end") e--;
      if (e < 0) return null;
      let s = e - 1;
      while (s >= 0 && log[s].what !== "stage-start" && log[s].what !== "stage-end") s--;
      const from = s >= 0 && log[s].what === "stage-start" ? s : s + 1;
      const entries = log.slice(Math.max(0, from), e + 1);
      if (!entries.length) return null;
      const t0 = entries[0].t;
      const started = entries[0].what === "stage-start";
      const m = Object.assign({}, meta);
      // a stage that names only its kind ("cook:station"): the page's own game from its address (cook.html?first=chai)
      if (!m.game && !String(entries[0].reason || "").includes("/")) {
        try {
          const q = new URLSearchParams(root.location.search);
          const g = q.get("game") || q.get("station") || q.get("first");
          if (g) m.game = g;
        } catch (err) {
          /* no address */
        }
      }
      const round = PL.fold(entries, taps.filter((x) => x.t >= t0 && x.t <= log[e].t + 5), m);
      meta = {};
      // only a stage that started (not the gap before an end screen) and that someone played (not a hand-off or a lab boot)
      if (!started || (!round.steps.some((st) => st.acts || st.allTaps) && round.ms < 5000)) return null; // (a stage left idle 5 s or more is kept: a slow step)
      PlayLog.write(PL.append(mine(), round));
      PlayLog.last = round;
      return round;
    } catch (err) {
      return null;
    }
  };
  // the stage-end hook on the page's Lifecycle (js/shared/request-popup.js), again if the page loads a new one (a mode's own copy)
  let hookedOn = null;
  function hook() {
    const L = root.Lifecycle;
    if (!L || !L.onStageEnd || L === hookedOn) return;
    hookedOn = L;
    L.onStageEnd(() => PlayLog.stageEnd());
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hook);
  setTimeout(hook, 0);
  setInterval(hook, 2000);
  PlayLog.hook = hook;
  root.PlayLog = PlayLog;
  Onboard.playLog = PlayLog;
  return Onboard;
});
