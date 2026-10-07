#!/usr/bin/env python3
"""Whisper transcripts with word and segment times for every family source recording (S02-D).

Each recording is cut at pauses into pieces of about 25 s; each piece is sent with the
previous piece's text as the prompt (Whisper drops Kutchi over long stretches otherwise).
Results are cached in build/tools/audio/cache/<source-stem>.json and never re-run:
delete a cache file to redo that source.

Usage: python3 build/tools/audio/transcribe.py [source.m4a ...]   (default: every sources/audio/**/*.m4a)
Needs OPENAI_API_KEY and ffmpeg. Cost: $0.006 a minute of audio.
"""
import glob, json, os, subprocess, sys, tempfile, time, urllib.request, uuid
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
from audiolib import SR, decode, speech_spans  # noqa: E402

CACHE = os.path.join(HERE, "cache")
PROMPT = ("A son and his mother record Kutchi answers for a family language game. "
          "He says an ID and the English, she says it in Kutchi, then he says it in Kutchi. "
          "Kutchi is written in Latin letters as it sounds.")
PIECE = 25


def cache_path(src):
    return os.path.join(CACHE, os.path.relpath(src, os.path.join(ROOT, "sources", "audio")).replace("/", "__")
                        .rsplit(".", 1)[0] + ".json")


def cut_points(spans, total):
    cuts, last = [0.0], 0.0
    for a, b in zip(spans, spans[1:]):
        mid = (a[1] + b[0]) / 2
        if mid - last >= PIECE:
            cuts.append(mid)
            last = mid
    if total - cuts[-1] < 3 and len(cuts) > 1:
        cuts.pop()
    cuts.append(total)
    return cuts


def whisper(path, prompt):
    boundary = uuid.uuid4().hex
    parts = [("model", "whisper-1"), ("response_format", "verbose_json"),
             ("timestamp_granularities[]", "word"), ("timestamp_granularities[]", "segment"), ("prompt", prompt)]
    body = b"".join(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
                    for k, v in parts)
    body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"a.mp3\"\r\n"
             "Content-Type: audio/mpeg\r\n\r\n").encode() + open(path, "rb").read() + b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    for attempt in range(5):
        try:
            req = urllib.request.Request("https://api.openai.com/v1/audio/transcriptions", data=body, headers={
                "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
                "Content-Type": f"multipart/form-data; boundary={boundary}"})
            return json.load(urllib.request.urlopen(req, timeout=300))
        except Exception as e:  # noqa: BLE001
            print("  retry", attempt, e, flush=True)
            time.sleep(5 * (attempt + 1))
    raise RuntimeError("whisper failed")


def run(src):
    out = cache_path(src)
    if os.path.exists(out):
        print("cached", out)
        return json.load(open(out))["seconds"]
    x = decode(src)
    total = len(x) / SR
    cuts = cut_points(speech_spans(x, min_gap=0.4), total)
    words, segs, context = [], [], ""
    with tempfile.TemporaryDirectory() as tmp:
        for a, b in zip(cuts, cuts[1:]):
            p = os.path.join(tmp, "p.mp3")
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src,
                            "-ac", "1", "-ar", "16000", "-b:a", "48k", p], check=True)
            r = whisper(p, (PROMPT + " " + context)[-900:])
            for w in r.get("words", []):
                words.append({"w": w["word"], "s": round(w["start"] + a, 3), "e": round(w["end"] + a, 3)})
            for s in r.get("segments", []):
                segs.append({"s": round(s["start"] + a, 3), "e": round(s["end"] + a, 3), "t": s["text"].strip()})
            context = " ".join(s["t"] for s in segs[-4:])
    os.makedirs(CACHE, exist_ok=True)
    json.dump({"source": os.path.relpath(src, ROOT), "seconds": round(total, 2), "pieces": len(cuts) - 1,
               "words": words, "segments": segs}, open(out, "w"), ensure_ascii=False, indent=0)
    print(f"{os.path.basename(src)}: {len(words)} words, {len(cuts) - 1} pieces", flush=True)
    return total


def main():
    srcs = [os.path.abspath(s) for s in sys.argv[1:]] or sorted(glob.glob(os.path.join(ROOT, "sources/audio/**/*.m4a"),
                                                                        recursive=True))
    with ThreadPoolExecutor(6) as ex:
        secs = list(ex.map(run, srcs))
    print(f"total {sum(secs) / 60:.1f} min of audio; Whisper cost about ${sum(secs) / 60 * 0.006:.2f}")


if __name__ == "__main__":
    main()
