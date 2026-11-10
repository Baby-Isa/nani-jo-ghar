# E. Presentation

**What does it look, move and sound like?**

## E1 The frame

#### STD-E1-01 · The frame's measures follow the window's height, never its width
- **Why:** "layouts by height" (Zafar, 27 Oct); the four sizes themselves are STD-02-04
- **Scope:** House
- **Pattern / part:** P11 / the frame
- **Checked by:** tool:panelcheck + doc:CLAUDE.md
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 7 Nov, Fable's rewording (was: laid out by height and works at all four sizes, 3 Nov)
- **Layer:** shared kit · **Lives in:** `js/shared/frame.js` · **Value:** panel scale (values.md E1) · **Impact:** wrong

#### STD-E1-02 · The side panel's size follows only the window, scaling as one to a 2.5-card floor, never changing as a card opens
- **Why:** "is there no scaling ... on the left bar?" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P11 / the side panel
- **Checked by:** tool:panelcheck + gap: a contract on panel sizes while a card opens
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (740x320)
- **Status:** agreed 2 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Value:** panel scale, card floor (values.md E1) · **Impact:** wrong · **Source rows:** SH-185, SH-210

#### STD-E1-03 · A list that scrolls by design is declared in its markup, with no scroll bar and no snapping
- **Why:** "jerkily scrolls back and forth" (Zafar, 5 Nov)
- **Scope:** House
- **Pattern / part:** P6 / the item row
- **Checked by:** contract-72 + check:layout/scroll-container
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (930x430)
- **Status:** retired 7 Nov: doubles STD-F3-04 (its Why, check and rows moved there; was: agreed 5 Nov)
- **Layer:** shared kit · **Lives in:** `js/shared/order-card.js` · **Impact:** feels bad

#### STD-E1-04 · Whatever the child needs next is always whole in view, the panel or the row gliding to show it
- **Why:** "it needs to automatically scroll up" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P6 / the order card
- **Checked by:** tool:panelcheck + probe:SH-169 + probe:SH-191 + probe:SH-199
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Value:** card fit time (values.md E1) · **Impact:** stuck · **Source rows:** SH-169, SH-191, SH-194, SH-199, SH-206, CHAI-62, SH-204

#### STD-E1-05 · Nothing on screen overlaps a thing it is not meant to touch
- **Why:** "aren't in line with the tea tray and the tea hobs" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P1 / the shelf
- **Checked by:** tool:pillcheck + tool:shelfshot + contract-54 + probe:CHAI-19
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/stations/chai-tray.js` · **Value:** shelf line, gap floor (values.md E1) · **Impact:** wrong · **Source rows:** CHAI-66, SH-208, CHAI-02, CHAI-19, CHT-17, CK-53, SH-187

## E2 Components

#### STD-E2-01 · Every word is shown on the one word card, the same in the pop-out, the order row and the helper
- **Why:** "your default is to listen" (Zafar, 27 Oct)
- **Scope:** House
- **Pattern / part:** - / the word card
- **Checked by:** contract-40 + tool:kitsheet + probe:SH-147
- **See it:** lab/word-card.html (1280x665)
- **Status:** agreed 27 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/word-card.js` · **Impact:** wrong · **Source rows:** SH-147, SH-149

#### STD-E2-02 · No word leaves its card, is cut or ellipsised, or covers its speaker: it shrinks, then wraps
- **Why:** non-negotiable 6; SH-142 (27 Oct)
- **Scope:** House
- **Pattern / part:** P11 / the word card
- **Checked by:** contract-51 + contract-15 + check:layout/text-clipped + probe:SH-142
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 27 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/fit.js` · **Impact:** wrong · **Source rows:** SH-142, CHAI-69

#### STD-E2-03 · Every card and box in the side panel is even: equal padding and gaps, words level, one height in every state
- **Why:** "That arrow shouldn't change the size of the box." (Zafar, 4 Nov)
- **Scope:** House
- **Pattern / part:** P11 / Nani's box
- **Checked by:** tool:panelcheck + tool:spkgap + probe:SH-189 + probe:SH-192
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (740x320)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `css/shared/order-card.css` · **Value:** item padding floor (values.md E2), Nani's line room (values.md D3) · **Impact:** cosmetic · **Source rows:** SH-190, SH-193, SH-165, SH-143, SH-189, SH-209, SH-179, SH-192, SH-176, CLN-218

#### STD-E2-04 · An item card shows the thing exactly as the play area does, every state's filter stacking on the others
- **Why:** "the bottle of ginger on the item card is different from the bottle of ginger on the shelf ... the one on the shelf is the correct one" (Zafar, 3 Nov, SH-200); "the item cards for full and half cup need to be the side on views" (3 Nov, CHAI-74); "the order of no sugar doesn't blur the sugar as well as it's meant to" (3 Nov, SH-202)
- **Scope:** House
- **Pattern / part:** P10 / the item card
- **Checked by:** probe:SH-200 + probe:SH-202 + probe:CHAI-74 + gap: a picture check that each order card's picture is its shelf item's own file
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (1280x665), Words known
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/order-card.js`, `js/cook/ui.js` (the row's picture), `css/shared/order-card.css` · **Impact:** wrong · **Source rows:** SH-200, SH-202, CHAI-74, CHAI-84

#### STD-E2-05 · The pop-out keeps L1's shape, scaled evenly to the biggest that fits the free room, never bigger than at L1
- **Why:** "Just keep ... its usual proportions." (Zafar, 2 Nov)
- **Scope:** House
- **Pattern / part:** P1 / the pop-out
- **Checked by:** contract-76 + contract-83 + probe:CHAI-43
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (740x320)
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Impact:** wrong · **Source rows:** CHAI-43, CHAI-59

#### STD-E2-06 · A bubble takes the first free place in one order, never over a face, the panel, a corner button or a reply, and holds only what the child can use
- **Why:** "we have rules around this" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P1 / the bubble
- **Checked by:** contract-4 + contract-52 + contract-86 + probe:SH-145 + probe:SH-153 + gap: a contract on bubble word size and tail
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (930x430)
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/conversations.js` · **Impact:** wrong · **Source rows:** SH-177, SH-145, SH-187, CK-18, SH-153, SH-186, SH-188

#### STD-E2-07 · Every face circle is the kit's, one of three sizes, beside what it owns and on top of all but a pouring thing
- **Why:** "it should go on top of the face icons" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P11 / the face circle
- **Checked by:** contract-42 + contract-82 + probe:SH-139 + probe:CHAI-47
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (740x320), the pour
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Lives in:** `css/shared/face.css` · **Value:** face sizes (values.md E2) · **Impact:** feels bad · **Source rows:** SH-139, SH-140, SH-183, CHAI-47, CHAI-65, CHAI-18

#### STD-E2-08 · A lit box hugs its one whole target (picture, pill, face) by one margin all round, its corners at most a quarter of its height, and never crosses a face
- **Why:** "a general rule ... that leaves some padding" (Zafar, 6 Nov night); "it can't have such rounded corners" (Zafar, 3 Nov)
- **Scope:** House
- **Pattern / part:** - / the light
- **Checked by:** contract-53 + contract-92 + contract-82 + contract-84 + probe:CHAI-33
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (740x320), New player
- **Status:** agreed 6 Nov (the corners 3 Nov)
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` · **Value:** light pad, light corner (values.md D1) · **Impact:** wrong · **Source rows:** CHAI-33, SH-196, led:1.6-11, CHAI-25, CHAI-47, SEK-22, DAAR-39

#### STD-E2-08a · Chop's light takes in the knife's whole path across the item, one rounded rectangle
- **Why:** "The wide highlight box for chop is correct and the onboarding shows the knife move across from right to left to chop an item so the whole horizontal path needs lighting ... Only should be like that for chop though" (Zafar, 10 Nov)
- **Scope:** chop's game wherever it runs, alone or in a recipe; one chop (Zafar, 10 Nov), never over the side panel; no other game without his OK
- **Pattern / part:** - / the light
- **Checked by:** the light-picture check (SH-249)
- **See it:** lab.html?mode=cook&game=chop&level=1 (740x320), New player
- **Status:** agreed 10 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/onboard.js` (as a named variant; today chop sets it from its own code) · **Impact:** wrong · **Source rows:** CK-78, SH-249

## E3 Art and materials

#### STD-E3-01 · Every item is drawn in its scene's one camera, at one height, and scaled by its size class, never true size
- **Why:** "no true sizes" (Zafar, 6 Nov); art bible §3
- **Scope:** House
- **Pattern / part:** P10 / the shelf
- **Checked by:** check:art + tool:shelfshot + judge: pans top-down, chai L1, 1280x665
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 6 Nov
- **Layer:** shared kit · **Lives in:** `build/tools/art/data/look-rules.json` · **Value:** size classes, item floor (values.md E3) · **Impact:** wrong · **Source rows:** CHAI-02, CHAI-08, CHAI-34

#### STD-E3-02 · Everything shown is a real, steady picture: code draws only a liquid or tint inside a picture's outline, or a thin frame
- **Why:** "I think that's a code drawn animation" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P10 / -
- **Checked by:** check:art + probe:CK-06 + probe:CHAI-73 + gap: an audit list of code-drawn effects
- **See it:** lab/word-moment.html (740x320)
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/juice.js` · **Impact:** wrong · **Source rows:** CK-06, ART-31, CHAI-64, CHAI-13, CHAI-31, CHAI-79, CHAI-73, ART-39, CHAI-72, CHAI-82, CHAI-80

#### STD-E3-03 · The kitchen family's worktop is the white marble, its side panel and shelf band the stone
- **Why:** "the new background marble for the stove top down games" (Zafar, 5 Nov)
- **Scope:** Family
- **Pattern / part:** - / the frame
- **Checked by:** check:static/tokens + judge: chai L1 at the four sizes
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (1280x665)
- **Status:** agreed 5 Nov; whether the marble and the stone fit the house strip waits on Zafar (ART-55, 6 Nov)
- **Layer:** kitchen kit · **Lives in:** `css/cook-side-v2.css` · **Value:** stone (values.md E6) · **Impact:** cosmetic · **Source rows:** ART-40, ART-41, ART-55

#### STD-E3-04 · The hob always shows each pan's own picture for its state, centred on its burner, the heat ring over its handle
- **Why:** "the burner still showing" (Zafar, 6 Nov)
- **Scope:** Family
- **Pattern / part:** P10 / the hob
- **Checked by:** contract-81 + judge: the hob, chai L4, 740x320
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 6 Nov
- **Layer:** kitchen kit, stove part · **Lives in:** `js/cook/kitchen-kit.js` · **Impact:** wrong · **Source rows:** CHAI-91, CHAI-08, CHAI-34

#### STD-E3-05 · Everyone at a counter is drawn in a behind-the-counter pose
- **Why:** "old models that haven't been re-drawn" (Zafar, 1 Nov)
- **Scope:** Family
- **Pattern / part:** P10 / the closing scene
- **Checked by:** judge: the counter, chai L3 + gap: an art check for counter poses
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (1280x665)
- **Status:** waiting on art
- **Layer:** kitchen kit · **Lives in:** `data/cook.json` · **Impact:** cosmetic · **Source rows:** ART-33

## E4 Motion

#### STD-E4-01 · Every moving thing eases from where it is to where it goes, and nothing jumps, snaps or is redrawn mid-motion
- **Why:** "rather than it kind of like just snapping" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P4 / the order card
- **Checked by:** contract-72 + contract-80 + probe:SH-180 + gap: a frame-by-frame jump check
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (930x430)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/order-card.js` · **Value:** card fold (values.md E4), Nani's box fold (values.md D3) · **Impact:** feels bad · **Source rows:** SH-180, SH-215, SH-211, CK-57, SH-174

#### STD-E4-02 · The pop-out flies the least bowed path clear of faces and lands exactly on its row card
- **Why:** "take the straightest path" (Zafar, 3 Nov)
- **Scope:** House
- **Pattern / part:** P4 / the pop-out
- **Checked by:** contract-83 + probe:SH-203 + probe:SH-163
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (740x320)
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Value:** landing error (values.md E4) · **Impact:** feels bad · **Source rows:** SH-203, SH-163, SH-144

#### STD-E4-03 · A thing that changes with time shows it in its own picture, at every level
- **Why:** "I didn't see that on the other modes" (Zafar, 1 Nov)
- **Scope:** Family
- **Pattern / part:** P10 / the hob
- **Checked by:** judge: the boil, chai L1 and L4 + gap: a contract that the boil shows before the green
- **See it:** lab.html?mode=cook&game=chai-tray&level=1 (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** kitchen kit, stove part · **Lives in:** `js/cook/kitchen-kit.js` · **Value:** boil lead (values.md B2) · **Impact:** unfinished · **Source rows:** CHAI-63, CHAI-38

#### STD-E4-04 · A motion the child watches to learn from runs slow enough to follow and holds each result before the next
- **Why:** "it needs to slow down" (Zafar, 3 Nov)
- **Scope:** House
- **Pattern / part:** P8 / the word moment
- **Checked by:** probe:CHAI-70 + gap: a contract timing the word moment's holds
- **See it:** lab/word-moment.html (1280x665)
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/word-moment.js` · **Value:** word moment pace (values.md E4) · **Impact:** wrong · **Source rows:** CHAI-70, CHAI-81

## E5 Sound and voice

#### STD-E5-01 · One voice speaks at a time, each line once and whole
- **Why:** "It's really hard to follow everything" (Zafar, 17 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** contract-7 + contract-22
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (1280x665)
- **Status:** agreed 17 Oct
- **Layer:** shared kit · **Lives in:** `js/core/voice.js` · **Impact:** wrong · **Source rows:** PAN-04

#### STD-E5-02 · The child never waits for speech: any tap during a line lands at once, a tap on the kitchen the whole order
- **Why:** non-negotiable 7; "skip the slow ordering" (Zafar, 28 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** contract-21 + contract-74 + contract-75
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** retired 7 Nov: doubles STD-B2-07 (a tap lands during a line) and STD-B1-05 (the skip), its rows moved there (was: agreed 28 Oct)
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` · **Impact:** feels bad

#### STD-E5-03 · Every action has its own clearly heard sound, and no effect sounds over a family line
- **Why:** "audibly, yes, we should have juiciness" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:voicegate + check:static/voice + gap: a loudness check on each effect
- **See it:** lab/juice.html (1280x665)
- **Status:** agreed 6 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/sfx.js` · **Impact:** unfinished · **Source rows:** CHAI-92, CHAI-87, ART-31, SH-196, CHAI-72

#### STD-E5-04 · No line is read aloud while the child is mid-action
- **Why:** "when the tea is pouring it says 'milk and one sugar' which it shouldn't" (Zafar, 30 Oct, CHAI-51); the click and the boil's rise are STD-B4-02 and STD-B4-03
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** probe:CHAI-51 + tool:voicegate
- **See it:** lab.html?mode=cook&game=chai-tray&level=2, a pour (1280x665)
- **Status:** agreed 7 Nov, Fable's cut (was: sound follows the child, three rules in one, 6 Nov)
- **Layer:** shared kit · **Lives in:** `js/core/voice.js`, `js/cook/ui.js` · **Impact:** feels bad · **Source rows:** CHAI-51

#### STD-E5-05 · Every line sounds the first time: a fresh page waits on one play button, and lines load as the order starts
- **Why:** "the first item in their order didn't have a sound" (Zafar, 3 Nov)
- **Scope:** House
- **Pattern / part:** P13 / the play button
- **Checked by:** tool:tapgate + tool:loadtime + probe:SH-198 + probe:SH-201
- **See it:** lab.html?mode=cook&game=chai-tray&level=3 (740x320), reloaded
- **Status:** retired 7 Nov: doubles STD-F4-02 (the play button) and STD-F4-03 (files at once), its rows moved there (was: agreed 3 Nov)
- **Layer:** shared kit · **Lives in:** `js/shared/buttons.js` · **Impact:** stuck

## E6 Tokens

#### STD-E6-01 · Every colour, shadow, font and kit motion comes from the shared tokens, with one highlight colour for whatever is lit
- **Why:** one kit (Zafar, 26 Oct, decisions 2 and 8); "keep the fonts in the repo" (Zafar, 6 Nov); decision 95
- **Scope:** House
- **Pattern / part:** - / the glow
- **Checked by:** check:static/tokens + check:static/jscolour + check:static/fonts + check:static/motion + contract-14 + contract-87
- **See it:** lab/kit.html (1280x665)
- **Status:** agreed 6 Nov
- **Layer:** shared kit · **Lives in:** `css/shared/tokens.css`, `js/shared/tokens.js` · **Value:** focus colour, stone (values.md E6) · **Impact:** cosmetic · **Source rows:** ART-41

#### STD-E6-02 · Every size comes from the one scale, with text never under 14 px, a tap area never under 48 px and spacing on the grid
- **Why:** the frame's floors; SH-185 (2 Nov); "The speaker button for the water is massive" (Zafar, 1 Nov: the tap stays 48 px however small its picture)
- **Scope:** House
- **Pattern / part:** P11 / the frame
- **Checked by:** check:layout/text-small + check:layout/tap-small + check:unit
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (740x320)
- **Status:** agreed 2 Nov
- **Layer:** shared kit · **Lives in:** `data/layout.json` · **Value:** text floor, tap floor, spacing grid (values.md E6) · **Impact:** stuck · **Source rows:** SH-185, CHAI-43
