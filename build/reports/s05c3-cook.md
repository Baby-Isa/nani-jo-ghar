# S05-C3: Cook and shared fixes, judged independently (13 Oct)

Branch `ccr-a7370759-t0lee7`. Every verdict below is a Fable subagent's on the standard batch file (`judge: Fable, independent subagent`), or a machine expect; builder `NJG_BUILDER=S05-C3` on every run.

## What changed
- **Shared:** the end card sits over the play area and takes its page's width (`js/shared/results.js`, `css/shared/results.css`); the word tile's gloss shrinks then wraps; no tint class (decision 95); an ordered step list draws as the little skewer in a box, samosa kinds boxed, the stick only between pills (`js/shared/order-card.js`, `css/shared/order-card.css`).
- **Cook:** count badge on the pan's left rim, kept on screen; word pop inside the pan; tray badges inset; grill screen without the bowls; sekelo word over its bowl; no travelling light on the samosa fold; chop halves part, then fall.
- **Tools:** `--collect` takes a text-only row's PASS that cites its text capture (unit test); fast strip frames (CDP); the Cook player names the end card's page; the lab player steps through the steps page; force-passme lets her first ask run out; `shoot_ref.mjs`; about 15 probes fixed.

## Rows (red → green → verdict)
| Row | Red | Green | Verdict |
|---|---|---|---|
| SH-74 | 160829-92h | 161223-2i4 | PASS C |
| SH-75 | 161223-2i4 (FAIL 1) | 172804-m74 | PASS A/B |
| SH-76 | c3-labdaal-1 | c3-labdaal-2 | machine |
| SH-77 | 160829-92h | 161223-2i4 | machine |
| SH-39 | 162800-d91 | 172804-m74 (FAIL 1 at y9n) | PASS A/B/C |
| SH-53 | 162800-d91 | 165008-qsn | machine |
| SH-61 | (reworded to Zafar's words) | 170537-y9n | PASS A |
| SEK-03, SEK-17 | 162800-d91 | 171625-ng0 | PASS A/C/D |
| SEK-08 | 162800-d91 | 170537-y9n | PASS A |
| SEK-16 | 162800-d91 | 172804-m74 (FAIL 1 at y9n) | PASS A |
| SAM-05, SAM-18, SAM-19 | 162800-d91 | 170537-y9n | PASS A |
| CK-30 | 162800-d91 | 170537-y9n | PASS A |
| CHAI-19 | 170537-y9n | 172804-m74 | PASS A |
| CHAI-20 (judge's find) | 172804-m74 | 173942-geu | machine |
| PAN-05 | (probe moved) | 170537-y9n | PASS A |

Run ids are `ev-20261013-<id>`. Probes reaching their state (Task 2): MAA-14, CHAI-18, MAA-08 PASS; SH-17, SH-44, DAAR-21 machine PASS; CK-21, CHAI-08 (art), CK-27, DAAR-05 judged FAIL on now-reached states (not this round's fixes).

## For Zafar
1. SH-78 / DAAR-18: cook.md folds a card you can't act on in the current phase, so the chai card folds for the pour (red `164227-oez` frame 5). Recommend: keep a card open through its own dish's last step.
2. SEK-15: a learnt word's shelf chip is a speaker alone (word stages) vs Sidebar v3 "never a lone speaker". Recommend: keep the speaker chip.

## Open (not started, no strike)
CK-31, CK-32 (no driver serves a wrong cup), DAAR-22, DAAR-23 (the chop player misses under capture load), SH-69 (name bubble falls between captures; heard proven), DAAR-19, DAAR-20 (not reproduced). Tool note: `--apply` of an older run overrides a newer verdict.

## Final pass
(below)
