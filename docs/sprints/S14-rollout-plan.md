# Sprint 14: the roll-out plan (chai's finish, the checks, every Cook and clinic game on the new kit)

**Written:** 30 Oct 2026, 00:40 UK, for a new chat to run without Zafar ("create detailed, specific, comprehensive and effective
build plans ... then give me a handover note for a new chat to launch and manage all that build independently without me").
**His go:** given (29-30 Oct: chai first, learn, then "run both builders to change all the cook and clinic games to the new chai
style"; "set the builders up to build all night"). Rough publishes to `main` are allowed (decision 3, `--force`). Ask him only
what this plan lists under "Needs Zafar".

**Read first, in this order:** `CLAUDE.md`; this file; `docs/game-design/rulebook.md` (the rules and every game's numbers);
`build/reports/s14-chai-lessons.md` (rounds 1-2 and the orchestrator's check); `docs/feedback/chai-rules-2026-10-29.md` (his
latest notes and section 5: why things were missed and the checks that catch them); `data/rules.json` with `js/shared/rules.js`.

## 0. Where it stands

- **Live on `main`** (89729f48, 20261029T215612Z): chai on the central rules file (the evening of 29 Oct).
- **On the branch `ccr-dfbb763e-fd6lh9`, not live:** every fix from his 29 Oct notes (rows CHAI-40 to CHAI-47, SH-161 to
  SH-166), his per-game numbers in `data/rules.json` and the rulebook, the roll-out rows (PAN-18, MAA-19, SEK-22, SAM-28,
  CHT-17, DAAR-36, CLN-207 to CLN-215, SH-167, SH-168). The last two code changes are **unverified**: the three-person pop-out
  at the item card's size, and each control lit with its call (see phase A).
- Nothing running. No open question to Zafar except Mum's word order (below).

## 1. The order of work

| Phase | Who | What | Model, effort | Cost | When |
|---|---|---|---|---|---|
| **A** | the orchestrator, in the chat | finish and verify chai's last tweaks; publish | (the chat) | - | first, about 2 h |
| **B** | builder 1: `s14-tools` | the checks that would have caught his 29 Oct notes | Sonnet, high (tools, but subtle) | about $20-30 | with phase A |
| **C1** | builder 1 again: `s14-cook` | every Cook station on the new kit, his numbers | Opus, high | about $60-90 | after B merges |
| **C2** | builder 2: `s14-clinic` | every clinic heal game on the new kit, his numbers | Opus, high | about $60-90 | with C1 |
| **D** | the orchestrator | merge, check (the checklist, section 5), judge, fix, publish, report | (the chat) | judges a few $ | the morning |

Two builders at most at once (CLAUDE.md). B and A overlap (B owns only `build/` tools); C1 and C2 overlap (one per game area,
owned files disjoint, section 4). Each brief: `/brief` from the spec under `build/tools/ops/specs/` (s14-tools, s14-cook,
s14-clinic), with `build/reports/s14-chai-lessons.md` in its read-first list. Launch builders as in-chat subagents
(`Agent`, `isolation: "worktree"`, model as above); they commit in their worktree, never push; the orchestrator merges.
Schedule a check-in (`send_later`) for each builder's hard stop.

## 2. Phase A: chai's finish (the orchestrator)

Each item: what was changed, how to prove it. Prove with a script on the sandbox's own server and browser
(`build/sandbox/lib/env.mjs` `startServer`, `launch`, `newPage`; never `await njgTest.cook.lab`, it resolves only at the end;
call it inside braces). Film at 150 ms a frame; look at every sheet yourself before publishing.

| # | Item (row) | State | Prove |
|---|---|---|---|
| A1 | Three people: the pop-out at the order row's item-card size, under the left face, a little narrower or scaled (zoom) only if it must (CHAI-43; `js/cook/ui.js` placeFree14) | built, unverified | film chai L4 at 740x320, 930x430, 1920x1080: the card under Nana's face, whole on screen, never over a face, about the item card's size |
| A2 | Each control lit with its call for every player: the knob, the knob at the green, the glass (CHAI-40; chai-tray.js `CONTROL14`, `ctl14`) | built, filmed once for a returning player | chai L1 new player and returning (`njgTest.cook.coachesSeen()`): the dim, the gold box and the call in the same frame; no second spotlight later; contract-24 and contract-36 green at L1-L4 |
| A3 | The call's beat (`data/rules.json` showing.callAfterLightMs) is 0: at 350 ms it sometimes lost a call (contract-36); A2 replaces it | done | nothing more; leave it 0 |
| A4 | The order card's light after the tea lands (CHAI-42) | built | film the new player's first two items: the card lights after the tea's fly and the pan's fade |
| A5 | No light on the helper arrow (SH-162), the lit box's warm fill (SH-164), the glass's box takes in its face (CHAI-47), the heat ring over the handle (CHAI-46), the side card's speaker beside its words (SH-165) | built | a still of each at 930x430 and 1920x1080 |
| A6 | The morph: one even scale, no doubled words (SH-163) | built, filmed | already filmed clean; recheck once in the A1 film |
| A7 | Two people stand middle and right (CHAI-43; `Rules.counterSpot`) | built, filmed | chai L2 film |
| A8 | The pour frames load after the station starts (CHAI-44) | built | time from `lab.html?mode=cook&game=chai-tray&level=3` to the first play tap, before (main) and after; and the pour still plays its frames |
| A9 | No kitchen jump on load: the kitchen waits for its painting (stations.js `topDown` includes service), and chai's look is set with a resize and two frames before the first draw (`preLook` in flow.js) (CHAI-45) | built, filmed at 930x430 | film the first second at all four sizes: one fit from the first frame |
| A10 | The replay re-adds every picture (`js/cook/art.js` `imgs`, `reuse`) (SH-161) | built, **unverified** | the scripted player cannot drive lab.html's end screen; write a script that plays a round on `lab.html?mode=cook&game=chai-tray&level=3`, presses Play again (`.njg-results [data-act=again]`), and reads the station's textures: no `__MISSING`, the worktop the painted marble (`spr:bg:marble`), the fx textures present |
| A11 | Bubbles off the side panel (`data-njg-keepout` on `#side`; `js/shared/request-popup.js` and `conversations.js`, placed after its words) (SH-166) | built, filmed at 740 and 930 | a still of the greeting and of a line bubble at the four sizes in chai, maani and the pantry |

Then: `node build/tools/review/checks.mjs`; the contract run on cook:chai-tray (L1-L4), cook:maani-line, cook:samosa,
cook:fetch at the four sizes (only contract-53's known help-light breaks in samosa, daar, the pantry and the grill, which C1
fixes); `/publish --force`; mark the rows "to fix: check · built ... verified <how>"; a short note to Zafar.

## 3. Phase B: the checks (`s14-tools`, builder 1)

The point (Zafar, 29 Oct: "explain why did didn't catch them and how to make sure you do next time"): each check is red on chai's
code before his 29 Oct fixes (`main` at 89729f48) and green after (the branch). Owns `build/**` only (the sandbox, its lib,
drivers, flows, the evidence tool, the review tools and their tests); never game code (a test hook only where named below).

| # | Check (rows SH-167, SH-168) | Acceptance |
|---|---|---|
| B1 | **The film probe:** the evidence tool's strip (`strip:<sel>:NxMS`) records motion; today it reports "did not change" for a moving pop-out and order row. Root-cause it (the capture region, the moment, the frames' interval, the comparison) | SH-152, SH-154, CHAI-39 and SH-157's probes film the order on the branch at 930x430 and 1920x1080 |
| B2 | **A face-box test hook** for any game: `njgTest.faces()` (Cook: every scene character's `headBox` in page px; clinic: the patient's and the doctor's), the one game-code change this builder may make (`js/cook/flow.js` test hooks, `js/clinic` test hooks) | a script can ask where every face is |
| B3 | **The timeline check:** a step's call never before its light (the light within 200 ms of the call, either way), and the order card's light only after the last move ends (no fly or fade in progress) | red on `main` for a returning player at chai L1 (his video's "voice, pause, dim"); green on the branch |
| B4 | **The replay driver:** a round on `lab.html`, Play again, then the station: no missing texture, the worktop painted, the fx loaded | red on `main` (the code-drawn worktop), green on the branch |
| B5 | **No layout jump:** the play area's kitchen fit unchanged from the first drawn frame to 2 s on (compare the background's transform or a pixel band) | red on `main` at 930x430, green on the branch |
| B6 | **Load time and bytes** to the first play tap, per game, recorded in a baseline; a growth of 20% or more fails | chai's before and after recorded |
| B7 | **Overlaps:** no picture over a gauge (the heat ring), no lit box edge across a face circle, no bubble over a side panel (`[data-njg-keepout]`) while the play area has room, no card over a face (B2's boxes) | red for the handle and the tray face on `main`, green on the branch |
| B8 | **The light's contrast:** the lit box's inside is lighter than the dim around it by a set margin on a dark thing (the burner) | red on `main`, green on the branch |
| B9 | **Card spacing on the game's cards:** `labcheck.mjs`'s spill and spacing measure run on `cook.html` (and the clinic) states | the side card's speaker gap measured |
| B10 | **Evidence through `lab.html` at speed 1** for timing rows, and a returning-player profile in the evidence loop | the timing rows play at a child's pace |
| B11 | **A save-seeding driver** (a profile with words learned, rounds played) for the word pill (SH-159) and the level-up (SH-160) | pictures of a hidden pill, its return after a miss, and a level-up |

Each new check goes into `build/sandbox/lib/contract.mjs` (with its CONTRACT_ROWS entry and tests) or the review tools, is listed
in `docs/tools.md`, and its line struck from `docs/process/checks-to-build.md`.

## 4. Phase C: every game on the new kit (`s14-cook`, `s14-clinic`)

### 4a. What every game gets (the rulebook, section 1; chai is the reference)

1. **The word card** (`WordCard.big14`, `item14`): the serif from the tokens, maroon Kutchi on its English, the round speaker,
   dots in place, the stronger blur, no clipped words; the order card by level (Kutchi always; English dotted from L2; picture
   blurred from L3).
2. **The order:** item by item in the speaker's bubble, each word's big card popping beside the side panel (never over a face;
   two people stand middle and right; three: under the left face at the item card's size), then morphing into its row card
   (one even scale); "no" items said last; a tap in the play area skips, a tap on a bubble, the side panel, the cog or the menu
   never skips; the big card's hold by the word's state (1.5, 1.0, 0.6 s).
3. **The sideways order row** that glides and settles itself (ticked first, "no" cards last, a child's scroll kept).
4. **The guide's helper card** (Nani in Cook, the doctor in the clinic): the full answer, growing in the guide's box; the arrow,
   no bulb, no light on the arrow.
5. **The light:** the lit box with a warm fill and a gold glow, an item also bounces, a control only glows; no finger; a control
   lit with its call; every item not on the order card shown at the start; each new action once; each level's new thing once;
   the order card lit 1.2 s after the showing, once nothing moves; a mistake shakes and says its word.
6. **Timed controls:** the first time, the timer holds in the green until the child acts (`Rules.firstTimeHold`).
7. **The word pill:** the item's Kutchi until three right in a row, then speaker only, back after a miss until one right.
8. **The level-up:** 3 rounds in a row at a level with the guide's hint at most once each; never down; a grown-up's pick wins.
9. **The counts and level shapes** from `data/rules.json` (`Rules.counts`, `Rules.level`), never a game's own copy; L1 the core
   (only "yes" asks), L2 more and numbers and "no" asks, L3 other ways of saying it, L4 the most and a lookalike decoy.
10. **Bubbles** placed by the head into free space, off faces and side panels; **the cog** top right (Cook has it; the clinic
    gets the same central menu); **loading**: the look set before the first draw, art not needed at the start loaded after it,
    a replay re-adding its pictures; **the hint waits** 7, 9, 11, 13 s.

### 4b. Cook (`s14-cook`): owns `js/cook/stations/*.js` except chai-tray.js, `js/cook/mechanics/**`, `data/stations/*.json` except
chai-tray.json, the station parts of `data/cook.json` and `js/cook/flow.js` / `ui.js` / `station-lib.js` where a station needs
them; reads `data/rules.json` (adds only its own game entries).

| Station (row) | Numbers by level | Its own points |
|---|---|---|
| **Pantry** (PAN-18) | items 3, 4, 5, 6 | the shelf stays full (its decoys); the help light hugs the item (contract-53) |
| **Maani** (MAA-19) | rotis 2, 3, 4, 5 | the tawa flip's first-time hold; big and small and the bajra kinds by the level shape |
| **Sekelo grill** (SEK-22) | skewers 1, 2, 3, 4 | the turn's first-time hold; mixed skewers at L3; the help light (contract-53) |
| **Samosa** (SAM-28) | samosas 2, 3, 4, 6 | 6 only if the fry pan fits six, else 4 and say so; "no" asks L2 (were L4); the fry lift's first-time hold; the help light (contract-53) |
| **Chaat** (CHT-17) | items in the bowl 3, 4, 5, 6, a double portion counting twice | "no" asks L2 (were L3); decoys 1, 2, 3, 4 |
| **Daar** (DAAR-36) | chopped + added first (X+Y) 1+2, 2+2, 3+3, 4+4 | decoys 1, 2, 3, 4; the tadka's first-time hold; the help light (contract-53); chop, tadka and stir |

The s14 look turns on for every Cook recipe (`flow.js` `CHAI14` becomes every dish; `ui.js` `mission.s14` likewise); the old
`levelTable` (`Cook.levelRow`) reads `Rules.level` and then goes; `recipes.js`'s L1 "no" rule (CK-50) reads `Rules.level().noAsks`.

### 4c. The clinic (`s14-clinic`): owns `js/clinic/**`, `data/clinic/**`, `css/clinic*`; the shared kit (`js/shared/**`) only to
add what the clinic needs without changing chai (each change run on chai too).

| Game (row) | x + y by level (a-b: random in range) | Its own points |
|---|---|---|
| **Eye test** (CLN-207) | drops first + chart cards: 2+4, 2-3+5, 2-4+6, 2-5+7 | more flash-card rounds (today a fixed 4); never a "no" ask; one onboarding round with a wrong answer (CLN-205) |
| **Ear** (CLN-208) | blobs + drops: 3+1-3, 4+2-4, 5+2-5, 6+3-6 | the data notes are an older design: the code's K decides |
| **Knee** (CLN-209) | kicks + turns: 1-3+4-5, 2-4+5-6, 2-5+6-7, 3-6+7-8 | |
| **Tooth** (CLN-210) | moves + patches: 2+1, 3+2, 4+3, 6+4 | the fill's timing is a timed control: first-time hold |
| **Foot** (CLN-211) | jugs + splinters: 1-3+1, 2-4+2, 2-5+3, 3-6+4 | one bit of dirt per jug, each pour clears one, the last pour leaves it clean; the data notes are an older design |
| **Sore spots** (CLN-212) | colours to pop + decoy spots: 1+1, 2+2, 3+3, 3+4 | "not this colour" at L2 stays |
| **Boing** (CLN-213) | wipes + drops: 1-3+2-3, 2-4+2-4, 2-5+3-5, 3-6+3-6; dispensers 1, 2, 3, 4 | |
| **Scrape** (CLN-214) | dabs + stitches: 1-2+0, 1-3+2, 2-4+3, 2-4+4 | two-colour plasters at L4 as today |
| **Fever** (CLN-215) | things tried before the right temperature: 2, 4, 6, 8 | today's exchanges 3-4 become these |

Clinic-wide: the doctor's box as the helper card; the clinic's own card looks go (SH-137); bubbles off the patient's face
(contract-52, today's breaks) and long words inside cards (contract-51, today's breaks); numbers spoken from L1; the clinic's
morning level-up (`ClinicPipeline.levelUp`) reads `Rules.advance()`.

### 4d. Each builder's proof (in its brief)

Every game it touched at L1-L4 at the four sizes, a new and a returning player, with B's checks: a filmed order or round, a
replay, the load time, overlaps, the light's contrast, the timeline; the contract run 0 new breaks it doesn't explain; unit
tests; its rows' after pictures; a Round 3 section appended to `build/reports/s14-chai-lessons.md`.

## 5. The orchestrator's checklist at every merge (what was missed on 29 Oct, and the habit that catches it)

1. **Film, don't trust a still:** every order and every page load at the four sizes, 150 ms a frame; look at each sheet.
2. **Play as Zafar plays:** `lab.html` at speed 1, a returning player as well as a new one, and press Play again.
3. **Read the timeline before acting on a timing verdict** (a probe's moment can be early).
4. **Bring row texts up to his newest words before the judge** (three S14 FAILs were old wording).
5. **When a check goes red, read the rule it encodes and its date;** update a stale check in the same commit, never loosen one.
6. **Grep `build/` too when a number moves** (helpMs had readers in the evidence tool and its tests).
7. **The before** on `main`'s code in a worktree with the branch's evidence specs, sandbox lib, drivers, flows, the fix list and
   `data/rules.json` copied in (or it refuses or mis-times).
8. **One shared change, judged in three games** (the cog passed that way); a game-specific change, one game at a time.
9. **Never ship a fix that was not reproduced** without saying so; a tuning knob that breaks a check goes back to its safe value.
10. **Ask the user nothing that the code or the data can answer;** read the game's code, not its data notes, for "today".

## 6. Needs Zafar (do not block on these)

- **Mum:** chai's new word order with the "no" items last (`docs/questions.md`, "For Mum").
- **His play** of the finished roll-out (the morning after D), then `/feedback`.

## 7. Risks

- The clinic's games differ more from chai than the Cook stations: if a heal game cannot take a rule cleanly (a game without
  an order card), the builder says so and keeps the game's own way for that rule, never a half-built rule.
- Samosa's pan may not fit six; maani's and the grill's older guide box; the eye test's extra cards need more flash-card
  pictures (use what `data/clinic/heal/eye.json` has; report any gap, never draw one).
- Context: hand over (`/handover`) before about 70% of the chat's context.
