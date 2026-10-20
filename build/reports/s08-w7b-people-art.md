# s08 wave 7B: the clinic and the family (s08c art cut and wired)

Branch `worktree-agent-acdb631c5df4d26cf` (from `c2c36656`). Game code: `js/clinic/heal/host.js`, `eye.js`, `taste.js` and the clinic data; the cuts in `assets/clinic/` and `assets/characters/`.

**What changed**
- **CR1** replaces `crutches-flat-belt`; **TC1** is the taste cup (no shadow, drink in its mouth only).
- **Doctor:** DW2/DT2/DB2 = his 3q-left set beside the bed (talks, blinks). His whole set shifted toward #C88A6F, one Lab shift per view: bases ΔE 2-6 (were 12-13); face layers checked on their bases.
- **Girl:** GZ2/GZ3/GZ4 are the eye game's view (shifted to her sheet's face #E39468); she blinks at rest. GZ1 is the tooth zoom's middle step: the drawn girl dissolves into it, it grows to the close-up's lips at the hand-over. It is a layer background shown only while the camera moves (loadcheck counts `<img>` only; the file ends drawn larger than itself).
- **Waiting room:** WR1-WR3 seated like the old man, tint bands measured.
- **Family:** NN/MA/AL talk and blink, AL3 impatient, cut on the wired neutral canvas (face pixels only) into `assets/characters/`. **Not wired** (Cook is 7A's): patch `/tmp/claude-0/-home-user/1b81caf2-a2ea-5762-a247-00bd8811bfec/scratchpad/w7b-cook-wiring.py <repo>`, tested in a scratch copy (Ma's mouth flaps).
- Specs: CLN-185, ART-23 new (red `ev-w7b-red` reached its states); CLN-196 now plain probes (Zafar decided 19 Oct).

## Proof
- Matrix `s08-w7b-people-art-matrix`: 72/72 pages reach their end (5 re-played after a full disk crashed Chromium); 0 page errors; contract: 4 breaks, all contract-11 on `cook:day1` marble (pre-existing, 7A's WT1).
- `checks.mjs`: all green but `load` (cook:chop's `nani-face-talk` oversize, flaky, not 7B); loadcheck alone 29/29.
- Green evidence `ev-w7b-green` (CLN-17, 23, 163, 185, ART-23) and `ev-w7b-green2` (CLN-196): sheets for the judge.
- shotdiff: the approved shots are old (1557 differ). Flaws: the doctor's head overlaps the certificate frame; the brush ghosts briefly at the tooth hand-over.

**Open:** the Cook half of ART-19/ART-10 (the patch above); a `skin_shift` option for artcut (`s08c.cut.json _7b_manual`).
