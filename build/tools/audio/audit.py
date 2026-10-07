#!/usr/bin/env python3
"""Stage 4 of the verified re-clip (S02-D2, decision 69): a THIRD blind check on a random sample.

Picks N random kept candidates (fixed seed, so the orchestrator can rerun the same sample) and asks
gpt-audio-1.5 (three times per clip: its answers vary) only to transcribe exactly what it hears and list every word and voice. It is NEVER
told the target, the language or the speaker. Its answer is then compared with the target
(blindmatch.check) and printed for a person to read; a clip fails if it holds anything but the
target said once by one voice.

Writes build/tools/audio/audit-<seed>.json and prints a table.
Usage: python3 build/tools/audio/audit.py [--n=30] [--seed=69] [--runs=3]
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
            if not m:  # a refusal ("I can't hear any audio"): ask again
                err = "no JSON: " + t[:80]
                continue
            return json.loads(m.group(0))
        except Exception as e:  # noqa: BLE001
            err = str(e)[:120]
            time.sleep(4 * (attempt + 1))
    return {"error": err}


def judge(r, a):
    heard = str(a.get("words", "")) if "error" not in a else ""
    strength, reasons = check(heard, r["kutchi"])
    if a.get("voices") not in (None, 0, 1, "0", "1"):
        reasons.append(f"{a.get('voices')} voices")
    snd = str(a.get("other_sounds") or "").strip()
    if snd and not re.fullmatch(r"(none|no|n/?a|-|empty|nothing|silence|no other sounds?)\.?", snd, re.I):
        reasons.append(f"sounds: {snd}")
    if "error" in a:
        reasons.append("no answer")
    # Something else in the clip: another voice, a sound, or words beyond the target's length. A clip the
    # model only spells differently (Kutchi it does not know) is 'not recognised', not contaminated.
    other = any(x.endswith("voices") or x.startswith(("sounds", "longer", "target repeated", "a question id",
                                                       "laughter")) for x in reasons)
    return {"heard": heard, "voices": a.get("voices"), "other_sounds": snd, "strength": strength,
            "reasons": reasons, "other": other}


def main():
    n = int(next((a.split("=")[1] for a in sys.argv if a.startswith("--n=")), 30))
    seed = int(next((a.split("=")[1] for a in sys.argv if a.startswith("--seed=")), 69))
    runs = int(next((a.split("=")[1] for a in sys.argv if a.startswith("--runs=")), 3))
    data = json.load(open(os.path.join(ROOT, "data", "family-audio-candidates.json")))
    pool = [(r, c) for r in data["lines"] for c in r["candidates"]]
    sample = random.Random(seed).sample(pool, min(n, len(pool)))
    # gpt-audio-1.5 answers differently on the same clip, so each clip is asked `runs` times; a clip holds
    # something else when most runs say so (any single run that says so is listed too).
    jobs = [(i, rc) for i, rc in enumerate(sample) for _ in range(runs)]
    with ThreadPoolExecutor(8) as ex:
        answers = list(ex.map(lambda j: ask(os.path.join(ROOT, j[1][1]["file"])), jobs))
    per = [[] for _ in sample]
    for (i, _), a in zip(jobs, answers):
        per[i].append(judge(sample[i][0], a))
    rows, bad, anyrun = [], 0, 0
    for (r, c), js in zip(sample, per):
        votes = sum(j["other"] for j in js)
        other = votes * 2 > len(js)
        bad += other
        anyrun += votes > 0
        recog = sum(1 for j in js if not j["reasons"] and j["strength"] >= 0.5)
        rows.append({"key": r["key"], "rank": c["rank"], "file": c["file"], "target": r["kutchi"],
                     "runs": js, "other_votes": votes, "other_content": other, "recognised_runs": recog})
        print(f"{'OTHER' if other else ('other?' if votes else 'ok    ')} {r['key']:30s} r{c['rank']} "
              f"target='{r['kutchi']}' heard={[j['heard'] for j in js]} other {votes}/{len(js)} "
              f"recognised {recog}/{len(js)} {'; '.join(x for j in js for x in j['reasons'] if j['other'])}")
    json.dump({"seed": seed, "n": len(rows), "runs": runs, "other_content": bad, "other_any_run": anyrun,
               "ask": ASK, "rows": rows},
              open(os.path.join(HERE, f"audit-{seed}.json"), "w"), ensure_ascii=False, indent=1)
    print(f"{bad} of {len(rows)} hold something besides the target (most of {runs} runs); "
          f"{anyrun} flagged by at least one run")


if __name__ == "__main__":
    main()
