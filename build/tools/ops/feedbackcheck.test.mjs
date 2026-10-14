import { test } from "node:test";
import assert from "node:assert/strict";
import { checkReport } from "./feedbackcheck.mjs";

const rep = (cause, cover) => `# F\n\n## 2. Every point\n\n| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |\n|---|---|---|---|---|---|\n| P1 | 0:12 | the card | cook | ${cause} | x |\n\n## 3. Rows\n\n## 4. Coverage\n\n| Lines | Point |\n|---|---|\n${cover}\n\nLines: 3; in a point 2; chatter 1; unmapped 0.\n`;
test("feedback gate: every point has a cause in code; every line is mapped (checks-to-build 24)", () => {
  assert.deepEqual(checkReport(rep("js/cook/ui.js:217 places it late", "| 0:00–0:12 | P1 |\n| 0:20 | chatter |")), []);
  assert.deepEqual(checkReport(rep("not code: art, the chop screen mixes styles", "| 0:00 | P1 |")), []);
  assert.match(checkReport(rep("", "| 0:00 | P1 |"))[0], /P1: no cause/);
  assert.match(checkReport(rep("js/a.js:1", "| 0:00 | P1 |\n| 0:30 | unmapped |")).join(), /0:30 are unmapped/);
  assert.match(checkReport("# nothing").join(), /no section 2[\s\S]*no section 4/);
});
