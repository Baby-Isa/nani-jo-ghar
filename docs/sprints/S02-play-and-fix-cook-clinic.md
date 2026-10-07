# Sprint 02: play and fix Cook and the clinic

**Status:** open (opens when Sprint 1 closes with the publish to `main`)
**Opened:** 6 Oct 2026

## Goal
Zafar plays Cook and the clinic on the engine, live on `main`; every point he raises is a regression row the same day and is fixed; the sprint ends with Cook and the clinic ready to call finished (their ideas in `docs/ideas.md` gone through with him).

## Budget
**$200 ceiling, about 7 days** (Zafar, 6 Oct); about $250 with Sessions D and E (Zafar agreed, 7 Oct). Cut scope rather than overrun.

## Sessions
Agreed with Zafar, 6 Oct (decisions 51–65; his answers to both reports' §4):
1. **Guide box vs card table** (orchestrator, this chat, ~$10): every line in every Cook station and clinic stage, what the box and the card say and why; the pantry shown both ways (one card vs two boxes); the samosa card checked against the other stations' rules. Zafar answers it row by row before Session A.
2. **Session A: shared round flow** (Opus high, ~$50, 1.5 days): ticks match the review, wrong always left; redo the wrong item, show-me after three; next step shown at L2+; no extra click when obvious; requests up front; a guide line per step; the bulb translates the guide line and shows numbers; one highlight colour, inset gold, flat ✓; a tap pauses speech; the chef's call-back closing line; "Start over" clears learned words (also behind "?"); the button family on the screens in use; load times; robot test voice at full speed.
3. **Robot voice test** (orchestrator, during A, ~$3): Mum's 10 clips cleaned; the robot from respellings in two voices; Zafar edits spellings and speeds; blind A/B page.
4. **Sessions B and C, in parallel once A is done** (launched without asking again):
   - **B, Cook** (Opus medium, ~$50, 2 days): every Cook row; the coin-jar screen (Zafar's design); the three counter trays; the samosa card (one block per kind) and laid-out strips; diagonal fold swipes keeping the height; Tadka stays in the labs.
   - **C, clinic** (Opus high, ~$50, 2 days): every clinic row; the girl's art through the whole story (other patients wait); ear and eye redesigns; fever number model; boing; tooth plaque and the square drill; the foot wash.
5. **Art run** (ready for Zafar on 7 Oct; ~$15 + his ChatGPT): the kitchen with three trays and Nani leaning (her existing picture); Cook and pantry items; samosa fold frames; clinic items as Fable-planned sprite sheets (6–8 views each, spares); the coin jar in five fill levels.
6. **Session D: re-clip every recording** (Opus high, ~$35; running 7 Oct): every take found, ranked, only takes above the bar; Zafar picks on a review page (decisions 66, 67).
7. **Session E: wire in the new art and modular loading** (after B, C and the art run; ~$35-45): per-game asset manifests for Cook and the clinic, load on choose with prefetch, images at drawn size, and `build/tools/review/loadcheck.mjs` in `checks.mjs` (decision 68).
8. **`/review` and publish** at the end (~$20).
- **Sprint 3:** Mum's Round 5 (*Muke de*, *Muke chai lai de*, "oh oh oh", "ow"…), the fever room tidy.

## Small decisions
- 7 Oct: the robot voice test is closed (decision 66): family voices stay; Mum's cleaned clips won. Next: test recording set-ups, then retakes; Hannah's grandad records the doctor and older-man lines; Zafar and Hannah the children.

## Feedback in
- 6 Oct, Cook (four voice notes): `docs/feedback/cook-playtest-2026-10-06.md`. About 120 points, 22 decisions waiting (§4), 66 new rows and 10 reopened. 
- 6 Oct, the clinic (notes 5, 7, 8): `docs/feedback/clinic-playtest-2026-10-06.md`. About 110 points, 14 decisions (§4), 31 new rows and 13 reopened. Root causes: L2+ steps close only by the next action, which isn't shown (stuck); the girl's art isn't in the story.

## Outcome
Filled in at the close.

## Look back (three lines)
Filled in at the close.
