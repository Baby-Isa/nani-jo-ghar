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
