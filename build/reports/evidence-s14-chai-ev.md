# Evidence run s14-chai-ev

Commit 682e5a89. 15 rows: 10 for a reviewer, 2 decided by the machine, 3 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 24 pages. Sheets and text: `build/screenshots/evidence/s14-chai-ev/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s14-chai-ev`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-161 | layout | 2/2 | TOOL FAILURE | (text only) | 0 |
| SH-162 | layout | 2/2 |  | `build/screenshots/evidence/s14-chai-ev/SH-162.png` | 2 |
| SH-163 | motion | 2/2 |  | `build/screenshots/evidence/s14-chai-ev/SH-163.png` | 2 |
| SH-164 | detail | 2/2 |  | `build/screenshots/evidence/s14-chai-ev/SH-164.png` | 2 |
| SH-165 | text | 1/1 | PASS: machine: pass (node build/tools/review/unit.mjs build/sandbox/s14checks.test.mjs: exit 0) | (text only) | 0 |
| SH-166 | motion | 2/2 |  | `build/screenshots/evidence/s14-chai-ev/SH-166.png` | 2 |
| CHAI-40 | layout | 3/3 |  | `build/screenshots/evidence/s14-chai-ev/CHAI-40.png` | 3 |
| CHAI-42 | layout | 2/2 |  | `build/screenshots/evidence/s14-chai-ev/CHAI-42.png` | 2 |
| CHAI-43 | motion | 4/4 |  | `build/screenshots/evidence/s14-chai-ev/CHAI-43.png` | 4 |
| CHAI-44 | text | 1/1 | PASS: machine: pass (node build/tools/review/loadtime.mjs --games chai-tray --runs 1: exit 0) | (text only) | 0 |
| CHAI-45 | layout | 4/4 | TOOL FAILURE | (text only) | 0 |
| CHAI-46 | detail | 2/2 |  | `build/screenshots/evidence/s14-chai-ev/CHAI-46.png` | 2 |
| CHAI-47 | layout | 0/2 | TOOL FAILURE | (text only) | 0 |
| CHAI-48 | motion | 2/2 |  | `build/screenshots/evidence/s14-chai-ev/CHAI-48.png` | 2 |
| CHAI-49 | layout | 2/2 |  | `build/screenshots/evidence/s14-chai-ev/CHAI-49.png` | 2 |

## Tool failures (3): for the tool owner, never a FAIL in regressions.md

- SH-161: SH-161-p1-L3-1280x665: shot at life:stage-start (hit 1): the screen is one flat colour at life:stage-start (nothing drawn yet) · SH-161-p1-L3-930x430: shot at life:stage-start (hit 1): the screen is one flat colour at life:stage-start (nothing drawn yet)
- CHAI-45: CHAI-45-p1-L1-1280x665: shot at life:stage-start (hit 1): the screen is one flat colour at life:stage-start (nothing drawn yet) · CHAI-45-p1-L1-1920x1080: shot at life:stage-start (hit 1): the screen is one flat colour at life:stage-start (nothing drawn yet) · CHAI-45-p1-L1-740x320: shot at life:stage-start (hit 1): the screen is one flat colour at life:stage-start (nothing drawn yet)
- CHAI-47: CHAI-47-p1-L4-1920x1080: the moment "phase:pour" never came; moments seen: page:start, life:order-level, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, cook:click, only:.njg-rq-card, bubble, life:say-end, life:pop-face, life:row-glide, rec:order-card-big, life:skip-zone, life:stage-start, life:decoys, life:row-home, life:order-skip, life:popup-fold, life:step-open, life:step-call, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:kind-tap, cook:tap, exp:cook-paani, cook-done:tap, life:act, life:step-close, life:chai-a

## EVIDENCE lines from the reviewers (the tool owner's list)

- SH-164: neither A (1920x1080) nor B (930x430) shows a lit box at all: the pan sits on a plain black burner with no highlight and no warm fill inside any box, only the heat gauge arc (green/yellow, white dot) and the flame triangles; the probe text claims "the knob lit" but the crop is the pan, not a knob, and the only capture is "contract-84: 0 breaks", no contrast number against the dark burner as the Check names. Off-point: no clipping, the "hakro" label in A is Kutchi; nothing else wrong in the panels. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- CHAI-46: A and B at L2 kind-timing show no heat gauge (no green area, no loading circle, no progress dot) on either pan, only a plain soft yellow glow halo round the left pan and a dim grey halo round the right, so whether the gauge draws over the handle cannot be seen; the capture is "contract-81: 0 breaks" with no gauge-over-handle figure. Off-point: A and B are the same probe moment yet the right pan differs (milky chai in A, dark leaves in B); the bottom row of round pictures is cut by the crop in both (crop, not layout clipping); the glow halo crosses the left pan's handle in both but at this size it cannot be told whether it sits over or under it. (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- SH-162: only cook:chai-tray is probed (A 1920x1080, 7 onboards; B 930x430, 5 onboards: the helper card's chevron is plain in every frame, no gold box or glow while the first-time dim comes and goes), but the Check names every game on the new kit and no other game is on the sheet (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- CHAI-42: both panels at rec:help-open show the grown-ups' "?" pop-up open (English there is allowed), not the order card's light; B's card is unlit with the side undimmed, A's side is dimmed over a still pan but a single frame cannot show the light waiting for the last move to end, and the sheet does not say what contract-79 measures (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)
- CHAI-49: A and B catch "Slow kar!" with the first pan's knob lit, not the third pan's "Chulo bar!" knob step the row names (the third pan is unlit in both), and only L4 is probed where the Check names L3-L4; contract-78 reads 0 breaks at L4 both sizes (Claude Fable 5.1 (claude-fable-5-1), session_014xb3kP6T7dmVAL7LekGAxz)

