// node --test build/tools/review/docs.test.mjs : the word limits on the mode and design-language docs (Sprint 6 docs cut-down)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DOC_LIMITS, DOC_DIRS, checkDocs } from "./docs.mjs";
import { ROOT } from "./lib/common.mjs";

test("every mode and design-language doc has a limit, and a limit is a multiple of 500", () => {
  for (const d of DOC_DIRS) for (const f of readdirSync(join(ROOT, d)).filter((x) => x.endsWith(".md"))) assert.ok(`${d}/${f}` in DOC_LIMITS, `${d}/${f} has no limit`);
  for (const [p, n] of Object.entries(DOC_LIMITS)) assert.equal(n % 500, 0, `${p}: ${n}`);
});
test("each of those docs is under its limit", () => {
  for (const [p, max] of Object.entries(DOC_LIMITS)) {
    const n = (readFileSync(join(ROOT, p), "utf8").match(/\S+/g) || []).length;
    assert.ok(n <= max, `${p}: ${n} > ${max}`);
  }
});
test("checkDocs reports no limit failure", () => {
  assert.deepEqual(checkDocs().fails.filter((f) => /limit|DOC_LIMITS/.test(f)), []);
});

test("checks-to-build 23: a report's prose is counted without its tables, headings and code", async () => {
  const { proseWords } = await import("./docs.mjs");
  assert.equal(proseWords("# Title\n\nfour words of prose\n\n| a | b |\n|---|---|\n| x y z | w |\n\n```\ncode here\n```"), 4);
});
