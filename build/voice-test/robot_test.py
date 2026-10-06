#!/usr/bin/env python3
"""Robot vs Mum voice test (Sprint 2, decision 63). Test only: nothing here ships.

For each item in build/voice-test/items.json it writes, into build/voice-test/<round>/:
  <id>-mum.mp3        Mum's clip as recorded
  <id>-mum-clean.mp3  the same, cleaned (hum cut, de-noise, level, silence trimmed)
  <id>-openai-gu.mp3 / -openai-lat.mp3   OpenAI voice from the Gujarati / the Latin respelling
  <id>-gemini-gu.mp3 / -gemini-lat.mp3   Gemini voice, the same two
Usage: python3 build/voice-test/robot_test.py r1 [--only id,id] [--no-robot]
Needs OPENAI_API_KEY, GEMINI_API_KEY and ffmpeg. Cost: well under $1 a round.
"""
import base64, json, os, subprocess, sys, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
MUM = os.path.join(HERE, "..", "..", "assets", "audio", "family", "mum")
STYLE = ("You are a warm Kutchi-speaking grandmother from East Africa talking to a small grandchild. "
         "Speak the words exactly as written, with a Gujarati/Kutchi accent, clearly and naturally, not slowly.")
CLEAN = ("highpass=f=90,lowpass=f=9000,afftdn=nf=-28:tn=1,"
         "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
         "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,"
         "loudnorm=I=-16:TP=-1.5:LRA=7")


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def post(url, body, headers):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", **headers})
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read()


def speed_filter(speed):
    return [] if abs(speed - 1) < 0.01 else ["-af", f"atempo={speed}"]


def openai(text, out, speed):
    raw = out + ".raw.mp3"
    open(raw, "wb").write(post("https://api.openai.com/v1/audio/speech",
        {"model": "gpt-4o-mini-tts", "voice": "sage", "input": text, "instructions": STYLE, "response_format": "mp3"},
        {"Authorization": "Bearer " + os.environ["OPENAI_API_KEY"]}))
    ff("-i", raw, *speed_filter(speed), "-b:a", "96k", out); os.remove(raw)


def gemini(text, out, speed):
    body = {"contents": [{"parts": [{"text": STYLE + " Say: " + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Sulafat"}}}}}
    url = ("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key="
           + os.environ["GEMINI_API_KEY"])
    data = json.loads(post(url, body, {}))
    pcm = base64.b64decode(data["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    raw = out + ".pcm"; open(raw, "wb").write(pcm)
    ff("-f", "s16le", "-ar", "24000", "-ac", "1", "-i", raw, *speed_filter(speed), "-b:a", "96k", out); os.remove(raw)


def main():
    rnd = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else "r1"
    only = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--only=")), None)
    spec = json.load(open(os.path.join(HERE, "items.json")))
    od = os.path.join(HERE, rnd); os.makedirs(od, exist_ok=True)
    for it in spec["items"]:
        if only and it["id"] not in only: continue
        sp = it.get("speed", spec.get("speed", 1.0)); p = lambda k: os.path.join(od, f"{it['id']}-{k}.mp3")
        src = os.path.join(MUM, it["mum"])
        if "--robot-only" not in sys.argv:
            ff("-i", src, "-b:a", "96k", p("mum"))
            ff("-i", src, "-af", CLEAN, "-ar", "44100", "-b:a", "128k", p("mum-clean"))
        if "--no-robot" in sys.argv: continue
        engines = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--engines=")), ["openai", "gemini"])
        for name, fn in (("openai", openai), ("gemini", gemini)):
            if name not in engines: continue
            for key, tag in (("gu", "gu"), ("latin", "lat")):
                for attempt in range(4):
                    try:
                        fn(it[key], p(f"{name}-{tag}"), sp); break
                    except Exception as e:
                        print(f"{it['id']} {name}-{tag}: {e}"); time.sleep(25 * (attempt + 1))
                if name == "gemini": time.sleep(8)
        print("done", it["id"])
    json.dump(spec, open(os.path.join(od, "items.json"), "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
