# SAM-30 (open) · Cook: samosa

**Issue:** Samosa's fry has its first time: "there was no onboarding for the samosas especially when it came to placing them into the frying pan nothing told me or showed me how to place them into the frying pan" (Zafar, 8 Nov)

**Check:** auto: samosa at L1, L2, L3 and L4 as a new player: the dim and the box on a samosa and the pan, then on the lift

**Source:** docs/feedback/kitchen-play-2026-11-08.md P34

**Status now:** to fix: check (built: s19-clean-c, s19-clean-c2, knob, first-batch samosas and lift on Coach.control, contract-78 15 to 0; the fry's finger restored; to judge) · cause: the fry's coach runs once ever (samosa.js:190, coach.js:682) and its two steps (data/cook.json:6527) go on the knob (samosa.js:1144) and the first samosa; no first-time lights for the fry (the gate at samosa.js:506 is the fill's); fix: the fry's first time on the kit's lights: each samosa into the pan, then the lift on the green

## Probes

- SAM-30-p1-L1-1280x665: cook:samosa L1 @ 1280x665 [p-fresh], at exp:samosa: reached 1x (exp:samosa 41.2s) · samosa's fry as a new player: the dim and the lit box on each samosa into the pan (each one), then on the lift in the green
- SAM-30-p1-L1-740x320: cook:samosa L1 @ 740x320 [p-fresh], at exp:samosa: reached 1x (exp:samosa 46.2s) · samosa's fry as a new player: the dim and the lit box on each samosa into the pan (each one), then on the lift in the green
- SAM-30-p1-L2-1280x665: cook:samosa@L2 L2 @ 1280x665 [p-fresh], at exp:samosa: reached 1x (exp:samosa 61.9s) · samosa's fry as a new player: the dim and the lit box on each samosa into the pan (each one), then on the lift in the green
- SAM-30-p1-L2-740x320: cook:samosa@L2 L2 @ 740x320 [p-fresh], at exp:samosa: reached 1x (exp:samosa 80.9s) · samosa's fry as a new player: the dim and the lit box on each samosa into the pan (each one), then on the lift in the green
- SAM-30-p1-L3-1280x665: cook:samosa@L3 L3 @ 1280x665 [p-fresh], at exp:samosa: reached 1x (exp:samosa 56.0s) · samosa's fry as a new player: the dim and the lit box on each samosa into the pan (each one), then on the lift in the green
- SAM-30-p1-L3-740x320: cook:samosa@L3 L3 @ 740x320 [p-fresh], at exp:samosa: reached 1x (exp:samosa 70.2s) · samosa's fry as a new player: the dim and the lit box on each samosa into the pan (each one), then on the lift in the green
- SAM-30-p1-L4-1280x665: cook:samosa@L4 L4 @ 1280x665 [p-fresh], at exp:samosa: reached 1x (exp:samosa 67.8s) · samosa's fry as a new player: the dim and the lit box on each samosa into the pan (each one), then on the lift in the green
- SAM-30-p1-L4-740x320: cook:samosa@L4 L4 @ 740x320 [p-fresh], at exp:samosa: reached 1x (exp:samosa 85.0s) · samosa's fry as a new player: the dim and the lit box on each samosa into the pan (each one), then on the lift in the green
- SAM-30-p2-L1-1280x665: cook:samosa L1 @ 1280x665 [p-fresh], at exp:lift: reached 1x (exp:lift 44.4s) · the lift's first time: lit in the green (the hold keeps it there)
- SAM-30-p2-L2-1280x665: cook:samosa@L2 L2 @ 1280x665 [p-fresh], at exp:lift: reached 1x (exp:lift 66.6s) · the lift's first time: lit in the green (the hold keeps it there)
- SAM-30-p2-L3-1280x665: cook:samosa@L3 L3 @ 1280x665 [p-fresh], at exp:lift: reached 1x (exp:lift 61.2s) · the lift's first time: lit in the green (the hold keeps it there)
- SAM-30-p2-L4-1280x665: cook:samosa@L4 L4 @ 1280x665 [p-fresh], at exp:lift: reached 1x (exp:lift 72.3s) · the lift's first time: lit in the green (the hold keeps it there)

## Panels (`build/screenshots/evidence/r16pb-cook/SAM-30.png`, `build/screenshots/evidence/r16pb-cook/SAM-30-2.png`, `build/screenshots/evidence/r16pb-cook/SAM-30-3.png`)

- **A**: cook:samosa L1 1280x665 [p-fresh] · shot at exp:samosa
- **B**: cook:samosa L1 740x320 [p-fresh] · shot at exp:samosa
- **C**: cook:samosa@L2 L2 1280x665 [p-fresh] · shot at exp:samosa
- **D**: cook:samosa@L2 L2 740x320 [p-fresh] · shot at exp:samosa
- **E**: cook:samosa@L3 L3 1280x665 [p-fresh] · shot at exp:samosa
- **F**: cook:samosa@L3 L3 740x320 [p-fresh] · shot at exp:samosa
- **G**: cook:samosa@L4 L4 1280x665 [p-fresh] · shot at exp:samosa
- **H**: cook:samosa@L4 L4 740x320 [p-fresh] · shot at exp:samosa
- **I**: cook:samosa L1 1280x665 [p-fresh] · shot at exp:lift
- **J**: cook:samosa@L2 L2 1280x665 [p-fresh] · shot at exp:lift
- **K**: cook:samosa@L3 L3 1280x665 [p-fresh] · shot at exp:lift
- **L**: cook:samosa@L4 L4 1280x665 [p-fresh] · shot at exp:lift

## Text captures

#### SAM-30-p1-L1-1280x665 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p1-L1-1280x665 · contract-106 (contract)

```
contract-106: 0 breaks on this page
```

#### SAM-30-p1-L1-740x320 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p1-L1-740x320 · contract-106 (contract)

```
contract-106: 0 breaks on this page
```

#### SAM-30-p1-L2-1280x665 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p1-L2-1280x665 · contract-106 (contract)

```
contract-106: 0 breaks on this page
```

#### SAM-30-p1-L2-740x320 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p1-L2-740x320 · contract-106 (contract)

```
contract-106: 0 breaks on this page
```

#### SAM-30-p1-L3-1280x665 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p1-L3-1280x665 · contract-106 (contract)

```
contract-106: 0 breaks on this page
```

#### SAM-30-p1-L3-740x320 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p1-L3-740x320 · contract-106 (contract)

```
contract-106: 0 breaks on this page
```

#### SAM-30-p1-L4-1280x665 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p1-L4-1280x665 · contract-106 (contract)

```
contract-106: 0 breaks on this page
```

#### SAM-30-p1-L4-740x320 · contract-105 (contract)

```
contract-105 view-service 96.2s: the light [359,248,402,289] is round 53% of sv2-thali [352,241,410,298] (middle off by 1%, 2% of its size): it should sit whole round it
```

#### SAM-30-p1-L4-740x320 · contract-106 (contract)

```
contract-106: 0 breaks on this page
```

#### SAM-30-p2-L1-1280x665 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p2-L2-1280x665 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p2-L3-1280x665 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```

#### SAM-30-p2-L4-1280x665 · contract-105 (contract)

```
contract-105: 0 breaks on this page
```
