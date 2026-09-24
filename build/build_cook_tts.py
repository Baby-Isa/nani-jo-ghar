#!/usr/bin/env python3
"""Placeholder voice for Cook with Nani: a Gujarati text-to-speech voice
(Google, via gTTS) reading every line the prototype can say, slowed to
about half speed. Zafar asked for this on 24 Sept 2026 ("use Gujarati audio
and play it half speed or slower, it was crazy fast in the previous test
builds").

This is a PLACEHOLDER, clearly worse than a person: a Gujarati voice
reading Kutchi, so some sounds will be wrong. Family recordings replace it
file for file: put a recording at assets/audio/cook/<slug>.mp3 with the same
name and it wins (see data/cook-tts.json for the slug of each line).

How it works:
  - every line the game can build (from data/cook.json's words and frames)
    is enumerated here, keyed by its normalised romanised text
  - the romanised Kutchi is written in Gujarati script word by word (the
    TTS voice can't read romanised text), then spoken with gTTS slow=True
    and slowed again with ffmpeg's atempo (pitch kept)
  - data/cook-tts.json maps each line's key to its file

Run: python3 build/build_cook_tts.py   (needs network, gTTS, imageio-ffmpeg)
"""
import json
import os
import re
import subprocess
import sys
import tempfile

from gtts import gTTS
import imageio_ffmpeg

GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(GAME, "assets", "audio", "cook-tts")
MANIFEST = os.path.join(GAME, "data", "cook-tts.json")
ATEMPO = 0.75  # on top of gTTS's own slow mode: roughly half normal speed

# romanised Kutchi -> Gujarati script, only so the voice can read it
GU = {
    "salamun": "સલામુન", "alaykum": "અલૈકુમ", "wa": "વ", "alaikum": "અલૈકુમ", "salaam": "સલામ",
    "muke": "મુકે", "khape": "ખપે", "ne": "ને", "aabhar": "આભાર", "aanjo": "આંજો",
    "achija": "અચીજા", "arre": "અરે", "re": "રે", "hedo": "હેડો", "ghan": "ઘન",
    "paani": "પાની", "chai": "ચાઈ", "dudh": "દૂધ", "khun": "ખુન", "atto": "અટ્ટો",
    "daal": "દાલ", "maani": "માની", "dungri": "ડુંગરી", "tameto": "ટમેટો", "marcha": "મરચા",
    "lasan": "લસન", "hardar": "હરદર", "jeeru": "જીરુ", "rai": "રાઈ", "elchi": "એલચી",
    "loon": "લૂન", "hikdo": "હિકડો", "bo": "બો", "trae": "ત્રે", "char": "ચાર", "panj": "પંજ",
}


def norm(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9 ]", "", s)
    return re.sub(r"\s+", " ", s).strip()


def to_gujarati(plain):
    out = []
    for tok in norm(plain).split(" "):
        if tok not in GU:
            sys.exit(f"no Gujarati spelling for '{tok}' (in '{plain}'): add it to GU")
        out.append(GU[tok])
    text = " ".join(out)
    return text + ("!" if plain.strip().endswith("!") else "।")


def lines():
    data = json.load(open(os.path.join(GAME, "data", "cook.json")))
    words = [w["kutchi"] for w in data["words"].values()]
    nums = [data["words"][f"num-0{n}"]["kutchi"] for n in range(1, 6)]
    L = data["lines"]
    out = set()
    for key, line in L.items():
        if "{x}" not in line["kutchi"]:
            out.add(line["kutchi"])
    phrases = list(words)
    for n in range(1, 6):
        phrases.append(f"{nums[n - 1]} {data['words']['cook-khun']['kutchi']}")
        phrases.append(f"{nums[n - 1]} {data['words']['cook-maani']['kutchi']}")
    for p in phrases:
        out.add(p)
        out.add(L["need"]["kutchi"].replace("{x}", p))
        out.add(L["and"]["kutchi"].replace("{x}", p))
    return sorted(out)


def main():
    os.makedirs(OUT, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    manifest = {}
    todo = lines()
    for i, plain in enumerate(todo):
        key = norm(plain)
        slug = key.replace(" ", "-")
        path = os.path.join(OUT, f"{slug}.mp3")
        manifest[key] = f"assets/audio/cook-tts/{slug}.mp3"
        if os.path.exists(path):
            continue
        gu = to_gujarati(plain)
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            gTTS(gu, lang="gu", slow=True).save(tmp.name)
            subprocess.run(
                [ffmpeg, "-y", "-loglevel", "error", "-i", tmp.name, "-filter:a", f"atempo={ATEMPO}", "-ac", "1", "-b:a", "48k", path],
                check=True,
            )
            os.unlink(tmp.name)
        print(f"{i + 1}/{len(todo)} {plain} -> {gu}")
    json.dump({"_about": "Placeholder Gujarati TTS for Cook with Nani, built by build/build_cook_tts.py. Keys are normalised romanised lines.", "lines": manifest}, open(MANIFEST, "w"), indent=1, ensure_ascii=False)
    print(f"{len(manifest)} lines in {MANIFEST}")


if __name__ == "__main__":
    main()
