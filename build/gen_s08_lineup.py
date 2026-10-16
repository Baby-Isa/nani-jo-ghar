#!/usr/bin/env python3
"""s08 style lock (Zafar, 16 Oct): three lineups of the doctor (the grandad), Nani and the girl, for Zafar to judge by eye.

    python3 build/gen_s08_lineup.py [--only V1,V2,V3] [--n 2] [--model chatgpt-image-latest]

Zafar's go for the image API, 16 Oct ("let's use the API to quickly just generate the different versions now for me to
judge"; non-negotiable 13). Settings chosen for quality (his note: the API looked worse than ChatGPT before): the model
ChatGPT itself serves (chatgpt-image-latest), /images/edits with the approved art attached, quality high, input_fidelity
high (faces kept), 1536x1024. Writes sources/art/s08/lineup-<V>-<n>.png; never wired into the game.
  V1 Nani's level: the doctor and the girl drawn at Nani N1's level of realism; Nani unchanged.
  V2 Faces kept, bodies like the girl: the doctor's and Nani's faces exactly as they are; everything below the neck, the
     clothes, hands and the render finish in the girl's stylised world; the girl unchanged.
  V3 Cartoon: Nani a little more cartoon, the doctor a lot more, both to match the girl; the girl unchanged.
  V4 Zafar's pick (16 Oct: "these ones", V2-1) refined as an edit of lineup-v2-1.png: the eyes as they are; Nani taller
     (5'5"-5'6" beside his 5'8") and not portly; simpler clothes (no fine embroidery or weave).
  V5 V4-1 with Nani's eyes restored to V2-1's size and openness (the V4 edit shrank them).
"""
import argparse, base64, os, sys, time
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "sources/art/s08"
REFS = {
    "doctor_sheet": "sources/art/s07/doctor-s1-sheet-v1.png",
    "doctor_stand": "sources/art/s07/doctor-w1-stand-front-neutral-v1.png",
    "nani_n1": "sources/art/s07/nani-n1-lean-neutral-v1.png",
    "nani_sheet": "sources/art/characters/nani-sheet-v2-approved.png",
    "girl_stand": "sources/art/s07/girl-w13-standing-3q-right-neutral-v1.png",
    "girl_sheet": "sources/art/clinic-heal-v3/s1-girl-sheet-v2.png",
    "lineup_v21": "sources/art/s08/lineup-v2-1.png",
    "lineup_v41": "sources/art/s08/lineup-v4-1.png",
}
EDIT_V5 = (
    "Edit the FIRST attached picture. Keep everything exactly as it is (the three people, their heights, clothes, poses, "
    "the style, light and background) and change ONLY Nani's eyes (the woman in the red hijab): make her eyes exactly as "
    "big, round and open as Nani's eyes in the SECOND attached picture, warm and bright, looking at us, behind the same "
    "round gold glasses; her face shape, smile, eyebrows and hijab stay as they are in the first picture. The "
    "grandfather and the girl stay exactly the same. No text, no labels."
)
EDIT_V4 = (
    "Edit the FIRST attached picture (the lineup of the grandfather, the grandmother Nani and the little girl). Keep "
    "everything exactly as it is: the same three people, their faces and likeness, their eyes (the same size and "
    "openness), the same art style, render and soft lighting, the same pose and places, the girl completely unchanged, "
    "the same plain mid-grey background and floor shadows. Change ONLY these: (1) Nani is taller and slimmer: her real "
    "height is about 5 foot 5 to 5 foot 6 beside the grandfather's 5 foot 8, so the top of her hijab reaches about 96% of "
    "his height (just below his eyebrows), with a slim, upright figure, not short or portly; her face stays exactly the "
    "same. (2) Simpler clothes with less fine detail, the same colours: the grandfather's blazer a plain soft navy with "
    "only a faint, simple, large check (no fine weave or texture), his shirt and trousers plain; Nani's long kameez plain "
    "cream with a few bold, simple red flower motifs at the neckline, cuffs and hem only (no fine embroidery all over), "
    "her dupatta a plain red with one simple border, her trousers plain cream. Feet level on one floor line. Modest "
    "clothing. No text, no labels, no borders, no props."
)

COMMON = (
    "Make ONE picture for a children's game: a character lineup of three members of one family, standing side by side on "
    "one flat floor, full body head to toe, facing us, relaxed and smiling gently, on a plain flat mid-grey (#808080) "
    "studio background with a soft floor shadow under each. Left to right: the grandfather (the man in the attached "
    "character sheet: bald on top with short white hair at the sides, a short neat solid white beard and moustache, clear "
    "rectangular glasses, a navy blue check blazer, a white open-collar shirt, charcoal trousers, brown shoes, a silver "
    "watch on his left wrist), then the grandmother Nani (the woman in the attached pictures: her red hijab framing her "
    "face, round gold glasses, a long cream kameez with red embroidery and modest loose trousers, exactly as in her "
    "sheet), then the little girl (the five-year-old in the attached pictures: two plaits with white ribbons, a yellow "
    "dress, white leggings, white sandals). All three stand on the same floor line, their feet level; the grandfather is "
    "about one and a half times the girl's height and Nani a little shorter than him. Keep each face's likeness exactly: "
    "the face shape, the glasses, the beard and hairline, the hijab framing, the skin tone. Soft even studio light from "
    "the upper left, the same light on all three. Modest clothing, no bare arms or legs. No text, no labels, no borders, "
    "no other people, no props."
)
VARIANTS = {
    "V1": ("doctor_sheet", "doctor_stand", "nani_n1", "nani_sheet", "girl_stand", "girl_sheet"),
    "V2": ("doctor_sheet", "doctor_stand", "nani_n1", "nani_sheet", "girl_stand", "girl_sheet"),
    "V4": ("lineup_v21", "doctor_sheet", "nani_n1"),
    "V5": ("lineup_v41", "lineup_v21"),
    "V3": ("doctor_sheet", "doctor_stand", "nani_n1", "nani_sheet", "girl_stand", "girl_sheet"),
}
STYLE = {
    "V1": (" THE STYLE: all three in ONE style, the grandmother Nani's: render every character exactly at the level of "
           "realism of the attached Nani pictures (a stylised 3D animated-film adult: smooth skin with no pores, soft "
           "simple shading, natural-size eyes, real proportions). Nani stays exactly as she is. Bring the grandfather DOWN "
           "from his near-photographic pictures to Nani's level (no skin pores, no single beard hairs, no fabric weave "
           "detail; his check blazer a soft simple check). Bring the girl UP a little to Nani's level (slightly more "
           "natural proportions and a little smaller eyes than her cartoon pictures), still clearly the same girl."),
    "V2": (" THE STYLE: the faces stay as they are, the bodies become the girl's world. The grandfather's face and Nani's "
           "face keep their likeness and their level of realism exactly as in their attached pictures. Everything below "
           "the neck, and the render finish, is in the girl's stylised animated-film world: rounder, simpler body forms, "
           "soft plain fabric with no weave or texture detail (his blazer a simple soft navy check, her kameez soft cream "
           "with simple red embroidery), simpler softer hands, the girl's smooth skin finish and soft lighting, the same "
           "soft edges. The girl stays exactly as she is in her pictures."),
    "V3": (" THE STYLE: all three in the girl's stylised 3D animated-film style. The girl stays exactly as she is in her "
           "pictures. Nani becomes a LITTLE more cartoon to match her (slightly larger eyes, slightly rounder simpler "
           "forms, smoother skin) while staying clearly herself. The grandfather becomes MUCH more cartoon to match the "
           "girl (no skin pores or single hairs, larger expressive eyes behind the same glasses, rounder simpler head "
           "and body, soft simple clothes) while his face shape, glasses, beard, hairline and smile stay clearly his."),
}


def run(v, n, model, key):
    files = [("image[]", (Path(p).name, open(ROOT / p, "rb"), "image/png")) for p in (REFS[k] for k in VARIANTS[v])]
    data = {"model": model, "prompt": {"V4": EDIT_V4, "V5": EDIT_V5}.get(v) or COMMON + STYLE[v], "quality": "high", "size": "1536x1024", "n": str(n),
            "input_fidelity": "high"}
    for attempt in range(3):
        r = requests.post("https://api.openai.com/v1/images/edits", headers={"Authorization": "Bearer " + key},
                          data=data, files=files, timeout=600)
        if r.status_code == 400 and "input_fidelity" in r.text and "input_fidelity" in data:
            data.pop("input_fidelity")
            continue
        if r.status_code == 200:
            break
        print(v, "attempt", attempt, r.status_code, r.text[:300], file=sys.stderr)
        time.sleep(5)
    else:
        return []
    out = []
    for i, item in enumerate(r.json()["data"], 1):
        p = OUT / f"lineup-{v.lower()}-{i}.png"
        p.write_bytes(base64.b64decode(item["b64_json"]))
        out.append(p)
    print(v, model, "input_fidelity" in data, [str(p.relative_to(ROOT)) for p in out])
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", default="V1,V2,V3")
    ap.add_argument("--n", type=int, default=2)
    ap.add_argument("--model", default="chatgpt-image-latest")
    a = ap.parse_args()
    key = os.environ.get("OPENAI_API_KEY") or sys.exit("OPENAI_API_KEY is not set")
    OUT.mkdir(parents=True, exist_ok=True)
    for v in a.only.split(","):
        run(v.strip(), a.n, a.model, key)
