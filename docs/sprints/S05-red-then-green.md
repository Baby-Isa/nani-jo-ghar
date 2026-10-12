# Sprint 05: fix the reopened list, red then green

**Status:** open
**Opened:** 12 Oct 2026, 22:15 UK · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Every code row in `S05-plan.md`'s packages is fixed and proven by its own probe (red before the fix, green after: decision 86), the changed rows are judged, and the result passes `/review` and goes live on `main`.

## Budget
Approved 12 Oct: about $175–215 and a working day (plan, decision 1). Sessions T $10–14, S $28–35, B $22–30, C $35–45, D $40–50; judging about $15; `/review` and publish about $25. Scope is cut before the budget.

## Sessions
All push to `ccr-a7370759-t0lee7`; briefs in `build/tools/ops/specs/s05*.brief.txt`; owned files disjoint (the plan's table). At most four at once.
- **T, tools** (Sonnet medium, port 8895): the environment (scipy, Python playwright, a SessionStart hook), import errors as tool failures, probes that can't reach their state, the cost-and-speed tooling. Report `s05t-tools.md`.
- **S, shared layer** (Opus high, port 8891): S1 voice after a stop pushed first; talk, bubbles, help; S2 the results and order cards, the ✓. Report `s05s-shared.md`.
- **B, words and leaks** (Opus high, port 8892): the pantry leak (PAN-15), English written for the child, engine data safety, sentences, numbers, borrowed words. Report `s05b-words.md`.
- **C, Cook** (Opus high, port 8893) and **D, clinic** (Opus high, port 8894): wave 2, after T's environment push and S1; Zafar: launch them when ready (12 Oct).

Launched 12 Oct ~22:08 UK: T session_01EK7j3VrkA8wFN1zCVHhmmL, S session_01XUSVnUz6sJiRfmtqDkY8Fn, B session_01XWRyqDADPqVzsoa8hyEzTw.

## Small decisions
- 12 Oct, Zafar: yes to all seven of the plan's decisions: (1) the budget; (2) CK-TAB-01 (4:3 tablet layouts) moves to Sprint 6; (3) CLN-122 closed with the knee framing as it is (decision 83); (4) the word review keeps the English gloss under each word, as designed (F14; confirmed 12 Oct, 22:20 UK; B told); (5) the kadchi, teaspoon and potato cube join the s05 art block as part G (3 images); (6) the multi-language prep moves to Sprint 6; (7) samosa's final ✓ goes where the outcome is already decided (decision 79), so it needs no line.
- The Python modules the probes need (scipy, playwright) are installed by each session and then by a SessionStart hook (T), rather than the cloud environment's setup script, which sessions can't edit.

## Outcome
(At close.)

## Look back (three lines)
(At close.)
