# DAAR-46 (open) · Cook: daar

**Issue:** The stir never stops the child; its first time better (Zafar, 9 Nov, his tester: "And maybe it stops you. Actually, is that a good idea? Maybe it stops you if you stir it. No. But I think the onboarding for that needs to be better. It shouldn't stop you, because then people will just do it around until it stops them. And the game's done.")

**Check:** auto: daar and stir at L1, L2, L3 and L4: stirring past the count goes on until the child stops; a stop under or over the count is redone; the first time's light gone as the stir starts (SH-236)

**Source:** docs/feedback/kitchen-mocks-2026-11-09.md P8

**Status now:** to fix: check (built: s19-clean-c, s19-round2-review 1, the stir ends when the child lets go at or past the count, never under it; Mum's 'Stir it {n} times.' still a gap; to judge) (answered: build/reports/s19-waiting-on-zafar-audit.md) · cause: daar's stir ends by itself at the asked count (daar.js:1480, :1434-1437), the stir game on the first let-go once the count is reached (stir.js:398-410): stirring until it stops wins (non-negotiable 4); fix: it ends when the child stops (let go and a pause of about a second, as the roll's, roll.js:259-263), counted then; under or over redone (decision 51); the first time shows the move and the count, never an end; the end rule his call (decision 4); Fable's answers are in (build/reports/s19-fable-mock-answers.md §3: a pip lights per lap and Nani counts each aloud, "bas" at the number; it never stops the child; a ghost lap the first time)

## Probes

- DAAR-46-p1-L1-1280x665: cook:stir L1 @ 1280x665 [p-fresh], at stir-mid: reached 1x (rec:stir-mid 17.4s) · the stir's first time: its light gone as the stir starts; stirring goes on
- DAAR-46-p2-L1-1280x665: cook:daar L1 @ 1280x665 [p-fresh], at stir-mid: reached 1x (rec:stir-mid 35.4s) · daar's stir first time

## Panels (`build/screenshots/evidence/r16pb-newsh/DAAR-46.png`, `build/screenshots/evidence/r16pb-newsh/DAAR-46-2.png`, `build/screenshots/evidence/r16pb-newsh/DAAR-46-3.png`, `build/screenshots/evidence/r16pb-newsh/DAAR-46-4.png`)

- **A**: cook:stir L1 1280x665 [p-fresh] · strip:body:10x400 at rec:stir-mid
- **B**: cook:daar L1 1280x665 [p-fresh] · strip:body:10x400 at rec:stir-mid

