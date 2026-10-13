# Nani jo Ghar: language inventory (what the game SAYS today) for the grammar-engine questionnaire

Read-only audit, 30 Sept 2026. Sources: `data/cook.json`, `data/stations/*.json`, `js/cook/{lang,order,recipes}.js`, `data/story/first-launch.json`, `data/conversations/*`, `data/clinic.json`, `data/clinic/*`, `data/family-audio.json`, `docs/language/grammar-notes.md` (cited as §n; "Z 26 Sept" = Zafar's dated correction blocks).

How I got real sentences: I ran Cook's own `recipes.js` + `order.js` + `lang.js` in Node on `data/cook.json` (60 orders per dish per level, levels 1-4; harness in the scratchpad `sim.js`, output `sim-out.json`). Every "sample" below is real output. Note: mishkaki's `ph-mixed`/`ph-veg` words are merged at runtime from `data/stations/mishkaki-grill.json`, so the harness printed the id.

Legend. Confirmed: **Y** = Mum said it (notes §) · **Y?** = Mum said it but spelling is Whisper's/⚠ or Zafar has not checked · **Z** = Zafar's spelling/decision only, Mum not recorded · **N** = not from Mum (class handout, Sindhi cognate, Claude or Zafar draft) · **-** = no Kutchi at all (English placeholder).

---

## 1. Sentence frames

All of Cook's Kutchi is data (`data.lines` 46 keys + `data.grammar`), none in code. The spoken order is built by `Order.sentence` / `Order.speech` (headline frame, then bare rows, with English join words).

### 1A. Cook: the order (what customers/Nani say and the card shows)

| # | Frame | Meaning | Where (file: key) | Uses | Mum? | Slots: what fills them | Agreement needed |
|---|---|---|---|---|---|---|---|
| 1 | `Muke {x} khape.` | I need/want {x} | cook.json lines.need; grammar.order.first | Headline of all 6 dishes every order; + 1 per chai cup (kari/mori/waari heads); + count cards (roll/tawa/fry/count) | **Y** §1 (informal, invariant), §6 | {x} = dish noun bare (chai, daar, chaat, samosa, sekelo); or `{n} {noun}` (ba samosa, trae samosa, hakri maani); or `{n} {adj} {noun}` (ba wadhi bajr ji maani); or `kari/mori chai`; or `{extra} waari chai` | informal never changes; the number "one" and adjectives agree with the noun's gender (hakri/hakro, wadhi/wadho); the formal `khapeto/khapeti/khapanta/khapanti` (§1, §31) exists but is NOT used in Cook |
| 2 | `Muke {x} de.` | give/pass me {x} | lines.give (draft flag) | Pantry list head (1 per pantry order, ~30 ingredient nouns); every "pass me" break in any station (Nani asks for one thing) | **Y** §9 (`Muke chamchi de`) | {x} = any ingredient noun (chai, dudh, khun, atto, daar, bataato, dungri, tameto, aadu, loon, elchi, hardar) | none shown; ask if gender/plural of {x} changes it (e.g. plural "bateta") |
| 3 | `Ne {x}.` | and {x} | lines.and; grammar.list.next | Pantry list items 2-6 (sample: `Muke daar de. Ne atto. Ne khun.`); chop/count/tally follow-ons (`Kali ba dungri. Ne trae tameto.`); daar veg | **Y** §6 (`ne chai, ne dudh`) | {x} = noun or `{n} {noun}` | none |
| 4 | `{x} na.` | no {x} / leave out {x} | lines.no (draft) | The "leave out" rows: chai (dudh na, khun na) ; daar (dungri na); chaat (tameto/dungri/marcha/sev/dai/fudino chutney na); samosa (marcha/dhania/dungri na). 5 say-entries, ~35% of L3-4 orders | **Y?** §11, §24 B1: `khun na`, `khun nati khape`; polite whole sentence is `Muke {x} na khape` | {x} = noun | `nati/nato` agreeing form exists (§24) but game uses bare `na`; also `{x} wagar ji {dish}` (§10) is unused |
| 5 | `Pela {x}.` | first {x} | lines.first (draft) | Start of every ordered sequence: daar tadka spices (2-3), chaat layers (1-3), sekelo mixed-skewer pieces (4) | **Y?** §7: `Muke pela daar khape, ne poi maani` (pela is Y; as a stand-alone line it is N) | {x} = spice, layer, or skewer piece noun, or `{n} {noun}` (ba bataato) | none |
| 6 | `Ne poi {x}.` | and then {x} | lines.then; grammar.then; word lnk-nepoi | Every later step in tadka/chaat/sekelo sequences (sample: `Pela lasan. Ne poi rai. Ne poi loon.`) | **Y** §7, §24 B12, §29 R5 (`ne poi` alone; never heard inside `pela ... ne poi`) | {x} = same | none |
| 7 | `Muke {x} waari chai khape.` | I want chai with {x} | lines.need_waari (draft) | chai cup head when the cup has an extra (elchi, aadu); ~40% of cups | **Y?** §6: `dudh/khun/kesar waari chai` (phrase Y; whole sentence is Claude's join) | {x} = elchi / aadu (Mum's own example was **kesar**) | `waari` fixed; chai she |
| 8 | `{x} waari chai.` | chai with {x} | lines.waari (draft) | Chai extra row text | **Y** §6 | {x} = extra | none |
| 9 | `Muke chai me {x} khape.` | in my chai I want {x} | lines.sugar (draft) | **Defined, not heard**: the spoken sentence says the sugar row as bare `ba khun` | **Y** §6 (`Muke chai me ba khun khapeti`) | {x} = `{n} khun` | Mum said formal `khapeti`; game keeps `khape` |
| 10 | `Kali {x}.` | only {x} (first thing named) | lines.only | Chop station first call (daar/chaat): `Kali ba dungri.` | **Y** §25 B13 | {x} = `{n} {veg}` | none (`kali` invariant) |
| 11 | `Hane {x}!` | now {x}! | lines.now; stations/stir.json stir-now | Chop mid-round switch (`Hane dungri!`); stir speed (`Hane aste thi!` / `Hane jaldi!`) | **Y** §25 B14 (`hane tameta wij` = now add tomato) | {x} = veg noun, or speed word (aste thi, jaldi) | none; **a verb is missing**: Mum's frame had one (`wij`) |
| 12 | `{x} hane kadh.` | take the {x} out now | lines.lift (draft) | Fry: samosa (vs chips) | **Y?** §25 B15 (`inke hane kadh`); noun-for-`inke` is Claude's | {x} = samosa, chips | object form / plural? |
| 13 | `{x} chadi de.` | leave the {x} (be) | lines.leave (draft) | Fry: leave the chips | **Y?** §25 B16 (`inke chadi de`); same caveat | {x} = chips, etc. | same |
| 14 | `{n}!` | counting aloud | grammar.number; `Lang.numLine` | Stir laps (2-4), daar laps, chop/fill counts: `ba! trae!` | **Y** for ba/trae/char/panj as words; nothing on "counting aloud" | {n} = 1-5 (6 would have no word) | "one" = hakro/hakri in counting? ask |
| 15 | `{n} {x}` (inside frames) | count + noun | grammar.count "{n} {x}" | Everywhere a quantity is said (chai sugar, maani, samosa, fillings, chop, skewers) | **Y** §2-§4 (hakro ambo, ba amba) | {n} = hakro/hakri, ba, trae, char, panj; {x} = noun; with compound kinds `{n} {adj} {kind}` and unit `{n} lakri {kind}` | one = gender of noun; noun plural (-o to -a; she -i unchanged; irregulars); unknown gender defaults to **hakro** |
| 16 | `Muke {a} khape, ne {rest}` / `Muke pela {a} khape, ne poi {rest}` | order with list / with sequence | (clinic) pipeline.json lines.needN / needOrder; Mum's model §7 | Clinic pharmacy; shows how Mum joins two items | **Y** §7 | {a}, {rest} = nouns | none |

### 1B. Cook: join words and other order text still English ("to record")

| # | Frame | Meaning | Where | Uses | Status |
|---|---|---|---|---|---|
| 17 | `with {x}` | samosa/sekelo/daar/chai rest-of-order join | lines.with `record:true` (English, grey italic) | Every sentence with a headline plus rows: e.g. `Muke ba samosa khape, with ba chundo, hakro bataato.` ~90% of orders | **-** (Q5: waari? sathe? nothing for food confirmed) |
| 18 | `and {x}` | second kind of the same dish | lines.and_join `record:true` | Maani 2nd kind (`Muke hakri maani khape, and ba bajr ji maani.`), samosa 2nd block | **-** (Q5 4) |
| 19 | `{x} times` | repeat count | lines.times (English) | defined, no call site | **-** |
| 20 | "Bring me these for {dish}" / "Bring me these" | pantry card headline | recipes.pantry.headline `record:true` | Pantry card, every pantry trip | **-** |
| 21 | `I'll give you pocket money for helping...` | day-1 Nani intro | lines.pocket (English, spoken as a bubble 3.8 s) | Once (chaiDemo) | **-** |

### 1C. Cook: one-off lines (said by Nani/customers; each one line)

| Line (key) | Meaning | Wired? | Mum? |
|---|---|---|---|
| `Salamun alaykum!` (greet) / `Wa alaikum salaam!` (greet-reply) | hello / reply | yes (small talk at each customer) | greet **Y** §30 K1; reply: Mum said `Alaikum salaam!` (K2 ⚠, no *wa*) |
| `Tu ki aiye?` (howareyou) / `Aau theek ai.` (fine) | how are you (to child) / I'm fine | yes, 35% of customers | **Y** §21, §27 B43; elder form `Aai ki aayo?` not used in Cook |
| `Tu muke {x} banai dinda?` (canyou) / `Ha!` (ofcourse) | can you make me {x}? / of course | yes, 30%; {x} = dish noun | **Y** §27 B40, §30 K7-K9 (elder: `Aai muke ... banai dinda?`) |
| `Ha!` (yes), `Na.` (nope) | wrong answers in small talk | yes | **Y** §23; bare `Na.` is rude (§11), used as the wrong answer on purpose |
| `Aabhar aanjo!` (thanks) | thank you | yes: end of every order | **N** handout; Zafar 26 Sept: family says English "thank you" |
| `Achija!` (bye) | bye | yes: end of order, and as wrong answer | **N** handout; Zafar: `Khuda-fis` |
| `Jara e wandho nai.` (welcome) | you're welcome | yes (Nani, end of order) | **Y?** §27 B42 (spelling confirmed by Zafar, meaning ⚠) |
| `Arre re!` (oops) | oh dear | yes: any gentle mistake | **N** doc/handout (§12 idea only) |
| `Shabash!` (welldone) | well done | yes (kitchen-kit result) | **Y** §25 B25 |
| `Bas!` (enough) | enough | yes (pour/chop/stir) | **Y** §25 B19 |
| `Bareto!` (burning) | it's burning | yes (tadka) | **Y** §25 B23 |
| `Hedo!`, `Ghan.` | hey / here you are | **no call site** | **N** handout |
| `Tayar ai.`, `Ukreto!`, `Thori war rakh.`, `Dhyan rakh!`, `Jaldi kar!`, `Kha!`, `Muke chakhan lai de.`, `Mu lai khobar!`, `Wadhare!`, `Thorok.`, `Hi {x} lai ai.` | it's ready / boiling / leave it longer / careful / hurry / eat / let me taste / wait for me / more / a little / this is for {x} | **defined in data.lines, not said by any Cook code** (no call site found) | **Y** §25-§27 (wadhare, thorok, mu lai khobar are ⚠ but spellings confirmed by Zafar 26 Sept PM) |

Names used as words: `Nana`, `Ma`, `Ali` (customer words `kin-nana`, `kin-ma`, `name-ali`).

### 1D. First launch story (`data/story/first-launch.json`, 10 lines, each English first then Kutchi)

| Line | Kutchi | Mum? |
|---|---|---|
| help-me | `Tu muke help kar de?` | **Y?** §33 S1 (*help* English; ⚠ Whisper) |
| pantry-ask | `Muke chai ji chiju khanechi dinde?` | **Y?** §33 S1 (*khanechi* ⚠; *dinde* vs *dinda* open §37.7) |
| make-chai | `Tu muke chai banai dinda?` | **Y** §27 B40 |
| lovely-chai | `Mmm, chai bo fine ai. Shabash, beta.` | **Y?** §33 S2 (*bo fine* ⚠) |
| eid-tomorrow | `Saware Eid ai.` | **Y?** §33 S3 (saware vs kale unsettled) |
| everyone-coming | `Mageni achenta.` | **Y?** §33 S4 |
| food-not-ready | `Oho, kenjo nai!` | **Y?** §33 S5 (*kenjo* meaning unknown) |
| help-cook | `Tu muke randhan lai madad kar de?` | **Y?** §33 S7 |
| yes (child, Zafar's voice) | `Ha!` | **Y** §23 |
| lets-cook | `Hal, rasore me winja.` | **Y?** §33 S9 |
Recorded by Mum but **not wired**: S6 `Panke randhnu khapdo.` (we need to cook) and the S8 full reply `Ha, aau randhan lai madad kar dis / dos` (needs girl/boy pick, §32).

### 1E. Conversations (`data/conversations/lines.json`, 31 lines, 9 exchanges, 15 placements)

| Frame / line | Meaning | Mum? | Slots / agreement |
|---|---|---|---|
| `Tu muke {x} banai dinda?` + 6 whole clips (chai, daar, maani, chaat, samosa, mishkaki) | can you make me {x} | **Y** §30 K7-K9 | {x} = dish noun; register: child `Tu`, elder `Aai muke chai banai dinda?` (R10); `dinda` vs `dinde` open |
| `{X} kida ai?` (whole clips chamchi, cup) | where is the {x}? | **Y** §30 K12 | {x} = chamchi, cup |
| `Muke {x} khape.` (want-x, no audio) | I'd like {x} | **Y** §1; but Mum's own answer was formal (`Muke chai khapeti. Muke paani khapeto. Muke dudh khapeto.` §31) | {x} = chai (she), paani (he), dudh (he); Zafar to decide informal vs formal |
| `Toke kuro khapeto?` / elder `anke kuro khapeto?` | what would you like | **Y** §23, §29 R2 / ⚠ | `toke/anke/muke/panke` = to you/elder/me/us |
| `Tu ki aiye?` / `Ki ai?` / `Ki aiye?` / `Aai ki aayo?` | how are you (child/peer/cousins/elder) | **Y** §21, §30 K4 | register by age; verb aiye vs aayo |
| `Aau theek ai.` (+ `Tu ki aiye?` / `Aai ki aayo?`) | I'm fine, and you? | **Y** | register |
| `Na, muke na khape.` / `Na, na khape.` / `Na, thank you.` | polite no | **Y** §11, §30 K11 | none |
| `Toke khabar ai, aau ker aiya?` | do you know who I am (Nani's) | **Y?** §30 K13 | Nana's version missing |
| `Hida!` / `Huda!` | here / there | **Y** §17, §23 | none |
| `Nana! Nani! Ali!`, `E chokro!/E chokri!` (clips) | calling out | **Y** §30 K14, §36 C21 | vocative `e` + word |
| `Shabash, beta!`, `Dhyan rakh!`, `Jara e wandho nai.`, `Thank you!`, `Salamun alaykum!`, `Khuda-fis!`, `Ha!`, `Na.` | | **Y** | |

### 1F. Clinic (all English placeholders except a few frames)

| Frame | Meaning | Where | Mum? |
|---|---|---|---|
| `Muke {a} khape` / `Muke {a} khape, ne {rest}` / `Muke pela {a} khape, ne poi {rest}` | pharmacy ask (1 / list / ordered) | pipeline.json lines.need1/needN/needOrder | **Y** §1, §6, §7 (frame); {a} nouns mostly `-` |
| `Pela {a}, ne poi {b}` | First a, then b | pipeline lines.bring2; heal ear/knee `{pela} {a}, {nepoi} {b}(, {nepoi} {c})` | **Y** §7; nouns `-` |
| `{n} {drops}`, `{what}. {n} {taps}`, `{side} {part}`, `{size} {tooth}. {n} {taps}` | counts, sides, sizes | heal/ear, knee, tooth | frame shape only; every word placeholder |
| `[My {part} hurts]`, `[My {side} {part}]`, `[Does it hurt here?]`, `[Where does it hurt?]`, `[Bring me] {a}`, `[{tool}] [the {part}]`, `[I don't feel well...]` etc. (28 bracketed lines) | doctor/patient lines | pipeline.json lines | **-** |
| `Salamun alaykum`, `Wa alaikum salaam`, `Haa`, `Na`, `Aabhar aanjo!`, `Achija!` | greet/yes/no/thanks/bye | pipeline lines/goodbyes | handout or **Y** (see 1C) |

### 1G. Parked modes (one line each; not audited)
tidy: 41 words with `kutchi:null`, 9 English-only lines · who: 13 null words, 23 English-only lines · dress: 42 null words, 8 English-only lines · monsoon: 11 null words · snap: 10 null words, 10 English-only lines · find: 14 null words. (`data/content.json` holds the 58-word handout list, almost all `is_draft`.)

---

## 2. Verbs (every form used in game data or recorded clips the game plays)

| Verb (root / meaning) | Forms in the game | Confirmed? | Where |
|---|---|---|---|
| **khap-** need/want (to me) | `khape` (informal; all orders); `khapeto`/`khapeti` (Conversations clips + `Toke kuro khapeto?`); `khapdo` (future, S6, clip only); `khapanta/khapanti` (plural, notes only) | **Y** §1, §31, §33 | Cook frame 1, Conversations, pipeline |
| **de** give/pass | imperative `de` (`Muke X de`, `chadi de`, `kar de`, `lai de`); aux `dinda/dinde` (will-you-give) in `banai dinda`, `khanechi dinde` | **Y** §9, §27; dinda vs dinde **open** §37.7 | Cook pantry + pass-me, canyou, story |
| **banai** make (conjunct) | `banai dinda` (make for me?); `Ma lai pan hakro banai` (imperative-ish) | **Y** §8, §27, §30 | canyou, story |
| **kar** do/make | `Jaldi kar!` (child) / `Jaldi karo!` (elder); `help kar de`, `madad kar de`; `kar dis` (girl "I will") / `kar dos` (boy) | **Y** §27 B48, §32, §33 | lines.hurry (unwired), story |
| **kadh** take out | `hane kadh` (gentle, in sequence), `hever kadh` (urgent), `inke hane kadh` (clips) | **Y** §25 B15, §29 R6, §37.6 | frame 12 |
| **chadi de** leave be | `{x} chadi de`, `inke chadi de` | **Y?** §25 B16 | frame 13 |
| **rakh** put/keep | `thori war rakh`, `dhyan rakh` | **Y** §25, §27 B49 | lines.longer, lines.careful (both unwired) |
| **kha** eat | `Kha!` | **Y** §27 B45 | lines.eat (unwired) |
| **chakh-** taste | `Muke chakhan lai de` (let me taste), `aau chakha` (I'll taste) | **Y** §27 B46 | lines.taste (unwired) |
| **ai / aiye / aayo / aiya** be | `ai` (is), `aiye` (you, to child), `aayo` (you, elder), `aiya` (I am, K13 ⚠), `achenta` ("are coming") | **Y** §21; aiya **⚠** | many |
| **ach** come | `achenta` (Mageni achenta), notes: `ach/acho` imperative, `achdo/achda/achindo` future, `achi vyo/vya` past | **Y?** §21, §33 S4 | story only |
| **hal** walk/come | `Hal, rasore me winja` (come, let's go) | **Y?** §12, §33 S9 | story |
| **winja** let's go | `winja` | **Y?** §33 | story |
| **khan / khanechi** take / bring | `khanechi dinde` (will you bring it) | **Y?** §9, §33, §37.8 | story S1 |
| **bar- / ukar-** burn / boil | `bareto!`, `ukreto!` (-to: he/neuter?) | **Y** §25 B23-B24 | lines.burning (used in tadka), boiling (unwired) |
| **randh-** cook | `randhan` (cooking), `randhnu` (to cook) | **Y?** §33 | story |
| **wij** put in / add | not in game data yet | **Y** §9 | (should be tadka, samosa fill, pantry-adjacent verbs) |
| **rakh / we / ad / bhaj / bol / wapur / watu kar / nar** | notes only, not in data | **Y** §12, §16, §20 | none |
| **Cooking verbs: chop/slice, stir, roll, fold, fill, fry, grill, pour, boil, flip, thread, press/knead, light, tap** | **no Kutchi at all**; shown as gestures or English goal text | **-** | cook.json `_about`: "cooking verbs have NO Kutchi yet" |

Person/number/gender forms needed for the same verbs: speaker gender (`dis/dos`, §32), respect plural (`aayo`, `karo`, `acho`; §21), he/she endings (`khapeto/ti`, `nato/nati`, `vyo/vai`, -to on participles).

---

## 3. Nouns

Gender: `he`/`she` as the game stores it; "?" = `unknown` in `cook.json`. Pl = plural. "Clip" = a family clip of the word alone exists in `family-audio.json`.

### 3A. Kitchen: drinks, staples, dishes
| Word | Meaning | Gender | Sg / pl recorded | Mum? | Modes | Clip alone |
|---|---|---|---|---|---|---|
| chai | tea | she §5 | (mass) | **Y** | Cook, Conv, story, clinic tummy | no |
| paani | water | he §31 | (mass) | **Y** | Cook, Conv, clinic | no |
| dudh | milk | he §31 | (mass) | **Y** | Cook, Conv, clinic | no |
| khun | sugar | ? (Mum said `ba khun khapeti`, which hints she, never stated) | (mass) | **Z** spelling §6 | Cook chai, clinic | no |
| atto | flour | ? | - | **N** (Zafar 24 Sept draft) | Cook pantry, samosa | no |
| daar | lentil stew | ? | - | **Y** spelling §7 (*daal*->*daar*) | Cook, Conv | only inside `Tu muke daar banai dinda?` |
| maani | chapati | she | maani = maani | **Y** §34 P6, C5 | Cook, Conv | yes |
| bajr ji maani | millet chapati | she | same | **Y** §24 B11 | Cook | yes |
| chaat | chaat | ? | - | **Y** §26 B36 | Cook, Conv | yes |
| samosa (Nani says *sambusa*, Zafar; not applied) | samosa | ? | samosa = samosa | **Y** §34 P7 | Cook, Conv | yes (+ sambusa) |
| sekelo | skewer dish (order word) | ? | - | **Z** draft, "to confirm with Mum" | Cook headline | no |
| mishkaki | meat cubes | ? | - | **Y** §26 B38 | Cook, Conv | yes |
| lakri | skewer (stick) | she | lakri = lakri | **Y** §25, §34 P8 | Cook sekelo | yes |
| gos | meat | ? | - | **Y** §24 B10 | Cook sekelo | yes |
| boga | vegetable | ? | - | **Y** §25 B17 (Swahili) | Cook sekelo (unused) | yes |
| mixed | mixed | ? | - | **Y** §25 B18 (English word) | Cook sekelo | yes |
| chips / tarela bataata | chips | ? | - | **Y** §26 B28 | Cook samosa-fry (decoy) | yes |
| ghee | ghee | ? | - | **Y** §26 B35 | Cook (in data) | yes |
| chamchi / chamcho | teaspoon / tablespoon | she / he | pl chamchi / **chamcha** | **Y** §9, §34 P9 | Conv (`chamchi kida ai?`) | yes |
| cup | cup | he (R8) | cup = cup | **Y** §29 R8 | Conv | yes |
| table | table | he | same | **Y** §35 C6 | none yet | notes only |

### 3B. Kitchen: vegetables, fruit, spices, chutneys (Cook pantry/chop/tadka/samosa/chaat)
| Word | Meaning | Gender | Sg / pl recorded | Mum? | Clip |
|---|---|---|---|---|---|
| bataato (Mum: *bateto*) | potato | he (-o) | bateto / **bateta** | **Y?** §34 P1 spelling ⚠ | `bateto`, `trae bateta` |
| dungri | onion | ? (-i, she?) | dungri = dungri | **Y** §34 P2 | yes |
| tameto | tomato | ? | "doesn't change" | **Y?** P3 ⚠ spelling | yes (`tameto`) |
| mirchi / marcha | chilli | ? | mirchi = mirchi (Mum P4) vs marcha pl (Zafar 26 Sept PM): **conflict**; game shows `marcha` for one and many | **Y?** / **Z** | `mirchi` yes |
| lal marcha | red chilli powder | ? | - | **N** | no |
| limu | lemon | ? | limu = limu | **Y** P5 | yes |
| lasan | garlic | ? | - | **N** handout/Sindhi cognate | no |
| aadu | ginger | ? | - | **N** | no |
| hardar | turmeric | ? | - | **N** | no |
| jeeru | cumin | ? | - | **N** | no |
| rai | mustard seeds | ? | - | **N** | no |
| elchi | cardamom | ? | - | **N** | no |
| loon | salt | ? | - | **N** | no |
| watana | peas | ? | - | **Y?** P11: *watana* = fried peas; green peas = *matar*; Cook needs to pick | `watana`, `matar` yes |
| chana | chickpeas | ? | - | **Y** B9 | yes |
| dai | yoghurt | ? | - | **Y** B8 (*mervan* = starter) | yes |
| sev | sev | ? | - | **Y** B29 | yes |
| dhania | coriander | ? | - | **Y** B30 (*fudino* = mint) | yes |
| chundo (alt keema) | mince | ? | - | **Z** 26 Sept (Mum said *chindo*); keema accepted | yes |
| amli ji chutney | tamarind chutney | she (`ji`) | - | **Y** B31 | yes |
| fudino ji chutney | mint chutney | she | - | **Y** B32 | yes |
| green pepper (`ph-pepper`) | - | - | - | **-** no word exists (B34) | - |
| kesar (saffron) | | | | **Y** §6 example only; not in data | no |

### 3C. People and kin
| Word | Meaning | Gender | Mum? | Used in |
|---|---|---|---|---|
| Nana / Nani | grandfather / grandmother | he / she | **Y** §30 K14 | Cook (customer, speaker), Conv, story |
| Ma | mother | she | **Y**? (clip not found alone; `Ma lai pan hakro banai` §8) | Cook customer |
| Ali | cousin | he | **Y** §30 K14 | Cook, Conv |
| Big Ma | great-grandmother | she | **open**: Big Ma / Wadima / Maji (§30) | Conv placeholder |
| beta | child/dear | - | **Y** §22 | story, Conv |
| mageni | guests | pl | **Y?** §33 S4 | story |
| chokro / chokri | boy / girl (pl chokra / chokriyu) | he / she | **Y** §35 C18-C19 | not yet in game |
| pacheri | shawl (dupatta) | she | **Y** C4 | dress (parked) |
| Isa, Kasuku, doctor | (Conv roster) | | no Kutchi | - |

### 3D. Body and clinic (Section G was skipped 28 Sept: no recordings)
Body parts used by the clinic (19): head, tummy, arm, leg, hand, foot, eye, ear, nose, mouth, tooth, throat, chest, neck, shoulder, elbow, knee, finger, toe. Kutchi known from notes: **akh** (eye, she, pl *akhyu*, ⚠ §35 C10), **gutan** (knee, he, pl gutan ⚠ C11), **hath** (hand, in *dabo hath* §17), **baju** (side, she). The other ~16 have **no word**. Care items (plaster, bandage, cool cloth, ice pack, hot-water bottle, blanket, tissue, pillow, dropper), tools (stethoscope, torch, thermometer, hand-look), feelings (hot, cold, just right, happy, sad), colours (red, green, blue, yellow): **all `-`**, except the food words borrowed from Cook (paani, dudh, chai, khun, loon, limu). Sides `dabo` / `jamno` are **Y** §15, §17 but the clinic's `side-left/right` are still null.

### 3E. Places/objects (notes only, not in game data)
rasoro/rasore (kitchen; also *jikoni*), kabaat (cupboard; also *pinjro*), saani (plate), chawi (key), darwajo (door), shelf, kam (work), film, time, warsaad (rain), mitai (sweets), jagai (space), akh, baju.

---

## 4. Adjectives, numbers, question words, postpositions, particles actually used

| Type | Word(s) | Used | Status |
|---|---|---|---|
| **Numbers** | hakro/hakri (1, gendered), ba (2, say "ber"), trae, char, panj (5) | Cook `grammar.numbers` 1-5 | hakro/hakri **Y** §2; ba **Y** §3 (game flag draft); trae/char/panj **N** (class handout only; Mum has not been asked them as a set); **no 6+** (`count` station goes to 6; the handout has chh/sat/ath/no/do unconfirmed) |
| **Size** | wadho/wadhi (big), nindho/nindhi (small) | maani L4 (`ba wadhi maani`), clinic heal | **Y** §4, §24 B6-B7 (she forms wadhi/nindhi confirmed) |
| **Amount** | adh (half), aako/aaki (whole/full), bharelo/bhareli (filled, heaped), ardo/ardi (half portion), kali (only) | chai L4 (`..., aako`, `..., adh` said bare), chop | **Y** §24 B4-B5, §25 B13; adh/aako in game (`joinless`) |
| **Tea kinds** | kari (black, no milk), mori (unsweetened) | chai heads (`Muke kari chai khape`) | **Y?** §10 (she forms; he forms *karo/moro* guessed) |
| **Manner/time** | aste thi (slowly), jaldi (quickly), thori war (a bit longer), thorok (a little), wadhare (more), bas (enough), hane (now, sequence), hever (now, general), pela (first), ne poi (and then) | stir speed, chop, tadka, sequences | **Y** §24 B2-B3, §25; thorok/wadhare ⚠; hever used only in clips |
| **Status words** | tayar (ready), theek (fine), fine (`bo fine`) | lines.ready, fine, story | **Y** §25 B22, §27 B43, §33 S2 |
| **Question words** | kuro (what), ker (who), kida (where), kitla (how many), kyo (which), ki (how) | Conv: `hi kuro ai?` (clip only), `kida ai?`, `Tu ki aiye?`, `toke kuro khapeto?`; Cook: none | **Y** §20, §23; kyo ⚠; *kere karein?* **not** Zafar-confirmed |
| **Pronouns / "to X"** | muke (to me), toke (to you, child), anke (to you, elder ⚠), panke (to us), tu/aai (you, child/elder), aau (I), e (he/she, also vocative), hi/hu (this/that), hida/huda (here/there) | Cook: muke only; Conv: muke, toke, tu, aai, aau, hida, huda | **Y** §21, §23, §37.1 |
| **Postpositions** | lai (for), sathe (with a person), me (in), waari (mixed in, *chai* only), ji/jo/je (of), ke (object marker / or), wagar ji (without), pan (also), je+mathe/niche/andar/puthiya/bajume/agiya/same/wich me | Cook: lai (forwho, unwired), waari, me (sugar, unwired), ji (bajr ji maani, amli ji chutney); Conv: clips only (`cup je andar`, `Nana sathe`); story: lai, me | **Y** §6, §8, §15, §18, §36; **no "with" for food** |
| **Conjunction/particles** | ne (and), ne poi, ke (or), na (no/don't, bare na is rude), ha (yes), nai (is not: `kenjo nai`, `ki baki nai`), ki na (nothing), o/oho (oh), e (hey/vocative), bo (very ⚠) | Cook: ne, ne poi, na, ha; story: nai, oho, bo | **Y** |
| **Interjections** | Shabash, Bas, Bareto, Ukreto, Arre re, Hedo, Ghan, Salamun alaykum, Khuda-fis, thank you | see 1C | see 1C |

---

## 5. Lines still in English (the gaps), by mode

### Cook (`data/cook.json`)
| Group | Count | Content | Why it matters to the engine |
|---|---|---|---|
| Join words `record:true` | 2 | `with {x}` (every order), `and {x}` (maani/samosa 2nd kind) | blocks natural full-sentence orders (Q5) |
| Pantry headline `record:true` | 1 (+plain form) | "Bring me these for {dish}" / "Bring me these" | pantry card |
| Guide box (Nani's "what to do now") | **30** | e.g. "Bring these from the pantry", "Pour it up to the line", "Put it in the pan", "Watch it; turn it down before it boils over", "Put in as many spoons as they said", "Roll the maani round", "Turn it over on the tawa", "Chop what they said", "Add the spices, in order", "Stir it round", "Make the bowl, in order", "Fill/Fold the samosa", "Fry them, then lift them out", "Thread/Grill the skewers", chai-tray phases (water / tea / knob / cups / pour), "Cook it the way they said" | all imperatives: need the cooking verbs |
| Long English bubble | 1 | `pocket`: "I'll give you pocket money for helping. Get it all right and be quick, and you get more!" | |
| `{x} times` | 1 | defined, unused | |
| Words with `kutchi:null` | 2 (+ `ph-turner` in maani-line.json) | green pepper (no word exists), pantry (Mum: *kabaat* / "not needed"), turner (Q15, *moikyo*? unconfirmed) | |
| Draft Kutchi (shown, flagged unconfirmed) | 13 lines + 5 words | lines: give, no, more, welcome, wait, first, need_waari, waari, sugar, for, lift, leave, little; words: ba (num-02), sekelo, lakri, pela, waari | |
| English UI not flagged (child may see it) | verdicts 16 ("Perfect!", "Burnt!", "Too much!"...), tips 22 ("Leave out what they said no to"...), station goals 18 + phases 14, recipe `how` 7, day titles/gists 6, receipt lines ("Helping Nani", "Understood (ear star)") | grown-up "?" text per rule 5 if kept behind "?", else a gap; verdicts/receipt are not behind "?" |
| Legacy non-Mum Kutchi still spoken | 6 | `Aabhar aanjo!`, `Achija!`, `Arre re!`, `Hedo!`, `Ghan.`, `Wa alaikum salaam!` (Mum: *Alaikum salaam!*) | replace with thank you / Khuda-fis / recorded forms |
| Ingredient words not from Mum (handout / Sindhi cognate / Zafar draft) | 9 | atto, lasan, aadu, hardar, jeeru, rai, elchi, loon, lal marcha (plus tameto and bataato spellings ⚠) | Cook says them constantly (tadka, pantry) |

### First launch: 0 English-only lines; 9 of 10 Kutchi lines carry Whisper spellings to check; S6 and S8 recorded but unused.

### Conversations (31 lines)
- Kutchi missing: `who-am-i` (Nana's "Do you know who I am?"), `name-bigma` (Big Ma / Wadima / Maji: Zafar to choose) = **2**.
- No audio at all: salaam-reply (`Wa alaikum salaam!`), howareyou-ki-ai (`Ki ai?`), want-x (`Muke {x} khape`), na-na-khape, thank-you, who-am-i, name-bigma = **7**.
- Noun clips missing alone: chai, paani, dudh, maani, daar, cup (for `Muke {x} khape` and `{x} kida ai?`).

### Clinic (essentially all placeholder)
- `clinic.json`: 43 lines (English only), 45 words (all `kutchi:null`), 53 items (9 with Kutchi = Cook's food words).
- `pipeline.json`: 37 lines, 28 bracketed placeholders; 6 person kinds; 10 ladder words (man/woman/boy/girl/old/young/tall/short/with the baby/with the child); 4 colours; 4 feelings; `getwell` null; 4 tool cues.
- Heal games (12 files in `data/clinic/heal/`): English lines and word labels; Kutchi only in numbers, pela, ne poi, paani, loon, wadho/nindho, adh, dudh, chai.

### Parked modes: tidy 41 + 9, who 13 + 23, dress 42 + 8, monsoon 11, snap 10 + 10, find 14 (null words + English-only lines).

---

## 6. Fragments (not full natural sentences)

| Where | What the game says | What a full sentence would need |
|---|---|---|
| Pantry | `Muke daar de. Ne atto. Ne khun.` | Mum's list form is `ne X, ne Y` (§6), but items 2+ are noun-only. Does she say `Muke daar, atto, ne khun de`? One `de` at the end? Gender/plural of each noun |
| Order cards (card rows) | `dudh`, `ba khun`, `dungri na`, `hakro tameto`, `hakri lakri gos` | The card is deliberately bare rows under a headline; the spoken version is the sentence, but the joins are English |
| Chai cup | `Muke elchi waari chai khape, with dudh, ba khun.` (and `dudh na`, `aako`/`adh` bare) | Native "with"/"and" for milk + sugar; Mum's one model is `Muke chai me ba khun khapeti` and `dudh waari chai`; half/full as a real clause |
| Daar | `Muke daar khape, with hakro tameto, ba marcha, trae dungri. Pela lasan. Ne poi rai. Ne poi loon.` | (a) "with" (b) tadka steps are bare nouns: needs a verb (*wij*) and whether `pela X wij, ne poi Y wij` is natural (Mum's model: `Muke pela daar khape, ne poi maani`) |
| Chop | `Kali ba dungri. Ne trae tameto.` / `Hane dungri!` | verb for chop/slice (none), "only ... and ..." as one sentence |
| Stir | `ba! trae!` ; `Hane aste thi!` / `Hane jaldi!` | verb stir + "N times"; `{x} times` is English |
| Fry | `Samosa hane kadh.` / `Chips chadi de.` | confirm object form/plural; Claude's noun-for-*inke* |
| Samosa | `Muke ba samosa khape, with ba chundo, hakro bataato, hakro marcha, dhania na; and samosa, with trae bataato.` | "with" for plural, "and" between kinds, `X na` inside a with-list |
| Sekelo | `Muke sekelo khape, with hakri lakri gos, hakri lakri mixed. Pela mishkaki. Ne poi dungri. Ne poi mishkaki.` | Mum only gave `hakri lakri mishkaki` (R7); `lakri gos/dungri/mixed` is Claude's extension; piece list needs a verb (thread = ?) |
| Maani | `Muke hakri maani khape, and ba bajr ji maani.` | "and" between kinds (Zafar wants one sentence) |
| Conversations answers | `Hida!`, `Huda!`, `Na.` | fine as answers; `Muke {x} khape` vs `khapeti/khapeto` still open |
| Clinic | `[My {part} hurts]`, `{side} {part}`, `{n} {drops}` | whole clinic vocabulary and verbs (hurts, check, listen, wrap) |
| Guide box | 30 English imperatives | one imperative verb each (see section 2) |

---

## 7. Summary: the smallest set of grammar facts and words for Cook to say everything as full sentences

1. **Headline frame** `Muke {x} khape.` (informal, fixed, **Y**) plus which ending Conversations should use (formal `khapeto/khapeti` needs each noun's gender: Mum uses them naturally).
2. **Gender of every countable noun** Cook counts: khun, dungri, tameto, bataato, mirchi/marcha, chundo, dhania, watana (+ daar, atto, chaat, samosa, sekelo for completeness). Drives `hakro/hakri`, `wadho/wadhi`, `karo/kari`, `nato/nati`. Default today is he (hakro).
3. **Plural rule**: -o to -a (*bateto/bateta*, *chamcho/chamcha*), -i and most others unchanged, irregular -yu/-u (akh/akhyu, chiju). Settle mirchi vs marcha and tameto spelling.
4. **A native "with" for food** (samosa with chundo; daar with onion; chai with milk) and **"and" between two kinds** of one dish: the single biggest blocker (Q5). Everything else in the order sentence is already confirmed.
5. **A list form**: how Mum says 3-6 items (pantry `Muke X de, ne Y, ne Z`; sugar/milk rows), and whether "one" is dropped.
6. **A step form**: `Pela X {verb}, ne poi Y {verb}`. Needs the verbs: *wij* (add, known) plus native verbs for chop/slice, stir, roll, fold, fill, fry, grill, pour, boil, flip, thread, light (none exist).
7. **Numbers 1-5 confirmed** as a set (trae/char/panj only heard), plus 6 if Cook keeps 6-spoon counts; "counting aloud" style (`ba!`).
8. **Negation set**: `X na` / `X nato|nati khape` / `X wagar ji {dish}`; which one the order card uses.
9. **Register pairs for every spoken line**: child `tu` / elder `aai` (`dinda` vs `dinde`, `kar`/`karo`, `aiye`/`aayo`), and boy/girl speaker (`dis/dos`).
10. **Replace non-Mum legacy lines** (thank you, goodbye, oops, hey, here) and record stand-alone clips for the most frequent words (chai, paani, dudh, khun, atto, daar, hakro/hakri, ba, trae, char, panj, pela, waari) so engine-built sentences are assembled from real voices.
