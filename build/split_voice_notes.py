#!/usr/bin/env python3
"""Cut a long family voice note into one clip per utterance and draft a transcript.

For the Questions for Mum recordings: Mum says a section ID ("Section C"),
then for each item the English and the Kutchi (twice), with pauses between.
This script:

1. transcribes the whole recording with OpenAI Whisper (needs OPENAI_API_KEY;
   about $0.006 a minute, so a 2.5-hour visit is about $1). Long files are sent
   in ~10-minute pieces cut at pauses. Whisper hears the whole context, which
   keeps its Kutchi spellings far better than transcribing clip by clip;
2. finds the speech by silence (an energy gate relative to the room's own
   noise floor), groups it by Whisper's utterances, and labels each utterance
   English or Kutchi from how common its words are in English;
3. writes a loudness-matched MP3 per utterance (the game's audio format,
   assets/audio/<kind>/<id>.mp3) plus one per take when an utterance holds
   several (the Kutchi said twice), and index.md / index.json.

Whisper's Kutchi spellings are rough drafts only; the family's confirmed
spelling always wins. The clip is what matters.

Usage:
  python3 build/split_voice_notes.py <recording> <out_dir> [--no-transcribe]
Needs: numpy, wordfreq, and ffmpeg on PATH (or pip install imageio-ffmpeg).
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
import uuid

import numpy as np

SR = 16000
FRAME = 0.02  # seconds
PIECE = 600  # seconds of audio per Whisper request


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("Needs ffmpeg on PATH, or: pip install imageio-ffmpeg")


def decode(ff, path):
    raw = subprocess.run([ff, "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1",
                          "-ar", str(SR), "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def speech_spans(x, min_gap=0.3, min_len=0.12):
    """Speech as (start, end) seconds, split wherever silence lasts min_gap or more."""
    n = int(FRAME * SR)
    frames = x[: len(x) // n * n].reshape(-1, n)
    db = 20 * np.log10(np.sqrt((frames ** 2).mean(axis=1)) + 1e-9)
    loud = db > max(np.percentile(db, 10) + 12, -50)
    spans, start = [], None
    for i, on in enumerate(loud):
        if on and start is None:
            start = i
        elif not on and start is not None:
            spans.append([start, i])
            start = None
    if start is not None:
        spans.append([start, len(loud)])
    merged = []
    for s in spans:
        if merged and (s[0] - merged[-1][1]) * FRAME < min_gap:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    return [(s * FRAME, e * FRAME) for s, e in merged if (e - s) * FRAME >= min_len]


def write_clip(ff, src, start, end, out):
    subprocess.run([ff, "-loglevel", "error", "-y", "-ss", f"{start:.3f}", "-to", f"{end:.3f}",
                    "-i", src, "-ac", "1", "-ar", "44100",
                    "-af", "highpass=f=70,loudnorm=I=-18:TP=-2:LRA=11", "-b:a", "96k", out], check=True)


def whisper(path, prompt):
    boundary = uuid.uuid4().hex
    parts = [("model", "whisper-1"), ("response_format", "verbose_json"),
             ("timestamp_granularities[]", "segment"), ("prompt", prompt)]
    body = b"".join(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
                    for k, v in parts)
    body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"a.mp3\"\r\n"
             "Content-Type: audio/mpeg\r\n\r\n").encode() + open(path, "rb").read() + b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    req = urllib.request.Request("https://api.openai.com/v1/audio/transcriptions", data=body, headers={
        "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
        "Content-Type": f"multipart/form-data; boundary={boundary}"})
    return json.load(urllib.request.urlopen(req, timeout=600)).get("segments", [])


def transcribe(ff, src, total, spans):
    """Whisper segments for the whole file, in ~PIECE-second requests cut in pauses."""
    cuts, t = [0.0], 0.0
    while total - t > PIECE:
        # The widest pause in the last minute before the limit.
        gaps = [(b[0] - a[1], (a[1] + b[0]) / 2) for a, b in zip(spans, spans[1:])
                if t + PIECE - 60 < (a[1] + b[0]) / 2 < t + PIECE]
        t = max(gaps)[1] if gaps else t + PIECE
        cuts.append(t)
    cuts.append(total)
    segs, prompt = [], "Kutchi and English words for a family language game."
    with tempfile.TemporaryDirectory() as tmp:
        for a, b in zip(cuts, cuts[1:]):
            piece = os.path.join(tmp, "piece.mp3")
            subprocess.run([ff, "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src,
                            "-ac", "1", "-ar", "16000", "-b:a", "48k", piece], check=True)
            for s in whisper(piece, prompt):
                segs.append({"start": s["start"] + a, "end": s["end"] + a, "text": s["text"].strip()})
            prompt = " ".join(s["text"] for s in segs[-8:])[-800:]
    return segs


def language(text):
    from wordfreq import zipf_frequency
    words = re.findall(r"[^\W_]+", text.lower())
    if not words:
        return "?"
    if not text.isascii():
        return "kutchi"
    score = np.mean([7 if w.isdigit() else zipf_frequency(w, "en") for w in words])
    return "english" if score >= 3.5 else "kutchi"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("recording")
    ap.add_argument("out_dir")
    ap.add_argument("--no-transcribe", action="store_true")
    ap.add_argument("--pad", type=float, default=0.12, help="silence (s) kept either side of a clip")
    a = ap.parse_args()

    ff = ffmpeg_exe()
    x = decode(ff, a.recording)
    total = len(x) / SR
    spans = speech_spans(x)
    os.makedirs(a.out_dir, exist_ok=True)

    if a.no_transcribe or not os.environ.get("OPENAI_API_KEY"):
        groups = [{"start": s, "end": e, "text": "", "takes": [(s, e)]} for s, e in spans]
    else:
        groups = []
        for seg in transcribe(ff, a.recording, total, spans):
            takes = [(s, e) for s, e in spans if min(e, seg["end"]) - max(s, seg["start"]) > 0.05]
            # A knock or a mic bump: a very short burst with a clear gap before the words.
            takes = [t for k, t in enumerate(takes) if t[1] - t[0] >= 0.3 or any(
                abs(o[0] - t[1]) < 0.4 or abs(t[0] - o[1]) < 0.4 for o in takes[:k] + takes[k + 1:])]
            if not takes:
                continue
            groups.append({"start": takes[0][0], "end": takes[-1][1], "text": seg["text"], "takes": takes})

    rows = []
    for i, g in enumerate(groups, 1):
        name = f"{i:04d}.mp3"
        write_clip(ff, a.recording, max(0, g["start"] - a.pad), min(total, g["end"] + a.pad),
                   os.path.join(a.out_dir, name))
        take_files = []
        if len(g["takes"]) > 1:
            for j, (s, e) in enumerate(g["takes"]):
                tname = f"{i:04d}{'abcdefghij'[j]}.mp3"
                write_clip(ff, a.recording, max(0, s - a.pad), min(total, e + a.pad), os.path.join(a.out_dir, tname))
                take_files.append(tname)
        lang = language(g["text"]) if g["text"] else ""
        rows.append({"n": i, "start": round(g["start"], 2), "end": round(g["end"], 2), "language": lang,
                     "text": g["text"], "file": name, "takes": take_files})
        print(f"{i:4d} {g['start']:7.2f}-{g['end']:7.2f} {lang:8s} {g['text']}  {' '.join(take_files)}")

    json.dump(rows, open(os.path.join(a.out_dir, "index.json"), "w"), indent=1, ensure_ascii=False)
    with open(os.path.join(a.out_dir, "index.md"), "w") as f:
        f.write(f"# Clips from {os.path.basename(a.recording)}\n\n")
        f.write("| # | Time | Language | Draft transcript | File | Takes |\n|---|---|---|---|---|---|\n")
        for r in rows:
            f.write(f"| {r['n']} | {r['start']:.1f}–{r['end']:.1f} s | {r['language']} | {r['text']} | "
                    f"{r['file']} | {' '.join(r['takes'])} |\n")
    print(f"{len(rows)} utterances -> {a.out_dir}")


if __name__ == "__main__":
    main()
