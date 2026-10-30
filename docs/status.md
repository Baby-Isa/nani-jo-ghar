# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (30 Oct 2026, 17:00 UK):** Sprint 15 is open (`docs/sprints/S15-cook-game-by-game.md`): Cook game by game, chai
first as the reference for the shared fixes; Zafar plays each game before the next. His 30 Oct play is
`docs/feedback/cook-s14-play-2026-10-30.md` (every point a row). `main` is unchanged since Sprint 14 (639e126).

**Chai, built on the branch (not on `main`), the contract run green at L1-L4 x four sizes (s15-chai-1, -2):**
- SH-171: the order's rows wait as dashed slots until each is said; a landed row never waits again (`mission.landed`).
- SH-172 (+ CHAI-40): an item step's call waits for Nani's helper card and is said as it opens; a control's call is unchanged.
- SH-163: the big card shrinks (one even scale) as it moves, stays on the row until the row card is drawn, then fades (filmed).
- SH-165: the helper's side card: the speaker at the right, its gap the row card's speaker-to-foot gap (7 px at 740x320, measured).
- SH-141: no ripple on the hand anywhere (css/shared/onboard.css).
- CHAI-50: a re-entry that could leave a second light closed; **his exact case is not reproduced** (follow-the-light script, four
  orders): ask him how he reached it when he plays chai.
- New checks: contract-87 (one light), -88 (no item before it is said, the first giving only), -89 (helper call as the card opens);
  fixed: contract-74 on lab pages, -36's window, -89 on lit control calls.

**The judges (s15-chai-ev, -ev2, -ev3; verdicts collected, not applied):** SH-171 FAIL at L2 740x320 (fixed since: a landed row was
hidden again; re-judge with s15-chai-ev3); SH-163 FAIL: at 930x430 a faded big card and the row card both show (the landing fade
caught by the 250 ms strip) and samosa's card flies below the viewport (its row off screen); CHAI-50, CHAI-40, SH-165, SH-172
EVIDENCE: the probes need timelines (light layers per frame; call vs card-open times) and L2-L4. Flaws they saw: at 1280x665 the
open helper card overlaps the item card under it; a done card cut at the helper row's left edge; at L4 930x430 a card cut at the
helper panel's foot; "Slow kar!" to check as a loan word.

**Next steps, in order:**
1. SH-163: land without two cards showing (swap at once on the drawn row, or scale to the row's box exactly); samosa's off-screen row
   (glide the row into view before the flight).
2. The helper card over the item card at 1280x665; the cut cards the judges saw.
3. Re-probe with timelines (a cmd probe: a follow-the-light player like the scratch `follow-light.mjs`, as a repo tool), re-judge.
4. Ask Zafar to publish chai (his play), with the question below; then pantry, daar, sekelo, maani, chaat, samosa.
5. The art: the list is `docs/design-language/art-plans/art-needed.md`; his pick for the run, then the plan and paste block.

**Open questions to Zafar:** on a replay of the order mid-play, should the cards blank and pop back as they are read again, or stay
and light up as read? (Recommend: stay and light up.) Mum's word order (`docs/questions.md`).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only, then `docs/sprints/S15-cook-game-by-game.md`. Continue Sprint 15 at the
> next step above. Work on branch `claude/nice-lovelace-0vfjcj`; `main` is the live site.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 50 | 91 |
| Cook: pantry | 9 | 10 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 15 / 4 / 7 / 2 / 1 / 4 / 8 | 23 / 14 / 27 / 12 / 22 / 17 / 33 |
| Clinic | 34 | 169 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 10 | 9 |
| Language and audio | 8 | 7 |

---

## What is live (the game on `main`)

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
