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

const Cook = (window.Cook = window.Cook || {});
Save.init();
Cook.coreReady = loadCore({ base: "", save: Save, cook: Cook })
  .then((core) => {
    Cook.core = core;
    return core;
  })
  .catch((e) => {
    console.error("Cook: the engine core didn't load", e);
    Cook.core = null;
    return null;
  });
