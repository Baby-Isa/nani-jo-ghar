# S05-C2: Cook round 2 (Sprint 5)

Branch `ccr-a7370759-t0lee7`. Game code changed: yes (js/cook main, flow, ui, mechanics/roll; css/cook.css).

## What changed
- **SH-44:** the game host passed no steps to the end screen (main.js); now it does. A step word still to record is grey italic.
- **SEK-03:** each mixed skewer is its own little-skewer box, including two of one mix (ui.js).
- **SH-51:** the coin jar's total showed under the sticky buttons on short phones (cook.css).
- **SH-17:** the pantry strip's words light as Nani says them (ui.js speakAlong).
- **Legacy Roll:** now uses the maani line's painted chakla, velan and dough (roll.js).

## Rows
| row | red | green | verdict |
|---|---|---|---|
| SH-44 | 0 steps (lab.html, scratch) | 6 steps | Cook half built; list open waits on decision 93 (S) |
| SEK-03 | 081608-cum | peek2 scratch | built, sheet to judge; pills break mid-word (S) |
| SH-51 | 081608-cum | 083919-3ny | built, sheet to judge |
| SH-17 | strip on=0 | on=1 (scratch, speed 1) | built; probe too fast (T) |
| SH-09, PAN-01, SH-58, CHAI-15 | — | 081608-cum, 084420-7jh | PASS (no C change) |
| SEK-07 | — | 084420-7jh | sheet to judge |
| SH-19 | 001738-bc3 | — | open: shared ghost shows (scratch); probe counts at opacity 0 (T) |
| DAAR-11 | 084420-7jh | — | open: Zafar (radial ladle turns the arm) and T |
| SEK-03 L4 stall | — | — | open: not reproduced (3 plays) |
| Hesitation hint | — | — | paid hint (help 0 to 1 when written) |

Red run ev-20261013-001738-bc3; touched run `s05c2-touched`.

**Open:**
- Fill fold: re-lay it on the strip art (Zafar).
- contract-3 in day 1, "Thank you!" (C).
- Five contract-8 double highlights (S/C).
- Flaws seen (not mine): see the QA section.

## Proof (from the run; do not retype)
- **Pages run:** 7 (flow x size): 7 flows at 1366x768. 7 reach their end, 0 stop short.
- **Page errors:** 0.
- **Screenshots:** 81 of 81 states, in `build/screenshots/sandbox/s05c2-touched` (not committed, B19). Contact sheets: `build/screenshots/sandbox/s05c2-touched/sheets/<flow>__<size>.png`.
- **Layout lint vs baseline:** **PASSED**: 0 new findings (1 known, 4 fixed). Findings in the run: 1 (canvas-text-small 1).
- **Sound:** 41 lines with no family clip, 15 played files that are not an approved family clip.
- **Screenshots against the approved manifest:** shotdiff build/screenshots/sandbox/s05c2-touched vs build/tools/review/approved-shots.json: 230 shots, 0 changed, 230 new, 0 gone, 0 identical
- **Word checks (report-only):**
  - A  string literals typed in game code: 38 (0 Kutchi, 38 English); 238 single words that may be ids
  - B  English that a child may see: 38 English literals + 32 English label words (Done, Next ...)
  - C  misspelt variants: 4 of 8 known variants appear (13 places)
  - D  lines with no family recording: 36 distinct words with no clip in 4081 Cook lines played

## QA checklist results (`docs/process/qa-checklist.md`)
```
QA: cook:day1, cook:fetch, cook:mishkaki-grill@L3, cook:mishkaki-grill@L4, cook:mishkaki-grill, cook:roll ... · reviewer: pending (/review; the builder only listed flaws) · commit: e99f4ea
Auto: layout lint ✅ · other scripts that apply: build/check_vessel_meta.py, build/check_hotspots.py, build/test_shared_ui.mjs, build/check_onboard.mjs (checks.mjs all ok: 291 unit tests, words 0, specs 0; loadcheck 21/21 ✅; touched run: 6 contract breaks, none from these changes)
Screens (flaws first):
- changed.png #17, #18 @ 1366: blank cream frames between scenes (cook:day1, not mine)
- #32 @ 1366: Nani's day-1 bubble writes the English line "I'll give you pocket money..." (non-negotiable 5: spoken only)
- #39 @ 1366: a small green square under Nani (cook:day1)
- #9, #29 @ 1366: word review leaves the left half empty (shared)
- grill L3/L4 peek: skewer pills break words mid-letter ("mis/hka/ki"; shared order card, S; contract-15 SH-73 should catch it)
- roll @ 1366: painted chakla, velan, dough, one gold ring ✅; Fill's fold still the drawn triangle (Zafar)
- jar summary 844x390 and 800x360: total clear of the buttons ✅ (the landing card covers the lid while it lands)
Checklist: TXT ⬜ · LAY ⬜ · CMP ⬜ · LNG ⬜ · INT ⬜ · AUD ⬜ · ART ⬜ · CUL ⬜ · REL ⬜   (⬜ = not yet reviewed: set ✅ or ⚠ with the line id)
Regressions rechecked: 68 rows below
Against Zafar's last feedback: D6 ladle (DAAR-11) needs his call; decision 93 (steps page) is S's
```

### Screens to look at (one line each once judged)
| flow | size | states | findings | sheet |
|---|---|---|---|---|
| cook:day1 | 1366x768 | 16 | 0 | sheets/cook-day1__1366x768.png |
| cook:fetch | 1366x768 | 9 | 0 | sheets/cook-fetch__1366x768.png |
| cook:mishkaki-grill | 1366x768 | 10 | 1 | sheets/cook-mishkaki-grill__1366x768.png |
| cook:mishkaki-grill@L3 | 1366x768 | 12 | 0 | sheets/cook-mishkaki-grill-l3__1366x768.png |
| cook:mishkaki-grill@L4 | 1366x768 | 12 | 0 | sheets/cook-mishkaki-grill-l4__1366x768.png |
| cook:roll | 1366x768 | 10 | 0 | sheets/cook-roll__1366x768.png |
| lab:cook/daar | 1366x768 | 12 | 0 | sheets/lab-cook-daar__1366x768.png |

### Regression rows to recheck (68; open, reopened and built-not-re-played rows; fixed rows are not listed)
- [ ] CK-01 · open · eye: L2–L4 · INT-11 · Levels 2–4 of every station (Cook and clinic) not yet played by Zafar; needs his pass
- [ ] CK-02 · open · auto: build/check_vessel_meta.py · LAY · Hobs are straight with clean corners and even sides, one family for all burner counts (not compo
- [ ] CK-03 · built · eye: 390×844 · LAY-04 · Knobs big enough, match the face badges; on = glowing ring, no icon
- [ ] CK-04 · built · eye: 4-pan hob · Flames small (peek, never touch neighbours), on whenever the knob is on; heat gauge thicker and
- [ ] CK-05 · built · eye: each station · ART-03 · One camera look per station (no side-on jars with top-down sekelo and three-quarter bowls); stra
- [ ] CK-06 · built · eye: each cooking state · Things inside pots and pans look real (chai liquid, daar oil, contents), not white dots or swirl
- [ ] CK-07 · built · eye: each station · CMP-13 · One review at serve in every station: large round face circle over the dish, happy or frown, no
- [ ] CK-08 · built · eye: samosa, daar · No oil-heating ring (it looks like the timing ring); sizzle means ready
- [ ] CK-09 · open · eye: maani, samosa, ×2 zoom on board a · One house chakla: dark walnut, not blown up or low-res; no board drawn on a board; the rolling p
- [ ] CK-12 · open · eye: every vessel state · LAY-10 · Pot and pan contents sit inside the rim, not above it (vessel geometry stored as fractions of th
- [ ] CK-TB-01 · built · sandbox #takeback flows · Take it back until Done (E14): 9 of 12 Cook stations offer no take-back (only chaat, assemble an
- [ ] CK-TAB-01 · reopened · sandbox 1024×768, 1180×820, 1366×1024 · Tablets: Cook's play items grow to use a 4:3 screen (decision 24); each station needs a 4:3 layo
- [ ] CK-20 · open · eye: every vessel · LAY-10 · Rule: things inside a container sit on its flat inner area, never the rim or sides (thali, tray,
- [ ] CK-21 · built · eye: every serve · Served dishes sit IN their tray on the counter, the way items sit in the pantry tray: the tray's
- [ ] CK-22 · built · ear: every serve, the closing line lis · The closing line lists back what they got, then thank you / shabash (no repeated "give me")
- [ ] CK-23 · built · eye: #mistake in every station and eve · A wrong item means redo just that item; second try with help; after three, show the right way
- [ ] CK-24 · built · eye: home · Story days are clearly days (not levels 1–4) on Cook's home
- [ ] CK-25 · built · auto: timing; eye · Labs station pages load fast (10–12 s now): measure, then load per station
- [ ] CK-26 · built · eye: greeting · The greeting: your wrong pick red, the other wrong ones grey, the right one clear against the br
- [ ] CK-27 · built · eye: chai, daar, chaat, samosa, the mo · An ingredient going into a pot, pan, glass or bowl shows a small puff or sprinkle: one shared ef
- [ ] CK-28 · built · eye: labs.html · The labs page groups its tiles (stations, recipes, clinic) so a tester can see what there is ("I
- [ ] CK-29 · built · auto: contract check (decision 75) eve · Every recipe gives each instruction just before the game that needs it (the chaat flow, CHT-07:
- [ ] PAN-01 · built · eye: 390×844 and 1366×768, each fetche · KNOWN BUG. "Bring me these" headline clipped ("these" cut) and the growing highlighted row / gol
- [ ] PAN-02 · reopened · eye/ear: every order sentence · LNG-03 · KNOWN BUG. Spoken and written lines are fragments with no verb (khun, ne daar, ne dudh; "I want
- [ ] PAN-03 · built · eye: pantry card · LNG-04 · Headline says "bring me these for {dish}", not "Muke dudh de." over atto with chai below (reads
- [ ] PAN-04 · built · auto: contract-7 one-voice (voice log: · One speech queue per station, in every station and the clinic: the count words, Nani's "next thi
- [ ] PAN-05 · built · eye: story mode · Pantry is fetched first, the first time each dish is made that day, story mode only
- [ ] PAN-06 · built · eye: 1366×768 · ART-03 · Shelves side-on, not top-down bowls; clear labelled jars; meat in a fridge section; no generic m
- [ ] PAN-09 · built · eye: 390×844 and 1366×768, pantry shel · The small jars (garlic, ginger, cardamom, salt) are drawn at the full slot size with their conte
- [ ] PAN-10 · open · ear: pantry L1–L3; eye: the guide box · Pantry wording: card headline Muke de + items, Nani's box the task (Muke chai lai de, to check w
- [ ] PAN-11 · built · ear: tap mid-line · INT-01 · A tap during her line pauses her, the count word plays, and she carries on (no garbled "Hakro…")
- [ ] PAN-12 · built · ear: pantry count · Shorter gap between count words (trim clip silence)
- [ ] PAN-13 · built · eye: story days 1–3 · Pantry/chai fatigue in the story days: pantry only the first time a dish is ever made; a new sta
- [ ] PAN-14 · built · auto: contract-11 background (drawn as · The pantry background (and every background, SH-29) is never stretched out of proportion at any
- [ ] PAN-15 · built · auto: node build/tools/review/leak.mjs · The shelf labels give the order away (non-negotiable 6): a jar's word label follows that word's
- [ ] PAN-16 · built · auto: evidence voice log of the pantry · The pantry reads its lines twice: Nani's ask for a thing (Muke dudh de.) is said, then said agai
- [ ] PAN-17 · built · auto: evidence probe, the sidebar text · From L3 (cards closed, F9, E12; data.calm.closedFrom = 3) the pantry's header still writes the n
- [ ] SEK-01 · built · eye/ear: card · LNG-04 · Headline is Muke sekelo khape (was "mishkaki"; mishkaki is the meat cubes); sekelo still to conf
- [ ] SEK-02 · built · eye: ×2 zoom · All-new art, not reused old grill, rack, board and skewer; rack does not read as an empty pictur
- [ ] SEK-03 · open · eye: sekelo L3–L4, samosa L3, chaat, s · Several skewers get a mini card each: each skewer a plain group box of pills, alternate groups t
- [ ] SEK-04 · built · auto: data check; eye · No bare "boga" skewers; a veg skewer names what is on it, in order
- [ ] SEK-05 · built · auto: build/test_cook.py --orders · No duplicate pick in an order ("tameto, tameto")
- [ ] SEK-06 · built · eye: ×2 zoom · Onion and tomato are big and chunky, the same in the bowl and on the skewer, not oversized again
- [ ] SEK-07 · open · eye: plate state with 2–4 skewers, ×2 · Plate skewers lie straight and parallel, left to right across the plate, never fanned or bending
- [ ] SEK-08 · built · eye: each phase · One job per phase (thread, then grill); no chips on the grill
- [ ] SEK-09 · built · eye: grill phase, turn early / on time · Turning a skewer too soon shows nothing and costs nothing (too late not yet tested). An early tu
- [ ] SEK-10 · built · ear: sekelo L2 · Count-along at L1 only (L2 still speaks every piece)
- [ ] SEK-11 · reopened · ear: L2–L3 · Spoken order: each skewer's sequence follows it at once ("two mixed: first…, then…; one onion")
- [ ] SEK-12 · built · eye: L3 bulb · Quantity two written where said (with SH-52)
- [ ] SEK-13 · open · eye: mixed skewer · Card ticks each piece of a mixed skewer as it goes on
- [ ] SEK-14 · open · eye: rack and plate with 1–4 skewers, · The rack and the plate are pre-rendered pictures holding one, two, three and four real skewers (
- [ ] DAAR-01 · built · auto: build/test_cook.py; eye: chop · Swipe chop stays ("there's no game now" when it became tap crate, tap knife)
- [ ] DAAR-02 · reopened · eye: ×2 zoom, stir · Ladle: a real kadchi seen top-down, its handle rising toward the viewer (foreshortened, "stickin
- [ ] DAAR-03 · built · eye: stir · Stir shows speed and laps (speed dial, laps as Kutchi word)
- [ ] DAAR-04 · built · auto: order-card state; eye · CMP-09 · Chopped rows reset at the pan and tick as each goes in
- [ ] DAAR-05 · built · eye: each stage · Ginger and added things are not white dots; stir turns the pictured contents (review bowl still
- [ ] DAAR-06 · built · eye: serve · Finished daar is photoreal on a small wooden trivet
- [ ] DAAR-07 · open · eye: 1366×768 · ART-03 · Pot and chopped-ingredient container are straight top-down
- [ ] DAAR-08 · built · eye: L1–L4 · INT-10 · Chop card writes quantities at every level (open question: should L1 say ba dungri only?)
- [ ] DAAR-09 · built · eye: daar wrong spice · A mistake redoes only the wrong step; after three wrong tries the game shows the right way (whol
- ... 8 more (`node build/tools/review/regress.mjs cook:day1,cook:fetch,cook:mishkaki-grill`)

## Left open
<!-- fill in -->
