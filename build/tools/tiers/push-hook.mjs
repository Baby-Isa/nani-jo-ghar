#!/usr/bin/env node
// The push hook (.claude/settings.json, PreToolUse on Bash; Zafar, 9 Nov: "Tier 0 refuses the push when it fails ... so it never
// depends on remembering"): a Bash command that runs `git push` first runs check-push in the repo it pushes from; a failure blocks
// the command (exit 2, the reason on stderr for Claude to read). Any other command passes untouched.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

// is this a push? (git push, git -C <dir> push; not a --dry-run, not --help)
export function pushOf(cmd) {
  if (/\bNJG_ROLLBACK=1\b/.test(cmd || "")) return null; // check-live's roll-back of main to the last good publish: never held up
  const m = /(?:^|[;&|(]\s*|\s)git((?:\s+-C\s+\S+|\s+-c\s+\S+)*)\s+push\b([^;&|\n]*)/.exec(cmd || "");
  if (!m || /--dry-run|(^|\s)-n(\s|$)|--help/.test(m[2])) return null;
  const c = /-C\s+(\S+)/.exec(m[1] || "");
  const cd = /(?:^|[;&]\s*)cd\s+("[^"]+"|'[^']+'|\S+)\s*&&[^;]*\bgit\b/.exec(cmd);
  return { dir: c ? c[1] : cd ? cd[1].replace(/^["']|["']$/g, "") : null };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let input = {};
  try { input = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch (e) { process.exit(0); }
  const cmd = input.tool_input && input.tool_input.command;
  const p = pushOf(cmd);
  if (!p) process.exit(0);
  const from = p.dir || input.cwd || process.cwd();
  const top = spawnSync("git", ["-C", from, "rev-parse", "--show-toplevel"], { encoding: "utf8" });
  if (top.status !== 0) process.exit(0); // not a repo: git itself will say so
  const root = top.stdout.trim();
  const tool = join(root, "build/tools/tiers/check-push.mjs");
  const argv = existsSync(tool) ? [tool] : existsSync(join(root, "build/tools/review/checks.mjs")) ? [join(root, "build/tools/review/checks.mjs")] : null;
  if (!argv) process.exit(0); // another repo
  const r = spawnSync(process.execPath, argv, { cwd: root, encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.status === 0) { process.stdout.write((r.stdout || "").split("\n").filter(Boolean).slice(-1)[0] + "\n"); process.exit(0); }
  process.stderr.write(`Push refused: check-push (tier 0) failed in ${root}. Fix what it names, commit, and push again.\n${(r.stdout || "").split("\n").filter((l) => /^(FAIL|\s{2}FAIL|\s{5,}\S|check-push)/.test(l)).slice(0, 25).join("\n")}\n${(r.stderr || "").slice(-600)}`);
  process.exit(2);
}
