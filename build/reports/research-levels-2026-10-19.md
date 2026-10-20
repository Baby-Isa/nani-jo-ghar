# Cook levels: one table for every station (design pass, 19 Oct)

## Conclusion

The memory game has one cause: from L3 the card closes and nothing then says a step, so the child holds a whole order in their head. The fix is **Nani calling each step live, at every level**: when a step opens she says it once, short, and the child only ever holds one step. The card becomes a support that fades by level (open, open, dotted, hidden), not what makes a level hard. Listening stays the test because every call is "pick this from several, count this yourself": nothing glows, nothing stops by itself, nothing is written where it can be matched. It is the clinic's L1 ("lines one at a time") made the rule for every level and mode.

Terms: a **step call** is Nani saying the next step once when it opens (the order, in pieces). **Help** is the glow plus re-say after idle time, and the two bulbs. Help costs; calls and replays never do.

## 1. The level table (every station, Cook and clinic)

| | Card | Nani's step call | Help (18 Oct ladder) | Decoys | Counts | The one new thing |
|---|---|---|---|---|---|---|
| L1 | Open: every word and number | Each step once as it opens, and she **counts along** the child's taps (never stopping them) | First play guided; glow + re-say together after 7 s idle from the last action | 1 | 1-2, written and counted along | The smallest round |
| L2 | Open | Each step once; no counting along | 8 s idle | 2 | 1-3, written | The station's content thing (table 2) |
| L3 | Open, **the item words dotted**; frames, verbs and numbers stay written ("ba ••• wij") | Each step once | Nothing at the start; 11 s idle; both bulbs pulse at 15-20 s | 3 | Written; the item by ear | Items by ear only |
| L4 | **Hidden** (face + headline folded; a tap replays the whole order, free) | Each step once | 15 s idle; bulbs pulse at 15-20 s | 3 + 1 lookalike variant | Heard only (the bulb shows them) | Card hidden **and** the station's harder variety (table 2) |

Why L4 carries two things: with the step call, hidden differs from dotted only in the frame and number no longer being readable, which she says anyway; a hidden-only L4 is the samosa complaint again (L4 = L3). Timers (15%/level) and decoys are knobs, not "the thing", as cook.md §11 already treats timers.

**One rule for the call:** she calls the next open step of the card in focus. Where the child picks what to work on (chai pans, samosa strips), tapping it makes it the focus: that person's order replays (free, P58), then her calls follow that pan or strip until the child switches.

**The lines (engine, recorded words):** `Now` *Hane trae khun!*; `DoIt/Command` *Trae khun wij!*, *Dudh wij!*, *Bar!*, *Slow kar!*, *Firai!*, *Bhar!*, *Waar!*; `First/Then` *Pela gos. Ne poi dungri.*; `NoItem` *Marcha na.*; `GiveMe` *Muke khun de.* Counted imperatives (number + item + *wij*) need checking in node first. **Needs Mum:** the stir sentence (verb, count, speed; *times* is to-record, DAAR-26); "put it on" (SEK-18; interim *Wiji chad*); "take it off" (MAA-15); the "and" join (MAA-16); *muke*/*khape* (LNG-16); *pela* and *tar* (fry) are drafts. Then `/mum-round` adds the whole phrases a simulated run finds most frequent (non-negotiable 11).

## 2. Per station: the one new thing per level

| Station | L1 | L2 | L3 (+ items dotted) | L4 (+ hidden) | Her step calls |
|---|---|---|---|---|---|
| Pantry | 3 things | 4 things, fuller shelf | 5 | 6, 7 decoys on the shelf | One thing at a time, the next asked when the last lands (*Muke khun de.*), not all up front as now |
| Chai | 1 cup | 2 cups | 2 cups + *adh / aako* (half, full) | **3 cups** (Zafar: "maybe level 4"), was L3 | Tap a pan: its order; then *Paani wij* → *Dudh wij* / *Dudh na* → *Ba khun wij* → *Bar!* → *Slow kar!* → the pour |
| Maani | 1 maani (which kind, by ear) | **2 maani, big or small** (*wadhi / nindhi*, Zafar: from L2; was L4) | 3, both kinds | 2-4, sizes, tightest flip window | *Hane hakri wadhi bajri maani!* as the tawa clears; *Firai!* on each turn; "take it off" (Mum) |
| Daal chop | 1 round, all items | 2 rounds | 3 rounds, unsaid rows dotted and revealed as called (DAAR-34) | 4 decoys, continuous waves | *Ba dungri kap!* per round |
| Daal tadka | spices in order, words ladder | dots | the shelf of 8, hidden (today's own ladder already fits) | 5.5 s burn | *Hane jeero wij!* as each spice lands |
| Daal stir | count + speed said (decision 13) | speed by ear | a speed switch mid-stir | the flag at 12 o'clock, count at ¾ lap | The one full sentence (Mum) |
| Chaat | base + 1 topping, 1 decoy | 2 toppings in order (*pela, ne poi*) | + the *na* row | 3-4 in order; a wrong one in sequence empties the bowl (CHT-14) | *Pela bataato wij.* → *Ne poi chana wij.* as each lands |
| Samosa | 1 kind, 1-2 samosas, 2-3 spoons of one filling | + a second filling in order | **2 kinds** (*ba keema, hakro bataato*) | **+ the *na* filling**, 2-3 each (was all of this at L3 = L4) | Tap a strip: *Hane keema samosa: trae keema wij!*; *Waar!*; *Tar!*; count never auto-stops |
| Sekelo | 1 skewer, meat or veg, 1 decoy | 2 skewers, 2 decoys | 2-3, one mixed, 3 decoys (Zafar: 2) | 3-4, two mixed, 3 decoys + lookalike; juggle stays off | *Hakri lakri gos.* per skewer; mixed: *Pela gos. Ne poi dungri.* per piece |
| Clinic heal (nine games) | as today | as today | **dotted**, not closed (was "L2 heard only") | hidden + the variety already in K | The doctor calls each row as the last closes |

## 3. The leak test by level (non-negotiable 6)

The bot (`build/tools/review/leak.mjs`) sees pictures, positions and what it tried, never the words; "fair" wins 100%, every blind strategy under 10%, at every level (Zafar, 14 Oct).

- **Reading:** a word is text in one place at a time. L1-L2: the card has the word, so shelf chips are speaker-only. L3: the dotted item is written nowhere. L4: nothing is written; the bulb shows it and costs.
- **Matching:** she names the item; the child picks it from the order's items plus 1/2/3/3 lookalike decoys, shuffled each round. Nothing glows at the call, which fires when the step opens, never on a hover.
- **Eliminating:** items fly in right or wrong and are judged at serve. Chaat's bounce-back (decision 9) is a tell, so the bot's win there is counted in first-go ticks, not a finished bowl. The *na* item is an ordinary decoy, never the odd one out.
- **Counting:** counting along (L1) and the call never stop the taps; no tray holds exactly N; samosa keeps its go-on button (decision 6).
- **Patterns:** every order is drawn per round; shelf positions shuffle.
- **Waiting:** the idle glow shows the answer, so it counts on the bulb badge (as the thread's `showAfterMs` does); replays are free because they say, never show.

The check: the table becomes data per level (`card: open | dotted | hidden`, `decoys`, `stepCall`), replacing `closedFrom`, with a contract-run check per station at L1-L4 (SH-110, CK-49), red before the build.

## 4. Decisions for Zafar

Answerable "yes to all except …".

1. **Nani calls every step live, at every level and in every mode** (the call is the order in pieces, not help). Recommend yes.
2. **Card ladder: L1-L2 open, L3 item words dotted (frames, verbs, numbers written), L4 hidden**, replacing `closedFrom: 3`. Recommend yes.
3. **L4 = hidden card + the station's harder variety** (table 2). Recommend yes; the alternative, L4 = L3 heard only, is what you called unplayable.
4. **Decoys 1 / 2 / 3 / 3 + a lookalike, every station** (sekelo one more at L3 than your "two"). Recommend yes.
5. **Chai: 1, 2, 2 + half/full, 3 cups at L4.** Recommend yes.
6. **Maani: L2 = two maani with big/small** (two things at once, as you asked; a second maani alone is repetition), L3 three, L4 2-4; +0.75 s everywhere. Recommend yes.
7. **Samosa: one filling, a second in order, two kinds, then the *na* filling.** Recommend yes.
8. **Chaat's leak bot wins are counted in first-go ticks** (the bounce-back is a tell otherwise). Recommend yes.
9. **Pantry asks one thing at a time** (3/4/5/6 things), not the list up front. Recommend yes.
10. **The clinic follows the same table** (L3 dotted, rows called live; reverses "L3 = L2 heard only", 13 Oct), after Cook lands. Recommend yes.
11. **Mum's list** (section 1) into the next `/mum-round` sheet with the frequent whole phrases. Recommend yes.
12. **Help at L3-L4:** the step call may sound at the step's open (it is the order); glow and re-say only after 11/15 s idle. Recommend yes; it settles your chai L3 "when does she chime in".
