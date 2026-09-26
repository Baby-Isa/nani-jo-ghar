#!/usr/bin/env python3
"""Adds the clinic's final (ChatGPT batch 3) art to data/clinic/rough-art.json
without touching a single rough entry, so the clinic can switch over through
the manifest whenever it's wired.

  - writes a WebP (quality 90) beside each PNG in assets/clinic/rooms/ and
    assets/clinic/patients/ (the manifest points at WebPs, as the rough art does);
  - adds one `sprites` entry per final picture (group final-rooms,
    final-patients or final-feelings; `final: true`);
  - writes a top-level `final` block: rooms, patients (seated poses and the
    colour variants) and feelings (the family's head-and-shoulders layers,
    from assets/characters/<who>/), plus `replaces` (rough id -> final id)
    for the pictures that are a straight swap.

The existing `rooms`, `patients` and `alias` blocks are left as they are, so
Kit.room / Kit.person keep returning the rough art until the code opts in.
Re-run after build/slice_chatgpt_batch3_dump3.sh (which calls it), and after
sources/art/clinic-rough/slice_sheets.py, which rewrites the manifest from
scratch and so drops the `final` block.
"""
import glob
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "data", "clinic", "rough-art.json")

ROOMS = {"waiting": "bg-clinic-waiting-e", "exam": "bg-clinic-room-e", "pharmacy": "bg-clinic-pharmacy-e"}
POSES = ["sit", "sit-head", "sit-tummy", "sit-knee"]
FEELINGS = ["happy", "sad", "scared", "poorly", "tired", "better", "ouch", "sneeze", "hot", "cold", "notme", "caught"]
COLOURS = {"old-man": ("clinic-oldman-waist", ["blue", "green", "yellow", "red"]),
           "old-woman": ("clinic-oldwoman-waist", ["blue", "green", "yellow", "purple"])}


def webp(png):
    dst = png[:-4] + ".webp"
    im = Image.open(png)
    im.save(dst, "WEBP", quality=90, method=6, exact=False)
    return dst, im.size


def rel(p):
    return os.path.relpath(p, ROOT).replace(os.sep, "/")


def main():
    with open(MANIFEST) as f:
        man = json.load(f)
    sprites = man["sprites"]
    added = {}

    def add(sid, path, group, sheet, make_webp=True):
        assert sid not in sprites or sprites[sid].get("final"), f"{sid} would overwrite a rough entry"
        if make_webp:
            path, (w, h) = webp(path)
        else:
            w, h = Image.open(path).size
        added[sid] = {"file": rel(path), "w": w, "h": h, "group": group, "sheet": sheet, "final": True}
        return sid

    final = {
        "_about": ("Final art (ChatGPT batch 3, dump 3: build/reports/chatgpt-batch-3-dump-3.md), added beside the "
                   "rough placeholders, which stay as they are. Not wired: `rooms`, `patients` and `alias` above still "
                   "name the rough art. rooms: as `rooms`. patients: kind -> pose -> sprite id (seated full body on an "
                   "invisible seat: sit, sit-head, sit-tummy, sit-knee, for after the answer only; waist-<colour>: the "
                   "waiting room's waist-up crop in one colour). feelings: kind -> feeling -> a head-and-shoulders "
                   "layer. replaces: rough sprite id -> the final sprite that can stand in for it."),
        "rooms": {}, "patients": {}, "feelings": {}, "replaces": {},
    }
    for name, stem in ROOMS.items():
        png = os.path.join(ROOT, "assets", "clinic", "rooms", stem + "-v1.png")
        final["rooms"][name] = add(stem, png, "final-rooms", stem + "-v1")
        final["replaces"]["room-" + name] = stem
    for who in ["nana", "ma", "ali"]:
        final["patients"][who] = {}
        for pose in POSES:
            sid = f"{who}-{pose}"
            png = os.path.join(ROOT, "assets", "clinic", "patients", who, sid + ".png")
            final["patients"][who][pose] = add(sid, png, "final-patients", f"char-{who}-hurts-v1")
        final["replaces"][f"{who}-neutral"] = f"{who}-sit"
        final["feelings"][who] = {}
        for fe in FEELINGS:
            sid = f"{who}-feeling-{fe}"
            png = os.path.join(ROOT, "assets", "characters", who, sid + ".png")
            final["feelings"][who][fe] = add(sid, png, "final-feelings", f"char-{who}-feelings-v1", make_webp=False)
    for kind, (stem, cols) in COLOURS.items():
        final["patients"][kind] = {}
        for c in cols:
            sid = f"{stem}-{c}"
            png = os.path.join(ROOT, "assets", "clinic", "patients", kind, sid + ".png")
            final["patients"][kind][f"waist-{c}"] = add(sid, png, "final-patients", f"char-clinic-{kind.replace('-', '')}-colours-v1")

    sprites.update(added)
    man["final"] = final
    man["count"]["final"] = len(added)
    with open(MANIFEST, "w") as f:
        json.dump(man, f, indent=1)  # as sources/art/clinic-rough/slice_sheets.py writes it
    print(f"{len(added)} final sprites added to {rel(MANIFEST)}")


if __name__ == "__main__":
    main()
