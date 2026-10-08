import { houseFlow } from "./house.mjs";
import { firstFlow } from "./first.mjs";
import { KEPT, RECIPES, PARTS, cookStation, cookTitle, cookDay, cookShop, cookOpenKitchen } from "./cook.mjs";
import { clinicFlows, HEAL_GAMES } from "./clinic.mjs";
import { MODE_FLOWS } from "./modes.mjs";
import { rotateFlow, cssFlow } from "./extra.mjs";
import { labFlows } from "./labs.mjs";
import { ALL_SIZES } from "../lib/env.mjs";

// Every flow: --all and --gate run them all. A flow's `sizes` says where it runs. The main flows (level 1 and the first level-3
// ones) run at the eight sizes; the deeper paths (levels 2 and 4, the mistake and hint players, the parts, the days) run at the sizes
// that bound the others: the tightest phone (800x360) and a 4:3 tablet (1024x768). `--every-size` runs everything at every size.
export const DEEP = ["800x360", "1024x768"];
// a deeper flow runs at ONE of the two bounding sizes, alternating down the list so each size gets half (the full matrix for every path at
// every size is about 6 h of browser time; `--sizes` or `--every-size` runs others)
let flip = 0;
const deep = (f, sizes) => ({ ...f, sizes: sizes || [DEEP[flip++ % 2]] });

export function allFlows() {
  const flows = [houseFlow, firstFlow, cookTitle];
  // ---- the main flows: the same set as the first baseline, now at eight sizes ----
  for (const k of KEPT) flows.push(cookStation(k, 1));
  for (const r of ["chai", "chaat"]) flows.push(cookStation(r, 1, { recipe: true }));
  for (const k of ["chai-tray", "stir", "chop"]) flows.push(cookStation(k, 3));
  flows.push(...clinicFlows().filter((f) => !f.deep));
  // ---- every level of every Cook flow (the stations and the two recipes with a station of their own) ----
  const unit = [...KEPT.map((k) => ({ key: k })), { key: "chai", recipe: true }, { key: "chaat", recipe: true }];
  for (const u of unit) {
    for (const L of [2, 3, 4]) if (!(L === 3 && ["chai-tray", "stir", "chop"].includes(u.key) && !u.recipe)) flows.push(deep(cookStation(u.key, L, { recipe: !!u.recipe })));
  }
  // ---- the mistake player (a wrong pick where the mini-game allows it: loud at level 1, quiet from level 2) and the hint player ----
  for (const u of unit) {
    for (const L of [1, 2]) flows.push(deep(cookStation(u.key, L, { recipe: !!u.recipe, mode: "mistake" })));
    for (const L of [1, 3]) flows.push(deep(cookStation(u.key, L, { recipe: !!u.recipe, mode: "hint" })));
  }
  // ---- the rest of live Cook: the parts, the other recipes, the days, the shop, the open kitchen ----
  for (const k of PARTS) flows.push(deep({ ...cookStation(k, 1), group: "cook-parts" }));
  for (const r of ["maani", "daal", "samosa", "mishkaki"]) flows.push(deep({ ...cookStation(r, 1, { recipe: true }), group: "cook-recipes" }));
  for (let d = 1; d <= 6; d++) flows.push(deep(cookDay(d), d === 1 || d === 6 ? DEEP : undefined));
  flows.push(deep(cookShop, DEEP), deep(cookOpenKitchen, DEEP));
  // ---- the clinic: every level, the mistake and hint players ----
  flows.push(...clinicFlows().filter((f) => f.deep).map((f) => deep(f)));
  // ---- the parked modes: a smoke flow each, laptop and phone ----
  for (const f of MODE_FLOWS) flows.push({ ...f, sizes: ["800x360", "1366x768"] });
  // ---- the upright phone: the rotate card on every page; the static CSS lint ----
  flows.push(rotateFlow, cssFlow);
  // ---- R4: the take-back path of every Cook flow (E14: place something, take it back, carry on to the end), at level 1 ----
  for (const u of unit) flows.push(deep(cookStation(u.key, 1, { recipe: !!u.recipe, mode: "takeback" })));
  // ---- S04-A: what Zafar plays from labs.html: Cook on the game host (lab.html), every game at levels 1-4, the story round ----
  for (const f of labFlows()) flows.push(deep(f));
  // the pantry and the Chop tile at a child's pace (speed 1): the voice check in real time
  for (const k of ["fetch", "chop"]) flows.push(deep(cookStation(k, 1, { speed: 1 })));
  return flows.map((f) => ({ ...f, parked: false }));
}
export const flowSizes = (f) => f.sizes || ALL_SIZES;
// a flow and every level and path of it: "cook:chai-tray" also gives cook:chai-tray@L2, @L3, #mistake, #hint ...
export const variantsOf = (flows, id) => flows.filter((f) => f.id === id || f.id.startsWith(id + "@") || f.id.startsWith(id + "#"));
export function parkedFlows() { return []; }
export { HEAL_GAMES };
