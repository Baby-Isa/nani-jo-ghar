#!/usr/bin/env python3
"""s08 character sheets in the locked style (Zafar, 16 Oct: the style is sources/art/s08/lineup-v4-1.png).

    python3 build/gen_s08_sheets.py [--only doctor,nani,girl] [--n 2]

The three sheets Zafar reviews in chat before the Chrome run; every later pose is an edit of the approved sheet. Same
settings as the lineups he approved: chatgpt-image-latest, /images/edits, quality high, input_fidelity high, 1536x1024.
Skin swatches sampled from lineup-v4-1 (the median skin of each face): the doctor #c88a6f, Nani #d5906c, the girl #da956c.
Writes sources/art/s08/sheet-<who>-<n>.png. --rev 2 (Zafar, 16 Oct "yes to all, try improve"): the skin held to the
swatch, stylised adult hands like the girl's, a relaxed natural stance, full clean panels (no empty boxes, no fade),
written as sheet-<who>-v2-<n>.png. --proportion: one lineup with the adults a touch more stylised (head about 1/6.5 of
their height), faces untouched, as lineup-v6-<n>.png, for a side-by-side with lineup-v4-1.
"""
import argparse, base64, os, sys, time
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "sources/art/s08"
LINEUP = "sources/art/s08/lineup-v4-1.png"
LAYOUT = (
    "Lay it out as a clean character sheet on a plain flat mid-grey (#808080) background, in the EXACT art style, render, "
    "soft studio lighting and level of realism of the {who_short} in the FIRST attached picture (the locked family lineup): "
    "top row, the full body four times at the same size and on one floor line: front, three-quarter view turned to our "
    "left, side view facing left, back view; to the right, a large head-and-shoulders close-up, face-on, gently smiling. "
    "Bottom row, small panels: both hands (backs, relaxed), {extras}, and a row of round colour swatches: skin {skin}, "
    "{swatches}. The face must keep its likeness from the FIRST picture exactly (face shape, eyes and their size and "
    "openness, glasses, {face}); the skin tone exactly the same warm {skin} in every panel, never lighter, darker, greyer or "
    "pinker. Simple, clean clothing with no fine texture: {clothes}. Modest clothing. No text, no labels, no names, no "
    "borders between panels beyond soft spacing."
)
WHO = {
    "doctor": dict(
        who_short="grandfather (the man on the left)", skin="#c88a6f",
        face="the bald crown with short white hair at the sides, the short neat solid white beard and moustache",
        extras="his clear rectangular glasses, his silver watch",
        swatches="navy blue, white, charcoal grey, brown",
        clothes="a plain soft navy blazer with only a faint large check, a white open-collar shirt, plain charcoal trousers, "
                "brown shoes, a silver watch on his left wrist",
        refs=[LINEUP, "sources/art/s07/doctor-s1-sheet-v1.png"],
        note="The SECOND attached picture is his older sheet: use it only for his turnaround angles and his back view, "
             "never for its more realistic render or its detailed fabric."),
    "nani": dict(
        who_short="grandmother Nani (the woman in the red hijab, in the middle)", skin="#d5906c",
        face="the red hijab framing her face, round gold glasses",
        extras="her round gold glasses, her plain red dupatta's simple border",
        swatches="red, cream, gold",
        clothes="a red hijab and a plain red dupatta with one simple border, a long plain cream kameez with a few bold "
                "simple red flower motifs at the neckline, cuffs and hem only, plain cream trousers, simple gold flat "
                "sandals; slim and upright, about 5 foot 5 to 5 foot 6",
        refs=[LINEUP, "sources/art/characters/nani-sheet-v2-approved.png"],
        note="The SECOND attached picture is her older sheet: use it only for her turnaround angles and back view, never "
             "for its older render, its fine embroidery or its proportions."),
    "girl": dict(
        who_short="little girl (on the right, in the yellow dress)", skin="#da956c",
        face="her two plaits with white ribbons, her big round eyes",
        extras="her white sandals, one white ribbon",
        swatches="yellow, white, dark brown hair",
        clothes="a plain yellow dress, white leggings, white sandals, white ribbons on her two plaits",
        refs=[LINEUP, "sources/art/clinic-heal-v3/s1-girl-sheet-v2.png"],
        note="The SECOND attached picture is her existing sheet: she must look exactly like it (she is unchanged); use it "
             "for her face, hands and turnaround."),
}


REV2 = (
    " IMPORTANT, a professional studio character sheet: (1) the skin is EXACTLY {skin} on the face and hands in every "
    "panel, matching the FIRST picture; not lighter, not paler, not pinker. (2) Hands are stylised exactly like the little "
    "girl's hands in the FIRST picture: soft, simple, slightly chunky, smooth skin, no veins, no wrinkles, no knuckle "
    "detail. (3) The four full-body turnaround figures stand in a relaxed natural stance with a slight weight shift, arms "
    "resting naturally, a hint of personality; not a stiff mannequin pose. (4) Every panel is filled and cleanly composed "
    "with even spacing, edge to edge: no empty boxes, no blank panels, no vignette or fade around the close-up; the "
    "close-up is a clean head-and-shoulders on the same flat grey."
)


def run(who, n, key, rev=1):
    w = WHO[who]
    prompt = "Make ONE character sheet picture for a children's game. " + LAYOUT.format(**w) + " " + w["note"]
    if rev == 2:
        prompt += REV2.format(**w)
    files = [("image[]", (Path(p).name, open(ROOT / p, "rb"), "image/png")) for p in w["refs"]]
    data = {"model": "chatgpt-image-latest", "prompt": prompt, "quality": "high", "size": "1536x1024", "n": str(n),
            "input_fidelity": "high"}
    for attempt in range(3):
        r = requests.post("https://api.openai.com/v1/images/edits", headers={"Authorization": "Bearer " + key},
                          data=data, files=files, timeout=600)
        if r.status_code == 200:
            break
        print(who, "attempt", attempt, r.status_code, r.text[:300], file=sys.stderr)
        time.sleep(5)
    else:
        return
    for i, item in enumerate(r.json()["data"], 1):
        (OUT / (f"sheet-{who}-v2-{i}.png" if rev == 2 else f"sheet-{who}-{i}.png")).write_bytes(base64.b64decode(item["b64_json"]))
    print(who, "done", n)


PROP = (
    "Edit the attached picture (the family lineup). Keep the three people, their faces and likeness EXACTLY (face shape, "
    "eyes and their size, glasses, beard, hijab framing), their clothes and colours, the skin tones, the art style, light "
    "and background, the girl completely unchanged. Change ONLY the two adults' proportions, a touch more stylised so the "
    "family reads as one designed cast: their heads slightly larger relative to their bodies (about one sixth and a half "
    "of their height instead of one seventh and a half), bodies slightly simpler and softer, hands simpler and softer like "
    "the girl's. Keep their heights relative to each other and to the girl (Nani just below the grandfather's eyebrows, "
    "the girl about two thirds of his height) and their feet on one floor line. No text, no labels."
)


def prop(n, key):
    files = [("image[]", ("lineup-v4-1.png", open(ROOT / LINEUP, "rb"), "image/png"))]
    data = {"model": "chatgpt-image-latest", "prompt": PROP, "quality": "high", "size": "1536x1024", "n": str(n),
            "input_fidelity": "high"}
    r = requests.post("https://api.openai.com/v1/images/edits", headers={"Authorization": "Bearer " + key},
                      data=data, files=files, timeout=600)
    if r.status_code != 200:
        sys.exit(f"proportion {r.status_code} {r.text[:300]}")
    for i, item in enumerate(r.json()["data"], 1):
        (OUT / f"lineup-v6-{i}.png").write_bytes(base64.b64decode(item["b64_json"]))
    print("proportion done", n)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", default="doctor,nani,girl")
    ap.add_argument("--n", type=int, default=2)
    ap.add_argument("--rev", type=int, default=1)
    ap.add_argument("--proportion", action="store_true")
    a = ap.parse_args()
    key = os.environ.get("OPENAI_API_KEY") or sys.exit("OPENAI_API_KEY is not set")
    if a.proportion:
        prop(a.n, key)
        sys.exit()
    for who in a.only.split(","):
        run(who.strip(), a.n, key, a.rev)
