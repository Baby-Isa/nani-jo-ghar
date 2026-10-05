// Cook in Node on the language engine (step 4d): js/cook/core.js, words.js, order.js and recipes.js as classic scripts
// in a vm, with the engine made from data/lang/ (as js/cook/boot.js makes it) and the station files' things merged
// into the item catalogue (as zone.js does). For Cook's word and voice tests; no browser.
//   const { Cook, win, engine } = await loadCookEngine({ seed })
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { createEngine } from "../js/core/lang/engine/index.js";
import { seeded } from "./core/cook-harness.mjs";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
const read = (p) => readFileSync(ROOT + p, "utf8");
const J = (p) => JSON.parse(read(p));
const STATION_FILES = ["chai-tray", "daar", "maani-line", "mishkaki-grill", "roll-tawa", "samosa"];

export function engineFromRepo() {
  const data = {};
  for (const f of ["params", "lexicon", "paradigms", "abstract", "concrete", "clips"]) data[f] = J(`data/lang/${f}.json`);
  return createEngine({ data, audio: J("data/family-audio.json") });
}

export async function loadCookEngine({ seed = 1, engine = engineFromRepo() } = {}) {
  const win = { console, location: { search: "" }, setTimeout, clearTimeout, URLSearchParams, Promise, JSON, Math: Object.create(Math), Date, Array, Object, String, Number, Set, Map, RegExp, Error };
  win.Math.random = seeded(seed);
  win.window = win;
  win.self = win;
  win.fetch = async (url) => {
    const p = String(url).split("?")[0];
    const ok = existsSync(ROOT + p);
    return { ok, json: async () => (ok ? JSON.parse(read(p)) : {}) };
  };
  vm.createContext(win);
  for (const f of ["js/cook/core.js", "js/cook/words.js", "js/cook/order.js", "js/cook/recipes.js"]) vm.runInContext(read(f), win, { filename: f });
  const Cook = win.Cook;
  Cook.langEngine = engine;
  Cook.onLoad.push(async (data) => {
    for (const id of STATION_FILES) {
      const p = `data/stations/${id}.json`;
      if (!existsSync(ROOT + p)) continue;
      const extra = J(p);
      if (extra.words) Object.keys(extra.words).forEach((w) => (data.words[w] = data.words[w] || extra.words[w]));
    }
  });
  await Cook.load();
  return { Cook, win, engine };
}

/** Every order line Cook can say (every recipe, level 1-4, every customer; the pantry for each dish), plus every word. */
export function allOrderLines(Cook) {
  const D = Cook.data;
  const out = [];
  for (const id of Object.keys(D.recipes).filter((x) => x[0] !== "_"))
    for (const level of [1, 2, 3, 4])
      for (const who of id === "pantry" ? ["nani"] : Object.keys(D.customers)) {
        const d = Cook.Recipes[id].make(who, { level });
        if (id === "pantry") d.for = "chai";
        const L = Cook.Order.ladder(d, 0);
        out.push({ recipe: id, level, who, kind: "speech", line: Cook.Order.speech([L], { withWhen: true }) });
        Cook.Order.rows(L, { all: true }).forEach((r) => out.push({ recipe: id, level, who, kind: "row", line: r.cardLine || r.line }));
      }
  return out;
}
