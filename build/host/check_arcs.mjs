#!/usr/bin/env node
/*
 * The arc format's validator (data/arcs/<arc>.json; docs/architecture/building-games.md "Add an arc").
 *
 *   node build/host/check_arcs.mjs          exit 1 on a problem; prints what each arc opens
 *
 * Checks, for every arc in data/arcs/index.json:
 *   - the shape: version, id = the file name, chapters with unique ids, flow steps of one kind each
 *     ({beat}, {errand}, {conversation}), errand ids unique in the arc, levels 1-4;
 *   - the mode of each errand: "playable" needs js/<mode>/main.js; "waiting" needs the mode's folder js/<mode>/;
 *     "to-build" may name a mode that doesn't exist yet;
 *   - no words for the child in an arc: no "kutchi", "text", "line" or "en" keys anywhere (lines are meanings in the
 *     language engine's data, G13; English for the child never, E1); a beat is an id with a status;
 *   - opens: each id is a map place (data/map.json), a mode, or an arc ("arc:<id>"); the "open" rule is in
 *     js/core/unlocks.js's grammar and names arcs that exist (or first-launch);
 *   - the arcs and data/unlocks.json agree: an id opened by a chapter and also ruled in data/unlocks.json is
 *     reported when the two rules differ (the file wins in the game);
 *   - every story arc ends with the Story by the Fire (H40): its last errand's mode is "fire" (test arcs exempt).
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { arcRules, errandsOf } from "../../js/shared/mode.js";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const STATUSES = ["playable", "waiting", "to-build"];
export const BEAT_STATUSES = ["to-write", "written", "recorded"];
const ID = /^[a-z0-9][a-z0-9-]*$/;
const CHILD_TEXT = ["kutchi", "text", "line", "en", "english"];
// modes the target model names that aren't folders yet (target-model § 9.1): first launch, Conversations, the Fire
const PLANNED_MODES = ["first", "convo", "fire"];

const json = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

export function knownModes(root = ROOT) {
  const dirs = readdirSync(join(root, "js")).filter((d) => statSync(join(root, "js", d)).isDirectory() && !["core", "shared", "vendor"].includes(d));
  return { folders: dirs, plugins: dirs.filter((d) => existsSync(join(root, "js", d, "main.js"))) };
}

function ruleProblems(rule, arcIds, where) {
  const out = [];
  if (!rule || typeof rule !== "object") return [`${where}: not a rule`];
  if (rule.open === "always") return out;
  if (rule.after) {
    if (!rule.after.arc) out.push(`${where}: after needs an arc`);
    else if (!arcIds.includes(rule.after.arc) && rule.after.arc !== "first-launch") out.push(`${where}: no arc "${rule.after.arc}"`);
    if (rule.after.chapter != null && !(Number.isInteger(rule.after.chapter) && rule.after.chapter >= 1)) out.push(`${where}: chapter is a number from 1`);
    return out;
  }
  if (rule.all || rule.any) return (rule.all || rule.any).flatMap((r, i) => ruleProblems(r, arcIds, `${where}.${rule.all ? "all" : "any"}[${i}]`));
  return [`${where}: not a rule this game knows (open, after, all, any)`];
}

function childText(o, path, out) {
  if (Array.isArray(o)) return o.forEach((x, i) => childText(x, `${path}[${i}]`, out));
  if (!o || typeof o !== "object") return;
  for (const [k, v] of Object.entries(o)) {
    if (CHILD_TEXT.includes(k)) out.push(`${path}.${k}: an arc holds no words for the child (lines are meanings in the engine's data, G13; no English for the child, E1)`);
    childText(v, `${path}.${k}`, out);
  }
}

/** Problems in one arc (empty = fine). ctx: {file, arcIds, modes: {folders, plugins}, places} */
export function checkArc(arc, { file = null, arcIds = [], modes = knownModes(), places = [] } = {}) {
  const P = [];
  const at = (s) => `${arc && arc.id ? arc.id : file}: ${s}`;
  if (!arc || typeof arc !== "object") return [`${file}: not an object`];
  if (arc.version !== 1) P.push(at("version: 1"));
  if (!arc.id || !ID.test(arc.id)) P.push(at("id: a kebab-case id"));
  if (file && arc.id && file !== `${arc.id}.json`) P.push(at(`the file is ${file}, the id ${arc.id}`));
  if (arc.open) ruleProblems(arc.open, arcIds, "open").forEach((p) => P.push(at(p)));
  if (!Array.isArray(arc.chapters) || !arc.chapters.length) return P.concat(at("chapters: at least one"));
  const texts = [];
  childText(arc.chapters, "chapters", texts);
  texts.forEach((t) => P.push(at(t)));
  const chapterIds = new Set();
  const errandIds = new Set();
  const allModes = new Set([...modes.folders, ...PLANNED_MODES]);
  arc.chapters.forEach((c, ci) => {
    const where = `chapter ${ci + 1}${c.id ? ` (${c.id})` : ""}`;
    if (!c.id || !ID.test(c.id)) P.push(at(`${where}: id`));
    else if (chapterIds.has(c.id)) P.push(at(`${where}: the id is used twice`));
    chapterIds.add(c.id);
    if (!Array.isArray(c.flow) || !c.flow.length) P.push(at(`${where}: flow: at least one step`));
    let errands = 0;
    (c.flow || []).forEach((st, si) => {
      const w = `${where}, step ${si + 1}`;
      const kinds = ["beat", "errand", "conversation"].filter((k) => st[k] != null);
      if (kinds.length !== 1) return P.push(at(`${w}: one of beat, errand, conversation`));
      if (st.beat != null) {
        if (!ID.test(st.beat)) P.push(at(`${w}: a beat is an id`));
        if (st.status && !BEAT_STATUSES.includes(st.status)) P.push(at(`${w}: beat status one of ${BEAT_STATUSES.join(", ")}`));
      } else if (st.conversation != null) {
        if (!st.conversation.id || !ID.test(st.conversation.id)) P.push(at(`${w}: a conversation slot needs an id`));
      } else {
        errands++;
        const e = st.errand;
        if (!e.id || !ID.test(e.id)) P.push(at(`${w}: errand id`));
        else if (errandIds.has(e.id)) P.push(at(`${w}: errand "${e.id}" is used twice in the arc`));
        errandIds.add(e.id);
        if (!e.mode || !ID.test(e.mode)) P.push(at(`${w}: errand mode`));
        if (!STATUSES.includes(e.status)) P.push(at(`${w}: errand status one of ${STATUSES.join(", ")}`));
        else if (e.status === "playable" && !modes.plugins.includes(e.mode)) P.push(at(`${w}: "${e.mode}" is playable only once js/${e.mode}/main.js exists`));
        else if (e.status === "waiting" && !modes.folders.includes(e.mode)) P.push(at(`${w}: "${e.mode}" is waiting, but js/${e.mode}/ doesn't exist`));
        else if (e.status !== "to-build" && !allModes.has(e.mode)) P.push(at(`${w}: no mode "${e.mode}"`));
        const lvl = e.settings && e.settings.level;
        if (lvl != null && !(Number.isInteger(lvl) && lvl >= 1 && lvl <= 4)) P.push(at(`${w}: settings.level 1-4`));
        if (e.entry != null && typeof e.entry !== "object") P.push(at(`${w}: entry is an object`));
      }
    });
    if (!errands) P.push(at(`${where}: no errand (a chapter is played through its errands)`));
    (c.opens || []).forEach((oid) => {
      const ok = places.includes(oid) || allModes.has(oid) || (oid.startsWith("arc:") && arcIds.includes(oid.slice(4)));
      if (!ok) P.push(at(`${where}: opens "${oid}", which is no map place, mode or arc`));
    });
  });
  if (!arc.test) {
    const list = errandsOf(arc);
    const last = list[list.length - 1];
    if (!last || last.errand.mode !== "fire") P.push(at("the last errand is the Story by the Fire (mode fire, H40)"));
  }
  return P;
}

/** Every arc, checked, plus the agreement with data/unlocks.json. */
export function checkAll(root = ROOT) {
  const index = JSON.parse(readFileSync(join(root, "data/arcs/index.json"), "utf8"));
  const map = JSON.parse(readFileSync(join(root, "data/map.json"), "utf8"));
  const unlocks = JSON.parse(readFileSync(join(root, "data/unlocks.json"), "utf8"));
  const arcIds = index.arcs.map((a) => a.id);
  const modes = knownModes(root);
  const places = (map.places || []).map((p) => p.unlock || p.id).concat((map.places || []).map((p) => p.id));
  const arcs = {};
  const problems = [];
  for (const a of index.arcs) {
    const f = join(root, "data/arcs", `${a.id}.json`);
    if (!existsSync(f)) {
      problems.push(`index: data/arcs/${a.id}.json is missing`);
      continue;
    }
    const arc = JSON.parse(readFileSync(f, "utf8"));
    if (!!a.test !== !!arc.test) problems.push(`${a.id}: test is ${!!arc.test} in the file and ${!!a.test} in the index`);
    arcs[a.id] = arc;
    problems.push(...checkArc(arc, { file: `${a.id}.json`, arcIds, modes, places }));
  }
  const listed = new Set(arcIds.map((x) => `${x}.json`).concat(["index.json"]));
  readdirSync(join(root, "data/arcs"))
    .filter((f) => f.endsWith(".json") && !listed.has(f))
    .forEach((f) => problems.push(`index: data/arcs/${f} isn't listed in data/arcs/index.json`));
  const { rules, notes } = arcRules(arcs);
  notes.forEach((n) => problems.push(n));
  const own = unlocks.rules || {};
  const disagree = Object.keys(rules)
    .filter((k) => !k.startsWith("arc:") && own[k] && JSON.stringify(own[k]) !== JSON.stringify(rules[k]))
    .map((k) => `${k}: data/unlocks.json says ${JSON.stringify(own[k])}, an arc chapter says ${JSON.stringify(rules[k])} (the file wins)`);
  return { arcs, rules, problems, disagree };
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const { arcs, rules, problems, disagree } = checkAll();
  disagree.forEach((d) => console.log(`note: ${d}`));
  if (problems.length) {
    console.error(`check_arcs: ${problems.length} problem(s)`);
    problems.forEach((p) => console.error("  - " + p));
    process.exit(1);
  }
  const opens = Object.entries(rules)
    .filter(([k]) => !k.startsWith("arc:"))
    .map(([k, r]) => `${k} after ${r.after.arc} ch.${r.after.chapter}`);
  console.log(`check_arcs: ok (${Object.keys(arcs).length} arcs, ${Object.values(arcs).reduce((n, a) => n + errandsOf(a).length, 0)} errands; opens: ${opens.join(", ") || "nothing yet"})`);
}
