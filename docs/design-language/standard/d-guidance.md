# D · Guidance

**The question:** how does the child know what to do?

Format: `build/reports/s17-standard-format.md`. New player and Words known are `labs.html` switches.

## D1 The first time

#### STD-D1-01 · An action is lit only the first time it comes up for this player, never again for another pan, pot, level or round
- **Why:** "Onboarding should only be actions that occur for the first time." (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P2 / the light
- **Checked by:** probe:SH-181 + contract-78 + check:unit
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, New player (1280x665)
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Impact:** feels bad · **Source rows:** SH-146, SH-181, SH-196, CHAI-68, CHAI-60, onb:control, onb:ctl-knob, onb:ctl-pour, onb:ctl-slow, onb:ctl-water, onb:ctl-tea, onb:ctl-cups

#### STD-D1-02 · The light is one look everywhere: all dims but a gold-edged box round the glowing thing, a finger only for a drag, hold or swipe
- **Why:** "no ripples ... Yes hand for drag is fine." (Zafar, 30 Oct)
- **Scope:** House
- **Pattern / part:** - / the light
- **Checked by:** contract-44 (one finger, the kit's) + contract-84 + gap: contract-44's no-finger clause retuned to SH-141 (fix-list row SH-233)
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, New player (1280x665)
- **Status:** agreed 30 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Value:** dim (values.md D1) · **Impact:** stuck · **Source rows:** SH-141, CHAI-25, DAAR-36, onb:light

#### STD-D1-03 · The dim never shows without its lit thing, one light at a time, gone once its thing is done or its step ends
- **Why:** "a black tint ... that never goes away" (Zafar, 30 Oct)
- **Scope:** House
- **Pattern / part:** P4 / the light
- **Checked by:** contract-53 + contract-87 + tool:teachgate + probe:CHAI-50
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, New player (1280x665)
- **Status:** agreed 30 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Impact:** stuck · **Source rows:** CHAI-36, CHAI-50, SH-197, led:1.6-18, led:1.11-6

#### STD-D1-04 · The lit box hugs one whole thing (picture, pill, face) with a margin, never crossing a face, its corner at most a quarter of its height
- **Why:** "a general rule ... that leaves some padding" (Zafar, 6 Nov night)
- **Scope:** House
- **Pattern / part:** - / the light
- **Checked by:** contract-53 + contract-92 + contract-82 + probe:CHAI-33
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, New player (740x320)
- **Status:** retired 7 Nov: doubles STD-E2-08 (its Why and rows moved there; was: agreed 6 Nov)
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Impact:** cosmetic

#### STD-D1-05 · A light on a small part of a thing lights the whole thing first, then shrinks onto the part
- **Why:** "make it a generalizable principle/rule" (Zafar, 5 Nov)
- **Scope:** House
- **Pattern / part:** P3 / the zoom-in
- **Checked by:** judge: the shrink, chai L2, 1280x665 + gap: the zoom-in contract
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, New player (1280x665)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Value:** zoom-in (values.md D1) · **Impact:** stuck · **Source rows:** SH-213, SH-196

#### STD-D1-06 · A first-time light comes a breath after the last move ends, its step's call with it, and gives up if the child moves on
- **Why:** "start it's timer after the last animation action" (Zafar, 29 Oct)
- **Scope:** House
- **Pattern / part:** P8 / the light
- **Checked by:** contract-79 + contract-78 + probe:CHAI-52
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, New player (1280x665)
- **Status:** agreed 3 Nov: Zafar's rule is the call a beat after its light (CHAI-40, his 1 Nov rule kept 3 Nov); the code calls with the light (0 ms, `data/rules.json` showing.callAfterLightMs) until his video shows the moment (29 Oct)
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Value:** card light after the last move, breath before a light, call after its light (values.md D1) · **Impact:** stuck · **Source rows:** CHAI-42, CHAI-52, CHAI-77, CHAI-40, CHAI-60

#### STD-D1-07 · After the first items, the light moves briefly to the next item's card on the order card, whole in view
- **Why:** "so the eye is directed to where to look next" (Zafar, 27 Oct)
- **Scope:** House
- **Pattern / part:** P2 / the light, order card
- **Checked by:** contract-90 + contract-79 + probe:SH-178
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, New player (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Value:** light time (values.md D1) · **Impact:** stuck · **Source rows:** CHAI-37, SH-178, CHAI-77, onb:card, led:1.11-1

#### STD-D1-08 · The reveal is taught when it first happens (the dotted word, then the blurred picture) by showing its tap on a card in view, never as help
- **Why:** "teach the blur of the word, and then the image" (Zafar, 2 Nov)
- **Scope:** House
- **Pattern / part:** P2 / the light, item card
- **Checked by:** probe:SH-196 + probe:CHAI-102 + gap: the lesson-survives-a-tap contract
- **See it:** lab.html?mode=cook&game=chai-tray&level=3, New player and Words known (1280x665)
- **Status:** agreed 7 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Value:** reveal English shown (values.md A2) · **Impact:** stuck · **Source rows:** SH-196, CHAI-102, onb:reveal-word, onb:reveal-pic

#### STD-D1-09 · The first time a child meets a timed control, its timer holds in the green while it is lit, until the child taps it
- **Why:** "pause the timer in the green section and then show them the action" (Zafar, 29 Oct)
- **Scope:** House
- **Pattern / part:** P2 / the light
- **Checked by:** contract-77 + probe:SH-158
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, New player (1280x665)
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` · **Impact:** feels bad · **Source rows:** onb:boil-hold

#### STD-D1-10 · The first time a next vessel is needed, a light circles its rim once the first is served, never while another still cooks
- **Why:** "we need an onboarding for selecting the new pan" (Zafar, 2 Nov)
- **Scope:** Family
- **Pattern / part:** P2 / the light, pan
- **Checked by:** probe:CHAI-68 + probe:CHAI-99
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, New player (1280x665)
- **Status:** agreed 6 Nov night (was: 0.3 s, 3 Nov)
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Value:** next-pan light (values.md D1) · **Impact:** stuck · **Source rows:** CHAI-68, CHAI-75, CHAI-83, CHAI-99, onb:next-pan

#### STD-D1-11 · A light or a line never holds the child: a tap during either lands at once
- **Why:** non-negotiable 7
- **Scope:** House
- **Pattern / part:** - / the light
- **Checked by:** contract-21 + contract-74
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, New player (1280x665)
- **Status:** retired 7 Nov: doubles STD-B2-07 (its rows moved there; was: agreed 3 Nov)
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Impact:** feels bad

## D2 When stuck

#### STD-D2-01 · After the first time a step gets its call alone, and help only after the level's wait
- **Why:** "If you're not a new player, Nani should just give you the instruction" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P2 / the stuck hint
- **Checked by:** contract-24 + contract-91 + probe:CHAI-56 + check:static/hintwait
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** agreed 1 Nov (bulbs retired 6 Nov)
- **Layer:** shared kit · **Lives in:** `js/shared/guide.js` · **Value:** hint wait (values.md D2) · **Impact:** stuck · **Source rows:** CHAI-56, CHAI-32, KEEP-21

#### STD-D2-02 · The stuck hint names the first undone item in the order card's order; any order still lands
- **Why:** "just the next item on the menu card" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** - / the stuck hint
- **Checked by:** probe:SH-182
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Impact:** wrong · **Source rows:** SH-182

#### STD-D2-03 · Every right move, on any thing, restarts every hint clock
- **Why:** "correct actions ... should reset the timer ... for all hints." (Zafar, 4 Nov)
- **Scope:** House
- **Pattern / part:** P12 / the stuck hint
- **Checked by:** contract-24 + probe:SH-184 + check:unit
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (1280x665)
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/guide.js` · **Impact:** feels bad · **Source rows:** SH-184, SH-205

#### STD-D2-04 · Every step has a stuck hint, picking the next vessel included, and a wrong move brings it at once
- **Why:** "which again should have triggered the stuck mechanism" (Zafar, 3 Nov)
- **Scope:** House
- **Pattern / part:** - / the stuck hint
- **Checked by:** contract-91 + probe:CHAI-75 + gap: a wrong-tap-rushes-the-hint contract
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Impact:** stuck · **Source rows:** CHAI-75, CHAI-55

#### STD-D2-05 · Once a word is past support, no hint says it
- **Why:** the leak test (non-negotiable 4)
- **Scope:** House
- **Pattern / part:** - / the stuck hint
- **Checked by:** tool:leak + judge: Nani's stuck line, chai L3
- **See it:** lab.html?mode=cook&game=chai-tray&level=3, Words known (1280x665)
- **Status:** waiting on Zafar (keep or change), 3 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Impact:** wrong · **Source rows:** CHAI-76

#### STD-D2-06 · A timed control is called the moment its window opens, never later as a stuck hint
- **Why:** "exactly as the progress bar just enters the green" (Zafar, 22 Oct)
- **Scope:** Family
- **Pattern / part:** - / knob
- **Checked by:** contract-70 + probe:CHAI-24
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** agreed 22 Oct
- **Layer:** kitchen kit, stove part · **Lives in:** `js/cook/stations/chai-tray.js` · **Impact:** wrong · **Source rows:** CHAI-24

## D3 Nani's box and the helper card

#### STD-D3-01 · Nani's box, final from the first frame, shows the step now as it opens, never the whole card
- **Why:** guide-and-card R2 (Zafar, 6 Oct: "yes to all"; 21 Oct)
- **Scope:** House
- **Pattern / part:** - / Nani's box
- **Checked by:** contract-36 + probe:SH-174 + check:unit
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (930x430)
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/guide.js` · **Impact:** stuck · **Source rows:** SH-174

#### STD-D3-02 · An item's stuck hint opens the helper card in Nani's box with its word card as the item glows: no lit arrow, no dim, nothing over the order
- **Why:** "the card should look like it's coming from Nani" (Zafar, 22 Oct)
- **Scope:** House
- **Pattern / part:** - / helper card
- **Checked by:** probe:SH-162 + probe:SH-149 + probe:CHAI-35 + probe:CHAI-32
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (740x320)
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Impact:** stuck · **Source rows:** SH-162, SH-149, CHAI-35, CHAI-32, DAAR-36, onb:arrow

#### STD-D3-03 · Nani says an item's name only as her helper card opens to show it
- **Why:** "that's when she should call out the item ... a rule for all the games always" (Zafar, 30 Oct)
- **Scope:** House
- **Pattern / part:** P8 / helper card
- **Checked by:** contract-89 + probe:SH-172
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (930x430)
- **Status:** agreed 30 Oct
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Impact:** stuck · **Source rows:** CHAI-40

#### STD-D3-04 · The child may open the helper card by its arrow at any time, and it never counts as a hint
- **Why:** only the guide's own hint counts towards the level (Zafar, 29 Oct)
- **Scope:** House
- **Pattern / part:** - / helper card
- **Checked by:** check:unit + gap: an arrow-is-free contract
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (930x430)
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` · **Impact:** feels bad · **Source rows:** -

#### STD-D3-05 · Nani's box keeps one height whatever it holds and folds open and shut, so help never jumps the order card
- **Why:** "That arrow shouldn't change the size of the box." (Zafar, 4 Nov)
- **Scope:** House
- **Pattern / part:** P4 / Nani's box
- **Checked by:** tool:panelcheck + probe:SH-189 + gap: a still-order-list film check
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (740x320)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Value:** Nani's line room, Nani's box fold (values.md D3) · **Impact:** cosmetic · **Source rows:** SH-189, SH-179, SH-209, SH-210, SH-215

## D4 Feedback in play

#### STD-D4-01 · A row ticks the moment its count or amount is reached, in any order, at every level
- **Why:** "just to make it consistent ... it just ticks it there and then" (Zafar, 1 Nov); a tap past the count is STD-B3-02
- **Scope:** House
- **Pattern / part:** P7 / item card
- **Checked by:** contract-18 + probe:SH-38 + probe:CHAI-54 + gap: a count row ticks within 1 s of its count
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, a two-sugar cup (1280x665)
- **Status:** agreed 1 Nov (was: a stillness close, 1 Nov morning; at the step's close, 26 Sept)
- **Layer:** shared kit · **Lives in:** `js/shared/order-card.js`, `js/cook/ui.js` · **Impact:** wrong · **Source rows:** SH-38, CHAI-54, CHAI-16, SH-182

#### STD-D4-02 · A finished order keeps its ticks in view until served, then folds smoothly as the next opens
- **Why:** "smoothly minimize, another one should maximize, rather than ... snapping" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P4 / order card
- **Checked by:** contract-72 + probe:SH-180 + probe:SH-148
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (930x430)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/order-card.js` · **Impact:** unfinished · **Source rows:** SH-206, SH-180, SH-148

#### STD-D4-03 · A mistake shows in the thing itself (it shakes, or fails and starts again with its row), and no end shows a verdict
- **Why:** "It just shakes and says no" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P9 / end screen
- **Checked by:** contract-16 + contract-5 + probe:CHAI-57 + probe:CHAI-62
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (1280x665)
- **Status:** retired 7 Nov: doubles STD-B2-04 (the shake, the boil-over) and STD-B4-05 (no verdict), its checks and rows moved there and its value to STD-B2-05 (was: agreed 7 Nov)
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Impact:** feels bad

## D5 The grown-up's door

#### STD-D5-01 · Written English for grown-ups is only behind the "?" pop-up and in the end-of-round review
- **Why:** non-negotiable 3
- **Scope:** House
- **Pattern / part:** P14 / "?" pop-up
- **Checked by:** contract-16 + check:words + doc:CLAUDE.md
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** agreed (CLAUDE.md)
- **Layer:** shared kit · **Lives in:** `js/shared/` · **Impact:** wrong · **Source rows:** -

#### STD-D5-02 · Every game has one cog, top right, its menu ("?", home, the book) set in one file and live under every light
- **Why:** "what opens when you press cog ... from a central file" (Zafar, 29 Oct)
- **Scope:** House
- **Pattern / part:** P14 / the corner buttons
- **Checked by:** tool:kitsheet + gap: a one-live-cog contract
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, New player (930x430)
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` · **Impact:** unfinished · **Source rows:** CK-53

#### STD-D5-03 · New player brings every first-time showing back from the first frame, Words known the lessons past support; nothing else does
- **Why:** "as soon as I load into the game, it should do the walkthrough" (Zafar, 22 Oct)
- **Scope:** House
- **Pattern / part:** P2 / the light
- **Checked by:** probe:SH-120 + check:unit + gap: a Words-known labs check
- **See it:** lab.html?mode=cook&game=chai-tray&level=3, New player and Words known (1280x665)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Impact:** stuck · **Source rows:** CHAI-56, SH-196, SH-216

#### STD-D5-04 · The end screen has two pages, the badges then the word review, with room for right and wrong words
- **Why:** "maybe we don't need this third screen" (Zafar, 22 Oct)
- **Scope:** House
- **Pattern / part:** - / end screen
- **Checked by:** contract-38 + contract-32
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** agreed 22 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/` · **Impact:** unfinished · **Source rows:** -
