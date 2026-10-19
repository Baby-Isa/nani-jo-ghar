# s08 wave 5B, the clinic II (builder report; not judged)

Branch `worktree-agent-a2338681d97f9f59b` from b5a2495a, not pushed. Detail: `s08-w5b-clinic/details.md`. Shots: `build/screenshots/s08-w5b/` (PNG).

## Flaws first

| # | Flaw |
|---|---|
| 1 | Load check: four s08b pictures are over 3x their drawn size (bud, flat thermometer, paper fan, bottle). They need smaller cuts. |
| 2 | Foot: faint light arcs at some elbows. The welt shows narrower than the channel you can play in. |
| 3 | The s08b blanket is blue and hers is red, so the bed keeps the old red fleece. The bottle is tinted teal to match hers. |
| 4 | Outside my files: `js/clinic/pipeline.js` fell back to the parked scrape and crashed the morning. It now uses the first live ailment. |
| 5 | Eye L1 reads three rows: with two, the leak bot wins 10.4%. |
| 6 | Eye at 800x360: the pills cover the board's bottom frame. |
| 7 | Not done: the doctor's shadow (waits on Zafar). The ice pack stays off. Her hot-face sweat reads like tears. |
| 8 | No evidence probes or judge run. Browser time was about 25 minutes. |

## What changed

Fever CLN-175 to 178 and 105. Eye CLN-186 to 189. Foot CLN-190 to 194. Taste CLN-195 and 196. Knee CLN-179. The scrape is parked (CLN-172). A seated patient casts no foot shadow (CLN-162). One line each in details.

## Proof

| Check | Result |
|---|---|
| `checks.mjs` (unit 392, words, static, leak, bump, specs, docs) | ok |
| Sandbox `s08-w5b-quick`, 7 flows at 1366 | contract passed, 0 new findings |
| Load check: fever, taste | fail (flaw 1) |
| Load check: eye, foot, knee, morning | ok |
| Red then green | CLN-189: the half lemon reads orange. CLN-172: the old data has 2 ailments on the scrape, now 0. |
| Filmstrips | fever, foot and eye L1 to L3; the chart at 1366 and 800x360; taste L3 blue spot; knee L3, eight wraps, x2 |
