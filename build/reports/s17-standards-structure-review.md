# Review of the standards structure (draft 1): flaws first, then the improved structure (5 Nov)

**Reviewed:** `build/reports/s17-standards-structure-v1.md` against the ledger it is built from (`build/reports/s16-s17-change-ledger.md`, 118 rows), the old page (`docs/design-language/chai-standard.md`), the family page (`docs/game-design/families/stove.md`) and the rhythm (`docs/process/prototype-to-game.md`). Also read: `data/kit-elements.json` (13 named kit elements), `build/tools/review/kitmap.mjs`, `kitsheet.mjs`, `audit.mjs`, `docs.mjs`, `ui-design-system.md` §2-4, `ux-principles.md`, `easy-to-play.md`. Nothing edited.

## 1. Verdict in six lines

1. The six questions are the right spine; keep them. But the cut is not yet MECE: three overlaps, five homeless kinds of change, and a tie-break ("where the decision is made") that cannot place about half the rows I tested (7 of 15 ambiguous or multi-homed).
2. The root fault: the draft takes a *ledger row* as the unit. A row often answers two or three different questions (what happens, when, how it looks, how it is built). The MECE unit is the *rule*, and a rule answers exactly one question. A row then yields several rules, cross-linked.
3. Zafar's own list ("sequencing, logic of progression") has no home: progression is spread over A1, A2, B1, B3 and E4. It needs its own domain.
4. Three layers lose a scope the ledger already uses: "every Cook game" (SH-209, SH-210, SH-215). Cook is an engine shared by two families (stove, fetch and serve). Four scopes: House, Engine, Family, Game.
5. The gap analysis unit is right for reading (area x game) and wrong for filling (it must be rule x game, mostly filled by `kitmap.mjs` and `audit.mjs`, then rolled up). The status scale mixes "built" with "proven"; replace it with one ordered proof ladder.
6. "Fill from the ledger, not the old page" would drop about 40 Sprint 14-15 rules the ledger never saw (SH-142, SH-147, SH-150, CK-45, CK-54, PAN-04, CHAI-36 to 42, CHAI-50 to 52, SH-174 to 176). The old page is a *source*, and the second check should be a mechanical ID diff.

## 2. The domain cut

### 2.1 Overlaps (a rule with two homes in the draft)

| Rule | Draft homes | Why it is an overlap | Fix in the new cut |
|---|---|---|---|
| "One owner per motion" / "redraws that keep animations" (SH-180, SH-211) | D4 Motion and E3 State | The same sentence in both areas | Build (F3) owns "one owner, no second redraw"; Presentation (E4) owns what the eye sees: duration, curve, no jump |
| Tokens (colour, type, spacing) | D6 and E2 | D6 "colour, type and tokens"; E2 "tokens: no magic numbers" | E6 holds the values (a pointer to `css/shared/tokens.css`); F2 holds the one rule "no raw number in code" |
| "Rungs" | A2 (support rungs) and C2 (hint rungs) | One word for two ladders (the word ladder's steps; the hint clock's stages) | Glossary: *support steps* and *hint stages*; never "rungs" |
| The leak test | A4, 0.1 (non-negotiable 4) and F1 (the leak check) | A constraint and a check, not a design area; CHAI-76 shows a hint rule decided *by* it | 0 points to the non-negotiable; G1 holds the check; no area A4. A rule it forces lives in its own area with Why = "leak test" |
| Scrolling | D1 ("scrolling"), D2 (the order card's row), E3 (by-design scroller) | The item row's glide (SH-194, 199, 206, 211) and the panel's (SH-169) are component rules; the "designed scroller" declaration is a build rule | Component rules with the component (E2); the declaration in F3; the frame's regions in E1 |
| Mechanic vs mistakes | B2 and B4 | CHAI-57/58 is one rule (too early: shake and "no"; red: boils over) split across two areas | One area, B2: the mechanic *includes* its mistakes and consequences; undo is a Foundation pointer (non-negotiable 7) |
| The tick | B2 (count ticks when reached) and C4 (feedback: ticks) | SH-38 is "when" (mechanic) and "what it looks and sounds like" (presentation) | When: B3 counts and amounts; look and sound: E2/E5 |
| Values | "sit above all six (0)" (§2) and "one table per area" (§3) | The draft contradicts itself | Per area; 0 holds no values |
| 0.1 Non-negotiables | A copy of CLAUDE.md's list, minus number 8 | Two copies drift (it already has) | 0 is a *pointer* list: the non-negotiables by number, never restated |

### 2.2 Gaps (kinds of change in the ledger with no home)

| Kind | Ledger rows | Draft's nearest home | Fix |
|---|---|---|---|
| Progression: what changes across rounds, levels, the ladder and games | CHAI-55 (half first, full second while supported), SH-195's "the level says so", SH-207 (between games only), B3's levels, "first met where" (A1), SH-212 (next game), the Kutchi gate | Spread over A1, A2, B1, B3, E4 | Domain C, Progression, at four scales |
| Pipeline and process rows | ART-34 (pose register), ART-35 (two-day art queue), ART-42 (runner fetches, never asks), the sprint plan, the S16 publish on his word, PAN-19 to 22, SH-146, the standard page itself (10 rows) | §5 says "process rules in F", but F is verification; a queue cadence is not proof | Domain H, Supply and roll-out (points to `art-pipeline.md`, `recording-sheet.md`, `prototype-to-game.md`; holds only what they lack) |
| Feel: juice, pace, payoff | ART-31 ("audibly, yes, we should have juiciness"), KEEP-21 ("quite clever"), SH-214 (everyone back to say thank you), CHAI-87 (pour sound), CHAI-70 (slower) | None asks "is it satisfying?" | Area B4, Feel; "praise" becomes a Source kind so the keep list feeds the standard |
| The grown-up's screens | The "?" pop-up, settings (New player, Words known), the end-of-round review | Only as test switches in F2 | Area D5, The grown-up's door |
| Open and reversed decisions | CHAI-76 (waiting), LNG-23 (Mum), ART-41 (his choice), CHAI-63 (open); SH-38 and SH-153 reversed | No status on a rule | Status and Decided fields on the rule row |
| Test hooks in the game | `NJG_INIT`, the scroll logger, `#order-whole`, labs switches (SH-216) | F2 lists the switches as evidence | Area F5, Test hooks (build side); G2 keeps the drivers and runs |
| Accessibility | 48 px tap (E4), the light's contrast (contract-84), a noticeable light (SH-196: 36x24 px missed), a child's pace, no flashing | Touch targets only | A property, not a place: an Impact column on every rule, plus the four rules in their own areas (F4, D1, E4, G2) |

### 2.3 The placement test: 15 varied rows against the draft

| Ledger row | Draft home(s) | Verdict | Home in the new cut (section 7) |
|---|---|---|---|
| SH-171 no card until the sentence is said | B1 (the round) or D2 (the order card) | Ambiguous: a "when" rule about a component | Two rules: B1 (the order is said before it is shown; pattern P8) and E2 (the folded card's look) |
| SH-180 the fold is one motion; a second redraw lost it | D4 or E3 | Ambiguous (the overlap above) | F3 (one owner; reveal in the same redraw), E4 (the fold's duration and ease) |
| SH-185 the panel scales with the window; 2.5-card floor; speaker tap stays 48 px | D1 and E4 | Multi-home: three rules in one row | E1 (scales together to minimums), values sheet (2.5 cards), F4 (48 px) |
| SH-193 item words level; hidden English one line | D2 | Clear | E2 (item card) |
| SH-199 the next card whole in view after a tick | D1 or C4 | Ambiguous (scrolling vs feedback) | E2 (item row; pattern P6) |
| SH-184 / SH-205 every right move resets every hint clock | C2 | Clear | D2 (pattern P12) |
| CHAI-76 Nani's hint hides a word past support | C2 or A4 | Ambiguous: a hint rule forced by the leak test | D2, Why = leak test, Status = waiting |
| SH-38 a count ticks the moment it is reached | B2 or C4 | Ambiguous (when vs look) | B3 (pattern P7) |
| CHAI-57/58 boil too early: shake, "no"; green 2 s at L4; red boils over | B2 and B4 | Ambiguous (one rule in two areas) | B2; the 2 s in the values sheet |
| SH-195 blur only when the level says so and the word was picked right once; snapshot per round | A2, B3, E3 | Three homes | A2 (the blur rule), C3 (the level's say), F3 (snapshot; pattern P5) |
| CHAI-67 the word moment | A3, B1, D1-D5 | Multi-home, no link between them | A3 (why), B1 (where in the round), E2 (the component), E4/E5 (pace, snap, sound); the glossary entry links them |
| ART-35 the art queue holds two days | None | Homeless | H1 |
| SH-212 every next game loads behind | E4 | Clear | F4 (pattern P13) and C4 (the next game) |
| SH-214 everyone is back at the closing scene | B1 | Clear, but its *why* (payoff) is unrecorded | B1 and B4 |
| KEEP-21 the keep list | None (F4 at a stretch) | Homeless | A Source kind "praise" on the rules it praises |

Seven of fifteen are ambiguous, multi-homed or homeless under the draft; all fifteen place under the new cut once a row may be several rules.

### 2.4 The tie-break, replaced

"Where its decision is made" fails because most rules are joint decisions (what, when and how it looks are decided together). Replace it with: **a rule's home is the question it answers; a row that answers two questions is two rules, each citing the other.** The questions, one per domain: Is it allowed and for whom (0)? What does the child learn (A)? What does the child do (B)? How does it change over time (C)? How does the child know what to do (D)? What does it look and sound like (E)? How is it built (F)? How do we know (G)? How does content arrive and a family join (H)?

## 3. Two uses, the layers, rule vs value, and what is missing

**Both uses:** the standard use works once the scope tag names the family ("Family: stove"), since fetch and serve arrives at Sprint 19 and its rules must not read as stove's. The gap-analysis use does not work from areas alone: areas are too coarse to say "adopt the kit" (that is per component) and too fine for his one-screen read (that is per domain). The fix is one data file at rule grain with three roll-ups (section 7.7).

**The layers:** right in kind, wrong in count and in where they live. The ledger's own scope column has four values: every game, every Cook game, stove family, chai only. Keep four: House, Engine (Cook, clinic, the party kit), Family, Game. And the scope should decide the *file*, so one rule has one home: House in the standard page, Engine in the engine's doc, Family in `families/<family>.md`, Game in the mode doc's station section. For now one table with a Scope column; split when the second family's page is written (Sprint 19), and say so in the page's head.

**Rule vs value:** right, with three changes. A value may be a formula (the panel's sizes by height), not only a number. Each value says what it is derived from (the 2.5-card floor comes from a phone's height), so a family can re-derive, not copy. And the values sheet must point to `css/shared/tokens.css` or `data/shared.json` wherever the number is already a token, and flag "to tokenise" where it is not: the sheet then doubles as F2's to-do list, and the static check's known list only shrinks.

**Missing, with a verdict each:**

| Candidate | Verdict | Where |
|---|---|---|
| A pattern level between rule and value | Yes. About 14 named patterns (section 7.4); a rule says which pattern it applies; a family copies patterns first, then sets values. Lesson 4 ("free space by case, not by one rule") is exactly the absence of this level | 7.4 |
| A glossary of shared components | Yes. `data/kit-elements.json` already names 13 elements with selectors; the standard's glossary extends it to about 25 and maps his words to ours ("menu card" = order card, "hint card" / "green box" = Nani's box, "word focus" = the word moment) | 7.3 |
| Decision records | Not a separate log (CLAUDE.md: a decision lives in the doc it changes). A Status and a Decided date on the rule row, with reversals as dated history lines (SH-38: three decisions) | 7.5 |
| Fun and feel | Yes, as area B4 and as a Source kind "praise" (the keep list) | 7.1 |
| Accessibility | A column (Impact) and four rules in their areas, not a domain | 7.5 |
| The child's emotional arc | The round's arc (arrival, work, payoff: SH-214) is B1; the day's arc belongs to `story-and-arcs.md` and the standard points to it | 7.1 |
| Content and asset pipelines | Domain H, pointing to the three docs that own them; H holds only the rules those docs lack (target sizes stated before build, the two-day queue, the pose register) | 7.1 |
| Onboarding into a family | H3: the entry checklist (list the games and deciding words; art block with sizes; words to Mum's sheet; copy the patterns; set the values; run the audit; the judge; his play), a pointer to `prototype-to-game.md` steps 1-8 | 7.1 |
| The relation to the older design docs | A decision for him: the standard becomes the one rule register with checks; `ui-design-system.md` keeps the tokens (values); `ux-principles.md`, `easy-to-play.md` and `guide-and-card.md` give their rules to the register over time and keep their reasoning. Not now: keep it small | questions.md |

## 4. The gap analysis

**Unit.** Fill at rule x game; read at area x game; read for him at domain x game. One JSON (`build/tools/review/data/gap.json`), three views. `families/stove.md` already does rule x game by hand for ten rules; the standard has about 120, so the filling must be mostly by script:

| Pass | Fills | Tool (exists) |
|---|---|---|
| 1 | Every "adopt the kit" cell: does the game draw this element from `js/shared/` or `js/cook/ui.js`, from its own copy, or not at all | `kitmap.mjs` per element per game |
| 2 | Every cell whose rule has a check id | `audit.mjs <game>` (contract, panel, labcheck, leak, load) |
| 3 | Every eye rule, per element, across games on one sheet | `kitsheet.mjs --elem` (the judge passes an element in every game on one picture) |
| 4 | His play | `/feedback` rows |

**Status scale.** The draft's five values mix build state with proof state, and "Partial" hides the question ("partly" met is two rules). One ordered proof ladder, exhaustive and exclusive: **0 not applicable · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his done.** "Different by design" is a flag with the decision's date, not a status.

**Gap type.** Replace it with *Next step*, the one thing to do first, so the cell is unambiguous even when a gap needs art and code: **Kit** (move chai's own code to the shared kit) · **Adopt** (call the kit) · **Game code** · **Art** · **Words** (Mum) · **Decision** (Zafar) · **Check** (a check to build before this can be proven) · none. Kit and Adopt were one value in the draft; they are different work (SH-196 and SH-178 are "chai only" per the family page, so every other game is blocked on Kit, not Adopt). A *Blocked by* field names the dependency.

**Size.** S/M/L on the next step, plus *once for all* (kit, checks, art-in-common) or *per game*. A family's roll-out estimate is the sum of once-for-all items plus the per-game items, and the once-for-all list is where the effort/impact 2x2 belongs.

**Priority.** Impact class first, then reach, then size: **stuck** (the child cannot go on) > **wrong** (learns a word wrong, or wins by leaking) > **feels bad** (a verdict, a wait) > **unfinished** (a jump, a stand-in, a clipped word) > **cosmetic**. The non-negotiables sit above the scale. Reach = games affected (a kit item counts every game).

**Read-out, four pages:** (1) the heat map, domain x game, with a readiness bar per game (cells at 3 or above over cells that apply); (2) the once-for-all list in dependency order (Kit, then Check, then Adopt); (3) per game, its next steps ordered by impact, with the "do not touch" list under it (mechanics he has not commented on, non-negotiable 1, so the judge knows what is out of scope); (4) the waiting list: his decisions as a numbered list, Mum's words, the art queue. Every cell's evidence is a link (an audit line, a sheet crop, a film), never "the code".

## 5. The lessons

The ledger's 14 lessons are true but are symptoms grouped by what broke. Group them by root cause, and the told-before table adds two the 14 miss: shared rows with no sprint owner never get built (SH-139, 27 Oct to 1 Nov), and a state the tester cannot reach in a minute is untested (SH-196, five rounds; SH-216 fixed it).

| Root cause | Ledger lessons | Becomes an automatic check | Stays a process rule |
|---|---|---|---|
| R1 We looked at one state | 1 (one level or still), 6 (early but not never), 7 (an adult's pace) | Every check row declares its coverage (levels, sizes, new and returning player, first and second round, pace) and the evidence lint fails a row that lacks one; every "not early" check paired with a "seen, and noticeable" check (contract-90 is the model); the pause driver as a standard path | None |
| R2 We measured one property | 2 (size but not place or neighbours) | `panelcheck.mjs` measures size, place and neighbours before and after, at the four sizes, and prints the diff | A size fix ships with its before-and-after numbers |
| R3 Two owners of one thing | 3 (a second redraw), 8 (the ladder moved mid-round), 9 (the fit engine fought a designed scroller), SH-201 (a redraw cancelled a clip) | The frame-film reversal check generalised from SH-210/211 to every motion; a static check that ladder reads go through the round's snapshot; declared scrollers (built) | One owner per moving thing, named in the rule's Lives-in |
| R4 We built the case, not the rule | 4 (free space by case), 5 (the narrowest reading of his words) | A placed-element check against every face, bubble, gear and panel (the contract-82/83 family) | Pattern first (P1); the rule's text is the aim, not the mechanism; the `/feedback` second reader |
| R5 Stand-ins read as real | 10 (code-drawn), 12 (cut artefacts) | The audit lists every code-drawn effect; the cut tool's rim rule (built) | Art first, then wiring (non-negotiable 8) |
| R6 Platform rules forgotten | 11 (audio on phones) | `tapgate.mjs` (built); `loadtime.mjs` on a throttled network with audio | None |
| R7 Evidence misread | 13 (test artefacts), 14 (the runner, the overridden gate) | The publish gate records his word in the commit when overridden | Replay without the extension first; film a real start |
| R8 No owner | SH-139 (told before) | `sprintcheck.mjs` fails an open shared row with no sprint named | Every shared row names its sprint |
| R9 Unreachable states | SH-196, SH-216 | The docs guard checks every rule's "See it" lab URL exists | Every rule names the state that shows it |

Reversed decisions (SH-38, SH-153) are not lessons; they need the Status and Decided fields so the newest word is visibly newest.

## 6. His "what's best": agree, with five changes

Order: lock the structure, fill the new, check against the old. Yes. But: (1) the old page is a *source* for the Sprint 14-15 rules the ledger never saw (section 1, line 6), so the sources are the ledger, the old page, the family page and chai's rows in `regressions-done.md`; (2) make the second check mechanical: the set of IDs cited by the old page and the family page minus the set in the new register is the dropped list, for his yes; (3) fill in this order, because rules name components and patterns: glossary, patterns, rules, values, gap; (4) map the ledger into the structure *before* writing prose, as a table (that table is the MECE proof and it is not prose); (5) retire the old page by a redirect line, as `rules-redirect.md` did, never by deletion.

## 7. The improved structure in full

### 7.1 Domains and areas

| # | Domain | Question | Areas |
|---|---|---|---|
| 0 | **Foundations** | Is it allowed, and for whom? | 0.1 The non-negotiables, by number (a pointer to CLAUDE.md, never restated) · 0.2 Who it is for (3-7, a grown-up nearby; the four sizes, touch; no reading) |
| A | **Learning** | What does the child learn, and honestly? | A1 The words (which per game, how many per level, deciding words) · A2 The word card and its support steps (written, dotted, blurred; the blur rule; the first meeting) · A3 Words a picture can't show (the word moment: what and why) · A4 Language lines (engine-built; missing Kutchi as grey English, logged) |
| B | **Play** | What does the child do? | B1 The round (arrival, the order said then shown, work, serve, the closing scene, end screen) · B2 The mechanic (actions, windows, several at once, mistakes and their consequences, undo) · B3 Counts and amounts (ticks on reached; half and full) · B4 Feel (juice on every action, pace, payoff moments; badges and rewards: no sweets) |
| C | **Progression** | How does it change over time? | C1 Within a round (who asks first; half before full while supported) · C2 Across levels L1-L4 (what each adds: people, items, "no" items, amounts, support) · C3 Across the word ladder (when support moves; frozen per round) · C4 Across games and days (first met where; the next game; the Kutchi gate) |
| D | **Guidance** | How does the child know what to do? | D1 The first time (the light: once, the dim with its target, whole then part, the call after the light, the returning player) · D2 When stuck (the hint names the next undone item; the hint stages; every right move resets every clock) · D3 Nani's box and the helper card · D4 Feedback in play (ticks, praise, the said card folding) · D5 The grown-up's door ("?" pop-up, settings, the end review) |
| E | **Presentation** | What does it look, move and sound like? | E1 The frame (regions; sizes by height at the four sizes; safe zones; free space; spacing of items relative to the screen; designed scrollers) · E2 Components (one entry per glossary item: its look, fit and placement) · E3 Art and materials (views, the worktop, the panel colour; no code-drawn stand-ins) · E4 Motion (every moving thing: duration, curve, no jump; a child's pace) · E5 Sound and voice (effects, the order of speech, never waiting for speech) · E6 Tokens (colour, type, radii, shadow: `tokens.css`) |
| F | **Build** | How is it made so the next game inherits it? | F1 Kit vs game (what lives in `js/shared/`, `js/cook/ui.js`, a station) · F2 One source of numbers (tokens, `data/shared.json`, the rules file; no raw values) · F3 State and redraw (one owner per moving thing; snapshot reads; declared scrollers) · F4 Devices (48 px, audio unlock, load behind, throttled network) · F5 Test hooks (`NJG_INIT`, loggers, lab switches) |
| G | **Proof** | How do we know, before he plays? | G1 Automatic checks (contract, static, panel, lab, leak, load; the audit) · G2 Played evidence (coverage: levels, sizes, players, rounds, pace drivers) · G3 The judge (films, kit sheets, told-before shots) · G4 His play (the fix list, told-before, the keep list, the second reader) |
| H | **Supply and roll-out** | How does content arrive, and how does a family join? | H1 Art (sizes stated before build; the two-day queue; the pose register; cut rules) · H2 Voice and words (Mum's sheet and rounds; the Kutchi gate) · H3 A family's entry (the checklist; `prototype-to-game.md` 1-8) · H4 Open items (a decision for Zafar, a word for Mum: where each goes) |

His words, placed: playability = B + D; visuals = E1-E3, E6; polish = the proof ladder (a degree, measured in the gap analysis) and E4-E5; sequencing = B1 + C1; logic of progression = C; code-based structuring = F; visual structure, spacing and layout relative to the screen = E1 + the values sheet.

### 7.2 Scopes and where each lives

| Scope | Means | Lives (after the split) | Ledger's word |
|---|---|---|---|
| House | Every game | `docs/design-language/standard.md` (the renamed page) | every game |
| Engine | Every game on one engine (Cook, clinic, party) | The engine's doc | every Cook game |
| Family | Every game in one family | `docs/game-design/families/<family>.md` | stove family |
| Game | One game | The mode doc's station section | chai only |

### 7.3 The glossary (his word, ours, the kit element, the file)

Seeded from `data/kit-elements.json` (face circle, word card, order card, order pop-up, bubble, buttons, finger, help box, glow, "?" pop-up, end screen, to-record text, help ladder) and extended. One line each in the standard; the areas' rules cite the glossary name only.

| Ours | His words in the notes | Kit element / file |
|---|---|---|
| The frame: side panel, play area, shelf band | "left bar", "bottom panel" | `js/cook/ui.js` side fit |
| Order card (face, headline, item row) | "menu card" | order card |
| Item card (one slot: picture, Kutchi, English, speaker) | "item card" | word card, small |
| Pop-out (the big word card that flies to its row) | "pop up card" | order pop-up |
| Word card (the one shape in four slots) | | word card |
| Word chip and pill (under a shelf item; grouped pills) | "pill", "chip" | word chip |
| Count pills | | |
| Nani's box (face, line, arrow) | "hint card", "green box" | help box |
| Helper card (opens under Nani's box) | "help card", "dropdown" | |
| Speech bubble, tail; replies | | bubble |
| Face circle; tray faces | "face icons" | face circle |
| The light (the dim, the lit box, the jump); the zoom-in | "onboarding", "highlight", "lit box" | `Onboard.light`, glow |
| The finger (drag demo only) | "hand" | finger |
| The hint stages (the clock's steps) and the stuck hint | "Nani's hint" | help ladder |
| The support steps (written, dotted, blurred) and the word ladder | "word ladder", "blur" | word pill ladder |
| The word moment | "word focus", "T word focus" | `shared/word-moment.js` |
| Shelf, tray, hob, pan, knob, the green and red | "tea tray", "hobs", "saucepan" | station |
| The closing scene | "the end ... thank you" | `kitchenEnd` |
| The gear and corner buttons; the play button | "gear icon", "cog" | buttons, `tapgate` |
| End screen; "?" pop-up; to-record text | | end screen, ? pop-up, to-record text |

### 7.4 Patterns (the level between rule and value)

| ID | Pattern | Applied by (rules) |
|---|---|---|
| P1 | **Free-rectangle placement:** take out the faces, bubbles, panel, gear and replies; one shape; one even scale; prefer L1's place | pop-out (CHAI-43), bubbles (SH-177/187), shelf row (CHAI-66), word-moment layout (CHAI-86) |
| P2 | **First time once, then the stuck hint** (new player once a visit, returning once ever) | SH-181, CHAI-56, SH-196, CHAI-68 |
| P3 | **Whole, then part:** a light on a small part lights the whole thing first, then shrinks | SH-213 |
| P4 | **One owner per moving thing:** whoever starts a motion finishes it; no redraw during it; the reveal in the same redraw | SH-180, SH-215, SH-203 |
| P5 | **Snapshot at the round's start:** progress reads frozen, writes at once, thawed at the end screen | SH-195, SH-207 |
| P6 | **Declared scroller:** a list that scrolls by design says so; fit engines skip it; code places it, no snap; the current thing whole in view | SH-169/191, SH-194, SH-199, SH-206, SH-210, SH-211 |
| P7 | **Ticks on reached:** a count or amount ticks the moment it is reached; an extra tap doesn't land | SH-38, CHAI-54 |
| P8 | **Said, then shown:** nothing on screen before it is said | SH-171, the pop-out as each item is said |
| P9 | **Consequence in the thing, never a verdict:** too early, the thing refuses (shake, "no"); too late, the thing itself fails and restarts; undo until the step moves on | CHAI-57/58, CHAI-62 |
| P10 | **Real pictures, not stand-ins:** code draws only a liquid or tint inside a picture's outline | CK-06, CHAI-64, ART-31, CHAI-79/80 |
| P11 | **Scale together to a floor, then keep the essential:** a region's parts scale as one down to minimums; then one stated essential governs; tap areas never under 48 px | SH-185, CHAI-43, SH-139 |
| P12 | **Every right move resets every clock** | SH-184, SH-205 |
| P13 | **Load behind, never a wait:** files at once; the next thing behind the current; a cover until ready | SH-175, SH-201, SH-212, CHAI-85 |
| P14 | **The grown-up's door:** anything in English is behind a tap, never in the child's path | non-negotiable 3, the "?" pop-up |

### 7.5 The rule row

| Field | What | Example (the zoom-in light) |
|---|---|---|
| ID | `STD-<area>-<n>`, stable | STD-D1-07 |
| Rule | One testable sentence, the aim | A light on a part smaller than a quarter of its thing lights the whole thing first, then shrinks onto the part |
| Why | His words, a lesson, or praise | "make it a generalizable principle/rule" (5 Nov); he missed a 36x24 px box after a 3 s pause |
| Component | Glossary name | The light |
| Pattern | P-id | P3 |
| Scope | House / Engine: Cook / Family: stove / Game: chai | House |
| Value | A number, or the values sheet row | VAL-D1-03 (0.65 s whole, 0.45 s shrink) |
| Checked by | A check id, or "eye: <state, size>" | contract (to build: checks-to-build, the zoom-in light) |
| See it | The lab URL, level, size, player that shows it within a minute | `lab.html?mode=cook&game=chai-tray&level=2`, 1280x665, New player |
| Lives in | One file | `js/shared/onboard.js` |
| Status | agreed <date> / waiting (<question>) / reversed <date> | agreed 5 Nov |
| Impact | stuck / wrong / feels bad / unfinished / cosmetic | stuck |
| Source | Rows, ledger lines, feedback refs | SH-213; F5A P2-P3 |

A row with two sentences is two rules. A row whose Why is praise is the keep list. Reversals are kept as dated lines under Status, newest first.

### 7.6 The values sheet (one table per area)

| Field | What |
|---|---|
| ID | `VAL-<area>-<n>` |
| Name | What the number is |
| Value | A number or a formula |
| Unit | px, s, a share of the screen's height, cards |
| Derived from | What it comes from, so a family re-derives rather than copies |
| Token | The `tokens.css` or `data/shared.json` name, or **to tokenise**, or "not a token" |
| Scope | As the rule's |
| Family may change | yes / no / with Zafar |

First rows from the ledger: the shelf line 818 of 900 and labels at 860; the panel's 2.5-card floor; 48 px tap; the green window 2 s at L4; the light's waits 7, 9, 11, 13 s; the zoom-in 0.65 + 0.45 s; the lesson's box corner at most a quarter of its height; the English shown 1.6 s; the light ends 0.9 s after the dots; the next-pan light 0.3 s; the stuck light waits up to 8 s for a still kitchen; Nani's box folds in 0.5 s; the word moment at speed 0.75, cards held 1 s, the pair 2.4 s; half at 0.42, full to the rim; the spout 0.4 of a glass above the rim; group gaps close to 20 px; the four sizes.

### 7.7 The gap-analysis cell and read-out

| Field | Values |
|---|---|
| Rule, Game | STD id x game |
| Proof | 0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his done |
| By design | blank, or the decision's date |
| Next step | Kit · Adopt · Game code · Art · Words · Decision · Check · none |
| Blocked by | A rule id, an art pack, a Mum round, a question |
| Size | S / M / L, and once-for-all or per game |
| Impact, Reach | From the rule; games affected |
| Evidence | A link: audit line, sheet crop, film |

Read-out: the four pages of section 4. Filled by passes 1-4 of section 4; one JSON, three roll-ups (rule, area, domain).

### 7.8 The lessons table

The table of section 5 goes into the standard as an appendix, "Why the checks exist", each row pointing to its check in `docs/tools.md` or its line in `checks-to-build.md`; the process rules go to `docs/process/`, not the standard.

### 7.9 Filling order and the proof of completeness

1. Glossary (from `kit-elements.json` plus the ledger's names). 2. Patterns. 3. Rules, from the ledger, the old page, the family page and chai's done rows, each row mapped in a placement table (row, rules it yields, area, pattern): every one of the 118 ledger rows and every ID the old page cites appears once, as rule, value, "bug, no rule" (a lesson row) or "not standard" (PAN-19 to 22, the sprint plan). 4. Values. 5. The gap JSON by the four passes. 6. The ID diff against the old pages: the dropped list for his yes. 7. The redirect.

## 8. Summary of the main changes (12 lines)

1. The unit is the rule, not the ledger row; a rule answers one question, a row may yield several rules, cross-linked.
2. The tie-break "where the decision is made" is replaced by "which question it answers"; nine domains, each one question.
3. Progression (C) is its own domain at four scales: within a round, across levels, across the ladder, across games.
4. Supply and roll-out (H) is added: art, voice and words pipelines, a family's entry checklist, open items.
5. Feel (B4), the grown-up's door (D5) and test hooks (F5) get homes; "praise" is a Source kind so the keep list feeds the standard.
6. Four scopes, not three (House, Engine, Family, Game), matching the ledger's own column; the scope decides the file after the Sprint 19 split.
7. Two new layers: a glossary of about 25 components seeded from `data/kit-elements.json`, and 14 named patterns between rule and value.
8. The rule row gains Component, Pattern, See it (a reachable state), Status with a Decided date, and Impact.
9. The values sheet allows formulas, says what each value derives from, and points to the token or flags "to tokenise".
10. The gap analysis is filled at rule x game by `kitmap.mjs`, `audit.mjs` and `kitsheet.mjs`, then rolled up; one ordered proof ladder (0-5) replaces the status scale; "Next step" replaces gap type and splits Kit from Adopt; priority is impact class, then reach, then size.
11. The 14 lessons regroup into nine root causes, plus two the told-before table shows (no owner; unreachable states), each marked as a check or a process rule.
12. "What's best": agree, but the old page is a source for about 40 Sprint 14-15 rules, the second check is a mechanical ID diff, and the fill order is glossary, patterns, rules, values, gap.

## Proof

Read in full: the draft, the ledger (sections 1-3), the old standard page, the family page, the rhythm doc; the heads of `ui-design-system.md`, `ux-principles.md`, `easy-to-play.md`, `checks-to-build.md`, `docs/README.md`, `S17-chai-done-families.md` §Small decisions and Sprint 18 decisions; `audit.mjs`, `kitmap.mjs`, `kitsheet.mjs`, `docs.mjs` (lines 113-152); `data/kit-elements.json` element names (13). The placement test in 2.3 cites the ledger rows by ID; the Sprint 14-15 IDs in section 1 line 6 are those the old page cites and the ledger does not.
