#!/usr/bin/env node
/*
 * The live site's size (Zafar, 14 Oct): GitHub Pages stops deploying a site near 1 GB, so this fails past the limit.
 *   node build/tools/review/sitesize.mjs [--limit-mb 800]
 * Counts every tracked file Jekyll publishes: not under a folder in _config.yml "exclude", and no path part starting with "." or "_".
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { args, ROOT } from "./lib/common.mjs";

const a = args();
const limit = Number(a.val("limit-mb", 800));
const cfg = join(ROOT, "_config.yml");
const exclude = existsSync(cfg) ? [...readFileSync(cfg, "utf8").replace(/^[\s\S]*?^exclude:\s*$/m, "").matchAll(/^\s+-\s+(\S+)\s*$/gm)].map((m) => m[1].replace(/\/$/, "")) : [];
const files = spawnSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 }).stdout.split("\0").filter(Boolean);
const served = files.filter((f) => !exclude.some((x) => f === x || f.startsWith(x + "/")) && !f.split("/").some((p) => /^[._]/.test(p)));
const bytes = served.reduce((s, f) => { try { return s + statSync(join(ROOT, f)).size; } catch { return s; } }, 0);
const mb = Math.round(bytes / 1e6);
const ok = mb <= limit;
console.log(`${ok ? "ok" : "FAIL"}: live site ${mb} MB in ${served.length} files (limit ${limit} MB; excluded: ${exclude.join(", ") || "nothing"})`);
process.exit(ok ? 0 : 1);
