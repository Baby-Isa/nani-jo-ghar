# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every designed game in it (Zafar, 2 Nov: "for now I want to work towards launching all games in the launch"); Gujarati and his feedback rounds come in the next big phase, after the launch.

---

## Next chat

**Handover branch:** `ccr-9f26f7e3-ytvg4h` (the newest handover is here; `main` may be a step behind).

**Where things stand (Sat 7 Nov 2026, ~14:30 UK):** Sprint 17, closing. **Chai is signed off** (Zafar, 7 Nov); **live on
`main`: 20261107T120301Z**. The weekend plan is approved ("yes to all", decisions 1-13): `docs/sprints/S17-chai-done-families.md`
("Chai signed off" onward) and `docs/sprints/S18-kitchen-family.md` (renamed at ~14:00: the family is **"Make in the kitchen (a
recipe)"**, every Cook game except the pantry; chaat and chop in it); the review's addendum in
`build/reports/game-rollout-plan-review-2026-11-07.md`. **The standard takes Zafar's locked 5 Nov structure**
(`build/reports/s17-standards-structure-v2.md`) as the folder docs/design-language/standard/. Nothing is launched yet. Target:
every kitchen game's first pass live on `main` by **Mon 9 Nov 07:00 UK**. Up to eight builders at once.

**Next, in order:**
1. **Chai's frozen run** (the orchestrator, the first browser job): the contract L1-L4 at the four sizes, one film per level, one
   child-pace pass, his ear items as judge rows with sound logs. The guard for everything after.
2. **Sprint 17's eight builders, no game code** (S17 file, "The rest"): five standard builders by domain (Opus, high, $8-12 each:
   0+A+C; B; D; E with the glossary and values; F+G+H with the patterns), each writing its pages and placement fragment; the
   per-game-data check builder (Opus, high, $15-20); the three missing checks + SH-232's (Sonnet, high, $10-15); `audit.mjs
   --standard` reading the rule rows (Sonnet, high, $8-12). About $90-130.
3. **Stitch the folder** (per-page limits in `docs.mjs`; `chai-standard.md` a pointer); **the mechanical ID check** (every ledger
   change and old-page ID placed once; the dropped list for Zafar, blocking nothing); Fable reviews the fill once; **the module
   map** from F1.
4. **Close Sprint 17** (look back, plan.md chain row); one push to `main` of tools and docs, the game unchanged. Not a gate.
5. **Sprint 18, in a new chat** (the prompt at the end of the S17 file), per its file: wave 1 Sat 18:00 (chai's owner, five kit
   builders, the shelf and pills in the shared kit, chop, the prototypes' prep); wave 2 Sun 08:00 (one builder per game, each
   writing `standard/gaps/<game>.md` rule by rule first); wave 3 Sun 20:00 (merge, audit, films, Fable's batches, publish on his
   word, handover with his play list). Progress table every half hour.

**Open questions to Zafar (none blocking):** 1. the skies' four (the night ceiling, the day square, the two farm sky-only redos);
2. the tongue depressor's brown; 3. ART-59, the wide-door counter (a placeholder for now); 4. the dropped list, once made.

**Starting prompt for the new orchestrating chat (the rest of Sprint 17):**
> First `git fetch origin ccr-9f26f7e3-ytvg4h` and work from that branch (it holds the newest handover; `main` is the live site).
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only, then `docs/sprints/S17-chai-done-families.md` ("Chai signed off"
> onward), `docs/sprints/S18-kitchen-family.md` and `build/reports/s17-standards-structure-v2.md` (the standard's locked
> structure); open nothing else until a task needs it. Zafar approved the plan on 7 Nov ("yes to all", decisions 1-13): launch
> without asking again, state model, effort and cost per launch, progress table every half hour. Start with chai's frozen run,
> then Sprint 17's eight builders with `/brief` (disjoint files; the five standard builders by domain, writing the folder
> docs/design-language/standard/), stitch the folder, run the mechanical ID check, have Fable review the fill, write the module
> map, close Sprint 17 and push its tools and docs to `main`. End by updating the handover (`/handover`) and telling Zafar to open
> a new chat with the prompt at the end of the Sprint 17 file ("When Sprint 17 is done"), which starts Sprint 18 the same evening.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 109 | 98 |
| Cook: pantry | 9 | 10 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 26 / 4 / 7 / 2 / 1 / 4 / 13 | 27 / 14 / 27 / 12 / 22 / 17 / 34 |
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
