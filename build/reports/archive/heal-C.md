# heal-C: fever room, boing's drop machine, foot's sole

Branch `ccr-fcd9dddd-wnywzc`. Only D15f/g/i changed. All new words are placeholders "to record" (`lang.json` `fever-*`, `boing-*`, `foot-*`).

## What changed
- **Fever (D15f):** the wide exam room, no close-up, the patient's own figure (CLN-67). "Take the temperature" kept, then a live wall thermometer with a green zone. Cool: window 3, ceiling fan 2, hand fan 1; warm: heater 3, bottle 2, blanket 1; ice pack off (`rules.icePack`). Every tap toggles (CLN-57); blanket over the shoulders (CLN-56); hot/cold stand-ins. L1 named "on" fixes; L2 + undo verbs; L3 + "fix it".
- **Boing (D15g):** wipe kept; drop machine (1 dispenser, 4 at L3 with colours), matte teardrops counted on the syringe; take back by tapping that drop (CLN-58); glowing end starts the jab, no ✓/glove; BOING a starburst; no apple or lollipop (CLN-66).
- **Foot (D15i):** the sole; square-turn channels to the edge, narrower by level; a touch = "ow", back to the last turn, scored; toes named at L3 (CLN-64). Soak closes by grabbing a splinter.
- Art swaps in by file name (`art` in each JSON).

## Leak (2000 rounds, worst blind L1)
fever 5.5%, boing 7.2%, foot 6.9%; fair 100%.

## Rows built, not re-played
CLN-31, 37, 40, 47, 56, 57, 58, 64, 66, 67; CLN-65 part; KEEP-07, 10.

## Checks
Sandbox `--touched` (36 pages, all sizes, L2, L3, mistake, hint): 0 new findings, all end (runs heal-C-2, -3). Sheets: `build/screenshots/sandbox/heal-C-2/sheets/` (uncommitted). check_onboard, test_clinic_r5, check_clinic_kutchi pass. Flaws: tablet close-ups don't grow; fever things small on phones; foot L3 busy.

## Proposals (group A)
1. `HOST.stage`: skip the zoom for `camera.wide: "room"` (fever removes `.cl-zoom` itself meanwhile).
2. `ctx.countAt(el)` for non-tool counts.
3. `pipeline.json` fever: only the thermometer.
4. 844×390 closed card: "TO RECORD" under the eye; "," span 13.7 px.

## For Zafar
Kutchi to record: room things, open/close/switch on/off/give/put on, hot/cold lines, "fix it", drops, press, middle toe, "ow". Use Mum's *laal*/*lilo* for boing's colours?
