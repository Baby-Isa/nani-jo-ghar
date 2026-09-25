# The clinic: build log (phase 0–1, 25 Sept 2026)

Branch `claude/build-clinic`. Rules: `docs/modes/BUILD-COMMON.md`; design: `docs/modes/clinic-design.md` Revision 3, then Revision 2, R3.9 and section 12. Every default taken (the child never gives medicine; sides only in the patient's mouth; no pill organiser).

## What's built

| Piece | File(s) | Notes |
|---|---|---|
| Data | `data/clinic.json`, `data/patients/grey-adult.json`, `data/scenes/clinic.json` | Every word and line is an English placeholder (`kutchi: null`); only Cook's number words are real Kutchi. Merged into `Cook.data` in memory at load under clinic-only ids; `data/cook.json` untouched |
| Visit engine (pure, runs in Node) | `js/clinic/visit.js` | V0–V4 plus the treatment round, as graded rows; `judge`, `earStar`, `voiceStar`, `morning` (`days.mix`) |
| Body map (pure) | `js/clinic/body.js` | mirror `.left → .right`, smallest-containing-part hit test with snap-to-nearest, spots, limb axes, close-up |
| Speaking core (pure + mechanic) | `js/clinic/mechanics/tell.js` | accept / wrong hearing (acted on) / null → "say it again?" → pills / a grown-up judges; mic never blocks |
| Mechanics, one file each | `js/clinic/mechanics/{check,where,care,stick,wrap,lift,tuck,drops,handover,ask,tell,you}.js` | `Cook.Mech.define`, knobs in `data/clinic.json` `mechanics` |
| Room, patient | `js/clinic/room.js`, `js/clinic/patient.js` | greybox doctor (folded hands; open hand for the hand-over), kit tray (L2+), trolley, magnifier (face close-up) |
| Stations | `js/clinic/stations/visit.js`, `js/clinic/stations/dispensary.js` | the visit (`calls → where → care → gesture → handover`); the dispensary loads **Cook's fetch, count, stir and pass me unchanged** (`fetch → handover`, `count + stir → handover`, the doctor's bag) |
| Stubs | `js/clinic/stubs/{speech,which,overlay}.js` | see "Stubs" |
| Lab | `clinic.html`, `js/clinic/flow.js`, `css/clinic.css` | every visit type, a morning, the round, every mechanic alone, Cook's mechanics in the clinic, the hotspot editor; level 1–3; "say" dropdown; grown-up toggle; hotspot overlay |
| Tests | `build/leak_clinic.mjs`, `build/check_hotspots.py`, `build/test_clinic.py` | see below |

## Decisions I had to take

1. **"?" and the ear star.** A row settled through the "?" rung isn't a *tested* row; the ear star needs `minTested` tested rows (3 check-up/mystery, 2 named ailment). Without this, "always ask, then pick one" (second-option) and "pick the one that sounds like it" (echo) beat 10% on V3.
2. **Voice star needs two speaking rows** (`voice.voicePass.minRows: 2`). One row of 6 is a 17% mumble. So from level 2 the hand-over asks "What's this?" first (S4 at the hand-over), giving every treated V3/V4 two speaking rows; V0 has two rows (a second scuff, or the cold variant's feeling). A visit with fewer (a mystery's lone S4) shows no voice slot. The same rule for ear: a visit with fewer tested rows than `minTested` shows no ear slot.
3. **V4 (bring someone in, a lab stub) has no ear slot.** R3.4 S3 says *he* examines the part he heard, so the child's only listening rows are the treatment (V3's rows, measured under V3). Graded alone they leaked (frequency 22%). Its star is the voice.
4. **Sides follow R3.2 literally:** a side miss counts only after the recast ("My other knee") is ignored once; so side rows don't count as tested rows.
5. **Level-2 tools are drawn tool-first, evenly**, then a part the tool works on; otherwise "the hand" was right three calls in four.
6. **First-set mini-games for the bot** are the check-up, the mystery, the named ailment, the treatment round (three patients; the item varies across all first-set treatments, since a station that's always "the bandage" answers itself) and you're the patient. Each gesture alone (plaster, bandage, packs, blanket, drops) is in the lab for the hands; its graded rows are its extras (count, colour, path).
7. **Duration strategy**: the bot hears a line's length only to within a Weber fraction of 0.12, over three takes with 18% jitter; it never measures milliseconds. On English placeholders it measures letter counts: re-run when recordings land.
8. **Word stages in the lab**: every word counts as tested (stage 1 twinkle and "taught, not tested" are phase 2 with the intro card). Nothing is saved (`Cook.writeSave` is never called).
9. Level 2 adds the chest (so the stethoscope has more than the tummy); "back" is in the data but not on the front-facing silhouette.

## Leak bot (`node build/leak_clinic.mjs`, 500 visits per strategy per type per level)

PASS on seeds 1 and 7: fair bot 100% ear (and voice where there's a slot); every strategy under 10%. Level 1, ear star %:

| | random | salience | frequency | slot mem. | repeat | duration | wait | visual cue | sweep | leftovers | second | echo |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| check-up | 0.2 | 0 | 0 | 0 | 0 | 0.2 | 0 | 0 | 0 | 0 | 0.4 | 0.4 |
| mystery | 0 | 0 | 0 | 0 | 0 | 1.2 | 0 | 0.2 | 0 | 0.2 | 0 | 0.4 |
| named ailment | 3.8 | 3.0 | 4.6 | 3.0 | 6.6 | 3.6 | 0 | 2.6 | 3.0 | 4.8 | 0 | 0 |
| treatment round | 0.4 | 1.0 | 3.2 | 0.6 | 2.0 | 2.8 | 0 | 1.8 | 0.6 | 1.2 | 1.0 | 0.4 |

Voice star (mumble / random word said): V0 L1 3.8 / 2.0; V3 L2 1.2 / 3.2; V4 L2 0.0 / 2.4; pills and silence 0. Highest anywhere: 6.6% (repeat, V3 L1). Full table: `build/reports/clinic-leak.json`. **Every row is an English placeholder: not yet a Kutchi test.**

Speaking paths (tell core): all seven checks pass (accepted; wrong hearing acted on as a miss; null → one "say it again?" → pills, no voice star; grown-up again/yes; level-1 pills from the start; sets over 8 refused).

## Hotspots (`python3 build/check_hotspots.py`)

PASS. Level-1 effective hit areas on the iPad (1024×768, canvas scale 0.487): arm 2.96 cm, head 3.26, hand 2.26, tummy 2.26, leg 2.11, foot 2.10 (each side). Phone (915×375): smallest 1.28 cm → opens zoomed ×1.36. Face parts are close-up only (×2.6): eye 0.94 cm, tooth 0.50 cm on the iPad: the tooth is too small even zoomed (phase 2).

## Browser (`python3 build/test_clinic.py --canvas`, port 8806)

See the finish report for the runs.
