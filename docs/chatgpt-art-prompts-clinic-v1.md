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
