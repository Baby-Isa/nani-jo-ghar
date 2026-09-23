#!/usr/bin/env python3
"""Pre-bake placeholder audio as static MP3 files, replacing the live
Web Speech fallback (silent on Android webviews - see Roadmap doc,
'Lessons from the first build'). Uses espeak-ng with a Hindi or Gujarati
voice reading the romanised Kutchi draft: a clearly-temporary
mispronunciation guide, per the Technical Plan's audio pipeline, not a
Kutchi voice (none exists, for any vendor - project rule 6).

Only generates audio for content actually used by the fruit-bowl errand,
not the whole content master, since assets follow the word list and this
is the one errand in scope this pass.

Files land at assets/audio/<kind>/<id>.mp3, the exact path audio.js
already checks for a "real recording" before falling back - so dropping
in a genuine family recording later is a file replacement, no code change.
"""
import json
import subprocess
import os

GAME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(GAME, "assets", "audio")

content = json.load(open(os.path.join(GAME, "data", "content.json")))
errands = json.load(open(os.path.join(GAME, "data", "errands.json")))

words_by_id = {w["id"]: w for w in content["words"]}
sentences_by_id = {s["id"]: s for s in content["sentences"]}
carriers = content["carriers"]

VOICE_BY_SOURCE_HINT = "hi"  # Hindi voice by default, matches audio.js's own preference order


def speak_to_mp3(text, out_path):
    if not text:
        return False
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    wav_path = out_path + ".tmp.wav"
    subprocess.run(
        ["espeak-ng", "-v", VOICE_BY_SOURCE_HINT, "-s", "130", "-p", "40", text, "-w", wav_path],
        check=True, capture_output=True,
    )
    subprocess.run(
        ["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-b:a", "64k", out_path],
        check=True, capture_output=True,
    )
    os.remove(wav_path)
    return True


made = []

errand = errands["errands"][0]  # bowl-01, the one errand in scope

# 1. word-level ids needed: the errand's buy items, the pre-exposure words,
#    the stall decoys (heard implicitly if tapped by mistake we still want
#    correct-item audio available), and the numbers used for quantities.
word_ids = set()
for it in errand["items"]:
    word_ids.add(it["word_id"])
word_ids.update(errand.get("pre_exposure", []))
word_ids.update(errand["stall_back_row"])
word_ids.update(errand["stall_front_row"])

numbers_needed = set()
for it in errand["items"]:
    if not it.get("no_count"):
        # every tap 1..qty plays its own number word, not just the final count
        for n in range(1, it["qty"] + 1):
            numbers_needed.add(n)
for n in numbers_needed:
    word_ids.add(f"num-{n:02d}")

for wid in sorted(word_ids):
    w = words_by_id.get(wid)
    if not w or not w.get("kutchi"):
        continue
    out_path = os.path.join(OUT, "word", f"{wid}.mp3")
    if speak_to_mp3(w["kutchi"]["text"], out_path):
        made.append(out_path)

# 2. carrier (whole-sentence) lines for the buy items - both singular and
#    plural forms get generated as separate ids so app.js can pick the
#    right one without re-synthesising at runtime.
for wid in word_ids:
    c = carriers.get(wid)
    if not c:
        continue
    if c.get("kutchi_singular"):
        speak_to_mp3(c["kutchi_singular"], os.path.join(OUT, "carrier", f"{wid}.mp3"))
        made.append(wid)
    if c.get("kutchi_plural_example"):
        speak_to_mp3(c["kutchi_plural_example"], os.path.join(OUT, "carrier", f"{wid}-plural.mp3"))
        made.append(wid + "-plural")

# 3. fixed sentence lines used in the kitchen/bazaar script (snt-01, 02, 03,
#    06, 10, 11, 14 have sourced Kutchi; snt-08, 09, 13 don't and stay
#    English-only text with no audio file - never invented).
for sid in ["snt-01", "snt-02", "snt-03", "snt-06", "snt-10", "snt-11", "snt-14"]:
    s = sentences_by_id.get(sid)
    if s and s.get("kutchi"):
        speak_to_mp3(s["kutchi"]["text"], os.path.join(OUT, "word", f"{sid}.mp3"))
        made.append(sid)

print(f"Generated {len(made)} audio files under {OUT}")
