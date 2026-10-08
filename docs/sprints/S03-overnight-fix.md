# Sprint 03: overnight fix (code, the art through the API, everything wired)

**Status:** open
**Opened:** 8 Oct 2026, 02:30 UK · **Closes at:** the publish to `main`; Zafar's play and `/feedback` are Sprint 4

## Goal
By the morning of 8 Oct, `main` carries a fix for every open row that code or new art can fix, Sprint 2's and Sprint 3's art all wired in, and a full `/review` with its new bugs fixed.

## Budget
About $280 ceiling (Zafar, 8 Oct: the $230 plan plus the art run): A $45, B $55, C $55, D $45 + image API about $40 (cap $60), orchestrator review and publish about $40. Overnight; sessions stop 10:00 UK, publish after the review.

## Sessions
All push to `ccr-a7370759-t0lee7`; briefs in `build/tools/ops/specs/s03*.brief.txt`; owned files disjoint.
- **A, shared** (Opus high): the one shared request pop-up for Cook, the pharmacy and every heal game (CLN-84, SH-64); the real voice stop (CLN-109); shared-screen rows; host.js rows. Owns `js/shared/**`, `css/shared/**`, `js/cook/ui.js`, `js/clinic/kit.js`, `js/clinic/heal/host.js`, `js/clinic/stages/pharmacy.js`.
- **B, Cook** (Opus medium): every code-only Cook row, take-back in 9 stations, per-station code loading, pour handle, samosa mounds. Owns the rest of `js/cook/**`, Cook data except art blocks.
- **C, clinic** (Opus high): every code-only clinic row, the fever room tidy, the old drill back (decision 72). Owns heal games, the other stages, clinic data except art.
- **D, art** (Opus high, Fable reviewing): the redo list (B1, C10, E2), art rows, the girl's states and poses (no other characters, decision 71) through the image API; cut and wire; audit that every Sprint 2 and heal-v3 source is wired. Owns `assets/**`, art data, minimal art hookups.

Launched 8 Oct ~02:56 UK: A session_01NGEQ5G8MP5j85sHKBAemaF, B session_01VLuLT6G5yDMN2s56UMMHVm, C session_0181gDvogwZnBiHEbtcGCuvc, D session_01GsS5kQU7EuaP5x8MwTqpvt.

## Small decisions
- 8 Oct: Zafar: ignore the waiting-room L1 leak (decision 74); square drill out (decision 72); art via the API with Fable (decision 71); voices (USB mic, re-records, Mum's Round 5) and his L2-L4 pass go to Sprint 4 with his play.

## Outcome
Filled in at the publish.

## Look back (three lines)
Filled in at the close.
