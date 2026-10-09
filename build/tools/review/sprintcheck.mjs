#!/usr/bin/env node
// The sprint check (decision 78, rule C21): plays every regressions.md row the sprint touched, makes one evidence sheet per row,
// and hands Fable a prompt to judge each sheet against the row's words. The logic is in lib/sprint.mjs (unit tested).
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { args, help, die, more, ROOT, rel } from "./lib/common.mjs";
import { parseRegressions, REGRESSIONS } from "./lib/regressions.mjs";
import { sprintRows, planRows, groupJobs, pagesOf, pickShots } from "./lib/sprint.mjs";

const HELP = `
node build/tools/review/sprintcheck.mjs [--plan] [--since <ref>] [--rows ID,ID] [--quick | --sizes a,b] [--json]
node build/tools/review/sprintcheck.mjs --run [--since <ref>] [--rows ...] [--quick | --sizes a,b] [--parallel 3] [--run-id id | --resume id]
node build/tools/review/sprintcheck.mjs --sheets [--run-id id] [--from-run <sandbox run id> --since <ref>]
node build/tools/review/sprintcheck.mjs --judge-prompt [--run-id id]
  The sprint's rows: every row of docs/process/regressions.md that was added, or whose status or issue text changed, between <ref>
  and the working tree. Default <ref>: the parent of the commit that created the newest docs/sprints/S*.md (so the rows written
  when the sprint opened count too).
  --plan          (the default) each row -> the sandbox flows and sizes that show its state, the UNMAPPED rows (each needs a flow or
                  a manual check before the sprint can close), the retired ones, and the exact commands. The flows come from the row's
                  Check words first (game, station, stage names, flow ids; "L1–L3", "#mistake", "bulb", "844x390" narrow levels,
                  paths and sizes), else the regress.mjs lookup inverted (the row's section), else its issue words; a row about
                  every game, or a contract row (regress.mjs CONTRACT_ROWS) with no other flow, plays the 8 Oct contract route.
  --run           plays the plan through build/sandbox/run.mjs with --check (a contract break fails), under the browser lock in
                  13-minute chunks (flock -w 1800 ... timeout 1200 --budget-min 13), resuming until done; one run.mjs invocation per
                  size set, all into build/screenshots/sandbox/<run-id>/. Interrupted: the same line with --resume <run-id>.
  --sheets        after a run: build/screenshots/sprintcheck/<run>/<ROW>.png per row (a header strip with the row's id, issue, Check
                  and Source; then contract-break moments, the states whose names match the Check's words, else each flow's
                  start/mid/end) and build/reports/sprintcheck-<run>.md (row | flows | contract result | sheet | verdict, the
                  UNMAPPED list). Takes the browser lock itself (about 1 s a sheet). Keeps verdicts already written.
                  --from-run <id>: the sheets from a sandbox run that already played the flows (the gate before a publish:
                  nothing is played again; a flow it lacks shows as "not played")
  --judge-prompt  prints the prompt for the reviewer (Fable): judge each sheet, flaws first, PASS/FAIL + one line into the report.
  --rows a,b      only these of the sprint's rows      --quick  every flow at 1366x768 only (the rotate card at its own size)
  --sizes a,b     every flow at these sizes            --json   the plan as JSON
  Port: COOK_TEST_PORT (default 8843). No network.`;
const a = args(); help(HELP, a);
const PORT = process.env.COOK_TEST_PORT || "8843";
const LOCK = "/tmp/njg-browser.lock";
const OUT = join(ROOT, "build", "screenshots", "sprintcheck");
const SANDBOX = join(ROOT, "build", "screenshots", "sandbox");
const git = (...x) => { try { return execFileSync("git", x, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 }).trim(); } catch (e) { return null; } };
const stamp = () => new Date().toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
const slug60 = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); // the recorder's folder names

// ---------- the plan ----------
function defaultSince() {
  const dir = join(ROOT, "docs", "sprints");
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => /^S\d+.*\.md$/.test(f)).sort() : [];
  if (!files.length) die("No docs/sprints/S*.md: name the start with --since <ref>.");
  const f = `docs/sprints/${files[files.length - 1]}`;
  const created = (git("log", "--diff-filter=A", "--format=%H", "--", f) || "").split("\n").filter(Boolean).pop();
  if (!created) die(`${f} is not committed yet: name the start with --since <ref>.`);
  return { ref: git("rev-parse", "--verify", "-q", `${created}~1`) ? `${created.slice(0, 7)}~1` : created.slice(0, 7), why: `the commit before ${f} was created (${created.slice(0, 7)})` };
}
async function makePlan() {
  const since = a.val("since") ? { ref: a.val("since"), why: "--since" } : defaultSince();
  const sha = git("rev-parse", "--verify", "-q", `${since.ref}^{commit}`);
  if (!sha) die(`Unknown git ref "${since.ref}".`);
  const oldText = git("show", `${sha}:docs/process/regressions.md`) || "";
  const newText = readFileSync(REGRESSIONS, "utf8");
  let { rows, removed } = sprintRows(oldText, newText);
  if (a.val("rows")) { const want = new Set(a.val("rows").split(",").map((s) => s.trim())); rows = rows.filter((r) => want.has(r.id)); removed = removed.filter((r) => want.has(r.id)); }
  const { allFlows, flowSizes } = await import("../../sandbox/flows/index.mjs");
  const { SIZES, QUICK_SIZE } = await import("../../sandbox/lib/env.mjs");
  const { CONTRACT_ROUTE } = await import("../../sandbox/lib/contract.mjs");
  const live = allFlows();
  const info = new Map(live.map((f) => [f.id, { sizes: f.static ? ["static"] : flowSizes(f), upright: !!f.upright, static: !!f.static }]));
  const flowInfo = (id) => info.get(id);
  const plan = planRows(rows, parseRegressions(newText), { allIds: live.map((f) => f.id), sizes: SIZES, route: CONTRACT_ROUTE });
  const sizes = a.val("sizes") ? a.val("sizes").split(",") : null;
  for (const s of sizes || []) if (!SIZES[s]) die(`Unknown size ${s}. Known: ${Object.keys(SIZES).join(", ")}`);
  const groups = groupJobs(plan, flowInfo, { quick: a.has("quick"), sizes, quickSize: QUICK_SIZE }).map((g) => ({ ...g, pages: pagesOf(g, flowInfo) }));
  return { since: since.ref, sinceWhy: since.why, sinceSha: sha, head: git("rev-parse", "--short", "HEAD"), dirty: !!git("status", "--porcelain", "--", "docs/process/regressions.md"), options: { quick: a.has("quick"), sizes }, rows: plan, removed: removed.map((r) => ({ id: r.id, issue: r.issue })), groups };
}
const runCmd = (g, runId) => `COOK_TEST_PORT=${PORT} flock -w 1800 ${LOCK} timeout 1200 node build/sandbox/run.mjs --flow ${g.flows.join(",")}${g.sizes ? ` --sizes ${g.sizes.join(",")}` : ""} --parallel ${a.val("parallel", "3")} --budget-min ${a.val("budget-min", "13")} --check --no-sheets --run-id ${runId} --resume ${runId}`;
const mapped = (P) => P.rows.filter((p) => p.flows.length);
const unmapped = (P) => P.rows.filter((p) => !p.flows.length && p.kind !== "retired");
const shortFlows = (fs) => { const out = []; let last = ""; for (const f of fs) { const b = f.replace(/[@#].*$/, ""); out.push(b === last ? f.slice(b.length) : f); last = b; } return out.join(", "); };

function printPlan(P, runId) {
  const by = (re) => P.rows.filter((p) => re.test(p.change)).length;
  console.log(`sprint check: ${P.rows.length} rows changed in docs/process/regressions.md since ${P.since} (${P.sinceWhy}) up to ${P.head}${P.dirty ? " + uncommitted edits" : ""}: ${by(/added/)} added, ${by(/status/)} status, ${by(/issue/)} issue text`);
  const M = mapped(P), U = unmapped(P), R = P.rows.filter((p) => p.kind === "retired");
  console.log(`\nmapped (${M.length}): row -> flows${P.options.quick ? " (all at 1366x768: --quick)" : P.options.sizes ? ` (all at ${P.options.sizes.join(",")})` : ""}`);
  more(M, 400, (p) => `  ${p.id.padEnd(8)} ${p.kind.padEnd(8)} ${p.via.split(" ")[0].padEnd(7)} ${shortFlows(p.flows)}${p.sizes.length && !P.options.quick && !P.options.sizes ? `  @ ${p.sizes.join(",")}` : ""}${p.contract.length ? `  [${p.contract.join(", ")} on every page]` : ""}${p.notes.length ? `  (${p.notes.join("; ")})` : ""}`);
  console.log(`\nUNMAPPED (${U.length}): each must get a flow or a manual check before the sprint can close`);
  more(U, 400, (p) => `  ${p.id.padEnd(8)} ${p.kind.padEnd(8)} ${p.section.slice(0, 28).padEnd(28)} check: ${p.check.slice(0, 70)} | ${p.issue.slice(0, 70)}`);
  if (R.length || P.removed.length) console.log(`\nretired or removed this sprint (nothing to play): ${[...R.map((p) => p.id), ...P.removed.map((r) => r.id + " (removed)")].join(", ")}`);
  const pages = P.groups.reduce((n, g) => n + g.pages, 0), flows = new Set(P.groups.flatMap((g) => g.flows)).size;
  console.log(`\nto play: ${flows} flows, ${pages} pages in ${P.groups.length} run.mjs invocation${P.groups.length === 1 ? "" : "s"}; about ${Math.ceil(pages * 0.23)} min of browser time at 3 pages at once`);
  const opts = `${a.val("since") ? ` --since ${P.since}` : ""}${a.val("rows") ? ` --rows ${a.val("rows")}` : ""}${P.options.quick ? " --quick" : ""}${P.options.sizes ? ` --sizes ${P.options.sizes.join(",")}` : ""}`;
  console.log(`\n  node build/tools/review/sprintcheck.mjs --run${opts} --run-id ${runId}\n\nwhich runs, each under the lock in 13-minute chunks resumed until done (run.mjs exit 75):`);
  for (const g of P.groups) console.log(`  ${runCmd(g, runId)}`);
  console.log(`\nthen: node build/tools/review/sprintcheck.mjs --sheets --run-id ${runId} && node build/tools/review/sprintcheck.mjs --judge-prompt --run-id ${runId}`);
  console.log(`(after a gate run, nothing needs playing again: node build/tools/review/sprintcheck.mjs --sheets --from-run <gate run id>${opts})`);
}

// ---------- a run's saved state ----------
function runFolder(id) {
  if (id) return join(OUT, id);
  const runs = existsSync(OUT) ? readdirSync(OUT).map((n) => join(OUT, n)).filter((p) => existsSync(join(p, "plan.json"))).sort((x, y) => statSync(join(y, "plan.json")).mtimeMs - statSync(join(x, "plan.json")).mtimeMs) : [];
  if (!runs.length) die("No sprint check run yet: --run first (or --run-id <id>).");
  return runs[0];
}
const loadState = (dir) => { const f = join(dir, "plan.json"); if (!existsSync(f)) die(`No plan in ${rel(dir)}: run --run first.`); return JSON.parse(readFileSync(f, "utf8")); };
const saveState = (dir, P) => { mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, "plan.json"), JSON.stringify(P, null, 1)); };

// ---------- --run ----------
async function run() {
  const runId = a.val("resume") || a.val("run-id") || `sprint-${stamp()}`;
  const dir = join(OUT, runId);
  let P = a.val("resume") && existsSync(join(dir, "plan.json")) ? loadState(dir) : null;
  if (!P) { P = await makePlan(); P.run = runId; P.sandboxRun = runId; P.created = new Date().toISOString(); saveState(dir, P); }
  printPlan(P, runId);
  const log = (s) => { const l = `${new Date().toTimeString().slice(0, 8)} ${s}`; console.log(l); appendFileSync(join(dir, "run.log"), l + "\n"); };
  for (const [i, g] of P.groups.entries()) {
    if (g.done) { log(`group ${i + 1}/${P.groups.length} already done (exit ${g.code})`); continue; }
    let code = 75, chunks = 0;
    while (code === 75 && chunks < 60) {
      chunks++;
      log(`group ${i + 1}/${P.groups.length} (${g.flows.length} flows${g.sizes ? ` at ${g.sizes.join(",")}` : ""}) chunk ${chunks}: waiting for the browser lock`);
      const argv = ["-w", "1800", LOCK, "timeout", "1200", process.execPath, join(ROOT, "build/sandbox/run.mjs"), "--flow", g.flows.join(","), ...(g.sizes ? ["--sizes", g.sizes.join(",")] : []), "--parallel", a.val("parallel", "3"), "--budget-min", a.val("budget-min", "13"), "--check", "--no-sheets", "--run-id", runId, "--resume", runId];
      const r = spawnSync("flock", argv, { stdio: "inherit", cwd: ROOT, env: { ...process.env, COOK_TEST_PORT: PORT } });
      code = r.status === null || r.status === 124 ? 75 : r.status; // killed by the 20-minute timeout: its finished pages are saved, go on
    }
    if (code !== 0 && code !== 1) { log(`group ${i + 1}: run.mjs exited ${code}; stopping. Fix it, then: node build/tools/review/sprintcheck.mjs --run --resume ${runId}`); process.exit(code || 2); }
    g.done = true; g.code = code; saveState(dir, P);
    log(`group ${i + 1}/${P.groups.length}: ${code === 0 ? "CHECK PASSED" : "CHECK FAILED (a new finding, a flow short of its end or a contract break: see the lines above)"}`);
  }
  const bad = P.groups.filter((g) => g.code === 1).length;
  log(`sprint check run ${runId}: ${P.groups.length} groups played, ${bad} failed --check. Sandbox output: ${rel(join(SANDBOX, runId))}/ (summary.md, contract.md)`);
  console.log(`next: node build/tools/review/sprintcheck.mjs --sheets --run-id ${runId}`);
  process.exit(bad ? 1 : 0);
}

// ---------- --sheets ----------
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
function readVerdicts(file) {
  const v = new Map();
  if (!existsSync(file)) return v;
  for (const l of readFileSync(file, "utf8").split("\n")) {
    const m = /^\| ([A-Z][A-Z]*-[A-Z0-9-]*\d+)\b.*\| ([^|]*) \|$/.exec(l);
    if (m && m[2].trim()) v.set(m[1], m[2].trim());
  }
  return v;
}
async function sheets() {
  if (!process.env.NJG_SPRINTCHECK_LOCKED) { // the browser renders the sheets: one at a time, under the lock (B16)
    const r = spawnSync("flock", ["-w", "1800", LOCK, "timeout", "900", process.execPath, ...process.argv.slice(1)], { stdio: "inherit", env: { ...process.env, NJG_SPRINTCHECK_LOCKED: "1", COOK_TEST_PORT: PORT } });
    process.exit(r.status === null ? 124 : r.status);
  }
  let dir, P;
  if (a.val("from-run")) { // sheets from a sandbox run that already played these flows (the gate): nothing to play
    if (!existsSync(join(SANDBOX, a.val("from-run"), "data"))) die(`No sandbox run ${a.val("from-run")} in ${rel(SANDBOX)}.`);
    P = await makePlan(); P.run = a.val("run-id") || `sprint-${stamp()}`; P.sandboxRun = a.val("from-run"); P.created = new Date().toISOString();
    dir = join(OUT, P.run); saveState(dir, P);
  } else { dir = runFolder(a.val("run-id")); P = loadState(dir); }
  const runId = P.run;
  const sdir = join(SANDBOX, P.sandboxRun || runId), ddir = join(sdir, "data");
  if (!existsSync(ddir)) die(`No sandbox data in ${rel(ddir)}: --run --resume ${runId} first.`);
  const results = readdirSync(ddir).map((f) => JSON.parse(readFileSync(join(ddir, f), "utf8"))).filter((r) => r.size !== "static");
  const byFlow = new Map();
  for (const r of results) { if (!byFlow.has(r.flow)) byFlow.set(r.flow, []); byFlow.get(r.flow).push(r); }
  const Contract = await import("../../sandbox/lib/contract.mjs");
  const breaks = Contract.report(results, { root: ROOT }).breaks;
  const { startServer, launch } = await import("../../sandbox/lib/env.mjs");
  const { htmlToPng, shotUrl } = await import("../../sandbox/lib/sheets.mjs");
  const server = await startServer(), browser = await launch({ webgl: false });
  const page = await browser.newPage({ viewport: { width: 1480, height: 900 } });
  const shotPath = (flow, size, shot) => join(sdir, slug60(flow), size, shot);
  const reportFile = join(ROOT, "build", "reports", `sprintcheck-${runId}.md`);
  const verdicts = readVerdicts(reportFile);
  const lines = [];
  const sizePref = (p) => (r) => (p.sizes.includes(r.size) ? 0 : r.size === "1366x768" ? 1 : 2);
  for (const p of mapped(P)) {
    const rs = p.flows.flatMap((f) => (byFlow.get(f) || []).slice().sort((x, y) => sizePref(p)(x) - sizePref(p)(y)));
    const ran = new Set(rs.map((r) => r.flow)), missing = p.flows.filter((f) => !ran.has(f));
    const short = rs.filter((r) => !r.complete).map((r) => `${r.flow} @ ${r.size}`);
    // the contract: its check over every page of the run; this row's own flows' breaks first
    const mine = breaks.filter((b) => p.contract.includes(b.check)).sort((x, y) => (p.flows.includes(y.flow) ? 1 : 0) - (p.flows.includes(x.flow) ? 1 : 0));
    const contract = p.contract.length ? (mine.length ? `FAIL: ${mine.length} ${p.contract.join("/")} breaks (${mine.filter((b) => p.flows.includes(b.flow)).length} in this row's flows)` : `PASS: 0 ${p.contract.join("/")} breaks over ${results.length} pages`) : "not contract-covered";
    const cells = [];
    for (const b of mine) { // one cell per moment (several breaks can share a shot), at most 4
      const src = b.shot && shotPath(b.flow, b.size, b.shot), same = src && cells.find((c) => c.src === src);
      if (same) { same.n++; continue; }
      if (src && cells.length < 4) cells.push({ src, cap: `${b.flow} @ ${b.size}`, sub: `${b.check} BREAK at ${b.at}s: ${b.measured}`, bad: true, n: 1 });
    }
    for (const c of cells) if (c.n > 1) c.sub += ` (and ${c.n - 1} more break${c.n > 2 ? "s" : ""} at this moment)`;
    // one result per flow first (the row's sizes, then laptop), then the rest, up to 12 cells
    const order = [...p.flows.map((f) => rs.find((r) => r.flow === f)).filter(Boolean), ...rs];
    const used = new Set();
    for (const r of order) {
      if (cells.length >= 12) break;
      const k = `${r.flow}@${r.size}`; if (used.has(k)) continue; used.add(k);
      for (const s of pickShots(p, r, [], { max: Math.min(3, 12 - cells.length) })) cells.push({ src: shotPath(r.flow, r.size, s.shot), cap: `${r.flow} @ ${r.size}`, sub: `${s.label} (${s.why})${r.complete ? "" : " · did not reach its end"}`, bad: !r.complete });
    }
    const html = `<!doctype html><meta charset="utf-8"><style>
      body{margin:0;padding:16px;background:#f3ece0;font:15px/1.35 Nunito,system-ui,sans-serif;color:#2a1f14;width:1448px}
      header{background:#fff;border:3px solid #2a1f14;border-radius:10px;padding:12px 16px;margin-bottom:14px}
      h1{font-size:30px;margin:0 0 6px} h1 small{font-size:16px;font-weight:600;color:#6b5a45;margin-left:10px}
      header p{margin:4px 0} .k{font-weight:800} .issue{font-size:18px} .bad{color:#a02a20;font-weight:700}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      figure{margin:0;background:#fff;border:3px solid #6aa56a;border-radius:8px;overflow:hidden} figure.bad{border-color:#d9534f}
      figure img{width:100%;display:block} figcaption{padding:6px 8px;font-size:13px} figcaption b{display:block}
      .none{font-size:20px;padding:30px;background:#fff;border:3px dashed #d9534f;border-radius:10px}
    </style><header><h1>${esc(p.id)}<small>${esc(p.kind)} · ${esc(p.section)} · changed: ${esc(p.change)}</small></h1>
      <p class="issue"><span class="k">Issue:</span> ${esc(p.issue)}</p>
      <p><span class="k">Check:</span> ${esc(p.check)}</p><p><span class="k">Source:</span> ${esc(p.source)}</p>
      <p><span class="k">Contract:</span> <span class="${/^FAIL/.test(contract) ? "bad" : ""}">${esc(contract)}</span></p>
      <p><span class="k">Flows (${esc(p.via.split(" ")[0])}):</span> ${esc(shortFlows(p.flows))}${missing.length ? ` <span class="bad">not played: ${esc(missing.join(", "))}</span>` : ""}${short.length ? ` <span class="bad">did not reach the end: ${esc(short.join(", "))}</span>` : ""}</p></header>
      ${cells.length ? `<div class="grid">${cells.map((c) => `<figure class="${c.bad ? "bad" : ""}"><img src="${esc(shotUrl(c.src))}"><figcaption><b>${esc(c.cap)}</b>${esc(c.sub)}</figcaption></figure>`).join("")}</div>` : `<p class="none">No shots: this row's flows were not played in run ${esc(runId)}.</p>`}`;
    const png = await htmlToPng(page, join(dir, `${p.id}.html`), html);
    lines.push(`| ${p.id} (${p.kind}) | ${shortFlows(p.flows)}${missing.length ? `; NOT PLAYED: ${missing.join(", ")}` : ""}${short.length ? `; short of the end: ${short.length}` : ""} | ${contract} | \`${rel(png)}\` | ${verdicts.get(p.id) || ""} |`);
    console.log(`${p.id}: ${cells.length} shots -> ${rel(png)}`);
  }
  await page.close(); await browser.close(); server.close();
  const U = unmapped(P), R = P.rows.filter((p) => p.kind === "retired");
  const totalBreaks = breaks.length;
  let md = `# Sprint check ${runId}\n\nRows changed in \`docs/process/regressions.md\` since \`${P.since}\` (${P.sinceWhy}) up to ${P.head}: ${P.rows.length} (${mapped(P).length} played, ${U.length} unmapped, ${R.length} retired). Sandbox run \`${rel(sdir)}/\`: ${results.length} pages, ${results.filter((r) => r.complete).length} reached their end, ${totalBreaks} contract breaks (\`contract.md\`). Sheets: \`${rel(dir)}/<ROW>.png\`.\n\n`;
  md += `Judge: \`node build/tools/review/sprintcheck.mjs --judge-prompt --run-id ${runId}\` (Fable writes PASS or FAIL and one line in the verdict column; only a PASS makes a row built, decision 78).\n\n`;
  md += `| row | flows | contract result | sheet | verdict |\n|---|---|---|---|---|\n${lines.join("\n")}\n\n`;
  md += `## UNMAPPED (${U.length}): each needs a flow or a manual check before the sprint can close\n\n${U.map((p) => `- ${p.id} (${p.kind}, ${p.section}): check "${p.check}"; ${p.issue.slice(0, 160)}`).join("\n") || "none"}\n`;
  if (R.length || P.removed.length) md += `\n## Retired or removed this sprint (nothing to play)\n\n${[...R.map((p) => `- ${p.id}: ${p.issue.slice(0, 120)}`), ...P.removed.map((r) => `- ${r.id} (removed)`)].join("\n")}\n`;
  writeFileSync(reportFile, md);
  console.log(`${lines.length} sheets in ${rel(dir)}/; report ${rel(reportFile)} (${U.length} unmapped)`);
}

// ---------- --judge-prompt ----------
function judgePrompt() {
  const dir = runFolder(a.val("run-id")), P = loadState(dir), runId = P.run;
  const report = join(ROOT, "build", "reports", `sprintcheck-${runId}.md`);
  if (!existsSync(report)) die(`No report yet: node build/tools/review/sprintcheck.mjs --sheets --run-id ${runId}`);
  const M = mapped(P), U = unmapped(P);
  console.log(`You are the reviewer (Fable) for Nani jo Ghar's sprint check (decision 78, rule C21). Judge each evidence sheet against its regression row's own words: the row text is Zafar's feedback, and only what the sheet shows counts as evidence (not the builder's report, not passing tests).

Report to fill: ${report}
Sheets: ${dir}/<ROW>.png. Each has a header strip (the row's id, its issue in Zafar's words, its Check, its Source, the contract result and the flows played), then the sandbox's shots of the states that show it: contract-break moments first (red border), then the states whose names match the Check, else each flow's start, middle and end. A red border also marks a flow that did not reach its end.

For each row below, open its sheet (read the PNG; open a single shot at full size from the sandbox run folder if a detail is too small), then:
1. Flaws first: list what is wrong on screen (clipping, overlap, a bubble away from its speaker's head, old art, English text for the child, anything the row says must not happen), even when it is not this row's point.
2. Verdict: PASS only if the shots show the row's issue fixed as its words say. FAIL if they show it is not, if the contract result is FAIL, or if the sheet does not show the state the row is about ("FAIL: no evidence: <the state that is missing>"). Never pass a row on what the shots cannot show (sound, timing, feel): say what a person must check instead.
3. Write "PASS: <one line>" or "FAIL: <one line>" in that row's verdict column of the report. Change nothing else in the report and do not edit docs/process/regressions.md (the orchestrator moves rows from your verdicts).

Rows (${M.length}):`);
  for (const p of M) console.log(`- ${p.id} [${p.kind}] sheet ${join(dir, p.id + ".png")}\n  Issue: ${p.issue}\n  Check: ${p.check}${p.contract.length ? `\n  Contract: ${p.contract.join(", ")} (its result is in the header)` : ""}`);
  if (U.length) console.log(`\nUNMAPPED (${U.length}, no sheet): list them back as "needs a flow or a manual check": ${U.map((p) => p.id).join(", ")}`);
  console.log(`\nEnd with: n PASS, n FAIL, then every FAIL (id and its one line) as the list Zafar gets before he plays.`);
}

// ---------- main ----------
if (a.has("run")) await run();
else if (a.has("sheets")) await sheets();
else if (a.has("judge-prompt")) judgePrompt();
else {
  const P = await makePlan();
  if (a.has("json")) console.log(JSON.stringify(P, null, 1));
  else printPlan(P, a.val("run-id") || `sprint-${stamp()}`);
}
