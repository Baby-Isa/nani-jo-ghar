/*
 * Dress up: the grader (build brief task 1).
 *
 *   Dress.Grade.check(round, state) -> {rows, extras, ok, realOk, recast, ear}
 *   Dress.Grade.live(round, state, wear) -> true | false | null
 *
 * state is the worn state: {wears: [{who, slot, item}], passed?, misses?}.
 * `item` is a rack item ({kind, colour, size?, motif?}). Slots: head, top,
 * wrap, carry (the fitting), pile (a person's pile on the bed), placket
 * and part:<part>[:<side>] (Big Ma's kurta), wrist (Ma's bangles).
 *
 * Per row: {id, ok, why, realOk}. `why` is what was wrong first (missing,
 * kind, colour, size, motif, count, extra, no). `realOk` judges only the
 * attributes that are real Kutchi today (count, size, nar), so the bot can
 * report the real-Kutchi slice on its own (design D.7). Unasked slots are
 * ungraded; over-collecting (an extra item in a pile, a colour Ma didn't
 * ask for, a motif on a part nobody named) is graded. The ear star: every
 * row right at the first check and no live misses (earPass
 * "all-rows-first-try").
 */
(function (root) {
  const Dress = (root.Dress = root.Dress || {});
  const Grade = (Dress.Grade = {});
  const finalRows = (round) => Dress.Look.finalRows(round);

  const partSlot = (r) => `part:${r.part}${r.side ? ":" + r.side : ""}`;
  Grade.partSlot = partSlot;
  const matchGarment = (r, it) => it.kind === r.garment && it.colour === r.colour;
  const matchThing = (r, it) => it.colour === r.colour && (!r.size || it.size === r.size) && (!r.motif || it.motif === r.motif);
  const whyThing = (r, items) => {
    if (!items.length) return "missing";
    if (items.length !== r.count) return "count";
    if (r.size && items.some((i) => i.size !== r.size)) return "size";
    if (r.motif && items.some((i) => i.motif !== r.motif)) return "motif";
    if (items.some((i) => i.colour !== r.colour)) return "colour";
    return null;
  };

  Grade.check = function (round, state) {
    const wears = state.wears || [];
    const rows = finalRows(round);
    const out = [];
    const extras = [];
    const on = (who, slot) => wears.filter((w) => (who == null || w.who === who) && w.slot === slot).map((w) => w.item);

    if (round.game === "fitting" || round.game === "going-out") {
      rows.forEach((r) => {
        const worn = on(r.who, r.slot);
        if (r.no) {
          const bad = worn.some((i) => i.kind === r.garment);
          out.push({ id: r.id, ok: !bad, why: bad ? "no" : null, realOk: !bad });
          return;
        }
        const it = worn[0];
        const why = !it ? "missing" : it.kind !== r.garment ? "kind" : it.colour !== r.colour ? "colour" : null;
        out.push({ id: r.id, ok: !why, why, realOk: true });
      });
      if (round.weather) {
        const kinds = wears.map((w) => w.item.kind);
        const ok = Dress.Look.weatherOk(round.weatherDef, kinds);
        out.push({ id: "weather", ok, why: ok ? null : "weather", realOk: true });
      }
    }

    if (round.game === "layout") {
      round.people.forEach((who) => {
        const pile = on(who, "pile").slice();
        rows
          .filter((r) => r.who === who)
          .forEach((r) => {
            const i = pile.findIndex((it) => matchGarment(r, it));
            if (i >= 0) pile.splice(i, 1);
            const sameKind = on(who, "pile").some((it) => it.kind === r.garment);
            out.push({ id: r.id, ok: i >= 0, why: i >= 0 ? null : sameKind ? "colour" : "missing", realOk: true });
          });
        pile.forEach((it) => extras.push({ who, item: it }));
      });
      // something on the pile of someone who wasn't named
      wears.filter((w) => w.slot === "pile" && !round.people.includes(w.who)).forEach((w) => extras.push({ who: w.who, item: w.item }));
    }

    if (round.game === "table") {
      const named = new Set();
      rows.forEach((r) => {
        const slot = r.slot === "placket" ? "placket" : partSlot(r);
        named.add(slot);
        const items = on(null, slot);
        const why = whyThing(r, items);
        const realWhy = !items.length ? "missing" : items.length !== r.count ? "count" : r.size && items.some((i) => i.size !== r.size) ? "size" : null;
        out.push({ id: r.id, ok: !why, why, realOk: !realWhy });
      });
      wears.filter((w) => !named.has(w.slot)).forEach((w) => extras.push({ slot: w.slot, item: w.item }));
      if (round.passme) {
        const ok = state.passed === round.passme.want;
        out.push({ id: "passme", ok, why: ok ? null : "passme", realOk: true });
      }
    }

    if (round.game === "bangles") {
      const wrist = on(null, "wrist");
      rows.forEach((r) => {
        const n = wrist.filter((i) => i.colour === r.colour).length;
        out.push({ id: r.id, ok: n === r.count, why: n === r.count ? null : n ? "count" : "missing", realOk: n === r.count });
      });
      const asked = new Set(rows.map((r) => r.colour));
      wrist.filter((i) => !asked.has(i.colour)).forEach((i) => extras.push({ slot: "wrist", item: i }));
    }

    const ok = out.every((r) => r.ok) && !extras.length;
    const realOk = out.every((r) => r.realOk);
    const recast = out.find((r) => !r.ok) || (extras.length ? { id: "extra", why: "extra", extra: extras[0] } : null);
    return { rows: out, extras, ok, realOk, recast, ear: ok && !(state.misses > 0) };
  };

  /**
   * Level 1 checks live, piece by piece: is this piece right? true / false,
   * or null when nothing was asked there (an unasked slot: no comment).
   */
  Grade.live = function (round, state, wear) {
    const rows = finalRows(round);
    if (round.game === "fitting" || round.game === "going-out") {
      const r = rows.find((x) => x.slot === wear.slot && x.who === wear.who);
      if (!r) return null;
      if (r.no) return wear.item.kind !== r.garment;
      return matchGarment(r, wear.item);
    }
    if (round.game === "layout") {
      const pile = (state.wears || []).filter((w) => w.who === wear.who && w.slot === "pile" && w !== wear).map((w) => w.item);
      return rows.some((r) => r.who === wear.who && matchGarment(r, wear.item) && !pile.some((it) => matchGarment(r, it)));
    }
    return null;
  };

  /** Which attributes decided this round that are still English placeholders (for the report). */
  Grade.placeholders = function (round, data) {
    const out = new Set();
    finalRows(round).forEach((r) => {
      ["colour", "garment", "motif", "part", "side"].forEach((a) => r[a] && !(data.words[r[a]] || {}).kutchi && out.add(a));
      if (r.thing === "ph-button") out.add("thing");
    });
    if (round.passme) out.add("tool");
    if (round.weather) out.add("weather");
    if (round.people && round.people.length > 1) out.add("for whom");
    return [...out];
  };

  if (typeof module === "object" && module.exports) module.exports = Grade;
})(typeof globalThis !== "undefined" ? globalThis : this);
