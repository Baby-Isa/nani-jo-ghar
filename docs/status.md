# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every designed game in it (Zafar, 2 Nov: "for now I want to work towards launching all games in the launch"); Gujarati and his feedback rounds come in the next big phase, after the launch.

---

## Next chat

**Handover branch:** `ccr-7da5e9f0-04g4xm` (`main` is the live site, unchanged since 12 Nov).

**Where things stand (15 Nov, 14:20 UK):** Sprint 20 (`docs/sprints/S20-one-kitchen-frame.md`). Overnight run (decision 38) done: `build/reports/overnight-2026-11-15.md` is the morning report. All ten stove-top games are on the kitchen frame and merged (chai, eggs, maani, corn, daar+chop, baking, sekelo, roll-tawa, samosa, chaat). The shared kit fixes (SH-304 to SH-311, CK-97) are in every game. Chai's box reference re-taken on the final merge (chai-ref-1300); chai's final gate (13:03) PASS, boxes identical. Open: sekelo's rows don't fold at well done (SH-308 misses it). Decisions 35-41 in `docs/decisions/2026-11-10-overnight.md` (39-41: calls taken while Zafar was away). His tokens reset Monday 17 Nov 10:00 UK; deadline (decision 28) every stove-top game by midnight Sunday 16 Nov UK.

**Progress (% per game, frame 25 / rows 20 / gate 25 / merged 15 / his yes 15):** chai 85, eggs 85, maani 85, corn 85, daar+chop 85, baking 80, sekelo 80, chaat 70, roll-tawa 65, samosa 65. No game has the eye judge's PASS yet; every re-look found fewer faults.

**How the night ran (reuse it):** each game's own cloud session (Opus, high) builds a round and pushes its branch with its own gate and chai's; the orchestrator merges, gates here, makes `sidebyside.mjs <game> --level <n> --sizes 740x320,1280x665` and hands `judge-batch.md` to the `judge` agent on Fable; agreed flaws become rows and the next round. Roll-tawa has no sidebyside (a hand-made batch from `run.mjs` frames). The strips' light "blink" is the probe hiding the light (a tool artefact). Sessions (all idle, reusable by send_message): kit `session_014xb3kPXU1ZwuZKQdeJiGXz`, lift `session_014xb3kSmcu5drivCH858Go9`, eggs `session_014xb3kNpUBrDQcZjCABMFwd`, maani `session_014xb3kNryFaA5kFoV7DbcqP`, corn `session_014xb3kREaZNp7f4QahD1N9K`, daar+chop `session_014xb3kT3gHJyDcvMb7d7Xap`, baking `session_014xb3kQz9uEMbLVbTEPKQfq`, sekelo `session_014xb3kQWcgyXw4vkREFrZhD`, roll-tawa `session_014xb3kQK6evGY6nK97efARm`, samosa `session_014xb3kSejQkoZB4C2g2WHxe`, chaat `session_014xb3kT51A6pmG6FLu3TcY1`.

**Zafar's answers (decision 42, 15 Nov ~14:15), to action first:** chaat's chop line one sentence with a comma ('Kali hakro tameto, ne hakro bataato.': the engine's join, no new Kutchi); maani's verb 'khapeti' in the bubble too (the engine's choice for this order); samosa's step line 'Bhar, chundo sathe' from the language engine (bhar, chundo and the sathe frame are recorded: build it there, never by hand; if it can't, log the gap on the recording sheet); sekelo's English 'barbecue' in the end review; keep sekelo's tomato cards, the read-along bubble and the pastry's one-light shadow; the art waits until he has played.

**Next, in order:**
1. Decision 42's four changes (chaat comma, maani khapeti, samosa's line, sekelo's 'barbecue'): one session, Opus high, about $10-20; the language checks and each game's gate.
2. Fable's last look at the games merged after it last judged them (all ten); flaws to each game's session. Open: sekelo's rows don't fold at well done (SH-308 misses it); Nani's face in chop alone (ui.js:1648 stripMode, the kit); Nana's line during chaat's chop (a ui.js keepOrder option).
3. Zafar plays the games and gives feedback (decision 42's 7); then a full gate on all ten here, step 6 (guard rails), step 7 (the exit test), step 8 (`/review`, publish).

**Rules learnt:** never edit code or push while a gate plays; one browser job at a time; a Monitor watch dies at 30 min (use background Bash for long chains); merge conflicts on overnight-log.md and kitchen-frame.md's counts line: keep both.

**Starting prompt for a new chat:**
> First `git fetch origin ccr-7da5e9f0-04g4xm` and work from that branch (it holds the newest handover; `main` is the live site).
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only, then `docs/sprints/S20-one-kitchen-frame.md`; nothing else until a task needs it.
> Carry on Sprint 20 from "Next, in order": decision 42's four changes first, then Fable's last look at all ten games. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 163 | 98 |
| Cook: pantry | 9 | 11 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 26 / 12 / 31 / 7 / 21 / 7 / 66 | 30 / 14 / 29 / 12 / 24 / 17 / 45 |
| Clinic | 38 | 168 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 24 | 10 |
| Language and audio | 13 | 7 |

---

## What is live (the game on `main`)

10 Nov 2026, published ~00:33 UK (8b4beca7, 20261110T002839Z): Sprint 19's behaviour work for Zafar's play: chai's cards, Nani's box and the ticking order card in every kitchen game, no tick/next/X, one shared first-time light and finger with the stuck help, Fable's flaws in sekelo, daar, eggs and corn, chai's three fixes, the stuck games fixed, the checks audit; chop's hop and the stoves round wait on their branches for the new art. Known fails: `build/reports/s19-publish-known-fails.md`. Live check: every kitchen game opens at 740x320 with no page errors. `--force` on his word (9 Nov).

8 Nov 2026, published ~14:25 UK (713908a8, 20261108T142321Z): Sprint 18's three waves for Zafar's play: the kits, chai on them (its frozen run unchanged), chop its own game, every kitchen game moved onto its settings file and the kits (eggs, baking and the corn stall still labs prototypes in their own scenes), the checks' and kit's fixes; `--force --words` on his word ("just publish it all to main ... so I can play it").

7 Nov 2026, published 00:21 UK (a8e7c99b, 20261107T001739Z): Zafar's 6 Nov night chai notes (the boil's sound, the light rule, the style tea's card, each person's own words, the word moment's pour, drop, counter and card), the art runs' zip and colour check; `--force` on his word ("push them through quickly").

6 Nov 2026, published 20:18 UK (19657cd5, 20261106T200832Z): chai for Zafar's review: the juice, the 6 Nov card and fonts, the walnut shelf with size classes, the walnut rolling pin; `--force` on his word ("then we can publish for me to review").

4 Nov 2026, published 16:06 UK, live 16:49 (2aae00ff, b575c206, 20261104T155132Z): Zafar's three replays of 4 Nov (L1, L2, L4: `docs/feedback/chai-play-2026-11-04.md`), the word moment on pack s17-wm2, the card's flight, the ladder between games, the shelf (`build/reports/s17-chai-replay-2026-11-04.md`); `--force` on his word; Pages held up by a GitHub incident.

4 Nov 2026, published 05:35 UK (b6bced02, 20261104T053215Z): Zafar's chai notes of 3 Nov evening, all 17 points, and the full checks' fixes for every game (SH-204, CLN-218, the reveal lesson's box, the onboarding kit on unmount) (`build/reports/s17-chai-replay-2026-11-04.md`); `--force` on his word ("push to main").

3 Nov 2026, published 14:55 UK (4343fa94, 20261103T145224Z): Sprint 17's chai for Zafar's play: the play button on a reloaded page (SH-198), the word moment at L4 (CHAI-67), chai's contract breaks fixed, the judge's fixes (`build/reports/s17-chai-2026-11-03.md`); `--force` on his word.

30 Oct 2026, published 20:36 UK (d7835a56, 20261030T203356Z): Zafar's evening notes on chai (`docs/feedback/chai-play-2026-10-30-evening.md`: a quiet pour, the s14 look at mount, a faster start, a second's pause before the cooker's light, bubbles beside the head on the right, the item card's light, a shorter helper card); `--force` on his word.

30 Oct 2026, published 19:12 UK (65d702a2, 20261030T190918Z): Sprint 15's chai, the shared fixes reaching every Cook game: no item before it is said (SH-171), the helper's call as her card opens (SH-172), the pop-out into its row as the card lab's (SH-163), the helper speaker's gap (SH-165), no ripple (SH-141), one light at a time (CHAI-50); `--force` on Zafar's word (the sprint's other games still to come).

28 Oct 2026, published 11:33 UK (be3aa32f, 20261028T113000Z): the overnight fixes (the central type SH-151, centred badges SH-140, chai's help light and dim CHAI-33/36, Cook's cog CK-53, chai's marble, pour and the eye test's thank-you SH-108/CHAI-31/CLN-206) and the new checks; `--force` on Zafar's word (28 Oct: "Yes publish"). Checked live: chai at 740x320, no errors, the light round the bottle and its pill, the cog in the sidebar.

28 Oct 2026, published after midnight UK (20261028T004936Z): the onboarding lab, round 5 (glow and bounce in a lit box, the order card lit, the helper unhidden, the self-scrolling order row, the no-sign); the game unchanged; `--force` per decision 3.

27 Oct 2026, published about 23:30 UK (20261027T232138Z): the card lab, round 4, with the chai onboarding lab ("Play chai" in the gear); the game unchanged; `--force` per decision 3.

27 Oct 2026, published late evening UK (20261027T223905Z): the card lab, round 3 (round speakers, roomier cards, option 8 for mixed one- and two-line Kutchi, the type roles in the shared tokens); the game unchanged; `--force` per decision 3.

27 Oct 2026, published 18:59 UK (238f365a, 20261027T185444Z): the card lab, round 2 (his choices as defaults; option 8, the rounded-square speaker); the game unchanged; `--force` per decision 3.

27 Oct 2026, published 16:45 UK (19b5c255, 20261027T164015Z): the Sprint 14 card lab (`lab/cards.html`, a labs tile: the new word, order and helper cards on a mock chai screen, numbered options behind the gear), the checks at four edge sizes, the 27 Oct feedback rows; the game itself unchanged. Past the publish gate with `--force` on Zafar's word (27 Oct, decision 3: rough lab publishes behind labs, the game's default unchanged).

27 Oct 2026, published 04:07 UK (958335e0, 20261027T040444Z): Sprint 13 "One shared kit" (one kit for every game, the one checking loop, SH-110, the loading and voice fixes), past the publish gate with `--force` on Zafar's word (26 Oct: "override what you need"; the gate counted the usual open rows and a contract run on the 34 main flows rather than every variant); final replay 70 pages, 2 breaks (SAM-27, older).

22 Oct 2026, published about 02:45 UK (7ff52b9, 20261022T014206Z): Sprint 10 "Show it" (labs, day builder, New player, girl patient, tooth drill, effects off), judged row by row.

21 Oct 2026, published 14:29 UK (a6c72e54, 20261021T132558Z): Sprint 9 ("A day at Nani's") on Sprint 8, past the gate on Zafar's word ("push to main asap"); only checks.mjs run (green).

21 Oct 2026, published 14:06 UK (c2410f7a, 20261021T130210Z): Sprint 8 (the 17-18 Oct fixes, the s08c art, the chicken with an English placeholder, the overnight and sweep fixes), on Zafar's word past the publish gate (`--force`). A second update follows with the last code rows.

16 Oct 2026, published 22:17 UK (38d0591a, 20261016T211414Z): Sprint 7, past the gate on Zafar's word (see "Next chat").

14 Oct hotfix, published 15 Oct 00:20 UK (cc2b0e8b, 20261014T231844Z): the 14 Oct publish (6fa99ea, CK-37/40/43) never deployed (the Pages upload was 1.29 GB, past GitHub's 1 GB limit, and timed out); `_config.yml` now leaves `sources/` and `build/` off the site (upload 329 MB) and checks.mjs "size" fails past 800 MB. Published past the gate on Zafar's word (no contract or evidence run on record in that session; no game file changed). That carries Sprint 5, published 13 Oct (8559d610, 20261013T205739Z): Sprint 5's fixes, judged independently (decisions 86, 96, 97), on top of Sprint 3, published 8 Oct (1a6950df): the shared request pop-up and voice stop, Sprint 3's Cook and clinic fixes, the API art (the girl's states, the redo list) on top of Sprint 2 (f0f4613a). Per-session detail is in `build/reports/`; the old tracker is `docs/archive/handovers/STATUS-TRACKER-2026-09-30.md`.

## How we work now (decision 99)

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most; up to eight in Sprints 17-18, Zafar, 7 Nov); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
