# s04 audit verdicts, batch 3a (30 rows)

Reviewer: independent (built none of it). Evidence: sheets in build/screenshots/sprintcheck/s04-audit/, one sandbox run at 1366x768 (s04-c1366). Full-size shots opened only where a verdict depended on them.

CK-21 | FAIL: no evidence: no served dish on the counter in any shot (the sheet shows title, station lab, shop, pass-me, pour, boil); tray, angle and shadow unseen
CK-22 | FAIL: no evidence: ear row, and no serve's closing line is shown; pass-me result sidebar shows written "Thank you!" (not a grey placeholder) with no listing back. A person must listen to every serve
CK-23 | FAIL: no evidence: no #mistake state from any station or heal game on the sheet (redo just that item, second try with help, show-the-right-way after three are all unseen)
CK-24 | PASS: Cook's home shows six round markers, each with a sun above it, the first numbered 1 and the rest locked. That reads as days, not "Level 1–4". Zafar should still confirm the sun icons are big enough to read as days
CK-25 | FAIL: no evidence: timing row; the sheet shows only clinic heal-eye stills, no Cook labs station load time measured or shown
CK-26 | FAIL: no evidence: the greeting is not on the sheet (no red, grey or right pick, no thought bubble)
CK-27 | FAIL: no evidence: no shot catches an item going into a pot, pan, glass or bowl; only chai shown (daar, chaat, samosa absent); no puff or sprinkle visible
CK-28 | FAIL: no evidence: labs.html is not on the sheet; the only lab view is Cook's in-game "Station lab" pop-up, whose first group has no heading and which has no clinic group
CK-29 | FAIL: contract FAIL: 46 contract-1 breaks (34 in this row's flows), e.g. chaat request pop-up not read out; lab:cook/story-birthday did not reach the end; no story play of each recipe shown
CLN-01 | FAIL: the sheet shows only the waiting room (finished art), but the same run's diagnosis and send-off shots show the doctor as flat vector stand-in art, and the guide-box face is a flat stand-in icon. Pharmacy and heal rooms are not on this sheet
CLN-02 | FAIL: no evidence: only the waiting room is on the sheet; the other five rooms and the heal-game backgrounds ("nothing faded") are unseen
CLN-03 | FAIL: end pop-up placement is inconsistent (left over the sidebar at waiting L3/L5, right of centre at L1/L2/L4); waiting-room patient card at L3–L5 shows only "…"; review faces not shown
CLN-04 | FAIL: no evidence: the ladder isn't readable. L1 "Bring in man" and L2 "Bring in chokri in yellow" are placeholders, and L3–L5 request cards show only "…". Ear row: a person must hear the waiting-room ladder
CLN-05 | FAIL: no Nani box, but the guide box face is a flat stand-in icon of an old man with glasses, not the doctor (the bearded doctor in the room appears only in the request card below it), so the doctor does not visibly fill her role
CLN-06 | FAIL: no evidence: contract-13 passes (0 breaks over 301 pages) and the waiting and diagnosis starts are clean, but the pharmacy, send-off and heal-stage starts are not on the sheet; the morning end screen still shows the send-off's "Pick how she feels." in the guide box
CLN-07 | FAIL: no evidence: no lab debug log is visible in any shot, so overlap with pills or counter cannot be judged
CLN-08 | FAIL: no evidence: no heal-game close-up or certificate on the sheet (waiting room only)
CLN-09 | FAIL: no evidence: no check_hotspots output, no tooth or trolley shot, and no iPad or phone size (1366 only)
CLN-81 | FAIL: no evidence: the sheet shows only the morning's results and end screens. The girl's art in the waiting room, diagnosis, send-off and sticker for this flow isn't on it. The end-card faces look like finished art
CLN-82 | FAIL: no evidence: no heal-game L2/L3 shot on the sheet (waiting, diagnosis, pharmacy only); next-row and glowing-tool states unseen
CLN-83 | FAIL: no evidence: timing ("moves on after a beat") can't be shown by stills; every result pop-up still shows a → button. A person must play diagnosis, pharmacy, scrape and ear
CLN-84 | FAIL: no evidence: the sheet's heal-cut and pharmacy starts show no pop-up. The run's morning shots c15/c42 (scrape) and c12 (pharmacy) do show the request pop-up, but the other eight heal games at L1–L3 are not shown
CLN-85 | FAIL: in diagnosis the girl is mid-room beside a stand-in doctor, with no person at top right. Pharmacy shows no person at all. Only the heal close-ups show her face at top right. The eye-game bubble under her mouth isn't on this sheet
CLN-86 | FAIL: no evidence: contract-4 passes, but the sheet is fever only. No waiting-room salaam/reply bubbles and no "too cold" bubble are shown, and the clips' speakers need checking by ear
CLN-87 | FAIL: no evidence: no zoom-in, close-up swap or pull-out frame on the sheet (waiting room only); timing unjudgeable from stills
CLN-88 | FAIL: no evidence: timing row; no load-time measurement on the sheet
CLN-89 | FAIL: no evidence: labs.html is not on the sheet
CLN-109 | FAIL: no evidence: ear row; two stills (heal-cut, send-off) can't show voice carry-over. A person must finish scrape L1 fast and listen into the send-off
CLN-111 | FAIL: not fixed: the morning results offer only ↻ and →, and the end-of-morning screen offers only a "Close the clinic." placeholder button. No "All patients" and no Again there
CLN-112 | FAIL: no evidence: no #takeback flow on the sheet (waiting L4 and pharmacy ends only); no heal game shown

## Other flaws seen

- **Written English for the child (non-negotiable 5).** The clinic morning words review (clinic-morning/13-results-words.png) prints English glosses under every Kutchi word: "girl", "hand", "water", "first", "and then", "four", "cold". Cook pass-me (04-result) shows "Thank you!" in red sidebar text, not a grey placeholder.
- **Stand-in art still ships in the clinic.** The doctor in diagnosis and send-off is flat vector art. The guide-box face is a flat icon. The end-of-morning screen uses a system-emoji hospital on a plain beige background with no room art.
- **Blank capture.** The morning flow's c01-popup.png is an empty beige screen.
- **End-of-morning screen.** It keeps the send-off's "Pick how she feels." and shows an empty request card in the sidebar. Both patient rows show the same girl.
- **Result pop-ups are mostly empty white.**
  - Cook pass-me, pour and boil show only a timer badge in a wide white card.
  - The words review leaves its left half blank.
  - The diagnosis L1 result shows a ✓ badge with no count.
- **Heal-cut opening pop-up gives all its steps at once** (pela paani / ne poi cloth char dabs / ne poi yellow plaster). This conflicts with "each instruction just before the game that needs it" (decision 53 / CK-29) if that applies to the clinic.
- **Waiting room L4.** The six patients are crammed and overlap one another on the bench.
- **Cook "Station lab" pop-up** spells the same dish two ways: "Daar" (stations) and "Daal" (whole recipes).
- **Unfinished flow.** lab:cook/story-birthday did not reach its end in this run.
- **Sheets reuse generic shots.** Most rows' sheets are the same generic waiting-room or Cook-title set, not the state the row names. The evidence plan needs row-specific states before these rows can pass.
