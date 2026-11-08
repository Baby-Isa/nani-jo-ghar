# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every designed game in it (Zafar, 2 Nov: "for now I want to work towards launching all games in the launch"); Gujarati and his feedback rounds come in the next big phase, after the launch.

---

## Next chat

**Handover branch:** `ccr-31767b7f-rfyrg4` (Sprint 18's integration branch; `main` is the live site, unchanged since 20261107T120301Z).

**Update ~06:00: publish ON HOLD.** Zafar saw baking's play screen (a floating bowl, no shelf, a round light): baking, eggs and the
corn stall are not in chai's kitchen, and others differ. Fable's review and plan: `build/reports/s18-fable-what-went-wrong.md` (a
kitchen scene in the kit every game must use, structural and side-by-side checks, one more round); his 7 questions there.

**Where things stand (Sun 8 Nov 2026, ~05:15 UK):** Sprint 18 (`docs/sprints/S18-kitchen-family.md`): **waves 1-3 done and merged,
nothing running; waiting on Zafar's word to publish** (decision 9).
- **Wave 1:** the kits (stove, pans and pouring, serving, the shelf and pills, lights and lessons, the order's flow); chai on all
  five, each switch proven by its frozen diff; chop its own game; eggs, baking, the corn stall prepared.
- **Wave 2 (from 00:15, on Zafar's word):** all eight games on their settings files and the kits, copied code deleted, each with its
  gap page `docs/design-language/standard/gaps/<game>.md` (missing rules down by about a third to a half per game).
- **Wave 3:** the kit's asks (one page box, the stone band's shade, the word moment's own pair, daar's mistake-path light, chaat's
  lesson in view), the checks' fixes, chop's step and decoys. Full run `s18-w3-full`: 176 pages (every game L1-L4, four sizes),
  every end reached, 0 page errors; breaks: art low-res at 1920 (ART-59, ART-60), DAAR-43 (a phone light), the rest flaky on re-play.
  Standard audits `build/reports/audit-standard-*-2026-11-08.md`. Fable: `build/reports/s18-w3-fable-verdicts.md` (films 9/10,
  phones 3/10; the orchestrator's read below). All checks green.

**Zafar's play list (after the publish):** 1. Each kitchen game once, L1 on a phone and a laptop. 2. Chai's order strip scrolls
sideways on phones (signed off as built; Fable calls it clipped): still happy? 3. Chai's two small kit changes (a face tap waits
while someone speaks during a recast; a fallback line skipped once the round moved on). 4. Chaat keeps its wood board (the chop game
has marble). 5. Eggs and the corn stall at a phone: Fable saw the screen stay dim through the cooking. 6. Orders said in parts
("Muke ba samosa khape, ..."): Fable read the bubble as cut at the comma. 7. Baking's word moment at L3 (half, a cup).

**Open rows from tonight:** DAAR-43, CK-61, CK-62 (eggs' order card picture empty), SH-235 (the "?" pop-up on a phone), CHAI-107,
SAM rows, ART-60. **Questions:** eggs' five (`docs/questions.md`).

**Next:** on Zafar's word, `/publish` (`publish.mjs --force --words "<his words>"`), then his play and `/feedback`; Sprint 18's
close (Outcome, look back); Sprint 19 (the pantry's polish).

**Starting prompt for a new chat:**
> First `git fetch origin ccr-31767b7f-rfyrg4` and work from that branch (it holds the newest handover; `main` is the live site).
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it. Sprint 18's three waves are
> merged; publish only on my word, then take my play notes with /feedback. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 110 | 98 |
| Cook: pantry | 9 | 10 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 26 / 3 / 10 / 2 / 1 / 4 / 14 | 29 / 14 / 28 / 12 / 23 / 17 / 35 |
| Clinic | 39 | 168 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 13 | 10 |
| Language and audio | 12 | 7 |

---

## What is live (the game on `main`)

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
