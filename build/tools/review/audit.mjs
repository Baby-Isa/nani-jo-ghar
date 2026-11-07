#!/usr/bin/env node
// The audit (Sprint 17, docs/process/prototype-to-game.md "Once, in Sprint 17"): one command plays a game at L1-L4 at the four sizes
// and reports it against the standard, joining the checks that already exist:
//   1 sandbox   build/sandbox/run.mjs --touched <flow> --check: every level and path at the four sizes; the contract checks (one light,
//               bubbles off faces, cards off faces, the order card's light, calls with their lights, ...) and the screen lint (clipped,
//               covered, off-screen text); exit 1 on a contract break or a new finding
//   2 panel     panelcheck.mjs: the side panel's measures and the order film (SH-169, SH-189 to SH-192)
//   3 labcheck  labcheck.mjs on the game's lab page at L1-L4, played to its order: page errors, any word leaving its card, speaker gaps
//   4 leak      leak.mjs <config>: a bot that knows no Kutchi can't win
//   5 load      loadtime.mjs --games <game>: time to the first play tap against the baseline
// Writes build/reports/audit-<game>-<date>.md (one line per step, its result and where its detail is); exit 1 if any step fails.
// The judge looks at what it can't measure (docs/process/prototype-to-game.md, step 3).
//
//   node build/tools/review/audit.mjs <game> [--only sandbox,panel,labcheck,leak,load] [--leak <config>]
//   e.g. node build/tools/review/audit.mjs chai-tray        (Cook games for now: the lab page is lab.html?mode=cook&game=<game>)
//
//   node build/tools/review/audit.mjs --standard <game> [--run <sandbox run id or folder>] [--play | --no-play] [--run-checks | --checks <file>]
//        [--audit-report <file>] [--std-dir <folder>] [--verdicts <file>] [--out <file>] [--quiet]
//        (Sprint 17) every rule of docs/design-language/standard/ that applies to the game (House always, Family for a kitchen-family
//        game, Game for chai-tray) as pass, fail, judge, gap or not run, read from SAVED results: no browser (details: build/reports/s17-tool.md)
import { spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { args, ROOT, RUNS, runDir, rel } from "./lib/common.mjs";
import { parseStandardDir, loadContract, latestContractRun, parseChecksOutput, parseAuditReport, auditRules, renderReport, countBy, RESULTS, DOMAINS } from "./lib/standard.mjs";

const a = args();
if (a.has("standard")) process.exit(await standardAudit());

// ---- --standard <game>: the standard's rules against the saved results (a browser only when --play is given) ----
async function standardAudit() {
  const game = a.val("standard") || a.pos[0];
  if (!game) { console.log("node build/tools/review/audit.mjs --standard <game> [--run <id|folder>] [--play] [--run-checks | --checks <file>] [--std-dir <folder>] [--out <file>] [--quiet]"); return 1; }
  const day = new Date().toISOString().slice(0, 10);
  const short = (p) => (p.startsWith(ROOT) ? rel(p) : p);
  const stdDir = a.val("std-dir") || process.env.NJG_STANDARD_DIR || join(ROOT, "docs/design-language/standard");
  const parsed = parseStandardDir(stdDir);
  if (parsed.missing) { console.error(`No standard folder at ${short(stdDir)} yet (--std-dir <folder> points at another).`); return 2; }
  const sources = [`standard: \`${short(stdDir)}\` (${parsed.files.length} pages, ${parsed.rules.length} rules)`];

  // the audit's own steps, only when asked to play (--no-play wins)
  if (a.has("play") && !a.has("no-play")) {
    console.log(`== playing the audit: node build/tools/review/audit.mjs ${game}`);
    spawnSync("node", [join(ROOT, "build/tools/review/audit.mjs"), game], { cwd: ROOT, stdio: "inherit", timeout: 150 * 60000 });
  }

  // contract: --run (a run id or a folder), else the newest sandbox run that covers the game
  let contract;
  try { contract = loadContract(a.val("run") ? runDir(a.val("run")) : latestContractRun(RUNS, game), game); }
  catch (e) { console.error(e.message); return 2; }
  sources.push(contract.found
    ? `contract run: \`${short(contract.dir)}\` (${contract.date || "undated"}; ${contract.ran.size} checks, ${contract.gamePages} of ${contract.pages || "its"} pages are ${game}, ${contract.breaks.length} breaks in all)${contract.covered ? "" : "; it has no pages of this game, so every contract term is not run"}`
    : "contract run: none found (every contract term is not run; give --run <id|folder>)");

  // checks: --run-checks runs the no-browser steps now; --checks <file> or the last saved output otherwise
  let checks = null;
  const savedChecks = join(ROOT, "build", "screenshots", "audit", "checks-latest.txt");
  if (a.has("run-checks")) {
    mkdirSync(join(ROOT, "build", "screenshots", "audit"), { recursive: true });
    const r = spawnSync("node", [join(ROOT, "build/tools/review/checks.mjs"), "--only", "unit,words,static,leak,bump,specs,docs,recordings,fixlist,art,size"], { cwd: ROOT, encoding: "utf8", timeout: 40 * 60000, maxBuffer: 64 << 20 });
    const text = `${r.stdout || ""}${r.stderr || ""}`;
    writeFileSync(savedChecks, text);
    checks = parseChecksOutput(text);
    sources.push(`checks: run just now (${[...checks.values()].filter((x) => x.ok).length} of ${checks.size} steps ok; the browser step "load" is not run here)`);
  } else {
    const f = a.val("checks") || (existsSync(savedChecks) ? savedChecks : null);
    if (f && existsSync(f)) { checks = parseChecksOutput(readFileSync(f, "utf8")); sources.push(`checks: saved output \`${short(f)}\` of ${statSync(f).mtime.toISOString().slice(0, 10)} (${checks.size} steps)`); }
    else sources.push("checks: none saved (every check: term is not run; use --run-checks or --checks <file>)");
  }

  // tools: the audit's own step results (the game's latest audit report, or --audit-report)
  let tools = null;
  const repDir = join(ROOT, "build/reports");
  const reports = existsSync(repDir) ? readdirSync(repDir).filter((f) => f.startsWith(`audit-${game}-`) && /^\d{4}-\d\d-\d\d\.md$/.test(f.slice(`audit-${game}-`.length))).sort() : [];
  const auditFile = a.val("audit-report") || (reports.length ? join(repDir, reports[reports.length - 1]) : null);
  if (auditFile && existsSync(auditFile)) { tools = parseAuditReport(readFileSync(auditFile, "utf8")); sources.push(`tools: audit report \`${short(auditFile)}\` (steps: ${[...tools.keys()].join(", ") || "none"})`); }
  else sources.push("tools: no audit report for this game (every tool: term is not run; use --play, or --audit-report <file>)");

  // probes: the verdict cache
  const vf = a.val("verdicts") || join(ROOT, "build/tools/review/data/verdicts.json");
  let verdicts = null;
  if (existsSync(vf)) { try { verdicts = JSON.parse(readFileSync(vf, "utf8")); } catch { /* unreadable: treated as absent */ } }
  sources.push(verdicts ? `probes: verdict cache \`${short(vf)}\` (${Object.keys(verdicts).length} rows)` : "probes: no verdict cache (every probe: term is not run)");

  const audit = auditRules(parsed.rules, { game, contract, checks, tools, verdicts });
  const command = `node build/tools/review/audit.mjs --standard ${game}${a.val("run") ? ` --run ${a.val("run")}` : ""}`;
  const md = renderReport({ game, day, audit, problems: parsed.problems, sources, command });
  const out = a.val("out") || join(ROOT, "build", "reports", `audit-standard-${game}-${day}.md`);
  writeFileSync(out, md);

  const total = countBy(audit.results);
  if (a.has("quiet")) {
    console.log(`Standard audit: ${game}, ${audit.results.length} rules (${audit.scopes.join(" + ")})`);
    for (const k of [...new Set(audit.results.map((x) => x.rule.domain))].sort()) { const c = countBy(audit.results.filter((x) => x.rule.domain === k)); console.log(`  ${k} ${(DOMAINS[k] || "").padEnd(12)} ${RESULTS.map((r) => `${c[r]} ${r}`).join(", ")}`); }
  } else console.log(md);
  console.log(`\n${short(out)}: ${RESULTS.map((r) => `${total[r]} ${r}`).join(", ")}${parsed.problems.length ? `; ${parsed.problems.length} malformed block problem(s)` : ""}`);
  return total.fail || parsed.problems.length ? 1 : 0;
}

const game = a.pos[0];
if (!game || a.has("help")) {
  console.log("node build/tools/review/audit.mjs <game> [--only sandbox,panel,labcheck,leak,load] [--leak <config>]");
  process.exit(game ? 0 : 1);
}
const only = a.val("only") ? String(a.val("only")).split(",") : null;
const want = (k) => !only || only.includes(k);
const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
const day = new Date().toISOString().slice(0, 10);
const logDir = join(ROOT, "build", "screenshots", "audit", `${game}-${stamp}`);
mkdirSync(logDir, { recursive: true });
const leakCfg = a.val("leak") || (existsSync(join(ROOT, "build/tools/review/leak-configs", `${game}.json`)) ? game : "cook");

const steps = [];
const run = (key, what, cmd, argv, timeoutMin) => {
  if (!want(key)) return;
  console.log(`\n== ${key}: ${what}\n   node ${[cmd, ...argv].join(" ")}`);
  const t0 = Date.now();
  const r = spawnSync("node", [join(ROOT, cmd), ...argv], { cwd: ROOT, encoding: "utf8", timeout: timeoutMin * 60000, maxBuffer: 64 << 20 });
  const outText = `${r.stdout || ""}${r.stderr || ""}`;
  const log = join(logDir, `${key}.log`);
  writeFileSync(log, outText);
  const tail = outText.trim().split("\n").filter(Boolean).slice(-3).join(" / ").slice(0, 400);
  const ok = r.status === 0;
  steps.push({ key, what, ok, min: ((Date.now() - t0) / 60000).toFixed(1), tail, log: log.slice(ROOT.length + 1) });
  console.log(`   ${ok ? "pass" : "FAIL"} (${steps[steps.length - 1].min} min): ${tail}`);
};

run("sandbox", "every level and path at the four sizes: the contract checks and the screen lint", "build/sandbox/run.mjs", ["--touched", `cook:${game}`, "--parallel", "2", "--no-sheets", "--run-id", `audit-${game}-${stamp}`], 60);
run("panel", "the side panel's measures and the order film", "build/tools/review/panelcheck.mjs", ["--game", game, "--json", join(logDir, "panel.json")], 40);
run("labcheck", "the lab page at L1-L4, played to the order: errors, spills, speaker gaps", "build/tools/review/labcheck.mjs", ["lab.html", ...[1, 2, 3, 4].map((l) => `mode=cook&game=${game}&level=${l}&nonav=1&seed=7&speed=3`), "--until", ".wc14-pop", "--play", "--out", join(logDir, "labcheck")], 20);
run("leak", "a bot that knows no Kutchi can't win", "build/tools/review/leak.mjs", [leakCfg], 20);
run("load", "time to the first play tap against the baseline", "build/tools/review/loadtime.mjs", ["--games", game], 15);

const fails = steps.filter((s) => !s.ok);
const md = [
  `# Audit: ${game} (${day})`,
  "",
  `\`node build/tools/review/audit.mjs ${game}\`: ${fails.length ? `**${fails.length} of ${steps.length} steps fail**` : `all ${steps.length} steps pass`}. Logs: \`${logDir.slice(ROOT.length + 1)}/\`.`,
  "The judge looks at what this can't measure (the light's look, the motion, the art); the standard is `docs/process/prototype-to-game.md`.",
  "",
  "| Step | What it checks | Result | Minutes | Last lines |",
  "|---|---|---|---|---|",
  ...steps.map((s) => `| ${s.key} | ${s.what} | ${s.ok ? "pass" : "**FAIL**"} | ${s.min} | ${s.tail.replace(/\|/g, "/")} |`),
  "",
];
const report = join(ROOT, "build", "reports", `audit-${game}-${day}.md`);
writeFileSync(report, md.join("\n"));
console.log(`\n${report.slice(ROOT.length + 1)}: ${fails.length ? `${fails.length} step(s) fail` : "all pass"}`);
process.exit(fails.length ? 1 : 0);
