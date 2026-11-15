# s20-b2-samosa: samosa joins the kitchen frame (15 Nov)

Files: `samosa.js`, `samosa.json`, `kitchen-frame.md`. No frame option added. BEFORE evidence: not played at launch.

## What changed
- **Samosa reads only the frame:** its wash and tray band; x positions as shares of `play.w`, unmoved; board and hob centred in `play` (CHAI-89); `bottom`, `view()` and `px` for the pills, word pop and sizes. The old view sums are deleted.
- **The fold's close-up** is the board's middle on the same screen, so its room is the play area's. The fry is its own view, so it gets a fresh area, not `next`.
- **SH-280 (part):** the slotted spoon and its cloth are drawn with the hob and plate as the fry comes up. Before, they popped in after the knob's tap.

**What a child sees:** the spoon is there from the fry's first frame, every level and size; nothing else moves.

## Rows ('waits for the frame', naming samosa)
| Row | State | Proof or reason |
|---|---|---|
| SH-239, SH-241, SH-53, SH-238 | check passing | contract-108, -100, -8, -103: 0 |
| SH-236, CK-82 | check passing | contract-106, -105, -82: 0 |
| SH-245, SH-248 | built | contract-115 0, -123 0; band.test passes |
| SH-272, SH-278 | check passing | contract-127, -126: 0 |
| SH-256 | 0 blocking | contract-114: 0 on the last gate (x2 advisory once, a mound read as swapped) |
| SH-258 | built (S19) | no check |
| SH-280 | spoon built | strips already fade; the blank frame is `St.begin`'s (kit) |
| SAM-34 | layout built (S19) | the eye beside mock 2: the judge's, not mine |
| SAM-40 | waits: kit | the dish closed whole folds the card (`ui.js`) |
| SH-271, SH-284 | waits: kit | the coach's dim (`coach.js`, `onboard.js`) |
| SH-277 | kit | the `#side` rule |
| SH-279 | waits: Sprint 21 | the kit's serve and its Shabash spot |

## Calls taken while Zafar was away
None.

## For the orchestrator: a check fault (not mine to fix)
contract-112 breaks at random on the fold's help light (1 run in 3 on base f794015, same box), though the light hugs the pastry. The screen scan (`contract-s19.mjs:840`) reads the fold canvas's `getBounds()`, not `litBounds` (as `:762` does), and `lightjudge.py:307` breaks the equal tie towards the whole picture. Fix: read `litBounds` there, or let the body win a tie.

## Proof
- **frame-counts:** samosa 0 (was 12), chai-tray 0.
- **Samosa gate**, after merging 41eae54 (gate-20261115T0855-samosa): checks pass 2.3 min; contract FAIL 13.6 min, 1 blocking: the fault above (L2#mistake, 1280). Advisory 16.
- **Chai gate**, after the merge (gate-20261115T0911-chai-tray): checks pass 2.5, contract FAIL 21.7 (1 blocking), **boxes pass 3.5 (identical)**; 27.7 min. The break is contract-112 on the side panel's order card (aadu, lab L4 at 740x320). Not samosa's: before the merge chai passed (21.4 min, 0 blocking over 38 pages).
- **Geometry rules:** cannot run: "No box spec for samosa" (`boxes.mjs`, read-only).
- **Four sizes** (s20-b2-samosa-contract): 8/8 pages end, 0 page errors; `CONTRACT FAILED: 10 breaks (contract-78 6, contract-111 2, contract-109 2)`. contract-109 is at 1920x1080 only: a heap 5 px above chai's line, also on the base f794015.
- **check-change** (`--base 5a52815`, `build/reports/tiers/change-a75811db1c.md`): FAILED, 84 min. Play 18 breaks, base 19. Blocking: -78 x4 and -70 x1, which come and go (base -78 x7); -112; mount and chai's frozen sound (as on base, s20-b1-corn); vessel-meta (a missing chaat picture).
- **Evidence:** the spec names no rows, so there is no before or after folder. **checks.mjs:** 14 steps ok.
