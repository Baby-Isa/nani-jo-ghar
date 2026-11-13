# Sprint 20: one kitchen frame, four games

**Status:** open (Zafar, 13 Nov afternoon, decisions 22-23: yes to `build/reports/s20-plan.md`, except no cost ceiling and a mistake keeps chai's way).
**Plan:** `build/reports/s20-plan.md` (the draft, the pre-mortem and the challenges beside it). **The frame's notes, its "owner":** `docs/architecture/kitchen-frame.md`.
**Progress to Zafar:** every half hour from 14:00 UK (a scheduled check-in posts the table below).

## Goal
Chai, eggs, maani and corn get their play area, bottom row and worktop from one kitchen frame pulled out of chai. **The exit test:** one frame number changed (the gap above the bottom row), all four games move by it, and no game's file was edited. Then one publish, his play and a child's play.

## Rules this sprint
- Fixed meanwhile only: blocks play, wrong or stitched Kutchi, a missing sound, upsets a child. Everything else waits for its game's join.
- Green means zero, enforced by the merge script (from P3). Only Zafar's written yes moves a check to the advisory list.
- One frame builder at a time; never more than two builders on this machine; timing checks run alone.
- Builders never touch a check, a probe, a reference picture or a row's status.
- At most four pictures to Zafar in chat per step, before the long checks.
- Each passing step is merged and tagged (`s20-<step>`). A new chat at each of Zafar's review points (`/handover`).
- Every launch states model, effort and cost; no cost ceiling (decision 22).

## Steps (status · proof · next)

| Step | What | Status | Proof / next |
|---|---|---|---|
| P0 | The starting numbers; this file; the frame's notes | done | `node build/tools/review/frame-counts.mjs` (13 Nov: chai 29, eggs 12, maani 15, corn 11; flow.js names games on 31 lines) |
| P1 | Zafar's chai decisions answered; Mum's words in as data | answers done (22-23); Mum's words with P2 | |
| P2 | Chai settled: its three faults, SH-286 (the dish card is the order's own pop-up), Mum's words; one line per kind of change for Zafar; re-freeze on his yes | running | builder `s20-p2-chai` (Opus, high, about $25-35) |
| P3 | The blocking gate (fast checks + the 161 clean contract checks) and the merge script | waits for P2 | |
| P4 | Stand still, read the boxes, take the pictures (one session) | running | builder `s20-p4-boxes` (Opus, high, about $60-80) |
| P5 | The geometry rules (fail first on SH-277 and CK-112, and the planted faults) | waits for P4 | |
| P6 | Chai's 12 reference pictures. **Zafar, review point 2** | waits for P2-P5 | |
| P7 | Park the rows ("waits for the frame") | with P3 | |
| 1 | Chai's play-area lines move, unchanged | waits | |
| 2 | Chai's room reads only its box | waits | |
| 3 | Eggs joins. **Zafar, review point 3** | waits | |
| 4 | Maani joins. **Zafar, review point 4** | waits | |
| 5 | Corn joins. **Zafar, review point 5** | waits | |
| 6 | The guard rails at zero for four games | waits | |
| 7 | The exit test. **Zafar, review point 6** | waits | |
| 8 | Close: the full gate, `/review`, publish, his play, a child's play | waits | |

## Proof
Plan and its challenges: `build/reports/s20-plan.md`, `s20-plan-draft.md`, `s20-plan-premortem.md`, `s20-plan-challenges.md`; decisions 20-23 in `docs/decisions/2026-11-10-overnight.md`; starting numbers from `build/tools/review/frame-counts.mjs`.
