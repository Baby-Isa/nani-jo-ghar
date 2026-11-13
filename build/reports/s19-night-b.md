# s19-night-b: chai, pantry, eggs, baking, corn (overnight, 13 Nov)

## Flaws first
- **Contract breaks went up, not down: 47 before, 66 after** (L1-L4, 740x320 and 1280x665; contract-36 left out, see below).
  - Eggs: 15 to 25. One L4 page at 1280 got stuck (below), which accounts for 8 of contract-91 and 2 of contract-117.
  - Baking: 1 to 8. Two are contract-104: card pictures that did not load in time, a load symptom. In a quiet rerun, baking at L1 and L2 (1280) had 0 breaks.
  - Corn 14 to 15 (contract-114 x9: SH-256, Zafar's call). Fetch 12 to 14 and chai 5 to 4: neither changed in code.
- **New fault found, not fixed: eggs L4 at 1280 got stuck.** A boiled egg was lit over the shelf (the chai jar), a tap did not lift it, and the flow stopped after 300 s (`s19-night-b-final/cook-eggs-l4/1280x665/08-stopped-here.png`). The same flow reached its end in the earlier, loaded L2-L4 run. **Next round: eggs.js `nextThing` and `lift` for a leftover boiled egg.**
- **contract-36 (366 hits) is a tool fault.** The final run used `--parallel 3`, and contract-36 flagged steps such as "the light on cook-chai" in eggs. The serial four-size run had 1.
- **Browser time ran out.** Four builders shared the machine, so evidence pages took 4 to 8 minutes each. I proved 32 of the 67 rows; the rest are listed below.
- **No before folder.** The spec names no rows, so `--before` and `--after --brief` play nothing. The before is the 12 Nov gate run (`s19-gate-contract`).
- **Tier 2 (`check-change.mjs`) was not run.** The spec's flows include `cook:pantry`, which is not a flow, so the tool stops ("Unknown game(s)"). With `--games` it plans about 175 minutes. **Orchestrator:** use `cook:fetch` in place of `cook:pantry` in the spec's flows.
- **`checks.mjs`:** 8 of 9 steps pass. The one failure is not mine: `briefpack.test.mjs` fails because the night-b and night-c specs both own `evidence.json`.
- **Not pushed** (the brief says never push), though the push hook asked.

## What changed (my files only)
- **Baking** (`baking.js`, `baking.json`):
  - **CK-101:** the oven is 780 wide (was 560), capped to the room above the shelf.
  - **CK-102:** the shelf's things and pills stay through the oven and the well done.
  - **CK-100:** the face circle sits beside the tray, clear of its light. It goes with the tray to beside the oven door, comes back with it, and hides while the review face shows.
  - The oven and naan light goes as the press starts (contract-106).
  - A test log of the oven's steps (`baking-oven`).
- **Corn** (**CK-103**): a dressing flies to the cob as a copy of its bowl's picture, not a dot. The pepper's specks are bigger, so the cob visibly changes.
- **Eggs:**
  - **CK-94:** each knob has the face of the person whose eggs cook there. The handle-to-tray gap is at least 24 page px.
  - **CK-113:** a tap the game turns down on the bowl, the pot, the pan or a plate shakes the thing and keeps the light.
- **Probes** (`evidence.json`): new for CK-92, 94, 95, 96, and 100 to 105. PAN-21's probe now covers L1-L4.
- **Mechanics touched:** none (`fetch.js` and `pour.js` are unchanged).

## Rows
- **Built here, sheet ready for the judge:** CK-94, CK-100, CK-101, CK-102, CK-103. CK-113 is built in eggs, but 3 contract-117 breaks remain on the stuck L4 page.
- **Built before, proven in a2 (judge to pass):** CK-65 (machine PASS), PAN-19, PAN-20, CHAI-19, CHAI-36, CHAI-37, CHAI-55, CHAI-56, CHAI-98, CHAI-101, CK-46, CK-55, CK-59, CK-75, CK-76, CK-77, CK-105.
- **PAN-21:** I can't reproduce it; no count pill shows over the shelves at L1-L4 (sheet in a2).
- **Tool failures in a2:**
  - CHAI-96: the strip didn't change.
  - CHAI-99: `life:next-pan` never came.
  - CHAI-38: the page timed out.
  - CHAI-49: the screenshot timed out.
  - CHAI-54: `Cook.chaiPans` is not set.
- **LEFT, needs Zafar:**
  - **CK-92:** the plate is about 40% of the pan, so "the pan's width" and "no jump" can't both hold under contract-114. Choices: bigger plates, or an exception to the size rule.
  - **CK-93:** the praise at the table is his 1 Nov mechanic, protected by non-negotiable 1.
  - **CK-95:** lighting atto as she names it breaks CHAI-32 ("none for the first ordered item") and non-negotiable 4. My trial also broke contracts 24 and 36, so I backed it out.
  - **CK-104:** six pills at the text floor need about 600 CSS px; the 740x320 stage has 515. Staggered pills would break SH-244's tap-area rule. A choice: fewer bowls on a phone.
- **LEFT, owned by another builder:**
  - **CK-96** (night-shared): `data/cook.json` `recipes.baking.say` and the shared order card.
  - **CK-97** (waiting on art): the card pictures, including a half-full bottle.
  - **CK-46** (night-shared and art), **CK-55** (night-shared).
- **Waiting on Zafar's ear or play** (built in code): CHAI-95, CHAI-97, CHAI-100, CHAI-102, CHAI-103, CHAI-104, CK-01.
- **Not run (no browser time):**
  - With a probe: PAN-01, PAN-04, PAN-13, CHAI-02, CHAI-08, CHAI-34, CHAI-35, CHAI-39, CHAI-42, CHAI-48, CHAI-57, CHAI-108, CK-06, CK-54, CK-57, CK-61, CK-62, CK-63, CK-64, CK-72.
  - No probe: PAN-22, CK-45, CK-53, CK-56, CK-68.
- **Recording sheet:** no new gaps.

## Proof
- **Evidence:** `build/reports/evidence-s19-night-b-a2.md`; sheets in `build/screenshots/evidence/s19-night-b-a2/`. Next: `evidence.mjs --judge --run-id s19-night-b-a2`.
- **Four sizes, L1** (`s19-night-b-contract`): "CONTRACT FAILED: 25 breaks". Of these, 104 x3 are card pictures not loaded and 114 x3 are corn's SH-256.
- **L1-L4 at two sizes** (`s19-night-b-final`, contract-36 left out):

| game | before | after | after, by check |
|---|---|---|---|
| eggs | 15 | 25 | 91 x8, 37 x5, 70 x5, 117 x3, 116, 111, 107, 82 |
| baking | 1 | 8 | 104 x2, 120 x2, 53 x2, 112, 117 |
| corn | 14 | 15 | 114 x9, 37 x2, 70 x2, 78, 99 |
| fetch | 12 | 14 | 92 x3, 112 x3, 121 x3, 37, 53, 72 x2, 115 |
| chai | 5 | 4 | 112, 116, 37, 99 |

- **Checks:** unit 913 pass, 1 fail (the spec overlap above); words, static, leak, bump, specs, docs, stdids and decisions all ok.
