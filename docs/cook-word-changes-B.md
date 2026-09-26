# Cook with Nani: word changes from Mum's A8 and Section B answers (26 Sept 2026)

**Source:** `docs/kutchi-grammar-notes.md`, mainly §23–§28, plus §10–§22 (A4–A7), Zafar's spelling corrections (including his corrections to this list on 26 Sept: *chundo*, *aako cup*, *aau theek ai*, *hever*), and the spelling rules:
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

## 1. Things the game still named in English that now have Kutchi

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

## 2. Spellings the game had wrong

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

## 3. Action words and kitchen phrases

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

## 4. The green pepper (`ph-pepper`): no Kutchi word

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

## 5. Doubts for Zafar (and Masi)

1. ⚠ ***{x} na.*** vs the polite ***Muke {x} na khape.*** for "no X".
2. ⚠ ***lakri*** before *gos*, *boga* and *mixed* (Mum said it only with *mishkaki*).
3. ⚠ ***{x} hane kadh.*** / ***{x} chadi de.***, with the thing named in place of *inke*.
4. ⚠ ***wadhare*** (more), ***thorok*** (a little), ***Jara e wandho nai***, ***Mu lai khobar!***: all marked doubtful in the notes.
5. **The chilli words:** Mum says *mirchi* for chilli, and the game has used *marcha* (green chilli) and *lal marcha* (red chilli powder) since the content master. Which is right, or are both used? (Not changed.)
6. ***chana*** replaces the draft *channa* (B9's spelling). The art file names (`topping-channa-bowl-t`) are unchanged.

## 6. Still to do

- **Voice:**
  - `build/build_cook_tts.py` has Gujarati spellings for every new word, and a dry run maps all 1,137 Kutchi chunks. It still needs a machine with network to make the placeholder files.
  - Better still, cut Mum's B recording into clips (each word is said by Mum, then by Zafar).
  - Until then, the new words play in the device's own voice, or are silent (as after Wave 6).
- *keema* as an accepted answer needs speech input; `alt` records it for then.
