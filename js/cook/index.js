/*
 * Cook's modules, in the order cook.html loaded them (C4, decision 45). Importing this file loads Cook once per page
 * and gives back its namespace; nothing runs until js/cook/mount.js mounts it in an element. ES module evaluation
 * follows the import order, so every file finds what the files before it hung on Cook, as the script tags did.
 * (hands.js stays off, as in cook.html: Zafar, 28 Sept. knead.js is cut from the stations; the file stays.)
 */
import { Cook } from "./ns.js";
import "./boot.js";
import "./core.js";
import "./words.js";
import "./art.js";
import "./ui.js";
import "./stations.js";
import "./station-lib.js";
import "./zone.js";
import "./kitchen-kit.js";
import "./mechanics/fetch.js";
import "./mechanics/passme.js";
import "./mechanics/pour.js";
import "./mechanics/add.js";
import "./mechanics/boil.js";
import "./mechanics/count.js";
import "./mechanics/roll.js";
import "./mechanics/tawa.js";
import "./mechanics/chop.js";
import "./mechanics/tadka.js";
import "./mechanics/stir.js";
import "./mechanics/assemble.js";
import "./mechanics/fill-fold.js";
import "./mechanics/fry.js";
import "./mechanics/thread.js";
import "./mechanics/grill.js";
import "./stations/roll-tawa.js";
import "./stations/maani-line.js";
import "./stations/chai-tray.js";
import "./stations/mishkaki-grill.js";
import "./stations/samosa.js";
import "./stations/daar.js";
import "./recipes.js";
import "./order.js";
import "./coach.js";
import "./flow.js";
import "./frame-hookup.js";

// the six classic-compatible files have run: close the load-time handoff (js/cook/ns.js)
delete globalThis.__njgCookLoading;

export { Cook };
export default Cook;
