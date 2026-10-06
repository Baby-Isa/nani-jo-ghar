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
const CLASSIC = ["./core.js", "./words.js", "./ui.js", "./recipes.js", "./order.js"];
const ORDER = ["./boot.js", "./core.js", "./words.js", "./art.js", "./ui.js", "./stations.js", "./station-lib.js", "./zone.js", "./kitchen-kit.js", "./mechanics/fetch.js", "./mechanics/passme.js", "./mechanics/pour.js", "./mechanics/add.js", "./mechanics/boil.js", "./mechanics/count.js", "./mechanics/roll.js", "./mechanics/tawa.js", "./mechanics/chop.js", "./mechanics/tadka.js", "./mechanics/stir.js", "./mechanics/assemble.js", "./mechanics/fill-fold.js", "./mechanics/fry.js", "./mechanics/thread.js", "./mechanics/grill.js", "./stations/roll-tawa.js", "./stations/maani-line.js", "./stations/chai-tray.js", "./stations/mishkaki-grill.js", "./stations/samosa.js", "./stations/daar.js", "./recipes.js", "./order.js", "./coach.js", "./flow.js", "./frame-hookup.js"];
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
await import("./mechanics/pour.js");
await import("./mechanics/add.js");
await import("./mechanics/boil.js");
await import("./mechanics/count.js");
await import("./mechanics/roll.js");
await import("./mechanics/tawa.js");
await import("./mechanics/chop.js");
await import("./mechanics/tadka.js");
await import("./mechanics/stir.js");
await import("./mechanics/assemble.js");
await import("./mechanics/fill-fold.js");
await import("./mechanics/fry.js");
await import("./mechanics/thread.js");
await import("./mechanics/grill.js");
await import("./stations/roll-tawa.js");
await import("./stations/maani-line.js");
await import("./stations/chai-tray.js");
await import("./stations/mishkaki-grill.js");
await import("./stations/samosa.js");
await import("./stations/daar.js");
await load("./recipes.js");
await load("./order.js");
await import("./coach.js");
await import("./flow.js");
await import("./frame-hookup.js");

// the classic-compatible files have run: close the load-time handoff (js/cook/ns.js)
delete globalThis.__njgCookLoading;

export { Cook };
export default Cook;
