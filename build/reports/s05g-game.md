# S05-G: the last game fixes

Branch `ccr-a7370759-t0lee7`. Red run `ev-20261013-113205-9br` (all nine rows); greens `ev-20261013-120505-1x2`, `ev-20261013-121224-b6k`; sandbox `s05g-touched`. Game code changed: yes (below). Proof files: `build/reports/s05g/` (text committed; the PNGs, e.g. daar11-film.png and chip-green.png, are local only, B19).

## What changed
- **Chaat chips** (`js/cook/mechanics/assemble.js`): word laid out first, never under 14 px (was 13.1 px at 1366x768, 7.1 px at 800x360); pots spread when a word needs a wider slot. 14.2 px at four sizes; 13 baseline findings fixed.
- **CLN-45** (`cut.js`): scrape L3 plasters are L2's, one colour each; heard only is L3's one new thing.
- **CLN-14** (`js/clinic/kit.js`): clinic placeholders carry the hidden `data-rec` tag.
- **SH-17** (`js/cook/ui.js`): the part being said stays lit through a redraw, about 220 ms a word. Pantry strip: 1 frame → 640 ms.
- **SAM-16** (`js/cook/stations/samosa.js`, from the orchestrator, Zafar 13 Oct Z3): each fold is its own diagonal swipe in fold order; only a drag within 30° folds, any other does nothing.
- **SH-69** (`flow.js`, `data/cook.json`, `css/first.css`): Nani says a customer's name at their first visit ("Ali!" heard on day 2); the story card writes only the Kutchi.

## Rows
| row | red | green | verdict |
|---|---|---|---|
| SH-19 | ev-…9br (PASS) | ev-…1x2 PASS | built |
| SH-58 | ev-…9br PASS | same | built, no change |
| CLN-14 | ev-…9br untagged | ev-…1x2 `[ph]` | built |
| ART-18 | P ev-…yrf 1.4/1.9 px | | built, no change |
| SH-66 | P ev-…8ie FAIL | ev-…b6k PASS | built (watch: race) |
| SH-69 | ev-…9br English | ev-…1x2 Kutchi only | built, sheet to judge |
| SH-17 | ev-…9br 0 lit | scratch 640 ms | open: P (capture late, after bulb) |
| DAAR-11 | ev-…9br rot 0 | scratch film, full turn | open: P (stir stopped in trace) |
| SH-01 | tool failure | word fits (12-result.png); chip 14.2 px | open: P (want before layers; results-words) |
| SEK-11 | tap-through cut | engine says it (8 seeds) | open: P (no tap-through) |
| MAA-08 | P: roll-tawa | maani-line plates whole | open: P (legacy lab) |
| CLN-45 | plans: 2-colour L3 | one colour | open: Zafar |
| SAM-16 (fold) | scratch: straight swipes fold | diagonals 42/-40/40 deg, 30 deg gate; SH-19 ev-…xc8 PASS | built, sheet to judge |

## For Zafar (yes to all except…)
1. Other heal ladders jump two things at L2 or L3 (boing drop colours, foot toe order, tooth, taste, eye, knee). Recommend: move each new thing to L2, keep L3 heard only.
2. Two-colour plasters no longer appear. Recommend: leave them out.
3. Nani's name at first launch needs a story line. Recommend: the child says "Nani!" (clip exists).

## For P
SH-17, DAAR-11, SH-01, SEK-11, MAA-08 above; CLN-14's `!textMatches` counts `[ph]`; SH-19 `max 6` never samples fry; SAM-16 needs a probe filming each fold's ghost and swipe. Two rows share the id SAM-16 (the fold, and the L3 mounds): renumber one.

## Not done / seen
Contract-8 on cook:day2: fixed (`maani-line.js`: a cooked maani's ready glow stayed on after the lift, beside the ✓ pulse): red sandbox s05g-c8a 1 break (1324 ms), green s05g-c8b 0 breaks on day2 and maani-line; the card-tint + reading break did not recur on the latest branch. The red run also showed a 45 px bubble speaker (tap-small) on day 2's service view, not seen in green. Story English is spoken by device TTS (rule 10). Mum: "Ma!", the pantry frame "Muke … de". Regressions: touched run only (0 new); full recheck is `/review`'s.

## Proof (from the run; do not retype)
- **Pages run:** 9 (flow x size): 9 flows at 1366x768. 9 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 111 of 111 states, in `build/screenshots/sandbox/s05g-touched` (not committed, B19). Contact sheets: `build/screenshots/sandbox/s05g-touched/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (1 known, 13 fixed). Findings in the run: 1 (tap-small 1).
- **Sound:** 57 lines with no family clip, 21 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/s05g-touched vs build/tools/review/approved-shots.json: 345 shots, 0 changed, 345 new, 0 gone, 0 identical
- **Word checks (report-only):**
  - A  string literals typed in game code: 38 (0 Kutchi, 38 English); 239 single words that may be ids
  - B  English that a child may see: 38 English literals + 32 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (13 places)
  - D  lines with no family recording: 36 distinct words with no clip in 4081 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: clinic:heal-cut@L3, clinic:heal-cut, clinic:waiting, cook:assemble, cook:chaat, cook:day2 ... · reviewer: <someone other than the builder> · commit: 0654830
Auto: layout lint ✅ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (run them: ✅/❌)
Screens (flaws first):
- <state> @ <size>: <flaws, or ✅>
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 106 rows below
Against Zafar's last feedback: <item ✅ / note>
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| clinic:heal-cut | 1366x768 | 6 | 0 | sheets/clinic-heal-cut__1366x768.png |
| clinic:heal-cut@L3 | 1366x768 | 6 | 0 | sheets/clinic-heal-cut-l3__1366x768.png |
| clinic:waiting | 1366x768 | 5 | 0 | sheets/clinic-waiting__1366x768.png |
| cook:assemble | 1366x768 | 10 | 0 | sheets/cook-assemble__1366x768.png |
| cook:chaat | 1366x768 | 12 | 0 | sheets/cook-chaat__1366x768.png |
| cook:day2 | 1366x768 | 19 | 0 | sheets/cook-day2__1366x768.png |
| cook:fetch | 1366x768 | 9 | 0 | sheets/cook-fetch__1366x768.png |
| cook:stir | 1366x768 | 9 | 0 | sheets/cook-stir__1366x768.png |
| first | 1366x768 | 35 | 1 | sheets/first__1366x768.png |

### Regression rows to recheck (106; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] CLN-02 · built · eye: 1366×768 · ART-03 · Backgrounds locked first: six new rooms, heal games have a background, nothing faded; pharmacy s
- [ ] CLN-03 · built · eye: 1366×768 · CMP-01 · Clinic uses what Cook learned: shared order card as patient card, guide box, end pop-up, review
- [ ] CLN-08 · built · eye: heal games · Heal-game close-up background blurred more in code so the room never competes; certificate frame
- [ ] CLN-81 · open · eye: clinic morning end to end · The girl's finished art in the whole story: waiting room, diagnosis, send-off, sticker and card
- [ ] CLN-82 · built · eye: every heal game L2, L3 · L2+: once a count is reached, the next step's row appears and its tool glows after a pause (stuc
- [ ] CLN-84 · built · eye/ear: pharmacy L3 and all nine heal · The request first in a pop-up, then a quiet game (pharmacy and every heal game; decision 53). Re
- [ ] CLN-85 · built · eye: diagnosis, pharmacy, each heal ga · The person being served or treated sits at the top right in every clinic stage that has one (dia
- [ ] CLN-87 · built · eye: zoom in and out in every heal gam · Zoom in and out about 1.5 s; zoom-out from full zoom on the healed part; her poses during the zo
- [ ] CLN-109 · built · ear: scrape L1 finished fast, then sen · No voice carries over into the next stage: finishing a heal game quickly left the doctor still r
- [ ] CLN-112 · built · sandbox #takeback flows, every heal ga · Take it back until Done in every clinic game (UX §17, like CK-TB-01): every heal game and stage
- [ ] CLN-113 · built · eye: the audit table, one line per gam · Every ordered instruction in every clinic game is a sequence on the shared card (line, grey band
- [ ] CLN-114 · built · auto: contract-9 closed-card (L3+: wai · From L3 the card is closed in the pharmacy and every heal game (and the waiting room), with the
- [ ] CLN-30 · built · auto: build/check_onboard.mjs; eye: ev · Each heal game explains itself with one "why" beat ("why am I clicking on the things?"), no Engl
- [ ] CLN-32 · built · eye: scrape · INT-02 · Scrape: not too clicky; plasters in clear colours and order; a plaster can be taken off; sequenc
- [ ] CLN-42 · built · eye: every heal game · No unexplained icons: no 🩺 badge bottom left, no gold half-circle on tools, no glove on the syr
- [ ] CLN-43 · built · eye: each heal game's opening, 1366×76 · A heal game opens by zooming from the patient on the bed to the sore part; never a lone limb on
- [ ] CLN-44 · built · eye: each heal game · CMP-07 · Every heal card has a headline (the goal) and folds to it with the check
- [ ] CLN-45 · open · review: the level data of all nine gam · Every heal game's ladder adds one thing per level (D19): L1 the count; L2 one new thing; L3 hear
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
- [ ] CLN-118 · built · eye: a fresh profile in each of the ni · The first time a child plays any heal game is a taught round: the game shows the first task, the
- [ ] CLN-119 · reopened · auto: the words each game marks in ctx · Each heal game teaches its own language strand beyond numbers, from its scene (D18): scrape colo
- [ ] CLN-121 · built · eye: scrape close-up, ×2 zoom · The scrape's cut and graze art is redrawn realistic (comical, not gory, H26) through the image A
- [ ] CLN-10 · built · eye: 1366×768 · Waiting room not too wide, front half not empty floor; something on the wall says "doctor's"
- [ ] CLN-11 · built · eye: 1366×768 · People sit on one large bench (six seats, no armchairs)
- [ ] CLN-12 · built · eye: each level · Picking the right person: no walking; tick under each person; the picked person rises off the se
- [ ] CLN-13 · built · eye: L4 · At most six people at every level (changed from 8–12)
- [ ] CLN-14 · built · auto: leak bot; eye · LNG-02 · "Call them in" does not leak: card shows a round face with no text; call heard from L3
- [ ] CLN-15 · built · eye: L4, L5 · L4: pick everyone straight away, judge at the end, ticks show numbers; L5 has the same fixes
- [ ] CLN-90 · built · eye: 1366×768, 844×390 · Selector circles and "call them in" boxes spaced cleanly
- [ ] CLN-91 · built · eye: W L3 · The closed card's eye is a small bulb, no counter
- [ ] CLN-92 · built · eye: waiting end · "To the doctor's room" button (location, not "where does it hurt")
- [ ] CLN-110 · built · auto: contract check (no button after · Waiting room moves on by itself once the right person is picked and greeted: no ✓ or stage butto
- [ ] CLN-115 · open · eye/ear: waiting room, every level, th · The waiting room's call comes from the doctor at his half-open door, his head leaning out, calli
- [ ] CLN-01 · reopened · eye: each room · Rough stand-in art made judging hard ("so overwhelmed by how terrible the visuals were"); real a
- [ ] CLN-04 · built · eye/ear: waiting room ladder · Language builds up simply (man, woman, boy, girl; old, young; tall, short; colours; "with the ba
- [ ] CLN-05 · built · eye: sidebar · CMP-06 · No Nani box in the clinic; the doctor fills her role
- [ ] CLN-06 · built · auto: contract-13 stale-ui (no reply p · Each stage clears its own UI: no reply pills from an earlier round left on screen until refresh
- [ ] CLN-07 · built · eye: lab pages · Lab debug log (bottom left) does not overlap the pills or counter
- [ ] CLN-09 · built · auto: build/check_hotspots.py · LAY-11 · Clinic tooth at least 1 cm even zoomed (0.50 cm on iPad); trolley objects about 60 design px on
- [ ] CLN-83 · built · eye: diagnosis, pharmacy, scrape, ear · No extra click when the outcome is clear ("Found it", end ✓, stage buttons): it moves on after a
- [ ] CLN-86 · built · eye/ear: waiting, fever · Dialogue in bubbles from the speaker's face (she says salaam, he replies; she says "too cold");
- [ ] CLN-88 · built · auto: timing · Clinic lab pages load fast (no serial JSON chain, games loaded on demand)
- [ ] CLN-89 · built · eye: labs.html · Labs point at the current clinic lab only (old clinic lab index still reachable)
- [ ] CLN-111 · built · eye: the clinic end screen at L1 and a · The clinic's end screen also offers Again (the same patient) and All patients, like Cook, from t
- [ ] CHT-01 · built · eye: L1 · INT-10 · Quantities are not only heard: card says ba dungri at L1 (counting rule)
- [ ] CHT-02 · built · eye: 1366×768 · Ingredient bowls side-on, not three-quarter
- [ ] CHT-03 · built · auto: build/check_vessel_meta.py check · Glass bowl: a thin, plain side-on profile with layer strips, no thick base, no reflections, flat
- [ ] CHT-04 · built · eye: serve and build states · Layers read as food, not liquid or flat rectangles; chilli layer not too thick; tidy ingredient
- ... 46 more (`node build/tools/review/regress.mjs clinic:heal-cut,clinic:waiting,cook:assemble`)

## Left open
<!-- fill in -->
