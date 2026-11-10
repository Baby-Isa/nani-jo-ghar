// The tier tools' pure parts: the diff -> games, levels and rows; which extra checks fire; the result files and the publish gate's
// "passed on this commit" rule; the push hook's reading of a command (s19-tiers, Zafar 9-10 Nov).
import { test } from "node:test";
import assert from "node:assert/strict";
import { gameOf, gamesFromFlows, normalizeGame, flowsOfGame, filmFlow, levelsTouched, rowsFromDiff, elementsFromDiff, fires, extraSteps, runFailures, fixListMd, resultMd, passedOn, onlyResultFiles, CONFIG } from "./lib.mjs";
import { pushOf } from "./push-hook.mjs";
import { gateProblems } from "../ops/publishgate.mjs";

const ALL = ["house", "css", "rotate-card", "cook:chop", "cook:chop@L2", "cook:chop@L3", "cook:chop@L4", "cook:chop#mistake", "cook:chop@L2#mistake", "cook:chop#speed1", "lab:cook/chop", "lab:cook/chop@L3",
  "cook:daar", "cook:daar#returning", "lab:cook/round", "clinic:heal-cut", "clinic:waiting", "clinic:waiting@L3", "mode:snap"];

test("diff to games: a flow's game, a lab page folded into its Cook game, the lint flows left out", () => {
  assert.equal(gameOf("cook:chop@L2#mistake", ALL), "cook:chop");
  assert.equal(gameOf("lab:cook/chop@L3", ALL), "cook:chop");
  assert.equal(gameOf("lab:cook/round", ALL), "lab:cook/round"); // no cook:round flow: its own game
  assert.deepEqual(gamesFromFlows(["css", "cook:chop", "lab:cook/chop", "rotate-card", "clinic:heal-cut", "cook:chop@L3"], ALL), ["cook:chop", "clinic:heal-cut"]);
  assert.equal(normalizeGame("chop", ALL), "cook:chop");
  assert.equal(normalizeGame("heal-cut", ALL), "clinic:heal-cut");
  assert.equal(normalizeGame("snap", ALL), "mode:snap");
  assert.equal(normalizeGame("nothing", ALL), null);
});

test("diff to games: a game's flows at the levels touched, the film's own path left out; the film flow by preference", () => {
  assert.deepEqual(flowsOfGame("cook:chop", ALL, { levels: [1], skipPaths: ["speed1"] }), ["cook:chop", "cook:chop#mistake", "lab:cook/chop"]);
  assert.deepEqual(flowsOfGame("cook:chop", ALL, { levels: [1, 2, 3, 4], skipPaths: ["speed1"] }).length, 8);
  assert.equal(filmFlow("cook:chop", ALL, ["#speed1", ""]), "cook:chop#speed1");
  assert.equal(filmFlow("cook:daar", ALL, ["#speed1", ""]), "cook:daar");
  assert.equal(filmFlow("cook:chop", ALL, ["#returning"]), null);
});

test("levels touched: L1 unless the change touches levels or the game's station data", () => {
  const cfg = { default: [1], touched: [1, 2, 3, 4] };
  assert.deepEqual(levelsTouched([{ file: "js/cook/stations/chop.js", text: "+  knife.angle = 3;\n-  knife.angle = 2;" }], "cook:chop", cfg), [1]);
  assert.deepEqual(levelsTouched([{ file: "js/cook/stations/chop.js", text: "+  if (level >= 3) decoys = 2;" }], "cook:chop", cfg), [1, 2, 3, 4]);
  assert.deepEqual(levelsTouched([{ file: "data/stations/chop.json", text: "+ \"x\": 1" }], "cook:chop", cfg), [1, 2, 3, 4]);
  assert.deepEqual(levelsTouched([{ file: "js/x.js", text: "--- a/js/x.js\n+++ b/js/x.js level\n context level" }], "cook:chop", cfg), [1]); // headers and context lines are not changes
});

test("rows from the diff: IDs on the fix list's changed lines and in the commit messages, only rows with a probe", () => {
  const diff = "--- a/docs/process/regressions.md\n+++ b/docs/process/regressions.md\n-| CK-63 | x | **open** |\n+| CK-63 | x | **to fix: code** |\n | SH-1 | context |\n+| SH-240 | new | **open** |";
  const log = "Fix the chop light (CHAI-105)\n\nAlso DAAR-40 and STD-G4-01.";
  assert.deepEqual(rowsFromDiff(diff, log, new Set(["CK-63", "SH-240", "CHAI-105", "SH-1"])), ["CHAI-105", "CK-63", "SH-240"]);
});

test("shared elements from the diff: an element's class names on a changed line", () => {
  const els = { "face circle": { grep: ["\\boc-face\\b"] }, finger: { grep: ["\\bnjg-ghost\\b"] } };
  assert.deepEqual(elementsFromDiff("+.oc-face { width: 40px }\n .njg-ghost {}", els), ["face circle"]);
});

test("extra checks: when (always, games:<family>, a file regex), per game, blocks or reports", () => {
  assert.ok(fires("always", {}));
  assert.ok(fires("games:cook", { games: ["cook:chop"] }) && !fires("games:clinic", { games: ["cook:chop"] }));
  assert.ok(fires("^js/cook/", { files: ["js/cook/x.js"] }) && !fires("^js/cook/", { files: ["docs/a.md"] }));
  const checks = [
    { id: "a", what: "a", argv: ["x.mjs", "{key}"], per: "game", family: "cook", tiers: { sprint: { when: "always" } } },
    { id: "b", what: "b", argv: ["y.mjs", "--games", "{keys}"], family: "cook", blocks: false, fix: "FIX", tiers: { sprint: { when: "^js/" }, change: { when: "always", blocks: true } } },
    { id: "c", what: "c", builtin: "elsewhere", tiers: { sprint: { when: "always" } } },
  ];
  const s = extraSteps("sprint", { files: ["js/cook/z.js"], games: ["cook:chop", "cook:daar", "clinic:heal-cut"], checks });
  assert.deepEqual(s.map((x) => x.id), ["a:chop", "a:daar", "b"]);
  assert.deepEqual(s[2].argv, ["y.mjs", "--games", "chop,daar"]);
  assert.equal(s[2].blocks, false);
  assert.equal(extraSteps("change", { files: [], games: ["cook:chop"], checks })[0].blocks, true); // the tier's own word wins
  assert.deepEqual(extraSteps("sprint", { files: [], games: ["clinic:heal-cut"], checks }), []); // a family check with no such game
});

test("every check of tiers.json runs somewhere or names who runs it", () => {
  for (const c of CONFIG.checks) assert.ok(c.builtin || (c.tiers && Object.keys(c.tiers).length && (c.argv || c.shell)), c.id);
  for (const c of CONFIG.checks.filter((x) => x.blocks === false && !x.builtin)) assert.ok(c.fix || Object.values(c.tiers).every((t) => t.blocks === false) || c.note, `${c.id}: a check that only reports says why`);
});

test("a run's failures: stuck and page errors block, contract breaks are listed once; the fix list groups by game", () => {
  const f = runFailures({ pages: [{ flow: "cook:chop", size: "740x320", complete: false, errors: [], stops: [] }, { flow: "lab:cook/chop", size: "740x320", complete: true, errors: ["TypeError: x"] }],
    breaks: [{ check: "contract-109", flow: "cook:daar", size: "740x320", measured: "72 px off" }, { check: "contract-109", flow: "cook:daar", size: "740x320", measured: "72 px off" }] }, ALL);
  assert.deepEqual(f.map((x) => [x.game, x.check, x.blocks]), [["cook:chop", "stuck", true], ["cook:chop", "page error", true], ["cook:daar", "contract-109", false]]);
  const md = fixListMd(f, "Fix list");
  assert.match(md, /Fix list \(3, by game\)[\s\S]*\*\*cook:chop\*\* \(2\)[\s\S]*\*\*cook:daar\*\* \(1\)/);
});

test("the result file: verdict, steps, the fix list and what to look at", () => {
  const md = resultMd({ name: "check-change", tierNo: "2", commit: "abcdef1234567", date: "d", ok: false, games: ["cook:chop"], steps: [{ id: "play", what: "w", blocks: false, status: "report", line: "CONTRACT PASSED" }],
    failures: [{ game: "cook:chop", check: "stuck", where: "cook:chop@740x320", what: "did not reach its end", blocks: true }], artefacts: { films: ["a.webm"] } });
  assert.match(md, /check-change \(tier 2\) on abcdef1234/);
  assert.match(md, /\*\*FAILED\*\*/);
  assert.match(md, /\| note \| play \| w \| reports \| CONTRACT PASSED \|/);
  assert.match(md, /cook:chop[\s\S]*stuck at cook:chop@740x320/);
  assert.match(md, /films: a\.webm/);
});

test("the publish gate: check-publish passed on this commit, or on one with only result files changed since; with its known fails", () => {
  const results = [{ commit: "aaa", ok: true, date: "2", knownFails: [] }, { commit: "bbb", ok: false, date: "3" }, { commit: "ccc", ok: true, date: "1", dirty: true }];
  assert.equal(passedOn("publish", "aaa", { results, changedSince: () => [] }).commit, "aaa");
  assert.equal(passedOn("publish", "zzz", { results, changedSince: (c) => (c === "aaa" ? ["build/reports/tiers/publish-aaa.json"] : ["js/x.js"]) }).commit, "aaa");
  assert.equal(passedOn("publish", "zzz", { results, changedSince: () => ["js/cook/x.js", "build/reports/tiers/x.md"] }), null);
  assert.equal(passedOn("publish", "bbb", { results, changedSince: () => ["js/x.js"] }), null); // a failed one never counts
  assert.ok(onlyResultFiles(["build/reports/tiers/a.json"]) && !onlyResultFiles(["build/reports/x.md"]));
  assert.deepEqual(gateProblems({ head: "zzz", pass: { commit: "aaa", knownFails: [] } }), []);
  assert.match(gateProblems({ head: "zzz", pass: null }).join(), /check-publish has not passed on this commit/);
  assert.match(gateProblems({ head: "zzz", pass: { commit: "aaa" } }).join(), /no known-fails list/);
});

test("the push hook: which commands push, and from where", () => {
  assert.deepEqual(pushOf("git push -u origin s19"), { dir: null });
  assert.deepEqual(pushOf("cd /home/user/wt/x && git push origin HEAD"), { dir: "/home/user/wt/x" });
  assert.deepEqual(pushOf("git -C /repo push"), { dir: "/repo" });
  assert.equal(pushOf("git push --dry-run origin x"), null);
  assert.equal(pushOf("git status && echo push"), null);
  assert.equal(pushOf("git log --format=%s | grep push"), null);
  assert.equal(pushOf("NJG_ROLLBACK=1 git push origin abc:refs/heads/main"), null); // check-live's roll-back of main: never held up
});
