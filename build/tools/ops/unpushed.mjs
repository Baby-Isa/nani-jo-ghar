#!/usr/bin/env node
// Hook (PostToolUse, wired in .claude/settings.json): warns when work has gone 30 minutes unpushed (cost-and-speed change 7: a limit
// costs minutes, not a day). Prints a PostToolUse additionalContext line for Claude at 30 minutes; at 45 it blocks (decision: block).
//   node build/tools/ops/unpushed.mjs [--minutes 30] [--check]   --check: print the minutes unpushed and exit 0 (no JSON, no throttle)
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const argv = process.argv.slice(2);
const LIMIT = +(argv[argv.indexOf("--minutes") + 1] || 30);
const git = (...a) => { const r = spawnSync("git", a, { encoding: "utf8" }); return r.status === 0 ? r.stdout.trim() : ""; };

// minutes since the oldest piece of unpushed work: the oldest commit not on the upstream, else the oldest modified tracked file
export function minutesUnpushed(now = Date.now(), g = git) {
  const up = g("rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}");
  const times = [];
  const commits = up ? g("log", `${up}..HEAD`, "--format=%ct") : "";
  for (const t of commits.split("\n").filter(Boolean)) times.push(+t * 1000);
  const dirty = g("status", "--porcelain", "-uno").split("\n").filter(Boolean).map((l) => l.slice(3));
  for (const f of dirty) { try { times.push(statSync(f).mtimeMs); } catch (e) { /* deleted */ } }
  return times.length ? Math.round((now - Math.min(...times)) / 60000) : 0;
}
export const warning = (m, limit = LIMIT) => (m >= limit ? `UNPUSHED ${m} min: commit and push the branch now (git pull --rebase, then git push; a usage limit loses unpushed work). Rule: push every 30-40 minutes.` : "");

// checks-to-build 23: at 45 minutes it is no longer a hint: the hook blocks (Claude is told to push before going on)
export const BLOCK_AT = 45;
export function hookOutput(m, w = warning(m)) {
  if (!w) return null;
  if (m >= BLOCK_AT) return { decision: "block", reason: `${w} (${BLOCK_AT} minutes: push before anything else)` };
  return { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: w } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const m = minutesUnpushed();
  if (argv.includes("--check")) { console.log(`${m} minutes unpushed`); process.exit(0); }
  const w = warning(m);
  const stamp = join(tmpdir(), "njg-unpushed-warned");
  let last = 0; try { last = +readFileSync(stamp, "utf8"); } catch (e) { /* first time */ }
  if (w && Date.now() - last > 10 * 60000) { // at most one warning in ten minutes
    try { writeFileSync(stamp, String(Date.now())); } catch (e) { /* read-only tmp */ }
    console.log(JSON.stringify(hookOutput(m, w)));
  }
  process.exit(0);
}
