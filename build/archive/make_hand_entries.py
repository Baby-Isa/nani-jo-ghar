#!/usr/bin/env python3
"""Writes the hand entries of data/asset-list.json (hands v1, 24 Sept 2026):
the eye-level reference, the master set (asset plan section 1.3, A1-F5, in
the cameras listed, every frame) and Nani's set with explicit right and
left hands. The girl set is made in code from the masters
(build/skin_hands.py), not with the image API.

The poses live here, in one table, so a wording fix is one edit and a
re-run; gen_assets.py then regenerates only the entries whose prompt
changed. Non-hand entries in the asset list are kept as they are.

    python3 build/make_hand_entries.py && python3 build/gen_assets.py --dry-run
"""
import json
import os

GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSET_LIST = os.path.join(GAME, "data", "asset-list.json")

H = "assets/characters/hands"
REF_T = f"{H}/hand-ref-master.png"
REF_E = f"{H}/hand-ref-eye-level.png"

CAM = {
    "T": "Camera: orthographic top-down view, camera directly overhead looking straight down at the worktop at 90 degrees; we see the BACK of the hand (palm facing down, towards the worktop), never the palm; the forearm lies along the worktop and enters from the bottom edge of the frame, pointing up towards the top edge; no horizon, no sides.",
    "T-palm": "Camera: orthographic top-down view, camera directly overhead looking straight down at the worktop at 90 degrees; the hand is turned over, palm UP, so from above we see the palm and the inside of the fingers; the forearm lies along the worktop and enters from the bottom edge of the frame; no horizon, no sides.",
    "E": "Camera: eye level, first person: we look straight ahead at our own hand held up in front of us, exactly as in the attached eye-level reference; we see the BACK of the hand, towards the viewer (the palm faces away from us); the forearm rises from the bottom edge of the frame; no worktop.",
    "E-back": "Camera: eye level, first person: this is OUR OWN right hand seen from behind, from our own eyes, exactly as in the attached eye-level reference: the back of the hand, the knuckles and the fingernails face us; the palm and its lines face away from us and are NOT visible. Never show the palm. The forearm rises from the bottom edge of the frame; no worktop.",
    "E-palm": "Camera: eye level, first person: we look straight ahead and a little down at our own hand held out in front of us at chest height; the hand is turned palm UP, so we see the palm, foreshortened; the forearm enters from the bottom edge of the frame; no worktop.",
}

# Grip poses: the tool is a separate sprite, so the hand must leave a clear,
# empty space exactly where it will sit.
GAP = " The tool is a separate image placed later: leave that space completely empty and clearly visible, with nothing drawn in it."

# Retry round (hands v1): grips are drawn round a flat magenta PLACEHOLDER
# object, which gen_assets.py keys out (key_out: magenta), so the fingers
# close round something real and the gap is exactly the tool's shape.
KEY = (" The object is a PLACEHOLDER: draw it as a plain, flat, pure magenta (#FF00FF) shape with no shading,"
       " no texture and no highlights, so it can be cut out afterwards to leave the exact gap for the real tool.")

# Hands v1 step 1 (master fixes): the placeholder sits BEHIND the fingers,
# so keying it out leaves the tool's gap without slicing through a finger
# (the tool sprite is layered behind the hand in the game).
BEHIND = (" Wherever the fingers or the thumb overlap the magenta shape they are IN FRONT of it:"
          " it never covers any part of the hand.")
FIVE = " All five digits clearly visible and separate: the thumb and four fingers."

# (code, slug, camera-key, pose text, two_handed, note)
# Frames of 2-frame poses are separate rows with -f1/-f2 slugs.
POSES = [
    # A. Open hand
    ("a1", "flat-palm", "T", "flat palm pressed down on the worktop, fingers together and straight, thumb resting alongside, as if pressing and kneading dough", False),
    ("a2", "heel-push", "T", "heel-of-hand push, seen from directly above: the back of the hand towards the camera, the wrist bent back so the hand is tipped up on its heel; the four fingers point up towards the camera, so from above they are strongly foreshortened and look SHORT, we see mostly their tips and nails; the thumb relaxed at the left side; the forearm lies flat along the worktop from the bottom edge" + " Nothing in or under the hand: no dough, no food, no object.", False),
    ("a3", "palm-up", "T-palm", "palm up and open on the worktop, fingers together and relaxed, very slightly curved, thumb relaxed at the side, as if waiting to receive something ('here you are')", False),
    ("a3", "palm-up", "E-palm", "palm up and open, held out forwards, fingers together and relaxed, pointing away from us, thumb relaxed at the side, as if offering or waiting to receive something", False),
    ("a4", "reach", "E", "reaching up and forwards towards a high shelf: arm extended towards the top of the frame, fingers spread and slightly curved, back of the hand towards us", False),
    ("a5", "wave-f1", "E-back", "waving hello, frame 1 of 2: hand raised, fingers together pointing up, the whole hand tilted about 20 degrees to the LEFT at the wrist", False),
    ("a5", "wave-f2", "E-back", "waving hello, frame 2 of 2: EXACTLY the same hand as the second attached image (frame 1), with the fingers together pointing up and the fingernails towards us, now tilted about 20 degrees to the RIGHT at the wrist; only the tilt changes", False),
    ("a6", "palm-out", "E-back", "palm pushed out forwards, away from us, as for 'stop' or a high five: hand raised, wrist bent back, fingers straight up and slightly apart", False),
    ("a7", "hand-on-heart", "E-back", "right hand laid flat on our own chest over the heart (salaam, thank you), seen from our own eyes looking down: the forearm rises from the BOTTOM edge of the frame just right of centre and bends at the wrist so the hand lies across the frame, fingers together pointing to the LEFT and slightly up, the back of the hand and the knuckles towards us, the thumb along the top edge of the hand. Draw ONLY the hand and forearm: no chest, no shirt front, no body, nothing behind the hand, fully transparent around it" + FIVE, False),
    ("a8", "cupped", "T-palm", "palm up with the fingers held together and curled up to make a shallow bowl, thumb pressed along the side, as if holding a small pile of seeds or spices; the inside of the cup is empty and visible from above", False),
    ("a8", "cupped", "E-palm", "palm up with the fingers held together and curled up to make a shallow cup, thumb along the side, held out in front as if catching drips of rain; the inside of the cup is empty", False),
    # B. Handle grip
    ("b1", "handle-grip", "T", "the knife-and-spatula grip, seen from directly above: a straight magenta handle 2.5 cm thick runs straight forwards from under the heel of the hand, through the fist, and out the front towards the top of the frame; the four fingers wrap round it (we see their backs and knuckles); the THUMB is NOT in the fist: it lies flat on TOP of the handle, pointing forwards along it, its whole length and its thumbnail clearly visible on top of the magenta handle, like a person pressing a knife handle with the thumb" + KEY + BEHIND, False),
    ("b2", "vertical-grip", "T", "fist closed around an invisible vertical stick (pestle, churner) about 3 cm thick that points straight up at the camera: we look down on the top of the fist, where the curled index finger and the thumb wrapped over it make a round empty hole about 3 cm across in which the stick stands" + GAP, False),
    ("b2", "vertical-grip", "E-back", "fist held upright in front of us round a vertical rod 3 cm thick (umbrella, broom or torch handle) that sticks 5 cm out of the TOP of the fist (above the curled index finger and thumb) and 5 cm out of the BOTTOM of the fist (below the little finger); we see the back of the hand and the knuckles; the fingers curl round the far side of the rod, the thumb wraps round the near side" + KEY + BEHIND, False),
    ("b3", "stick-grip", "E-back", "a loose grip round a rod 2.5 cm thick (drumstick, racquet or bat handle) held in front of us: the rod passes through the fist and leaves the top of the fist between the thumb and the index finger, pointing up and forwards at about 45 degrees for 12 cm, and sticks 2 cm out of the bottom of the fist below the little finger; we see the back of the hand; the thumb lies along the side of the rod" + KEY + BEHIND, False),
    ("b4", "rolling-pin", "T", "rolling a flatbread: both palms rest on the two ends of an invisible horizontal rolling pin about 3 cm thick lying across the frame, the hands about 25 cm apart; palms down, fingers extended forwards over the pin, slightly curved over it; a clear empty horizontal band under and between both hands where the pin sits" + GAP, True),
    ("b5", "hook-grip", "T", "hook grip seen from directly above: we see the back of the hand; the four fingers curled together into a hook round a horizontal rod 2 cm thick (a jug handle) that runs left-right UNDER the curled fingers: hidden where the fingers wrap round it and sticking out 4 cm on both sides of the hand, clearly visible left and right; the thumb rests along the side of the index finger" + KEY + BEHIND, False),
    ("b5", "hook-grip", "E-back", "carrying a basket, in front of us: the forearm rises vertically from the BOTTOM edge of the frame, the sleeve at the bottom; at the top the four fingers hook forwards over a horizontal magenta rod 2 cm thick that runs left-right across the frame and sticks out 4 cm on both sides of the hand; we see the back of the hand and the knuckles; the thumb rests on the side of the index finger" + KEY + BEHIND, False),
    # C. Pinch and fingertip
    ("c1", "pinch-f1-open", "T", "fingertip pinch, open: thumb and index fingertips about 3 cm apart, ready to pick up something tiny; the other fingers loosely curled underneath", False),
    ("c1", "pinch-f2-closed", "T", "fingertip pinch, closed: the thumb and index fingertips pressed together as if holding a tiny spice or bead between them (nothing drawn); the other fingers loosely curled underneath", False),
    ("c1", "pinch-f1-open", "E-back", "fingertip pinch, OPEN, held up in front of us: the thumb and index fingertips clearly APART, with a 3 cm open gap between their tips (not touching, not an OK sign); the other fingers loosely curled", False),
    ("c1", "pinch-f2-closed", "E", "fingertip pinch, closed, held up in front of us: thumb and index fingertips pressed together as if holding a tiny bead or coin (nothing drawn); the other fingers loosely curled", False),
    ("c2", "tripod-grip", "T", "holding a pencil as if writing, seen from directly above: the back of the hand; a thin straight magenta rod 1 cm thick and 12 cm long is held between the tips of the thumb, index and middle fingers and points forwards and to the left, towards the upper left corner, well clear of the hand; the ring and little fingers curled under; the rod is the only object" + KEY + BEHIND, False),
    ("c3", "side-pinch", "T", "holding a photo card by its bottom edge, seen from directly above: a flat magenta rectangle 6 x 9 cm lies flat in front of the hand towards the top of the frame; its bottom edge is pinched between the thumb on top and the curled index finger underneath; the other fingers curled under the palm; we see the back of the hand and the thumb lying on the card" + KEY + BEHIND, False),
    ("c3", "side-pinch", "E-back", "holding up a photo card in front of us: a flat upright magenta rectangle 6 x 9 cm stands above the hand; its bottom edge is pinched between the thumb (on the side towards us, its nail visible) and the curled index finger behind it; the other fingers curled; we see the back of the hand and the thumb on the card; the forearm rises from the bottom edge" + KEY + BEHIND, False),
    ("c4", "point", "T", "pointing index finger: the index finger straight and extended forwards towards the top of the frame, the other fingers curled under the palm, the thumb tucked alongside the middle finger", False),
    ("c4", "point", "E", "pointing index finger: the index finger straight and pointing up and forwards, the other fingers curled into the palm, the thumb folded across them; the default tap hand", False),
    ("c5", "two-hand-fold", "T", "folding with two hands: both hands close together in the middle of the frame, each with thumb and index fingertips pinched as if folding over the edge of a samosa or a cloth; the two pinches nearly meet in the centre; the other fingers loosely curled", True),
    # D. Whole-hand hold and fist
    ("d1", "grab-f1-open", "T", "about to grab, seen from directly above: we see the back of the hand, palm down, hovering over the worktop; the thumb at the left and the four fingers (index, middle, ring, little) spread apart and curved down like a claw, ready to close on something" + FIVE, False),
    ("d1", "grab-f2-closed", "T", "grabbing, seen from directly above: we see the back of the hand and the knuckles; the fingers wrap down round a ball 5 cm across under the hand; the ball shows between the thumb and the index finger and just beyond the fingertips" + KEY + BEHIND, False),
    ("d1", "grab-f1-open", "E", "reaching to grab, in front of us, seen from behind: the back of the hand and the knuckles towards us (the palm faces away, NOT visible); the fingers spread and curved forwards like a claw ready to close on something" + FIVE, False),
    ("d1", "grab-f2-closed", "E-back", "grabbing, in front of us: hand closed round a ball 5 cm across, fingers wrapped round it and thumb against them; part of the ball shows between the fingers and thumb" + KEY, False),
    ("d2", "c-hold", "T", "C-shaped hold seen from directly above, round an upright glass standing on the worktop: the glass seen from above is a flat disc 7 cm across (about as wide as the palm is long); the thumb curves round the near side of the disc and the fingers round its far side, making a wide C round it; we see the back of the hand" + KEY + BEHIND, False),
    ("d2", "c-hold", "E", "C-shaped hold round an invisible upright glass about 7 cm across held up in front of us: the fingers curve round the far side of the glass and the thumb the near side, leaving a clear, empty, upright round space inside the curve" + GAP, False),
    ("d3", "two-hand-bowl", "T", "seen from directly above: two hands, each the SAME size as the reference hand, hold a flat magenta disc 18 cm across (a bowl seen from above, about one and a half hand lengths across) from its left and right sides; the fingers of each hand curl over the disc's rim, the thumbs on top of the rim; we see the backs of both hands; both forearms come in from the bottom edge, one at the lower left and one at the lower right; the hands and the disc fill most of the frame" + KEY + BEHIND, True),
    ("d4", "squeeze-f1-half", "T", "squeezing half a lemon, frame 1 of 2, seen from directly above: we see the back of the hand and the knuckles, the fist half-closed round a half lemon 6 cm across under the hand; the lemon shows between the thumb and the index finger; the curled fingertips are hidden under the hand; no palm visible" + KEY + BEHIND, False),
    ("d4", "squeeze-f2-tight", "T", "squeezing, frame 2 of 2, seen from directly above: we see the back of the fist and the knuckles; the fist squeezed tight, the thumb wrapped over the index finger; the curled fingertips are hidden under the hand; no palm visible", False),
    ("d5", "throw-release", "E-back", "throwing, the moment of release: the arm forwards, the wrist flicked forwards and the fingers just opening and spreading as they let go of a ball", False),
    ("d6", "two-hand-catch-f1-open", "E-back", "about to catch a ball, frame 1 of 2, seen from our own eyes: both hands raised in front of us about 15 cm apart, fingers up and spread; we see the BACKS of both hands: the knuckles, the fingernails and the backs of the fingers; the palms face away from us towards the ball and are hidden; no palm lines visible" + FIVE, True),
    ("d6", "two-hand-catch-f2-closed", "E", "catching, frame 2 of 2: both hands together, cupped round an invisible ball about 8 cm across, fingers of each hand curled round it, leaving a clear round hollow between them where the ball sits" + GAP, True),
    # E. Social and number gestures
    ("e1", "thumbs-up", "E", "thumbs up: fist closed with the thumb pointing straight up; we see the back and little-finger side of the fist", False),
    ("e2", "handshake", "E-back", "our own right hand held out for a handshake, seen from behind, from our own eyes: the forearm rises from the BOTTOM edge of the frame, a little right of centre, and points forwards and slightly to the left; the hand is turned on its side: thumb on top, fingers together pointing forwards and to the left, the palm facing left (not visible); we see the thumb side and the back of the hand", False),
    ("e3", "count-1", "E-back", "counting on the fingers, ONE, seen from behind: only the index finger straight up, its fingernail facing us; the middle, ring and little fingers folded down, their knuckles facing us; the thumb folded behind them. Exactly one finger up", False),
    ("e3", "count-2", "E-back", "counting on the fingers, TWO, seen from behind: the index and middle fingers straight up and slightly apart, their fingernails facing us; the ring and little fingers folded down, knuckles facing us; the thumb folded behind them. Exactly two fingers up", False),
    ("e3", "count-3", "E-back", "counting on the fingers, THREE, seen from behind: the index, middle and ring fingers straight up and slightly apart, their fingernails facing us; the little finger folded down; the thumb folded behind it. Exactly three fingers up", False),
    ("e3", "count-4", "E-back", "counting FOUR, seen from behind: the index, middle, ring and little fingers straight up and slightly apart, their nails facing us; the THUMB is folded flat across the palm, completely HIDDEN behind the hand, not visible at all. Only four digits can be seen", False),
    ("e3", "count-5", "E-back", "counting on the fingers, FIVE, seen from behind: all four fingers and the thumb straight and spread wide apart, fingernails facing us. All five fingers up", False),
    ("e4", "clap-f1-apart", "E-back", "clapping, frame 1 of 2: both hands raised in front of us, 20 cm APART with clear empty space between them, not touching, not overlapping; each hand upright with the fingers together pointing up and its palm facing the other hand, so each is seen edge-on from behind (its thumb side and a little of its back); the left forearm rises from the bottom left, the right from the bottom right" + FIVE, True),
    ("e4", "clap-f2-together", "E", "clapping, frame 2 of 2: both hands raised in front of us, the palms pressed flat together in the centre, fingers together pointing up; seen from behind and a little to the right, so the two hands read clearly as two separate hands: the back of the right hand and its thumb in front, the left hand behind it; each hand has a thumb and four fingers; two forearms rising from the bottom edge", True),
    ("e5", "arm-up-fist", "E-back", "celebration, seen from BEHIND our own raised fist: the forearm rises vertically from the bottom edge, and at the top a closed fist; we see the BACK of the hand: the four knuckles in a row along the top, the backs of the fingers, and the thumb wrapped round at the left side; the fingertips, fingernails and palm are hidden on the far side, NOT visible (the left arm is this image mirrored)", False),
    ("e6", "stretch", "E-back", "stretching on waking: the right arm reaching straight up, the hand open with the fingers spread, seen from behind (back of the hand and fingernails towards us); the hand drawn at the SAME size in the frame as the reference hand, the fingertips close to the top edge (the left arm is this image mirrored)" + FIVE, False),
    ("e7", "shrug", "E-palm", "a shrug, 'I don't know': the right hand held out to the side at chest height, palm up and open, fingers relaxed and slightly spread, the forearm coming in from the lower right (the left hand is this image mirrored)", False),
    # F. Music, sport and play
    ("f1", "piano-f1-raised", "E-back", "piano hand, frame 1 of 2: the forearm comes up from the BOTTOM edge of the frame (not from the side) and the hand arches forwards over an invisible keyboard further down, seen from behind and a little above: we see the back of the hand and the knuckles, the fingers curved down, the fingertips raised a little above the keys" + FIVE, False),
    ("f1", "piano-f2-pressed", "E-back", "piano hand, frame 2 of 2: the forearm comes up from the BOTTOM edge of the frame (not from the side) and the hand arches forwards over an invisible keyboard further down, seen from behind and a little above: we see the back of the hand and the knuckles, the fingers curved down, the fingertips pressing down on the keys, a little lower than in frame 1" + FIVE, False),
    ("f2", "drum-cupped", "T", "hand-drum slap with a cupped hand, seen from DIRECTLY ABOVE looking straight down at the worktop: the back of the hand, palm down; the hand cupped into a raised dome: the fingers together and curved down so only the fingertips touch the surface, the knuckles the highest point, the forearm lying flat along the worktop from the bottom edge; from above the curved fingers look noticeably shorter than on a flat hand (the flat-hand slap is A1)", False),
    ("f4", "phone-two-hands", "E", "holding a phone or camera up to take a photo: both hands in front of us holding an invisible horizontal phone about 15 x 7 cm, the thumbs on its near face at the two lower corners, the index fingers along its top edge behind it; the rectangular space between the hands is empty" + GAP, True),
]
# F3 (racquet/paddle) is B3 plus a tool sprite, and F5 (kite string) is C1
# with a string sprite (asset plan 1.3): no new images, noted in the list.
# Two-frame poses: the other frame is attached as a second reference so the
# pair matches (hand size, skin, light, sleeve). Frame 2 follows frame 1,
# or, where only frame 1 is redone, frame 1 follows the kept frame 2.
PAIR = {
    "hand-a5-wave-f2-e": "hand-a5-wave-f1-e",
    "hand-d1-grab-f2-closed-t": "hand-d1-grab-f1-open-t",
    "hand-d4-squeeze-f2-tight-t": "hand-d4-squeeze-f1-half-t",
    "hand-d6-two-hand-catch-f1-open-e": "hand-d6-two-hand-catch-f2-closed-e",
    "hand-e4-clap-f2-together-e": "hand-e4-clap-f1-apart-e",
    "hand-f1-piano-f2-pressed-e": "hand-f1-piano-f1-raised-e",
}
# Renders that were right except drawn as the mirror image: flipped in post.
FLIP = {"hand-a7-hand-on-heart-e"}

PAIR_NOTE = (" A second image is attached: the other frame of this same pose. Match its hand size, hand shape,"
             " skin colour, lighting and sleeve exactly.")

ALIASES = {"f3-racquet": "hand-b3-stick-grip-e", "f5-kite-string": "hand-c1-pinch-f2-closed-e"}


def master_id(code, slug, cam):
    return f"hand-{code}-{slug}-{cam.split('-')[0].lower()}"


def build():
    entries = []
    entries.append({
        "id": "hand-ref-eye",
        "group": "hands-reference-eye",
        "output": f"{H}/eye-level/hand-ref-eye.png",
        "mode": "edit",
        "reference_images": [REF_T],
        "template": "hand_ref_to_eye_level",
        "fields": {},
        "variants": 2,
        "_note": "Eye-level reference, an edit of the signed-off master. The chosen variant is copied to hand-ref-eye-level.png and every eye-level pose is edited from it.",
    })
    masters = []
    for code, slug, cam, pose, two in POSES:
        eid = master_id(code, slug, cam)
        ref = REF_T if cam.startswith("T") else REF_E
        e = {
            "id": eid,
            "group": "hands-master",
            "output": f"{H}/master/{eid}.png",
            "mode": "edit",
            "reference_images": [ref],
            "template": ("hands_two_from_ref" if two else "hand_pose_from_ref") + ("_keyed" if KEY in pose else ""),
            "fields": {"camera": CAM[cam], "pose": pose},
            "camera": cam.split("-")[0],
        }
        if KEY in pose:
            e["key_out"] = "magenta"
        if eid in FLIP:
            e["flip_output"] = True
        if eid in PAIR:
            e["reference_images"].append(f"{H}/master/{PAIR[eid]}.png")
            e["fields"]["pose"] += PAIR_NOTE
        if two:
            e["_note"] = "Two-handed: drawn as one image (the hands touch or share one object)."
        entries.append(e)
        masters.append((e, two, cam))

    # Girl and girl-Eid reskins are no longer made with the image API (hands
    # v1, orchestrator's change of plan, 24 Sept 2026): build/skin_hands.py
    # recolours each passing master's sleeve in code and the bangles are
    # separate sprites the game places at the wrist. Eid mehndi comes later
    # as an overlay.
    # Nani's hands are no longer generated (25 Sept 2026): build/skin_hands.py
    # makes them in code from the masters. nani_entries() is kept for the
    # record; its API outputs are archived in sources/art/hands/nani-api-v1/.
    return entries


# ---- Nani -------------------------------------------------------------------
# Rings differ by hand (Cast, likeness notes), so her left hands are drawn
# explicitly, never mirrored in code.
NANI_SLEEVE = "#9E1F2A"  # deep madder red (Cast); the generator paints it orange-red, fixed in post
NANI_SKIN = "#BE8F6F"  # warm, unsaturated, a little deeper than the player's #D69B6D midtone
# Jewellery (Cast, "Jewellery (corrected 24 Sept)", and Nani's character sheet):
# NO bangles. Right wrist: a thin diamond tennis bracelet. Right ring finger:
# an oval red aqiq cabochon in a plain yellow gold bezel. Left ring finger: a
# round solitaire diamond in a raised six-claw setting on a slim yellow gold band.
NANI_RIGHT = ("on the RIGHT wrist only a thin, delicate diamond tennis bracelet (a single row of small sparkling "
              "diamonds), NO bangles; on the RIGHT ring finger (the fourth digit, between the middle and little fingers) a yellow gold ring "
              "set with a large oval red-orange aqiq cabochon, clearly visible on top of the finger, smooth and glossy, in a plain polished yellow gold bezel on a simple band; no other rings")
NANI_LEFT = ("NOTHING on the LEFT wrist: no bangles, no bracelet; on the LEFT ring finger a yellow gold ring with a "
             "round brilliant-cut solitaire diamond held up in a raised six-claw setting on a slim band (no red stone); "
             "no other rings")
# Masters that failed QA (hands v1): Nani's version is drawn from the pose
# text and her own reference instead of copying the child's image.
NANI_TEXT_ONLY = {"hand-b1-handle-grip-t", "hand-e3-count-4-e"}
NANI_POSES = [  # (master id to copy the pose from, sides)
    ("hand-a1-flat-palm-t", "RL"),
    ("hand-a3-palm-up-t", "RL"),
    ("hand-a3-palm-up-e", "RL"),
    ("hand-b1-handle-grip-t", "R"),
    ("hand-b4-rolling-pin-t", "2"),
    ("hand-b5-hook-grip-t", "R"),
    ("hand-c1-pinch-f1-open-t", "R"),
    ("hand-c1-pinch-f2-closed-t", "R"),
    ("hand-c4-point-t", "R"),
    ("hand-c4-point-e", "R"),
    ("hand-d2-c-hold-t", "R"),
    ("hand-e1-thumbs-up-e", "R"),
    ("hand-e3-count-1-e", "RL"),
    ("hand-e3-count-2-e", "RL"),
    ("hand-e3-count-3-e", "RL"),
    ("hand-e3-count-4-e", "RL"),
    ("hand-e3-count-5-e", "RL"),
]


# Retry round (hands v1): extra wording for the Nani poses that failed review,
# appended to their jewellery line so the passing entries' prompts (and
# manifest hashes) are unchanged.
RING_NOT_BRACELET = (" The red aqiq stone is set in a RING worn on the ring finger (the fourth digit), never on the"
                     " bracelet; the tennis bracelet is only a thin row of small clear diamonds.")
PALM_UP = (" IMPORTANT: the hand is turned over, PALM UP: we see the palm and the inside of the fingers, NOT the back of"
           " the hand; the rings show only as thin gold bands on the palm side of the ring finger.")
NANI_FIX = {
    "nani-a3-palm-up-t-right": PALM_UP,
    "nani-a3-palm-up-t-left": PALM_UP,
    "nani-a3-palm-up-e-right": PALM_UP,
    "nani-b1-handle-grip-t-right": RING_NOT_BRACELET + " The aqiq ring must be clearly visible on the curled ring finger.",
    "nani-b4-rolling-pin-t": " The RIGHT hand (on the right of the image) MUST show the oval red aqiq ring on its ring finger.",
    "nani-c1-pinch-f1-open-t-right": RING_NOT_BRACELET,
    "nani-c1-pinch-f2-closed-t-right": RING_NOT_BRACELET,
    "nani-e3-count-2-e-right": (" The aqiq ring is on the RING finger, which is folded down (not on either raised finger);"
                                " only the index and middle fingers are raised."),
    "nani-e3-count-3-e-right": (" EXACTLY THREE fingers raised: index, middle and ring. The little finger AND the thumb are"
                                " folded down across the palm and hidden; the hand must read as three, never five."),
    "nani-e3-count-3-e-left": (" EXACTLY THREE fingers raised: index, middle and ring. The little finger AND the thumb are"
                               " folded down across the palm and hidden; the hand must read as three, never five."),
    "nani-e3-count-4-e-right": (" EXACTLY FOUR fingers raised; the THUMB is folded flat across the palm, hidden behind the"
                                " fingers, not sticking out to the side; the hand must read as four, never five."),
    "nani-e3-count-4-e-left": (" EXACTLY FOUR fingers raised; the THUMB is folded flat across the palm, hidden behind the"
                               " fingers, not sticking out to the side; the hand must read as four, never five."),
}

NANI_SHEET = "sources/art/characters/nani-sheet-v2-approved.png"  # attached when present
SHEET_NOTE = (" The last attached image is Nani's character sheet: copy her rings and her tennis bracelet exactly as in"
              " its hand close-up and ring close-ups (ignore the sheet's beige sleeves: her sleeve here stays deep red).")


def nani_entries():
    n = f"{H}/nani"
    sheet = [NANI_SHEET] if os.path.exists(os.path.join(GAME, NANI_SHEET)) else []
    out = []
    refs = {
        ("T", "R"): f"{n}/ref/nani-ref-t-right.png",
        ("E", "R"): f"{n}/ref/nani-ref-e-right.png",
        ("T", "L"): f"{n}/ref/nani-ref-t-left.png",
        ("E", "L"): f"{n}/ref/nani-ref-e-left.png",
    }
    for cam, src in (("T", REF_T), ("E", REF_E)):
        out.append({
            "id": f"nani-ref-{cam.lower()}-right", "group": "hands-nani-ref", "output": refs[(cam, "R")],
            "mode": "edit", "reference_images": [src] + sheet, "template": "nani_ref",
            "fields": {"side": "RIGHT", "jewellery": NANI_RIGHT + (SHEET_NOTE if sheet else "")}, "skin_target": NANI_SKIN, "scale_normalise": False,
        })
        out.append({
            "id": f"nani-ref-{cam.lower()}-left", "group": "hands-nani-ref", "output": refs[(cam, "L")],
            "mode": "edit", "reference_images": [refs[(cam, "R")]] + sheet, "mirror_references": [0],
            "template": "nani_ref_left", "fields": {"jewellery": NANI_LEFT + (SHEET_NOTE if sheet else "")}, "skin_target": NANI_SKIN, "scale_normalise": False,
            "_note": "A new left-hand drawing, with Nani's right-hand reference flipped as the pose guide (the unflipped reference made the model draw a right hand again); the prompt keeps the light at the upper left and redraws the jewellery.",
        })
    pose_text = {master_id(c, sl, cam): (pose, cam) for c, sl, cam, pose, two in POSES}
    for mid, sides in NANI_POSES:
        cam = mid[-1].upper()
        base = mid.replace("hand-", "nani-", 1)
        if sides == "2":
            out.append({
                "id": base, "group": "hands-nani", "output": f"{n}/{base}.png", "mode": "edit",
                "reference_images": [refs[(cam, "R")], refs[(cam, "L")], f"{H}/master/{mid}.png"],
                "template": "nani_two_pose", "fields": {"right": NANI_RIGHT, "left": NANI_LEFT},
                "skin_reference": refs[("T", "R")], "scale_reference": refs[(cam, "R")],
            })
            continue
        for side in sides:
            word, jew = ("RIGHT", NANI_RIGHT) if side == "R" else ("LEFT", NANI_LEFT)
            eid = f"{base}-{'right' if side == 'R' else 'left'}"
            e = {
                "id": eid, "group": "hands-nani", "output": f"{n}/{eid}.png", "mode": "edit",
                "reference_images": [refs[(cam, side)], f"{H}/master/{mid}.png"],
                "template": "nani_pose", "fields": {"side": word, "jewellery": jew},
                "skin_reference": refs[("T", "R")], "scale_reference": refs[(cam, "R")],
            }
            if mid in NANI_TEXT_ONLY:
                pose, pcam = pose_text[mid]
                if side == "L":
                    pose = pose.replace("LEFT", "@@").replace("RIGHT", "LEFT").replace("@@", "RIGHT")
                e.update(reference_images=[refs[(cam, side)]], template="nani_pose_text",
                         fields={"side": word, "jewellery": jew, "camera": CAM[pcam], "pose": pose},
                         _note="The player's master for this pose failed QA, so Nani's is drawn from text and her own reference.")
                if KEY in pose:
                    e["key_out"] = "magenta"
            elif side == "L":
                e["mirror_references"] = [1]  # the player's pose image is a right hand
            out.append(e)
    for e in out:
        e["sleeve_target"] = NANI_SLEEVE
        if e["id"] in NANI_FIX:
            key = "jewellery" if "jewellery" in e["fields"] else "right"
            e["fields"][key] += NANI_FIX[e["id"]]
            if sheet:  # the approved sheet shows both rings and the bracelet close up
                e["reference_images"] = e["reference_images"] + sheet
                e["fields"][key] += SHEET_NOTE
    return out


TEMPLATES = {
    "hand_pose_from_ref": "{style}\n\nUsing the attached reference hand as the exact model for hand shape, skin, size and sleeve, draw the SAME right hand and forearm of a child of about 7 in a new pose: warm light tan skin, not orange, not saturated: a muted, slightly pinkish-beige light brown, exactly the skin colour of the reference; a slender, slim hand with long fingers relative to a small, narrow palm (not stubby, not chunky, not toy-like); smooth, simple surfaces with no visible bones, knuckle ridges, tendons or veins, only a soft hint of fingernails. {camera} Pose: {pose}. No tool or object in the hand. Sleeve: a plain white linen shirt sleeve, rolled back to between the elbow and the wrist; the forearm is bare below the roll; the soft rolled white linen just shows at the very bottom edge of the frame (or is cropped out); no embroidery, no cuff band, no pattern, identical to the reference. Transparent background: hand and forearm only, no other body parts.\n\n{negative}",
    "hands_two_from_ref": "{style}\n\nUsing the attached reference hand as the exact model for hand shape, skin, size and sleeve, draw BOTH hands and forearms of the same child of about 7 (the right hand on the right, the left hand on the left, a matching mirror-image pair), each exactly like the reference: warm light tan skin, not orange, not saturated, exactly the skin colour of the reference; slender, slim hands with long fingers relative to small, narrow palms; smooth, simple surfaces with no visible bones, knuckle ridges, tendons or veins. {camera} Both forearms enter from the bottom edge of the frame. Pose: {pose}. No tool or object in the hands. Sleeves: plain white linen shirt sleeves rolled back to between the elbow and the wrist, the roll just showing at the bottom edge (or cropped out), identical to the reference. Transparent background: two hands and forearms only, no other body parts.\n\n{negative}",
    "hand_pose_from_ref_keyed": None,
    "hands_two_from_ref_keyed": None,
    "hand_ref_to_eye_level": "{style}\n\nUsing the attached reference hand as the exact model for hand shape, skin, size and sleeve, draw the SAME right hand and forearm of a child of about 7 from a new camera. Camera: eye level, first person: we look straight ahead at our own right hand held up in front of us; we see the BACK of the hand, towards the viewer (the palm faces away from us); the forearm rises vertically from the bottom edge of the frame; no worktop, no table. Pose: relaxed and upright, fingers gently together and pointing up towards the top of the frame, thumb relaxed at the left side, fingernails softly visible. Keep everything else identical to the reference: the same slender hand with long fingers relative to a small, narrow palm; smooth, simple surfaces with no visible bones, knuckle ridges, tendons or veins; exactly the same warm light tan skin colour (muted, slightly pinkish-beige light brown, not orange, not saturated); the same plain white linen shirt sleeve rolled back to between the elbow and the wrist, the soft roll just showing at the bottom edge of the frame. This is the master reference for every eye-level hand pose. Transparent background: hand and forearm only, no other body parts, no shadow.\n\n{negative}",
    "hand_reskin_eid": "{style}\n\nEdit the attached image. Change only one thing: {change}. Keep the hand exactly the same: identical outline, finger positions, skin colour, sleeve, bangles, lighting, camera and size. Nothing else changes. Transparent background.\n\n{negative}",
    "nani_ref": "{style}\n\nEdit the attached reference hand into Nani's hand: the {side} hand and forearm of a warm, graceful grandmother in her late sixties. Keep the camera, pose, framing and lighting exactly as in the reference. Change: (1) Hand: an older woman's hand, a little larger and fuller than the child's, with soft, gentle wrinkles over the knuckles and the back of the hand and a slightly looser skin texture, still smooth and stylised, never bony, no prominent veins; short, neat, natural nails, no polish. (2) Skin: warm and unsaturated, a soft muted light brown, a touch deeper than the reference, not orange, not grey. (3) Sleeve: replace the white linen with her deep-red kurta sleeve (deep madder red, about #9E1F2A), coming down to the wrist, with a narrow band of fine gold embroidery at the cuff. (4) Jewellery: {jewellery}. Transparent background: hand and forearm only, no other body parts.\n\n{negative}",
    "nani_ref_left": "{style}\n\nThe first attached image is Nani's hand flipped left-right, so it now shows her LEFT hand (its thumb on the RIGHT side of the hand, seen from the back): redraw it as her LEFT hand in exactly that pose, camera, framing and size, with the light coming from the UPPER LEFT like every other image (the flip moved the light; put it back). Keep the same older woman's hand with the same soft wrinkles and skin colour (do not make it smoother, younger or paler) and the same deep-red sleeve with its gold-embroidered cuff. Replace ALL the jewellery: this left hand wears only: {jewellery}. Transparent background: hand and forearm only, no other body parts.\n\n{negative}",
    "nani_pose": "{style}\n\nTwo images are attached. Image 1 is Nani's {side} hand: copy its hand, older skin, deep-red sleeve with the gold-embroidered cuff and its jewellery exactly. Image 2 is a child's hand showing the POSE and CAMERA to copy: draw Nani's {side} hand in exactly that pose, from exactly that camera, with the same framing, the same empty gaps and the same forearm direction; ignore the child's skin and white sleeve. Her hand stays an older woman's hand: a little larger and fuller, soft gentle wrinkles, smooth and stylised, never bony, short natural nails. Her jewellery on this hand, all clearly visible where the pose allows: {jewellery}. No tool or object in the hand. Transparent background: hand and forearm only, no other body parts.\n\n{negative}",
    "nani_pose_text": "{style}\n\nThe attached image is Nani's {side} hand: copy its hand, older skin, deep-red sleeve with the gold-embroidered cuff and its jewellery exactly, and draw the SAME hand in a new pose. {camera} Pose: {pose}. Her hand stays an older woman's hand: a little larger and fuller, soft gentle wrinkles, smooth and stylised, never bony, short natural nails. Her jewellery on this hand, all clearly visible where the pose allows: {jewellery}. Transparent background: hand and forearm only, no other body parts.\n\n{negative}",
    "nani_two_pose": "{style}\n\nThree images are attached. Image 1 is Nani's RIGHT hand and image 2 her LEFT hand: copy their older skin, deep-red sleeves with gold-embroidered cuffs and jewellery exactly. Image 3 shows a child's two hands in the POSE and CAMERA to copy: draw Nani's two hands (right hand on the right, left hand on the left) in exactly that pose, camera and framing, with the same empty gap where the rolling pin will sit; ignore the child's skin and white sleeves. Her hands are an older woman's: a little larger and fuller, soft gentle wrinkles, smooth and stylised, short natural nails. Right hand: {right}. Left hand: {left}. No tool or object in the hands. Transparent background: hands and forearms only, no other body parts.\n\n{negative}",
}


TEMPLATES["hand_pose_from_ref_keyed"] = TEMPLATES["hand_pose_from_ref"].replace(
    "No tool or object in the hand.", "The only object is the magenta placeholder described in the pose; nothing else in the hand.")
TEMPLATES["hands_two_from_ref_keyed"] = TEMPLATES["hands_two_from_ref"].replace(
    "No tool or object in the hands.", "The only object is the magenta placeholder described in the pose; nothing else in the hands.")


def main():
    with open(ASSET_LIST) as f:
        data = json.load(f)
    keep = [a for a in data["assets"] if not str(a.get("group", "")).startswith(("hands-master", "hands-girl", "hands-nani", "hands-reference-eye"))]  # girl groups dropped too
    data["assets"] = keep + build()
    data["templates"].update(TEMPLATES)
    data["hand_aliases"] = {"_note": "Asset plan 1.3 poses with no image of their own: the game uses this image plus a tool or string sprite.", **ALIASES}
    data["config"]["skin_normalise"] = {
        "reference": REF_T,
        "reference_midtone": "#D69B6D",
        "groups_prefix": ["hands-master", "hands-girl", "hands-nani", "hands-reference-eye"],
        "tolerance_delta_e": 3.0,
        "_note": "Hands v1 step 1: every hand output's skin is distribution-matched (lightness and chroma percentiles, median hue) to the reference hand's, or to its entry's skin_reference (Nani's to her own reference); entries with a fixed skin_target hex (Nani's references) get the midtone normaliser with tolerance_delta_e. build/gen_assets.py, post_process_hand().",
    }
    data["config"]["scale_normalise"] = {
        "target_forearm_px": 250,
        "tolerance": 0.04,
        "limits": [0.6, 1.8],
        "_note": "Every hand sprite is rescaled so its forearm, measured just beyond the sleeve, is target_forearm_px wide (the reference hands measure 244 top-down and 256 eye level), anchored where the arm leaves the bottom edge. Nani's entries use scale_reference (her own reference) instead. build/gen_assets.py, forearm_widths() and normalise_scale().",
    }
    with open(ASSET_LIST, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    n = [a for a in data["assets"] if a.get("group", "").startswith("hands-")]
    by = {}
    for a in n:
        by[a["group"]] = by.get(a["group"], 0) + a.get("variants", 1)
    print(json.dumps(by, indent=1))


if __name__ == "__main__":
    main()
