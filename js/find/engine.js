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
      fetch("data/find.json").then((r) => r.json()),
      fetch("data/content.json").then((r) => r.json()).catch(() => ({ words: [] })),
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
    // the family's spelling wins on Find it's screens (wadho, not vadho); the voice stays the draft's
    // recording until the family records it (docs/kutchi-grammar-notes.md: no V in Kutchi, always W)
    Object.entries(fd.words.spelling || {}).forEach(([id, k]) => {
      if (id[0] === "_" || !W[id]) return;
      const was = W[id].kutchi;
      W[id] = Object.assign({}, W[id], { kutchi: k, draft: true });
      if (was && Cook.tts[Cook.norm(was)] && !Cook.tts[Cook.norm(k)]) Cook.tts[Cook.norm(k)] = Cook.tts[Cook.norm(was)];
    });
    // anchor words and relation words with no Kutchi yet: grey English placeholders, never over a family word
    Object.entries(fd.words.placeholders || {}).forEach(([id, w]) => id[0] !== "_" && !W[id] && (W[id] = Object.assign({}, w)));
    // the shared layer (js/shared/): relations, stars (the voice star), speaking moments
    const G = global;
    if (G.Rel) {
      await G.Rel.loadJSON().catch(() => null);
      G.Rel.mergeWords(W);
    }
    if (G.Stars) {
      await G.Stars.loadJSON().catch(() => null);
      G.Stars.installInto(Cook.data);
    }
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
      const base = s.base ? await fetch(s.base).then((r) => r.json()) : {};
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
  /** The scene the round is in (a row's position is read against its anchors). */
  Find.activeScene = null;
  /**
   * Does this placed item answer this row? The noun, then any qualifier the
   * row names; a position through the shared relations layer (Rel.holds),
   * by anchor WORD, so both crates are "the crate" (js/find/gen.js).
   */
  Find.matches = (item, want, scene) => Find.Gen.matches(item, want, scene || Find.activeScene);
  /** The generator's view of the page: the word table, the save's stages, Math.random. */
  Find.env = function (scene) {
    const painted = (scene && scene.painted) || [];
    return {
      rng: Math.random,
      groups: Find.groups(),
      clutter: Find.data.lookalike_groups.clutter || [],
      drawable: (id) => !!Find.picture(id) && !painted.includes(id),
      cognate: Find.isCognate,
      stage: (id) => Cook.wordStage(id),
      word: (id) => Cook.data.words[id] || null,
    };
  };
  /** Rows and the stall for a round (js/find/gen.js): {wants, kinds, units, problems}. */
  Find.makeWants = (k, scene) => Find.Gen.makeRound(k, Find.env(scene), scene);
  /** A size word's scale on the stall (data/find.json sizes): the same picture at two scales. */
  Find.scaleOf = (size) => (size && Find.data.sizes && Find.data.sizes[size]) || 1;
  /** The count's digit shows only while its number word is taught (stage <= 1): D5.2. */
  Find.countTaught = (want) => !!want && want.count != null && !want.not && !want.call && Find.Gen.digitShown(Cook.wordStage(Cook.numId(want.count)));
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
    if (want.count != null && !want.call) parts.push(want.count);
    if (want.size) parts.push(want.size);
    if (want.colour) parts.push(want.colour);
    parts.push(want.noun);
    if (want.where) {
      // Kutchi puts the position after its anchor: "santra, crate [in]"; both are words (placeholders until A5)
      const sc = Find.activeScene || {};
      const a = (sc.anchors || {})[want.where[1]] || {};
      parts.push(a.word || want.where[1], (global.Rel && global.Rel.info(want.where[0]).word) || want.where[0]);
    }
    return parts;
  };
  /** A row as plain text (the result card's reasons). */
  Find.rowText = (want) => Find.rowParts(want).map((p) => Cook.display(typeof p === "number" ? Cook.numId(p) : p)).join(" ");
  /**
   * What you tapped, for Nani's recast: the thing, with its size when the
   * row asked for a size, and where it is when the row asked for a place
   * ("Nar! nindho santra." / "Nar! santra, counter [on].").
   */
  Find.itemParts = function (item, row) {
    const w = (row && row.want) || {};
    const parts = [];
    if (w.size && item.size) parts.push(item.size);
    parts.push(item.noun);
    if (w.where) {
      const sc = Find.activeScene || {};
      const t = (item.rel || []).find((r) => (sc.anchors || {})[r[1]] && global.Rel && global.Rel.id(r[0]) === global.Rel.id(w.where[0])) || (item.rel || []).find((r) => (sc.anchors || {})[r[1]]);
      if (t) parts.push(sc.anchors[t[1]].word || t[1], (global.Rel && global.Rel.info(t[0]).word) || t[0]);
    }
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
    // stages are read now, before the list marks its words seen (a seen word is stage 2: tested)
    return Object.assign(r, { want, got: 0, need: Infinity, misses: 0, stage: Cook.wordStage(want.noun), countTaught: Find.countTaught(want) });
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

  /* ---------------- the microphone's stand-in (the lab and the tests) ---------------- */
  /**
   * Find.fakeListen({choices}): what Speech.listen returns, from a picker
   * ("what did the child say?") instead of a microphone. The lab passes it
   * to Say.tell as `speech`, so a whole speaking round can be played, and
   * the tests drive it by clicking a choice. "Nothing heard" resolves null.
   */
  Find.fakeListen = function ({ choices = [], timeoutMs = 4000 } = {}) {
    void timeoutMs;
    return new Promise((resolve) => {
      const box = document.createElement("div");
      box.id = "fake-mic";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", "What did the child say?");
      box.innerHTML = `<div class="fm-q">Lab: what did the child say?</div><div class="fm-row"></div>`;
      const row = box.querySelector(".fm-row");
      const add = (label, val, cls = "") => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `btn ${cls}`;
        b.dataset.say = val == null ? "" : String(val);
        b.textContent = label;
        b.addEventListener("click", () => {
          box.remove();
          resolve(val == null ? null : { choice: val, confidence: 0.9 });
        });
        row.appendChild(b);
      };
      choices.forEach((c) => add(Find.choiceLabel(c), c));
      add("Nothing heard", null, "ghost");
      document.body.appendChild(box);
    });
  };
  Find.fakeListen.hasTemplates = () => true;
  /** A choice as text: a word's English (the lab picker is for the grown-up), a number as its digit. */
  Find.choiceLabel = (c) => (typeof c === "number" ? String(c) : (Cook.data.words[c] || {}).english || c);

  /* ---------------- the lab can pretend the player knows the words ---------------- */
  const baseStage = Cook.wordStage;
  Find.stageOverride = null;
  Cook.wordStage = (id) => (Find.stageOverride ? Find.stageOverride : baseStage(id));
})(window);
