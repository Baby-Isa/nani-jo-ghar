# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every designed game in it (Zafar, 2 Nov: "for now I want to work towards launching all games in the launch"); Gujarati and his feedback rounds come in the next big phase, after the launch.

---

## Next chat

**Where things stand (4 Nov 2026, 16:55 UK):** Sprint 17 is open (`docs/sprints/S17-chai-done-families.md`), **chai only** until Zafar
calls it done (Zafar, 4 Nov: the other games in later sprints). His three replays of 4 Nov (L1, L2, L4, laptop:
`docs/feedback/chai-play-2026-11-04.md`, 18 points) are built, checked and **live on `main`** (20261104T155132Z, b575c206; Pages
delayed by a GitHub incident, live 16:49). He replays chai on a laptop, then his phone. Report: `build/reports/s17-chai-replay-2026-11-04.md`.
- **Live since this morning:** the next item's light after the first two (CHAI-77; contract-90 guards it); the reveal lesson as one
  lesson with a click (SH-196); the card's flight landing exactly on its card, tighter arcs (SH-203); the word moment first, one
  steady glass (pack s17-wm2), the kettle's pour and last drop, both poured then each snapped, thin corners (CHAI-78 to -82); the
  serve-time cards whole (SH-206); the ladder only between games (SH-207); the shelf centred and spread (SH-208).
- **Checked:** the full chai run `s17-pm2` 0 contract breaks over 44 pages; every game's route `s17-pm2r` clean; `checks.mjs` green;
  the judge (Fable): CHAI-71 built, CHAI-67 reopened on its probe, the rest EVIDENCE (the rows say why).
- **Open:** SH-205 (a hint during a pour at L4): not reproduced, no video; he watches for it.

**Next steps, in order:**
1. **His chai notes** (laptop, then phone): `/feedback` on each, rows the same day; fix in this chat's fast lane, the four-size check,
   the full chai run (`node build/sandbox/run.mjs --touched cook:chai-tray --check`), publish on his word (`/publish`). Repeat
   until he says chai is done.
2. **The probes that still miss** (tool work, no game change): CHAI-67 on second-play; CHAI-68 (pause-after-pour never reached the
   light); CHAI-75; CHAI-77 at 740x320 (the light lasts 0.4 s at the test speed); SH-201 (real clips, played through); SH-202 and
   CHAI-74 (the want didn't seed a "no" or adh/aako order); SH-196's L3 picture lesson (a profile whose words are past their pill);
   SH-189 and SH-203 need a red run. Then the judge on those rows (Fable, about $3).
3. **When he says chai is done:** the chai standard page finalised from chai's rows (`docs/design-language/chai-standard.md`);
   `/review` and `/publish`; Sprint 17 closed with `/sprint` (the look back, the budget: three days planned, four used).
4. **Sprint 18** opens on his go: the stove family to chai's standard (`docs/game-design/families/stove.md`), the art redo (BK, NF, MZ:
   `docs/design-language/art-plans/s17-art3-redo-block.txt`).

**Open questions to Zafar:**
1. Is chai done after this replay, or is there another round?

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only (nothing else until a task needs it). Sprint 17, chai only: take my chai
> replay notes with `/feedback` and fix them until I call chai done; then finish Sprint 17 (the chai standard page, the missed
> evidence probes and the judge, `/review`, `/publish`, `/sprint` to close). Work on branch `claude/admiring-ptolemy-77fuv5`; `main`
> is the live site. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 61 | 103 |
| Cook: pantry | 9 | 10 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 16 / 4 / 7 / 2 / 1 / 4 / 10 | 27 / 14 / 27 / 12 / 22 / 17 / 34 |
| Clinic | 36 | 169 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 11 | 10 |
| Language and audio | 12 | 7 |

---

## What is live (the game on `main`)

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

Small fixes in the orchestrator's chat (red then green, Fable judges the picture, Zafar sees it); one build session at a time (two at most); sprints of one to three days with one playable goal. The old plan table and the 5 Oct "where each part is" estimates are in `docs/archive/status-2026-10-13.md`.
