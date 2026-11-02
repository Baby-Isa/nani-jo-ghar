# Town and shops prototypes (2 Nov 2026): the town map, serve at the fruit stall, Nani's picky shopping, pay

Builder report (proto brief `build/reports/proto-brief-2026-11-02.md`; designs `build/reports/designs/town-map.md`, `shops.md`,
their critiques, the town section of `games-at-a-glance-2026-11-01.md`; Zafar's mock-up `sources/art/mockup-town-2026-10-31/`).
Rapid: laptop 1280x665 only, a lab shot per game, a scripted play-through of every level built. Not judged; not pushed.

## Where it lives

- `js/town-proto/` (a lab prototype area, as `js/farm/`): `kit.js` (a copy of the farm kit: Nani the guide by default, `F.person`
  swaps the speaker's face in the box, `F.tapped`), `art.js` (pictures and engine words), `main.js` (the mode, `mode=town-proto`),
  `play.js`, and one file per game: `map.js`, `serve.js`, `picky.js`, `pay.js`.
- `css/town-proto.css` (scene only; the side panel is the kit's); placeholder colours as `--njg-proto-*` tokens in
  `css/shared/tokens.css` (copper, brass, steel, bag, grass, closed, shop wall, awning, awning stripes, puff).
- `data/town-proto.json`: the to-record words and lines, imported by `build/lang/import_modes.mjs` (now lists `town-proto`);
  `data/lang/*` and `docs/language/recording-sheet.md` regenerated.
- `assets/town-proto/`: cut from Zafar's mock-up (the map, the eight place pictures, Big Ma's and Ma's faces, the book, bread,
  letter and clinic signs) and the seller's face from `assets/characters/shopkeeper/`.
- `labs.html`: a "Town prototypes (Nani, 2 Nov)" section (`build/gen_labs.mjs`). Leak: `build/tools/review/leak-configs/town-proto.json`
  and the stub `leak-games/town-proto.mjs` (knownFail, as the clinic's).

## The games (each plays L1-L4; every level played through by script: a miss first, then right; rows tick plain then gold)

### 1. Serve at the fruit stall: `lab.html?mode=town-proto&game=serve&level=1`
- **Plays:** behind the counter. The seller's opening line, then each customer walks up and orders a sentence ("Muke ba amba
  khape"): the customer's face takes the box, her line big with its key words underlined; the shared word tiles under it
  (every kind on the stall, asked or not, and the numbers to the level's most, as plain dots). Tap a crate: a fruit hops onto
  the scale (the pan dips, the needle swings, no digits). The count stops at the number (another fruit bounces back; the dial
  rings gold). Tap the pan: the last one back. Tap the customer's bag: the give. Right: into the bag, the row ticks, the next
  customer. Wrong kind or short at the give: everything tips back into the crates, her shake, her order again (plain tick);
  second wrong give: the helper card. A wrong crate's fruit lands too (only the give judges, as the design says).
- **Levels:** L1 two crates (the asked kind and a clearly different one), one or two, 2 customers. L2 three kinds, to five,
  3 customers. L3 four kinds plus one kind in big and small crates ("Muke ba wadha amba khape"; the size pair tile).
  L4 five kinds with onion and potato side by side, to six.
- **Missing:** the customers' own funny misses (sneeze, juggle, the mango on the cap: a shared shake stands in); the customer
  paying the seller and his count-along (pay's watch step); the gift (take one for Ali); two kinds in one order at L2 and
  "half a papaya", the scoop, two customers waiting at L4 (not built: L2-L4 here add kinds, counts and the size instead).

### 2. Nani's picky shopping: `lab.html?mode=town-proto&game=picky&level=1`
- **Plays:** at the general store. Nani's line ("Wadho ginech": buy the big one) in her box; tiles: the size pair (one neutral
  picture, small beside big) and every thing on the counter. Tap a thing: it lifts (the big one wobbles, the small one bounces);
  tap another to swap, the same one to put it down; a lift is never a miss. Tap Nani's basket: the give. Nothing in hand: "Kyo?".
  Right: into the basket, the row ticks, the shopkeeper restocks the pair in a puff, sides shuffled (the decoy stays).
  Wrong: it shakes and goes back, her line again (plain tick); second wrong give: the helper card. Both states asked at even odds.
- **Levels:** L1 one pair of pots, no decoy (the whole recorded-shape lines "Wadho ginech" / "Nindho ginech", drafts).
  L2 pots and cups in both states and a glass as decoy ("Muke wadho cup khape"). L3 three of one thing (big, middle, small):
  "Wadho ma wadho" / "Nindho ma nindho" (the middle is never asked). L4 pots, cups and onions in both states and the glass.
- **Missing:** Nani's monocle and stagger reactions (poses to draw; a shake stands in); "not the big one"; your turn (ordering
  for Nani, speaking); L4's "two small onions" (a count with the size) is not built.

### 3. Pay: `lab.html?mode=town-proto&game=pay&level=1`
- **Plays:** a price is a number, not a sentence, so chai's order card (one card per price, the seller's face). He says it
  ("Trae paisa, please"); its card pops and turns into its row. L1: Nani's purse holds ready-made copper stacks of one to five;
  tap one, it slides onto the counter (another swaps it; the counter sends it back); the stack picked decides (no gold ring:
  it would give the answer). L2+: two heaps, copper (one) and brass (ten); one tap, one coin into two rows (brass above copper,
  a gap after five); a coin past the price doesn't land (the heap shakes); at the price the rows ring gold; tap the rows: the
  last coin back. Tap his open hand: the give. Right: the coins fly to his tin, "Barabar!", the row ticks. Short: his patient
  hand and the price again (nothing marked). Wrong stack at L1: the coins go back, the price again (plain tick).
- **Levels:** L1 one to five (stacks), L2 six to twenty, L3 the tens to a hundred, L4 21-99 (two prices).
- **Missing:** the ten-coin trick (waits on Mum's clip of ten, *do* is a draft); his count-along and count-back aloud (the number
  clips); Nani's "Kitla?".

### 4. The town map: `lab.html?mode=town-proto&game=map&level=1`
- **Plays:** Zafar's mock-up map across the top (its eight places), the face strip below, Hannah Mami first (Zafar, 1 Nov).
  Tap a face (a gold ring), then a place: the person walks there (their face in a small circle), goes in, and comes back carrying
  its thing; the row ticks at the right tap (instant). A place with nobody lifted: the faces bounce ("who?"). Wrong place or
  wrong person: the place shakes, the line again (plain tick). A closed place (dimmed) does nothing. Faces out on an errand stay
  tappable (critique 2b). Never the same place twice running. Tiles: People (L2+) and the open Places, or the Things at L3.
- **Levels:** L1 three places (market, park, bakery), three faces; the person says it: "I want to go to the bakery" (their face
  is lifted for them and takes the box; only the place decides). L2 five places, four faces (+ Ma); Nani: "Nana wants to go to
  the clinic". L3 all eight open; "Big Ma wants book" (book, bread, medicine, letter, mangoes). L4 the needs: "Nana feels poorly"
  (clinic), "Ma wants to play" (park), "Big Ma wants to read" (library), "Hannah Mami. Panke randhnu khapdo." (market); six
  places open, the bakery and the fire station answer none.
- **Missing:** the bus and the bus stop, Nani's bag at the end and the mango slice; each place's own funny refusal; the walkers'
  "I went to the library!" (needs the speech queue); "we need to cook" waits on Mum (does an open bakery also answer it?).

## Shared rules kept, and where I departed (to look at)

1. **Serve and pay tick the row at the give, not at the count.** The count still stops at the number and shows it (the dial or the
   coin rows ring gold); the give is the hand-over (shops.md rule 2: "the step moves on only when the child taps the person").
   Picky and the map tick at the right give or tap.
2. **The first-time light on the bag is a plain glow from the first fruit until the give,** not the kit's spotlight: the
   spotlight blocks every other tap, so a child couldn't add a second mango. The kit's spotlight still lights the first crate,
   thing, coins or place.
3. **Speakers:** the box shows whoever speaks (the seller's opener, each customer, Nani; the person at map L1). One face per
   person on screen except the stall's customer, who is both in the box and at the counter (as chai's family are in the
   card and the scene); to look at.
4. **The side panel is crowded on the map at L2-L4** (four people and five or six places, or five things: 9-10 tiles): the tile
   pictures shrink to slivers on the laptop, worse with the helper card open. Options for Zafar: the faces in the strip stand
   for the People tiles, or the phone's two scrolling strips on the laptop too.

## Kutchi: every word and line still to record (grey italic in the games)

- **Places:** market (*bajaar* is only inside the draft *bajaar mai vaan*), park, bakery, library, clinic, post office, school,
  fire station (Mum: which are Kutchi and which English loans).
- **People:** Hannah Mami (a name; Mum to say it).
- **Things:** book, bread (the family's word for a loaf), letter; "fruits" (the group label); the plural of tomato (*tameta* is in
  a recorded line but the engine has no plural form: "tomatoes" shows grey); "one" said alone (*hakro* works inside a line,
  alone the engine falls back to English).
- **Money:** the price's unit (*paisa*, shilling ...?); every number above ten (shown as grey digits: a reader's win, so pay's
  L2-L4 are lab-only until recorded); ten (*do* is a draft).
- **Frames:** "I want to go to the {place}", "{who} wants to go to the {place}", "{who} wants {thing}", "{who} feels poorly",
  "{who} wants to play", "{who} wants to read", "{price}, please".
- **Lines:** the seller's "Help me at the stall: give each one what they ask for", Nani's "Pick the one I want, then give it to me",
  "Count out the coins, then give them to him", "Send each one where they want to go".
- **Group labels (grey English):** Big and small, Things, People, Places.
- **Engine Kutchi that is still a draft (not Mum's):** *kelo, bataato, santra*, five to ten (*panj ... do*), *wadho ginech /
  nindho ginech* (*ginech*'s meaning to confirm), *kyo*, *panke randhnu khapdo*.

## Art needs (placeholders now)

- **Town map:** the mock-up itself (its baked-in walking grandmother and dotted path should go); the eight places in two states
  (open, closed); four walkers (now a face in a circle); carried things (now the mock-up's own signs; medicine is the clinic's
  heart sign); the bus.
- **Faces:** Big Ma and Ma cut from the mock-up; Hannah Mami from the farm placeholder; the seller cut from the shopkeeper art.
- **Serve:** the stall seen from behind the counter; customers waist up (now a face circle on a plain body); the scale (pan,
  dial, no digits); the bag; crates.
- **Picky:** the general store; Nani's basket, monocle and stagger poses; a cup (the clinic's steel cup stands in).
- **Pay:** the seller's open hand (a child's hand stands in); his tin; Nani's purse; the coins (CSS circles now).

## Checks

- `node --check` on every JS file; one lab shot per game at 1280x665 (looked at; fixed: crates over the scale, the map hotspots'
  offset, stretched place tiles, the bag's light blocking taps); a scripted play-through per level built (all rows tick).
- `node build/tools/review/checks.mjs`: all green (unit 623 pass, words, static 0 new after my two gradients moved to tokens,
  leak, bump, specs, docs, recordings after regenerating the sheet, fixlist, size, load 29/29). The whole run passes 300 s here,
  so I ran it in groups. `node build/gen_labs.mjs --check`: up to date.
- Leak: no bot yet (knownFail). Known risks: "tap till it stops" wins serve's count and pay's price from L2 (the kind, the size,
  the stack at L1 and the place still decide); the place words are English placeholders, so English wins the map's L1-L2 until
  Mum records them.
