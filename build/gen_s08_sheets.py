#!/usr/bin/env python3
"""s08 character sheets in the locked style (Zafar, 16 Oct: the style is sources/art/s08/lineup-v4-1.png).

    python3 build/gen_s08_sheets.py [--only doctor,nani,girl] [--n 2]

The three sheets Zafar reviews in chat before the Chrome run; every later pose is an edit of the approved sheet. Same
settings as the lineups he approved: chatgpt-image-latest, /images/edits, quality high, input_fidelity high, 1536x1024.
Skin swatches sampled from lineup-v4-1 (the median skin of each face): the doctor #c88a6f, Nani #d5906c, the girl #da956c.
Writes sources/art/s08/sheet-<who>-<n>.png.
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


def run(who, n, key):
    w = WHO[who]
    prompt = "Make ONE character sheet picture for a children's game. " + LAYOUT.format(**w) + " " + w["note"]
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
        (OUT / f"sheet-{who}-{i}.png").write_bytes(base64.b64decode(item["b64_json"]))
    print(who, "done", n)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", default="doctor,nani,girl")
    ap.add_argument("--n", type=int, default=2)
    a = ap.parse_args()
    key = os.environ.get("OPENAI_API_KEY") or sys.exit("OPENAI_API_KEY is not set")
    for who in a.only.split(","):
        run(who.strip(), a.n, key)
