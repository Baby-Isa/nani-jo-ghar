# s20-p2-chai: chai settled as the reference (Sprint 20 P2)

Builder, Opus high, 13 Nov. Branch `s20-p2-chai` (not pushed). Not re-frozen: the list below is for Zafar.

## What changed
- **SH-286 (decision 23):** the dish card is the order's own item pop-up: one `popCard` in `js/cook/ui.js` draws the dish card and the item cards (same place, size, look, pop-in); it shrinks away as its line ends, never joins the card. L1 only. `WordCard.flash` is no longer called.
- **Faults:** (a) contract-124 #takeback: a **check fault**, `build/sandbox/lib/contract-night.mjs:36-49` takes the want leaving `knob-on-nana` as a knob turn; the child took the sugar back, no knob was turned. (b) contract-37 L2-L3: a **check fault**, `contract-s19b-hook.mjs:160` (padNow) reads the first order card only, so the second person's spice counts as a decoy; the game's own note says 2 and 3 (the table). (c) the lab #child lesson: `ui.js` blurLesson asked for the next part 450 ms after lighting it, so a tap there was lost (light 25 s, contract-106); its light cut the hidden word's dots (oval, contract-112). Fixed: an early tap counts, the light holds the dots. Plus contract-36 at L4: the second pour's glass light had no call; `chai-tray.js` phase() makes it its own called step. **Page errors:** `js/shared/onboard.js:2138` (`Onboard.refused = []`, SH-257) overwrites CK-113's function at :841. Not my file: patch ready, `ob-refused.patch` in the scratchpad.
- **Mum's words (decision 22), at their sources:** salt *mitho*, black pepper *miryo*, *tameto/tameta*; the pantry headline *Hi muke {dish} lai khani achi de* (with a dish), *Muke de* (without); daar's stir line is the engine's *Trae fare firai* (StirTimes, no "slowly"); the Round 6 spellings confirmed; baking's *pono cup* back at its source (the "re-runnable" test passes again). daar.js:1245 still shows its English until daar's owner calls `Lang.line("daar-stir-ask", …)`.

## Chai since 10 Nov (frozen-diff-chai-tray-202611131437: 395 changes)
1. Mum's 12 Nov clips play: 13 new family sounds on every page (decision 12).
2. New game notes, logging only: band (SH-248), green-window (CHAI-108), idle-bump (CHAI-111), serve-view and serve-trays (the serving kitchen, SH-266).
3. dish-flash on L1 pages (SH-267, decisions 15, 23).
4. order-landed gone: the side-panel reveal lessons retired (SH-213, decision 8).
5. timed-hold gone: the knob's light now comes as the ring enters the green (CHAI-58), so the test child taps before the hold point (SH-158).
6. chai-tray-kind-click state (lab #child L2-L4): the glass takes the pour's tap (CHAI-112, decision 6).
7. sfx/flame-b on #mistake: the flame plays under the voice (CHAI-113, decision 14).
8. help, card-light, chulo/bar clips, sfx/puff on 1-3 pages: timing (the hint came; a boil-over).
9. **Not asked for:** the glass's ring (sfx/glass) dropped by the voice gate when it lands under Nani's line (Mum's longer clips). Fix is CHAI-113's {under: true}; it needs Zafar's yes and `js/cook/core.js:456` to pass options.
10. **Check faults, not the game:** contract-124 (#takeback), contract-37 (two people), contract-119 (it still reads the retired `.wc14-flash`, so it should read `.wc14-pop.wc14-dish`).
11. **Page errors:** OB.refused (the patch above).

## Open
Before re-freeze: the onboard.js patch, contract-119/-124/-37 re-pointed, Zafar on item 9. SH-286 has no probe, so `evidence.mjs --before/--after --brief` refuses (no before folder).

## Proof
- SH-286 pictures (labcheck.mjs, L1, seed 7): `build/screenshots/brief/s20-p2-chai/SH-286/` 1-4.
- After folder: none (no probe). Contract: `CONTRACT FAILED: 4 breaks (contract-119 4)`, all four explained in item 10.
- checks.mjs: 14 steps ok. `node --test build/lang/`: 61 pass. words, leak, recordings: ok.
- Tier 2: see below.
