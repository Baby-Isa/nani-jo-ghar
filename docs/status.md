# Nani jo Ghar: status

The orchestrator rewrites **Next chat** at every step end (`/handover`). Open questions for Zafar are in `docs/questions.md`.

**The end point:** the app is live on the stores with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once.

---

## Next chat

**Where things stand (30 Oct 2026, 20:45 UK):** Sprint 15 (`docs/sprints/S15-cook-game-by-game.md`): Cook game by game, chai
first as the reference. **Chai is live on `main`** (d7835a56, 20261030T203356Z) with Zafar's 30 Oct notes in two rounds
(`docs/feedback/cook-s14-play-2026-10-30.md`, `docs/feedback/chai-play-2026-10-30-evening.md`); the shared fixes reach every Cook
game. Chai: contract run 0 breaks over 32 pages (s15-chai-9), checks green, the judge PASS on SH-171, SH-172, SH-165, CHAI-40,
CHAI-50 (s15-chai-ev4 to -ev9; noted on the rows, not applied: shared rows close as each game passes). Published with `--force` on
his word (the other games' rows open, no full gate run). Nothing running. Tools added: `build/tools/review/lightfollow.mjs`,
`spkgap.mjs`; contract-87 to 89. Spent so far: about $130-150 (Opus, high), mostly chai and the tools.

**Next steps, in order:**
1. **Ask Zafar about his chai play**, these questions (numbered, his "yes to all except ..."):
   1. The pour quiet (no "milk and one sugar")?
   2. No old-style Nani box at the start; the start quicker?
   3. A second's pause after the last item before "Chulo bar!"?
   4. Nana's bubbles beside his head on the right, his face and body clear (his phone, about 915x275)?
   5. After the first two items, only the milk card lit? If yes: the item card's light becomes the rule in every game (SH-178).
   6. Nani's helper card short enough; the speaker gaps right?
   7. The big card into its row card: as good as the card lab now (one card shrinking, melting into the row card)?
   8. The cooker's dark tint and gold box (CHAI-50): seen again? If so: the level and what he tapped.
2. **His answers and notes → `/feedback`** (rows the same day); fix what chai still needs, film it, contract run, the judge,
   `/publish` on his word. When he says chai passes: record it in the sprint file, apply SH-178 everywhere.
3. **Then the pantry** (sprint step 2), the same way: PAN-19 (Nani gives the order in the kitchen), PAN-20 (word chips and
   speakers under the jars at L1), PAN-21 (the count pills bottom right), PAN-22 (the new player's light), SH-162 (her card opens
   on the hint), SH-141 (no ripple; taps by the light), PAN-01, PAN-04, PAN-10, PAN-13 where they still show. Causes are in
   `docs/feedback/cook-s14-play-2026-10-30.md` §2 (P7, P9, P11, P12, P13). Film it at the four sizes and 915x275, contract run
   (`lab:cook/fetch` L1-L4), lightfollow and evidence specs, the judge, then his play. In this chat, Opus high, about $10-20.
4. Then daar (DAAR-37 to 39: kinds 1-4, chops 2/4/6/8, garlic; the chop ends at the last chop; the knife-strip demo), sekelo,
   maani, chaat, samosa; Sprint 16 the clinic.
5. The art run: the list is `docs/design-language/art-plans/art-needed.md`; his pick, then the plan and one paste block.

**Open questions to Zafar:** the eight above. Mum's word order (`docs/questions.md`).

**Starting prompt for a new chat:**
> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only (nothing else until a task needs it). Ask me the chai questions in
> step 1 and wait for my answers; take my feedback with `/feedback`; then start the pantry (step 3). Work on branch
> `claude/nice-lovelace-0vfjcj`; `main` is the live site. Tell me before launching anything new.

## The fix list

Open rows are in `docs/process/regressions.md`; built ones in `docs/archive/regressions-done.md` (their checks still run). Numbers only; `node build/tools/review/statuscounts.mjs --write` rebuilds them.

| Area | Open or reopened | Built, not re-played by Zafar |
|---|---|---|
| Shared components (end screen, cards, onboarding, buttons, layout) | 56 | 91 |
| Cook: pantry | 9 | 10 |
| Cook: chai / maani / daar / chaat / samosa / sekelo / general | 17 / 4 / 7 / 2 / 1 / 4 / 8 | 23 / 14 / 27 / 12 / 22 / 17 / 33 |
| Clinic | 34 | 169 |
| First launch and shell | 0 | 2 |
| Other modes | 1 | 10 |
| Art | 10 | 9 |
| Language and audio | 8 | 7 |

---

## What is live (the game on `main`)

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
