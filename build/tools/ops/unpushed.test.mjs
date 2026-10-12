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
