# QA checklist: the definition of done

Nothing reaches Zafar until every line that applies passes. The design docs say *why*; this file says *how we check*. Each line has an ID, the rule it comes from (`rules.md` IDs, e.g. F7), and how it's checked:

- **auto**: a script checks it (named).
- **eye**: a reviewer checks it on the screenshots.
- **eye → auto**: checked by eye today; the automated check is planned (step 2a: sandbox flow tests and layout lint).

A reviewer who is not the builder fills in the results, flaws first.

## How to run a review

1. Run every **auto** line that applies to the touched modes.
2. Screenshot every visually distinct state, uncropped, at **390×844**, **1366×768** and a **16:10 laptop** (1440×900), across levels 1–4. While iterating: laptop only, changed screens only.
3. Zoom ×2 on each screenshot and go through the **eye** lines. Write one line per state.
4. Recheck every item in `regressions.md` for the touched screens.
5. Compare side by side with the approved mock-up, with Cook's shared screens, and item by item with Zafar's last feedback (each ✅ or a note).
6. Record results in the session report (`build/reports/<name>.md`) using the template at the end.

---

## TXT: text

| ID | Check | Rule | How |
|---|---|---|---|
| TXT-01 | No text is clipped, cut off or ellipsised, including headlines, card rows, pills, chips, badges and end-screen word tiles | F7 | eye → auto |
| TXT-02 | Long headlines shrink first, then wrap; they never overflow their card | F7 | eye → auto |
| TXT-03 | The guide box shows at most 2 lines; a card row shows 1 | F7 | eye → auto |
| TXT-04 | Outlines, glows and highlights around text have room and aren't cut by the card edge | F7 | eye |
| TXT-05 | No text is smaller than the design system's minimum at 390×844 (chip words included) | F2 | eye → auto |
| TXT-06 | Only the Nunito type scale L1–L4 is used | F2 | eye → auto |
| TXT-07 | Kutchi on cards is lower case, with Kutchi number words and no full stop | F10 | eye |
| TXT-08 | Every spoken line is also written, with the read-along underline as it's said | E3, E4 | eye |
| TXT-09 | One text line beside an icon is centred on the icon | F21 | eye |

## LAY: layout and spacing

| ID | Check | Rule | How |
|---|---|---|---|
| LAY-01 | The stage fills the screen: no letterbox or cream strip | F18 | eye → auto |
| LAY-02 | No horizontal scroll on the page or the sidebar | F7 | auto: `build/test_e2e.py`, `build/test_cook.py` (sidebar) |
| LAY-03 | Spacing is on the 8-pt grid; padding is equal on matching sides | F2, F16 | eye → auto |
| LAY-04 | Tap targets are at least 48 px | F2 | eye → auto |
| LAY-05 | Left sidebar ~22%, play area ~78%; big buttons bottom right | F4, F5 | eye |
| LAY-06 | Nothing covers a tappable item or the play area | E23 | auto: `build/test_cook.py` (topmost-element check before each tap) · eye elsewhere |
| LAY-07 | Shelf band: identical slots, items at true relative heights, equal padding top and bottom; bounces and glows stay inside the band | F15, F16 | eye |
| LAY-08 | Characters are cut off by the scene, never the screen edge; no floating heads | F19 | eye |
| LAY-09 | Positions come from scene data, not CSS nudges | J4 | eye (code review) |
| LAY-10 | Vessels sit centred on their burners | H11 | auto: `build/check_vessel_meta.py` |
| LAY-11 | Hit areas are big enough on every test screen size | F2 | auto: `build/check_hotspots.py` (clinic) |

## CMP: shared components and look

| ID | Check | Rule | How |
|---|---|---|---|
| CMP-01 | End screen, badges, Again/Next/Home, Done, "?", guide box, order card and bulb come from `js/shared/` and aren't restyled | F1 | eye (code review) |
| CMP-02 | One look per button type: Done is the round gold tick bottom right; Next is the labelled arrow | F6 | eye |
| CMP-03 | Buttons are hidden until usable, never greyed out | F22 | eye |
| CMP-04 | Only design tokens: colour set, radii 12 or full circle, one soft shadow | F2 | eye → auto |
| CMP-05 | Flat UI: white pills, flat gold done outline, no gradients or 3D text; no step counters or internal numbers | F3, F23 | eye |
| CMP-06 | Guide box is sage, top of the sidebar; speech bubbles solid cream with dark text | F11, F24 | eye |
| CMP-07 | One white card per person: face + headline + stacked rows; no name label, no cards in cards, no scroll bar | E21, F8 | eye |
| CMP-08 | Order model: person → items → parts, max three tiers; rows and the spoken sentence share one source and order | F9, F10 | eye |
| CMP-09 | "Don't" rows are dashed with a no-sign; finished items fold to a gold line; "next" in grey, never numbered | F9 | eye |
| CMP-10 | The focal thing pulses with a centred glow and bounce; inactive things dim ~10% | F17 | eye |
| CMP-11 | End screen steps through badges → Next → word review → actions, over the game scene | F12 | eye |
| CMP-12 | Badges: gold = perfect; stopwatch with crowned best; gold/grey tick with "7/10"; bulb dims and cracks per hint. No stars anywhere | F13, H5 | eye · auto: `build/test_shared_ui.mjs` (badge tiers) |
| CMP-13 | Word review: right on the right (gold outline), wrong on the left (red outline; red only here) | F14 | eye |

## LNG: language

| ID | Check | Rule | How |
|---|---|---|---|
| LNG-01 | No English instruction text or audio for the child; English only in the "?" pop-up | E1, G15 | auto: `build/check_onboard.mjs` (Cook coaches) · eye elsewhere |
| LNG-02 | The Kutchi leak test passes at level 1: a non-speaker bot can't win | C10 | auto: `build/leak_*.mjs`, the leak checks in `build/test_cook.py` |
| LNG-03 | Every spoken line is a full sentence from the engine; no fragments or stitched words | G9 | eye (until the engine lands) |
| LNG-04 | No invented Kutchi: every string is sourced, drafts carry `draft: true`, missing words are grey-italic placeholders flagged "to record" | G1–G3 | eye · auto: `build/lines_needing_family.py` (lists the gaps) |
| LNG-05 | No English or pictures where the task is understanding Kutchi; one place for a word's text at a time | G22 | eye |
| LNG-06 | Settled spellings used (*na*, *khun*, *ba*, *hane*, *khuda-fis* …) | G4–G8 | eye → auto |
| LNG-07 | No Kutchi grammar in game code; frames and forms live in data | G13, G18 | eye (code review) |

## INT: interaction and feel

| ID | Check | Rule | How |
|---|---|---|---|
| INT-01 | Input is live while speech plays; a tap goes ahead; the line can be replayed from the face | E5 | eye → auto |
| INT-02 | Every placement can be taken back until Done | E14 | eye → auto |
| INT-03 | Each stage clears its own UI and stops its effects when done; pills never overlap | E17–E19 | eye |
| INT-04 | First-time help in every phase: dim all but one thing, ghost finger once, child does it | E2, E9 | auto: `build/check_onboard.mjs` (Cook) · eye elsewhere |
| INT-05 | No red crosses or buzzes mid-round; mistakes show in the end review | E10 | eye |
| INT-06 | A glow hint only after a wrong tap or ~5 s hesitation, never at the top level | E16, E28 | eye |
| INT-07 | The light bulb flips to English for 5/3/2/1 s by level and costs a bulb | E25 | eye |
| INT-08 | Visible timers wherever there's time pressure, ~15% quicker per level, set in data | H8, H47 | eye |
| INT-09 | Colour never carries meaning alone | E33 | eye |
| INT-10 | Counting follows the level rule (L1 written + counted aloud, L2 written, L3+ heard) | E12 | eye |
| INT-11 | Every station plays through to the end at every level | C1 | auto: `build/test_cook.py`, `build/test_clinic*.py`, per-mode tests · eye |

## AUD: audio and voices

| ID | Check | Rule | How |
|---|---|---|---|
| AUD-01 | Family voices play in every mode and lab touched; no device voice | C15, G14 | auto: `build/test_voice_wiring.mjs`, `build/voice_coverage.mjs` · eye (listen) |
| AUD-02 | Only clips marked OK in `lab/family-audio.html` ship | G16 | eye |

## ART: art in the game

| ID | Check | Rule | How |
|---|---|---|---|
| ART-01 | No text baked into art | D13 | eye |
| ART-02 | Cuts are clean on cream at ×2 zoom; trimmed WebP with a 16 px pad | D7, D22 | eye |
| ART-03 | Light, shadow, camera and scale match the rest of the scene; sizes never invert | D14, D21 | eye |
| ART-04 | Background lighting states line up (a relight, not a redraw) | D16 | auto: `build/bg_align_check.py` |
| ART-05 | Every asset URL goes through `Cook.v()` / `njgV()` | B7 | eye (code review) |

## CUL: culture and tone

| ID | Check | Rule | How |
|---|---|---|---|
| CUL-01 | No Hindu religious markers; halal food; modest clothing | I1 | eye |
| CUL-02 | No sweets, lollies or biscuits as rewards to the child | I2 | eye |
| CUL-03 | Warm tone: never sarcastic, babyish, nagging or punishing | E29, E30 | eye |

## REL: release

| ID | Check | Rule | How |
|---|---|---|---|
| REL-01 | `python3 build/bump_version.py` ran before the push to `main` | B7 | eye (git log) |
| REL-02 | The Pages build ran for the commit and the change shows after a hard refresh; screenshot sent | C9 | eye |
| REL-03 | Nothing leaves the device: no accounts, uploads or analytics | J1 | eye (code review) |

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
