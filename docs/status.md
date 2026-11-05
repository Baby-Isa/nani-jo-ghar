# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every designed game in it (Zafar, 2 Nov: "for now I want to work towards launching all games in the launch"); Gujarati and his feedback rounds come in the next big phase, after the launch.

---

## Next chat

**Where things stand (5 Nov 2026, about 02:00 UK):** Sprint 17 is open (`docs/sprints/S17-chai-done-families.md`), **chai only** until
Zafar calls it done. His two overnight rounds are built, checked and published for his morning play (laptop, then phone):
`docs/feedback/chai-replay-2026-11-04-pm.md` (8 points) and `docs/feedback/chai-replay-2026-11-05.md` (11 points, his video on `main`:
`assets/20261105_004201.mp4`). Three art packs landed from his runs: s17-ps (the real stream), s17-art4 (the glass to the rim in chai
and plain tea, the white marble).
- **Built tonight:** the said card rolls up as the order passes (SH-180: a second redraw had thrown the glide away); the row stays on
  the last card until served, then home, then the fold, at every level (SH-206: L1's pour drew nothing); the next pan's light only
  once the first is served (CHAI-83); the pick-the-pan step never says pan 2's item at once (SH-205, his repro); the dots lesson every
  round for New player, its box the word's size (SH-196); Nani's box one height (SH-209: the arrow centred in her first row; SH-210:
  the panel never shrinks for the scrolling order list, his video); no snapping on the item row (SH-211, the L4 back-and-forth); the
  word moment: its scene before the kitchen (CHAI-85), the real stream from the spout's lip, no oval (CHAI-80), half 0.42 and full to
  the rim, the half and full cards from the same glass, plain tea for "dudh na" (CHAI-84); the white marble on every stove game (ART-40).
- **Checked:** `checks.mjs` green; every fix replayed in the sandbox with a frame-by-frame panel log (`NJG_INIT=<hook.js>`, a new
  run.mjs option) at L1-L4 and the four sizes; SH-210 red on last night's build, green on tonight's; the full chai set `s17-n5` (88 pages, every
  level, path and size): 0 contract breaks, 0 new findings (known kinds appended to the baseline). Live: 20261105T021953Z (3dd05c01). The publish gate was forced (150 old open rows; no contract or evidence record after the
  container restart): the judge has not looked at tonight's rows.
- **Open:** SH-212 (every next game loads in the background: before the stores).

**Next steps, in order:**
1. **His morning play** (chai L1-L4, laptop then phone): `/feedback` on his notes, rows the same day, fix, the panel-log replay
   (`docs/feedback/chai-replay-2026-11-05.md` §header has the method), publish.
2. **The judge on tonight's rows** once he is happy: an evidence run on the rows above (`evidence.mjs --run --rows ...`), then the
   judge (Fable). The probes that still miss (CHAI-67, -68, -75, -77 at 740x320, SH-201, SH-202, CHAI-74, SH-196's L3) as before.
3. **When he says chai is done:** the chai standard page (`docs/design-language/chai-standard.md`), `/review`, `/publish`, Sprint 17
   closed with `/sprint` (budget: three days planned, five used).
4. **Sprint 18** on his go: the stove family to chai's standard (`docs/game-design/families/stove.md`); they have the white marble already.

**Open questions to Zafar:**
1. The kettle sits close to the glass, so only a short stream shows above the rim: lift it so more of the fall shows?
2. Is chai done after the morning play?

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only (nothing else until a task needs it). Sprint 17, chai only: take my chai
> notes with `/feedback` and fix them until I call chai done; then the judge on the overnight rows, the chai standard page, `/review`,
> `/publish`, `/sprint` to close. Work on branch `claude/admiring-ptolemy-77fuv5`; `main` is the live site. Tell me before launching
> anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 67 | 103 |
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
