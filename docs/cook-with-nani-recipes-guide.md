# Cook with Nani: how to add ingredients, recipes, levels and stations

**Updated:** 24 Sept 2026. For whoever adds the next dishes (Claude or a person). Most additions are **data plus art**: no code.

Never invent Kutchi. A new word goes in with `"kutchi": null` and its English, and shows as a grey English placeholder until the family gives the Kutchi.

## 1. Where things live

| What | Where |
|---|---|
| Words, lines, grammar, customers, recipes, difficulty levels, upgrades | `data/cook.json` |
| A combined station's own data (its name, goal and levels) | `data/stations/<id>.json` |
| One mechanic (a verb: pour, roll, tawa…) | `js/cook/mechanics/<id>.js` |
| One combined station (Maani line, Chai tray…) | `js/cook/stations/<id>.js` |
| Zones, levels, the combined-station host, the Station lab list | `js/cook/zone.js` |
| The recipe engine (slots, the spoken order, running the stations) | `js/cook/recipes.js` |
| Painted props | `assets/cook/props/<name>.webp` |
| Recorded words | `assets/audio/word/<id>.mp3` |

The **Station lab** (title screen) runs every mechanic, every combined station and every recipe ("Whole recipes") on its own, at level 1, 2 or 3. It's the quickest way to try anything new.

## 2. Add an ingredient

Add an entry to `words` in `data/cook.json`:

```json
"ph-mayai": {
  "kutchi": null,
  "english": "eggs",
  "heap": {"kind": "balls", "color": "#f6ead2"},
  "layer": {"kind": "liquid", "color": "#f3c84b"},
  "bowl": "ceramic",
  "src": "placeholder"
}
```

- **Id:** `ph-` for a placeholder; the family's words keep their content-master ids (`veg-02`, `spi-10`).
- **Art states** (all optional; anything missing is drawn from `heap`):
  - `image`: a painted prop, `assets/cook/props/<image>.webp`. It loads by itself.
  - `heap`: the ingredient heaped in a bowl (the pantry, the counter). Kinds: `grains`, `crystals`, `powder`, `balls`, `cubes`, `pieces`, `sticks`, `pods`.
  - `piece`: one piece (on a skewer, thrown in the air when chopping).
  - `layer`: a spoonful in a bowl or on pastry (`"kind": "liquid"` for sauces, eggs).
- **Audio:** a family recording goes to `assets/audio/word/<id>.mp3` and its id into `data/audio-manifest.json` (`word`). Until then `build/build_cook_tts.py` makes a placeholder voice; it needs a Gujarati spelling for any new Kutchi token (its `GU` table).
- **Look-alikes:** add the word to `lookalikes` (what it's easily confused with) so the pantry and "pass me" offer a real choice. `pantry_decoys` lists spare pantry items.

## 3. Add a customer taste

Tastes are per customer, per recipe, and each one fills a **slot** of that recipe (section 4):

```json
"ma": {"tastes": {"chaat": {"no": ["veg-02"]}, "samosa": {"filling": "veg-01", "no": ["veg-12"]}}}
```

A slot reads its taste with `"taste": "<key>"`. `"tasteChance"` says how often the customer asks for their usual (default: always; `0.5` means half the time; `0` only when they order "the usual"). A recipe can share another recipe's tastes with `"tastes": "chai"`. Update the customer's `likes` line too (the recipe book shows it).

## 4. Add a recipe

A recipe is an entry in `recipes` with five parts. Every choice the player makes must come from something said.

**`slots`: what changes from order to order.**

| Slot | Example | Gives |
|---|---|---|
| a number | `{"int": [1, 3], "zero": 0.15}` | 0-3 (0 15% of the time) |
| yes/no | `{"chance": 0.75}` | true or false |
| one of | `{"pick": [null, "spi-10", "veg-14"]}` | one item, or nothing |
| a list in order | `{"type": "items", "first": ["ph-chana"], "from": "$toppings", "take": [2, 3], "exclude": "no", "order": "sequence"}` | e.g. `["ph-chana", "ph-dahi", "ph-sev"]` |
| a list in any order | the same with `"order": "any"` | the fillings of a samosa |
| "no X" | `{"type": "no", "else": {"chance": 0.5, "from": ["veg-12"]}}` | the customer's dislikes, else maybe one |
| per person | `{"type": "people", "count": 2, "tastes": "chai", "each": {"khun": {"int": [1, 3], "taste": "khun"}}}` | `[{"who": "nana", "khun": 3}, {"who": "ma", "khun": 1}]` |
| how many of each kind | `{"type": "tally", "kinds": ["ph-meat", "ph-pepper"], "total": {"int": [2, 3]}, "min": {"ph-meat": 1}}` | `{"ph-meat": 2, "ph-pepper": 1}` |

Any slot can take `"taste"`, and `"prefer": "weak"` picks the words the player knows least. `"$name"` refers to an earlier slot or to a list in the recipe's `lists`.

**`say`: the order as spoken**, one entry per line. Frames are roles (`"order"` starts a dish: "Muke … khape" or "Ne …"; `"and"`, `"no"`, `"only"`); the words come from `lines` and the word order from `grammar`.

```json
{"frame": "order", "x": [{"n": "$cups", "of": "cook-chai", "one": false}]},
{"if": "!dudh", "frame": "no", "x": ["cook-dudh"]},
{"list": "$seq"},
{"list": ["$base", "$toppings"]},
{"forEach": "$no", "frame": "no", "x": ["$it"]},
{"forEach": "$cups", "for": "$it.who", "say": [{"frame": "and", "x": [{"n": "$it.khun", "of": "cook-khun"}]}]},
{"tally": "$skewers", "frame": "and"}
```

`{"n": …, "of": …}` is a number and a noun in the language's order; `"one": false` leaves out "one" ("chai", not "one chai"). Each spoken thing also becomes a row of the **order ladder** (`R.ladder(order)`): its dot (a step of the sequence), its group (`"seq"`, or `"any"`: items that share a dot), its quantity, who it's for, and "no" rows (no dot). The same item twice running in a list is one row with a count ("be ghos": one dot per item type, never per unit). These rows are the one source of truth for an order: `js/cook/order.js` (`Cook.Order.ladder(d, i)`) arranges them for the mission card and `Cook.Order.speech` says them, with the audit's leak rules: rows that can go in any order are shuffled every time, "no X" rows are sprinkled among the others, and the next step of a list is said with *ne poi* ("and then"). `R.<id>.lines(d, i)` is the same order unshuffled, for tools and tests. `{"list": "$tadka", "when": "tadka"}` puts a part on the ladder that isn't said in the order: it appears when that station starts (Nani gives the tadka order at the pan).

**`need`** (what the pantry step fetches) is a list; `{"if": "dudh", "then": "cook-dudh"}` adds an item only sometimes. **`steps`** (the chips on the mission card) must be the **same for every order of a dish** (all the steps it could have: chai always shows Milk and Sugar), so the chips never answer the order; a step that doesn't happen is simply skipped.

**`run`: the stations, in order.** Each step is `{"do": <mechanic or station>, …settings}`. Settings use `"$slot"` for slot values and `"@name"` for things made earlier in the recipe. Extra keys: `"if"`, `"step"` (move the mission card on), `"repeat": "$count"` (with `$i`), `"forEach"` (with `$it`), `"as"` (keep the result, e.g. how many were rolled), `"level"`.

| `do` | What it does |
|---|---|
| any mechanic: `fetch`, `knead`, `roll`, `tawa`, `chop`, `tadka`, `stir`, `assemble`, `fry`, `thread`, `grill`… | a whole station |
| `pour`, `add`, `boil`, `count` | a step inside the scene set up by `view` |
| any combined station, `fillFold` | a whole station |
| `view` | a scene: `{"station": "pour", "view": "hob"}` (views: `hob`, `wood`, `marble`, `pantry`) |
| `vessel` | a pan, pot, kadai, cup or bowl: `{"id": "pan", "kind": "pan", "at": ["burner-left", 0, -30], "scale": 1.35}` |
| `counter` | a row of ingredient bowls: `{"id": "shelf", "items": ["$basket", "cook-khun"]}` (then `@shelf.cook-khun`) |
| `interrupt` | Nani may ask "pass me…" here |
| `serve` | what goes on the table: `{"key": "…", "count": "$n", "art": "…"}` |

Positions are on the 1600×900 design (`"strip"` is the worktop row at the bottom; `burner-left` and `burner-right` are the hob). Look at `chai` in `data/cook.json` for a full scene, and `maani` for the shortest recipe.

To put the dish in the story, add it to a day in `days` (`{"who": "nana", "dishes": ["chips-mayai"], "level": 2}`). Free cooking offers every dish the player has been taught.

## 5. Add a difficulty level

Every mechanic's settings are in `mechanics.<id>.levels`. Level 1 is the game as it is; each later level lists **only what changes**:

```json
"tawa": {"levels": [
  {"band": [0.6, 0.82], "rate": 0.24, "rate2": 0.26, "speedUp": 0.08, "burntScore": 40, "tawas": 1, "passMeAfterMs": 1500},
  {"tawas": 2, "rate": 0.26, "rate2": 0.28},
  {"tawas": 2, "band": [0.64, 0.8], "rate": 0.3, "rate2": 0.32}
]}
```

- Timing windows (`band`) are parts of the ring (0 to 1); `rate` is how many rings fill per second.
- `profiles` are settings for one use of a mechanic (pour has `water`, `milk`, `cup`).
- Upgrades change settings too: `upgrades[].knobs`, e.g. the heavy tawa is `{"tawa": {"band": [0.5, 0.9], "special": true}}`.
- Who picks the level: a day's order (`"level": 2`), a recipe (`"level"`, or `"levels": {"tawa": 2}` for one mechanic), a run step (`"level"`), or the Station lab's Level buttons.
- Each mechanic file's top comment lists its settings.

## 6. Add a combined station (or a new mechanic)

A combined station is 2-3 **zones** on one screen, each running a mechanic, with items routed between them. `js/cook/stations/roll-tawa.js` is the small working example:

```js
Cook.Mech.combined("roll-tawa", {
  station: "roll-tawa", view: "hob", dataFile: "data/stations/roll-tawa.json",
  zones: [
    { id: "roll", mech: "roll", region: [0, 0, 800, 900], backdrop: "bg:wood", out: "rolled",
      params: (p) => ({ count: p.count }) },
    { id: "tawa", mech: "tawa", region: [800, 0, 800, 900], in: "rolled" },
  ],
});
Cook.Mech.lab("roll-tawa", { name: "Roll → Tawa", verb: "Combined", async run(L) { … } });
```

- **Zones:** `region` is the rectangle on screen; the mechanic's own layout is fitted into it (`footprint` says which part of the full-screen design to fit; the mechanic's params can move its parts). `backdrop` gives the zone its own worktop.
- **Routing:** a zone with `out: "x"` sends each finished item (roll sends each maani, thread each skewer); a zone with `in: "x"` takes them as they come and stops when the senders are done. Items carry their sprite, so they fly across.
- **Several at once:** the tawa runs `tawas` tawas and the grill `skewers` skewers, each with its own ring and timer; a mechanic makes one child zone per instance with `z.child()`.
- **Stars:** every zone reports into the same order, so there is one set of ear, hand and lightning stars; the host also keeps each zone's scores (`host.scores`).
- **Custom logic:** give the definition `run: async (host, params) => …` to drive the zones yourself (for example, "roll them all first" versus a production line).
- **Files:** the Maani line, Chai tray and Mishkaki grill already have their files in `js/cook/stations/`, loaded by `cook.html`. Give each its own `data/stations/<id>.json` so parallel work never touches the same file.

**A new mechanic** is one file in `js/cook/mechanics/` (add its `<script>` to `cook.html`): `Cook.Mech.define(id, {station, view, footprint, run(z, params, k)})` plus `Cook.Mech.lab(…)`. Inside `run`:
- draw with `z.X(x)`, `z.Y(y)`, `z.L(size)` (design coords, so it works full screen and in a zone);
- listen with `z.on("pointermove", …)` and animate with `z.tick(…)` (never `S.input.on` or one `S.tick`);
- say what the player should do next with `z.expect({…})` (the test plays from it) and pass `io: z.io` to `S.step`, `S.pour` and `S.ring`;
- score with `z.listen(ok, why)` (ear) and `z.skill(score, what)` (hand); send items with `z.emit(item)`, take them with `z.take()`;
- read every tuning number from `k` (its levels in `data/cook.json`), never a constant.

## 7. Language

Code never contains Kutchi or its grammar. Sentence frames are `lines` ("Muke {x} khape.", "Ne {x}."), and `grammar` says how they combine: number words (`numbers`), where the number goes (`count`: `"{n} {x}"`), how a list is said (`list`), which frame starts an order (`order`), how "no X" is said (`no`), and the "and then" linker (`then` → the draft line *Ne poi {x}.*, Mum to confirm; `then_word` is its word, `lnk-nepoi`: from word stage 3 the ladder stops drawing the sequence and only the spoken *ne poi* tells you the order). Another language (Gujarati first) swaps `words`, `lines` and `grammar`.

## 8. Worked example: chips mayai (fry, pour, flip)

The whole recipe is `data/examples/chips-mayai.json`; the game doesn't load it, but `python3 build/test_cook.py --example` plays it in the Station lab, so it stays working.

1. **Words:** `ph-mayai` (eggs: a heap for the bowl, a liquid layer) and `ph-chipsmayai` (the dish), both English placeholders. Chips (`ph-chips`) and chilli (`veg-12`) already exist.
2. **Slots:** `eggs` `{"int": [1, 3]}` and `chilli` `{"chance": 0.5}`.
3. **Say:** "I need chips mayai. And 2 eggs." plus "no chilli" when there's no chilli.
4. **Run:**
   - `fetch` the eggs (and the chilli);
   - `fry` the chips (`"kind": "chips"`, count 1);
   - a `view` on the hob with a bowl, and a `counter` of eggs, milk, chilli and salt;
   - `count` the eggs into the bowl (the Kutchi: how many);
   - `add` the chilli (only if they didn't say "no chilli");
   - `pour` the bowl into the pan (`"source": "@bowl"`);
   - `tawa` to flip it (`"art"` for the omelette, `"doneWord": "golden"`);
   - `serve`.
5. **Art:** until it's painted, the omelette uses the drawn egg layer (`"layer:ph-mayai"`). Painted art is `assets/cook/props/omelette-raw.webp` (and `-half`, `-done`), named in `art.props` in `data/cook.json` and in the recipe's `"art"`.
6. **Make it real:** copy the two words into `words` and the recipe into `recipes` as `chips-mayai`, add a taste or two ("Bilal: no chilli"), and put it in a day.

## 9. Check it

- `python3 build/test_cook.py --lab`: every station and the combined station (`--level 2` for level 2; `--zoned` runs each mechanic inside a smaller zone).
- `python3 build/test_cook.py --orders`: the slot model and the order ladder.
- `python3 build/test_cook.py --example`: the worked example.
- `python3 build/test_cook.py --viewport laptop --days 7 --canvas`: the whole story (`--canvas` uses Phaser's canvas renderer: software WebGL in headless Chromium is too slow for a full run).
- `COOK_TEST_PORT=8960` runs a second test alongside the first.
