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
  assert.match(src, /"flock", \["-w", "1800", "\/tmp\/njg-browser-all\.lock"/);
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
