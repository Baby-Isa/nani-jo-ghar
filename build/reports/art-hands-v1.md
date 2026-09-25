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
- d2-c-hold-e (girl and Nani): a small speck of sleeve colour remains on the forearm.
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

---

# v2: rings per pose, the failing masters (25 Sept 2026)

**Brief (owner):** Nani's rings were "all over the place". Place them per pose on the actual ring finger, visible only where the finger is; finish the 9 failing masters with the API, at most 2 tries each, $5 at most.

## Ring and bracelet method

`build/hand_landmarks.py` (new) runs MediaPipe's hand-landmark model (`hand_landmarker.task`, fetched on first use into the git-ignored `build/models/`) on every passing master. It found 60 of the 62 hands in the 54 masters. It missed the right hand of d6-f2, whose joints are marked by hand, and the rear hand of e4-f2, which is hidden anyway. On tight fists, pinches and a ring of fingertips its joints are unreliable; those poses are pinned by eye (below). Each master is run on three backgrounds and mirrored, and the detections of one hand are merged by the median of their joints. Hands are matched to the pose's hands by the measured wrist.

- **Ring:** on the ring finger's first segment, from the base knuckle (MCP, landmark 13) to the middle joint (PIP, 14): 35% along it, and at least just past the web, where the finger leaves its neighbours. On the back of the hand the MCP landmark sits on the knuckle, so 35% alone put the ring on the knuckle (a5-wave-f1). The ring is turned to the segment and scaled to the finger's width, measured across it from the alpha edge or the dark crease against the next finger and bounded by the knuckle spacing. A curled finger seen from the back (fists, grips) takes the hand's axis for its angle, because the foreshortened segment's own angle is noise.
- **View:** read from the handedness of the wrist/index/pinky triangle against the hand's known side. *back*: band and stone; *palm* or *side*: a thin band, shaded so it wraps round the finger; *hidden*: nothing. Several AI masters are anatomically the other hand (a3 and a8 palm-ups, e7: palms drawn as left hands; a7 and e3-count-2: backs drawn as left hands), so their views are pinned by eye.
- **Visibility pins** (`build/hand_ring_pins.py`, applied on every run; `"source": "manual"` / `"view_source": "manual"` in the anchors): the ring is hidden where the ring finger is out of sight. That covers the fists and grips seen from the palm or with the finger tucked (b2-t, b2-e, e1), the pinches and grips where it curls behind or under (c1 ×4, c2, c3 ×2, c5 ×2), the ring of fingertips (d1-f2-e), the thumb in front (d2-c-hold-e), the rear hand of the clap (e4-f2) and the phone grip (f4 ×2). The right hand of d6-f2 was not detected; its joints are marked by eye (palm view).
- **Bracelet and bangles:** at the wrist joint, moved a little up the arm, across the forearm. The forearm's direction is the narrowest cut through the arm there, searched within 50° of the measured arm angle; that cut's length is the bracelet's width. Where the wrist joint was misread onto the fingers (d1-f2-e automatically; b2-e pinned), the measured wrist anchor is used instead.
- **Compositing** (`build/skin_hands.py`): rings are clipped to the hand's silhouette; Nani's left hands (the mirrored masters) get the diamond ring and no bracelet, the right the aqiq and the tennis bracelet (Cast). The aqiq stone is a little smaller than v1's.

**Per-pose verification:** every pose was checked on large debug sheets. `build/contact-sheets/hands-rings-debug-1…5.png` show the joints, the ring outline (green back, yellow palm/side, red cross hidden) and the bracelet line, with a zoom on each ring. The baked results were checked on `hands-nani-rings-1…9.png` and `hands-player-girl-rings-1…5.png`: every image, with zooms on each ring and on the wrist jewellery. The first bake showed six faults, fixed before the final bake:
- rings on the knuckle instead of the finger (the web rule);
- a flat, rod-like palm band (now shaded to wrap);
- the bracelet on the fist in b2-e and d1-f2-e (the anchor fallback);
- a diagonal bracelet on f2-drum (the narrowest-cut direction);
- sleeve-colour specks on d2-c-hold-e and f4 (erase boxes);
- the red sleeve climbing both forearms of the new d6-f1 (a5's erase box, mapped onto both arms).

## The 9 failing masters

| Master | Result | How |
|---|---|---|
| b1-handle-grip-t | **Still failing** | Draft + 2 medium tries on a guide (the approved fist with the handle painted in). Try 1 laid a digit along the handle but showed only three knuckles; try 2 pointed the index up beside it. Until it is solved, the game can draw the tool under `d4-squeeze-f2-tight-t`. |
| a2-heel-push-t | **Still failing** | Draft + 2 medium tries on a guide (a1 foreshortened in code). Try 1 invented a ball under the hand, try 2 redrew a full-length flat hand. |
| c2-tripod-grip-t | Pass | Guide edit, medium, try 1: a pencil in a tripod grip. |
| c3-side-pinch-t | Pass | Guide edit, medium, try 1: card pinched, thumb pad on the card. |
| c3-side-pinch-e | Pass | Guide edit, medium, try 1: card held up. |
| d3-two-hand-bowl-t | Pass | Guide edit (the b4 pair plus a disc), medium, try 1: backs of both hands, fingers over the rim. |
| d6-two-hand-catch-f1-open-e | Pass | Made in code: `a5-wave-f1-e` and its mirror, a hand's width apart. The API kept drawing palms. |
| e3-count-4-e | Pass | Made in code from `e3-count-5-e`, with the thumb cut away along a curved palm edge, shaded. Try 1 (masked edit) and try 2 (thumbless guide) both put the thumb back. |
| e5-arm-up-fist-e | Pass | A copy of `d4-squeeze-f2-tight-t`: a raised fist seen from behind is the same view as the back of the fist from above. Draft and try 1 drew the front of the fist. |

The low-quality drafts and the first prompts (a passing master as a second reference) failed across the board: the model ignores a second reference image. What worked was an **edit of a guide image**: an approved master with the placeholder already painted in (`build/hand_guides.py`, guides in `sources/art/hands/guides/`).

**Key-out v2** (`gen_assets.key_out_magenta2`, entries with `"key_out": "magenta2"`): the medium renders were good, but the v1 key-out chewed the finger edges and nails where they overlapped the magenta. The v1 key and its clean-ups work in HSV hue, where the placeholder's crimson shadow, orange skin shadow and pink nails overlap. The new key works in Lab:
- it removes the placeholder's core (hue 290–18°, chroma > 28);
- it unmixes a thin band round it between the image's skin colour and the placeholder's;
- it despills red-orange bounce light;
- it clears the placeholder's grey edge ghosts.

The skin and scale normalisers ran as before. Review at full size: `build/reports/data/hands-master-v2-review.json`, sheet `build/contact-sheets/hands-master-v3.png`: **54 of 56 pass.**

Lesson for next time: `build/raw/` keeps only the latest output per asset, so b1's try 1 was overwritten by try 2. Copy a promising raw aside before retrying.

## Characters (re-skinned)

| Set | Images |
|---|---|
| player-boy | 54 |
| player-girl | 54 (bangles at the wrist joint) |
| nani | 100 (54 poses + 46 mirrored left hands) |

Sheets: `hands-player-boy.png`, `hands-player-girl.png`, `hands-nani.png`, plus the ring sheets above.

## Cost (this round)

| Run | Images | Quality | Cost |
|---|---|---|---|
| Drafts, first prompts (log 01) | 9 | low | $0.10 |
| Drafts, guide prompts (log 02) | 8 | low | $0.09 |
| Medium try 1 (log 03) | 8 | medium | $0.34 |
| Medium try 2 (log 04) | 3 | medium | $0.13 |
| **Total** | **28** | | **$0.66 images + ≈ $0.17 input tokens ≈ $0.83** |

Every run's pre-flight estimate was under $1; the budget was $5. The image-output prices are the pipeline's table, and the manifest's `usage` records match them (1,056 output tokens for a medium 1024², 272 for a low one). Input tokens (one ~200-token reference image and ~700 text tokens per edit) add about $0.006 a request. Logs: `build/reports/data/hands-v2-log-0*.txt`.

## Still open

- b1 (knife/spatula grip, thumb on the handle) and a2 (heel push): more API tries are unlikely to help. b1 probably needs a hand-drawn or 3D-posed thumb; a2 may be better dropped for a1 with a squash animation.
- The d6-f1 pair and e5 reuse approved hands, so they share those masters' lighting: d6-f1's left hand is lit from the right, the same known issue as Nani's mirrored left hands.
- Ring placement is checked on stills; check it in the game at play size, especially the thin palm bands.
