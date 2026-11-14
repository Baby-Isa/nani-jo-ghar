# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every designed game in it (Zafar, 2 Nov: "for now I want to work towards launching all games in the launch"); Gujarati and his feedback rounds come in the next big phase, after the launch.

---

## Next chat

**Handover branch:** `ccr-87413d9b-j48fpk` (the working branch; `main` is the live site, unchanged since 12 Nov 14:10, Sprint 19 not published by Zafar's choice, decision 22).

**Where things stand (13 Nov, 23:00 UK):** Sprint 20 is open: one kitchen frame for chai, eggs, maani and corn (`docs/sprints/S20-one-kitchen-frame.md`, its table holds every step's status and proof; plan `build/reports/s20-plan.md`; the frame's notes, its "owner", `docs/architecture/kitchen-frame.md`). Decisions 20-25 in `docs/decisions/2026-11-10-overnight.md`. No cost ceiling (decision 22).
- **Done and merged:** P0 counts (`build/tools/review/frame-counts.mjs`); P2 chai settled and P2b/P2c chai's last fixes (SH-286 the dish card is the order's pop-up, Mum's 12 Nov words, SH-287 the order view higher, SH-288 48 px tap areas, SH-289 the end grid and one headline size, the stamp in the tick's place); P3 the blocking gate `build/tools/tiers/gate.mjs` + `merge.mjs` (92 blocking, 18 advisory, `gate-lists.json`), proven on the final chai (contract 0 blocking over 38 pages); P4 the box reader `boxes.mjs` (3 identical runs, planted faults caught); P5 ten geometry rules (`boxes.mjs --rules`, 10/10 on chai except pill-clear's wobble); P7 103 kitchen layout rows parked "waits for the frame".
- **Running:** nothing. Half-hourly progress checks to Zafar by `send_later` (each schedules the next).

**Next, in order:**
1. Zafar's three answers: yes to chai's change list since 10 Nov (the list is in the chat and `build/reports/s20-p2-chai.md`); the glass clink quieter under Nani's voice (CHAI-113's rule, `js/cook/core.js:456`); the slightly smaller order sentence (SH-289).
2. On his yes: the glass clink if yes; re-take chai's references: `frozen.mjs --freeze` and `boxes.mjs` reference (`build/frozen/boxes/chai-tray/`); then the gate at zero including boxes.
3. P6: chai's 12 pictures to Zafar (six moments at 740x320 and 1280x665; mid-cook and the serve at L4). **Review point 2: new chat after it.**
4. Step 1: chai's play-area lines into the frame, unchanged (Opus, high, about $25-35), proven by boxes identical.
5. Open: pill-clear's wobble (the count pill 3.8-4.3 px above the hob at L1 mid, some runs) traced before the rules block; the merge script's real refusal of a broken branch.

**Open questions to Zafar:** the three in step 1.

**Starting prompt for a new chat:**
> First `git fetch origin ccr-87413d9b-j48fpk` and work from that branch (it holds the newest handover; `main` is the live site).
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only, then `docs/sprints/S20-one-kitchen-frame.md`.
> Carry on Sprint 20 from its table; tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 151 | 98 |
| Cook: pantry | 9 | 11 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 26 / 9 / 18 / 4 / 14 / 7 / 40 | 30 / 14 / 29 / 12 / 24 / 17 / 45 |
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
