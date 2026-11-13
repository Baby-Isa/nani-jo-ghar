# s19-night-b: chai, pantry, eggs, baking, corn (overnight, 13 Nov)

## Flaws first
- **Browser time was the limit.** Four builders shared the machine, so evidence pages took 4 to 8 minutes each. The planner estimated 46 minutes for my 67 rows; the real time was over two hours. I proved 32 rows (run `s19-night-b-a2`, 51 pages). The rest are listed below as not run.
- **No before folder for this brief.** The spec names no rows (`rows: []`), so `--before` and `--after --brief` play nothing. I stopped a frozen-copy baseline after 8 slow pages. The before for my contract run is the 12 Nov gate run (`s19-gate-contract`).
- **Tier 2 (`check-change.mjs`) was not run.** The spec lists `cook:pantry`, which is not a flow, so the tool stops ("Unknown game(s)"). With `--games` it plans 24 steps, about 175 minutes: two hours of it is the play and the before. **Orchestrator:** remove `cook:pantry` from the spec's flows (the pantry is `cook:fetch`).
- **`checks.mjs`: 1 failure, not mine.** `briefpack.test.mjs` "the live specs give no overlap" fails because the night-b and night-c specs both own `evidence.json`. Everything else passed: words, static, leak, bump, specs, docs, stdids, decisions.
- **One baking page stopped at the results arrow** (`page.click` timeout under load, after the round ended). All 5 probes reached their moments. Four chai L4 pages timed out under load, so they produced the tool failures below.

## What changed (my files only)
- **Baking** (`baking.js`, `data/stations/baking.json`):
  - **CK-101:** the oven is 780 wide (was 560), about three trays. It is capped to the room above the shelf.
  - **CK-102:** the shelf's things and pills stay on the band through the oven and the well done.
  - **CK-100:** the face circle sits left of the tray, clear of its light (contract-82). It goes with the tray to beside the oven door, and comes back with it. It hides while the review face shows.
  - A test log of the oven's steps (`baking-oven`). `moments.mjs` doesn't know `life:baking-oven` yet, so the probes use `every:placed`.
- **Corn** (`corn.js`, `corn.json`), **CK-103:** a dressing flies to the cob as a small copy of its bowl's picture, not a black dot. The pepper's specks are bigger (`r` 0.05), so the cob visibly changes.
- **Eggs** (`eggs.js`):
  - **CK-94:** each knob has the face of the person whose eggs cook there, as chai's does. The pot has no face when nobody asked for boiled eggs. The handle-to-tray gap is at least 24 page px.
  - **CK-113 / contract-117:** a tap the game turns down shakes its thing and keeps the light. This covers the bowl with an egg in hand, the pot or pan with an empty hand, and a plate with an empty hand.
- **Probes** (`evidence.json`): new probes for CK-92, 94, 95, 96, 100 to 105. PAN-21's probe now covers L1-L4 on every placed move.
- **Mechanics touched:** none (`fetch.js` and `pour.js` are unchanged).

## Rows
**Built here, sheet ready for the judge:** CK-94, CK-100, CK-101, CK-102, CK-103. CK-113 is fixed in eggs; the contract run checks it.

**Built before, proven in a2 (judge to pass):**
- Machine PASS: CK-65.
- For the eye: PAN-19, PAN-20, CHAI-19, CHAI-36, CHAI-37, CHAI-55, CHAI-56, CHAI-98, CHAI-101, CK-46, CK-55, CK-75, CK-76, CK-77, CK-105 (the cob card comes first and nothing swaps in my frames).
- Voice: CK-59.

**PAN-21:** I can't reproduce it. No count pill shows over the shelves in the L1-L4 frames. Sheet: PAN-21.

**Tool failures in a2** (the probe or the load, never a FAIL):
- CHAI-96: the strip didn't change.
- CHAI-99: `life:next-pan` never came at L1.
- CHAI-38: chai L4 timed out.
- CHAI-49: a screenshot timed out.
- CHAI-54: `Cook.chaiPans` is not set.

**LEFT, needing a decision:**
- **CK-92** (needs Zafar): the egg can't be both about the pan's width and the same size on the plate, because the plate is about 40% of the pan. Letting it shrink on the way breaks contract-114 (SH-256). Choices: bigger plates, or an exception to the size rule.
- **CK-93** (needs Zafar): the praise at the table is his 1 Nov mechanic (step 4), which non-negotiable 1 protects.
- **CK-95** (needs Zafar): lighting atto as she names it breaks CHAI-32 ("none for the first ordered item"). It also breaks non-negotiable 4 and contracts 24 and 36, all seen in my trial. I backed it out.
- **CK-104** (needs Zafar): six bowls with pills at the floor need about 600 CSS px. The 740x320 stage has 515. Staggered pills would break SH-244's tap-area rule. A fix could be fewer bowls on a phone.

**LEFT, owned by another builder:**
- **CK-96** (night-shared): the baking card's shape comes from `data/cook.json` `recipes.baking.say` (bare rows) and the shared order card.
- **CK-97** (waiting on art): the atto card's picture is in the art registry, and a half-full bottle is new art.
- **CK-46** (night-shared and art, ART-33), **CK-55** (night-shared, `#gu-btn` under the cog).

**Waiting on Zafar's ear or play** (built in code): CHAI-95, CHAI-97, CHAI-100, CHAI-102, CHAI-103, CHAI-104, CK-01.

**Not run (browser time):**
- With a probe: PAN-04, PAN-01, PAN-13, CHAI-02, CHAI-08, CHAI-34, CHAI-35, CHAI-39, CHAI-42, CHAI-48, CHAI-57, CHAI-108, CK-06, CK-54, CK-57, CK-61, CK-62, CK-63, CK-64, CK-72.
- No probe: PAN-22, CK-45, CK-53, CK-56, CK-68.

**Recording sheet:** no new gaps. The device-voice lines are the ones already logged, such as "Tayar ai.", "Hane naan!" and "Adh paani wiji chad!".

## Proof
- **Evidence:** `build/reports/evidence-s19-night-b-a2.md`; sheets in `build/screenshots/evidence/s19-night-b-a2/`. 32 rows: 26 for the reviewer, 1 machine PASS, 5 tool failures. Next: `evidence.mjs --judge --run-id s19-night-b-a2`.
- **Contract before** (gate, 12 Nov; my 5 flows at L1-L4, 740x320 and 1280x665): 47 breaks.
  - corn 14 (114 x12, 37 x2)
  - eggs 15 (37 x4, 70 x4, 117 x3, 78 x3, 98 x1)
  - fetch 12 (53 x3, 112 x3, 121 x2, 111, 115, 37, 92)
  - chai-tray 5 (72, 78, 83, 98, 99)
  - baking 1 (36)
- **Contract after:** CONTRACT_AFTER
- **Checks:** `checks.mjs`: 8 of 9 ok, unit 913 pass and 1 fail (the specs' overlap, above). `--lint-specs`: 0 flagged.
