# DAAR-46 (open) · Cook: daar

**Issue:** The stir never stops the child; its first time better (Zafar, 9 Nov, his tester: "And maybe it stops you. Actually, is that a good idea? Maybe it stops you if you stir it. No. But I think the onboarding for that needs to be better. It shouldn't stop you, because then people will just do it around until it stops them. And the game's done.")

**Check:** auto: daar and stir at L1, L2, L3 and L4: stirring past the count goes on until the child stops; a stop under or over the count is redone; the first time's light gone as the stir starts (SH-236)

**Source:** docs/feedback/kitchen-mocks-2026-11-09.md P8

**Status now:** to fix: check (built: s19-clean-c, s19-round2-review 1, the stir ends when the child lets go at or past the count, never under it; Mum's 'Stir it {n} times.' still a gap; to judge) (answered: build/reports/s19-waiting-on-zafar-audit.md) · cause: daar's stir ends by itself at the asked count (daar.js:1480, :1434-1437), the stir game on the first let-go once the count is reached (stir.js:398-410): stirring until it stops wins (non-negotiable 4); fix: it ends when the child stops (let go and a pause of about a second, as the roll's, roll.js:259-263), counted then; under or over redone (decision 51); the first time shows the move and the count, never an end; the end rule his call (decision 4); Fable's answers are in (build/reports/s19-fable-mock-answers.md §3: a pip lights per lap and Nani counts each aloud, "bas" at the number; it never stops the child; a ghost lap the first time)

## Probes

- DAAR-46-p1-L1-1280x665: cook:daar#speed1 L1 @ 1280x665 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 21.6s, visible:.njg-onboard 35.6s, visible:.njg-onboard 45.4s, visible:.njg-onboard 47.8s) · daar's stir: the shared stir, ending when the child stops, a mark per lap
- DAAR-46-p1-L1-740x320: cook:daar#speed1 L1 @ 740x320 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 19.7s, visible:.njg-onboard 30.9s, visible:.njg-onboard 45.0s, visible:.njg-onboard 47.9s) · daar's stir: the shared stir, ending when the child stops, a mark per lap

## Panels (`build/screenshots/evidence/r16pb-cook/DAAR-46.png`)

- **A**: cook:daar#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- **B**: cook:daar#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)

