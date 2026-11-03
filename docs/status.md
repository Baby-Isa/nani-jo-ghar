# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every designed game in it (Zafar, 2 Nov: "for now I want to work towards launching all games in the launch"); Gujarati and his feedback rounds come in the next big phase, after the launch.

---

## Next chat

**Where things stand (3 Nov 2026, about 18:10 UK):** Sprint 17 is open (`docs/sprints/S17-chai-done-families.md`). Steps 1 to 4 of the
15:15 handover are done (`build/reports/s17-steps1-4-2026-11-03.md`). Nothing is running. `main` is unchanged (4343fa94, chai live for
Zafar's play). Branch `claude/admiring-ptolemy-77fuv5`.
- **Sprint 18 made ready:** the stove family against chai (`docs/game-design/families/stove.md`, every game audited: lab pages clean,
  panel misses SH-192, SH-169, SH-191 in daar, chaat, sekelo, samosa, eggs); Mum's Round 6 (148 lines,
  `docs/language/mum-questions/`); ten opening decisions in the sprint file.
- **Drafts:** the chai standard with the onboarding rule for every game (`docs/design-language/chai-standard.md`, SH-146).
- **Art block 3:** clinic care and block 1's redos, 35 prompts, about 50 images, the paste block ready (`build/reports/art-queue.md`).
- **The judge's blind spots:** every row has a spec; spkgap, SH-180's and CHAI-57's probes fixed; `teachgate.mjs` (SH-197, all 30
  prototypes pass). Evidence runs `ev-20261103-171129-t61`, `-174914-nhg`, `-180011-2zi`: 9 PASS by the machine, about 16 rows for
  a reviewer. Still blind: CHAI-62 (a boil-over driver, checks-to-build 26).
- **SH-175 (load time):** a real growth (chai L3: 9.9 MB, 397 requests against 8.7 MB, 355 on 1 Nov); not applied to the fix list yet.

**Next steps, in order:**
1. **His play of chai, then `/feedback`;** fix what blocks play; he says "done"; the chai standard final; `/sprint` close.
2. **The judge** (Fable, about $10) on the three runs' reviewer rows, on his go; then `--collect` and `--apply`.
3. **SH-175:** re-measure on a quiet machine (`loadtime.mjs --games chai-tray --runs 2`), find the 42 new requests (the word moment's
   pieces loading at L3 first), fix.
4. **The boil-over driver** (checks-to-build 26), then CHAI-62's probe.
5. **Art block 3** on his go; judge, cut, queue for Sprint 19-20.
6. **Sprint 18 opens** with its ten decisions.

**Open questions to Zafar:**
1. Chai: your play and notes; "done"?
2. Go for the judge (Fable, about $10)?
3. Go for art block 3, and its four questions (§7 of `docs/design-language/art-plans/s17-art3-art-plan.md`)?
4. The onboarding rule (SH-146, the chai standard §1): yes, or changes?
5. CHAI-33 (move the shelf up at phone heights?) and CHAI-40 (a control's light every time?).
6. Mum's Round 6: take it to her when you see her.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only (nothing else until a task needs it). Carry on Sprint 17: my chai notes with
> `/feedback` when they come, then the next steps in order. Work on branch `claude/admiring-ptolemy-77fuv5`; `main` is the live site.
> Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 53 | 97 |
| Cook: pantry | 9 | 10 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 18 / 4 / 7 / 2 / 1 / 4 / 10 | 25 / 14 / 27 / 12 / 22 / 17 / 34 |
| Clinic | 35 | 169 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 11 | 10 |
| Language and audio | 12 | 7 |

---

## What is live (the game on `main`)

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
