# School day prototypes (proto-school, 2 Nov 2026)

Builder: one in-chat subagent, rapid mode (brief: `build/reports/proto-brief-2026-11-02.md`). Laptop 1280x665 only, one lab shot per
game, levels 1 and 2 first. Not judged; not pushed. The orchestrator judges, merges and runs the full checks.

## What was built

A new prototype area, `js/school-proto/` (the farm's pattern): `main.js` (the mode, `mode=school-proto`), `play.js`, `kit.js` (a copy
of `js/farm/kit.js` with the host as a parameter: Nani, or the teacher), `art.js` (every placeholder picture in one table), and one
file per game. Styles: `css/school-proto.css` (scene only; the side panel is the kit's, unchanged). New colour tokens:
`--njg-proto-night`, `-night-wall`, `-dawn`, `-digits`, `-clock`, `-board`, `-board-edge`, `-chalk`, `-chalk-dim`, `-bag`,
`-bag-dark`, `-pyjama`, `-blanket` in `css/shared/tokens.css`. Labs: a "School prototypes" section in `labs.html` (via
`build/gen_labs.mjs`). Leak: `build/tools/review/leak-configs/school-proto.json` + stub `leak-games/school-proto.mjs` (knownFail, as
the clinic prototypes'). Words: `data/school-proto.json` (English placeholders, to record), registered in
`build/lang/import_modes.mjs`; `node build/lang/import_all.mjs` re-run (so `data/lang/*.json` changed: if another builder also
touched it, re-run import_all after merging rather than hand-merging the generated files).

Every line comes from the language engine. Where it has the Kutchi it shows (e.g. *Hath dho!*, *chakli*, *laal gadi*, *sat*); every
missing word or frame is grey italic English, "to record".

## The games

### 1. The wake-up clock (Nani)
`lab.html?mode=school-proto&game=clock&level=1` (levels 1-4)

- **Plays:** bedtime: three beds (Ali, Nana, Ma; order shuffled), Nani's order card says each one's hour ("Ali wakes up at *sat*":
  the frame is grey, the hour is the engine's number). "Goodnight", the room goes dark, the wall clock whizzes and pauses at each hour
  (the same pause whether anyone is due). Tap the sleeper whose hour it is: they sit up (tired face to happy face), the row ticks gold;
  late: ticks plain; a tap at the wrong hour: a sleepy shake and *hever na*, nothing marked. Anyone still asleep at the end is woken by
  Nani (plain). Morning, "Shabash", the end screen. No timed hints (the design's override); the first-ever wake is lit once.
- **Levels:** L1 three hours in 5-9, never all adjacent, the bedside alarms show the digits, Nani says each hour at its pause (6 s).
  L2 a five-hour stretch anywhere in 1-12, the bedside alarms frosted, the hour said only after a wake (5 s). L3, L4: as L2 with the
  design's shorter pauses (4.3 s, 3.7 s).
- **Missing (rules):** L3 morning/night and L4 before/after (no words), the eye on a card, the window toy, Simba on a bed, the chai at
  sunrise, the level-up override ("all three right"), the hold on the clock while a card speaks.
- **Shot checked:** night at 5:13, the 5 o'clock sleeper lit for the first-ever wake. Beds were overlapping: made smaller.

### 2. Getting ready (Nani)
`lab.html?mode=school-proto&game=ready&level=1` (levels 1-4)

- **Plays:** the sentence layout. Nani calls one child and one job at a time, big in her box ("*E* Cousin Zahra! Breakfast *kha!*");
  under her the word tiles: Children (Ali and the two cousins) and Jobs (teeth, hair, breakfast; hands and face from L2). Tap the
  thing (toothbrush, comb, a bowl on Nani's tray; soap and flannel from L2): it flies to the named child, who does it (bed-hair springs
  flat, a foam moustache wiped at once, the bowl used). Wrong thing: the child gives a puzzled shake, Nani says it again (ticks plain).
  Calls shuffled across children (never the routine's order); shelf and tray swap sides each round.
- **Levels:** L1 three jobs to each of three children (9 calls). L2 both washes for every child plus three L1 calls. L3, L4 as L2.
- **Missing (rules):** socks and shoes, "not your face!", "first ... then ...", get dressed, the mirror and the twirl into uniform, the
  bus horn, the funny misses (sock puppet etc.).
- **Note:** the engine's call to a name is *E [name]!* ("hey"); for Ali it says just "Ali!". The cousins' names are placeholders I
  chose ("Cousin Zahra", "Cousin Hasan"; the design leaves them open): Zafar to name them.

### 3. Pack the school bag (Nani)
`lab.html?mode=school-proto&game=bag&level=1` (levels 1-4)

- **Plays:** the sentence layout. Nani: "Book *wij!*" (put the book in: *wij* is the engine's), "*Ba* pencils *wij!*". Tiles: School
  things and Toys, one per kind on the bench. Tap the thing: it hops into the bag; a count ticks the moment its number is reached and
  an extra pencil wobbles and stays. A wrong thing wriggles and stays; her line again. The bag closes at the end.
- **Levels:** L1 book and pencil, a ball as the decoy. L2 a school thing and two pencils (spares on the bench), the other school thing
  and a toy. L3 three asks (crayon or lunchbox), the teddy too. L4 four asks, one a toy (show-and-tell's seed).
- **Missing (rules):** "not the ball" (a no ask), owners (your book, not Ali's), big and small book, show-and-tell day's own line,
  Simba in the bag, the call-back at the zip.

### 4. The blackboard (the teacher)
`lab.html?mode=school-proto&game=board&level=1` (levels 1-4)

- **Plays:** the sentence layout, the teacher hosting. "Draw the *bakri*." Tiles: Pictures (*chakli*, *ghar*, *gadi*, *bakri*),
  Colours (*laal*, green), Numbers from L2 (dots, never digits). A chalk tray: white, red and green chalk, the duster from L2 (tap to
  hold). DRAW: hold the white chalk, drag over the named dotted picture: the chalk line fills in, then it hops. COLOUR: hold a colour,
  tap the picture. RING: tap the group of birds she named; a ring, then she counts them aloud as each bounces (a wrong group: she
  counts that one, then her line again). RUB OUT: hold the duster, rub the named one (red/green car or bird); the wrong one dodges.
  The board shows no letters or numbers.
- **Levels:** L1 draw then colour. L2 draw, ring, rub out (shuffled). L3, L4 as L2.
- **Missing (rules):** Ali's model turn, size (big/small), "how many?", two jobs in one line, the sticker at the bell, a real
  snap-to-track trace (any drag over the right picture draws it here).

## Words missing from the engine (all grey English, to record)

- **Clock:** eleven, twelve; "{who} wakes up at {n}", "It's {n} o'clock", "Get up!", "Goodnight!", "Tomorrow is school! Who wakes up
  when?", "Wake them up at their time.", "Good morning! The bus comes at eight." (Five to ten are drafts; ten (*do*) is suspect.)
- **Getting ready:** teeth (n.tooth), hair, breakfast, face; "Brush your teeth!", "Comb your hair!", "School today! Get ready.";
  the cousins' names; children, jobs (the tile labels).
- **Bag:** book, pencil, crayon, lunchbox, ball, teddy, school bag; "School today! Let's pack your bag.", "Simba! Out you come."; the
  tile labels "school things", "toys".
- **Board:** "Draw the {x}.", "Colour the {x}: {y}." (the frame to record: Mum's word order), "Put a ring round the {x}.",
  "Rub out the {x}.", "Good morning! Come, you're my helper today."; green is the engine's (*lilo*) but showed grey in one tile
  label check: to look at; pictures, colours, numbers (tile labels); teacher, chalk, duster, flannel, soap.

## Art needed (all placeholders now)

The bedroom at night (three beds, bedside alarms, a wall clock, the window: moon to sunrise) and the sleepers' lying poses (now the s07
"tired" faces on flat beds); the children's room with three children in pyjamas (now faces on flat pyjama blocks), the cousins' look;
Nani's front door, bench and school bag; book, pencil, crayon, lunchbox, teddy, flannel (flat shapes now); the classroom, the board,
chalks and duster, the four chalk pictures (SVG outlines now); the teacher (the auntie patient's face stands in). Modest school
clothes and uniforms for all (do-it-engine.md §7).

## Checks

`node --check` on every new JS file; one lab shot per game at 1280x665 (no errors, nothing spills); static lint: two gradients in
`css/school-proto.css` caught by the full checks and replaced with flat tokens (0 new). Full `checks.mjs`: see the hand-back note.
