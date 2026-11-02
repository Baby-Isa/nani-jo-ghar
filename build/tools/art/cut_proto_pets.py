"""proto-pets (2 Nov): cut the pet hotel's placeholder pictures (assets/pets-proto/) from Zafar's 1 Nov pet hotel mock-ups
(boxes in the mock-ups' own 1536x1024 pixels). The background is taken off by a flood from the crop's edge (every pixel near one of
the edge's colours and joined to the edge goes); the largest piece left is kept. Placeholders only, until the art run (decision 77).
   python3 build/tools/art/cut_proto_pets.py sources/art/mockups-2026-11-01 assets/pets-proto"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)

W = "Whimsical Woodland Pet Care Room.png"
C = "Cozy Pet Hotel Checkout Scene.png"
H = "Joyful Pet Hotel Welcome.png"

CROPS = [
    # name, file, box, tolerance (flood) or "ellipse" (a soft oval: where the flood can't tell the animal from the wall), max px
    ("rabbit", W, (262, 236, 560, 592), "ellipse", 360),
    ("bee", W, (652, 326, 972, 596), "ellipse", 320),
    ("ant", W, (1124, 412, 1296, 596), "ellipse", 260),
    ("cat", C, (820, 318, 1046, 676), "ellipse", 360),
    ("dog", H, (14, 322, 336, 782), "ellipse", 400),
    ("corn", W, (22, 636, 302, 806), 28, 320),
    ("bowl", W, (196, 760, 426, 896), 26, 280),
    ("tub", C, (340, 650, 572, 842), "ellipse", 340),
    ("jug", W, (726, 736, 900, 906), "ellipse", 260),
    ("brush", W, (872, 586, 1074, 696), "ellipse", 280),
    ("bed", W, (1098, 650, 1504, 904), 26, 400),
    ("mum", H, (500, 40, 816, 420), "ellipse", 360),
    ("girl", H, (1004, 292, 1296, 590), "ellipse", 340),
    ("basket", H, (848, 572, 1152, 762), "ellipse", 340),
]


def edge_colours(arr, k=10):
    h, w, _ = arr.shape
    e = np.concatenate([arr[0, :], arr[-1, :], arr[:, 0], arr[:, -1]]).astype(float)
    # a few rounds of k-means on the edge's pixels
    rng = np.random.default_rng(7)
    cent = e[rng.choice(len(e), k, replace=False)]
    for _ in range(12):
        d = ((e[:, None, :] - cent[None, :, :]) ** 2).sum(-1)
        lab = d.argmin(1)
        for i in range(k):
            if (lab == i).any():
                cent[i] = e[lab == i].mean(0)
    return cent


for name, f, box, tol, mx in CROPS:
    im = Image.open(os.path.join(SRC, f)).convert("RGBA")
    c = im.crop(box)
    if tol == "ellipse":
        w, h = c.size
        a = Image.new("L", (w, h), 0)
        ImageDraw.Draw(a).ellipse((4, 4, w - 5, h - 5), fill=255)
        c.putalpha(a.filter(ImageFilter.GaussianBlur(0.6)))
        c.thumbnail((mx, mx))
        c.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=82, method=6)
        print(name, c.size, "ellipse")
        continue
    arr = np.asarray(c)[:, :, :3].astype(float)
    cent = edge_colours(arr)
    d = np.sqrt(((arr[:, :, None, :] - cent[None, None, :, :]) ** 2).sum(-1)).min(-1)
    bgish = d < tol
    lab, n = ndimage.label(bgish)
    edge_labels = set(np.unique(np.concatenate([lab[0, :], lab[-1, :], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge_labels))
    m = ~bg
    m = ndimage.binary_opening(m, iterations=2)
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = lab == (1 + int(np.argmax(sizes)))
    m = ndimage.binary_fill_holes(m)
    a = Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.0))
    c.putalpha(a)
    bb = a.point(lambda v: 255 if v > 20 else 0).getbbox()
    if bb:
        c = c.crop(bb)
    c.thumbnail((mx, mx))
    p = os.path.join(OUT, name + ".webp")
    c.save(p, "WEBP", quality=82, method=6)
    print(name, c.size, os.path.getsize(p))

# Hannah Mami's face: the farm's (assets/farm/proto/hannah-face.webp) is used as it is; nothing cut here.
