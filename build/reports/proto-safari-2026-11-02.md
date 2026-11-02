# Prototypes: the safari (Hannah Mami), 2 Nov 2026

Builder's report (proto-safari). Brief: `build/reports/proto-brief-2026-11-02.md`. Design: `build/reports/designs/safari.md` and
its critique; the safari section of `games-at-a-glance-2026-11-01.md`. Laptop 1280x665 only; levels 1-4 all play. Not judged.

## The two games

| Game | Lab link | Levels |
|---|---|---|
| Snap from the jeep | `lab.html?mode=safari-proto&game=snap&level=1` | 1-4 |
| Who's hiding? | `lab.html?mode=safari-proto&game=hiding&level=1` | 1-4 |

Both are in `labs.html` under "Safari prototypes (Hannah Mami, 2 Nov)". Add `&onboard=0` to skip the first-time light.

### Snap from the jeep

**What plays:** the jeep's window (a flat roof and dashboard rail) over a ride of three scenes: the waterhole's three elephants,
the tree's three giraffes (one big and eating, one small and eating, one small and running) and the long grass's zebra.
These scenes are cut from Zafar's mock-ups. The jeep stops by some animals. Hannah Mami says one instruction, big in her box,
and the shared word tiles sit under her:
- an "animals" group: elephant, giraffe and zebra
- from L2, a "what they do" group: eating, swimming and running, each with a neutral icon
- at L4, a "big and small" pair tile, *nindho* giraffe and *wadho* giraffe, with neutral dots

No tile glows for the answer.

The gesture is the farm's Snap gesture (critique 1): tap an animal and the frame glides to it, the corners go gold, then a tap
inside the frame takes the photo. You get a click and a flash, and the photo prints onto the dashboard. A right photo ticks at
once. A wrong one still prints, but it wobbles, she says what's in it ("That's the elephant running!") and asks again; that
instruction then ticks plain. Tapping another animal first moves the frame. The first photo is taken before the jeep moves,
and after each tick the jeep drives on to the next stop.

**The one-answer rule is coded** (`asksAt` in `js/safari-proto/snap.js`). An ask is made only where exactly one animal fully in
view fits it, and only where the level's new word is what picks the animal:
- **L1:** two kinds in view, and the noun decides: "Take a photo of the giraffe."
- **L2:** two or more of one kind in view, and the doing word decides: "Take a photo of the elephant that's swimming."
- **L3:** the doing word alone, with two kinds in view: "Who's running?"
- **L4:** size, kind and doing together: "the *nindho* giraffe that's eating."

**Rows:** 3, 3, 5 and 5. The design's 7 at L4 is long for a lab try, and L4's route sometimes comes out at 4, because only the
tree scene has a big and a small giraffe.

**Not built yet (from the design):**
- The ride doesn't move continuously: the jeep stops for each ask.
- The animals are part of the mock-up pictures, so they don't move, react or get followed by the frame.
- No speed calls at L2 and up.
- No lion in the tree and no "climb", no monkeys on the bonnet, no babies (L4 uses big and small), and no print for Ali at the end.

### Who's hiding?

**What plays:** a band of grass clumps (three, or four at L4), with an animal behind each and one part showing:
- the elephant: its ears and back
- the giraffe: its neck
- the zebra: its rump and tail
- at L3, every animal shows only its back: stripes, spots or grey

Hannah Mami says one instruction, and the tiles are:
- the animals at every level
- "what shows" at L2: *kan* (ear), neck and tail, each with a neutral icon
- "what shows" at L3: stripy, spotty and grey, as plain swatches
- the *nindho*/*wadho* giraffe pair at L4

Tap a clump: it rustles and the animal pops up. On a right find she says "*Ker ai?* The zebra! *Shabash*", the instruction ticks,
and then everyone ducks and comes up behind new clumps. Nothing is used up, so nothing is won by elimination. A wrong find pops
up too and wobbles, she says who it is ("That's the giraffe!"), it ducks back down, and she asks again. At the end she says
"Everybody out!": they all pop up, the Snap frame goes gold over the group, and a tap inside takes the group photo, then the
shared end screen.

What each level asks:
- **L1:** the name: "The zebra is hiding. *Kida ai.*"
- **L2:** the part: "Find the *kan*!", the neck, the tail.
- **L3:** the look: "Where's the stripy one?"
- **L4:** big and small: "The *nindho* giraffe is hiding. *Kida ai.*" The small giraffe hides among a big giraffe, the elephant
  and the zebra.

**Rows:** 3, 3, 5 and 5.

**Not built yet (from the design):**
- The L3+ speaking turn (the binoculars, "*Ker ai?*", the child names the animal).
- A random part per hide: each animal always shows the same part at L1-L2.
- The pop-ups' own tricks: the spray, the sway, the chewing.
- A baby elephant at L4.
- The group photo going to the book.

## Kutchi used (all from the engine; nothing invented)

*kan* (ear), *kida ai* (where is it?), *ker ai* (who's there?), *nindho* (small), *wadho* (big), *shabash*.

## Words and lines still to record (grey italic English in the game; `data/safari-proto.json`)

- **Words:** elephant, giraffe, zebra, tail, stripy, spotty, grey, and the doing words as they are asked: eating, swimming and
  running. The commands *kha* and *bhaj* exist, but not the "that's eating" form.
- **Neck:** already a to-record word in the engine (the clinic's).
- **Group labels:** wild animals, what they do, what shows, big and small.
- **Lines:**
  - Snap: "Look! Take photos for Ali.", "Take a photo of the {x}.", "Take a photo of the {x} that's {v}.", "Who's {v}?" and
    "That's the {x} {v}!"
  - Who's hiding: "Shh! Who's hiding?", "The {x} is hiding.", "Find the {x}!", "Where's the {x} one?", "That's the {x}!" and
    "Everybody out!"
  - Two guide lines.
- **From the design, not yet asked for:** lion, monkey, climb, baby, photo, camera and binoculars.

## Art

**Placeholders made for this prototype** (`assets/safari/proto/`). They are cut from Zafar's mock-ups in
`sources/art/mockups-2026-11-01/`; the script is not in the repo.
- **The three ride scenes:** each with the jeep's roof and rail cropped off and the drawn camera corners painted out. Faint
  smudges remain where the gold corners were in the giraffe scene.
- **Rough cut-outs:** the three elephants, the three giraffes and the zebra. The giraffe cut keeps a clump of leaves, and the
  eating elephant keeps its bush.
- **One grass clump.**
- **Reused:** Hannah Mami's face is the farm prototypes' crop. Who's hiding's backdrop is the ride's `far-hills.webp`, which
  reads as a green field.

**Art needs (the design's §7):**
- the savannah ride as moving layers, with the near loop as the three verb scenes
- the jeep frame
- the long grass, with clumps that part
- the animals in shared poses: stand, eat, swim, run, react
- the lion in the tree, the monkeys, the babies
- the instant camera, the binoculars and the binocular view
- Hannah Mami

## Shared files touched (for the merge)

- `build/gen_labs.mjs`: one line, the "Safari prototypes" section.
- `build/lang/import_modes.mjs`: `safari-proto` added to `MODES`.
- `css/shared/tokens.css`: the `--njg-proto-safari-*` tokens.
- `labs.html`: regenerated.
- `docs/language/recording-sheet.md`: regenerated.
- `data/lang/*`: regenerated.

I re-ran `node build/lang/import_all.mjs` and `node build/tools/ops/recordings.mjs`.

**The safari kit:** `js/safari-proto/kit.js` is a copy of the school kit, with the `sf-` prefix and Hannah Mami as the host. It
adds one hook, `F.beforeNext`: the jeep drives on, or everyone re-hides, between a tick and her next instruction.

**The leak bot:** `build/tools/review/leak-configs/safari-proto.json` points at a stub, `leak-games/safari-proto.mjs`, which is
marked knownFail and lists the risks.

## Checks

`node --check` passes on every new JS file. Lab shots at 1280x665 (L1-L4): no errors, and nothing spills. I played both games
through by script with `&onboard=0` (Snap L2 and L4, Who's hiding L2 to the group photo), each with one wrong pick and its
recast. With onboarding on, a scripted tap is blocked by the first-time light; that's expected.

`node build/tools/review/checks.mjs` (full run): every group ok (unit 623 pass, words, static 0 new, leak 20 configs, bump, specs, docs, fixlist, recordings, size, load).
