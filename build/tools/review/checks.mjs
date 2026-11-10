#!/usr/bin/env node
/*
 * The standard check command (R7): every fast, no-browser check in one run, one line each, exit 1 if any fails.
 * Tier 0 of the check tiers (docs/process/qa-checklist.md): build/tools/tiers/check-push.mjs runs it, and the push hook
 * (.claude/settings.json) runs check-push before every `git push`, refusing the push when it fails; every other tier's tool runs it first.
 *   node build/tools/review/checks.mjs [--only unit,words,bump] [--list]
 * unit   node --test over the shared kit, core, host, css lint, sandbox (the contract checks on fixtures) and review-tool tests
 * leak   the Kutchi leak bots (build/tools/review/leak.mjs) for every config that needs no browser, at every level; the parked modes'
 *        (PARKED below: they do not change while parked) only with --full or when their own files changed since the merge-base
 * static the static checks (build/lint/static.mjs): shared-kit identity, design tokens, level ladders, banned forms, privacy, rewards, one hint-wait table, fonts (SH-224); a finding not in build/lint/static-known.json fails
 * words  the word lint's strict gate (check A, string literals in game code) on the folders in build/lint/words-gate.json "enforce";
 *        "ready" folders are reported but not enforced until their engine step reports 0 literals
 * bump   build/bump_version.py --dry-run (every file it would stamp; writes nothing)
 * specs  evidence.mjs --lint-specs: the static pass over build/sandbox/data/evidence.json (no browser; new flags only, a baseline holds the known ones)
 * docs   build/tools/review/docs.mjs (decision 99): the docs' size limits and unique IDs
 * stdids build/tools/review/stdids.mjs --check: every source ID placed once in the standard's placement.md, every cited rule defined
 * decisions every answered decision list's rows carry his answer (docs/decisions/, Zafar 9 Nov)
 * fixlist  every open row on the fix list starts its status with one label (to fix: code / to fix: check / waiting on Zafar / Mum / art, before app store; Zafar, 21 Oct)
 * recordings  build/tools/ops/recordings.mjs --check (Zafar, 20 Oct): docs/language/recording-sheet.md is current (regenerate: node build/tools/ops/recordings.mjs)
 * art    build/tools/art/artcolour.py --changed (Fable's view, 6 Nov): the colour and look checks on the pictures changed since the merge-base
 *        with origin/main (HEAD~1 on main), so no pack lands unmeasured; FAIL only on a FAIL (a baked shadow); flags are counted, not failed
 * size   build/tools/review/sitesize.mjs (Zafar, 14 Oct): the live site stays under 800 MB (GitHub Pages stops deploying near 1 GB)
 * load   (--browser or --full) build/tools/review/loadcheck.mjs (decision 68, J11): every Cook station and clinic game page loads only
 *        the pictures in its manifest (never another game's); a browser check under /tmp/njg-browser-all.lock (the one lock every
 *        browser run takes; it was /tmp/njg-browser.lock, which no other run took), about 3 minutes; /review and the publish gate run it
 * Other browser checks are not run here (one at a time under the lock, rule B16): build/check_stamps.mjs, build/lint/layout.test.mjs, the sandbox
 * (`touched.mjs` prints the command), and the leak bots (`leak.mjs --list`; leak.mjs cook needs a browser).
 * Cook's mount test (C4), whenever js/cook/** or js/shared/buttons.js changes (COOK-16; its result goes in the sprint's review report):
 *    COOK_TEST_PORT=8818 flock -w 1800 /tmp/njg-browser-all.lock timeout 600 node build/test_cook_mount.mjs
 * Known until the shared sweep handles them (watch only that the counts stop growing): one sfx AudioContext (js/shared/sfx.js's page-level
 * one), the conversations / voice safety timers (3-6 s), the shared kits' one-time page listeners and <body> element.
 */
import { spawn, spawnSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { args, help, ROOT, locked } from "./lib/common.mjs";

const a = args();
help(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace(/^[\s\S]*?\/\*\n?/, "").replace(/^ \* ?/gm, ""), a);
const FULL = a.has("full");
const STEPS = ["unit", "words", "static", "leak", "bump", "specs", "docs", "stdids", "recordings", "fixlist", "decisions", "art", "size", "load"];
// the steps a run does: --only's, else every step but the browser's load check unless --browser or --full
export const pick = ({ only = null, full = false, browser = false } = {}) => (only ? only.split(",") : STEPS.filter((s) => s !== "load" || full || browser));
const only = pick({ only: a.val("only"), full: FULL, browser: a.has("browser") });
// the parked modes (docs/game-design/modes: parked; their code does not change while parked): their leak bots run with --full
export const PARKED = ["snap", "tidy", "who", "dress", "monsoon", "find"];
// a step's command, run without blocking the others -> {status, stdout, stderr}
const go = (cmd, argv) => new Promise((res) => {
  const p = spawn(cmd, argv, { cwd: ROOT });
  let stdout = "", stderr = "";
  p.stdout.on("data", (d) => (stdout += d));
  p.stderr.on("data", (d) => (stderr += d));
  p.on("close", (status) => res({ status, stdout, stderr }));
});
const ls = (dir, ok) => readdirSync(join(ROOT, dir)).filter(ok).map((f) => join(dir, f));
const results = [];
const steps = {};
const line = (name, ok, text, more = [], note = []) => ({ name, ok, text, more, note });

// the unit test files (the art block's tests read sources/art/, which a builder's worktree does not have: left out there, and said so)
export const unitFiles = (noSources = !existsSync(join(ROOT, "sources", "art"))) => [...ls("build", (f) => /^test_shared_.*\.mjs$/.test(f)), ...ls("build/core", (f) => /\.test\.mjs$/.test(f)), ...ls("build/host", (f) => /\.test\.mjs$/.test(f)), "build/test_day_book.mjs", "build/lint/css.test.mjs", "build/lint/static.test.mjs", ...(noSources ? [] : ["build/tools/art/artcheck.test.mjs"]), ...ls("build/sandbox", (f) => /\.test\.mjs$/.test(f)), "build/tools/review/review.test.mjs", "js/clinic/heal/colour-clips.test.mjs", "build/tools/review/evidence.test.mjs", "build/tools/review/lintspecs.test.mjs", "build/tools/review/docs.test.mjs", "build/tools/review/standard.test.mjs", "build/tools/review/checks.test.mjs", "build/tools/review/sidebyside.test.mjs", "build/tools/audio/picker.test.mjs", ...ls("build/tools/ops", (f) => /\.test\.mjs$/.test(f)), ...ls("build/tools/tiers", (f) => /\.test\.mjs$/.test(f))];
steps.unit = async () => {
  const noSources = !existsSync(join(ROOT, "sources", "art"));
  const files = unitFiles(noSources);
  if (a.has("list")) console.log(files.join("\n"));
  const r = await go(process.execPath, ["--test", ...files]);
  const n = (k) => Number((new RegExp(`^# ${k} (\\d+)`, "m").exec(r.stdout) || [0, 0])[1]);
  return line("unit", r.status === 0, `${files.length} files, ${n("pass")} pass, ${n("fail")} fail${noSources ? " (no sources/ here: the art block's tests left out)" : ""}`, r.status !== 0 ? (r.stdout.match(/^not ok.*$/gm) || []).slice(0, 8) : []);
};
steps.words = async () => {
  const gate = JSON.parse(readFileSync(join(ROOT, "build/lint/words-gate.json"), "utf8"));
  const count = async (dirs) => { const r = await go(process.execPath, ["build/lint/words.mjs", "--only", "a", "--dirs", dirs.join(",")]); const m = /string literals typed in game code: (\d+)/.exec(r.stdout); return m ? Number(m[1]) : NaN; };
  const [r, n, ready] = await Promise.all([go(process.execPath, ["build/lint/words.mjs", "--strict", "--only", "a", "--dirs", gate.enforce.join(",")]), count(gate.enforce), Promise.all(gate.ready.map(async (d) => [d, await count([d])]))]);
  return line("words", r.status === 0, `strict on ${gate.enforce.join(", ")}: ${n} literals${r.status === 0 ? "" : " (node build/lint/words.mjs --only a --dirs " + gate.enforce.join(",") + " lists them)"}`, [], ready.map(([d, c]) => `ready, not enforced: ${d} has ${c} literals (build/lint/words-gate.json)`));
};
steps.static = async () => {
  // checks-to-build 9, 10, 11, 13, 17, 18, 21: shared-kit identity, tokens, level ladders, banned forms, privacy, rewards, one hint-wait table
  const r = await go(process.execPath, ["build/lint/static.mjs"]);
  return line("static", r.status === 0, r.stdout.trim().split("\n").pop() || `static.mjs exited ${r.status}`, r.status !== 0 ? (r.stdout.match(/^NEW .*$/gm) || []).slice(0, 10) : []);
};
steps.leak = async () => {
  // checks-to-build 19 (Zafar, 14 Oct: every level, not only level 1): every leak config that needs no browser (Cook's bot runs in
  // /review), three at a time; a group config whose games all have their own config is skipped; a config with "knownFail" names
  // its fix-list row and is reported, not failed, until that row is fixed; a parked mode's bot runs with --full, or when its files changed
  const dir = join(ROOT, "build/tools/review/leak-configs");
  const cfgs = readdirSync(dir).filter((x) => x.endsWith(".json")).sort().map((f) => JSON.parse(readFileSync(join(dir, f), "utf8"))).filter((c) => !c.browser && c.id !== "cook");
  const single = new Set(cfgs.filter((c) => (c.games || []).length === 1).map((c) => c.games[0]));
  let todo = cfgs.filter((c) => !((c.games || []).length > 1 && c.games.every((g) => single.has(g))));
  const changed = FULL ? null : changedFiles();
  const parked = todo.filter((c) => PARKED.includes(c.id) && !(changed || []).some((f) => f.startsWith(`js/${c.id}/`) || f.includes(`/${c.id}.`) || f === `build/tools/review/leak-games/${c.id}.mjs`));
  if (!FULL) todo = todo.filter((c) => !parked.includes(c));
  const bad = [], known = [];
  const one = async (cfg) => {
    const extra = cfg.adapter === "script" ? (cfg.id === "clinic" ? ["--rounds", "100"] : []) : ["--rounds", "500", "--l1", "1000"];
    const r = await go("timeout", ["300", process.execPath, "build/tools/review/leak.mjs", cfg.id, ...extra]);
    if (r.status !== 0) (cfg.knownFail ? known : bad).push(`${cfg.id}${cfg.knownFail ? ` (${cfg.knownFail})` : `: ${(r.stdout.match(/^\s+\S.*(wins|blind|FAIL).*$/m) || [`exit ${r.status}`])[0].trim().slice(0, 120)}`}`);
  };
  const queue = [...todo].sort((x, y) => (y.id === "clinic") - (x.id === "clinic"));
  await Promise.all([0, 1, 2].map(async () => { while (queue.length) await one(queue.shift()); }));
  return line("leak", !bad.length, bad.length ? `${bad.length} leak(s): ${bad.join("; ")}` : `${todo.length} configs at every level${known.length ? `; known: ${known.join("; ")}` : ""}${!FULL && parked.length ? `; parked, --full runs them: ${parked.map((c) => c.id).join(", ")}` : ""}`);
};
steps.bump = async () => {
  const r = await go("python3", ["build/bump_version.py", "--dry-run"]);
  return line("bump", r.status === 0 && !/Traceback/.test(r.stderr), r.status === 0 ? `dry run lists ${((r.stdout.split("\n")[0].match(/\.html|\.css|\.js/g)) || []).length} files, ${(/import map: (\d+) modules/.exec(r.stdout) || [0, "?"])[1]} modules` : "bump_version.py failed");
};
steps.specs = async () => {
  const r = await go(process.execPath, ["build/tools/review/evidence.mjs", "--lint-specs"]);
  return line("specs", r.status === 0, r.stdout.trim().split("\n").find((l) => /^lint-specs:/.test(l)) || `lint-specs exited ${r.status}`, r.status !== 0 ? (r.stdout.match(/^ {2}NEW .*$/gm) || []).slice(0, 10).map((l) => l.trim()) : []);
};
steps.docs = async () => {
  const r = await go(process.execPath, ["build/tools/review/docs.mjs"]);
  return line("docs", r.status === 0, r.stdout.trim().split("\n").pop() || `docs.mjs exited ${r.status}`, r.status !== 0 ? (r.stdout.match(/^FAIL .*$/gm) || []).slice(0, 10) : []);
};
steps.stdids = async () => {
  // the standard's mechanical ID check (it ran only by hand "after a change to the standard folder"; s19-checks: 1 s, so it runs itself)
  const r = await go(process.execPath, ["build/tools/review/stdids.mjs", "--check"]);
  return line("stdids", r.status === 0, (r.stdout.split("\n")[0] || `stdids.mjs exited ${r.status}`).trim(), r.status !== 0 ? (r.stdout.match(/^ {2}(?!note: ).*$/gm) || []).slice(0, 8).map((l) => l.trim()) : []);
};
steps.decisions = async () => {
  // Zafar, 9 Nov: his answers to a decision list go onto the rows they name (build/tools/ops/decisions.mjs; docs/decisions/)
  const r = await go(process.execPath, ["build/tools/ops/decisions.mjs", "--check"]);
  const out = r.stdout.trim().split("\n");
  return line("decisions", r.status === 0, out[0] || `decisions.mjs exited ${r.status}`, r.status !== 0 ? out.slice(1, 9).map((l) => l.trim()) : []);
};
steps.fixlist = async () => {
  const { unlabelled } = await import("../ops/publishgate.mjs");
  const ids = unlabelled(readFileSync(join(ROOT, "docs/process/regressions.md"), "utf8"));
  return line("fixlist", !ids.length, ids.length ? `${ids.length} open rows with no label (to fix: code/check, waiting on Zafar/Mum/art): ${ids.slice(0, 12).join(", ")}${ids.length > 12 ? " ..." : ""}` : "every open row is labelled");
};
steps.recordings = async () => {
  const r = await go(process.execPath, ["build/tools/ops/recordings.mjs", "--check"]);
  return line("recordings", r.status === 0, ((r.status === 0 ? r.stdout : r.stderr || r.stdout).trim().split("\n").pop()) || `recordings.mjs exited ${r.status}`);
};
steps.art = async () => {
  const r = await go("python3", ["build/tools/art/artcolour.py", "--changed", "--quiet"]);
  const out = r.stdout.trim().split("\n");
  const sum = out.find((l) => /^\d+ picture\(s\): /.test(l)) || out.find((l) => /^no picture changed/.test(l)) || r.stderr.trim().split("\n").pop() || `artcolour.py exited ${r.status}`;
  return line("art", r.status === 0, sum + (r.status === 1 ? " (python3 build/tools/art/artcolour.py --changed lists them)" : ""), r.status === 1 ? out.filter((l) => /^FAIL|^\s+FAIL/.test(l)).slice(0, 10).map((l) => l.trim()) : []);
};
steps.size = async () => {
  const r = await go(process.execPath, ["build/tools/review/sitesize.mjs"]);
  return line("size", r.status === 0, r.stdout.trim().split("\n").pop() || `sitesize.mjs exited ${r.status}`);
};
steps.load = async () => {
  // (under the one browser lock, taken here unless the caller holds it already: a nested flock would wait for itself)
  const cmd = locked(["timeout", "900", process.execPath, "build/tools/review/loadcheck.mjs"], { wait: 1800 });
  const r = await go(cmd[0], cmd.slice(1));
  const last = (r.stdout.trim().split("\n").pop() || "").trim();
  return line("load", r.status === 0, last || `loadcheck exited ${r.status}`, r.status !== 0 ? (r.stdout.match(/^(FAIL.*|\s{7}assets\/.*)$/gm) || []).slice(0, 10).map((l) => l.trim()) : []);
};

// the files changed since the merge-base with origin/main (HEAD~1 on main), committed or not
function changedFiles() {
  const git = (...g) => { const r = spawnSync("git", g, { cwd: ROOT, encoding: "utf8" }); return r.status === 0 ? r.stdout.trim() : ""; };
  const base = git("merge-base", "HEAD", "origin/main") || git("rev-parse", "HEAD~1");
  return [...new Set([...git("diff", "--name-only", base).split("\n"), ...git("ls-files", "--others", "--exclude-standard").split("\n")].filter(Boolean))];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const t0 = Date.now();
  const names = STEPS.filter((s) => only.includes(s));
  const done = await Promise.all(names.map(async (s) => { const t = Date.now(); const r = await steps[s]().catch((e) => line(s, false, `${s} threw: ${e.message}`)); r.s = Math.round((Date.now() - t) / 1000); return r; }));
  for (const r of done) {
    results.push(r.ok);
    console.log(`${r.ok ? "ok  " : "FAIL"} ${r.name.padEnd(6)} ${r.text}`);
    for (const m of r.more || []) console.log("     " + m);
    for (const m of r.note || []) console.log("     " + m);
  }
  if (!only.includes("load") && !a.val("only")) console.log(`     not run: load (a browser; --browser or --full runs it, /review and the publish gate do)`);
  const slow = done.slice().sort((x, y) => y.s - x.s).slice(0, 3).map((r) => `${r.name} ${r.s} s`).join(", ");
  console.log(`checks: ${names.length} steps in ${Math.round((Date.now() - t0) / 1000)} s (all at once; the longest: ${slow})`);
  process.exit(results.every(Boolean) ? 0 : 1);
}
