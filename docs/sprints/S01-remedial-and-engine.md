# Sprint 01: remedial and engine

**Status:** open until the publish to `main` and Zafar's play (written 5 Oct 2026 from the work so far)
**Opened:** 30 Sept 2026 (the pause for the reorganisation) · **Closes at:** the publish after C4 and the orchestrator's `/review`

## Goal
Cook and the clinic run on the new core, the shared kit and the language engine; all remedial work from the refactor is done; the docs and tools make the next sprint cheap. Then Zafar plays.

## Budget
None was set: sprints began with decision 49, at the end of this chapter. The nearest numbers: briefs of $18–25 for a Sonnet docs session, and Opus high for the Cook host (C4). Record the true spend at close.

## Sessions (reports in `build/reports/`)
- **Brain and design:** step 1 (rulebook, `CLAUDE.md`, QA checklist, regression list; 1 Oct), step 2a (target model; `step-2a.md`), step 2b (engine design; `step-2b.md`).
- **Refactor, step 3 (R0–R6):** clean slate, the checks (sandbox, layout lint), the core, the shared frame and kit, the plug-in host and build guide, Cook onto the framework (R4), the clinic onto it (R5), gate prep (R6); the gate run (`step3-gate.md`); R7 (leftovers, decision 45).
- **Gate fixes:** C1 (clinic polish), G1 (gate fixes), F1 (the gate's 17 Cook findings and 3 phone card-scroll slips), C3 (Cook ready to play), C4 (Cook mounted through the shared host).
- **The engine, step 4:** 4a (core), 4b (filled with everything known), 4d (Cook onto it), 4e (the clinic onto it), E1 (guessed forms shown as drafts).
- **Words and art:** W1, W2 (Mum's 5 Oct words in and playing), A1, A2 (the girl's clinic art, cut and wired).
- **Tools and docs:** T1–T3 (18 scripts, 8 project skills), the Fable docs audit, D1 (this rewrite and the sprint structure).

## Small decisions (sprint-only; the lasting ones are in `docs/decisions.md`)
- **19 (1 Oct):** keep building the clinic, ideally finished before the doctor's visit of about 9 Oct; he plays every heal game, so the clinic must look better than Cook today.
- **21 (1 Oct):** the bowl errand is retired; step 3 runs as the lean plan, with R4 (Cook) and R5 (the clinic) side by side; Mum's 1 Oct session uses Round 4.
- **23 (1 Oct):** R3b (one game host, mode and arc formats, a build guide) goes back into step 3.
- **28 (5 Oct):** C1 and G1 run side by side on the top model, neither publishing; one publish after the gate. Upgrade bonus coins (no numbers yet) and Cook's tablet layouts (CK-TAB-01) wait.
- **30 (5 Oct):** what Mum's 5 Oct answers settle for the engine: describing words agree in four forms (*wadho / wadha / wadhi*, and *wadhe* before "with / in / on"); a he-word in *-o* takes *-e* before a postposition; "of" agrees with the thing owned; "be" is *aiya / aiye / aayo / ai / ain*; two "we"s (*pa*, *asa*); an unknown thing takes the he-form. Spellings stay drafts until Zafar ticks them (`grammar-notes.md` §40–§55).
- **31, 32 (5 Oct):** all eleven spellings from Mum's recordings confirmed except cold, which is *thundo*; red is *laal* (long aa), renamed everywhere W1 wrote it.
- **35 (5 Oct):** after the gate, fix all 17 new Cook findings and the 3 phone slips (F1); red pepper is *laal marcha*; the finished gate, W2 and A1 sessions are closed.
- **37 (5 Oct):** the girl's finished art (part B, with her props) is enough to publish the clinic; the other five patients (part C) and the drop machine (part D) are stitched in when they land.
- **38 (5 Oct):** closing the chapter: Cook and the clinic on the core is enough, parked modes move when their turn comes; 4a and 4b run now; 4c is a gap reporter only (the simulator waits until whole arcs are settled, so recorded phrases never change); shims go before Zafar plays; the docs rewrite closes the chapter.
- **42 (5 Oct):** 4d and 4e run now, before Zafar plays; the engine's data stays in `data/lang/`; the 42-row clash list becomes one sheet for Zafar and Mum after play.
- **43 (5 Oct):** the art run pauses until after play; the next run is faster (judge each image as it lands, never leave a window idle); the Chrome block is rewritten first (T2).
- **44 (5 Oct):** build all the token-saving scripts and skills now (the 18-item list).
- **45 (5 Oct):** all remedial work is done before play (Cook through the shared host, every step 3 leftover, every gap the new tools reported); gameplay redesigns (clinic D15a–i, bulb timing) and numbers Zafar must choose are not remedial.

## Outcome
C4 (6 Oct): Cook is a host plug-in: its ~50 scripts are ES modules on one namespace, it mounts and unmounts in an element (five mounts in a row leave nothing behind) and no station iframe remains.
Shared fixes it needed: `onboard.js` no longer blocks presses during its step pause (the daar smoke now passes), plus `frame.js` and `fit.js` unwatch.
Not moved: Cook's title, days, day's end, shop and book onto shared shell screens (missing pieces named in `build/reports/c4-cook-host.md`); `bump_version.py` should map `js/cook/`.
To fill at the close: the publish commit, the open rows by mode, the spend. At writing (5–6 Oct): everything above is done except C4's review, D1's Fable review and the publish. Open rows are in `docs/status.md`.

## Look back (three lines; a draft for Zafar to change at the close)
1. Reports and rules made the sessions repeatable; the engine landed early (4a, 4b) so Cook and the clinic moved onto it before play.
2. Docs drifted: three layers of status, a decisions log that stopped at 27, 44 "Stale points" boxes. Cost: tokens in every session.
3. Change: work in sprints, with one file per sprint and `/sprint` to open and close it (decision 49).


## Closed 6 Oct 2026, 02:30 UK
Published to `main` (`6f6fd16`) after the full check (`build/reports/s01-review.md`: 490/493 pages end, 11 findings + 2 stalls fixed by F2, re-check passed).

**Look back:** (1) The engine and the tools landed far faster than estimated; costs ran over on 4b and 4d when scope grew mid-session. (2) Builders kept running hour-long checks; decision 50 now caps them at 15 minutes. (3) Sessions in default permission mode stalled on prompts; launch in auto mode.
