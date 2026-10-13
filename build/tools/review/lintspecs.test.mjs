// node --test build/tools/review/lintspecs.test.mjs : evidence.mjs --lint-specs on a fixture spec (S05-T2)
import { test } from "node:test";
import assert from "node:assert/strict";
import { lintSpecs, selectorTokens, baseFlow, LEGACY_FLOWS } from "./lib/lintspecs.mjs";

const ctx = { flows: new Set(["cook:chai", "clinic:waiting"]), legacy: new Set(LEGACY_FLOWS), corpus: ".oc-card #mission rs-words", exists: (p) => p === "build/check_x.py", lexicon: new Set(["chai", "dudh"]), rowText: { A1: "the sidebar card", A2: "the end screen word review" } };
const P = (x) => ({ flow: "cook:chai", path: "fair", level: 1, at: "request", capture: [], expect: [], ...x });

test("selectors: classes and ids, no pseudo, attribute or canvas names", () => {
  assert.deepEqual(selectorTokens("#mission .oc-card:not(.closed) [data-x=y]"), ["#mission", ".oc-card", ".closed"]);
  assert.deepEqual(selectorTokens("canvas:nani-"), []);
  assert.equal(baseFlow("cook:chai@L3#hint"), "cook:chai");
});
test("each pitfall is flagged once with its kind", () => {
  const spec = {
    A1: [P({ flow: "cook:fry" }), P({ flow: "cook:nope" }), P({ capture: ["crop:.gone-class"] }), P({ at: "results-words" }), P({ capture: ["cmd:python3 build/missing.py"] }), P({ expect: ["order:ask,bowl"] })],
    A2: [P({ at: "results-words", capture: ["crop:.rs-words"] }), P({ capture: ["cmd:python3 build/check_x.py", "crop:#mission"], expect: ["order:.oc-card,#mission", "order:chai,dudh"] })],
  };
  const kinds = lintSpecs(spec, ctx).map((f) => `${f.row}${f.probe}:${f.kind}`);
  assert.deepEqual(kinds, ["A11:legacy", "A12:flow", "A13:selector", "A14:end-card", "A15:cmd", "A16:expect"]);
});

import { wilsonLow, clearlyOver } from "./lib/stats.mjs";
test("leak judgement: noise near the limit is not a leak, a clear excess is (LNG-02)", () => {
  assert.equal(clearlyOver(0.103, 8000, 0.1), false, "taste L1: 10.3% in 8000 rounds, exact odds 8.3%");
  assert.equal(clearlyOver(0.13, 8000, 0.1), true);
  assert.equal(clearlyOver(0.09, 8000, 0.1), false);
  assert.ok(wilsonLow(0.5, 100) < 0.5);
});
