/*
 * Cook with Nani: the order ladder model (Wave 2).
 *
 * One source of truth: the recipe's own ladder rows (R.<id>.ladder(d, i)
 * in recipes.js, built from the recipe's `say` data: dots, any-order
 * groups, quantities, "no" rows, sections that wait for a station). This
 * file only arranges those rows into what the mission card draws and what
 * the customer says:
 *
 *   ladder = { dish, recipe, head, sections: [{ key, seq, when, groups: [[row, ...], ...] }] }
 *   row    = { parts, ids, no, need, got, done, miss, revealed, line, phrase, said }
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
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const O = (Cook.Order = {});

  /** A card row from a recipe ladder row (recipes.js). */
  function row(r) {
    const parts = r.parts || r.ids;
    const phrase = Lang.phrase(parts);
    const no = r.kind === "no";
    return {
      parts,
      ids: r.ids,
      no,
      // a merged run in a sequence ("be ghos") is ticked unit by unit
      need: r.list ? r.qty || 1 : 1,
      got: 0,
      done: false,
      miss: false,
      revealed: false,
      phrase,
      // on the card: just the words (the dot says how it links); "no X" as said
      line: no ? r.line : { segs: phrase.segs, en: phrase.en },
      // as the recipe data says it (its own frame: "Ne be khun.")
      said: r.line,
      list: !!r.list,
      for: r.for,
    };
  }
  O.row = row;
  /** "No X" rows join a random group at a random place, so where they sit says nothing. */
  function sprinkle(groups, noRows) {
    if (!groups.length && noRows.length) groups.push([]);
    noRows.forEach((r) => {
      const g = groups[Math.floor(Math.random() * groups.length)];
      g.splice(Math.floor(Math.random() * (g.length + 1)), 0, r);
    });
    return groups;
  }

  /** The ladder for one dish of an order (i: its place in the order). */
  O.ladder = function (d, i = 0) {
    const L = { dish: i, recipe: d.recipe, head: null, sections: [] };
    const lists = new Map();
    const nos = [];
    let any = null;
    Cook.Recipes[d.recipe].ladder(d, i).forEach((r) => {
      if (r.kind === "dish" && !L.head) {
        L.head = Object.assign(row(r), { head: true, line: r.line });
        return;
      }
      const x = row(r);
      if (x.no) return nos.push(x);
      if (r.list) {
        // a spoken list: its own section, one group per dot
        let s = lists.get(r.sec);
        if (!s) {
          s = { key: r.when || `list${r.sec}`, seq: false, when: r.when || null, groups: [], dots: [] };
          lists.set(r.sec, s);
          L.sections.push(s);
        }
        const g = s.dots.indexOf(r.dot);
        if (g >= 0) s.groups[g].push(x);
        else {
          s.dots.push(r.dot);
          s.groups.push([x]);
        }
        return;
      }
      // everything else said on its own line: one any-order group
      if (!any) L.sections.push((any = { key: "any", seq: false, groups: [[]] }));
      any.groups[0].push(x);
    });
    L.sections.forEach((s) => {
      s.seq = s.groups.length > 1;
      delete s.dots;
      s.groups = s.groups.map((g) => Cook.shuffle(g));
    });
    // "no X": among the any-order rows, else sprinkled through the list
    const home = any || L.sections.filter((s) => !s.when).pop();
    if (home) sprinkle(home.groups, nos);
    else if (nos.length) L.sections.push({ key: "any", seq: false, groups: [Cook.shuffle(nos)] });
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
            if (!r.list && r.said) {
              // said on its own line in the recipe data ("Ne be khun."): keep its frame
              lines.push(r.said);
              first = false;
              firstInGroup = false;
              return;
            }
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
