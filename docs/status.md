# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (27 Oct 2026, morning UK):** Sprint 13 "One shared kit" is closed and published on `main` (958335e0, 20261027T040444Z, 27 Oct 04:07 UK; outcome and look back in `docs/sprints/S13-one-shared-kit.md`, verdicts in `build/reports/s13-verdicts/`). Every game now draws from one kit (cards, faces, buttons, finger, glow, bubbles, end screen, voice, save, loading), checked by one loop (`docs/architecture/evidence-loop.md` "The one loop"). Final replay (`s13-final2`: the 34 main flows plus chaat#hint at 1280x665 and 915x412): all 70 pages reached their end; 2 contract breaks, both samosa L3 (SAM-27, older; question 41). Final kit judge (`build/reports/s13-verdicts/s13-final-kit.verdicts.md`): 7 of 12 one look; the clinic's face, word card and order card still its own (SH-137), buttons unreadable (probe), first launch's end tick by design. Nothing is running.

**How we work now (Zafar, 26-27 Oct; CLAUDE.md):** the fast lane (small tweaks in this chat with the checks, one judge pass at the sprint's end); new ideas first behind a labs switch, rough, for Zafar to try; builders only for new mechanics or screens, design settled first; checks at 1280x665 (his laptop) and 915x412 (his Z Flip 5), every size only before the stores.

**Next steps:**
1. **Zafar plays Sprint 13** (his checklist below) and sends feedback: run `/feedback` on it, rows the same day; the fast lane fixes what blocks play, and spreads a fix made in one Cook or clinic game to the others (one kit now: fix once, check every game on the kit sheets).
2. **Answer questions 38-43** (`docs/questions.md`: the gold help box, phone rows, the end screen's empty half, samosa's ticks, clinic row pictures, his ear on "Muke …").
3. **Sprint 14 "Lock the principles"** (`docs/sprints/S14-lock-the-principles.md`, planned): plan with Zafar first: the seven areas (how an order arrives, what a level means, help, words and English, moving on, voice, the screen), how each is decided (a numbered list, then a check), and the chai-style order everywhere behind a labs switch first. Propose its budget and the first step before launching anything.
4. Zafar records at Masi's from `docs/language/recording-sheet.md`; the next art run (FC2 face moods, CHT-16, clinic row pictures) when he says.

**Phases after S13 (Zafar, 26 Oct; each a few sprints):** 1. lock the principles; 2. finalise each Cook and clinic game; 3. the book (very important) and the morning scene; 4. the farm trip; 5. the stitching (transitions, scenes, zooms).

**Zafar's checklist for Sprint 13 (Z Flip 5 and laptop, about 20 minutes):**
1. Chai and samosa at L3-L4, the clinic at L3: the order written in Kutchi when it comes; every row with a speaker at its left; nothing hidden for memory; English only on tap.
2. Chop, samosa, the eye test: the station within about a second of tapping the card, no light-brown screen.
3. On the phone: the customer's opening "Muke …" plays every order.
4. One look across Cook, the clinic, the door and first launch: glow, finger, faces, buttons, bubbles, "?" pop-up, end screen (known left-overs: SH-135, SH-136).
5. The eye test on the laptop: the help finger on the card step.
6. His saved player keeps its progress.
7. Feel: anything slower or odder than before.

**Open questions to Zafar:** 38-43 in `docs/questions.md`.

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only. Sprint 13 is live; I'll send my feedback on it. Then help me plan Sprint 14's principles. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 35 | 83 |
| Cook: pantry | 5 | 9 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 7 / 3 / 3 / 2 / 1 / 3 / 7 | 18 / 14 / 28 / 12 / 22 / 17 / 33 |
| Clinic | 29 | 164 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 8 | 9 |
| Language and audio | 8 | 7 |

---

## What is live (the game on `main`)

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
