# Evidence batch-03 (motion, 2 rows) · run po-b1

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes.

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in build/screenshots/evidence/po-b1/judge/batch-03.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## SH-280 [open] Shared components > Layout and stage
- Issue: Moving between stages glides, as chai's items fly. Seen: a bare frame then the oven and tray in one step, the tray teleporting into and out of the oven (baking); the tomato jumping shelf to board (chaat); six strips becoming two in one frame, a blank play area for a frame, the spoon popping in (samosa) (the S19 gate's eye judge, 12 Nov: "the tray jumps from the worktop into the oven in one frame")
- Check: auto: every kitchen game, L1-L4 at 740x320 and 1280x665 (its check to build)
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-280.png and /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-280-2.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-280.md
- Panel A: cook:baking L1 1280x665 [p-seen] · strip:#stage:4x200 at life:stage-start
- Panel B: cook:baking L1 1280x665 [p-seen] · strip:#stage:4x200 at life:stage-start

## SH-299 [open] Shared components > Layout and stage
- Issue: An item card's flight lands in its slot inside the side panel: at chai L4 740x320 aadu's card lands about 26 px past the panel's edge, because a redraw's timer pulls the order row back home mid-order (found by s20-step12-frame, 14 Nov: js/shared/order-card.js:545 and 577-600, a stale fold.want14). It never reaches a face. Every game with the order row
- Check: auto: a flight-lands check (the card's last frame inside its slot's row), every game at L1-L4, 740x320 and 1280x665
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-299.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-299.md
- Panel A: cook:chai-tray@L4 L4 740x320 [p-seen] · strip:#side:4x150 at life:popup-fold

