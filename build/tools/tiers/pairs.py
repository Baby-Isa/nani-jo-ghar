"""Before | after pictures for check-change (tier 2): the same page's shots from the base commit's run (left) and the candidate's
(right), paired by file name, half size, JPEG; an index.html to look through. Made by script from the two sandbox runs, never
a builder's own shots (Zafar, 9 Nov).

python3 build/tools/tiers/pairs.py BEFORE_RUN AFTER_RUN OUT_DIR [--scale 0.5]
"""
import json
import os
import sys
from PIL import Image, ImageDraw

BG, INK = (250, 247, 240), (40, 30, 20)


def pages(run):
    out = {}
    for flow in sorted(os.listdir(run)):
        fd = os.path.join(run, flow)
        if not os.path.isdir(fd) or flow in ("data", "sheets", "films", "evidence", "keyframes"):
            continue
        for size in sorted(os.listdir(fd)):
            sd = os.path.join(fd, size)
            if os.path.isdir(sd):
                out[f"{flow}/{size}"] = sorted(f for f in os.listdir(sd) if f.endswith(".png"))
    return out


def main():
    a = sys.argv[1:]
    scale = float(a[a.index("--scale") + 1]) if "--scale" in a else 0.5
    before, after, out = a[0], a[1], a[2]
    os.makedirs(out, exist_ok=True)
    pb, pa = pages(before), pages(after)
    rows, made, missing = [], 0, []
    for key in sorted(pa):
        if key not in pb:
            missing.append(f"{key}: no before (a new flow or size)")
            continue
        for name in pa[key]:
            if name not in pb[key]:
                missing.append(f"{key}/{name}: no before shot")
                continue
            l, r = Image.open(os.path.join(before, key, name)).convert("RGB"), Image.open(os.path.join(after, key, name)).convert("RGB")
            w, h = int(max(l.width, r.width) * scale), int(max(l.height, r.height) * scale)
            im = Image.new("RGB", (w * 2 + 12, h + 22), BG)
            im.paste(l.resize((int(l.width * scale), int(l.height * scale))), (0, 22))
            im.paste(r.resize((int(r.width * scale), int(r.height * scale))), (w + 12, 22))
            d = ImageDraw.Draw(im)
            d.text((4, 4), f"BEFORE  {key}/{name}", fill=INK)
            d.text((w + 16, 4), "AFTER", fill=INK)
            fn = f"{key.replace('/', '__')}__{name[:-4]}.jpg"
            im.save(os.path.join(out, fn), quality=82)
            rows.append(fn)
            made += 1
    html = ["<!doctype html><meta charset=utf-8><title>Before and after</title><style>body{font:14px sans-serif;background:#faf7f0;margin:16px}img{display:block;max-width:100%;margin:4px 0 18px}</style>",
            f"<h1>Before | after ({made} pairs)</h1><p>{before} | {after}</p>"]
    html += [f"<div>{fn}</div><img src='{fn}' loading=lazy>" for fn in rows]
    if missing:
        html.append("<h2>Not paired</h2><ul>" + "".join(f"<li>{m}</li>" for m in missing) + "</ul>")
    open(os.path.join(out, "index.html"), "w").write("\n".join(html))
    json.dump({"pairs": rows, "missing": missing}, open(os.path.join(out, "pairs.json"), "w"), indent=1)
    print(f"pairs: {made} before|after pictures, {len(missing)} not paired; {os.path.join(out, 'index.html')}")


if __name__ == "__main__":
    main()
