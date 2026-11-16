# Run 16: sort

Every live row of the fix list has one entry in `build/reports/run16/sort.json` (Cook rows first; `cook: true` marks them and the shared rows that touch the kitchen games). Extra fields beside the brief's: `shouldProbe` (yes, eye, no), `probe` (the evidence.json key, when one exists), `ownStatusSaysBuilt`, `codeChecked`, `parked`, `label` (the row's own status, first words), `duplicateOf`.

## Flaws first

- **A fast pass.** Thirteen sorters did the list in about three minutes each. "codeChecked" means the sorter found the fix (or its absence) in the named file, not that the game was played: no browser was used. Treat every "built" as "needs proof", never as done.
- **Rows marked built though the fix list does not say built** are listed below. The sorter found fix code (file and line in each note). A builder should not skip one on this file's word alone: probes-built should prove them first, and a red probe sends the row back to open.
- **Art, clinic, language and process rows** were sorted mostly from the row's own text (codeChecked false on most): little there has code to read.
- **Three "overridden" verdicts rest on thin quotes** and want the orchestrator's eye before the row is closed: SEK-14 ("I'll leave that to your discretion"), CK-68 (his words are quoted only in the fix list's own row CK-67), DAAR-47 ("I'm erring towards leaving it out").
- **Chai is frozen:** the notes on CHAI-37, -49, -58, -83, -89, -95, -98, -103, -108 say a fix would change chai's look or timing; those are his call before anyone builds.
- Rows with status "open" and `parked: true` are the parked ones (clinic, the day, before the stores); the brief has no "parked" status, so the kind or the note carries it.


Rows in the fix list (keep list left alone): 547. Sorted so far: 547. Not yet sorted: 0. Verdict backed by reading the code: 432; from the row's own text only: 115.

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
|built|284|27|311|
|duplicate|2||2|
|open|103|63|166|
|open (parked)|7|50|57|
|overridden|6|1|7|
|question|4||4|
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
|chai|10|7||2|22|21|11|73|
|chai-tray||1|||1|1|1|4|
|chop|2||||3|2|1|8|
|clinic|1|||||1||2|
|corn|3||||2|14|1|20|
|daar|6||2|1|4|13|7|33|
|day|||||||1|1|
|eggs|2|1|||6|10||19|
|kit|17|19|4|3|28|104|19|194|
|maani|2|||||||2|
|maani-line|1|||2|3|3|3|12|
|other|10|22||8||1|1|42|
|roll-tawa|1||||1|2|1|5|
|samosa|3|||2|5|5|3|18|
|sekelo|3|||3|4|6||16|
|stir|1|||||||1|
|**total**|71|50|6|23|83|197|51|481|

## After: should it have a machine probe (left to do)

| |eye (has spec)|eye (no spec)|no (has spec)|no (no spec)|yes (has spec)|yes (no spec)|total|
|---|--:|--:|--:|--:|--:|--:|--:|
|built|28|31|2|10|127|113|311|
|open|14|13|39|46|29|25|166|
|question||||4|||4|
|**total**|42|44|41|60|156|138|481|

## Marked built here though the row's own status does not say built (134): prove these first; a red probe sends one back to open

SH-232, SH-233, SH-234, ART-46, ART-53, SH-220, SH-210, CHAI-85, ART-39, SH-209, CHAI-83, SH-201, SH-202, SH-204, SH-205, SH-206, SH-207, SH-208, SH-189, SH-12, SH-13, SH-172, SH-173, SH-176, SH-180, SH-239, SH-241, SH-242, SH-230, SH-60, SH-138, SH-236, SH-237, SH-238, SH-240, SH-244, SH-272, SH-273, SH-274, SH-276, SH-277, SH-278, SH-286, SH-287, SH-288, SH-289, SH-291, SH-292, SH-295, SH-300, SH-301, SH-302, SH-303, SH-304, CHAI-103, CHAI-104, CHAI-95, CHAI-96, CHAI-97, CHAI-98, CHAI-99, CHAI-100, CHAI-19, CHAI-02, DAAR-12, DAAR-49, DAAR-50, SEK-24, SEK-27, SAM-34, SEK-28, SEK-29, SAM-40, SAM-44, SAM-46, MAA-20, MAA-28, CHT-04, CK-45, CK-56, CK-72, CK-121, RT-01, RT-02, RT-03, RT-04, CLN-218, LAB-08, ART-18, ART-29, ART-30, SH-64, PRC-13, CHAI-60, CHAI-74, CHAI-75, CHAI-77, CHAI-78, CHAI-79, CHAI-80, CHAI-81, CHAI-82, CHAI-63, CHAI-67, CHAI-68, CHAI-107, CHAI-113, SH-19, SH-195, SH-196, SH-235, SH-249, SH-250, SH-251, SH-252, SH-253, SH-254, SH-255, SH-257, CK-82, SH-258, SH-259, SH-260, CK-87, CK-88, CK-78, CK-89, CHT-16, ART-34, ART-35, ART-72, ART-74, ART-76, ART-77

## Changed by the second look (0 of 0 looked at)

None.

## Questions for Zafar

1. SH-293: +10% is built (shelf.js:95/:204, station-lib.js:274); the rest is his call: does Zafar want a taller bottom row (bigger shelf items, smaller hob)?
2. SH-297: Zafar's call: does he re-haul the end screen to item cards (then the speaker spread is moot) or keep the tiles and fix their speakers? Note SH-309 since put the badge on each card's corner.
3. DAAR-64: Question for Zafar: daar's order is one engine sentence and the kit's read-along shows the part being read (as chai's); should the bubble show the whole sentence at once instead, in every game?
4. SH-262: Question for Zafar: make the word pill's speaker clearer for a young child (a bigger speaker, or a first-time light on it once)?

## Overridden (his later words)

- SH-70: ""The orders use the formal, agreeing endings for now, not the contraction khape: khapeti (she, one), khapanti (she, more than one), khapeto (he, one), khapanta (he, more than one) ... (his 12 Nov sitting: \"so they learn properly\")" (Zafar, 14 Nov; docs/decisions/2026-11-10-overnight.md #27)"
- SH-106: "go to the next scene buttons as well I think we should just cut them all out ... the next button is just horrible (docs/feedback/kitchen-play-2026-11-08.md P11)"
- DAAR-47: "I'm erring towards leaving it out because I don't think we'll be able to execute it well. (Zafar, 9 Nov, docs/feedback/kitchen-mocks-2026-11-09-transcript.md; also docs/feedback/kitchen-mocks-2026-11-09.md P12)"
- SEK-14: "the shadows on this tray ... render the trays with 1, 2, 3, and 4 skewers ... I'll leave that to your discretion (docs/feedback/kitchen-mocks2-2026-11-09.md P5; decided: skewers placed by code, no pre-rendered tray states)"
- CK-68: "maybe it's two screens: first grill them all and then flavour them on the next screen ... then you can flavour different corns differently (Zafar 9 Nov, docs/process/regressions.md CK-67 from docs/feedback/kitchen-mocks2-2026-11-09.md P6; docs/decisions/2026-11-10-overnight.md #3: "then the flavour screen")"
- LNG-15: ""the Eid lines become the birthday" (Zafar, 31 Oct; build/reports/game-settings-map-2026-10-31.md)"
- SH-263: "A mistake keeps chai's way in every game (5): the wrong pan can't be picked, but a wrong item can go in, the cup is made, and the whole cup is redone ("I just want to keep it to how Chai does it"); SH-263 is answered so. (docs/decisions/2026-11-10-overnight.md, item 22)"

## Duplicates

- CHAI-55 -> CHAI-110
- SEK-20 -> SEK-27
