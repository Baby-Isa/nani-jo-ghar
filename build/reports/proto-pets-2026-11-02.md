# Pet hotel prototypes (proto-pets, 2 Nov 2026)

Builder: one in-chat subagent, rapid mode (brief: `build/reports/proto-brief-2026-11-02.md`). Laptop 1280x665 only, a lab shot per
game (driven part-way by a script), levels 1-4 built. Not judged; not pushed. The orchestrator judges, merges and runs the full checks.

## What was built

A new prototype area, `js/pets-proto/` (the school's pattern): `main.js` (the mode, `mode=pets-proto`), `play.js`, `kit.js` (a copy
of `js/school-proto/kit.js` with Hannah Mami as the host, plus `F.stampUrl` and `F.setNext(ms)`: the pause before the next
instruction, so going home's goodbye isn't talked over), `art.js` (every placeholder picture in one table), `yard.js` (the shared
scene), `care.js`, `home.js`. Styles: `css/pets-proto.css` (scene only, `pt-` prefix; the side panel is the kit's and the shared word
tiles, unchanged). New colour tokens `--njg-proto-pets-*` (counter, mat, bubble, drop, track, pip, blanket, sleep) in
`css/shared/tokens.css`; no gradients or raw colours in the mode's CSS. Labs: a "Pet hotel prototypes (Hannah Mami, 2 Nov)" section
in `labs.html` (via `build/gen_labs.mjs`). Leak: `build/tools/review/leak-configs/pets-proto.json` + stub
`leak-games/pets-proto.mjs` (knownFail). Words: `data/pets-proto.json` (English placeholders, to record), registered in
`build/lang/import_modes.mjs`; **`node build/lang/import_all.mjs` re-run** (so `data/lang/*.json` changed: re-run it after merging
rather than hand-merging the generated files). `build/tools/ops/recordings.mjs` was **not** re-run.

**Art:** placeholders only, cut as soft ovals (and three clean cut-outs: the corn, the bowl, the bed) from Zafar's 1 Nov pet hotel
mock-ups by `build/tools/art/cut_proto_pets.py` into `assets/pets-proto/` (dog, ant, rabbit, bee, cat, corn basket, bowl, tub, jug,
brush, bed, the mother, the girl, the basket). The yard is the farm's sky, hills and fields; Hannah Mami's face is the farm's.

**Halal and the family's ways:** the pet hotel is in Hannah Mami's **yard**, outdoors (the dog is kept outdoors); the dog is never
hugged or carried in a basket (at going home it walks off with the mother). No pigs; the animals are the design's dog, ant, rabbit,
bee and cat. Corn is the only food; no sweets.

## The games

### 1. Look after the animals (Hannah Mami)
`lab.html?mode=pets-proto&game=care&level=1` (levels 1-4)

- **Plays:** the sentence layout. Hannah Mami says one care at a time, big in her box ("*Kutro dho!*": wash the dog), under her the
  word tiles: Animals (every animal on the counter) and Looking after (the four cares, each with its tool's picture: *Dho!* is the
  engine's Kutchi, feed, brush and put to bed are grey English). The animals sit on mats on a long counter; the four tools are always
  along its front in the same places. **Tap the tool** (it glows as held; tap it again to put it back), **then the animal**:
  - **feed:** a cob flies into the animal's bowl; from L2 tap the corn (or the animal) once per cob she asks for; the count ticks at
    its number and an extra cob doesn't land; the animal hops and eats.
  - **wash:** the tub comes to the animal; tap the animal to scrub (bubbles), then the jug appears (lit at L1 only: the next step of
    a care already chosen): the rinse, drops, a shake.
  - **brush:** a dashed track along its back; drag the brush end to end, three strokes (three pips fill); it fluffs.
  - **bed:** the bed comes to it; tap it (the blanket): it dims and sleeps under a blanket with a sleep cloud. A sleeping animal
    stays askable (it wakes for its care); bed isn't asked of an animal already asleep.
  - **wrong tool or wrong animal:** a wobble, the tool goes back, her line again; the instruction ticks plain. Nothing in hand and an
    animal tapped: a happy bounce, nothing marked.
- **Levels:** L1 the dog and the ant, feed or wash at random (repeats allowed), the brush and bed on the counter but greyed, 4 asks.
  L2 three of dog, ant, rabbit, bee; all four cares; feed says how many (*Kutro feed! Ba makai de!*); a care rarely twice in a row;
  5 asks. L3 the cat always on; feed and bed sometimes as a feeling ("The cat is hungry", "The dog is sleepy"); 6 asks. L4 the small
  and the big rabbit side by side (a pair tile: *nindho* / *wadho* underlined), 6 asks.
- **Shots checked:** L2 at the start (the first-ever tool lit); L3 after four driven asks (the cat asleep under its blanket, "The cat
  is hungry" next). Fixed: a third tile group (Feelings) squeezed every tile picture to a dot, so it was dropped (hungry and sleepy
  are heard in her line only); the blanket was too tall.
- **Missing (rules):** Ali's turn (the speaking moment, L3+), the per-animal funny eats and misses (one bounce and one wobble for all),
  "brush the dog, not the ant", the zoom for wash and brush, the dog's shake spraying the screen glass, the helper doing it with the
  child after a second miss (the kit's stuck hints only).

### 2. Going home (a family, then Hannah Mami)
`lab.html?mode=pets-proto&game=home&level=1` (levels 1-4)

- **Plays:** the pets stand forward along the counter in one line, the same height (the small rabbit is smaller: the L4 word). A
  mother and a girl with a basket come up behind the counter: "We've come for the *kutro*" (the frame grey, the animal the engine's),
  big in the box; the Animals tiles under it. Tap the pet they named: it flies into the girl's basket (the dog to the mother: it walks
  off with them), the girl bounces, the row ticks, "*Achija!*" (bye), they leave and the next family comes. A wrong pet wobbles and
  stays; their line again (plain tick).
- **Never forced by elimination:** the hotel has more pets than families (two or more of a kind), each family's pet is drawn from
  what's left so that at least two kinds stay on the counter for the next family.
- **Levels:** L1 two dogs and two ants, 3 families. L2 dog, ant, rabbit, bee (6 pets), 4 families. L3 the cat joins (7 pets), 5
  families. L4 the big and the small rabbit among them (7 pets), 5 families, a rabbit asked at least once.
- **Shot checked:** L4 after two driven families (one wrong tap first): the third family asks "We've come for the *wadho* rabbit".
- **Missing (rules):** the doorbell, the family speaking as themselves (their line is in Hannah Mami's box: the kit has one host
  face), the hug pose, the pet's goodbye trick, Hannah Mami's "aah", the photo for the evening book. The same mother and girl come
  every time (placeholders).

## Words and lines missing from the engine (all grey English, to record)

- **Animals:** ant, rabbit, bee, cat. (dog *kutro*, bird *chakli* are the engine's.)
- **Care verbs:** feed, brush, put to bed (wash is *dho*). The engine builds "*Kutro* feed!" in Kutchi order with the verb grey.
- **Feelings:** hungry, sleepy; and the frames "The {x} is hungry.", "The {x} is sleepy."
- **Going home:** "We've come for the {x}."
- **Lines:** "The families come back this afternoon. Let's look after their pets!", "Do what Hannah Mami says.", "The families are
  coming back for their pets!", "Give each family its pet."
- **Tile labels:** animals, looking after (the Feelings label is in the data but unused now).
- From the engine as it is: *Kutro dho!*, *Ba makai de!*, *nindho* / *wadho* rabbit, *Achija*, *Shabash!*.

## Art needed (for the art run)

The five animals in the shared poses (stand, eat, in the tub, brushed and fluffy, asleep), each on transparency; the four tools, the
bowl, the jug and the bed as separate cut-outs; the yard (or the room, if the dog question goes the other way) as one background;
the family (mother, girl, basket) on transparency, with a hug pose; Hannah Mami's look.

## Checks

`node --check` on every new file; one driven lab shot per game at 1280x665 (no errors, nothing spills). The full
`node build/tools/review/checks.mjs`: see the hand-back message.

## Lab links

- Look after the animals: `lab.html?mode=pets-proto&game=care&level=1` (change `level=` to 2, 3, 4)
- Going home: `lab.html?mode=pets-proto&game=home&level=1` (change `level=` to 2, 3, 4)
