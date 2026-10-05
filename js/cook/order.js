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
 * docs/archive/cook/cook-with-nani-kutchi-audit.md:
 *   - no pictures, only words (the card draws the rows);
 *   - one dot per item type, never per unit ("ba tameto" is one row);
 *   - "no X" rows go in at random and look like the others;
 *   - rows that can go in any order are shuffled every time;
 *   - a section can wait for its station (`when`: the tadka order is
 *     Nani's, given at the pan);
 *   - rows said for one person (`for`: the Chai tray's cups) make that
 *     person's own section, "no X" rows included; the card shows their face.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const O = (Cook.Order = {});

  /**
   * 29 Sept (X12 / Q7, Zafar): the counting rule, for a recipe with `countRule`. Level 1 and 2: the
   * card row writes the quantity in Kutchi ("ba dungri", never a digit); level 3 and up: the card
   * says only the thing, and how many is heard in the order (remember it). C3 (decision 41): every
   * station follows it, the Chai tray's sugar included (data/cook.json countRule on every counted recipe).
   */
  const cardParts = (parts, level, rule) => (rule && level >= 3 ? parts.filter((p) => typeof p !== "number") : parts);
  /**
   * C3 (decision 41, E12): a headline that says a quantity ("Muke trae samosa khape.") follows the rule too: from
   * level 3 the card writes its sentence without the number ("Muke samosa khape."), built from the same frame; the
   * full line is still what's said (and replayed from the face).
   */
  function headCard(r, level, rule) {
    const parts = r.parts || [];
    const shown = cardParts(parts, level, rule);
    if (!r.frame || shown.length === parts.length || !shown.length) return null;
    return Lang.line(r.frame, Lang.phrase(shown));
  }
  /** A card row from a recipe ladder row (recipes.js). */
  function row(r, { level = 1, rule = false } = {}) {
    const parts = r.parts || r.ids;
    const phrase = Lang.phrase(parts);
    const shown = cardParts(parts, level, rule);
    const cardPhrase = shown.length === parts.length ? phrase : Lang.phrase(shown);
    const no = r.kind === "no";
    return {
      parts,
      ids: r.ids,
      no,
      // a merged run in a sequence ("ba gos") is ticked unit by unit
      need: r.list ? r.qty || 1 : 1,
      got: 0,
      done: false,
      miss: false,
      revealed: false,
      phrase,
      // on the card: just the words (the dot says how it links); "no X" as said
      line: no ? (Lang.asRow ? Lang.asRow(r.line) : r.line) : { segs: cardPhrase.segs, en: cardPhrase.en },
      // as the recipe data says it (its own frame: "Ne be khun.")
      said: r.line,
      list: !!r.list,
      // the number only says how many were chopped for it (chaat's "ba bataato"): one step, not a count row
      labelQty: !!r.labelQty,
      for: r.for,
      qty: r.qty || 1,
      // Wave 6: one card per unit ("ba lakri gos" is two skewer cards, each with `cards` slots)
      cards: r.cards || null,
      // a list said for one card (a mixed skewer's pieces, in order): drawn on that card's slots
      cardOf: r.cardOf || null,
      // the first thing asked for, when the card has its own headline (the pantry's "Muke dudh de."): stays first
      lead: !!r.lead,
      // 28 Sept: one mini card per unit (a skewer each); which of them are made
      units: r.cards ? Array(r.qty || 1).fill(false) : null,
      // 30 Sept: which block of the dish (samosa's second kind is block 2; null: the dish's own rows)
      block: r.block || null,
    };
  }
  O.row = row;
  const rowOf = row;
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
    // card: the fixed shape of one person's card (the Chai tray's cups: the same slots every time)
    const L = { dish: i, recipe: d.recipe, head: null, sections: [], card: (Cook.data.recipes[d.recipe] || {}).card || null };
    const lists = new Map();
    const nos = [];
    let any = null;
    // 28 Sept (Zafar): a recipe with a headline of its own (the pantry: "bring me these for {dish}")
    // heads the card with it; everything fetched is a row. Not recorded yet: English, flagged "to record"
    const hl = (Cook.data.recipes[d.recipe] || {}).headline;
    if (hl) L.head = O.headline(hl, d);
    const rule = { level: d.level || 1, rule: !!(Cook.data.recipes[d.recipe] || {}).countRule };
    const row = (r) => rowOf(r, rule);
    Cook.Recipes[d.recipe].ladder(d, i).forEach((r) => {
      if (r.kind === "dish" && !L.head) {
        L.head = Object.assign(row(r), { head: true, line: r.line, cardLine: headCard(r, rule.level, rule.rule) });
        return;
      }
      // a person's own headline (the Chai tray's "Muke kari chai khape."): heads their card, not a row
      if (r.kind === "phead" && r.for) {
        const key = `for:${r.for}`;
        let s = L.sections.find((y) => y.key === key);
        if (!s) L.sections.push((s = { key, for: r.for, seq: false, when: r.when || null, groups: [[]] }));
        s.head = Object.assign(row(r), { head: true, line: r.line, cardLine: headCard(r, rule.level, rule.rule) });
        return;
      }
      // 30 Sept: a second block of the dish (samosa's second kind): its own section, headed by its own line
      // ("and trae samosa"), its rows under it; its "no" rows stay the dish's (said once)
      if (r.block && (r.kind === "bhead" || r.kind === "item")) {
        const key = `block:${r.block}`;
        let s = L.sections.find((y) => y.key === key);
        if (!s) L.sections.push((s = { key, block: r.block, seq: false, when: r.when || null, groups: [[]] }));
        if (r.kind === "bhead") {
          // cardLine: the card's words (the count rule: words only from level 3); line: as it's said
          const hr = row(r);
          s.head = Object.assign(hr, { head: true, cardLine: hr.line, line: r.line });
        }
        else s.groups[0].push(row(r));
        return;
      }
      const x = row(r);
      // rows said for one person (the Chai tray's cups): that person's own
      // section, "no X" rows included, drawn with their face on the card
      if (r.for && !r.list) {
        const key = `for:${r.for}`;
        let s = L.sections.find((y) => y.key === key);
        if (!s) L.sections.push((s = { key, for: r.for, seq: false, when: r.when || null, groups: [[]] }));
        s.groups[0].push(x);
        return;
      }
      if (x.no) return nos.push(x);
      if (r.list) {
        // a spoken list: its own section, one group per dot
        let s = lists.get(r.sec);
        if (!s) {
          s = { key: r.when || `list${r.sec}`, seq: false, when: r.when || null, groups: [], dots: [], cardOf: r.cardOf || null };
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
      // a person's card has a fixed shape: its rows in slot order (which chai, milk, sugar), said in that order too
      if (s.for && L.card && L.card.slots) s.groups = s.groups.map((g) => g.slice().sort((a, b) => O.slotOf(L, a) - O.slotOf(L, b)));
      else s.groups = s.groups.map((g) => {
        const lead = g.filter((r) => r.lead);
        // 29 Sept (P4): a list with a lead row (the pantry's) keeps the order its slot was drawn in
        // (already random), so the card, Nani's list and what's fetched all run top to bottom alike
        return lead.length ? lead.concat(g.filter((r) => !r.lead)) : Cook.shuffle(g);
      });
    });
    // "no X": among the any-order rows, else sprinkled through the list
    const home = any || L.sections.filter((s) => !s.when && !s.for).pop();
    if (home) sprinkle(home.groups, nos);
    else if (nos.length) L.sections.push({ key: "any", seq: false, groups: [Cook.shuffle(nos)] });
    // 30 Sept (Zafar, samosa): "baseFirst" names the slot whose first item is the base (samosa's chundo or
    // bataato): its row goes first in every block, the rest stay shuffled. (Not "headFirst": that's maani's
    // headline rule below.)
    const defB = Cook.data.recipes[d.recipe] || {};
    if (defB.baseFirst) {
      const slots = [].concat(defB.baseFirst);
      L.sections.forEach((s) => {
        if (s.for || s.seq || (s.key !== "any" && !s.block)) return;
        const base = [].concat(d[slots[Math.min(slots.length - 1, (s.block || 1) - 1)]] || [])[0];
        const g = s.groups[0] || [];
        const k = g.findIndex((r) => !r.no && r.ids.includes(base));
        if (k > 0) g.unshift(g.splice(k, 1)[0]);
      });
    }
    // 29 Sept (X1, Zafar): the kind of dish goes in the headline where the family's pattern has it:
    // "headFirst" (maani) says the first counted row in the order frame ("Muke ba bajr ji maani khape."),
    // so the headline names what's made; the row stays on the card (it's ticked), and isn't said twice
    const def = Cook.data.recipes[d.recipe] || {};
    if (def.headFirst && L.head && !L.head.rec && any) {
      const first = any.groups[0].find((r) => !r.no && !r.cards);
      const firstAny = first || any.groups[0].find((r) => !r.no);
      if (firstAny) {
        const line = Lang.line(Lang.orderFrame(i, d.level), firstAny.phrase);
        // C3 (MAA-01): the card's headline keeps the dish's own line ("Muke maani khape."), so it never repeats
        // the row under it; the kind is said in the headline and written (and ticked) on its row
        const cardLine = L.head.cardLine || L.head.line;
        Object.assign(L.head, { line, said: line, cardLine, ids: firstAny.ids.slice(), parts: firstAny.parts, phrase: firstAny.phrase });
      }
    }
    return L;
  };

  /* ---------------- 29 Sept (X1): one sentence per person ---------------- */
  // a line's segments without its last full stop (it goes on inside a sentence)
  const cut = (segs) => {
    const out = segs.map((s) => Object.assign({}, s));
    for (let k = out.length - 1; k >= 0; k--) {
      if (!out[k].t || /^\s*$/.test(out[k].t)) continue;
      out[k].t = out[k].t.replace(/[.!?]\s*$/, "");
      if (!out[k].t) out.splice(k, 1);
      break;
    }
    return out;
  };
  const lower = (segs) => {
    const k = segs.findIndex((s) => s.lang && s.t);
    if (k >= 0) segs[k] = Object.assign({}, segs[k], { t: segs[k].t.charAt(0).toLowerCase() + segs[k].t.slice(1) });
    return segs;
  };
  const cutEn = (en) => String(en || "").replace(/[.!?]\s*$/, "");
  /** Is this row already said by the headline ("Muke aadu waari chai khape." says the aadu row)? */
  const inHead = (head, r) => !!head && !r.no && r.ids.length > 0 && r.ids.every((id) => (head.ids || []).includes(id));
  // 30 Sept (chai C5): a word marked `joinless` (the Chai tray's adh / aako) is never the one the join
  // word goes before ("khun na, with aako" read "no sugar, with full"): it's said bare, and the join waits
  const joinless = (r) => r.ids.length > 0 && r.ids.every((id) => ((Cook.item ? Cook.item(id) : Cook.data.words[id]) || {}).joinless); // (the parked pages: no item catalogue)
  /**
   * One person's order as ONE sentence, in card order (29 Sept, X1): the headline ("Muke aadu waari
   * chai khape"), then the card's other rows as their bare words ("dudh, ba khun"), a leave-it-out
   * row in its own confirmed form ("dudh na"). The join word between the headline and the rest is
   * the recipe's `join` line (data.lines.with / .and_join): English, flagged "to record", until Mum
   * gives the Kutchi (Q5); there's no "Ne" chaining. Each part knows the rows it says (read-along).
   * Without a spoken headline (the pantry's "bring me these", still to record) each row is said as
   * the recipe data frames it ("Muke dudh de. Ne atto.").
   */
  O.sentence = function (head, rows, { join = "with" } = {}) {
    const F = Lang.frames();
    const parts = [];
    const said = head && !head.rec && head.line;
    if (!said) {
      rows.forEach((r) => parts.push(Object.assign({}, r.no || !r.said ? r.line : r.said, { row: r })));
      return Lang.join(parts);
    }
    const inH = rows.filter((r) => inHead(head, r));
    const rest = rows.filter((r) => !inH.includes(r));
    const end = (k) => (k === rest.length - 1 ? "." : ",");
    parts.push({ segs: cut(head.line.segs).concat(rest.length ? [{ t: ",", lang: null }] : [{ t: ".", lang: null }]), en: cutEn(head.line.en) + (rest.length ? "," : "."), row: head, rows: [head].concat(inH) });
    let joined = false;
    rest.forEach((r, k) => {
      let segs;
      let en;
      if (r.no) {
        const l = Lang.line(F.no, r.phrase);
        segs = lower(cut(l.segs));
        en = cutEn(l.en).replace(/^./, (c) => c.toLowerCase());
      } else if (!joined && !joinless(r) && (Lang.hasLine ? Lang.hasLine(join) : Cook.data.lines[join])) { // (parked pages only: their own lines)
        const l = Lang.line(join, r.phrase);
        // inside the sentence: no capital (the engine says a join it has no rule for as a sentence of its own)
        segs = lower(cut(l.segs));
        en = cutEn(l.en).replace(/^./, (c) => c.toLowerCase());
        joined = true;
      } else {
        segs = r.phrase.segs.slice();
        en = r.phrase.en;
      }
      parts.push({ segs: segs.concat({ t: end(k), lang: null }), en: en + end(k), row: r, rows: [r] });
    });
    return Lang.join(parts);
  };
  /** The join word a recipe's sentence uses ("with": samosa, chai; "and": maani's second kind). */
  O.joinOf = (L) => ((Cook.data.recipes[L.recipe] || {}).join || "with");

  /**
   * A card headline that isn't a spoken line (yet): {en, en_plain, line?}. With `line` (a key in
   * data.lines, once recorded) it's that Kutchi; else the English, flagged `rec` ("to record").
   * `{dish}` is the English of the dish it's for (d.for), or the plain form without one.
   */
  O.headline = function (hl, d) {
    // step 4d: the headline is the engine's line for its frame key (data/cook.json meanings), the dish it's for in its
    // slot; a frame Mum hasn't given comes back as the engine's own placeholder (grey-italic English, to record)
    const dish = d && d.for && Cook.data.recipes[d.for] ? Cook.data.recipes[d.for].name : null;
    const key = dish ? hl.line : hl.line_plain || hl.line;
    if (Lang.hasLine && Lang.hasLine(key)) {
      const line = Lang.line(key, dish ? Lang.phrase([dish]) : undefined);
      const rec = !line.ok;
      return { parts: [], ids: [], head: true, rec, done: false, need: 1, got: 0, line, said: rec ? undefined : line };
    }
    // the parked pages (js/cook/lang.js, no engine): the recipe's English, flagged to record, as before
    const en = d && d.for && Cook.data.recipes[d.for] ? Cook.data.recipes[d.for].english : null;
    const t = en ? hl.en.replace("{dish}", en.toLowerCase()) : hl.en_plain || hl.en.replace(/\s*for \{dish\}/, "");
    return { parts: [], ids: [], head: true, rec: true, done: false, need: 1, got: 0, line: { segs: [{ t, lang: "e" }], en: t } };
  };
  /** A ladder from plain lines (Station lab cards with no dish): one simple row per line. */
  O.fromLines = function (lines) {
    const rows = lines.map((l) => ({ parts: [], ids: l.segs.filter((s) => s.w).map((s) => s.w), no: false, need: 1, got: 0, line: l, simple: true }));
    return { dish: 0, recipe: null, head: null, sections: [{ key: "lines", seq: false, simple: true, groups: rows.map((r) => [r]) }] };
  };

  /** Which of the card's fixed slots a row fills (L.card.slots: lists of word ids), or 99. */
  O.slotOf = (L, r) => {
    const slots = (L.card && L.card.slots) || [];
    const i = slots.findIndex((ids) => r.ids.some((id) => ids.includes(id)));
    return i < 0 ? 99 : i;
  };
  O.rows = (L, { all = false } = {}) => [L.head].concat(...L.sections.filter((s) => all || !s.when || s.shown).map((s) => [s.head].concat(...s.groups))).filter(Boolean);
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
    // each spoken part knows the row it says, so the card can light it up as it's said (read-along)
    const push = (line, r) => lines.push(Object.assign({}, line, { row: r }));
    const said = (l) => l.parts.forEach((p) => lines.push(p));
    ladders.forEach((L) => {
      // 29 Sept (X1): a spoken headline and the plain rows under it are ONE sentence, in card order
      // ("Muke ba samosa khape, with ba chundo, trae marcha."); a person's own rows (the Chai tray's
      // cups) are their own sentence; ordered lists ("Pela chana. Ne poi bataato.") follow as before
      const whole = heads && L.head && !L.head.rec;
      const plain = (s) => !s.simple && !s.seq && !s.groups.some((g) => g.some((r) => r.list));
      if (whole) said(O.sentence(L.head, [].concat(...L.sections.filter((s) => !s.when && !s.for && !s.block && plain(s)).map((s) => [].concat(...s.groups))), { join: O.joinOf(L) }));
      L.sections.forEach((s) => {
        if (s.when && !withWhen) return;
        // a person's own rows, or a second block of the dish ("and trae samosa, with bataato."): their own sentence
        if (s.for || s.block) return said(O.sentence(s.head || L.head, [].concat(...s.groups), { join: O.joinOf(L) }));
        if (whole && !s.when && plain(s)) return;
        let first = true;
        s.groups.forEach((g, gi) => {
          let firstInGroup = true;
          g.forEach((r) => {
            if (r.no) return push(r.line, r);
            if (s.simple) return push(r.line, r);
            if (!r.list && r.said) {
              // said on its own line in the recipe data ("Ne ba khun."): keep its frame
              push(r.said, r);
              first = false;
              firstInGroup = false;
              return;
            }
            let frame;
            // a sequence starts "Pela …" (first), whatever comes before it
            if (first) frame = s.seq && F.seqFirst ? F.seqFirst : heads && L.head ? F.any : null;
            else frame = s.seq && firstInGroup && gi > 0 ? F.seq : F.any;
            push(frame ? Lang.line(frame, r.phrase) : Lang.bare(r.phrase), r);
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
