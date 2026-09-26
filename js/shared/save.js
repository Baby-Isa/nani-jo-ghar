/*
 * One save for the whole game ("one app, one save", phase B, 26 Sept 2026).
 * docs/shared-api.md section 11 is the contract.
 *
 * Every mode reads and writes its progress through this module, through a
 * small adapter in that mode (Cook's core.js; UIStore for bests, onboarding
 * "seen" flags and the clinic; speech.js for voice enrolment). Nothing else
 * touches storage for play progress.
 *
 * LAYOUT (localStorage; synchronous, so every mode's existing synchronous
 * load/save keeps working unchanged):
 *   "njg-save"                 the root: {schema, current, players: [{id, name, colour, created, auto?}], migrated: {...}}
 *   "njg-save:<player>:<ns>"   one key per player per namespace:
 *        cook    Cook.save as it always was (coins, days, words = word stages, best = stars,
 *                taught, and the find/dress/snap sub-objects that share Cook's save)
 *        ui      UIStore's object: {bests, onboarded, seen, clinic: {state}}
 *        speech  voice enrolment: {choice: [packed takes]}
 *        shell   the shell's own flags: {firstDone, ...}
 * A namespace is any short name; a new mode just picks one.
 *
 * MIGRATION: the first time Save runs on a device with no root, the old
 * per-mode keys (njg-cook-v1, njg-shared-ui-fallback-v1, njg-speech-enrol-v1,
 * njg_quilt_v1)
 * are copied into a first player, so nobody loses progress. The old keys are
 * left where they are (never deleted), as a way back.
 *
 * Every storage access is wrapped: with storage blocked (a private window),
 * Save keeps everything in memory for the visit and Save.persistent() is false.
 *
 *   Save.init()                          load (and migrate once); called by everything below
 *   Save.players() / current() / currentId()
 *   Save.addPlayer({name, colour}) -> player     Save.select(id)      Save.updatePlayer(id, {name, colour})
 *   Save.removePlayer(id)                Save.ensurePlayer() -> the current player, creating "Player 1" if none
 *   Save.get(ns) -> object (a copy; {} when empty)    Save.set(ns, obj)    Save.update(ns, fn)
 *   Save.flag(name) / Save.setFlag(name, value)       the shell namespace
 *   Save.exportJSON() -> string          Save.importJSON(text) -> {players, added, replaced}
 *   Save.persistent()                    false when storage is blocked (memory only)
 *   Save.use(storage)                    tests: any {getItem, setItem, removeItem, key, length}
 *
 * Plain <script>: window.Save (and Shared.save); Node: require().
 */
(function (root, factory) {
  const Save = factory(root);
  if (typeof module === "object" && module.exports) module.exports = Save;
  else {
    root.Save = Save;
    (root.Shared = root.Shared || {}).save = Save;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const SCHEMA = 1;
  const ROOT_KEY = "njg-save";
  const FORMAT = "nani-jo-ghar-save";
  // the old per-mode keys and the namespace each one becomes
  const LEGACY = [
    { key: "njg-cook-v1", ns: "cook" },
    { key: "njg-shared-ui-fallback-v1", ns: "ui" },
    { key: "njg-speech-enrol-v1", ns: "speech" },
    // the fruit-bowl prototype's quilt when it ran without a profile (bowl.html keeps its own IndexedDB profiles)
    { key: "njg_quilt_v1", ns: "bowl" },
  ];
  const COLOURS = ["#c0392b", "#2e86c1", "#27ae60", "#8e44ad", "#e67e22", "#16a085", "#d35486", "#7f6a4d"];

  const Save = { SCHEMA, ROOT_KEY, FORMAT, LEGACY, COLOURS };

  /* ---------------- storage, always wrapped ---------------- */
  let store = null; // the backend in use
  let mem = null; // memory fallback (blocked storage)
  let persistent = true;
  const memoryStore = () => {
    const m = new Map();
    return {
      getItem: (k) => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => m.set(k, String(v)),
      removeItem: (k) => m.delete(k),
      key: (i) => Array.from(m.keys())[i] || null,
      get length() {
        return m.size;
      },
    };
  };
  function backend() {
    if (store) return store;
    try {
      const ls = root && root.localStorage;
      const probe = "njg-save-probe";
      ls.setItem(probe, "1");
      ls.removeItem(probe);
      store = ls;
      persistent = true;
    } catch (e) {
      store = mem = mem || memoryStore();
      persistent = false;
    }
    return store;
  }
  function read(key) {
    try {
      const raw = backend().getItem(key);
      return raw == null ? null : JSON.parse(raw);
    } catch (e) {
      return null; // unreadable or corrupt: treated as empty
    }
  }
  function write(key, value) {
    try {
      backend().setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      // quota or blocked mid-visit: keep playing from memory
      try {
        if (!mem) {
          mem = memoryStore();
          const old = store;
          for (let i = 0; old && i < old.length; i++) {
            const k = old.key(i);
            if (k && k.startsWith(ROOT_KEY)) mem.setItem(k, old.getItem(k));
          }
        }
        store = mem;
        persistent = false;
        mem.setItem(key, JSON.stringify(value));
      } catch (e2) {
        /* nothing more to do */
      }
      return false;
    }
  }
  function remove(key) {
    try {
      backend().removeItem(key);
    } catch (e) {
      /* ignore */
    }
  }
  function keys() {
    const out = [];
    try {
      const s = backend();
      for (let i = 0; i < s.length; i++) out.push(s.key(i));
    } catch (e) {
      /* ignore */
    }
    return out;
  }
  const nsKey = (pid, ns) => `${ROOT_KEY}:${pid}:${ns}`;

  /** Tests (and the Node leak bots): plug in any Storage-like object; null = back to localStorage. */
  Save.use = function (s) {
    store = s || null;
    mem = null;
    persistent = true;
    rootCache = null;
    return Save;
  };
  Save.memoryStore = memoryStore;
  Save.persistent = () => (backend(), persistent);

  /* ---------------- the root, and migration ---------------- */
  let rootCache = null;
  const blankRoot = () => ({ schema: SCHEMA, current: null, players: [], migrated: {} });

  // schema steps: MIGRATIONS[n] turns a schema-n root (and its keys) into n+1
  const MIGRATIONS = {
    // 0 -> 1: the per-mode keys from before the shell become the first player
    0(r) {
      const found = LEGACY.filter((l) => read(l.key) != null);
      if (!found.length) return r;
      const p = newPlayer(r, { name: "Player 1", auto: true });
      found.forEach((l) => {
        write(nsKey(p.id, l.ns), read(l.key));
        r.migrated[l.key] = { player: p.id, ns: l.ns, at: new Date().toISOString() };
      });
      r.current = p.id;
      return r;
    },
  };
  Save.MIGRATIONS = MIGRATIONS;

  function migrate(r) {
    r = Object.assign(blankRoot(), r || {}, { schema: (r && r.schema) || 0 });
    while (r.schema < SCHEMA) {
      const step = MIGRATIONS[r.schema];
      if (step) r = step(r) || r;
      r.schema++;
    }
    return r;
  }

  // the root is missing or corrupt but players' keys are there: rebuild the list from them
  function recover() {
    const ids = [];
    keys().forEach((k) => {
      const m = k && k.match(/^njg-save:([\w-]+):[\w-]+$/);
      if (m && !ids.includes(m[1])) ids.push(m[1]);
    });
    if (!ids.length) return null;
    const r = blankRoot();
    ids.forEach((id, i) => r.players.push({ id, name: `Player ${i + 1}`, colour: COLOURS[i % COLOURS.length], created: new Date().toISOString(), auto: true }));
    r.current = ids[0];
    r.recovered = new Date().toISOString();
    return r;
  }

  Save.init = function () {
    if (rootCache) return rootCache;
    let had = read(ROOT_KEY);
    const recovered = !had && (had = recover());
    rootCache = migrate(had);
    if (!rootCache.players.some((p) => p.id === rootCache.current)) rootCache.current = rootCache.players.length ? rootCache.players[0].id : null;
    if (!had || recovered || had.schema !== rootCache.schema || had.current !== rootCache.current) write(ROOT_KEY, rootCache);
    return rootCache;
  };
  const R = () => Save.init();
  const saveRoot = () => write(ROOT_KEY, R());

  // another tab (the shell and a mode open at once) changed the save: re-read it
  if (root && typeof root.addEventListener === "function") {
    try {
      root.addEventListener("storage", (e) => {
        if (!e.key || e.key === ROOT_KEY) rootCache = null;
      });
    } catch (e) {
      /* ignore */
    }
  }

  /* ---------------- players ---------------- */
  function newPlayer(r, o = {}) {
    let id;
    do id = "p" + Math.random().toString(36).slice(2, 8);
    while (r.players.some((p) => p.id === id));
    const p = {
      id,
      name: String(o.name || `Player ${r.players.length + 1}`).slice(0, 24),
      colour: o.colour || COLOURS[r.players.length % COLOURS.length],
      created: new Date().toISOString(),
    };
    if (o.auto) p.auto = true;
    r.players.push(p);
    return p;
  }
  const copy = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));
  Save.players = () => copy(R().players);
  Save.currentId = () => R().current;
  Save.current = () => copy(R().players.find((p) => p.id === R().current) || null);
  Save.player = (id) => copy(R().players.find((p) => p.id === id) || null);

  let askedPersist = false;
  function askPersist() {
    // ask the browser not to clear the save (the Roadmap's storage rules); best effort
    if (askedPersist) return;
    askedPersist = true;
    try {
      const n = root && root.navigator;
      if (n && n.storage && n.storage.persist) n.storage.persist().catch(() => {});
    } catch (e) {
      /* ignore */
    }
  }
  Save.addPlayer = function (o = {}) {
    const p = newPlayer(R(), o);
    R().current = p.id;
    saveRoot();
    askPersist();
    emit("player", p.id);
    return copy(p);
  };
  Save.select = function (id) {
    if (!R().players.some((p) => p.id === id)) return false;
    R().current = id;
    saveRoot();
    emit("player", id);
    return true;
  };
  Save.updatePlayer = function (id, o = {}) {
    const p = R().players.find((q) => q.id === id);
    if (!p) return null;
    if (o.name != null && String(o.name).trim()) p.name = String(o.name).trim().slice(0, 24);
    if (o.colour) p.colour = o.colour;
    delete p.auto; // a grown-up has named them
    saveRoot();
    emit("player", id);
    return copy(p);
  };
  Save.removePlayer = function (id) {
    const r = R();
    const i = r.players.findIndex((p) => p.id === id);
    if (i < 0) return false;
    r.players.splice(i, 1);
    keys()
      .filter((k) => k && k.startsWith(`${ROOT_KEY}:${id}:`))
      .forEach(remove);
    if (r.current === id) r.current = r.players.length ? r.players[0].id : null;
    saveRoot();
    emit("player", r.current);
    return true;
  };
  /** The current player, making "Player 1" first if there is nobody (a mode page opened on its own). */
  Save.ensurePlayer = function () {
    if (!R().current) Save.addPlayer({ name: "Player 1", auto: true });
    return Save.current();
  };

  /* ---------------- namespaces ---------------- */
  const pid = (id) => id || Save.ensurePlayer().id;
  /** A copy of the namespace's object for the current player ({} when there's nothing yet). */
  Save.get = function (ns, playerId) {
    const v = read(nsKey(pid(playerId), ns));
    return v && typeof v === "object" ? v : {};
  };
  Save.has = (ns, playerId) => read(nsKey(pid(playerId), ns)) != null;
  Save.set = function (ns, value, playerId) {
    const ok = write(nsKey(pid(playerId), ns), value == null ? {} : value);
    emit("data", ns);
    return ok;
  };
  Save.update = function (ns, fn, playerId) {
    const d = Save.get(ns, playerId);
    const out = fn(d);
    Save.set(ns, out === undefined ? d : out, playerId);
    return out === undefined ? d : out;
  };
  Save.clear = function (ns, playerId) {
    remove(nsKey(pid(playerId), ns));
    emit("data", ns);
  };
  Save.namespaces = function (playerId) {
    const pre = `${ROOT_KEY}:${pid(playerId)}:`;
    return keys()
      .filter((k) => k && k.startsWith(pre))
      .map((k) => k.slice(pre.length));
  };
  // the shell's flags
  Save.flag = (name, playerId) => Save.get("shell", playerId)[name];
  Save.setFlag = (name, value, playerId) => Save.update("shell", (d) => ((d[name] = value), d), playerId);

  /* ---------------- export / import (a file for a parent) ---------------- */
  Save.exportJSON = function () {
    const r = R();
    const players = {};
    r.players.forEach((p) => {
      players[p.id] = {};
      Save.namespaces(p.id).forEach((ns) => (players[p.id][ns] = read(nsKey(p.id, ns))));
    });
    return JSON.stringify({ format: FORMAT, schema: SCHEMA, exported: new Date().toISOString(), root: { current: r.current, players: r.players }, data: players }, null, 1);
  };
  /** Players in the file are added, or replace the player with the same id; everyone else is kept. */
  Save.importJSON = function (text) {
    let f;
    try {
      f = typeof text === "string" ? JSON.parse(text) : text;
    } catch (e) {
      throw new Error("That file isn't a Nani jo Ghar save.");
    }
    if (!f || f.format !== FORMAT || !f.root || !Array.isArray(f.root.players)) throw new Error("That file isn't a Nani jo Ghar save.");
    if ((f.schema || 0) > SCHEMA) throw new Error("That save is from a newer version of the game.");
    const r = R();
    let added = 0;
    let replaced = 0;
    f.root.players.forEach((fp) => {
      if (!fp || !fp.id || !/^[\w-]{1,40}$/.test(fp.id)) return;
      const i = r.players.findIndex((p) => p.id === fp.id);
      const p = { id: fp.id, name: String(fp.name || "Player").slice(0, 24), colour: fp.colour || COLOURS[0], created: fp.created || new Date().toISOString() };
      if (i >= 0) {
        replaced++;
        keys()
          .filter((k) => k && k.startsWith(`${ROOT_KEY}:${p.id}:`))
          .forEach(remove);
        r.players[i] = p;
      } else {
        added++;
        r.players.push(p);
      }
      const d = (f.data && f.data[p.id]) || {};
      Object.keys(d).forEach((ns) => /^[\w-]{1,40}$/.test(ns) && d[ns] != null && write(nsKey(p.id, ns), d[ns]));
    });
    if (!r.players.some((p) => p.id === r.current)) r.current = f.root.current && r.players.some((p) => p.id === f.root.current) ? f.root.current : (r.players[0] || {}).id || null;
    saveRoot();
    emit("player", r.current);
    return { players: r.players.length, added, replaced };
  };

  /* ---------------- change events ---------------- */
  const listeners = [];
  function emit(kind, what) {
    listeners.slice().forEach((fn) => {
      try {
        fn(kind, what);
      } catch (e) {
        /* a listener's problem is its own */
      }
    });
  }
  Save.onChange = (fn) => (listeners.push(fn), () => listeners.splice(listeners.indexOf(fn), 1));

  return Save;
});
