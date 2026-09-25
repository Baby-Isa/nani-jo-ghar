/*
 * Cook with Nani: the building blocks under every station.
 *
 * MECHANIC  one verb (pour, roll, tawa, thread…), defined once in
 *           js/cook/mechanics/<id>.js with Cook.Mech.define(id, {...}).
 *           It runs inside a ZONE and knows nothing about where it is.
 * ZONE      a rectangle of the 1600x900 play area plus services: it maps
 *           the mechanic's own layout (drawn for the full screen) into the
 *           rectangle, filters input to it, owns its per-frame ticks, says
 *           what the player should do next (for the test), and passes
 *           scores and mistakes up. A zone can have children (two tawas,
 *           three skewers), each with its own timer.
 * STATION   what the player sees as one screen:
 *            - a single mechanic, full screen: Cook.Mech.station(id, …),
 *              which is exactly the Phase A station;
 *            - a COMBINED station: Cook.Mech.combined(id, {zones: […]}),
 *              2-3 zones side by side (or a main zone and a side rack),
 *              items routed between them through named channels, one set
 *              of stars. Each lives in its own js/cook/stations/<id>.js.
 * KNOBS     every difficulty setting comes from data: data.mechanics[id]
 *           .levels[n] (each level only lists what changes), then an
 *           optional profile ("cup", "water"), then owned upgrades'
 *           `knobs`. Code has no tuning constants.
 *
 * Zone API (what a mechanic's run(z, params, k) gets):
 *   z.X(x) z.Y(y) z.P(x, y) z.L(len) z.k    map design coords into the zone
 *   z.on(event, fn)  z.tick(fn)             input (filtered) and per-frame work
 *   z.io  z.expect(e)  z.gauge(g)           what the player should do next
 *   z.listen(ok, why)  z.skill(score, what) the ear and hand stars (+ hooks)
 *   z.progress(p)  z.say(line)  z.oops()    progress, Nani's lines
 *   z.emit(item)  z.take()  z.out  z.in     routing between zones
 *   z.child({region?})  z.split(n)          several instances at once
 *   z.passMeAfter(ms)                       let Nani interrupt here
 */
(function (global) {
  const Cook = global.Cook;
  const UI = Cook.UI;
  const Lang = Cook.Lang;
  const W = 1600;
  const H = 900;
  const FULL = { x: 0, y: 0, w: W, h: H };
  const M = (Cook.Mech = { defs: {}, combos: {}, labs: {}, labOrder: [] });

  /* ---------------- knobs (difficulty as data) ---------------- */
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  const clone = (v) => (v == null || typeof v !== "object" ? v : JSON.parse(JSON.stringify(v)));
  function merge(into, from) {
    Object.keys(from || {}).forEach((key) => {
      if (key === "profiles" || key.startsWith("_")) return;
      if (isObj(from[key]) && isObj(into[key])) into[key] = merge(Object.assign({}, into[key]), from[key]);
      else into[key] = clone(from[key]);
    });
    return into;
  }
  M.merge = merge;
  const spec = (id) => ((Cook.data && Cook.data.mechanics) || {})[id] || {};
  M.spec = spec;
  M.levelCount = (id) => Math.max(1, (spec(id).levels || []).length);
  /**
   * The knobs for mechanic `id` at `level`: levels 1..n merged in order
   * (so level 3 only lists what changes from level 2), then the profile at
   * each of those levels, then any owned upgrade's knobs for "id" or
   * "id.profile". An upgrade that changes a mechanic marks it `upgraded`.
   */
  M.knobs = function (id, { level = 1, profile } = {}) {
    const levels = spec(id).levels || [];
    const n = Cook.clamp(Math.round(Number(level)) || 1, 1, Math.max(1, levels.length));
    const out = {};
    for (let i = 0; i < n && i < levels.length; i++) merge(out, levels[i]);
    if (profile) for (let i = 0; i < n && i < levels.length; i++) merge(out, (levels[i].profiles || {})[profile]);
    (Cook.data.upgrades || []).forEach((u) => {
      if (!u.knobs || !Cook.hasUpgrade(u.id)) return;
      [id, profile && `${id}.${profile}`].forEach((key) => key && u.knobs[key] && merge(out, u.knobs[key]));
    });
    out.level = n;
    return out;
  };

  /* ---------------- the expectation hub ----------------
   * Cook.expect / Cook.gauge tell the test (and any future helper) what to
   * do next. With several zones live at once, each zone posts its own and
   * the hub publishes one: a timing ring first (the fullest), then taps,
   * holds and gestures, then "wait". One zone alone publishes exactly what
   * it posts, as the Phase A stations did. */
  const RANK = { timing: 9, hold: 8, tap: 7, count: 7, more: 7, knead: 7, swipe: 7, slice: 7, roll: 6, stir: 6, click: 5, wait: 0 };
  const Hub = (Cook.Hub = {
    slots: new Map(),
    current: null,
    reset() {
      this.slots = new Map();
      this.current = null;
      this.last = null;
    },
    set(zone, e) {
      if (e) this.slots.set(zone, e);
      else if (this.slots.has(zone)) this.slots.delete(zone);
      else return; // a zone only ever clears what it posted
      this.publish();
    },
    gauge(zone, g) {
      zone._gauge = g;
      if (!this.current || this.current === zone) Cook.gauge = g;
    },
    publish() {
      if (Cook.interrupting) return; // Nani's "pass me" owns the screen for now
      let best = null;
      let bz = null;
      let bs = -1;
      this.slots.forEach((e, z) => {
        const s = (RANK[e.kind] != null ? RANK[e.kind] : 5) * 10 + (e.kind === "timing" && z._gauge ? Math.min(1, z._gauge.level) : 0);
        if (s > bs || (s === bs && z.seq < bz.seq)) {
          best = e;
          bz = z;
          bs = s;
        }
      });
      this.current = bz;
      this.last = best;
      Cook.expect = best;
      if (bz && bz._gauge) Cook.gauge = bz._gauge;
    },
    /**
     * After an interruption: publish the zones' latest, or put back what was
     * there before (unless it was a zone's, and that zone has since finished).
     */
    republish(prev) {
      if (this.slots.size) this.publish();
      else Cook.expect = prev && prev === this.last ? null : prev;
    },
  });
  // the default io, for code that isn't in a zone
  Cook.IO = { expect: (e) => (Cook.expect = e), gauge: (g) => (Cook.gauge = g) };

  /* ---------------- channels: routing items between zones ---------------- */
  class Channel {
    constructor(name) {
      this.name = name;
      this.q = [];
      this.waiters = [];
      this.closed = false;
      this.listeners = [];
    }
    put(item) {
      this.listeners.forEach((fn) => fn(item));
      const w = this.waiters.shift();
      if (w) w(item);
      else this.q.push(item);
    }
    /** Resolves with the next item, or null once it's closed and empty. */
    take() {
      if (this.q.length) return Promise.resolve(this.q.shift());
      if (this.closed) return Promise.resolve(null);
      return new Promise((resolve) => this.waiters.push(resolve));
    }
    close() {
      this.closed = true;
      this.waiters.splice(0).forEach((w) => w(null));
    }
    get length() {
      return this.q.length;
    }
  }
  M.Channel = Channel;
  /** A channel already holding `items` and closed: a standalone mechanic's own queue. */
  M.queue = (items) => {
    const c = new Channel("local");
    items.forEach((it) => c.q.push(it));
    c.closed = true;
    return c;
  };

  /* ---------------- zones ---------------- */
  let zoneSeq = 0;
  class Zone {
    /**
     * opts: region {x,y,w,h} (world px; omit for the whole screen, drawn
     * exactly as designed), footprint (the part of the 1600x900 design
     * the mechanic uses, fitted into the region), level, hooks
     * {onProgress, onDone, onScore, onMistake}, in/out channels, parent.
     */
    constructor(S, ctx, opts = {}) {
      this.S = S;
      this.ctx = ctx;
      this.seq = zoneSeq++;
      this.id = opts.id || "zone";
      this.parent = opts.parent || null;
      this.hooks = opts.hooks || {};
      this.level = opts.level || (ctx && ctx.level) || 1;
      this.in = opts.in || null;
      this.out = opts.out || null;
      const inherit = this.parent && !opts.region;
      this.full = inherit ? this.parent.full : !opts.region;
      this.region = inherit ? this.parent.region : opts.region || FULL;
      if (inherit) {
        // same drawing space as the parent, own timer / expectation / input
        Object.assign(this, { k: this.parent.k, ox: this.parent.ox, oy: this.parent.oy });
      } else if (this.full) {
        this.k = 1;
        this.ox = 0;
        this.oy = 0;
      } else {
        const r = this.region;
        const fp = opts.footprint || FULL;
        this.k = Math.min(opts.maxScale || 1, r.w / fp.w, r.h / fp.h);
        this.ox = r.x + (r.w - fp.w * this.k) / 2 - fp.x * this.k;
        this.oy = r.y + (r.h - fp.h * this.k) / 2 - fp.y * this.k;
      }
      this.offs = [];
      this.owns = true;
      this.io = { expect: (e) => this.expect(e), gauge: (g) => this.gauge(g) };
      if (!this.full) {
        // input that starts outside the zone belongs to someone else
        const own = (p) => (this.owns = this.contains(p.worldX, p.worldY));
        S.input.on("pointerdown", own);
        this.offs.push(() => S.input.off("pointerdown", own));
      }
    }
    get guided() {
      return !!(this.ctx && this.ctx.guided);
    }
    /* geometry: the mechanic draws in 1600x900 design coords */
    X(x) {
      return this.ox + x * this.k;
    }
    Y(y) {
      return this.oy + y * this.k;
    }
    P(x, y) {
      return { x: this.X(x), y: this.Y(y) };
    }
    L(v) {
      return v * this.k;
    }
    contains(x, y) {
      const r = this.region;
      return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
    }
    /** The zone's rectangle in design coords (for spreading things across it). */
    get box() {
      const r = this.region;
      return { x0: (r.x - this.ox) / this.k, y0: (r.y - this.oy) / this.k, x1: (r.x + r.w - this.ox) / this.k, y1: (r.y + r.h - this.oy) / this.k };
    }
    /* input and frames */
    on(ev, fn) {
      const h = (p, ...rest) => {
        if (this.full) return fn(p, ...rest);
        if (ev === "pointerdown" ? this.contains(p.worldX, p.worldY) : this.owns) fn(p, ...rest);
      };
      this.S.input.on(ev, h);
      const off = () => this.S.input.off(ev, h);
      this.offs.push(off);
      return off;
    }
    tick(fn) {
      const off = this.S.addTick(fn);
      this.offs.push(off);
      return off;
    }
    expect(e) {
      Hub.set(this, e);
    }
    gauge(g) {
      Hub.gauge(this, g);
    }
    /* reporting: into the order's ctx (one set of stars) and the hooks */
    listen(ok, why) {
      if (this.ctx && this.ctx.listen) this.ctx.listen(ok, why);
      if (!ok) this.hook("onMistake", why);
    }
    skill(score, what) {
      if (this.ctx && this.ctx.skill) this.ctx.skill(score, what);
      this.hook("onScore", score, what);
    }
    progress(p) {
      this.hook("onProgress", p);
    }
    hook(name, ...args) {
      for (let z = this; z; z = z.parent) if (z.hooks[name]) return z.hooks[name](...args, this);
    }
    get result() {
      return this.ctx.result;
    }
    /* Nani */
    say(line, opts = {}) {
      return UI.say(line, { badge: true }, opts);
    }
    oops() {
      return this.say(Lang.line("oops"), { ms: 900 }).catch(() => {});
    }
    /** Nani may interrupt after ms (she decides; Busy keeps cooking). */
    passMeAfter(ms) {
      const ctx = this.ctx;
      if (ctx && ctx.maybePassMe) setTimeout(() => ctx.maybePassMe(), ms / Cook.speed);
    }
    /* routing */
    emit(item) {
      if (this.out) this.out.put(item);
      this.progress(item);
    }
    take() {
      return this.in ? this.in.take() : Promise.resolve(null);
    }
    /* several instances */
    child(opts = {}) {
      return new Zone(this.S, this.ctx, Object.assign({ level: this.level, in: this.in, out: this.out, id: `${this.id}.${this.kids = (this.kids || 0) + 1}` }, opts, { parent: this }));
    }
    /** n children side by side (dir "row") or stacked ("col"), each with the given footprint. */
    split(n, { dir = "row", footprint, gap = 0 } = {}) {
      const r = this.region;
      return Array.from({ length: n }, (_, i) => {
        const region =
          dir === "row"
            ? { x: r.x + (i * (r.w + gap)) / n, y: r.y, w: r.w / n - gap, h: r.h }
            : { x: r.x, y: r.y + (i * (r.h + gap)) / n, w: r.w, h: r.h / n - gap };
        return this.child({ id: `${this.id}.${i}`, region, footprint });
      });
    }
    close() {
      this.offs.splice(0).forEach((f) => f());
      Hub.set(this, null);
    }
  }
  M.Zone = Zone;
  M.zone = (S, ctx, opts) => new Zone(S, ctx, opts);

  /* ---------------- defining and running mechanics ---------------- */
  /**
   * def: {
   *   station: key in data.stations (goal line) — or (params) => key,
   *   view: "hob" | "wood" | "marble" | "pantry" (standalone background),
   *     omit station/view for a sub-step that runs in a scene someone
   *     else set up (pour, add, boil, count),
   *   footprint: {x, y, w, h} of the design it draws (for zone fitting),
   *   api: "name" — also exposed as Cook.Stations[name](S, ctx, params),
   *   run: async (z, params, k) => result,
   * }
   */
  M.define = function (id, def) {
    def.id = id;
    M.defs[id] = def;
    const api = def.api || id;
    Cook.Stations[api] = (S, ctx, params = {}, opts = {}) => M.station(id, S, ctx, params, opts);
    return def;
  };
  /** Run mechanic `id` inside zone z (no view change): the building block. */
  M.run = function (id, z, params = {}) {
    const def = M.defs[id];
    if (!def) throw new Error(`no mechanic ${id}`);
    const k = M.knobs(def.knobs || id, { level: params.level || z.level, profile: params.profile || (def.profile && def.profile(params)) });
    // its painted sprites first (data.art.sprites.need; usually already there from the station)
    return Cook.Art.need(z.S, id)
      .then(() => def.run(z, params, k))
      .then((r) => {
        z.hook("onDone", r);
        return r;
      });
  };
  /**
   * A mechanic as a station of its own: its view and goal (if it has
   * them), a zone (the whole screen unless opts.region), run, tidy up.
   */
  M.station = async function (id, S, ctx, params = {}, opts = {}) {
    const def = M.defs[id];
    const station = typeof def.station === "function" ? def.station(params) : def.station;
    if (station && def.view && !opts.noBegin) await Cook.Stations.begin(S, ctx, station, def.view);
    const z = opts.zone || new Zone(S, ctx, { id, level: opts.level || params.level || (ctx && ctx.level), region: opts.region, footprint: def.footprint });
    const r = await M.run(id, z, params);
    if (!opts.zone) z.close();
    if (station && def.view && !opts.noBegin) Cook.Stations.end();
    return r;
  };

  /* ---------------- combined stations ---------------- */
  /**
   * def: {
   *   station: key in data.stations (goal), view: background,
   *   zones: [{ id, mech, region: [x, y, w, h], footprint?, backdrop?,
   *             in?: "channel", out?: "channel", level?,
   *             params: (params, host) => mechanic params }],
   *   run?: async (host, params) => result   // optional custom driver
   * }
   * Knobs for the station itself live in data.mechanics[id] (or in
   * data/stations/<id>.json when def.dataFile is set); each zone's
   * mechanic reads its own knobs at the station's level unless the zone
   * or data.mechanics[id].levels[n].zones[zoneId] sets one.
   */
  M.combined = function (id, def) {
    def.id = id;
    def.combined = true;
    M.combos[id] = def;
    Cook.Stations[def.api || id] = (S, ctx, params = {}, opts = {}) => M.host(id, S, ctx, params, opts);
    if (def.dataFile) {
      Cook.onLoad.push(async (data) => {
        const extra = await fetch(def.dataFile)
          .then((r) => r.json())
          .catch(() => null);
        if (extra) {
          data.mechanics = data.mechanics || {};
          data.mechanics[id] = Object.assign({}, extra.mechanic || {}, data.mechanics[id] || {});
          if (extra.station) data.stations[id] = Object.assign({}, extra.station, data.stations[id] || {});
          if (extra.words) Object.keys(extra.words).forEach((w) => (data.words[w] = data.words[w] || extra.words[w]));
        }
      });
    }
    return def;
  };

  class Host {
    constructor(S, ctx, def, params, level) {
      this.S = S;
      this.ctx = ctx;
      this.def = def;
      this.params = params;
      this.level = level;
      this.knobs = M.knobs(def.id, { level });
      this.channels = {};
      this.zones = {};
      this.scores = {};
    }
    channel(name) {
      return (this.channels[name] = this.channels[name] || new Channel(name));
    }
    /** Build the zones: backdrop, region, channels, hooks that tally per zone. */
    build() {
      const S = this.S;
      this.def.zones.forEach((zd) => {
        const [x, y, w, h] = zd.region;
        if (zd.backdrop) {
          // the region shows a different worktop (wood chakla beside the hob)
          S.track(S.add.image(0, 0, Cook.Art.tex(S, zd.backdrop)).setOrigin(0).setCrop(x, y, w, h).setDepth(Cook.D.bg + 1));
        }
        const zk = ((this.knobs.zones || {})[zd.id] || {}).level;
        const mdef = M.defs[zd.mech];
        const z = new Zone(S, this.ctx, {
          id: zd.id,
          region: { x, y, w, h },
          footprint: zd.footprint || (mdef && mdef.footprint),
          level: zd.level || zk || this.level,
          in: zd.in ? this.channel(zd.in) : null,
          out: zd.out ? this.channel(zd.out) : null,
          hooks: {
            onScore: (score, what) => (this.scores[zd.id] = (this.scores[zd.id] || []).concat([{ what, score }])),
            onMistake: (why) => this.def.onMistake && this.def.onMistake(why, zd.id, this),
            onProgress: (p) => this.def.onProgress && this.def.onProgress(p, zd.id, this),
          },
        });
        z.def = zd;
        this.zones[zd.id] = z;
      });
      // a channel closes when every zone that fills it has finished
      this.producers = {};
      this.def.zones.forEach((zd) => zd.out && (this.producers[zd.out] = (this.producers[zd.out] || 0) + 1));
    }
    /** Run every zone at once; resolves with {zoneId: result}. */
    async runAll() {
      const out = {};
      await Promise.all(
        this.def.zones.map(async (zd) => {
          const z = this.zones[zd.id];
          const p = zd.params ? zd.params(this.params, this) : {};
          out[zd.id] = await M.run(zd.mech, z, p);
          if (zd.out && --this.producers[zd.out] === 0) this.channel(zd.out).close();
          if (this.def.onZoneDone) this.def.onZoneDone(zd.id, out[zd.id], this);
          z.close();
        })
      );
      return out;
    }
  }
  M.Host = Host;
  /** Run combined station `id`: one view, 2-3 zones, one set of stars. */
  M.host = async function (id, S, ctx, params = {}, opts = {}) {
    const def = M.combos[id];
    await Cook.Stations.begin(S, ctx, def.station || id, def.view || "marble");
    const host = new Host(S, ctx, def, params, opts.level || params.level || (ctx && ctx.level) || 1);
    host.build();
    const r = def.run ? await def.run(host, params) : await host.runAll();
    Cook.Stations.end();
    return r;
  };

  /* ---------------- the Station lab registry ----------------
   * Each mechanic file (and each combined station file) registers how the
   * lab tries it with a random order, so the lab list builds itself. */
  M.lab = function (key, { name, verb, run, after }) {
    M.labs[key] = { key, name, verb, run };
    const at = after ? M.labOrder.indexOf(after) : -1;
    if (at >= 0) M.labOrder.splice(at + 1, 0, key);
    else M.labOrder.push(key);
  };
  /**
   * Run lab entry `key`. opts: card(dish | lines, steps) opens the mission
   * card (a dish from R.<id>.make shows its order ladder; plain lines, one row each),
   * level (every mechanic runs at it), region (run it inside a smaller
   * zone: the test uses this to check every mechanic works as a zone).
   * An entry gets L = {S, ctx, level, region, card, station(id, params),
   * scene(stationKey, view) -> zone, run(id, zone, params)}.
   */
  M.runLab = async function (key, S, ctx, { card, level = 1, region } = {}) {
    if (key.startsWith("recipe:")) {
      // a whole recipe from the data, every station in turn (try a new dish here)
      const R = Cook.Recipes[key.slice(7)];
      const d = R.make(ctx.order.who, { level });
      ctx.level = level;
      ctx.steps = R.steps(d);
      card(d, ctx.steps);
      return R.run(S, ctx, d);
    }
    const entry = M.labs[key];
    if (!entry) throw new Error(`no lab entry ${key}`);
    ctx.level = level;
    const L = {
      S,
      ctx,
      level,
      region,
      card,
      station: (id, params = {}) => (M.combos[id] ? M.host(id, S, ctx, params, { level }) : M.station(id, S, ctx, params, { level, region })),
      async scene(station, view) {
        await Cook.Stations.begin(S, ctx, station, view);
        return new Zone(S, ctx, { id: "lab", level, region });
      },
      run: (id, z, params = {}) => M.run(id, z, params),
    };
    return entry.run(L);
  };
})(window);
