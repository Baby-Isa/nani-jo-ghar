# Evidence batch-02 (layout, 10 rows) · run r16pb-newcook

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes (probes-built).

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in /home/user/nani-jo-ghar/build/reports/run16/judge/probes-built/r16pb-newcook/batch-02.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## SH-159 [open] Shared components > Layout and stage
- Issue: "If you get the word correct three times in a row the kutchi goes and it's speaker only. If you then get the word wrong, the kutchi comes back, but only until you get the word correct again (once)": the item's word pill
- Check: auto: unit tests of the rule; chai with a scripted save (three right, then a miss, then one right)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/SH-159.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/SH-159.md
- Panel A: cook:chai-tray L1 930x430 [p-seen] · view-marble: the screen, #stage outlined
- Panel B: cook:chai-tray L1 930x430 [p-seen] · crop:#stage at rec:view-marble
- Panel C: cook:chai-tray L1 930x430 [p-pill-hidden] · crop:#stage at rec:view-marble
- Panel D: cook:chai-tray L1 930x430 [p-pill-miss] · crop:#stage at rec:view-marble

## DAAR-54 [open] Cook: daar
- Issue: Daar and chop: each thing on the board in its own place, nothing over another, nothing off the board (L4 1280x665 mid-cook: a whole potato on the cut onion halves and over the board's corner, the chilli half off the board, garlic piles on the marble; 740x320: a whole tomato on its own slices, speck-sized piles at the board's edge)
- Check: auto: daar L1-L4 and chop L1-L4, four sizes: every board item's box inside the board, no two overlapping beyond a cut item's own pieces
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-54.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-54-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-54.md
- Panel A: cook:daar L1 740x320 [p-seen] · crop:#stage at every placed (2)
- Panel B: cook:daar@L4 L4 740x320 [p-seen] · crop:#stage at every placed (2)
- Panel C: cook:chop L1 740x320 [p-seen] · crop:#stage at every placed (2)
- Panel D: cook:chop@L4 L4 740x320 [p-seen] · crop:#stage at every placed (2)

## DAAR-57 [open] Cook: daar
- Issue: Nani's box keeps her face and speaker in the chop step, as chai's in every state (her face moves onto the order card beside 'Chop these.' and is back in her box for the spice step)
- Check: auto: chop and daar L1-L4, four sizes: Nani's face and speaker in her box in every state
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-57.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-57.md
- Panel A: cook:daar L1 740x320 [p-seen] · crop:#side at every step (3)
- Panel B: cook:daar@L4 L4 740x320 [p-seen] · crop:#side at every step (3)

## DAAR-61 [open] Cook: daar
- Issue: Chop on its own: the serve shows the chopped dish on a centred tray with the asker's thank-you, as chai's (today the tray is empty, pushed left, no thank-you; a bowl shows only later, half behind the end card)
- Check: auto: chop L1-L4, four sizes, at the serve: the dish on the tray, the tray centred under its person, the thank-you bubble
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-61.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/DAAR-61.md
- Panel A: cook:chop L1 740x320 [p-seen] · shot at life:serve-trays
- Panel B: cook:chop@L4 L4 740x320 [p-seen] · shot at life:serve-trays

## SAM-43 [open] Cook: samosa
- Issue: Samosa's waiting pastry waits whole at its true size, clear of the board's rim (today a thumbnail with a dot of mince hanging over the board's lower edge)
- Check: auto: samosa L1-L4, four sizes, mid-cook: the waiting pastry at the working pastry's size, inside the play area, off the board's rim
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/SAM-43.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/SAM-43.md
- Panel A: cook:samosa L1 740x320 [p-seen] · crop:#stage at every placed (2)
- Panel B: cook:samosa@L4 L4 740x320 [p-seen] · crop:#stage at every placed (2)

## MAA-26 [open] Cook: maani
- Issue: Maani: every plate cooked reaches the serve, each as cooked (L4 1280x665: two plates cooked, the plain big one and the two small bajr ones; one plate of pale maani served, the dark bajr maani missing), as chai's glasses each reach their tray
- Check: auto: maani L1-L4, four sizes, at the serve: one served plate per cooked plate, each showing its own maani (bajr dark)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/MAA-26.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/MAA-26.md
- Panel A: cook:maani-line L1 740x320 [p-seen] · shot at life:serve-trays
- Panel B: cook:maani-line@L4 L4 740x320 [p-seen] · shot at life:serve-trays

## MAA-27 [open] Cook: maani
- Issue: Maani: the plates' face circles chai's size (740x320 mid-cook: about half chai's)
- Check: auto: maani L1-L4, four sizes: the plate's face circle the size of chai's tray face circle
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/MAA-27.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/MAA-27.md
- Panel A: cook:maani-line L1 740x320 [p-seen] · shot at cook-done:click
- Panel B: cook:maani-line@L4 L4 740x320 [p-seen] · shot at cook-done:click
- Panel C: cook:chai-tray@L4 L4 740x320 [p-seen] · shot at cook-done:click

## CK-117 [open] Cook: general
- Issue: Corn: the cob chopped (shorter and fatter, cut ends, no stem or tip) and standing upright the whole way: on the band (four in a row, no word pills: Zafar, 15 Nov, decision 36), on the grill, in the cooked tray (side by side, two by two when four; no stacking) and on the plate, so it never turns as it moves (Zafar, 15 Nov: "the current ones look too long and skinny. If we do it shorter and fatter and chopped at the ends, we can then actually rotate them to stand vertically and have 4 in a row ... then they don't have to change orientation when they go onto the barbecue or when they go onto the tray or the plate")
- Check: auto: corn at L1-L4, four sizes (the cob's angle the same on band, grill, tray and plate; no cob over another; every cob inside its band, grill, tray or plate)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-117.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-117.md
- Panel A: cook:corn L1 740x320 [p-seen] · crop:#stage at every placed (3)
- Panel B: cook:corn@L4 L4 740x320 [p-seen] · crop:#stage at every placed (3)

## CK-120 [open] Cook: general
- Issue: Eggs: a person's card head on one line where it fits, as chai's (L4 1280x665: 'Muke hakro bafelo indo / khapeto.' wraps while the same-length 'Muke hakro tarelo indo khapeto.' fits one line below it)
- Check: auto: eggs L1-L4, four sizes: a card head one line whenever its one-line width fits the card
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-120.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-120.md
- Panel A: cook:eggs@L4 L4 1280x665 [p-seen] · order-card-in-sidebar: the screen, #side outlined
- Panel B: cook:eggs@L4 L4 1280x665 [p-seen] · crop:#side at rec:order-card-in-sidebar
- Panel C: cook:eggs@L4 L4 740x320 [p-seen] · order-card-in-sidebar: the screen, #side outlined
- Panel D: cook:eggs@L4 L4 740x320 [p-seen] · crop:#side at rec:order-card-in-sidebar

## CK-122 [open] Cook: general
- Issue: Eggs: the egg in its pan or pot reads big, filling its vessel as chai's pots are filled (L4 mid-cook: the fried egg about a sixth of the pan's width, 14 px at 740x320)
- Check: auto: eggs L1-L4, four sizes, mid-cook: the egg's drawn width at least half its vessel's inner width
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-122.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-newcook/CK-122.md
- Panel A: cook:eggs L1 740x320 [p-seen] · crop:#stage at every placed (3)
- Panel B: cook:eggs@L4 L4 740x320 [p-seen] · crop:#stage at every placed (3)


<!-- source: 52c77dd origin/run16/probes-built:build/screenshots/evidence/r16pb-newcook/judge/batch-02.md -->
