# ChatGPT mock-up sheet: every game mode (1 November 2026)

Zafar: hand this whole sheet to Claude in Chrome (paste it, or give it the GitHub link to this file once it is pushed). It runs all 79 prompts in ChatGPT overnight and downloads the pictures from ChatGPT's Library at the end, so you can see every game mode in the morning. Part 1 is the instructions for Claude in Chrome; part 2 the run order; part 3 every prompt, copied exactly from the 18 designs in `build/reports/designs/`; part 4 a table of them all; then the checks made on the prompts.

## 1. Run instructions for Claude in Chrome

You're making 79 mock-up pictures in ChatGPT for a children's game called Nani jo Ghar, one per prompt in part 3, and keeping each kept picture in its own ChatGPT chat until the end, when you download them to Zafar's PC from ChatGPT's Library page with Chrome's normal download. Never move a picture out of ChatGPT any other way: no page JavaScript, no GitHub uploads, no file pickers (an earlier run tried that route, your safety classifier refused it, and nothing landed). Zafar pushes the downloaded folder and your log to the repo himself.

**These are mock-ups, not game art.** Each one shows Zafar what one moment of one game looks like. Nothing here is cut into the game. So:
- Keep the first picture that shows the game clearly: the moment its "shows" line describes, readable at a glance. Don't hunt for a better one.
- No approvals. Some references show real family members (nani-sheet.png, cook-nani-sheet.webp, the doctor and girl pictures). Don't judge likeness, don't wait for anyone, don't ask.
- At most ONE retry per prompt, and only for one of two faults (see THE ONE RETRY). Anything else that's off (an outline, a wrong count, a cluttered corner), note it in the log and keep the picture.

### THE SHEET

Every prompt in part 3 has an ID (clinic-every-part-1, farm-animals-2, ...), a "shows" line (what the picture must show: your only check), an "attach" line (the reference short names, in the order to attach them), a "save as" name and a grey code box with the words to paste. Paste the code box exactly as it is: never reword, shorten or add to it, and never paste the URLs. If the sheet is open as a page, go back to it for each prompt's code box when you start that prompt; copy it whole, from the first line to the last.

### WHERE FILES LIVE (all public; open nothing locally)

Reference pictures, by the short name the attach lines use. All but one are on `main`; town-map-8.webp is on the branch `claude/nice-lovelace-0vfjcj`, so use its URL exactly as given.

| Short name | Raw URL |
|---|---|
| bed-closeup.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-v2/cb6-closeup-bed-v1.png |
| boy-front.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/boy-w1-front-neutral-v1.png |
| cook-nani-sheet.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/nani-sheet.webp |
| cook-service-bg.jpg | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/cook/bg/service.jpg |
| customers-sheet.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/customers-sheet.webp |
| doctor-3q.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08c/dw2-doctor-3q-left-v1.png |
| exam-bed.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-v2/cb2b-exam-bed-close-v1.png |
| family-lineup.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/lineup-v4-1.png |
| farm-animals-a1.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a1-farm-animals-v1.png |
| farm-animals-a2.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/a2-farm-animals-v1.png |
| farm-fields.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/m1-farm-mid-fields-v1.png |
| foot-sole.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/child-p1-sole-v1.png |
| forearm-graze.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/clinic-heal-v3/child-f2-forearm-graze-v1.png |
| girl-face-aah.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08c/gz1-girl-face-aah-v1.png |
| girl-face-eyes.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08c/gz2-girl-face-eyes-v1.png |
| grill-tray-sheet.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/chatgpt-batch3/sheet-tray-grill-t-v2.png |
| honey-jar.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/clinic/items-v2/honey-jar.webp |
| house-wide.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09b/h3-house-empty-wide-v1.png |
| nana-face.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/assets/shared/faces/nana.webp |
| nani-sheet.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s08/sheet-nani-final-1.png |
| props-sheet.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/cook/props-sheet.webp |
| style-anchor.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/style-anchor-v1.png |
| town-map-8.webp | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/claude/nice-lovelace-0vfjcj/sources/art/mockup-town-2026-10-31/map-8-places.webp |
| town-road.png | https://raw.githubusercontent.com/Baby-Isa/nani-jo-ghar/main/sources/art/s09r/c2-town-road-view-v1.png |

Kept pictures: "kept:X" on an attach line is the picture you kept for prompt X, still in its ChatGPT chat (attach it from ChatGPT's library, see MOVING IMAGES). Eight prompts need one: farm-animals-2, -3 and -4 (kept:farm-animals-1), farm-eggs-orchard-3 (kept:farm-eggs-orchard-2), adoption-centre-2, -3 and -4 (kept:adoption-centre-1) and cook-baking-eggs-5 (kept:cook-baking-eggs-2).

Nothing is committed to GitHub in this run: the kept pictures stay in their chats and are downloaded at the end (see AT THE END) from ChatGPT's Library page: https://chatgpt.com/library

### MOVING IMAGES (references in, kept pictures stay put until the end)

Page JavaScript fetch() and the clipboard are blocked on chatgpt.com and raw.githubusercontent.com, so don't use them. ChatGPT shows its generated pictures as in-page blob: addresses that nothing outside the page can fetch, so never try to copy one out with page JavaScript or to upload it anywhere; last time that was refused and the run lost its pictures.

1. INTO CHATGPT (references). Fetch each reference URL once into your cloud workspace, saved under its short name, and keep it there for the whole run (24 files; never fetch one twice). In a fresh ChatGPT chat use your file-upload tool to attach exactly the files a prompt's attach line names, in the order the line names them, and check the composer shows exactly that many thumbnails (the number in brackets on the attach line) before you paste.
2. INTO CHATGPT (a kept picture, "kept:X"). It is still in the chat where it was made. In the new prompt's fresh chat press the "+" button in the composer, choose "Add from library", pick that picture (the newest kept try of that chat, by its title and thumbnail), and check the thumbnail is the kept one, not a reference attached in that chat. Attach it first, then the files. Never download it and re-upload it.
3. OUT OF CHATGPT: only at the very end, or when Zafar says "stop" or "download": from the Library page (https://chatgpt.com/library), each kept picture in the run order with ChatGPT's own download button (Chrome's normal download; the file keeps ChatGPT's title, so you log "title -> save as" for each one; see AT THE END). Until then every kept picture stays in its chat, and its chat link, title and save-as name are in THE LOG.

### CLOTHES (Zafar, 1 Nov; applies to every prompt with people): before pasting any prompt that shows people other than the grandmother from the locked reference, add this line at the end of the prompt: "Clothes: mostly modern everyday wear, modest (long sleeves, nothing tight). Older men wear a shirt tucked into trousers; middle-aged adults wear modern smart-casual clothes such as a quarter-zip top with chinos; children and young adults wear modern casual clothes. At most one older woman in the scene may wear a kameez with a dupatta; everyone else is in modern clothes." Where a prompt describes someone else's outfit as a kameez or kurta, that outfit stays only if the person is an older woman; otherwise the added line wins.

THE RUNNER LOOP (read it twice: this is why the run is fast)

A window is one ChatGPT chat in its own browser tab. Keep 3 windows generating at all times. A window must never sit with a finished picture and no next prompt. Anything that is not scanning, judging or sending (fetching references, posting the log) happens only while every window is generating.

YOUR NOTES (update after every action). One line per prompt with its state: WAITING (its kept:X isn't kept yet) · READY · GENERATING (tab, time sent) · KEPT (judged, logged with its chat link) · SKIPPED or STALLED (why). One queue: READY (retries at the front, then the run order in part 2).

THE TICK. Repeat until every line is KEPT or SKIPPED:
1. SCAN. Look at every generating tab (a screenshot or its page text, never the chat history). Note which are finished, still generating, stalled or errored.
2. HARVEST each finished tab, first finished first. Judge it now, in one look at the full picture against its "shows" line and the two retry faults (no waiting, no second opinions):
   - KEEP: it shows the moment and has neither fault. Mark it KEPT; every WAITING prompt that needed it becomes READY now. Refill the freed slot at once (step 3).
   - RETRY: it has one of the two faults and this is its first try. Put the prompt back at the front of READY (see THE ONE RETRY) and note the fault.
   - It is already the retry: keep the better of the two tries, note what is wrong, and treat it as KEPT.
3. FILL. While fewer than 3 windows are generating and a prompt is READY, START the first READY prompt in the free tab: new chat, attach its files (screenshot the composer: exactly that many thumbnails), paste its code box, send. Leave 60 seconds between sends, and spend that gap on one chore from step 4, not on waiting. Order of READY: retries first, then the run order. The games are priorities, not walls: a free window takes any READY prompt, even from a later game.
4. HOUSEKEEP, only when every window is generating, one chore at a time, then straight back to step 1: (a) fetch the references the next READY prompts need; (b) post the progress line and log. No chore may start while a tab is finished and unharvested, and none may take more than about two minutes.

At the start, fetch only what the first three prompts need (exam-bed.png, boy-front.png, doctor-3q.png, bed-closeup.png, forearm-graze.png, girl-face-eyes.png, girl-face-aah.png), send them, and fetch everything else during the gaps.

### THE ONE RETRY (the only redo in this run)

Retry a prompt once, in a fresh chat with the same attachments, only if its first picture has one of these faults:
1. **Text in it:** any letters, words, numbers, labels, signs or logos, even fake or blurry ones. The only exception is the wake-up-clock prompts' clock digits, and only the times their code box names ("6:00", "7:00", "9:00"); any other digits or writing there is still a fault.
2. **It misses the asked moment:** the picture doesn't show what its "shows" line says (the wrong moment, the key thing missing, the wrong view).

Before the retry you may AMEND the code box once to fix the fault: keep every sentence, and add or change only the words about the failed point, named plainly (for example: 'There must be no writing of any kind on the clipboard.'). Log the amended text word for word with the line. Never send corrections inside the old chat. After the retry, keep the better of the two tries, whatever it looks like, and move on. Never a second retry.

### STALLS

A tab is stalled when its screen shows no change (no progress text, no picture) for 6 minutes, or it shows an error ("Something went wrong", a network error, an empty reply).
- First, reload that chat once: the picture is often finished and the page is stuck.
- Still nothing 10 minutes after the send: abandon that chat and run the same prompt (same attachments) in a fresh chat, once. This does not use up the retry.
- That one stalls too: SKIP the prompt. Log "STALLED: <id> | <time>", log every prompt that waited for it as "SKIPPED: waits for <id>", free the slot and carry on.
- Never leave a stalled tab holding a slot while others are idle.

### SAFETY RULES (always)

- Change no settings anywhere: no ChatGPT settings, model picker, memory, custom instructions, plan or upgrade offers; no Chrome settings; no GitHub settings. If Chrome asks for a site permission, say no.
- Sign nothing in or out. Delete no chats.
- Commit nothing and upload nothing to GitHub. Attach to ChatGPT only the files each prompt's attach line names.
- Never write a prompt of your own. Apart from the one amend before a retry, never reword, shorten or add to a code box.
- If anything needs a decision from Zafar (a refusal, a login prompt, a payment or settings screen, a missing file, a question you can't answer from this sheet), log it, skip that prompt and anything that needs it, and carry on.
- Pacing: at most 3 pictures generating at once and at least 60 seconds between sends.

### HOW TO RUN EACH PROMPT

1. Start a fresh ChatGPT chat in a free tab (never continue another prompt's chat).
2. Attach exactly what its attach line names, in that order: a kept:X first from the library, then the fetched files. Check the thumbnail count.
3. Paste its code box exactly, and send.
4. When it finishes, harvest it as in the loop.
5. Log the kept picture: its save-as name, its chat's link (the address bar of that chat) and its chat's title (the name ChatGPT gave the chat: the Library page and the downloaded file carry it). It stays in that chat; never download it mid-run.

### THE LOG

One line per kept picture:

` <ID> | <time> | save as mockup-<ID>.png | KEPT (<any fault noted>) | retry: 0/1 | chat: <that chat's link> | title: <that chat's title> | <notes>`

Also log every skipped or stalled prompt (and why), every image-limit message with its time and exact words, every amended prompt word for word, and anything odd (a refusal, an error, a missing attachment). Keep the log in your notes and post it in this chat only after each game is done and after every 10 pictures, as one block; between those, post one short progress line per tick if you like, never a long message while a tab is waiting.

### IMAGE LIMITS

If ChatGPT says you've hit the image limit, log the time and its exact words. Start no new prompts; let the windows already generating finish and harvest them. Wait until the time it gives (or check about every 30 minutes), then carry on from the same prompt. Don't stop the run and don't switch to another tool.

### RESUMING

If this sheet is handed to you again later with the word "resume", read the log posted in this chat: every line with a chat link is a kept picture. Carry on from the first prompt in the run order that has no such line.

### AT THE END (and after each game)

After each game, post a short list: kept (and any fault noted), retried (and why), skipped or stalled (and why), each kept picture with its chat link and title.

At the very end, or as soon as Zafar says "stop" or "download" in this chat, post the whole log as one block, then download every kept picture for Zafar, in the run order, one at a time: open https://chatgpt.com/library, find the kept picture (by its chat's title and its thumbnail; the newest kept try of that chat), open it and download it with ChatGPT's own download button, which is Chrome's normal download into the Downloads folder. The file keeps the name ChatGPT gives it; you cannot rename it, so log each download at once, in order, as "DOWNLOADED <n>: <ChatGPT's title, as the file is named> -> mockup-<ID>.png". When every kept picture is down, post the whole log once more with that numbered title -> save-as list at its end: Zafar renames from it and pushes the folder and the log to the repo himself. Never page JavaScript, never a GitHub upload, never a file picker. If a download is refused, say so, log it, and post the ordered list of chat links, titles and save-as names instead; Zafar downloads from it.

## 2. The run order

Run the 18 games in this order; within a game, in the order listed. A prompt marked WAITING starts as soon as the prompt it needs is KEPT (its kept image goes in first, from ChatGPT's library). A free window takes any READY prompt, even from a later game.

1. **clinic-every-part** (The clinic, every part, 5): clinic-every-part-1, clinic-every-part-2, clinic-every-part-3, clinic-every-part-4, clinic-every-part-5
2. **farm-animals** (Farm: the animals, 4): farm-animals-1, farm-animals-2 (WAITING for farm-animals-1), farm-animals-3 (WAITING for farm-animals-1), farm-animals-4 (WAITING for farm-animals-1)
3. **farm-eggs-orchard** (Farm: eggs and orchard, 4): farm-eggs-orchard-1, farm-eggs-orchard-2, farm-eggs-orchard-3 (WAITING for farm-eggs-orchard-2), farm-eggs-orchard-4
4. **hide-and-seek** (Hide and seek, 5): hide-and-seek-1, hide-and-seek-2, hide-and-seek-2b, hide-and-seek-3, hide-and-seek-4
5. **pick-it-up-put-it-back** (Pick it up, put it back, 4): pick-it-up-put-it-back-1, pick-it-up-put-it-back-2, pick-it-up-put-it-back-3, pick-it-up-put-it-back-4
6. **clean-up-day** (Clean-up day, 4): clean-up-day-1, clean-up-day-2, clean-up-day-3, clean-up-day-4
7. **party-gifts** (Party: gifts, 5): party-gifts-1, party-gifts-2, party-gifts-3, party-gifts-4, party-gifts-5
8. **party-guests** (Party: guests, 4): party-guests-1, party-guests-2, party-guests-3, party-guests-4
9. **do-it-engine** (Do it (statues and getting ready), 5): do-it-engine-1, do-it-engine-2, do-it-engine-3, do-it-engine-4, do-it-engine-5
10. **town-map** (Town map, 4): town-map-1, town-map-2, town-map-3, town-map-4
11. **shops** (Shops, 4): shops-1, shops-2, shops-3, shops-4
12. **adoption-centre** (Adoption centre, 4): adoption-centre-1, adoption-centre-2 (WAITING for adoption-centre-1), adoption-centre-3 (WAITING for adoption-centre-1), adoption-centre-4 (WAITING for adoption-centre-1)
13. **safari** (Safari, 5): safari-1, safari-2, safari-3, safari-4, safari-5
14. **beach-boat** (Beach and boat, 5): beach-boat-1, beach-boat-2, beach-boat-3, beach-boat-4, beach-boat-5
15. **school-day** (School day, 4): school-day-1, school-day-2, school-day-3, school-day-4
16. **wake-up-clock** (Wake-up clock, 4): wake-up-clock-1, wake-up-clock-2, wake-up-clock-3, wake-up-clock-4
17. **sewing** (Sewing, 4): sewing-1, sewing-2, sewing-3, sewing-4
18. **cook-baking-eggs** (Cook: baking and eggs, 5): cook-baking-eggs-1, cook-baking-eggs-2, cook-baking-eggs-3, cook-baking-eggs-4, cook-baking-eggs-5 (WAITING for cook-baking-eggs-2)

79 prompts in all.

## 3. The prompts

Each code box is copied exactly from the game's design (`build/reports/designs/<slug>.md`, section 11). The design's own list of reference URLs, which sat at the bottom of each box, has been taken out of the box and turned into the attach line: never paste URLs into ChatGPT.

### 1. clinic-every-part (The clinic, every part)

#### clinic-every-part-1: the body chart ("where does it hurt?")

- **shows:** The diagnosis with no clue on the body: the patient on the bed, looking at the doctor, a soft glow on the one part just tapped
- **attach (3):** exam-bed.png, boy-front.png, doctor-3q.png
- **save as:** mockup-clinic-every-part-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, no buttons.

The scene, at eye level, matching the attached examination-room background: a calm, modern doctor's examination room with limewash cream walls, a pale oak floor and a plain wall behind the patient. A boy of about seven, as in the attached boy reference, in a green short-sleeved T-shirt and knee-length navy shorts, sits on the edge of a padded examination bed covered by a white paper strip, legs dangling, both hands resting in his lap, looking at the doctor, not at his hands. He has no mark, bandage or redness anywhere. To the right stands the doctor from the attached doctor reference, turned three-quarters towards the boy, holding a clipboard, friendly.

The moment: the child has just tapped the boy's right hand. A soft, warm red glow surrounds that hand only. The boy's face shows a small "ow" wince that is comic, not upset. Nothing else glows or changes.

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, clean surfaces, big expressive eyes, no outlines, no photorealism, no blur or vignette.

Absolutely no text, letters or numbers anywhere: not on the clipboard, the walls, the clothes or any sign. No inset, bubble, frame or interface element.

Must read at phone size (740x320 and 915x275): the boy's whole body, his hands and the glow, large and uncluttered. Keep the left quarter of the frame plain wall.

Wide landscape, 16:9, with the boy and the doctor inside the middle band so it crops to 3:1 without losing a face.
```

#### clinic-every-part-2: the cut game (the scrape)

- **shows:** The arm close-up with two look-alike scrapes and the cold-water splash
- **attach (3):** bed-closeup.png, forearm-graze.png, boy-front.png
- **save as:** mockup-clinic-every-part-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel.

The scene, seen straight down from above, matching the attached close-up bed: a boy's arm, from the shoulder to the fingertips, lies along a white paper strip on an examination bed, palm down, with a green short sleeve at the shoulder, drawn like the attached forearm close-up. There are two small, identical, pinkish grazes: one on the elbow and one on the back of the hand. They are comic and clean, never bloody or gory. The blurred, warm room shows around the edges.

On the right edge stands a neat column tray, also seen straight down, holding:
- a small steel bowl of clear water
- a white cream tube
- a fan of fabric plasters in red, blue, green and yellow
- a tissue box

The moment: the water bowl has just been tapped, and a bright, splashy wash of clear water lands on the elbow graze. Tiny specks of garden grit lift off it in little sparkles. In a round face circle in the top corner, the boy shivers with a funny wide-eyed "cold!" face.

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (steel, cotton, paper), soft contact shadows, no outlines, no photorealism.

Absolutely no text, letters or numbers anywhere: not on the tube, the plasters or the tissue box.

Must read at phone size (915x275 and 740x320): the two grazes clearly separate and the same size, each tray item big and distinct, and the face circle.

Wide landscape, 16:9, with the arm and the tray inside the middle band so it crops to 3:1.
```

#### clinic-every-part-3: the nose (the tissue arrives)

- **shows:** The moment the tissue reaches the blocked nose and the sneeze builds, with the dropper already back on the tray
- **attach (3):** girl-face-eyes.png, girl-face-aah.png, bed-closeup.png
- **save as:** mockup-clinic-every-part-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel.

The scene, at eye level: the head and shoulders of the girl in the attached face reference, about six, front-on, sitting up against a plain limewash cream wall. She wears a plain cream kameez with a few bold red motifs at the neck, and her dark hair is in a neat plait. Her nose is a little pink at the tip. Her eyes are squeezed half shut and her mouth is open in a comic "aah… aah…" build-up just before a sneeze, with her shoulders lifted.

The moment: a soft white tissue, just pulled from its box, has arrived in front of her nose, touching only the outside of it. The small glass dropper with a rubber bulb lies back on the tray, finished with.

A small steel tray at the bottom edge, seen from above, holds:
- the tissue box
- the glass dropper
- a white cream tube

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, big expressive eyes, rosy cheeks, no outlines, no photorealism. Funny and gentle: nothing messy or gross.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (740x320 and 915x275): her face and the tissue big and clear, with the tray items still recognisable.

Wide landscape, 16:9, her face inside the middle band so it crops to 3:1 at the forehead and chin, not at the nose.
```

#### clinic-every-part-4: the drinks for a cough or a tummy ache

- **shows:** The small counter with all six ingredients, an empty cup, and the patient waiting with no clue about what's wrong
- **attach (3):** boy-front.png, exam-bed.png, honey-jar.webp
- **save as:** mockup-clinic-every-part-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel.

The scene: on the left, the boy from the attached reference, about seven, sits up on an examination bed, front-on, fully clothed in a green T-shirt, both hands resting in his lap, looking hopefully towards a cup. His face is calm and friendly, with no sign of what is wrong: no hand on his chest or tummy, no cough, no wince.

On the right, a small marble counter is seen from slightly above, with six clearly different ingredients in a row:
- a jar of golden honey with a wooden dipper
- two halved yellow lemons
- a knob of fresh ginger
- a small brass bowl of turmeric powder
- a steel jug of milk
- a steel jug of water

In the middle sits an empty steel cup with a teaspoon resting beside it. Nothing is moving: no steam, no drips, no pouring.

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (steel, brass, glass, marble), soft contact shadows, no outlines, no photorealism. Modest, warm and calm.

Absolutely no text, letters or numbers anywhere: not on the jars, jugs or bowls.

Must read at phone size (915x275 and 740x320): each of the six ingredients distinct and big enough to tap, plus the cup and the boy's face.

Wide landscape, 16:9, with the boy, the counter and the cup inside the middle band so it crops to 3:1.
```

#### clinic-every-part-5: the hand splinter

- **shows:** The palm close-up with splinters in named fingers, each on its own winding path, and one partway along it
- **attach (3):** bed-closeup.png, foot-sole.png, boy-front.png
- **save as:** mockup-clinic-every-part-5.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel.

The scene, seen straight down from above, matching the attached close-up bed: a child's open hand lies palm up on a white paper strip, fingers gently spread, with a green short sleeve at the wrist. There are three tiny wooden splinters:
- one in the thumb
- one in the middle finger
- one in the little finger

Each sits in its own faintly lighter, winding channel that runs with soft right-angle turns to the edge of the hand. The splinter in the thumb is halfway along its channel, sliding along it by itself: no tweezers, no tool and no other hand anywhere in the picture. A small sparkle marks its progress. The skin is clean, never bloody.

In a round face circle in the top corner, the child's face shows a brave, scrunched "careful…" expression.

At the right edge, a steel kidney tray seen from above holds:
- a fan of coloured fabric plasters
- two small jugs, one with gentle steam (hot) and one beaded with cold drops (cold)

Style: like the attached references, a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, soft contact shadows, no outlines, no photorealism.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (740x320 and 915x275): the three channels clearly separate, the splinters visible, the jugs' hot and cold easy to tell apart, and the face circle.

Wide landscape, 16:9, with the hand and the tray inside the middle band so it crops to 3:1.
```

### 2. farm-animals (Farm: the animals)

#### farm-animals-1: Feeding time (stage 5, L2)

- **shows:** The feeding moment, so Zafar can see the yard, the three animals with their troughs, and what the child taps (the basket, then a trough), with cobs that can be counted
- **attach (5):** farm-fields.png, farm-animals-a1.png, nani-sheet.png, family-lineup.png, props-sheet.webp
- **save as:** mockup-farm-animals-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: a sunny farmyard seen at eye level, front on. A simple wooden rail fence and a soft green field with a few round trees behind; a small whitewashed shed with a wooden door at the back right, partly cropped. The sky is only a thin strip at the top. On the ground in the middle, three animals stand behind their own low wooden troughs: a cream-and-tan she-goat with small curved horns at the front left, a big, plump red-brown hen with three fluffy yellow chicks at her feet at the front right, and a brown-and-white cow standing a little further back between them, slightly overlapped by them, with its trough behind theirs. In the bottom-left corner of the play area sits a woven basket full of yellow corn cobs. At the right edge, cut at the chest, stands the grandmother from the attached character sheet, turned three-quarters toward the animals, smiling warmly. No other people.

The moment: the child has just tapped the basket, then the goat's trough. Two corn cobs lie clearly separate in the goat's trough; the goat leans in with wide delighted eyes, its beard wobbling, about to munch. The other two troughs are empty. No glow, outline or highlight on anything.

Style: match the attached references. A stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (wood grain, woven straw, glossy corn kernels), soft contact shadows under every animal and trough. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters or numbers anywhere: none on the basket, the troughs, the shed or the fence.

Must read at phone size (about 740x320 pixels): each animal's face and body, which trough belongs to which animal (the cow's trough behind), the two separate cobs in the goat's trough, and the basket of cobs.
```

#### farm-animals-2: The photo shoot (stage 7, L2)

- **shows:** The verb game: the goat doing the asked action at one of four places, inside the camera frame, at the click
- **attach (4):** kept:farm-animals-1, farm-animals-a1.png, nani-sheet.png, props-sheet.webp
- **save as:** mockup-farm-animals-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: the same farmyard as the first attached image, at midday, eye level, front on, with a thin strip of sky, a wooden rail fence and green fields behind. Around the yard are four clearly different places, spaced well apart: on the left a low wooden trough with corn cobs; in the middle a round steel bucket of water; on the right a bed of golden straw under a small wooden awning; at the back an open wooden gate onto the green field. A big, plump red-brown hen pecks quietly in the background. At the right edge, cut at the chest, the grandmother from the attached character sheet holds a simple boxy instant camera at chest height, smiling.

The moment: the child tapped the water bucket, and the cream-and-tan she-goat has trotted over and is drinking, water dripping from its beard. Around the goat are four soft rounded gold corner brackets, plain lines only. The child has just tapped inside them: a soft white camera flash bursts, and the goat has lifted its head to look straight into the lens with a cheeky, pleased face.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (steel bucket, wood, straw, water), soft contact shadows. No outlines, no cel shading, no photorealism, no depth-of-field or motion blur.

Absolutely no text, letters or numbers anywhere, including on the camera and the bucket. No readouts, symbols, bars, dots or icons inside or around the corner brackets: no REC, no battery, no counters, no focus marks.

Must read at phone size (about 740x320 pixels): the goat's action (drinking), the four places as four distinct shapes, the gold corner brackets, and the goat's look into the lens.
```

#### farm-animals-3: Home at dusk, calling (stage 9, the speaking moment)

- **shows:** The speaking moment, so Zafar can judge whether "call it and it comes" reads without words: the child at the gate and the called animal trotting over
- **attach (5):** kept:farm-animals-1, farm-animals-a2.png, farm-animals-a1.png, nani-sheet.png, family-lineup.png
- **save as:** mockup-farm-animals-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: the same farmyard as the first attached image, relit for golden evening, eye level, front on. Low warm orange sun from the left, long soft shadows to the right, a peach-and-gold sky strip. At the back, a small whitewashed shed with its wooden door open and a warm lamp glow in its little window; beside it, a small wooden hen-house with a ramp. A big, plump red-brown hen is just walking up the ramp, with three yellow chicks following in a neat line, and the last chick hurrying back with a single corn kernel in its beak. In the yard, a brown-and-white cow stands sleepily. At the front right, by an open wooden gate, stands a small child of about five in simple modest clothes, holding up one corn cob, facing the animals, mouth open as if calling; beside the child, turned toward them and smiling, the grandmother from the attached character sheet. The sky above the child's head is empty.

The moment: the child has just called, and the cream-and-tan she-goat has turned with its ears up and is trotting happily toward the child and the corn cob, one hoof lifted.

Style: match the attached references. A stylised 3D animated-feature look, warm golden-hour light, gentle global illumination, chunky simplified shapes, clean surfaces, soft contact shadows. No outlines, no cel shading, no photorealism, no blur.

Absolutely no text, letters, numbers, speech bubbles, icons or symbols anywhere.

Must read at phone size (about 740x320 pixels): which animal is coming (the goat), the child with the corn cob, and the shed door with its glowing window.
```

#### farm-animals-4: The photo shoot at L4 (look-alikes)

- **shows:** How the harder level looks different: two goats, big and small, with the small goat mid-leap in the frame in mid-field and the big one watching
- **attach (4):** kept:farm-animals-1, farm-animals-a2.png, farm-animals-a1.png, props-sheet.webp
- **save as:** mockup-farm-animals-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: the same farmyard as the first attached image, at midday, eye level, front on, a thin strip of sky, a wooden rail fence, an open wooden gate onto a green field at the back. On the left, a big cream-and-tan she-goat stands by a low wooden trough of corn cobs. A round steel bucket and a bed of golden straw under a small awning sit on the right, with nobody at them.

The moment: the small cream-and-tan goat (clearly the same kind as the big one, about half its size, with a younger face) has raced back through the gate and is caught mid-leap in the middle of the yard, all four hooves off the ground, at the same depth as the big goat so their sizes compare. Around the small goat, four soft rounded gold corner brackets, plain lines only, with clear space between the goat and the brackets; a soft white camera flash bursts. The big goat watches it with a surprised face.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, soft contact shadows on everything touching the ground and a shadow on the ground under the leaping goat. No outlines, no cel shading, no photorealism, no motion blur.

Absolutely no text, letters or numbers anywhere. No readouts, symbols, bars, dots or icons inside or around the corner brackets.

Must read at phone size (about 740x320 pixels): the big goat and the small goat as clearly different sizes, and the leaping small goat whole inside the gold brackets.
```

### 3. farm-eggs-orchard (Farm: eggs and orchard)

#### farm-eggs-orchard-1: collect the eggs (L2)

- **shows:** The hen house at the moment a hen has hopped down off her nest: her eggs in the open in the nest, countable, and the chick tumbling out
- **attach (4):** farm-animals-a1.png, nani-sheet.png, style-anchor.png, props-sheet.webp
- **save as:** mockup-farm-eggs-orchard-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, 16:9 landscape, the main play area only, no side panel and no buttons.

The scene: inside a small, sunny wooden hen house on a farm, seen straight on at eye level, the horizon at about 55% of the height. Across the middle runs a low wooden plank shelf with three round straw nests in a row, evenly spaced, the nests seen from slightly above (about 10 degrees down) so what is in them shows. On two nests sit hens, clearly different from each other: on the left, a big plump red-brown hen; on the right, a small white hen. The middle nest belongs to a big white hen, who has just hopped down off the shelf: she stands on the straw-covered floor beside and below her nest, wings half open, beak open in a cluck, one small feather drifting, her head lower than the nest's rim. Her nest is now open and in plain view: four smooth cream eggs lie clearly separate in the straw, three in front and one behind, every one fully visible and easy to count, and a fluffy yellow chick is tumbling out over the nest's rim, beak open, cheeping. At the bottom left of the frame, a small woven basket seen from slightly above holds one egg. At the right edge, cut at the chest, stands the grandmother from the attached character sheet, three-quarter on, smiling at the hens, beside a wooden egg crate on the floor. Behind, the open doorway shows a bright farmyard where two more yellow chicks peck, and warm sunlight falls in, making soft patches on the straw.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows under every hen, nest, basket and crate, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: not on the crate, the basket, the walls or anything else.

It must read at phone size (about 740x320 pixels): each hen's size and colour clearly different; the four eggs big, smooth and bright against the straw, nothing covering them; the chick bright yellow and obvious; the grandmother's face clear of everything.
```

#### farm-eggs-orchard-2: the orchard and vegetable patch, picking (L3)

- **shows:** The patch as the child picks: several kinds side by side, more than asked, ripe and unripe, one fruit bouncing into the basket, and the goat over the fence munching
- **attach (4):** farm-fields.png, farm-animals-a1.png, nani-sheet.png, props-sheet.webp
- **save as:** mockup-farm-eggs-orchard-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, 16:9 landscape, the main play area only, no side panel and no buttons.

The scene: a sunny kitchen garden on a farm, seen side-on at eye level, the horizon at about 55% of the height, flat ground. Across the middle stand four low plants in a row, all small enough that their fruit hangs in the middle of the frame: a small mango tree with six mangoes, some ripe yellow-orange and some green, some big and some small; a lemon tree with bright yellow lemons; a row of staked tomato plants with red tomatoes and green tomatoes; a bushy chilli plant with red and green chillies. Every plant has plenty of fruit. In front of the plants runs a narrow strip of freshly dug dark soil with three empty round gaps. Behind the plants runs a low wooden fence; at the right it ends at a thick post, and a large woven basket stands on the ground against that post, seen from slightly above, holding two lemons and one mango. One yellow mango has just been tapped: it is in mid-air, bouncing in a small arc towards the basket, and the mango tree's leaves are still shaking. Over the fence just above the basket, a friendly cream-and-tan goat stretches its neck and happily munches a green tomato. At the far right edge, cut at the chest, stands the grandmother from the attached character sheet, three-quarter on, smiling. Beyond the fence, gentle green fields and a soft blue sky.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm and uncluttered.

Absolutely no text, letters or numbers anywhere.

It must read at phone size (about 740x320 pixels): each fruit big, chunky and clearly its own kind; red against green clear on the tomatoes and chillies; big and small mangoes clearly different; the fruit in the basket countable; the goat's head clear of the grandmother's face.
```

#### farm-eggs-orchard-3: plant and water, in the same patch (L1)

- **shows:** The same patch at planting time: saplings in pots to choose from, one just planted and being watered, and one already grown in its gap
- **attach (4):** kept:farm-eggs-orchard-2, nani-sheet.png, style-anchor.png, props-sheet.webp
- **save as:** mockup-farm-eggs-orchard-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, 16:9 landscape, the main play area only, no side panel and no buttons.

The scene: exactly the same sunny kitchen garden as the first attached image, the same eye-level side-on camera, the same plants, fence and fields. The basket and the goat are gone. In the strip of dug dark soil in front of the plants, three round gaps: in the left gap stands a freshly grown small lemon tree with three bright lemons, just as tall as the lemon tree behind it is wide; in the middle gap a small young tomato plant has just been planted, and a green metal watering can, held by no one and tilted in mid-pour, pours a gentle stream of water onto the soil at its foot, the soil darkening; the right gap is open and empty. Along the bottom edge stand two small terracotta pots with young plants: a lemon sapling showing one small lemon, and a tomato sapling showing one small red tomato. At the far right edge, cut at the chest, stands the grandmother from the attached character sheet, three-quarter on, smiling at the new plants. Warm sunlight from the upper left, soft contact shadows under the pots, the can and the plants.

Style: match the attached references. A stylised 3D animated-feature look, soft warm light, chunky simplified shapes, clean surfaces, no outlines, no photorealism. No glitter, sparkles or particles. Calm and uncluttered.

Absolutely no text, letters or numbers anywhere, including on the pots.

It must read at phone size (about 740x320 pixels): the three gaps clearly separate; the two saplings instantly recognisable by their fruit; the water stream and the newly grown lemon tree easy to see.
```

#### farm-eggs-orchard-4: the corn stall's grill

- **shows:** The corn stall's worktop from exactly overhead: cobs grilling in different states, every dressing and chutney out at once, and one cob being dressed
- **attach (3):** style-anchor.png, props-sheet.webp, grill-tray-sheet.png
- **save as:** mockup-farm-eggs-orchard-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, 16:9 landscape, the main play area only, no side panel and no buttons.

The camera looks exactly straight down (90 degrees) onto a roadside stall's worktop of pale oak, with no horizon, no walls and no perspective tilt: every rim reads as a circle. Centre left, a rectangular charcoal grill tray with glowing coals under a dark grate holds three corn cobs lying side by side: one pale and raw, one golden with blistered kernels, and one half turned with a darker charred stripe. On the right, a small round steel plate holds a golden roasted cob; a lemon half above it is being squeezed, with a few bright droplets falling onto the kernels. Next to the plate stand three small round steel bowls of chutney: a white coconut chutney, a bright green mint chutney and a dark brown tamarind chutney, each with a little spoon. Along the bottom edge, in a neat row, sit four small round steel shaker bowls: red chilli powder, a pale cream garlic powder, white salt and black pepper, with two fresh lemon halves beside them. A small wooden crate of raw cobs sits at the top left. Warm sunlight from the upper left, soft contact shadows, nothing floating, no smoke or haze.

Style: match the attached references. A stylised 3D animated-feature look, soft warm light, believable materials (brushed steel, oak, charcoal, glossy kernels), chunky simplified shapes, no outlines, no photorealism. Calm and uncluttered.

Absolutely no text, letters or numbers anywhere: not on the crate, the bowls or the shakers.

It must read at phone size (about 740x320 pixels): the three cob states (raw, golden, charred) clearly different; the four powders clearly different in colour, with the salt and the garlic powder close but distinguishable; the three chutneys clearly different colours.
```

### 4. hide-and-seek (Hide and seek)

#### hide-and-seek-1: the first find (L1, the bedroom by day)

- **shows:** The core: the child opened the wardrobe and the big black cat is inside, while every other place stays closed and alike
- **attach (6):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, cook-nani-sheet.webp, props-sheet.webp, farm-animals-a1.png
- **save as:** mockup-hide-and-seek-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only, no side panel, no buttons, no interface.

The scene: a bright, modern bedroom in a grandmother's house, seen straight on at eye level like a stage set, horizon at about half height, one-point perspective, verticals vertical. Limewash cream walls, a pale oak floor with a soft rug. Left to right along the back wall: a tall pale-oak wardrobe with two doors; a window with a soft indigo block-printed curtain drawn closed; a single bed seen side-on with a patterned cover hanging all the way to the floor so nothing underneath can be seen; a low sage-green cupboard with one door. On the rug in front, a closed wooden toy box with a lid. On the far right, the bedroom door stands wide open onto a plain hallway; nobody is in it. One small mirror-work frame on the wall, nothing else on the walls. Warm late-morning sunlight from the upper left, soft contact shadows.

The moment: the wardrobe doors have just swung open. Inside, on a pile of folded clothes, a big solid charcoal-black cat with green eyes, a round face and a dark collar with a small silver bell, lifts his head and blinks sleepily, clearly delighted to be found. Every other place (curtain, bed cover, cupboard, toy box) is closed and looks ordinary: no tails, no bulges, nothing peeking out. On the right edge of the frame stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. She is turned three-quarters towards the wardrobe, laughing with her hands together. At her feet sits a small silver-grey kitten with big ears, a big head and yellow-green eyes, looking up at the wardrobe.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, believable materials, no outlines, no cel shading, no photorealism. Calm, uncluttered, modern with only a hint of Kutch and East African culture.

Absolutely no text, letters or numbers anywhere: not on the toy box, the wall, the curtain or any object.

Must read at phone size (the image will be shown about 320 pixels tall): each of the five hiding places as a clearly separate, big, simple shape; the cat's green eyes inside the wardrobe; the grandmother's face.

Wide landscape frame, about 2.3:1.
```

#### hide-and-seek-2: a funny empty spot (L2, both cats hiding)

- **shows:** That a wrong place is a joke, not a failure. One surprise only, both cats hidden, no Nana
- **attach (5):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, cook-nani-sheet.webp, props-sheet.webp
- **save as:** mockup-hide-and-seek-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only, no side panel, no buttons, no interface.

The scene: the same modern bedroom in a grandmother's house, seen straight on at eye level like a stage set, horizon at about half height. Limewash cream walls, pale oak floor, a soft rug, warm sunlight from the upper left. Along the back: a tall pale-oak wardrobe (closed), a window with an indigo block-printed curtain (drawn closed), a single bed with a patterned cover hanging to the floor (down), a low sage-green cupboard (closed), and a small pale-oak chest of drawers with its bottom drawer shut. On the rug in front: a woven laundry basket with its lid on, and a wooden toy box. On the far right, the bedroom door stands wide open onto a plain, empty hallway.

The moment: the toy box's lid has just popped up and a single striped sock has bounced out on a little spring, wobbling comically in mid-air. That is the only thing open. No cats can be seen anywhere: every other place is closed and looks ordinary, with nothing peeking out. On the right edge stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs, a plain red dupatta over her head, thin round gold glasses, no rings. She laughs at the sock with a hand to her cheek.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, believable materials, no outlines, no cel shading, no photorealism. Calm, modern, uncluttered: one joke, one face.

Absolutely no text, letters or numbers anywhere: not on the sock, the box, the drawers or any object.

Must read at phone size (about 320 pixels tall): the seven hiding places as separate, simple shapes that all look equally closed; the sock; the grandmother's face.

Wide landscape frame, about 2.3:1.
```

#### hide-and-seek-2b: Nana at the door (a character study for 1b)

- **shows:** Not a gameplay frame: Nana alone, so his look can be approved before he goes into the room
- **attach (3):** family-lineup.png, customers-sheet.webp, cook-service-bg.jpg
- **save as:** mockup-hide-and-seek-2b.png

```
Character study for a children's language game (ages 3-8). Two poses of the same man side by side on a plain warm cream background, nothing else in the picture.

The character: a kindly grandfather in his seventies with a neat white beard, a plain white cap, a cream kurta and a soft shawl over one shoulder. Warm light-tan skin (midtone about #C49A78, never orange). A gentle, slightly deadpan, knowing face. He is a generic character: he must not look like the older man in the attached lineup, whose picture is attached only for the style and skin tone.

Pose 1: his head and shoulders lean in round the edge of a pale-oak door frame (only the frame's edge shows), smiling knowingly and pointing a finger to the left, as if he knows where the cat is hiding.
Pose 2: the same lean round the frame, one finger raised beside his cheek, eyebrows up, as if saying "I think …".

Style: match the attached references: a stylised 3D animated-feature look, soft warm light from the upper left, chunky simplified shapes, believable fabric, no outlines, no cel shading, no photorealism. Camera at eye level, straight on.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (each pose about 120 pixels tall): his face, the beard and cap, the pointing hand.

Landscape frame, about 2:1.
```

#### hide-and-seek-3: the big cat in the small box (L4, 1b, look-alike pairs)

- **shows:** The hardest level: two boxes and two baskets of different sizes, where the size word decides, and the game's best joke
- **attach (6):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, cook-nani-sheet.webp, props-sheet.webp, farm-animals-a1.png
- **save as:** mockup-hide-and-seek-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only, no side panel, no buttons, no interface.

The scene: the same modern bedroom in a grandmother's house, straight on at eye level like a stage set. Limewash cream walls, pale oak floor, soft rug, warm sunlight from the upper left. Along the back: a closed pale-oak wardrobe, a window with an indigo block-printed curtain drawn closed, a bed with a patterned cover hanging all the way to the floor, a low sage-green cupboard, a small chest of drawers with its bottom drawer shut, and a soft quilt heaped on a floor cushion at the foot of the bed. On the rug in front, clearly side by side as look-alike pairs: a big wooden toy box and a small wooden box of the same design; a big woven laundry basket and a small woven sewing basket of the same design, all with lids. On the far right, the bedroom door stands wide open onto an empty hallway.

The moment: the lid of the SMALL box has just been lifted, and a big, solid charcoal-black cat with green eyes and a collar with a small silver bell is squeezed inside it, far too big for it, spilling over the edges with a sheepish, proud face. Everything else is closed and looks ordinary: the big box beside it is shut, the bed cover hangs straight to the floor, the quilt is just a soft heap, and no other cat, tail, ear or eye can be seen anywhere. On the right edge stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs, a plain red dupatta over her head, thin round gold glasses, no rings. She laughs with both hands over her mouth.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. Calm and uncluttered; the joke comes from the cat, not from mess.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 320 pixels tall): the size difference between each pair (the big box and the small box, the big basket and the small basket); the black cat overflowing the small box; the grandmother's face.

Wide landscape frame, about 2.3:1.
```

#### hide-and-seek-4: bedtime with the torch (later visit)

- **shows:** The night version: the same room relit for night, a torch beam where the child tapped, and the cat's eyes shining back (the find itself, so a visible cat is right here)
- **attach (6):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, cook-nani-sheet.webp, props-sheet.webp, farm-animals-a1.png
- **save as:** mockup-hide-and-seek-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only, no side panel, no buttons, no interface.

The scene: the same modern bedroom in a grandmother's house, straight on at eye level like a stage set, now at night. The same furniture in the same places: a pale-oak wardrobe, a window with an indigo block-printed curtain half open showing a deep blue night sky and a soft moon, a bed with a patterned cover hanging to the floor, a low sage-green cupboard, a small chest of drawers, a wooden toy box and a laundry basket on the rug, the bedroom door open onto a dark hallway. The room is dark in a cosy way: cool blue moonlight from the window and a soft warm glow from a small bedside lamp turned very low. Shadows are soft.

The moment: a round, warm pool of torch light falls on the bed, where the cover has been lifted a little. In the dark gap under the bed, two big yellow-green eyes shine back and a silver-grey kitten with big ears blinks, caught and pleased. Everything else is in gentle darkness; no other eyes, tails or shapes give anything away. On the right stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs, a plain red dupatta over her head, thin round gold glasses, no rings. She holds a simple torch, smiling, lit softly by its glow.

Style: match the attached references: a stylised 3D animated-feature look, chunky simplified shapes, believable materials, no outlines, no photorealism. Night lighting that stays warm and safe, never scary.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 320 pixels tall): the torch pool and the kitten's shining eyes; the outlines of each hiding place even in the dark; the grandmother's face.

Wide landscape frame, about 2.3:1.
```

### 5. pick-it-up-put-it-back (Pick it up, put it back)

#### pick-it-up-put-it-back-1: the guided room and the two copies (stage 1, L1)

- **shows:** The house open like a doll's house, Nana squinting in the sitting room, and the kitchen lit with two identical pairs of glasses, one on the table and one under it
- **attach (4):** house-wide.png, cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp
- **save as:** mockup-pick-it-up-put-it-back-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: a two-storey family house in warm limewash cream, shown as a doll's house: the whole front wall has been removed so we see straight into five rooms, like a cross-section, at eye level, front on, one-point perspective, verticals perfectly vertical. Upstairs, three rooms side by side: a small bathroom, a boy's bedroom with a few toys, and the bedroom described below; downstairs, two wider rooms: the kitchen and the sitting room. A thin strip of pale blue sky above the roof and a thin strip of green lawn below. Downstairs from left to right: a calm modern kitchen with plain sage cabinets and a worktop along the back wall, and a small wooden table with one wooden chair standing clear in the middle of the floor; a sitting room with a cream sofa, a low wooden table and a wooden armchair. Upstairs on the right: a bedroom with a pale-oak wardrobe, a window with an indigo block-printed curtain, a single bed with a patterned cover hanging to the floor, a low sage-green cupboard and a small pale-oak bedside table standing clear on the floor. Each room has a little floor depth so things can sit under the furniture. Each room is calm and uncluttered, with at most one cultural accent (an ajrakh-print cushion on the sofa, a small mirror-work frame in the bedroom).

The moment: in the sitting room, a grandfather sits in the armchair, turned three-quarters towards us, holding a newspaper at arm's length and squinting at it because his glasses are missing. He is a generic character drawn like the attached customers sheet: a white knitted cap, a white beard, a cream kurta and a brown waistcoat; he must not look like the older man in any real-family reference. In the kitchen, two identical pairs of round reading glasses: one pair lies on the small table, the other pair lies on the floor directly under the same table. A red-and-blue rubber ball sits on the worktop at the back. The kitchen glows: a soft breathing gold light outlines the kitchen's room box, and the other four rooms are very slightly dimmed. A big black cat with green eyes and a small grey kitten with green eyes trot across the sitting-room floor.

Style: match the attached references. A stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (limewash, pale oak, brass, cotton), soft contact shadows under every object. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters or numbers anywhere: none on the newspaper (show only soft grey blocks), the walls or any object.

Must read at phone size (about 740x320 pixels): each of the three rooms as its own box, the two identical pairs of glasses and which is on the table and which is under it, the grandfather's squint, and the gold glow on the kitchen.
```

#### pick-it-up-put-it-back-2: put it away, every spot ringed (stage 2, L2)

- **shows:** The bedroom close up, Nani on the right, two pieces of furniture each with two identical rings, and a ball rolling into the spot the child tapped
- **attach (5):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, cook-nani-sheet.webp, props-sheet.webp
- **save as:** mockup-pick-it-up-put-it-back-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: one room of a doll's-house cross-section, close up: a calm, modern bedroom in a grandmother's house, seen at eye level, front on, the front wall removed, a little floor depth visible. Limewash cream walls, a pale oak floor, a soft rug. Along the back wall, as quiet scenery: a pale-oak wardrobe, a window with an indigo block-printed curtain drawn closed, a low sage-green cupboard. In the room, well apart: a single bed seen side-on with a patterned cover hanging to the floor, left of centre, and a small pale-oak bedside table standing clear on the floor, right of centre. One small mirror-work frame on the wall, nothing else. Thin slivers of the neighbouring rooms show at the left and right edges. On the rug in the foreground lie a tan handbag and a plain white cup. On the right of the room, in front of an open door to the hall, stands the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. She is cut at the hip, turned three-quarters towards the room, smiling, hands relaxed at her sides (she is not pointing).

The moment: four identical soft white dotted rings: on top of the bed, on the floor under the bed at the hem of its cover, on top of the bedside table, and on the floor under the bedside table. The rings are all exactly the same size and shape. A red-and-blue rubber ball is rolling into the ring under the bed, and the cover's hem lifts a little as it goes. A small grey kitten with green eyes pads up to sniff the ball.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (pale oak, cotton, leather, rubber), soft contact shadows. No outlines, no cel shading, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320, and as short as 915x275): the four identical rings, the ball going under the bed, the grandmother's face, the bag and the cup on the rug.
```

#### pick-it-up-put-it-back-3: Simba's paw (stage 3, 1b, L2)

- **shows:** The cat caught in the act in the sitting room, with two things moved onto other real spots and the rest untouched, so Zafar can see that nothing on screen says which things moved
- **attach (3):** cook-service-bg.jpg, props-sheet.webp, farm-animals-a1.png
- **save as:** mockup-pick-it-up-put-it-back-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: a sitting room in a doll's-house cross-section, eye level, front on, the front wall removed, a little floor depth visible. A cream sofa on the left with one ajrakh-print cushion, a low wooden table in the middle, an empty wooden armchair on the right. Limewash cream walls, pale oak floor, calm and uncluttered. Slivers of the neighbouring rooms at the edges.

The moment: a big black cat with bright green eyes and a small silver bell on his collar stands on the sofa with one front paw still raised mid-swipe and a cheeky, guilty face, a pair of round reading glasses sitting crooked on his nose. Around the room, four things, each sitting neatly in a real place as if placed there: a tan handbag on the low table, a small teddy bear under the low table, a red-and-blue rubber ball on the armchair seat, a plain white cup on the floor under the armchair. Nothing is on the floor loose, nothing is tipped over, nothing is broken.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (cotton, leather, oak), soft contact shadows. The cat is funny and charming, never naughty in a mean way. No outlines, no cel shading, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320): the cat's face and raised paw, the glasses on his nose, and each of the four things and where it is.
```

#### pick-it-up-put-it-back-4: the spice box (the kitchen's board, 1b)

- **shows:** The boards' different camera: straight down on the round spice box, the middle bowl just filled
- **attach (3):** style-anchor.png, props-sheet.webp, cook-service-bg.jpg
- **save as:** mockup-pick-it-up-put-it-back-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, landscape, the main play area only (no side panel, no menus, no buttons).

The scene: seen exactly from straight above (90 degrees, no horizon, no back wall), a warm white marble worktop with faint veins fills the frame edge to edge. In the centre sits a round polished steel spice box with its lid off to one side: seven small identical steel bowls inside, one in the middle and six in a ring around it. Above the box, a neat row of seven small heaps of whole and ground spices on little steel saucers: golden turmeric, brown cumin seeds, black mustard seeds, white salt, red chilli powder, green-brown coriander seeds, dark brown garam masala. The bottom fifth of the frame and both side edges are plain worktop with nothing on them. No people, no hands, no sleeves anywhere in the picture.

The moment: the middle bowl has just been filled with turmeric, and a small soft golden puff of powder rises from it. The other six bowls are empty and identical. Nothing glows.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (brushed steel, marble, matte powders, glossy seeds), soft contact shadows. Near-orthographic: the bowl rims read as circles, not ovals. No outlines, no cel shading, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere, including on the spice box.

Must read at phone size (about 740x320): the seven bowls and which one is the middle, the seven spices as seven different colours, the turmeric in the middle bowl.
```

### 6. clean-up-day (Clean-up day)

#### clean-up-day-1: the bathroom, level 1 (the tap just turned off)

- **shows:** The bathroom a moment after the child tapped the running tap. It shows the room's L1 things in mixed states, how big they are, and the toy-like reaction
- **attach (5):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, props-sheet.webp, house-wide.png
- **save as:** mockup-clean-up-day-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only: no side panel, no menus, no buttons, no interface.

The scene: a small, modern, sunny family bathroom in a grandmother's house, seen straight on at eye level like a stage set, horizon at about 55% of the frame, one-point perspective, verticals vertical. Limewash cream walls, a strip of pale floor tiles along the bottom. The back wall is filled from side to side by three things standing close together, with no gaps between them: on the left, a white basin on a pale oak vanity unit with one drawer, the drawer pulled open with a striped sock hanging over its edge, a plain mirror above the basin, and a small warm wall light beside the mirror, switched on, casting a soft pool of light on the wall; in the middle, a small window with an indigo block-print (ajrakh-style) curtain, drawn open, so a stripe of warm sunlight falls across the floor; on the right, a bath running along the wall with a plain cream shower curtain drawn open. A broom leans in the left corner. A woven laundry basket stands in the right corner, with a small silver-grey kitten with big ears curled asleep inside. On the floor, a scattered spill of white talc with small footprints.

The moment, a second after the basin tap was turned off: the water has stopped; a single last drop hangs from the spout above the basin, and a small yellow rubber duck sits still in the basin with a few faint ripples around it. No highlight or glow on the tap or on anything else.

On the far right, standing in the open bathroom doorway and seen from the knees up: the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. Three-quarter view, smiling warmly, one hand raised as if she has just asked for something.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, soft global illumination, chunky simplified shapes, believable materials (white ceramic, brushed steel, pale oak, woven cane, cotton), clean surfaces, soft contact shadows under everything that rests on a surface, no outlines, no cel shading, no photorealism, no blur, no motion lines.

Absolutely no text, letters, numbers, labels, logos or symbols anywhere: not on the bottles, the soap, the light switch or the tiles.

Must read at phone size (the image will be shown about 275-320 pixels tall): the tap, the wall light, the curtain, the drawer, the talc spill and the broom must each be big, clear and separate, at least the size of a thumb, with calm empty wall around them. Nothing important overlaps the grandmother's face.

Wide landscape frame, about 2.3:1.
```

#### clean-up-day-2: the bathroom at level 2 (the twins and the dusk beat)

- **shows:** The same bathroom with the taps, the lights and the curtains in pairs, at the dusk beat: the wall light has just gone off, so no light is on and the window curtain is closed; the kitten's eyes shine
- **attach (4):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, props-sheet.webp
- **save as:** mockup-clean-up-day-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only: no side panel, no menus, no buttons, no interface.

The same small modern family bathroom in a grandmother's house, seen straight on at eye level like a stage set, horizon at about 55%, one-point perspective, verticals vertical, a strip of floor tiles along the bottom. The back wall is filled from side to side by the basin (left), the window (middle) and the bath (right), standing close together.

The things come in pairs:
- two taps: the basin tap is off and dry; the bath tap on the right is running in a clear, smooth stream into the bath;
- two lights: the small wall light beside the mirror is off, its bulb dark, and a round pendant ceiling light hanging on a short cord near the top of the frame is also off;
- two curtains: the indigo block-print window curtain is drawn closed; the plain cream shower curtain is drawn open;
- one drawer under the basin, shut; a bar of soap lying on the bath mat, and an empty soap tray on the edge of the basin; a broom leaning in the left corner.

The moment: with no light on and the window curtain closed, the room has gone a soft dusky blue, with a little cool light around the edges of the curtain; everything is still clearly visible. In the woven laundry basket in the right corner, two round yellow-green eyes shine in the dusk, and a small silver-grey kitten with big ears is just lifting his head with a sleepy, surprised look. A big, solid charcoal-black cat with pale mint-green eyes and a dark collar with a small silver bell lies curled asleep at the grandmother's feet in the doorway.

On the far right, standing in the open doorway and seen from the knees up: the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. Three-quarter view, a hand to her mouth, laughing gently.

Style: match the attached references: a stylised 3D animated-feature look, a calm dusk with a cool blue fill and soft global illumination, chunky simplified shapes, believable materials, soft contact shadows, no outlines, no photorealism, no blur, no lens effects, no motion lines.

Absolutely no text, letters, numbers, labels, logos or symbols anywhere.

Must read at phone size (the image will be shown about 275-320 pixels tall): each tap, each light, each curtain, the drawer, the soap and the tray must be big and separate, and on or off must be obvious at a glance (water or no water, curtain drawn or open). The kitten's eyes must read clearly even though the room is dim.

Wide landscape frame, about 2.3:1.
```

#### clean-up-day-3: the play room, Ali's room (the toy car just switched off)

- **shows:** Ali's room, which is the play room, on the second visit, a moment after the child switched off the toy car, with the other toys in clear states
- **attach (5):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, house-wide.png, style-anchor.png
- **save as:** mockup-clean-up-day-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only: no side panel, no menus, no buttons, no interface.

The scene: a boy's bedroom that is also the play room, in a grandmother's modern bungalow, seen straight on at eye level like a stage set, horizon at about 55%, one-point perspective, verticals vertical. Limewash cream walls; a soft rug on a pale wooden floor along the bottom; a small bed with a plain cover along the left wall.

Things in the room, each one a separate, chunky, toy-like object with plenty of space around it:
- a big wooden toy box with its lid propped open and a soft brown teddy bear peeking over the edge;
- a woven basket beside it, empty;
- in the middle of the rug, a red toy car, standing still, its little headlights off;
- a blue ball and three plain wooden building blocks loose on the rug;
- on a low shelf on the right, a small wooden music box with its lid open and a little carved wooden bird standing on top;
- a ceiling fan near the top edge, still, and a paper windmill on the shelf, still;
- a window with a sage-green curtain drawn open.

A big, solid charcoal-black cat with pale mint-green eyes and a dark collar with a small silver bell crouches on the rug beside the blue ball, about to pat it, tail up.

On the far right, standing in the open doorway and seen from the knees up: the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings; three-quarter view, smiling. Beside her in the doorway, a tall, lanky boy with tousled black hair, in an orange T-shirt with a pocket and long trousers, leaning in to watch.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, soft global illumination, chunky simplified shapes, believable materials (painted wood, felt, woven cane, cotton, paper), soft contact shadows, no outlines, no photorealism, no blur, no motion lines or puffs.

Absolutely no text, letters, numbers, labels, logos or symbols anywhere: the blocks are plain coloured wood with no letters, and nothing has a brand.

Must read at phone size (the image will be shown about 275-320 pixels tall): the toy box, the car, the ball, the blocks, the music box and the fan must each be big, clear and separate on calm floor and wall space. Nothing overlaps a face.

Wide landscape frame, about 2.3:1.
```

#### clean-up-day-4: Nani's bedroom at night (Tell Ali, the lamp and the ceiling light)

- **shows:** Nani's bedroom on the third visit at L4, the speaking moment: the child has just told Ali to switch off the lamp, and he has done it, with the ceiling light as the look-alike still on
- **attach (4):** nani-sheet.png, family-lineup.png, cook-service-bg.jpg, house-wide.png
- **save as:** mockup-clean-up-day-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen, the main play area only: no side panel, no menus, no buttons, no interface.

The scene: a grandmother's bedroom in her modern bungalow, at night, seen straight on at eye level like a stage set, horizon at about 55%, one-point perspective, verticals vertical. Limewash cream walls, a pale oak floor with a soft rug along the bottom. Left to right: a tall pale-oak wardrobe with both doors shut; a window with a soft indigo block-printed curtain drawn open, showing a big pale moon and a few stars in a deep blue sky; a single bed seen side-on with a plain cream cover and an indigo block-print cushion; a bedside table with a small brass table lamp. Near the top edge, a round pendant ceiling light on a short cord, switched on and glowing warm, and a ceiling fan, still.

The moment: the small brass lamp has just been switched off, its bulb dark; the ceiling light is still on. A tall, lanky boy with tousled black hair, in plain long-sleeved pyjamas, stands by the bedside table with his hand just lifted from the lamp, looking back over his shoulder with a proud grin, as if someone has just told him what to do. A small silver-grey kitten with big ears and yellow-green eyes is curled on the end of the bed, eyes half closed.

On the far right, standing in the open doorway and seen from the knees up: the grandmother from the attached character sheet and lineup (keep her face and likeness exactly): a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta over her head, thin round gold glasses, no rings. Now facing the viewer, smiling encouragingly, one hand open towards the viewer as if handing over a turn.

Style: match the attached references: a stylised 3D animated-feature look, night lighting with a warm pool from the ceiling light and a cool blue fill from the window, soft global illumination, chunky simplified shapes, believable materials (brass, pale oak, cotton), soft contact shadows, no outlines, no photorealism, no blur, no lens flare, no motion lines.

Absolutely no text, letters, numbers, labels, logos or symbols anywhere.

Must read at phone size (the image will be shown about 275-320 pixels tall): the small lamp and the ceiling light must both be big and clearly different from each other, and on or off must be obvious at a glance; the boy, the lamp, the window, the wardrobe and the fan must each be clear and separate. Nothing overlaps a face.

Wide landscape frame, about 2.3:1.
```

### 7. party-gifts (Party: gifts)

#### party-gifts-1: the candles (part A)

- **shows:** The moment before the pick: the cupcake waiting, and three bundles that read as different counts, so Zafar sees how a number is chosen without digits
- **attach (4):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp, cook-nani-sheet.webp
- **save as:** mockup-party-gifts-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain cream wall with nothing important in it (a side panel will cover it later); a grandmother stands just right of that strip.

The scene: a bright, modern family sitting room in golden afternoon light, eye-level camera like a family film. Limewash cream walls, a sage door, a brass lamp, a single ajrakh-print cushion; a few paper bunting flags and three balloons near the top edge (plain colours, no writing). In front, filling the bottom third, a low pale-oak table seen straight on, its front edge at about two-thirds of the frame height. On it, centred, a round white birthday cake with four slim candles already standing, unlit, and beside it one small plain cupcake with no candles. Behind the table, cut at the waist: in the middle a beaming girl of about four in a marigold kameez with a light dupatta over her shoulders; on the right a tall grandfather with a short grey beard in a pale kurta and grey waistcoat, smiling; between them a baby boy in a high chair reaching for the cake. At the left, just right of the plain strip, the grandmother from the reference sheet, smiling, one hand open toward the table.

The moment: at the front right of the table sits a small brass saucer with three bundles of slim party candles, each tied with a ribbon, standing upright and well apart: one bundle of 1 candle, one of 3 candles, one of 6 candles. The candles must be easy to count at phone size: thick, evenly spaced, separate. Nothing has been picked yet. A soft breathing gold glow box surrounds the whole saucer. The rest of the scene is slightly dimmed.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft shadows, chunky simplified shapes, clean surfaces, big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Every resting object has a soft contact shadow; nothing floats. Modest clothing, no religious symbols or markers of any kind.

Absolutely no text, letters, numbers or comic sound marks anywhere: not on the bunting, the cake, the candles, the walls or anywhere else.

Must read at phone size (about 740x320): the four faces, the cake, the cupcake, and the three candle bundles as clearly different counts (1, 3, 6).
```

#### party-gifts-2: the cloth and the cake (part A, the core of the first sprint)

- **shows:** The dastarkhwan laid along the table and a slice going to the child's own Nana, so Zafar sees the give-to on the cloth and the two older men told apart only by the word
- **attach (5):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp, cook-nani-sheet.webp, nana-face.webp
- **save as:** mockup-party-gifts-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain cream wall with nothing important in it (a side panel will cover it later); a grandmother stands just right of that strip.

The scene: the same bright, modern family sitting room, golden afternoon light, eye-level camera. Limewash cream walls, a brass lamp, a few plain paper bunting flags (no writing). A low pale-oak table across the front of the frame with a plain cream cloth laid along its front edge; on the cloth, a small round place in front of each person, and one empty place at the near edge in the middle of the frame. Behind the table, cut at the waist and spaced well apart: the grandfather from the Nana reference face, white moustache, kind; a girl of about four in a marigold kameez; a woman in a deep plum kameez with a soft grey dupatta; a tall grandfather with a short grey beard in a pale kurta and grey waistcoat. At the left, just right of the plain strip, the grandmother from the reference sheet, smiling. In front of three places stand identical plain cream cups.

The moment: on a tray at the front, five slices of white cake on small plates, two big and three small. One plate is gliding through the air toward the grandfather with the white moustache, who reaches out with delight. A soft gold glow outlines him only. Everyone else watches, smiling the same mild smile.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (cloth, ceramic, painted wood), big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Soft contact shadows on everything resting on the table or cloth. Modest clothing, no religious symbols or markers of any kind. No sweets anywhere.

Absolutely no text, letters, numbers or comic sound marks anywhere.

Must read at phone size (about 740x320): the five faces, the two grandfathers as clearly different men, the empty near place on the cloth, and the slices as big and small.
```

#### party-gifts-3: the party presents (part B; also how every give-to looks)

- **shows:** The unwrap and the give: the plain boxes, the toy springing out, and a grown-up receiving a child's toy (the anti-matching joke)
- **attach (4):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp, cook-nani-sheet.webp
- **save as:** mockup-party-gifts-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain cream wall with nothing important in it (a side panel will cover it later); a grandmother stands just right of that strip.

The scene: the same bright, modern family sitting room as a family film, golden afternoon light, eye-level camera. Limewash cream walls, a brass lamp, one ajrakh cushion, a few plain paper bunting flags (no writing). A low pale-oak table across the front of the frame; behind it, cut at the waist and spaced well apart, four people in the middle and right of the frame: a tall grandfather with a short grey beard in a pale kurta and grey waistcoat; a grandmother in a lilac kameez with a dupatta over her shoulders; a woman in a red kameez and dupatta; a girl of about four in a marigold kameez. At the left, just right of the plain strip, the grandmother from the reference sheet, one hand raised toward the boxes as if speaking.

The moment: on the table in the foreground, a row of identical plain gift boxes: the same brown card, the same cream ribbon, no tags. One box in the middle has just burst open: the ribbon springs off, the brown paper flaps fly outwards, and a bright toy drum with two little sticks has popped up out of it. A soft gold glow outlines the tall grandfather, who is reaching out with delighted surprise, about to receive the drum. The others watch with the same mild smile. Nothing else glows.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (card, ribbon, painted wood), big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Soft contact shadows on everything resting on the table. Modest clothing, no religious symbols or markers of any kind. No sweets anywhere.

Absolutely no text, letters, numbers or comic sound marks anywhere: not on the boxes, ribbons, bunting, drum or walls.

Must read at phone size (about 740x320): each of the five faces, the identical boxes, and the drum as a toy drum.
```

#### party-gifts-4: Snap the person named (part C, after Snap's rebuild)

- **shows:** The photo game with two older men spaced apart, and the viewfinder holding one face, so Zafar sees that only the heard word picks the shot and a wide frame can't
- **attach (4):** house-wide.png, customers-sheet.webp, cook-service-bg.jpg, nana-face.webp
- **save as:** mockup-party-gifts-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain garden wall with nothing important in it (a side panel will cover it later).

The scene: a wide, eye-level view of a family's sunny back garden during a birthday party, like a frame from a family animated film. A limewash wall with a sage door at the back, a potted lime tree, a string of plain paper bunting (no writing). Across the middle of the frame runs a low garden wall at waist height; the guests stand behind it, seen waist-up, relaxed and spaced well apart, at least one head-width between any two: a grandfather with a white moustache (the Nana reference face); a tall grandfather with a short grey beard in a pale kurta and grey waistcoat, standing far from the first; a grandmother in a lilac kameez and dupatta holding a baby; a woman in a red kameez and a woman in a deep plum kameez, both with dupattas over their shoulders, apart from each other; a girl of about four in a marigold kameez.

The moment: a camera viewfinder overlay, four soft white rounded corner brackets, frames only the tall grandfather with the short grey beard: his face is big and centred and no other face is inside the brackets. A bright white flash is just firing, and a small instant photo of him is sliding out at the bottom edge of the frame. He is mid-blink with one eye shut, comic. Everyone else is caught in natural poses with the same mild smile.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Soft contact shadows. Modest clothing, no religious symbols or markers of any kind.

Absolutely no text, letters, numbers or comic sound marks anywhere, including on the viewfinder.

Must read at phone size (about 740x320): every face, the difference between the two grandfathers, the space between them, and the viewfinder brackets round one face only.
```

#### party-gifts-5: Who ate the cake? (visit 2, after Who did it?'s rebuild)

- **shows:** The line-up after two heard clues, with no traces and no tells on anyone, so Zafar sees the clue is heard and not seen
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp
- **save as:** mockup-party-gifts-5.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only. Wide landscape, about 21:9. Keep the left fifth of the frame as plain cream wall with nothing important in it (a side panel will cover it later).

The scene: the family's bright, modern sitting room in golden late-afternoon light, eye-level camera like a family animated film. A long sofa with a single ajrakh cushion against a limewash cream wall, a brass lamp, plain paper bunting (no writing). In the foreground on a low pale-oak table: a cake on a stand with one slice clearly missing, and a cream cloth with cups at each place, one of them clearly bigger than the rest.

The moment: six guests behind the sofa, cut at the waist, each holding an empty plate, with no crumbs or cream on any face, all with the same calm, curious expression and open eyes. Two grown-ups are standing tall: a woman in a red kameez and dupatta, and a man in a red kurta. Four have sat down with small, friendly comic flops: a girl of about five in a marigold kameez, a boy of about seven in a striped kurta, a woman in a deep plum kameez and soft grey dupatta, and a tall grandfather with a short grey beard in a grey waistcoat. A baby is fast asleep in a high chair at the side. A soft gold glow surrounds the two standing grown-ups only.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm light from the upper left, chunky simplified shapes, big expressive eyes, readable mouths, no outlines, no cel shading, no photorealism, no depth-of-field blur. Soft contact shadows. Modest clothing, no religious symbols or markers of any kind. Playful, never scary or shaming: nobody frowns, rolls their eyes or looks guilty.

Absolutely no text, letters, numbers or comic sound marks anywhere.

Must read at phone size (about 740x320): the six faces, which guests are standing and which are sitting, the big cup on the cloth, and the gap in the cake.
```

### 8. party-guests (Party: guests)

#### party-guests-1: pass the balloon, level 1

- **shows:** The introductions game's core move: three children in one row, the balloon floating to the boy just after the child tapped him
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, house-wide.png
- **save as:** mockup-party-guests-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). 1536x1024, landscape. Eye-level camera, horizon at about 55-60% of the frame.

The scene: the bright front room of a modern East African family home with gentle Kutch touches (limewash cream walls, one mirror-work cushion, a pale oak floor, plain coloured balloons and plain fabric bunting on the back wall with no writing on them). Late-morning sun from the upper left.

Three young children sit in one straight row on big floor cushions, facing the viewer, evenly spaced across the middle of the frame: a 4-year-old birthday girl in a marigold kameez with a light dupatta over her shoulders, a small plain paper crown on her head; a 6-year-old boy in a striped cotton kurta; a 5-year-old girl in a kameez and trousers. Nobody else is in the room.

The moment: a single plain red balloon floats in a slow, soft arc high above their heads, from the birthday girl towards the boy, who looks up at it with delighted surprise, hands reaching up. The other girl giggles behind her hand. A gentle dotted motion trail behind the balloon, kept above everyone's heads.

Composition: keep all three faces, the balloon and its arc inside a wide strip across the middle of the frame, about a third of the frame high, so the picture can be cropped to a 3:1 phone strip without cutting a face.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, big expressive eyes, rosy cheeks, no outlines, no photorealism, no cel shading, no blur or vignette.

None of these people is anyone shown in the references: the references are only for the style, the light, the room and the materials. These are three new children.

Absolutely no text, letters or numbers anywhere: no birthday banner, no writing on balloons, bunting, crown or clothes.

Must read at phone size: all three children's faces and their expressions, and the balloon.
```

#### party-guests-2: pass the balloon, level 2 (whose mum, whose masi)

- **shows:** The harder version as designed: one row of four, two children and two sisters, so only the heard kin word picks
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, house-wide.png
- **save as:** mockup-party-guests-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). 1536x1024, landscape. Eye-level camera, horizon at about 55-60% of the frame.

The scene: the same bright front room of a modern East African family home (limewash cream walls, a pale oak floor, one ajrakh throw over a low chair, plain balloons and plain bunting with no writing). Late-morning sun from the upper left.

One straight row of four people facing the viewer, evenly spaced across the middle of the frame, alternating child and grown-up: a 4-year-old girl in a marigold kameez with a light dupatta and a small plain paper crown, on a floor cushion; a woman in her thirties in a deep plum kameez and a soft grey dupatta, on a low chair; a 6-year-old boy in a striped kurta, on a floor cushion; a second woman in her thirties in a red kameez and a red dupatta, on a low chair. The two women are clearly sisters: similar faces, the same warm smile, different clothes. Modest, modern, warm clothes.

The moment: a plain yellow balloon has just floated down into the red-kameez sister's raised hands; she is laughing as she catches it. The others laugh. Everyone is evenly lit; nobody is highlighted.

Composition: keep all four faces and the balloon inside a wide strip across the middle of the frame, about a third of the frame high, so the picture can be cropped to a 3:1 phone strip without cutting a face.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no blur.

None of these people is anyone shown in the references: the references are only for the style, the light, the room and the materials. These are four new people.

Absolutely no text, letters or numbers anywhere, including on clothes, balloons, bunting and the crown.

Must read at phone size: all four faces (the two sisters easy to tell apart by clothes but plainly family), and the balloon.
```

#### party-guests-3: how are you?, the first visit

- **shows:** Looking after the guests with visit 1's people: a row of standing guests, the tea trolley with the six fixes, one guest just given water and gulping it, the others still neutral (so the picture never gives the need away)
- **attach (4):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp, house-wide.png
- **save as:** mockup-party-guests-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). 1536x1024, landscape. Eye-level camera, mid-shot: people cut at the knee, horizon at about 60%.

The scene: the front room of a modern East African family home at a child's birthday party (limewash cream walls, plain balloons and plain bunting with no writing, one mirror-work frame). Late-morning sun from the upper left.

Left and centre: three party guests standing in one loose row, each about two thirds of the frame high: a 6-year-old boy in a striped kurta; a 5-year-old girl in a kameez and trousers; a woman in her thirties in a red kameez and a red dupatta. The boy and the girl have calm, neutral, friendly faces (no sign of how they feel). The woman is mid-gulp, tipping back a tall glass of water with her eyes shut in comic bliss. No speech marks, no sound words, no letters.

Right: a pale oak tea trolley on wheels, front view, holding clearly separated items: a steel plate of samosas with a banana and mango slices; a glass jug of water with two glasses; a bunch of plain balloons tied to its handle; a woven hand fan; a neatly folded soft wool shawl with a quiet border. A plain folding chair stands beside the trolley. Each item has a soft contact shadow and the solid, believable materials of the props reference.

Composition: keep the three faces and the six trolley items inside a wide strip across the middle of the frame, about a third of the frame high, so the picture can be cropped to a 3:1 phone strip.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no blur.

None of these people is anyone shown in the references: the references are only for the style, the light, the room and the materials. These are three new people.

Absolutely no text, letters or numbers anywhere.

Must read at phone size: each guest's face, the woman's gulp, and all six trolley items as separate, recognisable things (plate, water, balloons, fan, shawl, chair).
```

#### party-guests-4: how are you?, a year older

- **shows:** Visit 2: golden evening light, the birthday girl now 5, several fixes landing at once so Zafar sees the range of comic reactions
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp
- **save as:** mockup-party-guests-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). 1536x1024, landscape. Eye-level camera, mid-shot, people cut at the knee, horizon at about 60%.

The scene: the same family front room in golden evening light, low warm sun from the upper left, long soft shadows, a warm lamp glowing on a side table. Plain balloons and plain bunting with no writing.

Across the frame in one row, four guests: a 5-year-old girl in a marigold kameez with a light dupatta standing on tiptoe, beaming, holding the string of a new plain blue balloon that lifts her slightly; a woman in her thirties in a red kameez fanning herself with a woven hand fan, her red dupatta fluttering, eyes closed in relief; a grandmother in her late sixties in a soft lilac kameez with a plain grey dupatta, wrapped snugly in a soft wool shawl, smiling cosily; a 7-year-old boy in a striped kurta flopped back in a plain folding chair, fast asleep with his mouth a little open. No sound words, no letters, no "Z" shapes. Beside them a pale oak tea trolley with a jug of water, glasses and a plate of samosas and fruit.

Composition: keep all four faces inside a wide strip across the middle of the frame, about a third of the frame high, so the picture can be cropped to a 3:1 phone strip.

Style: match the references: a stylised 3D animated-feature look, soft warm light, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no blur.

None of these people is anyone shown in the references: the references are only for the style, the light, the room and the materials. These are four new people; the grandmother is not the grandmother of any reference.

Absolutely no text, letters or numbers anywhere, including no number candles and no birthday writing.

Must read at phone size: all four faces and what each is doing (balloon, fan, shawl, asleep in the chair).
```

### 9. do-it-engine (Do it (statues and getting ready))

#### do-it-engine-1: musical statues, level 1 (the first stop)

- **shows:** The party room the moment after the child tapped the "sit" card. It shows the whole loop (Nani claps and calls, the child taps a pose card, everyone does it), and how big the dancers and cards are
- **attach (4):** cook-service-bg.jpg, customers-sheet.webp, cook-nani-sheet.webp, house-wide.png
- **save as:** mockup-do-it-engine-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no menus, no buttons). Eye-level camera, wide, horizon at about 55-60% of the frame, full bodies standing on the floor.

The scene: the bright front room of a modern East African family home with gentle Kutch touches: limewash cream walls, pale oak floor, floor cushions pushed back against the walls, plain coloured balloons and plain fabric bunting on the back wall with no writing. Late-morning sun from the upper left, soft contact shadows on the floor.

Centre, on the open floor well away from the cushions: two young children have just dropped to sit cross-legged on the floor at the same moment, mid-giggle: a 4-year-old girl in a marigold kameez with a light dupatta over leggings (centre, a step nearer the viewer), and a 6-year-old boy in a striped cotton kurta and trousers, who is wobbling a little as he lands. A tiny soft sparkle burst around them, as if they have just frozen into the pose.

Right: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, standing three-quarter on, hands just apart after a clap, smiling at the children.

Left edge of the play area: a vertical column of two large rounded cream cards, each a small clean full-body picture of the same girl in a pose: the top card shows her sitting cross-legged, the bottom card shows her mid-jump with knees up. The top (sitting) card has a soft warm gold glow, as if it has just been tapped; the rest of the room is lit normally.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no cel shading, no blur or vignette.

Absolutely no text, letters, numbers or symbols anywhere: not on the cards, bunting, balloons or clothes.

Must read at phone size: both children's faces and their sitting pose, the two pose cards and the difference between them, the glow on the chosen card, and the grandmother's clap.
```

#### do-it-engine-2: musical statues, level 3 ("touch your nose")

- **shows:** The harder levels. Four pose cards, two of them head-and-shoulders "touch" cards, so Zafar sees whether a finger on the nose and a finger on the head can be told apart at card size
- **attach (4):** cook-service-bg.jpg, customers-sheet.webp, cook-nani-sheet.webp, house-wide.png
- **save as:** mockup-do-it-engine-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, wide, horizon at about 55-60%, full bodies on the floor.

The scene: the same bright modern front room (limewash cream walls, pale oak floor, cushions pushed back against the walls, plain balloons and plain bunting without writing), late-morning sun from the upper left.

Centre, on the open floor: two children have just frozen in the same pose, each touching the tip of their own nose with one finger and looking cross-eyed at it, laughing: a 4-year-old girl in a marigold kameez with a light dupatta over leggings (centre, a step nearer the viewer) and a 6-year-old boy in a striped kurta and trousers, who is wobbling a little. A small soft sparkle around them.

Right: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, three-quarter on, laughing, hands mid-clap.

Left edge: two short columns of large rounded cream cards (four cards), each a clean small picture of the same girl. Two cards are close-up head-and-shoulders pictures: one with her finger on the tip of her nose, one with her hand flat on the top of her head. Two cards are full-body: one mid-jump with knees up, one turned round with her back to us. The "finger on nose" card has a soft gold glow, as if just tapped.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, expressive faces, no outlines, no photorealism, no blur.

Absolutely no text, letters, numbers or symbols anywhere.

Must read at phone size: the two children's faces, and the four cards, especially the finger on the nose against the hand on the head in the two close-up cards.
```

#### do-it-engine-3: the off-screen round ("now you!")

- **shows:** The moment Nani turns to the real child. Zafar sees how the screen asks a child to move their own body, without text and without a camera
- **attach (3):** cook-service-bg.jpg, cook-nani-sheet.webp, customers-sheet.webp
- **save as:** mockup-do-it-engine-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, horizon at about 55-60%.

The scene: the same bright modern front room (limewash cream walls, pale oak floor, cushions against the walls, plain balloons and plain bunting without writing), late-morning sun from the upper left.

Foreground, slightly right of centre and large: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, now turned to face the viewer directly, leaning forward a little with a warm, playful smile, one hand stretched out palm-up towards the viewer, inviting the person holding the screen to dance.

Behind her, smaller, a 4-year-old girl in a marigold kameez with a light dupatta over leggings and a 6-year-old boy in a striped kurta and trousers stand on the open floor, knees a little bent, grinning at the viewer, waiting to copy.

No cards on screen in this moment.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, big expressive eyes, no outlines, no photorealism, no blur.

Absolutely no text, letters, numbers, musical notation, swirls or symbols of any kind anywhere.

Must read at phone size: the grandmother's face looking straight out and her inviting hand, and the two children's eager faces behind her.
```

#### do-it-engine-4: getting ready, level 1 ("comb your hair")

- **shows:** The children's room, the three children, the things in reach and Nani's breakfast tray, at the moment the oldest boy's bed-hair springs flat
- **attach (5):** house-wide.png, cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp, cook-nani-sheet.webp
- **save as:** mockup-do-it-engine-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, front view, horizon at about the hip height of the tallest child, full bodies standing on the floor.

The scene: a calm children's bedroom in a grandmother's modern East African home with one gentle Kutch nod (an ajrakh-patterned bedspread on the bed behind them). Limewash cream walls, pale oak floor, soft early-morning sun from the upper left through a window.

Centre, in a row: three children in plain long-sleeved cotton pyjamas with no pattern. In the middle, a tall, lanky 8-year-old boy, mid-comb: one hand runs a simple wooden comb through his hair; half his hair is still wildly sticking up from sleep, the other half suddenly smooth and neat, with a tiny soft sparkle where it sprang flat. He's grinning, still a bit sleepy-eyed. On his left, a 5-year-old girl with her hair sticking up from sleep, yawning. On his right, a 4-year-old boy with wild bed-hair, rubbing one eye.

Left of the children: a low wooden shelf by a small basin, with a steel cup holding three toothbrushes and an empty spot where the comb lives. Right of the children: a clothes rail with three sets of plain school clothes on hangers. Each thing is large, clearly separated, and lit evenly.

Far right, at the doorway: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, three-quarter on, smiling, holding a tray with three plain steel bowls and spoons.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, believable simple materials (steel, wood, cotton), chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters, numbers or symbols anywhere: none on the clothes, toothbrushes or tray.

Must read at phone size: the three children's faces and the oldest boy's half-messy, half-neat hair, the comb in his hand, and each thing (toothbrush cup, school clothes, the tray of bowls) as clearly different shapes.
```

#### do-it-engine-5: getting ready, level 3 (a funny miss: the sock puppet)

- **shows:** The busier L3 room with eight things, and a wrong pick played as a joke, not a verdict
- **attach (4):** house-wide.png, customers-sheet.webp, props-sheet.webp, cook-nani-sheet.webp
- **save as:** mockup-do-it-engine-5.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, front view, horizon at about the tallest child's hip height, full bodies on the floor.

The scene: the same calm children's bedroom in a grandmother's modern East African home (limewash cream walls, pale oak floor, ajrakh-patterned bedspread behind), soft morning sun from the upper left.

Centre, in a row: three children with neatly combed hair, still in plain long-sleeved pyjamas with no pattern. The tall, lanky 8-year-old boy in the middle has pulled a plain white sock onto his hand like a puppet and is making it "talk" towards the viewer with a cheeky grin. He looks playful, never told off. The 5-year-old girl beside him laughs behind her hand; the 4-year-old boy on the other side points at the sock puppet, delighted.

Left: a low shelf by a small basin with a steel cup of three toothbrushes, a simple wooden comb, a bar of soap, and a folded flannel, each separate. Right: a clothes rail with plain school clothes on hangers and plain white socks hanging in pairs; a row of three pairs of plain school shoes on the floor beneath it. Each thing is large, separated, and evenly lit.

Far right, at the doorway: a grandmother in a cream kameez with red embroidery and a plain red dupatta, round thin gold glasses, laughing with a hand to her mouth.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, simple believable materials, chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters, numbers or symbols anywhere; no stripes or prints on clothes or socks.

Must read at phone size: the sock puppet on his hand and the three faces, the grandmother laughing, and the eight things as distinct shapes (especially the shoes against the socks, and the soap against the flannel).
```

### 10. town-map (Town map)

#### town-map-1: the first round, a phone, level 1

- **shows:** The core move on the phone layout. The grandfather was tapped, then the park; he walks there while the closed places sit dimmed
- **attach (4):** town-map-8.webp, customers-sheet.webp, town-road.png, cook-service-bg.jpg
- **save as:** mockup-town-map-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Make the image 16:9. Inside it, draw the game as a wide, short strip about 2.3 times as wide as it is tall, centred, with plain dark grey bars above and below it. Everything described below sits inside the strip.

THE SCENE: a small friendly toy town seen from above at a TILTED angle, camera about 50 degrees down, like the attached approved town map, so the FRONT of every building shows. Eight places on rounded pavement plots in two rows of four, a simple looping grey road between them, thin strips of grass and a few cypress and olive trees, cream limewash walls and terracotta roofs. Day light, warm late-morning sun from the upper left.

The eight places, each recognisable with no writing, by shape, colour and one big emblem:
1. Market: crates of oranges, bananas, onions and green chillies under a striped awning.
2. Park: trees, a pond with ducks, swings, a bench (no building). The ONLY playground on the map.
3. Bakery: a window of bread loaves, a giant bread loaf above the door.
4. Library: big windows full of colourful books, a giant open book above the door.
5. Clinic: a small clean white building with a big pink heart with a plaster on it above the door, a small white ambulance at its side.
6. Post office: a red postbox outside and a plain sealed envelope with a red wax seal above the door (no tick, no mark on the envelope).
7. School: a little round roof with a weather vane (no bell tower), a small blackboard by the gate, a rack of school bags. No slide, no swings.
8. Fire station: red, big garage doors, a fire engine inside.

ONLY the market, the park and the bakery are OPEN: doors open, warm light in the windows, awnings out. The other five are CLOSED: doors shut, awnings rolled in, and the whole plot gently dimmed and slightly greyed, so the three open places clearly stand out.

At the far left edge of the strip: a small bus stop with a cream bus just pulled in, and a big empty cloth shopping bag resting by the bus stop bench. No one is standing at the stop.

THE MOMENT: a small full-body grandfather in a plain navy blazer is walking along the road from the bus stop towards the park gate, mid-stride. The park has a soft warm golden glow, as if it has just been tapped.

THE FACES: along the RIGHT edge of the strip, a plain soft-green vertical column. At the top of the column, an empty square space the size of one face (kept clear for a settings button; draw nothing there). Below it, three round portrait circles stacked (head and shoulders, white ring): at the top a friendly woman in her thirties in a sage-green quarter-zip, then the same grandfather (with a soft golden ring round his circle), then a very old great-grandmother with white hair and a pale shawl. Same render style as the people reference. Placeholders, not real people.

STYLE: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, clean surfaces, no outlines, no photorealism, no cel shading, no blur or vignette.

Absolutely no text, letters or numbers anywhere: no signs with writing, no logos, nothing on the bus.

Must read when the strip is shown about 740 pixels wide: which three places are open, every place by its emblem, the walking grandfather, and the three faces.
```

#### town-map-2: the busy town at level 3, a big screen

- **shows:** "people come back carrying something", which is the delight, on the visit 1 big-screen map: 8 places and 4 gardens on 12 plots, two people out at once, and all four faces live
- **attach (4):** town-map-8.webp, customers-sheet.webp, props-sheet.webp, town-road.png
- **save as:** mockup-town-map-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons), widescreen 16:9 like a tablet or computer.

THE SCENE: the same toy town as the attached approved map, seen from above at a TILTED angle, about 50 degrees down, so every building's front shows. Twelve rounded pavement plots in three rows of four on a looping grey road, cream limewash walls, terracotta roofs, potted plants, a few cypress trees. Warm late-morning sun from the upper left.

EIGHT plots hold places, each recognisable with no writing: the market (fruit and vegetable crates under a striped awning), park (pond, ducks, swings; the only playground), bakery (giant loaf above the door), library (giant open book above the door), clinic (small white building, pink heart with a plaster above the door), post office (red postbox, a plain sealed envelope with a red wax seal above the door, no tick), school (little roof with a weather vane, a small blackboard and school bags by the gate, no slide), fire station (red, fire engine inside). Seven are open and lit (doors open, awnings out); the fire station is closed and gently dimmed. The other FOUR plots are small gardens: grass, a bench, a lemon tree, flower pots. No houses.

THE MOMENT, two people out on errands at once, small full-body figures:
- a young mother in a green dupatta walking out of the library carrying a tall wobbly stack of books;
- a grandfather in a plain navy blazer walking back along the road from the park, his hair windswept, with a white duck waddling right behind him.
At the bottom left, a small bus stop with a cream bus and a big empty cloth shopping bag by the bench. No one is standing at the stop.

THE FACES: along the bottom 16% of the image, a plain soft-green strip with four round portrait circles (head and shoulders, white ring), ALL equally bright and in full colour, left to right: a friendly woman in her thirties in a sage-green quarter-zip, the grandfather, the young mother, and a very old great-grandmother with white hair and a pale shawl. Same render style as the people reference. Placeholders, not real people. Keep the top right corner of the image clear (a settings button goes there).

STYLE: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere: no signs, no writing on books, the bus or anything else.

Must read at phone size (shrunk to about 900 pixels wide): every place by its emblem, especially the bakery against the market; what each walking person carries; the duck; the four faces.
```

#### town-map-3: a funny miss, Zafar's Z Fold layout

- **shows:** What happens on a wrong tap (no frown: the place refuses in a funny way and the person shakes their head), at the very short 915x275 shape, drawn inside guide bars, with four faces under the cog's square
- **attach (2):** town-map-8.webp, customers-sheet.webp
- **save as:** mockup-town-map-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Make the image 16:9. Inside it, draw the game as a very wide, very short strip about 3.3 times as wide as it is tall, centred, with plain dark grey bars above and below it. Everything described below sits inside the strip.

THE SCENE: the same toy town as the attached approved map, TILTED about 50 degrees down so building fronts show, squeezed into two rows of four places with very little scenery between them: market (fruit and vegetable crates under a striped awning), park (pond, ducks, swings), bakery (giant loaf above the door), library (giant open book above the door), clinic (white, pink heart with a plaster above the door), post office (red postbox, plain sealed envelope with a red wax seal above the door), school (little roof with a weather vane, blackboard and bags by the gate, no slide), fire station (red, fire engine). All open and lit. Warm sun from the upper left. At the left end, a small bus stop with a cream bus and an empty cloth shopping bag; no one standing there.

THE MOMENT: the post office has just been tapped by mistake. Its red postbox is doing a cheerful little hop off the ground with a tiny puff of dust, and a single plain envelope is popping out of its slot. In front of the post office door, a small great-grandmother with white hair and a pale shawl is gently shaking her head with a warm, amused smile, one hand raised as if to say "not here". Nobody looks cross or sad. The bakery, the right place, has no glow and looks like all the others.

THE FACES: along the RIGHT edge of the strip, a narrow soft-green vertical column. At its top, an empty square space the size of one face (kept clear for a settings button; draw nothing there). Below it, four small round portrait circles stacked (head and shoulders, white ring): at the top a friendly woman in her thirties in a sage-green quarter-zip, then a grandfather in a navy blazer, the great-grandmother (with a soft golden ring round her circle, because she is the one chosen), and a young mother in a green dupatta. Placeholders, not real people.

STYLE: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere.

Must read when the strip is shown about 915 pixels wide and 275 tall: each place by its emblem at this tiny height, the hopping postbox, the great-grandmother's kind head-shake, and all four faces.
```

#### town-map-4: directions, the third visit (a later-visit mock-up, not run 1)

- **shows:** The directions visit: identical houses that only a position word tells apart ("Masi's house is next to the park")
- **attach (3):** town-map-8.webp, house-wide.png, customers-sheet.webp
- **save as:** mockup-town-map-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons), widescreen 16:9.

THE SCENE: the same toy town as the attached approved map, TILTED about 50 degrees down so building fronts show, warm late-morning sun from the upper left. Twelve rounded pavement plots in three rows of four on a looping road. Eight hold familiar places recognisable with no writing: market (fruit and vegetable crates under a striped awning), park (pond, ducks, swings), bakery (giant loaf above the door), library (giant open book above the door), clinic (white, pink heart with a plaster), post office (red postbox, plain sealed envelope with a red wax seal), school (little roof with a weather vane, blackboard and bags by the gate), fire station (red, fire engine).

THE HOUSE: on the plot right next to the park, draw ONE small house with great care: cream limewash walls, a terracotta roof, a sage-green door, two windows with plain curtains, one pot plant by the door. On three other plots (one behind the school, one opposite the bakery, one in front of the library), draw the SAME house again, as plain copies of it: same shape, same colours, same door, same windows, same pot. Keep them as simple as possible so they match.

THE MOMENT: a young mother in a green dupatta, small and full-body, has just knocked on the house next to the park. Its door is open and the very old great-grandmother with white hair and a pale shawl leans out of it, waving happily with both arms. At the house behind the school, a ginger cat is peeping out of a window, blinking, half-drawing the curtain (a gentle joke for a wrong guess). A small bus stop with a cream bus sits at the bottom left; no one is standing there.

THE FACES: along the bottom 16% of the image, a plain soft-green strip with four round portrait circles (head and shoulders, white ring), all bright, left to right: a friendly woman in her thirties in a sage-green quarter-zip, a grandfather in a navy blazer, the young mother, and a very old great-grandmother with white hair and a pale shawl. Placeholders, not real people. Keep the top right corner clear (a settings button goes there).

STYLE: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism, no blur.

Absolutely no text, letters or numbers anywhere: no house numbers, no signs, no writing.

Must read at phone size (shrunk to about 900 pixels wide): the one house design, which landmark each copy stands beside, the waving woman at the open door, and the cat at the window.
```

### 11. shops (Shops)

#### shops-1: serve at the fruit stall

- **shows:** The fruit stall from behind the counter at the moment a fruit lands on the scale, with the customer waiting
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp
- **save as:** mockup-shops-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel and no buttons.

The scene: a sunny open-air fruit and vegetable stall in a calm, modern small-town market, seen from BEHIND the counter at eye level, so we stand where the stallholder stands. The horizon is at about 55% of the height. Across the bottom third runs a wide wooden counter. On it, left of centre, two low woven crates piled high: one of bright yellow lemons, one of green-and-red mangoes, with plenty in each. In the middle of the counter stands a simple brass weighing scale with a round shallow pan on top and a round dial facing us; the dial has a single needle and plain tick marks only. One mango sits in the pan, and a second mango is in mid-air, hopping from the crate into the pan; the pan is dipping a little and the needle has swung. On the far side of the counter, on the right, a smiling woman of about forty stands waist up, facing us, in a long plain sage-green kameez and a cream dupatta loosely over her hair, holding out an open brown paper bag with both hands. At the far right edge, a friendly man in his fifties with a short grey beard, a cream cap and a green apron sits on a low stool sipping from a small glass of chai, watching kindly. Behind the customer: a soft, uncluttered market street with a couple of awnings and warm sunlight, plain walls, no signs.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows on the counter, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: not on the dial, the crates, the bag, the awnings, the walls or anything else.

It must read at phone size: the lemons and mangoes big, chunky and clearly different; the scale pan and its dip obvious; the flying mango clear; the customer's face and the held-out bag clear of everything; the seller's face clear at the edge.
```

#### shops-2: Nani's picky shopping (the X one)

- **shows:** The general store's counter with a big and a small pot side by side, the moment after the child gave the wrong (small) one: the grandmother holds a tiny pot to her eye like a monocle while both pots wait on the counter
- **attach (4):** cook-nani-sheet.webp, props-sheet.webp, customers-sheet.webp, cook-service-bg.jpg
- **save as:** mockup-shops-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel and no buttons.

The scene: inside a small, bright, modern general store in a market, seen from the customer's side at eye level, the horizon at about 55% of the height. A long pale-wood counter runs across the lower third. Behind it, plain shelves hold a few neat rows of steel pots and cups, calm and uncluttered, with one mirror-work trim along a shelf edge as the only decoration; at the left end of the shelves stands a short row of upright bolts of plain cotton cloth (red, green, blue). On the counter, centre, stand two shiny steel cooking pots side by side: one large and one small, the small one clearly about half the size of the large one. Behind the counter, centre-back, a cheerful shopkeeper in his sixties in a cream kurta and a brown waistcoat leans forward, both palms up, laughing; his face is above and clear of the pots. On the right, waist up, three-quarter on, a grandmother in a plain cream kameez with a few bold red embroidered motifs at the neck and cuffs and a plain red dupatta over her head, round thin gold glasses, holds a third, tiny steel pot (no bigger than a teacup) up to one eye like a monocle, with a big playful grin; a woven shopping basket hangs from her other arm. Warm sunlight falls through a doorway on the left.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: not on the shelves, pots, cloth, walls or anything else.

It must read at phone size: the big pot clearly big and the small pot clearly small, side by side; the grandmother's face and joke clear, the tiny pot over one eye only; the shopkeeper's face clear of the pots and the shelves.
```

#### shops-3: pay at level 4, a big screen

- **shows:** Paying a big price: the grandmother's open purse with two piles of coins, two short rows already counted out on the counter (big brass coins above, small copper ones below), and the shopkeeper's open hand
- **attach (4):** props-sheet.webp, style-anchor.png, cook-nani-sheet.webp, cook-service-bg.jpg
- **save as:** mockup-shops-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel and no buttons. A wide big-screen frame.

The scene: the same small modern general store, from the customer's side at eye level, the horizon at about 55% of the height; plain shelves behind, uncluttered. On the long pale-wood counter, at the left, lies an open soft red-and-cream embroidered purse with two neat heaps of coins inside it: a heap of big plain brass coins and a heap of small plain copper coins about half their size. Every coin is blank, with only a simple stamped flower in the middle and a raised rim. In the middle of the counter, as if just counted out, lie two short tidy rows, slightly overlapping like a fanned hand of cards: a short row of big brass coins on top, and below it a short row of a few small copper coins; one more small copper coin is mid-slide from the purse, with a tiny sparkle. On the right of centre, the shopkeeper in his sixties, cream kurta and brown waistcoat, leans over the counter with his open palm held out, waiting patiently with a warm smile. A small dented tin money box with its lid open sits at his elbow. On the far right, waist up, a grandmother in a cream kameez and red dupatta, round thin gold glasses, watches proudly with her hands together. A woven shopping basket with a big steel pot and a folded red cloth inside sits at the far right of the counter.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows under every coin, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: no digits, letters, script or faces on the coins, the purse, the tin or anything else.

It must read at phone size: the two kinds of coin clearly different in size and colour; the two rows clearly two rows, brass above copper; the open palm obvious; both faces clear of everything.
```

#### shops-4: Big Ma's cloth at the general store, for the short phone strip

- **shows:** The cloth bolts at the general store at the moment the red bolt unrolls across the counter, with the goat sneaking past with the shopping list
- **attach (3):** customers-sheet.webp, cook-nani-sheet.webp, farm-animals-a1.png
- **save as:** mockup-shops-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel and no buttons. Use the widest landscape frame you can make. The game will crop the top and bottom away and show only a thin band across the middle, about a third of the height, so put everything important inside that middle third: the counter, the cloth, the bolts, both faces and the goat. Keep the top and bottom thirds plain (ceiling, shelf tops, floor).

The scene: the same small modern general store in a calm market, seen from the customer's side at eye level, the horizon at about the middle of the height. Behind a long pale-wood counter, at the left end of the shelves, a low shelf holds four upright bolts of plain cotton cloth: one red, one green, one blue, one red with small white dots. The plain red bolt has just been flung across the counter and is unrolling in a long, smooth wave of red fabric along the counter, with a soft whoosh of movement. Behind the counter, centre, the cheerful shopkeeper in his sixties, cream kurta and brown waistcoat, holds a pair of big tailor's scissors upright, ready to snip. On the right, waist up, three-quarter on, a grandmother in a cream kameez and red dupatta, round thin gold glasses, holds open a woven shopping bag and smiles at the red cloth. At the far left, at counter height, a small friendly white goat trots past with a blank piece of paper in its mouth, looking pleased with itself. One mirror-work trim on the shelf edge is the only decoration; plain walls, no signs.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, soft contact shadows, chunky simplified shapes, clean surfaces, no outlines, no photorealism. Calm, warm, uncluttered.

Absolutely no text, letters or numbers anywhere: not on the paper in the goat's mouth, the cloth, the shelf or anything else.

It must read at phone size inside the middle band: the red cloth clearly red and clearly unrolling; the four bolts clearly different; both faces clear of the cloth and the scissors; the goat small but obvious at the left.
```

### 12. adoption-centre (Adoption centre)

#### adoption-centre-1: The wash, L1 (the dog's shake)

- **shows:** The main screen at its funniest moment: the room, the counter, the four tools, and the dog shaking water at the camera after its bath
- **attach (4):** cook-service-bg.jpg, farm-animals-a1.png, props-sheet.webp, farm-fields.png
- **save as:** mockup-adoption-centre-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, 3:2 landscape, the main play area only (no side panel, no menus, no buttons, no icons, no glowing highlights, no interface of any kind).

The scene: the inside of a small, bright pet hotel (a home where families leave their pets while they're away), seen at eye level, front on. Limewash cream walls, a big window at the back showing soft green farm fields and a few round trees in sunshine. Along the back wall, a row of little animal homes at floor level: a woven dog basket with a small indigo-and-red block-printed cushion, a wooden rabbit hutch, a small glass ant house, a little wooden bee box with a flower pot, and a cat cushion. In the middle of the back wall, a plain wooden front door, closed. In the front, filling the lower half, a long low pale-oak care counter. Along its front edge sit four big, clearly separate tools, all evenly lit: a small woven basket of yellow corn cobs with a steel bowl beside it, a white enamel tub with a yellow sponge and a small steel jug, a soft wooden brush, and a small woven basket bed with a cushion and a folded blanket. The right edge of the picture is plain room (wall and counter), with nobody standing there.

The moment: in the enamel tub in the middle of the counter, a friendly golden-brown medium-sized dog has just been rinsed and is shaking itself hard: its ears flap, its fur flies out in a ring, and a spray of clear water droplets flies toward the viewer, with a few round droplets landing on the "glass" of the screen. A few soap bubbles drift up. On a small round mat beside the tub, a tiny black ant watches with big delighted eyes.

Style: match the attached references. A stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (enamel, steel, oak, cloth, wet fur), soft contact shadows under everything on the counter. No outlines, no cel shading, no photorealism, no depth-of-field blur. The dog is clean and fluffy: no mud or dirt anywhere.

Absolutely no text, letters or numbers anywhere: none on the basket, the tub, the walls or the homes.

Must read at phone size (about 740x320 pixels): the dog's shake and the flying droplets, the tiny ant's face, and the four tools as four distinct shapes.
```

#### adoption-centre-2: Three animals at once, L2 (brush the bee)

- **shows:** L2's harder choice, three animals on their mats and four tools, with the brush just used on the bee
- **attach (3):** kept:adoption-centre-1, farm-animals-a1.png, props-sheet.webp
- **save as:** mockup-adoption-centre-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, 3:2 landscape, the main play area only (no side panel, no menus, no buttons, no icons, no glowing highlights, no dotted lines, no interface of any kind).

The scene: the same bright pet hotel as the first attached image, at eye level, front on: limewash cream walls, a window onto green farm fields, the row of little animal homes along the back wall with the plain wooden door in the middle, and the long low pale-oak care counter in front. On the counter, three soft round mats spaced well apart, each with an animal sitting on it, all three looking equally happy and alert (no animal looks hungry, sleepy or dirty): on the left a soft grey rabbit with upright ears; in the middle a round bumblebee about the size of a plum; on the right a tiny black ant. Along the counter's front edge, the four tools, all evenly lit: a small woven basket of corn cobs with a steel bowl, a white enamel tub with sponge and jug, a soft wooden brush, and a small woven basket bed with a folded blanket. The right edge of the picture is plain room, with nobody standing there.

The moment: the bee has just been brushed. The soft wooden brush rests on the counter beside it. The bee has puffed up into a perfectly round, fluffy yellow-and-black pompom with tiny wings, eyes closed in bliss, caught mid-wiggle with a soft motion swoosh behind it. The rabbit and the ant lean in to watch, amused.

Style: match the attached references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (fuzzy bee hair, rabbit fur, oak, enamel, steel), soft contact shadows. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320 pixels): three separate animals on three mats, the bee's fluffy pompom shape, the brush, and the four tools as four distinct shapes.
```

#### adoption-centre-3: Ali's turn, L3 (the speaking moment, bedtime)

- **shows:** The speaking handover: the child is about to tell the older cousin which care, and he is ready to do it
- **attach (4):** kept:adoption-centre-1, customers-sheet.webp, props-sheet.webp, farm-animals-a1.png
- **save as:** mockup-adoption-centre-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, 3:2 landscape, the main play area only (no side panel, no menus, no buttons, no icons, no speech bubbles, no interface of any kind).

The scene: the same bright pet hotel as the first attached image, at eye level, front on, now in soft golden afternoon light: limewash walls, a window onto green fields, the row of little animal homes along the back with the plain wooden door in the middle, the long pale-oak care counter in front with its four tools along the front edge (a small woven basket of corn cobs with a steel bowl, a white enamel tub with sponge and jug, a soft wooden brush, a small woven basket bed). In the middle of the counter, a tall, lanky boy of about eight in a plain blue long-sleeved kurta and trousers stands behind the counter, turned toward the viewer with an eager "ready!" face, holding a folded blanket. In front of him on a mat sits a sleek grey cat, calm and alert (not visibly tired). On one side of the counter, in a basket bed much too big for it, a tiny black ant lies tucked under a blanket, fast asleep, with a small round sleep cloud rising from it. The space above the boy's head and along the bottom edge of the picture is kept clear and calm (plain wall and counter front).

Style: match the attached references. A stylised 3D animated-feature look, soft warm golden-afternoon sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials, soft contact shadows. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320 pixels): the boy's face and blanket, the cat, and the tiny ant in the big bed.
```

#### adoption-centre-4: Going home, L4 (the small rabbit)

- **shows:** The served ending with L4's look-alike and stage B's own layout: the tools are gone, the candidates stand forward in one line, and a family at the back door has come for "the small rabbit"
- **attach (4):** kept:adoption-centre-1, customers-sheet.webp, farm-animals-a1.png, props-sheet.webp
- **save as:** mockup-adoption-centre-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets), one gameplay screen, 3:2 landscape, the main play area only (no side panel, no menus, no buttons, no icons, no glowing highlights, no interface of any kind).

The scene: the same bright pet hotel as the first attached image, at eye level, front on: limewash cream walls, a window onto sunny green farm fields, the long pale-oak care counter in front, now clear of tools. In the middle of the back wall the wooden front door stands open, sunlight spilling in. Just inside it, in the middle of the picture behind the counter, stand a mother in a modest long-sleeved deep plum kameez, loose trousers and a soft grey dupatta, and her daughter of about four in a marigold kameez with a light dupatta over leggings, holding a small woven carry basket with a cushion inside. On the counter, standing forward in one evenly spaced line, all looking equally cheerful: a golden dog, a big grey rabbit, a small grey rabbit (identical to the big one except clearly smaller), and a round bumblebee. The right edge of the picture is plain room, with nobody standing there.

The moment: the small rabbit is mid-hop through the air from the counter toward the girl's basket, ears streaming back, delighted. The girl's face lights up as she reaches for it; the mother smiles. The big rabbit watches with a fond look and one ear flopped.

Style: match the attached references. A stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, clean surfaces, believable materials (fur, oak, woven straw, cotton), soft contact shadows. No outlines, no cel shading, no photorealism, no depth-of-field or motion blur.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320 pixels): the big rabbit and the small rabbit side by side, the small one's hop toward the basket, the girl's happy face, and four animals as four separate shapes in one line.
```

### 13. safari (Safari)

#### safari-1: Snap from the jeep, level 1 (the first photo)

- **shows:** The core idea: the view from the jeep, the named animal in the gold frame, and its funny reaction to the shot
- **attach (4):** farm-fields.png, farm-animals-a1.png, props-sheet.webp, cook-service-bg.jpg
- **save as:** mockup-safari-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, wide landscape format.

The scene: the view out of the open side of a safari jeep, seen from the back seat at eye level, looking sideways at an East African savannah in warm late-morning sunlight. The jeep's dark green roof bars run along the top edge and its side rail along the bottom, framing the view like a window. Beyond: golden grass, two flat-topped acacia trees, a soft distant mountain, a pale blue sky. On the near grass verge, close to the jeep, a grown-up elephant stands side-on eating grass, and a zebra stands beside it, both fully visible and equally bright.

The moment: four soft rounded corner brackets, glowing gold like a camera viewfinder, frame the elephant. The photo has just been taken: a gentle white flash glow, and the elephant has turned its head towards us and squirts a playful arc of water from its trunk at the jeep, with big clear droplets running down the view. The zebra watches, calm.

Leave the right-hand fifth of the picture as plain savannah and jeep side rail: a character will be added there later. Do not draw any buttons.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. Animals are stylised and friendly, with big expressive eyes, never scary.

Absolutely no text, letters or numbers anywhere: no logos, no signs, nothing written on the jeep.

Must read at phone size (a screen only 320 px tall): the elephant, the gold brackets and the water squirt must be clear and big. Keep the sky and far hills as a thin band, and the animals large in the lower half.
```

#### safari-2: Snap from the jeep, level 2 (three of a kind, the verb decides)

- **shows:** Why the verb matters: three elephants at the waterhole do three different things, and the frame is gliding onto the one that's swimming
- **attach (3):** farm-fields.png, farm-animals-a1.png, cook-service-bg.jpg
- **save as:** mockup-safari-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, wide landscape format.

The scene: the same view out of the open side of a safari jeep at eye level, framed by dark green roof bars at the top and a side rail at the bottom. East African savannah in warm sunlight. Right in front of the jeep, on the near ground, is a waterhole: a grassy bank with a leafy bush on the left, a deep brown-green pool in the middle, and open sandy bank on the right.

The moment: three grown-up elephants, side-on, close together and all equally bright. One stands at the bush, eating leaves with its trunk. One is in the deep middle of the pool, swimming, only its head, ears, back and raised trunk above the water. One is running along the open bank, ears flapping, a little dust behind its feet, still close to the other two. Four soft rounded white corner brackets, like a camera viewfinder, are framing the swimming elephant. The three actions (eating, swimming, running) must be instantly different in silhouette.

Leave the right-hand fifth of the picture as plain savannah and jeep side rail: a character will be added there later. Do not draw any buttons.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. Friendly animals with big expressive eyes.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (320 px tall): all three elephants big in the lower half, their actions readable as silhouettes, the brackets clearly around only one. Thin sky band.
```

#### safari-3: Snap from the jeep, level 4 (baby or grown-up, the size decides)

- **shows:** The hardest version: a grown-up and two babies of one kind, where only size and verb together pick
- **attach (3):** farm-fields.png, farm-animals-a1.png, cook-service-bg.jpg
- **save as:** mockup-safari-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, wide landscape format.

The scene: the view out of the open side of a safari jeep at eye level, dark green roof bars along the top, a side rail along the bottom. Savannah in warm afternoon light. On the near ground, close to the jeep, stands a single flat-topped acacia tree with low leafy branches.

The moment: three giraffes, side-on, all fully visible and equally bright. A tall grown-up giraffe eats leaves from the top of the acacia. Beside it, a baby giraffe, clearly the same kind but about half the height, with a rounder younger face, eats leaves from a low branch. A second baby giraffe, the same size as the first, runs in a short dash beside them, legs splayed, still within the group. Four soft rounded corner brackets, glowing gold like a camera viewfinder, frame the eating baby giraffe. Baby versus grown-up must be obvious at a glance, and eating versus running readable as silhouettes.

Leave the right-hand fifth of the picture as plain savannah and jeep side rail: a character will be added there later. Do not draw any buttons.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. Friendly animals with big expressive eyes, never scary.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (320 px tall): the three giraffes as one group in the lower two-thirds, the two sizes clearly different, the gold brackets around only the eating baby.
```

#### safari-4: the giraffe's stare (the delight moment, on its own)

- **shows:** The reaction a builder must match: the giraffe's eye filling the frame after the shot
- **attach (2):** farm-animals-a1.png, cook-service-bg.jpg
- **save as:** mockup-safari-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, wide landscape format.

The scene: the view out of the open side of a safari jeep at eye level, dark green roof bars along the top and a side rail along the bottom, sunny savannah behind.

The moment: a grown-up giraffe has just been photographed and has swung its long neck down to the jeep. Its big curious eye, with long lashes, fills most of a frame of four soft rounded gold corner brackets in the middle of the view, peering straight into the lens. A soft white camera flash glow fades around it. It is funny and sweet, not scary: a curious, gentle look.

Leave the right-hand fifth of the picture as plain savannah and jeep side rail: a character will be added there later. Do not draw any buttons.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (320 px tall): the eye and the gold brackets clear and central.
```

#### safari-5: Who's hiding?, level 3 (the stripy one)

- **shows:** The second game: three clumps of long grass with only a back showing above each, and the zebra popping up from the one the child tapped
- **attach (3):** farm-fields.png, farm-animals-a1.png, cook-service-bg.jpg
- **save as:** mockup-safari-5.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, wide landscape format.

The scene: a stretch of East African savannah at eye level, side view, warm late-morning sunlight, a thin strip of pale sky and soft distant hills. Across the lower middle of the picture stand three clumps of tall golden grass, in one row, clearly separate, each about the same size, with clear ground between them. Nothing else in the scene looks like a place to tap: no rocks, no trees in the foreground.

The moment: above each clump, one animal's back shows and nothing else: above the left clump, a patch of grey wrinkly elephant back with the top of one big ear; above the right clump, a patch of a giraffe's spotty back. The middle clump has just parted: a zebra has popped up out of it, its whole stripy body showing, grinning and chewing a stalk of grass, delighted to be found. The other two clumps are still closed, with only their backs showing.

Leave the right-hand fifth of the picture as plain grass and sky: a character will be added there later. Do not draw any buttons.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. The animals are round, chunky and very cute, with big eyes; never scary.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (320 px tall): the three clumps large and clearly separate in one horizontal band; the stripes, the spots and the grey back each readable at a glance; the zebra's pop-up the focal point.
```

### 14. beach-boat (Beach and boat)

#### beach-boat-1: Shells

- **shows:** The top-down sand with shells in two sizes, at the moment the child lifts the shell hiding the crab
- **attach (4):** style-anchor.png, props-sheet.webp, farm-animals-a1.png, farm-fields.png
- **save as:** mockup-beach-boat-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: wet sand at the edge of a calm sea, seen exactly from overhead, straight down (90 degrees, no horizon, no perspective). A thin soft white foam edge of the sea runs along the top of the frame. On the smooth wet sand lie five seashells spread out in two loose rows with clear space between them: two big spiral shells, two small spiral shells of exactly the same shape and colour at a smaller size, and one grey pebble. A child's plain blue plastic bucket stands open at the right edge, seen from above, two shells already inside. In the top right corner there is clear empty sand (a face will go there). The moment: one of the big shells has just been lifted a little off the sand, and underneath it a small orange-red crab with big friendly stalk eyes is waving both claws, about to scuttle sideways. A few sand grains are flying. Everything casts a soft contact shadow.

Style: match the attached references: a stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, gentle global illumination, chunky simplified shapes, believable materials (glossy shell, wet sand sheen), clean surfaces, no outlines, no cel shading, no photorealism, no depth-of-field blur.

At phone size it must read clearly: the two shell sizes must be obviously big and small at a glance, the crab's eyes and claws must read, and each shell must be big enough to tap with a small finger.

Absolutely no text, letters or numbers anywhere in the image.
```

#### beach-boat-2: The sandcastle

- **shows:** The moment the last tower lifts and the crab pops out on top. It shows the build by amounts (three tower heights) and the joke, with Masi beside the child
- **attach (4):** town-road.png, customers-sheet.webp, props-sheet.webp, farm-animals-a1.png
- **save as:** mockup-beach-boat-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: a sunny beach seen at eye level from sand height, the calm sea and a pale sky far behind with the horizon at about 55 percent of the frame height. In the middle, on smooth damp sand, stands a child's sandcastle: a row of three towers side by side made from buckets, one tall, one short and squat, one tiny stump, each with a small shell on top. A small orange-red crab peeks out of the top of the tall tower wearing a shell like a hat. On the right, kneeling beside the castle, a smiling woman in her forties wearing a teal patterned headscarf and a long-sleeved embroidered tunic claps her hands, seen from the waist up, her face fully visible and clear of the castle. Along the bottom left, in a neat strip: two plain yellow plastic buckets of exactly the same colour and shape, one big and one small; a heap of dry sand with a spade standing in it; and a short row of seashells. Soft contact shadows on the sand.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (packed damp sand with crisp bucket ridges, plastic buckets), no outlines, no photorealism. The woman is modestly dressed: long sleeves, headscarf.

At phone size it must read clearly: the three tower heights (tall, squat, stump) must be obviously different, the two buckets must differ only in size, and the woman's face must stay clear of everything.

Absolutely no text, letters or numbers anywhere in the image, including on the buckets.
```

#### beach-boat-3: The three stalls

- **shows:** The wide view of the three stalls, at the moment the child chooses one
- **attach (4):** town-road.png, customers-sheet.webp, props-sheet.webp, cook-service-bg.jpg
- **save as:** mockup-beach-boat-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: the top of a sunny beach seen at eye level, horizon at about 55 percent, the sea and a few palm trees behind, a band of clear pale sky above the stalls. Three small food stalls stand side by side across the full width on the sand, each a simple painted wooden cart with a cloth awning, all in full bright colour. Left: a corn cart with a charcoal grill, corn cobs roasting and more cobs lying in small tied bundles, a man in a cap and a long-sleeved shirt behind it, waving. Middle: a cassava chips stall with a small fryer and two paper cones, one big and one small, a woman in a headscarf and long-sleeved tunic waving and calling. Right: a coconut cart heaped with green coconuts and little cups of straws, a man in a long-sleeved shirt waving. The three stallholders' faces sit in one row at the same height, under their awnings, clear of each other. In front, at the right edge of the frame and low, stands a woman in a teal patterned headscarf and long-sleeved tunic holding a woven picnic basket, seen from the waist up, her face clear of the stalls. Everyone is modestly dressed; nobody wears swimwear.

Style: match the attached references: a stylised 3D animated-feature look, soft warm late-morning sunlight from the upper left, chunky simplified shapes, believable materials (painted wood, charcoal glow, glossy corn, rough coconut husk), no outlines, no photorealism, calm uncluttered composition.

At phone size it must read clearly: the three stalls and what each sells (corn, chips, coconuts) must be recognisable at a glance, and every face must be clear of the stalls and of each other.

Absolutely no text, letters or numbers anywhere in the image, including on the awnings, carts, prices and signs.
```

#### beach-boat-4: The picnic

- **shows:** The cloth with the family behind it, at the moment the crab steals the last chip
- **attach (4):** cook-service-bg.jpg, nani-sheet.png, customers-sheet.webp, props-sheet.webp
- **save as:** mockup-beach-boat-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: a picnic on the sand seen at eye level from a sitting child's height, framed like a kitchen island: a plain patterned picnic cloth spread across the lower 60 percent of the frame with its front edge nearly horizontal, and behind it, seen from the chest up in the top 40 percent, a grandmother (match the attached grandmother sheet exactly: cream kameez with a few bold red motifs at the neck and cuffs, plain red dupatta, no rings) sitting in the middle and a woman in a teal patterned headscarf and long-sleeved embroidered tunic sitting on the right, both laughing. The calm sea and pale sky behind them. On the cloth, in two neat rows with clear space between things, every place is marked by the same faint dashed chalk-white outline: a plate place and a cup place in front of each woman, a plate place and a cup place at the front left, one in the middle of the cloth, and one at the right edge where a small steel tiffin box sits with its lid open. On some of the places: plates, identical cups, grilled corn cobs in paper sleeves, a paper cone of golden cassava chips, two green coconuts with straws, a jug of pale lemon drink, a blue bucket of shells. A woven basket sits at the front left. The moment: a small orange-red crab has climbed out of the basket and is holding the very last chip in one claw, scuttling sideways off the cloth. Soft contact shadows on everything.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (cotton cloth, steel tiffin, glossy corn, rough coconut husk), no outlines on objects, no photorealism. Modest dress; no religious symbols.

At phone size it must read clearly: each item and each marked place on the cloth must be separate and tappable, all the place outlines must look exactly alike, both faces must stay clear and expressive, and the crab with its chip must read as a joke.

Absolutely no text, letters or numbers anywhere in the image.
```

#### beach-boat-5: Litter fishing on the boat day

- **shows:** The cutaway under the boat, at the moment a shoe comes up on the hook with a crab in it
- **attach (5):** farm-fields.png, customers-sheet.webp, nani-sheet.png, props-sheet.webp, farm-animals-a1.png
- **save as:** mockup-beach-boat-5.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, landscape, the main play area only (no side panel, no buttons, no interface).

The scene: a side-on cutaway of a calm, clear bay, like a cross-section. The waterline runs straight across at 40 percent of the frame height from the top. Above it, at the left, only the rail of a small painted wooden boat shows along the waterline, cropped by the frame edge; at the rail, cut at the chest and standing in one row with their faces at the same height and clear of each other: a grandmother (match the attached grandmother sheet: cream kameez, red dupatta) in a life jacket, laughing with one hand on her head where her sun hat was; a woman in a teal headscarf and long-sleeved tunic in a life jacket, pointing down into the water; and a small girl in a long-sleeved top and a life jacket holding a short fishing rod. The sky to the right of them is clear and empty (a speech bubble will go there). Below the waterline: clear green water down to a sandy seabed, and six everyday things in two loose rows with clear space between them, all sitting still or bobbing gently in place: a glass bottle, a can, a plastic bag, a sock, a ball, and a wide straw sun hat half sunk on the sand. Three small friendly fish swim among them. The moment: the fishing line runs straight down from the rod to an old shoe that is rising through a trail of bubbles, and a tiny orange-red crab is peeking out of the shoe. Soft light rays through the water.

Style: match the attached references: a stylised 3D animated-feature look, soft warm sunlight from the upper left, chunky simplified shapes, believable materials (wet painted wood, glass, cotton, clear water with gentle caustics), no outlines, no photorealism, nothing scary or dirty-looking; the things look like lost everyday objects, not grime. Modest dress; no swimwear.

At phone size it must read clearly: every thing under the water must be recognisable and separate, the line from the rod to the shoe must be obvious, and the three faces at the rail must stay clear.

Absolutely no text, letters or numbers anywhere in the image, including on the bottle, the can and the boat.
```

### 15. school-day (School day)

#### school-day-1: Pack the school bag at Nani's door (L2)

- **shows:** The opening game at L2: the bench, the open bag, school things with spare pencils, a toy, and one right pick hopping in
- **attach (3):** cook-service-bg.jpg, nani-sheet.png, props-sheet.webp
- **save as:** mockup-school-day-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen only: the main play area, no side panel, no buttons, no interface.

The scene: the inside of a grandmother's front door in a warm modern home, morning. Eye-level camera, looking straight at a low pale-oak bench against a limewash cream wall; the horizon about halfway up. The front door is at the right edge, slightly open, bright sunlight outside. A mirror-work frame on the wall (the only decoration). A woven doormat on the floor.

On the bench, at its right end: an open children's school bag (navy, chunky, the flap up). Along the rest of the bench and on a cubby shelf under it, well spaced in four clear spots: a hardback picture book; three yellow pencils standing upright side by side, a finger's width apart; a small box of chunky crayons; and a soft brown teddy bear sitting on the cubby shelf.

The moment: one yellow pencil is mid-hop, arcing from the group into the open bag. Nothing else moves.

At the right, standing beside the bag and cut at the waist: the grandmother from the attached sheet, matching her face, glasses and clothes exactly (a plain cream kameez with a few bold red motifs at the neck and cuffs, a plain red dupatta), slim, kind face, smiling, one hand gesturing towards the bag. Nobody else.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft contact shadows, chunky simplified shapes, clean surfaces, believable materials, big expressive eyes. No outlines, no cel shading, no photorealism, no depth-of-field blur.

Absolutely no text, letters, numbers, logos or writing anywhere: not on the book cover, the bag, the pencils, the crayon box or the walls.

Must read at phone size (the whole image shown about 740 pixels wide): every item clearly separate and at least an eighth of the image's height; the three pencils easy to count at a glance; plain wall beside and above the grandmother's head, with room there for a speech bubble.

Landscape, 16:9.
```

#### school-day-2: The blackboard, draw it (L1: the drawing comes alive)

- **shows:** The heart of the board game at L1: three dotted pictures, one traced by the child's chalk, and the reward of it coming alive
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, style-anchor.png
- **save as:** mockup-school-day-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen only: the main play area, no side panel, no buttons, no interface.

The scene: a bright, calm primary-school classroom, eye-level camera looking straight at a big dark-green blackboard that fills the left three-quarters of the frame. A wooden chalk tray runs along the bottom of the board, holding one stick of white chalk. The right quarter of the frame is plain warm cream wall, with a tall window at the upper right letting in warm morning sunlight. There are NO posters, NO alphabet, NO number lines, NO labels and NO writing anywhere in the room.

On the board, three simple chalk pictures in a child-friendly style, well spaced in a row: a faint dotted outline of a house, a faint dotted outline of a toy car, and a bird that has just been drawn in solid white chalk. A stick of white chalk floats at the end of the bird's outline, as if just lifted. The moment: the freshly drawn chalk bird has come alive: it is flapping its chalk wings and flying a little loop near the top of the board, leaving a tiny puff of chalk dust behind it. It looks delighted.

In the plain wall area at the right, standing beside the board: a young woman teacher, a generic character and not anyone real, in a long sage-green kurta, loose trousers and a soft cardigan, a plain dupatta over her shoulders, modest, warm and encouraging, three-quarter view, one hand open towards the board, smiling at the flying bird.

Style: match the references. A stylised 3D animated-feature look for the room and the teacher, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. The chalk drawings are soft chalky white lines on the board, simple and charming, with a gentle chalk-dust texture.

Absolutely no text, letters, numbers or writing anywhere: the board has only the chalk pictures, never letters, numbers or words.

Must read at phone size (about 740 pixels wide): each chalk picture large and separate, at least a quarter of the board's height; the dotted outlines clearly dotted; the teacher's face clear against the plain wall, with plain wall beside her head for a speech bubble.

Landscape, 16:9.
```

#### school-day-3: The blackboard, count them (L1: ring the three birds)

- **shows:** How numbers work without any digits: groups of chalk birds, the chosen group ringed, and the birds bouncing as the teacher counts
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, style-anchor.png
- **save as:** mockup-school-day-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen only: the main play area, no side panel, no buttons, no interface.

The scene: the same calm classroom, eye-level camera straight on to a big dark-green blackboard filling the left three-quarters of the frame, a wooden chalk tray along its bottom with sticks of white, red and green chalk and a felt duster. The right quarter is plain cream wall with a tall window at the upper right and warm morning sunlight. NO posters, NO alphabet, NO number lines and NO writing anywhere.

On the board: three short horizontal chalk lines like little wires, well spaced in a row, with simple white chalk birds sitting on them. The left wire has two birds, the middle wire has three birds, the right wire has one bird. All the birds are the same simple shape. The moment: a loose hand-drawn white chalk ring has just been drawn around the middle wire's three birds, and the three birds inside the ring are bouncing up one after another, happily, as they are counted. A tiny sparkle of chalk dust where the ring closed.

In the plain wall area at the right, beside the board: a young woman teacher, a generic character and not anyone real, in a long sage-green kurta, loose trousers, a soft cardigan and a plain dupatta over her shoulders, modest, front-facing now, pointing gently at the bouncing birds, mouth open mid-word as if counting aloud, delighted.

Style: match the references. A stylised 3D animated-feature look for the room and the teacher, soft warm sunlight, chunky simplified shapes, no outlines, no photorealism. The board pictures are soft, charming chalk drawings with a light chalk texture.

Absolutely no text, letters, numbers or digits anywhere, including on the board: the counting is shown only by the birds themselves.

Must read at phone size (about 740 pixels wide): each bird a clear separate shape; the groups of one, two and three easy to tell apart at a glance; the chalk ring obvious; plain wall beside the teacher's head for a speech bubble.

Landscape, 16:9.
```

#### school-day-4: The blackboard, rub it out (L2: the wrong one dodges)

- **shows:** The funniest moment and the coloured pictures at L2: a red car, a green car and a red bird, the duster on the wrong car and the car reversing out of its way
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, style-anchor.png
- **save as:** mockup-school-day-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets). One gameplay screen only: the main play area, no side panel, no buttons, no interface.

The scene: the same calm classroom, eye-level camera straight on to a big dark-green blackboard filling the left three-quarters of the frame, a wooden chalk tray along its bottom with a red chalk, a green chalk and a felt duster. The right quarter is plain cream wall with a tall window at the upper right and warm morning sunlight. NO posters, NO alphabet, NO number lines and NO writing anywhere.

On the board, three simple chalk drawings filled in with chalk colour, well spaced in a row: a red toy car, a green toy car of exactly the same shape, and a red bird. The moment: a grey felt duster has just come down on the green car, and the green car is reversing out of the way in a comic hurry, with little chalk speed lines and wide startled headlights, so the duster wipes only empty board. A puff of chalk dust. The red car and the red bird look on, amused.

In the plain wall area at the right, beside the board: a young woman teacher, a generic character and not anyone real, in a long sage-green kurta, loose trousers, a soft cardigan and a plain dupatta over her shoulders, modest, laughing with a hand to her cheek. Nobody else.

Style: match the references. A stylised 3D animated-feature look for the room and the teacher, soft warm sunlight, chunky simplified shapes, big expressive eyes, no outlines, no photorealism. The chalk pictures are soft, charming, lightly textured chalk.

Absolutely no text, letters, numbers or writing anywhere, on the board or in the room.

Must read at phone size (about 740 pixels wide): the two cars clearly the same shape but different colours; the red bird clearly a bird; the car's dodge readable at a glance; the teacher's face clear against plain wall, with room beside her head for a speech bubble.

Landscape, 16:9.
```

### 16. wake-up-clock (Wake-up clock)

#### wake-up-clock-1: level 1, the first wake at dawn

- **shows:** The core move: the wall clock reads 6:00, the boy whose bedside alarm also says 6:00 has just woken and bolts upright, and the others sleep on
- **attach (4):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp, house-wide.png
- **save as:** mockup-wake-up-clock-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, front, raised slightly (about 15 degrees down). The sleepers lie on their sides facing the camera on propped-up pillows, so every face is clearly seen, never just the top of a head. Wide landscape frame.

The scene: a calm, modern grandmother's bedroom in an East African family home with a gentle Kutch touch: limewash cream walls, pale oak furniture, one indigo ajrakh-print quilt as the only cultural pattern. Three single beds stand side by side across the frame, headboards against the back wall, each with a small wooden bedside table beside it. On each bedside table is a small, chunky, rounded digital alarm clock. Above the middle bed hangs a big, chunky digital wall clock with a brass frame and a dark face showing glowing warm digits, with a tiny glowing sun shape beside them. A window at the top left shows a soft pink dawn sky with the last of the stars. The room is in cool early-morning light with a warm glow coming in from the window.

The people: in the left bed, a young mother in a long-sleeved cotton nightdress with a loose cotton dupatta, fast asleep on her side facing us. In the right bed, a grandfather with grey hair, asleep on his side facing us, his glasses folded on his bedside table. In the middle bed, a tall, lanky boy of about eight in long-sleeved cotton pyjamas; a big, round-faced charcoal-black cat with pale green eyes is curled asleep at the foot of his bed.

The moment: the middle bedside alarm clock is tilted mid-rattle, and the boy has just bolted upright, eyes wide, hair sticking up wildly, arms flung up in a huge yawn and stretch, his pillow flopping off the side of the bed; the cat is springing up in surprise. The mother and grandfather sleep on peacefully. No motion lines, no glow around anyone.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, big expressive eyes, rosy cheeks, believable cotton and wood, no outlines, no photorealism, no cel shading, no blur or vignette.

Absolutely no text, letters or numbers anywhere, except the digits on the clocks: the wall clock shows only "6:00"; the middle bedside alarm shows only "6:00"; the left bedside alarm shows only "9:00"; the right bedside alarm shows only "7:00". No letter Z for snoring, no other symbols, no speech bubbles. Nothing else has any writing, numbers or logos.

Must read at phone size: the three faces and their expressions, the big wall clock's digits, the boy's wake-up pose and the cat.
```

#### wake-up-clock-2: level 2, the times only heard

- **shows:** The harder version: the bedside alarms are frosted so their times can't be read, and only the wall clock's 7:00 is visible
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp
- **save as:** mockup-wake-up-clock-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, front, raised slightly (about 15 degrees down). The sleepers lie on their sides facing the camera on propped-up pillows, so every face is clearly seen. Wide landscape frame.

The scene: the same calm, modern grandmother's bedroom: limewash cream walls, pale oak furniture, one indigo ajrakh-print quilt. Three single beds side by side, headboards against the back wall, a small wooden bedside table beside each. On each bedside table, a small chunky rounded digital alarm clock whose face is covered by frosted, misty glass, so its display is only a soft glow and cannot be read. Above the middle bed, a big chunky brass-framed digital wall clock with glowing warm digits and a tiny glowing sun shape beside them. The window at the top left shows a fresh early-morning sky, the sun just up. Soft warm morning light.

The people: this time the order is different. In the left bed, a tall, lanky boy of about eight in long-sleeved cotton pyjamas, asleep on his side facing us, one foot sticking out of the blanket. In the middle bed, a young mother in a long-sleeved cotton nightdress and a loose cotton dupatta, asleep on her side facing us, the quilt pulled up to her chin. In the right bed, a grandfather with grey hair in a long-sleeved cotton kurta-pyjama.

The moment: the grandfather's frosted bedside alarm is tilted mid-rattle. He has just sat bolt upright, hair ruffled, putting his round glasses on upside down with a sleepy, surprised smile. A big, round-faced charcoal-black cat with pale green eyes that was asleep at the foot of his bed has sprung into the air in a comic little hop, paws out, ears back, about to land on all fours. The boy and the mother sleep on. No motion lines, no glow around anyone.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, big expressive eyes, rosy cheeks, no outlines, no photorealism, no cel shading, no blur or vignette on the image (only the frosted glass on the three small alarm clocks).

Absolutely no text, letters or numbers anywhere, except the wall clock, which shows only "7:00". The three bedside alarms show no readable digits at all, only a frosted glow. No letter Z for snoring, no other symbols, no speech bubbles. Nothing else has any writing, numbers or logos.

Must read at phone size: the three faces, the wall clock's digits, the frosted alarms clearly unreadable, the grandfather's upside-down glasses and the cat mid-hop.
```

#### wake-up-clock-3: level 3, morning or night (a wrong time, at night)

- **shows:** The time of day doing its job: the wall clock reads 7:00 with a small moon beside it, and the window shows the moon, so it's seven at night
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, house-wide.png
- **save as:** mockup-wake-up-clock-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, front, raised slightly (about 15 degrees down). The sleepers lie on their sides facing the camera on propped-up pillows, so every face is clearly seen. Wide landscape frame.

The scene: the same calm, modern grandmother's bedroom at night: limewash cream walls in cool blue moonlight, pale oak furniture, one indigo ajrakh-print quilt. Three single beds side by side, headboards against the back wall, a small wooden bedside table beside each with a small chunky digital alarm clock whose face is frosted and unreadable. One small table lamp is off. Above the middle bed, a big chunky brass-framed digital wall clock with glowing warm digits and a tiny glowing crescent-moon shape beside them, casting a soft amber glow on the wall. The window at the top left is large and clear: a deep blue night sky, a bright full round moon and stars.

The people: in the left bed, a grandfather with grey hair, fast asleep on his side facing us, glasses on his bedside table. In the middle bed, a tall, lanky boy of about eight, asleep on his side facing us, hugging his pillow. In the right bed, a young mother in a long-sleeved cotton nightdress and a loose cotton dupatta.

The moment: the mother has just been nudged awake too early. Still lying on her side facing us, eyes closed, she pulls the quilt up to her chin with one hand and gives a sleepy little wave with the other, as if saying "not now". Her face is peaceful and a little amused, never cross, and fully visible. The others sleep on. No motion lines.

Style: match the references: a stylised 3D animated-feature look, soft warm lamp and moonlight, soft global illumination, chunky simplified shapes, big expressive eyes, rosy cheeks, no outlines, no photorealism, no cel shading, no blur or vignette on the image.

Absolutely no text, letters or numbers anywhere, except the wall clock, which shows only "7:00". No letter Z for snoring, no other symbols, no speech bubbles. The bedside alarms show no readable digits.

Must read at phone size: the moon on the wall clock and in the window, the wall clock's digits, the mother's sleepy wave, the other two faces asleep.
```

#### wake-up-clock-4: the end, everyone up and chai served

- **shows:** How a round ends: the curtains are open on a sunny morning, all three are up and stretching, and the grandmother brings in chai and milk
- **attach (4):** cook-service-bg.jpg, customers-sheet.webp, cook-nani-sheet.webp, props-sheet.webp
- **save as:** mockup-wake-up-clock-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the main play area only (no side panel, no buttons). Eye-level camera, front, raised slightly (about 15 degrees down). Wide landscape frame.

The scene: the same calm, modern grandmother's bedroom in full morning sun: limewash cream walls, pale oak furniture, one indigo ajrakh-print quilt now thrown back. Three single beds side by side, their blankets rumpled and empty. Above the middle bed, the big chunky brass-framed digital wall clock with glowing warm digits and a tiny glowing sun shape beside them. The window at the top left has its curtains swung wide open on a bright blue sunny sky with a few soft clouds; warm sunlight falls in long window-shaped patches across the floor.

The people: a grandfather with grey hair and round glasses, a young mother in a long-sleeved cotton nightdress and a loose cotton dupatta, and a tall, lanky boy of about eight in long-sleeved cotton pyjamas with his hair still sticking up, all standing in a happy row near the window, mid big morning stretch, smiling. A big, round-faced charcoal-black cat with pale green eyes sits washing its paw on the floor. Entering from the right, a grandmother in a cream kameez with bold red motifs at the neck and cuffs and a plain red dupatta carries a brass tray with two small glasses of milky chai and one glass of milk, smiling warmly.

The moment: the boy is reaching for his glass of milk; the grown-ups turn towards the tray.

Style: match the references: a stylised 3D animated-feature look, soft warm sunlight, soft global illumination, chunky simplified shapes, big expressive eyes, rosy cheeks, believable brass, glass and cotton, no outlines, no photorealism, no cel shading, no blur or vignette.

Absolutely no text, letters or numbers anywhere, except the wall clock, which shows only "9:00". No letter Z, no other symbols, no speech bubbles. Nothing else has any writing, numbers or logos.

Must read at phone size: all four faces and their smiles, the tray with the three glasses, the sunny window and the wall clock's digits.
```

### 17. sewing (Sewing)

#### sewing-1: the cloth stall (buy cloth)

- **shows:** The stall just after the tap: two bolts, the asked one unrolling, Big Ma at the side in her going-out clothes
- **attach (4):** town-road.png, cook-service-bg.jpg, customers-sheet.webp, props-sheet.webp (the design also lists the great-grandmother's sheet "once signed off": it isn't yet, so attach nothing for it)
- **save as:** mockup-sewing-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, no buttons.

The scene: a small cloth stall in a calm, modern market street, with one or two gentle East African and Kutch touches only (a thin mirror-work trim along the front of the counter; nothing else decorative), eye-level camera from the customer's side like a family film, horizon at about the middle of the frame. Match the town-road reference for the setting. A long pale-oak counter runs across the lower third. Behind it, in the middle of the frame, a friendly middle-aged cloth seller with a neat grey beard, in a plain sand-coloured kurta, cut at the chest by the counter. Behind him, plain limewash-cream shelves with a few folded cloths in calm, soft colours (kept pale and quiet). At the right edge of the frame, cropped at the waist, a very elderly, small great-grandmother with a gentle, knowing smile: dark hair, greying, pulled back under a plain black headscarf; thin rectangular metal glasses; a plain black abaya with a little embroidered trim at the cuffs; thin gold bangles; holding a cloth shopping bag and pointing gently at the counter. The left third of the frame is calm and uncluttered.

The moment: on the counter stand two tall bolts of cloth on their ends, side by side, clearly different: one rich red, one leaf green. The red bolt is flopping open across the counter towards the viewer, the cloth unrolling in a smooth wave with a tiny puff of lint. The green bolt stays standing. The seller's eyebrows are up in a happy "here you go". No glow, no highlight, nothing dimmed.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft shadows, chunky simplified shapes, believable cotton cloth and wood, big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Every resting object has a soft contact shadow; nothing floats. Modest clothing, no religious symbols or markers of any kind.

Absolutely no text, letters or numbers anywhere: not on the shelves, the cloth, the bag, signs or anywhere else. No signboards.

Must read at phone size (about 740x320): both faces, the great-grandmother's glasses and headscarf, the two bolts as clearly red and clearly green, and the unrolling cloth.
```

#### sewing-2: make (tap the long line, then cut)

- **shows:** Big Ma's table from exactly overhead at the cut: both chalk lines drawn, the long one tapped and lit, the scissors following it, and the cat's paw stealing the offcut
- **attach (4):** style-anchor.png, props-sheet.webp, customers-sheet.webp, cook-service-bg.jpg (the design also lists the great-grandmother's sheet "once signed off": it isn't yet, so attach nothing for it)
- **save as:** mockup-sewing-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, no buttons.

The scene: a seamstress's work table seen from EXACTLY straight above (a true 90-degree top-down view: no walls, no horizon, no tilt; round things read as perfect circles). The pale-oak table top fills the whole frame edge to edge. In the middle, a large piece of rich red cotton cloth lies flat. On it, a paper pattern piece shaped like a child's kurta (body with one sleeve sticking out) is laid down, and chalk lines trace around it. On the sleeve there are TWO parallel chalk lines across its end, the same colour and thickness: one making the sleeve long (near the wrist), one making it short (near the elbow). A pair of chunky steel scissors is halfway along the LONG line, the cut edge clean behind them. At the top edge of the frame, the top of a cream-and-brass sewing machine seen straight down, cut off by the frame. At the left side of the table, two other paper pattern pieces lie loose: a round cap crown and a long thin strip. A small brass tin of pins is the one decorative touch. At the bottom right edge, a fluffy charcoal-grey cat's paw reaches in from off the table and bats a small red triangular offcut of cloth away, mid-swipe.

In the top right corner, over bare table and clear of the cloth, a small round portrait frame showing the face of a cheerful boy of about six with short black hair, looking down at the table, delighted. Beside it, a smaller round frame with the face of a very elderly great-grandmother: dark hair, greying, pulled back under a soft, plain dark headscarf; thin rectangular metal glasses; a gentle, knowing smile.

The moment: a soft breathing gold glow box (a rounded rectangle of light, never an outline) sits around the long chalk line and the scissors on it; the short line is not lit; the rest of the table is slightly dimmed.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft contact shadows, chunky simplified shapes, believable cotton, paper, steel, brass and oak, no outlines, no cel shading, no photorealism, no depth-of-field blur. Nothing floats. No hands or arms anywhere (the scissors move on their own); the cat's paw is the only limb.

Absolutely no text, letters or numbers anywhere: not on the patterns, the machine, the tin or the table. No measuring numbers on anything.

Must read at phone size (about 740x320): the two chalk lines as clearly different lengths, the lit long line with the scissors on it, both faces, the cat's paw.
```

#### sewing-3: mend (two faults; the said one decides)

- **shows:** The mend: a kurta flat on the table with two faults at once, the needle zipping the asked one shut, and the grandfather's face reacting
- **attach (3):** style-anchor.png, props-sheet.webp, customers-sheet.webp (the design also lists the great-grandmother's sheet "once signed off": it isn't yet, so attach nothing for it)
- **save as:** mockup-sewing-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen, the main play area only, no side panel, no buttons.

The scene: the same seamstress's pale-oak work table seen from EXACTLY straight above (true top-down, no walls, no tilt). Slightly left of centre, a man's pale-cream cotton kurta lies flat, sleeves out to the sides, taking up about two thirds of the frame's width and leaving the top-right quarter of the table bare. It has TWO different faults, both equally visible and neither highlighted: on the left sleeve near the cuff, a ragged torn slit; on the front placket, one of the three buttons is missing, two loose thread ends showing where it was. At the table's bottom edge, a small round brass button tin seen from above, with a few cream buttons in it, and a spool of cream thread.

The moment: the torn sleeve has just been tapped. A steel needle trailing cream thread is zipping along it in a neat zig-zag, and the tear is closing behind it: the first half is already neatly stitched, the second half still open. A soft breathing gold glow box (a rounded rectangle of light, never an outline) surrounds the whole kurta; the table around it is slightly dimmed. The missing-button spot is left as it is.

In the top right corner, over the bare table and well clear of the kurta's sleeve, a round portrait frame shows the face of a grandfather with a white moustache and kind eyes, eyebrows raised in delight, a little chuckle. Beside it, a smaller round frame shows a very elderly great-grandmother: dark hair, greying, pulled back under a soft, plain dark headscarf; thin rectangular metal glasses; a gentle, knowing smile.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle contact shadows, chunky simplified shapes, believable cotton weave, steel and brass, no outlines, no cel shading, no photorealism, no depth-of-field blur. Nothing floats. No hands or arms (the needle moves on its own). Modest clothing, no religious symbols or markers of any kind.

Absolutely no text, letters or numbers anywhere.

Must read at phone size (about 740x320): both faults (the torn sleeve and the missing button) clearly visible at once, the stitching in progress, both faces, and no face over the kurta.
```

#### sewing-4: the fitting at phone size (the size gag)

- **shows:** The fitting at its funny miss, laid out for a phone: the boy full length on Big Ma's low stool in a far-too-long kurta, the hem spilling onto the floor, the rail on the wall beside him, Big Ma laughing
- **attach (3):** style-anchor.png, customers-sheet.webp, house-wide.png (the design also lists the great-grandmother's sheet "once signed off": it isn't yet, so attach nothing for it)
- **save as:** mockup-sewing-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen at a wide phone shape (about 740x320), the main play area only, no side panel, no buttons.

The scene: a calm, sunny sewing room in a modern home with one Kutch touch (a small mirror-work cushion on a chair), eye-level front camera like a family film. Limewash-cream walls, a plain floor. In the middle of the frame, a boy of about six with short black hair stands FULL LENGTH on a low wooden stool, his whole body in frame from the top of his head to the stool's feet, with a strip of floor visible below the stool. He is wearing a far-too-long red kurta that has just been put on: the hem spills over the edge of the stool and pools on the floor, and the sleeves flop well past his hands like puppet sleeves; he is flapping them and laughing, plain trousers underneath. To the left of the boy, between him and the plain left third of the frame, a short pale-oak wall rail is fixed to the back wall at the boy's shoulder height, with 3 garments hanging on wooden hangers, seen straight on, hanging no lower than the boy's knees and never in front of him: an empty swinging hanger (where the kurta came from), a child-size red kurta of the right length, and a red cap on a hook. On the right edge, cropped at the waist, a very elderly, small great-grandmother with a gentle, knowing smile: dark hair, greying, pulled back under a soft, plain dark headscarf; thin rectangular metal glasses; a soft cotton house dress, maroon with a small white paisley print and a little lace trim; thin gold bangles; a tape measure round her neck; laughing kindly with one hand on her cheek. The left third of the frame is calm, plain wall. No mirror in this shot.

The moment: the empty hanger on the rail is still swinging, showing where the kurta came from. A soft breathing gold glow box (a rounded rectangle of light, never an outline) sits around the rail, the next thing to tap; the boy is not lit. Nobody looks cross: everyone is giggling.

Style: match the references exactly: a stylised 3D animated-feature look, soft warm sunlight from the upper left, gentle soft shadows, chunky simplified shapes, believable cotton, oak and wood, big expressive eyes, no outlines, no cel shading, no photorealism, no depth-of-field blur. Contact shadows under the stool and the boy's feet; nothing floats. Modest clothing throughout, no bare skin beyond face, hands and feet, no religious symbols or markers of any kind.

Absolutely no text, letters or numbers anywhere: not on the wall, the hangers or the clothes.

Must read at phone size (about 740x320): the boy's face, the kurta's hem on the floor and the floppy sleeves (none of it behind the rail or cut off by the frame), the great-grandmother's laugh and glasses, and the hanging pieces as clearly different (a red kurta, a red cap, an empty hanger).
```

### 18. cook-baking-eggs (Cook: baking and eggs)

#### cook-baking-eggs-1: the eggs station, the crack

- **shows:** The core of the eggs station at the moment of the crack: identical eggs, two vessels, and plain plates on a 2×2 tray with face badges, so Zafar can see that only the heard word decides the pot or the pan
- **attach (4):** style-anchor.png, props-sheet.webp, customers-sheet.webp, cook-nani-sheet.webp
- **save as:** mockup-cook-baking-eggs-1.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of a breakfast eggs station in a grandmother's modern kitchen. One moment only: an egg cracking into the frying pan.

Camera: exactly top-down, straight down at 90 degrees onto a warm white marble worktop that fills the frame edge to edge. No back wall, no splashback, no horizon. Rims read as circles, not ovals.

The scene: in the centre, a compact brushed-steel hob with two round burners. On the left burner, a steel pot of gently boiling water with one whole cream-white egg bobbing in the bubbles. On the right burner, a black frying pan. A cream-white egg is knocking on the pan's rim by itself: the shell has split in two, and the white and a bright round yolk are sliding out into the pan, a few small sizzle bubbles round the edge. Both burners have a soft glowing ring of flame.

No hands or arms anywhere: the egg moves by itself.

Bottom left of the worktop: a simple ceramic bowl holding four eggs, three cream-white and one brown.

On the right: a plain wooden tray holding four plain, empty white plates in a two-by-two grid, all alike. On the tray's rim beside each plate, a small round face badge: Nana, Ma, Ali and the grandmother, exactly as on the attached customers sheet and Nani sheet, with the same faces, hair, cap, glasses and clothes. Friendly, calm expressions.

Light: late-morning sun from the upper left, long soft window-shaped light patches across the marble, soft contact shadows down and to the right. Nothing floats.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes with clean surfaces, believable materials (brushed steel, glazed ceramic, eggshell), no outlines, no cel shading, no photorealism.

Absolutely no text, letters or numbers anywhere: not on the hob, the knobs, the bowl or the tray.

It must read at phone size: the egg in the pot, the crack and yolk in the pan, and the four face badges must all be clear at 740x320 pixels.
```

#### cook-baking-eggs-2: baking, the pour with no line

- **shows:** Baking's core at one moment, the pour: a clear cup with no marks, filling, the bowl still empty, Nani and Simba watching, so Zafar can see how "how much" works without a fill line
- **attach (3):** style-anchor.png, props-sheet.webp, cook-nani-sheet.webp
- **save as:** mockup-cook-baking-eggs-2.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of a baking station in a grandmother's modern kitchen with gentle Kutch accents. One moment only: flour pouring into a measuring cup.

Camera: eye level, straight on to the worktop, one-point perspective, the counter edge horizontal at about 60% of the frame height, verticals vertical. Items seen from the front, the camera at their mid-height looking slightly down so a rim is just visible.

The scene: a warm white marble worktop in front of a sage-green splashback. In the centre, large, stands a plain clear glass measuring cup with a handle, with absolutely no lines or marks on it. A clear glass jar of white flour hangs tilted by itself over the cup, pouring a soft stream of flour, and the cup is about half full. To the right, a big brushed-steel mixing bowl seen from the front, still empty. Along the bottom of the frame, standing on the worktop edge in a neat row with even spacing: a clear water bottle, a milk carton, a clear oil bottle, a small brass ghee tin, a clear sugar jar. All containers are plain, with no labels and no text.

No hands or arms anywhere: the flour jar hangs tilted by itself over the cup.

On the right, cut at the waist behind the counter, the grandmother exactly as on the attached Nani sheet, with the same face, hair, clothes, dupatta and jewellery, three-quarter on, watching the cup with a happy, attentive look. At the right edge, just below her, the head and ears of Simba peek over the counter edge from the window sill: a big adult cat with a sleek black coat and bright green eyes, ears up, watching the flour with great interest. Nothing at the far left of the frame: keep it plain worktop.

Light: late-afternoon golden light from the upper left, soft and warm; soft contact shadows under every item. Nothing floats.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, believable materials (glass, brushed steel, brass, matte flour), no outlines, no photorealism.

Absolutely no text, letters, numbers or measuring marks anywhere: not on the cup, the jars, the bottles or the carton.

It must read at phone size: the empty-versus-filled part of the clear cup, the pouring flour, the grandmother's face and Simba's face must all be clear at 740x320 pixels.
```

#### cook-baking-eggs-3: the oven, out at its word

- **shows:** The oven stage at L3 at one moment: the "now" naan sliding out light golden while the "a bit longer" naan stays in, so Zafar can see how the two time words decide which comes out
- **attach (4):** style-anchor.png, props-sheet.webp, cook-nani-sheet.webp, customers-sheet.webp
- **save as:** mockup-cook-baking-eggs-3.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of the oven step of a baking game in a grandmother's modern kitchen at golden evening. One moment only: one naan sliding out of the oven.

Camera: eye level, straight on, one-point perspective, verticals vertical, the same camera as a front-on kitchen counter.

The scene: a built-in oven fills the centre of the frame, set into sage-green cabinets, with a large glass door, warm light glowing inside. The door is open. On a steel baking tray sliding out by itself, a soft, puffy naan, pale light golden with big bubbles, a little puff of steam rising from it. Still inside, at the back of the oven, a second naan the same size, a little deeper golden, rising and bubbling. On the tray's front edge, in front of each naan, a small round face badge, exactly as on the attached customers sheet: Ali in front of the pale one, Nana in front of the deeper one, with the same faces, hair, cap, glasses and clothes. To the left of the oven, on the marble worktop, an empty wire cooling rack waits.

No hands or arms on the tray or the oven: the tray slides by itself.

On the right, cut at the waist, the grandmother exactly as on the attached Nani sheet, three-quarter on, smiling and watching the naan come out, leaning slightly back from the warm oven.

Light: golden evening, low warm sun from the upper left through a window out of frame, longer soft shadows to the lower right, a warm glow from inside the oven.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, believable materials (glass, brushed steel, bread crust), no outlines, no photorealism.

Absolutely no text, letters or numbers anywhere: no dials with numbers, no labels on the oven.

It must read at phone size: the two naans' different colours, the face badges and the grandmother's face must be clear at 740x320 pixels.
```

#### cook-baking-eggs-4: breakfast served, the meal named by the light

- **shows:** The serve at breakfast in morning light at one moment: Nana's boiled egg shelled and halved, Ali's fried egg in his maani
- **attach (3):** cook-service-bg.jpg, customers-sheet.webp, house-wide.png
- **save as:** mockup-cook-baking-eggs-4.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): one gameplay screen of breakfast being served at the kitchen island of a grandmother's modern home with gentle Kutch accents. One moment only: the first bite of breakfast.

Camera: eye level, the island's top edge nearly horizontal at about 65% of the frame height; people sit behind it, cut at the waist, their heads against a plain limewash wall.

The scene: bright early-morning sun streams in from a window on the upper left, long soft light patches on the wall. Behind the island, on the left, Nana, exactly as on the attached customers sheet, with the same face, beard, cap, glasses and clothes. On his plain white plate, a boiled egg stands in a plain white egg cup, its top sliced off to show a soft golden yolk, a small teaspoon beside it; he is delighted, eyebrows up. Beside him a glass of milky chai. On the right, Ali, exactly as on the attached customers sheet, with the same face, hair and clothes, grins as he folds a fried egg into a round flatbread on his white plate. The plates sit on the marble island top. In front, on the island, a small woven basket holds two more eggs, one of them brown. On the window sill in the background, Simba watches: a big adult cat with a sleek black coat and bright green eyes.

Light: early-morning sun, warm and bright, from the upper left; soft contact shadows. Nothing floats.

Style: match the references. A stylised 3D animated-feature look, soft warm sunlight, chunky simplified shapes, big expressive eyes, rosy cheeks, believable materials, no outlines, no photorealism. Modest clothing.

Absolutely no text, letters or numbers anywhere: not on the wall, the cups or the plates.

It must read at phone size: the halved egg and its yolk, both faces and their happy expressions must be clear at 740x320 pixels.
```

#### cook-baking-eggs-5: the joke (small, optional)

- **shows:** The sneeze, in its own moment, now that it comes with a right full cup of flour
- **attach (2):** kept:cook-baking-eggs-2, cook-nani-sheet.webp
- **save as:** mockup-cook-baking-eggs-5.png

```
Mock-up for a children's language game (ages 3-8, phones and tablets): the same baking screen as the attached first mock-up, same camera, same light, same grandmother and cat. One moment only: a full measuring cup of flour has just tipped into the steel mixing bowl.

The clear glass measuring cup, empty now, hangs tilted by itself over the bowl. A big soft puff of flour rises from the bowl. At the right edge, below the grandmother, Simba (the big black cat with bright green eyes) has flour on his nose, eyes squeezed shut, mid-sneeze, ears back. The grandmother, exactly as on the attached Nani sheet, laughs. Funny, not alarming.

No hands or arms anywhere. Absolutely no text, letters, numbers or measuring marks anywhere.

It must read at phone size: the puff, Simba's sneeze and the grandmother's laugh must be clear at 740x320 pixels.
```

## 4. Every prompt at a glance

| # | Prompt ID | Game | What it shows |
|---|---|---|---|
| 1 | clinic-every-part-1 | clinic-every-part | the body chart ("where does it hurt?") |
| 2 | clinic-every-part-2 | clinic-every-part | the cut game (the scrape) |
| 3 | clinic-every-part-3 | clinic-every-part | the nose (the tissue arrives) |
| 4 | clinic-every-part-4 | clinic-every-part | the drinks for a cough or a tummy ache |
| 5 | clinic-every-part-5 | clinic-every-part | the hand splinter |
| 6 | farm-animals-1 | farm-animals | Feeding time (stage 5, L2) |
| 7 | farm-animals-2 | farm-animals | The photo shoot (stage 7, L2) |
| 8 | farm-animals-3 | farm-animals | Home at dusk, calling (stage 9, the speaking moment) |
| 9 | farm-animals-4 | farm-animals | The photo shoot at L4 (look-alikes) |
| 10 | farm-eggs-orchard-1 | farm-eggs-orchard | collect the eggs (L2) |
| 11 | farm-eggs-orchard-2 | farm-eggs-orchard | the orchard and vegetable patch, picking (L3) |
| 12 | farm-eggs-orchard-3 | farm-eggs-orchard | plant and water, in the same patch (L1) |
| 13 | farm-eggs-orchard-4 | farm-eggs-orchard | the corn stall's grill |
| 14 | hide-and-seek-1 | hide-and-seek | the first find (L1, the bedroom by day) |
| 15 | hide-and-seek-2 | hide-and-seek | a funny empty spot (L2, both cats hiding) |
| 16 | hide-and-seek-2b | hide-and-seek | Nana at the door (a character study for 1b) |
| 17 | hide-and-seek-3 | hide-and-seek | the big cat in the small box (L4, 1b, look-alike pairs) |
| 18 | hide-and-seek-4 | hide-and-seek | bedtime with the torch (later visit) |
| 19 | pick-it-up-put-it-back-1 | pick-it-up-put-it-back | the guided room and the two copies (stage 1, L1) |
| 20 | pick-it-up-put-it-back-2 | pick-it-up-put-it-back | put it away, every spot ringed (stage 2, L2) |
| 21 | pick-it-up-put-it-back-3 | pick-it-up-put-it-back | Simba's paw (stage 3, 1b, L2) |
| 22 | pick-it-up-put-it-back-4 | pick-it-up-put-it-back | the spice box (the kitchen's board, 1b) |
| 23 | clean-up-day-1 | clean-up-day | the bathroom, level 1 (the tap just turned off) |
| 24 | clean-up-day-2 | clean-up-day | the bathroom at level 2 (the twins and the dusk beat) |
| 25 | clean-up-day-3 | clean-up-day | the play room, Ali's room (the toy car just switched off) |
| 26 | clean-up-day-4 | clean-up-day | Nani's bedroom at night (Tell Ali, the lamp and the ceiling light) |
| 27 | party-gifts-1 | party-gifts | the candles (part A) |
| 28 | party-gifts-2 | party-gifts | the cloth and the cake (part A, the core of the first sprint) |
| 29 | party-gifts-3 | party-gifts | the party presents (part B; also how every give-to looks) |
| 30 | party-gifts-4 | party-gifts | Snap the person named (part C, after Snap's rebuild) |
| 31 | party-gifts-5 | party-gifts | Who ate the cake? (visit 2, after Who did it?'s rebuild) |
| 32 | party-guests-1 | party-guests | pass the balloon, level 1 |
| 33 | party-guests-2 | party-guests | pass the balloon, level 2 (whose mum, whose masi) |
| 34 | party-guests-3 | party-guests | how are you?, the first visit |
| 35 | party-guests-4 | party-guests | how are you?, a year older |
| 36 | do-it-engine-1 | do-it-engine | musical statues, level 1 (the first stop) |
| 37 | do-it-engine-2 | do-it-engine | musical statues, level 3 ("touch your nose") |
| 38 | do-it-engine-3 | do-it-engine | the off-screen round ("now you!") |
| 39 | do-it-engine-4 | do-it-engine | getting ready, level 1 ("comb your hair") |
| 40 | do-it-engine-5 | do-it-engine | getting ready, level 3 (a funny miss: the sock puppet) |
| 41 | town-map-1 | town-map | the first round, a phone, level 1 |
| 42 | town-map-2 | town-map | the busy town at level 3, a big screen |
| 43 | town-map-3 | town-map | a funny miss, Zafar's Z Fold layout |
| 44 | town-map-4 | town-map | directions, the third visit (a later-visit mock-up, not run 1) |
| 45 | shops-1 | shops | serve at the fruit stall |
| 46 | shops-2 | shops | Nani's picky shopping (the X one) |
| 47 | shops-3 | shops | pay at level 4, a big screen |
| 48 | shops-4 | shops | Big Ma's cloth at the general store, for the short phone strip |
| 49 | adoption-centre-1 | adoption-centre | The wash, L1 (the dog's shake) |
| 50 | adoption-centre-2 | adoption-centre | Three animals at once, L2 (brush the bee) |
| 51 | adoption-centre-3 | adoption-centre | Ali's turn, L3 (the speaking moment, bedtime) |
| 52 | adoption-centre-4 | adoption-centre | Going home, L4 (the small rabbit) |
| 53 | safari-1 | safari | Snap from the jeep, level 1 (the first photo) |
| 54 | safari-2 | safari | Snap from the jeep, level 2 (three of a kind, the verb decides) |
| 55 | safari-3 | safari | Snap from the jeep, level 4 (baby or grown-up, the size decides) |
| 56 | safari-4 | safari | the giraffe's stare (the delight moment, on its own) |
| 57 | safari-5 | safari | Who's hiding?, level 3 (the stripy one) |
| 58 | beach-boat-1 | beach-boat | Shells |
| 59 | beach-boat-2 | beach-boat | The sandcastle |
| 60 | beach-boat-3 | beach-boat | The three stalls |
| 61 | beach-boat-4 | beach-boat | The picnic |
| 62 | beach-boat-5 | beach-boat | Litter fishing on the boat day |
| 63 | school-day-1 | school-day | Pack the school bag at Nani's door (L2) |
| 64 | school-day-2 | school-day | The blackboard, draw it (L1: the drawing comes alive) |
| 65 | school-day-3 | school-day | The blackboard, count them (L1: ring the three birds) |
| 66 | school-day-4 | school-day | The blackboard, rub it out (L2: the wrong one dodges) |
| 67 | wake-up-clock-1 | wake-up-clock | level 1, the first wake at dawn |
| 68 | wake-up-clock-2 | wake-up-clock | level 2, the times only heard |
| 69 | wake-up-clock-3 | wake-up-clock | level 3, morning or night (a wrong time, at night) |
| 70 | wake-up-clock-4 | wake-up-clock | the end, everyone up and chai served |
| 71 | sewing-1 | sewing | the cloth stall (buy cloth) |
| 72 | sewing-2 | sewing | make (tap the long line, then cut) |
| 73 | sewing-3 | sewing | mend (two faults; the said one decides) |
| 74 | sewing-4 | sewing | the fitting at phone size (the size gag) |
| 75 | cook-baking-eggs-1 | cook-baking-eggs | the eggs station, the crack |
| 76 | cook-baking-eggs-2 | cook-baking-eggs | baking, the pour with no line |
| 77 | cook-baking-eggs-3 | cook-baking-eggs | the oven, out at its word |
| 78 | cook-baking-eggs-4 | cook-baking-eggs | breakfast served, the meal named by the light |
| 79 | cook-baking-eggs-5 | cook-baking-eggs | the joke (small, optional) |

## Checks (made while building this sheet; not for Claude in Chrome)

- **Text, letters, numbers:** every one of the 79 code boxes forbids text. None asks for writing in the picture except the four wake-up-clock prompts, which ask only for the clock digits ("6:00", "7:00", "9:00"), as allowed. No code box was changed.
- **Real people named:** none. The real family (Nani, the doctor, the girl) come in only as attached reference pictures; "the Nani sheet" in the cook prompts is the reference's file name. Nana, Ma and Ali, named in the cook and party prompts, are generic placeholder characters (art bible), not real people. Simba is the cat.
- **Reference URLs:** all 24 unique URLs were checked with `git cat-file -e`. 23 are on `main` (and the branch). `sources/art/mockup-town-2026-10-31/map-8-places.webp` (all four town-map prompts) is on `claude/nice-lovelace-0vfjcj` only, not on `main`; its URL points at that branch, so it works while the branch exists.
- **Attach lines fixed (prompts untouched):**
  - farm-animals-2, -3, -4, farm-eggs-orchard-3, adoption-centre-2, -3, -4 and cook-baking-eggs-5 list "the approved image from prompt N" with no URL: their attach line now starts with kept:<that prompt>, attached from ChatGPT's library.
  - sewing-1 to -4 also list "the great-grandmother's character sheet, once signed off": it doesn't exist yet, so it is left off.
- **Reference lists moved out of the code boxes:** in the designs, each prompt's reference URLs sit at the bottom of its code box. Here they are on the attach line instead, so no URL gets pasted into ChatGPT; the prompt text above them is unchanged.
- **Worth a look (left as designed):** beach-boat-1, -2 and -5 attach the farm animals (and -1 and -5 the farm fields) as style references for beach scenes; cook-baking-eggs-5 is marked "small, optional" in its design and is run anyway, last of its game.
