# Evidence batch-03 (layout, 10 rows) · run r16pb-cook

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes (probes-built).

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in /home/user/nani-jo-ghar/build/reports/run16/judge/probes-built/r16pb-cook/batch-03.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## DAAR-03 [reopened] Cook: daar
- Issue: Stir shows speed and laps (speed dial, laps as Kutchi word) · told again 9 Nov (his tester): "I think those were the three. Oh, and I think the stir for Dar, sad. I really like the stirring mechanism. She just loves stirring it around. So I think we need to make it clearer, like, the number of times you're stirring it."
- Check: auto: daar and stir at L1, L2, L3 and L4: each lap adds its mark within 300 ms of the flag; eye: at 930x430 the count readable at a glance
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/DAAR-03.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/DAAR-03.md
- Panel A: cook:stir L1 1366x768 [p-seen] · stir-mid: the screen, #stage outlined
- Panel B: cook:stir L1 1366x768 [p-seen] · crop:#stage at rec:stir-mid
- Panel C: cook:stir@L2 L2 1366x768 [p-seen] · stir-mid: the screen, #stage outlined
- Panel D: cook:stir@L2 L2 1366x768 [p-seen] · crop:#stage at rec:stir-mid

## DAAR-46 [open] Cook: daar
- Issue: The stir never stops the child; its first time better (Zafar, 9 Nov, his tester: "And maybe it stops you. Actually, is that a good idea? Maybe it stops you if you stir it. No. But I think the onboarding for that needs to be better. It shouldn't stop you, because then people will just do it around until it stops them. And the game's done.")
- Check: auto: daar and stir at L1, L2, L3 and L4: stirring past the count goes on until the child stops; a stop under or over the count is redone; the first time's light gone as the stir starts (SH-236)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/DAAR-46.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/DAAR-46.md
- Panel A: cook:daar#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- Panel B: cook:daar#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)

## SEK-25 [open] Cook: sekelo
- Issue: Four item cards per skewer, one per piece (Zafar, 8 Nov: "in the order card we have to have four items ... the items that go on each skewer even if it's four of the same thing and they get ticked off as you put them on ... firstly it makes you know that you've done something correct when you've put something on because otherwise you have to put four on before you even know if you're doing the right thing ... secondly it's ... consistent ... you always have four for a skewer and ... separate the names of the items that go on the skewer from the overall order ... the item you put on isn't Mishkaki the item you put on is gos like meat or it would be chicken ... the item card just say gos gos gos gos or chicken chicken chicken chicken"; "for now ... ensure that each order of a skewer just has the four individual items ... four individual ... item cards within one order")
- Check: auto: sekelo at L1, L2, L3 and L4: four cards per skewer, each ticked within 500 ms of its piece going on
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SEK-25.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SEK-25.md
- Panel A: cook:mishkaki-grill@L3 L3 1280x665 [p-seen] · kind-timing: the screen, #side outlined
- Panel B: cook:mishkaki-grill@L3 L3 1280x665 [p-seen] · crop:#side at rec:kind-timing

## SEK-26 [open] Cook: sekelo
- Issue: Sekelo's grill screen on the new art and as the mock (sources/art/s19-mocks2/results/A1-sekelo-2-improved.png): the new top-down grill (kit/grill-v2, not sekelo/rack-t), the trays deep enough to hold skewers (not the flat serving tray stretched), the skewer as long as the grill is deep, its handle resting on the grill's bottom edge and its metal tip on the top edge; the new skewer (v4/sekelo/skewer-empty) on the board and the grill (Zafar, 12 Nov night (the s19-clean-c frames): "This doesn't look like the new top-down barbecue. Why did the trays next to the barbecue look super shallow, like they wouldn't be able to hold skewers in them? The skewer on the barbecue is tiny. It should have its handle resting on the bottom edge of the bottom barbecue and the top metal tip resting on the top edge of the barbecue, like we did in our mock-ups that we then sent to ChatGPT. We should also be using the new skewer")
- Check: auto: sekelo L1-L4 at the four sizes (the skewer's length against the grill's depth; v4 art loaded); eye: beside the mock
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SEK-26.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SEK-26.md
- Panel A: cook:mishkaki-grill#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (2)
- Panel B: cook:mishkaki-grill#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (3)

## SAM-30 [open] Cook: samosa
- Issue: Samosa's fry has its first time: "there was no onboarding for the samosas especially when it came to placing them into the frying pan nothing told me or showed me how to place them into the frying pan" (Zafar, 8 Nov)
- Check: auto: samosa at L1, L2, L3 and L4 as a new player: the dim and the box on a samosa and the pan, then on the lift
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-30.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-30-2.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-30-3.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-30.md
- Panel A: cook:samosa L1 1280x665 [p-fresh] · shot at exp:samosa
- Panel B: cook:samosa L1 740x320 [p-fresh] · shot at exp:samosa
- Panel C: cook:samosa@L2 L2 1280x665 [p-fresh] · shot at exp:samosa
- Panel D: cook:samosa@L2 L2 740x320 [p-fresh] · shot at exp:samosa
- Panel E: cook:samosa@L3 L3 1280x665 [p-fresh] · shot at exp:samosa
- Panel F: cook:samosa@L3 L3 740x320 [p-fresh] · shot at exp:samosa
- Panel G: cook:samosa@L4 L4 1280x665 [p-fresh] · shot at exp:samosa
- Panel H: cook:samosa@L4 L4 740x320 [p-fresh] · shot at exp:samosa
- Panel I: cook:samosa L1 1280x665 [p-fresh] · shot at exp:lift
- Panel J: cook:samosa@L2 L2 1280x665 [p-fresh] · shot at exp:lift
- Panel K: cook:samosa@L3 L3 1280x665 [p-fresh] · shot at exp:lift
- Panel L: cook:samosa@L4 L4 1280x665 [p-fresh] · shot at exp:lift

## SAM-34 [open] Cook: samosa
- Issue: Samosa's fry from mocks 2 and 31 (Zafar, 9 Nov: "31 looks really good, I think, for the frying. I don't know why. I don't know how it's any different to what we have. But anyway, it looks nice. As does number 2. Number 2 looks really nice as well. Maybe part of it's the frying animation. Obviously, we can't have all of this looking that realistic. We can have the samosas looking realistic as they fry, but they need circles around them to tap and that kind of stuff, don't they? But yeah, it just looks nice. I like how it goes on the plate in number 2. It looks good. I like kind of the placement. I think maybe I like 2 better. I don't know. I like maybe the tray element number 2, but then obviously we'll have tray and tray. A bottom tray with items. Actually, no, because for the frying, you'll just have the items ready to fry, won't you? So, but I guess they might be on the bottom tray as well. So you already have a walnut tray, so maybe don't have a serving tray, just have the plate. The plate can be a bit bigger. I actually like the tissue for the handle as well. I think it looks kind of nice. And the spoon looks good as well, actually.") · told again 9 Nov, round 2: "we need a button to turn on the fryer ... the button's off to the left-hand side, so that the frying pan can remain bigger"; "I do like the ... utensil you use for the samosas ... it rests on a cloth ... keep that ... I like that style of like wood and metal"
- Check: eye: samosa's fry at L1, L2, L3 and L4 at the four sizes, beside mock 2
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-34.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-34-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-34.md
- Panel A: cook:samosa#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (7)
- Panel B: cook:samosa#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (7)

## SAM-36 [open] Cook: samosa
- Issue: The served tray shows as many samosas as were ordered: "ba samosa" is two on the tray (the S19 gate's eye judge, 12 Nov: "three samosas are served for an order of two")
- Check: auto: samosa at L1, L2, L3 and L4, 740x320 and 1280x665 (the served tray holds the ordered count)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-36.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-36-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/SAM-36.md
- Panel A: cook:samosa L1 1280x665 [p-fresh] · served: the screen, #game outlined
- Panel B: cook:samosa L1 1280x665 [p-fresh] · crop:#game at life:serve-trays
- Panel C: cook:samosa L1 740x320 [p-fresh] · served: the screen, #game outlined
- Panel D: cook:samosa L1 740x320 [p-fresh] · crop:#game at life:serve-trays
- Panel E: cook:samosa@L2 L2 1280x665 [p-fresh] · served: the screen, #game outlined
- Panel F: cook:samosa@L2 L2 1280x665 [p-fresh] · crop:#game at life:serve-trays
- Panel G: cook:samosa@L2 L2 740x320 [p-fresh] · served: the screen, #game outlined
- Panel H: cook:samosa@L2 L2 740x320 [p-fresh] · crop:#game at life:serve-trays

## MAA-23 [open] Cook: maani
- Issue: Big and small taught by a word moment (Zafar, 9 Nov, maani: "Then when the level arrives where we introduce big and small, we use that as the word focus, and we show the Marnie being rolled small, and then there'll be then you put a kind of dashed smaller line and a dashed small circle and a dashed big circle, and it shows the Marnie being rolled small and the Marnie being rolled big, and there'll be the words nindo and waddo, like the catchy words for big and small. And maybe the words would be small Marnie, big Marnie. I don't know whether you have to specify that, or figure it out. But yeah, and then after you've seen that, then the dash lines come on all the games, and you've kind of been shown it. So that would be the right time to do that.")
- Check: auto: maani at L1, L2, L3 and L4 as a new player: no ring before the lesson's level, the lesson once at it (its lines from the engine only), the rings on after it, in every round of the games his answer names
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-2.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-3.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-4.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-5.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-6.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-7.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-8.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-9.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-10.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-11.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-12.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-13.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-14.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-15.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-16.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23-17.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/MAA-23.md
- Panel A: cook:maani-line#speed1 L1 1280x665 [p-fresh] · crop:#game at every line:cook (9)
- Panel B: cook:maani-line#speed1 L1 740x320 [p-fresh] · crop:#game at every line:cook (10)
- Panel C: cook:maani-line@L2#speed1 L2 1280x665 [p-fresh] · crop:#game at every line:cook (15)
- Panel D: cook:maani-line@L2#speed1 L2 740x320 [p-fresh] · crop:#game at every line:cook (16)
- Panel E: cook:maani-line@L3#speed1 L3 1280x665 [p-fresh] · crop:#game at every line:cook (15)
- Panel F: cook:maani-line@L3#speed1 L3 740x320 [p-fresh] · crop:#game at every line:cook (15)
- Panel G: cook:maani-line@L4#speed1 L4 1280x665 [p-fresh] · crop:#game at every line:cook (16)
- Panel H: cook:maani-line@L4#speed1 L4 740x320 [p-fresh] · crop:#game at every line:cook (16)

## CHT-13 [open] Cook: chaat
- Issue: "Artwork for all the items that can go inside the bowl ... it doesn't really work"; "redraw the bowl so it's exactly side-on ... a horizontal strip ... So let's do that, unless you have any qualms" · told again 9 Nov, changed: "And then chart. Yeah, we went back and forth with this because I think image 23 looks lovely with the things around it, but nope. Let's put the items on the side. I think maybe we go top down for chart. Fine. Like, I did get ChatGPT to mock up a side on view image. Actually, I'll paste it in just for your reference, just so you can give me an opinion on it. But I think this game mode's evolved a bit. Before, like, you would put in the whole sequence, and then it would tell you if you were wrong. And I don't know, it seemed quite important to see it like layer up. I don't know why. It just, at the time, it seemed more important and stuff. Now I think the game's less about that. I don't know what the game is about now, really. It's just a sequence game, isn't it? And a chance maybe to learn about specific sources and Sev and things you don't get elsewhere. So it's still a good game mode. Top down, I think, looks better. Opaque bowl looks better than the glass bowl."
- Check: eye: chaat at L1, L2, L3 and L4 at the four sizes, every item in the bowl
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHT-13.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHT-13-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHT-13.md
- Panel A: cook:chaat#speed1 L1 1280x665 [p-fresh] · view-marble: the screen, #game outlined
- Panel B: cook:chaat#speed1 L1 1280x665 [p-fresh] · crop:#game at rec:view-marble
- Panel C: cook:chaat#speed1 L1 740x320 [p-fresh] · view-marble: the screen, #game outlined
- Panel D: cook:chaat#speed1 L1 740x320 [p-fresh] · crop:#game at rec:view-marble
- Panel E: cook:chaat@L2#speed1 L2 1280x665 [p-fresh] · view-service: the screen, #game outlined
- Panel F: cook:chaat@L2#speed1 L2 1280x665 [p-fresh] · crop:#game at rec:view-service
- Panel G: cook:chaat@L2#speed1 L2 740x320 [p-fresh] · view-service: the screen, #game outlined
- Panel H: cook:chaat@L2#speed1 L2 740x320 [p-fresh] · crop:#game at rec:view-service

## CHT-18 [open] Cook: chaat
- Issue: Chaat's first time with the dim and the lit box (Zafar, 8 Nov: "the onboarding for chaat ... Nani only has a drop down but the onboarding is ... there's no dark shadows or anything like that highlight box")
- Check: auto: chaat at L1, L2, L3 and L4 as a new player: the dim and the lit box on the first topping and each next
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHT-18.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHT-18-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHT-18.md
- Panel A: cook:chaat L1 1280x665 [p-fresh] · shot at rec:kind-tap
- Panel B: cook:chaat L1 740x320 [p-fresh] · shot at rec:kind-tap
- Panel C: cook:chaat@L2 L2 1280x665 [p-fresh] · shot at rec:kind-tap
- Panel D: cook:chaat@L2 L2 740x320 [p-fresh] · shot at rec:kind-tap
- Panel E: cook:chaat@L3 L3 1280x665 [p-fresh] · shot at rec:kind-tap
- Panel F: cook:chaat@L3 L3 740x320 [p-fresh] · shot at rec:kind-tap
- Panel G: cook:chaat@L4 L4 1280x665 [p-fresh] · shot at rec:kind-tap
- Panel H: cook:chaat@L4 L4 740x320 [p-fresh] · shot at rec:kind-tap


<!-- source: a1b11b9 origin/run16/probes-built:build/screenshots/evidence/r16pb-cook/judge/batch-03.md -->
