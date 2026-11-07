# A Learning

**The question: what does the child learn, honestly?**

Four areas: the words a round teaches, the support a word card gives, words a picture can't show, and the lines the family says.
How support moves over time (the ladder, the levels) is domain C; the leak test is non-negotiable 4 (STD-01-04). The rule block's
shape: `README.md`, "The rule format".

## A1 The words

#### STD-A1-01 · A round brings 3 to 5 new words, and the child hears each of them at least three times in it
- **Why:** "3-5 new words a round, each heard 3+ times in it" (easy-to-play principle 9; Zafar's yes, 21 Oct): a foothold needs repeated hearings
- **Scope:** House
- **Pattern / part:** - / the word card
- **Checked by:** gap: a word-exposure count over the sandbox's sound log (new words a round, hearings of each)
- **See it:** `lab.html?mode=cook&game=chai-tray&level=1` (labs.html: New player), 1280x665
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` (not yet a key) · **Value:** new words a round; hearings a round (values.md A1) · **Impact:** wrong

#### STD-A1-02 · Every item of an order is heard in a family voice as its card is shown, so a deciding word is met as sound and picture together
- **Why:** "Each word is said at the order (its card pops from the guide), at the shelf, and at the pour" (easy-to-play principle 9, 21 Oct)
- **Scope:** House
- **Pattern / part:** P8 / the pop-out
- **Checked by:** contract-93 + contract-26
- **See it:** `lab.html?mode=cook&game=chai-tray&level=2` (labs.html: New player), 1280x665
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js`, `js/shared/order-card.js` · **Impact:** wrong

#### STD-A1-03 · A word has one picture in a game: the order card, the shelf, the helper card and the word moment show the same picture of the same thing
- **Why:** SH-200 (Zafar, 3 Nov: "the bottle of ginger on the item card is different from the bottle of ginger on the shelf ... the one on the shelf is the correct one"); CHAI-74 (3 Nov: "the item cards for full and half cup need to be the side on views")
- **Scope:** House
- **Pattern / part:** P10 / the item card
- **Checked by:** probe:SH-200 + probe:CHAI-74 + gap: a picture check that each order card's picture is its shelf item's own file
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` (labs.html: New player), 1280x665
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js` (the row's picture) · **Impact:** wrong · **Source rows:** SH-200, CHAI-74, CHAI-84

#### STD-A1-04 · Grammar is learned from many varied orders and is never explained to the child
- **Why:** "Grammar ... comes from many varied orders. It is never explained to children." (easy-to-play principle 9, 21 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** contract-16
- **See it:** -
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `js/core/lang/` · **Impact:** wrong

#### STD-A1-05 · Saying a word aloud is a way to act at chosen moments, a tap always does the same, and play never pauses for the child to repeat a word
- **Why:** "Speaking is part of play, not a repeat-after-me pause" (easy-to-play principle 10, Zafar, 21 Oct); "a miss is a shrug: the pills or a tap always work too"
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:unit + gap: a speech check that every listen has a tap path and never holds the step
- **See it:** -
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/speech.js` · **Impact:** stuck

## A2 The word card's support

#### STD-A2-01 · A word card's support fades in one order: the English first, then the picture, then the Kutchi text; the speaker never goes
- **Why:** "Fade order (Zafar, 21 Oct): English first, then the picture, then the Kutchi text" (easy-to-play principle 6): one card serves pre-readers and readers
- **Scope:** House
- **Pattern / part:** - / the word card
- **Checked by:** check:unit + contract-39
- **See it:** `lab/kit.html` (the word card), 1280x665
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/word-card.js`, `data/progress.json` (support) · **Value:** support by stage (values.md A2) · **Impact:** wrong

#### STD-A2-02 · A word card shows its English while the word is supported, and after that only when the child taps it open
- **Why:** CLAUDE.md non-negotiable 3 ("a supported word card, tapped"); easy-to-play's rule change (Zafar, 21 Oct)
- **Scope:** House
- **Pattern / part:** P14 / the word card
- **Checked by:** contract-39
- **See it:** `lab.html?mode=cook&game=chai-tray&level=3` (labs.html: New player + Words known), 1280x665
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/word-card.js` · **Impact:** wrong

#### STD-A2-03 · The blur rule: a picture blurs only where the level says so and the child picked the word right in an earlier round, so a word met for the first time always shows its picture
- **Why:** SH-195 (Zafar, 2 Nov: "how will you learn what saffron is if the word card is blurred ... everything needs to be introduced somehow, it can't always be special cases"; his yes to the rule, 3 Nov)
- **Scope:** House
- **Pattern / part:** P5 / the item card
- **Checked by:** probe:SH-195 + gap: a contract that fails a blurred picture of a word with no right pick before the round
- **See it:** `lab.html?mode=cook&game=chai-tray&level=3` (labs.html: New player: clear; New player + Words known: blurred), 1280x665
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js`, `js/cook/core.js` (`Cook.chipWord`) · **Impact:** wrong · **Source rows:** SH-195

#### STD-A2-04 · A word's first meeting shows every slot of its card plainly: picture, Kutchi and English, nothing dotted or blurred
- **Why:** CHAI-71 (Zafar, 3 Nov: "the English word is blurred, but it shouldn't be blurred because it's the first time you're seeing these words")
- **Scope:** House
- **Pattern / part:** - / the word card
- **Checked by:** probe:CHAI-71 + check:unit
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` (labs.html: New player: the word moment), 1280x665
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/word-moment.js`, `js/shared/word-card.js` · **Impact:** wrong · **Source rows:** CHAI-71

#### STD-A2-05 · A dotted word or a blurred picture opens with one tap at any time, and a peek never counts against the child
- **Why:** "a peek at the dots or the eye ... never count" (the level-up rule, Zafar, 29 Oct round 4); "A reveal is free" (easy-to-play principle 7, 21 Oct)
- **Scope:** House
- **Pattern / part:** P14 / the word card
- **Checked by:** check:unit + contract-31
- **See it:** `lab.html?mode=cook&game=chai-tray&level=3` (labs.html: New player + Words known), 1280x665
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/word-card.js`, `js/shared/rules.js` · **Impact:** feels bad

#### STD-A2-06 · A card's support holds in every look of the card: a "no" card keeps its blur under its grey
- **Why:** SH-202 (Zafar, 3 Nov: "the order of no sugar doesn't blur the sugar as well as it's meant to")
- **Scope:** House
- **Pattern / part:** - / the item card
- **Checked by:** probe:SH-202
- **See it:** `lab.html?mode=cook&game=chai-tray&level=3` (labs.html: New player + Words known; an order with "no"), 1280x665
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/cook/ui.js`, `css/shared/order-card.css` · **Impact:** wrong · **Source rows:** SH-202

## A3 Words a picture can't show

#### STD-A3-01 · A word no single picture can show (half, full, an amount) is taught by a word moment: a short scene that shows its meaning, then turns it into its word card, said by Nani
- **Why:** CHAI-67 (Zafar, 2 Nov: "someone thought adh was adhu ... we teach them first with a cutscene ... That would be gold standard")
- **Scope:** House
- **Pattern / part:** P8 / the word moment
- **Checked by:** probe:CHAI-67 + contract-94 + gap: a check that every deciding amount word had its word moment before it first decides
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` (labs.html: New player), 1280x665
- **Status:** agreed 2 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/word-moment.js` · **Impact:** wrong · **Source rows:** CHAI-67, R6-135

#### STD-A3-02 · The word moment plays at the first round that asks for its words, before the kitchen and its people, and never at a level that does not ask for them
- **Why:** CHAI-67 (Zafar, 3 Nov: "There's no point showing it at level 1"); CHAI-78 (4 Nov: "It loads the 3 people ordering before it shows the T word focus")
- **Scope:** House
- **Pattern / part:** P8 / the word moment
- **Checked by:** probe:CHAI-67 + gap: a contract that the word moment ends before the round's first order line
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` (labs.html: New player), 740x320
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/word-moment.js`, `js/cook/stations/chai-tray.js` (its trigger today) · **Impact:** wrong · **Source rows:** CHAI-67, CHAI-78

#### STD-A3-03 · The word moment shows the contrasting meanings side by side before it names either: both made, a pause to compare, each named in turn, then both cards held together
- **Why:** CHAI-81 (Zafar, 4 Nov: "pour both glasses first so you can easily look at the two and see the difference")
- **Scope:** House
- **Pattern / part:** - / the word moment
- **Checked by:** judge: the word moment at L4, New player, 1280x665 + gap: a word-moment order check (both fills end before the first snap)
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` (labs.html: New player), 1280x665
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/word-moment.js` · **Value:** the word moment's pair hold (values.md A3) · **Impact:** wrong · **Source rows:** CHAI-81

#### STD-A3-04 · A measure's pictures read beyond doubt: the amounts far enough apart to tell at a glance, in one vessel that never changes between them
- **Why:** CHAI-84 (Zafar, 5 Nov: "half should be a little lower ... full should be right to the rim"); CHAI-79 (4 Nov: "the glasses move around ... the internal reflections are all changing")
- **Scope:** House
- **Pattern / part:** P10 / the word moment
- **Checked by:** judge: the two glasses at L4, New player, 740x320 and 1920x1080
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` (labs.html: New player), 740x320
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/word-moment.js` · **Value:** half's fill line (values.md A3) · **Impact:** wrong · **Source rows:** CHAI-84, CHAI-79

## A4 Language lines

#### STD-A4-01 · Every line a game says or writes is built by the language engine from recorded phrases and words, and a line it can't build is reported as a gap
- **Why:** CLAUDE.md non-negotiable 2 ("if the engine can't say it, report the gap"); R6-136 (baking's "a little / a lot of" frame, reported to Mum's sheet, 3 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:words + check:unit
- **See it:** -
- **Status:** agreed (CLAUDE.md; chai's page §6, 3 Nov)
- **Layer:** shared kit · **Lives in:** `js/core/lang/`, `data/lang/` · **Impact:** wrong · **Source rows:** R6-136

#### STD-A4-02 · A line with no Kutchi yet shows its English in grey italic with no "to record" sign, and is logged on Mum's recording sheet
- **Why:** Zafar, 3 Nov (CLAUDE.md non-negotiable 2; `docs/language/recording-sheet.md`: "this sheet is the log")
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** contract-16 + check:recordings + check:unit
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4`, 1280x665 (a line still to record)
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/word-card.js`, `build/tools/ops/recordings.mjs` · **Impact:** unfinished · **Source rows:** R6-18, R6-19, R6-131, R6-132, R6-133, R6-134, R6-135, R6-137, R6-138, R6-139, R6-146, DAAR-26, MAA-15, MAA-16, SEK-18

#### STD-A4-03 · A store build plays only clips the family recorded and Zafar marked OK; the device voice speaks a missing line while testing only
- **Why:** CLAUDE.md non-negotiable 2 ("device-spoken while testing, never in a store build")
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** contract-17 + check:unit
- **See it:** -
- **Status:** agreed (CLAUDE.md)
- **Layer:** shared kit · **Lives in:** `js/core/voice.js` · **Impact:** wrong

#### STD-A4-04 · Every Kutchi spelling a line shows is the lexicon's settled form; a losing variant or a banned form never reaches the screen or the voice
- **Why:** CLAUDE.md non-negotiable 2 ("Zafar confirms spellings")
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/words
- **See it:** -
- **Status:** agreed (CLAUDE.md)
- **Layer:** shared kit · **Lives in:** `data/lang/lexicon.json` · **Impact:** wrong

#### STD-A4-05 · At L4 chai says the amount where Kutchi puts it, straight after the person, built by the engine once Mum confirms the forms
- **Why:** LNG-23 (Zafar, 1 Nov: "you say the quantity right after saying my or saying me")
- **Scope:** Game
- **Pattern / part:** - / -
- **Checked by:** probe:LNG-23
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4`, 1280x665
- **Status:** waiting on Mum (Round 6)
- **Layer:** game · **Lives in:** `data/lang/`, `data/cook.json` (chai's say list) · **Impact:** wrong · **Source rows:** LNG-23
