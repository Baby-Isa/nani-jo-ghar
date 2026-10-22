/*
 * The window ride (Sprint 9; s09-ride, Zafar 19-20 Oct, docs/sprints/S09-a-day-at-nanis.md). A shared engine for every trip: the
 * view out of a car (or bus) window, its frame round the edge of the screen, the road going by behind it.
 *
 *   The view: three looping layers per trip from data (far, middle, near), each at its own speed (about 0.15, 0.4 and 1), over
 *   the day's sky. A layer is one picture (or placeholder shapes) laid end to end; each copy fades in over the outer tenth of
 *   the one before it (a soft cross-fade), so no seam or jump shows at any speed. Code never keys colours: the art comes keyed.
 *   Things stand on two ground lines placed by code: the near verge (bigger, moving with the near layer) and the field behind
 *   (smaller, moving with the middle layer, its feet under the verge's top edge). Cut-out props (a bush, a haystack, a wall, a
 *   tree) stand on the near line in front of everything and can half-hide a thing. Unasked things pass between the groups.
 *   The car never stops (no stop-the-car beat, Zafar, 20 Oct): three speeds, normal from the start; Nani says speed up or slow
 *   down and the whole view and every thing on it eases to the new speed over about a second. A thing crosses the window in
 *   about 13.5 s (slow), 9 s (normal) and 5 s (fast; RIDE-03, Zafar 22 Oct: half as slow again), scaled by the window's own
 *   width, so every screen gets the same time.
 *
 *   The game: look-alikes come by together (a group is k things of one family: animals, doors) and any member may be the one
 *   named, so only the word decides (the Kutchi leak test, non-negotiable 6). The first groups of a level (its `distinct`) are
 *   things that look nothing alike (each thing's data `look`: a hen and a bird are both birds; RIDE-03, Zafar: "in the beginning
 *   of the game there's some big variations"). The three to find are all on the card (RIDE-09, Zafar 22 Oct): any of them,
 *   tapped wherever it shows (in another's group, passing by), is found, in any order; the groups still come in the card's
 *   order, one at a time, for the first not yet found. Nani asks as the group comes into view, when
 *   every member is at least about half in view and the first of them has not yet crossed the middle (never as it leaves;
 *   never for a hidden thing: contracts 47 and 48). The child taps it as it passes. A thing asked for and missed comes round
 *   again, with new look-alikes, until it is found (Zafar, 20 Oct: was once). A glow helps after a wrong tap or about 5 s of
 *   hesitation (E16), counted from the first time it was asked. A wrong tap is never marked (no red, no buzz: E10).
 *
 * No Kutchi, no English and no picture in here: what passes, its picture, the layers, props, speeds and levels are the trip's
 * data (data/day.json `window.rides`); what is said is the host's (its language engine and voice queue).
 *
 *   const plan = WindowRide.plan(ride, level, rng, { callable })   -> {calls: [{group, named, family, line}], speeds, ...}
 *   const m = WindowRide.model(ride, plan, { rng, hintMs, hold, view: {x0, x1, minPx} })   the rules and the motion, no DOM
 *     m.step(dt)  m.tap(uid)  m.drain() -> events  m.things  m.props  m.road  m.share(thing)  m.open()  m.setView(v)
 *     events: {type: "speed" (from, to) | "call" (i, pass, uid, id, glow) | "glow" (i, why) | "wrong" (i, uid) |
 *              "found" (i, pass, uid, id, res: right | helped) | "pass" (i, pass, id, how: missed | unasked) | "idle-tap" | "end"}
 *   WindowRide.simulate(plan, strategy, rng) -> {right, helped, missed, calls, won}   the plan alone, for the quick leak bot
 *   const ride = WindowRide.mount(el, { ride, plan, url(path), sky(box), say(i, call, pass), saySpeed(to, from), onTap,
 *                                       onCall, onResult(i, outcome), onEnd(result), speed, hintMs, hold, rng, art })
 *     ride.start()  ride.stop()  ride.expect()  ride.state()  ride.setSpeed(name)  ride.el
 *
 * Plain <script>: window.WindowRide (and Shared.windowRide); Node: require() gives everything but mount.
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
  W.SCENE = SCENE;
  // RIDE-03 (Zafar, 22 Oct: "all three levels need to drastically slow down, maybe 50%"; Mum: "way too quick"): about half as
  // fast again at every speed (was 9, 6 and 3.3 s)
  W.SPEEDS = { slow: 13500, normal: 9000, fast: 5000 };
  W.SPEED_ORDER = ["slow", "normal", "fast"];
  W.FADE = 0.1; // the cross-fade: each copy of a layer fades in over the outer tenth of the one before
  const LINES = { near: { y: 800, scale: 1, layer: "near" }, field: { y: 654, scale: 0.55, layer: "middle", edge: 646 }, far: { y: 450, scale: 0.12, layer: "far" }, sky: { y: 270, scale: 1, layer: "far" } };
  const GROUND = ["near", "field"];
  /** where a thing may stand (data `lines`; the two ground lines by default) */
  W.linesOf = (def) => (def && Array.isArray(def.lines) && def.lines.length ? def.lines : GROUND);
  const LAYER_SPEED = { far: 0.15, middle: 0.4, near: 1 };
  const IN_WINDOW = 0.8; // every member at least this much inside the window before Nani asks ...
  const CALL_SHARE = 0.45; // ... and at least this much of it showing (a prop may half-hide it)
  const LEAD_MIN = 0.55; // ... and the first of them still right of this share of the window (never as it leaves)

  /* ---------------- the plan (pure) ---------------- */
  const shuffle = (a, rng) => {
    const out = a.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  W.shuffle = shuffle;

  /** The level's settings: the asked level if the ride has it, else the nearest below. */
  W.levelOf = function (ride, level) {
    const ls = Object.keys(ride.levels || {}).map(Number).sort((a, b) => a - b);
    const n = Number(level) || ls[0];
    const at = ls.filter((l) => l <= n).pop() || ls[0];
    return Object.assign({ level: at }, ride.levels[at]);
  };

  /** The look-alike families: family -> [thing ids], only things the engine can say, only families of two or more. */
  W.families = function (ride, callable = () => true) {
    const fam = {};
    Object.entries(ride.things || {}).forEach(([id, t]) => {
      if (t.passOnly || !t.family || !callable(id)) return;
      (fam[t.family] = fam[t.family] || []).push(id);
    });
    Object.keys(fam).forEach((f) => fam[f].length < 2 && delete fam[f]);
    return fam;
  };

  /**
   * A group for a named thing: it and k-1 look-alikes of its family, in a random order. lookOf (the early groups): the others are
   * things that look nothing like it or each other (a different `look`) where the family has enough of them.
   */
  W.groupFor = function (named, members, k, rng, lookOf = null) {
    const want = Math.max(1, Math.min(k, members.length) - 1);
    let pool = shuffle(members.filter((m) => m !== named), rng);
    if (lookOf) {
      const seen = new Set([lookOf(named)]);
      const apart = [];
      pool.forEach((m) => {
        if (seen.has(lookOf(m))) return;
        seen.add(lookOf(m));
        apart.push(m);
      });
      if (apart.length >= want) pool = apart;
    }
    return shuffle([named, ...pool.slice(0, want)], rng);
  };
  /** A thing's look (data `look`; its own id when it has none): two things of one look are hard to tell apart at a glance. */
  W.lookOf = (ride) => (id) => ((ride.things || {})[id] || {}).look || id;
  /** Can this family give a group of things that all look different? */
  const apartOk = (members, k, lookOf) => new Set(members.map(lookOf)).size >= Math.min(k, members.length) && members.length >= 2;

  /**
   * The round: `calls` groups, each k look-alikes of one family in a random order, one of them named; families take turns as
   * evenly as the calls allow (weighted by size); the named thing is never the same twice running. The first group comes on
   * the near verge; later ones on the field behind at the level's fieldShare.
   */
  W.plan = function (ride, level, rng = Math.random, { callable = () => true } = {}) {
    const L = W.levelOf(ride, level);
    const fam = W.families(ride, callable);
    const families = Object.keys(fam);
    const base = { level: L.level, card: L.card || "open", speeds: L.speeds || [], families: fam, group: L.group || 3, fieldShare: L.fieldShare != null ? L.fieldShare : 0.3, distinct: L.distinct || 0 };
    if (!families.length) return Object.assign(base, { calls: [] });
    const bag = [];
    families.forEach((f) => fam[f].forEach(() => bag.push(f)));
    const calls = [];
    const used = new Set();
    let last = null;
    // the first group comes on the near verge: from a family whose things may all stand there (by their real size), if any
    const nearBag = bag.filter((f) => fam[f].every((id) => W.linesOf(ride.things[id]).includes("near")));
    // the first `distinct` groups: from a family that can give things that all look different, and those things
    const lookOf = W.lookOf(ride);
    const early = (b) => b.filter((f) => apartOk(fam[f], L.group || 3, lookOf));
    for (let i = 0; i < L.calls; i++) {
      const apart = i < (L.distinct || 0);
      let from = i === 0 && nearBag.length ? nearBag : bag;
      if (apart && early(from).length) from = early(from);
      const f = from[Math.floor(rng() * from.length)];
      // a thing not named yet if the family has one (the card lists each thing once where it can), never the last one again
      const fresh = fam[f].filter((g) => !used.has(g) && g !== last);
      const pool = fresh.length ? fresh : fam[f].filter((g) => g !== last);
      const named = pool[Math.floor(rng() * pool.length)];
      used.add(named);
      const group = W.groupFor(named, fam[f], L.group || 3, rng, apart ? lookOf : null);
      // the first group on the near verge, later ones on the field at the level's share (a group whose things may not stand
      // on the verge, by their real size, goes on the field)
      let line = i === 0 ? "near" : rng() < base.fieldShare ? "field" : "near";
      if (!group.every((id) => W.linesOf(ride.things[id]).includes(line))) line = GROUND.find((l) => group.every((id) => W.linesOf(ride.things[id]).includes(l))) || "near";
      calls.push({ group, named, family: f, line });
      last = named;
    }
    return Object.assign(base, { calls });
  };

  /* ---------------- the quick leak bot: the plan alone ---------------- */
  /**
   * A strategy sees what a player sees: the group's members in the order they come into view, the glow when it shows, and
   * (only the fair player) the word heard. It returns its taps: [{at: "before" | "glow", i}].
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
  W.BLIND = ["tap-all", "tap-first", "tap-last", "middle", "random", "wait"];
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

  /* ---------------- the ride's rules and motion, without a screen ---------------- */
  const smooth = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));
  const boxesOf = (cover) => (Array.isArray(cover) && Array.isArray(cover[0]) ? cover : cover ? [cover] : [[0.08, 0.1, 0.92, 1]]);

  W.model = function (ride, plan, opt = {}) {
    const view = ride.view || {};
    const things = ride.things || {};
    const propDefs = view.props || {};
    const rng = opt.rng || Math.random;
    const hintMs = opt.hintMs != null ? opt.hintMs : ride.hintMs != null ? ride.hintMs : 5000;
    const itemH = view.itemH || 230;
    const lines = {};
    Object.keys(LINES).forEach((k) => (lines[k] = Object.assign({}, LINES[k], (view.lines || {})[k])));
    const perM = view.perM || 1;
    // the parallax: the trip's set (data: ride.parallax names one of window.parallaxSets, or is a {far, middle, near} of its own;
    // a lab may pass opt.parallax), else each layer's own speed. The things on a line move with that line's layer either way.
    const pset = typeof opt.parallax === "object" && opt.parallax ? opt.parallax : typeof ride.parallax === "object" && ride.parallax && !opt.parallax ? ride.parallax : (opt.parallaxSets || ride.parallaxSets || {})[opt.parallax || ride.parallax] || null;
    const layerSpeed = (id) => {
      if (pset && pset[id] != null) return pset[id];
      const l = (view.layers || []).find((x) => x.id === id);
      return l && l.speed != null ? l.speed : LAYER_SPEED[id] || 1;
    };
    const lineSpeed = {};
    Object.keys(lines).forEach((k) => (lineSpeed[k] = layerSpeed(lines[k].layer)));
    // a thing moves with its line's layer; a sky thing with its own (data `layer`: a butterfly close by, an aeroplane far off)
    const speedOf = (th) => (th.layer ? layerSpeed(th.layer) : lineSpeed[th.line]);
    const speeds = Object.assign({}, W.SPEEDS, ride.speeds || {});
    const easeMs = ride.easeMs || 1000;
    const gapK = view.gapK != null ? view.gapK : 0.15;
    // the things that pass unasked: on the ground lines, in the sky band, on the far hills
    const passOnly = Object.keys(things).filter((id) => things[id] && W.linesOf(things[id]).some((l) => GROUND.includes(l)));
    const skyOnly = Object.keys(things).filter((id) => things[id] && W.linesOf(things[id]).includes("sky"));
    const farOnly = Object.keys(things).filter((id) => things[id] && W.linesOf(things[id]).includes("far") && !skyOnly.includes(id));
    const propIds = Object.keys(propDefs);
    const maxPropW = Math.max(0, ...propIds.map((id) => itemH * (propDefs[id].h || 0.8) * (propDefs[id].ratio || 1)));
    const fam = plan.families || W.families(ride);

    let vx0 = 0;
    let vx1 = SCENE.w;
    let minPx = 0;
    const viewW = () => Math.max(1, vx1 - vx0);
    const velOf = (name) => (viewW() + itemH) / (speeds[name] || speeds.normal);

    const m = { things: [], props: [], road: 0, t: 0, events: [], speed: "normal", done: false, found: 0 };
    let uid = 0;
    let v0 = velOf("normal");
    let v1 = v0;
    let easeAt = -1e9;
    const vel = () => v0 + (v1 - v0) * smooth((m.t - easeAt) / easeMs);
    const emit = (e) => m.events.push(Object.assign({ t: m.t }, e));

    m.setView = function (v) {
      const r = vel() / Math.max(1e-9, (viewW() + itemH));
      if (v.x0 != null) vx0 = v.x0;
      if (v.x1 != null) vx1 = v.x1;
      if (v.minPx != null) minPx = v.minPx;
      // the same crossing time on the new width: scale the speed with it
      const k = (viewW() + itemH) * r;
      const nv = velOf(m.speed);
      v0 = k;
      v1 = nv;
      easeAt = m.t - easeMs;
      v0 = nv;
    };
    if (opt.view) m.setView(opt.view);
    m.view = () => ({ x0: vx0, x1: vx1, w: viewW() });
    m.vel = vel;
    m.lineSpeed = lineSpeed;
    m.layerSpeed = layerSpeed;
    m.speedOf = speedOf;
    m.lines = lines;
    m.offset = (speed) => m.road * speed;

    m.setSpeed = function (name, why) {
      if (!speeds[name] || name === m.speed) return false;
      const from = m.speed;
      v0 = vel();
      v1 = velOf(name);
      easeAt = m.t;
      m.speed = name;
      emit({ type: "speed", from, to: name, why: why || "" });
      return true;
    };

    // ---- sizes and boxes (scene px; a thing's box is at least minPx each way: its tap area) ----
    // a thing's height: its real height (data `m`, metres) times perM times its line's scale, so the things keep their real
    // ratios; a sky thing or the rainbow its own share of itemH (`h`). Never drawn under three quarters of a tap target.
    const sizeOf = (id, line) => {
      const d = things[id] || {};
      let H = d.m != null ? itemH * d.m * perM * lines[line].scale : itemH * (d.h || 1) * (GROUND.includes(line) ? lines[line].scale : 1);
      H = Math.max(H, minPx * 0.75);
      const Wd = H * (d.ratio || 1);
      return { artW: Wd, artH: H, w: Math.max(Wd, minPx), h: Math.max(H, minPx) };
    };
    // a thing stands with its feet on its line (a sky thing at its own height in the band)
    const baseOf = (th) => (th.yb != null ? th.yb : lines[th.line].y);
    const topOf = (th) => baseOf(th) - th.h;
    const inView = (th) => th.x + th.w > vx0 && th.x < vx1;
    /** the share of a thing's width inside the window (the frame cuts the rest) */
    const inWindow = (th) => Math.max(0, Math.min(th.x + th.w, vx1) - Math.max(th.x, vx0)) / th.w;
    m.inView = inView;
    m.topOf = topOf;
    const mk = (id, line, x, member) => {
      const s = sizeOf(id, line);
      const d = things[id] || {};
      const th = Object.assign({ uid: ++uid, id, line, x, member: member == null ? -1 : member, got: false }, s);
      if (line === "sky") {
        th.yb = d.y != null ? d.y : lines.sky.y;
        if (d.layer) th.layer = d.layer;
      }
      m.things.push(th);
      return th;
    };
    const mkProp = (id, x) => {
      const d = propDefs[id] || {};
      const h = itemH * (d.h || 0.8);
      const w = h * (d.ratio || 1);
      const p = { uid: ++uid, id, x, w, h, line: "near", dy: d.dy != null ? d.dy : 10, cover: boxesOf(d.cover) };
      m.props.push(p);
      return p;
    };
    const propTop = (p) => lines.near.y + p.dy - p.h;
    /** the boxes that hide part of a prop's picture (scene px) */
    m.coverOf = (p) => p.cover.map((c) => ({ x: p.x + c[0] * p.w, y: propTop(p) + c[1] * p.h, w: (c[2] - c[0]) * p.w, h: (c[3] - c[1]) * p.h }));
    m.propTop = propTop;
    /** what is in front of a thing: the props' covers, and for a thing in the field the near things' pictures */
    m.inFront = function (th) {
      const out = [];
      m.props.forEach((p) => out.push(...m.coverOf(p)));
      if (th.line === "field")
        m.things.forEach((o) => {
          if (o.line !== "near" || o.got) return;
          const ax = o.x + (o.w - o.artW) / 2;
          out.push({ x: ax + o.artW * 0.12, y: lines.near.y - o.artH * 0.9, w: o.artW * 0.76, h: o.artH * 0.9 });
        });
      return out;
    };
    /** the share of a thing in view (0..1): inside the window, not behind what is in front, not under the verge's edge */
    m.share = function (th) {
      const N = 8;
      const top = topOf(th);
      const occ = m.inFront(th);
      const edge = th.line === "field" ? lines.field.edge : null;
      let vis = 0;
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++) {
          const x = th.x + ((i + 0.5) / N) * th.w;
          const y = top + ((j + 0.5) / N) * th.h;
          if (x < vx0 || x > vx1) continue;
          if (edge != null && y > edge) continue;
          if (occ.some((o) => x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h)) continue;
          vis++;
        }
      return vis / (N * N);
    };

    // ---- the calls ----
    const calls = plan.calls.map((c, i) => ({ i, named: c.named, family: c.family, group: c.group.slice(), line: c.line || "near", pass: 0, state: "wait", firstAt: null, glow: false, wrong: 0, members: [], namedTh: null, result: null }));
    m.calls = calls;
    let ci = 0;
    let nextGroupAt = viewW() * 0.18;
    let nextPasserAt = viewW() * 0.05;
    let nextPropAt = viewW() * 0.3;
    let endAt = null;
    m.open = () => {
      const c = calls[ci];
      return c && c.state === "asked" ? c : null;
    };
    m.current = () => calls[ci] || null;

    const regionClear = (line, x0, x1, withProps) => {
      for (const o of m.things) if (o.line === line && o.x < x1 + 30 && o.x + o.w > x0 - 30) return false;
      if (withProps) for (const p of m.props) if (p.x < x1 + 20 && p.x + p.w > x0 - 20) return false;
      return true;
    };
    const live = (c) => c && (c.state === "coming" || c.state === "asked");
    const fieldLive = () => {
      const c = calls[ci];
      return !!c && (live(c) || c.state === "wait") && c.line === "field";
    };
    // ids no passer may take now: the current call's group and the next call's (two of one thing on screen would be unfair)
    const reserved = () => {
      const r = new Set();
      [calls[ci], calls[ci + 1]].forEach((c) => c && c.group.forEach((id) => r.add(id)));
      return r;
    };
    let clearSince = null;
    const membersAround = () => m.things.some((o) => o.member >= 0 && !o.got && o.x + o.w > vx0);
    const idsAround = (ids) => m.things.some((o) => !o.got && ids.includes(o.id) && o.x + o.w > vx0);

    function spawnGroup(c) {
      c.pass += 1;
      c.state = "coming";
      const line = c.line;
      const gap = itemH * gapK * lines[line].scale;
      let x = vx1 + 10;
      c.members = c.group.map((id) => {
        const th = mk(id, line, x, c.i);
        th.pass = c.pass;
        x += th.w + gap;
        return th;
      });
      c.namedTh = c.members.find((th) => th.id === c.named);
      // a cut-out prop half-hiding one end of a group on the near verge (in front; at most about 40% of that member)
      if (line === "near" && propIds.length && rng() < (view.propHalf != null ? view.propHalf : 0.4)) {
        const id = propIds[Math.floor(rng() * propIds.length)];
        const atStart = rng() < 0.5;
        const th = atStart ? c.members[0] : c.members[c.members.length - 1];
        const p = mkProp(id, 0);
        const f = 0.25 + rng() * 0.15;
        // place it so its cover overlaps the member by f of the member's width
        const cov = m.coverOf(Object.assign({}, p, { x: 0 }))[0];
        p.x = atStart ? th.x + th.w * f - (cov.x + cov.w) : th.x + th.w * (1 - f) - cov.x;
        // never more than half of any member behind it
        if (c.members.some((o) => hiddenBy(o, p) > 0.5)) m.props.pop();
        else if (p.x < vx1 + 10) {
          // a prop before the group would come on inside the window (a pop-in): the group and its prop come on further right
          const dx = vx1 + 10 - p.x;
          p.x += dx;
          c.members.forEach((o) => (o.x += dx));
        }
      }
    }
    const hiddenBy = (th, p) => {
      const N = 8;
      const cs = m.coverOf(p);
      const top = topOf(th);
      let n = 0;
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++) {
          const x = th.x + ((i + 0.5) / N) * th.w;
          const y = top + ((j + 0.5) / N) * th.h;
          if (cs.some((o) => x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h)) n++;
        }
      return n / (N * N);
    };

    function ask(c) {
      c.state = "asked";
      c.saidAt = m.t;
      if (c.firstAt == null) c.firstAt = m.t;
      if (!c.glow && (c.wrong > 0 || m.t - c.firstAt >= hintMs)) c.glow = true;
      emit({ type: "call", i: c.i, pass: c.pass, uid: c.namedTh.uid, id: c.named, glow: c.glow, x: c.namedTh.x });
    }
    function passEnded(c, how) {
      emit({ type: "pass", i: c.i, pass: c.pass, id: c.named, how });
      if (how === "unasked") c.pass -= 1; // never asked: the same pass comes again
      c.state = "wait";
      c.members.forEach((o) => (o.member = -2)); // they go on by as unasked things
      c.members = [];
      c.namedTh = null;
      // it comes round again with new look-alikes, on either line
      const f = fam[c.family] || c.group;
      c.group = W.groupFor(c.named, f, Math.max(2, c.group.length), rng, c.i < (plan.distinct || 0) ? W.lookOf(ride) : null);
      c.line = rng() < (plan.fieldShare != null ? plan.fieldShare : 0.3) ? "field" : "near";
      if (!c.group.every((id) => W.linesOf(things[id]).includes(c.line))) c.line = GROUND.find((l) => c.group.every((id) => W.linesOf(things[id]).includes(l))) || c.line;
      nextGroupAt = m.road + viewW() * 0.12;
    }

    /** the next call still to find, from ci on (one found out of turn is passed over) */
    const nextOpen = () => {
      while (ci < calls.length && calls[ci].state === "found") ci += 1;
    };
    const allFound = () => calls.every((x) => x.state === "found");
    /** a tap on a thing: {counted, ok} */
    m.tap = function (u) {
      const th = m.things.find((o) => o.uid === u);
      if (!th || th.got || m.done) return { counted: false };
      const c = m.open();
      if (c && (u === c.namedTh.uid || th.id === c.named)) {
        th.got = true;
        th.gotAt = m.t;
        const res = c.pass === 1 && !c.glow && c.wrong === 0 ? "right" : "helped";
        c.state = "found";
        c.result = res;
        m.found += 1;
        emit({ type: "found", i: c.i, pass: c.pass, uid: u, id: c.named, res });
        // (its look-alikes stay members of their group until they have gone by: the next group comes on after them)
        ci += 1;
        nextOpen();
        if (ci >= calls.length || allFound()) endAt = m.t + 600;
        else {
          const want = plan.speeds && plan.speeds[ci];
          if (!opt.hold && want && want !== m.speed) m.setSpeed(want, "plan");
          nextGroupAt = m.road + viewW() * (0.28 + rng() * 0.2);
        }
        return { counted: true, ok: true };
      }
      // RIDE-09 (Zafar, 22 Oct: "if you're quick and you're clever and you know what all the items are, you can just click them
      // all, whichever way you see them"): another thing on the card, tapped wherever it shows, is found out of turn
      const k = calls.findIndex((x) => x.state !== "found" && x.named === th.id && x !== c);
      // (a thing still going by from a group that has passed is not found out of turn: a missed one is found when it comes
      // round, as it always does; the tap is no mistake either)
      if (k >= 0 && th.member === -2) return { counted: false };
      if (k >= 0) {
        const o = calls[k];
        th.got = true;
        th.gotAt = m.t;
        o.state = "found";
        o.result = o.pass <= 1 && !o.glow && o.wrong === 0 ? "right" : "helped";
        o.early = true;
        m.found += 1;
        emit({ type: "found", i: k, pass: o.pass, uid: u, id: o.named, res: o.result, early: true });
        if (!c) {
          // between groups: the current one may be the one just found
          nextOpen();
          if (ci >= calls.length) endAt = m.t + 600;
        } else if (allFound()) endAt = m.t + 600;
        return { counted: true, ok: true };
      }
      if (!c) {
        emit({ type: "idle-tap", uid: u, id: th.id });
        return { counted: false };
      }
      c.wrong += 1;
      emit({ type: "wrong", i: c.i, uid: u, id: th.id });
      if (!c.glow) {
        c.glow = true;
        emit({ type: "glow", i: c.i, why: "wrong" });
      }
      return { counted: true, ok: false };
    };

    m.drain = () => m.events.splice(0, m.events.length);
    /** the first-time help (RIDE-10): the asked thing glows at once (a find it helps is "helped", never "right") */
    m.help = function () {
      const c = m.open();
      if (!c) return false;
      if (!c.glow) {
        c.glow = true;
        emit({ type: "glow", i: c.i, why: "help" });
      }
      return true;
    };

    // one sky thing or landmark comes on at the window's right edge (x0) on its line when the way is clear; returns when the next
    // may come (road px)
    let nextSkyAt = 0;
    let nextFarAt = 0;
    const lastOn = {};
    function passBy(line, ids, at, [a, b], x0) {
      const on = m.things.filter((o) => o.line === line).map((o) => o.id);
      const pool = ids.filter((id) => !on.includes(id) && id !== lastOn[line]);
      if (!pool.length) return m.road + viewW() * 0.3;
      const id = pool[Math.floor(rng() * pool.length)];
      const x = x0 != null ? x0 : vx1 + 10;
      if (!regionClear(line, x, x + sizeOf(id, line).w + 10, false)) return m.road + viewW() * 0.1;
      mk(id, line, x, -1);
      lastOn[line] = id;
      return m.road + viewW() * (a + rng() * (b - a));
    }
    // the road as the ride starts: a landmark on the far hills and a thing in the sky already in the window, whole (so the first
    // look out is never an empty view with things only coming on, half behind the pillar)
    m.begin = function () {
      if (farOnly.length) nextFarAt = passBy("far", farOnly, 0, [1.1, 2.2], vx0 + viewW() * (0.12 + rng() * 0.12));
      if (skyOnly.length) nextSkyAt = passBy("sky", skyOnly, 0, [0.9, 1.6], vx0 + viewW() * (0.6 + rng() * 0.12));
      // one thing already passing on the field, whole in the window; the next comes on only once the first group has
      const res = reserved();
      const pool = passOnly.filter((id) => !res.has(id) && W.linesOf(things[id]).includes("field"));
      if (pool.length) {
        const id = pool[Math.floor(rng() * pool.length)];
        const w = sizeOf(id, "field").w;
        const x = vx0 + viewW() * 0.42;
        if (x + w < vx1 - viewW() * 0.05) mk(id, "field", x, -1);
      }
      nextPasserAt = Math.max(nextPasserAt, viewW() * 0.6);
    };

    if (opt.hold) m.setSpeed(opt.hold, "hold");

    m.step = function (dt) {
      if (dt <= 0) return;
      m.t += dt;
      const d = vel() * dt;
      m.road += d;
      for (const th of m.things) th.x -= d * speedOf(th);
      for (const p of m.props) p.x -= d * lineSpeed.near;
      const c = calls[ci];
      // the road since the last group's members went by: a short stretch with none in view before the next comes on
      const around = membersAround();
      if (around) clearSince = null;
      else if (clearSince == null) clearSince = m.road;
      if (c && !m.done) {
        if (c.state === "wait" && m.road >= nextGroupAt) {
          // one group at a time: the last one's members gone by, no thing of this group's on screen, room where it comes on
          const span = c.group.reduce((a, id) => a + sizeOf(id, c.line).w, 0) + itemH * gapK * c.group.length;
          if (!around && m.road - clearSince >= viewW() * 0.15 && !idsAround(c.group) && regionClear(c.line, vx1, vx1 + span + 40 + (c.line === "near" ? maxPropW : 0), c.line === "near")) spawnGroup(c);
        } else if (c.state === "coming") {
          const lead = c.members.reduce((a, o) => (o.x < a.x ? o : a), c.members[0]);
          const rel = (lead.x + lead.w / 2 - vx0) / viewW();
          if (rel < LEAD_MIN) passEnded(c, "unasked");
          else if (c.members.every((o) => inWindow(o) >= IN_WINDOW && m.share(o) >= CALL_SHARE)) ask(c);
        } else if (c.state === "asked") {
          if (!c.glow && m.t - c.firstAt >= hintMs) {
            c.glow = true;
            emit({ type: "glow", i: c.i, why: "wait" });
          }
          // gone by: once it is half behind the window's left pillar it is no longer asked for (never a call or a glow on a
          // thing half hidden by the frame); it comes round again
          if (c.namedTh.x < vx0 && inWindow(c.namedTh) < 0.5) passEnded(c, "missed");
        }
      }
      // unasked things pass between the groups (never one of the current or next group's things: two goats would be unfair)
      const cur = calls[ci];
      const blocked = cur && ((cur.state === "wait" && m.road >= nextGroupAt - viewW() * 0.1) || cur.state === "coming");
      if (!m.done && passOnly.length && m.road >= nextPasserAt && !blocked) {
        const res = reserved();
        const line = fieldLive() ? "field" : rng() < 0.5 ? "near" : "field";
        const pool = passOnly.filter((id) => !res.has(id) && W.linesOf(things[id]).includes(line));
        if (pool.length) {
          const id = pool[Math.floor(rng() * pool.length)];
          const s = sizeOf(id, line);
          if (regionClear(line, vx1, vx1 + s.w + 10, line === "near")) {
            mk(id, line, vx1 + 10, -1);
            nextPasserAt = m.road + viewW() * (0.3 + rng() * 0.45);
          } else nextPasserAt = m.road + viewW() * 0.05;
        } else nextPasserAt = m.road + viewW() * 0.2;
      }
      // free props on the verge (none while a group in the field is coming or asked: the verge passes in front of it)
      if (!m.done && propIds.length && m.road >= nextPropAt && !fieldLive() && !(cur && cur.state === "coming")) {
        const id = propIds[Math.floor(rng() * propIds.length)];
        const d = propDefs[id] || {};
        const w = itemH * (d.h || 0.8) * (d.ratio || 1);
        if (regionClear("near", vx1, vx1 + w + 10, true)) {
          mkProp(id, vx1 + 10);
          nextPropAt = m.road + viewW() * (0.45 + rng() * 0.6);
        } else nextPropAt = m.road + viewW() * 0.08;
      }
      // the sky band (a kite, an aeroplane, a butterfly) and the far hills (a windmill, a rainbow): one at a time on each, never
      // the same one twice running; they only pass (never asked, never look-alikes of what is)
      if (!m.done) {
        if (skyOnly.length && m.road >= nextSkyAt) nextSkyAt = passBy("sky", skyOnly, nextSkyAt, [0.9, 1.6]);
        if (farOnly.length && m.road >= nextFarAt) nextFarAt = passBy("far", farOnly, nextFarAt, [1.1, 2.2]);
      }
      // things gone by leave; a found thing leaves once it has hopped up and away (the screen's found animation, 0.6 s)
      m.things = m.things.filter((o) => (o.x + o.w > vx0 - 60 || (calls[ci] && calls[ci].namedTh === o)) && !(o.got && m.t - o.gotAt > 650));
      m.props = m.props.filter((p) => p.x + p.w > vx0 - 60);
      if (endAt != null && m.t >= endAt && !m.done) {
        m.done = true;
        emit({ type: "end", found: m.found, calls: calls.length });
      }
    };
    m.result = function () {
      const out = { right: 0, helped: 0, missed: 0, calls: calls.length, found: m.found, outcome: calls.map((c) => c.result || "missed") };
      out.outcome.forEach((r) => (out[r] += 1));
      out.won = out.calls > 0 && out.right === out.calls;
      return out;
    };
    return m;
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
    s.setAttribute("preserveAspectRatio", "none");
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

  /** A thing's or prop's placeholder picture (no text), in its data colour, on a 200x200 box (bottom = the ground). */
  W.placeholder = function (def) {
    const c = def.fill || "#888888";
    const k = def.fill2 || "#2a2522";
    const S = {
      animal: [{ t: "ellipse", cx: 100, cy: 110, rx: 70, ry: 38, fill: c }, { t: "circle", cx: 168, cy: 78, r: 26, fill: c }, { t: "rect", x: 52, y: 130, w: 14, h: 66, r: 6, fill: c }, { t: "rect", x: 132, y: 130, w: 14, h: 66, r: 6, fill: c }, { t: "poly", pts: [[160, 60], [176, 36], [184, 62]], fill: c }, { t: "circle", cx: 176, cy: 74, r: 4, fill: "#2a2522" }],
      cow: [{ t: "ellipse", cx: 96, cy: 104, rx: 80, ry: 44, fill: c }, { t: "ellipse", cx: 70, cy: 96, rx: 22, ry: 18, fill: k }, { t: "ellipse", cx: 120, cy: 118, rx: 18, ry: 14, fill: k }, { t: "ellipse", cx: 176, cy: 84, rx: 22, ry: 28, fill: c }, { t: "ellipse", cx: 182, cy: 102, rx: 14, ry: 10, fill: "#e6b3a3" }, { t: "rect", x: 40, y: 130, w: 16, h: 66, r: 6, fill: c }, { t: "rect", x: 136, y: 130, w: 16, h: 66, r: 6, fill: c }, { t: "poly", pts: [[164, 58], [158, 44], [172, 54]], fill: "#e8e2d0" }, { t: "circle", cx: 180, cy: 78, r: 4, fill: "#2a2522" }],
      bird: [{ t: "rect", x: 92, y: 140, w: 16, h: 60, fill: "#8a6a48" }, { t: "ellipse", cx: 100, cy: 108, rx: 44, ry: 30, fill: c }, { t: "circle", cx: 138, cy: 86, r: 20, fill: c }, { t: "poly", pts: [[156, 84], [178, 90], [156, 96]], fill: "#e0a63a" }, { t: "poly", pts: [[64, 100], [26, 84], [44, 122]], fill: c }, { t: "circle", cx: 142, cy: 82, r: 4, fill: "#2a2522" }],
      door: [{ t: "rect", x: 10, y: 10, w: 180, h: 190, r: 10, fill: "#e8c9a0" }, { t: "rect", x: 52, y: 40, w: 96, h: 160, r: 48, fill: c }, { t: "circle", cx: 132, cy: 130, r: 7, fill: "#d9a441" }, { t: "ellipse", cx: 26, cy: 186, rx: 14, ry: 14, fill: "#b0603f" }],
      tractor: [{ t: "rect", x: 20, y: 80, w: 120, h: 70, r: 10, fill: c }, { t: "rect", x: 100, y: 40, w: 64, h: 70, r: 8, fill: c }, { t: "rect", x: 110, y: 50, w: 44, h: 36, r: 6, fill: "#cfe3ea" }, { t: "rect", x: 40, y: 54, w: 10, h: 30, fill: "#5a5550" }, { t: "circle", cx: 138, cy: 156, r: 42, fill: "#3b3633" }, { t: "circle", cx: 138, cy: 156, r: 16, fill: "#a7a29c" }, { t: "circle", cx: 48, cy: 172, r: 26, fill: "#3b3633" }, { t: "circle", cx: 48, cy: 172, r: 10, fill: "#a7a29c" }],
      bicycle: [{ t: "circle", cx: 50, cy: 150, r: 40, fill: "#3b3633" }, { t: "circle", cx: 50, cy: 150, r: 32, fill: "#f4ecd2", a: 0.0 }, { t: "circle", cx: 150, cy: 150, r: 40, fill: "#3b3633" }, { t: "circle", cx: 50, cy: 150, r: 30, fill: "#d9e6c0" }, { t: "circle", cx: 150, cy: 150, r: 30, fill: "#d9e6c0" }, { t: "poly", pts: [[50, 150], [92, 92], [140, 92], [150, 150], [146, 150], [136, 100], [96, 100], [56, 152]], fill: c }, { t: "rect", x: 84, y: 82, w: 26, h: 8, r: 4, fill: "#3b3633" }, { t: "rect", x: 132, y: 70, w: 8, h: 26, fill: c }],
      tree: [{ t: "rect", x: 86, y: 110, w: 28, h: 90, fill: "#7a5233" }, { t: "circle", cx: 100, cy: 70, r: 64, fill: c }, { t: "circle", cx: 56, cy: 96, r: 42, fill: c }, { t: "circle", cx: 144, cy: 96, r: 42, fill: c }],
      bush: [{ t: "ellipse", cx: 100, cy: 140, rx: 92, ry: 60, fill: c }, { t: "circle", cx: 64, cy: 110, r: 46, fill: c }, { t: "circle", cx: 128, cy: 100, r: 54, fill: c }, { t: "ellipse", cx: 100, cy: 196, rx: 90, ry: 6, fill: "#000000", a: 0.12 }],
      haystack: [{ t: "ellipse", cx: 100, cy: 130, rx: 90, ry: 72, fill: c }, { t: "rect", x: 10, y: 130, w: 180, h: 70, fill: c }, { t: "rect", x: 10, y: 150, w: 180, h: 8, fill: k, a: 0.35 }, { t: "rect", x: 10, y: 176, w: 180, h: 8, fill: k, a: 0.35 }],
      wall: [{ t: "rect", x: 0, y: 40, w: 200, h: 160, r: 6, fill: c }, { t: "rect", x: 8, y: 52, w: 56, h: 40, r: 10, fill: k, a: 0.18 }, { t: "rect", x: 72, y: 52, w: 60, h: 40, r: 10, fill: k, a: 0.12 }, { t: "rect", x: 140, y: 52, w: 52, h: 40, r: 10, fill: k, a: 0.18 }, { t: "rect", x: 30, y: 100, w: 64, h: 42, r: 10, fill: k, a: 0.12 }, { t: "rect", x: 104, y: 100, w: 70, h: 42, r: 10, fill: k, a: 0.18 }, { t: "rect", x: 8, y: 150, w: 70, h: 44, r: 10, fill: k, a: 0.18 }, { t: "rect", x: 88, y: 150, w: 104, h: 44, r: 10, fill: k, a: 0.12 }],
    };
    return W.shapesSvg(S[def.shape] || S.animal, 200, 200, "wr-ph");
  };

  /** The look of the ride's new pieces (the frame, the view, the props): the shared kit's own, never per mode. */
  const CSS = `
.wr-view { position: absolute; overflow: hidden; }
.wr-view > .wr-scene { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
.wr-car { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
.wr-car-part { position: absolute; overflow: hidden; }
.wr-car-part > img { position: absolute; display: block; max-width: none; user-select: none; -webkit-user-drag: none; }
.wr-car-under { right: auto; bottom: auto; z-index: 0; overflow: hidden; }
.wr-lane .wr-thing { left: 0; top: 0; will-change: transform; }
.wr-body { position: absolute; display: block; pointer-events: none; }
.wr-body > img, .wr-body > svg { width: 100%; height: 100%; object-fit: contain; object-position: 50% 100%; display: block; }
.wr-thing .wr-contact { z-index: 0; }
.wr-prop { position: absolute; left: 0; top: 0; pointer-events: none; will-change: transform; }
.wr-layer { will-change: transform; }
.wr-lead { position: absolute; left: 0; width: 100%; }
.wr-lead > img, .wr-lead > svg { width: 100%; height: 100%; display: block; }
.wr-prop > img, .wr-prop > svg { width: 100%; height: 100%; object-fit: contain; object-position: 50% 100%; display: block; }
.wr-found > .wr-body { animation: wr-found .6s ease-out 1 forwards; }
@keyframes wr-found { 0% { transform: none; opacity: 1; } 60% { transform: translateY(-14%) scale(1.12); opacity: 1; } 100% { transform: translateY(-20%) scale(0.9); opacity: 0; } }
.wr-nudge > .wr-body { animation: wr-nudge .4s ease-in-out 1; }
@media (prefers-reduced-motion: reduce) { .wr-nudge > .wr-body { animation: none; } }
`;
  const styleOnce = (doc) => {
    if (doc.getElementById("wr-style")) return;
    const st = doc.createElement("style");
    st.id = "wr-style";
    st.textContent = CSS;
    doc.head.appendChild(st);
  };

  /** One looping layer: copies of its picture every (1 - FADE) of a tile, each fading in over the tenth before (no seam). */
  W.layerStrip = function (doc, def0, url, useArt) {
    // a picture sits in its own box (its aspect: data artBox), the placeholder shapes in the layer's
    const def = useArt && def0.art && def0.artBox ? Object.assign({}, def0, def0.artBox) : def0;
    const tile = def.tile || 1600;
    const period = tile * (1 - W.FADE);
    const n = Math.ceil(SCENE.w / period) + 3;
    const strip = doc.createElement("div");
    strip.className = "wr-band wr-layer";
    strip.dataset.band = def.id;
    // a true cross-fade (Zafar, 20 Oct: "a stray edge that sticks out"): over the overlap the old copy fades OUT as the new one
    // fades IN, and the two are added (plus-lighter, inside the strip only: isolate), so their weights always sum to one. A
    // one-sided fade left the old copy's hill line ending in a hard vertical edge wherever the two copies' outlines differ.
    Object.assign(strip.style, { top: `${def.y}px`, height: `${def.h}px`, width: `${period * n + tile}px`, isolation: "isolate" });
    const f = (W.FADE * 100).toFixed(1);
    const mask = `linear-gradient(to right, transparent 0, #000 ${f}%, #000 ${(100 - W.FADE * 100).toFixed(1)}%, transparent 100%)`;
    const l0 = def0.lead || null;
    const lb = l0 ? (useArt && l0.art && l0.artBox ? Object.assign({}, l0, l0.artBox) : l0) : null;
    const tiles = [];
    for (let i = 0; i < n; i++) {
      const t = doc.createElement("div");
      t.className = "wr-tile";
      Object.assign(t.style, { left: `${i * period}px`, width: `${tile}px`, height: `${def.h}px`, mixBlendMode: "plus-lighter" });
      t.style.webkitMaskImage = mask;
      t.style.maskImage = mask;
      let main;
      if (useArt && def.art) {
        main = doc.createElement("img");
        main.alt = "";
        main.draggable = false;
        main.src = url(def.art);
      } else main = W.shapesSvg(def.shapes, tile, def.h);
      t.appendChild(main);
      // the trip's start (data: the layer's `lead`, e.g. the town's shops before the fields, Zafar 20 Oct): the first copies of
      // the layer show the lead's picture in its own box; the copies after it the layer's own, joined by the same cross-fade
      let lead = null;
      if (lb) {
        lead = doc.createElement("div");
        lead.className = "wr-lead";
        Object.assign(lead.style, { top: `${lb.y - def.y}px`, height: `${lb.h}px`, display: "none" });
        if (useArt && lb.art) {
          const im = doc.createElement("img");
          im.alt = "";
          im.draggable = false;
          im.src = url(lb.art);
          lead.appendChild(im);
        } else lead.appendChild(W.shapesSvg(lb.shapes, lb.tile || tile, lb.h));
        t.appendChild(lead);
      }
      tiles.push({ el: t, main, lead, isLead: false });
      strip.appendChild(t);
    }
    return { strip, period, def, tiles, last: lb ? (def0.lead.last != null ? def0.lead.last : 0) : null };
  };
  /** which copies show the lead: tile i shows copy (floor(pos / period) - 1 + i); copies up to `last` are the lead's */
  W.leadTiles = function (L, pos) {
    if (L.last == null) return;
    const base = Math.floor(pos / L.period) - 1;
    L.tiles.forEach((t, i) => {
      const on = base + i <= L.last;
      if (on === t.isLead) return;
      t.isLead = on;
      t.main.style.display = on ? "none" : "";
      t.lead.style.display = on ? "" : "none";
    });
  };

  /**
   * One frame of the ride's clock (pure: the screen's frame loop and the tests): the road moves by exactly the frame's real time
   * (ms, times the test speed), in pieces of at most 50 ms of ride time whose sum is the frame's, so a long frame is one even
   * move, never a stall that creeps after. A gap over W.STALL (a hidden tab, a paused page, a busy page that froze for a moment)
   * counts as one 16 ms frame: the road never leaps on by a quarter second or more, so a thing asked for is never carried off
   * past the pillar while the page was stuck (RIDE-04).
   */
  W.STALL = 250;
  W.advance = function (model, ms, speed = 1) {
    if (!(ms >= 0) || ms > W.STALL) ms = 16;
    let dt = ms * speed;
    while (dt > 1e-9) {
      const d = Math.min(dt, 50);
      model.step(d);
      dt -= d;
    }
    return ms;
  };

  /**
   * The car frame's boxes as the screen uses them (pure; RIDE-08): with `flip` the picture is shown mirrored, so its opening,
   * show box and mirror columns (art px) are mirrored across its width, and its edges' left-to-right gradients run the other way.
   */
  W.frameView = function (fr = {}) {
    const w = fr.w || 1536;
    const h = fr.h || 1024;
    const flip = !!fr.flip;
    const mx = (b) => (b && flip ? [w - b[2], b[1], w - b[0], b[3]] : b);
    const [ml, mr] = fr.mirrorAt || [0, w];
    const edges = fr.edges && flip ? Object.fromEntries(Object.entries(fr.edges).map(([k, v]) => [k, String(v).replace(/to right/g, "to left")])) : fr.edges || null;
    return { w, h, flip, opening: mx(fr.opening || [0, 0, w, h]), show: fr.show ? mx(fr.show) : null, mirrorAt: flip ? [w - mr, w - ml] : [ml, mr], edges };
  };

  W.mount = function (el, o) {
    const doc = root.document;
    styleOnce(doc);
    const ride = o.ride;
    const plan = o.plan;
    const view = ride.view || {};
    const url = o.url || ((p) => p);
    const useArt = o.art !== false;
    const raf = root.requestAnimationFrame ? root.requestAnimationFrame.bind(root) : (f) => setTimeout(() => f(Date.now()), 16);
    const caf = root.cancelAnimationFrame ? root.cancelAnimationFrame.bind(root) : clearTimeout;
    const speed = o.speed || 1;
    const h = (tag, cls, parent) => {
      const e = doc.createElement(tag);
      if (cls) e.className = cls;
      if (parent) parent.appendChild(e);
      return e;
    };
    const model = W.model(ride, plan, { rng: o.rng || Math.random, hintMs: o.hintMs, hold: o.hold || null, parallax: o.parallax || null, parallaxSets: o.parallaxSets || null });

    // the window: the view (the scene in the frame's opening) and the car's frame over it
    const win = h("div", "wr-window", el);
    const vbox = h("div", "wr-view", win);
    const scene = h("div", "wr-scene", vbox);
    scene.style.width = `${SCENE.w}px`;
    scene.style.height = `${SCENE.h}px`;
    const sky = h("div", "wr-sky", scene);
    if (o.sky) o.sky(sky);
    const layers = {};
    const lane = {};
    const addLayer = (id) => {
      const def = (view.layers || []).find((l) => l.id === id);
      if (!def) return;
      const L = W.layerStrip(doc, def, url, useArt);
      scene.appendChild(L.strip);
      layers[id] = L;
    };
    // back to front: far, the far hills' landmarks, the sky's things, middle, the field's things, near, the verge's things, the props
    addLayer("far");
    lane.far = h("div", "wr-lane wr-line-far", scene);
    lane.sky = h("div", "wr-lane wr-line-sky", scene);
    addLayer("middle");
    lane.field = h("div", "wr-lane wr-line-field", scene);
    addLayer("near");
    lane.near = h("div", "wr-lane wr-line-near", scene);
    const propLane = h("div", "wr-lane wr-props", scene);
    // the frame: the keyed car window. With a `show` box (the wide window: both pillars and the sill, art px) it is fitted so
    // that box is whole in the play area, as big as that allows; else by height (the first window). Where the picture stops
    // short of an edge it is carried on: sideways by its own mirror image (from `mirrorAt`, the columns just inside its outer
    // edges), up and down by its top and bottom edges' colours; and on under the host's sidebar (o.under: an element behind it),
    // so the car's inside runs the whole width of the screen (never a plain column)
    const fr = view.frame || {};
    // RIDE-08 (Zafar, 22 Oct: "it looks like you're reversing ... the way it's scrolling is good. I think the car needs to change"):
    // the car's picture mirrored (data `flip`), so its front is the way the road goes by; its boxes (art px) mirrored with it
    const FR = W.frameView(fr);
    const car = useArt && fr.art ? h("div", "wr-car", win) : null;
    const under = car && o.under ? h("div", "wr-car wr-car-under", o.under) : null;
    const frameEl = car ? null : h("div", "wr-frame", win);
    /** the car's pieces in one host: the picture, its mirrored sides, its stretched top and bottom rows */
    const carParts = (host) => {
      const part = (cls) => {
        const box = h("div", `wr-car-part ${cls}`, host);
        const im = h("img", "", box);
        im.alt = "";
        im.draggable = false;
        im.src = url(fr.art);
        return { box, im };
      };
      const P = { main: part("wr-car-main"), l: part("wr-car-l"), r: part("wr-car-r"), t: part("wr-car-t"), b: part("wr-car-b") };
      // behind a mirrored side: the pillar's trim (data `trim`), where the mirror image has the window's keyed opening
      if (fr.trim) [P.l, P.r].forEach((p) => (p.box.style.background = fr.trim));
      // above and below the picture: its top and bottom edges' own colours carried on as soft gradients (data `edges`; never the
      // picture's rows stretched, which would blow the picture up far past its resolution)
      [[P.t, "top"], [P.b, "bottom"]].forEach(([p, k]) => {
        p.im.style.display = "none";
        if (FR.edges && FR.edges[k]) p.box.style.background = FR.edges[k];
      });
      return P;
    };
    const carSet = car ? carParts(car) : null;
    const underSet = under ? carParts(under) : null;
    // (what no piece reaches, a corner: the frame's own dark trim colour, never the page's cream)
    if (car && fr.fill) [win, under].forEach((e) => e && (e.style.background = fr.fill));
    /** lay the car's pieces out in a host whose left edge is `dx` px left of the window's, over a host width `HW` */
    const placeCar = (P, A, dx, HW, H0) => {
      const { k, fx, fy, fw, fh } = A;
      const X = fx + dx;
      const set = (p, box, im) => {
        Object.assign(p.box.style, { left: `${box[0]}px`, top: `${box[1]}px`, width: `${Math.max(0, box[2])}px`, height: `${Math.max(0, box[3])}px`, display: box[2] > 0.5 && box[3] > 0.5 ? "block" : "none" });
        Object.assign(p.im.style, im);
      };
      // (flipped: the picture shown is the mirror image, so its mirrored sides are the picture as drawn)
      const shown = FR.flip ? "scaleX(-1)" : "none";
      const mirrored = FR.flip ? "none" : "scaleX(-1)";
      set(P.main, [X, fy, fw, fh], { left: "0px", top: "0px", width: `${fw}px`, height: `${fh}px`, transform: shown });
      // sideways: the picture mirrored about the column `mirrorAt` px in from each outer edge (a flipped copy shows column c at
      // left + fw - c k: column ml lands on the left axis with the rest running on leftwards, column mr on the right one)
      const [ml, mr] = FR.mirrorAt;
      const axL = X + ml * k;
      const axR = X + mr * k;
      set(P.l, [0, fy, axL, fh], { left: `${axL - fw + ml * k}px`, top: "0px", width: `${fw}px`, height: `${fh}px`, transform: mirrored });
      set(P.r, [axR, fy, HW - axR, fh], { left: `${mr * k - fw}px`, top: "0px", width: `${fw}px`, height: `${fh}px`, transform: mirrored });
      // up and down: the gaps above and below the picture, its edges' colours carried on (the headliner, the door panel)
      set(P.t, [X, 0, fw, fy], {});
      set(P.b, [X, fy + fh, fw, H0 - (fy + fh)], {});
    };

    const fit = { s: 1, tx: 0, open: null, vl: 0, vt: 0 };
    const BLEED = 4;
    function layout() {
      const W0 = win.clientWidth || 1;
      const H0 = win.clientHeight || 1;
      let op = { l: 0, t: 0, r: W0, b: H0 };
      if (car) {
        const fw0 = FR.w;
        const fh0 = FR.h;
        const o4 = FR.opening;
        let k;
        let fx;
        let fy;
        if (FR.show) {
          // the show box whole and as big as it can be, centred; the picture then covers what it can (never pulled in past an
          // edge it reaches); short of the bottom it sits on the bottom (the gap goes to the headliner above)
          const [sx0, sy0, sx1, sy1] = FR.show;
          k = Math.min(W0 / (sx1 - sx0), H0 / (sy1 - sy0));
          fx = W0 / 2 - ((sx0 + sx1) / 2) * k;
          fy = H0 / 2 - ((sy0 + sy1) / 2) * k;
          const fw = fw0 * k;
          const fh = fh0 * k;
          if (fw >= W0) fx = Math.min(0, Math.max(W0 - fw, fx));
          if (fh >= H0) fy = Math.min(0, Math.max(H0 - fh, fy));
          else fy = H0 - fh;
          // the show box stays whole whatever the clamps did
          fx = Math.min(-sx0 * k, Math.max(W0 - sx1 * k, fx));
        } else {
          k = H0 / fh0;
          fx = (W0 - fw0 * k) / 2;
          fy = 0;
        }
        fit.car = { k, fx, fy, fw: fw0 * k, fh: fh0 * k };
        placeCar(carSet, fit.car, 0, W0, H0);
        if (under) {
          const ur = o.under.getBoundingClientRect();
          const wr = win.getBoundingClientRect();
          placeCar(underSet, fit.car, wr.left - ur.left, ur.width, H0);
          under.style.top = `${wr.top - ur.top}px`;
          under.style.height = `${H0}px`;
          under.style.width = `${Math.max(0, wr.left - ur.left)}px`;
        }
        op = { l: Math.max(0, fx + o4[0] * k), t: Math.max(0, fy + o4[1] * k), r: Math.min(W0, fx + o4[2] * k), b: Math.min(H0, fy + o4[3] * k) };
      }
      fit.open = op;
      const vw = op.r - op.l + 2 * BLEED;
      const vh = op.b - op.t + 2 * BLEED;
      fit.vl = op.l - BLEED;
      fit.vt = op.t - BLEED;
      Object.assign(vbox.style, { left: `${fit.vl}px`, top: `${fit.vt}px`, width: `${vw}px`, height: `${vh}px` });
      // the scene covers the opening: its height to the opening's, centred across
      const s = Math.max(vw / SCENE.w, vh / SCENE.h);
      fit.s = s;
      fit.tx = (vw - SCENE.w * s) / 2;
      fit.ty = vh - SCENE.h * s;
      scene.style.transform = `translate(${fit.tx.toFixed(1)}px, ${fit.ty.toFixed(1)}px) scale(${s.toFixed(4)})`;
      // the part of the scene inside the opening (the bleed is under the frame)
      const x0 = (BLEED - fit.tx) / s;
      const x1 = (vw - BLEED - fit.tx) / s;
      model.setView({ x0, x1, minPx: 56 / s });
    }

    // scene px -> screen px (for the test log: what the page shows)
    const toScreen = (x, y) => {
      const r = vbox.getBoundingClientRect();
      return { x: r.left + fit.tx + x * fit.s, y: r.top + fit.ty + y * fit.s };
    };
    const rectStr = (b) => {
      const a = toScreen(b.x, b.y);
      return `${Math.round(a.x)},${Math.round(a.y)},${Math.round(b.w * fit.s)},${Math.round(b.h * fit.s)}`;
    };

    // ---- the things and props on screen ----
    const els = new Map();
    const things = ride.things || {};
    const draw = (def, box) => {
      if (useArt && def.art) {
        const im = h("img", "", box);
        im.alt = "";
        im.src = url(def.art);
        im.draggable = false;
      } else box.appendChild(o.shape ? o.shape(def) : W.placeholder(def));
    };
    const thingEl = (th) => {
      let e = els.get(th.uid);
      if (e) return e;
      const def = things[th.id] || {};
      const b = h("button", "wr-thing", lane[th.line]);
      b.type = "button";
      b.dataset.thing = th.id;
      b.dataset.uid = String(th.uid);
      b.dataset.line = th.line;
      b.setAttribute("aria-label", "");
      Object.assign(b.style, { width: `${th.w}px`, height: `${th.h}px` });
      const body = h("span", "wr-body", b);
      Object.assign(body.style, { left: `${(th.w - th.artW) / 2}px`, top: `${th.h - th.artH}px`, width: `${th.artW}px`, height: `${th.artH}px` });
      draw(def, body);
      // a ground shadow only for a thing on the ground (never under a kite, a butterfly or a far landmark)
      if (th.line === "near" || th.line === "field") {
        const ct = h("i", "wr-contact", b);
        Object.assign(ct.style, { left: `${(th.w - th.artW * 0.64) / 2}px`, right: "auto", width: `${th.artW * 0.64}px` });
      }
      b.addEventListener("pointerdown", (ev) => {
        ev.preventDefault();
        tap(th);
      });
      e = { el: b, kind: "thing", member: null };
      els.set(th.uid, e);
      return e;
    };
    const propEl = (p) => {
      let e = els.get(p.uid);
      if (e) return e;
      const d = h("div", "wr-prop", propLane);
      d.dataset.prop = p.id;
      Object.assign(d.style, { width: `${p.w}px`, height: `${p.h}px` });
      draw((view.props || {})[p.id] || {}, d);
      e = { el: d, kind: "prop" };
      els.set(p.uid, e);
      return e;
    };

    let doneSent = false;
    function tap(th) {
      if (o.onTap) o.onTap({ thing: th.id, uid: th.uid });
      const r = model.tap(th.uid);
      handle();
      if (!r.counted || r.ok) return;
      const e = els.get(th.uid);
      if (!e) return;
      e.el.classList.remove("wr-nudge");
      void e.el.offsetWidth;
      e.el.classList.add("wr-nudge");
    }

    // ---- the test log (Lifecycle.note: contracts 47 and 48 read it) ----
    const note = (what, step, by) => {
      const LC = root.Lifecycle;
      if (LC && LC.note) LC.note(what, { step, by });
    };
    const callNote = (ev) => {
      const th = model.things.find((x) => x.uid === ev.uid);
      if (!th) return;
      const top = model.topOf(th);
      // where it was when she asked (the event's own moment: a frame can hold several steps), what was in front of it then
      const dx = ev.x != null ? ev.x - th.x : 0;
      const occ = model.inFront(th).map((b) => rectStr(Object.assign({}, b, { x: b.x + dx }))).join(";");
      const op = fit.open;
      const pr = win.getBoundingClientRect();
      const edge = th.line === "field" ? Math.round(toScreen(0, model.lines.field.edge).y) : "";
      note("ride-call", ev.i, `thing:${th.id} pass:${ev.pass} line:${th.line} speed:${model.speed} box:${rectStr({ x: th.x + dx, y: top, w: th.w, h: th.h })} open:${Math.round(pr.left + op.l)},${Math.round(pr.top + op.t)},${Math.round(pr.left + op.r)},${Math.round(pr.top + op.b)} occ:${occ} edge:${edge}`);
    };

    // the model's news -> the host (Nani's lines) and the log
    function handle() {
      for (const ev of model.drain()) {
        if (ev.type === "speed") {
          note("ride-speed", "", `from:${ev.from} to:${ev.to} how:${ev.why}`);
          if (o.saySpeed) o.saySpeed(ev.to, ev.from);
        } else if (ev.type === "call") {
          callNote(ev);
          if (o.onCall) o.onCall(ev.i, plan.calls[ev.i], ev.pass);
          if (o.say) o.say(ev.i, plan.calls[ev.i], ev.pass);
        } else if (ev.type === "pass") {
          note("ride-pass", ev.i, `thing:${ev.id} pass:${ev.pass} how:${ev.how}`);
          if (o.onPass) o.onPass(ev.i, ev.how);
        } else if (ev.type === "found") {
          note("ride-found", ev.i, `thing:${ev.id} pass:${ev.pass} how:${ev.res}`);
          const e = els.get(ev.uid);
          if (e) e.el.classList.add("wr-found");
          if (o.onResult) o.onResult(ev.i, ev.res);
        } else if (ev.type === "end") {
          note("ride-end", "", `found:${ev.found} calls:${ev.calls}`);
          if (!doneSent) {
            doneSent = true;
            const r = model.result();
            setTimeout(() => o.onEnd && o.onEnd(r), 400 / speed);
          }
        }
      }
    }

    // ---- the clock ----
    let last = null;
    let rafId = 0;
    let stopped = false;
    let ro = null;
    const step = (now) => {
      if (stopped) return;
      if (last == null) last = now;
      // the road keeps the wall clock's time (a late frame moves it on, never a stall that then creeps); only a gap of more
      // than a second (a hidden tab, a paused page) counts as one frame. Stepped in small pieces, so no call or pass is missed.
      W.advance(model, now - last, speed);
      last = now;
      handle();
      // the layers: each at its own share of the road, one copy left of the window so the first fade never shows
      Object.values(layers).forEach((L) => {
        const pos = model.road * model.layerSpeed(L.def.id);
        const off = pos % L.period;
        W.leadTiles(L, pos);
        L.strip.style.transform = `translate3d(${-off - L.period}px, 0, 0)`;
      });
      const open = model.open();
      const vw = model.view();
      const live = new Set();
      for (const th of model.things) {
        live.add(th.uid);
        const e = thingEl(th);
        const b = e.el;
        b.style.transform = `translate3d(${th.x}px, ${model.topOf(th)}px, 0)`;
        // off the window (behind the frame or the sidebar): hidden, so it is never seen or tapped there
        const seen = th.x + th.w > vw.x0 && th.x < vw.x1;
        if (e.seen !== seen) {
          e.seen = seen;
          b.style.visibility = seen ? "" : "hidden";
        }
        const member = th.member >= 0;
        if (e.member !== member) {
          e.member = member;
          b.classList.toggle("wr-member", member);
          b.classList.toggle("wr-passer", !member);
          if (member) b.dataset.call = String(th.member);
          else delete b.dataset.call;
        }
        const lit = !!(open && open.glow && open.namedTh === th);
        if (lit !== !!e.lit) {
          e.lit = lit;
          b.classList.toggle("wr-glow", lit);
          const body = b.firstChild;
          if (body) body.classList.toggle("njg-pulse", lit);
        }
        if (th.got && !b.disabled) b.disabled = true;
      }
      for (const p of model.props) {
        live.add(p.uid);
        const e = propEl(p);
        e.el.style.transform = `translate3d(${p.x}px, ${model.propTop(p)}px, 0)`;
        const pseen = p.x + p.w > vw.x0 && p.x < vw.x1;
        if (e.seen !== pseen) {
          e.seen = pseen;
          e.el.style.visibility = pseen ? "" : "hidden";
        }
      }
      for (const [u, e] of els) {
        if (live.has(u)) continue;
        e.el.remove();
        els.delete(u);
      }
      rafId = raf(step);
    };

    const api = {
      el: win,
      plan,
      model,
      start() {
        layout();
        model.begin();
        if (root.addEventListener) root.addEventListener("resize", layout);
        // the play area or the sidebar can change size without a window resize (the frame's sidebar settling)
        if (typeof root.ResizeObserver === "function") {
          ro = new root.ResizeObserver(() => layout());
          ro.observe(win);
          if (o.under) ro.observe(o.under);
        }
        handle();
        rafId = raf(step);
      },
      stop() {
        stopped = true;
        caf(rafId);
        if (ro) ro.disconnect();
        if (root.removeEventListener) root.removeEventListener("resize", layout);
      },
      layout,
      setSpeed(name) {
        model.setSpeed(name, "lab");
        handle();
      },
      state: () => (model.done ? "end" : "ride"),
      result: () => model.result(),
      /** the first-time help (RIDE-10): the thing asked for glows and bounces now -> its uid (null: nothing asked) */
      help() {
        if (!model.help()) return null;
        handle();
        const c = model.open();
        return c && c.namedTh ? c.namedTh.uid : null;
      },
      /** a thing tapped as the child would tap it (the help's finger taps it for the child) */
      tap(uid) {
        const th = model.things.find((x) => x.uid === uid);
        if (th) tap(th);
      },
      /** where a thing's middle will be (page px) after `ms` of real time at the road's speed now: the finger aims there */
      ahead(uid, ms = 0) {
        const e = els.get(uid);
        const th = model.things.find((x) => x.uid === uid);
        if (!e || !th) return null;
        const r = e.el.getBoundingClientRect();
        if (!r.width) return null;
        const dx = model.vel() * model.speedOf(th) * ms * speed * fit.s;
        return { x: r.left + r.width / 2 - dx, y: r.top + r.height * 0.55, w: r.width, h: r.height };
      },
      /** what the ride wants now (window.njgTest): the named thing to tap once it has been asked for and shows */
      expect() {
        if (model.done) return { kind: "end" };
        const c = model.open();
        if (!c || !c.namedTh) return { kind: "wait" };
        if (model.share(c.namedTh) < 0.3) return { kind: "wait" };
        return { kind: "tap", sel: `.wr-thing[data-uid="${c.namedTh.uid}"]`, call: c.i, pass: c.pass, thing: c.named, glow: c.glow, others: c.members.filter((x) => x !== c.namedTh).map((x) => x.id) };
      },
      fit,
    };
    return api;
  };

  return W;
});
