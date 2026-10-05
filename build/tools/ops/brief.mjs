#!/usr/bin/env node
// Brief generator: a small JSON spec -> a complete session brief in the template's shape, with the standing boilerplate added.
import { readFileSync, writeFileSync } from "node:fs";
import { args, help, die, sh } from "./lib.mjs";

const HELP = `
node build/tools/ops/brief.mjs <spec.json> [--out file] [--no-rows]
  Fills docs/process/session-brief-template.md from a spec and adds the standing lines every brief needs (rules B3, B4, B16, B17:
  read-first list, no helpers, don't remove mechanics, proof via touched mapper + shotdiff, the regression rows for the flows
  it touches via regress.mjs, finish rules). Prints the brief (paste it as the session's first message) or writes --out.
  Spec fields (see build/tools/ops/specs/4e-clinic-engine.json):
    name, model, effort, why, cost, stop, branch            the header lines
    rules: ["2","3",...]  rulebook sections;  read: [...]   extra read-first docs after the standard four
    owns: [...], readOnly: [...], stubs                     files
    permissions                                             what to grant up front
    tasks: [{do, accept}]                                   numbered, each with its acceptance criterion
    flows: ["clinic:heal-cut", ...], shared: true          regression rows to list (regress.mjs); "touched" lets the session map them
    port, browser: true|false                               browser tests and the session's own COOK_TEST_PORT
    report, publish: false|true, extra: [...]               finish: the report name; whether this session ends with the push to main
  --no-rows   skip the regress.mjs lookup (rows are then left for the session to look up). No network.`;
const a = args(); help(HELP, a);
if (!a.pos[0]) die("Give a spec file. --help shows the fields.");
const s = JSON.parse(readFileSync(a.pos[0], "utf8"));
for (const k of ["name", "model", "cost", "stop", "branch", "owns", "tasks"]) if (s[k] == null) die(`Spec is missing "${k}".`);

const L = [], add = (...x) => L.push(...x), list = (xs) => (xs || []).map((x) => `  - ${x}`);
const report = s.report || s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

add(`SESSION NAME / MODE:  ${s.name}`,
  `MODEL AND EFFORT:     ${s.model}${s.effort ? `, ${s.effort} effort` : ""}${s.why ? ` (${s.why})` : ""}`,
  `COST ESTIMATE:        ${s.cost}`,
  `HARD STOP:            ${s.stop}. Push the branch every 30-40 minutes.`,
  `BRANCH:               ${s.branch}. ${s.publish ? "Push to main only as the last step, per FINISH." : "Never push to main."}`, "");

add("READ FIRST (in this order):",
  "  1. CLAUDE.md (all of it: the working agreement and non-negotiables)",
  `  2. docs/process/rules.md: sections ${(s.rules || ["2", "3"]).join(", ")} only`,
  "  3. docs/process/qa-checklist.md (definition of done)",
  "  4. docs/status.md (\"Next chat\")");
(s.read || []).forEach((r, i) => add(`  ${i + 5}. ${r}`));
add("");

add("FILES THIS SESSION OWNS (edit only these):", ...list(s.owns),
  "READ-ONLY (never edit):", ...list([...(s.readOnly || []), "js/shared/**, build/tools/** and every other session's files unless listed above"]),
  `SHARED PIECES NEEDED BUT MISSING: ${s.stubs || "write a marked stub with the same API in your own folder (B17)"}`, "",
  "DO NOT remove or replace any mechanic or mini-game Zafar hasn't commented on.",
  "NO helper sessions or background helpers (B3).",
  `PERMISSIONS NEEDED UP FRONT: ${s.permissions || "git push to the branch; Node, Python"}${s.browser === false ? "" : "; the browser (Playwright, /opt/pw-browsers/chromium)"}`, "");

add("TASKS (each with its acceptance criterion):");
s.tasks.forEach((t, i) => add(`  ${i + 1}. ${t.do}`, `     Accept: ${t.accept || "looked at, not just tests passed"}`));
add("");

// regression rows for the flows the brief touches
if (s.flows?.length && !a.has("no-rows")) {
  const out = sh("node", ["build/tools/review/regress.mjs", s.flows.join(","), "--max", "999", ...(s.shared ? ["--shared"] : [])], { soft: true });
  const groups = [];
  for (const line of out.split("\n")) {
    const h = /^(.+?): (\d+) rows/.exec(line);
    if (h) groups.push({ flow: h[1].replace(/ \(.*\)$/, ""), ids: [] });
    const r = /^\s+([A-Z]+-[A-Z0-9-]+)\s+(\S+)/.exec(line);
    if (r && groups.length) groups.at(-1).ids.push(r[2] === "open" || r[2] === "reopened" ? `${r[1]}*` : r[1]);
  }
  // rows every flow shares are listed once; each flow then lists only its own
  const flowGroups = groups.filter((g) => g.flow !== "shared components");
  const common = flowGroups.length > 1 ? flowGroups[0].ids.filter((id) => flowGroups.every((g) => g.ids.includes(id))) : [];
  const total = new Set(groups.flatMap((g) => g.ids)).size;
  add(`REGRESSION ROWS TO RECHECK (${total} rows of docs/process/regressions.md; * = open or reopened):`);
  if (common.length) add(`  every flow here (${common.length}): ${common.join(", ")}`);
  for (const g of groups) { const own = g.ids.filter((id) => !common.includes(id)); if (own.length) add(`  ${g.flow} (${own.length}): ${own.join(", ")}`); }
  if (!groups.length) add("  none found for these flows: run `node build/tools/review/touched.mjs --json | node build/tools/review/regress.mjs --stdin`");
  add("");
}

add("PROOF (rule C8, decision 48: fast checks only; the orchestrator's /review runs the full matrix once before a publish):",
  "  - Tests, leak scripts, check_onboard and `node build/tools/review/checks.mjs` (incl. the word lint).",
  "  - Map what you changed: `node build/tools/review/touched.mjs` and run its sandbox command at 1366x768 only, one shot each.",
  "  - `node build/tools/review/shotdiff.mjs` and look at sheets/changed.png yourself; list flaws first (zoom x2).",
  "  - `node build/tools/review/touched.mjs --json | node build/tools/review/regress.mjs --stdin`: recheck every row it lists.",
  "  - `node build/tools/review/skeleton.mjs " + report + "` starts the report's proof section.",
  `TESTS: ${s.browser === false ? "no browser needed" : `browser tests one at a time (\`flock -w 1800 /tmp/njg-browser.lock timeout ...\`, B16), own COOK_TEST_PORT = ${s.port || "<pick the next free one; record it in docs/architecture/testing.md>"}`}.`, "");

add("GIT: commit small and often, never force-push, messages end with the Co-Authored-By and Claude-Session lines.",
  `FINISH: build/reports/${report}.md (under 300 words: what changed, the proof, open rows), the QA checklist results, one line in docs/process/overnight-log.md (append only), commit and push the branch.` +
  (s.publish ? " Then `python3 build/bump_version.py` and ONE push of HEAD:main (or `node build/tools/ops/publish.mjs --go`)." : " No bump_version, no push to main."));
(s.extra || []).forEach((x) => add(x));

const text = L.join("\n") + "\n";
if (a.val("out")) { writeFileSync(a.val("out"), text); console.log(`Wrote ${a.val("out")}: ${L.length} lines, ${s.tasks.length} tasks.`); }
else process.stdout.write(text);
