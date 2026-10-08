#!/usr/bin/env node
// The sandbox: plays the live flows through their real pages and lab URLs, records each visually distinct state
// (a screenshot and a screen lint at the current size), and ratchets the findings against build/lint/baseline.json.
// See build/sandbox/README.md. Always under the browser lock, on your own port:
//   COOK_TEST_PORT=8814 flock -w 1800 /tmp/njg-browser.lock timeout 1200 node build/sandbox/run.mjs --touched cook:chai-tray
//   COOK_TEST_PORT=8814 node build/sandbox/run.mjs --gate        (everything; takes and releases the lock itself, chunk by chunk)
import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT, SIZES, ALL_SIZES, QUICK_SIZE, PORT, startServer, launch, newPage } from "./lib/env.mjs";
import { Recorder } from "./lib/recorder.mjs";
import { makeSheets } from "./lib/sheets.mjs";
import { mergeSound } from "./lib/sound.mjs";
import * as Baseline from "./lib/baseline.mjs";
import { lintCssAll } from "../lint/css.mjs";
import { allFlows, flowSizes, variantsOf } from "./flows/index.mjs";
import { tiles, tileFlows } from "./flows/labs.mjs";
import * as Contract from "./lib/contract.mjs";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const log = (...a) => console.log(new Date().toTimeString().slice(0, 8), ...a);

if (has("--help") || has("-h") || !argv.length) {
  console.log(`node build/sandbox/run.mjs [--gate | --touched a,b | --all | --flow a,b,c] [--quick] [--sizes 844x390,...] [--every-size] [--parallel N] [--check] [--update-baseline [--accept | --append]] [--list] [--no-sheets] [--run-id id] [--resume id]
  --gate                everything (every flow, level and path at its sizes), 3 pages at a time, in lock-sized chunks, then --check. Takes and releases the browser lock itself
  --touched ids         what a session changed: the named flows with every level and path (cook:chai-tray also runs @L2, @L3, #mistake, #hint ...), at their sizes, then --check
  --all                 every flow at its sizes (one invocation; wrap it in flock yourself)
  --flow ids            named flows (exact id, a prefix such as "cook:" or "clinic:", or a group: house, first, cook, clinic, modes, ...)
  --quick               laptop size (${QUICK_SIZE}) only, named flows only: for iterating
  --sizes list          sizes to run (default: each flow's own: ${ALL_SIZES.join(", ")} for the main ones)
  --every-size          every flow at every size (the slow, complete matrix)
  --parallel N          pages at once inside the one browser (default 1; --gate uses 3)
  --budget-min M        start no new page after M minutes; exit 75 if some are left (rerun with --resume <run-id>)
  --check               compare the findings with build/lint/baseline.json; exit 1 on a NEW finding, a flow that no longer reaches its end, or a new page error
  --update-baseline     rewrite the baseline with the fixed findings dropped (it only shrinks); --accept also adopts new findings (and creates the baseline); --append only ADDS findings and flows the baseline lacks and changes no existing entry
  --webgl               Phaser's WebGL renderer for Cook (software GL: about 4x slower; the default is canvas, which draws no tints)
  --from-run id         judge a finished run's saved data (no browser): with --check / --update-baseline
  --contract            the contract checks (decision 75: pop-up before play, moves on by itself, voice stops at every stage end,
                        bubbles at the speaker's head, badges in order, no retired art) on the named flows (default: the
                        route set CONTRACT_ROUTE at laptop size); writes contract.md and contract.json; exit 1 on any break.
                        --check runs them too, on every page of the run (never ratcheted into the baseline)
  --list                list the flows and the labs.html tiles they play, and exit
  --no-sheets           skip the contact sheets
  --run-id id           folder name under build/screenshots/sandbox/ (default: a timestamp)
  --resume id           continue run <id>: skip the pages already done`);
  process.exit(0);
}

// ---- --gate: the parent. It only loops chunks, each under the lock for at most ~20 minutes, and prints the last one's verdict ----
if (has("--gate") && !has("--chunk")) {
  const runId = val("--run-id") || val("--resume") || "gate-" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
  const t0 = Date.now();
  let code = 75, chunks = 0;
  // everything the caller gave except the flags the parent sets itself
  const own = new Set(["--gate", "--all"]), withVal = new Set(["--run-id", "--resume", "--parallel", "--budget-min"]);
  const passthru = [];
  for (let i = 0; i < argv.length; i++) { if (own.has(argv[i])) continue; if (withVal.has(argv[i])) { i++; continue; } passthru.push(argv[i]); }
  if (!passthru.includes("--check") && !passthru.includes("--update-baseline")) passthru.push("--check");
  while (code === 75 && chunks < 60) {
    chunks++;
    log(`gate chunk ${chunks} (run ${runId}): waiting for the browser lock`);
    const r = spawnSync("flock", ["-w", "3600", "/tmp/njg-browser.lock", "timeout", "1200", process.execPath, process.argv[1], "--gate", "--chunk", "--all", "--parallel", val("--parallel") || "3", "--budget-min", val("--budget-min") || "13", "--run-id", runId, "--resume", runId, ...passthru], { stdio: "inherit", env: process.env });
    code = r.status === null ? 124 : r.status; // 124: killed by the 20-minute timeout; its finished pages are saved, so go on
    if (code === 124) code = 75;
  }
  log(`gate: ${chunks} chunks, ${Math.round((Date.now() - t0) / 60000)} min wall time including waits for the lock, exit ${code}`);
  process.exit(code);
}

const live = allFlows();
if (has("--list")) {
  for (const f of live) console.log(`${f.id.padEnd(34)} ${(f.sizes ? f.sizes.join(",") : "all sizes").padEnd(26)} ${f.title}`);
  // what Zafar plays: every labs.html tile and the flows that play it (decision 76)
  console.log("\nlabs.html tiles -> flows");
  for (const t of tiles()) {
    const m = tileFlows(t, live);
    console.log(`  ${t.title.slice(0, 44).padEnd(44)} ${m.gap ? `NO FLOW: ${m.gap}` : `${m.flows.length} flows: ${m.flows.slice(0, 4).join(", ")}${m.flows.length > 4 ? ` +${m.flows.length - 4}` : ""}${m.note ? ` (${m.note})` : ""}`}`);
  }
  process.exit(0);
}
// the route the contract run plays by default (--contract with no --flow): what Zafar played on 8 Oct and the places his rules
// were caught, at laptop size. The orchestrator's /review runs the full contract pass (--gate or --all --check)
const CONTRACT_ROUTE = ["cook:chop", "cook:chaat@L4", "cook:fetch", "lab:cook/round", "lab:cook/recipe-chaat@L4", "cook:day1", "clinic:waiting", "clinic:diagnosis", "clinic:diagnosis@L3", "clinic:heal-knee@L2", "clinic:morning"];
if (has("--contract") && !val("--flow") && !val("--touched") && !has("--all") && !has("--gate")) { argv.push("--flow", CONTRACT_ROUTE.join(",")); if (!has("--sizes") && !has("--every-size")) argv.push("--quick"); }

function pick() {
  const named = (val("--flow") || val("--touched") || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (has("--all") || has("--gate")) return live;
  if (!named.length) { console.error("Name the flows (--flow cook:chai-tray,clinic:waiting or --touched ...) or use --all / --gate. --list shows them."); process.exit(2); }
  const out = [];
  for (const n of named) {
    let m = live.filter((f) => f.id === n || f.group === n || (n.endsWith(":") && f.id.startsWith(n)) || (n.endsWith("*") && f.id.startsWith(n.slice(0, -1))));
    if (has("--touched")) m = [...new Set(m.flatMap((f) => variantsOf(live, f.id)))];
    if (!m.length) { console.error(`No flow "${n}". --list shows them.`); process.exit(2); }
    for (const f of m) if (!out.includes(f)) out.push(f);
  }
  return out;
}
const flows = pick();
if (has("--quick") && (has("--all") || has("--gate"))) { console.error("--quick is for named flows only."); process.exit(2); }
const sizeOpt = has("--quick") ? [QUICK_SIZE] : val("--sizes") ? val("--sizes").split(",") : null;
for (const s of sizeOpt || []) if (!SIZES[s]) { console.error(`Unknown size ${s}. Known: ${Object.keys(SIZES).join(", ")}`); process.exit(2); }
const sizesOf = (f) => (f.static ? ["static"] : sizeOpt ? sizeOpt.filter((s) => !!SIZES[s].upright === !!f.upright) : has("--every-size") && !f.upright ? ALL_SIZES : flowSizes(f));

const runId = val("--run-id") || val("--resume") || val("--from-run") || new Date().toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
const runDir = join(ROOT, "build", "screenshots", "sandbox", runId);
const dataDir = join(runDir, "data");
mkdirSync(dataDir, { recursive: true });
const dataFile = (flow, size) => join(dataDir, `${flow.replace(/[^a-z0-9@#]+/gi, "_")}__${size}.json`);
const parallel = Math.max(1, +(val("--parallel") || 1));
const budgetMs = val("--budget-min") ? +val("--budget-min") * 60000 : Infinity;

const t0 = Date.now();
const fromRun = val("--from-run");
const results = [];
function hashSeed(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

// the job list: every (flow, size), minus what a resumed run already has
const jobs = [];
for (const flow of flows) for (const size of sizesOf(flow)) jobs.push({ flow, size, file: dataFile(flow.id, size) });
const order = new Map(flows.map((f, i) => [f.id, i]));
let leftover = 0;

if (fromRun) {
  const d = join(ROOT, "build", "screenshots", "sandbox", fromRun, "data");
  const ids = new Set(flows.map((f) => f.id));
  for (const f of readdirSync(d)) { const r = JSON.parse(readFileSync(join(d, f), "utf8")); if (ids.has(r.flow) && (sizeOpt ? sizeOpt.includes(r.size) : true)) results.push(r); }
} else {
  const todo = [];
  for (const j of jobs) {
    if (has("--resume") && existsSync(j.file)) { results.push(JSON.parse(readFileSync(j.file, "utf8"))); continue; }
    todo.push(j);
  }
  // the heavy flows first, so a chunk's tail is short pages
  // pages the baseline has never seen (new levels, paths, sizes) first, pages it already knows last; the heavy flows first within each
  const known = Baseline.load();
  const seenBefore = (j) => (known && known.flows && known.flows[`${j.flow.id}@${j.size}`] ? 1 : 0);
  todo.sort((a, b) => seenBefore(a) - seenBefore(b) || (b.flow.timeoutMs || 300000) - (a.flow.timeoutMs || 300000) || order.get(a.flow.id) - order.get(b.flow.id));
  log(`run ${runId}: ${jobs.length} pages (${jobs.length - todo.length} done already), ${parallel} at a time, port ${PORT}${budgetMs < Infinity ? `, ${val("--budget-min")} min budget` : ""}`);
  const fresh = [];
  if (todo.length) {
    const server = await startServer();
    const browser = await launch({ webgl: has("--webgl") });
    const queue = todo.slice();
    const runJob = async ({ flow, size, file }) => {
      if (flow.static) {
        const findings = flow.static();
        const r = { flow: flow.id, title: flow.title, group: flow.group, size, complete: true, stops: [], notes: [], errors: [], states: [{ name: flow.id, page: flow.id, shot: null, findings: findings.map((f) => ({ ...f, page: flow.id })), note: "" }], findingCount: findings.length, ms: 0, sound: null };
        writeFileSync(file, JSON.stringify(r)); fresh.push(r); log(`${flow.id} @ ${size}: ${findings.length} findings`); return;
      }
      const started = Date.now();
      const { ctx, page, errors, sound, touch } = await newPage(browser, size, { seed: hashSeed(flow.id), ...(has("--no-touch") ? { touch: false } : {}) });
      const rec = new Recorder({ flow: flow.id, size, dir: runDir, page });
      const c = { page, rec, errors, size, browser, touch, timeoutMs: flow.timeoutMs || 300000, reachedEnd: false };
      let timer;
      try {
        await Promise.race([flow.run(c), new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`flow timed out after ${Math.round(c.timeoutMs / 1000)} s`)), c.timeoutMs); })]);
      } catch (e) {
        rec.stop(String(e.message || e).split("\n")[0].slice(0, 300));
        try { await Promise.race([rec.state("stopped-here"), new Promise((r) => setTimeout(r, 20000))]); } catch (e2) { /* the page is gone */ }
      } finally { clearTimeout(timer); }
      await ctx.close().catch(() => {});
      const findingCount = new Set(rec.states.flatMap((s) => s.findings.map((f) => f.check + "|" + f.selector))).size; // distinct per check and selector
      const r = { flow: flow.id, title: flow.title, group: flow.group, size, complete: c.reachedEnd && !rec.stops.length, stops: rec.stops, notes: rec.notes, errors: [...new Set(errors)], states: rec.states, findingCount, ms: Date.now() - started, sound: sound.summary(), timeline: sound.timeline(), t0: rec.t0, ...(c.extra ? { extra: c.extra } : {}) };
      writeFileSync(file, JSON.stringify(r));
      fresh.push(r);
      log(`${flow.id} @ ${size}: ${r.complete ? "end reached" : "STOPPED: " + (r.stops[0] || "?")} | ${r.states.length} states, ${findingCount} distinct findings, ${r.errors.length} page errors, ${(r.ms / 1000).toFixed(0)} s`);
    };
    const worker = async () => {
      while (queue.length) {
        if (Date.now() - t0 > budgetMs) return;
        await runJob(queue.shift());
      }
    };
    await Promise.all(Array.from({ length: parallel }, worker));
    leftover = queue.length;
    results.push(...fresh);
    // ---- contact sheets (this invocation's pages) ----
    if (!has("--no-sheets") && fresh.length) await makeSheets(browser, runDir, fresh.filter((r) => r.size !== "static"), log);
    await browser.close();
    server.close();
  }
}
// a chunk that was killed by the lock timeout saved its pages but not their contact sheets: make the missing ones now
if (!leftover && !fromRun && !has("--no-sheets")) {
  const slug = (x) => String(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const missing = results.filter((r) => r.size !== "static" && !existsSync(join(runDir, "sheets", `${slug(r.flow)}__${r.size}.png`)) && !existsSync(join(runDir, "sheets", `${slug(r.flow)}__${r.size}__1.png`)));
  if (missing.length) {
    const server = await startServer();
    const browser = await launch({ webgl: false });
    await makeSheets(browser, runDir, missing, log);
    await browser.close(); server.close();
  }
}
results.sort((a, b) => (order.get(a.flow) ?? 1e9) - (order.get(b.flow) ?? 1e9) || a.size.localeCompare(b.size));

if (leftover) {
  log(`${leftover} pages left in this run: run it again with --resume ${runId}`);
  appendFileSync(join(runDir, "chunks.log"), `${new Date().toISOString()} ${Math.round((Date.now() - t0) / 1000)} s, ${leftover} left\n`);
  process.exit(75);
}
appendFileSync(join(runDir, "chunks.log"), `${new Date().toISOString()} ${Math.round((Date.now() - t0) / 1000)} s, done\n`);

// ---- the ratchet ----
const cur = Baseline.flatten(results);
const scope = new Set(results.map((r) => `${r.flow}@${r.size}`));
const base = Baseline.load();
const cmp = Baseline.compare(base, cur, scope);

// ---- summary.md (every flow-size saved in this run folder, not only this invocation's) ----
const merged = new Map();
for (const f of readdirSync(dataDir)) { const r = JSON.parse(readFileSync(join(dataDir, f), "utf8")); merged.set(`${r.flow}@${r.size}`, r); }
for (const r of results) merged.set(`${r.flow}@${r.size}`, r);
const everything = [...merged.values()].sort((a, b) => (order.get(a.flow) ?? 1e9) - (order.get(b.flow) ?? 1e9) || a.size.localeCompare(b.size));
const sum = Baseline.flatten(everything);
const byCheck = {}, byPage = {}, byFlow = {};
for (const f of sum.findings) { byCheck[f.check] = (byCheck[f.check] || 0) + 1; byPage[f.page] = (byPage[f.page] || 0) + 1; byFlow[f.flow] = (byFlow[f.flow] || 0) + 1; }
const top = (o, n = 14) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
const elapsed = Math.round((Date.now() - t0) / 1000);
const wall = existsSync(join(runDir, "chunks.log")) ? readFileSync(join(runDir, "chunks.log"), "utf8").split("\n").filter(Boolean).reduce((a, l) => a + (+(/ (\d+) s,/.exec(l) || [0, 0])[1]), 0) : elapsed;
const cpu = Math.round(everything.reduce((a, r) => a + (r.ms || 0), 0) / 1000);
// sound: the two lists
const sound = mergeSound(everything.map((r) => ({ flow: r.flow + "@" + r.size, sound: r.sound })));
if (!fromRun) writeFileSync(join(runDir, "sound.json"), JSON.stringify({ gaps: sound.gaps, informational: sound.informational, lines: sound.lines }, null, 1));
let md = `# Sandbox run ${runId}\n\n${new Set(everything.map((r) => r.flow)).size} flows, ${everything.length} pages (flow x size). Time spent in this run: ${Math.floor(wall / 60)} min ${wall % 60} s of browser time (${Math.floor(cpu / 60)} min of page time summed over ${parallel} at a time). Contact sheets: \`sheets/\`. Raw data: \`data/\`. Sound: \`sound.json\`.\n\n`;
md += `## Findings: ${sum.findings.length} (unique per check, flow, size and selector)\n\nBy check: ${top(byCheck).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}\n\nBy page: ${top(byPage).map(([k, v]) => `${k} ${v}`).join(", ") || "none"}\n\n`;
const sg = sound.gaps, si = sound.informational;
md += `## Sound (informational in the test build)\n\n${sound.lines.length} different spoken lines heard. **Recording gap list: ${sg.length} lines had no family clip** (they played a computer voice or an older file, the device voice, or nothing). ${si.length} files that played were not an approved family clip (computer voice, unchecked, older recordings, device voice).\n\n`;
md += `| line | what played | times | flows |\n|---|---|---|---|\n`;
for (const g of sg.slice(0, 150)) md += `| ${g.text.replace(/\|/g, "/")} | ${Object.entries(g.statuses).map(([k, v]) => `${k} x${v}`).join(", ")} | ${g.n} | ${g.flows.slice(0, 3).join(", ")}${g.flows.length > 3 ? ` +${g.flows.length - 3}` : ""} |\n`;
if (sg.length > 150) md += `\n... and ${sg.length - 150} more in sound.json\n`;
md += `\n### Played but not an approved family clip\n\n| kind | file or text | times |\n|---|---|---|\n`;
for (const p of si.slice(0, 80)) md += `| ${p.kind} | ${(p.file || p.text || "").replace(/\|/g, "/")} | ${p.n} |\n`;
md += `\n## Flows\n\n| flow | size | end | states | findings | page errors | seconds |\n|---|---|---|---|---|---|---|\n`;
for (const r of everything) md += `| ${r.flow} | ${r.size} | ${r.complete ? "yes" : "NO: " + (r.stops[0] || "").replace(/\|/g, "/").slice(0, 90)} | ${r.states.length} | ${r.findingCount} | ${r.errors.length} | ${(r.ms / 1000).toFixed(0)} |\n`;
md += `\n## States\n\n`;
for (const r of everything) {
  md += `### ${r.flow} @ ${r.size}\n\n`;
  for (const [i, s] of r.states.entries()) md += `${i + 1}. \`${s.name}\` (${s.page}): ${s.findings.length} findings${s.shot || r.size === "static" ? "" : " (no screenshot)"}\n`;
  for (const n of r.notes) md += `- note: ${n}\n`;
  for (const e of r.errors) md += `- page error: ${e}\n`;
  md += "\n";
}
if (!fromRun) writeFileSync(join(runDir, "summary.md"), md);

// ---- the contract checks (decision 75): every page of this run; a break is never ratcheted ----
const contract = Contract.report(everything, { root: ROOT });
if (!fromRun || has("--contract")) {
  writeFileSync(join(runDir, "contract.md"), `# Contract run ${runId}\n\n${contract.md}`);
  writeFileSync(join(runDir, "contract.json"), JSON.stringify(contract.breaks, null, 1));
}
const contractLine = () => {
  const by = {};
  for (const b of contract.breaks) by[b.check] = (by[b.check] || 0) + 1;
  for (const b of contract.breaks.slice(0, 60)) console.log(`BREAK ${b.check} ${b.flow} L${b.level} @ ${b.size} [${b.state}${b.shot ? " " + b.shot : ""}] ${b.at}s: ${b.measured}`);
  if (contract.breaks.length > 60) console.log(`... and ${contract.breaks.length - 60} more in contract.md`);
  console.log(contract.breaks.length ? `CONTRACT FAILED: ${contract.breaks.length} breaks (${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(", ")})` : `CONTRACT PASSED: 0 breaks over ${everything.filter((r) => r.size !== "static").length} pages`);
};
if (has("--contract") && !has("--check")) {
  contractLine();
  log(`contract: ${join(runDir, "contract.md")}`);
  process.exit(contract.breaks.length ? 1 : 0);
}

// ---- baseline actions ----
console.log("");
log(`findings: ${sum.findings.length} (${top(byCheck).map(([k, v]) => `${k} ${v}`).join(", ") || "none"})`);
log(`sound: ${sound.lines.length} lines heard, ${sg.length} with no family clip (the recording gap list), ${si.length} played files that are not an approved family clip`);
for (const g of sg.slice(0, 25)) console.log(`  gap  ${String(g.n).padStart(4)}x  ${g.text}  [${Object.keys(g.statuses).join("/")}]`);
if (sg.length > 25) console.log(`  ... ${sg.length - 25} more in ${join(runDir, "sound.json")}`);
if (has("--update-baseline")) {
  if (!base && !has("--accept")) { console.error("There is no baseline yet: create it with --update-baseline --accept."); process.exit(2); }
  const out = has("--append") ? Baseline.append(base, cur) : Baseline.update(base, cur, scope, { accept: has("--accept") });
  log(`baseline written: ${out.findings.length} findings (${has("--append") ? `${out.added} added, nothing else touched` : `${cmp.fixed.length} dropped as fixed${has("--accept") ? `, ${cmp.added.length} added` : cmp.added.length ? `, ${cmp.added.length} new ones NOT added` : ""}`})`);
}
if (has("--check")) {
  if (!base) { console.error("No baseline (build/lint/baseline.json). Create it with --update-baseline --accept."); process.exit(2); }
  for (const f of cmp.added.slice(0, 80)) console.log(`NEW ${f.check.padEnd(16)} ${f.flow} @ ${f.size} [${f.states.join(", ")}] ${f.selector}: ${f.measured}${f.text ? `  "${f.text}"` : ""}`);
  if (cmp.added.length > 80) console.log(`... and ${cmp.added.length - 80} more new findings`);
  for (const f of cmp.moved.slice(0, 40)) console.log(`moved ${f.check.padEnd(16)} ${f.flow} @ ${f.size} ${f.selector} (known in another flow; not a failure)`);
  for (const fs of cmp.incomplete) console.log(`INCOMPLETE ${fs}: reached its end in the baseline, not now`);
  for (const fs of cmp.unbaselined) console.log(`not in the baseline yet: ${fs}${cmp.newIncomplete.includes(fs) ? "  (and it does not reach its end)" : ""}`);
  for (const e of cmp.newErrors) console.log(`NEW PAGE ERROR ${e}`);
  console.log(`${cmp.fixed.length} fixed (run --update-baseline to shrink the baseline)`);
  contractLine();
  const bad = cmp.added.length + cmp.incomplete.length + cmp.newErrors.length + cmp.newIncomplete.length + contract.breaks.length;
  console.log(bad ? `CHECK FAILED: ${cmp.added.length} new findings, ${cmp.incomplete.length + cmp.newIncomplete.length} flows do not reach their end, ${cmp.newErrors.length} new page errors, ${contract.breaks.length} contract breaks` : `CHECK PASSED: 0 new findings (${cur.findings.length} known, ${cmp.moved.length} moved between flows, ${cmp.fixed.length} fixed)`);
  log(`summary: ${join(runDir, "summary.md")}`);
  process.exit(bad ? 1 : 0);
}
log(`summary: ${join(runDir, "summary.md")}`);
