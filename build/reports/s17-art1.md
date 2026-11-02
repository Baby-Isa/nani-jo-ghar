# s17-art1: art block 1, the plan and the paste block (2 Nov 2026)

**Block:** `docs/design-language/art-plans/s17-art1-chrome-block.txt`, from the plan `s17-art1-art-plan.md` and the spec
`build/tools/art/specs/s17-art1.run.yaml`. A first draft for Zafar's feedback. No game code touched.

**Images:** 29 prompts (108 game pictures once cut): chai's word moment 4 (tilted kettle, glass side-on filling, six streams
shared with baking, the snap), eggs 8, baking 8 (BL optional, last), the corn stall 5, the cake 4. About 38-40 images with
redos, a third of a day; worst case 87. Block 2 can fill the rest of that day.

**Expected redos (about 10):** WG two; WV, EM, EN, BO2, BO3, CO, EG, BB or BJ one each.

**Reused:** the hob, the chai tray, the enamel plate, the counter characters, the kitchen in play, the shelf containers, the
dough ball, sekelo's grill and plate, the s14 glasses (fallback), the clinic patients (the cake's people). Still placeholders:
the black cat, Hannah Mami.

**References:** 13 already on the branch; two cake mock-ups copied (renamed without spaces) into `sources/art/s17-art1/refs/`.

## Proof
- `artblock.py --check`: 2 problems, only those two unpushed references. After the merge and push: re-run `--check`, then
  regenerate the block (identical). This one was written by the tool's own `build()`, nothing by hand.
- `checks.mjs --only docs,fixlist,static`: green (static 0 new, docs ok, fixlist ok).

## Open questions (plan §7)
1. The word moment's glasses side-on (recommended) or chai's overhead s14 frames?
2. A steel chai kettle (recommended) or a steel pot?
3. Eggs' table on the kitchen island, relit for morning and night?
4. Baking's oven its own close-up on a new counter?
5. Keep BL, the loaf and cake tins (not built yet)?
6. Simba from photos, in a run he watches?
7. The cake's people stay the clinic patients until the party's sheets?
