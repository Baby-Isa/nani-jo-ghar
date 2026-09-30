# ChatGPT art prompts: the chai station's liquids (28 Sept)

## Paste this one block into Claude in Chrome
```
You're making 3 images in ChatGPT for a children's game called Nani jo Ghar, then uploading them to GitHub yourself. Work through these steps in order, and don't change any ChatGPT, GitHub or Chrome settings.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/main/docs/archive/art-prompts/chatgpt-art-prompts-chai-station.md and read the whole page. It has 3 prompts, in this order: C1, C2, C3. Each is in a grey code box, followed by "attach", "save as" and "check" lines.

2. Download the three reference images. Open each page below and click its "Download raw file" button (the download-arrow icon at the top right of the image):
   - https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png
   - https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/cook/items/vessel-saucepan-t.png
   - https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/chatgpt-batch3/vessel-glass-chai-top-t-v1.png

3. In ChatGPT (chatgpt.com), for each prompt in that order: start a new chat, attach the files its "attach" line names, paste the text of its code box exactly as written, and send. When the image arrives, compare it against its "check" line.
   - If it passes, download it straight away with ChatGPT's own download button (never a screenshot), before moving on.
   - If it fails, reply once saying which check it failed and ask for a corrected image. If that fails too, start a fresh chat and try once more (at most 2 retries per prompt). Then download the best one and note what's wrong with it.
   - Download only the one image you keep for each prompt, so there are exactly 3 downloads.

4. Upload the three images to GitHub yourself. Open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/chai-station and drag in the 3 downloaded files. Before committing, rename nothing on GitHub; instead type this commit message: "Chai station art: C1 pot liquids, C2 pour streams, C3 chai glass fills (ChatGPT, for build/cut_chai_station.py)". Choose "Commit directly to the main branch" and click "Commit changes". Check the folder page then lists all 3 files.

5. Tell me, in prompt order: the prompt (C1, C2, C3), the file name as uploaded, and pass, or what's wrong with it.
```

**What happens next:** Claude matches the three uploads to C1–C3 (by the pictures), renames them to the "save as" names, and cuts them with `build/cut_chai_station.py` (the cut_tick_v2 method, `docs/archive/process/VISUAL-QA.md` §2) into the files named on each "cuts to" line. The game already has interim versions of all of these, drawn in code (`js/cook/station-lib.js` `shade()`, `js/cook/mechanics/pour.js` `drawStream()`, the glass in `js/cook/stations/chai-tray.js`); the art replaces them.

**For:** the chai station (`js/cook/stations/chai-tray.js`), redone to `docs/feedback/cook-ui-feedback-2026-09-28.md` §8: the pot's contents rise and change as water, tea and milk go in, steam when hot, bubble at the boil; pouring is the bottle or carton tilting over the pot with a short stream; the chai glasses on the tray fill up.

**Rules on every sheet:** 3×3 grid, nine equal cells, flat mid-grey `#808080` background, no floor, no shadows, no text, numbers, letters or logos anywhere, each thing centred in its own cell with clear grey all round it. **Registration:** where a sheet shows one object in several states (the glass), it is the same object at exactly the same size and position in every cell; only its contents change. Style: the attached style anchor (stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines).

## C1. What's in the pot: water, milk, chai, the boil
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE round pool of liquid seen from above at the same slight angle as the inside of the attached saucepan, as if the saucepan itself were invisible: just the liquid's surface, an ellipse the same shape as the pan's opening, filling about 80% of the cell's width, centred. All nine ellipses are exactly the same size and shape. Light comes from the upper left: a soft shaded edge on the upper-left side where the pan's wall would shade it, a soft window reflection on the upper-left part of the surface, and a thin bright meniscus along the lower-right edge.
Row 1: (1) clear water, see-through and faintly blue, with gentle ripples. (2) fresh white milk, creamy and opaque. (3) light chai: water with tea just added, a clear amber-orange brown, a few dark tea leaves swirling.
Row 2: (4) dark chai: strong tea boiled with milk, a rich reddish-brown, smooth. (5) milky chai: a warm caramel-beige, a faint skin of cream. (6) chai with crushed cardamom pods and thin ginger slices floating on it.
Row 3: three frames of the same rolling boil, to play one after another: a dark chai surface with rising bubbles and a ring of pale froth, (7) just starting, a few small bubbles; (8) rolling, many bubbles and froth; (9) at the top, foaming up, froth covering most of the surface.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `vessel-saucepan-t.png`
**save as:** `sources/art/chai-station/chai-pot-liquids-t-v1.png`
**check:** nine ellipses of exactly the same size and shape, no pan or rim drawn · the water is see-through and clearly different from the milk · light chai, dark chai and milky chai are three clearly different browns · the three boil frames grow from a few bubbles to foaming · flat grey background, no shadows, no text.
**cuts to:** `assets/cook/items/chai-station/liquid-{water,milk,chai-light,chai-dark,chai-milky,chai-spiced,boil-1,boil-2,boil-3}.webp` (one canvas, registered to the ellipse, so the code maps its level onto the pot's opening).

## C2. The pour stream
```
A sprite sheet for a children's game, 1536x1536 square, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds ONE short stream of liquid falling straight down, as if poured from a bottle just above the top of the cell into a pot just below: a smooth glossy rope of liquid, about as wide as a finger at the top and a little narrower lower down, with a gentle curve, a soft highlight down one side, and a small splash crown and ripple ring at the bottom where it lands. The stream is centred and runs from about 8% to about 85% of the cell's height; every stream is the same length and position.
Row 1: clear water, see-through with bright highlights, three frames of the same pour (the stream's wobble and the splash change a little from frame to frame so they loop).
Row 2: white milk, three looping frames.
Row 3: chai (a warm reddish-brown), three looping frames.
Style: exactly as the attached style anchor: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`
**save as:** `sources/art/chai-station/chai-pour-streams-t-v1.png`
**check:** nine streams, all the same length and in the same place in their cells · a splash at the bottom of each · the three rows are clearly water, milk and chai · the three frames in a row differ only a little · flat grey background, no bottle, no pot, no text.
**cuts to:** `assets/cook/items/chai-station/stream-{water,milk,chai}-{1,2,3}.webp` (glow cut: colour-to-alpha, so the see-through water keeps its transparency).

## C3. The chai glass, filling up
```
A sprite sheet for a children's game, 1536x2048 portrait, nine equal cells in three rows of three, on a flat mid-grey #808080 background. No floor, no shadows, no text, no letters, no numbers, no logos.
Each cell holds the attached clear chai glass with its thin metal rim, seen from above at exactly the same angle as in the attached picture, standing upright, filling about 80% of its cell's height, centred. It is the SAME glass at exactly the same size and position in every cell; only what's inside changes, and the liquid's surface is always a flat level ellipse parallel to the rim.
Row 1: (1) empty. (2) a little white milk, about a quarter full. (3) white milk, half full.
Row 2: (4) light milky chai (caramel-beige), half full. (5) light milky chai, full (just below the rim). (6) dark chai (rich reddish-brown), half full.
Row 3: (7) dark chai, full. (8) dark chai, full, with two or three tiny cardamom pods floating. (9) dark chai, full, with a few thin ginger slices floating.
Through the glass you can see the chai's colour; the glass keeps its bright reflections on top.
Style: exactly as the attached style anchor and the attached glass: stylised 3D animated-feature-film look, soft global illumination, warm light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `vessel-glass-chai-top-t-v1.png`
**save as:** `sources/art/chai-station/chai-glass-fills-t-v1.png`
**check:** the same glass, same size, same place, in all nine cells (lay them over each other: only the contents move) · empty, quarter, half and full are clearly different heights · the liquid surface is level with the rim, never tilted · milk, milky chai and dark chai are three clearly different colours · flat grey background, no saucer, no tray, no text.
**cuts to:** `assets/cook/items/chai-station/glass-{empty,milk-quarter,milk-half,chai-light-half,chai-light-full,chai-dark-half,chai-dark-full,chai-elchi,chai-aadu}.webp` (one canvas registered to the glass, like `glass.webp`, so the fills layer exactly).
