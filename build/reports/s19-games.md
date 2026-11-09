# s19-games: faces on the serving place, eggs on the band, daar's heaps and katori, corn's green, the kit's stuck help

Opus, high. Branch `s19-games`. Flaws first.

## Flaws and open
- **CK-63's after run: machine FAIL, not on the pan** (the pan passes on all 16 pages). Its 9 breaks are the kit's lesson light on the first item card, short of the card's top where it runs under the face circle (phone sizes). Also contract-83 (eggs, 740x320).
- **Contract-102:** the probe's `s19lit` sample can lag a light by about 0.5 s, so a glow coming with its light can break. Delaying the glow broke contract-107 instead; reverted. Baking's pick glows with no light (`S$.step`, not mine).
- **SH-228:** eggs' probe waits for a `hint-glow` that no longer comes (only band things glow): use `hint-nani-says`. Daar's stir missed its hint once in six plays (contract-91).
- **CK-65's cmd spec** needs a script under `build/`: not run.
- **Not done:** daar's chop timer ring is still code-drawn (no picture: ART row). The stir lab has no reveal lessons (contract-98).
- **Out of scope:** the timed windows' look, DAAR-45, eggs' pot art (ART row), the grill art, the shelf angle, the counting rule, eggs' L1 length.

## What changed
1. **Faces from the first frame** on sekelo's two trays and daar's new katori (the daar is served into it).
2. **Eggs builds before it shows** (`selfBegin`). Greeting to order: chai 5.50 s, sekelo 5.39, eggs 5.35 (one shared flow).
3. **Daar:** chai's stone band; the chop's vegetables (wanted and decoys) on it, throws rising from there; each heap in a glass bowl (the "pink sprinkle"); heaps into the pot one at a time, its picture a share per heap.
4. **Eggs:** bowl and shakers on the band with chai's pills (canvas text 12 px, was 8); the pot 340 wide, clear of the pan; pot and pan lit on their bodies; the scene clear of the cog's column on a phone.
5. **DAAR-43:** a row's light and its tap area are its bowls, and the rows are 140 apart. **CK-61:** corn lights its parts. **CK-65:** corn's `greenMs` against chai's green, per level: L1 4500/4444, L2 3400/3333, L3 2400/2333, L4 2000/2000 ms. The cob is ready from the start of the green.
6. **The kit's lights:** stir and knead use `Cook.Coach.demo`; `C.stuck` in sekelo, daar, eggs, corn and baking (their stepper quiet: `kitHelps`); `C.began`/`C.ended` round the stirs; glows last as long as their lights. Sekelo's bowls on one line; the mixed skewer's card has a picture.

## Proof
- **Contract** (`s19-games-contract`, four sizes, 24/24 ended): 8 breaks under load (2 chai's own). An earlier play had 2: eggs 83, corn ART-60.
- **L2-L4 and hint players, 1280x665** (`s19-games-levels`, 29/29): 8 breaks (h = hint player):

| game | 91 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| sekelo | - | - | - | - | - | - | - | - | - | - | - |
| daar | - | - | - | - | - | L1,L4 | L1@930 | - | - | - | - |
| eggs | - | - | - | L1h,L3 | - | - | L3 | L1@1920 | - | - | - |
| corn | - | - | - | - | - | - | - | L1@930 | - | - | - |
| baking | - | - | - | L1,L1h,L3h | - | L1h | - | - | - | - | - |
| chop | - | - | - | - | - | - | - | - | - | - | - |

- **Checks:** unit 763/763, words 0, static 0 new, specs 0 flagged.
- **After:** `build/screenshots/brief/s19-games/`: CK-61, DAAR-43 PASS; CK-63 FAIL (card light); SH-228 tool failure. No BEFORE (no specs at launch).
- **Side by side:** `build/screenshots/sidebyside/{eggs,daar,mishkaki-grill,corn}-L1-*`.
