# B · Play

**The one question:** what does the child do? Chai (`js/cook/stations/chai-tray.js`) is the reference. "The window" is the
heat ring's green; "a dish" is one person's pan, glass or plate. New player is the switch on labs.html.

## B1 The round's steps

#### STD-B1-01 · A round runs in one order: the word moment if due, the people, the order, the work, serving, the thank-you, the end screen
- **Why:** "It loads the 3 people ordering before it shows the T word focus" (Zafar, 4 Nov)
- **Scope:** House
- **Pattern / part:** P8 / the word moment, the end screen
- **Checked by:** contract-1 + contract-38 + gap: a round-order check on the lifecycle's stage log
- **See it:** lab.html?mode=cook&game=chai-tray&level=4, New player, 1280x665
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/flow.js` · **Impact:** wrong · **Source rows:** CHAI-78, CHAI-85

#### STD-B1-02 · Each dish goes to its asker; then everyone who ordered is back, Nani calls back what was made with one well done, and each guest says thank you
- **Why:** "only one of those people was present at the end to say thank you" (Zafar, 5 Nov); decision 54 (6 Oct)
- **Scope:** House
- **Pattern / part:** - / the closing scene
- **Checked by:** probe:CK-47 + contract-22 + gap: every asker says thank you
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (1280x665)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/flow.js` · **Impact:** unfinished · **Source rows:** SH-214

#### STD-B1-03 · Nothing of an order shows before it is said
- **Why:** "it's not given away early" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P8 / the order card, the pop-out
- **Checked by:** contract-88 + contract-93
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (930x430)
- **Status:** agreed 1 Nov (was: items hidden, 30 Oct)
- **Layer:** shared kit · **Lives in:** `js/shared/order-card.js`, `js/cook/ui.js` · **Impact:** wrong · **Source rows:** SH-171, SH-150, MAA-19

#### STD-B1-04 · "No" items are said last, so the order row only moves forward while the order is given
- **Why:** "'no' items said last for now" (Zafar, 29 Oct)
- **Scope:** House
- **Pattern / part:** P8 / the item row
- **Checked by:** contract-72 + probe:CHAI-39
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (740x320)
- **Status:** agreed 29 Oct; Mum to confirm the word order (R6-141)
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Impact:** feels bad · **Source rows:** CHAI-39, R6-141

#### STD-B1-05 · A tap on the play area during the order lands it all and starts the work; a tap on a bubble, the panel or the cog never does
- **Why:** "skip the slow ordering into playing the game" (Zafar, 28 Oct)
- **Scope:** House
- **Pattern / part:** - / the order card
- **Checked by:** contract-74 + contract-75 + contract-95 + probe:CK-54
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, a tap 1 s in (930x430)
- **Status:** agreed 28 Oct
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Impact:** feels bad · **Source rows:** CK-54

#### STD-B1-06 · The work ends by itself once the last thing asked is done
- **Why:** "The current chop game doesn't end after the last chop is done" (Zafar, 30 Oct)
- **Scope:** House
- **Pattern / part:** P7 / the buttons
- **Checked by:** contract-2 + contract-12
- **See it:** lab.html?mode=cook&game=daar&level=2 (1280x665)
- **Status:** agreed 30 Oct
- **Layer:** shared kit · **Lives in:** each game's mechanic · **Impact:** stuck · **Source rows:** DAAR-38

#### STD-B1-07 · Nani's "pass me" never comes in a dish's first two plays, and after that only sometimes
- **Why:** row MAA-14 (6 Oct): "never in a mode's first plays"; the code waits two plays of the dish, then asks by chance each order (`js/cook/flow.js:177-189`)
- **Scope:** House
- **Pattern / part:** - / the pass-me pop-up
- **Checked by:** probe:MAA-14 + gap: pass-me pop-ups counted per order
- **See it:** lab.html?mode=cook&play=story, day 2 (1280x665)
- **Status:** agreed 6 Oct, worded to the code 7 Nov (was: never in a session's first order, at most once a round outside the busy mode); to check
- **Layer:** shared kit · **Lives in:** `js/cook/flow.js`, `data/cook.json` (calm) · **Value:** passMeAfterPlays, passMeChance (values.md B1) · **Impact:** feels bad · **Source rows:** MAA-14

## B2 The mechanic

#### STD-B2-01 · A dish is made whole in the vessel it cooks in, never in the glass or plate
- **Why:** row CHAI-04; cook.md H11
- **Scope:** Family
- **Pattern / part:** - / pan, glass
- **Checked by:** probe:CHAI-04
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** agreed 29 Sept
- **Layer:** kitchen kit · **Lives in:** `js/cook/kitchen-kit.js` · **Impact:** wrong · **Source rows:** CHAI-04

#### STD-B2-02 · One kind of action keeps one gesture in a game at every level
- **Why:** "A mini-game's controls never change between its levels" (Zafar, 26 Sept)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** gap: an act-log check of gestures per step kind, L1-L4
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, then level=4 (1280x665)
- **Status:** agreed 26 Sept
- **Layer:** game · **Lives in:** each game's mechanic · **Impact:** stuck · **Source rows:** -

#### STD-B2-03 · A timed action shows its window on the thing
- **Why:** "use the other elements of the chai game like the actual heating animation and ring" (Zafar, CHAI-38, kept in the 29 Oct roll-out); the call as the window opens is STD-D2-06
- **Scope:** Family
- **Pattern / part:** - / the heat ring
- **Checked by:** judge: the heat ring's green on the hob, chai L1, 1280x665 + gap: a contract that a timed control shows its window
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (1280x665)
- **Status:** agreed 7 Nov, Fable's cut (was: and the call to act comes as the window opens, 22 Oct)
- **Layer:** kitchen kit, stove part · **Lives in:** `js/cook/kitchen-kit.js` · **Impact:** wrong · **Source rows:** CHAI-38

#### STD-B2-04 · Before the window the thing refuses and its clock runs on; after it the dish fails and only that dish starts again
- **Why:** "It just shakes and says no ... if you click it in the red after the green, then it overboils and you have to start again" (Zafar, 1 Nov); the mistake shows in the thing itself (STD-D4-03, retired into this rule and STD-B4-05)
- **Scope:** Family
- **Pattern / part:** P9 / the knob, the boil-over
- **Checked by:** probe:CHAI-57 + gap: early tap refused unmarked, late one restarts its dish only
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, tap the knob early (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** kitchen kit, stove part · **Lives in:** `chai-tray.js` · **Impact:** stuck · **Source rows:** CHAI-57

#### STD-B2-05 · The window lasts at least 2 s at the top level
- **Why:** "extend to two seconds" (Zafar, 1 Nov); lesson R1; the 15% a level is STD-C2-06's
- **Scope:** Family
- **Pattern / part:** - / the heat ring
- **Checked by:** gap: the green's length at speed 1
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (1280x665)
- **Status:** agreed 1 Nov (was: 1.7 s); cut to the window 7 Nov (Fable)
- **Layer:** kitchen kit, stove part · **Lives in:** `data/stations/chai-tray.json` · **Value:** green at L4 (values.md B2) · **Impact:** feels bad · **Source rows:** CHAI-58

#### STD-B2-06 · Several dishes can be worked at once, in any order, and nothing done to one pauses or slows another
- **Why:** "the additions to the other pans dont stop or slow the cooking" (Zafar, 1 Nov)
- **Scope:** Family
- **Pattern / part:** P4 / pan, burner
- **Checked by:** probe:CHAI-61 + probe:SH-182
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** kitchen kit · **Lives in:** `chai-tray.js` · **Impact:** wrong · **Source rows:** CHAI-61, SH-182

#### STD-B2-07 · A tap lands the moment it is made, during a line, a light or an animation
- **Why:** "never make them wait for speech" (non-negotiable 7); row CK-45
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** contract-21
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, tap while Nani speaks (1280x665)
- **Status:** agreed by 13 Oct (rulebook E5)
- **Layer:** shared kit · **Lives in:** `js/shared/host.js`, `js/cook/ui.js`, `js/shared/onboard.js` · **Impact:** stuck · **Source rows:** CK-45

#### STD-B2-08 · A wrong dish is redone on the spot, its person saying again only what went wrong, and the third wrong try is shown the right way
- **Why:** decision 51 (Zafar, 6 Oct: "after three wrong tries the game shows the right way. Replaces the whole-game restart"; `docs/archive/decisions/decisions-1-to-99.md`); his words, T8: "if you get it wrong three times ... it should take over and show you the correct way"
- **Scope:** House
- **Pattern / part:** P9 / the order card
- **Checked by:** probe:CK-32 + gap: the third try's showing
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, a wrong cup (1280x665)
- **Status:** agreed 6 Oct
- **Layer:** shared kit · **Lives in:** `chai-tray.js` · **Impact:** stuck · **Source rows:** -

#### STD-B2-09 · A lost dish (boiled over, spilled) reopens its rows and glides its row back to the first item
- **Why:** "the menu card should scroll to the start" (Zafar, 1 Nov)
- **Scope:** Family
- **Pattern / part:** P9 / the item row
- **Checked by:** probe:CHAI-62
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, a boil-over (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Impact:** wrong · **Source rows:** CHAI-62

#### STD-B2-10 · Anything placed can be taken back with a tap until the step moves on, and the first try is the one scored
- **Why:** "they can undo until the step moves on" (Zafar, 22 Oct)
- **Scope:** House
- **Pattern / part:** P9 / -
- **Checked by:** probe:CK-TB-01
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, a spice then the pan (1280x665)
- **Status:** agreed 22 Oct (was: until ✓ Done, 29 Sept)
- **Layer:** kitchen kit · **Lives in:** `chai-tray.js` · **Impact:** feels bad · **Source rows:** -

#### STD-B2-11 · A pour is one tap: the ready dish moves over its glass and empties as the glass fills
- **Why:** "just having the pans move above the glasses and empty and the glasses fill up" (Zafar, 29 Oct)
- **Scope:** Family
- **Pattern / part:** P10 / pan, glass
- **Checked by:** probe:CHAI-26
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (1280x665)
- **Status:** agreed 29 Oct (was: the tipped pan, 23 Oct)
- **Layer:** kitchen kit · **Lives in:** `js/shared/pour.js`, `chai-tray.js` · **Impact:** feels bad · **Source rows:** CHAI-26, CHAI-34

## B3 Counts and amounts

#### STD-B3-01 · A count ticks the moment the right number is reached, at every level, and a tap past it only wiggles
- **Why:** "it just ticks it there and then" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P7 / the count pills, the item row
- **Checked by:** probe:SH-38 + gap: a count row ticks within 1 s of its count
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, a two-sugar cup (1280x665)
- **Status:** retired 7 Nov: doubles STD-D4-01 (its check and rows moved there; the tap past a count to STD-B3-02; was: agreed 1 Nov)
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js`, `chai-tray.js` · **Impact:** wrong

#### STD-B3-02 · A tap past a thing's count adds nothing and only wiggles; a thing not counted goes in once
- **Why:** "Milk ... it's not a countable thing" (Zafar, 17 Oct); a tap past a count only wiggles (Zafar, 1 Nov, SH-38)
- **Scope:** House
- **Pattern / part:** P7 / the shelf, the count pills
- **Checked by:** contract-71 + probe:CHAI-22
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, a two-sugar cup (1280x665)
- **Status:** agreed 7 Nov, Fable's widening (was: a thing not counted goes in once, 22 Oct)
- **Layer:** shared kit · **Lives in:** `chai-tray.js`, `js/cook/ui.js` · **Impact:** wrong · **Source rows:** CHAI-22

#### STD-B3-03 · An amount is reached by repeating one action (half, then full) and ticks the moment it holds what was asked
- **Why:** "if half is achieved, then it should just tick after half" (Zafar, 1 Nov); praise: "It's quite clever" (Zafar, 1 Nov)
- **Scope:** Family
- **Pattern / part:** P7 / glass
- **Checked by:** probe:CHAI-54
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 1 Nov
- **Layer:** kitchen kit · **Lives in:** `chai-tray.js` · **Value:** half, full (values.md B3) · **Impact:** wrong · **Source rows:** CHAI-54, KEEP-21, CHAI-84

#### STD-B3-04 · One thing is asked 1 to 3 times at most, and a round's total grows by level
- **Why:** "2, 4, 6, 8 (min 1 and max 3 chops per single item)" (Zafar, 30 Oct)
- **Scope:** Family
- **Pattern / part:** - / the count pills
- **Checked by:** gap: a seeded-order check of counts by level
- **See it:** lab.html?mode=cook&game=daar&level=4 (1280x665)
- **Status:** daar's; the family's number is Zafar's to confirm (`docs/questions.md`, question 4; was: agreed 30 Oct, daar's kinds at L1-L3 to confirm)
- **Layer:** game · **Lives in:** `data/cook.json` · **Impact:** feels bad · **Source rows:** DAAR-37

## B4 Feel

#### STD-B4-01 · Every action is heard and seen at once: a sound at the tap and a change in the thing itself
- **Why:** "audibly, yes, we should have juiciness" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:voicegate + gap: every logged act gets a sound or effect within 150 ms
- **See it:** lab/juice.html; lab.html?mode=cook&game=chai-tray&level=1 (1280x665)
- **Status:** agreed 6 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/sfx.js`, `js/shared/juice.js` · **Impact:** feels bad · **Source rows:** ART-31, CHAI-92, CHAI-87

#### STD-B4-02 · A control's sound plays only when the child works the control
- **Why:** "It just comes at the wrong time every time" (Zafar, 6 Nov)
- **Scope:** House
- **Pattern / part:** - / the knob
- **Checked by:** probe:CHAI-100
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, after a pour (1280x665)
- **Status:** agreed 6 Nov
- **Layer:** kitchen kit, stove part · **Lives in:** `js/cook/kitchen-kit.js` · **Impact:** feels bad · **Source rows:** CHAI-100

#### STD-B4-03 · A coming moment to act is heard and seen growing: the boil's sound rises to the boiling picture and grows again only past the window
- **Why:** "more noticable as the time to stop the cooker gets close" (Zafar, 6 Nov)
- **Scope:** Family
- **Pattern / part:** - / the heat ring, pan
- **Checked by:** probe:CHAI-95 + gap: the boil picture at L1-L4 (CHAI-63)
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (1280x665)
- **Status:** agreed 6 Nov; CHAI-63 open
- **Layer:** kitchen kit, stove part · **Lives in:** `js/shared/sfx.js` · **Impact:** stuck · **Source rows:** CHAI-95, CHAI-63

#### STD-B4-04 · A finished dish's payoff plays out before anything new asks for the child's eye
- **Why:** "just half a second longer ... to take in the successful tea pouring animation" (Zafar, 6 Nov)
- **Scope:** House
- **Pattern / part:** - / the light
- **Checked by:** probe:CHAI-99
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, New player, 1280x665
- **Status:** agreed 6 Nov (was: 0.3 s, 3 Nov)
- **Layer:** shared kit · **Lives in:** `chai-tray.js` · **Value:** next-pan light (values.md D1) · **Impact:** feels bad · **Source rows:** CHAI-99

#### STD-B4-05 · Play gives no verdict before the serve: a mistake shows only in the thing and at the end review
- **Why:** "Show progress, not verdicts" (Zafar, 25 Sept); no end shows a verdict either (STD-D4-03, retired into this rule and STD-B2-04)
- **Scope:** House
- **Pattern / part:** P9 / the end screen
- **Checked by:** gap: no wrong sound, cross or mark in play
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, salt for sugar (1280x665)
- **Status:** agreed 25 Sept
- **Layer:** shared kit · **Lives in:** `js/shared/results.js` · **Impact:** feels bad · **Source rows:** -

#### STD-B4-06 · A round's rewards are badges, coins and praise, never sweets, lollies or biscuits
- **Why:** "never lollies, biscuits or sweets as rewards" (Zafar, 30 Sept)
- **Scope:** House
- **Pattern / part:** - / the end screen
- **Checked by:** check:static/reward
- **See it:** lab.html?mode=cook&game=chai-tray&level=1, the end screen (1280x665)
- **Status:** agreed 30 Sept
- **Layer:** shared kit · **Lives in:** `js/shared/results.js`, `data/` · **Impact:** wrong · **Source rows:** -
