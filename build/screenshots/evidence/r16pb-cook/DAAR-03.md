# DAAR-03 (reopened) · Cook: daar

**Issue:** Stir shows speed and laps (speed dial, laps as Kutchi word) · told again 9 Nov (his tester): "I think those were the three. Oh, and I think the stir for Dar, sad. I really like the stirring mechanism. She just loves stirring it around. So I think we need to make it clearer, like, the number of times you're stirring it."

**Check:** auto: daar and stir at L1, L2, L3 and L4: each lap adds its mark within 300 ms of the flag; eye: at 930x430 the count readable at a glance

**Source:** docs/archive/feedback/cook-playtest-2026-09-29.md D7, Q10; docs/feedback/kitchen-mocks-2026-11-09.md P7

**Status now:** to fix: check (built: s19-clean-c, a gold mark per lap under the hob in the one stir; to judge) · reopened from the archive, told again 9 Nov (docs/feedback/kitchen-mocks-2026-11-09.md P7): the count is a Kutchi number word on a small white chip in the dial's lower half (daar.js:1292-1297), said as the ladle passes the flag and dropped while Nani speaks (daar.js:1447-1470); fix: the count clear on a phone: a mark per lap by the pot as its number is said, the same in daar and the stir game (one stir, DAAR-45; the stir game's ladle tally, stir.js:243); /review judges a shot (SH-116) · was: built (evidence PASS ev-20261020-203453-9h9); Fable's answers are in (build/reports/s19-fable-mock-answers.md §3: a pip lights per lap, counted aloud)

## Probes

- DAAR-03-p1-L1-1366x768: cook:stir L1 @ 1366x768 [p-seen], at stir-mid: reached 1x (rec:stir-mid 21.4s) · the stir shows speed (dial) and laps as a Kutchi word
- DAAR-03-p1-L2-1366x768: cook:stir@L2 L2 @ 1366x768 [p-seen], at stir-mid: reached 1x (rec:stir-mid 20.9s) · the stir shows speed (dial) and laps as a Kutchi word

## Panels (`build/screenshots/evidence/r16pb-cook/DAAR-03.png`)

- **A**: cook:stir L1 1366x768 [p-seen] · stir-mid: the screen, #stage outlined
- **B**: cook:stir L1 1366x768 [p-seen] · crop:#stage at rec:stir-mid
- **C**: cook:stir@L2 L2 1366x768 [p-seen] · stir-mid: the screen, #stage outlined
- **D**: cook:stir@L2 L2 1366x768 [p-seen] · crop:#stage at rec:stir-mid

## Text captures

#### DAAR-03-p1-L1-1366x768 · dom:#mission at rec:stir-mid

```
Muke
daar
khapeti.
hakri
dungri
one onion
char jaldi
four quickly
```

#### DAAR-03-p1-L2-1366x768 · dom:#mission at rec:stir-mid

```
Muke
daar
khapeti.
hakri
dungri
hakro
tameto
char aste thi
```
