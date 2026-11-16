# Evidence batch-07 (text, 1 rows) · run r16pb-cook

You are the reviewer for Nani jo Ghar's evidence loop (decision 82). You are not the session that built these changes (probes-built).

For each row: read its sheet (PNG, if it has one: its panels are labelled A-D, or up to A-L over two sheets for a row with more probes: read both; the labels repeated below) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Judge against the row's own words (Zafar's feedback), nothing else. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87): never flag them as English. A line shown as grey-italic English with the hidden to-record tag is allowed (decision 84): it is not an English leak and not a missing clip; only its absence from Mum's list is a gap.
1. Flaws first: anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
2. Then one line in /home/user/nani-jo-ghar/build/reports/run16/judge/probes-built/r16pb-cook/batch-07.verdicts.md:
   `ID | PASS: <panel>, <what that panel shows that proves it>` e.g. `CLN-100 | PASS: A, L3 wrap crosses the kneecap, 6 turns`
   `ID | FAIL: <panel>, <what is wrong>`
   `ID | EVIDENCE: <what the sheet is missing>` only when the sheet does not show the row's state at all (it goes to the tool owner, never to the list as a FAIL).
   A PASS that names no panel is refused. A text-only row (Sheet: (text only)) names its text capture instead, by its label in the .md: `SH-45 | PASS: SH-45-p1-L1-1280x665 dom, the line reads ...` (or `PASS: text, ...`); a script capture by the command printed after its `####` heading: `LNG-04 | PASS: grep -n -i "ph-turner" data/lang/reports/gap-list.md, the placeholder is on Mum's list`. Sound quality and feel are not yours: say so in a FAIL only when the row is about what you can read (which clip, when, in what order).
3. First line of the verdict file: `judge: <your model and session>`.

## CHAI-57 [open] Cook: chai
- Issue: "The only other thing is there's no consequence, seemingly, for undercooking or overcooking the chai ... I think if I overcook this, it just like bubble over and empties, and you just have to start that pot again ... I would like the feedback to be instant though, like before you pour it ... Maybe it just doesn't let you click it too early. That's a simple solution, right? It just shakes and says no, basically. And the timer keeps going until it hits the green. Well, yeah, it keeps going until you click it when it's in the green. And if you click it in the red after the green, then it overboils and you have to start again. That's a simple mechanism ... At least for now, implement that as code ... the mechanic of it, not the visuals of it": too early, the knob shakes and Nani says no while the heat runs on; in the green it turns down; in the red it boils over and that pot starts again
- Check: auto: chai at L1, L2, L3 and L4, each pan: a tap before the green (shake, the heat runs on), in the green (turned down), in the red (boils over, the pot empty and its rows open)
- Sheet: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-57.png
- Text: /tmp/claude-0/-home-user-nani-jo-ghar/2ae76d24-4b70-5de4-b8eb-9c3899420d59/scratchpad/wt/probes-built/build/screenshots/evidence/r16pb-cook/CHAI-57.md
- Panel A: cook:chai-tray@L2 L2 1280x665 [p-seen] · shot at cook-done:timing
- Panel B: cook:chai-tray@L3 L3 1280x665 [p-seen] · shot at cook-done:timing


<!-- source: 6a29e44 origin/run16/probes-built:build/screenshots/evidence/r16pb-cook/judge/batch-07.md -->
