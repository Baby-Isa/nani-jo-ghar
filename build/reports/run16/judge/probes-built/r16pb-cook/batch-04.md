# Evidence batch-04 (layout, 10 rows) · run r16pb-cook

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes (probes-built).

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in /home/user/nani-jo-ghar/build/reports/run16/judge/probes-built/r16pb-cook/batch-04.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## CK-54 [open] Cook: general
- Issue: "I also need way to click on the kitchen during the order and skip the slow ordering into playing the game": a tap on the kitchen while the order is given lands every card at once and the game starts
- Check: auto: every Cook station at L1, L2, L3 and L4 (a tap 1 s into the order: every card in its row, at the station within 1 s)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-54.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-54.md
- Panel A: cook:chai-tray#tap-through-popup L1 1920x1080 [p-seen] · view-marble: the screen, #side outlined
- Panel B: cook:chai-tray#tap-through-popup L1 1920x1080 [p-seen] · crop:#side at rec:view-marble
- Panel C: cook:chai-tray#tap-through-popup L1 930x430 [p-seen] · view-marble: the screen, #side outlined
- Panel D: cook:chai-tray#tap-through-popup L1 930x430 [p-seen] · crop:#side at rec:view-marble

## CK-64 [open] Cook: general
- Issue: Eggs' order: "the order ... says I want egg and then the item says one fried egg I think the order should say ... I want two fried eggs and then ... there should be two item cards and they should both say fried egg that way you can get rid of the need for it to say one as well in the item card" (Zafar, 8 Nov)
- Check: auto: eggs at L1, L2, L3 and L4: the headline says the count; one card per egg, no number on a card
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-64.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-64-2.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-64-3.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-64.md
- Panel A: cook:eggs L1 1280x665 [p-seen] · view-marble: the screen, #side outlined
- Panel B: cook:eggs L1 1280x665 [p-seen] · crop:#side at rec:view-marble
- Panel C: cook:eggs L1 740x320 [p-seen] · view-marble: the screen, #side outlined
- Panel D: cook:eggs L1 740x320 [p-seen] · crop:#side at rec:view-marble
- Panel E: cook:eggs@L2 L2 1280x665 [p-seen] · view-marble: the screen, #side outlined
- Panel F: cook:eggs@L2 L2 1280x665 [p-seen] · crop:#side at rec:view-marble
- Panel G: cook:eggs@L2 L2 740x320 [p-seen] · view-marble: the screen, #side outlined
- Panel H: cook:eggs@L2 L2 740x320 [p-seen] · crop:#side at rec:view-marble
- Panel I: cook:eggs@L3 L3 1280x665 [p-seen] · view-marble: the screen, #side outlined
- Panel J: cook:eggs@L3 L3 1280x665 [p-seen] · crop:#side at rec:view-marble
- Panel K: cook:eggs@L3 L3 740x320 [p-seen] · view-marble: the screen, #side outlined
- Panel L: cook:eggs@L3 L3 740x320 [p-seen] · crop:#side at rec:view-marble

## CK-72 [other] Cook: general
- Issue: Baking's amounts: clear quantities first, then a little and a lot as a real choice (Zafar, 9 Nov: "what about like the put extra, like, the catchy words for put a bit extra or put lots or put little? Like, how do we actually intuitively explain that? ... little or a lot ... later word moments ... The first being like half and whole and quarter and three quarter ... later on, 1.5 and 2.5 ... later on, like level 3 or 4, it's like a little, a lot ... how do we get the person to put a little or a lot, or tell them to keep going? ... The best way I'm thinking about it is you follow a set of clear instructions with clear quantities, then Nani kind of comes on and she just says, like flour, put a little bit more. And then, water, put a lot more.") Zafar, 11 Nov evening: "just remove a little and a lot - those non specific measurements. We'll add them somewhere else. go with fixed measurements (quarter, half, 3/4, full, 1 1/2 and 2 and 2 1/2)"| to fix: check (built: s19-clean-b, s19-clean-b2, s19-round2-review, fixed measures only in the jug, no a-little/a-lot; salt a decoy, a question for Zafar; to judge) (answered: build/reports/s19-waiting-on-zafar-audit.md) · cause: "a little" stops after one tap and "a lot" after lotTaps, so the child wins by tapping until stopped (js/cook/stations/baking.js:296); decided (Zafar, 9 Nov): baking teaches concrete amounts only (the jug's lines: half, whole, a quarter and three quarters, then 1½ and 2½, each a word moment); a little, a lot, a bit more and a bit less leave baking for another game ("I'm erring towards separating the two and finding somewhere else to put a little and a lot"; the spoon-and-cup idea dropped: it would "confuse the words for a little and a lot with the words for spoons and for cups"); where they go: the review is in (build/reports/s19-amount-words-review.md): best the beach sandcastle (labs; already his "fill the bucket, a little or full"; code only: no stop, the tower judged when tipped, half dropped, a bit more and a bit less at L4), then the town fruit stall's chana on the scale, the clinic's parked shampoo, pet feeding; decided (Zafar, 9 Nov): the beach sandcastle, "we'll just come to it when we get to it"; Mum: a lot and a bit less to record, a little (thorok) draft
- Check: docs/feedback/kitchen-mocks2-2026-11-09.md P18
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-2.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-3.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-4.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-5.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-6.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-7.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-8.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-9.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-10.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-11.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-12.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-13.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-14.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-15.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-16.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-17.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72-18.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-72.md
- Panel A: cook:baking#speed1 L1 1280x665 [p-fresh] · crop:#game at every line:cook (13)
- Panel B: cook:baking#speed1 L1 740x320 [p-fresh] · crop:#game at every line:cook (13)
- Panel C: cook:baking@L2#speed1 L2 1280x665 [p-fresh] · crop:#game at every line:cook (16)
- Panel D: cook:baking@L2#speed1 L2 740x320 [p-fresh] · crop:#game at every line:cook (16)
- Panel E: cook:baking@L3#speed1 L3 1280x665 [p-fresh] · crop:#game at every line:cook (14)
- Panel F: cook:baking@L3#speed1 L3 740x320 [p-fresh] · crop:#game at every line:cook (15)
- Panel G: cook:baking@L4#speed1 L4 1280x665 [p-fresh] · crop:#game at every line:cook (14)
- Panel H: cook:baking@L4#speed1 L4 740x320 [p-fresh] · crop:#game at every line:cook (15)

## CK-77 [open] Cook: general
- Issue: Eggs' carton sits on the shelf at chai's size and place, its light and pill whole above the frame's bottom (the eye judge, 10 Nov: a third of a pan's width, off-centre on an empty band, its light and pill cut at 1280x665)
- Check: auto: eggs at the four sizes
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-77.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-77-2.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-77-3.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-77-4.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-77-5.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-77.md
- Panel A: cook:eggs#speed1 L1 1280x665 [p-fresh] · view-marble: the screen, #game outlined
- Panel B: cook:eggs#speed1 L1 1280x665 [p-fresh] · crop:#game at rec:view-marble
- Panel C: cook:eggs#speed1 L1 1920x1080 [p-fresh] · view-marble: the screen, #game outlined
- Panel D: cook:eggs#speed1 L1 1920x1080 [p-fresh] · crop:#game at rec:view-marble
- Panel E: cook:eggs#speed1 L1 740x320 [p-fresh] · view-marble: the screen, #game outlined
- Panel F: cook:eggs#speed1 L1 740x320 [p-fresh] · crop:#game at rec:view-marble
- Panel G: cook:eggs#speed1 L1 930x430 [p-fresh] · view-marble: the screen, #game outlined
- Panel H: cook:eggs#speed1 L1 930x430 [p-fresh] · crop:#game at rec:view-marble
- Panel I: cook:eggs#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- Panel J: cook:eggs#speed1 L1 1920x1080 [p-fresh] · crop:#game at every onboard (3)
- Panel K: cook:eggs#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)
- Panel L: cook:eggs#speed1 L1 930x430 [p-fresh] · crop:#game at every onboard (3)

## CK-104 [open] Cook: general
- Issue: Corn at 740x320: the six dressing bowls in two rows of three (Zafar, 15 Nov, decision 36: yes to two rows), every bowl and pill well inside the stone tray, the rows lined up and centred, the gap between the rows closed up (Zafar, 15 Nov: "the two rows don't fit properly and don't line up nicely. All the pills and all the bowls need to be fitting well within the stone tray and be aligned properly ... The pills go over the edge. The spacing between the two rows is too big ... That all just needs like nicely centering and aligning")
- Check: auto: corn at L1-L4, 740x320 and 930x430 (every bowl and pill inside the tray's inner edge with a margin; the two rows' centres on one line per column; the rows' gap no more than a pill's height)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-104.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-104.md
- Panel A: cook:corn#speed1 L1 740x320 [p-fresh] · shot at every life:corn-screen (2)
- Panel B: cook:corn@L4#speed1 L4 740x320 [p-fresh] · shot at every life:corn-screen (2)

## CHAI-58 [open] Easy to play (Sprint 11)
- Issue: The new boil (CHAI-57) is tight at L4: at a child's pace the green plus the red lasts about 3 s, and a miss empties the pan and starts it again; a child busy with another pan may boil over often (the builder's note, 1 Nov)
- Check: auto: the green's length at L4, measured at speed 1, 2 s (±0.1) · eye: chai L4 at 1280x665
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-58.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-58.md
- Panel A: cook:chai-tray#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- Panel B: cook:chai-tray#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)

## CHAI-65 [open] Easy to play (Sprint 11)
- Issue: "the face is next to the tea. I think we should put them at the corners. So for the top left glass, put it in the top left corner. For the top right glass, put it in the top right corner. Bottom right glass, bottom right corner. Bottom left glass, bottom left corner. There's a bit of natural space there": each tray face in its glass's corner (replaces CHAI-18's place)
- Check: auto: chai L1-L4 (1-4 glasses) at the four sizes: each face in its glass's corner, clear of every glass
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-65.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-65-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-65.md
- Panel A: cook:chai-tray@L2#speed1 L2 1280x665 [p-fresh] · crop:#game at every onboard (6)
- Panel B: cook:chai-tray@L2#speed1 L2 740x320 [p-fresh] · crop:#game at every onboard (5)

## CHAI-110 [open] Easy to play (Sprint 11)
- Issue: Level 4's half and full: the first order is always a half glass (half pours, half stays in the pan, it ticks); the second is a full glass, and after its first tap the light goes on the glass and stays until the second tap fills it. Reverses his earlier rule (a full glass first, then a half) (Zafar, 11 Nov evening (child play-test): "it wasn't clear the first time they played on level 4 that you need to tap the glass twice to fill it fully ... I earlier said that we should always do a full glass as the first order and then a half glass as the second order. Actually, I think that logic needs to be reversed. So the first order should always be a half glass ... for the second order, when you have to put whole, the onboarding should kick in after you've tapped it for the first time. Then the light should go on the glass, and it should force you to tap the glass a second time"; "refilling the half wasn't clear to me") Corrected (Zafar, 11 Nov night), this wins over the half-first wording above: "the first order has to be full, and the second order has to be half. That must happen the first time you play level 4 when you first get introduced to the word moment. And when you're doing the first order, you don't get any onboarding ... You press the glass, it pours half, the tea pan goes back on the stove, then you get onboarding that highlights the glass again. So you have to tap the glass again, and then it comes back and pours the other half to make it full. That way you've learned, oh, doing it twice makes it full, therefore doing it once must be half. And then after that we carry on as normal." So: on the first L4 round only, order 1 full (no light before the first tap; after the half pour and the pan back on the stove, the glass's light until the second tap), order 2 half; later rounds as normal. His "count to three" worry is withdrawn: "If the child keeps tapping, they'll get the half pour wrong every time. So they will have to learn" (the glass still ticks the moment it holds what was asked, CHAI-54).
- Check: auto: chai L4 fresh at the four sizes (the first order half; the glass light after the first tap of the full one, held until the second)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-110.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-110-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-110.md
- Panel A: cook:chai-tray@L4#speed1 L4 1280x665 [p-fresh] · crop:#game at every onboard (5)
- Panel B: cook:chai-tray@L4#speed1 L4 740x320 [p-fresh] · crop:#game at every onboard (7)

## CK-83 [open] Sprint 12 polish: Zafar's voice notes (22 Oct) > Shared, every game
- Issue: Chaat: Nani's box in the chop stage has her face and one step, not two sentences; the bowl fills gradually, not in one step; the chop light ready when the tomato is (not 0.9 s before it, rising from under the screen) and off the side panel; no chip under the settings gear; the end review includes hakro (the eye judge, 10 Nov)
- Check: auto: chaat L1-L4 at the four sizes
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-83.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-83.md
- Panel A: cook:chaat#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (3)
- Panel B: cook:chaat#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (2)

## CK-84 [open] Sprint 12 polish: Zafar's voice notes (22 Oct) > Shared, every game
- Issue: Baking: the mixing bowl never on the khun jar, its light only on the bowl; the order card's rows whole at 740x320; atto and khun told apart by their picture, not only their pill (waiting on its redraws); one gold thing at a time (the order headline lit with the bowl) (the eye judge, 10 Nov)
- Check: auto: baking L1-L4 at the four sizes
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-84.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CK-84.md
- Panel A: cook:baking#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- Panel B: cook:baking#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)


<!-- source: f68c230 origin/run16/probes-built:build/screenshots/evidence/r16pb-cook/judge/batch-04.md -->
