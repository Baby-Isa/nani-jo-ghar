# S02-A: the shared round flow

Branch `ccr-a7370759-t0lee7`, from `d9a935f`. Not reviewed yet: builder's notes only.

## What changed
1. **Ticks = rows** (flow.js): hints only on the hints badge; a wrong pick marks its own row; review words per person; wrong always on the left half (results.css).
2. **Redo on the spot**: `OrderCard.redo` (3 tries, then "show"); chai redoes only the wrong cup, glows the next thing on the retry, shows the right way at try 3. Clinic: no redo game wired (Session C).
3. **Next step at L2+**: heal card shows every step, later ones greyed; after the count, the next row lights, its tool glows, the doctor says it; an obvious end moves on by itself; no counting aloud from L3.
4. **Requests first**: everyone walks in; the pop-up reads each person's card, side by side.
5. **Guide**: `NaniGuide.stepper` / `UI.step` / `UI.guideSay`; R4 strip (pantry, heal games: one face).
6. **Bulb**: translates the guide line, full numbers; numbers stay written for the first 3 hearings; spoken cards get a small bulb, no counter.
7. Highlight, flat ✓ that glows, served picture stamp, verdicts as pictures (stations.js `verdict`).
8. Count word pauses the line and it carries on; gaps 40 ms; call-back + Shabash; *arre re* is now a soft sound (no "oh oh oh" clip yet).
9. `.njg-act` buttons; clinic no longer restyles shared buttons; Play as new; Start over forgets words.
10. Load: parallel modules/JSON. Cook lab 6.8→4.1 s cold, 0.8→0.6 warm; clinic heal 3.4→2.3 / 1.7→0.2; pharmacy 3.3→2.2 / 1.6→0.1. TTS ×2 by ffmpeg.

One-line hooks: fetch.js, chai-tray.js (full redo wiring), daar.js, stir.js, zone.js, station-lib.js, stations.js (`verdict`), cut/knee/boing/foot.js, waiting.js, lang.js, index.js.

## Proof
checks.mjs ok; leak knee/cut/boing/foot PASS; check_onboard ok. Sandbox `s02a-quick` (5 flows, 1366×768): 0 new findings, 0 page errors. About 25 min of browser checks, over the 15-minute cap.

## Open
No clinic redo game; Cook images preloaded for every station (stations.js); "Muke de" and step lines need Mum; scrape and boing L2 not shot; QA checklist ⬜, for `/review`.
