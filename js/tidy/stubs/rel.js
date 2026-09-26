/*
 * STUB. Tidy up's same-API stand-in for the foundation's relations layer
 * (js/shared/rel.js + data/relations.json + scene `spots`), which doesn't
 * exist yet (docs/modes/BUILD-COMMON.md, "Shared pieces"). Swapping to the
 * real one is one line: load js/shared/rel.js instead of this file (the
 * browser) or require it in js/tidy/rules.js (Node).
 *
 *   Rel.holds(state, rule, scene)   -> true | false
 *   Rel.options(state, rule, scene) -> [spotId]  where the rule's item could
 *                                      go (a free spot) for the rule to hold
 *
 * The spec is docs/modes/tidy-up-design.md 8.1. `scene` is a compiled board
 * (js/tidy/rules.js Rules.board): {spots: [...], byId: {id: spot}} where a
 * spot is {id, cap, tags: [{rel, anchor?}], nbr: {left,right,front,back},
 * adj?: [ids]}. `state` is {placements: {iid: spotId | "tray"},
 * items: {iid: {word, attrs?, kind?}}, start?: {iid: spotId | "tray"}}.
 *
 * Rule types (one row each):
 *   place  {type:"place", item, attrs?, rel, anchor}   anchor: an anchor id,
 *          null for a unary relation (middle, left…), or {item, attrs?} for
 *          a relation to a PLACED item (derived from the neighbour graph)
 *   count  {type:"count", n, item, attrs?, rel, anchor} exactly n there
 *   leave  {type:"leave", item, attrs?}                 still where it started
 *   class  {type:"class", all: {kind?, word?, attrs?}, rel, anchor} every one there
 *   not    {type:"not", rule: {all, rel, anchor}}       none there
 *   order  {type:"order", items: [word], along: [spotId], dir: "asc"|"desc"}
 * Nothing is geometry: every relation is a tag on a spot or a neighbour.
 */
(function (root, factory) {
  const Rel = factory();
  if (typeof module === "object" && module.exports) module.exports = Rel;
  else {
    root.Tidy = root.Tidy || {};
    root.Tidy.Rel = Rel;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const Rel = { STUB: true };
  const TRAY = "tray";
  Rel.TRAY = TRAY;

  /** An item instance's facts: from state.items, else from its id ("fru-04.red#2"). */
  Rel.item = function (state, iid) {
    if (state.items && state.items[iid]) return state.items[iid];
    const [head] = String(iid).split("#");
    const [word, colour] = head.split(".");
    return { word, attrs: colour ? { colour } : {} };
  };
  /** Does an item match a selector {item|word, attrs, kind}? */
  Rel.matches = function (it, sel) {
    if (!sel) return true;
    const w = sel.item || sel.word;
    if (w && it.word !== w) return false;
    if (sel.kind && it.kind !== sel.kind) return false;
    const a = sel.attrs || {};
    return Object.keys(a).every((k) => (it.attrs || {})[k] === a[k]);
  };
  const where = (state, iid) => (state.placements || {})[iid] || TRAY;
  Rel.where = where;
  const iids = (state) => Object.keys(state.items || state.placements || {});
  Rel.at = (state, spotId) => iids(state).filter((i) => where(state, i) === spotId);
  Rel.free = (state, scene, spotId) => {
    const s = scene.byId[spotId];
    return s ? (s.cap || 1) - Rel.at(state, spotId).length : 0;
  };
  Rel.neighbours = function (spot) {
    const out = Object.values(spot.nbr || {}).filter(Boolean);
    (spot.adj || []).forEach((a) => out.includes(a) || out.push(a));
    return out;
  };
  const sameAnchor = (a, b) => (a == null ? null : a) === (b == null ? null : b);
  /** A spot's own tag for (rel, anchor), fixed anchors only. */
  Rel.tagged = (spot, rel, anchor) => (spot.tags || []).some((t) => t.rel === rel && sameAnchor(t.anchor, anchor));

  /**
   * Does spot `spotId` stand in (rel, anchor)? A placed-item anchor
   * ({item}) is derived: "next to" means some other instance of that item
   * sits on a neighbouring spot.
   */
  Rel.satisfies = function (state, scene, spotId, rel, anchor, self) {
    const spot = scene.byId[spotId];
    if (!spot) return false;
    if (anchor && typeof anchor === "object") {
      if (rel !== "next-to") return false;
      const near = Rel.neighbours(spot);
      return iids(state).some((j) => j !== self && near.includes(where(state, j)) && Rel.matches(Rel.item(state, j), anchor));
    }
    return Rel.tagged(spot, rel, anchor);
  };

  const matching = (state, sel) => iids(state).filter((i) => Rel.matches(Rel.item(state, i), sel));
  const satisfied = (state, scene, i, rel, anchor) => {
    const p = where(state, i);
    return p !== TRAY && Rel.satisfies(state, scene, p, rel, anchor, i);
  };

  Rel.holds = function (state, rule, scene) {
    switch (rule.type) {
      case "place":
        return matching(state, rule).some((i) => satisfied(state, scene, i, rule.rel, rule.anchor));
      case "count":
        return matching(state, rule).filter((i) => satisfied(state, scene, i, rule.rel, rule.anchor)).length === rule.n;
      case "leave":
        return matching(state, rule).every((i) => where(state, i) === ((state.start || {})[i] || TRAY));
      case "class": {
        const all = matching(state, rule.all);
        return all.length > 0 && all.every((i) => satisfied(state, scene, i, rule.rel, rule.anchor));
      }
      case "not": {
        const r = rule.rule;
        return !matching(state, r.all).some((i) => satisfied(state, scene, i, r.rel, r.anchor));
      }
      case "order": {
        const pos = rule.items.map((w) => {
          const i = matching(state, { item: w }).find((j) => rule.along.includes(where(state, j)));
          return i ? rule.along.indexOf(where(state, i)) : -1;
        });
        if (pos.some((p) => p < 0)) return false;
        return pos.every((p, k) => !k || (rule.dir === "desc" ? p < pos[k - 1] : p > pos[k - 1]));
      }
      default:
        return false;
    }
  };

  /** Free spots where one more of the rule's item would stand in its relation. */
  Rel.options = function (state, rule, scene) {
    const r = rule.type === "not" ? rule.rule : rule;
    if (!r.rel) return [];
    return scene.spots
      .filter((s) => Rel.free(state, scene, s.id) > 0 && Rel.satisfies(state, scene, s.id, r.rel, r.anchor, null))
      .map((s) => s.id);
  };
  return Rel;
});
