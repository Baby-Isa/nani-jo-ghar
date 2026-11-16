# Run 16: sort

Every live row of the fix list has one entry in `build/reports/run16/sort.json` (Cook rows first; `cook: true` marks them and the shared rows that touch the kitchen games). Extra fields beside the brief's: `shouldProbe` (yes, eye, no), `probe` (the evidence.json key, when one exists), `ownStatusSaysBuilt`, `codeChecked`, `parked`, `label` (the row's own status, first words), `duplicateOf`.

## Flaws first

- **A fast pass.** Thirteen sorters did the list in about three minutes each. "codeChecked" means the sorter found the fix (or its absence) in the named file, not that the game was played: no browser was used. Treat every "built" as "needs proof", never as done.
- **Rows marked built though the fix list does not say built** are listed below. The sorter found fix code (file and line in each note). A builder should not skip one on this file's word alone: probes-built should prove them first, and a red probe sends the row back to open.
- **Art, clinic, language and process rows** were sorted mostly from the row's own text (codeChecked false on most): little there has code to read.
- **Three "overridden" verdicts rest on thin quotes** and want the orchestrator's eye before the row is closed: SEK-14 ("I'll leave that to your discretion"), CK-68 (his words are quoted only in the fix list's own row CK-67), DAAR-47 ("I'm erring towards leaving it out").
- **Chai is frozen:** the notes on CHAI-37, -49, -58, -83, -89, -95, -98, -103, -108 say a fix would change chai's look or timing; those are his call before anyone builds.
- Rows with status "open" and `parked: true` are the parked ones (clinic, the day, before the stores); the brief has no "parked" status, so the kind or the note carries it.


Rows in the fix list (keep list left alone): 547. Sorted so far: 547. Not yet sorted: 0. Verdict backed by reading the code: 436; from the row's own text only: 111.

## Before: the fix list's own labels, by prefix

| |Mum/language|Zafar|art|other|parked|to fix: check|to fix: code|total|
|---|--:|--:|--:|--:|--:|--:|--:|--:|
|ART|||33||1|17|13|64|
|BOOK||||||2||2|
|CHAI||||||43|21|64|
|CHT|||2|||2|5|9|
|CK|1||6|1|1|44|23|76|
|CLN|2||16||2|8|10|38|
|DAAR|1||4|1||21|5|32|
|DAY||||1||1||2|
|FARM|||||||1|1|
|LAB|||||||1|1|
|LNG|10|||||1|2|13|
|MAA|2||1||1|6|3|13|
|MOD|1|||||||1|
|PAN|1||1|||5|2|9|
|PRC||||||6|2|8|
|RIDE|||||||1|1|
|RT|||||||4|4|
|SAM|2||3|||7|5|17|
|SEK|2||1|||6|4|13|
|SH|1|2|10|2|2|84|78|179|
|**total**|23|2|77|5|7|253|180|547|

## After: verdicts

| |Cook|other|total|
|---|--:|--:|--:|
|built|272|23|295|
|duplicate|1||1|
|open|114|67|181|
|open (parked)|7|50|57|
|overridden|7|1|8|
|question|5||5|
|**total**|406|141|547|

## After: kind x game, every sorted row

| |Art|Check|HisCall|Kutchi|Logic|Look|Parked|Teaching|total|
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
|baking|6|||2|1|9||1|19|
|chaat|3||||3|5||1|12|
|chai|10|7||2|22|21||12|74|
|chai-tray||1|||1|1||1|4|
|chop|2||||3|2||1|8|
|clinic|17|1||2|6|8|7|4|45|
|corn|3||1||2|14||1|21|
|daar|6||3|1|4|13||7|34|
|day|||||3|1|2|2|8|
|eggs|2|1|||6|10|||19|
|kit|17|19|5|5|28|105|5|19|203|
|maani|2||||||||2|
|maani-line|1|||2|3|3||3|12|
|other|10|22||8||1|2|1|44|
|roll-tawa|1||||1|2||1|5|
|samosa|3|||2|5|5||3|18|
|sekelo|4|||3|4|7|||18|
|stir|1||||||||1|
|**total**|88|51|9|27|92|207|16|57|547|

## After: kind x game, what is left to do (not overridden, duplicate or parked)

| |Art|Check|HisCall|Kutchi|Logic|Look|Teaching|total|
|---|--:|--:|--:|--:|--:|--:|--:|--:|
|baking|6|||2|1|9|1|19|
|chaat|3||||3|5|1|12|
|chai|10|7||2|22|21|12|74|
|chai-tray||1|||1|1|1|4|
|chop|2||||3|2|1|8|
|clinic|1|||||1||2|
|corn|3||||2|14|1|20|
|daar|6||3|1|4|13|7|34|
|day|||||||1|1|
|eggs|2|1|||6|10||19|
|kit|17|19|4|3|28|103|18|192|
|maani|2|||||||2|
|maani-line|1|||2|3|3|3|12|
|other|10|22||8||1|1|42|
|roll-tawa|1||||1|2|1|5|
|samosa|3|||2|5|5|3|18|
|sekelo|3|||3|4|6||16|
|stir|1|||||||1|
|**total**|71|50|7|23|83|196|51|481|

## After: should it have a machine probe (left to do)

| |eye (has spec)|eye (no spec)|no (has spec)|no (no spec)|yes (has spec)|yes (no spec)|total|
|---|--:|--:|--:|--:|--:|--:|--:|
|built|26|30|1|11|116|111|295|
|open|16|14|40|46|40|25|181|
|question||||4||1|5|
|**total**|42|44|41|61|156|137|481|

## Marked built here though the row's own status does not say built (117): prove these first; a red probe sends one back to open

SH-232, SH-233, SH-234, ART-46, SH-220, SH-210, CHAI-85, ART-39, SH-209, SH-201, SH-202, SH-204, SH-205, SH-206, SH-207, SH-208, SH-189, SH-12, SH-13, SH-173, SH-180, SH-239, SH-241, SH-242, SH-230, SH-60, SH-138, SH-236, SH-237, SH-238, SH-240, SH-244, SH-272, SH-273, SH-274, SH-276, SH-277, SH-278, SH-286, SH-287, SH-288, SH-289, SH-291, SH-292, SH-295, SH-300, SH-301, SH-302, SH-303, SH-304, CHAI-103, CHAI-104, CHAI-95, CHAI-96, CHAI-97, CHAI-98, CHAI-99, CHAI-100, CHAI-19, CHAI-02, DAAR-47, DAAR-49, DAAR-50, SEK-27, SAM-34, SEK-28, SAM-44, MAA-20, MAA-28, CHT-04, CK-45, CK-56, CK-72, CK-121, RT-01, RT-02, RT-03, RT-04, CLN-218, LAB-08, ART-29, ART-30, SH-64, PRC-13, CHAI-74, CHAI-75, CHAI-77, CHAI-78, CHAI-79, CHAI-80, CHAI-81, CHAI-82, CHAI-63, CHAI-107, CHAI-113, SH-19, SH-195, SH-235, SH-249, SH-250, SH-251, SH-252, SH-253, SH-254, SH-255, SH-257, CK-82, SH-258, SH-260, CK-87, CK-88, CK-89, CHT-16, ART-34, ART-74, ART-76, ART-77

## Changed by the second look (21 of 153 looked at)

- ART-53: built -> open: The row itself says the tool handles (TK02 churner, TK03, TK05, TB05) are still light, waiting on their next redo; no later run in build/reports re-did them. 'Walnut wherever there's wood' is only part done (lids and rolling pin); the handles are an art-run item.
- CHAI-83: built -> open: rungOf (chai-tray.js:1709-1713) returns no light for the next pan while another heats or waits to pour, but s19-clean-b.md:85 lists CHAI-83 as a FIXED-IN-CODE row failing its check in the final run (contract-78 x1, L2 'Slow kar!'); not known to work.
- SH-172: built -> open: Cook is built: an item step's call is skipped at the step's opening and said as Nani's card opens (ui.js:826-834, :1222). But the row and its check name every heal game too, and the clinic's heal host still says a step's rows as the step opens (js/clinic/heal/host.js:840-845 card.speak(ids)), with no tie to the doctor's helper card opening (js/clinic/screen.js:152-212); the row's own status says the other games wait their turn.
- SH-176: built -> overridden: The code no longer sets the headline equal to Nani's line: the side panel's headline is 0.87 of --oc-h (order-card.css:806-808) while her line is var(--sb-h, --njg-side-h) (order-card.css:504). That is Zafar's later yes to a one-size, slightly smaller order sentence (decision 27, 14 Nov), so the row's 'one size with Nani's line' check would fail by design; SH-277/SH-289 carry the headline's size now.
- CHAI-55: duplicate -> open: Not a clean duplicate: CHAI-110 covers only the first L4 round (full then half, the glass light after the first tap), while CHAI-55 also asks seating by word stage over later rounds (data/cook.json ~1102 teach, recipes.js) and a stuck hint for the second pour after L4's wait (chai-tray.js:1447). Its status is 'reopened (evidence FAIL s19-night-b-a2)' with no pass since.
- DAAR-12: built -> open: The speed gate is built (data/stations/daar.json:5 stirSpeedFrom 4; daar.js:1241; stir.js:75), but his latest word (11 Nov) asks for a word moment on the first L4 try that teaches fast and slow and introduces the speedo; daar.js:1239-1240 only says it waits on Mum, and the moment itself (slow ladle, fast ladle, the speedo) is not built; missing Kutchi can show as grey English meanwhile.
- DAAR-47: overridden -> built: The quote is real (kitchen-mocks-2026-11-09-transcript.md [9]) but it is the row's own note, not a later word, and only a lean; better read as built: nothing pours from above, the heaps go in from their bowls and the daar by the shared pour from its bowl beside the pot (daar.js:1132-1140), which is what he leaned to.
- SEK-24: built -> open: ui.js:3348-3352 (SH-242) only stops the crate: an item card now shows one tomato, not the skewer the row asks for. The dish card is the served sekelo picture (mishkaki-grill.json:212-217). The builder notes the one-skewer picture 'needs art' (s20-b2-sekelo.md, call 4). No skewer picture exists for 'hakri lakri tameto', so the row's own 'to fix: art' still holds.
- SEK-29: built -> open: The row's status says 'two strikes' and 'evidence FAIL s19-r2-games-ev'. The latest sheet (evidence-s19-r2-games-ev2.md:18) still shows the gold box gone by 402 ms with the meat pale, which breaks 'none gone with the meat still raw'. No motion was captured at 1280. The steady order row was left to ui.js: contract-72 was advisory x1 in s20-b2-sekelo round 2. No evidence shows the headline picture or 'gos' in the end review. The browning overlay (grill.js:809, :2333) and the cog clearance (:1775) are in.
- SAM-40: built -> open: samosa.js:237-240 says that keeping the card whole at the praise needs the kit's fold to wait for well done, 'so it stays as it was'. build/reports/s20-b2-samosa.md:6 lists SAM-40 as 'wait on the kit'. The code fix is missing: the order card can still fold to its headline at well done (1280x665). The hob's clearance part was seen only on small evidence frames.
- SAM-46: built -> question: Three of four parts are built: the word pop is kept on the board (samosa.js:445, :933), the tray items are centred (:308), and the karahi handle is inside the hob (:1464). The pastry's contact shadow is NOT built, against the first note. samosa.js:1078 gives the pastry the board's shadow (SH-268, contract-120), and build/reports/s20-b2-samosa.md:15,22 leaves it as a question. Question for Zafar: give the pastry its own contact shadow on the board, against SH-268? The builder recommends no.
- ART-18: built -> open: Characters bob by Lifecycle.talk at 2 px / 0.4 deg / 380 ms (request-popup.js:798, :864 njg-talk), a third of the old; but a second talk animation remains: focus.css:15/:39 njgTalk with tokens.css:83 (2 px lift, -3 deg tilt, 450 ms), used on every talking face circle and Nani's box face (face.css:52, guide.css:42, cook.css:462). Its tilt is 2.5 times the old 1.2 deg, and the row asks for one shared talk animation.
- CHAI-60: built -> open: contract-s14.mjs:69-85 judges only each control's first call, but build/reports/s19-clean-b.md:85 lists CHAI-60 under FIXED-IN-CODE rows that FAIL their check in the final runs (contract-78 x1, L2 'Slow kar!'), and the row's status repeats it; not known to work.
- CHAI-67: built -> open: The moment exists (flow.js:578-579, :2000-2002; ui.js:80-100 due only when both half and full are asked and still new, once), but the status says 'reopened (evidence FAIL ev-20261104-152612-lpq)' and no second-play probe has passed since; not known to work.
- CHAI-68: built -> open: Code is there (chai-tray.js:1573-1610 nextPanLight via Coach.nextLight, first-time gate, rim ring; :980 at once on a jar into a poured pan), but the row's status is 'reopened (evidence FAIL ev-20261104-042426-e9c)' with no passing run since, so the fix is not known to work. Also the row's check says within 0.6 s, which CHAI-99 later moved to 0.8 s (onboard.js:426): the check needs updating.
- SH-196: built -> overridden: The in-game reveal lessons it describes were retired by Zafar's later word: coach.js:1028-1031 sets C.LESSONS_IN_GAME false (SH-213), and the blurred-card lesson now runs on the order's pop-up card (ui.js blurLesson); the quote is in SH-213 (regressions.md:37), 12 Nov, after this row's 6 Nov reopen.
- SH-259: built -> open: daar.js:256, :306, :644-647 now run Cook.Chop.play with only targets and callbacks (stations/chop.js:123 ASK refuses the rest at run time), but the row's own fix includes 'and a check': no lint that a recipe passes chop no layout or light options exists in build/tools or build/sandbox.
- SH-264: open -> built: The row's 'left' list is answered in js/shared/wrong-order.js: leaving ends it at once (the a2 review's finding 1, CUT, :122-124); a tap hurries only the beat in flight, never the wrong row's line (:116-119, finding 3); a words' floor with two columns then scroll (:213-224, finding 4); chai's all-spices leak is closed by chaiExtra (chai-tray.js:44-52, :2315-2358: right only with nothing unasked, a miss otherwise). The Kutchi oho waits on Mum (soft sound meanwhile).
- CK-78: built -> open: Well done with the pieces, face and chip are in code (stations/chop.js:235, :268, :279; mechanics/chop.js:756, :805), but 'the whole garlic top-down like its halves' is not: assets/art/chop/lasan.whole.r1.webp (data/stations/chop.json:376) is side-on while lasan.half-a/b are top-down (viewed). The status also records contract-113 x2 failing after the fix.
- ART-35: built -> open: build/reports/art-queue.md exists, but every block in it has landed except 3c. Block 3c is about 10 images and still 'to write (/art-run)'. The row asks for at least two days (about 240 images) of paste blocks ready at all times, and the queue holds none ready.
- ART-72: built -> open: The stone tray is wired (js/shared/shelf.js:317-330 Shelf.TRAY_ART, slab and tile in three slices). Missing: the row's pot part, 'a top-down pot redraw tried in eggs and chai: better, both get it'; Zafar called the pot good on 11 Nov (CK-88), but only eggs draws it (eggs.js:47-48, eggs.json:300 '_trial ... replaces chai's too'); chai-tray.js has no potTop.

## Questions for Zafar

1. SH-293: +10% is built (shelf.js:95/:204, station-lib.js:274); the rest is his call: does Zafar want a taller bottom row (bigger shelf items, smaller hob)?
2. SH-297: Zafar's call: does he re-haul the end screen to item cards (then the speaker spread is moot) or keep the tiles and fix their speakers? Note SH-309 since put the badge on each card's corner.
3. DAAR-64: Question for Zafar: daar's order is one engine sentence and the kit's read-along shows the part being read (as chai's); should the bubble show the whole sentence at once instead, in every game?
4. SAM-46: Three of four parts are built: the word pop is kept on the board (samosa.js:445, :933), the tray items are centred (:308), and the karahi handle is inside the hob (:1464). The pastry's contact shadow is NOT built, against the first note. samosa.js:1078 gives the pastry the board's shadow (SH-268, contract-120), and build/reports/s20-b2-samosa.md:15,22 leaves it as a question. Question for Zafar: give the pastry its own contact shadow on the board, against SH-268? The builder recommends no.
5. SH-262: Question for Zafar: make the word pill's speaker clearer for a young child (a bigger speaker, or a first-time light on it once)?

## Overridden (his later words)

- SH-70: "The orders use the formal, agreeing endings for now, not the contraction khape: khapeti (she, one), khapanti (she, more than one), khapeto (he, one), khapanta (he, more than one) ... (his 12 Nov sitting: "so they learn properly") (Zafar, 14 Nov; docs/decisions/2026-11-10-overnight.md #27)"
- SH-176: "Zafar, 14 Nov: yes to the one-size, slightly smaller order sentence (SH-289). (docs/decisions/2026-11-10-overnight.md #27)"
- SH-106: "go to the next scene buttons as well I think we should just cut them all out ... the next button is just horrible (docs/feedback/kitchen-play-2026-11-08.md P11)"
- SEK-14: "the shadows on this tray ... render the trays with 1, 2, 3, and 4 skewers ... I'll leave that to your discretion (docs/feedback/kitchen-mocks2-2026-11-09.md:37, P5)"
- CK-68: "maybe it's two screens: first grill them all and then flavour them on the next screen ... then you can flavour different corns differently (Zafar, 9 Nov, second mocks note; regressions.md CK-67)"
- LNG-15: "6 (the Eid lines become the birthday) (Zafar's yes, 31 Oct; build/reports/game-settings-map-2026-10-31.md:229)"
- SH-196: "Remove the onboarding from within the game mode for the blurred card (both blurred image and text). (Zafar, 12 Nov morning; docs/process/regressions.md SH-213)"
- SH-263: "A mistake keeps chai's way in every game (5): the wrong pan can't be picked, but a wrong item can go in, the cup is made, and the whole cup is redone ("I just want to keep it to how Chai does it"); SH-263 is answered so. (Zafar, 13 Nov; docs/decisions/2026-11-10-overnight.md item 22)"

## Duplicates

- SEK-20 -> SEK-27
