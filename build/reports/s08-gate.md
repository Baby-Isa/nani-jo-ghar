# s08-gate: pre-publish gate (16 Oct 2026)

Base `d03a255b`; no game code changed. 574 pages, five chunks, `--touched --check`: all reach their end, 0 page errors.

**Flaws by eye, worst first.**
1. `first` story scenes: Nani leans on a bare brown block standing alone in the courtyard and living room; the chai pan hangs on the counter's wooden front, unshadowed; the chai glass floats by her shoulder. Pasted on (near CK-46).
2. Waiting room: the bench man and woman are chibi; the girl and boy are not.
3. `clinic:heal-extra-hic` 800x360: side card scrolls (the one NEW finding, 191>170); "hic!", "glug!", "BOO!", "pfff!" in play; a menu button cut at the top.
4. Single-word review card: empty left half with a divider.
5. Cook greeting pill "Thank you!" in Kutchi type (contract-16 passes it): confirm.

Good: the s08 doctor everywhere, 3q-left in the exam, one feet line, soft contact shadows; L2 phone tray clears feet; her sore face; Nani consistent in Cook, lineup, Find, Snap.

**Contract breaks.** Not new: contract-11 (1024 worktop), contract-16 (old modes, SH-92), contract-19 (recipe-daal L3), contract-21 (CK-45, daar mistake). Wobbled, passed on rerun: clinic contract-4 (fever), contract-21 (eye), `first` contract-1. The other 117 "new" findings equal the s07 gate's (baseline never updated).

**Evidence** `ev-20261016-194922-b8t`: 28 rows; 5 machine PASS, 0 FAIL; 8 tool failures (no spec); 15 for the judge.

## Proof
- Runs (`build/screenshots/sandbox/`): `s08-gate-clinic` 219, `s08-gate-other` 30, `s08-gate-cookday` 21, `s08-gate-cook` 229, `s08-gate-lab` 75; rechecks `s08-gate-recheck`, `s08-gate-recheck2`. Kept: `contract.md`, `summary.md`, `data/`, `sheets/changed.jpg`; PNGs deleted.
- Baselines: `approved-shots.json` did not exist; first recorded from these runs (single runs, after looking).
- Machine PASS: CLN-04, CLN-11, CLN-12, CLN-13, ART-13. No spec: SH-92, CK-45, CK-46, CLN-154, CLN-155, CLN-156, CLN-157, ART-22.
- Judge batches: `build/screenshots/evidence/ev-20261016-194922-b8t/judge/batch-01.md`, `batch-02.md`; index `build/reports/evidence-ev-20261016-194922-b8t.md`.
