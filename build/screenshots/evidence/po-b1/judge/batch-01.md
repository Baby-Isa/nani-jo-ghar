# Evidence batch-01 (detail, 2 rows) · run po-b1

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes.

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in build/screenshots/evidence/po-b1/judge/batch-01.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## SH-295 [open] Shared components > Layout and stage
- Issue: An order card's line wraps only when it must: "the lines that wrap look like they wrap too early (seems like there's space to write 'chai' on the first line)" (chai's served cards, "Muke elchi waari / chai khapeti."). Every game
- Check: auto: a wrap rule: a line breaks only where the next word does not fit, every game at four sizes
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-295.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-295.md
- Panel A: cook:chai-tray@L4 L4 1280x665 [p-seen_x2] · zoom2:#mission at rec:order-card-in-sidebar
- Panel B: cook:chai-tray@L4 L4 740x320 [p-seen_x2] · zoom2:#mission at rec:order-card-in-sidebar

## SH-301 [open] Shared components > Layout and stage
- Issue: Nani's face circle and speaker circle the same size and alignment as the order cards' faces and speakers: "Nani's face circle and speaker circle seem not to be the same size and/or alignment with the faces and speakers in the order cards but they should be (keep order card faces, move Nani's)". Every game
- Check: auto: the box rules: Nani's face and speaker boxes equal to the order cards' within 1 px, at four sizes
- Sheet: /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-301.png
- Text: /home/user/nani-jo-ghar/build/screenshots/evidence/po-b1/SH-301.md
- Panel A: cook:chai-tray L1 1280x665 [p-seen_x2] · zoom2:#side at rec:order-card-in-sidebar
- Panel B: cook:chai-tray L1 1920x1080 [p-seen_x2] · zoom2:#side at rec:order-card-in-sidebar
- Panel C: cook:chai-tray L1 740x320 [p-seen_x2] · zoom2:#side at rec:order-card-in-sidebar
- Panel D: cook:chai-tray L1 930x430 [p-seen_x2] · zoom2:#side at rec:order-card-in-sidebar

