# Clinic heal A: knee, ear, tooth (26 Sept 2026)

All three games run on the real host (`lab/clinic-heal-host.html`). They use the sidebar tray, the Done button and the rough-art sprites. `build/test_clinic_heal_a.py` plays each level 1–3 fairly at phone, iPad and laptop sizes: 27/27 pass with no console errors. Screenshots are in `build/screenshots/clinic-heal-a/`.

## Level 1
- **knee** (tap, then wrap = drag round the track). Rows: *[Tap the knee]. Trae [taps]*, then *[Bandage]. Char [turns]*. Tap the hammer, then tap the sore knee: the leg kicks, the dishes rattle, Kasuku squawks. Tap the bandage and drag laps round the dashed track. Then Done.
- **ear** (tap, then pluck = drag out along the arrow). Rows: *Pela wadho, ne poi nindho*, then *[Clean it]. Ba [times]*, then *Trae [drops]*. Torch, then the pink ear: the cave opens. Tweezers, pull the things out in order (each one has a face and a noise). Then the bud, the drops, and Done.
- **tooth** (tap, then brush = swipe). Rows: *[Brush: up, down]*, then *Wadho [tooth]. Ba [taps]*. Brush in the order called. Drill the named tooth; the sugar bug with eyebrows hops out. Tap it into the jar the called number of times.

## Leak (`build/leak_clinic_heal_a.mjs`, 500 rounds per strategy)
| L1 | worst blind | reader |
|---|---|---|
| knee | 7.0% | 6.0% |
| ear | 6.2% | 5.0% |
| tooth | 5.0% | 16.0% |

Levels 2–3 are 0–7.4% blind. The reader reads the English placeholders. Tooth's directions and knee's level-3 side are placeholders until the family gives the words.

## Notes on the contract
- Level 1 carries Kutchi counts and orders that Q5 left free: without them, a level-1 blind bot can't stay under 10%.
- My close-ups cover the host's figure, so a corner portrait (the rough patient sprite per mood) shows the reactions. I also call `ctx.patient.react` as the contract asks.
- The host picks the *last* ailment whose `from` ≤ level. Without `from`, tooth would open level 1 on the cracked tooth. Every ailment in my data now carries `from`.
- The lab's log box covers the phone play area. The test hides it.
- The lab auto-loads all nine game ids, so the six games not yet written give harmless 404s.
