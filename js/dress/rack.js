/*
 * Dress up: the rack builder (build brief task 1).
 *
 *   Dress.Rack.build(round, rng) -> {areas: {rail|shelf|tin|tray|tools|carry: [item]}}
 *
 * Lays a round's scope out as things to pick from: the fitting rail (one
 * row of hangers per slot), the wardrobe shelf, Big Ma's button tin and
 * motif tray, her tools for "pass me", Ma's bangle tray, the carry tray.
 * Every item gets an id and a spot; spots are shuffled every round (leak
 * rule 4) and nothing the grader wants sits anywhere special. The house
 * clothes the figure starts in are never on the rack (rule 1). Colours are
 * balanced because the scope is a full grid (rule 3); Rack.rules checks it.
 *
 * `source: true` marks an item that never runs out (a tin of buttons, a
 * tray of motifs): taking one leaves it there.
 */
(function (root) {
  const Dress = (root.Dress = root.Dress || {});
  const Pick = Dress.Pick || (typeof require === "function" ? require("./stubs/pick.js") : null);
  const Rack = (Dress.Rack = {});

  Rack.build = function (round, rng = Math.random) {
    let seq = 0;
    const lay = (items, extra = {}) => Pick.shuffle(rng, items).map((it, i) => Object.assign({}, it, extra, { id: `i${++seq}`, spot: i }));
    const areas = {};
    if (round.game === "layout") areas.shelf = lay(round.scope);
    if (round.game === "fitting" || round.game === "going-out") {
      // one rail row per slot, in slot order (the shape shows the slot anyway); shuffled within
      areas.rail = [];
      Object.keys(round.kindsBySlot).forEach((slot) => areas.rail.push(...lay(round.scope.filter((i) => i.slot === slot))));
      if (round.carry) areas.carry = lay(round.carry.map((kind) => ({ kind, slot: "carry" })));
    }
    if (round.game === "table") {
      if (round.scopes.tin) areas.tin = lay(round.scopes.tin, { source: true });
      if (round.scopes.tray) areas.tray = lay(round.scopes.tray, { source: true });
      areas.tools = round.passme.options.map((kind, i) => ({ id: `t${i}`, kind, spot: i }));
    }
    if (round.game === "bangles") {
      // one column per colour, the same number in every column (rule 3: the tray never says how many)
      const cols = Pick.shuffle(rng, round.colours);
      areas.tray = [];
      cols.forEach((colour, col) => {
        for (let i = 0; i < round.each; i++) areas.tray.push({ id: `b${++seq}`, kind: "ph-bangle", colour, col, spot: i });
      });
    }
    return { areas };
  };

  /** Leak rules 2-4 on a built rack: which it breaks (empty = none). */
  Rack.rules = function (round, rack) {
    const out = [];
    const final = Dress.Look.finalRows(round);
    const groups = {};
    if (rack.areas.rail) rack.areas.rail.forEach((i) => (groups[i.slot] = (groups[i.slot] || []).concat([i])));
    if (rack.areas.shelf) groups.shelf = rack.areas.shelf;
    if (rack.areas.tin) groups.tin = rack.areas.tin;
    if (rack.areas.tray && round.game === "table") groups.tray = rack.areas.tray;
    final.forEach((r) => {
      if (r.no || !r.colour) return;
      const g = r.slot === "pile" ? "shelf" : r.slot === "placket" ? "tin" : r.slot === "part" ? "tray" : r.slot === "wrist" ? null : r.slot;
      if (!g || !groups[g]) return;
      const kind = r.thing === "ph-button" ? "ph-button" : r.thing === "motif" ? "motif" : r.garment;
      const ans = { kind, colour: r.colour };
      if (!groups[g].some((i) => i.kind === kind && i.colour === r.colour && (!r.size || i.size === r.size) && (!r.motif || i.motif === r.motif))) out.push(`${g}: the asked ${kind} ${r.colour} is missing`);
      out.push(...Pick.rules(groups[g], [ans]).map((x) => `${g}: ${x}`));
    });
    if (rack.areas.tray && round.game === "bangles") {
      const per = round.colours.map((c) => rack.areas.tray.filter((b) => b.colour === c).length);
      if (new Set(per).size > 1) out.push("bangle tray: columns differ in size");
    }
    return [...new Set(out)];
  };

  if (typeof module === "object" && module.exports) module.exports = Rack;
})(typeof globalThis !== "undefined" ? globalThis : this);
