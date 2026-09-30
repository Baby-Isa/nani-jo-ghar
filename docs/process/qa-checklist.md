# QA checklist: the definition of done

Nothing reaches Zafar until every line that applies passes. The design docs say *why*; this file says *how we check*. Each line has an ID, the rule it comes from (`rules.md` IDs, e.g. F7), and how it's checked:

- **auto**: a script checks it (named).
- **eye**: a reviewer checks it on the screenshots.
- **eye → auto**: checked by eye today; the automated check is planned (step 2a: sandbox flow tests and layout lint).

A reviewer who is not the builder fills in the results, flaws first.

## How to run a review

1. **While iterating:** laptop view (1366×768) only, changed screens only, one screenshot each, looked at and fixed. The full review below runs once, before the one push to `main`.
2. Run every **auto** line that applies to the touched modes.
3. Screenshot every visually distinct state, uncropped, at **390×844** (phone), **1366×768** (laptop) and **1440×900** / **1280×800** (16:10 laptops), across levels 1–4.
   - "Every state" means every state that draws something different, not just start, middle and end: a hob heating, turned down, pan lifted, boiled over; 1–4 burners where the count changes the layout; end screens with all right / mixed / none, 0 / 1 / 2 / 3+ hints, new best / good / plain.
   - Each shoot script names its states in its header.
4. Zoom ×2 on the focal object of each shot and go through the **eye** lines. List every flaw first, then write one line per state. "The screenshot exists" doesn't count.
5. Recheck every row of `regressions.md` for the touched screens.
6. Compare side by side (not from memory) with the approved mock-up where one exists (e.g. `build/reports/chai-v2-mockup/`), with Cook's shared screens, and item by item with Zafar's last feedback (each ✅ or a note).
7. Record results in the session report (`build/reports/<name>.md`) using the template at the end. The builder never reviews its own work: the orchestrator or a fresh session does, and the orchestrator looks at the final shots itself before reporting done.

---

## TXT: text

*Applies to every change that shows text.*

| ID | Check | Rule | How |
|---|---|---|---|
| TXT-01 | No text is clipped, cut off or ellipsised, including headlines, card rows, pills, chips, badges and end-screen word tiles | F7 | eye → auto |
| TXT-02 | Long headlines shrink first, then wrap; they never overflow their card | F7 | eye → auto |
| TXT-03 | The guide box shows at most 2 lines; a card row shows 1 | F7 | eye → auto |
| TXT-04 | Outlines, glows and highlights around text have room and aren't cut by the card edge | F7 | eye |
| TXT-05 | No text is smaller than 14 px (L4) at 390×844, chip words included; words stay readable at a glance on a phone | F2 | eye → auto |
| TXT-06 | Only Nunito at the four sizes: L1 22/800, L2 20/800, L3 17/700, L4 14/600 | F2 | eye → auto |
| TXT-07 | Kutchi on cards is lower case, with Kutchi number words and no full stop | F10 | eye |
| TXT-08 | Every spoken line is also written, with the read-along underline as it's said | E3, E4 | eye |
| TXT-09 | One text line beside an icon is centred on the icon | F21 | eye |
| TXT-10 | Words never break mid-word ("tr/ae/kh/un") at any checklist size | F7 | eye → auto |
| TXT-11 | The word review shows the exact word the order used (*hakri lakri*, not *hakro*) | F10, F14 | eye → auto |

## LAY: layout and spacing

*Applies to every change that affects a screen.*

| ID | Check | Rule | How |
|---|---|---|---|
| LAY-01 | The stage fills the screen: no letterbox or cream strip | F18 | eye → auto |
| LAY-02 | No horizontal scroll on the page or the sidebar | F8, F18 | auto: `build/test_e2e.py`, `build/test_cook.py` (sidebar) |
| LAY-03 | Spacing only from 4, 8, 12, 16, 24, 32, 40 px (outer margin 32, between regions 24–32, inside cards 16, related controls 12, label to icon 8); padding equal on matching sides | F2, F16 | eye → auto |
| LAY-04 | Tap targets are at least 48 px even when the icon is 24 px (knobs, dock buttons, chips); art items at least ~90 px on the 1600×900 stage or in a container | F2, D21 | eye → auto |
| LAY-05 | Left sidebar ~22%, play area ~78%; big buttons bottom right | F4, F5 | eye |
| LAY-06 | Nothing covers a tappable item or the play area | E23 | auto: `build/test_cook.py` (topmost-element check before each tap) · eye elsewhere |
| LAY-07 | Shelf band: identical slots, items at true relative heights, equal padding top and bottom; bounces and glows stay inside the band | F15, F16 | eye |
| LAY-08 | Characters are cut off by the scene, never the screen edge; no floating heads | F19 | eye |
| LAY-09 | Positions come from scene data, not CSS nudges | J4 | eye (code review) |
| LAY-10 | Vessels sit centred on their burners | C7, H11 | auto: `build/check_vessel_meta.py` |
| LAY-11 | Hit areas are big enough on every test screen size | F2 | auto: `build/check_hotspots.py` (clinic) |
| LAY-12 | Nothing overlaps: the ⌂ home button, badges, ticks and pills never sit on a title card, task card, hob or tool | E23 | eye |
| LAY-13 | Collected things are visible where they go; nothing is counted invisibly | E24 | eye |

## CMP: shared components and look

*Applies to every screen with cards, buttons, the sidebar or the end screen.*

| ID | Check | Rule | How |
|---|---|---|---|
| CMP-01 | End screen, badges, Again/Next/Home, Done, "?", guide box, order card and bulb come from `js/shared/` and aren't restyled | F1 | eye (code review) |
| CMP-02 | One look per button type: Done is the round gold tick bottom right; Next is the labelled arrow | F6 | eye |
| CMP-03 | Buttons are hidden until usable, never greyed out | F22 | eye |
| CMP-04 | Only design tokens: the colour set (`docs/design-language/ui-design-system.md` §2), radii 12 or full circle, one shadow `0 2px 8px rgba(40,25,10,.10)`; red #C0443C only in the end review | F2 | eye → auto |
| CMP-05 | Flat UI: white pills, flat gold done outline, no gradients or 3D text; no step counters or internal numbers | F3, F23 | eye |
| CMP-06 | Guide box is sage, top of the sidebar; speech bubbles solid cream with dark text | F11, F24 | eye |
| CMP-07 | One white card per person: face + headline + stacked rows; no name label, no cards in cards, no scroll bar | E21, F8 | eye |
| CMP-08 | Order model: person → items → parts, max three tiers; rows and the spoken sentence share one source and order | F9, F10 | eye |
| CMP-09 | "Don't" rows are dashed with a no-sign; finished items fold to a gold line; "next" in grey, never numbered | F9 | eye |
| CMP-10 | The focal thing pulses with a centred glow and bounce; inactive things dim ~10% | F17 | eye |
| CMP-11 | End screen steps through badges → Next → word review → actions, over the game scene | F12 | eye |
| CMP-12 | Badges: gold = perfect; stopwatch with crowned best; gold/grey tick with "7/10"; bulb dims and cracks per hint. No stars anywhere | F13, H5 | eye · auto: `build/test_shared_ui.mjs` (badge tiers) |
| CMP-13 | Word review: right on the right (gold outline), wrong on the left (red outline; red only here); speaker buttons neutral for both; vertically balanced in its card | F14 | eye |
| CMP-14 | The grown-up skip is behind the "?" menu, never a visible button | E31 | eye |
| CMP-15 | One light bulb at the top of the sidebar; no per-line translate, eye or speaker buttons; the face is the replay | E25 | eye → auto |
| CMP-16 | Every talking character has two poses (three-quarter, mirrored for left/right, and front) and turns to the player on the child's turn | E20, D17 | eye |

## LNG: language

*Applies to every change to lines, words, cards or help.*

| ID | Check | Rule | How |
|---|---|---|---|
| LNG-01 | No written English for the child anywhere (grown-ups' "?" pop-up aside); no spoken English in games or help; in story mode, spoken English is followed by the Kutchi | E1, G15 | auto: `build/check_onboard.mjs` (Cook coaches) · eye elsewhere |
| LNG-02 | The Kutchi leak test passes at level 1: a non-speaker bot can't win. Check the known leak patterns: help that shows the answer; the game deciding for you; the screen giving the answer; fixed slots; sound matching; decoys that give themselves away; row shapes that decode the order; a count shown where it should be heard | C10 | auto: `build/leak_*.mjs` (other modes); Cook's leak checks are in `build/test_cook.py` · eye for the patterns |
| LNG-03 | Every line is a full sentence built by the engine; every word heard is a family recording; no hand-written fragments | G9, G12 | eye (until the engine lands) |
| LNG-04 | No invented Kutchi: every string is sourced, drafts carry `draft: true`, missing words are grey-italic placeholders flagged "to record" | G1–G3 | eye · auto: `build/lines_needing_family.py` (lists the gaps) |
| LNG-05 | No English or pictures where the task is understanding Kutchi; one place for a word's text at a time | G22 | eye |
| LNG-06 | Settled spellings used (*na*, *khun*, *ba*, *hane*, *khuda-fis* …) | G4–G8 | eye → auto |
| LNG-07 | No Kutchi grammar in game code; frames and forms live in data | G13, G18 | eye (code review) |
| LNG-08 | Never English inside an item pill | G3 | eye → auto |

## INT: interaction and feel

*Applies to every change to a mini-game, station or flow.*

| ID | Check | Rule | How |
|---|---|---|---|
| INT-01 | Input is live while speech plays; a tap goes ahead; the line can be replayed from the face | E5 | eye → auto |
| INT-02 | Every placement can be taken back until Done | E14 | eye → auto |
| INT-03 | Each stage clears its own UI and stops its effects when done; pills never overlap | E17–E19 | eye |
| INT-04 | First-time help in every phase: dim all but one thing, ghost finger once, child does it | E2, E9 | auto: `build/check_onboard.mjs` (Cook) · eye elsewhere |
| INT-05 | No red crosses or buzzes mid-round; mistakes show in the end review | E10 | eye |
| INT-06 | A glow hint only after a wrong tap or ~5 s hesitation, never at the top level | E16, E28 | eye |
| INT-07 | The light bulb flips to English for 5/3/2/1 s by level, and costs a bulb on the hints badge | E25 | eye → auto |
| INT-08 | Visible timers wherever there's time pressure, ~15% quicker per level, set in data | H8, H47 | eye |
| INT-09 | Colour never carries meaning alone | E33 | eye |
| INT-10 | Counting follows the level rule (L1 written + counted aloud, L2 written, L3+ heard) | E12 | eye |
| INT-11 | Every station plays through to the end at every level | C1 | auto: `build/test_cook.py`, `build/test_clinic*.py`, per-mode tests · eye |
| INT-12 | Level 1 is the smallest possible round; each level adds one thing; two jobs are phases with a button between | E6, E7 | eye |
| INT-13 | The same kind of action uses the same gesture throughout a mini-game, and controls never change between levels | E13 | eye |
| INT-14 | Rows tick when that step closes (put down, finished, served), never the moment a number is reached | E11 | eye → auto |
| INT-15 | Every phase and kind of step has a first-time coach | E2 | auto: `build/check_onboard.mjs` (Cook) · eye elsewhere |
| INT-16 | Tallies only where kept (chai's sugar): they show what you did, never the target, and never take a tap | E12, F25 | eye |
| INT-17 | A moment of silence at the start; Nani doesn't compete with the instruction card | E27 | eye |

## AUD: audio and voices

*Applies when audio, lines or a mode's page changes.*

| ID | Check | Rule | How |
|---|---|---|---|
| AUD-01 | Family voices play in every mode and lab touched; no device voice | C15, G14 | auto: `build/test_voice_wiring.mjs`, `build/voice_coverage.mjs` · eye (listen) |
| AUD-02 | Only clips marked OK in `lab/family-audio.html` ship | G16 | eye |

## ART: art in the game

*Applies only when art or its placement changes.*

| ID | Check | Rule | How |
|---|---|---|---|
| ART-01 | No text, letters, numbers or logos baked into art (bunting, tins and packaging included) | D13 | eye |
| ART-02 | Cuts are clean on cream at ×2 zoom: no grey fringe, ring, holes or squared-off glow; trimmed WebP with a 16 px pad | D7, D22 | eye |
| ART-03 | One camera per scene (no top-down sprite in an eye-level scene, no ¾ views, circles not ovals from above); light from the upper left, no second light | D14 | eye |
| ART-04 | Background lighting states line up (a relight, not a redraw: nothing moved, grew or appeared) | D8, D31 | auto: `build/bg_align_check.py` |
| ART-05 | Every asset URL goes through `Cook.v()` / `njgV()` | B7 | eye (code review) |
| ART-06 | Everything touching a surface has a contact shadow; nothing floats; no doubled surfaces (board on board) | D13, D16 | eye |
| ART-07 | Sizes never invert; small items at most 1.5× true size; shelf items at true relative heights | D21, F15 | eye |
| ART-08 | All states of one object share one registered canvas (same size and position) | D8 | eye → auto |
| ART-09 | Backgrounds are 1600×900, never stretched; approved only after overlaying the real characters at game size | D5, D15 | eye |
| ART-10 | Style holds: no outlines, cel shading, photographic textures, clip-art shine or blur; characters match their sheet | D13, D12 | eye |
| ART-11 | Reds kept out of the background behind Nani; tappable items are the most saturated things in the frame | D20 | eye |
| ART-12 | Pot and pan contents are pre-rendered pictures, cross-faded; never drawn dots or discs | D11 | eye |
| ART-13 | No hands anywhere in Cook | H13 | eye |

## CUL: culture and tone

*Applies to new art, story, characters and rewards.*

| ID | Check | Rule | How |
|---|---|---|---|
| CUL-01 | No Hindu religious markers; halal food; modest clothing | I1 | eye |
| CUL-02 | No sweets, lollies or biscuits as rewards to the child | I2 | eye |
| CUL-03 | Warm tone: never sarcastic, babyish, nagging or punishing | E29, E30 | eye |

## REL: release

*Applies to every push to `main`.*

| ID | Check | Rule | How |
|---|---|---|---|
| REL-01 | `python3 build/bump_version.py` ran before the push to `main` | B7 | eye (git log) |
| REL-02 | The Pages build ran for the commit and the change shows after a hard refresh; screenshot sent | C9 | eye |
| REL-03 | Nothing leaves the device: no accounts, uploads or analytics | J1 | eye (code review) |
| REL-04 | Persistence only through the save API (`js/shared/save.js`); a mode edits only its own files | B17, J3 | eye (code review) |
| REL-05 | Screenshots rewritten by test runs are discarded unless intended | B16 | eye (git status) |

---

## Results template (paste into the session report)

```
QA: <mode/screens> · reviewer: <who> · commit: <sha>
Auto: <script> ✅/❌ …
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ✅ · LAY ✅ · CMP ⚠ CMP-03 (…) · LNG ✅ · INT ✅ · AUD ✅ · ART ✅ · CUL ✅
Regressions rechecked: R-… ✅ …
Against Zafar's last feedback: <item ✅ / note> …
```
