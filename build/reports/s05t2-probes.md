# s05t2-probes

Branch `ccr-a7370759-t0lee7`, commit `48b0a59`. Sandbox run `ev-20261012-231251-m8r`. Game code changed: <say what, or "no">.

## What was built
<!-- fill in: each change, one line, the files; mechanics changed and old art reused first -->

## Proof (from the run; do not retype)
- **Pages run:** 35 (flow x size): 26 flows at 1366x768, 800x360, 844x390. 34 reach their end, 1 stop short: cook:mishkaki-grill@L4 @ 1366x768.
- **Page errors:** 0.
- **Screenshots:** 397 of 397 states, in `build/screenshots/sandbox/ev-20261012-231251-m8r` (not committed, B19). Contact sheets: `build/screenshots/sandbox/ev-20261012-231251-m8r/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **FAILED**: 0 new findings, 1 flows that do not reach their end, 0 new page errors. Findings in the run: 4 (canvas-text-small 3, scroll-container 1).
- **Sound:** n/a.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/ev-20261012-231251-m8r vs build/tools/review/approved-shots.json: 1152 shots, 0 changed, 1152 new, 0 gone, 0 identical
- **Word checks (report-only):**
  - A  string literals typed in game code: 38 (0 Kutchi, 38 English); 237 single words that may be ids
  - B  English that a child may see: 38 English literals + 32 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (13 places)
  - D  lines with no family recording: 36 distinct words with no clip in 4081 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: clinic:heal-cut#tap-through-popup, clinic:heal-eye@L2, clinic:heal-eye@L3, clinic:pharmacy#tap-through-popup, clinic:waiting#real-pace, cook:chaat@L4 ... · reviewer: <someone other than the builder> · commit: 48b0a59
Auto: layout lint ❌ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (run them: ✅/❌)
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 183 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| clinic:heal-cut#tap-through-popup | 1366x768 | 7 | 0 | sheets/clinic-heal-cut-tap-through-popup__1366x768.png |
| clinic:heal-eye@L2 | 1366x768 | 8 | 0 | sheets/clinic-heal-eye-l2__1366x768.png |
| clinic:heal-eye@L3 | 1366x768 | 8 | 0 | sheets/clinic-heal-eye-l3__1366x768.png |
| clinic:heal-eye@L3 | 1366x768 | 8 | 0 | sheets/clinic-heal-eye-l3__1366x768.png |
| clinic:heal-eye@L3 | 844x390 | 8 | 0 | sheets/clinic-heal-eye-l3__844x390.png |
| clinic:pharmacy#tap-through-popup | 1366x768 | 6 | 0 | sheets/clinic-pharmacy-tap-through-popup__1366x768.png |
| clinic:waiting#real-pace | 1366x768 | 5 | 0 | sheets/clinic-waiting-real-pace__1366x768.png |
| cook:chaat@L4 | 800x360 | 12 | 0 | sheets/cook-chaat-l4__800x360.png |
| cook:chaat@L4 | 800x360 | 12 | 0 | sheets/cook-chaat-l4__800x360.png |
| cook:chaat@L4 | 844x390 | 12 | 0 | sheets/cook-chaat-l4__844x390.png |
| cook:chaat@L4 | 844x390 | 13 | 0 | sheets/cook-chaat-l4__844x390.png |
| cook:chai | 1366x768 | 12 | 0 | sheets/cook-chai__1366x768.png |
| cook:chai-tray@L2 | 1366x768 | 12 | 0 | sheets/cook-chai-tray-l2__1366x768.png |
| cook:chai-tray@L2 | 800x360 | 12 | 1 | sheets/cook-chai-tray-l2__800x360.png |
| cook:chai-tray@L2 | 844x390 | 12 | 1 | sheets/cook-chai-tray-l2__844x390.png |
| cook:chai-tray@L3 | 844x390 | 12 | 0 | sheets/cook-chai-tray-l3__844x390.png |
| cook:chai-tray@L4 | 800x360 | 12 | 0 | sheets/cook-chai-tray-l4__800x360.png |
| cook:chai-tray@L4 | 844x390 | 12 | 0 | sheets/cook-chai-tray-l4__844x390.png |
| cook:chai@L2 | 1366x768 | 12 | 0 | sheets/cook-chai-l2__1366x768.png |
| cook:chai@L3 | 1366x768 | 12 | 0 | sheets/cook-chai-l3__1366x768.png |
| cook:chai#speed1 | 1366x768 | 12 | 0 | sheets/cook-chai-speed1__1366x768.png |
| cook:chai#tap-through-popup | 1366x768 | 10 | 0 | sheets/cook-chai-tap-through-popup__1366x768.png |
| cook:daar | 1366x768 | 12 | 0 | sheets/cook-daar__1366x768.png |
| cook:daar#mistake | 1366x768 | 17 | 0 | sheets/cook-daar-mistake__1366x768.png |
| cook:day1 | 1366x768 | 16 | 0 | sheets/cook-day1__1366x768.png |
| cook:day1 | 844x390 | 16 | 2 | sheets/cook-day1__844x390.png |
| cook:fetch@L3 | 844x390 | 11 | 0 | sheets/cook-fetch-l3__844x390.png |
| cook:fetch#hint | 1366x768 | 12 | 0 | sheets/cook-fetch-hint__1366x768.png |
| cook:mishkaki-grill@L3 | 1366x768 | 12 | 0 | sheets/cook-mishkaki-grill-l3__1366x768.png |
| cook:mishkaki-grill@L4 | 1366x768 | 11 | 0 | sheets/cook-mishkaki-grill-l4__1366x768.png |
| cook:recipe:samosa | 1366x768 | 13 | 0 | sheets/cook-recipe-samosa__1366x768.png |
| cook:recipe:samosa@L3 | 1366x768 | 13 | 0 | sheets/cook-recipe-samosa-l3__1366x768.png |
| cook:samosa | 1366x768 | 11 | 0 | sheets/cook-samosa__1366x768.png |
| cook:samosa@L3 | 1366x768 | 13 | 0 | sheets/cook-samosa-l3__1366x768.png |
| lab:cook/order | 1366x768 | 11 | 0 | sheets/lab-cook-order__1366x768.png |

### Regression rows to recheck (183; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] CLN-02 · built · eye: 1366×768 · ART-03 · Backgrounds locked first: six new rooms, heal games have a background, nothing faded; pharmacy s
- [ ] CLN-03 · reopened · eye: 1366×768 · CMP-01 · Clinic uses what Cook learned: shared order card as patient card, guide box, end pop-up, review
- [ ] CLN-08 · built · eye: heal games · Heal-game close-up background blurred more in code so the room never competes; certificate frame
- [ ] CLN-81 · reopened · eye: clinic morning end to end · The girl's finished art in the whole story: waiting room, diagnosis, send-off, sticker and card
- [ ] CLN-82 · built · eye: every heal game L2, L3 · L2+: once a count is reached, the next step's row appears and its tool glows after a pause (stuc
- [ ] CLN-84 · built · eye/ear: pharmacy L3 and all nine heal · The request first in a pop-up, then a quiet game (pharmacy and every heal game; decision 53). Re
- [ ] CLN-85 · reopened · eye: diagnosis, pharmacy, each heal ga · The person being served or treated sits at the top right in every clinic stage that has one (dia
- [ ] CLN-87 · reopened · eye: zoom in and out in every heal gam · Zoom in and out about 1.5 s; zoom-out from full zoom on the healed part; her poses during the zo
- [ ] CLN-109 · built · ear: scrape L1 finished fast, then sen · No voice carries over into the next stage: finishing a heal game quickly left the doctor still r
- [ ] CLN-112 · open · sandbox #takeback flows, every heal ga · Take it back until Done in every clinic game (UX §17, like CK-TB-01): every heal game and stage
- [ ] CLN-113 · reopened · eye: the audit table, one line per gam · Every ordered instruction in every clinic game is a sequence on the shared card (line, grey band
- [ ] CLN-114 · built · auto: contract-9 closed-card (L3+: wai · From L3 the card is closed in the pharmacy and every heal game (and the waiting room), with the
- [ ] CLN-30 · built · auto: build/check_onboard.mjs; eye: ev · Each heal game explains itself with one "why" beat ("why am I clicking on the things?"), no Engl
- [ ] CLN-32 · built · eye: scrape · INT-02 · Scrape: not too clicky; plasters in clear colours and order; a plaster can be taken off; sequenc
- [ ] CLN-42 · built · eye: every heal game · No unexplained icons: no 🩺 badge bottom left, no gold half-circle on tools, no glove on the syr
- [ ] CLN-43 · built · eye: each heal game's opening, 1366×76 · A heal game opens by zooming from the patient on the bed to the sore part; never a lone limb on
- [ ] CLN-44 · built · eye: each heal game · CMP-07 · Every heal card has a headline (the goal) and folds to it with the check
- [ ] CLN-45 · reopened · review: the level data of all nine gam · Every heal game's ladder adds one thing per level (D19): L1 the count; L2 one new thing; L3 hear
- [ ] CLN-46 · built · eye: scrape, ear · The scrape and the cotton bud have a skill, not just taps
- [ ] CLN-62 · built · eye: eye, a wrong read, and the end · Eye: after na the dropper over the eye shows what to do; after the last chart row she looks up h
- [ ] CLN-67 · built · eye: each heal close-up · The patient's round face in the close-up matches the patient (a boy's face shows over the girl)
- [ ] CLN-68 · built · eye: boing card · Card rows join cleanly: no stray space before a comma ("Wipe , ba")
- [ ] CLN-69 · built · eye: heal games, phone/laptop/tablet · The results card sits over the scene (the room), never a bare cream stage
- [ ] CLN-70 · built · eye: heal games, phone/laptop/tablet · Every heal game clears its own buttons on done (the scrape's ✓ lingered into the results)
- [ ] CLN-72 · built · eye: heal games, phone/laptop/tablet · The first-time help's light is a soft centred glow, never beige squares
- [ ] CLN-73 · built · eye: heal games, phone/laptop/tablet · The word review never scrolls or clips at 800×360
- [ ] CLN-74 · built · eye: heal games, phone/laptop/tablet · The scrape's hand stays clear of the tool strip
- [ ] CLN-76 · built · eye: heal games, phone/laptop/tablet · English lines the child sees are styled as flagged placeholders, never dark bold text
- [ ] CLN-77 · built · eye: heal games, phone/laptop/tablet · The zoom never shows a full-screen smear or ghost close-up UI on the pull-out
- [ ] CLN-79 · built · eye: heal games, phone/laptop/tablet · The tick badge always reads (never '–')
- [ ] CLN-99 · built · eye: scrape L1–L3 · Scrape: a dabbing cloth; connector line ends at the last row; all steps (plasters too) in the se
- [ ] CLN-118 · reopened · eye: a fresh profile in each of the ni · The first time a child plays any heal game is a taught round: the game shows the first task, the
- [ ] CLN-119 · reopened · auto: the words each game marks in ctx · Each heal game teaches its own language strand beyond numbers, from its scene (D18): scrape colo
- [ ] CLN-121 · built · eye: scrape close-up, ×2 zoom · The scrape's cut and graze art is redrawn realistic (comical, not gory, H26) through the image A
- [ ] CLN-38 · reopened · auto: list the chart's item pool at ea · Eye: the chart draws its items from household and everyday nouns the child has met (bed, table:
- [ ] CLN-39 · built · eye: eye game · INT-02 · Eye cover cannot be taken back
- [ ] CLN-47 · built · eye: knee, foot, eye L3 · Sides are said and tested only in the diagnosis; the close-up shows the one sore knee, foot or e
- [ ] CLN-59 · built · eye: eye L1 · Eye: the sore eye is clear
- [ ] CLN-60 · built · auto: help path; eye: first play · LNG · Eye: the first-time help never presses haa on a row read wrong
- [ ] CLN-61 · built · eye: eye test, both layouts side by si · Eye: obviously an eye chart; the patient seen looking at it; chart rows highlight and tick like
- [ ] CLN-63 · built · eye: eye L3 · Eye L3: no hidden first step without a row or a line
- [ ] CLN-78 · built · eye: heal games, phone/laptop/tablet · The ear's hearing check and the eye chart use scene-fitting pictures, not emoji
- [ ] CLN-80 · built · eye: heal games, phone/laptop/tablet · The eye test's haa/na pills are at least 48 px on phones
- [ ] CLN-107 · reopened · eye: eye L1–L3 · Eye: a wrong yes/no shakes red, the doctor names the row with pictures; a misread gets a drop an
- [ ] CLN-19 · built · eye: 1366×768 · Items are not at 45 degrees; the game uses the painted belt, not a code-drawn belt across the to
- [ ] CLN-20 · built · eye: L3 · INT-08 · Level 3 is harder by faster belt or closer items, not a timer; hard-to-draw "filling" item is a
- [ ] CLN-21 · built · eye: pharmacy card · LNG-04 · Doctor says "[Bring me] the plaster"; "Muke plaster khape" is a customer's line (English placeho
- [ ] CLN-22 · reopened · auto: take-back test; eye: pharmacy L1 · The pharmacy tray is the pantry's tray (PAN-07, "take inspiration from the pantry's tray"): outl
- [ ] CLN-23 · built · eye: ×2 zoom · ART-03 · Items sit on the belt (flat base, contact shadow), not floating or tilted
- [ ] CLN-24 · built · eye: pharmacy to heal · Pharmacy tray feeds the heal game; a wrong pick costs score, nothing greyed out
- [ ] CLN-96 · built · eye: pharmacy L2 · Wrong colour plaster never ticks (red ticked for lilo); reproduce with a seed
- [ ] CLN-97 · built · eye: ×2 zoom · Items sit on the belt (green bottle floats); jugs cut cleanly; red plaster red all the way
- [ ] CLN-01 · reopened · eye: each room · Rough stand-in art made judging hard ("so overwhelmed by how terrible the visuals were"); real a
- [ ] CLN-04 · built · eye/ear: waiting room ladder · Language builds up simply (man, woman, boy, girl; old, young; tall, short; colours; "with the ba
- [ ] CLN-05 · built · eye: sidebar · CMP-06 · No Nani box in the clinic; the doctor fills her role
- [ ] CLN-06 · built · auto: contract-13 stale-ui (no reply p · Each stage clears its own UI: no reply pills from an earlier round left on screen until refresh
- [ ] CLN-07 · built · eye: lab pages · Lab debug log (bottom left) does not overlap the pills or counter
- [ ] CLN-09 · built · auto: build/check_hotspots.py · LAY-11 · Clinic tooth at least 1 cm even zoomed (0.50 cm on iPad); trolley objects about 60 design px on
- [ ] CLN-83 · built · eye: diagnosis, pharmacy, scrape, ear · No extra click when the outcome is clear ("Found it", end ✓, stage buttons): it moves on after a
- [ ] CLN-86 · reopened · eye/ear: waiting, fever · Dialogue in bubbles from the speaker's face (she says salaam, he replies; she says "too cold");
- ... 123 more (`node build/tools/review/regress.mjs clinic:heal-cut,clinic:heal-eye,clinic:pharmacy`)

## Left open
<!-- fill in -->
