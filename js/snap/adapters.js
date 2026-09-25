/*
 * Snap's one adapter file (docs/modes/snap-design.md s12: "behind one
 * adapter file so the swap is one edit"). Every shared piece Snap needs from
 * the foundation is reached through here:
 *
 *   Snap.listen({ choices, timeoutMs, target })  -> { choice, confidence } | null
 *       js/shared/speech.js (real, on the device) unless the lab or the URL
 *       asks for a stub: ?speech=oracle (hears the target), ?speech=null
 *       (hears nothing: the pills come up). The templates for a word are the
 *       family's recording (assets/audio/word/<id>.mp3) or, until there is
 *       one, the placeholder voice file the game already plays for it.
 *   Snap.Stars     star rules (ear needs 2 tested rows; voice)  STUB: js/snap/stubs/stars.js
 *   Snap.WhichOne  the size-class picker for G2                 STUB: js/snap/stubs/which-one.js
 *
 * Swapping in the foundation's versions: point Snap.Stars / Snap.WhichOne at
 * the shared modules here, and delete js/snap/stubs/.
 */
(function (global) {
  const Cook = global.Cook;
  const Snap = global.Snap;

  Snap.Stars = Snap.StarsStub;
  Snap.WhichOne = Snap.WhichOneStub;

  const q = new URLSearchParams(global.location.search);
  Snap.speechMode = q.get("speech") || "real"; // the lab can change it: "real" | "oracle" | "null"

  const loaded = new Set();
  async function templates(choices) {
    const S = global.Speech;
    const need = choices.filter((c) => !loaded.has(c) && !(S.templates[c] || []).length);
    for (const id of need) {
      loaded.add(id);
      const urls = [];
      if ((Cook.audioManifest.word || []).includes(id)) urls.push(`assets/audio/word/${id}.mp3`);
      const k = Cook.norm(Cook.kutchi(id));
      if (Cook.tts[k] && !urls.includes(Cook.tts[k])) urls.push(Cook.tts[k]);
      if (urls.length) await S.loadTemplates(id, urls).catch(() => 0);
    }
  }

  Snap.listen = async function ({ choices, timeoutMs, target, onState } = {}) {
    const mode = Snap.speechMode;
    if (mode === "oracle") {
      await Cook.wait(500);
      return target ? { choice: target, confidence: 0.9 } : null;
    }
    if (mode === "null") {
      await Cook.wait(600);
      return null;
    }
    const S = global.Speech;
    if (!S || !S.listen) return null;
    try {
      await templates(choices);
      return await S.listen({ choices, timeoutMs, onState });
    } catch (e) {
      console.warn("snap: listen failed", e);
      return null; // never blocks: a null is a shrug, and the pills come up
    }
  };
})(window);
