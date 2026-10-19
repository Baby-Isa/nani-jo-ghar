# s08-w4b-chai (builder's report, not judged)

Branch `worktree-agent-a1a00f6d36b562e9a`, not pushed. Detail: `build/reports/s08-w4b-chai/details.md`.

## Flaws first
| # | Flaw |
|---|---|
| 1 | CP1's tilts don't register on the s08b pan (another pan), so the hob's own picture turns in code, 4 steps of 20°. Zafar's fallback, a half-turned s08b picture, is art still to draw. |
| 2 | At 800x360 the turned pan is drawn about 0.7 of its size; its handle nearly meets the top edge. |
| 3 | Water, leaves, boils, foam and spiced are v3 pictures cut to the s08b rim: a slight colour step from s08b's milk and black. |
| 4 | Older, still there: simmer bubbles drawn in code (CK-06); the black-tea glass is side-on. |
| 5 | The hob pan turns -40°, so its light comes from the left. |
| 6 | CK-45 still red (contract-21 on #mistake): the act isn't logged in flow.js (not my file). contract-22 and 37 breaks too, outside what changed. |
| 7 | The shared tally and INT-16 say it "never takes a tap": P34 overrides both; they need amending. |
| 8 | Pan-tap take-back removed: the badge is the one way. |

## What changed
| Row | Change |
|---|---|
| CHAI-08, CHAI-26 | s08b pans on the hob; the same pan pours, the chai following, the shared stream |
| CHAI-19 | the word centred over the pan, above the badge |
| CHAI-22 | milk, water, tea once each |
| CHAI-24 | "Slow kar" at the green |
| CHAI-25 | a ring glow on the rim |
| CK-TB-01 | a badge chip takes one out, until poured |
| checks | contract-70, contract-71 |

## Proof
| Check | Result |
|---|---|
| contract-70/71 | red on the old behaviour (4 breaks), green after |
| `checks.mjs` | unit 406, words, static, leak, bump, specs, docs ok; load check ok |
| touched, 1366x768 | 22 pages end, 0 new findings |
| filmstrips | `build/screenshots/w4b/`: pour-1366x768-milky-top-black-bottom, pour-800x360-milky-final, pour-800x360-black (before the fit fix), word-bubbles-1366x768, ring-glow-1366x768, takeback-by-badge-1366x768 (.png) |
