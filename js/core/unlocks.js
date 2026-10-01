/*
 * What is open for this child (decision 22 b, f, g): one unlock service with its reasons, rules in
 * data/unlocks.json, state per child in the save. Free play's map (data/map.json) shows every place; a place
 * not yet open says which story opens it ("locked until the beach story"); story mode opens it.
 *
 *   const U = createUnlocks({ save, rules })        // rules = data/unlocks.json
 *   U.isOpen(id) -> boolean
 *   U.why(id) -> null (open) | { id, arc, chapter, unknown?, entitlement? }   the story that opens it, for the label
 *   U.open(id, why)             open something by hand (a story step, a grown-up)
 *   U.finishChapter(arc, n)     story progress: chapter n of an arc is done (opens what waits for it)
 *   U.finishArc(arc)            the whole arc is done
 *   U.arc(arc) -> { chapter, done }
 *   U.places(map) -> [{ id, open, why, modes, art }]          every place on the map, open or not
 *   Entitlements.has(arcId) -> true                           paid content: always yes for now (decision 22 f)
 *
 * RULES (data/unlocks.json `rules[id]`):
 *   { "open": "always" }                          always open
 *   { "after": { "arc": "beach" } }               open once the beach arc is finished
 *   { "after": { "arc": "beach", "chapter": 1 } } open once chapter 1 of the beach arc is finished
 *   { "all": [rule, ...] }   { "any": [rule, ...] }
 * An id with no rule is closed, and why() says so (unknown: true), never an error: content can change
 * under a save without breaking it.
 *
 * SAVE: `story.arcs[arcId] = { chapter, done }` (arc progress, shared with the story log, R6) and
 * `unlocks.open[id] = { at, why }` (opened by hand). The first-launch story's own `story["first-launch"].done`
 * counts as that arc being done.
 */

/** Paid content (decision 22 f): every arc is included for now. */
export const Entitlements = {
  has: (arcId) => true, // eslint-disable-line no-unused-vars
};

export function createUnlocks({ save, rules = {}, entitlements = Entitlements } = {}) {
  const R = () => (rules && rules.rules) || {};
  const story = () => (save ? save.get("story") : {});
  const opened = () => ((save ? save.get("unlocks") : {}).open || {});

  function arc(id) {
    const s = story();
    const a = (s.arcs || {})[id] || {};
    const legacyDone = !!(s[id] && s[id].done);
    return { chapter: a.chapter || 0, done: !!a.done || legacyDone };
  }
  // the first unmet condition of a rule (null when met)
  function unmet(rule) {
    if (!rule) return { unknown: true };
    if (rule.open === "always") return null;
    if (rule.after) {
      const { arc: id, chapter } = rule.after;
      const a = arc(id);
      const ok = chapter ? a.done || a.chapter >= chapter : a.done;
      return ok ? null : { arc: id, chapter: chapter || null };
    }
    if (rule.all) {
      for (const r of rule.all) {
        const u = unmet(r);
        if (u) return u;
      }
      return null;
    }
    if (rule.any) {
      const us = rule.any.map(unmet);
      return us.some((u) => !u) ? null : us[0] || { unknown: true };
    }
    return { unknown: true };
  }
  // the arcs a rule depends on (for the paid-content check)
  const arcsOf = (rule) => (!rule ? [] : rule.after ? [rule.after.arc] : [].concat(...(rule.all || rule.any || []).map(arcsOf)));

  const U = {
    arc,
    why(id) {
      if (opened()[id]) return null;
      const rule = R()[id];
      const paid = arcsOf(rule).find((a) => !entitlements.has(a));
      if (paid) return { id, arc: paid, chapter: null, entitlement: paid };
      const u = unmet(rule);
      return u ? Object.assign({ id }, u) : null;
    },
    isOpen: (id) => U.why(id) === null,
    open(id, why = "by hand") {
      if (save) save.update("unlocks", (d) => ((d.open = Object.assign({}, d.open, { [id]: { at: new Date().toISOString(), why } })), d));
      return true;
    },
    finishChapter(id, n) {
      if (save) save.update("story", (s) => ((s.arcs = Object.assign({}, s.arcs)), (s.arcs[id] = Object.assign({ chapter: 0, done: false }, s.arcs[id])), (s.arcs[id].chapter = Math.max(s.arcs[id].chapter, n)), s));
    },
    finishArc(id) {
      if (save) save.update("story", (s) => ((s.arcs = Object.assign({}, s.arcs)), (s.arcs[id] = Object.assign({ chapter: 0 }, s.arcs[id], { done: true })), s));
    },
    places(map) {
      return ((map && map.places) || []).map((p) => {
        const why = U.why(p.unlock || p.id);
        return { id: p.id, open: why === null, why, modes: p.modes || [], art: p.art || {} };
      });
    },
  };
  return U;
}

export default createUnlocks;
