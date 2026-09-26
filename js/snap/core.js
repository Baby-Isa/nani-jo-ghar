/*
 * Snap: the mode's data layer in the browser (docs/modes/snap-design.md).
 *
 * Snap is its own page (snap.html) and, like Find it, borrows Cook with
 * Nani's systems as they are (read only): data/cook.json's words, frames and
 * grammar (js/cook/lang.js), the save and per-word progress
 * (js/cook/core.js), the word pills and the mission card (js/cook/ui.js,
 * order.js). Nothing here is Kutchi: fruit and numbers come from
 * data/content.json, vadho / nindho / nar and the frames from data/cook.json,
 * and Snap's new lines are English placeholders in data/snap.json.
 *
 * The pure pieces (js/snap/photo.js, requests.js, sim.js) are loaded first
 * and hang off window.Snap; this file adds loading, the mechanic registry
 * (Snap.Mech.define / Snap.Mech.lab, Cook's pattern) and the row words.
 */
(function (global) {
  const Cook = global.Cook;
  const Lang = Cook.Lang;
  const Snap = (global.Snap = global.Snap || {});
  Cook.gameMode = "snap"; // the star set (data/snap.json star_set)

  Snap.data = null;
  Snap.scene = null;

  /* ---------------- loading: borrow words, never invent them ---------------- */
  Snap.load = async function () {
    await Cook.load();
    const [sd, content, scene] = await Promise.all([
      fetch("data/snap.json").then((r) => r.json()),
      fetch("data/content.json").then((r) => r.json()).catch(() => ({ words: [] })),
      fetch("data/scenes/orchard.json").then((r) => r.json()),
    ]);
    Snap.data = sd;
    Snap.scene = scene;
    const W = Cook.data.words;
    const cw = {};
    (content.words || []).forEach((w) => (cw[w.id] = w));
    (sd.words.from_content || []).forEach((id) => {
      const c = cw[id];
      if (!c) return;
      if (!W[id]) W[id] = { kutchi: (c.kutchi && c.kutchi.text) || null, english: c.english, src: "content master" };
      if (c.image && !W[id].picture) W[id].picture = `assets/${c.image}`;
    });
    Object.keys(W).forEach((id) => {
      if (!W[id].picture && cw[id] && cw[id].image) W[id].picture = `assets/${cw[id].image}`;
    });
    Object.assign(Cook.data.grammar.numbers, sd.words.numbers || {});
    // a family recording of a word is its voice when the placeholder voice build has none
    (Cook.audioManifest.word || []).forEach((id) => {
      const w = W[id];
      if (!w || !w.kutchi) return;
      const k = Cook.norm(w.kutchi);
      if (!Cook.tts[k]) Cook.tts[k] = `assets/audio/word/${id}.mp3`;
    });
    // Snap's placeholder lines (kutchi: null) join the shared frames under their snap- keys
    Object.entries(sd.lines).forEach(([k, v]) => {
      if (k.startsWith("_") || Cook.data.lines[k]) return;
      Cook.data.lines[k] = v.kutchi ? { k: v.kutchi, en: v.e } : { e: v.e };
    });
    Cook.data.star_sets = Cook.data.star_sets || {};
    Cook.data.star_sets.snap = Object.assign({}, Cook.data.star_sets.snap || {}, sd.star_set || {});
    return sd;
  };

  /* ---------------- mechanics and the Snap lab ---------------- */
  Snap.Mech = { defs: {}, labs: {}, labOrder: [] };
  Snap.Mech.define = (id, def) => (Snap.Mech.defs[id] = def);
  Snap.Mech.lab = (key, entry) => {
    Snap.Mech.labs[key] = entry;
    if (!Snap.Mech.labOrder.includes(key)) Snap.Mech.labOrder.push(key);
  };
  Snap.knobs = (game, level) => Snap.Req.knobs(Snap.data, game, level);
  Snap.now = () => performance.now();
  Snap.picture = (id) => (Cook.data.words[id] || {}).picture || `assets/items/fruit/${id}.png`;

  /* ---------------- a row's words ---------------- */
  /** The words of a row as a phrase: "trae aamo", "vadho aamo". */
  Snap.rowPhrase = (row) => Lang.phrase(Snap.Req.rowParts(row, Snap.data).main);
  /** The row as Nani says it on its own: "trae aamo." or "trae aamo. Nar kelo." */
  Snap.rowLine = function (row, { first = true } = {}) {
    const main = Snap.rowPhrase(row);
    const lines = [first ? Lang.bare(main) : Lang.line(Lang.frames().more, main)];
    if (row.not) lines.push(Lang.line(Lang.frames().no, Lang.phrase([row.not])));
    return Lang.join(lines);
  };
  /** The row's line on the card: just the words ("trae aamo"), and its "Nar kelo." after a leave-out. */
  Snap.cardLine = function (row) {
    const main = Snap.rowPhrase(row);
    if (!row.not) return { segs: main.segs, en: main.en };
    return Lang.join([{ segs: main.segs, en: main.en }, Lang.line(Lang.frames().no, Lang.phrase([row.not]))]);
  };
  Snap.rowWords = (row) => Snap.Req.rowWords(row, Snap.data);
  /** A row is tested when every word that decides it is at stage 2 or more. */
  Snap.rowStage = (row) => Math.min(...Snap.rowWords(row).map((id) => Cook.wordStage(id)));

  /* ---------------- the lab can pretend the player knows the words ---------------- */
  const baseStage = Cook.wordStage;
  Snap.stageOverride = null;
  Cook.wordStage = (id) => (Snap.stageOverride ? Snap.stageOverride : baseStage(id));
})(window);
