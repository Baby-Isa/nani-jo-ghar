# S02-A: the shared round flow

Branch `ccr-a7370759-t0lee7`, from `d9a935f`. Not reviewed yet: builder's notes only.

## What changed
1. **Ticks = rows**: hints count only on the hints badge; a wrong pick marks its row; review per person, wrong always left.
2. **Redo on the spot**: `OrderCard.redo` (3 tries, then "show"); chai redoes only the wrong cup, glows the next thing on the retry, shows the right way at try 3. Clinic: no redo game wired (Session C).
3. **Next step at L2+**: every heal step on the card (later greyed); after the count the next row lights, its tool glows, the doctor says it; obvious ends move on.
4. **Requests first**: everyone walks in; the pop-up reads each person's card, side by side.
5. **Guide**: `NaniGuide.stepper` / `UI.step` / `UI.guideSay`; R4 strip (pantry, heal games: one face).
6. **Bulb**: translates the guide line, full numbers; numbers stay written for the first 3 hearings; spoken cards get a small bulb, no counter.
7. Highlight, flat ✓ that glows, served picture stamp, verdicts as pictures (stations.js `verdict`).
8. Count word pauses the line and it carries on; gaps 40 ms; call-back + Shabash; *arre re* is now a soft sound (no "oh oh oh" clip yet).
9. `.njg-act` buttons; clinic no longer restyles shared buttons; Play as new; Start over forgets words.
10. Load (cold/warm, s): Cook lab 6.8/0.8 → 4.1/0.6; clinic heal 3.4/1.7 → 2.3/0.2; pharmacy 3.3/1.6 → 2.2/0.1. TTS ×2 by ffmpeg.

Edits outside owned files: chai-tray.js (redo), stations.js (`verdict`), cook/index.js, clinic/lang.js; one-line hooks in fetch, daar, stir, zone, station-lib, cut, knee, boing, foot, waiting.

## Proof
checks.mjs ok; leak knee/cut/boing/foot PASS; check_onboard ok. Sandbox `s02a-quick` (5 flows, 1366×768): 0 new findings, 0 page errors. About 25 min of browser checks, over the 15-minute cap.

## Open
No clinic redo game; Cook images preloaded for every station (stations.js); "Muke de" and step lines need Mum; scrape and boing L2 not shot; QA checklist ⬜, for `/review`.
