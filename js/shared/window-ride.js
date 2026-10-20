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
 *   about 9 s (slow), 6 s (normal) and 3.3 s (fast), scaled by the window's own width, so every screen gets the same time.
 *
 *   The game: look-alikes come by together (a group is k things of one family: animals, doors) and any member may be the one
 *   named, so only the word decides (the Kutchi leak test, non-negotiable 6). Nani asks as the group comes into view, when
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
  W.SPEEDS = { slow: 9000, normal: 6000, fast: 3300 };
  W.SPEED_ORDER = ["slow", "normal", "fast"];
  W.FADE = 0.1; // the cross-fade: each copy of a layer fades in over the outer tenth of the one before
  const LINES = { near: { y: 800, scale: 1, layer: "near" }, field: { y: 676, scale: 0.55, layer: "middle", edge: 652 } };
  const LAYER_SPEED = { far: 0.15, middle: 0.4, near: 1 };
  const CALL_SHARE = 0.45; // every member at least this much in view before Nani asks
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

  /** A group for a named thing: it and k-1 look-alikes of its family, in a random order. */
  W.groupFor = function (named, members, k, rng) {
    const others = shuffle(members.filter((m) => m !== named), rng).slice(0, Math.max(1, Math.min(k, members.length) - 1));
    return shuffle([named, ...others], rng);
  };

  /**
   * The round: `calls` groups, each k look-alikes of one family in a random order, one of them named; families take turns as
   * evenly as the calls allow (weighted by size); the named thing is never the same twice running. The first group comes on
   * the near verge; later ones on the field behind at the level's fieldShare.
   */
  W.plan = function (ride, level, rng = Math.random, { callable = () => true } = {}) {
    const L = W.levelOf(ride, level);
    const fam = W.families(ride, callable);
    const families = Object.keys(fam);
    const base = { level: L.level, card: L.card || "open", speeds: L.speeds || [], families: fam, group: L.group || 3, fieldShare: L.fieldShare != null ? L.fieldShare : 0.3 };
    if (!families.length) return Object.assign(base, { calls: [] });
    const bag = [];
    families.forEach((f) => fam[f].forEach(() => bag.push(f)));
    const calls = [];
    const used = new Set();
    let last = null;
    for (let i = 0; i < L.calls; i++) {
      const f = bag[Math.floor(rng() * bag.length)];
      // a thing not named yet if the family has one (the card lists each thing once where it can), never the last one again
      const fresh = fam[f].filter((g) => !used.has(g) && g !== last);
      const pool = fresh.length ? fresh : fam[f].filter((g) => g !== last);
      const named = pool[Math.floor(rng() * pool.length)];
      used.add(named);
      const group = W.groupFor(named, fam[f], L.group || 3, rng);
      calls.push({ group, named, family: f, line: i === 0 ? "near" : rng() < base.fieldShare ? "field" : "near" });
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
    const lines = { near: Object.assign({}, LINES.near, (view.lines || {}).near), field: Object.assign({}, LINES.field, (view.lines || {}).field) };
    const layerSpeed = (id) => {
      const l = (view.layers || []).find((x) => x.id === id);
      return l && l.speed != null ? l.speed : LAYER_SPEED[id] || 1;
    };
    const lineSpeed = { near: layerSpeed(lines.near.layer), field: layerSpeed(lines.field.layer) };
    const speeds = Object.assign({}, W.SPEEDS, ride.speeds || {});
    const easeMs = ride.easeMs || 1000;
    const gapK = view.gapK != null ? view.gapK : 0.15;
    const passOnly = Object.keys(things).filter((id) => things[id]);
    const propIds = Object.keys(propDefs);
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
    const sizeOf = (id, line) => {
      const d = things[id] || {};
      const H = itemH * (d.h || 1) * lines[line].scale;
      const Wd = H * (d.ratio || 1);
      return { artW: Wd, artH: H, w: Math.max(Wd, minPx), h: Math.max(H, minPx) };
    };
    const topOf = (th) => lines[th.line].y - th.h;
    const inView = (th) => th.x + th.w > vx0 && th.x < vx1;
    m.inView = inView;
    m.topOf = topOf;
    const mk = (id, line, x, member) => {
      const s = sizeOf(id, line);
      const th = Object.assign({ uid: ++uid, id, line, x, member: member == null ? -1 : member, got: false }, s);
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
        if (c.members.some((o) => m.share(o) < 0.0 || hiddenBy(o, p) > 0.5)) m.props.pop();
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
      emit({ type: "call", i: c.i, pass: c.pass, uid: c.namedTh.uid, id: c.named, glow: c.glow });
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
      c.group = W.groupFor(c.named, f, Math.max(2, c.group.length), rng);
      c.line = rng() < (plan.fieldShare != null ? plan.fieldShare : 0.3) ? "field" : "near";
      nextGroupAt = m.road + viewW() * 0.12;
    }

    /** a tap on a thing: {counted, ok} */
    m.tap = function (u) {
      const th = m.things.find((o) => o.uid === u);
      if (!th || th.got || m.done) return { counted: false };
      const c = m.open();
      if (!c) {
        emit({ type: "idle-tap", uid: u, id: th.id });
        return { counted: false };
      }
      if (u === c.namedTh.uid) {
        th.got = true;
        const res = c.pass === 1 && !c.glow && c.wrong === 0 ? "right" : "helped";
        c.state = "found";
        c.result = res;
        m.found += 1;
        emit({ type: "found", i: c.i, pass: c.pass, uid: u, id: c.named, res });
        c.members.forEach((o) => o !== th && (o.member = -2));
        ci += 1;
        if (ci >= calls.length) endAt = m.t + 600;
        else {
          const want = plan.speeds && plan.speeds[ci];
          if (!opt.hold && want && want !== m.speed) m.setSpeed(want, "plan");
          nextGroupAt = m.road + viewW() * (0.28 + rng() * 0.2);
        }
        return { counted: true, ok: true };
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

    if (opt.hold) m.setSpeed(opt.hold, "hold");

    m.step = function (dt) {
      if (dt <= 0) return;
      m.t += dt;
      const d = vel() * dt;
      m.road += d;
      for (const th of m.things) th.x -= d * lineSpeed[th.line];
      for (const p of m.props) p.x -= d * lineSpeed.near;
      const c = calls[ci];
      if (c && !m.done) {
        if (c.state === "wait" && m.road >= nextGroupAt) {
          // one group at a time: the last one's members gone by, no thing of this group's on screen, room where it comes on
          const span = c.group.reduce((a, id) => a + sizeOf(id, c.line).w, 0) + itemH * gapK * c.group.length;
          if (!membersAround() && !idsAround(c.group) && regionClear(c.line, vx1, vx1 + span + 40, c.line === "near")) spawnGroup(c);
        } else if (c.state === "coming") {
          const lead = c.members.reduce((a, o) => (o.x < a.x ? o : a), c.members[0]);
          const rel = (lead.x + lead.w / 2 - vx0) / viewW();
          if (rel < LEAD_MIN) passEnded(c, "unasked");
          else if (c.members.every((o) => m.share(o) >= CALL_SHARE)) ask(c);
        } else if (c.state === "asked") {
          if (!c.glow && m.t - c.firstAt >= hintMs) {
            c.glow = true;
            emit({ type: "glow", i: c.i, why: "wait" });
          }
          if (c.namedTh.x + c.namedTh.w < vx0) passEnded(c, "missed");
        }
      }
      // unasked things pass between the groups (never one of the current or next group's things: two goats would be unfair)
      const cur = calls[ci];
      const blocked = cur && ((cur.state === "wait" && m.road >= nextGroupAt - viewW() * 0.1) || cur.state === "coming");
      if (!m.done && passOnly.length && m.road >= nextPasserAt && !blocked) {
        const res = reserved();
        const pool = passOnly.filter((id) => !res.has(id));
        const line = fieldLive() ? "field" : rng() < 0.5 ? "near" : "field";
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
      // things gone by leave
      m.things = m.things.filter((o) => o.x + o.w > vx0 - 60 || (calls[ci] && calls[ci].namedTh === o));
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
.wr-car > img { position: absolute; top: 0; display: block; user-select: none; -webkit-user-drag: none; }
.wr-car > img.wr-car-side { object-fit: fill; }
.wr-lane .wr-thing { left: 0; top: 0; }
.wr-body { position: absolute; display: block; pointer-events: none; }
.wr-body > img, .wr-body > svg { width: 100%; height: 100%; object-fit: contain; object-position: 50% 100%; display: block; }
.wr-thing .wr-contact { z-index: 0; }
.wr-prop { position: absolute; left: 0; top: 0; pointer-events: none; }
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
  W.layerStrip = function (doc, def, url, useArt) {
    const tile = def.tile || 1600;
    const period = tile * (1 - W.FADE);
    const n = Math.ceil(SCENE.w / period) + 3;
    const strip = doc.createElement("div");
    strip.className = "wr-band wr-layer";
    strip.dataset.band = def.id;
    Object.assign(strip.style, { top: `${def.y}px`, height: `${def.h}px`, width: `${period * n + tile}px` });
    const mask = `linear-gradient(to right, transparent 0, #000 ${(W.FADE * 100).toFixed(1)}%, #000 100%)`;
    for (let i = 0; i < n; i++) {
      const t = doc.createElement("div");
      t.className = "wr-tile";
      Object.assign(t.style, { left: `${i * period}px`, width: `${tile}px`, height: `${def.h}px` });
      t.style.webkitMaskImage = mask;
      t.style.maskImage = mask;
      if (useArt && def.art) {
        const im = doc.createElement("img");
        im.alt = "";
        im.draggable = false;
        im.src = url(def.art);
        t.appendChild(im);
      } else t.appendChild(W.shapesSvg(def.shapes, tile, def.h));
      strip.appendChild(t);
    }
    return { strip, period, def };
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
    const model = W.model(ride, plan, { rng: o.rng || Math.random, hintMs: o.hintMs, hold: o.hold || null });

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
    // back to front: far, middle, the field's things, near, the verge's things, the props
    addLayer("far");
    addLayer("middle");
    lane.field = h("div", "wr-lane wr-line-field", scene);
    addLayer("near");
    lane.near = h("div", "wr-lane wr-line-near", scene);
    const propLane = h("div", "wr-lane wr-props", scene);
    // the frame: the keyed car window fitted by height, its sides extended by its own outer columns (pillar and seat)
    const fr = view.frame || {};
    const car = useArt && fr.art ? h("div", "wr-car", win) : null;
    const frameEl = car ? null : h("div", "wr-frame", win);
    let carImg = null;
    let carL = null;
    let carR = null;
    if (car) {
      carL = h("img", "wr-car-side", car);
      carR = h("img", "wr-car-side", car);
      carImg = h("img", "wr-car-main", car);
      [carL, carR, carImg].forEach((im) => {
        im.alt = "";
        im.draggable = false;
      });
      carImg.src = url(fr.art);
      if (fr.left) carL.src = url(fr.left);
      if (fr.right) carR.src = url(fr.right);
    }

    const fit = { s: 1, tx: 0, open: null, vl: 0, vt: 0 };
    const BLEED = 4;
    function layout() {
      const W0 = win.clientWidth || 1;
      const H0 = win.clientHeight || 1;
      let op = { l: 0, t: 0, r: W0, b: H0 };
      if (car) {
        const fw0 = fr.w || 1536;
        const fh0 = fr.h || 1024;
        const k = H0 / fh0;
        const fw = fw0 * k;
        const fx = (W0 - fw) / 2;
        Object.assign(carImg.style, { left: `${fx}px`, width: `${fw}px`, height: `${H0}px` });
        Object.assign(carL.style, { left: "0px", width: `${Math.max(0, fx) + 2}px`, height: `${H0}px`, display: fx > 0 ? "block" : "none" });
        Object.assign(carR.style, { left: `${fx + fw - 2}px`, width: `${Math.max(0, W0 - fx - fw) + 2}px`, height: `${H0}px`, display: fx > 0 ? "block" : "none" });
        const o4 = fr.opening || [0, 0, fw0, fh0];
        op = { l: Math.max(0, fx + o4[0] * k), t: o4[1] * k, r: Math.min(W0, fx + o4[2] * k), b: o4[3] * k };
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
      const ct = h("i", "wr-contact", b);
      Object.assign(ct.style, { left: `${(th.w - th.artW * 0.64) / 2}px`, right: "auto", width: `${th.artW * 0.64}px` });
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
      const occ = model.inFront(th).map(rectStr).join(";");
      const op = fit.open;
      const pr = win.getBoundingClientRect();
      const edge = th.line === "field" ? Math.round(toScreen(0, model.lines.field.edge).y) : "";
      note("ride-call", ev.i, `thing:${th.id} pass:${ev.pass} line:${th.line} speed:${model.speed} box:${rectStr({ x: th.x, y: top, w: th.w, h: th.h })} open:${Math.round(pr.left + op.l)},${Math.round(pr.top + op.t)},${Math.round(pr.left + op.r)},${Math.round(pr.top + op.b)} occ:${occ} edge:${edge}`);
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
    const step = (now) => {
      if (stopped) return;
      if (last == null) last = now;
      const dt = Math.min(100, now - last) * speed;
      last = now;
      model.step(dt);
      handle();
      // the layers: each at its own share of the road, one copy left of the window so the first fade never shows
      Object.values(layers).forEach((L) => {
        const off = (model.road * (L.def.speed != null ? L.def.speed : 1)) % L.period;
        L.strip.style.transform = `translate3d(${(-off - L.period).toFixed(1)}px, 0, 0)`;
      });
      const open = model.open();
      const vw = model.view();
      const live = new Set();
      for (const th of model.things) {
        live.add(th.uid);
        const e = thingEl(th);
        const b = e.el;
        b.style.transform = `translate3d(${th.x.toFixed(1)}px, ${model.topOf(th).toFixed(1)}px, 0)`;
        // off the window (behind the frame or the sidebar): hidden, so it is never seen or tapped there
        const seen = th.x + th.w > vw.x0 && th.x < vw.x1;
        b.style.visibility = seen ? "" : "hidden";
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
        e.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${model.propTop(p).toFixed(1)}px, 0)`;
        e.el.style.visibility = p.x + p.w > vw.x0 && p.x < vw.x1 ? "" : "hidden";
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
        if (root.addEventListener) root.addEventListener("resize", layout);
        handle();
        rafId = raf(step);
      },
      stop() {
        stopped = true;
        caf(rafId);
        if (root.removeEventListener) root.removeEventListener("resize", layout);
      },
      layout,
      setSpeed(name) {
        model.setSpeed(name, "lab");
        handle();
      },
      state: () => (model.done ? "end" : "ride"),
      result: () => model.result(),
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
