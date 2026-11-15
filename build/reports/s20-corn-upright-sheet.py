"""s20-corn-upright: the before/after sheet, made by script from the sandbox's own frames (never a shot of the builder's own).
Before: the working branch (ccr-7da5e9f0-04g4xm) played by build/sandbox/run.mjs with NJG_GAME_ROOT on its worktree; after: this
branch. One row per moment the brief's proof line names, before on the left, after on the right, each at 1:1 CSS px.
Run from the repo root: python3 build/reports/s20-corn-upright-sheet.py"""
import glob
from PIL import Image, ImageDraw, ImageFont

SB = "build/screenshots/sandbox"
OUT = "build/reports/s20-corn-upright-before-after.png"


def frame(run, page, size, name):
    """A sandbox frame by its state's name (the number before it differs between runs), or a key frame."""
    kf = name.startswith("key-") or name.startswith("strip-")
    d = f"{SB}/{run}/keyframes/{page}@{size}" if kf else f"{SB}/{run}/{page}/{size}"
    if name.startswith("strip-"):
        # (a frame strip's last frame: the moment two seconds after its light came)
        hits = sorted(glob.glob(f"{d}/{name}/f*.jpg"))[-1:]
        return hits[0] if hits else None
    hits = sorted(glob.glob(f"{d}/*{name}.png") + glob.glob(f"{d}/*{name}.jpg"))
    return hits[0] if hits else None


# (moment, page, size, before run, before frame, after run, after frame)
ROWS = [
    ("L1 740x320: the raw cobs on the band (the first one lit)", "cook-corn", "740x320", "s20-corn-upright-base", "kind-tap", "s20-corn-upright-final", "kind-tap"),
    ("L3 740x320: the flavour screen, two plates and the six bowls", "cook-corn-l3", "740x320", "s20-corn-upright-base", "c08-stage", "s20-corn-upright-final", "c08-stage"),
    ("L4 1280x665: mid-grill, a cob in the tray (2 s after the lift's light)", "cook-corn@L4", "1280x665", "s20-corn-upright-kfbase", "strip-04-light", "s20-corn-upright-kf2", "strip-03-light"),
    ("740x320: the order's pop-up card", "cook-corn", "740x320", "s20-corn-upright-base", "order-card-big", "s20-corn-upright-final", "order-card-big"),
    ("740x320: the item card in the side panel", "cook-corn", "740x320", "s20-corn-upright-base", "order-card-in-sidebar", "s20-corn-upright-final", "order-card-in-sidebar"),
]

try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
except OSError:
    font = ImageFont.load_default()

tiles = []
for label, page, size, brun, bname, arun, aname in ROWS:
    kp = page if not bname.startswith("key-") else page
    b = frame(brun, kp, size, bname)
    a = frame(arun, kp, size, aname)
    tiles.append((label, b, a))
    print(label, "|", b, "|", a)

ims = [(l, Image.open(b).convert("RGB") if b else None, Image.open(a).convert("RGB") if a else None) for l, b, a in tiles]
W = max(((x.width if x else 400) + (y.width if y else 400) + 30) for _, x, y in ims)
H = sum(max((x.height if x else 60), (y.height if y else 60)) + 40 for _, x, y in ims) + 40
sheet = Image.new("RGB", (W, H), "white")
g = ImageDraw.Draw(sheet)
g.text((10, 10), "s20-corn-upright: BEFORE (working branch, left) | AFTER (s20-corn-upright, right)", fill="black", font=font)
y = 40
for label, b, a in ims:
    g.text((10, y), label, fill="black", font=font)
    y += 28
    x = 10
    for im in (b, a):
        if im:
            sheet.paste(im, (x, y))
            x += im.width + 10
        else:
            g.text((x, y + 10), "(no frame)", fill="red", font=font)
            x += 400
    y += max((b.height if b else 60), (a.height if a else 60)) + 12
sheet.save(OUT)
print("wrote", OUT, sheet.size)
