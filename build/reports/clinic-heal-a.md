# Clinic heal A: knee, ear, tooth

All three run on the real host with its sidebar tray, Done button and rough-art sprites. `build/test_clinic_heal_a.py` plays levels 1–3 fairly at phone, iPad and laptop sizes: 27/27 pass, no console errors.

## Level 1
- **knee** (tap, then wrap = drag round the track). Rows: *[Tap the knee]. Trae [taps]*, then *[Bandage]. Char [turns]*. Hammer, then the sore knee: the leg kicks, the dishes rattle, Kasuku squawks. Bandage: drag laps round the track. Done.
- **ear** (tap, then pluck = drag out along the arrow). Rows: *Pela wadho, ne poi nindho*, then *[Clean it]. Ba [times]*, then *Trae [drops]*. Torch, then the pink ear: the cave opens. Tweezers: pull the things (faces, noises) out in order. Bud, drops, Done.
- **tooth** (tap, then brush = swipe). Rows: *[Brush: up, down]*, then *Wadho [tooth]. Ba [taps]*. Brush as called. Drill the named tooth: the sugar bug with eyebrows hops out; tap it into the jar.

## Leak (`build/leak_clinic_heal_a.mjs`, 500 rounds per strategy)
| L1 | worst blind | reader |
|---|---|---|
| knee | 7.0% | 6.0% |
| ear | 6.2% | 5.0% |
| tooth | 5.0% | 16.0% |

Levels 2–3: 0–7.4% blind. The reader reads English placeholders (tooth's directions, knee's level-3 side) until the family gives the words.

## Notes on the contract
- Level 1 carries Kutchi counts and orders that Q5 left free: without them, a level-1 blind bot can't stay under 10%.
- My close-ups cover the host's figure, so a corner portrait (rough sprite per mood) shows reactions; `ctx.patient.react` is still called.
- The host picks the *last* ailment with `from` ≤ level; without `from`, tooth opened level 1 on the cracked tooth. My ailments now carry `from`.
- The lab's log box covers the phone play area (the test hides it); its auto-load of unwritten games gives harmless 404s.
