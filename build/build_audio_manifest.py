#!/usr/bin/env python3
"""Scans assets/audio/<kind>/*.mp3 and writes data/audio-manifest.json, so
the game never has to probe for a file's existence at runtime (a HEAD
request for a missing file logs a console error in the browser even when
the JS catches it - see Build Brief v3 section 6.2, "no console errors").
Re-run this whenever an audio file is added or removed."""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "assets", "audio")
OUT_PATH = os.path.join(ROOT, "data", "audio-manifest.json")


def main():
    manifest = {}
    for kind in sorted(os.listdir(AUDIO_DIR)):
        kind_dir = os.path.join(AUDIO_DIR, kind)
        if not os.path.isdir(kind_dir):
            continue
        ids = sorted(f[:-4] for f in os.listdir(kind_dir) if f.endswith(".mp3"))
        manifest[kind] = ids
    with open(OUT_PATH, "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")
    print(f"wrote {OUT_PATH}: " + ", ".join(f"{k}={len(v)}" for k, v in manifest.items()))


if __name__ == "__main__":
    main()
