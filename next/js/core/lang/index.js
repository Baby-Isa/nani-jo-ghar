/*
 * The language engine's front door (engine-design § 6): every word and sentence is asked for as a meaning and comes back
 * built from data/lang/, or as a gap. In the game, only js/shared/say.js comes through here.
 */
export { createEngine, loadEngine } from "./engine/index.js";
