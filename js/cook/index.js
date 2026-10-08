/*
 * Cook's modules, in the order cook.html loaded them (C4, decision 45). Importing this file loads Cook once per page
 * and gives back its namespace; nothing runs until js/cook/mount.js mounts it in an element. The files load one at
 * a time in this order, so every file finds what the files before it hung on Cook, as the script tags did.
 * The ES modules come in by name (the page's import map stamps them, B7). The five classic-compatible files Cook
 * loads (core, words, ui, recipes, order: no import/export, since the parked pages and Node harnesses load them as
 * classic scripts) aren't in the import map, so they are stamped here; nothing else imports them.
 * (hands.js stays off, as in cook.html: Zafar, 28 Sept. knead.js is cut from the stations; the file stays.)
 */
import { Cook } from "./ns.js";

/** A classic-compatible file, stamped with the page's version (js/version.js) since the import map can't name it. */
function load(rel) {
  const u = new URL(rel, import.meta.url);
  u.search = globalThis.NJG_V ? `?v=${globalThis.NJG_V}` : "";
  return import(u.href);
}
// CK-25 (load times, S02-A): every file is asked for at once (a modulepreload each), then run one at a time in the
// order below as before. It was a chain: each file's download waited for the one before it (40 files, 3 s on a phone)
// CK-25 (S03-B, decision 68): only Cook's own files load with the page (the title, the day, the pantry and Nani's
// "pass me"); each station's code loads when that station opens (Cook.Mech.need, js/cook/zone.js), listed in PARTS.
const CLASSIC = ["./core.js", "./words.js", "./ui.js", "./recipes.js", "./order.js"];
const ORDER = ["./boot.js", "./core.js", "./words.js", "./art.js", "./ui.js", "./stations.js", "./station-lib.js", "./zone.js", "./kitchen-kit.js", "./mechanics/fetch.js", "./mechanics/passme.js", "./recipes.js", "./order.js", "./coach.js", "./flow.js", "./frame-hookup.js"];
const M = "./mechanics/";
const SKEWER = [M + "thread.js", M + "grill.js"];
const CHAI = [M + "pour.js", M + "add.js", M + "boil.js", M + "count.js"];
const DAAR = [M + "chop.js", M + "tadka.js", M + "stir.js"];
const SAMOSA = [M + "fill-fold.js", M + "fry.js"];
const DOUGH = [M + "roll.js", M + "tawa.js"];
// what each lab entry and recipe step needs, in load order (a station after the mechanics it builds on)
const PARTS = {
  pour: [M + "pour.js"],
  add: [M + "add.js"],
  boil: [M + "boil.js"],
  count: [M + "count.js"],
  roll: [M + "roll.js"],
  flip: [M + "tawa.js"],
  tawa: [M + "tawa.js"],
  chop: [M + "chop.js"],
  tadka: [M + "tadka.js"],
  stir: [M + "stir.js"],
  assemble: [M + "assemble.js"],
  fill: [M + "fill-fold.js"],
  fold: [M + "fill-fold.js"],
  fry: [M + "fry.js"],
  thread: SKEWER,
  grill: SKEWER,
  "roll-tawa": DOUGH.concat("./stations/roll-tawa.js"),
  "maani-line": DOUGH.concat("./stations/maani-line.js"),
  "chai-tray": CHAI.concat("./stations/chai-tray.js"),
  "mishkaki-grill": SKEWER.concat("./stations/mishkaki-grill.js"),
  samosa: SAMOSA.concat("./stations/samosa.js"),
  daar: DAAR.concat("./stations/daar.js"),
};
// the Station lab's list, in its old order, before any station's code is there (its file fills in the rest)
const LABS = [
  ["pour", "Pour", "Tap the jug"],
  ["boil", "Boil", "Light it, turn it down"],
  ["count", "Sugar", "Count in"],
  ["roll", "Roll", "How many?"],
  ["flip", "Tawa", "Flip and puff"],
  ["chop", "Chop", "Ninja slicing"],
  ["tadka", "Tadka", "Spices in order"],
  ["stir", "Stir", "Count and speed"],
  ["assemble", "Chaat bowl", "Assemble"],
  ["fill", "Fill + fold (Phase A)", "Fill and fold"],
  ["fry", "Fry", "Lift when golden"],
  ["thread", "Skewer", "Which kind, how many"],
  ["grill", "Grill", "Pick, turn in time, plate"],
  ["roll-tawa", "Roll → Tawa", "Combined (proof)"],
  ["maani-line", "Maani line", "Plates → chakla → tawa"],
  ["chai-tray", "Chai tray", "Combined: pans, knobs, pour"],
  ["mishkaki-grill", "Sekelo", "Thread, then the barbecue (level 4: both at once)"],
  ["samosa", "Samosa", "Fill, fold, fry"],
  ["daar", "Daar", "Chop, tadka, stir"],
];
const COMBINED = ["roll-tawa", "maani-line", "chai-tray", "mishkaki-grill", "samosa", "daar"];
try {
  const doc = globalThis.document;
  if (doc && doc.head) {
    ORDER.forEach((rel) => {
      let href;
      if (CLASSIC.includes(rel)) {
        const u = new URL(rel, import.meta.url);
        u.search = globalThis.NJG_V ? `?v=${globalThis.NJG_V}` : "";
        href = u.href;
      } else href = import.meta.resolve ? import.meta.resolve(rel) : new URL(rel, import.meta.url).href;
      const l = doc.createElement("link");
      l.rel = "modulepreload";
      l.href = href;
      doc.head.appendChild(l);
    });
  }
} catch (e) {
  /* no preload: the chain below still loads everything */
}
await import("./boot.js");
await load("./core.js");
await load("./words.js");
await import("./art.js");
await load("./ui.js");
await import("./stations.js");
await import("./station-lib.js");
await import("./zone.js");
await import("./kitchen-kit.js");
await import("./mechanics/fetch.js");
await import("./mechanics/passme.js");
{
  const Mech = Cook.Mech;
  Mech.parts = PARTS;
  // a dynamic import from this file, so the page's import map stamps the station's files (B7)
  Mech.importer = (rel) => import(rel);
  LABS.forEach(([key, name, verb]) => Mech.lab(key, { name, verb, run: null }));
  COMBINED.forEach((key) => Mech.stationData(key, `data/stations/${key}.json`));
}
await load("./recipes.js");
await load("./order.js");
await import("./coach.js");
await import("./flow.js");
await import("./frame-hookup.js");

// the classic-compatible files have run: close the load-time handoff (js/cook/ns.js)
delete globalThis.__njgCookLoading;

export { Cook };
export default Cook;
