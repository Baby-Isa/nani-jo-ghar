/*
 * Find it: the search engine's data layer (docs/find-it-design.md s3).
 *
 * Find it is a separate page (find.html) that shares Cook with Nani's
 * systems as they are: data/cook.json's words, frames and grammar
 * (js/cook/lang.js), the save and per-word progress (js/cook/core.js), the
 * word pills and the order ladder on the mission card (js/cook/ui.js,
 * order.js), stars shown as they happen, pocket money. Nothing here is
 * Kutchi: words are borrowed from data/cook.json and data/content.json.
 *
 * One engine, rows as data. A row (a "want") is
 *   { noun, count?, colour?, size?, where?: [relation, anchor], not? }
 * and an item placed in a scene is
 *   { id, noun, colour?, size?, spot, x, baseline, w, h, rel: [[relation, of], ...] }
 * where rel records what it is in / on / in front of / next to, so later
 * mechanics ("where is it?", role reversal) are new row types, not new code.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Find = (global.Find = global.Find || {});
  Cook.gameMode = "find"; // the star set (data/find.json star_set)

  Find.data = null;
  Find.scenes = {};

  /* ---------------- loading: borrow words, never invent them ---------------- */
  Find.load = async function () {
    await Cook.load();
    const [fd, content] = await Promise.all([
      fetch(Cook.v("data/find.json")).then((r) => r.json()),
      fetch(Cook.v("data/content.json")).then((r) => r.json()).catch(() => ({ words: [] })),
    ]);
    Find.data = fd;
    const W = Cook.data.words;
    const cw = {};
    (content.words || []).forEach((w) => (cw[w.id] = w));
    (fd.words.from_content || []).forEach((id) => {
      const c = cw[id];
      if (!c) return;
      if (!W[id]) W[id] = { kutchi: (c.kutchi && c.kutchi.text) || null, english: c.english, src: "content master" };
      if (c.image && !W[id].picture) W[id].picture = `assets/${c.image}`;
    });
    // words Cook already had (limu, the vegetables) get their picture too
    Object.keys(W).forEach((id) => {
      if (W[id].picture || !cw[id] || !cw[id].image) return;
      W[id].picture = `assets/${cw[id].image}`;
    });
    Object.assign(Cook.data.grammar.numbers, fd.words.numbers || {});
    // a family recording of a word (assets/audio/word/<id>.mp3) is its voice
    // when the placeholder voice build has no file for it
    (Cook.audioManifest.word || []).forEach((id) => {
      const w = W[id];
      if (!w || !w.kutchi) return;
      const k = Cook.norm(w.kutchi);
      if (!Cook.tts[k]) Cook.tts[k] = `assets/audio/word/${id}.mp3`;
    });
    // this mode's star icons and names
    Cook.data.star_sets = Cook.data.star_sets || {};
    Cook.data.star_sets.find = Object.assign({}, Cook.data.star_sets.find || {}, fd.star_set || {});
    // scenes: the base scene file (background, shopkeeper, basket) plus Find's spots
    for (const [id, s] of Object.entries(fd.scenes)) {
      const base = s.base ? await fetch(Cook.v(s.base)).then((r) => r.json()) : {};
      Find.scenes[id] = Object.assign({ id }, base, s);
    }
    return fd;
  };

  /* ---------------- small helpers ---------------- */
  Find.rint = (a, b) => (b == null ? (Array.isArray(a) ? Find.rint(a[0], a[1]) : a) : a + Math.floor(Math.random() * (b - a + 1)));
  Find.now = () => performance.now();
  Find.picture = (id) => (Cook.data.words[id] || {}).picture || null;
  Find.groups = () => Find.data.lookalike_groups.groups;
  Find.groupOf = (id) => Find.groups().find((g) => g.includes(id)) || null;
  Find.sameGroup = (a, b) => {
    const g = Find.groupOf(a);
    return !!g && g.includes(b);
  };
  Find.isCognate = (id) => (Find.data.cognates.ids || []).includes(id);

  /** A mechanic's settings at a level (level 1 in full; later levels list only what changes). */
  Find.knobs = function (mech, level = 1) {
    const L = (Find.data.mechanics[mech] || {}).levels || [{}];
    const out = {};
    for (let i = 0; i < Math.min(level, L.length); i++) Object.assign(out, L[i]);
    return out;
  };

  /* ---------------- rows ("wants") ---------------- */
  /** Does this placed item answer this row? (noun, then any qualifier the row names) */
  Find.matches = function (item, want) {
    if (!item || !want || item.noun !== want.noun) return false;
    if (want.colour && item.colour !== want.colour) return false;
    if (want.size && item.size !== want.size) return false;
    if (want.where && !(item.rel || []).some((r) => r[0] === want.where[0] && r[1] === want.where[1])) return false;
    return true;
  };
  /**
   * The words of a row, in the language's order. Kutchi puts a position
   * after its noun (Roadmap syllabus): count, size, colour, noun, anchor,
   * relation. Qualifier words with no Kutchi yet are placeholders (grey
   * italic), from data/cook.json words. The number is always said, one
   * included ("hikdo"), so a row's length never tells you its count.
   */
  Find.rowParts = function (want) {
    if (want.not) return [want.noun];
    const parts = [];
    if (want.count != null) parts.push(want.count);
    if (want.size) parts.push(want.size);
    if (want.colour) parts.push(want.colour);
    parts.push(want.noun);
    if (want.where) parts.push(want.where[1], want.where[0]);
    return parts;
  };
  /** A ladder row (js/cook/order.js's row) for a want, with the want and a running tally. */
  Find.ladderRow = function (want) {
    const parts = Find.rowParts(want);
    const phrase = Lang.phrase(parts);
    const r = Cook.Order.row({
      parts,
      ids: [want.noun],
      kind: want.not ? "no" : "item",
      line: want.not ? Lang.line(Lang.frames().no, phrase) : { segs: phrase.segs, en: phrase.en },
    });
    return Object.assign(r, { want, got: 0, need: Infinity, misses: 0, stage: Cook.wordStage(want.noun) });
  };
  /**
   * Rows in any order, one dot each (shuffled every time: the list's order
   * says nothing). `simple`: never joined by a line, even once "ne poi" is
   * well known (a list has no steps; Nani says it herself, see listLines).
   */
  Find.ladder = function (rows) {
    return { dish: 0, recipe: null, head: null, sections: [{ key: "any", seq: false, simple: true, groups: Cook.shuffle(rows).map((r) => [r]) }] };
  };
  /** The list as Nani says it: "Muke bo santra khape. Ne hikdo kelo." ("no X" rows as they are). */
  Find.rowLine = function (r, first) {
    if (r.want.not) return r.line;
    return Lang.line(first ? Lang.frames().first : Lang.frames().more, r.phrase);
  };
  Find.listLines = function (L) {
    const rows = Cook.Order.rows(L);
    let first = true;
    return rows.map((r) => {
      const l = Find.rowLine(r, first && !r.want.not);
      if (!r.want.not) first = false;
      return { row: r, line: l };
    });
  };

  /* ---------------- mechanics and the Search lab ---------------- */
  Find.Mech = { defs: {}, labs: {}, labOrder: [] };
  Find.Mech.define = (id, def) => (Find.Mech.defs[id] = def);
  Find.Mech.lab = (key, entry) => {
    Find.Mech.labs[key] = entry;
    if (!Find.Mech.labOrder.includes(key)) Find.Mech.labOrder.push(key);
  };

  /* ---------------- the lab can pretend the player knows the words ---------------- */
  const baseStage = Cook.wordStage;
  Find.stageOverride = null;
  Cook.wordStage = (id) => (Find.stageOverride ? Find.stageOverride : baseStage(id));
})(window);
