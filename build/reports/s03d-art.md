# S03-D: the art through the image API, cut and wired

Branch `ccr-a7370759-t0lee7`. Fable reviewed every image and the wired screens. Game code: art hookups only (`daar.js` constants and file names, one condition in `flow.js`, the close-up swap in `boing.js`).

## Flaws first
- The kadchi's handle is foreshortened so it clears the speed dial, which makes it a little stubby.
- The daar inside the pot (`pot-*.webp`) still looks like beads. It wasn't in this run.
- The comb on the belt is still rough: no art was planned for it.
- Nani's moods (ART-10) wait on decision 71.
- The fever game opens with her neutral face. The new faces are wired; when they swap in is decided by the game (Session C's code).
- In the lab page (not the game) the two-colour plasters show the old art and a faded debug bar sits over the stage, because the lab doesn't load `sheets.json`.

## What changed
Spend: **$4.48 of $60**, 16 calls. Every try and verdict is in the plan, `art-plans/s03-art-plan.md` §5.
- B1 sekelo dish with no pepper; C10 matte daar bowl on its trivet; E2 two-colour plasters split lengthwise.
- Served daar and the review's tadka bowl redrawn: no more beads that read as sweets.
- Kadchi ladle (DAAR-02); potato that no longer looks like butter (ART-11).
- The girl's hot, cold, sore and happy faces, made from one body (CLN-65). Hot no longer reads as crying.
- Tick rim cleaned (ART-16).
- Taste sore spots redrawn flat, in clear red, green and blue. The s02 lumps were held because they read as jelly sweets.
- Audit:
  - Every s02 and heal-v3 source is cut. The other people's sheets wait (decision 71).
  - Newly wired: the U1-v2 upper arm in boing, and flat plasters on the belt.
  - Not used, on purpose: RO2 decay v2 (v1 stays). Nothing left marked `ready:false`. 0 unexplained gaps.

## Proof
- `checks.mjs`: 229/229, 0 literals, load 21/21. Leak test (heal-b): PASS. `check_onboard`: ok.
- Sandbox `s03d-quick` and `s03d-daar` at 1366×768: every flow ends, 0 page errors, CHECK PASSED. Plus my own shots of boing, taste, cut L3 and fever. About 15 minutes of browser time.
- Art rows: 9 open → 2 (`statuscounts.mjs` agrees). Rechecked on the shots: DAAR-02, DAAR-10, CLN-65, CLN-97, CLN-98, CLN-99, CLN-104. The rest go to `/review`.

QA: ART ✅ · CUL ✅ · LAY ✅ (lint). Reviewer: Fable for the art; `/review` for everything else.
