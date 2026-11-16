# CHAI-57 (open) · Cook: chai

**Issue:** "The only other thing is there's no consequence, seemingly, for undercooking or overcooking the chai ... I think if I overcook this, it just like bubble over and empties, and you just have to start that pot again ... I would like the feedback to be instant though, like before you pour it ... Maybe it just doesn't let you click it too early. That's a simple solution, right? It just shakes and says no, basically. And the timer keeps going until it hits the green. Well, yeah, it keeps going until you click it when it's in the green. And if you click it in the red after the green, then it overboils and you have to start again. That's a simple mechanism ... At least for now, implement that as code ... the mechanic of it, not the visuals of it": too early, the knob shakes and Nani says no while the heat runs on; in the green it turns down; in the red it boils over and that pot starts again

**Check:** auto: chai at L1, L2, L3 and L4, each pan: a tap before the green (shake, the heat runs on), in the green (turned down), in the red (boils over, the pot empty and its rows open)

**Source:** docs/feedback/chai-play-2026-11-01.md P18

**Status now:** to fix: check · built (s15-chai-11, decision 5): early tap shakes and hever na, green turns down, red boils over and that pot starts again; his visuals later (ART-32)

## Probes

- CHAI-57-p1-L2-1280x665: cook:chai-tray@L2 L2 @ 1280x665 [p-seen], at results: reached 1x (life:results 49.4s) · the round's whole boil log (js:Cook.chaiBoil): each pot turned down in the green ('green'), nothing early or over on a fair play. The over case (no tap: it boils over and starts again) needs a driver that lets a pot boil over (docs/process/checks-to-build.md, 3 Nov): a film at a held moment never changes, because the game's clock waits with the player
- CHAI-57-p1-L2-740x320: cook:chai-tray@L2 L2 @ 740x320 [p-seen], at results: reached 1x (life:results 62.9s) · the round's whole boil log (js:Cook.chaiBoil): each pot turned down in the green ('green'), nothing early or over on a fair play. The over case (no tap: it boils over and starts again) needs a driver that lets a pot boil over (docs/process/checks-to-build.md, 3 Nov): a film at a held moment never changes, because the game's clock waits with the player
- CHAI-57-p1-L3-1280x665: cook:chai-tray@L3 L3 @ 1280x665 [p-seen], at results: reached 1x (life:results 67.1s) · the round's whole boil log (js:Cook.chaiBoil): each pot turned down in the green ('green'), nothing early or over on a fair play. The over case (no tap: it boils over and starts again) needs a driver that lets a pot boil over (docs/process/checks-to-build.md, 3 Nov): a film at a held moment never changes, because the game's clock waits with the player
- CHAI-57-p1-L3-740x320: cook:chai-tray@L3 L3 @ 740x320 [p-seen], at results: reached 1x (life:results 100.0s) · the round's whole boil log (js:Cook.chaiBoil): each pot turned down in the green ('green'), nothing early or over on a fair play. The over case (no tap: it boils over and starts again) needs a driver that lets a pot boil over (docs/process/checks-to-build.md, 3 Nov): a film at a held moment never changes, because the game's clock waits with the player
- CHAI-57-p2-L2-1280x665: cook:chai-tray@L2 L2 @ 1280x665 [p-seen], at cook-done:timing: reached 1x (cook-done:timing 32.7s) · a tap in the green turns it down: the boil log's 'green' event and the pan ready to pour, nothing boiled over
- CHAI-57-p2-L3-1280x665: cook:chai-tray@L3 L3 @ 1280x665 [p-seen], at cook-done:timing: reached 1x (cook-done:timing 45.7s) · a tap in the green turns it down: the boil log's 'green' event and the pan ready to pour, nothing boiled over

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-57.png`)

- **A**: cook:chai-tray@L2 L2 1280x665 [p-seen] · shot at cook-done:timing
- **B**: cook:chai-tray@L3 L3 1280x665 [p-seen] · shot at cook-done:timing

## Text captures

#### CHAI-57-p1-L2-1280x665 · js:Cook.chaiBoil at life:results

```
Cook.chaiBoil = [{"who":"nana","what":"over","heat":1.004,"lo":0.66,"hi":0.86},{"who":"nana","what":"again","heat":0,"lo":0.66,"hi":0.86},{"who":"nana","what":"green","heat":0.71,"lo":0.66,"hi":0.86},{"who":"cousin","what":"green","heat":0.713,"lo":0.66,"hi":0.86}]
```

#### CHAI-57-p1-L2-740x320 · js:Cook.chaiBoil at life:results

```
Cook.chaiBoil = [{"who":"nana","what":"over","heat":1.007,"lo":0.66,"hi":0.86},{"who":"nana","what":"again","heat":0,"lo":0.66,"hi":0.86},{"who":"nana","what":"green","heat":0.729,"lo":0.66,"hi":0.86},{"who":"cousin","what":"green","heat":0.828,"lo":0.66,"hi":0.86}]
```

#### CHAI-57-p1-L3-1280x665 · js:Cook.chaiBoil at life:results

```
Cook.chaiBoil = [{"who":"nana","what":"over","heat":1.002,"lo":0.7,"hi":0.84},{"who":"nana","what":"again","heat":0,"lo":0.7,"hi":0.84},{"who":"nana","what":"green","heat":0.745,"lo":0.7,"hi":0.84},{"who":"cousin","what":"green","heat":0.737,"lo":0.7,"hi":0.84}]
```

#### CHAI-57-p1-L3-740x320 · js:Cook.chaiBoil at life:results

```
Cook.chaiBoil = [{"who":"nana","what":"over","heat":1.012,"lo":0.7,"hi":0.84},{"who":"nana","what":"again","heat":0,"lo":0.7,"hi":0.84},{"who":"nana","what":"over","heat":0.876,"lo":0.7,"hi":0.84},{"who":"nana","what":"again","heat":0,"lo":0.7,"hi":0.84},{"who":"nana","what":"green","heat":0.758,"lo":0.7,"hi":0.84},{"who":"cousin","what":"green","heat":0.755,"lo":0.7,"hi":0.84}]
```

#### CHAI-57-p2-L2-1280x665 · js:Cook.chaiBoil at cook-done:timing

```
Cook.chaiBoil = [{"who":"nana","what":"over","heat":1.004,"lo":0.66,"hi":0.86},{"who":"nana","what":"again","heat":0,"lo":0.66,"hi":0.86}]
```

#### CHAI-57-p2-L3-1280x665 · js:Cook.chaiBoil at cook-done:timing

```
Cook.chaiBoil = [{"who":"nana","what":"over","heat":1.002,"lo":0.7,"hi":0.84},{"who":"nana","what":"again","heat":0,"lo":0.7,"hi":0.84}]
```
