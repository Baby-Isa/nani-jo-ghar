// Loads today's Cook proto-engine (js/cook/core.js, lang.js, order.js, recipes.js: unchanged, as classic scripts)
// into a Node vm, with data/cook.json and the station data merged the way the page merges it (zone.js's
// def.dataFile `words`, mechanics/stir.js's `lines`). For the Lang seam's tests and tools; no browser.
//   const { Cook, win } = await loadCook({ seed })
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const read = (p) => readFileSync(ROOT + p, "utf8");

/** mulberry32: the seeded Math.random the vm gets, so shuffles repeat */
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// the station files whose data the page merges into Cook.data at load (zone.js M.combined def.dataFile)
const STATION_FILES = ["chai-tray", "daar", "maani-line", "mishkaki-grill", "roll-tawa", "samosa"];

export async function loadCook({ seed = 1 } = {}) {
  const win = {
    console,
    location: { search: "" },
    setTimeout,
    clearTimeout,
    URLSearchParams,
    Promise,
    JSON,
    Math: Object.create(Math),
    Date,
    Array,
    Object,
    String,
    Number,
    Set,
    Map,
    RegExp,
    Error,
  };
  win.Math.random = seeded(seed);
  win.window = win;
  win.self = win;
  win.fetch = async (url) => {
    const p = String(url).split("?")[0];
    const ok = existsSync(ROOT + p);
    return { ok, json: async () => (ok ? JSON.parse(read(p)) : {}) };
  };
  vm.createContext(win);
  for (const f of ["js/cook/core.js", "js/cook/lang.js", "js/cook/order.js", "js/cook/recipes.js"]) vm.runInContext(read(f), win, { filename: f });
  const Cook = win.Cook;
  // the page's own merges (zone.js and mechanics/stir.js), done here because those files need Phaser
  Cook.onLoad.push(async (data) => {
    for (const id of STATION_FILES) {
      const p = `data/stations/${id}.json`;
      if (!existsSync(ROOT + p)) continue;
      const extra = JSON.parse(read(p));
      if (extra.words) Object.keys(extra.words).forEach((w) => (data.words[w] = data.words[w] || extra.words[w]));
    }
    const stir = JSON.parse(read("data/stations/stir.json"));
    Object.keys(stir.lines || {}).forEach((k) => (data.lines[k] = data.lines[k] || stir.lines[k]));
  });
  await Cook.load();
  return { Cook, win };
}
