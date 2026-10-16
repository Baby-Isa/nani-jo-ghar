#!/usr/bin/env python3
"""s08 API redos (Zafar, 16 Oct: "fix Nani and the items that failed their checks yourself through the API now").

    python3 build/gen_s08_redo.py --only N-LEAN-NEUTRAL,DT-QL [--try 1] [--jobs 4]
    python3 build/gen_s08_redo.py --list

Each line is one /images/edits call from its named source, so pose, scale, feet line and framing stay as they are.
Same settings as build/gen_s08_sheets.py: chatgpt-image-latest, quality high, input_fidelity high, the source's size.
Every try is written to sources/art/s08/extra/<name>-try<k>.png; the kept one is copied to its final name by hand after
judging. Each call's usage and cost estimate is appended to $REDO_LOG (a JSONL outside the repo; the report tabulates it).
Cost estimate (gpt-image-1 list rates, an upper bound): text in $5/M, image in $10/M, image out $40/M.
"""
import argparse, base64, json, os, sys, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import requests
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
S08 = "sources/art/s08"
EXTRA = ROOT / S08 / "extra"
REF = ROOT / S08 / "extra" / "ref"
LOG = Path(os.environ.get("REDO_LOG", "/tmp/s08-api-redo.calls.jsonl"))

KEEP = (" Change nothing else: the same person, likeness, face shape, expression, eyes and their size, eyelids, brows, "
        "mouth, nose, round gold glasses, the red hijab and how it frames her face, clothes, hands, pose, size and position in "
        "the frame, lighting and background{counter}. Do not move, resize, crop, add or remove anything. No rings on any "
        "finger; the hands stay soft and stylised. No text, letters or marks. Keep the picture exactly the same size and "
        "shape as the FIRST attached one.")
JAW = ("Edit the FIRST attached picture (Nani). Repaint ONLY her lower face: the cheeks, jaw and chin. Now they look "
       "bumpy and spotty: the jaw outline has small lumps (jowl bulges) either side of the chin with dips between them, "
       "and there are patchy pale highlight spots and blotches on the chin and lower cheeks. Replace that with ONE smooth, "
       "continuous, softly rounded jaw curve from cheek to chin to cheek where the face meets the hijab, with no lumps, "
       "bulges, dips or double chin, and smooth, even, soft gradient shading like a clean animated-film render, as on her "
       "face in the SECOND attached picture (her approved sheet close-up): no blotches, spots, mottling, grain or "
       "speckled highlights, only one soft broad highlight and gentle cheek colour. Her face keeps its own round shape "
       "and size; only the surface and the outline's lumps change. In the same edit make her face skin one even warm "
       "tone exactly #D5906C (warm tan-peach, a little less orange-red and a touch deeper than now), the hands the same "
       "tone.")
NANI = {  # line id -> source, kind
    "N-3Q-LEFT-NEUTRAL": "nani-3q-left-neutral-v2", "N-3Q-LEFT-TALK": "nani-3q-left-talk-v2",
    "N-3Q-RIGHT-NEUTRAL": "nani-3q-right-neutral-v2", "N-3Q-RIGHT-TALK": "nani-3q-right-talk-v2",
    "N-FRONT-BLINK": "nani-front-blink-v2", "N-FRONT-NEUTRAL": "nani-front-neutral-v2",
    "N-FRONT-TALK": "nani-front-talk-v2", "N-LEAN-BLINK": "nani-lean-blink-v2", "N-LEAN-HAPPY": "nani-lean-happy-v2",  # lean-point-v2 is replaced by NL-PNT
    "N-LEAN-NEUTRAL": "nani-lean-neutral-v2", "N-LEAN-TALK": "nani-lean-talk-v2",
}
GRID = (" The background stays one flat mid-grey and the image keeps its plain grey gutters; nothing touches or crosses "
        "a cell boundary.")


def ref_crops():
    """Head references cut from approved art, written once to extra/ref/."""
    REF.mkdir(parents=True, exist_ok=True)
    out = {"nani-close": REF / "nani-sheet-final-close.png", "doc-head": REF / "doctor-front-neutral-v2-head.png"}
    if not out["nani-close"].exists():
        Image.open(ROOT / S08 / "sheet-nani-final-1.png").crop((1460, 60, 2000, 600)).resize((1024, 1024), Image.LANCZOS).save(out["nani-close"])
    if not out["doc-head"].exists():
        Image.open(ROOT / S08 / "doctor-front-neutral-v2.png").crop((372, 20, 652, 300)).resize((1024, 1024), Image.LANCZOS).save(out["doc-head"])
    return {k: str(v.relative_to(ROOT)) for k, v in out.items()}


def lines():
    r = ref_crops()
    L = {}
    for lid, src in NANI.items():
        counter = ", the marble counter and her forearms on it" if "lean" in src else ""
        expr = {"blink": "the same expression with both eyes closed in a calm blink", "talk": "the same talking "
                "expression and open mouth", "happy": "the same happy smile"}.get(src.split("-")[-2],
                "the same gentle closed smile")
        L[lid] = dict(src=[f"{S08}/{src}.png", r["nani-close"]], out=src.replace("-v2", "-v3"),
                      prompt=JAW + KEEP.format(counter=counter), crop="lean" if "lean" in src else "stand", expr=expr,
                      skin="#D5906C")
    FACE_EXPR = ["a calm neutral face, mouth closed", "talking, the mouth half open", "talking, the mouth more open",
                 "a smile", "laughing", "a blink with both eyes closed", "surprised", "thinking", "concerned", "proud",
                 "a nod", "listening"]
    for i, e in enumerate(FACE_EXPR, 1):  # Nani's face sheet, one close-up per cell; --merge-faces builds nani-faces-v2
        L[f"N-FACES-C{i}"] = dict(src=[f"{S08}/nani-faces-v1.png", r["nani-close"]], out=f"nani-faces-v2-c{i}",
                                  crop=f"cell:{i}", expr=f"the same expression ({e})", skin="#D5906C", close_only=True,
                                  prompt="(CLOSE)")
    L["NL-PNT"] = dict(src=[f"{S08}/nani-lean-neutral-v3.png", r["nani-close"]], out="nani-lean-point-v3", prompt=(
        "Edit the FIRST attached picture (Nani leaning on the marble counter). Change ONLY her right arm and hand (on the "
        "viewer's LEFT): that forearm and elbow stay resting on the counter while the hand lifts a little off the marble "
        "and her index finger points straight DOWN at the counter top just in front of her, as if showing where to put "
        "something; the other fingers softly curled, the thumb relaxed. The finger points at the counter, never at "
        "herself, her chest or her dupatta. Her left forearm (on the viewer's right) stays lying flat on the counter "
        "in front of her, its hand relaxed and flat. The thin PEARL BRACELET stays on her RIGHT wrist (the pointing arm, "
        "on the viewer's left), clearly visible just above the pointing hand, as on the forearm in the picture now. "
        "The pointing hand is soft and stylised exactly like her other hand: smooth, slightly chunky, no knuckle "
        "creases or wrinkles, normal size, five fingers. Her face, head, glasses and hijab stay EXACTLY as they are, "
        "pixel for pixel.") + KEEP.format(counter=", the marble counter").replace("expression, ", "").replace("hands, pose, ", ""))
    DKEEP = (" Change nothing else: the same man, face, glasses, beard, hair, head angle, clothes, hands, watch, pose, size and "
             "position in the frame, skin tone, lighting and flat grey background, pixel for pixel. Do not move, resize, crop "
             "or add anything. No text. Keep the picture exactly the same size and shape as the attached one.")
    L["DT-QL"] = dict(src=[f"{S08}/doctor-3q-left-neutral-v2.png"], out="doctor-3q-left-talk-v2", prompt=(
        "Edit the attached picture. Change ONLY his mouth and brows: talking, the mouth open mid-word in a natural spoken "
        "shape, the upper teeth just showing, the brows lifted a little, kind and attentive." + DKEEP))
    L["DB-QL"] = dict(src=[f"{S08}/doctor-3q-left-neutral-v2.png"], out="doctor-3q-left-blink-v2", prompt=(
        "Edit the attached picture. Change ONLY his eyes: BOTH eyes gently closed, as in a calm blink, the lids relaxed "
        "behind his glasses; the mouth closed and unchanged." + DKEEP))
    L["DX3"] = dict(src=[r["doc-head"], f"{S08}/doctor-front-neutral-v2.png", f"{S08}/doctor-faces-v2.png"],
                    out="doctor-faces-v3", size="1536x1024", prompt=(
        "Make ONE picture: a sheet of twelve head-and-shoulders faces of the grandfather in the FIRST and SECOND attached "
        "pictures, in EXACTLY the layout of the THIRD attached picture (a 4 by 3 grid of equal cells on one flat mid-grey "
        "#808080, the same cell size, head size and head position in every cell, eyes on one line per row, the blazer "
        "shoulders running off the cell's lower edge, plain grey gutters between cells, nothing crossing a cell "
        "boundary). The face, likeness and render are ONLY from the FIRST and SECOND pictures (his new cartoony look): the "
        "same rounder stylised face, eye size, nose, short white beard and moustache, bald crown with white hair at the "
        "sides, clear rectangular glasses, white open shirt and navy blazer, and the same warm skin colour exactly as in "
        "the FIRST picture; never the older, more realistic render of the THIRD picture. Copy the THIRD picture CELL FOR "
        "CELL: each cell has exactly the same expression, head turn and tilt as the same cell of the THIRD picture. "
        "Whenever his eyes close, BOTH eyes close together: never a wink, never one eye shut. The expressions, in order, left "
        "to right, top row first: (1) neutral, kind, mouth closed; (2) talking, mouth half open mid-word; (3) talking, "
        "mouth more open, a different syllable; (4) smiling, mouth closed; (5) laughing, mouth open, both eyes open and "
        "crinkled; (6) blink, BOTH eyes closed, mouth closed; (7) surprised, eyes wide, brows up, a small round mouth; "
        "(8) thinking, eyes looking up to the side, mouth a little pursed; (9) concerned, brows drawn together and up, "
        "a small sympathetic mouth; (10) proud, a warm closed smile, chin a little up; (11) nod, the head tipped a little "
        "down, a gentle smile; (12) listening, the head tilted a little, attentive, mouth closed. Only the face changes "
        "from cell to cell. Stylised and smooth: no pores, weave or single hairs. No text, labels, numbers or lines."))
    IT = f"{S08}/items"
    L["GS1"] = dict(src=["sources/art/clinic-heal-v3/girl-w1-front-neutral-v1.png"], out="items/girl-w4-front-sore-v2",
                    prompt=(
        "Edit the attached picture. Change ONLY her face, to this expression: a small comic wince of being sore: BOTH eyes "
        "OPEN and looking at us, a little narrowed with the lower lids raised, both eyes equally open (never one eye shut, "
        "never a wink); the brows pulled together and up in the middle; the mouth a small OPEN \"ow\": the lips "
        "parted in a small uneven open shape with the upper teeth just showing, the corners pulled down a little, never "
        "puckered or pouting, never a kiss; mild and a little funny, never real distress, no tears. Her plaits, ribbons, dress, hands and "
        "legs stay exactly as they are. Everything else stays exactly the same: the same girl, pose, body, clothes, hair, "
        "colours and skin; the same size and position in the frame; the same lighting; the same flat mid-grey "
        "background with no shadows. Do not move, resize, crop or add anything. No text, tears, sweat drops, stars or "
        "motion lines. Keep the picture exactly the same size and shape as the attached one."))
    ITEM = (" Background: one perfectly flat, uniform neutral mid-grey #808080 edge to edge, NO shadows of any kind. Style "
            "exactly as the FIRST attached picture: a stylised 3D animated-feature-film look, soft global illumination, "
            "warm light from the upper left, no outlines. No grid lines, borders, labels, text or numbers.")
    L["CP1"] = dict(src=["sources/art/chai-v2/pan-top-draft1.png"], out="items/cp1-chai-pan-tilt-v2", size="1536x1024",
                    gen=True, prompt=(  # try 3 attached the draft and copied its brown ground and diagonal handle; tries 4-5 are text-only generations
        "Make ONE new picture: a sprite sheet for a cooking game of the same small brushed-steel "
        "chai pan six times, in an invisible grid of 3 columns by 2 rows of equal cells. TRUE ORTHOGRAPHIC TOP VIEW, "
        "the camera straight down over the middle of each pan: no perspective, the pan's outer wall never visible. "
        "The pan is a round saucepan with a small pouring lip at its LEFT and a straight black handle sticking straight "
        "out to the RIGHT, exactly horizontal. Every pan is the same size, centred in its cell, filling only about 55% "
        "of the cell's width including the handle, with generous clear grey margins on all sides; nothing near a cell "
        "boundary or the image edge. Flat, even, soft light; NO cast shadow, no contact shadow, no drop shadow, no glow. "
        "Row 1: (1) FLAT: the rim a perfect circle, full of milky tan chai with a level round surface. (2) tipped a "
        "little towards the lip: the rim seen as a slightly narrow upright oval, the chai slid towards the lip, a thin "
        "crescent of bare steel inside at the right. (3) tipped more: a narrower oval, a wide crescent of bare steel at "
        "the right, the chai pooled at the lip. Row 2: (4) tipped the most: the narrowest oval, most of the inside bare "
        "steel, the chai only at the lip, not pouring. (5) as 4 and POURING: a smooth stream of milky tan chai falling "
        "from the lip to the left. (6) as 5 but clear dark reddish-brown black tea in the pan and in the stream. The "
        "flat pan and the three tilts must be plainly different at a glance. Background: one perfectly flat, uniform "
        "neutral mid-grey #808080 edge to edge, the SAME grey everywhere: no gradient, no vignette, no dark corners, no "
        "brown or warm tint, no glow, halo or light spot around any pan. Style: a stylised 3D animated-feature-film look, soft global "
        "illumination, no outlines. No grid lines, borders, labels, text or numbers."))
    L["DM2"] = dict(src=["sources/art/s07/dm2-levers-drops-v1.png", "sources/art/s08/extra/dm2-levers-drops-v2-try1.png"],
                    out="items/dm2-levers-drops-v2", prompt=(
        "Edit the FIRST attached picture, a sprite sheet of exactly SIX things in 3 columns by 2 rows: row 1 = (1) the "
        "steel lever UP, (2) the same lever DOWN, (3) the RED drop; row 2 = (4) the YELLOW drop, (5) the BLUE drop, (6) "
        "the GREEN drop. Keep that layout and every position exactly: only two levers, four drops, the red drop at the "
        "top right. Keep the two levers exactly as they are. Redraw ONLY the four drops so they look exactly like the "
        "MATTE drops in the SECOND attached picture: liquid medicine syrup, soft, completely matte and softly "
        "translucent, no glossy shine, no white specular highlights, no hard reflections, never like a sweet, candy, "
        "jelly, gem or bead; the same teardrop shape and size as now, all four the same. Nothing touches a cell "
        "boundary." + ITEM))
    L["B1"] = dict(src=["sources/art/s07/b1-plaster-level-colours-v1.png", "sources/art/s07/b5-drops-colours-v1.png"],
                   out="items/b1-plaster-level-colours-v2", prompt=(
        "Edit the FIRST attached picture (a sheet of the same child's sticking plaster in eight cells, 4 columns by 2 "
        "rows). Keep the plaster's design, colours and the bottom-row cells 6, 7 and 8 (red, blue, green seen from "
        "straight above) exactly as they are. Redraw the top row (1 red, 2 blue, 3 green, 4 yellow) and cell 5 (the "
        "skin-coloured one, bottom left) from the BELT CAMERA: a low three-quarter view from the front and a little "
        "above, about 20 degrees above the plaster, exactly the camera of the things on the SECOND attached picture's "
        "top row: so each plaster, lying flat and level on an invisible surface with its long axis left to right, is "
        "seen strongly foreshortened: on screen each one is a THIN squashed strip, its height only about one fifth of "
        "its width (far thinner than the top-down ones in cells 6 to 8), its pale pad a thin raised band in perspective, "
        "its near edge thickness showing along the bottom. These five must look clearly different from the top-down cells. "
        "Each of these five plasters fills only about 70% of its cell's width (narrower than now), centred, "
        "with clear grey all round. No surface drawn, no shadows." + ITEM))
    L["SK2"] = dict(src=["sources/art/s08/extra/sk2-sekelo-plate-skewers-v2-try2.png"],
                    out="items/sk2-sekelo-plate-skewers-v2", prompt=(  # round 2: edit the best try (margins right)
        "Edit the attached picture (four steel plates seen straight down, holding one, two, three and four bamboo "
        "skewers). Keep the plates, their size and position, the margins and the grey background exactly. Change ONLY "
        "the skewers: make every skewer SHORTER and move it to the left, so that each whole skewer, point AND wooden "
        "handle, lies completely INSIDE the plate's inner rim, with a clear band of bare steel between the end of each "
        "handle and the plate's right rim, and a clear band between each point and the left rim. Nothing crosses or "
        "touches the rim. The skewers stay straight, parallel, left to right, evenly spaced about the middle, handles "
        "to the right, a soft contact shadow on the steel only. No text."))
    return L


CLOSE = ("Edit the FIRST attached picture, a close-up of Nani's face (it is cut from a larger picture and will be pasted "
         "back, so the framing, size and position of everything must stay exactly as they are). Repaint ONLY the skin of "
         "her face, above all the lower face: the cheeks, jaw and chin. Now they look bumpy and spotty: the jaw outline has "
         "small lumps (jowl bulges) either side of the chin with dips between them, and there are patchy pale highlight "
         "spots and blotches on the chin and lower cheeks. Replace that with ONE smooth, continuous, softly rounded jaw "
         "curve from cheek to chin to cheek where the face meets the hijab, with no lumps, bulges, dips or double chin "
         "(above all the bulge low on each cheek beside the chin), and smooth, even, soft gradient shading like a clean animated-film render, as on her face in the SECOND attached "
         "picture (her approved sheet close-up): no blotches, spots, mottling, grain or speckled highlights, only one soft "
         "broad highlight and gentle cheek colour. Make the face skin one even warm tone exactly #D5906C (warm tan-peach, "
         "a little less orange-red and a touch deeper than now; never pinker or rosier, the cheek blush faint). Keep her likeness exactly: the same face shape and size, "
         "{expr}, the same eyes and their size and openness, eyelids, brows, nose, mouth and lips, the round gold glasses "
         "and their exact position, the red hijab and how it frames her face. Change nothing else; do not move, resize or "
         "re-frame anything. No text.")


def face_box(a, kind):
    """A square around the largest skin blob in the face area (px in the full picture). kind "cell:<i>" searches only
    cell i (1-12, row by row) of a 4x3 face sheet and keeps the square inside that cell."""
    import numpy as np, cv2
    H, W = a.shape[:2]
    rx0, ry0, rx1, ry1 = 0, 0, W, int(H * (0.45 if kind == "lean" else 0.22))
    if kind.startswith("cell:"):
        i = int(kind[5:]) - 1
        rx0, ry0 = (i % 4) * W // 4, (i // 4) * H // 3
        rx1, ry1 = rx0 + W // 4, ry0 + H // 3
    sub = a[ry0:ry1, rx0:rx1]
    hsv = cv2.cvtColor(sub, cv2.COLOR_RGB2HSV)
    sk = ((hsv[..., 0] >= 5) & (hsv[..., 0] <= 22) & (hsv[..., 1] > 60) & (hsv[..., 1] < 170) & (hsv[..., 2] > 120))
    sk = cv2.morphologyEx(sk.astype(np.uint8), cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    n, lb, st, _ = cv2.connectedComponentsWithStats(sk)
    i = 1 + int(np.argmax(st[1:, 4]))
    x, y, w, h = st[i, :4]
    side = min(int(max(w, h) * 1.6), rx1 - rx0, ry1 - ry0)
    cx, cy = rx0 + x + w // 2, ry0 + y + h // 2
    x0 = max(rx0, min(rx1 - side, cx - side // 2)); y0 = max(ry0, min(ry1 - side, cy - side // 2))
    mask = np.zeros((H, W), bool); mask[ry0:ry1, rx0:rx1] = lb == i
    return (x0, y0, x0 + side, y0 + side), mask


def paste_face(src, gen, box, skin, out, target=None):
    """Paste the generated close-up back: only the face (its skin blob grown and feathered), all else the source."""
    import numpy as np, cv2
    a = np.asarray(Image.open(src).convert("RGB")).astype(float)
    x0, y0, x1, y1 = box
    g = np.asarray(Image.open(gen).convert("RGB").resize((x1 - x0, y1 - y0), Image.LANCZOS)).astype(float)
    m = np.zeros(a.shape[:2], np.uint8); m[:skin.shape[0], :skin.shape[1]] = skin
    m = m[y0:y1, x0:x1]
    pts = cv2.findNonZero(m); hull = np.zeros_like(m); cv2.fillConvexPoly(hull, cv2.convexHull(pts), 1)
    r = max(3, (x1 - x0) // 40)
    hull = cv2.dilate(hull, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1)))
    f = cv2.GaussianBlur(hull.astype(float), (0, 0), r / 1.5)[..., None]
    a[y0:y1, x0:x1] = g * f + a[y0:y1, x0:x1] * (1 - f)
    if target:  # bring the face skin to the swatch: one measured Lab shift over the pasted face's skin-hued pixels
        crop = a[y0:y1, x0:x1].astype(np.float32) / 255
        lab = cv2.cvtColor(crop, cv2.COLOR_RGB2LAB)
        hsv = cv2.cvtColor((crop * 255).astype(np.uint8), cv2.COLOR_RGB2HSV)
        sk = (hsv[..., 0] >= 5) & (hsv[..., 0] <= 22) & (hsv[..., 1] > 60) & (hsv[..., 1] < 170) & (hsv[..., 2] > 120)
        core = cv2.erode(hull, np.ones((2 * r + 1, 2 * r + 1), np.uint8)) > 0
        want = cv2.cvtColor(np.float32([[[int(target[i:i + 2], 16) / 255 for i in (1, 3, 5)]]]), cv2.COLOR_RGB2LAB)[0, 0]
        shift = want - np.median(lab[sk & core], 0)
        w = cv2.GaussianBlur(sk.astype(np.float32), (0, 0), 2)[..., None] * f
        lab = (lab + shift * w).astype(np.float32)
        a[y0:y1, x0:x1] = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB).clip(0, 1) * 255
        print("  skin shift Lab", np.round(shift, 1))
    Image.fromarray(a.clip(0, 255).astype("uint8")).save(out)


def register_face(base, gen, out, box=(380, 30, 720, 360)):
    """Pixel-register a face edit to its base: the base everywhere except the changed face area (hull, grown, feathered)."""
    import numpy as np, cv2
    a = np.asarray(Image.open(base).convert("RGB")).astype(float)
    g = np.asarray(Image.open(gen).convert("RGB")).astype(float)
    x0, y0, x1, y1 = box
    c = np.zeros(a.shape[:2], np.uint8)
    c[y0:y1, x0:x1] = (np.abs(a - g).mean(2)[y0:y1, x0:x1] > 18)
    c = cv2.morphologyEx(c, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    hull = np.zeros_like(c); cv2.fillConvexPoly(hull, cv2.convexHull(cv2.findNonZero(c)), 1)
    hull = cv2.dilate(hull, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31)))
    f = cv2.GaussianBlur(hull.astype(float), (0, 0), 6)[..., None]
    Image.fromarray((g * f + a * (1 - f)).clip(0, 255).astype("uint8")).save(out)
    return float(hull.mean())


def call(lid, spec, k, key):
    import io
    import numpy as np
    out = EXTRA / f"{Path(spec['out']).name}-try{k}.png"
    W, H = Image.open(ROOT / spec["src"][0]).size
    size = spec.get("size") or ("1536x1024" if W > H else "1024x1536")
    blobs = [(Path(p).name, (ROOT / p).read_bytes()) for p in spec["src"]]
    prompt = spec["prompt"]
    if spec.get("crop"):  # the close-up way: cut the face square, upscale, edit at 1024, paste back the face only
        a = np.asarray(Image.open(ROOT / spec["src"][0]).convert("RGB"))
        box, skin = face_box(a, spec["crop"])
        buf = io.BytesIO(); Image.fromarray(a).crop(box).resize((1024, 1024), Image.LANCZOS).save(buf, "PNG")
        blobs[0] = ("face-close.png", buf.getvalue())
        size = "1024x1024"
        prompt = CLOSE.format(expr=spec["expr"])
    data = {"model": "chatgpt-image-latest", "prompt": prompt, "quality": "high", "size": size, "n": "1",
            "input_fidelity": "high"}
    if spec.get("gen"):  # a fresh generation from text: /images/generations, no attachment
        blobs = []
    for attempt in range(6):  # 16 Oct: the account's credit check bounced some calls with 429 and passed on a retry
        files = [("image[]", (n, b, "image/png")) for n, b in blobs]
        if spec.get("gen"):
            r = requests.post("https://api.openai.com/v1/images/generations", timeout=600, json={k: v for k, v in data.items()
                              if k != "input_fidelity"} | {"n": 1}, headers={"Authorization": "Bearer " + key})
        else:
            r = requests.post("https://api.openai.com/v1/images/edits", headers={"Authorization": "Bearer " + key},
                              data=data, files=files, timeout=600)
        if r.status_code == 200:
            break
        print(lid, "attempt", attempt, r.status_code, r.text[:120].replace("\n", " "), file=sys.stderr)
        time.sleep(15)
    else:
        return
    j = r.json()
    raw = base64.b64decode(j["data"][0]["b64_json"])
    if spec.get("crop"):
        close = out.with_name(out.stem + "-close.png"); close.write_bytes(raw)
        if not spec.get("close_only"):
            paste_face(ROOT / spec["src"][0], close, box, skin, out, spec.get("skin"))
    else:
        out.write_bytes(raw)
    u = j.get("usage", {})
    d = u.get("input_tokens_details", {})
    cost = d.get("text_tokens", 0) * 5e-6 + d.get("image_tokens", 0) * 10e-6 + u.get("output_tokens", 0) * 40e-6
    rec = dict(line=lid, try_=k, out=str(out.relative_to(ROOT)), src=spec["src"], size=size, usage=u,
               cost=round(cost, 3), prompt=prompt, crop=spec.get("crop") and list(map(int, box)), t=time.strftime("%H:%M:%S"))
    with open(LOG, "a") as f:
        f.write(json.dumps(rec) + "\n")
    print(lid, "try", k, "->", out.name, "$%.3f" % cost)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", default="")
    ap.add_argument("--try", dest="k", type=int, default=1)
    ap.add_argument("--jobs", type=int, default=4)
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--merge-faces", metavar="T1,..,T12", help="no API: paste the 12 kept cell close-ups (the try per "
                    "cell) into nani-faces-v1 as sources/art/s08/nani-faces-v2.png")
    ap.add_argument("--register", metavar="LINE:TRY", help="no API: register a kept doctor face edit to its base "
                    "(DT-QL:1 writes sources/art/s08/doctor-3q-left-talk-v2.png from extra/...-try1.png)")
    a = ap.parse_args()
    L = lines()
    if a.merge_faces:
        import numpy as np
        src = ROOT / S08 / "nani-faces-v1.png"; out = ROOT / S08 / "nani-faces-v2.png"
        base = np.asarray(Image.open(src).convert("RGB"))
        cur = src
        for i, k in enumerate(a.merge_faces.split(","), 1):
            box, skin = face_box(base, f"cell:{i}")
            paste_face(cur, EXTRA / f"nani-faces-v2-c{i}-try{k}-close.png", box, skin, out, "#D5906C")
            cur = out
        print("merged", out)
        sys.exit()
    if a.register:
        lid, k = a.register.split(":")
        sp = L[lid]
        share = register_face(ROOT / sp["src"][0], EXTRA / f"{Path(sp['out']).name}-try{k}.png", ROOT / S08 / f"{sp['out']}.png")
        print(lid, "registered; face area %.2f%% of the frame" % (100 * share))
        sys.exit()
    if a.list:
        for lid, s in L.items():
            print(lid, s["src"], "->", s["out"])
        sys.exit()
    key = os.environ.get("OPENAI_API_KEY") or sys.exit("OPENAI_API_KEY is not set")
    EXTRA.mkdir(parents=True, exist_ok=True)
    (ROOT / S08 / "items").mkdir(parents=True, exist_ok=True)
    ids = [x.strip() for x in a.only.split(",") if x.strip()] or list(L)
    with ThreadPoolExecutor(a.jobs) as ex:
        list(ex.map(lambda i: call(i, L[i], a.k, key), ids))
