#!/usr/bin/env node
// The blocking gate (Sprint 20 P3, build/reports/s20-plan.md section 4): green means zero, enforced by this script and nobody's
// judgement. For the games named, in order:
//   1. tier 0: checks.mjs;
//   2. the contract run of the games' flows at L1-L4, 740x320 and 1280x665, --parallel 2: ANY break of a blocking check fails
//      (build/tools/tiers/gate-lists.json); advisory breaks are printed, never failing; a page that does not reach its end or has a
//      page error fails too (a page not played judged nothing);
//   3. the box gate (boxes.mjs --run) for each game with a box reference (build/frozen/boxes/<game>/).
// One line per part with its minutes, then "GATE PASS|FAIL <games>: <parts> in <n> min". Exit 0 only when every part is at zero.
// No known-failures list, no "fewer than before". A check changes lists only in gate-lists.json, with Zafar's written yes.
//   node build/tools/tiers/gate.mjs --game chai-tray[,daar] [--sizes 740x320,1280x665] [--levels 1,2,3,4] [--skip-checks]
//        [--no-boxes] [--dry-run]     (--game none: tier 0 only, for a change that reaches no game)
// Browser: under NJG_LOCK (default /tmp/njg-browser-all.lock), taken here once; COOK_TEST_PORT as every browser tool.
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync, spawn } from "node:child_process";
import { args, ROOT, rel, underLock, BROWSER_LOCK } from "../review/lib/common.mjs";
import * as T from "./lib.mjs";

export const LISTS_FILE = join(ROOT, "build/tools/tiers/gate-lists.json");
export const GATE_SIZES = ["740x320", "1280x665"];
export const GATE_LEVELS = [1, 2, 3, 4];
export const loadLists = (file = LISTS_FILE) => JSON.parse(readFileSync(file, "utf8"));

// ---------------------------------------------------------------- pure: what a contract run means for the gate
// breaks -> { blocking, advisory, unknown }: a check in neither list is unknown and BLOCKS (a new check must be listed on purpose)
export function splitBreaks(breaks, lists) {
  const blocking = [], advisory = [], unknown = [];
  for (const b of breaks) {
    if (lists.blocking[b.check] !== undefined) blocking.push(b);
    else if (lists.advisory[b.check] !== undefined) advisory.push(b);
    else unknown.push(b);
  }
  return { blocking: [...blocking, ...unknown], advisory, unknown };
}
// a run -> the blocking problems (strings) and the advisory counts
export function judgeContract({ pages = [], breaks = [] }, lists, expectedPages = 0) {
  const problems = [];
  if (!pages.length || pages.length < expectedPages) problems.push(`only ${pages.length} of ${expectedPages} pages were played`);
  for (const p of pages) {
    if (!p.complete) problems.push(`${p.flow}@${p.size}: did not reach its end`);
    for (const e of p.errors || []) problems.push(`${p.flow}@${p.size}: page error: ${String(e).slice(0, 120)}`);
  }
  const s = splitBreaks(breaks, lists);
  const seen = new Set();
  for (const b of s.blocking) {
    const k = `${b.check}|${b.flow}|${b.size}|${b.measured}`;
    if (seen.has(k)) continue; seen.add(k);
    problems.push(`${b.check} (${b.item || ""}) ${b.flow}@${b.size}${b.state ? ` [${b.state}]` : ""}: ${String(b.measured || "").slice(0, 160)}`);
  }
  const adv = {};
  for (const b of s.advisory) adv[b.check] = (adv[b.check] || 0) + 1;
  return { problems, blockingBreaks: s.blocking.length, advisoryCounts: adv, advisoryTotal: s.advisory.length };
}
// the final line (merge.mjs puts it in its commit message)
export function finalLine(games, parts, ok, minutes) {
  return `GATE ${ok ? "PASS" : "FAIL"} ${games.join(",")}: ${parts.map((p) => `${p.id} ${p.ok ? "pass" : "FAIL"} ${p.minutes}`).join(", ")}; ${minutes} min`;
}

// ---------------------------------------------------------------- the run
async function main() {
  const a = args();
  const HELP = readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 18).map((l) => l.replace(/^\/\/ ?/, "")).join("\n");
  if (a.has("help") || a.has("h") || !a.val("game")) { console.log(HELP); process.exit(a.has("help") || a.has("h") ? 0 : 2); }
  const LOCK = process.env.NJG_LOCK || BROWSER_LOCK;
  const dry = a.has("dry-run") || a.has("dry");
  if (!dry && !underLock(LOCK)) { // one lock for the whole gate; its children see it held
    const r = spawnSync("flock", ["-w", "3600", LOCK, process.execPath, process.argv[1], ...process.argv.slice(2)], { stdio: "inherit", cwd: ROOT, env: { ...process.env, NJG_LOCKED: "1" } });
    process.exit(r.status == null ? 1 : r.status);
  }
  const lists = loadLists();
  const all = T.allFlowIds();
  const games = a.val("game") === "none" ? [] : a.val("game").split(",").map((g) => T.normalizeGame(g.trim(), all)); // "none": a change that reaches no game: tier 0 only
  if (games.some((g) => !g)) { console.error(`Unknown game in --game ${a.val("game")} (node build/sandbox/run.mjs --list)`); process.exit(2); }
  const sizes = a.val("sizes", GATE_SIZES.join(",")).split(",");
  const levels = a.val("levels", GATE_LEVELS.join(",")).split(",").map(Number);
  const flows = games.flatMap((g) => T.flowsOfGame(g, all, { levels }));
  const boxGames = a.has("no-boxes") ? [] : games.map(T.keyOf).filter((k) => existsSync(join(ROOT, "build/frozen/boxes", k)));
  const id = `gate-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 13)}-${games.map(T.keyOf).join("+")}`;
  const parts = [];
  if (!a.has("skip-checks")) parts.push({ id: "checks", what: "tier 0: checks.mjs", argv: ["build/tools/review/checks.mjs"], timeoutMin: 40 });
  if (flows.length) parts.push({ id: "contract", what: `${flows.length} flows (${games.join(", ")}) at ${sizes.join(", ")}, L${levels.join(",L")}`, argv: ["build/sandbox/run.mjs", "--flow", flows.join(","), "--sizes", sizes.join(","), "--contract", "--parallel", "2", "--no-sheets", "--run-id", id], timeoutMin: 120 });
  for (const k of boxGames) parts.push({ id: `boxes:${k}`, what: `the box gate against build/frozen/boxes/${k}`, argv: ["build/tools/review/boxes.mjs", "--game", k, "--run", "--parallel", "2", "--run-id", `${id}-${k}`], timeoutMin: 90 });
  console.log(`gate: ${games.join(", ")}; ${parts.length} part(s): ${parts.map((p) => p.id).join(", ")}; blocking checks ${Object.keys(lists.blocking).length}, advisory ${Object.keys(lists.advisory).length}`);
  const noBox = games.map(T.keyOf).filter((k) => !boxGames.includes(k));
  if (noBox.length) console.log(`gate: no box reference for ${noBox.join(", ")} (no box part)`);
  if (dry) { for (const p of parts) console.log(`  ${p.id}: node ${p.argv.join(" ")}`); process.exit(0); }

  const logDir = join(ROOT, "build/screenshots/gate", id);
  mkdirSync(logDir, { recursive: true });
  const t0 = Date.now(), done = [], detail = [];
  for (const p of parts) {
    const t1 = Date.now();
    const log = join(logDir, `${p.id.replace(/[^\w.-]+/g, "_")}.log`);
    const code = await new Promise((res) => {
      const out = require_fs_stream(log);
      const c = spawn("timeout", [String(p.timeoutMin * 60), process.execPath, ...p.argv], { cwd: ROOT, env: { ...process.env, NJG_LOCKED: "1" }, detached: true });
      c.stdout.on("data", (d) => out.write(d)); c.stderr.on("data", (d) => out.write(d));
      c.on("exit", () => { try { process.kill(-c.pid, "SIGTERM"); } catch (e) { /* gone */ } });
      c.on("close", (n) => { out.end(); res(n); });
    });
    const minutes = +((Date.now() - t1) / 60000).toFixed(1);
    let ok = code === 0, note = "";
    if (p.id === "contract") { // the exit code says "any break"; the lists say which breaks count
      const run = T.readRun(T.runPath(id));
      const j = judgeContract(run, lists, flows.length * sizes.length);
      ok = j.problems.length === 0;
      note = ok ? `0 blocking breaks over ${run.pages.length} pages` : `${j.problems.length} blocking problem(s)`;
      if (j.advisoryTotal) note += `; advisory (not failing): ${j.advisoryTotal} (${Object.entries(j.advisoryCounts).map(([k, n]) => `${k} x${n}`).join(", ")})`;
      for (const x of j.problems) detail.push(`  BLOCKS ${x}`);
      if (!ok && !run.pages.length) detail.push(`  no page was read: see ${rel(log)}`);
    } else if (!ok) {
      const lines = readFileSync(log, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
      note = `exit ${code}: ${(lines.filter((l) => /^(FAIL|fail)/.test(l)).slice(0, 3).join("; ") || lines.at(-1) || "").slice(0, 200)}`;
      detail.push(`  BLOCKS ${p.id}: ${note} (log ${rel(log)})`);
    }
    done.push({ id: p.id, ok, minutes, note, log: rel(log) });
    console.log(`  ${p.id.padEnd(16)} ${ok ? "pass" : "FAIL"}  ${String(minutes).padStart(5)} min  ${note}`);
  }
  for (const l of detail.slice(0, 60)) console.log(l);
  if (detail.length > 60) console.log(`  ... ${detail.length - 60} more in ${rel(logDir)}`);
  const total = +((Date.now() - t0) / 60000).toFixed(1);
  const ok = done.every((p) => p.ok);
  const line = finalLine(games.map(T.keyOf), done, ok, total);
  writeFileSync(join(logDir, "gate.json"), JSON.stringify({ line, ok, games, sizes, levels, parts: done, problems: detail, commit: T.head() }, null, 1));
  console.log(line);
  process.exit(ok ? 0 : 1);
}
import { createWriteStream } from "node:fs";
const require_fs_stream = (f) => createWriteStream(f);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
