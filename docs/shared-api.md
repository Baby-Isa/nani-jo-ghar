# Shared API (`js/shared/`)

*The contract between the foundation and the mode builds, 25 Sept 2026. Every call, its arguments and what it returns, the data formats, and how each mode swaps its stub for the real module. The foundation session owns `js/shared/`, `data/relations.json` and `data/shared/`; modes read them and never edit them. Ask for a change by writing it in your build log; don't fork a copy.*

## 0. Loading

Every module is one plain file with no dependencies. As a `<script>` it sets a global and also hangs itself on `window.Shared`; in Node, `require()` it (the leak bots and tests do this).

| File | Global | `Shared.` | Data it reads |
|---|---|---|---|
| `js/shared/speech.js` | `Speech` | `speech` | family MP3s via the audio manifest |
| `js/shared/rel.js` | `Rel` | `rel` | `data/relations.json` |
| `js/shared/whichone.js` | `WhichOne` | `whichone` | none (a mode passes its look-alike groups) |
| `js/shared/stars.js` | `Stars` | `stars` | `data/shared/stars.json` |
| `js/shared/say.js` | `Say` | `say` | uses `Speech`, and `Stars` if loaded |
| `js/shared/overlay.js` | `Overlay` | `overlay` | `data/shared/overlays.json` |

```html
<script src="js/shared/speech.js"></script>
<script src="js/shared/rel.js"></script>
<script src="js/shared/whichone.js"></script>
<script src="js/shared/stars.js"></script>
<script src="js/shared/say.js"></script>
<script src="js/shared/overlay.js"></script>
<script>
  await Promise.all([Rel.loadJSON(), Stars.loadJSON(), Overlay.loadJSON()]); // default URLs are relative to the page
</script>
```

In Node, use `Rel.load(require("../data/relations.json"))` and do the same for the others. A module that hasn't loaded its data still works, but only on built-in defaults: Rel knows the common relations, and Stars uses Cook's rule with `minTested` 2.

Conventions:
- **Coordinates** are design pixels on the 1600×900 stage. A panning scene sets `stage: [w, 900]`.
- **Rects** are `[x0, y0, x1, y1]`. `box: [x, y, w, h]` is accepted and converted.
- **Word ids** are Cook's (`cook-chai`, `fru-01`, `ph-…`). Nothing shared invents Kutchi: every relation word is a placeholder with `kutchi: null`.
- **Randomness** is always passed in (`rng`), so generators and bots are seeded.

---

## 1. Relations layer: `data/relations.json`, `js/shared/rel.js`, the scene schema

### 1.1 `data/relations.json`
```json
{ "relations": { "in-front": { "word": "ph-rel-front", "kind": "anchor", "cams": ["H","E"], "order": 5, "derived": "front", "inverse": "behind" }, ... },
  "aliases":   { "next-left": "left-of", "in-front-of": "in-front", ... },
  "grammar":   { "place": "{x} {anchor} {rel}", "unary": "{x} {rel}", "between": "{x} {anchor} {anchor2} {rel}" },
  "words":     { "ph-rel-front": { "kutchi": null, "english": "in front of" }, ... } }
```

| Relation ids | `kind` |
|---|---|
| `in`, `on`, `under`, `behind`, `next-to`, `left-of`, `right-of`, `in-front`, `on-top` | `anchor` (needs one anchor) |
| `between` | `anchor2` (needs two anchors) |
| `middle`, `corner`, `top-row`, `bottom-row`, `first`, `last` | `unary` (no anchor) |
| `stay` | `leave` (Tidy up's "leave it where it is") |

- **`derived`** says how the relation is read off the spot neighbour graph when the anchor is a placed item rather than scenery: `adjacent`, `left`, `right`, `front`, `back`, `between` or `stack`.
- **`frame: "player"`** means left and right are the player's, as seen on screen.
- **`order`** is the acquisition order: in and on first, then under, behind, next to, in front of, between.
- **Aliases** cover every other spelling the designs used (Find it's `next-left`/`next-right`, Tidy up's `ph-rel-*` ids).
- **`Rel.mergeWords(Cook.data.words)`** adds the placeholder words to the word table. It never overwrites an existing word, so a family word later wins.

### 1.2 The scene schema (`data/scenes/<scene>.json` and sidecars)
All keys are optional except `anchors` and `spots` where a mode uses relations. Find it's live `data/find.json` `scenes.bazaar` is valid as it stands (it seeded this schema).

```json
{ "id": "sitting-room", "camera": "H", "stage": [1600, 900],
  "anchors": {                                   // object keyed by id, or an array of {id, ...}
    "crate-left": { "word": "ph-crate", "en": "crate", "rect": [172, 482, 462, 598] },
    "seat-1":     { "kind": "person-seat", "word": null, "rect": [...], "who": "nana" } },
  "spots": [                                     // array or object keyed by id
    { "id": "cl-1", "anchor": "crate-left", "rel": "in", "x": 222, "baseline": 524,
      "also": [["next-to", "scale"]], "size": 90 },                     // Find it's form
    { "id": "s12", "x": 610, "y": 540, "surface": "cloth", "cap": 1,     // Tidy up's form
      "tags": [{ "rel": "in-front", "anchor": "seat-2" }, { "rel": "middle" }],
      "nbr": { "left": "s11", "right": "s13", "front": "s22", "back": null, "below": null } } ],
  "occluders": [ { "id": "counter", "rect": [0, 555, 1600, 900], "z": 5 }, { "id": "pot", "poly": [[x, y], ...] } ],
  "safe": [80, 45, 1520, 855],                   // or {"margin": 0.05}; default: the outer 5% is off limits
  "surfaces": [ { "id": "cloth", "rect": [...], "material": "cloth" } ],
  "groups": { "pots": ["ph-pot"] },              // "@pots" in a rule
  "stacks": [ { "spot": "s30", "max": 4 } ],     // capacity > 1
  "openables": [...], "monsoon": {...}           // anything else passes through untouched
}
```

- **Spot tags.** Every spot ends up with `tags: [{rel, anchor?, anchor2?}]`, built from `rel` + `anchor`, `also` and `tags`, in that order. `y` defaults to `baseline`, and `cap` defaults to 1.
- **Anchors** are scenery, never targets. `who` seats a person; a board can reseat people with `state.who`.
- **Rules for authors, checked by `Rel.validate`:**
  - rects run `x1 > x0` and `y1 > y0`;
  - relations and anchors exist;
  - `nbr` is symmetric (`left` ↔ `right`, `front` ↔ `back`);
  - no spot sits in the safe margin unless it sets `edgeOk: true`.
- **Visible share.** The "≥ 40% of an item shows" rule is `Rel.visibleFraction(box, scene, z)`.
- **Sidecars.** A mode's extra keys live in its own sidecar (`kitchen-tidy.json`, `kitchen-monsoon.json`) until phase B merges them. At runtime `Rel.scene(base, sidecar1, …)` merges them:
  - anchors and spots merge by id (a sidecar spot can add `nbr` or tags to a base spot);
  - `occluders` concatenate;
  - other keys are replaced by the later file.

### 1.3 `js/shared/rel.js`

| Call | Returns |
|---|---|
| `Rel.load(json)` / `await Rel.loadJSON(url = "data/relations.json")` | `Rel` |
| `Rel.id(r)` | the canonical relation id (aliases resolved) |
| `Rel.info(r)` | `{word, kind, derived, frame, cams, order}` |
| `Rel.scene(base, ...sidecars)` | a normalised scene: `anchors` and `spots` keyed by id, spots with `tags`, `nbr` and `cap` (idempotent) |
| `Rel.validate(scene)` | `["spot x: unknown anchor \"y\"", ...]` (empty = fine) |
| `Rel.at(spotId, rel, anchor, state, scene, anchor2?, opts?)` | the primitive: does that spot stand in `rel` to `anchor`? (by a tag; else, for a placed-item anchor, by the neighbour graph) |
| `Rel.holds(item, where, scene?, {byWord})` | **Find form**: does a placed item (`item.rel = [[relation, of], ...]`) match `where = [rel, anchor]` or `{rel, anchor}`? Anchors match by **word** (both crates are "the crate"), unless `byWord: false` |
| `Rel.options(scene, row)` | **Find form**: the scene's placed items (`scene.items`) matching `row.noun` + `row.where`; with no items, the spot ids tagged that way |
| `Rel.holds(state, rule, scene, {ranks, byWord})` | **Board form** (Tidy up): `state = {placements: {inst: spotId \| "tray"}, items?: {inst: {noun, colour, size, kind...}}, start?, who?, groups?}` → true / false |
| `Rel.options(state, rule, scene)` | **Board form**: free spot ids (capacity respected; the rule's own item may move) where the rule's item would satisfy it; for a `not` rule, where it wouldn't. This is what Ali picks among, and what the "≥ 3 options" check counts |
| `Rel.check(state, rules, scene)` | `[{i, ok}]` plus `.firstWrong` (the row Nani recasts) and `.allOk` |
| `Rel.solve(state, rules, scene, {limit = 1, maxNodes = 200000, ranks})` | up to `limit` placements maps satisfying every rule; `.exhausted`, `.nodes` |
| `Rel.phrase(rule, scene, x?)` | word ids in the grammar's order, e.g. `["ph-cup", "ph-door", "ph-rel-nextto"]`, for `Cook.Lang.phrase` |
| `Rel.visibleFraction(box, scene, z?)` | 0..1 of the box not covered by occluders above `z` |
| `Rel.inSafe(x, y, scene)` / `Rel.safeRect(scene)` | the safe area |

Two notes on the board form:
- An instance's noun is `items[inst].noun`, else the part of its id before `#` (`"ph-cup#2"`).
- Ranks for `order` and `compare` come from `opts.ranks`, e.g. `{size: ["small", "mid", "big"]}`; numeric values need none.

**Rule types (board form, from Tidy up 8.1):**

| Type | Shape | Holds when |
|---|---|---|
| place | `{item, attrs?, rel, anchor}` | some matching instance is placed where `rel` to `anchor` holds. `anchor` is a scene anchor id, a word id, `"@person"`, or a placed item's word (derived) |
| unary | `{item, rel: "middle"}` | some matching instance is on a spot tagged so |
| class | `{all: {kind?, colour?...}, rel, anchor}` | every matching instance does (and there is at least one) |
| count | `{n, item, rel, anchor}` | exactly `n` matching instances do (over-collecting is wrong) |
| leave | `{item, rel: "stay"}` | every matching instance is where `state.start` had it |
| not | `{not: rule}` | **no** matching instance satisfies the inner relation ("nothing next to the door") |
| order | `{items: "@pots", by: "size", dir: "desc", along: "shelf-2", from: "door"}` | all are placed along `along` (spot anchor, surface or tag), and sorted by `by` starting from the end nearest `from` |
| compare | `{item, rel, anchor: {most \| least: attr, item?}}` | as place, with the anchor being the placed instance with the extreme value |

Tidy up's five solver checks, built on these calls:
- **Solvable**: `Rel.solve(...).length ≥ 1`.
- **≥ 3 options per row**: `Rel.options(state, rule, scene).length ≥ 3`, with the other rows' items placed by a solution.
- **Convention fails**: `!Rel.check(conventionState, rules, scene).allOk`.
- **No forced row**: drop one rule, then `Rel.solve(..., {limit: 2})` must leave its item unpinned.
- **Flat priors**: the harness counts over 1,000 boards.

The generator stays in `Tidy.Rules.make`.

### 1.4 Tidy up's dialect: `Rel.Tidy`
Tidy up compiled its own board shape before this module existed. `Rel.Tidy` is that API exactly (`item`, `matches`, `where`, `at(state, spot)`, `free`, `neighbours`, `tagged`, `satisfies`, `holds`, `options`), tested for agreement with Tidy up's stub on 300 random boards. Its shapes are:
- a board `{spots, byId}`;
- items `{word, attrs, kind}`;
- rows with an explicit `type`;
- `not: {rule}`;
- `order.along` as a list of spot ids;
- a placed-item anchor `{item, attrs}`.

**One real difference, left open for phase B:** in Tidy up's dialect "next to" a placed item means *any* neighbour (left, right, front, back, `adj`). In the board form above it means left or right only. Pick one when the words arrive: it depends on what the Kutchi phrase covers.

---

## 2. Which-one chooser: `js/shared/whichone.js`

An item is `{id, noun, colour?, size?, ...}` or `{id, noun, attrs: {...}}`; `kind` is accepted for `noun`. A row is `{noun, attrs: {colour: "red"}, count?}`, or flat `{noun, colour}`.

| Call | Returns |
|---|---|
| `WhichOne.rng(seed)` | seeded `() => [0, 1)` (mulberry32) |
| `WhichOne.shuffle(arr, rng)` / `WhichOne.val(item, dim)` / `WhichOne.asked(row)` / `WhichOne.matches(item, row)` | helpers |
| `WhichOne.checkDecoys(items, row, opts)` | `{ok, problems}`. The **decoy rule**: the row is answered by exactly `count` (default 1); the asked noun appears in ≥ `minValues` values of each asked dim (default 3, size 2); each asked value is on ≥ `minNouns` (2) nouns; `balanced`: every value of each asked dim ±`tolerance` (1), over `opts.palette[dim]` if given |
| `WhichOne.build(row, {values: {dim: palette}, nouns, total, rng, count, ...})` | items (ids `w1…`) that pass the rule; unasked dims in `values` are filled balanced so they distract; throws if impossible |
| `WhichOne.group(id, groups)` / `WhichOne.candidates(id, groups, {n, rng, exclude})` / `WhichOne.checkGroups(groups)` | the look-alike group; the candidates to show (the whole group or n of it, always including id, shuffled); problems (duplicates, singletons). `groups` is an array of arrays or `{groups: [...]}` (Find it's and Cook's shape) |
| `WhichOne.balance(items, used, {min: 2, except})` | `{ok, problems, counts, distinct, median}`: every said value (`used` = dim names or `[{dim, value}]`) is on ≥ 2 items (Who did it 3.2), plus each item's distinctiveness and the median |
| `WhichOne.distinctive(item, items, dims)` / `WhichOne.notStandout(item, items, dims)` | how many of its values are unique; is it at or below the median (the culprit rule) |
| `WhichOne.consistent(items, clues)` / `WhichOne.lucky(items, clues)` | who still fits; accusing now is a guess (more than one fits: no ear star). A clue is `fn(item)`, `{fits(item)}` or `{dim, value, not?}` |
| `WhichOne.blindOdds(rows, items, {visible, dims, strategies, countKnown})` | `{p, rows: [{p, strategy, candidates, targets}]}`: the chance a non-speaker gets every row right, taking the strongest prior per row (`uniform`, `odd` one out, most `common` value, plus yours). Use `row.visible` / `opts.visible` for what a non-speaker can read (an English placeholder), and report such rows apart |
| `WhichOne.setOdds(scope, answers, {features, salience})` | Dress up 8.4: the best blind chance of picking exactly the set `answers` from `scope`. The strategies are uniform, the one strictly most common value of any feature, and the most salient colour; a strategy set smaller than k takes it all plus the rest at random |
| `WhichOne.fitBudget(make, {budget: 0.05, addDecoy, addRow, odds, blind, maxSteps})` | `{round, p, steps, ok}`: `make()` a round, then alternate `addDecoy(round)` / `addRow(round)` (each returns the grown round or null) until `odds(round) ≤ budget` |
| `WhichOne.grid(nouns, colours, extra)` / `rangeOdds([lo, hi])` / `product(ps)` / `choose(n, k)` | decoy grids and round odds |
| `WhichOne.estimate(trials, playOnce)` | a leak bot's win rate |
| `WhichOne.Pick` | Dress up's stub API exactly (rng-first `int/choose/shuffle/sample/weighted`, `grid`, `rules(scope, answers)`, `setOdds`, `rangeOdds`, `product`, `C`) |

---

## 3. Star sets and ear/voice rules: `data/shared/stars.json`, `js/shared/stars.js`

### 3.1 The data
`rules.defaults`, then `rules.<mode>`, then `rules.<mode>.variants.<name>` (a visit type, a mechanic).

| Knob | Default | Meaning | Who changes it |
|---|---|---|---|
| `earPass` | 1 | share of tested rows that must be heard (1 = Cook's first-miss rule) | Monsoon 0.8 |
| `minTested` | 2 | fewer tested rows: ear shown dashed, "not tested this time" | Cook 1; clinic 3 (named ailment 2); Monsoon 6 (forecast 10) |
| `taughtStage` | 1 | rows whose word is at this stage or below are taught, not tested | |
| `placeholdersTested` | false | a row whose deciding word has no Kutchi yet doesn't count for the ear (English is readable) | |
| `voicePass` / `voiceMin` | 1 / 1 | share of speaking moments recognised or ✓'d, and how many there must be | Tidy and Snap `voiceMin` 2; Monsoon 0.8 over 4 |
| `firstTry` | false | only a first-try acceptance counts | clinic |
| `minConfidence` | 0.5 | below this a recognition goes to the pills (`Say` reads it) | |
| `busyWrongWeight` | 1 | a Busy wrong's weight against the word's stage | Monsoon 0.5 |
| `lateCounts` | true | a late answer counts against the word's stage | Monsoon false |
| `maxMissWeightPerRound` | null | cap per word per round (2 = at most one stage) | Monsoon 2 |

`star_sets.<mode>` uses Cook's shape (`ear`, `hand`, `relaxed`, `busy`) plus `voice`, each `{icon, name, tip}`:
- For Cook and Find it these match `data/cook.json`.
- The new icons (`mic`, `megaphone`, `broom`, `umbrella`, `needle`, `nani-glasses`, `plaster`, `lens`) have SVGs in `Stars.ICONS` until phase B merges them into `UI.ICON`.

`menu_words.ids` lists words known from English menus. They are played but never tested, in every mode.

Mode ids are `cook`, `find`, `tidy`, `who`, `dress-up`, `monsoon`, `clinic` and `snap`. The aliases `dress`, `who-did-it`, `tidy-up` and `monsoon-rush` also resolve.

### 3.2 The calls
A row is `{word | words, outcome? | ok? | firstRight?, stage?, taught?, retry?, excluded?, shown?, placeholder?}`. The `outcome` values are `heard`, `wrong`, `late`, `taught` and `retry`.

A moment is what `Say` resolves: `{via: "voice" | "pill" | "parent" | "skip", confidence?, tries?}`. Snap's `{heard, target, parent}` is accepted too.

| Call | Returns |
|---|---|
| `Stars.load(json)` / `await Stars.loadJSON(url = "data/shared/stars.json")` | `Stars` |
| `Stars.rules(mode, variant?)` or `Stars.rules({...knobs})` | merged knobs |
| `Stars.set(mode, {busy, voice})` | `[{key: "ear" \| "hand" \| "third" \| "voice", icon, name, tip}]`; voice only when the round has a speaking moment |
| `Stars.installInto(Cook.data)` | adds every star set to `Cook.data.star_sets` without overwriting a mode's own |
| `Stars.outcome(row, mode)` / `Stars.isTested(row, mode)` | `heard \| wrong \| late \| taught \| retry \| menu \| placeholder` |
| `Stars.ear(rows, mode \| knobs, variant?)` | `{state: "earned" \| "lost" \| "untested", tested, heard, ratio, need, offered, earned}` |
| `Stars.voice(moments, mode \| knobs, variant?)` | `{state: "earned" \| "open" \| "untested" \| "none", said, counted, ratio, offered, earned}`. A pill tap leaves it **open**, never lost; `none` = no voice slot |
| `Stars.progress(rows, mode, {busy, variant})` | `[{word, correct, missWeight}]` to feed `js/progress.js` (a miss weight of 2 = one stage) |
| `Stars.isMenuWord(id)` | |

---

## 4. The speaking moment: `js/shared/say.js`

```js
const out = await Say.moment({
  choices: ["cook-chai", "cook-dudh", "cook-khun"],  // the closed set, 2-8 ids
  mode: "cook",                        // the log; minConfidence from Stars.rules(mode) if Stars is loaded
  character: {                         // every hook optional, may return a promise
    listen() {},                       // the character turns and cups an ear
    heard(choice, res) {},             // a recognition arrived
    act(choice, via) {},               // the character DOES it (voice, pill or parent): the child sees what was heard
    miss(n, res) {},                   // "Hmm?" / "Say it again?" / "Nar!"
    done(out) {},
  },
  accept: (choice, via) => true,       // false = the act was wrong: a hearing counts as a miss; a pill tap leaves the pills up
  expected: "cook-chai",               // optional: what a parent's ✓ confirms
  grandparent: false,                  // shows "✓ They said it" / "Again"
  pillsLive: false,                    // true at L1: pills and mic together from the start
  timeoutMs: 4000,                     // passed to Speech.listen
  pillsAfterMs: 8000,                  // the pills go live on this timer whatever happens (0 = off)
  retries: 1,                          // misses before the pills go live
  minConfidence: 0.5,
  label: (id) => Cook.display(id),     // pill text (the default; placeholders show grey italic)
  caption: "Nana wants his chai. Tell the cook what to make.",
  container: document.body,
  speech: Speech,                      // anything with listen(); the lab passes a fake
  onHeard(out) {}, onChoice(out) {},   // Who did it / Find it callback names
  playWord: (id) => Cook.say(id),      // audio pills: a speaker each; a tap plays and selects, "✓ That one" sends
  pillText: (id) => stage >= 3 ? Cook.display(id) : null,  // audio pills: text only where the word's stage allows
  shrug: false,                        // Monsoon's Busy: a null ends the moment as a skip
});
// out = {choice, via: "voice" | "pill" | "parent" | "skip", by (= via), voice (voice or parent: may earn the voice star),
//        confidence, tries, retried, fallback, enrolled}
// the promise also has cancel() / close() and pill(id) (send a pill from outside: a bot)
```

**Names the mode stubs used, all accepted:**
- `answer` or `target` for `expected`;
- `onAgain` or `onNull` for `character.miss`, `act` for `character.act`, `onAnswer` for `character.done`;
- `by` and `voice` on the outcome.

**The flow.**
1. The panel (bottom centre, fits 915×375) shows the mic and faint pills. With no templates for the set, a refused or absent mic, or fewer than 2 choices, the mic is hidden and the pills are live at once.
2. A tap calls `Speech.listen()` inside the tap (iOS). The button pulses (`listening`) and swells when a voice starts (`speaking`).
3. A recognition at or above `minConfidence` makes the character act (`heard`, then `act`), then `accept`.
4. On a null, a low confidence or a rejected act, `miss` plays and the button gets a hint ring for one "say it again". After `retries` misses the pills go live.
5. A pill tap cancels any listen, the character acts, then `accept` runs.

**Grandparent mode.** ✓ resolves `expected` as `via: "parent"`. With no `expected`, it arms the pills so the parent taps which word was said. "Again" goes back to the mic.

**What the moment writes.**
- **Enrolment.** It calls `Speech.confirm(choice, "game")` after an accepted recognition (enrols only at margin ≥ 0.4) and `Speech.confirm(choice, "parent")` after a parent's ✓. Pill taps never enrol.
- **Parent log.** It writes one `Speech.logMoment(...)` entry per moment.
- **No voice lines while listening.** While `Say.isListening()` is true, the mode must not play a voice line.

The voice star is `Stars.voice([out, ...], mode)`.

The other calls:
- **`Say.tell(opts)`** is the same moment, accepting `actor` for `character`.
- **`Say.pills(el, ids, {label, onPick, live})`** is the shared pill builder on its own; it returns `{el, setLive, buttons}`.
- **`Say.machine(opts)`** is the pure state machine under the moment, for leak bots and headless tests:
  - `start({micOk})`, `micTap()`, `heard(res)`, `pill(id)`;
  - after `heard` or `pill` comes the phase `"acting"`, then `accepted()` or `rejected()`;
  - `timer()`, `parentOk()`, `parentAgain()`, `skip()`.

### 4.1 `js/shared/speech.js` (the recogniser, finished)
The designed call is unchanged: `Speech.listen({choices, timeoutMs, onState, pcm?}) → {choice, confidence} | null`. It never throws, only one listen runs at a time, and the audio is dropped once its features are taken.

| Call | What it does |
|---|---|
| `Speech.loadTemplates(id, urls)` → n / `Speech.hasTemplates(ids)` / `Speech.templateUrls(id, audioManifest)` | family recordings as templates (`word` kind only; the TTS placeholder voices are not family) |
| `Speech.status()` | `"unknown" \| "ok" \| "refused" \| "absent"` (refused hides the mic for the session) |
| `Speech.cancel()` / `Speech.busy()` | stop a listen (it resolves null) |
| `Speech.setProfile(id)` | enrolments are per profile, per device (`localStorage` `njg-speech-enrol-v1:<id>`) |
| `Speech.confirm(choice, "parent" \| "game")` → enrolled? / `Speech.shouldEnrol(last, choice, by)` | the plan's rule: a parent always enrols; the game only on margin ≥ `Speech.ENROL_MARGIN` (0.4); `Speech.MAX_TAKES` (3) per word, newest wins |
| `Speech.enrol(choice, pcm?)` / `Speech.clearEnrolments(choice?)` / `Speech.enrolmentCount(choice)` | parent setup takes; "start again" |
| `Speech.last` | `{feat, result: {choice, confidence, margin, d1, distances}, choices}` (features, never audio) |
| `Speech.log`, `Speech.onLog = (entry) => ...`, `Speech.logMoment(entry)` | the parent log (device only); the shell persists it via `onLog` in phase B |
| `Speech.features / classify / dtw / endpoints / pack / unpack` | the pure half, as used by `build/speech/harness.js` |

---

## 5. Overlay-at-anchor sprites: `data/shared/overlays.json`, `js/shared/overlay.js`

```json
{ "bases": { "nana-upper": { "img": "assets/cook/characters/nana-neutral.webp", "size": [370, 389], "view": "upper", "shape": "person",
                             "anchors": { "head": [0.5, 0.06], "eyes": [0.5, 0.27], "neck": [0.5, 0.52], "chest": [0.5, 0.72], "hands": [0.5, 0.97] },
                             "fit": { "ov-cap": { "w": 0.46, "dx": 0, "dy": 0 } } },
             "grey-cat":   { "img": null, "size": [300, 300], "shape": "cat", "anchors": { ..., "paws": [0.5, 0.94] } } },
  "layers": { "ov-cap":   { "anchor": "head", "pivot": [0.5, 0.2], "w": 0.45, "aspect": 0.32, "z": 30, "tint": true, "defaultTint": "white", "slot": "head", "shape": "arc" },
              "ov-trace": { "anchor": "paws", ..., "shape": "smudge" },
              "item:*":   { "anchor": "hands", "pivot": [0.5, 0.75], "w": 0.3, "aspect": 1, "z": 40, "shape": "item" } },
  "colours": { "red": "#b72424", ... } }
```

**Bases.**
- **Anchors** are normalised `[x, y]` positions in the base image.
- **`fit`** nudges a layer on this one base (fractions of the base) to get within 4 px.
- **Bases so far:** `nana-upper`, `ma-upper` and `cousin-upper` use the existing crops; `grey-person` and `grey-cat` are greyboxes.

**Layers.**
- **Placement.** The layer's `pivot` (0..1 of its own box) sits on the anchor. `w` is a fraction of the drawn base width, and `aspect` (h/w) or `size` gives its height.
- **`z`.** The base is 0; a negative `z` draws behind it (a dupatta).
- **`slot`.** Wearing a new layer replaces whatever is in its slot. Dress up's slots are `head`, `top`, `layer`, `bottom`, `feet`, `wrap`, `wrist` and `carry`.
- **Tints.** `tint: true` means a neutral sprite coloured in code. A tint is a colour id from `colours` or a hex; a mode's colour word with its own `hex` just passes the hex.
- **`shape`.** The greybox used until the art exists: `person`, `cat`, `arc`, `glasses`, `rect`, `smudge`, `rings` or `item`.
- **`item:<word id>`** uses the `item:*` template. Its picture comes from `opts.itemImage(wordId)`.

| Call | Returns |
|---|---|
| `Overlay.load(json)` / `await Overlay.loadJSON(url = "data/shared/overlays.json")` | `Overlay` |
| `Overlay.figure(base, layers?, {mirror, skin})` | `{base, layers: [{id, tint?, pattern?, anchor?, fit?, z?}], mirror}` |
| `Overlay.wear(fig, layerOrId, {tint, pattern})` / `Overlay.remove(fig, idOrSlot)` | a new figure (slots replace) |
| `Overlay.layout(fig, rect, {itemImage})` | the draw list, back to front: `[{kind: "base" \| "layer", id, x, y, w, h, z, img, tint, pattern, shape, flip, anchor, label}]`, plus `.skipped` (layers whose anchor this base lacks: never drawn in the wrong place) |
| `Overlay.anchorAt(fig, rect, name)` | `[x, y]` on the canvas |
| `Overlay.draw(ctx, fig, rect, {images, itemImage, makeCanvas, list})` | draws and returns the list. With images, it draws the images; tinted layers go through an offscreen canvas (multiply, pattern, then the sprite's alpha); anything unloaded is drawn as its greybox |
| `Overlay.hit(list, x, y, kinds?)` | the topmost entry under a point ("look closer" at a suspect's paws) |
| `await Overlay.preload(figs, {images, itemImage})` | `{src: Image}` (browser) |

`rect` is `{x, y, w, h}`; the base is fitted inside it, bottom-centred, so a line-up stands on one line. Patterns are `dots`, `stripes` and `bandhani` (a finer dot grid).

---

## 6. Swapping a stub for the real module

Each swap is one line, or a few in a single adapter file. After swapping, delete the stub and run your leak bot: the shared modules are at least as strict as the stubs.

| Mode | Stub today | Swap to |
|---|---|---|
| **Find it** | `Find.matches` on `item.rel`, `Find.makeWants` size rows in `gen.js`, `Find.fakeListen`, `data/find.json` `star_set` | `Rel.holds(item, want.where, scene)` (word matching is the default); `WhichOne.checkDecoys(items, row, {minValues: {size: 2}})` or `WhichOne.build` for size rows; `Say.tell({choices, actor, onChoice, speech: {listen: Find.fakeListen, hasTemplates: () => true}})` in the lab, the real `Speech` otherwise; `Stars.installInto(Cook.data)` and `Stars.voice/ear(rows, "find")` |
| **Tidy up** | `js/tidy/stubs/rel.js` (its own board dialect), `js/tidy/stubs/say.js` (`Tidy.Say.moment({ask, choices, answer, timeoutMs, parent, threshold})` → `{choice, by}`), sidecars `kitchen-tidy.json` etc. | `Tidy.Rel = Rel.Tidy` (section 1.4: the stub's API and answers exactly; converge on the board form in phase B); `Tidy.Say.moment = (o) => Say.moment({choices: o.choices, answer: o.answer, timeoutMs: o.timeoutMs, grandparent: o.parent, minConfidence: o.threshold, caption: o.ask, playWord, pillText, mode: "tidy"})`: the outcome carries `by`, and audio pills are `playWord`/`pillText`; stars `Stars.ear(rows, "tidy")` |
| **Who did it?** | `js/who/stubs/whichone.js` (`balance`, `blindOdds(case)`), speech URL flags, greybox overlays, `data/who.json` `star_set` | `const W = WhichOne` in `case.js`: `W.balance(suspects, dims)` returns the stub's `counts`, `distinct` and `median`, plus `ok` and `problems`. Keep the case-level `blindOdds(case)` in `case.js` (it's the case's own formula), or build it from `WhichOne.setOdds`/`product`. **Don't write `js/shared/mechanics/tell.js`**: `Who.Tell.tell = (o) => Say.tell({choices: o.choices, onAgain: o.onAgain, grandparent: o.mode === "parent", pillsLive: o.mode === "pills", playWord, pillText: (id) => (o.stage || 2) >= 3 ? label(id) : null})` (it reports `{choice, via}`; the audio pills show "🔈 1" below stage 3, as your stub does). For the URL flags, pass `speech: {listen: stubListen, hasTemplates: () => true}`. Suspects: `Overlay.figure("grey-cat", ["ov-trace", "item:fru-01"])` with your people's anchors added as bases |
| **Dress up** | `js/dress/stubs/pick.js`, `js/dress/mechanics/say.js`, a local `star_sets` | `Dress.Pick = WhichOne.Pick` (the same API and answers), or `WhichOne.setOdds` directly; `Dress.Mech.say.run(r, {choices, prompt, answer, who, act})` → `Say.moment({choices, answer, act, caption: prompt, mode: "dress-up"})` (the outcome carries `voice`, as your stub's does); `Stars.rules("dress-up")`; the doll → `Overlay` with Dress up's slots (add full-body bases to `overlays.json` in phase B) |
| **Monsoon rush** | `js/monsoon/stubs/speech-lab.js`, `js/monsoon/stubs/say.js` (`Monsoon.Say.open({choices, target, timeoutMs, drizzle, onAnswer, onNull})` → `{close(), pill(id)}`), sidecars, `data/monsoon-audio.json` | `Monsoon.Say.open = (o) => Say.moment({choices: o.choices, target: o.target, timeoutMs: o.timeoutMs, shrug: !o.drizzle, onAnswer: o.onAnswer, onNull: o.onNull, playWord, pillText, mode: "monsoon", speech: labStub \|\| Speech})`; the returned promise has `close()` and `pill(id)`; `Stars.ear(rows, "monsoon")` (80% over ≥ 6, forecast ≥ 10), `Stars.voice(moments, "monsoon")`, and `Stars.progress(rows, "monsoon", {busy})` for the Busy stage rule; `Stars.isMenuWord`; sidecars through `Rel.scene(base, sidecar)` when G6 L2+ needs relations |
| **Clinic** | `js/clinic/stubs/{speech,which,overlay}.js`, `js/clinic/mechanics/tell.js` | `tell.run({io})` → `Say.moment({choices, expected: answer, accept: (c) => c === answer, grandparent: parentJudge, pillsLive: pillsFromStart, minConfidence, mode: "clinic"})`. A wrong pill plays out and the pills stay up, as your `tell` does. The voice star is `Stars.voice(moments, "clinic")` (first try only). `Clinic.Which = WhichOne.Clinic` (the stub's `choices(want, pool, n, rnd)` and `pair`, reading `Cook.data.lookalike_groups`); `stubs/speech.js` stays as the lab's fake and is passed as `speech:`. `stubs/overlay.js` draws items on scene spots, not figures, so keep it until there's art; patients' expressions and held items move to `Overlay` in phase 3 |
| **Snap** | `js/snap/adapters.js` → `stubs/stars.js`, `stubs/which-one.js` | In `adapters.js`: `Snap.Stars = Stars` (`Stars.ear(rows, {minTested: 2})` and `Stars.voice(said, {minSaid: 2})` take the stub's row shapes and return `offered` and `earned`; add `lens` locally, or use `Stars.ICONS.lens`); keep the size-class picker or use `WhichOne.checkDecoys(items, row, {minValues: {size: 3}})`. `Snap.listen` stays; the pill fallback can move to `Say.moment` |

Until phase B these calls go through the modes' own files, so nothing in `js/shared/` needs editing by a mode.

## 7. Tests, lab and what is not here

- **Unit tests:** `node --test build/test_shared_*.mjs` (speech, rel, whichone, stars, say, overlay and the stub-compat tests; no browser).
- **Browser smoke test:** `node build/test_shared-browser.mjs` (port 8800, one page, the global playwright).
- **Lab:** `lab/shared.html` shows overlays with anchors, a say moment, relations on the bazaar scene, and star slots.

Phase B owns the rest:
- the shell, "one app, one save", with `Speech.setProfile` and `Speech.onLog` wired to the profile;
- `Stars.ICONS` merged into `UI.ICON`, and `Stars.installInto(Cook.data)` in the shell;
- the audio manifest's `dur` and `keyAt` fields;
- merging scene sidecars into `data/scenes/*`;
- full-body bases;
- a shared `js/shared/mechanics/` folder if two modes' mechanics converge.
