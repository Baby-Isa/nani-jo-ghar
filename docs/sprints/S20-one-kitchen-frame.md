# Sprint 20: one kitchen frame, four games

**Status:** open (Zafar, 13 Nov afternoon, decisions 22-23: yes to `build/reports/s20-plan.md`, except no cost ceiling and a mistake keeps chai's way).
**Plan:** `build/reports/s20-plan.md` (the draft, the pre-mortem and the challenges beside it). **The frame's notes, its "owner":** `docs/architecture/kitchen-frame.md`.
**Progress to Zafar:** every half hour (from 07:30 UK on 14 Nov). **Deadline (Zafar, 14 Nov, decision 28):** every stove-top game done by midnight Sunday 16 Nov UK.

## Goal
In Zafar's words (13 Nov): settle chai and record exactly how it looks; move chai into the three layers (its shared pieces in the shared kit; the middle "stove game" layer as a template that fixes the side panel, the bottom row and the open play area, with guidelines for placement and minimum and maximum sizes inside it; chai's own stove, pans and tray in chai's room); prove chai is unchanged in the new structure; then move eggs, maani and corn onto it, one at a time.

- The play area and bottom row come out of chai (steps 1-2). The size guidelines are set when maani joins (step 4), and two screens in one round when corn joins (step 5), so the rules come from several games, not chai's taste alone.
- The round's logic (when lights come, stuck help, serve, well done, redo) moves in Sprint 21, designed from these four games.
- **The exit test:** one frame number changed (the gap above the bottom row), all four games move by it, and no game's file was edited. Then one publish, his play and a child's play.

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
| P1 | Zafar's chai decisions answered; Mum's words in as data | done | decisions 22-23; Mum's words merged with P2 |
| P2 | Chai settled: its three faults, SH-286 (the dish card is the order's own pop-up), Mum's words; one line per kind of change for Zafar; re-freeze on his yes | built, merged | `build/reports/s20-p2-chai.md`; three of its faults were checks reading wrong (fixed by the orchestrator: contract-37, -119, -124); the page error fixed (Onboard.lightBack). Next: Zafar's yes to the change list and the glass's clink, then the re-freeze |
| P3 | The lock on the door: the checks that pass today (fast checks + 161 contract checks) become a gate, and a merge script refuses any change that fails one | done | the gate on the final chai (gate-20261113T2122): checks pass, contract pass (0 blocking over 38 pages), boxes differ only by SH-289's headline until the re-take; its first run caught two real faults (contract-80, -83: s20-p2c-chai, merged). Left: the real refusal of a broken branch |
| P4 | The measuring tool: freeze the game at six moments and record exactly where everything sits (proven on chai as it is; one session) | done | `boxes.mjs --prove`: chai identical 3 runs x 8 pages, 4 planted faults caught, 4 min a run; reference `build/frozen/boxes/chai-tray/` |
| P5 | The geometry rules (fail first on SH-277 and CK-112, and the planted faults) | done | `boxes.mjs --rules`: 10 rules, 7/7 planted faults caught, SH-277 caught in eggs, CK-112 on its old code; chai fails tap-size, headline, text-whole (to fix before the reference: SH-288, SH-289) |
| P6 | Chai's 12 reference pictures. **Zafar, review point 2** | next | chai's last fixes merged (s20-p2b-chai: SH-287, -288, -289, decision 25; all 10 rules pass on chai); waits for Zafar's yes to the change list and the glass clink, then the re-freeze (frozen run and boxes) and the 12 pictures |
| P7 | Park the rows ("waits for the frame") | done | 103 kitchen layout and look rows tagged "waits for the frame"; rows about Kutchi, sound, voice, a stuck game or an upset child left open (the four fix-now classes) |
| 1 | Chai's play-area lines move out of chai into the frame, unchanged; chai asks the frame for its play area; every box proven unchanged | waits | |
| 2 | Chai's stove, pans and tray are measured from its play area, not the screen; every box proven unchanged | waits | |
| 3 | Eggs joins. **Zafar, review point 3** | waits | |
| 4 | Maani joins. **Zafar, review point 4** | waits | |
| 5 | Corn joins. **Zafar, review point 5** | waits | |
| 6 | The guard rails at zero for four games | waits | |
| 7 | The exit test. **Zafar, review point 6** | waits | |
| 8 | Close: the full gate, `/review`, publish, his play, a child's play | waits | |

## Proof
Plan and its challenges: `build/reports/s20-plan.md`, `s20-plan-draft.md`, `s20-plan-premortem.md`, `s20-plan-challenges.md`; decisions 20-23 in `docs/decisions/2026-11-10-overnight.md`; starting numbers from `build/tools/review/frame-counts.mjs`.

## Open
- The geometry rule pill-clear is not steady on chai: the count pill sits 3.8-4.3 px above the hob (at least 6) at L1 mid-cook, at 740 in 3 of 8 runs and at 930 once. Trace before the rules block (by design or a fault, and why it varies).
