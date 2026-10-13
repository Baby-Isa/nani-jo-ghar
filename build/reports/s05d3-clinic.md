# S05-D3: clinic fix round (decision 96)

Branch `ccr-a7370759-t0lee7`. Every verdict below is an independent Fable subagent's, given only the standard batch file (`judge: Fable, independent subagent`); runs carry `NJG_BUILDER=S05-D3`.

## What changed
Rows split one claim each (CLN-123..142; CLN-100 and CLN-53 reworded to Zafar's 13 Oct heal ladder). Code (`js/clinic`, `css/clinic.css`, `data/clinic`): zoom-in seen 1.5 s; waiting ticks in one row; tooth gauge under the teeth; ear bottle nozzle down, wax help one drag with the tweezers and a blob, tile lit too; boing's end glows from L2, L1 card grows step by step; fever hint glow round the thing; diagnosis sad face (no wink); send-off L2 cards in a plain row; pharmacy review face; one tray look; placeholder bubble in the card's grey italic; plaster help ends when done (CLN-142); per-game audit table `build/reports/s05d3-clinic-audit.md`.

## Rows
| row | red | green | verdict |
|---|---|---|---|
| CLN-85, 90 | 160628-09d | 170427-3le | PASS (bubble under her mouth; one even row) |
| CLN-58, 101 | 164427-9cz | 3le / 171611-ac1 | PASS |
| CLN-87, 104, 105, 124, 126, 129, 132, 134, 135, 94, 86, 26, 64, 125, 120 | 163120-jp1 / 165312-6ns | 3le | PASS |
| CLN-130 | jp1 | 171950-ki1 | PASS |
| CLN-03, 53, 113, 128 | 3le (FAIL 1) | 173342-ny2 | PASS |
| CLN-22, 112 | 3le (EVIDENCE) | 174442-8et | PASS |
| CLN-142 | ny2 (page timed out) | 175553-umz | PASS |

## For Zafar
- **Two FAILs:** CLN-100 (3le: L1 3 bands; ny2: L3 closes at 4 turns, L2 turn events with no new band), CLN-133 (3le: ghost during the zoom; ny2: demos moves the player made during the zoom), CLN-136 (3le: calm face at "my leg hurts"; ny2: L2 beams at "A scrape"), SH-45 (3le: boing card up front; ki1: L1 second line not said: fixed after, unjudged). Sheets: `build/screenshots/evidence/<run>/<ROW>.png`.
- **Decisions:** CLN-123 (W3 boxes), CLN-131 (card fold, as SH-78), CLN-137 (neutral face: art), CLN-139 (patient card where she's on screen), CLN-127 (tail at her head is the shared above-the-head rule), CLN-45 (FAIL 1: ear L3 side, fever L3 fix step, parked games add two things).

## For C3
CLN-118 (Results: no badges for a taught round), CLN-138 (take-back driver: first undoable placement), CLN-141 (card line through rows), speaker ids in the voice timeline, capture lag on `every:bubble`, `checks.mjs` unit fail (order card recipe rows).

## Proof
Final gate `20261013-1756` (217 clinic pages, --check, resumed once): 1 stop (heal-ear#hint, caused by the wax help: fixed, both sizes re-run to their end); 1 new finding (fever 800x360 card scroll 235>230) and 4 contract-8 breaks (knee L2, taste, eye L2: card "next" row + tool glow), in code this round did not touch. Fast checks: words, bump, specs ok; check_onboard ok; leak bots clinic, heal-a, heal-b, heal-c PASS.
