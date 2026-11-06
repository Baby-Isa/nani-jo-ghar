# s17-n4-art: art runs that never stop at an upload, colours checked by the tool, the clinic block reissued

## Flaws first
1. CD01's bandages and threads keep blue, as a colour exception. Decision 5's list named "bandage", but the game asks for these by colour (`data/clinic.json` `bandage`, `thread`). A Venice Green bandage would clash with the green one. This is a one-line change if Zafar wants teal.
2. `--check --pushed` fails until the orchestrator pushes `sources/art/s17-clinic-redo/refs.zip`.
3. The github-mode reference step (`moving-github.txt`) is unchanged. No pack uses that mode now.
4. `art-pipeline.md` is 2 words under its limit.
5. One unit test fails, and it did before this work: CONTRACT_ROWS (SH-230, SH-231, CK-59).

## What changed
- **ART-42:** a download-mode block now writes its references to `sources/art/<pack>/refs/` and `refs.zip`. The block's first line gives Zafar the zip's raw link. The runner uploads the files he attaches and asks once, at the start, for any that are missing. The screenshot route and every sentence about getting round a refusal are gone. "SAFETY RULES" is now "GROUND RULES".
- **ART-58:** `--check` reads each line's filled prompt for Wada colour names. It fails a colour outside the house family, or colours no one combination holds, unless the line has `colour_exception: <why>`. It fails a plan with no "## N. The prompts" heading, and the block uses that N.
- **Clinic:** each Olympic Blue item became Venice Green. The plasters, the drop machine, the toothbrush and CD01 are exceptions. CD02's comb is now Olive Buff. Both branches are now `claude/exciting-sagan-cz9d5t`. The block was regenerated (section 4).

## Proof

No browser work and no flows in this brief, so there is no before or after folder and no contract run.
- `node --test build/tools/art/artcheck.test.mjs`: 24/24 pass
- `artblock.py --check` (clinic): spec ok; the zip still needs pushing
- `checks.mjs`: unit 654 pass, 1 old fail (CONTRACT_ROWS); every other check ok

**QA checklist:** no game screen was touched, so the TXT, LAY and art lines do not apply.

**Rows:** ART-42 and ART-58 are built. They are proven when the next run lands with nothing more from Zafar.
