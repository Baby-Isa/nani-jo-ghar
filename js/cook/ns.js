/*
 * Cook's one namespace (C4, decision 45): a module object, never a page global. Every Cook module imports it:
 *   import { Cook } from "./ns.js";
 * and hangs its part on it as before (Cook.UI, Cook.Mech, Cook.Stations ...), so the code inside each file is unchanged.
 *
 * MARKED HANDOFF. Six files are also loaded as classic scripts by the parked pages (dress, find, monsoon, snap, tidy,
 * who load core, lang, ui, order) and by the Node harnesses (build/core/cook-harness.mjs, build/test_cook_harness.mjs:
 * core, words, order, recipes), so they can't use `import`. While Cook's modules load, they find this namespace at
 * globalThis.__njgCookLoading; js/cook/index.js removes it again once the last module has run. Loaded classically,
 * they find no handoff and keep the parked pages' window.Cook (the one marked Cook global left).
 */
import { life } from "./life.js";

export const Cook = { life };
globalThis.__njgCookLoading = Cook;
export default Cook;
