// placeholder written before the build (S14 tools): not built yet, so the before run shows it red
import { test } from "node:test";
import assert from "node:assert/strict";
test("not built yet", () => assert.fail("the S14 check is not built yet"));
