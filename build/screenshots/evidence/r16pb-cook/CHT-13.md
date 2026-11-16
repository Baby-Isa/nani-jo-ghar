# CHT-13 (open) · Cook: chaat

**Issue:** "Artwork for all the items that can go inside the bowl ... it doesn't really work"; "redraw the bowl so it's exactly side-on ... a horizontal strip ... So let's do that, unless you have any qualms" · told again 9 Nov, changed: "And then chart. Yeah, we went back and forth with this because I think image 23 looks lovely with the things around it, but nope. Let's put the items on the side. I think maybe we go top down for chart. Fine. Like, I did get ChatGPT to mock up a side on view image. Actually, I'll paste it in just for your reference, just so you can give me an opinion on it. But I think this game mode's evolved a bit. Before, like, you would put in the whole sequence, and then it would tell you if you were wrong. And I don't know, it seemed quite important to see it like layer up. I don't know why. It just, at the time, it seemed more important and stuff. Now I think the game's less about that. I don't know what the game is about now, really. It's just a sequence game, isn't it? And a chance maybe to learn about specific sources and Sev and things you don't get elsewhere. So it's still a good game mode. Top down, I think, looks better. Opaque bowl looks better than the glass bowl."

**Check:** eye: chaat at L1, L2, L3 and L4 at the four sizes, every item in the bowl

**Source:** docs/feedback/cook-playtest-2026-10-17.md P61; docs/feedback/kitchen-mocks-2026-11-09.md P18

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins) (the art landed 10 Nov: F3's top-down bowls, C5-C11's tops; cook-bottom-row.md now says tray, top-down; it had said side-on, written from the code on 10 Nov, not from this row: build/reports/s19-chaat-top-down-slip.md) · told again 9 Nov (docs/feedback/kitchen-mocks-2026-11-09.md P18), changed from side-on to top-down: an opaque bowl, the items off the bowl (his "Let's put the items on the side."): on the bottom tray with SH-243 unless he means beside the bowl (asked; not round it as mock 23); the art serves what the game is now: "It's just a sequence game, isn't it? And a chance maybe to learn about specific sources and Sev and things you don't get elsewhere."; chaat is fully side-on today (assemble.js:4-14; CHT-03's built glass bowl superseded); Fable's answers are in (build/reports/s19-fable-mock-answers.md §4: top-down, an opaque cream bowl, the items on the tray; his side-on image: no for chaat, 15 px layers on his phone), then the art

## Probes

- CHT-13-p1-L1-1280x665: cook:chaat#speed1 L1 @ 1280x665 [p-fresh], at view-marble: reached 1x (rec:view-marble 25.1s) · chaat top down (Zafar, 9 Nov: 'I think maybe we go top down for chaat ... Opaque bowl looks better than the glass bowl'): the topping bowls seen from above on the kit's stone tray, the opaque cream serving bowl from above beside them; every item that goes in the bowl reads
- CHT-13-p1-L1-740x320: cook:chaat#speed1 L1 @ 740x320 [p-fresh], at view-marble: reached 1x (rec:view-marble 25.6s) · chaat top down (Zafar, 9 Nov: 'I think maybe we go top down for chaat ... Opaque bowl looks better than the glass bowl'): the topping bowls seen from above on the kit's stone tray, the opaque cream serving bowl from above beside them; every item that goes in the bowl reads
- CHT-13-p2-L2-1280x665: cook:chaat@L2#speed1 L2 @ 1280x665 [p-fresh], at view-service: reached 1x (rec:view-service 58.1s) · the made chaat served: the items layered in the opaque bowl, seen from above, each one reading
- CHT-13-p2-L2-740x320: cook:chaat@L2#speed1 L2 @ 740x320 [p-fresh], at view-service: reached 1x (rec:view-service 66.4s) · the made chaat served: the items layered in the opaque bowl, seen from above, each one reading

## Panels (`build/screenshots/evidence/r16pb-cook/CHT-13.png`, `build/screenshots/evidence/r16pb-cook/CHT-13-2.png`)

- **A**: cook:chaat#speed1 L1 1280x665 [p-fresh] · view-marble: the screen, #game outlined
- **B**: cook:chaat#speed1 L1 1280x665 [p-fresh] · crop:#game at rec:view-marble
- **C**: cook:chaat#speed1 L1 740x320 [p-fresh] · view-marble: the screen, #game outlined
- **D**: cook:chaat#speed1 L1 740x320 [p-fresh] · crop:#game at rec:view-marble
- **E**: cook:chaat@L2#speed1 L2 1280x665 [p-fresh] · view-service: the screen, #game outlined
- **F**: cook:chaat@L2#speed1 L2 1280x665 [p-fresh] · crop:#game at rec:view-service
- **G**: cook:chaat@L2#speed1 L2 740x320 [p-fresh] · view-service: the screen, #game outlined
- **H**: cook:chaat@L2#speed1 L2 740x320 [p-fresh] · crop:#game at rec:view-service

## Text captures

#### CHT-13-p1-L1-1280x665 · contract-120 (contract)

```
contract-120: 0 breaks on this page
```

#### CHT-13-p1-L1-740x320 · contract-120 (contract)

```
contract-120: 0 breaks on this page
```
