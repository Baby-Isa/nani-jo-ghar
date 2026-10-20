# s08 wave 6N, the clinic (builder report; not judged)

Branch `worktree-agent-ae7f05d9a817ae20a` from df3be32d, not pushed. Game code changed: yes (js/clinic, data/clinic, css/clinic.css).

## Flaws first

| # | Flaw |
|---|---|
| 1 | ART-19: the eye test's close-up has no talk or blink frame (art). Only the doctor's card face talks. |
| 2 | CLN-163: the room's girl is drawn, the close-ups are photo-style: the hand-over is a dissolve (art, ART-22). |
| 3 | CLN-23: the stethoscope is its top-down photo, foreshortened (no lying-flat art). The probe's belt moment had no stethoscope. |
| 4 | CLN-178: the end card's crop catches the shared results mid-reveal (js/shared). |
| 5 | 800x360 eye: the pills touch the board's foot. |

## What changed

| Rows | Change |
|---|---|
| CLN-107 | Misread + haa: shake, the doctor's bubble (his face, the row's pictures) stays up, the dropper comes at once. Her lines chain (none under another; "I can see!" after her reading). Eye-test button from the close-up's start (L2+). |
| CLN-188 | Split 200, wall board widened: the board takes most of the play area. |
| CLN-163 | One camera: no blur, the room hands over in the last tenth, the close-up's room runs past its box (no white corners). |
| CLN-106 | `def.why.goalAfter`: boing's "Time for the jab" headline is set and said after the wipe. |
| SH-112 | Fever tile wider, under the gauge on phones and tablets. |
| CLN-23 | Stethoscope foreshortened on the belt. |
| ART-19 | `Kit.cardTalk`: the doctor's card face flaps neutral/talk while he speaks. |
| test | Clip test over every heal line said by key (passes; the bug was timing). |

## Proof

- Red: ev-20261020-073941-0e9. Green candidate: ev-w6n-green (38/38 pages reach end, 0 page errors, every probe reached).
- CLN-195 tip blue, CLN-178 L3 face whole: in its captures. Scratch strips: tooth/eye zoom, eye misread at L2-L3, fever at 3 sizes.
- Voice: each line plays only its own clips.
- Contract (w6n-boing, boing L1/L3 at two sizes): contract-1 clean after the late-goal pop-up fix; contract-5 (badges at once) breaks everywhere, Cook too: shared, not this wave.
- checks: unit 447/0, words 0, static 0 new, leak 19, bump, specs, docs ok.
- Regression rows (189): left to /review.
