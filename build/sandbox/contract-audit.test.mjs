// The check audit (s19-checks, 8 Nov; docs/process/check-audit.md): the FIX verdicts that are not covered by their own check's tests.
// No browser. Run: node --test build/sandbox/contract-audit.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CHECKS, LADDER } from "./lib/contract.mjs";

test("contract-24 says the table it reads: the central rules' hint waits, not the retired data/cook.json calm.helpMs", () => {
  const rules = JSON.parse(readFileSync(new URL("../../data/rules.json", import.meta.url), "utf8")).levels.hintS;
  assert.deepEqual(LADDER, rules.map((s) => Math.round(s * 1000)));
  assert.match(CHECKS["contract-24"].how, /data\/rules\.json levels\.hintS/);
  assert.match(CHECKS["contract-24"].how, new RegExp(rules.join(", ")));
  assert.doesNotMatch(CHECKS["contract-24"].how, /\(7, 8, 11, 15 s: data\/cook\.json calm\.helpMs\)/);
});
