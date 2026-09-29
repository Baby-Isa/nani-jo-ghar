# ChatGPT art prompts: the clinic's backgrounds (29 Sept)

Six backgrounds for the clinic, from `docs/feedback/clinic-playtest-2026-09-29.md` (§10). They're built to the recommended answers CQ1 (the wider waiting room), CQ3 (the exam room with the bed) and CQ4 (the pharmacy at 45°); if Zafar answered differently, Claude edits this page before it's pasted. **Backgrounds only:** people, the doctor and the medical items come later, once the mechanics have been prototyped on these.

## Paste this one block into Claude in Chrome
```
You're making 6 images in ChatGPT for a children's game called Nani jo Ghar, then uploading them to GitHub yourself. Work through these steps in order, and don't change any ChatGPT, GitHub or Chrome settings.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/main/docs/chatgpt-art-prompts-clinic-v1.md and read the whole page. It has 6 prompts in this order: CB1, CB2, CB3, CB4, CB5, CB6. Each is in a grey code box, followed by "attach", "save as" and "check" lines.

2. Download the reference images listed under "Reference images" on that page. Open each link and click its "Download raw file" button (the download-arrow icon at the top right of the image).

3. In ChatGPT (chatgpt.com), for each prompt in order: start a new chat, attach the files its "attach" line names (where it says "your CB2 image", attach that picture, which you downloaded earlier in this run), paste the text of its code box exactly as written, and send. When the image arrives, compare it against its "check" line.
   - If it passes, download it straight away with ChatGPT's own download button (never a screenshot), before moving on.
   - If it fails, reply once saying which check it failed and ask for a corrected image. If that fails too, start a fresh chat and try once more (at most 2 retries per prompt). Then download the best one and note what's wrong with it.
   - Download only the one image you keep for each prompt, so there are exactly 6 downloads.

4. Upload the 6 images to GitHub yourself. Open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/clinic-v2 and drag in the 6 downloaded files. Rename nothing on GitHub. Type this commit message: "Clinic backgrounds from the 29 Sept play-test (ChatGPT, 6 images)". Choose "Commit directly to the main branch" and click "Commit changes". Check the folder page then lists all 6 files.

5. Tell me, in prompt order: the prompt (CB1 … CB6), the file name as uploaded, and pass, or what's wrong with it.
```

## Reference images
- Style anchor: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png
- Current waiting room: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/clinic/rooms/bg-clinic-waiting-e-v1.png
- Current exam room: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/clinic/rooms/bg-clinic-room-e-v1.png
- Current pharmacy: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/assets/clinic/rooms/bg-clinic-pharmacy-e-v1.png

**Rules on every image:**
- 1536x1024 landscape, a full scene edge to edge.
- **No people, no animals, no text, no letters, no numbers, no logos** anywhere: posters and charts use simple pictures and shapes only.
- The same clinic as the attached rooms: warm cream plaster walls, a sage-green dado band, a pale terrazzo floor, light oak wood, brass details, soft morning sunlight from a window on the left.
- **Style:** the attached style anchor (stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, no outlines).
- **Calm and uncluttered:** a background for a children's game, with clear open space where the game places people and objects.

## CB1. The waiting room, wider
```
A background for a children's game, 1536x1024 landscape: a friendly small-town doctor's WAITING ROOM, the same clinic as the attached room (warm cream plaster walls, sage-green dado band, pale terrazzo floor, light oak wood, brass details), seen from a slightly raised eye level, a little wider than the attached view so we see more of the room.
Along the back wall, a long light-oak waiting bench with sage cushions (room for five people sitting). On the left, under a latticed jali window with soft morning sun, two small sage armchairs with a low round table between them holding a potted plant and a folded stethoscope. On the right, a small light-oak check-in desk with a brass bell on it and an empty chair behind it. Far right, the door to the doctor's room: sage-green, standing HALF OPEN inward, a dark gap showing, with a brass handle. On the wall above the bench, a simple green medical cross sign on a white round plaque, and one small framed poster of a smiling heart shape (no words). Open terrazzo floor in the front third of the image, and clear standing space near the door and the desk, for people to be placed later.
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached style anchor and room: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm morning light from the upper left, no outlines. Calm and uncluttered.
```
**attach:** `style-anchor-v1.png`, `bg-clinic-waiting-e-v1.png`
**save as:** `sources/art/clinic-v2/cb1-waiting-wide-v1.png`
**check:** long bench, two armchairs and a table, check-in desk, half-open door on the right, green medical cross · open floor and standing space · no people, no text · matches the clinic's colours.

## CB2. The exam room, with the bed
```
A background for a children's game, 1536x1024 landscape: the DOCTOR'S EXAMINATION ROOM of the same small clinic as the attached room (warm cream plaster walls, sage-green dado band, pale terrazzo floor, light oak, brass details, a window on the left with soft morning sun), seen straight on at a child's eye level.
In the CENTRE, facing us, a padded examination bed: a light-oak frame, a sage-green padded top with a roll of white paper along it, high enough that a person sitting on its edge would have their legs dangling; a small two-step wooden stool in front of it. The space to the right of the bed is clear floor, for the doctor to stand in later. On the back wall behind the bed, one friendly framed anatomy poster: a simple outline of a human body with a few soft coloured shapes for the heart and lungs (no words, no labels). To the left, a small light-oak desk with a closed laptop, a pot of pens and a folded stethoscope; a white cabinet with a green cross on its door. Uncluttered.
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached style anchor and room: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm morning light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `bg-clinic-room-e-v1.png`
**save as:** `sources/art/clinic-v2/cb2-exam-bed-v1.png`
**check:** exam bed centred and facing us, legs-dangling height · clear space right of the bed · anatomy poster with no words · no people, no text.

## CB3. The exam room, the poster wall (standing)
```
A background for a children's game, 1536x1024 landscape: the OTHER WALL of the same doctor's examination room as the attached image (same walls, dado, floor, light and style), seen straight on at a child's eye level.
In the centre, a large clear space of wall and floor where a patient will stand facing us, with a doctor beside them. On the wall behind that space, a big friendly framed poster of a full human body outline (front view, arms slightly out), with soft coloured shapes for the heart, lungs and tummy (no words, no labels). To its right, a wooden height chart on the wall with coloured bands (no numbers). A small potted plant in the corner; a hook with a white coat on it. Uncluttered.
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached images: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the left, no outlines.
```
**attach:** `style-anchor-v1.png`, your CB2 image
**save as:** `sources/art/clinic-v2/cb3-exam-poster-v1.png`
**check:** clearly the same room as CB2 · a big clear standing space in the centre · the body poster and height chart have no words or numbers · no people.

## CB4. The pharmacy counter, seen from 45° above
```
A background for a children's game, 1536x1024 landscape: the PHARMACY COUNTER of the same clinic as the attached image (warm cream walls, sage-green cabinets, light oak, a pale marble counter top, brass details, soft morning light from a window on the left), seen from about 45 degrees above, looking down onto the counter top.
A long moving conveyor belt runs across the counter from left to right (a dark rubber belt between two brushed-steel rails, coming out of a small wooden hatch on the left and disappearing into one on the right), across the upper-middle of the image. In FRONT of the belt, the nearest part of the counter top is clear pale marble, wide enough for a tray. Behind the counter, the wall has sage-green cabinets and open shelves with neat rows of plain white medicine boxes and brown bottles (no labels, no text).
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached style anchor and room: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm morning light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, `bg-clinic-pharmacy-e-v1.png`
**save as:** `sources/art/clinic-v2/cb4-pharmacy-45-v1.png`
**check:** clearly looking DOWN at about 45° onto the counter · the belt runs left to right with a hatch at each end · clear counter space in front of it · no labels or text · no people.

## CB5. The front door (the send-off)
```
A background for a children's game, 1536x1024 landscape: the FRONT ENTRANCE of the same small clinic as the attached image (warm cream walls, sage-green dado band, pale terrazzo floor, light oak, brass details), seen straight on at a child's eye level.
On the right, the clinic's front door, a light-oak door with a small glass window, standing HALF OPEN to the outside, where a sunny street with a green tree and a blue sky shows through. The centre and left of the image are clear floor and wall space where a patient and the doctor will stand to say goodbye. On the wall, a green medical cross sign on a white round plaque and a coat hook with an umbrella; a doormat by the door; a potted plant.
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached style anchor and room: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm morning light, no outlines.
```
**attach:** `style-anchor-v1.png`, `bg-clinic-waiting-e-v1.png`
**save as:** `sources/art/clinic-v2/cb5-front-door-v1.png`
**check:** half-open front door on the right with sunshine outside · clear space centre and left for two people · the same clinic look · no people, no text.

## CB6. The close-up for the heal games
```
A background for a children's game, 1536x1024 landscape: a calm CLOSE-UP backdrop in the same doctor's examination room as the attached image. The lower half of the image is the sage-green padded top of the examination bed, seen close up and slightly from above, with a strip of white paper running across it, softly lit. Behind it, the room (the cream wall, the sage-green dado band, the window light from the left) is softly out of focus, like a photo with a shallow depth of field. The centre of the image is calm and empty: body-part close-ups (a knee, an ear, a foot, teeth) will be placed there in the game.
NO people, no animals, no objects in the centre, no text, letters or numbers anywhere.
Style: exactly as the attached images: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the left, no outlines.
```
**attach:** `style-anchor-v1.png`, your CB2 image
**save as:** `sources/art/clinic-v2/cb6-closeup-bed-v1.png`
**check:** the sage bed top fills the lower half with the paper strip · the room behind is softly blurred · the centre is calm and empty · no people, no text.


---

## Round 2 (29 Sept, after Zafar's review of CB1, CB2, CB4 and CB5)
Zafar's notes:
- **CB1:** good, but too wide (people would be small), and the front half is empty floor. Six on one bench is enough.
- **CB2:** no poster at all. The wall on the right stays clear for a photo of the real doctor's certificate (added in code later). A few children's toys go in the left corner in place of the desk chair. Also closer, for tapping small body parts.
- **CB4:** it came out looking down from above; the same scene seen straight on is ideal.
- **CB5 (the front door):** approved as it is.

**Attach each first version** so the look stays the same.

### Paste this block into Claude in Chrome (3 images)
```
You're making 3 images in ChatGPT for a children's game called Nani jo Ghar, then uploading them to GitHub yourself. Don't change any ChatGPT, GitHub or Chrome settings.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/main/docs/chatgpt-art-prompts-clinic-v1.md and read the section "Round 2" at the bottom. It has 3 prompts: CB1b, CB2b and CB4b, each in a grey code box followed by "attach", "save as" and "check" lines.

2. You need the CB1, CB2 and CB4 images from the first run (use the copies in your Downloads folder; if you no longer have them, download them from https://github.com/Baby-Isa/nani-jo-ghar/tree/main/sources/art/clinic-v2, the files starting cb1, cb2 and cb4) and the style anchor: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png

3. In ChatGPT, for each prompt in order: start a new chat, attach the files its "attach" line names, paste the text of its code box exactly as written, and send. Compare the image against its "check" line. If it passes, download it with ChatGPT's own download button. If it fails, reply once saying which check failed and ask for a corrected image; if that fails too, start a fresh chat and try once more. Download only the one image you keep for each prompt.

4. Open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/clinic-v2 and drag in the 3 downloaded files. Commit message: "Clinic backgrounds round 2: CB1b six-seat waiting room, CB2b exam room closer with toys, CB4b pharmacy straight on (ChatGPT)". Choose "Commit directly to the main branch" and click "Commit changes".

5. Tell me, for CB1b, CB2b and CB4b: the file name as uploaded, and pass, or what's wrong with it.
```

### CB1b. The waiting room, closer, one six-seat bench
```
Redraw the attached waiting room for a children's game, 1536x1024 landscape, keeping EXACTLY the same style, colours, light, materials, wall, dado band, terrazzo floor, window, medical cross sign, heart poster, half-open sage door and check-in desk, but with these changes:
- The camera is CLOSER: the long bench fills about 75% of the image width, and the bench seat sits a little below the middle of the image, so people sitting on it will be large.
- The bench has exactly SIX seats in a row (six sage cushions, six back cushions), light oak, centred slightly left.
- REMOVE the two armchairs and the round side table on the left.
- Keep the half-open door on the right and the check-in desk with its brass bell in the right foreground, with standing room in front of the door and beside the desk.
- Much less empty floor: only a strip of terrazzo in front of the bench.
- The medical cross sign and the heart poster stay on the wall above the bench, HIGH on the wall, so the heads of seated people will be below them.
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached images: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm morning light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, the first CB1 image
**save as:** `sources/art/clinic-v2/cb1b-waiting-six-v1.png`
**check:** closer view · one bench with exactly six seats, filling about 75% of the width · no armchairs or side table · the door and desk still on the right · the sign and poster high on the wall · no people, no text.

### CB2b. The exam room: closer, no poster, toys in the corner
```
Redraw the attached doctor's examination room for a children's game, 1536x1024 landscape, keeping EXACTLY the same style, colours, light, materials, walls, dado band, terrazzo floor, window, desk, white medicine cabinet and door, but with these changes:
- The camera is CLOSER: the examination bed is seen straight on and fills about 55% of the image width, its padded top a little below the middle of the image, so a person sitting on its edge (legs dangling) will be large, their head in the upper-middle of the image.
- REMOVE the anatomy poster completely. The wall behind and above the bed is plain and calm, and the wall to the RIGHT of the bed, above the clear standing space, is also bare (a framed certificate will be added there later).
- REMOVE the chair at the desk. In its place, in the left corner on the floor, a few children's toys: a small wooden toy car, a stack of colourful wooden blocks, a soft teddy bear and a little ball, neat and tidy on a small round rug.
- Keep the clear floor space to the right of the bed for the doctor. The desk and window stay at the left edge, partly cut off by the closer framing.
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached images: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm morning light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, the first CB2 image
**save as:** `sources/art/clinic-v2/cb2b-exam-bed-close-v1.png`
**check:** closer view, the bed straight on and about half the width · no poster anywhere · bare wall above the bed and to its right · toys on a rug in the left corner, no desk chair · no people, no text.

### CB4b. The pharmacy counter, straight on
```
Redraw the attached pharmacy counter for a children's game, 1536x1024 landscape, keeping EXACTLY the same style, colours, light, materials, marble counter, conveyor belt with its steel rails and wooden hatches at each end, sage cabinets, open shelves of white medicine boxes and brown bottles, window and plant, but seen STRAIGHT ON: the camera faces the shelves squarely from a standing adult's eye height, only a little above the counter, NOT looking down from above.
- The conveyor belt runs straight across the image from left to right (horizontal, parallel to the bottom edge), from the hatch on the left to the hatch on the right, across the middle of the image.
- In front of the belt, a strip of the pale marble counter top is visible, wide enough for a small tray.
- Behind the belt, the shelves and cabinets fill the upper part of the image, straight on.
NO people, no animals, no labels, no text, letters or numbers anywhere.
Style: exactly as the attached images: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm morning light from the upper left, no outlines.
```
**attach:** `style-anchor-v1.png`, the first CB4 image
**save as:** `sources/art/clinic-v2/cb4b-pharmacy-straight-v1.png`
**check:** straight on, NOT looking down · the belt runs horizontally across the middle, with a hatch at each end · a strip of counter in front for a tray · shelves behind · no labels, no people.

---

## Round 3 (29 Sept, after Zafar's first CB3 and CB6). Paste AFTER Round 2: both attach your CB2b image
Notes:
- **CB6:** a good close-up, but the blurred room behind still has the anatomy poster and the desk chair that CB2b removes. It must match CB2b.
- **CB3:** the body poster sits dead centre, exactly where the standing patient goes, so they'd hide it. Move it into the left third, with clear wall in the middle for the patient.

### Paste this block into Claude in Chrome (2 images)
```
You're making 2 images in ChatGPT for a children's game called Nani jo Ghar, then uploading them to GitHub yourself. Don't change any ChatGPT, GitHub or Chrome settings.

1. Open https://github.com/Baby-Isa/nani-jo-ghar/blob/main/docs/chatgpt-art-prompts-clinic-v1.md and read the section "Round 3" at the bottom. It has 2 prompts: CB3b and CB6b, each in a grey code box followed by "attach", "save as" and "check" lines.

2. You need: the CB2b image you made in Round 2, the CB3 and CB6 images from the first run (the copies in your Downloads folder, or from https://github.com/Baby-Isa/nani-jo-ghar/tree/main/sources/art/clinic-v2), and the style anchor: https://github.com/Baby-Isa/nani-jo-ghar/blob/main/sources/art/style-anchor-v1.png

3. In ChatGPT, for each prompt in order: start a new chat, attach the files its "attach" line names, paste the text of its code box exactly as written, and send. Compare the image against its "check" line. If it passes, download it with ChatGPT's own download button. If it fails, reply once saying which check failed and ask for a corrected image; if that fails too, start a fresh chat and try once more. Download only the one image you keep for each prompt.

4. Open https://github.com/Baby-Isa/nani-jo-ghar/upload/main/sources/art/clinic-v2 and drag in the 2 downloaded files. Commit message: "Clinic backgrounds round 3: CB3b poster wall, CB6b close-up matching CB2b (ChatGPT)". Choose "Commit directly to the main branch" and click "Commit changes".

5. Tell me, for CB3b and CB6b: the file name as uploaded, and pass, or what's wrong with it.
```

### CB3b. The standing wall, the poster to the left
```
Redraw the first attached image (the standing wall of a doctor's examination room) for a children's game, 1536x1024 landscape, keeping EXACTLY the same style, colours, light, materials, sink counter, shelf, window, height chart, plant, white coat on its hook and door, but with these changes:
- MOVE the big body-outline poster into the LEFT THIRD of the wall (just right of the shelf), a little smaller.
- The CENTRE of the wall and the floor in front of it are clear and calm: a patient will stand there facing us.
- Keep the height chart just right of centre, where the doctor will stand beside the patient.
- It must look like the same clinic as the second attached image (the same walls, dado band, terrazzo and light).
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached images: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm morning light from the upper left, no outlines.
```
**attach:** the first CB3 image, your CB2b image, `style-anchor-v1.png`
**save as:** `sources/art/clinic-v2/cb3b-standing-wall-v1.png`
**check:** the poster is in the left third · clear wall and floor in the centre · the height chart right of centre · no people, no text or numbers.

### CB6b. The close-up, matching the exam room
```
Redraw the first attached image (a close-up of a doctor's examination bed with the room softly blurred behind) for a children's game, 1536x1024 landscape, keeping EXACTLY the same composition, camera, bed, paper strip, soft focus and light, but the blurred room behind must now match the second attached image (the same room): NO anatomy poster (a plain wall, with only a small framed certificate shape on the right, blurred), NO chair at the desk, and a few children's toys on a small rug in the left corner, all softly out of focus. The centre of the image stays calm and empty.
NO people, no animals, no text, letters or numbers anywhere.
Style: exactly as the attached images: stylised 3D animated-feature-film look, semi-photoreal materials, soft global illumination, warm light from the left, no outlines.
```
**attach:** the first CB6 image, your CB2b image, `style-anchor-v1.png`
**save as:** `sources/art/clinic-v2/cb6b-closeup-bed-v1.png`
**check:** the same close-up as before · no poster behind · no desk chair, toys softly visible in the left corner · a calm, empty centre · no people, no text.

**CB4c (Zafar, 29 Sept):** CB4b came out right (straight on) but still has the two wooden hatches at the belt's ends. Zafar: "simpler to have the conveyor belt without the hatches either end, so items don't have a size restriction getting in and out." It's an edit in the same chat: remove both hatch boxes; the belt and its rails run straight across and off both edges of the image. The game slides items in from off-screen. Save as `sources/art/clinic-v2/cb4c-pharmacy-belt-v1.png`.
