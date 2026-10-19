# s08 wave 5B, the clinic II (builder report; not judged)

Branch `worktree-agent-a2338681d97f9f59b` from b5a2495a, not pushed. Detail: `s08-w5b-clinic/details.md`. Shots: `build/screenshots/s08-w5b/` (PNG).

## Flaws first

| # | Flaw |
|---|---|
| 1 | Foot: the welts are now one continuous line each, but show square corners where the path turns, not the art's elbow. The splinter shows inside. |
| 2 | Outside my files: `pipeline.js` falls back to the first live ailment (accepted). `main.js` lets a lab page ask for the parked scrape, so the clinic:cut load page passes. |
| 3 | Four `-sm` copies, scaled down from the s08b cuts, sit beside them in assets (bud, flat thermometer, paper fan, bottle). |
| 4 | The bed keeps the old red fleece, because the s08b blanket is blue. The bottle is tinted teal to match hers. |
| 5 | Eye L1 reads three rows: with two, the leak bot wins 10.4%. |
| 6 | Fever: her hot face (W5) has clear sweat drawn on the forehead. The blue drops were code; they read as tears, so they are gone with her art on. For the next art run: no blue drops. |
| 7 | Not done: the doctor's shadow (waits on Zafar). The ice pack stays off. |
| 8 | No evidence probes or judge run. Browser time was about 30 minutes. |

## What changed

Fever CLN-175 to 178 and 105. Eye CLN-186 to 189. Foot CLN-190 to 194. Taste CLN-195 and 196. Knee CLN-179. The scrape is parked (CLN-172). A seated patient casts no foot shadow (CLN-162). After the orchestrator's look: the welts drawn whole and stopped at the photo foot's edge; the eye's board smaller, so the pills clear it at 800x360; the smaller copies.

## Proof

| Check | Result |
|---|---|
| `checks.mjs`: unit 392, words, static, leak, bump, specs, docs, size, load 29/29 | ok |
| artcheck | 471 known, 0 new |
| Sandbox `s08-w5b-quick`, 7 flows at 1366 | contract passed, 0 new findings |
| Red then green | CLN-189: the half lemon reads orange. CLN-172: the old data has 2 ailments on the scrape, now 0. |
| Filmstrips | fever, foot and eye L1 to L3; the chart at 1366 and 800x360; taste L3 blue spot; knee L3, eight wraps, x2 |
