# Sprint 20: one kitchen frame, four games

**Status:** open (Zafar, 13 Nov afternoon, decisions 22-23: yes to `build/reports/s20-plan.md`, except no cost ceiling and a mistake keeps chai's way).
**Plan:** `build/reports/s20-plan.md` (the draft, the pre-mortem and the challenges beside it). **The frame's notes, its "owner":** `docs/architecture/kitchen-frame.md`.
**Progress to Zafar:** every half hour (from 07:30 UK on 14 Nov). **Deadline (Zafar, 14 Nov, decision 28):** every stove-top game done by midnight Sunday 16 Nov UK.

## Goal
In Zafar's words (13 Nov): settle chai and record exactly how it looks; move chai into the three layers (its shared pieces in the shared kit; the middle "stove game" layer as a template that fixes the side panel, the bottom row and the open play area, with guidelines for placement and minimum and maximum sizes inside it; chai's own stove, pans and tray in chai's room); prove chai is unchanged in the new structure; then move eggs, maani and corn onto it, one at a time.

- The play area and bottom row come out of chai (steps 1-2). The size guidelines come with maani and two screens in one round with corn, both in batch 1, so the rules come from several games, not chai's taste alone. The other games join in two batches, each run in parallel on separate cloud machines (decision 31, Zafar 14 Nov), the first chosen for what it teaches the frame.
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
- **Zafar's window (decision 33):** 13:00-20:00 UK the orchestrator runs on its own: no waiting for his picture approvals (he sees them after) or decisions (the recommended option, recorded). Outside it, pictures wait for his yes; work that needs no approval carries on.

## Steps (status · proof · next)

| Step | What | Status | Proof / next |
|---|---|---|---|
| P0 | The starting numbers; this file; the frame's notes | done | `node build/tools/review/frame-counts.mjs` (13 Nov: chai 29, eggs 12, maani 15, corn 11; flow.js names games on 31 lines) |
| P1 | Zafar's chai decisions answered; Mum's words in as data | done | decisions 22-23; Mum's words merged with P2 |
| P2 | Chai settled: its three faults, SH-286 (the dish card is the order's own pop-up), Mum's words; one line per kind of change for Zafar; re-freeze on his yes | built, merged | `build/reports/s20-p2-chai.md`; three of its faults were checks reading wrong (fixed by the orchestrator: contract-37, -119, -124); the page error fixed (Onboard.lightBack). Next: Zafar's yes to the change list and the glass's clink, then the re-freeze |
| P3 | The lock on the door: the checks that pass today (fast checks + 161 contract checks) become a gate, and a merge script refuses any change that fails one | done | the gate on the final chai (gate-20261113T2122): checks pass, contract pass (0 blocking over 38 pages), boxes differ only by SH-289's headline until the re-take; its first run caught two real faults (contract-80, -83: s20-p2c-chai, merged). Left: the real refusal of a broken branch |
| P4 | The measuring tool: freeze the game at six moments and record exactly where everything sits (proven on chai as it is; one session) | done | `boxes.mjs --prove`: chai identical 3 runs x 8 pages, 4 planted faults caught, 4 min a run; reference `build/frozen/boxes/chai-tray/` |
| P5 | The geometry rules (fail first on SH-277 and CK-112, and the planted faults) | done | `boxes.mjs --rules`: 10 rules, 7/7 planted faults caught, SH-277 caught in eggs, CK-112 on its old code; chai fails tap-size, headline, text-whole (to fix before the reference: SH-288, SH-289) |
| P6 | Chai's 12 reference pictures. **Zafar, review point 2** | next | Zafar's yes to the change list and the clink (14 Nov). The re-freeze's runs (14 Nov, 04:03 and 04:36) found three check faults, no game faults: contract-121 read the lesson's 30 ms beat as a blocked tap (SH-290), contract-112 read the light's gold line over a cream card as dimmed, contract-84 measured a light stepped aside. All three fixed in the checks, the bad runs still red. The box reader now reads a word pop at rest, so pill-clear fails steadily on chai's real 4 px (parked, see Open). Next: the boxes proved (s20-ref3: three runs identical, 4/4 plants caught) and two frozen runs on the fixed checks, the freeze, the gate at zero, the 12 pictures |
| P7 | Park the rows ("waits for the frame") | done | 103 kitchen layout and look rows tagged "waits for the frame"; rows about Kutchi, sound, voice, a stuck game or an upset child left open (the four fix-now classes) |
| P6b | Chai's five faults fixed before the frame (decision 30): SH-291 with SH-232, the word pop off the hob, CHAI-113, contract-84, contract-116; then chai re-frozen and only the changed pictures to Zafar | running | builder s20-chai-fix (Opus, high) |
| 1 | Chai's play-area lines move out of chai into the frame, unchanged; chai asks the frame for its play area; every box proven unchanged | waits | |
| 2 | Chai's stove, pans and tray are measured from its play area, not the screen; every box proven unchanged | waits | |
| 3 | **Batch 1, in parallel** (decision 31; one cloud session per game, own branch, merged one at a time through the gate): eggs (the shelf, as chai), maani (two stations: the size chain, board and tawa as shares), corn (two screens in one round), daar with chop (a game inside a game, chop also runs in chaat). Each may add to the frame only in the frame's files and its notes; the orchestrator merges frame additions first, then re-gates every joined game. **Zafar checks and gives feedback: review point 3** | waits | |
| 4 | Batch 1's fixes from Zafar's feedback, in parallel by game | waits | |
| 5 | **Batch 2, in parallel:** baking, sekelo (mishkaki-grill), roll-tawa, samosa; chaat with them once chop is on the frame. **Zafar, review point 4** | waits | |
| 6 | The guard rails at zero for every game on the frame | waits | |
| 7 | The exit test: one frame number changed, every game moves, no game file edited. **Zafar, review point 5** | waits | |
| 8 | Close: the full gate, `/review`, publish, his play, a child's play | waits | |

## Proof
Plan and its challenges: `build/reports/s20-plan.md`, `s20-plan-draft.md`, `s20-plan-premortem.md`, `s20-plan-challenges.md`; decisions 20-23 in `docs/decisions/2026-11-10-overnight.md`; starting numbers from `build/tools/review/frame-counts.mjs`.

## Open
- pill-clear on chai (traced 14 Nov): at L1 mid-cook the word pop over the right pan rests 3.8 px (740x320) and 4.3 px (930x430) above the hob, at least 6 wanted. It is pushed against the screen's top, with no room above the hob on a short phone. The box reader now measures a pop where it comes to rest (the earlier wobble was the pop caught mid-rise), so it fails steadily: s20-ref3-r1. Chai's look as approved, not blocking play: parked for chai's join (steps 1-2), where the play area gives the pop its room.
