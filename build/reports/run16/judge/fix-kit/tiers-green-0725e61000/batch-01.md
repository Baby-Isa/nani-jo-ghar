# Evidence batch-01 (layout, 1 rows) · run tiers-green-0725e61000

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes.

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in /home/user/nani-jo-ghar/build/reports/run16/judge/fix-kit/tiers-green-0725e61000/batch-01.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## SH-267 [open] Sprint 12 polish: Zafar's voice notes (22 Oct) > Shared, every game
- Issue: Every kitchen game: as the customer says the dish ("I want tea", "I want two samosas"), the dish's card flashes up with its count (one cup of tea, two samosas) so the child sees what it is; it does not join the order card (Zafar, 12 Nov night (the s19-clean-c frames): "I think maybe we should implement this for all the games. When they're ordering ... when they say the first sentence ... it should show that item card. It doesn't need to then go into the order card, but it should flash up so they know what it is. And it should say ... 1 cup of tea, 2 samosas") Zafar, 12 Nov: "Yes to decision on only at level 1" (at L1 only: from L2 the card would give the order away). Zafar, 12 Nov morning: "speaking of the pop up card during the spoken sentence, we should ensure we have the correct version of milk or no-milk tea on the image" (the dish card's picture matches the order: milk tea, or black tea for kari chai). And: "do we have some orders for mori chai (tea without sugar) and Khari chai (tea without milk) spoken like that in the order sentence? We should and it would be called that in the pop up order cards" (the engine has kari chai and mori chai, Mum's words, grammar-notes §10, not yet recorded; named orders come from L3 today).
- Check: auto: contract-119 dish-flash (as a customer says the dish, its card up beside their bubble at L1; never at L2-L4)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/fix-kit/build/screenshots/evidence/tiers-green-0725e61000/SH-267.png and /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/fix-kit/build/screenshots/evidence/tiers-green-0725e61000/SH-267-2.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/fix-kit/build/screenshots/evidence/tiers-green-0725e61000/SH-267.md
- Panel A: cook:chai-tray L1 1280x665 [p-fresh] · shot at life:dish-flash
- Panel B: cook:chai-tray L1 740x320 [p-fresh] · shot at life:dish-flash
- Panel C: cook:chop#speed1 L1 1280x665 [p-fresh] · crop:#stage at every bubble (2)
- Panel D: cook:chop#speed1 L1 740x320 [p-fresh] · crop:#stage at every bubble (2)
- Panel E: cook:chop@L2#speed1 L2 1280x665 [p-fresh] · crop:#stage at every bubble (2)
- Panel F: cook:chop@L2#speed1 L2 740x320 [p-fresh] · crop:#stage at every bubble (2)


<!-- source: 150d8c8 origin/run16/fix-kit:build/screenshots/evidence/tiers-green-0725e61000/judge/batch-01.md -->
