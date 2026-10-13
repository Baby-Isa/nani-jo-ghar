// The moment catalogue (the evidence loop, Fable's review point 2): every moment name a sandbox driver can reach, per kind of flow
// and path, so `evidence.mjs --plan` rejects an `at` no driver reaches BEFORE a run. Built from what the players record
// (flows/*.mjs, lib/cook-player.mjs), what the probe hooks report (lib/evidence-probe.mjs), the heal games' debug step ids and Cook's
// expectation kinds (read statically from js/**, never run), plus the moments earlier runs actually saw (build/screenshots/evidence/
// moments-seen.json, merged by every --run). A pattern word "*" stands for any one word. A new moment is a driver change in the same
// commit as the spec that asks for it.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DRIVERS, FAIR_MOMENTS } from "../drivers/catalog.mjs";

const LIFE = ["line:*", "talk:*", "step:row-*", "life:request", "life:advance", "life:stage-start", "life:stage-end", "life:results", "life:popup-fold", "life:popup-open", "life:ghost", "page:end", "page:start", "bubble"];
// the spec's named moments (evidence.json _moments, _at's every:<x>) that an existing signal answers; `delay` waits after it.
// A named moment with no entry here has no driver yet: --plan refuses it (the driver lands with the spec, Fable 2)
export const ALIASES = {
  "popup-fold": { pats: ["life:popup-fold"] },
  // (the game host's Cook player names its states after the game: rec:order-view-service, rec:order-wrong-choice; a pattern without
  // "rec:" in front matches them too)
  served: { pats: ["view-service"] },
  "pass-me": { pats: ["visible:#passme"] },
  idle: { pats: ["rec:idle-hint", "rec:hint-glow"] },
  "after-wrong": { pats: ["rec:wrong", "slip", "wrong-choice", "wrong-tap", "wrong-extra", "wrong-slice", "wrong-stir"], delay: 1000 },
  // the pour: the foot's jug, the taste game's milk or water jug tipping into the tumbler
  pour: { pats: ["step:pour", "step:milk", "step:water"] },
  // the same pour from just before the move: a filmstrip there films the jug tipping (lib/evidence-probe.mjs: the player goes on)
  pouring: { pats: ["heal:pour", "heal:milk", "heal:water"] },
  // the eye chart up with its haa / na pills: from level 2 after "to the eye test" (step:eyetest), at level 1 it opens by itself
  // after the drops, so its first judgement (before the tap) is the moment
  "eye-test": { pats: ["step:eyetest", "heal:yes", "heal:no"] },
  fill: { pats: ["step:fill"] },
  placed: { pats: ["cook-done", "heal-done"] },
  onboard: { pats: ["visible:.njg-onboard"] },
  view: { pats: ["rec:view"] },
  // the heal host's zoom (js/clinic/heal/host.js HOST.stage): the push-in turns the room layer .cl-zoom "on" and hands over to the
  // close-up by 60 % (zoom-in-end: it fades out); the pull-out marks the stage .cl-outro
  "zoom-in": { pats: ["visible:.cl-zoom.on"] },
  "zoom-in-end": { pats: ["hidden:.cl-zoom.on"] },
  "zoom-out": { pats: ["visible:.cl-outro"] },
  // a fresh child's first round of a heal game (D13: shown, then copied): flows/clinic.mjs records taught-<game>
  taught: { pats: ["rec:taught"] },
  // the reply pills of a greeting: Cook's #choices (first launch's chai round, a customer before an order), the clinic's say pills
  greeting: { pats: ["visible:#choices .choice", "rec:waiting-say", "rec:say-pills"] },
  // the ear game's hearing check: the doctor has said it, she has replied, the picture choices are up (before the pick)
  "hearing-test": { pats: ["heal:picture"] },
  // the drivers' bare moments (drivers/index.mjs mark: drv:<name>)
  labs: { pats: ["drv:labs"] },
  retry: { pats: ["drv:retry"] },
  "your-turn": { pats: ["drv:your-turn"] },
  "daar-in": { pats: ["drv:daar-in"] },
  "tap-no": { pats: ["drv:tap-no"] },
  "count-word": { pats: ["drv:count-word"] },
  "knob-off": { pats: ["drv:knob-off"] },
  "tawa-empty": { pats: ["drv:tawa-empty"] },
  "after-mute": { pats: ["rec:after-mute"] },
  "after-start-over": { pats: ["rec:after-start-over"] },
  scene: { pats: ["rec:scene"] },
};
const HOST = ["host:*", "host:*/*", "host:*/*/*", "host:results", "host:done", "host:idle", "host:loading"];
const COOK_REC = ["rec:start", "rec:result", "rec:order-card-big", "rec:order-card-in-sidebar", "rec:results-badges", "rec:results-words", "rec:view-*", "rec:view-*-*", "rec:kind-*", "rec:stir-begin", "rec:stir-mid", "rec:help-open"];
const COOK_PATH = {
  hint: ["rec:hint-nani-says", "rec:hint-glow", "rec:peek-open", "rec:bulb-english", "rec:help-open"],
  mistake: ["rec:wrong-choice", "rec:wrong-tap", "rec:wrong-extra", "rec:wrong-slice", "rec:wrong-stir"],
  takeback: ["rec:before-takeback", "rec:after-takeback"],
};
const CLINIC_REC = ["rec:stage-*", "rec:*-tap", "rec:*-act", "rec:*-point", "rec:*-belt", "rec:*-say", "rec:say-pills", "rec:between-stages", "rec:results-badges", "rec:results-words", "rec:results-end", "rec:end", "clinic:*", "clinic:*/*"];
const CLINIC_PATH = { hint: ["rec:idle-hint-*", "rec:peek-*", "rec:bulb-*"], mistake: ["rec:wrong-*"] };
const HEAL_REC = ["rec:heal-*-start", "rec:heal-*-mid", "rec:heal-*-slip", "rec:heal-eye-redrop", "rec:heal-eye-can-see", "rec:heal-knee-turn-*", "rec:heal-fever-change-*"]; // the eye's two (flows/clinic.mjs eyeMoments)

// a heal game's debug step ids: its `what` strings, its tool ids, its `do` kinds (read from js/clinic/heal/games/<g>.js)
export function healSteps(root, game) {
  const f = join(root, "js", "clinic", "heal", "games", `${game}.js`);
  if (!existsSync(f)) return [];
  const src = readFileSync(f, "utf8"), out = new Set(["button", "tap", "drag", "hold"]);
  const add = (s) => { const w = s.trim().replace(/\s+/g, "-"); if (w) out.add(w); };
  for (const m of src.matchAll(/what:\s*"([a-z][a-z -]*)"/g)) add(m[1]);
  // a step named in a template ("lever ${want}": step:lever-0) or given to the game's own at(x, y, "wipe") helper
  for (const m of src.matchAll(/what:\s*`([a-z][a-z ]*?)\s*\$\{/g)) add(`${m[1]} *`);
  for (const m of src.matchAll(/\bat\([^;()]*?,\s*"([a-z][a-z -]*)"\)/g)) add(m[1]);
  for (const m of src.matchAll(/\bat\([^;()]*?,\s*`([a-z][a-z ]*?)\s*\$\{/g)) add(`${m[1]} *`);
  for (const m of src.matchAll(/\{\s*id:\s*"([a-z][a-z-]*)",\s*img:/g)) out.add(m[1]);
  // tools made from an item table (the taste game's milk, water, turmeric ...: { lex: ..., img: ... })
  for (const m of src.matchAll(/^\s+([a-z][a-z-]*):\s*\{\s*lex:\s*"/gm)) out.add(m[1]);
  for (const m of src.matchAll(/do:\s*"([a-z]+)"/g)) if (m[1] !== "wait") out.add(m[1]);
  return [...out];
}
// Cook's expectation kinds (js/cook/**: `kind: "..."`)
export function cookKinds(root) {
  const out = new Set();
  const walk = (d) => { for (const n of readdirSync(d, { withFileTypes: true })) { const p = join(d, n.name); if (n.isDirectory()) walk(p); else if (/\.m?js$/.test(n.name)) for (const m of readFileSync(p, "utf8").matchAll(/kind:\s*"([a-z][a-z-]*)"/g)) out.add(m[1]); } };
  const d = join(root, "js", "cook");
  if (existsSync(d)) walk(d);
  out.delete("wait");
  return [...out];
}
const SEEN_FILE = (root) => join(root, "build", "screenshots", "evidence", "moments-seen.json");
export function seenMoments(root) { try { return JSON.parse(readFileSync(SEEN_FILE(root), "utf8")); } catch (e) { return {}; } }
export { SEEN_FILE };

// flowId ("clinic:heal-knee@L2#hint") -> the moment patterns its drivers can reach
export function momentsFor(root, flowId, { kindOf = () => null, seen = null } = {}) {
  const m = /^(.*?)(?:@L(\d))?(?:#([\w-]+))?$/.exec(flowId), base = m[1], path = m[3] || "fair";
  const k = kindOf(base);
  const out = [...LIFE, ...HOST, "rec:*", "rec:*-*"].filter((x) => !/^rec:\*/.test(x)); // rec:* is not a free pass
  // k.moments: the kind whose moments it reaches when it is built through another kind's branch (a story day, Find it's scene)
  const kind = k ? k.moments || k.kind : base.startsWith("cook:") ? "cook-other" : base.startsWith("clinic:heal-extra") ? "heal-extra" : base.startsWith("mode:") ? "mode" : base;
  // the fair path's bare moments (your turn, a retry, the daar going in, the labs page ...) and the path's driver's own
  out.push(...(FAIR_MOMENTS[kind] || []));
  if (DRIVERS[path] && DRIVERS[path].kinds.some((x) => x === kind || x === (k && k.kind))) out.push(...DRIVERS[path].moments);
  if (kind === "cook" || kind === "lab-cook") {
    out.push(...COOK_REC, ...(COOK_PATH[path] || []));
    for (const x of cookKinds(root)) out.push(`cook:${x}`, `cook-done:${x}`);
    out.push("exp:*", "exp:*-*", "exp:*-*-*", "phase:*", "phase:*-*", "only:*");
    if (kind === "lab-cook") out.push("rec:*-start", "rec:end", "rec:*-results-words", "rec:*-results-badges");
  } else if (kind === "cook-other") out.push("rec:title", "rec:title-after", "rec:shop", "rec:shop-bought", "rec:shop-after", "rec:shop-grown-ups", "rec:day-summary", "rec:finale", "rec:kitchen-open", "rec:summary", "rec:close-kitchen", "rec:recipe-book", "rec:station-lab-list", "rec:station-lab-parts-open", "rec:title-grown-ups", ...COOK_REC, ...cookKinds(root).flatMap((x) => [`cook:${x}`, `cook-done:${x}`]));
  else if (kind === "clinic-stage" || kind === "patient" || kind === "morning" || kind === "heal") {
    out.push(...CLINIC_REC, ...(CLINIC_PATH[path] || []), ...HEAL_REC);
    if (kind === "morning") out.push("rec:morning-end"); // the receipt in the shared end pop-up (flows/clinic.mjs, CLN-111)
    const games = kind === "heal" ? [base.slice("clinic:heal-".length)] : readdirSync(join(root, "js", "clinic", "heal", "games")).map((f) => f.replace(/\.js$/, ""));
    for (const g of games) for (const s of healSteps(root, g)) out.push(`heal:${s}`, `heal-done:${s}`, `step:${s}`);
  } else if (kind === "heal-extra") out.push("rec:heal-*-start", "rec:heal-*-mid", "rec:heal-*-*", "rec:end");
  else if (kind === "house") out.push("rec:whos-playing", "rec:house", "rec:house-lab-doors", "rec:picker", "rec:picker-add-player", "rec:grown-ups-panel");
  else if (kind === "first") out.push("rec:yes-no", "rec:yes", "rec:no-shakes", "rec:house-with-character", "rec:*-start", "rec:*-made", "rec:*-tab-*", "rec:*-round-play-button");
  else if (kind === "mode") out.push("rec:title", "rec:lab", "rec:result", "rec:results-badges");
  const seenHere = (seen || {})[flowId] || (seen || {})[base] || [];
  return [...new Set([...out, ...seenHere])];
}
const words = (s) => String(s || "").toLowerCase().split(/[-/:\s]+/).filter(Boolean);
// does `want` (an at/after) answer some name a pattern can produce? ("*" in a pattern is any one word, never all of them)
export function reachable(want, patterns) {
  want = String(want || "").trim();
  if (ALIASES[want]) return ALIASES[want].pats.some((p) => reachable(p, patterns));
  if (/^(visible|hidden):./.test(want)) return true; // the page watches the selector; one that never shows is a tool failure after the run
  if (/^only:./.test(want)) return patterns.includes("only:*");
  const w = words(want);
  if (!w.length) return false;
  return patterns.some((p) => {
    const n = words(p);
    // at least one word must match a real word of the pattern: "host:*" alone does not make every word reachable
    for (let i = 0; i + w.length <= n.length; i++) if (w.every((x, j) => n[i + j] === "*" || n[i + j] === x) && w.some((x, j) => n[i + j] === x)) return true;
    return false;
  });
}
