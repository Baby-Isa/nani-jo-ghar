# W1: Mum's 5 Oct words into Cook and the clinic

The eleven spellings Zafar confirmed (decision 31) are now marked "spelling ✓ 5 Oct" in lexicon §6 and grammar-notes §38–§55.

## Wired
Speech is stitched word by word (decision 26), so phrase clips never play. I cut **11 single-word clips** from Mum's own takes: *ukar, slow, kar, atto, gund, chulo, bar, bhar, thundo, kan, lal*. Each was checked on its own by Whisper (unprompted and prompted) and by pitch. `checked` is left empty because the lab has no "machine-checked" value; each note says "not yet heard by Zafar".

| Where | Shows | Voice |
|---|---|---|
| guide: watch | *Slow kar!* | Mum |
| knead | *Atto gund!* (draft) | Mum |
| flip, stir | *Firai!* | Mum |
| fill | *Bhar!* | Mum |
| chai-tray:knob | *Chulo bar!* | Mum |
| chop | *Nindha nindha kap!* (draft) | Mum, *kap* device |
| fold | *Samosa waar!* | Mum, *waar* device |
| add | *Wiji chad!* | device |
| fry | *Tar!* (draft) | device |
| clinic: ear, hot, cold, just right, red | *kan, garam, thundo, barabar, lal* | Mum |
| foot | *pag* (draft) | device |

The new `guide-*` entries in `cook.json` `lines` are needed because a guide entry can only point at a line.

## Rejected clips
- *wiji*, *chad*: every cut runs together or is unclear.
- *tar*: silent, or it's *tari wij*.
- *waar*, *kap*: unclear.
- *pag*: probably Zafar asking.
- The second take of *ukar*: Zafar's voice is in it.
- The whole **chulo-bar** take has English in it; it is flagged in its note.

## Still placeholders
- Other guide steps: pour, roll, the pantry headline and the rest.
- "with" / "and".
- Other body parts and care items.
- *ukar* has no guide step ("boil").

## Needs an edit outside my files
1. `data/clinic/lang.json` `col-red` / `red` say ***laal***, Mum's tape says ***lal***. The heal games show *laal* with a device voice. Recommend changing it to *lal*.
2. The guide box speaks only when its speaker is tapped. The samosa and daar line stations read `data.stations.samosa` / `.daar` phases, which don't exist, so their box shows the default. Fill, fold and fry reach the screen only in the single-station labs. They need those phases in `stations` or a code fix. No code changed.

## Proof
- The core `planClips` on every line gives the table above.
- leak_cook, leak_clinic, check_clinic_kutchi and the cook/clinic unit tests pass.
- Sandbox `--touched` (chai-tray, maani-line, chop, stir, samosa, daar, clinic diagnosis and patient), 65 pages at laptop size: **0 new findings**, every flow reaches its end (one page my timeout killed was re-run and passed).
- Sound: no guide line or clinic word was spoken in any flow (the box is silent until tapped), so proof is the plan above.
- Shots: *Chulo bar!* shows in the box, Kutchi, unflagged, unclipped. No clinic flow shows the six clinic words (diagnosis asks "Where does it hurt?" as a placeholder).
