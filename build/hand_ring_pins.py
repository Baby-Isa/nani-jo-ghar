"""Hand-checked ring views and joints (hands v2), applied onto data/hand-anchors.json
before detection. Each entry: pose id -> list per hand (anchor order) of None
(trust detection) or a dict with any of:
  view   'back' | 'palm' | 'side' | 'hidden'   (pinned: "view_source": "manual")
  mcp, pip  [x, y] joints marked by eye on a gridded full-size view
            (pinned: "source": "manual")
  bracelet  'anchor': put wrist jewellery on the measured wrist anchor, not the
            wrist joint (the joint was misread)
  note   why.
Every pin here was set after looking at the pose at full size."""

PINS = {
    # palms drawn as anatomical left hands: chirality reads 'back', nails don't show
    "hand-a3-palm-up-t": [{"view": "palm", "note": "palm up, no nails: drawn as a left hand"}],
    "hand-a3-palm-up-e": [{"view": "palm", "note": "palm up, no nails: drawn as a left hand"}],
    "hand-a8-cupped-t": [{"view": "palm", "note": "cupped palm up"}],
    "hand-a8-cupped-e": [{"view": "palm", "note": "cupped palm up"}],
    "hand-e7-shrug-e": [{"view": "palm", "note": "open palm up"}],
    # backs drawn as anatomical left hands: chirality reads 'palm', nails show
    "hand-a7-hand-on-heart-e": [{"view": "back", "note": "nails and knuckles show: back of the hand"}],
    "hand-e3-count-2-e": [{"view": "back", "note": "nails on the raised fingers, knuckles on the curled ones"}],
    # fists and grips where the ring finger's first segment is out of sight
    "hand-b2-vertical-grip-t": [{"view": "hidden", "note": "fist from above: the ring finger curls over the far side"}],
    "hand-b2-vertical-grip-e": [{"view": "hidden", "bracelet": "anchor",
                                 "note": "fingers wrap towards us; the first segment points away; wrist joint misread on the fingers"}],
    "hand-e1-thumbs-up-e": [{"view": "hidden", "note": "fist from the palm side: the ring is inside it"}],
    "hand-c1-pinch-f1-open-t": [{"view": "hidden", "note": "seen from the thumb side: ring finger behind index and middle"}],
    "hand-c1-pinch-f2-closed-t": [{"view": "hidden", "note": "seen from the thumb side: ring finger behind index and middle"}],
    "hand-c1-pinch-f1-open-e": [{"view": "hidden", "note": "palm side: ring finger curled behind the middle finger"}],
    "hand-c1-pinch-f2-closed-e": [{"view": "hidden", "note": "palm side: ring finger curled behind the middle finger"}],
    "hand-c5-two-hand-fold-t": [{"view": "hidden", "note": "fingers curled into the fold, first segments unreadable"},
                                {"view": "hidden", "note": "fingers curled into the fold, first segments unreadable"}],
    "hand-d1-grab-f2-closed-e": [{"view": "hidden", "note": "ring of fingertips, palm side: no detection, finger not readable"}],
    "hand-d2-c-hold-e": [{"view": "hidden", "note": "the thumb crosses in front of the fingers' palm side"}],
    "hand-d6-two-hand-catch-f2-closed-e": [None,
                                           {"mcp": [550, 445], "pip": [520, 345], "view": "palm",
                                            "note": "not detected: joints marked by eye, mirroring the left hand; palm up, thin band"}],
    "hand-e4-clap-f2-together-e": [{"view": "hidden", "note": "behind the front hand"}, None],
    "hand-f4-phone-two-hands-e": [{"view": "hidden", "note": "fingers wrap round the phone; first segments face away"},
                                  {"view": "hidden", "note": "fingers wrap round the phone; first segments face away"}],
}
