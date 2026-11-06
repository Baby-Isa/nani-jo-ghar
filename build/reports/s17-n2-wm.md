# s17-n2-wm: the word moment (CHAI-97, CHAI-98, CHAI-101, SH-231)

## Flaws first
- **The counter is soft at this size.** Three doors draw the 1600 px art at 2.0 screen px per source px on Zafar's phone (dpr 2.8). At device pixels the bevels are soft; at the phone's own size it reads fine. Contract-11 flags 1920 (1.58, limit 1.5). Next art run: a wide-door counter about 2600 px wide.
- **The glasses shrink about 23%**, to give 30% cabinet under the kettle's room (phone 124 to 95 px). The cards keep their size.
- The probe frame comes before the kettle enters (it waits for the sound).

## What changed
- **CHAI-97:** the pour file loads before the first pour (up to 4 s). A pour plays the file or nothing, never the made loop.
- **CHAI-98:** the drop is 5.5% of the glass, its splash with it (12.2 to 5.6 px at 740).
- **CHAI-101:** the counter line sits at 70% at every size. The picture shows its three middle doors, seam to seam (about 1.6x), so no edge sliver.
- **SH-231:** the card follows the item card's rhythm: Kutchi 4% and English 3.5% apart, a 74.8% divider, then g = 7% three times. The speaker has no ring. The faces already matched (Lora 600, Nunito Sans 600). The shared card is unchanged.

## Proof
- Evidence after: `build/screenshots/brief/s17-n2-wm/*/after/`.
- Script before and after sheets, with the sound log: `build/screenshots/s17-n2/`.
- Sound log, cold load, L4: both pours log `sfx/file:pour-a` (before: the made loop first).
- Contract, 8 pages: `CONTRACT FAILED: 1 breaks (contract-11 1)`, the counter above.
- Checks: every line ok except unit, 1 fail. It was there before this work: SH-230, SH-231 and CK-59 are not in CONTRACT_ROWS. Load check 29/29.

QA: TXT ✅ · LAY ✅ · CMP ✅ · AUD ✅ · INT ✅ · ART ⚠ (the counter's resolution)
