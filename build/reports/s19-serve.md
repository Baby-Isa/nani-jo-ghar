# s19-serve: the serving kitchen in two views, a walnut tray per person (11 Nov)

Opus, high. Branch `s19-serve`, never pushed. Stand-in art until ART-77 lands.

## What changed
- **Two views** (`js/cook/serve.js`, new; wired in `js/cook/flow.js`): the ordering view is today's frame (the kitchen master's geometry, the island's back edge at y 608). At the serve the camera glides down 0.8 s (Sine in-out) until the island fills the lower half. It stops short so every head keeps 14 px above it. `mode` picks the art: `"tall"` (one painting, scrolled) or `"two"` (KO and KS, crossfaded with their counters as it glides). Both played.
- **Trays**: none painted. One walnut tray per person who ordered (chai's cups, eggs' plates, the asker otherwise), under that person, fading in during the glide. Each dish lands on its tray with a pop. The front rim is drawn again over the dish; the asker's face circle sits on the rim. Shabash, thanks, goodbye and the review are unchanged. The lab's end, the story serve, Nani's demo chai and the `served` hook all use it.
- Every view change (the scene's `clearView`) and every resize puts the camera back.

## Files the real art must have (drop-in, 1 px = 1 design px)
`assets/cook/serve/`: `kitchen-tall.webp` (KB, 2100 wide, about 1680 tall, the ordering 1600x900 at 250,450), `kitchen-order.webp` (KO, 2100x1350, same frame), `kitchen-serve.webp` (KS, 2100x1350, the serving frame, drawn 158 lower), `tray.webp` (KT cut, about 480x181), `dish-chai.webp`, `dish-chai-black.webp`, `dish-maani.webp`, `dish-daar.webp`, `dish-eggs-fried.webp`, `dish-eggs-boiled.webp`; any other dish falls back to today's served picture.

## Needed from other owners
- **s19-pantry, `data/cook.json`** (loadcheck fails until then): in `art.assets.shared.files` add `"assets/cook/serve/*"`; in `art` add `"serve": {"mode": "tall"}` (the setting; `"two"` for KO/KS); in `art.s02["kitchen-trays"]` set `"file": "assets/cook/serve/kitchen-tall.webp"` (serve.js sets it as the data loads until then).
- **s19-fixes-g, `js/cook/stations.js`**: in `clearView()` call `if (Cook.Serve) Cook.Serve.reset(this);` so serve.js no longer wraps the scene's method.

## Proof
- **Checks** (`checks.mjs`): words, static (0 new), docs, specs, leak, art (0 new after the tray re-cut) ok. Unit: 3 fail, all art-block tests that read `sources/`, absent from this sparse checkout. Load: not run (needs the manifest line).
- **Contract**, `s19-serve-contract` (chai, maani, eggs L1; 740x320, 930x430, 1280x665, 1920x1080): all 12 pages reached their end. Last line: `CONTRACT FAILED: 52 breaks (contract-80 10, contract-36 4, contract-78 4, contract-114 18, contract-116 6, contract-79 1, contract-70 5, contract-77 4)`. **contract-80 is the glide**: every one reads "service: the kitchen picture moved after its first drawn frame". It is new against my before run, `s19-serve-before` (no contract-80); the rest are the stations' breaks, also there before (s19-fixes-f's list). The check needs to let an announced glide through: the `serve-view` note marks its start, and it lasts 0.8 s.
- **check-change** (tier 2): no result file. It ran out of time (58 min) on the base tree's before. By then: push fail (the same 3 unit tests), scope fail (the integration branch's own `sources/art/s19-tray-pot/…` in the diff from main), candidate play 215 breaks (all 35 contract-80s are the service view's glide).
- **Pictures** (sandbox, `build/screenshots/sandbox/`): ordering and serving view at 1280x665, `s19-serve-contract/cook-chai-tray/1280x665/c05-bubble.png` and `c11-stage.png`, mid-glide `c10-stage.png`. One person: `s19-serve-contract/cook-eggs/740x320/c08-stage.png` and `c09-bubble.png`, maani `…/cook-maani-line/930x430/c10-bubble.png`. Two people: `s19-serve-dev1/cook-chai-tray-l3/1280x665/c14-bubble.png`. Three: `s19-serve-three/cook-chai-tray-l4/1280x665/c17-bubble.png`. Two-picture mode: `s19-serve-two/`. Before: `s19-serve-before/`. These come from the sandbox runs, not from the evidence tool: the brief has no rows, so there is no after folder.
- After the contract run: the drawn-tray fallback was dropped, the tray re-cut, and the trays kept on screen (chai L4 at 1280x665 played to its end after that).

## Open
- Chai L4 stalls at the marble view at 740x320 and 930x430. It does the same with the serve off (`on: false`), so it is not this change.
- The glide strips need an evidence probe (no rows in the brief): `Cook.Serve.state()` and the `serve-view` / `serve-trays` timeline notes give one.
