import { test } from "node:test";
import assert from "node:assert/strict";
import { minutesUnpushed, warning } from "./unpushed.mjs";

test("unpushed work older than the limit warns", () => {
  const now = 10_000_000_000;
  const g = (...a) => (a[0] === "rev-parse" ? "origin/b" : a[0] === "log" ? `${(now - 45 * 60000) / 1000}\n${(now - 5 * 60000) / 1000}` : "");
  assert.equal(minutesUnpushed(now, g), 45);
  assert.match(warning(45), /UNPUSHED 45 min/);
  assert.equal(warning(10), "");
});
test("nothing unpushed is zero minutes", () => {
  assert.equal(minutesUnpushed(Date.now(), () => ""), 0);
});
test("at 45 minutes the hook blocks, under it only a hint (checks-to-build 23)", async () => {
  const { hookOutput } = await import("./unpushed.mjs");
  assert.equal(hookOutput(10), null);
  assert.equal(hookOutput(35).hookSpecificOutput.hookEventName, "PostToolUse");
  assert.equal(hookOutput(45).decision, "block");
  assert.match(hookOutput(50).reason, /push before anything else/);
});
test("in a builder's worktree (merged by the orchestrator, never pushed) it stays a hint", async () => {
  const { hookOutput, inWorktree } = await import("./unpushed.mjs");
  assert.equal(hookOutput(60, undefined, { worktree: true }).hookSpecificOutput.hookEventName, "PostToolUse");
  assert.equal(inWorktree((...a) => (a[1] === "--git-dir" ? "/r/.git/worktrees/x" : "/r/.git")), true);
  assert.equal(inWorktree((...a) => (a[1] === "--git-dir" ? ".git" : ".git")), false);
});
