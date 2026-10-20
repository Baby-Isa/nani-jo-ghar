# s08c art landing (20 Oct)

27 of the 28 images landed (AL3, Ali impatient, is missing). 21 pass, 3 go to a redo (DS1, CP3, CP4) and the real people wait on Zafar's likeness call (the doctor's three-quarter set DW2, DT2, DB2; the girl's close-ups GZ1-GZ4). The full table, the cut notes and the rows each pass unblocks are in `build/reports/s08c-art-landing/details.md`; the redo is `docs/design-language/art-plans/s08c-redo-block.txt` (4 lines).

## Proof

| Check | Result |
|---|---|
| Files | the dump on main (075aaec7) copied to `sources/art/s08c/` under the run spec's save-as names |
| `artjudge.py` | 14 pass, 10 flag (each looked at: grey steel and glass keyed against grey), 3 fail (the doctor's skin against the sheet swatch; consistent with his wired set, overridden) |
| Redo block | `artblock.py --check`: 28 lines, every prompt in the plan |
