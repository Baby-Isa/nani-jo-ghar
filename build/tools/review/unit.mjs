#!/usr/bin/env node
// Runs node --test on the files it is given and exits with its status: the evidence loop's cmd: captures may only start `node build/...`
// (S14 tools: SH-167 and SH-168 prove themselves by their unit tests).  node build/tools/review/unit.mjs build/sandbox/film.test.mjs
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const files = process.argv.slice(2).filter((f) => !f.startsWith("--"));
if (!files.length) { console.error("usage: node build/tools/review/unit.mjs <test files>"); process.exit(2); }
const r = spawnSync(process.execPath, ["--test", ...files], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 });
const n = (k) => Number((new RegExp(`^# ${k} (\\d+)`, "m").exec(r.stdout) || [0, 0])[1]);
console.log(`unit: ${files.length} file(s), ${n("pass")} pass, ${n("fail")} fail`);
if (r.status !== 0) console.log((r.stdout.match(/^\s*not ok.*$/gm) || []).slice(0, 12).join("\n") || r.stderr.slice(0, 600));
process.exit(r.status === 0 ? 0 : 1);
