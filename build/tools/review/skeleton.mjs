#!/usr/bin/env node
// Report skeleton: from a sandbox run and the QA checklist, write a pre-filled build/reports/<name>.md (the proof section filled in).
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { args, help, runDir, rel, ROOT, TOOLS, die } from "./lib/common.mjs";
import * as Baseline from "../../sandbox/lib/baseline.mjs";

const HELP = `
node build/tools/review/skeleton.mjs <name> [--run <id|dir>] [--title "..."] [--force] [--stdout]
  Writes build/reports/<name>.md from the newest (or named) sandbox run: the proof section is filled (pages, flows that reach their end,
  page errors, findings against the baseline with the verdict, the contact sheet folder, sound gaps, screenshot diff headline, word-check counts)
  and the QA checklist results template is laid out for the reviewer (flaws first, one line per flow-size, the regression rows to recheck).
  It never overwrites an existing report unless --force. --stdout prints instead of writing. No network.
  Fill in: what was built, the reviewer's flaws and lines, the comparison with Zafar's last feedback. Keep the finished report under 300 words
  of prose (the tables are the proof, not prose).`;
const a = args(); help(HELP, a);
const name = a.pos[0];
if (!name && !a.has("stdout")) die("Name the report: skeleton.mjs <name> (writes build/reports/<name>.md). --help shows more.");
let run; try { run = runDir(a.val("run")); } catch (e) { die(e.message); }
const dataDir = join(run, "data");
if (!existsSync(dataDir)) die(`No data folder in ${rel(run)}.`);
const results = readdirSync(dataDir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(dataDir, f), "utf8")));
if (!results.length) die(`No results in ${rel(dataDir)}.`);

const sh = (cmd, argv) => { try { return execFileSync(cmd, argv, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 120000 }).trim(); } catch (e) { return (e.stdout || "").toString().trim(); } };
const sha = sh("git", ["rev-parse", "--short", "HEAD"]), branch = sh("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
const flows = [...new Set(results.map((r) => r.flow))];
const pages = results.length, ended = results.filter((r) => r.complete), stopped = results.filter((r) => !r.complete);
const states = results.reduce((s, r) => s + r.states.length, 0), shots = results.reduce((s, r) => s + r.states.filter((x) => x.shot).length, 0);
const errors = [...new Set(results.flatMap((r) => r.errors || []))];
const sizes = [...new Set(results.map((r) => r.size))].sort();

// findings against the baseline (what --check would say)
const cur = Baseline.flatten(results), base = Baseline.load();
const scope = new Set(results.map((r) => `${r.flow}@${r.size}`));
let verdict = "no baseline to compare with";
let cmp = null;
if (base) {
  cmp = Baseline.compare(base, cur, scope);
  const bad = cmp.added.length + cmp.incomplete.length + cmp.newErrors.length + cmp.newIncomplete.length;
  verdict = bad ? `**FAILED**: ${cmp.added.length} new findings, ${cmp.incomplete.length + cmp.newIncomplete.length} flows that do not reach their end, ${cmp.newErrors.length} new page errors` : `**PASSED**: 0 new findings (${cur.findings.length} known, ${cmp.fixed.length} fixed)`;
}
const byCheck = {}; for (const f of cur.findings) byCheck[f.check] = (byCheck[f.check] || 0) + 1;
const topChecks = Object.entries(byCheck).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([k, v]) => `${k} ${v}`).join(", ") || "none";

// sound gaps, shot diff, word checks, regression rows (the other review tools, run on this run)
let gaps = "n/a";
try { const s = JSON.parse(readFileSync(join(run, "sound.json"), "utf8")); gaps = `${(s.gaps || []).length} lines with no family clip, ${(s.informational || []).length} played files that are not an approved family clip`; } catch (e) { /* no sound.json */ }
const diffLine = sh(process.execPath, [join(TOOLS, "shotdiff.mjs"), "--run", run]).split("\n")[0] || "shotdiff: no output";
const wordLines = sh(process.execPath, [join(ROOT, "build", "lint", "words.mjs"), "--top", "0"]).split("\n").filter((l) => /^[A-D]  /.test(l));
const baseIds = [...new Set(flows.map((f) => f.replace(/[@#].*$/, "")))];
const reg = sh(process.execPath, [join(TOOLS, "regress.mjs"), baseIds.join(","), "--max", "500", "--status", "open,reopened,built"]).split("\n").filter((l) => /^ {2}[A-Z]+-[A-Z0-9-]*\d+ /.test(l));
const regSeen = new Set(), regRows = reg.filter((l) => { const id = l.trim().split(/\s+/)[0]; if (regSeen.has(id)) return false; regSeen.add(id); return true; });

// the checklist's areas, from the checklist itself
const qa = existsSync(join(ROOT, "docs/process/qa-checklist.md")) ? readFileSync(join(ROOT, "docs/process/qa-checklist.md"), "utf8") : "";
const areas = [...qa.matchAll(/^## ([A-Z]{3}): (.*)$/gm)].map((m) => ({ id: m[1], title: m[2] }));
const autoScripts = [...new Set([...qa.matchAll(/auto: `?([\w./-]+\.(?:mjs|py|js))`?/g)].map((m) => m[1]))].filter((p) => existsSync(join(ROOT, p))).slice(0, 12);

const t = a.val("title") || name || "Report";
const md = `# ${t}

Branch \`${branch}\`, commit \`${sha}\`. Sandbox run \`${rel(run).replace(/^build\/screenshots\/sandbox\//, "")}\`. Game code changed: <say what, or "no">.

## What was built
<!-- fill in: each change, one line, the files; mechanics changed and old art reused first -->

## Proof (from the run; do not retype)
- **Pages run:** ${pages} (flow x size): ${flows.length} flows at ${sizes.join(", ")}. ${ended.length} reach their end, ${stopped.length} stop short${stopped.length ? ": " + stopped.slice(0, 5).map((r) => `${r.flow} @ ${r.size}`).join("; ") + (stopped.length > 5 ? " ..." : "") : ""}.
- **Page errors:** ${errors.length}${errors.length ? ` (${errors.slice(0, 3).map((e) => e.slice(0, 80)).join(" | ")})` : ""}.
- **Screenshots:** ${shots} of ${states} states, in \`${rel(run)}\` (not committed, B19). Contact sheets: \`${rel(join(run, "sheets"))}/<flow>__<size>.png\`.
- **Layout lint vs baseline:** ${verdict}. Findings in the run: ${cur.findings.length} (${topChecks}).${cmp && cmp.added.length ? "\n" + cmp.added.slice(0, 8).map((f) => `  - NEW ${f.check} ${f.flow} @ ${f.size} ${f.selector}: ${f.measured}`).join("\n") + (cmp.added.length > 8 ? `\n  - ... and ${cmp.added.length - 8} more` : "") : ""}
- **Sound:** ${gaps}.
- **Screenshots against the approved manifest:** ${diffLine}
- **Word checks (report-only):**
${wordLines.length ? wordLines.map((l) => "  - " + l.trim()).join("\n") : "  - (not run)"}

## QA checklist results (\`docs/process/qa-checklist.md\`)
\`\`\`
QA: ${flows.slice(0, 6).join(", ")}${flows.length > 6 ? " ..." : ""} · reviewer: <someone other than the builder> · commit: ${sha}
Auto: layout lint ${base ? (cmp && !(cmp.added.length + cmp.incomplete.length + cmp.newErrors.length + cmp.newIncomplete.length) ? "✅" : "❌") : "?"}${autoScripts.length ? " · other scripts that apply: " + autoScripts.slice(0, 4).join(", ") + " (run them: ✅/❌)" : ""}
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: ${areas.map((x) => `${x.id} ⬜`).join(" · ")}   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: ${regRows.length} rows below
Against Zafar's last feedback: <item ✅ / note>
\`\`\`

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
${results.slice().sort((x, y) => x.flow.localeCompare(y.flow) || x.size.localeCompare(y.size)).slice(0, 80).map((r) => `| ${r.flow} | ${r.size} | ${r.states.length} | ${r.findingCount || 0} | ${r.size === "static" ? "-" : `sheets/${r.flow.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}__${r.size}.png`} |`).join("\n")}${results.length > 80 ? `\n| ... ${results.length - 80} more pages | | | | |` : ""}

### Regression rows to recheck (${regRows.length}; open, reopened and built-not-re-played rows; fixed rows are not listed)
${regRows.length ? regRows.slice(0, 60).map((l) => { const m = /^\s*(\S+)\s+(\S+)\s+(.{38})\s(.*)$/.exec(l); return m ? `- [ ] ${m[1]} · ${m[2]} · ${m[3].trim()} · ${m[4].trim()}` : "- [ ] " + l.trim(); }).join("\n") + (regRows.length > 60 ? `\n- ... ${regRows.length - 60} more (\`node build/tools/review/regress.mjs ${baseIds.slice(0, 3).join(",")}\`)` : "") : "- (none found for these flows)"}

## Left open
<!-- fill in -->
`;
if (a.has("stdout")) { console.log(md); process.exit(0); }
const out = join(ROOT, "build", "reports", `${name}.md`);
if (existsSync(out) && !a.has("force")) die(`${rel(out)} exists: not overwritten (use --force).`);
writeFileSync(out, md);
console.log(`wrote ${rel(out)}: ${pages} pages, ${ended.length} reach their end, ${cmp ? (cmp.added.length ? cmp.added.length + " new findings" : "0 new findings") : "no baseline"}, ${regRows.length} regression rows, ${md.split("\n").length} lines.`);
