#!/usr/bin/env python3
"""Paid image edits for the hands v3 master fixes (26 Sept 2026), with a
hard spending cap and a running log.

Lesson from v1/v2: the magenta placeholder was a poor key colour. Its
shadows are crimson and its bounce light orange-pink, the same hues as skin
shadows, lips of creases and nails, so every key-out chewed the finger
edges it touched (the stair-stepped, torn tool gaps of b2-e, b3, b5, d1-f2,
d2-t, d4-f1...). v3 draws the tool as a real object in a saturated cobalt
blue: nothing in the skin is blue, so the tool comes off cleanly as its own
layer (hand_v3_keys.key_blue) and leaves a clean gap for the game's tool
sprite.

    python3 build/hand_v3_gen.py --estimate JOB [JOB...]   # pre-flight only
    python3 build/hand_v3_gen.py JOB [JOB...]              # run (asks nothing; stops at the cap)

Every image is written to build/hand-v3-raw/<job>-v<k>.png (nothing is
overwritten: k counts up), and the spend to build/reports/data/hands-v3-spend.json.
"""
import argparse
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_assets as ga  # noqa: E402

GAME = ga.GAME
RAW = os.path.join(GAME, "build", "hand-v3-raw")
GUIDES = os.path.join(GAME, "build", "hand-v3-guides")
LOG = os.path.join(GAME, "build", "reports", "data", "hands-v3-spend.json")
CAP = 8.00
PRICE = {"medium": 0.042, "low": 0.011}  # 1024x1024 output (asset-list config)
INPUT_EST = 0.008  # input image + text tokens per edit, from the v2 manifest usage

STYLE = ("Stylised 3D animated-feature-film look: soft global illumination, gentle warm fill, clean simplified "
         "surfaces with restrained detail, no outlines. Warm late-morning light from the upper left; soft shadows "
         "falling to the lower right.")
KEEP = ("Keep the hand exactly as in the attached image: the same child's hand, the same warm light tan skin "
        "colour, size, lighting, fingernails and white linen sleeve. Transparent background.")

JOBS = {
    "b1": dict(guide="b1-blue-guide.png", n=4, prompt=(
        f"{STYLE}\n\nEdit the attached image. Seen from directly above, a child's right hand grips a kitchen knife "
        "handle, shown as the plain, smooth, matte, bright cobalt-blue (pure saturated blue) rounded plastic rod in "
        "the image, running across the frame through the fist. The four fingers curl round the rod, their knuckles "
        "in a row on top, as in the image. The thumb comes round the left side of the fist and lies flat and "
        "straight ALONG THE TOP of the blue rod, pointing left along it, its nail seen from above, touching the rod "
        "along its whole length. The blue rod shows clearly on both sides of the fist. No blade, no other object. "
        f"{KEEP}")),
    "a5f2": dict(guide="a5f2-guide.png", mask="a5f2-mask.png", n=3, prompt=(
        f"{STYLE}\n\nEdit the attached image of a child's right hand waving, back of the hand towards us. It shows "
        "only three fingers and a thumb: add the missing LITTLE FINGER on the right side of the hand, next to the "
        "ring finger, a little shorter than it, spread slightly like the others, with a soft hint of a fingernail, "
        f"so the hand has a thumb and four fingers. Change nothing else. {KEEP}")),
}


def spend():
    if not os.path.exists(LOG):
        return {"total_estimate": 0.0, "runs": []}
    return json.load(open(LOG))


def save_spend(s):
    os.makedirs(os.path.dirname(LOG), exist_ok=True)
    json.dump(s, open(LOG, "w"), indent=1)


def estimate(jobs, quality):
    n = sum(JOBS[j]["n"] for j in jobs)
    return n, n * (PRICE[quality] + INPUT_EST)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("jobs", nargs="+")
    p.add_argument("--estimate", action="store_true")
    p.add_argument("--quality", default="medium")
    p.add_argument("--n", type=int, help="override the variant count")
    args = p.parse_args()
    if args.n:
        for j in args.jobs:
            JOBS[j]["n"] = args.n
    n, est = estimate(args.jobs, args.quality)
    s = spend()
    print(f"pre-flight: {n} images at {args.quality} = ${est:.2f}; spent so far ${s['total_estimate']:.2f}; cap ${CAP:.2f}")
    if args.estimate:
        return
    if s["total_estimate"] + est > CAP:
        sys.exit("over the cap: not run")
    key = os.environ["OPENAI_API_KEY"]
    cfg = dict(ga.load_config(ga.load_asset_list(ga.DEFAULT_ASSET_LIST)))
    os.makedirs(RAW, exist_ok=True)
    for j in args.jobs:
        job = JOBS[j]
        for _ in range(job["n"]):
            k = 0
            while os.path.exists(os.path.join(RAW, f"{j}-v{k}.png")):
                k += 1
            t0 = time.time()
            im, usage = ga.api_edit(job["prompt"], "1024x1024", args.quality, True, cfg, key,
                                    [os.path.join(GUIDES, job["guide"])],
                                    mask_path=os.path.join(GUIDES, job["mask"]) if job.get("mask") else None)
            out = os.path.join(RAW, f"{j}-v{k}.png")
            im.save(out)
            cost = PRICE[args.quality] + INPUT_EST
            s["total_estimate"] = round(s["total_estimate"] + cost, 4)
            s["runs"].append({"job": j, "file": os.path.relpath(out, GAME), "quality": args.quality,
                              "cost_estimate": cost, "usage": usage, "secs": round(time.time() - t0, 1)})
            save_spend(s)
            print(f"{out}  (${s['total_estimate']:.2f} so far)", flush=True)


if __name__ == "__main__":
    main()
