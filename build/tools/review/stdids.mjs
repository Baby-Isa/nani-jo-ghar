#!/usr/bin/env node
// The standard's mechanical ID check (Sprint 17; build/reports/s17-standards-structure-v2.md §1.7: "completeness is proven, not
// claimed"). Every source ID is placed exactly once in docs/design-language/standard/placement.md (a rule, a value, a lesson, "not a
// standard" or retired); every rule ID a placement cites is defined on a domain page; no rule ID is defined twice. What is placed as
// "not a standard" or retired, and anything unplaced, is the dropped list (Zafar's to read; it blocks nothing). Format:
// build/reports/s17-standard-format.md.
//
//   node build/tools/review/stdids.mjs --sources [--json]          the source IDs and where each is cited
//   node build/tools/review/stdids.mjs --check [--fragments f1,f2 [--mine]]
//        without --fragments: placement.md complete (exit 1 on an unplaced, doubled or dangling ID)
//        with --fragments: the fragments as they stand (--mine: only what they place and any rule ID they cite that no page defines)
//   node build/tools/review/stdids.mjs --stitch [--fragments f1,f2]   fragments (default build/reports/s17-std-placement-*.md) ->
//        placement.md (doubles merged: rule > value > lesson > not a standard > retired) and the dropped list
//        build/reports/s17-dropped-list.md
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { args, ROOT } from "./lib/common.mjs";

const a = args();
const STD = join(ROOT, "docs/design-language/standard");
const SOURCES = {
  ledger: "build/reports/s16-s17-change-ledger.md",
  chaiPage: "docs/design-language/chai-standard.md",
  kitchenPage: "docs/game-design/families/kitchen.md",
};
const CHAI_JS = "js/cook/stations/chai-tray.js";
const ID_RE = /\b(SH|CHAI|CK|ART|LNG|KEEP|CLN|DAAR|SEK|MAA|CHT|PAN|SAM|BO1|R6|COOK|CORN|EGG|BAK|CHOP)-\d{1,4}\b/g;
const KINDS = ["rule", "value", "lesson", "not a standard", "retired"];
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");
// the sources as they stood when chai was signed off and the standard was filled (7 Nov, commit 50e660f): chai-standard.md is a
// pointer since the stitch, so the source set is read from git, not the working tree
const PIN = "50e660f";
const readPinned = (p) => { const r = spawnSync("git", ["show", `${PIN}:${p}`], { cwd: ROOT, encoding: "utf8", maxBuffer: 32 << 20 }); return r.status === 0 ? r.stdout : read(p); };

// The *14 onboarding states of chai: every once-only key (first14, the S14_TAG keys, the ctl-<phase> lessons)
function onboardingKeys(src) {
  const keys = new Set();
  for (const m of src.matchAll(/first14\(["'`]([a-z0-9-]+)["'`]\)/g)) keys.add(m[1]);
  for (const m of src.matchAll(/\$\{S14_TAG\}([a-z0-9-]+)/g)) keys.add(m[1]);
  // ctl-<phase>: every phase a step can carry, a ternary's both words included (phase: green ? "slow" : "knob")
  if (/first14\(`ctl-\$\{nx\.phase\}`\)/.test(src)) for (const m of src.matchAll(/phase: ([^,}\n]*)/g)) for (const w of m[1].matchAll(/(?<!=== )"([a-z-]+)"/g)) keys.add(`ctl-${w[1]}`);
  for (const m of src.matchAll(/(?:dueAll|spendAll|lesson)\(\s*"([a-z0-9-]+)"/g)) keys.add(m[1]);
  return [...keys].sort().map((k) => `onb:${k}`);
}

export function sources() {
  const map = new Map(); // id -> Set(origin)
  const add = (id, o) => (map.get(id) || map.set(id, new Set()).get(id)).add(o);
  for (const [o, p] of Object.entries(SOURCES)) for (const m of readPinned(p).matchAll(ID_RE)) add(m[0], o);
  // a ledger change with no row ID (a tool, a check, a process change) is its own source: led:<section>-<n>, n its row in the section
  let sec = null, n = 0;
  for (const l of readPinned(SOURCES.ledger).split("\n")) {
    if (/^## 2\./.test(l)) break;
    const h = l.match(/^### (1\.\d+)/);
    if (h) { sec = h[1]; n = 0; continue; }
    if (!sec || !/^\| /.test(l) || /^\| (ID|---)/.test(l)) continue;
    n++;
    const first = l.split("|")[1] || "";
    if (!ID_RE.test(first)) add(`led:${sec}-${n}`, `ledger row: ${first.trim().slice(0, 50)}`);
    ID_RE.lastIndex = 0;
  }
  const js = readPinned(CHAI_JS);
  for (const m of js.matchAll(/\bCHAI-\d{1,4}\b/g)) if (!map.has(m[0])) add(m[0], "chai-tray.js only");
  for (const k of onboardingKeys(js)) add(k, "onboarding state");
  return map;
}

const parseRows = (text) =>
  text
    .split("\n")
    .filter((l) => /^\|\s*(?:[A-Z][A-Z0-9]*-\d+|onb:[a-z0-9-]+|led:1\.\d+-\d+)\s*\|/.test(l))
    .map((l) => {
      const c = l.split("|").slice(1, -1).map((s) => s.trim());
      return { id: c[0], kind: (c[1] || "").toLowerCase(), where: c[2] || "", note: c[3] || "" };
    });

function definedRules() {
  const defs = new Map(); // STD id -> [files]
  if (!existsSync(STD)) return defs;
  for (const f of readdirSync(STD).filter((f) => f.endsWith(".md") && f !== "placement.md")) {
    for (const m of readFileSync(join(STD, f), "utf8").matchAll(/^#{3,4}\s+(STD-[0-9A-H]{2}-\d{2})\b/gm)) (defs.get(m[1]) || defs.set(m[1], []).get(m[1])).push(f);
  }
  return defs;
}
const cites = (where) => [...where.matchAll(/STD-[0-9A-H]{2}-\d{2}/g)].map((m) => m[0]);
const fragFiles = () => {
  if (a.val("fragments")) return String(a.val("fragments")).split(",");
  const d = join(ROOT, "build/reports");
  return readdirSync(d).filter((f) => /^s17-std-placement-.*\.md$/.test(f)).sort().map((f) => `build/reports/${f}`);
};
const rank = (k) => { const i = KINDS.indexOf(k); return i < 0 ? 99 : i; };

if (a.has("sources")) {
  const s = sources();
  if (a.has("json")) console.log(JSON.stringify(Object.fromEntries([...s].map(([k, v]) => [k, [...v]])), null, 1));
  else {
    console.log(`${s.size} source IDs (the ledger, the old chai and kitchen pages, CHAI rows cited only in ${CHAI_JS}, chai's onboarding states)`);
    for (const [k, v] of [...s].sort()) console.log(`${k}\t${[...v].join(", ")}`);
  }
  process.exit(0);
}

if (a.has("stitch")) {
  const files = fragFiles();
  const merged = new Map();
  for (const f of files) for (const r of parseRows(read(f))) {
    const prev = merged.get(r.id);
    if (!prev) { merged.set(r.id, { ...r, by: [f] }); continue; }
    const best = rank(r.kind) < rank(prev.kind) ? r : prev;
    const where = [...new Set([...cites(prev.where), ...cites(r.where)])];
    merged.set(r.id, { id: r.id, kind: best.kind, where: where.length ? where.join(", ") : best.where, note: [prev.note, r.note].filter(Boolean).join("; "), by: [...prev.by, f] });
  }
  const src = sources();
  const all = [...new Set([...src.keys(), ...merged.keys()])].sort();
  const lines = [
    "# Placement: every source ID, placed once",
    "",
    "Stitched by `node build/tools/review/stdids.mjs --stitch` from the five builders' fragments; checked by `stdids.mjs --check`.",
    "The sources: the change ledger (`build/reports/s16-s17-change-ledger.md`), every ID the old chai and kitchen pages cite, the",
    "CHAI rows cited only in `js/cook/stations/chai-tray.js`, and chai's onboarding states (`onb:<key>`). Placed as: rule, value,",
    "lesson, not a standard, retired. The dropped list (not a standard, retired, unplaced): `build/reports/s17-dropped-list.md`.",
    "",
    "| Source ID | Placed as | Where | Note |",
    "|---|---|---|---|",
    ...all.map((id) => { const r = merged.get(id); return r ? `| ${id} | ${r.kind} | ${r.where} | ${r.note.replace(/\|/g, "/")} |` : `| ${id} | unplaced | | |`; }),
    "",
  ];
  writeFileSync(join(STD, "placement.md"), lines.join("\n"));
  const dropped = all.filter((id) => { const r = merged.get(id); return !r || r.kind === "not a standard" || r.kind === "retired"; });
  writeFileSync(join(ROOT, "build/reports/s17-dropped-list.md"), [
    "# The dropped list (Sprint 17): source IDs that became no rule, value or lesson",
    "",
    "For Zafar to read whenever he likes; it blocks nothing. A yes keeps them out of the standard; a no names the rule to write.",
    "",
    "| Source ID | Placed as | Why |",
    "|---|---|---|",
    ...dropped.map((id) => { const r = merged.get(id); return `| ${id} | ${r ? r.kind : "unplaced"} | ${r ? r.note.replace(/\|/g, "/") : ""} |`; }),
    "",
    "## Proof",
    "",
    `\`node build/tools/review/stdids.mjs --stitch\` from ${files.map((f) => `\`${f}\``).join(", ")}; \`--check\` on the result.`,
    "",
  ].join("\n"));
  console.log(`placement.md: ${all.length} IDs from ${files.length} fragment(s); dropped list: ${dropped.length}`);
  process.exit(0);
}

if (a.has("check")) {
  const src = sources();
  const defs = definedRules();
  const fromFrags = !!a.val("fragments");
  const rows = fromFrags ? fragFiles().flatMap((f) => parseRows(read(f)).map((r) => ({ ...r, file: f }))) : parseRows(read("docs/design-language/standard/placement.md")).map((r) => ({ ...r, file: "placement.md" }));
  const problems = [];
  const seen = new Map();
  for (const r of rows) (seen.get(r.id) || seen.set(r.id, []).get(r.id)).push(r);
  for (const r of rows) {
    if (!KINDS.includes(r.kind)) problems.push(`${r.id}: "${r.kind}" is not one of ${KINDS.join(", ")} (${r.file})`);
    if (r.kind === "rule" && !cites(r.where).length) problems.push(`${r.id}: placed as a rule but Where names no STD- rule (${r.file})`);
    for (const id of cites(r.where)) if (!defs.has(id)) problems.push(`${r.id}: cites ${id}, which no page in docs/design-language/standard/ defines yet (${r.file})`);
    if (!src.has(r.id)) problems.push(`${r.id}: not a source ID (a typo, or an extra: fine if meant) (${r.file})`);
  }
  for (const [id, files] of defs) if (files.length > 1) problems.push(`${id}: defined twice (${files.join(", ")})`);
  if (!a.has("mine")) {
    for (const id of src.keys()) if (!seen.has(id)) problems.push(`${id}: unplaced (cited by ${[...src.get(id)].join(", ")})`);
    if (!fromFrags) for (const [id, rs] of seen) if (rs.length > 1) problems.push(`${id}: placed ${rs.length} times`);
  }
  const unplaced = [...src.keys()].filter((id) => !seen.has(id)).length;
  console.log(`${src.size} source IDs; ${seen.size} placed in ${fromFrags ? "the fragments" : "placement.md"}; ${unplaced} unplaced; ${defs.size} rules defined; ${problems.length} problem(s)`);
  for (const p of problems) console.log(`  ${p}`);
  process.exit(problems.length ? 1 : 0);
}

console.log("node build/tools/review/stdids.mjs --sources [--json] | --check [--fragments f1,f2 [--mine]] | --stitch [--fragments f1,f2]");
process.exit(1);
