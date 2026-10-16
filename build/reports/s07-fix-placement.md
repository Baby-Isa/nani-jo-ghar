# s07 fix: CLN-154, the doctor and the girl in one plane

In the stand room (the L3 check-up) the doctor and the girl now share one feet line; he is 1.44x her and her crown is at his chest. In the seated exam his feet are on the step stool's line (0.84), 0.76 tall, the most the phone's cropped top allows. The send-off is unchanged.

The WIP (56d04cd5) shrank her (body 0.55, was 0.586), so her tap targets were 6% smaller (CLN-93, CLN-09). Her body is now 0.59, his height 0.85 and the feet line 0.91. On a phone the sizes are the same and the feet line is 0.95. The `plane` static check also fails a body under 0.586: red on the base and the WIP, green now.

Checked:
- `has-art` is set on the `.cl-fig` root, so the standing lift really goes. The measured transform is `none` (before: -6%).
- Her turn and talk views have fig_h 600, the same as `stand.fig_h`. So the send-off draws at the same size as before. Its shots differ by 0 to 48 px.

Flaws: on a phone her sandals are 8 px from the bottom edge. In the exam his crown is 8 px under the cropped top.

## Proof

Shots in `build/reports/s07-fix-placement/` (`before-*` and `after-*`, for `exam`, `stand` and `door` at 800x360, 844x390 and 1366x768), plus `after-sandbox-morning-L3-stand-{800x360,1366x768}.png`. Shares are of the room.

| room, size | feet: her / his | his height ÷ hers | his crown | hand tap (px) |
|---|---|---|---|---|
| stand 1366x768 | 0.822 / 0.92 → **0.91 / 0.91** | 1.13 → **1.44** | 0.26 → 0.06 | 23.7 → 23.9 |
| stand 800x360, 844x390 | 0.856 / 0.95 → **0.95 / 0.95** | 1.43 → **1.44** | 0.11 → 0.10 | 12.3 → 12.4 (13.2 → 13.3) |
| exam (all three sizes) | his 0.90 → **0.84** (stool foot line 0.82 to 0.84) | his height 0.66 → 0.76 | 0.24 → 0.08 | her seated art unchanged |
| door (all three sizes) | 0.822 / 0.88, unchanged | 1.52, unchanged | 0.24 | unchanged |

The sandbox run of `clinic:diagnosis`, `clinic:diagnosis@L3`, `clinic:morning@L3` and `clinic:sendoff` at 800x360 and 1366x768 (`--check --no-sheets`): 8/8 pages reached their end, the contract passed with 0 breaks and there were 0 new findings. `checks.mjs --only unit,static,leak,load`: all ok (336 unit tests pass, 0 new static findings).
