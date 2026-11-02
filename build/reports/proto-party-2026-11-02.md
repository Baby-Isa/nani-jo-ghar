# Birthday prototypes (Zara's family), 2 Nov 2026: what was built

Builder report for the overnight prototype run (`build/reports/proto-brief-2026-11-02.md`). Five of the birthday games are playable in the
lab at levels 1 and 2, laptop 1280x665 only. "Snap the guests" and "Who ate the cake?" were left for later, as asked. Nothing was pushed.

**Where it lives:** `js/party-proto/` (kit.js is a copy of the farm kit; then main.js, play.js, art.js and one file per game),
`css/party-proto.css`, the new `--njg-proto-*` tokens in `css/shared/tokens.css`, `data/party-proto.json` (the English placeholders,
fed to the engine by `build/lang/import_modes.mjs`), a "Birthday prototypes (Zara's family, 2 Nov)" section in `labs.html` (from
`build/gen_labs.mjs`), and the stub leak bot `build/tools/review/leak-configs/party-proto.json` with `leak-games/party-proto.mjs`
(knownFail, the same as the clinic's).

**For the merge:** `node build/lang/import_all.mjs` was re-run, so `data/lang/{abstract,concrete,lexicon}.json`,
`data/lang/reports/coverage.md` and `docs/language/recording-sheet.md` are regenerated. If another builder's branch changed them too,
re-run `import_all.mjs` and then `build/tools/ops/recordings.mjs` after merging rather than hand-merging the JSON.

## The games

All five use the farm kit's rules: one host in the box, a count ticks the moment it is reached, a wrong move is a funny wobble and the
line again (the step then ticks plain), the first time something is lit, the stuck hints, "Shabash!", and the host's end screen. Three
of them are sentence orders and use the shared word tiles (`js/shared/word-tiles.js`). The other two keep chai's order card.

### 1. Pass the balloon: `lab.html?mode=party-proto&game=balloon&level=1` (and `level=2`)
- **Host:** Zara (the girl's face). **Layout:** the sentence layout. Her call is big in the box, and the word tiles show everyone in
  the row. At L2 the "mum" and "aunt" tiles have the same plain woman's picture, so a tile never says which sister is which.
- **L1:** Zara and Yusuf each say "My name is ..." in a bubble. Then three calls by name (Zara, Yusuf or Nana): "Give the balloon to
  Nana." The balloon floats over. A child keeps it and calls next; a grown-up bats it back to a child.
- **L2:** only the two sisters are called (Zara's mum = Yusuf's aunt; Yusuf's mum = Zara's aunt), four calls. They swap seats after a
  call more often than not, so only the words pick.
- **Wrong tap:** the balloon puffs halfway over and back, the person wobbles, and the call comes again.
- **End:** Zara asks "What's your name?" and the balloon floats down to you.
- **Missing:** Sana (no art for a second girl: the row is Zara, Yusuf and Nana at L1). L3 (the holder says "my mum") and L4 (the
  grandparents) are not built.

### 2. How are you?: `lab.html?mode=party-proto&game=how&level=1` (and `level=2`)
- **Host:** Zara's mum (the clinic's auntie face). **Layout:** chai's order card. Each guest's card lands only when they answer, so
  nothing is on the panel before it's said (chai P7). At L2 the card has no picture.
- **How it plays:** tap a guest, the child asks "Ki aiye?" in a bubble, and the guest answers "I'm thirsty." Then tap a thing on the
  trolley, then the guest. All six fixes are always there: samosa, water, chair, fan, shawl and balloon. A right fix flies over, the
  face turns happy, they say "Thank you!" and the card ticks. A wrong fix wobbles and goes back, and they say it again.
- **L1:** Ali and Ma; hungry, thirsty, tired or sad; their feeling faces show above their heads.
- **L2:** Ali, Ma and Zara; any of the six feelings; the faces stay hidden until a try. One guest is fine: "Aau theek ai." (in the
  engine), and their card ticks. Offered something, they say "Na, thank you." and it never counts as a miss.
- **Missing:** L3 (other ways of saying it, which food) and L4 (two needs at once).

### 3. Musical statues: `lab.html?mode=party-proto&game=statues&level=1` (and `level=2`)
- **The music: clapping only, no instruments.** Nani claps: a clapping-hands picture claps, with a soft click on each beat. There is
  no tune. Zara and Yusuf dance (a sway loop), and a tap on a dancer gives a wiggle.
- **The stop:** the clapping stops and Nani calls a pose. The call shows in her box and on her order card, one card per stop, **with no
  picture**, because the card's picture would match the pose card. The pose cards along the bottom are stick figures with no words,
  shuffled at every stop. The right card makes both dancers snap into the pose with a click; then the clapping comes back. A wrong
  card makes them try that pose and wobble, and she calls it again.
- **L1:** sit, jump and turn round; four stops. **L2:** adds stand up and dance; five stops ("Dance!" sets them going again).
- **Missing:** L3 (touch your nose, head or ear: the engine can't say "your" yet; `PossPron` with `pron.p2` gives a gap) and L4. No
  crown and no "now you!" ending.

### 4. The cake: `lab.html?mode=party-proto&game=cake&level=1` (and `level=2`)
- **Host:** Nani. **Layout:** the sentence layout. The tiles are cake (candle, candles, cake) and family (Nana, Zara, Yusuf, and the
  baby at L2).
- **Steps, one at a time:**
  1. "Ba candles khanech!" (bring two candles): tap the bundle with that many. There are no digits anywhere. The candles go onto the
     cake, lit.
  2. "Now blow!": tap the cake. The flames go out one by one as Nani counts down in Kutchi.
  3. "Hi Nana lai ai." (Mum's recorded line): tap a slice, then that person. The slice lands on their plate. Giving it to the wrong
     person makes them wobble, the slice goes back, and she says it again.
- **L1:** bundles of 1, 2 and 3; two slices. **L2:** four bundles from 1 to 6; three slices; the baby is at the table, on Yusuf's mum's
  lap.
- **Missing:** the cloth and the cups (the design's L2), "two pieces for Zara", L3 and L4. There is no bite animation, only a bounce.
  The cake is for the celebration, not a reward.

### 5. The party presents: `lab.html?mode=party-proto&game=presents&level=1` (and `level=2`)
- **The drum is a toy car** (no instruments). The car is *gadi*, confirmed in the engine. **Host:** Nani. **Layout:** the sentence
  layout. The tiles are toys (gadi, ball, teddy, balloon) and family.
- **How it plays:** tap a plain brown box; it pops and the toy jumps out. Tap the toy, then the person she names. They bounce (a squeak
  for the teddy) and it ticks. A wrong person wobbles, the toy goes back, and she says it again.
- **L1:** three boxes with one toy each. "Hi Zara lai ai.": only who it's for matters.
- **L2:** two boxes with five toys between them (a ball twice, so the last toy is never forced). She names three: "The gadi is for
  Yusuf." The toy and the person both come from her words. The baby is there.
- **Missing:** L3 ("it's yours / it's Zara's"), L4, and the "whose is it? mine!" ending.

## Lab shots (laptop 1280x665, one per game, looked at)
`build/screenshots/labcheck/party-{balloon,how,statues,cake,presents}/` (not committed). No page errors and nothing spills. Fixed on
the way: the play area's class (the layout was missing), the trolley's pictures (natural size), the empty candle bundles, the cake tile
overflowing, and the balloon sitting on Zara's face.

## Kutchi: what the engine says and what is still to record
**In the engine (shown as Kutchi):**
- *Hi Nana / Zara / Yusuf lai ai* (Mum's recording: "this is for")
- *We!* (sit)
- *Aau theek ai*, *Na, thank you*, *Thank you!*
- *Ki aiye?* (draft, marked "to check" in the design)
- *khanech* (bring), *gadi*, the numbers 1 to 6 (5 and 6 are draft), *Nana*, *jo* (of)

**Grey English, to record** (`data/party-proto.json`; every one is on the regenerated recording sheet):
- **Names:** Zara, Yusuf, Sana. The names stay English; they need the family's voice.
- **Words:** mum (the kin word), aunt (masi), baby, balloon, cake, candle, ball, teddy, fan, shawl.
- **Feelings:** "I'm hungry / thirsty / tired / sad / hot / cold."
- **Statues:** jump, stand up, turn round, dance. The engine's *firai* is flip or stir, not turn round, so it isn't used.
- **Frames:** "My name is {x}.", "Give the balloon to {x}.", "What's your name?", "The {x} is for {y}.", "Now blow!"
- **The hosts' opening lines:** balloon, how, statues, cake, gift.
- **The tile labels:** family, cake, toys.

**Engine gaps found:**
1. "Zara jo mum": mum's gender is unknown, so the engine falls back to *jo*. The design says *ji* (a she-word). The kin nouns need
   their gender from Mum.
2. "Hakro candle" uses the default gender for the same reason.
3. "Your nose" (`PossPron` with `pron.p2`) doesn't render: that blocks statues L3.
4. `HowAreYou` gives "Ki be?" with a gap, so the prototype uses the recorded phrase *Ki aiye* instead.

## Art needed (all placeholders now)
- **People:** Zara, Yusuf, the two sisters and Ma come from the clinic's patients, and Ali from his feeling set. Sana needs her own art.
  Yusuf's only picture is sitting, which looks odd when he dances. Dancing and pose frames are needed (sit, jump, turn, stand), and
  standing guests.
- **Feelings:** hungry and thirsty faces (Ali and Ma use "poorly" for now) and Zara's tired face.
- **The room:** a party room with bunting (now flat token shapes), a sofa, and a table with plates.
- **Things:** the balloon, cake, candles, slices, ball and teddy are drawn stand-ins. Also needed: brown gift boxes and the pose cards'
  pictures. The chair is a drawn stand-in. The clapping hands are an SVG.

## Decisions I made (for Zafar to reverse)
1. **Clapping, not music.** Nani's claps with a click on each beat; there is no tune.
2. **The drum is a toy car.** It's a confirmed Kutchi word.
3. **Statues cards have no picture,** so the call is heard, not matched.
4. **Nana replaces Sana at L1** of the balloon game until there is art for her.
5. **Faces as feelings:** in "How are you?" the feeling faces show at L1 and hide at L2 until a try. The L1 card shows the face.

## Checks
`node --check` passes on every party file, and the static lint has 0 new findings (the balloon gradient became a token). The full
`checks.mjs` result is below.
