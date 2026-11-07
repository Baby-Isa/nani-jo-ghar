// Tests for the standard's rule-block parser and the audit's --standard resolver (Sprint 17).
//   node --test build/tools/review/standard.test.mjs
// Fixtures: build/tools/review/fixtures/standard/ (pages = a clean fake standard, bad = malformed blocks, run = a fake saved run).
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, mkdtempSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import {
  parseStandardText, parseStandardDir, parseCheckedBy, parseChecksOutput, parseAuditReport, parseAuditRows, mergeAuditRows, loadContract, auditRules, scopesFor, flowIsGame, countBy, renderReport,
  TOOL_STEP, EXTRA_STEPS, JUDGE_TOOLS, PROCESS_TOOLS, DEFAULT_STEPS, ALL_STEPS,
} from "./lib/standard.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIX = join(HERE, "fixtures", "standard");
const PAGES = join(FIX, "pages"), BAD = join(FIX, "bad"), RUN = join(FIX, "run");
const AUDIT = join(HERE, "audit.mjs");

test("parses a rule block into every field", () => {
  const { rules, problems } = parseStandardDir(PAGES);
  assert.deepEqual(problems, []);
  const r = rules.find((x) => x.id === "STD-B1-01");
  assert.equal(r.rule, "A light on a small part of a thing lights the whole thing first, then shrinks onto the part");
  assert.match(r.why, /generalizable principle/);
  assert.equal(r.scope, "House");
  assert.equal(r.pattern, "P3");
  assert.equal(r.part, "the light");
  assert.deepEqual(r.checkedBy.map((t) => [t.kind, t.ref]), [["contract", "contract-53"], ["judge", "the shrink's motion, chai L2 New player"]]);
  assert.match(r.seeIt, /^lab\.html\?mode=cook/);
  assert.equal(r.status, "agreed 5 Nov");
  assert.equal(r.layer, "shared kit");
  assert.equal(r.livesIn, "`js/shared/onboard.js`");
  assert.equal(r.value, "zoom-in (values.md E4)");
  assert.equal(r.impact, "stuck");
  assert.deepEqual(r.sourceRows, ["SH-213", "SH-214"]);
  assert.equal(r.file, "b-play.md");
  assert.equal(r.domain, "B");
  assert.equal(r.retired, false);
});

test("the optional last line may be missing, or carry only some fields", () => {
  const { rules } = parseStandardDir(PAGES);
  const none = rules.find((x) => x.id === "STD-B1-03");
  assert.equal(none.layer, ""); assert.deepEqual(none.sourceRows, []);
  assert.equal(none.pattern, "-"); assert.equal(none.part, "-");
  const some = rules.find((x) => x.id === "STD-B1-02");
  assert.equal(some.layer, "shared kit"); assert.equal(some.impact, "wrong"); assert.equal(some.livesIn, "");
});

test("a retired status is flagged and a reversal keeps its history", () => {
  const { rules } = parseStandardDir(PAGES);
  assert.equal(rules.find((x) => x.id === "STD-B2-03").retired, true);
  assert.equal(rules.find((x) => x.id === "STD-B2-01").status, "agreed 4 Nov (was: twice, 2 Nov)");
  assert.equal(rules.find((x) => x.id === "STD-B2-01").retired, false);
});

test("prose and headings between rules are not part of a block", () => {
  const { rules } = parseStandardDir(PAGES);
  assert.equal(rules.filter((r) => r.domain === "D").length, 7);
  assert.equal(rules.find((x) => x.id === "STD-D1-01").status, "agreed 5 Nov");
});

test("Checked by: terms split on ' + ' only before a known word; the judge's text keeps its own plus signs", () => {
  const { terms, problems } = parseCheckedBy("contract-53 + judge: the light + the shrink, 1280x665 + gap: tool:voicegate + check:static/tokens + probe:SH-1 + doc:/brief standing lines + tool:leak");
  assert.deepEqual(problems, []);
  assert.deepEqual(terms.map((t) => t.kind), ["contract", "judge", "gap", "check", "probe", "doc", "tool"]);
  assert.equal(terms[1].ref, "the light + the shrink, 1280x665");
  assert.equal(terms[3].ref, "static/tokens");
  assert.equal(terms[5].ref, "/brief standing lines");
});

test("an unknown Checked-by word is reported, and so is an empty one", () => {
  assert.match(parseCheckedBy("contract-53 + vibes: fine").problems[0], /unknown Checked-by word "vibes"/);
  assert.equal(parseCheckedBy("").problems.length, 1);
});

test("malformed blocks are reported with their file and line", () => {
  const { rules, problems } = parseStandardDir(BAD);
  const at = (msg) => problems.find((p) => msg.test(p.msg));
  const noCheck = at(/missing field "Checked by"/);
  assert.equal(noCheck.file, "malformed.md"); assert.equal(noCheck.id, "STD-A1-01"); assert.equal(noCheck.line, 3);
  const unknown = at(/unknown Checked-by word "vibes"/);
  assert.equal(unknown.id, "STD-A1-02"); assert.equal(unknown.line, 14);
  assert.equal(at(/Scope "Engine"/).id, "STD-A1-03");
  assert.equal(at(/bad rule ID "STD-Z9-01"/).line, 26);
  assert.equal(at(/malformed heading/).id, "STD-A1-05");
  assert.match(at(/defined twice/).msg, /malformed\.md:3/);
  assert.ok(rules.length >= 5);
});

test("the shared parser keeps going after a bad block", () => {
  const { rules } = parseStandardText("#### STD-A1-01 · one\n- **Why:** x\n\n#### STD-A1-02 · two\n- **Why:** y\n- **Scope:** House\n");
  assert.deepEqual(rules.map((r) => r.id), ["STD-A1-01", "STD-A1-02"]);
});

test("a fenced example is not a rule", () => {
  const md = "```\n#### STD-A1-01 · example\n- **Why:** x\n```\n";
  assert.equal(parseStandardText(md).rules.length, 0);
});

test("a game answers to House, plus Family for the kitchen family, plus Game for chai-tray only", () => {
  assert.deepEqual(scopesFor("chai-tray"), ["House", "Family", "Game"]);
  assert.deepEqual(scopesFor("daar"), ["House", "Family"]);
  assert.deepEqual(scopesFor("fetch"), ["House"]);
  assert.ok(flowIsGame("cook:chai-tray@L2#mistake", "chai-tray"));
  assert.ok(!flowIsGame("cook:daar", "chai-tray"));
});

test("the saved run: breaks on the game's pages only; absent checks are not run", () => {
  const c = loadContract(RUN, "chai-tray");
  assert.ok(c.covered); assert.equal(c.gamePages, 3);
  const audit = auditRules(parseStandardDir(PAGES).rules, { game: "chai-tray", contract: c, checks: parseChecksOutput(readFileSync(join(RUN, "checks.txt"), "utf8")), tools: parseAuditReport(readFileSync(join(RUN, "audit-report.md"), "utf8")), verdicts: JSON.parse(readFileSync(join(RUN, "verdicts.json"), "utf8")) });
  const res = Object.fromEntries(audit.results.map((x) => [x.rule.id, x]));
  assert.equal(res["STD-B1-02"].result, "fail");                     // contract-11 broke on chai
  assert.match(res["STD-B1-02"].terms[0].note, /1 break/);
  assert.equal(res["STD-B1-01"].result, "judge");                    // contract-53 pass + a judge term
  assert.equal(res["STD-B1-03"].result, "not run");                  // contract-99 never ran
  assert.equal(res["STD-B2-02"].result, "fail");                     // contract-81 broke on daar only: pass for chai; the static rule fails
  assert.equal(res["STD-B2-02"].terms[0].result, "pass");
  assert.equal(res["STD-B2-02"].terms[2].result, "fail");            // check:static/tokens is named in the step's detail
  assert.equal(res["STD-B2-01"].result, "fail");                     // tool:leak failed in the audit report
  assert.equal(res["STD-D1-01"].result, "not run");                  // probe:ZZ-1 has no verdict
  assert.equal(res["STD-D1-02"].result, "judge");                    // doc: term
  assert.equal(res["STD-D1-03"].terms[2].result, "not run");         // check:fantasy is no step
  assert.equal(res["STD-D1-04"].result, "fail");                     // probe:SH-188 FAIL beats tool:teachgate not run
  assert.equal(res["STD-D1-05"].result, "gap");
  assert.equal(res["STD-D1-06"].terms[2].result, "pass");            // check:static/fonts: the step fails on other rules
  assert.equal(res["STD-D1-06"].terms[1].result, "fail");
  assert.equal(res["STD-D1-07"].result, "pass");                     // machine terms only, all pass
  assert.ok(!res["STD-B2-03"], "a retired rule is set aside");
  assert.equal(audit.retired, 1);
  const c2 = countBy(audit.results);
  assert.equal(c2.pass + c2.fail + c2.judge + c2.gap + c2["not run"], audit.results.length);
});

test("another game: contract-81 fails for daar, and the Game scope is left out", () => {
  const rules = parseStandardDir(PAGES).rules;
  const audit = auditRules(rules, { game: "daar", contract: loadContract(RUN, "daar"), checks: null, tools: null, verdicts: null });
  assert.ok(!audit.results.find((x) => x.rule.scope === "Game"));
  const r = audit.results.find((x) => x.rule.id === "STD-B2-02");
  assert.equal(r.terms[0].result, "fail");
  assert.equal(audit.results.find((x) => x.rule.id === "STD-B1-02").terms[0].result, "pass"); // contract-11 broke on chai, not daar
});

test("a run without the game's pages makes every contract term not run; no run at all too", () => {
  const rules = parseStandardDir(PAGES).rules;
  const a = auditRules(rules, { game: "eggs", contract: loadContract(RUN, "eggs"), checks: null, tools: null, verdicts: null });
  assert.ok(a.results.filter((x) => x.rule.checkedBy.some((t) => t.kind === "contract")).every((x) => x.terms.filter((t) => t.term.kind === "contract").every((t) => t.result === "not run")));
  const b = auditRules(rules, { game: "chai-tray", contract: loadContract(null, "chai-tray"), checks: null, tools: null, verdicts: null });
  assert.equal(b.results.find((x) => x.rule.id === "STD-B1-02").result, "not run");
});

test("the report has a table per domain and the counts", () => {
  const rules = parseStandardDir(PAGES).rules;
  const audit = auditRules(rules, { game: "chai-tray", contract: loadContract(RUN, "chai-tray"), checks: null, tools: null, verdicts: null });
  const md = renderReport({ game: "chai-tray", day: "2026-11-07", audit, problems: [], sources: ["s"], command: "cmd" });
  assert.match(md, /^# Standard audit: chai-tray/);
  assert.match(md, /## B Play: /); assert.match(md, /## D Guidance: /);
  assert.match(md, /\| ID \| Rule \| Scope \| Result \| Terms \| Why \|/);
  assert.match(md, /\| \*\*All\*\* \| \*\*\d+\*\* \|/);
});

test("the CLI on the fixtures prints the table and counts and writes the report", () => {
  const out = join(mkdtempSync(join(tmpdir(), "std-audit-")), "report.md");
  const r = spawnSync(process.execPath, [AUDIT, "--standard", "chai-tray", "--run", RUN, "--std-dir", PAGES, "--checks", join(RUN, "checks.txt"), "--audit-report", join(RUN, "audit-report.md"), "--verdicts", join(RUN, "verdicts.json"), "--out", out], { encoding: "utf8" });
  assert.equal(r.status, 1, r.stderr); // fails exist
  assert.match(r.stdout, /## Counts per domain/);
  assert.match(r.stdout, /STD-B1-02 \|[^\n]*\*\*fail\*\*/);
  assert.match(r.stdout, /: \d+ pass, \d+ fail, \d+ judge, \d+ gap, \d+ not run/);
  assert.ok(existsSync(out));
  assert.match(readFileSync(out, "utf8"), /^# Standard audit: chai-tray/);
});

test("the CLI reports a malformed folder and exits 1; a missing folder exits 2 without a crash", () => {
  const out = join(mkdtempSync(join(tmpdir(), "std-audit-")), "report.md");
  const bad = spawnSync(process.execPath, [AUDIT, "--standard", "chai-tray", "--run", RUN, "--std-dir", BAD, "--out", out, "--quiet"], { encoding: "utf8" });
  assert.equal(bad.status, 1);
  assert.match(readFileSync(out, "utf8"), /## Malformed blocks \([1-9]\d*\)[\s\S]*malformed\.md:3/);
  const missing = spawnSync(process.execPath, [AUDIT, "--standard", "chai-tray", "--std-dir", join(FIX, "nope")], { encoding: "utf8" });
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /No standard folder/);
});

// ---- Sprint 17, fix 4: every tool the rules cite is run by the audit or named with a reason ----
const ROOT = join(HERE, "..", "..", "..");
const rulesOf = (checkedBy) => parseStandardText(`#### STD-B1-01 · r\n\n- **Why:** w\n- **Scope:** House\n- **Pattern / part:** - / -\n- **Checked by:** ${checkedBy}\n- **See it:** s\n- **Status:** agreed\n`).rules;
const toolAudit = (game, checkedBy, tools) => auditRules(rulesOf(checkedBy), { game, contract: loadContract(null, game), checks: null, tools, verdicts: null }).results[0];

test("a process tool reads judge with its name, never not run", () => {
  for (const t of ["publishgate", "evidence", "feedbackcheck", "brief", "stdids", "artcheck", "artblock", "artcut", "artdespill", "mumsheet", "mumround", "test_cook_mount"]) {
    const x = toolAudit("chai-tray", `tool:${t}`, null);
    assert.equal(x.result, "judge", t);
    assert.match(x.terms[0].note, /process tool/);
  }
  assert.equal(toolAudit("chai-tray", "tool:kitsheet + tool:kitmap + tool:teachgate + tool:shelfshot", null).result, "judge");
  assert.equal(toolAudit("chai-tray", "tool:made-up-tool", null).terms[0].note, "the audit has no step for it");
});

test("a review tool the audit did not run is not run, and names the --only key that runs it", () => {
  const first = (tool, game = "chai-tray") => toolAudit(game, `tool:${tool}`, null).terms[0];
  for (const [tool, key] of [["voicegate", "voicegate"], ["spkgap", "spkgap"], ["lightfollow", "lightfollow"], ["faces", "faces"], ["tapgate", "tapgate"], ["pillcheck", "pillcheck"], ["panelcheck", "panel"], ["loadtime", "load"], ["layout", "sandbox"]]) {
    const t = first(tool);
    assert.equal(t.result, "not run", tool);
    assert.equal(t.note, `run: audit.mjs chai-tray --only ${key}`);
  }
  assert.equal(first("lightfollow", "daar").note, "run: audit.mjs daar --only lightfollow");
});

test("a review tool the audit ran reads its pass or fail; a tool that cannot judge the game yet reads judge with why", () => {
  const tools = parseAuditReport(readFileSync(join(RUN, "audit-report-extra.md"), "utf8"));
  assert.deepEqual([...tools.keys()], ["panel", "voicegate", "spkgap"]);
  assert.equal(toolAudit("chai-tray", "tool:voicegate", tools).result, "pass");
  const gap = toolAudit("chai-tray", "tool:spkgap", tools);
  assert.equal(gap.result, "fail"); assert.match(gap.terms[0].note, /audit spkgap: 1 gap under 300 ms/);
  assert.equal(toolAudit("chai-tray", "tool:voicegate + tool:spkgap", tools).result, "fail");
  const chaiOnly = toolAudit("daar", "tool:pillcheck", tools).terms[0];
  assert.equal(chaiOnly.result, "judge"); assert.match(chaiOnly.note, /chai-tray only so far/);
});

test("the report shows the reason on a tool term that reads judge or not run", () => {
  const audit = auditRules(rulesOf("tool:pillcheck + tool:publishgate + tool:voicegate"), { game: "daar", contract: loadContract(null, "daar"), checks: null, tools: null, verdicts: null });
  const md = renderReport({ game: "daar", day: "2026-11-07", audit, problems: [], sources: ["s"], command: "cmd" });
  assert.match(md, /tool: pillcheck judge \(pillcheck reads chai-tray only so far\)/);
  assert.match(md, /tool: publishgate judge \(process tool/);
  assert.match(md, /tool: voicegate not run \(run: audit\.mjs daar --only voicegate\)/);
});

test("--only rows merge into today's report instead of wiping the other steps", () => {
  const old = parseAuditRows(readFileSync(join(RUN, "audit-report.md"), "utf8"));
  assert.deepEqual(old.map((r) => r.key), ["sandbox", "panel", "labcheck", "leak", "load"]);
  const merged = mergeAuditRows(old, parseAuditRows(readFileSync(join(RUN, "audit-report-extra.md"), "utf8")));
  assert.deepEqual(merged.map((r) => r.key), ["sandbox", "panel", "labcheck", "leak", "load", "voicegate", "spkgap"]);
  assert.equal(merged.find((r) => r.key === "spkgap").ok, false);
  assert.deepEqual(DEFAULT_STEPS, ["sandbox", "panel", "labcheck", "leak", "load"], "the default audit's steps do not grow unasked");
  assert.deepEqual(ALL_STEPS.slice(5).sort(), Object.keys(EXTRA_STEPS).sort());
});

test("the audit refuses an unknown --only key or --steps value before it plays anything", () => {
  const bad = spawnSync(process.execPath, [AUDIT, "daar", "--only", "voicegate,nosuch"], { encoding: "utf8" });
  assert.equal(bad.status, 2); assert.match(bad.stderr, /Unknown step nosuch; the keys: sandbox, panel, labcheck, leak, load, voicegate/);
  const steps = spawnSync(process.execPath, [AUDIT, "daar", "--steps", "some"], { encoding: "utf8" });
  assert.equal(steps.status, 2); assert.match(steps.stderr, /--steps takes "all"/);
});

test("every tool the standard's pages cite has a place: run by the audit, judge, or process (none says 'no step')", () => {
  const { rules } = parseStandardDir(join(ROOT, "docs", "design-language", "standard"));
  const cited = new Set(rules.flatMap((r) => r.checkedBy.filter((t) => t.kind === "tool").map((t) => t.ref)));
  assert.ok(cited.size > 10, "the standard cites tools");
  const known = new Set([...Object.keys(TOOL_STEP), ...Object.keys(EXTRA_STEPS), ...Object.keys(JUDGE_TOOLS), ...Object.keys(PROCESS_TOOLS)]);
  assert.deepEqual([...cited].filter((t) => !known.has(t)), []);
  for (const f of [...Object.values(EXTRA_STEPS).map((x) => x.file), ...Object.values(JUDGE_TOOLS).map((x) => x.file), ...Object.values(PROCESS_TOOLS)]) assert.ok(existsSync(join(ROOT, f)), `${f} exists`);
});
