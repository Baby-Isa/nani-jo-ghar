#!/usr/bin/env node
/*
 * The docs check (decision 99): the size limits that stop the docs growing back into a monster, and the IDs that must stay unique.
 *   node build/tools/review/docs.mjs [--json]
 * Fails (exit 1) when:
 *   - a file is over its word limit (LIMITS below; CLAUDE.md, status.md and its "Next chat", the newest sprint file, the decisions log,
 *     the fix list, docs/README.md, docs/tools.md) or a mode or design-language doc is over its own limit (DOC_LIMITS: its size after
 *     the Sprint 6 cut-down, rounded up to the next 500 words; a new doc in those folders needs a limit too)
 *   - a fix-list status cell is over STATUS_CHARS or carries an old "· earlier:" chain (history belongs in the history file)
 *   - a regression ID appears twice across the fix list and its archive, or a decision number twice in the log
 *   - a non-live row (built, fixed, retired) sits in the fix list
 * Run by checks.mjs ("docs"), so every push and every /review runs it. Change a limit only with Zafar's yes.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { args, help, ROOT } from "./lib/common.mjs";
import { parseRegressions, statusKind } from "./lib/regressions.mjs";

const a = args();
help(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace(/^[\s\S]*?\/\*\n?/, "").replace(/^ \* ?/gm, ""), a);

export const LIMITS = {
  "CLAUDE.md": 900,
  "docs/status.md": 1500,
  "docs/process/regressions.md": 12000,
  "docs/README.md": 700,
  "docs/tools.md": 1000,
};
// docs/game-design/modes/*.md and docs/design-language/*.md: each doc's size after the Sprint 6 cut-down, rounded up to the next 500
// words, so it passes today and cannot grow unnoticed. Raise one only with Zafar's yes (and archive the old text first).
export const DOC_LIMITS = {
  "docs/game-design/modes/README.md": 500,
  "docs/game-design/modes/clinic.md": 4000,
  "docs/game-design/modes/conversations-wiring.md": 2500,
  "docs/game-design/modes/conversations.md": 14000,
  "docs/game-design/modes/cook.md": 5000,
  "docs/game-design/modes/dress-up.md": 500,
  "docs/game-design/modes/find-it.md": 9500,
  "docs/game-design/modes/first-launch.md": 2500,
  "docs/game-design/modes/monsoon-rush.md": 500,
  "docs/game-design/modes/snap.md": 500,
  "docs/game-design/modes/story-by-the-fire.md": 2500,
  "docs/game-design/modes/tidy-up.md": 500,
  "docs/game-design/modes/who-did-it.md": 500,
  "docs/design-language/art-bible.md": 6500,
  "docs/design-language/art-pipeline.md": 13500,
  "docs/design-language/audio.md": 1000,
  "docs/design-language/guide-and-card.md": 3000,
  "docs/design-language/tone-of-voice.md": 1000,
  "docs/design-language/ui-design-system.md": 3500,
  "docs/design-language/ux-principles.md": 3000,
};
export const DOC_DIRS = ["docs/game-design/modes", "docs/design-language"];
export const NEXT_CHAT = 600, SPRINT = 1200, STATUS_CHARS = 1200;

const words = (s) => (s.match(/\S+/g) || []).length;
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : null);
export function checkDocs() {
  const fails = [], info = [];
  for (const [p, max] of Object.entries(LIMITS)) {
    const t = read(p); if (t == null) continue;
    const n = words(t); (n > max ? fails : info).push(`${p}: ${n} words (limit ${max})`);
  }
  for (const [p, max] of Object.entries(DOC_LIMITS)) {
    const t = read(p); if (t == null) { fails.push(`${p}: in DOC_LIMITS but the file is gone (remove the limit)`); continue; }
    const n = words(t); (n > max ? fails : info).push(`${p}: ${n} words (limit ${max})`);
  }
  for (const d of DOC_DIRS) {
    if (!existsSync(join(ROOT, d))) continue;
    for (const f of readdirSync(join(ROOT, d)).filter((x) => x.endsWith(".md"))) if (!(`${d}/${f}` in DOC_LIMITS)) fails.push(`${d}/${f}: no word limit (add it to DOC_LIMITS in build/tools/review/docs.mjs)`);
  }
  const status = read("docs/status.md");
  if (status) {
    const m = /## Next chat\n([\s\S]*?)\n## /.exec(status + "\n## ");
    const n = m ? words(m[1]) : 0; (n > NEXT_CHAT ? fails : info).push(`status.md "Next chat": ${n} words (limit ${NEXT_CHAT})`);
  }
  // the newest sprint file (older ones are closed records); its Outcome and Look back are not counted
  const sprints = existsSync(join(ROOT, "docs/sprints")) ? readdirSync(join(ROOT, "docs/sprints")).filter((f) => /^S\d+.*\.md$/.test(f)).sort() : [];
  const newest = sprints.at(-1);
  if (newest && newest >= "S06") {
    const t = read(`docs/sprints/${newest}`).split(/\n## Outcome/)[0];
    const n = words(t); (n > SPRINT ? fails : info).push(`docs/sprints/${newest}: ${n} words before its Outcome (limit ${SPRINT})`);
  }
  // the fix list: live rows only, short status cells, no history chains
  const live = parseRegressions(read("docs/process/regressions.md") || "");
  for (const r of live) {
    const k = statusKind(r.status);
    if (["built", "fixed", "retired"].includes(k)) fails.push(`${r.id} is ${k} but still in the fix list (evidence --apply moves it; or move it to docs/archive/regressions-done.md)`);
    if (/· earlier:/.test(r.status)) fails.push(`${r.id}: its status carries an "earlier:" chain (history goes to build/tools/review/data/status-history.jsonl)`);
    if (r.status.length > STATUS_CHARS) fails.push(`${r.id}: status ${r.status.length} characters (limit ${STATUS_CHARS}): the current state in a line or two`);
  }
  const all = [...live, ...parseRegressions(read("docs/archive/regressions-done.md") || "")];
  const seen = new Map(); for (const r of all) seen.set(r.id, (seen.get(r.id) || 0) + 1);
  for (const [id, n] of seen) if (n > 1) fails.push(`${id} appears ${n} times across the fix list and its archive`);
  const dec = read("docs/decisions.md") || "";
  const nums = [...dec.matchAll(/^\| (\d+) \|/gm)].map((m) => m[1]);
  for (const n of new Set(nums)) if (nums.filter((x) => x === n).length > 1) fails.push(`decision ${n} appears twice in docs/decisions.md`);
  // checks-to-build 23: a session report from Sprint 6 on (build/reports/s06-*.md and later) keeps its prose under 300 words
  // (tables and code are the proof, not prose) and carries its proof: a "Proof" section or the evidence runs it rests on
  for (const r of reportProblems()) fails.push(r);
  // checks-to-build 22: every file a live doc names in backticks exists (the archive, generated screenshots and placeholders
  // aside); today's broken ones are build/tools/review/data/doc-paths-known.json, which may only shrink
  const known = new Set(JSON.parse(read("build/tools/review/data/doc-paths-known.json") || "[]"));
  const broken = brokenPaths();
  for (const b of broken) if (!known.has(b)) fails.push(`${b.replace(" -> ", ": names ")}, which does not exist (fix the path, or the doc)`);
  const fixedPaths = [...known].filter((k) => !broken.includes(k));
  if (fixedPaths.length) info.push(`${fixedPaths.length} known broken doc paths are fixed: run docs.mjs --write-known-paths`);
  info.push(`${live.length} rows in the fix list, ${all.length - live.length} in the archive`);
  return { fails, info };
}

export const REPORT_PROSE = 300;
export function proseWords(md) {
  const t = String(md || "").replace(/```[\s\S]*?```/g, "").split("\n").filter((l) => !/^\s*\|/.test(l) && !/^#/.test(l)).join("\n");
  return words(t);
}
export function reportProblems(dir = "build/reports") {
  if (!existsSync(join(ROOT, dir))) return [];
  const out = [];
  for (const f of readdirSync(join(ROOT, dir)).filter((x) => /^s(0[6-9]|[1-9]\d)[a-z0-9-]*\.md$/i.test(x))) {
    const t = read(`${dir}/${f}`) || "";
    const n = proseWords(t);
    if (n > REPORT_PROSE) out.push(`${dir}/${f}: ${n} words of prose (limit ${REPORT_PROSE}; the tables are the proof)`);
    if (!/^#+\s*proof/im.test(t) && !/\bev-\d{8}-\d{4,6}-\w+|\bev-s\d+/.test(t) && !/^#+\s*(what moved|moved)/im.test(t)) out.push(`${dir}/${f}: no proof (a "Proof" section, or the evidence runs it rests on)`);
  }
  return out;
}
export function brokenPaths() {
  const files = [];
  const walk = (d) => { for (const f of readdirSync(join(ROOT, d), { withFileTypes: true })) { const p = `${d}/${f.name}`; if (f.isDirectory()) { if (f.name !== "archive") walk(p); } else if (p.endsWith(".md")) files.push(p); } };
  walk("docs"); files.push("CLAUDE.md");
  if (existsSync(join(ROOT, ".claude/skills"))) for (const s of readdirSync(join(ROOT, ".claude/skills"))) if (existsSync(join(ROOT, `.claude/skills/${s}/SKILL.md`))) files.push(`.claude/skills/${s}/SKILL.md`);
  const out = new Set();
  for (const f of files) for (const m of (read(f) || "").matchAll(/`((?:docs|build|js|css|data|assets|\.claude)\/[^`\s]+?)`/g)) {
    const p = m[1].replace(/[#:].*$/, "").replace(/[),.;]+$/, "");
    if (/[<>*{}$…]|\.\.\.|^build\/screenshots\//.test(p)) continue;
    if (!existsSync(join(ROOT, p))) out.add(`${f} -> ${p}`);
  }
  return [...out].sort();
}

if (import.meta.url === `file://${process.argv[1]}` && a.has("write-known-paths")) {
  writeFileSync(join(ROOT, "build/tools/review/data/doc-paths-known.json"), JSON.stringify(brokenPaths(), null, 1) + "\n");
  console.log("docs: known broken paths written");
  process.exit(0);
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const r = checkDocs();
  if (a.has("json")) console.log(JSON.stringify(r, null, 1));
  else { for (const l of r.info) console.log(`  ${l}`); for (const l of r.fails) console.log(`FAIL ${l}`); console.log(`docs: ${r.fails.length ? `${r.fails.length} over a limit or broken` : "within every limit"}`); }
  process.exit(r.fails.length ? 1 : 0);
}
