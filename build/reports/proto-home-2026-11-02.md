# Prototype report: A day at home (2 Nov 2026)

Builder: proto-home, overnight run (brief: `build/reports/proto-brief-2026-11-02.md`). Designs: `hide-and-seek.md`,
`pick-it-up-put-it-back.md`, `clean-up-day.md` (and their critiques), the home section of `games-at-a-glance-2026-11-01.md`.
Four commits in this worktree, not pushed. `tidy.html`, `find.html` and `js/tidy/`, `js/find/` are untouched.

## How they are built

- **Own folder, as the farm's:** `js/home-proto/` (`main.js`, `play.js`, `kit.js`, `house.js`, `art.js`, `hide.js`, `fetch.js`,
  `clean.js`), `css/home-proto.css`, `mode=home-proto` in `lab.html` (found by path, no import map entry needed), a
  **"Home prototypes (Nani, Simba and Zazu, 2 Nov)"** section in `labs.html` (`build/gen_labs.mjs`, regenerated).
- **The kit** is a copy of the farm kit (`js/farm/kit.js`) with Nani as the guide, so the farm builder's kit stays free. Changes in
  the copy: `F.reline(row, meaning)` (a cat slipped to a new place: new line shown and said); a row's `data.before(row)` runs before
  each instruction so the line is built from the scene as it is now; `data.onSay` is the hook for the L1 glow; from L3 every tile
  word is dotted, which stands in for the word ladder (as the clinic did). The merge should end with one kit for every area.
- **The sentence layout everywhere:** Nani's box holds one instruction at a time, its key words underlined; the shared word tiles
  (`js/shared/word-tiles.js`, not copied) sit under her, with a tile for every thing in the room, asked for or not. Pair tiles: small
  and big (hide and seek L4), on and under (pick it up), switch on and switch off, turn on and turn off (clean-up L2+). The tiles
  never glow for being asked. A wrong tap shakes the thing and she says the line again; the row will tick plain.
- **One doll's house** (`house.js`, Zafar 1 Nov): a two-storey cross-section. Upstairs are the bathroom, Nani's bedroom and Ali's
  room; downstairs the kitchen and the sitting room. The camera eases into a room (CSS transform); the edges of the rooms either
  side still show, and a tap on one goes there. Every game starts from the whole house.
- **Words:** `data/home-proto.json` (English placeholders, to record) is imported by `build/lang/import_modes.mjs` ("home-proto"
  added to its list; a placeholder can now give its own `pos`, for the verbs). I re-ran `node build/lang/import_all.mjs` (0 errors)
  and `node build/tools/ops/recordings.mjs`. **At merge:** `data/lang/lexicon.json` and `docs/language/recording-sheet.md` are
  generated files. If the town builder also re-ran the import, merge the sources and run both commands again rather than
  hand-merging.
- **Tokens:** new `--njg-proto-*` placeholders in `css/shared/tokens.css`: room walls, floors, cover, curtain, lamp, water, night,
  and the drawn shapes as `--njg-proto-draw-*` gradients. `css/home-proto.css` has no raw colours.
- **Leak:** `build/tools/review/leak-configs/home-proto.json` + stub `leak-games/home-proto.mjs` (knownFail, as the clinic's).

## The games

### 1. Hide and seek
Lab: `lab.html?mode=home-proto&game=hide&level=1` (levels 1-4)

- **Plays:** the house, then the camera eases into Nani's bedroom; the cats sit on the rug. **The count:** Nani's hands fill the play
  area, and each tap counts one of five pips (the numbers are said, grey English). Then the cats are gone. **The searches:** every
  place looks closed and alike, and no tail peeks out. A tap opens a place. If the asked cat is there: two green eyes, a leap, "Huda!",
  and the pip fills. If it's empty: a small joke shape pops out, Nani says "Na.", then her line again, and the place closes itself.
  From L2 she says where each cat is, then asks for one ("Simba wardrobe je me ai. Zazu bed je niche ai. Zazu kida ai?"). Opening
  the other cat's place makes it bolt to a new place, and her line changes. After two empty opens the asked cat slips away too.
  **The close step:** "Nana's coming: let's tidy up! Box close!" Close the place she names; the bed is never named. At the end the
  cats purr on the rug.
- **Levels:**
  - L1: 5 places (wardrobe, cupboard, box, under the bed, behind the curtain); Simba, then Zazu; the named place glows while she
    says it (the supported level); one close.
  - L2: 7 places (adds the drawer and the basket); both cats, so who and where; the slip; one close among 3 or more open places.
  - L3: as L2, tile words dotted; two closes.
  - L4: as L3, plus a small box beside the big one, so the size word decides (small-and-big pair tile).
- **Checked:** L1 played to the end screen (3 right, 0 hints); L2 shot in the close step.
- **Not yet:**
  - Both cats hide at the count even at L1 (the design has one hiding while the other sits with Nani; the line names only one).
  - No second count, so no third search at L2.
  - Nana and the speaking moment (1b) and the blanket are not built.
  - First-open finds are not yet the level-up rule.
  - The joke shapes are plain placeholders.

### 2. Pick it up and put it back
Lab: `lab.html?mode=home-proto&game=fetch&level=1` (levels 1-4)

- **Plays:** the whole house; Nana sits on the sofa in the sitting room. "Nana can't find his things. Nana jo glasses table je niche
  ai."
  - **Stage 1:** at L1 the asked room glows (guided). Tap it and the camera eases in. Two identical copies sit on and under the
    table, so only on or under decides. The right one flies back through the house to Nana; his glasses appear on his face. The
    wrong one shakes. Copies are laid out afresh each errand.
  - **Stage 2:** "Simba knocked these down. Put them back." The camera goes to the bedroom: the ball, the bag and a cup are on the
    rug. Tap one (it glows), then one of the dotted rings. Every ring is the same and never used up; a second thing settles beside
    the first. Right: it settles there. Wrong: it shakes and she says it again.
- **Levels:**
  - L1: room guided; one table; 2 errands, 3 put-aways (on or under the bedside table).
  - L2: the room is heard too ("Nana jo cup kitchen me ai. Cup table je niche ai."); a decoy copy in the other room; put-aways on
    or under the table or the bed; room and furniture tiles.
  - L3: as L2, tile words dotted, 3 errands.
  - L4: as L3.
- **Checked:** L1 played through both errands into the put-away stage (shot on the second put-away).
- **Not yet:**
  - Big and small copies, "my" and "your", this side and that side, Simba's paw, telling Ali.
  - The L2 line is two sentences ("in the kitchen" / "under the table"), because the engine has no frame with a room and an anchor
    in one line. Ask Mum for it as a frame.
  - Nana's huge eyes are not drawn.

### 3. The clean-up
Lab: `lab.html?mode=home-proto&game=clean&level=1` (levels 1-4)

- **Plays:** the house, then the camera eases into the bathroom. One instruction at a time: switch off the light, close the curtain,
  turn off the tap (water runs), sweep (the broom, then the dirty spot). The thing flips like a toy and its pip fills. A wrong thing
  flips (its joke), then flips back by itself; Nani says the line again. At the end, with the light off and the curtain closed, the
  room goes soft blue, Zazu pops up from the laundry basket, and the light comes back on.
- **Levels:**
  - L1: one of each: switch off, close, turn off, sweep (random order).
  - L2: two lights and two taps in opposite states, so on or off decides; the soap goes onto its dish; "Doing" tiles as on/off pairs.
  - L3: as L2, tile words dotted.
  - L4: as L3.
- **Checked:** L1 played to the end screen (4 right, 0 hints); L2 shot mid-play (the soap job done).
- **Not yet:**
  - The reason first ("it's dark in here ..."), Simba undoing things, telling Ali.
  - "The big tap", "all the lights", "first ... then".
  - Ali's room (push the toy car) and the kitchen visit (Zafar said yes to both).
  - Wipe.

## Missing Kutchi (everything below is grey italic English, to record; nothing invented)

- **Nouns:**
  - wardrobe (ask whether it is also *kabaat*), bed, drawer, box, basket, curtain, glasses, ball, bag;
  - lamp (Zafar: *batti*), tap, soap, soap dish, broom (Zafar: *fugyu*);
  - bathroom (Zafar: the family says "bathroom"), bedroom.
- **Verbs:** close (Zafar: *bund*), open, switch on, switch off, turn on, turn off (for a tap: ask Mum), sweep (Zafar: *fugya*).
- **Numbers:** one to five have no form alone (the count).
- **Lines** (`data/home-proto.json`):
  - hide and seek: "Simba and Zazu are hiding!", "Close your eyes and count with me!", "Ready or not, here I come!", "Nobody here!",
    "He ran off!", "Nana's coming: let's tidy up!";
  - pick it up: "Nana can't find his things.", "Simba knocked these down. Put them back.";
  - clean-up: "Let's tidy the bathroom.", "It's so cosy now."
- **Kutchi that already plays:** *kabaat*; Simba and Zazu (names); *kida ai*; *je me*, *je niche*, *je puthiya*, *je mathe*; *nar*,
  *rakh*; *Nana jo*; cup, table (English loans); kitchen; *nindho* / *wadho*; *Huda!*, *Na.*, *Shabash!*
- **Word order with placeholders:** the engine puts the verb last, so a placeholder line reads in Kutchi order ("Lamp switch off!",
  "Box close!").

## Art needs (all placeholders now)

- The doll's house itself (one run, the background locked first).
- Simba and Zazu as two different cats, in sit, peek, leap and curl poses. Today it is one black cut, with Zazu inverted to a light
  cat.
- Nani's hands over her eyes (today the cupped-hands cut).
- Nana seated, with glasses and with big eyes.
- The bedroom's places, each open and closed.
- Glasses, ball, bag, cup.
- The bathroom set: lamp on and off, tap running and off, curtain open and closed, broom, soap and dish, laundry basket.
- The empty-spot jokes: sock, pigeon, towels, toy car, wool.

## Flaws found (for the judge and the merge)

- **First-time teaching on a target that is already done:** the kit's `teach` waits for a tap on its target. If the child acts during
  Nani's first line, the spotlight lands on a finished target and blocks every other tap. I fixed this in my three games by
  pointing it at the current target. The farm's kit has the same pattern.
- **The side panel gets crowded:** the clean-up at L2 has two tile groups (6 things and 6 doing words), so the tiles are small.
  Strips for phones are not built.
- **The helper card** shows the row's word (a cat, a thing, a verb), not the whole instruction.
- **Only checked at 1280x665.** The room zoom depends on the room's shape (the bathroom and Ali's room are narrow), so there are
  slivers of sky either side. Not checked at the other three sizes.

## Checks

- `node --check` passes on every file.
- Lab shots at 1280x665: no errors, nothing spills.
- `checks.mjs`:
  - **Pass:** unit (623 pass), static (0 new, once my gradients became tokens), words, docs, fixlist, specs, bump dry run,
    recordings (regenerated).
  - **Fails, not mine:** the leak check, on snap g1 L1 (I didn't touch snap).
  - **Not run:** the load check (browser lock).
