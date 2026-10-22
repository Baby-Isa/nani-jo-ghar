# Sprint 11 art plan (pack `s11`)

**Written:** 22 Oct 2026, from Zafar's yes to the easy-to-play plan (decision 9 of `docs/game-design/easy-to-play.md`, 21 Oct) and his Sprint 11 changes (22 Oct: clinic pictures for the evening book; CK-27's splash waits for the art-matched effects). **Rule 13:** Claude wrote this plan and its block; Zafar runs it in ChatGPT and approves what lands; Claude judges, cuts and wires. **Run spec:** `build/tools/art/specs/s11.run.yaml`; the block is generated from it (`python3 build/tools/art/artblock.py --spec build/tools/art/specs/s11.run.yaml`).

## 0. Totals

| Part | What | Images |
|---|---|---|
| **A** | The toothbrushing game: a proper toothbrush (TB), and the girl's open mouth again without its pale box (MO) | 2 |
| **B** | The eye test: the doctor holding up one big blank card in both hands (DC), for the shared word card to sit on | 1 |
| **C** | The evening book after a clinic day: the clinic across the book's two pages (BK1) and a photo of the girl and the doctor (BK2) | 2 |
| **D** | A small painted effects sheet: sparkle, splash, steam, bubble, shine (FX) | 1 |
| | **Total** | **6**, about 30 minutes |

## 1. Flaws and uncertainties first

1. **The doctor and the girl are real people** (the art bible's lineup, 16 Oct). DC and BK2 are checked against `sources/art/s08/lineup-v4-1.png` for likeness and skin tone; Zafar judges likeness after the run. Modest clothes as on their sheets.
2. **The card the doctor holds must be blank.** ChatGPT likes to write on cards. The word card (`js/shared/word-card.js`) is drawn by code inside the card's face, so any mark on it is a fail. The card's face is a plain flat rectangle facing us square-on, so code can place the word on it.
3. **Effects on a magenta key are hard** (steam and shine are see-through). FX asks for soft but solid painted shapes, each well apart; the cut keeps the soft edge as alpha. If steam reads as a smudge, the redo amends only the steam.
4. **The mouth (MO) is an edit of the kept close-up** (`sources/art/s02/girl-m1-mouth-v2.png`, the tooth game's `mouth-v2`): only the pale hard-edged rectangle baked into the top of an upper front tooth goes (Sprint 10's judge; today a code patch hides it), nothing else moves, so the game's measured teeth and boxes still fit. A redraw that moves the mouth is a fail.
5. **The toothbrush (TB) lies flat, side on, bristles down-up visible,** because the game moves it along a plus-shaped track over the mouth (Zafar, 21 Oct). Zafar may send a photo of a real brush; if he does, attach it as the first reference and the prompt stays the same.
6. **The book's clinic page (BK1)** follows the kitchen spread's rules (`sources/art/s09b/k2-book-kitchen-spread-v1.png`): no things on it (the game adds them), the middle tenth empty for the fold.

## 2. How Zafar runs it

Paste the Claude in Chrome block (`s11-chrome-block.txt`). It makes each image in a fresh ChatGPT chat with the listed attachments, keeps the first that passes its check, and downloads the kept images from ChatGPT's Library at the end. Push them to `sources/art/s11/` with the log; Claude judges, cuts and wires them (part 6).

## 5. The prompts

#### TB. A proper toothbrush
```
Generate an image, 1536×1024, landscape.

One child's toothbrush, lying flat and seen exactly from the side, horizontal across the middle of the picture, the head on the LEFT, the handle on the RIGHT. The handle is completely STRAIGHT (no bend, no curve, no angle at the neck), a plain rounded bar in soft sky blue with a white grip strip. The head is small and rectangular, with REAL bristles: many fine white and pale blue tufts in neat rows, standing straight up from the head, each tuft clearly visible. The whole brush is about two thirds of the picture's width, with empty space all round. The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached pictures: the same stylised 3D animated-feature-film look, believable plastic and nylon, soft global illumination, clean and simple. Unlike the attached old toothbrush, the handle is straight and the bristles are real tufts. No outlines. No pink or purple anywhere except the flat magenta. No toothpaste.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### MO. The girl's open mouth, without its pale box
```
Edit the attached close-up of the girl's open mouth. Keep EVERYTHING exactly as it is, the same size, framing, face, lips, teeth, gums, tongue and lighting, pixel for pixel where possible. Change only one thing: on the top of one of the upper front teeth there is a pale, hard-edged rectangular highlight, like a little box; remove it, so that tooth shows its own smooth natural enamel there, with the same soft shading as the teeth beside it. No box, patch or hard-edged highlight anywhere.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### DC. The doctor holding up a big blank card
```
Generate an image, 1024×1536, portrait.

The grandfather doctor from the attached sheet and lineup, exactly as he is there (the same face, glasses, hair, skin tone, plain navy blazer with a faint check, shirt and trousers), standing, seen from the front, whole from head to feet, smiling kindly at the viewer. With both hands he holds up in front of his chest a BIG plain white card, landscape, about as wide as his shoulders, its face turned square-on to us and flat, his fingers only at its two side edges so the whole face of the card is clear. The card is completely BLANK: no writing, no picture, no marks, no border pattern, just plain smooth white card with softly rounded corners. The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: exactly as the attached sheet: the same stylised 3D animated-feature-film look, the same likeness at the same level of realism, soft global illumination. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks, anywhere, and above all nothing on the card. No religious images or markers.
```

#### BK1. Find it: the clinic, across the book's two pages
```
Generate an image, 1536×1024, landscape.

The grandfather doctor's small, friendly clinic room at Nani's house, as in the attached waiting-room picture, drawn for a picture book and filling the whole image, with NO people and NO loose things (the game adds them): a pale wall with a window, a long clean white counter running across the whole width at about the middle height with empty space on it, a few plain cupboards and drawers below, a simple chair. The middle tenth of the width, where the book's centre fold will be, has nothing standing in it. Plenty of open counter for things to stand on, on both the left and right halves. The same warm, calm feel as the attached kitchen book page.

Style: exactly as the attached pictures: the same stylised 3D animated-feature-film look, warm daylight, soft global illumination. No outlines.

Do not add any text, letters, numbers, labels, signs, posters with writing, logos or watermarks. No religious images or markers. No red crosses.
```

#### BK2. A photo for the book: the girl and the doctor after her visit
```
Generate an image, 1536×1024, landscape.

A happy snapshot, as if Nani took a photo: the girl and the grandfather doctor from the attached sheets and lineup, exactly as they are there (the same faces, hair, skin tones and clothes), side by side in his clinic room as in the attached clinic picture, both smiling at the camera; she holds up her hand in a little wave, he rests a hand gently on her shoulder. Seen from the front, from the knees up, both whole within the picture with space round them. Calm, warm and simple.

Style: exactly as the attached sheets: the same stylised 3D animated-feature-film look, the same likeness at the same level of realism, warm daylight, soft global illumination. No outlines.

Do not add any text, letters, numbers, labels, signs, logos or watermarks. No religious images or markers. No sweets.
```

#### FX. A small painted effects sheet
```
Generate an image, 1536×1024, landscape.

Five separate small painted effects for a children's game, in one row, evenly spaced, each whole and well apart from the others, each about the same size: (1) a SPARKLE: a soft golden four-pointed star with two tiny stars beside it; (2) a SPLASH: a crown of clear light-blue water drops leaping up from a small splash; (3) STEAM: three soft white curling wisps rising, solid enough to see clearly; (4) a BUBBLE: one round soap bubble with a soft rainbow sheen and a bright highlight; (5) a SHINE: a short burst of soft white-gold rays, like light glinting off something clean. Each is painted as a solid soft shape (not see-through smoke), so it can be cut out. The background is ONE flat, even, pure magenta, hex #FF00FF, with no floor, no shadow on it and no gradient (it is cut away later).

Style: the same stylised 3D animated-feature-film look as the attached picture, soft and friendly, never sharp or scary. No outlines. No pink or purple anywhere except the flat magenta.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

## 6. Cut and wire notes

- Key magenta to alpha, erode 1 px, trim; soft edges (FX steam, shine) keep their feathered alpha.
- **TB** → `assets/clinic/items-s11/toothbrush-s11.webp` (and @2x), its head's bristle centre measured as the brush's hit point for the plus-shaped track (s11-clinic owns the game).
- **MO** → replaces the mouth close-up the tooth game uses; the code patch for the pale box goes (S10 known gap). The game's measured tooth spots are re-checked on it.
- **DC** → the eye test's doctor-with-card pose; the card face's four corners measured into the eye test's data so `WordCard.card` sits inside it (s11-clinic).
- **BK1, BK2** → `assets/day/s11/book-clinic-spread.webp` and the clinic day's photo; `data/day-book.json` `activityPlace.clinic` moves from the kitchen to a clinic place (a follow-up row; the book's owner wires it).
- **FX** → five sprites, `assets/shared/fx-s11/{sparkle,splash,steam,bubble,shine}.webp`, for the effects tried first in chai (s11-cook; CK-27's splash comes back on its splash).
