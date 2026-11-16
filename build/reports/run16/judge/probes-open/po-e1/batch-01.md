# Evidence batch-01 (layout, 3 rows) · run po-e1

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes.

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in /home/user/nani-jo-ghar/build/reports/run16/judge/probes-open/po-e1/batch-01.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## SH-279 [open] Shared components > Layout and stage
- Issue: At well done the Shabash bubble sits clear of the props and inside the frame, to the right of the face as chai's. Seen over the spoon (samosa), tiny and left of Nana (chaat), a few pixels from the right edge and on the tray's corner (maani at 740) (the S19 gate's eye judge, 12 Nov: "the 'Shabash!' bubble covers the head of the slotted spoon")
- Check: auto: every kitchen game, L1-L4 at 740x320 and 1280x665 (its check to build)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-open/build/screenshots/evidence/po-e1/SH-279.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-open/build/screenshots/evidence/po-e1/SH-279.md
- Panel A: cook:samosa L1 1280x665 [p-seen] · shot at life:serve-trays
- Panel B: cook:samosa L1 740x320 [p-seen] · shot at life:serve-trays
- Panel C: cook:maani-line L1 740x320 [p-seen] · shot at life:serve-trays
- Panel D: cook:chaat L1 740x320 [p-seen] · shot at life:serve-trays

## SH-303 [open] Shared components > Layout and stage
- Issue: One kitchen scene for the delivery and well done, as chai's: "you're using two different kitchen scenes for the delivery, use just one (same as chai) and I'll figure out kitchen artwork and ordering artwork later" (eggs' well done at the dining table with the cat goes; the kitchen and order art are rethought after all the kitchen games). Every game
- Check: auto: the well done and serve in chai's kitchen scene, every game at L1 and L4
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-open/build/screenshots/evidence/po-e1/SH-303.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-open/build/screenshots/evidence/po-e1/SH-303.md
- Panel A: cook:eggs@L4 L4 740x320 [p-seen] · shot at life:serve-trays
- Panel B: cook:baking L1 740x320 [p-seen] · shot at life:serve-trays

## CK-93 [open] Cook: general
- Issue: Eggs: well done stays in the kitchen of the serve, on the worktop, with Nana's face beside the plate and a "Shabash!" bubble. Today it cuts to a different room with a cat and no bubble (the S19 gate's eye judge, 12 Nov: "an arched-window kitchen with a cat, two empty trays and Nana with no bubble")
- Check: auto: eggs at L1, L2, L3 and L4, 740x320 and 1280x665 (the praise picture matches the serve's scene)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-open/build/screenshots/evidence/po-e1/CK-93.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-open/build/screenshots/evidence/po-e1/CK-93.md
- Panel A: cook:eggs L1 1280x665 [p-seen] · shot at life:serve-trays
- Panel B: cook:eggs L1 740x320 [p-seen] · shot at life:serve-trays
- Panel C: cook:eggs@L4 L4 1280x665 [p-seen] · shot at life:serve-trays
- Panel D: cook:eggs@L4 L4 740x320 [p-seen] · shot at life:serve-trays


<!-- source: f25457b origin/run16/probes-open:build/screenshots/evidence/po-e1/judge/batch-01.md -->
