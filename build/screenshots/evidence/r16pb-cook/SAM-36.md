# SAM-36 (open) · Cook: samosa

**Issue:** The served tray shows as many samosas as were ordered: "ba samosa" is two on the tray (the S19 gate's eye judge, 12 Nov: "three samosas are served for an order of two")

**Check:** auto: samosa at L1, L2, L3 and L4, 740x320 and 1280x665 (the served tray holds the ordered count)

**Source:** the S19 gate, 12 Nov

**Status now:** to fix: check (built: js/cook/serve.js plan draws single samosas when the plate picture (shows 3) is another count, data/cook.json samosa-one; js/cook/flow.js's table the same; to judge)

## Probes

- SAM-36-p1-L1-1280x665: cook:samosa L1 @ 1280x665 [p-fresh], at served: reached 1x (life:serve-trays 50.2s) · the served tray holds as many samosas as were ordered ('ba samosa' is two)
- SAM-36-p1-L1-740x320: cook:samosa L1 @ 740x320 [p-fresh], at served: reached 1x (life:serve-trays 56.2s) · the served tray holds as many samosas as were ordered ('ba samosa' is two)
- SAM-36-p1-L2-1280x665: cook:samosa@L2 L2 @ 1280x665 [p-fresh], at served: reached 1x (life:serve-trays 74.9s) · the served tray holds as many samosas as were ordered ('ba samosa' is two)
- SAM-36-p1-L2-740x320: cook:samosa@L2 L2 @ 740x320 [p-fresh], at served: reached 1x (life:serve-trays 94.0s) · the served tray holds as many samosas as were ordered ('ba samosa' is two)

## Panels (`build/screenshots/evidence/r16pb-cook/SAM-36.png`, `build/screenshots/evidence/r16pb-cook/SAM-36-2.png`)

- **A**: cook:samosa L1 1280x665 [p-fresh] · served: the screen, #game outlined
- **B**: cook:samosa L1 1280x665 [p-fresh] · crop:#game at life:serve-trays
- **C**: cook:samosa L1 740x320 [p-fresh] · served: the screen, #game outlined
- **D**: cook:samosa L1 740x320 [p-fresh] · crop:#game at life:serve-trays
- **E**: cook:samosa@L2 L2 1280x665 [p-fresh] · served: the screen, #game outlined
- **F**: cook:samosa@L2 L2 1280x665 [p-fresh] · crop:#game at life:serve-trays
- **G**: cook:samosa@L2 L2 740x320 [p-fresh] · served: the screen, #game outlined
- **H**: cook:samosa@L2 L2 740x320 [p-fresh] · crop:#game at life:serve-trays

## Text captures

#### SAM-36-p1-L1-1280x665 · dom:#mission at life:serve-trays

```
Muke
ba
samosa
khapanta.
```

#### SAM-36-p1-L1-740x320 · dom:#mission at life:serve-trays

```
Muke
ba
samosa
khapanta.
```

#### SAM-36-p1-L2-1280x665 · dom:#mission at life:serve-trays

```
Muke
trae
samosa
khapanta.
```

#### SAM-36-p1-L2-740x320 · dom:#mission at life:serve-trays

```
Muke
trae
samosa
khapanta.
```
