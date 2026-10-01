import { houseFlow } from "./house.mjs";
import { firstFlow } from "./first.mjs";
import { KEPT, RECIPES, PARTS, cookStation, cookTitle } from "./cook.mjs";
import { clinicFlows, HEAL_GAMES } from "./clinic.mjs";

// Every live flow. "parked" flows run only when named.
export function allFlows() {
  const flows = [houseFlow, firstFlow, cookTitle];
  for (const k of KEPT) flows.push(cookStation(k, 1));
  // whole recipes (Station lab > Whole recipes). A recipe whose id is also a station's key is "cook:recipe:<id>"
  for (const r of RECIPES) flows.push(cookStation(r, 1, { recipe: true }));
  for (const k of ["chai-tray", "daar", "stir"]) flows.push(cookStation(k, 3));
  flows.push(...clinicFlows());
  return flows.map((f) => ({ ...f, parked: false }));
}
export function parkedFlows() {
  const flows = PARTS.map((k) => ({ ...cookStation(k, 1), group: "cook-parts" }));
  return flows.map((f) => ({ ...f, parked: true }));
}
export { HEAL_GAMES };
