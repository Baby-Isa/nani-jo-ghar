# Farm prototypes (1 Nov 2026)

Four farm games, built as rapid prototypes from Zafar's notes of 1 Nov (`build/reports/designs/prototype-notes-2026-11-01.md`: "The farm" and "Every game"), on chai's patterns and the shared kit. Hannah Mami hosts. They are for playing in the labs and giving feedback; nothing here is final art or final Kutchi.

**Branch:** `proto-farm`, on `claude/nice-lovelace-0vfjcj`. Not pushed.

## The lab links

On labs.html, under **"Farm prototypes (Hannah Mami, 1 Nov)"**, each with a level picker:

| Game | Link |
|---|---|
| Feeding time | `lab.html?mode=farm&game=feed&level=1` |
| The eggs | `lab.html?mode=farm&game=eggs&level=1` |
| Home at dusk | `lab.html?mode=farm&game=home-dusk&level=1` |
| Plant, water, grow, pick | `lab.html?mode=farm&game=grow-pick&level=1` |

Change `level=` to 2, 3 or 4. Add these as needed:
- `&onboard=0`: no first-time help.
- `&quiet=1`: no voice.
- `&seed=7`: the same round every time.

## What every game shares (chai's patterns)

`js/farm/kit.js` is the one screen for all four, so they behave alike.

**The side panel** is the kit's own, on chai's s14 look:
- Hannah Mami's box (`NaniGuide`). Her face replays her. The arrow opens her helper card.
- Her order card (`OrderCard`, s14). One sideways row of item cards, one card per ask.
- It uses chai's ids (`#side`, `#guide`, `#mission`), so the kit's s14 styles apply unchanged. Nothing in it is restyled.

**The ask:**
- She says each ask. The line comes from the language engine.
- The ask's big card pops up at the top left of the play area (`WordCard.big14`). It then turns into its row (`WordCard.morph`), as in chai.
- The game's taps work from the first frame. A tap during the ask lands every card at once and is never lost.

**Counts:** a row ticks the moment its number is reached. The next tap doesn't land: the thing bounces back or wobbles. The tick is gold if the row was right first time, and plain after a miss.

**A wrong move:**
- The thing shakes. This is the funny reaction; there is no frown.
- Her ask is said again.
- The row will tick plain.

**Onboarding** happens the first time a player meets each action, then not again for that profile (the labs' New player sees it on every visit):
- The kit's light (`Onboard`, s14 look: lit and glowing, no finger) shows the thing to tap.
- Each game lights its two first moves: basket then tray; hen then egg; animal then home; sapling then plot, then the can, then a plant.

**Stuck hints** count from the last action:
1. After the level's wait, her helper card opens in her box with the row's full answer, and she says the ask again. The wait is 7, 9, 11 or 13 s, from `data/rules.json` through `Rules.hintMs`.
2. After twice the wait, the right thing is lit.

Each counts as a hint on the end screen.

**The end:**
- She says "Shabash!" (the family's recording).
- The game's finale plays: everyone eats, the hens cluck, night falls, the plants bounce.
- Then the host's one end screen appears.

**Voices:** every line is the language engine's (`js/core/lang/engine`). The voice plays family clips where they exist. Elsewhere the device voice speaks while testing.

**Missing Kutchi:**
- What the engine can't say shows as grey-italic English. It is tagged "to record" in the markup only.
- The farm's missing words and lines are English placeholders in `data/farm.json`, imported into the lexicon as to-record entries. They also go onto Mum's recording sheet: `docs/language/recording-sheet.md` was regenerated.
- No Kutchi is written in the farm's code.

**Layout by height:**
- Every scene thing is placed in shares of the play area: x of its width, foot and height of its height. One layout serves 740x320 up to 1920x1080.
- The side panel uses the kit's two layouts by height.
- Tap areas never fall under the kit's tap size, so small eggs and chicks are still easy to hit.

## Per game

### Feeding time (`feed`)

Up to four animals stand in an arc of 140°, each with a tray in front, and the food baskets sit in the middle gap.

She says, for example, "Hane murgi! Inke ba makai khape." (Now the hen! She wants two corn.)

To play:
1. Tap a basket: it lifts and glows, and stays chosen.
2. Tap a tray: one piece flies in per tap.

**What happens:**
- **Right number:** the row ticks when the number is reached, and an extra piece bounces off.
- **Wrong food:** the animal shakes its head and her ask comes again.
- **Tapping an animal:** you hear its ask again, for free.
- **Once fed:** an animal eats in a two-picture loop.
- **At the end:** they all hop.

**Levels:**

| Level | Animals | Baskets | Pieces |
|---|---|---|---|
| L1 | one, near and in the middle | corn and grass | 1 or 2 |
| L2 | two | corn and grass | 1 to 3 |
| L3 | three | water joins (a bucket) | 1 to 3; water is always one |
| L4 | four (hen, goat, cow, sheep) | three | 1 to 4 |

Which animal wants which food changes every round, so no basket gives the answer away.

### The eggs (`eggs`)

Hens sit on their nests along a perch in the hen house. Tap a hen and she flaps up (one pose swap). Her eggs are under her, in the hay. Tap her again, or another hen, and she sits back down. Peeking is free.

**Tapping an egg:**
- If it's one she asked for, the egg goes straight into the basket on the floor. Nothing is handed over.
- Once the count is reached, the next egg wobbles and stays ("careful").
- An egg from a hen she didn't ask about wobbles, the hen clucks, and her ask comes again.

One hen each round hides a chick, which tumbles out the first time she's lifted.

**The line:** for example, "Wadhi murgi ja ba inda khanech!" (Bring the big hen's two eggs!). All the eggs is "Wadhi murgi ja inda khanech!".

**Levels:**

| Level | Hens | Asks | How the hen is picked |
|---|---|---|---|
| L1 | two (big, small) | one: all of one hen's eggs (1-3) | big or small |
| L2 | three | one: so many from the big or small hen (she has more than asked) | big or small |
| L3 | three, red and white | two: all of one hen's, and so many from another | the colour, or size and colour where the colour alone fits two hens |
| L4 | four (big and small, red and white) | two: half of one hen's eggs (2 or 4), and so many from another | size and colour |

*White* and *half* are still to record, so they show as grey English.

### Home at dusk (`home-dusk`)

Three homes stand along the top half against the evening sky: the coop on stilts, the goat shed and the cow shed. Each has a small round picture of its animal on the gable. The farmyard is the bottom half.

She says, for example, "Ba murgi ghar je me rakh!" (Put two hens in the house!). *ghar* is used for all three homes: the engine has *house* (*ghar*) but no coop or shed.

To play:
1. Tap an animal: it glows.
2. Tap its home: it walks in and the window lights.

**What happens:**
- **Right number:** the row ticks when the number is in.
- **An animal she didn't ask for:** it shakes its head and her ask comes again (a miss).
- **The wrong home:** the animal bumps the door and stays out. This is a funny moment, not a miss, because the home isn't a heard word yet.
- **Hiding places:** the hay, the wheelbarrow and the bucket can be tapped. Someone may be under them, or no one ("Nobody here!", to record).
- **At the end:** the sky goes dark, every window glows, and she says "Goodnight!" (to record).

**Levels:**

| Level | Animals | Asks |
|---|---|---|
| L1 | a cow and a goat in the open; a hen chilling in the bucket | one: the cow or the goat |
| L2 | a hen in the open and one under the hay, the goat, the cow | two: two hens, and the goat or the cow |
| L3 | a hen under the wheelbarrow and one perched on the cow shed's gate; a chick under the hay and one in the open; the goat behind the tree | three: two hens, two chicks, the goat |
| L4 | a big goat in the open; a small goat behind the tree; hens in the bucket, under the wheelbarrow and on the gate; a chick under the hay | three: the small goat, three hens, the cow |

*Cow* and *chick* are still to record (grey English).

### Plant, water, grow, then pick (`grow-pick`)

There is one row of four plots, with saplings in pots below, the watering can and the basket. It plays in three phases.

**1. Plant.** She says "Plant the limu." The frame is still to record; the fruit word is Mum's.
- Tap a sapling: it lifts.
- Tap an empty plot: the sapling is planted.
- A sapling she didn't name shakes and her ask comes again.

**2. Water.** She says "Now water it." (to record).
- Tap the can, then each new plant.
- The water falls and the soil darkens.
- A short time-lapse grows the plant: sapling, then bush, then fruit. She says "Look, it's growing!" the first time.

**3. Pick.** Her new asks pop in as cards: "Ba limu khan!" (Take two lemons!).
- Tap a fruit and it flies into the basket.
- The row ticks at the number, and the next fruit wobbles on the branch.
- A fruit she didn't ask for wobbles and her ask comes again.

**Levels:**

| Level | Saplings on offer | Planted | Picks |
|---|---|---|---|
| L1 | two | one | one fruit |
| L2 | three | two | two or three of one fruit |
| L3 | four | three | two, with colours (red or green tomatoes and chillies) |
| L4 | four | all four | two, with sizes (big or small mangoes) and colours |

The four fruits (*limu*, *tameto*, *mirchi*, *ambo*) are all Mum's confirmed words. This is the best-voiced of the four games.

## Screenshots

The screenshots were made by script with `onboard=0 quiet=1`, playing each game to the host's end screen. They are local and not committed: images under `build/` are git-ignored (decision 20).

- **Final set:** every game at L1-L4, at 1280x665 (Zafar plays on a laptop for now). All 16 rounds reach the end screen with every row ticked and no console errors.
- **Earlier pass, before the last small fixes:** all four games at L1 and L3 at all four sizes (740x320, 930x430, 1280x665, 1920x1080), with the same results.

**The final set:**
`/home/user/nani-jo-ghar/.claude/worktrees/agent-aa91e8ae7eac13845/build/screenshots/proto-farm-2026-11-01/`

The files are named `<game>-L<level>-<w>x<h>-<moment>.png`. The moments are:
- `1-ask`: her ask, the card popping up
- `2-play`: mid-play
- `2b-pick`: grow-pick only, the pick phase
- `3-end`: the end screen

**The kit moments:**
- `feed-onboard-740x320.png`: the first-time light on the right basket
- `feed-helper-1280x665.png`: her helper card opened by the stuck hint
- `feed-spot-740x320.png`: the light, after twice the wait

## What's placeholder

**Hannah Mami's face.** It is cropped from Zafar's home-at-dusk mock-up (`assets/farm/proto/hannah-face.webp`) because her look isn't decided yet. Swap it in `js/farm/art.js` `HANNAH`.

**Animals.** They come from the existing cuts and share one pose set: stand, eat, up, sit, happy.
- Hen, goat and chick: `assets/characters/`.
- Cow and sheep: the ride's s09b cuts. They have one picture each, so their pose swaps fall back to it and a bounce shows the change.
- The white hen is the hen picture whitened with a CSS filter.

**Food and fruit.**
- Corn: Cook's corn icon.
- Lemon and tomato: Cook's vegetables. The green tomato is the red one recoloured.
- Chilli: the clinic's rough chilli. The red one is recoloured.
- Mango: cut from the pick mock-up (`assets/farm/proto/mango.webp`, a little rough).
- Grass tuft: cut from the ride's verge (`assets/farm/proto/grass.webp`).

**Scenery.** The ride's sky, hills, fields, tree, bush and haystack, and the kit's wicker basket. The dusk is the sunny sky with a filter.

**Flat shapes in the kit's colour tokens** (the static lint allows no gradients):
- trays, the bucket and water, eggs
- the perch and the hen house wall
- the three homes (walls, roof, door, window), the wheelbarrow
- plots, pots, the watering can, water drops

**Words still to record**, in `data/farm.json`:
- cow (Zafar's *gai*, to confirm with Mum), grass, chick, sheep, white
- the lines: "The animals are hungry", "Bring half of …", "Plant the …", "Now water it", "Goodnight!", "Nobody here!", and the guide and headline lines

They come up as grey English, and the device voice speaks them in testing.

**Sounds.** Only the kit's synthesised effects (right, gold, oops). There are no animal sounds.

## What I decided, and why

1. **One order card, Hannah Mami's, with one item card per ask**, the same in all four games.
   - Chai's per-person cards would have put the animal's or the hen's face on the card at every level. That gives the answer away from L3, where the rules blur the card's picture (`data/rules.json` `cardPicture`).
   - Each card's picture is the who-and-what: the animal and its food, the hen and an egg, the animal, the fruit.

2. **A basket stays chosen in feeding time.** Tap the basket once, then tap the tray the number of times asked. I read "tap a basket, then the animal's tray, the number of times asked" this way because it's easier for a small child than going basket-tray-basket-tray. Easy to flip if he meant one piece per basket tap.

3. **Each feeding line is two sentences:** "Hane murgi! Inke ba makai khape."
   - The engine's `Need` takes a person, not an animal. "Murgi ba makai khape" (its `PredDat` frame with an animal) lacks the *ke*, so I didn't use it.
   - "Now the hen! She wants two corn." is natural, made only of confirmed frames, and names the animal.

4. **"Pick" is said with *khan* (take): "Ba limu khan!"** There is no confirmed word for pick. *Take* is real Kutchi from the engine, so Zafar hears Kutchi rather than grey English. A question for Mum: is *khan* right for picking from a plant, or is there a better word?

5. **"Put … in the house" (*ghar je me rakh*) at dusk.** The engine has the `PutAt` frame and *ghar*, but no coop or shed, and no "goes in". The ask still turns on the heard words: which animal, how many, and from L4 which size. The wrong home is a funny moment, not a miss.

6. **Hens are red and white, not brown.**
   - The hen art is red-brown, and *laal* is confirmed, so *red* is the hen as drawn.
   - *White* is to record.
   - There is no *brown* in the lexicon, so his "three eggs from the brown hen" became "… the red hen".
   - Half is L4 only, from a hen with 2 or 4 eggs.

7. **Grow-pick asks in two rounds.** The planting asks come first. The picking asks pop in after the time-lapse, as new cards on the same order card. Asking for picks before anything has grown would be odd.

8. **No Done buttons, no timers.** Each phase moves on when its rows are ticked.

9. **The farm's missing words go through the language pipeline.** They are added as `data/farm.json` placeholders, with `farm` added to the parked modes' importer (`build/lang/import_modes.mjs`), and the lexicon was rebuilt. The engine then answers the farm's lines like any other: its gaps are grey English, and Mum's recording sheet lists them.

## Changes outside `js/farm`

| File | Change |
|---|---|
| `build/gen_labs.mjs` | One line: the farm's games get their own group on labs.html. |
| `labs.html` | Regenerated from `build/gen_labs.mjs`. |
| `build/lang/import_modes.mjs` | `farm` added to the list of modes whose English placeholders it imports. |
| `data/lang/*.json`, `data/lang/reports/*` | Rebuilt by `node build/lang/import_all.mjs`. Additions only: 4 to-record nouns (cow, grass, chick, sheep), the farm's alias on the existing to-record *white*, 12 to-record phrases, 3 to-record frames (BringHalfOfX, BringAllOfX, PlantTheX). |
| `docs/language/recording-sheet.md` | Regenerated (`node build/tools/ops/recordings.mjs`): the farm's to-record words are now on it. |

**Shared kit:** no edits to `js/shared/` or `css/shared/`.
- The farm uses the kit as it is: `NaniGuide`, `OrderCard` (s14), `WordCard` (big14, item14, morph, fit14), `Onboard` (run, spot, the s14 look), `Rules`, `Sfx` and `Lifecycle`.
- Chai's helper-card markup (the arrow and the help box in her guide box) lives in Cook's `ui.js`, not in the shared kit. `js/farm/kit.js` builds the same markup on `NaniGuide` so the kit's s14 styles apply. **At the roll-out, this belongs in `NaniGuide` itself.**

`js/cook/**` was not touched.

## Checks

`node build/tools/review/checks.mjs`, with these results:

| Check | Result |
|---|---|
| unit | green, 623 pass |
| words | green |
| static | green, 0 new |
| bump | green |
| specs | green |
| docs | green |
| fixlist | green |
| recordings | green |
| size | green |
| load | green, 29/29 |
| **leak** | **reports clinic and snap** |

The leak result is not from this work:
- Run alone on a clean copy of `claude/nice-lovelace-0vfjcj`, the clinic bot passes ("No problems").
- The snap bot runs past the checks' 300 s limit even alone. In the checks run, three bots at a time hit that 300 s limit, and the line shown is the first one the bot printed.

The farm's new leak config (`build/tools/review/leak-configs/farm.json`) is marked browser and knownFail. Its stub bot says there is no bot yet. The unit test needs every mode to have a config.

Two fixes were made to get unit green:
- The grass tuft was recut with a crisp edge, because the art check flagged a soft rim.
- The farm leak config above was added.

## Not done (prototype)

- **No leak bot for the farm yet.** The config is a marked stub; see Checks.
  - The heard words decide which animal, hen, home or fruit, and how many.
  - The card pictures blur from L3.
  - Known risk, the same as chai's: a count ticks at its number and extra taps don't land, so "tap till it ticks" wins the count. Only the choice of thing is a real test of listening.
- **No judge pass.**
- **No animal sounds.**
- **Not built:** the photo shoot and the corn stall (not asked for).
- **Hannah Mami doesn't appear in the scene.** She speaks from her box, as Nani does in chai.
