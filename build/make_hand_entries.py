#!/usr/bin/env python3
"""Writes the hand entries of data/asset-list.json (hands v1, 24 Sept 2026):
the eye-level reference, the master set (asset plan section 1.3, A1-F5, in
the cameras listed, every frame), the girl and girl-Eid reskins of every
master image, and Nani's set with explicit right and left hands.

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
    "E-palm": "Camera: eye level, first person: we look straight ahead and a little down at our own hand held out in front of us at chest height; the hand is turned palm UP, so we see the palm, foreshortened; the forearm enters from the bottom edge of the frame; no worktop.",
}

# Grip poses: the tool is a separate sprite, so the hand must leave a clear,
# empty space exactly where it will sit.
GAP = " The tool is a separate image placed later: leave that space completely empty and clearly visible, with nothing drawn in it."

# (code, slug, camera-key, pose text, two_handed, note)
# Frames of 2-frame poses are separate rows with -f1/-f2 slugs.
POSES = [
    # A. Open hand
    ("a1", "flat-palm", "T", "flat palm pressed down on the worktop, fingers together and straight, thumb resting alongside, as if pressing and kneading dough", False),
    ("a2", "heel-push", "T", "heel of the palm pushing forwards into the worktop: the wrist bent back, the heel of the hand pressed down hard, the fingers together and lifted slightly off the worktop, angled up and forwards, as if pushing dough or an item away", False),
    ("a3", "palm-up", "T-palm", "palm up and open on the worktop, fingers together and relaxed, very slightly curved, thumb relaxed at the side, as if waiting to receive something ('here you are')", False),
    ("a3", "palm-up", "E-palm", "palm up and open, held out forwards, fingers together and relaxed, pointing away from us, thumb relaxed at the side, as if offering or waiting to receive something", False),
    ("a4", "reach", "E", "reaching up and forwards towards a high shelf: arm extended towards the top of the frame, fingers spread and slightly curved, back of the hand towards us", False),
    ("a5", "wave-f1", "E", "waving hello, frame 1 of 2: hand raised, fingers together pointing up, palm facing away from us, the whole hand tilted about 15 degrees to the LEFT at the wrist", False),
    ("a5", "wave-f2", "E", "waving hello, frame 2 of 2: hand raised, fingers together pointing up, palm facing away from us, the whole hand tilted about 15 degrees to the RIGHT at the wrist", False),
    ("a6", "palm-out", "E", "palm pushed out forwards as for 'stop' or a high five: hand raised, wrist bent back, fingers straight up and slightly apart, palm facing away from us so we see the back of the hand", False),
    ("a7", "hand-on-heart", "E", "right hand laid flat over our own heart (salaam, thank you): the forearm comes diagonally from the lower right corner of the frame, the hand lies flat, fingers together pointing to the left, back of the hand towards us", False),
    ("a8", "cupped", "T-palm", "palm up with the fingers held together and curled up to make a shallow bowl, thumb pressed along the side, as if holding a small pile of seeds or spices; the inside of the cup is empty and visible from above", False),
    ("a8", "cupped", "E-palm", "palm up with the fingers held together and curled up to make a shallow cup, thumb along the side, held out in front as if catching drips of rain; the inside of the cup is empty", False),
    # B. Handle grip
    ("b1", "handle-grip", "T", "a loose fist holding an invisible horizontal handle (knife, spatula, ladle) about 2.5 cm thick: the handle runs straight forwards through the hollow of the curled fingers and out of the front of the fist towards the top of the frame; the THUMB LIES STRAIGHT ALONG THE TOP OF THE HANDLE LINE, pointing forwards, not tucked into the fist; the curled fingers leave an open tunnel for the handle" + GAP, False),
    ("b2", "vertical-grip", "T", "fist closed around an invisible vertical stick (pestle, churner) about 3 cm thick that points straight up at the camera: we look down on the top of the fist, where the curled index finger and the thumb wrapped over it make a round empty hole about 3 cm across in which the stick stands" + GAP, False),
    ("b2", "vertical-grip", "E", "fist held upright in front of us around an invisible vertical handle about 3 cm thick (umbrella, broom, torch): fingers curled round the far side, thumb wrapped over the top of the index finger; a clear round tunnel through the fist from top to bottom where the handle passes" + GAP, False),
    ("b3", "stick-grip", "E", "a loose grip around an invisible stick about 2.5 cm thick (drumstick, racquet or bat handle) that leaves the top of the fist and points up and forwards at about 45 degrees; thumb along the side of the stick; a clear tunnel through the loosely curled fingers" + GAP, False),
    ("b4", "rolling-pin", "T", "rolling a flatbread: both palms rest on the two ends of an invisible horizontal rolling pin about 3 cm thick lying across the frame, the hands about 25 cm apart; palms down, fingers extended forwards over the pin, slightly curved over it; a clear empty horizontal band under and between both hands where the pin sits" + GAP, True),
    ("b5", "hook-grip", "T", "hook grip: the four fingers curled together into a hook as if hooked through the loop of a jug handle, thumb resting on top of the handle; the hollow inside the hook, where the handle passes, is clearly empty" + GAP, False),
    ("b5", "hook-grip", "E", "hook grip in front of us: the four fingers curled together into a hook as if carrying a basket or bucket by its handle, thumb resting lightly against the index finger; the hollow inside the hook, where the handle passes, is clearly empty" + GAP, False),
    # C. Pinch and fingertip
    ("c1", "pinch-f1-open", "T", "fingertip pinch, open: thumb and index fingertips about 3 cm apart, ready to pick up something tiny; the other fingers loosely curled underneath", False),
    ("c1", "pinch-f2-closed", "T", "fingertip pinch, closed: the thumb and index fingertips pressed together as if holding a tiny spice or bead between them (nothing drawn); the other fingers loosely curled underneath", False),
    ("c1", "pinch-f1-open", "E", "fingertip pinch, open, held up in front of us: thumb and index fingertips about 3 cm apart, ready to pick something up; the other fingers loosely curled", False),
    ("c1", "pinch-f2-closed", "E", "fingertip pinch, closed, held up in front of us: thumb and index fingertips pressed together as if holding a tiny bead or coin (nothing drawn); the other fingers loosely curled", False),
    ("c2", "tripod-grip", "T", "tripod grip, as if holding a pen or teaspoon: thumb, index and middle fingertips meet around an invisible thin handle about 1 cm thick that runs forwards and slightly left out of the grip; ring and little fingers curled under" + GAP, False),
    ("c3", "side-pinch", "T", "side pinch, holding something thin and flat (a card, a chapati edge): the thumb pad pressed against the side of the curled index finger, with a thin straight slit between them where the flat edge sits; other fingers curled behind" + GAP, False),
    ("c3", "side-pinch", "E", "side pinch held up in front of us, holding something thin and flat (a card or photo) upright: the thumb pad pressed against the side of the curled index finger, with a thin straight slit between them where the flat edge sits; other fingers curled behind" + GAP, False),
    ("c4", "point", "T", "pointing index finger: the index finger straight and extended forwards towards the top of the frame, the other fingers curled under the palm, the thumb tucked alongside the middle finger", False),
    ("c4", "point", "E", "pointing index finger: the index finger straight and pointing up and forwards, the other fingers curled into the palm, the thumb folded across them; the default tap hand", False),
    ("c5", "two-hand-fold", "T", "folding with two hands: both hands close together in the middle of the frame, each with thumb and index fingertips pinched as if folding over the edge of a samosa or a cloth; the two pinches nearly meet in the centre; the other fingers loosely curled", True),
    # D. Whole-hand hold and fist
    ("d1", "grab-f1-open", "T", "about to grab: hand hovering palm down, fingers spread and curved like a claw ready to close on something", False),
    ("d1", "grab-f2-closed", "T", "grabbing: hand closed round an invisible object about 5 cm across (a vegetable), fingers wrapped round it and thumb against them, leaving a round empty hollow inside the grip where the object sits" + GAP, False),
    ("d1", "grab-f1-open", "E", "reaching to grab, in front of us: fingers spread and curved like a claw ready to close on something", False),
    ("d1", "grab-f2-closed", "E", "grabbing, in front of us: hand closed round an invisible object about 5 cm across, fingers wrapped round it and thumb against them, leaving a round empty hollow inside the grip where the object sits" + GAP, False),
    ("d2", "c-hold", "T", "C-shaped hold round an invisible upright glass about 7 cm across standing on the worktop: from above, the fingers and thumb curve round the glass in a C, leaving a clear, empty, round space 7 cm across inside the curve" + GAP, False),
    ("d2", "c-hold", "E", "C-shaped hold round an invisible upright glass about 7 cm across held up in front of us: the fingers curve round the far side of the glass and the thumb the near side, leaving a clear, empty, upright round space inside the curve" + GAP, False),
    ("d3", "two-hand-bowl", "T", "two hands holding an invisible round bowl about 18 cm across from its two sides: palms turned in and slightly up, fingers curved under the bowl's rim; a clear, empty, round space about 18 cm across between the hands where the bowl sits" + GAP, True),
    ("d4", "squeeze-f1-half", "T", "squeezing, frame 1 of 2: fist half-closed round an invisible half lemon about 6 cm across, fingers curved round it, leaving a clear round hollow inside the grip" + GAP, False),
    ("d4", "squeeze-f2-tight", "T", "squeezing, frame 2 of 2: fist squeezed tight, fingers pressed hard into the palm, with only a small hollow left inside the grip" + GAP, False),
    ("d5", "throw-release", "E", "throwing, the moment of release: the arm forwards, the wrist flicked forwards and the fingers just opening and spreading as they let go of a ball", False),
    ("d6", "two-hand-catch-f1-open", "E", "about to catch, frame 1 of 2: both hands held out in front of us about 15 cm apart, palms facing forwards and slightly towards each other, fingers spread and curved, ready to catch a ball", True),
    ("d6", "two-hand-catch-f2-closed", "E", "catching, frame 2 of 2: both hands together, cupped round an invisible ball about 8 cm across, fingers of each hand curled round it, leaving a clear round hollow between them where the ball sits" + GAP, True),
    # E. Social and number gestures
    ("e1", "thumbs-up", "E", "thumbs up: fist closed with the thumb pointing straight up; we see the back and little-finger side of the fist", False),
    ("e2", "handshake", "E", "hand held out forwards for a handshake: the hand turned sideways, thumb up, palm facing left, fingers together pointing forwards and a little to the left", False),
    ("e3", "count-1", "E", "counting on the fingers, ONE: only the index finger straight up; the middle, ring and little fingers curled down into the palm; the thumb folded across them. Exactly one finger up", False),
    ("e3", "count-2", "E", "counting on the fingers, TWO: the index and middle fingers straight up and slightly apart; the ring and little fingers curled down; the thumb folded across them. Exactly two fingers up", False),
    ("e3", "count-3", "E", "counting on the fingers, THREE: the index, middle and ring fingers straight up and slightly apart; the little finger curled down; the thumb folded across it. Exactly three fingers up", False),
    ("e3", "count-4", "E", "counting on the fingers, FOUR: the index, middle, ring and little fingers straight up and slightly apart; only the thumb folded across the palm. Exactly four fingers up", False),
    ("e3", "count-5", "E", "counting on the fingers, FIVE: all four fingers and the thumb straight and spread wide apart. All five fingers up", False),
    ("e4", "clap-f1-apart", "E", "clapping, frame 1 of 2: both hands raised in front of us, palms facing each other about 20 cm apart, fingers together pointing up", True),
    ("e4", "clap-f2-together", "E", "clapping, frame 2 of 2: both hands raised in front of us, palms pressed flat together, fingers together pointing up", True),
    ("e5", "arm-up-fist", "E", "celebration: the right arm raised, elbow bent, the forearm rising vertically from the bottom edge, the hand in a closed fist at the top, back of the fist towards us (the left arm is this image mirrored)", False),
    ("e6", "stretch", "E", "stretching on waking: the right arm reaching straight up to the top of the frame, hand open with the fingers spread, back of the hand towards us (the left arm is this image mirrored)", False),
    ("e7", "shrug", "E-palm", "a shrug, 'I don't know': the right hand held out to the side at chest height, palm up and open, fingers relaxed and slightly spread, the forearm coming in from the lower right (the left hand is this image mirrored)", False),
    # F. Music, sport and play
    ("f1", "piano-f1-raised", "E", "piano hand, frame 1 of 2: the hand arched over an invisible keyboard below, seen from just behind and above, fingers curved down with the fingertips raised a little above the keys, as if about to play", False),
    ("f1", "piano-f2-pressed", "E", "piano hand, frame 2 of 2: the hand arched over an invisible keyboard below, seen from just behind and above, fingers curved down with the fingertips pressing down onto the keys", False),
    ("f2", "drum-cupped", "T", "hand-drum slap with a cupped hand: palm down, fingers together and slightly arched so the palm forms a shallow dome, the fingertips and the heel of the hand touching the surface (the flat-hand slap is A1)", False),
    ("f4", "phone-two-hands", "E", "holding a phone or camera up to take a photo: both hands in front of us holding an invisible horizontal phone about 15 x 7 cm, the thumbs on its near face at the two lower corners, the index fingers along its top edge behind it; the rectangular space between the hands is empty" + GAP, True),
]
# F3 (racquet/paddle) is B3 plus a tool sprite, and F5 (kite string) is C1
# with a string sprite (asset plan 1.3): no new images, noted in the list.
ALIASES = {"f3-racquet": "hand-b3-stick-grip-e", "f5-kite-string": "hand-c1-pinch-f2-closed-e"}

GIRL = ("replace the white sleeve with a plain, modern rolled-back cotton sleeve in a soft dusty pink "
        "(rolled to between the elbow and the wrist, no embroidery) and add three thin glass bangles "
        "in red, green and gold at the wrist{both}")
EID = ("add mehndi: a simple, delicate rust-brown floral mehndi pattern drawn on the skin of the back of "
       "the hand and the fingers{palm}{both}. Keep the dusty-pink sleeve and the three glass bangles exactly as they are")


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
            "template": "hands_two_from_ref" if two else "hand_pose_from_ref",
            "fields": {"camera": CAM[cam], "pose": pose},
            "camera": cam.split("-")[0],
        }
        if two:
            e["_note"] = "Two-handed: drawn as one image (the hands touch or share one object)."
        entries.append(e)
        masters.append((e, two, cam))

    for e, two, cam in masters:
        both = " (on BOTH wrists: the same sleeve and bangles on each arm)" if two else ""
        gid = e["id"].replace("hand-", "hand-girl-", 1)
        entries.append({
            "id": gid, "group": "hands-girl", "output": f"{H}/girl/{gid}.png", "mode": "reskin",
            "master": e["id"], "template": "hand_reskin", "fields": {"change": GIRL.format(both=both)},
        })
        palm = " (and on the palm, which shows in this pose)" if "palm" in cam else ""
        both_e = " of BOTH hands" if two else ""
        xid = e["id"].replace("hand-", "hand-eid-", 1)
        entries.append({
            "id": xid, "group": "hands-girl-eid", "output": f"{H}/girl-eid/{xid}.png", "mode": "reskin",
            "master": gid, "template": "hand_reskin_eid", "fields": {"change": EID.format(palm=palm, both=both_e)},
            "_note": "Reskinned from the girl image (so the bangles match); drift-checked against it.",
        })

    entries += nani_entries()
    return entries


# ---- Nani -------------------------------------------------------------------
# Rings differ by hand (Cast, likeness notes), so her left hands are drawn
# explicitly, never mirrored in code.
NANI_SKIN = "#BE8F6F"  # warm, unsaturated, a little deeper than the player's #D69B6D midtone
NANI_RIGHT = ("on the RIGHT wrist two thin plain gold bangles and a thin, delicate diamond tennis bracelet; "
              "on the RIGHT ring finger a ring with an oval deep-red aqiq (carnelian) stone set in red and yellow gold; "
              "no other rings")
NANI_LEFT = ("on the LEFT wrist two thin plain gold bangles only (no tennis bracelet); "
             "on the LEFT ring finger a yellow gold ring set with small sparkling diamonds (no red stone); "
             "no other rings")
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


def nani_entries():
    n = f"{H}/nani"
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
            "mode": "edit", "reference_images": [src], "template": "nani_ref",
            "fields": {"side": "RIGHT", "jewellery": NANI_RIGHT}, "skin_target": NANI_SKIN,
        })
        out.append({
            "id": f"nani-ref-{cam.lower()}-left", "group": "hands-nani-ref", "output": refs[(cam, "L")],
            "mode": "edit", "reference_images": [refs[(cam, "R")]], "mirror_references": [0],
            "template": "nani_ref_left", "fields": {"jewellery": NANI_LEFT}, "skin_target": NANI_SKIN,
            "_note": "Starts from Nani's right-hand reference flipped left-right, then the jewellery is redrawn for the left hand.",
        })
    for mid, sides in NANI_POSES:
        cam = mid[-1].upper()
        base = mid.replace("hand-", "nani-", 1)
        if sides == "2":
            out.append({
                "id": base, "group": "hands-nani", "output": f"{n}/{base}.png", "mode": "edit",
                "reference_images": [refs[(cam, "R")], refs[(cam, "L")], f"{H}/master/{mid}.png"],
                "template": "nani_two_pose", "fields": {"right": NANI_RIGHT, "left": NANI_LEFT},
                "skin_reference": refs[("T", "R")],
            })
            continue
        for side in sides:
            word, jew = ("RIGHT", NANI_RIGHT) if side == "R" else ("LEFT", NANI_LEFT)
            eid = f"{base}-{'right' if side == 'R' else 'left'}"
            e = {
                "id": eid, "group": "hands-nani", "output": f"{n}/{eid}.png", "mode": "edit",
                "reference_images": [refs[(cam, side)], f"{H}/master/{mid}.png"],
                "template": "nani_pose", "fields": {"side": word, "jewellery": jew},
                "skin_reference": refs[("T", "R")],
            }
            if side == "L":
                e["mirror_references"] = [1]  # the player's pose image is a right hand
            out.append(e)
    return out


TEMPLATES = {
    "hand_pose_from_ref": "{style}\n\nUsing the attached reference hand as the exact model for hand shape, skin, size and sleeve, draw the SAME right hand and forearm of a child of about 7 in a new pose: warm light tan skin, not orange, not saturated: a muted, slightly pinkish-beige light brown, exactly the skin colour of the reference; a slender, slim hand with long fingers relative to a small, narrow palm (not stubby, not chunky, not toy-like); smooth, simple surfaces with no visible bones, knuckle ridges, tendons or veins, only a soft hint of fingernails. {camera} Pose: {pose}. No tool or object in the hand. Sleeve: a plain white linen shirt sleeve, rolled back to between the elbow and the wrist; the forearm is bare below the roll; the soft rolled white linen just shows at the very bottom edge of the frame (or is cropped out); no embroidery, no cuff band, no pattern, identical to the reference. Transparent background: hand and forearm only, no other body parts.\n\n{negative}",
    "hands_two_from_ref": "{style}\n\nUsing the attached reference hand as the exact model for hand shape, skin, size and sleeve, draw BOTH hands and forearms of the same child of about 7 (the right hand on the right, the left hand on the left, a matching mirror-image pair), each exactly like the reference: warm light tan skin, not orange, not saturated, exactly the skin colour of the reference; slender, slim hands with long fingers relative to small, narrow palms; smooth, simple surfaces with no visible bones, knuckle ridges, tendons or veins. {camera} Both forearms enter from the bottom edge of the frame. Pose: {pose}. No tool or object in the hands. Sleeves: plain white linen shirt sleeves rolled back to between the elbow and the wrist, the roll just showing at the bottom edge (or cropped out), identical to the reference. Transparent background: two hands and forearms only, no other body parts.\n\n{negative}",
    "hand_ref_to_eye_level": "{style}\n\nUsing the attached reference hand as the exact model for hand shape, skin, size and sleeve, draw the SAME right hand and forearm of a child of about 7 from a new camera. Camera: eye level, first person: we look straight ahead at our own right hand held up in front of us; we see the BACK of the hand, towards the viewer (the palm faces away from us); the forearm rises vertically from the bottom edge of the frame; no worktop, no table. Pose: relaxed and upright, fingers gently together and pointing up towards the top of the frame, thumb relaxed at the left side, fingernails softly visible. Keep everything else identical to the reference: the same slender hand with long fingers relative to a small, narrow palm; smooth, simple surfaces with no visible bones, knuckle ridges, tendons or veins; exactly the same warm light tan skin colour (muted, slightly pinkish-beige light brown, not orange, not saturated); the same plain white linen shirt sleeve rolled back to between the elbow and the wrist, the soft roll just showing at the bottom edge of the frame. This is the master reference for every eye-level hand pose. Transparent background: hand and forearm only, no other body parts, no shadow.\n\n{negative}",
    "hand_reskin_eid": "{style}\n\nEdit the attached image. Change only one thing: {change}. Keep the hand exactly the same: identical outline, finger positions, skin colour, sleeve, bangles, lighting, camera and size. Nothing else changes. Transparent background.\n\n{negative}",
    "nani_ref": "{style}\n\nEdit the attached reference hand into Nani's hand: the {side} hand and forearm of a warm, graceful grandmother in her late sixties. Keep the camera, pose, framing and lighting exactly as in the reference. Change: (1) Hand: an older woman's hand, a little larger and fuller than the child's, with soft, gentle wrinkles over the knuckles and the back of the hand and a slightly looser skin texture, still smooth and stylised, never bony, no prominent veins; short, neat, natural nails, no polish. (2) Skin: warm and unsaturated, a soft muted light brown, a touch deeper than the reference, not orange, not grey. (3) Sleeve: replace the white linen with her deep-red kurta sleeve (deep madder red, about #9E1F2A), coming down to the wrist, with a narrow band of fine gold embroidery at the cuff. (4) Jewellery: {jewellery}. Transparent background: hand and forearm only, no other body parts.\n\n{negative}",
    "nani_ref_left": "{style}\n\nEdit the attached image of Nani's hand. It is now her LEFT hand (already flipped): keep the hand, pose, skin, camera, lighting and her deep-red sleeve with its gold-embroidered cuff exactly the same. Change only the jewellery: remove every ring, bracelet and bangle and replace them with: {jewellery}. Transparent background.\n\n{negative}",
    "nani_pose": "{style}\n\nTwo images are attached. Image 1 is Nani's {side} hand: copy its hand, older skin, deep-red sleeve with the gold-embroidered cuff and its jewellery exactly. Image 2 is a child's hand showing the POSE and CAMERA to copy: draw Nani's {side} hand in exactly that pose, from exactly that camera, with the same framing, the same empty gaps and the same forearm direction; ignore the child's skin and white sleeve. Her hand stays an older woman's hand: a little larger and fuller, soft gentle wrinkles, smooth and stylised, never bony, short natural nails. Her jewellery on this hand, all clearly visible where the pose allows: {jewellery}. No tool or object in the hand. Transparent background: hand and forearm only, no other body parts.\n\n{negative}",
    "nani_two_pose": "{style}\n\nThree images are attached. Image 1 is Nani's RIGHT hand and image 2 her LEFT hand: copy their older skin, deep-red sleeves with gold-embroidered cuffs and jewellery exactly. Image 3 shows a child's two hands in the POSE and CAMERA to copy: draw Nani's two hands (right hand on the right, left hand on the left) in exactly that pose, camera and framing, with the same empty gap where the rolling pin will sit; ignore the child's skin and white sleeves. Her hands are an older woman's: a little larger and fuller, soft gentle wrinkles, smooth and stylised, short natural nails. Right hand: {right}. Left hand: {left}. No tool or object in the hands. Transparent background: hands and forearms only, no other body parts.\n\n{negative}",
}


def main():
    with open(ASSET_LIST) as f:
        data = json.load(f)
    keep = [a for a in data["assets"] if not str(a.get("group", "")).startswith(("hands-master", "hands-girl", "hands-nani", "hands-reference-eye"))]
    data["assets"] = keep + build()
    data["templates"].update(TEMPLATES)
    data["hand_aliases"] = {"_note": "Asset plan 1.3 poses with no image of their own: the game uses this image plus a tool or string sprite.", **ALIASES}
    data["config"]["skin_normalise"] = {
        "reference": REF_T,
        "reference_midtone": "#D69B6D",
        "groups_prefix": ["hands-master", "hands-girl", "hands-nani", "hands-reference-eye"],
        "tolerance_delta_e": 3.0,
        "_note": "Every hand output's masked skin midtone is colour-matched back to the master reference's (Nani's to her own reference) when it is more than tolerance_delta_e (CIE Lab) away. build/gen_assets.py, normalise_skin().",
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
