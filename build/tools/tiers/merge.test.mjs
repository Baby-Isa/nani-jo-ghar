// merge.mjs in a scratch repo with a stub gate: a pass merges and puts the gate line in the commit; a fail aborts. node --test
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync, cpSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { gamesFor, gateLineOf } from "./merge.mjs";

test("games for a change: the games it reaches, or the shared ones past the cap", () => {
  const gf = (fl) => [...new Set(fl.map((f) => f.split("@")[0]))];
  const k = (g) => g.replace(/^cook:/, "");
  assert.deepEqual(gamesFor(["cook:chop", "cook:chop@L2"], [], { maxGames: 2, sharedGames: ["cook:chai-tray"] }, gf, k), ["chop"]);
  assert.deepEqual(gamesFor(["cook:a", "cook:b", "cook:c"], [], { maxGames: 2, sharedGames: ["cook:chai-tray"] }, gf, k), ["chai-tray"]);
  assert.deepEqual(gamesFor([], [], { maxGames: 2, sharedGames: [] }, gf, k), []);
  assert.equal(gateLineOf("x\nGATE PASS chai: a pass 1; 1 min\n"), "GATE PASS chai: a pass 1; 1 min");
});

function scratch() {
  const d = mkdtempSync(join(tmpdir(), "njg-merge-"));
  const sh = (...a) => spawnSync("git", a, { cwd: d, encoding: "utf8" });
  sh("init", "-q", "-b", "main"); sh("config", "user.email", "t@t"); sh("config", "user.name", "t");
  mkdirSync(join(d, "build/tools/tiers"), { recursive: true }); mkdirSync(join(d, "build/tools/review/lib"), { recursive: true });
  for (const f of ["merge.mjs", "lib.mjs", "tiers.json"]) cpSync(join(import.meta.dirname, f), join(d, "build/tools/tiers", f));
  cpSync(join(import.meta.dirname, "../review/lib"), join(d, "build/tools/review/lib"), { recursive: true });
  writeFileSync(join(d, "package.json"), "{\"type\":\"module\"}");
  writeFileSync(join(d, "a.txt"), "a\n"); sh("add", "."); sh("commit", "-qm", "base");
  return { d, sh };
}
const stub = (d, ok) => { writeFileSync(join(d, "stub.mjs"), `console.log("GATE ${ok ? "PASS" : "FAIL"} none: stub; 0 min"); process.exit(${ok ? 0 : 1});`); };
const run = (d, ...x) => spawnSync(process.execPath, [join(d, "build/tools/tiers/merge.mjs"), ...x], { cwd: d, encoding: "utf8" });

test("a passing gate merges with its line in the message; a failing gate aborts and leaves the branch as it was", () => {
  const { d, sh } = scratch();
  sh("checkout", "-qb", "good"); writeFileSync(join(d, "g.txt"), "g\n"); sh("add", "."); sh("commit", "-qm", "good");
  sh("checkout", "-q", "main"); sh("checkout", "-qb", "bad"); writeFileSync(join(d, "b.txt"), "b\n"); sh("add", "."); sh("commit", "-qm", "bad");
  sh("checkout", "-q", "main");
  stub(d, false);
  const r1 = run(d, "bad", "--game", "none", "--gate-script", join(d, "stub.mjs"));
  assert.equal(r1.status, 1); assert.match(r1.stderr, /REFUSED/);
  assert.equal(sh("rev-parse", "-q", "--verify", "MERGE_HEAD").status, 1);
  assert.equal(sh("status", "--porcelain", "--untracked-files=no").stdout.trim(), "");
  assert.equal(spawnSync("test", ["-e", join(d, "b.txt")]).status, 1);
  stub(d, true);
  const r2 = run(d, "good", "--game", "none", "--gate-script", join(d, "stub.mjs"));
  assert.equal(r2.status, 0, r2.stderr);
  assert.match(sh("log", "-1", "--format=%B").stdout, /GATE PASS none: stub/);
  assert.equal(readFileSync(join(d, "g.txt"), "utf8"), "g\n");
});
