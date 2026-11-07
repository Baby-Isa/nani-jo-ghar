"""The two kinds of file artcut.py's `background` job cannot make for pack s17-sky (run straight after the cut; the cut
spec build/tools/art/specs/s17-sky.cut.json names this script):

  1. door-sun.webp: the sun card, SC01 cover-cropped to 4:3 about its centre and stored at 960x720 (today's card is 640x480
     at assets/day/s12/door-sun.webp; 1.5x of that for sharp phones, never past the source). door-sun-full.webp (the
     cutter's 3:2 copy) is dropped once this exists: the card covers by CSS, and one file is enough.
  2. sky-sunny-tile.webp and sky-night-tile.webp: the door's sunny sky is also the farm photo game's sky, laid side by
     side (data/farm/photo.json, tile 3200); the night sky was asked for with joining edges too. The anchor's own edges
     differ by 12 RGB on average (the sun's haze sits on the right edge), so a copy is cross-faded 64 px with
     artlib.make_tileable (the last 64 columns blended into the first 64 and dropped: 1472x1024, seamless by
     construction). The full 1536-wide file stays for the door; a wiring sprint points photo.json at the -tile copy.

Both are recorded in assets/backgrounds/s17-sky/cut-data.json under "props" beside the cutter's own entries.
Usage, from the repo root:  python3 sources/art/s17-sky/post-cut.py
A request for a future tool change (in the landing report): `background` jobs that take a cover crop ("aspect") and a
"tile" option, so this script is not needed."""
import json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
sys.path.insert(0, os.path.join(REPO, "build", "tools", "art"))
import artlib as L  # noqa: E402

SRC = HERE
OUT = os.path.join(REPO, "assets", "backgrounds", "s17-sky")
DATA = os.path.join(OUT, "cut-data.json")
Q = 86


def rel(p):
    return os.path.relpath(p, OUT).replace(os.sep, "/")


def sun_card(src, out, size=(960, 720)):
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    W, H = im.size
    tw, th = size
    bw = round(H * tw / th)  # the 4:3 band of the 3:2 picture, full height, centred
    ox = (W - bw) // 2
    card = im.crop((ox, 0, ox + bw, H)).resize((tw, th), Image.LANCZOS)
    card.save(out, quality=Q, method=6)
    print("door-sun: %dx%d from columns %d..%d of %s (4:3 about the centre)" % (tw, th, ox, ox + bw, src))
    return {"file": rel(out), "size": [tw, th], "crop_x": ox, "src_band": [bw, H], "src": src}


def tile(src, out, ov=64):
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    before = L.seam_ratio(im)
    tl = L.make_tileable(im, ov).convert("RGB")
    tl.save(out, quality=Q, method=6)
    after = L.seam_ratio(tl)
    print("%s: seam ratio %.2f as drawn (%s), %.2f in the cross-faded -tile copy, %dx%d" % (os.path.basename(out), before, "seamless" if before <= 1.6 else "SEAM", after, tl.width, tl.height))
    return {"file": rel(out), "w": tl.width, "h": tl.height, "seam_before": round(before, 2), "seam_after": round(after, 2), "overlap": ov, "src": src}


def main():
    data = json.load(open(DATA))
    props = data.setdefault("props", {})
    props["door-sun"] = sun_card("sc01-door-sun-v1.png", os.path.join(OUT, "door-sun.webp"))
    full = os.path.join(OUT, "door-sun-full.webp")
    if os.path.exists(full):
        os.remove(full)
        props.pop("door-sun-full", None)
        print("door-sun-full.webp dropped (the 4:3 card is the one file)")
    props["sky-sunny-tile"] = tile("sd01-sky-day-sunny-v1.png", os.path.join(OUT, "sky-sunny-tile.webp"))
    props["sky-night-tile"] = tile("sn01-sky-night-v1.png", os.path.join(OUT, "sky-night-tile.webp"))
    data["_post"] = "door-sun (4:3 card) and the two -tile copies by sources/art/s17-sky/post-cut.py"
    with open(DATA, "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
