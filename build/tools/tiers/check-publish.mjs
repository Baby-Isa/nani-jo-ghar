#!/usr/bin/env node
// check-publish (tier 3b, after the sprint check's fix list is fixed; Zafar, 9-10 Nov; /publish runs it). The failures of the last
// check-sprint again, every changed game at one size to its end (fixes break neighbours), checks.mjs --full (the browser's load
// check and the parked modes' leak bots), the tier's extra checks; then the known-fails list (published with it: Zafar, 9 Nov,
// replacing decision 89's "no open fixable row") and, with --go, publish.mjs --go and check-live. publish.mjs refuses unless this
// passed on the commit it publishes; publish.mjs then runs check-live. Blocks only on: checks red, a stuck page, a page error, a blocking extra check, no check-sprint.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { args, help } from "../review/lib/common.mjs";
import * as T from "./lib.mjs";
import { rowBlockers, waiting } from "../ops/publishgate.mjs";

const HELP = `
node build/tools/tiers/check-publish.mjs [--dry-run] [--since <ref>] [--games a,b] [--go [--log] [--trailer "..."] [--words "..."]]
  Tier 3b. Runs: check-push; the pages that failed in the newest check-sprint since the last publish, again, at their sizes;
  run.mjs --flow <every changed game's flows> --sizes ${T.CONFIG.tiers.publish.size} --check; checks.mjs ${T.CONFIG.tiers.publish.checksArgs.join(" ")}; the tier's extra checks
  (chai's frozen run, reports; check_stamps, blocks). Writes build/reports/tiers/publish-<commit>.json and .md and the known-fails
  list build/reports/tiers/known-fails-<commit>.md: every contract break and report-only failure left, and the fix list's open
  rows by label. Blocks on: checks red, a page that does not reach its end, a page error, a blocking extra check, no check-sprint
  since the last publish (--words "<his words, date>" publishes without one).
  --go: when it passed, node build/tools/ops/publish.mjs --go (with --log, --trailer, --words passed on), which runs check-live.`;
const a = args(); help(HELP, a);
const { dry } = T.common(a);
const P = T.CONFIG.tiers.publish;
const t0 = Date.now();
const sha = T.head(), base = a.val("since") ? T.git("rev-parse", a.val("since")) : T.lastPublish();
const all = T.allFlowIds();
const tc = T.touched(base);
const files = tc.files || [];
const games = a.val("games") ? a.val("games").split(",").map((g) => T.normalizeGame(g.trim(), all) || g.trim()) : T.gamesFromFlows(tc.flows || [], all);
// the newest check-sprint since the last publish, and its failed pages
const since = (c) => T.git("merge-base", "--is-ancestor", base, c) !== null && c !== base;
const sprint = T.readResults("sprint").filter((r) => !r.dry && since(r.commit)).sort((x, y) => String(y.date).localeCompare(String(x.date)))[0] || null;
const failedPages = new Map(); // size -> flows
for (const f of (sprint && sprint.failures) || []) {
  const m = /^(\S+)@(\d+x\d+)/.exec(f.where || "");
  if (!m || !all.includes(m[1])) continue;
  if (!failedPages.has(m[2])) failedPages.set(m[2], new Set());
  failedPages.get(m[2]).add(m[1]);
}
const id = T.short(sha), work = join(T.WORK, `publish-${id}`);
const flows = games.flatMap((g) => T.flowsOfGame(g, all, { levels: [1, 2, 3, 4], skipPaths: ["speed1"] }));
const steps = [{ id: "push", what: "tier 0 first (reused when it passed on this commit)", cmd: "node", argv: ["build/tools/tiers/check-push.mjs"], minutes: 3, blocks: true }];
const runs = [];
for (const [size, set] of failedPages) { const run = `tiers-publish-fails-${id}-${size}`; runs.push(run); steps.push({ id: `fails@${size}`, what: `the ${set.size} page(s) that failed in check-sprint ${T.short(sprint.commit)}, again at ${size}`, cmd: "node", argv: ["build/sandbox/run.mjs", "--flow", [...set].join(","), "--sizes", size, "--check", "--no-sheets", "--run-id", run], browser: true, minutes: Math.ceil(set.size * T.CONFIG.secondsPerPage / 60), blocks: false, timeoutMin: 120 }); }
if (flows.length) { const run = `tiers-publish-${id}`; runs.push(run); steps.push({ id: "changed", what: `every changed game (${games.length}) at ${P.size} to its end (${flows.length} flows)`, cmd: "node", argv: ["build/sandbox/run.mjs", "--flow", flows.join(","), "--sizes", P.size, "--check", "--parallel", "3", "--no-sheets", "--run-id", run], browser: true, minutes: Math.ceil(flows.length * T.CONFIG.secondsPerPage / 60 / 2), blocks: false, timeoutMin: 180 }); }
steps.push({ id: "checks-full", what: `checks.mjs ${P.checksArgs.join(" ")}: every fast check, the browser's load check, the parked modes' leak bots`, cmd: "node", argv: ["build/tools/review/checks.mjs", ...P.checksArgs], browser: true, selfLock: true, minutes: 6, blocks: true });
steps.push(...T.extraSteps("publish", { files, games, base }));
const extra = [`since ${T.short(base)} (the last publish), ${files.length} changed file(s); changed games: ${games.join(", ") || "none"}`,
  sprint ? `check-sprint on record: ${T.short(sprint.commit)} (${sprint.ok ? "passed" : `fix list of ${(sprint.failures || []).filter((f) => f.blocks !== false).length}`}); its failed pages run again: ${[...failedPages.values()].reduce((n, s) => n + s.size, 0)}` : "NO check-sprint since the last publish: it blocks (run check-sprint first, or --words with his yes)",
  a.has("go") ? "then: publish.mjs --go (it runs check-live)" : "then: nothing (--go publishes)"];
if (dry) { T.printPlan("check-publish (tier 3b)", steps, extra); process.exit(0); }

mkdirSync(work, { recursive: true });
const r = T.newResult("publish", { base, games, gamesWhy: a.val("games") ? "--games" : `the diff since ${T.short(base)}`, sprint: sprint ? sprint.commit : null, notes: [], artefacts: {} });
const done = await T.runAll(steps, join(work, "logs"));
const fails = [];
for (const run of runs) fails.push(...T.runFailures(T.readRun(T.runPath(run)), all));
fails.push(...T.stepFailures(done));
if (!sprint) fails.push(a.val("words") ? { game: null, check: "check-sprint", what: `none since the last publish; published on his word: ${a.val("words")}`, blocks: false } : { game: null, check: "check-sprint", what: "none since the last publish: run node build/tools/tiers/check-sprint.mjs (or --words with his yes)", blocks: true });
r.failures = fails;
// the known-fails list: what stays open in this publish (Zafar, 9 Nov): the non-blocking failures, and the fix list's open rows
const md = readFileSync(join(T.ROOT, "docs/process/regressions.md"), "utf8");
const openRows = rowBlockers(md), waits = waiting(md);
r.knownFails = [...fails.filter((f) => f.blocks === false), ...(openRows.length ? [{ game: null, check: "fix list", what: `${openRows.length} open rows to fix: ${openRows.join(", ")}`, blocks: false }] : []), ...(waits.length ? [{ game: null, check: "fix list", what: `${waits.length} rows waiting on Mum, art or Zafar: ${waits.join(", ")}`, blocks: false }] : [])];
const kf = join(T.RESULTS, `known-fails-${id}.md`);
mkdirSync(T.RESULTS, { recursive: true });
writeFileSync(kf, `# Known fails published with ${id} (check-publish, ${r.date})\n\n${T.fixListMd(r.knownFails, "Known fails")}`);
r.artefacts = { "known-fails list": T.rel(kf), logs: T.rel(join(work, "logs")) };
const res = T.finish(r, done, t0);
for (const f of (res.failures || []).filter((x) => x.blocks)) console.log(`  BLOCKS ${f.game || ""} ${f.check} ${f.where || ""}: ${f.what}`);
console.log(`known fails: ${r.knownFails.length} (${T.rel(kf)})`);
if (!res.ok) process.exit(1);
if (!a.has("go")) { console.log("check-publish passed: /publish runs it with --go to publish (on Zafar's yes)"); process.exit(0); }
const pass = ["--go", ...(a.has("log") ? ["--log"] : []), ...(a.val("trailer") ? ["--trailer", a.val("trailer")] : []), ...(a.val("words") ? ["--words", a.val("words")] : [])];
// (publish.mjs runs check-live itself once Pages serves the commit)
const pub = spawnSync(process.execPath, ["build/tools/ops/publish.mjs", ...pass], { cwd: T.ROOT, stdio: "inherit" });
process.exit(pub.status || 0);
