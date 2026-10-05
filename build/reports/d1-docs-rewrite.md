# D1: the docs rewrite and the sprint structure

Branch `docs-rewrite` (not merged, nothing on `main`). C4's integration branch is merged in (overnight-log conflict resolved, both sides kept); architecture and Cook docs updated for C4's final state: ES modules, mount/unmount, no iframes, `onboard.js`/`frame.js`/`fit.js` edits, title/days/shop not yet on shared screens, demo cook-adapter stale, `bump_version.py` not mapping `js/cook/`. S01 outcome has 3 lines for C4.

## Audit steps (commits)
1. Baseline: `statuscounts` and `review.test` (6 pass) run first and last. ✅
2. Archive harvests, step-1, parked modes (stubs left), transcripts: `ce76a75`; overnight log rotated by date, `checkin.mjs` dated: same commit. ✅
3. rules.md cleaned (no station designs, log or open questions; read lists match `brief.mjs`): `84741bd`. ✅
4. decisions sorted, sprints, `/sprint`: `84741bd`, `a475f93`. ✅
5. qa-checklist, regressions (one Source, four statuses): `d5c913c`. ✅
6. Stale boxes removed: `3cc76f6`, `c34dc7d`; architecture ones with `ee16b6f`, `fa57bdd`. ✅
7. CLAUDE.md: `a475f93`. ✅
8. status.md, ideas, README: `ecce2c0`, `9602c8d`, `7bcc34e`. ✅
9. Paradigms to `data/lang/seed/`: `6c26a44` (import_all 0 errors, 57 tests). ✅
10. Architecture, Cook and clinic docs: `ee16b6f`, `fa57bdd`. ✅ updated after the C4 merge.

## Sizes (tokens, bytes/3.8)
CLAUDE.md ~2,950 → ~1,300 (16 non-negotiables identical). decisions.md ~18,800 → ~1,900. rules.md 12,250 → 9,600; sections 1–3 ~2,670 → ~2,760 (not cut; target 1,500 missed). status.md 3,580 → 3,330.

## Archived (never deleted)
rules-harvest*, step1*, step1d-harvest, five parked mode designs, feedback transcripts, gap-analysis, art-how-to, the full decisions logs, Cook and clinic v1 blocks.

## Not done / open
- Sections 1–3 of rules.md not cut to 1,500 tokens.
- find-it and conversations: scoring and spellings fixed in text; story rows still use the old five-arc numbering (rebase note added).
- No `/start` skill. No sandbox run (no game files changed). One line changed in `build/lang/import_seed.mjs` (path), outside the listed files.
- Open items stay in regressions.md, ideas.md, S02 and status.md "Waiting on Zafar"; no new tracking files.
