/*
 * STUB (phase 1): the clinic's door to the shared recogniser.
 * Same call as js/shared/speech.js: listen({choices, timeoutMs}) -> {choice, confidence} | null.
 * In "real" mode it calls window.Speech.listen (the shared module, loaded
 * by clinic.html, never copied). The lab's "say" dropdown and the voice bot
 * set a fake hearing instead: right word, wrong word, nothing, mumble, or
 * low confidence. Swap at integration: delete this file and call
 * Speech.listen from tell.js directly (one line).
 */
(function (global) {
  const Clinic = (global.Clinic = global.Clinic || {});
  const S = (Clinic.Speech = { mode: "real" });
  S.MODES = [
    ["real", "The microphone (js/shared/speech.js)"],
    ["right", "Hears the right word"],
    ["wrong", "Hears a wrong word"],
    ["nothing", "Hears nothing"],
    ["low", "Hears it, but unsure"],
    ["mumble", "A mumble (always the same word)"],
  ];
  // a mumble always sounds most like the same word: a fixed ranking
  const rank = (id) => {
    let h = 0;
    for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h;
  };
  S.listen = async function (opts, { answer } = {}) {
    if (S.mode === "real") return global.Speech && global.Speech.listen ? global.Speech.listen(opts) : null;
    const Cook = global.Cook;
    if (Cook && Cook.wait) await Cook.wait(700);
    const choices = opts.choices || [];
    if (S.mode === "right") return { choice: answer, confidence: 0.9 };
    if (S.mode === "wrong") return { choice: choices.find((c) => c !== answer), confidence: 0.8 };
    if (S.mode === "low") return { choice: answer, confidence: 0.1 };
    if (S.mode === "mumble") return { choice: choices.slice().sort((a, b) => rank(b) - rank(a))[0], confidence: 0.6 };
    return null;
  };
})(window);
