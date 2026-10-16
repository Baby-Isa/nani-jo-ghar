# s07-clinic-a: the real doctor everywhere, the girl's pieces, the send-off at the door

Branch `worktree-agent-ad9d80ef97823990a`, not pushed. The cut spec is `build/tools/art/specs/s07.cut.json` (artcut.py).

## What changed
| File | Change |
|---|---|
| `js/clinic/kit.js` | `Kit.doctorArt`, `doctorFace`, `DOCTOR_FACE`; `doctorFigure`: real views on one feet line, never mirrored, DF1 talk, DF3 blink, DD2 closed mouth; `Voice.say` drives any `[data-talker]` |
| `stages/common.js` | `S.doctor`; `S.pose` turns him |
| `waiting.js` | he stands waving by his door (DD1/DD2, CLN-115) |
| `diagnosis.js`, `screen.js` | the real doctor and his face |
| `sendoff.js` | the front door (CLN-25): she stands and turns to him (GN1-QL) and waves; he waves (DA6); the cards show her own heads |
| `figure.js` | her blink (GB1) and talking mouth (GM1) |
| `heal-art.json` | `doctor`; girl `life`, `stand.faces` (her sitting moods moved by scale 1.22, no wink), `stand.turns` |
| `cut.js`, `foot.js` | I1 dirt bits replace the discs (same rng draws) |
| `knee.js`, `tooth.js`, `foot.json` | I2 bump, TD1 drill view, RP1 sole at L1–3 |

## Proof
- Sandbox `s07a-laptop` (16 clinic flows, 1366x768) and `s07a-phone` (15, 844x390): all reach the end. 0 page errors. Contract and check PASSED.
- checks: unit, words, static, leak, bump, specs, size ok. load 29/29: it failed first on oversized face files, which I shrank.
- Evidence `ev-20261016-020858-397`: sheets for CLN-17, CLN-25, CLN-81 and CLN-136.
- shotdiff: the manifest is empty, so 308 shots are new and none could be compared.
- Grep: no old SVG or rough doctor is left.

## Not done
- DM1/DM2 are not wired. DM1 is tall: its levers come 40 units apart, not 56, too small on a phone (CLN-09) unless the syringe is moved. That is Zafar's call. The cut job is ready. DM2's glossy drops are not cut.
- RP1 is not colour-corrected (ΔE 7.4). The GN1 side views are unused.

## Rows (suggestions)
- To judge: CLN-150, CLN-25, CLN-115, CLN-17. Flaw for CLN-17: the shot catches him face-on (UX 16).
- To re-judge: CLN-01, CLN-81, CLN-136.
- Still open: CLN-137 (her GN1 face smiles), CLN-106 (boing layout).

Log: `16 Oct · s07-clinic-a · real doctor, door send-off, girl's pieces; DM1 waits on a layout yes`
