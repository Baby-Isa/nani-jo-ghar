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
    is enumerated here, keyed by its normalised romanised text (the display
    spelling shown on screen, data.words[id].kutchi)
  - the romanised Kutchi is written in Gujarati script word by word (the
    TTS voice can't read romanised text), then spoken with gTTS slow=True
    and slowed again with ffmpeg's atempo (pitch kept). A word can carry a
    separate 'say' field (Zafar's own phonetic spelling, e.g. ph-no: kutchi
    "nar", say "narr"): the voice is built from 'say' where present (see
    say_map/SAY), even though the manifest key and the on-screen text stay
    the display spelling.
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
    # drafts from Zafar, 25 Sept 2026 (not confirmed, WRITTEN PHONETICALLY over
    # chat): keyed by the normalised form of the word's own "say" spelling
    # (Zafar's phonetic one, not the romanised "kutchi" spelling shown on
    # screen), because that's what the voice reads. no/not, slowly, quickly,
    # half, full, big, small. Best-guess readings only; Mum to confirm both
    # the spelling and the pronunciation.
    "narr": "ના", "arsetehtea": "આસ્તેથી", "jaldee": "જલ્દી", "udd": "અડધું",
    "barrelor": "ભરેલો", "wuddoar": "વડો", "nindhoar": "નીંઢો",
    # the family's words, 25 Sept 2026 (docs/kutchi-grammar-notes.md): daar, ba (said "ber"),
    # hakro/hakri, wadhi/nindhi (she-forms, drafts), watana, Muke {x} de, pela, waari, me, lai;
    # Nana, Ma and Ali for the cup cards. Best-guess Gujarati script, only so the voice can read them
    "daar": "દાર", "ber": "બેર", "hakro": "હકરો", "hakri": "હકરી", "wuddee": "વડી", "nindhee": "નીંઢી",
    "watana": "વટાણા", "de": "દે", "pela": "પેલા", "waari": "વારી", "me": "મેં", "lai": "લઈ",
    "nana": "નાના", "ma": "મા", "ali": "અલી",
}


def norm(s):
    # letters, marks and digits of any script; must match Cook.norm in js/cook/core.js
    s = unicodedata.normalize("NFC", s.lower())
    s = "".join(c for c in s if c == " " or unicodedata.category(c)[0] in "LMN")
    return re.sub(r"\s+", " ", s).strip()


def say_map(words):
    """romanised display token (word.kutchi) -> Zafar's phonetic token
    (word.say), for words that have a 'say' field distinct from their
    display spelling (e.g. ph-no: kutchi 'nar', say 'narr'). The voice
    reads the 'say' spelling; the screen shows 'kutchi'. Only words whose
    kutchi and say have the same number of tokens are mapped token by
    token; a single multi-word phrase maps as a whole otherwise."""
    m = {}
    for w in words.values():
        # a gendered form's own voice spelling (hakri, wadhi: say_forms)
        for g, form in (w.get("forms") or {}).items():
            if w.get("kutchi") and (w.get("say_forms") or {}).get(g):
                m[norm(form)] = norm(w["say_forms"][g])
        if not w.get("kutchi") or not w.get("say"):
            continue
        kt, st = norm(w["kutchi"]).split(" "), norm(w["say"]).split(" ")
        if len(kt) == len(st):
            m.update(zip(kt, st))
        else:
            m[norm(w["kutchi"])] = norm(w["say"])
    return m


SAY = {}  # set in main(), from data/cook.json's words


def to_gujarati(plain):
    out = []
    for tok in norm(plain).split(" "):
        say_tok = SAY.get(tok, tok)
        if say_tok not in GU:
            hint = f" (the 'say' spelling of '{tok}')" if say_tok != tok else ""
            sys.exit(f"no Gujarati spelling for '{say_tok}'{hint} (in '{plain}'): add it to GU")
        out.append(GU[say_tok])
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
    # gendered forms ("hakri", "wadhi") are said too
    kw += [f for w in W.values() if w.get("kutchi") for f in (w.get("forms") or {}).values() if f != w["kutchi"]]
    ew = [w["english"] for w in W.values() if not w.get("kutchi")]
    nums = [W[f"num-0{n}"]["kutchi"] for n in range(1, 6)]
    k, e = set(), set()
    for t in kw:
        k.add(t)
        for tok in norm(t).split(" "):
            k.add(tok)
    phrases = list(kw)
    she_one = (W["num-01"].get("forms") or {}).get("she", nums[0])
    for n in range(1, 6):
        phrases.append(f"{nums[n - 1]} {W['cook-khun']['kutchi']}")
        # maani is a she-word: "hakri maani" (the family, 25 Sept)
        phrases.append(f"{she_one if n == 1 else nums[n - 1]} {W['cook-maani']['kutchi']}")
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
    global SAY
    os.makedirs(OUT, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    manifest = {}
    data = json.load(open(os.path.join(GAME, "data", "cook.json")))
    SAY = say_map(data["words"])
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
