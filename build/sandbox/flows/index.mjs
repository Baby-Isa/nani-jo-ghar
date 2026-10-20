import { houseFlow } from "./house.mjs";
import { firstFlow } from "./first.mjs";
import { KEPT, RECIPES, PARTS, cookStation, cookTitle, cookDay, cookShop, cookOpenKitchen, cookBook } from "./cook.mjs";
import { clinicFlows, clinicFlow, HEAL_GAMES } from "./clinic.mjs";
import { MODE_FLOWS } from "./modes.mjs";
import { rotateFlow, cssFlow } from "./extra.mjs";
import { labFlows, labCook } from "./labs.mjs";
import { DAY_FLOWS, DAY_BOOK_PATHS, dayBookFlow } from "./day.mjs";
import { DAY_WINDOW_FLOWS, DAY_WINDOW_PATHS, dayWindowFlow } from "./day-window.mjs";
import { ALL_SIZES } from "../lib/env.mjs";
import { driverPaths } from "../drivers/catalog.mjs";

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
  // ---- s09-frame: a day at Nani's (day.html): the door, the book, the window ride, at a phone, a 4:3 tablet and the laptop ----
  for (const f of [...DAY_FLOWS, ...DAY_WINDOW_FLOWS]) flows.push({ ...f, sizes: ["844x390", "1024x768", "1366x768"] });
  return flows.map((f) => ({ ...f, parked: false }));
}
export const flowSizes = (f) => f.sizes || ALL_SIZES;
// a flow and every level and path of it: "cook:chai-tray" also gives cook:chai-tray@L2, @L3, #mistake, #hint ...
export const variantsOf = (flows, id) => flows.filter((f) => f.id === id || f.id.startsWith(id + "@") || f.id.startsWith(id + "#"));
export function parkedFlows() { return []; }
export { HEAL_GAMES };

// ---- any level and path of a flow, built on demand (the evidence loop, build/tools/review/evidence.mjs: a probe can ask for
// cook:fetch@L2#hint, which the gate does not run). "base@L2#hint" -> the flow, or null. What each kind of flow can do:
const CLINIC_STAGES = ["waiting", "diagnosis", "pharmacy", "sendoff"];
const CLINIC_NAME = { waiting: "Waiting room", diagnosis: "Diagnosis", pharmacy: "Pharmacy (belt)", sendoff: "Send-off" };
// The evidence loop's named drivers (drivers/catalog.mjs) are paths too: each kind lists the ones that play on it. `moments` (when
// set) is the kind whose moments the flow reaches (lib/moments.mjs), where the builder below differs: a story day is built through
// the Cook branch (flows/cook.mjs cookStation hands cook:dayN to cookDay), Find it's sitting room through the game-host branch
// (flows/labs.mjs labCook hands mode:find#find-scene to its own flow)
const withDrivers = (kind, own) => [...new Set([...own, ...driverPaths(kind)])];
export function flowKind(base) {
  const m = /^cook:(?:recipe:)?([\w-]+)$/.exec(base);
  if (m && (KEPT.includes(m[1]) || PARTS.includes(m[1]) || RECIPES.includes(m[1]))) return { kind: "cook", levels: [1, 2, 3, 4], paths: withDrivers("cook", ["fair", "mistake", "hint", "takeback", "speed1"]) };
  if (/^cook:day[1-6]$/.test(base)) return { kind: "cook", moments: "cook-other", levels: [1], paths: withDrivers("cook-other", ["fair"]) };
  if (CLINIC_STAGES.some((s) => base === `clinic:${s}`)) return { kind: "clinic-stage", levels: base === "clinic:waiting" ? [1, 2, 3, 4, 5] : [1, 2, 3], paths: withDrivers("clinic-stage", ["fair", "mistake", "hint"]) };
  if (HEAL_GAMES.some((g) => base === `clinic:heal-${g}`)) return { kind: "heal", levels: [1, 2, 3], paths: withDrivers("heal", ["fair", "mistake", "hint"]) };
  if (base === "clinic:patient") return { kind: "patient", levels: [1, 2, 3], paths: ["fair", "mistake", "hint"] };
  if (base === "clinic:morning") return { kind: "morning", levels: [1, 2, 3], paths: withDrivers("morning", ["fair"]) };
  if (/^lab:cook\/[\w-]+$/.test(base) && !/story-birthday|free/.test(base)) return { kind: "lab-cook", levels: [1, 2, 3, 4], paths: withDrivers("lab-cook", ["fair", "speed1"]) };
  if (base === "day:window") return { kind: "day-window", levels: [1, 2, 3], paths: DAY_WINDOW_PATHS };
  if (base === "day:book") return { kind: "day-book", levels: [1], paths: DAY_BOOK_PATHS };
  if (base === "mode:find") return { kind: "lab-cook", moments: "mode", levels: [1], paths: ["fair", "find-scene"] };
  return null;
}
export const splitFlowId = (id) => { const m = /^(.*?)(?:@L(\d))?(?:#([\w-]+))?$/.exec(id); return { base: m[1], level: m[2] ? +m[2] : 1, path: m[3] || "fair" }; };
export const flowIdOf = (base, level = 1, path = "fair") => `${base}${level > 1 ? `@L${level}` : ""}${path && path !== "fair" ? `#${path}` : ""}`;
// flows only the evidence loop plays (never in the gate: no baseline of their own): SH-28's recipe book with its chips
export const EVIDENCE_FLOWS = [cookBook];
export function resolveFlow(id, live = allFlows()) {
  const have = live.find((f) => f.id === id) || EVIDENCE_FLOWS.find((f) => f.id === id);
  if (have) return have;
  const { base, level, path } = splitFlowId(id);
  const k = flowKind(base);
  if (!k || !k.levels.includes(level) || !k.paths.includes(path)) return null;
  const sizes = (live.find((f) => f.id === base) || {}).sizes;
  let f = null;
  if (k.kind === "cook") {
    const m = /^cook:(recipe:)?([\w-]+)$/.exec(base), key = m[2];
    const recipe = !!m[1] || (RECIPES.includes(key) && !KEPT.includes(key));
    f = cookStation(key, level, { recipe, ...(path === "speed1" ? { speed: 1 } : path !== "fair" ? { mode: path } : {}) });
    if (PARTS.includes(key)) f = { ...f, group: "cook-parts" };
  } else if (k.kind === "clinic-stage" || k.kind === "heal" || k.kind === "patient") {
    const st = base.slice(7);
    const query = k.kind === "heal" ? `stage=heal&game=${st.slice(5)}&level=${level}` : k.kind === "patient" ? `patient=1&level=${level}&results=1` : `stage=${st}&level=${level}`;
    const title = `Clinic: ${k.kind === "heal" ? `heal game ${st.slice(5)}` : k.kind === "patient" ? "One patient" : CLINIC_NAME[st]}, level ${level}${path !== "fair" ? `, ${path} player` : ""}`;
    f = clinicFlow({ id, title, query, level, mode: path, timeoutMs: k.kind === "patient" ? 600000 : k.kind === "heal" ? 200000 : 240000 });
  } else if (k.kind === "morning") {
    f = clinicFlow({ id, title: `Clinic: a morning (session 2) with every stage at level ${level}`, query: "morning=1&session=2&nosave=1", level, levels: level > 1 ? level : null, timeoutMs: 600000 });
  } else if (k.kind === "lab-cook") {
    const g = base.slice(9);
    f = labCook({ id, title: `labs.html: Cook on the game host, ${g}, level ${level}${path === "speed1" ? " at a child's pace" : ""}`, query: g === "round" ? `mode=cook&level=${level}` : `mode=cook&game=${g}&level=${level}`, timeoutS: g === "round" ? 700 : 900, ...(path === "speed1" ? { speed: 1 } : {}) });
  } else if (k.kind === "day-window") {
    f = dayWindowFlow(level, path);
  } else if (k.kind === "day-book") {
    f = dayBookFlow(level, path);
  }
  return f ? { ...f, id, ...(sizes ? { sizes } : {}), parked: false, built: true } : null;
}
