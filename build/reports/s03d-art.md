# S03-D: the art through the image API, cut and wired

Branch `ccr-a7370759-t0lee7`. Builder's notes; Fable reviewed every image. Game code: art hookups only (`daar.js` ladle/trivet constants, `flow.js` one condition, `boing.js` the close-up swap).

## Flaws first
- Kadchi handle foreshortened in the cut to clear the speed dial: a little stubby. Daar bowl a touch duller than the pot's daar.
- The served daar and the tadka trivet bowl still show beads (s02 B1/R4 art, not in this run).
- The comb on the belt is still rough (no art planned); Nani's moods (ART-10) wait on decision 71.
- Fever's opening shot shows her neutral; the faces are wired (`heal-art.json`) and the swap timing is the game's (C).

## What changed
Plan `docs/design-language/art-plans/s03-art-plan.md` (§5 tries and verdicts); `build/gen_s03.py` (gpt-image-2, high), `specs/s03.*`. **$3.35 of $60**, 12 calls.
- Sekelo served dish, no pepper (B1); matte daar bowl on its trivet (C10, DAAR-10); lengthwise two-colour plasters (E2); kadchi (DAAR-02); potato not butter (ART-11); the girl's hot, cold, sore, happy faces as masked edits of one body (CLN-65, FV10); tick rim cleaned (ART-16).
- Audit: s02 and heal-v3 all cut (unexplained: 0; other people's sheets wait, decision 71). Newly wired: U1-v2 upper arm in boing (review flaw 3), RO2 matte sore spots in taste, flat plasters for the belt's rough skin/blue ones (CLN-97). Not used by choice: RO2 decay/filling v2 (v1 wired, no comment from Zafar), `girl-stand-head-neutral` (cut by-product). ready:false left: 0.

## Proof
- `checks.mjs` unit 229/229, words 0, load 21/21; leak heal-b PASS; check_onboard ok.
- Sandbox `s03d-quick` (7 flows, 1366×768, one shot): all end, 0 errors, CHECK PASSED (0 new, 35 fixed). Own shots: boing, cut L3, fever; faces on the body. About 12 min of browser.
- Art rows 9 open → 2 (`statuscounts.mjs` agrees). Rows rechecked on the shots: DAAR-02, DAAR-10, CLN-65, CLN-97, CLN-98, CLN-99, CLN-104; the rest to `/review`.

QA: ART ✅ (ART-01/02/06/10 eye) · CUL ✅ · LAY ✅ lint · others untouched. Reviewer: Fable (art); `/review` for the rest.
