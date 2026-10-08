# Sprint 03: overnight fix (code, the art through the API, everything wired)

**Status:** closed (8 Oct 2026, at the publish; Zafar's play is Sprint 4)
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
- **On `main`:** 1a6950df (version 20261008T043015Z), 8 Oct ~05:30 UK. Review: `build/reports/s03-review.md` (full gate `s03-gate`, recheck `fix-rq2`: CHECK PASSED).
- **Done:** A (`s03a-shared.md`): one shared request pop-up before every heal game, Cook station and the pharmacy, the real voice stop; B (`s03b-cook.md`): Cook rows, per-station code loading, chai take-back, pour handle, samosa mounds; C (`s03c-clinic.md`): clinic rows, fever room, the old drill back; D (`s03d-art.md`): redo list B1, C10, E2, kadchi, potato, tick, served daar and tadka, taste spots, the girl's four states, all Sprint 2 and heal-v3 art wired. Review: pop-up fits short phones; every clinic stage change stops the voice.
- **Moved on to Sprint 4:** Zafar's play and `/feedback`; voices (USB mic on the grammar, re-records, Mum's Round 5); the other characters' art once he's happy with the girl (decision 71); his L2-L4 pass; the review's flaws list.
- **Open rows:** 31 open or reopened, 257 built and not re-played (`statuscounts.mjs`).
- **Spend:** about $110 against about $280 (A $12, B $10, C $14, D $27, image API $4.48, orchestrator review and publish about $40).

## Look back (three lines)
1. **Worked:** the API art loop with Fable reviewing: 16 calls, $4.48, three failures caught and re-prompted (kadchi, hot face, taste spots) without Zafar.
2. **Cost more than it should:** sessions moved most rows to "built" by reading code in 30 minutes; the claims are unproven until Zafar plays, and the one real new bug (the pop-up scroll) came from the full gate, not the builders.
3. **Process change:** none new; decision 73 (rows in the same commit) held. Keep the full gate before every publish.
