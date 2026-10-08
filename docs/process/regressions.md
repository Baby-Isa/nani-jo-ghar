# Regression list

Every piece of feedback Zafar has given, plus every defect found since, so that a fixed issue stays fixed (top rule 3). One row per issue; the same issue reported in several documents is one row.
**How to use it:** filter by the screens your change touches and recheck every row there, at the size or state named in the Check column. A row that fails again becomes **reopened** and is reported to Zafar first, before any fix.
**How to add rows:** every new feedback item gets a row the day it arrives, in the right section, with the next free ID (IDs are stable: never reuse or renumber). Use the original document as the Source, not a handover summary.
**Status** (four only, and a note may follow in brackets): **open** (not fixed) · **reopened** (was fixed, failed again) · **built, not re-played** (the builder says fixed; Zafar has not confirmed it in play) · **fixed** (confirmed by Zafar, or superseded by a later rebuild and checked). Rows under "Keep" have status *keep* and under "Retired" *retired*; `regress.mjs` and `statuscounts.mjs` read these words, so write them exactly.
**Check:** **auto: <script>** means a script covers it; **eye: <size/state>** means a screenshot review at that size or state. Checklist IDs are in `docs/process/qa-checklist.md`; rule IDs in `docs/process/rules.md`.
One Source per row: the document where it was first raised. Keep (liked) items and retired items are at the end; they are not counted as open or built.

## Shared components

### End screen and word review

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-01 | **KNOWN BUG.** Shared end-screen word tile overflows its box (*fudino ji chutney*); overflows on phone at level 4 | **open** | eye: 390×844 L4 · TXT-01 | `docs/design-language/ux-principles.md` §15 |
| SH-02 | **KNOWN BUG.** Results card writes *hakro* where the order said *hakri* (also *hakri lakri* in sekelo) | **open** | eye: 390×844 L4 · LNG-06 | `docs/design-language/ux-principles.md` §15 |
| SH-03 | Word review vertically centred and balanced in its card; even border and shadow; right on the right (gold), wrong on the left (red); widths proportional | **reopened** (6 Oct play-test) | eye: 1366×768 · CMP-13 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §6; `docs/feedback/cook-playtest-2026-10-06.md` |
| SH-04 | End-of-round badges clean on cream: no grey fringes, holes, mismatched sizes or wrong fill (took five rounds) | fixed | eye: ×2 zoom on cream · CMP-12; auto: `build/test_shared_ui.mjs` | `docs/archive/handovers/ORCHESTRATOR-HANDOFF.md` (Lesson, 28 Sept) |
| SH-05 | End screen shows the new badges; no old drawn badges, and no old "Cook with Nani" menu card behind the end pop-up | fixed | eye: after hard refresh · CMP-11 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §7 |
| SH-06 | Result cards show whole-number percentages and labelled lines | fixed | eye: 1366×768 | `docs/archive/cook/cook-with-nani-todo.md` Wave 1 |
| SH-49 | Ticks map one-to-one to order rows: no tick lost for a bulb, translate or "shown" hint or a stray with no row; every lost tick names its row in the review (3 of 4 with nothing red) | **open** | eye: pantry and chai end, after a bulb press · CMP-13 | `docs/feedback/cook-playtest-2026-10-06.md` PA8 |
| SH-50 | A wrong item in a multi-person order marks that person's row and shows in the review (chai: aadu put in for lasan showed all words right); a wrong count shows on the left | **open** | eye: 2-person chai L2, chaat counts · CMP-13 | `docs/feedback/cook-playtest-2026-10-06.md` C22, T10 |
| SH-51 | Coin-jar pocket-money screen (five fill pictures, card lands on the jar, coins drop with a ching, card rises and fades; this game's total and the jar total) from the end-screen template; cards not clipped (rounded top, square bottom now); Next is the primary button, not a red "Nani's shop" (pending decision) | **open** | eye: day summary 1366×768, 390×844 | `docs/feedback/cook-playtest-2026-10-06.md` C10, C11, C14 |
| SH-61 | The ✓ is flat: no drop shadow or lip behind the gold tick (shared) | **open** | eye: ×2 zoom, clinic and Cook · CMP-02 | `docs/feedback/clinic-playtest-2026-10-06.md` SH1 |

### Order cards

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-07 | One white card per person: face, headline, stacked rows; no name label, no scroll bar, no intro line such as "Nani laide" | fixed | eye: 1366×768 · CMP-07 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §2 |
| SH-08 | Card order equals spoken order (Nani reads top to bottom, not sugar, milk, flour) | built, not re-played | auto: `build/test_cook.py` order-card tests; eye: ear · CMP-08 | `docs/feedback/cook-playtest-2026-09-29.md` P4, X1 |
| SH-09 | Card rows stay on one line, shrunk to fit; headlines shrink first, then wrap (rule F7, 30 Sept, replaces "nothing wraps"); never clipped (pantry failed again: see PAN-01) | built, not re-played | eye: 390×844 · TXT-02 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §9 |
| SH-10 | Rows tick or count up as items go in (chai bug, tooth three taps, clinic rows); level-1 counts for fever, foot, drinks, boing judged in play | built, not re-played | auto: `build/test_cook.py` tick check; eye: L1 · CMP-09 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §10 |
| SH-11 | No early ticks or folds: samosa card ticked after filling while still frying, daar Nana's tick during the stir, "don't" row gold mid-dish; samosa headline cut to "Muke ba samosa …" | built, not re-played | auto: order-card node tests; eye: samosa, daar · CMP-09, TXT-01 | `docs/process/overnight-log.md` 03:07 |
| SH-12 | Items with no word at higher levels keep a speaker-only chip of the same size and position | fixed | eye: L3–L4 · CMP-08 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §10 |
| SH-13 | Counting along is consistent: L1 written and counted aloud, L2 written, L3+ heard | built, not re-played (C3, 5 Oct, decision 41: every station counts along at L1 only, chai's sugar included; L3+ headlines lose the number too) | eye: L1–L4 · INT-10 | `docs/feedback/cook-playtest-2026-09-29.md` X12, Q7 |
| SH-14 | Item labels do not overlap with more than five items; look-alike bowls are labelled | fixed | eye: 1366×768 | `docs/archive/cook/cook-with-nani-todo.md` Wave 1 |
| SH-15 | Count badges show the running tally, not the target | fixed | eye: each station | `docs/archive/cook/cook-with-nani-todo.md` Wave 1 |
| SH-16 | Speaker icon sits inside the face circle and is tappable everywhere (cards, pop-up, guide box, hob faces); face = replay; no per-line speaker, translate or eye buttons | built, not re-played | eye: 390×844 · INT-01 | `docs/design-language/ux-principles.md` §4 |
| SH-17 | Read-along underline wherever a line is spoken | built, not re-played | eye: each spoken line · TXT-08 | `docs/feedback/cook-playtest-2026-09-29.md` X2 |
| SH-52 | The bulb shows the full order with numbers at every level ("chapati" for two maani, "one mirchi" for two); a number is written the first times it is heard at any level (pending decision) | **open** | eye: L3 bulb on maani, chaat, sekelo · INT-10 | `docs/feedback/cook-playtest-2026-10-06.md` C1, Q1, Q2, T6, S4 |
| SH-53 | One highlight at a time, one colour token, in the card and on the stage together; no throb on a hidden word after its first hidden showing; rows tick piece by piece (sekelo mixed, samosa) | **open** | eye: sekelo L2, daar L2, samosa L3 · CMP-09 | `docs/feedback/cook-playtest-2026-10-06.md` S5, D11, A10 |
| SH-54 | "Served" is a picture stamp per card (no English word), on every dish of a combined order, not clipped | **open** | eye: chai + maani order | `docs/feedback/cook-playtest-2026-10-06.md` C25 |
| SH-55 | Gold done/next outline drawn inside, never clipped by the card or sidebar (`overflow:hidden` on `#mission`, `.oc-in`, `.pc-in`) | **open** | eye: ×2 zoom, every station · CMP-07 | `docs/feedback/cook-playtest-2026-10-06.md` PA11 |
| SH-62 | The sequence connector ends at the last row's centre, even when a row wraps | **open** | eye: scrape, knee cards · CMP-07 | `docs/feedback/clinic-playtest-2026-10-06.md` S3, K5 |

### Onboarding and help

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-18 | Not overwhelming at the start: smallest possible first round, one card, one bulb, silence first, help behind "?" | fixed | eye: 390×844 L1 · INT-04 | `docs/design-language/ux-principles.md` intro (25 Sept) |
| SH-19 | First-time help in every phase of every station (dim all but one thing, ghost finger once); none missing (samosa, daar) | built, not re-played | auto: `build/check_onboard.mjs` · INT-04 | `docs/design-language/ux-principles.md` §8 |
| SH-20 | Input is live from the start; nothing waits for spoken instructions to finish | built, not re-played | eye: ear, tap during speech · INT-01 | `docs/feedback/clinic-playtest-2026-09-29.md` §13i |
| SH-21 | No grown-up skip button visible in play; it lives behind "?" | built, not re-played | eye: 390×844 · INT-04 | `docs/feedback/clinic-playtest-2026-09-29.md` G7, CQ15 |
| SH-22 | Guide box (Nani, doctor) in every mode: sage not red, top of the sidebar, mute and replay, bulb in her row | fixed | eye: 1366×768 · CMP-06 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §3, §10 |
| SH-56 | The guide box says the next step, in step with the highlight, one line per step (chai "make each pan" placeholder; daar stuck on "first jeeru then lasan"; no "turn on" / "put the daar in" / samosa "turn on the pan" line) (pending decision) | **open** | ear: chai, daar, samosa, maani L1 · TXT-08 | `docs/feedback/cook-playtest-2026-10-06.md` C4, D2, D3, A6, M1 |
| SH-57 | The bulb also flips Nani's guide line to English | **open** | eye: pantry L1 bulb · INT-04 | `docs/feedback/cook-playtest-2026-10-06.md` PA2 |
| SH-58 | The ✓ glows whenever it is the only thing left, for the first plays (not only in guided rounds) | **open** | eye: chai, daar L1 · CMP-02 | `docs/feedback/cook-playtest-2026-10-06.md` C8, D5 |
| SH-59 | No "?" pulse during a conversation; the pulse clears at each new order | **open** | eye: story day, pantry → order | `docs/feedback/cook-playtest-2026-10-06.md` C16 |
| SH-60 | Help (line and glow) only after the pause, for the first item too; a new player sees every word ("Start over" clears learned words; "play as new" in "?") | **open** | eye: pantry L2, fresh profile · LNG-02 | `docs/feedback/cook-playtest-2026-10-06.md` PA5, PA12 |
| SH-63 | The guide box vs the card: one rule and a table of every line in every Cook station and clinic stage (pending decision; first job of Sprint 2) | **open** | eye/ear: every game | `docs/feedback/clinic-playtest-2026-10-06.md` G1, D6, D13, FV7, B1, FT3 |
| SH-64 | The whole card is read out only while the request pop-up is up; a tap that clicks through into the game cuts the read-out at once (now the pharmacy pop-up folds on a tap but the reading carries on); one shared pop-up from `js/shared/` for Cook and the clinic (non-negotiable 8) | **open** | ear: tap through the pop-up at once, Cook chai and clinic pharmacy, scrape | `docs/feedback/clinic-playtest-2026-10-08.md` P1, P2 |

### Buttons and sidebar

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-23 | One shared button kit: Done, Next, "Found it", "to the grill", "to the bench" look the same in every mode, are not cut off by the frame, and are hidden until usable, never greyed | built, not re-played | eye: 390×844 and 1366×768 · CMP-02, CMP-03 | `docs/feedback/playtest-2026-09-23.md` §1 #16 |
| SH-24 | Sidebar is a docked column, never a floating panel over the game | fixed | eye: 390×844 · LAY-05 | `docs/archive/design-v1/sidebar-design.md` §5 |
| SH-25 | Sidebar has no horizontal scroll, words do not break letter by letter at 1024×768, a long order card does not push the goal below the fold | built, not re-played | auto: `build/test_cook.py` sidebar · LAY-02 | `docs/archive/cook/cook-with-nani-todo.md` Wave 1, Wave 4 (builder) |
| SH-26 | Sidebar looks designed: no old three badge icons on the recipe card, not plain | fixed | eye: 1366×768 · CMP-05 | `docs/feedback/playtest-2026-09-23.md` §7 |
| SH-27 | Phone sidebar buttons (speaker, translate, eye) are 22 px, too small; goal box capped at about four lines | open | eye: 390×844, 915×375 · LAY-04 | `docs/archive/build-logs/cook-with-nani-build-log.md` §9 (builder) |

### Layout and stage

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-28 | **KNOWN BUG.** Chip words on phone are tiny | **open** | eye: 390×844 · TXT-05 | `docs/archive/handovers/NEXT-CHAT-START.md` §5 |
| SH-29 | Stage fills the screen: no black bars, no dead cream band above the counter | fixed | eye: 1440×900, wide, tall · LAY-01; auto: the sandbox (`build/sandbox/run.mjs`, all sizes) | `docs/feedback/playtest-2026-09-23.md` §1, README |
| SH-30 | At 16:10 (1440×900, 1280×800) the sidebar never hides a tappable item or becomes an undismissable drawer | fixed | auto: the sandbox (`build/sandbox/run.mjs`, all sizes) six viewports · LAY-02 | `docs/feedback/playtest-2026-09-23.md` §1 #1 |
| SH-31 | Nothing on the page covers a tappable item | fixed | auto: `build/test_cook.py` topmost-element check · LAY-06 | `docs/archive/design-v1/Roadmap and Story Structure.md` Lessons 2 |
| SH-32 | Collected things are visible where they go (no invisible counters) | open | eye: each station | `docs/archive/design-v1/Roadmap and Story Structure.md` Lessons 3 |
| SH-33 | Items are sized by width and height, never overflow their box | open | auto: `build/check_vessel_meta.py`; eye | `docs/feedback/playtest-2026-09-23.md` §1 #9 |
| SH-34 | Shelf band: equal padding top and bottom, bounce and glow stay inside, water bottle does not touch the top, room above dough containers | built, not re-played | eye: 1366×768 · LAY-07 | `docs/feedback/cook-playtest-2026-09-29.md` X7, C2, M9 |
| SH-35 | Shelf items at true relative heights; enough gap between cooking area and shelf | built, not re-played (C3, 5 Oct: rechecked on the chai tray, maani, sekelo and pantry at 1366×768, 1280×800, 844×390; no code change) | eye: 1366×768 · LAY-07 | `docs/design-language/ui-design-system.md` §10 (late) |
| SH-36 | One line of text beside a character icon is centred on the icon | open | eye: collapsed cards · TXT-09 | `docs/design-language/ui-design-system.md` §10 (late) |
| SH-37 | Cook screens have one focal thing; UI and world look like one product; identical shelf slots; design tokens only | built, not re-played | eye: 1366×768 · CMP-10, CMP-04 | `docs/design-language/ui-design-system.md` §1.1–1.4 |
| SH-38 | A counted row at L1 turns gold the moment the count is reached and the step closes by itself; from L2 it ticks only when the step closes (decision D5) | **reopened** (6 Oct play-test) | eye: L1 and L2, each counted step · CMP-09 | `docs/feedback/clinic-playtest-2026-10-01.md` this report P7, 1:3:44–4:55; `docs/feedback/cook-playtest-2026-10-06.md` |
| SH-39 | The running count sits on the tool in use (Kutchi word L1–2, dots L3+), never squeezed into a card row or in a far corner (D6) | built, not re-played | eye: 844×390 and 1366×768 · INT-10 | `docs/feedback/clinic-playtest-2026-10-01.md` P23, P26, 1:12:49–13:23, 1:15:36–15:51 |
| SH-40 | ✓ hidden until usable; a step moves on by the next action where one exists (D7, rule F22) | built, not re-played | eye: every heal game start · CMP-02 | `docs/feedback/clinic-playtest-2026-10-01.md` P70, P75, P89, 2:9:32–11:16, 2:12:06, 2:18:06 |
| SH-41 | On a closed card the bulb opens it in English for the bulb's whole time, one hint; long enough to read (D11) | built, not re-played | eye: L3 closed card, bulb · INT-04 | `docs/feedback/clinic-playtest-2026-10-01.md` P19, 1:9:37–10:29 |
| SH-42 | Looks at a closed card are counted apart from bulbs, not stacked by the bulb; the eye badge shows only at closed-card levels (D12) | built, not re-played | eye: L3 end screen | `docs/feedback/clinic-playtest-2026-10-01.md` P20, 1:10:19–11:54 |
| SH-43 | A peeked closed card shows no odd gold corners | built, not re-played | eye: ×2 zoom, peek · CMP-07 | `docs/feedback/clinic-playtest-2026-10-01.md` P27, 1:15:02–15:27 |
| SH-44 | The end review shows which step went wrong (asked vs done, pictured) | built, not re-played | eye: end review after a mistake · CMP-13 | `docs/feedback/clinic-playtest-2026-10-01.md` P18, 1:9:04–9:22 |
| SH-45 | One instruction at a time in the heal games: each step's line and row appear as it opens; never the whole job read out up front (D8) | built, not re-played | ear: boing L1, scrape L3 · TXT-08 | `docs/feedback/clinic-playtest-2026-10-01.md` P14, P66, 2:6:49–8:13 |
| SH-46 | A move the child hasn't managed yet (e.g. a drag) is shown again by the ghost finger after a pause, not only the first time ever | built, not re-played | eye: ear L1, second play | `docs/feedback/clinic-playtest-2026-10-01.md` P32, 1:17:42–17:47 |
| SH-47 | Closed card on phones: the headline shrinks first, then wraps at the largest two-line size; the flag sits clear of the eye | built, not re-played (G1, 5 Oct: the head leaves the eye's corner free) | eye: 800×360, 844×390 · TXT-02 | Fable's clinic review, 2 Oct |
| SH-48 | Card rows stay on one line on phones, shrinking to the floor first | built, not re-played (G1, 5 Oct: no row wrapped above the floor in Cook's chai, daar and the clinic at 800×360 and 844×390; a busy sidebar flows rows as pills, one line each) | eye: 800×360, 844×390 · TXT-02 | Fable's clinic review, 2 Oct |

## Cook: pantry

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| PAN-01 | **KNOWN BUG.** "Bring me these" headline clipped ("these" cut) and the growing highlighted row / gold done-outline clipped at the card edges (re-found 30 Sept 18:00 UK) | **reopened** (6 Oct play-test) | eye: 390×844 and 1366×768, each fetched row · TXT-01, TXT-04 | `docs/feedback/cook-playtest-2026-09-29.md` P3, P2; `docs/feedback/cook-playtest-2026-10-06.md` |
| PAN-02 | **KNOWN BUG.** Spoken and written lines are fragments with no verb (*khun, ne daar, ne dudh*; "I want tea and milk. I want tea with two sugars…"); want one natural sentence per person, in every station. Needs the language engine | open (partly built, 4d) (4d, 5 Oct: the pantry asks in full sentences, one per thing, *Muke atto de.*, built by the engine; one sentence with a list, and the other stations' lists (*Pela …*, *Ne poi …*), wait for Mum's list and verb rules: gap list) | eye/ear: every order sentence · LNG-03 | `docs/feedback/cook-playtest-2026-09-29.md` X1 |
| PAN-03 | Headline says "bring me these for {dish}", not "Muke dudh de." over atto with chai below (reads as if milk were a different kind of thing); Kutchi line still to record | fixed | eye: pantry card · LNG-04 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §1 |
| PAN-04 | Counting voice and Nani's "next thing" line do not overlap (one speech queue per station) | built, not re-played | eye: ear | `docs/feedback/cook-playtest-2026-09-29.md` P1 |
| PAN-05 | Pantry is fetched first, the first time each dish is made that day, story mode only | built, not re-played | eye: story mode | `docs/feedback/cook-playtest-2026-09-29.md` X13, T4 |
| PAN-06 | Shelves side-on, not top-down bowls; clear labelled jars; meat in a fridge section; no generic metal jugs; three to four full shelves; nothing floating | fixed | eye: 1366×768 · ART-03 | `docs/archive/cook/cook-with-nani-phase-a-design.md` §2 |
| PAN-07 | Basket is a tray with outlined spaces; front edge drawn over what sits on it; outline fades as the item lands; tally at most three across; pass-me pop-up side-on | fixed | eye: 1366×768 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §4 |
| PAN-08 | "Next item" ring centred on the item (glow and bounce of the item itself) | fixed | eye: 1366×768 · CMP-10 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §4 |
| PAN-09 | Jar labels read at phone size: colour reads better than label; white-on-cream icons (salt) vanish | **reopened** (6 Oct play-test) | eye: 390×844 | `docs/archive/art-prompts/chatgpt-art-prompts-pantry-jars.md` Status; `docs/feedback/cook-playtest-2026-10-06.md` |
| PAN-10 | Pantry wording: card headline *Muke de* + items, Nani's box the task (*Muke chai lai de*, to check with Mum); she reads the card once at L1 (pending decision) | **open** | ear: pantry L1–L3 · LNG-04 | `docs/feedback/cook-playtest-2026-10-06.md` PA1, PA3, PA4 |
| PAN-11 | A tap during her line pauses her, the count word plays, and she carries on (no garbled "Hakro…") | **open** | ear: tap mid-line · INT-01 | `docs/feedback/cook-playtest-2026-10-06.md` PA10 |
| PAN-12 | Shorter gap between count words (trim clip silence) | **open** | ear: pantry count | `docs/feedback/cook-playtest-2026-10-06.md` V5 |
| PAN-13 | Pantry/chai fatigue in the story days: pantry only the first time a dish is ever made; a new station sooner (pending decision) | **open** | eye: story days 1–3 | `docs/feedback/cook-playtest-2026-10-06.md` PA15 |

## Cook: chai

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CHAI-01 | Chai station is "a bit boring"; it is the second thing every new player sees (waits for the fun pass) | open | eye: first play | `docs/archive/cook/cook-with-nani-todo.md` (From Zafar, 26 Sept) |
| CHAI-02 | Layout: hob and tray do not overlap; top-down ingredient row; real liquid, not a flat blue disc; pour animation; knobs wired; no fill-line relic on glass or pot | fixed | eye: 1366×768 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §8 |
| CHAI-03 | Pour is tap-to-measure, never press-and-hold | fixed | eye: pour · INT-01 | `docs/design-language/ux-principles.md` §12 |
| CHAI-04 | Everything is made in the pan, not partly in the glass; one card per person | built, not re-played | eye: 1366×768 | `docs/design-language/ui-design-system.md` §1.5 |
| CHAI-05 | Sentence: *Muke aadu waari chai khape*, extras first, then *dudh*, *ba khun*; ginger phrase not last and not repeating *chai* | built, not re-played | eye/ear: orders · LNG-03 | `docs/feedback/cook-playtest-2026-09-29.md` C5 |
| CHAI-06 | Pans centred on burners; no flame on a burner whose pan is away; gauge on the rim; boiling state shot in QA | built, not re-played | auto: `build/check_vessel_meta.py` · LAY-10; eye: boiling state | `docs/archive/process/VISUAL-QA.md` §5 |
| CHAI-07 | Black-tea glass and tipped-pan art still open | **reopened** (6 Oct play-test) | eye: black-tea state | `docs/feedback/cook-playtest-2026-09-29.md` C8; `docs/feedback/cook-playtest-2026-10-06.md` |
| CHAI-08 | v2 mock-up fixes: hob and tray about 15% bigger and lower, pans true top-down, tilted pan for the pour, real top-down glasses and liquids | open | eye: 1366×768 | `docs/design-language/ui-design-system.md` §10 |
| CHAI-09 | No leftover "1 1" tally at serving (orchestrator) | fixed | eye: serve state | `docs/process/overnight-log.md` 01:34–03:40 (orchestrator) |
| CHAI-10 | Burner reaches the green zone about twice as fast at every level (now ~15 / 21 / 28 s) | **open** | eye: chai L1–L3 | `docs/feedback/cook-playtest-2026-10-06.md` C6 |
| CHAI-11 | A wrong cup is redone: the other cups stay, that cup empties, its card reopens, the tick goes; the second try has help (pending decision) | **open** | eye: 2-person chai, one wrong | `docs/feedback/cook-playtest-2026-10-06.md` C20, Q2 |
| CHAI-12 | Pan handle fully opaque over the hob rim (the heat ring draws over it) | **open** | eye: ×2 zoom, right pan | `docs/feedback/cook-playtest-2026-10-06.md` C19 |
| CHAI-13 | A real teaspoon for the sugar stir (now drawn in code) | **open** | eye: sugar | `docs/feedback/cook-playtest-2026-10-06.md` C18 |
| CHAI-14 | Ginger art reads as ginger, not gummies (`shelf-veg-14-jar-f.webp`) | **open** | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-10-06.md` C24 |
| CHAI-15 | Everyone who orders comes in first; one pop-up with each person's order (tap to skip); then quiet in game (pending decision) | **open** | eye: 3-person chai | `docs/feedback/cook-playtest-2026-10-06.md` C27 |
| CHAI-16 | A counted row at L1 turns gold at the count (D5 never built: hidden two sugars not ticked while milk ticked) | **open** | eye: chai L1, L2 · CMP-09 | `docs/feedback/cook-playtest-2026-10-06.md` C5 |

## Cook: maani

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| MAA-01 | Maani card headline still repeats its row over *hakri maani* | built, not re-played (C3, 5 Oct: the card's headline is the dish's own line, *Muke maani khape.*; the kind is said in the headline and written on its row) | eye: maani card · CMP-07 | `docs/feedback/cook-playtest-2026-09-29.md` X12 ("left open") |
| MAA-02 | Sentence is *Muke hakri bajr ji maani khape*, no spare "Ne" | built, not re-played | eye/ear: orders | `docs/feedback/cook-playtest-2026-09-29.md` M1 |
| MAA-03 | Flames peek top, bottom and sides of the tawa: wide single burner, ring on the rim | built, not re-played | eye: 1366×768 | `docs/feedback/cook-playtest-2026-09-29.md` M2, M7 |
| MAA-04 | Dough: two realistic piles, one tap sends one ball; ball goes back if you change your mind; no tray (question: can a pile run out?) | built, not re-played | eye: dough shelf | `docs/feedback/cook-playtest-2026-09-29.md` M3, Q14 |
| MAA-05 | Cooked maani is flat (raw, half, cooked, burnt), never puffed like a poori | built, not re-played | eye: each state | `docs/feedback/cook-playtest-2026-09-29.md` M5 |
| MAA-06 | Turner is a flat wooden turner, not "weird tweezers" | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` M6, Q15 |
| MAA-07 | Tawa is high-resolution, not a 400 px upscale | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` M8 |
| MAA-08 | Count badge does not overlap the hob; roll-tawa plate not cut off; tick not over the resting spatula (builder) | built, not re-played (C3, 5 Oct: rechecked at 1280×800 and 844×390, no count badge on the hob, plates whole, the tick clear of the turner; 915×375 is no longer in the matrix) | eye: 1280×800, 915×375 | `docs/archive/cook/cook-with-nani-todo.md` Wave 4 (builder) |
| MAA-09 | Dough piles have no drop shadow (top-down) | **open** | eye: dough shelf | `docs/feedback/cook-playtest-2026-10-06.md` M2 |
| MAA-10 | Maani lands on the thali's flat inner area, never the curled rim | **open** | eye: ×2 zoom, 3 maani | `docs/feedback/cook-playtest-2026-10-06.md` M5 |
| MAA-11 | Sizzle plays only while something is on a lit tawa; the knob turns the flame off | **open** | ear: empty tawa, flame off | `docs/feedback/cook-playtest-2026-10-06.md` M6 |
| MAA-12 | Rolling pin draws above the size ring; about 10% longer | **open** | eye: roll | `docs/feedback/cook-playtest-2026-10-06.md` M7, M12 |
| MAA-13 | Ghost finger shows the tap after a pause until the move is made (not once per profile) | **open** | eye: second play | `docs/feedback/cook-playtest-2026-10-06.md` M3 |
| MAA-14 | Nani's "pass me" on screen, pausing play, 3-second ring; not in the first plays of a mode (pending decision) | **open** | eye: story day 2+ | `docs/feedback/cook-playtest-2026-10-06.md` M9, M10 |

## Cook: daar

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| DAAR-01 | Swipe chop stays ("there's no game now" when it became tap crate, tap knife) | built, not re-played | auto: `build/test_cook.py`; eye: chop | `docs/feedback/cook-playtest-2026-09-29.md` D1, X15, Q4 |
| DAAR-02 | Ladle: handle not up in the air, reads as a *kadchi*, not a dipper (still a dipper in the latest art) | **reopened** (6 Oct play-test) | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` D6; `docs/feedback/cook-playtest-2026-10-06.md` |
| DAAR-03 | Stir shows speed and laps (speed dial, laps as Kutchi word) | built, not re-played | eye: stir | `docs/feedback/cook-playtest-2026-09-29.md` D7, Q10 |
| DAAR-04 | Chopped rows reset at the pan and tick as each goes in | built, not re-played | auto: order-card state; eye · CMP-09 | `docs/feedback/cook-playtest-2026-09-29.md` D9 |
| DAAR-05 | Ginger and added things are not white dots; stir turns the pictured contents (review bowl still shows dry chilli and curry leaves) | built, not re-played | eye: each stage | `docs/feedback/cook-playtest-2026-09-29.md` D3, D10 |
| DAAR-06 | Finished daar is photoreal on a small wooden trivet | built, not re-played | eye: serve | `docs/feedback/cook-playtest-2026-09-29.md` D5 |
| DAAR-07 | Pot and chopped-ingredient container are straight top-down | built, not re-played | eye: 1366×768 · ART-03 | `docs/feedback/cook-playtest-2026-09-29.md` D11 |
| DAAR-08 | Chop card writes quantities at every level (open question: should L1 say *ba dungri* only?) | built, not re-played (C3, 5 Oct, decision 41: no written quantity from L3; her face replays the numbers) | eye: L1–L4 · INT-10 | `build/reports/daar-v3.md` (open question) |
| DAAR-09 | A mistake redoes only the wrong step; after three wrong tries the game shows the right way (whole-game restart now) (pending decision) | **open** | eye: daar wrong spice | `docs/feedback/cook-playtest-2026-10-06.md` D9, T8 |
| DAAR-10 | Trivet stays on the counter; only the bowl tips into the pot (one image now) | **open** | eye: daar in | `docs/feedback/cook-playtest-2026-10-06.md` D4 |
| DAAR-11 | Ladle turns as it goes round so its handle stays on the rim | **open** | eye: stir | `docs/feedback/cook-playtest-2026-10-06.md` D6 |
| DAAR-12 | Laps and speed on the card; asked speed green, the other yellow, spill red (pending decision) | **open** | eye: stir L1–L3 | `docs/feedback/cook-playtest-2026-10-06.md` D12, D13 |
| DAAR-13 | Chop: knife smaller, clean cut (tip clipped: use the margin-safe cut), blade cuts; items spread; slower at L1; ghost finger drags the knife; row highlights at the right count | **open** | eye: chop L1 · ART-02 | `docs/feedback/cook-playtest-2026-10-06.md` D1, D10 |
| DAAR-14 | Silver saucepan top edge not cut flat (which pot to find at review) | **open** | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-10-06.md` D7 |
| DAAR-15 | Old Tadka station retired from the labs (pending decision) | **open** | eye: labs.html | `docs/feedback/cook-playtest-2026-10-06.md` TD1 |

## Cook: chaat

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CHT-01 | Quantities are not only heard: card says *ba dungri* at L1 (counting rule) | built, not re-played | eye: L1 · INT-10 | `docs/feedback/cook-playtest-2026-09-29.md` T1 |
| CHT-02 | Ingredient bowls side-on, not three-quarter | built, not re-played | eye: 1366×768 | `docs/feedback/cook-playtest-2026-09-29.md` T2 |
| CHT-03 | Glass bowl fully side-on with layer strips (tomato pot is a recoloured stand-in) | **reopened** (6 Oct play-test) | auto: `build/check_vessel_meta.py` check_chaat; eye | `docs/feedback/cook-playtest-2026-09-29.md` T3, Q2; `docs/feedback/cook-playtest-2026-10-06.md` |
| CHT-04 | Layers read as food, not liquid or flat rectangles; chilli layer not too thick; tidy ingredient grid with chips; no big red digit tally; card shows the order; bowl not huge | built, not re-played | eye: serve and build states | `docs/design-language/ui-design-system.md` §14 |
| CHT-05 | Chop timer ring in the shared colours, not the old ones (verify) | built, not re-played | eye: chop phase · CMP-04 | `docs/design-language/ux-principles.md` §15 |
| CHT-06 | Potato row ticks only at the second of two; the checker counts quantities (one potato passed for two) | **open** | eye: chaat L1–L3 | `docs/feedback/cook-playtest-2026-10-06.md` T3, T7 |
| CHT-07 | Chaat flow: ask → pantry → chop → he says the sequence → bowl (pending decision) | **open** | eye: story chaat | `docs/feedback/cook-playtest-2026-10-06.md` T2 |
| CHT-08 | On a retry the order is re-said on his own card with rows lit as spoken; no extra card | **open** | eye: chaat retry | `docs/feedback/cook-playtest-2026-10-06.md` T5 |
| CHT-09 | *arre re* (never confirmed, not a family word) removed; find why it plays on correct layers | **open** | ear: chaat L1 | `docs/feedback/cook-playtest-2026-10-06.md` T9 |

## Cook: samosa

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SAM-01 | Spoken order says "with three chillies" (not "and") and lists all ingredients; "with" is still an English placeholder | built, not re-played | eye/ear: orders · LNG-03 | `docs/feedback/cook-playtest-2026-09-29.md` S1 |
| SAM-02 | Ingredients are top-down heaps, no bowls | built, not re-played | eye: 1366×768 | `docs/feedback/cook-playtest-2026-09-29.md` S2, X8 |
| SAM-03 | Base filling (*chundo* or *bataato*) is always a row; one filling per order; base never zero | built, not re-played | auto: order probe (6,000 orders); eye | `docs/feedback/cook-playtest-2026-09-29.md` S3, S18 |
| SAM-04 | Counter shown as you fill, per the counting rule | built, not re-played | eye: L1–L4 · INT-10 | `docs/feedback/cook-playtest-2026-09-29.md` S5 |
| SAM-05 | Fold: fixed fold pictures; first fold does not hide the filling | **reopened** (6 Oct play-test) | eye: each fold | `docs/feedback/cook-playtest-2026-09-29.md` S8, S11, Q3; `docs/feedback/cook-playtest-2026-10-06.md` |
| SAM-06 | Second samosa starts empty when its filling differs from the first | built, not re-played | eye: L3 | `docs/feedback/cook-playtest-2026-09-29.md` S9 |
| SAM-07 | Samosas sit inside the plate's rim | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` S10 |
| SAM-08 | Frying area bigger: wide single burner, bigger karahi that does not cover the knob | built, not re-played | eye: 1366×768 | `docs/feedback/cook-playtest-2026-09-29.md` S19 |
| SAM-09 | Jharo (slotted spoon) goes under the samosas, not over | built, not re-played | eye: fry | `docs/feedback/cook-playtest-2026-09-29.md` S20 |
| SAM-10 | Filling reads as filling, not two dots on the fold line; fry layout centred (orchestrator) | built, not re-played | eye: fold, fry | `docs/process/overnight-log.md` 01:34–03:40 (orchestrator) |
| SAM-11 | Card: one block per kind, head "*ba* samosa", fillings under it; no lone "samosa" row (pending decision) | **open** | eye: samosa L1–L3 · CMP-08 | `docs/feedback/cook-playtest-2026-10-06.md` A2 |
| SAM-12 | Top level: all strips laid out, tap a strip to fill, then roll; no auto re-spoon (pending decision) | **open** | eye: samosa L3 | `docs/feedback/cook-playtest-2026-10-06.md` A5, A11 |
| SAM-13 | Nani says "turn on the pan", then "fry"; the knob turns off and the sizzle stops | **open** | ear: fry | `docs/feedback/cook-playtest-2026-10-06.md` A6, A7 |
| SAM-14 | Samosas sit inside the oil and the plate's flat area | **open** | eye: ×2 zoom, fry and plate | `docs/feedback/cook-playtest-2026-10-06.md` A8, M5 |
| SAM-15 | Peas are *matar* (fresh green peas), not *watana* (fried peas) (pending decision; Zafar confirms spelling) | **open** | ear/eye: samosa chip | `docs/feedback/cook-playtest-2026-10-06.md` A1 |

## Cook: sekelo

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SEK-01 | Headline is *Muke sekelo khape* (was "mishkaki"; mishkaki is the meat cubes); *sekelo* still to confirm with Mum | built, not re-played | eye/ear: card · LNG-04 | `docs/feedback/cook-playtest-2026-09-29.md` K1 |
| SEK-02 | All-new art, not reused old grill, rack, board and skewer; rack does not read as an empty picture frame; frame and skewers look good | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` K2, K7 |
| SEK-03 | Several skewers get a mini card each; order shown as a little skewer | fixed | eye: L3–L4 · CMP-08 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §2, §9 |
| SEK-04 | No bare "boga" skewers; a veg skewer names what is on it, in order | built, not re-played | auto: data check; eye | `docs/feedback/cook-playtest-2026-09-29.md` K4 |
| SEK-05 | No duplicate pick in an order ("tameto, tameto") | fixed | auto: `build/test_cook.py --orders` | `docs/archive/cook/cook-with-nani-todo.md` Wave 1 |
| SEK-06 | Onion and tomato are big and chunky, the same in the bowl and on the skewer, not oversized against the stick | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` K5 |
| SEK-07 | Plate skewers drawn close together; skewer handle sits off the plate; plate lines up with grill and rack | **reopened** (6 Oct play-test) | eye: plate state | `docs/feedback/cook-playtest-2026-09-29.md` K8; `docs/feedback/cook-playtest-2026-10-06.md` |
| SEK-08 | One job per phase (thread, then grill); no chips on the grill | fixed | eye: each phase | `docs/design-language/ux-principles.md` §5, §6 |
| SEK-09 | Turning a skewer too soon shows nothing and costs nothing (too late not yet tested). An early turn should show the meat still uncooked; a late one burnt (charred art exists). **Decided (Zafar, 30 Sept):** a mistimed skewer goes back to the rack, filled and ready to grill again; the redo and its time are the whole cost (no score penalty). The family can react (undercooked / burnt). | built, not re-played (C3, 5 Oct: a turn before the green shows the raw side, a skewer left to char shows it charred; both go back to the rack to grill again, nothing scored; no family reaction yet) | eye: grill phase, turn early / on time / late, L1–L4 · INT-05 | Zafar, orchestrator chat 30 Sept |
| SEK-10 | Count-along at L1 only (L2 still speaks every piece) | **open** | ear: sekelo L2 | `docs/feedback/cook-playtest-2026-10-06.md` S1 |
| SEK-11 | Spoken order: each skewer's sequence follows it at once ("two mixed: first…, then…; one onion") | **open** | ear: L2–L3 | `docs/feedback/cook-playtest-2026-10-06.md` S3 |
| SEK-12 | Quantity two written where said (with SH-52) | **open** | eye: L3 bulb | `docs/feedback/cook-playtest-2026-10-06.md` S4 |
| SEK-13 | Card ticks each piece of a mixed skewer as it goes on | **open** | eye: mixed skewer | `docs/feedback/cook-playtest-2026-10-06.md` S5 |

## Cook: general

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CK-01 | Levels 2–4 of every station (Cook and clinic) not yet played by Zafar; needs his pass | open | eye: L2–L4 · INT-11 | `docs/feedback/cook-playtest-2026-09-29.md` K11 |
| CK-02 | Hobs are straight with clean corners and even sides, one family for all burner counts (not composed from one 2-burner picture) | built, not re-played | auto: `build/check_vessel_meta.py` · LAY-10; eye | `docs/feedback/cook-playtest-2026-09-29.md` X5, C3 |
| CK-03 | Knobs big enough, match the face badges; on = glowing ring, no icon | built, not re-played | eye: 390×844 · LAY-04 | `docs/feedback/cook-playtest-2026-09-29.md` X5, C4, Q8 |
| CK-04 | Flames small (peek, never touch neighbours), on whenever the knob is on; heat gauge thicker and readable against them | built, not re-played | eye: 4-pan hob | `docs/feedback/cook-playtest-2026-09-29.md` X6, C9, C10, S21 |
| CK-05 | One camera look per station (no side-on jars with top-down sekelo and three-quarter bowls); straight-down station backgrounds | built, not re-played | eye: each station · ART-03 | `docs/archive/cook/cook-with-nani-phase-a-design.md` §2 |
| CK-06 | Things inside pots and pans look real (chai liquid, daar oil, contents), not white dots or swirling dots | built, not re-played | eye: each cooking state | `docs/feedback/cook-playtest-2026-09-29.md` X9, C8, D2 |
| CK-07 | One review at serve in every station: large round face circle over the dish, happy or frown, no pretend eating or sliding half-body; wrong marks the wrong row | built, not re-played | eye: each station · CMP-13 | `docs/design-language/ui-design-system.md` §14a |
| CK-08 | No oil-heating ring (it looks like the timing ring); sizzle means ready | built, not re-played | eye: samosa, daar | `docs/feedback/cook-playtest-2026-09-29.md` S16, Q9 |
| CK-09 | One house chakla: dark walnut, not blown up or low-res; no board drawn on a board | built, not re-played | eye: maani, samosa · ART-03 | `docs/archive/cook/cook-with-nani-phase-a-design.md` §2 |
| CK-10 | Tadka arrow and pulse from small pan to pot; chopped vegetables thrown high enough | fixed | eye: daar | `docs/archive/cook/cook-with-nani-todo.md` Wave 1 |
| CK-11 | Nothing covers the game: Nani's bubble once covered the top pantry shelf on a phone (915×375); she now talks from the sidebar | fixed | auto: `build/test_cook.py` (topmost check) · LAY-06 | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-12 | Pot and pan contents sit inside the rim, not above it (vessel geometry stored as fractions of the image) | fixed | eye: every vessel state · LAY-10 | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-13 | Flames visible under the pans (ring drawn under the pan's edge) | fixed | eye: lit burner | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-14 | Nothing stands on a lit burner (a glass once did) | fixed | eye: hob · H11 | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-15 | Count badges never overlap a speech bubble, card or tool | fixed | eye · LAY-12 | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-16 | A hidden item's shadow hides with it | fixed | eye: after each pick | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-17 | Card and recipe text clears at each new order (no stale "Nani shows you") | fixed | eye: second order · INT-03 | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-18 | A customer's bubble never covers their own face | fixed | eye: serve | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-19 | Art is WebP and light (10 MB once became 2 MB) | fixed | auto: asset size budget (planned) | `docs/archive/build-logs/cook-with-nani-build-log.md` §3 (builder) |
| CK-TB-01 | Take it back until Done (E14): 9 of 12 Cook stations offer no take-back (only chaat, assemble and sekelo do) | open | sandbox #takeback flows | `build/reports/step3-r4.md` (1 Oct) |
| CK-TAB-01 | Tablets: Cook's play items grow to use a 4:3 screen (decision 24); each station needs a 4:3 layout before the stage can grow them | open | sandbox 1024×768, 1180×820, 1366×1024 | `build/reports/step3-r3a.md` |
| CK-20 | Rule: things inside a container sit on its flat inner area, never the rim or sides (thali, tray, oil, plate) | **open** | eye: every vessel · LAY-10 | `docs/feedback/cook-playtest-2026-10-06.md` M5, A8 |
| CK-21 | Served dishes on the counter drawn at its angle, on a tray, shadows to the right (pending decision) | **open** | eye: every serve | `docs/feedback/cook-playtest-2026-10-06.md` K4 |
| CK-22 | The closing line lists back what they got, then thank you / shabash (no repeated "give me") | **open** | ear: every serve | `docs/feedback/cook-playtest-2026-10-06.md` PA7, C23 |
| CK-23 | A wrong item means redo just that item; second try with help; after three, show the right way (pending decision) | **open** | eye: every station | `docs/feedback/cook-playtest-2026-10-06.md` C20, D9, T8 |
| CK-24 | Story days are clearly days (not levels 1–4) on Cook's home | **open** | eye: home | `docs/feedback/cook-playtest-2026-10-06.md` C26 |
| CK-25 | Labs station pages load fast (10–12 s now): measure, then load per station | built, not re-played (S03, Cook loads only its own files and the pantry at open, ~500 KB of JS instead of ~1.07 MB; a station's code loads when it opens, or during the greeting for an order: `Cook.Mech.need`, js/cook/index.js PARTS; loadcheck 11/11) | auto: timing; eye | `docs/feedback/cook-playtest-2026-10-06.md` L1 |
| CK-26 | The greeting: your wrong pick red, the other wrong ones grey, the right one clear against the brown, Nani's answer a thought bubble; meaning shown by gesture and pictures (pending decision) | **open** | eye: greeting | `docs/feedback/cook-playtest-2026-10-06.md` G1, G2 |

## Clinic

### Clinic-wide

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-01 | Rough stand-in art made judging hard ("so overwhelmed by how terrible the visuals were"); real art after prototypes | **reopened** (6 Oct play-test) | eye: each room | `docs/feedback/clinic-playtest-2026-09-29.md` G2; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-02 | Backgrounds locked first: six new rooms, heal games have a background, nothing faded; pharmacy straight-on belt (CB4c) still to come | built, not re-played | eye: 1366×768 · ART-03 | `docs/feedback/clinic-playtest-2026-09-29.md` G1 |
| CLN-03 | Clinic uses what Cook learned: shared order card as patient card, guide box, end pop-up, review faces, spacing | built, not re-played | eye: 1366×768 · CMP-01 | `docs/feedback/clinic-playtest-2026-09-29.md` G3 |
| CLN-04 | Language builds up simply (man, woman, boy, girl; old, young; tall, short; colours; "with the baby"); per-child complexity tracker deferred | built, not re-played | eye/ear: waiting room ladder | `docs/feedback/clinic-playtest-2026-09-29.md` G4, W4, CQ2 |
| CLN-05 | No Nani box in the clinic; the doctor fills her role | built, not re-played | eye: sidebar · CMP-06 | `docs/feedback/clinic-playtest-2026-09-29.md` §13f |
| CLN-06 | Each stage clears its own UI: no reply pills from an earlier round left on screen until refresh | built, not re-played | auto: stage-end UI check; eye · INT-03 | `docs/feedback/clinic-playtest-2026-09-29.md` §13f |
| CLN-07 | Lab debug log (bottom left) does not overlap the pills or counter | open | eye: lab pages | `docs/feedback/clinic-playtest-2026-09-29.md` §13a–b |
| CLN-08 | Heal-game close-up background blurred more in code so the room never competes; certificate frame blurred to match | open | eye: heal games | `docs/game-design/modes/clinic.md` §B |
| CLN-09 | Clinic tooth at least 1 cm even zoomed (0.50 cm on iPad); trolley objects about 60 design px on phone; replay timer does not overlap a recast line (builder) | open | auto: `build/check_hotspots.py` · LAY-11 | `docs/archive/build-logs/clinic-build-log.md` Known gaps (builder) |
| CLN-81 | The girl's finished art in the whole story: waiting room, diagnosis, send-off, sticker and card faces (rough sprites and the stand-in body now) | **open** | eye: clinic morning end to end | `docs/feedback/clinic-playtest-2026-10-06.md` CL1 |
| CLN-82 | L2+: once a count is reached, the next step's row appears and its tool glows after a pause (stuck after dabs, kicks, wipes, jugs: scrape, knee, boing, foot) | **open** | eye: every heal game L2, L3 | `docs/feedback/clinic-playtest-2026-10-06.md` H1, K5, B5, FT4, TA3 |
| CLN-83 | No extra click when the outcome is clear ("Found it", end ✓, stage buttons): it moves on after a beat (pending decision) | **open** | eye: diagnosis, pharmacy, scrape, ear | `docs/feedback/clinic-playtest-2026-10-06.md` D2, P2, S4, E9 |
| CLN-84 | The request first in a pop-up, then a quiet game (pharmacy and every heal game; decision 53). Re-raised 8 Oct: scrape and other heal games still open with no pop-up (only the pharmacy has one, `js/clinic/stages/pharmacy.js` `requestPopup`); every heal game opens with the same pop-up as Cook, which then folds into the left sidebar | **open** | eye/ear: pharmacy L3 and all nine heal games L1–L3 (scrape first) | `docs/feedback/clinic-playtest-2026-10-06.md` P1, P8, T5, B7 |
| CLN-85 | Patient face top right in heal games (clear of the doctor's box); in the eye game her bubble under her mouth | **open** | eye: each heal game | `docs/feedback/clinic-playtest-2026-10-06.md` G2, EY5 |
| CLN-86 | Dialogue in bubbles from the speaker's face (she says salaam, he replies; she says "too cold"); instructions in the doctor's box | **open** | eye/ear: waiting, fever | `docs/feedback/clinic-playtest-2026-10-06.md` CL2, FV3, D7 |
| CLN-87 | Zoom in and out about 1.5 s; zoom-out from full zoom on the healed part | **open** | eye: any heal game | `docs/feedback/clinic-playtest-2026-10-06.md` Z1, Z2 |
| CLN-88 | Clinic lab pages load fast (no serial JSON chain, games loaded on demand) | **open** | auto: timing | `docs/feedback/clinic-playtest-2026-10-06.md` FT1 |
| CLN-89 | Labs point at the current clinic lab only (old clinic lab index still reachable) | **open** | eye: labs.html | `docs/feedback/clinic-playtest-2026-10-06.md` L1 |
| CLN-109 | No voice carries over into the next stage: finishing a heal game quickly left the doctor still reading in the send-off. Cause: `Kit.Voice.clear()` (`js/clinic/kit.js`) resets the queue pointer but lines already chained still play, and a playing family clip has no handle to stop it | **open** | ear: scrape L1 finished fast, then send-off; every stage change | `docs/feedback/clinic-playtest-2026-10-08.md` P2 |

### Waiting room

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-10 | Waiting room not too wide, front half not empty floor; something on the wall says "doctor's" | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` W1 |
| CLN-11 | People sit on one large bench (six seats, no armchairs) | **reopened** (6 Oct play-test) | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` W2; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-12 | Picking the right person: no walking; tick under each person; the picked person rises off the seat | built, not re-played | eye: each level | `docs/feedback/clinic-playtest-2026-09-29.md` W3, §13 |
| CLN-13 | At most six people at every level (changed from 8–12) | **reopened** (6 Oct play-test) | eye: L4 | `docs/feedback/clinic-playtest-2026-09-29.md` W5, §13a; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-14 | "Call them in" does not leak: card shows a round face with no text; call heard from L3 | **reopened** (6 Oct play-test) | auto: leak bot; eye · LNG-02 | `docs/feedback/clinic-playtest-2026-09-29.md` §13a; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-15 | L4: pick everyone straight away, judge at the end, ticks show numbers; L5 has the same fixes | built, not re-played | eye: L4, L5 | `docs/feedback/clinic-playtest-2026-09-29.md` §13a, §13f |
| CLN-90 | Selector circles and "call them in" boxes spaced cleanly | **open** | eye: 1366×768, 844×390 | `docs/feedback/clinic-playtest-2026-10-06.md` W1 |
| CLN-91 | The closed card's eye is a small bulb, no counter (pending decision) | **open** | eye: W L3 | `docs/feedback/clinic-playtest-2026-10-06.md` W5 |
| CLN-92 | "To the doctor's room" button (location, not "where does it hurt") | **open** | eye: waiting end | `docs/feedback/clinic-playtest-2026-10-06.md` CL3 |

### Diagnosis

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-16 | "Found it" and "Next" variant is explained (folded into D1 as level 2) | **reopened** (6 Oct play-test) | eye: L2 | `docs/feedback/clinic-playtest-2026-09-29.md` D2; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-17 | Scene: patient sits on the bed edge, doctor beside them three-quarter turned (or stands by an anatomy poster) | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` D3, CQ3 |
| CLN-18 | D3 tools are clear: torch looks like a torch (not a pill), thermometer looks like one, one cue per tool, two tools at L1 | **reopened** (6 Oct play-test) | eye: ×2 zoom | `docs/feedback/clinic-playtest-2026-09-29.md` D5; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-93 | D1: bigger patient, smaller dots centred on the parts; a tried dot goes grey after "no", never green; she says yes and the doctor names the part | **open** | eye: D1 L1, L2 | `docs/feedback/clinic-playtest-2026-10-06.md` D1, D3, D4, D5 |
| CLN-94 | D3: card like sekelo (tool head, parts under it, ticking); the torch zooms on the face by itself (eye taps now ignored without the 🔍); one highlight colour; a headline; bigger standing patient (pending decision) | **open** | eye: D3 L1, L2 | `docs/feedback/clinic-playtest-2026-10-06.md` D8, D10, D11, D12, D13 |
| CLN-95 | No swirl icon over the sore part | **open** | eye: D1 | `docs/feedback/clinic-playtest-2026-10-06.md` D9 |

### Pharmacy

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-19 | Items are not at 45 degrees; the game uses the painted belt, not a code-drawn belt across the top; straight-on belt (CB4c) still to come | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` P1 |
| CLN-20 | Level 3 is harder by faster belt or closer items, not a timer; hard-to-draw "filling" item is a tube | built, not re-played | eye: L3 · INT-08 | `docs/feedback/clinic-playtest-2026-09-29.md` P4, CQ5 |
| CLN-21 | Doctor says "[Bring me] the plaster"; "Muke plaster khape" is a customer's line (English placeholder, to record with Mum) | built, not re-played | eye: pharmacy card · LNG-04 | `docs/feedback/clinic-playtest-2026-09-29.md` §13b |
| CLN-22 | A filled slot loses its dashed outline; a placed item can be put back; first pick is scored | built, not re-played | auto: take-back test; eye · INT-02 | `docs/feedback/clinic-playtest-2026-09-29.md` §13b |
| CLN-23 | Items sit on the belt (flat base, contact shadow), not floating or tilted | **reopened** (6 Oct play-test) | eye: ×2 zoom · ART-03 | `docs/feedback/clinic-playtest-2026-09-29.md` §13b; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-24 | Pharmacy tray feeds the heal game; a wrong pick costs score, nothing greyed out | built, not re-played | eye: pharmacy to heal | `docs/feedback/clinic-playtest-2026-09-29.md` §13 |
| CLN-96 | Wrong colour plaster never ticks (red ticked for *lilo*); reproduce with a seed | **open** | eye: pharmacy L2 | `docs/feedback/clinic-playtest-2026-10-06.md` P5 |
| CLN-97 | Items sit on the belt (green bottle floats); jugs cut cleanly; red plaster red all the way | **open** | eye: ×2 zoom | `docs/feedback/clinic-playtest-2026-10-06.md` P1, P9, P10 |

### Send-off

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-25 | Patient leaving with door half open, doctor beside; both stand left in the free wall space, not over the green cross sign | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` E1, §13d |
| CLN-26 | Happy and sad clear without English: thought bubble with four feeling faces (happy, sad, hot, cold); goodbye in the scene from L2 | built, not re-played | eye: L2–L4 | `docs/feedback/clinic-playtest-2026-09-29.md` E2, E4, CQ6, §13d |
| CLN-27 | An apple, never a lolly (also boing's lollipop) | built, not re-played | auto: grep lolly, lollipop · CUL-02 | `docs/feedback/clinic-playtest-2026-09-29.md` E3 |
| CLN-28 | Doctor card does not list every line up front or repeat them; no script card | built, not re-played | eye: L2–L4 · CMP-07 | `docs/feedback/clinic-playtest-2026-09-29.md` §13e |
| CLN-29 | Send-off L3: help items and reply pills do not sit on top of each other; reply pills only when needed | built, not re-played | eye: L3 · INT-03 | `docs/feedback/clinic-playtest-2026-09-29.md` §13f |
| CLN-98 | She says how she feels in her bubble, on her real art, then the child picks the feeling, clearly | **open** | eye: send-off L1, L2 | `docs/feedback/clinic-playtest-2026-10-06.md` SO1 |

### Heal games

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-30 | Each heal game explains itself with one "why" beat ("why am I clicking on the things?"), no English sentences in bubbles | built, not re-played | auto: `build/check_onboard.mjs` · LNG-01 | `docs/feedback/clinic-playtest-2026-09-29.md` G5, §13g |
| CLN-31 | Fever playable: tray id is thermometer, first-time help does not block taps, fan does not look like the strip; hot and cold to "just right" (Zafar's review pending) | built, not re-played (S03: plays to "just right" at L1-L3, fair 100%, leak bot passes) | auto: help-path test; eye | `docs/feedback/clinic-playtest-2026-09-29.md` G8, H-fever; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-32 | Scrape: not too clicky; plasters in clear colours and order; a plaster can be taken off; sequence on the shared card | built, not re-played | eye: scrape · INT-02 | `docs/feedback/clinic-playtest-2026-09-29.md` H-cut, §13h |
| CLN-33 | Knee: bandage shows on every tap; flashing stops when done; named leg not highlighted at top level; level 3 left and right clear (leak bot blind rate about 25% at L1 accepted) | built, not re-played | auto: leak bot; eye · INT-06 | `docs/feedback/clinic-playtest-2026-09-29.md` H-knee, §13i, §13l |
| CLN-34 | Ear: level 1 not too hard (*wadho* and *nindho* not too early); wax is dragged to a tissue, not tapped; pop-up wax does not vanish by itself | **reopened** (6 Oct play-test) | eye: L1 | `docs/feedback/clinic-playtest-2026-09-29.md` §13j; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-35 | Tooth: brushing clear; no confusing bug; voice-overs, input live and sidebar work | **reopened** (6 Oct play-test) | eye: tooth | `docs/feedback/clinic-playtest-2026-09-29.md` H-tooth, §13k; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-36 | Taste game is understandable (soothing drinks redesign) | built, not re-played | eye: drinks | `docs/feedback/clinic-playtest-2026-09-29.md` H-taste |
| CLN-37 | Boing: plaster part clear; apple not lollipop; coloured beads idea | built, not re-played | eye: boing | `docs/feedback/clinic-playtest-2026-09-29.md` H-boing |
| CLN-38 | Eye: "what else other than fruit and veg?" answered; "why am I clicking on the things?" answered | built, not re-played | eye: eye game | `docs/feedback/clinic-playtest-2026-09-29.md` H-eye |
| CLN-39 | Eye cover cannot be taken back | open | eye: eye game · INT-02 | `docs/feedback/clinic-playtest-2026-09-29.md` H-eye |
| CLN-40 | Foot: swirly part understood; toes, tweezers and plaster position clear; splinters buzz-wire style, both feet at L3 | built, not re-played | eye: foot | `docs/feedback/clinic-playtest-2026-09-29.md` H-foot |
| CLN-41 | Tummy, hic and hair still on the old help; decide later | open | eye: those games · INT-04 | `docs/feedback/clinic-playtest-2026-09-29.md` CQ14 |
| CLN-42 | No unexplained icons: no 🩺 badge bottom left, no gold half-circle on tools, no glove on the syringe | built, not re-played | eye: every heal game | `docs/feedback/clinic-playtest-2026-10-01.md` P1, P16, P68, 1:0:00, 1:8:32–8:46, 2:9:00 |
| CLN-43 | A heal game opens by zooming from the patient on the bed to the sore part; never a lone limb on a table; the background soft, not washed out (D1) | built, not re-played | eye: each heal game's opening, 1366×768 and 844×390 | `docs/feedback/clinic-playtest-2026-10-01.md` P2, P3, 1:0:00–1:51, 2:0:26 |
| CLN-44 | Every heal card has a headline (the goal) and folds to it with the check | built, not re-played | eye: each heal game · CMP-07 | `docs/feedback/clinic-playtest-2026-10-01.md` P10, 1:5:07–5:33, 1:12:20 |
| CLN-45 | At L3 no step asks more than two things to remember; the jump from L2 to L3 is one thing | built, not re-played | eye: scrape L2 and L3 · INT-10 | `docs/feedback/clinic-playtest-2026-10-01.md` P14, P17, 1:7:36–9:04 |
| CLN-46 | The scrape and the cotton bud have a skill, not just taps | built, not re-played | eye: scrape, ear | `docs/feedback/clinic-playtest-2026-10-01.md` P11, P33, 1:5:35–6:52, 1:17:47–19:21 |
| CLN-47 | Sides are said and tested only in the diagnosis; the close-up shows the one sore knee, foot or eye (D10) | built, not re-played | eye: knee, foot, eye L3 | `docs/feedback/clinic-playtest-2026-10-01.md` P25, P82, P91, 1:13:35–14:58 |
| CLN-48 | Knee wrap: one dot lit at a time, waiting for the tap; nothing moves on by itself | built, not re-played | eye: knee L2, L3 | `docs/feedback/clinic-playtest-2026-10-01.md` P28, 1:15:54–17:09 |
| CLN-49 | Ear: the blob you aim at is the one you pick up (small next to big) | built, not re-played | eye: ear L3 · INT-06 | `docs/feedback/clinic-playtest-2026-10-01.md` P36, 1:19:51–20:14 |
| CLN-50 | Ear: more wax is shown from the start, spawns as you remove it, over a bigger ear | built, not re-played | eye: ear L2, L3 | `docs/feedback/clinic-playtest-2026-10-01.md` P38, P39, 1:20:31–21:31 |
| CLN-51 | Tooth: the drill's tip is under the finger | built, not re-played | eye: ×2 zoom, drill | `docs/feedback/clinic-playtest-2026-10-01.md` P42, 1:22:47–23:01 |
| CLN-52 | Tooth: drilled inside the mouth; decay jagged and scattered by level | built, not re-played | eye: tooth L1, L3 | `docs/feedback/clinic-playtest-2026-10-01.md` P43, P44, 1:23:04–23:31, 1:25:04 |
| CLN-53 | Tooth fill: a clear button, a green zone with red either side; harder by level | built, not re-played | eye: tooth fill | `docs/feedback/clinic-playtest-2026-10-01.md` P45, 1:23:31–24:36, 1:25:17 |
| CLN-54 | Drinks: the recipe on separate rows under a headline; no counts at L1; the pour shown | built, not re-played | eye: drinks L1 | `docs/feedback/clinic-playtest-2026-10-01.md` P47–P49, 1:25:21–26:41 |
| CLN-55 | Drinks are never a three-recipe memory test; the sore-spot game with one drink (D15e) | built, not re-played | eye: drinks L3 | `docs/feedback/clinic-playtest-2026-10-01.md` P50, P51, 1:26:48–29:49 |
| CLN-56 | Fever: the blanket goes over the shoulders, never the face | built, not re-played | eye: fever, cold | `docs/feedback/clinic-playtest-2026-10-01.md` P55, 2:0:14–0:26 |
| CLN-57 | Fever: always clear what to do next (no tools that silently do nothing); a live thermometer with a zone | built, not re-played (S03: one row at a time, the named thing glows on hesitation, the gauge live with one green zone) | eye: fever, after each change | `docs/feedback/clinic-playtest-2026-10-01.md` P58, P59, 2:1:01–2:21; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-58 | Boing: the syringe's end starts the jab; tapping the syringe never takes beads out by surprise | built, not re-played | eye: boing L1, L3 | `docs/feedback/clinic-playtest-2026-10-01.md` P69, P70, 2:9:07–11:16 |
| CLN-59 | Eye: the sore eye is clear | built, not re-played | eye: eye L1 | `docs/feedback/clinic-playtest-2026-10-01.md` P74, 2:11:55–12:06 |
| CLN-60 | Eye: the first-time help never presses *haa* on a row read wrong | built, not re-played | auto: help path; eye: first play · LNG-02 | `docs/feedback/clinic-playtest-2026-10-01.md` P76, 2:12:25–12:39 |
| CLN-61 | Eye: obviously an eye chart; the patient seen looking at it; chart rows highlight and tick like card rows | **reopened** (6 Oct play-test) | eye: eye test | `docs/feedback/clinic-playtest-2026-10-01.md` P78, P79, P83, P87, 2:12:59–14:26, 2:15:49–17:16; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-62 | Eye: after *na* the dropper over the eye shows what to do | built, not re-played | eye: eye, a wrong read | `docs/feedback/clinic-playtest-2026-10-01.md` P77, P88, 2:12:39–12:59, 2:17:16–17:45 |
| CLN-63 | Eye L3: no hidden first step without a row or a line | built, not re-played | eye: eye L3 | `docs/feedback/clinic-playtest-2026-10-01.md` P82, 2:15:22–15:49 |
| CLN-64 | Foot: the sole; a path with turns; touching the side is a scored mistake | built, not re-played | eye: foot L2, L3 | `docs/feedback/clinic-playtest-2026-10-01.md` P90, P92, 2:18:35–20:07 |
| CLN-65 | Patients have hot, cold, sore and happy states, from one body | **reopened** (6 Oct play-test) | eye: each state | `docs/feedback/clinic-playtest-2026-10-01.md` P57, 2:0:53–1:01; `docs/feedback/clinic-playtest-2026-10-06.md` |
| CLN-66 | No lollipop anywhere in the clinic: the boing tool list on the wide shot still shows 🍭 (the close-up shows the apple) | built, not re-played | eye: boing wide shot · CUL-02 | orchestrator review of R5's zoom sheets, 2 Oct |
| CLN-67 | The patient's round face in the close-up matches the patient (a boy's face shows over the girl) | built, not re-played | eye: each heal close-up | orchestrator review of R5's zoom sheets, 2 Oct |
| CLN-68 | Card rows join cleanly: no stray space before a comma ("Wipe , ba") | built, not re-played | eye: boing card | orchestrator review of R5's zoom sheets, 2 Oct |
| CLN-69 | The results card sits over the scene (the room), never a bare cream stage | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-70 | Every heal game clears its own buttons on done (the scrape's ✓ lingered into the results) | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-71 | Speech bubbles stay inside the play area (the ear's sat off the top) | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-72 | The first-time help's light is a soft centred glow, never beige squares | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-73 | The word review never scrolls or clips at 800×360 | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-74 | The scrape's hand stays clear of the tool strip | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-75 | The foot's hot, cold and lukewarm jugs read at a glance (steam, ice) | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-76 | English lines the child sees are styled as flagged placeholders, never dark bold text | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-77 | The zoom never shows a full-screen smear or ghost close-up UI on the pull-out | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-78 | The ear's hearing check and the eye chart use scene-fitting pictures, not emoji | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-79 | The tick badge always reads (never '–') | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-80 | The eye test's haa/na pills are at least 48 px on phones | built, not re-played | eye: heal games, phone/laptop/tablet | Fable's clinic review, 2 Oct |
| CLN-99 | Scrape: a dabbing cloth; connector line ends at the last row; all steps (plasters too) in the sequence; no "Cold!" mid-step | **open** | eye: scrape L1–L3 | `docs/feedback/clinic-playtest-2026-10-06.md` S1, S3, H3 |
| CLN-100 | Knee: no yellow glow ellipse; the wrap goes round the knee; more turns (about 4–6 / 5–8 / 6–10) | **open** | eye: knee L1–L3 | `docs/feedback/clinic-playtest-2026-10-06.md` K2, K3, K6 |
| CLN-101 | Ear: ghost finger drags the tweezers to a bin; smears left where blobs were; sore skin cleared at the end; drop bottle nozzle down; wax at the ear's angle | **open** | eye: ear L1, L2 | `docs/feedback/clinic-playtest-2026-10-06.md` E1, E2, E4, E5, E6, E8 |
| CLN-102 | Ear hearing test: doctor says "I'm telling you ___" (dots), she says "you told me…", the child picks for her; wrong → more drops, asked again (pending decision) | **open** | eye/ear: ear L1–L3 | `docs/feedback/clinic-playtest-2026-10-06.md` E3 |
| CLN-103 | Tooth: brush turned into the mouth and following the finger; plaque clears as you brush; mouth less open; filling off-white, no outline; "ow" and buzz outside the line; the drill of before Sprint 2 (the square-drill trial dropped, decision 72) | built, not re-played (S03: round bur and jagged decay back; S02's brush, plaque, mouth, filling and "ow" kept) | eye: tooth L1–L3 | `docs/feedback/clinic-playtest-2026-10-06.md` T1, T3, T4, T7, T9 |
| CLN-104 | Taste: the tongue's purple holes cleared on the fix; the next step cued; real liquids, level rising | **open** | eye: taste L1 | `docs/feedback/clinic-playtest-2026-10-06.md` TA2, TA3, TA4 |
| CLN-105 | Fever: one number model (±2/3/4); what she says, looks and the gauge agree; one green zone for line and drawing; tools in the column; tidy room; fan points down; no gust; sweat/snowflake icons (decision 27 item 8) | built, not re-played (S03: the heater on the floor right of the bed, turned to her; the hand fan lying flat on the bed; S02's ±2/3/4 model, one zone, tool column, icons and no gust looked at L1-L3. A stale "too hot" bubble over a green gauge waits on the voice stop, CLN-109) | eye: fever L1–L3 | `docs/feedback/clinic-playtest-2026-10-06.md` FV1, FV2, FV4, FV5, FV8–FV12 |
| CLN-106 | Boing: alcohol wipe with a wipe motion; a funny jab; a plaster choice; the bulb shows the next step (pending decision) | **open** | eye: boing L1–L3 | `docs/feedback/clinic-playtest-2026-10-06.md` B2, B4, B5, B6 |
| CLN-107 | Eye: a wrong yes/no shakes red, the doctor names the row with pictures; a misread gets a drop and a right re-read before the tick; outlines don't overlap; chart drawn in code, items shrink clearly, one big at top; stylised eye; "to the eye test" button bottom right; L1 her word as a fading bubble; count-along L1 only; water vs milk pictures (pending decision) | **open** | eye: eye L1–L3 | `docs/feedback/clinic-playtest-2026-10-06.md` EY1, EY3, EY6, EY7, EY10–EY13 |
| CLN-108 | Foot: water washes the dirt off to show the splinter; no flooding (pending decision) | **open** | eye: foot L1, L2 | `docs/feedback/clinic-playtest-2026-10-06.md` FT2 |

## First launch and shell

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| FL-01 | A wrong reply pill (Yes/No) shakes, the person is embarrassed and asks again | fixed | eye: first-launch Yes/No | `docs/design-language/ux-principles.md` §14 |
| FL-02 | On phone the home button does not overlap Cook's title card or the clinic's task card | open | eye: 390×844 · LAY-06 | `docs/archive/handovers/HANDOVER-2026-09-26.md` "Next up" 7 |

## Other modes

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| MOD-01 | Find it relights 8.2 and 8.3 are a relight, not a redraw | open | auto: `build/bg_align_check.py` · ART-04 | `docs/status.md` §7 Artwork |
| MOD-02 | Sitting room 3.2: sofa too high | open | eye: Find it | `docs/status.md` §7 Artwork |

## Art (cuts, style, backgrounds, characters)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| ART-01 | Game does not look old ("early App Store"): no airbrushed Nani, glossy outlined clip-art, skeuomorphic wood, emoji icons, system font, stiff motion | fixed | eye: 1366×768 | `docs/archive/art/art-direction-options.md` §1 |
| ART-02 | Clean cuts: no grey leftover inside handles or gaps, no bad corners (hob, karahi handle, charcoal grill) | built, not re-played | eye: ×2 zoom on cream · ART-02; auto: grey-leftover flag (planned) | `docs/feedback/cook-playtest-2026-09-29.md` X14, S14, K6 |
| ART-03 | Items sit on surfaces with contact shadows, never float on a shelf or stand on the worktop lip | fixed | eye: ×2 zoom · ART-03 | `docs/feedback/playtest-2026-09-23.md` §1 #10 |
| ART-04 | Background has no painted produce or objects that look tappable | fixed | eye: each background | `docs/feedback/playtest-2026-09-23.md` §1 #15 |
| ART-05 | Backgrounds are full resolution, not low-res next to the characters | **reopened** (6 Oct play-test) | eye: 1440×900 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §4; `docs/feedback/cook-playtest-2026-10-06.md` |
| ART-06 | Characters are not "pasted on": poses share one canvas so they do not jump, a blink does not redraw the whole character, cut by the scene never the screen edge | open | eye: each pose · LAY-08 | `docs/feedback/playtest-2026-09-23.md` §1 #12 |
| ART-07 | People are not floating cut-out heads: leaning on the counter | fixed | eye: Cook counter · LAY-08 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §8 |
| ART-08 | Face close-ups: eyes at the same height, filling the circle, three expressions (face, happy, frown) | built, not re-played | eye: each face | `docs/feedback/cook-playtest-2026-09-29.md` X4, Q12 |
| ART-09 | No bindi, tilak or sindoor on any character; no visible grey hair under the dupatta | fixed | eye: every character · CUL-01 | `docs/archive/art/art-direction-options.md` §10 |
| ART-10 | Nani has four cooking moods (not one image); Nana, Ma and Ali "impatient" faces do not smile smugly | open | eye: Nani faces | `docs/archive/cook/cook-with-nani-todo.md` "Then" |
| ART-11 | Potato cube does not read as butter | open | eye: ×2 zoom | `docs/status.md` §7 Artwork |
| ART-12 | Clinic 7.1 "where it hurts" has neck, back and hair parts; belt and rail do not sit too high | open | eye: 1366×768 | `docs/status.md` §7 Artwork |
| ART-13 | Kitchen redrawn full size with Nani leaning on the counter, smaller bob; no doubled strip under the sink | **open** | eye: 1440×900 | `docs/feedback/cook-playtest-2026-10-06.md` K1, K2, K3 |
| ART-14 | Chai: tipped pan (not clipped; black-tea version), black-tea glass and pan | **open** | eye: pour | `docs/feedback/cook-playtest-2026-10-06.md` C7, C9 |
| ART-15 | Samosa fold frames on one baseline at a constant height, folding diagonally | **open** | eye: fold | `docs/feedback/cook-playtest-2026-10-06.md` A4 |
| ART-16 | Review-screen tick has a clean cut (grey fringe top left and right) | **open** | eye: ×2 zoom on cream · ART-02 | `docs/feedback/cook-playtest-2026-10-06.md` C21 |

## Language and audio

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| LNG-01 | No English instruction text or audio for the child (pop-ups, help bubbles read by a device voice); no English or pictures where the task is understanding Kutchi; English only in "?" | built, not re-played | auto: `build/check_onboard.mjs` · LNG-01, LNG-05 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §1 |
| LNG-02 | "Can you win without the Kutchi?": no help that shows the answer, no skipped steps, no decoys or row shapes that give it away | built, not re-played | auto: `build/leak_*.mjs`, `build/test_cook.py` leak checks · LNG-02 | `docs/archive/cook/cook-with-nani-kutchi-audit.md` |
| LNG-03 | No English or dot placeholders in pills or cards ("mixed", "boga", "•••", "Muke ••• khape", "hakri lakri mixed") | fixed | auto: data check; eye: daar L4 · LNG-04 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §9 |
| LNG-04 | English placeholder words still waiting for Mum: the "with" join, *ph-turner*, *sekelo*, the plaster line | open | auto: `build/lines_needing_family.py` · LNG-04 | `docs/feedback/cook-playtest-2026-09-29.md` Q5, M6, K1 |
| LNG-05 | *nar* is not used for "no" (*na*; *nar* means look) in diagnosis answers and the eye chart | built, not re-played | auto: grep `nar` · LNG-06 | `docs/feedback/clinic-playtest-2026-09-29.md` G9, CQ16 |
| LNG-06 | Voice is not "crazy fast"; no device or browser voice in shipped audio (family voices only) | fixed | eye: ear · AUD-01 | `docs/archive/build-logs/cook-with-nani-build-log.md` §1 |
| LNG-07 | Nani's reading pauses can be skipped ("tap anywhere to skip") | fixed | eye: ear · INT-01 | `docs/archive/build-logs/cook-with-nani-build-log.md` §5 |
| LNG-08 | Family voices sound clean: clean-up pass on Mum's clips, a mic for the next rounds (pending decision) | **open** | ear: blind A/B of 10 clips | `docs/feedback/cook-playtest-2026-10-06.md` V1, V3 |
| LNG-09 | Test voice at normal speed (built slowed, `ATEMPO 0.75`) | **open** | ear | `docs/feedback/cook-playtest-2026-10-06.md` V2 |
| LNG-10 | "Thank you" and the family's "oh dear" recorded; *arre re* out until Mum gives it | **open** | ear | `docs/feedback/cook-playtest-2026-10-06.md` T9 |
| LNG-11 | *Muke de*, *Muke chai lai de* checked with Mum | **open** | auto: lines_needing_family | `docs/feedback/cook-playtest-2026-10-06.md` PA4 |
| LNG-12 | Clip candidates say only the target word in the right voice (picker offered 'Okay' for amli, 'P-10 Cup' and 'P-11' for cup, English talk for chulo) | **open** | auto: blind double transcription + 30-clip audit; ear: Zafar's picker | Zafar, 7 Oct (chat) |

## Process

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| PRC-01 | Tested only headless while the game was unplayable on a real device; review on phone and 16:10 laptop | fixed | eye: 390×844 and 1440×900 | `docs/archive/design-v1/Roadmap and Story Structure.md` Lessons 1, 12 |
| PRC-02 | Tests had no 16:10 viewport | fixed | auto: the sandbox (`build/sandbox/run.mjs`, all sizes) six viewports | `docs/feedback/playtest-2026-09-23.md` §1 #2 |
| PRC-03 | Reported "live" before the Pages build had run (old badges on the live site) | fixed | eye: hard refresh on the live URL · REL-02 | `docs/feedback/cook-ui-feedback-2026-09-28.md` §7 |
| PRC-04 | Overnight run went off script: swipe chop replaced by tap crate and knife; sekelo v2 reused old art and was reported done | fixed | eye: report's "mechanics changed" section | `docs/feedback/cook-playtest-2026-09-29.md` X15 |
| PRC-05 | Tests switched first-time help off, so help bugs went unseen | built, not re-played | auto: `build/check_onboard.mjs` · INT-04 | `docs/game-design/modes/clinic.md` G8 (builder) |

## Keep (things Zafar liked: must not regress)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| KEEP-01 | Underline while a line is spoken; order card and pop-up are "the bar we want to set" | keep | eye: every station · TXT-08, CMP-07 | `docs/feedback/cook-playtest-2026-09-29.md` C1, C13 |
| KEEP-02 | Daar: chopped things wait at the side and you add them in | keep | eye: daar | `docs/feedback/cook-playtest-2026-09-29.md` D4 |
| KEEP-03 | Samosa: oil looks better, frying is fun, adding samosas is fun, slotted-spoon lift is good | keep | eye: samosa | `docs/feedback/cook-playtest-2026-09-29.md` §S |
| KEEP-04 | Samosa fold swipe stays and feels great; no dashed line, no red dot | keep | eye: fold | `docs/design-language/ui-design-system.md` §15 |
| KEEP-05 | Sekelo top-down ingredients look good; sekelo stays top-down | keep | eye: sekelo | `docs/feedback/cook-playtest-2026-09-29.md` §K |
| KEEP-06 | Diagnosis: "does it hurt here?", "my foot", "look at the knee, then the hand"; calm, no time pressure | keep | eye: diagnosis | `docs/feedback/clinic-playtest-2026-09-29.md` D1, D2, D3 |
| KEEP-07 | Heal games liked: knee tap, ear wax taking-out, tooth small-tooth three taps, taste "bones", boing wipe and count, eye test, plaster colour idea | keep | eye: each heal game | `docs/feedback/clinic-playtest-2026-09-29.md` H-knee, H-ear, H-tooth, H-taste, H-boing, H-eye |
| KEEP-08 | The lolly "so funny" (now an apple, never a lolly) | keep | auto: grep lolly · CUL-02 | `docs/feedback/clinic-playtest-2026-09-29.md` E3 |
| KEEP-09 | The closed card's three dots ("he's talking"); the card's fold | keep | eye: L3 card | `docs/feedback/clinic-playtest-2026-10-01.md` P9, P13, 1:5:02, 1:7:26 |
| KEEP-10 | Liked in the heal games: the bandage wrap, the ear pop-ups, the drill concept, the tongue pops, the thermometer, the boing and its plaster, the eye redrop-and-reread, foot L3 | keep | eye: each game | `docs/feedback/clinic-playtest-2026-10-01.md` §2 of this report |
| KEEP-11 | Nana's voice; Nani and Nana talking; two-person chai; maani speed; the greeting hand gesture | keep | eye: each | `docs/feedback/cook-playtest-2026-10-06.md` V4, M4, M13, C17 |
| KEEP-12 | The card that shows then blanks words; chai highlighted at the start; calling out items as they go in | keep | eye: pantry, chai | `docs/feedback/cook-playtest-2026-10-06.md` PA6, PA9, C3 |
| KEEP-13 | Pantry wrong-item handling; cooker on early is fine; daar dial and rotation; samosa fry and frying handle | keep | eye: each | `docs/feedback/cook-playtest-2026-10-06.md` PA13, C28, D6, A9 |
| KEEP-14 | Clinic: the zoom in and out; scrape sequence; pharmacy pause-hint and card fold; knee animation and dots; ear clean-up and wax that keeps coming; tooth drill, fill-to-green, clean mouth, L3 one-by-one, fill timer; taste popping; fever window; eye test and art; foot splinters; waiting room L3 heard-not-seen | keep | eye: each | `docs/feedback/clinic-playtest-2026-10-06.md` P4, P7, K4, K7, E7, T2, T8, TA1, TA5, EY9, FT5, W4 |

## Retired

Not rechecked. The thing each row was about has been removed or replaced.

| ID | Issue | Why retired | Source |
|---|---|---|---|
| RET-01 | Fruit piled huge, vanished or appeared twice in Nani's bowl; basket never visibly filled; bought 6, only 3 came home | Fruit-bowl bazaar build replaced by Cook and Find it | `docs/feedback/playtest-2026-09-23.md` §1 #3, #4, #5, #7, #11 |
| RET-02 | No digits on the shopping list (players could not tell how many to buy); pear quantity 3 vs plural line; pear taller than the tray | Bazaar removed; numbers are now heard or written in Kutchi with no digits (E12) | `docs/feedback/playtest-2026-09-23.md` §1 #6, #8, #9; Roadmap Learning design |
| RET-03 | Bazaar characters barely spoke; awning text unreadable | Bazaar stall removed (solid cream bubble rule lives on as CMP-06) | `docs/feedback/playtest-2026-09-23.md` §1 #13, #14 |
| RET-04 | Kitchen rug runs under the island; kitchen storage must hold every fruit and vegetable | Kitchen v3 replaced the fruit-bowl kitchen; pantry is PAN-06 | `docs/feedback/playtest-2026-09-23.md` §7 |
| RET-05 | Hands everywhere in Cook; hands scale, rolling-pin hands, pantry grab pose, leftover hand at the skewer station, Cook ignoring the chosen hands | No hands anywhere in Cook (H13) | `docs/feedback/cook-ui-feedback-2026-09-28.md` §9; `docs/archive/handovers/ORCHESTRATOR-HANDOFF.md` 26 Sept; `docs/archive/handovers/HANDOVER-2026-09-26.md` |
| RET-06 | Hands art: orange skin, "approach approved, output not good enough" (flat sticker rings, dotted bracelet) | Hands removed from Cook; `build/qa_hands.py` stays for other modes | `docs/archive/handovers/MORNING-SUMMARY.md` (Decided); `docs/design-language/art-bible.md` §2 |
| RET-07 | Stars on the end screen and stations (ear star, voice star, "no stars anywhere") | Scoring is now the three badges (time, accuracy, hints); star code removed (H5, J7) | `docs/design-language/ux-principles.md`; `docs/process/rules.md` H5 |
