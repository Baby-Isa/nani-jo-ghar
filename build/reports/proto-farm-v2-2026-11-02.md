# Farm v2 prototypes (2 Nov 2026): the word tiles

Builder report. Brief: `build/reports/proto-brief-2026-11-02.md`. Row: FARM-01 (`docs/feedback/farm-prototypes-2026-11-02.md` P1-P3).
Branch: this worktree, on top of `claude/nice-lovelace-0vfjcj` (d8a7903). Five commits, not pushed. Checked at 1280x665 only (rapid).

## What changed for every farm sentence game

- **The order card is gone** from feed, eggs, home at dusk, and plant/grow/pick. Hannah Mami says **one instruction at a time**.
  It shows big in her box, with the words she says (nouns, adjectives, numbers) underlined in gold. Her face's speaker badge stays
  in its corner and replays the current instruction.
- **The word tiles** sit under her, in groups (mock-ups feed-B-yard and eggs-B-grid). Each tile has a picture, its word and a big
  speaker. A tap anywhere on the tile says the word.
  - There is a tile for **every thing in the scene**, asked for or not, and **no tile glows for being asked**.
  - A tile lights only while its word is said: by its own speaker, or by her line while that word is still supported (ladder
    stage 1-2). Without real word timings, the light is timed by the word's letter position in the line.
  - The **picture always stays**. The **word dots out** at ladder stage 5. A tap on the dots shows the word for 3 s; this
    **costs accuracy** (the current instruction ticks plain) and is logged as a text cue.
  - Lab only: `&ladder=N` puts every tile word at stage N (`&ladder=5` shows the dots).
- **Progress pips** under her box: one per instruction, done ones filled, the current one ringed. They show progress, never a
  verdict.
- **A wrong pick does nothing bad.** If the child acts on a thing she isn't asking about now, it shakes or wobbles, she says her
  instruction again, and the instruction ticks plain.
  - New rule this brings: you **can no longer do the instructions in any order**. That follows from "one at a time".
- **The helper card** (her arrow, or the stuck wait) still opens the current instruction's big card with its picture. That is
  help, counted as a hint, as in chai.
- **Ladder evidence:** at the end, every tile word in an instruction goes to `ctx.done({evidence})` (right if the instruction was
  first-try; cue "text" if it was peeked).

**The reusable piece:** `js/shared/word-tiles.js` and `css/shared/word-tiles.css`.
- `mountTiles(parent, groups, {shown, onSpeak, onReveal})` returns `{tile, say, light, repaint, steps}`.
- Its look uses only the s14 card tokens (no px).
- The kit's side (`js/farm/kit.js`): `F.sentence(groups)` and `F.current()`; each `F.row({tiles: [keys]})` lists the tiles its
  line names.
- Any later sentence game (clinic, shops) can call `mountTiles` the same way. The farm loads the CSS through `NEEDS.styles`.

## Per game

| Game | Lab link | Levels | Tiles | Notes |
|---|---|---|---|---|
| Feeding time | `lab.html?mode=farm&game=feed&level=1` | L1-L4 | Animals (every animal in the arc), Food (`khenjo`: every basket) | Kept: the arc, trays, baskets, the count ticking at the number, the extra piece bouncing back, eating. A tap on an animal now replays her instruction (it used to say that animal's ask, which named who wants what). Water's tile is a small drawn bucket. |
| Collect the eggs | `lab.html?mode=farm&game=eggs&level=1` | L1-L4 | Hens (`murgi`): the small-and-big pair tile at L1-L3 (gone at L4), a plain hen (slate grey: no hen in the scene is that colour), red and white from L3. Eggs (`inda`): one egg, two eggs (neutral grey, neither hen's egg colour). | Kept: the perch, lifting hens, the eggs in the hay, the chick, the basket, the count. Played: a wrong hen's egg wobbles and the instruction is said again; the instruction ticks at its number, the extra egg stays, the next instruction comes. |
| Home at dusk | `lab.html?mode=farm&game=home-dusk&level=1` | L1-L4 | Animals (every kind out tonight); at L4 the small-and-big goat pair (plain goats) | The old card showed the animal (and its size): a match. Kept: hiding places, homes, the wrong home's bump. |
| Plant, water, grow, pick | `lab.html?mode=farm&game=grow-pick&level=1` | L1-L4 | Plants (every fruit on offer); from L3 red and green (`laal`, `lilo`: neutral swatches); at L4 the small-and-big pair (plain mangoes) | The old pick card showed the tinted or sized fruit: a match. Both phases now run as one instruction at a time. |
| The photo shoot | unchanged | | | **Left as it is.** Each ask is one noun phrase ("two hens", "the hen and her chick"), not a who-gets-what sentence. Its card picture already blurs from L3 (chai's ladder), so it matches pictures only while supported. If Zafar wants it on tiles too, that is a separate job (873 lines, its own camera flow). |
| Corn stall (`js/cook/stations/corn.js`) | unchanged | | | **Left as it is.** It is a recipe order (how many cobs, which dressings, "no" asks), like chai's, so it keeps chai's order card and rules (the brief's rule). It is also Cook's area, not mine. |

## Words: what the engine can't say yet (grey italic, to record)

- **Tile words:** `cow`, `sheep`, `grass`, `chick`, `white` (as before). `animals` and `plants` (the group labels; there is no
  Kutchi word for them in the lexicon).
- **Lines:** in eggs L4, "Bring half of …" (`bring`, `half`, `of`). In grow-pick, "Plant the …" (`plant`) and the tomatoes'
  plural (as before).
- **Audio:** `murgi` has no recording (the engine's audio gap), so the device voice says it while testing.

## Open, for the orchestrator or Zafar

1. **Group labels are Kutchi where the engine has the word** (`khenjo` food, `murgi` hens, `inda` eggs). Otherwise they are grey
   English to record (Animals, Plants). Non-negotiable 3 bars written English for the child, so I didn't use the mock-ups'
   English labels. **Recommend:** ask Mum for "animals" (and "plants"); or drop the labels if Zafar prefers the plain grid.
2. **One at a time means a fixed order.** A wrong animal, hen or fruit now counts as a miss on the current instruction. That is
   consistent with "she gives you instructions one by one", but it is a rule change from v1, so it is worth Zafar's eye.
3. **Not built:** the phone's scrolling strips (eggs-C-strips). I only checked at 1280x665. The grid shares the panel's height (it
   shrinks, it never scrolls), so 740x320 will need the strips or a squeeze check.
4. **Tile light timing** is estimated from letter position, not real word timings. Real timings would come from the clips.
5. **Placeholders:** the plain hen and goat use a CSS slate tint of the hen and goat art. The colour tiles are CSS swatches. The
   neutral eggs are grey CSS shapes. All are art needs for the next run (a neutral hen, goat and mango outline, colour blobs).
6. **No judge and no full checks**, per the brief. Shots were taken with labcheck on a private port
   (`COOK_TEST_PORT=8857`), because the other builder held 8812. No page errors and nothing spills on any shot.

## Commits
- `proto(farm): feeding time on the word tiles` (the shared module, the kit's sentence mode, feed, the lab's `ladder` param)
- `proto(farm): collect the eggs on the word tiles`
- `proto(farm): home at dusk on the word tiles`
- `proto(farm): plant, water, grow, pick on the word tiles`
- this report
