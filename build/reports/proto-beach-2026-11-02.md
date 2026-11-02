# The beach and the boat day prototypes (proto-beach, 2 Nov 2026)

Builder: one in-chat subagent, rapid mode (brief: `build/reports/proto-brief-2026-11-02.md`). Laptop 1280x665 only, one lab shot per
game plus a scripted play-through of each (taps through a round, every row ticked first time, the end screen reached). Not judged;
not pushed. The orchestrator judges, merges and runs the full checks.

**All six games are built** (the four beach games first, then both boat-day games): shells, the sandcastle, the three stalls, the
picnic, the ride on the water, litter fishing. Levels 1 and 2 play as designed in each; L3 and L4 play (L4's look-alikes in shells and
the castle's half), with the missing L3/L4 rules listed per game.

## What was built

A new prototype area, `js/beach-proto/` (the school's pattern): `main.js` (the mode, `mode=beach-proto`), `play.js`, `kit.js` (a copy
of `js/school-proto/kit.js` with the classes under `bp-` and Masi as the host; Nani hosts the ride), `art.js` (every placeholder
picture in one table), one file per game. Styles: `css/beach-proto.css` (scene only; the side panel is the kit's and the shared word
tiles', unchanged). New colour tokens `--njg-proto-beach-*` (sand, wet, sea, foam, sky, shell, shell-edge, shell-red, shell-white,
pebble, crab, bucket, bucket-rim, tower, cart, awning-a/b, cone, oil, coconut, coconut-in, coin, purse, cloth, outline, grey, box) in
`css/shared/tokens.css`; no gradients or raw colours in the CSS. Labs: a "Beach prototypes (Masi, 2 Nov)" section in `labs.html` (via
`build/gen_labs.mjs`). Leak: `build/tools/review/leak-configs/beach-proto.json` + stub `leak-games/beach-proto.mjs` (knownFail).
Words: `data/beach-proto.json` (English placeholders, to record), registered in `build/lang/import_modes.mjs`.

**Re-run:** `node build/lang/import_all.mjs` (so `data/lang/*.json` and `data/lang/reports/` changed: after merging with another
builder's import, re-run it rather than hand-merging the generated files) and `node build/tools/ops/recordings.mjs` (the recording
sheet, `docs/language/recording-sheet.md`).

Every game uses the sentence layout: Masi's one instruction at a time, big in her box, its words underlined; the shared word tiles
under her (`F.sentence`, `js/shared/word-tiles.js`), a tile for every kind of thing in the scene, asked or not, lit only while its
word is said; neutral small-and-big pair tiles. Every line comes from the language engine; where it has the Kutchi it shows
(*Wadho shell khanech!*, *Muke nindho nair khape.*, *Hi Nani lai ai.*, *Shoe kadh!*, *Chakli nar!*); every missing word or frame is
grey italic English, "to record".

## The games

### 1. Shells (Masi)
`lab.html?mode=beach-proto&game=shells&level=1` (levels 1-4)

- **Plays:** top-down wet sand, the sea along the top, Masi's bucket at the right. "*Wadho* shell *khanech!*" (bring the big shell).
  Tap a shell: it lifts; right, it hops into the bucket (the sand in it rises) and the row ticks, then a wave sweeps in and lays a
  fresh spread for the next ask. Wrong (or the pebble): it shakes and drops back, her line again (ticks plain). Under one shell a round
  is the crab: lifted, it pops out ("A crab!", to record) and scuttles off sideways. Three asks, then "*Shabash!*".
- **Levels:** L1 size only (2 big, 2 small, a pebble). L2 piles: "*Ba nindha* shells *khanech!*": the asked size in piles of 1, 2
  and 3, the other size in the asked count (a pile hops in whole). L3 colour: "*Laal* shell" or "white shell" (white to record), both
  colours in both sizes. L4 size and colour with a middle-sized look-alike: "*Nindho laal* shell *khanech!*".
- **Tiles:** Shells (the small-and-big pair, the pebble), Numbers at L2 (dots), Colours from L3.
- **Missing (rules):** "not the red ones" (the no ask), Masi counting along as a pile hops in, the scripted first-round crab (here the
  crab is always under a right shell: always a happy meeting).

### 2. The sandcastle (Masi)
`lab.html?mode=beach-proto&game=castle&level=1` (levels 1-4)

- **Plays:** eye level on the sand; a row of spots (all outlined the same; the next one lit: the order is given at L1-L2), the kit
  along the foot: the big and small bucket, the sand heap with the spade, two shells. "*Wadho* bucket *bhar!*". Tap the bucket: it
  hops beside the heap (a wrong bucket shakes, her line again). Tap the heap: each tap flies one spadeful in; the amount bounces the
  moment it's reached and a spadeful after that plops off and doesn't land. Tap the bucket (or the lit spot): it flies over, flips, and
  a tower lifts out as tall as the sand in it. Tipped early: the tower slumps back, the bucket comes home empty, her line again. Then
  "A shell on the *wadho* tower": tap a shell, then the tower. The end: the crab pops out of the tallest tower, "Smile!" and a flash.
- **Levels:** L1 two towers (big and small, either order), always "fill it" (full), one shell. L2 three towers with the amount:
  "Fill the *nindho* bucket: *thorok*." / "...: *aako*." (the frame to record), two shells. L3 as L2. L4 adds half (*adh*).
- **Tiles:** Buckets (the pair, the shell), Amounts from L2 (the same plain heap on each: the amount is only a word).
- **Missing (rules):** Zafar's two-step line ("first the small one, a little, and then the big one, full") is one instruction per
  tower here; L3's positions (in the middle, next to, on top; stacking two high); Nani's photo for the book.

### 3. The three stalls (Masi)
`lab.html?mode=beach-proto&game=stalls&level=1` (levels 1-4)

- **Plays:** three stalls on the sand (corn grill, cassava chips fryer, coconut cart; a stallholder behind each), the picnic basket
  in front. Masi orders: "*Muke* with *limu makai khape.*", "*Muke wadho chips khape.*", "*Muke nindho nair khape.*". Tap the stall
  that sells it: it zooms in (a wrong stall shakes, her line again). Inside: CORN the cob grills by itself, tap the topping she said
  (one she didn't shakes off), then the paper sleeve (before the topping: her line again, the sleeve waits). CHIPS the chips fry,
  tap the basket when golden ("Careful, it's hot!" once, to record), tap the cone she said (both sizes out). COCONUT tap the coconut
  of her size (two of each): the top comes off, a straw goes in. Then PAY: "It's *ba*." (the frame to record); Masi's purse holds
  stacks of 1-3 coins (no digits); tap the stack, then the stallholder's hand: the coins slide over one by one. Zoom out: the stall
  greys (in code; it still works) and the food drops into the basket.
- **Levels:** L1 one order per stall, prices 1-3. L2 "with lemon, without chilli" (*Muke* with *mirchi makai* without *limu khape.*:
  the engine's word order, and both frames to record), prices to 5, and a fourth order goes back to a done stall (the return ask).
  L3, L4 as L2.
- **Tiles:** Food (corn, chips, coconut, the small-and-big pair), Toppings (lemon, chilli). The prices have no tiles: five more
  number tiles did not fit the laptop panel (tried: the pictures collapsed); the coin stacks show the counts.
- **Missing (rules):** bundles of cobs and straw cups (counts), turning the cob, the salt, the queue of beach-goers (who orders
  rotates), owners (L3), other ways of asking, the middle-sized cone and coconut (L4), the watch step for the first pay, the
  speaking turn at the third stall (the purse handover), Nani's slurp.

### 4. The picnic (Masi)
`lab.html?mode=beach-proto&game=picnic&level=1` (levels 1-4)

- **Plays:** the cloth on the sand, Nani and Masi behind it, the child's cushion at the front, Ali's tiffin box at the right edge,
  the basket at the left. Eight places, every one outlined the same (a plate place and a cup place for Nani, Masi and the child, the
  middle, Ali's box). L1: the basket hands out one thing at a time and Masi says "*Hi Nani lai ai.*" (this is for Nani): tap one of
  her places; it hops to the right kind (a cup to her cup place). Someone else's place: it shakes back, her line again. The end:
  "*Shabash!*", the crab runs out of the basket, "*O, kenjo nai!*" (draft).
- **Levels:** L1 four things, owners Nani, Masi, Ali. L2 what and how many: "The *ba* cup is for *Masi*." (the frame to record):
  tap the thing in the basket row (corn, chips, coconut, cup, plate: always all there), then her place, once per thing; the count
  ticks at its number, an extra doesn't land. L3, L4 as L2.
- **Tiles:** People (Nani, Masi, Ali), Food and things from L2.
- **Missing (rules):** L3 positions ("next to her plate", "in the middle", "on Ali's box": the engine's `Of` frame for "Nani's plate"
  comes back as "[of ('s)]", so it needs Mum's line), the L4 pour, everyone eating, the crab snipping the last chip from a plate,
  Ali's lemon drink.

### 5. The ride on the water (Nani; the boat day)
`lab.html?mode=beach-proto&game=ride&level=1` (levels 1-4)

- **Plays:** from the boat: its rail along the foot, the sea running past in three bands. Things float past right to left (a ship
  far; boats, birds, a buoy; fish near). Nani names one: "*Chakli nar!*" (look, a bird), "Boat *nar!*". The asked thing comes into
  view soon after it's asked and never alone (with its other size, or another thing). Tap it as it passes: it glows and the row
  ticks; a wrong one shakes, her line again. If it sails out, it comes round again: nothing lost. One steady speed at L1.
- **Levels:** L1 four named things. L2 sizes ("*Wadho* boat *nar!*", the small one passing beside it); after the first find Nani
  calls "*Jaldi jaldi!*", the boat rushes (the waves speed up, things cross faster) and her sun hat blows off into the sea ("Oho! My
  hat!", to record: the reason to fish), then "slowly" (grey: the engine has *aste thi* only inside lines) and it eases. L3, L4 as L2.
- **Note:** a simple stream of its own, not the shared window ride (`js/day/ride`), which the design reuses; no first-time light (the
  coach's light would hold a thing that sails out of view and block the taps).
- **Missing (rules):** the child's own speaking turn (say "*jaldi!*" after Nani, the pills), two things in one line (L3), counts.

### 6. Litter fishing (Masi; the boat day)
`lab.html?mode=beach-proto&game=fishing&level=1` (levels 1-4)

- **Plays:** a side-on cutaway: the boat's hull and rail at the left (the rod, the reel, the basket on deck), clear water down to
  the sandy bottom, rubbish on the bottom (bottle, shoe, tin can, bag, sock, ball, kettle) and Nani's sun hat; everything lies still alike (the design's gentle bob needs a kit motion: the static check refused a game-own keyframe);
  two fish swim past (never caught). "Shoe *kadh!*" (take out the shoe). Tap the thing: the hook drops straight onto it. Tap the reel
  three times: it rises a third a click, then swings into the basket and the row ticks. A wrong thing: it wobbles, the hook comes back
  empty, her line again. A new thing sinks in after each catch (the field never shrinks). The shoe spits out the crab. The last ask is
  always "*Nani jo* sun hat *kadh!*". Then the boatman nets the rest (to record) and the fish come back.
- **Levels:** L1 one of each kind, three asks then the hat. L2 two of each (big and small; the bottles red and white): "*Wadho*
  shoe *kadh!*", "*Laal* bottle *kadh!*". L3, L4 as L2.
- **Tiles:** Things (every kind in the water and the hat), from L2 Sizes (the pair, red, white).
- **Missing (rules):** counts as clumps (L3), "the bottle, not the red one", the girl's small hat beside Nani's (L4), the kettle's
  fish and the ball's squeak, Nani putting the wet hat on.

## Words missing from the engine (all grey English, to record)

- **Nouns:** shell, pebble, crab, bucket, tower, cone, box (Ali's tiffin), Masi (the name: a draft placeholder), shoe, tin can,
  kettle, fish, boat, buoy, ship; already to record in the lexicon: bottle, bag, sock, ball, sun hat, white. Not used yet but
  entered: spade, sand, straw, coin, sea, wave.
- **Numbers:** one alone (*hakro* comes back grey as a tile word; two to five show).
- **Frames:** "Fill the {x}: {y}.", "A shell on the {x}.", "The {x} is for {y}." (owners with counts), "It's {n}." (the price),
  "with" in an order (`WithFood`: *waari* is in the engine but not joined to an order), "without" (`Without`: *wagar* is confirmed
  but the frame renders grey), "slowly" alone (*aste thi*), "Nani's plate" (`Of` renders "[of ('s)]"). The order word order
  "*Muke* with *limu makai* without *mirchi khape*" is the engine's: Mum to say how she'd ask for it (sheet B).
- **Drafts used:** *thorok* (a little, as "*Thorok!*"), *o, kenjo nai* (oh no, there's no food).
- **Lines:** "I want shells for my castle!", "A crab!", "Let's build a castle. I'll tell you how it goes.", "Smile! Nani takes the
  photo.", "Let's get food for our picnic.", "Careful, it's hot!", "Let's set out the picnic.", "Nani's hat! And look, the sea has
  rubbish in it. Let's fish it out.", "The boatman nets the rest.", "Masi's friend is taking us out on his boat.", "Oho! My hat!".
- **Tile labels:** shells, numbers, colours, buckets, amounts, food, toppings, people, things, sizes, on the sea.

## Art needed (all placeholders now)

Masi (the clinic's auntie face stands in; a character, not a likeness: Zafar, 1 Nov), in modest everyday clothes; the beach (wet sand
top-down, the sea's edge, the wave), shells in three sizes and two colours, the crab's poses (peek, scuttle, on the castle); the
sandcastle scene at eye level, the two buckets (empty, part, full), the heap and spade, towers at three heights; three stalls with
their stallholders (covered, everyday clothes), the grill, the fryer and its basket, cones in two sizes, coconuts (whole, topped,
with a straw), Masi's purse and coin stacks; the picnic cloth, Nani, Masi and the child seated, Ali's tiffin box, the halal picnic
food on plates; the boat's rail, the sea road in three layers (ship, boats, birds, buoy, fish), Nani's sun hat; the fishing cutaway
(hull, rod and reel, the water and bottom), the litter set (bottle, shoe, tin can, bag, sock, ball, kettle). The corn, chips, lemon,
chilli, cup, plate and basket reuse the cook and clinic pictures.

## Checks

`node --check` on every new JS file; a lab shot of every game at 1280x665 (no errors, nothing spills once fixed: the tile pictures
overflowed at first (sized by width now), the stall tiles collapsed with five price tiles (dropped), the fishing things ran off the
right edge (moved in)); a scripted play-through of each game to the end screen (all rows first time). Full `checks.mjs` (run with
`COOK_TEST_PORT=8868`): green apart from one new static finding of mine (a game-own `@keyframes bpBob` for the litter's bob),
removed; `--only static,unit` re-run green (623 pass; 836 findings, all known, 0 new). Leak: 20 configs ok (beach-proto knownFail).
The scene's other small loops (the wave, the fish swimming, the sea bands) passed the motion check as they are.
