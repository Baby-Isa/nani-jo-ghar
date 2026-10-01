/*
 * The one save (target-model § 3.4; rule J3), as an ES module: today's js/shared/save.js with the same API
 * and the same storage keys, at schema 2. The classic js/shared/save.js stays on the live pages until each
 * page moves to modules (R4 Cook, R5 the clinic); both read and write the same keys, and the classic one
 * reads a schema-2 save without changing it (build/core/save.test.mjs checks that).
 *
 * LAYOUT (localStorage; synchronous):
 *   "njg-save"                 the root: {schema, current, players: [...], migrated: {...}, settings?, lang, content}
 *   "njg-save:<player>:<ns>"   one key per player per namespace (the table is NAMESPACES below)
 *
 * MIGRATIONS (each keeps every old key: never lose a child's progress):
 *   0 -> 1  the per-mode keys from before the shell (njg-cook-v1, njg-shared-ui-fallback-v1,
 *           njg-speech-enrol-v1, njg_quilt_v1) become the first player's namespaces.
 *   1 -> 2  per player: Cook's word records (cook.words) become the `words` namespace (js/core/progress.js);
 *           Cook's coins and the clinic's own coins (ui.clinic.state.coins) become ONE purse, `wallet`, with
 *           Cook's owned upgrades (js/core/wallet.js); the root gains `lang: "kutchi"` and `content: {}`.
 *           cook.words, cook.coins, cook.owned and ui.clinic.state stay exactly as they were.
 *
 * API (as js/shared/save.js, plus the schema-2 calls at the end):
 *   Save.init()  players()  current()  currentId()  player(id)
 *   Save.addPlayer({name, colour})  select(id)  updatePlayer(id, {...})  removePlayer(id)  ensurePlayer()
 *   Save.get(ns, pid?)  has(ns, pid?)  set(ns, v, pid?)  update(ns, fn, pid?)  clear(ns, pid?)  namespaces(pid?)
 *   Save.flag(name)  setFlag(name, v)  setting(name)  setSetting(name, v)
 *   Save.exportJSON()  importJSON(text)  persistent()  use(storage)  memoryStore()  onChange(fn)
 *   new: Save.lang()  setLang(id)  contentVersion(kind, id)  noteContent(kind, id, version)  NAMESPACES
 *
 *   import { Save } from "./save.js";   (or createSave(root) for a separate instance)
 * In a page it also becomes window.Save when no classic save is loaded, so the classic kit (UIStore,
 * Results, speech) finds it.
 */
import { importCook, DEFAULT_DATA as PROGRESS_DEFAULTS } from "./progress.js";
import { mergeLegacy, LEGACY_PURSES, WALLET_NS } from "./wallet.js";

export const SCHEMA = 2;
export const ROOT_KEY = "njg-save";
export const FORMAT = "nani-jo-ghar-save";
export const LANG_DEFAULT = "kutchi";

/** The old per-mode keys and the namespace each one becomes (schema 0 -> 1). */
export const LEGACY = [
  { key: "njg-cook-v1", ns: "cook" },
  { key: "njg-shared-ui-fallback-v1", ns: "ui" },
  { key: "njg-speech-enrol-v1", ns: "speech" },
  // the retired fruit-bowl prototype's quilt when it ran without a profile
  { key: "njg_quilt_v1", ns: "bowl" },
];

/** Every namespace, its owner and what it holds (target-model § 3.4). A mode's own state is its mode id. */
export const NAMESPACES = {
  character: { owner: "first launch", holds: "the player's look" },
  words: { owner: "core/progress", holds: "per-word stages" },
  wallet: { owner: "core/wallet", holds: "the one purse and owned upgrades" },
  ui: { owner: "framework", holds: "personal bests, onboarding seen, fade-ins (and, until R5, the clinic's state)" },
  story: { owner: "story log, arcs", holds: "the day log, arc and chapter progress" },
  shelf: { owner: "shell", holds: "finished arcs' books" },
  unlocks: { owner: "core/unlocks", holds: "places and modes opened for this child" },
  settings: { owner: "core/settings", holds: "this child's settings (model voice, level, read-along, sound)" },
  conversations: { owner: "Conversations", holds: "its state" },
  speech: { owner: "voice", holds: "voice enrolment" },
  shell: { owner: "shell", holds: "the shell's flags" },
  cook: { owner: "Cook", holds: "Cook's own state (and, until R4, its old words and coins)" },
  clinic: { owner: "clinic", holds: "the clinic's own state (after R5)" },
  bowl: { owner: "retired", holds: "the fruit-bowl prototype's quilt (kept, never read)" },
};

export const COLOURS = ["#c0392b", "#2e86c1", "#27ae60", "#8e44ad", "#e67e22", "#16a085", "#d35486", "#7f6a4d"];

export function createSave(root = globalThis) {
  const Save = { SCHEMA, ROOT_KEY, FORMAT, LEGACY, COLOURS, NAMESPACES, core: true };

  /* ---------------- storage, always wrapped ---------------- */
  let store = null;
  let mem = null;
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
      return null;
    }
  }
  function write(key, value) {
    try {
      backend().setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
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
  const blankRoot = () => ({ schema: SCHEMA, current: null, players: [], migrated: {}, lang: LANG_DEFAULT, content: {} });

  /** Schema 2 for one player: words and the one purse, from the old shapes. Safe to run again (it skips what exists). */
  function migratePlayer2(pid, r) {
    const get = (ns) => read(nsKey(pid, ns)) || {};
    const done = {};
    const cook = get("cook");
    if (read(nsKey(pid, "words")) == null && cook.words && typeof cook.words === "object") {
      const words = importCook({}, cook.words, Save.progressData || PROGRESS_DEFAULTS);
      write(nsKey(pid, "words"), words);
      done.words = Object.keys(words).length;
    }
    if (read(nsKey(pid, WALLET_NS)) == null) {
      const legacy = {};
      Object.entries(LEGACY_PURSES).forEach(([k, f]) => (legacy[k] = f(get)));
      if (Object.values(legacy).some((p) => p.coins || (p.owned && p.owned.length))) {
        const w = mergeLegacy(null, legacy);
        write(nsKey(pid, WALLET_NS), w);
        done.wallet = { coins: w.coins, from: w.from, owned: w.owned.length };
      }
    }
    if (r && Object.keys(done).length) r.migrated[`schema2:${pid}`] = Object.assign({ at: new Date().toISOString() }, done);
    return done;
  }
  Save.migratePlayer2 = (pid) => migratePlayer2(pid || Save.currentId(), R());

  const MIGRATIONS = {
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
    1(r) {
      r.players.forEach((p) => migratePlayer2(p.id, r));
      if (!r.lang) r.lang = LANG_DEFAULT;
      if (!r.content || typeof r.content !== "object") r.content = {};
      return r;
    },
  };
  Save.MIGRATIONS = MIGRATIONS;

  function migrate(r) {
    r = Object.assign(blankRoot(), r || {}, { schema: (r && r.schema) || 0 });
    r.migrated = r.migrated || {};
    while (r.schema < SCHEMA) {
      const step = MIGRATIONS[r.schema];
      if (step) r = step(r) || r;
      r.schema++;
    }
    return r;
  }

  // the root is missing or corrupt but players' keys are there: rebuild the list (schema 1, so schema 2 runs)
  function recover() {
    const ids = [];
    keys().forEach((k) => {
      const m = k && k.match(/^njg-save:([\w-]+):[\w-]+$/);
      if (m && !ids.includes(m[1])) ids.push(m[1]);
    });
    if (!ids.length) return null;
    const r = blankRoot();
    r.schema = 1;
    ids.forEach((id, i) => r.players.push({ id, name: `Player ${i + 1}`, colour: COLOURS[i % COLOURS.length], created: new Date().toISOString(), auto: true }));
    r.current = ids[0];
    r.recovered = new Date().toISOString();
    return r;
  }

  Save.init = function () {
    if (rootCache) return rootCache;
    let had = read(ROOT_KEY);
    const recovered = !had && (had = recover());
    const before = had ? JSON.stringify(had) : null;
    rootCache = migrate(had);
    if (!rootCache.players.some((p) => p.id === rootCache.current)) rootCache.current = rootCache.players.length ? rootCache.players[0].id : null;
    if (!had || recovered || JSON.stringify(rootCache) !== before) write(ROOT_KEY, rootCache);
    return rootCache;
  };
  const R = () => Save.init();
  const saveRoot = () => write(ROOT_KEY, R());

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
    delete p.auto;
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
  Save.ensurePlayer = function () {
    if (!R().current) Save.addPlayer({ name: "Player 1", auto: true });
    return Save.current();
  };

  /* ---------------- namespaces ---------------- */
  const pid = (id) => id || Save.ensurePlayer().id;
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
  Save.flag = (name, playerId) => Save.get("shell", playerId)[name];
  Save.setFlag = (name, value, playerId) => Save.update("shell", (d) => ((d[name] = value), d), playerId);

  Save.setting = (name) => (R().settings || {})[name];
  Save.setSetting = function (name, value) {
    const r = R();
    r.settings = Object.assign({}, r.settings, { [name]: value });
    saveRoot();
    emit("data", "settings");
    return value;
  };

  /* ---------------- schema 2: language and content versions ---------------- */
  /** The game's language for this device (decision 22 d): "kutchi" until another language ships. */
  Save.lang = () => R().lang || LANG_DEFAULT;
  Save.setLang = function (id) {
    R().lang = String(id || LANG_DEFAULT);
    saveRoot();
    emit("data", "lang");
    return R().lang;
  };
  /** The version of a piece of content (arc, level set, map) this save last saw; null if never. */
  Save.contentVersion = (kind, id) => ((R().content || {})[`${kind}:${id}`] || null);
  Save.noteContent = function (kind, id, version) {
    const r = R();
    r.content = Object.assign({}, r.content, { [`${kind}:${id}`]: version });
    saveRoot();
    return version;
  };

  /* ---------------- export / import ---------------- */
  Save.exportJSON = function () {
    const r = R();
    const players = {};
    r.players.forEach((p) => {
      players[p.id] = {};
      Save.namespaces(p.id).forEach((ns) => (players[p.id][ns] = read(nsKey(p.id, ns))));
    });
    return JSON.stringify({ format: FORMAT, schema: SCHEMA, exported: new Date().toISOString(), root: { current: r.current, players: r.players, lang: r.lang }, data: players }, null, 1);
  };
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
      // a file from before schema 2: bring this player's words and coins over too
      if ((f.schema || 0) < 2) migratePlayer2(p.id, r);
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
}

/** The page's one save. */
export const Save = createSave(globalThis);

// The classic kit (js/shared/uistore.js, results.js, speech.js) looks for window.Save: give it this one
// when the page has no classic save loaded (a page moved to modules drops the classic tag).
if (typeof window !== "undefined" && !window.Save) {
  window.Save = Save;
  (window.Shared = window.Shared || {}).save = Save;
}

export default Save;
