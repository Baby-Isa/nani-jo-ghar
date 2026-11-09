import { test } from "node:test";
import assert from "node:assert/strict";
import { parse, stale, apply } from "./decisions.mjs";

const FILE = `# Decisions
## Asked
1. Fix the flash now? [rows: SH-220] [then: to fix: code]
2. Keep the hint's blur? [rows: CHAI-76]
3. Something still open [rows: CK-01]
## Answer
yes to 1 and 2
## Outcome
1: yes, a stone cover that fades
2: yes, blurred until the hint is opened
3: open
`;
const FIX = "| SH-220 | flash | **waiting on Zafar** · cause: x | eye | src |\n| CHAI-76 | hint | **waiting on Zafar** · his call | eye | src |\n| CK-01 | levels | **waiting on Zafar** · open | eye | src |";

test("decisions (Zafar, 9 Nov): an answered item never leaves its rows waiting on him", () => {
  const d = parse(FILE, "2026-11-09-test.md");
  assert.equal(d.items.length, 3); assert.deepEqual(d.items[0].rows, ["SH-220"]); assert.equal(d.items[0].then, "to fix: code");
  const bad = stale([["2026-11-09-test.md", FILE]], FIX);
  assert.equal(bad.length, 2, "SH-220 and CHAI-76 flagged; CK-01's item is still open");
  const r = apply(FILE, "2026-11-09-test.md", FIX);
  assert.match(r.fix, /\| SH-220 \| flash \| \*\*to fix: code\*\* · decided \(Zafar, 2026-11-09, docs\/decisions\/2026-11-09-test.md #1\): yes, a stone cover/);
  assert.match(r.fix, /\| CK-01 \| levels \| \*\*waiting on Zafar\*\*/);
  assert.equal(stale([["2026-11-09-test.md", FILE]], r.fix).length, 0);
  assert.deepEqual(parse(FILE.replace("3: open\n", ""), "x.md").missing, [3], "an answered list with a number left out is caught");
});
