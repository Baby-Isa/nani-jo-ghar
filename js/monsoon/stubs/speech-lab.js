/*
 * STUB (Monsoon, until the foundation's shared pieces land).
 *
 * Monsoon.Listen.listen({choices, timeoutMs, target, onState}) has the
 * signature of js/shared/speech.js's Speech.listen, which it calls in
 * "real" mode (the shared recogniser is used, never copied). The Rush lab
 * can drive it instead, so every speaking path is reachable without a
 * microphone (build brief phase 2):
 *
 *   real     Speech.listen (the family's recordings as templates)
 *   heard    the child said the target
 *   wrong    the recogniser picked another choice
 *   null     "didn't catch that"
 *   timeout  nothing said before timeoutMs, then null
 *   english  an English speaker: what the recogniser does with English
 *            (build/leak_monsoon.mjs --english measured 0 of 34 English
 *            clips named a Kutchi word, so this is null every time)
 *
 * To swap in the shared say mechanic, replace Monsoon.Listen.listen with
 * Speech.listen in js/monsoon/stubs/say.js (one line).
 */
(function (global) {
  const M = global.Monsoon;
  const L = (M.Listen = { mode: M.params.get("speech") || "real", englishNamedRate: 0 });
  const wait = (s) => M.clock.until(M.clock.now() + s);

  L.listen = async function (opts) {
    const choices = opts.choices || [];
    const target = opts.target;
    const onState = opts.onState || (() => {});
    onState("listening");
    switch (L.mode) {
      case "heard":
        await wait(0.6);
        onState("done");
        return { choice: target, confidence: 0.9 };
      case "wrong": {
        await wait(0.6);
        onState("done");
        const others = choices.filter((c) => c !== target);
        return { choice: others[Math.floor(Math.random() * others.length)], confidence: 0.6 };
      }
      case "null":
        await wait(0.6);
        onState("done");
        return null;
      case "timeout":
        await wait((opts.timeoutMs || 4000) / 1000);
        onState("done");
        return null;
      case "english":
        await wait(0.6);
        onState("done");
        return Math.random() < L.englishNamedRate ? { choice: choices[Math.floor(Math.random() * choices.length)], confidence: 0.2 } : null;
      default: {
        if (!global.Speech) return null;
        const r = await global.Speech.listen({ choices, timeoutMs: opts.timeoutMs, onState });
        return r;
      }
    }
  };

  /** Load the family's recordings of the closed set as templates (real mode only). */
  L.prepare = async function (choices) {
    if (L.mode !== "real" || !global.Speech || M.virtual) return 0;
    let n = 0;
    for (const id of choices) {
      const k = Cook.norm((M.words[id] || {}).kutchi || "");
      const urls = [Cook.tts[k], Cook.tts["ne " + k], Cook.hasAudio(id) ? `assets/audio/word/${id}.mp3` : null].filter(Boolean);
      if (global.Speech.hasTemplates([id])) continue;
      n += await global.Speech.loadTemplates(id, urls);
    }
    return n;
  };
})(window);
