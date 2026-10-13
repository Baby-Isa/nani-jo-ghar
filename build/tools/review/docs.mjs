#!/usr/bin/env node
/*
 * The docs check (decision 99): the size limits that stop the docs growing back into a monster, and the IDs that must stay unique.
 *   node build/tools/review/docs.mjs [--json]
 * Fails (exit 1) when:
 *   - a file is over its word limit (LIMITS below; CLAUDE.md, status.md and its "Next chat", the newest sprint file, the decisions log,
 *     the fix list, docs/README.md, docs/tools.md)
 *   - a fix-list status cell is over STATUS_CHARS or carries an old "· earlier:" chain (history belongs in the history file)
 *   - a regression ID appears twice across the fix list and its archive, or a decision number twice in the log
 *   - a non-live row (built, fixed, retired) sits in the fix list
 * Run by checks.mjs ("docs"), so every push and every /review runs it. Change a limit only with Zafar's yes.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
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
export const NEXT_CHAT = 600, SPRINT = 1200, STATUS_CHARS = 1200;

const words = (s) => (s.match(/\S+/g) || []).length;
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : null);
export function checkDocs() {
  const fails = [], info = [];
  for (const [p, max] of Object.entries(LIMITS)) {
    const t = read(p); if (t == null) continue;
    const n = words(t); (n > max ? fails : info).push(`${p}: ${n} words (limit ${max})`);
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
  info.push(`${live.length} rows in the fix list, ${all.length - live.length} in the archive`);
  return { fails, info };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = checkDocs();
  if (a.has("json")) console.log(JSON.stringify(r, null, 1));
  else { for (const l of r.info) console.log(`  ${l}`); for (const l of r.fails) console.log(`FAIL ${l}`); console.log(`docs: ${r.fails.length ? `${r.fails.length} over a limit or broken` : "within every limit"}`); }
  process.exit(r.fails.length ? 1 : 0);
}
