#!/usr/bin/env node
/*
 * The standard check command (R7): every fast, no-browser check in one run, one line each, exit 1 if any fails.
 *   node build/tools/review/checks.mjs [--only unit,words,bump] [--list]
 * unit   node --test over the shared kit, core, host, css lint, sandbox (the contract checks on fixtures) and review-tool tests
 * leak   the Kutchi leak bots (build/tools/review/leak.mjs) for every config that needs no browser, at every level
 * static the static checks (build/lint/static.mjs): shared-kit identity, design tokens, level ladders, banned forms, privacy, rewards, the bulb; a finding not in build/lint/static-known.json fails
 * words  the word lint's strict gate (check A, string literals in game code) on the folders in build/lint/words-gate.json "enforce";
 *        "ready" folders are reported but not enforced until their engine step reports 0 literals
 * bump   build/bump_version.py --dry-run (every file it would stamp; writes nothing)
 * specs  evidence.mjs --lint-specs: the static pass over build/sandbox/data/evidence.json (no browser; new flags only, a baseline holds the known ones)
 * docs   build/tools/review/docs.mjs (decision 99): the docs' size limits and unique IDs
 * recordings  build/tools/ops/recordings.mjs --check (Zafar, 20 Oct): docs/language/recording-sheet.md is current (regenerate: node build/tools/ops/recordings.mjs)
 * size   build/tools/review/sitesize.mjs (Zafar, 14 Oct): the live site stays under 800 MB (GitHub Pages stops deploying near 1 GB)
 * load   build/tools/review/loadcheck.mjs (decision 68, J11): every Cook station and clinic game page loads only the pictures
 *        in its manifest (never another game's); a browser check, so it runs under the browser lock (B16), about 3 minutes
 * Other browser checks are not run here (one at a time under the lock, rule B16): build/check_stamps.mjs, build/lint/layout.test.mjs, the sandbox
 * (`touched.mjs` prints the command), and the leak bots (`leak.mjs --list`; leak.mjs cook needs a browser).
 */
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { args, help, ROOT } from "./lib/common.mjs";

const a = args();
help(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].replace(/^[\s\S]*?\/\*\n?/, "").replace(/^ \* ?/gm, ""), a);
const only = a.val("only") ? a.val("only").split(",") : ["unit", "words", "static", "leak", "bump", "specs", "docs", "recordings", "size", "load"];
const run = (cmd, argv) => spawnSync(cmd, argv, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 });
const ls = (dir, ok) => readdirSync(join(ROOT, dir)).filter(ok).map((f) => join(dir, f));
const results = [];
const note = (name, ok, text) => { results.push(ok); console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(6)} ${text}`); };

if (only.includes("unit")) {
  const files = [...ls("build", (f) => /^test_shared_.*\.mjs$/.test(f)), ...ls("build/core", (f) => /\.test\.mjs$/.test(f)), ...ls("build/host", (f) => /\.test\.mjs$/.test(f)), "build/lint/css.test.mjs", "build/lint/static.test.mjs", "build/tools/art/artcheck.test.mjs", ...ls("build/sandbox", (f) => /\.test\.mjs$/.test(f)), "build/tools/review/review.test.mjs", "js/clinic/heal/colour-clips.test.mjs", "build/tools/review/evidence.test.mjs", "build/tools/review/lintspecs.test.mjs", "build/tools/review/docs.test.mjs", "build/tools/audio/picker.test.mjs", ...ls("build/tools/ops", (f) => /\.test\.mjs$/.test(f))];
  if (a.has("list")) console.log(files.join("\n"));
  const r = run(process.execPath, ["--test", ...files]);
  const n = (k) => Number((new RegExp(`^# ${k} (\\d+)`, "m").exec(r.stdout) || [0, 0])[1]);
  note("unit", r.status === 0, `${files.length} files, ${n("pass")} pass, ${n("fail")} fail`);
  if (r.status !== 0) console.log((r.stdout.match(/^not ok.*$/gm) || []).slice(0, 8).map((l) => "     " + l).join("\n"));
}
if (only.includes("words")) {
  const gate = JSON.parse(readFileSync(join(ROOT, "build/lint/words-gate.json"), "utf8"));
  const count = (dirs) => { const r = run(process.execPath, ["build/lint/words.mjs", "--only", "a", "--dirs", dirs.join(",")]); const m = /string literals typed in game code: (\d+)/.exec(r.stdout); return m ? Number(m[1]) : NaN; };
  const r = run(process.execPath, ["build/lint/words.mjs", "--strict", "--only", "a", "--dirs", gate.enforce.join(",")]);
  note("words", r.status === 0, `strict on ${gate.enforce.join(", ")}: ${count(gate.enforce)} literals${r.status === 0 ? "" : " (node build/lint/words.mjs --only a --dirs " + gate.enforce.join(",") + " lists them)"}`);
  for (const d of gate.ready) console.log(`     ready, not enforced: ${d} has ${count([d])} literals (build/lint/words-gate.json)`);
}
if (only.includes("static")) {
  // checks-to-build 9, 10, 11, 13, 17, 18, 21: shared-kit identity, tokens, level ladders, banned forms, privacy, rewards, the bulb
  const r = run(process.execPath, ["build/lint/static.mjs"]);
  note("static", r.status === 0, (r.stdout.trim().split("\n").pop() || `static.mjs exited ${r.status}`));
  if (r.status !== 0) console.log((r.stdout.match(/^NEW .*$/gm) || []).slice(0, 10).map((l) => "     " + l).join("\n"));
}
if (only.includes("leak")) {
  // checks-to-build 19 (Zafar, 14 Oct: every level, not only level 1): every leak config that needs no browser (Cook's bot runs in
  // /review), three at a time; a group config whose games all have their own config is skipped; a config with "knownFail" names
  // its fix-list row and is reported, not failed, until that row is fixed
  const { spawn } = await import("node:child_process");
  const dir = join(ROOT, "build/tools/review/leak-configs");
  const cfgs = readdirSync(dir).filter((x) => x.endsWith(".json")).sort().map((f) => JSON.parse(readFileSync(join(dir, f), "utf8"))).filter((c) => !c.browser && c.id !== "cook");
  const single = new Set(cfgs.filter((c) => (c.games || []).length === 1).map((c) => c.games[0]));
  const todo = cfgs.filter((c) => !((c.games || []).length > 1 && c.games.every((g) => single.has(g))));
  const bad = [], known = [];
  const one = (cfg) => new Promise((res) => {
    const extra = cfg.adapter === "script" ? (cfg.id === "clinic" ? ["--rounds", "100"] : []) : ["--rounds", "500", "--l1", "1000"];
    const p = spawn("timeout", ["300", process.execPath, "build/tools/review/leak.mjs", cfg.id, ...extra], { cwd: ROOT });
    let out = ""; p.stdout.on("data", (d) => (out += d));
    p.on("close", (code) => { if (code !== 0) (cfg.knownFail ? known : bad).push(`${cfg.id}${cfg.knownFail ? ` (${cfg.knownFail})` : `: ${(out.match(/^\s+\S.*(wins|blind|FAIL).*$/m) || [`exit ${code}`])[0].trim().slice(0, 120)}`}`); res(); });
  });
  const queue = [...todo];
  await Promise.all([0, 1, 2].map(async () => { while (queue.length) await one(queue.shift()); }));
  note("leak", !bad.length, bad.length ? `${bad.length} leak(s): ${bad.join("; ")}` : `${todo.length} configs at every level${known.length ? `; known: ${known.join("; ")}` : ""}`);
}
if (only.includes("bump")) {
  const r = run("python3", ["build/bump_version.py", "--dry-run"]);
  note("bump", r.status === 0 && !/Traceback/.test(r.stderr), r.status === 0 ? `dry run lists ${((r.stdout.split("\n")[0].match(/\.html|\.css|\.js/g)) || []).length} files, ${(/import map: (\d+) modules/.exec(r.stdout) || [0, "?"])[1]} modules` : "bump_version.py failed");
}
if (only.includes("specs")) {
  const r = run(process.execPath, ["build/tools/review/evidence.mjs", "--lint-specs"]);
  note("specs", r.status === 0, (r.stdout.trim().split("\n").find((l) => /^lint-specs:/.test(l)) || `lint-specs exited ${r.status}`));
  if (r.status !== 0) console.log((r.stdout.match(/^ {2}NEW .*$/gm) || []).slice(0, 10).map((l) => "     " + l.trim()).join("\n"));
}
if (only.includes("docs")) {
  const r = run(process.execPath, ["build/tools/review/docs.mjs"]);
  note("docs", r.status === 0, (r.stdout.trim().split("\n").pop() || `docs.mjs exited ${r.status}`));
  if (r.status !== 0) console.log((r.stdout.match(/^FAIL .*$/gm) || []).slice(0, 10).map((l) => "     " + l).join("\n"));
}
if (only.includes("recordings")) {
  const r = run(process.execPath, ["build/tools/ops/recordings.mjs", "--check"]);
  note("recordings", r.status === 0, ((r.status === 0 ? r.stdout : r.stderr || r.stdout).trim().split("\n").pop()) || `recordings.mjs exited ${r.status}`);
}
if (only.includes("size")) {
  const r = run(process.execPath, ["build/tools/review/sitesize.mjs"]);
  note("size", r.status === 0, (r.stdout.trim().split("\n").pop() || `sitesize.mjs exited ${r.status}`));
}
if (only.includes("load")) {
  const r = run("flock", ["-w", "1800", "/tmp/njg-browser.lock", "timeout", "900", process.execPath, "build/tools/review/loadcheck.mjs"]);
  const last = (r.stdout.trim().split("\n").pop() || "").trim();
  note("load", r.status === 0, last || `loadcheck exited ${r.status}`);
  if (r.status !== 0) console.log((r.stdout.match(/^(FAIL.*|\s{7}assets\/.*)$/gm) || []).slice(0, 10).map((l) => "     " + l.trim()).join("\n"));
}
process.exit(results.every(Boolean) ? 0 : 1);
