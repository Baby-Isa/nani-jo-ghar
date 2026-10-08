# s04c-art

Branch `ccr-a7370759-t0lee7`, commit `a22cf77`. Sandbox run `s04c-a`. Game code changed: <say what, or "no">.

## What was built
<!-- fill in: each change, one line, the files; mechanics changed and old art reused first -->

## Proof (from the run; do not retype)
- **Pages run:** 2 (flow x size): 2 flows at 1366x768. 2 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 27 of 27 states, in `build/screenshots/sandbox/s04c-a` (not committed, B19). Contact sheets: `build/screenshots/sandbox/s04c-a/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (1 known, 2 fixed). Findings in the run: 1 (canvas-text-small 1).
- **Sound:** 35 lines with no family clip, 9 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/s04c-a vs build/tools/review/approved-shots.json: 27 shots, 0 changed, 27 new, 0 gone, 0 identical
- **Word checks (report-only):**
  - A  string literals typed in game code: 38 (0 Kutchi, 38 English); 228 single words that may be ids
  - B  English that a child may see: 38 English literals + 32 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (13 places)
  - D  lines with no family recording: 36 distinct words with no clip in 4081 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: cook:chaat, cook:day1 · reviewer: <someone other than the builder> · commit: a22cf77
Auto: layout lint ✅ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (run them: ✅/❌)
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 32 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| cook:chaat | 1366x768 | 11 | 1 | sheets/cook-chaat__1366x768.png |
| cook:day1 | 1366x768 | 16 | 0 | sheets/cook-day1__1366x768.png |

### Regression rows to recheck (32; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] CHT-01 · built · eye: L1 · INT-10 · Quantities are not only heard: card says ba dungri at L1 (counting rule)
- [ ] CHT-02 · built · eye: 1366×768 · Ingredient bowls side-on, not three-quarter
- [ ] CHT-03 · reopened · auto: build/check_vessel_meta.py check · Glass bowl: a thin, plain side-on profile with layer strips, no thick base, no reflections, flat
- [ ] CHT-04 · built · eye: serve and build states · Layers read as food, not liquid or flat rectangles; chilli layer not too thick; tidy ingredient
- [ ] CHT-05 · built · eye: chop phase · CMP-04 · Chop timer ring in the shared colours, not the old ones (verify)
- [ ] CHT-06 · built · eye: chaat L1–L3 · Potato row ticks only at the second of two; the checker counts quantities (one potato passed for
- [ ] CHT-07 · built · eye: story chaat · Chaat flow: ask → pantry → chop → he says the sequence → bowl
- [ ] CHT-08 · built · eye: chaat retry · On a retry the order is re-said on his own card with rows lit as spoken; no extra card
- [ ] CHT-09 · built · ear: chaat L1 · arre re (never confirmed, not a family word) removed; find why it plays on correct layers
- [ ] CHT-10 · open · auto: contract check (pop-up before ev · L4 chaat: the order comes up in the shared pop-up and is read out before it folds into the close
- [ ] CHT-11 · open · eye: Cook service, chaat served · Served chaat drawn at the tray's angle (side-on art if side-on), no baked drop shadow
- [ ] CK-TB-01 · built · sandbox #takeback flows · Take it back until Done (E14): 9 of 12 Cook stations offer no take-back (only chaat, assemble an
- [ ] CK-27 · open · auto: contract check (decision 75) eve · An ingredient going into a pot, pan, glass or bowl shows a small puff or sprinkle: one shared ef
- [ ] CK-29 · open · auto: contract check (decision 75) eve · Every recipe gives each instruction just before the game that needs it (the chaat flow, CHT-07:
- [ ] CK-01 · open · eye: L2–L4 · INT-11 · Levels 2–4 of every station (Cook and clinic) not yet played by Zafar; needs his pass
- [ ] CK-02 · built · auto: build/check_vessel_meta.py · LAY · Hobs are straight with clean corners and even sides, one family for all burner counts (not compo
- [ ] CK-03 · built · eye: 390×844 · LAY-04 · Knobs big enough, match the face badges; on = glowing ring, no icon
- [ ] CK-04 · built · eye: 4-pan hob · Flames small (peek, never touch neighbours), on whenever the knob is on; heat gauge thicker and
- [ ] CK-05 · built · eye: each station · ART-03 · One camera look per station (no side-on jars with top-down sekelo and three-quarter bowls); stra
- [ ] CK-06 · built · eye: each cooking state · Things inside pots and pans look real (chai liquid, daar oil, contents), not white dots or swirl
- [ ] CK-07 · built · eye: each station · CMP-13 · One review at serve in every station: large round face circle over the dish, happy or frown, no
- [ ] CK-08 · built · eye: samosa, daar · No oil-heating ring (it looks like the timing ring); sizzle means ready
- [ ] CK-09 · reopened · eye: maani, samosa, ×2 zoom on board a · One house chakla: dark walnut, not blown up or low-res; no board drawn on a board; the rolling p
- [ ] CK-TAB-01 · open · sandbox 1024×768, 1180×820, 1366×1024 · Tablets: Cook's play items grow to use a 4:3 screen (decision 24); each station needs a 4:3 layo
- [ ] CK-20 · built · eye: every vessel · LAY-10 · Rule: things inside a container sit on its flat inner area, never the rim or sides (thali, tray,
- [ ] CK-21 · reopened · eye: every serve · Served dishes on the counter drawn at its angle, on a tray, shadows to the right
- [ ] CK-22 · built · auto: contract check (decision 75) eve · The closing line lists back what they got, then thank you / shabash (no repeated "give me")
- [ ] CK-23 · built · auto: contract check (decision 75) eve · A wrong item means redo just that item; second try with help; after three, show the right way
- [ ] CK-24 · built · eye: home · Story days are clearly days (not levels 1–4) on Cook's home
- [ ] CK-25 · built · auto: timing; eye · Labs station pages load fast (10–12 s now): measure, then load per station
- [ ] CK-26 · open · eye: greeting · The greeting: your wrong pick red, the other wrong ones grey, the right one clear against the br
- [ ] CK-28 · open · eye: labs.html · The labs page groups its tiles (stations, recipes, clinic) so a tester can see what there is ("I

## Left open
<!-- fill in -->
