/*
 * The clinic's healing games: the registry (docs/clinic-heal-api.md).
 *
 *   Clinic.Heal.register(def)      // a game file calls this once
 *   Clinic.Heal.get(id) / has(id) / ids() / list()
 *   Clinic.Heal.forAilment(ailmentId) / forPart(partId)
 *   Clinic.Heal.validate(def) -> ["problem", ...]   (empty = fine)
 *   Clinic.Heal.onRegister(fn)     // the lab refreshes its list as games load
 *   Clinic.Heal.botRun(id, level, strategy, rng) -> {right, total, win}
 *
 * Load order: this file first, then each js/clinic/heal/games/<id>.js.
 * Runs in the browser (window.Clinic.Heal) and in Node: require() returns
 * the same object and also sets globalThis.Clinic.Heal, so a game file that
 * does `Clinic.Heal.register(...)` works under the leak bot unchanged.
 *
 * The core may ADD to this API; it never renames or removes what the
 * contract lists.
 */
(function (root, factory) {
  const g = typeof globalThis !== "undefined" ? globalThis : root;
  const Clinic = (g.Clinic = g.Clinic || {});
  const Heal = Clinic.Heal && Clinic.Heal.__registry ? Clinic.Heal : factory();
  Clinic.Heal = Heal;
  if (typeof module === "object" && module.exports) module.exports = Heal;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const Heal = { __registry: true };
  const games = new Map();
  const listeners = [];

  // The nine kept games (quality pass Q4) and the part each lives on.
  Heal.IDS = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"];
  Heal.MOODS = ["ouch", "giggle", "relief", "happy"];
  Heal.LOG_TYPES = ["right", "wrong", "extra", "hint"];
  Heal.GESTURES = ["tap", "drag", "swipe", "voice"];

  const norm = (p) => (p ? String(p).replace(/^body-/, "") : p);
  Heal.normPart = norm;

  Heal.validate = function (def) {
    const out = [];
    if (!def || typeof def !== "object") return ["not an object"];
    if (!def.id || typeof def.id !== "string") out.push("id: missing");
    if (typeof def.mount !== "function") out.push("mount: not a function");
    if (!def.part) out.push("part: missing");
    if (!Array.isArray(def.ailments) || !def.ailments.length) out.push("ailments: need at least one");
    if (!Array.isArray(def.items)) out.push("items: need a list of item ids");
    const gs = def.gestures || [];
    if (!Array.isArray(gs) || !gs.length) out.push("gestures: need a list");
    else {
      // UX s12: the shared tap plus at most one working gesture (the voice is a speaking moment, not a gesture)
      const working = gs.filter((x) => x !== "tap" && x !== "voice");
      if (working.length > 1) out.push(`gestures: at most one working gesture besides tap (has ${working.join(", ")})`);
      if (gs.some((x) => /hold|press/.test(x))) out.push("gestures: no press-and-hold (quality pass Q1)");
    }
    if (def.levels && (!Array.isArray(def.levels) || def.levels.some((l) => ![1, 2, 3].includes(l)))) out.push("levels: 1-3");
    if (def.bot != null && typeof def.bot !== "function") out.push("bot: not a function");
    return out;
  };

  Heal.register = function (def) {
    const problems = Heal.validate(def);
    if (problems.length) {
      const msg = `Clinic.Heal.register(${def && def.id}): ${problems.join("; ")}`;
      if (typeof console !== "undefined") console.warn(msg);
      if (!def || !def.id || typeof def.mount !== "function") throw new Error(msg);
    }
    const d = Object.assign({ levels: [1, 2, 3], gestures: ["tap"], items: [] }, def);
    d.part = norm(d.part);
    d.problems = problems;
    games.set(d.id, d);
    listeners.slice().forEach((fn) => {
      try {
        fn(d);
      } catch (e) {
        /* a listener's bug never blocks a game */
      }
    });
    return d;
  };
  Heal.unregister = (id) => games.delete(id);
  Heal.get = (id) => games.get(id) || null;
  Heal.has = (id) => games.has(id);
  Heal.ids = () => Array.from(games.keys());
  Heal.list = () => Array.from(games.values());
  Heal.forAilment = (ailmentId) => Heal.list().find((d) => (d.ailments || []).includes(ailmentId)) || null;
  Heal.forPart = (part) => Heal.list().filter((d) => d.part === norm(part));
  Heal.onRegister = (fn) => {
    listeners.push(fn);
    Heal.list().forEach((d) => fn(d));
    return () => listeners.splice(listeners.indexOf(fn), 1);
  };

  /**
   * One blind (or fair) play of a game's bot, normalised. A game's
   * `bot(level, rng)` returns {rows, solve(strategy)}; `solve` may return
   * {right, total}, an array of booleans (one per row), a boolean, or a
   * share 0..1. `win` is every row right (what the ear star needs).
   */
  Heal.botRun = function (id, level, strategy, rng) {
    const d = Heal.get(id);
    if (!d || !d.bot) return null;
    const b = d.bot(level, rng);
    const rows = (b && b.rows) || [];
    let r = b.solve(strategy);
    let right;
    let total;
    if (r && typeof r === "object" && !Array.isArray(r) && "right" in r) {
      right = r.right;
      total = r.total != null ? r.total : rows.length;
    } else if (Array.isArray(r)) {
      right = r.filter(Boolean).length;
      total = r.length;
    } else if (typeof r === "boolean") {
      total = Math.max(1, rows.length);
      right = r ? total : 0;
    } else if (typeof r === "number") {
      total = Math.max(1, rows.length);
      right = Math.round(r * total);
    } else {
      right = 0;
      total = Math.max(1, rows.length);
    }
    return { right, total, win: total > 0 && right === total, strategies: b.strategies || null };
  };
  /** The strategies a game's bot knows (its own list, else fair + random). */
  Heal.botStrategies = function (id, level = 1) {
    const d = Heal.get(id);
    if (!d || !d.bot) return [];
    let seed = 1;
    const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const b = d.bot(level, rng);
    return (b && b.strategies) || d.strategies || ["fair", "random"];
  };
  return Heal;
});
