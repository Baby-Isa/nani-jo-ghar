# The chai standard (Sprint 17; Zafar, 2 Nov)

Chai is the reference game: every rule it earned, so any game can show it meets it (`docs/process/prototype-to-game.md`).

**Status: signed off, final** (Zafar, 7 Nov; live 20261107T120301Z; the 88 px phone glasses and the panel moving unscrolled on
phones, as built). Sections 1-6 are the 3 Nov draft, finished in the standard folder (below). Rows: `docs/process/regressions.md`
and its archive.

**The three layers (Zafar, 7 Nov, decision 13), where a rule lives:** *shared kit* (`js/shared/`, `js/cook/ui.js`: every game,
and what the pantry and the stalls also need: the shelf and its pills, the order's flow and timings, lights and lessons, serving);
*kitchen kit* (`js/cook/kitchen-kit.js`, `js/cook/mechanics/`: every kitchen game; its stove part only for games that cook with
heat); *game* (chai's recipe, `js/cook/stations/chai-tray.js`). A fix goes in the lowest layer that owns it.

## How this page is finished (Sprint 17; Zafar, 5 and 7 Nov)

Not as one page: in the structure he locked on 5 Nov (`build/reports/s17-standards-structure-v2.md`, his §8 answers): nine
domains, the unit a rule, eight fields a row (ID, Rule, Why, Scope, Pattern/part, Checked by: a probe, check, contract, build-tool
rule or a doc read at every launch; See it; Status, dated), three scopes (House, Family: the kitchen family, Game: chai), glossary,
14 patterns, values, placement, the proof scale 0-5; as the folder docs/design-language/standard/ (a page per domain, each under
its limit), by five builders (`docs/sprints/S17-chai-done-families.md`, "The rest"). This page is the source until the stitch,
then a pointer (history in git). Every CHAI row cited only in chai-tray.js and every
`*14` onboarding state gets a row there (House, Family, Game, or retired): Sprint 18's map (`docs/sprints/S18-kitchen-family.md`).

## 1. Onboarding: one rule for every game (SH-146; Zafar, 3 Nov: yes)

**The rule, in one line:** show each action once, the first time it happens, with chai's light; after that, only the stuck hint.

1. **What counts as first:** the first time an action comes up for this player: a new player once a visit, a returning player once
   ever. Never again for a second pan, pot, level or round (SH-181). New actions later in the ladder (a reveal, a second pan, a new
   tool) get their own first time when they first happen (SH-196, CHAI-68).
2. **What it looks like:** the screen dims except one lit box with a gold glow around the thing to tap, and the thing jumps
   (SH-141). The box hugs its tap area (contract-53; a circle on a pan's rim, CHAI-68). No ripples, no pointing finger on a tap; the
   hand shows only for a drag, hold or swipe (SH-141). The dim never comes without its lit target (CHAI-36), and leaves completely
   (CHAI-50).
3. **When it comes:** after the last animation of the step before it has finished (CHAI-42), with a short breath (CHAI-52); a step's
   spoken call comes a beat after its light (CHAI-40: the first time only, Zafar's 1 Nov rule, kept 3 Nov).
4. **The order card is taught first:** after the first items are shown, the light moves briefly to the order card so the eye knows
   where to look (CHAI-37), and then follows the next item on it (SH-178).
5. **The reveal is taught when it first happens:** the first time a card's word is dotted, then the first time a picture is
   blurred, the light shows the reveal tap; a blurred Kutchi word and a blurred English word are one lesson (SH-196).
   **The zoom-in light** (SH-213; Zafar, 5 Nov: "a generalizable principle/rule"): a light on a small part of a thing (a card's
   hidden word, its blurred picture, a knob's mark) first lights the whole thing, then the box shrinks onto the part
   (`Onboard.light(part, {zoomFrom: whole})`, `Onboard.ZOOM`), so the eye goes to the thing, then to the part.
6. **A word is never blurred before it is met** (the blur rule, SH-195; Zafar, 3 Nov): a picture blurs only when the level says so
   **and** the word's ladder agrees: while its pill still shows (the first or second meetings), it stays clear, even at L3-L4 (the
   round's snapshot, so it never changes mid-round). A word a picture can't show (half,
   full, an amount) gets the word moment (CHAI-67).
7. **After the first time:** no light at all unless the child is stuck; the stuck hint names and lights the next undone item in the
   card's order (SH-182); its wait restarts after every right move, pours and serves included (SH-184).
8. **The child is never made to wait:** a tap during a line or a light lands at once (CK-45, contract-21); the whole order can be
   skipped with a tap on the kitchen (CK-54).
9. **"New player" in the settings** gives the first-time showing again; nothing else does (CHAI-56).

## 2. The order

1. **Said whole, then shown:** the customer says the whole order; each item's big word card pops out beside the side panel as it is
   said and flies whole into its row (SH-150, SH-144, SH-163: no fade, no doubled words). Only while the order is given, never while
   cooking (SH-150).
2. **"No" items are said last,** so the row only moves forward (CHAI-39; Mum to confirm, Round 6, R6-141).
3. **A count ticks the moment it is reached;** an extra tap doesn't land (SH-38). Every item ticks as it is done, in any order (SH-182).
4. **The pop-out's one shape and size,** bigger where there is room (CHAI-43); never over a face (CK-18, SH-177, SH-183).
5. **A finished order folds** to its face and sentence, the next one opening below with a smooth scroll (SH-148, SH-169, SH-180); the
   current order is always whole in view (SH-191, SH-194).
6. **A lost dish** (spilled, boiled over) resets its row to the start, scrolled back (CHAI-62).

## 3. The cards and the side panel

1. **One word card** (SH-147): the maroon Kutchi big, the small dark English under it while supported, a soft shadow, a big clear
   speaker; the same card in the pop-out, the row and the helper (SH-149).
2. **The words fit:** nothing clipped or ellipsised; a long word shrinks, then wraps (SH-142, non-negotiable 6); every card's word
   level with its neighbours (SH-193); the speaker padded as the card is (SH-165, SH-140).
3. **The side panel's measures:** equal padding around each item (SH-190), Nani's box as tall as its line and face need (SH-189,
   SH-179), the headline's gaps equal (SH-192), the headline and Nani's line one size (SH-176), sizes scaling with the screen (SH-185).
4. **Faces at full contrast, on top** (SH-183), in the corners by their glass where a game has them (CHAI-65); big enough at L1
   (SH-139).
5. **No reveal eyes in a speech bubble or on a spoken card** (SH-153); a reveal control centred in its slot (SH-143).

## 4. Speech and bubbles

1. **One voice at a time** (PAN-04, contract-7).
2. **Bubbles placed from free space,** never by hand per screen: people, the counter and the side panel taken out; beside the head
   when there is no room above, the right first (SH-145, SH-177); never behind the cog (SH-187); the tail clear of the speaker
   (SH-188); replies never stacked over each other (SH-186).
3. **The pour is quiet** (CHAI-51): no read-along during an action.
4. **A reloaded page starts on one big play button** so a phone lets the sound play (SH-198).

## 5. Play

1. **The real things, animated:** heating rings, the boil and its green zone (CHAI-38, CHAI-63); an over-boil empties the pan and
   starts it again (CHAI-57, CHAI-58); several pans cook at once without pausing each other (CHAI-61).
2. **Layout by height at the four sizes** (740x320, 930x430, 1280x665, 1920x1080), with **no exception for one size unless strictly
   required** (Zafar, 3 Nov, CHAI-33: 740x320 is an unpopular size); the play area and its strip lined up with equal
   gaps (CHAI-66); nothing overlaps (CHAI-02); the screen never jumps between orders (CK-57).
3. **Undo until the step moves on** (non-negotiable 7); progress, never verdicts.
4. **Loading:** the game's files asked for at once, the greeting's lines with them (SH-175); Nani's box in its final look from the
   first frame (SH-174); no menu buttons over the play (CK-53).

## 6. Words and the leak test

1. **Every line from the language engine,** from recorded phrases and words; a missing Kutchi line is its English in grey italic
   (Zafar, 3 Nov), logged in `docs/language/recording-sheet.md`.
2. **The leak test** once words are past support: no winning by reading, matching, eliminating, patterns or waiting (non-negotiable 4).

**Where the draft's rules live today:** §1 the kit (`js/shared/onboard.js`, `js/cook/ui.js`) for
2, 3, 6-8, chai for 4, 5 and the next-pan light; §2-4 the kit (`order-card.js`, `word-card.js`, `js/cook/ui.js`, the bubble placer,
`buttons.js`). Checked: §1 contract, judge (a new player's first round); §2 contract, panel, judge; §3 panel, lab, contract; §4 contract, judge; §5 contract, lab, load, judge; §6 leak and the Kutchi gate.

## Open in chai

Nothing: signed off 7 Nov. Sprint 18 moves its code to the layers above; the frozen run proves chai unchanged.
