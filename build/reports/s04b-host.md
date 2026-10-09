# S04-B: the shared host lifecycle

Branch `ccr-a7370759-t0lee7`, commits `4d66bcd`, `a16ab03`, `ca104ce`. Game code changed: yes (shared layer, Cook, clinic). No mechanic removed.

## Flaws and open points first
1. Contract still flags (left for Zafar or Session A): chaat's bowl ✓ (take it back until Done; knee's counted ✓ went, decision 79, `capped` counts in the heal host; an uncapped count keeps its ✓, C10); the heal "thank you" bubble (the probe takes the art box's top, y 74, as her head; it sits above her drawn head, `s04b-k1` c07); no pop-up before the waiting room and diagnosis (A's flaw 3); Cook's call-back line starting 6–12 ms after the stop is counted against the station (the probe samples every 100 ms; it could read `Lifecycle.log`).
2. ART-18: the bob is coded, but nobody has looked at it moving yet. Heal "thank you" bubble now follows the zoom; not re-shot.
3. `data/cook.json` (C's art data): the Chop station's manifest now lists `tool-knife-t-v2.webp` (needed for the knife).
4. The clinic leak bot needed more than 4 minutes, so the orchestrator should run it; heal-cut leak PASS.

## What was built
- `js/shared/request-popup.js`: `Lifecycle` with `request`, `advance`, `stageEnd`, `results`, `bubble.place` (above the head, else below), `talk` (2 px, 0.4°, 380 ms) and `voice` (the one stop).
- Callers moved onto it: Cook's order pop-up and station end (`ui.js`, `station-lib.js`), Cook's end screen (`flow.js`), the host's stage end and end screen (`host.js`), the clinic stage clear, pharmacy and heal pop-ups, and `Kit.Voice`. The core voice and Cook's player register with it, and a clip still loading at a stop never starts.
- CHT-10: `UI.mission.request` puts chaat's layer order and daar's tadka and stir orders through the pop-up.
- CLN-110: the waiting room moves on by itself. Heal games' obvious finish shows no ✓.
- SH-67: the badge CSS fix. DAAR-13: the new knife is the chop default.
- Grep: no `RequestPopup.`, `VoiceStop.` or `Results.show(` left in js/cook or js/clinic.

## Proof
- `checks.mjs`: 229 unit tests pass, word lint 0, load check 21/21. `check_onboard` ok.
- Contract route at 1366×768 (`s04b-c1` before, `s04b-c2` after): 34 breaks (A's pre-fix run) → 23 → 20. The 7 standing-Nani breaks are no longer counted (orchestrator, `1e24c50`).
- Phone runs `s04b-p1` and `s04b-p2`: badges in order; the diagnosis bubbles sit at the heads. Browser time about 11 minutes.
- Rows set with shot paths: SH-64, CHT-10, SH-66, SH-67, SH-68, CLN-86, CLN-92, CLN-110, SH-40, DAAR-13, ART-17. ART-18 stays open; ART-13 is the art.

QA: screens judged by the builder only; a fresh reviewer is needed (C4).
