# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (30 Oct 2026, 12:00 UK):** Sprint 14's roll-out is done and live, run without Zafar (his 30 Oct words: "run
everything autonomously without me till publish"). Report: `build/reports/s14-rollout.md` (phases A-D), with
`s14-tools.md`, `s14-cook.md`, `s14-clinic.md` and Round 3 in `s14-chai-lessons.md`.
- **Live on `main`** (639e1263, 20261030T114546Z): every Cook station and every heal game on the chai kit and the central rules
  (his numbers), chai's last fixes, the new checks; his fold rule (SH-169: a said order folds while the next person speaks, all
  open at play); the grill's L2-L4 that never finished (SEK-23); no word cut or split in a phone's order card (SH-170).
- **Proof:** the full contract run (156 pages; then 0 breaks over 26 pages on the final code), checks green, the judges: 20 rows
  built. Nothing running.

**Zafar's play (the next step):** `labs.html` with New player on: chai L1-L4, then each Cook station and each heal game at L1 and
L4, on the phone and the laptop; `/feedback` with his notes.

**Open, next sprint (rows in the fix list, each with its note):** MAA-19 (the first roti said in the headline gets no big card),
CHT-17 (chaat's ten jars' labels overlap at 740x320: his call), DAAR-36 (X as pieces? the light on the board), CLN-207 (the
doctor's line on his chest at 740x320), CLN-210 (the tooth's L1 line has no number), CLN-213 (a probe to check), SH-137 (the
morning's other stages keep the title bar), CHAI-42/48/49 and CLN-205 (evidence to aim). Known minor: samosa's guided strip glow
(contract-24, on main too); a card corner over a face circle for a frame (contract-83).

**Open questions to Zafar:** `docs/questions.md` "From the Sprint 14 roll-out" 1-4 (the L1 leak acceptance, the drag hand,
daar's dots, samosa's ticks); Mum's word order.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only. Sprint 14's roll-out is live (`build/reports/s14-rollout.md`). I've
> played it: here are my notes. Work on branch `ccr-dfbb763e-fd6lh9`; `main` is the live site. Tell me before launching anything new.

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

30 Oct 2026, published 11:50 UK (639e1263, 20261030T114546Z): the Sprint 14 roll-out (every Cook station and heal game on the chai kit and the central rules, the new checks, SH-169, SEK-23, SH-170); `--force` per decision 3, Zafar's 30 Oct go. Earlier the same morning: 02:35 (chai's finish) and 06:13 (the checks' fixes).

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
