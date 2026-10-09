#!/usr/bin/env node
/*
 * The standard check command (R7): every fast, no-browser check in one run, one line each, exit 1 if any fails.
 *   node build/tools/review/checks.mjs [--only unit,words,bump] [--list]
 * unit   node --test over the shared kit, core, host, css lint, sandbox (the contract checks on fixtures) and review-tool tests
 * words  the word lint's strict gate (check A, string literals in game code) on the folders in build/lint/words-gate.json "enforce";
 *        "ready" folders are reported but not enforced until their engine step reports 0 literals
 * bump   build/bump_version.py --dry-run (every file it would stamp; writes nothing)
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
const only = a.val("only") ? a.val("only").split(",") : ["unit", "words", "bump", "load"];
const run = (cmd, argv) => spawnSync(cmd, argv, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 });
const ls = (dir, ok) => readdirSync(join(ROOT, dir)).filter(ok).map((f) => join(dir, f));
const results = [];
const note = (name, ok, text) => { results.push(ok); console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(6)} ${text}`); };

if (only.includes("unit")) {
  const files = [...ls("build", (f) => /^test_shared_.*\.mjs$/.test(f)), ...ls("build/core", (f) => /\.test\.mjs$/.test(f)), ...ls("build/host", (f) => /\.test\.mjs$/.test(f)), "build/lint/css.test.mjs", ...ls("build/sandbox", (f) => /\.test\.mjs$/.test(f)), "build/tools/review/review.test.mjs"];
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
if (only.includes("bump")) {
  const r = run("python3", ["build/bump_version.py", "--dry-run"]);
  note("bump", r.status === 0 && !/Traceback/.test(r.stderr), r.status === 0 ? `dry run lists ${((r.stdout.split("\n")[0].match(/\.html|\.css|\.js/g)) || []).length} files, ${(/import map: (\d+) modules/.exec(r.stdout) || [0, "?"])[1]} modules` : "bump_version.py failed");
}
if (only.includes("load")) {
  const r = run("flock", ["-w", "1800", "/tmp/njg-browser.lock", "timeout", "900", process.execPath, "build/tools/review/loadcheck.mjs"]);
  const last = (r.stdout.trim().split("\n").pop() || "").trim();
  note("load", r.status === 0, last || `loadcheck exited ${r.status}`);
  if (r.status !== 0) console.log((r.stdout.match(/^(FAIL.*|\s{7}assets\/.*)$/gm) || []).slice(0, 10).map((l) => "     " + l.trim()).join("\n"));
}
process.exit(results.every(Boolean) ? 0 : 1);
