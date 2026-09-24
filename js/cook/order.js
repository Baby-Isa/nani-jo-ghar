/*
 * Cook with Nani: the order ladder model (Wave 2).
 *
 * A small helper beside recipes.js (it reads a dish's slots, it doesn't
 * change how recipes work). It turns a dish into what the mission card
 * draws and what the customer says:
 *
 *   ladder = { dish, recipe, head, sections: [{ key, seq, when, groups: [[row, ...], ...] }] }
 *   row    = { parts, ids, no, need, got, done, miss, revealed, line }
 *
 * A group is one dot on the card. Rows in the same group can be done in
 * any order; groups in a `seq` section are steps, joined by a dashed line,
 * and are said with "ne poi" (and then). Leak rules from
 * docs/cook-with-nani-kutchi-audit.md:
 *   - no pictures, only words (the card draws the rows);
 *   - one dot per item type, never per unit ("bo tameto" is one row);
 *   - "no X" rows go in at random and look like the others;
 *   - rows that can go in any order are shuffled every time;
 *   - a section can wait for its station (`when`: the tadka order is
 *     Nani's, given at the pan).
 * Recipes it doesn't know fall back to their own `lines`, one row each.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const O = (Cook.Order = {});

  function row(parts, { no = false, need = 1 } = {}) {
    const phrase = Lang.phrase(parts);
    const F = Lang.frames();
    return {
      parts,
      ids: parts.filter((p) => typeof p === "string"),
      no,
      need,
      got: 0,
      done: false,
      miss: false,
      revealed: false,
      phrase,
      line: no ? Lang.line(F.no, phrase) : { segs: phrase.segs, en: phrase.en },
    };
  }
  O.row = row;
  /** A sequence of item ids: one group (dot) per step; the same item twice running is one row with a count. */
  function seqGroups(ids) {
    const runs = [];
    ids.forEach((id) => {
      const last = runs[runs.length - 1];
      if (last && last.id === id) last.n++;
      else runs.push({ id, n: 1 });
    });
    return runs.map((r) => [row(r.n > 1 ? [r.n, r.id] : [r.id], { need: r.n })]);
  }
  /** "No X" rows join a random group at a random place, so where they sit says nothing. */
  function sprinkle(groups, noRows) {
    if (!groups.length && noRows.length) groups.push([]);
    noRows.forEach((r) => {
      const g = groups[Math.floor(Math.random() * groups.length)];
      g.splice(Math.floor(Math.random() * (g.length + 1)), 0, r);
    });
    return groups;
  }
  const anySection = (rows, key = "any") => ({ key, seq: false, groups: rows.length ? [Cook.shuffle(rows)] : [] });

  /** The ladder for one dish of an order (i: its place in the order). */
  O.ladder = function (d, i = 0) {
    const F = Lang.frames();
    const R = Cook.Recipes;
    const head = (parts) => {
      const r = row(parts);
      r.head = true;
      r.line = Lang.line(i === 0 ? F.first : F.more, r.phrase);
      return r;
    };
    const L = { dish: i, recipe: d.recipe, sections: [] };
    const nos = (d.no || []).map((x) => row([x], { no: true }));
    switch (d.recipe) {
      case "chai": {
        L.head = head(d.cups > 1 ? [d.cups, "cook-chai"] : ["cook-chai"]);
        if (d.usual) break;
        const rows = [];
        if (!d.dudh) rows.push(row(["cook-dudh"], { no: true }));
        rows.push(d.khun ? row([d.khun, "cook-khun"]) : row(["cook-khun"], { no: true }));
        if (d.extra) rows.push(row([d.extra]));
        L.sections.push(anySection(rows));
        break;
      }
      case "maani":
        L.head = head(d.count > 1 ? [d.count, "cook-maani"] : ["cook-maani"]);
        break;
      case "daal":
        L.head = head(["cook-daal"]);
        if (d.tameto) L.sections.push(anySection([row(["veg-03"])]));
        if (d.tadka && d.tadka.length) L.sections.push({ key: "tadka", seq: true, when: "tadka", groups: seqGroups(d.tadka) });
        break;
      case "chaat":
        L.head = head(["ph-chaat"]);
        L.sections.push({ key: "layers", seq: true, groups: sprinkle(seqGroups(d.seq || []), nos) });
        break;
      case "samosa":
        L.head = head(d.count > 1 ? [d.count, "ph-samosa"] : ["ph-samosa"]);
        L.sections.push(anySection((d.fillings || []).map((x) => row([x])).concat(nos)));
        break;
      case "mishkaki":
        L.head = head(["ph-mishkaki"]);
        L.sections.push({ key: "skewer", seq: true, groups: seqGroups(d.seq || []) });
        if (d.chips) L.sections.push(anySection([row(["ph-chips"])], "chips"));
        break;
      default: {
        // a recipe this helper doesn't know yet: its own lines, one row each
        const lines = R && R[d.recipe] && R[d.recipe].lines ? R[d.recipe].lines(d, i) : [];
        L.head = { head: true, parts: [], ids: [], line: lines[0] || Lang.wordLine(R.dishWord(d.recipe)), need: 1, got: 0 };
        L.head.ids = L.head.line.segs.filter((s) => s.w).map((s) => s.w);
        const rows = lines.slice(1).map((l) => ({ parts: [], ids: l.segs.filter((s) => s.w).map((s) => s.w), no: false, need: 1, got: 0, line: l }));
        if (rows.length) L.sections.push({ key: "lines", seq: false, groups: rows.map((r) => [r]) });
      }
    }
    return L;
  };

  /** A ladder from plain lines (Station lab cards with no dish): one simple row per line. */
  O.fromLines = function (lines) {
    const rows = lines.map((l) => ({ parts: [], ids: l.segs.filter((s) => s.w).map((s) => s.w), no: false, need: 1, got: 0, line: l, simple: true }));
    return { dish: 0, recipe: null, head: null, sections: [{ key: "lines", seq: false, simple: true, groups: rows.map((r) => [r]) }] };
  };

  O.rows = (L, { all = false } = {}) => [L.head].concat(...L.sections.filter((s) => all || !s.when || s.shown).map((s) => [].concat(...s.groups))).filter(Boolean);
  O.hasSeq = (L) => L.sections.some((s) => s.seq && s.groups.length > 1);

  /**
   * What is said out loud: the head, then each row with its linker. The
   * first step after the head is "ne X"; the next step of a sequence is
   * "ne poi X"; anything in the same group (any order) is "ne X"; a
   * "no X" row is said as it is. Sections that wait for a station are
   * left out unless `withWhen`.
   */
  O.speech = function (ladders, { withWhen = false, heads = true } = {}) {
    const F = Lang.frames();
    const lines = [];
    ladders.forEach((L) => {
      if (heads && L.head) lines.push(L.head.line);
      L.sections.forEach((s) => {
        if (s.when && !withWhen) return;
        let first = true;
        s.groups.forEach((g, gi) => {
          let firstInGroup = true;
          g.forEach((r) => {
            if (r.no) return lines.push(r.line);
            if (s.simple) return lines.push(r.line);
            let frame;
            if (first) frame = heads && L.head ? F.any : null;
            else frame = s.seq && firstInGroup && gi > 0 ? F.seq : F.any;
            lines.push(frame ? Lang.line(frame, r.phrase) : Lang.bare(r.phrase));
            first = false;
            firstInGroup = false;
          });
        });
      });
    });
    return Lang.join(lines);
  };
  /** One section said on its own (Nani giving the tadka order at the pan). */
  O.sectionSpeech = (L, key) => O.speech([{ head: null, sections: L.sections.filter((s) => s.key === key).map((s) => Object.assign({}, s, { when: null })) }], { heads: false });
})(window);
