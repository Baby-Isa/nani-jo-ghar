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
import { loadJSON } from "#core/env.js";
import { createEngine } from "#core/lang/index.js";

const DATA_FILES = ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"]; // data/lang/ (engine-spec § Files)

const Cook = (window.Cook = window.Cook || {});
Save.init();
// C3 (decision 38d): the core's one voice plays every Cook line, through Cook's own Web Audio player (unlocked by the
// first tap, test speed); looked up at play time, since js/cook/core.js and lang.js load after this module
const player = {
  play: (url) => (Cook.speakFile ? Cook.speakFile(url) : Promise.resolve(false)),
  stop: () => Cook.stopVoice && Cook.stopVoice(),
  synth: (text) => (Cook.synthSay ? Cook.synthSay(text) : Promise.resolve(false)),
};
// a load cut short by leaving the page (a reload) isn't a failure worth reporting
let leaving = false;
window.addEventListener("pagehide", () => (leaving = true));
Cook.coreReady = loadCore({ base: "", save: Save, cook: Cook, player })
  .then(async (core) => {
    Cook.core = core;
    // step 4d (decision 42): every word and line Cook shows or plays is the language engine's (js/cook/words.js), and
    // its clip plan (stitched from the family's word recordings, decision 26) plays through the core's voice
    const data = {};
    await Promise.all(DATA_FILES.map(async (f) => (data[f] = await loadJSON(`data/lang/${f}.json`))));
    const audio = await loadJSON("data/family-audio.json").catch(() => []);
    Cook.langEngine = createEngine({ data, audio: audio || [] });
    return core;
  })
  .catch((e) => {
    if (!leaving) console.error("Cook: the engine core didn't load", e);
    Cook.core = null;
    return null;
  });
