#!/usr/bin/env node
// Brief generator: a small JSON spec -> a complete session brief in the template's shape, with the standing boilerplate added.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, args, help, die, sh } from "./lib.mjs";
import { MODEL_TABLE, modelFor, modelTableText, contextPack, overlaps, liveSpecs, outsideScope, NAMES_HELPERS, proofLines, missingEvidence, EVIDENCE_FILE, briefRegressionRows } from "./briefpack.mjs";
import { loadRegressions, statusKind } from "../review/lib/regressions.mjs";
import { kitMap, kitMapText, loadKit } from "../review/kitmap.mjs";

const HELP = `
node build/tools/ops/brief.mjs <spec.json> [--out file] [--no-rows] [--no-pack] [--flow-rows]
node build/tools/ops/brief.mjs --live-check
node build/tools/ops/brief.mjs --audit <spec.json> <git range>   every file the session's commits touched is in its owns; anything
                                                                  else is listed as a request and /review fails on it (exit 1)
  Fills docs/process/session-brief-template.md from a spec and adds the standing lines every brief needs (rules B3, B4, B16, B17:
  read-first list, no helpers, don't remove mechanics, proof via touched mapper + shotdiff, the regression rows for the flows
  it touches via regress.mjs, finish rules). Prints the brief (paste it as the session's first message) or writes --out.
  Spec fields (see build/tools/ops/specs/4e-clinic-engine.json):
    name, model, effort, why, cost, stop, branch            the header lines
    read: [...]  the area design docs (required; e.g. docs/game-design/modes/clinic.md);  rules: [...] archived rulebook sections, only if needed
    owns: [...], readOnly: [...], stubs                     files
    permissions                                             what to grant up front
    tasks: [{do, accept}]                                   numbered, each with its acceptance criterion
    flows: ["clinic:heal-cut", ...]                         the flows the builder replays (the contract run at 1280x665 and 915x412)
    elements: ["finger", "glow", ...]                       shared elements (data/kit-elements.json): PLACES (kitmap.mjs: every file:line that
                                                             draws or styles each), their open rows, and the kitsheet proof line
    rows: [...]                                              fix-list rows beyond the ones the tasks name. REGRESSION ROWS: the rows the tasks
                                                             name plus the open rows of the elements named (--flow-rows: the old per-flow list)
    kind: art|design|review|code|shared|spec|driver|tools|docs|verdicts|report|text|counts|logs   picks the default model and effort
                          from the table (Fable: art, design, the review before main; Opus high: code, shared; Sonnet medium: specs,
                          drivers, docs, verdicts, reports; Haiku: text-only expects, counts, logs). "model" in the spec still wins.
    live: true                                               this brief is running: two live briefs may not own one path (exit 1)
    specsByBuilder: true                                     the builder writes the evidence specs for the fix-list rows its tasks name (the spec
                                                             must own build/sandbox/data/evidence.json). Without it, a row named in a task with
                                                             no entry in that file refuses the brief: write the evidence spec before the builder starts
    port, browser: true|false                              browser tests and the session's own COOK_TEST_PORT
    report, publish: false|true, extra: [...]               finish: the report name; whether this session ends with the push to main
  --no-rows   skip the regress.mjs lookup (rows are then left for the session to look up). No network.
  --no-pack   do not write the context pack (<spec>.context.md: under 2k words, the last 15 decisions and the rules the task names, pasted).
  --live-check  only check the live specs in build/tools/ops/specs for overlapping "owns"; exit 1 on an overlap.`;
const a = args(); help(HELP, a);
// two live briefs must not own one path (cost-and-speed change 5)
const clash = overlaps(liveSpecs());
if (a.has("live-check")) {
  const n = liveSpecs().filter((x) => x.live).length;
  if (clash.length) { for (const c of clash) console.error(`OVERLAP: "${c.a}" owns ${c.pathA}; "${c.b}" owns ${c.pathB}`); die(`${clash.length} overlap(s) between live briefs.`, 1); }
  console.log(`${n} live briefs, no overlap.`); process.exit(0);
}
if (a.has("audit")) {
  const spec = JSON.parse(readFileSync(a.val("audit") === true ? a.pos[0] : a.val("audit"), "utf8"));
  const range = a.val("audit") === true ? a.pos[1] : a.pos[0];
  if (!range) die("Give the git range of the session's commits: --audit <spec.json> <base>..<head>.");
  const files = sh("git", ["diff", "--name-only", range]).split("\n").filter(Boolean);
  const out = outsideScope(spec.owns, files, { report: spec.report });
  console.log(out.length ? `scope: ${out.length} file(s) outside "${spec.name}"'s owns (requests, not edits):\n${out.map((f) => `  ${f}`).join("\n")}` : `scope: all ${files.length} files are "${spec.name}"'s own`);
  process.exit(out.length ? 1 : 0);
}
if (!a.pos[0]) die("Give a spec file. --help shows the fields.");
const s = JSON.parse(readFileSync(a.pos[0], "utf8"));
s.specFile = a.pos[0].startsWith(ROOT + "/") ? a.pos[0].slice(ROOT.length + 1) : a.pos[0].replace(/^\.\//, "");
if (!s.model && s.kind) { const m = modelFor(s.kind); if (!m) die(`Unknown kind "${s.kind}". Known: ${Object.keys(MODEL_TABLE).join(", ")}.`); s.model = m.model; s.effort = s.effort || m.effort; s.why = s.why || m.why; }
for (const k of ["name", "model", "cost", "stop", "branch", "owns", "tasks"]) if (s[k] == null) die(`Spec is missing "${k}" (or give "kind" for the model).`);
if (NAMES_HELPERS(JSON.stringify(s.tasks) + " " + (s.extra || []).join(" "))) die("The spec sets up helper sessions: one build session at a time (two at most on different files), no helpers.");
if (s.live && clash.length) { for (const c of clash) console.error(`OVERLAP: "${c.a}" owns ${c.pathA}; "${c.b}" owns ${c.pathB}`); die(`${clash.length} overlap(s) between live briefs: one owner per path; the other brief lists it read-only (an edit there goes in the report as a request).`, 1); }

{ // Sprint 8: a task that names a fix-list row needs that row's evidence spec before the builder starts
  const m = missingEvidence(s, JSON.parse(readFileSync(join(ROOT, EVIDENCE_FILE), "utf8")), new Set(loadRegressions().map((r) => r.id)));
  if (!m.ok) die(m.message, 1);
}
const L = [], add = (...x) => L.push(...x), list = (xs) => (xs || []).map((x) => `  - ${x}`);
const report = s.report || s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

add(`SESSION NAME / MODE:  ${s.name}`,
  `MODEL AND EFFORT:     ${s.model}${s.effort ? `, ${s.effort} effort` : ""}${s.why ? ` (${s.why})` : ""}`,
  `COST ESTIMATE:        ${s.cost}`,
  `HARD STOP:            ${s.stop}. Commit every 30-40 minutes${s.publish ? "" : " (builders never push: the orchestrator merges)"}.`,
  `BRANCH:               ${s.branch}. ${s.publish ? "Push to main only as the last step, per FINISH." : "Never push to main."}`, "");

add(`MODEL TABLE (defaults by kind of work): ${modelTableText()}`, "");
const packFile = a.pos[0].replace(/\.json$/, "") + ".context.md";
if (!a.has("no-pack")) {
  const pack = contextPack(s);
  writeFileSync(packFile, pack);
  add(`CONTEXT PACK: ${packFile.replace(process.cwd() + "/", "")} (${pack.split(/\s+/).filter(Boolean).length} words: the last 15 decisions, the rules this task names and the checks it must pass; paste it after this brief)`, "");
}
add("READ FIRST (in this order):",
  "  1. CLAUDE.md (all of it: the working agreement and non-negotiables)",
  "  2. docs/tools.md (the checks are the rules) and the context pack",
  "  3. docs/process/qa-checklist.md (definition of done)",
  "  4. the design doc(s) for this area:");
(s.read || []).forEach((r, i) => add(`     ${r}`));
add("");

add("FILES THIS SESSION OWNS (edit only these):", ...list(s.owns),
  "READ-ONLY (never edit):", ...list([...(s.readOnly || []), ((s.owns || []).some((o) => o.startsWith("js/shared/")) ? "" : "js/shared/**, ") + "build/tools/** and every other session's files unless listed above"]),
  `SHARED PIECES NEEDED BUT MISSING: ${s.stubs || "write a marked stub with the same API in your own folder (B17)"}`, "",
  "DO NOT remove or replace any mechanic or mini-game Zafar hasn't commented on.",
  "LOAD ONLY WHAT'S ON SCREEN (decision 68): a mode or mini-game declares its own asset list and loads it only when chosen (prefetched during the greeting or request pop-up); never preload another game's art; images at drawn size. `node build/tools/review/loadcheck.mjs` must pass.",
  "NO helper sessions or background helpers (B3).",
  "A new or changed evidence spec must pass `node build/tools/review/evidence.mjs --lint-specs`, and its first red run must show the probe reached its state (the panel shows it) before any fix is judged on it.",
  `PERMISSIONS NEEDED UP FRONT: ${s.permissions || "git push to the branch; Node, Python"}${s.browser === false ? "" : "; the browser (Playwright, /opt/pw-browsers/chromium)"}`, "");

add("TASKS (each with its acceptance criterion):");
s.tasks.forEach((t, i) => add(`  ${i + 1}. ${t.do}`, `     Accept: ${t.accept || "looked at, not just tests passed"}`));
add("");

// PLACES (S13-T): every file:line that draws or styles each element the brief names (kitmap.mjs; the kit's home first, then the copies)
if ((s.elements || []).length) {
  add(`PLACES (build/tools/review/kitmap.mjs --elem ${s.elements.join(",")}: where each element is drawn or styled today; one place to fix, the copies go):`, kitMapText(kitMap(s.elements)), "");
}

// REGRESSION ROWS (S13-T): the rows the tasks name and the open rows of the elements named, never a flow's whole list (S12's 190+)
if (!a.has("no-rows") && !a.has("flow-rows")) {
  let kit = { elements: {} }; try { kit = loadKit(); } catch (e) { /* no element map: element rows are listed as unknown */ }
  const R = briefRegressionRows(s, loadRegressions().map((r) => ({ id: r.id, issue: r.issue, check: r.check, open: /^(open|reopened)$/.test(statusKind(r.status)) })), kit);
  const total = new Set([...R.named, ...R.elements.flatMap((e) => e.ids)]).size;
  add(`REGRESSION ROWS TO RECHECK (${total}; * = open or reopened; the contract replay of your flows covers the rest):`);
  add(`  the rows the tasks name (${R.named.length}): ${R.named.join(", ") || "none"}`);
  for (const e of R.elements) add(`  ${e.name} (its open rows, ${e.ids.length}): ${e.unknown ? "not in data/kit-elements.json" : e.ids.join(", ") || "none"}`);
  add("");
}
// the old list (--flow-rows): every regression row of the flows the brief touches
if (s.flows?.length && !a.has("no-rows") && a.has("flow-rows")) {
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
  add(`REGRESSION ROWS TO RECHECK (${total} rows of the fix list and its done archive; * = open or reopened):`);
  if (common.length) add(`  every flow here (${common.length}): ${common.join(", ")}`);
  for (const g of groups) { const own = g.ids.filter((id) => !common.includes(id)); if (own.length) add(`  ${g.flow} (${own.length}): ${own.join(", ")}`); }
  if (!groups.length) add("  none found for these flows: run `node build/tools/review/touched.mjs --json | node build/tools/review/regress.mjs --stdin`");
  add("");
}

add(...proofLines(s, report));
add(
  `TESTS: ${s.browser === false ? "no browser needed" : `your own browser lock (\`flock -w 1800 /tmp/njg-browser-${s.port || "PORT"}.lock timeout ...\`: each builder runs its own browser, two at most on this machine; Zafar, 21 Oct), own COOK_TEST_PORT = ${s.port || "<pick the next free one; record it in docs/architecture/testing.md>"}; batch proofs: fix several rows, then one --after run of the brief's rows and one contract replay`}.`, "");

add("GIT: commit small and often, never force-push, messages end with the Co-Authored-By and Claude-Session lines.",
  `FINISH: build/reports/${report}.md (under 300 words: what changed, the proof, open rows), the QA checklist results, one line in docs/process/overnight-log.md (append only), commit the branch${s.publish ? " and push it" : " (never push)"}.` +
  (s.publish ? " Then `python3 build/bump_version.py` and ONE push of HEAD:main (or `node build/tools/ops/publish.mjs --go`)." : " No bump_version, no push to main."));
(s.extra || []).forEach((x) => add(x));

const text = L.join("\n") + "\n";
if (a.val("out")) { writeFileSync(a.val("out"), text); console.log(`Wrote ${a.val("out")}: ${L.length} lines, ${s.tasks.length} tasks.`); }
else process.stdout.write(text);
