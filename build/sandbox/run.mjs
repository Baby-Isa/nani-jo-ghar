#!/usr/bin/env node
// The sandbox: plays the live flows through their real pages and lab URLs, records each visually distinct state
// (a screenshot and a screen lint at the current size), and ratchets the findings against build/lint/baseline.json.
// See build/sandbox/README.md. One browser at a time:
//   flock -w 1800 /tmp/njg-browser.lock timeout 14400 node build/sandbox/run.mjs --all
import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT, SIZES, ALL_SIZES, QUICK_SIZE, PORT, startServer, launch, newPage } from "./lib/env.mjs";
import { Recorder } from "./lib/recorder.mjs";
import { makeSheets } from "./lib/sheets.mjs";
import * as Baseline from "./lib/baseline.mjs";
import { allFlows, parkedFlows } from "./flows/index.mjs";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

if (has("--help") || has("-h") || !argv.length) {
  console.log(`node build/sandbox/run.mjs [--all | --flow a,b,c] [--quick] [--sizes 844x390,...] [--check] [--update-baseline [--accept]] [--list] [--no-sheets] [--run-id id] [--resume id]
  --all                 every live flow, all five sizes
  --flow ids            named flows (exact id, a prefix such as "cook:" or "clinic:", or a group: house, first, cook, clinic, cook-parts)
  --quick               laptop size (${QUICK_SIZE}) only, named flows only: for iterating
  --sizes list          sizes to run (default all five: ${ALL_SIZES.join(", ")})
  --check               compare the findings with build/lint/baseline.json; exit 1 on a NEW finding, a flow that no longer reaches its end, or a new page error
  --update-baseline     rewrite the baseline with the fixed findings dropped (it only shrinks); add --accept to adopt new findings too (or to create it)
  --webgl               Phaser's WebGL renderer for Cook (software GL: about 4x slower; the default is canvas, which draws no tints)
  --from-run id         judge a finished run's saved data (no browser): with --check / --update-baseline
  --list                list the flows and exit
  --no-sheets           skip the contact sheets
  --run-id id           folder name under build/screenshots/sandbox/ (default: a timestamp)`);
  process.exit(0);
}

const live = allFlows();
const parked = parkedFlows();
if (has("--list")) {
  for (const f of live) console.log(`${f.id.padEnd(26)} ${f.title}`);
  console.log("parked (only when named):");
  for (const f of parked) console.log(`${f.id.padEnd(26)} ${f.title}`);
  process.exit(0);
}

function pick() {
  const named = (val("--flow") || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (has("--all")) return live;
  if (!named.length) { console.error("Name the flows (--flow cook:chai-tray,clinic:waiting) or use --all. --list shows them."); process.exit(2); }
  const out = [];
  for (const n of named) {
    const pool = [...live, ...parked];
    const m = pool.filter((f) => f.id === n || f.group === n || (n.endsWith(":") && f.id.startsWith(n)) || (n.endsWith("*") && f.id.startsWith(n.slice(0, -1))));
    if (!m.length) { console.error(`No flow "${n}". --list shows them.`); process.exit(2); }
    for (const f of m) if (!out.includes(f)) out.push(f);
  }
  return out;
}
const flows = pick();
if (has("--quick") && has("--all")) { console.error("--quick is for named flows only."); process.exit(2); }
const sizes = has("--quick") ? [QUICK_SIZE] : (val("--sizes") ? val("--sizes").split(",") : ALL_SIZES);
for (const s of sizes) if (!SIZES[s]) { console.error(`Unknown size ${s}. Known: ${ALL_SIZES.join(", ")}`); process.exit(2); }

const runId = val("--run-id") || val("--resume") || val("--from-run") || new Date().toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
const runDir = join(ROOT, "build", "screenshots", "sandbox", runId);
const dataDir = join(runDir, "data");
mkdirSync(dataDir, { recursive: true });
const dataFile = (flow, size) => join(dataDir, `${flow.replace(/[^a-z0-9@]+/gi, "_")}__${size}.json`);

const log = (...a) => console.log(new Date().toTimeString().slice(0, 8), ...a);
const t0 = Date.now();
const fromRun = val("--from-run");
const server = fromRun ? null : await startServer();
const browser = fromRun ? null : await launch({ webgl: has("--webgl") });
const results = [];
log(fromRun ? `re-judging run ${fromRun} (no browser)` : `run ${runId}: ${flows.length} flows x ${sizes.length} sizes, port ${PORT}`);

function hashSeed(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

if (fromRun) {
  const d = join(ROOT, "build", "screenshots", "sandbox", fromRun, "data");
  const ids = new Set(flows.map((f) => f.id));
  for (const f of readdirSync(d)) { const r = JSON.parse(readFileSync(join(d, f), "utf8")); if (ids.has(r.flow) && sizes.includes(r.size)) results.push(r); }
}
for (const flow of fromRun ? [] : flows) {
  for (const size of sizes) {
    const file = dataFile(flow.id, size);
    if (has("--resume") && existsSync(file)) { results.push(JSON.parse(readFileSync(file, "utf8"))); log(`${flow.id} @ ${size}: resumed`); continue; }
    const started = Date.now();
    const { ctx, page, errors } = await newPage(browser, size, { seed: hashSeed(flow.id) });
    const rec = new Recorder({ flow: flow.id, size, dir: runDir, page });
    const c = { page, rec, errors, size, browser, timeoutMs: flow.timeoutMs || 300000, reachedEnd: false };
    let timer;
    try {
      await Promise.race([flow.run(c), new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`flow timed out after ${Math.round(c.timeoutMs / 1000)} s`)), c.timeoutMs); })]);
    } catch (e) {
      rec.stop(String(e.message || e).split("\n")[0].slice(0, 300));
      try { await Promise.race([rec.state("stopped-here"), new Promise((r) => setTimeout(r, 20000))]); } catch (e2) { /* the page is gone */ }
    } finally { clearTimeout(timer); }
    await ctx.close().catch(() => {});
    const findingCount = new Set(rec.states.flatMap((s) => s.findings.map((f) => f.check + "|" + f.selector))).size; // distinct per check and selector
    const r = { flow: flow.id, title: flow.title, group: flow.group, size, complete: c.reachedEnd && !rec.stops.length, stops: rec.stops, notes: rec.notes, errors: [...new Set(errors)], states: rec.states, findingCount, ms: Date.now() - started };
    writeFileSync(file, JSON.stringify(r));
    results.push(r);
    log(`${flow.id} @ ${size}: ${r.complete ? "end reached" : "STOPPED: " + (r.stops[0] || "?")} | ${r.states.length} states, ${findingCount} distinct findings, ${r.errors.length} page errors, ${(r.ms / 1000).toFixed(0)} s`);
  }
}

// ---- contact sheets ----
if (!has("--no-sheets") && !fromRun) await makeSheets(browser, runDir, results, log);
if (browser) await browser.close();
if (server) server.close();

// ---- the ratchet ----
const cur = Baseline.flatten(results);
const scope = new Set(results.map((r) => `${r.flow}@${r.size}`));
const base = Baseline.load();
const cmp = Baseline.compare(base, cur, scope);

// ---- summary.md (every flow-size saved in this run folder, not only this invocation's) ----
const merged = new Map();
for (const f of readdirSync(dataDir)) { const r = JSON.parse(readFileSync(join(dataDir, f), "utf8")); merged.set(`${r.flow}@${r.size}`, r); }
for (const r of results) merged.set(`${r.flow}@${r.size}`, r);
const everything = [...merged.values()];
const sum = Baseline.flatten(everything);
const byCheck = {}, byPage = {}, byFlow = {};
for (const f of sum.findings) { byCheck[f.check] = (byCheck[f.check] || 0) + 1; byPage[f.page] = (byPage[f.page] || 0) + 1; byFlow[f.flow] = (byFlow[f.flow] || 0) + 1; }
const top = (o, n = 12) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
const elapsed = Math.round((Date.now() - t0) / 1000);
let md = `# Sandbox run ${runId}\n\n${new Set(everything.map((r) => r.flow)).size} flows x ${new Set(everything.map((r) => r.size)).size} sizes. Run time of the last invocation: ${Math.floor(elapsed / 60)} min ${elapsed % 60} s. Contact sheets: \`sheets/\`. Raw data: \`data/\`.\n\n`;
md += `## Findings: ${sum.findings.length} (unique per check, flow, size and selector)\n\nBy check: ${top(byCheck).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}\n\nBy page: ${top(byPage).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}\n\n`;
md += `## Flows\n\n| flow | size | end | states | findings | page errors | seconds |\n|---|---|---|---|---|---|---|\n`;
for (const r of everything) md += `| ${r.flow} | ${r.size} | ${r.complete ? "yes" : "NO: " + (r.stops[0] || "").replace(/\|/g, "/").slice(0, 90)} | ${r.states.length} | ${r.findingCount} | ${r.errors.length} | ${(r.ms / 1000).toFixed(0)} |\n`;
md += `\n## States\n\n`;
for (const r of everything) {
  md += `### ${r.flow} @ ${r.size}\n\n`;
  for (const [i, s] of r.states.entries()) md += `${i + 1}. \`${s.name}\` (${s.page}): ${s.findings.length} findings${s.shot ? "" : " (no screenshot)"}\n`;
  for (const n of r.notes) md += `- note: ${n}\n`;
  for (const e of r.errors) md += `- page error: ${e}\n`;
  md += "\n";
}
if (!fromRun) writeFileSync(join(runDir, "summary.md"), md);

// ---- baseline actions ----
console.log("");
log(`findings: ${sum.findings.length} (${top(byCheck).map(([k, v]) => `${k} ${v}`).join(", ") || "none"})`);
if (has("--update-baseline")) {
  if (!base && !has("--accept")) { console.error("There is no baseline yet: create it with --update-baseline --accept."); process.exit(2); }
  const out = Baseline.update(base, cur, scope, { accept: has("--accept") });
  log(`baseline written: ${out.findings.length} findings (${cmp.fixed.length} dropped as fixed${has("--accept") ? `, ${cmp.added.length} added` : cmp.added.length ? `, ${cmp.added.length} new ones NOT added` : ""})`);
}
if (has("--check")) {
  if (!base) { console.error("No baseline (build/lint/baseline.json). Create it with --update-baseline --accept."); process.exit(2); }
  for (const f of cmp.added.slice(0, 80)) console.log(`NEW ${f.check.padEnd(16)} ${f.flow} @ ${f.size} [${f.states.join(", ")}] ${f.selector}: ${f.measured}${f.text ? `  "${f.text}"` : ""}`);
  if (cmp.added.length > 80) console.log(`... and ${cmp.added.length - 80} more new findings`);
  for (const f of cmp.moved.slice(0, 40)) console.log(`moved ${f.check.padEnd(16)} ${f.flow} @ ${f.size} ${f.selector} (known in another flow; not a failure)`);
  for (const fs of cmp.incomplete) console.log(`INCOMPLETE ${fs}: reached its end in the baseline, not now`);
  for (const e of cmp.newErrors) console.log(`NEW PAGE ERROR ${e}`);
  console.log(`${cmp.fixed.length} fixed (run --update-baseline to shrink the baseline)`);
  const bad = cmp.added.length + cmp.incomplete.length + cmp.newErrors.length;
  console.log(bad ? `CHECK FAILED: ${cmp.added.length} new findings, ${cmp.incomplete.length} flows no longer reach their end, ${cmp.newErrors.length} new page errors` : `CHECK PASSED: 0 new findings (${cur.findings.length} known, ${cmp.moved.length} moved between flows, ${cmp.fixed.length} fixed)`);
  log(`summary: ${join(runDir, "summary.md")}`);
  process.exit(bad ? 1 : 0);
}
log(`summary: ${join(runDir, "summary.md")}`);
