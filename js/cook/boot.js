/*
 * Cook on the engine core (step 3, R4; target-model § 3; decision 18). The first module on cook.html: it
 * loads js/core/ through the page's import map and hands it to Cook's code as Cook.core:
 *   save (the one save, schema 2: the classic js/shared/save.js tag is gone), progress, score, wallet, voice,
 *   lang, settings, unlocks, play (how this page was started: story or free play, from its URL), data.
 * The save module also becomes window.Save at once (static import), so the classic kit and js/cook/app.js
 * find it while the rest loads. Cook's boot (flow.js, on load) awaits Cook.coreReady.
 */
import { Save } from "#core/save.js";
import { loadCore } from "#core/index.js";
import { clipIndex, planClips, voicePath } from "#core/voice.js";
import { loadJSON } from "#core/env.js";

const Cook = (window.Cook = window.Cook || {});
Save.init();
// C3 (decision 38d): the core's one voice plays every Cook line, through Cook's own Web Audio player (unlocked by the
// first tap, test speed); looked up at play time, since js/cook/core.js and lang.js load after this module
const player = {
  play: (url) => (Cook.speakFile ? Cook.speakFile(url) : Promise.resolve(false)),
  stop: () => Cook.stopVoice && Cook.stopVoice(),
  synth: (text) => (Cook.synthSay ? Cook.synthSay(text) : Promise.resolve(false)),
};
Cook.coreReady = loadCore({ base: "", save: Save, cook: Cook, player })
  .then(async (core) => {
    Cook.core = core;
    // G1 (decision 26, G12): Cook's voice plans every line with the core's planClips (whole phrases off until the
    // pre-publish pass), on the test path too; js/cook/lang.js Lang.speak hands the plan to the core's voice (core.voice.say), which plays it through Cook's player above
    const [fam, tts] = await Promise.all([loadJSON("data/family-audio.json").catch(() => []), loadJSON("data/cook-tts.json").catch(() => ({ lines: {} }))]);
    const index = clipIndex(fam, { tts: (tts && tts.lines) || {} });
    const sayOf = (id) => (id && Cook.data && Cook.data.words[id] && Cook.data.words[id].say) || null;
    Cook.voicePlan = (segs) => planClips(segs, index, { path: voicePath(), sayOf });
    return core;
  })
  .catch((e) => {
    console.error("Cook: the engine core didn't load", e);
    Cook.core = null;
    return null;
  });
