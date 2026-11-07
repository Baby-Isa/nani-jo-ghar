# s17-fix-audit: `audit --standard` runs or names every tool the standard cites

Fix 4 of `s17-standard-review-fable.md`. The standard's pages cite 28 tools (`grep -rhoE 'tool:[a-z_]+' docs/design-language/standard/`); the resolver knew five, so 46 terms read "not run: the audit has no step for it". Now none does. Files: `build/tools/review/lib/standard.mjs`, `audit.mjs`, `standard.test.mjs`, `fixtures/standard/run/audit-report-extra.md`.

## The tools, sorted

**Default audit steps (unchanged: sandbox, panel, labcheck, leak, load):** `panelcheck` (`build/tools/review/panelcheck.mjs`), `labcheck` (`.../review/labcheck.mjs`), `leak` (`.../review/leak.mjs`), `loadtime` (`.../review/loadtime.mjs`), `layout` (`build/lint/layout.mjs`, the screen lint the sandbox step runs, so it reads the sandbox result).

**Review tools, now optional audit steps (take the game, exit 1 on a fault):**

| `--only` key | File | Games |
|---|---|---|
| voicegate | `build/tools/juice/voicegate.mjs` (reads the sandbox run's sound log, no browser) | any |
| spkgap | `build/tools/review/spkgap.mjs` | any (`--game`) |
| lightfollow | `build/tools/review/lightfollow.mjs` | any (`--game`) |
| faces | `build/tools/review/faces.mjs` | any (`--game`) |
| tapgate | `build/tools/review/tapgate.mjs` | chai-tray only (lab URL is fixed) |
| pillcheck | `build/tools/review/pillcheck.mjs` | chai-tray only |

**Review tools that judge for the eye (resolve judge, with the reason):** `kitsheet` (`.../review/kitsheet.mjs`, a sheet per shared element), `kitmap` (`.../review/kitmap.mjs`, a map), `shelfshot` (`.../review/shelfshot.mjs`, BEFORE/AFTER shots, no exit 1), `teachgate` (`.../review/teachgate.mjs`, the prototype modes' labs, no Cook game), `audit` (itself).

**Process tools (judge a session; resolve judge, "process tool"):** `publishgate`, `feedbackcheck`, `brief`, `mumsheet`, `mumround` (all `build/tools/ops/`), `evidence`, `stdids` (`build/tools/review/`), `artcheck`, `artblock`, `artcut`, `artdespill` (`build/tools/art/`), `test_cook_mount` (`build/test_cook_mount.mjs`).

## The steps added

- `audit.mjs <game> --only voicegate,spkgap,lightfollow,faces,tapgate,pillcheck`, or `--steps all` (the five defaults plus these six). The default run is unchanged, so its time does not grow. A chai-only tool on another game is skipped with a line. voicegate reads the audit's own sandbox run if step 1 ran, else the newest run covering the game.
- An unknown `--only` key or `--steps` value exits 2 before anything plays.
- Today's report now keeps the rows an earlier run saved: a `--only` run no longer wipes the other steps (`mergeAuditRows`).
- `audit --standard`: a tool the audit did not run reads `not run (run: audit.mjs <game> --only <key>)`; a ran tool reads pass or fail; a chai-only tool on another game reads judge "reads chai-tray only so far"; the report prints the reason on tool terms.

## Not-run counts, chai-tray on `frozen-chai-20261107`

| | Rules not run | Tool terms not run | "no step" terms | Tool terms judge |
|---|---|---|---|---|
| Before | 143 | 75 | 46 | 0 |
| After | 118 | 36 (each names its `--only` key) | 0 | 39 |

222 rules both times: after, 20 pass, 0 fail, 32 judge, 52 gap, 118 not run (the rest wait on checks, probes and the review tools' own runs). The 36 left are runnable review tools nobody has played yet; I ran none (no browser, per the sprint override). Checked by hand: `voicegate.mjs` on the frozen run folder reads 44 pages, 229 voices, 0 overlaps, exit 0.

## Line for `docs/tools.md` (the orchestrator's)

In the audit row (line 24), replace `[--only sandbox,panel,labcheck,leak,load]` with `[--only <step,...> | --steps all]` and add: "Optional steps: `voicegate` (sound log), `spkgap`, `lightfollow`, `faces`, `tapgate` and `pillcheck` (chai only); `audit --standard` reads their result, else prints `not run (run: audit.mjs <game> --only <key>)`; process tools (`publishgate`, `evidence`, `brief`, the art and Mum tools) read judge."

## Proof

- `node --test build/tools/review/standard.test.mjs`: 23 tests, 23 pass (7 new: process tool reads judge, review tool not run names its `--only` key, one that ran reads pass/fail, chai-only reads judge, the report shows the reason, rows merge, bad `--only` exits 2, and every tool the real standard cites has a place).
- `node build/tools/review/checks.mjs --only unit,docs`: `FAIL unit 94 files, 700 pass, 1 fail` and `ok docs: within every limit`. The one fail is not mine: `review.test.mjs` "CONTRACT_ROWS" says `SH-233 names contract-44, not in CONTRACT_ROWS` (a fix-list row in `docs/process/regressions.md` against `lib/regressions.mjs`; neither is in my files). The orchestrator owns it.
- No browser, evidence, contract run, judge or full checks (Zafar, 7 Nov, decision 3). No overnight-log line (skipped by the sprint note).
- Open: the fix-std page edits (tool mis-cites such as `tool:layout tap-small`) are the other builder's; `layout` already resolves either way.
