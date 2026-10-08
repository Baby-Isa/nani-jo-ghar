# Clinic play-test, 8 Oct 2026 (Sprint 2 build, `main` f0f4613a)

Zafar, typed in the orchestrator chat. Model: `clinic-playtest-2026-10-01.md`.

## 1. Mechanics changed and old art reused
- No mechanic removed. The heal games gain the request pop-up that Cook and the pharmacy already have (decision 53); the card's read-out moves into the pop-up only.
- No art reused or changed.

## 2. Points

| # | His words | Screen | Cause (checked in code) | Fix | Row |
|---|---|---|---|---|---|
| P1 | "On some heal games like scrape, we still don't get the first pop up card that describes what is required, which then is supposed to minimise onto the left side bar when the game starts. This needs to happen like it does in cook before every mini game." | Heal games (scrape named) | Only the pharmacy has a request pop-up (`js/clinic/stages/pharmacy.js` `requestPopup`, a clinic stand-in for Cook's own in `js/cook/ui.js`). The heal host (`js/clinic/heal/host.js` ~l.372–396) builds the sidebar card row by row (`setProgressive`) and never shows a pop-up. | One shared request pop-up in `js/shared/` (the order card at full size, read out, a tap skips, folds into the sidebar), used by Cook, the pharmacy and every heal game before it starts. | CLN-84 (re-raised), SH-64 |
| P2 | "I also finished the game quickly and the voice was still going on even though I was in the sendoff game. The voice describing the whole card should only happen during the pop out and it should cut short if the player clicks through into the game." | Heal game → send-off | `Kit.Voice.clear()` (`js/clinic/kit.js` ~l.333) resets `Voice.queue` but the lines already chained on the old queue still run; `Voice.audio` keeps no handle on the playing clip, so nothing can stop it. The pharmacy pop-up folds on a tap but its `card.speak()` carries on. | A voice stop that cancels the queue (a generation counter) and pauses the playing clip; called on a tap through the pop-up and at every stage change. The full card is read only in the pop-up. | SH-64, CLN-109 |

## 3. Rows
Re-raised: CLN-84. New: SH-64, CLN-109.

## 4. Coverage
Two points, both mapped. Unmapped: 0.
