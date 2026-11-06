# Overnight run, 6 Nov 2026: the morning report

Everything is on branch `ccr-1f71c98a-wwowh8` (pushed). Every report had a Fable second read or judge; flaws first in each.
Your launch edits are in the brief: no chai standard fill; token size steps, not true sizes.

## What's done, and what isn't live

1. **The pills fit their word (task 1): built and judged, not live.** Each pill is as wide as its own word, one scale per row,
   never closer than 5 CSS px (before: 3.9). Words, before → after: 740x320 L3 10.9 → 12.1, L4 8.6 → 9.6; 930x430 L4 11.7 → 13;
   971x318 L4 12.9 → 13; laptop and big screen unchanged (already over 13). Fable: PASS (`build/screenshots/sh219/judge/`). Chai
   contract run: 0 breaks (one bulb-timing break under load, clean on two reruns). New tool: `build/tools/review/pillcheck.mjs`.
   **The publish was refused by this session's permission check** (pushing to `main`), so I stopped there and didn't work around
   it. **Your step:** say "publish" in this chat and I'll run `/publish` (gate forced on your word, as on 5 Nov).
2. **The colour and look tool (task 2): built.** `build/tools/art/artcolour.py`: main colours against Sanzo Wada's 159 (vendored,
   MIT) and the house family; light direction, white halo, baked shadow, batch consistency, size class; contact sheets. It's wired
   into `artjudge.py` and every paste block now names the house colours and the edge line. Retrospective of 2,248 pictures:
   [art-retrospective-2026-11-06](art-retrospective-2026-11-06.md). After Fable's view, the tool is being taught a solid-shadow
   test (the chai pouring pan's dark crescent slipped through), "shipped" by reference, and a fast check of changed pictures at
   every push (note below when it lands).
3. **Fonts (task 3): options, nothing changed.** [fonts-across-the-game-2026-11-06](fonts-across-the-game-2026-11-06.md): every
   surface, four options mocked on the real screens at five sizes. The big find: one Kutchi word is drawn in three faces in one
   chai round (card Fraunces, Nana's bubble Baloo 2, pills Nunito).
4. **Sound and juice for chai (task 4): the map and plan.** [sound-and-juice-chai-2026-11-06](sound-and-juice-chai-2026-11-06.md):
   12 principles with sources, every moment in chai, the chai version's plan, and the 4-prompt juice art pack (sparkle, steam,
   tea drops, a gold burst). Found: no shared button has ever made its tap sound (SH-221).
5. **The stove family's art run (task 5): the list and the block, ready to run.** [stove-art-400-2026-11-06](stove-art-400-2026-11-06.md):
   478 items (346 to draw: 294 new, 52 redo), 42 sheets, about 3.5-4 hours in three sittings, about 40 minutes of your own time.
   Kutchi only from the lexicon and Mum's notes (Fable checked all 276: none invented). Every dish has a one-line look. The block
   names no religion or community and runs with nothing from you: `docs/design-language/art-plans/s17-stove400-chrome-block.txt`.
6. **Characters from real people (your question):** [real-people-art-2026-11-06](real-people-art-2026-11-06.md). Yes, Nani and
   the doctor read less AI-made, but it's the process (a locked face, specific features), not the photo: the girl is from the
   locked lineup and still came out as the stock cartoon child because the prompt asked for "large expressive eyes".
7. **New fix-list rows:** SH-221 (shared buttons' missing tap sound), SH-222 (the order card's English at 7.9 px on phones).

## Decisions ("yes to all except ...")

**The pills**
1. 740x320 at L4 stays at 9.6 px: ten pills don't fit that row at 13. Options: (a) leave it and judge on your phone; (b) at L4
   on the smallest phones, the word pill drops its speaker icon (the word itself is the button, about 12.5 px); (c) two rows of
   pills. **Recommend (a) now, (b) if it still reads small to you.**

**The size rule (your edit)**
2. **Keep your 100 / 90 / 80 of the slot height, plus one floor: no shelf item under 40 CSS px tall at 740x320.** My view: the
   steps are the right idea (enough to say "smaller", never enough to hide what's in a spice jar). Task 5 suggested 100 / 92 / 85;
   Fable found the difference is 1-2.5 px on a phone, which no one sees; the floor is what keeps the jars readable. **Recommend yes.**
3. The class lives in the game's data, and the art draws every item the same height (so the steps are exact on every screen).
   **Recommend yes.** (Fable's retrospective suggested a centimetre height per item; that's true sizes again, so I've left it out.)

**Stove art run (task 5)**
4. One lid for every glass jar (the pale oak screw lid of the approved bare jars); plain steel tins. **Recommend yes.**
5. Run part A (the chai shelf's new sheet) alone first; you look before the rest. **Recommend yes.**
6. Keep the bank of future dishes (45 items) in the run, last. **Recommend yes.**
7. Swap chai's shelf jars in one fast-lane change once that sheet is cut and judged. **Recommend yes.**
8. Loose food on magenta, everything else on grey. **Recommend yes.**
9. Ask Mum for the 35 missing shelf words in Round 7. **Recommend yes.**
10. Cakes and the mithai platter only as celebration food; no vanilla (alcohol). **Recommend yes.**
11. Two bank dishes' looks (gos tarelo, kalyo pau) need Mum's or your check before their sheet runs. **Recommend yes.**

**Colour and look tool (task 2)**
12. The clinic's sky-blue toothbrushes stay; new art is held to the house look. **Recommend yes.**
13. Light, colour and batch lines are flags; only a baked shadow fails. **Recommend yes.**
14. The house swatch strip goes with the stove run's prompts (switched on; its first sheet is checked for a painted strip). **Recommend yes.**
15. Redo first: the chai shelf as one batch (it is part A of the stove run); re-cut the thermometer belt's shadow. **Recommend yes.**

**Fonts (task 3)**
16. One face for a Kutchi word everywhere it appears. **Recommend yes.**
17. **Which face: C, Fraunces for every Kutchi word** (your card's face; on a phone's close-ups the serif pills read as clearly as
    the sans, and darker). Fable and the builder agree on C; Fable's safe second is B (Nunito everywhere: no reflow, already loaded).
    Andika's school "a" lost the one measured test of an infant face. Look at `build/reports/fonts/closeups.webp`. **Recommend C.**
18. Load a true italic now: only the Nunito italic, since every grey line is grown-up English (Fable's change: no Fraunces
    italic, and the farm's label goes upright). **Recommend yes.**
19. Host the fonts in the repo with the face change. **Recommend yes.**
20. No font named outside the type tokens (clinic, home, who pages), and widen the check. **Recommend yes.**

**Sound and juice (task 4)**
21. The 12 principles become the game's sound rules (with level 1's one-time "oh oh" as the written exception). **Recommend yes.**
22. Build the chai version next sprint, with a lab page of every sound first so you hear them before any goes in. **Recommend yes.**
23. A sparkle on the full glass and a gold burst behind the serve's stamp (every glass gets them: progress, not a verdict), drawn
    by name, never through the old "verdict" stubs. **Recommend yes.**
24. Tea drops: a redraw of the splash you dropped, in the tea's colour; run it, you decide on the cut. **Recommend yes.**
25. The end screen's "wrong" note becomes silence. **Recommend yes.**
26. The green zone gets a two-note ding. **Recommend yes.**
27. "Sounds" and "Less motion" switches in the grown-ups' "?" pop-up. **Recommend yes.**
28. No haptics in chai until the app-store wrapper. **Recommend yes.**
29. Run the juice block after the stove block. **Recommend yes.**

**Characters**
30. One stylisation level, set by Nani's face; every face drawn beside her and judged at the sheet; "large expressive eyes" out of
    the templates. **Recommend yes.**
31. Redo Nana, Ma, Ali, the clinic walk-ons and the girl as one lineup run beside Nani. **Recommend yes, as its own art run.**
32. Ask for photos for Nana, Ma and Masi (adults who agree); no new child likenesses yet. **Recommend yes.**

## Launches and cost

| Launch | Model | Tokens (rough) |
|---|---|---|
| Orchestrator: task 1, merges, checks, this report | Opus 5.5, high | ~250k so far |
| Task 2 tool and retrospective | Opus 5.5, high | 340k |
| Task 3 fonts | Opus 5.5, high | 320k |
| Task 4 sound map | Fable 5.1 | 310k |
| Task 5 stove list | Opus 5.5, high | 360k |
| Stove dish looks and blocks | Opus 5.5, high | 185k |
| Tool fixes after Fable | Opus 5.5, high | (running) |
| Fable: pills judge; second reads of 4 and 5; real people; retrospective view; fonts ranking | Fable 5.1 | 27k, 186k, 152k, 147k, 132k, ~150k |

## Implementation plan

Each linked report carries its own (files, steps, checks, size, risk). Order once you've answered: publish the pills; the fonts
change (half a day); the sound lab page then chai's sounds (next sprint); the stove art run (part A first), then the shelf swap.

## Proof

`node build/tools/review/checks.mjs` green at every push; the pills: `pillcheck.mjs` tables and Fable's verdict; the chai contract
run `build/screenshots/sandbox/20261106-0240/summary.md`; every report's own Proof section.
