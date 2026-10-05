# Lexicon: the words the game uses and where each came from

> **Stale points (the rulebook, `docs/process/rules.md`, wins).** Blocks below are copied word for word from older files; these lines are overridden:
> - *hakri cup* / "Cup has no gender" (cook-word-changes-B §2) → *hakro cup*: cup is a he-word (Mum, 28 Sept, grammar-notes §29 R8; G5).
> - *marcha* for green chilli, *lal marcha* (handout words, cook-word-changes-B §5 item 5) → *mirchi* only, no plural, for now (G24, G25, decision 5).
> - Handout words *hikdo* (one) and *bo* (two), *nar* (no), *aastethi*, *bharelo* (full), *vadho* (big), *ghos*, *channa*, *daal*, *bajr jo maani*, *Achija* → superseded by *hakro/hakri*, *ba*, *na*, *aste thi*, *aako*, *wadho*, *gos*, *chana*, *daar*, *bajr ji maani*, *khuda-fis* (G5, G6, G24).
> - "Gujarati text-to-speech placeholder voice" (cook-with-nani-words) → TTS is test-only and never ships; no AI-generated Kutchi (G14, non-negotiable 10).
> - "Aabhar aanjo" (thank you) → the family says English "thank you" (G6).
> - The Content Master spreadsheet as "single source of truth" (Brief, Technical Plan) → open question, see "The Excel's role" below (G10, J8).
> - Handout vocabulary is fine to use as a map and for words, but is never shipped as text, and stays "unconfirmed" until Mum says (G1, G21).

**Status words used here:** *confirmed* = said by Mum or Zafar and recorded in `language/grammar-notes.md`; *draft* = flagged doubtful (⚠); *unconfirmed handout* = from the class handouts or the content master, never confirmed by Mum ("confirm with Mum").

This file will become the source for the language engine's word list (see `language/engine-spec.md`). The grammar behind the words is in `language/grammar-notes.md`; the answered questions are in `language/mum-questions/`.

## 1. Word choices made for Cook (26 Sept)

> from: docs/archive/language/cook-word-changes-B.md (whole file, headings demoted one level; its "Where Cook keeps its words" intro is included as written)

## Cook with Nani: word changes from Mum's A8 and Section B answers (26 Sept 2026)

**Source:** `docs/language/grammar-notes.md`, mainly §23–§28, plus §10–§22 (A4–A7), Zafar's spelling corrections (including his corrections to this list on 26 Sept: *chundo*, *aako cup*, *aau theek ai*, *hever*), and the spelling rules:
- W at the start of a word, never V, though V may appear inside a word (*sev*);
- no "the";
- long vowels are doubled.

⚠ marks a word or phrase that is doubtful. These are used in the game but flagged (`"draft": true` in the data).

**Where Cook keeps its words:**
- `data/cook.json` → `words` (nouns and describing words, each with `kutchi`, `english`, `gender`, `forms`, `src`) and `lines` (frames: `k` = Kutchi, `e` = English placeholder, `en` = gloss);
- `data/stations/mishkaki-grill.json` → `words` (*ph-veg*, *ph-mixed*, merged into `data.words`);
- `data/stations/stir.json` → `lines` (*stir-now*).

The code only names ids and line keys. **Every id is unchanged.** Only the display and voice text changed. One new word was added (*ph-lakri*) and eight new lines. The other modes that borrow Cook's ids pick up the new words automatically:
- Snap, Find, Monsoon and Dress use the "no" frame and the words;
- the clinic uses *yes* / *nope*, and *ph-slowly* / *ph-quickly* in its fever game.

**Totals:**
- 19 words with new text (16 in `cook.json`, 2 in the grill's station file, 1 new);
- 19 lines changed and 8 lines added;
- 6 words confirmed with no change of spelling (their `draft` flag was removed).

That makes **46 changes to text on screen or in the voice**.

### 1. Things the game still named in English that now have Kutchi

| Id | Old | New Kutchi | English | Source | Doubt |
|---|---|---|---|---|---|
| `ph-chips` | *chips* (English placeholder) | ***tarela bataata*** | chips (fried potatoes) | §26 B28 | |
| `ph-dhana` | *coriander* (placeholder) | ***dhania*** | coriander | §26 B30 | |
| `ph-amli` | *tamarind chutney* (placeholder) | ***amli ji chutney*** (gender: she) | tamarind chutney | §26 B31 | |
| `ph-lili` | *green chutney* (placeholder) | ***fudino ji chutney*** (gender: she) | mint chutney | §26 B32 | |
| `ph-keema` | *mince* (placeholder) | ***chundo*** (`alt: ["keema"]`) | mince | §26 B33; Zafar, 26 Sept | |
| `ph-dahi` | *dai* (Zafar's draft) | ***dai*** (confirmed) | yoghurt | §24 B8 | |
| `ph-meat` | *ghos* (draft) | ***gos*** | meat | §24 B10 | |
| `ph-veg` (grill station file) | *vegetable* (placeholder) | ***boga*** | vegetable | §25 B17 | |
| `ph-mixed` (grill station file) | *mixed* (placeholder) | ***mixed*** (the family uses the English word) | mixed | §25 B18 | |
| `ph-lakri` **(new)** | none | ***lakri*** (gender: she) | skewer | §25 | ⚠ (see below) |
| `ph-sev` | *sev* (placeholder) | ***sev*** | sev | §26 B29 | |
| `ph-ghee` | *ghee* (placeholder) | ***ghee*** | ghee | §26 B35 | |
| `ph-chaat` | *chaat* (placeholder) | ***chaat*** | chaat | §26 B36 | |
| `ph-samosa` | *samosa* (placeholder) | ***samosa*** | samosa | §26 B37 | |
| `ph-mishkaki` | *mishkaki* (placeholder) | ***mishkaki*** | mishkaki | §26 B38 | |

**Decisions:**
- **Green chutney is the mint one.**
  - The game's bowl (`topping-lili-bowl-t`, colour `#5d9b3a`) is bright green, and the chaat recipe is the usual mint and coriander kind.
  - So it's *fudino ji chutney*, and its English is now "mint chutney".
  - Coconut chutney (*nair ji chutney*) would be white, so it would need new art.
- **The chutneys are she-words.** They take *ji* (§18, and B11's *bajr ji maani*), so their gender is `she`.
- **Mince:** Nani says ***chundo***, Zafar's spelling. It is Kutchi, and it also means "to mince" in general. The recording's transcript had *chindo*.
  - *keema* is kept as `alt`. The game has no speech input yet, so "accepting" *keema* is recorded in the data only.
  - *chundo* ends in -o, so it's probably a he-word, but nobody has said, so its gender stays `unknown`.
- **The skewer, *lakri*:**
  - Mum said *hakri lakri mishkaki* (one skewer) and *ba lakri mishkaki* (two).
  - The mishkaki order now says each kind with *lakri* before it:
    - *Ne hakri lakri gos.*
    - *Ne ba lakri boga.*
    - *Ne hakri lakri mixed.*
  - The data does this through a new tally `unit` (`recipes.mishkaki.say`, and `mechanic.skewer.unit` in the grill station for Nani's threading hint). Two lines of code read it: `js/cook/recipes.js` and `js/cook/mechanics/thread.js`.
  - *lakri* is a she-word, so "one" becomes ***hakri***. Before, it was *hakro*, because *gos* and *boga* have no known gender.
  - ⚠ Using *lakri* with *gos*, *boga* and *mixed* is Claude's extension of Mum's *mishkaki* phrase.
- **The same-as-English words (*sev*, *ghee*, *chaat*, *samosa*, *mishkaki*, *mixed*) are now real words, not grey placeholders**, because §26 says they're the family's words too.
- ***tarela bataata*** is a plural (*bataato* → *bataata*). There's no plural field in the schema, so it's noted in `src`, and its gender is left `unknown`.

### 2. Spellings the game had wrong

| Id | Old | New | English | Source | Doubt |
|---|---|---|---|---|---|
| `ph-no` (word) | *nar* (voice *narr*) | ***na*** | no / not | §24 B1 (*nar* = look) | |
| `lines.no` (frame) | *Nar {x}.* | ***{x} na.*** (e.g. *Dudh na.*, *Dungri na.*) | No {x}. | §24 B1; §11 *khun na* | ⚠ (see below) |
| `ph-slowly` | *aastethi* (voice *arse-teh-tea*) | ***aste thi*** | slowly | §24 B2 | |
| `ph-quickly` | *jaldi* (draft) | ***jaldi*** (confirmed) | quickly | §24 B3 | |
| `ph-half` | *adh* (draft) | ***adh*** (confirmed; for amounts: the Chai tray's half cup) | half | §24 B4 | |
| `ph-full` | *bharelo* (voice *barr-el-or*) | ***aako*** (as in *aako cup*, a whole cup) | full | §24 B5; Zafar, 26 Sept | |
| `ph-big` | *wadho* / *wadhi* (drafts) | ***wadho / wadhi*** (confirmed) | big | §24 B6 | |
| `ph-small` | *nindho* / *nindhi* (drafts) | ***nindho / nindhi*** (confirmed) | small | §24 B7 | |
| `cook-bajrmaani` | *bajr jo maani* | ***bajr ji maani*** | millet chapati | §24 B11 | |
| `ph-chana` | *channa* | ***chana*** | chickpeas | §24 B9 | |
| `ph-meat` | *ghos* | ***gos*** | meat | §24 B10 | |
| `lnk-nepoi` | *ne poi* (draft) | ***ne poi*** (confirmed) | and then | §24 B12 | |
| `js/cook/flow.js`, the end-of-story text | "chai, maani, **daal**, chaat…" | "chai, maani, **daar**, chaat…" | | §7 | |
| Comments in `js/cook/` | *bo*, *be*, *hikdo*, *ghos*, *vatana*, *bajr jo maani*, *nar*, *only bo dungri* | *ba*, *hakro/hakri*, *gos*, *watana*, *bajr ji maani*, *na*, *Kali ba dungri* | | §2, §3, §24 | |

**Decisions:**
- **"No X" is *{x} na.***, Mum's everyday shape (*khun na*, §11; *laal na*, §13).
  - Like *Ne {x}.*, it's two words, so a hidden "no" row doesn't stand out by its length. That's the leak rule in `grammar._about`.
  - The polite whole sentence, ***Muke {x} na khape*** (or *nato*/*nati khape*), was not used, because its extra *Muke … khape* would make "no" rows easy to spot without listening.
  - ⚠ Mum called the short form "very informal". Zafar may prefer the polite one.
- **Full is *aako*** (two a's), from Zafar:
  - ***aako cup*** is a whole cup, the one used more in cooking. Zafar says to use it for recipe amounts, so the Chai tray's "full" is *aako*.
  - ***bharelo cup*** is a filled-up cup. *bharelo / bhareli* also means heaped (*bhareli chamchi*, a heaped teaspoon).
  - **Cup has no gender:** it's just *cup*, and one cup is *hakri cup*. So *aako* has no he/she forms (the drafts *ako / aki* are gone).
  - The tray says it on its own, like *adh*: *Ne aako.*
- **Half for portions, *ardo / ardi*:** Cook has no half portions, so it isn't used. It's recorded in `ph-half`'s `src`.
- *wadho*, *nindhi*, *daar*, *hakro/hakri* and *ba* were already in the data from Wave 6. No *vadho*, *daal* (as Kutchi), *hikdo* or *bo* is left in Cook's data. The only ones left are in the `src_change` history notes.

### 3. Action words and kitchen phrases

| Line key | Old | New Kutchi | English | Source | Where the game uses it | Doubt |
|---|---|---|---|---|---|---|
| `only` | *only {x}* | ***Kali {x}.*** | Only {x}. | §25 B13 | Chop, Nani's first order: *Kali ba dungri. Ne hakro tameto.* | |
| `now` | *Now {x}!* | ***Hane {x}!*** | Now {x}! | §25 B14 | Chop's mid-round switch: *Hane ba marcha!* | |
| `stir-now` (`data/stations/stir.json`) | *Now {x}!* | ***Hane {x}!*** | Now {x}! | §25 B14 | Stir: *Hane aste thi!* / *Hane jaldi!* | |
| `lift` | *Lift out the {x}.* | ***{x} hane kadh.*** | Lift out the {x}. | §25 B15 | Fry, level 3: *Samosa hane kadh.* | ⚠ a noun in place of Mum's *inke* |
| `leave` | *Leave the {x}.* | ***{x} chadi de.*** | Leave the {x}. | §25 B16 | Fry, level 3: *Tarela bataata chadi de.* | ⚠ as above |
| `longer` **(new)** | none | ***Thori war rakh.*** | Leave it a bit longer. | §25 B16 | not yet (ready for fry/tawa) | |
| `enough` | *Enough!* | ***Bas!*** | Enough! | §25 B19 | Pour, chop's time-up, stir | |
| `more` | *More!* | ***Wadhare!*** | More! | §25 B20 | not used by Cook's code yet | ⚠ |
| `little` **(new)** | none | ***Thorok.*** | A little. | §25 B21 | not yet | ⚠ |
| `ready` **(new)** | none | ***Tayar ai.*** | It's ready. | §25 B22 | not yet | |
| `burning` | *It's burning!* | ***Bareto!*** | It's burning! | §25 B23 | Tadka, too slow | |
| `boiling` **(new)** | none | ***Ukreto!*** | It's boiling! | §25 B24 | not yet (ready for the Chai tray's boil) | |
| `welldone` | *Well done!* | ***Shabash!*** | Well done! | §25 B25 | not used by Cook's code yet | |
| `careful` **(new)** | none | ***Dhyan rakh!*** | Careful! | §27 B49 | not yet | |
| `hurry` **(new)** | none | ***Jaldi kar!*** | Hurry up! | §27 B48 (to a child) | not yet (Busy mode) | |
| `eat` **(new)** | none | ***Kha!*** | Eat! | §27 B45 | not yet | |
| `taste` **(new)** | none | ***Muke chakhan lai de.*** | Let me taste it. | §27 B46 | not yet | |
| `forwho` | *This is for {x}.* | ***Hi {x} lai ai.*** (*Hi Nana lai ai.*) | This is for {x}. | §27 B39, §8 | not used by Cook's code yet (the cup cards use `for`: *Nana lai.*) | |
| `howareyou` | *How are you?* | ***Tu ki aiye?*** | How are you? | §27 B43, §21 | Greeting exchange (a customer asks the child) | |
| `fine` | *I'm fine, thank you.* | ***Aau theek ai.*** | I'm fine. | §27 B43; Zafar, 26 Sept | Greeting exchange (the right answer) | |
| `canyou` | *Can you make me {x}?* | ***Tu muke {x} banai dinda?*** | Can you make me {x}? | §27 B40 | Greeting exchange | |
| `ofcourse` | *Of course!* | ***Ha!*** | Of course! | §27 B41 | Greeting exchange (the right answer) | |
| `yes` | *Yes!* | ***Ha!*** | Yes! | §23 | A wrong answer in the greeting exchange; the clinic's yes/no probe | |
| `nope` | *No.* | ***Na.*** | No. | §24 B1 | A wrong answer to "can you make me…?" (a bare *na* is rude, §11); the clinic's probe | |
| `welcome` | *You're welcome.* | ***Jara e wandho nai.*** | You're welcome. | §27 B42 | Nani's answer to a customer's *Aabhar aanjo!* when an order is served | ⚠ |
| `wait` | *Wait for me!* | ***Mu lai khobar!*** | Wait for me! | §27 B44 | not used by Cook's code yet | ⚠ |

**Decisions:**
- **"now" is *hane*,** the cooking word (B14, confirmed by Zafar), everywhere Cook says "now". ***hever*** (with an e: "now" in general, and *hever na*, not now) isn't used in Cook.
- **The customers speak to the child,** so *tu* is right in *Tu ki aiye?* and *Tu muke … banai dinda?*. The elder forms (*Aai ki aayo?*, *Aai muke …*) are for a later speaking moment (grammar notes §21, idea 18).
- **New lines are data only.** No mechanic was changed to say them. They're ready for the next Cook pass: *Ukreto!* at the boil, *Tayar ai.* at serving, *Jaldi kar!* in Busy mode, *Kha!* / *Muke chakhan lai de.* at the table.
- **Lines left in English:** *times* ("{x} times", used by the clinic's dispensary) and *pocket* (the long pocket-money rule). The notes have no Kutchi for them.

### 4. The green pepper (`ph-pepper`): no Kutchi word

Mum (B34) knows no word for it: capsicum isn't a traditional ingredient. *mirchi* = chilli, and *lilo* = green. The game still shows it as the English placeholder *green pepper*. **Nothing about it was changed.**

Where it's used:
- **The mishkaki recipe:**
  - `recipes.mishkaki.lists.skewer` and `.veg`: one of the three vegetable pieces;
  - a mixed skewer's spoken pattern: *Pela gos. Ne poi dungri. Ne poi gos. Ne poi green pepper.*
- **Customers' tastes:** Nana's and Ma's mishkaki `pattern`.
- **The grill station** (`data/stations/mishkaki-grill.json`): `mechanic.skewer.classes` (a veg piece) and `.art` (the "pepper" style).
- **Art:** `art.sprites.items.ph-pepper` (whole, raw, grilled and charred sprites) and `art.sprites.need` (the thread, grill and mishkaki-grill preloads).
- **Look-alikes:** `lookalike_groups` group 6 (with coriander and the mint chutney).
- **Tests:** `build/test_cook.py` (a tally fixture) and the recipes guide's example.

**Recommendation: drop it** from mishkaki the next time the recipe and art change, and keep onion and tomato as the vegetables. Don't rename it *mirchi*:
- the art is a capsicum, not a chilli;
- Cook already has a green chilli, `veg-12` *marcha*, so a second chilli word would confuse a child;
- a green chilli isn't a usual mishkaki piece.

Until then it stays a grey English placeholder. It is the last English word in a Cook order.

### 5. Doubts for Zafar (and Masi)

1. ⚠ ***{x} na.*** vs the polite ***Muke {x} na khape.*** for "no X".
2. ⚠ ***lakri*** before *gos*, *boga* and *mixed* (Mum said it only with *mishkaki*).
3. ⚠ ***{x} hane kadh.*** / ***{x} chadi de.***, with the thing named in place of *inke*.
4. ⚠ ***wadhare*** (more), ***thorok*** (a little), ***Jara e wandho nai***, ***Mu lai khobar!***: all marked doubtful in the notes.
5. **The chilli words:** Mum says *mirchi* for chilli, and the game has used *marcha* (green chilli) and *lal marcha* (red chilli powder) since the content master. Which is right, or are both used? (Not changed.)
6. ***chana*** replaces the draft *channa* (B9's spelling). The art file names (`topping-channa-bowl-t`) are unchanged.

### 6. Still to do

- **Voice:**
  - `build/build_cook_tts.py` has Gujarati spellings for every new word, and a dry run maps all 1,137 Kutchi chunks. It still needs a machine with network to make the placeholder files.
  - Better still, cut Mum's B recording into clips (each word is said by Mum, then by Zafar).
  - Until then, the new words play in the device's own voice, or are silent (as after Wave 6).
- *keema* as an accepted answer needs speech input; `alt` records it for then.

## 2. Handout vocabulary: unconfirmed

Status for everything in this section: **class handout / content master, unconfirmed. Confirm with Mum.** (Round 2's "Part 5: check what we've guessed" asked Mum to confirm exactly these; it was never answered, and Combined Section D / Round 3 Section D are unanswered.) *Khun* (not *khand*) for sugar is Zafar's correction of 24 Sept and is already in grammar-notes §6.

> from: docs/archive/language/cook-with-nani-words.md § 1. Words used (table copied word for word; the ids are the content master's)


| id | Kutchi (draft) | Say (voice) | English | Where from | Family recording? (all have a placeholder voice) |
|---|---|---|---|---|---|
| cook-paani | paani | — | water | Zafar, 24 Sept (OK for now) | needed |
| cook-chai | chai | — | tea (leaves) | Zafar, 24 Sept (OK for now) | needed |
| cook-dudh | dudh | — | milk | Zafar, 24 Sept (OK for now) | needed |
| cook-khun | **khun** (not *khand*) | — | sugar | Zafar, 24 Sept (corrected) | needed |
| cook-atto | atto | — | flour | Zafar, 24 Sept (OK for now) | needed |
| cook-daal | daal | — | lentils, daal | Zafar, 24 Sept (OK for now) | needed |
| cook-maani | maani | — | chapati | Zafar, 24 Sept (OK for now) | needed |
| veg-02 | dungri | — | onion | content master | needed |
| veg-03 | tameto | — | tomato | content master | needed |
| veg-12 | marcha | — | green chilli | content master | needed |
| veg-13 | lasan | — | garlic (pantry decoy only) | content master | needed |
| spi-01 | hardar | — | turmeric | content master | needed |
| spi-02 | jeeru | — | cumin seeds | content master | needed |
| spi-05 | rai | — | mustard seeds | content master | needed |
| spi-10 | elchi | — | cardamom | content master | needed |
| spi-16 | loon | — | salt (tadka decoy) | content master | needed |
| num-01 to num-05 | hikdo, bo, trae, char, panj | — | 1 to 5 | handout | needed |
| ph-dahi | **dai** (DRAFT) | — | yoghurt | Zafar, 24 Sept: **draft, not confirmed** (Mum to check) | needed |
| ph-chana | **channa** (DRAFT) | — | chickpeas | Zafar, 24 Sept: **draft, not confirmed** | needed |
| ph-meat | **ghos** (DRAFT) | — | meat | Zafar, 24 Sept: **draft, not confirmed** | needed |
| cook-bajrmaani | **bajr jo maani** (DRAFT) | — | millet chapati (not used yet: the Wave 3 maani line) | Zafar, 24 Sept: **draft, not confirmed** | needed |
| lnk-nepoi | **ne poi** (DRAFT) | — | and then | Zafar, 24 Sept: **draft, Mum to confirm** | needed |
| ph-no | **nar** (DRAFT) | *narr* | no / not | Zafar, 25 Sept, written phonetically: **draft, not confirmed** | needed |
| ph-slowly | **aastethi** (DRAFT) | *arse-teh-tea* | slowly | Zafar, 25 Sept, written phonetically: **draft, not confirmed** | needed |
| ph-quickly | **jaldi** (DRAFT) | *jal-dee* | quickly | Zafar, 25 Sept, written phonetically: **draft, not confirmed** | needed |
| ph-half | **adh** (DRAFT) | *udd* | half (chai) | Zafar, 25 Sept, written phonetically: **draft, not confirmed** | needed |
| ph-full | **bharelo** (DRAFT) | *barr-el-or* | full (chai) | Zafar, 25 Sept, written phonetically: **draft, not confirmed** | needed |
| ph-big | **vadho** (DRAFT) | *wudd-oar* | big (maani) | Zafar, 25 Sept, written phonetically: **draft, not confirmed** | needed |
| ph-small | **nindho** (DRAFT) | *nindh-oar* | small (maani) | Zafar, 25 Sept, written phonetically: **draft, not confirmed** | needed |


> from: docs/archive/language/cook-with-nani-words.md § 2. Lines used (the phrases)


| Line | Who says it | When |
|---|---|---|
| Salamun alaykum! | Nani (day 1), every customer | Arriving. **The player answers** by picking *Wa alaikum salaam!* from three choices |
| Wa alaikum salaam! | The player (a choice); Nani models it after a wrong pick | Replying to a greeting |
| Muke {dish} khape. | Customers ordering; Nani asking for things in the pantry | Orders, pantry |
| Ne {thing}. | Customers (extras, things in any order) | "And …" |
| Ne poi {thing}. (DRAFT) | Customers (the next layer or skewer piece); Nani (the next tadka spice) | "And then …": the order matters. Draft from Zafar, Mum to confirm |
| Nar {thing}. (DRAFT) | Customers (things left out); Nani (a wrong stove step) | "No/not …". Draft from Zafar, 25 Sept, Mum to confirm |
| {number} {noun} | Inside orders: *bo maani*, *trae khun* | Quantities |
| {number}! | Nani, before stirring | "Stir three times" |
| Aabhar aanjo! | Customers | When served |
| Achija! | Customers leaving; **from day 3 the player answers it too** | Farewell |
| Arre re! | Nani | A wrong tap, or an order that wasn't quite right |
| Hedo! | Nani | Before a customer's "the usual" order |

Full orders the prototype builds, for recording as whole sentences:

- Muke chai khape. Ne bo khun. / Ne trae khun. / Ne hikdo khun. Ne elchi.
- Muke chai khape. (Nana's and Ma's "usual": the player has to remember how they like it)
- Muke bo maani khape. / Muke trae maani khape. / Muke char maani khape.
- Muke daal khape. Ne bo maani. / Ne hikdo maani. / Ne trae maani.
- Muke daal khape. Ne tameto. Ne trae maani.
- Tadka orders (Nani): Jeeru. Ne poi rai. / Rai. Ne poi jeeru. Ne poi hardar. / Jeeru. Ne poi marcha. Ne poi hardar. (*ne poi* is a draft)
- Orders in sequence (chaat layers, skewer pieces): Muke chaat khape. Ne channa. Ne poi bataato. Ne poi dai. / Muke mishkaki khape. Ne ghos. Ne poi bo tameto. (drafts: *ne poi*, *channa*, *dai*, *ghos*)
- "No X" (daal, chaat, samosa, chai): Nar dungri. / Nar dudh. / Nar khun. (draft: *nar*)
- Nani, at the pot (daal stir): Trae! Aastethi! / Char! Jaldi! (drafts: *aastethi*, *jaldi*)
- Chai tray, level 3: Ne bharelo. / Ne adh. (drafts: *bharelo*, *adh*)
- Maani line, level 3: Bo vadho maani. / Hikdo nindho bajr jo maani. (drafts: *vadho*, *nindho*)


> from: docs/archive/language/cook-with-nani-words.md § 3. Questions for the family (still open; they became Mum's question rounds)


1. **Plurals.** Is it *bo maani*, or does maani change for two or more? What about *trae khun*? Would you say three *spoons* of sugar, and if so, what's the word for spoon?
2. **Ordering food.** Is *Muke chai khape* ("I need chai") natural for someone asking for food at home? Or would they say *Muke chai dine* (the "give me" frame from the handout), or something else?
3. **Verbs, to replace the English how-to lines.** Pour (to the line), boil, turn it down, add, knead, roll, flip, press, chop, stir, serve, enough, first/then, *It's boiling!*, *well done*, *your turn*, *watch me*, *the usual*.
4. **Kinship.** The customers are shown as Nana, Ma and Ali (a cousin). What does a child call their mother, and a cousin, in Kutchi?
5. **Nani's look.** In the new art, Nani's grey hair shows at the front of her headscarf. Is that right for the family?
6. **Dishes.** Are chai, maani and daal (with a jeeru and rai tadka) how Nani would really cook them? What would she add?
7. **The 25 Sept phonetic drafts.** *nar* (no), *aastethi* (slowly), *jaldi* (quickly), *adh* (half), *bharelo* (full), *vadho* (big), *nindho* (small): please confirm the spelling and pronunciation (see `docs/language/mum-questions/Questions for Mum (Round 2 — Cooking).md`).


## 3. Words the modes are waiting for (priority order)

> from: docs/archive/mode-briefs/OVERVIEW.md § What all six designs agree on, point 1

1. **The family's words are the real bottleneck.** Every mode says its deciding words are still English placeholders, so none can be properly tested as Kutchi until the family supplies them. The shared list, in priority order:
   - **Position words:** on, under, in, next to, behind, left, right.
   - **Colours.**
   - **Describing:** big/small (drafted: vadho/nindho), old/young, dark/light.
   - **Kinship titles.**
   - **Yes/no.**
   - **Body parts, "it hurts", and the doctor's instructions** ("check the knee", "listen to the chest", "a bandage, round twice", "two drops in the left eye": the clinic's backbone). "Or" stays, small (the "?" hint).

   - **Weather:** rain, sun, wind, cloud.
   - **Clothes.**
   - **Rooms.**
   - **Animals:** goat, hen, chick.
   - **Past tense:** "who saw it?"
   - **Comparatives.**

   Round 3 of the Questions for Mum should be built from this list.

## 4. Where the class handouts may and may not be used

> from: docs/archive/design-v1/Project Brief.md § Language authority and rights

**On the class materials.** The handouts from the Zoom lessons carry a "Copyright GTP Course" notice on most pages, so they are a third-party course the teacher taught from rather than her own work. Her permission covers her own material, not theirs.

| Use | Position |
| --- | --- |
| Private family use of the handouts | Fine |
| Vocabulary itself (the Kutchi word for banana) | Not ownable, fine to use |
| Their rhymes, lesson text, images, page layouts | Not ours to ship |
| Unit sequence as inspiration for scene order | Fine, and sensible |

Everything in the released app is recorded, written and drawn for this project. The handouts are a map of what to cover, not a source to copy.

## 5. The Excel's role (open question)

`content/Nani jo Ghar - Content Master.xlsx` exists. `build/build_content.py` reads it and warns never to resave it with openpyxl, because the "Carrier sentences" tab holds Excel formulas. The older docs (Brief, Technical Plan, Game Design, Roadmap) call it the single source of truth for every word, edited by Mum and her sister, with ids such as `fru-01`, `veg-01`, `spi-01`.

**Drift risk:** every Cook word confirmed since 24 Sept (*daar*, *ba*, *hakro/hakri*, *chundo*, *aako*, *gos*, *boga* …) lives in `data/cook.json`, not in the sheet.

**Open question for Zafar (recommendation: make this file the source):** is the Excel still the single source of truth, or does `lexicon.md` (feeding the language engine, rules G10 and J8) replace it? Does Mum still edit the sheet? Until decided, treat `data/cook.json` and `data/family-audio.json` as the live record and the sheet as history. Also still open from the audit: whether the three Word copies of Mum's question rounds are still used (see `language/mum-questions/README.md`).

> from: docs/archive/cook/cook-with-nani-todo.md § Noun singular and plural forms (Zafar, 26 Sept). Stale: the *mirchi* / *marcha* line is overridden by decision 5 (*mirchi* only, no plural).

### Noun singular and plural forms (Zafar, 26 Sept)
Nouns need a singular and a plural form in the data, and the game should say the right one for the count:
- *mirchi* / *marcha* (chilli, irregular);
- *ambo* / *amba*;
- *bataato* / *bataata*;
- -i she-words don't change.

`veg-12` already carries `kutchi_one: "mirchi"`. Add a `plural` field (or a `kutchi_one`) across the nouns, and use it wherever a count of 1 is spoken or shown.

## 6. Words from Mum's 5 Oct recordings (Round 4: I1–I35, C22–C79)

Source: `grammar-notes.md` §38–§55; recordings in `sources/audio/mum-2026-10-05/` (file, then mm:ss). **Status:** *confirmed* = Mum said it clearly (spelling still Zafar's to tick where marked ⚠); ⚠ = heard once or unclear, a draft (G2, G3). Gender: **he** / **she** / – (doesn't apply). Clips: `data/family-audio.json` (source `sources/audio/mum-2026-10-05/…`), unchecked.

### 6.1 Cooking verbs (bare command to a child)
| Kutchi | English | Notes | Source | Status |
|---|---|---|---|---|
| ***ukar*** | boil | *chai ke ukar, paani ke ukar*; same root as *ukreto* (§25) | I1-I35 0:54 | confirmed |
| ***slow kar*** | turn it down (the flame) | English *slow* + *kar*; not *aste thi kar* | I1-I35 1:03 | confirmed |
| ***wij***, ***wiji chad***, ***andar wiji chad*** | put it in, add | *wij* already in §9; *chad* = "leave it / finish it" helper | I1-I35 1:22 | confirmed |
| ***kadhi chad*** | take it out | *kadh* (§25) + *chad* | I1-I35 1:32 | ⚠ |
| ***gund*** | knead | *atto gund* | I1-I35 1:35 | ⚠ |
| ***firai***, ***firai chad*** | flip, turn over; also stir | *gadi firai chad* (turn the car round) | I1-I35 1:59–2:20 | confirmed |
| ***dabai*** | press | | I1-I35 1:46 | ⚠ |
| ***kap***, ***kapi chad*** | cut | chop = ***nindha nindha kap*** (cut it small) | I1-I35 1:48–1:56 | ⚠ |
| ***bego kari chad*** | mix (put it together) | also ***mix kari chad*** (English *mix*) | I1-I35 2:31 | confirmed |
| ***tar*** | fry | *samosa tar*, *bhajiya tar*; "make it fried" ***tarelo kari chad*** | I1-I35 2:52–3:11 | ⚠ |
| ***waar*** | fold | *samosa waar* | I1-I35 3:13 | confirmed |
| ***bhar*** | fill | *paani bhari chad* | I1-I35 3:23 | confirmed |
| ***thorok wij*** | (sprinkle) put a little in | stand-in; Mum to find the real word | I1-I35 3:34 | ⚠ |
| ***chakh*** | taste | | I1-I35 4:18 | confirmed |
| ***dho*** | wash | *glass dho, cup dho* | I1-I35 4:22 | ⚠ |
| ***bar*** | light (a fire) | *chulo bar* (light the stove) | I1-I35 6:46 | confirmed |
| ***rakh*** | put (down) | *table mathe rakhi chad* (put it on the table) | I1-I35 3:57 | ⚠ |
| ***banai*** | make | *jhini maani banai* | I1-I35 4:31 | confirmed (§8) |
| ***khan***, ***wapar***, ***ginech*** | take, use, buy/fetch | *wadho khan*, *wadho wapar*, *wadho ginech* (take / use / buy the big one) | C22-C49 9:15–9:26, 24:34 | *khan*, *wapar* confirmed (§9, §12); *ginech* ⚠ |
| ***khanech*** | bring | *wadho cup khanech* (bring the big cup); cf. *khanechi* (§33 S1) | C22-C49 9:56 | ⚠ |
| no word | pour, serve, roll, sprinkle | pour: *bakuli me wij*; serve: *bakuli me wiji chad*; roll and sprinkle: to ask | I1-I35 | gap |

### 6.2 Kitchen things and food
| Kutchi | English | Gender | One / more than one | Source | Status |
|---|---|---|---|---|---|
| ***indo*** (Kutchi), ***mayai*** (Swahili, what most East African families say) | egg | ? | ? | I1-I35 4:40 | confirmed; which one the game uses: Zafar |
| ***murgi*** | chicken | she? (-i) | ? | I1-I35 4:57 | confirmed; gender unheard |
| ***chapri*** | samosa pastry | ? | ? | I1-I35 5:05 | ⚠ |
| ***mogo*** | cassava | ? | ? | I1-I35 5:11 | confirmed |
| ***makai*** | corn on the cob | ? | ? | I1-I35 5:20 | confirmed |
| ***lakri*** | stick, skewer | she | *lakri* (no change, §34) | I1-I35 5:28 (*mishkaki ji lakri*, *kebab ji lakri*) | confirmed |
| ***tapelo*** (Kutchi), ***sufuria*** (Swahili, common) | pot | he (-o) | *tapela*? | I1-I35 5:40 | confirmed; which one the game uses: Zafar |
| ***tawa*** | tawa | ? | *tawa* (no change) | I1-I35 5:56 | confirmed |
| ***welan*** | rolling pin | ? | ? | I1-I35 6:08 | ⚠ |
| ***chamcho*** | ladle (the big spoon); also *wadho chamcho* | he | *chamcha* (§34) | I1-I35 6:21 | confirmed |
| ***aag*** | fire, flame | ? | – | I1-I35 6:39 | confirmed |
| ***chulo*** | stove | he (-o) | ? | I1-I35 6:43 | confirmed |
| ***bakuli*** | bowl | she | ***bakuliyu*** | C22-C49 3:20–3:40 | confirmed (Mum: maybe Swahili) |
| ***piali*** | bowl, small cup | she | ***pialiyu*** | C22-C49 4:11 | ⚠ ("not a word I often use") |
| ***gadi*** | car | she | ***gadiyu*** | C22-C49 4:26 | confirmed |
| ***kobi*** | cabbage | ? | ? | C22-C49 7:37 | ⚠ |
| ***limu*** | lemon | he (*limu wadho ai*) | *limu* | C22-C49 7:27 | confirmed (gender new) |
| ***kursi*** | chair | she | ***kursiyu*** (dropped when *hi mare … ain* shows the plural) | C79 19:03–20:54 | confirmed |
| ***chakli*** | (small) bird | she | ***chakliyu*** | C22-C49 17:32, 21:49 | confirmed |
| ***kutro*** | dog | he | *kutra*? | C22-C49 17:39 | confirmed |
| ***shati*** | shirt | she | ***shatiyu*** | C22-C49 22:13 | ⚠ spelling |
| ***kan*** | ear | ? | *kan* ("doesn't become plural") | C79 4:30–4:53 | confirmed |
| ***pag*** | foot | ? | *pag* | C79 4:53 | ⚠ |
| ***ghar*** | house, home | he (*panjo ghar*) | – | C79 24:10 | confirmed |
| ***rasoro*** | kitchen | he | before *me*: ***rasore*** | C79 9:58 | confirmed (§20) |
| ***maani*** | chapati | she | ***maani*** (never *maanu*) | C22-C49 21:00–22:52 | confirmed |

### 6.3 Describing words
| Kutchi (he · he, more · she) | English | Before a postposition (he) | Source | Status |
|---|---|---|---|---|
| ***wadho · wadha · wadhi*** | big | ***wadhe*** (*wadhe chokre sathe*) | C22-C49 0:14–5:52 | confirmed (spelling: Zafar's *wadho*) |
| ***nindho · nindha · nindhi*** | small | *nindhe*? (not said) | C22-C49 23:06–25:22 | confirmed |
| ***dayo · daya · dayi*** | good = well-behaved (people and animals only) | – | C22-C49 16:16–17:59 | confirmed |
| ***saro · sara? · sari*** | good (things) | – | C22-C49 20:00–21:56 | confirmed; *sara* unheard |
| ***fine*** (English), ***bo fine*** | nice, very nice | invariant | C22-C49 18:14, 19:46 | confirmed |
| ***khaso*** | nice, special | ? | C22-C49 18:14 | ⚠ |
| ***barabar*** | right, proper, just right (after the noun: *cup barabar ai*) | invariant | C22-C49 19:08; I1-I35 4:38 | confirmed |
| ***lal*** | red | invariant | C22-C49 12:35–14:21 | confirmed |
| ***jhino · jhini*** | thin | ? | I1-I35 4:28 | ⚠ |
| ***jadi*** (she) | thick | ? | I1-I35 4:35 | ⚠ |
| ***garam*** | hot (to touch); *koso* discussed | invariant? | I1-I35 6:54 | confirmed |
| ***thundo*** (*thundo thai vyo*, gone cold); Dad: *thadhu* | cold | ? | I1-I35 7:20 | ⚠ |
| ***X ma X*** | the most X: *wadho ma wadho*, *nindho ma nindho* | – | C22-C49 10:00 | confirmed |
| ***bo*** | very | – | C22-C49 19:46 | confirmed |

### 6.4 Pronouns, "of", "be"
| Kutchi | English | Source | Status |
|---|---|---|---|
| ***jo · ji · ja*** (*je* before a postposition with a he-word thing) | of, 's (agrees with the thing owned) | C79 0:25–9:24, 28:12 | confirmed |
| ***munjo / tojo / anjo / injo / asanjo / panjo / iloka jo*** (+ *-i*, *-a*, *-e* as *jo*) | my / your (child) / your (elder) / his, her / our (not you) / our (with you) / their | C79 18:56–28:06 | confirmed |
| ***pa*** · ***asa*** | we (including you) · we (not you) | C79 15:10–17:30 | confirmed (spellings ⚠) |
| ***iloka*** | they, them (those people) | C79 25:00 | ⚠ one word or two |
| ***hi · hu*** + ***mare*** | this/these · that/those; *hi mare* all of these | C79 18:03–18:54 | confirmed (*mare* ⚠) |
| ***huda*** | over there | C79 12:41 | confirmed (§23) |
| ***aau … aiya · tu … aiye · aai … aayo · e … ai · pa/asa … aayo · … ain*** | I am · you are (child) · you are (elder) · he/she is · we are · they are | C79 9:52–15:59; C22-C49 6:00–7:54 | confirmed (*aiya*, *aiye*, *ain* spellings ⚠) |
| ***winjanta*** | (we) are going | C79 17:21, 24:25 | ⚠ |
