# s08 wave 6D: review tools and the parked modes

Branch `worktree-agent-a39c7dd23139926e1` (base 47458dc2), merged by the orchestrator.

**Changed**
- Task 1: specs and drivers now reach the moments of all 40 rows (14 tool failures, 26 EVIDENCE gaps). New drivers: `replay-tap` (the clinic half of SH-102), `grab-hold` (CLN-173's tweezers), the tooth overfill (CLN-184), the boing take-back on the real drop (CLN-138). The voice timeline window ends 60 lines past the moment (DAAR-26, DAAR-32); a filmstrip counts as changed from a mean difference of 0.02; layout probes that doubled their panels are now `kind: detail`.
- Task 2: `/feedback` and `/review` name L1-L4 per station, the go-on button, the samosa fold and told-before (SH-109, SH-111, SH-116).
- Task 3 (MOD-10): find, snap, dress, monsoon, tidy and who write no English for the child; no mechanic changed.
- For 6A: contract-22, 26 and 35 exemptions, each tested; SEK-19 seeded to a meat order at level 3.

**Open**
- Outside the owns: the rotate card's English removed from `tidy.html`, `who.html`, `monsoon.html` (contract-16 flaked on it).
- Move `grownUps` from `js/cook/flow.js` into `js/shared/` (copied into find, snap, dress).
- contract-26 still breaks on words with no clip (dress "blue dupatta", find "hakro anjir"): Mum's recordings.
- CHAI-25: no pan glow happens in fair play.

## Proof

| Check | Run | Result |
|---|---|---|
| The 40 rows plus SH-102, SEK-19, CLN-173 reach their moments | w6d-h1, w6d-h2, w6d-j | 0 tool failures |
| MOD-10, SH-109, SH-111, SH-116 | w6d-mod10c1, w6d-mod10c2, w6d-k | machine PASS |
| Sandbox unit tests (`contract-w6d.test.mjs` included) | `node --test` | 81 pass |
| `checks.mjs` | before the merge | ok except the known CLN-198 test |

The evidence runs prove the specs reach the moments, not that the rows are fixed: that is the orchestrator's evidence run after the merge.
