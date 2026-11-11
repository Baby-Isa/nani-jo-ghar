# The real bad runs

Runs known to be wrong, played from the real code before its fix, kept small: each page's record (its timeline, what every
contract check reads) gzipped, and each light's pictures (the frame just before it, the screen with it, the same moment with every
painted layer over the play area hidden). No films. `build/sandbox/badruns.test.mjs` judges them again on every `checks.mjs`; a
check that was red on a bad run must stay red (a check may be loosened only if it still goes red on its bad runs; Zafar, 10 Nov).

## How they were played

The old game, today's sandbox and checks: a sparse checkout of the old commit (`js`, `css`, `data`, `lab`, the pages; `assets`
linked), served by `NJG_GAME_ROOT` (`build/sandbox/lib/env.mjs`):

```
git worktree add --detach --no-checkout ../bad-3c48 3c4882609   # then a sparse checkout of js css data lab and the top-level pages
NJG_GAME_ROOT=../bad-3c48 NJG_KEEP_LIGHTS=1 node build/sandbox/run.mjs --contract --keyframes \
  --flow cook:eggs#speed1,cook:chop#speed1,cook:daar#speed1,cook:corn#speed1,cook:maani-line#speed1 --sizes 740x320,1280x665
node build/sandbox/fixtures/bad-runs/make.mjs --run <run id> --commit 3c4882609 --name "cook:eggs#speed1=SH-249 ..." ...
```

The good run is chai at HEAD (the reference), played the same way without `NJG_GAME_ROOT` and kept with `--good`.

## The runs

Commit 3c4882609 (10 Nov 16:02, before the September overlay was deleted in e9f8afa4c). Each at 740x320 and 1280x665.

| Run | Row and flaw | Caught by |
|---|---|---|
| `pages/cook-eggs-speed1@*` | SH-249, SH-250: a circle and a box at once (the old overlay over the shared light), its darker dim (0.74 against chai's 0.45), the pan's round ring | contract-112 |
| `pages/cook-corn-speed1@*` | SH-249, SH-250: the same circle and box, the darker dim, the cob cut at both ends; SH-254: Nana's face over the cob at well done | contract-112, contract-113 |
| `pages/cook-chop-speed1@*` | STD-E2-08a, SH-253: the swipe light over the side panel and out to the frame's edge, lit while the garlic and the knife fly into it; CK-78: its tally chip under the settings cog at the first move | contract-112, contract-113 |
| `pages/cook-daar-speed1@*` | SH-249, SH-253: the onion's swipe light over the side panel, lit while the onion and the knife arrive; Nana's badge over the katori and the daar bowl at 740x320 | contract-112, contract-113 |
| `pages/cook-maani-line-speed1@*` | SH-249: the pan's round ring on the tawa (a circle); SH-254: Nana's well-done face over the plates' faces | contract-112, contract-113 |
| `pages/cook-chai-tray-speed1@*` | good: chai at HEAD, every light passes, nothing covered | (green) |

`expect.json` lists every check each page is red on today, with its words. The shots named there (`c*-s19over.png`) are the run's
own pictures of each cover, for the eye.

The shared-pieces lint has its own real bad code: `build/lint/fixtures/shared/3c48-coach.js` and `3c48-cook.css` (the old
overlay, verbatim), and `round-true.js` (a game asking for a round light).
