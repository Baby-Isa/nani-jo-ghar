# T1: review and check scripts (decision 44)

No game code or data changed. Tools in `build/tools/review/` and `build/lint/words.mjs`; `--help` on each; table in `docs/architecture/testing.md` (Tools). Tests: `review.test.mjs` 6 pass, lint tests 9 pass.

| Tool | Command | Saves | Proof |
|---|---|---|---|
| Shot diff | `shotdiff.mjs` | reviewers see only changed shots; hashes, never images | Three real runs of one commit: clinic waiting 0 changed each time; Cook chai-tray has 3 timing states that differ between single runs. Approved from two runs, the third reports 0 changed |
| Touched mapper | `touched.mjs` | listing flows by hand | `css/shared/order-card.css` gives 54 flows (Cook, clinic cards); heal-cut file gives 3; docs give none |
| Regression lookup | `regress.mjs <flows>` | grepping 396 rows | `clinic:heal-cut` lists CLN-32, 45, 46, 74 and the all-heal rows; `--stdin` takes the mapper |
| Word checks | `build/lint/words.mjs` | four checks in one pass, report-only | 229 literals in game code, 6 misspelt variants, 35 words with no clip |
| Status counts | `statuscounts.mjs [--write]` | rebuilding the status table | Shows the table is stale; not written (`status.md` isn't mine) |
| Report skeleton | `skeleton.mjs <name>` | typing the proof section | Run on a real run |
| Leak harness | `leak.mjs <config>` | one loop, a config per game | Same output as the heal-cut and heal-knee scripts (kept) |

Gaps: no approved manifest is committed (the reviewer approves after looking). Cook's timing states need approval from two runs. Word check never blocks without `--strict`.
