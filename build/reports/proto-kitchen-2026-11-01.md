# proto-kitchen (1 Nov 2026): three Cook prototypes, eggs, baking and the corn stall

Rapid prototypes for Zafar to play on a laptop (1280x665; phone sizes skipped at his word, 1 Nov). They're built on Cook's kit, as chai is. The spec is his notes (`build/reports/designs/prototype-notes-2026-11-01.md`: "Every game", "Eggs at breakfast", "Baking", "The corn stall"). Words and levels come from `cook-baking-eggs.md` (its end note, his baking design, wins) and `zafar-answers-2026-11-01.md`. They're lab-only (`data/cook.json` `lab.notInLaunch`) and not judged yet.

**Branch:** `proto-kitchen`, from `s15-chai-11`, with the integration branch `claude/nice-lovelace-0vfjcj` merged in (no code, only his notes and the mock-ups in `sources/art/mockups-2026-11-01/`). Not pushed.

## What every game shares (chai's rules)

- **The shared order card.** Each game's order is a recipe in `data/cook.json` (`eggs`, `baking`, `corn`), built by the language engine and opened by the lab's card, with its pop-up, read-along and rows.
- **Ticks.** A row ticks the moment its number or amount is reached, and an extra tap doesn't land.
- **Word cards.** Every tappable thing has its `🔊 word` chip (`Cook.Kit.chip`, the word written while the child is learning it).
- **The helper card and hint timings.** Every station begins with `St.begin`, says its next thing with `z.expect({key})` and lights it with `S.glow`. So the helper card follows the next item, and a light waits for the help ladder's pause by level.
- **The next thing** is the next one in the card's order.
- **First-time lights** come at once, only for a new player or on the first round ever (`Cook.save.coached[<station>]`). After that, only the stuck hints.
- **Voices.** Family clips where the engine has them, otherwise the device voice. A missing word is grey English, tagged to record. No Kutchi was invented.
- **Colours** are data (`station.palette` in each station's JSON), as the static check asks.

## 1. Eggs at breakfast

**Lab:** `lab.html?mode=cook&game=eggs&level=1` (2, 3, 4)

One camera, top-down at the hob:
- The bowl of eggs sits bottom left.
- The pot (to boil) and the pan (to fry) sit on the shared two-burner hob, with room for six eggs each.
- The dark walnut tray (chai's) holds one plate per person, with their face on the rim.

How it plays:
1. Tap the bowl and an egg lifts out. Tap the pot and it goes in whole and bobs. Tap the pan and it lands as a fried egg with a sizzle. The burner lights.
2. Each egg has its own ring. In the green it glows: tap it and it lifts, then tap a plate. A boiled egg lands in an egg cup (Zafar, 1 Nov).
3. From L3, the salt and pepper shakers: tap one, then a plate, and it sprinkles.
4. When every plate is done, the tray glows. Tap it to go to the table.

At the table:
- A big window shows the time of day: morning, midday, or night with a moon and stars. The cat sits on the sill.
- Each plate slides in to its person.
- **Right:** they swap to their happy pose and bounce, with steam.
- **Not what they asked for:** a gentle frown.
- If all are right, Nani says "Shabash".

| Level | The order | The scene |
|---|---|---|
| L1 | one person, one egg, boiled or fried | breakfast sky |
| L2 | two people, 1-2 eggs each | breakfast sky |
| L3 | three people, one egg each, salt and/or pepper | lunch sky; the shakers are out |
| L4 | three people, 1-2 eggs each, salt / pepper / "no salt" | dinner sky, the tablecloth |

The person's row reads, for example, "hakro tarelo indo" or "ba boiled eggs" (boiled egg in grey, to record).

**Screenshots (1280x665),** in `build/screenshots/proto-kitchen/` (worktree):
- `eggs-L3-hob-salt-pepper-1280x665.png`
- `eggs-L4-hob-1280x665.png`
- `eggs-L4-table-night-1280x665.png`

**Placeholders:**
- Crops of his eggs mock-up: the pan (its egg painted out) and the bowl of eggs.
- The pot is chai's s14 pan of water.
- The cat is cut from the served mock-up.
- Plates, eggs, egg cups and shakers are simple shapes.
- The people at the table are the counter characters, standing behind a drawn table.

**Decisions I made (his to reverse):**
1. One setting. The window's sky follows the level, so all three are seen: L1-L2 breakfast, L3 lunch, L4 dinner with a cloth. His notes allow one setting with the sky changing.
2. The boil-or-fry and the owner are judged at the table, with a frown and a logged miss. There's no redo loop yet.
3. Eggs never burn; the ring just stays green.
4. Each person keeps their own card (with their face) at every level. The design's L3 "Nani relays every order on one card with no faces" and its L4 soft or hard aren't built.

## 2. Baking (his turn-by-turn design)

**Lab:** `lab.html?mode=cook&game=baking&level=1` (2, 3, 4)

One camera, side-on at the counter:
- The mixing bowl stands in the middle.
- The containers stand in a row in front, each with its word card: glass jars with no marks for flour, sugar and salt, plus the water bottle, the milk carton and the yoghurt and ghee tubs.
- The cat peeks over the counter's edge.

How it plays:
1. Nana asks for naan.
2. Nani gives **one instruction at a time**. Its row appears on the card as she says it (`UI.mission.reveal`, with `when: bake-1..5`).
3. Tap what she names and it lifts over the bowl. **Each tap tips it a bit more** and some goes in:
   - **"a little":** one tap, it stops, "that's good".
   - **"a lot":** tap until it's a lot (4 taps), then "Bas!". More taps don't land.
   - **"a little more":** two turns. A little, tap, "still a little more", tap, "Bas!".
   - **The jug (L3 up):** the measuring jug has lines and no numbers (a quarter, half, full, one and a half, two and a half). Each tap adds a quarter cup up to the amount, then "Bas!", and the jug tips into the bowl by itself.
4. Tap the bowl and it becomes the dough.
5. Then the oven, on the same camera. Its door shut and open are two pictures, and the naan is its own picture:
   - Tap the oven and it opens; tap the naan and it goes in, and the door shuts.
   - Its ring fills, with steam.
   - Nani says "Tayar ai." Tap the oven and the naan comes out with steam and "Dhyan rakh!".
   - Nana's happy face.

| Level | The plan (one picked at random, `data/stations/baking.json`) | Decoys |
|---|---|---|
| L1 | flour a lot, then water or milk a little | 1 |
| L2 | three steps: a lot, a little, and a little more | 2 |
| L3 | the jug: one cup of flour ("hakro cup atto"), half of water or milk ("adh paani"); a little salt or sugar | 3 |
| L4 | the jug: 2½ or 1½ cups of flour, 1½ cups of water or a quarter cup of milk or yoghurt; a little salt; sometimes a little more sugar | 3 |

**Screenshots (1280x665):**
- `baking-L3-jug-1280x665.png`
- `baking-L3-oven-open-1280x665.png`
- `baking-L3-oven-baking-1280x665.png`
- `baking-L3-naan-out-1280x665.png`

**Placeholders:**
- The Cook shelf's front-on containers (`assets/cook/items/shelf-*`).
- From the pour mock-up: the steel bowl and the peeking cat.
- The naan comes from the oven mock-up, with its face badge removed by mirroring its left half.
- The dough ball is a Cook prop.
- The oven, the jug and the tiled wall are simple shapes.

**Decisions (his to reverse):**
1. Nani's instruction is two engine-built pieces side by side: "Atto wiji chad! *A lot.*" The engine has no "a little / a lot of X" frame yet, so that's a gap. The card's row shows the thing; from L3 it shows the jug amount too ("hakro cup atto", "adh paani").
2. The design's quick knead is one tap on the bowl.
3. The child decides **which** container (the Kutchi word). How much is decided by Nani's turns, as his design has it, so the amount words are heard rather than tested.
4. The oven bakes one naan, with no "now" versus "a bit longer" choice yet.

## 3. The corn stall (a sekelo redress)

**Lab:** `lab.html?mode=cook&game=corn&level=1` (2, 3, 4)

One screen, top-down at the stall's table:
- The box of raw cobs (left) and the cooked plate (right) sit either side of the grill.
- A tray below holds the dressings, each with its word card: limu, loon, laal marcha, fudino ji chutney, amli ji chutney and mari.

How it plays:
1. Tap the box and a cob goes on the grill (as many as asked; an extra doesn't land).
2. Its ring fills, it turns half-grilled, and Nani says "Firai!". Tap it to turn it, once.
3. The second side fills and it's grilled: "Makai hane kadh." Tap it onto the plate. The order's head ticks when the number is there.
4. Tap what they asked for and it goes on, **named as it goes on**; its row ticks.
5. Tap the plate and their face appears: happy, or a gentle frown if a "no" or an unasked one went on.

| Level | The order |
|---|---|
| L1 | one cob ("Muke hakri makai khape"), one thing on it |
| L2 | one cob, two things |
| L3 | two cobs ("ba makai"), two things |
| L4 | two cobs, two or three things, sometimes a "no" row |

**Screenshots (1280x665):**
- `corn-L4-grill-1280x665.png`
- `corn-L4-served-1280x665.png`

**Placeholders:**
- From the corn-stall mock-up: the box of cobs, the six dressing bowls and lemons, and the cob in three looks (raw, half, done).
- The grill and plate are sekelo's.

**Decisions (his to reverse):**
1. Nani's guide box stands in for Hannah Mami, as his answers allow ("Nani or another placeholder").
2. The person at the stall is Nana: the lab's card is always Nana's.
3. Cobs never char.
4. Each dressing goes on once.

## Words

**New placeholders** in `data/lang/seed/cook.json`. All are grey English, to record with Mum, and none is invented:
- words: boiled egg, naan, a quarter cup, one and a half cups, two and a half cups (Zafar says 1.5 and 2.5 have their own names)
- lines: "A lot.", "That's good.", "Still a little more."

**Draft words now heard** (Mum's list already flags them): tarelo (fried), loon (salt), mari (pepper), thorok (a little), wadhare (more), atto (flour), paani (water).

## Shared files touched (minimal, listed)

**Shared code and data:**
- `js/cook/index.js`: the three stations in `PARTS`, `LABS` and `COMBINED` (their data loads with the page, their code when opened).
- `js/cook/main.js`: three rows in `STATIONS`, the labs list.
- `data/cook.json`: three recipes (`proto: true`, `free: false`), and `lab.stations` plus `lab.notInLaunch` with eggs, baking and corn.
- `data/lang/seed/cook.json`, then `node build/lang/import_all.mjs`: `data/lang/lexicon.json` and its reports.
- `build/core/cook-orders-kutchi.test.mjs` (LNG-17): leaves out recipes marked `proto: true`, whose to-record words are grey English by design.

**Regenerated, and new files:**
- `labs.html` (`node build/gen_labs.mjs`): the three are under "Cook stations".
- New code and data: `js/cook/stations/{eggs,baking,corn}.js`, `data/stations/{eggs,baking,corn}.json`.
- New art: `assets/cook/proto/*.webp` (22 files, about 250 KB), cut by `build/tools/art/cut_proto_kitchen.py`.

Chai's code and data are untouched.

## Checks

`node build/tools/review/checks.mjs --only unit,docs,load`: unit 623 pass, 0 fail; docs ok; load 29/29.
- The load check's page list doesn't include the new stations.
- `build/lint/static.mjs`: 0 new findings.
- The art check passes on the new crops.

Each station was played start to finish by a script that follows the game's own expectation (L1, L3 and L4 for eggs; L1 and L3 for baking; L3 and L4 for corn), at 1280x665 only. The judge hasn't looked.

## Known rough edges

**Eggs:**
- On the hob, the pot picture's handle overlaps the pan's rim.
- At the table, the characters stand behind it (no seated poses).

**Baking:**
- The bowl crop has two small red corners (Nani's dress in the mock-up).
- The oven floats on the wall.

**Corn:** with two cobs, the second can sit off the plate's edge.

**All three:** the helper card's picture is blank for the new words (they have no art yet).
