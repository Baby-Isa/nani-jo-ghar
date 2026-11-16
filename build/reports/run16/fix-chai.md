# run16 fix-chai: results

Branch `run16/fix-chai`, cut from 48003532. No game file changed: every row below was already fixed, or needs a decision. The branch adds checks only, under `build/`. Rows and evidence are in `build/reports/run16/fix-chai.json`.

## Flaws first

- **CHAI-99's proof reads the code, not a play.** The next pan's light only comes for a new player who stays on the poured pan. No sandbox player stays: it picks the next pan at once, so the game rightly gives no light. Holding the player 3 s didn't help either, because it had already switched pans. So `chai-next-pan.test.mjs` reads the wait the code sets.
- **MAA-28 reproduces on old code in 2 of 8 plays only:** `#hint` 1280x665 and `#mistake` 740x320. Fast play and child-pace play stayed green there. Its green covers 10 plays on base, those two included.
- **MAA-20:** see its section below for the final state of the old-code run.
- **No check-change run.** The branch changes no runtime file (`git diff --stat 48003532` touches only `build/`), so before and after are the same game. It would have cost about 47 minutes of browser time.
- **CHAI-111 is not reproduced.** The sandbox has no 736x750 size, and Zafar played at that size after resizing mid-session.

## Proven (red on the code before the fix, green on base)

| Row | Red | Green | Check |
|---|---|---|---|
| MAA-28 | 7ff346ad (before SH-308): at the well done the row re-sorts and the bajr card's place shows another card | 10/10 plays | `node build/tools/review/maa28.mjs --paths fair,mistake,hint,takeback,speed1 --sizes 740x320,1280x665` |
| CHAI-100 | 8aaefe1e: a click after each last pour, 6/6 pages | 8/8 and 6/6 | `node build/tools/review/chaisound.mjs --rows CHAI-100` |
| CHAI-113 | a9ccaa4f: at L1 the flame never sounded while Nani spoke | 8/8 and 6/6 | `node build/tools/review/chaisound.mjs --rows CHAI-113` |
| CHAI-99 | 8aaefe1e: 300 ms | 800 ms | `node --test build/tools/review/chai-next-pan.test.mjs` |

MAA-28's finding: no item card ever changes its word or picture, on old code or new. What Fable saw was the row's places re-sorting at the well done. The SH-308 fold, already in base, ends it.

CHAI-99, CHAI-100 and CHAI-113 were fixed in d1d4cc80 and b6497cb5, but their rows still read "to fix: code".

## Built, not proven here

These are sound or look rows, for Zafar's ear or a judge's eye:

- **CHAI-95:** the seamless simmer loop (eccb37f8).
- **CHAI-98:** the word moment's drop at half size (b93fc29d).
- **CHAI-103:** the word moment's pour waits for the stream's run-down (85091500).

## Open

- **CHAI-111:** a returning player at the water step gets the hint 7 s after the last tap at 740x320 and 1280x665. Zafar's case was the second play after a resize to 736x750. The next probe should play that size, resized mid-session.

## Questions for Zafar

1. **MAA-25:** where do maani's plates go once they're off the stone tray?
   - (a) A round tray left of the board, as chai's glasses sit on theirs. Recommended.
   - (b) Below the hob, right of the board.
   - (c) Stay on the band, at the heaps' pitch, with pills.
2. **CHAI-114:** chai is frozen, and Nani's box is the kit's. Unfreeze it for this one fix (recommended), or wait for the frame?

## Tools added

- `build/tools/review/maa28.mjs` and `lib/maa28-hook.js`: maani's item cards, and each place in a person's row from the serve on.
- `build/tools/review/chaisound.mjs` and `lib/chai-sound-hook.js`: chai's knob, flame, pour and next-pan marks, beside the sandbox's real plays.
- `build/tools/review/maa20.mjs` and `lib/maa20-hook.js`: the roll demo's finger and pin travel.
- `build/tools/review/chai-next-pan.test.mjs`: CHAI-99's wait.

All of them play through `run.mjs` with `NJG_INIT`, and accept `--root <worktree>` for a red run on older code.
