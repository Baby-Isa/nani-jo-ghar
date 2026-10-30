# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (30 Oct 2026, 06:20 UK):** Sprint 14's roll-out is running without Zafar (plan `docs/sprints/S14-rollout-plan.md`;
his 30 Oct words: "run everything autonomously without me till publish; fix all code-fixable issues first").
- **Done:** phase A (chai's finish, verified by film; fixed CHAI-42 again, the pour's lit box, CHAI-48 the next person's bubble
  over Nana) and phase B (the checks builder `s14-tools`, merged; its checks found CHAI-49, the third pan's knob unlit, and four
  more, all fixed). Report: `build/reports/s14-rollout.md` (phases A and B), `build/reports/s14-tools.md`.
- **Live on `main`** (fe1117ee, 20261030T061035Z): chai with every fix above; the other games unchanged.
- **Running:** two in-chat builders in their own worktrees, never pushing: `s14-cook` (Opus, high, about $60-90: every Cook
  station on the new kit, port 8887) and `s14-clinic` (Opus, high, about $60-90: every heal game, port 8888), hard stop 12:00 UK,
  each writing its report (s14-cook, s14-clinic) under build/reports. A check-in is scheduled for 12:05 UK.

**Next steps, in order (the plan's section 5 checklist at every merge):**
1. Phase D: merge s14-cook, then s14-clinic (one at a time; `git merge --no-ff` of each worktree branch); after each: checks.mjs,
   the contract run on that area's flows at the four sizes (#speed1 for timing rows), films of each changed order, the replay.
2. Evidence specs for the 29-30 Oct rows still without one (SH-161 to 166, CHAI-40 to 49), then `evidence.mjs --run` and one
   judge per batch (`--judge`, the `judge` agent), `--collect`, `--apply`; fix what fails.
3. `/publish --force` (decision 3), the report's phase C-D sections, Round 3 lessons, this handover, a note to Zafar with his play list.

**Open questions to Zafar:** none blocking; Mum's word order (`docs/questions.md`).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only, then `docs/sprints/S14-rollout-plan.md` section 5 and
> `build/reports/s14-rollout.md`. Continue the Sprint 14 roll-out at phase D without Zafar: merge, check, judge, publish, report.
> Work on branch `ccr-dfbb763e-fd6lh9`; `main` is the live site.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 45 | 94 |
| Cook: pantry | 5 | 10 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 13 / 4 / 4 / 2 / 1 / 3 / 8 | 24 / 14 / 28 / 12 / 22 / 18 / 33 |
| Clinic | 33 | 169 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 9 | 9 |
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
