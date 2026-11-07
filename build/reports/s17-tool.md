# s17-tool: `audit.mjs --standard <game>` (Sprint 17, 7 Nov)

The audit now reads the standard's rule rows and prints every rule that applies to a game as pass, fail, judge, gap or not run.
No browser: it reads saved results. Without `--standard` the audit is unchanged.

## Files

- `build/tools/review/lib/standard.mjs` (new): the rule-block parser (shared with `stdids.mjs` later: `parseStandardDir`, `parseStandardText`,
  `parseCheckedBy`) and the resolver and report writer the audit uses.
- `build/tools/review/audit.mjs`: the `--standard` branch.
- `build/tools/review/standard.test.mjs` (16 tests), `build/tools/review/fixtures/standard/` (`pages/` a clean fake standard, `bad/` malformed blocks,
  `run/` a fake saved run, checks output, audit report and verdict cache).
- `docs/tools.md`: the audit row.

## Usage

```
node build/tools/review/audit.mjs --standard chai-tray --run frozen-chai-20261107
node build/tools/review/audit.mjs --standard daar --run /abs/path/to/a/run --checks build/screenshots/audit/checks-latest.txt
```

| Flag | Meaning |
|---|---|
| `--standard <game>` | the game; its rules are House always, Family for a kitchen-family game (the list in `lib/standard.mjs`, from S18 decision 11), Game only for `chai-tray`. Retired rules are set aside |
| `--run <id or folder>` | the sandbox run for `contract-NN` terms: a run id under `build/screenshots/sandbox/` or any absolute folder. Default: the newest run that has pages of this game |
| `--run-checks` | runs `checks.mjs` now (without the browser step `load`) and saves its output to `build/screenshots/audit/checks-latest.txt` |
| `--checks <file>` | a saved `checks.mjs` output (default: `checks-latest.txt` if it exists) |
| `--audit-report <file>` | the audit report that gives the `tool:` results (default: the game's newest `build/reports/audit-<game>-<date>.md`) |
| `--play` | first runs the normal audit for the game (a browser, long), then reads its report. `--no-play` (the default) wins over it |
| `--std-dir`, `--verdicts`, `--out`, `--quiet` | another standard folder (also env `NJG_STANDARD_DIR`), another verdict cache, another report path, counts only on screen |

Output: `build/reports/audit-standard-<game>-<date>.md` (also printed): sources, counts per domain, then a table per domain (ID, rule, scope,
result, each term's result, why), then the malformed blocks with `file:line`. Exit 1 if any rule fails or any block is malformed, 2 if the standard
folder is missing, else 0.

## What each result means

A term is resolved first; a rule takes the worst of its terms in this order: fail, not run, gap, judge, pass.

| Term | Resolved from | Result |
|---|---|---|
| `contract-NN` | the run's `contract.md` (the checks that ran) and `contract.json` (the breaks) | fail with the count when a break sits on a flow of this game; pass when the check ran and none did; not run when the run has no pages of the game or the check is not in it |
| `check:<name>` | a `checks.mjs` step (`unit`, `words`, `static`, `leak`, ...) | its ok or FAIL; `check:static/<rule>` fails only when the step's `NEW` lines name the rule; an unknown step or no output is not run |
| `tool:<script>` | the audit report's steps: `panelcheck`=panel, `labcheck`, `leak`, `loadtime`=load | pass or fail; every other tool (`teachgate`, `shelfshot`, ...) is not run |
| `probe:<ROW>` | `build/tools/review/data/verdicts.json` | the cached PASS or FAIL; no verdict is not run |
| `doc:`, `judge:` | nothing machine | judge: the eye (Fable or Zafar) is still owed |
| `gap:` | nothing | gap: no tool yet |

So **pass** is only a rule whose terms are all machine terms and all passed; a rule with a judge term can reach at best **judge**.

Known limit: `contract.md` lists every check with its break count and does not say whether a check applied to a flow (contract-50 is samosa-only,
contract-17 needs `--store`). A check in the table with no break on the game counts as pass; the run does not record "did not apply".

## Malformed blocks

Reported with file, line and ID: a heading that is not `#### STD-XX-NN · rule`, a bad area or ID, a missing required field (Why, Scope, Pattern / part,
Checked by, See it, Status), a Scope that is not House, Family or Game, a pattern that is not P<n> or `-`, an Impact outside the five words, an
unknown field, a field given twice, an unknown Checked-by word (`vibes:` in a term position), an ID defined twice. A ` + ` inside a judge's text is
kept in that term; only a ` + ` followed by `word:` or `contract-N` starts a new term. A fenced code block (the README's example) is skipped.

## Sample output

`--standard chai-tray --run /home/user/nani-jo-ghar/build/screenshots/sandbox/frozen-chai-20261107` on the fixtures' standard (the real
`docs/design-language/standard/` was not in this worktree), with the fixtures' saved checks, audit report and verdicts:

```
## Counts per domain
| Domain | Rules | Pass | Fail | Judge | Gap | Not run |
| B Play | 5 | 0 | 3 | 1 | 0 | 1 |
| D Guidance | 7 | 1 | 2 | 1 | 1 | 2 |
| **All** | **12** | 1 | 5 | 2 | 1 | 3 |
| STD-B1-02 | Backgrounds are in proportion and sharp | House | **fail** | contract-11 fail (1 break: page: background ...counter-wm-s17.webp ...) | Zafar, 6 Nov: ... |
| STD-B1-01 | A light on a small part ... | House | judge | contract-53 pass; judge: the shrink's motion... judge | "make it a generalizable ..." |
```

The frozen chai run gives exactly its one real break (contract-11, the low-res counter at L4 1920x1080), 44 of 44 pages chai-tray, 77 checks.

## Proof

Lighter checks this sprint (Zafar, 7 Nov, decision 3): no browser, no evidence, no contract run, no judge.

- `node --test build/tools/review/standard.test.mjs`: 16 pass, 0 fail (parser fields, optional last line, retired, term splitting, unknown word, malformed blocks
  with file and line, scopes, per-game breaks, not run, report shape, the CLI end to end).
- The CLI on the frozen run with the fixtures' standard: the table and counts print, the report is written; on the real folder path (absent here)
  it exits 2 with a one-line message and does not crash.
- `node build/tools/review/checks.mjs --only unit,words,static,leak,bump,specs,docs,recordings,fixlist,art,size` (no `load`: it needs the browser):
  unit 92 files, 661 pass, 0 fail; words, static, bump, specs, recordings, fixlist, art, size ok; docs failed once on my first `docs/tools.md` wording
  (it named the standard folder path, which is not in this worktree yet), fixed and `docs.mjs` now says "within every limit". One red that is not
  mine: leak `snap` (g1 level 1, oracle 100%, blind 1.1%) in the full run, and a rerun timed out under the other builders' load; I touched no game code.

## Open

- `standard.test.mjs` is not in `checks.mjs`'s unit list (checks.mjs is not this session's file): the orchestrator adds it.
- Not yet run on the five builders' real pages (they are not in this worktree): at the merge run
  `node build/tools/review/audit.mjs --standard chai-tray --run <the newest chai contract run> --run-checks --quiet` once; the first real malformed
  list is the format feedback for the builders.
- `tool:teachgate`, `shelfshot`, `voicegate`, `kitsheet` are not run until the audit gets steps for them.
