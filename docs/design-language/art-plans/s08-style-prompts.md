# s08 style prompts: the doctor into the house style (pack `s08`)

**Written:** 16 Oct 2026, by the style judge, from Zafar's words of 16 Oct ("the girl and doctor look like different game artwork styles … create a ChatGPT prompt to fix the out of style ones but wait for my go ahead first"). **Status:** a proposal; **nothing runs until he says go.** The judgement behind it: `build/reports/s07-style-judge.md`. Rules: `CLAUDE.md` 13 (he runs it; Claude judges, cuts, wires) and 16; the doctor is a real person, so **he approves every picture**.

## 1. The trade-off, plainly

- The doctor's pictures are one level more real than Nani and two more than the girl. The rest of the game (family, patients, rooms, items, the bible §1) is the girl's level.
- A real person's likeness lives in face shape, glasses, beard, hair line, build and clothes. Nani's run proved where it breaks: her N1 ("render like Nana, not more photographic than him") kept the semblance; the cartoonier tries lost it (Zafar, 15 Oct: "the rest are too cartoony and lose the semblance").
- So the choice is: **(a) the girl's level** (the cleanest match, but ChatGPT redraws the face and the semblance goes, as it did for Nani), or **(b) Nani's level** (smooth simple skin, no pores or weave, eyes a little larger, forms rounder, a man of his age still; Nana as the ceiling). **(b) is recommended:** one rule for both real people, and the proven one.
- **Nani: no line.** N1 is approved and is the standard. Section 5 lists an optional one-picture nudge; not recommended now.

## 2. What runs, in order (12 pictures, about 45 minutes of his time)

The game uses eight doctor pictures (`data/clinic/heal-art.json` `doctor.views`: 3q-left + talk + blink, front, 3q-right, wave-3q-right, wave-front + closed mouth) and his four card faces (cut from the faces sheet). The other 33 kept turns in `sources/art/s07/` are unwired spares: not redone unless a game wires them.

| # | ID | What | Attach (exactly these) | Save as (`sources/art/s08/`) | Gate |
|---|---|---|---|---|---|
| 1 | DS2 | The new character sheet: an edit of his sheet at Nani's level | `sources/art/s07/doctor-s1-sheet-v1.png`, `sources/art/s07/nani-n1-lean-neutral-v1.png`, `sources/art/characters/char-nana-v1.png`, `sources/art/style-anchor-v1.png` | `doctor-s2-sheet-v1.png` | Zafar: is it still him? |
| 2 | DL1 | The lineup: him, Nani, the girl and Nana on one floor | DS2, `nani-n1-lean-neutral-v1.png`, `sources/art/clinic-heal-v3/girl-w1-front-neutral-v1.png`, `char-nana-v1.png` | `doctor-l1-lineup-v1.png` | Zafar: do they look like one film? **Stop here if not.** |
| 3 | DW1 | Standing, three-quarter left, neutral: an edit of the kept picture | `sources/art/s07/doctor-w1-stand-3q-neutral-v1.png`, DS2 | `doctor-w1-stand-3q-neutral-v2.png` | |
| 4 | DF1 | Talking: an edit of DW1 v2 | DW1 v2 only | `doctor-f1-stand-3q-talk-v2.png` | |
| 5 | DF3 | Eyes closed: an edit of DW1 v2 | DW1 v2 only | `doctor-f3-stand-3q-blink-v2.png` | |
| 6 | DW1-F | Standing, front | `doctor-w1-stand-front-neutral-v1.png`, DS2 | `doctor-w1-stand-front-neutral-v2.png` | |
| 7 | DW1-QR | Standing, three-quarter right | `doctor-w1-stand-3q-right-neutral-v1.png`, DS2 | `doctor-w1-stand-3q-right-neutral-v2.png` | |
| 8 | DA6-QR | Three-quarter right, waving | `doctor-a6-stand-3q-right-wave-v1.png`, DS2 | `doctor-a6-stand-3q-right-wave-v2.png` | |
| 9 | DD1 | Standing and waving at his door, calling | `doctor-d1-door-call-v1.png`, DS2 | `doctor-d1-door-call-v2.png` | |
| 10 | DD2 | DD1 with a closed smile: an edit of DD1 v2 | DD1 v2 only | `doctor-d2-door-look-v2.png` | |
| 11 | DR2 | The twelve card faces: an edit of the faces sheet | `doctor-ref-faces-v1.png`, DS2 | `doctor-ref-faces-v2.png` | |
| 12 | DS2-B | (only if DS2 fails the gate) the sheet again, a touch more real | as DS2 | `doctor-s2-sheet-v2.png` | |

After the run: Claude judges (`artjudge.py`), re-cuts with `build/tools/art/specs/s07.cut.json` (feet, stand and head re-measured: a re-render shifts them a few pixels), re-measures `heal-art.json` `doctor.fig_h` and the views, and the scale fix in `scenes-v2.json` (the judge report, section 3) goes in the same session.

## 3. The prompts

Every prompt is pasted as is into a fresh chat with exactly the files on its line. Real person: he approves each.

### The level, in words (used inside every prompt below)

> Render him at exactly the level of stylising of the attached Nani picture, and no more photographic than the attached Nana: a stylised 3D animated-feature-film look. Smooth, simple skin with no pores and no fine wrinkles (his age shown by two or three soft lines, the shape of his face and his white hair and beard, not by texture). The beard and side hair as soft solid white masses with a few simple strands, not single hairs. The eyes a little larger and rounder than real, with one clear highlight each, behind clear glasses with simple frames and no refraction. Nose, ears and hands simplified and softly rounded. The blazer's navy check a quiet, simplified pattern with no visible weave; the shirt and trousers smooth cloth. Softer, rounder forms overall, the head a little larger for the body (about six heads tall). Soft global illumination, warm light from the upper left, soft shadows to the lower right, no outlines, no photorealism. He, Nani and Nana must look like three people from one film.

### DS2. The new character sheet (an edit of his sheet)

Attach: `doctor-s1-sheet-v1.png`, `nani-n1-lean-neutral-v1.png`, `char-nana-v1.png`, `style-anchor-v1.png`.

```
Generate an image, 1536×1024, landscape.

Using the attached doctor character sheet as the only reference for WHO this is and for the LAYOUT, redraw the whole sheet with the same panels in the same places and the same poses: the full-body turnaround (front, three-quarter, side, back), the seated upper-body portrait, both hands, the glasses, the watch, the brown leather bag, the blazer fabric close-up and the colour strip. Keep every identifying feature exactly: bald on top with short white hair at the sides, a short neat solid white beard, clear rectangular glasses, a white open-collared shirt under a navy-blue check blazer, charcoal trousers, brown leather shoes, a silver watch on his LEFT wrist, his face shape, his build and his age. The same man in every panel, identical clothing.

Change only the rendering: render him at exactly the level of stylising of the attached Nani picture, and no more photographic than the attached Nana: a stylised 3D animated-feature-film look. Smooth, simple skin with no pores and no fine wrinkles (his age shown by two or three soft lines, the shape of his face and his white hair and beard, not by texture). The beard and side hair as soft solid white masses with a few simple strands, not single hairs. The eyes a little larger and rounder than real, with one clear highlight each, behind clear glasses with simple frames and no refraction. Nose, ears and hands simplified and softly rounded. The blazer's navy check a quiet, simplified pattern with no visible weave; the shirt and trousers smooth cloth. Softer, rounder forms overall, the head a little larger for the body (about six heads tall). Materials and light as the attached style anchor: soft global illumination, warm light from the upper left, soft shadows to the lower right, no outlines, no photorealism. He, Nani and Nana must look like three people from one film.

Skin a warm light tan, never orange, never pink. Background: one flat, uniform light blue-grey as on the attached sheet. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

### DL1. The lineup (the gate: one picture, judged by eye)

Attach: DS2, `nani-n1-lean-neutral-v1.png`, `girl-w1-front-neutral-v1.png`, `char-nana-v1.png`.

```
Generate an image, 1536×1024, landscape.

Draw four game characters standing in a row on one flat invisible floor, all feet on exactly the same level, seen straight on at eye level, each exactly as in their attached picture and at the same level of stylising as each other: from left to right, the doctor (from the attached new doctor sheet: full body, front, arms relaxed), Nani (from the attached Nani picture: full body, standing, hands loosely together, her red dupatta over her head, round gold glasses, cream kurta with red embroidery), the little girl (from the attached girl picture: standing, yellow dress, white leggings, white sandals, two plaits with white bows, hands at her sides), and Nana (from the attached Nana sheet: full body, front). True relative heights: the doctor about 170 cm, Nani about 155 cm, the girl about 110 cm (her head at the doctor's chest), Nana about 165 cm. Clear space between them; nothing touches the edges of the image.

Everyone in the same stylised 3D animated-feature-film look: smooth simple skin, no pores, soft rounded forms, no outlines, one warm key light from the upper left, soft shadows to the lower right, a soft contact shadow under each pair of feet. Background: one flat, uniform neutral mid-grey, hex #808080. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No bindi, tilak or other Hindu religious markers.
```

### DW1. Standing, three-quarter left, neutral (an edit of the kept picture)

Attach: `doctor-w1-stand-3q-neutral-v1.png`, DS2.

```
Generate an image, 1024×1536, portrait.

Using the attached standing picture of the doctor for the exact pose, size, framing, turn and the position of his feet, and the attached character sheet for who he is and HOW HE IS RENDERED, draw him again exactly as in that picture: standing, full body, turned three-quarters towards the viewer's left, both arms relaxed at his sides, hands open and loose, nothing in his hands, the same gentle neutral face with a small kind smile, mouth closed, looking towards the viewer's left and a little down, the figure at the same size and the same position in the frame, both feet on exactly the same invisible level. Draw no floor; nothing touches the edges of the image.

The only change is the rendering: exactly as the attached sheet, a stylised 3D animated-feature-film look. Smooth, simple skin with no pores and no fine wrinkles, the beard and side hair soft solid white masses, the eyes a little larger and rounder than real with one clear highlight each, clear glasses with simple frames and no refraction, nose, ears and hands softly rounded, the blazer's check a quiet simplified pattern with no visible weave, softer rounder forms overall, the head a little larger for the body. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear rectangular glasses, white open-collared shirt, navy check blazer, charcoal trousers, brown leather shoes, silver watch on his left wrist. Soft global illumination, warm light from the upper left, no outlines, no photorealism.

Background: one flat, uniform neutral mid-grey, hex #808080; no shadow on the grey. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur. Five fingers on each hand. No stethoscope.
```

### DF1 and DF3. Talking and blink (edits of DW1 v2; attach DW1 v2 only)

```
Edit the attached image. Change only his mouth: open it a little as if saying a word, the teeth just showing. Every other pixel identical: the same pose, size, position, clothes, light and background.
```

```
Edit the attached image. Change only his eyes: both eyes gently closed, as in a blink, the lids relaxed, the brows unchanged. Every other pixel identical: the same pose, size, position, clothes, light and background.
```

### DW1-F, DW1-QR, DA6-QR, DD1. The other standing pictures (each an edit of its kept v1)

Attach: the kept v1 on the line, and DS2. The DW1 prompt, with its first paragraph's pose line swapped for the picture's own:

- **DW1-F:** "standing, full body, FRONT-on to the viewer, both arms relaxed at his sides, hands open and loose, the same gentle neutral face, mouth closed, looking at us".
- **DW1-QR:** "standing, full body, turned three-quarters towards the viewer's RIGHT, both arms relaxed at his sides, the same gentle neutral face, mouth closed, looking towards the viewer's right and a little down".
- **DA6-QR:** "standing, full body, turned three-quarters towards the viewer's RIGHT, his near arm (on the viewer's right) raised in a friendly wave, the open hand beside his head with the palm towards us, the other arm at his side, a big warm open smile, looking towards the viewer's right and a little down".
- **DD1** (square, 1254×1254 as the kept picture): "standing in his half-open doorway and waving, face-on, one hand raised in a friendly wave beside his head, the other at his side, a big open smile as he calls the next patient, the door leaf and frame exactly as in the attached picture".

Everything else in the prompt stays word for word (the rendering paragraph, the identifying features, the grey background, the negatives).

### DD2. The closed smile (an edit of DD1 v2; attach DD1 v2 only)

```
Edit the attached image. Change only his mouth: a warm closed smile, lips together. Every other pixel identical: the same pose, size, position, door, clothes, light and background.
```

### DR2. The card faces (an edit of the faces sheet)

Attach: `doctor-ref-faces-v1.png`, DS2.

```
Generate an image, 1536×1024, landscape.

Using the attached twelve-face sheet for the exact grid, the exact framing (head and shoulders, front-on) and the twelve expressions in their places (neutral smile, talking, laughing, gentle smile, cheering, warm closed smile, finger up, thinking, surprised, worried, sceptical, wink-laugh), and the attached character sheet for who he is and how he is rendered, redraw all twelve faces in the same grid and the same order, the same man with the same expression in each cell. Keep every identifying feature: bald on top, white side hair, short solid white beard, clear rectangular glasses, white open-collared shirt, navy check blazer.

The only change is the rendering: exactly as the attached sheet, a stylised 3D animated-feature-film look. Smooth simple skin with no pores and no fine wrinkles, the beard and side hair soft solid white masses, the eyes a little larger and rounder than real with one clear highlight each, clear glasses with simple frames and no refraction, nose and ears softly rounded, the blazer's check a quiet simplified pattern with no visible weave, softer rounder forms. Soft global illumination, warm light from the upper left, no outlines, no photorealism.

Background in every cell: one flat, uniform light blue-grey as on the attached sheet. Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.
```

## 4. Checks (Claude, after the run)

1. Likeness: DS2's front and three-quarter faces beside `doctor-s1-sheet-v1.png` at one head height; Zafar's eye decides.
2. Level: DL1's four heads at one head height beside `D-heads.png` from the judge's scratchpad; the doctor's skin must be as smooth as Nani's; no weave on the blazer at 2× zoom.
3. `artjudge.py` skin ΔE against DS2 (not against the cartoon family render: the s07 landing report's note).
4. Pose edits: DF1 and DF3 against DW1 v2 by pixel diff (mean under 5, as N2/N5 were); DD2 against DD1 v2.
5. Cut: `s07.cut.json` re-run on `sources/art/s08/`; `heal-art.json` `doctor.fig_h`, `feet`, `stand`, `head` re-measured; the clinic contract at 800×360 and 1366×768, with the `scenes-v2.json` scale numbers from the judge report applied in the same session.

## 5. Not recommended now: a one-picture nudge for Nani (N1-B)

Only if Zafar wants Nani a touch nearer Nana after seeing DL1. An edit of N1 (attach `nani-n1-lean-neutral-v1.png` and `char-nana-v1.png`): "Edit the attached image. Keep her face, glasses, dupatta, clothes, pose, size, position and background exactly; change only the rendering, one small step towards the attached Nana: the eyes about ten percent larger, the skin a little smoother, the knit of the dupatta quieter. Every other pixel as close to identical as possible." Judged beside N1 at one head height; he keeps whichever reads as Mum. The risk is the one he already found: a redrawn face that loses the semblance, so N1 stays unless the nudge is clearly still her.
