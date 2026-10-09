# Sprint 04: your feedback sticks

**Status:** open
**Opened:** 8 Oct 2026, 23:50 UK · **Closes at:** the publish to `main`, Zafar's play and `/feedback`

## Goal
Every piece of Zafar's feedback, from every play-test so far, is either proven done in the game (a shot or voice log of the exact state, judged by Fable, not the builder) or on a list he sees before he plays; and his "everywhere" rules are built once in the shared host and enforced by checks over every game (decisions 75, 76).

## Budget
Approved 8 Oct: about $180–200 for phase 1 and the audit. Phases 3–4 are sized from the audit and put to Zafar before they start. Rough whole-sprint figure about $360.
- Phase 1 (tonight, to 08:00 UK): A $45, B $60, C $25 + image API about $10 (cap $20).
- Phase 2: coverage audit of every feedback document (Fable, about $20; tonight); the full contract run and Fable's row audit after A and B land (about $60).
- Phase 3: fix every row the audit fails, grouped by shared component (about $100; to Zafar first).
- Phase 4: `/review` with the contract run, publish (about $40). Then Zafar plays.

## Sessions
All push to `ccr-a7370759-t0lee7`; briefs in `build/tools/ops/specs/s04*.brief.txt`; owned files disjoint.
- **A, contract checks** (Opus high): the sandbox tests his rules in every game and level (pop-up before play, moves on by itself, no voice after its stage, bubbles at the speaker's head, badges in order, no retired art); must reproduce tonight's points on the current build. Owns `build/sandbox/**`, `build/tools/review/**`.
- **B, shared host** (Opus high): the shared lifecycle every game goes through; one voice layer, one bubble placement, one talk animation (smaller bob); tonight's named fixes. Owns `js/**`.
- **C, art** (Opus high, Fable reviewing): the served chaat at the tray's angle without a baked shadow (and every served dish checked); Nani leaning on the counter in every mood, swapped under the same keys. Owns `assets/**`, art data.

Launched 8 Oct ~23:46 UK: A session_01A5BjhwAX18NJCqkcq9kEwW, C session_018V7iXuCWkXhirFUUgkPWXz. B blocked by the orchestrator session's launch permission; Zafar to launch it (brief `s04b-host.brief.txt`). Coverage audit (two Fable readers, this chat): `build/reports/s04-coverage-cook.md`, `s04-coverage-clinic.md`.

9 Oct ~00:15 UK: A done (`s04a-contract.md`: six checks; 8 of tonight's points reproduced on the pre-fix build, the diagnosis bubble breaks but not in the corner; 27 'contract check' rows have no check yet), about $11. C done (`s04c-art.md`: chaat side-on without a shadow, Nani leaning in four moods; CK-21 open for the code's shadow), about $11 + $2.41 API. Coverage audit applied (`8904458`: 28 rows added, 46 rewritten, 25 reopened); now 96 open, 227 built.

## Small decisions
- 8 Oct: Zafar said yes to the five-point plan (no new features until this is done; shared rules plus checks; proof for "built"; the route run before he plays; tonight's fixes in the shared layer), plus the full audit of the regression list and every feedback document.

- 9 Oct: Zafar: yes to the waiting room and diagnosis opening with the pop-up, checks for the 27 'every game' rows, and the art run's four choices (decision 79); knee dots never overlap, bands run dot to dot.

## Outcome
(at close)

## Look back (three lines)
(at close)
