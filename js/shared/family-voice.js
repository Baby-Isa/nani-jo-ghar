/*
 * The shared lookup for family voice clips (data/family-audio.json), used by
 * Cook, first.html and the clinic: play Mum's or Zafar's own recording of a
 * Kutchi word or line where one exists, never a computer voice for Kutchi.
 *
 *   await FamilyVoice.load(base)      index the clips (data/family-audio.json); base is
 *                                     the path to the game's root ("../" from lab/)
 *   FamilyVoice.match(text, ...alt)   the best clip for one normalised text, trying each
 *                                     alternative spelling in turn (e.g. a word's `kutchi`,
 *                                     then its `say` field), or null: mum "ok" > zafar "ok"
 *                                     > either unchecked; a "redo" clip is never used
 *   FamilyVoice.byId(id, speaker)     the same, by the recording's own id (a Conversations
 *                                     `fam:` id, or a story line's `clip` field); `speaker`
 *                                     prefers that take when it's usable at all
 *   FamilyVoice.url(entry, base)      the clip's cache-busted file URL
 *   FamilyVoice.norm(text)            lowercase, strip punctuation, collapse spaces
 *
 * A clip is {file, speaker, checked}. Never invent Kutchi: this only ever
 * plays what a family member actually said.
 *
 * Plain <script>: window.FamilyVoice (and Shared.familyVoice); Node: require().
 */
(function (root, factory) {
  const FV = factory(root);
  if (typeof module === "object" && module.exports) module.exports = FV;
  else {
    root.FamilyVoice = FV;
    (root.Shared = root.Shared || {}).familyVoice = FV;
  }
})(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const FV = {};

  /** lowercase, strip punctuation, collapse spaces (letters/marks/numbers of any script survive). */
  FV.norm = (s) =>
    String(s || "")
      .toLowerCase()
      .normalize("NFC")
      .replace(/[^\p{L}\p{M}\p{N} ]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

  let byText = null;
  let byId = null;
  FV.ready = () => !!byText;

  // ok = 2, unchecked (no `checked` field) = 1, redo is never stored at all
  const rankOf = (checked) => (checked === "ok" ? 2 : 1);

  function build(list) {
    const texts = {};
    const ids = {};
    (list || []).forEach((e) => {
      if (!e || !e.file || !e.speaker || e.checked === "redo") return;
      const entry = { file: e.file, speaker: e.speaker, checked: e.checked || null };
      const put = (map, key) => {
        if (!key) return;
        const slot = (map[key] = map[key] || {});
        const cur = slot[e.speaker];
        if (!cur || rankOf(entry.checked) > rankOf(cur.checked)) slot[e.speaker] = entry;
      };
      put(ids, e.id);
      put(texts, FV.norm(e.kutchi));
    });
    return { texts, ids };
  }

  let loading = null;
  FV.load = function (base = "") {
    if (byText) return Promise.resolve();
    if (loading) return loading;
    const v = (u) => (root.njgV ? root.njgV(u) : u);
    loading = root
      .fetch(v(base + "data/family-audio.json"))
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((list) => {
        const built = build(list);
        byText = built.texts;
        byId = built.ids;
      });
    return loading;
  };

  /** The best clip in one id/text slot: `speaker`'s own take if it's usable, else mum ok > zafar ok > either unchecked. */
  function pick(slot, speaker) {
    if (!slot) return null;
    if (speaker && slot[speaker]) return slot[speaker];
    if (slot.mum && slot.mum.checked === "ok") return slot.mum;
    if (slot.zafar && slot.zafar.checked === "ok") return slot.zafar;
    return slot.mum || slot.zafar || null;
  }

  /** The best clip for a Kutchi text, or an alternative spelling (e.g. a word's `say` field) tried in turn. */
  FV.match = function (...texts) {
    if (!byText) return null;
    for (const t of texts) {
      if (!t) continue;
      const e = pick(byText[FV.norm(t)]);
      if (e) return e;
    }
    return null;
  };
  /** The best clip by the recording's own id (a Conversations `fam:` id, or a story line's `clip`). */
  FV.byId = function (id, speaker) {
    if (!byId || !id) return null;
    return pick(byId[id], speaker);
  };
  FV.url = (entry, base = "") => (entry ? (root.njgV ? root.njgV(base + entry.file) : base + entry.file) : null);

  return FV;
});
