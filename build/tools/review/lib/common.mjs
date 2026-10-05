// Shared helpers for the review tools: repo paths, run folders, argument parsing, short printing.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
export const RUNS = join(ROOT, "build", "screenshots", "sandbox");
export const TOOLS = join(ROOT, "build", "tools", "review");
export const rel = (p) => p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p;

export function args(argv = process.argv.slice(2)) {
  const flags = new Map(), pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split(/=(.*)/s);
      if (v !== undefined) flags.set(k, v);
      else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) flags.set(k, argv[++i]);
      else flags.set(k, true);
    } else pos.push(a);
  }
  return { has: (k) => flags.has(k), val: (k, d = null) => (flags.has(k) && flags.get(k) !== true ? flags.get(k) : d), pos };
}
// a run id or a path -> the run folder; no id -> the newest run that has screenshots
export function runDir(idOrPath) {
  if (idOrPath) {
    const p = existsSync(idOrPath) ? resolve(idOrPath) : join(RUNS, idOrPath);
    if (!existsSync(p)) throw new Error(`No run "${idOrPath}" (looked in ${rel(RUNS)}).`);
    return p;
  }
  if (!existsSync(RUNS)) throw new Error(`No sandbox runs yet under ${rel(RUNS)}. Run build/sandbox/run.mjs first.`);
  const runs = readdirSync(RUNS).map((n) => join(RUNS, n)).filter((p) => statSync(p).isDirectory() && existsSync(join(p, "data"))).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (!runs.length) throw new Error("No sandbox runs found.");
  return runs[0];
}
export function help(text, a = args()) {
  if (a.has("help") || a.has("h")) { console.log(text.trim()); process.exit(0); }
}
export function die(msg, code = 2) { console.error(msg); process.exit(code); }
export const more = (list, n, fmt) => { for (const x of list.slice(0, n)) console.log(fmt(x)); if (list.length > n) console.log(`  ... and ${list.length - n} more`); };
