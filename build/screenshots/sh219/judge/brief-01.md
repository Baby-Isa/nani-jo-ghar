# Batch brief-01: SH-219 again, pills that fit their word (6 Nov overnight)

Verdict file: build/screenshots/sh219/judge/brief-01.verdicts.md

Each sheet stacks BEFORE (red label) above AFTER (green label) for the same size and level: the chai shelf band (the jars and the word pills under them). Pairs top to bottom are A, B, C ... in each sheet. "pill-miss" crops are a seeded returning player (same moment). Measurements (word size on screen in CSS px, the closest gap between two pills) are in the table below, from build/tools/review/pillcheck.mjs.

## SH-219
Issue (Zafar, 6 Nov): "the text in the pills and the speaker button next to the pills are super small on mobile ... It should follow some logic or principle or scaling rule or minimum ... so the solution works nicely as a rule for all screens." Then (6 Nov 01:40): pills that fit their word, "do it now for chai so no surprises later": each pill as wide as its own word (a speaker-only pill narrower) so a crowded row can grow its words towards the 13 CSS px floor; at most 1.5x; never touching.
Check: in each AFTER, every pill's card hugs its word (narrower for short words), no two pills touch (a clear gap between every pair), no word clipped, ellipsised or overlapping its speaker icon, the pills sit centred under their jars and do not overlap the jars; and the words are no smaller than BEFORE at the same size and level (larger where the table says so). Flaws first, anywhere on the crops.
Sheets: build/screenshots/sh219/sheet-740x320.png, build/screenshots/sh219/sheet-930x430.png, build/screenshots/sh219/sheet-971x318.png, build/screenshots/sh219/sheet-1280x665.png, build/screenshots/sh219/sheet-1920x1080.png

| size | level | word px before | word px after | closest gap before | after |
|---|---|---|---|---|---|
| 740x320 | L1 / L2 | 12.1 | 12.1 (held by the 1.5x cap) | 3.9 | 5 |
| 740x320 | L3 | 10.9 | 12.1 | 3.9 | 5 |
| 740x320 | L4 | 8.6 | 9.6 | 3.9 | 5 |
| 930x430 | L4 | 11.7 | 13.0 | 5.3 | 5.3 |
| 971x318 | L1-L4 | 13 / 12.9 at L4 | 13 | 4.2 | 5 |
| 1280x665 | L1-L4 | 14.6 | 14.6 | 7.9 at L4 | 17.9 |
| 1920x1080 | L1-L4 | 23.6 | 23.6 | 12.8 at L4 | 28.9 |
