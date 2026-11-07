# G Proof

**The question:** how do we know, before you play?

## G1 Automatic checks

#### STD-G1-01 · Every rule names the check, probe, contract, tool or launch doc that catches it, or is listed as a gap
- **Why:** "the rules and lessons live in the tools and ways of working, not only in a document" (Zafar, 5 Nov, v2 §8)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:stdids + gap: audit.mjs --standard (Sprint 17's tool builder)
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** shared kit

#### STD-G1-02 · A rule that can be code becomes a check, and the check replaces the rule's text
- **Why:** CLAUDE.md "Keep it small"; the gates of ledger 1.11
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:CLAUDE.md + doc:docs/process/checks-to-build.md
- **See it:** -
- **Status:** agreed (decision 99)
- **Layer:** shared kit · **Source rows:** led:1.11-5

#### STD-G1-03 · Every fast check passes before every push, and a publish is refused while one is red
- **Why:** CLAUDE.md, "Tools and skills"
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:CLAUDE.md + tool:publishgate
- **See it:** -
- **Status:** agreed (decision 89)
- **Layer:** shared kit

#### STD-G1-04 · Every check that a thing comes "not too early" is paired with one that it comes, and is noticeable
- **Why:** "I didn't get the onboarding screen to draw my attention to the next third item ... Just reinstate it" (Zafar, 4 Nov); lesson R1
- **Scope:** House
- **Pattern / part:** P2 / the light
- **Checked by:** contract-79 + contract-90 + gap: a contract lint that every timing check names its pair
- **See it:** labs.html, New player; chai L1 (1280x665)
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Source rows:** CHAI-77, CHAI-37, led:1.11-1

#### STD-G1-05 · A check that breaks on a right game is fixed in the check the same day, with the rule it follows named
- **Why:** "the check was wrong, not the game" (CHAI-60, 1 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:unit + doc:/review
- **See it:** -
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Source rows:** CHAI-60, led:1.11-2, SH-233

#### STD-G1-06 · A size fix is measured for size, place and neighbours at the four sizes, before and after, with the numbers
- **Why:** "That arrow shouldn't change the size of the box" (Zafar, 4 Nov), then the arrow moved (5 Nov); lesson R2
- **Scope:** House
- **Pattern / part:** P11 / -
- **Checked by:** tool:panelcheck + tool:labcheck + tool:pillcheck + gap: panelcheck.mjs printing a before and after diff
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (740x320, 1920x1080)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Source rows:** SH-209, SH-185, CHAI-43, CHAI-86, CHAI-33, CHAI-80

#### STD-G1-07 · The audit plays a game at L1-L4 at the four sizes and prints every rule of the standard as pass, fail or judge
- **Why:** "every area is broken down rule by rule" (Zafar, 5 Nov, v2 §8)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:audit + gap: audit.mjs --standard
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** shared kit

#### STD-G1-08 · Known findings only shrink: a check's known list never grows
- **Why:** Zafar, 23 Oct (compareKnown, shrinkKnown)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static
- **See it:** -
- **Status:** agreed 23 Oct
- **Layer:** shared kit

#### STD-G1-09 · The leak bots run every game at every level, and a player who knows no Kutchi cannot win
- **Why:** non-negotiable 4; "every level, not only level 1" (Zafar, 14 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:leak + tool:leak
- **See it:** -
- **Status:** agreed 14 Oct
- **Layer:** shared kit

## G2 Played evidence

#### STD-G2-01 · Every check names its coverage: L1-L4, the four sizes, a new and a returning player, the first and second round, a child's pace
- **Why:** lesson R1: SH-178 built and shot at L1 only; SH-196 checked once per visit
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:specs + gap: the evidence lint failing a probe with no coverage named
- **See it:** -
- **Status:** agreed 5 Nov (v2 §5)
- **Layer:** shared kit · **Source rows:** SH-178, SH-169, SH-196, SH-206, CK-06, CHAI-43, CHAI-33

#### STD-G2-02 · Every fix starts with its probe failing and ends with the same probe passing
- **Why:** decision 86 (Zafar, 12 Oct: red, then green)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:evidence (--apply refuses a PASS with no earlier FAIL)
- **See it:** -
- **Status:** agreed 12 Oct
- **Layer:** shared kit

#### STD-G2-03 · Timing is played at a child's pace and with pause drivers, never only at test speed
- **Why:** CHAI-58: "extend to two seconds" (a child's pace); the light gave up after 3 s (CHAI-77); lesson R1
- **Scope:** House
- **Pattern / part:** P12 / -
- **Checked by:** contract-90 + tool:lightfollow + tool:evidence (paths real-pace, pause-after-tea, pause-after-pour, idle-twice)
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (1280x665)
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Source rows:** CHAI-58, CHAI-77, SH-184, SH-205

#### STD-G2-04 · Conditions the sandbox hides are played on purpose: a phone's tap rule, a throttled network, a reload
- **Why:** "navigator.webdriver hides tap-to-start; test speed hides races" (Sprint 18 lessons, 7 Nov); lesson R6
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:tapgate + tool:loadtime
- **See it:** chai L1 on a phone, reloaded (930x430)
- **Status:** agreed 7 Nov
- **Layer:** shared kit · **Source rows:** SH-198, SH-201

#### STD-G2-05 · A motion is filmed every frame through the whole order, never judged from stills
- **Why:** SH-180 was filmed only with a skipping player; the pour was never filmed (SH-183)
- **Scope:** House
- **Pattern / part:** P4 / -
- **Checked by:** tool:evidence (strip, path order-whole) + contract-72
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Source rows:** SH-180, SH-183, led:1.11-4

#### STD-G2-06 · A reported fault is first replayed from a real start without the test browser's extras, so an artefact is never fixed as a bug
- **Why:** the jump was Chrome's "debugging this browser" banner (his own note, 1 Nov); lesson R7
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:/feedback + gap: a feedback step that replays on a clean profile first
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Source rows:** CK-57

#### STD-G2-07 · A sound is proven by a sound log, never by a still
- **Why:** "Sound rows need {human} evidence (sound logs ...)" (Sprint 18 lessons, 7 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:voicegate
- **See it:** lab/juice.html (1280x665)
- **Status:** agreed 7 Nov
- **Layer:** shared kit · **Source rows:** CHAI-87

#### STD-G2-08 · A reference game is frozen by a golden run, and every later move of its code is diffed against it
- **Why:** "the guard everything after is measured against" (Sprint 17, the rest, 7 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** gap: the frozen-run diff (Sprint 18)
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** shared kit

## G3 The judge

#### STD-G3-01 · A row is done only on an independent judge's PASS on its new evidence; the builder never judges its own work
- **Why:** non-negotiable 5; decision 96 (Zafar, 13 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:CLAUDE.md + tool:evidence (--judge, --apply)
- **See it:** -
- **Status:** agreed 13 Oct
- **Layer:** shared kit · **Source rows:** led:1.11-8

#### STD-G3-02 · The judge gets only the script-made batch, the row's words and its before beside its after, never the builder's account
- **Why:** decision 96; the one loop (Zafar, 26 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:evidence (--judge --brief) + doc:the judge agent (`.claude/agents/judge.md`)
- **See it:** -
- **Status:** agreed 26 Oct
- **Layer:** shared kit

#### STD-G3-03 · A shared element is passed on one sheet that crops it from every live page at both sizes
- **Why:** "one side-by-side sheet per shared element is done" (Zafar, 26 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:kitsheet
- **See it:** lab/kit.html (1280x665)
- **Status:** agreed 26 Oct
- **Layer:** shared kit

#### STD-G3-04 · The judge finds flaws first and passes a thing only when a child would notice it, not merely when it is present
- **Why:** "shown" counted a 36x24 px box after a 3 s pause (SH-196, 5 Nov); lesson 6 of the ledger
- **Scope:** House
- **Pattern / part:** P3 / the light
- **Checked by:** doc:the judge agent (`.claude/agents/judge.md`) + contract-84
- **See it:** labs.html, New player; chai L2 (740x320)
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Source rows:** SH-196, SH-213

#### STD-G3-05 · A row told before shows its last failing evidence beside the new
- **Why:** the told-before table (ledger §3): 22 rows raised more than once
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** gap: evidence.mjs --judge pairing a told-before row with its last FAIL
- **See it:** -
- **Status:** agreed 5 Nov (v2 G3)
- **Layer:** shared kit · **Source rows:** SH-178, SH-180, CHAI-68

## G4 Your play

#### STD-G4-01 · Every point of his feedback is a fix-list row the same day, its cause checked in code as file:line
- **Why:** CLAUDE.md, "Fix it properly, once" (Zafar, 22 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:feedbackcheck + doc:/feedback + check:fixlist
- **See it:** -
- **Status:** agreed 22 Oct
- **Layer:** shared kit

#### STD-G4-02 · A fix is written as the aim of his words and read against them by a second reader, never built as the narrowest case
- **Why:** "the collapsed version of it should appear when he says the sentence" (Zafar, 1 Nov: the items hidden, the headline left); lessons R4, R5
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:/feedback (the second reader) + judge: the row's words against the after, at the row's sizes
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Source rows:** SH-171, SH-183, SH-153, SH-206, SH-177, SH-145

#### STD-G4-03 · Every shared row names the sprint that owns it
- **Why:** SH-139, told 27 Oct and 1 Nov, never built: no sprint owned it; lesson R8
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** gap: sprintcheck.mjs failing an open shared row with no sprint named
- **See it:** -
- **Status:** agreed 5 Nov (v2 §5)
- **Layer:** shared kit · **Source rows:** SH-139

#### STD-G4-04 · What he praises goes on the keep list, which every brief carries as out of bounds
- **Why:** "The half mechanism ... works quite well. It's quite clever" (Zafar, 1 Nov); non-negotiable 1
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:/brief standing lines + gap: brief.mjs adding the game's keep rows to every brief
- **See it:** -
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Source rows:** KEEP-21

#### STD-G4-05 · A publish waits until every fixable row is fixed and proven, and an override is on his explicit word, recorded in the commit
- **Why:** decision 89 (13 Oct); the Sprint 16 publish overrode the gate on his word (2 Nov); lesson R7
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:publishgate + gap: publish.mjs --force writing his words into the commit
- **See it:** -
- **Status:** agreed 13 Oct
- **Layer:** shared kit · **Source rows:** led:1.11-9

#### STD-G4-06 · A reversed decision keeps its history, newest first, so his newest word is plainly the newest
- **Why:** CLAUDE.md "The newest word from Zafar wins"; SH-38 reversed three times ("just to make it consistent", 1 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:CLAUDE.md + gap: stdids.mjs checking each Status is dated, newest first
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Source rows:** SH-38, SH-153

#### STD-G4-07 · He plays a reference only after its audit is green and the judge has passed it on film
- **Why:** prototype-to-game step 3 (Zafar, 2 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:docs/process/prototype-to-game.md + tool:audit + tool:publishgate
- **See it:** -
- **Status:** agreed 2 Nov
- **Layer:** shared kit · **Source rows:** led:1.11-7

## Lessons: why the checks exist

| | Root cause | Rows that show it | Guarded now by | Still a gap | Rules |
|---|---|---|---|---|---|
| R1 | We looked at one state (one level, size, pace; "too early" but never "never") | SH-178, SH-169, CHAI-43, CHAI-33, SH-196, SH-206, CK-06, CHAI-77, CHAI-58, SH-184, SH-205 | contract-90, the drivers real-pace and pause-after-tea, tool:lightfollow | the coverage lint; the pairing lint | STD-G1-04, STD-G2-01, STD-G2-03 |
| R2 | We measured one property (size, not place or neighbours) | SH-209, SH-185, CHAI-43, CHAI-86, CHAI-80, SH-206 | tool:panelcheck, tool:pillcheck | panelcheck's before and after diff | STD-G1-06, STD-F2-04 |
| R3 | Two owners of one thing (a second redraw, a mid-round change, a fit engine against a scroller) | SH-180, SH-196, SH-211, SH-210, SH-207, SH-195, SH-201, CHAI-102 | contract-72, contract-80, data-njg-scroller | the reversal film for every motion; the snapshot lint | STD-F3-01 to STD-F3-04, STD-F1-05 |
| R4 | We built the case, not the rule | SH-177, SH-145, CHAI-43, SH-203, SH-208, CHAI-66 | contract-76, contract-82, contract-83, contract-86 | a placed-element check against every face, bubble, gear and panel | STD-G4-02 |
| R5 | Stand-ins read as real; the narrowest reading of his words | CK-06, ART-31, CHAI-64, CHAI-80, CHAI-82, SH-171, SH-183, SH-153 | check:art | the audit's list of code-drawn effects | STD-H1-05, STD-G4-02 |
| R6 | Platform rules forgotten (phone audio) | SH-198, SH-201, CHAI-87 | tool:tapgate, tool:loadtime | loadtime on a throttled line with audio | STD-F4-02, STD-G2-04 |
| R7 | Evidence misread (test artefacts, an overridden gate) | CK-57, ART-39, CHAI-79, led:1.11-9 | tool:publishgate, check:art | his word recorded on a forced publish | STD-G2-06, STD-G4-05 |
| R8 | No owner (a shared row no sprint took) | SH-139 | none | sprintcheck's owner rule | STD-G4-03 |
| R9 | Unreachable states (a lesson he could not get to) | SH-196, SH-216 | labs.html Words known | the See it guard | STD-F5-01 |

Reversed decisions (SH-38, SH-153) are dated Status lines, not lessons (STD-G4-06).
