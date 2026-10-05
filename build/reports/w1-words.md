# W1: Mum's 5 Oct words into Cook and the clinic

Zafar's eleven confirmed spellings (decision 31) are marked "spelling ✓ 5 Oct" in lexicon §6 and grammar-notes §38–§55.

## Clips
Speech is stitched word by word (decision 26), so I cut **11 single-word clips** from Mum's takes: *ukar, slow, kar, atto, gund, chulo, bar, bhar, thundo, kan, lal*. Each was checked by Whisper on the clip alone and by pitch for the speaker. `checked` is left empty, since the lab has no "machine-checked" value. They are not yet heard by Zafar.

**Rejected:**
- *wiji*, *chad*: the words run together.
- *tar*: it's *tari wij*, or silence.
- *waar*, *kap*: unclear.
- *pag*: probably Zafar asking.
- One *ukar* take: Zafar's voice is in it.
- The whole **chulo-bar** take has English in it (flagged in its note).

## Wired
**Cook guide:**
- Fully Mum: watch *Slow kar!*, knead *Atto gund!*, flip/stir *Firai!*, fill *Bhar!*, chai-tray knob *Chulo bar!*
- Part device voice: chop *Nindha nindha kap!* (*kap*), fold *Samosa waar!* (*waar*), add *Wiji chad!*, fry *Tar!*

The new `guide-*` entries in `cook.json` `lines` exist because a guide entry can only point at a line.

**Clinic:**
- Mum: *kan* (ear), *garam*, *thundo*, *barabar*, *lal*
- Device voice: *pag* (foot)

## Still placeholders
- Other guide steps (pour, roll, the pantry headline and others).
- "with" / "and".
- Other body parts and care items.
- *ukar* has no guide step.

## Needs an edit outside my files
1. `data/clinic/lang.json` `col-red` / `red` say ***laal***; Mum says ***lal***. The heal games show *laal* with a device voice. Recommend changing it to *lal*.
2. The samosa and daar line stations read `stations.samosa` / `.daar` phases, which don't exist, so their box shows the default. Fill, fold and fry show only in the single-station labs.
3. The box speaks only when its speaker is tapped.

No code changed.

## Proof
- The core `planClips` gives the voices above.
- Leak checks and the cook/clinic unit tests pass.
- Sandbox `--touched`, 65 pages at laptop size: **0 new findings**, every flow ends.
- Sound: none of the new words was spoken (the box is silent until tapped).
- Shot: *Chulo bar!* is in Kutchi, unflagged and unclipped.
- No clinic flow shows the six clinic words.
