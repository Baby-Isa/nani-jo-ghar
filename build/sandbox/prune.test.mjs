// Screenshot retention: only runs older than the last approved run go; the approved and current ones stay (cost-and-speed change 8).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, utimesSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pruneSandbox, recordApproved, approvedRun } from "./lib/prune.mjs";

test("prune keeps the approved and current runs and anything newer", () => {
  const root = mkdtempSync(join(tmpdir(), "njg-prune-")), dir = join(root, "sandbox"), file = join(root, "approved.json");
  const mk = (n, t) => { mkdirSync(join(dir, n), { recursive: true }); utimesSync(join(dir, n), t, t); };
  mk("old1", 1000); mk("old2", 2000); mk("approved", 3000); mk("newer", 4000); mk("current", 1500);
  assert.deepEqual(pruneSandbox({ current: "current", dir, approvedFile: file }), [], "no approved run recorded: nothing deleted");
  recordApproved("approved", file); assert.equal(approvedRun(file), "approved");
  assert.deepEqual(pruneSandbox({ current: "current", dir, approvedFile: file, dry: true }).sort(), ["old1", "old2"]);
  assert.ok(existsSync(join(dir, "old1")), "dry run deletes nothing");
  pruneSandbox({ current: "current", dir, approvedFile: file });
  assert.ok(!existsSync(join(dir, "old1")) && !existsSync(join(dir, "old2")));
  assert.ok(existsSync(join(dir, "approved")) && existsSync(join(dir, "newer")) && existsSync(join(dir, "current")));
});
