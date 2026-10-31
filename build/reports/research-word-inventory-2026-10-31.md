# Word inventory: the language the game already has (31 Oct 2026)

A read-only count of every English meaning the game has a word, a line or a plan for, and whether a family voice says it. Made for planning the next 12 trips and new modes. The full list is in `build/reports/research-word-inventory-2026-10-31.csv` (1027 rows). No Kutchi in this report or the CSV is new: every Kutchi spelling is copied from the repo.

**In one breath:** 1027 meanings. **166 are recorded** (16%): 83 single words or phrases with their own clip, and 83 whole fixed lines. **805 are in the engine or the game's data without a recording:** 321 of them have Kutchi, 484 are English only. **56 are only named in a doc.**

## Flaws first

1. **The brief and the repo disagree about `data/audio-manifest.json`.** The brief calls its three lists (`word` 20, `carrier` 15, `cook-tts` 196) family recordings. The repo says otherwise. `cook-tts` is text-to-speech made for testing (`data/cook-tts.json` says so; rule G14 says it never ships). `carrier` is also a placeholder voice (`js/shared/speech.js` says these are never used as templates). `word` (10 fruit ids, 3 number ids, 7 sentence ids, all from the old content master) has no source written down anywhere; none of its ids are in `family-audio.json` or `clips.json`, and the language engine ignores it (only older mode code plays those files). **I counted none of the three as recorded.** The real family recordings are `data/family-audio.json` (573 usable takes: Mum 424, Zafar 149). If the 20 `word` files are in fact the family's voice, the trip docs' "recorded: fruit names, the numbers" would hold for 10 of the 16 fruit names and the numbers 1 to 3 only; Zafar should say which they are.
2. **29 takes are on file but not linked to any word.** They sit in `family-audio.json`, nothing in `clips.json` points at them, so the game cannot play them. They include *Khuda hafiz!* (the game spells it khuda-fis, so the goodbye shows as unrecorded), *bateto* and *trae bateta* (the game spells potato bataato), and 12 "one X, two Xs" takes (cup, mango, door, dupatta, maani, table, both goats, girl, eye, knee) that each hold two phrases in one take and need splitting. The full list is in `data/lang/reports/clash-list.md` section 6 (it says 34; I count 29 with a playable file).
3. **357 of the 930 rows in `family-audio.json` cannot be played.** 314 have no file ("skipped": Mum did not know the word, or said it another way), and 43 have a file but are marked `redo` (never played). That leaves 573 usable takes. Three of the no-file rows have no id at all. 446 ids appear in two rows by design (one per speaker). Also, 19 rows in `clips.json` (13 clip ids) point only at ids with no playable take, so the engine believes those meanings have a clip and has nothing to play.
4. **Takes not yet ticked.** Of the 573 usable takes, 261 are `ok-auto`, 141 `ok` and 171 have no check mark; 42 of the recorded meanings rest on a take with no check mark, and 6 on a low-confidence take only (n.chips, v.cut, phrase.chop-it-small, phrase.no-thanks, phrase.sprinkle-put-a-little-in, phrase.turn-over-also-stir). `engine-design.md` says only `ok` takes ship (rule G16); `js/shared/family-voice.js` also plays `ok-auto` and unchecked ones. So "recorded" here means a playable take exists, not that it is cleared to ship.
5. **Duplicate meanings.** The lexicon has 976 entries but only 926 distinct English meanings: 50 entries repeat a meaning and I folded them in (the CSV `engine_ids` column shows each fold). Examples: egg, pot, mango, coconut, bowl, kitchen, samosa, mince, food and chips each have two entries because the family gives two words or two spellings (indo / mayai, tapelo / sufuria, ambo / aamo, nair / naariyel). Others are a word entry plus a phrase entry for the same thing (how many, where, eat, enough, more, well done, Nana, Nani, Ali, and the boy / the girl / the man / the woman). Also: *n.and-then* is an English-only placeholder for a phrase that is already recorded (*ne poi*). Two Kutchi words serve two meanings (*ma*: Ma and "among"; *ke*: "or" and the object marker), *na* is entered twice ("no" and "not"), and "hello back" has two entries for two spellings.
6. **Entries that are not real meanings.** About ten lexicon entries are fragments or labels left over from game screens: "a full glass of", "half a glass of", "all the", "leave the", "My left arm", "My right arm", "sip of", "sips of", "the waiting room's ladder words (W4)" (its gloss is a paragraph), "Clean it" (filed as a verb), "ones". I kept them as rows so the counts match the lexicon, but they are not vocabulary to plan around.
7. **Wrong part of speech in the lexicon.** These are typed as nouns but are not: old, young, short, tall, blue, mixed, yes, nothing, "and then", times, "with the baby", "with the child". *post.last* is an adjective; *adv.up / down / out* are positions. I re-typed them in the CSV `kind` column; the lexicon itself is unchanged.
8. **Missing or odd statuses.** Every one of the 976 lexicon entries has a status, so none is missing. But the status `to-record` means "no Kutchi at all, only English" (468 entries, 439 after folding), which is different from "Kutchi known, no recording". I split these in the counts. Separately, **45 meanings are used by game data (`data/day.json`, `days.json`, `day-book.json`) with no lexicon entry at all**, so they have no status anywhere: the 18 ride things (cow, sheep, donkey, horse, buffalo, duck, camel, chick, butterfly, tractor, bicycle, bus, milk van, aeroplane, kite, windmill, well, rainbow), sun, cloud, the three place cards (clinic, farm, market) and 22 story-day sentences (the weather lines, the day lines, goodnight, see you tomorrow, speed up, slow down, and the evening-book frames).
9. **A source file that is gone.** 74 citations in 70 lexicon entries point to `data/clinic/lang.json`, which is not in the repo (the clinic's language seed now lives at `data/lang/seed/clinic.json`).
10. **Class-handout words presented as Kutchi.** 37 entries have the class handout as their only source (all `draft`): most of the handout fruit and vegetable names (banana *kelo*, papaya, pear, kiwi, grapes, fig, carrot, spinach and others), the spices, the numbers 6 to 10, and the second words for mango and coconut. `lexicon.md` section 4 says the handout is a third-party course and may be a map, never shipped text; Mum has not confirmed these. They count as "in the engine" here, but I would not plan a mode on them.
11. **Docs against data (trip docs).** The "Words it needs" sections say "Recorded" for 51 items. In the data: **33 hold** (a clip of that word on its own), **10 are heard only inside longer lines** (goat, big, under, "I'd like", "on the table", three, on, coconut, the big one), and **8 have no recording** (hen, the numbers 1 to 10, the 16 fruit names except lemon, "take one yourself", come with me, cassava, "don't run, walk"). Going the other way, farm.md lists "coconut chutney" under "to record" but *nair ji chutney* is recorded. Full table below.
12. **Ride words that do not match the lexicon.** The ride's "hen" uses `n.chicken`, but the lexicon's chicken is Mum's cooking word (*murgi*); the ride's "goat" uses `n.she-goat` only; the ride's chick is "hen with her chicks". `farm.md` names *gai* for cow ("Zafar"), but that word is in no data file.
13. **Gender unknown for most nouns.** Of the 162 nouns that have Kutchi, 112 have no gender recorded. The engine uses the he-form and flags it. Any new noun mode will hit this.
14. **The engine cannot yet build many sentences.** `concrete.json` has 123 rules: 38 confirmed, 22 draft, **63 unknown** (waiting on Mum). Blocking for Cook: "with" and "and" for food, "times", "in my tea I want". The clinic has 42 sentences it cannot say (`data/lang/reports/gap-list.md`). Open spelling clashes (11) and two-word choices (6) are in `clash-list.md`; I did not recount them.
15. **A speaking moment that cannot work on today's data.** The chai-tray microphone (call *chai* when the pan is ready) shows only where Mum has recorded every word of its set (chai, paani, dudh) as a single word. None of the three has a standalone take, so the microphone never appears. More under "Speaking moments".
16. **A recorded phrase Zafar does not recognise.** *kere karein* ("who did it?") has a take but `conversations.md` says do not use it.

### Trip docs: "Recorded" claims against the data

| Trip | The doc says recorded | What the data says | Kutchi in the repo |
|---|---|---|---|
| farm | goat | only inside a longer recorded line | Nani ji bakri / Nani jo bakro / bakra sathe |
| farm | hen | Kutchi in engine, no recording | murgi |
| farm | egg | recorded (own clip) | indo / mayai |
| farm | corn on the cob | recorded (own clip) | makai |
| farm | lemons | recorded (own clip) | limu |
| farm | big | only inside a longer recorded line | wadho |
| farm | small | recorded (own clip) | nindho |
| farm | the numbers (1-5) | 0 of 5 have their own clip; 5 have Kutchi in the engine; 3 more heard only inside longer lines |  |
| farm | how many? | recorded (own clip) | kitla |
| farm | with the goat | recorded (own clip) | bakri sathe |
| farm | under | only inside a longer recorded line | table je niche |
| farm | mint chutney | recorded (own clip) | fudino ji chutney |
| farm | tamarind chutney | recorded (own clip) | amli ji chutney |
| shops | onions | recorded (own clip) | dungri |
| shops | lemons | recorded (own clip) | limu |
| shops | chickpeas | recorded (own clip) | chana |
| shops | fruit names (16 handout fruits) | 1 of 16 have their own clip; 16 have Kutchi in the engine; 2 more heard only inside longer lines |  |
| shops | the red one | recorded (own clip) | laal |
| shops | the big one | only inside a longer recorded line | wadho ginech, nindho ginech |
| shops | take one yourself | Kutchi in engine, no recording | khanigin |
| shops | what would you like? | recorded (own clip) | toke kuro khapeto |
| shops | I'd like ... | only inside a longer recorded line | Muke chai khapeti / Muke dudh khapeto / Muke paani khapeto |
| shops | numbers | 0 of 10 have their own clip; 10 have Kutchi in the engine; 3 more heard only inside longer lines |  |
| shops | in the cupboard | recorded (own clip) | kabaat |
| shops | on the table | only inside a longer recorded line | mathe, table |
| shops | fried peas | recorded (own clip) | watana |
| shops | a little | recorded (own clip) | thorok |
| shops | more | recorded (own clip) | wadhare |
| shops | enough | recorded (own clip) | bas |
| beach | hot | recorded (own clip) | garam |
| beach | cold | recorded (own clip) | thundo |
| beach | big | only inside a longer recorded line | wadho |
| beach | small | recorded (own clip) | nindho |
| beach | the red one | recorded (own clip) | laal |
| beach | three | only inside a longer recorded line | trae |
| beach | how many | recorded (own clip) | kitla |
| beach | come with me | Kutchi in engine, no recording | hal mu saathe |
| beach | a little | recorded (own clip) | thorok |
| beach | fill it | recorded (own clip) | bhar |
| beach | and then | recorded (own clip) | ne poi |
| beach | on | only inside a longer recorded line | amba je mathe / maani je mathe / makai |
| beach | slowly | recorded (own clip) | aste thi |
| beach | quickly | recorded (own clip) | jaldi |
| beach | careful | recorded (own clip) | dhyan rakh |
| beach | now | recorded (own clip) | hane, hever |
| beach | corn | recorded (own clip) | makai |
| beach | cassava | Kutchi in engine, no recording | mogo |
| beach | coconut (nair) | only inside a longer recorded line | nair / naariyel |
| beach | lemons | recorded (own clip) | limu |
| beach | don't run, walk | Kutchi in engine, no recording | bhaj na, hal |
| beach | wait for me | recorded (own clip) | mu lai khobar |

### Trip and mode docs: "to record" items that are already in the data

| Doc | Term | What the data says | Kutchi in the repo |
|---|---|---|---|
| farm.md | hat | in lexicon, no Kutchi (English placeholder) |  |
| farm.md | cow | in game data, no Kutchi |  |
| farm.md | farm | in game data, no Kutchi |  |
| farm.md | chick | in game data, no Kutchi |  |
| farm.md | chilli powder | Kutchi in engine, no recording | laal marcha |
| farm.md | salt | Kutchi in engine, no recording | loon |
| farm.md | pepper | Kutchi in engine, no recording | mari |
| farm.md | coconut chutney | recorded (own clip) | nair ji chutney |
| farm.md | speed up | in game data, no Kutchi |  |
| farm.md | slow down | in game data, no Kutchi |  |
| shops.md | market | in game data, no Kutchi |  |
| shops.md | left | Kutchi in engine, no recording | dabo |
| shops.md | right | Kutchi in engine, no recording | jamni |
| shops.md | goat | only inside a longer recorded line | bakri, bakro |
| shops.md | cloth | in lexicon, no Kutchi (English placeholder) |  |
| shops.md | kite | in game data, no Kutchi |  |
| beach.md | bucket | in lexicon, no Kutchi (English placeholder) |  |
| beach.md | kite | in game data, no Kutchi |  |
| beach.md | sun hat | in lexicon, no Kutchi (English placeholder) |  |
| beach.md | bus | in game data, no Kutchi |  |
| beach.md | camel | in game data, no Kutchi |  |
| modes/clinic.md | honey | in lexicon, no Kutchi (English placeholder) |  |
| modes/clinic.md | make | only inside a longer recorded line | banai |

The other 56 "to record" items in the trip docs, the mode docs and the recording sheet's ride candidates are not in the lexicon or any game data. They are the rows with status `planned` (56).

## Counts

Rows are distinct English meanings: 926 from the lexicon (976 entries, 50 folded as repeats), 45 in game data with no lexicon entry, 56 named only in docs.

**By status**

| Status | Rows | Detail |
|---|---|---|
| recorded | 166 | 83 are words or compound nouns with their own clip; 83 are fixed lines recorded whole |
| in-engine-not-recorded | 805 | 321 have Kutchi in the engine (105 of them heard only inside a longer recorded line); 484 are English only (placeholders or game-data meanings) |
| planned | 56 | only named in a doc |
| **total** | **1027** | |

**By kind, and status within kind**

| Kind | Rows | recorded | in-engine-not-recorded | planned |
|---|---|---|---|---|
| noun | 362 | 47 | 276 | 39 |
| verb | 62 | 10 | 51 | 1 |
| adjective | 49 | 10 | 34 | 5 |
| adverb | 22 | 10 | 12 | 0 |
| number | 10 | 0 | 10 | 0 |
| pronoun | 13 | 2 | 11 | 0 |
| question word | 7 | 2 | 5 | 0 |
| postposition-or-position | 32 | 2 | 29 | 1 |
| phrase-or-sentence | 462 | 83 | 369 | 10 |
| other | 8 | 0 | 8 | 0 |
| **total** | **1027** | **166** | **805** | **56** |

Kind notes: names (Nani, Ali, Simba) count as nouns; interjections and "and / or" count as other; yes, no and one-word calls (Eat!, Enough!) were merged into their word's row where the lexicon had both.

## By topic

"In engine (Kutchi)" has Kutchi in the lexicon but no clip of its own. "In engine (English only)" is an English placeholder or a meaning named by game data. Topics with no row (sports-games, music-arts) are listed so the gaps are visible.

| Topic | Recorded | In engine (Kutchi) | In engine (English only) | Planned | Total |
|---|---|---|---|---|---|
| greetings-politeness | 15 | 12 | 9 | 3 | 39 |
| family-people | 9 | 6 | 7 | 1 | 23 |
| body | 1 | 4 | 19 | 1 | 25 |
| health-feelings | 0 | 4 | 122 | 5 | 131 |
| food-drink | 30 | 62 | 7 | 1 | 100 |
| cooking-kitchen | 46 | 27 | 53 | 0 | 126 |
| home-rooms | 9 | 8 | 2 | 0 | 19 |
| household-objects | 0 | 7 | 36 | 3 | 46 |
| clothes | 0 | 2 | 19 | 2 | 23 |
| colours | 2 | 2 | 15 | 1 | 20 |
| shapes-sizes | 2 | 9 | 2 | 0 | 13 |
| numbers-counting | 0 | 10 | 5 | 0 | 15 |
| money-shopping | 1 | 3 | 2 | 6 | 12 |
| time-days-seasons | 4 | 9 | 0 | 0 | 13 |
| weather-nature | 0 | 2 | 16 | 0 | 18 |
| animals-farm | 0 | 2 | 8 | 4 | 14 |
| animals-wild | 0 | 1 | 1 | 5 | 7 |
| animals-pets-small | 0 | 7 | 1 | 0 | 8 |
| sea-beach | 0 | 0 | 0 | 10 | 10 |
| plants-garden | 0 | 0 | 3 | 2 | 5 |
| places-town | 0 | 1 | 8 | 0 | 9 |
| transport-travel | 0 | 5 | 7 | 4 | 16 |
| jobs-people | 0 | 0 | 5 | 0 | 5 |
| school-learning | 0 | 1 | 0 | 0 | 1 |
| toys-play | 0 | 0 | 3 | 0 | 3 |
| sports-games | 0 | 0 | 0 | 0 | 0 |
| music-arts | 0 | 0 | 0 | 0 | 0 |
| positions-directions | 4 | 21 | 23 | 2 | 50 |
| describing-words | 9 | 13 | 4 | 1 | 27 |
| actions | 6 | 53 | 22 | 1 | 82 |
| question-words | 8 | 7 | 7 | 2 | 24 |
| pronouns-possession | 8 | 16 | 0 | 0 | 24 |
| quantities | 8 | 9 | 3 | 0 | 20 |
| celebrations | 1 | 1 | 0 | 1 | 3 |
| routines-daily-life | 0 | 4 | 8 | 0 | 12 |
| technology | 0 | 1 | 2 | 1 | 4 |
| other:grammar-words | 1 | 11 | 1 | 0 | 13 |
| other:small-talk | 0 | 0 | 26 | 0 | 26 |
| other:sounds | 2 | 1 | 38 | 0 | 41 |
| **total** | **166** | **321** | **484** | **56** | **1027** |

Reading it: health-feelings (the doctor's lines) and the fragments in `other:small-talk` and `other:sounds` are almost all English-only placeholders. Food, cooking, greetings and family names carry most of what is recorded. **Topics with more than three rows and nothing recorded on its own:** animals-farm, animals-pets-small, animals-wild, clothes, health-feelings, household-objects, jobs-people, numbers-counting, other:small-talk, places-town, plants-garden, routines-daily-life, sea-beach, technology, transport-travel, weather-nature. Of these, sea-beach has nothing in the engine at all (its 10 rows are all planned). Very thin: body (1 recorded: *kan*), colours (*laal* only), positions (*hida* and *huda* only; under, on, in and behind are heard only inside longer lines), numbers (no number has a clip of its own; they are heard inside lines such as *trae dungri*).

## Verbs

61 verb rows from the lexicon (one more, *feed*, is only named in farm.md). "Recorded alone" means a family clip says exactly that form. "Heard inside a line" means the form appears in a longer recorded sentence (found by matching the spelling, so a very short form such as *de* or *we* cannot be checked this way and is listed as engine only). "Not known yet" means the engine has asked Mum and has no answer. The polite (elder) command form is unknown for most verbs.

| Verb | Kutchi | Status | Forms recorded alone | Forms heard inside a longer line | Forms in the engine, no clip | Not known yet |
|---|---|---|---|---|---|---|
| boil | ukar | recorded | imperative (to a child) ukar; present (he-thing/man) ukreto | - | - | imperative (to an elder) |
| cut | kap / kapi chad | recorded as a phrase only | - | imperative (to a child) kap; "having done" form kapi | - | imperative (to an elder) |
| do, make | kar | recorded | imperative (to a child) kar | imperative (to an elder) karo; "having done" form kari | - | - |
| eat | kha | recorded | imperative (to a child) kha | present, I (man) kianto; present, I (woman) kianti; present, you (boy) khaito; present, you (girl) khaiti; present, he khaito; present, she khaiti; present, you (elder) kianta; present, we kianta; present, they kenta | "having done" form khai | imperative (to an elder) |
| fill | bhar | recorded | imperative (to a child) bhar | "having done" form bhari | - | imperative (to an elder) |
| knead | gund | recorded | imperative (to a child) gund | - | - | imperative (to an elder) |
| light | bar | recorded | imperative (to a child) bar | - | - | imperative (to an elder) |
| press | dabai | recorded | imperative (to a child) dabai | - | - | imperative (to an elder) |
| taste | chakh | recorded | imperative (to a child) chakh | - | future, I chakha | imperative (to an elder) |
| turn, flip, stir | firai | recorded | imperative (to a child) firai; "having done" form firai | - | - | imperative (to an elder) |
| be | ai | Kutchi in engine | - | I am aiya; we are aayo; you are (child) aiye; you are (elder) aayo; they are ain | he/she is ai | - |
| be over | pati | Kutchi in engine | - | - | "having done" form pati | - |
| be wanted | khape | Kutchi in engine | - | informal khape; present (he-thing/man) khapeto; present (she-thing/woman) khapeti; future (he) khapdo | present (he, plural) khapanta; present (she, plural) khapanti | - |
| become, happen | thai | Kutchi in engine | - | "having done" form thai | - | - |
| bring | khanech | Kutchi in engine | - | "having done" form khanechi | imperative (to a child) khanech | imperative (to an elder) |
| bring along, take with you | khanij | Kutchi in engine | - | - | imperative (to a child) khanij | imperative (to an elder) |
| brush | (no Kutchi yet) | English only | - | - | - | - |
| buy, fetch | ginech | Kutchi in engine | - | imperative (to a child) ginech | - | imperative (to an elder) |
| can, be able to | saka | Kutchi in engine | - | present, I (woman) sakati; present, I (man) sakanto; present, she saketi; present, he saketo; present, they sakanto; can't, I (man) sakanto; can't, I (woman) saketi | - | - |
| close | (no Kutchi yet) | English only | - | - | - | - |
| come | ach | Kutchi in engine | - | present (he, plural) achenta | imperative (to a child) ach; imperative (to an elder) acho; "having done" form achi; future (he) achdo; future (he, plural) achda | - |
| fold | waar | Kutchi in engine | - | - | imperative (to a child) waar | imperative (to an elder) |
| fry | tar | Kutchi in engine | - | - | imperative (to a child) tar | imperative (to an elder) |
| give | de | Kutchi in engine | - | future, you (child) dinda; future, you (elder) dinda; future, I (woman) dis; future, I (man) dos; past, I (man) dinos; past, I (woman) dinis; past, he dino; past, she dini | imperative (to a child) de | imperative (to an elder) |
| go | winni | Kutchi in engine | - | "having done" form winni | - | - |
| help | help | Kutchi in engine | - | base form help | - | - |
| leave, finish | chad | Kutchi in engine | - | imperative (to a child) chad; "having done" form chadi | - | imperative (to an elder) |
| let's go | winja | Kutchi in engine | - | imperative (to a child) winja | present, we winjanta | imperative (to an elder) |
| like | arre | Kutchi in engine | - | present (she-thing/woman) arreti | present (he-thing/man) arreto | - |
| look | nar | Kutchi in engine | - | past, I (man) naryos; past, I (woman) naris; present, I (man) narato; present, I (woman) narati; future, I (man) nardos; future, I (woman) nardis | imperative (to a child) nar | imperative (to an elder) |
| make | banai | Kutchi in engine | - | imperative (to a child) banai; "having done" form banai | - | imperative (to an elder) |
| mix | mix | Kutchi in engine | - | - | base form mix | - |
| open | (no Kutchi yet) | English only | - | - | - | - |
| pop | (no Kutchi yet) | English only | - | - | - | - |
| pour | (no Kutchi yet) | English only | - | - | - | - |
| put | rakh | Kutchi in engine | - | imperative (to a child) rakh | "having done" form rakhi | imperative (to an elder) |
| put in, add | wij | Kutchi in engine | - | imperative (to a child) wij; "having done" form wiji | - | imperative (to an elder) |
| put on | (no Kutchi yet) | English only | - | - | - | - |
| roll | (no Kutchi yet) | English only | - | - | - | - |
| run | bhaj | Kutchi in engine | - | - | imperative (to a child) bhaj | imperative (to an elder) |
| serve | (no Kutchi yet) | English only | - | - | - | - |
| sit | we | Kutchi in engine | - | - | imperative (to a child) we | imperative (to an elder) |
| speak | bol | Kutchi in engine | - | - | imperative (to a child) bol | imperative (to an elder) |
| spill | dhor | Kutchi in engine | - | - | imperative (to a child) dhor | imperative (to an elder) |
| sprinkle | (no Kutchi yet) | English only | - | - | - | - |
| switch off | (no Kutchi yet) | English only | - | - | - | - |
| switch on | (no Kutchi yet) | English only | - | - | - | - |
| take | khan | Kutchi in engine | - | - | imperative (to a child) khan; "having done" form khani | imperative (to an elder) |
| take it yourself, pick one yourself | khanigin | Kutchi in engine | - | - | imperative (to a child) khanigin | imperative (to an elder) |
| take out | kadh | Kutchi in engine | - | imperative (to a child) kadh; "having done" form kadhi | future, I kadhu | imperative (to an elder) |
| to cook | randhnu | Kutchi in engine | - | base form randhnu | - | - |
| to go | winnu | Kutchi in engine | - | base form winnu | - | - |
| touch | ad | Kutchi in engine | - | - | imperative (to a child) ad | imperative (to an elder) |
| use | wapur | Kutchi in engine | - | - | imperative (to a child) wapur | imperative (to an elder) |
| wait | khobar | Kutchi in engine | - | imperative (to a child) khobar | - | imperative (to an elder) |
| walk, come, go | hal | Kutchi in engine | - | imperative (to a child) hal | - | imperative (to an elder) |
| want to | aaye | Kutchi in engine | - | base form aaye | - | - |
| was | wo | Kutchi in engine | - | - | past (he/it) wo | - |
| wash | dho | Kutchi in engine | - | imperative (to a child) dho | - | imperative (to an elder) |
| went, became | vyo | Kutchi in engine | - | past (he/it) vyo | past (she/it) vai; past (plural) vya | - |
| wipe | (no Kutchi yet) | English only | - | - | - | - |

Summary: 10 of 61 verb rows are recorded (boil; cut; do; eat; fill; knead; light; press; taste; turn. *Cut* is recorded only as the phrase *kapi chad*, not as the bare verb). Verbs with no Kutchi form at all: brush, close, open, pop, pour, put on, roll, serve, sprinkle, switch off, switch on, wipe. Verb frames recorded as whole sentences are in the next section (want to, have to, need to, can, can't, like, need, gave, saw, eats every day).

## Phrase and sentence frames recorded

Each frame is a rule in `abstract.json`/`concrete.json`; a row says how many family sentences (clips with a meaning key) fill it today, with an example. Speakers: Mum, Zafar. Man / woman speaker variants count separately.

| Frame (English) | Engine name | Recorded sentences | Example (Kutchi in repo = English) |
|---|---|---|---|
| {n} {mods} {kind} {with} {without} | Item | 50 | wadho chokro = the big boy / wadha chokra = the big boys |
| {owner}'s {thing} | Of | 26 | Nana jo ambo = Nana's mango / Nani jo ambo = Nani's mango |
| {owner}'s {thing} | PossPron | 17 | munjo ambo = my mango / munja amba = my mangoes |
| with {x} | With | 14 | chokre sathe = with the boy / chokriyu sathe = with the girls |
| {thing} is {quality}. | IsA | 14 | Chokro wadho ai. = The boy is big. / Chokra wadha ain. = The boys are big. |
| I'd like {thing}. | Need | 11 | Muke chai khapeti = I'd like chai / Muke chai khapeti = I want chai. |
| {rel} {anchor} | Place | 11 | wadhe ambe je mathe = on the big mango / darwaje je puthiya = behind the door (one or more) |
| {who} {verb} {thing} every day. | EveryDay | 10 | Aai roj maani kianta = You eat maani every day. (to an elder) / Aau roj maani kianti = I eat maani every day. (a woman says it) |
| {who} saw / see / will see {whom}. | See | 10 | Aau toke naris = I saw you. (to a child; a woman says it) / Aau anke naris = I saw you. (to an elder; a woman says it) |
| {who} gave {thing} to {to}. | GaveTo | 8 | Nana muke ambo dino = Nana gave me the mango. / Aau toke ambo dinis = I gave you the mango. (to a child; a woman says it) |
| {who} need(s) {thing}. | NeedThing | 8 | Muke chai ji jaruri = I need chai. / Toke chai ji jaruri = You need chai. (to a child) |
| Can you make me {thing}? | CanYouMake | 6 | Tu muke maani banai dinda? = Can you make me maani? / Aai muke chai banai dinda? = Can you make me some chai? (to an elder) |
| {who} can {verb}. | CanDo | 5 | Aau winni sakati = I can go. (a woman says it) / E winni saketi = She can go. |
| {verb} {obj}! | Command | 4 | chulo bar = light the stove / atto gund = knead the dough |
| {who} like(s) {thing}. | Likes | 3 | Muke chai arreti = I like chai. / Inke chai arreti = She likes chai. |
| {who} want(s) to {verb}. | WantTo | 3 | Muke winnu aaye = I want to go. / Inke winnu aaye = She wants to go. |
| {who} has to {verb} (ought to, is obliged to). | HaveTo | 3 | Muke winnu khapdo = I have to go. / Inke winnu khapdo = She has to go. |
| in {x} | In | 3 | wadhe cup me = in the big cup / munje cup me = in my cup |
| {who} need(s) to {verb}. | NeedTo | 2 | Muke winnu ji jaruri = I need to go. / Inke winnu ji jaruri = He (or she) needs to go. |
| on {x} | On | 2 | amba je mathe = on the mangoes / maani je mathe = on the maani (one or more) |
| on {x} (the short way) | OnShort | 2 | toje ambe mathe = on your mango (to a child) / toji kursi mathe = on your chair (to a child) |
| {who} in {place}. | BeIn | 2 | Pa rasore me aayo. = We (with you) are in the kitchen. / Asa rasore me aayo. = We (not you) are in the kitchen. |
| Where is {thing}? | Where | 2 | Cup kida ai? = Where's the cup? / Chamchi kida ai? = Where's the teaspoon? |
| Give me {x}. | GiveMe | 2 | Muke chamchi de = Pass me the teaspoon. / Muke chamcho de = Pass me the tablespoon. |
| {n} {unit} of {of} | Unit | 2 | hakri lakri mishkaki = one skewer of mishkaki |
| How are you? | HowAreYou | 2 | Tu ki aiye? = How are you? (to a child) / Aai ki aayo? = How are you? (to an elder) |
| {verb} it {obj}! | DoIt | 1 | paani bhari chad = fill it with water |
| Lift out the {x}. | Lift | 1 | hane kadh = lift it out now |
| Leave the {x}. | Leave | 1 | chadi de = leave it (in) |
| I'm fine. | ImFine | 1 | Aau theek ai = I'm fine |
| {which} {x} | Point | 1 | hu nindhi chokri = that small girl |

Fixed lines (no slots): 83 phrases recorded whole (rows with kind phrase-or-sentence and status recorded in the CSV). They cover greetings (*salamun alaykum*, *alaikum salaam*; *khuda hafiz* is on file but unlinked), yes, no, *na, thank you*, *shabash*, *dhyan rakh*, *jaldi kar* / *jaldi karo*, how are you (to a child and to an elder) and the answers, "what would you like?", "who's there?", "what's this?", "where is it?", the cooking calls (*ukreto*, *bareto*, *tayar ai*, *bas*, *wadhare*, *thorok*), the cooking commands, and the first-launch lines ("will you help me cook?", "guests are coming", "tomorrow is Eid", "oh no, there's no food").

Not yet any recorded frame for: past tense beyond "gave", "saw" and "it's gone cold"; "is" for places other than the kitchen; questions other than who / what / where / which / how many; positions other than on, in, inside, under and behind; "and" and "with" for food; times; colours beyond *laal*; weather.

## Speaking moments

Where the child speaks Kutchi today. Every one is optional (the pills are the fallback, a grown-up can tick). The microphone only appears where every word of the closed set has a single-word family take.

| # | Moment | Where | Closed set | Can the mic show on today's data? |
|---|---|---|---|---|
| 1 | Call *chai* when the pan is ready | Cook, chai tray (`js/cook/stations/chai-tray.js`) | chai, paani, dudh | **No.** None of the three has a standalone take, and the code looks for them in the old `word` folder, which has none. |
| 2 | Say *haa* or *na* in the eye test | Clinic heal game, eye (`js/clinic/heal/games/eye.js`) | ha, na | **Yes**, as far as the data goes: takes of *ha* and *na* exist (Mum and Zafar). |
| 3 | Say the goodbye (from level 2) | Clinic send-off (`js/clinic/stages/sendoff.js`) | goodbye, thank you, get well soon (`data/clinic/pipeline.json` goodbyes) | **Partly.** Goodbye has a take (*Khuda hafiz!*) but it is not linked; "thank you" has no take of its own; "get well soon" is English only. |
| 4 | Ask the patient "How do you feel?" (level 3) | Clinic send-off | the feeling question | **No.** English only. |
| 5 | Call the patient in | Clinic waiting room, W3 (`waiting.js`) | man, woman, boy, girl and so on | **No** for most (English only; only *chokro* and *chokri* are Kutchi). The code still has it; `waiting.js` and `speaking.md` say W3 was dropped. |
| 6 | Name the picture ("Say it") | Evening book, name-it game (`js/day/book-play.js`) | three words of the day | Depends on the day's words; only words with their own take qualify. |
| 7 | Role reversal: say the order, the character acts on it | Find it, `tell` mechanic (`js/find/mechanics/tell.js`): "You're Nani" and "Ask for one" | the stall's kinds | In the lab only (the mic is a picker); Find it is not on the shared core yet. |
| 8 | Conversations, rungs 4 and 5 (spoken replies) | `js/shared/conversations.js` | 9 MVP exchanges (greet, bye, how are you, make me chai, help me cook, what would you like, you're welcome, who am I, where is it) | **Not built.** The code says rungs 4 and 5 are not in the MVP. Rung 4 is allowed only where every answer has a family take. |
| 9 | Parked: Dress up (bangles), Tidy up (Ali, check), Monsoon rush (call it), Who did it (tell) | `js/dress`, `js/tidy`, `js/monsoon`, `js/who` | various | Parked with their modes. |

Designed in `docs/game-design/speaking.md` and **not built**: Cook role reversal (the chai ordering pilot: *Toke kuro khapeto?* then the child says *Muke chai khape*), the trips' food stall, the pantry, the clinic pharmacy, "you're the patient", the birthday host, put-it-there, hide and seek, who did it, making clothes. The model lines for the pilot (*Toke kuro khapeto?*, *Muke chai khapeti*) are recorded; the child's side, as a single closed-set answer, would need *chai* on its own.

Also: a parent log of speaking moments exists in code (`Speech.log`), device only, no audio.

## How I counted

**Sources read.** `data/lang/lexicon.json` (976 entries), `clips.json` (653 rows), `concrete.json`, `abstract.json`, `paradigms.json`, `elicit.json`, `params.json`; `data/family-audio.json` (930 rows); `data/audio-manifest.json`; `data/cook.json`, `content.json`, `day.json`, `days.json`, `day-book.json`, `find.json`, `tidy.json`, `dress.json`, `who.json`, `monsoon.json`, `relations.json`, `snap.json`, `clinic.json`, `clinic/pipeline.json`, `clinic/heal/*.json`, `conversations/*.json`, `story/first-launch.json`, `stations/*.json`; the "Words it needs" of farm, shops, beach, safari and boat; the word lists in `modes/clinic.md`, `conversations.md`, `first-launch.md`; `lexicon.md`, `recording-sheet.md`, `lang/reports/*.md`.

**Rows.** One row per lexicon entry, then entries with the same English folded together (50 folds, listed in `engine_ids`). Then one row per meaning that `day.json`, `days.json` or `day-book.json` asks for but the lexicon lacks (45), then one row per term the docs call "to record" that is in neither (56). A check of the `words` tables of cook.json, content.json, dress.json, tidy.json, who.json, monsoon.json, relations.json, find.json, clinic.json and the heal games found every id already in the lexicon (only the sample file `examples/chips-mayai.json` is outside it). Of the lines files, 6 frame lines in `conversations/lines.json` and one sound (`laugh`) in `story/first-launch.json` have no lexicon entry of their own; they are built from frames.

**Status.** `recorded` = at least one usable take says that exact word or line on its own. A take is usable if `family-audio.json` gives it a file and it is not marked `redo`. The link is `clips.json` (a `lex` row for a word form, a `Say(phrase.x)` or `Item(n.x)` meaning for a whole phrase or compound noun); I also matched every lexicon spelling against the take texts, and the text match found nothing the links had missed. `in-engine-not-recorded` = in the lexicon or in game data and no such take. A word that only appears inside a longer recorded sentence stays here, and the CSV `recorded_detail` column says "heard only inside N longer recorded line(s)" (105 rows). `planned` = only in a doc.

**Kind** comes from the lexicon's part-of-speech, with the corrections in flaw 7. **Topic** is my own assignment from the English: by hand for the 533 non-phrase entries, by keyword rules plus hand fixes for the 443 phrase entries; it is a judgement, not data, so a few rows could sit in a neighbouring topic. **Where** comes from the sources each lexicon entry cites (cook.json is Cook, clinic files are the clinic and its heal games, and so on) plus the story-day files that mention its id; "no game uses it yet" means only Mum's recordings or notes cite it. **Voices** and **take_check** come from the takes that matched.

**Verb forms** come from each verb's `forms` cells in the lexicon. A form is "recorded alone" if a take's text equals it; "heard inside a longer line" if the spelling is a word of a longer take (forms shorter than three letters are not checked). Recorded sentence frames come from the meaning keys in `clips.json`.

**Checks you can rerun.** Lexicon: 976 entries = 443 phrase + 533 other (see `coverage.md`); statuses 468 to-record, 344 confirmed, 164 draft. Takes: 930 rows, 616 with a file, 573 not marked redo, 413 distinct spoken lines. Recorded rows = 166; rows total = 1027.

**Not done.** I did not play any audio, so a clip's content is taken from its transcript in `family-audio.json`, which Whisper wrote and Zafar has only partly ticked. I did not test which sentences the engine could build by rule without a clip (`coverage.md` counts 237 of the 653 clip rows as sentences built by rules). I did not recount `clash-list.md` or `gap-list.md`; their numbers are quoted.
