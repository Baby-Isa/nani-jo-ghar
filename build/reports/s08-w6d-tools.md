# s08 wave 6D: review tools and the parked modes

Branch `worktree-agent-a39c7dd23139926e1` (base 47458dc2). Not pushed.

**Changed**
- Task 1: specs and drivers fixed so all 40 rows (14 tool failures, 26 EVIDENCE gaps) reach their moments. New drivers: `replay-tap` (the clinic half of SH-102, contract-31), `grab-hold` (CLN-173's tweezers, asked by 6C), the mistake player's tooth overfill (CLN-184), the boing take-back tapping the real SVG drop (CLN-138). Tool changes: the `.md` voice timeline is a 120-line window ending 60 lines past the probe's moment (DAAR-26, DAAR-32); a filmstrip counts as changed from a mean difference of 0.02 (was 0.2); `life:stir-lap` is a known moment. Gaps were mostly panel limits (layout probes doubled their panels): probes now `kind: detail`.
- Task 2: `/feedback` (5a2, 5a3) and `/review` (5b, 5c) carry L1-L4 per station, the go-on button, the samosa fold, told-before; the six greps name those lines.
- Task 3: MOD-10: find, snap, dress, monsoon, tidy, who write no English for the child (pictures, numbers, tips behind the "?", English only under review words).
- Asked by 6A: contract-22 (count lines, pop-up repeats), contract-26 (tap through, to-record words), contract-35 (peeking card), each tested (`contract-w6d.test.mjs`); SEK-19 seeded to a gos/meat order (level 3).

**Proof**
- `evidence.mjs --run` on all 40 rows plus SH-102, SEK-19, CLN-173: 0 tool failures (runs w6d-h1, h2, j). MOD-10, SH-109, SH-111, SH-116: machine PASS.
- `checks.mjs`: all ok except the known CLN-198 unit test. 81 sandbox unit tests pass.
- Evidence runs prove the specs reach the moments, not that the rows are fixed.

**Open / requests**
- Outside my owns, minimal: `tidy.html`, `who.html`, `monsoon.html` rotate-card English removed (3 lines); one catalog entry each for `replay-tap`, `grab-hold` (clinic kinds): 6C may need to merge by hand.
- Move `grownUps` from `js/cook/flow.js` into `js/shared/` (copied into find, snap, dress).
- contract-26 still breaks on gaps with no clip: dress "Nana: blue dupatta", find "hakro anjir".
- CHAI-25: no pan glow occurs in fair play; frames show the pan at every step. SAM-21's fold strip is still at the first swipe; its per-swipe frames show the fold.
