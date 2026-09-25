# Hands v1: report

**Branch:** `claude/art-hands-v1`. **Dates:** 24 Sept 2026, 18:41 UTC (first master run) to 25 Sept 2026, about 02:00 UTC. **Time:** about 7½ hours, across two sessions. The first session made the reference hands, the masters and a retry round; this one fixed the masters, then built the characters.

## Outcome

| Set | Images | Pass | Notes |
|---|---|---|---|
| Masters (`assets/characters/hands/master/`) | 56 | **47** | 9 still fail after two retries, listed below |
| player-boy (`skins/player-boy/`) | 47 | 47 | The passing masters as they are |
| player-girl (`skins/player-girl/`) | 47 | 47 | Dusty-pink sleeve (#D9A5A0), red, green and gold glass bangles on each wrist |
| nani (`skins/nani/`) | 88 | 88 | 47 right hands + 41 left hands (single-hand poses); see the Nani notes |
| player-girl-eid | 0 | – | Waiting for the mehndi overlay texture; set `overlay.texture` in `data/hand-skins.json` and re-run |

Contact sheets (git-ignored folder, the sheets themselves are committed): `build/contact-sheets/hands-master-v2.png` (finger count and verdict under each hand), `hands-anchors-check.png` (anchors drawn on the masters), `hands-player-boy.png`, `hands-player-girl.png`, `hands-nani.png`.

## Step 1: masters

**Owner and orchestrator review, checked against the files:**
- **Fixed:** a5-wave-f2 (redrawn from frame 1), d1-grab-f1-open-t (five digits now), c2 and e6 colour, b5-hook-e lighting, a8-cupped-t and d6-f2 orange palms, a7 background (and direction: flipped in post), b3 (stick keyed out), d3 and f2 camera (f2 fixed, d3 still fails), e4-f2 merged hands (now two hands), e2 and f1 forearms from the bottom where the pose allows.
- **Scale:** every master is rescaled so the forearm just above the sleeve is 250 px wide, matching the reference hand (`gen_assets.py`, `forearm_widths()` and `normalise_scale()`, two passes). The canvas grows instead of clipping fingertips, so some masters are bigger than 1024². Place hands by where the arm leaves the bottom edge. Final forearm widths: `build/reports/data/hands-master-v2-forearm-px.txt` (most 244–260 px).
- **Skin:** the old midtone-only normaliser missed orange palms and pale, differently lit hands. The new one matches the reference's lightness and chroma percentiles and its hue (`match_skin_distribution()`).
- **Grips:** magenta placeholders are drawn behind the fingers; the dark rim they leave is removed.

**My own review** of all 56 at full size, with finger counts: `build/reports/data/hands-master-v2-review.json`. **Still failing (9):**

| Master | Problem |
|---|---|
| a2-heel-push-t | Reads as a flat palm |
| b1-handle-grip-t | Thumb not along the handle (the knife/spatula grip: needed first) |
| c2-tripod-grip-t | Grip unreadable |
| c3-side-pinch-t, c3-side-pinch-e | Messy key-out / card gap unclear |
| d3-two-hand-bowl-t | Hands small, artefacts |
| d6-two-hand-catch-f1-open-e | Palm shows instead of the back of the hand |
| e3-count-4-e | Thumb sticks out: reads as five |
| e5-arm-up-fist-e | Palm side of the fist |

The art bible's QA checklist gained four checks: finger count, hand scale, hand camera, light and skin, and tool gaps.

## Step 2 and 3: characters in code

The API reskins failed: 39 of 47 girl reskins redrew the hand, and the sleeve came out coral. On the orchestrator's instruction (Zafar approved), they were deleted and replaced with **code-based skinning**. Nani's API poses followed: 13 of 25 passed review, but rings wandered between fingers and poses. Her API images are archived, unused, in `sources/art/hands/nani-api-v1/`, and no more hand images are generated.

`build/skin_hands.py` (masks and wrist finder in `build/hand_masks.py`), for each passing master and each character in `data/hand-skins.json`:
1. **Skin:** the masked skin is recoloured to the character's midtone (Nani `#BE8F6F`).
2. **Sleeve:** the cream sleeve is masked on the untouched master, clipped at the cuff's top edge along each arm, and recoloured keeping its shading.
3. **Jewellery:** sprites drawn in code are placed at the pose's anchors: rings (aqiq cabochon in a bezel, round solitaire in six claws; stone view, palm view, side view), a tennis bracelet and glass bangles (back and front halves, so they go round the wrist). The loose sprites are saved in `skins/jewellery/` for the game to animate.
4. **Overlay:** a texture masked to the back of the hand (for mehndi).

**Anchors** (`data/hand-anchors.json`): for every hand in every passing master, the wrist point, angle and width (automatic finder, 5 set by eye) and the ring-finger point, angle and view (read off gridded views, checked on the overlay sheet; 3 corrected). Ring anchors are null where the pose hides the ring finger (tight pinches, d1-f2-e, d2-e, d6, f4).

**Nani** (Cast, "Jewellery (corrected 24 Sept)"; sheet v2): no bangles; right hand, red aqiq ring and thin diamond tennis bracelet; left hand, round solitaire diamond. Her left hands are the master mirrored and then given her left-hand jewellery, so their light falls from the upper right rather than the upper left. Her hands keep the child's hand shape: code can't age them.

## Remaining issues

- The 9 failed masters, so none of those poses exists for any character yet. b1 (knife and spatula) matters most; it may need the tool drawn on its own layer rather than another prompt.
- Eid mehndi texture not made yet.
- Nani's left hands are lit from the wrong side, and her hands look young (above).
- b4-rolling-pin: a thin tan sliver stays at the edge of each cuff on the girl and Nani.
- Very pale forearms (a5-wave-f1) needed a hand-set erase box (`SLEEVE_ERASE` in `skin_hands.py`); any new master should be checked on the girl or Nani sheet for sleeve colour leaking onto the arm.
- Ring anchors were placed by eye: check them in the game at play size, especially palm and side views.

## Cost

| Run | Images | Quality | Real cost |
|---|---|---|---|
| Eye-level reference, masters, master retries (logs 01–08) | 129 | high (API default, unset) | ≈ $21.54 |
| Girl API reskins (log 11, deleted) | 47 | high | ≈ $7.85 |
| Nani reference hands, first rounds (logs 12–13) | 6 | high | ≈ $1.00 |
| Nani reference hands v2/v3, Nani poses (logs 15–17) | 32 | medium | ≈ $1.34 |
| **Total** | **214** | | **≈ $31.73** |

This session alone: 123 images, about $16.54. The session budget was $15; the owner approved the extra Nani spend. The first 182 images went out with `quality` unset, which the API bills as high (~$0.167 each). The pipeline logged only $8.63 because it assumed $0.04 an image. The pipeline has been fixed since: quality is always sent, medium is the default, and there's a pre-flight estimate. Building the characters in code costs nothing.
