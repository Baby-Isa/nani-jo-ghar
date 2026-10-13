# Sprint 05: fix the reopened list, red then green

**Status:** open
**Opened:** 12 Oct 2026, 22:15 UK · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Every code row in `S05-plan.md`'s packages is fixed and proven by its own probe (red before the fix, green after: decision 86), the changed rows are judged, and the result passes `/review` and goes live on `main`.

## Budget
Approved 12 Oct: about $175–215 and a working day (plan, decision 1); raised 13 Oct to about $270 (decision 90). Sessions T $10–14, S $28–35, B $22–30, C $35–45, D $40–50; judging about $15; `/review` and publish about $25. Scope is cut before the budget.

## Sessions
All push to `ccr-a7370759-t0lee7`; briefs in `build/tools/ops/specs/s05*.brief.txt`; owned files disjoint (the plan's table). At most four at once.
- **T, tools** (Sonnet medium, port 8895): the environment (scipy, Python playwright, a SessionStart hook), import errors as tool failures, probes that can't reach their state, the cost-and-speed tooling. Report `s05t-tools.md`.
- **S, shared layer** (Opus high, port 8891): S1 voice after a stop pushed first; talk, bubbles, help; S2 the results and order cards, the ✓. Report `s05s-shared.md`.
- **B, words and leaks** (Opus high, port 8892): the pantry leak (PAN-15), English written for the child, engine data safety, sentences, numbers, borrowed words. Report `s05b-words.md`.
- **C, Cook** (Opus high, port 8893) and **D, clinic** (Opus high, port 8894): wave 2, after T's environment push and S1; Zafar: launch them when ready (12 Oct).

Launched 12 Oct ~22:08 UK: T session_01EK7j3VrkA8wFN1zCVHhmmL, S session_01XUSVnUz6sJiRfmtqDkY8Fn, B session_01XWRyqDADPqVzsoa8hyEzTw.

12 Oct ~22:50 UK check-in: T's environment push and S1 are in (S1: the voice layer stops everything; what remains is Cook's call-back after stage-end, sent to C, and a probe window fix, sent to T). C launched: session_01K5WMF1REU4yapBpc1zDJtA (with the vessel-meta and test_cook rows T's run left failing on the game). D launches when T finishes (at most four at once).

12 Oct ~23:08 UK: T finished (`s05t-tools.md`, about $12 est.): 141 open/reopened, 194 built. D launched: session_01SuCgFX8reK5svPdRJgYSN3 (stop 05:15 UK; with the clinic half of SH-66 and the clinic rows T's probes now reach). Left for the orchestrator or `/review`, with no tool owner now: SH-64 needs a real-pace probe (its fast-mode PASS shows no cut-off); CK-12 and MOD-01 need `bg_align_check.py` spec arguments (`day relights`).

12 Oct ~23:31 UK check-in: **S finished** (`s05s-shared.md`, $13.3): SH-54, SH-67 built; CLN-69, SH-61 sheets to judge; 14 rows still red, mostly on probes (T) or Cook (C). **B finished** (`s05b-words.md`, $16.1): PAN-15, FL-03, LNG-03, LNG-13, SH-52, SEK-12, SAM-15 built, 5 spec fixes; SH-13, SH-70, PAN-02, CK-22, LNG-01 still red (T, Mum, C). Their requests went to C (nine items) and D (SH-41). The probe requests have no owner since T finished: T2 brief written (`s05t2-probes.brief.txt`), put to Zafar. C and D running.

12 Oct ~23:50 UK: Zafar: yes to all. T2 launched: session_015wpUQ61qwSUMFnDWiD6TCK (Sonnet). Decision 88 sent to C (PAN-06) and B (the borrowings). Art parts G (kadchi, teaspoon, potato cube, and the daar chopped-veg bowl: decision 90) and H (jar picture stickers) to be written into `s05-paste-block.txt` before his art run. SH-16 held back: the closed card's eye is the counted 'look' of rule E25, a mechanic, so it goes back to Zafar before anything is removed. Count: 130 open or reopened, 205 built (was 145 / 188).

12 Oct ~23:58 UK, Zafar (decision 89, rule A30): no publish until every fixable row is fixed and proven; no play-time deadline. C and D told: their stop times aren't deadlines; relaunch fresh if context runs long. SH-16: the closed card's peek becomes a small bulb with no counter (decision 57), so it goes to S round 2. **Plan to the finish:** T2 sorts probe faults from game faults → S round 2 (shared: SH-16 and every real shared failure T2 finds) → a C2 or D2 round for anything C or D leave fixable → judge changed rows → full check, `/review` → publish only when nothing fixable is left.

13 Oct ~00:10 UK: **C round 1 in** (`s05c-cook.md`): 21 rows built as sheets to judge, 20 open (17 on probes or checks, sent to T2; SH-66 window, T2; DAAR-07 to Zafar: counter piles or a bowl). C now on S's nine requests and PAN-06. B did the eight borrowings (fa8124d). For round 2 (no owner yet): at L3 the pop-up writes every row (E12; shared, S2); the pantry reads its lines twice (fetch.js, B's file); the legacy Roll and Fill tiles still use drawn art.

13 Oct ~00:15 UK: Zafar: yes to all (decision 90). S2 launched: session_01PAVt2vAGXM7KqifqYCrBrj (Opus high; SH-16 as a small bulb, the L3 pop-up rows, then T2's list of real shared failures). B resumed for the pantry's double read. T2 also makes the tool lessons permanent: a 'Probe pitfalls' section in evidence-loop.md, `evidence.mjs --lint-specs` in checks.mjs, and a standing brief line (a new spec must lint clean and its first red run must show it reached its state). C2/D2 are pre-approved within the ceiling and launch from the check-ins as needed.

13 Oct ~00:35 UK: **D finished** (`s05d-clinic.md`): 20 rows to judge; SH-41's clinic half fixed (the bulb never opened a closed card). Open, routed: probes LNG-02, SH-41, CLN-11, -12, -45, -48, -117 and contract-11's mid push-in samples → T2; CLN-111's `.rs-again` and Say's placeholder tags → S2; CLN-54 (recipe rows need an engine form) → B; art: CLN-25, CLN-81 (doctor, part B), CLN-38 (household item pictures), ART-05 (Cook's chai marble worktop at 1.59 px/px); Zafar: CLN-120, CLN-85. B fixed the pantry's double read (PAN-16).

13 Oct ~00:40 UK: decision 91 (fever names the effect through L3; CLN-120 closed by design). B answered CLN-54 (b2cca43): the engine already builds each drinks row as a sentence from Mum's DoIt frame; the calls for taste.js are in B's report; honey is a to-record gap; no stir row. **D2 queue** (launch when T2 reports its clinic game failures): CLN-54 with B's calls, plus every clinic row T2 finds failing in the game. Zafar asked why the clinic has face circles; answered (keep them only where she's off screen: heal close-ups and the pharmacy), awaiting his word.

13 Oct ~00:50 UK: decision 92 (face circles only where she's off screen; CLN-85 closed). **C round 2 in** (f3fbc44): CK-22 built; SH-56, PAN-09, PAN-06 sheets to judge; cards closed from L3 (F9), bulb 8 s at every level, ✓ glows at once, sekelo groups. Routed: SH-58, SH-44, SEK-03, SH-19, PAN-01, SH-41 probes → T2; SH-09 at 800×360 → S2; the L4 pantry header writing the item → B. Fridge shows 4 of 6 until Mum records juice, butter, cheese, cream, eggs.

13 Oct ~00:55 UK: B fixed PAN-17 (9129115): from L3 the pantry's ask is heard, not written. For `/review`: her hesitation hint after a pause still writes the line (stations.js, C's file); it stays only if it costs a hint like the bulb (decision 80 kept the pharmacy's); if it's free, it's a waiting leak (non-negotiable 6) and goes voice-only in C2.

13 Oct ~00:58 UK check-in: T2's first report in (ev-20261012-232804-aql): SH-48, SH-36, SH-13, SH-16, PAN-02, MOD-01 PASS; ART-18 (talk bob 2.4–3.8 px) → S2; SH-01 (fudino ji chutney) and SH-70 (waits on Mum's *Muke de*) → B. T2 is still on the extras (SH-66 window, vessel meta, SEK-05, legacy re-points, clinic probes, --lint-specs). C idle at ~60% context ($36). **C2 queue** (fresh session once T2 finishes): SH-44 (Cook passes no steps), SH-19 (samosa's own finger, not the shared ghost), SEK-03 (grill L4 stops on a repeated rack tap), the hesitation hint (free = waiting leak), plus T2's Cook game failures. **D2 queue**: CLN-54 with B's calls, plus T2's clinic game failures. Spend so far about $120 of $270 (T ~12, S 13, B ~18, C 36, D ~30 est., T2 and S2 running).

13 Oct ~01:00 UK: T2's extras in: SH-66 PASS (the window bound), the vessel-meta rows SH-33, CHAI-06, MAA-10, CK-02, CK-20, CK-12 PASS, SH-15 and CHT-07 PASS; SEK-05 is a game FAIL (pantry ladder 4 rows vs 3; B checking whose); `--lint-specs`, Probe pitfalls and the brief line landed (26 specs still flagged, T2 working them down). T2 carries on with the clinic and round-2 probes. **D2 launched**: session_01BNft4fjfECbj3XBiuy7vpy (CLN-54 plus T2's clinic failures). C2 brief ready (`s05c2-cook.brief.txt`); launches when B goes idle (four at once).

## Small decisions
- 12 Oct, Zafar: yes to all seven of the plan's decisions: (1) the budget; (2) CK-TAB-01 (4:3 tablet layouts) moves to Sprint 6; (3) CLN-122 closed with the knee framing as it is (decision 83); (4) the word review keeps the English gloss under each word, as designed (F14; confirmed 12 Oct, 22:20 UK; B told); (5) the kadchi, teaspoon and potato cube join the s05 art block as part G (3 images); (6) the multi-language prep moves to Sprint 6; (7) samosa's final ✓ goes where the outcome is already decided (decision 79), so it needs no line.
- The Python modules the probes need (scipy, playwright) are installed by each session and then by a SessionStart hook (T), rather than the cloud environment's setup script, which sessions can't edit.

## Outcome
(At close.)

## Look back (three lines)
(At close.)
