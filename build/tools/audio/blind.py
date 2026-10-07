#!/usr/bin/env python3
"""Stage 1-2 of the verified re-clip (S02-D2, decision 69): utterances and two BLIND transcriptions.

1. Every source is split into utterances (vad.py: Silero VAD, then split where the voice changes).
   Each utterance gets the cut window it would be offered with (lead/tail pads shortened when other
   speech is close), its speaker by pitch (calibrated per source, reclip.calibrate) and the share
   of its voiced frames that sound like the other voice.
2. Every utterance short enough to be a single word or phrase (speech <= MAX_SPEECH s) is sent, as
   exactly that cut window, to whisper-1 and to gpt-4o-transcribe with NO prompt and NO language:
   the transcribers are never told the target. Results are cached in cache/blind.json (keyed by
   source and window) and never re-run.

Writes build/tools/audio/cache/utterances.json and cache/blind.json.
Usage: python3 build/tools/audio/blind.py [--no-api]
Needs OPENAI_API_KEY. Cost: about $0.006 a minute per model.
"""
import glob, io, json, os, sys, threading, time, urllib.request, uuid, wave
from concurrent.futures import ThreadPoolExecutor

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
from audiolib import SR  # noqa: E402
from reclip import Source, calibrate  # noqa: E402
from transcribe import cache_path  # noqa: E402
from vad import utterances  # noqa: E402

CACHE = os.path.join(HERE, "cache")
UTT = os.path.join(CACHE, "utterances.json")
BLIND = os.path.join(CACHE, "blind.json")
MAX_SPEECH = 4.0
LEAD, TAIL = 0.15, 0.25
MODELS = ("whisper-1", "gpt-4o-transcribe")


def window(utts, i):
    s, e = utts[i]
    gb = s - utts[i - 1][1] if i > 0 else 9.0
    ga = utts[i + 1][0] - e if i + 1 < len(utts) else 9.0
    return min(LEAD, max(0.03, 0.6 * gb)), min(TAIL, max(0.05, 0.6 * ga)), gb, ga


def other_voice(src, s, e, spk):
    """Share of voiced frames on the other side of the source's pitch split (a second voice)."""
    f0 = src.f0[src.fr(s):src.fr(e)]
    f0 = f0[f0 > 0]
    if len(f0) < 5 or not spk:
        return 0.0
    # A margin of 8% around the split: frames close to it count for neither voice.
    if spk == "mum":
        return float(np.mean(f0 < src.split / 1.08))
    return float(np.mean(f0 > src.split * 1.08))


def build_utterances(manifest):
    from reclip import speaker_of
    out = {}
    for path in sorted(glob.glob(os.path.join(ROOT, "sources/audio/**/*.m4a"), recursive=True)):
        rel = os.path.relpath(path, ROOT)
        src = Source(path)
        calibrate(src, [e for e in manifest if e.get("source") == rel])
        vc = os.path.join(HERE, ".analysis", os.path.basename(cache_path(path)).replace(".json", ".vad.npy"))
        utts = utterances(src, vc)
        rows = []
        for i, (s, e) in enumerate(utts):
            lead, tail, gb, ga = window(utts, i)
            p, n = src.pitch(s, e)
            lvl = src.level(s, e)
            spk, conf = speaker_of(src, p, lvl)
            seg = src.db[src.fr(s):src.fr(e)]
            floor = np.percentile(src.db[max(0, src.fr(s) - 300):src.fr(e) + 300], 10)
            rows.append({"s": round(s, 3), "e": round(e, 3), "lead": round(lead, 3), "tail": round(tail, 3),
                         "gap": [round(min(gb, 9), 2), round(min(ga, 9), 2)], "spk": spk,
                         "conf": round(conf, 2), "f0": round(p, 1), "other": round(other_voice(src, s, e, spk), 2),
                         "snr": round(float(np.percentile(seg, 90) - floor) if len(seg) else 0.0, 1),
                         "clipped": src.clipped(s, e), "lvl": round(lvl, 1) if lvl is not None else None})
        out[rel] = {"split": round(src.split, 1), "cal": src.cal, "utts": rows}
        print(f"{rel}: {len(rows)} utterances, {sum(1 for r in rows if r['e'] - r['s'] <= MAX_SPEECH)} short",
              flush=True)
    json.dump(out, open(UTT, "w"), indent=0)
    return out


def key(rel, u):
    return f"{rel}@{u['s'] - u['lead']:.3f}-{u['e'] + u['tail']:.3f}"


def wav_bytes(x, a, b):
    seg = x[int(max(0, a) * SR):int(b * SR)]
    pcm = (np.clip(seg, -1, 1) * 32767).astype(np.int16)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    return buf.getvalue()


def transcribe(model, audio):
    """Blind: only the model and the audio. No prompt, no language, no target."""
    boundary = uuid.uuid4().hex
    body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"model\"\r\n\r\n{model}\r\n"
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"response_format\"\r\n\r\njson\r\n").encode()
    body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"a.wav\"\r\n"
             "Content-Type: audio/wav\r\n\r\n").encode() + audio + f"\r\n--{boundary}--\r\n".encode()
    for attempt in range(6):
        try:
            req = urllib.request.Request("https://api.openai.com/v1/audio/transcriptions", data=body, headers={
                "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
                "Content-Type": f"multipart/form-data; boundary={boundary}"})
            return json.load(urllib.request.urlopen(req, timeout=120)).get("text", "").strip()
        except urllib.error.HTTPError as e:
            msg = e.read()[:200]
            if e.code == 400:
                return f"[error 400 {msg!r}]"
            time.sleep(3 * (attempt + 1))
        except Exception:  # noqa: BLE001
            time.sleep(3 * (attempt + 1))
    return "[error]"


def run_blind(utt):
    cache = json.load(open(BLIND)) if os.path.exists(BLIND) else {}
    lock = threading.Lock()
    jobs = []
    for rel, d in utt.items():
        todo = [u for u in d["utts"] if u["e"] - u["s"] <= MAX_SPEECH
                and any(m not in cache.get(key(rel, u), {}) for m in MODELS)]
        if todo:
            x = Source.__new__(Source)
            from audiolib import decode
            x = decode(os.path.join(ROOT, rel))
            for u in todo:
                jobs.append((key(rel, u), wav_bytes(x, u["s"] - u["lead"], u["e"] + u["tail"])))
    print(f"{len(jobs)} utterances to transcribe", flush=True)
    done = [0]

    def one(job):
        k, audio = job
        have = cache.get(k, {})
        res = {m: have[m] if m in have else transcribe(m, audio) for m in MODELS}
        with lock:
            cache[k] = res
            done[0] += 1
            if done[0] % 200 == 0:
                json.dump(cache, open(BLIND, "w"), ensure_ascii=False, indent=0)
                print(f"  {done[0]}/{len(jobs)}", flush=True)
    with ThreadPoolExecutor(12) as ex:
        list(ex.map(one, jobs))
    json.dump(cache, open(BLIND, "w"), ensure_ascii=False, indent=0)
    secs = sum(len(a) / 2 / SR for _, a in jobs)
    print(f"transcribed {len(jobs)} windows, {secs / 60:.1f} min per model, about ${secs / 60 * 0.012:.2f}")


def main():
    manifest = json.load(open(os.path.join(ROOT, "data", "family-audio.json")))
    utt = json.load(open(UTT)) if os.path.exists(UTT) and "--redo-utt" not in sys.argv else build_utterances(manifest)
    if "--no-api" not in sys.argv:
        run_blind(utt)


if __name__ == "__main__":
    main()
