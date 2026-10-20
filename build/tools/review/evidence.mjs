#!/usr/bin/env node
// The evidence loop (decision 82, docs/architecture/evidence-loop.md): every regressions.md row proven by the game and judged in small
// cropped sheets, verdicts cached so only changed evidence is judged again. Specs: build/sandbox/data/evidence.json.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, appendFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { args, help, die, more, ROOT, rel } from "./lib/common.mjs";
import { parseRegressions, REGRESSIONS, REGRESSIONS_DONE, readAllRegressions, gitRegressions, moveRows, plain, statusKind } from "./lib/regressions.mjs";
import { sprintRows } from "./lib/sprint.mjs";
import { rowOutcome, dhash, fingerprint, cacheHit, batches, parseVerdicts, captureLabels, passRefusal, applyVerdicts, applyGuard, sha, TEXT_KINDS, specHash, redGreen, legacyReds } from "./lib/evidence.mjs";

const HELP = `
node build/tools/review/evidence.mjs --plan  [--rows a,b | --all | --sprint [--since ref]] [--json]
node build/tools/review/evidence.mjs --run   [same rows] [--run-id id | --resume id] [--from-run <sandbox run>] [--parallel 3]
node build/tools/review/evidence.mjs --sheets [--run-id id]            (--run ends with it)
node build/tools/review/evidence.mjs --judge  [--run-id id] [--batch 10] [--audit 10]
node build/tools/review/evidence.mjs --collect [--run-id id]
node build/tools/review/evidence.mjs --apply  [--run-id id] [--dry]
  --plan     the rows' specs, validated (an unknown flow, path, level, size, capture, profile, or an \`at\` no driver reaches is an
             error), the pages to play (one page per flow, level, path, size, profile, seed, renderer and pixel ratio serves every
             probe on it) and the rows with no spec. Exit 1 on any error or row with no spec (a row with no spec is never "built").
             Rows: --all (every live row: default), --rows a,b, or --sprint (sprintcheck.mjs's rows: added or changed since --since).
             Rows tagged needs-decision in their Check go to docs/status.md, never to a sheet.
  --run      plays those pages through build/sandbox/run.mjs --evidence (13-minute chunks under the browser lock, resumable with
             --resume <id>; inside an outer flock it runs one chunk and exits 75 when pages are left), then --sheets.
             --from-run <id>: a sandbox run (a gate run with --evidence) whose pages already carry the probes: only the pages it
             lacks are played (one run, not two).
  --sheets   per row: build/screenshots/evidence/<run>/<ROW>.png (at most 1200 px wide: the row's words, then at most four panels
             A-D (one per probe, up to A-L over two sheets, for a row with more than four probes) at 1:1 CSS px; a layout panel is the whole screen with the crop outlined) and <ROW>.md (the panels in words, voice
             timeline, text, traces, script output, expect results, tool failures); build/reports/evidence-<run>.md (the index).
             Text-only rows (wording, voice) have no PNG.
  --judge    writes judge/batch-NN.md prompts (8-10 rows of one kind, text-only rows up to 30) for the rows a reviewer must see:
             not decided by expect, not a tool failure, not cached with the same evidence. --audit 10: also re-judge 10% of the
             cached PASSes (a different model). The reviewer fills judge/batch-NN.verdicts.md.
  --collect  folds the batch verdict files into build/tools/review/data/verdicts.json (refuses the builder's session as judge and
             a PASS that names no panel); EVIDENCE lines go to the tool owner's list in the index.
  --apply    writes the verdicts into docs/process/regressions.md: FAIL -> **reopened** with the run (the line stays in data/verdicts.json;
             a "waiting on ..." note is kept); PASS -> built with the line (keep and retired rows untouched). --dry prints what it would change.
  Port: COOK_TEST_PORT (default 8843). The builder's session: NJG_BUILDER or --builder (recorded; never accepted as judge).`;
const a = args(); help(HELP, a);
const PORT = process.env.COOK_TEST_PORT || "8843";
const LOCK = "/tmp/njg-browser.lock";
const OUT = join(ROOT, "build", "screenshots", "evidence");
const SANDBOX = join(ROOT, "build", "screenshots", "sandbox");
const CACHE = join(ROOT, "build", "tools", "review", "data", "verdicts.json");
const git = (...x) => { try { return execFileSync("git", x, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 26 }).trim(); } catch (e) { return null; } };
// minutes, seconds and a random suffix: four sessions share the branch and one minute is not unique (S05-T2)
const stamp = () => new Date().toISOString().replace(/[-:]/g, "").slice(0, 15).replace("T", "-") + "-" + Math.random().toString(36).slice(2, 5);
const log = (dir) => (s) => { const l = `${new Date().toTimeString().slice(0, 8)} ${s}`; console.log(l); if (dir) appendFileSync(join(dir, "run.log"), l + "\n"); };

// ---------- the rows ----------
function defaultSince() {
  const dir = join(ROOT, "docs", "sprints");
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => /^S\d+.*\.md$/.test(f)).sort() : [];
  if (!files.length) die("No docs/sprints/S*.md: name the start with --since <ref>.");
  const f = `docs/sprints/${files[files.length - 1]}`;
  const created = (git("log", "--diff-filter=A", "--format=%H", "--", f) || "").split("\n").filter(Boolean).pop();
  if (!created) die(`${f} is not committed yet: name the start with --since <ref>.`);
  return git("rev-parse", "--verify", "-q", `${created}~1`) ? `${created}~1` : created;
}
function selectRows() {
  const text = readAllRegressions();
  const all = parseRegressions(text);
  let rows;
  if (a.has("sprint")) {
    const ref = a.val("since") || defaultSince();
    const old = gitRegressions(ref);
    rows = sprintRows(old, text).rows;
  } else rows = all;
  // live rows: not retired, not the keep-checks (never touched by the loop)
  rows = rows.filter((r) => !["retired", "keep"].includes(statusKind(r.status)) && !/retired|^keep/i.test(r.h2));
  if (a.val("rows")) { const want = new Set(a.val("rows").split(",").map((s) => s.trim())); rows = all.filter((r) => want.has(r.id)); }
  const decision = rows.filter((r) => /needs-decision/i.test(r.check));
  return { all, rows: rows.filter((r) => !/needs-decision/i.test(r.check)), decision };
}

// ---------- the plan ----------
async function makePlan() {
  const S = await import("../../sandbox/lib/evidence.mjs");
  const M = await import("../../sandbox/lib/moments.mjs");
  const { allFlows, resolveFlow, flowKind } = await import("../../sandbox/flows/index.mjs");
  const { SIZES } = await import("../../sandbox/lib/env.mjs");
  const { CHECKS } = await import("../../sandbox/lib/contract.mjs");
  const live = allFlows();
  const cache = new Map();
  const resolve = (id) => { if (!cache.has(id)) cache.set(id, resolveFlow(id, live)); return cache.get(id); };
  const seen = M.seenMoments(ROOT);
  const { rows, decision, all } = selectRows();
  const spec = S.loadSpec(ROOT);
  const rowText = Object.fromEntries(all.map((r) => [r.id, plain(r.check)]));
  const ctx = { resolve, kindOf: flowKind, sizes: SIZES, contractChecks: Object.keys(CHECKS), moments: (id) => M.momentsFor(ROOT, id, { kindOf: flowKind, seen }), reachable: M.reachable, rowText };
  // validate the whole file (a broken spec of a row not run today is still broken), plan the selected rows
  const norm = S.normalizeSpec(spec, ctx);
  const ids = rows.map((r) => r.id);
  // a row whose entry is {human} (Zafar's ear or feel) or {needsDecision} (docs/status.md) gets no page; a row with a spec error
  // gets none either: it is a tool failure until its spec or its driver is fixed
  const playable = ids.filter((id) => !norm.human[id] && !norm.decision[id] && !(norm.obsolete || {})[id]);
  const { pages, repo, noSpec } = S.planPages(playable, norm.rows);
  const errRows = Object.fromEntries(Object.entries(norm.rowErrors).filter(([id]) => ids.includes(id)));
  const unknownRows = Object.keys(norm.rows).filter((id) => !all.some((r) => r.id === id));
  const pick = (o) => Object.fromEntries(Object.entries(o).filter(([id]) => ids.includes(id)));
  return { created: new Date().toISOString(), head: git("rev-parse", "--short", "HEAD"), rows: rows.map((r) => ({ id: r.id, issue: plain(r.issue), check: plain(r.check), source: plain(r.source), status: plain(r.status), kind: statusKind(r.status), section: [r.h2, r.h3].filter(Boolean).join(" > ") })), decision: [...new Set([...decision.map((r) => r.id), ...Object.keys(pick(norm.decision))])], human: pick(norm.human), decisionText: pick(norm.decision), obsolete: pick(norm.obsolete || {}), noSpec, errors: norm.errors.filter((e) => ids.includes(e.split(/:| probe /)[0])), fileErrors: norm.errors.length, rowErrors: errRows, warnings: norm.warnings, unknownRows, pages, repo, spec: Object.fromEntries(ids.filter((id) => spec[id]).map((id) => [id, spec[id]])) };
}
function printPlan(P) {
  const L = log(null);
  const nh = Object.keys(P.human || {}).length, nerr = Object.keys(P.rowErrors || {}).length;
  console.log(`evidence plan: ${P.rows.length} rows: ${P.rows.length - P.noSpec.length} with a spec (${nh} Zafar's ear or feel, ${P.decision.length} need a decision, ${nerr} with spec errors), ${P.pages.length} pages, ${P.pages.reduce((n, p) => n + p.probes.length, 0)} page probes, ${(P.repo || []).length} script probes`);
  if (P.errors.length) {
    console.log(`\nSPEC ERRORS (${P.errors.length} in ${nerr} of these rows; the file has ${P.errors.length} in all): build/sandbox/data/evidence.json. These rows are tool failures until fixed`);
    const by = {}; for (const e of P.errors) { const k = /no driver of|not built in the sandbox|never came/.test(e) ? (e.match(/at "([^"]+)"|after "([^"]+)"|driver "([^"]+)"/) || [])[0] || "moment" : e.replace(/^[A-Z0-9-]+ probe \d+: /, "").replace(/"[^"]*"/g, '"…"').slice(0, 60); by[k] = (by[k] || 0) + 1; }
    console.log("  by cause: " + Object.entries(by).sort((x, y) => y[1] - x[1]).slice(0, 30).map(([k, v]) => `${k} ${v}`).join("; "));
    more(P.errors, a.has("all-errors") ? 2000 : 40, (e) => `  ${e}`);
  }
  if (P.warnings.length) { console.log(`\nwarnings (${P.warnings.length})`); more(P.warnings, 20, (e) => `  ${e}`); }
  if (P.unknownRows.length) console.log(`\nspecs for rows not in regressions.md: ${P.unknownRows.join(", ")}`);
  if (P.noSpec.length) { console.log(`\nNO SPEC (${P.noSpec.length}): each needs an evidence.json entry before it can be built (Fable 1)`); console.log("  " + P.noSpec.slice(0, 120).join(", ") + (P.noSpec.length > 120 ? ` +${P.noSpec.length - 120}` : "")); }
  if (P.decision.length) console.log(`\nneeds a decision (to docs/status.md, no sheet): ${P.decision.join(", ")}`);
  console.log(`\npages (${P.pages.length}):`);
  more(P.pages, 80, (p) => `  ${p.flow} @ ${p.size}${p.variant ? ` [${p.variant}]` : ""}: ${p.probes.map((q) => `${q.row}${q.every ? " every" : ""} ${q.at}`).join("; ")}`);
  const mins = Math.ceil(P.pages.length * 0.35);
  console.log(`\nabout ${mins} min of browser time at 3 pages at once. Run: node build/tools/review/evidence.mjs --run${a.val("rows") ? ` --rows ${a.val("rows")}` : a.has("sprint") ? " --sprint" : ""}`);
}

// the voice timeline for the .md: all of it up to 120 lines; a longer one is the 120 lines that end 60 lines past the probe's moment
// (">>>>"), so a moment late in a round (the stir, 30 s in) is on the sheet with the lines said just after it (s08 w6d: DAAR-26, DAAR-32)
function voiceWindow(text) {
  const vl = String(text).split("\n");
  if (vl.length <= 120) return vl.join("\n");
  const i = vl.findIndex((l) => l.includes(">>>>"));
  const to = Math.min(vl.length, i < 0 ? 120 : i + 60), from = Math.max(0, to - 120);
  return [...(from ? [`(${from} earlier lines left out)`] : []), ...vl.slice(from, to), ...(to < vl.length ? [`(${vl.length - to} later lines left out)`] : [])].join("\n");
}
// ---------- the run ----------
function underLock() {
  if (process.env.NJG_LOCKED) return true;
  // an ancestor is "flock ... /tmp/njg-browser.lock ...": the caller holds the lock already (nested flock would wait for itself)
  let pid = process.ppid;
  for (let i = 0; i < 12 && pid > 1; i++) {
    try {
      const cmd = readFileSync(`/proc/${pid}/cmdline`, "utf8").split("\0");
      if (/(^|\/)flock$/.test(cmd[0]) && cmd.includes(LOCK)) return true;
      pid = +readFileSync(`/proc/${pid}/stat`, "utf8").split(") ")[1].split(" ")[1];
    } catch (e) { return false; }
  }
  return false;
}
function runFolder(id) {
  if (id) return join(OUT, id);
  const runs = existsSync(OUT) ? readdirSync(OUT).map((n) => join(OUT, n)).filter((p) => existsSync(join(p, "plan.json"))).sort((x, y) => statSync(join(y, "plan.json")).mtimeMs - statSync(join(x, "plan.json")).mtimeMs) : [];
  if (!runs.length) die("No evidence run yet: --run first (or --run-id <id>).");
  return runs[0];
}
const loadPlan = (dir) => { const f = join(dir, "plan.json"); if (!existsSync(f)) die(`No plan in ${rel(dir)}: --run first.`); return JSON.parse(readFileSync(f, "utf8")); };
// the page data a run has (its own sandbox run, then any --from-run), by page key
function pageData(P) {
  const out = new Map();
  for (const sid of [P.sandboxRun, ...(P.fromRuns || [])].filter(Boolean)) {
    const d = join(SANDBOX, sid, "data");
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d)) {
      let r; try { r = JSON.parse(readFileSync(join(d, f), "utf8")); } catch (e) { continue; }
      if (!r.evidence) continue;
      const key = r.evKey || `${r.flow}@@${r.size}`;
      if (!out.has(key)) out.set(key, { ...r, sandboxRun: sid });
    }
  }
  return out;
}
async function run() {
  const id = a.val("resume") || a.val("run-id") || `ev-${stamp()}`;
  const dir = join(OUT, id);
  mkdirSync(dir, { recursive: true });
  const L = log(dir);
  let P = a.val("resume") && existsSync(join(dir, "plan.json")) ? loadPlan(dir) : null;
  if (!P) {
    P = await makePlan();
    P.run = id; P.sandboxRun = `ev-${id.replace(/^ev-/, "")}`; P.fromRuns = a.val("from-run") ? a.val("from-run").split(",") : []; P.builder = a.val("builder") || process.env.NJG_BUILDER || null;
    writeFileSync(join(dir, "plan.json"), JSON.stringify(P, null, 1));
  }
  printPlan(P);
  // the pages a --from-run already played with these probes are not played again
  const have = pageData({ fromRuns: P.fromRuns });
  const todo = P.pages.filter((p) => !have.has(p.key));
  if (todo.length < P.pages.length) L(`${P.pages.length - todo.length} pages come from ${P.fromRuns.join(", ")}; ${todo.length} to play`);
  const planFile = join(dir, "pages.json");
  writeFileSync(planFile, JSON.stringify({ pages: todo }, null, 1));
  if (todo.length) {
    const locked = underLock();
    let code = 75, chunks = 0;
    while (code === 75 && chunks < 40) {
      chunks++;
      const runArgs = [join(ROOT, "build/sandbox/run.mjs"), "--evidence", planFile, "--evidence-only", "--parallel", a.val("parallel", "3"), "--budget-min", a.val("budget-min", "13"), "--no-sheets", "--run-id", P.sandboxRun, "--resume", P.sandboxRun];
      L(`chunk ${chunks}: ${locked ? "under the caller's lock" : "waiting for the browser lock"}`);
      const r = locked ? spawnSync(process.execPath, runArgs, { stdio: "inherit", cwd: ROOT, env: { ...process.env, COOK_TEST_PORT: PORT } })
        : spawnSync("flock", ["-w", "3600", LOCK, "timeout", "1200", process.execPath, ...runArgs], { stdio: "inherit", cwd: ROOT, env: { ...process.env, COOK_TEST_PORT: PORT } });
      code = r.status === null || r.status === 124 ? 75 : r.status;
      if (locked && code === 75) { L(`pages left: run the same command again with --resume ${id} (the caller's lock is held for one chunk only)`); process.exit(75); }
    }
    if (code !== 0 && code !== 1) die(`run.mjs exited ${code}. Fix it, then: node build/tools/review/evidence.mjs --run --resume ${id}`, code || 2);
  }
  await sheets(dir);
}

// ---------- the sheets ----------
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const MODE_DIRS = (flow) => {
  const m = /^(cook|lab:cook|clinic|mode:(\w+)|house|first)/.exec(flow) || [];
  const k = m[1] && m[1].startsWith("lab:cook") ? "cook" : m[2] || m[1] || "";
  const dirs = ["js/shared", "css/shared", "js/core"];
  if (k === "cook") dirs.push("js/cook", "assets/cook");
  else if (k === "clinic") dirs.push("js/clinic", "assets/clinic", "data/clinic");
  else if (k) dirs.push(`js/${k}`);
  return dirs;
};
const treeHash = (dirs) => sha(dirs.map((d) => `${d}:${git("rev-parse", `HEAD:${d}`) || "-"}`).join(",") + (git("status", "--porcelain", "--", ...dirs) ? `|dirty:${Date.now()}` : ""));
let parseCmd = null;
function runCmd(cmd) {
  const pc = parseCmd(cmd);
  if (pc.error) return { code: null, text: `not run: ${pc.error}` };
  const [exe, ...argv] = pc.argv;
  const r = spawnSync(exe, argv, { cwd: ROOT, encoding: "utf8", timeout: 180000, maxBuffer: 1 << 24, env: { ...process.env, COOK_TEST_PORT: String(+PORT + 1), NJG_LOCKED: "1" } }); // its own port: the sheets' server holds ours
  const outText = `${r.stdout || ""}${r.stderr ? `\n[stderr]\n${r.stderr}` : ""}`.trim().split("\n");
  // an import error or missing module is the environment's failure, never the game's: a TOOL FAILURE (code null)
  const MODULE_ERR = /ModuleNotFoundError|ImportError|Cannot find module|ERR_MODULE_NOT_FOUND/;
  const modErr = MODULE_ERR.test(`${r.stdout || ""}\n${r.stderr || ""}`);
  return { code: modErr ? null : r.status, moduleError: modErr, text: (modErr ? "TOOL FAILURE: missing module (environment, not the game)\n" : "") + outText.slice(-120).join("\n") + (outText.length > 120 ? `\n(${outText.length - 120} earlier lines cut)` : "") };
}
async function sheets(dirArg) {
  const dir = dirArg || runFolder(a.val("run-id"));
  if (!underLock() && !process.env.NJG_EVIDENCE_LOCKED) { // the browser renders the sheets: under the lock (B16)
    const r = spawnSync("flock", ["-w", "1800", LOCK, "timeout", "900", process.execPath, process.argv[1], "--sheets", "--run-id", dir.split("/").pop()], { stdio: "inherit", env: { ...process.env, NJG_EVIDENCE_LOCKED: "1", COOK_TEST_PORT: PORT } });
    process.exit(r.status === null ? 124 : r.status);
  }
  const P = loadPlan(dir), id = P.run, L = log(dir);
  parseCmd = (await import("../../sandbox/lib/evidence.mjs")).parseCmd;
  const data = pageData(P);
  // the probes' results, by row
  const byRow = new Map(P.rows.map((r) => [r.id, []]));
  const seenMoments = {};
  for (const r of data.values()) {
    for (const e of r.evidence) if (byRow.has(e.row)) byRow.get(e.row).push({ ...e, sandboxRun: r.sandboxRun, complete: r.complete });
    seenMoments[r.flow] = [...new Set([...(seenMoments[r.flow] || []), ...(r.moments || []).map((m) => m.name)])].slice(0, 400);
  }
  // pages planned but never played (a chunk died, the plan changed): their probes are tool failures
  for (const p of P.pages) if (!data.has(p.key)) for (const q of p.probes) if (byRow.has(q.row)) byRow.get(q.row).push({ row: q.row, i: q.i, id: `${q.row}-p${q.i + 1}-L${q.level}-${p.size}`, level: q.level, size: p.size, flow: p.flow, variant: p.variant, at: q.at, kind: q.kind, reached: false, hits: [], expects: [], tool: [`page ${p.flow} @ ${p.size}${p.variant ? ` [${p.variant}]` : ""} was not played (resume the run)`] });
  // what the runs saw feeds the moment catalogue (lib/moments.mjs)
  const M = await import("../../sandbox/lib/moments.mjs");
  const seenFile = M.SEEN_FILE(ROOT), old = M.seenMoments(ROOT);
  for (const [f, list] of Object.entries(seenMoments)) old[f] = [...new Set([...(old[f] || []), ...list])].slice(0, 600);
  mkdirSync(dirname(seenFile), { recursive: true }); writeFileSync(seenFile, JSON.stringify(old));
  const { startServer, launch } = await import("../../sandbox/lib/env.mjs");
  const { htmlToPng, shotUrl: rawUrl } = await import("../../sandbox/lib/sheets.mjs");
  const shotUrl = (f) => rawUrl(f).replace(/#/g, "%23").replace(/ /g, "%20");
  const server = await startServer(), browser = await launch({ webgl: false });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  const cmdCache = new Map();
  const index = { run: id, created: new Date().toISOString(), commit: git("rev-parse", "--short", "HEAD"), builder: P.builder || null, rows: {} };
  // the script probes (flow "repo", at "now"; and cmd captures on page probes): run once each, from the repo root
  const cmdOut = (c) => { if (!cmdCache.has(c)) { L(`cmd: ${c}`); cmdCache.set(c, runCmd(c)); } return cmdCache.get(c); };
  for (const q of P.repo || []) if (byRow.has(q.row)) {
    const res = { row: q.row, i: q.i, id: `${q.row}-p${q.i + 1}-repo`, level: 1, size: "-", flow: "repo", at: "now", kind: "text", reached: true, hits: [], expects: [], tool: [], note: q.note };
    const outs = q.capture.filter((c) => c.kind === "cmd").map((c) => ({ c, r: cmdOut(c.cmd) }));
    for (const { c, r } of outs) if (r.code == null) res.tool.push(r.moduleError ? `${c.cmd}: TOOL FAILURE, missing module (${r.text.split("\n").slice(-1)[0].slice(0, 160)})` : `${c.cmd}: did not finish (${r.text.slice(0, 120)})`);
    const text = outs.map((o) => o.r.text).join("\n");
    for (const e of q.expect) {
      let r = { ok: null, why: "for the reviewer" };
      if (e.kind === "pass") r = { ok: outs.every((o) => o.r.code === 0), why: outs.map((o) => `${o.c.cmd}: exit ${o.r.code}`).join("; ") };
      else if (e.kind === "textMatches") r = { ok: new RegExp(e.re, e.flags).test(text), why: `the script's output ${new RegExp(e.re, e.flags).test(text) ? "matches" : "does not match"} /${e.re}/` };
      res.expects.push(e.not && r.ok != null ? { raw: e.raw, ok: !r.ok, why: `not (${r.why})` } : { raw: e.raw, ...r });
    }
    byRow.get(q.row).push(res);
  }
  for (const row of P.rows) {
    if ((P.obsolete || {})[row.id]) { index.rows[row.id] = { kind: "obsolete", png: null, md: null, panels: [], tool: [], expect: null, expectLine: P.obsolete[row.id], fp: null, probes: 0, reached: 0 }; continue; }
    if ((P.human || {})[row.id] || P.decision.includes(row.id)) {
      const human = (P.human || {})[row.id];
      index.rows[row.id] = { kind: human ? "human" : "decision", png: null, md: null, panels: [], tool: [], expect: null, expectLine: human || (P.decisionText || {})[row.id] || "", fp: null, probes: 0, reached: 0 };
      continue;
    }
    const probes = (byRow.get(row.id) || []).sort((x, y) => x.i - y.i || x.level - y.level || String(x.size).localeCompare(y.size));
    // cmd captures on page probes, and their "pass"
    for (const p of probes) {
      const caps = (((P.spec[row.id] || [])[p.i] || {}).capture || []).filter((c) => typeof c === "string" && c.startsWith("cmd:"));
      if (!caps.length || p.flow === "repo") continue;
      const outs = caps.map((c) => cmdOut(c.slice(4).trim()));
      outs.forEach((o, k) => { if (o.code == null) (p.tool = p.tool || []).push(`${caps[k].slice(4).trim()}: ${o.moduleError ? "TOOL FAILURE, missing module" : "did not finish"}`); });
      for (const e of p.expects || []) if (/^!?pass$/.test(e.raw)) { const ok = outs.every((o) => o.code === 0) && e.ok !== false && !(e.ok === false); const neg = e.raw.startsWith("!"); const v = e.ok == null || e.cmd ? ok : e.ok; Object.assign(e, { ok: neg ? !v : v, why: `${e.why || ""}${e.why ? "; " : ""}${caps.map((c, k) => `${c.slice(4)}: exit ${outs[k].code}`).join("; ")}` }); }
    }
    const specErr = (P.rowErrors || {})[row.id] || [];
    const outcome = rowOutcome(probes);
    if (specErr.length) outcome.tool.unshift(...specErr.map((e) => `spec: ${e}`));
    const kind = probes.length ? probes[0].kind : "layout";
    // panels: at most four, A-D; a row with more than four probes gets one panel per probe (SH-10, CLN-118: each station or
    // game its own), up to twelve, A-L, over as many sheets as it takes at six or fewer to a sheet; text for the .md
    const panels = [], texts = [], extra = [], cap = probes.length > 4 ? Math.min(12, probes.length) : 4;
    const fileOf = (p, f) => join(p.dir || join(SANDBOX, p.sandboxRun || "", "evidence"), f);
    const dprOf = (p) => (/(^|_)x2(_|$)/.test(p.variant || "") ? 2 : 1);
    const addPanel = (pl) => { if (panels.length < cap) { pl.letter = "ABCDEFGHIJKL"[panels.length]; panels.push(pl); } else extra.push(pl); };
    for (const p of probes) {
      const tag = `${p.flow} L${p.level} ${p.size}${p.variant ? ` [${p.variant}]` : ""}`;
      const crops = [], strips = [];
      for (const h of p.hits || []) for (const c of h.captures || []) {
        if (c.fail) continue;
        if ((c.kind === "crop" || c.kind === "zoom2") && c.files[0]) crops.push({ h, c });
        else if (c.kind === "shot" && c.files[0]) crops.push({ h, c, shot: true });
        else if (c.kind === "strip") strips.push({ h, c });
        if (c.text) texts.push(`#### ${p.id} · ${c.raw} at ${h.name}${h.n > 1 ? ` (${h.n})` : ""}\n\n\`\`\`\n${c.text}\n\`\`\``);
      }
      if (p.every && crops.length > 1) {
        // every turn: the crops side by side, one frame per moment
        const byCap = new Map(); for (const x of crops) { if (!byCap.has(x.c.raw)) byCap.set(x.c.raw, []); byCap.get(x.c.raw).push(x); }
        for (const [raw, list] of byCap) addPanel({ type: "frames", label: `${tag} · ${raw} at every ${p.at} (${list.length})`, frames: list.map((x) => ({ src: fileOf(p, x.c.files[0]), cap: `${x.h.n} · ${(x.h.t / 1000).toFixed(1)} s`, dpr: dprOf(p) })), zoom: raw.startsWith("zoom2"), nat: natW(fileOf(p, list[0].c.files[0]), dprOf(p)) });
      } else for (const x of crops) {
        if (!x.shot && x.c.kind === "crop" && (p.kind === "layout" || p.kind === "art") && x.h.room) addPanel({ type: "room", label: `${tag} · ${p.at}: the screen, ${x.c.raw.slice(5)} outlined`, src: fileOf(p, x.h.room), box: x.c.box, dpr: dprOf(p) });
        addPanel({ type: "img", label: `${tag} · ${x.c.raw} at ${x.h.name}`, src: fileOf(p, x.c.files[0]), dpr: dprOf(p), zoom: x.c.kind === "zoom2" });
      }
      for (const x of strips) addPanel({ type: "frames", label: `${tag} · ${x.c.raw} at ${x.h.name}`, frames: x.c.files.map((f, k) => ({ src: fileOf(p, f), cap: `${x.c.times[k]} ms`, dpr: dprOf(p) })), nat: natW(fileOf(p, x.c.files[0]), dprOf(p)) });
      // refs (Fable 12) and script output (Fable 13), from the spec
      for (const c of p.contract || []) texts.push(`#### ${p.id} · ${c.check} (contract)\n\n\`\`\`\n${c.text}\n\`\`\``);
      const specP = Array.isArray(P.spec[row.id]) ? P.spec[row.id][p.i] : P.spec[row.id] && P.spec[row.id].probes ? P.spec[row.id].probes[p.i] : P.spec[row.id];
      for (const cap of (specP || {}).capture || []) {
        if (typeof cap !== "string") continue;
        if (cap.startsWith("ref:") && !panels.some((x) => x.ref === cap)) { const f = join(ROOT, cap.slice(4).trim()); if (existsSync(f) && /\.(png|webp|jpe?g|svg)$/i.test(f)) addPanel({ type: "img", ref: cap, label: `reference: ${cap.slice(4)}`, src: f, dpr: 1 }); else texts.push(`#### reference ${cap.slice(4)}\n\n${existsSync(f) ? "(not an image: open it)" : "MISSING FILE"}`); }
        if (cap.startsWith("cmd:") && !texts.some((t) => t.startsWith(`#### ${cap.slice(4).trim()} (exit`))) { const c = cap.slice(4).trim(), r = cmdOut(c); texts.push(`#### ${c} (exit ${r.code})\n\n\`\`\`\n${r.text}\n\`\`\``); }
      }
      if (p.voice && p.voice.text) texts.push(`#### ${p.id} · voice (seconds from the page's start; ---- a lifecycle step; >>>> the probe's moment)\n\n\`\`\`\n${voiceWindow(p.voice.text)}\n\`\`\``);
    }
    // the fingerprint: row words + spec + text captures + the mode's code and art + each panel's dHash
    const textPart = probes.map((p) => [p.id, p.reached, (p.expects || []).map((e) => [e.raw, e.ok]), (p.hits || []).map((h) => (h.captures || []).map((c) => (c.kind === "dom" || c.kind === "text" ? c.text : c.kind === "voice" ? "" : c.raw)))]);
    const voiceWords = probes.map((p) => (p.voice && p.voice.text ? p.voice.text.split("\n").map((l) => l.replace(/^[\s\d.-]+/, "")).join("\n") : ""));
    const panelHashes = [];
    for (const pl of panels) { try { panelHashes.push(dhash(readFileSync(pl.type === "frames" ? pl.frames[0].src : pl.src))); } catch (e) { panelHashes.push("0000000000000000"); } }
    const fp = fingerprint({ words: [row.issue, row.check], spec: P.spec[row.id] || null, text: [textPart, voiceWords], tree: treeHash([...new Set(probes.flatMap((p) => MODE_DIRS(p.flow)))]), panels: panelHashes });
    // the PNG (not for text-only rows or tool failures)
    let png = null;
    const sheets = [];
    if (!outcome.tool.length && panels.length) {
      // more than six panels: two or more sheets, evenly (<ROW>.png, <ROW>-2.png ...), each still at most about 1200 x 1900 px
      // (s08 w6L) by height, not only by count: a sheet holds panels up to about 1300 px (a strip's frames now read at 290-580 px, so a
      // twelve-frame strip is a sheet of its own; four panels of one image each are still one sheet)
      const groups = [];
      let cur = [], cost = 0;
      for (const pl of panels) {
        const c = panelCost(pl);
        if (cur.length && (cost + c > 4.5 || cur.length >= 6)) { groups.push(cur); cur = []; cost = 0; }
        cur.push(pl); cost += c;
      }
      if (cur.length) groups.push(cur);
      const n = groups.length;
      for (let k = 0; k < n; k++) {
        const name = k ? `${row.id}-${k + 1}` : row.id;
        sheets.push(await htmlToPng(page, join(dir, `${name}.html`), sheetHtml(row, groups[k], shotUrl, n > 1 ? `sheet ${k + 1} of ${n}` : "")));
      }
      png = sheets[0];
    }
    // the .md
    let md = `# ${row.id} (${row.kind}) · ${row.section}\n\n**Issue:** ${row.issue}\n\n**Check:** ${row.check}\n\n**Source:** ${row.source}\n\n**Status now:** ${row.status}\n\n`;
    if (outcome.tool.length) md += `## TOOL FAILURE (not evidence: the tool owner fixes the driver or the spec)\n\n${outcome.tool.map((t) => `- ${t}`).join("\n")}\n\n`;
    if (outcome.expect) md += `## Machine verdict: ${outcome.expect}\n\n${outcome.line}\n\n`;
    md += `## Probes\n\n${probes.map((p) => `- ${p.id}: ${p.flow} L${p.level} @ ${p.size}${p.variant ? ` [${p.variant}]` : ""}, at ${p.every ? "every " : ""}${p.at}${p.after ? ` after ${p.after}` : ""}: ${p.reached ? `reached ${p.hits.length}x (${p.hits.map((h) => `${h.name} ${(h.t / 1000).toFixed(1)}s`).slice(0, 6).join(", ")})` : "NOT reached"}${p.note ? ` · ${p.note}` : ""}${(p.expects || []).map((e) => `\n  - expect ${e.raw}: ${e.ok === true ? "PASS" : e.ok === false ? "FAIL" : "undecided"} (${e.why})`).join("")}${(p.notes || []).slice(0, 8).map((n) => `\n  - note (an every: moment where it was not on screen): ${n}`).join("")}`).join("\n")}\n\n`;
    if (panels.length) md += `## Panels${png ? ` (${sheets.map((s) => `\`${rel(s)}\``).join(", ")})` : ""}\n\n${panels.map((p) => `- **${p.letter}**: ${p.label}`).join("\n")}${extra.length ? `\n- (${extra.length} more not on the sheet: ${extra.map((p) => p.label).join("; ")})` : ""}\n\n`;
    if (texts.length) md += `## Text captures\n\n${texts.join("\n\n")}\n`;
    writeFileSync(join(dir, `${row.id}.md`), md);
    index.rows[row.id] = { kind: TEXT_KINDS.has(kind) ? kind : kind, png: png ? rel(png) : null, sheets: sheets.map(rel), md: rel(join(dir, `${row.id}.md`)), panels: panels.map((p) => `${p.letter}: ${p.label}`), tool: outcome.tool, expect: outcome.expect, expectLine: outcome.line, fp, probes: probes.length, reached: probes.filter((p) => p.reached).length };
    console.log(`${row.id}: ${outcome.tool.length ? `TOOL FAILURE (${outcome.tool.length})` : outcome.expect ? `machine ${outcome.expect}` : `${panels.length} panels${texts.length ? `, ${texts.length} text` : ""}`}${png ? ` -> ${rel(png)}` : ""}`);
  }
  await page.close(); await browser.close(); server.close();
  writeFileSync(join(dir, "index.json"), JSON.stringify(index, null, 1));
  writeReport(dir, P, index);
}
// a PNG's width in CSS px (its IHDR), 0 when it cannot be read: how many frames of a strip fit a line of the sheet
function natW(file, dpr = 1) {
  try { const b = readFileSync(file); return b.length > 24 && b.readUInt32BE(12) === 0x49484452 ? Math.round(b.readUInt32BE(16) / (dpr || 1)) : 0; } catch (e) { return 0; }
}
// frames to a line (s08 w6L): a crop 700 px wide or more two to a line, one of 420-700 px three, a small one four, so every frame is read at
// about 290-580 px, not the 90-140 px a twelve-frame strip had in one line (the EVIDENCE lines of CLN-105, 167, 181, 194, SAM-22)
const framesPerLine = (p) => Math.max(1, Math.min(p.frames.length, p.nat >= 700 ? 2 : p.nat >= 420 ? 3 : 4));
// a panel's height on the sheet in units of about 300 px (a frames panel: its lines of frames; a lone image: two to a line)
const panelCost = (p) => (p.type === "frames" ? 0.25 + Math.ceil(p.frames.length / framesPerLine(p)) * (framesPerLine(p) <= 2 ? 1.2 : framesPerLine(p) === 3 ? 0.8 : 0.65) : 0.8);
function sheetHtml(row, panels, shotUrl, part = "") {
  // at most 1200 x ~1200 px (about 1.9k image tokens at full resolution, under the API's downscale): panels side by side, two to a
  // row; a filmstrip or a lone zoom spans the row. Crops at 1:1 CSS px when they fit their column, else scaled down to fit
  const wide = (p) => p.type === "frames" || (p.zoom && panels.length === 1) || panels.length === 1;
  const fig = (p) => {
    // (s08 w6L) at most 4 frames to a line: a 12-frame strip in one line was 90 px a frame, too small to read (the EVIDENCE lines of
    // CLN-167, CLN-181, CLN-194, SAM-22); wrapped, each frame is about 290 px
    if (p.type === "frames") return `<div class="frames" style="--c:${framesPerLine(p)};--mh:${framesPerLine(p) <= 2 ? 440 : 300}px">${p.frames.map((f) => `<figure class="fr"><img src="${esc(shotUrl(f.src))}" data-dpr="${f.dpr}" class="${p.zoom ? "z" : "n"}"><figcaption>${esc(f.cap)}</figcaption></figure>`).join("")}</div>`;
    if (p.type === "room") return `<div class="room" data-box="${esc(JSON.stringify(p.box))}" data-dpr="${p.dpr}"><img src="${esc(shotUrl(p.src))}"><i class="box"></i></div>`;
    return `<img class="${p.zoom ? "z" : "n"} one" data-dpr="${p.dpr}" src="${esc(shotUrl(p.src))}">`;
  };
  return `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:12px 16px;background:#f3ece0;font:15px/1.3 Nunito,system-ui,sans-serif;color:#2a1f14;width:1168px}
    header{background:#fff;border:2px solid #2a1f14;border-radius:8px;padding:6px 12px;margin-bottom:8px}
    h1{font-size:22px;margin:0 0 2px} h1 small{font-size:14px;font-weight:600;color:#6b5a45;margin-left:8px}
    header p{margin:1px 0;font-size:14px} .k{font-weight:800}
    .grid{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start}
    section{background:#fff;border:2px solid #cdbfa8;border-radius:8px;padding:4px 6px;box-sizing:border-box;width:580px}
    section.wide{width:1168px}
    .lab{font-size:22px;font-weight:900;margin-right:6px} .cap{font-size:13px;font-weight:700;color:#4a3a28}
    section img{display:block;margin-top:3px;max-width:100%} img.one{max-height:520px;object-fit:contain}
    .frames{display:grid;grid-template-columns:repeat(var(--c,4),minmax(0,1fr));gap:6px 4px;margin-top:3px} .fr{margin:0;min-width:0} .fr img{width:100%;max-height:var(--mh,300px);object-fit:contain} .fr figcaption{font-size:13px;font-weight:800;text-align:center}
    .room{position:relative;margin-top:3px} .room img{width:100%} .room .box{position:absolute;border:3px solid #e0201a;box-shadow:0 0 0 2px #fff}
  </style><header><h1>${esc(row.id)}<small>${esc(row.section)}${part ? ` · ${esc(part)}` : ""}</small></h1><p><span class="k">Issue:</span> ${esc(row.issue.slice(0, 380))}</p><p><span class="k">Check:</span> ${esc(row.check.slice(0, 220))}</p></header>
  <div class="grid">${panels.map((p) => `<section class="${wide(p) ? "wide" : ""}"><span class="lab">${p.letter}</span><span class="cap">${esc(p.label)}</span>${fig(p)}</section>`).join("\n")}</div>
  <script>
    // 1:1 CSS px where it fits: a DPR-2 crop shows at half its pixels, unless it is the zoom (then at its real pixels, 2x)
    for (const im of document.querySelectorAll("img.one")) { const go = () => { const d = +im.dataset.dpr || 1; im.style.width = (im.classList.contains("z") ? im.naturalWidth : im.naturalWidth / d) + "px"; }; im.complete ? go() : im.addEventListener("load", go); }
    for (const r of document.querySelectorAll(".room")) { const im = r.querySelector("img"), b = JSON.parse(r.dataset.box || "null"), d = +r.dataset.dpr || 1; const go = () => { if (!b) return; const k = im.clientWidth / (im.naturalWidth / d); Object.assign(r.querySelector(".box").style, { left: b.x * k + "px", top: b.y * k + "px", width: b.width * k + "px", height: b.height * k + "px" }); }; im.complete ? go() : im.addEventListener("load", go); }
  </script>`;
}
function writeReport(dir, P, index) {
  const id = P.run, rows = Object.entries(index.rows);
  const human = rows.filter(([, r]) => r.kind === "human"), dec = rows.filter(([, r]) => r.kind === "decision"), obs = rows.filter(([, r]) => r.kind === "obsolete");
  const judged = rows.filter(([, r]) => !["human", "decision", "obsolete"].includes(r.kind));
  const tool = judged.filter(([, r]) => r.tool.length), mach = judged.filter(([, r]) => !r.tool.length && r.expect), eye = judged.filter(([, r]) => !r.tool.length && !r.expect);
  let md = `# Evidence run ${id}\n\nCommit ${index.commit}. ${P.rows.length} rows: ${eye.length} for a reviewer, ${mach.length} decided by the machine, ${tool.length} TOOL FAILURES (never evidence; fix the driver or the spec), ${P.noSpec.length} with no spec. ${P.pages.length} pages. Sheets and text: \`${rel(dir)}/<ROW>.png|.md\`.\n\nNext: \`node build/tools/review/evidence.mjs --judge --run-id ${id}\`, the reviewer fills the batch files, then \`--collect\` and \`--apply\`.\n\n`;
  md += `| row | kind | probes reached | machine | sheet | panels |\n|---|---|---|---|---|---|\n`;
  for (const [rid, r] of judged) md += `| ${rid} | ${r.kind} | ${r.reached}/${r.probes} | ${r.tool.length ? "TOOL FAILURE" : r.expect ? `${r.expect}: ${r.expectLine.replace(/\|/g, "/").slice(0, 120)}` : ""} | ${r.png ? `\`${r.png}\`` : "(text only)"} | ${r.panels.length} |\n`;
  md += `\n## Tool failures (${tool.length}): for the tool owner, never a FAIL in regressions.md\n\n${tool.map(([rid, r]) => `- ${rid}: ${r.tool.slice(0, 3).join(" · ").replace(/\n/g, " ").slice(0, 600)}`).join("\n") || "none"}\n`;
  if (P.noSpec.length) md += `\n## No spec (${P.noSpec.length})\n\n${P.noSpec.join(", ")}\n`;
  if (human.length) md += `\n## Zafar's ear or feel (${human.length}): only he can judge these\n\n${human.map(([rid, r]) => `- ${rid}: ${r.expectLine}`).join("\n")}\n`;
  if (obs.length) md += `\n## Obsolete probes (${obs.length}): the row asks about a state the game no longer has (its owner rewrites the check or retires the row)\n\n${obs.map(([rid, r]) => `- ${rid}: ${r.expectLine}`).join("\n")}\n`;
  if (dec.length) md += `\n## Needs a decision (${dec.length}): docs/status.md, never a sheet\n\n${dec.map(([rid, r]) => `- ${rid}: ${r.expectLine}`).join("\n")}\n`;
  const evFile = join(dir, "evidence-lines.md");
  if (existsSync(evFile)) md += `\n## EVIDENCE lines from the reviewers (the tool owner's list)\n\n${readFileSync(evFile, "utf8")}\n`;
  const f = join(ROOT, "build", "reports", `evidence-${id}.md`);
  writeFileSync(f, md);
  console.log(`\n${rows.length} rows: ${eye.length} for a reviewer, ${mach.length} machine-decided, ${tool.length} tool failures, ${human.length} Zafar's, ${dec.length} need a decision. Index: ${rel(f)}`);
}

// ---------- the cache ----------
const loadCache = () => { try { return JSON.parse(readFileSync(CACHE, "utf8")); } catch (e) { return {}; } };
const saveCache = (c) => { mkdirSync(dirname(CACHE), { recursive: true }); writeFileSync(CACHE, JSON.stringify(Object.fromEntries(Object.entries(c).sort()), null, 1) + "\n"); };
// the verdict log (red then green, checks-to-build 1): append-only, one line per verdict and per built mark
const VLOG = join(ROOT, "build", "tools", "review", "data", "verdict-log.jsonl");
const loadLog = () => { try { return readFileSync(VLOG, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)); } catch (e) { return []; } };
const appendLog = (entries) => { if (entries.length) { mkdirSync(dirname(VLOG), { recursive: true }); appendFileSync(VLOG, entries.map((e) => JSON.stringify(e)).join("\n") + "\n"); } };
const logged = (log, id, run, verdict) => log.some((e) => e.id === id && e.run === run && e.verdict === verdict);

// ---------- --judge ----------
function judge() {
  const dir = runFolder(a.val("run-id")), P = loadPlan(dir), id = P.run;
  const f = join(dir, "index.json"); if (!existsSync(f)) die(`No sheets yet: node build/tools/review/evidence.mjs --sheets --run-id ${id}`);
  const index = JSON.parse(readFileSync(f, "utf8"));
  const cache = loadCache(), today = new Date().toISOString().slice(0, 10);
  const todo = [], cached = [], machine = [], tool = [], vlog = loadLog(), newLog = [];
  for (const [rid, r] of Object.entries(index.rows)) {
    if (["human", "decision", "obsolete"].includes(r.kind)) continue;
    if (r.tool.length) { tool.push(rid); continue; }
    if (r.expect) { cache[rid] = { ...r.fp, verdict: r.expect, line: r.expectLine, panel: null, judge: "expect", run: id, commit: index.commit, date: today }; machine.push(rid); if (!logged(vlog, rid, id, r.expect)) newLog.push({ id: rid, run: id, verdict: r.expect, spec: specHash(P.spec[rid]), judge: "expect", date: today }); continue; }
    if (cacheHit(cache[rid], r.fp)) { cached.push(rid); continue; }
    const row = P.rows.find((x) => x.id === rid);
    todo.push({ id: rid, kind: r.kind, row, r });
  }
  saveCache(cache); appendLog(newLog);
  // --audit N: N% of the cached PASSes (not the machine's) judged again by a different model (Fable 16)
  const auditPct = +(a.val("audit") || 0);
  const pool = cached.filter((rid) => cache[rid].verdict === "PASS" && cache[rid].judge !== "expect");
  const audit = auditPct ? pool.sort(() => Math.random() - 0.5).slice(0, Math.ceil((pool.length * auditPct) / 100)) : [];
  const jdir = join(dir, "judge"); mkdirSync(jdir, { recursive: true });
  const B = batches(todo, { visual: Math.min(10, +(a.val("batch") || 10)), text: 30 });
  const AB = batches(audit.map((rid) => ({ id: rid, kind: index.rows[rid].kind, row: P.rows.find((x) => x.id === rid), r: index.rows[rid], audit: cache[rid] })), { visual: 10, text: 30 });
  const files = [];
  const write = (b, n, isAudit) => {
    const name = `${isAudit ? "audit" : "batch"}-${String(n).padStart(2, "0")}`;
    const vf = join(jdir, `${name}.verdicts.md`);
    let t = `# Evidence ${name} (${b.kind}, ${b.rows.length} rows) · run ${id}\n\nYou are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes${index.builder ? ` (${index.builder})` : ""}.${isAudit ? " This is an AUDIT: each row already has a cached PASS from another model (named below); judge it afresh, without regard to that verdict." : ""}\n\nFor each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.\n1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.\n2. Then one line in ${rel(vf)}:\n   \`ID | PASS: <panel>, <what that panel shows that proves it>\` e.g. \`CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns\`\n   \`ID | FAIL: <panel>, <what is wrong>\`\n   \`ID | EVIDENCE: <what the sheet is missing>\` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).\n   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: \`SH-45 | PASS: SH-45-p1-L1-1366x768 dom, the line reads ...\` (or \`PASS: text, ...\`); a script capture by the command printed after its \`####\` heading: \`LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list\`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).\n3. First line of the verdict file: \`judge: <your model and session>\`.\n\n`;
    for (const x of b.rows) t += `## ${x.id} [${x.row.kind}] ${x.row.section}${x.audit ? ` (cached PASS by ${x.audit.judge}: ${x.audit.line})` : ""}\n- Issue: ${x.row.issue}\n- Check: ${x.row.check}\n- Sheet: ${x.r.png ? ((x.r.sheets || []).length > 1 ? x.r.sheets : [x.r.png]).map((s) => join(ROOT, s)).join(" and ") : "(text only)"}\n- Text: ${join(ROOT, x.r.md)}\n${x.r.panels.map((p) => `- Panel ${p}`).join("\n")}\n\n`;
    writeFileSync(join(jdir, `${name}.md`), t);
    if (!existsSync(vf)) writeFileSync(vf, `judge: \n${b.rows.map((x) => `${x.id} | `).join("\n")}\n`);
    files.push(rel(join(jdir, `${name}.md`)));
  };
  B.forEach((b, i) => write(b, i + 1, false));
  AB.forEach((b, i) => write(b, i + 1, true));
  console.log(`judge ${id}: ${todo.length} rows for a reviewer in ${B.length} batches${audit.length ? `, ${audit.length} audit rows in ${AB.length}` : ""}; ${cached.length} kept their cached verdict; ${machine.length} decided by expect (cached); ${tool.length} tool failures (not judged: ${rel(join(ROOT, "build", "reports", `evidence-${id}.md`))})`);
  for (const f of files) console.log(`  ${f}`);
  if (files.length) console.log(`\nOne reviewer call per batch file (Fable; Opus when Fable is at its limit; never the builder). Then: node build/tools/review/evidence.mjs --collect --run-id ${id}`);
}

// ---------- --collect ----------
function collect() {
  const dir = runFolder(a.val("run-id")), P = loadPlan(dir), id = P.run;
  const index = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
  const builder = a.val("builder") || index.builder || process.env.NJG_BUILDER || null;
  const jdir = join(dir, "judge");
  const cache = loadCache(), today = new Date().toISOString().slice(0, 10);
  let n = 0; const evidence = [], refused = [], disagree = [], vlog = loadLog(), newLog = [];
  for (const f of existsSync(jdir) ? readdirSync(jdir).filter((x) => /\.verdicts\.md$/.test(x)).sort() : []) {
    // a text-only row's PASS may name the capture it read by its label in the row's .md (a script's command, a probe id)
    const labelsOf = (rid) => { const r = index.rows[rid]; try { return r && r.md ? captureLabels(readFileSync(join(ROOT, r.md), "utf8")) : []; } catch (e) { return []; } };
    const v = parseVerdicts(readFileSync(join(jdir, f), "utf8"), labelsOf);
    if (!v.lines.length) continue;
    if (!v.judge) { refused.push(`${f}: no "judge:" line`); continue; }
    if (builder && v.judge.toLowerCase().includes(String(builder).toLowerCase())) { refused.push(`${f}: judged by the builder (${v.judge})`); continue; }
    for (const r of v.rejected) refused.push(`${f}: ${r.id}: ${r.why}`);
    for (const l of v.lines) {
      const r = index.rows[l.id];
      if (!r) { refused.push(`${f}: ${l.id} is not in run ${id}`); continue; }
      const why = passRefusal(l, !!r.png);
      if (why) { refused.push(`${f}: ${l.id}: ${why}`); continue; }
      if (l.verdict === "EVIDENCE") { evidence.push(`- ${l.id}: ${l.line} (${v.judge})`); continue; }
      if (f.startsWith("audit-") && cache[l.id] && cache[l.id].verdict !== l.verdict) { disagree.push(`- ${l.id}: ${cache[l.id].judge} said ${cache[l.id].verdict} (${cache[l.id].line}); ${v.judge} says ${l.verdict}: ${l.line}`); cache[l.id] = { ...cache[l.id], audit: { verdict: l.verdict, line: l.line, judge: v.judge, date: today } }; continue; }
      cache[l.id] = { ...r.fp, verdict: l.verdict, line: l.line, panel: l.panel, judge: v.judge, run: id, commit: index.commit, png: r.png, date: today };
      if (!logged(vlog, l.id, id, l.verdict)) newLog.push({ id: l.id, run: id, verdict: l.verdict, spec: specHash(P.spec[l.id]), judge: v.judge, date: today });
      n++;
    }
  }
  saveCache(cache); appendLog(newLog);
  if (evidence.length) writeFileSync(join(dir, "evidence-lines.md"), evidence.join("\n") + "\n");
  if (disagree.length) writeFileSync(join(dir, "audit-disagreements.md"), `# Audit disagreements (for Zafar's list)\n\n${disagree.join("\n")}\n`);
  writeReport(dir, P, index);
  console.log(`collect ${id}: ${n} verdicts cached in ${rel(CACHE)}; ${evidence.length} EVIDENCE lines (tool owner); ${disagree.length} audit disagreements${disagree.length ? ` (${rel(join(dir, "audit-disagreements.md"))}: Zafar's list)` : ""}; ${refused.length} refused`);
  for (const r of refused.slice(0, 30)) console.log(`  refused ${r}`);
  console.log(`next: node build/tools/review/evidence.mjs --apply --run-id ${id}`);
}

// ---------- --apply ----------
function apply() {
  const dir = runFolder(a.val("run-id")), P = loadPlan(dir), id = P.run;
  const index = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
  const cache = loadCache();
  const refuse = applyGuard(index, cache);
  if (refuse) die(`--apply refused for ${id}: ${refuse}`, 2);
  const v = new Map();
  for (const [rid, r] of Object.entries(index.rows)) {
    const c = cache[rid];
    if (!c || !r.fp || r.tool.length || !cacheHit(c, r.fp)) continue; // only a verdict on this very evidence
    if (c.verdict === "PASS" && c.judge !== "expect" && !c.panel) continue; // a PASS that cites nothing is not applied (Fable 17)
    v.set(rid, { verdict: c.verdict, line: `${c.judge === "expect" ? "" : `${c.judge}: `}${c.line}`, png: r.png });
  }
  // red then green (checks-to-build 1, rule C22): a PASS marks a row built only after a FAIL on the same probe from an earlier run;
  // two FAILs since the row was last built make it Zafar's (open, two strikes)
  const liveMd = readFileSync(REGRESSIONS, "utf8"), doneMd = existsSync(REGRESSIONS_DONE) ? readFileSync(REGRESSIONS_DONE, "utf8") : "";
  const kinds = Object.fromEntries([...parseRegressions(doneMd), ...parseRegressions(liveMd)].map((r) => [r.id, statusKind(r.status)]));
  const vlog = loadLog();
  const HIST = join(ROOT, "build/tools/review/data/status-history.jsonl");
  const hist = existsSync(HIST) ? readFileSync(HIST, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean) : [];
  const legacy = legacyReds([liveMd, doneMd], hist, vlog);
  const specs = Object.fromEntries([...v.keys()].map((rid) => [rid, specHash(P.spec[rid])]));
  const rg = redGreen(v, { kinds, specs, log: vlog, run: id, legacy });
  for (const r of rg.refused) console.log(`  ${r.id}: refused, ${r.why}`);
  if (rg.strikes.length) console.log(`  two strikes (open, Zafar's list in docs/status.md): ${rg.strikes.join(", ")}`);
  v.clear(); for (const [k, x] of rg.verdicts) v.set(k, x);
  // both files (decision 99): the live fix list and the done archive; a FAIL on an archived row moves it back to the live list,
  // a PASS on a live row moves it to the archive; the replaced statuses go to the history file
  const live = applyVerdicts(readFileSync(REGRESSIONS, "utf8"), v, id);
  const done = applyVerdicts(existsSync(REGRESSIONS_DONE) ? readFileSync(REGRESSIONS_DONE, "utf8") : "", v, id);
  const changed = [...live.changed, ...done.changed], skipped = [...live.skipped, ...done.skipped].filter((s) => s.why !== "already applied" || !changed.some((c) => c.id === s.id));
  for (const c of changed) console.log(`  ${c.id}: ${c.from} -> ${c.to}`);
  const reopen = done.changed.filter((c) => /reopened/.test(c.to)).map((c) => c.id);
  const close = live.changed.filter((c) => /^(built|fixed)/.test(c.to)).map((c) => c.id);
  let liveText = live.text, doneText = done.text;
  if (reopen.length) { const m = moveRows(liveText, doneText, reopen); liveText = m.live; doneText = m.done; }
  if (close.length) { const m = moveRows(doneText, liveText, close); doneText = m.live; liveText = m.done; }
  console.log(`apply ${id}: ${changed.length} rows changed (${reopen.length} back to the fix list, ${close.length} to the archive), ${skipped.length} left (${[...new Set(skipped.map((s) => s.why))].join(", ") || "none"})${a.has("dry") ? " [dry run: nothing written]" : ""}`);
  if (!a.has("dry") && changed.length) {
    writeFileSync(REGRESSIONS, liveText); writeFileSync(REGRESSIONS_DONE, doneText);
    const hist2 = [...live.history, ...done.history];
    if (hist2.length) appendFileSync(join(ROOT, "build/tools/review/data/status-history.jsonl"), hist2.map((h) => JSON.stringify(h)).join("\n") + "\n");
    const today = new Date().toISOString().slice(0, 10);
    appendLog(changed.filter((c) => /^(built|fixed)/.test(c.to)).map((c) => ({ id: c.id, run: id, event: "built", date: today })));
  }
}

// ---------- main ----------
if (a.has("lint-specs")) {
  const { lintSpecs, LEGACY_FLOWS } = await import("./lib/lintspecs.mjs");
  const { lexiconWords } = await import("../../sandbox/lib/evidence.mjs");
  const { execFileSync: ex } = await import("node:child_process");
  const { readdirSync, statSync } = await import("node:fs");
  let flows = new Set();
  for (let i = 0; i < 3 && flows.size < 100; i++) { try { flows = new Set(ex(process.execPath, ["build/sandbox/run.mjs", "--list"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 }).split("\n").map((l) => l.split(/\s+/)[0]).filter(Boolean)); } catch (e) { /* a list that fails or comes back short is asked again: a flaky list must not flag every flow */ } }
  if (flows.size < 100) { console.log("lint-specs: run.mjs --list gave too few flows; not judged"); process.exit(2); }
  let corpus = "";
  const walk = (d) => { for (const f of readdirSync(join(ROOT, d))) { const p = `${d}/${f}`; if (statSync(join(ROOT, p)).isDirectory()) walk(p); else if (/\.(js|css|html)$/.test(f)) corpus += readFileSync(join(ROOT, p), "utf8") + "\n"; } };
  ["js", "css"].forEach(walk); for (const f of readdirSync(ROOT)) if (f.endsWith(".html")) corpus += readFileSync(join(ROOT, f), "utf8");
  // the words the family says (data/family-audio.json): an order: marker must be one of these, a selector or a /regex/
  const kutchiWords = () => { const set = new Set(); for (const e of JSON.parse(readFileSync(join(ROOT, "data/family-audio.json"), "utf8"))) for (const w of String(e.kutchi || "").toLowerCase().match(/[\p{L}][\p{L}\p{M}'’]*/gu) || []) set.add(w); return set; };
  const rowText = {}; for (const r of parseRegressions(readAllRegressions())) rowText[r.id] = `${r.issue} ${r.check}`;
  const found = lintSpecs(JSON.parse(readFileSync(join(ROOT, "build/sandbox/data/evidence.json"), "utf8")), { flows, legacy: new Set(LEGACY_FLOWS), corpus, exists: (p) => existsSync(join(ROOT, p)), lexicon: kutchiWords(), rowText });
  const by = {}; for (const f of found) (by[f.kind] = by[f.kind] || []).push(f);
  for (const [k, v] of Object.entries(by)) { console.log(`${k}: ${v.length}`); for (const f of v.slice(0, a.has("all-errors") ? 999 : 12)) console.log(`  ${f.row} p${f.probe}: ${f.msg}`); }
  // a baseline of the known flags (data/lint-specs-known.json: row:probe:kind), like the layout lint's: only a NEW flag fails
  const KNOWN = join(ROOT, "build/tools/review/data/lint-specs-known.json");
  const key = (f) => `${f.row}:p${f.probe}:${f.kind}`;
  if (a.has("write-baseline")) { writeFileSync(KNOWN, JSON.stringify([...new Set(found.map(key))].sort(), null, 1) + "\n"); console.log(`lint-specs: baseline written (${found.length} known)`); process.exit(0); }
  const known = new Set(existsSync(KNOWN) ? JSON.parse(readFileSync(KNOWN, "utf8")) : []);
  const fresh = found.filter((f) => !known.has(key(f)));
  console.log(`lint-specs: ${found.length} flagged, ${found.length - fresh.length} known, ${fresh.length} new${fresh.length ? ":\n" + fresh.map((f) => `  NEW ${f.row} p${f.probe} ${f.kind}: ${f.msg}`).join("\n") : ""}`);
  process.exit(fresh.length ? 1 : 0);
}
if (a.has("run")) await run();
else if (a.has("sheets")) await sheets();
else if (a.has("judge")) judge();
else if (a.has("collect")) collect();
else if (a.has("apply")) apply();
else {
  const P = await makePlan();
  if (a.has("json")) console.log(JSON.stringify(P, null, 1));
  else printPlan(P);
  process.exit(P.errors.length || P.noSpec.length ? 1 : 0);
}
