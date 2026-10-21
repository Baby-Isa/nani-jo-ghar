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

test("publish gate: an open row must say what it waits on", () => {
  assert.deepEqual(rowBlockers(md), ["A-01", "A-03"]);
  assert.deepEqual(waiting(md), ["A-02", "A-04", "A-05", "A-06"]); // A-04: a labelled row is open (Zafar, 21 Oct)
});

test("publish gate: every problem is named; a clean state has none", () => {
  const clean = { rows: [], checks: { ok: true, failed: [] }, contract: { scope: "gate", breaks: 0, commit: "abc", changed: [] }, evidence: { run: "ev-1", changed: [], unjudged: [], uncollected: [] } };
  assert.deepEqual(gateProblems(clean), []);
  const p = gateProblems({ rows: ["A-01"], checks: { ok: false, failed: ["docs: 1 over a limit"] }, contract: { scope: "route", breaks: 3, commit: "abcdef12", changed: ["js/clinic/x.js"] }, evidence: { run: "ev-1", changed: ["css/a.css"], unjudged: ["B-1"], uncollected: ["B-2"] } });
  assert.equal(p.length, 7);
  assert.match(p.join("\n"), /A-01[\s\S]*docs: 1 over[\s\S]*3 breaks[\s\S]*js\/clinic\/x\.js[\s\S]*css\/a\.css[\s\S]*B-1[\s\S]*B-2/);
  assert.match(gateProblems({ ...clean, contract: null, evidence: null }).join("\n"), /no full contract run[\s\S]*no evidence run/);
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
