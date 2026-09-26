# Reference hand, round 3: 24 Sept 2026

The owner picked option B (`hand-ref-master-v1.png`) from round 2 and asked for three changes: skin much less orange and less saturated, a slimmer hand with longer fingers and no bones or veins, and a plain white linen sleeve rolled back in place of the embroidered kurta cuff. This round made 4 candidates: 2 edits of v1 and 2 fresh generates. **`hand-ref-master.png` is not overwritten. The owner chooses.**

Review sheet: `build/contact-sheets/hand-ref-round3.png` (checkerboard, v1 plus the 4 candidates, each with its sampled skin hex next to the target swatch). The candidates are in `assets/characters/hands/round3/`. The log is `build/reports/logs/round3.log`.

## Changes

- **`data/asset-list.json`:** `hand_pose` and `hand_pose_from_ref` now ask for "warm light tan skin, not orange, not saturated" (mid `#C49A78`, highlights `#D8B894`, shadows `#A07A60`), a slender hand with long fingers relative to a small palm, no visible bones, knuckle ridges, tendons or veins, and a plain white linen shirt sleeve rolled back between the elbow and the wrist, showing only at the very bottom edge or cropped out. There is a new `hand_ref_revise` edit template, and two new entries, `hand-ref-r3-edit` and `hand-ref-r3-gen` (group `hands-reference-r3`, 2 variants each). The reference pose no longer asks for "knuckles visible". The girl reskin is now a soft dusty-pink modern rolled sleeve plus three glass bangles.
- **Art bible:** section 2 has the new skin hex values and a note about orange drift. Section 7 adds shape and sleeve rules and a new sleeve/reskin table: boy white linen, girl a soft-coloured rolled sleeve plus bangles, girl at Eid adds mehndi, Nani unchanged. The section 9(e) and 9(f) templates and QA check 11 are updated to match.
- **Asset plan, section 1.2:** the new sleeve table, hand shape, skin tone, and a note that the look should be modern, not costume. **Cast doc:** a note that the owner's wife wants modern hints and nods, not caricature.

## Verdicts

The skin was sampled as the median of a 40×40 patch in the middle of the back of the hand. The target midtone is `#C49A78` (HSV saturation 0.39).

| Candidate | Skin (sat.) | Fingers vs palm | Sleeve | Verdict |
|---|---|---|---|---|
| v1 (round 2, old) | `#B46126` (0.79) | Short fingers, big square palm | Embroidered kurta cuff | Baseline |
| **r3 edit-v0** | `#D3833E` (0.71) | Clearly longer and slimmer than v1. The back of the hand is smooth, with faint finger creases | Soft cream-white rolled linen at the bottom edge. Good | Pass on shape and sleeve; skin still orange |
| **r3 edit-v1** | `#D58951` (0.62) | Long, slim fingers, a narrower palm and the slimmest wrist. There is a very faint bump on the back of the hand and light finger creases | Rolled white linen at the bottom edge, cropped naturally. Good | **Recommended**; skin still too orange |
| **r3 gen-v0** | `#D98B43` (0.69) | Long fingers, slightly fanned. Faint tendon shading on the back of the hand | The crispest white rolled sleeve | Pass on shape; the most saturated of the four, and fingers spread wider than the v1 pose |
| **r3 gen-v1** | `#DE9351` (0.64) | Long fingers, gently together. A smooth back, but a slightly longer forearm | Cream-white roll at the bottom edge | Close second; the lightest but still orange |

All four have clean alpha (70% of the frame fully transparent, no fringe on the checkerboard) and keep the top-down camera, with the back of the hand up and the forearm entering from the bottom.

**Skin: none of the four reaches the target through the prompt.** The candidates are lighter and less saturated than v1 (saturation 0.62–0.71 against 0.79), but still clearly orange against `#C49A78` (0.39). gpt-image-1 ignores the hex values and "not orange" here. The last panel on the sheet is a **post-process preview only**: a masked colour correction of edit-v1 onto `#C49A78` (`build/contact-sheets/hand-ref-round3-edit-v1-colour-preview.png`). It gets the tone right and leaves the white sleeve almost untouched, although the nails pick up a slight lilac tint.

## Recommendation

**`hand-ref-r3-edit-v1`.** It keeps the option B pose the owner liked, has the lowest saturation of the four, and has the slimmest hand with the longest fingers relative to the palm. The rolled linen sleeve sits right. Before it becomes `hand-ref-master.png`, colour-correct its skin in post to about `#C49A78`, as in the preview panel. Do this on the reference only, so every edit inherits the right tone. gen-v1 is the alternative if the owner prefers a smoother back of the hand.

## Cost

4 images (2 edit, 2 generate) at the configured $0.04 each, so **$0.16 of the $1.50 budget**. The wall time was 98 s. As in the smoke test, real billing may be higher if the API's default quality is high.
