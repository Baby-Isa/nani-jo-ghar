// checks.mjs (s19-checks, 8 Nov: the default run had stopped finishing in 5 minutes): the fast run leaves the browser's load check and
// the parked modes' leak bots to --full, and runs its steps at once. Run: node --test build/tools/review/checks.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pick, PARKED } from "./checks.mjs";

test("the fast run has no browser step; --browser or --full adds the load check; --only is exact", () => {
  assert.ok(!pick().includes("load"));
  assert.ok(pick().includes("unit") && pick().includes("leak") && pick().includes("static"));
  assert.ok(pick({ browser: true }).includes("load"));
  assert.ok(pick({ full: true }).includes("load"));
  assert.deepEqual(pick({ only: "unit,load" }), ["unit", "load"]);
});

test("the parked modes' bots wait for --full; the live games' always run", () => {
  for (const m of ["snap", "tidy", "who", "dress", "monsoon", "find"]) assert.ok(PARKED.includes(m), m);
  for (const m of ["clinic", "chaat", "day", "clinic-heal-knee"]) assert.ok(!PARKED.includes(m), m);
});

test("the load check takes the one browser lock every run takes", () => {
  const src = readFileSync(new URL("./checks.mjs", import.meta.url), "utf8");
  assert.match(src, /locked\(\["timeout", "900", process\.execPath, "build\/tools\/review\/loadcheck\.mjs"\], \{ wait: 1800 \}\)/);
  assert.doesNotMatch(src, /"\/tmp\/njg-browser\.lock"/);
});

test("one browser lock: no review or sandbox tool takes the old /tmp/njg-browser.lock, which no builder's run took (s19-checks audit)", async () => {
  const { readdirSync } = await import("node:fs");
  const { join } = await import("node:path");
  const root = new URL("../../../", import.meta.url).pathname;
  const files = [...readdirSync(join(root, "build/tools/review")).filter((f) => f.endsWith(".mjs")).map((f) => join("build/tools/review", f)), "build/tools/review/leak-games/cook.mjs", "build/sandbox/run.mjs", "build/test_cook_mount.mjs", ...readdirSync(join(root, "build/sandbox/lib")).filter((f) => f.endsWith(".mjs")).map((f) => join("build/sandbox/lib", f))];
  const bad = files.filter((f) => !f.endsWith("checks.test.mjs") && readFileSync(join(root, f), "utf8").replace(/it was \/tmp\/njg-browser\.lock/g, "").includes("/tmp/njg-browser.lock"));
  assert.deepEqual(bad, []);
});

test("a browser step takes the one lock unless an ancestor flock holds it (a nested flock on one lock waits for itself)", async () => {
  const { locked, underLock, BROWSER_LOCK } = await import("./lib/common.mjs");
  assert.equal(BROWSER_LOCK, "/tmp/njg-browser-all.lock");
  assert.deepEqual(locked(["node", "x.mjs"], { held: false, lock: BROWSER_LOCK, wait: 60 }), ["flock", "-w", "60", BROWSER_LOCK, "node", "x.mjs"]);
  assert.deepEqual(locked(["node", "x.mjs"], { held: true }), ["node", "x.mjs"]);
  // the process tree: this test <- flock -w 3600 /tmp/njg-browser-all.lock node ... <- bash
  const procs = { [`/proc/${process.ppid}/cmdline`]: "node\0x", [`/proc/${process.ppid}/stat`]: "1 (node) S 77 ", "/proc/77/cmdline": ["flock", "-w", "3600", BROWSER_LOCK, "node"].join("\0"), "/proc/77/stat": "77 (flock) S 1 " };
  assert.equal(underLock(BROWSER_LOCK, (p) => { if (!(p in procs)) throw new Error("gone"); return procs[p]; }), true);
  assert.equal(underLock("/tmp/other.lock", (p) => { if (!(p in procs)) throw new Error("gone"); return procs[p]; }), false);
});

test("pillcheck waits for the pills at least twice the slowest order intro (27 s at 1920x1080 L4; the 30 s wait failed one run in three)", () => {
  const src = readFileSync(new URL("./pillcheck.mjs", import.meta.url), "utf8");
  const ms = +(/export const PILL_WAIT_MS = (\d+)/.exec(src) || [0, 0])[1];
  assert.ok(ms >= 54000, `PILL_WAIT_MS ${ms}`);
  assert.match(src, /while \(Date\.now\(\) - t0 < PILL_WAIT_MS\)/);
});

test("stdids --check: an extra ID (fine if meant) is a note, not a failure; the real problems still fail", async () => {
  const { spawnSync } = await import("node:child_process");
  const root = new URL("../../../", import.meta.url).pathname;
  const r = spawnSync(process.execPath, ["build/tools/review/stdids.mjs", "--check"], { cwd: root, encoding: "utf8" });
  const real = (r.stdout.match(/^  (?!note: ).*$/gm) || []);
  assert.equal(r.status === 0, real.length === 0, r.stdout.slice(0, 400));
  assert.doesNotMatch(r.stdout, /^  [^n].*fine if meant/m);
});

test("the unit step leaves the art block's tests out only where sources/art is missing (a builder's worktree)", async () => {
  const { unitFiles } = await import("./checks.mjs");
  assert.ok(unitFiles(false).includes("build/tools/art/artcheck.test.mjs"));
  assert.ok(!unitFiles(true).includes("build/tools/art/artcheck.test.mjs"));
  assert.ok(unitFiles(true).includes("build/sandbox/contract-s19.test.mjs") && unitFiles(true).includes("build/tools/review/checks.test.mjs"));
});
