# The farm's photo shoot: a rapid prototype (1 Nov 2026)

Built from Zafar's notes (`build/reports/designs/prototype-notes-2026-11-01.md`, "The photo shoot" and "Every game"), with the older design's words, levels and leak notes (`build/reports/designs/farm-animals.md`, stage 7) where his notes say nothing. Branch `proto-photo`. Not judged yet: the judge looks at the sprint's end.

**Play it:** `lab.html?mode=farm&game=photo&level=1` (levels 1 to 4), or labs.html, "farm", "The photo shoot (prototype)". `&fast=1` skips the waits, `&quiet=1` silences the voice.

## How it plays (every level)

1. **The whole farm** shows first (the full width, 1.5 s), then **the head turn**: the view comes in to eye height and pans left, back to the middle, right, back. Then **the camera comes up**. A tap anywhere skips the intro (never make a child wait).
2. **Hannah Mami asks** (not Nani): each photo's word card pops out big beside the side panel, is said, and turns into its card in her order card on the left (chai's s14 order card and word cards, the kit's own). Her box above holds her line (grey English, to record) and the arrow that opens her helper card.
3. **The viewfinder** (4:3, gold corners as in Zafar's mock-up) shows a quarter of the scene at L1, a fifth at L2 and L3, a sixth at L4; everything outside it is blurred. **Arrows** round it (left and right at L1; up and down too from L2) move the camera half a frame; **dragging** the scene moves it too.
4. **A tap on the viewfinder takes the photo**: the shutter's lids blink, a flash, a click. An asked thing centred in the frame **ticks its card at once** (any order), Sfx "right", and a print flies from the frame into the card.
5. **The scene is mostly still**, with small loops: hens and the duck peck, the goats, cow, sheep, buffalo and camel chew, the dog, donkey and horse sway.
6. **The end**: the play area becomes a wooden table with a toy instant camera; each photo slides out of the camera, its word is said once more, and it lands on the table (up to six; three in a row, two rows); then the engine's "Shabash." (Mum's own clip) is written in Hannah's box and said, and the shared end screen follows.

## The levels

| Level | Viewfinder | Arrows | Photos | Asks drawn from (each once) | What stands in the scene |
|---|---|---|---|---|---|
| L1 | 1/4 of the width | left, right | 3 | goat (*bakri*), hen (*murgi*), cow (grey "the cow") | those three and a dog; 4 slots on the near line |
| L2 | 1/5 | all four | 4 | + two hens (*ba murgi*), two goats (*ba bakri*); at least one count | a goat and two goats, a hen and two hens, cow, dog, duck; half the slots further back (smaller, higher: up and down needed) |
| L3 | 1/5 | all four | 5 | big goat (*wadhi bakri*), small goat (*nindhi bakri*), two and three hens (*trae murgi*), hen, cow, dog (*kutro*); at least one size | 9 things (sheep, duck as decoys), further slots smaller still, a bush and a wall in front of some |
| L4 | 1/6 | all four | 6 | + the chick with its mother (grey), the chick (grey); the mother and chick always asked | 14 things (donkey, horse, buffalo too), a camel by the fence, a bird in a tree, a tiny chick |

Every round deals the things into the level's slots at random and draws the asks at random (`data/farm/photo.json`, `drawAsks`, `dealItems`).

## Words and voices

- **Every word is the language engine's** (the meanings in `data/farm/photo.json`, the engine over `data/lang/`): *bakri*, *murgi*, *ba bakri*, *ba murgi*, *trae murgi*, *wadhi bakri*, *nindhi bakri*, *kutro*. Played from the engine's clip plan: family clips where they exist (*nindhi*, *shabash*: Mum's), the device voice for the rest while testing (no family clip of *bakri*, *murgi*, *ba*, *trae*, *wadhi*, *kutro* on its own).
- **Grey English, to record:** cow, the chick, the chick with its mother (no lexicon entry: `farm.md` has *gai* from Zafar, not in `data/lang/lexicon.json`; I didn't add it, Mum confirms), and all of Hannah's lines ("Let's take photos of the animals!", "Take a photo of the goat."): the engine has no frame for "take a photo of", so the line is its English placeholder and only the asked word is said, in Kutchi.
- **Gaps for Mum:** the frame "take a photo of {x}" (and "let's take photos"), *gai* alone, chick alone, "the chick with its mother", and the words alone above.

## Help and onboarding (chai's ladder, the kit's)

- **First time only** (once per child; every visit for a New player, `Onboard.stuck`): when play starts, the light on the arrow towards the first thing; the first time an asked thing is centred, the light on the viewfinder.
- **Stuck** for the level's wait (`data/rules.json` hintS through `Rules.hintMs`: 7, 9, 11, 13 s): her helper card opens (the asked word, everything shown), the word is said, and the arrow towards the thing glows (or the viewfinder, if it is already centred). A hint, once per card.
- **A photo with no asked thing centred** is just a photo: no verdict, no wrong sound; the ask is said again; it is the open card's first mark (wrong), so the round doesn't count towards moving up. The shared redo rule (`OrderCard.redo`): from the second miss the arrow towards it glows; at the third the camera glides to it and the viewfinder glows.

## The leak test

`node build/tools/review/leak-games/farm-photo.mjs` deals real rounds with the game's own pure parts (`drawAsks`, `placeThings`, `centred`, `clampCam`) and plays them blind. A round "wins" when it would count towards moving up (every card right first time). 2000 rounds each:

| Level | fair (aims at each ask) | animals (a random thing each time: eliminating) | sweep (random places: fishing) |
|---|---|---|---|
| L1 | 100% | 9.7% (supported: the cards' pictures; allowance 25%) | 0.6% |
| L2 | 100% | 1.2% | 0.2% |
| L3 | 100% | 0.1% | 0.0% |
| L4 | 100% | 0.1% | 0.0% |

Reading: the cards write the Kutchi at every level (rules `cardKutchi`), the English at L1 only, the picture at L1-L2 (blurred with the eye from L3). Matching by picture is study while supported. Patterns: slots and asks shuffle every round. Waiting: the hint is a counted hint. Fishing: a wrong photo marks the open card, so it never climbs.

## The screenshots

`node build/tools/review/shoot_photo.mjs` (all four levels at 740x320, 930x430, 1280x665 and 1920x1080; the game's own test hook aims and shoots as a child would) writes `build/screenshots/proto-photo/L<level>-<size>-<state>.png` and `report.md` there (not in git: `.gitignore`). The states: `0-whole`, `1-head-turn`, `2-ask` (a word card popping), `2-camera` (the camera up, the first-time light), `3-aimed`, `4-shot`, `5-table`, `6-results`. Last run: all 128 shots (4 levels x 4 sizes x 8 states), **nothing spills, no page errors, every round reaches the end screen**. Contact sheets were checked by eye at every size; what they showed is in "Seen in the shots" below.

## Seen in the shots

- 740x320: the side panel shows two cards and a peek of the third (chai's row); the pop-out card is small (about 190 px) and sits over the viewfinder's left edge while it is said; the arrows fit round the frame (48 px).
- 1920x1080: everything works but the prints on the table are small for the space (three in a row); the arrows are the same 48 px.
- The whole-farm view is letterboxed: pale sky above, the dirt path's brown below.
- The layer seams show as vertical steps in the grass and hills (the ride's tiles don't loop at this scale).
- The first-time lights (the arrow, then the viewfinder) dim the whole screen, the side panel too (the kit's spotlight).

## What is placeholder

- **All the art.** The scene is the ride's cut farm (`assets/day/ride/s09r/`: far hills, middle fields, near verge, tree, bush, haystack, wall, goat, hen, dog, bird; `assets/day/s09b/`: sky, cow, sheep, donkey, horse, buffalo, duck, camel), tiled across a 3200x1000 panorama. Two new pictures, `assets/farm/proto/` (`build/tools/art/proto_photo_art.py`): Hannah Mami's face, cropped from Zafar's own photo-shoot mock-up, and one chick, cut from the hen-with-chicks sheet. Seams show where the layers tile.
- **The loops** move the whole sprite (no separate tails or heads to move). The hen's peck, the cow's chew and the swish are stand-ins for 2-3 frame loops.
- **The table and the toy camera** are shapes. The prints are live copies of the scene cut to what the frame showed.
- **The farm mode** (`js/farm/main.js`) is the minimum for the photo shoot alone.
- No cog menu (Cook's own, not the kit's). The judge hasn't looked.

## Decisions I made (for Zafar to overrule)

1. **Any order**: an asked thing centred ticks its card whenever it is photographed; the first open card is the one the help and a wrong photo point at. Chai's cards are any order too.
2. **Centred** means at least 60% of the thing inside the frame and its middle inside the frame's middle 64% across and 72% down. Lenient for small hands.
3. **The asks by level**: his examples in order ("the goat", "two hens", "the big goat", "the chick with its mother"), each level adding one new idea and keeping the old ones; at L1 each of goat, hen and cow once; photos 3, 4, 5, 6 (the table's six).
4. **Look-alikes are the challenge**: a single goat and two goats, a hen and two and three hens, a big and a small goat, a hen alone and with her chick; things further back are smaller (slot scale 0.62 to 0.78).
5. **Arrows move half a frame**; the camera's centre may reach the scene's edge across (the layers run on), so a thing near an edge can still be centred.
6. **Hannah is both guide and asker**: her face once, in her box; her order card has no face and no headline (R4).
7. **The level numbers live in the game's data** (`data/farm/photo.json`), not `data/rules.json`'s count table, so this branch doesn't touch a shared file; they move there at the roll-out.
8. **The branch** is `proto-photo`, made at my HEAD (`a8e4813`) and fast-forwarded to `claude/nice-lovelace-0vfjcj` (`a53e3e3`, a plain fast-forward: HEAD is its ancestor), because Zafar's notes and mock-ups are only there.

## Shared files touched (for the merge with the farm branch)

- **`js/farm/main.js`: new here, and the farm builder makes its own.** Keep theirs and add the photo shoot's four lines: `import { photo, PHOTO_DATA } from "./photo.js";`, `PHOTO_DATA` in `data`, `photo` in `games`, and its `lab()` entry (`{ game: "photo", label: "The photo shoot (prototype)", note: "Hannah Mami asks for photos: look round the farm, then tap the viewfinder.", levels: [1, 2, 3, 4] }`). Their `plan()` must send `game: "photo"` through.
- **`build/tools/review/leak-configs/farm.json`**: new here (the unit test wants a config whose id is each mode's: "farm"); it runs the photo shoot's bot. The farm builder writes their own `farm.json`: keep theirs, and keep `farm-photo.json` (id `farm-photo`), which runs this bot.
- **`labs.html`**: regenerated by `node build/gen_labs.mjs` (no change to `gen_labs.mjs`; the group heading reads "farm"). Regenerate after the merge.
- Nothing else shared: no `js/shared/`, `css/shared/`, `data/rules.json`, `lab.html` or `js/cook/` change. The import map in `lab.html` doesn't list `js/farm/*` until `build/bump_version.py` runs at the publish (unstamped until then, which the lab doesn't mind).
- New and the photo shoot's own: `build/tools/review/leak-games/farm-photo.mjs`, `build/tools/review/leak-configs/farm-photo.json`, `js/farm/photo.js`, `css/farm-photo.css`, `data/farm/photo.json`, `assets/farm/proto/` (2 webp, 13 KB), `build/tools/art/proto_photo_art.py`, `build/tools/review/shoot_photo.mjs`, this report.
