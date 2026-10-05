# C3: Cook ready to play (decisions 38d, 41)

**Mechanics changed:** pantry tray and samosa fill take things back (tap); a mistimed skewer goes back to the rack (SEK-09); no counting along at L2 (chai's sugar had it). **Old art reused:** all; nothing new.

## 1. Shims
- Done: bulb (`Bulb.create`; `cookShim` unused, left in read-only `bulb.js`), word stages (core Progress), voice (`core.voice.say`).
- **Station iframes: not done.** Cook is one Phaser page with its own DOM, ~50 global scripts and no teardown; the host needs Cook to start and stop inside a given element. Too big for the stop time.
- Legacy stars: kept, marked (Find it, Dress up, Snap).

## 2. Counting rule (order said at the start; the face replays it)
- Pantry: no numbers; counted at L1.
- Chai tray: sugar written L1–2, not from L3 (new); counted L1 only.
- Maani: rows written L1–2; no counting at L1 (one maani).
- Daar/chop: DAAR-08 fixed; Nani's line shows the number as •••; her card's face replays it; counted L1.
- Stir: laps counted L1. Tadka: no counts. Chaat, sekelo: written L1–2.
- Samosa: the headline drops its number from L3 too; counted L1.

## 3. Rows
- **Built:** PAN-01, MAA-01, MAA-08, SEK-07 and SH-35 (rechecked), SEK-09, DAAR-08, SH-13; speakers 48 px.
- **Take-back:** pantry, samosa fill, maani (ball back to its pile). Impossible, shown in the art: chop, tadka, stir, daar, chai.
- **Skipped:** CHAI-07/08, DAAR-02, PAN-09 (need art), CHAI-01 (fun pass), PAN-02 (needs the engine).

## 4. Proof
- `c3-proof` (`--touched cook:`, 248 pages): every flow ends; 450 fixed; 4 new `covers-play-area` (bigger speakers grew the choices), fixed: `c3-proof2` and `c3-proof3` 0 new.
- leak_cook, host, smoke, check_onboard, core, voice, lang pass. QA: `c3-cook-ready-qa.md`.

## Left
- The sandbox take-back path runs under the first-time coach, which blocks it; checked by unguided probes.
- Samosa: Done stays up on an emptied strip.
- Chop knife shows a hand (ART-13, not new).
- `test_cook.py` not run (no Python Playwright). Second reviewer needed.

Shots: `build/screenshots/sandbox/c3-proof*/` (not committed).
