# T1: review and check scripts (decision 44)

Branch `ccr-fcd9dddd-wnywzc`. No game code or data changed. All in `build/tools/review/` plus `build/lint/words.mjs`; each tool has `--help`; the table is in `docs/architecture/testing.md` (Tools). `node --test build/tools/review/review.test.mjs`: 6 pass; the existing lint tests: 9 pass.

| Tool | Command | Saves | Proof |
|---|---|---|---|
| Shot diff | `shotdiff.mjs [--run][--vs][--approve --also]` | reviewers see only changed or new shots (contact sheet), hashes only | Three real runs of one commit (`t1-a/b/c`): clinic waiting 0 changed every time; Cook chai-tray has 3 timing states that differ between single runs (a hint firing later). Approved from two runs, the third run reports **0 changed**. Brightness fades and one-cell blips are tolerated |
| Touched mapper | `touched.mjs [--json]` | no hand-listing of flows | `css/shared/order-card.css` gives 54 flows (Cook and clinic card flows, `first`); a heal-cut file gives 3; docs give none; unknown runtime files widen to all |
| Regression lookup | `regress.mjs <flows>` | no grepping 396 rows | `clinic:heal-cut` lists CLN-32, 45, 46, 74 and the all-heal rows, not foot or boing; `--stdin` takes the mapper |
| Word checks | `build/lint/words.mjs` | G26, non-negotiable 5, clash variants, recording gaps in one pass, report-only | Today: 229 literals in game code (20 Kutchi, 209 English), 6 misspelt variants in 40 places, 35 words with no clip |
| Status counts | `statuscounts.mjs [--write]` | the "Open feedback" table, rebuilt | Shows the table is stale (clinic built 34 → 72) and two prose ids (PAN-01, SEK-09) to edit. Not written: `docs/status.md` is not mine |
| Report skeleton | `skeleton.mjs <name>` | the proof section and QA template, pre-filled | Run on `t1-b` |
| Leak harness | `leak.mjs <config>` (11 configs) | one loop, a config per game | Same output as `build/leak_clinic_heal_cut.mjs` and `_knee.mjs` (knee's accepted exception included); old scripts kept |

## Decisions and gaps
- **No approved manifest is committed:** approving is the reviewer's call after looking.
- Cook's timing states (hint, scrim) vary run to run; approve from two runs.
- Word check: single Kutchi words in code (207) are listed apart, as they may be ids; the clash list's *mirchi* is stale against decision 35b (ignored in the allow-list). It must not block 4d/4e; it never exits 1 without `--strict`.
