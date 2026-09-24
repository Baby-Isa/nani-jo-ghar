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
import unicodedata
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
    "dine": "દિને", "bataato": "બટાટો", "vatana": "વટાણા", "aadu": "આદુ", "limu": "લીમુ", "lal": "લાલ",
    # drafts from Zafar, 24 Sept 2026 (not confirmed): dai (yoghurt), channa
    # (chickpeas), ghos (meat), bajr jo maani (millet chapati), ne poi (and then)
    "dai": "દઈ", "channa": "ચન્ના", "ghos": "ઘોસ", "bajr": "બાજર", "jo": "જો", "poi": "પોઈ",
}


def norm(s):
    # letters, marks and digits of any script; must match Cook.norm in js/cook/core.js
    s = unicodedata.normalize("NFC", s.lower())
    s = "".join(c for c in s if c == " " or unicodedata.category(c)[0] in "LMN")
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
    """Every Kutchi chunk the game can say (whole lines where the whole
    line is Kutchi, single tokens for mixed lines), and every English
    placeholder chunk. Returns (kutchi, english) sets."""
    data = json.load(open(os.path.join(GAME, "data", "cook.json")))
    W = data["words"]
    L = data["lines"]
    # linkers ("ne poi") are said inside frames, never ordered on their own
    kw = [w["kutchi"] for w in W.values() if w.get("kutchi") and not w.get("linker")]
    ew = [w["english"] for w in W.values() if not w.get("kutchi")]
    nums = [W[f"num-0{n}"]["kutchi"] for n in range(1, 6)]
    k, e = set(), set()
    for t in kw:
        k.add(t)
        for tok in norm(t).split(" "):
            k.add(tok)
    phrases = list(kw)
    for n in range(1, 6):
        phrases.append(f"{nums[n - 1]} {W['cook-khun']['kutchi']}")
        phrases.append(f"{nums[n - 1]} {W['cook-maani']['kutchi']}")
    for key, f in L.items():
        if f.get("k"):
            for tok in norm(f["k"].replace("{x}", " ")).split(" "):
                if tok:
                    k.add(tok)
            if "{x}" not in f["k"]:
                k.add(f["k"])
            else:
                for p in phrases:
                    k.add(f["k"].replace("{x}", p))
        else:
            for part in f["e"].split("{x}"):
                if norm(part):
                    e.add(part.strip())
    for t in ew:
        e.add(t)
    return sorted(k), sorted(e)


def speak(text, lang, path, ffmpeg, tempo):
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        if lang == "gu":
            gTTS(text, lang="gu", slow=True).save(tmp.name)
        else:
            gTTS(text, lang="en", tld="co.uk", slow=False).save(tmp.name)
        subprocess.run(
            [ffmpeg, "-y", "-loglevel", "error", "-i", tmp.name, "-filter:a", f"atempo={tempo}", "-ac", "1", "-b:a", "48k", path],
            check=True,
        )
        os.unlink(tmp.name)


def main():
    os.makedirs(OUT, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    manifest = {}
    kutchi, english = lines()
    for i, plain in enumerate(kutchi):
        key = norm(plain)
        slug = key.replace(" ", "-")
        path = os.path.join(OUT, f"{slug}.mp3")
        manifest[key] = f"assets/audio/cook-tts/{slug}.mp3"
        if not os.path.exists(path):
            gu = to_gujarati(plain)
            speak(gu, "gu", path, ffmpeg, ATEMPO)
            print(f"k {i + 1}/{len(kutchi)} {plain} -> {gu}")
    # English placeholders (words the family hasn't given yet): a UK English
    # voice at a gentle pace, clearly different from the Kutchi voice
    for i, plain in enumerate(english):
        key = "en|" + norm(plain)
        slug = "en-" + norm(plain).replace(" ", "-")
        path = os.path.join(OUT, f"{slug}.mp3")
        manifest[key] = f"assets/audio/cook-tts/{slug}.mp3"
        if not os.path.exists(path):
            speak(plain, "en", path, ffmpeg, 0.85)
            print(f"e {i + 1}/{len(english)} {plain}")
    json.dump({"_about": "Placeholder voices for Cook with Nani, built by build/build_cook_tts.py. Keys: normalised romanised Kutchi; 'en|' + normalised English for placeholders.", "lines": manifest}, open(MANIFEST, "w"), indent=1, ensure_ascii=False)
    print(f"{len(manifest)} entries in {MANIFEST}")


if __name__ == "__main__":
    main()
