import { test } from "node:test";
import assert from "node:assert/strict";
import { rowBlockers, waiting, unlabelled, gateProblems, GAME_FILE } from "./publishgate.mjs";

const md = ["| ID | Issue | Status | Check | Source |", "|---|---|---|---|---|",
  "| A-01 | x | **open** | c | s |",
  "| A-02 | x | **open, waiting on art** (run 6) | c | s |",
  "| A-03 | x | **reopened** (evidence FAIL r1: B, no) | c | s |",
  "| A-04 | x | **waiting on Mum** (Round 5) | c | s |",
  "| A-05 | x | open (needs Zafar: a design call) | c | s |",
  "| A-06 | x | **open (two strikes: Zafar)** (evidence FAIL r2) | c | s |",
  "| A-07 | x | built (evidence PASS r3: A) | c | s |",
  "| A-08 | x | *keep* | c | s |"].join("\n");

test("the known-fails list: an open row to fix, and one that waits on Mum, art or Zafar", () => {
  assert.deepEqual(rowBlockers(md), ["A-01", "A-03"]);
  assert.deepEqual(waiting(md), ["A-02", "A-04", "A-05", "A-06"]); // A-04: a labelled row is open (Zafar, 21 Oct)
});

test("publish gate (Zafar, 9 Nov): check-publish passed on this code with its known-fails list; open rows no longer block", () => {
  assert.deepEqual(gateProblems({ head: "abc", pass: { commit: "abc", knownFails: [{ check: "fix list", what: "2 open rows" }] } }), []);
  assert.match(gateProblems({ head: "abcdef123456", pass: null }).join("\n"), /check-publish has not passed on this commit \(abcdef1234\)/);
  assert.match(gateProblems({ head: "abc", pass: { commit: "abc" } }).join("\n"), /no known-fails list/);
  assert.equal(gateProblems.length, 0); // one argument object: no rows, checks or runs any more (decision 89 retired)
});

test("publish gate: game files are code, data, art and pages; docs and tools are not", () => {
  for (const f of ["js/clinic/knee.js", "css/shared/card.css", "data/cook.json", "assets/clinic/bg/room.webp", "labs.html"]) assert.ok(GAME_FILE.test(f), f);
  for (const f of ["docs/status.md", "build/tools/review/evidence.mjs", "CLAUDE.md", "docs/x.html"]) assert.ok(!GAME_FILE.test(f), f);
});

test("publish gate: a contract break covered by a row that waits on Zafar does not block; one whose row is fixable does", async () => {
  const { openBreaks } = await import("./publishgate.mjs");
  const md2 = "| ID | Issue | Status | Check | Source |\n|---|---|---|---|---|\n| D-24 | x | **waiting on Zafar** | c | s |\n| D-25 | x | **open** | c | s |";
  const breaks = [{ check: "contract-19", flow: "cook:daar@L2" }, { check: "contract-20", flow: "cook:daar" }, { check: "contract-4", flow: "clinic:x" }];
  const known = [{ check: "contract-19", flow: "cook:daar*", row: "D-24" }, { check: "contract-20", flow: "cook:daar", row: "D-25" }];
  assert.deepEqual(openBreaks(breaks, known, md2).map((b) => b.check), ["contract-20", "contract-4"]);
});

test("fix list: every open row starts with one label (Zafar, 21 Oct)", () => {
  const m = ["| ID | Issue | Status | Check | Source |", "|---|---|---|---|---|",
    "| B-01 | x | **to fix: code** · the wash | c | s |", "| B-02 | x | **waiting on art** · reopened | c | s |",
    "| B-03 | x | **open** (two strikes: Zafar) | c | s |", "| B-04 | x | built (evidence PASS r3: A) | c | s |"].join("\n");
  assert.deepEqual(unlabelled(m), ["B-03"]);
});
