# S03-D: the art through the image API, cut and wired

Fable reviewed every image and the wired screens. Code: art hookups only (`daar.js`, `flow.js`, `boing.js`).

## Flaws first
- Kadchi handle foreshortened to clear the dial: a little stubby.
- Still open: beady daar in the pot (`pot-*.webp`, not in this run); the rough belt comb (no art planned); Nani's moods (ART-10, decision 71).
- Fever opens on her neutral face: the new faces are wired, the swap timing is Session C's code.
- Lab page only: old two-colour plasters (no `sheets.json` there) and its own faded debug bar.

## What changed
**$4.48 of $60**, 16 calls; tries and verdicts in `art-plans/s03-art-plan.md` §5.
- B1 sekelo dish with no pepper; C10 matte daar bowl on its trivet; E2 two-colour plasters split lengthwise.
- Served daar and tadka bowl: no more sweet-like beads.
- Kadchi ladle (DAAR-02); potato that no longer looks like butter (ART-11).
- The girl's hot, cold, sore, happy faces from one body (CLN-65); hot no longer reads as crying.
- Tick rim cleaned (ART-16).
- Taste spots redrawn flat in clear red, green, blue (the s02 lumps read as jelly sweets).
- Audit: all s02 and heal-v3 sources cut (other people wait, decision 71); newly wired U1-v2 arm (boing), belt plasters; RO2 decay v2 unused on purpose; `ready:false` left 0; unexplained gaps 0.

## Proof
- `checks.mjs`: 229/229, 0 literals, load 21/21. Leak test (heal-b): PASS. `check_onboard`: ok.
- Sandbox `s03d-quick`, `s03d-daar` (1366×768): all end, 0 errors, CHECK PASSED; own shots of boing, taste, cut L3, fever. About 15 min.
- Art rows: 9 open → 2 (`statuscounts.mjs` agrees). Rechecked: DAAR-02, DAAR-10, CLN-65, CLN-97, CLN-98, CLN-99, CLN-104; the rest to `/review`.

QA: ART ✅ · CUL ✅ · LAY ✅ (lint); Fable for art, `/review` for the rest.
