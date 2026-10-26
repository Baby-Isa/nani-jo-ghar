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
  const GESTURES = ["tap", "drag", "hold", "swipe", "circle-stir"];
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
        if (n.ghost && n.ghost.gesture === "drag" && !n.ghost.to) out.push(`step ${i}: a drag needs ghost.to`);
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
    }
    return k;
  };
  /*
   * ONE LOOK FOR HELP IN EVERY GAME (Sprint 12; Zafar, 22 Oct: EASY-08, SH-118, SH-119). Onboard.run (a script) and
   * Onboard.spot (the stuck spotlight) draw the same thing:
   *   the dim       Onboard.DIM over everything (one token: a little darker than the old 0.62, SH-118);
   *   the box       ONE rounded rectangle with a plain gold edge (no glow of its own, no pulse) round the target, or round all
   *                 of the targets given together (a group: the eye test's haa, na and the mic), hugging them (Onboard.groupBox);
   *   the item      inside the box the item itself glows (its own soft radiating glow) and bounces: an HTML control by the
   *                 class ob-lit (css/shared/onboard.css), a canvas thing by its game (o.light / o.move) or the kit's soft ring;
   *   the finger    the kit's one drawn hand (Onboard.finger), tapping in one cadence: in, press, lift off, wait half a second,
   *                 again, for as long as the help is up (Onboard.FINGER).
   */
  Onboard.DIM = 0.72;
  /** The lit thing's hop, a share of its own height (the judge, 23 Oct: a clear hop up and back, not a dip): every game. */
  Onboard.HOP = 0.1;
  Onboard.dimFill = () => `rgba(30,18,10,${Onboard.DIM})`;
  /**
   * EASY-08 (Sprint 11): the light hugs the control's own box: a rounded rect with a small, even pad, never an oval that spills
   * over its neighbours. When two lit things, or a thing and a neighbour to keep dark (avoid), are close, the pad shrinks to
   * half the gap between them (down to 0) rather than light the neighbour.
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
      return { x: r.x - p, y: r.y - p, w, h, r: Math.min(12, w / 2, h / 2), pad: p };
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
  const listOf = (t) => (Array.isArray(t) && !(t.length === 4 && t.every((n) => typeof n === "number")) ? t : [t]);
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
   */
  Onboard.finger = function (at, o) {
    o = o || {};
    const host = o.container || document.body;
    const el = document.createElement("div");
    el.className = "ob-finger";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<div class="ob-finger-in"><span class="ob-ripple"></span>${HAND}</div>`;
    if (!o.container) el.classList.add("page");
    // where the hand lies (o.from): above (pointing down), below (pointing up), right or left of the point (pointing across)
    const from = o.from || (o.down ? "above" : "below");
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
    const place = () => {
      if (stopped) return;
      const p = pointOf();
      el.style.display = p ? "" : "none";
      if (p) {
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
      const frames = keys.map((kf) => ({ offset: kf.o, transform: `translate(${kf.x}px, ${kf.y}px) scale(${kf.press ? 0.88 : 1})` }));
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
      },
    };
  };

  /*
   * The light (EASY-08, one look): the dim with ONE rounded hole round the target(s) (Onboard.groupBox), the plain gold box on
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
      const els = targets.map(litOf);
      litEls.filter((e) => !els.includes(e)).forEach((e) => e.classList.remove("ob-lit"));
      els.forEach((e) => e.classList.add("ob-lit"));
      litEls = els.slice();
    };
    return {
      /** rects: the targets' boxes; o: {avoid, pad, rings: the canvas things' boxes to ring, els: the HTML controls}. -> the box */
      draw(rects, o) {
        o = o || {};
        let b = rects.length ? Onboard.groupBox(rects, o.avoid, o.pad) : null;
        // the box is always whole on the screen (S12 W2-A, the judge: the pantry jar's box touched the top edge at 915x412)
        if (b) {
          const m = 3;
          const W = root.innerWidth || 1e4;
          const H = root.innerHeight || 1e4;
          const x = Math.max(m, b.x);
          const y = Math.max(m, b.y);
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
    if (prefer && prefer !== "auto") {
      const a = footOf(prefer, tipOf(r, prefer));
      if (a && a.x >= 0 && a.y >= 0 && a.x + a.w <= W && a.y + a.h <= H) return prefer;
    }
    return order.find(fits) || prefer || "above";
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
    layer.className = "njg-onboard";
    const sid = `ob${String(id).replace(/[^\w-]/g, "-")}`;
    // (opts.hand, a picture hand, is gone: one finger in every game, SH-119)
    layer.innerHTML = `${lightSvg(sid)}<div class="ob-ghost" aria-hidden="true"><span class="ob-ripple"></span>${HAND}</div>${opts.skipButton ? SKIP_HTML : ""}`;
    host.appendChild(layer);
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

    // keep the light on its targets (things move, the page resizes)
    const draw = () => {
      const st = m.state().step;
      const sp = st ? split(st.spotlight) : { els: [], rects: [], canvas: [] };
      lit = sp.rects;
      // (no ring round a canvas thing: Zafar disliked a round glow in the square box; the thing glows by its game)
      light.draw(sp.rects, { rings: [], els: sp.els });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

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
    const playGhost = () => {
      const s = m.state();
      const st = s.step;
      if (!st || !st.ghost) return;
      const spot = union(rectsOf(st.spotlight));
      const fromR = st.ghost.from ? union(rectsOf(st.ghost.from)) : spot;
      const toR = st.ghost.to ? union(rectsOf(st.ghost.to)) : null;
      if (!fromR) {
        m.ghostDone();
        return armIdle();
      }
      const box = (r) => (r ? { left: r.x, top: r.y, width: r.w, height: r.h } : null);
      LCghost(`${id}#${s.index}`, { id, index: s.index, gesture: st.ghost.gesture, replay: s.replays, from: box(fromR), to: box(toR) });
      if (st.ghost.gesture === "tap") {
        // SH-119: a tap is the one finger, tapping in its cadence until the step is done (no gap, no replay)
        const from = Onboard.fingerFrom(st.spotlight, st.ghost.down || opts.fingerDown ? "above" : "auto");
        if (!finger) finger = Onboard.finger(() => tipOf(union(rectsOf(st.spotlight)), from), { container: layer, from });
        setTimeout(() => {
          if (m.state().phase === "show" && m.state().index === s.index) m.ghostDone();
        }, Onboard.fingerMs());
        return;
      }
      const keys = Onboard.path(st.ghost.gesture, centre(fromR), centre(toR), fromR);
      const dur = st.ghost.ms || DUR[st.ghost.gesture];
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
      layer.dataset.step = s.index;
      if (typeof opts.onStep === "function") opts.onStep(s.step, s.index);
      playAudio(s.step, s.index);
      if (s.phase === "show") playGhost();
      else armIdle();
    };
    const advanced = () => {
      clearTimeout(idleTimer);
      if (anim) anim.cancel();
      stopFinger();
      ghost.classList.remove("on", "pressed");
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
    const allowed = (e) => skipBtn.contains(e.target) || (!layer.classList.contains("between") && onLight(e));
    // (C4: a script whose steps are all done blocks nothing while its layer fades: the breath after the last step
    // swallowed the next press, daar's stir)
    const over = () => ["done", "skipped"].includes(m.state().phase);
    const block = (e) => {
      if (skipBtn.contains(e.target) || pass(e) || over()) return;
      // (C4: the breath between steps never swallows a press on the lit thing: the game gets it (E5, input is live);
      // only the coach's own step count waits for the breath to end, in up())
      if (!onLight(e)) {
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
      clearTimeout(idleTimer);
      if (anim) anim.cancel();
      stopFinger();
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
    layer.className = "njg-onboard njg-spot";
    layer.innerHTML = lightSvg(sid);
    (o.container || document.body).appendChild(layer);
    requestAnimationFrame(() => layer.classList.add("on"));
    const light = lightOf(layer);
    const bounce = bouncer(o.move, () => (rectsOf(target)[0] || {}).h);
    if (typeof o.light === "function") o.light(true);
    let raf = 0;
    let shown = null;
    const draw = () => {
      const sp = split(target);
      shown = light.draw(sp.rects, { avoid: o.avoid ? rectsOf(o.avoid) : null, pad: o.pad, rings: [], els: sp.els });
      if (!sp.els.length) bounce.tick();
      raf = requestAnimationFrame(draw);
    };
    draw();
    const firstRect = () => rectsOf(target)[0] || null;
    // (a game that names the finger's point, o.item, keeps its hand as it was: from above with fingerDown, else below)
    const from = o.item ? (o.fingerDown ? "above" : "below") : Onboard.fingerFrom(target, o.fingerDown ? "above" : "auto");
    const finger = o.finger === false ? null : Onboard.finger(() => (isPoint(o.item) ? o.item : (typeof o.item === "function" && o.item()) || tipOf(firstRect(), from)), { container: layer, step: o.step, from });
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
      if (liveRects().some((r) => on(pt(e), r))) return;
      if (e.type === "pointerdown") dark.add(e.pointerId != null ? e.pointerId : "t");
      if (e.type === "touchstart") dark.add("t");
      e.stopPropagation();
      e.preventDefault();
    };
    const EV = ["pointerdown", "mousedown", "touchstart", "click", "dblclick", "contextmenu", "pointerup", "pointercancel", "touchend"];
    EV.forEach((t) => root.addEventListener(t, block, { capture: true, passive: false }));
    let closed = false;
    return {
      layer,
      box: () => shown,
      close() {
        if (closed) return;
        closed = true;
        cancelAnimationFrame(raf);
        if (finger) finger.stop();
        bounce.stop();
        light.clear();
        if (typeof o.light === "function") o.light(false);
        EV.forEach((t) => root.removeEventListener(t, block, { capture: true }));
        layer.classList.remove("on");
        setTimeout(() => layer.remove(), reduced() ? 0 : 300);
      },
    };
  };

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
  Onboard.RUNGS = [0, 5000, 15000];
  /**
   * The hint rungs for one step (principle 3), on the shared idle clock:
   *   at[0]   the first time this step appears for this child (once per profile per o.id, default "stuck/<step>"; a New player:
   *           once per visit): the spotlight on the real item at once (EASY-03: no demo; the box, the item glowing, the finger);
   *   glowAt  (optional; CHAI-32) idle this long: o.glow(true), the game's own light help (its call-out card, the item glowing
   *           and bouncing): no dim, no box;
   *   at[1]   idle this long: the spotlight (o.glow(false) first: never the call-out and the heavy dim together);
   *   at[2]   idle this long: the guide's line (o.line()). null leaves a rung out.
   * After an action the clock runs again and so can the rungs (the spotlight and the call-out go). It never does the step.
   *   o: {target (the live control), item (the finger's point), live, avoid, pad, light, move, line, glow, glowAt, at, first, id}
   *   -> {done(), stop(), rung}   done() when the step is complete (the spotlight goes); the stage's end stops it too
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
    const h = { rung: 0 };
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
      if (!spot && o.target) spot = Onboard.spot(o.target, { live: o.live, avoid: o.avoid, pad: o.pad, item: o.item, light: o.light, move: drag ? null : o.move, finger: drag ? false : undefined, fingerDown: o.fingerDown, step: name });
    };
    const closeSpot = () => {
      if (spot) spot.close();
      spot = null;
    };
    const end = () => {
      if (h.over) return;
      h.over = true;
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
        // the child did something: the rungs start again from now, and the help goes
        if (lastAct != null) {
          fired = {};
          closeSpot();
          glow(false);
        }
        lastAct = la;
      }
      // (the rungs count from the child's last action or the step opening, whichever is later: a step that opens after a long
      // read-out is not a child who has been stuck all that time)
      const idle = Math.min(idleMs(), Date.now() - opened);
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
    return h;
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
