# The stove family (make at the stove): Sprint 18's roll-out

**What this is:** the stove family's games listed against chai, its reference (`docs/process/prototype-to-game.md`, "Every family",
step 1), written in Sprint 17 (3 Nov) so Sprint 18 can begin with the roll-out itself. Each game's gap to chai comes from three places:
the kit calls it uses (code), its open fix-list rows, and `audit.mjs <game>` (the panel and lab-page steps, run 3 Nov). Zafar's word
changes this page (rule: newest word wins).

**Chai is signed off** (Zafar, 7 Nov: "done and complete as a reference point for the other games"); its rules are
`docs/design-language/chai-standard.md`. **The roll-out is Sprint 18** (`docs/sprints/S18-stove-family.md`): eight games brought to
chai's standard on three layers (shared kit → stove kit → the game's settings and its own mechanic), plus **chop as its own game**
(Zafar, 7 Nov: "as other games and recipes will use chop"), built once on the kit and used by daar and chaat. The cake left for the
word-tiles family (3 Nov, decision 8), so the family is the eight below. **Open (asked 7 Nov ~13:30):** chaat and chop use no
stovetop; Zafar thinks they may belong to another family. Sprint 18's file holds the one list; his answer changes it and this page.

## The family

| Game | Where it is | Where its code is | Where it sits in the days | Levels today |
|---|---|---|---|---|
| **Chai** (the reference) | live; signed off 7 Nov | `stations/chai-tray.js` | the kitchen, every visit | L1-L4, the word moment at L4 |
| Chop (its own game; daar and chaat use it) | to build on the kit (Sprint 18, wave 1) | `mechanics/chop.js` today | the kitchen | as its users' |
| Daar (chop, tadka, stir) | live | `stations/daar.js` | the kitchen | L1-L4 |
| Chaat (the bowl) | live | `mechanics/assemble.js` | the kitchen | L1-L4 |
| Samosa (fill, fold, fry) | live | `stations/samosa.js` | the kitchen | L1-L4 |
| Maani (roll, the tawa) | live | `stations/maani-line.js`, `roll-tawa.js` | the kitchen | L1-L4 |
| Sekelo (thread, grill) | live | `stations/mishkaki-grill.js`, `mechanics/grill.js` | the kitchen | L1-L4 |
| Eggs at breakfast | lab prototype (1 Nov), not judged | `stations/eggs.js` | the kitchen, from visit 2 | L1-L4 |
| Baking (naan) | lab prototype (1 Nov), not judged | `stations/baking.js` | the kitchen, from visit 2 | L1-L4 |
| The corn stall | lab prototype (1 Nov), a sekelo redress, not judged | `stations/corn.js` | the farm (day 2) | L1-L4 |
| The birthday cake | moved to word tiles (3 Nov); kept below for its words | the party kit | the birthday | L1-L2 |

Paths are under `js/cook/`. At the roll-out: eggs' frown at the end becomes chai's progress display (Zafar, 7 Nov; non-negotiable 7);
the first pass uses landed art only, with placeholders for daar's chop background, samosa's fill and fold, baking's word moment
(ART-37, ART-38) and the wide-door counter (ART-59).

## What chai has, and who has it

"The s14 kit" is the list in DAAR-36 (the word card, the sideways order row, the pop-out turning into its row card, Nani's helper
card, the lit-box light, skip zones, bubbles off the side panel, the word pill ladder, the level-up rule, the central rules file).
Chai's later rules (30 Oct to 3 Nov) sit partly in Cook's shared `js/cook/ui.js` (every station on the order card gets them) and
partly in chai's own code (each game needs them moved to the kit).

| Chai's rule | Where it lives | Daar | Sekelo | Maani | Chaat | Samosa | Eggs | Baking | Corn | Cake |
|---|---|---|---|---|---|---|---|---|---|---|
| The s14 kit (DAAR-36's list) | Cook kit | reopened (DAAR-36) | reopened (SEK-22) | reopened (MAA-19) | reopened (CHT-17) | built (SAM-28) | part | part | part | no |
| The pop-out's one shape (CHAI-43), the panel's measures (SH-189 to SH-192), the card kept in view (SH-191) | `cook/ui.js` | yes | yes | yes | yes | yes | part | part | part | no |
| The blur rule (SH-195) | `cook/ui.js` | yes | yes | yes | yes | yes | part | part | part | no |
| The card's flight (SH-163), the fold (SH-180) | `shared/` | yes | yes | yes | yes | yes | yes | yes | yes | no |
| The reveal taught once: the word, then the picture (SH-196) | chai only | no | no | no | no | no | no | no | no | no |
| The light follows its card (SH-178, SH-181) | chai only | no | no | no | no | no | no | no | no | no |
| The next-vessel light (CHAI-68, the gold ring on the next pan) | `shared/onboard.js` + chai | n/a | the next skewer | the next maani | n/a | the next pastry | the pot or the pan | n/a | the next cob | n/a |
| The word moment (CHAI-67: half and full) | `shared/word-moment.js` | n/a | n/a | n/a | n/a | n/a | n/a | **yes: the amounts** | n/a | n/a |
| The play button on a reloaded page (SH-198) | `shared/buttons.js` | yes | yes | yes | yes | yes | yes | yes | yes | yes |
| Nani's helper card with the step's picture | Cook kit | yes | yes | yes | yes | yes | blank (no art) | blank | blank | no |

"Part" for the three prototypes: they use about ten of the kit calls chai uses (`S.glow`, `z.expect`, the order card's tick and close,
the word chip), not the helper card's step help, the card-into-view, the read-along, the held calls or the count pills
(`js/cook/stations/{eggs,baking,corn}.js` against `chai-tray.js`, 3 Nov). The cake is on the party kit and has none of Cook's.

## Each game's gap to chai

The audit's numbers are the panel step (`panelcheck.mjs`: the side panel at the four sizes, L1-L4) and the lab page step
(`labcheck.mjs`: errors, spills, speaker gaps), 3 Nov. Reports: `build/reports/audit-<game>-2026-11-03.md`.

### Daar
- **Kit:** DAAR-36 reopened (the L4 chop list read pieces, not kinds; the 'no' item said second; the light framed the whole board at
  740x320). DAAR-37 (kinds to chop 1-4 by level, 2-8 chops), DAAR-38 (the chop ends on the last chop), DAAR-39 (the chop's light: the
  knife, a small strip, not the screen).
- **Chai's later rules:** the reveal taught once, the light following its card.
- **Waiting:** DAAR-02 (the kadchi, art), DAAR-26 (the stir line, Mum: Round 6, R6-146), DAAR-12 (the stir's speed shown as dots: Zafar).
- **Audit (3 Nov):** panel 54 of 60: SH-192 at 740x320 and 930x430, L2-L4 (the headline's gaps 9.1 above against 7.5 below, the second
  card 15.7 against 10.8); the lab page clean at L1-L4 (no errors, nothing spills).
- **Words:** daar, hardar, jeeru, rai, the chop's vegetables, aste thi, jaldi; daar and hardar met in the pantry, the rest first met here.

### Sekelo
- **Kit:** SEK-22 reopened (the skewer's light: the whole skewer, handle to tip, at most 12 px beyond, no other skewer).
- **Chai's later rules:** the reveal, the light following its card, the next-skewer light.
- **Waiting:** SEK-20 (a square top-down barbecue, art), SEK-18 (the "thread them" line, Mum), SEK-14 (the racks as pictures: check).
- **Audit (3 Nov):** panel 58 of 60: SH-169 at 740x320, L3-L4 (the current card's head out of view for about 200 ms as the
  order passes); the lab page clean.
- **Words:** sekelo, mishkaki, gos, murgi, boga, mixed, lakri; green pepper stays English (Zafar, 3 Nov).

### Maani
- **Kit:** MAA-19 reopened (the first roti is said in Nani's opening line, so its big card never pops: the headline's item to pop as it
  is said).
- **Chai's later rules:** the reveal, the light following its card, the next-maani light on the tawa.
- **Waiting:** MAA-15, MAA-16 (the take-off wording and the "and" join, Mum), MAA-14 (Nani's "pass me": check).
- **Audit (3 Nov):** panel 60 of 60; the lab page clean.
- **Words:** maani, bajr ji maani; the turner has no word (picture only).

### Chaat
- **Kit:** CHT-17 reopened (at 740x320 L4 ten jars' labels overlap and the card's seventh row is cut: speaker-only labels only where
  the words don't fit, Zafar, 30 Oct).
- **Chai's later rules:** the reveal, the light following its card.
- **Waiting on art:** CHT-13 and CHT-04 (the side-on bowl and its layers), CHT-16 (the chop's background).
- **Audit (3 Nov):** panel 51 of 60: SH-192 at 740x320, 1280x665 and 1920x1080, L2-L4 (the headline's gaps 9.5 above against
  14.1 below); the lab page clean.
- **Words:** chaat, dai, amli, lili, sev, dhania, chana.

### Samosa
- **Kit:** built (SAM-28 passed on film). Nothing open in its own rows.
- **Chai's later rules:** the reveal, the light following its card, the next-pastry light.
- **Audit (3 Nov):** panel 53 of 60: SH-169 at 740x320 and 930x430, L3-L4 (the current card's head out of view as the order
  passes), SH-191 at 1280x665, L3-L4, SH-192 at 930x430, L2; the lab page clean.
- **Words:** samosa, chundo, bataata, dhania, atto.

### Eggs at breakfast (prototype)
- **Kit:** most of it to move on (the helper card's step help, the card into view, the read-along, held calls, count pills); the
  table's verdict is a frown with no redo loop (the prototype's decision 2, his to reverse).
- **Chai's later rules:** all of them; the next-vessel light chooses between the pot and the pan.
- **Art:** block 1 landed (EP, EF, EG, EY, EB, ES, EM, EN); not cut or wired. Known edges: the pot's handle over the pan, the people
  stand behind the table.
- **Audit (3 Nov):** panel 59 of 60 (SH-191 at 740x320, L3: a fitting card cut for about 1.8 s past its 400 ms); the lab page
  clean. The panel measures the shared order card, so it reads well even where the station's own kit is thin.
- **Words:** indo (confirmed), tarelo (draft), loon, mari (draft); "boiled egg" to record (R6-19, R6-137); salt, pepper and "no salt"
  (R6-138).

### Baking (prototype)
- **Kit:** most of it to move on; Nani's instruction is two engine pieces side by side because the engine has no "a little / a lot of
  X" frame (R6-136 asks Mum for it).
- **The word moment:** the jug's amounts (a quarter, half, full, one and a half, two and a half) are what CHAI-67's system is for;
  half and full are recorded words (adh, aako); the rest wait for Mum (R6-135).
- **Art:** block 1 landed (BK kept as a best try, BB, BJ, BO1-3, BN; BL skipped); not cut or wired.
- **Audit (3 Nov):** panel 60 of 60; the lab page clean at L1-L4.
- **Words:** atto, paani, dudh, dai, ghee, loon, khun; naan to record (R6-18).

### The corn stall (prototype)
- **Kit:** as eggs. Nani's box stands in for Hannah Mami (her approved sheet first: no real person without it).
- **Art:** block 1 landed (CT, CB, CX kept as a best try, CD; CO failed with text-like marks, in the redo list).
- **Audit (3 Nov):** panel 60 of 60; the lab page clean at L1-L4.
- **Words:** makai (confirmed), limu, loon, laal marcha, mari, lili, amli (the dressings); R6-139.

### The birthday cake (prototype)
- **Kit:** none of Cook's: it is on the party kit (the sentence layout, word tiles). Its place in the family is the recipe-free
  celebration step; **decision for Zafar (Sprint 18's opening):** keep it in the stove family, or move it to the word-tiles family
  (feeding time's), which its tiles already match? Recommend: move it to word tiles.
- **Art:** block 1 landed (PR, TB, CK, CN); not cut or wired.
- **Words:** cake, candle, "Now blow!", "It's Zara's birthday" all to record (R6-131 to R6-134); "Hi Nana lai ai." is Mum's.

## Words: what each game decides by, and where it is first met

The rule: every deciding word is met before it decides (the farm is day 2, so the kitchen carries its foods). Today most of the
family's words are first met in the game that decides by them, so the general first meeting carries them; the table says which. A word no earlier game teaches gets
the general first meeting (SH-195, SH-196); a word a picture can't show gets a word moment (CHAI-67).

| Word | First met | Decides in | Kutchi today |
|---|---|---|---|
| chai, dudh, khun, elchi, atto, loon, hardar, daar, chana, sev, chundo | the pantry (its order list, `data/cook.json`) | chai, baking, daar, chaat, samosa, eggs, corn | confirmed or draft |
| aadu, paani, kari, mori | chai | chai, baking | recorded or draft |
| adh, aako (half, full) | chai's word moment (L4) | chai, baking (the jug) | recorded |
| the vegetables (dungri, tameto, lasan, mirchi), jeeru, rai | **none earlier**: daar's chop and tadka are their first meeting | daar | draft, to record (Round 6, Part 6) |
| bataata, dhania | **none earlier**: samosa and chaat | samosa, chaat | draft / confirmed |
| dai, amli, lili | **none earlier**: chaat | chaat, the corn stall | confirmed |
| gos, murgi, boga, mixed, lakri | **none earlier**: sekelo | sekelo | confirmed |
| laal marcha, mari | **none earlier** | the corn stall, eggs | draft |
| indo, tarelo, "boiled egg" | **none earlier**: the general first meeting | eggs | confirmed / draft / to record |
| makai | **none earlier** (the farm's own) | the corn stall | confirmed |
| naan, the jug's amounts | **none earlier**: naan the first meeting, the amounts a word moment | baking | to record |

## Mum's sheet

Round 6 (`docs/language/mum-questions/Questions for Mum (Round 6).md` and `.docx`, 3 Nov): 148 lines, about 45 minutes, the stove
family only (the clinic waits for its family's round). The gap list now reads every station's words (it read two, so eggs, baking and
the corn stall never reached it; fixed 3 Nov in `build/lang/reports.mjs`).

## Sprint 18's opening decisions

In `docs/sprints/S18-stove-family.md` (Zafar, 7 Nov: yes to all). The pantry's polish moved to Sprint 19 (its six decisions stay in
`docs/sprints/S17-chai-done-families.md`, "Sprint 18's opening decisions", for that sprint's opening).
