/*
 * The window ride (Sprint 9; build/reports/research-trips-2026-10-19.md "the window belt"; story-and-arcs.md "decided 29 Sept:
 * keep it simple, like the clinic's pharmacy belt (the window is the belt)"). A shared engine for every trip: the view out of a
 * car or bus window scrolls by (bands of scenery at their own speeds, a parallax), and things pass along the verge, right to left,
 * like the dishes on the clinic's belt (js/clinic/stages/pharmacy.js, left as it is). Nani names one thing; the child taps it as
 * it passes. Look-alikes pass TOGETHER (a group is k things of one family: animals, doors), and any member of a family may be the
 * one named, so only the word decides (the Kutchi leak test, non-negotiable 6: tapping everything, the first, a position or
 * waiting for the glow scores nothing). A 'stop the car!' beat: the view eases to a stop for a thing in the road, Nani calls it,
 * it crosses, the view goes on.
 *
 * No Kutchi, no English and no look in here: what passes, its picture, the bands, the speeds and the levels are the trip's data
 * (data/day.json `window.rides`), what is said is the host's (its language engine and voice queue), and the look is css/day.css.
 *
 *   const plan = WindowRide.plan(ride, level, rng, { callable })   -> {calls: [{group: [thingId], named, at}], stopAfter, ...}
 *                callable(thingId) -> false: a thing the engine can't say yet is never named (it may still pass as scenery)
 *   WindowRide.simulate(plan, strategy, rng) -> {right, helped, missed, calls, won}   the pure rules, for the bots (no DOM)
 *   WindowRide.STRATEGIES   the blind players: fair (hears the word), tap-all, tap-first, tap-last, random, middle, wait (the glow)
 *   const ride = WindowRide.mount(el, { ride, plan, url(path), shape(thing, def) -> svg, say(i, call) -> Promise,
 *                                       sayStop() -> Promise, onTap({call, thing, ok, first}), onCall(i, call),
 *                                       onResult(i, outcome), onEnd(result), speed, hintMs })
 *     ride.start()  ride.stop()  ride.expect() -> {kind: "tap", sel, call} | {kind: "wait"}   ride.state()   ride.el
 *
 * Scoring (the same in mount and simulate): a call is RIGHT when the first tap on its group is the named thing, before any help;
 * HELPED when the named one was tapped after a wrong tap or after the glow (hintMs after the call, E16: a glow only after a wrong
 * tap or a hesitation); MISSED when the group passed with no tap on the named one (it comes round once more, glowing, and is
 * then helped or missed; nobody loses, as on the clinic's belt). A wrong tap is never marked on the spot (no red, no buzz: E10).
 *
 * Plain <script>: window.WindowRide (and Shared.windowRide); Node: require() gives plan, simulate and STRATEGIES.
 */
(function (root, factory) {
  const W = factory(root);
  if (typeof module === "object" && module.exports) module.exports = W;
  else {
    root.WindowRide = W;
    (root.Shared = root.Shared || {}).windowRide = W;
  }
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";
  const W = {};
  const SCENE = { w: 1600, h: 900 };

  /* ---------------- the plan (pure) ---------------- */
  const shuffle = (a, rng) => {
    const out = a.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  /** The level's settings: the asked level if the ride has it, else the nearest below. */
  W.levelOf = function (ride, level) {
    const ls = Object.keys(ride.levels || {}).map(Number).sort((a, b) => a - b);
    const n = Number(level) || ls[0];
    const at = ls.filter((l) => l <= n).pop() || ls[0];
    return Object.assign({ level: at }, ride.levels[at]);
  };

  /**
   * The round: `calls` groups, each k look-alikes of one family in a random order, one of them named. A family is used only
   * with at least two callable members (one alone would be the answer by sight). Families take turns as evenly as the calls
   * allow; the named thing is never the same twice running.
   */
  W.plan = function (ride, level, rng = Math.random, { callable = () => true } = {}) {
    const L = W.levelOf(ride, level);
    const things = ride.things || {};
    const fam = {};
    Object.entries(things).forEach(([id, t]) => {
      if (t.scenery || !t.family || !callable(id)) return;
      (fam[t.family] = fam[t.family] || []).push(id);
    });
    const families = Object.keys(fam).filter((f) => fam[f].length >= 2);
    if (!families.length) return { level: L.level, calls: [], stopAfter: -1, crossMs: L.crossMs, gapMs: L.gapMs, card: L.card };
    // the families, weighted by size (more members, more groups), spread over the calls
    const bag = [];
    families.forEach((f) => fam[f].forEach(() => bag.push(f)));
    const calls = [];
    let last = null;
    for (let i = 0; i < L.calls; i++) {
      const f = bag[Math.floor(rng() * bag.length)];
      const k = Math.min(L.group || 3, fam[f].length);
      let group = shuffle(fam[f], rng).slice(0, k);
      // the named one: any member (so no member is safe to ignore), not the last call's thing
      const pool = group.filter((g) => g !== last);
      const named = (pool.length ? pool : group)[Math.floor(rng() * (pool.length ? pool.length : group.length))];
      if (!group.includes(named)) group = group.concat([named]);
      group = shuffle(group, rng);
      calls.push({ group, named, family: f });
      last = named;
    }
    const stop = ride.stopCar && things[ride.stopCar.thing] ? Math.max(0, Math.floor(L.calls / 2) - 1) : -1;
    return { level: L.level, calls, stopAfter: stop, crossMs: L.crossMs, gapMs: L.gapMs, card: L.card || "open" };
  };

  /* ---------------- the rules, without a screen (the bots) ---------------- */
  /**
   * A strategy sees what a player sees: the group's members in the order they come into view (right to left: the first in
   * the list enters first), the glow when it shows, and (only the fair player) the word heard. It returns its taps in order:
   * [{at: "before" | "glow", i}] (i: the member's index). The rules then score the call as mount() does.
   */
  W.STRATEGIES = {
    fair: (c) => [{ at: "before", i: c.group.indexOf(c.named) }],
    "tap-all": (c) => c.group.map((_, i) => ({ at: "before", i })),
    "tap-first": () => [{ at: "before", i: 0 }],
    "tap-last": (c) => [{ at: "before", i: c.group.length - 1 }],
    middle: (c) => [{ at: "before", i: Math.floor(c.group.length / 2) }],
    random: (c, rng) => [{ at: "before", i: Math.floor(rng() * c.group.length) }],
    wait: (c) => [{ at: "glow", i: c.group.indexOf(c.named) }],
  };
  /** The blind ones (every strategy but fair): none may win more than 10% of rounds (non-negotiable 6). */
  W.BLIND = ["tap-all", "tap-first", "tap-last", "middle", "random", "wait"];

  /** One call's outcome from its taps (the order the player made them). */
  W.judge = function (call, taps) {
    let wrong = false;
    for (const t of taps) {
      const id = call.group[t.i];
      if (id === call.named) return t.at === "glow" || wrong ? "helped" : "right";
      wrong = true;
    }
    return "missed";
  };

  W.simulate = function (plan, strategy, rng = Math.random) {
    const f = typeof strategy === "function" ? strategy : W.STRATEGIES[strategy];
    const out = { right: 0, helped: 0, missed: 0, calls: plan.calls.length };
    plan.calls.forEach((c) => (out[W.judge(c, f(c, rng) || [])] += 1));
    out.won = out.calls > 0 && out.right === out.calls;
    return out;
  };

  /* ---------------- the screen ---------------- */
  const svgNS = "http://www.w3.org/2000/svg";
  /** Placeholder shapes (data `shapes`, scene px) as one svg: rect (r), circle, ellipse, poly; `a` is the opacity. */
  W.shapesSvg = function (shapes, w, h, cls) {
    const doc = root.document;
    const s = doc.createElementNS(svgNS, "svg");
    s.setAttribute("viewBox", `0 0 ${w} ${h}`);
    s.setAttribute("width", w);
    s.setAttribute("height", h);
    s.setAttribute("aria-hidden", "true");
    if (cls) s.setAttribute("class", cls);
    (shapes || []).forEach((p) => {
      let e;
      if (p.t === "rect") {
        e = doc.createElementNS(svgNS, "rect");
        ["x", "y", "w", "h"].forEach((k) => e.setAttribute(k === "w" ? "width" : k === "h" ? "height" : k, p[k]));
        if (p.r) e.setAttribute("rx", p.r);
      } else if (p.t === "circle") {
        e = doc.createElementNS(svgNS, "circle");
        e.setAttribute("cx", p.cx);
        e.setAttribute("cy", p.cy);
        e.setAttribute("r", p.r);
      } else if (p.t === "ellipse") {
        e = doc.createElementNS(svgNS, "ellipse");
        ["cx", "cy", "rx", "ry"].forEach((k) => e.setAttribute(k, p[k]));
      } else if (p.t === "poly") {
        e = doc.createElementNS(svgNS, "polygon");
        e.setAttribute("points", (p.pts || []).map((q) => q.join(",")).join(" "));
      } else return;
      e.setAttribute("fill", p.fill || "currentColor");
      if (p.a != null) e.setAttribute("fill-opacity", p.a);
      if (p.id) e.setAttribute("data-id", p.id);
      s.appendChild(e);
    });
    return s;
  };

  /** A thing's placeholder picture (no text): an animal, a bird, a door, a tree, in its data colour. */
  W.placeholder = function (def) {
    const c = def.fill || "#888888";
    const S = {
      animal: [{ t: "ellipse", cx: 100, cy: 110, rx: 70, ry: 38, fill: c }, { t: "circle", cx: 168, cy: 78, r: 26, fill: c }, { t: "rect", x: 52, y: 130, w: 14, h: 58, r: 6, fill: c }, { t: "rect", x: 132, y: 130, w: 14, h: 58, r: 6, fill: c }, { t: "poly", pts: [[160, 60], [176, 36], [184, 62]], fill: c }, { t: "circle", cx: 176, cy: 74, r: 4, fill: "#2a2522" }],
      bird: [{ t: "ellipse", cx: 100, cy: 120, rx: 52, ry: 34, fill: c }, { t: "circle", cx: 146, cy: 96, r: 22, fill: c }, { t: "poly", pts: [[166, 96], [190, 102], [166, 106]], fill: "#e0a63a" }, { t: "poly", pts: [[60, 110], [20, 90], [40, 130]], fill: c }, { t: "circle", cx: 150, cy: 92, r: 4, fill: "#2a2522" }, { t: "rect", x: 92, y: 150, w: 6, h: 40, fill: "#7a6857" }, { t: "rect", x: 110, y: 150, w: 6, h: 40, fill: "#7a6857" }],
      door: [{ t: "rect", x: 20, y: 0, w: 160, h: 200, r: 10, fill: "#e8c9a0" }, { t: "rect", x: 44, y: 24, w: 112, h: 176, r: 56, fill: c }, { t: "circle", cx: 138, cy: 120, r: 7, fill: "#d9a441" }],
      tree: [{ t: "rect", x: 88, y: 110, w: 24, h: 90, fill: "#7a5233" }, { t: "circle", cx: 100, cy: 80, r: 70, fill: c }, { t: "circle", cx: 60, cy: 100, r: 44, fill: c }, { t: "circle", cx: 142, cy: 100, r: 44, fill: c }],
    };
    return W.shapesSvg(S[def.shape] || S.animal, 200, 200, "wr-ph");
  };

  W.mount = function (el, o) {
    const doc = root.document;
    const ride = o.ride;
    const plan = o.plan;
    const view = ride.view || {};
    const url = o.url || ((p) => p);
    const raf = root.requestAnimationFrame ? root.requestAnimationFrame.bind(root) : (f) => setTimeout(() => f(Date.now()), 16);
    const caf = root.cancelAnimationFrame ? root.cancelAnimationFrame.bind(root) : clearTimeout;
    const speed = o.speed || 1;
    const hintMs = o.hintMs != null ? o.hintMs : ride.hintMs || 5000;
    const h = (tag, cls, parent) => {
      const e = doc.createElement(tag);
      if (cls) e.className = cls;
      if (parent) parent.appendChild(e);
      return e;
    };

    // the window: a 1600x900 scene, scaled to cover the view (cropped at the sides, never stretched)
    const win = h("div", "wr-window", el);
    const scene = h("div", "wr-scene", win);
    scene.style.width = `${SCENE.w}px`;
    scene.style.height = `${SCENE.h}px`;
    const fit = () => {
      const W0 = win.clientWidth || 1;
      const H0 = win.clientHeight || 1;
      const s = Math.max(W0 / SCENE.w, H0 / SCENE.h);
      scene.style.transform = `translate(${((W0 - SCENE.w * s) / 2).toFixed(1)}px, ${(H0 - SCENE.h * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
      fit.s = s;
    };
    fit.s = 1;
    const sky = h("div", "wr-sky", scene);
    if (o.sky) o.sky(sky);
    // the bands: each a strip of two tiles of its shapes (or its art), moved by its own share of the scroll
    const bands = (view.bands || []).map((b) => {
      const strip = h("div", "wr-band", scene);
      strip.dataset.band = b.id;
      Object.assign(strip.style, { top: `${b.y}px`, height: `${b.h}px`, width: `${(b.tile || 900) * Math.ceil(SCENE.w / (b.tile || 900) + 1)}px` });
      const n = Math.ceil(SCENE.w / (b.tile || 900) + 1);
      for (let i = 0; i < n; i++) {
        const tile = h("div", "wr-tile", strip);
        Object.assign(tile.style, { left: `${i * (b.tile || 900)}px`, width: `${b.tile || 900}px`, height: `${b.h}px` });
        if (b.art) {
          const im = h("img", "", tile);
          im.alt = "";
          im.src = url(b.art);
        } else tile.appendChild(W.shapesSvg(b.shapes, b.tile || 900, b.h));
      }
      return { b, strip };
    });
    const back = h("div", "wr-lane wr-back", scene);
    const lane = h("div", "wr-lane", scene);
    const frame = h("div", "wr-frame", win);
    if (view.frame && view.frame.art) {
      const im = h("img", "", frame);
      im.alt = "";
      im.src = url(view.frame.art);
    }

    // ---- the things ----
    const things = ride.things || {};
    const itemH = view.itemH || 220;
    const baseY = view.itemY || 760;
    const crossMs = plan.crossMs || 6000;
    const pxPerMs = (SCENE.w + 400) / crossMs;
    const make = (id, cls) => {
      const def = things[id] || {};
      const b = h("button", `wr-thing ${cls || ""}`, lane);
      b.type = "button";
      b.dataset.thing = id;
      b.setAttribute("aria-label", "");
      const H = itemH * (def.h || 1);
      Object.assign(b.style, { height: `${H}px`, width: `${H}px`, top: `${baseY - H}px` });
      if (def.art) {
        const im = h("img", "", b);
        im.alt = "";
        im.src = url(def.art);
        im.draggable = false;
      } else b.appendChild(o.shape ? o.shape(id, def) : W.placeholder(def));
      h("i", "wr-contact", b);
      return { b, id, w: H, x: SCENE.w + 40 };
    };

    // the schedule: group i enters at t_i (gapMs between the end of one group and the next; scenery fills the gaps)
    const st = { t: 0, scroll: 0, vel: 1, items: [], call: -1, phase: "idle", outcome: [], done: false, stopped: false, hints: 0 };
    // one group at a time, like the belt's one prescription: the next comes on gapMs after the one before is settled (and after
    // the stop beat), so a call never overlaps another and a group that comes round again has the road to itself
    const plans = plan.calls.map((c, i) => ({ i, call: c, members: [], said: false, taps: [], glow: false, again: false, result: null, firstAt: null }));
    let nextEnter = 600;
    const sceneryIds = (ride.scenery || []).filter((id) => things[id]);
    // a group's members side by side with a gap between them (each as wide as it is drawn)
    const lineUp = (g) => {
      let x = SCENE.w + 40;
      g.members.forEach((m) => {
        m.x = x;
        x += m.w + itemH * 0.25;
      });
    };
    const spawnGroup = (g) => {
      g.members = g.call.group.map((id) => {
        const m = make(id, "wr-member");
        m.b.dataset.call = String(g.i);
        m.g = g;
        m.b.addEventListener("pointerdown", (ev) => {
          ev.preventDefault();
          tap(g, m);
        });
        st.items.push(m);
        return m;
      });
      lineUp(g);
      g.firstAt = st.t;
    };
    // scenery (a tree) passes behind the lane, a little further off: never tapped, never named
    const rnd = o.rng || Math.random;
    const spawnScenery = () => {
      if (!sceneryIds.length) return;
      const id = sceneryIds[Math.floor(rnd() * sceneryIds.length)];
      const def = things[id] || {};
      const d = h("div", "wr-scenery", back);
      d.dataset.thing = id;
      const H = itemH * (def.h || 1) * 0.8;
      Object.assign(d.style, { height: `${H}px`, width: `${H}px`, top: `${baseY - 70 - H}px` });
      if (def.art) {
        const im = h("img", "", d);
        im.alt = "";
        im.src = url(def.art);
      } else d.appendChild(o.shape ? o.shape(id, def) : W.placeholder(def));
      st.items.push({ b: d, id, w: H, x: SCENE.w + 40, scenery: true });
    };
    const groupGone = (g) => g.members.length && g.members.every((m) => m.x + m.w < -20);

    function tap(g, m) {
      if (st.done || g.result) return;
      const ok = m.id === g.call.named;
      const first = !g.taps.length;
      g.taps.push(m.id);
      if (o.onTap) o.onTap({ call: g.i, thing: m.id, ok, first, glow: g.glow });
      if (!ok) {
        // no red, no buzz (E10): the one named glows from now (E16: a glow after a wrong tap)
        m.b.classList.remove("wr-nudge");
        void m.b.offsetWidth;
        m.b.classList.add("wr-nudge");
        setGlow(g, true);
        return;
      }
      const res = !g.wrongOrHelp && !g.glow && g.taps.length === 1 ? "right" : "helped";
      finish(g, res, m);
    }
    function setGlow(g, on) {
      if (on && !g.glow) st.hints++;
      g.glow = on;
      g.wrongOrHelp = g.wrongOrHelp || on;
      // the one shared glow (css/shared/focus.css: a centred pulse, F17), on the named thing only
      g.members.forEach((m) => {
        const lit = on && m.id === g.call.named;
        m.b.classList.toggle("wr-glow", lit);
        m.b.classList.toggle("njg-pulse", lit);
      });
    }
    function finish(g, res, m) {
      g.result = res;
      st.outcome[g.i] = res;
      setGlow(g, false);
      if (m) {
        m.b.classList.add("wr-got");
        m.got = true;
      }
      g.members.forEach((x) => (x.b.disabled = true));
      nextEnter = (st.ride || 0) + (plan.gapMs || 1800);
      if (o.onResult) o.onResult(g.i, res);
      if (plans.every((p) => p.result)) end();
    }
    function end() {
      if (st.done) return;
      st.done = true;
      const r = { right: st.outcome.filter((x) => x === "right").length, helped: st.outcome.filter((x) => x === "helped").length, missed: st.outcome.filter((x) => x === "missed").length, calls: plans.length, outcome: st.outcome.slice(), hints: st.hints };
      r.won = r.calls > 0 && r.right === r.calls;
      setTimeout(() => o.onEnd && o.onEnd(r), 500 / speed);
    }

    // ---- the stop-the-car beat: a thing stands in the road ahead; as it comes into the middle of the window Nani calls
    // out, the view eases to a stop, it crosses the road (towards us and out of sight), and the view goes on ----
    let stopBeat = null;
    const startStop = () => {
      const sc = ride.stopCar;
      const m = make(sc.thing, "wr-crossing");
      m.b.tabIndex = -1;
      m.b.disabled = true;
      m.b.style.top = `${baseY + 60 - itemH}px`;
      st.items.push(m);
      stopBeat = { m, t0: null, phase: "approach" };
    };

    // ---- the clock ----
    let last = null;
    let rafId = 0;
    let nextScenery = 0;
    const step = (now) => {
      if (st.stopped) return;
      if (last == null) last = now;
      const dt = Math.min(100, now - last) * speed;
      last = now;
      st.t += dt;
      // the stop beat: ease the velocity down, hold, then up again
      if (stopBeat && stopBeat.phase === "approach" && stopBeat.m.x + stopBeat.m.w / 2 < SCENE.w * 0.6) {
        stopBeat.phase = "stop";
        stopBeat.t0 = st.t;
        st.phase = "stopping";
        if (o.sayStop) o.sayStop();
      }
      if (stopBeat && stopBeat.phase === "stop") {
        const k = (st.t - stopBeat.t0) / 1000;
        const hold = (ride.stopCar.holdMs || 2400) / 1000;
        if (k < 0.9) st.vel = Math.max(0, 1 - k / 0.9);
        else if (k < 0.9 + hold) {
          st.vel = 0;
          stopBeat.m.cross = true;
          // the thing crosses the road towards us (down and a little bigger) and goes out of sight
          const f = (k - 0.9) / hold;
          stopBeat.m.b.style.transform = `translateY(${(f * 260).toFixed(1)}px) scale(${(1 + f * 0.15).toFixed(3)})`;
          stopBeat.m.b.style.opacity = f > 0.8 ? String(Math.max(0, (1 - f) / 0.2)) : "1";
        } else if (k < 1.8 + hold) st.vel = Math.min(1, (k - 0.9 - hold) / 0.9);
        else {
          st.vel = 1;
          stopBeat.m.b.remove();
          st.items = st.items.filter((x) => x !== stopBeat.m);
          stopBeat = null;
          st.phase = "ride";
        }
      }
      const dx = dt * pxPerMs * st.vel;
      st.scroll += dx;
      bands.forEach(({ b, strip }) => {
        const tile = b.tile || 900;
        strip.style.transform = `translateX(${(-((st.scroll * (b.speed || 1)) % tile)).toFixed(1)}px)`;
      });
      // groups come on at their time (counted on the ride's own clock, which stands still while the car stops)
      st.ride = (st.ride || 0) + dt * st.vel;
      const due = plans.find((g) => !g.members.length);
      if (due && st.ride >= nextEnter && !stopBeat && (due.i === 0 || plans[due.i - 1].result) && !(plan.stopAfter === due.i - 1 && !st.stopDone)) spawnGroup(due);
      if (st.ride >= nextScenery && !st.done) {
        spawnScenery();
        nextScenery = st.ride + (plan.gapMs || 1800) * 1.6 + Math.random() * 900;
      }
      st.items.forEach((m) => {
        if (m.cross) return;
        m.x -= dx;
        m.b.style.left = `${m.x.toFixed(1)}px`;
      });
      // calls: said when the group's first member has come a little way in (callAt of the width)
      plans.forEach((g) => {
        if (!g.members.length || g.said || g.result) return;
        const lead = Math.min(...g.members.map((m) => m.x));
        if (lead < SCENE.w * (1 - (ride.callAt || 0.18))) {
          g.said = true;
          g.saidAt = st.t;
          st.call = g.i;
          if (o.onCall) o.onCall(g.i, g.call);
          if (o.say) o.say(g.i, g.call);
        }
        return;
      });
      // the glow after a hesitation (hintMs after the call, E16)
      plans.forEach((g) => {
        if (g.said && !g.result && !g.glow && st.t - g.saidAt >= hintMs) setGlow(g, true);
      });
      // a group gone by: once more round, glowing; after that, missed
      plans.forEach((g) => {
        if (!g.result && groupGone(g)) {
          if (!g.again) {
            g.again = true;
            lineUp(g);
            // she names it again as it comes round (glowing)
            g.said = false;
            setGlow(g, true);
          } else finish(g, "missed", null);
        }
      });
      // the stop beat comes after its call is done
      if (plan.stopAfter >= 0 && !st.stopDone && plans[plan.stopAfter] && plans[plan.stopAfter].result && !stopBeat) {
        st.stopDone = true;
        startStop();
      }
      // things gone by leave the lane
      st.items = st.items.filter((m) => {
        if (m.cross || m.x + m.w > -40) return true;
        if (!m.g || m.g.result) m.b.remove();
        return !!(m.g && !m.g.result);
      });
      rafId = raf(step);
    };

    const api = {
      el: win,
      plan,
      start() {
        fit();
        if (root.addEventListener) root.addEventListener("resize", fit);
        st.phase = "ride";
        rafId = raf(step);
      },
      stop() {
        st.stopped = true;
        caf(rafId);
        if (root.removeEventListener) root.removeEventListener("resize", fit);
      },
      state: () => (st.done ? "end" : stopBeat && stopBeat.phase === "stop" ? "stop" : st.phase),
      result: () => st.outcome.slice(),
      /** what the ride wants now (window.njgTest): the named thing to tap once it has been said and is on screen */
      expect() {
        if (st.done) return { kind: "end" };
        const g = plans.find((p) => p.said && !p.result);
        if (!g) return { kind: "wait" };
        const m = g.members.find((x) => x.id === g.call.named);
        if (!m) return { kind: "wait" };
        // on screen: its middle inside the window (a tap there lands on it)
        const r = m.b.getBoundingClientRect();
        const wr = win.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        if (cx < wr.left + 24 || cx > wr.right - 24) return { kind: "wait" };
        return { kind: "tap", sel: `.wr-member[data-call="${g.i}"][data-thing="${g.call.named}"]`, call: g.i, thing: g.call.named, others: g.members.filter((x) => x !== m).map((x) => x.id) };
      },
      _st: st,
    };
    return api;
  };

  return W;
});
