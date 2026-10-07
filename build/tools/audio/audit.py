#!/usr/bin/env python3
"""Stage 4 of the verified re-clip (S02-D2, decision 69): a THIRD blind check on a random sample.

Picks N random kept candidates (fixed seed, so the orchestrator can rerun the same sample) and asks
gpt-audio-1.5 only to transcribe exactly what it hears and list every word and voice. It is NEVER
told the target, the language or the speaker. Its answer is then compared with the target
(blindmatch.check) and printed for a person to read; a clip fails if it holds anything but the
target said once by one voice.

Writes build/tools/audio/audit-<seed>.json and prints a table.
Usage: python3 build/tools/audio/audit.py [--n=30] [--seed=69]
"""
import base64, json, os, random, re, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
from blindmatch import check  # noqa: E402

ASK = ("Transcribe exactly what you hear in this audio clip, word for word, in whatever language it is, "
       "written in Latin letters as it sounds. List every word you hear, including any numbers, letters, "
       "filler words, laughter or other sounds, and say how many different voices speak. "
       'Answer in JSON only: {"words": "<every word in order>", "voices": <number>, "other_sounds": "<laughter, '
       'noises, or empty>"}')


def ask(path):
    wav = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "wav", "-"],
                         capture_output=True).stdout
    body = {"model": "gpt-audio-1.5", "modalities": ["text"], "messages": [{"role": "user", "content": [
        {"type": "text", "text": ASK},
        {"type": "input_audio", "input_audio": {"data": base64.b64encode(wav).decode(), "format": "wav"}}]}]}
    for attempt in range(5):
        try:
            req = urllib.request.Request("https://api.openai.com/v1/chat/completions", data=json.dumps(body).encode(),
                                         headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
                                                  "Content-Type": "application/json"})
            t = json.loads(urllib.request.urlopen(req, timeout=120).read())["choices"][0]["message"]["content"] or ""
            m = re.search(r"\{.*\}", t, re.S)
            return json.loads(m.group(0)) if m else {"words": t.strip(), "voices": None, "other_sounds": "",
                                                      "unparsed": True}
        except Exception as e:  # noqa: BLE001
            err = str(e)[:120]
            time.sleep(4 * (attempt + 1))
    return {"error": err}


def main():
    n = int(next((a.split("=")[1] for a in sys.argv if a.startswith("--n=")), 30))
    seed = int(next((a.split("=")[1] for a in sys.argv if a.startswith("--seed=")), 69))
    data = json.load(open(os.path.join(ROOT, "data", "family-audio-candidates.json")))
    pool = [(r, c) for r in data["lines"] for c in r["candidates"]]
    sample = random.Random(seed).sample(pool, min(n, len(pool)))
    with ThreadPoolExecutor(6) as ex:
        answers = list(ex.map(lambda rc: ask(os.path.join(ROOT, rc[1]["file"])), sample))
    rows, bad = [], 0
    for (r, c), a in zip(sample, answers):
        heard = str(a.get("words", "")) if "error" not in a else ""
        strength, reasons = check(heard, r["kutchi"])
        if a.get("voices") not in (None, 1, "1"):
            reasons.append(f"{a.get('voices')} voices")
        snd = str(a.get("other_sounds") or "").strip()
        if snd and not re.fullmatch(r"(none|no|n/?a|-|empty|nothing|silence|no other sounds?)\.?", snd, re.I):
            reasons.append(f"sounds: {snd}")
        if "error" in a:
            reasons.append("no answer")
        fail = bool(reasons) or strength < 0.5
        bad += fail
        rows.append({"key": r["key"], "rank": c["rank"], "file": c["file"], "target": r["kutchi"], "heard": heard,
                     "voices": a.get("voices"), "other_sounds": snd, "strength": strength, "reasons": reasons,
                     "flag": fail})
        print(f"{'FLAG' if fail else 'ok  '} {r['key']:30s} r{c['rank']} target='{r['kutchi']}' heard='{heard}' "
              f"voices={a.get('voices')} {'; '.join(reasons)}")
    json.dump({"seed": seed, "n": len(rows), "flagged": bad, "ask": ASK, "rows": rows},
              open(os.path.join(HERE, f"audit-{seed}.json"), "w"), ensure_ascii=False, indent=1)
    print(f"{bad} of {len(rows)} flagged")


if __name__ == "__main__":
    main()
